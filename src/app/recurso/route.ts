import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { cerrarLeccionSiToca, leccionesCerradas, materialCompleto, urlsDeLeccion } from "@/lib/actividades/avance";
import { getMiDryRun, marcarPaso } from "@/lib/dry-run/datos";
import { ESTUDIO } from "@/lib/dry-run/preparacion";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Abrir un recurso de una lección
//
//  Cada lectura, vídeo o descarga de una lección enlaza aquí. Se apunta que
//  quien está dentro lo ha abierto y se le lleva al destino. Así sabemos si
//  ha mirado el material, y él ve en la lección y en «Mis tareas» lo que le
//  falta.
//
//  Sólo se redirige a direcciones que están en el material de esa lección:
//  esto no es un redirector abierto.
// ══════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get("l") ?? "";
  const url = searchParams.get("u") ?? "";
  const volver = new URL(lessonId ? `/lecciones/${encodeURIComponent(lessonId)}` : "/", request.url);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !lessonId || !url) return NextResponse.redirect(volver);

  // Con el cliente del alumno: si no tiene acceso a la lección, la política
  // de lessons no la devuelve.
  const { data: leccion } = await supabase.from("lessons").select("id, module_id, order_index, content_blocks, content_blocks_en").eq("id", lessonId).maybeSingle();
  if (!leccion || !urlsDeLeccion(leccion).has(url)) return NextResponse.redirect(volver);
  // Lo que aún no está abierto no se puede abrir saltándose la lección.
  if ((await leccionesCerradas()).ids.has(lessonId)) return NextResponse.redirect(volver);

  const admin = createAdminClient();
  const { error } = await admin.from("resource_opens").upsert({ user_id: user.id, lesson_id: lessonId, url }, { onConflict: "user_id,lesson_id,url", ignoreDuplicates: true });

  if (!error) {
    await cerrarLeccionSiToca(user.id, lessonId);
    // En el dry run, el material previo y el estudio son pasos de la lista.
    const dry = await getMiDryRun();
    if (dry && dry.run.module_id === leccion.module_id) {
      const { data: primera } = await admin.from("lessons").select("id").eq("module_id", leccion.module_id).order("order_index").limit(1).maybeSingle();
      if (primera?.id === lessonId) {
        if (url === ESTUDIO) await marcarPaso(user.id, "estudio");
        if (await materialCompleto(user.id, lessonId)) await marcarPaso(user.id, "material");
      }
    }
    revalidatePath(`/lecciones/${lessonId}`);
    revalidatePath("/mis-tareas");
    revalidatePath("/preparacion");
    revalidatePath("/");
  }

  return NextResponse.redirect(new URL(url, request.url));
}
