"use client";

import { useState, useTransition } from "react";

import { exportMyProgressJson, resetMyProgress } from "@/app/(campus)/mi-progreso/actions";
import { useI18n } from "@/lib/i18n/provider";

export function ProgressActionsBar() {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleExport() {
    const data = await exportMyProgressJson();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activexremote-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="axr-progress-actions">
      <button
        type="button"
        className="axr-btn axr-btn--primary"
        onClick={() => startTransition(handleExport)}
        disabled={pending}
      >
        {t.progress.exportJson}
      </button>
      {confirmReset ? (
        <span className="axr-progress-actions__confirm">
          {t.progress.confirm}
          <button
            type="button"
            className="axr-btn axr-btn--danger"
            onClick={() =>
              startTransition(async () => {
                await resetMyProgress();
                setConfirmReset(false);
              })
            }
            disabled={pending}
          >
            {t.progress.confirmYes}
          </button>
          <button
            type="button"
            className="axr-btn axr-btn--ghost"
            onClick={() => setConfirmReset(false)}
          >
            {t.progress.cancel}
          </button>
        </span>
      ) : (
        <button
          type="button"
          className="axr-btn axr-btn--danger"
          onClick={() => setConfirmReset(true)}
        >
          {t.progress.reset}
        </button>
      )}
    </div>
  );
}
