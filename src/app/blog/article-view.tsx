import Image from "next/image";

import { LocaleLink } from "@/components/locale-link";

import { blogCopy } from "@/app/blog/copy";
import type { Article, Block } from "@/app/blog/types";

// ══════════════════════════════════════════════════════════
//  El artículo, pintado
//
//  Lo usan la página del blog y la vista previa del panel de publicaciones,
//  así que lo que se revisa en el panel es exactamente lo que se publica. Por
//  eso aquí no hay nada de servidor: la vista previa lo pinta en el
//  navegador, con lo que se está escribiendo.
// ══════════════════════════════════════════════════════════

type Copy = (typeof blogCopy)["es"];

/** Lo que se enlaza del diccionario, ya resuelto (el diccionario entero no viaja al navegador). */
export type TermLink = { id: string; href: string; label: string };

export function BlockView({ block, c }: { block: Block; c: Copy }) {
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
    case "check":
      // Casillas de verdad: el lector las puede ir marcando mientras lee, sin
      // JavaScript. No se guardan: es una ayuda para repasar, no un formulario.
      return (
        <div className="axr-post__check">
          <span className="axr-post__check-label">{block.title || c.checkLabel}</span>
          <ul>
            {block.items.map((i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" />
                  <span>{i}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      );
    case "stats":
      return (
        <figure className="axr-post__stats">
          <div>
            {block.items.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          {block.source ? (
            <figcaption>
              {c.sourceLabel}: {block.source}
            </figcaption>
          ) : null}
        </figure>
      );
    case "chart": {
      const max = Math.max(...block.bars.map((b) => b.value), 0) || 1;
      return (
        <figure className="axr-post__chart">
          <figcaption className="axr-post__chart-title">{block.title}</figcaption>
          <ul>
            {block.bars.map((b) => (
              <li key={b.label}>
                <span className="axr-post__chart-label">{b.label}</span>
                <span className="axr-post__chart-track" aria-hidden>
                  <span style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }} />
                </span>
                <span className="axr-post__chart-value">
                  {b.value.toLocaleString()}
                  {block.unit ? ` ${block.unit}` : ""}
                </span>
              </li>
            ))}
          </ul>
          {block.source ? (
            <figcaption className="axr-post__chart-source">
              {c.sourceLabel}: {block.source}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "disclaimer":
      return (
        <aside className="axr-post__disclaimer" role="note">
          <span>{c.disclaimerLabel}</span>
          <p>{block.text}</p>
        </aside>
      );
    case "cta":
      return (
        <aside className="axr-post__inline-cta">
          <div>
            <strong>{block.title}</strong>
            <p>{block.text}</p>
          </div>
          <LocaleLink href={block.href} className="axr-lp__btn axr-lp__btn--solid">
            {block.button}
            <span aria-hidden>→</span>
          </LocaleLink>
        </aside>
      );
  }
}

export function ArticleView({ a, terms }: { a: Article; terms: TermLink[] }) {
  const c = blogCopy[a.locale];

  return (
    <article className="axr-post__inner">
      <nav className="axr-post__crumbs" aria-label="breadcrumb">
        <LocaleLink href="/blog">{c.backLabel}</LocaleLink>
        <span aria-hidden>·</span>
        <span>{c.clusters[a.cluster]}</span>
      </nav>

      {a.hero ? (
        <figure className="axr-post__art">
          {/^https?:\/\//.test(a.hero.file) ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagen subida desde el panel
            <img src={a.hero.file} alt={a.hero.alt} width={800} height={450} />
          ) : (
            <Image src={a.hero.file} alt={a.hero.alt} width={800} height={450} priority />
          )}
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
          {a.faqs.length ? (
            <li>
              <a href="#faq">{c.faqTitle}</a>
            </li>
          ) : null}
        </ol>
      </nav>

      <div className="axr-post__body">
        {a.sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2>{s.h2}</h2>
            {/* Respuesta directa: es el bloque que se cita. */}
            <p className="axr-post__answer">{s.answer}</p>
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} c={c} />
            ))}
            {s.takeaway && (
              <p className="axr-post__takeaway">
                <em>{c.keyLabel}</em>
                {s.takeaway}
              </p>
            )}
          </section>
        ))}

        {a.faqs.length ? (
          <section id="faq" className="axr-post__faq">
            <h2>{c.faqTitle}</h2>
            {a.faqs.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        ) : null}
      </div>

      {terms.length > 0 && (
        <section className="axr-post__terms">
          <h2>{c.termsLabel}</h2>
          <ul>
            {terms.map((t) => (
              <li key={t.id}>
                <LocaleLink href={t.href}>{t.label}</LocaleLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {a.external.length ? (
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
      ) : null}

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
  );
}
