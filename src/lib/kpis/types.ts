// ══════════════════════════════════════════════════════════
//  Tipos del panel de KPIs de ventas
//
//  «Raw» es lo que devuelve cada fuente ya normalizado; «Data», lo que pinta
//  el panel. Cada fuente va en una `Section`: si le faltan credenciales o
//  falla, su bloque lo dice y el resto del panel sigue funcionando.
// ══════════════════════════════════════════════════════════

export type Section<T> =
  | { status: "ok"; data: T }
  | { status: "error"; message: string }
  | { status: "not_configured"; message: string };

/** Rango cerrado [since, until], YYYY-MM-DD en hora de Madrid. */
export type DateRange = { since: string; until: string };

// ───────────────────────── Zoho CRM ─────────────────────────

export type LeadRow = {
  id: string;
  createdTime: string;
  /** Día de creación en Madrid. */
  day: string;
  source: string | null;
  status: string | null;
};

export type DealRow = { stage: string | null; amount: number; day: string };

export type CrmRaw = {
  leads: LeadRow[];
  /** true si hay más leads de los que se han leído (el tope de páginas). */
  capped: boolean;
  deals: DealRow[];
  /** Días de alta de los alumnos (módulo Contacts). */
  contactDays: string[];
  invoices: { day: string; total: number }[];
};

// ───────────────────────── Llamadas (Aircall en Zoho) ─────────────────────────

export type CallType = "inbound" | "outbound" | "missed" | "other";

export type CallRow = {
  type: CallType;
  start: string;
  day: string;
  durationSec: number;
  /** El lead o contacto de la llamada (What_Id). */
  relatedId: string | null;
};

export type CallsRaw = {
  calls: CallRow[];
  /** Registros repetidos que se han descartado (la integración de Aircall duplica algunos). */
  duplicates: number;
};

// ───────────────────────── Matrículas del campus (Stripe) ─────────────────────────

export type OrderRow = {
  day: string;
  status: "iniciado" | "pagado" | "en_plazos" | "completado" | "fallido" | "expirado" | "reembolsado";
  plan: string;
  offer: string;
  /** Céntimos de la sesión de Stripe (en plazos, lo de cada plazo). */
  amount: number;
  instalmentsPaid: number;
};

// ───────────────────────── Anuncios y web ─────────────────────────

export type AdsTotals = {
  currency: string;
  spend: number;
  spendEur: number;
  impressions: number;
  reach?: number;
  clicks: number;
  /** Leads del píxel (Meta) o conversiones (Google Ads). */
  conversions: number;
};

export type AdsDailyRow = { day: string; spendEur: number; impressions: number; clicks: number; conversions: number };
export type AdsCampaignRow = { campaign: string; spendEur: number; impressions: number; clicks: number; conversions: number };

export type AdsRaw = {
  totals: AdsTotals | null;
  daily: AdsDailyRow[];
  campaigns: AdsCampaignRow[];
  via?: "api" | "sheet";
  /** Con la hoja de Google Ads: cuándo la actualizó el script. */
  updatedAt?: string;
};

export type Ga4Totals = { sessions: number; totalUsers: number; newUsers: number; engagementRate: number; keyEvents: number };
export type Ga4ChannelRow = { channel: string; sessions: number; engagedSessions: number; keyEvents: number };
export type Ga4Raw = { totals: Ga4Totals | null; channels: Ga4ChannelRow[] };

export type RawData = {
  crm: Section<CrmRaw>;
  calls: Section<CallsRaw>;
  ventas: Section<OrderRow[]>;
  meta: Section<AdsRaw>;
  googleAds: Section<AdsRaw>;
  ga4: Section<Ga4Raw>;
};

// ───────────────────────── Lo que pinta el panel ─────────────────────────

export type CountBy = { key: string; count: number };

export type CrmData = {
  leadsTotal: number;
  capped: boolean;
  leads30: number;
  leadsLast7: number;
  leadsPrev7: number;
  /** Leads de los 30 días con «Lead Source» informado. */
  attribution: { withSource: number; total: number; pct: number | null };
  students: number;
  studentsNew30: number;
  pipeline: { openDeals: number; openAmount: number; wonDeals: number; wonAmount: number; lostDeals: number; winRate: number | null };
  invoiced30: number;
  /** 30 filas, de la más antigua a hoy. */
  leadsDaily: { day: string; leads: number }[];
  leadsBySource: CountBy[];
  leadsByStatus: CountBy[];
  dealsByStage: { stage: string; deals: number; amount: number }[];
};

export type CallsData = {
  total: number;
  inbound: number;
  outbound: number;
  missed: number;
  /** Conectadas: con conversación (duración > 0) y no perdidas. */
  connected: number;
  missedPct: number | null;
  avgDurationSec: number | null;
  talkMinutes: number;
  /** Leads de los 30 días con al menos una llamada no perdida. */
  leadsCalled: { called: number; total: number; pct: number | null };
  avgHoursToFirstCall: number | null;
  duplicates: number;
  daily: { day: string; inbound: number; outbound: number; missed: number }[];
};

export type VentasData = {
  /** Matrículas cobradas (pagado, en plazos o completado) creadas en los 30 días. */
  matriculas30: number;
  matriculasTotal: number;
  /** Céntimos cobrados de las matrículas de los 30 días. */
  cobrado30: number;
  cobradoTotal: number;
  /** Céntimos que quedan por cobrar en plazos. */
  porCobrar: number;
  /** Pagos empezados y no terminados en los 30 días, y lo que valían. */
  abandonados30: number;
  abandonadoValor30: number;
  porOferta: { offer: string; n: number; cobrado: number }[];
  /** 30 filas. */
  daily: { day: string; matriculas: number; abandonos: number }[];
};

export type AdsKpi = {
  spendEur: number;
  spendLocal: number;
  currency: string | null;
  impressions: number;
  reach: number | null;
  clicks: number;
  ctrPct: number | null;
  cpcEur: number | null;
  conversions: number;
  cplEur: number | null;
  cpmEur: number | null;
};

export type AdsCampaignView = AdsCampaignRow & { ctrPct: number | null; cplEur: number | null };

export type AdsData = {
  kpi: AdsKpi;
  /** 30 filas; los días sin anuncios valen 0. */
  daily: AdsDailyRow[];
  campaigns: AdsCampaignView[];
  via?: "api" | "sheet";
  updatedAt?: string;
};

export type Ga4Data = {
  hasData: boolean;
  kpi: { sessions: number; users: number; newUsers: number; engagementPct: number; conversions: number } | null;
  channels: Ga4ChannelRow[];
};

export type FunnelKey = "impresiones" | "clics" | "sesiones" | "leads" | "contactados" | "cualificados" | "matriculas";

export type FunnelStep = {
  key: FunnelKey;
  /** null cuando su fuente no está conectada. */
  value: number | null;
  /** % frente al paso anterior con dato. */
  rate: number | null;
};

export type CrossKpi = {
  spendEur: number;
  spendBySource: { meta: number | null; googleAds: number | null };
  cplCrmEur: number | null;
  /** Inversión ÷ matrículas cobradas de los 30 días. */
  cacEur: number | null;
  /** Cobrado de los 30 días ÷ inversión. */
  roas: number | null;
};

export type DashboardData = {
  generatedAt: string;
  range: DateRange;
  crm: Section<CrmData>;
  calls: Section<CallsData>;
  ventas: Section<VentasData>;
  meta: Section<AdsData>;
  googleAds: Section<AdsData>;
  ga4: Section<Ga4Data>;
  funnel: FunnelStep[];
  cross: CrossKpi;
};
