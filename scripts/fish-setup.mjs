// Comprueba la cuenta de Fish Audio y lista tus voces.
//
//   npm run fish:setup                     → clave, saldo y voces disponibles
//   npm run fish:setup -- --probar         → genera una muestra en /tmp para oírla
//
// Sirve para dos cosas: saber que la clave funciona antes de tocar el campus,
// y sacar el FISH_VOICE_ID que hay que pegar en .env.local. Sin ese id, Fish
// narra con su voz por defecto, que no es la del curso.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// .env.local no lo carga Node por su cuenta.
for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { listVoices, synthesize } = await import("@/lib/tts/fish.ts");

const key = process.env.FISH_API_KEY;
if (!key) {
  console.error(`
Falta FISH_API_KEY en .env.local.

  1. Entra en https://fish.audio y crea la cuenta.
  2. Ve a Settings → API Keys → Create new key.
  3. Pega la clave en .env.local:  FISH_API_KEY=...
`);
  process.exit(1);
}

console.log(`Clave: ${key.slice(0, 8)}…\n`);

// ── Saldo ─────────────────────────────────────────────────
try {
  const res = await fetch("https://api.fish.audio/wallet/self/api-credit", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (res.ok) console.log("Saldo:", JSON.stringify(await res.json()), "\n");
  else console.log(`Saldo: no se pudo leer (${res.status}). No es grave.\n`);
} catch {
  console.log("Saldo: no se pudo leer. No es grave.\n");
}

// ── Voces ─────────────────────────────────────────────────
let voces = [];
try {
  voces = await listVoices();
} catch (e) {
  console.error("No se pudieron listar las voces:", e.message);
  console.error("Si es un 401, la clave está mal copiada.");
  process.exit(1);
}

if (!voces.length) {
  console.log(`No tienes ninguna voz propia todavía.

Dos caminos:
  · Voz clonada tuya: fish.audio → Playground → Voice Cloning. Sube 30-60 s
    de ti hablando limpio y te da un id. Es lo que hace que el campus suene
    a ti y no a un locutor genérico.
  · Voz del catálogo: fish.audio → Discover, abre la que te guste y copia el
    id de la URL (fish.audio/m/<ID>).

Luego pega el id en .env.local:  FISH_VOICE_ID=<ID>`);
} else {
  console.log("Tus voces (pega el id en FISH_VOICE_ID):\n");
  for (const v of voces) {
    console.log(`  ${v.id}  ${v.title}${v.languages.length ? `  [${v.languages.join(", ")}]` : ""}`);
  }
}

// ── Comparador de voces ───────────────────────────────────
//
// Elegir voz leyendo nombres no funciona: "Narrador v2" y "voz de locutor k"
// suenan igual sobre el papel y nada parecido en el oído. Esto narra el mismo
// párrafo del curso con cada candidata y las deja en /tmp para escucharlas
// seguidas. Son cuatro frases: lo que cuesta es despreciable.
//
// El catálogo de Fish está lleno de voces clonadas de personas reconocibles
// —locutores con nombre y apellidos, actores de doblaje—. Ninguna está aquí:
// el campus se vende, y narrarlo con la voz clonada de alguien identificable
// es un problema que no compensa por un matiz de timbre.
const CANDIDATAS = [
  ["35199d5438854f5d9157c500479ab684", "Narrador v2"],
  ["3f45a7fd7a614655a61eb7027b955783", "Voz de locutor"],
  ["bfed5c0810a347dbb62e8ccce7f59c48", "Voz femenina español"],
  ["c87656721dda48a7906f990f036ce76f", "Narrador documental"],
];

const PARRAFO =
  "Vamos a montar la base de datos del proyecto. Abre el panel de Supabase y entra en el editor de SQL. " +
  "Aquí tienes un bloque de código en pantalla. Ojo con una cosa: sin las políticas de acceso, la tabla " +
  "queda abierta a cualquiera que tenga la clave pública.";

if (process.argv.includes("--comparar")) {
  console.log("\nNarrando el mismo párrafo con cada candidata…\n");
  const hechas = [];
  for (const [id, nombre] of CANDIDATAS) {
    process.stdout.write(`  ${nombre} … `);
    try {
      const mp3 = await synthesize(PARRAFO, { referenceId: id });
      const out = path.join(os.tmpdir(), `fish-${id.slice(0, 8)}.mp3`);
      fs.writeFileSync(out, mp3);
      hechas.push([out, id, nombre]);
      console.log("ok");
    } catch (e) {
      console.log(`falló: ${e.message}`);
    }
  }
  if (hechas.length) {
    console.log("\nEscúchalas:");
    for (const [out, , nombre] of hechas) console.log(`  open ${out}    # ${nombre}`);
    console.log("\nLa que te guste, a .env.local:");
    for (const [, id, nombre] of hechas) console.log(`  FISH_VOICE_ID=${id}    # ${nombre}`);
  }
}

// ── Muestra ───────────────────────────────────────────────
if (process.argv.includes("--probar")) {
  const texto =
    "Bienvenido al campus de ActiveXRemote. En esta lección vamos a montar la base de datos del proyecto.";
  console.log(`\nGenerando muestra con FISH_VOICE_ID=${process.env.FISH_VOICE_ID ?? "(voz por defecto)"}…`);
  try {
    const mp3 = await synthesize(texto);
    const out = path.join(os.tmpdir(), "fish-muestra.mp3");
    fs.writeFileSync(out, mp3);
    console.log(`Listo: ${out}  (${(mp3.length / 1024).toFixed(0)} KB)`);
    console.log(`Ábrelo con:  open ${out}`);
  } catch (e) {
    console.error("Falló la síntesis:", e.message);
    process.exit(1);
  }
}
