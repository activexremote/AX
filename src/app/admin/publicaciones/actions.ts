"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { CANALES, parseBody, revisar, slugify } from "@/lib/social/canales";
import { leerFuente } from "@/lib/social/fuente";
import { generar } from "@/lib/social/generar";
import { HORIZONTE, huecos, diaMadrid, parseRitmo } from "@/lib/social/calendario";
import { publicSocialSettings, testDeepseekKey } from "@/lib/social/settings";
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

/**
 * Borra del almacén las imágenes que ya no usa nadie. Las dos publicaciones
 * de una pareja comparten los mismos archivos: quitar una imagen de una (o
 * borrarla entera) no puede dejar a la otra sin ella.
 */
async function liberarImagenes(supabase: Supabase, paths: string[], salvoPost: string) {
  const libres: string[] = [];
  for (const path of paths) {
    const { count } = await supabase
      .from("social_posts")
      .select("id", { count: "exact", head: true })
      .neq("id", salvoPost)
      .contains("images", [{ path }]);
    if (!count) libres.push(path);
  }
  if (libres.length) await supabase.storage.from(BUCKET).remove(libres);
}

function imagenesDe(formData: FormData): { files: File[]; alts: string[] } {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const alts = formData.getAll("alts").map(String);
  return { files, alts };
}

/** Escribe con DeepSeek las versiones de los canales pedidos y las guarda. */
async function escribirVariantes(
  supabase: Supabase,
  userId: string,
  post: SocialPost,
  canales: SocialChannel[],
  opts: {
    instruction?: string;
    current?: Partial<Record<SocialChannel, unknown>>;
    translateFrom?: { language: "es" | "en"; bodies: Partial<Record<SocialChannel, unknown>> };
  } = {},
): Promise<string | undefined> {
  const r = await generar(
    {
      topic: post.topic ?? "",
      language: post.language,
      source: post.source_text ? { url: post.source_url ?? "", title: post.source_title ?? "", text: post.source_text } : null,
      imageCount: post.images.length,
      instruction: opts.instruction,
      current: opts.current,
      translateFrom: opts.translateFrom,
    },
    canales,
  );

  // El gasto se apunta aunque la respuesta no haya servido: DeepSeek lo cobra.
  if (r.gasto) {
    await supabase.from("social_usage").insert({
      post_id: post.id,
      channels: canales,
      model: r.gasto.model,
      input_hit: r.gasto.uso.hit,
      input_miss: r.gasto.uso.miss,
      output_tokens: r.gasto.uso.out,
      peak: r.gasto.peak,
      cost_usd: r.gasto.usd,
      created_by: userId,
    });
  }

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
  // «ambos»: se escribe en español y se adapta al inglés en una segunda publicación enlazada.
  const pedido = String(formData.get("language") ?? "es");
  const ambos = pedido === "ambos";
  const language = pedido === "en" ? "en" : "es";
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
  const fallo = await escribirVariantes(supabase, userId, conImagenes, canales);

  // La versión en inglés sale de la española ya escrita: si ésa ha fallado,
  // no hay nada que adaptar y se puede crear luego desde el editor.
  let falloPareja: string | undefined;
  if (ambos && !fallo) falloPareja = (await crearPareja(supabase, userId, conImagenes, "en")).error;

  revalidatePath("/admin/publicaciones", "layout");
  return { id: post.id, error: subida.error ?? fallo ?? falloPareja };
}

// ── La versión en el otro idioma ──────────────────────────

/**
 * Crea la publicación gemela en `language`, enlazada en las dos direcciones,
 * con el mismo material y las mismas imágenes, y la escribe adaptando las
 * versiones que ya tiene la original (sólo esos canales).
 */
