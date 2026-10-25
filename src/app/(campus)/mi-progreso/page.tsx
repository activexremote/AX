import Link from "next/link";

import { CampusHeader } from "@/components/campus-header";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { ModulosProgreso } from "@/components/progress/modulos-progreso";
import { ProgressActionsBar } from "@/components/progress/actions-bar";
import { getAggregatedProgress } from "@/lib/data/progress";
import { getCurrentProfile, userInitials } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";
import { campusV2CCopy } from "@/lib/i18n/campus-v2-c";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import "@/app/(campus)/mi-progreso/progress.scss";

// ══════════════════════════════════════════════════════════
//  Mi progreso
//
//  Arriba, lo que sirve para seguir: la lección que quedó a medias y cuánto
//  falta. Debajo, el detalle: módulo a módulo, los tests y lo último que ha
//  pasado. Al final, la cuenta y los datos (descargarlos o empezar de cero).
// ══════════════════════════════════════════════════════════

export default async function MyProgressPage() {
  const [profile, data, { t, locale }] = await Promise.all([getCurrentProfile(), getAggregatedProgress(), getI18n()]);
  const copy = campusV2CCopy[locale];
  const completedPct = data.totalLessons ? Math.round((data.completed / data.totalLessons) * 100) : 0;
  const startedModules = data.perModule.filter((m) => m.started).length;
  const fechaHora = (iso: string) => new Date(iso).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <CampusHeader active="progress" />

      <div className="axr-c-wrap axr-mp">
        <header className="axr-c-head">
          <div>
            <h1>{t.progress.title}</h1>
            <p>{t.progress.subtitle}</p>
          </div>
        </header>

        {/* ── Seguir ── */}
        <section className="axr-mp__hero">
          <div className="axr-mp__continue">
            {data.continuar ? (
              <>
                <span className="axr-mp__eyebrow">{copy.pContinueTitle}</span>
                <strong>{data.continuar.lesson_title}</strong>
                <span className="axr-mp__module">{data.continuar.module_title}</span>
                <Link href={`/lecciones/${data.continuar.lesson_id}`} className="axr-btn">
                  {copy.pContinueCta} <Icono n="flecha" size={14} />
                </Link>
              </>
            ) : (
              <>
                {data.completed ? <span className="axr-mp__eyebrow">{copy.pContinueTitle}</span> : null}
                <strong>{data.completed ? `${completedPct}%` : copy.pStartTitle}</strong>
                <span className="axr-mp__module">{copy.pStartBody}</span>
                <Link href="/" className="axr-btn">
                  {copy.pStartCta} <Icono n="flecha" size={14} />
                </Link>
              </>
            )}
          </div>
          <div className="axr-mp__ring" style={{ ["--pct" as string]: completedPct }} aria-label={`${completedPct}%`}>
            <div>
              <strong>{completedPct}%</strong>
              <span>
                {data.completed}/{data.totalLessons} · {t.progress.kpiLessons.toLowerCase()}
              </span>
            </div>
          </div>
        </section>

        {/* ── Cifras ── */}
        <div className="axr-c-stats">
          <div className="axr-c-stat">
            <span className="axr-c-stat__label">
              <Icono n="ok" /> {t.progress.kpiLessons}
            </span>
            <span className="axr-c-stat__value">{data.completed}</span>
            <span className="axr-c-stat__hint">{fmt(t.progress.kpiLessonsHint, { total: data.totalLessons })}</span>
          </div>
          <div className="axr-c-stat">
            <span className="axr-c-stat__label">
              <Icono n="libro" /> {t.progress.kpiGlobal}
            </span>
            <span className="axr-c-stat__value">{completedPct}%</span>
            <span className="axr-c-stat__hint">{fmt(t.progress.kpiGlobalHint, { n: startedModules })}</span>
          </div>
          <div className="axr-c-stat">
            <span className="axr-c-stat__label">
              <Icono n="reloj" /> {t.progress.kpiTime}
            </span>
            <span className="axr-c-stat__value">{formatDuration(data.timeSpentS)}</span>
            <span className="axr-c-stat__hint">{t.progress.kpiTimeHint}</span>
          </div>
          <div className="axr-c-stat">
            <span className="axr-c-stat__label">
              <Icono n="revisar" /> {t.progress.kpiQuiz}
            </span>
            <span className="axr-c-stat__value">{data.avgQuizScore == null ? "—" : `${Math.round(data.avgQuizScore)}%`}</span>
            <span className="axr-c-stat__hint">{data.avgQuizScore == null ? t.progress.kpiQuizNoData : t.progress.kpiQuizHint}</span>
          </div>
        </div>

        <div className="axr-mp__grid">
          {/* ── Módulo a módulo ── */}
          <section className="axr-c-card">
            <h2 className="axr-c-card__title">{t.progress.perModule}</h2>
            <ModulosProgreso
              modulos={data.perModule}
              textos={{
                lessons: t.progress.moduleLessons,
                notStarted: copy.pModuleNotStarted,
                done: copy.pModuleDone,
                showAll: copy.pModulesShow,
                showStarted: copy.pModulesHide,
              }}
            />
          </section>

          <div className="axr-mp__side">
            {/* ── Tests ── */}
            <section className="axr-c-card">
              <h2 className="axr-c-card__title">{copy.pQuizTitle}</h2>
              {data.quizzes.length ? (
                <ul className="axr-mp__tests">
                  {data.quizzes.map((q) => (
                    <li key={q.lesson_id}>
                      <Link href={`/lecciones/${q.lesson_id}`}>
                        <span className="axr-mp__test-title">{q.lesson_title}</span>
                        <small>{q.attempts === 1 ? copy.pAttempt1 : copy.pAttempts.replace("{n}", String(q.attempts))}</small>
                      </Link>
                      <span className="axr-mp__score">{copy.pScore.replace("{n}", String(Math.round(q.best)))}</span>
                      <span className={`axr-c-pill ${q.passed ? "axr-c-pill--ok" : "axr-c-pill--bad"}`}>{q.passed ? copy.pPassed : copy.pFailed}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="axr-mp__muted">{copy.pQuizEmpty}</p>
              )}
            </section>

            {/* ── Lo último ── */}
            <section className="axr-c-card">
              <h2 className="axr-c-card__title">{t.progress.activityTitle}</h2>
              {data.activity.length ? (
                <ol className="axr-mp__timeline">
                  {data.activity.map((a) => (
                    <li key={a.id} data-kind={a.kind}>
                      <span className="axr-mp__dot" aria-hidden />
                      <span className="axr-mp__what">
                        <strong>{kindLabel(a.kind, t)}</strong>
                        {a.lesson_title || a.score !== null ? (
                          <span>
                            {a.lesson_title ? a.lesson_id ? <Link href={`/lecciones/${a.lesson_id}`}>{a.lesson_title}</Link> : a.lesson_title : null}
                            {a.score !== null ? ` · ${copy.pScore.replace("{n}", String(Math.round(a.score)))}` : null}
                          </span>
                        ) : null}
                      </span>
                      <time dateTime={a.created_at}>{fechaHora(a.created_at)}</time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="axr-mp__muted">{t.progress.activityEmpty}</p>
              )}
            </section>
          </div>
        </div>

        {/* ── Lección a lección ── */}
        <section className="axr-c-card axr-c-card--flush axr-mp__detail">
          <h2 className="axr-c-card__title">{t.progress.detailTitle}</h2>
          {data.details.length ? (
            <div className="axr-mp__table-wrap">
              <table className="axr-mp__table">
                <thead>
                  <tr>
                    <th>{t.progress.colLesson}</th>
                    <th>{t.progress.colStatus}</th>
                    <th>{t.progress.colTime}</th>
                    <th>{t.progress.colQuiz}</th>
                    <th>{t.progress.colLastVisit}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.details.map((d) => (
                    <tr key={d.lesson_id}>
                      <td>
                        <Link href={`/lecciones/${d.lesson_id}`} className="axr-mp__lesson">
                          <strong>{d.lesson_title}</strong>
                          <small>{d.module_title}</small>
                        </Link>
                      </td>
                      <td>
                        <span className={`axr-c-pill ${d.status === "completada" ? "axr-c-pill--ok" : d.status === "en_curso" ? "axr-c-pill--info" : ""}`}>{statusLabel(d.status, t)}</span>
                      </td>
                      <td>{formatDuration(d.time_spent_s)}</td>
                      <td>{d.quiz_score == null ? "—" : copy.pScore.replace("{n}", String(Math.round(d.quiz_score)))}</td>
                      <td>{d.last_visit ? fechaHora(d.last_visit) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="axr-mp__muted axr-mp__pad">{t.progress.detailEmpty}</p>
          )}
        </section>

        {/* ── La cuenta y los datos ── */}
        <div className="axr-mp__grid axr-mp__grid--even">
          <section className="axr-c-card">
            <h2 className="axr-c-card__title">{copy.pAccount}</h2>
            <div className="axr-mp__me">
              <span className="axr-mp__avatar">{userInitials(profile)}</span>
              <span>
                <strong>{profile?.full_name ?? "—"}</strong>
                <small>{profile?.email}</small>
              </span>
              <form action="/auth/sign-out" method="post">
                <button type="submit" className="axr-btn axr-btn--ghost axr-btn--small">
                  <Icono n="salir" size={14} /> {t.progress.logout}
                </button>
              </form>
            </div>
          </section>
          <section className="axr-c-card">
            <h2 className="axr-c-card__title">{copy.pData}</h2>
            <p className="axr-mp__muted">{copy.pDataBody}</p>
            <ProgressActionsBar />
          </section>
        </div>
      </div>
    </>
  );
}

function statusLabel(s: string, t: Dictionary) {
  if (s === "completada") return t.progress.statusCompletada;
  if (s === "en_curso") return t.progress.statusEnCurso;
  return t.progress.statusNoIniciada;
}

function kindLabel(k: string, t: Dictionary) {
  switch (k) {
    case "lesson_start":
      return t.progress.kindLessonStart;
    case "lesson_complete":
      return t.progress.kindLessonComplete;
    case "quiz_pass":
      return t.progress.kindQuizPass;
    case "quiz_fail":
      return t.progress.kindQuizFail;
    default:
      return k;
  }
}

function formatDuration(seconds: number) {
  if (!seconds || seconds < 60) return `${Math.max(seconds, 0)}s`;
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}
