import type { Metadata, Viewport } from "next";
import { GlossaryWiki } from "@/components/landing/glossary-wiki";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { absolute, alternates, OG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ENTITY } from "@/app/legal/entity";
import {
  TERMS,
  TERM_CATEGORIES,
  TERM_CATEGORY_LABEL,
  glossaryCopy,
  termPath,
} from "@/app/glosario/terms";
import "@/app/bienvenida/landing.scss";
import "@/app/glosario/glosario.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = glossaryCopy[locale];
  // Antes las dos alternativas de idioma apuntaban a la misma URL
  // (/glosario para es y para en). Un grupo hreflang que se contradice se
  // descarta entero, así que no declaraba nada útil.
  return {
    title: c.hubTitle,
    description: c.hubMeta,
    alternates: alternates(locale, "/glosario"),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: c.hubTitle,
      description: c.hubMeta,
      url: absolute(locale, "/glosario"),
    },
    twitter: { card: "summary_large_image", title: c.hubTitle, description: c.hubMeta },
  };
}

export default async function GlossaryHub() {
  const locale = await getLocale();
  const c = glossaryCopy[locale];

  // Las URL del esquema son las del idioma que se está sirviendo: si la ficha
  // inglesa declarase las direcciones españolas, el dato estructurado
  // contradiría a la canónica de la propia página.
  // DefinedTermSet describe el diccionario entero como una entidad: es lo que
  // permite que un motor semántico entienda que estas 34 páginas son un cuerpo
  // de conocimiento y no entradas sueltas.
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${absolute(locale, "/glosario")}#set`,
    name: c.hubTitle,
    description: c.hubMeta,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: ENTITY.tradeName },
    hasDefinedTerm: TERMS.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `${absolute(locale, termPath(term, locale))}#term`,
      name: term[locale].term,
      description: term[locale].short,
      url: absolute(locale, termPath(term, locale)),
      image: `${SITE_URL}/glosario/${term.id}.svg`,
    })),
  };

  return (
    <main className="axr-lp axr-gloss-page">
      <LandingNav base="/bienvenida" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="axr-gloss-page__inner">
        <header className="axr-gloss-page__head">
          <span className="axr-lp__eyebrow">{c.eyebrow}</span>
          <h1>{c.hubTitle}</h1>
          <p>{c.hubLead}</p>
        </header>

        <GlossaryWiki
          locale={locale}
          copy={{
            azLabel: c.azLabel,
            searchLabel: c.searchLabel,
            searchPlaceholder: c.searchPlaceholder,
            noResults: c.noResults,
            clearSearch: c.clearSearch,
            categoryLabel: c.categoryLabel,
            all: c.all,
            countTemplate: c.countTemplate,
          }}
          categories={TERM_CATEGORIES.map((cat) => ({
            key: cat,
            label: TERM_CATEGORY_LABEL[locale][cat],
          }))}
          terms={[...TERMS]
            .sort((a, b) => a[locale].term.localeCompare(b[locale].term, locale))
            .map((term) => ({
              id: term.id,
              href: termPath(term, locale),
              // La letra sale del término EN ESE idioma: "Employer of Record"
              // va en la E en los dos, pero "Nómina internacional" va en la N
              // y "International payroll" en la I.
              letter: term[locale].term.charAt(0).toLocaleUpperCase(locale),
              term: term[locale].term,
              short: term[locale].short,
              synonyms: term[locale].synonyms,
              category: term.category,
              categoryLabel: TERM_CATEGORY_LABEL[locale][term.category],
              art: `/glosario/${term.id}.svg`,
            }))}
        />

      </div>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
