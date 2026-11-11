import type {
  AdsData,
  AdsRaw,
  CallRow,
  CallsData,
  CountBy,
  CrmData,
  CrmRaw,
  CrossKpi,
  FunnelStep,
  Ga4Data,
  Ga4Raw,
  LeadRow,
  OrderRow,
  VentasData,
} from "@/lib/kpis/types";
import { inLastDays, pct1, per, round2, shiftDay } from "@/lib/kpis/util";

// ══════════════════════════════════════════════════════════
//  Las fórmulas del panel de KPIs
//
//  Funciones puras, sin red: reciben lo que han traído las fuentes y
//  devuelven lo que se pinta. Ventana: los últimos 30 días en Madrid, hoy
//  incluido; «7 días» es hoy y los 6 anteriores, frente a los 7 previos.
// ══════════════════════════════════════════════════════════

/** Los 30 días de la ventana, del más antiguo a hoy. */
const days30 = (today: string) => Array.from({ length: 30 }, (_, i) => shiftDay(today, i - 29));

function countBy<T>(rows: T[], key: (r: T) => string): CountBy[] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1);
  return [...m].map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count);
}

// ───────────── Leads y estados ─────────────

/** Estados de Zoho que significan que ya se habló con el lead. */
const HABLADO = new Set(["Contacted", "Contact in Future", "Pre-Qualified", "Not Qualified", "Lost Lead"]);
const CUALIFICADO = new Set(["Pre-Qualified"]);

/** Clave para las listas sin valor: la página la traduce. */
export const SIN_VALOR = "—";

export function crmData(c: CrmRaw, today: string): CrmData {
  const recent = c.leads.filter((l) => inLastDays(l.day, today, 30));
  const last7 = c.leads.filter((l) => inLastDays(l.day, today, 7)).length;
  const prev7 = c.leads.filter((l) => inLastDays(l.day, shiftDay(today, -7), 7)).length;
  const withSource = recent.filter((l) => l.source).length;

  const pipeline = { openDeals: 0, openAmount: 0, wonDeals: 0, wonAmount: 0, lostDeals: 0, winRate: null as number | null };
  const stages = new Map<string, { deals: number; amount: number }>();
  for (const d of c.deals) {
    const s = d.stage ?? SIN_VALOR;
    const st = stages.get(s) ?? { deals: 0, amount: 0 };
    st.deals++;
    st.amount += d.amount;
    stages.set(s, st);
    if (s === "Closed Won" || s === "Cierre ganado") {
      pipeline.wonDeals++;
      pipeline.wonAmount += d.amount;
    } else if (s.startsWith("Closed Lost") || s.startsWith("Cierre perdido")) pipeline.lostDeals++;
    else {
      pipeline.openDeals++;
      pipeline.openAmount += d.amount;
    }
  }
  const closed = pipeline.wonDeals + pipeline.lostDeals;
  pipeline.winRate = closed ? Math.round((pipeline.wonDeals / closed) * 100) : null;

  const byDay = new Map<string, number>();
  for (const l of recent) byDay.set(l.day, (byDay.get(l.day) ?? 0) + 1);

  return {
    leadsTotal: c.leads.length,
    capped: c.capped,
    leads30: recent.length,
    leadsLast7: last7,
    leadsPrev7: prev7,
    attribution: { withSource, total: recent.length, pct: recent.length ? Math.round((withSource / recent.length) * 100) : null },
    students: c.contactDays.length,
    studentsNew30: c.contactDays.filter((d) => inLastDays(d, today, 30)).length,
    pipeline,
    invoiced30: round2(c.invoices.filter((i) => inLastDays(i.day, today, 30)).reduce((s, i) => s + i.total, 0)),
    leadsDaily: days30(today).map((day) => ({ day, leads: byDay.get(day) ?? 0 })),
    leadsBySource: countBy(recent, (l) => l.source ?? SIN_VALOR),
    leadsByStatus: countBy(recent, (l) => l.status ?? SIN_VALOR),
    dealsByStage: [...stages].map(([stage, v]) => ({ stage, ...v })).sort((a, b) => b.amount - a.amount || b.deals - a.deals),
  };
}

// ───────────── Llamadas ─────────────

/** Una llamada en la que se habló: no perdida y con duración. */
const conectada = (c: CallRow) => c.type !== "missed" && c.durationSec > 0;

