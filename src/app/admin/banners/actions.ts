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
  leerBoton,
  leerComposicion,
  leerCopy,
  leerElementos,
  otroIdioma,
  esNativo,
  repartirBotones,
  repartirComposiciones,
  repartirNativos,
  type Nativo,
  usaImagen,
  type Angulo,
  type Plantilla,
} from "@/lib/banners/formatos";
import { leerRefs, mezcla, type Ref } from "@/lib/banners/direcciones";
import { escribirEscena, generarClones, generarVariantes, idearImagenes, traducirCopias, type Brief, type Gasto, type Variante } from "@/lib/banners/generar";
import { BUCKET, borrarImagen, estiloDe, generarImagen, leerImagen } from "@/lib/banners/imagen";
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

const MAX_VARIANTES = 8;
/** Las que se pueden añadir de una vez a una campaña ya creada. */
const MAX_NUEVAS = 8;
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

async function apuntarGasto(supabase: Supabase, userId: string, campaignId: string | null, kind: "texto" | "imagen", gastos: Gasto[]) {
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

/**
 * Pinta la foto de una variante y la guarda. Devuelve el error, si lo hay.
 * Con `ref`, con el acabado de esa línea visual (y se apunta en la variante).
 */
async function pintar(
  supabase: Supabase,
  userId: string,
  b: Pick<AdBanner, "id" | "campaign_id" | "image_path">,
  escena: string,
  calidad: Calidad,
  ref?: Ref | null,
): Promise<string | null> {
  if (!escena.trim()) return "No hay descripción de la escena.";
  const r = await generarImagen(escena, ruta(b.campaign_id, b.id), calidad, { estilo: estiloDe(ref) });
  if (!r.ok) return r.error;
  await apuntarGasto(supabase, userId, b.campaign_id, "imagen", [r.imagen.gasto]);
  const anterior = b.image_path;
  await supabase
    .from("ad_banners")
    .update({ image_path: r.imagen.path, image_prompt: escena, image_source: "ia", ...(ref ? { visual_ref: ref } : {}), updated_at: new Date().toISOString() })
    .eq("id", b.id);
  if (anterior && anterior !== r.imagen.path) await borrarImagen(anterior);
  return null;
}

/**
 * Guarda las variantes nuevas de una campaña y les pinta la foto si la
 * plantilla la lleva. Cada variante, con su referencia de imagen: las que se
 * eligieron al crear la campaña, por turnos; sin ninguna elegida, una línea
 * distinta al azar para cada una (y distinta de las que ya hay).
 */
async function crearVariantes(
  supabase: Supabase,
  userId: string,
  campaign: AdCampaign,
  angles: Angulo[],
  calidad: Calidad,
  /** Variantes que se añaden a una campaña: distintas también de las que ya tiene. */
  nuevas = false,
  /** Cuántas van en formato nativo (chat, correo, tuit…) en vez de con imagen. */
  nativos = 0,
): Promise<{ error?: string }> {
  const elegidas = nuevas ? [] : leerRefs(campaign.visual_refs);
  let refs: Ref[] | undefined;
  let yaHay = "";
  if (nuevas) {
    const { data: hechas } = await supabase.from("ad_banners").select("copy").eq("campaign_id", campaign.id);
    const titulares = (hechas ?? []).map((h) => leerCopy(h.copy).headline).filter(Boolean);
    if (titulares.length) yaHay = `YA HAY ESTAS VARIANTES EN LA CAMPAÑA: no repitas sus ganchos ni sus escenas; escribe ideas nuevas.\n${titulares.map((t) => `- ${t}`).join("\n")}`;
  }
  // Qué variantes van en formato nativo: repartidas, no todas al final.
  const { data: yaUsados } = nativos ? await supabase.from("ad_banners").select("layout").eq("campaign_id", campaign.id) : { data: [] };
  const tipos = repartirNativos(Math.min(nativos, angles.length), (yaUsados ?? []).map((u) => u.layout as string));
  const huecos = angles.map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, tipos.length);
  const formatos: (Nativo | null)[] = angles.map((_, i) => (huecos.includes(i) ? tipos[huecos.indexOf(i)] : null));
  if (usaImagen(campaign.style)) {
    if (elegidas.length) {
      refs = angles.map((_, i) => elegidas[i % elegidas.length]);
    } else {
      const { data: usadas } = await supabase.from("ad_banners").select("visual_ref").eq("campaign_id", campaign.id);
      refs = mezcla(angles.length, (usadas ?? []).map((u) => (u.visual_ref as Ref | null)?.dir).filter((d): d is string => Boolean(d)));
    }
  }
  const brief: Brief = {
    course: campaign.course,
    objective: campaign.objective,
    language: campaign.language,
    angles,
    count: angles.length,
    audience: campaign.audience ?? undefined,
    notes: [campaign.notes, yaHay].filter(Boolean).join("\n\n") || undefined,
    refs,
    imageBrief: campaign.image_brief ?? undefined,
    formatos: formatos.some(Boolean) ? formatos : undefined,
  };
  const r = await generarVariantes(brief);
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  if (!r.variantes.length) return { error: r.error ?? "No se ha generado ninguna variante." };
  return guardarVariantes(supabase, userId, campaign, r.variantes, campaign.style, calidad);
}

