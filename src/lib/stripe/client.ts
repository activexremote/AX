import "server-only";

import Stripe from "stripe";

import { OFFERS, type Offer } from "@/lib/stripe/catalog";

// Instancia única de Stripe. No se fija `apiVersion`: el SDK ya viene clavado
// a la versión con la que se generaron sus tipos (2026-07-29.dahlia), y
// escribir aquí otra distinta sólo consigue que los tipos mientan.
let cached: Stripe | null = null;

export function stripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Falta STRIPE_SECRET_KEY. Copia las claves de test del panel de Stripe a .env.local (ver .env.example).",
    );
  }
  cached = new Stripe(key, {
    // Aparece en el panel de Stripe junto a cada petición: ayuda a saber qué
    // la originó cuando algo falla en producción.
    appInfo: { name: "ActiveXRemote Campus", url: "https://activexremote.com" },
    maxNetworkRetries: 2,
  });
  return cached;
}

/** ¿Está Stripe configurado? Lo usan las páginas para no ofrecer un botón de
 *  pago que va a reventar. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

/**
 * El price_… de una oferta. Si falta, se avisa nombrando la variable: es el
 * error más probable al montar esto por primera vez y el mensaje por defecto
 * de Stripe ("No such price: undefined") no ayuda nada.
 */
export function priceIdFor(offer: Offer): string {
  const id = process.env[offer.priceEnv];
  if (!id) {
    throw new Error(
      `Falta ${offer.priceEnv} para la oferta "${offer.key}". Ejecuta "node scripts/stripe-setup.mjs" y pega en .env.local las líneas que imprime.`,
    );
  }
  return id;
}

/**
 * El price_… de una oferta, comprobado contra Stripe antes de cobrar: su
 * importe, su moneda y si es mensual tienen que ser los del catálogo. Si el
 * catálogo cambia de precio y nadie ha creado el price_… nuevo (ver
 * scripts/stripe-setup.mjs), la web enseñaría un importe y Stripe cobraría
 * otro; así, el pago se para en vez de cobrar mal.
 */
export async function verifiedPriceId(offer: Offer): Promise<string> {
  const id = priceIdFor(offer);
  const price = await stripe().prices.retrieve(id);
  const mensual = price.recurring?.interval === "month";
  if (!price.active || price.unit_amount !== offer.unitAmount || price.currency !== offer.currency || mensual !== (offer.mode === "subscription")) {
    throw new Error(
      `${offer.priceEnv} (${id}) cobra ${price.unit_amount} ${price.currency}${mensual ? "/mes" : ""} y el catálogo dice ${offer.unitAmount} ${offer.currency}. Ejecuta "node scripts/stripe-setup.mjs --write" y actualiza la variable.`,
    );
  }
  return id;
}

/** Todas las variables de precio que faltan, para avisar de una vez. */
export function missingPriceEnvs(): string[] {
  return Object.values(OFFERS)
    .map((o) => o.priceEnv)
    .filter((name) => !process.env[name]);
}
