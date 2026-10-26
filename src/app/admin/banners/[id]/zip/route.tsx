import { strToU8, zipSync } from "fflate";
import { ImageResponse } from "next/og";

import { FORMATOS, FORMATO_IDS, leerBoton, leerComposicion, leerCopy, leerElementos, otroIdioma, type Plantilla } from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import { Banner, fuentes } from "@/lib/banners/render";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Los aprobados de una campaña en un .zip, ordenados como las carpetas del
// equipo (POST, POST VERTICAL, STORY), más un textos.txt con lo que hay que
// pegar en el Administrador de anuncios para cada variante. Si la campaña
// tiene variantes en los dos idiomas, una carpeta por idioma (ES/, EN/).

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

  const idiomas = [c.language, otroIdioma(c.language)] as const;
  const bilingue = banners.some((b) => b.copy_alt);
  const textos: Record<string, string[]> = Object.fromEntries(idiomas.map((l) => [l, [`${c.name} · ${l.toUpperCase()}\n${"=".repeat(c.name.length + 5)}\n`]]));

  for (const b of banners) {
    const imagen = b.image_path ? await leerImagen(b.image_path) : null;
    const elementos = leerElementos(b.elements);
    const n = b.position + 1;
    for (const lang of idiomas) {
      const raw = lang === c.language ? b.copy : b.copy_alt;
      if (!raw) continue;
      const copy = leerCopy(raw);
      const carpeta = bilingue ? `${lang.toUpperCase()}/` : "";
      for (const f of FORMATO_IDS) {
        const { w, h, label, file } = FORMATOS[f];
        const res = new ImageResponse(
          <Banner copy={copy} template={b.template as Plantilla} course={c.course} language={lang} formato={f} imagen={imagen} elementos={elementos} composicion={leerComposicion(b.layout)} boton={leerBoton(b.cta_style)} />,
          { width: w, height: h, fonts },
        );
        files[`${carpeta}${label}/${file}_v${n}_${lang.toUpperCase()}.png`] = new Uint8Array(await res.arrayBuffer());
      }
      textos[lang].push(
        [
          `── Variante ${n} (${b.angle ?? "—"}) ──`,
          `Texto principal:\n${copy.primaryText}`,
          `Titular: ${copy.adHeadline}`,
          `Descripción: ${copy.description}`,
          `Botón: ${copy.cta}`,
          `Texto alternativo: ${copy.alt}`,
        ].join("\n"),
      );
    }
  }
  for (const lang of idiomas) {
    if (textos[lang].length > 1) files[`${bilingue ? `${lang.toUpperCase()}/` : ""}textos.txt`] = strToU8(textos[lang].join("\n\n") + "\n");
  }

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
