import { CampusHeader } from "@/components/campus-header";
import { ModuleIcon } from "@/components/module-icon";
import { ProgressActionsBar } from "@/components/progress/actions-bar";
import { getAggregatedProgress } from "@/lib/data/progress";
import { getCurrentProfile, userInitials } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";
import { fmt, type Dictionary } from "@/lib/i18n/dictionaries";
import "@/app/(campus)/mi-progreso/progress.scss";

export default async function MyProgressPage() {
  const profile = await getCurrentProfile();
  const [data, { t }] = await Promise.all([getAggregatedProgress(), getI18n()]);
  const completedPct = data.totalLessons
    ? Math.round((data.completed / data.totalLessons) * 100)
    : 0;
  const startedModules = data.perModule.filter((m) => m.completed > 0).length;

  return (
    <>
      <CampusHeader active="progress" />

      <div className="axr-content axr-progress-page">
        <header className="axr-progress-header">
          <div className="axr-progress-header__user">
            <span className="axr-progress-header__avatar">{userInitials(profile)}</span>
            <div>
              <div className="axr-progress-header__name">{profile?.full_name ?? "—"}</div>
              <div className="axr-progress-header__email">{profile?.email}</div>
            </div>
          </div>
          <form action="/auth/sign-out" method="post">
            <button type="submit" className="axr-btn axr-btn--ghost">{t.progress.logout}</button>
          </form>
        </header>

        <div className="axr-progress-title">
          <div>
            <h1>{t.progress.title}</h1>
            <p>{t.progress.subtitle}</p>
          </div>
          <ProgressActionsBar />
        </div>

        <div className="axr-progress-kpis">
          <div className="axr-kpi">
            <div className="axr-kpi__label">{t.progress.kpiLessons}</div>
            <div className="axr-kpi__value">{data.completed}</div>
            <div className="axr-kpi__hint">{fmt(t.progress.kpiLessonsHint, { total: data.totalLessons })}</div>
          </div>
          <div className="axr-kpi">
            <div className="axr-kpi__label">{t.progress.kpiGlobal}</div>
            <div className="axr-kpi__value">{completedPct}%</div>
            <div className="axr-kpi__hint">{fmt(t.progress.kpiGlobalHint, { n: startedModules })}</div>
          </div>
          <div className="axr-kpi">
            <div className="axr-kpi__label">{t.progress.kpiTime}</div>
            <div className="axr-kpi__value">{formatDuration(data.timeSpentS)}</div>
            <div className="axr-kpi__hint">{t.progress.kpiTimeHint}</div>
          </div>
          <div className="axr-kpi">
            <div className="axr-kpi__label">{t.progress.kpiQuiz}</div>
            <div className="axr-kpi__value">
              {data.avgQuizScore == null ? "—" : `${Math.round(data.avgQuizScore)}%`}
            </div>
            <div className="axr-kpi__hint">
              {data.avgQuizScore == null ? t.progress.kpiQuizNoData : t.progress.kpiQuizHint}
            </div>
          </div>
        </div>

        <section className="axr-progress-card">
          <h3>{t.progress.perModule}</h3>
          <div className="axr-progress-modules">
            {data.perModule.map((m) => {
              const pct = m.lessons ? Math.round((m.completed / m.lessons) * 100) : 0;
              return (
                <div key={m.id} className="axr-progress-module">
                  <div className="axr-progress-module__icon">
                    <ModuleIcon name={m.icon} size={20} />
                  </div>
                  <div className="axr-progress-module__body">
                    <div className="axr-progress-module__title">{m.title}</div>
                    <div className="axr-progress-module__lessons">{m.lessons} {t.progress.moduleLessons}</div>
                    <div className="axr-progress">
                      <span className="axr-progress__bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="axr-progress-module__pct">
                    <strong>{pct}%</strong>
                    <span>{m.completed}/{m.lessons}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="axr-progress-card">
          <h3>{t.progress.detailTitle}</h3>
          <div className="axr-progress-table-wrap">
            <table className="axr-table">
              <thead>
                <tr>
                  <th>{t.progress.colModule}</th>
                  <th>{t.progress.colLesson}</th>
                  <th>{t.progress.colStatus}</th>
                  <th>{t.progress.colTime}</th>
                  <th>{t.progress.colAudio}</th>
                  <th>{t.progress.colQuiz}</th>
                  <th>{t.progress.colLastVisit}</th>
                </tr>
              </thead>
              <tbody>
                {data.details.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="axr-table__empty">{t.progress.detailEmpty}</td>
                  </tr>
                ) : null}
                {data.details.map((d, i) => (
                  <tr key={i}>
                    <td>✦ {d.module_title}</td>
                    <td>{d.lesson_title}</td>
                    <td>
                      <span className={`axr-status axr-status--${d.status}`}>
                        {statusLabel(d.status, t)}
                      </span>
                    </td>
                    <td>{formatDuration(d.time_spent_s)}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>{d.last_visit ? new Date(d.last_visit).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="axr-progress-card">
          <h3>{t.progress.activityTitle}</h3>
          {data.activity.length === 0 ? (
            <div className="axr-progress-empty">
              <div className="axr-progress-empty__circle">⏱</div>
              <p>{t.progress.activityEmpty}</p>
            </div>
          ) : (
            <ul className="axr-activity">
              {data.activity.map((a) => (
                <li key={a.id}>
                  <span className="axr-activity__dot" data-kind={a.kind} />
                  <span className="axr-activity__kind">{kindLabel(a.kind, t)}</span>
                  <span className="axr-activity__time">
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
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
