import "server-only";

import OpenAI from "openai";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AiSettings } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  La clave de OpenAI
//
//  Dos sitios, y en este orden:
//
//   1. La fila de `ai_settings`, que se edita en /admin/ia. Es la que usa la
//      escuela: se cambia sin tocar código ni volver a desplegar.
//   2. `OPENAI_API_KEY` del entorno, que ya existía para el corrector de
//      misiones. Sirve de respaldo y para desarrollo local.
//
//  ⚠︎ Este módulo es `server-only`: si alguien lo importa desde un componente
//  del navegador, la compilación falla en vez de mandar la clave al cliente.
//  Para pintar la configuración en el panel está `publicAiSettings`, que
//  devuelve lo que se puede enseñar y nada más.
//
//  Y el campus entero funciona sin clave: sin ella no aparece el botón de
//  estructurar con IA y el profesor escribe los bloques a mano, igual que
//  sin Fish Audio no hay narración pero la lección se publica.
// ══════════════════════════════════════════════════════════

/** Modelo por defecto. Se cambia desde el panel, sin tocar código. */
export const MODELO_POR_DEFECTO = "gpt-4o";

/** Lo que se puede enseñar en el panel: ni la clave ni parte de ella sirve. */
export type PublicAiSettings = {
  enabled: boolean;
  model: string;
  /** Para que el admin reconozca cuál puso, sin poder reconstruirla: "…a91f". */
  keyHint: string | null;
  /** De dónde sale la clave que se está usando. */
  source: "panel" | "entorno" | "ninguna";
  lastTestOk: boolean | null;
  lastTestAt: string | null;
  lastTestDetail: string | null;
};

async function readRow(): Promise<AiSettings | null> {
  // Service role: la tabla sólo la ve un administrador por RLS, y esta
  // función también la llaman acciones de profesor (que usan la IA sin ver
  // la clave).
  const { data } = await createAdminClient()
    .from("ai_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  return (data as AiSettings | null) ?? null;
}

/** La clave y el modelo que toca usar ahora mismo. */
export async function resolveAi(): Promise<{ key: string; model: string } | null> {
  const row = await readRow();
  if (row && row.enabled === false) return null;

  const key = (row?.openai_api_key || process.env.OPENAI_API_KEY || "").trim();
  if (!key) return null;

  return { key, model: (row?.model || process.env.OPENAI_REVIEW_MODEL || MODELO_POR_DEFECTO).trim() };
}

/** ¿Se puede llamar a la IA? Lo usan las páginas para enseñar o no el botón. */
export async function aiConfigured(): Promise<boolean> {
  return Boolean(await resolveAi());
}

/** Un cliente de OpenAI ya configurado, o null si no hay clave. */
export async function openaiClient(): Promise<{ client: OpenAI; model: string } | null> {
  const cfg = await resolveAi();
  if (!cfg) return null;
  return { client: new OpenAI({ apiKey: cfg.key }), model: cfg.model };
}

export async function publicAiSettings(): Promise<PublicAiSettings> {
  const row = await readRow();
  const propia = (row?.openai_api_key || "").trim();
  const entorno = (process.env.OPENAI_API_KEY || "").trim();
  const usada = propia || entorno;

  return {
    enabled: row?.enabled ?? true,
    model: row?.model || MODELO_POR_DEFECTO,
    keyHint: usada ? `…${usada.slice(-4)}` : null,
    source: propia ? "panel" : entorno ? "entorno" : "ninguna",
    lastTestOk: row?.last_test_ok ?? null,
    lastTestAt: row?.last_test_at ?? null,
    lastTestDetail: row?.last_test_detail ?? null,
  };
}

/**
 * Prueba la clave contra OpenAI de verdad.
 *
 * Se pide la lista de modelos porque no gasta tokens y falla distinto según
 * el problema: una clave mal copiada da 401 y una clave buena sin saldo da
 * 429. Decirlo en pantalla ahorra media hora de búsqueda a ciegas.
 */
export async function testAiKey(): Promise<{ ok: boolean; detail: string }> {
  const cfg = await resolveAi();
  if (!cfg) return { ok: false, detail: "No hay clave configurada." };

  try {
    const client = new OpenAI({ apiKey: cfg.key });
    const modelos = await client.models.list();
    const existe = modelos.data.some((m) => m.id === cfg.model);
    return {
      ok: true,
      detail: existe
        ? `Conectado. El modelo ${cfg.model} está disponible.`
        : `Conectado, pero esta clave no ve el modelo ${cfg.model}. Elige otro.`,
    };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    const porEstado: Record<number, string> = {
      401: "La clave no es válida o ha sido revocada.",
      403: "La clave no tiene permiso para este uso.",
      429: "La clave es válida pero no tiene saldo o ha superado el límite.",
    };
    return { ok: false, detail: porEstado[err.status ?? 0] ?? `No se pudo conectar: ${err.message ?? "error desconocido"}` };
  }
}
