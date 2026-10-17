// ══════════════════════════════════════════════════════════
//  Carga el curso entero en el campus.
//
//   npm run campus:import -- <carpeta>          ensayo: valida y cuenta, no escribe
//   npm run campus:import -- <carpeta> --write  sube archivos y SUSTITUYE los módulos
//
//  <carpeta> tiene que traer:
//    manifest.json      qué archivo es de quién (alumno / profesor), por módulo y hora
//    content/<key>.json las lecciones en ES y EN, por bloques, con «res:<id>»
//                       en lugar de la URL de cada descarga
//
//  ⚠︎ --write BORRA los módulos del programa (núcleo, Professional y Founder)
//  y con ellos, en cascada, sus lecciones, el progreso de los alumnos en
//  ellas y las tareas asignadas. Los cursos relámpago no se tocan.
//
//  Lo del alumno va al bucket público `lesson-assets`; lo del profesor
//  (solucionarios, guiones, kits, tests, diapositivas) al privado
//  `teacher-guides`, que sólo lee el staff. Volver a lanzarlo sobrescribe los
//  archivos en vez de duplicarlos.
//
//  Necesita la migración 0016 aplicada y la service role en .env.local.
// ══════════════════════════════════════════════════════════
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  if (!line.includes("=") || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { createAdminClient } = await import("@/lib/supabase/admin.ts");
const { parseBlocks } = await import("@/lib/content/blocks.ts");

const dir = process.argv[2];
const WRITE = process.argv.includes("--write");
if (!dir || !existsSync(join(dir, "manifest.json"))) {
  console.error("Uso: npm run campus:import -- <carpeta con manifest.json y content/> [--write]");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
const contentDir = join(dir, "content");
const contents = Object.fromEntries(
  readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const c = JSON.parse(readFileSync(join(contentDir, f), "utf8"));
      return [c.key, c];
    }),
);

const COURSE_LABEL = { core: "NÚCLEO", "remote-professional": "PROFESSIONAL", "remote-founder": "FOUNDER" };
const COURSE_ORDER = { core: 0, "remote-professional": 100, "remote-founder": 200 };
const ICONS = ["Education", "Laptop", "Chat", "Time", "Collaborate", "Events", "GroupSecurity", "Favorite", "UserMultiple", "ChartLine"];
const SECTION_ORDER = { preclase: 0, "hora-1": 1, "hora-2": 2, "hora-3": 3, "hora-4": 4 };

const MIME = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  html: "text/html",
  txt: "text/plain",
  csv: "text/csv",
};

