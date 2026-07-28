"use client";

import { useState } from "react";

import { ModuleForm } from "@/components/admin/module-form";
import { useI18n } from "@/lib/i18n/provider";

export function NewModuleButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" className="axr-btn axr-btn--primary" onClick={() => setOpen(true)}>
        + {t.admin.newModule}
      </button>
    );
  }

  return (
    <div className="axr-modal">
      <div className="axr-modal__panel">
        <h2>{t.admin.newModule}</h2>
        <ModuleForm onDone={() => setOpen(false)} />
      </div>
    </div>
  );
}
