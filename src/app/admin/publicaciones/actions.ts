"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { CANALES, parseBody, revisar, slugify } from "@/lib/social/canales";
import { leerFuente } from "@/lib/social/fuente";
import { generar } from "@/lib/social/generar";
import { testDeepseekKey } from "@/lib/social/settings";
import type { SocialChannel, SocialImage, SocialPost, SocialVariant } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Publicaciones — SÓLO ADMINISTRADORES
//
//  Publicar en nombre de la escuela es hablar por ella. Las tablas ya están
//  cerradas por RLS (migración 0018); esto lo comprueba antes de gastar una
//  llamada a DeepSeek o subir una imagen.
// ══════════════════════════════════════════════════════════

const BUCKET = "social-media";
/** X admite 4 imágenes por post; con más no se puede publicar en todos. */
const MAX_IMAGENES = 4;
const MAX_BYTES = 5 * 1024 * 1024;
const TIPOS = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return { supabase, userId: user.id };
}

type Supabase = Awaited<ReturnType<typeof assertAdmin>>["supabase"];

function canalesDe(formData: FormData): SocialChannel[] {
  const marcados = formData.getAll("channels").map(String);
  return CANALES.filter((c) => marcados.includes(c));
}

async function subirImagenes(
  supabase: Supabase,
  postId: string,
  files: File[],
  alts: string[],
): Promise<{ images: SocialImage[]; error?: string }> {
  const images: SocialImage[] = [];
  for (const [i, file] of files.entries()) {
    if (!TIPOS.has(file.type)) return { images, error: `«${file.name}» no es JPG, PNG, WebP ni GIF.` };
    if (file.size > MAX_BYTES) return { images, error: `«${file.name}» pesa más de 5 MB.` };
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
    const path = `${postId}/${Date.now()}-${i}-${base}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) return { images, error: `No se pudo subir «${file.name}»: ${error.message}` };
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    images.push({ path, url: data.publicUrl, alt: (alts[i] ?? "").trim().slice(0, 400) });
  }
  return { images };
}

function imagenesDe(formData: FormData): { files: File[]; alts: string[] } {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const alts = formData.getAll("alts").map(String);
  return { files, alts };
}

/** Escribe con DeepSeek las versiones de los canales pedidos y las guarda. */
async function escribirVariantes(
  supabase: Supabase,
  post: SocialPost,
  canales: SocialChannel[],
  opts: { instruction?: string; current?: Partial<Record<SocialChannel, unknown>> } = {},
): Promise<string | undefined> {
  const r = await generar(
    {
      topic: post.topic ?? "",
      language: post.language,
      source: post.source_text ? { url: post.source_url ?? "", title: post.source_title ?? "", text: post.source_text } : null,
      imageCount: post.images.length,
      instruction: opts.instruction,
      current: opts.current,
    },
    canales,
  );

  const filas = canales
    .filter((c) => r.bodies[c])
    .map((c) => ({ post_id: post.id, channel: c, body: r.bodies[c], updated_at: new Date().toISOString() }));
  if (filas.length) {
    const { error } = await supabase.from("social_variants").upsert(filas, { onConflict: "post_id,channel" });
    if (error) return error.message;
  }
  return r.error;
}

// ── Crear ─────────────────────────────────────────────────

export async function crearPublicacion(formData: FormData): Promise<{ id?: string; error?: string }> {
  const { supabase, userId } = await assertAdmin();

  const topic = String(formData.get("topic") ?? "").trim().slice(0, 4_000);
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const language = formData.get("language") === "en" ? "en" : "es";
  const canales = canalesDe(formData);
  const { files, alts } = imagenesDe(formData);

  if (!topic && !sourceUrl) return { error: "Escribe un tema o pega un enlace." };
  if (!canales.length) return { error: "Elige al menos un canal." };
  if (files.length > MAX_IMAGENES) return { error: `Como mucho ${MAX_IMAGENES} imágenes por publicación.` };

  // El enlace se lee antes de crear nada: si no se puede leer, mejor saberlo
  // ahora que tener una publicación a medias.
  let fuente: Awaited<ReturnType<typeof leerFuente>> | null = null;
  if (sourceUrl) {
    try {
      fuente = await leerFuente(sourceUrl);
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const title =
    String(formData.get("title") ?? "").trim().slice(0, 200) ||
    (topic ? topic.split("\n")[0].slice(0, 90) : fuente?.title.slice(0, 90)) ||
    "Publicación sin título";

  const { data: post, error } = await supabase
    .from("social_posts")
    .insert({
      title,
      topic: topic || null,
      source_url: fuente?.url ?? null,
      source_title: fuente?.title ?? null,
      source_text: fuente?.text ?? null,
      language,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !post) return { error: error?.message ?? "No se pudo crear la publicación." };

  const subida = await subirImagenes(supabase, post.id, files, alts);
  if (subida.images.length) {
    await supabase.from("social_posts").update({ images: subida.images }).eq("id", post.id);
  }
  const conImagenes = { ...(post as SocialPost), images: subida.images };

  // Si DeepSeek falla, la publicación queda creada igual: el editor ofrece
  // volver a generar sin repetir la subida ni la lectura del enlace.
  const fallo = await escribirVariantes(supabase, conImagenes, canales);

  revalidatePath("/admin/publicaciones");
  return { id: post.id, error: subida.error ?? fallo };
}

// ── Regenerar un canal ────────────────────────────────────

export async function regenerarCanal(postId: string, channel: SocialChannel, instruction: string) {
  const { supabase } = await assertAdmin();
  if (!CANALES.includes(channel)) return { error: "Canal desconocido." };

  const { data: post } = await supabase.from("social_posts").select("*").eq("id", postId).maybeSingle();
  if (!post) return { error: "La publicación no existe." };

  const { data: actual } = await supabase
    .from("social_variants")
    .select("body, status")
    .eq("post_id", postId)
    .eq("channel", channel)
    .maybeSingle();
  if (actual?.status === "publicado") return { error: "Ya está publicada: no se puede regenerar." };

  const error = await escribirVariantes(supabase, post as SocialPost, [channel], {
    instruction: instruction.trim().slice(0, 1_000) || undefined,
    current: actual?.body && Object.keys(actual.body).length ? { [channel]: actual.body } : undefined,
  });

  // Lo regenerado vuelve a borrador: hay que leerlo antes de publicarlo.
  await supabase
    .from("social_variants")
    .update({ status: "borrador", scheduled_at: null, error: null })
    .eq("post_id", postId)
    .eq("channel", channel)
    .neq("status", "publicado");

  revalidatePath(`/admin/publicaciones/${postId}`);
  return error ? { error } : { ok: true };
}

// ── Editar y programar ────────────────────────────────────

async function variante(supabase: Supabase, id: string) {
  const { data } = await supabase.from("social_variants").select("*").eq("id", id).maybeSingle();
  return data as SocialVariant | null;
}

export async function guardarVariante(id: string, body: unknown) {
  const { supabase } = await assertAdmin();
  const v = await variante(supabase, id);
  if (!v) return { error: "No existe." };
  if (v.status === "publicado") return { error: "Ya está publicada: no se puede editar." };

  const limpio = parseBody(v.channel, body);
  const { error } = await supabase
    .from("social_variants")
    .update({ body: limpio, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath(`/admin/publicaciones/${v.post_id}`);
  revalidatePath("/admin/publicaciones");
  return { ok: true };
}

/** `cuando` en ISO (lo calcula el navegador desde su hora local), o null para desprogramar. */
export async function programarVariante(id: string, cuando: string | null) {
  const { supabase } = await assertAdmin();
  const v = await variante(supabase, id);
  if (!v) return { error: "No existe." };
  if (v.status === "publicado") return { error: "Ya está publicada." };

  if (cuando === null) {
    await supabase.from("social_variants").update({ status: "borrador", scheduled_at: null }).eq("id", id);
  } else {
    const fecha = new Date(cuando);
    if (Number.isNaN(fecha.getTime())) return { error: "La fecha no es válida." };
    if (fecha.getTime() < Date.now() - 60_000) return { error: "La fecha ya ha pasado." };
    const errores = revisar(v.channel, v.body).filter((a) => a.nivel === "error");
    if (errores.length) return { error: `Corrige antes: ${errores.map((a) => a.texto).join(" ")}` };

    const { error } = await supabase
      .from("social_variants")
      .update({ status: "programado", scheduled_at: fecha.toISOString(), error: null })
      .eq("id", id);
    if (error) return { error: error.message };
  }

  revalidatePath(`/admin/publicaciones/${v.post_id}`);
  revalidatePath("/admin/publicaciones");
  return { ok: true };
}

// ── Imágenes ──────────────────────────────────────────────

export async function anadirImagenes(postId: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const { data: post } = await supabase.from("social_posts").select("images").eq("id", postId).maybeSingle();
  if (!post) return { error: "La publicación no existe." };

  const actuales = (post.images ?? []) as SocialImage[];
  const { files, alts } = imagenesDe(formData);
  if (actuales.length + files.length > MAX_IMAGENES) return { error: `Como mucho ${MAX_IMAGENES} imágenes por publicación.` };

  const subida = await subirImagenes(supabase, postId, files, alts);
  await supabase
    .from("social_posts")
    .update({ images: [...actuales, ...subida.images], updated_at: new Date().toISOString() })
    .eq("id", postId);

  revalidatePath(`/admin/publicaciones/${postId}`);
  return subida.error ? { error: subida.error } : { ok: true };
}

export async function quitarImagen(postId: string, path: string) {
  const { supabase } = await assertAdmin();
  const { data: post } = await supabase.from("social_posts").select("images").eq("id", postId).maybeSingle();
  if (!post) return { error: "La publicación no existe." };

  const restantes = ((post.images ?? []) as SocialImage[]).filter((i) => i.path !== path);
  await supabase.storage.from(BUCKET).remove([path]);
  await supabase.from("social_posts").update({ images: restantes, updated_at: new Date().toISOString() }).eq("id", postId);

  revalidatePath(`/admin/publicaciones/${postId}`);
  return { ok: true };
}

// ── Borrar ────────────────────────────────────────────────

export async function borrarPublicacion(postId: string) {
  const { supabase } = await assertAdmin();
  const { data: post } = await supabase.from("social_posts").select("images").eq("id", postId).maybeSingle();
  if (!post) return { error: "La publicación no existe." };

  const { count } = await supabase
    .from("social_variants")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("status", "publicado");
  // Lo publicado sigue en la red aunque se borre aquí; perder el registro de
  // qué se publicó y cuándo no ayuda a nadie.
  if (count) return { error: "Tiene canales ya publicados: no se puede borrar." };

  const paths = ((post.images ?? []) as SocialImage[]).map((i) => i.path);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  const { error } = await supabase.from("social_posts").delete().eq("id", postId);
  if (error) return { error: error.message };

  revalidatePath("/admin/publicaciones");
  return { ok: true };
}

// ── Ajustes ───────────────────────────────────────────────

export async function guardarAjustes(formData: FormData) {
  const { supabase, userId } = await assertAdmin();

  const cambios: Record<string, unknown> = {
    deepseek_model: String(formData.get("deepseek_model") ?? "").trim() || "deepseek-flash",
    uploadpost_user: String(formData.get("uploadpost_user") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };

  // Mismo criterio que la clave de OpenAI (admin/ia/actions.ts): el campo
  // llega vacío cuando ya hay una guardada, y vacío significa «déjala».
  const ds = String(formData.get("deepseek_api_key") ?? "").trim();
  if (formData.get("clear_deepseek") === "on") cambios.deepseek_api_key = null;
  else if (ds) cambios.deepseek_api_key = ds;
  if (formData.get("clear_deepseek") === "on" || ds) {
    cambios.last_test_ok = null;
    cambios.last_test_at = null;
    cambios.last_test_detail = null;
  }

  const up = String(formData.get("uploadpost_api_key") ?? "").trim();
  if (formData.get("clear_uploadpost") === "on") cambios.uploadpost_api_key = null;
  else if (up) cambios.uploadpost_api_key = up;

  const { error } = await supabase.from("social_settings").update(cambios).eq("id", "default");
  if (error) return { error: error.message };

  revalidatePath("/admin/publicaciones/ajustes");
  return { ok: true };
}

export async function probarDeepseek() {
  const { supabase } = await assertAdmin();
  const r = await testDeepseekKey();
  await supabase
    .from("social_settings")
    .update({ last_test_ok: r.ok, last_test_at: new Date().toISOString(), last_test_detail: r.detail })
    .eq("id", "default");
  revalidatePath("/admin/publicaciones/ajustes");
  return r;
}