/** Ruta de Storage legible y sin caracteres que el bucket no acepta. */
function safeName(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const supabase = createAdminClient();
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const publicUrl = (path) => `${SUPA_URL}/storage/v1/object/public/lesson-assets/${path.split("/").map(encodeURIComponent).join("/")}`;

// ── 1. Índice de archivos ─────────────────────────────────
const files = new Map(); // id → { ...entry, key, section, path, bucket }
for (const m of manifest.modules) {
  for (const [section, items] of Object.entries(m.sections)) {
    for (const it of items) {
      const bucket = it.audience === "student" ? "lesson-assets" : "teacher-guides";
      const path = `${bucket === "lesson-assets" ? "curso/" : ""}${m.key}/${section}/${safeName(it.name)}`;
      files.set(it.id, { ...it, key: m.key, section, bucket, path });
    }
  }
}
for (const it of manifest.general) {
  files.set(it.id, { ...it, key: null, section: "general", bucket: "teacher-guides", path: `general/${safeName(it.name)}` });
}

// ── 2. Validar el contenido ───────────────────────────────
const problems = [];
const used = new Set();
function resolve(blocks, where) {
  const out = JSON.parse(JSON.stringify(blocks ?? []));
  for (const b of out) {
    if (b.t !== "resources") continue;
    b.items = (b.items ?? []).flatMap((r) => {
      if (typeof r.url === "string" && r.url.startsWith("res:")) {
        const f = files.get(r.url.slice(4));
        if (!f) return problems.push(`${where}: recurso desconocido ${r.url}`), [];
        if (f.bucket !== "lesson-assets") return problems.push(`${where}: ${f.name} es material de profesor`), [];
        used.add(f.id);
        return [{ ...r, url: publicUrl(f.path) }];
      }
      if (!/^https:\/\//.test(r.url ?? "")) return problems.push(`${where}: enlace no válido ${r.url}`), [];
      return [r];
    });
  }
  const parsed = parseBlocks(out);
  if (parsed.length !== out.length) problems.push(`${where}: ${out.length - parsed.length} bloques descartados por formato`);
  return parsed;
}

const missing = manifest.modules.filter((m) => !contents[m.key]).map((m) => m.key);
if (missing.length) problems.push(`Faltan módulos en content/: ${missing.join(", ")}`);

const plan = manifest.modules
  .filter((m) => contents[m.key])
  .map((m) => {
    const c = contents[m.key];
    const lessons = [...c.lessons]
      .sort((a, b) => (SECTION_ORDER[a.section] ?? 9) - (SECTION_ORDER[b.section] ?? 9))
      .map((l, i) => ({
        section: l.section,
        order_index: i + 1,
        slug: l.section,
        title: l.title_es,
        title_en: l.title_en,
        subtitle: l.subtitle_es ?? null,
        subtitle_en: l.subtitle_en ?? null,
        duration_min: l.duration_min ?? 60,
        content_blocks: resolve(l.blocks_es, `${m.key}/${l.section}/es`),
        content_blocks_en: resolve(l.blocks_en, `${m.key}/${l.section}/en`),
      }));
    return { m, c, lessons };
  });

const studentFiles = [...files.values()].filter((f) => f.bucket === "lesson-assets");
const teacherFiles = [...files.values()].filter((f) => f.bucket === "teacher-guides");
const unusedStudent = studentFiles.filter((f) => !used.has(f.id));

console.log(`Módulos: ${plan.length} · Lecciones: ${plan.reduce((a, p) => a + p.lessons.length, 0)}`);
console.log(`Archivos alumno: ${studentFiles.length} (${unusedStudent.length} sin enlazar en ninguna lección)`);
console.log(`Archivos profesor: ${teacherFiles.length}`);
if (problems.length) {
  console.log(`\n${problems.length} problemas:`);
  for (const p of problems.slice(0, 60)) console.log("  · " + p);
}
if (!WRITE) {
  console.log("\nEnsayo: no se ha escrito nada. Añade --write para cargarlo.");
  process.exit(problems.some((p) => p.startsWith("Faltan")) ? 1 : 0);
}

// ── 3. Subir archivos ─────────────────────────────────────
async function upload(f) {
  const body = readFileSync(f.src);
  const contentType = MIME[extname(f.name).slice(1).toLowerCase()] ?? "application/octet-stream";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { error } = await supabase.storage.from(f.bucket).upload(f.path, body, { contentType, upsert: true });
    if (!error) return;
    if (attempt === 3) throw new Error(`${f.path}: ${error.message}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
}

async function pool(items, n, fn) {
  let i = 0, done = 0;
  const failures = [];
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const it = items[i++];
        try {
          await fn(it);
        } catch (e) {
          failures.push(e.message);
        }
        if (++done % 50 === 0) console.log(`  ${done}/${items.length}`);
      }
    }),
  );
  return failures;
}

// Sólo lo que alguna lección enlaza: un archivo público al que no lleva
// ningún enlace no lo encuentra nadie, y ocupa sitio igual.
console.log("\nSubiendo archivos del alumno…");
const f1 = await pool(studentFiles.filter((f) => used.has(f.id)), 6, upload);
console.log("Subiendo material del profesorado…");
const f2 = await pool(teacherFiles, 6, upload);
if (f1.length || f2.length) {
  console.error(`\n${f1.length + f2.length} archivos no se han podido subir:`);
  for (const f of [...f1, ...f2].slice(0, 30)) console.error("  · " + f);
  console.error("No se tocan los módulos hasta que suban todos. Vuelve a lanzar el script.");
  process.exit(1);
}

// ── 4. Sustituir los módulos ──────────────────────────────
console.log("\nSustituyendo los módulos del programa…");
const { error: delErr } = await supabase.from("modules").delete().in("course", ["core", "remote-professional", "remote-founder"]);
if (delErr) throw new Error(`Borrando módulos: ${delErr.message}`);

const moduleIds = {};
for (const [idx, { m, c, lessons }] of plan.entries()) {
  const num = String(m.num).padStart(2, "0");
  const { data: mod, error } = await supabase
    .from("modules")
    .insert({
      slug: `${m.course === "core" ? "nucleo" : m.course}-${num}`,
      order_index: COURSE_ORDER[m.course] + m.num,
      code: `MÓDULO ${num} · ${COURSE_LABEL[m.course]}`,
      title: c.module.title_es,
      title_en: c.module.title_en,
      description: c.module.description_es,
      description_en: c.module.description_en,
      icon: ICONS[idx % ICONS.length],
      accent: "#161616",
      available: true,
      course: m.course,
      estimated_minutes: lessons.reduce((a, l) => a + (l.duration_min ?? 0), 0),
    })
    .select("id")
    .single();
  if (error) throw new Error(`Módulo ${m.key}: ${error.message}`);
  moduleIds[m.key] = mod.id;

  const rows = lessons.map(({ section, ...l }) => ({ ...l, module_id: mod.id, content_md: "" }));
  const { error: lErr } = await supabase.from("lessons").insert(rows);
  if (lErr) throw new Error(`Lecciones de ${m.key}: ${lErr.message}`);
  console.log(`  ✓ ${m.key} · ${c.module.title_es} (${rows.length} lecciones)`);
}

// ── 5. Índice de la guía del profesorado ──────────────────
await supabase.from("teacher_resources").delete().neq("path", "");
const tRows = teacherFiles.map((f, i) => ({
  module_id: f.key ? moduleIds[f.key] ?? null : null,
  section: f.section,
  label: f.name.replace(/\.[a-z]+$/i, "").replace(/^\d+[A-Z]?[._]+\s*/, "").replace(/_+/g, " "),
  path: f.path,
  lang: f.lang,
  order_index: i,
}));
for (let i = 0; i < tRows.length; i += 500) {
  const { error } = await supabase.from("teacher_resources").insert(tRows.slice(i, i + 500));
  if (error) throw new Error(`Guía del profesorado: ${error.message}`);
}

console.log(`\nHecho: ${plan.length} módulos, ${plan.reduce((a, p) => a + p.lessons.length, 0)} lecciones, ${tRows.length} archivos en la guía del profesorado.`);
