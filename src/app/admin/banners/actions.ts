"use server";

import { revalidatePath } from "next/cache";

import type { Calidad } from "@/lib/banners/costes";
import {
  ANGULOS,
  CTAS,
  CURSOS,
  OBJETIVOS,
  PLANTILLAS,
  difElementos,
  leerCopy,
  leerElementos,
  otroIdioma,
  usaImagen,
  type Angulo,
  type Plantilla,
} from "@/lib/banners/formatos";
import { generarClones, generarVariantes, traducirCopias, type Brief, type Gasto, type Variante } from "@/lib/banners/generar";
import { BUCKET, borrarImagen, generarImagen, leerImagen } from "@/lib/banners/imagen";
import { bloquea, revisar, revisarVariante, type Flag } from "@/lib/banners/normas";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdBannerStatus, AdCampaign, AdCourse, AdObjective } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Banners — SÓLO ADMINISTRADORES
//
//  Anunciar en nombre de la escuela es hablar por ella. Las tablas están
//  cerradas por RLS (0020); esto lo comprueba antes de gastar una llamada a
//  OpenAI.
//
//  Nada se publica desde aquí: el resultado son piezas que alguien revisa,
//  aprueba y sube al Administrador de anuncios de Meta.
// ══════════════════════════════════════════════════════════

const MAX_VARIANTES = 6;
const MAX_BYTES = 8 * 1024 * 1024;
const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const CALIDADES: Calidad[] = ["low", "medium", "high"];

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return { supabase, userId: user.id };
}

type Supabase = Awaited<ReturnType<typeof assertAdmin>>["supabase"];

async function apuntarGasto(supabase: Supabase, userId: string, campaignId: string, kind: "texto" | "imagen", gastos: Gasto[]) {
  if (!gastos.length) return;
  // Se apunta aunque la respuesta no haya servido: OpenAI lo cobra igual.
  await supabase.from("ad_usage").insert(
    gastos.map((g) => ({
      campaign_id: campaignId,
      kind,
      model: g.model,
      input_tokens: g.input,
      output_tokens: g.output,
      cost_usd: g.usd,
      created_by: userId,
    })),
  );
}

/** La revisión de una variante tal como está guardada (o como va a quedar). */
function flagsDe(b: Pick<AdBanner, "copy" | "copy_alt" | "elements" | "image_source" | "template">, c: Pick<AdCampaign, "language">): Flag[] {
  return revisarVariante({
    copy: leerCopy(b.copy),
    copyAlt: b.copy_alt ? leerCopy(b.copy_alt) : null,
    altLang: otroIdioma(c.language),
    imagenIa: b.image_source === "ia" && usaImagen(b.template),
    elementos: leerElementos(b.elements),
  });
}

const ahora = () => new Date().toISOString();

/**
 * Escribe la versión en el otro idioma de las variantes que se le pasen, en
 * una sola llamada. La imagen no se toca: es la misma pieza.
 */
async function traducir(supabase: Supabase, userId: string, campaign: AdCampaign, banners: AdBanner[]): Promise<{ error?: string }> {
  if (!banners.length) return {};
  const r = await traducirCopias(
    banners.map((b) => leerCopy(b.copy)),
    campaign.language,
    otroIdioma(campaign.language),
    campaign.course,
  );
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  if (!r.copias.length) return { error: r.error ?? "No se ha podido escribir la otra versión." };
  await Promise.all(
    banners.map((b, i) => {
      const nueva = { ...b, copy_alt: r.copias[i] };
      return supabase
        .from("ad_banners")
        .update({ copy_alt: r.copias[i], review: { flags: flagsDe(nueva, campaign), checkedAt: ahora() }, updated_at: ahora() })
        .eq("id", b.id);
    }),
  );
  if (!campaign.bilingual) await supabase.from("ad_campaigns").update({ bilingual: true }).eq("id", campaign.id);
  return {};
}

