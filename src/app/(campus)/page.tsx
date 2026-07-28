import Link from "next/link";

import { ModuleIcon } from "@/components/module-icon";
import { getLearningPath, listModulesWithCounts } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { getCurrentProfile } from "@/lib/data/profile";
import { CampusHeader } from "@/components/campus-header";
import { getI18n } from "@/lib/i18n/server";
import "@/app/(campus)/home.scss";

export default async function CampusHome() {
  // Invitados: el layout del campus renderiza la landing pública; aquí salimos
  // antes de tocar datos que requieren sesión.
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [modules, path, progress, { t }] = await Promise.all([
    listModulesWithCounts(),
    getLearningPath(),
    getProgressForCurrentUser(),
    getI18n(),
  ]);

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons_count ?? 0), 0);
  const completedLessons = progress.filter((p) => p.status === "completada").length;
  const completedPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <>
      <CampusHeader active="home" />
      <section className="axr-hero">
        <div className="axr-hero__inner">
          <span className="axr-section-tag">{t.home.heroTag}</span>
          <h1>{t.home.heroTitle}</h1>
          <p>{t.home.heroLead}</p>
          <div className="axr-hero__stats">
            <div>
              <strong>{modules.length}</strong>
              <span>{t.home.statModules}</span>
            </div>
            <div>
              <strong>{totalLessons}+</strong>
              <span>{t.home.statLessons}</span>
            </div>
            <div>
              <strong>{completedPct}%</strong>
              <span>{t.home.statCompleted}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="axr-content">
        <div className="axr-path">
          <span className="axr-path__label">{t.home.pathLabel}</span>
          <ol className="axr-path__steps">
            {path.map((step, i) => (
              <li key={step.id} className="axr-path__step">
                <span className="axr-path__bullet" data-state={i === 0 ? "current" : "pending"}>
                  {i === 0 ? "✓" : i + 1}
                </span>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="axr-callout">
          <ModuleIcon name="DocumentAudio" size={20} />
          <div>
            <strong>{t.home.calloutTitle}</strong>
            <p>{t.home.calloutDesc}</p>
          </div>
        </div>

        <section className="axr-modules">
          <header className="axr-modules__header">
            <h2>{t.home.modulesTitle}</h2>
            <p>{t.home.modulesSubtitle}</p>
          </header>

          <div className="axr-modules__grid">
            {modules.map((m) => (
              <Link
                key={m.id}
                href={`/modulos/${m.slug}`}
                className="axr-module-card"
                aria-label={m.title}
              >
                <div className="axr-module-card__icon">
                  <ModuleIcon name={m.icon} size={28} />
                </div>
                <div className="axr-module-card__code">{m.code}</div>
                <div className="axr-module-card__title">{m.title}</div>
                <p className="axr-module-card__desc">{m.description}</p>
                <div className="axr-module-card__meta">
                  <span>{m.lessons_count} {t.home.lessons}</span>
                  <span>~{m.estimated_minutes ?? 0} min</span>
                  <span className="axr-module-card__badge" data-available={m.available}>
                    {m.available ? `✓ ${t.home.available}` : t.home.soon}
                  </span>
                </div>
                <div className="axr-progress" aria-hidden>
                  <span className="axr-progress__bar" style={{ width: "0%" }} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
