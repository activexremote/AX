import type { MetadataRoute } from "next";

import { ENTITY } from "@/app/legal/entity";
import { TERMS } from "@/app/glosario/terms";
import { LEGAL_SLUGS } from "@/app/legal/copy";
import { ALL_ARTICLES } from "@/app/blog/registry";

const BASE = `https://${ENTITY.domain}`;

// Prioridades por intención: primero lo que capta lead (landing y cursos),
// después lo que capta búsqueda informacional (diccionario), y al final lo
// que sólo tiene que existir (legales).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/bienvenida`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/cursos/remote-professional`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/cursos/remote-founder`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/glosario`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Sólo los artículos que existen: el mapa de contenidos declara 40, pero
  // enlazar en el sitemap uno que no está publicado es un 404 anunciado.
  const posts: MetadataRoute.Sitemap = ALL_ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const terms: MetadataRoute.Sitemap = TERMS.map((t) => ({
    url: `${BASE}/glosario/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const legal: MetadataRoute.Sitemap = LEGAL_SLUGS.map((slug) => ({
    url: `${BASE}/legal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [...core, ...posts, ...terms, ...legal];
}
