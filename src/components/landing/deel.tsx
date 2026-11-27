import Image from "next/image";

import { DEEL_BADGES, DEEL_URL, deelCopy, deelCourseCopy, deelWeek, deelWeeks } from "@/app/bienvenida/deel";
import { courseCopy } from "@/app/cursos/copy";
import { getLocale } from "@/lib/i18n/server";
import "@/components/landing/deel.scss";

// ══════════════════════════════════════════════════════════
//  Deel en las landings
//
//  Cuatro piezas, todas con la copy de bienvenida/deel.ts:
//   · DeelSeal: el sello del héroe, badge + «contenidos acreditados».
//   · DeelSection: la sección entera, quién es Deel y qué acredita.
//   · DeelShort: la versión de una tarjeta, para el dry run.
//   · DeelTag: la etiqueta de una semana acreditada en los temarios.
//
//  Los badges van como los entrega Deel (ver las reglas en deel.ts): nada de
//  filtros ni de recolorear, y nunca dentro del mismo icono que nuestra marca.
// ══════════════════════════════════════════════════════════

function Badge({ index, size }: { index: number; size: number }) {
  const b = DEEL_BADGES[index];
  // Los PNG de Deel son de 640 px: next/image sirve el tamaño que se ve, sin
  // tocar el dibujo (ni filtros ni color, como piden sus reglas).
  return <Image src={b.src} alt={b.alt} width={size} height={size} sizes={`${size}px`} className="axr-deel-badge" />;
}

/** El sello del héroe. Lleva a la sección de la misma página. */
export async function DeelSeal({ tone = "dark", href = "#deel", sub }: { tone?: "dark" | "light"; href?: string; sub?: string }) {
  const c = deelCopy[await getLocale()];
  return (
    <a href={href} className="axr-deel-seal" data-tone={tone}>
      <Badge index={0} size={56} />
      <span>
        <strong>{c.seal.title}</strong>
        <span>{sub ?? c.seal.sub}</span>
      </span>
      <span className="axr-deel-seal__arrow" aria-hidden>→</span>
    </a>
  );
}

/** La etiqueta de un módulo acreditado. `area` va en el title, para quien pase el ratón. */
export function DeelTag({ label, area, tone = "light" }: { label: string; area?: string | null; tone?: "light" | "dark" }) {
  return (
    <span className="axr-deel-tag" data-tone={tone} title={area ?? undefined}>
      <span className="axr-deel-tag__dot" aria-hidden />
      {label}
    </span>
  );
}

/**
 * La sección entera: badges, quién es Deel y, por curso, las semanas con
 * contenido acreditado (el título de cada semana sale de cursos/copy.ts).
 */
export async function DeelSection() {
  const locale = await getLocale();
  const c = deelCopy[locale];
  const weekGroups = (["remote-professional", "remote-founder"] as const).map((slug) => {
    const course = courseCopy[locale][slug];
    return {
      slug,
      name: course.hero.eyebrow.split(" · ")[0],
      weeks: deelWeeks(slug).map((n) => ({
        n,
        title: course.roadmap.weeks.find((w) => w.n === n)?.title ?? "",
        area: deelWeek(slug, n, locale) ?? "",
      })),
    };
  });

  return (
    <section id="deel" className="axr-deel">
      <div className="axr-deel__inner">
        <header className="axr-deel__head">
          <span className="axr-deel__eyebrow">{c.eyebrow}</span>
          <h2>{c.title}</h2>
          <p>{c.lead}</p>
        </header>

        <div className="axr-deel__grid">
          <div className="axr-deel__brand">
            <div className="axr-deel__badges">
              <Badge index={0} size={132} />
              <Badge index={1} size={132} />
            </div>
            <p className="axr-deel__caption">{c.badgesCaption}</p>

            <dl className="axr-deel__stats">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.value}</dt>
                  <dd>{s.label}</dd>
                </div>
              ))}
            </dl>

            <div className="axr-deel__who">
              <h3>{c.whoTitle}</h3>
              <p>{c.who}</p>
              <a href={DEEL_URL} target="_blank" rel="noopener noreferrer" className="axr-deel__who-cta">
                {c.whoCta} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="axr-deel__modules">
            <h3>{c.modulesTitle}</h3>
            {weekGroups.map((g) => (
              <div key={g.slug} className="axr-deel__group" data-camino={g.slug}>
                <span className="axr-deel__group-name">{g.name}</span>
                <ol>
                  {g.weeks.map((w) => (
                    <li key={`${g.slug}-${w.n}`}>
                      <span className="axr-deel__n">{String(w.n).padStart(2, "0")}</span>
                      <span className="axr-deel__m">
                        <strong>
                          {deelCourseCopy[locale].weekLabel} {w.n} · {w.title}
                        </strong>
                        <span className="axr-deel__area">{w.area}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="axr-deel__gains">
          <h3>{c.gainsTitle}</h3>
          <ul>
            {c.gains.map((g, i) => (
              <li key={g.title}>
                <span className="axr-deel__gain-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{g.title}</strong>
                <p>{g.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="axr-deel__note">{c.note}</p>
      </div>
    </section>
  );
}

/**
 * La sección de Deel de una landing de curso (formato 2.0): los badges, el
 * boilerplate de Deel y las semanas de ESE curso que tocan contenido
 * acreditado. La de la home (DeelSection) enseña los dos cursos.
 */
export async function DeelCourse({ weeks }: { weeks: { n: number; title: string; area: string }[] }) {
  const locale = await getLocale();
  const c = deelCopy[locale];
  const k = deelCourseCopy[locale];

  return (
    <section id="deel" className="axr-deel">
      <div className="axr-deel__inner">
        <header className="axr-deel__head">
          <span className="axr-deel__eyebrow">{c.eyebrow}</span>
          <h2>{k.title}</h2>
          <p>{k.lead}</p>
        </header>

        <div className="axr-deel__grid">
          <div className="axr-deel__brand">
            <div className="axr-deel__badges">
              <Badge index={0} size={132} />
              <Badge index={1} size={132} />
            </div>
            <p className="axr-deel__caption">{c.badgesCaption}</p>
            <div className="axr-deel__who">
              <h3>{c.whoTitle}</h3>
              <p>{c.who}</p>
              <a href={DEEL_URL} target="_blank" rel="noopener noreferrer" className="axr-deel__who-cta">
                {c.whoCta} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="axr-deel__modules">
            <h3>{k.listTitle}</h3>
            <div className="axr-deel__group">
              <ol>
                {weeks.map((w) => (
                  <li key={w.n}>
                    <span className="axr-deel__n">{String(w.n).padStart(2, "0")}</span>
                    <span className="axr-deel__m">
                      <strong>
                        {k.weekLabel} {w.n} · {w.title}
                      </strong>
                      <span className="axr-deel__area">{w.area}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Una tarjeta: para páginas que no son del programa entero. */
export async function DeelShort({ href }: { href: string }) {
  const c = deelCopy[await getLocale()];
  return (
    <aside className="axr-deel-short">
      <div className="axr-deel__badges">
        <Badge index={0} size={92} />
        <Badge index={1} size={92} />
      </div>
      <div>
        <h3>{c.short.title}</h3>
        <p>{c.short.body}</p>
        <a href={href} className="axr-deel-short__cta">
          {c.short.cta} <span aria-hidden>→</span>
        </a>
      </div>
    </aside>
  );
}
