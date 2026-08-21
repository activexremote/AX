import { COHORT_START } from "@/app/bienvenida/cohort";
import { FLASH_COURSES } from "@/lib/relampago/catalog";

// ══════════════════════════════════════════════════════════
//  Catálogo comercial. Es la única fuente de verdad de qué se vende y a qué
//  precio; la copy de la landing y el FAQ tienen que decir esto mismo.
//
//  Los importes van en céntimos porque es la unidad que usa Stripe: trabajar
//  con euros en coma flotante y redondear al cobrar es la vía rápida a cobrar
//  2.399,99 €.
//
//  ⚠︎ Los identificadores de precio (price_…) NO se escriben aquí: viven en
//  variables de entorno porque cambian entre la cuenta de pruebas y la real.
//  `scripts/stripe-setup.mjs` crea los productos y te imprime las líneas que
//  hay que pegar en .env.local.
// ══════════════════════════════════════════════════════════

export type CourseKey = "remote-professional" | "remote-founder";
export const COURSE_KEYS: readonly CourseKey[] = ["remote-professional", "remote-founder"];

export function isCourseKey(v: unknown): v is CourseKey {
  return typeof v === "string" && (COURSE_KEYS as readonly string[]).includes(v);
}

/**
 * Clave de oferta.
 *
 * Las cuatro primeras son el programa largo. `relampago-…` es un curso
 * relámpago suelto, y hay una por curso porque cada uno puede tener su precio
 * y necesita su propio price_… en Stripe.
 */
export type OfferKey =
  | "curso-unico"
  | "curso-plazos"
  | "curso-anticipada"
  | "pack-dos"
  | `relampago-${string}`;

export type Offer = {
  key: OfferKey;
  /** Cuántos cursos entran. 1 = el alumno elige cuál; 2 = los dos. */
  courses: 1 | 2;
  /** "payment" cobra una vez; "subscription" son los plazos. */
  mode: "payment" | "subscription";
  plan: "unico" | "plazos" | "anticipada";
  /** Céntimos que se cobran en cada cargo. */
  unitAmount: number;
  /** Cuántos cargos. 1 salvo en los plazos. */
  charges: number;
  currency: "eur";
  /** Variable de entorno con el price_… correspondiente. */
  priceEnv: string;
  /** Si la oferta caduca, fecha límite en ISO. */
  until?: string;
};

/** Matrícula anticipada: hasta el 31 de octubre, como anuncia el FAQ. */
export const EARLY_BIRD_UNTIL = "2026-10-31T23:59:59+01:00";

export const OFFERS: Record<OfferKey, Offer> = {
  "curso-unico": {
    key: "curso-unico",
    courses: 1,
    mode: "payment",
    plan: "unico",
    unitAmount: 240000,
    charges: 1,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_CURSO_UNICO",
  },
  "curso-anticipada": {
    key: "curso-anticipada",
    courses: 1,
    mode: "payment",
    plan: "anticipada",
    unitAmount: 210000,
    charges: 1,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_CURSO_ANTICIPADA",
    until: EARLY_BIRD_UNTIL,
  },
  "curso-plazos": {
    key: "curso-plazos",
    courses: 1,
    // Suscripción mensual que se corta sola tras el tercer cobro: Checkout no
    // sabe hacer "cóbrame tres veces y para", así que el webhook la cancela
    // cuando cuenta la tercera factura pagada.
    mode: "subscription",
    plan: "plazos",
    unitAmount: 80000,
    charges: 3,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_CURSO_PLAZOS",
  },
  "pack-dos": {
    key: "pack-dos",
    courses: 2,
    mode: "payment",
    plan: "unico",
    unitAmount: 390000,
    charges: 1,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_PACK_DOS",
  },
};

// ── Cursos relámpago ──────────────────────────────────────
// Se generan desde el registro de cursos en vez de escribirse a mano: así el
// precio que se cobra y el precio que anuncia la landing salen del MISMO
// sitio. Escribirlo dos veces es cómo se acaba cobrando 75 € por algo que la
// página anuncia a 65.

/** Nombre de la variable de entorno con el price_… de un relámpago. */
export function flashPriceEnv(courseKey: string): string {
  return `STRIPE_PRICE_RELAMPAGO_${courseKey.toUpperCase().replace(/-/g, "_")}`;
}

export const FLASH_OFFERS: Record<string, Offer> = Object.fromEntries(
  FLASH_COURSES.map((c) => [
    `relampago-${c.key}`,
    {
      key: `relampago-${c.key}` as OfferKey,
      courses: 1,
      mode: "payment",
      // Precio cerrado: sin plazos, sin matrícula anticipada y sin
      // convocatoria. Ése es medio producto.
      plan: "unico",
      unitAmount: c.priceCents,
      charges: 1,
      currency: "eur",
      priceEnv: flashPriceEnv(c.key),
    } satisfies Offer,
  ]),
);

/** La oferta de un relámpago a partir de su clave de curso. */
export function flashOffer(courseKey: string): Offer | undefined {
  return FLASH_OFFERS[`relampago-${courseKey}`];
}

/** Todas las ofertas que existen, del tipo que sean. */
export const ALL_OFFERS: Record<string, Offer> = { ...OFFERS, ...FLASH_OFFERS };

export function isOfferKey(v: unknown): v is OfferKey {
  return typeof v === "string" && v in ALL_OFFERS;
}

/** ¿Sigue viva la matrícula anticipada? Se comprueba en el servidor: que la
 *  oferta desaparezca del HTML no impide que alguien pida esa sesión de pago. */
export function isOfferAvailable(offer: Offer, now: Date = new Date()): boolean {
  if (!offer.until) return true;
  return now.getTime() <= new Date(offer.until).getTime();
}

/**
 * Las ofertas que se pueden comprar ahora mismo.
 *
 * Mientras la matrícula anticipada esté viva sustituye al pago único de un
 * curso: enseñar los dos a la vez sería pedirle a alguien que elija pagar 300 €
 * de más.
 */
export function availableOffers(now: Date = new Date()): Offer[] {
  const early = isOfferAvailable(OFFERS["curso-anticipada"], now);
  return [
    early ? OFFERS["curso-anticipada"] : OFFERS["curso-unico"],
    OFFERS["curso-plazos"],
    OFFERS["pack-dos"],
  ];
}

/**
 * Ofertas del programa largo. `availableOffers()` NO las incluye a propósito:
 * la pantalla de matrícula vende el programa, y colar ahí un curso de 75 €
 * junto a uno de 2.400 € sólo consigue que nadie entienda qué está comprando.
 */
export function totalAmount(offer: Offer): number {
  return offer.unitAmount * offer.charges;
}

/**
 * Importe con el formato de cada idioma: 2.400 € / €2,400.
 *
 * `useGrouping: "always"` no es cosmético. En español, CLDR no agrupa los
 * números de cuatro cifras, así que por defecto salía "2400 €" mientras el
 * resto de la web —FAQ, bloque de precio, landings de curso— escribe
 * "2.400 €". Que la cifra cambie de aspecto justo en la pantalla de pago es
 * de las cosas que hacen dudar de si es el mismo importe.
 */
export function formatAmount(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** La convocatoria a la que da acceso la compra. */
export const COHORT_START_ISO = COHORT_START;
