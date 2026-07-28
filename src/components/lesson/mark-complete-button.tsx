"use client";

import { useState, useTransition } from "react";

import { markLessonComplete } from "@/app/(campus)/lecciones/actions";
import { useI18n } from "@/lib/i18n/provider";

export function MarkCompleteButton({
  lessonId,
  alreadyDone,
}: {
  lessonId: string;
  alreadyDone: boolean;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState(alreadyDone);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="axr-btn axr-btn--success"
      disabled={done || pending}
      onClick={() => {
        startTransition(async () => {
          const r = await markLessonComplete(lessonId);
          if (r?.ok) setDone(true);
        });
      }}
    >
      {done
        ? `✓ ${t.lesson.markedDone}`
        : pending
          ? t.lesson.marking
          : `✓ ${t.lesson.markComplete}`}
    </button>
  );
}
