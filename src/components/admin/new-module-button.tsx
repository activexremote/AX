"use client";

import { useState } from "react";

import { ModuleForm } from "@/components/admin/module-form";
import { useI18n } from "@/lib/i18n/provider";

export function NewModuleButton({ abierto = false }: { abierto?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(abierto);

  if (!open) {
    return (
      <button type="button" className="axr-btn axr-btn--primary" onClick={() => setOpen(true)}>
        + {t.admin.newModule}
      </button>
    );
  }

  return (
    // Clic fuera del panel = cancelar.
    <div className="axr-modal" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="axr-modal__panel" role="dialog" aria-modal="true" aria-label={t.admin.newModule}>
        <h2>{t.admin.newModule}</h2>
        <ModuleForm onDone={() => setOpen(false)} />
      </div>
    </div>
  );
}
