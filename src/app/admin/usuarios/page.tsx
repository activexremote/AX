import { RoleSelect } from "@/components/admin/role-select";
import { InviteUserButton } from "@/components/admin/invite-user";
import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import type { Profile } from "@/lib/supabase/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { t, locale } = await getI18n();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.usersTitle}</h1>
          <p>{t.admin.usersSubtitle}</p>
        </div>
        <InviteUserButton />
      </div>

      <div className="axr-admin-card">
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.admin.colName}</th>
              <th>{t.admin.colEmail}</th>
              <th>{t.admin.colCreated}</th>
              <th>{t.admin.colRole}</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--axr-text-helper)" }}>{t.admin.noUsers}</td></tr>
            ) : null}
            {(users ?? []).map((u) => {
              const user = u as Profile;
              return (
                <tr key={user.id}>
                  <td>{user.full_name ?? "—"}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString(locale)}</td>
                  <td><RoleSelect userId={user.id} role={user.role} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
