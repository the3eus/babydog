/**
 * Busca nota, total e trechos de avaliações reais direto da Places API do
 * Google — nunca por raspagem de página nem de agregadores de terceiros
 * (ver item 4 do CONTEUDO-PENDENTE.md). Reexibir conteúdo obtido por essa
 * API é expressamente permitido pelos termos do Google; ler o HTML do Maps
 * não é — e nem seria possível, a página é toda renderizada em JavaScript.
 *
 * Roda só no servidor (usa uma chave secreta, nunca `NEXT_PUBLIC_`) e o
 * resultado fica em cache por 1h para não estourar a cota gratuita da API.
 *
 * Sem `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACES_ID` configuradas, ou se a
 * Places API falhar, retorna `null` — a seção de prova social cai para o
 * texto genérico já confirmado pela clínica, sem quebrar a página.
 */

export type ReviewGoogle = {
  autor: string;
  nota: number;
  texto: string;
  tempoRelativo: string;
};

export type AvaliacoesGoogle = {
  nota: number | null;
  total: number | null;
  reviews: ReviewGoogle[];
};

type ReviewBruta = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
};

export async function buscarAvaliacoesGoogle(): Promise<AvaliacoesGoogle | null> {
  const chave = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_ID;

  if (!chave || !placeId) return null;

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "rating,user_ratings_total,reviews");
    url.searchParams.set("language", "pt-BR");
    url.searchParams.set("key", chave);

    const resposta = await fetch(url, { next: { revalidate: 3600 } });
    const dados = await resposta.json();

    if (dados.status !== "OK" || !dados.result) {
      console.error(
        "[avaliacoes-google] Places API respondeu:",
        dados.status,
        dados.error_message ?? "",
      );
      return null;
    }

    // Só avaliações positivas com texto — prova social, não um espelho
    // fiel de cada nota que a clínica recebeu.
    const reviews: ReviewGoogle[] = ((dados.result.reviews ?? []) as ReviewBruta[])
      .filter((r) => r.rating >= 4 && r.text?.trim())
      .slice(0, 6)
      .map((r) => ({
        autor: r.author_name,
        nota: r.rating,
        texto: r.text.trim(),
        tempoRelativo: r.relative_time_description,
      }));

    return {
      // `?? null`, não `?? 0`: a Places API omite esses campos quando o
      // local ainda não tem avaliações suficientes, e 0 pareceria uma nota
      // real (péssima) em vez de "nota indisponível".
      nota: dados.result.rating ?? null,
      total: dados.result.user_ratings_total ?? null,
      reviews,
    };
  } catch (erro) {
    console.error("[avaliacoes-google] Falha ao buscar avaliações:", erro);
    return null;
  }
}
