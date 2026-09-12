import { comoFunciona } from "@/lib/content";
import { BotaoWhatsApp } from "./CTA";

/**
 * Redução de fricção: mostra que procurar atendimento é simples e que
 * ninguém precisa "estar preparado" para dar o primeiro passo.
 * Termina com a CTA, aproveitando o momento de menor resistência.
 */
export function ComoFunciona() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {comoFunciona.sobrelinha}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {comoFunciona.titulo}
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {comoFunciona.passos.map((passo, indice) => (
            <li
              key={passo.titulo}
              className="relative rounded-3xl bg-surface-alt p-7 ring-1 ring-brand/8"
            >
              <span
                aria-hidden="true"
                className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand text-xl font-extrabold text-white shadow-lg shadow-brand/20"
              >
                {indice + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                {passo.titulo}
              </h3>
              <p className="mt-2.5 leading-relaxed text-ink-soft">
                {passo.descricao}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <BotaoWhatsApp
            origem="como_funciona"
            rotulo="Começar pelo WhatsApp"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
