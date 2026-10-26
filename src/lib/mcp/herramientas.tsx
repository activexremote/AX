import "server-only";

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { z } from "zod";

import {
  anadirVariantes,
  crearCampana,
  estadoBanner,
  guardarBanner,
  masComoEsta,
  moverBanners,
  moverCampana,
  reescribirBanner,
} from "@/app/admin/banners/actions";
import {
  crearPublicacion,
  desecharVariante,
  guardarEnNevera,
  guardarVariante,
  programarEnProximoHueco,
  programarVariante,
  regenerarCanal,
} from "@/app/admin/publicaciones/actions";
import { LINEAS } from "@/lib/banners/direcciones";
import {
  ANGULOS,
  BOTON_COLORES,
  BOTON_FORMAS,
  COMPOSICIONES,
  CURSOS,
  FORMATOS,
  FORMATO_IDS,
  MAX_GALERIA,
  OBJETIVOS,
  PLANTILLAS,
  leerBoton,
  leerComposicion,
  leerCopy,
  leerElementos,
  type FormatoId,
  type Plantilla,
} from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import { Banner, fuentes } from "@/lib/banners/render";
import { contextoMcp } from "@/lib/mcp/contexto";
import { firmar } from "@/lib/mcp/oauth";
import { CANALES, NOMBRE_CANAL, parseBody, revisar } from "@/lib/social/canales";
import type { AdBanner, AdCampaign, SocialChannel, SocialPost, SocialVariant } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Lo que Claude puede hacer con banners y publicaciones
//
//  Cada herramienta llama a la MISMA acción que el botón del panel (con sus
//  normas, sus límites y su revisión), así que desde Claude no se puede hacer
//  nada que el panel no permita. Lo que devuelven está escrito para leerse en
//  una conversación: ids para la siguiente llamada, textos y avisos.
// ══════════════════════════════════════════════════════════

const ctx = () => {
  const c = contextoMcp();
  if (!c) throw new Error("Sin contexto del conector.");
  return c;
};

const texto = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const fallo = (t: string) => ({ content: [{ type: "text" as const, text: `⚠️ ${t}` }], isError: true });

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium", timeStyle: "short" }) : "—";

// ── Banners: lectura ──────────────────────────────────────

async function carpetas(): Promise<{ id: string; name: string }[]> {
  const { data } = await ctx().supabase.from("ad_folders").select("id, name").order("name");
  return (data ?? []) as { id: string; name: string }[];
}

/** Una carpeta por id o por nombre (sin distinguir mayúsculas). */
async function buscarCarpeta(v: string): Promise<{ id: string; name: string } | null> {
  const lista = await carpetas();
  const k = v.trim().toLowerCase();
  return lista.find((c) => c.id === v || c.name.toLowerCase() === k) ?? null;
}

function resumenVariante(b: AdBanner, carpetaDe: Map<string, string>): string {
  const c = leerCopy(b.copy);
  const flags = b.review?.flags ?? [];
  return [
    `### v${b.position + 1} · ${b.status} · id ${b.id}`,
    `Composición: ${leerComposicion(b.layout)} · plantilla: ${b.template} · ángulo: ${b.angle ?? "—"}${b.visual_ref?.dir ? ` · línea visual: ${b.visual_ref.dir}` : ""} · carpeta: ${b.folder_id ? carpetaDe.get(b.folder_id) ?? "—" : "sin carpeta"}`,
    c.kicker ? `Etiqueta: ${c.kicker}` : "",
    `Titular: ${c.headline}`,
    c.sub ? `Línea de apoyo: ${c.sub}` : "",
    c.chat ? `Contenido del formato:\n${c.chat}` : "",
    `Botón: ${c.cta} (${JSON.stringify(leerBoton(b.cta_style))})`,
    `Texto principal (Meta): ${c.primaryText}`,
    `Titular (Meta): ${c.adHeadline} · Descripción: ${c.description}`,
    b.copy_alt ? `Versión en el otro idioma: ${leerCopy(b.copy_alt).headline}` : "",
    flags.length ? `Avisos: ${flags.map((f) => `[${f.level}] ${f.rule}: ${f.text}`).join(" | ")}` : "Avisos: ninguno",
  ]
    .filter(Boolean)
    .join("\n");
}

