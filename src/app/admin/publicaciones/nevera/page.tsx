import Link from "next/link";

import { AlProximoHueco } from "@/components/admin/publicaciones/al-proximo-hueco";
import { RellenarHuecos } from "@/components/admin/publicaciones/rellenar-huecos";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { duracion } from "@/lib/social/calendario";
import { cargarPanel } from "@/lib/social/panel";

export default async function NeveraPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const panel = await cargarPanel(locale);
  const nevera = panel.variantes
    .filter((v) => v.status === "nevera")
    .sort((a, b) => a.updated_at.localeCompare(b.updated_at));

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.fridgeTitle}</h1>
          <p>{copy.fridgeLead}</p>
        </div>
      </div>

      <div className="axr-pub-kpis">
        {CANALES.map((c) => {
          const k = panel.cobertura[c];
          const n = nevera.filter((v) => v.channel === c).length;
          return (
            <div key={c} className="axr-kpi">
              <div className="axr-kpi__label">
                <span className={`axr-pub-dot axr-pub-dot--${c}`} /> {NOMBRE_CANAL[c]}
              </div>
              <div className="axr-kpi__value">{n}</div>
              <div className="axr-pub-kpi-hint">
                {k.activo
                  ? `${copy.coverUntil}: ${k.hasta ? duracion(k.dias, locale) : copy.coverNone}${n ? ` → ${duracion(k.diasConNevera, locale)}` : ""}`
                  : copy.coverOff}
              </div>
            </div>
          );
        })}
      </div>

      <div className="axr-admin-card">
        {nevera.length === 0 ? (
          <div>
            <p className="axr-pub-lead">{copy.fridgeEmpty}</p>
            <Link href="/admin/publicaciones/nueva" className="axr-btn">
              {copy.new}
            </Link>
          </div>
        ) : (
          <>
            <RellenarHuecos copy={copy} label={`${copy.fridgeFill} (${nevera.length})`} />
            <table className="axr-admin-table" style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>{copy.colChannel}</th>
                  <th>{copy.colPost}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {nevera.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span className={`axr-pub-dot axr-pub-dot--${v.channel}`} /> {NOMBRE_CANAL[v.channel]}
                    </td>
                    <td>
                      <Link href={`/admin/publicaciones/${v.post_id}`}>{v.title}</Link>
                    </td>
                    <td className="axr-admin-table__actions">
                      <AlProximoHueco id={v.id} copy={copy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <p className="axr-pub-note">{copy.fridgeTip}</p>
      </div>
    </div>
  );
}
