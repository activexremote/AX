"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/slack/notify";
import type { UserRole } from "@/lib/supabase/types";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return user.id;
}

export async function changeUserRole(userId: string, role: UserRole) {
  const selfId = await assertAdmin();
  if (userId === selfId && role !== "administrador") {
    return { error: "No puedes quitarte a ti mismo el rol de administrador." };
  }
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function inviteUser(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "alumno") as UserRole;

  if (!email || !password) return { error: "Email y contraseña son obligatorios." };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || email.split("@")[0] },
  });
  if (error) return { error: error.message };

  if (data.user) {
    await admin.from("profiles").update({ role, full_name: fullName || null }).eq("id", data.user.id);
  }

  await notify({
    event: "user_created",
    title: "Nuevo usuario en el campus",
    lines: [
      `*Nombre:* ${fullName || email.split("@")[0]}`,
      `*Email:* ${email}`,
      `*Rol:* ${role}`,
    ],
  });

  revalidatePath("/admin/usuarios");
  return { ok: true };
}
