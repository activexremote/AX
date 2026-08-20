import { LocaleLink } from "@/components/locale-link";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { PaymentBadges } from "@/components/landing/payment-badges";
import { landingCopy } from "@/app/bienvenida/copy";
import { getLocale } from "@/lib/i18n/server";

// Footer compartido por la landing y las páginas de curso. Aquí es donde vive
// el acceso al campus virtual, para no competir con la captación de leads.
/**
 * @param base Página contra la que resuelven las anclas del pie (#faq,
 *   #modulos…). Vacío sólo en las páginas que TIENEN esas secciones: la
 *   portada y las de curso. En cualquier otra —blog, diccionario, legales,
 *   matrícula— hay que pasar "/bienvenida", o los enlaces apuntan a anclas
 *   que no existen en la página actual y no hacen nada al pulsarlos.
 */
export async function LandingFooter({ base = "" }: { base?: string } = {}) {
  const locale = await getLocale();
  const c = landingCopy[locale].footer;

  return (
    <footer className="axr-lp__footer">
      <div className="axr-lp__footer-inner">
        <div className="axr-lp__footer-brand">
          <LocaleLink href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
            <BrandMark size={22} className="axr-lp__brand-mark" />
            <span>ActiveXRemote</span>
          </LocaleLink>
          <p>{c.tagline}</p>
          <div className="axr-lp__footer-locale">
            <LocaleToggle tone="dark" />
          </div>

          {/* Va dentro de la columna de marca, no en una franja aparte: esa
              columna se quedaba corta frente a las de enlaces y el pie crecía
              en vertical sin necesidad. Aquí rellena el hueco que ya había. */}
          <PaymentBadges copy={c.pay} />
        </div>

        <div className="axr-lp__footer-cols">
          {c.cols.map((col) => (
            <div key={col.title} className="axr-lp__footer-col">
              <span className="axr-lp__eyebrow">{col.title}</span>
              {col.links.map((l) =>
                l.href.startsWith("#") ? (
                  <a key={l.label} href={`${base}${l.href}`}>{l.label}</a>
                ) : (
                  <LocaleLink key={l.label} href={l.href}>{l.label}</LocaleLink>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="axr-lp__footer-bar">
        <span>{c.access}</span>
        {/* Revocar el consentimiento tiene que ser tan fácil como darlo. */}
        <CookieSettingsLink label={c.cookieSettings} />
      </div>
    </footer>
  );
}
