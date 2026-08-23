"use client";

import { linkTelefone, linkWhatsApp, clinica } from "@/lib/content";
import { rastrear } from "@/lib/track";
import { IconeTelefone, IconeWhatsApp } from "./icons";

/**
 * Botões de conversão.
 *
 * Hierarquia visual proposital: o WhatsApp é sempre a ação dominante,
 * a ligação vem como alternativa visível e o formulário fica como terceira via.
 * Todos são âncoras de verdade (<a href>), então funcionam sem JavaScript
 * e são lidos corretamente por leitores de tela.
 */

type Variante = "primario" | "claro" | "whatsapp";

const bases =
  "inline-flex items-center justify-center gap-2.5 rounded-full px-7 min-h-[3.25rem] " +
  "font-semibold tracking-tight transition-all duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0";

const variantes: Record<Variante, string> = {
  // Ação dominante — azul petróleo da marca, o elemento mais forte da tela
  primario:
    "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30",
  // Ação secundária — sobre fundos claros
  claro:
    "bg-white text-brand ring-2 ring-brand/15 shadow-md hover:ring-brand/35 hover:shadow-lg",
  // Verde oficial do WhatsApp — usado sobre fundos escuros, onde o azul perderia força
  whatsapp:
    "bg-whatsapp text-[#04372a] shadow-lg shadow-black/20 hover:bg-[#1fbe5c] hover:shadow-xl",
};

export function BotaoWhatsApp({
  variante = "primario",
  rotulo = "Falar no WhatsApp",
  mensagem,
  origem,
  className = "",
}: {
  variante?: Variante;
  rotulo?: string;
  mensagem?: string;
  /** Identifica de qual seção partiu o clique, para análise de conversão. */
  origem: string;
  className?: string;
}) {
  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => rastrear("clique_whatsapp", { origem })}
      className={`${bases} ${variantes[variante]} ${className}`}
    >
      <IconeWhatsApp className="size-5 shrink-0" />
      {rotulo}
    </a>
  );
}

export function BotaoTelefone({
  variante = "claro",
  rotulo = "Ligar agora",
  origem,
  className = "",
}: {
  variante?: Variante;
  rotulo?: string;
  origem: string;
  className?: string;
}) {
  return (
    <a
      href={linkTelefone}
      onClick={() => rastrear("clique_telefone", { origem })}
      className={`${bases} ${variantes[variante]} ${className}`}
    >
      <IconeTelefone className="size-5 shrink-0" />
      <span>
        {rotulo}
        <span className="sr-only"> — {clinica.telefone.exibicao}</span>
      </span>
    </a>
  );
}
