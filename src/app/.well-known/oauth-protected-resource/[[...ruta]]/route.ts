import { CORS, json, origenDe } from "@/lib/mcp/oauth";

// Metadatos del recurso protegido (RFC 9728): el conector de /api/mcp y
// quién emite sus tokens. Los clientes lo piden en la raíz y también con la
// ruta del recurso detrás (/.well-known/oauth-protected-resource/api/mcp).

export function GET(req: Request) {
  const origen = origenDe(req);
  return json({
    resource: `${origen}/api/mcp`,
    authorization_servers: [origen],
    bearer_methods_supported: ["header"],
    resource_name: "ActiveXRemote · Banners y publicaciones",
  });
}

export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
