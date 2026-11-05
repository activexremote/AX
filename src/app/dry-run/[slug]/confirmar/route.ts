import { after, NextResponse, type NextRequest } from "next/server";

import { procesarCola } from "@/lib/dry-run/cola";
import { reservarPlaza } from "@/lib/dry-run/datos";
import { COOKIE_RESERVA, type CookieReserva } from "@/lib/dry-run/reserva";
import { createClient } from "@/lib/supabase/server";

// GET /dry-run/<slug>/confirmar
//
// Adonde vuelve Google tras «Reservar mi plaza» (y adonde va directamente
// quien ya tenía sesión). Da la plaza con el usuario de la sesión, manda la
// bienvenida y lleva a la página de preparación del campus.

export const maxDuration = 60;

function leerCookie(valor: string | undefined, slug: string): CookieReserva | null {
  if (!valor) return null;
  try {
    const c = JSON.parse(valor) as CookieReserva;
    return c?.slug === slug ? c : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const origin = request.nextUrl.origin;
  const landing = (estado?: string) => NextResponse.redirect(`${origin}/dry-run/${slug}${estado ? `?estado=${estado}` : ""}`);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return landing();

  const reserva = leerCookie(request.cookies.get(COOKIE_RESERVA)?.value, slug);
  const nombre = (user.user_metadata?.full_name as string | undefined) || (user.user_metadata?.name as string | undefined) || null;

  const r = await reservarPlaza({ id: user.id, email: user.email, nombre }, slug, {
    ref: reserva?.ref,
    inv: reserva?.inv,
    utm: reserva?.utm,
  });

  if (!r.ok) {
    if (r.motivo === "error") console.error(`[dry-run] no se pudo reservar plaza en ${slug}: ${r.detalle}`);
    return landing(r.motivo);
  }

  // La bienvenida sale ya, sin esperar al siguiente pase de la cola.
  if (r.nueva) after(() => procesarCola({ guestIds: [r.guestId] }).catch((e) => console.error(`[dry-run] cola: ${e}`)));

  const res = NextResponse.redirect(`${origin}/preparacion${r.nueva ? "?bienvenida=1" : ""}`);
  res.cookies.delete(COOKIE_RESERVA);
  return res;
}
