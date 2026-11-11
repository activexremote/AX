"use client";

import { useState } from "react";

// ══════════════════════════════════════════════════════════
//  Las gráficas del panel de KPIs
//
//  En HTML y CSS, sin librería: columnas por día (apiladas si hay varias
//  series), barras horizontales y una línea mínima para las cifras. Lo fijo
//  en todas: barras finas con la punta redondeada y la base recta, 2 px de
//  aire entre segmentos, rejilla de un pelo y el texto siempre en los grises
//  del panel (el color sólo lo llevan las marcas). Cada columna es su propia
//  zona de hover y de foco, con la ficha de todas las series de ese día; y
//  todo lo que dice la ficha está también en «Ver tabla».
// ══════════════════════════════════════════════════════════

export type Formato = "n" | "eur";
export type Serie = { label: string; color: string; values: number[] };

function formatter(fmt: Formato, locale: string) {
  const tag = locale === "en" ? "en-IE" : "es-ES";
  if (fmt === "eur") {
    const f = new Intl.NumberFormat(tag, { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 0, useGrouping: "always" });
    return (v: number) => f.format(v);
  }
  const f = new Intl.NumberFormat(tag, { maximumFractionDigits: 1, useGrouping: "always" });
  return (v: number) => f.format(v);
}

/** Un techo redondo para el eje: 1, 2, 5 × 10ⁿ. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

const diaCorto = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", { timeZone: "UTC", day: "numeric", month: "short" }).format(new Date(`${iso}T00:00:00Z`));

export function Columnas({
  days,
  series,
  fmt = "n",
  locale,
  label,
  tablaLabel,
  diaLabel,
}: {
  days: string[];
  series: Serie[];
  fmt?: Formato;
  locale: string;
  /** Lo que se ve en la gráfica, para el lector de pantalla. */
  label: string;
  tablaLabel: string;
  diaLabel: string;
}) {
  const [activo, setActivo] = useState<number | null>(null);
  const f = formatter(fmt, locale);
  const totales = days.map((_, i) => series.reduce((s, x) => s + (x.values[i] ?? 0), 0));
  const max = niceMax(Math.max(...totales));
  // En recuentos, la marca del medio va redondeada: «2,5 leads» no existe.
  const ticks = [max, fmt === "n" && max > 1 ? Math.round(max / 2) : max / 2, 0];

  return (
    <figure className="axr-kg" aria-label={label}>
      {series.length > 1 ? (
        <div className="axr-kg__legend">
          {series.map((s) => (
            <span key={s.label}>
              <i style={{ background: s.color }} aria-hidden />
              {s.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="axr-kg__frame">
        <div className="axr-kg__axis" aria-hidden>
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / max) * 100}%` }}>
              {f(t)}
            </span>
          ))}
        </div>
        <div className="axr-kg__plot" onPointerLeave={() => setActivo(null)}>
          {ticks.map((t) => (
            <span key={t} className="axr-kg__grid" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden />
          ))}
          {days.map((d, i) => (
            <div
              key={d}
              className={`axr-kg__slot${activo === i ? " is-on" : ""}`}
              tabIndex={0}
              role="img"
              aria-label={`${diaCorto(d, locale)}: ${series.map((s) => `${s.label} ${f(s.values[i] ?? 0)}`).join(", ")}`}
              onPointerEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              onBlur={() => setActivo(null)}
            >
              <div className="axr-kg__col" style={{ height: `${(totales[i] / max) * 100}%` }}>
                {series.map((s) =>
                  s.values[i] ? <span key={s.label} style={{ flexGrow: s.values[i], background: s.color }} /> : null,
                )}
              </div>
            </div>
          ))}
          {activo !== null ? (
            <div className={`axr-kg__tip${activo > days.length / 2 ? " is-left" : ""}`} style={{ left: `${((activo + 0.5) / days.length) * 100}%` }} role="status">
              <small>{diaCorto(days[activo], locale)}</small>
              {series.map((s) => (
                <span key={s.label}>
                  <i style={{ background: s.color }} aria-hidden />
                  <strong>{f(s.values[activo] ?? 0)}</strong> {s.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="axr-kg__x" aria-hidden>
        <span>{diaCorto(days[0], locale)}</span>
        <span>{diaCorto(days[Math.floor(days.length / 2)], locale)}</span>
        <span>{diaCorto(days[days.length - 1], locale)}</span>
      </div>

      <details className="axr-kg__table">
        <summary>{tablaLabel}</summary>
        <div className="axr-admin-scroll">
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{diaLabel}</th>
                {series.map((s) => (
                  <th key={s.label}>{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d}>
                  <td>{diaCorto(d, locale)}</td>
                  {series.map((s) => (
                    <td key={s.label}>{f(s.values[i] ?? 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/** Una lista de barras horizontales, de mayor a menor, con el valor en la punta (la más larga llega al 82 %: deja sitio a la cifra). */
export function Barras({ rows, color, fmt = "n", locale }: { rows: { label: string; value: number; extra?: string }[]; color: string; fmt?: Formato; locale: string }) {
  const f = formatter(fmt, locale);
  const max = Math.max(...rows.map((r) => r.value), 0) || 1;
  return (
    <ul className="axr-kb">
      {rows.map((r) => (
        <li key={r.label}>
          <span className="axr-kb__label">{r.label}</span>
          <span className="axr-kb__track">
            <span className="axr-kb__bar" style={{ width: `${Math.max((r.value / max) * 82, r.value ? 2 : 0)}%`, background: color }} />
            <span className="axr-kb__value">
              {f(r.value)}
              {r.extra ? <small> · {r.extra}</small> : null}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** La tendencia de una cifra: la línea en gris y el último punto en el color de acento. */
export function Linea({ values, label }: { values: number[]; label: string }) {
  const w = 120;
  const h = 32;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * (w - 6) + 3, h - 3 - (v / max) * (h - 6)] as const);
  const last = pts[pts.length - 1];
  return (
    <svg className="axr-kl" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#b9b9c2" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {last ? <circle cx={last[0]} cy={last[1]} r={4} fill="#5b4bf5" stroke="#ffffff" strokeWidth={2} /> : null}
    </svg>
  );
}
