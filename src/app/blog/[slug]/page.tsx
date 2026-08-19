import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { ENTITY } from "@/app/legal/entity";
import { getTerm } from "@/app/glosario/terms";
import { ALL_ARTICLES, getArticle } from "@/app/blog/registry";
import { HREFLANG_PAIRS } from "@/app/blog/content-map";
import { blogCopy } from "@/app/blog/copy";
import type { Block } from "@/app/blog/types";
import "@/app/bienvenida/landing.scss";
import "@/app/blog/blog.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

const BASE = `https://${ENTITY.domain}`;

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
  const url = `${BASE}/blog/${a.slug}`;
  const other = counterpart(a.slug);

  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: [a.keyword, ...a.secondary],
    authors: [{ name: a.author }],
    alternates: {
      canonical: url,
      // Sin par no se declara hreflang: apuntar a una traducción que no
      // existe es peor que no declarar nada.
      languages: other
        ? {
            [a.locale]: url,
            [a.locale === "es" ? "en" : "es"]: `${BASE}/blog/${other}`,
            "x-default": url,
          }
        : undefined,
    },
    openGraph: {
      type: "article",
      title: a.ogTitle,
      description: a.ogDescription,
      url,
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

  const locale = await getLocale();
  const c = blogCopy[a.locale];
  const url = `${BASE}/blog/${a.slug}`;
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
        author: { "@type": "Organization", name: a.author, url: `${BASE}/bienvenida` },
        publisher: {
          "@type": "Organization",
          name: ENTITY.tradeName,
          url: `${BASE}/bienvenida`,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: [a.keyword, ...a.secondary].join(", "),
        articleSection: c.clusters[a.cluster],
        wordCount: a.sections.reduce(
          (n, s) => n + s.answer.split(/\s+/).length + s.blocks.length * 40,
          0,
        ),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: a.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ActiveXRemote", item: `${BASE}/bienvenida` },
          { "@type": "ListItem", position: 2, name: c.eyebrow, item: `${BASE}/blog` },
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
          <Link href="/blog">{c.backLabel}</Link>
          <span aria-hidden>·</span>
          <span>{c.clusters[a.cluster]}</span>
        </nav>

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
                  <Link href={`/glosario/${t!.id}`}>{t![locale].term}</Link>
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
          <Link
            href={a.course ? `/cursos/${a.course}` : "/bienvenida#solicitar"}
            className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
          >
            {c.ctaButton}
            <span aria-hidden>→</span>
          </Link>
        </aside>
      </article>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
