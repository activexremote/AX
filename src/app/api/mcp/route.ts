import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { conContextoMcp, type ContextoMcp } from "@/lib/mcp/contexto";
import { registrarHerramientas } from "@/lib/mcp/herramientas";
import { CORS, origenDe, usuarioDelToken } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  El conector de Claude: banners y publicaciones por MCP
//
//  Streamable HTTP sin sesión: cada petición trae su token, se comprueba
//  (administrador, no revocado, no caducado), se monta el servidor con sus
//  herramientas y se responde. Sin token, 401 con la dirección de los
//  metadatos OAuth: así Claude sabe dónde pedir acceso.
// ══════════════════════════════════════════════════════════

export const runtime = "nodejs";
// Crear una campaña con imágenes tarda 1-3 minutos.
export const maxDuration = 300;

const INSTRUCCIONES = `Conector de ActiveXRemote (The Remote Business School) para gestionar los
banners de Meta y las publicaciones de redes (X, LinkedIn, blog) del campus.

- Antes de crear algo, mira lo que hay (banners_campanas, publicaciones_listar).
- Crear campañas y regenerar gasta saldo de OpenAI/DeepSeek: confirma con la
  persona antes de hacerlo si no lo ha pedido explícitamente.
- Para enseñar banners, usa banners_ver_imagen (hasta 6 por llamada).
- Nada se publica en redes desde aquí: las publicaciones se programan y el
  campus las publica a su hora; los banners se aprueban y se descargan para
  subirlos al Administrador de anuncios.
- Las variantes con avisos que bloquean no se pueden aprobar: corrige el texto
  con banners_editar o banners_reescribir.`;

async function manejar(req: Request): Promise<Response> {
  const origen = origenDe(req);
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const quien = token ? await usuarioDelToken(token) : null;
  if (!quien) {
    return new Response(JSON.stringify({ error: "invalid_token", error_description: "Hace falta conectar con una cuenta de administrador." }), {
      status: 401,
      headers: {
        ...CORS,
        "Content-Type": "application/json",
        "WWW-Authenticate": `Bearer resource_metadata="${origen}/.well-known/oauth-protected-resource/api/mcp"`,
      },
    });
  }

  const server = new McpServer({ name: "activexremote", title: "ActiveXRemote · Banners y publicaciones", version: "1.0.0" }, { instructions: INSTRUCCIONES });
  registrarHerramientas(server);
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);

  const ctx: ContextoMcp = { supabase: createAdminClient() as unknown as ContextoMcp["supabase"], userId: quien.userId, origen };
  try {
    const res = await conContextoMcp(ctx, () => transport.handleRequest(req));
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  } finally {
    await server.close().catch(() => {});
  }
}

export const POST = manejar;
export const GET = manejar;
export const DELETE = manejar;
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
