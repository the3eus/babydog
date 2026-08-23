/**
 * Ícones em SVG inline.
 * Sem biblioteca externa: menos JavaScript, menos requisições e melhor LCP.
 * Todos herdam a cor do texto (currentColor) e o tamanho vem via className.
 */

type IconeProps = {
  className?: string;
};

const traco = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Base({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Contato e redes                                                            */
/* -------------------------------------------------------------------------- */

export function IconeWhatsApp({ className }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 5.82 2.42 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.19-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function IconeTelefone({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path
        {...traco}
        d="M6.3 3.5h-.9A2.4 2.4 0 0 0 3 5.9c0 8.3 6.8 15.1 15.1 15.1a2.4 2.4 0 0 0 2.4-2.4v-.9a1.2 1.2 0 0 0-.9-1.16l-3.2-.8a1.2 1.2 0 0 0-1.24.45l-.75 1a12.4 12.4 0 0 1-5.53-5.53l1-.75a1.2 1.2 0 0 0 .45-1.24l-.8-3.2a1.2 1.2 0 0 0-1.16-.9Z"
      />
    </Base>
  );
}

export function IconeInstagram({ className }: IconeProps) {
  return (
    <Base className={className}>
      <rect {...traco} x="3" y="3" width="18" height="18" rx="5" />
      <circle {...traco} cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </Base>
  );
}

export function IconeFacebook({ className }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Interface                                                                  */
/* -------------------------------------------------------------------------- */

export function IconeMenu({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function IconeFechar({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="m6 6 12 12M18 6 6 18" />
    </Base>
  );
}

export function IconeSeta({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="M12 5v14m0 0-6-6m6 6 6-6" />
    </Base>
  );
}

export function IconeChevron({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="m6 9 6 6 6-6" />
    </Base>
  );
}

export function IconeCheck({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="m5 12.5 4.5 4.5L19 7" />
    </Base>
  );
}

export function IconeLocal({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path
        {...traco}
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
      />
      <circle {...traco} cx="12" cy="10" r="2.6" />
    </Base>
  );
}

/** Logo simplificado do Waze, em traço, para o botão de rota. */
export function IconeWaze({ className }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.5c4.4 0 7.6 2.9 7.6 6.7 0 1-.2 1.8-.5 2.6-.3.8-.2 1.6.3 2.2.4.5.3 1.3-.3 1.6-1.3.7-3 .2-3.9-1a10 10 0 0 1-6.9-.3c-.9 1-2.4 1.4-3.6.8-.6-.3-.7-1.1-.3-1.6.5-.6.6-1.4.3-2.2a6 6 0 0 1-.3-2.1c0-3.8 3.2-6.7 7.6-6.7Z" />
      <path d="M7 20.2a1.5 1.5 0 1 0 2.6-1.5M14.4 18.7a1.5 1.5 0 1 0 2.6 1.5" />
      <path d="M9.6 9.8h.01M14.4 9.8h.01" />
    </svg>
  );
}

export function IconeEstrela({ className }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 3.5 2.6 5.28 5.83.85-4.22 4.11 1 5.8L12 16.8l-5.21 2.74 1-5.8-4.22-4.11 5.83-.85L12 3.5Z" />
    </svg>
  );
}

/** Pata — motivo visual da marca, usado como elemento decorativo. */
export function IconePata({ className }: IconeProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="7" cy="8.2" rx="2.15" ry="2.75" />
      <ellipse cx="12" cy="6.4" rx="2.15" ry="2.9" />
      <ellipse cx="17" cy="8.2" rx="2.15" ry="2.75" />
      <path d="M12 12.2c2.9 0 5.2 2.05 5.2 4.35 0 1.85-1.5 3.05-3.5 3.05-.85 0-1.25-.3-1.7-.3s-.85.3-1.7.3c-2 0-3.5-1.2-3.5-3.05 0-2.3 2.3-4.35 5.2-4.35Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Atendimentos                                                               */
/* -------------------------------------------------------------------------- */

function IconeEstetoscopio({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path
        {...traco}
        d="M6 3v5a4 4 0 0 0 8 0V3M4.5 3H6m6.5 0H14"
      />
      <path {...traco} d="M10 12v2.5a5.5 5.5 0 0 0 11 0V13" />
      <circle {...traco} cx="21" cy="11" r="2" />
    </Base>
  );
}

function IconeEspecialista({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle {...traco} cx="12" cy="7.5" r="3.5" />
      <path {...traco} d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
      <path {...traco} d="M12 13.5v3m-1.5-1.5h3" />
    </Base>
  );
}

function IconeExame({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path
        {...traco}
        d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
      />
      <path {...traco} d="M14 3v5h5" />
      <path {...traco} d="M8.5 15.5h1.75l1-2.5 1.5 4 1.25-3 .75 1.5h1.75" />
    </Base>
  );
}

function IconeCirurgia({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="M4 4.5 13 13.5M9.5 10 5 14.5a2.5 2.5 0 1 0 3.5 3.5L13 13.5" />
      <path {...traco} d="M20 4.5 15.5 9M17 12.5l3 3a2.5 2.5 0 0 1-3.5 3.5l-3-3" />
    </Base>
  );
}

function IconeInternacao({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="M3 18v-7.5a1.5 1.5 0 0 1 1.5-1.5H21v9M3 14h18M3 18v2m18-2v2" />
      <circle {...traco} cx="7.5" cy="11.5" r="1.5" />
    </Base>
  );
}

function IconeFarmacia({ className }: IconeProps) {
  return (
    <Base className={className}>
      <rect {...traco} x="8.5" y="2.5" width="7" height="4" rx="1" />
      <path
        {...traco}
        d="M6.5 8.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-11Z"
      />
      <path {...traco} d="M12 11.5v6m-3-3h6" />
    </Base>
  );
}

/** Ave — representa o atendimento a animais silvestres. */
function IconeSilvestre({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle {...traco} cx="14" cy="8" r="3" />
      <path {...traco} d="M17 7.5 20 6.5l-1.5 2.5" />
      <circle cx="15.2" cy="7" r="0.7" fill="currentColor" stroke="none" />
      <path {...traco} d="M12 10.5c-2 1-6 2-8 1.5 1.5 1.5 4 2 6 1.5" />
      <path {...traco} d="M11.5 13c-1 3-.5 6.5 2 8.5" />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */
/* Diferenciais                                                               */
/* -------------------------------------------------------------------------- */

export function IconeRelogio({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle {...traco} cx="12" cy="12" r="9" />
      <path {...traco} d="M12 7v5.25l3.25 2" />
    </Base>
  );
}

function IconeEquipe({ className }: IconeProps) {
  return (
    <Base className={className}>
      <circle {...traco} cx="9" cy="8" r="3.2" />
      <path {...traco} d="M3 19.5a6 6 0 0 1 12 0" />
      <path {...traco} d="M16 5.2a3.2 3.2 0 0 1 0 5.9" />
      <path {...traco} d="M17.5 14.2a6 6 0 0 1 3.5 5.3" />
    </Base>
  );
}

function IconePredio({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path {...traco} d="M3.5 21h17M5 21V6.5L12 3l7 3.5V21" />
      <path {...traco} d="M12 9v5m-2.5-2.5h5" />
      <path {...traco} d="M9.5 21v-4h5v4" />
    </Base>
  );
}

function IconePlano({ className }: IconeProps) {
  return (
    <Base className={className}>
      <path
        {...traco}
        d="M12 21s-7.5-4.35-7.5-9.75a4.25 4.25 0 0 1 7.5-2.75 4.25 4.25 0 0 1 7.5 2.75C19.5 16.65 12 21 12 21Z"
      />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */
/* Mapas de ícones usados pelas seções                                        */
/* -------------------------------------------------------------------------- */

export const iconesAtendimento = {
  estetoscopio: IconeEstetoscopio,
  especialista: IconeEspecialista,
  exame: IconeExame,
  cirurgia: IconeCirurgia,
  internacao: IconeInternacao,
  farmacia: IconeFarmacia,
  silvestre: IconeSilvestre,
};

export const iconesDiferencial = {
  relogio: IconeRelogio,
  equipe: IconeEquipe,
  predio: IconePredio,
  plano: IconePlano,
};
