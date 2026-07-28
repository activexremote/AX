import Link from "next/link";

import { CampusHeader } from "@/components/campus-header";
import { getMyAssignments } from "@/lib/data/assignments";
import { getI18n } from "@/lib/i18n/server";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import "@/app/(campus)/mis-tareas/tareas.scss";

export default async function MisTareasPage() {
  const [assignments, { t }] = await Promise.all([getMyAssignments(), getI18n()]);
  const pendientes = assignments.filter((a) => a.status !== "completada");
  const hechas = assignments.filter((a) => a.status === "completada");

  return (
    <>
      <CampusHeader active="tasks" />
      <div className="axr-content">
        <header className="axr-tareas-head">
          <h1>{t.tasks.title}</h1>
          <p>{t.tasks.subtitle}</p>
        </header>

        {assignments.length === 0 ? (
          <div className="axr-tareas-empty">
            <span aria-hidden>🗂️</span>
            <p>{t.tasks.empty}</p>
            <Link href="/" className="axr-btn axr-btn--ghost">{t.tasks.goToCatalog}</Link>
          </div>
        ) : null}

        {pendientes.length > 0 ? (
          <section>
            <h2 className="axr-tareas-section">{t.tasks.sectionPending}</h2>
            <div className="axr-tareas-grid">
              {pendientes.map((a) => (
                <TaskCard key={a.id} a={a} t={t} />
              ))}
            </div>
          </section>
        ) : null}

        {hechas.length > 0 ? (
          <section>
            <h2 className="axr-tareas-section">{t.tasks.sectionDone}</h2>
            <div className="axr-tareas-grid">
              {hechas.map((a) => (
                <TaskCard key={a.id} a={a} t={t} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

function TaskCard({
  a,
  t,
}: {
  t: Dictionary;
  a: {
    id: string;
    module_title: string;
    module_slug: string;
    module_lessons: number;
    lessons_done: number;
    due_date: string | null;
    status: string;
    note: string | null;
  };
}) {
  const pct = a.module_lessons ? Math.round((a.lessons_done / a.module_lessons) * 100) : 0;
  const overdue = a.status === "vencida";
  const done = a.status === "completada";
  const label = done ? t.tasks.statusDone : overdue ? t.tasks.statusOverdue : t.tasks.statusPending;

  return (
    <Link href={`/modulos/${a.module_slug}`} className="axr-task-card" data-status={a.status}>
      <div className="axr-task-card__top">
        <span className={`axr-status axr-status--${done ? "completada" : overdue ? "no_iniciada" : "en_curso"}`}>
          {label}
        </span>
        {a.due_date ? (
          <span className="axr-task-card__due">📅 {a.due_date}</span>
        ) : (
          <span className="axr-task-card__due">{t.tasks.noDueDate}</span>
        )}
      </div>
      <div className="axr-task-card__title">{a.module_title}</div>
      {a.note ? <p className="axr-task-card__note">{a.note}</p> : null}
      <div className="axr-progress" aria-hidden>
        <span className="axr-progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="axr-task-card__meta">
        {fmt(t.tasks.lessonsProgress, { done: a.lessons_done, total: a.module_lessons, pct })}
      </div>
    </Link>
  );
}