/** Las variantes de una campaña bilingüe que aún no tienen la otra versión. */
async function traducirPendientes(supabase: Supabase, userId: string, campaignId: string): Promise<{ error?: string }> {
  const { data: c } = await supabase.from("ad_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!c?.bilingual) return {};
  const { data } = await supabase.from("ad_banners").select("*").eq("campaign_id", campaignId).is("copy_alt", null);
  return traducir(supabase, userId, c as AdCampaign, (data ?? []) as AdBanner[]);
}

/** «es», «en» o «ambos» (el principal es el español). */
function leerIdioma(v: FormDataEntryValue | null): { language: "es" | "en"; bilingual: boolean } {
  if (v === "ambos") return { language: "es", bilingual: true };
  return { language: v === "en" ? "en" : "es", bilingual: false };
}

const ruta = (campaignId: string, bannerId: string) => `${campaignId}/${bannerId}-${Date.now()}.jpg`;

/** Pinta la foto de una variante y la guarda. Devuelve el error, si lo hay. */
async function pintar(
  supabase: Supabase,
  userId: string,
  b: Pick<AdBanner, "id" | "campaign_id" | "image_path">,
  escena: string,
  calidad: Calidad,
): Promise<string | null> {
  if (!escena.trim()) return "No hay descripción de la escena.";
  const r = await generarImagen(escena, ruta(b.campaign_id, b.id), calidad);
  if (!r.ok) return r.error;
  await apuntarGasto(supabase, userId, b.campaign_id, "imagen", [r.imagen.gasto]);
  const anterior = b.image_path;
  await supabase
    .from("ad_banners")
    .update({ image_path: r.imagen.path, image_prompt: escena, image_source: "ia", updated_at: new Date().toISOString() })
    .eq("id", b.id);
  if (anterior && anterior !== r.imagen.path) await borrarImagen(anterior);
  return null;
}

/** Guarda las variantes nuevas de una campaña y les pinta la foto si la plantilla la lleva. */
async function crearVariantes(
  supabase: Supabase,
  userId: string,
  campaign: AdCampaign,
  angles: Angulo[],
  calidad: Calidad,
): Promise<{ error?: string }> {
  const brief: Brief = {
    course: campaign.course,
    objective: campaign.objective,
    language: campaign.language,
    angles,
    count: angles.length,
    audience: campaign.audience ?? undefined,
    notes: campaign.notes ?? undefined,
  };
  const r = await generarVariantes(brief);
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  if (!r.variantes.length) return { error: r.error ?? "No se ha generado ninguna variante." };
  return guardarVariantes(supabase, userId, campaign, r.variantes, campaign.style, calidad);
}

/** Guarda variantes ya escritas y les pinta la foto si la plantilla la lleva. */
async function guardarVariantes(
  supabase: Supabase,
  userId: string,
  campaign: AdCampaign,
  variantes: Variante[],
  template: string,
  calidad: Calidad,
): Promise<{ error?: string }> {
  const { count } = await supabase.from("ad_banners").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id);
  const desde = count ?? 0;
  const conFoto = usaImagen(template);

  const { data: filas, error } = await supabase
    .from("ad_banners")
    .insert(
      variantes.map((v, i) => ({
        campaign_id: campaign.id,
        position: desde + i,
        angle: v.angle,
        copy: v.copy,
        template,
        image_prompt: v.imagePrompt,
        review: { flags: revisar(v.copy, { imagenIa: conFoto }), checkedAt: new Date().toISOString() },
      })),
    )
    .select("id, campaign_id, image_path, image_prompt");
  if (error || !filas) return { error: `No se pudieron guardar las variantes: ${error?.message ?? ""}` };

  if (!conFoto) return {};

  // Las fotos, a la vez: cada una tarda 20-40 s y no dependen entre sí.
  const errores = (
    await Promise.all(filas.map((f) => pintar(supabase, userId, { ...f, image_path: null }, f.image_prompt ?? "", calidad)))
  ).filter(Boolean);
  if (errores.length) {
    return { error: `Las variantes están escritas, pero ${errores.length} imagen(es) no se han podido pintar: ${errores[0]} Puedes reintentarlo desde cada variante.` };
  }
  return {};
}

