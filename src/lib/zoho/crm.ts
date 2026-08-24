import { idFromReply, zohoConfigured, zohoFetch, type ZohoRecordReply } from "@/lib/zoho/client";

// ══════════════════════════════════════════════════════════
//  Qué se manda a Zoho y en qué módulo
// ══════════════════════════════════════════════════════════
//
//  Quien pide información entra como LEAD. Quien paga deja de ser un lead y
//  pasa a ser un Contacto con su Negocio ganado, que es lo que Zoho llama
//  "convertir". No se crea el contacto por un lado y el lead por otro: eso
//  deja la ficha partida en dos y el histórico de la llamada comercial se
//  pierde justo cuando empieza a valer.
//
//  ⚠︎ Dos campos de Zoho tienen nombre traducible y son el fallo típico de
//  esta integración:
//
//   · `Company` es OBLIGATORIO en el módulo Leads, aunque el negocio sea B2C.
//     Va el nombre de la persona, que es lo que hace todo el mundo en
//     formación, y así la lista de leads se lee.
//   · La etapa del negocio ("Closed Won") depende del IDIOMA de la
//     organización: en una cuenta en español es "Cierre ganado". Por eso es
//     una variable de entorno y no una constante; `npm run zoho:probe` lista
//     las etapas que existen de verdad en tu cuenta.

const DEAL_STAGE = process.env.ZOHO_DEAL_STAGE ?? "Closed Won";
const LEAD_SOURCE = process.env.ZOHO_LEAD_SOURCE ?? "Web";

export type ZohoLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  /** Etiquetas legibles de los cursos que le interesan. */
  courses: string[];
  locale?: string;
};

/**
 * Crea o actualiza el lead, buscando por email.
 *
 * `upsert` con `duplicate_check_fields: Email` es lo que evita que la misma
 * persona pidiendo información dos veces salga dos veces en el CRM. Devuelve
 * el id para poder guardarlo junto al lead nuestro y saber que están
 * emparejados.
 */
export async function upsertZohoLead(lead: ZohoLeadInput): Promise<string | null> {
  if (!zohoConfigured()) return null;

  const cursos = lead.courses.length ? lead.courses.join(" + ") : "sin especificar";
  const reply = await zohoFetch<ZohoRecordReply>("/Leads/upsert", {
    method: "POST",
    body: JSON.stringify({
      data: [
        {
          Last_Name: lead.lastName || lead.firstName || lead.email,
          First_Name: lead.firstName || undefined,
          Company: `${lead.firstName} ${lead.lastName}`.trim() || lead.email,
          Email: lead.email,
          Phone: lead.phone || undefined,
          City: lead.city || undefined,
          Lead_Source: LEAD_SOURCE,
          Description: [
            `Curso(s) de interés: ${cursos}`,
            lead.locale ? `Idioma de la web: ${lead.locale}` : null,
            "Origen: formulario de la web de ActiveXRemote",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      duplicate_check_fields: ["Email"],
    }),
  });

  if (!reply.ok) {
    console.error(`[zoho] no se pudo guardar el lead ${lead.email}: ${reply.error}`);
    return null;
  }
  return idFromReply(reply.data);
}

export type ZohoEnrolmentInput = {
  firstName: string;
  lastName: string;
  email: string;
  /**
   * Id del lead en Zoho, si lo tenemos guardado del formulario.
   *
   * Vale más que buscar por email: el buscador de Zoho va contra un índice
   * que tarda en ponerse al día, así que un lead creado hace un minuto NO
   * aparece todavía. Quien rellena el formulario y paga a continuación
   * acabaría con ficha de lead y ficha de contacto sin relación entre ellas.
   */
  zohoLeadId?: string | null;
  /** Etiquetas legibles de los cursos comprados. */
  courses: string[];
  /** Nombre de la oferta contratada, para el título del negocio. */
  offer: string;
  /** Importe en euros (no céntimos). */
  amount: number;
};

/**
 * La matrícula pagada.
 *
 * Si esa persona ya estaba en Leads, se convierte: Zoho crea el contacto y
 * arrastra el historial. Si no estaba —compró directamente, sin pedir
 * información antes—, se crea el contacto y el negocio a mano.
 */
export async function registerZohoEnrolment(e: ZohoEnrolmentInput): Promise<void> {
  if (!zohoConfigured()) return;

  const nombreNegocio = `${e.firstName} ${e.lastName}`.trim() || e.email;
  const dealName = `${nombreNegocio} — ${e.courses.join(" + ") || "matrícula"}`;
  const hoy = new Date().toISOString().slice(0, 10);

  let lead: { id: string; Converted__s?: boolean } | null = null;

  if (e.zohoLeadId) {
    // Camino bueno: sabemos exactamente cuál es su ficha.
    const directo = await zohoFetch<{ data?: { id: string; Converted__s?: boolean }[] }>(
      `/Leads/${e.zohoLeadId}`,
    );
    lead = directo.ok ? (directo.data?.data?.[0] ?? null) : null;
  }

  if (!lead) {
    // Camino de repuesto: compró sin pasar por el formulario, o el lead es de
    // antes de que guardáramos el id.
    const encontrado = await zohoFetch<{ data?: { id: string; Converted__s?: boolean }[] }>(
      `/Leads/search?criteria=${encodeURIComponent(`(Email:equals:${e.email})`)}`,
    );
    lead = encontrado.ok ? (encontrado.data?.data?.[0] ?? null) : null;
  }

  if (lead?.id && !lead.Converted__s) {
    const convertido = await zohoFetch(`/Leads/${lead.id}/actions/convert`, {
      method: "POST",
      body: JSON.stringify({
        data: [
          {
            overwrite: true,
            notify_lead_owner: false,
            notify_new_entity_owner: false,
            Deals: {
              Deal_Name: dealName,
              Closing_Date: hoy,
              Stage: DEAL_STAGE,
              Amount: e.amount,
              Description: `Oferta: ${e.offer}`,
            },
          },
        ],
      }),
    });

    if (convertido.ok) return;
    // Si la conversión falla —lo típico: la etapa del negocio no se llama así
    // en esta cuenta— se sigue por el camino de abajo, para que el pago quede
    // registrado igualmente en vez de perderse.
    console.error(`[zoho] no se pudo convertir el lead de ${e.email}: ${convertido.error}`);
  }

  const contacto = await zohoFetch<ZohoRecordReply>("/Contacts/upsert", {
    method: "POST",
    body: JSON.stringify({
      data: [
        {
          Last_Name: e.lastName || e.firstName || e.email,
          First_Name: e.firstName || undefined,
          Email: e.email,
          Lead_Source: LEAD_SOURCE,
        },
      ],
      duplicate_check_fields: ["Email"],
    }),
  });

  if (!contacto.ok) {
    console.error(`[zoho] no se pudo guardar el contacto ${e.email}: ${contacto.error}`);
    return;
  }

  const contactId = idFromReply(contacto.data);
  const negocio = await zohoFetch("/Deals", {
    method: "POST",
    body: JSON.stringify({
      data: [
        {
          Deal_Name: dealName,
          Stage: DEAL_STAGE,
          Amount: e.amount,
          Closing_Date: hoy,
          Description: `Oferta: ${e.offer}`,
          ...(contactId ? { Contact_Name: { id: contactId } } : {}),
        },
      ],
    }),
  });

  if (!negocio.ok) {
    console.error(`[zoho] contacto guardado pero el negocio no: ${negocio.error}`);
  }
}
