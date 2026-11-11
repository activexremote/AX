import type { AdsRaw, DateRange } from "@/lib/kpis/types";
import { fetchJson, missingEnv, num, round2 } from "@/lib/kpis/util";
import { rateToEur } from "@/lib/kpis/fuentes/fx";

// ══════════════════════════════════════════════════════════
//  Meta Ads: Insights de la API de Marketing
//
//  Cuenta ActivexRemote (act_3200742800124710), factura en AED. Clics = clics
//  en el enlace; conversiones = leads del píxel, con la atribución
//  predeterminada de la cuenta. No tienen por qué coincidir con los leads que
//  entran en Zoho.
// ══════════════════════════════════════════════════════════

const META_ENV = ["META_ACCESS_TOKEN", "META_AD_ACCOUNT_ID"];

type InsightRow = {
  spend?: string;
  impressions?: string;
  reach?: string;
  actions?: { action_type: string; value: string }[];
  account_currency?: string;
  campaign_name?: string;
  date_start?: string;
};

const action = (r: InsightRow, type: string): number => num(r.actions?.find((a) => a.action_type === type)?.value);

async function insights(range: DateRange, params: Record<string, string>): Promise<InsightRow[]> {
  const version = process.env.META_GRAPH_VERSION || "v23.0";
  const qs = new URLSearchParams({
    time_range: JSON.stringify({ since: range.since, until: range.until }),
    limit: "500",
    access_token: process.env.META_ACCESS_TOKEN ?? "",
    ...params,
  });
  let url: string | undefined = `https://graph.facebook.com/${version}/${process.env.META_AD_ACCOUNT_ID}/insights?${qs}`;
  const out: InsightRow[] = [];
  while (url) {
    const j: { data?: InsightRow[]; paging?: { next?: string } } = await fetchJson(url, {}, "Meta Insights");
    out.push(...(j.data ?? []));
    url = j.paging?.next;
  }
  return out;
}

export const metaMissing = (): string[] => missingEnv(META_ENV);

export async function loadMeta(range: DateRange): Promise<AdsRaw> {
  const common = "spend,impressions,actions,account_currency";
  const [totalRows, dailyRows, campaignRows] = await Promise.all([
    insights(range, { level: "account", fields: `${common},reach` }),
    insights(range, { level: "account", fields: common, time_increment: "1" }),
    insights(range, { level: "campaign", fields: `campaign_name,${common}` }),
  ]);

  const currency = totalRows[0]?.account_currency ?? dailyRows[0]?.account_currency ?? "EUR";
  const rate = await rateToEur(currency);
  const eur = (v: unknown) => round2(num(v) * rate);
  const clicks = (r: InsightRow) => action(r, "link_click");
  const leads = (r: InsightRow) => action(r, "offsite_conversion.fb_pixel_lead");

  const t = totalRows[0];
  return {
    totals: t
      ? { currency, spend: round2(num(t.spend)), spendEur: eur(t.spend), impressions: num(t.impressions), reach: num(t.reach), clicks: clicks(t), conversions: leads(t) }
      : null,
    daily: dailyRows.map((r) => ({ day: String(r.date_start), spendEur: eur(r.spend), impressions: num(r.impressions), clicks: clicks(r), conversions: leads(r) })),
    campaigns: campaignRows.map((r) => ({ campaign: String(r.campaign_name ?? ""), spendEur: eur(r.spend), impressions: num(r.impressions), clicks: clicks(r), conversions: leads(r) })),
  };
}
