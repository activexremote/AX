"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { exportMyProgressJson, resetMyProgress } from "@/app/(campus)/mi-progreso/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { campusV2CCopy } from "@/lib/i18n/campus-v2-c";
import { useI18n } from "@/lib/i18n/provider";

// Descargar el progreso y empezar de cero. Lo segundo borra de verdad, así
// que pide confirmación en la propia tarjeta, explicando qué se pierde (sin
// el diálogo del navegador).
export function ProgressActionsBar() {
  const { t, locale } = useI18n();
  const copy = campusV2CCopy[locale];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmReset, setConfirmReset] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

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
    setAviso(copy.pExported);
    setTimeout(() => setAviso(null), 2500);
  }

  return (
    <div className="axr-mp__actions">
      {confirmReset ? (
        <div className="axr-mp__confirm" role="alertdialog" aria-label={copy.pResetTitle}>
          <strong>{copy.pResetTitle}</strong>
          <span>{copy.pResetBody}</span>
          <div>
            <button
              type="button"
              className="axr-btn axr-btn--danger axr-btn--small"
              onClick={() =>
                startTransition(async () => {
                  await resetMyProgress();
                  setConfirmReset(false);
                  setAviso(copy.pResetDone);
                  router.refresh();
                })
              }
              disabled={pending}
            >
              {t.progress.confirmYes}
            </button>
            <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setConfirmReset(false)} disabled={pending}>
              {t.progress.cancel}
            </button>
          </div>
        </div>
      ) : (
        <div className="axr-mp__buttons">
          <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => startTransition(handleExport)} disabled={pending}>
            <Icono n="descarga" size={14} /> {t.progress.exportJson}
          </button>
          <button type="button" className="axr-btn axr-btn--ghost axr-btn--small axr-mp__danger" onClick={() => setConfirmReset(true)}>
            <Icono n="papelera" size={14} /> {t.progress.reset}
          </button>
        </div>
      )}
      {aviso ? (
        <p className="axr-c-note axr-c-note--ok" role="status">
          <Icono n="ok" size={14} /> {aviso}
        </p>
      ) : null}
    </div>
  );
}
