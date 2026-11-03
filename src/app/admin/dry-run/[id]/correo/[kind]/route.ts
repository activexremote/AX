import { NextResponse, type NextRequest } from "next/server";

import { vistaPrevia } from "@/lib/dry-run/cola";
import { esTipoCorreo } from "@/lib/dry-run/secuencia";
import { getCurrentProfile } from "@/lib/data/profile";

// GET /admin/dry-run/<id>/correo/<kind>[?texto=1]
// Un correo de la secuencia tal como saldría, a nombre de quien lo mira.

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; kind: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new NextResponse("No autorizado", { status: 403 });
  const { id, kind } = await params;
  if (!esTipoCorreo(kind)) return new NextResponse("Correo desconocido", { status: 404 });

  const correo = await vistaPrevia(id, kind, { full_name: profile.full_name, email: profile.email ?? "" });
  if (!correo) return new NextResponse("No existe la sesión", { status: 404 });

  if (request.nextUrl.searchParams.get("texto")) {
    return new NextResponse(`Asunto: ${correo.asunto}\n\n${correo.texto}`, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  // El asunto encima, como lo vería la bandeja de entrada.
  const html = correo.html.replace(
    /<body([^>]*)>/,
    `<body$1><div style="font-family:Arial,sans-serif;font-size:13px;background:#161616;color:#fff;padding:10px 16px;"><b>Asunto:</b> ${correo.asunto.replace(/</g, "&lt;")} &nbsp;·&nbsp; <span style="opacity:.7">${correo.preheader.replace(/</g, "&lt;")}</span></div>`,
  );
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
