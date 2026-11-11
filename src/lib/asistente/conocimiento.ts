import "server-only";

import { CATEGORIES, TOOLS, toolsCopy } from "@/app/bienvenida/tools";
import { TEACHERS } from "@/app/trabajo-remoto/faculty";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourseKey } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Lo que el asistente sabe del curso, además de las FAQs
//
//  · El temario: todos los programas, módulos y lecciones (títulos y
//    subtítulos), para contestar «¿qué se ve en el curso?».
//  · El texto completo de los módulos que puede ver quien pregunta, sacado
//    de los bloques de cada lección, para contestar sobre el contenido.
//  · El stack de herramientas y el claustro, de los mismos archivos que la
//    web pública: lo que dice el chat y lo que dice la web no se separan.
//
//  El temario cambia poco: se guarda diez minutos en memoria.
// ══════════════════════════════════════════════════════════

const PROGRAMAS: Record<string, string> = {
  core: "Núcleo común (lo cursan Remote Professional y Remote Founder)",
  "remote-professional": "Remote Professional · Career Accelerator (trabajar en remoto para empresas)",
  "remote-founder": "Remote Founder · Global Builder (montar tu negocio remoto)",
  "web-abc": "Curso relámpago: tu web con IA",
};

/** Lo que cabe del texto de los módulos. Uno ronda los 12.000 caracteres. */
const PRESUPUESTO_MODULOS = 50_000;
const VIDA = 10 * 60_000;

type Modulo = { id: string; course: string; order_index: number; title: string; description: string | null; slug: string };
type Leccion = { id: string; module_id: string; order_index: number; title: string; subtitle: string | null; duration_min: number | null };

let temarioCache: { en: number; texto: string; modulos: Modulo[] } | null = null;

async function temario() {
  if (temarioCache && Date.now() - temarioCache.en < VIDA) return temarioCache;
  const admin = createAdminClient();
  const [{ data: modulos }, { data: lecciones }] = await Promise.all([
    admin.from("modules").select("id, course, order_index, title, description, slug").order("course").order("order_index"),
    admin.from("lessons").select("id, module_id, order_index, title, subtitle, duration_min").order("order_index"),
  ]);
  const ms = (modulos ?? []) as Modulo[];
  const ls = (lecciones ?? []) as Leccion[];

  const lineas: string[] = [];
  for (const [curso, nombre] of Object.entries(PROGRAMAS)) {
    const suyos = ms.filter((m) => m.course === curso);
    if (!suyos.length) continue;
    lineas.push(`## ${nombre}`);
    suyos.forEach((m, i) => {
      lineas.push(`Módulo ${curso === "core" ? m.order_index : i + 1} · ${m.title}${m.description ? ` — ${m.description}` : ""}`);
      for (const l of ls.filter((x) => x.module_id === m.id)) lineas.push(`  - ${l.title}${l.subtitle ? `: ${l.subtitle}` : ""}`);
    });
  }

  const es = toolsCopy.es;
  const herramientas = CATEGORIES.map(
    (c) =>
      `${es.categories[c.key]}: ${c.tools
        .map((id) => {
          const t = TOOLS.find((x) => x.id === id);
          return t ? `${t.name}${es.desc[id] ? ` (${es.desc[id]})` : ""}` : null;
        })
        .filter(Boolean)
        .join("; ")}`,
  );

  const claustro = TEACHERS.map((t) => `${t.name} — ${t.es.role}. ${t.es.bio} Perfil: ${t.url}`);

  const texto = [
    `TEMARIO DE LOS PROGRAMAS:\n${lineas.join("\n")}`,
    `HERRAMIENTAS QUE SE TRABAJAN EN EL PROGRAMA (por función):\n${herramientas.join("\n")}`,
    `CLAUSTRO:\n${claustro.join("\n")}`,
  ].join("\n\n---\n\n");

  temarioCache = { en: Date.now(), texto, modulos: ms };
  return temarioCache;
}