/**
 * Guarda variantes ya escritas y les pinta la foto si la plantilla la lleva.
 * Con `igual`, todas con la composición, los elementos y el botón de una
 * variante («más como esta»); si no, cada una con otros distintos.
 */
async function guardarVariantes(
  supabase: Supabase,
  userId: string,
  campaign: AdCampaign,
  variantes: Variante[],
  template: string,
  calidad: Calidad,
  igual?: Pick<AdBanner, "layout" | "elements" | "cta_style" | "folder_id">,
): Promise<{ error?: string }> {
  const { count } = await supabase.from("ad_banners").select("id", { count: "exact", head: true }).eq("campaign_id", campaign.id);
  const desde = count ?? 0;
  const conFoto = usaImagen(template);
  // Cada variante, con otra composición: así no parecen la misma pieza. Los
  // clones no, que copian la estructura de su referencia.
  const { data: usadas } = await supabase.from("ad_banners").select("layout, cta_style").eq("campaign_id", campaign.id);
  const deImagen = repartirComposiciones(variantes.length, (usadas ?? []).map((u) => u.layout as string));
  const layouts = igual
    ? variantes.map(() => igual.layout)
    : campaign.kind === "clon"
      ? variantes.map(() => "clasica")
      : variantes.map((v, i) => v.formato ?? deImagen[i]);
  // Los nativos no llevan foto: van con la plantilla sin imagen.
  const plantillas = layouts.map((l) => (esNativo(l) ? "marca" : template));
  const botones = igual ? variantes.map(() => igual.cta_style) : repartirBotones(variantes.length, (usadas ?? []).map((u) => u.cta_style));

  const { data: filas, error } = await supabase
    .from("ad_banners")
    .insert(
      variantes.map((v, i) => ({
        campaign_id: campaign.id,
        position: desde + i,
        angle: v.angle,
        copy: v.copy,
        template: plantillas[i],
        image_prompt: v.imagePrompt,
        visual_ref: v.ref?.dir ? v.ref : null,
        layout: layouts[i],
        cta_style: botones[i],
        // A la carpeta de la variante de la que salen («más como esta») o a la de la campaña.
        folder_id: (igual ? igual.folder_id : null) ?? campaign.folder_id ?? null,
        ...(igual ? { elements: igual.elements } : {}),
        review: { flags: revisar(v.copy, { imagenIa: usaImagen(plantillas[i]) }), checkedAt: new Date().toISOString() },
      })),
    )
    .select("id, campaign_id, image_path, image_prompt, visual_ref, template");
  if (error || !filas) return { error: `No se pudieron guardar las variantes: ${error?.message ?? ""}` };

  if (!conFoto) return {};

  // Las fotos, a la vez: cada una tarda 20-40 s y no dependen entre sí.
  const errores = (
    await Promise.all(filas.filter((f) => usaImagen(f.template)).map((f) => pintar(supabase, userId, { ...f, image_path: null }, f.image_prompt ?? "", calidad, f.visual_ref as Ref | null)))
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
  const angulos = ANGULOS.filter((a) => formData.getAll("angles").map(String).includes(a)).slice(0, MAX_VARIANTES);
  let visualRefs: Ref[] = [];
  try {
    visualRefs = usaImagen(style) ? leerRefs(JSON.parse(String(formData.get("visual") ?? "[]")), MAX_VARIANTES) : [];
  } catch {
    /* sin referencias: mezcla al azar */
  }
  const imageBrief = usaImagen(style) ? String(formData.get("image_brief") ?? "").trim().slice(0, 1000) || null : null;
  // Las variantes que se pidan (y, si se eligieron más imágenes, una por
  // imagen): los ángulos y las imágenes se reparten por turnos.
  const pedidas = Math.round(Number(formData.get("count") ?? 0)) || angulos.length;
  const nativos = Math.max(0, Math.round(Number(formData.get("native") ?? 0)) || 0);
  const total = Math.min(MAX_VARIANTES, Math.max(1, pedidas, visualRefs.length));
  const angles = angulos.length ? Array.from({ length: total }, (_, i) => angulos[i % angulos.length]) : [];

  if (!CURSOS.includes(course) || !OBJETIVOS.includes(objective) || !PLANTILLAS.includes(style) || !CALIDADES.includes(calidad)) {
    return { error: "Hay un valor del formulario que no se reconoce." };
  }
  if (!angles.length) return { error: "Elige al menos un ángulo." };
  const carpeta = await carpetaDelFormulario(supabase, userId, formData);
  if (carpeta.error) return { error: carpeta.error };

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
      angles: angulos,
      audience: String(formData.get("audience") ?? "").trim().slice(0, 1000) || null,
      notes: String(formData.get("notes") ?? "").trim().slice(0, 2000) || null,
      visual_refs: visualRefs,
      image_brief: imageBrief,
      folder_id: carpeta.id,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !data) return { error: `No se pudo crear la campaña: ${error?.message ?? ""}` };

  const r = await crearVariantes(supabase, userId, data as AdCampaign, angles, calidad, false, nativos);
  const t = r.error ? {} : await traducirPendientes(supabase, userId, data.id);
  revalidatePath("/admin/banners");
  // Con id, la campaña existe aunque la IA haya fallado: el aviso se ve en
  // la campaña, donde se puede reintentar.
  return { id: data.id, error: r.error ?? t.error };
}

