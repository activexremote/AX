import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CampusHeader } from "@/components/campus-header";
import { LessonAudioPlayer } from "@/components/lesson/audio-player";
import { LessonQuiz } from "@/components/lesson/quiz";
import { MarkCompleteButton } from "@/components/lesson/mark-complete-button";
import { VisitTracker } from "@/components/lesson/visit-tracker";
import { getLessonForView } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { getI18n } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/dictionaries";
import "@/app/(campus)/lecciones/lesson.scss";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLessonForView(id);
  if (!data) notFound();
  const { lesson, module, siblings, quiz, questions } = data;
  const [progress, { t }] = await Promise.all([getProgressForCurrentUser(), getI18n()]);
  const completedSet = new Set(progress.filter((p) => p.status === "completada").map((p) => p.lesson_id));
  const moduleHref = `/modulos/${module.slug}`;
  const totalModuleLessons = siblings.length;
  const completedHere = siblings.filter((s) => completedSet.has(s.id)).length;
  const completionPct = totalModuleLessons
    ? Math.round((completedHere / totalModuleLessons) * 100)
    : 0;
  const alreadyDone = completedSet.has(lesson.id);

  return (
    <>
      <CampusHeader />
      <VisitTracker lessonId={lesson.id} />

      <div className="axr-lesson-bar">
        <div className="axr-lesson-bar__inner">
          <Link href="/">{t.lesson.breadcrumb}</Link>
          <span aria-hidden>·</span>
          <Link href={moduleHref}>{module.title}</Link>
          <span aria-hidden>·</span>
          <span>{lesson.title}</span>
          <span className="axr-lesson-bar__pct">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M2 8l3 3 7-7"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {completionPct}% {t.lesson.completed}
          </span>
        </div>
      </div>

      <div className="axr-lesson">
        <aside className="axr-lesson__sidebar">
          <div className="axr-lesson__sidebar-head">
            <span className="axr-section-tag">{module.code ?? "—"}</span>
            <h2>{module.title}</h2>
            <p>
              {fmt(t.lesson.sidebarProgress, { done: completedHere, total: totalModuleLessons })}
            </p>
          </div>
          <ol>
            {siblings.map((s, i) => {
              const isActive = s.id === lesson.id;
              const done = completedSet.has(s.id);
              return (
                <li key={s.id}>
                  <Link
                    href={`/lecciones/${s.id}`}
                    className={`axr-lesson__sidebar-item ${isActive ? "is-active" : ""}`}
                    data-done={done}
                  >
                    <span className="axr-lesson__sidebar-num">{done ? "✓" : i + 1}</span>
                    <span>{s.title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </aside>

        <main className="axr-lesson__main">
          <span className="axr-section-tag">
            {fmt(t.lesson.lessonTag, { n: lesson.order_index, module: module.title })}
          </span>
          <h1>{lesson.title}</h1>
          <div className="axr-lesson__meta">
            {lesson.duration_min ? <span>~{lesson.duration_min} {t.lesson.min}</span> : null}
            <span className="axr-lesson__badge">
              {lesson.audio_url ? `🔊 ${t.lesson.audioNarrated}` : t.lesson.audioSoon}
            </span>
          </div>

          {lesson.toc?.length ? (
            <div className="axr-lesson__toc">
              <div className="axr-lesson__toc-label">{t.lesson.tocLabel}</div>
              <ol>
                {lesson.toc.map((tocItem, i) => (
                  <li key={tocItem.id ?? i}>
                    <span className="axr-lesson__toc-num">{i + 1}</span>
                    <span>{tocItem.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <article className="axr-lesson__content prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
          </article>

          {quiz && questions.length > 0 ? (
            <section className="axr-lesson__quiz-section">
              <h2>{t.lesson.examTitle}</h2>
              <LessonQuiz
                quizId={quiz.id}
                lessonId={lesson.id}
                questions={questions}
                moduleHref={moduleHref}
                passScore={Number(quiz.pass_score)}
              />
            </section>
          ) : (
            <div className="axr-lesson__cta-bar">
              <Link className="axr-btn axr-btn--ghost" href={moduleHref}>
                ← {t.lesson.backToModule}
              </Link>
              <MarkCompleteButton lessonId={lesson.id} alreadyDone={alreadyDone} />
            </div>
          )}
        </main>
      </div>

      <div className="axr-audio-bar">
        <div className="axr-audio-bar__inner">
          <LessonAudioPlayer
            src={lesson.audio_url}
            lessonId={lesson.id}
            lessonTitle={lesson.title}
          />
        </div>
      </div>
    </>
  );
}
