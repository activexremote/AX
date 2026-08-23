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
  dense,
}: {
  slices: Slice[];
  total: number;
  caption?: string;
  /** Leyenda a dos columnas y sin pie: para el informe, que va apretado. */
  dense?: boolean;
}) {
  const visibles = slices.filter((s) => s.value > 0);
  const suma = visibles.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <figure className="axr-chart" data-dense={dense ? "" : undefined}>
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

      {caption && !dense ? <figcaption>{caption}</figcaption> : null}
      <span className="axr-chart__sr">Total: {formatEUR(total)}</span>
    </figure>
  );
}

// ── Barras comparadas ─────────────────────────────────────
/**
 * Una fila por cosa: nombre, cifra, barra y un renglón de contexto.
 *
 * Sirve igual para los cursos del año que para el reparto entre socios: en
 * los dos casos la pregunta es la misma —quién se lleva cuánto de este
 * total—, y repetir la misma forma es lo que hace que la segunda no haya que
 * aprenderla.
 */
export function MiniBars({
  rows,
}: {
  rows: { key: string; label: string; meta?: string; value: number; color: string }[];
}) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 1);

  return (
    <ul className="axr-mini">
      {rows.map((r) => (
        <li key={r.key}>
          {/* El contexto va en la MISMA línea que el nombre, no debajo: un
              renglón extra por fila son doce píxeles, y con cuatro filas se
              sale de la pantalla justo por eso. */}
          <div className="axr-mini__head">
            <span>
              <span className="axr-chart__dot" style={{ background: r.color }} aria-hidden />
              {r.label}
              {r.meta ? <em>{r.meta}</em> : null}
            </span>
            <span>{formatEUR(r.value)}</span>
          </div>
          <div className="axr-mini__track" title={`${r.label}: ${formatEUR(r.value)}`}>
            <div
              className="axr-mini__fill"
              style={{ width: `${(Math.abs(r.value) / max) * 100}%`, background: r.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Las 52 semanas del año y cuántas ocupan las convocatorias.
 *
 * Es la comprobación de realidad que ningún número da: cinco convocatorias de
 * doce semanas son sesenta, y sesenta semanas no caben en un año por mucho
 * que la hoja de cálculo sume.
 */
export function Capacity({ weeksBusy, weeksOver }: { weeksBusy: number; weeksOver: number }) {
  const pct = Math.min(100, (weeksBusy / 52) * 100);
  const over = weeksOver > 0;

  return (
    <div className="axr-mini axr-mini--capacity">
      <div className="axr-mini__head">
        <span>Semanas ocupadas</span>
        <span style={over ? { color: LOSS } : undefined}>{Math.round(weeksBusy)} / 52</span>
      </div>
      <div className="axr-mini__track">
        <div className="axr-mini__fill" style={{ width: `${pct}%`, background: over ? LOSS : INK }} />
      </div>
      <div className="axr-mini__meta" data-alert={over ? "" : undefined}>
        {over
          ? `Te pasas ${Math.round(weeksOver)} semanas: o solapas convocatorias, o quitas una.`
          : `Quedan ${Math.round(52 - weeksBusy)} semanas libres.`}
      </div>
    </div>
  );
}
