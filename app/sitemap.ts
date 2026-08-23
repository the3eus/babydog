import type { MetadataRoute } from "next";
import { clinica } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: clinica.site,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
