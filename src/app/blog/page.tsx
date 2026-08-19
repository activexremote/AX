import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getLocale } from "@/lib/i18n/server";
import { ENTITY } from "@/app/legal/entity";
import { articlesFor } from "@/app/blog/registry";
import { CONTENT_MAP } from "@/app/blog/content-map";
import { blogCopy } from "@/app/blog/copy";
import "@/app/bienvenida/landing.scss";
import "@/app/blog/blog.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = blogCopy[locale];
  return {
    title: `${c.title} · ActiveXRemote`,
    description: c.lead,
    alternates: { canonical: `https://${ENTITY.domain}/blog` },
    openGraph: { type: "website", title: c.title, description: c.lead },
  };
}

export default async function BlogHub() {
  const locale = await getLocale();
  const c = blogCopy[locale];
  const posts = articlesFor(locale);
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

        {posts.length > 0 && (
          <div className="axr-blog__grid">
            {posts.map((p) => (
              <article key={p.slug} className="axr-blog__card">
                <span className="axr-blog__cluster">{c.clusters[p.cluster]}</span>
                <h2>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
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
