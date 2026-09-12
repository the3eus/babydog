"use client";

import {
  avaliacao,
  depoimentos,
  depoimentosSecao,
  linkAvaliacoesGoogle,
} from "@/lib/content";
import type { AvaliacoesGoogle } from "@/lib/avaliacoes-google";
import { rastrear } from "@/lib/track";
import { Carrossel } from "./Carrossel";
import { IconeEstrela } from "./icons";

/**
 * Prova social.
 *
 * Prioridade da fonte de verdade:
 *   1. Avaliações reais buscadas ao vivo na Places API do Google
 *      (`avaliacoesGoogle`, vindo do servidor em `app/page.tsx`) — nota,
 *      total e trechos de avaliação sempre atualizados sozinhos.
 *   2. Sem isso configurado, cai para `avaliacao`/`depoimentos` estáticos
 *      em lib/content.ts.
 *
 * A seção inteira desaparece quando não há nem avaliação real nem estática
 * confirmada. Isso é proposital: é melhor não ter a seção do que preenchê-la
 * com conteúdo fictício. Ver item 4 do CONTEUDO-PENDENTE.md para ativar as
 * avaliações reais.
 */
export function Depoimentos({
  avaliacoesGoogle,
}: {
  avaliacoesGoogle: AvaliacoesGoogle | null;
}) {
  const reviewsReais = avaliacoesGoogle?.reviews ?? [];
  const usaReviewsReais = reviewsReais.length > 0;

  const itensExibidos = usaReviewsReais
    ? reviewsReais.map((r) => ({
        texto: r.texto,
        autor: r.autor,
        pet: undefined as string | undefined,
        fonte: "google" as const,
      }))
    : depoimentos;

  const temDepoimentos = itensExibidos.length > 0;

  // `?.nota != null`, não só `avaliacoesGoogle ?`: a Places API pode
  // devolver reviews sem nota/total agregados (local muito novo). Nesse
  // caso caímos para os números estáticos em vez de exibir "0,0".
  const notaExibida =
    avaliacoesGoogle?.nota != null
      ? avaliacoesGoogle.nota.toFixed(1).replace(".", ",")
      : avaliacao.nota;
  const totalExibido =
    avaliacoesGoogle?.total != null
      ? String(avaliacoesGoogle.total)
      : avaliacao.total;

  if (!temDepoimentos && !avaliacao.exibir) return null;

  return (
    <section className="bg-surface-alt py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-dark">
            {depoimentosSecao.sobrelinha}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            {temDepoimentos
              ? depoimentosSecao.titulo
              : depoimentosSecao.tituloSemDepoimentos}
          </h2>
        </div>

        {avaliacao.exibir && (
          <a
            href={linkAvaliacoesGoogle}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              rastrear("clique_avaliacoes_google", { origem: "prova_social" })
            }
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-brand/10 transition-all hover:-translate-y-0.5 hover:ring-brand/25"
          >
            {/*
              As estrelas só aparecem quando existe nota confirmada (real ou
              estática). Sem nota, desenhar cinco estrelas afirmaria uma
              avaliação que não temos.
            */}
            {notaExibida && (
              <span className="flex gap-0.5 text-accent" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconeEstrela key={i} className="size-5" />
                ))}
              </span>
            )}
            <p className="text-[0.97rem] text-ink-soft">
              {notaExibida ? (
                <>
                  <strong className="font-bold text-ink">{notaExibida}</strong>{" "}
                  de 5 em {totalExibido} avaliações no {avaliacao.fonte}
                </>
              ) : (
                <>
                  <strong className="font-bold text-ink">
                    {totalExibido} avaliações
                  </strong>{" "}
                  de tutores no {avaliacao.fonte}
                </>
              )}
              <span className="mt-0.5 block text-sm font-semibold text-accent-dark">
                {depoimentosSecao.chamadaGoogle}
              </span>
            </p>
          </a>
        )}

        {temDepoimentos && (
          <Carrossel
            itens={itensExibidos.map((item, indice) => (
              <div
                key={`${item.autor}-${indice}`}
                className="flex h-full w-80 flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-brand/8 sm:w-96"
              >
                <blockquote className="flex-1 leading-relaxed text-ink-soft">
                  “{item.texto}”
                </blockquote>
                <p className="mt-5 border-t border-brand-light pt-4 text-sm font-semibold text-ink">
                  {item.autor}
                  {item.pet && (
                    <span className="font-normal text-ink-soft">
                      {" "}
                      — tutor(a) de {item.pet}
                    </span>
                  )}
                </p>
                {item.fonte === "google" && (
                  <p className="mt-3 text-xs font-medium text-accent-dark">
                    Avaliação verificada no Google
                  </p>
                )}
              </div>
            ))}
            rotulo="Avaliações de tutores"
            className="mt-10 text-brand"
          />
        )}
      </div>
    </section>
  );
}
