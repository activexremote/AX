import { pregunta, type Respuestas } from "@/lib/comercial/perfilado";

// ══════════════════════════════════════════════════════════
//  El análisis de los perfilados (sin IA)
//
//  Cuentas sencillas sobre lo que ha apuntado el equipo comercial: cómo se
//  reparte cada respuesta, cómo se comporta cada tipología de lead y unas
//  señales automáticas cuando algo pasa de un umbral. La lectura con IA
//  (acciones de /admin/comercial/analisis) parte de esto.
// ══════════════════════════════════════════════════════════

export type Barra = { k: string; t: string; n: number; pct: number };

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const tiene = (r: Respuestas, k: string, v: string) => (Array.isArray(r[k]) ? (r[k] as string[]).includes(v) : r[k] === v);

/** Cómo se reparte una pregunta entre los que la han contestado. */
export function distribucion(rs: Respuestas[], k: string): { total: number; barras: Barra[] } {
  const p = pregunta(k);
  if (!p || p.tipo === "escala") {
    const niveles = p?.tipo === "escala" ? p.niveles : [];
    const con = rs.filter((r) => typeof r[k] === "number");
    return {
      total: con.length,
      barras: niveles.map((t, i) => {
        const n = con.filter((r) => r[k] === i + 1).length;
        return { k: String(i + 1), t, n, pct: pct(n, con.length) };
      }),
    };
  }
  const con = rs.filter((r) => r[k] !== undefined);
  return {
    total: con.length,
    barras: p.opciones
      .map((o) => {
        const n = con.filter((r) => tiene(r, k, o.k)).length;
        return { k: o.k, t: o.t, n, pct: pct(n, con.length) };
      })
      .sort((a, b) => b.n - a.n),
  };
}

export function media(rs: Respuestas[], k: string): number | null {
  const v = rs.map((r) => r[k]).filter((x): x is number => typeof x === "number");
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}

// ── Las señales que se miran en cada tipología ──────────────

const POSITIVO = ["matricula", "seguimiento", "info"];
/** Dejó sus datos esperando otra cosa: el anuncio prometía algo que no somos. */
const esperabaOtraCosa = (r: Respuestas) =>
  ["ofertas_empleo", "formacion_gratis", "no_recordaba"].includes(String(r.esperaba)) || r.anuncio_recuerdo === "si_distinto";
const frenaPrecio = (r: Respuestas) => r.freno_precio === "principal" || r.freno_precio === "uno_mas";
const soloEducacion = (r: Respuestas) => typeof r.interes === "number" && r.interes <= 2;

export type Tipologia = {
  k: string;
  t: string;
  n: number;
  interes: number | null;
  encaje: number | null;
  positivo: number;
  precio: number;
  otraCosa: number;
  /** 0–100: interés y encaje medios y la parte que acaba bien. */
  puntuacion: number;
};

function puntuar(interes: number | null, encaje: number | null, positivo: number) {
  return Math.round((((interes ?? 1) - 1) / 4) * 35 + (((encaje ?? 1) - 1) / 4) * 35 + (positivo / 100) * 30);
}

export function porTipologia(rs: Respuestas[]): Tipologia[] {
  const p = pregunta("perfil");
  if (!p || p.tipo === "escala") return [];
  return p.opciones
    .map((o) => {
      const suyos = rs.filter((r) => r.perfil === o.k);
      const interes = media(suyos, "interes");
      const encaje = media(suyos, "encaje");
      const positivo = pct(suyos.filter((r) => POSITIVO.includes(String(r.resultado))).length, suyos.filter((r) => r.resultado).length);
      return {
        k: o.k,
        t: o.t,
        n: suyos.length,
        interes,
        encaje,
        positivo,
        precio: pct(suyos.filter(frenaPrecio).length, suyos.filter((r) => r.freno_precio && r.freno_precio !== "na").length),
        otraCosa: pct(suyos.filter(esperabaOtraCosa).length, suyos.filter((r) => r.esperaba || r.anuncio_recuerdo).length),
        puntuacion: puntuar(interes, encaje, positivo),
      };
    })
    .filter((t) => t.n > 0)
    .sort((a, b) => b.puntuacion - a.puntuacion || b.n - a.n);
}

