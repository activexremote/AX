import {
  PARTNERS,
  partnerCopy,
  partnerLogo,
  type Partner,
} from "@/app/bienvenida/partners";
import { getLocale } from "@/lib/i18n/server";

// ══════════════════════════════════════════════════════════
//  Partners
//
//  Dos piezas: la tira del héroe —los logotipos, sólo para decir «no estamos
//  solos» antes de que nadie lea nada— y la sección de detalle, con el
//  beneficio de cada uno.
//
//  Los logos van todos a la MISMA ALTURA y nunca al mismo ancho: es como se
//  unifica una fila de logotipos. Igualarlos por ancho hace que un wordmark
//  largo (SafetyWing, Factorial) aplaste a un monograma (Stripe, Vercel).
// ══════════════════════════════════════════════════════════

/**
 * La marca de un partner.
 *
 * Cuando no hay archivo se compone el nombre en la tipografía de la casa.
 * No es un hueco: en una fila donde todo está a la misma altura, un nombre
 * bien compuesto pasa por un wordmark más. Es lo que evita que falten dos
 * marcas de la fila por no tener su SVG.
 */
function PartnerMark({ p, size }: { p: Partner; size: number }) {
  const src = partnerLogo(p);

  if (!src) {
    return (
      <span className="axr-pmark axr-pmark--text" style={{ fontSize: size * 0.52 }}>
        {p.name}
      </span>
    );
  }

  // El ancho sale de la altura y de la proporción real del archivo: así
  // ninguno se deforma y todos ocupan el mismo alto óptico.
  const w = Math.round(size * (p.ratio ?? 1));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={p.name}
      width={w}
      height={size}
      loading="lazy"
      decoding="async"
      className="axr-pmark"
      data-dark={p.dark ? "" : undefined}
      style={{ height: size, width: w }}
    />
  );
}

/**
 * Tira del héroe.
 *
 * Dos logotipos y la etiqueta. Nada más.
 *
 * Antes eran cinco metidos en pastillas blancas con su nombre y su categoría,
 * y el resultado era una fila de tarjetas peleándose con el titular, que es
 * lo único que en un héroe tiene que leerse. Aquí el trabajo de la tira es
 * respaldar, no explicar: quien quiera saber qué hace cada partner lo tiene
 * en la sección de abajo, con su beneficio.
 *
 * Los logos van a una tinta (CSS: `brightness(0) invert(1)`) y a la misma
 * ALTURA óptica, nunca al mismo ancho: igualar por ancho aplastaría el
 * monograma de Remote & Talent contra el wordmark de Deel.
 */
export async function PartnerStrip({
  tone = "dark",
  full = false,
}: {
  tone?: "dark" | "light";
  /**
   * A todo el ancho del héroe en vez de dentro de la columna del texto.
   *
   * Cuál conviene depende de qué columna sea la más alta, y no es la misma en
   * las dos plantillas:
   *
   *  · En la home manda el formulario (518 px) y la columna del texto va
   *    holgada, así que la tira cabe dentro sin que el héroe crezca.
   *  · En una página de curso manda el texto (624 px), así que meterla ahí le
   *    sumaría altura. A todo el ancho entra en una sola fila y deja de
   *    empujar la columna alta.
   */
  full?: boolean;
}) {
  const locale = await getLocale();
  const c = partnerCopy[locale];

  return (
    <div className="axr-pstrip" data-tone={tone} data-full={full ? "" : undefined}>
      <span className="axr-pstrip__label">{c.heroLabel}</span>

      <ul className="axr-pstrip__row">
        {PARTNERS.filter((p) => p.hero).map((p) => (
          <li key={p.key}>
            {/* Sin enlace a propósito: el héroe no está para mandar a nadie
                fuera. El nombre viaja en el alt del logo. */}
            <PartnerMark p={p} size={48} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** La sección: cada partner con su categoría y su beneficio. */
export async function PartnerSection() {
  const locale = await getLocale();
  const c = partnerCopy[locale];

  return (
    <section id="partners" className="axr-partners">
      <header className="axr-partners__head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{c.title}</h2>
        <p>{c.lead}</p>
      </header>

      <ul className="axr-partners__grid">
        {PARTNERS.map((p) => {
          const item = c.items[p.key];
          return (
            <li key={p.key} className="axr-pcard">
              <a href={p.url} target="_blank" rel="noopener noreferrer nofollow">
                <span className="axr-pcard__mark"><PartnerMark p={p} size={26} /></span>
                <span className="axr-pcard__area">{item?.area}</span>
                <span className="axr-pcard__name">{p.name}</span>
                <span className="axr-pcard__desc">{item?.desc}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="axr-partners__note">{c.note}</p>
    </section>
  );
}
