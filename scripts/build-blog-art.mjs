#!/usr/bin/env node
// Genera las ilustraciones de cabecera del blog en public/blog/.
//
//   node scripts/build-blog-art.mjs
//
// ── Qué se corrigió respecto de la primera versión ────────
// Los conceptos eran distintos pero todas se DIBUJABAN igual: rectángulos de
// trazo fino, una flecha y un acento plano, siempre en la misma caja central.
// Vistas seguidas en la portada del blog parecían la misma imagen repetida.
//
// La regla ahora es que cada pieza cambie en al menos tres de estos cinco
// ejes respecto de sus vecinas:
//
//   1. forma dominante — círculo · rectángulo · triángulo · onda · trayecto
//   2. composición     — radial · rejilla · carriles · pila · dispersión
//   3. densidad        — tres masas grandes frente a treinta piezas pequeñas
//   4. relleno         — sólo línea · masa con gradiente · tinta maciza
//   5. eje             — horizontal · vertical · diagonal · concéntrico
//
// Y cada una tiene que poder leerse como «de esto va el artículo», no como
// decoración: quien ve la de los 183 días entiende que hay un umbral.
//
// ── Reglas de marca ───────────────────────────────────────
// Paleta pública, retícula de puntos, cuadrado indicador y la firma ΔX con los
// mismos trazados que src/components/brand-mark.tsx.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "blog");

const INK = "#161326";
const SOFT = "#F4F3FB";
const GRID = "#DDD8F2";
const RULE = "#C9C2E8";
const BODY = "#514D69";

// Acento y gradiente por cluster. El gradiente da masa; el acento plano, línea.
const THEME = {
  empleo: { flat: "#5B4BF5", grad: ["#6D5CFF", "#A855F7"] },
  negocio: { flat: "#E4462F", grad: ["#FF7A3D", "#E11D74"] },
  fiscalidad: { flat: "#2F6BFF", grad: ["#3D7BFF", "#14B8C4"] },
  legal: { flat: "#14B8C4", grad: ["#2F6BFF", "#14B8C4"] },
  metodo: { flat: "#A855F7", grad: ["#8B5CF6", "#D946A6"] },
  herramientas: { flat: "#FF7A3D", grad: ["#FF9A3D", "#FF5A5A"] },
};

const W = 800;
const H = 450;

function dots() {
  const out = [];
  for (let y = 14; y < H; y += 22) {
    for (let x = 14; x < W; x += 22) out.push(`M${x} ${y}h1`);
  }
  // Un solo <path>: 1.200 <circle> harían el fichero cuatro veces más grande
  // sin verse distinto.
  return `<path d="${out.join("")}" stroke="${GRID}" stroke-width="1" stroke-linecap="square"/>`;
}

function chassis(glyph, theme, label) {
  const [ga, gb] = theme.grad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ga}"/>
      <stop offset="1" stop-color="${gb}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${SOFT}"/>
  ${dots()}
  <rect x="40" y="40" width="7" height="7" fill="${INK}"/>
  <path d="M59 43.5H150" stroke="${RULE}" stroke-width="1"/>
${glyph(theme.flat)}
  <path d="M40 396H760" stroke="${RULE}" stroke-width="1"/>
  <g transform="translate(714 398) scale(0.82)" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="miter" opacity="0.4">
    <path d="M11 2 L20 26 L2 26 Z"/>
    <path d="M26 2 L44 2 L35 14 Z"/>
    <path d="M26 26 L44 26 L35 14 Z"/>
  </g>
