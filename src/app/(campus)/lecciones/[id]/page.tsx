import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { CampusHeader } from "@/components/campus-header";
import { LessonMission } from "@/components/lesson/mission";
import { LessonAudioPlayer } from "@/components/lesson/audio-player";
import { lessonGesturePlan } from "@/lib/content/gestures";
import { LessonQuiz } from "@/components/lesson/quiz";
import { MarkCompleteButton } from "@/components/lesson/mark-complete-button";
import { VisitTracker } from "@/components/lesson/visit-tracker";
import { getLessonForView } from "@/lib/data/modules";
import { getProgressForCurrentUser } from "@/lib/data/progress";
import { getSubmission } from "@/lib/data/relampago";
import { getI18n } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/dictionaries";
import { campusLessonCopy, type CampusLessonCopy } from "@/lib/i18n/campus-v2-b";
import "@/app/(campus)/lecciones/lesson.scss";
import { BlockList } from "@/components/content/block-view";
import { CampusLessonEditor } from "@/components/content/campus-lesson-editor";
import { parseBlocks } from "@/lib/content/blocks";
import { EditLangSwitch, readEditLang } from "@/components/content/edit-lang-switch";
import { getCurrentProfile } from "@/lib/data/profile";
import { editorCopy } from "@/lib/i18n/editor";
import "@/components/content/content.scss";
import "@/components/content/inline-edit.scss";
// Los campos del editor por dentro son los mismos que los del panel, así que
// se traen sus estilos. A un alumno no le llegan: el componente que los usa
// sólo se pinta para el profesorado.
import "@/components/admin/block-editor.scss";

// ══════════════════════════════════════════════════════════
//  Una lección (campus v2)
//
//  A la izquierda, el índice del módulo con su progreso (en el móvil, un
//  desplegable encima de la lección). En el centro, la lección en una hoja
//  blanca de ancho cómodo para leer. Debajo, lo que la cierra —el test, la
//  misión o el «marcar como completada»— y la navegación a la anterior y la
//  siguiente. El audio, en una barra flotante abajo.
// ══════════════════════════════════════════════════════════

type Hermana = { id: string; title: string; order_index: number };

