"use client";

import { useEffect } from "react";

import { addLessonTime, recordLessonVisit } from "@/app/(campus)/lecciones/actions";

/** Cada cuánto se apunta el tiempo de lectura, en segundos. */
const TRAMO = 15;
/** Sin tocar nada durante este rato, se da por hecho que no está leyendo. */
const INACTIVO_MS = 90_000;

// Apunta la visita y el tiempo de lectura de la lección.
//
// Antes el tiempo sólo se contaba con el audio en marcha, así que quien leía
// sin escuchar salía en «Mi progreso» con 1 s por lección. Ahora cuenta el
// rato con la pestaña a la vista y alguien al otro lado (scroll, ratón,
// teclado o toque en los últimos 90 s). El audio con la pestaña escondida lo
// sigue contando el reproductor: así no se cuenta dos veces el mismo minuto.
export function VisitTracker({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    recordLessonVisit(lessonId);

    let ultimo = Date.now();
    const actividad = () => {
      ultimo = Date.now();
    };
    const eventos = ["scroll", "pointermove", "keydown", "touchstart", "wheel"] as const;
    eventos.forEach((e) => window.addEventListener(e, actividad, { passive: true }));

    const t = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - ultimo < INACTIVO_MS) {
        void addLessonTime(lessonId, TRAMO);
      }
    }, TRAMO * 1000);

    return () => {
      clearInterval(t);
      eventos.forEach((e) => window.removeEventListener(e, actividad));
    };
  }, [lessonId]);

  return null;
}
