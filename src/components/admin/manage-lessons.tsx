"use client";

import Link from "next/link";
import { useState } from "react";

import { LessonForm } from "@/components/admin/lesson-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLesson } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { Lesson } from "@/lib/supabase/types";

export function ManageLessons({ moduleId, lessons }: { moduleId: string; lessons: Lesson[] }) {
  const { t } = useI18n();
  const [adding, setAdding] = useState(false);

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

      {adding ? (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--axr-border)" }}>
          <h3 style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>{t.adminForm.newLesson}</h3>
          <LessonForm moduleId={moduleId} onDone={() => setAdding(false)} />
        </div>
      ) : (
        <button
          type="button"
          className="axr-btn axr-btn--primary"
          style={{ marginTop: "1rem" }}
          onClick={() => setAdding(true)}
        >
          + {t.adminForm.newLesson}
        </button>
      )}
    </div>
  );
}
