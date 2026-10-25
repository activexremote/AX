import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonForm } from "@/components/admin/lesson-form";
import { LessonBlocksEditor } from "@/components/admin/lesson-blocks-editor";
import { AudioUpload } from "@/components/admin/audio-upload";
import { QuizEditor } from "@/components/admin/quiz-editor";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getLessonForView } from "@/lib/data/modules";
import { getI18n } from "@/lib/i18n/server";
import { editorCopy } from "@/lib/i18n/editor";
import { adminACopy } from "@/lib/i18n/admin-v2-a";
import { aiConfigured } from "@/lib/ai/settings";
import { ttsConfigured } from "@/lib/tts/fish";
import { parseBlocks } from "@/lib/content/blocks";
import { EditLangSwitch, readEditLang } from "@/components/content/edit-lang-switch";
import "@/components/content/content.scss";
import "@/components/admin/block-editor.scss";
import "@/app/admin/modulos/modulos.scss";

// Narrar una lección larga son varias llamadas a Fish encadenadas: con los 15 s
// que trae Next por defecto, la acción moriría a medio MP3.
export const maxDuration = 300;

export default async function AdminLessonEditor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ editar?: string | string[] }>;
}) {
  const { id } = await params;
  const { editar } = await searchParams;
  // Sin clave de OpenAI el editor sale igual: lo único que no aparece es el
  // botón de estructurar con IA.
  const [data, { t, locale }, iaLista] = await Promise.all([getLessonForView(id), getI18n(), aiConfigured()]);
  if (!data) notFound();
  const { questions } = data;
  // El panel trabaja SIEMPRE con la lección sin traducir: lo que se ve es lo
  // que hay en cada columna, y el selector decide cuál se edita.
  const { lesson, module } = data.raw;
  const editLang = readEditLang(editar, "es");
  const bloquesEs = parseBlocks(lesson.content_blocks);
  const bloquesEn = parseBlocks(lesson.content_blocks_en);
  const copy = editorCopy[locale];
  const c = adminACopy[locale];

  return (
    <div className="axr-admin-page axr-moddetail axr-lessoned">
      <div className="axr-admin-page__header">
        <div>
          <nav className="axr-moddetail__crumbs" aria-label="Breadcrumb">
            <Link href="/admin/modulos">{c.crumbModules}</Link>
            <span aria-hidden>/</span>
            <Link href={`/admin/modulos/${module.id}`}>{module.title}</Link>
          </nav>
          <h1>{lesson.title}</h1>
          <div className="axr-moddetail__pills">
            <span className="axr-adm-pill">{lesson.duration_min ?? "—"} min</span>
            <span className={`axr-adm-pill axr-adm-pill--${bloquesEs.length || lesson.content_md?.trim() ? "ok" : "warn"}`}>
              {bloquesEs.length || lesson.content_md?.trim() ? c.lessonHasContent : c.lessonNoContent}
            </span>
            <span className={`axr-adm-pill${lesson.audio_url ? " axr-adm-pill--info" : ""}`}>{lesson.audio_url ? c.lessonAudio : c.lessonNoAudio}</span>
          </div>
        </div>
        <Link href={`/lecciones/${lesson.id}`} className="axr-btn axr-btn--ghost">
          <Icono n="enlace" size={15} /> {t.adminForm.viewInCampus}
        </Link>
      </div>

      {/* El editor es largo: un índice que se queda arriba lleva a cada parte. */}
      <nav className="axr-lessonnav" aria-label={c.lessonSections}>
        <a href="#datos">{c.lessonContent}</a>
        <a href="#contenido">{copy.title}</a>
        <a href="#audio">{t.adminForm.audioSection}</a>
        <a href="#test">{t.adminForm.quizSection}</a>
      </nav>

      <div className="axr-admin-card" id="datos">
        <h2>{c.lessonContent}</h2>
        <LessonForm moduleId={module.id} lesson={lesson} />
      </div>

      <div className="axr-admin-card" id="contenido">
        <h2>{copy.title}</h2>
        <p className="axr-admin-card__lead">{copy.lead}</p>
        <EditLangSwitch current={editLang} basePath={`/admin/lecciones/${lesson.id}`} labels={t.adminForm} />
        {editLang === "en" && !bloquesEn.length && bloquesEs.length ? (
          <p className="axr-admin-card__lead">{t.adminForm.enFromEs}</p>
        ) : null}
        <LessonBlocksEditor
          key={editLang}
          lessonId={lesson.id}
          initial={editLang === "en" ? (bloquesEn.length ? bloquesEn : bloquesEs) : bloquesEs}
          draft={lesson.content_md}
          aiReady={iaLista}
          copy={copy}
          lang={editLang}
        />
      </div>

      <div className="axr-admin-card" id="audio">
        <h2>{t.adminForm.audioSection}</h2>
        {/* Sigue al selector de idioma de arriba: genera o sube el audio de la
            versión que se está editando. */}
        <EditLangSwitch current={editLang} basePath={`/admin/lecciones/${lesson.id}`} labels={t.adminForm} />
        <AudioUpload
          key={editLang}
          lessonId={lesson.id}
          currentUrl={editLang === "en" ? lesson.audio_url_en ?? null : lesson.audio_url}
          ttsReady={ttsConfigured()}
          lang={editLang}
        />
      </div>

      <div className="axr-admin-card" id="test">
        <h2>{t.adminForm.quizSection}</h2>
        <QuizEditor lessonId={lesson.id} questions={questions} />
      </div>
    </div>
  );
}
