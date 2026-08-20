import Image from "next/image";

import { LocaleLink } from "@/components/locale-link";
import { articlesFor, featuredArticle } from "@/app/blog/registry";
import { blogCopy } from "@/app/blog/copy";
import { getLocale } from "@/lib/i18n/server";

// Escaparate del blog para las landings.
//
// Va después del formulario, con el diccionario: es contenido de nutrición, no
// de venta, y en mitad del embudo sólo alargaría el camino hasta el CTA. Aquí
// cumple dos funciones — demostrar que detrás hay criterio, y dar al buscador
// enlaces internos desde la página con más autoridad del sitio.
export async function BlogSection({
  /** Si se pasa, sólo se muestran artículos que empujan a ese curso. */
  course,
  limit = 3,
}: {
  course?: "remote-professional" | "remote-founder";
  limit?: number;
}) {
  const locale = await getLocale();
  const c = blogCopy[locale];

  const all = articlesFor(locale);
  const featured = featuredArticle(locale);
  // El post 1 abre siempre: explica qué es la escuela, que es justo lo que le
  // falta a quien llega a una landing y baja hasta aquí.
  const pool = (course ? all.filter((a) => a.course === course) : all).filter(
    (a) => a.slug !== featured?.slug,
  );
  // Si un curso todavía no tiene artículos propios, se rellena con los
  // generales antes que enseñar un hueco.
  const resto = (pool.length >= limit - 1 ? pool : [...pool, ...all.filter((a) => !pool.includes(a))])
    .filter((a) => a.slug !== featured?.slug)
    .slice(0, limit - 1);
  const posts = featured ? [featured, ...resto] : resto.slice(0, limit);

  if (!posts.length) return null;

  return (
    <section id="blog" className="axr-lp__blog">
      <header className="axr-lp__blog-head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{c.sectionTitle}</h2>
        <p>{c.sectionLead}</p>
      </header>

      <div className="axr-lp__blog-grid">
        {posts.map((p) => (
          <LocaleLink key={p.slug} href={`/blog/${p.slug}`} className="axr-lp__blog-card">
            {p.hero ? (
              <span className="axr-lp__blog-art">
                <Image src={p.hero.file} alt="" width={800} height={450} />
              </span>
            ) : null}
            <span className="axr-lp__blog-cluster">
              {p.slug === featured?.slug ? c.featuredLabel : c.clusters[p.cluster]}
            </span>
            <strong>{p.title}</strong>
            <span className="axr-lp__blog-meta">{c.readingLabel(p.readingMinutes)}</span>
          </LocaleLink>
        ))}
      </div>

      <LocaleLink href="/blog" className="axr-lp__blog-all">
        {c.sectionCta}
        <span aria-hidden> →</span>
      </LocaleLink>
    </section>
  );
}
