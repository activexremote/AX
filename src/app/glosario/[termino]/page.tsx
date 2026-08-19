import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { ENTITY } from "@/app/legal/entity";
import {
  TERMS,
  TERM_CATEGORY_LABEL,
  getTerm,
  glossaryCopy,
} from "@/app/glosario/terms";
import "@/app/bienvenida/landing.scss";
import "@/app/glosario/glosario.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export function generateStaticParams() {
  return TERMS.map((t) => ({ termino: t.id }));
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
  const url = `https://${ENTITY.domain}/glosario/${term.id}`;

  return {
    // El título responde la pregunta con la que se busca: "qué es X".
    title:
      locale === "es"
        ? `Qué es ${t.term}: definición y para qué sirve`
        : `What is ${t.term}? Definition and why it matters`,
    description: t.short.slice(0, 155),
    keywords: [t.term, ...t.synonyms],
    alternates: { canonical: url },
    openGraph: { type: "article", title: t.term, description: t.short, url },
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
  const c = glossaryCopy[locale];
  const t = term[locale];
  const related = term.related.map(getTerm).filter(Boolean);
  const url = `https://${ENTITY.domain}/glosario/${term.id}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#term`,
        name: t.term,
        alternateName: t.synonyms,
        description: t.short,
        inDefinedTermSet: `https://${ENTITY.domain}/glosario#set`,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ActiveXRemote", item: `https://${ENTITY.domain}/bienvenida` },
          { "@type": "ListItem", position: 2, name: c.hubTitle, item: `https://${ENTITY.domain}/glosario` },
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
          <Link href="/glosario">{c.backToHub}</Link>
          <span aria-hidden>·</span>
          <span>{TERM_CATEGORY_LABEL[locale][term.category]}</span>
        </nav>

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
                  <Link href={`/glosario/${r!.id}`}>
                    <strong>{r![locale].term}</strong>
                    <span>{r![locale].short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="axr-gloss-page__cta">
          <p>{c.inProgram}</p>
          <Link href="/bienvenida#solicitar" className="axr-lp__btn axr-lp__btn--solid">
            {locale === "es" ? "Solicita información" : "Request information"}
            <span aria-hidden>→</span>
          </Link>
        </aside>
      </article>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
