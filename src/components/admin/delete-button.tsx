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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const deleteLabel = label ?? t.admin.delete;
  const confirm = confirmLabel ?? t.admin.confirmDelete;
  const tam = small ? " axr-btn--small" : "";

  const aviso = error ? (
    <span role="alert" className="axr-delete-error">
      {error}
    </span>
  ) : null;

  if (!armed) {
    return (
      <span className="axr-delete-wrap">
        <button type="button" className={`axr-btn axr-btn--ghost axr-btn--delete${tam}`} onClick={() => { setError(null); setArmed(true); }}>
          {deleteLabel}
        </button>
        {aviso}
      </span>
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
            const r = await action();
            // Si la acción dice por qué no ha podido, se enseña aquí.
            if (r && "error" in r && r.error) setError(r.error);
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
