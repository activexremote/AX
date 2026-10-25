"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveSlackSettings, testSlackConnection } from "@/app/admin/slack/actions";
import type { AdminCCopy } from "@/lib/i18n/admin-v2-c";
import { SLACK_EVENTS, SLACK_EVENT_KEYS } from "@/lib/slack/events";
import { useI18n } from "@/lib/i18n/provider";
import type { SlackSettings } from "@/lib/slack/notify";

// ══════════════════════════════════════════════════════════
//  La configuración de Slack, en tres bloques: conexión, canales y avisos
//
//  ⚠︎ El token NO llega al navegador. Antes iba entero como valor del campo
//  (oculto con asteriscos, pero en el HTML): cualquiera con el panel abierto
//  podía copiarlo. Ahora el servidor manda sólo los cuatro últimos caracteres
//  y el campo va vacío: vacío significa «déjalo como está», igual que la
//  clave de OpenAI. Para quitarlo hay una casilla aparte.
// ══════════════════════════════════════════════════════════

export type SlackSettingsPublicos = Omit<SlackSettings, "bot_token"> & { tokenHint: string | null };

export function SlackConfig({ settings, copy }: { settings: SlackSettingsPublicos; copy: AdminCCopy["slack"] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSave(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const r = await saveSlackSettings(formData);
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
      const r = await testSlackConnection();
      setTest({ ok: r.ok, text: r.detail ?? r.error ?? "" });
      router.refresh();
    });
  }

  const disabled = new Set(settings.disabled_events ?? []);

  return (
    <form action={handleSave} className="axr-form axr-slack-form">
      {/* ── Conexión ── */}
      <section className="axr-admin-card">
        <h2>{copy.connectionTitle}</h2>
        <div className="axr-form">
          <label className="axr-ia-switch">
            <input type="checkbox" name="enabled" defaultChecked={settings.enabled} />
            <span className="axr-ia-switch__track" aria-hidden />
            <span>
              <strong>{t.slack.enabledLabel}</strong>
            </span>
          </label>

          <div className="axr-form__row">
            <label htmlFor="slack-token">{t.slack.botTokenLabel}</label>
            <input id="slack-token" name="bot_token" type="password" placeholder="xoxb-..." autoComplete="off" spellCheck={false} />
            <small>{settings.tokenHint ? copy.tokenSaved.replace("{hint}", settings.tokenHint) : copy.tokenNone}</small>
          </div>
          {settings.tokenHint ? (
            <label className="axr-ia-check">
              <input type="checkbox" name="clear_token" />
              {copy.tokenClear}
            </label>
          ) : null}

          <label className="axr-ia-switch">
            <input type="checkbox" name="dm_enabled" defaultChecked={settings.dm_enabled} />
            <span className="axr-ia-switch__track" aria-hidden />
            <span>
              <strong>{t.slack.dmLabel}</strong>
            </span>
          </label>

          {test ? <p className={`axr-adm-note axr-adm-note--${test.ok ? "ok" : "bad"}`}>{test.text}</p> : null}
          <div className="axr-form__actions" style={{ justifyContent: "flex-start" }}>
            <button type="button" className="axr-btn axr-btn--ghost" onClick={handleTest} disabled={pending}>
              {t.slack.testConnection}
            </button>
          </div>
        </div>
      </section>

      {/* ── Canales ── */}
      <section className="axr-admin-card">
        <h2>{copy.channelsTitle}</h2>
        <p className="axr-slack-lead">{t.slack.channelsHint}</p>
        <div className="axr-form__cols">
          <div className="axr-form__row">
            <label htmlFor="ch-general">{t.slack.channelGeneral}</label>
            <input id="ch-general" name="channel_general" defaultValue={settings.channel_general ?? ""} placeholder="#axr-campus" />
          </div>
          <div className="axr-form__row">
            <label htmlFor="ch-alumnos">{t.slack.channelStudents}</label>
            <input id="ch-alumnos" name="channel_alumnos" defaultValue={settings.channel_alumnos ?? ""} placeholder="#axr-alumnos" />
          </div>
          <div className="axr-form__row">
            <label htmlFor="ch-profes">{t.slack.channelTeachers}</label>
            <input id="ch-profes" name="channel_profesores" defaultValue={settings.channel_profesores ?? ""} placeholder="#axr-profesores" />
          </div>
          <div className="axr-form__row">
            <label htmlFor="ch-admin">{t.slack.channelAdmin}</label>
            <input id="ch-admin" name="channel_admin" defaultValue={settings.channel_admin ?? ""} placeholder="#axr-admin" />
          </div>
        </div>
      </section>

      {/* ── Avisos ── */}
      <section className="axr-admin-card">
        <h2>{copy.eventsTitle}</h2>
        <p className="axr-slack-lead">{copy.eventsHint}</p>
        <div className="axr-slack-events">
          {SLACK_EVENT_KEYS.map((key) => {
            const ev = SLACK_EVENTS[key];
            const text = t.slackEvents[key];
            return (
              <label key={key} className="axr-ia-switch">
                <input type="checkbox" name={`event:${key}`} defaultChecked={!disabled.has(key)} />
                <span className="axr-ia-switch__track" aria-hidden />
                <span>
                  <strong>
                    <span aria-hidden>{ev.emoji}</span> {text.label}
                  </strong>
                  <small>{text.description}</small>
                  <em>
                    #{ev.category}
                    {ev.dm ? " · DM" : ""}
                  </em>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="axr-slack-save">
        {error ? <div className="axr-adm-note axr-adm-note--bad">{error}</div> : null}
        {saved ? <div className="axr-adm-note axr-adm-note--ok">{t.slack.configSaved}</div> : null}
        <button type="submit" className="axr-btn" disabled={pending}>
          {pending ? t.common.saving : t.slack.saveConfig}
        </button>
      </div>
    </form>
  );
}
