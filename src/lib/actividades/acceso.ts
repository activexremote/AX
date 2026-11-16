import "server-only";

import { cache } from "react";

import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  A qué alumnos ve cada uno en el panel
//
//  La administración, a todos. Un profesor, a los que tiene asignados
//  (student_teachers) y a los que él mismo les asignó un módulo
//  (assignments.assigned_by). Nadie más ve respuestas de alumnos.
// ══════════════════════════════════════════════════════════

export type Visibles = { todos: boolean; ids: Set<string>; yo: string | null; admin: boolean };

export const alumnosVisibles = cache(async (): Promise<Visibles> => {
  const perfil = await getCurrentProfile();
  if (!perfil) return { todos: false, ids: new Set(), yo: null, admin: false };
  if (perfil.role === "administrador") return { todos: true, ids: new Set(), yo: perfil.id, admin: true };
  if (perfil.role !== "profesor") return { todos: false, ids: new Set(), yo: perfil.id, admin: false };
  const admin = createAdminClient();
  const [{ data: asignados }, { data: tareas }] = await Promise.all([
    admin.from("student_teachers").select("student_id").eq("teacher_id", perfil.id),
    admin.from("assignments").select("student_id").eq("assigned_by", perfil.id),
  ]);
  return {
    todos: false,
    ids: new Set([...(asignados ?? []), ...(tareas ?? [])].map((r) => r.student_id as string)),
    yo: perfil.id,
    admin: false,
  };
});

export const puedeVer = (v: Visibles, alumnoId: string) => v.todos || v.ids.has(alumnoId);