/** Las cadenas de un bloque de lección, en orden: párrafos, listas, tablas… */
function textoDe(valor: unknown, clave = ""): string[] {
  if (typeof valor === "string") return ["t", "icon", "src", "url", "href", "image", "tone", "variant"].includes(clave) ? [] : [valor];
  if (Array.isArray(valor)) {
    if (valor.every((v) => Array.isArray(v))) return valor.map((fila) => (fila as unknown[]).map(String).join(" | "));
    if (valor.every((v) => typeof v === "string")) return [(valor as string[]).map((v) => `- ${v}`).join("\n")];
    return valor.flatMap((v) => textoDe(v));
  }
  if (valor && typeof valor === "object") return Object.entries(valor).flatMap(([k, v]) => textoDe(v, k));
  return [];
}

/**
 * Los módulos cuyo contenido puede ver quien pregunta, con el que está en su
 * dry run primero. El equipo ve el del próximo dry run (o el Módulo 1).
 */
async function modulosVisibles(userId: string, cursos: CourseKey[], esEquipo: boolean, todos: Modulo[]): Promise<Modulo[]> {
  const admin = createAdminClient();
  const ahora = new Date().toISOString();
  const [{ data: grants }, { data: runs }] = await Promise.all([
    admin.from("module_grants").select("module_id, expires_at").eq("user_id", userId),
    esEquipo
      ? admin.from("dry_runs").select("module_id").gte("ends_at", ahora).order("starts_at").limit(1)
      : Promise.resolve({ data: [] as { module_id: string }[] }),
  ]);
  const primero = new Set<string>([
    ...(grants ?? []).filter((g) => !g.expires_at || g.expires_at > ahora).map((g) => g.module_id),
    ...(runs ?? []).map((r) => r.module_id),
  ]);
  if (esEquipo && !primero.size) {
    const m1 = todos.find((m) => m.course === "core" && m.order_index === 1);
    if (m1) primero.add(m1.id);
  }
  const porCurso = esEquipo ? [] : todos.filter((m) => cursos.includes(m.course as CourseKey) && !primero.has(m.id));
  return [...todos.filter((m) => primero.has(m.id)), ...porCurso];
}

export async function conocimiento(userId: string, cursos: CourseKey[], esEquipo: boolean): Promise<string> {
  const { texto, modulos } = await temario();
  const visibles = await modulosVisibles(userId, cursos, esEquipo, modulos);
  if (!visibles.length) return texto;

  const { data: lecciones } = await createAdminClient()
    .from("lessons")
    .select("id, module_id, order_index, title, subtitle, duration_min, content_md, content_blocks")
    .in("module_id", visibles.map((m) => m.id))
    .order("order_index");

  const partes: string[] = [];
  let usado = 0;
  for (const m of visibles) {
    const suyas = (lecciones ?? []).filter((l) => l.module_id === m.id);
    const cuerpo = suyas
      .map((l) => {
        const contenido = [l.content_md, ...textoDe(l.content_blocks ?? [])].filter(Boolean).join("\n");
        return `### ${l.title}${l.duration_min ? ` (${l.duration_min} min)` : ""} — [abrir](/lecciones/${l.id})\n${l.subtitle ?? ""}\n${contenido}`;
      })
      .join("\n\n");
    const bloque = `## Módulo «${m.title}» — [abrir](/modulos/${m.slug})\n${m.description ?? ""}\n\n${cuerpo}`;
    if (usado + bloque.length > PRESUPUESTO_MODULOS && partes.length) break;
    partes.push(bloque.slice(0, PRESUPUESTO_MODULOS));
    usado += bloque.length;
  }
  return `${texto}\n\n---\n\nCONTENIDO COMPLETO DE LOS MÓDULOS A LOS QUE TIENE ACCESO:\n${partes.join("\n\n")}`;
}
