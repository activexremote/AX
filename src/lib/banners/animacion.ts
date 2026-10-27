import { esNativo, lineasChat, puntos, type BannerCopy, type Composicion } from "@/lib/banners/formatos";
import type { Animar, Instante, Parte } from "@/lib/banners/pieza";

// ══════════════════════════════════════════════════════════
//  El banner en movimiento
//
//  El vídeo es la misma pieza (pieza.tsx) fotograma a fotograma: cada parte
//  entra a su hora (el logo, el titular, cada mensaje del chat, el botón…) y
//  la foto se acerca despacio. Lo usan los dos sitios donde se pinta:
//
//   · el editor, en el navegador, para ver la animación al momento;
//   · el servidor (video.tsx), que pinta cada fotograma y saca el MP4.
//
//  Sin IA: los textos son los de la pieza, con la tipografía de marca, y el
//  vídeo sale en segundos y gratis.
// ══════════════════════════════════════════════════════════

/** Cómo entran las partes. */
export const ESTILOS_VIDEO = ["sube", "lateral", "cae", "rapido"] as const;
export type EstiloVideo = (typeof ESTILOS_VIDEO)[number];

export const DURACIONES_VIDEO = [6, 10, 15] as const;
export type DuracionVideo = (typeof DURACIONES_VIDEO)[number];

export const FPS_VIDEO = 30;

export const leerEstiloVideo = (v: unknown, defecto: EstiloVideo = "sube"): EstiloVideo =>
  (ESTILOS_VIDEO as readonly unknown[]).includes(v) ? (v as EstiloVideo) : defecto;

export const leerDuracionVideo = (v: unknown): DuracionVideo => {
  const n = Number(v);
  return (DURACIONES_VIDEO as readonly number[]).includes(n) ? (n as DuracionVideo) : 6;
};

/** Variantes seguidas, estilos distintos: así un lote de vídeos no se mueve todo igual. */
export const estiloDeVariante = (posicion: number): EstiloVideo => ESTILOS_VIDEO[posicion % ESTILOS_VIDEO.length];

export type PlanVideo = {
  estilo: EstiloVideo;
  segundos: number;
  composicion: Composicion;
  copy: BannerCopy;
};

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const salida = (x: number) => 1 - (1 - x) ** 3;
const rebote = (x: number) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;
const suave = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

/** A qué segundo entra cada parte. */
function guion(plan: PlanVideo) {
  const rapido = plan.estilo === "rapido";
  const k = rapido ? 0.55 : 1;
  const nativo = esNativo(plan.composicion);
  // Sin `chat`, los nativos se arman con el titular y la línea de apoyo (pieza.tsx).
  const mensajes = nativo ? Math.max(lineasChat(plan.copy).length, 2) : 0;
  const nPuntos = puntos(plan.copy).length;

  const inicio = new Map<string, number>();
  const en = (parte: Parte, t: number, i = 0) => inicio.set(`${parte}:${i}`, t);
  // La tarjeta, antes que nada de lo que lleva dentro (y entera antes de que entre).
  en("tarjeta", 0.05);
  en("logo", 0.15 * k);
  en("ia", 0.25 * k);
  en("kicker", 0.55 * k);
  en("headline", 0.8 * k);
  let t = 1.35 * k;
  if (nativo) {
    // Los mensajes, uno detrás de otro, como si llegaran.
    for (let i = 0; i < mensajes; i++) en("chat", (1.2 + i * (rapido ? 0.5 : 0.95)) * (rapido ? 0.8 : 1), i);
    t = (1.2 + mensajes * (rapido ? 0.5 : 0.95)) * (rapido ? 0.8 : 1) + 0.1;
  }
  en("sub", t);
  t += 0.35 * k;
  for (let i = 0; i < 3; i++) en("points", t + i * 0.25 * k, i);
  t += Math.max(nPuntos, 0) * 0.25 * k;
  en("extra", t);
  t += 0.3 * k;
  en("cta", t);

  // Que todo haya entrado antes de las tres cuartas partes del vídeo.
  const fin = t + 0.6;
  const tope = plan.segundos * 0.72;
  if (fin > tope) for (const [key, v] of inicio) inicio.set(key, (v * tope) / fin);
  return { inicio, dur: rapido ? 0.35 : 0.6, cta: inicio.get("cta:0")!, mensajes };
}

/** Las partes en el orden en que entran: así las pinta el vídeo, capa a capa. */
export function ordenEntrada(plan: PlanVideo): [Parte, number][] {
  const g = guion(plan);
  return [...g.inicio.entries()]
    .map(([k, t]) => {
      const [p, i] = k.split(":");
      return { p: p as Parte, i: Number(i), t };
    })
    .filter((x) => x.p !== "chat" || x.i < g.mensajes)
    .sort((a, b) => a.t - b.t)
    .map((x) => [x.p, x.i]);
}

/** El fotograma del segundo `t`: dónde está cada parte. */
export function animar(plan: PlanVideo, t: number): Animar {
  const g = guion(plan);
  const u = clamp(t / plan.segundos);
  return (parte, i = 0): Instante => {
    if (parte === "foto") {
      // Se acerca despacio; en «lateral», además, se desliza.
      const z = suave(u);
      return { o: 1, zoom: 1.06 + 0.08 * z, ...(plan.estilo === "lateral" ? { x: 26 - 52 * z } : {}) };
    }
    const desde = g.inicio.get(`${parte}:${i}`) ?? 0;
    const e = clamp((t - desde) / g.dur);
    if (parte === "logo" || parte === "ia") return { o: salida(e) };
    if (parte === "chat") return e >= 1 ? { o: 1 } : { o: salida(e), y: 40 * (1 - salida(e)) };
    if (parte === "tarjeta") {
      const et = clamp((t - desde) / 0.45);
      return et >= 1 ? { o: 1 } : { o: salida(et), y: 90 * (1 - salida(et)) };
    }

    let m: Instante;
    if (e >= 1) m = { o: 1 };
    else if (plan.estilo === "lateral") m = { o: salida(e), x: -90 * (1 - salida(e)) };
    else if (plan.estilo === "cae") m = { o: clamp(e * 1.6), y: -60 * (1 - rebote(e)) };
    else m = { o: salida(e), y: (plan.estilo === "rapido" ? 70 : 50) * (1 - salida(e)) };

    // El botón, una vez dentro, da un saltito cada tres segundos para llamar la atención.
    if (parte === "cta" && e >= 1) {
      const p = (t - g.cta - g.dur - 0.8) % 3;
      if (t - g.cta - g.dur > 0.8 && p < 0.45) m = { o: 1, y: -12 * Math.sin((Math.PI * p) / 0.45) };
    }
    return m;
  };
}

/** Todas las partes de un fotograma en una cadena: dos fotogramas iguales no se pintan dos veces. */
export function huella(a: Animar, conFoto: boolean): string {
  const partes: [Parte, number][] = [
    ...(conFoto ? [["foto", 0] as [Parte, number]] : []),
    ["logo", 0],
    ["ia", 0],
    ["tarjeta", 0],
    ["kicker", 0],
    ["headline", 0],
    ["sub", 0],
    ["extra", 0],
    ["cta", 0],
    ...[0, 1, 2].map((i) => ["points", i] as [Parte, number]),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ["chat", i] as [Parte, number]),
  ];
  return JSON.stringify(partes.map(([p, i]) => a(p, i)));
}
