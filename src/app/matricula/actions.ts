"use server";

import { headers } from "next/headers";

import { getLocale } from "@/lib/i18n/server";
import { withLocale } from "@/lib/i18n/routing";
import { priceIdFor, stripe, stripeConfigured } from "@/lib/stripe/client";
import {
  OFFERS,
  isCourseKey,
  isOfferAvailable,
  isOfferKey,
  totalAmount,
  type CourseKey,
} from "@/lib/stripe/catalog";
import { attachSession, createPendingOrder } from "@/lib/data/orders";
import type { CourseKey as DbCourseKey } from "@/lib/supabase/types";

export type CheckoutResult = { url: string } | { error: string };

/**
 * Abre una sesión de pago.
 *
 * El orden importa y no es casual:
 *   1. se valida contra el catálogo del servidor (nunca contra lo que llega
 *      del formulario: el importe y la oferta no pueden venir del navegador);
 *   2. se guarda el pedido con el email —así, si abandona el pago, tenemos
 *      a quién llamar—;
 *   3. y sólo entonces se manda a Stripe.
 */
export async function startCheckout(formData: FormData): Promise<CheckoutResult> {
  const locale = await getLocale();

  if (!stripeConfigured()) return { error: "not_configured" };

  const offerKey = String(formData.get("offer") ?? "");
  if (!isOfferKey(offerKey)) return { error: "missing_offer" };
  const offer = OFFERS[offerKey];

  // La caducidad se comprueba aquí, no sólo al pintar: que la matrícula
  // anticipada desaparezca de la página no impide que alguien reenvíe el
  // formulario con esa clave y pague 300 € de menos fuera de plazo.
  if (!isOfferAvailable(offer)) return { error: "offer_expired" };

  let courses: DbCourseKey[];
  if (offer.courses === 2) {
    courses = ["remote-professional", "remote-founder"];
  } else {
    const course = String(formData.get("course") ?? "");
    if (!isCourseKey(course)) return { error: "missing_course" };
    courses = [course satisfies CourseKey];
  }

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!firstName || !lastName || !email) return { error: "missing_fields" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "bad_email" };
  if (!formData.get("consent")) return { error: "no_consent" };

  // ── El email, a salvo antes de salir hacia Stripe ──
  const orderId = await createPendingOrder({
    email,
    firstName,
    lastName,
    locale,
    courses,
    plan: offer.plan,
    offer: offer.key,
    amountTotal: totalAmount(offer),
    currency: offer.currency,
  });
  if (!orderId) return { error: "db" };

  const origin = await getOrigin();
  const back = (path: string) => `${origin}${withLocale(locale, path)}`;

  try {
    const session = await stripe().checkout.sessions.create({
      mode: offer.mode,
      line_items: [{ price: priceIdFor(offer), quantity: 1 }],
      customer_email: email,
      // Idioma de la pasarela: llegar a Stripe y que cambie de idioma de
      // golpe es la clase de sorpresa que hace abandonar un pago.
      locale: locale === "en" ? "en" : "es",
      client_reference_id: orderId,
      // Etiqueta el flujo en el panel de Stripe para poder comparar embudos.
      // El sufijo aleatorio lo pide la propia guía de Stripe.
      integration_identifier: "axr-matricula-kqmwzptb",
      // Los metadatos son el rastro que queda en el panel de Stripe cuando
      // alguien pregunta "¿qué compró exactamente esta persona?".
      metadata: {
        order_id: orderId,
        offer: offer.key,
        courses: courses.join(","),
        locale,
      },
      ...(offer.mode === "subscription"
        ? {
            subscription_data: {
              metadata: { order_id: orderId, instalments: String(offer.charges) },
              description: `${offer.charges} plazos · ${courses.join(" + ")}`,
            },
          }
        : {
            payment_intent_data: {
              metadata: { order_id: orderId },
              description: `Matrícula ActiveXRemote · ${courses.join(" + ")}`,
            },
          }),
      // Dos horas. El máximo de Stripe son 24 h, pero entonces el aviso de
      // "carrito abandonado" llegaría al día siguiente, que es tarde para
      // llamar a alguien que estaba a punto de pagar.
      expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      success_url: `${back("/matricula/gracias")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${back("/matricula")}?cancelado=1&pedido=${orderId}`,
      billing_address_collection: "required",
      // En modo pago Stripe no crea cliente por defecto. Sin él, un reembolso
      // o una segunda compra de la misma persona no se enlazan con nada.
      ...(offer.mode === "payment" ? { customer_creation: "always" as const } : {}),
      // Para facturar a empresas y aplicar la inversión del sujeto pasivo.
      tax_id_collection: { enabled: true },
      allow_promotion_codes: true,
    });

    if (!session.url) return { error: "stripe" };

    await attachSession(orderId, session.id);
    return { url: session.url };
  } catch (err) {
    console.error(`[stripe] no se pudo crear la sesión de pago: ${err}`);
    return { error: "stripe" };
  }
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