async function detalleCampana(id: string): Promise<string | null> {
  const { supabase } = ctx();
  const { data: c } = await supabase.from("ad_campaigns").select("*").eq("id", id).maybeSingle();
  if (!c) return null;
  const campana = c as AdCampaign;
  const { data } = await supabase.from("ad_banners").select("*").eq("campaign_id", id).order("position");
  const banners = (data ?? []) as AdBanner[];
  const carpetaDe = new Map((await carpetas()).map((f) => [f.id, f.name]));
  return [
    `## ${campana.name} (id ${campana.id})`,
    `Curso: ${campana.course} · objetivo: ${campana.objective} · idioma: ${campana.language}${campana.bilingual ? " + otro" : ""} · carpeta: ${campana.folder_id ? carpetaDe.get(campana.folder_id) ?? "—" : "sin carpeta"}`,
    `${banners.length} variantes (${banners.filter((b) => b.status === "aprobado").length} aprobadas). Para verlas: banners_ver_imagen con el id.`,
    "",
    ...banners.map((b) => resumenVariante(b, carpetaDe)),
  ].join("\n");
}

/**
 * La pieza tal como se descarga, reducida a 540 px de ancho y en JPEG: a
 * tamaño real son más de 1 MB por imagen y una conversación no lo necesita.
 */
async function miniatura(b: AdBanner, c: AdCampaign, formato: FormatoId, alt: boolean): Promise<string> {
  const { w, h } = FORMATOS[formato];
  const imagen = b.image_path ? await leerImagen(b.image_path) : null;
  const copy = leerCopy(alt && b.copy_alt ? b.copy_alt : b.copy);
  const language = alt && b.copy_alt ? (c.language === "es" ? "en" : "es") : c.language;
  const res = new ImageResponse(
    (
      <Banner
        copy={copy}
        template={b.template as Plantilla}
        course={c.course}
        language={language}
        formato={formato}
        imagen={imagen}
        elementos={leerElementos(b.elements)}
        composicion={leerComposicion(b.layout)}
        boton={leerBoton(b.cta_style)}
      />
    ),
    { width: w, height: h, fonts: await fuentes() },
  );
  const png = Buffer.from(await res.arrayBuffer());
  return (await sharp(png).resize(540).jpeg({ quality: 82 }).toBuffer()).toString("base64");
}

// ── Publicaciones: lectura ────────────────────────────────

const ESTADOS_PUB = { revisar: "borrador", nevera: "nevera", programadas: "programado", publicadas: "publicado", errores: "error" } as const;

function textoDeVariante(v: SocialVariant): string {
  const b = parseBody(v.channel, v.body) as Record<string, unknown>;
  if (v.channel === "x") {
    const hilo = (b.thread as string[]) ?? [];
    return [String(b.text ?? ""), ...hilo.map((t, i) => `[${i + 2}] ${t}`)].join("\n");
  }
  if (v.channel === "linkedin") return String(b.text ?? "");
  return JSON.stringify(b, null, 2);
}

