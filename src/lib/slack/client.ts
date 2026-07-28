// Cliente de bajo nivel de la Web API de Slack.
// Toda la comunicación usa el Bot Token (xoxb-...) configurado por el admin.

const SLACK_API = "https://slack.com/api";

type SlackResponse = { ok: boolean; error?: string; [key: string]: unknown };

async function slackApi(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<SlackResponse> {
  try {
    const res = await fetch(`${SLACK_API}/${method}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as SlackResponse;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network_error" };
  }
}

export async function testAuth(token: string) {
  const r = await slackApi(token, "auth.test", {});
  return {
    ok: r.ok,
    team: typeof r.team === "string" ? r.team : null,
    botName: typeof r.user === "string" ? r.user : null,
    error: r.error ?? null,
  };
}

export async function lookupUserByEmail(token: string, email: string) {
  const r = await slackApi(token, "users.lookupByEmail", { email });
  if (!r.ok) return null;
  const user = r.user as { id?: string } | undefined;
  return user?.id ?? null;
}

export type SlackBlock = Record<string, unknown>;

export async function postMessage(
  token: string,
  args: { channel: string; text: string; blocks?: SlackBlock[] },
) {
  const r = await slackApi(token, "chat.postMessage", {
    channel: args.channel,
    text: args.text,
    blocks: args.blocks,
  });
  return { ok: r.ok, error: r.error ?? null, ts: r.ts ?? null };
}
