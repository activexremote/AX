"use client";

import { formatEUR, formatPct } from "@/lib/lens/calculadora";

// ══════════════════════════════════════════════════════════
//  Gráficos de Lens
// ══════════════════════════════════════════════════════════
//
//  SVG a mano, sin librería. No es cabezonería: una librería de gráficos pesa
//  más que toda esta pantalla junta, y aquí sólo hacen falta tres formas.
//
//  ── La paleta ──
//  Seis colores en ORDEN FIJO, uno por concepto. Nunca se ciclan ni se
//  reparten por tamaño: el morado es captación en todos los gráficos de la
//  pantalla, y si un concepto desaparece los demás NO se recolorean. Ese es
//  el motivo de que se pueda leer un gráfico habiendo entendido otro.
//
//  Están validados para daltonismo (separación mínima ΔE 12,7 en deutan y
//  protan, y 28,8 en tritan) sobre fondo blanco. Dos de ellos —el turquesa y
//  el ámbar— se quedan justo por debajo de 3:1 de contraste, así que el color
//  NUNCA es el único canal: todos los gráficos llevan su leyenda con el
//  nombre y la cifra al lado.
//
//  El verde de marca queda fuera de la paleta a propósito: significa una sola
//  cosa, el beneficio, y mezclarlo con las categorías le quitaría ese
//  significado.
export const CAT = {
  captacion: "#5B4BF5",
  variables: "#E4462F",
  pasarela: "#0FA3B1",
  profesorado: "#B3187F",
  comercial: "#2F6BFF",
  estructura: "#E8A33D",
} as const;

/** Para los socios, el mismo orden fijo: el socio 1 siempre es el morado. */
export const CAT_ORDER = Object.values(CAT);

const INK = "#161616";
const HELPER = "#6f6f6f";
const GO = "#038632";
const LOSS = "#a32020";

export type Slice = { key: string; label: string; value: number; color: string };

// ── Barra 100 % apilada ───────────────────────────────────
/**
 * A dónde va cada euro que entra.
 *
 * Una sola barra: la comparación es entre partes de un mismo total, y para
 * eso una barra apilada se lee de un vistazo también en un móvil, donde una
 * tarta obliga a comparar ángulos con el pulgar encima.
 */
export function StackedBar({
  slices,
  total,
  caption,
}: {
  slices: Slice[];
  total: number;
  caption?: string;
}) {
  const visibles = slices.filter((s) => s.value > 0);
  const suma = visibles.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <figure className="axr-chart">
      <div className="axr-chart__stack" role="img" aria-label={caption ?? "Reparto"}>
        {visibles.map((s) => {
          const pct = (s.value / suma) * 100;
          return (
            <span
              key={s.key}
              className="axr-chart__stack-seg"
              style={{ width: `${pct}%`, background: s.color }}
              title={`${s.label}: ${formatEUR(s.value)} (${formatPct(pct)})`}
            />
          );
        })}
      </div>

      <ul className="axr-chart__legend">
        {visibles.map((s) => (
          <li key={s.key}>
            <span className="axr-chart__dot" style={{ background: s.color }} aria-hidden />
            <span className="axr-chart__legend-label">{s.label}</span>
            <span className="axr-chart__legend-value">{formatEUR(s.value)}</span>
            <span className="axr-chart__legend-pct">{formatPct((s.value / suma) * 100, 0)}</span>
          </li>
        ))}
      </ul>

      {caption ? <figcaption>{caption}</figcaption> : null}
      <span className="axr-chart__sr">Total: {formatEUR(total)}</span>
    </figure>
  );
}

// ── Cascada ───────────────────────────────────────────────
/**
 * De la facturación al beneficio, restando por bloques.
 *
 * Horizontal y no vertical: en un móvil, una cascada vertical deja las
 * etiquetas de canto o partidas, y aquí el nombre de cada resta importa tanto
 * como su tamaño.
 */
