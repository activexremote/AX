"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { assertSuperAdmin } from "@/lib/lens/auth";
import type { LensScenarioData } from "@/lib/lens/calculadora";

export async function saveScenario(name: string, data: LensScenarioData) {
  const userId = await assertSuperAdmin();
  if (!name.trim()) return { error: "Ponle un nombre al escenario." };

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("lens_scenarios")
    .insert({ name: name.trim(), data, created_by: userId })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/lens/calculadora-matriculas");
  return { ok: true, id: row.id as string };
}

export async function updateScenario(id: string, name: string, data: LensScenarioData) {
  await assertSuperAdmin();
  if (!name.trim()) return { error: "Ponle un nombre al escenario." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("lens_scenarios")
    .update({ name: name.trim(), data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/lens/calculadora-matriculas");
  return { ok: true };
}

export async function deleteScenario(id: string) {
  await assertSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("lens_scenarios").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/lens/calculadora-matriculas");
  return { ok: true };
}
