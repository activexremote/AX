import { CORS, emitirTokens, errorOauth, hash, json, pkceValido } from "@/lib/mcp/oauth";
import { createAdminClient } from "@/lib/supabase/admin";

// Canje del código (con PKCE) y renovación de tokens. El de refresco se usa
// una vez: al renovar se revoca el par anterior y se emite otro.

async function leerCuerpo(req: Request): Promise<Record<string, string>> {
  const tipo = req.headers.get("content-type") ?? "";
  if (tipo.includes("application/json")) {
    const j = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(j).map(([k, v]) => [k, String(v ?? "")]));
  }
  const f = await req.formData().catch(() => null);
  return f ? Object.fromEntries([...f.entries()].map(([k, v]) => [k, String(v)])) : {};
}

export async function POST(req: Request) {
  const b = await leerCuerpo(req);
  const admin = createAdminClient();

  if (b.grant_type === "authorization_code") {
    const { data: codigo } = await admin.from("mcp_codes").select("*").eq("code_hash", hash(b.code ?? "")).maybeSingle();
    // De un solo uso: se borra antes de mirar nada más.
    if (codigo) await admin.from("mcp_codes").delete().eq("code_hash", codigo.code_hash);
    if (!codigo || new Date(codigo.expires_at).getTime() < Date.now()) return errorOauth("invalid_grant", "El código no vale o ha caducado.");
    if (codigo.client_id !== b.client_id || codigo.redirect_uri !== b.redirect_uri) return errorOauth("invalid_grant", "El código no es de este cliente.");
    if (!pkceValido(b.code_verifier ?? "", codigo.code_challenge)) return errorOauth("invalid_grant", "PKCE no coincide.");
    return json(await emitirTokens(codigo.client_id, codigo.user_id));
  }

  if (b.grant_type === "refresh_token") {
    const { data: t } = await admin.from("mcp_tokens").select("*").eq("refresh_hash", hash(b.refresh_token ?? "")).maybeSingle();
    if (!t || t.revoked_at || new Date(t.refresh_expires_at).getTime() < Date.now()) return errorOauth("invalid_grant", "El token de refresco no vale.");
    if (b.client_id && b.client_id !== t.client_id) return errorOauth("invalid_grant", "El token no es de este cliente.");
    await admin.from("mcp_tokens").update({ revoked_at: new Date().toISOString() }).eq("id", t.id);
    return json(await emitirTokens(t.client_id, t.user_id));
  }

  return errorOauth("unsupported_grant_type", "Sólo authorization_code y refresh_token.");
}

export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