export async function crearCampana(formData: FormData): Promise<{ id?: string; error?: string }> {
  const { supabase, userId } = await assertAdmin();

  const course = String(formData.get("course") ?? "escuela") as AdCourse;
  const objective = String(formData.get("objective") ?? "leads") as AdObjective;
  const { language, bilingual } = leerIdioma(formData.get("language"));
  const style = String(formData.get("style") ?? "foto") as Plantilla;
  const calidad = String(formData.get("quality") ?? "medium") as Calidad;
  const angles = ANGULOS.filter((a) => formData.getAll("angles").map(String).includes(a)).slice(0, MAX_VARIANTES);

  if (!CURSOS.includes(course) || !OBJETIVOS.includes(objective) || !PLANTILLAS.includes(style) || !CALIDADES.includes(calidad)) {
    return { error: "Hay un valor del formulario que no se reconoce." };
  }
  if (!angles.length) return { error: "Elige al menos un ángulo." };

  const nombreAuto = `${course === "escuela" ? "Escuela" : course === "remote-founder" ? "Founder" : "Professional"} · ${objective} · ${new Date().toLocaleDateString("es-ES")}`;
  const { data, error } = await supabase
    .from("ad_campaigns")
    .insert({
      name: String(formData.get("name") ?? "").trim().slice(0, 120) || nombreAuto,
      course,
      objective,
      language,
      bilingual,
      style,
      angles,
      audience: String(formData.get("audience") ?? "").trim().slice(0, 1000) || null,
      notes: String(formData.get("notes") ?? "").trim().slice(0, 2000) || null,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !data) return { error: `No se pudo crear la campaña: ${error?.message ?? ""}` };

  const r = await crearVariantes(supabase, userId, data as AdCampaign, angles, calidad);
  const t = r.error ? {} : await traducirPendientes(supabase, userId, data.id);
  revalidatePath("/admin/banners");
  // Con id, la campaña existe aunque la IA haya fallado: el aviso se ve en
  // la campaña, donde se puede reintentar.
  return { id: data.id, error: r.error ?? t.error };
}

export async function anadirVariantes(campaignId: string, angles: string[]): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const { data } = await supabase.from("ad_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!data) return { error: "La campaña no existe." };
  const lista = ANGULOS.filter((a) => angles.includes(a)).slice(0, MAX_VARIANTES);
  if (!lista.length) return { error: "Elige al menos un ángulo." };
  const r = await crearVariantes(supabase, userId, data as AdCampaign, lista, "medium");
  const t = await traducirPendientes(supabase, userId, campaignId);
  revalidatePath(`/admin/banners/${campaignId}`);
  return { error: r.error ?? t.error };
}

async function cargar(supabase: Supabase, id: string) {
  const { data: b } = await supabase.from("ad_banners").select("*").eq("id", id).maybeSingle();
  if (!b) return null;
  const { data: c } = await supabase.from("ad_campaigns").select("*").eq("id", b.campaign_id).maybeSingle();
  return c ? { banner: b as AdBanner, campaign: c as AdCampaign } : null;
}

export async function guardarBanner(
  id: string,
  input: { copy: unknown; copyAlt?: unknown; template: string; elements?: unknown },
): Promise<{ flags?: Flag[]; error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };

  const limpiar = (raw: unknown) => {
    const copy = leerCopy(raw);
    for (const k of Object.keys(copy) as (keyof typeof copy)[]) copy[k] = copy[k].slice(0, k === "primaryText" ? 2000 : 300);
    return copy;
  };
  const copy = limpiar(input.copy);
  // La otra versión sólo se guarda si ya existía: crearla es `traducirBanner`.
  const copyAlt = x.banner.copy_alt && input.copyAlt ? limpiar(input.copyAlt) : x.banner.copy_alt;
  const template = (PLANTILLAS as string[]).includes(input.template) ? input.template : x.banner.template;
  const elements = input.elements === undefined ? x.banner.elements : difElementos(leerElementos(input.elements));
  const flags = flagsDe({ copy, copy_alt: copyAlt, elements, image_source: x.banner.image_source, template }, x.campaign);

  // Un aprobado que deja de cumplir vuelve a revisión: lo aprobado tiene que
  // seguir siendo publicable.
  const status = x.banner.status === "aprobado" && bloquea(flags) ? "borrador" : x.banner.status;
  const { error } = await supabase
    .from("ad_banners")
    .update({ copy, copy_alt: copyAlt, template, elements, status, review: { flags, checkedAt: ahora() }, updated_at: ahora() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  return { flags };
}

/** Escribe (o reescribe) la versión en el otro idioma de una variante. */
export async function traducirBanner(id: string): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const r = await traducir(supabase, userId, x.campaign, [x.banner]);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  revalidatePath("/admin/banners");
  return r;
}

/** Quita la versión en el otro idioma de una variante. */
export async function quitarTraduccion(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const sin = { ...x.banner, copy_alt: null };
  await supabase
    .from("ad_banners")
    .update({ copy_alt: null, review: { flags: flagsDe(sin, x.campaign), checkedAt: ahora() }, updated_at: ahora() })
    .eq("id", id);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  return {};
}

/** Borra una variante y su imagen. Las demás de la campaña no se tocan. */
export async function borrarBanner(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const { error } = await supabase.from("ad_banners").delete().eq("id", id);
  if (error) return { error: error.message };
  await borrarImagen(x.banner.image_path);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  revalidatePath("/admin/banners");
  return {};
}

export async function estadoBanner(id: string, status: AdBannerStatus): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  if (status === "aprobado") {
    if (bloquea(flagsDe(x.banner, x.campaign))) return { error: "Tiene fallos que bloquean: corrígelos antes de aprobar." };
  }
  await supabase.from("ad_banners").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  revalidatePath("/admin/banners");
  return {};
}

