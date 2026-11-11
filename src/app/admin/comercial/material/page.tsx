import { Icono } from "@/components/admin/publicaciones/iconos";
import { exigirComercial } from "@/lib/comercial/acceso";
import { MATERIAL } from "@/lib/comercial/material";
import { comCopy } from "@/lib/i18n/comercial";
import { getLocale } from "@/lib/i18n/server";
import "../comercial.scss";

// ══════════════════════════════════════════════════════════
//  Material de apoyo
//
//  Los dosieres del curso para mandar a los leads, con su portada, y el
//  playbook (que es para quien vende, no para mandar). Los ficheros los
//  genera scripts/decks-comerciales.mts.
// ══════════════════════════════════════════════════════════

const archivo = (nombre: string) => `/admin/comercial/material/archivo/${nombre}`;

export default async function MaterialPage() {
  await exigirComercial();
  const c = comCopy[await getLocale()];

  return (
    <div className="axr-admin-page axr-com">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.matTitle}</h1>
          <p>{c.matLead}</p>
        </div>
      </div>

      <div className="axr-mat">
        {MATERIAL.map((m) => (
          <article key={m.id} className="axr-mat__card" data-tono={m.id}>
            <a href={archivo(m.pdf)} className="axr-mat__cover" aria-label={`${c.matDownload}: ${m.titulo}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- privada y servida por el panel, no por /_next/image */}
              <img src={archivo(m.portada)} alt="" width={1280} height={720} loading="lazy" />
            </a>
            <div className="axr-mat__body">
              <span className="axr-mat__for">{m.paraQuien}</span>
              <h2>{m.titulo}</h2>
              <p>{m.descripcion}</p>
              <a href={archivo(m.pdf)} className="axr-btn">
                <Icono n="descarga" size={16} /> {c.matDownload}
              </a>
            </div>
          </article>
        ))}

        <article className="axr-mat__card axr-mat__card--interno">
          <div className="axr-mat__body">
            <span className="axr-mat__for">
              {c.matInternal} · {c.matInternalHint}
            </span>
            <h2>{c.pbTitle}</h2>
            <p>{c.pbLead}</p>
            <a href="/admin/comercial/playbook/pdf" className="axr-btn axr-btn--ghost">
              <Icono n="descarga" size={16} /> {c.matDownload}
            </a>
          </div>
        </article>
      </div>

      <p className="axr-mat__tip">
        <Icono n="info" size={16} /> {c.matTip}
      </p>
    </div>
  );
}