export function callsData(calls: CallRow[], duplicates: number, leads: LeadRow[], today: string): CallsData {
  const win = calls.filter((c) => inLastDays(c.day, today, 30));
  const n = (t: CallRow["type"]) => win.filter((c) => c.type === t).length;
  const inbound = n("inbound");
  const missed = n("missed");
  const talked = win.filter(conectada);
  const talkSec = talked.reduce((s, c) => s + c.durationSec, 0);

  // Primera llamada de cada lead. Las perdidas no cuentan: llamó él y nadie lo cogió.
  const first = new Map<string, number>();
  for (const c of calls) {
    if (!c.relatedId || c.type === "missed") continue;
    const t = Date.parse(c.start);
    if (Number.isFinite(t) && t < (first.get(c.relatedId) ?? Infinity)) first.set(c.relatedId, t);
  }
  const recent = leads.filter((l) => inLastDays(l.day, today, 30));
  let called = 0;
  const hours: number[] = [];
  for (const l of recent) {
    const t = first.get(l.id);
    if (t === undefined) continue;
    called++;
    const h = (t - Date.parse(l.createdTime)) / 3_600_000;
    if (h >= 0) hours.push(h);
  }

  return {
    total: win.length,
    inbound,
    outbound: n("outbound"),
    missed,
    connected: talked.length,
    missedPct: inbound + missed ? Math.round((missed / (inbound + missed)) * 100) : null,
    avgDurationSec: talked.length ? Math.round(talkSec / talked.length) : null,
    talkMinutes: Math.round(talkSec / 60),
    leadsCalled: { called, total: recent.length, pct: recent.length ? Math.round((called / recent.length) * 100) : null },
    avgHoursToFirstCall: hours.length ? Math.round((hours.reduce((s, h) => s + h, 0) / hours.length) * 10) / 10 : null,
    duplicates,
    daily: days30(today).map((day) => {
      const d = win.filter((c) => c.day === day);
      return {
        day,
        inbound: d.filter((c) => c.type === "inbound").length,
        outbound: d.filter((c) => c.type === "outbound" || c.type === "other").length,
        missed: d.filter((c) => c.type === "missed").length,
      };
    }),
  };
}

// ───────────── Matrículas ─────────────

const COBRADO: OrderRow["status"][] = ["pagado", "en_plazos", "completado"];
const ABANDONO: OrderRow["status"][] = ["iniciado", "expirado"];
/** Como en /admin/matriculas: en plazos, `amount` es lo de cada plazo y son 3. */
const PLAZOS = 3;

const cobrado = (o: OrderRow) => (!COBRADO.includes(o.status) ? 0 : o.plan === "plazos" ? o.amount * Math.max(1, o.instalmentsPaid) : o.amount);
const porCobrar = (o: OrderRow) => (o.plan === "plazos" && o.status === "en_plazos" ? o.amount * Math.max(0, PLAZOS - o.instalmentsPaid) : 0);
/** Lo que vale la matrícula entera: en plazos, los 3. */
const valor = (o: OrderRow) => (o.plan === "plazos" ? o.amount * PLAZOS : o.amount);

export function ventasData(orders: OrderRow[], today: string): VentasData {
  const win = orders.filter((o) => inLastDays(o.day, today, 30));
  const paid = win.filter((o) => COBRADO.includes(o.status));
  const lost = win.filter((o) => ABANDONO.includes(o.status));

  const ofertas = new Map<string, { n: number; cobrado: number }>();
  for (const o of paid) {
    const v = ofertas.get(o.offer) ?? { n: 0, cobrado: 0 };
    v.n++;
    v.cobrado += cobrado(o);
    ofertas.set(o.offer, v);
  }

  return {
    matriculas30: paid.length,
    matriculasTotal: orders.filter((o) => COBRADO.includes(o.status)).length,
    cobrado30: paid.reduce((s, o) => s + cobrado(o), 0),
    cobradoTotal: orders.reduce((s, o) => s + cobrado(o), 0),
    porCobrar: orders.reduce((s, o) => s + porCobrar(o), 0),
    abandonados30: lost.length,
    abandonadoValor30: lost.reduce((s, o) => s + valor(o), 0),
    porOferta: [...ofertas].map(([offer, v]) => ({ offer, ...v })).sort((a, b) => b.cobrado - a.cobrado),
    daily: days30(today).map((day) => ({
      day,
      matriculas: paid.filter((o) => o.day === day).length,
      abandonos: lost.filter((o) => o.day === day).length,
    })),
  };
}

// ───────────── Anuncios y web ─────────────

