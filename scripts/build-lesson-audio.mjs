// Narra con Fish Audio las lecciones que aún no tienen audio.
//
//   npm run audio:generate                    → dice cuáles faltan y cuánto cuesta
//   npm run audio:generate -- --aplicar       → las genera y las sube
//   npm run audio:generate -- --aplicar --rehacer   → rehace TODAS, tengan o no
//   npm run audio:generate -- --aplicar --leccion <id>
//   npm run audio:generate -- --idioma en     → la versión inglesa (audio_url_en)
//
// Narra desde los bloques de la lección (las del programa no tienen Markdown)
// y, si no hay bloques, desde el Markdown. La voz inglesa es FISH_VOICE_ID_EN,
// o la misma que la española si no se ha puesto.
//
// Sin --aplicar no gasta un céntimo: sólo cuenta caracteres. Es a propósito.
// Narrar un catálogo entero son varios euros y no hay botón de deshacer en la
// factura, así que el modo por defecto es el que no cobra.
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { lessonNarrationText, narrateText, ttsConfigured, voiceFor } = await import("@/lib/tts/fish.ts");

const aplicar = process.argv.includes("--aplicar");
const rehacer = process.argv.includes("--rehacer");
const soloId = process.argv[process.argv.indexOf("--leccion") + 1];
const unaSola = process.argv.includes("--leccion") ? soloId : null;
const idioma = process.argv[process.argv.indexOf("--idioma") + 1] === "en" ? "en" : "es";
const columna = idioma === "en" ? "audio_url_en" : "audio_url";

if (!ttsConfigured()) {
  console.error("Falta FISH_API_KEY en .env.local. Corre antes:  npm run fish:setup");
  process.exit(1);
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let q = admin
  .from("lessons")
  .select("id, title, content_md, content_blocks, content_blocks_en, audio_url, audio_url_en, order_index")
  .order("order_index", { ascending: true });
if (unaSola) q = q.eq("id", unaSola);
else if (!rehacer) q = q.is(columna, null);

const { data: lecciones, error } = await q;
if (error) {
  console.error("No se pudieron leer las lecciones:", error.message);
  process.exit(1);
}

for (const l of lecciones) l.texto = lessonNarrationText(l, idioma);
const pendientes = lecciones.filter((l) => l.texto.trim().length > 0);
const vacias = lecciones.length - pendientes.length;

if (!pendientes.length) {
  console.log("Nada que narrar: todas las lecciones tienen audio o no tienen contenido.");
  process.exit(0);
}

const total = pendientes.reduce((n, l) => n + l.texto.length, 0);
console.log(`Idioma: ${idioma.toUpperCase()} · voz: ${voiceFor(idioma) ?? "la de Fish por defecto"}`);
console.log(`${pendientes.length} lección(es) por narrar · ${total.toLocaleString("es-ES")} caracteres.`);
if (vacias) console.log(`(${vacias} sin contenido, se saltan.)`);

if (!aplicar) {
  console.log("\nSimulación. Nada se ha generado ni cobrado.");
  for (const l of pendientes) {
    console.log(`  ${String(l.texto.length).padStart(6)}  ${l.title}`);
  }
  console.log(`\nPara generarlas de verdad:  npm run audio:generate -- --aplicar${idioma === "en" ? " --idioma en" : ""}`);
  process.exit(0);
}

let hechas = 0;
for (const l of pendientes) {
  process.stdout.write(`→ ${l.title} … `);
  try {
    const { audio, chunks } = await narrateText(l.texto, { referenceId: voiceFor(idioma) });
    const path = `lessons/${l.id}/${Date.now()}-narracion-${idioma}.mp3`;
    const { error: upErr } = await admin.storage
      .from("lesson-audio")
      .upload(path, audio, { contentType: "audio/mpeg", upsert: false });
    if (upErr) throw new Error(upErr.message);

    const { data: pub } = admin.storage.from("lesson-audio").getPublicUrl(path);
    const { error: updErr } = await admin.from("lessons").update({ [columna]: pub.publicUrl }).eq("id", l.id);
    if (updErr) throw new Error(updErr.message);

    hechas++;
    console.log(`ok (${chunks} trozo(s), ${(audio.length / 1024 / 1024).toFixed(1)} MB)`);
  } catch (e) {
    // Una lección que falla no puede tumbar la tanda: las demás siguen.
    console.log(`FALLÓ: ${e.message}`);
  }
}

console.log(`\n${hechas}/${pendientes.length} narradas.`);
