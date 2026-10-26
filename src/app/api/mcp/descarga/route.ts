import { FORMATO_IDS, MAX_GALERIA, type FormatoId } from "@/lib/banners/formatos";
import { zipDeVariantes } from "@/lib/banners/zip";
import { leerFirmado } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// El enlace de descarga que da el conector de Claude (banners_descargar):
// firmado, de una hora, para quien lo pidió y mientras siga siendo
// administrador. Sin sesión del navegador: se abre desde la conversación.

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  const d = leerFirmado<{ u: string; i: string[]; f: string[]; a: boolean }>(t);
  if (!d) return new Response("El enlace no vale o ha caducado. Pide otro desde Claude.", { status: 403 });
  const admin = createAdminClient();
  const { data: perfil } = await admin.from("profiles").select("role").eq("id", d.u).maybeSingle();
  if (perfil?.role !== "administrador") return new Response("No autorizado.", { status: 403 });

  const ids = [...new Set(d.i)].filter((x) => /^[0-9a-f-]{36}$/.test(x)).slice(0, MAX_GALERIA);
  const formatos = d.f.filter((f): f is FormatoId => (FORMATO_IDS as string[]).includes(f));
  const r = await zipDeVariantes(admin, ids, { formatos: formatos.length ? formatos : FORMATO_IDS, ambos: d.a });
  if (!r) return new Response("No se encuentran esas variantes.", { status: 404 });
  return new Response(Buffer.from(r.zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="banners-${new Date().toISOString().slice(0, 10)}-${r.n}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
