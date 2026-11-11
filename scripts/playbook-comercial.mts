// ══════════════════════════════════════════════════════════
//  El PDF del playbook comercial
//
//  Pinta src/lib/comercial/playbook.ts (el mismo contenido que la página del
//  panel) en HTML con la marca y lo imprime en A4 con el Chrome del sistema.
//  El resultado va a private/comercial/playbook-comercial.pdf, que el panel
//  sirve sólo a quien tiene rol comercial o de administración.
//
//    node --experimental-strip-types scripts/playbook-comercial.mts [ruta-a-playwright]
//
//  Sin argumento usa el paquete «playwright» si está instalado.
// ══════════════════════════════════════════════════════════

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { PLAYBOOK, PLAYBOOK_VERSION, type Bloque } from "../src/lib/comercial/playbook.ts";
import { PLANTILLAS, rellenarPlantilla } from "../src/lib/comercial/plantillas.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "private/comercial/playbook-comercial.pdf");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// «comillas» y negritas sencillas: **texto**.
const txt = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const MARCA = `<svg viewBox="0 0 46 28" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 2 L20 26 L2 26 Z"/><path d="M26 2 L44 2 L35 14 Z"/><path d="M26 26 L44 26 L35 14 Z"/></svg>`;

// En el PDF las marcas de la clase de prueba van con el dato del día; el
// nombre y el curso se quedan como hueco para rellenar.
const EJEMPLO = {
  comercial: "Ainhoa",
  dryrun_cuando: "sábado 21 de noviembre, de 9:30 a 14:00 (hora de Madrid)",
  dryrun: "www.activexremote.com/dry-run/modulo-1",
};

function bloque(b: Bloque): string {
  switch (b.t) {
    case "p":
      return `<p>${txt(b.x)}</p>`;
    case "cita":
      return `<blockquote>${txt(b.x)}</blockquote>`;
    case "aviso":
      return `<div class="aviso"><span>Importante</span><p>${txt(b.x)}</p></div>`;
    case "lista":
      return `<ol class="check">${b.x.map((i) => `<li>${txt(i)}</li>`).join("")}</ol>`;
    case "pasos":
      return `<div class="pasos">${b.x.map((p) => `<div class="paso"><h4>${txt(p.titulo)}</h4><p>${txt(p.texto)}</p></div>`).join("")}</div>`;
    case "tabla":
      return `<table><thead><tr>${b.cab.map((c) => `<th>${txt(c)}</th>`).join("")}</tr></thead><tbody>${b.filas
        .map((f) => `<tr>${f.map((c, i) => (i === 0 ? `<th scope="row">${txt(c)}</th>` : `<td>${txt(c)}</td>`)).join("")}</tr>`)
        .join("")}</tbody></table>`;
    case "senales":
      return `<div class="senales">${(
        [
          ["verde", "Señales verdes", "Hay interés real", b.verde],
          ["ambar", "Señales ámbar", "Hay interés, con freno", b.ambar],
          ["rojo", "Señales rojas", "No encaja ahora", b.rojo],
        ] as const
      )
        .map(([k, t, s, xs]) => `<div class="senal senal--${k}"><h4>${t}</h4><small>${s}</small><ul>${xs.map((x) => `<li>${txt(x)}</li>`).join("")}</ul></div>`)
        .join("")}</div>`;
    case "di":
      return `<div class="di"><div class="di__si"><h4>Di esto</h4><ul>${b.si.map((x) => `<li>${txt(x)}</li>`).join("")}</ul></div><div class="di__no"><h4>No digas esto</h4><ul>${b.no
        .map((x) => `<li>${txt(x)}</li>`)
        .join("")}</ul></div></div>`;
    case "objeciones":
      return b.x
        .map(
          (o) =>
            `<div class="obj"><div class="obj__dice">«${txt(o.dice)}»</div><div class="obj__piensa">Lo que suele haber detrás: ${txt(o.piensa)}</div><p>${txt(o.responde)}</p></div>`,
        )
        .join("");
    case "plantillas":
      return PLANTILLAS.map(
        (p) =>
          `<div class="msg"><div class="msg__head"><h4>${txt(p.titulo)}</h4><span>${p.canal === "whatsapp" ? "WhatsApp" : "Correo"}</span></div><small>${txt(p.cuando)}</small>${
            p.asunto ? `<div class="msg__asunto">Asunto: ${txt(rellenarPlantilla(p.asunto, EJEMPLO))}</div>` : ""
          }<pre>${esc(rellenarPlantilla(p.texto, EJEMPLO))}</pre></div>`,
      ).join("");
  }
}

