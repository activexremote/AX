import { CampusHeader } from "@/components/campus-header";
import { ListaMisTareas, type MiTarea } from "@/components/campus/mis-tareas-lista";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getMyAssignments } from "@/lib/data/assignments";
import { getI18n } from "@/lib/i18n/server";
import { campusV2CCopy } from "@/lib/i18n/campus-v2-c";
import "@/app/(campus)/mis-tareas/tareas.scss";

// ══════════════════════════════════════════════════════════
//  Mis tareas
//
//  Lo urgente arriba: lo vencido, lo que vence en tres días, lo empezado y lo
//  pendiente; lo terminado, al final. El estado que se enseña es el de
//  verdad, no sólo el guardado: una tarea con la fecha pasada sale vencida
//  aunque el aviso nocturno aún no la haya marcado, y una con todas sus
//  lecciones hechas sale completada. Es el mismo criterio que el panel
//  (admin/tareas).
// ══════════════════════════════════════════════════════════

/** Hoy en Madrid, como AAAA-MM-DD: es la fecha con la que se mira el plazo. */
const hoyMadrid = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const DIA = 86_400_000;
const diasEntre = (desde: string, hasta: string) => Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / DIA);

const ORDEN: Record<MiTarea["estado"], number> = { vencida: 0, pronto: 1, en_curso: 2, pendiente: 3, completada: 4 };

export default async function MisTareasPage() {
  const [assignments, { t, locale }] = await Promise.all([getMyAssignments(), getI18n()]);
  const copy = campusV2CCopy[locale];
  const hoy = hoyMadrid();

  const tareas: MiTarea[] = assignments
    .map((a) => {
      const dias = a.due_date ? diasEntre(hoy, a.due_date) : null;
      const terminada = a.status === "completada" || (a.module_lessons > 0 && a.lessons_done >= a.module_lessons);
      const estado: MiTarea["estado"] = terminada
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
        module_title: a.module_title,
        module_slug: a.module_slug,
        total: a.module_lessons,
        done: Math.min(a.lessons_done, a.module_lessons),
        due_date: a.due_date,
        completed_at: a.completed_at,
        dias,
        note: a.note,
        estado,
      };
    })
    .sort((x, y) => ORDEN[x.estado] - ORDEN[y.estado] || (x.dias ?? 9999) - (y.dias ?? 9999));

  const n = (e: MiTarea["estado"][]) => tareas.filter((x) => e.includes(x.estado)).length;

  return (
    <>
      <CampusHeader active="tasks" />
      <div className="axr-c-wrap axr-mt">
        <header className="axr-c-head">
          <div>
            <h1>{t.tasks.title}</h1>
            <p>{t.tasks.subtitle}</p>
          </div>
        </header>

        {tareas.length ? (
          <div className="axr-c-stats">
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="tareas" /> {copy.tOpen}
              </span>
              <span className="axr-c-stat__value">{n(["pendiente", "en_curso", "pronto", "vencida"])}</span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="reloj" /> {copy.tSoon}
              </span>
              <span className="axr-c-stat__value" style={n(["pronto"]) ? { color: "var(--cmp-warn)" } : undefined}>
                {n(["pronto"])}
              </span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="aviso" /> {copy.tOverdue}
              </span>
              <span className="axr-c-stat__value" style={n(["vencida"]) ? { color: "var(--cmp-bad)" } : undefined}>
                {n(["vencida"])}
              </span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="ok" /> {copy.tDone}
              </span>
              <span className="axr-c-stat__value">{n(["completada"])}</span>
            </div>
          </div>
        ) : null}

        <ListaMisTareas tareas={tareas} copy={copy} locale={locale} />
      </div>
    </>
  );
}
