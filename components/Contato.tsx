"use client";

import { useState, type FormEvent } from "react";
import { clinica, contato, linkTelefone, linkWhatsApp } from "@/lib/content";
import { rastrear } from "@/lib/track";
import { IconeCheck, IconeLocal, IconeTelefone, IconeWhatsApp } from "./icons";

type Estado = "parado" | "sucesso" | "erro";

/** Formata o telefone enquanto o tutor digita: (11) 91234-5678 */
function formatarTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

// min/max espelham os mesmos limites de `app/api/contato/route.ts` — sem
// isso, uma mensagem longa passava na validação do cliente (abria o
// WhatsApp normalmente), mas o envio em segundo plano pro backend era
// rejeitado pelo servidor sem nenhum aviso.
function textoValido(
  valor: FormDataEntryValue | null,
  min: number,
  max: number,
): boolean {
  if (typeof valor !== "string") return false;
  const tamanho = valor.trim().length;
  return tamanho >= min && tamanho <= max;
}

/** Monta a mensagem pré-preenchida a partir dos dados do formulário. */
function montarMensagemWhatsApp(dados: {
  nome: string;
  telefone: string;
  pet?: string;
  mensagem: string;
}): string {
  const linhas = [
    "Olá! Vim pelo site da Baby Dog e gostaria de falar sobre o atendimento do meu pet.",
    "",
    `Nome: ${dados.nome}`,
    `Telefone: ${dados.telefone}`,
  ];
  if (dados.pet) linhas.push(`Pet: ${dados.pet}`);
  linhas.push("", dados.mensagem);
  return linhas.join("\n");
}

