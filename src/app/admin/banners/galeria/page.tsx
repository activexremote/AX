import { Galeria, type ItemGaleria } from "@/components/admin/banners/galeria";
import { BUCKET } from "@/lib/banners/imagen";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Todas las variantes de todas las campañas, pintadas en el navegador con el
// mismo componente que el PNG (sin pedir nada al servidor por cada una). Las
// fotos, con enlaces firmados de una hora: el bucket es privado.
export default async function GaleriaPage() {
  const locale = await getLocale();
  const copy = banCopy[locale];
  const supabase = await createClient();

  const [{ data: camps }, { data: filas }] = await Promise.all([
    supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false }),
    supabase.from("ad_banners").select("*").order("created_at", { ascending: false }).limit(1000),
  ]);
  const campanas = (camps ?? []) as AdCampaign[];
  const banners = (filas ?? []) as AdBanner[];
  const porId = new Map(campanas.map((c) => [c.id, c]));

  const rutas = banners.map((b) => b.image_path).filter((p): p is string => Boolean(p));
  const firmadas = rutas.length ? (await createAdminClient().storage.from(BUCKET).createSignedUrls(rutas, 3600)).data ?? [] : [];
  const urlDe = new Map(firmadas.filter((x) => x.signedUrl && x.path).map((x) => [x.path as string, x.signedUrl]));

  // Por campaña (la más reciente primero) y, dentro, en su orden.
  const orden = new Map(campanas.map((c, i) => [c.id, i]));
  banners.sort((a, b) => (orden.get(a.campaign_id) ?? 0) - (orden.get(b.campaign_id) ?? 0) || a.position - b.position);

  const items: ItemGaleria[] = banners
    .filter((b) => porId.has(b.campaign_id))
    .map((b) => {
      const c = porId.get(b.campaign_id)!;
      return {
        id: b.id,
        campaignId: c.id,
        campaignName: c.name,
        course: c.course,
        language: c.language,
        n: b.position + 1,
        status: b.status,
        angle: b.angle,
        template: b.template,
        layout: b.layout,
        copy: b.copy,
        elements: b.elements,
        boton: b.cta_style,
        imagen: b.image_path ? urlDe.get(b.image_path) ?? null : null,
        bilingue: Boolean(b.copy_alt),
      };
    });

  return (
    <div className="axr-admin-page axr-bangal-page">
      <div className="axr-pubpage-head">
        <h1>{copy.galTitle}</h1>
        <p>{copy.galLead}</p>
      </div>
      <Galeria items={items} campanas={campanas.map((c) => ({ id: c.id, name: c.name }))} copy={copy} />
    </div>
  );
}
