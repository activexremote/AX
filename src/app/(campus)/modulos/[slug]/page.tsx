import Link from "next/link";
import { notFound } from "next/navigation";

import { CampusHeader } from "@/components/campus-header";
import { ModuleIcon } from "@/components/module-icon";
import { getModuleBySlug } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { getI18n } from "@/lib/i18n/server";
import "@/app/(campus)/modulos/module.scss";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getModuleBySlug(slug);
  if (!data) notFound();
  const { module, lessons } = data;
  const [progress, { t }] = await Promise.all([getProgressForCurrentUser(), getI18n()]);
  const completedIds = new Set(progress.filter((p) => p.status === "completada").map((p) => p.lesson_id));
  const completed = lessons.filter((l) => completedIds.has(l.id)).length;
  const totalMinutes =
    module.estimated_minutes ?? lessons.reduce((acc, l) => acc + (l.duration_min ?? 0), 0);
  const firstLesson = lessons[0];

  return (
    <>
      <CampusHeader />

      <div className="axr-mod-breadcrumb">
        <Link href="/">{t.module.breadcrumb}</Link>
        <span aria-hidden>·</span>
        <span>{module.title}</span>
      </div>

      <section className="axr-mod-hero">
        <div className="axr-mod-hero__icon" aria-hidden>
          <ModuleIcon name={module.icon} size={40} />
        </div>
        <span className="axr-section-tag">{module.code}</span>
        <h1>{module.title}</h1>
        <p>{module.description}</p>
        <div className="axr-mod-hero__meta">
          <span><strong>{lessons.length}</strong> {t.module.statLessons}</span>
          <span>~<strong>{totalMinutes}</strong> {t.module.statMin}</span>
          <span><strong>{completed}/{lessons.length}</strong> {t.module.statCompleted}</span>
        </div>
        {firstLesson ? (
          <Link href={`/lecciones/${firstLesson.id}`} className="axr-mod-hero__cta">
            {t.module.cta}
          </Link>
        ) : null}
      </section>

      <div className="axr-content">
        <ol className="axr-lesson-list">
          {lessons.map((l, i) => {
            const done = completedIds.has(l.id);
            return (
              <li key={l.id}>
                <Link href={`/lecciones/${l.id}`} className="axr-lesson-list__item">
                  <span className="axr-lesson-list__index" data-done={done}>
                    {done ? "✓" : i + 1}
                  </span>
                  <div className="axr-lesson-list__body">
                    <div className="axr-lesson-list__title">{l.title}</div>
                    {l.subtitle ? <div className="axr-lesson-list__subtitle">{l.subtitle}</div> : null}
                  </div>
                  {l.audio_url ? (
                    <span className="axr-lesson-list__badge">🔊 {t.module.audioReady}</span>
                  ) : (
                    <span className="axr-lesson-list__badge" data-pending>
                      {t.module.audioSoon}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