export function Contato() {
  const [telefone, setTelefone] = useState("");
  const [estado, setEstado] = useState<Estado>("parado");

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const dados = new FormData(form);

    // Honeypot: bots preenchem campos escondidos, humanos não.
    if (dados.get("website")) return;

    const nome = dados.get("nome");
    const tel = dados.get("telefone");
    const mensagem = dados.get("mensagem");

    if (
      !textoValido(nome, 2, 120) ||
      !textoValido(tel, 8, 24) ||
      !textoValido(mensagem, 3, 2000) ||
      !dados.get("consentimento")
    ) {
      setEstado("erro");
      return;
    }

    const pet = dados.get("pet");

    // Precisa acontecer de forma síncrona, ainda dentro do clique — se
    // esperar uma resposta de rede antes, o navegador bloqueia o pop-up.
    window.open(
      linkWhatsApp(
        montarMensagemWhatsApp({
          nome: String(nome).trim(),
          telefone: String(tel).trim(),
          pet: textoValido(pet, 1, 80) ? String(pet).trim() : undefined,
          mensagem: String(mensagem).trim(),
        }),
      ),
      "_blank",
      "noopener,noreferrer",
    );

    rastrear("envio_formulario", { origem: "secao_contato" });
    setEstado("sucesso");
    form.reset();
    setTelefone("");

    // Melhor-esforço: se um webhook ou e-mail estiver configurado (ver
    // .env.example), o lead também fica registrado lá. Não bloqueia nem
    // afeta a experiência do tutor — o WhatsApp já é o canal garantido.
    fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(dados)),
    }).catch(() => {});
  }

  return (
    <section
      id="contato"
      className="scroll-mt-24 overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-darker py-20 text-white lg:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          {/* ------------------------------------------------------------ */}
          {/* Canais diretos — a via rápida                                */}
          {/* ------------------------------------------------------------ */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-soft">
              {contato.sobrelinha}
            </p>
            <h2 className="font-oswald mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {contato.titulo}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              {contato.subtitulo}
            </p>

            <div className="mt-9 flex flex-col gap-3.5">
              <a
                href={linkTelefone}
                onClick={() =>
                  rastrear("clique_telefone", { origem: "secao_contato" })
                }
                className="flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-5 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                <IconeTelefone className="size-8 shrink-0 text-accent-soft" />
                <span className="leading-tight">
                  <span className="block text-lg font-bold">
                    {clinica.telefone.nome}
                  </span>
                  <span className="block text-sm text-white/85">
                    {clinica.telefone.exibicao} · a qualquer hora, inclusive de
                    madrugada
                  </span>
                </span>
              </a>

              {/*
                Linha da internação. Fica abaixo das duas ações principais de
                propósito: serve a quem já tem um pet internado e quer notícia,
                não a quem está chegando agora. Tirar essa dúvida rápido é o
                que mais gera confiança nesse momento.
              */}
              <a
                href={`tel:${clinica.telefoneInternacao.e164}`}
                onClick={() =>
                  rastrear("clique_telefone", { origem: "internacao" })
                }
                className="flex items-center gap-4 rounded-2xl px-6 py-5 ring-1 ring-white/12 transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <IconeTelefone className="size-8 shrink-0 text-accent-soft" />
                <span className="leading-tight">
                  <span className="block text-lg font-bold">
                    {clinica.telefoneInternacao.nome}
                  </span>
                  <span className="block text-sm text-white/85">
                    {clinica.telefoneInternacao.exibicao} · notícias do seu pet
                    internado
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4 rounded-2xl px-6 py-5 ring-1 ring-white/12">
                <IconeLocal className="size-8 shrink-0 text-accent-soft" />
                <span className="leading-snug">
                  <span className="block font-bold">
                    {clinica.endereco.logradouro}, {clinica.endereco.numero}
                  </span>
                  <span className="block text-sm text-white/85">
                    {clinica.endereco.bairro} — {clinica.endereco.cidade}/
                    {clinica.endereco.uf} · {clinica.horario}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Formulário — terceira via, para quem prefere digitar antes   */}
          {/* de conversar. Ao enviar, abre o WhatsApp da recepção já com  */}
          {/* a mensagem pronta (ver `enviar` acima).                     */}
          {/* ------------------------------------------------------------ */}
          <div className="rounded-4xl bg-white p-7 text-ink shadow-2xl shadow-black/25 sm:p-8">
            {estado === "sucesso" ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent-light text-accent-dark">
                  <IconeCheck className="size-9" />
                </span>
                <p className="mt-5 text-lg font-semibold leading-relaxed text-ink">
                  {contato.formulario.sucesso}
                </p>
                <a
                  href={linkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    rastrear("clique_whatsapp", { origem: "pos_formulario" })
                  }
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-brand underline underline-offset-4"
                >
                  <IconeWhatsApp className="size-5" />
                  Não abriu sozinho? Toque aqui
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold tracking-tight">
                  {contato.formulario.titulo}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                  {contato.formulario.descricao}
                </p>

                <form onSubmit={enviar} className="mt-6 space-y-4" noValidate>
                  {/* Honeypot — invisível para pessoas, atrativo para robôs */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] size-0"
                  />

                  <Campo
                    id="nome"
                    nome="nome"
                    rotulo="Seu nome"
                    autoComplete="name"
                    obrigatorio
                  />

                  <Campo
                    id="telefone"
                    nome="telefone"
                    rotulo="Telefone com WhatsApp"
                    tipo="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(11) 91234-5678"
                    valor={telefone}
                    aoMudar={(v) => setTelefone(formatarTelefone(v))}
                    obrigatorio
                  />

                  <Campo
                    id="pet"
                    nome="pet"
                    rotulo="Nome do seu pet"
                    opcional
                  />

                  <div>
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-semibold text-ink"
                    >
                      Como podemos ajudar?
                    </label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={3}
                      required
                      className="mt-1.5 w-full resize-y rounded-2xl bg-surface-alt px-4 py-3 text-ink ring-1 ring-brand/12 transition-shadow placeholder:text-ink-soft/50 focus:ring-2 focus:ring-brand"
                      placeholder="Conte rapidamente o que está acontecendo com seu pet."
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
                    <input
                      type="checkbox"
                      name="consentimento"
                      required
                      className="mt-0.5 size-6 shrink-0 rounded accent-brand"
                    />
                    {contato.formulario.consentimento}
                  </label>

                  {estado === "erro" && (
                    <p
                      role="alert"
                      className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200"
                    >
                      {contato.formulario.erro}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-brand px-7 font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark"
                  >
                    <IconeWhatsApp className="size-5 shrink-0" />
                    {contato.formulario.enviar}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Campo({
  id,
  nome,
  rotulo,
  tipo = "text",
  autoComplete,
  inputMode,
  placeholder,
  valor,
  aoMudar,
  obrigatorio = false,
  opcional = false,
}: {
  id: string;
  nome: string;
  rotulo: string;
  tipo?: string;
  autoComplete?: string;
  inputMode?: "tel" | "text" | "email";
  placeholder?: string;
  valor?: string;
  aoMudar?: (valor: string) => void;
  obrigatorio?: boolean;
  opcional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {rotulo}
        {opcional && (
          <span className="font-normal text-ink-soft"> (opcional)</span>
        )}
      </label>
      <input
        id={id}
        name={nome}
        type={tipo}
        required={obrigatorio}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        value={valor}
        onChange={aoMudar ? (e) => aoMudar(e.target.value) : undefined}
        className="mt-1.5 min-h-[3rem] w-full rounded-2xl bg-surface-alt px-4 py-3 text-ink ring-1 ring-brand/12 transition-shadow placeholder:text-ink-soft/50 focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
