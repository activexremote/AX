import Link from "next/link";

import { RellenarHuecos } from "@/components/admin/publicaciones/rellenar-huecos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { diaMadrid, diaSemana, huecos, sumarDias, ZONA } from "@/lib/social/calendario";
import { cargarPanel } from "@/lib/social/panel";
import type { SocialChannel } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  El mes, día a día
//
//  Cada día enseña lo programado y lo publicado, y un recuadro punteado por
//  cada hueco del ritmo que todavía está vacío: es lo que hay que rellenar.
//  Los huecos sólo se pintan de ahora en adelante; un hueco pasado ya no
//  tiene arreglo y sólo haría ruido.
// ══════════════════════════════════════════════════════════

export default async function CalendarioPage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const panel = await cargarPanel(locale);
  const { mes: param } = await searchParams;

  const hoy = diaMadrid(new Date());
  const mes = param && /^\d{4}-\d{2}$/.test(param) ? param : hoy.slice(0, 7);
  const [y, m] = mes.split("-").map(Number);
  const primero = `${mes}-01`;
  const ultimo = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  const mesAnterior = new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
  const mesSiguiente = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);

  // La rejilla empieza en el lunes de la semana del día 1 y acaba en el domingo de la del último.
  const inicio = sumarDias(primero, 1 - diaSemana(primero));
  const fin = sumarDias(ultimo, 7 - diaSemana(ultimo));
  const dias: string[] = [];
  for (let d = inicio; d <= fin; d = sumarDias(d, 1)) dias.push(d);

  // Lo que cae en cada día de Madrid.
  const porDia = new Map<string, typeof panel.variantes>();
  for (const v of panel.variantes) {
    const cuando = v.status === "publicado" ? v.published_at : v.status === "programado" ? v.scheduled_at : null;
    if (!cuando) continue;
    const d = diaMadrid(cuando);
    porDia.set(d, [...(porDia.get(d) ?? []), v]);
  }

  // Huecos vacíos de aquí al final de la rejilla.
  const vacios = new Map<string, string[]>();
  const hastaFin = Math.max(0, Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${hoy}T00:00:00Z`)) / 86_400_000));
  for (const c of CANALES) {
    for (const h of huecos(panel.settings.ritmo[c], new Date(), hastaFin)) {
      if ((porDia.get(h.dia) ?? []).some((v) => v.channel === c)) continue;
      vacios.set(h.dia, [...(vacios.get(h.dia) ?? []), c]);
    }
  }

  const titulo = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(locale, { month: "long", year: "numeric" });
  const hora = (iso: string) => new Date(iso).toLocaleTimeString(locale, { timeZone: ZONA, hour: "2-digit", minute: "2-digit" });

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head axr-pubpage-head--row">
        <div>
          <h1>{copy.calTitle}</h1>
          <p>{copy.calLead}</p>
        </div>
        {panel.porEstado.nevera ? <RellenarHuecos copy={copy} label={fill(copy.uFillAll, panel.porEstado.nevera)} /> : null}
      </div>

      <div className="axr-admin-card">
        <div className="axr-pub-cal__nav">
          <Link href={`?mes=${mesAnterior}`} className="axr-btn axr-btn--ghost">
            {copy.calPrev}
          </Link>
          <h2 style={{ border: 0, margin: 0, padding: 0, textTransform: "capitalize" }}>{titulo}</h2>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {mes !== hoy.slice(0, 7) ? (
              <Link href="?" className="axr-btn axr-btn--ghost">
                {copy.calToday}
              </Link>
            ) : null}
            <Link href={`?mes=${mesSiguiente}`} className="axr-btn axr-btn--ghost">
              {copy.calNext}
            </Link>
          </div>
        </div>

        <div className="axr-pub-cal">
          {copy.calWeekdays.map((w) => (
            <div key={w} className="axr-pub-cal__wd">
              {w}
            </div>
          ))}
          {dias.map((d) => {
            const fuera = !d.startsWith(mes);
            const items = (porDia.get(d) ?? []).sort((a, b) =>
              ((a.scheduled_at ?? a.published_at) ?? "").localeCompare((b.scheduled_at ?? b.published_at) ?? ""),
            );
            return (
              <div key={d} className={`axr-pub-cal__day${fuera ? " is-out" : ""}${d === hoy ? " is-today" : ""}${d < hoy ? " is-past" : ""}`}>
                <div className="axr-pub-cal__num">{Number(d.slice(8))}</div>
                {items.map((v) => (
                  <Link
                    key={v.id}
                    href={`/admin/publicaciones/${v.post_id}?canal=${v.channel}`}
                    className={`axr-pub-cal__item axr-pub-cal__item--${v.channel}${v.status === "publicado" ? " is-published" : ""}`}
                    title={`${NOMBRE_CANAL[v.channel]} · ${copy[`status_${v.status}`]} · ${v.title}`}
                  >
                    <span className="axr-pub-cal__time">{hora((v.scheduled_at ?? v.published_at)!)}</span> {v.title}
                  </Link>
                ))}
                {(vacios.get(d) ?? []).map((c) => (
                  <Link
                    key={c}
                    href={panel.cobertura[c as SocialChannel].nevera ? "/admin/publicaciones/nevera" : `/admin/publicaciones/nueva?canal=${c}`}
                    className={`axr-pub-cal__gap axr-pub-cal__gap--${c}`}
                    title={`${copy.calGap} · ${NOMBRE_CANAL[c as SocialChannel]} · ${panel.cobertura[c as SocialChannel].nevera ? copy.uFillFromFridge : copy.uCreate}`}
                  >
                    + {NOMBRE_CANAL[c as SocialChannel]}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>

        <div className="axr-pub-legend">
          <strong>{copy.calLegend}:</strong>
          {CANALES.map((c) => (
            <span key={c}>
              <span className={`axr-pub-dot axr-pub-dot--${c}`} /> {NOMBRE_CANAL[c]}
            </span>
          ))}
          <span>
            <span className="axr-pub-legend__gap" /> {copy.uGapLegend}
          </span>
          <span>✓ {copy.status_publicado}</span>
        </div>
      </div>
    </div>
  );
}
