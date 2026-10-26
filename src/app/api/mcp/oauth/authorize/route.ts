import { NextResponse } from "next/server";

import { CODIGO_SEG, firmar, origenDe } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// Primer paso de la autorización. Se comprueba la petición y se manda a la
// pantalla de consentimiento del campus con todo firmado EN LA RUTA: si hace
// falta iniciar sesión antes, el login conserva la ruta (no la consulta).

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const clientId = sp.get("client_id") ?? "";
  const redirectUri = sp.get("redirect_uri") ?? "";
  const state = sp.get("state") ?? "";
  const challenge = sp.get("code_challenge") ?? "";
  const metodo = sp.get("code_challenge_method") ?? "";

  const { data: cliente } = await createAdminClient().from("mcp_clients").select("id, redirect_uris").eq("id", clientId).maybeSingle();
  // Sin cliente o con una dirección que no registró, no se redirige a ningún
  // sitio: sería un redirector abierto.
  if (!cliente || !(cliente.redirect_uris as string[]).includes(redirectUri)) {
    return new Response("Cliente o dirección de vuelta desconocidos.", { status: 400 });
  }
  const volver = (error: string) => {
    const u = new URL(redirectUri);
    u.searchParams.set("error", error);
    if (state) u.searchParams.set("state", state);
    return NextResponse.redirect(u);
  };
  if (sp.get("response_type") !== "code") return volver("unsupported_response_type");
  if (metodo !== "S256" || !/^[A-Za-z0-9\-_]{43,128}$/.test(challenge)) return volver("invalid_request");

  const solicitud = firmar({ c: clientId, r: redirectUri, s: state, p: challenge }, CODIGO_SEG);
  return NextResponse.redirect(`${origenDe(req)}/mcp/autorizar/${solicitud}`);
}
