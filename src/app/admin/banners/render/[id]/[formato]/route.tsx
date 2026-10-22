import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { FORMATOS, PLANTILLAS, leerCopy, type FormatoId, type Plantilla } from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import { Banner, fuentes } from "@/lib/banners/render";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// La pieza en PNG, a tamaño exacto.
//
//   /admin/banners/render/<banner>/<post|vertical|story>
//     ?d=<borrador>   textos y plantilla sin guardar (vista previa en vivo)
//     &dl=1           descarga con el nombre de la carpeta del equipo
//
// Sólo administradores: el proxy ya exige sesión en /admin, y esto exige rol.

export const runtime = "nodejs";

function leerBorrador(raw: string | null): { copy?: unknown; template?: string } | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "campana";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; formato: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new Response("No autorizado", { status: 403 });

  const { id, formato } = await params;
  if (!(formato in FORMATOS)) return new Response("Formato desconocido", { status: 404 });
  const f = formato as FormatoId;

  const supabase = await createClient();
  const { data: banner } = await supabase.from("ad_banners").select("*").eq("id", id).maybeSingle();
  if (!banner) return new Response("No existe", { status: 404 });
  const b = banner as AdBanner;
  const { data: campaign } = await supabase.from("ad_campaigns").select("*").eq("id", b.campaign_id).maybeSingle();
  const c = campaign as AdCampaign | null;
  if (!c) return new Response("No existe", { status: 404 });

  const sp = req.nextUrl.searchParams;
  const borrador = leerBorrador(sp.get("d"));
  const copy = leerCopy(borrador?.copy ?? b.copy);
  const template = (PLANTILLAS as string[]).includes(borrador?.template ?? "") ? (borrador!.template as Plantilla) : (b.template as Plantilla);

  const imagen = b.image_path ? await leerImagen(b.image_path) : null;
  const { w, h, file } = FORMATOS[f];

  const res = new ImageResponse(
    <Banner copy={copy} template={template} course={c.course} language={c.language} formato={f} imagen={imagen} imagenIa={b.image_source === "ia"} />,
    { width: w, height: h, fonts: await fuentes() },
  );

  const headers = new Headers(res.headers);
  // Privado: son borradores de campaña, no se cachean en ningún CDN.
  headers.set("Cache-Control", "private, no-store");
  if (sp.get("dl")) {
    headers.set("Content-Disposition", `attachment; filename="${file}_${slug(c.name)}_v${b.position + 1}.png"`);
  }
  return new Response(res.body, { status: res.status, headers });
}
