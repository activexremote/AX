import "server-only";

import OpenAI from "openai";

import { createAdminClient } from "@/lib/supabase/admin";
import type { SocialSettings } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Las claves de las publicaciones
//
//  DeepSeek escribe; Upload-Post publicará en X y LinkedIn. Las dos claves
//  viven en `social_settings` y se editan en /admin/publicaciones/ajustes,
//  con el entorno (DEEPSEEK_API_KEY, UPLOADPOST_API_KEY) de respaldo, igual
//  que la de OpenAI en lib/ai/settings.ts.
//
//  DeepSeek habla el mismo protocolo que OpenAI: el cliente es el mismo SDK
//  con otra URL. Por eso no hay dependencia nueva.
//
//  ⚠︎ `server-only`: el panel recibe `publicSocialSettings`, que no lleva
//  ninguna clave.
// ══════════════════════════════════════════════════════════

export const DEEPSEEK_URL = "https://api.deepseek.com";
/** El modelo barato y rápido. `deepseek-v4-pro` escribe mejor y cuesta ~4×. */
export const DEEPSEEK_MODELO = "deepseek-flash";

export type PublicSocialSettings = {
  deepseekModel: string;
  deepseekHint: string | null;
  deepseekSource: "panel" | "entorno" | "ninguna";
  uploadpostHint: string | null;
  uploadpostUser: string;
  lastTestOk: boolean | null;
  lastTestAt: string | null;
  lastTestDetail: string | null;
};

async function readRow(): Promise<SocialSettings | null> {
  const { data } = await createAdminClient()
    .from("social_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  return (data as SocialSettings | null) ?? null;
}

export async function deepseekClient(): Promise<{ client: OpenAI; model: string } | null> {
  const row = await readRow();
  const key = (row?.deepseek_api_key || process.env.DEEPSEEK_API_KEY || "").trim();
  if (!key) return null;
  return {
    client: new OpenAI({ apiKey: key, baseURL: DEEPSEEK_URL }),
    model: (row?.deepseek_model || DEEPSEEK_MODELO).trim(),
  };
}

export async function deepseekConfigured(): Promise<boolean> {
  return Boolean(await deepseekClient());
}

export async function publicSocialSettings(): Promise<PublicSocialSettings> {
  const row = await readRow();
  const propia = (row?.deepseek_api_key || "").trim();
  const entorno = (process.env.DEEPSEEK_API_KEY || "").trim();
  const usada = propia || entorno;
  const up = (row?.uploadpost_api_key || process.env.UPLOADPOST_API_KEY || "").trim();

  return {
    deepseekModel: row?.deepseek_model || DEEPSEEK_MODELO,
    deepseekHint: usada ? `…${usada.slice(-4)}` : null,
    deepseekSource: propia ? "panel" : entorno ? "entorno" : "ninguna",
    uploadpostHint: up ? `…${up.slice(-4)}` : null,
    uploadpostUser: row?.uploadpost_user ?? "",
    lastTestOk: row?.last_test_ok ?? null,
    lastTestAt: row?.last_test_at ?? null,
    lastTestDetail: row?.last_test_detail ?? null,
  };
}

/**
 * Prueba la clave contra DeepSeek. La lista de modelos no gasta tokens y
 * distingue una clave mal copiada (401) de una sin saldo (402).
 */
export async function testDeepseekKey(): Promise<{ ok: boolean; detail: string }> {
  const cfg = await deepseekClient();
  if (!cfg) return { ok: false, detail: "No hay clave de DeepSeek configurada." };

  try {
    const modelos = await cfg.client.models.list();
    const existe = modelos.data.some((m) => m.id === cfg.model);
    return {
      ok: true,
      detail: existe
        ? `Conectado. El modelo ${cfg.model} está disponible.`
        : `Conectado, pero DeepSeek no ofrece el modelo ${cfg.model}. Disponibles: ${modelos.data.map((m) => m.id).join(", ")}.`,
    };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    const porEstado: Record<number, string> = {
      401: "La clave no es válida o ha sido revocada.",
      402: "La clave es válida pero la cuenta no tiene saldo.",
      429: "Demasiadas peticiones: prueba en un minuto.",
    };
    return { ok: false, detail: porEstado[err.status ?? 0] ?? `No se pudo conectar: ${err.message ?? "error desconocido"}` };
  }
}
