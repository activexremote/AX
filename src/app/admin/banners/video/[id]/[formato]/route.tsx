import type { NextRequest } from "next/server";

import { cargarPieza } from "@/lib/banners/cargar";
import { respuestaVideo } from "@/lib/banners/video";

// La pieza en MP4: los textos entrando y la foto acercándose.
//
//   /admin/banners/video/<banner>/<post|vertical|story>
//     ?e=sube|lateral|cae|rapido   cómo entran las partes (por defecto, según la variante)
//     &s=6|10|15                   segundos
//     &lang=alt, &d=<borrador>     como el PNG (render/)
//     &dl=1                        descarga con el nombre de la carpeta del equipo

export const runtime = "nodejs";
// Un vídeo de 15 s en historia son 450 fotogramas de 1080×1920: tarda un rato.
export const maxDuration = 300;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; formato: string }> }) {
  const { id, formato } = await params;
  const sp = req.nextUrl.searchParams;
  const r = await cargarPieza(id, formato, sp);
  if (r instanceof Response) return r;
  return respuestaVideo(r, sp);
}
