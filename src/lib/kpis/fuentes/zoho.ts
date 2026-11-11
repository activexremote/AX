import type { CallRow, CallsRaw, CallType, CrmRaw, DateRange, LeadRow } from "@/lib/kpis/types";
import { daysBetween, madridDay, num } from "@/lib/kpis/util";
import { zohoConfigured, zohoFetch } from "@/lib/zoho/client";

// ══════════════════════════════════════════════════════════
//  Zoho CRM para el panel: leads, negocios, alumnos, facturas y llamadas
//
//  Va por la API de registros (GET /{módulo}) con el mismo refresh token que
//  ya escribe los leads del formulario. El paquete original usaba COQL, pero
//  COQL pide el scope ZohoCRM.coql.READ y el token del campus no lo tiene
//  (Zoho responde OAUTH_SCOPE_MISMATCH): así no hay que generar otro token.
//  Se leen las filas y se agrupa aquí; para un CRM de este tamaño son una o
//  dos páginas por módulo.
//
//  En esta organización el módulo «Students» es Contacts en la API.
// ══════════════════════════════════════════════════════════

const PER_PAGE = 200;
/** Tope de páginas por módulo: 5.000 registros. */
const MAX_PAGES = 25;

type Info = { more_records?: boolean; next_page_token?: string | null };

async function listAll<T>(module: string, fields: string[]): Promise<{ rows: T[]; capped: boolean }> {
  const rows: T[] = [];
  let page = 1;
  let token: string | null = null;
  for (let i = 0; i < MAX_PAGES; i++) {
    const qs = new URLSearchParams({ fields: fields.join(","), per_page: String(PER_PAGE) });
    // Hasta el registro 2.000 vale `page`; a partir de ahí Zoho exige `page_token`.
    if (token) qs.set("page_token", token);
    else qs.set("page", String(page));
    const r = await zohoFetch<{ data?: T[]; info?: Info } | null>(`/${module}?${qs}`);
    if (!r.ok) throw new Error(`${module}: ${r.error}`);
    rows.push(...(r.data?.data ?? []));
    if (!r.data?.info?.more_records) return { rows, capped: false };
    token = r.data.info.next_page_token ?? null;
    page++;
  }
  return { rows, capped: true };
}

/** Los campos de búsqueda llegan como {id, name}. */
function lookupId(v: unknown): string | null {
  if (v && typeof v === "object" && "id" in v) return String((v as { id: unknown }).id);
  return v ? String(v) : null;
}

/** Zoho usa "-None-" (o null) para una lista sin valor. */
const picklist = (v: unknown): string | null => (typeof v === "string" && v && v !== "-None-" ? v : null);

export const zohoMissing = (): string[] => (zohoConfigured() ? [] : ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN"]);

export async function loadCrm(): Promise<CrmRaw> {
  type Z = Record<string, unknown> & { id: string };
  const [leads, deals, contacts, invoices] = await Promise.all([
    listAll<Z>("Leads", ["Created_Time", "Lead_Source", "Lead_Status"]),
    listAll<Z>("Deals", ["Stage", "Amount", "Created_Time"]),
    listAll<Z>("Contacts", ["Created_Time"]),
    // Sin el módulo de facturas (o sin permiso) el panel sigue: se queda en 0.
    listAll<Z>("Invoices", ["Grand_Total", "Created_Time"]).catch(() => ({ rows: [] as Z[], capped: false })),
  ]);

  return {
    leads: leads.rows.map(
      (r): LeadRow => ({
        id: String(r.id),
        createdTime: String(r.Created_Time ?? ""),
        day: madridDay(String(r.Created_Time ?? "")),
        source: picklist(r.Lead_Source),
        status: picklist(r.Lead_Status),
      }),
    ),
    capped: leads.capped,
    deals: deals.rows.map((r) => ({ stage: picklist(r.Stage), amount: num(r.Amount), day: madridDay(String(r.Created_Time ?? "")) })),
    contactDays: contacts.rows.map((r) => madridDay(String(r.Created_Time ?? ""))),
    invoices: invoices.rows.map((r) => ({ day: madridDay(String(r.Created_Time ?? "")), total: num(r.Grand_Total) })),
  };
}

// ───────────── Llamadas ─────────────
// Aircall guarda cada llamada en el módulo Calls, vinculada al lead por su
// teléfono. Call_Type estándar: Inbound, Outbound, Missed.

function callType(v: unknown): CallType {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("missed") || s.includes("perdid")) return "missed";
  if (s.includes("inbound") || s.includes("entrante")) return "inbound";
  if (s.includes("outbound") || s.includes("saliente")) return "outbound";
  return "other";
}

export async function loadCalls(range: DateRange): Promise<CallsRaw> {
  const { rows } = await listAll<Record<string, unknown>>("Calls", ["Call_Type", "Call_Start_Time", "Call_Duration_in_seconds", "What_Id"]);
  // La integración de Aircall escribe algunas llamadas dos veces (mismo
  // lead, misma hora al segundo, misma duración): contarían doble.
  const seen = new Set<string>();
  const calls: CallRow[] = [];
  let duplicates = 0;
  for (const r of rows) {
    const start = String(r.Call_Start_Time ?? "");
    const c: CallRow = {
      type: callType(r.Call_Type),
      start,
      day: madridDay(start),
      durationSec: num(r.Call_Duration_in_seconds),
      relatedId: lookupId(r.What_Id),
    };
    const key = `${c.relatedId}|${c.start}|${c.durationSec}|${c.type}`;
    if (seen.has(key)) {
      duplicates++;
      continue;
    }
    seen.add(key);
    // Las de antes de la ventana sólo sirven para la primera llamada de un lead.
    if (daysBetween(c.day, range.since) <= 60) calls.push(c);
  }
  return { calls, duplicates };
}