/** Añade `n` variantes a una campaña, distintas entre sí y de las que ya tiene. Sin ángulos elegidos, todos. */
export async function anadirVariantes(campaignId: string, angles: string[], n?: number): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const { data } = await supabase.from("ad_campaigns").select("*").eq("id", campaignId).maybeSingle();
  if (!data) return { error: "La campaña no existe." };
  const elegidos = ANGULOS.filter((a) => angles.includes(a));
  const base = elegidos.length ? elegidos : [...ANGULOS].sort(() => Math.random() - 0.5);
  const total = Math.min(MAX_NUEVAS, Math.max(1, Math.round(n ?? base.length)));
  const lista = Array.from({ length: total }, (_, i) => base[i % base.length]);
  // Unas cuantas en formato nativo, para seguir mezclando.
  const r = await crearVariantes(supabase, userId, data as AdCampaign, lista, "medium", true, Math.round(total * 0.4));
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
  input: { copy: unknown; copyAlt?: unknown; template: string; elements?: unknown; layout?: string; boton?: unknown },
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
  const layout = input.layout === undefined ? x.banner.layout : leerComposicion(input.layout);
  const cta_style = input.boton === undefined ? x.banner.cta_style : leerBoton(input.boton);
  const flags = flagsDe({ copy, copy_alt: copyAlt, elements, image_source: x.banner.image_source, template }, x.campaign);

  // Un aprobado que deja de cumplir vuelve a revisión: lo aprobado tiene que
  // seguir siendo publicable.
  const status = x.banner.status === "aprobado" && bloquea(flags) ? "borrador" : x.banner.status;
  const { error } = await supabase
    .from("ad_banners")
    .update({ copy, copy_alt: copyAlt, template, elements, layout, cta_style, status, review: { flags, checkedAt: ahora() }, updated_at: ahora() })
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

/**
 * Otra imagen para la variante. Con `dir`, en otra línea visual: si la escena
 * no se ha tocado (era la de la línea anterior), se escribe una nueva para la
 * línea elegida.
 */
