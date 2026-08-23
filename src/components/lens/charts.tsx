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
const GO = "#038632";

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

// ── El año, mes a mes ─────────────────────────────────────
/**
 * La imagen central: doce meses con lo que entra, lo que sale y si el mes
 * acaba en verde o en rojo.
 *
 * Es el único gráfico de la pantalla con columnas verticales, y tiene motivo:
 * el eje es el tiempo, que se lee de izquierda a derecha en cualquier
 * calendario del mundo. Ponerlo horizontal aquí sería el chiste privado.
 *
 * El acumulado NO va como línea encima. Llega a cifras seis veces mayores que
 * las de un mes, y meterlo en el mismo dibujo obligaría a un segundo eje —el
 * error más viejo de los gráficos— o a aplastar las columnas hasta que no se
 * lea ninguna. Va como número, debajo, que es donde se consulta.
 */
export function MonthlyPL({
  months,
  cumulative,
}: {
  months: {
    index: number;
    label: string;
    revenue: number;
    costs: number;
    profit: number;
    starts: number;
    running: number;
  }[];
  cumulative: number;
}) {
  const W = 340;
  const H = 64;
  const PAD_TOP = 9;
  const max = Math.max(...months.map((m) => Math.max(m.revenue, m.costs)), 1);
  const slot = W / 12;
  const barW = 5;
  const gap = 2;

  return (
    <figure className="axr-chart axr-pl">
      <svg viewBox={`0 0 ${W} ${PAD_TOP + H + 25}`} width="100%" role="img" aria-label="Ingresos y costes mes a mes">
        {months.map((m) => {
          const x = m.index * slot + slot / 2;
          const hR = (m.revenue / max) * H;
          const hC = (m.costs / max) * H;
          return (
            <g key={m.index}>
              {/* Mes con convocatoria en marcha: fondo tenue, para ver de un
                  vistazo cuándo hay clase y cuándo el negocio está parado. */}
              {m.running > 0 ? (
                <rect x={m.index * slot} y={0} width={slot} height={H + 4} fill="#f4f4f4" />
              ) : null}

              <rect
                x={x - barW - gap / 2}
                y={PAD_TOP + H - hR}
                width={barW}
                height={Math.max(1, hR)}
                fill={INK}
                rx={1.5}
              >
                <title>{`${m.label}: ingresos ${formatEUR(m.revenue)}`}</title>
              </rect>
              <rect
                x={x + gap / 2}
                y={PAD_TOP + H - hC}
                width={barW}
                height={Math.max(1, hC)}
                fill="#E4462F"
                rx={1.5}
              >
                <title>{`${m.label}: costes ${formatEUR(m.costs)}`}</title>
              </rect>

              {/* Banderita: aquí empieza un grupo. */}
              {m.starts > 0 ? <circle cx={x} cy={4} r={2.5} fill={INK} /> : null}

              {/* Resultado del mes: verde o rojo, sin cifras que no se leen. */}
              <rect
                x={m.index * slot + 2}
                y={PAD_TOP + H + 5}
                width={slot - 4}
                height={4}
                fill={m.profit >= 0 ? GO : LOSS}
              >
                <title>{`${m.label}: ${m.profit >= 0 ? "beneficio" : "pérdida"} ${formatEUR(m.profit)}`}</title>
              </rect>

              <text x={x} y={PAD_TOP + H + 21} textAnchor="middle" className="axr-pl__month">
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="axr-pl__legend">
        <span>
          <span className="axr-chart__dot" style={{ background: INK }} aria-hidden />
          Ingresos
        </span>
        <span>
          <span className="axr-chart__dot" style={{ background: "#E4462F" }} aria-hidden />
          Costes
        </span>
        <span>
          <span className="axr-pl__flag" aria-hidden />
          Arranca
        </span>
        <span>
          Acumulado <strong>{formatEUR(cumulative)}</strong>
        </span>
      </figcaption>
    </figure>
  );
}

// ── Tendencia de doce meses ───────────────────────────────
/** Doce columnas de una sola serie: para mirar la pendiente, no la cifra. */
export function TrendBars({
  months,
  color = INK,
}: {
  months: { index: number; label: string; value: number }[];
  color?: string;
}) {
  const W = 340;
  const H = 44;
  const max = Math.max(...months.map((m) => m.value), 1);
  const slot = W / 12;

  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} width="100%" role="img" aria-label="Evolución mes a mes">
      {months.map((m) => {
        const h = (m.value / max) * H;
        return (
          <g key={m.index}>
            <rect
              x={m.index * slot + slot * 0.22}
              y={H - h}
              width={slot * 0.56}
              height={Math.max(1, h)}
              fill={color}
              rx={1.5}
            >
              <title>{`${m.label}: ${formatEUR(m.value)}`}</title>
            </rect>
            <text x={m.index * slot + slot / 2} y={H + 11} textAnchor="middle" className="axr-pl__month">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── La caja a lo largo del año ────────────────────────────
/**
 * La línea que decide si el negocio llega a diciembre.
 *
 * Se dibuja con el cero SIEMPRE dentro del cuadro, aunque la caja no baje
 * nunca de él: sin esa referencia, una línea que sube no dice si sube por
 * encima o por debajo de quedarse sin dinero.
 */
export function CashLine({
  months,
  cashOnHand,
}: {
  months: { index: number; label: string; cash: number }[];
  cashOnHand: number;
}) {
  const W = 340;
  const H = 56;
  const puntos = [cashOnHand, ...months.map((m) => m.cash)];
  const max = Math.max(...puntos, 0);
  const min = Math.min(...puntos, 0);
  const span = max - min || 1;
  const y = (v: number) => H - ((v - min) / span) * H;
  const x = (i: number) => (i / (puntos.length - 1)) * W;

  const linea = puntos.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${linea} L ${W} ${y(min)} L 0 ${y(min)} Z`;
  const cero = y(0);
  const bajoCero = puntos.some((v) => v < 0);

  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} width="100%" role="img" aria-label="Caja mes a mes">
      <path d={area} fill={bajoCero ? "rgba(163,32,32,0.10)" : "rgba(3,134,50,0.10)"} />
      <line x1={0} y1={cero} x2={W} y2={cero} stroke="#c6c6c6" strokeWidth={1} strokeDasharray="3 3" />
      <path d={linea} fill="none" stroke={bajoCero ? LOSS : GO} strokeWidth={2} strokeLinejoin="round" />
      {months.map((m, i) => (
        <circle key={m.index} cx={x(i + 1)} cy={y(m.cash)} r={2.5} fill={m.cash < 0 ? LOSS : GO}>
          <title>{`${m.label}: ${formatEUR(m.cash)}`}</title>
        </circle>
      ))}
      <text x={0} y={H + 11} className="axr-pl__month" textAnchor="start">
        E
      </text>
      <text x={W} y={H + 11} className="axr-pl__month" textAnchor="end">
        D
      </text>
    </svg>
  );
}
