import { SlackConfig } from "@/components/admin/slack-config";
import { DigestTriggers } from "@/components/admin/digest-triggers";
import { getSlackSettings } from "@/lib/slack/notify";
import { createAdminClient } from "@/lib/supabase/admin";
import { getI18n } from "@/lib/i18n/server";

export default async function AdminSlackPage() {
  const settings = await getSlackSettings();
  const { t, locale } = await getI18n();
  const admin = createAdminClient();
  const { data: logs } = await admin
    .from("notifications_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.slackTitle}</h1>
          <p>{t.admin.slackSubtitle}</p>
        </div>
      </div>

      <div className="axr-admin-card">
        <h2>{t.slack.howToTitle}</h2>
        <ol style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8125rem", color: "var(--axr-text-secondary)", lineHeight: 1.7 }}>
          <li>{t.slack.howStep1}</li>
          <li>{t.slack.howStep2}</li>
          <li>{t.slack.howStep3}</li>
          <li>{t.slack.howStep4}</li>
          <li>{t.slack.howStep5}</li>
        </ol>
      </div>

      {settings ? (
        <div className="axr-admin-card">
          <h2>{t.slack.configTitle}</h2>
          <SlackConfig settings={settings} />
        </div>
      ) : null}

      <div className="axr-admin-card">
        <h2>{t.slack.digestsTitle}</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--axr-text-helper)", marginTop: 0 }}>
          {t.slack.digestsHint}
        </p>
        <DigestTriggers />
      </div>

      <div className="axr-admin-card">
        <h2>{t.slack.recentTitle}</h2>
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
            {(logs ?? []).length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>{t.slack.noNotifications}</td></tr>
            ) : null}
            {(logs ?? []).map((l) => (
              <tr key={l.id as string}>
                <td>{l.event as string}</td>
                <td>{(l.target as string) ?? "—"} <span style={{ color: "var(--axr-text-helper)" }}>({l.target_type as string})</span></td>
                <td>
                  <span className={`axr-status axr-status--${l.status === "sent" ? "completada" : l.status === "failed" ? "no_iniciada" : "en_curso"}`}>
                    {l.status as string}
                  </span>
                  {l.error ? <span style={{ fontSize: "0.6875rem", color: "#da1e28", marginLeft: "0.5rem" }}>{l.error as string}</span> : null}
                </td>
                <td>{new Date(l.created_at as string).toLocaleString(locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
