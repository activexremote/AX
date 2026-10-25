import { InviteUserButton } from "@/components/admin/invite-user";
import { ListaUsuarios, type FilaUsuario } from "@/components/admin/listas/lista-usuarios";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getCurrentProfile } from "@/lib/data/profile";
import { adminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { fill } from "@/lib/i18n/publicaciones";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Usuarios
//
//  Cuántos hay de cada rol, cuántos alumnos siguen sin ningún curso abierto
//  (ven la pantalla de acceso pendiente: suele ser alguien a quien hay que
//  dar acceso a mano) y la lista para cambiar rol y acceso.
// ══════════════════════════════════════════════════════════

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const [{ t, locale }, yo, { data: users }, { data: enrollments }] = await Promise.all([
    getI18n(),
    getCurrentProfile(),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("enrollments").select("user_id, course").eq("active", true),
  ]);
  const copy = adminV2BCopy[locale];

  const accessByUser = new Map<string, string[]>();
  for (const e of enrollments ?? []) {
    accessByUser.set(e.user_id, [...(accessByUser.get(e.user_id) ?? []), e.course]);
  }

  const filas: FilaUsuario[] = ((users ?? []) as Profile[]).map((u) => ({
    id: u.id,
    full_name: u.full_name,
    email: u.email ?? "",
    role: u.role,
    created_at: u.created_at,
    cursos: accessByUser.get(u.id) ?? [],
  }));

  const alumnos = filas.filter((u) => u.role === "alumno");
  const sinAcceso = alumnos.filter((u) => !u.cursos.length).length;
  const equipo = filas.length - alumnos.length;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.uTitle}</h1>
          <p>{copy.uLead}</p>
        </div>
        <div>
          <InviteUserButton copy={copy} />
        </div>
      </div>

      <div className="axr-adm-stats axr-al-stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="usuarios" /> {copy.uRoles.alumno}
          </span>
          <span className="axr-adm-stat__value">{alumnos.length}</span>
          <span className="axr-adm-stat__hint">{fill(copy.uWithAccess, alumnos.length - sinAcceso)}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="aviso" /> {copy.uNoAccess}
          </span>
          <span className="axr-adm-stat__value" style={sinAcceso ? { color: "var(--adm-warn)" } : undefined}>
            {sinAcceso}
          </span>
          <span className="axr-adm-stat__hint">{copy.uNoAccessHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="escudo" /> {copy.uTeam}
          </span>
          <span className="axr-adm-stat__value">{equipo}</span>
          <span className="axr-adm-stat__hint">
            {copy.uTeamHint.replace("{a}", String(filas.filter((u) => u.role === "profesor").length)).replace("{b}", String(filas.filter((u) => u.role === "administrador").length))}
          </span>
        </div>
      </div>

      <ListaUsuarios filas={filas} yo={yo?.id ?? ""} copy={copy} locale={locale} roleLabel={t.admin.colRole} />
    </div>
  );
}
