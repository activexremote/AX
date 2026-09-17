// ══════════════════════════════════════════════════════════
//  El formulario web de Zoho (Web-to-Lead), enviado desde el servidor
//
//  La web NO incrusta el snippet de Zoho: el formulario es nuestro
//  (<LeadForm/>) y el lead viaja por la API (crm.ts). Pero el correo de
//  confirmación a quien se apunta está configurado en el FORMULARIO WEB de
//  Zoho, y ese correo sólo sale cuando el lead entra por el formulario, no
//  cuando entra por la API.
//
//  Así que se hacen las dos cosas, en este orden:
//
//   1. Aquí: se manda a Zoho exactamente lo que mandaría su snippet. Crea el
//      lead y dispara la confirmación por correo.
//   2. En crm.ts: el `upsert` por Email encuentra ese mismo lead y le añade
//      lo que el formulario de Zoho no tiene —cursos, campaña, idioma—.
//
//  ⚠︎ Los valores de abajo salen del snippet que genera Zoho y CAMBIAN cada
//  vez que alguien edita el formulario allí. Si Zoho da uno nuevo, se copian
//  aquí `xnQsjsdp`, `xmIwtLD` y los `name` de los campos; lo demás es fijo.
//  No son secretos: cualquier web que incruste el snippet los publica.
// ══════════════════════════════════════════════════════════

const ACTION = "https://crm.zoho.eu/crm/WebToLeadForm";

const HIDDEN = {
  xnQsjsdp: "f395c48c17d6fd45cf6e68e3d143ae97442ce0c779fef4e6730f27c7a05843f8",
  xmIwtLD:
    "504c62fdfeec9f35271ab71a2ecf4aa90913e309bf24088d323eec7853ca40e8d077068e289268c20e3d06e7868eb3e9",
  // "Leads" en base64: el módulo de destino.
  actionType: "TGVhZHM=",
  returnURL: "null",
} as const;

/** Nombre de cada campo en el formulario de Zoho, tal cual lo trae el snippet. */
const FIELDS = {
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  email: "Email",
  city: "Address - City",
} as const;

/** Honeypot del snippet ("honeypot" en base64). Tiene que viajar vacío. */
const HONEYPOT = "aG9uZXlwb3Q";

/** Zoho responde en un par de segundos; más que esto no puede frenar el envío. */
const TIMEOUT_MS = 8000;

export type ZohoWebFormLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
};

/**
 * Envía el lead al formulario web de Zoho. Devuelve si Zoho lo aceptó.
 *
 * Nunca lanza: quien llama ya tiene el lead guardado en Supabase y la API
 * de Zoho detrás como red, así que un fallo aquí sólo cuesta el correo de
 * confirmación y queda en el log.
 */
export async function submitZohoWebForm(lead: ZohoWebFormLead): Promise<boolean> {
  const body = new URLSearchParams({
    ...HIDDEN,
    // Lo rellena el script de Google Ads del snippet. Aquí no se sabe si el
    // identificador de clic es de Google o de otra plataforma, y la campaña ya
    // viaja completa por la API, así que va vacío como en una visita directa.
    zc_gad: "",
    [FIELDS.firstName]: lead.firstName,
    [FIELDS.lastName]: lead.lastName,
    [FIELDS.phone]: lead.phone,
    [FIELDS.email]: lead.email,
    [FIELDS.city]: lead.city,
    [HONEYPOT]: "",
  });

  try {
    const res = await fetch(ACTION, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
      // Zoho contesta con una redirección a su página de «gracias». No hace
      // falta seguirla: que la devuelva ya es la señal de que lo ha aceptado.
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const ok = res.ok || (res.status >= 300 && res.status < 400);
    if (!ok) console.error(`[zoho] el formulario web rechazó el lead ${lead.email}: HTTP ${res.status}`);
    return ok;
  } catch (e) {
    console.error(`[zoho] fallo enviando el formulario web de ${lead.email}: ${(e as Error).message}`);
    return false;
  }
}