export async function nuevaImagen(id: string, escena: string, dir?: string): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const actual = leerRefs([x.banner.visual_ref])[0] ?? null;
  const pedida = dir ? (leerRefs([{ dir }])[0] ?? null) : null;
  const cambia = Boolean(pedida && pedida.dir !== actual?.dir);
  const ref = cambia ? pedida : actual;
  let texto = escena.trim();
  if (cambia && ref && (!texto || texto === (x.banner.image_prompt ?? "").trim())) {
    const e = await escribirEscena(leerCopy(x.banner.copy), ref, x.campaign.image_brief);
    await apuntarGasto(supabase, userId, x.campaign.id, "texto", e.gastos);
    if (!e.escena) return { error: e.error ?? "No se ha podido escribir la escena." };
    texto = e.escena;
  }
  const err = await pintar(supabase, userId, x.banner, texto || x.banner.image_prompt || "", "medium", ref);
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
  const carpeta = await carpetaDelFormulario(supabase, userId, formData);
  if (carpeta.error) return { error: carpeta.error };
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
      folder_id: carpeta.id,
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

// ── Ideas de imagen ───────────────────────────────────────
export async function idearImagenesAccion(input: {
  course: string;
  objective: string;
  angles: string[];
  imageBrief: string;
  evitar: string[];
}): Promise<{ ideas: Ref[]; error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const course = input.course as AdCourse;
  const objective = input.objective as AdObjective;
  if (!CURSOS.includes(course) || !OBJETIVOS.includes(objective)) return { ideas: [], error: "Hay un valor del formulario que no se reconoce." };
  const r = await idearImagenes({
    course,
    objective,
    angles: ANGULOS.filter((a) => input.angles.includes(a)),
    imageBrief: String(input.imageBrief ?? "").slice(0, 1000),
    evitar: (input.evitar ?? []).map((t) => String(t).slice(0, 120)).slice(0, 36),
  });
  // Todavía no hay campaña: el gasto se apunta suelto, cuenta en el mes igual.
  await apuntarGasto(supabase, userId, null, "texto", r.gastos);
  return { ideas: r.ideas, error: r.error };
}

// ── Más como esta ─────────────────────────────────────────
/**
 * `n` variantes del mismo estilo que una que funciona: misma composición,
 * plantilla, elementos, botón y línea visual; cambian un poco el texto y la
 * foto.
 */
export async function masComoEsta(id: string, n: number): Promise<{ error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const x = await cargar(supabase, id);
  if (!x) return { error: "La variante no existe." };
  const { banner, campaign } = x;
  const total = Math.min(MAX_NUEVAS, Math.max(1, Math.round(n)));
  const angle = ((ANGULOS as readonly string[]).includes(banner.angle ?? "") ? banner.angle : "obstaculo") as Angulo;
  const ref = leerRefs([banner.visual_ref])[0];
  const conFoto = usaImagen(banner.template) && banner.image_source !== "subida";

  const r = await generarVariantes({
    course: campaign.course,
    objective: campaign.objective,
    language: campaign.language,
    angles: Array.from({ length: total }, () => angle),
    count: total,
    audience: campaign.audience ?? undefined,
    notes: campaign.notes ?? undefined,
    refs: conFoto && ref ? Array.from({ length: total }, () => ref) : undefined,
    imageBrief: campaign.image_brief ?? undefined,
    parecidas: { copy: leerCopy(banner.copy), escena: banner.image_prompt ?? "" },
    formatos: esNativo(banner.layout) ? Array.from({ length: total }, () => banner.layout as Nativo) : undefined,
  });
  await apuntarGasto(supabase, userId, campaign.id, "texto", r.gastos);
  if (!r.variantes.length) return { error: r.error ?? "No se ha generado ninguna variante." };
  // Una foto subida no se puede variar: las nuevas van con la plantilla de marca.
  const template = conFoto ? banner.template : usaImagen(banner.template) ? "marca" : banner.template;
  const g = await guardarVariantes(supabase, userId, campaign, r.variantes, template, "medium", {
    layout: banner.layout,
    elements: banner.elements,
    cta_style: banner.cta_style,
    folder_id: banner.folder_id,
  });
  const t = await traducirPendientes(supabase, userId, campaign.id);
  revalidatePath(`/admin/banners/${campaign.id}`);
  return { error: g.error ?? t.error };
}

// ── Carpetas ──────────────────────────────────────────────
// Para ordenar los banners. Una variante está en una carpeta o en ninguna;
// una campaña tiene la carpeta en la que entran sus variantes nuevas.

