import { useSyncExternalStore } from "react";

function inscrever(notificar: () => void) {
  window.addEventListener("scroll", notificar, { passive: true });
  return () => window.removeEventListener("scroll", notificar);
}

function lerServidor() {
  return false;
}

/**
 * true assim que `window.scrollY` ultrapassa `limite` — usado pelo header
 * (fica sólido ao sair do topo) e pelo botão flutuante de WhatsApp (só
 * aparece depois de rolar), que tinham essa mesma lógica duplicada.
 */
export function useRolagemPassou(limite: number): boolean {
  return useSyncExternalStore(
    inscrever,
    () => window.scrollY > limite,
    lerServidor,
  );
}
