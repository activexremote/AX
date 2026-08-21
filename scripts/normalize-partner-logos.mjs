// Unifica los logos de los partners.
//
//   node scripts/normalize-partner-logos.mjs
//
// Vienen de sitios distintos y cada uno con sus manías: unos traen `width` y
// `height` fijos, otros `fill="currentColor"`, otros un `class=` de Tailwind
// del sitio del que salieron. Sin tocarlos, en una fila salen a siete tamaños
// distintos.
//
// Lo que se hace a cada uno:
//   · se le quitan width/height, para que mande el CSS;
//   · se le asegura un viewBox, que es lo que fija la proporción real;
//   · se le quita `class` y los comentarios del exportador;
//   · `fill="currentColor"` pasa a un color fijo, porque en la ficha blanca
//     `currentColor` heredaría el color del texto y el logo saldría del color
//     que tocara.
//
// NO se les cambia el color de marca: un logo recoloreado deja de ser el logo
// y casi todas las guías de marca lo prohíben expresamente.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "public/logos/partners";
const TINTA = "#161326";

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".svg"))) {
  const p = `${DIR}/${file}`;
  let s = readFileSync(p, "utf8");

  const antes = s.length;
  s = s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/\s(width|height)="[^"]*"/g, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/currentColor/g, TINTA)
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!/viewBox=/.test(s)) {
    console.log(`  ⚠ ${file}: sin viewBox, se deja como está`);
  }
  writeFileSync(p, s + "\n");
  const vb = /viewBox="([^"]+)"/.exec(s)?.[1] ?? "?";
  const [, , w, h] = vb.split(/[\s,]+/).map(Number);
  const ratio = w && h ? (w / h).toFixed(2) : "?";
  console.log(`  ${file.padEnd(22)} viewBox ${vb.padEnd(18)} proporción ${ratio}   ${antes} → ${s.length} B`);
}
