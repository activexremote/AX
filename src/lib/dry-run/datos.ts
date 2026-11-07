import { cache } from "react";

import { encolar } from "@/lib/dry-run/cola";
import { CON_PLAZA, type DryRun, type DryRunGuest, type Utm } from "@/lib/dry-run/tipos";
import { usuarioActual } from "@/lib/data/usuario";
import { notify } from "@/lib/slack/notify";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Lecturas y la inscripción del dry run
//
//  Todo con la service role: las tablas del dry run no tienen políticas
//  (nadie las lee con la clave pública). Quien llama ya ha comprobado quién
//  es: la página pública sólo enseña lo que es público de la sesión, y la
//  inscripción se hace con el usuario de la sesión, nunca con uno que venga
//  del formulario.
// ══════════════════════════════════════════════════════════

export type SesionPublica = {
  run: DryRun;
  modulo: { title: string; description: string | null; slug: string; numero: number };
  lecciones: { title: string; subtitle: string | null }[];
  ocupadas: number;
};

export const getSesionPublica = cache(async (slug: string): Promise<SesionPublica | null> => {
  const admin = createAdminClient();
  const { data: run } = await admin.from("dry_runs").select("*").eq("slug", slug).maybeSingle();
  if (!run) return null;
  const [{ data: modulo }, { data: lecciones }, { count }] = await Promise.all([
    admin.from("modules").select("title, description, slug, order_index").eq("id", run.module_id).maybeSingle(),
    admin.from("lessons").select("title, subtitle").eq("module_id", run.module_id).order("order_index"),
    admin.from("dry_run_guests").select("id", { count: "exact", head: true }).eq("dry_run_id", run.id).in("status", CON_PLAZA),
  ]);
  return {
    run: run as DryRun,
    modulo: {
      title: modulo?.title ?? "",
      description: modulo?.description ?? null,
      slug: modulo?.slug ?? "",
      numero: modulo?.order_index ?? 1,
    },
    lecciones: lecciones ?? [],
    ocupadas: count ?? 0,
  };
});

/** El dry run de quien está dentro: el próximo con plaza, o el último si ya pasaron todos. */
export const getMiDryRun = cache(async (): Promise<{ guest: DryRunGuest; run: DryRun } | null> => {
  const user = await usuarioActual();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: guests } = await admin
    .from("dry_run_guests")
    .select("*")
    .eq("user_id", user.id)
    .in("status", CON_PLAZA);
  if (!guests?.length) return null;

  const { data: runs } = await admin
    .from("dry_runs")
    .select("*")
    .in("id", guests.map((g) => g.dry_run_id));
  const ahora = Date.now();
  const ordenados = ((runs ?? []) as DryRun[]).sort((a, b) => {
    const fa = new Date(a.ends_at).getTime() >= ahora;
    const fb = new Date(b.ends_at).getTime() >= ahora;
    if (fa !== fb) return fa ? -1 : 1;
    return fa ? a.starts_at.localeCompare(b.starts_at) : b.starts_at.localeCompare(a.starts_at);
  });
  const run = ordenados[0];
  if (!run) return null;
  return { run, guest: guests.find((g) => g.dry_run_id === run.id) as DryRunGuest };
});