/** La tipología a la que apuntar: la de mejor puntuación con un mínimo de casos. */
export function target(tipos: Tipologia[]): { tipo: Tipologia; pocosDatos: boolean } | null {
  if (!tipos.length) return null;
  const minimo = tipos.some((t) => t.n >= 3) ? 3 : 1;
  const tipo = tipos.filter((t) => t.n >= minimo).sort((a, b) => b.puntuacion - a.puntuacion)[0] ?? tipos[0];
  return { tipo, pocosDatos: tipo.n < 3 };
}

export type Indicadores = {
  perfilados: number;
  interes: number | null;
  encaje: number | null;
  soloEducacion: number;
  precio: number;
  otraCosa: number;
  positivo: number;
};

export function indicadores(rs: Respuestas[]): Indicadores {
  return {
    perfilados: rs.length,
    interes: media(rs, "interes"),
    encaje: media(rs, "encaje"),
    soloEducacion: pct(rs.filter(soloEducacion).length, rs.filter((r) => typeof r.interes === "number").length),
    precio: pct(rs.filter(frenaPrecio).length, rs.filter((r) => r.freno_precio && r.freno_precio !== "na").length),
    otraCosa: pct(rs.filter(esperabaOtraCosa).length, rs.filter((r) => r.esperaba || r.anuncio_recuerdo).length),
    positivo: pct(rs.filter((r) => POSITIVO.includes(String(r.resultado))).length, rs.filter((r) => r.resultado).length),
  };
}

export type Senal = { tono: "bad" | "warn" | "ok"; titulo: string; texto: string };

/**
 * Lo que salta a la vista sin IA: cada señal tiene un umbral y una lectura
 * de qué puede estar fallando en los anuncios. Con menos de 5 perfilados no
 * se dice nada: serían casualidades.
 */
export function senales(rs: Respuestas[], ind: Indicadores): Senal[] {
  if (rs.length < 5) return [];
  const s: Senal[] = [];
  const esperaba = distribucion(rs, "esperaba");
  const empleo = esperaba.barras.find((b) => b.k === "ofertas_empleo")?.pct ?? 0;
  const gratis = esperaba.barras.find((b) => b.k === "formacion_gratis")?.pct ?? 0;
  const noRecordaba = esperaba.barras.find((b) => b.k === "no_recordaba")?.pct ?? 0;

  if (ind.otraCosa >= 30)
    s.push({
      tono: "bad",
      titulo: `${ind.otraCosa} % dejó sus datos esperando otra cosa`,
      texto: "El anuncio promete (o deja entender) algo distinto de un programa de formación de pago. Hay que decir antes qué es, cuánto dura y que es de pago.",
    });
  if (empleo >= 25)
    s.push({
      tono: "bad",
      titulo: `${empleo} % creía que le íbamos a dar trabajo`,
      texto: "Los mensajes de «trabaja en remoto» se leen como oferta de empleo. Mejor hablar de aprender a conseguirlo y enseñar el método.",
    });
  if (gratis >= 20)
    s.push({ tono: "warn", titulo: `${gratis} % buscaba algo gratis`, texto: "El anuncio atrae a cazadores de recursos gratuitos. Mencionar que es un programa de pago filtra a quien no va a comprar." });
  if (noRecordaba >= 20)
    s.push({
      tono: "warn",
      titulo: `${noRecordaba} % no recordaba haber dejado sus datos`,
      texto: "Formularios demasiado fáciles (los de Meta se rellenan solos) o se tarda en llamar. Llamar antes y añadir una pregunta al formulario sube la calidad.",
    });
  if (ind.soloEducacion >= 40)
    s.push({
      tono: "bad",
      titulo: `${ind.soloEducacion} % sólo escuchaba por educación`,
      texto: "El anuncio consigue el dato pero no el interés: llega a gente a la que el tema no le importa de verdad. Hay que segmentar mejor o hacer el mensaje más concreto.",
    });
  if (ind.precio >= 30)
    s.push({
      tono: "warn",
      titulo: `El precio frena al ${ind.precio} %`,
      texto: "O llega gente sin presupuesto, o el valor no se ve antes de hablar de precio. Probar a enseñar el precio (o los plazos) en el anuncio para filtrar.",
    });
  if (ind.interes !== null && ind.interes >= 3.5 && ind.positivo >= 40)
    s.push({ tono: "ok", titulo: "Los leads llegan con interés", texto: "El interés medio y los que acaban en seguimiento o matrícula van bien: el mensaje encaja. Toca escalar lo que funciona." });
  return s;
}
