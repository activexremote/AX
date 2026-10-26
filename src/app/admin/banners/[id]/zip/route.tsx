import { FORMATO_IDS } from "@/lib/banners/formatos";
import { armarZip, slug } from "@/lib/banners/zip";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Los aprobados de una campaña en un .zip (lib/banners/zip.tsx), en los tres
// formatos y los dos idiomas si los tiene.

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

  const zip = await armarZip([{ campaign: c, banners }], { formatos: FORMATO_IDS, ambos: true, porCampana: false });
  return new Response(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug(c.name) || "banners"}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
