// ══════════════════════════════════════════════════════════
//  Consentimiento de cookies. Implementación propia, sin plataforma externa
//  (una CMP de terceros sería, ella misma, una transferencia de datos que
//  habría que declarar).
//
//  Reglas que cumple, por si alguien las revisa:
//   · Nada que requiera permiso se carga antes de la elección.
//   · Rechazar cuesta lo mismo que aceptar: un clic, mismo nivel visual.
//   · Sin casillas premarcadas, y navegar no equivale a aceptar.
//   · Granularidad por categoría y revocación permanente desde el pie.
//   · Se guarda fecha y versión del texto mostrado, para poder acreditarlo.
// ══════════════════════════════════════════════════════════

export const CONSENT_COOKIE = "axr_consent";

/** Se sube cuando cambian las finalidades o los proveedores: vuelve a preguntar. */
export const CONSENT_VERSION = 1;

/** 12 meses. Pasado el plazo se pregunta de nuevo. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

/** Las que sí se pueden elegir. `necessary` no está: no es opcional. */
export const OPTIONAL_CATEGORIES = ["preferences", "analytics", "marketing"] as const;
export type OptionalCategory = (typeof OPTIONAL_CATEGORIES)[number];

export type ConsentChoices = Record<OptionalCategory, boolean>;

export type ConsentRecord = {
  /** Versión del aviso que se mostró. */
  v: number;
  /** Momento de la decisión, en ISO 8601. */
  ts: string;
  c: ConsentChoices;
};

export const DENY_ALL: ConsentChoices = {
  preferences: false,
  analytics: false,
  marketing: false,
};

export const ALLOW_ALL: ConsentChoices = {
  preferences: true,
  analytics: true,
  marketing: true,
};

/**
 * Señales de Google Consent Mode v2. `security_storage` va siempre concedida:
 * es estrictamente necesaria y no depende de ninguna categoría opcional.
 */
export function toSignals(c: ConsentChoices): Record<string, "granted" | "denied"> {
  const g = (on: boolean): "granted" | "denied" => (on ? "granted" : "denied");
  return {
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
    analytics_storage: g(c.analytics),
    functionality_storage: g(c.preferences),
    personalization_storage: g(c.preferences),
    security_storage: "granted",
  };
}

/** Lee y valida la cookie. Devuelve null si no hay, está rota o caducó la versión. */
export function parseConsent(raw: string | undefined | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentRecord;
    if (parsed?.v !== CONSENT_VERSION || !parsed.c) return null;
    // Sólo se aceptan las tres claves conocidas, y sólo booleanas.
    for (const key of OPTIONAL_CATEGORIES) {
      if (typeof parsed.c[key] !== "boolean") return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
