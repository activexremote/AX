"use server";

import { revalidatePath, updateTag } from "next/cache";

import { KPIS_TAG } from "@/lib/kpis/panel";
import { createClient } from "@/lib/supabase/server";

/** «Actualizar»: vacía la caché de 15 minutos y vuelve a pedir todas las fuentes. */
export async function actualizarKpis() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  updateTag(KPIS_TAG);
  revalidatePath("/admin/comercial/kpis");
}
