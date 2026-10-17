import "@/components/landing/impact-badges.scss";

// ══════════════════════════════════════════════════════════
//  Nuestro impacto: Stripe Climate y la ONG con la que colaboramos.
//
//  Vive en los dos pies públicos (LandingFooter y el de la landing de
//  campaña), así que sale en la portada, las páginas de curso, los relámpago,
//  el blog, el diccionario y las legales sin repetirlo en cada una.
//
//  ⚠︎ Las dos son afirmaciones sobre terceros, y valen lo que valga que sean
//  ciertas:
//
//   · Stripe Climate sólo se puede anunciar con Climate Commitments ACTIVO en
//     el Dashboard de Stripe (dashboard.stripe.com/climate). Stripe pide no
//     usarlo para decir «carbon neutral» ni «neutros en carbono»: es una
//     aportación a tecnologías de eliminación de CO₂, no una compensación.
//     Por eso el texto dice «destinamos parte de la facturación» y nada más.
//     Cuando esté activo, el Dashboard da una página pública propia
//     (climate.stripe.com/…): ponla en CLIMATE_URL y el enlace irá ahí.
//
//   · DWB Foundation («Do it With Boldness»): ONG registrada en Kenia desde
//     2018 (Societies Act, Cap 108), de mentoría y empoderamiento de jóvenes y
//     mujeres en liderazgo y emprendimiento. Su web es dwbkenya.org. El logo
//     es suyo y va sin recolorear.
//
//  La insignia de Stripe Climate oficial se descarga del Dashboard; mientras
//  no esté, se pinta una hoja propia y el nombre en texto. No se imita su
//  logotipo: sería usar una marca ajena sin su archivo.
// ══════════════════════════════════════════════════════════

/** Página pública de Climate de la cuenta. Hasta tenerla, la general de Stripe. */
const CLIMATE_URL = "https://stripe.com/climate";
const NGO_URL = "https://dwbkenya.org/";

export type ImpactCopy = {
  label: string;
  climate: string;
  climateLink: string;
  ngo: string;
  ngoLink: string;
};

export function ImpactBadges({ copy }: { copy: ImpactCopy }) {
  return (
    <section className="axr-impact" aria-label={copy.label}>
      <span className="axr-impact__label">{copy.label}</span>

      <a className="axr-impact__item" href={CLIMATE_URL} target="_blank" rel="noopener noreferrer">
        <span className="axr-impact__mark axr-impact__mark--climate" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
            <path
              d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="axr-impact__text">
          <strong>Stripe Climate</strong>
          <span>{copy.climate}</span>
          <em>{copy.climateLink} ↗</em>
        </span>
      </a>

      <a className="axr-impact__item" href={NGO_URL} target="_blank" rel="noopener noreferrer">
        <span className="axr-impact__mark axr-impact__mark--ngo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/partners/dwb-foundation.png"
            alt="DWB Foundation"
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="axr-impact__text">
          <strong>DWB Foundation</strong>
          <span>{copy.ngo}</span>
          <em>{copy.ngoLink} ↗</em>
        </span>
      </a>
    </section>
  );
}