export async function reescribirBanner(id: string, instruccion: string): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const { banner, campaign } = x;
  const angle = ((ANGULOS as readonly string[]).includes(banner.angle ?? "") ? banner.angle : "obstaculo") as Angulo;

  const r = await generarVariantes({
    course: campaign.course,
    objective: campaign.objective,
    language: campaign.language,
    angles: [angle],
    count: 1,
    audience: campaign.audience ?? undefined,
    notes: [
      campaign.notes,
      `VERSIÓN ACTUAL (mejórala, no la repitas):\n${JSON.stringify(banner.copy)}`,
      instruccion.trim() ? `INDICACIONES DE QUIEN REVISA:\n${instruccion.trim().slice(0, 1000)}` : null,
    ]
      .filter(Boolean)
      .join("\n\n"),
  });
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  const v = r.variantes[0];
  if (!v) return { error: r.error ?? "No ha llegado ninguna versión." };

  const copy = v.copy;
  if (!(CTAS[campaign.language] as readonly string[]).includes(copy.cta)) copy.cta = CTAS[campaign.language][0];
  const nueva = { ...banner, copy };
  await supabase
    .from("ad_banners")
    .update({ copy, status: "borrador", review: { flags: flagsDe(nueva, campaign), checkedAt: ahora() }, updated_at: ahora() })
    .eq("id", id);
  // La otra versión era de los textos de antes: se rehace con los nuevos.
  const t = banner.copy_alt ? await traducir(supabase, userId, campaign, [nueva]) : {};
  revalidatePath(`/admin/banners/${campaign.id}`);
  return t;
}

export async function nuevaImagen(id: string, escena: string): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const err = await pintar(supabase, userId, x.banner, escena.trim() || x.banner.image_prompt || "", "medium");
  if (err) return { error: err };
  if (!usaImagen(x.banner.template)) await supabase.from("ad_banners").update({ template: "foto" }).eq("id", id);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  return {};
}

