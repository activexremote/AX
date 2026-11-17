"use server";

import { revalidatePath } from "next/cache";

import { assertComercial } from "@/lib/comercial/acceso";
import { analizarConIA } from "@/lib/comercial/insights";
import { fichas, leadsDeZoho } from "@/lib/comercial/leads";
import { createAdminClient } from "@/lib/supabase/admin";

/** Pide a la IA una lectura nueva de los perfilados y la guarda. */
export async function generarAnalisis(): Promise<{ ok?: true; error?: string }> {
  let quien;
  try {
    quien = await assertComercial();
  } catch {
    return { error: "No tienes permiso para esto." };
  }
  const [todas, { leads }] = await Promise.all([fichas(), leadsDeZoho()]);
  const conDatos = todas.filter((f) => Object.keys(f.answers ?? {}).length || f.notes);
  if (conDatos.length < 3) return { error: "Hacen falta al menos 3 leads perfilados para que la IA saque algo útil." };
  try {
    const content = await analizarConIA(todas, leads.length);
    const { error } = await createAdminClient().from("lead_insights").insert({ created_by: quien.id, leads_count: conDatos.length, content });
    if (error) return { error: `No se ha podido guardar: ${error.message}` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "La IA no ha podido analizarlo ahora." };
  }
  revalidatePath("/admin/comercial/analisis");
  return { ok: true };
}
