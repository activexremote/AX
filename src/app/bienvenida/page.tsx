import type { Metadata, Viewport } from "next";

import { LandingView } from "@/components/landing/landing-view";
import { landingCopy } from "@/app/bienvenida/copy";
import { ENTITY } from "@/app/legal/entity";
import { getLocale } from "@/lib/i18n/server";
import { absolute, alternates, OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";

const PATH = "/bienvenida";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = landingCopy[locale];

  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: alternates(locale, PATH),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: c.meta.title,
      description: c.meta.description,
      url: absolute(locale, PATH),
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
    },
  };
}

// La barra del ticker tiñe la UI de Safari; `cover` deja que el mesh y el
// footer lleguen al borde de la pantalla (el contenido se aparta del notch
// con env(safe-area-inset-*) en landing.scss).
export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export default async function LandingPage() {
  const locale = await getLocale();
  const c = landingCopy[locale];

  // Tres entidades, una por trabajo:
  //  · Organization identifica a la escuela y es a lo que cuelgan las demás;
  //  · Course describe cada camino, que es lo que se vende y lo único que
  //    puede salir como resultado enriquecido de formación;
  //  · FAQPage reutiliza las preguntas que ya están escritas en la página.
  // Se emiten en un solo @graph para que las referencias entre ellas (@id)
  // se resuelvan sin repetir la organización tres veces.
  const org = {
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    legalName: ENTITY.legalName,
    url: absolute(locale, PATH),
    email: ENTITY.email,
    description: c.meta.description,
    slogan: c.hero.tagline,
    inLanguage: locale,
  };

  const courses = c.paths.items.map((item) => ({
    "@type": "Course",
    name: item.name,
    description: item.sub,
    url: absolute(locale, item.href),
    inLanguage: locale,
    provider: { "@id": `${SITE_URL}#organization` },
  }));

  const faq = {
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const schema = { "@context": "https://schema.org", "@graph": [org, ...courses, faq] };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LandingView />
    </>
  );
}
