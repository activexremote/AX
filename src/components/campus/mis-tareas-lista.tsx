"use client";

import Link from "next/link";
import { useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";
import type { CampusV2CCopy } from "@/lib/i18n/campus-v2-c";

// ══════════════════════════════════════════════════════════
//  Las tareas del alumno, en tarjetas
//
//  Cada una dice lo que hay que saber de un vistazo: qué módulo, cuándo
//  vence (en palabras: «Vence mañana», «Venció hace 2 días»), cuánto lleva
//  hecho y el botón para seguir. Arriba, un filtro por estado; por defecto,
//  las abiertas.
// ══════════════════════════════════════════════════════════

export type MiTarea = {
  id: string;
  module_title: string;
  module_slug: string;
  total: number;
  done: number;
  due_date: string | null;
  completed_at: string | null;
  /** Días hasta la fecha límite (negativo: vencida), o null sin fecha. */
  dias: number | null;
  note: string | null;
  estado: "pendiente" | "en_curso" | "pronto" | "vencida" | "completada";
};

type Filtro = "abiertas" | "pronto" | "vencida" | "completada" | "todas";

const TONO: Record<MiTarea["estado"], string> = {
  pendiente: "",
  en_curso: "axr-c-pill--info",
  pronto: "axr-c-pill--warn",
  vencida: "axr-c-pill--bad",
  completada: "axr-c-pill--ok",
};

const encaja = (f: Filtro, e: MiTarea["estado"]) => (f === "todas" ? true : f === "abiertas" ? e !== "completada" : f === e);

export function ListaMisTareas({ tareas, copy, locale }: { tareas: MiTarea[]; copy: CampusV2CCopy; locale: string }) {
  const abiertas = tareas.filter((x) => x.estado !== "completada").length;
  // Sin nada abierto, se enseña lo hecho: una lista vacía con tareas detrás confunde.
  const [filtro, setFiltro] = useState<Filtro>(abiertas ? "abiertas" : "todas");

  if (!tareas.length) {
    return (
      <div className="axr-c-card">
        <div className="axr-c-empty">
          <Icono n="tareas" size={32} />
          <strong>{copy.tEmptyTitle}</strong>
          <span>{copy.tEmptyBody}</span>
          <Link href="/" className="axr-btn">
            {copy.tEmptyCta}
          </Link>
        </div>
      </div>
    );
  }

  const fecha = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(locale, { day: "numeric", month: "long" });
  const plazo = (x: MiTarea) => {
    if (x.estado === "completada") return x.completed_at ? copy.tDoneOn.replace("{n}", fecha(x.completed_at)) : copy.tStatus.completada;
    if (x.dias === null) return copy.tNoDue;
    if (x.dias === 0) return copy.tDueToday;
    if (x.dias === 1) return copy.tDueTomorrow;
    if (x.dias > 1) return copy.tDueIn.replace("{n}", String(x.dias));
    if (x.dias === -1) return copy.tDueAgo1;
    return copy.tDueAgo.replace("{n}", String(-x.dias));
  };

  const opciones: { k: Filtro; label: string }[] = [
    { k: "abiertas", label: copy.tOpen },
    { k: "pronto", label: copy.tSoon },
    { k: "vencida", label: copy.tOverdue },
    { k: "completada", label: copy.tDone },
    { k: "todas", label: copy.tFilterAll },
  ];
  const visibles = tareas.filter((x) => encaja(filtro, x.estado));

  return (
    <>
      <div className="axr-mt__filters" role="tablist">
        {opciones.map((o) => {
          const n = tareas.filter((x) => encaja(o.k, x.estado)).length;
          return (
            <button key={o.k} type="button" role="tab" aria-selected={filtro === o.k} onClick={() => setFiltro(o.k)}>
              {o.label}
              <span>{n}</span>
            </button>
          );
        })}
      </div>

      {visibles.length ? (
        <ul className="axr-mt__list">
          {visibles.map((x) => {
            const pct = x.total ? Math.round((x.done / x.total) * 100) : 0;
            const cta = x.estado === "completada" ? copy.tReview : x.done > 0 ? copy.tContinue : copy.tStart;
            return (
              <li key={x.id} className={`axr-mt__card axr-mt__card--${x.estado}`}>
                <div className="axr-mt__top">
                  <span className={`axr-c-pill ${TONO[x.estado]}`}>{copy.tStatus[x.estado]}</span>
                  <span className={`axr-mt__due axr-mt__due--${x.estado}`} title={x.due_date ? copy.tDueOn.replace("{n}", fecha(x.due_date)) : undefined}>
                    <Icono n="calendario" size={14} /> {plazo(x)}
                  </span>
                </div>
                <h2 className="axr-mt__title">{x.module_title}</h2>
                {x.note ? (
                  <p className="axr-mt__note">
                    <strong>{copy.tFromTeacher}</strong> {x.note}
                  </p>
                ) : null}
                <div className="axr-mt__foot">
                  <div className="axr-mt__progress">
                    <div className={`axr-c-progress${x.estado === "completada" ? " axr-c-progress--ok" : ""}`} aria-hidden>
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <small>
                      {x.done}/{x.total} · {pct}%
                    </small>
                  </div>
                  <Link href={`/modulos/${x.module_slug}`} className={`axr-btn axr-btn--small${x.estado === "completada" ? " axr-btn--ghost" : ""}`}>
                    {cta} <Icono n="flecha" size={14} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="axr-c-card">
          <div className="axr-c-empty">
            <Icono n="ok" size={28} />
            <span>{copy.tNoneHere}</span>
          </div>
        </div>
      )}
    </>
  );
}
