#!/usr/bin/env node
// Recalcula los enlaces entre artículos (`related`).
//
//   node scripts/blog-links.mjs            # muestra el grafo resultante
//   node scripts/blog-links.mjs --write    # lo escribe en los artículos
//
// ── Qué problema resuelve ─────────────────────────────────
// Los `related` estaban puestos a mano, con tres enlaces por artículo y un
// texto al que no llegaba nadie. Un blog en el que cada pieza es un callejón
// sin salida desaprovecha la única visita que consigue: quien termina de leer
// se va, en vez de leer otra.
//
// ── Cómo decide ───────────────────────────────────────────
// Puntúa cada par por lo que de verdad los emparenta, de más a menos:
//   · términos del diccionario compartidos — dos guías que hablan de
//     "residencia fiscal" y "regla de los 183 días" tratan lo mismo;
//   · mismo cluster temático;
//   · mismo curso al que empujan;
//   · avance de embudo: de una guía informativa a una comercial, no al revés.
//
// Después repara el grafo: ningún artículo puede quedarse sin enlaces
// entrantes, porque un artículo al que nadie apunta sólo se encuentra por
// buscador.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const WRITE = process.argv.includes("--write");
const DIR = "src/app/blog/articles";
const POR_ARTICULO = 4;

// Se leen los ficheros como texto: importar TypeScript desde Node pelado
// obliga a montar un cargador, y aquí sólo hacen falta cinco campos.
const campo = (src, name) => {
  const m = src.match(new RegExp(`^ {2}${name}: "([^"]*)",$`, "m"));
  return m?.[1] ?? "";
};
const lista = (src, name) => {
  const m = src.match(new RegExp(`^ {2}${name}: \\[([^\\]]*)\\]`, "m"));
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
};

const arts = readdirSync(DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => {
    const src = readFileSync(`${DIR}/${f}`, "utf8");
    return {
      file: `${DIR}/${f}`,
      slug: campo(src, "slug"),
      locale: campo(src, "locale"),
      cluster: campo(src, "cluster"),
      funnel: campo(src, "funnel"),
      course: campo(src, "course"),
      published: campo(src, "published"),
      terms: lista(src, "terms"),
    };
  });

const FUNNEL = { tofu: 0, mofu: 1, bofu: 2 };

function puntua(a, b) {
  if (a.slug === b.slug || a.locale !== b.locale) return -1;
  const comunes = a.terms.filter((t) => b.terms.includes(t)).length;
  let s = comunes * 3;
  if (a.cluster === b.cluster) s += 2;
  if (a.course && a.course === b.course) s += 2;
  // Llevar al lector hacia la decisión, no de vuelta al principio.
  const paso = FUNNEL[b.funnel] - FUNNEL[a.funnel];
  if (paso === 1) s += 1;
  if (paso < 0) s -= 1;
  // Un empate se rompe por el más reciente: envejece mejor.
  return s + (b.published > a.published ? 0.1 : 0);
}

const elegidos = new Map();
for (const a of arts) {
  const orden = arts
    .map((b) => ({ b, s: puntua(a, b) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s);
  elegidos.set(a.slug, orden.slice(0, POR_ARTICULO).map((x) => x.b.slug));
}

// ── Reparación: que nadie se quede sin enlaces entrantes ──
for (const locale of ["es", "en"]) {
  const delIdioma = arts.filter((a) => a.locale === locale);
  const entrantes = () => {
    const n = Object.fromEntries(delIdioma.map((a) => [a.slug, 0]));
    for (const a of delIdioma) for (const r of elegidos.get(a.slug)) n[r] = (n[r] ?? 0) + 1;
    return n;
  };

  let n = entrantes();
  for (const huerfano of delIdioma.filter((a) => n[a.slug] === 0)) {
    // Su mejor pariente le hace sitio, sacrificando su enlace más flojo —que
    // además suele apuntar a un artículo que ya recibe de sobra.
    const padrino = arts
      .filter((b) => b.locale === locale && b.slug !== huerfano.slug)
      .map((b) => ({ b, s: puntua(b, huerfano) }))
      .sort((x, y) => y.s - x.s)[0]?.b;
    if (!padrino) continue;
    const suyos = elegidos.get(padrino.slug);
    const sobra = [...suyos].sort((x, y) => (n[y] ?? 0) - (n[x] ?? 0))[0];
    elegidos.set(padrino.slug, [...suyos.filter((s) => s !== sobra), huerfano.slug]);
    n = entrantes();
  }
}

// ── Informe ───────────────────────────────────────────────
let escritos = 0;
for (const a of arts) {
  const rel = elegidos.get(a.slug);
  const src = readFileSync(a.file, "utf8");
  const linea = `  related: [${rel.map((r) => `"${r}"`).join(", ")}],`;
  const nuevo = src.replace(/^ {2}related: \[[^\]]*\],$/m, linea);
  if (nuevo !== src) {
    if (WRITE) writeFileSync(a.file, nuevo, "utf8");
    escritos++;
  }
}

for (const locale of ["es", "en"]) {
  const del = arts.filter((a) => a.locale === locale);
  const n = Object.fromEntries(del.map((a) => [a.slug, 0]));
  for (const a of del) for (const r of elegidos.get(a.slug)) n[r] = (n[r] ?? 0) + 1;
  const vals = Object.values(n);
  console.log(
    `${locale}: ${del.length} artículos · entrantes min ${Math.min(...vals)} / máx ${Math.max(...vals)} · huérfanos ${vals.filter((v) => v === 0).length}`,
  );
}
console.log(`${escritos} artículos con enlaces distintos.`);
if (!WRITE) console.log("\n(simulación: vuelve a ejecutarlo con --write)");
