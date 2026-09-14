import Image from "next/image";
import { hero, heroPetlove } from "@/lib/content";
import { BotaoTelefone, BotaoWhatsApp } from "./CTA";
import { HeroVideoFundo } from "./HeroVideoFundo";
import { IconeCheck, IconePata, IconeSeta } from "./icons";
import petloveLogo from "@/public/petlove-logo.png";

/**
 * Primeiro viewport.
 *
 * Precisa deixar claro, sem rolagem: o que é, para quem é, qual o principal
 * benefício e qual a próxima ação. A CTA de WhatsApp é o elemento dominante.
 *
 * O fundo é a animação oficial da marca em vídeo (`HeroVideoFundo`), que
 * toca uma vez e congela no último frame. Por isso o texto é branco e vive
 * sobre uma camada escura translúcida — precisa continuar legível em cima
 * de qualquer frame do vídeo, não só no frame final.
 */
export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-20">
      <HeroVideoFundo />

      {/* Camada escura: mantém o texto branco legível sobre o vídeo,
          em qualquer ponto da animação. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-darker/60 via-brand-darker/72 to-brand-darker/85"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-6 lg:pb-20 lg:pt-14">
        {/* Selo de plano aceito — cores e logo da Petlove. Isolado à
            direita, fora do bloco de texto principal. */}
        <div className="mb-5 flex justify-end sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white py-2.5 pl-3.5 pr-4 shadow-lg shadow-black/15">
            <Image src={petloveLogo} alt="Petlove" className="h-5 w-auto shrink-0" />
            <span className="text-sm font-semibold leading-snug text-petlove">
              {heroPetlove.texto}
            </span>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-brand shadow-sm">
            <IconePata className="size-3.5 text-accent-dark" />
            {hero.sobrelinha}
          </p>

          <h1 className="mt-4 text-[1.6rem] font-bold leading-[1.15] tracking-tight text-white sm:text-3xl lg:text-[2.3rem]">
            Cuidado completo para o seu pet,{" "}
            <span className="relative whitespace-nowrap text-accent-soft">
              24 horas
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-accent-soft"
              >
                <path
                  d="M2 8.5C40 3 90 2.5 198 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            por dia
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
            {hero.subtitulo}
          </p>

          {/* Ação principal */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BotaoWhatsApp
              origem="hero"
              rotulo={hero.ctaPrimario}
              className="w-full text-[1.05rem] sm:w-auto"
            />
            {/* Abaixo do WhatsApp, tudo até a próxima seção some no
                mobile — deixa só o essencial (título + CTA) no primeiro
                viewport de celular; volta a aparecer normalmente a partir
                de `sm`. */}
            <div className="hidden sm:contents">
              <BotaoTelefone
                origem="hero"
                rotulo={hero.ctaSecundario}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Sinalização de confiança logo abaixo da CTA */}
          <ul className="mt-6 hidden flex-wrap gap-x-6 gap-y-2.5 sm:flex">
            {hero.selos.map((selo) => (
              <li
                key={selo}
                className="inline-flex items-center gap-2 text-xs font-medium text-white/90"
              >
                <IconeCheck className="size-3.5 shrink-0 text-accent-soft" />
                {selo}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Indicador de rolagem */}
      <div className="relative hidden justify-center pb-10 sm:flex">
        <a
          href="#a-clinica"
          aria-label="Ver mais sobre a clínica"
          className="inline-flex size-12 items-center justify-center rounded-full bg-white text-brand shadow-lg shadow-black/15 transition-transform hover:translate-y-1"
        >
          <IconeSeta className="size-5" />
        </a>
      </div>
    </section>
  );
}
