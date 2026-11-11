import type { AdsCampaignRow, AdsRaw, DateRange } from "@/lib/kpis/types";
import { fetchJson, missingEnv, num, round2 } from "@/lib/kpis/util";
import { rateToEur } from "@/lib/kpis/fuentes/fx";
import { refreshTokenAccess, serviceAccountToken } from "@/lib/kpis/fuentes/google-auth";

// ══════════════════════════════════════════════════════════
//  Google Ads, por uno de dos caminos
//
//  A · La hoja de Google que rellena cada hora el script de Google Ads
//      (docs/kpis-ventas.md). No pide developer token ni volver a autorizar
//      con la cuenta de Google. Se lee con la cuenta de servicio de GA4.
//  B · La API de Google Ads (GAQL), con developer token aprobado y un refresh
//      token de usuario.
//
//  Con GOOGLE_ADS_SHEET_ID puesto se usa la A y se ignora la B.
//  Ojo: GOOGLE_ADS_CUSTOMER_ID son los 10 dígitos de arriba en Google Ads,
//  no el AW-18411611106 (ése es la etiqueta de conversión).
// ══════════════════════════════════════════════════════════

const API_ENV = ["GOOGLE_ADS_DEVELOPER_TOKEN", "GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN", "GOOGLE_ADS_CUSTOMER_ID"];
const SHEET_ENV = ["GOOGLE_ADS_SHEET_ID", "GOOGLE_SA_EMAIL", "GOOGLE_SA_PRIVATE_KEY"];

export function googleAdsMissing(): string[] {
  if (process.env.GOOGLE_ADS_SHEET_ID) return missingEnv(SHEET_ENV);
  const api = missingEnv(API_ENV);
  return api.length ? ["GOOGLE_ADS_SHEET_ID (o las credenciales de la API)"] : [];
}

export const loadGoogleAds = (range: DateRange): Promise<AdsRaw> => (process.env.GOOGLE_ADS_SHEET_ID ? fromSheet() : fromApi(range));

// ───────────── A · La hoja del script ─────────────

type Cell = string | number | boolean | null;

/** Un rango con cabecera a objetos { columna: valor }. */
function rows(values: Cell[][] | undefined): Record<string, Cell>[] {
  if (!values || values.length < 2) return [];
  const [header, ...body] = values;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [String(h), r[i] ?? null])));
}

