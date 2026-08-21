import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/slack/notify";
import type { CourseKey, Order, OrderPlan } from "@/lib/supabase/types";

// Todo lo que toca pedidos y matrículas pasa por aquí y usa la service role.
// Nada de esto puede depender del navegador: el importe, el curso comprado y
// la concesión del acceso los decide el servidor a partir de lo que Stripe
// confirma, nunca a partir de lo que llega en un formulario.

type NewOrder = {
  /** Nulo en la compra directa: lo recoge Stripe y lo escribe el webhook. */
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  locale: string;
  courses: CourseKey[];
  plan: OrderPlan;
  offer: string;
  amountTotal: number;
  currency: string;
};

/**
 * Crea el pedido ANTES de mandar a nadie a Stripe.
 *
 * Es la pieza que evita perder a quien se cae en el pago: para cuando el
 * navegador sale hacia Stripe ya tenemos su email, su nombre y qué quería
 * comprar. Si nunca vuelve, la fila se queda en 'iniciado' y luego el webhook
 * la marca como abandonada, que es una lista de gente a la que llamar.
 */
export async function createPendingOrder(input: NewOrder): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .insert({
      // Puede ir vacío en una compra directa: lo rellena el webhook con el
      // correo que recoge Stripe (ver la migración 0009).
      email: input.email ?? null,
      first_name: input.firstName,
      last_name: input.lastName,
      locale: input.locale,
      courses: input.courses,
      plan: input.plan,
      offer: input.offer,
      amount_total: input.amountTotal,
      currency: input.currency,
      status: "iniciado",
    })
    .select("id")
    .single();

  // El error se registra: antes se devolvía null a secas y desde fuera un
  // fallo de la base de datos era indistinguible de cualquier otro, así que
  // el motivo real —una columna, un permiso, una restricción— no aparecía en
  // ningún sitio.
  if (error) {
    console.error(`[orders] no se pudo crear el pedido: ${error.message}`);
    return null;
  }
  return data.id;
}

export async function attachSession(orderId: string, sessionId: string) {
  const admin = createAdminClient();
  await admin.from("orders").update({ stripe_session_id: sessionId }).eq("id", orderId);
}

export async function getOrderBySession(sessionId: string): Promise<Order | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  return (data as Order) ?? null;
}

export async function getOrderBySubscription(subscriptionId: string): Promise<Order | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("orders")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  return (data as Order) ?? null;
}

/**
 * Cuenta del campus para el email de la compra.
 *
 * La cuenta se crea SIN mandar correo, y el correo se manda después como algo
 * aparte que puede fallar. Antes iban juntos —se usaba la invitación por email
 * para crear al usuario— y eso ataba el acceso a que el envío saliera bien: el
 * servicio de correo integrado de Supabase está limitado a unos pocos envíos
 * por hora, así que en cuanto se juntaban dos matrículas seguidas, la segunda
 * se quedaba pagada y sin cuenta.
 *
 * Ahora, si el correo no sale, el alumno tiene cuenta y matrícula igualmente:
 * puede entrar con "he olvidado mi contraseña" y a alguien le llega el aviso
 * por Slack.
 *
 * Si ya existe (quien compra el segundo curso, o se registró antes) se
 * reutiliza: un usuario duplicado partiría el progreso en dos cuentas.
 */
export async function ensureUser(
  email: string,
  fullName: string,
): Promise<{ id: string; created: boolean; emailSent: boolean } | null> {
  const admin = createAdminClient();
  const lower = email.trim().toLowerCase();

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("email", lower)
    .maybeSingle();
  if (existing) return { id: existing.id, created: false, emailSent: false };

  // `email_confirm: true` da la cuenta por verificada: quien acaba de pagar
  // con su tarjeta ya ha demostrado bastante, y pedirle que confirme el correo
  // antes de entrar sería una puerta más entre el pago y el curso.
  const { data, error } = await admin.auth.admin.createUser({
    email: lower,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    // Puede fallar por carrera (dos entregas del mismo webhook a la vez) o
    // porque el usuario ya existía en auth sin fila en profiles.
    const { data: retry } = await admin
      .from("profiles")
      .select("id")
      .eq("email", lower)
      .maybeSingle();
    return retry ? { id: retry.id, created: false, emailSent: false } : null;
  }

  // Y ahora sí, el correo para que se ponga contraseña. Que falle no anula
  // nada de lo anterior.
  const emailSent = await sendAccessEmail(lower);
  return { id: data.user.id, created: true, emailSent };
}

/** Enlace para establecer contraseña y entrar. Devuelve si salió o no. */
async function sendAccessEmail(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const { error } = await admin.auth.resetPasswordForEmail(
    email,
    site ? { redirectTo: `${site}/auth/callback?next=/` } : undefined,
  );
  if (error) {
    console.error(`[matricula] no se pudo enviar el acceso a ${email}: ${error.message}`);
    return false;
  }
  return true;
}

/** Abre el acceso a los cursos comprados. Reactiva si ya existía suspendida. */
export async function grantEnrollments(
  userId: string,
  courses: CourseKey[],
  orderId: string,
) {
  const admin = createAdminClient();
  const rows = courses
    .filter((c): c is Exclude<CourseKey, "core"> => c !== "core")
    .map((course) => ({ user_id: userId, course, order_id: orderId, active: true }));
  if (!rows.length) return;
  await admin.from("enrollments").upsert(rows, { onConflict: "user_id,course" });
}

/** Suspende sin borrar: un plazo impagado se puede poner al día. */
export async function suspendEnrollments(userId: string, courses: CourseKey[]) {
  const admin = createAdminClient();
  for (const course of courses) {
    if (course === "core") continue;
    await admin
      .from("enrollments")
      .update({ active: false })
      .eq("user_id", userId)
      .eq("course", course);
  }
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const admin = createAdminClient();
  await admin.from("orders").update(patch).eq("id", id);
}

/** Aviso a Slack. Nunca debe tumbar el webhook: si Slack falla, el pago ya
 *  está cobrado y el acceso concedido, que es lo que importa. */
export async function notifySafely(input: Parameters<typeof notify>[0]) {
  try {
    await notify(input);
  } catch {
    // ignorado a propósito
  }
}
