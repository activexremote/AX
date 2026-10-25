"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteAssignment } from "@/app/admin/tareas/actions";
import { AssignmentForm } from "@/components/admin/assignment-form";
import { BorrarEnDosPasos, Buscador, IconoEditar, Segmentos, iniciales, normal } from "@/components/admin/listas/piezas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { fill } from "@/lib/i18n/publicaciones";

// ══════════════════════════════════════════════════════════
//  La lista de tareas
//
//  El estado que se enseña es el de verdad, no sólo el guardado: una tarea
//  con la fecha pasada sale vencida aunque el cron de Slack aún no la haya
//  marcado, y una con todas las lecciones hechas sale completada.
// ══════════════════════════════════════════════════════════

export type EstadoTarea = "pendiente" | "en_curso" | "pronto" | "vencida" | "completada";

export type FilaTarea = {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  module_id: string;
  module_title: string;
  module_code: string | null;
  done: number;
  total: number;
  due_date: string | null;
  /** Días hasta la fecha límite (negativo: vencida), o null sin fecha. */
  dias: number | null;
  note: string | null;
  created_at: string;
  estado: EstadoTarea;
};

type Opcion = { id: string; label: string; hint?: string };
type Filtro = "todas" | "abiertas" | "pronto" | "vencida" | "completada";

const TONO: Record<EstadoTarea, string> = {
  pendiente: "",
  en_curso: "axr-adm-pill--info",
  pronto: "axr-adm-pill--warn",
  vencida: "axr-adm-pill--bad",
  completada: "axr-adm-pill--ok",
};

const encaja = (f: Filtro, e: EstadoTarea) =>
  f === "todas" ? true : f === "abiertas" ? e === "pendiente" || e === "en_curso" || e === "pronto" : f === e;

