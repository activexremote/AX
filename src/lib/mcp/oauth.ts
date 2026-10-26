import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  OAuth 2.1 del conector, lo justo
//
//  Lo que pide la especificación de autorización de MCP: metadatos en
//  /.well-known, registro dinámico de clientes, código de autorización con
//  PKCE (S256) y tokens de acceso y de refresco. Los tokens y los códigos
//  sólo se guardan como hash: con la base de datos en la mano no se puede
//  entrar.
//
//  Lo que va de un paso a otro sin base de datos (la solicitud pendiente de
//  autorizar, el enlace de descarga) va firmado con una clave del servidor.
// ══════════════════════════════════════════════════════════

export const ACCESO_SEG = 60 * 60; // 1 h
export const REFRESCO_SEG = 60 * 60 * 24 * 60; // 60 días
export const CODIGO_SEG = 10 * 60;

export const aleatorio = (bytes = 32) => randomBytes(bytes).toString("base64url");
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");

/** La clave de las firmas: MCP_SECRET o, si no está, una derivada de la del servidor. */
function clave(): string {
  const base = process.env.MCP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error("Falta MCP_SECRET.");
  return createHash("sha256").update(`axr-mcp:${base}`).digest("hex");
}

/** Un objeto firmado y con caducidad, en una cadena que cabe en una URL. */
export function firmar(datos: Record<string, unknown>, segundos: number): string {
  const cuerpo = Buffer.from(JSON.stringify({ ...datos, exp: Math.floor(Date.now() / 1000) + segundos })).toString("base64url");
  const firma = createHmac("sha256", clave()).update(cuerpo).digest("base64url");
  return `${cuerpo}.${firma}`;
}

export function leerFirmado<T extends Record<string, unknown>>(token: string): T | null {
  const [cuerpo, firma] = token.split(".");
  if (!cuerpo || !firma) return null;
  const esperada = createHmac("sha256", clave()).update(cuerpo).digest("base64url");
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const datos = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf8")) as T & { exp?: number };
    if (!datos.exp || datos.exp < Date.now() / 1000) return null;
    return datos;
  } catch {
    return null;
  }
}

/** PKCE S256: el verificador, en hash, tiene que ser el desafío del principio. */
export function pkceValido(verificador: string, desafio: string): boolean {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verificador)) return false;
  const calculado = createHash("sha256").update(verificador).digest("base64url");
  const a = Buffer.from(calculado);
  const b = Buffer.from(desafio);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Direcciones a las que se puede volver: https, o la máquina local (Claude Code, Desktop). */
export function redireccionValida(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (u.hash) return false;
    if (u.protocol === "https:") return true;
    return u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]");
  } catch {
    return false;
  }
}

export async function emitirTokens(clientId: string, userId: string) {
  const access = `axr_at_${aleatorio()}`;
  const refresh = `axr_rt_${aleatorio()}`;
  const ahora = Date.now();
  const { error } = await createAdminClient()
    .from("mcp_tokens")
    .insert({
      client_id: clientId,
      user_id: userId,
      access_hash: hash(access),
      refresh_hash: hash(refresh),
      access_expires_at: new Date(ahora + ACCESO_SEG * 1000).toISOString(),
      refresh_expires_at: new Date(ahora + REFRESCO_SEG * 1000).toISOString(),
    });
  if (error) throw new Error(error.message);
  return { access_token: access, token_type: "Bearer", expires_in: ACCESO_SEG, refresh_token: refresh };
}

/** Quién hay detrás de un token de acceso, si sigue valiendo y es administrador. */
export async function usuarioDelToken(token: string): Promise<{ userId: string; clientId: string } | null> {
  if (!token.startsWith("axr_at_")) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("mcp_tokens")
    .select("id, user_id, client_id, access_expires_at, revoked_at, last_used_at")
    .eq("access_hash", hash(token))
    .maybeSingle();
  if (!data || data.revoked_at || new Date(data.access_expires_at).getTime() < Date.now()) return null;
  const { data: perfil } = await admin.from("profiles").select("role").eq("id", data.user_id).maybeSingle();
  if (perfil?.role !== "administrador") return null;
  // Como mucho una escritura por minuto: es para enseñar «último uso».
  if (!data.last_used_at || Date.now() - new Date(data.last_used_at).getTime() > 60_000) {
    await admin.from("mcp_tokens").update({ last_used_at: new Date().toISOString() }).eq("id", data.id);
  }
  return { userId: data.user_id as string, clientId: data.client_id as string };
}

/** La URL pública desde la que se llama (local, vista previa o producción). */
export function origenDe(req: Request): string {
  const u = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") ?? u.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? u.host;
  return `${proto}://${host}`;
}

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, WWW-Authenticate",
};

export const json = (cuerpo: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS, ...extra } });

/** Error de OAuth con el formato que esperan los clientes. */
export const errorOauth = (error: string, descripcion: string, status = 400) => json({ error, error_description: descripcion }, status);
