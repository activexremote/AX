import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { formatAmount } from "@/lib/stripe/catalog";
import type { Order } from "@/lib/supabase/types";

// Lista de pedidos. Lo importante de esta pantalla no son los pagos —esos ya
// están cobrados— sino los abandonos: gente con nombre, email y curso concreto
// que se quedó a un paso. Por eso van arriba y en su propio bloque.
export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { t, locale } = await getI18n();

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];
  const recoverable = orders.filter((o) => o.status === "iniciado" || o.status === "expirado");

  const statusLabel = (s: Order["status"]) => t.admin.orderStatus[s] ?? s;
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(locale);
  const buyer = (o: Order) =>
    [o.first_name, o.last_name].filter(Boolean).join(" ") || o.email;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.ordersTitle}</h1>
          <p>{t.admin.ordersSubtitle}</p>
        </div>
      </div>

      {recoverable.length > 0 ? (
        <div className="axr-admin-card axr-admin-card--flag">
          <h2>
            {t.admin.ordersRecoverTitle} · {recoverable.length}
          </h2>
          <p>{t.admin.ordersRecoverBody}</p>
          <ul className="axr-admin-recover">
            {recoverable.map((o) => (
              <li key={o.id}>
                <strong>{buyer(o)}</strong>
                <a href={`mailto:${o.email}`}>{o.email}</a>
                <span>
                  {o.courses.join(" + ")} · {o.offer}
                </span>
                <time dateTime={o.created_at}>{fmtDate(o.created_at)}</time>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="axr-admin-card">
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.admin.colDate}</th>
              <th>{t.admin.colBuyer}</th>
              <th>{t.admin.colCourses}</th>
              <th>{t.admin.colOffer}</th>
              <th>{t.admin.colAmount}</th>
              <th>{t.admin.colOrderStatus}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>
                  {t.admin.ordersNone}
                </td>
              </tr>
            ) : null}
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{fmtDate(o.created_at)}</td>
                <td>
                  {buyer(o)}
                  <br />
                  <small>{o.email}</small>
                </td>
                <td>{o.courses.join(" + ")}</td>
                <td>
                  {o.offer}
                  {o.plan === "plazos" ? ` · ${o.instalments_paid}/3` : ""}
                </td>
                <td>{o.amount_total != null ? formatAmount(o.amount_total, locale) : "—"}</td>
                <td>
                  <span className="axr-admin-pill" data-status={o.status}>
                    {statusLabel(o.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