export function ListaTareas({
  filas,
  students,
  modules,
  copy,
  locale,
}: {
  filas: FilaTarea[];
  students: Opcion[];
  modules: Opcion[];
  copy: AdminV2BCopy;
  locale: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [alumno, setAlumno] = useState("");
  const [modulo, setModulo] = useState("");
  const [editando, setEditando] = useState<FilaTarea | null>(null);

  const fecha = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(locale, { day: "numeric", month: "short" });

  const cuenta = (f: Filtro) => filas.filter((x) => encaja(f, x.estado)).length;
  const visibles = useMemo(() => {
    const t = normal(q.trim());
    return filas.filter(
      (x) =>
        encaja(filtro, x.estado) &&
        (!alumno || x.student_id === alumno) &&
        (!modulo || x.module_id === modulo) &&
        (!t || normal(`${x.student_name} ${x.student_email} ${x.module_title} ${x.module_code ?? ""}`).includes(t)),
    );
  }, [filas, filtro, alumno, modulo, q]);

  const conFiltros = Boolean(q || alumno || modulo || filtro !== "todas");
  // Sólo los alumnos y módulos que tienen alguna tarea: un desplegable de 27
  // módulos para filtrar entre 3 tareas no ayuda.
  const alumnosConTareas = students.filter((s) => filas.some((f) => f.student_id === s.id));
  const modulosConTareas = modules.filter((m) => filas.some((f) => f.module_id === m.id));

  const venceTexto = (x: FilaTarea) => {
    if (x.dias === null || !x.due_date) return copy.tNoDue;
    if (x.estado === "completada") return fecha(x.due_date);
    if (x.dias < -1) return fill(copy.tDaysLate, -x.dias);
    if (x.dias === -1) return copy.tDayLate;
    if (x.dias === 0) return copy.tDueToday;
    if (x.dias === 1) return copy.tDueTomorrow;
    return fill(copy.tDueIn, fecha(x.due_date));
  };

  if (!filas.length) {
    return (
      <div className="axr-admin-card">
        <div className="axr-adm-empty">
          <Icono n="tareas" size={30} />
          <strong>{copy.tEmptyTitle}</strong>
          <span>{students.length ? copy.tEmptyBody : copy.tNoStudents}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="axr-al axr-al--tareas">
      <div className="axr-al-bar">
        <Segmentos
          label={copy.tFilterState}
          valor={filtro}
          onChange={setFiltro}
          opciones={(["todas", "abiertas", "pronto", "vencida", "completada"] as Filtro[]).map((k) => ({ key: k, label: copy.tStateFilter[k], n: cuenta(k) }))}
        />
      </div>
      <div className="axr-al-bar">
        <Buscador value={q} onChange={setQ} placeholder={copy.tSearchPh} />
        {alumnosConTareas.length > 1 ? (
          <select className="axr-al-select" value={alumno} onChange={(e) => setAlumno(e.target.value)} aria-label={copy.tFilterStudent}>
            <option value="">
              {copy.tFilterStudent}: {copy.allM}
            </option>
            {alumnosConTareas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        ) : null}
        {modulosConTareas.length > 1 ? (
          <select className="axr-al-select" value={modulo} onChange={(e) => setModulo(e.target.value)} aria-label={copy.tFilterModule}>
            <option value="">
              {copy.tFilterModule}: {copy.allM}
            </option>
            {modulosConTareas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        ) : null}
        {conFiltros ? (
          <button
            type="button"
            className="axr-al-clear"
            onClick={() => {
              setQ("");
              setAlumno("");
              setModulo("");
              setFiltro("todas");
            }}
          >
            {copy.clearFilters}
          </button>
        ) : null}
      </div>

      {error ? <div className="axr-al-error">{error}</div> : null}

      <ul className="axr-al-list">
        <li className="axr-al-head" aria-hidden>
          <span>{copy.tStudent}</span>
          <span>{copy.tModule}</span>
          <span>{copy.tColProgress}</span>
          <span>{copy.tDue}</span>
          <span>{copy.tFilterState}</span>
          <span />
        </li>
        {visibles.map((x) => {
          const pct = x.total ? Math.round((x.done / x.total) * 100) : 0;
          return (
            <li key={x.id} className="axr-al-row">
              <div className="axr-al-who">
                <span className="axr-al-avatar axr-al-avatar--alumno" aria-hidden>
                  {iniciales(x.student_name, x.student_email)}
                </span>
                <span>
                  <strong>{x.student_name}</strong>
                  <small>{x.student_email}</small>
                </span>
              </div>
              <div className="axr-al-module">
                <strong title={x.module_title}>{x.module_title}</strong>
                <small className="axr-al-muted">{x.module_code ?? ""}</small>
                {x.note ? (
                  <p className="axr-al-note" title={x.note}>
                    {copy.tNoteLabel}: {x.note}
                  </p>
                ) : null}
              </div>
              <div className={`axr-al-progress${x.estado === "completada" ? " is-done" : ""}`}>
                <span>
                  {x.done}/{x.total} · {pct}%
                </span>
                <i>
                  <b style={{ width: `${pct}%` }} />
                </i>
              </div>
              <div className={`axr-al-due axr-al-due--${x.estado}`}>
                {venceTexto(x)}
                <small>{fill(copy.tAssignedOn, fecha(x.created_at))}</small>
              </div>
              <div>
                <span className={`axr-adm-pill ${TONO[x.estado]}`}>{copy.tState[x.estado]}</span>
              </div>
              <div className="axr-al-actions">
                <button type="button" className="axr-al-icon" aria-label={copy.edit} title={copy.edit} onClick={() => setEditando(x)}>
                  <IconoEditar />
                </button>
                <BorrarEnDosPasos
                  label={copy.delete}
                  confirmar={copy.confirmDelete}
                  cancelar={copy.cancel}
                  disabled={pending}
                  onConfirm={() =>
                    start(async () => {
                      setError(null);
                      const r = await deleteAssignment(x.id);
                      if (r?.error) setError(r.error);
                      router.refresh();
                    })
                  }
                />
              </div>
            </li>
          );
        })}
        {!visibles.length ? (
          <li>
            <div className="axr-adm-empty">
              <span>{copy.noMatches}</span>
            </div>
          </li>
        ) : null}
      </ul>

      {editando ? (
        <AssignmentForm
          key={editando.id}
          students={students}
          modules={modules}
          copy={copy}
          editar={{ id: editando.id, student: editando.student_name, module: editando.module_title, due_date: editando.due_date, note: editando.note }}
          onClose={() => setEditando(null)}
        />
      ) : null}
    </div>
  );
}
