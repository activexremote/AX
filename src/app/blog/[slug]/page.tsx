import type { Metadata, Viewport } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

import { LocaleLink } from "@/components/locale-link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { absolute, alternates, OG_LOCALE, selfCanonical, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ENTITY } from "@/app/legal/entity";
import { getTerm, termPath } from "@/app/glosario/terms";
import { ALL_ARTICLES, getArticle } from "@/app/blog/registry";
import { HREFLANG_PAIRS } from "@/app/blog/content-map";
import { blogCopy } from "@/app/blog/copy";
import type { Block } from "@/app/blog/types";
import "@/app/bienvenida/landing.scss";
import "@/app/blog/blog.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export function generateStaticParams() {
  return ALL_ARTICLES.map((a) => ({ slug: a.slug }));
}

/** El par equivalente en el otro idioma, para hreflang. */
function counterpart(slug: string): string | undefined {
  if (HREFLANG_PAIRS[slug]) return HREFLANG_PAIRS[slug];
  const entry = Object.entries(HREFLANG_PAIRS).find(([, en]) => en === slug);
  return entry?.[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};

  // El idioma de un artículo lo fija el artículo, no la URL ni la cookie: un
  // texto en inglés se sirve en inglés se llegue como se llegue.
  const path = `/blog/${a.slug}`;
  const other = counterpart(a.slug);
  const otherLocale: Locale = a.locale === "es" ? "en" : "es";

  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: [a.keyword, ...a.secondary],
    authors: [{ name: a.author }],
    // Sin par no se declara hreflang: apuntar a una traducción que no existe
    // es peor que no declarar nada.
    alternates: other
      ? alternates(a.locale, path, {
          [a.locale]: path,
          [otherLocale]: `/blog/${other}`,
        })
      : selfCanonical(a.locale, path),
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALE[a.locale],
      title: a.ogTitle,
      description: a.ogDescription,
      url: absolute(a.locale, path),
      publishedTime: a.published,
      modifiedTime: a.updated,
      authors: [a.author],
    },
    twitter: { card: "summary_large_image", title: a.ogTitle, description: a.ogDescription },
  };
}

