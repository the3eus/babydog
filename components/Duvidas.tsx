import { duvidas } from "@/lib/content";
import { IconeChevron } from "./icons";

/**
 * Última barreira antes da conversão. Cada pergunta corresponde a uma objeção
 * real de quem procura veterinário em Jundiaí.
 *
 * Usa <details>/<summary> nativos: acessível por teclado e leitor de tela,
 * funciona sem nenhum JavaScript e não pesa no carregamento.
 */
export function Duvidas() {
  return (
    <section id="duvidas" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {duvidas.sobrelinha}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {duvidas.titulo}
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {duvidas.itens.map((item) => (
            <details
              key={item.pergunta}
              name="duvidas"
              className="group rounded-2xl bg-surface-alt ring-1 ring-brand/8 transition-colors open:bg-brand-tint open:ring-brand/15"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <IconeChevron className="size-5 shrink-0 text-brand transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-6 leading-relaxed text-ink-soft">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