export function adsData(raw: AdsRaw, today: string): AdsData {
  const t = raw.totals;
  const byDay = new Map(raw.daily.map((r) => [r.day.slice(0, 10), r]));
  return {
    kpi: {
      spendEur: round2(t?.spendEur ?? 0),
      spendLocal: round2(t?.spend ?? 0),
      currency: t?.currency ?? null,
      impressions: t?.impressions ?? 0,
      reach: t?.reach ?? null,
      clicks: t?.clicks ?? 0,
      ctrPct: t ? pct1(t.clicks, t.impressions) : null,
      cpcEur: t ? per(t.spendEur, t.clicks) : null,
      conversions: Math.round((t?.conversions ?? 0) * 100) / 100,
      cplEur: t ? per(t.spendEur, t.conversions) : null,
      cpmEur: t?.impressions ? round2((t.spendEur / t.impressions) * 1000) : null,
    },
    daily: days30(today).map((day) => {
      const r = byDay.get(day);
      return { day, spendEur: round2(r?.spendEur ?? 0), impressions: r?.impressions ?? 0, clicks: r?.clicks ?? 0, conversions: r?.conversions ?? 0 };
    }),
    campaigns: raw.campaigns
      .map((r) => ({ ...r, spendEur: round2(r.spendEur), ctrPct: pct1(r.clicks, r.impressions), cplEur: per(r.spendEur, r.conversions) }))
      .sort((a, b) => b.spendEur - a.spendEur),
    via: raw.via,
    updatedAt: raw.updatedAt,
  };
}

export function ga4Data(raw: Ga4Raw): Ga4Data {
  const t = raw.totals;
  return {
    hasData: Boolean(t),
    kpi: t
      ? {
          sessions: t.sessions,
          users: t.totalUsers,
          newUsers: t.newUsers,
          engagementPct: Math.round((t.engagementRate <= 1 ? t.engagementRate * 100 : t.engagementRate) * 10) / 10,
          conversions: t.keyEvents,
        }
      : null,
    channels: [...raw.channels].sort((a, b) => b.sessions - a.sessions),
  };
}

// ───────────── El embudo y lo cruzado ─────────────

/**
 * Del anuncio a la matrícula. Cada paso es null si su fuente no está
 * conectada, y su tasa se mide frente al paso anterior que sí tiene dato.
 * Los leads contactados son los que tienen una llamada con conversación o un
 * estado de Zoho que lo implica; los cualificados, los «Pre-Qualified».
 */
export function funnel(input: {
  ads: AdsData[];
  ga4: Ga4Data | null;
  crm: CrmRaw | null;
  calls: CallRow[] | null;
  ventas: VentasData | null;
  today: string;
}): FunnelStep[] {
  const { ads, ga4, crm, calls, ventas, today } = input;
  const recent = crm ? crm.leads.filter((l) => inLastDays(l.day, today, 30)) : null;
  const habladas = new Set((calls ?? []).filter(conectada).map((c) => c.relatedId));
  const contactados = recent ? recent.filter((l) => habladas.has(l.id) || (l.status && HABLADO.has(l.status))).length : null;
  const cualificados = recent ? recent.filter((l) => l.status && CUALIFICADO.has(l.status)).length : null;

  const values: Omit<FunnelStep, "rate">[] = [
    { key: "impresiones", value: ads.length ? ads.reduce((s, a) => s + a.kpi.impressions, 0) : null },
    { key: "clics", value: ads.length ? ads.reduce((s, a) => s + a.kpi.clicks, 0) : null },
    { key: "sesiones", value: ga4?.kpi ? ga4.kpi.sessions : null },
    { key: "leads", value: recent ? recent.length : null },
    { key: "contactados", value: contactados },
    { key: "cualificados", value: cualificados },
    { key: "matriculas", value: ventas ? ventas.matriculas30 : null },
  ];
  let prev: number | null = null;
  return values.map((s) => {
    const rate = s.value !== null && prev ? pct1(s.value, prev) : null;
    if (s.value !== null) prev = s.value;
    return { ...s, rate };
  });
}

export function crossKpi(meta: AdsData | null, googleAds: AdsData | null, leads30: number, ventas: VentasData | null): CrossKpi {
  const spendEur = round2((meta?.kpi.spendEur ?? 0) + (googleAds?.kpi.spendEur ?? 0));
  const cobrado = (ventas?.cobrado30 ?? 0) / 100;
  return {
    spendEur,
    spendBySource: { meta: meta ? meta.kpi.spendEur : null, googleAds: googleAds ? googleAds.kpi.spendEur : null },
    cplCrmEur: spendEur ? per(spendEur, leads30) : null,
    cacEur: spendEur ? per(spendEur, ventas?.matriculas30 ?? 0) : null,
    roas: spendEur && cobrado ? round2(cobrado / spendEur) : null,
  };
}