</svg>
`;
}

// ── Utilidades ────────────────────────────────────────────
// El grosor varía a propósito entre piezas: es uno de los recursos que las
// separa unas de otras.
const K = (body, w = 3) =>
  `  <g fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="butt">${body}</g>`;
const A = (a, body, w = 3) =>
  `  <g fill="none" stroke="${a}" stroke-width="${w}" stroke-linejoin="miter" stroke-linecap="butt">${body}</g>`;
const KF = (body) => `  <g fill="${INK}" stroke="none">${body}</g>`;
const AF = (a, body) => `  <g fill="${a}" stroke="none">${body}</g>`;
const GF = (body) => `  <g fill="url(#g)" stroke="none">${body}</g>`;
const SOFTF = (body) => `  <g fill="${SOFT}" stroke="none">${body}</g>`;
const DIM = (body) => `  <g fill="${BODY}" stroke="none" opacity="0.28">${body}</g>`;

// ══════════════════════════════════════════════════════════
//  Las 22 ilustraciones
// ══════════════════════════════════════════════════════════
const GLYPHS = {
  // 1 · MANIFIESTO — trayecto que se bifurca tras un tramo común.
  //     Eje diagonal · línea muy gruesa · dos destinos de distinto peso.
  manifiesto: (a) =>
    KF(`<circle cx="96" cy="225" r="13"/>`) +
    K(`<path d="M96 225 H300"/>`, 12) +
    K(`<path d="M300 225 C 380 225, 400 120, 500 120 H612"/>`, 7) +
    A(a, `<path d="M300 225 C 380 225, 400 330, 500 330 H612"/>`, 7) +
    GF(`<rect x="612" y="86" width="92" height="68" rx="10"/>`) +
    K(`<rect x="612" y="296" width="92" height="68" rx="10"/>`, 4) +
    DIM(`<rect x="150" y="252" width="10" height="10"/><rect x="186" y="252" width="10" height="10"/><rect x="222" y="252" width="10" height="10"/><rect x="258" y="252" width="10" height="10"/>`),

  // 2 · MERCADO GLOBAL — dos esferas unidas por un arco. Forma: círculo.
  "mercado-global": (a) =>
    K(`<path d="M60 300 H740"/>`, 2) +
    GF(`<circle cx="176" cy="300" r="56"/>`) +
    `  <g fill="none" stroke="${SOFT}" stroke-width="4"><path d="M120 300 h112"/><path d="M176 244 a34 56 0 0 0 0 112 a34 56 0 0 0 0 -112"/></g>` +
    K(`<circle cx="624" cy="300" r="56"/>`, 4) +
    K(`<path d="M568 300 h112 M624 244 a34 56 0 0 0 0 112 a34 56 0 0 0 0 -112"/>`, 3) +
    A(a, `<path d="M176 244 C 260 96, 540 96, 624 244"/>`, 4) +
    AF(a, `<path d="M608 228 l30 4 l-16 26 z"/>`),

  // 3 · INTERMEDIARIO LEGAL — tres bloques; el de en medio es el que manda.
  //     Simetría perfecta · masa central grande · sin diagonales.
  "intermediario-legal": () =>
    K(`<rect x="72" y="164" width="150" height="122" rx="8"/>`, 4) +
    K(`<rect x="578" y="164" width="150" height="122" rx="8"/>`, 4) +
    GF(`<rect x="292" y="140" width="216" height="170" rx="12"/>`) +
    SOFTF(`<rect x="326" y="184" width="148" height="9" rx="4"/><rect x="326" y="212" width="148" height="9" rx="4"/><rect x="326" y="240" width="96" height="9" rx="4"/>`) +
    K(`<path d="M222 225 h70 M508 225 h70"/>`, 4),

  // 4 · CRIBA — embudo. Triángulo invertido · eje vertical · muchas entradas.
  "criba-candidatura": (a) =>
    KF(`<rect x="248" y="82" width="34" height="26" rx="4"/><rect x="298" y="82" width="34" height="26" rx="4"/><rect x="348" y="82" width="34" height="26" rx="4"/><rect x="398" y="82" width="34" height="26" rx="4"/><rect x="448" y="82" width="34" height="26" rx="4"/><rect x="498" y="82" width="34" height="26" rx="4"/>`) +
    K(`<path d="M236 140 H556 L436 262 v76 l-80 42 v-118 z"/>`, 4) +
    GF(`<rect x="368" y="330" width="42" height="32" rx="5"/>`) +
    A(a, `<path d="M236 176 H556"/>`, 3),

  // 5 · UMBRAL DE DÍAS — rejilla de 36 celdas. Máxima densidad del conjunto.
  "umbral-dias": (a) => {
    const cells = [];
    for (let i = 0; i < 36; i++) {
      const x = 128 + (i % 12) * 46;
      const y = 130 + Math.floor(i / 12) * 62;
      cells.push(
        i < 22
          ? `<rect x="${x}" y="${y}" width="32" height="32" rx="5" fill="url(#g)"/>`
          : `<rect x="${x}" y="${y}" width="32" height="32" rx="5" fill="none" stroke="${INK}" stroke-width="3"/>`,
      );
    }
    return `  <g>${cells.join("")}</g>` + A(a, `<path d="M598 108 v208"/>`, 4);
  },

  // 6 · BALANZA — palanca inclinada. Única pieza con rotación.
  balanza: (a) =>
    K(`<path d="M400 108 v212 M330 320 h140"/>`, 5) +
    `  <g transform="rotate(-9 400 140)">` +
    `<g fill="none" stroke="${INK}" stroke-width="4"><path d="M170 140 H630"/><path d="M212 140 v56"/><path d="M588 140 v56"/></g>` +
    `<g fill="${INK}"><rect x="150" y="196" width="124" height="70" rx="8"/></g>` +
    `<g fill="url(#g)"><rect x="516" y="196" width="144" height="112" rx="8"/></g>` +
    `</g>` +
    AF(a, `<circle cx="400" cy="108" r="12"/>`),

  // 7 · PRODUCTO CERRADO — el mismo valor, otra forma. Muchas barras finas
  //     de altura desigual (horas sueltas) frente a UNA sola maciza y regular
  //     (el producto). Sin flecha y sin documento: se separa así de la 22,
  //     que sí es una secuencia que acaba en documento.
  "producto-cerrado": () => {
    const bars = [];
    for (let i = 0; i < 17; i++) {
      const h = 46 + ((i * 53) % 132);
      bars.push(`<rect x="${88 + i * 17}" y="${318 - h}" width="9" height="${h}" rx="4"/>`);
    }
    return (
      K(`<path d="M76 318 H724"/>`, 3) +
      DIM(bars.join("")) +
      K(`<path d="M88 348 h272"/>`, 2) +
      KF(`<circle cx="404" cy="225" r="5"/><circle cx="404" cy="252" r="5"/>`) +
      GF(`<rect x="452" y="182" width="272" height="136" rx="12"/>`) +
      K(`<path d="M452 348 h272"/>`, 2)
    );
  },

  // 8 · FUGA — conducto con desvío. Trayecto en L · única con salida diagonal.
  "fuga-cobro": (a) =>
    K(`<path d="M84 168 H620 a20 20 0 0 1 20 20 v72"/>`, 4) +
    K(`<path d="M84 252 H520"/>`, 4) +
    K(`<path d="M84 168 v84"/>`, 4) +
    GF(`<rect x="128" y="192" width="40" height="36" rx="6"/><rect x="184" y="192" width="40" height="36" rx="6"/><rect x="240" y="192" width="40" height="36" rx="6"/>`) +
    A(a, `<path d="M520 252 l58 78"/>`, 5) +
    AF(a, `<path d="M566 316 l18 30 l-34 4 z"/>`) +
    K(`<rect x="596" y="260" width="88" height="88" rx="10"/>`, 4),

  // 9 · CONVERGENCIA — abanico radial hacia un punto. Única en abanico.
  convergencia: () => {
    const lines = [];
    const dots = [];
    for (let i = 0; i < 7; i++) {
      const y = 108 + i * 39;
      lines.push(`<path d="M118 ${y} L554 225"/>`);
      dots.push(`<circle cx="106" cy="${y}" r="11"/>`);
    }
    return (
      K(lines.join(""), 2) +
      KF(dots.join("")) +
      GF(`<circle cx="606" cy="225" r="52"/>`) +
      `  <g fill="none" stroke="${SOFT}" stroke-width="7"><path d="M584 225 l16 16 l30 -34"/></g>`
    );
  },

  // 10 · AMPLIFICADOR — uno entra, seis salen. Triángulo macizo apuntando.
  amplificador: (a) => {
    const out = [];
    for (let i = 0; i < 6; i++) out.push(`<path d="M462 ${118 + i * 43} H${632 + ((i * 29) % 76)}"/>`);
    return (
      K(`<path d="M84 225 h72"/>`, 4) +
      KF(`<rect x="66" y="211" width="28" height="28" rx="5"/>`) +
      GF(`<path d="M156 118 L156 332 L444 225 Z"/>`) +
      A(a, out.join(""), 4)
    );
  },

  // 11 · BIFURCACIÓN — Y horizontal. Se parece al manifiesto a propósito:
  //      es su versión comercial, y el paralelismo ayuda a relacionarlos.
  //      Se separan por grosor, por el nodo y por el peso de los destinos.
  bifurcacion: (a) =>
    K(`<path d="M84 225 H286"/>`, 5) +
    KF(`<circle cx="286" cy="225" r="14"/>`) +
    K(`<path d="M286 225 C 360 225, 380 128, 468 128 H600"/>`, 4) +
    A(a, `<path d="M286 225 C 360 225, 380 322, 468 322 H600"/>`, 4) +
    K(`<rect x="600" y="90" width="116" height="76" rx="10"/>`, 4) +
    GF(`<rect x="600" y="284" width="116" height="76" rx="10"/>`),

  // 12 · ETIQUETA ERRÓNEA — encaje imposible. Triángulo contra círculo.
  "etiqueta-erronea": (a) =>
    K(`<rect x="104" y="132" width="188" height="188" rx="12"/>`, 4) +
    GF(`<path d="M198 168 L268 292 H128 Z"/>`) +
    K(`<path d="M320 226 h66"/>`, 4) +
    AF(a, `<path d="M384 212 l26 14 l-26 14 z"/>`) +
    A(a, `<circle cx="596" cy="226" r="94" stroke-dasharray="16 14"/>`, 4) +
    DIM(`<path d="M596 172 L666 296 H526 Z"/>`),

  // 13 · ASINCRONÍA — dos carriles que se relevan sin coincidir.
  asincronia: (a) =>
    K(`<path d="M76 152 H724 M76 300 H724"/>`, 2) +
    KF(`<rect x="112" y="126" width="150" height="30" rx="8"/><rect x="386" y="126" width="112" height="30" rx="8"/>`) +
    GF(`<rect x="272" y="274" width="136" height="30" rx="8"/><rect x="522" y="274" width="164" height="30" rx="8"/>`) +
    A(a, `<path d="M262 152 L318 274 M408 274 L446 152"/>`, 3) +
    DIM(`<rect x="76" y="342" width="648" height="4" rx="2"/>`),

  // 14 · SOLAPAMIENTO — dos barras y la franja común, marcada en vertical.
  solapamiento: (a) =>
    KF(`<rect x="96" y="140" width="336" height="52" rx="10"/>`) +
    GF(`<rect x="292" y="252" width="352" height="52" rx="10"/>`) +
    AF(a, `<rect x="292" y="140" width="140" height="52"/>`) +
    A(a, `<rect x="292" y="112" width="140" height="222" rx="10"/>`, 4) +
    K(`<path d="M76 358 H724"/>`, 2) +
    DIM(`<rect x="292" y="352" width="140" height="12" rx="6"/>`),

  // 15 · PILA — capas apiladas y centradas. Eje vertical, sin flechas.
  pila: () =>
    K(`<rect x="196" y="292" width="408" height="46" rx="10"/>`, 4) +
    K(`<rect x="226" y="232" width="348" height="46" rx="10"/>`, 4) +
    K(`<rect x="256" y="172" width="288" height="46" rx="10"/>`, 4) +
    GF(`<rect x="286" y="112" width="228" height="46" rx="10"/>`) +
    DIM(`<rect x="196" y="352" width="408" height="6" rx="3"/>`),

  // 16 · MUESTRARIO — mosaico de seis con una destacada.
  muestrario: () => {
    const cells = [];
    for (let i = 0; i < 6; i++) {
      const x = 116 + (i % 3) * 200;
      const y = 118 + Math.floor(i / 3) * 124;
      if (i === 4) {
        cells.push(
          `<rect x="${x}" y="${y}" width="168" height="96" rx="10" fill="url(#g)"/>` +
            `<rect x="${x + 24}" y="${y + 34}" width="84" height="9" rx="4" fill="${SOFT}"/>` +
            `<rect x="${x + 24}" y="${y + 54}" width="54" height="9" rx="4" fill="${SOFT}"/>`,
        );
      } else {
        cells.push(
          `<rect x="${x}" y="${y}" width="168" height="96" rx="10" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="${x + 24}" y="${y + 34}" width="84" height="9" rx="4" fill="${BODY}" opacity="0.3"/>` +
            `<rect x="${x + 24}" y="${y + 54}" width="54" height="9" rx="4" fill="${BODY}" opacity="0.3"/>`,
        );
      }
    }
    return `  <g>${cells.join("")}</g>`;
  },

  // 17 · REQUISITOS — histograma contra un umbral. Barras verticales.
  requisitos: (a) => {
    const bars = [132, 208, 96, 176, 122, 196];
    const items = bars.map((h, i) => {
      const x = 122 + i * 96;
      const y = 330 - h;
      return h > 160
        ? `<rect x="${x}" y="${y}" width="58" height="${h}" rx="8" fill="url(#g)"/>`
        : `<rect x="${x}" y="${y}" width="58" height="${h}" rx="8" fill="none" stroke="${INK}" stroke-width="3"/>`;
    });
    return (
      `  <g>${items.join("")}</g>` +
      A(a, `<path d="M84 170 H716"/>`, 4) +
      K(`<path d="M84 330 H716"/>`, 3)
    );
  },

  // 18 · PANTALLA Y VOZ — dispositivo y oscilograma. Única con barras finas
  //      centradas en el eje, y única que dibuja un aparato.
  "pantalla-voz": () => {
    const bars = [];
    for (let i = 0; i < 14; i++) {
      const h = 22 + ((i * 47) % 78);
      bars.push(`<rect x="${454 + i * 22}" y="${225 - h / 2}" width="9" height="${h}" rx="4"/>`);
    }
    return (
      K(`<rect x="88" y="126" width="290" height="198" rx="14"/>`, 4) +
      KF(`<path d="M198 178 L268 225 L198 272 Z"/>`) +
      K(`<path d="M148 348 h170"/>`, 4) +
      GF(bars.join(""))
    );
  },

  // 19 · RAMPA — tres escalones que crecen, sobre ejes. Masas contiguas.
  rampa: () =>
    K(`<path d="M84 330 H716 M84 330 V112"/>`, 3) +
    KF(`<rect x="132" y="262" width="172" height="68" rx="8"/>`) +
    K(`<rect x="316" y="192" width="172" height="138" rx="8"/>`, 4) +
    GF(`<rect x="500" y="122" width="172" height="208" rx="8"/>`) +
    DIM(`<rect x="132" y="348" width="172" height="6" rx="3"/><rect x="316" y="348" width="172" height="6" rx="3"/><rect x="500" y="348" width="172" height="6" rx="3"/>`),

  // 20 · ONDA DECRECIENTE — oscilación que se apaga. Sin un solo rectángulo:
  //      es la única pieza del conjunto construida sólo con curvas.
  "onda-decreciente": (a) =>
    K(`<path d="M76 225 H724"/>`, 2) +
    K(`<path d="M84 225 q34 -92 68 0 t68 0 t68 0"/>`, 5) +
    A(a, `<path d="M288 225 q34 -54 68 0 t68 0 t68 0 t68 0 t68 0"/>`, 5) +
    A(a, `<path d="M288 118 v214"/>`, 3) +
    AF(a, `<circle cx="288" cy="225" r="11"/>`),

  // 21 · AUTOMATISMO — árbol de ramas. Todo ortogonal, ni una curva.
  automatismo: (a) =>
    GF(`<rect x="76" y="196" width="66" height="58" rx="10"/>`) +
    K(`<path d="M142 225 h58"/>`, 4) +
    K(`<rect x="200" y="186" width="118" height="78" rx="10"/>`, 4) +
    K(`<path d="M318 225 h44 M362 128 v194 M362 128 h52 M362 225 h52 M362 322 h52"/>`, 4) +
    GF(`<rect x="414" y="102" width="98" height="52" rx="9"/><rect x="414" y="199" width="98" height="52" rx="9"/><rect x="414" y="296" width="98" height="52" rx="9"/>`) +
    A(a, `<path d="M512 128 h96 M512 225 h96 M512 322 h96"/>`, 3),

  // 22 · PROCEDIMIENTO — secuencia numerada que acaba siendo un documento.
  procedimiento: (a) => {
    const steps = [0, 1, 2].map((i) => {
      const y = 126 + i * 76;
      return (
        `<rect x="96" y="${y}" width="52" height="52" rx="10" fill="none" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="170" y="${y + 14}" width="188" height="9" rx="4" fill="${INK}"/>` +
        `<rect x="170" y="${y + 32}" width="122" height="9" rx="4" fill="${BODY}" opacity="0.35"/>`
      );
    });
    return (
      `  <g>${steps.join("")}</g>` +
      K(`<path d="M388 225 h50"/>`, 4) +
      AF(a, `<path d="M436 211 l26 14 l-26 14 z"/>`) +
      GF(`<rect x="488" y="112" width="212" height="226" rx="14"/>`) +
      SOFTF(`<rect x="524" y="158" width="140" height="11" rx="5"/><rect x="524" y="188" width="140" height="11" rx="5"/><rect x="524" y="218" width="94" height="11" rx="5"/><rect x="524" y="248" width="140" height="11" rx="5"/>`)
    );
  },
};

// ── Qué tema lleva cada ilustración ───────────────────────
export const TOPICS = [
  { key: "manifiesto", cluster: "metodo" },
  { key: "mercado-global", cluster: "empleo" },
  { key: "intermediario-legal", cluster: "legal" },
  { key: "criba-candidatura", cluster: "empleo" },
  { key: "umbral-dias", cluster: "fiscalidad" },
  { key: "balanza", cluster: "empleo" },
  { key: "producto-cerrado", cluster: "negocio" },
  { key: "fuga-cobro", cluster: "fiscalidad" },
  { key: "convergencia", cluster: "negocio" },
  { key: "amplificador", cluster: "herramientas" },
  { key: "bifurcacion", cluster: "empleo" },
  { key: "etiqueta-erronea", cluster: "legal" },
  { key: "asincronia", cluster: "metodo" },
  { key: "solapamiento", cluster: "empleo" },
  { key: "pila", cluster: "herramientas" },
  { key: "muestrario", cluster: "empleo" },
  { key: "requisitos", cluster: "fiscalidad" },
  { key: "pantalla-voz", cluster: "empleo" },
  { key: "rampa", cluster: "metodo" },
  { key: "onda-decreciente", cluster: "metodo" },
  { key: "automatismo", cluster: "herramientas" },
  { key: "procedimiento", cluster: "negocio" },
];

mkdirSync(OUT, { recursive: true });

let bytes = 0;
const faltan = [];
for (const t of TOPICS) {
  const glyph = GLYPHS[t.key];
  if (!glyph) {
    faltan.push(t.key);
    continue;
  }
  const svg = chassis(glyph, THEME[t.cluster], "Ilustración de ActiveXRemote");
  writeFileSync(join(OUT, `${t.key}.svg`), svg, "utf8");
  bytes += Buffer.byteLength(svg);
}

console.log(`${TOPICS.length - faltan.length} ilustraciones · ${(bytes / 1024).toFixed(0)} kB`);
if (faltan.length) {
  console.log(`\n⚠︎ sin dibujo: ${faltan.join(", ")}`);
  process.exitCode = 1;
}
