import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { LocaleLink } from "@/components/locale-link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { withLocale } from "@/lib/i18n/routing";
import { absolute, alternates, OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  TERMS,
  TERM_CATEGORY_LABEL,
  getTerm,
  glossaryCopy,
  termPath,
} from "@/app/glosario/terms";
import "@/app/bienvenida/landing.scss";
import "@/app/glosario/glosario.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export function generateStaticParams() {
  // Los dos slugs: el español resuelve /glosario/residencia-fiscal y el inglés
  // /en/glossary/tax-residence, que el proxy no traduce (sólo traduce
  // segmentos de ruta, no identificadores de contenido).
  return TERMS.flatMap((t) =>
    t.slugEn ? [{ termino: t.id }, { termino: t.slugEn }] : [{ termino: t.id }],
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termino: string }>;
}): Promise<Metadata> {
  const { termino } = await params;
  const term = getTerm(termino);
  if (!term) return {};
  const locale = await getLocale();
  const t = term[locale];
  // El identificador del término es el mismo en los dos idiomas, así que la
  // ruta sólo cambia en el prefijo: /glosario/eor y /en/glosario/eor.
  // Cada idioma tiene su ruta: el id es el dato, el slug es la dirección.
  const path = termPath(term, locale);

  return {
    // El título responde la pregunta con la que se busca: "qué es X".
    title:
      locale === "es"
        ? `Qué es ${t.term}: definición y para qué sirve`
        : `What is ${t.term}? Definition and why it matters`,
    description: t.short.slice(0, 155),
    keywords: [t.term, ...t.synonyms],
    // Cada idioma tiene una dirección distinta para la misma ficha, así que
    // el par hreflang no puede construirse con una sola ruta.
    alternates: alternates(locale, path, {
      es: `/glosario/${term.id}`,
      en: `/glosario/${term.slugEn ?? term.id}`,
    }),
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: t.term,
      description: t.short,
      url: absolute(locale, path),
    },
    twitter: { card: "summary_large_image", title: t.term, description: t.short },
  };
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ termino: string }>;
}) {
  const { termino } = await params;
  const term = getTerm(termino);
  if (!term) notFound();

  const locale = await getLocale();

  // Cada idioma tiene una sola dirección buena para cada ficha. Como getTerm
  // acepta los dos slugs, /en/glossary/residencia-fiscal también resolvía y
  // dejaba el mismo contenido en dos URLs; se manda a la suya.
  const path = termPath(term, locale);
  if (`/glosario/${termino}` !== path) redirect(withLocale(locale, path));

  const c = glossaryCopy[locale];
  const t = term[locale];
  const related = term.related.map(getTerm).filter(Boolean);
  const url = absolute(locale, path);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: t.term,
        alternateName: t.synonyms,
        description: t.short,
        image: `${SITE_URL}/glosario/${term.id}.svg`,
        inDefinedTermSet: `${absolute(locale, "/glosario")}#set`,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ActiveXRemote", item: absolute(locale, "/bienvenida") },
          { "@type": "ListItem", position: 2, name: c.hubTitle, item: absolute(locale, "/glosario") },
          { "@type": "ListItem", position: 3, name: t.term, item: url },
        ],
      },
      {
        // La pregunta literal con la que se busca, respondida en una frase.
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: locale === "es" ? `¿Qué es ${t.term}?` : `What is ${t.term}?`,
            acceptedAnswer: { "@type": "Answer", text: t.short },
          },
        ],
      },
    ],
  };

  return (
    <main className="axr-lp axr-gloss-page">
      <LandingNav base="/bienvenida" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="axr-gloss-page__inner axr-gloss-page__term">
        <nav className="axr-gloss-page__crumbs" aria-label="breadcrumb">
          <LocaleLink href="/glosario">{c.backToHub}</LocaleLink>
          <span aria-hidden>·</span>
          <span>{TERM_CATEGORY_LABEL[locale][term.category]}</span>
        </nav>

        <figure className="axr-gloss-page__art">
          <Image src={`/glosario/${term.id}.svg`} alt="" width={360} height={360} priority />
        </figure>

        <header className="axr-gloss-page__head">
          <h1>{t.term}</h1>
          {t.aka && <p className="axr-gloss-page__aka">{t.aka}</p>}
          {/* Respuesta directa primero: es lo que se cita. */}
          <p className="axr-gloss-page__short">{t.short}</p>
        </header>

        <div className="axr-gloss-page__long">
          <p>{t.long}</p>
        </div>

        {t.synonyms.length > 0 && (
          <p className="axr-gloss-page__syn">
            <strong>{c.synonymsLabel}:</strong> {t.synonyms.join(", ")}
          </p>
        )}

        {related.length > 0 && (
          <section className="axr-gloss-page__related">
            <h2>{c.relatedLabel}</h2>
            <ul>
              {related.map((r) => (
                <li key={r!.id}>
                  <LocaleLink href={termPath(r!, locale)}>
                    <strong>{r![locale].term}</strong>
                    <span>{r![locale].short}</span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="axr-gloss-page__cta">
          <p>{c.inProgram}</p>
          <LocaleLink href="/bienvenida#solicitar" className="axr-lp__btn axr-lp__btn--solid">
            {locale === "es" ? "Solicita información" : "Request information"}
            <span aria-hidden>→</span>
          </LocaleLink>
        </aside>
      </article>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
