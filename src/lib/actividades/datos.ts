import "server-only";

import { cache } from "react";

import { actividadesDelModulo, modulosConActividades } from "@/lib/actividades/catalogo";
import { hecha, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { usuarioActual } from "@/lib/data/usuario";
import { getMiDryRun } from "@/lib/dry-run/datos";
import { enMadrid, partesMadrid } from "@/lib/dry-run/tiempo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Actividades: lo que se lee de la base
// ══════════════════════════════════════════════════════════

const COLUMNAS = "id, user_id, lesson_id, activity_key, answers, result, status, attempts, submitted_at, rubric, feedback, reviewed_at, updated_at";

/** Cuenta como hecha: enviada o revisada, y un test sólo si está aprobado. */
export function cuentaComoHecha(a: Actividad, fila: Pick<FilaRespuesta, "status" | "result"> | undefined) {
  if (!fila || !hecha(fila.status)) return false;
  if (a.tipo === "test" && fila.result?.aprobado === false) return false;
  return true;
}

/** Las respuestas de quien está dentro, por clave de actividad. */
export const misRespuestas = cache(async (): Promise<Map<string, FilaRespuesta>> => {
  const user = await usuarioActual();
  if (!user) return new Map();
  const supabase = await createClient();
  const { data } = await supabase.from("activity_responses").select(COLUMNAS).eq("user_id", user.id);
  return new Map(((data ?? []) as FilaRespuesta[]).map((f) => [f.activity_key, f]));
});

/** Las 23:59 de un día en Madrid, como instante. */
const finDeDiaMadrid = (y: number, m: number, d: number) => enMadrid(y, m, d, 23, 59).toISOString();

export type Plazos = { antesClase: string | null; semana: string | null; origen: "dry-run" | "tarea" | null };

/**
 * Cuándo vence cada actividad de un módulo para quien está dentro.
 * En el dry run: lo de antes de la clase, al empezar la clase; lo demás, el
 * viernes siguiente a las 23:59 de Madrid (el «único plazo» del módulo). Si
 * el profesor le asignó el módulo con fecha, esa fecha para todo.
 */
export const plazosDelModulo = cache(async (moduleId: string): Promise<Plazos> => {
  const dry = await getMiDryRun();
  if (dry && dry.run.module_id === moduleId) {
    const p = partesMadrid(new Date(dry.run.starts_at));
    // Día de la semana en Madrid (0 = domingo) para llegar al viernes siguiente.
    const dow = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
    const hasta = ((5 - dow + 7) % 7) || 7;
    const v = new Date(Date.UTC(p.y, p.m - 1, p.d + hasta));
    return { antesClase: dry.run.starts_at, semana: finDeDiaMadrid(v.getUTCFullYear(), v.getUTCMonth() + 1, v.getUTCDate()), origen: "dry-run" };
  }
  const user = await usuarioActual();
  if (!user) return { antesClase: null, semana: null, origen: null };
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("due_date")
    .eq("student_id", user.id)
    .eq("module_id", moduleId)
    .not("due_date", "is", null)
    .order("due_date")
    .limit(1)
    .maybeSingle();
  if (!data?.due_date) return { antesClase: null, semana: null, origen: null };
  const [y, m, d] = (data.due_date as string).split("-").map(Number);
  const fin = finDeDiaMadrid(y, m, d);
  return { antesClase: fin, semana: fin, origen: "tarea" };
});

export const plazoDe = (a: Actividad, p: Plazos) => (a.plazo === "antes-clase" ? p.antesClase : p.semana);

export type TareaActividad = {
  actividad: Actividad;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  plazo: string | null;
  fila: FilaRespuesta | undefined;
  hecha: boolean;
};

/** Todas las actividades de los módulos a los que tiene acceso quien está dentro, con su plazo y su estado. */
export async function misTareasDeActividades(locale: "es" | "en"): Promise<TareaActividad[]> {
  const user = await usuarioActual();
  if (!user) return [];
  const supabase = await createClient();
  // La política de modules ya filtra por acceso: sólo vuelve lo que puede ver.
  const { data: modulos } = await supabase.from("modules").select("id, slug, title, title_en").in("slug", modulosConActividades());
  if (!modulos?.length) return [];
  const { data: lecciones } = await supabase
    .from("lessons")
    .select("id, module_id, order_index, title, title_en")
    .in(
      "module_id",
      modulos.map((m) => m.id),
    );
  const respuestas = await misRespuestas();
  const out: TareaActividad[] = [];
  for (const m of modulos) {
    const plazos = await plazosDelModulo(m.id as string);
    for (const a of actividadesDelModulo(m.slug as string)) {
      const l = (lecciones ?? []).find((x) => x.module_id === m.id && x.order_index === a.leccion);
      if (!l) continue;
      const fila = respuestas.get(a.key);
      out.push({
        actividad: a,
        moduleId: m.id as string,
        moduleTitle: ((locale === "en" && (m.title_en as string)) || (m.title as string)) ?? "",
        lessonId: l.id as string,
        lessonTitle: ((locale === "en" && (l.title_en as string)) || (l.title as string)) ?? "",
        plazo: plazoDe(a, plazos),
        fila,
        hecha: cuentaComoHecha(a, fila),
      });
    }
  }
  return out;
}

/** Cuántas actividades obligatorias le quedan por hacer (el aviso de la cabecera). */
export const contarActividadesAbiertas = cache(async (): Promise<number> => {
  const tareas = await misTareasDeActividades("es");
  return tareas.filter((x) => x.actividad.obligatoria && !x.hecha).length;
});

/** Para el panel del profesorado: todas las respuestas, con quién las ha dado. */
export async function todasLasRespuestas(keys: string[]) {
  const admin = createAdminClient();
  const { data } = await admin.from("activity_responses").select(COLUMNAS).in("activity_key", keys).order("updated_at", { ascending: false });
  const filas = (data ?? []) as FilaRespuesta[];
  const ids = [...new Set(filas.map((f) => f.user_id))];
  const { data: perfiles } = ids.length ? await admin.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] };
  const quien = new Map((perfiles ?? []).map((p) => [p.id as string, { nombre: (p.full_name as string) || (p.email as string) || "—", email: (p.email as string) ?? "" }]));
  return { filas, quien };
}

