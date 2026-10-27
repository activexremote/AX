import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { cargarPieza, slugArchivo } from "@/lib/banners/cargar";
import { FORMATOS } from "@/lib/banners/formatos";
import { Banner, fuentes } from "@/lib/banners/render";

// La pieza en PNG, a tamaño exacto.
//
//   /admin/banners/render/<banner>/<post|vertical|story>
//     ?lang=alt       los textos en el otro idioma de una campaña bilingüe
//     &d=<borrador>   textos, plantilla y elementos sin guardar
//     &dl=1           descarga con el nombre de la carpeta del equipo

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; formato: string }> }) {
  const { id, formato } = await params;
  const sp = req.nextUrl.searchParams;
  const r = await cargarPieza(id, formato, sp);
  if (r instanceof Response) return r;
  const { w, h, file } = FORMATOS[r.formato];

  const res = new ImageResponse(<Banner {...r.pieza} />, { width: w, height: h, fonts: await fuentes() });

  const headers = new Headers(res.headers);
  // Privado: son borradores de campaña, no se cachean en ningún CDN.
  headers.set("Cache-Control", "private, no-store");
  if (sp.get("dl")) {
    headers.set("Content-Disposition", `attachment; filename="${file}_${slugArchivo(r.campaign.name)}_v${r.banner.position + 1}_${r.pieza.language.toUpperCase()}.png"`);
  }
  return new Response(res.body, { status: res.status, headers });
}
