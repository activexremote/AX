// ══════════════════════════════════════════════════════════
//  Utilidades del panel de KPIs: fechas en hora de Madrid, números y
//  peticiones HTTP. Sin dependencias: lo usan todas las fuentes.
// ══════════════════════════════════════════════════════════

export const TIMEZONE = "Europe/Madrid";

/** Hoy en Madrid, «2026-11-12». */
export function madridToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(now);
}

/** El día de Madrid de un instante cualquiera. */
export function madridDay(iso: string): string {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? madridToday(new Date(t)) : iso.slice(0, 10);
}

/** Suma (o resta) días a una fecha YYYY-MM-DD. */
export function shiftDay(day: string, days: number): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Días entre dos fechas YYYY-MM-DD (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);
}

/** ¿Cae el día dentro de los últimos `n` días (hoy incluido)? */
export function inLastDays(day: string, today: string, n: number): boolean {
  const k = daysBetween(day, today);
  return k >= 0 && k < n;
}

/** Cualquier valor de una API a número (null, "" o NaN → 0). */
export function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export const round2 = (v: number): number => Math.round(v * 100) / 100;

/** % con un decimal, o null si no hay base. */
export const pct1 = (part: number, whole: number): number | null => (whole ? Math.round((part / whole) * 1000) / 10 : null);

/** Importe por unidad con dos decimales, o null si no hay unidades. */
export const per = (amount: number, units: number): number | null => (units ? round2(amount / units) : null);

/** fetch que lanza un error legible si la respuesta no es 2xx o no es JSON. */
export async function fetchJson<T>(url: string, init: RequestInit = {}, label = "HTTP"): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const text = await res.text();
  if (!res.ok) throw new Error(`${label} ${res.status}: ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${label}: la respuesta no es JSON (${text.slice(0, 200)})`);
  }
}

/** Los nombres de las variables de entorno que faltan. */
export function missingEnv(names: string[]): string[] {
  return names.filter((n) => !process.env[n]);
}