async function detallePublicacion(id: string): Promise<string | null> {
  const { supabase } = ctx();
  const { data: p } = await supabase.from("social_posts").select("*").eq("id", id).maybeSingle();
  if (!p) return null;
  const post = p as SocialPost;
  const { data } = await supabase.from("social_variants").select("*").eq("post_id", id);
  const vs = ((data ?? []) as SocialVariant[]).sort((a, b) => CANALES.indexOf(a.channel) - CANALES.indexOf(b.channel));
  return [
    `## ${post.title} (id ${post.id})`,
    `Idioma: ${post.language}${post.pair_id ? ` · versión en el otro idioma: ${post.pair_id}` : ""} · imágenes: ${post.images.length}`,
    post.topic ? `Tema: ${post.topic}` : "",
    post.source_url ? `Fuente: ${post.source_url}` : "",
    "",
    ...vs.map((v) => {
      const avisos = revisar(v.channel, v.body);
      return [
        `### ${NOMBRE_CANAL[v.channel]} · ${v.status} · variante ${v.id}`,
        v.scheduled_at ? `Programada: ${fecha(v.scheduled_at)}` : "",
        v.published_at ? `Publicada: ${fecha(v.published_at)}${v.external_url ? ` · ${v.external_url}` : ""}` : "",
        v.error ? `Error: ${v.error}` : "",
        textoDeVariante(v),
        avisos.length ? `Avisos: ${avisos.map((a) => `[${a.nivel}] ${a.texto}`).join(" | ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }),
  ]
    .filter((x) => x !== "")
    .join("\n\n");
}

// ── Registro ──────────────────────────────────────────────

const soloLectura = { readOnlyHint: true, openWorldHint: false } as const;
const escribe = { readOnlyHint: false, destructiveHint: false, openWorldHint: false } as const;
const gasta = { readOnlyHint: false, destructiveHint: false, openWorldHint: true } as const;

export function registrarHerramientas(server: McpServer) {
  // ═════ BANNERS ═════

  server.registerTool(
    "banners_carpetas",
    { title: "Carpetas de banners", description: "Lista las carpetas de banners con cuántas variantes tiene cada una.", annotations: soloLectura },
    async () => {
      const lista = await carpetas();
      const { data } = await ctx().supabase.from("ad_banners").select("folder_id");
      const n = (id: string | null) => (data ?? []).filter((b) => (b.folder_id ?? null) === id).length;
      return texto([`Sin carpeta: ${n(null)}`, ...lista.map((c) => `${c.name}: ${n(c.id)} (id ${c.id})`)].join("\n"));
    },
  );

  server.registerTool(
    "banners_campanas",
    {
      title: "Campañas de banners",
      description: "Lista las campañas de banners más recientes, con su carpeta y cuántas variantes tienen por estado.",
      inputSchema: { carpeta: z.string().optional().describe("Id o nombre de carpeta para filtrar"), limite: z.number().int().min(1).max(50).optional() },
      annotations: soloLectura,
    },
    async ({ carpeta, limite }) => {
      const { supabase } = ctx();
      let q = supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false }).limit(limite ?? 15);
      if (carpeta) {
        const f = await buscarCarpeta(carpeta);
        if (!f) return fallo(`No hay ninguna carpeta «${carpeta}».`);
        q = q.eq("folder_id", f.id);
      }
      const { data: camps } = await q;
      const lista = (camps ?? []) as AdCampaign[];
      if (!lista.length) return texto("No hay campañas.");
      const { data: bs } = await supabase.from("ad_banners").select("campaign_id, status").in("campaign_id", lista.map((c) => c.id));
      const carpetaDe = new Map((await carpetas()).map((f) => [f.id, f.name]));
      return texto(
        lista
          .map((c) => {
            const mias = (bs ?? []).filter((b) => b.campaign_id === c.id);
            const por = (s: string) => mias.filter((b) => b.status === s).length;
            return `- ${c.name} · id ${c.id} · ${c.course} · ${fecha(c.created_at)} · carpeta: ${c.folder_id ? carpetaDe.get(c.folder_id) ?? "—" : "sin carpeta"} · ${mias.length} variantes (${por("aprobado")} aprobadas, ${por("borrador")} por revisar, ${por("descartado")} descartadas)`;
          })
          .join("\n"),
      );
    },
  );

  server.registerTool(
    "banners_campana",
    { title: "Ver campaña", description: "Todas las variantes de una campaña con sus textos, composición, botón, carpeta y avisos de las normas de Meta.", inputSchema: { campana_id: z.string() }, annotations: soloLectura },
    async ({ campana_id }) => texto((await detalleCampana(campana_id)) ?? "La campaña no existe."),
  );

  server.registerTool(
    "banners_ver_imagen",
    {
      title: "Ver banner",
      description: "Devuelve la imagen de una o varias variantes tal como se descargan (reducidas a 540 px de ancho). Máximo 6 por llamada.",
      inputSchema: {
        banner_ids: z.array(z.string()).min(1).max(6),
        formato: z.enum(FORMATO_IDS as [FormatoId, ...FormatoId[]]).optional().describe("post (1080×1080), vertical (1080×1350, por defecto) o story (1080×1920)"),
        otro_idioma: z.boolean().optional().describe("La versión en el otro idioma, si la tiene"),
      },
      annotations: soloLectura,
    },
    async ({ banner_ids, formato, otro_idioma }) => {
      const { supabase } = ctx();
      const { data } = await supabase.from("ad_banners").select("*").in("id", banner_ids);
      const bs = (data ?? []) as AdBanner[];
      if (!bs.length) return fallo("No se encuentran esas variantes.");
      const { data: cs } = await supabase.from("ad_campaigns").select("*").in("id", [...new Set(bs.map((b) => b.campaign_id))]);
      const campDe = new Map(((cs ?? []) as AdCampaign[]).map((c) => [c.id, c]));
      const contenido: ({ type: "text"; text: string } | { type: "image"; data: string; mimeType: string })[] = [];
      for (const b of bs) {
        const c = campDe.get(b.campaign_id);
        if (!c) continue;
        contenido.push({ type: "text", text: `${c.name} · v${b.position + 1} · ${b.status} · id ${b.id}` });
        contenido.push({ type: "image", data: await miniatura(b, c, formato ?? "vertical", Boolean(otro_idioma)), mimeType: "image/jpeg" });
      }
      return { content: contenido };
    },
  );

  server.registerTool(
    "banners_crear_campana",
    {
      title: "Crear campaña de banners",
      description:
        "Crea una campaña y genera sus variantes con IA (textos, imágenes y formatos nativos tipo chat, correo o tuit). Gasta saldo de OpenAI y tarda 1-3 minutos. Devuelve la campaña con todas sus variantes.",
      inputSchema: {
        curso: z.enum(CURSOS as [string, ...string[]]).describe("escuela, remote-professional o remote-founder"),
        objetivo: z.enum(OBJETIVOS as [string, ...string[]]).optional().describe("leads (por defecto), alcance o retargeting"),
        variantes: z.number().int().min(1).max(8).optional().describe("Cuántas variantes (5 por defecto)"),
        nativas: z.number().int().min(0).max(8).optional().describe("Cuántas en formato nativo: chat, correo, tuit, nota… (2 por defecto)"),
        angulos: z.array(z.enum(ANGULOS)).optional().describe("Ángulos a usar; por defecto, cinco distintos"),
        plantilla: z.enum(PLANTILLAS as [string, ...string[]]).optional().describe("foto (por defecto), tarjeta o marca (sin foto, no gasta imagen)"),
        idioma: z.enum(["es", "en", "ambos"]).optional(),
        publico: z.string().max(1000).optional(),
        notas: z.string().max(2000).optional().describe("Indicaciones para los textos"),
        que_ver: z.string().max(1000).optional().describe("Qué se quiere ver en las imágenes"),
        lineas_visuales: z.array(z.string()).max(8).optional().describe(`Ids de líneas visuales de referencia (p. ej. ${LINEAS.slice(0, 6).map((l) => l.id).join(", ")}…). Sin ellas, una distinta al azar por variante.`),
        carpeta: z.string().optional().describe("Id o nombre de carpeta; si no existe, se crea con ese nombre"),
        nombre: z.string().max(120).optional(),
        calidad: z.enum(["low", "medium", "high"]).optional().describe("Calidad de imagen (medium por defecto)"),
      },
      annotations: gasta,
    },
    async (a) => {
      const fd = new FormData();
      fd.set("course", a.curso);
      fd.set("objective", a.objetivo ?? "leads");
      for (const x of a.angulos?.length ? a.angulos : ["obstaculo", "aspiracion", "metodo", "directo", "convocatoria"]) fd.append("angles", x);
      fd.set("count", String(a.variantes ?? 5));
      fd.set("native", String(a.nativas ?? 2));
      fd.set("style", a.plantilla ?? "foto");
      fd.set("language", a.idioma ?? "es");
      fd.set("quality", a.calidad ?? "medium");
      if (a.publico) fd.set("audience", a.publico);
      if (a.notas) fd.set("notes", a.notas);
      if (a.que_ver) fd.set("image_brief", a.que_ver);
      if (a.nombre) fd.set("name", a.nombre);
      if (a.lineas_visuales?.length) fd.set("visual", JSON.stringify(a.lineas_visuales.filter((d) => LINEAS.some((l) => l.id === d)).map((dir) => ({ dir }))));
      if (a.carpeta) {
        const f = await buscarCarpeta(a.carpeta);
        if (f) fd.set("folder", f.id);
        else {
          fd.set("folder", "nueva");
          fd.set("folder_new", a.carpeta);
        }
      }
      const r = await crearCampana(fd);
      if (!r.id) return fallo(r.error ?? "No se ha podido crear.");
      return texto(`${r.error ? `⚠️ ${r.error}\n\n` : ""}${await detalleCampana(r.id)}`);
    },
  );

  server.registerTool(
    "banners_anadir_variantes",
    {
      title: "Añadir variantes",
      description: "Añade variantes nuevas a una campaña, distintas entre sí y de las que ya tiene (otra imagen, composición, botón y gancho). Gasta saldo de OpenAI.",
      inputSchema: { campana_id: z.string(), cuantas: z.number().int().min(1).max(8), angulos: z.array(z.enum(ANGULOS)).optional() },
      annotations: gasta,
    },
    async ({ campana_id, cuantas, angulos }) => {
      const r = await anadirVariantes(campana_id, angulos ?? [], cuantas);
      return texto(`${r.error ? `⚠️ ${r.error}\n\n` : ""}${(await detalleCampana(campana_id)) ?? ""}`);
    },
  );

  server.registerTool(
    "banners_mas_como_esta",
    {
      title: "Más como esta",
      description: "Crea variantes del mismo estilo que una (misma composición, plantilla, botón y línea visual); cambian un poco la foto y el texto. Gasta saldo de OpenAI.",
      inputSchema: { banner_id: z.string(), cuantas: z.number().int().min(1).max(8) },
      annotations: gasta,
    },
    async ({ banner_id, cuantas }) => {
      const { data: b } = await ctx().supabase.from("ad_banners").select("campaign_id").eq("id", banner_id).maybeSingle();
      if (!b) return fallo("La variante no existe.");
      const r = await masComoEsta(banner_id, cuantas);
      return texto(`${r.error ? `⚠️ ${r.error}\n\n` : ""}${(await detalleCampana(b.campaign_id as string)) ?? ""}`);
    },
  );

  server.registerTool(
    "banners_estado",
    {
      title: "Aprobar o descartar",
      description: "Cambia el estado de una o varias variantes: aprobado, borrador (por revisar) o descartado. Una variante con avisos que bloquean no se puede aprobar.",
      inputSchema: { banner_ids: z.array(z.string()).min(1).max(50), estado: z.enum(["aprobado", "borrador", "descartado"]) },
      annotations: escribe,
    },
    async ({ banner_ids, estado }) => {
      const res = await Promise.all(banner_ids.map(async (id) => [id, await estadoBanner(id, estado)] as const));
      const mal = res.filter(([, r]) => r.error);
      return texto(
        `${res.length - mal.length} variante(s) → ${estado}.${mal.length ? `\nNo se pudieron cambiar:\n${mal.map(([id, r]) => `- ${id}: ${r.error}`).join("\n")}` : ""}`,
      );
    },
  );

  server.registerTool(
    "banners_editar",
    {
      title: "Editar variante",
      description: "Cambia textos, composición, plantilla o botón de una variante sin regenerar la imagen. Sólo se cambia lo que se pasa.",
      inputSchema: {
        banner_id: z.string(),
        titular: z.string().max(300).optional(),
        linea_apoyo: z.string().max(300).optional(),
        etiqueta: z.string().max(300).optional(),
        boton_texto: z.string().max(300).optional(),
        dato_destacado: z.string().max(300).optional(),
        contenido_formato: z.string().max(1200).optional().describe("Formatos nativos: una línea por mensaje; «> » quien lee, «< » ActiveXRemote"),
        texto_principal: z.string().max(2000).optional(),
        titular_meta: z.string().max(300).optional(),
        descripcion_meta: z.string().max(300).optional(),
        composicion: z.enum(COMPOSICIONES as unknown as [string, ...string[]]).optional(),
        plantilla: z.enum(PLANTILLAS as [string, ...string[]]).optional(),
        boton_forma: z.enum(BOTON_FORMAS).optional(),
        boton_color: z.enum(BOTON_COLORES).optional(),
      },
      annotations: escribe,
    },
    async (a) => {
      const { data } = await ctx().supabase.from("ad_banners").select("*").eq("id", a.banner_id).maybeSingle();
      if (!data) return fallo("La variante no existe.");
      const b = data as AdBanner;
      const copy = leerCopy(b.copy);
      const cambios: [keyof typeof copy, string | undefined][] = [
        ["headline", a.titular],
        ["sub", a.linea_apoyo],
        ["kicker", a.etiqueta],
        ["cta", a.boton_texto],
        ["extra", a.dato_destacado],
        ["chat", a.contenido_formato],
        ["primaryText", a.texto_principal],
        ["adHeadline", a.titular_meta],
        ["description", a.descripcion_meta],
      ];
      for (const [k, v] of cambios) if (v !== undefined) copy[k] = v;
      const boton = { ...leerBoton(b.cta_style), ...(a.boton_forma ? { forma: a.boton_forma } : {}), ...(a.boton_color ? { color: a.boton_color } : {}) };
      const r = await guardarBanner(b.id, { copy, template: a.plantilla ?? b.template, layout: a.composicion, boton });
      if (r.error) return fallo(r.error);
      const carpetaDe = new Map((await carpetas()).map((f) => [f.id, f.name]));
      const { data: nuevo } = await ctx().supabase.from("ad_banners").select("*").eq("id", b.id).maybeSingle();
      return texto(`Guardado.\n\n${resumenVariante(nuevo as AdBanner, carpetaDe)}`);
    },
  );

  server.registerTool(
    "banners_reescribir",
    { title: "Reescribir textos", description: "La IA reescribe los textos de una variante con unas indicaciones (la imagen no cambia).", inputSchema: { banner_id: z.string(), indicaciones: z.string().max(1000) }, annotations: gasta },
    async ({ banner_id, indicaciones }) => {
      const r = await reescribirBanner(banner_id, indicaciones);
      if (r.error) return fallo(r.error);
      const { data } = await ctx().supabase.from("ad_banners").select("*").eq("id", banner_id).maybeSingle();
      return texto(resumenVariante(data as AdBanner, new Map((await carpetas()).map((f) => [f.id, f.name]))));
    },
  );

  server.registerTool(
    "banners_mover",
    {
      title: "Mover a carpeta",
      description: "Mueve variantes sueltas, o una campaña entera (con lo que se genere después), a una carpeta. Si la carpeta no existe, se crea. Sin carpeta: las saca de cualquier carpeta.",
      inputSchema: {
        banner_ids: z.array(z.string()).max(500).optional(),
        campana_id: z.string().optional(),
        carpeta: z.string().optional().describe("Id o nombre; vacío = sin carpeta"),
      },
      annotations: escribe,
    },
    async ({ banner_ids, campana_id, carpeta }) => {
      if (!banner_ids?.length && !campana_id) return fallo("Pasa banner_ids o campana_id.");
      const f = carpeta?.trim() ? await buscarCarpeta(carpeta) : null;
      const destino = !carpeta?.trim() ? { id: null } : f ? { id: f.id } : { nueva: carpeta.trim() };
      const r = campana_id ? await moverCampana(campana_id, destino) : await moverBanners(banner_ids ?? [], destino);
      if (r.error) return fallo(r.error);
      return texto(`Hecho: ${campana_id ? "campaña" : `${banner_ids?.length} variante(s)`} → ${carpeta?.trim() || "sin carpeta"}.`);
    },
  );

  server.registerTool(
    "banners_descargar",
    {
      title: "Enlace de descarga",
      description: `Crea un enlace (válido 1 hora) para descargar en .zip las variantes indicadas, en los formatos que se pidan, con los textos para Meta. Máximo ${MAX_GALERIA}.`,
      inputSchema: {
        banner_ids: z.array(z.string()).max(MAX_GALERIA).optional(),
        campana_id: z.string().optional().describe("Todas las aprobadas de esta campaña"),
        formatos: z.array(z.enum(FORMATO_IDS as [FormatoId, ...FormatoId[]])).optional(),
        ambos_idiomas: z.boolean().optional(),
      },
      annotations: soloLectura,
    },
    async ({ banner_ids, campana_id, formatos, ambos_idiomas }) => {
      const { supabase, userId, origen } = ctx();
      let ids = banner_ids ?? [];
      if (!ids.length && campana_id) {
        const { data } = await supabase.from("ad_banners").select("id").eq("campaign_id", campana_id).eq("status", "aprobado");
        ids = (data ?? []).map((b) => b.id as string);
      }
      if (!ids.length) return fallo("No hay variantes que descargar (¿la campaña no tiene aprobadas?).");
      if (ids.length > MAX_GALERIA) return fallo(`Como mucho ${MAX_GALERIA} por descarga.`);
      const t = firmar({ u: userId, i: ids, f: formatos ?? FORMATO_IDS, a: ambos_idiomas ?? true }, 3600);
      return texto(`Enlace de descarga (${ids.length} variantes, válido 1 hora):\n${origen}/api/mcp/descarga?t=${t}`);
    },
  );

  // ═════ PUBLICACIONES ═════

  server.registerTool(
    "publicaciones_listar",
    {
      title: "Publicaciones",
      description: "Lista publicaciones por estado: revisar (borradores por revisar), nevera (listas sin fecha), programadas, publicadas o errores.",
      inputSchema: {
        estado: z.enum(["revisar", "nevera", "programadas", "publicadas", "errores"]),
        canal: z.enum(CANALES as [SocialChannel, ...SocialChannel[]]).optional(),
        limite: z.number().int().min(1).max(50).optional(),
      },
      annotations: soloLectura,
    },
    async ({ estado, canal, limite }) => {
      const { supabase } = ctx();
      let q = supabase.from("social_variants").select("*").eq("status", ESTADOS_PUB[estado]);
      if (canal) q = q.eq("channel", canal);
      q = estado === "programadas" ? q.order("scheduled_at", { ascending: true }) : q.order("updated_at", { ascending: false });
      const { data } = await q.limit(limite ?? 20);
      const vs = (data ?? []) as SocialVariant[];
      if (!vs.length) return texto("No hay ninguna.");
      const { data: ps } = await supabase.from("social_posts").select("id, title").in("id", [...new Set(vs.map((v) => v.post_id))]);
      const titulo = new Map((ps ?? []).map((p) => [p.id as string, p.title as string]));
      return texto(
        vs
          .map(
            (v) =>
              `- ${titulo.get(v.post_id) ?? "—"} · ${NOMBRE_CANAL[v.channel]} · variante ${v.id} · publicación ${v.post_id}${v.scheduled_at ? ` · ${fecha(v.scheduled_at)}` : ""}\n  ${textoDeVariante(v).slice(0, 220).replace(/\n/g, " ")}`,
          )
          .join("\n"),
      );
    },
  );

  server.registerTool(
    "publicaciones_ver",
    { title: "Ver publicación", description: "Una publicación con todos sus canales (X, LinkedIn, blog), su estado, fechas y avisos.", inputSchema: { publicacion_id: z.string() }, annotations: soloLectura },
    async ({ publicacion_id }) => texto((await detallePublicacion(publicacion_id)) ?? "La publicación no existe."),
  );

  server.registerTool(
    "publicaciones_crear",
    {
      title: "Crear publicación",
      description: "Escribe con IA una publicación para X, LinkedIn y/o el blog a partir de un tema o un enlace. Queda por revisar (no se publica sola). Gasta saldo de DeepSeek.",
      inputSchema: {
        tema: z.string().max(4000).optional(),
        enlace: z.string().url().optional().describe("Artículo o página de la que partir"),
        canales: z.array(z.enum(CANALES as [SocialChannel, ...SocialChannel[]])).min(1),
        idioma: z.enum(["es", "en", "ambos"]).optional(),
        titulo: z.string().max(200).optional(),
      },
      annotations: gasta,
    },
    async (a) => {
      if (!a.tema && !a.enlace) return fallo("Pasa un tema o un enlace.");
      const fd = new FormData();
      if (a.tema) fd.set("topic", a.tema);
      if (a.enlace) fd.set("source_url", a.enlace);
      if (a.titulo) fd.set("title", a.titulo);
      fd.set("language", a.idioma ?? "es");
      for (const c of a.canales) fd.append("channels", c);
      const r = await crearPublicacion(fd);
      if (!r.id) return fallo(r.error ?? "No se ha podido crear.");
      return texto(`${r.error ? `⚠️ ${r.error}\n\n` : ""}${await detallePublicacion(r.id)}`);
    },
  );

  server.registerTool(
    "publicaciones_editar",
    {
      title: "Editar canal",
      description: "Cambia el texto de un canal de una publicación. Para X: texto del primer post y, si es hilo, los siguientes. Para el blog, pasa `cuerpo` con sus campos.",
      inputSchema: {
        variante_id: z.string(),
        texto: z.string().max(6000).optional(),
        hilo: z.array(z.string().max(2000)).max(11).optional().describe("Sólo X: los posts del hilo después del primero"),
        cuerpo: z.record(z.string(), z.unknown()).optional().describe("Avanzado: el cuerpo completo del canal (se mezcla con el actual)"),
      },
      annotations: escribe,
    },
    async ({ variante_id, texto: t, hilo, cuerpo }) => {
      const { data } = await ctx().supabase.from("social_variants").select("*").eq("id", variante_id).maybeSingle();
      if (!data) return fallo("No existe.");
      const v = data as SocialVariant;
      const nuevo = { ...(v.body ?? {}), ...(cuerpo ?? {}), ...(t !== undefined ? { text: t } : {}), ...(hilo ? { thread: hilo } : {}) };
      const r = await guardarVariante(variante_id, nuevo);
      if ("error" in r && r.error) return fallo(r.error);
      return texto((await detallePublicacion(v.post_id)) ?? "Guardado.");
    },
  );

  server.registerTool(
    "publicaciones_regenerar",
    {
      title: "Regenerar canal",
      description: "La IA vuelve a escribir un canal de una publicación con unas indicaciones. Vuelve a quedar por revisar. Gasta saldo de DeepSeek.",
      inputSchema: { publicacion_id: z.string(), canal: z.enum(CANALES as [SocialChannel, ...SocialChannel[]]), indicaciones: z.string().max(1000).optional() },
      annotations: gasta,
    },
    async ({ publicacion_id, canal, indicaciones }) => {
      const r = await regenerarCanal(publicacion_id, canal, indicaciones ?? "");
      if ("error" in r && r.error) return fallo(r.error);
      return texto((await detallePublicacion(publicacion_id)) ?? "Hecho.");
    },
  );

  server.registerTool(
    "publicaciones_programar",
    {
      title: "Programar",
      description:
        "Decide cuándo sale un canal: una fecha y hora (ISO 8601 con zona, p. ej. 2027-01-12T09:00:00+01:00), «proximo_hueco» (el siguiente día libre según el ritmo), «nevera» (lista, sin fecha) o «quitar» (vuelve a por revisar). Lo programado lo publica el campus a su hora.",
      inputSchema: { variante_id: z.string(), cuando: z.string() },
      annotations: escribe,
    },
    async ({ variante_id, cuando }) => {
      const r =
        cuando === "proximo_hueco"
          ? await programarEnProximoHueco(variante_id)
          : cuando === "nevera"
            ? await guardarEnNevera(variante_id)
            : await programarVariante(variante_id, cuando === "quitar" ? null : cuando);
      if ("error" in r && r.error) return fallo(r.error);
      const { data } = await ctx().supabase.from("social_variants").select("status, scheduled_at").eq("id", variante_id).maybeSingle();
      return texto(`Hecho: ${data?.status}${data?.scheduled_at ? ` · ${fecha(data.scheduled_at as string)}` : ""}.`);
    },
  );

  server.registerTool(
    "publicaciones_desechar",
    { title: "Desechar canal", description: "Borra un canal de una publicación (si era el último, la publicación entera). Lo publicado no se puede desechar.", inputSchema: { variante_id: z.string() }, annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false } },
    async ({ variante_id }) => {
      const r = await desecharVariante(variante_id);
      if ("error" in r && r.error) return fallo(r.error);
      return texto("Desechado.");
    },
  );
}
