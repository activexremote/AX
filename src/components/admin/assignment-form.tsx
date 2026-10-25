"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createAssignment, updateAssignment } from "@/app/admin/tareas/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminV2BCopy } from "@/lib/i18n/admin-v2-b";

type Option = { id: string; label: string; hint?: string };

/**
 * Asignar una tarea (alumno + módulo + fecha + nota) o, con `editar`,
 * cambiar la fecha y la nota de una que ya existe. El alumno y el módulo de
 * una tarea no se cambian: para eso se borra y se asigna otra.
 */
export function AssignmentForm({
  students,
  modules,
  copy,
  editar,
  onClose,
}: {
  students: Option[];
  modules: Option[];
  copy: AdminV2BCopy;
  editar?: { id: string; student: string; module: string; due_date: string | null; note: string | null };
  /** Con `editar` el formulario lo abre y lo cierra quien lo usa. */
  onClose?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(editar));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const cerrar = () => {
    setOpen(false);
    setError(null);
    onClose?.();
  };

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `cerrar` sólo cierra
  }, [open]);

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = editar ? await updateAssignment(editar.id, formData) : await createAssignment(formData);
      if (r?.error) setError(r.error);
      else {
        router.refresh();
        cerrar();
      }
    });
  }

  if (!open) {
    return (
      <button type="button" className="axr-btn" onClick={() => setOpen(true)} disabled={!students.length} title={!students.length ? copy.tNoStudents : undefined}>
        <Icono n="mas" /> {copy.tAssign}
      </button>
    );
  }

  return (
    <div className="axr-modal" role="dialog" aria-modal="true" aria-label={editar ? copy.tEditTitle : copy.tAssign} onClick={(e) => e.target === e.currentTarget && cerrar()}>
      <div className="axr-modal__panel">
        <h2>{editar ? copy.tEditTitle : copy.tAssign}</h2>
        <form action={handle} className="axr-form">
          {error ? <div className="axr-al-error">{error}</div> : null}
          {editar ? (
            <div className="axr-form__cols">
              <div className="axr-form__row">
                <label>{copy.tStudent}</label>
                <input value={editar.student} disabled readOnly />
              </div>
              <div className="axr-form__row">
                <label>{copy.tModule}</label>
                <input value={editar.module} disabled readOnly />
              </div>
            </div>
          ) : (
            <>
              <div className="axr-form__row">
                <label htmlFor="asg-student">{copy.tStudent}</label>
                <select id="asg-student" name="student_id" required defaultValue="">
                  <option value="" disabled>
                    {copy.tSelectStudent}
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                      {s.hint ? ` · ${s.hint}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="axr-form__row">
                <label htmlFor="asg-module">{copy.tModule}</label>
                <select id="asg-module" name="module_id" required defaultValue="">
                  <option value="" disabled>
                    {copy.tSelectModule}
                  </option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.hint ? `${m.hint} · ` : ""}
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="axr-form__row">
            <label htmlFor="asg-due">{copy.tDue}</label>
            <input id="asg-due" name="due_date" type="date" defaultValue={editar?.due_date ?? ""} />
            <small>{copy.tDueHint}</small>
          </div>
          <div className="axr-form__row">
            <label htmlFor="asg-note">{copy.tNote}</label>
            <textarea id="asg-note" name="note" rows={3} placeholder={copy.tNotePh} defaultValue={editar?.note ?? ""} maxLength={2000} />
          </div>
          <div className="axr-form__actions">
            <button type="button" className="axr-btn axr-btn--ghost" onClick={cerrar}>
              {copy.cancel}
            </button>
            <button type="submit" className="axr-btn" disabled={pending}>
              {editar ? (pending ? copy.saving : copy.save) : pending ? copy.tSubmitting : copy.tSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
