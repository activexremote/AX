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

// ── Composiciones ─────────────────────────────────────────
// Dónde va cada cosa en la pieza: lo que hace que dos variantes no parezcan
// la misma aunque compartan plantilla. Cada variante de una campaña sale con
// una distinta; en el editor se cambia sin pagar nada.
//   clasica   · textos abajo a la izquierda (la de siempre)
//   centrado  · todo centrado, titular en medio
//   arriba    · titular arriba, la imagen respira abajo, botón al pie
//   panel     · imagen y un bloque de color partidos
//   marco     · la imagen enmarcada como una foto sobre papel
//   cinta     · el titular en una banda diagonal
//   gigante   · titular enorme en mayúsculas sobre color
//   bocadillo · el titular en un bocadillo, aire de meme
//   revista   · portada: cabecera grande, marco fino, todo centrado
export const COMPOSICIONES = ["clasica", "centrado", "arriba", "panel", "marco", "cinta", "gigante", "bocadillo", "revista"] as const;
export type Composicion = (typeof COMPOSICIONES)[number];
export const leerComposicion = (v: unknown): Composicion => ((COMPOSICIONES as readonly unknown[]).includes(v) ? (v as Composicion) : "clasica");

/** `n` composiciones distintas al azar; primero las que la campaña aún no usa. */
export function repartirComposiciones(n: number, usadas: string[] = []): Composicion[] {
  const azar = <T,>(a: T[]) => a.slice().sort(() => Math.random() - 0.5);
  const orden = [...azar(COMPOSICIONES.filter((c) => !usadas.includes(c))), ...azar(COMPOSICIONES.filter((c) => usadas.includes(c)))];
  return Array.from({ length: n }, (_, i) => orden[i % orden.length]);
}

// ── El botón ──────────────────────────────────────────────
// La llamada a la acción se puede pintar de muchas maneras: forma, color,
// icono y tamaño. Cada variante de una campaña sale con un botón distinto
// (otro motivo para que no parezcan la misma pieza) y en el editor se cambia.
// Es una etiqueta de la pieza: no imita ningún botón de la interfaz de Meta.
export const BOTON_FORMAS = ["pastilla", "redondeado", "recto", "contorno", "subrayado", "pegatina"] as const;
export const BOTON_COLORES = ["verde", "violeta", "coral", "amarillo", "blanco", "negro"] as const;
export const BOTON_ICONOS = ["flecha", "circulo", "ninguno"] as const;
export const BOTON_TAMANOS = ["s", "m", "l"] as const;
export type BotonEstilo = {
  forma: (typeof BOTON_FORMAS)[number];
  color: (typeof BOTON_COLORES)[number];
  icono: (typeof BOTON_ICONOS)[number];
  tam: (typeof BOTON_TAMANOS)[number];
};
export const BOTON_POR_DEFECTO: BotonEstilo = { forma: "pastilla", color: "verde", icono: "flecha", tam: "m" };
export const BOTON_HEX: Record<BotonEstilo["color"], string> = {
  verde: "#038632",
  violeta: "#5B4BF5",
  coral: "#E4462F",
  amarillo: "#FFD84D",
  blanco: "#FFFFFF",
  negro: "#161326",
};

export function leerBoton(raw: unknown): BotonEstilo {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const de = <T extends string>(lista: readonly T[], v: unknown, d: T): T => ((lista as readonly unknown[]).includes(v) ? (v as T) : d);
  return {
    forma: de(BOTON_FORMAS, o.forma, BOTON_POR_DEFECTO.forma),
    color: de(BOTON_COLORES, o.color, BOTON_POR_DEFECTO.color),
    icono: de(BOTON_ICONOS, o.icono, BOTON_POR_DEFECTO.icono),
    tam: de(BOTON_TAMANOS, o.tam, BOTON_POR_DEFECTO.tam),
  };
}

