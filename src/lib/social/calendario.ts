// ══════════════════════════════════════════════════════════
//  Ritmo, huecos y cobertura
//
//  El RITMO dice qué días y a qué hora publica cada canal (lunes, miércoles
//  y viernes a las 10, por ejemplo). Cada uno de esos momentos es un HUECO.
//  Un hueco está cubierto si ese día hay algo programado en ese canal.
//
//  La COBERTURA es cuánto tiempo seguido tenemos cubierto desde hoy: llega
//  hasta el primer hueco vacío. Es la cifra que importa, porque lo que se ve
//  desde fuera de una cuenta que deja de publicar es justo ese hueco.
//
//  Todas las fechas son de Madrid, que es donde vive el equipo y lo que se
//  espera ver en el calendario, aunque el servidor (Vercel) vaya en UTC.
//
//  Sin nada de servidor: lo usan la página, las acciones y el calendario.
// ══════════════════════════════════════════════════════════

import type { SocialChannel } from "@/lib/supabase/types";

export const ZONA = "Europe/Madrid";

export type RitmoCanal = { days: number[]; hour: number };
export type Ritmo = Record<SocialChannel, RitmoCanal>;

export const RITMO_POR_DEFECTO: Ritmo = {
  x: { days: [1, 3, 5], hour: 10 },
  linkedin: { days: [2, 4], hour: 9 },
  blog: { days: [2], hour: 8 },
};

export function parseRitmo(raw: unknown): Ritmo {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const uno = (c: SocialChannel): RitmoCanal => {
    const r = (o[c] && typeof o[c] === "object" ? o[c] : {}) as Record<string, unknown>;
    const days = Array.isArray(r.days)
      ? [...new Set(r.days.map(Number).filter((d) => d >= 1 && d <= 7))].sort()
      : RITMO_POR_DEFECTO[c].days;
    const hour = Number.isInteger(r.hour) && (r.hour as number) >= 0 && (r.hour as number) <= 23 ? (r.hour as number) : RITMO_POR_DEFECTO[c].hour;
    return { days, hour };
  };
  return { x: uno("x"), linkedin: uno("linkedin"), blog: uno("blog") };
}

// ── Fechas de Madrid ───────────────────────────────────────

const fmtDia = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" });
const fmtPartes = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONA,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** "2026-10-19": el día de Madrid de un instante. */
export function diaMadrid(d: Date | string): string {
  return fmtDia.format(typeof d === "string" ? new Date(d) : d);
}

/** Minutos que Madrid va por delante de UTC en ese instante (60 o 120). */
function desfase(ms: number): number {
  const p = Object.fromEntries(fmtPartes.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const comoUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((comoUtc - ms) / 60_000);
}

/** El instante UTC de "ese día a esa hora en Madrid", con el cambio de hora resuelto. */
export function instanteMadrid(dia: string, hora: number): Date {
  const [y, m, d] = dia.split("-").map(Number);
  const ingenuo = Date.UTC(y, m - 1, d, hora);
  let ms = ingenuo - desfase(ingenuo) * 60_000;
  ms = ingenuo - desfase(ms) * 60_000;
  return new Date(ms);
}

export function sumarDias(dia: string, n: number): string {
  const [y, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** 1 = lunes … 7 = domingo. */
export function diaSemana(dia: string): number {
  const [y, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() || 7;
}

export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

// ── Huecos ─────────────────────────────────────────────────

export type Hueco = { dia: string; instante: Date };

/** Los huecos de un canal desde ahora, durante `dias` días. Los de hoy ya pasados no cuentan. */
export function huecos(r: RitmoCanal, ahora: Date, dias: number): Hueco[] {
  const out: Hueco[] = [];
  if (!r.days.length) return out;
  const hoy = diaMadrid(ahora);
  for (let i = 0; i <= dias; i++) {
    const dia = sumarDias(hoy, i);
    if (!r.days.includes(diaSemana(dia))) continue;
    const instante = instanteMadrid(dia, r.hour);
    if (instante.getTime() > ahora.getTime()) out.push({ dia, instante });
  }
  return out;
}

export type Cobertura = {
  /** Sin ritmo (ningún día marcado) no hay cobertura que medir. */
  activo: boolean;
  /** Último día cubierto sin interrupción; null si el primer hueco ya está vacío. */
  hasta: string | null;
  /** Días desde hoy hasta el primer hueco vacío. */
  dias: number;
  /** Primer hueco vacío. */
  primerVacio: string | null;
  /** Lo mismo, si se usara todo lo que hay en la nevera. */
  diasConNevera: number;
  programadas: number;
  nevera: number;
  /** Publicaciones al mes que pide el ritmo. */
  porMes: number;
};

/** Hasta dónde se mira. Más allá, "vamos cubiertos" no es una preocupación. */
export const HORIZONTE = 365;

export function cobertura(r: RitmoCanal, diasProgramados: Set<string>, enNevera: number, ahora: Date): Cobertura {
  const hs = huecos(r, ahora, HORIZONTE);
  const hoy = diaMadrid(ahora);
  const porMes = Math.round((r.days.length * 52) / 12);
  const base = { programadas: diasProgramados.size, nevera: enNevera, porMes };
  if (!hs.length) return { activo: false, hasta: null, dias: 0, primerVacio: null, diasConNevera: 0, ...base };

  let i = 0;
  while (i < hs.length && diasProgramados.has(hs[i].dia)) i++;
  const primerVacio = hs[i]?.dia ?? null;
  const hasta = i > 0 ? hs[i - 1].dia : null;
  const dias = primerVacio ? diasEntre(hoy, primerVacio) : HORIZONTE;

  // Con la nevera: cada hueco vacío se tapa con una de ella mientras queden.
  let quedan = enNevera;
  let j = i;
  while (j < hs.length && (diasProgramados.has(hs[j].dia) || quedan > 0)) {
    if (!diasProgramados.has(hs[j].dia)) quedan--;
    j++;
  }
  const diasConNevera = hs[j] ? diasEntre(hoy, hs[j].dia) : HORIZONTE;

  return { activo: true, hasta, dias, primerVacio, diasConNevera, ...base };
}

/** "3,5 meses", "2 semanas", "4 días". */
export function duracion(dias: number, locale: string): string {
  const en = locale === "en";
  if (dias >= 60) {
    const m = (dias / 30.4).toLocaleString(locale, { maximumFractionDigits: 1 });
    return en ? `${m} months` : `${m} meses`;
  }
  if (dias >= 14) {
    const s = Math.floor(dias / 7);
    return en ? `${s} weeks` : `${s} semanas`;
  }
  if (dias === 1) return en ? "1 day" : "1 día";
  return en ? `${dias} days` : `${dias} días`;
}
