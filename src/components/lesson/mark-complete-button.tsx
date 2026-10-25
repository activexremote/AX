"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { markLessonComplete } from "@/app/(campus)/lecciones/actions";
import { useI18n } from "@/lib/i18n/provider";

// Marcar como completada y, hecho eso, el siguiente paso a la vista: la
// lección siguiente (o el módulo, si era la última) como botón principal.
export function MarkCompleteButton({
  lessonId,
  alreadyDone,
  nextHref,
  nextLabel,
}: {
  lessonId: string;
  alreadyDone: boolean;
  nextHref?: string;
  nextLabel?: string;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState(alreadyDone);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="axr-lsn__finish-actions">
        <span className="axr-btn axr-btn--success" aria-disabled>
          ✓ {t.lesson.markedDone}
        </span>
        {nextHref ? (
          <Link className="axr-btn axr-btn--primary" href={nextHref}>
            {nextLabel} →
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="axr-lsn__finish-actions">
      <button
        type="button"
        className="axr-btn axr-btn--primary"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const r = await markLessonComplete(lessonId);
            if (r?.ok) setDone(true);
          });
        }}
      >
        {pending ? t.lesson.marking : `✓ ${t.lesson.markComplete}`}
      </button>
    </div>
  );
}
