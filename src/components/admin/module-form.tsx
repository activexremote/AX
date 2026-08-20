"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createModule, updateModule } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { Module } from "@/lib/supabase/types";

const ICONS = ["Education", "Laptop", "Chat", "Time", "Collaborate", "Events", "GroupSecurity", "Favorite", "UserMultiple", "ChartLine"];

export function ModuleForm({ module, onDone }: { module?: Module; onDone?: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = module
        ? await updateModule(module.id, formData)
        : await createModule(formData);
      if (r?.error) setError(r.error);
      else {
        router.refresh();
        onDone?.();
      }
    });
  }

  return (
    <form action={handle} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.adminForm.fSlug}</label>
          <input name="slug" defaultValue={module?.slug} required placeholder="onboarding-general" />
        </div>
        <div className="axr-form__row">
          <label>{t.adminForm.fOrder}</label>
          <input name="order_index" type="number" defaultValue={module?.order_index ?? 0} />
        </div>
      </div>
      {/* Decide quién ve el módulo: la política de acceso de la base de datos
          filtra por esto contra las matrículas del alumno. */}
      <div className="axr-form__row">
        <label>{t.adminForm.fCourse}</label>
        <select name="course" defaultValue={module?.course ?? "core"}>
          <option value="core">{t.adminForm.courseCore}</option>
          <option value="remote-professional">{t.adminForm.courseProfessional}</option>
          <option value="remote-founder">{t.adminForm.courseFounder}</option>
        </select>
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fCode}</label>
        <input name="code" defaultValue={module?.code ?? ""} placeholder="MÓDULO 0 · ONBOARDING GENERAL" />
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fTitle}</label>
        <input name="title" defaultValue={module?.title} required />
      </div>
      <div className="axr-form__row">
        <label>{t.adminForm.fDescription}</label>
        <textarea name="description" defaultValue={module?.description ?? ""} />
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.adminForm.fIcon}</label>
          <select name="icon" defaultValue={module?.icon ?? "Education"}>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="axr-form__row">
          <label>{t.adminForm.fAccent}</label>
          <input name="accent" type="text" defaultValue={module?.accent ?? "#161616"} />
        </div>
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.adminForm.fMinutes}</label>
          <input name="estimated_minutes" type="number" defaultValue={module?.estimated_minutes ?? 0} />
        </div>
        <div className="axr-form__row" style={{ alignSelf: "end" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="checkbox" name="available" defaultChecked={module?.available ?? true} style={{ width: "auto" }} />
            {t.adminForm.fAvailable}
          </label>
        </div>
      </div>
      <div className="axr-form__actions">
        {onDone ? (
          <button type="button" className="axr-btn axr-btn--ghost" onClick={onDone}>{t.common.cancel}</button>
        ) : null}
        <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
          {pending
            ? t.common.saving
            : module
              ? t.adminForm.saveModule
              : t.adminForm.createModule}
        </button>
      </div>
    </form>
  );
}
