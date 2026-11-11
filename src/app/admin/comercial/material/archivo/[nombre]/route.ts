import { readFile } from "node:fs/promises";
import path from "node:path";

import { puedeVender } from "@/lib/comercial/acceso";
import { archivoMaterial } from "@/lib/comercial/material";
import { getCurrentProfile } from "@/lib/data/profile";

// Los dosieres y sus portadas (scripts/decks-comerciales.mts). Viven fuera
// de public/: sólo los descarga quien vende. Sólo se sirven los ficheros de
// la lista de lib/comercial/material.ts, nunca una ruta que llegue en la URL.
export async function GET(_req: Request, { params }: { params: Promise<{ nombre: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) return new Response("Unauthorized", { status: 401 });
  if (!puedeVender(profile.role)) return new Response("Forbidden", { status: 403 });

  const { nombre } = await params;
  const archivo = archivoMaterial(nombre);
  if (!archivo) return new Response("Not found", { status: 404 });

  const datos = await readFile(path.join(process.cwd(), "private/comercial", nombre));
  return new Response(new Uint8Array(datos), {
    headers: {
      "Content-Type": archivo.tipo,
      ...(archivo.descarga ? { "Content-Disposition": `attachment; filename="${archivo.descarga}"` } : {}),
      "Cache-Control": "private, max-age=300",
    },
  });
}
