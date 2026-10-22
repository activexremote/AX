// ══════════════════════════════════════════════════════════
//  Qué se puede pedir al generador de banners
//
//  Sin nada de servidor: lo usan el formulario, el editor y el render.
//
//  Formatos: los tres de las carpetas de campaña del equipo. Las zonas
//  seguras son las de Meta (oct. 2026). En el formato historia se reserva el
//  35 % de abajo, que es lo que tapa la interfaz de Reels; el de Stories es
//  el 20 %, así que quien cumple con Reels cumple con los dos.
// ══════════════════════════════════════════════════════════

import type { AdCourse, AdObjective } from "@/lib/supabase/types";

export type FormatoId = "post" | "vertical" | "story";

export type Formato = {
  w: number;
  h: number;
  /** El nombre de la carpeta del equipo. */
  label: string;
  /** Prefijo del archivo descargado. */
  file: string;
  /** Dónde sale en Meta. */
  placements: string;
  /** Márgenes que no debe pisar nada importante, en px. */
  safe: { top: number; bottom: number; side: number };
};

export const FORMATOS: Record<FormatoId, Formato> = {
  post: {
    w: 1080,
    h: 1080,
    label: "POST (1080X1080)",
    file: "POST-1080x1080",
    placements: "Feed de Facebook e Instagram",
    safe: { top: 60, bottom: 60, side: 60 },
  },
  vertical: {
    w: 1080,
    h: 1350,
    label: "POST VERTICAL (1080X1350)",
    file: "POST-VERTICAL-1080x1350",
    placements: "Feed de Instagram y Facebook (el que más pantalla ocupa)",
    safe: { top: 68, bottom: 68, side: 60 },
  },
  story: {
    w: 1080,
    h: 1920,
    label: "STORY (1080X1920)",
    file: "STORY-1080x1920",
    placements: "Stories y Reels",
    safe: { top: 270, bottom: 672, side: 65 },
  },
};

export const FORMATO_IDS = Object.keys(FORMATOS) as FormatoId[];

// ── Plantillas ────────────────────────────────────────────
// `foto`: imagen a sangre con velo para el texto.
// `tarjeta`: imagen arriba, bloque blanco abajo (sistema público de marca).
// `marca`: sin foto, sobre el mesh del curso. No gasta imagen.
export type Plantilla = "foto" | "tarjeta" | "marca";
export const PLANTILLAS: Plantilla[] = ["foto", "tarjeta", "marca"];
export const usaImagen = (p: string) => p === "foto" || p === "tarjeta";

// ── Cursos y su acento (BRANDBOOK §5–6) ───────────────────
export const CURSOS: AdCourse[] = ["escuela", "remote-professional", "remote-founder"];

export const ACENTO: Record<AdCourse, { accent: string; mesh: string; grad: string; nombre: string }> = {
  escuela: {
    accent: "#5B4BF5",
    nombre: "ActiveXRemote",
    grad: "linear-gradient(140deg, #6D5CFF, #A855F7)",
    mesh:
      "radial-gradient(60% 85% at 12% 18%, #7B5CFF 0%, transparent 60%), radial-gradient(55% 75% at 88% 12%, #FF6A3D 0%, transparent 55%), radial-gradient(65% 85% at 78% 88%, #D61F9C 0%, transparent 58%), linear-gradient(160deg, #3A1F6E 0%, #241246 100%)",
  },
  "remote-professional": {
    accent: "#5B4BF5",
    nombre: "Remote Professional",
    grad: "linear-gradient(140deg, #6D5CFF, #A855F7)",
    mesh:
      "radial-gradient(60% 85% at 12% 18%, #7B5CFF 0%, transparent 60%), radial-gradient(55% 75% at 88% 12%, #2F6BFF 0%, transparent 55%), radial-gradient(65% 85% at 78% 88%, #A855F7 0%, transparent 58%), linear-gradient(160deg, #3A1F6E 0%, #241246 100%)",
  },
  "remote-founder": {
    accent: "#E4462F",
    nombre: "Remote Founder",
    grad: "linear-gradient(140deg, #FF7A3D, #E11D74)",
    mesh:
      "radial-gradient(60% 85% at 12% 18%, #FF7A3D 0%, transparent 60%), radial-gradient(55% 75% at 88% 12%, #F59E0B 0%, transparent 55%), radial-gradient(65% 85% at 78% 88%, #E11D74 0%, transparent 58%), linear-gradient(160deg, #4A1636 0%, #2A0F2C 100%)",
  },
};

/** Verde de acción (globals.scss → --axr-go): lo pulsable es verde en toda la marca. */
export const VERDE = "#038632";

export const OBJETIVOS: AdObjective[] = ["leads", "alcance", "retargeting"];

// ── Ángulos ───────────────────────────────────────────────
// Meta (Andromeda) trata como el mismo anuncio dos piezas casi iguales: lo
// que se diversifica es el ángulo, no una palabra. Cada variante de una
// campaña sale de un ángulo distinto.
export const ANGULOS = [
  "obstaculo",
  "aspiracion",
  "metodo",
  "directo",
  "herramientas",
  "convocatoria",
] as const;
export type Angulo = (typeof ANGULOS)[number];

// ── Llamadas a la acción ──────────────────────────────────
// Las mismas que ofrece el botón de Meta: lo que dice la pieza y lo que dice
// el botón del anuncio no se contradicen.
export const CTAS = {
  es: ["Más información", "Solicitar información", "Ver programa", "Inscribirme"],
  en: ["Learn more", "Get information", "See the programme", "Sign up"],
} as const;

export type BannerCopy = {
  kicker: string;
  headline: string;
  sub: string;
  cta: string;
  primaryText: string;
  adHeadline: string;
  description: string;
  alt: string;
};

export const COPY_VACIO: BannerCopy = {
  kicker: "",
  headline: "",
  sub: "",
  cta: "",
  primaryText: "",
  adHeadline: "",
  description: "",
  alt: "",
};

/** Lo que guarda la base de datos, normalizado: siempre todas las claves, siempre texto. */
export function leerCopy(raw: unknown): BannerCopy {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...COPY_VACIO };
  for (const k of Object.keys(COPY_VACIO) as (keyof BannerCopy)[]) {
    out[k] = typeof o[k] === "string" ? (o[k] as string).trim() : "";
  }
  return out;
}

/** Límites recomendados para los textos de Meta (los que se ven sin «Ver más»). */
export const LIMITES = {
  primaryText: 125,
  adHeadline: 40,
  description: 30,
  headlineWords: 10,
} as const;
