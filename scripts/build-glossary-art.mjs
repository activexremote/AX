#!/usr/bin/env node
// Genera las marcas del diccionario en public/glosario/.
//
//   node --experimental-strip-types scripts/build-glossary-art.mjs
//
// ── Qué se corrigió ───────────────────────────────────────
// La versión anterior eran fichas de tinta con esquina recta y formas macizas
// de trazo 9. Ese es el lenguaje del CAMPUS (Carbon monocromo, radio 0), no el
// del sitio público, que va de lavanda suave, radios de 12-26 px y gradientes.
// Por eso desentonaban: no era cuestión de gusto, era el sistema equivocado.
//
// ── El sistema ────────────────────────────────────────────
// Cada término es una MARCA, no un diagrama: una masa geométrica rellena con
// el gradiente de su área y una línea de tinta encima que le da el significado.
//
//                 Blog                     Diccionario
//   formato       800×450 apaisado         320×320 cuadrado
//   registro      diagrama que explica     marca que identifica
//   color         acento plano             gradiente de marca
//   fondo         lavanda + retícula       lavanda liso
//   trazo         fino (2)                 medio (7), miter
//
// Los dos usan la misma paleta pública, así que se reconocen de la misma casa
// sin confundirse entre sí.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "glosario");
const SZ = 320;
const C = SZ / 2;

const INK = "#161326";
const SOFT = "#F4F3FB";

// Un gradiente por área, todos derivados de los tres del brandbook. Seis
// áreas y seis gradientes: el área se reconoce por color antes de leer nada.
const GRADS = {
  modalidad: ["#6D5CFF", "#A855F7"],
  empleo: ["#5B4BF5", "#7C6BFF"],
  legal: ["#2F6BFF", "#14B8C4"],
  fiscal: ["#3D7BFF", "#6D5CFF"],
  negocio: ["#FF7A3D", "#E11D74"],
  stack: ["#FF9A3D", "#FF5A5A"],
};

/**
 * Chasis.
 *
 * `g` es la masa con gradiente y `k` la línea de tinta. Van en ese orden
 * porque la línea siempre tiene que leerse por encima del color.
 */
function tile(glyph, cat, label) {
  const [a, b] = GRADS[cat] ?? GRADS.modalidad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SZ} ${SZ}" width="${SZ}" height="${SZ}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="${SZ}" height="${SZ}" fill="${SOFT}"/>
  <g transform="translate(${C} ${C})">
${glyph}
  </g>
