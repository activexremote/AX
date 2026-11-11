"use server";

import { revalidatePath } from "next/cache";

import { assertComercial } from "@/lib/comercial/acceso";
import { ESTADOS_LEAD, TEMPERATURAS, TIPOS_CONTACTO, type EstadoLead, type TipoContacto } from "@/lib/comercial/tipos";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Acciones del gestor comercial
//
//  Todas comprueban el rol en el servidor (comercial o administración) y
//  escriben con la service role. Cada cambio de estado y cada contacto queda
//  en lead_events, con quién y cuándo; quien toca un lead sin dueño se lo
//  queda.
// ══════════════════════════════════════════════════════════

type Resultado = { ok: true } | { ok: false; error: string };

const LIMITES = { next_action: 200, objection: 200, notes: 4000 } as const;

export type CambiosLead = {
  status?: string;
  temperature?: string | null;
  next_action?: string | null;
  next_action_at?: string | null;
  objection?: string | null;
  notes?: string | null;
};

function limpiar(cambios: CambiosLead): Record<string, string | null> | string {
  const fila: Record<string, string | null> = {};
  if (cambios.status !== undefined) {
    if (!ESTADOS_LEAD.includes(cambios.status as EstadoLead)) return "Estado desconocido.";
    fila.status = cambios.status;
  }
  if (cambios.temperature !== undefined) {
    if (cambios.temperature !== null && !(TEMPERATURAS as readonly string[]).includes(cambios.temperature)) return "Temperatura desconocida.";
    fila.temperature = cambios.temperature;
  }
  if (cambios.next_action_at !== undefined) {
    const f = cambios.next_action_at?.trim() || null;
    if (f && (!/^\d{4}-\d{2}-\d{2}$/.test(f) || Number.isNaN(Date.parse(f)))) return "La fecha no es válida.";
    fila.next_action_at = f;
  }
  for (const campo of ["next_action", "objection", "notes"] as const) {
    if (cambios[campo] === undefined) continue;
    const v = (cambios[campo] ?? "").replace(/\r\n/g, "\n").trim();
    fila[campo] = v ? v.slice(0, LIMITES[campo]) : null;
  }
  return fila;
}

export async function actualizarLead(leadId: string, cambios: CambiosLead): Promise<Resultado> {
  const yo = await assertComercial();
  const fila = limpiar(cambios);
  if (typeof fila === "string") return { ok: false, error: fila };
  if (!Object.keys(fila).length) return { ok: true };

  const db = createAdminClient();
  const { data: antes } = await db.from("leads").select("status, owner_id").eq("id", leadId).maybeSingle();
  if (!antes) return { ok: false, error: "Ese lead ya no existe." };

  const { error } = await db
    .from("leads")
    .update({ ...fila, ...(antes.owner_id ? {} : { owner_id: yo.id }) })
    .eq("id", leadId);
  if (error) return { ok: false, error: "No se ha podido guardar." };

  if (fila.status && fila.status !== antes.status) {
    await db.from("lead_events").insert({ lead_id: leadId, author_id: yo.id, kind: "estado", from_status: antes.status, to_status: fila.status });
  }
  revalidatePath("/admin/comercial/leads");
  revalidatePath(`/admin/comercial/leads/${leadId}`);
  return { ok: true };
}

/**
 * Apunta una llamada, un mensaje o una nota. El primer contacto con un lead
 * nuevo lo pasa solo a «Contactado».
 */
export async function apuntarContacto(leadId: string, tipo: string, texto: string): Promise<Resultado> {
  const yo = await assertComercial();
  if (!TIPOS_CONTACTO.includes(tipo as TipoContacto)) return { ok: false, error: "Tipo de contacto desconocido." };
  const cuerpo = texto.replace(/\r\n/g, "\n").trim().slice(0, 4000);
  if (!cuerpo) return { ok: false, error: "Escribe qué ha pasado." };

  const db = createAdminClient();
  const { data: antes } = await db.from("leads").select("status, owner_id").eq("id", leadId).maybeSingle();
  if (!antes) return { ok: false, error: "Ese lead ya no existe." };

  const { error } = await db.from("lead_events").insert({ lead_id: leadId, author_id: yo.id, kind: tipo, body: cuerpo });
  if (error) return { ok: false, error: "No se ha podido apuntar." };

  // Una nota no es un contacto: no cambia ni la fecha ni el estado.
  const esContacto = tipo !== "nota";
  const pasaAContactado = esContacto && antes.status === "nuevo";
  await db
    .from("leads")
    .update({
      ...(esContacto ? { last_contact_at: new Date().toISOString() } : {}),
      ...(pasaAContactado ? { status: "contactado" } : {}),
      ...(antes.owner_id ? {} : { owner_id: yo.id }),
    })
    .eq("id", leadId);
  if (pasaAContactado) {
    await db.from("lead_events").insert({ lead_id: leadId, author_id: yo.id, kind: "estado", from_status: "nuevo", to_status: "contactado" });
  }

  revalidatePath("/admin/comercial/leads");
  revalidatePath(`/admin/comercial/leads/${leadId}`);
  return { ok: true };
}
