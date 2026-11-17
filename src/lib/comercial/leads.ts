import "server-only";

import type { Respuestas } from "@/lib/comercial/perfilado";
import { createAdminClient } from "@/lib/supabase/admin";
import { zohoConfigured, zohoFetch } from "@/lib/zoho/client";

// ══════════════════════════════════════════════════════════
//  Los leads de Zoho con su ficha de perfilado
//
//  Los datos de contacto y el estado se leen de Zoho en cada visita (es la
//  fuente de verdad y el equipo los cambia allí); lo que apunta el equipo
//  comercial vive en `lead_profiles`. Un lead perfilado que ya no está en
//  Zoho (borrado o convertido) sigue contando en el análisis con la copia
//  que se guardó.
// ══════════════════════════════════════════════════════════

export type LeadZoho = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  estado: string | null;
  creado: string | null;
};

export type FichaLead = {
  zoho_id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_status: string | null;
  lead_created_at: string | null;
  answers: Respuestas;
  notes: string | null;
  updated_at: string;
  updated_by: string | null;
};

const CAMPOS = ["First_Name", "Last_Name", "Full_Name", "Email", "Phone", "Mobile", "City", "Lead_Status", "Created_Time"];
const MAX_PAGINAS = 10;

const lista = (v: unknown): string | null => (typeof v === "string" && v && v !== "-None-" ? v : null);

/** Todos los leads de Zoho, los más nuevos primero. `error` si Zoho no contesta. */
export async function leadsDeZoho(): Promise<{ leads: LeadZoho[]; error: string | null }> {
  if (!zohoConfigured()) return { leads: [], error: "Zoho no está conectado (faltan las claves en el servidor)." };
  const filas: Record<string, unknown>[] = [];
  let token: string | null = null;
  for (let i = 0; i < MAX_PAGINAS; i++) {
    const qs = new URLSearchParams({ fields: CAMPOS.join(","), per_page: "200", sort_by: "Created_Time", sort_order: "desc" });
    if (token) qs.set("page_token", token);
    else qs.set("page", String(i + 1));
    const r = await zohoFetch<{ data?: Record<string, unknown>[]; info?: { more_records?: boolean; next_page_token?: string | null } } | null>(
      `/Leads?${qs}`,
    );
    if (!r.ok) return { leads: [], error: `Zoho no ha contestado: ${r.error}` };
    filas.push(...(r.data?.data ?? []));
    if (!r.data?.info?.more_records) break;
    token = r.data.info.next_page_token ?? null;
  }
  return {
    leads: filas.map((f) => ({
      id: String(f.id),
      nombre: lista(f.Full_Name) ?? ([lista(f.First_Name), lista(f.Last_Name)].filter(Boolean).join(" ") || "Sin nombre"),
      email: lista(f.Email),
      telefono: lista(f.Phone) ?? lista(f.Mobile),
      ciudad: lista(f.City),
      estado: lista(f.Lead_Status),
      creado: lista(f.Created_Time),
    })),
    error: null,
  };
}

export async function fichas(): Promise<FichaLead[]> {
  const { data } = await createAdminClient().from("lead_profiles").select("*").order("updated_at", { ascending: false });
  return (data ?? []) as FichaLead[];
}

export async function ficha(zohoId: string): Promise<FichaLead | null> {
  const { data } = await createAdminClient().from("lead_profiles").select("*").eq("zoho_id", zohoId).maybeSingle();
  return (data as FichaLead | null) ?? null;
}
