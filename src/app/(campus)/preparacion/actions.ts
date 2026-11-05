"use server";

import { revalidatePath } from "next/cache";

import { marcarPaso } from "@/lib/dry-run/datos";
import { CLAVES_PASOS, PASOS } from "@/lib/dry-run/preparacion";
import { CON_PLAZA, type Feedback } from "@/lib/dry-run/tipos";
import { notify } from "@/lib/slack/notify";
import { createAdminClient } from "@/lib/supabase/admin";
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

const nota = (v: FormDataEntryValue | null, max: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= (max === 10 ? 0 : 1) && n <= max ? n : null;
};
const texto = (v: FormDataEntryValue | null) => String(v ?? "").trim().slice(0, 3000);

/** El formulario de feedback. Se puede volver a enviar: manda el último. */
export async function enviarFeedback(guestId: string, formData: FormData) {
  const user = await quien();
  if (!user) return { error: "Tu sesión ha caducado. Vuelve a entrar." };

  const admin = createAdminClient();
  const { data: guest } = await admin
    .from("dry_run_guests")
    .select("id, dry_run_id, full_name, email")
    .eq("id", guestId)
    .eq("user_id", user.id)
    .in("status", CON_PLAZA)
    .maybeSingle();
  if (!guest) return { error: "No encontramos tu plaza." };

  const pagaria = String(formData.get("pagaria") ?? "");
  const feedback: Partial<Feedback> = {
    nps: nota(formData.get("nps"), 10) ?? undefined,
    clase: nota(formData.get("clase"), 5) ?? undefined,
    ritmo: nota(formData.get("ritmo"), 5) ?? undefined,
    contenido: nota(formData.get("contenido"), 5) ?? undefined,
    campus: nota(formData.get("campus"), 5) ?? undefined,
    docente: nota(formData.get("docente"), 5) ?? undefined,
    pagaria: pagaria === "si" || pagaria === "quiza" || pagaria === "no" ? pagaria : undefined,
    gusto: texto(formData.get("gusto")),
    cambiaria: texto(formData.get("cambiaria")),
    comentario: texto(formData.get("comentario")),
  };
  if (feedback.nps === undefined) return { error: "Falta la nota de 0 a 10." };

  const { error } = await admin
    .from("dry_run_guests")
    .update({ feedback, feedback_at: new Date().toISOString() })
    .eq("id", guest.id);
  if (error) return { error: "No se pudo guardar. Inténtalo otra vez." };

  // El recordatorio de feedback ya no toca.
  await admin
    .from("dry_run_emails")
    .update({ status: "cancelado", error: "ya dejó su opinión" })
    .eq("guest_id", guest.id)
    .eq("kind", "feedback")
    .eq("status", "pendiente");

  const { data: run } = await admin.from("dry_runs").select("title").eq("id", guest.dry_run_id).maybeSingle();
  await notify({
    event: "user_created",
    title: "Feedback nuevo del dry run",
    lines: [
      `*Sesión:* ${run?.title ?? "—"}`,
      `*De:* ${guest.full_name || guest.email}`,
      `*Recomendaría (0-10):* ${feedback.nps}`,
      feedback.cambiaria ? `*Cambiaría:* ${feedback.cambiaria.slice(0, 280)}` : "",
    ].filter(Boolean),
  }).catch(() => undefined);

  revalidatePath("/preparacion");
  return { ok: true };
}
