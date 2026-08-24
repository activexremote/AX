// Manda a Zoho los leads que se quedaron sin mandar.
//
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs \
//     scripts/zoho-sync-leads.mjs [--aplicar]
//
// Sin --aplicar sólo dice cuáles faltan. Con --aplicar los sube.
//
// Hace falta porque el formulario guarda en Supabase pase lo que pase, pero
// sólo llama a Zoho si el servidor que lo atendió tenía las variables. Un
// despliegue sin ellas, o un servidor de desarrollo arrancado antes de
// configurarlas, deja leads correctos en la base y ausentes en el CRM. Esto
// los repesca: se reconocen porque tienen `zoho_lead_id` a nulo.
import { createClient } from "@supabase/supabase-js";
import { upsertZohoLead } from "@/lib/zoho/crm.ts";

const ETIQUETAS = {
  "remote-professional": "Remote Professional",
  "remote-founder": "Remote Founder",
};

const aplicar = process.argv.includes("--aplicar");

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: pendientes, error } = await admin
  .from("leads")
  .select("id, first_name, last_name, email, phone, city, courses, locale, created_at")
  .is("zoho_lead_id", null)
  .order("created_at", { ascending: true });

if (error) {
  console.error("No se pudo leer la tabla de leads:", error.message);
  process.exit(1);
}

if (!pendientes.length) {
  console.log("No hay leads pendientes: todos tienen su ficha en Zoho.");
  process.exit(0);
}

console.log(`${pendientes.length} lead(s) sin ficha en Zoho:\n`);
for (const l of pendientes) {
  console.log(`  ${l.created_at.slice(0, 10)}  ${l.first_name} ${l.last_name} · ${l.email}`);
}

if (!aplicar) {
  console.log("\nEsto ha sido un ensayo. Para subirlos de verdad: añade --aplicar");
  process.exit(0);
}

console.log("\nSubiendo…\n");
for (const l of pendientes) {
  const id = await upsertZohoLead({
    firstName: l.first_name,
    lastName: l.last_name,
    email: l.email,
    phone: l.phone,
    city: l.city,
    courses: (l.courses ?? []).map((c) => ETIQUETAS[c] ?? c),
    locale: l.locale ?? undefined,
  });
  if (id) {
    await admin.from("leads").update({ zoho_lead_id: id }).eq("id", l.id);
    console.log(`  ✓ ${l.email} → ${id}`);
  } else {
    console.log(`  ✗ ${l.email} — no se pudo crear en Zoho`);
  }
}