export function Waterfall({
  rows,
}: {
  rows: { key: string; label: string; value: number; color?: string; kind?: "total" | "result" }[];
}) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);

  return (
    <figure className="axr-chart">
      <ul className="axr-chart__waterfall">
        {rows.map((r) => {
          const pct = Math.min(100, (Math.abs(r.value) / max) * 100);
          const color =
            r.kind === "result" ? (r.value >= 0 ? GO : LOSS) : r.kind === "total" ? INK : (r.color ?? HELPER);
          return (
            <li key={r.key} data-kind={r.kind}>
              <div className="axr-chart__wf-head">
                <span>
                  <span className="axr-chart__dot" style={{ background: color }} aria-hidden />
                  {r.label}
                </span>
                <span style={r.kind === "result" ? { color } : undefined}>{formatEUR(r.value)}</span>
              </div>
              <div className="axr-chart__wf-track">
                <div className="axr-chart__wf-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

// ── Anillo ────────────────────────────────────────────────
/**
 * El reparto entre socios, con el total en el centro.
 *
 * Aquí sí un anillo: son pocas porciones, de un mismo total, y lo que se mira
 * es "cuánto de la tarta es mío", que es justo lo que un anillo contesta.
 */
export function Donut({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: Slice[];
  centerLabel: string;
  centerValue: string;
}) {
  const size = 168;
  const r = 62;
  const stroke = 22;
  const c = 2 * Math.PI * r;
  const suma = slices.reduce((a, s) => a + Math.max(0, s.value), 0);

  let offset = 0;

  return (
    <figure className="axr-chart axr-chart--donut">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${centerLabel}: ${centerValue}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e0e0e0" strokeWidth={stroke} />
        {suma > 0
          ? slices.map((s) => {
              const frac = Math.max(0, s.value) / suma;
              const dash = frac * c;
              // 2 px de hueco entre porciones: sin él, dos colores contiguos
              // se leen como uno solo cuando la porción es fina.
              const el = (
                <circle
                  key={s.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${Math.max(0, dash - 2)} ${c - Math.max(0, dash - 2)}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                >
                  <title>{`${s.label}: ${formatEUR(s.value)}`}</title>
                </circle>
              );
              offset += dash;
              return el;
            })
          : null}
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="axr-chart__donut-value">
          {centerValue}
        </text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" className="axr-chart__donut-label">
          {centerLabel}
        </text>
      </svg>

      <ul className="axr-chart__legend">
        {slices.map((s) => (
          <li key={s.key}>
            <span className="axr-chart__dot" style={{ background: s.color }} aria-hidden />
            <span className="axr-chart__legend-label">{s.label}</span>
            <span className="axr-chart__legend-value">{formatEUR(s.value)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ── Barras comparadas ─────────────────────────────────────
/** Una fila por curso: convocatorias, alumnos y facturación del año. */
export function CourseBars({
  rows,
}: {
  rows: { id: string; name: string; intakes: number; students: number; revenue: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.revenue), 1);

  return (
    <figure className="axr-chart">
      <ul className="axr-chart__courses">
        {rows.map((r, i) => (
          <li key={r.id}>
            <div className="axr-chart__wf-head">
              <span>
                <span className="axr-chart__dot" style={{ background: CAT_ORDER[i % CAT_ORDER.length] }} aria-hidden />
                {r.name}
              </span>
              <span>{formatEUR(r.revenue)}</span>
            </div>
            <div className="axr-chart__wf-track">
              <div
                className="axr-chart__wf-fill"
                style={{ width: `${(r.revenue / max) * 100}%`, background: CAT_ORDER[i % CAT_ORDER.length] }}
              />
            </div>
            <div className="axr-chart__courses-meta">
              {r.intakes} {r.intakes === 1 ? "convocatoria" : "convocatorias"} · {Math.round(r.students)} alumnos
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ── Calendario del año ────────────────────────────────────
/**
 * Las 52 semanas del año y cuántas ocupan las convocatorias.
 *
 * Es la comprobación de realidad que ningún número da: cinco convocatorias de
 * doce semanas son sesenta, y sesenta semanas no caben en un año por mucho
 * que la hoja de cálculo sume.
 */
export function YearCapacity({ weeksBusy, weeksOver }: { weeksBusy: number; weeksOver: number }) {
  const pct = Math.min(100, (weeksBusy / 52) * 100);
  const over = weeksOver > 0;

  return (
    <figure className="axr-chart">
      <div className="axr-chart__wf-head">
        <span>Semanas del año con convocatoria en marcha</span>
        <span style={over ? { color: LOSS } : undefined}>
          {Math.round(weeksBusy)} / 52
        </span>
      </div>
      <div className="axr-chart__wf-track" data-tall="">
        <div
          className="axr-chart__wf-fill"
          style={{ width: `${pct}%`, background: over ? LOSS : INK }}
        />
      </div>
      <figcaption>
        {over
          ? `No caben: te pasas ${Math.round(weeksOver)} semanas. O solapas convocatorias, o quitas una.`
          : `Quedan ${Math.round(52 - weeksBusy)} semanas sin convocatoria en marcha.`}
      </figcaption>
    </figure>
  );
}
