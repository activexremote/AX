// Construye src/lib/ayuda-panel/manual.ts a partir de los .md de
// docs/ayuda-panel/. Cada «## » es un capítulo; ROLES dice quién lo ve
// (por el principio del título). Lo que va antes del primer «## » de cada
// archivo (las convenciones) va para todos.
//
//   node scripts/build-ayuda-panel.mjs
//
// Si una sección del panel cambia, se corrige el .md y se vuelve a lanzar.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "docs/ayuda-panel";
const SALIDA = "src/lib/ayuda-panel/manual.ts";
const TODOS = ["administrador", "profesor", "comercial"];

/** Título del capítulo (empieza por) → roles. Lo que no está aquí, sólo administración. */
const ROLES = [
  ["El panel en sí", TODOS],
  ["El menú lateral", TODOS],
  ["Gestor comercial", ["administrador", "comercial"]],
  ["Resumen", ["administrador", "profesor"]],
  ["Manual del profesor", ["administrador", "profesor"]],
  ["Módulos", ["administrador", "profesor"]],
  ["Editor de lección", ["administrador", "profesor"]],
  ["Tareas", ["administrador", "profesor"]],
  ["Guía", ["administrador", "profesor"]],
  ["Asistente", ["administrador", "profesor"]],
  ["Respuestas", ["administrador", "profesor"]],
];

const rolesDe = (titulo) => {
  const limpio = titulo.replace(/^\d+\.\s*/, "");
  return ROLES.find(([p]) => limpio.startsWith(p))?.[1] ?? ["administrador"];
};

const capitulos = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".md")).sort()) {
  const md = readFileSync(join(DIR, f), "utf8");
  const [intro, ...trozos] = md.split(/^(?=## )/m);
  if (intro.trim()) capitulos.push({ titulo: `${f} · introducción`, roles: TODOS, texto: intro.trim() });
  for (const t of trozos) {
    const titulo = t.slice(3, t.indexOf("\n")).trim();
    capitulos.push({ titulo, roles: rolesDe(titulo), texto: t.trim() });
  }
}

const ts = `// ⚠︎ Generado por scripts/build-ayuda-panel.mjs a partir de docs/ayuda-panel/*.md. No se edita a mano.
import type { UserRole } from "@/lib/supabase/types";

export type Capitulo = { titulo: string; roles: UserRole[]; texto: string };

export const CAPITULOS: Capitulo[] = ${JSON.stringify(capitulos, null, 2)};
`;
writeFileSync(SALIDA, ts);
for (const c of capitulos) console.log(`${c.roles.map((r) => r[0].toUpperCase()).join("")}\t${c.texto.length}\t${c.titulo}`);
