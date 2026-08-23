// Marca ΔX en PNG para los correos.
//
//   node scripts/build-email-logo.mjs
//
// Gmail y Outlook tiran los SVG en línea, así que el símbolo tiene que viajar
// como imagen de mapa de bits alojada en el sitio. Se genera desde el mismo
// trazado que `src/components/brand-mark.tsx` —nunca se redibuja a mano— a
// doble resolución, para que se vea nítido en pantallas retina cuando se
// muestra a 46 × 28.
import sharp from "sharp";
import fs from "node:fs";

const OUT = new URL("../public/email/logo-axr.png", import.meta.url);
const SCALE = 4; // 46×28 → 184×112: sirve para 1x, 2x y firmas grandes

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 28" width="${46 * SCALE}" height="${28 * SCALE}">
  <g fill="none" stroke="#161616" stroke-width="2" stroke-linejoin="miter">
    <path d="M11 2 L20 26 L2 26 Z" />
    <path d="M26 2 L44 2 L35 14 Z" />
    <path d="M26 26 L44 26 L35 14 Z" />
  </g>
</svg>`;

fs.mkdirSync(new URL("../public/email/", import.meta.url), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(OUT.pathname);
console.log(`✓ ${OUT.pathname}`);
