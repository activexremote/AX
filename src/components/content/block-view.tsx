import type { Block, ChartKind } from "@/lib/content/blocks";
import { ChecklistBlock } from "@/components/content/checklist-block";

// ══════════════════════════════════════════════════════════
//  Cómo se pinta cada bloque
//
//  Un `switch` y nada más, como el del blog. Es aburrido a propósito: el
//  contenido lo escriben profesores y lo estructura un modelo, así que lo
//  que tiene que ser imposible es que algo de eso ejecute nada. Aquí sólo
//  entran cadenas de texto y números, y salen etiquetas.
//
//  Componente puro: no toca base de datos, ni cookies, ni sesión. Por eso
//  vale igual en la lección (servidor) y en la vista previa del panel
//  (navegador), y el profesor ve EXACTAMENTE lo que verá el alumno.
//
//  Los gráficos son SVG a mano, sin librería, por lo mismo que en /lens:
//  cuatro formas simples no justifican 90 kB de JavaScript, y en SVG se
//  pintan en el servidor y salen impresas si alguien imprime la lección.
// ══════════════════════════════════════════════════════════

/** Paleta de los gráficos. Contrastada y en el mismo orden que la del campus. */
const CAT = ["#7c5cff", "#00b3a4", "#ff6a3d", "#2f6fed", "#d61f9c", "#f1a208"] as const;

function color(i: number) {
  return CAT[i % CAT.length];
}

/** Número con separador español y su unidad pegada. */
function cifra(v: number, unit?: string) {
  const n = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(v);
  return unit ? `${n} ${unit}` : n;
}

// ── Gráficos ─────────────────────────────────────────────

function BarChart({ series, unit }: { series: { label: string; value: number }[]; unit?: string }) {
  // La escala arranca en cero SIEMPRE. Empezarla en el mínimo es el truco
  // más viejo para que una diferencia del 3 % parezca que triplica.
  const tope = Math.max(...series.map((s) => Math.abs(s.value)), 1);

  return (
    <ul className="axr-blk__bars">
      {series.map((s, i) => (
        <li key={`${s.label}-${i}`}>
          <span className="axr-blk__bars-label">{s.label}</span>
          <span className="axr-blk__bars-track">
            <span
              className="axr-blk__bars-fill"
              style={{ width: `${(Math.abs(s.value) / tope) * 100}%`, background: color(i) }}
            />
          </span>
          <span className="axr-blk__bars-value">{cifra(s.value, unit)}</span>
        </li>
      ))}
    </ul>
  );
}

