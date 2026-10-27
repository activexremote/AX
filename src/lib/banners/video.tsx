import "server-only";

import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import ffmpeg from "ffmpeg-static";
import type { ReactElement } from "react";
import satori from "satori";
import sharp from "sharp";

import { animar, estiloDeVariante, FPS_VIDEO, huella, leerDuracionVideo, leerEstiloVideo, ordenEntrada, type EstiloVideo } from "@/lib/banners/animacion";
import { slugArchivo, type PiezaCargada } from "@/lib/banners/cargar";
import { FORMATOS } from "@/lib/banners/formatos";
import { Banner, fuentes, type Pieza } from "@/lib/banners/render";
import type { Animar, Parte } from "@/lib/banners/pieza";

// ══════════════════════════════════════════════════════════
//  La pieza en MP4
//
//  El vídeo es la pieza de siempre (pieza.tsx, la misma que el PNG) con las
//  partes entrando a su hora (animacion.ts). Pintar la pieza entera en cada
//  fotograma cuesta medio segundo por fotograma: un vídeo de 15 s serían
//  minutos. Así que se pinta por capas, una vez, y cada fotograma se monta
//  en memoria:
//
//   · el fondo: la pieza sin ninguna parte. Pintado dos veces, con la foto
//     en negro y en blanco, sale lo que va encima de la foto (velos, marcos)
//     y cuánto de la foto deja ver cada píxel. Con la foto de verdad sale la
//     foto sola, que en cada fotograma se acerca un poco (Ken Burns) dentro
//     de su caja, sea cual sea la composición;
//   · cada parte (logo, titular, cada mensaje, el botón…): la pieza con las
//     anteriores y sin ella, contra la pieza con ella. Lo que cambia es la
//     capa; con el mismo truco del negro y el blanco sale su transparencia,
//     así una sombra de texto se funde bien con la foto en movimiento.
//
//  Cada fotograma: el fondo con la foto en su zoom, y encima cada capa con su
//  opacidad y su desplazamiento del instante. Los fotogramas van crudos (RGB)
//  a ffmpeg y sale un MP4 H.264, el que aceptan Meta, TikTok y LinkedIn. Sin
//  sonido: los anuncios se ven en silencio, y la música la pone cada red.
//
//  satori va fijado a la versión que lleva dentro next/og, para que el vídeo
//  sea exactamente el PNG. ffmpeg viene en ffmpeg-static (un binario por
//  plataforma, que se baja al instalar); next.config.ts lo lleva a la función.
// ══════════════════════════════════════════════════════════

export type OpcionesVideo = { estilo: EstiloVideo; segundos: number };

type PiezaFija = Omit<Pieza, "anim" | "fuente" | "texto" | "editando">;

/**
 * La respuesta de las rutas de vídeo (la del panel y la del conector):
 *   ?e=sube|lateral|cae|rapido  (por defecto, según la variante)  &s=6|10|15  &dl=1
 */
export async function respuestaVideo(r: PiezaCargada, sp: URLSearchParams): Promise<Response> {
  const estilo = leerEstiloVideo(sp.get("e"), estiloDeVariante(r.banner.position));
  const segundos = leerDuracionVideo(sp.get("s"));
  let mp4: Buffer;
  try {
    mp4 = await videoDePieza(r.pieza, { estilo, segundos });
  } catch (e) {
    console.error("[banners] vídeo", e);
    return new Response("No se ha podido hacer el vídeo.", { status: 500 });
  }
  const headers = new Headers({ "Content-Type": "video/mp4", "Content-Length": String(mp4.length), "Cache-Control": "private, no-store" });
  if (sp.get("dl")) {
    const { file } = FORMATOS[r.formato];
    headers.set("Content-Disposition", `attachment; filename="${file}_${slugArchivo(r.campaign.name)}_v${r.banner.position + 1}_${r.pieza.language.toUpperCase()}_${segundos}s.mp4"`);
  }
  return new Response(new Uint8Array(mp4), { headers });
}

/** Un píxel de color: la foto en negro o en blanco. */
const LISO = async (v: number) =>
  `data:image/png;base64,${(await sharp({ create: { width: 2, height: 2, channels: 3, background: { r: v, g: v, b: v } } }).png().toBuffer()).toString("base64")}`;

