"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveSlackSettings, testSlackConnection } from "@/app/admin/slack/actions";
import { SLACK_EVENTS, SLACK_EVENT_KEYS } from "@/lib/slack/events";
import { useI18n } from "@/lib/i18n/provider";
import type { SlackSettings } from "@/lib/slack/notify";

export function SlackConfig({ settings }: { settings: SlackSettings }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<string | null>(null);

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
    setTestMsg(null);
    startTransition(async () => {
      const r = await testSlackConnection();
      setTestMsg((r.ok ? "✓ " : "✕ ") + (r.detail ?? r.error ?? ""));
      router.refresh();
    });
  }

  const disabled = new Set(settings.disabled_events ?? []);

  return (
    <form action={handleSave} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}
      {saved ? <div className="axr-login__ok">{t.slack.configSaved}</div> : null}

      <div className="axr-form__row">
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="enabled" defaultChecked={settings.enabled} style={{ width: "auto" }} />
          {t.slack.enabledLabel}
        </label>
      </div>

      <div className="axr-form__row">
        <label>{t.slack.botTokenLabel}</label>
        <input
          name="bot_token"
          type="password"
          defaultValue={settings.bot_token ?? ""}
          placeholder="xoxb-..."
          autoComplete="off"
        />
      </div>

      {settings.last_test_at ? (
        <p style={{ fontSize: "0.75rem", margin: 0, color: settings.last_test_ok ? "var(--axr-green-70)" : "#da1e28" }}>
          {t.slack.lastTest}: {settings.last_test_detail} ({new Date(settings.last_test_at).toLocaleString(locale)})
        </p>
      ) : null}

      <h3 style={{ fontSize: "0.875rem", margin: "0.5rem 0 0" }}>{t.slack.channelsTitle}</h3>
      <p style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)", margin: 0 }}>
        {t.slack.channelsHint}
      </p>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{t.slack.channelGeneral}</label>
          <input name="channel_general" defaultValue={settings.channel_general ?? ""} placeholder="#axr-campus" />
        </div>
        <div className="axr-form__row">
          <label>{t.slack.channelStudents}</label>
          <input name="channel_alumnos" defaultValue={settings.channel_alumnos ?? ""} placeholder="#axr-alumnos" />
        </div>
        <div className="axr-form__row">
          <label>{t.slack.channelTeachers}</label>
          <input name="channel_profesores" defaultValue={settings.channel_profesores ?? ""} placeholder="#axr-profesores" />
        </div>
        <div className="axr-form__row">
          <label>{t.slack.channelAdmin}</label>
          <input name="channel_admin" defaultValue={settings.channel_admin ?? ""} placeholder="#axr-admin" />
        </div>
      </div>

      <div className="axr-form__row">
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="dm_enabled" defaultChecked={settings.dm_enabled} style={{ width: "auto" }} />
          {t.slack.dmLabel}
        </label>
      </div>

      <h3 style={{ fontSize: "0.875rem", margin: "0.5rem 0 0" }}>{t.slack.eventsTitle}</h3>
      <div className="axr-slack-events">
        {SLACK_EVENT_KEYS.map((key) => {
          const ev = SLACK_EVENTS[key];
          const text = t.slackEvents[key];
          return (
            <label key={key} className="axr-slack-event">
              <input type="checkbox" name={`event:${key}`} defaultChecked={!disabled.has(key)} />
              <span>
                <strong>{ev.emoji} {text.label}</strong>
                <span className="axr-slack-event__desc">{text.description}</span>
                <span className="axr-slack-event__tag">
                  {t.slack.eventChannelTag}: {ev.category}{ev.dm ? " + DM" : ""}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="axr-form__actions">
        <button type="button" className="axr-btn axr-btn--ghost" onClick={handleTest} disabled={pending}>
          {t.slack.testConnection}
        </button>
        <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
          {pending ? t.common.saving : t.slack.saveConfig}
        </button>
      </div>
      {testMsg ? <p style={{ fontSize: "0.8125rem", margin: 0 }}>{testMsg}</p> : null}
    </form>
  );
}
