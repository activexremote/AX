import { SlackLogo } from "@/components/slack-logo";

export type PartnerKey = "deel" | "remoteandtalent" | "slack";

// Proporción de cada SVG (public/logos), para calcular el ancho a partir de
// la altura y no deformar la marca.
const LOGOS: Record<Exclude<PartnerKey, "slack">, { src: string; ratio: number }> = {
  deel: { src: "/logos/deel.svg", ratio: 78 / 27 },
  remoteandtalent: { src: "/logos/remoteandtalent.svg", ratio: 80 / 90 },
};

// Marca de cada entidad certificadora, con sus colores originales: Slack
// inline (ya estaba en el repo) y los otros dos desde public/logos. El icono
// de Remote&Talent es blanco, así que va sobre su propio chip oscuro.
export function PartnerMark({ partner, size = 18 }: { partner: PartnerKey; size?: number }) {
  if (partner === "slack") return <SlackLogo size={size} />;

  const { src, ratio } = LOGOS[partner];
  const alt = partner === "deel" ? "Deel" : "Remoteandtalent.com";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={Math.round(size * ratio)}
      height={size}
      className="axr-lp__partner-logo"
      data-partner={partner}
    />
  );
}

type Partner = {
  key: PartnerKey;
  name: string;
  area: string;
  desc: string;
  modules: string;
};

export type AccreditationCopy = {
  heroLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  partners: readonly Partner[];
  note: string;
};

// Sección completa: quién certifica qué. Se usa en la landing y en las dos
// páginas de curso, así que la explicación es idéntica en las tres.
export function AccreditationSection({ copy }: { copy: AccreditationCopy }) {
  return (
    <section id="acreditacion" className="axr-lp__accred">
      <header className="axr-lp__accred-head">
        <span className="axr-lp__eyebrow">{copy.eyebrow}</span>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </header>

      <div className="axr-lp__accred-grid">
        {copy.partners.map((p) => (
          <article key={p.key} className="axr-lp__certifier" data-partner={p.key}>
            <span className="axr-lp__certifier-mark">
              <PartnerMark partner={p.key} size={p.key === "remoteandtalent" ? 34 : 28} />
            </span>
            <h3>{p.name}</h3>
            <span className="axr-lp__certifier-area">{p.area}</span>
            <p>{p.desc}</p>
            <span className="axr-lp__certifier-modules">{p.modules}</span>
          </article>
        ))}
      </div>

      <p className="axr-lp__accred-note">{copy.note}</p>
    </section>
  );
}

// Fila compacta para el héroe de las tres landings.
export function AccreditationRow({
  label,
  partners,
  tone = "light",
}: {
  label: string;
  partners: { key: PartnerKey; name: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <div className="axr-lp__accred-row" data-tone={tone}>
      <span className="axr-lp__accred-label">{label}</span>
      <span className="axr-lp__accred-marks">
        {partners.map((p) => (
          <span key={p.key} className="axr-lp__accred-mark">
            <PartnerMark partner={p.key} size={p.key === "remoteandtalent" ? 22 : 18} />
            <span className="axr-lp__accred-name">{p.name}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
