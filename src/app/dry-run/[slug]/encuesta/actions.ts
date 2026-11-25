"use server";

import { redirect } from "next/navigation";

import { signInWithGoogle } from "@/app/login/actions";
import { bloquesEn, leerRespuestas } from "@/lib/dry-run/encuesta";
import { guardarRespuesta } from "@/lib/dry-run/encuesta-datos";
import type { DryRun } from "@/lib/dry-run/tipos";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const destino = (slug: string) => `/dry-run/${slug}/encuesta`;

/** «Entrar con Google y responder». Google vuelve a la encuesta. */
export async function entrarParaResponder(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!SLUG.test(slug)) redirect("/");
  const fd = new FormData();
  fd.set("redirect", destino(slug));
  // Si va bien, redirige a Google y no vuelve.
  await signInWithGoogle(fd);
  redirect(`${destino(slug)}?estado=google`);
}

/** «¿No eres tú?»: cierra la sesión y vuelve a preguntar a Google con qué cuenta. */
export async function cambiarCuenta(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!SLUG.test(slug)) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  const fd = new FormData();
  fd.set("redirect", destino(slug));
  await signInWithGoogle(fd);
  redirect(destino(slug));
}

export type ResultadoEncuesta = { ok: true } | { ok: false; error: string; falta?: string };

const ERRORES = {
  es: {
    noExiste: "Esta encuesta no existe.",
    sesion: "Tu sesión ha caducado. Vuelve a entrar con Google; lo que has marcado no se pierde si no recargas.",
    cerrada: "La encuesta se abre cuando empieza la clase.",
    falta: (t: string) => `Falta por contestar: «${t}»`,
    guardar: "No hemos podido guardar tus respuestas. Vuelve a intentarlo en un momento.",
  },
  en: {
    noExiste: "This survey does not exist.",
    sesion: "Your session has expired. Sign in with Google again; what you have ticked is kept as long as you don't reload.",
    cerrada: "The survey opens when the class starts.",
    falta: (t: string) => `Please answer: “${t}”`,
    guardar: "We couldn't save your answers. Please try again in a moment.",
  },
};

export async function responderEncuesta(slug: string, formData: FormData, locale: "es" | "en" = "es"): Promise<ResultadoEncuesta> {
  const e = ERRORES[locale === "en" ? "en" : "es"];
  if (!SLUG.test(slug)) return { ok: false, error: e.noExiste };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: e.sesion };

  const admin = createAdminClient();
  const { data: run } = await admin.from("dry_runs").select("*").eq("slug", slug).maybeSingle();
  if (!run) return { ok: false, error: e.noExiste };
  if (Date.now() < new Date(run.starts_at).getTime()) return { ok: false, error: e.cerrada };

  const leido = leerRespuestas(formData);
  if (!leido.ok) {
    const titulo = bloquesEn(locale).flatMap((b) => b.preguntas).find((p) => p.k === leido.falta)?.titulo ?? leido.falta;
    return { ok: false, error: e.falta(titulo), falta: leido.falta };
  }

  const { data: perfil } = await admin.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle();
  const r = await guardarRespuesta(
    run as DryRun,
    {
      id: user.id,
      email: perfil?.email || user.email,
      nombre: perfil?.full_name || (user.user_metadata?.full_name as string | undefined) || null,
    },
    leido.respuestas,
  );
  return r.ok ? { ok: true } : { ok: false, error: e.guardar };
}
