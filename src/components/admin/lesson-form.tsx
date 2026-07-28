"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createLesson, updateLesson } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { Lesson } from "@/lib/supabase/types";

export function LessonForm({
  moduleId,
  lesson,
  onDone,
}: {
  moduleId: string;
  lesson?: Lesson;
  onDone?: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = lesson
        ? await updateLesson(lesson.id, formData)
        : await createLesson(moduleId, formData);
      if (r?.error) setError(r.error);
      else {
        router.refresh();
        onDone?.();
      }
    });
  }

  return (
    <form action={handle} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.adminForm.fSlug}</label>
          <input name="slug" defaultValue={lesson?.slug} required />
        </div>
        <div className="axr-form__row">
          <label>{t.adminForm.fOrder}</label>
          <input name="order_index" type="number" defaultValue={lesson?.order_index ?? 1} />
        </div>
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fTitle}</label>
        <input name="title" defaultValue={lesson?.title} required />
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fSubtitle}</label>
        <input name="subtitle" defaultValue={lesson?.subtitle ?? ""} />
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.adminForm.fDuration}</label>
          <input name="duration_min" type="number" defaultValue={lesson?.duration_min ?? 5} />
        </div>
        <div className="axr-form__row">
          <label>{t.adminForm.fAudioUrl}</label>
          <input name="audio_url" defaultValue={lesson?.audio_url ?? ""} placeholder="https://..." />
        </div>
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fContent}</label>
        <textarea
          name="content_md"
          defaultValue={lesson?.content_md ?? ""}
          style={{ minHeight: "220px", fontFamily: "var(--font-plex-mono), monospace" }}
        />
      </div>
      <div className="axr-form__actions">
        {onDone ? (
          <button type="button" className="axr-btn axr-btn--ghost" onClick={onDone}>
            {t.common.cancel}
          </button>
        ) : null}
        <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
          {pending
            ? t.common.saving
            : lesson
              ? t.adminForm.saveLesson
              : t.adminForm.createLesson}
        </button>
      </div>
    </form>
  );
}
