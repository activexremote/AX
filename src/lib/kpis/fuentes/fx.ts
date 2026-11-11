import { fetchJson } from "@/lib/kpis/util";

// ══════════════════════════════════════════════════════════
//  Conversión a euros
//
//  La cuenta de Meta Ads factura en dírhams (AED), que están ligados al dólar
//  (3,6725 AED = 1 USD): se convierte vía USD con el tipo del BCE. Para un
//  tipo fijo, FX_AED_EUR=0.243 en el entorno.
// ══════════════════════════════════════════════════════════

const USD_PEGS: Record<string, number> = { AED: 3.6725 };
const TTL_MS = 12 * 60 * 60 * 1000;
const cache = new Map<string, { rate: number; at: number }>();

/** Euros que vale una unidad de `currency`. */
export async function rateToEur(currency: string): Promise<number> {
  const c = currency.toUpperCase();
  if (c === "EUR") return 1;

  const fixed = Number(process.env[`FX_${c}_EUR`]);
  if (fixed > 0) return fixed;

  const peg = USD_PEGS[c];
  if (peg) return (await rateToEur("USD")) / peg;

  const hit = cache.get(c);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.rate;

  const j = await fetchJson<{ rates?: { EUR?: number } }>(`https://api.frankfurter.app/latest?from=${c}&to=EUR`, {}, "Tipo de cambio");
  const rate = j.rates?.EUR;
  if (!rate) throw new Error(`Tipo de cambio: no hay tipo ${c}→EUR`);
  cache.set(c, { rate, at: Date.now() });
  return rate;
}
