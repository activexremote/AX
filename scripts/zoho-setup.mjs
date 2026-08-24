// Conectar este proyecto con Zoho CRM.
//
//   node scripts/zoho-setup.mjs <código>   → cambia el código por un refresh token
//   node scripts/zoho-setup.mjs --probe    → comprueba la conexión y enseña el CRM
//
// Por qué hace falta un script: Zoho no da una clave de API y ya está. Da un
// refresh token, y para conseguirlo hay que canjear un "código" que caduca en
// unos minutos. Eso es un paso manual que sólo se hace una vez, y esto es lo
// que lo convierte en un comando.
import fs from "node:fs";

const env = Object.fromEntries(
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const ACCOUNTS = (env.ZOHO_ACCOUNTS_DOMAIN ?? "https://accounts.zoho.eu").replace(/\/+$/, "");
const ID = env.ZOHO_CLIENT_ID;
const SECRET = env.ZOHO_CLIENT_SECRET;

if (!ID || !SECRET) {
  console.error(`
Faltan ZOHO_CLIENT_ID y ZOHO_CLIENT_SECRET en .env.local.

Se sacan de la consola de Zoho:
  1. Entra en ${ACCOUNTS.replace("accounts", "api-console")}
  2. "Add Client" → "Self Client" → Create
  3. Copia Client ID y Client Secret a .env.local
`);
  process.exit(1);
}

const modo = process.argv[2];

// ── Comprobar la conexión ────────────────────────────────
if (modo === "--probe") {
  const token = await accessToken();
  const api = token.api_domain.replace(/\/+$/, "");

  const org = await get(api, "/crm/v7/org", token.access_token);
  console.log(`\nOrganización: ${org?.org?.[0]?.company_name ?? "?"} (${org?.org?.[0]?.primary_email ?? "?"})`);
  console.log(`Centro de datos: ${api}`);

  // Las etapas del negocio dependen del idioma de la cuenta, y acertar con
  // ellas es la mitad de los fallos de esta integración.
  const campos = await get(api, "/crm/v7/settings/fields?module=Deals", token.access_token);
  const etapa = campos?.fields?.find((f) => f.api_name === "Stage");
  const etapas = (etapa?.pick_list_values ?? []).map((v) => v.actual_value ?? v.display_value);
  console.log(`\nEtapas de negocio en tu cuenta:\n  ${etapas.join("\n  ")}`);
  const ganada = etapas.find((e) => /won|ganad/i.test(e));
  console.log(
    ganada
      ? `\n→ Pon esto en .env.local:  ZOHO_DEAL_STAGE=${ganada}`
      : `\n→ Elige la etapa de "ganado" de la lista y ponla en ZOHO_DEAL_STAGE`,
  );

  const orig = await get(api, "/crm/v7/settings/fields?module=Leads", token.access_token);
  const fuente = orig?.fields?.find((f) => f.api_name === "Lead_Source");
  const fuentes = (fuente?.pick_list_values ?? []).map((v) => v.actual_value ?? v.display_value);
  console.log(`\nOrígenes de lead disponibles:\n  ${fuentes.slice(0, 12).join("\n  ")}`);
  console.log(`\n→ ZOHO_LEAD_SOURCE tiene que ser uno de ésos (ahora: ${env.ZOHO_LEAD_SOURCE ?? "Web"})`);
  process.exit(0);
}

// ── Canjear el código por el refresh token ───────────────
const codigo = modo;
if (!codigo) {
  console.error(`
Uso: node scripts/zoho-setup.mjs <código>

Para conseguir el código:
  1. En ${ACCOUNTS.replace("accounts", "api-console")}, abre tu Self Client
  2. Pestaña "Generate Code"
  3. Scope:  ZohoCRM.modules.ALL,ZohoCRM.settings.fields.READ,ZohoCRM.settings.modules.READ,ZohoCRM.org.READ
  4. Duración: 10 minutos · Descripción: la que quieras
  5. Elige el portal y "Create" → copia el código y pégalo aquí

El código caduca en minutos: si tarda, se genera otro y ya está.
`);
  process.exit(1);
}

const params = new URLSearchParams({
  grant_type: "authorization_code",
  client_id: ID,
  client_secret: SECRET,
  code: codigo,
});

const res = await fetch(`${ACCOUNTS}/oauth/v2/token?${params}`, { method: "POST" });
const body = await res.json();

if (!body.refresh_token) {
  console.error(`\nZoho no ha dado refresh token: ${JSON.stringify(body)}`);
  console.error(`
Lo habitual cuando pasa esto:
  · el código ya había caducado (duran minutos) → genera otro
  · el código ya se había canjeado una vez → sólo sirve una
  · el dominio no coincide: si tu cuenta es .com, pon
    ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com en .env.local
`);
  process.exit(1);
}

console.log(`
Listo. Añade esto a .env.local (y a las variables de entorno de Vercel):

ZOHO_REFRESH_TOKEN=${body.refresh_token}

El centro de datos se detecta solo: ${body.api_domain}
Comprueba que todo va con:  npm run zoho:probe
`);

// ── Utilidades ───────────────────────────────────────────
async function accessToken() {
  if (!env.ZOHO_REFRESH_TOKEN) {
    console.error("Falta ZOHO_REFRESH_TOKEN en .env.local. Genera primero el código y cánjealo.");
    process.exit(1);
  }
  const p = new URLSearchParams({
    refresh_token: env.ZOHO_REFRESH_TOKEN,
    client_id: ID,
    client_secret: SECRET,
    grant_type: "refresh_token",
  });
  const r = await fetch(`${ACCOUNTS}/oauth/v2/token?${p}`, { method: "POST" });
  const b = await r.json();
  if (!b.access_token) {
    console.error(`No se pudo refrescar el token: ${JSON.stringify(b)}`);
    process.exit(1);
  }
  return b;
}

async function get(api, path, token) {
  const r = await fetch(`${api}${path}`, { headers: { Authorization: `Zoho-oauthtoken ${token}` } });
  if (r.status === 204) return null;
  return r.json();
}
