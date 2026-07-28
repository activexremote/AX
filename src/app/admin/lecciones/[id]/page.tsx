import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonForm } from "@/components/admin/lesson-form";
import { AudioUpload } from "@/components/admin/audio-upload";
import { QuizEditor } from "@/components/admin/quiz-editor";
import { getLessonForView } from "@/lib/data/modules";
import { getI18n } from "@/lib/i18n/server";

export default async function AdminLessonEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLessonForView(id);
  if (!data) notFound();
  const { lesson, module, questions } = data;
  const { t } = await getI18n();

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
        <h2>{t.adminForm.audioSection}</h2>
        <AudioUpload lessonId={lesson.id} currentUrl={lesson.audio_url} />
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.quizSection}</h2>
        <QuizEditor lessonId={lesson.id} questions={questions} />
      </div>
    </div>
  );
}
