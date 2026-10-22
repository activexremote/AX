import "server-only";

import { cache } from "react";

import { publicAiSettings } from "@/lib/ai/settings";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Lo que enseñan la cabecera y el listado de banners. En `cache`: el layout
// y la página lo piden en la misma petición.

export type CampanaResumen = AdCampaign & {
  banners: Pick<AdBanner, "id" | "status" | "position" | "updated_at" | "template">[];
};

export const cargarBanners = cache(async () => {
  const supabase = await createClient();
  const inicioMes = new Date();
  inicioMes.setUTCDate(1);
  inicioMes.setUTCHours(0, 0, 0, 0);

  const [campanas, banners, usos, ai] = await Promise.all([
    supabase.from("ad_campaigns").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("ad_banners").select("id, campaign_id, status, position, updated_at, template").order("position"),
    supabase.from("ad_usage").select("cost_usd").gte("created_at", inicioMes.toISOString()),
    publicAiSettings(),
  ]);

  const porCampana = new Map<string, CampanaResumen["banners"]>();
  for (const b of (banners.data ?? []) as (CampanaResumen["banners"][number] & { campaign_id: string })[]) {
    const lista = porCampana.get(b.campaign_id) ?? [];
    lista.push(b);
    porCampana.set(b.campaign_id, lista);
  }

  const lista: CampanaResumen[] = ((campanas.data ?? []) as AdCampaign[]).map((c) => ({ ...c, banners: porCampana.get(c.id) ?? [] }));
  const gastoMes = (usos.data ?? []).reduce((n, u) => n + Number(u.cost_usd ?? 0), 0);
  const aprobados = lista.reduce((n, c) => n + c.banners.filter((b) => b.status === "aprobado").length, 0);

  return { campanas: lista, gastoMes, aprobados, ai };
});
