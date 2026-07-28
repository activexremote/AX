import Link from "next/link";

import { listModulesWithCounts } from "@/lib/data/modules";
import { NewModuleButton } from "@/components/admin/new-module-button";
import { getI18n } from "@/lib/i18n/server";

export default async function AdminModulesPage() {
  const [modules, { t }] = await Promise.all([listModulesWithCounts(), getI18n()]);

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.modulesTitle}</h1>
          <p>{t.admin.modulesSubtitle}</p>
        </div>
        <NewModuleButton />
      </div>

      <div className="axr-admin-card">
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.admin.colOrder}</th>
              <th>{t.admin.colCode}</th>
              <th>{t.admin.colTitle}</th>
              <th>{t.admin.colLessons}</th>
              <th>{t.admin.colTime}</th>
              <th>{t.admin.colAvailable}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {modules.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>{t.admin.noModules}</td></tr>
            ) : null}
            {modules.map((m) => (
              <tr key={m.id}>
                <td>{m.order_index}</td>
                <td>{m.code ?? "—"}</td>
                <td>
                  <Link href={`/admin/modulos/${m.id}`}>{m.title}</Link>
                </td>
                <td>{m.lessons_count}</td>
                <td>{m.estimated_minutes ?? "—"} min</td>
                <td>{m.available ? "✓" : "—"}</td>
                <td className="axr-admin-table__actions">
                  <Link className="axr-btn axr-btn--ghost" href={`/admin/modulos/${m.id}`}>
                    {t.admin.edit}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