</svg>
`;
}

// Masa con gradiente.
const G = (body) => `    <g fill="url(#g)" stroke="none">${body}</g>`;
// Línea de tinta: trazo medio, uniforme, esquina recta (regla de iconografía).
const K = (body, w = 7) =>
  `    <g fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="butt">${body}</g>`;
// Tinta maciza, para los pocos casos en que el peso es el mensaje.
const KF = (body) => `    <g fill="${INK}" stroke="none">${body}</g>`;

// ══════════════════════════════════════════════════════════
//  Las 34 marcas
//
//  Cada una parte de una forma dominante distinta —círculo, cuadrado,
//  triángulo, banda, red— para que no se confundan entre sí de un vistazo.
// ══════════════════════════════════════════════════════════
const GLYPHS = {
  // ── Modalidad ──
  "trabajo-remoto":
    G(`<circle cx="0" cy="0" r="44"/>`) +
    K(`<circle cx="0" cy="0" r="86"/><circle cx="86" cy="0" r="13" fill="${SOFT}"/>`),

  "trabajo-asincrono":
    G(`<rect x="-96" y="-62" width="86" height="34" rx="8"/>`) +
    G(`<rect x="10" y="26" width="86" height="34" rx="8"/>`) +
    K(`<path d="M-10 -45 H40 V26"/>`, 6),

  "solapamiento-horario":
    K(`<circle cx="-32" cy="0" r="58"/><circle cx="32" cy="0" r="58"/>`) +
    G(`<path d="M0 -48.6 A58 58 0 0 1 0 48.6 A58 58 0 0 1 0 -48.6 Z"/>`),

  // Maleta y globo: el oficio y el sitio. Antes el globo era un círculo con
  // un palo debajo y no leía como nada.
  "nomada-digital":
    K(`<rect x="-92" y="-14" width="104" height="80" rx="10"/>`) +
    K(`<path d="M-62 -14 v-14 a8 8 0 0 1 8 -8 h20 a8 8 0 0 1 8 8 v14"/>`, 6) +
    G(`<circle cx="52" cy="-32" r="40"/>`) +
    K(`<path d="M12 -32 h80 M52 -72 a24 40 0 0 0 0 80 a24 40 0 0 0 0 -80" stroke="${SOFT}"/>`, 5),

  "onboarding-distribuido":
    K(`<path d="M-90 62 h180"/>`) +
    G(`<rect x="-84" y="18" width="46" height="44" rx="6"/>`) +
    G(`<rect x="-23" y="-18" width="46" height="80" rx="6"/>`) +
    G(`<rect x="38" y="-58" width="46" height="120" rx="6"/>`),

  "burnout-remoto":
    K(`<path d="M-92 0 q23 -62 46 0 t46 0"/>`, 7) +
    K(`<path d="M0 0 q23 -28 46 0 t46 0"/>`, 7) +
    G(`<circle cx="0" cy="0" r="14"/>`) +
    K(`<path d="M0 -76 v52"/>`, 5),

  // ── Legal ──
  "employer-of-record":
    K(`<rect x="-92" y="-52" width="66" height="104" rx="8"/><rect x="26" y="-52" width="66" height="104" rx="8"/>`) +
    G(`<rect x="-22" y="-30" width="44" height="60" rx="8"/>`),

  "contractor-internacional":
    K(`<rect x="-94" y="-34" width="68" height="68" rx="8"/>`) +
    G(`<rect x="26" y="-34" width="68" height="68" rx="8"/>`) +
    K(`<path d="M-26 0 h52"/>`, 6),

  "falso-autonomo":
    K(`<rect x="-72" y="-72" width="144" height="144" rx="12" stroke-dasharray="16 14"/>`) +
    G(`<circle cx="0" cy="0" r="48"/>`),

  "establecimiento-permanente":
    G(`<rect x="-72" y="-64" width="144" height="80" rx="8"/>`) +
    K(`<path d="M-92 30 h184 M-48 30 v42 M48 30 v42 M0 30 v42"/>`),

  "documentacion-asincrona":
    K(`<rect x="-84" y="-68" width="108" height="136" rx="10"/>`) +
    G(`<rect x="-24" y="-40" width="108" height="136" rx="10"/>`),

  // ── Fiscal ──
  "residencia-fiscal":
    G(`<path d="M0 -84 a52 52 0 0 1 52 52 c0 40 -52 96 -52 96 s-52 -56 -52 -96 a52 52 0 0 1 52 -52 z"/>`) +
    K(`<circle cx="0" cy="-32" r="18" fill="${SOFT}"/>`, 6),

  "regla-183-dias":
    K(`<rect x="-96" y="-38" width="192" height="76" rx="10"/>`) +
    G(`<path d="M-96 -38 h96 v76 h-96 a10 10 0 0 1 -10 -10 v-56 a10 10 0 0 1 10 -10 z" transform="translate(10 0)"/>`) +
    K(`<path d="M0 -62 v124"/>`, 6),

  "doble-imposicion":
    K(`<rect x="-84" y="14" width="168" height="62" rx="10"/>`) +
    G(`<circle cx="-42" cy="-42" r="38"/>`) +
    K(`<circle cx="42" cy="-42" r="38"/>`) +
    K(`<path d="M-42 -4 v18 M42 -4 v18"/>`, 6),

  "facturacion-internacional":
    K(`<rect x="-88" y="-70" width="106" height="140" rx="10"/>`) +
    K(`<path d="M-64 -34 h58 M-64 -6 h58 M-64 22 h34"/>`, 6) +
    G(`<path d="M34 0 h40 l-22 -30 h34 l40 42 l-40 42 h-34 l22 -30 h-40 z" transform="translate(-16 0)"/>`),

  "multidivisa":
    K(`<circle cx="-30" cy="-24" r="46"/>`) +
    G(`<circle cx="30" cy="24" r="46"/>`) +
    K(`<circle cx="-30" cy="-24" r="46"/>`),

  "geo-pay":
    K(`<path d="M-92 68 h184"/>`) +
    G(`<rect x="-84" y="18" width="40" height="50" rx="5"/>`) +
    G(`<rect x="-20" y="-24" width="40" height="92" rx="5"/>`) +
    K(`<path d="M52 -70 a26 26 0 0 1 26 26 c0 20 -26 46 -26 46 s-26 -26 -26 -46 a26 26 0 0 1 26 -26 z"/>`, 6),

  // ── Empleo ──
  "ats":
    K(`<path d="M-90 -66 h180 l-66 76 v54 l-48 26 v-80 z"/>`) +
    G(`<circle cx="0" cy="-40" r="16"/>`),

  "job-hacking":
    K(`<rect x="-86" y="-64" width="172" height="128" rx="12"/>`) +
    G(`<rect x="-86" y="-64" width="58" height="128" rx="12"/>`) +
    KF(`<circle cx="42" cy="0" r="13"/>`),

  "cv-internacional":
    K(`<rect x="-64" y="-80" width="128" height="160" rx="12"/>`) +
    G(`<circle cx="0" cy="-34" r="24"/>`) +
    K(`<path d="M-36 16 h72 M-36 42 h44"/>`, 6),

  "portfolio-internacional":
    K(`<rect x="-84" y="-76" width="72" height="66" rx="8"/><rect x="12" y="-76" width="72" height="66" rx="8"/><rect x="-84" y="10" width="72" height="66" rx="8"/>`) +
    G(`<rect x="12" y="10" width="72" height="66" rx="8"/>`),

  "marca-personal":
    G(`<circle cx="0" cy="0" r="26"/>`) +
    K(`<circle cx="0" cy="0" r="54"/><circle cx="0" cy="0" r="84"/>`, 6),

  "compensacion-global":
    K(`<rect x="-84" y="-72" width="168" height="144" rx="12"/>`) +
    G(`<path d="M-84 -12 h168 v72 a12 12 0 0 1 -12 12 h-144 a12 12 0 0 1 -12 -12 z"/>`) +
    K(`<path d="M-84 -12 h168"/>`, 6),

  "rol-fraccional":
    K(`<circle cx="0" cy="0" r="72"/>`) +
    G(`<path d="M0 0 v-72 a72 72 0 0 1 62 36 z"/>`),

  "solopreneur":
    G(`<circle cx="0" cy="0" r="34"/>`) +
    K(`<path d="M0 -44 v-42 M0 44 v42 M-44 0 h-42 M44 0 h42 M-31 -31 l-30 -30 M31 31 l30 30 M31 -31 l30 -30 M-31 31 l-30 30"/>`, 6),

  // ── Negocio ──
  "negocio-borderless":
    K(`<circle cx="0" cy="0" r="76"/>`) +
    K(`<path d="M-72 -28 h144 M-72 28 h144"/>`, 6) +
    K(`<path d="M0 -76 a46 76 0 0 0 0 152 a46 76 0 0 0 0 -152"/>`, 6) +
    G(`<path d="M0 -76 a76 76 0 0 1 76 76 h-76 z"/>`),

  "oferta-productizada":
    G(`<rect x="-76" y="-62" width="152" height="124" rx="12"/>`) +
    K(`<path d="M-76 -18 h152 M0 -62 v-14"/>`, 6) +
    KF(`<rect x="-16" y="-88" width="32" height="16" rx="4"/>`),

  "sop":
    K(`<rect x="-90" y="-72" width="52" height="40" rx="6"/><rect x="-90" y="-20" width="52" height="40" rx="6"/>`) +
    G(`<rect x="-90" y="32" width="52" height="40" rx="6"/>`) +
    K(`<path d="M-22 -52 h108 M-22 0 h108 M-22 52 h80"/>`, 6),

  "automatizacion-no-code":
    G(`<rect x="-98" y="-22" width="44" height="44" rx="8"/>`) +
    K(`<path d="M-54 0 h26"/>`, 6) +
    K(`<rect x="-28" y="-28" width="56" height="56" rx="8"/>`) +
    K(`<path d="M28 0 h20 M48 -44 v88 M48 -44 h18 M48 44 h18"/>`, 6) +
    G(`<rect x="66" y="-62" width="34" height="34" rx="7"/><rect x="66" y="28" width="34" height="34" rx="7"/>`),

  // ── Stack ──
  "stack-remoto":
    K(`<rect x="-88" y="24" width="176" height="44" rx="8"/>`) +
    K(`<rect x="-66" y="-24" width="132" height="44" rx="8"/>`) +
    G(`<rect x="-44" y="-72" width="88" height="44" rx="8"/>`),

  "agente-ia":
    K(`<path d="M0 -84 L74 48 H-74 Z"/>`) +
    G(`<circle cx="0" cy="6" r="26"/>`),

  "prompt-engineering":
    K(`<path d="M-98 0 h44"/>`, 6) +
    K(`<rect x="-54" y="-52" width="104" height="104" rx="10"/>`) +
    G(`<path d="M60 -46 h44 v14 h-44 z M60 -14 h44 v14 h-44 z M60 18 h44 v14 h-44 z"/>`),

  "nomina-internacional":
    K(`<rect x="-92" y="-64" width="184" height="128" rx="12"/>`) +
    K(`<path d="M-92 -22 h184"/>`, 6) +
    G(`<rect x="-66" y="6" width="34" height="34" rx="5"/><rect x="-17" y="6" width="34" height="34" rx="5"/><rect x="32" y="6" width="34" height="34" rx="5"/>`),

  "visado-nomada-digital":
    K(`<rect x="-78" y="-78" width="156" height="156" rx="14" stroke-dasharray="18 14"/>`) +
    G(`<rect x="-52" y="-20" width="104" height="40" rx="8"/>`),
};

const { TERMS } = await import("../src/app/glosario/terms.ts");

mkdirSync(OUT, { recursive: true });

const faltan = [];
let bytes = 0;
for (const term of TERMS) {
  const glyph = GLYPHS[term.id];
  if (!glyph) {
    faltan.push(term.id);
    continue;
  }
  const svg = tile(glyph, term.category, `${term.es.term} — ActiveXRemote`);
  writeFileSync(join(OUT, `${term.id}.svg`), svg, "utf8");
  bytes += Buffer.byteLength(svg);
}

console.log(`${TERMS.length - faltan.length} marcas · ${(bytes / 1024).toFixed(0)} kB`);
if (faltan.length) {
  console.log(`\n⚠︎ sin marca (${faltan.length}): ${faltan.join(", ")}`);
  process.exitCode = 1;
}
