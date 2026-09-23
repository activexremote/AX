import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CampusHeader } from "@/components/campus-header";
import { LessonMission } from "@/components/lesson/mission";
import { LessonAudioPlayer } from "@/components/lesson/audio-player";
import { LessonQuiz } from "@/components/lesson/quiz";
import { MarkCompleteButton } from "@/components/lesson/mark-complete-button";
import { VisitTracker } from "@/components/lesson/visit-tracker";
import { getLessonForView } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { getSubmission } from "@/lib/data/relampago";
import { getI18n } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/dictionaries";
import "@/app/(campus)/lecciones/lesson.scss";
import { BlockList } from "@/components/content/block-view";
import { parseBlocks } from "@/lib/content/blocks";
import "@/components/content/content.scss";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLessonForView(id);
  if (!data) notFound();
  const { lesson, module, siblings, quiz, questions } = data;
  // Una lección relámpago se distingue por tener misión: el resto de la
  // pantalla es la misma y no hace falta un tipo de lección aparte.
  const esRelampago = Boolean(lesson.mission_md);
  // Validado aquí y no en la consulta: lo que hay en la base es jsonb libre y
  // puede venir de una versión anterior del catálogo de bloques.
  const bloques = parseBlocks(lesson.content_blocks);
  const [progress, { t }, submission] = await Promise.all([
    getProgressForCurrentUser(),
    getI18n(),
    esRelampago ? getSubmission(lesson.id) : Promise.resolve(null),
  ]);
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
            {esRelampago ? (
              lesson.mission_minutes ? (
                <span className="axr-lesson__badge">
                  + {lesson.mission_minutes} {t.lesson.min} · {t.mission.title}
                </span>
              ) : null
            ) : (
              <span className="axr-lesson__badge">
                {lesson.audio_url ? `🔊 ${t.lesson.audioNarrated}` : t.lesson.audioSoon}
              </span>
            )}
          </div>

          {/* ── Cabecera de una lección relámpago ── */}
          {/* El gancho va ANTES que nada: la regla de comunicación del curso
              es problema humano → concepto técnico, y ése es el problema. */}
          {lesson.hook && <p className="axr-lesson__hook">«{lesson.hook}»</p>}

          {esRelampago && (
            <div className="axr-lesson__video">
              {lesson.video_url ? (
                <>
                  {/* `preload="metadata"`: trae la duración y el primer
                      fotograma sin descargar el vídeo entero a quien sólo
                      pasaba por aquí. */}
                  <video controls preload="metadata" playsInline src={lesson.video_url} />
                  {/* Marcado como muestra en el seed. Se dice aquí también y
                      no sólo en la landing: quien ya ha pagado y está dentro
                      merece saber por qué ve el mismo clip en cada lección. */}
                  {lesson.video_provider === "demo" && (
                    <p className="axr-lesson__video-demo">{t.lesson.videoDemo}</p>
                  )}
                </>
              ) : (
                <p className="axr-lesson__video-soon">{t.lesson.videoSoon}</p>
              )}
            </div>
          )}

          {lesson.outcome && (
            <div className="axr-lesson__outcome">
              <span className="axr-section-tag">{t.lesson.outcomeLabel}</span>
              <p>{lesson.outcome}</p>
            </div>
          )}

          {lesson.terms?.length ? (
            <div className="axr-lesson__terms">
              <span className="axr-section-tag">{t.lesson.termsLabel}</span>
              <ul>
                {lesson.terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          ) : null}

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

          {/* ── El cuerpo de la lección ──
              Con bloques se pinta el contenido visual (checklists, cuadros,
              tablas, gráficos). Sin ellos, el Markdown de siempre: ninguna
              lección de las que ya existen cambia de aspecto por esto. */}
          <article className="axr-lesson__content prose">
            {bloques.length ? (
              <BlockList blocks={bloques} storageKey={lesson.id} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
            )}
          </article>

          {quiz && questions.length > 0 ? (
            <section className="axr-lesson__quiz-section">
              <h2>{esRelampago ? t.lesson.checkTitle : t.lesson.examTitle}</h2>
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

      {esRelampago && lesson.mission_md && (
        <div className="axr-lesson axr-lesson--mission">
          <div className="axr-lesson__sidebar" aria-hidden />
          <main className="axr-lesson__main">
            <LessonMission
              lessonId={lesson.id}
              mission={lesson.mission_md}
              minutes={lesson.mission_minutes}
              criterion={lesson.mission_criterion}
              evidenceHint={lesson.evidence_hint}
              submission={submission}
              copy={t.mission}
            />
          </main>
        </div>
      )}

      {/* La barra de audio es del programa largo, donde cada lección se
          narra. En un relámpago el medio es el vídeo y una barra fija vacía
          sólo roba sitio en pantalla. */}
      {!esRelampago && (
        <div className="axr-audio-bar">
          <div className="axr-audio-bar__inner">
            <LessonAudioPlayer
              src={lesson.audio_url}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
            />
          </div>
        </div>
      )}
    </>
  );
}
