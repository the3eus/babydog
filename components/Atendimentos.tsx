import { atendimentos, atendimentosSecao } from "@/lib/content";
import { Carrossel } from "./Carrossel";
import { iconesAtendimento } from "./icons";

/**
 * Carrossel de serviços. Função: o visitante encontra rapidamente a
 * necessidade dele na tela e entende que ela é resolvida aqui.
 *
 * Estático — só se move quando a pessoa arrasta ou passa o dedo, sem
 * autoplay.
 *
 * Os itens vêm exatamente do que a clínica comunica publicamente — nada
 * foi presumido ou inventado.
 */
export function Atendimentos() {
  const slides = atendimentos.map((item) => {
    const Icone = iconesAtendimento[item.icone];
    return (
      <div
        key={item.titulo}
        className="group w-72 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-brand/8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10 hover:ring-brand/15 sm:w-80"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
          <Icone className="size-7" />
        </span>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
          {item.titulo}
        </h3>
        <p className="mt-2.5 leading-relaxed text-ink-soft">
          {item.descricao}
        </p>
      </div>
    );
  });

  return (
    <section
      id="atendimentos"
      className="scroll-mt-24 bg-surface-alt py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {atendimentosSecao.sobrelinha}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {atendimentosSecao.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            {atendimentosSecao.subtitulo}
          </p>
        </div>

        <Carrossel
          itens={slides}
          rotulo="Atendimentos da Baby Dog"
          className="mt-12 text-brand"
        />
      </div>
    </section>
  );
}
