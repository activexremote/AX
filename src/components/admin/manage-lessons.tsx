"use client";

import Link from "next/link";
import { useState } from "react";

import { LessonForm } from "@/components/admin/lesson-form";
import { LessonDropzone } from "@/components/admin/lesson-dropzone";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
import { adminACopy } from "@/lib/i18n/admin-v2-a";
import { editorCopy } from "@/lib/i18n/editor";
import type { Lesson } from "@/lib/supabase/types";

/**
 * Crear una lección tiene dos caminos, y el orden importa:
 *
 *  · "archivo" — se arrastra el PDF (o el Word, o la hoja) y la IA propone la
 *    lección entera. Es el camino principal y por eso es el que sale.
 *  · "mano" — el formulario de siempre, para quien ya sabe lo que quiere.
 */
type Modo = "cerrado" | "archivo" | "mano";

export function ManageLessons({
  moduleId,
  lessons,
  aiReady,
}: {
  moduleId: string;
  lessons: Lesson[];
  aiReady: boolean;
}) {
  const { t, locale } = useI18n();
  const copy = editorCopy[locale];
  const c = adminACopy[locale];
  const [modo, setModo] = useState<Modo>("cerrado");

  // Una lección «vacía» tiene título pero ni bloques ni borrador: el alumno
  // la ve en blanco. Se marca para que no pase desapercibida.
  const conContenido = (l: Lesson) => Boolean((Array.isArray(l.content_blocks) && l.content_blocks.length) || l.content_md?.trim());

  return (
    <div>
      {lessons.length ? (
        <ol className="axr-lessonlist">
          {lessons.map((l) => (
            <li key={l.id}>
              <span className="axr-lessonlist__n">{l.order_index}</span>
              <span className="axr-lessonlist__main">
                <Link href={`/admin/lecciones/${l.id}`}>{l.title}</Link>
                <span>
                  {l.duration_min ?? "—"} min
                  <span className={`axr-adm-pill axr-adm-pill--${conContenido(l) ? "ok" : "warn"}`}>
                    {conContenido(l) ? c.lessonHasContent : c.lessonNoContent}
                  </span>
                  <span className={`axr-adm-pill${l.audio_url ? " axr-adm-pill--info" : ""}`}>{l.audio_url ? c.lessonAudio : c.lessonNoAudio}</span>
                </span>
              </span>
              <span className="axr-lessonlist__actions">
                <Link className="axr-btn axr-btn--ghost axr-btn--small" href={`/admin/lecciones/${l.id}`}>
                  {t.admin.edit}
                </Link>
                <DeleteButton action={() => deleteLesson(l.id)} small />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="axr-lessonlist axr-lessonlist__empty">{t.adminForm.noLessons}</p>
      )}

      {modo === "cerrado" ? (
        <button type="button" className="axr-btn axr-btn--primary" onClick={() => setModo("archivo")}>
          + {t.adminForm.newLesson}
        </button>
      ) : (
        <div className="axr-lessonnew">
          <h3>{t.adminForm.newLesson}</h3>
          {modo === "archivo" ? (
            <LessonDropzone
              moduleId={moduleId}
              aiReady={aiReady}
              copy={copy}
              onManual={() => setModo("mano")}
            />
          ) : (
            <LessonForm moduleId={moduleId} onDone={() => setModo("cerrado")} />
          )}
          <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" style={{ marginTop: "0.75rem" }} onClick={() => setModo("cerrado")}>
            {t.common.cancel}
          </button>
        </div>
      )}
    </div>
  );
}
