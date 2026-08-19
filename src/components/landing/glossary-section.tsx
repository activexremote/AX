import Link from "next/link";

import { getLocale } from "@/lib/i18n/server";
import {
  TERMS,
  TERM_CATEGORIES,
  TERM_CATEGORY_LABEL,
  glossaryCopy,
} from "@/app/glosario/terms";
// La sección vive en la portada pero sus estilos son los del diccionario:
// se importan aquí para que viajen con el componente allá donde se monte.
import "@/app/glosario/glosario.scss";

type Props = {
  /** Las páginas de curso muestran sólo los términos que les tocan. */
  only?: readonly string[];
};

// Diccionario de la portada. Cada entrada es un <details>: el término y su
// definición corta están en el HTML desde el principio (los buscadores y los
// modelos los leen sin desplegar nada), y el desplegado sólo evita el muro de
// texto para quien lo mira con los ojos.
export async function GlossarySection({ only }: Props) {
  const locale = await getLocale();
  const c = glossaryCopy[locale];
  const terms = only ? TERMS.filter((t) => only.includes(t.id)) : TERMS;
  const cats = TERM_CATEGORIES.filter((cat) => terms.some((t) => t.category === cat));

  return (
    <section id="diccionario" className="axr-lp__glossary axr-gloss">
      <header className="axr-gloss__head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{c.title}</h2>
        <p>{c.lead}</p>
      </header>

      {/* Mismo filtro sin JavaScript que el stack: radios ocultos + :has(). */}
      <div className="axr-gloss__filters" role="group" aria-label={c.eyebrow}>
        <span className="axr-gloss__filter">
          <input
            type="radio"
            name="axr-gloss-cat"
            id="axr-gloss-all"
            className="axr-gloss__radio"
            defaultChecked
          />
          <label htmlFor="axr-gloss-all">{c.all}</label>
        </span>
        {cats.map((cat) => (
          <span key={cat} className="axr-gloss__filter">
            <input
              type="radio"
              name="axr-gloss-cat"
              id={`axr-gloss-${cat}`}
              className="axr-gloss__radio"
            />
            <label htmlFor={`axr-gloss-${cat}`}>{TERM_CATEGORY_LABEL[locale][cat]}</label>
          </span>
        ))}
      </div>

      <div className="axr-gloss__grid">
        {terms.map((term) => {
          const t = term[locale];
          return (
            <details key={term.id} className="axr-gloss__item" data-cat={term.category}>
              <summary>
                <span className="axr-gloss__term">
                  {t.term}
                  {t.aka && <em>{t.aka}</em>}
                </span>
                <span className="axr-gloss__sign" aria-hidden />
              </summary>
              <div className="axr-gloss__def">
                <p>{t.short}</p>
                <Link href={`/glosario/${term.id}`} className="axr-gloss__link">
                  {c.seeTerm}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </details>
          );
        })}
      </div>

      <p className="axr-gloss__all">
        <Link href="/glosario" className="axr-lp__btn axr-lp__btn--ghost">
          {c.seeAll}
          <span aria-hidden>→</span>
        </Link>
      </p>
    </section>
  );
}
