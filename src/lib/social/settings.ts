import "server-only";

import OpenAI from "openai";

import { parseRitmo, type Ritmo } from "@/lib/social/calendario";
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
  ritmo: Ritmo;
  /** ¿Alguien ha guardado ya los ajustes? Hasta entonces, el ritmo es el de serie. */
  ritmoGuardado: boolean;
  alertDays: number;
  monthlyQuota: number;
  minBalanceUsd: number;
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
    ritmo: parseRitmo(row?.cadence),
    ritmoGuardado: Boolean(row?.updated_by),
    alertDays: row?.alert_days ?? 14,
    monthlyQuota: row?.monthly_quota ?? 10,
    minBalanceUsd: Number(row?.min_balance_usd ?? 2),
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

/**
 * El saldo que queda en la cuenta de DeepSeek, en USD. null si no hay clave
 * o DeepSeek no contesta: el panel no se cae por no poder enseñarlo.
 */
export async function saldoDeepseek(): Promise<number | null> {
  const row = await readRow();
  const key = (row?.deepseek_api_key || process.env.DEEPSEEK_API_KEY || "").trim();
  if (!key) return null;
  try {
    const res = await fetch(`${DEEPSEEK_URL}/user/balance`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { balance_infos?: { currency: string; total_balance: string }[] };
    const usd = data.balance_infos?.find((b) => b.currency === "USD");
    return usd ? Number(usd.total_balance) : null;
  } catch {
    return null;
  }
}

// ── Las cuentas conectadas en Upload-Post ──────────────────

export type CuentaRed = {
  conectada: boolean;
  /** El nombre y el usuario tal como salen en la red: los usa la vista previa. */
  nombre: string | null;
  usuario: string | null;
  avatar: string | null;
  /** La red ha caducado el permiso: hay que volver a conectarla. */
  reautorizar: boolean;
};

export type Cuentas = { x: CuentaRed; linkedin: CuentaRed };

const SIN_CUENTA: CuentaRed = { conectada: false, nombre: null, usuario: null, avatar: null, reautorizar: false };

/**
 * Qué redes tiene conectadas el perfil de Upload-Post. Sin esto, el panel no
 * sabe si lo que se programa en LinkedIn va a poder salir. null si no hay
 * clave o Upload-Post no contesta: el panel no se cae por eso.
 */
export async function cuentasUploadPost(): Promise<Cuentas | null> {
  const row = await readRow();
  const key = (row?.uploadpost_api_key || process.env.UPLOADPOST_API_KEY || "").trim();
  if (!key) return null;
  try {
    const res = await fetch("https://api.upload-post.com/api/uploadposts/users", {
      headers: { Authorization: `Apikey ${key}` },
      signal: AbortSignal.timeout(5_000),
      // Cambia cuando alguien conecta una red, no a cada visita.
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    type Cuenta = { display_name?: string; handle?: string; username?: string; social_images?: string; reauth_required?: boolean };
    const data = (await res.json()) as { profiles?: { username: string; social_accounts?: Record<string, Cuenta | string | null> }[] };
    const usuario = row?.uploadpost_user || "default";
    const perfil = data.profiles?.find((p) => p.username === usuario) ?? data.profiles?.[0];
    const leer = (raw: Cuenta | string | null | undefined): CuentaRed => {
      if (!raw || typeof raw !== "object") return SIN_CUENTA;
      return {
        conectada: true,
        nombre: raw.display_name ?? null,
        usuario: raw.handle ?? raw.username ?? null,
        avatar: raw.social_images ?? null,
        reautorizar: Boolean(raw.reauth_required),
      };
    };
    return { x: leer(perfil?.social_accounts?.x), linkedin: leer(perfil?.social_accounts?.linkedin) };
  } catch {
    return null;
  }
}
