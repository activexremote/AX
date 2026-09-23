import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonForm } from "@/components/admin/lesson-form";
import { LessonBlocksEditor } from "@/components/admin/lesson-blocks-editor";
import { AudioUpload } from "@/components/admin/audio-upload";
import { QuizEditor } from "@/components/admin/quiz-editor";
import { getLessonForView } from "@/lib/data/modules";
import { getI18n } from "@/lib/i18n/server";
import { editorCopy } from "@/lib/i18n/editor";
import { aiConfigured } from "@/lib/ai/settings";
import { parseBlocks } from "@/lib/content/blocks";
import "@/components/content/content.scss";
import "@/components/admin/block-editor.scss";

// Narrar una lección larga son varias llamadas a Fish encadenadas: con los 15 s
// que trae Next por defecto, la acción moriría a medio MP3.
export const maxDuration = 300;

export default async function AdminLessonEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLessonForView(id);
  if (!data) notFound();
  const { lesson, module, questions } = data;
  const { t, locale } = await getI18n();
  const copy = editorCopy[locale];
  // Sin clave de OpenAI el editor sale igual: lo único que no aparece es el
  // botón de estructurar con IA.
  const iaLista = await aiConfigured();

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{lesson.title}</h1>
          <p>
            <Link href={`/admin/modulos/${module.id}`}>← {module.title}</Link>
          </p>
        </div>
        <Link href={`/lecciones/${lesson.id}`} className="axr-btn axr-btn--ghost">
          {t.adminForm.viewInCampus}
        </Link>
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.lessonContent}</h2>
        <LessonForm moduleId={module.id} lesson={lesson} />
      </div>

      <div className="axr-admin-card">
        <h2>{copy.title}</h2>
        <p className="axr-admin-card__lead">{copy.lead}</p>
        <LessonBlocksEditor
          lessonId={lesson.id}
          initial={parseBlocks(lesson.content_blocks)}
          draft={lesson.content_md}
          aiReady={iaLista}
          copy={copy}
        />
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.audioSection}</h2>
        {/* ⚠︎ La narración automática (lib/tts) todavía no está en el repo: vive
            sin commitear en local. Cuando entre, este componente vuelve a
            recibir `ttsReady={ttsConfigured()}`. */}
        <AudioUpload lessonId={lesson.id} currentUrl={lesson.audio_url} />
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.quizSection}</h2>
        <QuizEditor lessonId={lesson.id} questions={questions} />
      </div>
    </div>
  );
}
