import { SlackLogo } from "@/components/slack-logo";

export type PartnerKey = "deel" | "remoteandtalent" | "slack";

// Marca de cada entidad certificadora. Slack tiene su logo oficial en el
// repo; Deel y Remoteandtalent van como wordmark hasta que estén los SVG
// oficiales (colocarlos en public/logos/ y sustituir aquí).
export function PartnerMark({ partner, size = 18 }: { partner: PartnerKey; size?: number }) {
  if (partner === "slack") return <SlackLogo size={size} />;

  return (
    <span
      className="axr-lp__partner-word"
      data-partner={partner}
      style={{ fontSize: `${size * 0.78}px` }}
    >
      {partner === "deel" ? "Deel" : "Remote&Talent"}
    </span>
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
              <PartnerMark partner={p.key} size={30} />
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
            <PartnerMark partner={p.key} size={18} />
            <span className="axr-lp__accred-name">{p.name}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