function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "p":
      return <p>{block.text}</p>;
    case "note":
      return <p className="axr-post__note">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="axr-post__quote">
          <p>{block.text}</p>
          {block.by && <cite>{block.by}</cite>}
        </blockquote>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="axr-post__ol">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "steps":
      return (
        <ol className="axr-post__steps">
          {block.items.map((s, i) => (
            <li key={s.title}>
              <span className="axr-post__step-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "pros":
      return (
        <div className="axr-post__pros">
          <div data-kind="pro">
            <span>+</span>
            <ul>
              {block.pros.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div data-kind="con">
            <span>−</span>
            <ul>
              {block.cons.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "table":
      return (
        <div className="axr-post__table">
          <table>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  // Cada artículo está escrito en un solo idioma y tiene un slug propio en
  // cada uno. Si se llega por la URL del otro idioma —/blog/ats-friendly-resume
  // en vez de /en/blog/ats-friendly-resume— el texto saldría en inglés con el
  // menú, el pie y el diccionario en español, y además habría dos direcciones
  // sirviendo lo mismo. Se manda a la suya y se acabó.
  const locale = await getLocale();
  if (locale !== a.locale) {
    // Quien cambia de idioma en un artículo quiere LA TRADUCCIÓN, no la misma
    // página otra vez. Antes rebotaba a su propia URL y el selector parecía
    // roto; ahora salta al artículo hermano si existe, y sólo si no hay
    // traducción vuelve a la suya.
    const twin = counterpart(a.slug);
    const other = twin ? getArticle(twin) : undefined;
    if (other && other.locale === locale) {
      redirect(withLocale(locale, `/blog/${other.slug}`));
    }
    redirect(withLocale(a.locale, `/blog/${a.slug}`));
  }

  const c = blogCopy[a.locale];
  const url = absolute(a.locale, `/blog/${a.slug}`);
  const terms = a.terms.map(getTerm).filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: a.h1,
        description: a.metaDescription,
        inLanguage: a.locale,
        datePublished: a.published,
        dateModified: a.updated,
        author: { "@type": "Organization", name: a.author, url: absolute(a.locale, "/bienvenida") },
        publisher: {
          "@type": "Organization",
          name: ENTITY.tradeName,
          url: absolute(a.locale, "/bienvenida"),
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: [a.keyword, ...a.secondary].join(", "),
        articleSection: c.clusters[a.cluster],
        wordCount: a.sections.reduce(
          (n, s) => n + s.answer.split(/\s+/).length + s.blocks.length * 40,
          0,
        ),
        ...(a.hero ? { image: `${SITE_URL}${a.hero.file}` } : {}),
        // De qué trata y qué nombra. Un motor que responde preguntas necesita
        // saber a qué conceptos se ancla el texto, no sólo qué palabras clave
        // se persiguen: `about` son los términos que el artículo explica y
        // `mentions`, los que da por sabidos y enlaza.
        about: terms.slice(0, 3).map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${absolute(a.locale, termPath(t!, a.locale))}#term`,
          name: t![a.locale].term,
        })),
        mentions: terms.map((t) => ({
          "@type": "DefinedTerm",
          "@id": `${absolute(a.locale, termPath(t!, a.locale))}#term`,
          name: t![a.locale].term,
        })),
        isPartOf: {
          "@type": "Blog",
          "@id": `${absolute(a.locale, "/blog")}#blog`,
          name: c.title,
          inLanguage: a.locale,
        },
        // Cada sección abre con una respuesta autónoma de 40-60 palabras. Es
        // el bloque que un motor conversacional puede citar tal cual, así que
        // se le señala en vez de dejar que lo adivine del HTML.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".axr-post__answer", ".axr-post__takeaway"],
        },
        hasPart: a.sections.map((sec) => ({
          "@type": "WebPageElement",
          "@id": `${url}#${sec.id}`,
          name: sec.h2,
          text: sec.answer,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: a.locale,
        mainEntity: [
          // Primero las secciones —son las preguntas grandes del artículo— y
          // después el FAQ, que resuelve las dudas sueltas.
          ...a.sections.map((sec) => ({
            "@type": "Question",
            name: sec.h2,
            url: `${url}#${sec.id}`,
            acceptedAnswer: {
              "@type": "Answer",
              text: sec.answer,
              url: `${url}#${sec.id}`,
            },
          })),
          ...a.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ActiveXRemote", item: absolute(a.locale, "/bienvenida") },
          { "@type": "ListItem", position: 2, name: c.eyebrow, item: absolute(a.locale, "/blog") },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="axr-lp axr-post">
      <LandingNav base="/bienvenida" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="axr-post__inner">
        <nav className="axr-post__crumbs" aria-label="breadcrumb">
          <LocaleLink href="/blog">{c.backLabel}</LocaleLink>
          <span aria-hidden>·</span>
          <span>{c.clusters[a.cluster]}</span>
        </nav>

        {a.hero ? (
          <figure className="axr-post__art">
            <Image src={a.hero.file} alt={a.hero.alt} width={800} height={450} priority />
          </figure>
        ) : null}

        <header className="axr-post__head">
          <h1>{a.h1}</h1>
          <p className="axr-post__meta">
            <span>{c.readingLabel(a.readingMinutes)}</span>
            <span aria-hidden>·</span>
            <span>
              {c.updatedLabel} <time dateTime={a.updated}>{a.updated}</time>
            </span>
          </p>
          {a.intro.map((p) => (
            <p key={p} className="axr-post__intro">
              {p}
            </p>
          ))}
        </header>

        {/* Índice enlazable: mejora el escaneo y da a Google los saltos de
            sección que usa en los resultados enriquecidos. */}
        <nav className="axr-post__toc" aria-label={c.tocLabel}>
          <span className="axr-post__toc-label">{c.tocLabel}</span>
          <ol>
            {a.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.h2}</a>
              </li>
            ))}
            <li>
              <a href="#faq">{c.faqTitle}</a>
            </li>
          </ol>
        </nav>

        <div className="axr-post__body">
          {a.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.h2}</h2>
              {/* Respuesta directa: es el bloque que se cita. */}
              <p className="axr-post__answer">{s.answer}</p>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
              {s.takeaway && (
                <p className="axr-post__takeaway">
                  <em>{c.keyLabel}</em>
                  {s.takeaway}
                </p>
              )}
            </section>
          ))}

          <section id="faq" className="axr-post__faq">
            <h2>{c.faqTitle}</h2>
            {a.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        </div>

        {terms.length > 0 && (
          <section className="axr-post__terms">
            <h2>{c.termsLabel}</h2>
            <ul>
              {terms.map((t) => (
                <li key={t!.id}>
                  <LocaleLink href={termPath(t!, a.locale)}>{t![a.locale].term}</LocaleLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="axr-post__sources">
          <h2>{c.sourcesLabel}</h2>
          <ul>
            {a.external.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <aside className="axr-post__cta">
          <h2>{c.ctaTitle}</h2>
          <p>{c.ctaBody}</p>
          <LocaleLink
            href={a.course ? `/cursos/${a.course}` : "/bienvenida#solicitar"}
            className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
          >
            {c.ctaButton}
            <span aria-hidden>→</span>
          </LocaleLink>
        </aside>
      </article>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
