import { CORS, aleatorio, errorOauth, json, redireccionValida } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// Registro dinámico de clientes (RFC 7591). Claude se registra solo la
// primera vez: registrarse no da acceso a nada, sólo permite pedirlo.

export async function POST(req: Request) {
  let cuerpo: { client_name?: unknown; redirect_uris?: unknown };
  try {
    cuerpo = await req.json();
  } catch {
    return errorOauth("invalid_client_metadata", "El cuerpo no es JSON.");
  }
  const uris = Array.isArray(cuerpo.redirect_uris) ? cuerpo.redirect_uris.map(String).slice(0, 10) : [];
  if (!uris.length || !uris.every(redireccionValida)) {
    return errorOauth("invalid_redirect_uri", "Hace falta al menos una dirección de vuelta https (o local).");
  }
  const id = `axr_${aleatorio(18)}`;
  const nombre = typeof cuerpo.client_name === "string" ? cuerpo.client_name.slice(0, 120) : "Cliente MCP";
  const { error } = await createAdminClient().from("mcp_clients").insert({ id, name: nombre, redirect_uris: uris });
  if (error) return errorOauth("server_error", "No se pudo registrar el cliente.", 500);
  return json(
    {
      client_id: id,
      client_name: nombre,
      redirect_uris: uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      client_id_issued_at: Math.floor(Date.now() / 1000),
    },
    201,
  );
}

export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
