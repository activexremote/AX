"use server";

import { headers } from "next/headers";

import { getLocale } from "@/lib/i18n/server";
import { withLocale } from "@/lib/i18n/routing";
import { priceIdFor, stripe, stripeConfigured } from "@/lib/stripe/client";
import {
  ALL_OFFERS,
  isCourseKey,
  isOfferAvailable,
  isOfferKey,
  totalAmount,
  type CourseKey,
} from "@/lib/stripe/catalog";
import { flashByKey } from "@/lib/relampago/catalog";
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
  const offer = ALL_OFFERS[offerKey];

  // La caducidad se comprueba aquí, no sólo al pintar: que la matrícula
  // anticipada desaparezca de la página no impide que alguien reenvíe el
  // formulario con esa clave y pague 300 € de menos fuera de plazo.
  if (!isOfferAvailable(offer)) return { error: "offer_expired" };

  // ── Qué se está comprando ──
  // Un relámpago lleva el curso en la propia clave de la oferta
  // (`relampago-web-abc`), así que no hay nada que elegir ni nada que
  // validar del formulario: el precio y el curso van atados. En el programa
  // largo sí hay que leer el curso, porque la misma oferta sirve para los dos.
  let courses: DbCourseKey[];
  const relampago = offerKey.startsWith("relampago-")
    ? flashByKey(offerKey.slice("relampago-".length))
    : undefined;

  if (relampago) {
    courses = [relampago.key as DbCourseKey];
  } else if (offer.courses === 2) {
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
      integration_identifier: relampago ? "axr-relampago-vhdnrxsw" : "axr-matricula-kqmwzptb",
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
              description: relampago
                ? `Curso relámpago · ${relampago.title}`
                : `Matrícula ActiveXRemote · ${courses.join(" + ")}`,
            },
          }),
      // Dos horas. El máximo de Stripe son 24 h, pero entonces el aviso de
      // "carrito abandonado" llegaría al día siguiente, que es tarde para
      // llamar a alguien que estaba a punto de pagar.
      expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      success_url: relampago
        ? `${back("/matricula/gracias")}?session_id={CHECKOUT_SESSION_ID}&relampago=${relampago.slug}`
        : `${back("/matricula/gracias")}?session_id={CHECKOUT_SESSION_ID}`,
      // Quien abandona vuelve a la página desde la que salió, no a la de
      // matrícula del programa: acabar en una pantalla de 2.400 € después de
      // dudar sobre una de 75 € es la peor recuperación posible.
      cancel_url: relampago
        ? `${back(`/cursos-relampago/${relampago.slug}`)}?cancelado=1&pedido=${orderId}`
        : `${back("/matricula")}?cancelado=1&pedido=${orderId}`,
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

/**
 * Compra directa: de la landing a Stripe, sin formulario por medio.
 *
 * Es el botón «comprar» de las tarjetas de curso relámpago. Sólo recibe la
 * clave de la oferta; el importe, el curso y el precio los resuelve el
 * servidor contra su catálogo, así que lo que llega del navegador no decide
 * nada de lo que se cobra.
 *
 * ── Por qué aquí NO se pide el email antes ────────────────
 * En el checkout del programa sí se pide, y con razón: son 2.400 €, la
 * decisión es larga y quien abandona a mitad es alguien a quien llamar.
 *
 * Un relámpago de 75 € se compra por impulso desde un anuncio. Meter tres
 * campos entre el botón y la pasarela es una pantalla de más justo en el peor
 * momento, y el contacto tampoco se pierde: Stripe pide el correo en su
 * primera pantalla y nos lo manda en el webhook, tanto si paga
 * (`checkout.session.completed`) como si lo deja a medias
 * (`checkout.session.expired` llega con `customer_details` relleno).
 *
 * El formulario largo sigue existiendo debajo, en #comprar, para quien
 * prefiera dejar sus datos aquí.
 */
export async function startDirectCheckout(offerKey: string): Promise<CheckoutResult> {
  const locale = await getLocale();

  if (!stripeConfigured()) return { error: "not_configured" };
  if (!isOfferKey(offerKey)) return { error: "missing_offer" };

  const offer = ALL_OFFERS[offerKey];
  if (!isOfferAvailable(offer)) return { error: "offer_expired" };

  // Sólo los relámpago. El programa largo tiene su propio embudo y su
  // formulario, y colar aquí una compra de 2.400 € sin recoger un dato sería
  // regalar el peor de los dos mundos.
  const relampago = offerKey.startsWith("relampago-")
    ? flashByKey(offerKey.slice("relampago-".length))
    : undefined;
  if (!relampago) return { error: "missing_offer" };

  const orderId = await createPendingOrder({
    email: null,
    firstName: null,
    lastName: null,
    locale,
    courses: [relampago.key as DbCourseKey],
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
      locale: locale === "en" ? "en" : "es",
      client_reference_id: orderId,
      integration_identifier: "axr-directo-pwkzmthc",
      metadata: {
        order_id: orderId,
        offer: offer.key,
        courses: relampago.key,
        locale,
        origen: "directo",
      },
      payment_intent_data: {
        metadata: { order_id: orderId },
        description: `Curso relámpago · ${relampago.title}`,
      },
      expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
      success_url: `${back("/matricula/gracias")}?session_id={CHECKOUT_SESSION_ID}&relampago=${relampago.slug}`,
      cancel_url: `${back(`/cursos-relampago/${relampago.slug}`)}?cancelado=1&pedido=${orderId}`,
      billing_address_collection: "required",
      customer_creation: "always",
      tax_id_collection: { enabled: true },
      allow_promotion_codes: true,
    });

    if (!session.url) return { error: "stripe" };

    await attachSession(orderId, session.id);
    return { url: session.url };
  } catch (err) {
    console.error(`[stripe] no se pudo abrir la compra directa: ${err}`);
    return { error: "stripe" };
  }
}
