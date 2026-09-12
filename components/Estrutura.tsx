import Image from "next/image";
import { estrutura, estruturaSecao } from "@/lib/content";
import { Carrossel } from "./Carrossel";

/**
 * Prova visual do "estrutura própria completa": fotos reais dos ambientes da
 * clínica, no lugar exato onde o site fala de consultas, exames, cirurgia e
 * internação. Fica entre Atendimentos e Diferenciais para transformar a
 * afirmação nesses dois blocos em evidência.
 *
 * Carrossel arrastável (mouse ou toque) em vez de grade — sem autoplay: são
 * fotos para examinar no próprio ritmo, não conteúdo para empurrar.
 */
export function Estrutura() {
  const slides = estrutura.map((item) => (
    <figure
      key={item.arquivo}
      className="group relative aspect-[4/5] w-[78vw] max-w-80 overflow-hidden rounded-3xl shadow-sm ring-1 ring-brand/8 sm:w-72"
    >
      <Image
        src={`/estrutura/${item.arquivo}.webp`}
        alt={item.descricao}
        fill
        loading="lazy"
        sizes="(max-width: 640px) 78vw, 288px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent"
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-base font-semibold leading-snug text-white">
          {item.titulo}
        </p>
      </figcaption>
    </figure>
  ));

  return (
    <section id="estrutura" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {estruturaSecao.sobrelinha}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {estruturaSecao.titulo}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            {estruturaSecao.subtitulo}
          </p>
        </div>

        <Carrossel
          itens={slides}
          rotulo="Fotos da estrutura da clínica"
          className="mt-12 text-brand"
        />
      </div>
    </section>
  );
}