const nombreCarpeta = (v: unknown) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, 80);

async function nuevaCarpeta(supabase: Supabase, userId: string, nombre: string): Promise<{ id?: string; error?: string }> {
  const name = nombreCarpeta(nombre);
  if (!name) return { error: "Ponle nombre a la carpeta." };
  const { data, error } = await supabase.from("ad_folders").insert({ name, created_by: userId }).select("id").single();
  return error || !data ? { error: `No se pudo crear la carpeta: ${error?.message ?? ""}` } : { id: data.id as string };
}

/** «folder»: "" (ninguna), el id de una, o "nueva" con su nombre en «folder_new». */
async function carpetaDelFormulario(supabase: Supabase, userId: string, formData: FormData): Promise<{ id: string | null; error?: string }> {
  const v = String(formData.get("folder") ?? "");
  if (!v) return { id: null };
  if (v === "nueva") {
    const r = await nuevaCarpeta(supabase, userId, String(formData.get("folder_new") ?? ""));
    return { id: r.id ?? null, error: r.error };
  }
  const { data } = await supabase.from("ad_folders").select("id").eq("id", v).maybeSingle();
  return data ? { id: data.id as string } : { id: null, error: "Esa carpeta ya no existe." };
}

/** El destino de un movimiento: una carpeta, ninguna (null) o una nueva con ese nombre. */
type Destino = { id: string | null } | { nueva: string };

async function resolverDestino(supabase: Supabase, userId: string, d: Destino): Promise<{ id: string | null; error?: string }> {
  if ("nueva" in d) {
    const r = await nuevaCarpeta(supabase, userId, d.nueva);
    return { id: r.id ?? null, error: r.error };
  }
  if (!d.id) return { id: null };
  const { data } = await supabase.from("ad_folders").select("id").eq("id", d.id).maybeSingle();
  return data ? { id: data.id as string } : { id: null, error: "Esa carpeta ya no existe." };
}

export async function crearCarpeta(nombre: string): Promise<{ id?: string; error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const r = await nuevaCarpeta(supabase, userId, nombre);
  revalidatePath("/admin/banners", "layout");
  return r;
}

export async function renombrarCarpeta(id: string, nombre: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const name = nombreCarpeta(nombre);
  if (!name) return { error: "Ponle nombre a la carpeta." };
  const { error } = await supabase.from("ad_folders").update({ name }).eq("id", id);
  revalidatePath("/admin/banners", "layout");
  return error ? { error: error.message } : {};
}

/** Borra la carpeta, no su contenido: las variantes se quedan sin carpeta. */
export async function borrarCarpeta(id: string): Promise<{ error?: string }> {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("ad_folders").delete().eq("id", id);
  revalidatePath("/admin/banners", "layout");
  return error ? { error: error.message } : {};
}

/** Mueve variantes sueltas (de la galería) a una carpeta, a ninguna o a una nueva. */
export async function moverBanners(ids: string[], destino: Destino): Promise<{ id?: string | null; error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const lista = [...new Set(ids)].filter((x) => /^[0-9a-f-]{36}$/.test(x)).slice(0, 1000);
  if (!lista.length) return { error: "No has elegido ninguna variante." };
  const d = await resolverDestino(supabase, userId, destino);
  if (d.error) return { error: d.error };
  const { error } = await supabase.from("ad_banners").update({ folder_id: d.id }).in("id", lista);
  revalidatePath("/admin/banners", "layout");
  return error ? { error: error.message } : { id: d.id };
}

/** Una campaña entera a una carpeta: sus variantes y las que se generen después. */
export async function moverCampana(campaignId: string, destino: Destino): Promise<{ id?: string | null; error?: string }> {
  const { supabase, userId } = await assertAdmin();
  const d = await resolverDestino(supabase, userId, destino);
  if (d.error) return { error: d.error };
  const [a, b] = await Promise.all([
    supabase.from("ad_campaigns").update({ folder_id: d.id }).eq("id", campaignId),
    supabase.from("ad_banners").update({ folder_id: d.id }).eq("campaign_id", campaignId),
  ]);
  revalidatePath("/admin/banners", "layout");
  const error = a.error ?? b.error;
  return error ? { error: error.message } : { id: d.id };
}
