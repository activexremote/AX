"use client";

import Link from "next/link";
import { useState } from "react";

import { LessonForm } from "@/components/admin/lesson-form";
import { LessonDropzone } from "@/components/admin/lesson-dropzone";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
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
  const [modo, setModo] = useState<Modo>("cerrado");

  return (
    <div>
      <table className="axr-admin-table">
        <thead>
          <tr>
            <th>{t.admin.colOrder}</th>
            <th>{t.adminForm.fTitle}</th>
            <th>{t.adminForm.colDuration}</th>
            <th>{t.progress.colAudio}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lessons.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>{t.adminForm.noLessons}</td></tr>
          ) : null}
          {lessons.map((l) => (
            <tr key={l.id}>
              <td>{l.order_index}</td>
              <td><Link href={`/admin/lecciones/${l.id}`}>{l.title}</Link></td>
              <td>{l.duration_min ?? "—"} min</td>
              <td>{l.audio_url ? "🔊" : "—"}</td>
              <td className="axr-admin-table__actions">
                <Link className="axr-btn axr-btn--ghost" href={`/admin/lecciones/${l.id}`}>{t.admin.edit}</Link>
                <DeleteButton action={() => deleteLesson(l.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modo === "cerrado" ? (
        <button
          type="button"
          className="axr-btn axr-btn--primary"
          style={{ marginTop: "1rem" }}
          onClick={() => setModo("archivo")}
        >
          + {t.adminForm.newLesson}
        </button>
      ) : (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--axr-border)" }}>
          <h3 style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>{t.adminForm.newLesson}</h3>
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
        </div>
      )}
    </div>
  );
}
