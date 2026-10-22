import { strToU8, zipSync } from "fflate";
import { ImageResponse } from "next/og";

import { FORMATOS, FORMATO_IDS, leerCopy, type Plantilla } from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import { Banner, fuentes } from "@/lib/banners/render";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Los aprobados de una campaña en un .zip, ordenados como las carpetas del
// equipo (POST, POST VERTICAL, STORY), más un textos.txt con lo que hay que
// pegar en el Administrador de anuncios para cada variante.

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new Response("No autorizado", { status: 403 });

  const { id } = await params;
  const supabase = await createClient();
  const { data: campaign } = await supabase.from("ad_campaigns").select("*").eq("id", id).maybeSingle();
  if (!campaign) return new Response("No existe", { status: 404 });
  const c = campaign as AdCampaign;
  const { data } = await supabase.from("ad_banners").select("*").eq("campaign_id", id).eq("status", "aprobado").order("position");
  const banners = (data ?? []) as AdBanner[];
  if (!banners.length) return new Response("No hay variantes aprobadas en esta campaña.", { status: 404 });

  const fonts = await fuentes();
  const files: Record<string, Uint8Array> = {};
  const textos: string[] = [`${c.name}\n${"=".repeat(c.name.length)}\n`];

  for (const b of banners) {
    const copy = leerCopy(b.copy);
    const imagen = b.image_path ? await leerImagen(b.image_path) : null;
    const n = b.position + 1;
    for (const f of FORMATO_IDS) {
      const { w, h, label, file } = FORMATOS[f];
      const res = new ImageResponse(
        <Banner copy={copy} template={b.template as Plantilla} course={c.course} language={c.language} formato={f} imagen={imagen} />,
        { width: w, height: h, fonts },
      );
      files[`${label}/${file}_v${n}.png`] = new Uint8Array(await res.arrayBuffer());
    }
    textos.push(
      [
        `── Variante ${n} (${b.angle ?? "—"}) ──`,
        `Texto principal:\n${copy.primaryText}`,
        `Titular: ${copy.adHeadline}`,
        `Descripción: ${copy.description}`,
        `Botón: ${copy.cta}`,
        `Texto alternativo: ${copy.alt}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  files["textos.txt"] = strToU8(textos.join("\n\n") + "\n");

  const zip = zipSync(files, { level: 0 });
  const nombre = c.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") || "banners";
  return new Response(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${nombre}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