async function fromSheet(): Promise<AdsRaw> {
  const v = process.env.GOOGLE_ADS_SHEET_ID ?? "";
  // Vale el ID o la URL entera de la hoja.
  const id = v.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? v;
  const token = await serviceAccountToken(process.env.GOOGLE_SA_EMAIL ?? "", process.env.GOOGLE_SA_PRIVATE_KEY ?? "", "https://www.googleapis.com/auth/spreadsheets.readonly");
  const qs = new URLSearchParams({ valueRenderOption: "UNFORMATTED_VALUE" });
  for (const r of ["resumen!A1:I2", "diario!A1:E200", "campanas!A1:E1000"]) qs.append("ranges", r);
  const j = await fetchJson<{ valueRanges?: { values?: Cell[][] }[] }>(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchGet?${qs}`,
    { headers: { Authorization: `Bearer ${token}` } },
    "Hoja de Google Ads",
  );
  const [resumen, diario, campanas] = (j.valueRanges ?? []).map((x) => rows(x.values));
  const s = resumen?.[0];
  if (!s) throw new Error("Hoja de Google Ads: la pestaña «resumen» está vacía. ¿Se ha ejecutado el script?");

  const currency = String(s.moneda || "EUR");
  const rate = await rateToEur(currency);
  const eur = (x: Cell) => round2(num(x) * rate);

  return {
    totals: { currency, spend: round2(num(s.inversion)), spendEur: eur(s.inversion), impressions: num(s.impresiones), clicks: num(s.clics), conversions: num(s.conversiones) },
    daily: (diario ?? []).map((r) => ({ day: String(r.fecha).slice(0, 10), spendEur: eur(r.inversion), impressions: num(r.impresiones), clicks: num(r.clics), conversions: num(r.conversiones) })),
    campaigns: (campanas ?? []).map((r) => ({ campaign: String(r.campana ?? ""), spendEur: eur(r.inversion), impressions: num(r.impresiones), clicks: num(r.clics), conversions: num(r.conversiones) })),
    via: "sheet",
    updatedAt: s.actualizado ? String(s.actualizado) : undefined,
  };
}

// ───────────── B · La API de Google Ads ─────────────

type AdsRow = {
  customer?: { currencyCode?: string };
  campaign?: { name?: string };
  segments?: { date?: string };
  metrics?: { costMicros?: string; impressions?: string; clicks?: string; conversions?: number };
};

async function search(query: string): Promise<AdsRow[]> {
  const token = await refreshTokenAccess(process.env.GOOGLE_ADS_CLIENT_ID ?? "", process.env.GOOGLE_ADS_CLIENT_SECRET ?? "", process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "");
  const version = process.env.GOOGLE_ADS_API_VERSION || "v22";
  const customer = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").replace(/-/g, "");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN ?? "",
    "Content-Type": "application/json",
  };
  // Sólo si se entra a través de una cuenta de administrador (MCC).
  if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) headers["login-customer-id"] = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, "");

  const out: AdsRow[] = [];
  let pageToken: string | undefined;
  do {
    const j: { results?: AdsRow[]; nextPageToken?: string } = await fetchJson(
      `https://googleads.googleapis.com/${version}/customers/${customer}/googleAds:search`,
      { method: "POST", headers, body: JSON.stringify({ query, ...(pageToken ? { pageToken } : {}) }) },
      "Google Ads API",
    );
    out.push(...(j.results ?? []));
    pageToken = j.nextPageToken;
  } while (pageToken);
  return out;
}

async function fromApi(r: DateRange): Promise<AdsRaw> {
  const where = `segments.date BETWEEN '${r.since}' AND '${r.until}'`;
  const m = "metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions";
  const [totalRows, dailyRows, campaignRows] = await Promise.all([
    search(`SELECT customer.currency_code, ${m} FROM customer WHERE ${where}`),
    search(`SELECT segments.date, ${m} FROM customer WHERE ${where}`),
    search(`SELECT campaign.name, ${m} FROM campaign WHERE ${where} AND metrics.impressions > 0`),
  ]);

  const currency = totalRows[0]?.customer?.currencyCode ?? "EUR";
  const rate = await rateToEur(currency);
  const money = (x: AdsRow) => num(x.metrics?.costMicros) / 1_000_000;

  // FROM campaign con la fecha en el WHERE da una fila por campaña y día.
  const byCampaign = new Map<string, AdsCampaignRow>();
  for (const x of campaignRows) {
    const name = String(x.campaign?.name ?? "");
    const c = byCampaign.get(name) ?? { campaign: name, spendEur: 0, impressions: 0, clicks: 0, conversions: 0 };
    c.spendEur = round2(c.spendEur + money(x) * rate);
    c.impressions += num(x.metrics?.impressions);
    c.clicks += num(x.metrics?.clicks);
    c.conversions += num(x.metrics?.conversions);
    byCampaign.set(name, c);
  }

  const t = totalRows[0];
  return {
    totals: t
      ? { currency, spend: round2(money(t)), spendEur: round2(money(t) * rate), impressions: num(t.metrics?.impressions), clicks: num(t.metrics?.clicks), conversions: num(t.metrics?.conversions) }
      : null,
    daily: dailyRows.map((x) => ({ day: String(x.segments?.date), spendEur: round2(money(x) * rate), impressions: num(x.metrics?.impressions), clicks: num(x.metrics?.clicks), conversions: num(x.metrics?.conversions) })),
    campaigns: [...byCampaign.values()],
    via: "api",
  };
}