function LineChart({ series, unit }: { series: { label: string; value: number }[]; unit?: string }) {
  const W = 640;
  const H = 220;
  const P = 28;
  const valores = series.map((s) => s.value);
  const max = Math.max(...valores, 0);
  const min = Math.min(...valores, 0);
  const span = max - min || 1;
  const x = (i: number) => P + (i * (W - P * 2)) / Math.max(series.length - 1, 1);
  const y = (v: number) => H - P - ((v - min) / span) * (H - P * 2);
  const puntos = series.map((s, i) => `${x(i)},${y(s.value)}`).join(" ");

  return (
    <div className="axr-blk__line">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={series.map((s) => `${s.label}: ${cifra(s.value, unit)}`).join(". ")}>
        {/* Tres guías, no una rejilla: sitúan la vista sin competir con el dato. */}
        {[0, 0.5, 1].map((p) => (
          <line key={p} x1={P} x2={W - P} y1={P + p * (H - P * 2)} y2={P + p * (H - P * 2)} className="axr-blk__line-grid" />
        ))}
        <polyline points={puntos} className="axr-blk__line-path" />
        {series.map((s, i) => (
          <circle key={`${s.label}-${i}`} cx={x(i)} cy={y(s.value)} r={4} className="axr-blk__line-dot" />
        ))}
      </svg>
      <ul className="axr-blk__line-legend">
        {series.map((s, i) => (
          <li key={`${s.label}-${i}`}>
            <strong>{cifra(s.value, unit)}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PieChart({ series, unit }: { series: { label: string; value: number }[]; unit?: string }) {
  const total = series.reduce((a, s) => a + s.value, 0) || 1;
  const R = 80;
  const C = 100;
  let acumulado = 0;

  // Un anillo y no un círculo: el agujero del centro deja sitio al total y
  // hace más fácil comparar los arcos entre sí.
  const arcos = series.map((s, i) => {
    const desde = (acumulado / total) * Math.PI * 2 - Math.PI / 2;
    acumulado += s.value;
    const hasta = (acumulado / total) * Math.PI * 2 - Math.PI / 2;
    const grande = hasta - desde > Math.PI ? 1 : 0;
    const p = (ang: number, r: number) => `${C + r * Math.cos(ang)},${C + r * Math.sin(ang)}`;
    // Una porción del 100 % no se puede dibujar con un arco (empieza y acaba
    // en el mismo punto): se pinta el anillo entero.
    const d =
      hasta - desde >= Math.PI * 2 - 0.0001
        ? `M ${C - R},${C} a ${R},${R} 0 1,0 ${R * 2},0 a ${R},${R} 0 1,0 ${-R * 2},0`
        : `M ${p(desde, R)} A ${R},${R} 0 ${grande},1 ${p(hasta, R)} L ${p(hasta, R * 0.58)} A ${R * 0.58},${R * 0.58} 0 ${grande},0 ${p(desde, R * 0.58)} Z`;
    return { d, s, i };
  });

  return (
    <div className="axr-blk__pie">
      <svg viewBox="0 0 200 200" role="img" aria-label={series.map((s) => `${s.label}: ${cifra(s.value, unit)}`).join(". ")}>
        {arcos.map(({ d, s, i }) => (
          <path key={`${s.label}-${i}`} d={d} fill={color(i)} />
        ))}
      </svg>
      <ul className="axr-blk__pie-legend">
        {series.map((s, i) => (
          <li key={`${s.label}-${i}`}>
            <span className="axr-blk__dot" style={{ background: color(i) }} aria-hidden />
            <span>{s.label}</span>
            <strong>
              {cifra(s.value, unit)}
              <em>{Math.round((s.value / total) * 100)} %</em>
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chart({ kind, ...rest }: { kind: ChartKind; series: { label: string; value: number }[]; unit?: string }) {
  if (kind === "line") return <LineChart {...rest} />;
  if (kind === "pie") return <PieChart {...rest} />;
  return <BarChart {...rest} />;
}

// ── El bloque ────────────────────────────────────────────

export function BlockView({ block, storageKey }: { block: Block; storageKey?: string }) {
  switch (block.t) {
    case "h":
      return block.level === 3 ? (
        <h3 className="axr-blk__h3">{block.text}</h3>
      ) : (
        // El id deja que el índice de la lección enlace a la sección.
        <h2 className="axr-blk__h2" id={slug(block.text)}>
          {block.text}
        </h2>
      );

    case "p":
      return <p className="axr-blk__p">{block.text}</p>;

    case "ul":
      return (
        <ul className="axr-blk__ul">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="axr-blk__ol">
          {block.items.map((it, i) => (
            <li key={i}>
              <span className="axr-blk__ol-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );

    case "checklist":
      return <ChecklistBlock title={block.title} items={block.items} storageKey={storageKey} />;

    case "checkpoint":
      return (
        <aside className="axr-blk__checkpoint">
          <strong>{block.title}</strong>
          <ul>
            {block.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </aside>
      );

    case "note":
      return (
        <aside className="axr-blk__note" data-kind={block.kind}>
          {block.title ? <strong>{block.title}</strong> : null}
          <p>{block.text}</p>
        </aside>
      );

    case "quote":
      return (
        <figure className="axr-blk__quote">
          <blockquote>{block.text}</blockquote>
          {block.by ? <figcaption>{block.by}</figcaption> : null}
        </figure>
      );

    case "table":
      return (
        <figure className="axr-blk__table">
          {/* La tabla se desplaza dentro de su caja: en un móvil, una tabla de
              cinco columnas o se desplaza o se sale de la pantalla. */}
          <div className="axr-blk__table-scroll">
            <table>
              <thead>
                <tr>
                  {block.head.map((h, i) => (
                    <th key={i} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((fila, i) => (
                  <tr key={i}>
                    {fila.map((celda, j) => (
                      <td key={j}>{celda}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );

    case "steps":
      return (
        <ol className="axr-blk__steps">
          {block.items.map((s, i) => (
            <li key={i}>
              <span className="axr-blk__steps-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                {s.title ? <strong>{s.title}</strong> : null}
                {s.text ? <p>{s.text}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      );

    case "pros":
      return (
        <div className="axr-blk__pros">
          {block.title ? <strong className="axr-blk__pros-title">{block.title}</strong> : null}
          <div className="axr-blk__pros-grid">
            <ul data-kind="pro">
              {block.pros.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
            <ul data-kind="con">
              {block.cons.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "compare":
      return (
        <div className="axr-blk__compare">
          {[block.left, block.right].map((lado, i) => (
            <div key={i} className="axr-blk__compare-side" data-side={i}>
              <strong>{lado.title}</strong>
              <ul>
                {lado.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "stats":
      return (
        <dl className="axr-blk__stats">
          {block.items.map((s, i) => (
            <div key={i}>
              <dt>{s.value}</dt>
              <dd>
                {s.label}
                {s.note ? <em>{s.note}</em> : null}
              </dd>
            </div>
          ))}
        </dl>
      );

    case "chart":
      return (
        <figure className="axr-blk__chart" data-kind={block.kind}>
          {block.title ? <figcaption className="axr-blk__chart-title">{block.title}</figcaption> : null}
          <Chart kind={block.kind} series={block.series} unit={block.unit} />
          {block.source ? <figcaption className="axr-blk__chart-src">{block.source}</figcaption> : null}
        </figure>
      );

    case "timeline":
      return (
        <ol className="axr-blk__timeline">
          {block.items.map((it, i) => (
            <li key={i}>
              <span className="axr-blk__timeline-when">{it.when}</span>
              <div>
                <strong>{it.title}</strong>
                {it.text ? <p>{it.text}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      );

    case "divider":
      return <hr className="axr-blk__divider" />;
  }
}

/** Ancla estable para los títulos, para que el índice pueda enlazarlos. */
function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function BlockList({ blocks, storageKey }: { blocks: Block[]; storageKey?: string }) {
  return (
    <div className="axr-blk">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} storageKey={storageKey ? `${storageKey}:${i}` : undefined} />
      ))}
    </div>
  );
}
