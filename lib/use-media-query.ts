import { useSyncExternalStore } from "react";

function inscrever(consulta: string) {
  return (notificar: () => void) => {
    const mq = window.matchMedia(consulta);
    mq.addEventListener("change", notificar);
    return () => mq.removeEventListener("change", notificar);
  };
}

/**
 * Lê uma media query de forma reativa (atualiza se a tela mudar de tamanho
 * ou girar) e segura para SSR — assume `false` no servidor, como
 * `usePrefereMenosMovimento`.
 */
export function useMediaQuery(consulta: string): boolean {
  return useSyncExternalStore(
    inscrever(consulta),
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}