/** Botones de partida que se distinguen bien entre sí: uno distinto por variante. */
const BOTONES_VARIADOS: BotonEstilo[] = [
  { forma: "pastilla", color: "verde", icono: "flecha", tam: "m" },
  { forma: "pastilla", color: "blanco", icono: "flecha", tam: "m" },
  { forma: "recto", color: "amarillo", icono: "flecha", tam: "l" },
  { forma: "contorno", color: "blanco", icono: "ninguno", tam: "m" },
  { forma: "redondeado", color: "violeta", icono: "circulo", tam: "m" },
  { forma: "pastilla", color: "negro", icono: "circulo", tam: "s" },
  { forma: "pegatina", color: "coral", icono: "flecha", tam: "l" },
  { forma: "subrayado", color: "blanco", icono: "flecha", tam: "m" },
  { forma: "redondeado", color: "verde", icono: "ninguno", tam: "l" },
  { forma: "pegatina", color: "amarillo", icono: "circulo", tam: "m" },
];

const claveBoton = (b: BotonEstilo) => `${b.forma}-${b.color}-${b.icono}`;

/** `n` botones distintos; primero los que la campaña aún no usa. */
export function repartirBotones(n: number, usados: unknown[] = []): BotonEstilo[] {
  const ya = new Set(usados.map((u) => claveBoton(leerBoton(u))));
  const azar = <T,>(a: T[]) => a.slice().sort(() => Math.random() - 0.5);
  const orden = [...azar(BOTONES_VARIADOS.filter((b) => !ya.has(claveBoton(b)))), ...azar(BOTONES_VARIADOS.filter((b) => ya.has(claveBoton(b))))];
  return Array.from({ length: n }, (_, i) => orden[i % orden.length]);
}

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

/** Etiqueta de imagen de IA (AI Act art. 50 · Meta «Info de IA»). Apagada por defecto: se enciende desde el editor. */
export const ETIQUETA_IA = { es: "Imagen generada con IA", en: "AI-generated image" } as const;

export type BannerCopy = {
  kicker: string;
  headline: string;
  sub: string;
  cta: string;
  /** Línea destacada opcional («Empieza el 9 de enero»). */
  extra: string;
  /** Puntos opcionales, uno por línea (máximo 3). */
  points: string;
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
  extra: "",
  points: "",
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

/** Los puntos como lista, sin vacíos. */
export const puntos = (c: BannerCopy) => c.points.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 3);

// ── Elementos de la pieza ─────────────────────────────────
// Lo que se puede encender y apagar desde el editor sin tocar la imagen.
// En la base de datos sólo se guarda lo que cambia respecto a esto.
export const ELEMENTOS = ["logo", "kicker", "headline", "sub", "extra", "points", "cta", "aiLabel"] as const;
export type Elemento = (typeof ELEMENTOS)[number];
export type Elementos = Record<Elemento, boolean>;

export const ELEMENTOS_POR_DEFECTO: Elementos = {
  logo: true,
  kicker: true,
  headline: true,
  sub: true,
  extra: false,
  points: false,
  cta: true,
  aiLabel: false,
};

export function leerElementos(raw: unknown): Elementos {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = { ...ELEMENTOS_POR_DEFECTO };
  for (const k of ELEMENTOS) if (typeof o[k] === "boolean") out[k] = o[k] as boolean;
  return out;
}

/** Lo que se guarda: sólo las diferencias con lo de por defecto. */
export function difElementos(e: Elementos): Partial<Elementos> {
  const out: Partial<Elementos> = {};
  for (const k of ELEMENTOS) if (e[k] !== ELEMENTOS_POR_DEFECTO[k]) out[k] = e[k];
  return out;
}

/** El otro idioma de una campaña bilingüe. */
export const otroIdioma = (l: "es" | "en"): "es" | "en" => (l === "es" ? "en" : "es");

/** Límites recomendados para los textos de Meta (los que se ven sin «Ver más»). */
export const LIMITES = {
  primaryText: 125,
  adHeadline: 40,
  description: 30,
  headlineWords: 10,
} as const;
