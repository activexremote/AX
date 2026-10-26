import { CORS, json, origenDe } from "@/lib/mcp/oauth";

// Metadatos del servidor de autorización (RFC 8414) del conector de Claude.

export function GET(req: Request) {
  const origen = origenDe(req);
  return json({
    issuer: origen,
    authorization_endpoint: `${origen}/api/mcp/oauth/authorize`,
    token_endpoint: `${origen}/api/mcp/oauth/token`,
    registration_endpoint: `${origen}/api/mcp/oauth/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: ["banners", "publicaciones"],
  });
}

export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
