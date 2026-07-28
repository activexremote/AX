"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { testAuth } from "@/lib/slack/client";
import { SLACK_EVENT_KEYS } from "@/lib/slack/events";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return user.id;
}

export async function saveSlackSettings(formData: FormData) {
  const userId = await assertAdmin();
  const admin = createAdminClient();

  const disabled = SLACK_EVENT_KEYS.filter(
    (key) => formData.get(`event:${key}`) !== "on",
  );

  const { error } = await admin
    .from("slack_settings")
    .update({
      enabled: formData.get("enabled") === "on",
      bot_token: ((formData.get("bot_token") as string) || "").trim() || null,
      channel_general: ((formData.get("channel_general") as string) || "").trim() || null,
      channel_alumnos: ((formData.get("channel_alumnos") as string) || "").trim() || null,
      channel_profesores: ((formData.get("channel_profesores") as string) || "").trim() || null,
      channel_admin: ((formData.get("channel_admin") as string) || "").trim() || null,
      dm_enabled: formData.get("dm_enabled") === "on",
      disabled_events: disabled,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    })
    .eq("id", "default");

  if (error) return { error: error.message };
  revalidatePath("/admin/slack");
  return { ok: true };
}

export async function testSlackConnection() {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: settings } = await admin
    .from("slack_settings")
    .select("bot_token")
    .eq("id", "default")
    .maybeSingle();

  const token = (settings?.bot_token as string) || "";
  if (!token) {
    return { ok: false, error: "No hay token configurado. Guarda el Bot Token primero." };
  }

  const result = await testAuth(token);
  const detail = result.ok
    ? `Conectado a "${result.team}" como @${result.botName}`
    : `Error: ${result.error}`;

  await admin
    .from("slack_settings")
    .update({
      last_test_ok: result.ok,
      last_test_at: new Date().toISOString(),
      last_test_detail: detail,
    })
    .eq("id", "default");

  revalidatePath("/admin/slack");
  return { ok: result.ok, detail };
}
