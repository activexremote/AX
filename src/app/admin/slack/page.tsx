import { redirect } from "next/navigation";

import { DigestTriggers } from "@/components/admin/digest-triggers";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { SlackConfig } from "@/components/admin/slack-config";
import { getCurrentProfile } from "@/lib/data/profile";
import { adminCCopy } from "@/lib/i18n/admin-v2-c";
import { getI18n } from "@/lib/i18n/server";
import { getSlackSettings } from "@/lib/slack/notify";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/ia/ia.scss";
import "./slack.scss";

// ══════════════════════════════════════════════════════════
//  Slack
//
//  Arriba, si funciona o no. Después, cómo conectarlo (sólo hace falta la
//  primera vez), la configuración en tres bloques, los envíos manuales y lo
//  último que se ha mandado.
//
//  Sólo administradores: la página lee la configuración con la clave de
//  servicio, así que el candado tiene que estar aquí y no sólo en el menú.
// ══════════════════════════════════════════════════════════

export default async function AdminSlackPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const [settings, { t, locale }] = await Promise.all([getSlackSettings(), getI18n()]);
  const c = adminCCopy[locale].slack;
  const { data: logs } = await createAdminClient()
    .from("notifications_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  const token = settings?.bot_token ?? "";
  // Lo que viaja al formulario: todo menos el token, del que sólo va el final.
  const publicos = settings
    ? (({ bot_token: _token, ...resto }) => ({ ...resto, tokenHint: token ? `…${token.slice(-4)}` : null }))(settings)
    : null;
  const estado: { tono: "ok" | "warn" | "bad" | "neutro"; label: string } = !token
    ? { tono: "bad", label: c.noToken }
    : !settings?.enabled
      ? { tono: "neutro", label: c.off }
      : settings.last_test_ok === null
        ? { tono: "warn", label: c.untested }
        : settings.last_test_ok
          ? { tono: "ok", label: c.connectedAs }
          : { tono: "bad", label: c.testFailed };

  const fecha = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
  const pasos = [t.slack.howStep1, t.slack.howStep2, t.slack.howStep3, t.slack.howStep4, t.slack.howStep5];

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.slackTitle}</h1>
          <p>{t.admin.slackSubtitle}</p>
        </div>
      </div>

      <section className={`axr-admin-card axr-ia-status axr-ia-status--${estado.tono}`}>
        <div className="axr-ia-status__main">
          <span className="axr-ia-status__icon" aria-hidden>
            <Icono n="almohadilla" size={20} />
          </span>
          <div>
            <small>{c.statusTitle}</small>
            <strong>{estado.label}</strong>
          </div>
        </div>
        <dl className="axr-ia-status__facts">
          <div>
            <dt>{c.integration}</dt>
            <dd>{settings?.enabled ? c.on : c.off}</dd>
          </div>
          <div>
            <dt>{t.slack.channelGeneral}</dt>
            <dd>{settings?.channel_general || "—"}</dd>
          </div>
          <div>
            <dt>{t.slack.lastTest}</dt>
            <dd>{settings?.last_test_at ? `${fecha(settings.last_test_at)} · ${settings.last_test_detail ?? ""}` : "—"}</dd>
          </div>
        </dl>
      </section>

      <details className="axr-admin-card axr-slack-steps" open={!token}>
        <summary>
          <h2>{c.stepsTitle}</h2>
        </summary>
        <ol>
          {pasos.map((p, i) => (
            <li key={p} className={token && i < 3 ? "is-done" : undefined}>
              <span aria-hidden>{token && i < 3 ? <Icono n="ok" size={14} /> : i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      </details>

      {publicos ? <SlackConfig settings={publicos} copy={c} /> : null}

      <section className="axr-admin-card">
        <h2>{c.digestsTitle}</h2>
        <p className="axr-slack-lead">{t.slack.digestsHint}</p>
        <DigestTriggers />
      </section>

      <section className="axr-admin-card axr-admin-card--flush">
        <h2 className="axr-slack-tabletitle">{c.logsTitle}</h2>
        {(logs ?? []).length ? (
          <div className="axr-admin-scroll">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{t.slack.colEvent}</th>
                  <th>{t.slack.colTarget}</th>
                  <th>{t.slack.colStatus}</th>
                  <th>{t.slack.colWhen}</th>
                </tr>
              </thead>
              <tbody>
                {(logs ?? []).map((l) => {
                  const st = String(l.status);
                  return (
                    <tr key={l.id as string}>
                      <td>{t.slackEvents[l.event as keyof typeof t.slackEvents]?.label ?? (l.event as string)}</td>
                      <td>
                        {(l.target as string) || "—"} <span className="axr-slack-muted">· {l.target_type === "dm" ? "DM" : c.channel}</span>
                      </td>
                      <td>
                        <span className={`axr-adm-pill axr-adm-pill--${st === "sent" ? "ok" : st === "failed" ? "bad" : "warn"}`}>{c.status[st] ?? st}</span>
                        {l.error ? <div className="axr-slack-error">{l.error as string}</div> : null}
                      </td>
                      <td>{fecha(l.created_at as string)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="axr-adm-empty">
            <Icono n="almohadilla" size={26} />
            <span>{t.slack.noNotifications}</span>
          </div>
        )}
      </section>
    </div>
  );
}
