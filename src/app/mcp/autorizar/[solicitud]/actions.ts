"use server";

import { redirect } from "next/navigation";

import { CODIGO_SEG, aleatorio, hash, leerFirmado } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Solicitud = { c: string; r: string; s: string; p: string };

/** «Permitir»: un código de un solo uso para quien ha iniciado sesión, de vuelta a Claude. */
export async function permitir(solicitud: string) {
  const sol = leerFirmado<Solicitud>(solicitud);
  if (!sol) throw new Error("La solicitud ha caducado. Vuelve a conectar desde Claude.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Inicia sesión primero.");
  const { data: perfil } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (perfil?.role !== "administrador") throw new Error("Sólo los administradores pueden conectar Claude.");

  const codigo = aleatorio();
  const { error } = await createAdminClient()
    .from("mcp_codes")
    .insert({
      code_hash: hash(codigo),
      client_id: sol.c,
      user_id: user.id,
      redirect_uri: sol.r,
      code_challenge: sol.p,
      expires_at: new Date(Date.now() + CODIGO_SEG * 1000).toISOString(),
    });
  if (error) throw new Error("No se pudo autorizar. Vuelve a intentarlo.");

  const u = new URL(sol.r);
  u.searchParams.set("code", codigo);
  if (sol.s) u.searchParams.set("state", sol.s);
  redirect(u.toString());
}

/** «Cancelar»: de vuelta a Claude sin acceso. */
export async function denegar(solicitud: string) {
  const sol = leerFirmado<Solicitud>(solicitud);
  if (!sol) redirect("/");
  const u = new URL(sol.r);
  u.searchParams.set("error", "access_denied");
  if (sol.s) u.searchParams.set("state", sol.s);
  redirect(u.toString());
}
