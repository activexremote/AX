"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/provider";

export function DeleteButton({
  action,
  label,
  confirmLabel,
}: {
  action: () => Promise<{ ok?: boolean; error?: string } | void>;
  label?: string;
  confirmLabel?: string;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const deleteLabel = label ?? t.admin.delete;
  const confirm = confirmLabel ?? t.admin.confirmDelete;

  if (!armed) {
    return (
      <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setArmed(true)}>
        {deleteLabel}
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.375rem" }}>
      <button
        type="button"
        className="axr-btn axr-btn--danger"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await action();
            router.refresh();
            setArmed(false);
          })
        }
      >
        {confirm}
      </button>
      <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setArmed(false)}>
        Cancelar
      </button>
    </span>
  );
}
