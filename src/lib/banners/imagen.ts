import "server-only";

import OpenAI from "openai";

import { resolveAi } from "@/lib/ai/settings";
import { costeUsd, type Calidad } from "@/lib/banners/costes";
import type { Gasto } from "@/lib/banners/generar";
import { mensajeError } from "@/lib/banners/generar";
import { ESTILO_IMAGEN } from "@/lib/banners/marca";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  La foto de fondo
//
//  Una imagen vertical (1024×1536) por variante. De ella salen los tres
//  formatos recortando al centro: por eso la escena se pide con el sujeto en
//  el cuadrado central. Una imagen por variante y no una por formato: cuesta
//  un tercio y las tres piezas de la variante son, de verdad, la misma.
//
//  La imagen NUNCA lleva texto: los modelos de imagen escriben mal, y peor en
//  español. El texto lo compone render.tsx encima, con la tipografía de marca.
//
//  Modelos: el de OPENAI_IMAGE_MODEL o, si no, el mejor que acepte la clave.
//  Una clave sin acceso a uno pasa al siguiente en vez de fallar.
// ══════════════════════════════════════════════════════════

export const BUCKET = "ad-banners";

const MODELOS = [process.env.OPENAI_IMAGE_MODEL?.trim(), "gpt-image-2", "gpt-image-1.5", "gpt-image-1"].filter(
  (m, i, a): m is string => Boolean(m) && a.indexOf(m) === i,
);

/** Errores que significan «este modelo no», no «esta petición no». */
const otroModelo = (status?: number, msg = "") =>
  status === 404 || (status === 400 && /model/i.test(msg) && !/safety|moderation|content/i.test(msg)) || (status === 403 && /model/i.test(msg));

export type ImagenGenerada = { path: string; prompt: string; gasto: Gasto };

export type TamanoImagen = "1024x1024" | "1536x1024" | "1024x1536";

/**
 * También la usan las publicaciones (lib/social/medios.ts), con su bucket,
 * su tamaño y su dirección visual; por defecto, lo de los banners.
 */
export async function generarImagen(
  escena: string,
  destino: string,
  calidad: Calidad = "medium",
  opts: { bucket?: string; size?: TamanoImagen; estilo?: string } = {},
): Promise<{ ok: true; imagen: ImagenGenerada } | { ok: false; error: string }> {
  const cfg = await resolveAi();
  if (!cfg) return { ok: false, error: "Falta la clave de OpenAI: configúrala en el panel → IA." };
  const client = new OpenAI({ apiKey: cfg.key });

  const prompt = `${escena.trim()}\n\n${opts.estilo ?? ESTILO_IMAGEN}`;
  let ultimo = "";

  for (const model of MODELOS) {
    try {
      const res = await client.images.generate({
        model,
        prompt,
        size: opts.size ?? "1024x1536",
        quality: calidad,
        output_format: "jpeg",
        output_compression: 88,
        n: 1,
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) return { ok: false, error: "OpenAI no ha devuelto ninguna imagen." };

      const { error } = await createAdminClient()
        .storage.from(opts.bucket ?? BUCKET)
        .upload(destino, Buffer.from(b64, "base64"), { contentType: "image/jpeg", upsert: true });
      if (error) return { ok: false, error: `No se pudo guardar la imagen: ${error.message}` };

      const input = res.usage?.input_tokens ?? 0;
      const output = res.usage?.output_tokens ?? 0;
      return { ok: true, imagen: { path: destino, prompt, gasto: { model, input, output, usd: costeUsd(model, input, output) } } };
    } catch (e) {
      const err = e as { status?: number; message?: string };
      ultimo = err.message ?? "";
      if (otroModelo(err.status, ultimo)) continue;
      if (err.status === 400 && /safety|moderation|content/i.test(ultimo)) {
        return { ok: false, error: "OpenAI ha rechazado la escena por sus normas de contenido. Cambia la descripción de la imagen." };
      }
      return { ok: false, error: mensajeError(err) };
    }
  }
  return { ok: false, error: `Esta clave no tiene acceso a ningún modelo de imagen (${MODELOS.join(", ")}). ${ultimo}`.trim() };
}

/** La imagen como data URL, para componer la pieza. null si no está. */
export async function leerImagen(path: string): Promise<string | null> {
  const { data, error } = await createAdminClient().storage.from(BUCKET).download(path);
  if (error || !data) return null;
  const buf = Buffer.from(await data.arrayBuffer());
  return `data:${data.type || "image/jpeg"};base64,${buf.toString("base64")}`;
}

export async function borrarImagen(path: string | null | undefined) {
  if (path) await createAdminClient().storage.from(BUCKET).remove([path]);
}
