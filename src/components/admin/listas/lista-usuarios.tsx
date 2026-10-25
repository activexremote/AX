"use client";

import { useMemo, useState } from "react";

import { AccessToggles } from "@/components/admin/access-toggles";
import { Buscador, Segmentos, iniciales, normal } from "@/components/admin/listas/piezas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { RoleSelect } from "@/components/admin/role-select";
import type { AdminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { fill } from "@/lib/i18n/publicaciones";
import type { UserRole } from "@/lib/supabase/types";

// La lista de usuarios: buscar, filtrar por rol y, en cada fila, el rol y
// los cursos abiertos (sólo alumnos: el equipo lo ve todo).

export type FilaUsuario = {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  cursos: string[];
};

type FiltroRol = "todos" | UserRole;

export function ListaUsuarios({
  filas,
  yo,
  copy,
  locale,
  roleLabel,
}: {
  filas: FilaUsuario[];
  yo: string;
  copy: AdminV2BCopy;
  locale: string;
  roleLabel: string;
}) {
  const [q, setQ] = useState("");
  const [rol, setRol] = useState<FiltroRol>("todos");

  const visibles = useMemo(() => {
    const t = normal(q.trim());
    return filas.filter((u) => (rol === "todos" || u.role === rol) && (!t || normal(`${u.full_name ?? ""} ${u.email}`).includes(t)));
  }, [filas, rol, q]);

  const cuenta = (r: FiltroRol) => (r === "todos" ? filas.length : filas.filter((u) => u.role === r).length);
  const fecha = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

  if (!filas.length) {
    return (
      <div className="axr-admin-card">
        <div className="axr-adm-empty">
          <Icono n="usuarios" size={30} />
          <strong>{copy.uEmpty}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="axr-al axr-al--usuarios">
      <div className="axr-al-bar">
        <Buscador value={q} onChange={setQ} placeholder={copy.uSearchPh} />
        <Segmentos
          label={copy.uRole}
          valor={rol}
          onChange={setRol}
          opciones={(["todos", "alumno", "profesor", "administrador"] as FiltroRol[]).map((k) => ({ key: k, label: copy.uRoles[k], n: cuenta(k) }))}
        />
      </div>

      <ul className="axr-al-list">
        <li className="axr-al-head" aria-hidden>
          <span>{copy.uName}</span>
          <span>{copy.uRole}</span>
          <span title={copy.uAccessHint}>{copy.uAccess}</span>
          <span />
        </li>
        {visibles.map((u) => (
          <li key={u.id} className="axr-al-row">
            <div className="axr-al-who">
              <span className={`axr-al-avatar axr-al-avatar--${u.role}`} aria-hidden>
                {iniciales(u.full_name, u.email)}
              </span>
              <span>
                <strong>
                  {u.full_name || u.email.split("@")[0]} {u.id === yo ? <span className="axr-adm-pill axr-adm-pill--accent">{copy.uYou}</span> : null}
                </strong>
                <small>{u.email}</small>
              </span>
            </div>
            <div>
              <span className="axr-al-label">{copy.uRole}</span>
              {/* Uno no se quita a sí mismo el rol de administrador: el servidor
                  también lo impide, pero así ni se ofrece. */}
              <RoleSelect userId={u.id} role={u.role} disabled={u.id === yo} label={`${roleLabel} · ${u.email}`} />
            </div>
            <div>
              <span className="axr-al-label">{copy.uAccess}</span>
              {u.role === "alumno" ? (
                <AccessToggles userId={u.id} active={u.cursos} />
              ) : (
                <span className="axr-al-staff">
                  <Icono n="escudo" size={14} /> {copy.uStaffAccess}
                </span>
              )}
            </div>
            <div className="axr-al-muted axr-al-joined">
              {fill(copy.uJoined, fecha(u.created_at))}
            </div>
          </li>
        ))}
        {!visibles.length ? (
          <li>
            <div className="axr-adm-empty">
              <span>{copy.noMatches}</span>
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
