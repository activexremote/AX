"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/provider";

export function DeleteButton({
  action,
  label,
  confirmLabel,
  small = false,
}: {
  action: () => Promise<{ ok?: boolean; error?: string } | void>;
  label?: string;
  confirmLabel?: string;
  /** Tamaño compacto, para las filas de una lista. */
  small?: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const deleteLabel = label ?? t.admin.delete;
  const confirm = confirmLabel ?? t.admin.confirmDelete;
  const tam = small ? " axr-btn--small" : "";

  if (!armed) {
    return (
      <button type="button" className={`axr-btn axr-btn--ghost axr-btn--delete${tam}`} onClick={() => setArmed(true)}>
        {deleteLabel}
      </button>
    );
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.375rem" }}>
      <button
        type="button"
        className={`axr-btn axr-btn--danger${tam}`}
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
      <button type="button" className={`axr-btn axr-btn--ghost${tam}`} onClick={() => setArmed(false)}>
        {t.common.cancel}
      </button>
    </span>
  );
}
