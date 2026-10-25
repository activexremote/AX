import Link from "next/link";
import { notFound } from "next/navigation";

import { CampusHeader } from "@/components/campus-header";
import { ModuleIcon } from "@/components/module-icon";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getModuleBySlug } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { campusACopy } from "@/lib/i18n/campus-v2-a";
import { fmt } from "@/lib/i18n/dictionaries";
import { getI18n } from "@/lib/i18n/server";
import "@/app/(campus)/modulos/module.scss";

// ══════════════════════════════════════════════════════════
//  Un módulo (v2)
//
//  Arriba, qué es y cuánto llevas, con UN botón que hace lo que toca: empezar
//  si no has hecho nada, seguir por la primera lección sin acabar, o repasar
//  si ya está todo. Debajo, las lecciones con su estado, su duración y lo
//  que traen (audio, test).
// ══════════════════════════════════════════════════════════

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getModuleBySlug(slug);
  if (!data) notFound();
  const { module, lessons } = data;
  const [progress, { locale }] = await Promise.all([getProgressForCurrentUser(), getI18n()]);
  const c = campusACopy[locale];

  const estadoDe = new Map(progress.map((p) => [p.lesson_id, p.status]));
  const completed = lessons.filter((l) => estadoDe.get(l.id) === "completada").length;
  const totalMinutes = module.estimated_minutes ?? lessons.reduce((acc, l) => acc + (l.duration_min ?? 0), 0);
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

  // El botón de arriba: la primera lección sin acabar, en orden.
  const pendienteIdx = lessons.findIndex((l) => estadoDe.get(l.id) !== "completada");
  const empezado = lessons.some((l) => estadoDe.has(l.id));
  const todoHecho = lessons.length > 0 && pendienteIdx === -1;
  const destino = todoHecho ? lessons[0] : lessons[pendienteIdx];

  return (
    <>
      <CampusHeader />

      <div className="axr-c-wrap axr-mod">
        <nav className="axr-c-head__crumbs" aria-label="breadcrumb">
          <Link href="/">{c.crumbHome}</Link>
          <span aria-hidden>/</span>
          <span>{c.course[module.course] ?? module.course}</span>
          {module.code ? (
            <>
              <span aria-hidden>/</span>
              <span>{module.code}</span>
            </>
          ) : null}
        </nav>

        <section className="axr-mod__hero">
          <span className="axr-mod__icon" aria-hidden>
            <ModuleIcon name={module.icon} size={34} />
          </span>
          <div className="axr-mod__info">
            <div className="axr-mod__pills">
              <span className="axr-c-pill axr-c-pill--accent">{c.course[module.course] ?? module.course}</span>
              {module.code ? <span className="axr-c-pill">{module.code}</span> : null}
              {todoHecho ? (
                <span className="axr-c-pill axr-c-pill--ok">
                  <Icono n="ok" size={12} /> {c.moduleDone}
                </span>
              ) : !module.available ? (
                <span className="axr-c-pill">{c.stateSoon}</span>
              ) : null}
            </div>
            <h1>{module.title}</h1>
            {module.description ? <p>{module.description}</p> : null}

            <ul className="axr-mod__facts">
              <li>
                <Icono n="lista" /> {fmt(c.lessonsShort, { n: lessons.length })}
              </li>
              <li>
                <Icono n="reloj" /> {fmt(c.minutesShort, { n: totalMinutes })}
              </li>
              <li>
                <Icono n="ok" /> {fmt(c.lessonsDone, { a: completed, b: lessons.length })}
              </li>
            </ul>

            <div className="axr-mod__progress">
              <span className={`axr-c-progress${todoHecho ? " axr-c-progress--ok" : ""}`} aria-hidden>
                <span style={{ width: `${pct}%` }} />
              </span>
              <strong>{pct}%</strong>
            </div>

            {destino ? (
              <Link href={`/lecciones/${destino.id}`} className={`axr-btn${todoHecho ? " axr-btn--ghost" : ""} axr-mod__cta`}>
                {todoHecho ? c.moduleReview : empezado ? fmt(c.moduleContinue, { n: destino.title }) : c.moduleStart}
                <Icono n="flecha" />
              </Link>
            ) : null}
          </div>
        </section>

        <section className="axr-c-card axr-c-card--flush axr-mod__lessons">
          <header className="axr-mod__lessons-head">
            <h2 className="axr-c-card__title">{c.moduleLessons}</h2>
            <p>{c.moduleLessonsLead}</p>
          </header>

          {lessons.length === 0 ? (
            <div className="axr-c-empty">
              <Icono n="libro" size={26} />
              <span>{c.emptyModule}</span>
            </div>
          ) : (
            <ol className="axr-mod__list">
              {lessons.map((l, i) => {
                const st = estadoDe.get(l.id);
                const hecha = st === "completada";
                const siguiente = !todoHecho && i === pendienteIdx;
                return (
                  <li key={l.id}>
                    <Link href={`/lecciones/${l.id}`} className={`axr-mod__item${siguiente ? " is-next" : ""}${hecha ? " is-done" : ""}`}>
                      <span className="axr-mod__n" aria-hidden>
                        {hecha ? <Icono n="ok" size={16} /> : i + 1}
                      </span>
                      <span className="axr-mod__body">
                        <strong>{l.title}</strong>
                        {l.subtitle ? <span>{l.subtitle}</span> : null}
                      </span>
                      <span className="axr-mod__tags">
                        {l.duration_min ? (
                          <span className="axr-mod__time">
                            <Icono n="reloj" size={13} /> {fmt(c.minutesShort, { n: l.duration_min })}
                          </span>
                        ) : null}
                        {l.audio_url ? <span className="axr-c-pill axr-c-pill--info">{c.lessonAudio}</span> : null}
                        {l.has_quiz ? <span className="axr-c-pill axr-c-pill--accent">{c.lessonQuiz}</span> : null}
                        {hecha ? (
                          <span className="axr-c-pill axr-c-pill--ok">{c.lessonDone}</span>
                        ) : st === "en_curso" ? (
                          <span className="axr-c-pill axr-c-pill--warn">{c.lessonDoing}</span>
                        ) : siguiente ? (
                          <span className="axr-c-pill axr-c-pill--accent">{c.lessonNext}</span>
                        ) : (
                          <span className="axr-c-pill">{c.lessonTodo}</span>
                        )}
                      </span>
                      <Icono n="flecha" size={16} className="axr-mod__go" />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
