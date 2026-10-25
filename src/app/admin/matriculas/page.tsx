import { ListaMatriculas, type FilaPedido } from "@/components/admin/listas/lista-matriculas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { adminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { fill } from "@/lib/i18n/publicaciones";
import { getI18n } from "@/lib/i18n/server";
import { formatAmount } from "@/lib/stripe/catalog";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Matrículas y pagos
//
//  Lo importante de esta pantalla no son los pagos —esos ya están cobrados—
//  sino los abandonos: gente con nombre, email y curso concreto que se quedó
//  a un paso. Por eso van arriba y en tarjetas con el botón de escribirles.
//
//  Cifras: en un pago a plazos, `amount_total` es lo que se cobra en cada
//  plazo (es el importe de la sesión de Stripe del primero), así que lo
//  cobrado es importe × plazos pagados y lo pendiente, el resto hasta 3.
// ══════════════════════════════════════════════════════════

const PLAZOS = 3;
const COBRADO: Order["status"][] = ["pagado", "en_plazos", "completado"];

function cobrado(o: Order): number {
  if (!o.amount_total || !COBRADO.includes(o.status)) return 0;
  return o.plan === "plazos" ? o.amount_total * Math.max(1, o.instalments_paid) : o.amount_total;
}

function porCobrar(o: Order): number {
  if (!o.amount_total || o.plan !== "plazos" || o.status !== "en_plazos") return 0;
  return o.amount_total * Math.max(0, PLAZOS - o.instalments_paid);
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const [{ t, locale }, { data }] = await Promise.all([getI18n(), supabase.from("orders").select("*").order("created_at", { ascending: false })]);
  const copy = adminV2BCopy[locale];
  const orders = (data ?? []) as Order[];

  const nombre = (o: Order) => [o.first_name, o.last_name].filter(Boolean).join(" ") || o.email?.split("@")[0] || copy.mNoName;
  const fila = (o: Order): FilaPedido => ({
    id: o.id,
    created_at: o.created_at,
    nombre: nombre(o),
    email: o.email,
    cursos: o.courses,
    oferta: o.offer,
    plazos: o.plan === "plazos" ? fill(copy.mInstalments, o.instalments_paid) : null,
    importe: o.amount_total != null ? formatAmount(o.amount_total, locale) : "—",
    status: o.status,
    anonimo: !o.email && !o.first_name && !o.last_name,
  });

  // Para recuperar: abandonos de gente que no ha acabado pagando por otro
  // pedido, y una sola vez por persona (la última vez que lo intentó).
  const pagaron = new Set(orders.filter((o) => COBRADO.includes(o.status) && o.email).map((o) => o.email!.toLowerCase()));
  const vistos = new Set<string>();
  const recuperar = orders.filter((o) => {
    if (o.status !== "iniciado" && o.status !== "expirado") return false;
    const clave = o.email?.toLowerCase();
    if (!clave) return true;
    if (pagaron.has(clave) || vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });

  const totalCobrado = orders.reduce((n, o) => n + cobrado(o), 0);
  const totalPendiente = orders.reduce((n, o) => n + porCobrar(o), 0);
  const nCobrados = orders.filter((o) => COBRADO.includes(o.status)).length;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.mTitle}</h1>
          <p>{copy.mLead}</p>
        </div>
      </div>

      <div className="axr-adm-stats axr-al-stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="euro" /> {copy.mStatCollected}
          </span>
          <span className="axr-adm-stat__value">{formatAmount(totalCobrado, locale)}</span>
          <span className="axr-adm-stat__hint">{fill(copy.mStatCollectedHint, nCobrados)}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="calendario" /> {copy.mStatPending}
          </span>
          <span className="axr-adm-stat__value">{formatAmount(totalPendiente, locale)}</span>
          <span className="axr-adm-stat__hint">{copy.mStatPendingHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="aviso" /> {copy.mStatRecover}
          </span>
          <span className="axr-adm-stat__value" style={recuperar.length ? { color: "var(--adm-warn)" } : undefined}>
            {recuperar.length}
          </span>
          <span className="axr-adm-stat__hint">{copy.mStatRecoverHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="tarjeta" /> {copy.mStatTotal}
          </span>
          <span className="axr-adm-stat__value">{orders.length}</span>
          <span className="axr-adm-stat__hint">{copy.mStatTotalHint}</span>
        </div>
      </div>

      <ListaMatriculas
        pedidos={orders.map(fila)}
        recuperar={recuperar.map(fila)}
        estados={t.admin.orderStatus}
        filtros={copy.mFilter}
        copy={copy}
        locale={locale}
      />
    </div>
  );
}
