// Crea el primer usuario administrador. Uso:
//   node scripts/create-admin.mjs <email> <password> "<Nombre>"
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const [, , email, password, name] = process.argv;
if (!email || !password) {
  console.error('Uso: node scripts/create-admin.mjs <email> <password> "<Nombre>"');
  process.exit(1);
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: name ?? email.split("@")[0] },
});

if (error) {
  console.error("Error creando usuario:", error.message);
  process.exit(1);
}

const { error: roleErr } = await admin
  .from("profiles")
  .update({ role: "administrador", full_name: name ?? null })
  .eq("id", data.user.id);

if (roleErr) {
  console.error("Usuario creado pero fallo asignando rol:", roleErr.message);
  process.exit(1);
}

console.log(`✓ Administrador creado: ${email}`);
