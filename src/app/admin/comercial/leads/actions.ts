"use server";

import { revalidatePath } from "next/cache";

import { assertComercial } from "@/lib/comercial/acceso";
import { limpiar } from "@/lib/comercial/perfilado";
import { createAdminClient } from "@/lib/supabase/admin";

/** Guarda la ficha de perfilado de un lead de Zoho. */
export async function guardarPerfil(
  zohoId: string,
  lead: { nombre: string; email: string | null; estado: string | null; creado: string | null },
  respuestas: Record<string, unknown>,
  notas: string,
): Promise<{ ok?: true; error?: string; guardado?: string }> {
  let quien;
  try {
    quien = await assertComercial();
  } catch {
    return { error: "No tienes permiso para esto." };
  }
  if (!/^\d{5,25}$/.test(zohoId)) return { error: "Lead no válido." };

  const ahora = new Date().toISOString();
  const { error } = await createAdminClient()
    .from("lead_profiles")
    .upsert(
      {
        zoho_id: zohoId,
        lead_name: lead.nombre.slice(0, 200),
        lead_email: lead.email?.slice(0, 200) ?? null,
        lead_status: lead.estado?.slice(0, 80) ?? null,
        lead_created_at: lead.creado,
        answers: limpiar(respuestas),
        notes: notas.trim().slice(0, 4000) || null,
        updated_by: quien.id,
      },
      { onConflict: "zoho_id" },
    );
  if (error) return { error: `No se ha podido guardar: ${error.message}` };
  revalidatePath("/admin/comercial/leads");
  revalidatePath("/admin/comercial/analisis");
  return { ok: true, guardado: ahora };
}
