import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { lookupUserByEmail, postMessage, type SlackBlock } from "@/lib/slack/client";
import { SLACK_EVENTS, type SlackCategory, type SlackEventKey } from "@/lib/slack/events";

export type SlackSettings = {
  id: string;
  enabled: boolean;
  bot_token: string | null;
  channel_general: string | null;
  channel_alumnos: string | null;
  channel_profesores: string | null;
  channel_admin: string | null;
  dm_enabled: boolean;
  disabled_events: string[];
  last_test_ok: boolean | null;
  last_test_at: string | null;
  last_test_detail: string | null;
};

export async function getSlackSettings(): Promise<SlackSettings | null> {
  const admin = createAdminClient();
  const { data } = await admin.from("slack_settings").select("*").eq("id", "default").maybeSingle();
  return (data as SlackSettings) ?? null;
}

function channelFor(settings: SlackSettings, category: SlackCategory): string | null {
  const map: Record<SlackCategory, string | null> = {
    alumnos: settings.channel_alumnos,
    profesores: settings.channel_profesores,
    admin: settings.channel_admin,
    general: settings.channel_general,
  };
  return map[category] || settings.channel_general || null;
}

export type NotifyInput = {
  event: SlackEventKey;
  title: string;
  lines?: string[];
  context?: string;
  /** Email del destinatario para mensaje directo, si el evento lo admite. */
  dmEmail?: string | null;
};

function buildBlocks(emoji: string, title: string, lines: string[], context: string): SlackBlock[] {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `${emoji} ${title}`.slice(0, 150), emoji: true },
    },
  ];
  if (lines.length) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: lines.join("\n") },
    });
  }
  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: context }],
  });
  return blocks;
}

type NotifyResult = { sent: number; skipped: boolean; reason?: string };

/**
 * Punto de entrada único para enviar notificaciones a Slack.
 * Nunca lanza: registra el resultado en notifications_log y degrada con elegancia.
 */
export async function notify(input: NotifyInput): Promise<NotifyResult> {
  const admin = createAdminClient();
  const def = SLACK_EVENTS[input.event];

  async function log(
    target: string | null,
    target_type: string,
    status: string,
    error?: string | null,
  ) {
    await admin.from("notifications_log").insert({
      event: input.event,
      target,
      target_type,
      title: input.title,
      status,
      error: error ?? null,
      payload: { lines: input.lines ?? [], context: input.context ?? null },
    });
  }

  try {
    const settings = await getSlackSettings();
    if (!settings || !settings.enabled || !settings.bot_token) {
      await log(null, "channel", "skipped", "slack_no_configurado");
      return { sent: 0, skipped: true, reason: "no_configurado" };
    }
    if (settings.disabled_events?.includes(input.event)) {
      await log(null, "channel", "skipped", "evento_desactivado");
      return { sent: 0, skipped: true, reason: "evento_desactivado" };
    }

    const token = settings.bot_token;
    const context = input.context ?? `ActiveXRemote Campus · ${def.label}`;
    const blocks = buildBlocks(def.emoji, input.title, input.lines ?? [], context);
    const fallback = `${def.emoji} ${input.title}`;

    const targets: { target: string; type: "channel" | "dm" }[] = [];

    const channel = channelFor(settings, def.category);
    if (channel) targets.push({ target: channel, type: "channel" });

    if (def.dm && settings.dm_enabled && input.dmEmail) {
      const userId = await lookupUserByEmail(token, input.dmEmail);
      if (userId) targets.push({ target: userId, type: "dm" });
    }

    if (targets.length === 0) {
      await log(null, "channel", "skipped", "sin_destino");
      return { sent: 0, skipped: true, reason: "sin_destino" };
    }

    let sent = 0;
    for (const t of targets) {
      const res = await postMessage(token, { channel: t.target, text: fallback, blocks });
      if (res.ok) {
        sent += 1;
        await log(t.target, t.type, "sent");
      } else {
        await log(t.target, t.type, "failed", res.error);
      }
    }
    return { sent, skipped: false };
  } catch (e) {
    await log(null, "channel", "failed", e instanceof Error ? e.message : "error");
    return { sent: 0, skipped: true, reason: "error" };
  }
}
