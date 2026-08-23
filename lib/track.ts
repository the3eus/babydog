/**
 * Disparo de eventos de conversão.
 *
 * Funciona com GA4 (gtag), Google Tag Manager (dataLayer) e Meta Pixel (fbq).
 * Se nenhuma dessas ferramentas estiver instalada, as chamadas simplesmente
 * não fazem nada — nenhum erro é lançado e nada quebra na página.
 *
 * Para ativar, informe os IDs no arquivo .env.local (veja .env.example).
 */

type Evento =
  | "clique_whatsapp"
  | "clique_telefone"
  | "envio_formulario"
  | "clique_mapa"
  | "clique_waze"
  | "clique_rede_social"
  | "clique_avaliacoes_google";

type Detalhes = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Eventos que representam uma conversão de fato (lead gerado). */
const conversoes: Evento[] = [
  "clique_whatsapp",
  "clique_telefone",
  "envio_formulario",
];

export function rastrear(evento: Evento, detalhes: Detalhes = {}): void {
  if (typeof window === "undefined") return;

  // Google Tag Manager
  window.dataLayer?.push({ event: evento, ...detalhes });

  // GA4 direto
  window.gtag?.("event", evento, detalhes);

  // Meta Pixel — eventos de lead entram como "Lead", o resto como customizado
  if (window.fbq) {
    if (conversoes.includes(evento)) {
      window.fbq("track", "Lead", { origem: evento, ...detalhes });
    } else {
      window.fbq("trackCustom", evento, detalhes);
    }
  }
}
