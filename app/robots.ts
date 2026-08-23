import type { MetadataRoute } from "next";
import { clinica } from "@/lib/content";

/**
 * Enquanto o site estiver no endereço provisório da Vercel, bloqueamos o
 * rastreamento inteiro para não indexar um domínio que será trocado — isso
 * evitaria conteúdo duplicado e um endereço temporário aparecendo na busca.
 * Ao definir o domínio final, mude `indexavel` para true em lib/content.ts.
 */
export default function robots(): MetadataRoute.Robots {
  if (!clinica.indexavel) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${clinica.site}/sitemap.xml`,
  };
}