/** Una capa: el rectángulo donde está, su color ya multiplicado por su opacidad y su opacidad. */
type Capa = { parte: Parte; i: number; x0: number; y0: number; w: number; h: number; pm: Uint8Array; a: Uint8Array };

/** La foto, lista para acercarla: la foto sola, cuánto se ve en cada píxel y su caja. */
type Foto = { plano: Uint8Array; t: Uint8Array; x0: number; y0: number; x1: number; y1: number };

export async function videoDePieza(pieza: PiezaFija, opts: OpcionesVideo): Promise<Buffer> {
  if (!ffmpeg) throw new Error("ffmpeg no está disponible en este servidor.");
  const { w, h } = FORMATOS[pieza.formato];
  const fonts = await fuentes();
  const plan = { estilo: opts.estilo, segundos: opts.segundos, composicion: pieza.composicion ?? "clasica", copy: pieza.copy };
  const conFoto = Boolean(pieza.imagen) && pieza.template !== "marca";
  const orden = ordenEntrada(plan);

  /** La pieza en RGB crudo, con sólo las partes de `ve` y la foto que toque. */
  const pintar = async (ve: Set<string>, imagen: string | null): Promise<Uint8Array> => {
    const anim: Animar = (parte, i = 0) => (parte === "foto" || ve.has(`${parte}:${i}`) ? { o: 1 } : { o: 0 });
    const el = (<Banner {...pieza} imagen={imagen} anim={anim} />) as ReactElement;
    const svg = await satori(el, { width: w, height: h, fonts });
    const raw = await sharp(Buffer.from(svg)).flatten({ background: "#000000" }).removeAlpha().raw().toBuffer();
    return new Uint8Array(raw.buffer, raw.byteOffset, raw.length);
  };

  const [negro, blanco] = conFoto ? await Promise.all([LISO(0), LISO(255)]) : [null, null];
  const fotoNegra = conFoto ? negro : pieza.imagen;

  // ── El fondo ──
  const vacio = new Set<string>();
  const [fondoN, fondoB, fondoF] = await Promise.all([
    pintar(vacio, fotoNegra),
    conFoto ? pintar(vacio, blanco) : null,
    conFoto ? pintar(vacio, pieza.imagen) : null,
  ]);
  const foto = fondoB && fondoF ? separarFoto(fondoN, fondoB, fondoF, w, h) : null;

  // ── Las capas, en el orden en que entran ──
  const capas: Capa[] = [];
  let prev: [Uint8Array, Uint8Array | null] = [fondoN, fondoB];
  const ve = new Set<string>();
  for (const [parte, i] of orden) {
    ve.add(`${parte}:${i}`);
    const cur = await Promise.all([pintar(new Set(ve), fotoNegra), conFoto ? pintar(new Set(ve), blanco) : null]);
    const capa = extraerCapa(prev[0], prev[1], cur[0], cur[1], w, h);
    if (capa) capas.push({ parte, i, ...capa });
    prev = cur;
  }

  // ── Los fotogramas, a ffmpeg ──
  const dir = await mkdtemp(path.join(os.tmpdir(), "axr-video-"));
  const salida = path.join(dir, "pieza.mp4");
  try {
    const proc = spawn(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel", "error",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", `${w}x${h}`,
        "-framerate", String(FPS_VIDEO),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-y", salida,
      ],
      { stdio: ["pipe", "ignore", "pipe"] },
    );
    let errores = "";
    proc.stderr.on("data", (d) => (errores += String(d)));
    proc.stdin.on("error", () => {}); // si ffmpeg se cae, lo cuenta su salida, no un EPIPE
    const termina = once(proc, "close");

    const total = Math.round(opts.segundos * FPS_VIDEO);
    let anterior = "";
    let frame: Uint8Array | null = null;
    for (let k = 0; k < total && proc.exitCode === null; k++) {
      const anim = animar(plan, k / FPS_VIDEO);
      const firma = huella(anim, conFoto);
      if (firma !== anterior || !frame) {
        frame = componer(fondoN, foto, capas, anim, w, h);
        anterior = firma;
      }
      if (!proc.stdin.write(frame)) await Promise.race([once(proc.stdin, "drain"), termina]);
    }
    proc.stdin.end();
    const [code] = await termina;
    if (code !== 0) throw new Error(`ffmpeg: ${errores.trim().slice(0, 300) || `salió con ${code}`}`);
    return await readFile(salida);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/**
 * La foto, despegada de lo que lleva encima. Con la foto en negro sale lo de
 * encima (N); en blanco, cuánto deja ver cada píxel (T = B − N); con la de
 * verdad (F), la foto sola: (F − N) / T.
 */
function separarFoto(n: Uint8Array, b: Uint8Array, f: Uint8Array, w: number, h: number): Foto | null {
  const t = new Uint8Array(n.length);
  const plano = new Uint8Array(n.length);
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  for (let p = 0, k = 0; p < w * h; p++, k += 3) {
    let visible = false;
    for (let c = 0; c < 3; c++) {
      const tt = Math.max(0, b[k + c] - n[k + c]);
      t[k + c] = tt;
      if (tt > 2) {
        visible = true;
        plano[k + c] = Math.min(255, Math.max(0, Math.round(((f[k + c] - n[k + c]) * 255) / tt)));
      }
    }
    if (visible) {
      const x = p % w;
      const y = (p / w) | 0;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return x1 < 0 ? null : { plano, t, x0, y0, x1, y1 };
}

/**
 * Lo que cambia de una pieza a la siguiente (antes → con la parte nueva), con
 * su transparencia. Con el fondo en negro y en blanco: a = 1 − ΔC / ΔB, y el
 * color ya multiplicado, C − (1 − a)·B. Donde el fondo no depende de la foto
 * (un fondo liso, otra tarjeta), la capa va opaca: debajo siempre hay lo mismo.
 */
function extraerCapa(pn: Uint8Array, pb: Uint8Array | null, cn: Uint8Array, cb: Uint8Array | null, w: number, h: number) {
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  const cambia = (k: number) =>
    Math.abs(cn[k] - pn[k]) > 2 || Math.abs(cn[k + 1] - pn[k + 1]) > 2 || Math.abs(cn[k + 2] - pn[k + 2]) > 2 ||
    (pb && cb ? Math.abs(cb[k] - pb[k]) > 2 || Math.abs(cb[k + 1] - pb[k + 1]) > 2 || Math.abs(cb[k + 2] - pb[k + 2]) > 2 : false);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!cambia((y * w + x) * 3)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) return null;
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;
  const pm = new Uint8Array(cw * ch * 3);
  const a = new Uint8Array(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const k = ((y + y0) * w + (x + x0)) * 3;
      if (!cambia(k)) continue;
      const q = y * cw + x;
      let alfa = 1;
      if (pb && cb) {
        const dB = pb[k] + pb[k + 1] + pb[k + 2] - pn[k] - pn[k + 1] - pn[k + 2];
        // Sólo con fondo que depende de la foto lo bastante como para medirlo.
        if (dB > 72) alfa = Math.min(1, Math.max(0, 1 - (cb[k] + cb[k + 1] + cb[k + 2] - cn[k] - cn[k + 1] - cn[k + 2]) / dB));
      }
      if (alfa <= 0.004) continue;
      a[q] = Math.round(alfa * 255);
      for (let c = 0; c < 3; c++) pm[q * 3 + c] = Math.min(255, Math.max(0, Math.round(cn[k + c] - (1 - alfa) * pn[k + c])));
    }
  }
  return { x0, y0, w: cw, h: ch, pm, a };
}

/** Dónde cae cada fila o columna de la caja al acercar: los dos píxeles de origen y el peso del segundo (0–256). */
function ejes(desde: number, hasta: number, centro: number, z: number, d: number) {
  const n = hasta - desde + 1;
  const a = new Int32Array(n);
  const b = new Int32Array(n);
  const p = new Int32Array(n);
  for (let j = 0; j < n; j++) {
    const s = Math.min(hasta, Math.max(desde, centro + (desde + j - centro - d) / z));
    const s0 = Math.floor(s);
    a[j] = s0;
    b[j] = Math.min(hasta, s0 + 1);
    p[j] = Math.round((s - s0) * 256);
  }
  return { a, b, p };
}

/** Un fotograma: el fondo, la foto con su zoom y cada capa donde esté. */
function componer(fondo: Uint8Array, foto: Foto | null, capas: Capa[], anim: Animar, w: number, h: number): Uint8Array {
  const out = new Uint8Array(fondo);

  if (foto) {
    // La foto se acerca hacia el centro de su caja: lo que se ve sigue dentro de la caja.
    const m = anim("foto");
    const z = m.zoom ?? 1;
    const { plano, t, x0, y0, x1, y1 } = foto;
    const cols = ejes(x0, x1, (x0 + x1) / 2, z, m.x ?? 0);
    const filas = ejes(y0, y1, (y0 + y1) / 2, z, m.y ?? 0);
    const ca = cols.a;
    const cb = cols.b;
    const cp = cols.p;
    for (let y = y0; y <= y1; y++) {
      const j = y - y0;
      const fa = filas.a[j] * w;
      const fb = filas.b[j] * w;
      const py = filas.p[j];
      const qy = 256 - py;
      let k = (y * w + x0) * 3;
      for (let i = 0; i <= x1 - x0; i++, k += 3) {
        const t0 = t[k];
        const t1 = t[k + 1];
        const t2 = t[k + 2];
        if ((t0 | t1 | t2) === 0) continue;
        const px = cp[i];
        const qx = 256 - px;
        const k00 = (fa + ca[i]) * 3;
        const k01 = (fa + cb[i]) * 3;
        const k10 = (fb + ca[i]) * 3;
        const k11 = (fb + cb[i]) * 3;
        // Bilineal en enteros: pesos de 0 a 256 en cada eje → 0 a 65536.
        const v0 = ((plano[k00] * qx + plano[k01] * px) * qy + (plano[k10] * qx + plano[k11] * px) * py) >>> 16;
        const v1 = ((plano[k00 + 1] * qx + plano[k01 + 1] * px) * qy + (plano[k10 + 1] * qx + plano[k11 + 1] * px) * py) >>> 16;
        const v2 = ((plano[k00 + 2] * qx + plano[k01 + 2] * px) * qy + (plano[k10 + 2] * qx + plano[k11 + 2] * px) * py) >>> 16;
        // v·t/255 sin dividir: ×257 y >>16. Uint8Array no satura: se recorta a mano.
        const r0 = fondo[k] + ((v0 * t0 * 257 + 32896) >>> 16);
        const r1 = fondo[k + 1] + ((v1 * t1 * 257 + 32896) >>> 16);
        const r2 = fondo[k + 2] + ((v2 * t2 * 257 + 32896) >>> 16);
        out[k] = r0 > 255 ? 255 : r0;
        out[k + 1] = r1 > 255 ? 255 : r1;
        out[k + 2] = r2 > 255 ? 255 : r2;
      }
    }
  }

  for (const capa of capas) {
    const m = anim(capa.parte, capa.i);
    if (m.o <= 0.004) continue;
    const ox = Math.round(m.x ?? 0);
    const oy = Math.round(m.y ?? 0);
    // Opacidad del instante en 0–256, para no dividir en cada píxel.
    const o = Math.round(Math.min(1, m.o) * 256);
    const { pm, a } = capa;
    const xi = Math.max(0, -(capa.x0 + ox));
    const xf = Math.min(capa.w, w - capa.x0 - ox);
    for (let y = 0; y < capa.h; y++) {
      const ty = capa.y0 + y + oy;
      if (ty < 0 || ty >= h) continue;
      let q = y * capa.w + xi;
      let k = (ty * w + capa.x0 + ox + xi) * 3;
      for (let x = xi; x < xf; x++, q++, k += 3) {
        const al = a[q];
        if (al === 0) continue;
        // resto = 1 − alfa·o, en 0–65536.
        const resto = 65536 - al * o - ((al * o) >>> 8);
        const q3 = q * 3;
        out[k] = (pm[q3] * o * 256 + out[k] * resto + 32768) >>> 16;
        out[k + 1] = (pm[q3 + 1] * o * 256 + out[k + 1] * resto + 32768) >>> 16;
        out[k + 2] = (pm[q3 + 2] * o * 256 + out[k + 2] * resto + 32768) >>> 16;
      }
    }
  }
  return out;
}
