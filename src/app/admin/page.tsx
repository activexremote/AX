import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";

export default async function AdminHome() {
  const supabase = await createClient();
  const { t } = await getI18n();
  const [{ count: modulesCount }, { count: lessonsCount }, { count: usersCount }, { count: attemptsCount }] = await Promise.all([
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.admin.summaryTitle}</h1>
          <p>{t.admin.summarySubtitle}</p>
        </div>
      </div>

      <div className="axr-progress-kpis">
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.admin.kpiModules}</div>
          <div className="axr-kpi__value">{modulesCount ?? 0}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.admin.kpiLessons}</div>
          <div className="axr-kpi__value">{lessonsCount ?? 0}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.admin.kpiUsers}</div>
          <div className="axr-kpi__value">{usersCount ?? 0}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.admin.kpiAttempts}</div>
          <div className="axr-kpi__value">{attemptsCount ?? 0}</div>
        </div>
      </div>

      <div className="axr-admin-card">
        <h2>{t.admin.quickActions}</h2>
        <ul style={{ margin: 0, paddingLeft: "1rem" }}>
          <li><Link href="/admin/modulos">{t.admin.navModules}</Link></li>
          <li><Link href="/admin/tareas">{t.admin.navTasks}</Link></li>
          <li><Link href="/admin/usuarios">{t.admin.navUsers}</Link></li>
        </ul>
      </div>
    </div>
  );
}