async function crearPareja(
  supabase: Supabase,
  userId: string,
  post: SocialPost,
  language: "es" | "en",
): Promise<{ id?: string; error?: string }> {
  const { data: vs } = await supabase.from("social_variants").select("channel, body").eq("post_id", post.id);
  const bodies: Partial<Record<SocialChannel, unknown>> = {};
  for (const v of (vs ?? []) as Pick<SocialVariant, "channel" | "body">[]) {
    if (v.body && Object.keys(v.body).length) bodies[v.channel] = v.body;
  }
  const canales = CANALES.filter((c) => bodies[c]);
  if (!canales.length) return { error: "La publicación no tiene ningún canal escrito que adaptar." };

  const base = post.title.replace(/ · (ES|EN)$/, "");
  const { data: gemela, error } = await supabase
    .from("social_posts")
    .insert({
      title: `${base} · ${language.toUpperCase()}`.slice(0, 200),
      topic: post.topic,
      source_url: post.source_url,
      source_title: post.source_title,
      source_text: post.source_text,
      images: post.images,
      language,
      pair_id: post.id,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !gemela) return { error: error?.message ?? "No se pudo crear la versión en el otro idioma." };
  await supabase.from("social_posts").update({ pair_id: gemela.id }).eq("id", post.id);

  const fallo = await escribirVariantes(supabase, userId, gemela as SocialPost, canales, {
    translateFrom: { language: post.language, bodies },
  });
  return { id: gemela.id, error: fallo };
}

export async function crearVersionIdioma(postId: string): Promise<{ id?: string; error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const { data: post } = await supabase.from("social_posts").select("*").eq("id", postId).maybeSingle();
  if (!post) return { error: "La publicación no existe." };
  const p = post as SocialPost;
  if (p.pair_id) return { id: p.pair_id };

  const r = await crearPareja(supabase, userId, p, p.language === "es" ? "en" : "es");
  revalidatePath(`/admin/publicaciones/${postId}`);
  revalidatePath("/admin/publicaciones", "layout");
  return r;
}

// ── Regenerar un canal ────────────────────────────────────

export async function regenerarCanal(postId: string, channel: SocialChannel, instruction: string) {
  const { supabase, userId } = await assertAdmin();
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

  const error = await escribirVariantes(supabase, userId, post as SocialPost, [channel], {
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
  revalidatePath("/admin/publicaciones", "layout");
  return { ok: true };
}

// ── La nevera ─────────────────────────────────────────────
//
// Lo que está revisado y listo pero aún no tiene fecha. Se le pone fecha a
// mano, o se reparte sola por los huecos del ritmo con `rellenarHuecos`.

export async function guardarEnNevera(id: string) {
  const { supabase } = await assertAdmin();
  const v = await variante(supabase, id);
  if (!v) return { error: "No existe." };
  if (v.status === "publicado") return { error: "Ya está publicada." };
  const errores = revisar(v.channel, v.body).filter((a) => a.nivel === "error");
  if (errores.length) return { error: `Corrige antes: ${errores.map((a) => a.texto).join(" ")}` };

  await supabase.from("social_variants").update({ status: "nevera", scheduled_at: null, error: null }).eq("id", id);
  revalidatePath(`/admin/publicaciones/${v.post_id}`);
  revalidatePath("/admin/publicaciones", "layout");
  return { ok: true };
}

/** Días de Madrid que ya tienen algo de ese canal (programado o publicado). */
async function diasOcupados(supabase: Supabase, channel: SocialChannel): Promise<Set<string>> {
  const { data } = await supabase
    .from("social_variants")
    .select("status, scheduled_at, published_at")
    .eq("channel", channel)
    .in("status", ["programado", "publicado"]);
  return new Set(
    ((data ?? []) as Pick<SocialVariant, "status" | "scheduled_at" | "published_at">[])
      .map((v) => (v.status === "publicado" ? v.published_at : v.scheduled_at))
      .filter((d): d is string => Boolean(d))
      .map(diaMadrid),
  );
}

/**
 * Reparte la nevera por los huecos vacíos del ritmo, la más antigua primero.
 * Sólo mira los próximos 90 días: más allá, mejor decidir con calma.
 * Con `soloId`, coloca sólo esa versión en el primer hueco libre de su canal.
 */
async function colocar(supabase: Supabase, soloId?: string): Promise<{ colocadas: number; sinHueco: number; cuando?: string }> {
  const settings = await publicSocialSettings();
  const ritmo = parseRitmo(settings.ritmo);
  const ahora = new Date();

  // Sin `soloId`, se reparte la nevera. Con él, esa versión vaya de donde
  // venga (por revisar, nevera o con error): es el «al próximo hueco» del editor.
  let q = supabase.from("social_variants").select("*").order("updated_at", { ascending: true });
  q = soloId ? q.eq("id", soloId).in("status", ["nevera", "borrador", "error"]) : q.eq("status", "nevera");
  const { data } = await q;
  const nevera = (data ?? []) as SocialVariant[];

  let colocadas = 0;
  let sinHueco = 0;
  let cuando: string | undefined;
  for (const c of CANALES) {
    const cola = nevera.filter((v) => v.channel === c && !revisar(c, v.body).some((a) => a.nivel === "error"));
    if (!cola.length) continue;
    const ocupados = await diasOcupados(supabase, c);
    const libres = huecos(ritmo[c], ahora, Math.min(90, HORIZONTE)).filter((h) => !ocupados.has(h.dia));
    for (const v of cola) {
      const h = libres.shift();
      if (!h) {
        sinHueco++;
        continue;
      }
      cuando = h.instante.toISOString();
      await supabase.from("social_variants").update({ status: "programado", scheduled_at: cuando, error: null }).eq("id", v.id);
      colocadas++;
    }
  }
  return { colocadas, sinHueco, cuando };
}

export async function rellenarHuecos() {
  const { supabase } = await assertAdmin();
  const r = await colocar(supabase);
  revalidatePath("/admin/publicaciones", "layout");
  return { ok: true, ...r };
}

export async function programarEnProximoHueco(id: string) {
  const { supabase } = await assertAdmin();
  const v = await variante(supabase, id);
  if (!v) return { error: "No existe." };
  if (v.status === "publicado" || v.status === "programado") return { error: "Ya tiene fecha." };
  const errores = revisar(v.channel, v.body).filter((a) => a.nivel === "error");
  if (errores.length) return { error: `Corrige antes: ${errores.map((a) => a.texto).join(" ")}` };
  const r = await colocar(supabase, id);
  revalidatePath(`/admin/publicaciones/${v.post_id}`);
  revalidatePath("/admin/publicaciones", "layout");
  if (!r.colocadas) return { error: "No hay ningún hueco libre en los próximos 90 días. Revisa el ritmo o ponle fecha a mano." };
  return { ok: true, cuando: r.cuando };
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
  await supabase.from("social_posts").update({ images: restantes, updated_at: new Date().toISOString() }).eq("id", postId);
  await liberarImagenes(supabase, [path], postId);

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
  const { error } = await supabase.from("social_posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  if (paths.length) await liberarImagenes(supabase, paths, postId);

  revalidatePath("/admin/publicaciones", "layout");
  return { ok: true };
}

/**
 * Desecha UN canal de una publicación (lo que se ve en la nevera es eso: un
 * canal). Si era el último, la publicación ya no tiene nada y se va entera.
 */
export async function desecharVariante(id: string) {
  const { supabase } = await assertAdmin();
  const v = await variante(supabase, id);
  if (!v) return { error: "No existe." };
  if (v.status === "publicado") return { error: "Ya está publicada: no se puede desechar." };

  const { error } = await supabase.from("social_variants").delete().eq("id", id);
  if (error) return { error: error.message };

  const { count } = await supabase.from("social_variants").select("id", { count: "exact", head: true }).eq("post_id", v.post_id);
  if (!count) {
    const { data: post } = await supabase.from("social_posts").select("images").eq("id", v.post_id).maybeSingle();
    await supabase.from("social_posts").delete().eq("id", v.post_id);
    const paths = ((post?.images ?? []) as SocialImage[]).map((i) => i.path);
    if (paths.length) await liberarImagenes(supabase, paths, v.post_id);
  }

  revalidatePath(`/admin/publicaciones/${v.post_id}`);
  revalidatePath("/admin/publicaciones", "layout");
  return { ok: true };
}

// ── Ajustes ───────────────────────────────────────────────

export async function guardarAjustes(formData: FormData) {
  const { supabase, userId } = await assertAdmin();

  const entero = (k: string, min: number, max: number, def: number) => {
    const n = Number(formData.get(k));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def;
  };
  const cadence = parseRitmo(
    Object.fromEntries(
      CANALES.map((c) => [c, { days: formData.getAll(`days_${c}`).map(Number), hour: entero(`hour_${c}`, 0, 23, 10) }]),
    ),
  );

  const cambios: Record<string, unknown> = {
    cadence,
    alert_days: entero("alert_days", 1, 180, 14),
    monthly_quota: entero("monthly_quota", 0, 100_000, 10),
    min_balance_usd: Math.max(0, Number(formData.get("min_balance_usd")) || 0),
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

  revalidatePath("/admin/publicaciones", "layout");
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
