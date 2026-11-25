import { Icono } from "@/components/admin/publicaciones/iconos";

// El medidor de media luna y la barra fina de las páginas de análisis
// (/admin/comercial/analisis, /admin/dry-run/<id>/encuesta). Los estilos van
// en app/admin/comercial/analisis/analisis.scss, bajo .axr-la.

export const coma = (n: number | null, d = 1) => (n === null ? "—" : n.toFixed(d).replace(".", ","));

/**
 * Un medidor de media luna. `bueno` dice hacia dónde es mejor: arriba o abajo.
 * `min` para escalas que no empiezan en 0 (el NPS va de -100 a 100); con
 * `sufijo` vacío se enseña el número solo, sin «/max».
 */
export function Medidor({ titulo, valor, min = 0, max, sufijo, bueno, ayuda, umbral }: {
  titulo: string;
  valor: number | null;
  min?: number;
  max: number;
  sufijo: string;
  bueno: "alto" | "bajo";
  ayuda: string;
  umbral: [number, number];
}) {
  const p = valor === null ? 0 : Math.max(0, Math.min(100, ((valor - min) / (max - min)) * 100));
  const [a, b] = umbral;
  const tono =
    valor === null ? "neutro" : bueno === "alto" ? (valor >= b ? "ok" : valor >= a ? "warn" : "bad") : valor <= a ? "ok" : valor <= b ? "warn" : "bad";
  const etiqueta = { ok: "Bien", warn: "Regular", bad: "Mal", neutro: "Sin datos" }[tono];
  return (
    <div className={`axr-la-gauge is-${tono}`} title={ayuda}>
      <svg viewBox="0 0 120 68" aria-hidden>
        <path d="M10 62 A50 50 0 0 1 110 62" pathLength={100} className="axr-la-gauge__track" />
        <path d="M10 62 A50 50 0 0 1 110 62" pathLength={100} className="axr-la-gauge__val" strokeDasharray={`${p} 100`} />
      </svg>
      <strong>
        {valor === null ? "—" : sufijo === "%" || sufijo === "" ? Math.round(valor) : coma(valor)}
        {sufijo === "" ? null : <small>{sufijo === "%" ? " %" : `/${max}`}</small>}
      </strong>
      <span className="axr-la-gauge__t">{titulo}</span>
      <span className={`axr-la-status is-${tono}`}>
        <Icono n={tono === "ok" ? "ok" : tono === "bad" ? "error" : tono === "warn" ? "aviso" : "info"} size={12} /> {etiqueta}
      </span>
    </div>
  );
}

/** Barra horizontal fina con su valor al lado. */
export function Bar({ v, max, texto, tip }: { v: number | null; max: number; texto: string; tip: string }) {
  const p = v === null ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
  return (
    <span className="axr-la-bar" title={tip}>
      <span aria-hidden>
        <span style={{ width: `${p}%` }} />
      </span>
      <small>{texto}</small>
    </span>
  );
}

