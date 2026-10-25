import { AssignmentForm } from "@/components/admin/assignment-form";
import { ListaTareas, type EstadoTarea, type FilaTarea } from "@/components/admin/listas/lista-tareas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { listAssignments } from "@/lib/data/assignments";
import { adminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Tareas
//
//  Arriba, lo que pide atención (vencidas, que vencen pronto); debajo, todas
//  las tareas con su progreso real y filtros. Asignar es un botón que no se
//  esconde.
// ══════════════════════════════════════════════════════════

/** Hoy en Madrid, como AAAA-MM-DD: es la fecha con la que se mira el plazo. */
const hoyMadrid = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());

const DIA = 86_400_000;
const diasEntre = (desde: string, hasta: string) => Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / DIA);

export default async function AdminTareasPage() {
  const supabase = await createClient();
  const [{ data: students }, { data: modules }, assignments, { locale }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("role", "alumno").order("full_name"),
    supabase.from("modules").select("id, title, code").order("order_index"),
    listAssignments(),
    getI18n(),
  ]);
  const copy = adminV2BCopy[locale];

  const studentOptions = (students ?? []).map((s) => ({
    id: s.id as string,
    label: ((s.full_name as string) || (s.email as string)) ?? "—",
    hint: s.full_name ? (s.email as string) : undefined,
  }));
  const moduleOptions = (modules ?? []).map((m) => ({ id: m.id as string, label: m.title as string, hint: (m.code as string) ?? undefined }));
  const codeById = new Map((modules ?? []).map((m) => [m.id as string, (m.code as string) ?? null]));

  const hoy = hoyMadrid();
  const filas: FilaTarea[] = assignments.map((a) => {
    const dias = a.due_date ? diasEntre(hoy, a.due_date) : null;
    const terminada = a.status === "completada" || (a.module_lessons > 0 && a.lessons_done >= a.module_lessons);
    const estado: EstadoTarea = terminada
      ? "completada"
      : dias !== null && dias < 0
        ? "vencida"
        : dias !== null && dias <= 3
          ? "pronto"
          : a.status === "en_curso" || a.lessons_done > 0
            ? "en_curso"
            : "pendiente";
    return {
      id: a.id,
      student_id: a.student_id,
      student_name: a.student_name,
      student_email: a.student_email,
      module_id: a.module_id,
      module_title: a.module_title,
      module_code: codeById.get(a.module_id) ?? null,
      done: a.lessons_done,
      total: a.module_lessons,
      due_date: a.due_date,
      dias,
      note: a.note,
      created_at: a.created_at,
      estado,
    };
  });

  const n = (e: EstadoTarea[]) => filas.filter((f) => e.includes(f.estado)).length;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.tTitle}</h1>
          <p>{copy.tLead}</p>
        </div>
        <div>
          <AssignmentForm students={studentOptions} modules={moduleOptions} copy={copy} />
        </div>
      </div>

      {filas.length ? (
        <div className="axr-adm-stats axr-al-stats">
          <div className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n="tareas" /> {copy.tStatOpen}
            </span>
            <span className="axr-adm-stat__value">{n(["pendiente", "en_curso", "pronto"])}</span>
            <span className="axr-adm-stat__hint">{copy.tStatOpenHint}</span>
          </div>
          <div className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n="reloj" /> {copy.tStatSoon}
            </span>
            <span className="axr-adm-stat__value" style={n(["pronto"]) ? { color: "var(--adm-warn)" } : undefined}>
              {n(["pronto"])}
            </span>
            <span className="axr-adm-stat__hint">{copy.tStatSoonHint}</span>
          </div>
          <div className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n="aviso" /> {copy.tStatOverdue}
            </span>
            <span className="axr-adm-stat__value" style={n(["vencida"]) ? { color: "var(--adm-bad)" } : undefined}>
              {n(["vencida"])}
            </span>
            <span className="axr-adm-stat__hint">{copy.tStatOverdueHint}</span>
          </div>
          <div className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n="ok" /> {copy.tStatDone}
            </span>
            <span className="axr-adm-stat__value">{n(["completada"])}</span>
            <span className="axr-adm-stat__hint">{copy.tStatDoneHint}</span>
          </div>
        </div>
      ) : null}

      <ListaTareas filas={filas} students={studentOptions} modules={moduleOptions} copy={copy} locale={locale} />
    </div>
  );
}
