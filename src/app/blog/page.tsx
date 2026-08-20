import type { Metadata, Viewport } from "next";
import Image from "next/image";

import { LocaleLink } from "@/components/locale-link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { absolute, alternates, OG_LOCALE, SITE_NAME } from "@/lib/seo";
import { articlesForList, featuredArticle } from "@/app/blog/registry";
import { CONTENT_MAP } from "@/app/blog/content-map";
import { blogCopy } from "@/app/blog/copy";
import "@/app/bienvenida/landing.scss";
import "@/app/blog/blog.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = blogCopy[locale];
  return {
    title: c.title,
    description: c.lead,
    alternates: alternates(locale, "/blog"),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: c.title,
      description: c.lead,
      url: absolute(locale, "/blog"),
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.lead },
  };
}

export default async function BlogHub() {
  const locale = await getLocale();
  const c = blogCopy[locale];
  const featured = featuredArticle(locale);
  const posts = articlesForList(locale);
  // Los previstos se listan como próximos: enseñan la cobertura temática sin
  // enlazar a páginas que todavía no existen.
  const planned = CONTENT_MAP[locale].filter(
    (s) => !posts.some((p) => p.slug === s.slug),
  );

  return (
    <main className="axr-lp axr-blog">
      <LandingNav base="/bienvenida" />

      <div className="axr-blog__inner">
        <header className="axr-blog__head">
          <span className="axr-lp__eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </header>

        {/* Post 1: la puerta de entrada. Va a pantalla completa y fuera de la
            rejilla porque no compite con las guías — las presenta. */}
        {featured ? (
          <LocaleLink href={`/blog/${featured.slug}`} className="axr-blog__featured">
            {featured.hero ? (
              <span className="axr-blog__featured-art">
                <Image src={featured.hero.file} alt="" width={800} height={450} priority />
              </span>
            ) : null}
            <span className="axr-blog__featured-body">
              <span className="axr-blog__featured-label">{c.featuredLabel}</span>
              <strong>{featured.title}</strong>
              <span className="axr-blog__featured-lead">{featured.metaDescription}</span>
              <span className="axr-blog__featured-cta">
                {c.featuredCta}
                <span aria-hidden> →</span>
              </span>
            </span>
          </LocaleLink>
        ) : null}

        {posts.length > 0 && (
          <div className="axr-blog__grid">
            {posts.map((p) => (
              <article key={p.slug} className="axr-blog__card">
                {p.hero ? (
                  // La imagen es decorativa aquí: el enlace del titular ya
                  // dice a dónde lleva, así que un alt repetido sólo haría que
                  // un lector de pantalla oyese dos veces lo mismo.
                  <LocaleLink href={`/blog/${p.slug}`} className="axr-blog__card-art" tabIndex={-1} aria-hidden>
                    <Image src={p.hero.file} alt="" width={800} height={450} />
                  </LocaleLink>
                ) : null}
                <span className="axr-blog__cluster">{c.clusters[p.cluster]}</span>
                <h2>
                  <LocaleLink href={`/blog/${p.slug}`}>{p.title}</LocaleLink>
                </h2>
                <p>{p.metaDescription}</p>
                <span className="axr-blog__meta">{c.readingLabel(p.readingMinutes)}</span>
              </article>
            ))}
          </div>
        )}

        {planned.length > 0 && (
          <section className="axr-blog__planned">
            <h2>{c.emptyLabel}</h2>
            <ul>
              {planned.map((s) => (
                <li key={s.slug}>
                  <span className="axr-blog__cluster">{c.clusters[s.cluster]}</span>
                  <strong>{s.title}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
