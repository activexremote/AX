import { AssignmentForm } from "@/components/admin/assignment-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAssignment } from "@/app/admin/tareas/actions";
import { listAssignments } from "@/lib/data/assignments";
import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export default async function AdminTareasPage() {
  const supabase = await createClient();
  const [{ data: students }, { data: modules }, assignments, { t }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").eq("role", "alumno").order("full_name"),
    supabase.from("modules").select("id, title, code").order("order_index"),
    listAssignments(),
    getI18n(),
  ]);

  const studentOptions = (students ?? []).map((s) => ({
    id: s.id as string,
    label: (s.full_name as string) ?? (s.email as string),
  }));
  const moduleOptions = (modules ?? []).map((m) => ({
    id: m.id as string,
    label: (m.title as string),
  }));

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.tasksTitle}</h1>
          <p>{t.admin.tasksSubtitle}</p>
        </div>
        <AssignmentForm students={studentOptions} modules={moduleOptions} />
      </div>

      <div className="axr-admin-card">
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.admin.colStudent}</th>
              <th>{t.admin.colModule}</th>
              <th>{t.admin.colProgress}</th>
              <th>{t.admin.colDueDate}</th>
              <th>{t.admin.colStatus}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>{t.admin.noTasks}</td></tr>
            ) : null}
            {assignments.map((a) => {
              const pct = a.module_lessons
                ? Math.round((a.lessons_done / a.module_lessons) * 100)
                : 0;
              return (
                <tr key={a.id}>
                  <td>{a.student_name}</td>
                  <td>{a.module_title}</td>
                  <td>{a.lessons_done}/{a.module_lessons} · {pct}%</td>
                  <td>{a.due_date ?? "—"}</td>
                  <td>
                    <span className={`axr-status axr-status--${statusClass(a.status)}`}>
                      {statusLabel(a.status, t)}
                    </span>
                  </td>
                  <td className="axr-admin-table__actions">
                    <DeleteButton action={deleteAssignmentAction.bind(null, a.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function deleteAssignmentAction(id: string) {
  "use server";
  await deleteAssignment(id);
}

function statusLabel(s: string, t: Dictionary) {
  switch (s) {
    case "completada":
      return t.tasks.statusDone;
    case "vencida":
      return t.tasks.statusOverdue;
    case "en_curso":
      return t.progress.statusEnCurso;
    default:
      return t.tasks.statusPending;
  }
}
function statusClass(s: string) {
  return s === "completada" ? "completada" : s === "vencida" ? "no_iniciada" : "en_curso";
}
