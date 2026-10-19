// ══════════════════════════════════════════════════════════
//  Lo que cuesta escribir con DeepSeek
//
//  Tarifa publicada en api-docs.deepseek.com/quick_start/pricing (octubre de
//  2026), en USD por millón de tokens y en hora VALLE. En hora punta todo
//  cuesta el doble. Si DeepSeek cambia precios, se cambian aquí y nada más:
//  el gasto ya registrado se queda con el coste que tuvo.
//
//  Sin nada de servidor: el formulario de nueva publicación usa `estimar`
//  para enseñar cuánto va a costar antes de pulsar el botón.
// ══════════════════════════════════════════════════════════

import type { SocialChannel } from "@/lib/supabase/types";

type Tarifa = { hit: number; miss: number; out: number };

export const TARIFAS: Record<string, Tarifa> = {
  "deepseek-flash": { hit: 0.003, miss: 0.15, out: 0.6 },
  "deepseek-v4-pro": { hit: 0.022, miss: 0.66, out: 1.98 },
};

/** Un modelo que no está en la tabla se cuenta al precio del más caro: mejor pasarse que quedarse corto. */
const tarifa = (model: string) => TARIFAS[model] ?? TARIFAS["deepseek-v4-pro"];

/** Hora punta de DeepSeek: 01-04 y 06-10 UTC, de lunes a viernes. */
export function esHoraPunta(d: Date): boolean {
  const dia = d.getUTCDay();
  if (dia === 0 || dia === 6) return false;
  const h = d.getUTCHours();
  return (h >= 1 && h < 4) || (h >= 6 && h < 10);
}

export type Uso = { hit: number; miss: number; out: number };

export function costeUsd(model: string, uso: Uso, peak: boolean): number {
  const t = tarifa(model);
  const factor = peak ? 2 : 1;
  return ((uso.hit * t.hit + uso.miss * t.miss + uso.out * t.out) / 1_000_000) * factor;
}

/**
 * Tokens aproximados de una generación, medidos con publicaciones reales:
 * las instrucciones pesan ~2.000 de entrada; un enlace, hasta ~5.000 más.
 * La salida es lo que más pesa, y el artículo del blog, lo que más sale.
 */
const SALIDA: Record<SocialChannel, number> = { x: 500, linkedin: 600, blog: 4_500 };

export function estimar(model: string, canales: SocialChannel[], conEnlace: boolean): number {
  const entrada = 2_000 + canales.length * 400 + (conEnlace ? 5_000 : 300);
  const salida = canales.reduce((n, c) => n + SALIDA[c], 0);
  return costeUsd(model, { hit: 0, miss: entrada, out: salida }, esHoraPunta(new Date()));
}

/** "0,012 $" para céntimos, "1,24 $" para el resto. */
export function formatoUsd(n: number, locale: string): string {
  const dec = n > 0 && n < 0.1 ? 3 : 2;
  return `${n.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec })} $`;
}
