"use client";

import { useEffect } from "react";

import { recordLessonVisit } from "@/app/(campus)/lecciones/actions";

export function VisitTracker({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    recordLessonVisit(lessonId);
  }, [lessonId]);

  return null;
}
