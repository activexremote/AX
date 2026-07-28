"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { inviteUser } from "@/app/admin/usuarios/actions";
import { useI18n } from "@/lib/i18n/provider";

export function InviteUserButton() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await inviteUser(formData);
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
        + {t.admin.newUser}
      </button>
    );
  }

  return (
    <div className="axr-modal">
      <div className="axr-modal__panel">
        <h2>{t.admin.newUser}</h2>
        <form action={handle} className="axr-form">
          {error ? <div className="axr-login__error">{error}</div> : null}
          <div className="axr-form__row">
            <label>{t.adminForm.invName}</label>
            <input name="full_name" />
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.invEmail}</label>
            <input name="email" type="email" required />
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.invPassword}</label>
            <input name="password" type="text" required minLength={6} />
          </div>
          <div className="axr-form__row">
            <label>{t.adminForm.invRole}</label>
            <select name="role" defaultValue="alumno">
              <option value="alumno">{t.common.role_alumno}</option>
              <option value="profesor">{t.common.role_profesor}</option>
              <option value="administrador">{t.common.role_administrador}</option>
            </select>
          </div>
          <div className="axr-form__actions">
            <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setOpen(false)}>
              {t.common.cancel}
            </button>
            <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
              {pending ? t.adminForm.invSubmitting : t.admin.newUser}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
