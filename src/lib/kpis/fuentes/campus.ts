import type { OrderRow } from "@/lib/kpis/types";
import { madridDay } from "@/lib/kpis/util";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Las matrículas del campus (pedidos de Stripe en Supabase)
//
//  Es la venta de verdad: lo que se cobra pasa por aquí, no por Zoho. Con la
//  clave de servicio porque el panel se cachea fuera de la petición (sin
//  cookies); la página ya ha comprobado antes que quien mira es admin. No se
//  lee ningún dato personal: sólo estado, plan, oferta e importes.
// ══════════════════════════════════════════════════════════

export const campusMissing = (): string[] => ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"].filter((n) => !process.env[n]);

export async function loadOrders(): Promise<OrderRow[]> {
  const { data, error } = await createAdminClient()
    .from("orders")
    .select("created_at, status, plan, offer, amount_total, instalments_paid")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) throw new Error(error.message);
  return (data ?? []).map((o) => ({
    day: madridDay(o.created_at),
    status: o.status as OrderRow["status"],
    plan: o.plan,
    offer: o.offer,
    amount: o.amount_total ?? 0,
    instalmentsPaid: o.instalments_paid ?? 0,
  }));
}
