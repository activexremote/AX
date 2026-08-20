import type { Metadata } from "next";

import { courseCopy, type CourseSlug } from "@/app/cursos/copy";
import { landingCopy } from "@/app/bienvenida/copy";
import { ENTITY } from "@/app/legal/entity";
import type { Locale } from "@/lib/i18n/config";
import { absolute, alternates, OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";

// Las dos páginas de curso comparten forma: mismo esquema de metadatos y el
// mismo bloque de datos estructurados, cambiando sólo el curso. Se comparte
// aquí para que no se desincronicen al tocar una sola.

export function coursePath(slug: CourseSlug): string {
  return `/cursos/${slug}`;
}

export function courseMetadata(locale: Locale, slug: CourseSlug): Metadata {
  const c = courseCopy[locale][slug];
  const path = coursePath(slug);

  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: c.meta.title,
      description: c.meta.description,
      url: absolute(locale, path),
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
    },
  };
}

/**
 * Course + CourseInstance. La instancia es lo que le dice al buscador que
 * esto es una convocatoria con fecha y en directo, no un curso grabado
 * disponible siempre: sin `courseMode` y `courseWorkload` Google descarta el
 * resultado enriquecido de formación.
 *
 * ⚠︎ No se declara `offers` a propósito: el precio todavía no es público. En
 * cuanto lo sea hay que añadirlo aquí, porque es el campo que más peso tiene
 * en este tipo de resultado.
 */
export function CourseSchema({ locale, slug }: { locale: Locale; slug: CourseSlug }) {
  const c = courseCopy[locale][slug];
  const l = landingCopy[locale];
  const path = coursePath(slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.hero.title,
    description: c.meta.description,
    url: absolute(locale, path),
    inLanguage: locale,
    teaches: c.program.phases.flatMap((phase) =>
      phase.modules.map((m) => m.title),
    ),
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      legalName: ENTITY.legalName,
      url: `${SITE_URL}${locale === "es" ? "" : `/${locale}`}/bienvenida`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "P14W",
      inLanguage: locale,
      name: l.hero.tagline,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
