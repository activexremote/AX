import { FORMATO_IDS, MAX_GALERIA, type FormatoId } from "@/lib/banners/formatos";
import { armarZip } from "@/lib/banners/zip";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Las variantes que se eligen en la galería, en un .zip: una carpeta por
// campaña y, dentro, la misma estructura que la descarga de una campaña.
// POST (un formulario): con muchas elegidas, los ids no caben en una URL.

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new Response("No autorizado", { status: 403 });

  const form = await req.formData();
  const ids = [...new Set(form.getAll("ids").map(String))].filter((x) => /^[0-9a-f-]{36}$/.test(x));
  if (!ids.length) return new Response("No has elegido ninguna variante.", { status: 400 });
  if (ids.length > MAX_GALERIA) return new Response(`Como mucho ${MAX_GALERIA} variantes por descarga.`, { status: 400 });
  const pedidos = form.getAll("formatos").map(String).filter((f): f is FormatoId => (FORMATO_IDS as string[]).includes(f));
  const formatos = pedidos.length ? pedidos : FORMATO_IDS;
  const ambos = form.get("ambos") === "1";

  const supabase = await createClient();
  const { data } = await supabase.from("ad_banners").select("*").in("id", ids).order("position");
  const banners = (data ?? []) as AdBanner[];
  if (!banners.length) return new Response("No se encuentran esas variantes.", { status: 404 });
  const { data: camps } = await supabase.from("ad_campaigns").select("*").in("id", [...new Set(banners.map((b) => b.campaign_id))]);
  const campanas = (camps ?? []) as AdCampaign[];

  const grupos = campanas
    .map((campaign) => ({ campaign, banners: banners.filter((b) => b.campaign_id === campaign.id) }))
    .filter((g) => g.banners.length);
  const zip = await armarZip(grupos, { formatos, ambos, porCampana: true });
  const fecha = new Date().toISOString().slice(0, 10);
  return new Response(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="banners-${fecha}-${banners.length}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
