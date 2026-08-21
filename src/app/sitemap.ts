import type { MetadataRoute } from "next";

import { TERMS } from "@/app/glosario/terms";
import { ALL_ARTICLES } from "@/app/blog/registry";
import { HREFLANG_PAIRS } from "@/app/blog/content-map";
import { FLASH_COURSES } from "@/lib/relampago/catalog";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];

/**
 * Una entrada por idioma, y cada una declarando dónde está la otra.
 *
 * El sitemap anterior sólo listaba las URL españolas: la versión inglesa no
 * aparecía en ninguna parte, así que Google no tenía forma de descubrirla ni
 * de saber que eran la misma página en dos idiomas.
 */
function bilingual(
  path: string,
  opts: Omit<Entry, "url" | "alternates">,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}${withLocale(l, path)}`]),
  );
  return LOCALES.map((l) => ({
    ...opts,
    url: `${SITE_URL}${withLocale(l, path)}`,
    alternates: { languages },
  }));
}

/** La traducción de un artículo, si la hay. */
function counterpart(slug: string): string | undefined {
  if (HREFLANG_PAIRS[slug]) return HREFLANG_PAIRS[slug];
  return Object.entries(HREFLANG_PAIRS).find(([, en]) => en === slug)?.[0];
}

// Prioridades por intención: primero lo que capta lead (landing y cursos),
// después lo que capta búsqueda informacional (blog y diccionario). Los
// legales quedan fuera: van marcados como noindex, y anunciar en el sitemap
// una página que se pide no indexar es una señal contradictoria.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    ...bilingual("/bienvenida", { lastModified: now, changeFrequency: "weekly", priority: 1 }),
    ...bilingual("/cursos/remote-professional", { lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    ...bilingual("/cursos/remote-founder", { lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    ...bilingual("/cursos-relampago", { lastModified: now, changeFrequency: "weekly", priority: 0.9 }),
    // Un relámpago es una página de producto con precio: misma prioridad que
    // las landings de curso, porque capta exactamente igual.
    ...FLASH_COURSES.flatMap((f) =>
      bilingual(`/cursos-relampago/${f.slug}`, {
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      }),
    ),
    ...bilingual("/blog", { lastModified: now, changeFrequency: "weekly", priority: 0.8 }),
    ...bilingual("/glosario", { lastModified: now, changeFrequency: "monthly", priority: 0.7 }),
  ];

  // El identificador es común pero la dirección no: en inglés cada término
  // tiene su propio slug (/en/glossary/tax-residence).
  const terms = TERMS.flatMap((t) => {
    const paths = { es: `/glosario/${t.id}`, en: `/glosario/${t.slugEn ?? t.id}` } as const;
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, `${SITE_URL}${withLocale(l, paths[l])}`]),
    );
    return LOCALES.map((l) => ({
      url: `${SITE_URL}${withLocale(l, paths[l])}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages },
    }));
  });

  // Los artículos no: cada idioma tiene su propio slug. Sólo se declara la
  // alternativa cuando la traducción existe de verdad.
  const posts: MetadataRoute.Sitemap = ALL_ARTICLES.map((a) => {
    const other = counterpart(a.slug);
    const otherLocale: Locale = a.locale === "es" ? "en" : "es";
    return {
      url: `${SITE_URL}${withLocale(a.locale, `/blog/${a.slug}`)}`,
      lastModified: new Date(a.updated),
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: other
        ? {
            languages: {
              [a.locale]: `${SITE_URL}${withLocale(a.locale, `/blog/${a.slug}`)}`,
              [otherLocale]: `${SITE_URL}${withLocale(otherLocale, `/blog/${other}`)}`,
            },
          }
        : undefined,
    };
  });

  return [...core, ...posts, ...terms];
}
