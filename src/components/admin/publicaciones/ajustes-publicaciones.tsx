"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { guardarAjustes, probarDeepseek } from "@/app/admin/publicaciones/actions";
import type { PubCopy } from "@/lib/i18n/publicaciones";
import type { PublicSocialSettings } from "@/lib/social/settings";

// Las claves NUNCA llegan aquí: sólo sus cuatro últimos caracteres. Un campo
// vacío al guardar significa «déjala como está» (ver admin/ia).

const MODELOS = ["deepseek-flash", "deepseek-v4-pro"];

export function AjustesPublicaciones({ settings, copy, locale }: { settings: PublicSocialSettings; copy: PubCopy; locale: string }) {
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
      const r = await guardarAjustes(formData);
      if (r.error) setError(r.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  function handleTest() {
    setTest(null);
    startTransition(async () => {
      const r = await probarDeepseek();
      setTest((r.ok ? "✓ " : "✕ ") + r.detail);
      router.refresh();
    });
  }

  const estado =
    settings.deepseekSource === "panel"
      ? `${copy.sKeySaved}: ${settings.deepseekHint}`
      : settings.deepseekSource === "entorno"
        ? `${copy.sKeyFromEnv} (${settings.deepseekHint})`
        : copy.sKeyNone;

  return (
    <form action={handleSave} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}
      {saved ? <div className="axr-login__ok">{copy.sSaved}</div> : null}

      <div className="axr-admin-card">
        <h2>{copy.sDeepseek}</h2>
        <div className="axr-form">
          <div className="axr-form__row">
            <label htmlFor="deepseek_api_key">{copy.sKey}</label>
            <input id="deepseek_api_key" name="deepseek_api_key" type="password" autoComplete="off" spellCheck={false} placeholder={copy.sKeyPlaceholder} />
            <small>
              {estado} · {copy.sKeyHint}
            </small>
          </div>
          {settings.deepseekSource === "panel" ? (
            <div className="axr-form__row">
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="checkbox" name="clear_deepseek" style={{ width: "auto" }} />
                {copy.sClear}
              </label>
            </div>
          ) : null}
          <div className="axr-form__row">
            <label htmlFor="deepseek_model">{copy.sModel}</label>
            <input id="deepseek_model" name="deepseek_model" list="axr-ds-models" defaultValue={settings.deepseekModel} spellCheck={false} />
            <datalist id="axr-ds-models">
              {MODELOS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
            <small>{copy.sModelHint}</small>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="axr-btn axr-btn--ghost" onClick={handleTest} disabled={pending}>
              {pending ? copy.sTesting : copy.sTest}
            </button>
            {test ? <span style={{ fontSize: "0.8125rem" }}>{test}</span> : null}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)", margin: 0 }}>
            {copy.sLastTest}:{" "}
            {settings.lastTestAt
              ? `${new Date(settings.lastTestAt).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })} · ${settings.lastTestOk ? "✓" : "✕"} ${settings.lastTestDetail ?? ""}`
              : copy.sNever}
          </p>
        </div>
      </div>

      <div className="axr-admin-card">
        <h2>{copy.sUploadpost}</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--axr-text-helper)", marginTop: 0 }}>{copy.sUploadpostHint}</p>
        <div className="axr-form">
          <div className="axr-form__row">
            <label htmlFor="uploadpost_api_key">{copy.sUpKey}</label>
            <input id="uploadpost_api_key" name="uploadpost_api_key" type="password" autoComplete="off" spellCheck={false} />
            <small>{settings.uploadpostHint ? `${copy.sUpSaved}: ${settings.uploadpostHint}` : copy.sKeyNone}</small>
          </div>
          {settings.uploadpostHint ? (
            <div className="axr-form__row">
              <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="checkbox" name="clear_uploadpost" style={{ width: "auto" }} />
                {copy.sUpClear}
              </label>
            </div>
          ) : null}
          <div className="axr-form__row">
            <label htmlFor="uploadpost_user">{copy.sUpUser}</label>
            <input id="uploadpost_user" name="uploadpost_user" defaultValue={settings.uploadpostUser} spellCheck={false} />
            <small>{copy.sUpUserHint}</small>
          </div>
        </div>
      </div>

      <div className="axr-form__actions">
        <button type="submit" className="axr-btn" disabled={pending}>
          {pending ? copy.sSaving : copy.sSave}
        </button>
      </div>
    </form>
  );
}
