import { piezaDeVariante } from "@/lib/banners/cargar";
import { respuestaVideo } from "@/lib/banners/video";
import { leerFirmado } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// El enlace del vídeo de una variante que da el conector de Claude
// (banners_video): firmado, de una hora, para quien lo pidió y mientras siga
// siendo administrador. Sin sesión del navegador: se abre desde la conversación.

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  const d = leerFirmado<{ u: string; i: string; f: string; e: string; s: number; l: boolean }>(t);
  if (!d) return new Response("El enlace no vale o ha caducado. Pide otro desde Claude.", { status: 403 });
  const admin = createAdminClient();
  const { data: perfil } = await admin.from("profiles").select("role").eq("id", d.u).maybeSingle();
  if (perfil?.role !== "administrador") return new Response("No autorizado.", { status: 403 });

  const sp = new URLSearchParams({ e: d.e, s: String(d.s), dl: "1", ...(d.l ? { lang: "alt" } : {}) });
  const r = await piezaDeVariante(admin, d.i, d.f, sp);
  if (r instanceof Response) return r;
  return respuestaVideo(r, sp);
}
