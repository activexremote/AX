"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveAiSettings, testAiConnection } from "@/app/admin/ia/actions";
import type { PublicAiSettings } from "@/lib/ai/settings";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  La clave de OpenAI, en el panel
//
//  El formulario NUNCA recibe la clave guardada: el servidor manda sólo los
//  cuatro últimos caracteres, y el campo va vacío. Por eso hay una casilla
//  aparte para borrarla: un envío con el campo en blanco significa «déjala
//  como está», que es lo que espera quien entra a cambiar el modelo.
// ══════════════════════════════════════════════════════════

/** Los modelos que tienen sentido para maquetar, de más fino a más barato. */
const MODELOS = ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"];

export function AiConfig({ settings, copy }: { settings: PublicAiSettings; copy: Copy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<string | null>(null);

  function handleSave(formData: FormData) {
    setError(null);
    setSaved(false);
    setTest(null);
    startTransition(async () => {
      const r = await saveAiSettings(formData);
      if (r?.error) setError(r.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  function handleTest() {
    setTest(null);
    startTransition(async () => {
      const r = await testAiConnection();
      setTest((r.ok ? "✓ " : "✕ ") + r.detail);
      router.refresh();
    });
  }

  const estadoClave =
    settings.source === "panel"
      ? `${copy.sKeySaved}: ${settings.keyHint}`
      : settings.source === "entorno"
        ? `${copy.sKeyFromEnv} (${settings.keyHint})`
        : copy.sKeyNone;

  return (
    <form action={handleSave} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}
      {saved ? <div className="axr-login__ok">{copy.sSaved}</div> : null}

      <div className="axr-form__row">
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="enabled" defaultChecked={settings.enabled} style={{ width: "auto" }} />
          {copy.sEnabled}
        </label>
        <small>{copy.sEnabledHint}</small>
      </div>

      <div className="axr-form__row">
        <label htmlFor="openai_api_key">{copy.sKey}</label>
        <input
          id="openai_api_key"
          name="openai_api_key"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={copy.sKeyPlaceholder}
        />
        <small>
          {estadoClave} · {copy.sKeyHint}
        </small>
      </div>

      {settings.source === "panel" ? (
        <div className="axr-form__row">
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input type="checkbox" name="clear_key" style={{ width: "auto" }} />
            {copy.sClear}
          </label>
        </div>
      ) : null}

      <div className="axr-form__row">
        <label htmlFor="model">{copy.sModel}</label>
        <input id="model" name="model" list="axr-ai-models" defaultValue={settings.model} spellCheck={false} />
        <datalist id="axr-ai-models">
          {MODELOS.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
        <small>{copy.sModelHint}</small>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
        <button type="submit" className="axr-btn" disabled={pending}>
          {pending ? copy.sSaving : copy.sSave}
        </button>
        <button type="button" className="axr-btn axr-btn--ghost" onClick={handleTest} disabled={pending}>
          {pending ? copy.sTesting : copy.sTest}
        </button>
        {test ? <span style={{ fontSize: "0.8125rem" }}>{test}</span> : null}
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)", marginBottom: 0 }}>
        {copy.sLastTest}:{" "}
        {settings.lastTestAt
          ? `${settings.lastTestOk ? "✓" : "✕"} ${settings.lastTestDetail ?? ""} (${new Date(settings.lastTestAt).toLocaleString()})`
          : copy.sNeverTested}
      </p>
    </form>
  );
}
