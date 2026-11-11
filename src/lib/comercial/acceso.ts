import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Quién entra al gestor comercial
//
//  El equipo comercial y la administración. El rol «comercial» no ve nada
//  más del panel: el layout de /admin lo devuelve aquí desde cualquier otra
//  ruta, y el campus lo manda al panel (no tiene clases que ver).
// ══════════════════════════════════════════════════════════

export const RUTA_COMERCIAL = "/admin/comercial";

export const puedeVender = (role: UserRole | null | undefined) => role === "comercial" || role === "administrador";

/** ¿Puede este rol estar en esta ruta del panel? */
export function rutaPermitida(role: UserRole, ruta: string) {
  if (role !== "comercial") return true;
  return ruta === RUTA_COMERCIAL || ruta.startsWith(`${RUTA_COMERCIAL}/`);
}

/** Para las páginas: quien no vende vuelve a su sitio. */
export async function exigirComercial() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!puedeVender(profile.role)) redirect(profile.role === "profesor" ? "/admin" : "/");
  return profile;
}

/** Para las acciones: comprueba el rol en la base de datos, no en el navegador. */
export async function assertComercial() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");
  const { data: profile } = await supabase.from("profiles").select("id, role, full_name, email").eq("id", user.id).maybeSingle();
  if (!puedeVender(profile?.role as UserRole | undefined)) throw new Error("forbidden");
  return profile as { id: string; role: UserRole; full_name: string | null; email: string | null };
}
