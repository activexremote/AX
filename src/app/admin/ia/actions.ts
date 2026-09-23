"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { testAiKey } from "@/lib/ai/settings";

// ══════════════════════════════════════════════════════════
//  La configuración de IA — SÓLO ADMINISTRADORES
//
//  Un profesor usa la IA, pero no toca la clave ni la ve: es la cuenta de la
//  escuela y quien la paga es quien la administra. Misma forma que las
//  acciones de Slack (admin/slack/actions.ts).
// ══════════════════════════════════════════════════════════

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return user.id;
}

export async function saveAiSettings(formData: FormData) {
  const userId = await assertAdmin();
  const admin = createAdminClient();

  const clave = ((formData.get("openai_api_key") as string) || "").trim();
  const borrar = formData.get("clear_key") === "on";

  const cambios: Record<string, unknown> = {
    enabled: formData.get("enabled") === "on",
    model: ((formData.get("model") as string) || "").trim() || "gpt-4o",
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };

  // El campo llega vacío cuando ya hay clave guardada: el formulario nunca la
  // recibe, así que un envío en blanco significa «déjala como está», no
  // «bórrala». Para borrarla hay una casilla aparte.
  if (borrar) cambios.openai_api_key = null;
  else if (clave) cambios.openai_api_key = clave;

  // Una clave nueva invalida el resultado del último test.
  if (borrar || clave) {
    cambios.last_test_ok = null;
    cambios.last_test_at = null;
    cambios.last_test_detail = null;
  }

  const { error } = await admin.from("ai_settings").update(cambios).eq("id", "default");
  if (error) return { error: error.message };

  revalidatePath("/admin/ia");
  return { ok: true };
}

/** Prueba la clave contra OpenAI y deja el resultado guardado. */
export async function testAiConnection() {
  await assertAdmin();

  const resultado = await testAiKey();

  await createAdminClient()
    .from("ai_settings")
    .update({
      last_test_ok: resultado.ok,
      last_test_at: new Date().toISOString(),
      last_test_detail: resultado.detail,
    })
    .eq("id", "default");

  revalidatePath("/admin/ia");
  return resultado;
}
