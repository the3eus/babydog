import { diferenciais, diferenciaisSecao } from "@/lib/content";
import { iconesDiferencial } from "./icons";

/**
 * Redução de objeção. Cada item responde a um "e se..." que passa pela cabeça
 * de quem está decidindo para onde levar o animal.
 *
 * Sem comparação com concorrentes, conforme exigência do CRMV.
 */
export function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="scroll-mt-24 overflow-hidden bg-brand py-20 text-white lg:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* Brilho decorativo ao fundo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/20 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-soft">
            {diferenciaisSecao.sobrelinha}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {diferenciaisSecao.titulo}
          </h2>
        </div>

        <ul className="relative mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {diferenciais.map((item) => {
            const Icone = iconesDiferencial[item.icone];
            return (
              <li key={item.titulo} className="flex gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-accent-soft ring-1 ring-white/15">
                  <Icone className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold leading-snug tracking-tight">
                    {item.titulo}
                  </h3>
                  <p className="mt-1.5 max-w-md leading-relaxed text-white/85">
                    {item.descricao}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
