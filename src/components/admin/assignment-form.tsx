"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createAssignment } from "@/app/admin/tareas/actions";
import { useI18n } from "@/lib/i18n/provider";

type Option = { id: string; label: string };

export function AssignmentForm({
  students,
  modules,
}: {
  students: Option[];
  modules: Option[];
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await createAssignment(formData);
      if (r?.error) setError(r.error);
      else {
        router.refresh();
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button type="button" className="axr-btn axr-btn--primary" onClick={() => setOpen(true)}>
        + {t.admin.assignTask}
      </button>
    );
  }

  return (
    <div className="axr-modal">
      <div className="axr-modal__panel">
        <h2>{t.admin.assignTask}</h2>
        <form action={handle} className="axr-form">
          {error ? <div className="axr-login__error">{error}</div> : null}
          <div className="axr-form__row">
            <label>{t.adminForm.asgStudent}</label>
            <select name="student_id" required defaultValue="">
              <option value="" disabled>{t.adminForm.asgSelectStudent}</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.asgModule}</label>
            <select name="module_id" required defaultValue="">
              <option value="" disabled>{t.adminForm.asgSelectModule}</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.asgDue}</label>
            <input name="due_date" type="date" />
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.asgNote}</label>
            <textarea name="note" />
          </div>
          <div className="axr-form__actions">
            <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </button>
            <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
              {pending ? t.adminForm.asgSubmitting : t.adminForm.asgSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
