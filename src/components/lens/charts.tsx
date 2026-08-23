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
/** El rojo de la paleta, no el de los errores: aquí un pago no es un fallo. */
const COST = "#E4462F";

/**
 * Cifras cortas para poner ENCIMA de las columnas.
 *
 * Un "47.375 €" encima de una columna de 26 px de ancho no se lee: se
 * amontona con el de al lado y acaban siendo doce manchas. En miles se lee
 * cada uno, y para eso están: para saber de qué orden es cada mes sin tener
 * que pasar el dedo por encima. La cifra exacta sigue estando, en el título
 * emergente de cada columna.
 */
export function shortEUR(value: number): string {
  const v = Math.abs(value);
  if (v >= 1000) {
    const miles = v / 1000;
    // 47,4k por debajo de diez mil; 47k por encima. Dos cifras significativas
    // son las que caben y las que hacen falta.
    return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: miles < 10 ? 1 : 0 }).format(miles)}k`;
  }
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(v);
}

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
 * La imagen central: el dinero entrando y saliendo cada mes, y la caja
 * acumulándose debajo.
 *
 * ── Por qué arriba y abajo ──
 * Los cobros suben desde el cero y los pagos bajan. Con las dos series
 * apoyadas en la misma línea base se ve de un vistazo el mes que se come lo
 * que ingresa, que en dos columnas pegadas del mismo lado hay que deducirlo
 * comparando alturas. El primer palo es la inversión inicial, en negativo:
 * es el agujero del que sale todo lo demás.
 *
 * ── Por qué el acumulado va en su propia banda ──
 * Llega a cifras cinco veces mayores que las de un mes. Dibujarlo encima de
 * las columnas obligaría a un segundo eje —dos escalas en un mismo cuadro,
 * el error más viejo que hay en gráficos, y el que hace que dos series
 * parezcan cruzarse cuando no se rozan— o a aplastar las columnas hasta que
 * no se lea ninguna. Así que va debajo, en su banda, con el mismo eje de
 * meses: se sigue leyendo mes a mes, y cada cuadro tiene una sola escala.
 */
export function MonthlyPL({
  months,
  cumulative,
  initialInvestment = 0,
  openingCash = 0,
}: {
  months: {
    index: number;
    label: string;
    revenue: number;
    costs: number;
    profit: number;
    cash: number;
    starts: number;
    running: number;
  }[];
  cumulative: number;
  /** Desembolso del arranque, que se pinta como el primer palo en negativo. */
  initialInvestment?: number;
  /** Caja al empezar, ya con la inversión descontada. */
  openingCash?: number;
}) {
  const W = 340;
  const ETIQ = 9; // sitio para la cifra encima y debajo de las columnas
  const BARS = 88; // alto de la banda de columnas, etiquetas incluidas
  const LINE = 32; // alto de la banda del acumulado
  const GAP = 13; // sitio para las letras de los meses
  const H = BARS + GAP + LINE;

  // 13 huecos: la inversión inicial y los doce meses.
  const slots = 13;
  const slot = W / slots;
  const barW = Math.min(10, slot * 0.4);

  const maxUp = Math.max(...months.map((m) => m.revenue), 1);
  const maxDown = Math.max(...months.map((m) => m.costs), initialInvestment, 1);

  // Una sola escala para arriba y para abajo —los mismos euros por píxel—,
  // pero repartiendo el alto según lo que hay a cada lado. Con mitad y mitad,
  // unos pagos cinco veces menores que los cobros dejaban media gráfica en
  // blanco y las columnas rojas convertidas en rayas.
  const util = BARS - ETIQ * 2;
  const px = util / (maxUp + maxDown);
  const cero = ETIQ + maxUp * px;
  const alto = (v: number) => v * px;

  // Banda del acumulado, con su propia escala y el cero siempre dentro.
  const caja = [openingCash, ...months.map((m) => m.cash)];
  const cMax = Math.max(...caja, 0);
  const cMin = Math.min(...caja, 0);
  const cSpan = cMax - cMin || 1;
  const yCaja = (v: number) => BARS + GAP + LINE - ((v - cMin) / cSpan) * LINE;
  const xCaja = (i: number) => i * slot + slot / 2;
  const linea = caja.map((v, i) => `${i === 0 ? "M" : "L"} ${xCaja(i).toFixed(1)} ${yCaja(v).toFixed(1)}`).join(" ");
  const bajoCero = caja.some((v) => v < 0);

  return (
    <figure className="axr-chart axr-pl">
      <svg viewBox={`0 0 ${W} ${H + 4}`} width="100%" role="img" aria-label="Cobros, pagos y caja mes a mes">
        {/* Meses con clase en marcha: fondo tenue. */}
        {months.map((m) =>
          m.running > 0 ? (
            <rect key={`bg${m.index}`} x={(m.index + 1) * slot} y={0} width={slot} height={BARS} fill="#f4f4f4" />
          ) : null,
        )}

        {/* Línea del cero: es la referencia de todo el cuadro de arriba. */}
        <line x1={0} y1={cero} x2={W} y2={cero} stroke="#c6c6c6" strokeWidth={1} />

        {/* La inversión inicial, en negativo. */}
        {initialInvestment > 0 ? (
          <g>
            <rect
              x={slot / 2 - barW / 2}
              y={cero}
              width={barW}
              height={Math.max(1, alto(initialInvestment))}
              fill={COST}
              rx={1.5}
            >
              <title>{`Inversión inicial: ${formatEUR(-initialInvestment)}`}</title>
            </rect>
            <text
              x={slot / 2}
              y={cero + alto(initialInvestment) + 7}
              textAnchor="middle"
              className="axr-pl__value"
              fill={COST}
            >
              −{shortEUR(initialInvestment)}
            </text>
            <text x={slot / 2} y={BARS + 11} textAnchor="middle" className="axr-pl__month">
              INV
            </text>
          </g>
        ) : null}

        {months.map((m) => {
          const x = (m.index + 1) * slot + slot / 2;
          const hUp = alto(m.revenue);
          const hDown = alto(m.costs);
          return (
            <g key={m.index}>
              <rect x={x - barW / 2} y={cero - hUp} width={barW} height={Math.max(1, hUp)} fill={GO} rx={1.5}>
                <title>{`${m.label}: cobros ${formatEUR(m.revenue)}`}</title>
              </rect>
              {m.revenue > 0 ? (
                <text x={x} y={cero - hUp - 3} textAnchor="middle" className="axr-pl__value" fill={GO}>
                  {shortEUR(m.revenue)}
                </text>
              ) : null}

              <rect x={x - barW / 2} y={cero} width={barW} height={Math.max(1, hDown)} fill={COST} rx={1.5}>
                <title>{`${m.label}: pagos ${formatEUR(-m.costs)}`}</title>
              </rect>
              {m.costs > 0 ? (
                <text x={x} y={cero + hDown + 7} textAnchor="middle" className="axr-pl__value" fill={COST}>
                  {shortEUR(m.costs)}
                </text>
              ) : null}
              <text
                x={x}
                y={BARS + 11}
                textAnchor="middle"
                className="axr-pl__month"
                data-start={m.starts > 0 ? "" : undefined}
              >
                {m.label}
              </text>
            </g>
          );
        })}

        {/* ── Banda del acumulado ── */}
        <line
          x1={0}
          y1={yCaja(0)}
          x2={W}
          y2={yCaja(0)}
          stroke="#c6c6c6"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <path d={linea} fill="none" stroke={bajoCero ? LOSS : INK} strokeWidth={2} strokeLinejoin="round" />
        {caja.map((v, i) => (
          <circle key={i} cx={xCaja(i)} cy={yCaja(v)} r={2} fill={v < 0 ? LOSS : INK}>
            <title>{`${i === 0 ? "Al empezar" : months[i - 1].label}: caja ${formatEUR(v)}`}</title>
          </circle>
        ))}

        {/* Sólo dos cifras en la línea: de dónde sale y a dónde llega. Doce
            números pegados a una línea que sube son doce estorbos. */}
        <text x={xCaja(0) + 3} y={yCaja(caja[0]) - 5} className="axr-pl__value" textAnchor="start" fill={INK}>
          {shortEUR(caja[0])}
        </text>
        <text x={W} y={yCaja(caja[caja.length - 1]) - 5} className="axr-pl__value" textAnchor="end" fill={INK}>
          {shortEUR(caja[caja.length - 1])}
        </text>
      </svg>

      <figcaption className="axr-pl__legend">
        <span>
          <span className="axr-chart__dot" style={{ background: GO }} aria-hidden />
          Cobros
        </span>
        <span>
          <span className="axr-chart__dot" style={{ background: COST }} aria-hidden />
          Pagos
        </span>
        <span>
          <span className="axr-pl__line" aria-hidden />
          Caja acumulada
        </span>
        <span>
          <strong className="axr-pl__start">M</strong> arranca convocatoria
        </span>
        <span>
          Diciembre <strong>{formatEUR(cumulative)}</strong>
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
