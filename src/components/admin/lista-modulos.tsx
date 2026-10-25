"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminACopy } from "@/lib/i18n/admin-v2-a";
import { fill } from "@/lib/i18n/publicaciones";

// ══════════════════════════════════════════════════════════
//  La lista de módulos del panel
//
//  Agrupada por curso, que es lo que decide quién ve cada módulo, con un
//  buscador y un filtro por estado. Cada fila se lee de un vistazo: código,
//  título, si está visible, cuántas lecciones y cuánto dura. Toda la fila
//  lleva al módulo.
// ══════════════════════════════════════════════════════════

export type FilaModulo = {
  id: string;
  slug: string;
  code: string | null;
  title: string;
  course: string;
  available: boolean;
  order_index: number;
  lessons_count: number;
  estimated_minutes: number | null;
};

const ORDEN_CURSOS = ["core", "remote-professional", "remote-founder", "web-abc"];
type Filtro = "todos" | "disponibles" | "ocultos";

const normal = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ListaModulos({ modulos, copy, filtroInicial = "todos" }: { modulos: FilaModulo[]; copy: AdminACopy; filtroInicial?: Filtro }) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>(filtroInicial);

  const grupos = useMemo(() => {
    const busca = normal(q.trim());
    const visibles = modulos.filter(
      (m) =>
        (filtro === "todos" || (filtro === "disponibles" ? m.available : !m.available)) &&
        (!busca || normal(`${m.title} ${m.code ?? ""} ${m.slug}`).includes(busca)),
    );
    const cursos = [...new Set([...ORDEN_CURSOS, ...visibles.map((m) => m.course)])];
    return cursos
      .map((k) => ({ k, items: visibles.filter((m) => m.course === k).sort((a, b) => a.order_index - b.order_index) }))
      .filter((g) => g.items.length);
  }, [modulos, q, filtro]);

  const cuenta = (f: Filtro) => (f === "todos" ? modulos.length : modulos.filter((m) => (f === "disponibles" ? m.available : !m.available)).length);

  return (
    <div className="axr-modlist">
      <div className="axr-modlist__bar">
        <label className="axr-modlist__search">
          <Icono n="buscar" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.modSearch} aria-label={copy.modSearch} />
        </label>
        <div className="axr-modlist__filters" role="group">
          {(
            [
              ["todos", copy.modFilterAll],
              ["disponibles", copy.modFilterOn],
              ["ocultos", copy.modFilterOff],
            ] as const
          ).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(k)}>
              {label} <span>{cuenta(k)}</span>
            </button>
          ))}
        </div>
      </div>

      {grupos.length ? (
        grupos.map((g) => (
          <section key={g.k} className="axr-admin-card axr-admin-card--flush axr-modlist__group">
            <header className="axr-modlist__head">
              <span className={`axr-modlist__dot axr-modlist__dot--${g.k}`} aria-hidden />
              <div>
                <h2>{copy.course[g.k] ?? g.k}</h2>
                <small>{copy.courseHint[g.k] ?? ""}</small>
              </div>
              <span className="axr-adm-pill">{fill(copy.modCount, g.items.length)}</span>
            </header>
            <ul className="axr-modlist__rows">
              {g.items.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/modulos/${m.id}`} className="axr-modlist__row">
                    <span className="axr-modlist__n">{m.order_index}</span>
                    <span className="axr-modlist__main">
                      <strong>{m.title}</strong>
                      <small>{m.code ?? m.slug}</small>
                    </span>
                    <span className="axr-modlist__meta">
                      <span className={`axr-adm-pill axr-adm-pill--${m.available ? "ok" : "warn"}`}>{m.available ? copy.modAvailable : copy.modHidden}</span>
                      <span className="axr-modlist__fact">
                        <Icono n="lista" size={14} /> {fill(copy.modLessons, m.lessons_count)}
                      </span>
                      <span className="axr-modlist__fact">
                        <Icono n="reloj" size={14} /> {fill(copy.modMinutes, m.estimated_minutes ?? 0)}
                      </span>
                    </span>
                    <span className="axr-modlist__go" aria-hidden>
                      <Icono n="flecha" size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <div className="axr-admin-card">
          <div className="axr-adm-empty">
            <Icono n="buscar" size={28} />
            <strong>{modulos.length ? copy.modNone : copy.modEmpty}</strong>
            {modulos.length ? null : <span>{copy.modEmptyHint}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
