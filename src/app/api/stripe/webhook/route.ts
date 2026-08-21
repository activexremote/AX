import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/client";
import { ALL_OFFERS, OFFERS, isOfferKey } from "@/lib/stripe/catalog";
import {
  ensureUser,
  getOrderBySession,
  getOrderBySubscription,
  grantEnrollments,
  notifySafely,
  suspendEnrollments,
  updateOrder,
} from "@/lib/data/orders";

// ══════════════════════════════════════════════════════════
//  Webhook de Stripe. Es la ÚNICA vía por la que se concede acceso.
//
//  La página de "gracias" no sirve para eso: el navegador puede no volver
//  nunca (se cierra la pestaña, se pierde la conexión) y, al revés, cualquiera
//  puede abrirla a mano. Sólo lo que Stripe firma cuenta.
//
//  Todo aquí es idempotente: Stripe reintenta los eventos, y varios pueden
//  llegar dos veces o desordenados.
// ══════════════════════════════════════════════════════════

// El cuerpo tiene que llegar tal cual para poder verificar la firma; por eso
// se lee con .text() y no con .json().
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET no configurado" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    // La variante async usa Web Crypto y funciona en cualquier runtime.
    event = await stripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch (err) {
    // Firma inválida: o es un intento de falsificar un pago, o el secreto no
    // coincide con el del endpoint. En ningún caso se procesa.
    const detail = err instanceof Error ? err.message : "desconocido";
    return NextResponse.json({ error: `Firma inválida: ${detail}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      // Con métodos de pago de notificación diferida (SEPA, transferencia,
      // Bizum en algunos casos) el pago no está cobrado cuando termina el
      // checkout: `completed` llega con la sesión todavía sin pagar y la
      // confirmación buena es ésta, horas o días después. Atender sólo a
      // `completed` daría acceso a pagos que luego fallan y no se lo daría
      // nunca a los que sí acaban entrando.
      case "checkout.session.async_payment_succeeded":
        await onCheckoutCompleted(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await onAsyncPaymentFailed(event.data.object);
        break;
      case "checkout.session.expired":
        await onCheckoutExpired(event.data.object);
        break;
      case "customer.subscription.deleted":
        await onSubscriptionEnded(event.data.object);
        break;
      case "invoice.paid":
        await onInvoicePaid(event.data.object);
        break;
      case "invoice.payment_failed":
        await onInvoiceFailed(event.data.object);
        break;
      default:
        // El resto se acepta sin hacer nada: devolver error haría que Stripe
        // reintentase eternamente eventos que no nos interesan.
        break;
    }
  } catch (err) {
    // Un 500 le dice a Stripe que reintente, que es lo que queremos si el
    // fallo es transitorio (Supabase caído, por ejemplo).
    const detail = err instanceof Error ? err.message : "desconocido";
    console.error(`[stripe] ${event.type} falló: ${detail}`);
    return NextResponse.json({ error: detail }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Pago confirmado ──────────────────────────────────────
async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  // En los pagos únicos, `payment_status` es "paid". En suscripción llega
  // "paid" también cuando la primera factura se cobra en el acto.
  if (session.payment_status === "unpaid") return;

  const order = await getOrderBySession(session.id);
  if (!order) {
    console.error(`[stripe] sesión ${session.id} sin pedido asociado`);
    return;
  }
  // Idempotencia por resultado, no por estado. Lo que dice que un pedido está
  // atendido es tener cuenta y matrícula, no la etiqueta del estado: si se
  // mirase el estado, un pedido cobrado al que le falló la creación de la
  // cuenta quedaría marcado como hecho y el reintento de Stripe saldría por
  // aquí sin arreglar nada. Con user_id, el reintento vuelve a entrar.
  if (order.user_id) return;

  // En una compra directa el pedido nació sin email: aquí es donde llega, y
  // sin él no hay cuenta que crear. Se prefiere el de Stripe al del pedido
  // porque es el que la persona acaba de teclear en la pasarela — si el del
  // formulario tenía una errata, el bueno es éste.
  const email = session.customer_details?.email ?? order.email;
  if (!email) {
    // Que Stripe cobre y no mande correo no debería pasar nunca. Si pasa, se
    // lanza para que Stripe reintente y quede el aviso, en vez de dar el
    // pedido por atendido y dejar a alguien pagando sin acceso.
    throw new Error(`pedido ${order.id}: pago cobrado sin ningún email al que dar acceso`);
  }
  const nombre = [order.first_name, order.last_name].filter(Boolean).join(" ");
  const fullName = nombre || email;

  const offer = isOfferKey(order.offer) ? ALL_OFFERS[order.offer] : null;
  const isInstalments = offer?.mode === "subscription";

  const user = await ensureUser(email, fullName);

  await updateOrder(order.id, {
    // El email se guarda en el pedido: en una compra directa es la única vez
    // que pasa por aquí, y sin esto el histórico quedaría con la columna vacía.
    email,
    status: isInstalments ? "en_plazos" : "pagado",
    amount_total: session.amount_total ?? order.amount_total,
    currency: session.currency ?? order.currency,
    instalments_paid: isInstalments ? 1 : 0,
    stripe_customer_id: idOf(session.customer),
    stripe_payment_intent_id: idOf(session.payment_intent),
    stripe_subscription_id: idOf(session.subscription),
    user_id: user?.id ?? null,
  });

  if (user) {
    await grantEnrollments(user.id, order.courses, order.id);
  }

  await notifySafely({
    event: "order_paid",
    title: "Nueva matrícula pagada",
    lines: [
      `*Alumno:* ${fullName} (${email})`,
      `*Curso(s):* ${order.courses.join(" + ")}`,
      `*Oferta:* ${order.offer}`,
      `*Importe:* ${formatCents(session.amount_total, session.currency)}${isInstalments ? " (plazo 1 de 3)" : ""}`,
      user
        ? user.created
          ? user.emailSent
            ? "*Cuenta:* creada y correo de acceso enviado"
            : "⚠︎ *Cuenta:* creada, pero el correo de acceso NO salió — avísale tú o que entre con «he olvidado mi contraseña»"
          : "*Cuenta:* ya existía, acceso ampliado"
        : "⚠︎ *Cuenta:* no se pudo crear — Stripe reintentará; si no, hay que darla de alta a mano",
    ],
  });

  // El dinero ya está cobrado, así que el pedido se queda registrado pase lo
  // que pase. Pero si no hubo cuenta, esto NO está terminado: se devuelve un
  // error para que Stripe reintente el evento (lo hace con espera creciente
  // durante tres días) y el fallo se arregle solo si era pasajero.
  if (!user) {
    throw new Error(`pedido ${order.id}: pago cobrado pero no se pudo crear la cuenta de ${email}`);
  }
}

// ── El pago diferido acabó rechazado ─────────────────────
async function onAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  const order = await getOrderBySession(session.id);
  if (!order) return;

  await updateOrder(order.id, { status: "fallido" });
  if (order.user_id) await suspendEnrollments(order.user_id, order.courses);

  await notifySafely({
    event: "payment_failed",
    title: "Pago rechazado",
    lines: [
      `*Contacto:* ${order.email}`,
      `*Curso(s):* ${order.courses.join(" + ")}`,
      "El pago diferido no llegó a confirmarse. Acceso suspendido.",
    ],
  });
}

// ── Fin de una suscripción de plazos ─────────────────────
async function onSubscriptionEnded(subscription: Stripe.Subscription) {
  const order = await getOrderBySubscription(subscription.id);
  if (!order) return;

  const offer = isOfferKey(order.offer) ? ALL_OFFERS[order.offer] : null;
  const total = offer?.charges ?? 3;

  // Terminar los tres plazos también cierra la suscripción: eso es el final
  // feliz y el acceso se queda. Lo que hay que atender es lo otro — que se
  // cancele antes de haberlos pagado todos, porque si no quien paga un plazo
  // y cancela se queda el curso entero.
  if (order.instalments_paid >= total) return;

  await updateOrder(order.id, { status: "fallido" });
  if (order.user_id) await suspendEnrollments(order.user_id, order.courses);

  await notifySafely({
    event: "payment_failed",
    title: "Plazos cancelados antes de tiempo",
    lines: [
      `*Alumno:* ${order.email}`,
      `*Curso(s):* ${order.courses.join(" + ")}`,
      `*Pagados:* ${order.instalments_paid} de ${total} plazos.`,
      "Acceso suspendido.",
    ],
  });
}

// ── Checkout abandonado ──────────────────────────────────
async function onCheckoutExpired(session: Stripe.Checkout.Session) {
  const order = await getOrderBySession(session.id);
  if (!order || order.status !== "iniciado") return;

  // En una compra directa el email lo escribió en la pasarela, no aquí:
  // Stripe rellena `customer_details` en cuanto lo teclea, aunque después
  // abandone. Ése es el contacto que hay que recuperar, así que se guarda.
  const email = session.customer_details?.email ?? order.email;
  await updateOrder(order.id, { status: "expirado", ...(email ? { email } : {}) });

  const nombre =
    [order.first_name, order.last_name].filter(Boolean).join(" ") ||
    session.customer_details?.name ||
    "";

  await notifySafely({
    event: "order_abandoned",
    title: "Checkout abandonado",
    lines: [
      `*Contacto:* ${[nombre, email].filter(Boolean).join(" ") || "sin datos"}`,
      `*Quería:* ${order.courses.join(" + ")} · ${order.offer}`,
      email
        ? "Dejó el correo y no completó el pago."
        : "Abandonó antes de dejar ningún dato.",
    ],
  });
}

// ── Plazos ───────────────────────────────────────────────
async function onInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionOf(invoice);
  if (!subscriptionId) return;

  const order = await getOrderBySubscription(subscriptionId);
  if (!order) return;

  const paid = order.instalments_paid + 1;
  const offer = isOfferKey(order.offer) ? ALL_OFFERS[order.offer] : null;
  const total = offer?.charges ?? 3;

  // Un impago anterior pudo suspender el acceso: al ponerse al día se
  // reactiva sin tener que tocar nada a mano.
  if (order.user_id && order.status === "fallido") {
    await grantEnrollments(order.user_id, order.courses, order.id);
  }

  if (paid >= total) {
    // Checkout no sabe cobrar "tres veces y para": la suscripción se corta
    // aquí, contando facturas pagadas. Contarlas es más fiable que calcular
    // una fecha de corte, que se desvía en cuanto hay un reintento.
    try {
      await stripe().subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    } catch (err) {
      console.error(`[stripe] no se pudo cerrar la suscripción ${subscriptionId}: ${err}`);
    }
    await updateOrder(order.id, { instalments_paid: paid, status: "completado" });
    await notifySafely({
      event: "order_paid",
      title: "Plazos completados",
      lines: [
        `*Alumno:* ${order.email}`,
        `*Curso(s):* ${order.courses.join(" + ")}`,
        `Pagados los ${total} plazos. Suscripción cerrada.`,
      ],
    });
    return;
  }

  await updateOrder(order.id, { instalments_paid: paid, status: "en_plazos" });
}

async function onInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = subscriptionOf(invoice);
  if (!subscriptionId) return;

  const order = await getOrderBySubscription(subscriptionId);
  if (!order) return;

  await updateOrder(order.id, { status: "fallido" });
  if (order.user_id) await suspendEnrollments(order.user_id, order.courses);

  await notifySafely({
    event: "payment_failed",
    title: "Plazo rechazado",
    lines: [
      `*Alumno:* ${order.email}`,
      `*Curso(s):* ${order.courses.join(" + ")}`,
      `*Plazo:* ${order.instalments_paid + 1} de ${OFFERS["curso-plazos"].charges}`,
      "Acceso suspendido hasta que se regularice.",
    ],
  });
}

// ── Utilidades ───────────────────────────────────────────

/** Stripe devuelve o el id o el objeto expandido, según la petición. */
function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * De qué suscripción es una factura.
 *
 * ⚠︎ En la API 2026-07-29 el campo `subscription` ya no cuelga directamente de
 * la factura: está en `parent.subscription_details.subscription`. El camino
 * viejo se deja como respaldo por si llega un evento emitido con una versión
 * anterior de la API, cosa que pasa mientras se migra una cuenta.
 */
function subscriptionOf(invoice: Stripe.Invoice): string | null {
  const fromParent = idOf(invoice.parent?.subscription_details?.subscription);
  if (fromParent) return fromParent;

  const legacy = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  return idOf(legacy);
}

function formatCents(amount: number | null, currency: string | null): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: (currency ?? "eur").toUpperCase(),
  }).format(amount / 100);
}
