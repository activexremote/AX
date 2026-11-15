import { ACTIVIDADES_M01 } from "@/lib/actividades/m01";
import type { Actividad, Campo, Respuestas, Resultado } from "@/lib/actividades/tipos";

// ══════════════════════════════════════════════════════════
//  El catálogo de actividades y lo que se calcula con ellas
//
//  Sin nada de servidor: lo usa el formulario (para validar antes de enviar)
//  y la acción que guarda (para validar de verdad y calcular el resultado).
// ══════════════════════════════════════════════════════════

export const ACTIVIDADES: Actividad[] = [...ACTIVIDADES_M01];

const porClave = new Map(ACTIVIDADES.map((a) => [a.key, a]));

export const actividad = (key: string) => porClave.get(key) ?? null;

/** Las actividades de una lección, en el orden del catálogo. */
export const actividadesDe = (moduloSlug: string, orden: number) => ACTIVIDADES.filter((a) => a.modulo === moduloSlug && a.leccion === orden);

export const actividadesDelModulo = (moduloSlug: string) => ACTIVIDADES.filter((a) => a.modulo === moduloSlug);

export const modulosConActividades = () => [...new Set(ACTIVIDADES.map((a) => a.modulo))];

type Pregunta = Exclude<Campo, { tipo: "seccion" }>;
export const preguntas = (a: Actividad) => a.campos.filter((c): c is Pregunta => c.tipo !== "seccion");

const vacio = (v: string | string[] | undefined) => (Array.isArray(v) ? v.length === 0 : !v || !v.trim());

const esUrl = (v: string) => {
  try {
    const u = new URL(v.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/** Las claves de las preguntas que faltan o están mal, para marcarlas en el formulario. */
export function errores(a: Actividad, r: Respuestas): Record<string, "falta" | "url"> {
  const out: Record<string, "falta" | "url"> = {};
  for (const c of preguntas(a)) {
    const v = r[c.k];
    if (vacio(v)) {
      if (!c.opcional) out[c.k] = "falta";
      continue;
    }
    if (c.tipo === "url" && typeof v === "string" && !esUrl(v)) out[c.k] = "url";
  }
  return out;
}

/**
 * Se queda sólo con lo que la actividad pregunta y con valores que existen:
 * lo que llega del navegador no se guarda tal cual.
 */
export function limpiar(a: Actividad, r: Respuestas): Respuestas {
  const out: Respuestas = {};
  for (const c of preguntas(a)) {
    const v = r[c.k];
    if (v === undefined) continue;
    if (c.tipo === "multiple") {
      const validas = new Set(c.opciones.map((o) => o.v));
      const lista = (Array.isArray(v) ? v : [v]).filter((x) => validas.has(x));
      out[c.k] = lista;
      const otra = r[`${c.k}__otra`];
      if (c.otra && typeof otra === "string" && otra.trim()) out[`${c.k}__otra`] = otra.trim().slice(0, 200);
      continue;
    }
    const s = (Array.isArray(v) ? v[0] : v) ?? "";
    if (c.tipo === "opcion" && !c.opciones.some((o) => o.v === s)) continue;
    if (c.tipo === "sino" && s !== "si" && s !== "no") continue;
    if (c.tipo === "escala") {
      const n = Number(s);
      if (!Number.isInteger(n) || n < c.min || n > c.max) continue;
    }
    const max = c.tipo === "texto" || c.tipo === "parrafo" ? (c.max ?? 2000) : 1000;
    out[c.k] = s.slice(0, max);
  }
  return out;
}

const pct = (p: number, m: number) => (m ? Math.round((p / m) * 100) : 0);

/** Lo que se le enseña al enviar: la nota de un test, el estadio de un diagnóstico, los aciertos del juego. */
export function calcular(a: Actividad, r: Respuestas): Resultado | null {
  if (a.tipo === "diagnostico") {
    const porBloque = new Map<string, { puntos: number; max: number }>();
    let puntos = 0;
    let max = 0;
    for (const c of preguntas(a)) {
      let pts = 0;
      let top = 0;
      if (c.tipo === "opcion") {
        top = Math.max(...c.opciones.map((o) => o.puntos ?? 0));
        pts = c.opciones.find((o) => o.v === r[c.k])?.puntos ?? 0;
      } else if (c.tipo === "escala") {
        top = c.max - c.min;
        const n = Number(r[c.k]);
        pts = Number.isFinite(n) ? Math.max(0, n - c.min) : 0;
      } else continue;
      puntos += pts;
      max += top;
      const b = "bloque" in c && c.bloque ? c.bloque : "_";
      const acc = porBloque.get(b) ?? { puntos: 0, max: 0 };
      acc.puntos += pts;
      acc.max += top;
      porBloque.set(b, acc);
    }
    const total = pct(puntos, max);
    const estadios = a.estadios ?? [];
    let estadio = 0;
    estadios.forEach((e, i) => {
      if (total >= e.desde) estadio = i;
    });
    return {
      puntos,
      max,
      pct: total,
      estadio,
      bloques: (a.bloques ?? []).map((b) => {
        const v = porBloque.get(b.k) ?? { puntos: 0, max: 0 };
        return { k: b.k, puntos: v.puntos, max: v.max, pct: pct(v.puntos, v.max) };
      }),
    };
  }
  if (a.tipo === "test" || a.tipo === "juego") {
    const aciertos: Record<string, boolean> = {};
    let puntos = 0;
    let max = 0;
    for (const c of preguntas(a)) {
      if (c.tipo !== "opcion") continue;
      const buena = a.tipo === "test" ? c.correcta : c.mejor;
      if (!buena) continue;
      max += 1;
      aciertos[c.k] = r[c.k] === buena;
      if (aciertos[c.k]) puntos += 1;
    }
    const total = pct(puntos, max);
    return { puntos, max, pct: total, aciertos, aprobado: a.aprobado ? total >= a.aprobado : undefined };
  }
  return null;
}
