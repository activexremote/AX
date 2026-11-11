import type { DateRange, Ga4Raw } from "@/lib/kpis/types";
import { fetchJson, missingEnv, num } from "@/lib/kpis/util";
import { serviceAccountToken } from "@/lib/kpis/fuentes/google-auth";

// ══════════════════════════════════════════════════════════
//  Google Analytics 4: Data API con una cuenta de servicio
//
//  Propiedad ActiveXRemote (555158490). En GA4 las conversiones se llaman
//  ahora «eventos clave» (keyEvents).
// ══════════════════════════════════════════════════════════

const GA4_ENV = ["GA4_PROPERTY_ID", "GOOGLE_SA_EMAIL", "GOOGLE_SA_PRIVATE_KEY"];

type ReportRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

async function runReport(range: DateRange, metrics: string[], dimensions: string[] = []): Promise<ReportRow[]> {
  const token = await serviceAccountToken(process.env.GOOGLE_SA_EMAIL ?? "", process.env.GOOGLE_SA_PRIVATE_KEY ?? "", "https://www.googleapis.com/auth/analytics.readonly");
  const j = await fetchJson<{ rows?: ReportRow[] }>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: range.since, endDate: range.until }],
        metrics: metrics.map((name) => ({ name })),
        dimensions: dimensions.map((name) => ({ name })),
        limit: 1000,
      }),
    },
    "GA4 Data API",
  );
  return j.rows ?? [];
}

export const ga4Missing = (): string[] => missingEnv(GA4_ENV);

export async function loadGa4(range: DateRange): Promise<Ga4Raw> {
  const [totalRows, channelRows] = await Promise.all([
    runReport(range, ["sessions", "totalUsers", "newUsers", "engagementRate", "keyEvents"]),
    runReport(range, ["sessions", "engagedSessions", "keyEvents"], ["sessionDefaultChannelGroup"]),
  ]);
  const m = totalRows[0]?.metricValues?.map((v) => num(v.value));
  return {
    // Sin sesiones, la API no devuelve filas (o las devuelve a 0).
    totals: m && m[0] > 0 ? { sessions: m[0], totalUsers: m[1], newUsers: m[2], engagementRate: m[3], keyEvents: m[4] } : null,
    channels: channelRows.map((r) => ({
      channel: r.dimensionValues?.[0]?.value || "(sin canal)",
      sessions: num(r.metricValues?.[0]?.value),
      engagedSessions: num(r.metricValues?.[1]?.value),
      keyEvents: num(r.metricValues?.[2]?.value),
    })),
  };
}
