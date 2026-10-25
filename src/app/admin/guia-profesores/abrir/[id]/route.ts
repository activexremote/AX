import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

// Abre un recurso de la guía docente: firma su enlace en el momento (una
// hora) y redirige a él.
//
// Antes la página firmaba de golpe los ~1.300 enlaces en cada visita, aunque
// sólo se fuera a abrir uno. Así la página pesa una fracción y el enlace que
// se copia es éste, que exige sesión de profesor: reenviarlo a un alumno no
// abre nada. La tabla y el bucket lo vuelven a exigir por RLS.

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "profesor" && profile?.role !== "administrador") {
    return new Response("No autorizado", { status: 403 });
  }
  const { id } = await params;
  const supabase = await createClient();
  const { data: r } = await supabase.from("teacher_resources").select("path").eq("id", id).maybeSingle();
  if (!r?.path) return new Response("No existe", { status: 404 });

  const { data, error } = await supabase.storage.from("teacher-guides").createSignedUrl(r.path as string, 3600);
  if (error || !data?.signedUrl) return new Response("No se ha podido abrir el archivo", { status: 502 });
  return NextResponse.redirect(data.signedUrl, { status: 302, headers: { "Cache-Control": "private, no-store" } });
}