export async function subirFoto(id: string, formData: FormData): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) return { error: "No has elegido ninguna foto." };
  if (!TIPOS.has(file.type)) return { error: "La foto tiene que ser JPG, PNG o WebP." };
  if (file.size > MAX_BYTES) return { error: "La foto pesa más de 8 MB." };

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${x.campaign.id}/${id}-${Date.now()}-propia.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) return { error: `No se pudo subir: ${error.message}` };

  const anterior = x.banner.image_path;
  await supabase
    .from("ad_banners")
    .update({
      image_path: path,
      image_source: "subida",
      template: usaImagen(x.banner.template) ? x.banner.template : "foto",
      review: { flags: flagsDe({ ...x.banner, image_source: "subida" }, x.campaign), checkedAt: ahora() },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  await borrarImagen(anterior);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  return {};
}

export async function quitarImagen(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  await borrarImagen(x.banner.image_path);
  await supabase
    .from("ad_banners")
    .update({
      image_path: null,
      image_source: "ninguna",
      template: "marca",
      review: { flags: flagsDe({ ...x.banner, image_source: "ninguna", template: "marca" }, x.campaign), checkedAt: ahora() },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath(`/admin/banners/${x.campaign.id}`);
  return {};
}

export async function borrarCampana(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const { data: banners } = await supabase.from("ad_banners").select("image_path").eq("campaign_id", id);
  const paths = (banners ?? []).map((b) => b.image_path).filter((p): p is string => Boolean(p));
  // También las imágenes descartadas que se hubieran quedado en la carpeta.
  const { data: sueltas } = await supabase.storage.from(BUCKET).list(id, { limit: 1000 });
  const todas = new Set([...paths, ...(sueltas ?? []).map((f) => `${id}/${f.name}`)]);
  if (todas.size) await supabase.storage.from(BUCKET).remove([...todas]);
  const { error } = await supabase.from("ad_campaigns").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/banners");
  return {};
}

// ── Clonador ──────────────────────────────────────────────
const CLON_TIPOS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function clonarBanner(formData: FormData): Promise<{ id?: string; error?: string }> {
  const { supabase, userId } = await assertAdmin();

  const file = formData.get("reference");
  if (!(file instanceof File) || !file.size) return { error: "Arrastra o elige la imagen del banner que quieres clonar." };
  const ext = CLON_TIPOS[file.type];
  if (!ext) return { error: "La imagen tiene que ser JPG, PNG o WebP." };
  if (file.size > MAX_BYTES) return { error: "La imagen pesa más de 8 MB." };

  const course = String(formData.get("course") ?? "escuela") as AdCourse;
  const { language, bilingual } = leerIdioma(formData.get("language"));
  const calidad = String(formData.get("quality") ?? "medium") as Calidad;
  const count = Math.max(1, Math.min(5, Number(formData.get("count")) || 3));
  const indicacion = String(formData.get("prompt") ?? "").trim().slice(0, 1500);
  const plantillaPedida = String(formData.get("style") ?? "auto");
  if (!CURSOS.includes(course) || !CALIDADES.includes(calidad)) return { error: "Hay un valor del formulario que no se reconoce." };

  // La campaña se crea antes de llamar a la IA: así la referencia queda
  // guardada aunque OpenAI falle, y se puede reintentar.
  const { data, error } = await supabase
    .from("ad_campaigns")
    .insert({
      name: String(formData.get("name") ?? "").trim().slice(0, 120) || `Clon · ${file.name.replace(/\.[^.]+$/, "").slice(0, 40)} · ${new Date().toLocaleDateString("es-ES")}`,
      kind: "clon",
      course,
      objective: "leads",
      language,
      bilingual,
      style: (PLANTILLAS as string[]).includes(plantillaPedida) ? plantillaPedida : "foto",
      angles: [],
      reference_prompt: indicacion || null,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !data) return { error: `No se pudo crear la campaña: ${error?.message ?? ""}` };
  const campaign = data as AdCampaign;

  const bytes = Buffer.from(await file.arrayBuffer());
  const refPath = `${campaign.id}/referencia.${ext}`;
  const subida = await supabase.storage.from(BUCKET).upload(refPath, bytes, { contentType: file.type, upsert: true });
  if (subida.error) return { id: campaign.id, error: `No se pudo guardar la referencia: ${subida.error.message}` };
  await supabase.from("ad_campaigns").update({ reference_path: refPath }).eq("id", campaign.id);

  const r = await generarClones(
    { course, objective: "leads", language, audience: undefined, notes: undefined },
    `data:${file.type};base64,${bytes.toString("base64")}`,
    count,
    indicacion,
  );
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  if (!r.variantes.length) {
    revalidatePath("/admin/banners");
    return { id: campaign.id, error: r.error ?? "No se ha generado ninguna variante." };
  }

  // Si se pidió «la que mejor encaje», manda el análisis.
  const template = (PLANTILLAS as string[]).includes(plantillaPedida) ? plantillaPedida : r.analisis?.template ?? "foto";
  const { angle: _a, template: _t, ...analisis } = r.analisis ?? ({} as NonNullable<typeof r.analisis>);
  await supabase
    .from("ad_campaigns")
    .update({ reference_analysis: r.analisis ? analisis : null, style: template, angles: r.analisis ? [r.analisis.angle] : [] })
    .eq("id", campaign.id);

  const g = await guardarVariantes(supabase, userId, { ...campaign, style: template }, r.variantes, template, calidad);
  const t = await traducirPendientes(supabase, userId, campaign.id);
  revalidatePath("/admin/banners");
  return { id: campaign.id, error: g.error ?? r.error ?? t.error };
}

/** Más clones de la misma referencia, para una campaña que ya es un clon. */
export async function masClones(campaignId: string, count: number, indicacion: string): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const { data } = await supabase.from("ad_campaigns").select("*").eq("id", campaignId).maybeSingle();
  const c = data as AdCampaign | null;
  if (!c?.reference_path) return { error: "Esta campaña no tiene imagen de referencia." };
  const ref = await leerImagen(c.reference_path);
  if (!ref) return { error: "No se encuentra la imagen de referencia." };

  const r = await generarClones(
    { course: c.course, objective: c.objective, language: c.language },
    ref,
    count,
    [c.reference_prompt, indicacion.trim().slice(0, 1500)].filter(Boolean).join("\n"),
  );
  await apuntarGasto(supabase, userId, c.id, "texto", r.gastos);
  if (!r.variantes.length) return { error: r.error ?? "No se ha generado ninguna variante." };
  const g = await guardarVariantes(supabase, userId, c, r.variantes, c.style, "medium");
  const t = await traducirPendientes(supabase, userId, c.id);
  revalidatePath(`/admin/banners/${c.id}`);
  return { error: g.error ?? t.error };
}
