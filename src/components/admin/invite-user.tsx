"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { inviteUser } from "@/app/admin/usuarios/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { useI18n } from "@/lib/i18n/provider";

/** «Crear usuario»: botón y ventana con nombre, email y rol. Sin contraseña. */
export function InviteUserButton({ copy }: { copy: AdminV2BCopy }) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

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
      <button type="button" className="axr-btn" onClick={() => setOpen(true)}>
        <Icono n="mas" /> {copy.uNew}
      </button>
    );
  }

  return (
    <div className="axr-modal" role="dialog" aria-modal="true" aria-label={copy.uNew} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="axr-modal__panel">
        <h2>{copy.uNew}</h2>
        <form action={handle} className="axr-form">
          {error ? <div className="axr-al-error">{error}</div> : null}
          <div className="axr-form__row">
            <label htmlFor="inv-name">{copy.uName}</label>
            <input id="inv-name" name="full_name" autoComplete="off" />
          </div>
          <div className="axr-form__row">
            <label htmlFor="inv-email">{copy.uEmail}</label>
            <input id="inv-email" name="email" type="email" required autoComplete="off" />
            <small>{copy.uNoPassword}</small>
          </div>
          <div className="axr-form__row">
            <label htmlFor="inv-role">{copy.uRole}</label>
            <select id="inv-role" name="role" defaultValue="alumno">
              <option value="alumno">{t.common.role_alumno}</option>
              <option value="profesor">{t.common.role_profesor}</option>
              <option value="administrador">{t.common.role_administrador}</option>
            </select>
          </div>
          <div className="axr-form__actions">
            <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setOpen(false)}>
              {copy.cancel}
            </button>
            <button type="submit" className="axr-btn" disabled={pending}>
              {pending ? copy.uCreating : copy.uNew}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
