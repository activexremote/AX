import { createClient } from "@/lib/supabase/server";

/** Perfil + condición de superadmin de la sesión actual, o null si no hay sesión. */
export async function getLensSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: superadmin }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("superadmins").select("user_id").eq("user_id", user.id).maybeSingle(),
  ]);

  return { userId: user.id, profile, isSuperAdmin: !!superadmin };
}

/** Guard para Server Actions de /lens: lanza si quien llama no es superadmin. */
export async function assertSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data } = await supabase.from("superadmins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) throw new Error("forbidden");
  return user.id;
}
