import { NextResponse, type NextRequest } from "next/server";

import { assertSuperAdmin } from "@/lib/lens/auth";
import { createClient } from "@/lib/supabase/server";
import { buildScenarioPdf } from "@/lib/lens/pdf";
import { normalizeScenario } from "@/lib/lens/calculadora";

// El PDF se arma en el servidor y no en el navegador por una razón que no es
// de comodidad: la contraseña. Cifrar de verdad un PDF (AES-256) necesita
// escribirlo entero, y hacerlo en cliente significaría mandar la librería de
// cifrado a todo el mundo para que la use una persona.
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    await assertSuperAdmin();
  } catch {
    // Una ruta que devuelve un documento con la cuenta de resultados dentro
    // se defiende sola, aunque el proxy ya cierre /lens por delante.
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { name?: string; data?: unknown; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = String(body.name ?? "").trim() || "Escenario sin nombre";
  const scenario = normalizeScenario(body.data as Parameters<typeof normalizeScenario>[0]);

  const pdf = await buildScenarioPdf({
    scenarioName: name,
    data: scenario,
    password: typeof body.password === "string" ? body.password : undefined,
    author: user?.email ?? "ActiveXRemote",
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      // El nombre del archivo lo pone el cliente al descargar; aquí se manda
      // igualmente por si alguien abre la respuesta directamente.
      "content-disposition": `attachment; filename="${asciiFilename(name)}.pdf"`,
      // Un escenario con sueldos y dividendos dentro no se cachea en ningún
      // sitio intermedio.
      "cache-control": "no-store",
    },
  });
}

/** Nombre de archivo seguro: sin acentos, sin comillas y sin rutas. */
function asciiFilename(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ._-]/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "escenario"
  );
}