const indice = PLAYBOOK.map((s, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span>${txt(s.titulo)}</li>`).join("");
const secciones = PLAYBOOK.map(
  (s, i) => `<section class="sec">
  <header><span class="sec__num">${String(i + 1).padStart(2, "0")}</span><h2>${txt(s.titulo)}</h2><p class="sec__lead">${txt(s.entradilla)}</p></header>
  ${s.bloques.map(bloque).join("\n")}
</section>`,
).join("\n");

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Playbook comercial · ActiveXRemote</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page { size: A4; margin: 18mm 16mm 18mm;
  @bottom-left { content: "ActiveXRemote · Playbook comercial · Uso interno"; font-family: Inter, sans-serif; font-size: 7pt; color: #8a86a0; }
  @bottom-right { content: counter(page); font-family: Inter, sans-serif; font-size: 7pt; color: #8a86a0; } }
@page :first { margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #161326; font-size: 10pt; line-height: 1.55; }
h2, h3, h4 { margin: 0; letter-spacing: -0.02em; }
p { margin: 0 0 8pt; color: #36324d; }
strong { color: #161326; }

.cover { height: 297mm; width: 210mm; position: relative; overflow: hidden; color: #fff; padding: 22mm 18mm; display: flex; flex-direction: column; break-after: page;
  background: radial-gradient(60% 55% at 12% 18%, #7b5cff 0, transparent 60%), radial-gradient(55% 50% at 92% 10%, #ff6a3d 0, transparent 55%), radial-gradient(65% 55% at 80% 92%, #d61f9c 0, transparent 58%), radial-gradient(70% 60% at 18% 95%, #4f46e5 0, transparent 60%), linear-gradient(160deg, #3a1f6e 0, #241246 100%); }
.cover__brand { display: flex; align-items: center; gap: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; font-size: 9pt; }
.cover__brand svg { height: 14pt; }
.cover__glyph { position: absolute; right: -40mm; bottom: 40mm; width: 190mm; color: rgba(255,255,255,0.08); }
.cover__mid { margin-top: auto; margin-bottom: auto; }
.cover__kicker { display: inline-block; padding: 4pt 10pt; border: 1px solid rgba(255,255,255,0.35); border-radius: 99pt; font-size: 8.5pt; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
.cover h1 { font-size: 46pt; line-height: 1; letter-spacing: -0.04em; margin: 16pt 0 14pt; font-weight: 800; }
/* Color liso: el texto con degradado sale con un recuadro al imprimir. */
.cover h1 em { font-style: normal; color: #ffc2a8; }
.cover__lead { font-size: 13pt; color: rgba(255,255,255,0.85); max-width: 130mm; }
.cover__foot { display: flex; justify-content: space-between; font-size: 9pt; color: rgba(255,255,255,0.75); border-top: 1px solid rgba(255,255,255,0.25); padding-top: 10pt; }
.cover__foot strong { color: #fff; display: block; font-size: 11pt; }

.toc { break-after: page; }
.toc h2 { font-size: 24pt; margin: 0 0 6pt; }
.toc > p { margin-bottom: 18pt; }
.toc ol { list-style: none; padding: 0; margin: 0; columns: 1; }
.toc li { display: flex; gap: 14pt; align-items: baseline; padding: 9pt 0; border-bottom: 1px solid #e7e4f5; font-size: 12pt; font-weight: 600; }
.toc li span { color: #5b4bf5; font-size: 10pt; font-weight: 700; width: 18pt; }

.sec { break-before: page; }
.sec header { margin-bottom: 14pt; padding-bottom: 12pt; border-bottom: 2px solid #161326; }
.sec__num { display: inline-block; font-size: 9pt; font-weight: 800; color: #fff; background: linear-gradient(140deg, #6d5cff, #a855f7); border-radius: 6pt; padding: 3pt 7pt; margin-bottom: 8pt; }
.sec h2 { font-size: 22pt; line-height: 1.1; margin-bottom: 8pt; }
.sec__lead { font-size: 12pt; color: #514d69; margin: 0; }

blockquote { margin: 0 0 12pt; padding: 12pt 14pt; border-left: 4pt solid #5b4bf5; background: #f4f3fb; border-radius: 0 10pt 10pt 0; font-size: 11pt; color: #161326; }
.aviso { display: flex; gap: 10pt; margin: 10pt 0 12pt; padding: 10pt 12pt; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10pt; break-inside: avoid; }
.aviso span { flex: none; font-size: 7.5pt; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #c2410c; padding-top: 2pt; }
.aviso p { margin: 0; color: #431407; }

table { width: 100%; border-collapse: collapse; margin: 4pt 0 12pt; font-size: 9.5pt; break-inside: auto; }
thead th { text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #8a86a0; border-bottom: 1px solid #d9d5ee; padding: 6pt 8pt; }
tbody th, tbody td { text-align: left; vertical-align: top; padding: 7pt 8pt; border-bottom: 1px solid #eeecfa; }
tbody th { font-weight: 700; width: 30%; }
tr { break-inside: avoid; }

.pasos { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 4pt 0 12pt; }
.paso { padding: 10pt 12pt; border: 1px solid #e7e4f5; border-radius: 10pt; background: #fff; break-inside: avoid; }
.paso h4 { font-size: 10.5pt; margin-bottom: 4pt; color: #161326; }
.paso p { margin: 0; font-size: 9.5pt; }

.senales { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8pt; margin: 4pt 0 14pt; }
.senal { border-radius: 10pt; padding: 10pt 11pt; break-inside: avoid; }
.senal h4 { font-size: 10.5pt; }
.senal small { display: block; font-size: 8pt; margin-bottom: 6pt; opacity: 0.8; }
.senal ul { margin: 0; padding-left: 12pt; font-size: 9pt; }
.senal li { margin-bottom: 4pt; }
.senal--verde { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.senal--ambar { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.senal--rojo { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.di { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; margin: 6pt 0 12pt; break-inside: avoid; }
.di > div { border-radius: 10pt; padding: 10pt 12pt; }
.di h4 { font-size: 10pt; margin-bottom: 6pt; }
.di ul { margin: 0; padding-left: 12pt; font-size: 9.5pt; }
.di li { margin-bottom: 4pt; }
.di__si { background: #ecfdf5; border: 1px solid #a7f3d0; } .di__si h4 { color: #047857; }
.di__no { background: #fef2f2; border: 1px solid #fecaca; } .di__no h4 { color: #b91c1c; }

.obj { padding: 10pt 0; border-bottom: 1px solid #eeecfa; break-inside: avoid; }
.obj__dice { font-size: 12pt; font-weight: 800; letter-spacing: -0.01em; }
.obj__piensa { font-size: 8.5pt; color: #8a86a0; margin: 2pt 0 5pt; font-style: italic; }
.obj p { margin: 0; }

.msg { border: 1px solid #e7e4f5; border-radius: 12pt; padding: 11pt 13pt; margin-bottom: 10pt; break-inside: avoid; }
.msg__head { display: flex; justify-content: space-between; align-items: center; }
.msg__head h4 { font-size: 11pt; }
.msg__head span { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #5b4bf5; background: #f0eeff; border-radius: 99pt; padding: 2pt 8pt; }
.msg small { display: block; color: #8a86a0; margin: 2pt 0 7pt; }
.msg__asunto { font-size: 9pt; font-weight: 600; margin-bottom: 4pt; }
.msg pre { margin: 0; white-space: pre-wrap; font-family: inherit; font-size: 9.5pt; background: #f7f6fc; border-radius: 8pt; padding: 9pt 11pt; color: #161326; }

ol.check { padding-left: 16pt; margin: 4pt 0 12pt; }
ol.check li { margin-bottom: 5pt; }

.cierre { break-before: page; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; height: 250mm; }
.cierre svg { width: 50pt; color: #5b4bf5; margin-bottom: 14pt; }
.cierre h2 { font-size: 22pt; margin-bottom: 8pt; }
</style></head><body>
<div class="cover">
  <div class="cover__brand">${MARCA}<span>ActiveXRemote</span></div>
  <div class="cover__glyph">${MARCA}</div>
  <div class="cover__mid">
    <span class="cover__kicker">Uso interno · Equipo comercial</span>
    <h1>Playbook<br><em>comercial</em></h1>
    <p class="cover__lead">Qué vendemos, a quién, cómo detectar el interés, cómo despertarlo en quien duda y lo que nunca decimos. Todo lo que necesitas para tu primer día.</p>
  </div>
  <div class="cover__foot"><div><strong>Para Ainhoa</strong>Equipo comercial</div><div style="text-align:right"><strong>${PLAYBOOK_VERSION}</strong>The Remote Business School</div></div>
</div>
<div class="toc"><h2>Contenido</h2><p>Léelo entero el primer día. Después, vuelve a las secciones 05 a 10 antes de cada llamada difícil.</p><ol>${indice}</ol></div>
${secciones}
<div class="cierre">${MARCA}<h2>Bienvenida al equipo, Ainhoa.</h2><p>Dudas sobre el curso, precios o condiciones: pregúntalas al equipo antes de improvisar.<br>admin@activexremote.com</p></div>
</body></html>`;

const playwrightRuta = process.argv[2];
const { chromium } = await import(playwrightRuta ? pathToFileURL(playwrightRuta).href : "playwright");
const navegador = await chromium.launch({ channel: "chrome" });
const pagina = await navegador.newPage();
await pagina.setContent(html, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
mkdirSync(path.dirname(SALIDA), { recursive: true });
await pagina.pdf({
  path: SALIDA,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
if (process.env.PLAYBOOK_HTML) writeFileSync(process.env.PLAYBOOK_HTML, html);
await navegador.close();
console.log(`PDF: ${path.relative(RAIZ, SALIDA)}`);
