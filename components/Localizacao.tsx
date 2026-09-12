"use client";

import {
  clinica,
  embedMapa,
  linkGoogleMaps,
  linkWaze,
  localizacao,
} from "@/lib/content";
import { rastrear } from "@/lib/track";
import { IconeLocal, IconeRelogio, IconeWaze } from "./icons";

/**
 * Última fricção antes da visita: onde fica e como chegar.
 *
 * O mapa é carregado com loading="lazy" para não pesar no carregamento
 * inicial, já que fica no fim da página. Os dois botões abrem a rota direto
 * no aplicativo de navegação do tutor, não apenas um mapa parado.
 */
export function Localizacao() {
  return (
    <section id="localizacao" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
              {localizacao.sobrelinha}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              {localizacao.titulo}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {localizacao.subtitulo}
            </p>

            <address className="mt-7 flex flex-col gap-4 not-italic">
              <span className="flex items-start gap-3">
                <IconeLocal className="mt-0.5 size-6 shrink-0 text-brand" />
                <span className="leading-relaxed text-ink">
                  <strong className="block font-semibold">
                    {clinica.endereco.logradouro}, {clinica.endereco.numero}
                  </strong>
                  <span className="text-ink-soft">
                    {clinica.endereco.bairro} — {clinica.endereco.cidade}/
                    {clinica.endereco.uf} · CEP {clinica.endereco.cep}
                  </span>
                </span>
              </span>
              <span className="flex items-start gap-3">
                <IconeRelogio className="mt-0.5 size-6 shrink-0 text-brand" />
                <span className="leading-relaxed text-ink-soft">
                  {clinica.horario}
                </span>
              </span>
            </address>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => rastrear("clique_mapa", { origem: "localizacao" })}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-brand px-7 font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                <IconeLocal className="size-5" />
                {localizacao.ctaMaps}
              </a>
              <a
                href={linkWaze}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => rastrear("clique_waze", { origem: "localizacao" })}
                className="inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-white px-7 font-semibold text-brand shadow-md ring-2 ring-brand/15 transition-all hover:-translate-y-0.5 hover:ring-brand/35"
              >
                <IconeWaze className="size-5" />
                {localizacao.ctaWaze}
              </a>
            </div>
          </div>

          {/* Mapa incorporado — clicável, abre a rota no Google Maps */}
          <div className="overflow-hidden rounded-4xl shadow-xl shadow-brand/10 ring-1 ring-brand/10">
            <iframe
              src={embedMapa}
              title={`Mapa com a localização da ${clinica.nome}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[320px] w-full border-0 sm:h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
