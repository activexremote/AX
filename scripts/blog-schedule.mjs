#!/usr/bin/env node
// Reparte las fechas de publicación del blog: una entrada por semana.
//
//   node scripts/blog-schedule.mjs            # muestra el calendario
//   node scripts/blog-schedule.mjs --write    # lo escribe en los artículos
//
// ── Por qué hace falta ────────────────────────────────────
// Los 40 artículos se escribieron de una vez y quedaron con la misma fecha.
// Un blog con cuarenta entradas publicadas el mismo martes no engaña a nadie:
// ni al lector, que ve el bloque de golpe, ni a Google, que trata la ráfaga
// como contenido volcado. Aquí se reparten hacia atrás, una por semana.
//
// ── Reglas ────────────────────────────────────────────────
//  · Un tema por semana. Las dos versiones de idioma comparten fecha: es el
//    mismo artículo publicado en dos idiomas el mismo día.
//  · El manifiesto es el post 1 y por tanto el más antiguo.
//  · Siempre martes. Un blog que publica en días aleatorios no parece un
//    blog con calendario, y lo que se busca es justo eso.
//  · `updated` se queda igual que `published` salvo en las guías que de
//    verdad se revisan (las de fiscalidad y legal, que cambian con la norma).

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const WRITE = process.argv.includes("--write");

// Último martes publicado. Se fija a mano en vez de calcularlo desde "hoy"
// para que dos ejecuciones distintas no muevan todo el calendario.
const LAST_TUESDAY = "2026-08-18";

/** Orden cronológico: el primero es el más antiguo. */
const ORDER = [
  ["que-es-activexremote", "what-is-activexremote"],
  ["trabajo-remoto-internacional-desde-espana", "international-remote-jobs-from-europe"],
  ["trabajo-asincrono-guia", "async-work-guide"],
  ["solapamiento-horario-ofertas-remotas", "time-zone-overlap-explained"],
  ["cv-internacional-ats", "ats-friendly-resume"],
  ["portfolio-para-recruiters-internacionales", "proof-of-work-portfolio"],
  ["entrevista-remota-video-asincrona", "async-interview-and-video-screening"],
  ["negociar-salario-remoto-internacional", "negotiating-remote-salary"],
  ["como-trabajar-para-empresa-extranjera-legalmente", "employer-of-record-vs-contractor"],
  [null, "worker-misclassification-risk"],
  ["residencia-fiscal-nomada-digital", "tax-residency-remote-workers"],
  ["visados-nomada-digital-comparativa", "digital-nomad-visa-comparison"],
  ["cobrar-clientes-extranjero", "getting-paid-internationally"],
  ["stack-remoto-imprescindible", "remote-work-stack"],
  ["ia-para-buscar-trabajo-remoto", "ai-for-job-search"],
  ["primeros-90-dias-equipo-distribuido", "first-90-days-remote-team"],
  ["burnout-remoto-senales", "remote-burnout-signals"],
  ["de-freelance-a-negocio-productizado", "productised-service-business"],
  ["conseguir-clientes-b2b-internacionales", "b2b-clients-without-network"],
  ["sop-documentar-procesos", "writing-sops-to-delegate"],
  ["automatizar-negocio-sin-codigo", "no-code-automation-for-solopreneurs"],
  ["curso-trabajo-remoto-cual-elegir", null],
];

// Guías que se revisan de verdad: la norma fiscal y la de contratación se
// mueven, así que tienen sentido con `updated` posterior. Poner una fecha de
// revisión en un artículo que nadie ha tocado sería mentir en el sitemap.
const REVISADAS = new Set([
  "residencia-fiscal-nomada-digital", "tax-residency-remote-workers",
  "visados-nomada-digital-comparativa", "digital-nomad-visa-comparison",
  "como-trabajar-para-empresa-extranjera-legalmente", "employer-of-record-vs-contractor",
  "worker-misclassification-risk",
  "que-es-activexremote", "what-is-activexremote",
]);
const FECHA_REVISION = "2026-08-18";

const iso = (d) => d.toISOString().slice(0, 10);
const menosSemanas = (base, n) => {
  const d = new Date(`${base}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n * 7);
  return iso(d);
};

const total = ORDER.length;
const plan = [];
ORDER.forEach((pair, i) => {
  // El último de la lista es el más reciente; el primero, el más antiguo.
  const published = menosSemanas(LAST_TUESDAY, total - 1 - i);
  for (const slug of pair) {
    if (!slug) continue;
    const updated = REVISADAS.has(slug) && FECHA_REVISION > published ? FECHA_REVISION : published;
    plan.push({ slug, published, updated, semana: i + 1 });
  }
});

let cambiados = 0;
for (const p of plan) {
  const path = `src/app/blog/articles/${p.slug}.ts`;
  let src;
  try {
    src = readFileSync(path, "utf8");
  } catch {
    console.log(`  ⚠︎ no existe ${p.slug}`);
    continue;
  }
  const nuevo = src
    .replace(/^ {2}published: "[\d-]+",$/m, `  published: "${p.published}",`)
    .replace(/^ {2}updated: "[\d-]+",$/m, `  updated: "${p.updated}",`);
  if (nuevo !== src) {
    if (WRITE) writeFileSync(path, nuevo, "utf8");
    cambiados++;
  }
}

const primera = plan[0].published;
const ultima = plan.at(-1).published;
console.log(`${plan.length} artículos · ${total} semanas · ${primera} → ${ultima}`);
console.log(`${cambiados} con fecha distinta a la que tenían.`);
if (!WRITE) {
  console.log("\n(simulación: vuelve a ejecutarlo con --write)");
} else {
  console.log("escrito.");
  try {
    execSync("node scripts/blog-schedule.mjs", { stdio: "ignore" });
  } catch {
    /* la comprobación es informativa */
  }
}
