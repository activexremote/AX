import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { landingCopy } from "@/app/bienvenida/copy";
import { getLocale } from "@/lib/i18n/server";

// Nav compartido por la landing y las páginas de curso. Los enlaces con "#"
// apuntan a secciones que existen en todas ellas (#metodo, #faq, #solicitar).
export async function LandingNav() {
  const locale = await getLocale();
  const c = landingCopy[locale].nav;

  return (
    <header className="axr-lp__nav">
      <div className="axr-lp__nav-inner">
        <Link href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
          <BrandMark size={22} className="axr-lp__brand-mark" />
          <span>ActiveXRemote</span>
        </Link>

        <nav className="axr-lp__nav-links">
          {/* Desplegable sin JS: <details> es accesible por teclado de serie. */}
          <details className="axr-lp__drop">
            <summary>
              {c.courses.label}
              <span className="axr-lp__drop-caret" aria-hidden />
            </summary>
            <div className="axr-lp__drop-menu">
              {c.courses.items.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </details>

          {c.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}

          {/* Presencia discreta: el campus no debe competir con el CTA. */}
          <Link href="/login" className="axr-lp__nav-campus">
            {c.campus}
          </Link>
        </nav>

        <div className="axr-lp__nav-meta">
          <LocaleToggle />
          <a href="#solicitar" className="axr-lp__btn axr-lp__btn--solid">
            {c.cta}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
