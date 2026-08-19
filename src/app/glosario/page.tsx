import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { ENTITY } from "@/app/legal/entity";
import {
  TERMS,
  TERM_CATEGORIES,
  TERM_CATEGORY_LABEL,
  glossaryCopy,
} from "@/app/glosario/terms";
import "@/app/bienvenida/landing.scss";
import "@/app/glosario/glosario.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = glossaryCopy[locale];
  return {
    title: `${c.hubTitle} · ActiveXRemote`,
    description: c.hubMeta,
    alternates: {
      canonical: `https://${ENTITY.domain}/glosario`,
      languages: { es: "/glosario", en: "/glosario" },
    },
    openGraph: {
      type: "website",
      title: c.hubTitle,
      description: c.hubMeta,
      url: `https://${ENTITY.domain}/glosario`,
    },
  };
}

export default async function GlossaryHub() {
  const locale = await getLocale();
  const c = glossaryCopy[locale];

  // DefinedTermSet describe el diccionario entero como una entidad: es lo que
  // permite que un motor semántico entienda que estas 34 páginas son un cuerpo
  // de conocimiento y no entradas sueltas.
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `https://${ENTITY.domain}/glosario#set`,
    name: c.hubTitle,
    description: c.hubMeta,
    inLanguage: locale,
    publisher: { "@type": "Organization", name: ENTITY.tradeName },
    hasDefinedTerm: TERMS.map((term) => ({
      "@type": "DefinedTerm",
      "@id": `https://${ENTITY.domain}/glosario/${term.id}#term`,
      name: term[locale].term,
      description: term[locale].short,
      url: `https://${ENTITY.domain}/glosario/${term.id}`,
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
          <p className="axr-gloss-page__count">{c.countLabel(TERMS.length)}</p>
        </header>

        {TERM_CATEGORIES.map((cat) => {
          const terms = TERMS.filter((t) => t.category === cat);
          if (!terms.length) return null;
          return (
            <section key={cat} className="axr-gloss-page__cat">
              <h2>{TERM_CATEGORY_LABEL[locale][cat]}</h2>
              <ul>
                {terms.map((term) => (
                  <li key={term.id}>
                    <Link href={`/glosario/${term.id}`}>
                      <strong>{term[locale].term}</strong>
                      <span>{term[locale].short}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