/** Lo que el campus necesita saber para no mandar a la pantalla de «sin acceso» a un invitado. */
export async function tieneModulosSueltos(userId: string): Promise<boolean> {
  const { count } = await createAdminClient()
    .from("module_grants")
    .select("module_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt."${new Date().toISOString()}"`);
  return (count ?? 0) > 0;
}

export type DatosReserva = { ref?: string | null; inv?: string | null; utm?: Utm };

export type ResultadoReserva =
  | { ok: true; guestId: string; nueva: boolean }
  | { ok: false; motivo: "no-existe" | "cerrado" | "completo" | "error"; detalle?: string };

const limpiarCorreo = (e: string) => e.trim().toLowerCase();

/**
 * Da plaza a quien está dentro. Idempotente: volver a confirmar no duplica
 * nada ni reenvía la bienvenida.
 *
 * Se busca su fila por este orden: la del enlace personal de la invitación
 * (aunque entre con otra cuenta de Google que la invitada), la de su correo y
 * la de su usuario. Si no hay ninguna, es alguien que llegó por un enlace
 * público y se crea.
 */
export async function reservarPlaza(
  user: { id: string; email: string; nombre: string | null },
  slug: string,
  datos: DatosReserva,
): Promise<ResultadoReserva> {
  const admin = createAdminClient();
  const { data: runRow } = await admin.from("dry_runs").select("*").eq("slug", slug).maybeSingle();
  if (!runRow) return { ok: false, motivo: "no-existe" };
  const run = runRow as DryRun;
  const email = limpiarCorreo(user.email);

  const buscar = async (columna: "token" | "email" | "user_id", valor: string) =>
    (await admin.from("dry_run_guests").select("*").eq("dry_run_id", run.id).eq(columna, valor).maybeSingle()).data as DryRunGuest | null;

  let guest: DryRunGuest | null = null;
  if (datos.inv && /^[a-f0-9]{32}$/.test(datos.inv)) {
    const porToken = await buscar("token", datos.inv);
    if (porToken && (!porToken.user_id || porToken.user_id === user.id)) guest = porToken;
  }
  guest ??= (await buscar("user_id", user.id)) ?? (await buscar("email", email));

  if (guest && guest.user_id === user.id && CON_PLAZA.includes(guest.status)) {
    return { ok: true, guestId: guest.id, nueva: false };
  }

  if (!run.registration_open) return { ok: false, motivo: "cerrado" };
  if (new Date(run.ends_at).getTime() < Date.now()) return { ok: false, motivo: "cerrado" };
  if (run.capacity) {
    const { count } = await admin
      .from("dry_run_guests")
      .select("id", { count: "exact", head: true })
      .eq("dry_run_id", run.id)
      .in("status", CON_PLAZA);
    if ((count ?? 0) >= run.capacity) return { ok: false, motivo: "completo" };
  }

  const { data: link } = datos.ref
    ? await admin.from("dry_run_links").select("id").eq("dry_run_id", run.id).eq("code", datos.ref).maybeSingle()
    : { data: null };

  const ahora = new Date().toISOString();
  const utm = datos.utm && Object.keys(datos.utm).length ? datos.utm : {};

  let fila: DryRunGuest;
  if (guest) {
    // Si entra con otra cuenta que la invitada, los correos van a la cuenta
    // con la que ha entrado: es la que va a mirar. Salvo que esa dirección ya
    // tenga otra fila en la sesión.
    const otra = guest.email !== email ? await buscar("email", email) : null;
    const { data, error } = await admin
      .from("dry_run_guests")
      .update({
        user_id: user.id,
        email: otra ? guest.email : email,
        full_name: guest.full_name || user.nombre,
        status: "registrado",
        registered_at: ahora,
        // Reservar es confirmar; si el equipo ya le marcó la asistencia, se queda.
        tracking: guest.tracking === "pendiente" || guest.tracking === "rechazado" ? "confirmado" : guest.tracking,
        link_id: guest.link_id ?? link?.id ?? null,
        utm: Object.keys(guest.utm ?? {}).length ? guest.utm : utm,
        unsubscribed_at: null,
      })
      .eq("id", guest.id)
      .select("*")
      .single();
    if (error || !data) return { ok: false, motivo: "error", detalle: error?.message };
    fila = data as DryRunGuest;
  } else {
    const { data, error } = await admin
      .from("dry_run_guests")
      .insert({
        dry_run_id: run.id,
        link_id: link?.id ?? null,
        email,
        full_name: user.nombre,
        user_id: user.id,
        status: "registrado",
        tracking: "confirmado",
        registered_at: ahora,
        utm,
      })
      .select("*")
      .single();
    if (error || !data) return { ok: false, motivo: "error", detalle: error?.message };
    fila = data as DryRunGuest;
  }

  const { error: grantErr } = await admin
    .from("module_grants")
    .upsert(
      { user_id: user.id, module_id: run.module_id, source: "dry-run", expires_at: run.access_until },
      { onConflict: "user_id,module_id" },
    );
  if (grantErr) return { ok: false, motivo: "error", detalle: grantErr.message };

  // Los recordatorios de invitación ya no tocan.
  await admin
    .from("dry_run_emails")
    .update({ status: "cancelado", error: "ya tiene plaza" })
    .eq("guest_id", fila.id)
    .eq("status", "pendiente")
    .in("kind", ["invitacion", "invitacion_recordatorio"]);

  await encolar(fila, run, "plaza");

  await notify({
    event: "user_created",
    title: "Nueva plaza en el dry run",
    lines: [
      `*Sesión:* ${run.title}`,
      `*Nombre:* ${fila.full_name || email.split("@")[0]}`,
      `*Email:* ${email}`,
      `*Origen:* ${fila.utm?.source ? `${fila.utm.source} / ${fila.utm.medium ?? "—"}` : datos.ref || "directo"}`,
    ],
  }).catch(() => undefined);

  return { ok: true, guestId: fila.id, nueva: true };
}

/** Marca un paso de la lista de preparación (o lo desmarca). */
export async function marcarPaso(userId: string, key: string, hecho = true) {
  const admin = createAdminClient();
  const { data: guests } = await admin.from("dry_run_guests").select("id, onboarding").eq("user_id", userId).in("status", CON_PLAZA);
  for (const g of guests ?? []) {
    const actual = (g.onboarding ?? {}) as Record<string, string>;
    if (Boolean(actual[key]) === hecho) continue;
    const siguiente = { ...actual };
    if (hecho) siguiente[key] = new Date().toISOString();
    else delete siguiente[key];
    await admin.from("dry_run_guests").update({ onboarding: siguiente }).eq("id", g.id);
  }
}
