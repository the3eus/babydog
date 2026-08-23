"use client";

import { linkWhatsApp } from "@/lib/content";
import { rastrear } from "@/lib/track";
import { useRolagemPassou } from "@/lib/use-scroll-passed";
import { IconeWhatsApp } from "./icons";

/**
 * Botão persistente de WhatsApp.
 *
 * Usa o verde oficial do WhatsApp de propósito: é um elemento fixo, fora do
 * fluxo do layout, e o reconhecimento imediato vale mais aqui do que a
 * coerência cromática com a marca.
 *
 * Só aparece depois que o visitante sai do topo, para não competir com a CTA
 * principal do hero.
 */
export function WhatsAppFlutuante() {
  const visivel = useRolagemPassou(500);

  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => rastrear("clique_whatsapp", { origem: "botao_flutuante" })}
      aria-label="Falar com a Baby Dog no WhatsApp"
      className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-whatsapp py-3.5 pl-4 pr-5 font-bold text-[#04372a] shadow-xl shadow-black/25 transition-all duration-300 hover:bg-[#1fbe5c] ${
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <IconeWhatsApp className="size-7 shrink-0" />
      <span className="hidden sm:inline">Falar no WhatsApp</span>
    </a>
  );
}
