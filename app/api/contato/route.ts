import { NextResponse } from "next/server";
import { clinica } from "@/lib/content";

/**
 * Registro opcional dos leads do formulário de contato.
 *
 * O canal garantido é o WhatsApp: `components/Contato.tsx` já abre o
 * WhatsApp da recepção com a mensagem pronta antes de chamar esta rota, então
 * nenhum tutor depende dela para o contato acontecer. Esta chamada é
 * melhor-esforço, disparada em paralelo, só para também registrar o lead em
 * um destino da clínica, escolhido por variável de ambiente:
 *
 *   1. CONTACT_WEBHOOK_URL — envia o lead para um webhook (n8n, Make, Zapier).
 *   2. RESEND_API_KEY + CONTACT_EMAIL — envia o lead por e-mail via Resend.
 *
 * Enquanto nenhum estiver configurado, a rota só responde com erro — o que é
 * inofensivo, já que o formulário não espera nem verifica essa resposta.
 *
 * Veja .env.example.
 */

type Lead = {
  nome: string;
  telefone: string;
  pet?: string;
  mensagem: string;
};

function textoValido(valor: unknown, min: number, max: number): valor is string {
  return typeof valor === "string" && valor.trim().length >= min && valor.length <= max;
}

export async function POST(requisicao: Request) {
  let corpo: Record<string, unknown>;

  try {
    corpo = await requisicao.json();
  } catch {
    return NextResponse.json({ erro: "Corpo inválido" }, { status: 400 });
  }

  // Honeypot: se veio preenchido, é robô. Responde 200 para não dar pistas.
  if (corpo.website) {
    return NextResponse.json({ ok: true });
  }

  if (
    !textoValido(corpo.nome, 2, 120) ||
    !textoValido(corpo.telefone, 8, 24) ||
    !textoValido(corpo.mensagem, 3, 2000)
  ) {
    return NextResponse.json(
      { erro: "Preencha nome, telefone e mensagem." },
      { status: 400 },
    );
  }

  if (!corpo.consentimento) {
    return NextResponse.json(
      { erro: "É necessário autorizar o contato." },
      { status: 400 },
    );
  }

  const lead: Lead = {
    nome: corpo.nome.trim(),
    telefone: corpo.telefone.trim(),
    pet: textoValido(corpo.pet, 1, 80) ? corpo.pet.trim() : undefined,
    mensagem: corpo.mensagem.trim(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const chaveResend = process.env.RESEND_API_KEY;
  const emailDestino = process.env.CONTACT_EMAIL;

  try {
    if (webhook) {
      const resposta = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          origem: "site",
          recebidoEm: new Date().toISOString(),
        }),
      });

      if (!resposta.ok) throw new Error(`Webhook respondeu ${resposta.status}`);
      return NextResponse.json({ ok: true });
    }

    if (chaveResend && emailDestino) {
      const resposta = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${chaveResend}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM ?? "Site Baby Dog <onboarding@resend.dev>",
          to: [emailDestino],
          subject: `Novo contato pelo site — ${lead.nome}`,
          text: [
            `Nome: ${lead.nome}`,
            `Telefone: ${lead.telefone}`,
            lead.pet ? `Pet: ${lead.pet}` : null,
            "",
            lead.mensagem,
            "",
            `Enviado pelo site ${clinica.site}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });

      if (!resposta.ok) throw new Error(`Resend respondeu ${resposta.status}`);
      return NextResponse.json({ ok: true });
    }

    console.error(
      "[contato] Nenhum destino configurado. Defina CONTACT_WEBHOOK_URL ou RESEND_API_KEY + CONTACT_EMAIL.",
    );
    return NextResponse.json(
      { erro: "Canal de contato não configurado." },
      { status: 503 },
    );
  } catch (erro) {
    console.error("[contato] Falha ao encaminhar lead:", erro);
    return NextResponse.json(
      { erro: "Não foi possível enviar agora." },
      { status: 502 },
    );
  }
}
