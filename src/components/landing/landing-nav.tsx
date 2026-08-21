import { LocaleLink } from "@/components/locale-link";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { CohortTicker } from "@/components/landing/cohort-ticker";
import { LandingMenu } from "@/components/landing/landing-menu";
import { LandingCtaBar } from "@/components/landing/landing-cta-bar";
import { landingCopy } from "@/app/bienvenida/copy";
import { COHORT_START } from "@/app/bienvenida/cohort";
import { getLocale } from "@/lib/i18n/server";

// Nav compartido por la landing y las páginas de curso. Los enlaces con "#"
// apuntan a secciones que existen en todas ellas (#metodo, #faq, #solicitar).
// Por debajo de 981px los enlaces se pliegan en <LandingMenu>.
/**
 * @param base   Página contra la que resuelven las anclas (#faq, #metodo).
 * @param ticker Cuenta atrás de la convocatoria. Se apaga en los cursos
 *   relámpago: ahí no hay convocatoria —se empieza el día que se paga, y la
 *   página lo dice tres veces—, así que una cuenta atrás a una fecha de
 *   inicio arriba del todo contradice justo lo que se está vendiendo.
 */
export async function LandingNav({
  base = "",
  ticker: conTicker = true,
}: { base?: string; ticker?: boolean } = {}) {
  const locale = await getLocale();
  const c = landingCopy[locale].nav;
  const ticker = landingCopy[locale].ticker;
  // Las páginas sin las secciones ancladas (legales) pasan base="/bienvenida".
  const anchor = (href: string) => (href.startsWith("#") ? `${base}${href}` : href);

  return (
    <>
    {conTicker && <CohortTicker copy={landingCopy[locale].ticker} target={COHORT_START} />}
    <header className="axr-lp__nav">
      <div className="axr-lp__nav-inner">
        <LocaleLink href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
          <BrandMark size={22} className="axr-lp__brand-mark" />
          <span>ActiveXRemote</span>
        </LocaleLink>

        <nav className="axr-lp__nav-links">
          {/* Desplegable sin JS: <details> es accesible por teclado de serie. */}
          <details className="axr-lp__drop">
            <summary>
              {c.courses.label}
              <span className="axr-lp__drop-caret" aria-hidden />
            </summary>
            <div className="axr-lp__drop-menu">
              {c.courses.items.map((l) => (
                <LocaleLink key={l.href} href={l.href}>
                  {l.label}
                </LocaleLink>
              ))}
            </div>
          </details>

          {/* Las anclas se resuelven contra la página base y van como <a>;
              las rutas de verdad pasan por LocaleLink para no perder el
              idioma (en inglés, "Blog" tiene que llevar a /en/blog). */}
          {c.links.map((l) =>
            l.href.startsWith("#") ? (
              <a key={l.href} href={anchor(l.href)}>
                {l.label}
              </a>
            ) : (
              <LocaleLink key={l.href} href={l.href}>
                {l.label}
              </LocaleLink>
            ),
          )}

          {/* Presencia discreta: el campus no debe competir con el CTA. */}
          <LocaleLink href="/login" className="axr-lp__nav-campus">
            {c.campus}
          </LocaleLink>
        </nav>

        <div className="axr-lp__nav-meta">
          <div className="axr-lp__nav-locale">
            <LocaleToggle />
          </div>
          {/* Dos etiquetas, una visible por tamaño: la frase entera no cabe en
              la píldora del móvil y `display: none` la oculta también al lector
              de pantalla, así que no se anuncia dos veces. */}
          <a href={anchor("#solicitar")} className="axr-lp__btn axr-lp__btn--solid axr-lp__nav-cta">
            <span className="axr-lp__nav-cta-short">{c.ctaShort}</span>
            <span className="axr-lp__nav-cta-full">{c.cta}</span>
            <span className="axr-lp__nav-cta-arrow" aria-hidden>→</span>
          </a>
          <LandingMenu copy={c} base={base} />
        </div>
      </div>
    </header>

    {/* Sólo móvil: recupera el CTA una vez el héroe queda atrás. */}
    <LandingCtaBar note={ticker.intro} cta={c.cta} />
    </>
  );
}
