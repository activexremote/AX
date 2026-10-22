import { Icono } from "@/components/admin/publicaciones/iconos";
import { FORMATOS, FORMATO_IDS } from "@/lib/banners/formatos";
import { GUIA, NUNCA } from "@/lib/banners/normas";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";

// La guía en claro de lo que el generador ya aplica. El contenido de las
// normas va sólo en español, como los avisos (ver lib/banners/normas.ts).
export default async function NormasPage() {
  const locale = await getLocale();
  const copy = banCopy[locale];

  return (
    <div className="axr-admin-page axr-ban-rules">
      <div className="axr-pubpage-head">
        <h1>{copy.rulesTitle}</h1>
        <p>{copy.rulesLead}</p>
      </div>

      <div className="axr-ban-rules__grid">
        {GUIA.map((g) => (
          <section key={g.titulo} className="axr-pubcard axr-ban-rule">
            <h2>{g.titulo}</h2>
            <div className="axr-ban-rule__cols">
              <ul className="axr-ban-rule__good" aria-label={copy.rulesGood}>
                {g.bien.map((t) => (
                  <li key={t}>
                    <Icono n="ok" size={14} /> {t}
                  </li>
                ))}
              </ul>
              <ul className="axr-ban-rule__bad" aria-label={copy.rulesBad}>
                {g.mal.map((t) => (
                  <li key={t}>
                    <Icono n="error" size={14} /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <strong>{copy.rulesWhy}:</strong> {g.porque}
            </p>
          </section>
        ))}
      </div>

      <section className="axr-pubcard axr-ban-rule axr-ban-rule--never">
        <h2>
          <Icono n="escudo" /> {copy.never}
        </h2>
        <ul>
          {NUNCA.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <div className="axr-ban-rules__grid">
        <section className="axr-pubcard axr-ban-rule">
          <h2>{copy.specs}</h2>
          <p>{copy.specsBody}</p>
          <ul className="axr-ban-specs">
            {FORMATO_IDS.map((id) => {
              const f = FORMATOS[id];
              return (
                <li key={id}>
                  <span className={`axr-ban-specs__shape axr-ban-specs__shape--${id}`} aria-hidden />
                  <span>
                    <strong>{f.label}</strong>
                    <small>{f.placements}</small>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="axr-pubcard axr-ban-rule">
          <h2>{copy.employment}</h2>
          <p>{copy.employmentBody}</p>
        </section>
      </div>
    </div>
  );
}
