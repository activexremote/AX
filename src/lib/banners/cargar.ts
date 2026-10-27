import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { FORMATOS, PLANTILLAS, leerBoton, leerComposicion, leerCopy, leerElementos, otroIdioma, type FormatoId, type Plantilla } from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import type { Pieza } from "@/lib/banners/pieza";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Una pieza, lista para pintar
//
//  Lo que comparten el PNG (render/) y el MP4 (video/): la variante, su
//  campaña y, si llega, el borrador sin guardar del editor.
//
//     ?lang=alt       los textos en el otro idioma de una campaña bilingüe
//     &d=<borrador>   textos, plantilla y elementos sin guardar
//
//  Sólo administradores: el proxy ya exige sesión en /admin, y esto exige rol.
// ══════════════════════════════════════════════════════════

export type PiezaCargada = {
  pieza: Omit<Pieza, "anim" | "fuente" | "texto" | "editando">;
  banner: AdBanner;
  campaign: AdCampaign;
  formato: FormatoId;
};

function leerBorrador(raw: string | null): { copy?: unknown; template?: string; elements?: unknown; layout?: string; boton?: unknown } | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export const slugArchivo = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "campana";

/** La pieza, o la respuesta de error que toca. Con la sesión del navegador: sólo administradores. */
export async function cargarPieza(id: string, formato: string, sp: URLSearchParams): Promise<PiezaCargada | Response> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new Response("No autorizado", { status: 403 });
  return piezaDeVariante(await createClient(), id, formato, sp);
}

/** Lo mismo con un cliente ya autorizado (el enlace firmado del conector de Claude). */
export async function piezaDeVariante(supabase: SupabaseClient, id: string, formato: string, sp: URLSearchParams): Promise<PiezaCargada | Response> {
  if (!(formato in FORMATOS)) return new Response("Formato desconocido", { status: 404 });
  const f = formato as FormatoId;

  const { data: banner } = await supabase.from("ad_banners").select("*").eq("id", id).maybeSingle();
  if (!banner) return new Response("No existe", { status: 404 });
  const b = banner as AdBanner;
  const { data: campaign } = await supabase.from("ad_campaigns").select("*").eq("id", b.campaign_id).maybeSingle();
  const c = campaign as AdCampaign | null;
  if (!c) return new Response("No existe", { status: 404 });

  const borrador = leerBorrador(sp.get("d"));
  const alt = sp.get("lang") === "alt" && Boolean(b.copy_alt);
  const template = (PLANTILLAS as string[]).includes(borrador?.template ?? "") ? (borrador!.template as Plantilla) : (b.template as Plantilla);
  return {
    banner: b,
    campaign: c,
    formato: f,
    pieza: {
      copy: leerCopy(borrador?.copy ?? (alt ? b.copy_alt : b.copy)),
      template,
      course: c.course,
      language: alt ? otroIdioma(c.language) : c.language,
      formato: f,
      imagen: b.image_path ? await leerImagen(b.image_path) : null,
      elementos: leerElementos(borrador?.elements ?? b.elements),
      composicion: leerComposicion(borrador?.layout ?? b.layout),
      boton: leerBoton(borrador?.boton ?? b.cta_style),
    },
  };
}
