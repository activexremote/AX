"use server";

import { revalidatePath } from "next/cache";

import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";

/** Corta un acceso del conector de Claude al momento. */
export async function revocarConexion(id: string) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return { error: "No autorizado." };
  await createAdminClient().from("mcp_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", id).is("revoked_at", null);
  revalidatePath("/admin/conexiones");
  return {};
}
