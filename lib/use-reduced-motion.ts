import { useSyncExternalStore } from "react";

const consultaMenosMovimento = "(prefers-reduced-motion: reduce)";

function inscrever(notificar: () => void) {
  const mq = window.matchMedia(consultaMenosMovimento);
  mq.addEventListener("change", notificar);
  return () => mq.removeEventListener("change", notificar);
}

function ler() {
  return window.matchMedia(consultaMenosMovimento).matches;
}

/** No servidor, sem `window`: assume que o movimento é permitido. */
function lerServidor() {
  return false;
}

/**
 * Lê `prefers-reduced-motion` de forma reativa (atualiza se o usuário mudar
 * a preferência do sistema em tempo real) e segura para SSR. Usado em toda
 * animação que começa sozinha — vídeo de fundo da Hero, autoplay de
 * carrossel — para nunca mover a tela sem que a pessoa tenha pedido.
 */
export function usePrefereMenosMovimento(): boolean {
  return useSyncExternalStore(inscrever, ler, lerServidor);
}
