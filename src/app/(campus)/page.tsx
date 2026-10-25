import type { Metadata } from "next";
import Link from "next/link";

import { ModuleIcon } from "@/components/module-icon";
import { getLearningPath, listModulesWithCounts } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { firstName, getCurrentProfile } from "@/lib/data/profile";
import { CampusHeader } from "@/components/campus-header";
import { FlashPanel } from "@/components/campus/flash-panel";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { campusACopy } from "@/lib/i18n/campus-v2-a";
import { fmt } from "@/lib/i18n/dictionaries";
import { getI18n } from "@/lib/i18n/server";
import { FLASH_COURSES } from "@/lib/relampago/catalog";
import { SITE_URL } from "@/lib/seo";
import type { CourseKey, UserLessonProgress } from "@/lib/supabase/types";
import "@/app/(campus)/home.scss";

// A quien no tiene sesión, "/" le sirve exactamente la misma landing que
// /bienvenida (ver (campus)/layout.tsx). Sin canónica eran dos URL con el
// mismo contenido compitiendo entre sí; ésta declara cuál es la buena.
export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/bienvenida` },
};

// ══════════════════════════════════════════════════════════
//  La portada del campus (v2)
//
//  Lo que un alumno viene a hacer, en este orden: seguir donde lo dejó (una
//  sola lección, con un botón), ver cuánto lleva, y elegir otro módulo. Los
//  cursos relámpago van aparte, con su progreso y sus desbloqueos.
//
//  Todo sale de lo que la base de datos le deja ver (has_course_access): un
//  alumno sólo recibe los módulos de sus matrículas y el equipo, todos. No
//  hay filtro de acceso aquí; si lo hubiera, sobraría.
// ══════════════════════════════════════════════════════════

/** Los caminos del programa, en el orden en que se enseñan. Los relámpago van en su panel. */
const CAMINOS: CourseKey[] = ["core", "remote-professional", "remote-founder"];
const RELAMPAGO = new Set<string>(FLASH_COURSES.map((c) => c.key));

type ModuloHome = Awaited<ReturnType<typeof listModulesWithCounts>>[number];

/**
 * A qué lección llevar al alumno.
 *
 * Si ha visitado alguna, se sigue desde la última: esa misma si no la acabó,
 * o la siguiente sin hacer de su módulo. Si ese módulo ya está hecho, o no
 * ha empezado nada, la primera lección sin hacer de los módulos disponibles,
 * en el orden del programa.
 */
function siguienteLeccion(modulos: ModuloHome[], progreso: UserLessonProgress[]) {
  const hechas = new Set(progreso.filter((p) => p.status === "completada").map((p) => p.lesson_id));
  const conLecciones = modulos.filter((m) => m.ordered_lessons.length);
  const primeraSinHacer = (m: ModuloHome) => m.ordered_lessons.findIndex((l) => !hechas.has(l.id));

  const ultima = [...progreso].filter((p) => p.last_visit).sort((a, b) => (b.last_visit ?? "").localeCompare(a.last_visit ?? ""))[0];
  if (ultima) {
    const m = conLecciones.find((x) => x.ordered_lessons.some((l) => l.id === ultima.lesson_id));
    if (m) {
      const i = m.ordered_lessons.findIndex((l) => l.id === ultima.lesson_id);
      const j = !hechas.has(ultima.lesson_id) ? i : m.ordered_lessons.findIndex((l, k) => k > i && !hechas.has(l.id));
      const k = j >= 0 ? j : primeraSinHacer(m);
      if (k >= 0) return { modulo: m, indice: k, empezado: true };
    }
  }

  const disponibles = conLecciones.filter((m) => m.available);
  for (const m of disponibles.length ? disponibles : conLecciones) {
    const k = primeraSinHacer(m);
    if (k >= 0) return { modulo: m, indice: k, empezado: m.ordered_lessons.some((l) => hechas.has(l.id)) };
  }
  return null;
}

export default async function CampusHome() {
  // Invitados: el layout del campus renderiza la landing pública; aquí salimos
  // antes de tocar datos que requieren sesión.
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [modules, path, progress, { t, locale }] = await Promise.all([
    listModulesWithCounts(),
    getLearningPath(),
    getProgressForCurrentUser(),
    getI18n(),
  ]);
  const c = campusACopy[locale];

  const hechas = new Set(progress.filter((p) => p.status === "completada").map((p) => p.lesson_id));
  const enCurso = new Set(progress.filter((p) => p.status === "en_curso").map((p) => p.lesson_id));
  const programa = modules.filter((m) => !RELAMPAGO.has(m.course));

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons_count ?? 0), 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.ordered_lessons.filter((l) => hechas.has(l.id)).length, 0);
  const completedPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalMinutes = modules.reduce((acc, m) => acc + (m.estimated_minutes ?? 0), 0);

  const siguiente = siguienteLeccion(programa.length ? programa : modules, progress);
  const grupos = CAMINOS.map((curso) => ({ curso, modulos: programa.filter((m) => m.course === curso) })).filter((g) => g.modulos.length);

  /** El estado de un módulo, tal como lo ve el alumno. */
  const estado = (m: ModuloHome) => {
    const n = m.ordered_lessons.filter((l) => hechas.has(l.id)).length;
    if (m.lessons_count && n === m.lessons_count) return { n, tono: "ok", label: c.stateDone } as const;
    if (n || m.ordered_lessons.some((l) => enCurso.has(l.id))) return { n, tono: "accent", label: c.stateDoing } as const;
    if (!m.available) return { n, tono: "neutro", label: c.stateSoon } as const;
    return { n, tono: "info", label: c.stateNew } as const;
  };

  return (
    <>
      <CampusHeader active="home" />

      <div className="axr-c-wrap axr-home">
        {/* ── Saludo y progreso ── */}
        <section className="axr-home__hero">
          <div className="axr-home__hello">
            <h1>{fmt(c.hello, { n: firstName(profile) })}</h1>
            <p>{c.helloLead}</p>
            <ul className="axr-home__facts">
              <li>
                <Icono n="libro" /> <strong>{modules.length}</strong> {c.statModules.toLowerCase()}
              </li>
              <li>
                <Icono n="lista" /> <strong>{totalLessons}</strong> {c.statLessons.toLowerCase()}
              </li>
              <li>
                <Icono n="reloj" /> <strong>{Math.round(totalMinutes / 60)}</strong> {c.statMinutes.toLowerCase()}
              </li>
            </ul>
          </div>
          <div className="axr-home__ring" role="img" aria-label={`${c.overall}: ${completedPct}%`}>
            <svg viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="52" className="axr-home__ring-bg" />
              {completedPct > 0 ? (
                <circle cx="60" cy="60" r="52" className="axr-home__ring-fg" strokeDasharray={`${(completedPct / 100) * 326.7} 326.7`} />
              ) : null}
            </svg>
            <div>
              <strong>{completedPct}%</strong>
              <span>{c.overall}</span>
              <small>{fmt(c.overallOf, { a: completedLessons, b: totalLessons })}</small>
            </div>
          </div>
        </section>

        {/* Sin matrícula activa la base de datos no devuelve ni un módulo
            (política has_course_access). El layout ya enseña la pantalla de
            acceso pendiente a los alumnos; esto es la red por si llega aquí
            alguien del equipo con el contenido vacío. */}
        {modules.length === 0 ? (
          <div className="axr-c-card axr-c-empty">
            <Icono n="libro" size={28} />
            <strong>{t.home.noAccessTitle}</strong>
            <span>{t.home.noAccessBody}</span>
            <Link href="/bienvenida" className="axr-btn">
              {t.home.noAccessCta}
            </Link>
          </div>
        ) : null}

        {/* ── Seguir ── */}
        {siguiente ? (
          <Link href={`/lecciones/${siguiente.modulo.ordered_lessons[siguiente.indice].id}`} className="axr-home__next">
            <span className="axr-home__next-icon" aria-hidden>
              <ModuleIcon name={siguiente.modulo.icon} size={28} />
            </span>
            <span className="axr-home__next-body">
              <span className="axr-home__next-tag">{siguiente.empezado ? c.continueTitle : c.startTitle}</span>
              <strong>{siguiente.modulo.ordered_lessons[siguiente.indice].title}</strong>
              <span className="axr-home__next-meta">
                {siguiente.modulo.code ? `${siguiente.modulo.code} · ` : ""}
                {siguiente.modulo.title} · {fmt(c.continueLesson, { n: siguiente.indice + 1 })}
              </span>
              <span className="axr-c-progress" aria-hidden>
                <span style={{ width: `${Math.round((estado(siguiente.modulo).n / Math.max(1, siguiente.modulo.lessons_count)) * 100)}%` }} />
              </span>
              <small>{fmt(c.moduleProgress, { a: estado(siguiente.modulo).n, b: siguiente.modulo.lessons_count })}</small>
            </span>
            <span className="axr-btn axr-home__next-cta">
              {siguiente.empezado ? c.continueCta : c.startCta} <Icono n="flecha" />
            </span>
          </Link>
        ) : modules.length ? (
          <div className="axr-c-note axr-c-note--ok">
            <Icono n="ok" />
            <span>
              <strong>{c.doneTitle}.</strong> {c.doneBody}
            </span>
          </div>
        ) : null}

        {/* ── Ruta recomendada ── */}
        {path.length ? (
          <section className="axr-c-card axr-home__path">
            <div className="axr-home__path-head">
              <h2 className="axr-c-card__title">{c.pathTitle}</h2>
              <p>{c.pathLead}</p>
            </div>
            <ol>
              {path.map((step, i) => (
                <li key={step.id} data-state={step.state}>
                  <span className="axr-home__path-mark" aria-hidden>
                    {step.state === "done" ? <Icono n="ok" size={14} /> : i + 1}
                  </span>
                  <span>{step.label}</span>
                </li>
              ))}
            </ol>
            <p className="axr-home__audio">
              <Icono n="info" size={14} /> {c.audioNote}
            </p>
          </section>
        ) : null}

        {/* Los relámpago van antes que los módulos del programa: son cursos
            cerrados con su propio progreso y su propio final, y mezclarlos
            con los módulos sueltos del programa largo hace que no se
            entienda dónde empieza y acaba cada cosa. */}
        <FlashPanel copy={t.unlocks} />

        {/* ── Catálogo, por camino ── */}
        {grupos.length ? (
          <section className="axr-home__catalog">
            <header className="axr-home__catalog-head">
              <h2>{c.catalogTitle}</h2>
              <p>{c.catalogLead}</p>
            </header>

            {grupos.map((g) => (
              <section key={g.curso} className={`axr-home__group axr-home__group--${g.curso}`}>
                <header className="axr-home__group-head">
                  <span className="axr-home__group-dot" aria-hidden />
                  <h3>{c.course[g.curso] ?? g.curso}</h3>
                  <span className="axr-home__group-lead">{c.courseLead[g.curso]}</span>
                  <span className="axr-c-pill">{fmt(c.modulesCount, { n: g.modulos.length })}</span>
                </header>

                <div className="axr-home__grid">
                  {g.modulos.map((m) => {
                    const e = estado(m);
                    const pct = m.lessons_count ? Math.round((e.n / m.lessons_count) * 100) : 0;
                    return (
                      <Link key={m.id} href={`/modulos/${m.slug}`} className={`axr-mcard${m.available ? "" : " is-soon"}`} aria-label={m.title}>
                        <span className="axr-mcard__top">
                          <span className="axr-mcard__icon" aria-hidden>
                            <ModuleIcon name={m.icon} size={22} />
                          </span>
                          <span className={`axr-c-pill${e.tono === "neutro" ? "" : ` axr-c-pill--${e.tono}`}`}>{e.label}</span>
                        </span>
                        {m.code ? <span className="axr-mcard__code">{m.code}</span> : null}
                        <strong className="axr-mcard__title">{m.title}</strong>
                        {m.description ? <span className="axr-mcard__desc">{m.description}</span> : null}
                        <span className="axr-mcard__meta">
                          <span>{fmt(c.lessonsShort, { n: m.lessons_count })}</span>
                          <span>{fmt(c.minutesShort, { n: m.estimated_minutes ?? 0 })}</span>
                          <span className="axr-mcard__done">{fmt(c.lessonsDone, { a: e.n, b: m.lessons_count })}</span>
                        </span>
                        <span className={`axr-c-progress${e.tono === "ok" ? " axr-c-progress--ok" : ""}`} aria-hidden>
                          <span style={{ width: `${pct}%` }} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>
        ) : null}
      </div>
    </>
  );
}
