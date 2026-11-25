"use server";

import { revalidatePath } from "next/cache";

import { marcarPaso } from "@/lib/dry-run/datos";
import { CLAVES_PASOS, PASOS } from "@/lib/dry-run/preparacion";
import { createClient } from "@/lib/supabase/server";

async function quien() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Marcar o desmarcar un paso de la lista. Los automáticos no se tocan a mano. */
export async function cambiarPaso(key: string, hecho: boolean) {
  const user = await quien();
  if (!user) return { error: "no-auth" };
  if (!CLAVES_PASOS.has(key) || PASOS.find((p) => p.key === key)?.automatico) return { error: "paso no válido" };
  await marcarPaso(user.id, key, hecho);
  revalidatePath("/preparacion");
  return { ok: true };
}

// El feedback ya no se deja aquí: la encuesta vive en /dry-run/<slug>/encuesta
// (lib/dry-run/encuesta-datos.ts).

/** La prueba de cámara y micrófono del campus ha ido bien: marca el paso. */
export async function equipoProbado() {
  const user = await quien();
  if (!user) return { error: "errSession" };
  await marcarPaso(user.id, "equipo");
  revalidatePath("/preparacion");
  return { ok: true };
}
