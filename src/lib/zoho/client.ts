// ══════════════════════════════════════════════════════════
//  Hablar con Zoho CRM
// ══════════════════════════════════════════════════════════
//
//  Zoho no usa una clave de API: usa OAuth2 con refresh token. El refresh
//  token no caduca (salvo que se revoque a mano) y con él se pide un access
//  token que dura una hora. Eso obliga a cachear: el endpoint de refresco
//  está limitado a unas pocas llamadas cada diez minutos, y sin caché una
//  ráfaga de formularios se lo comería sola.
//
//  ⚠︎ El dominio de la API NO se configura: viene dentro de la respuesta del
//  refresco (`api_domain`). Zoho tiene un centro de datos por región
//  —zohoapis.eu, .com, .in, .com.au…— y usar el que no es devuelve
//  INVALID_TOKEN sin decir por qué. Lo único que sí hay que configurar es el
//  dominio de CUENTAS, porque es a quien se le pide el token y ahí todavía no
//  se sabe la región.

const ACCOUNTS = (process.env.ZOHO_ACCOUNTS_DOMAIN ?? "https://accounts.zoho.eu").replace(/\/+$/, "");

/** v7 es la versión estable de la API de CRM. Las anteriores siguen vivas. */
const API_VERSION = "v7";

type Token = { accessToken: string; apiDomain: string; expiresAt: number };

let cached: Token | null = null;
/** Refresco en curso: si entran tres formularios a la vez, se pide UNA vez. */
let inFlight: Promise<Token> | null = null;

/** Sin las tres variables, la integración está apagada y nadie se entera. */
export function zohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN,
  );
}

async function refresh(): Promise<Token> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${ACCOUNTS}/oauth/v2/token?${params}`, { method: "POST", cache: "no-store" });
  const body = (await res.json()) as {
    access_token?: string;
    api_domain?: string;
    expires_in?: number;
    error?: string;
  };

  if (!res.ok || !body.access_token) {
    throw new Error(`Zoho no dio token: ${body.error ?? res.status}`);
  }

  return {
    accessToken: body.access_token,
    apiDomain: (body.api_domain ?? "https://www.zohoapis.eu").replace(/\/+$/, ""),
    // Un minuto de margen: un token que caduca a mitad de petición devuelve
    // un 401 que parece un problema de permisos y no lo es.
    expiresAt: Date.now() + ((body.expires_in ?? 3600) - 60) * 1000,
  };
}

async function getToken(): Promise<Token> {
  if (cached && cached.expiresAt > Date.now()) return cached;
  if (!inFlight) {
    inFlight = refresh()
      .then((t) => {
        cached = t;
        return t;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export type ZohoResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Una llamada a la API de CRM.
 *
 * Devuelve un resultado en vez de lanzar: esto cuelga de un formulario
 * público y de un webhook de pago, y en los dos sitios un fallo de Zoho tiene
 * que quedarse en un aviso en el log, nunca tumbar lo que estaba pasando.
 */
export async function zohoFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<ZohoResult<T>> {
  if (!zohoConfigured()) return { ok: false, error: "zoho-sin-configurar" };

  try {
    const { accessToken, apiDomain } = await getToken();
    const res = await fetch(`${apiDomain}/crm/${API_VERSION}${path}`, {
      ...init,
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    // 204 sin cuerpo: es lo que devuelve una búsqueda sin resultados.
    if (res.status === 204) return { ok: true, data: null as T };

    const body = (await res.json().catch(() => null)) as T | null;
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${JSON.stringify(body)?.slice(0, 300)}` };
    }
    return { ok: true, data: body as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Un registro de Zoho, tal y como vuelve dentro de `data[]`. */
export type ZohoRecordReply = {
  data?: { code?: string; details?: { id?: string }; message?: string; status?: string }[];
};

/** El id del registro creado o actualizado, si la operación fue bien. */
export function idFromReply(reply: ZohoRecordReply | null): string | null {
  const first = reply?.data?.[0];
  if (!first || first.status !== "success") return null;
  return first.details?.id ?? null;
}

/**
 * El motivo si un registro NO se guardó, aunque la petición haya llegado
 * bien (HTTP 200): los endpoints de escritura de Zoho meten el éxito/fallo
 * de CADA registro dentro del cuerpo, no en el código HTTP. Sin esto, un
 * valor de lista rechazado (código INVALID_DATA) queda invisible en los
 * logs — la llamada "funciona" y el registro nunca se crea.
 */
export function errorFromReply(reply: ZohoRecordReply | null): string | null {
  const first = reply?.data?.[0];
  if (!first || first.status === "success") return null;
  return `${first.code ?? "ERROR"}: ${first.message ?? "sin detalle"}`;
}
