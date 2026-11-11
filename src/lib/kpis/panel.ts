import { unstable_cache } from "next/cache";

import { adsData, callsData, crmData, crossKpi, funnel, ga4Data, ventasData } from "@/lib/kpis/calculos";
import { campusMissing, loadOrders } from "@/lib/kpis/fuentes/campus";
import { ga4Missing, loadGa4 } from "@/lib/kpis/fuentes/ga4";
import { googleAdsMissing, loadGoogleAds } from "@/lib/kpis/fuentes/google-ads";
import { loadMeta, metaMissing } from "@/lib/kpis/fuentes/meta";
import { loadCalls, loadCrm, zohoMissing } from "@/lib/kpis/fuentes/zoho";
import type { DashboardData, DateRange, RawData, Section } from "@/lib/kpis/types";
import { madridToday, shiftDay } from "@/lib/kpis/util";

// ══════════════════════════════════════════════════════════
//  El panel de KPIs de ventas: pide todo y devuelve lo que se pinta
//
//  Sólo en el servidor: usa tokens que no pueden llegar al navegador. Las
//  fuentes van a la vez y cada una por su lado: si a una le faltan claves o
//  falla, su bloque sale «sin conectar» o con el error, y el resto sigue.
//
//  Meta, Google y Zoho limitan las llamadas, así que el resultado se guarda
//  15 minutos en la caché de Next (compartida entre las funciones de
//  Vercel). El botón «Actualizar» la vacía (ver acciones.ts).
// ══════════════════════════════════════════════════════════

export const KPIS_TAG = "kpis-ventas";

async function load<T>(label: string, missing: string[], fn: () => Promise<T>): Promise<Section<T>> {
  if (missing.length) return { status: "not_configured", message: `${label}: faltan ${missing.join(", ")}` };
  try {
    return { status: "ok", data: await fn() };
  } catch (e) {
    console.error(`[kpis] ${label}`, e);
    return { status: "error", message: `${label}: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function loadRaw(range: DateRange): Promise<RawData> {
  const [crm, calls, ventas, meta, googleAds, ga4] = await Promise.all([
    load("Zoho CRM", zohoMissing(), loadCrm),
    load("Llamadas (Aircall en Zoho)", zohoMissing(), () => loadCalls(range)),
    load("Matrículas", campusMissing(), loadOrders),
    load("Meta Ads", metaMissing(), () => loadMeta(range)),
    load("Google Ads", googleAdsMissing(), () => loadGoogleAds(range)),
    load("Google Analytics 4", ga4Missing(), () => loadGa4(range)),
  ]);
  return { crm, calls, ventas, meta, googleAds, ga4 };
}

const map = <A, B>(s: Section<A>, fn: (a: A) => B): Section<B> => (s.status === "ok" ? { status: "ok", data: fn(s.data) } : s);
const dataOf = <T>(s: Section<T>): T | null => (s.status === "ok" ? s.data : null);

/** Lo que llega de las fuentes, en el JSON del panel. Sin red. */
export function buildDashboard(raw: RawData, today: string, generatedAt = new Date().toISOString()): DashboardData {
  const crmRaw = dataOf(raw.crm);
  const crm = map(raw.crm, (c) => crmData(c, today));
  const calls = map(raw.calls, (c) => callsData(c.calls, c.duplicates, crmRaw?.leads ?? [], today));
  const ventas = map(raw.ventas, (o) => ventasData(o, today));
  const meta = map(raw.meta, (m) => adsData(m, today));
  const googleAds = map(raw.googleAds, (g) => adsData(g, today));
  const ga4 = map(raw.ga4, ga4Data);

  const ads = [dataOf(meta), dataOf(googleAds)].filter((a) => a !== null);
  return {
    generatedAt,
    range: { since: shiftDay(today, -29), until: today },
    crm,
    calls,
    ventas,
    meta,
    googleAds,
    ga4,
    funnel: funnel({ ads, ga4: dataOf(ga4), crm: crmRaw, calls: dataOf(raw.calls)?.calls ?? null, ventas: dataOf(ventas), today }),
    cross: crossKpi(dataOf(meta), dataOf(googleAds), dataOf(crm)?.leads30 ?? 0, dataOf(ventas)),
  };
}

async function getDashboardData(): Promise<DashboardData> {
  const today = madridToday();
  return buildDashboard(await loadRaw({ since: shiftDay(today, -29), until: today }), today);
}

/** Los datos del panel, de la caché si tienen menos de 15 minutos. */
export const getDashboardDataCached = unstable_cache(getDashboardData, [KPIS_TAG, "v1"], { revalidate: 900, tags: [KPIS_TAG] });