/** El índice del módulo. Se pinta dos veces: barra lateral y desplegable del móvil. */
function Indice({
  siblings,
  activeId,
  completed,
  c,
}: {
  siblings: Hermana[];
  activeId: string;
  completed: Set<string>;
  c: CampusLessonCopy;
}) {
  return (
    <ol className="axr-lsn-index__list">
      {siblings.map((s, i) => {
        const activa = s.id === activeId;
        const hecha = completed.has(s.id);
        return (
          <li key={s.id}>
            <Link
              href={`/lecciones/${s.id}`}
              className={`axr-lsn-index__item${activa ? " is-active" : ""}${hecha ? " is-done" : ""}`}
              aria-current={activa ? "page" : undefined}
            >
              <span className="axr-lsn-index__num" aria-hidden>
                {hecha ? <Icono n="ok" size={13} /> : i + 1}
              </span>
              <span className="axr-lsn-index__title">{s.title}</span>
              {hecha ? <span className="axr-lsn-index__sr">{c.done}</span> : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ editar?: string | string[] }>;
}) {
  const { id } = await params;
  const { editar } = await searchParams;
  // La lección y quién la mira, a la vez.
  const [data, perfil] = await Promise.all([getLessonForView(id), getCurrentProfile()]);
  if (!data) notFound();
  const { lesson, module, siblings, quiz, questions, raw } = data;
  // Una lección relámpago se distingue por tener misión: el resto de la
  // pantalla es la misma y no hace falta un tipo de lección aparte.
  const esRelampago = Boolean(lesson.mission_md);
  // Validado aquí y no en la consulta: lo que hay en la base es jsonb libre y
  // puede venir de una versión anterior del catálogo de bloques.
  const bloques = parseBlocks(lesson.content_blocks);
  // El profesorado edita la lección aquí mismo, sin pasar por el panel. Para
  // un alumno esto no existe: ni el componente ni su JavaScript se le mandan.
  const esEquipo = perfil?.role === "profesor" || perfil?.role === "administrador";
  const [progress, { t, locale }, submission] = await Promise.all([
    getProgressForCurrentUser(),
    getI18n(),
    esRelampago ? getSubmission(lesson.id) : Promise.resolve(null),
  ]);
  const c = campusLessonCopy[locale];
  // Lo que edita el profesorado: siempre la versión sin traducir que elija en
  // el selector, que por defecto es la del idioma en que tiene el campus.
  const editLang = readEditLang(editar, locale);
  const bloquesEs = parseBlocks(raw.lesson.content_blocks);
  const bloquesEn = parseBlocks(raw.lesson.content_blocks_en);

  const completedSet = new Set(progress.filter((p) => p.status === "completada").map((p) => p.lesson_id));
  const moduleHref = `/modulos/${module.slug}`;
  const total = siblings.length;
  const hechas = siblings.filter((s) => completedSet.has(s.id)).length;
  const pct = total ? Math.round((hechas / total) * 100) : 0;
  const alreadyDone = completedSet.has(lesson.id);

  // Anterior y siguiente, en el orden del módulo.
  const pos = siblings.findIndex((s) => s.id === lesson.id);
  const anterior = pos > 0 ? siblings[pos - 1] : null;
  const siguiente = pos >= 0 && pos < total - 1 ? siblings[pos + 1] : null;
  const siguienteHref = siguiente ? `/lecciones/${siguiente.id}` : moduleHref;
  const siguienteLabel = siguiente ? c.nextLesson : c.backToModule;
  const numero = pos >= 0 ? pos + 1 : lesson.order_index;

  const tieneTest = Boolean(quiz && questions.length > 0);

  return (
    <>
      <CampusHeader />
      <VisitTracker lessonId={lesson.id} />

      <div className="axr-lsn">
        <nav className="axr-lsn__crumbs" aria-label="Breadcrumb">
          <Link href="/">{t.nav.home}</Link>
          <span aria-hidden>/</span>
          <Link href={moduleHref}>{module.title}</Link>
          <span aria-hidden>/</span>
          <span>{fmt(c.lessonN, { n: numero })}</span>
        </nav>

        <div className="axr-lsn__grid">
          {/* ── Índice del módulo (escritorio) ── */}
          <aside className="axr-lsn-index" aria-label={c.lessonsOfModule}>
            <div className="axr-lsn-index__head">
              {module.code ? <span className="axr-c-pill axr-c-pill--accent">{module.code}</span> : null}
              <Link href={moduleHref} className="axr-lsn-index__module">
                {module.title}
              </Link>
              <div className="axr-lsn-index__progress">
                <div className="axr-c-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <small>{fmt(t.lesson.sidebarProgress, { done: hechas, total })}</small>
              </div>
            </div>
            <Indice siblings={siblings} activeId={lesson.id} completed={completedSet} c={c} />
          </aside>

          <main className="axr-lsn__main">
            {/* ── Índice del módulo (móvil) ── */}
            <details className="axr-lsn-index-m">
              <summary>
                <span className="axr-lsn-index-m__label">
                  <Icono n="lista" size={16} />
                  {c.lessonsOfModule}
                </span>
                <span className="axr-c-pill">{fmt(c.progressShort, { done: hechas, total })}</span>
              </summary>
              <div className="axr-lsn-index-m__body">
                <div className="axr-c-progress">
                  <span style={{ width: `${pct}%` }} />
                </div>
                <Indice siblings={siblings} activeId={lesson.id} completed={completedSet} c={c} />
              </div>
            </details>

            <article className="axr-lsn__paper">
              <header className="axr-lsn__head">
                <div className="axr-lsn__pills">
                  <span className="axr-c-pill axr-c-pill--accent">{fmt(c.lessonN, { n: numero })}</span>
                  {lesson.duration_min ? (
                    <span className="axr-c-pill">
                      <Icono n="reloj" size={12} /> {fmt(c.duration, { n: lesson.duration_min })}
                    </span>
                  ) : null}
                  {esRelampago ? (
                    lesson.mission_minutes ? (
                      <span className="axr-c-pill axr-c-pill--warn">{fmt(c.withMission, { n: lesson.mission_minutes })}</span>
                    ) : null
                  ) : lesson.audio_url ? (
                    <span className="axr-c-pill axr-c-pill--info">{c.withAudio}</span>
                  ) : (
                    <span className="axr-c-pill">{c.noAudio}</span>
                  )}
                  {alreadyDone ? (
                    <span className="axr-c-pill axr-c-pill--ok">
                      <Icono n="ok" size={12} /> {c.done}
                    </span>
                  ) : null}
                </div>
                <h1>{lesson.title}</h1>
                {lesson.subtitle ? <p className="axr-lsn__subtitle">{lesson.subtitle}</p> : null}
              </header>

              {/* ── Cabecera de una lección relámpago ── */}
              {/* El gancho va ANTES que nada: la regla de comunicación del curso
                  es problema humano → concepto técnico, y ése es el problema. */}
              {/* Algunos ganchos ya vienen entre comillas: no se ponen otras. */}
              {lesson.hook && (
                <p className="axr-lsn__hook">{/^\s*[«"“]/.test(lesson.hook) ? lesson.hook : `«${lesson.hook}»`}</p>
              )}

              {esRelampago && (
                <div className="axr-lsn__video">
                  {lesson.video_url ? (
                    <>
                      {/* `preload="metadata"`: trae la duración y el primer
                          fotograma sin descargar el vídeo entero a quien sólo
                          pasaba por aquí. */}
                      <video controls preload="metadata" playsInline src={lesson.video_url} />
                      {/* Marcado como muestra en el seed. Se dice aquí también y
                          no sólo en la landing: quien ya ha pagado y está dentro
                          merece saber por qué ve el mismo clip en cada lección. */}
                      {lesson.video_provider === "demo" && <p className="axr-lsn__video-demo">{t.lesson.videoDemo}</p>}
                    </>
                  ) : (
                    <p className="axr-lsn__video-soon">{t.lesson.videoSoon}</p>
                  )}
                </div>
              )}

              {lesson.outcome && (
                <div className="axr-c-note axr-c-note--accent axr-lsn__outcome">
                  <Icono n="chispa" />
                  <div>
                    <strong>{t.lesson.outcomeLabel}</strong>
                    <p>{lesson.outcome}</p>
                  </div>
                </div>
              )}

              {lesson.terms?.length ? (
                <div className="axr-lsn__terms">
                  <span className="axr-lsn__label">{t.lesson.termsLabel}</span>
                  <ul>
                    {lesson.terms.map((term) => (
                      <li key={term}>{term}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {lesson.toc?.length ? (
                <nav className="axr-lsn__toc" aria-label={c.onThisPage}>
                  <span className="axr-lsn__label">{c.onThisPage}</span>
                  <ol>
                    {lesson.toc.map((tocItem, i) => (
                      <li key={tocItem.id ?? i}>
                        <span className="axr-lsn__toc-num">{i + 1}</span>
                        <span>{tocItem.title}</span>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {/* ── El cuerpo de la lección ──
                  Con bloques se pinta el contenido visual (checklists, cuadros,
                  tablas, gráficos). Sin ellos, el Markdown de siempre: ninguna
                  lección de las que ya existen cambia de aspecto por esto. */}
              <div className="axr-lesson__content axr-lsn__content prose">
                {esEquipo ? (
                  <>
                    <EditLangSwitch current={editLang} basePath={`/lecciones/${lesson.id}`} labels={t.adminForm} />
                    {editLang === "en" && !bloquesEn.length && bloquesEs.length ? (
                      <p className="axr-lesson__edit-hint">{t.adminForm.enFromEs}</p>
                    ) : null}
                    <CampusLessonEditor
                      key={editLang}
                      lessonId={lesson.id}
                      initial={editLang === "en" ? (bloquesEn.length ? bloquesEn : bloquesEs) : bloquesEs}
                      markdown={lesson.content_md}
                      copy={editorCopy[locale]}
                      lang={editLang}
                    />
                    {/* Mientras la lección siga siendo Markdown, el profesor la ve
                        como la ve el alumno, y arriba tiene el botón para
                        prepararla para editar. */}
                    {bloques.length === 0 ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown> : null}
                  </>
                ) : bloques.length ? (
                  <BlockList blocks={bloques} storageKey={lesson.id} />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
                )}
              </div>
            </article>

            {/* ── Lo que cierra la lección ── */}
            {tieneTest && quiz ? (
              <section className="axr-lsn__card axr-lsn__quiz" id="test">
                <header className="axr-lsn__card-head">
                  <span className="axr-lsn__card-icon" aria-hidden>
                    <Icono n="tareas" size={20} />
                  </span>
                  <div>
                    <h2>{esRelampago ? t.lesson.checkTitle : t.lesson.examTitle}</h2>
                    <p>{c.quizTitleHint}</p>
                  </div>
                </header>
                <LessonQuiz
                  quizId={quiz.id}
                  lessonId={lesson.id}
                  questions={questions}
                  passScore={Number(quiz.pass_score)}
                  nextHref={esRelampago ? null : siguienteHref}
                  nextLabel={siguienteLabel}
                  copy={c}
                />
              </section>
            ) : null}

            {esRelampago && lesson.mission_md ? (
              <LessonMission
                lessonId={lesson.id}
                mission={lesson.mission_md}
                minutes={lesson.mission_minutes}
                criterion={lesson.mission_criterion}
                evidenceHint={lesson.evidence_hint}
                submission={submission}
                copy={t.mission}
              />
            ) : null}

            {!tieneTest && !esRelampago ? (
              <section className={`axr-lsn__card axr-lsn__finish${alreadyDone ? " is-done" : ""}`}>
                <span className="axr-lsn__card-icon" aria-hidden>
                  <Icono n="ok" size={20} />
                </span>
                <div className="axr-lsn__finish-text">
                  <h2>{alreadyDone ? c.done : c.finishTitle}</h2>
                  <p>{alreadyDone ? c.finishDone : c.finishBody}</p>
                </div>
                <MarkCompleteButton lessonId={lesson.id} alreadyDone={alreadyDone} nextHref={siguienteHref} nextLabel={siguienteLabel} />
              </section>
            ) : null}

            {/* ── Anterior / siguiente ── */}
            <nav className="axr-lsn__pager" aria-label={c.lessonsOfModule}>
              {anterior ? (
                <Link href={`/lecciones/${anterior.id}`} className="axr-lsn__pager-item">
                  <small>← {c.prev}</small>
                  <strong>{anterior.title}</strong>
                </Link>
              ) : (
                <Link href={moduleHref} className="axr-lsn__pager-item">
                  <small>← {c.backToModule}</small>
                  <strong>{module.title}</strong>
                </Link>
              )}
              {siguiente ? (
                <Link href={`/lecciones/${siguiente.id}`} className="axr-lsn__pager-item axr-lsn__pager-item--next">
                  <small>{c.next} →</small>
                  <strong>{siguiente.title}</strong>
                </Link>
              ) : (
                <Link href={moduleHref} className="axr-lsn__pager-item axr-lsn__pager-item--next">
                  <small>{c.moduleDone} →</small>
                  <strong>{c.backToModule}</strong>
                </Link>
              )}
            </nav>
          </main>
        </div>
      </div>

      {/* La barra de audio es del programa largo, donde cada lección se
          narra. En un relámpago el medio es el vídeo y una barra fija vacía
          sólo roba sitio en pantalla. */}
      {!esRelampago && (
        <div className="axr-audio-bar">
          <div className="axr-audio-bar__inner">
            <LessonAudioPlayer src={lesson.audio_url} lessonId={lesson.id} lessonTitle={lesson.title} plan={lessonGesturePlan(bloques)} />
          </div>
        </div>
      )}
    </>
  );
}
