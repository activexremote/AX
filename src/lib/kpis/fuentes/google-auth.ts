import { createSign } from "node:crypto";

import { fetchJson } from "@/lib/kpis/util";

// ══════════════════════════════════════════════════════════
//  Tokens de Google sin dependencias
//
//  · Cuenta de servicio (GA4 y la hoja de Google Ads): JWT firmado con RS256.
//  · Refresh token de usuario (API de Google Ads): el intercambio OAuth de siempre.
// ══════════════════════════════════════════════════════════

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const cache = new Map<string, { token: string; expiresAt: number }>();

const b64url = (input: string | Buffer): string => Buffer.from(input).toString("base64url");

type TokenResponse = { access_token?: string; expires_in?: number; error?: string; error_description?: string };

function remember(key: string, r: TokenResponse, label: string): string {
  if (!r.access_token) throw new Error(`${label}: ${r.error_description ?? r.error ?? "sin access_token"}`);
  cache.set(key, { token: r.access_token, expiresAt: Date.now() + (r.expires_in ?? 3600) * 1000 });
  return r.access_token;
}

function cached(key: string): string | null {
  const c = cache.get(key);
  return c && Date.now() < c.expiresAt - 60_000 ? c.token : null;
}

/** La clave privada puede venir con los saltos de línea escapados (\n). */
export async function serviceAccountToken(email: string, privateKey: string, scope: string): Promise<string> {
  const key = `sa:${email}:${scope}`;
  const hit = cached(key);
  if (hit) return hit;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: email, scope, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const signature = b64url(createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey.replace(/\\n/g, "\n")));

  const r = await fetchJson<TokenResponse>(
    TOKEN_URL,
    { method: "POST", body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${header}.${claims}.${signature}` }) },
    "Google OAuth (cuenta de servicio)",
  );
  return remember(key, r, "Google OAuth (cuenta de servicio)");
}

export async function refreshTokenAccess(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const key = `rt:${clientId}`;
  const hit = cached(key);
  if (hit) return hit;

  const r = await fetchJson<TokenResponse>(
    TOKEN_URL,
    { method: "POST", body: new URLSearchParams({ grant_type: "refresh_token", client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken }) },
    "Google OAuth (refresh token)",
  );
  return remember(key, r, "Google OAuth (refresh token)");
}
