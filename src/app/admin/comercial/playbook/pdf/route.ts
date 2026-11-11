import { readFile } from "node:fs/promises";
import path from "node:path";

import { puedeVender } from "@/lib/comercial/acceso";
import { getCurrentProfile } from "@/lib/data/profile";

// El PDF del playbook (lo genera scripts/playbook-comercial.mts). Vive fuera
// de public/ a propósito: es material interno, sólo para quien vende.
// next.config.ts lo añade a la función con outputFileTracingIncludes.
export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return new Response("Unauthorized", { status: 401 });
  if (!puedeVender(profile.role)) return new Response("Forbidden", { status: 403 });

  const pdf = await readFile(path.join(process.cwd(), "private/comercial/playbook-comercial.pdf"));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ActiveXRemote-Playbook-Comercial.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
