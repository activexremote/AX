#!/usr/bin/env node
// Rastrea el sitio y comprueba que todo enlace lleva a alguna parte.
//
//   node scripts/check-links.mjs [http://localhost:3000]
//
// Comprueba tres cosas que se rompen por separado:
//   · enlaces internos → que respondan 200 (o una redirección que acabe en 200);
//   · anclas (#id)     → que el id exista de verdad en la página de destino;
//   · imágenes         → que el fichero esté donde dice el src.
//
// Los enlaces externos se listan pero no se piden: depender de servidores
// ajenos convertiría esta comprobación en un generador de falsos negativos.

const BASE = process.argv[2] ?? "http://localhost:3000";

const SEMILLAS = [
  "/", "/bienvenida", "/cursos/remote-professional", "/cursos/remote-founder",
  "/blog", "/glosario", "/matricula", "/legal/aviso-legal", "/login",
  "/en", "/en/welcome", "/en/courses/remote-professional", "/en/courses/remote-founder",
  "/en/blog", "/en/glossary", "/en/enrolment", "/en/legal/legal-notice",
  "/sitemap.xml", "/robots.txt", "/llms.txt",
];

// Rutas privadas: responden con una redirección al login, y eso es lo correcto.
const PRIVADAS = /^\/(lecciones|modulos|mi-progreso|mis-tareas|admin|api|auth)\b/;

const paginas = new Map();   // ruta → { status, ids:Set, enlaces:[] }
const porVisitar = [...SEMILLAS];
const vistos = new Set();
const externos = new Set();
const fallos = [];

const esInterno = (href) =>
  href.startsWith("/") && !href.startsWith("//");

function normaliza(href, desde) {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (/^https?:\/\//.test(href)) {
    if (href.startsWith(BASE)) return href.slice(BASE.length) || "/";
    externos.add(href);
    return null;
  }
  if (href.startsWith("#")) return `${desde}${href}`;
  if (!esInterno(href)) return null;
  return href;
}

async function pide(ruta) {
  const res = await fetch(BASE + ruta, { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) {
    const destino = res.headers.get("location") ?? "";
    const rel = destino.startsWith(BASE) ? destino.slice(BASE.length) : destino;
    return { status: res.status, redirectTo: rel, html: "" };
  }
  const tipo = res.headers.get("content-type") ?? "";
  const html = tipo.includes("html") ? await res.text() : "";
  return { status: res.status, redirectTo: null, html };
}

while (porVisitar.length) {
  const bruto = porVisitar.shift();
  const [ruta, ancla] = bruto.split("#");
  const limpia = ruta.split("?")[0] || "/";
  if (vistos.has(limpia)) {
    if (ancla) comprueba_ancla(limpia, ancla, bruto);
    continue;
  }
  vistos.add(limpia);

  let r;
  try {
    r = await pide(limpia);
  } catch (e) {
    fallos.push(`✗ ${limpia} — no responde (${e.message})`);
    continue;
  }

  if (r.redirectTo !== null) {
    paginas.set(limpia, { status: r.status, ids: new Set(), enlaces: [] });
    // Se sigue la redirección para comprobar que acaba en algo.
    const destino = r.redirectTo.split("#")[0].split("?")[0];
    if (destino.startsWith("/") && !vistos.has(destino)) porVisitar.push(destino);
    continue;
  }

  if (r.status !== 200) {
    fallos.push(`✗ ${limpia} — ${r.status}`);
    continue;
  }

  const ids = new Set([...r.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const hrefs = [...r.html.matchAll(/\shref="([^"]*)"/g)].map((m) => m[1]);
  const srcs = [...r.html.matchAll(/\ssrc="([^"]*)"/g)].map((m) => m[1]);
  paginas.set(limpia, { status: 200, ids, enlaces: hrefs });

  for (const h of hrefs) {
    const n = normaliza(h, limpia);
    if (!n) continue;
    const [p, a] = n.split("#");
    const base = (p || limpia).split("?")[0];
    if (PRIVADAS.test(base)) continue;
    if (a) porVisitar.push(`${base}#${a}`);
    else if (!vistos.has(base)) porVisitar.push(base);
  }

  // Imágenes: sólo las servidas por nosotros y sin el optimizador de Next
  // (that one ya prueba el original por dentro).
  for (const src of srcs) {
    if (!src.startsWith("/") || src.startsWith("/_next")) continue;
    const limpio = src.split("?")[0];
    if (vistos.has(`img:${limpio}`)) continue;
    vistos.add(`img:${limpio}`);
    try {
      const res = await fetch(BASE + limpio, { method: "HEAD" });
      if (res.status !== 200) fallos.push(`✗ imagen ${limpio} — ${res.status} (en ${limpia})`);
    } catch {
      fallos.push(`✗ imagen ${limpio} — no responde (en ${limpia})`);
    }
  }
}

function comprueba_ancla(ruta, ancla, origen) {
  const p = paginas.get(ruta);
  if (!p || p.status !== 200) return;
  if (!p.ids.has(ancla)) fallos.push(`✗ ancla #${ancla} no existe en ${ruta} (enlazada como ${origen})`);
}

// Segunda pasada: ahora que están todas las páginas, se validan las anclas.
for (const [ruta, info] of paginas) {
  if (info.status !== 200) continue;
  for (const h of info.enlaces) {
    const n = normaliza(h, ruta);
    if (!n || !n.includes("#")) continue;
    const [p, a] = n.split("#");
    const destino = (p || ruta).split("?")[0];
    if (PRIVADAS.test(destino)) continue;
    comprueba_ancla(destino, a, ruta);
  }
}

const ok = [...paginas.values()].filter((p) => p.status === 200).length;
const redir = [...paginas.values()].filter((p) => p.status >= 300 && p.status < 400).length;

console.log(`${paginas.size} URLs · ${ok} en 200 · ${redir} redirecciones · ${externos.size} enlaces externos (no se piden)`);
if (fallos.length) {
  console.log(`\n${fallos.length} problemas:`);
  [...new Set(fallos)].forEach((f) => console.log(`  ${f}`));
  process.exitCode = 1;
} else {
  console.log("\nSin enlaces rotos, anclas huérfanas ni imágenes que falten.");
}
