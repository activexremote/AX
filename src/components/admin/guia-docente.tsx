"use client";

import { useMemo, useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminCCopy } from "@/lib/i18n/admin-v2-c";
import { fill } from "@/lib/i18n/publicaciones";

// ══════════════════════════════════════════════════════════
//  La guía docente, navegable
//
//  Un módulo por tarjeta, cerrada, con lo que lleva dentro contado por tipo.
//  Arriba, un buscador (busca en el nombre del recurso y del módulo) y el
//  filtro por curso. Al buscar, se abren solas las tarjetas que coinciden.
//
//  Los enlaces no vienen firmados: «Abrir» pasa por /admin/guia-profesores/
//  abrir/<id>, que firma ese archivo en el momento.
// ══════════════════════════════════════════════════════════

export type TipoRecurso = "pdf" | "slides" | "doc" | "sheet" | "md" | "image" | "video" | "other";
export type RecursoGuia = { id: string; label: string; section: string; lang: string | null; tipo: TipoRecurso };
export type GrupoGuia = { key: string; title: string; code: string | null; course: string | null; items: RecursoGuia[] };

/** Para buscar sin que importen las tildes ni las mayúsculas («rúbrica» encuentra «Rubrica»). */
const plano = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const ORDEN = ["general", "preclase", "hora-1", "hora-2", "hora-3", "hora-4", "rubricas"];

/** La etiqueta corta del icono de archivo. */
const ABREV: Record<TipoRecurso, string> = { pdf: "PDF", slides: "PPT", doc: "DOC", sheet: "XLS", md: "TXT", image: "IMG", video: "VID", other: "FILE" };

export function GuiaDocente({
  grupos,
  copy,
  secciones,
  cursos,
}: {
  grupos: GrupoGuia[];
  copy: AdminCCopy["guia"];
  secciones: Record<string, string>;
  cursos: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [curso, setCurso] = useState<string | null>(null);
  // null = cada tarjeta decide (cerradas, o abiertas si hay búsqueda).
  const [todas, setTodas] = useState<boolean | null>(null);

  const visibles = useMemo(() => {
    const t = plano(q.trim());
    return grupos
      .filter((g) => !curso || g.course === curso)
      .map((g) => {
        if (!t) return g;
        const enTitulo = plano(`${g.code ?? ""} ${g.title}`).includes(t);
        return { ...g, items: enTitulo ? g.items : g.items.filter((r) => plano(r.label).includes(t)) };
      })
      .filter((g) => g.items.length);
  }, [grupos, q, curso]);

  const cursosPresentes = [...new Set(grupos.map((g) => g.course).filter((c): c is string => Boolean(c)))];
  const buscando = Boolean(q.trim());

  return (
    <>
      <div className="axr-guia-tools">
        <label className="axr-guia-search">
          <Icono n="buscar" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.search} aria-label={copy.search} />
        </label>
        <div className="axr-guia-filter" role="group">
          <button type="button" aria-pressed={curso === null} onClick={() => setCurso(null)}>
            {copy.allCourses}
          </button>
          {cursosPresentes.map((c) => (
            <button key={c} type="button" aria-pressed={curso === c} onClick={() => setCurso(c)}>
              {cursos[c] ?? c}
            </button>
          ))}
        </div>
        <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setTodas(todas ? false : true)}>
          {todas ? copy.collapseAll : copy.expandAll}
        </button>
      </div>

      {visibles.length ? (
        <div className="axr-guia-list">
          {visibles.map((g) => (
            <Grupo key={`${g.key}-${todas}-${buscando}`} g={g} abierto={todas ?? buscando} copy={copy} secciones={secciones} cursos={cursos} />
          ))}
        </div>
      ) : (
        <div className="axr-admin-card">
          <div className="axr-adm-empty">
            <Icono n="buscar" size={26} />
            <span>{copy.noMatches}</span>
          </div>
        </div>
      )}
    </>
  );
}

function Grupo({
  g,
  abierto,
  copy,
  secciones,
  cursos,
}: {
  g: GrupoGuia;
  abierto: boolean;
  copy: AdminCCopy["guia"];
  secciones: Record<string, string>;
  cursos: Record<string, string>;
}) {
  const porTipo = Object.entries(
    g.items.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.tipo]: (acc[r.tipo] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const orden = [...ORDEN, ...[...new Set(g.items.map((r) => r.section))].filter((s) => !ORDEN.includes(s))];

  return (
    <details className="axr-guia-card" open={abierto}>
      <summary>
        <span className="axr-guia-card__chev" aria-hidden>
          <Icono n="flecha" size={14} />
        </span>
        <span className="axr-guia-card__title">
          {g.code ? <span className="axr-guia-card__code">{g.code}</span> : null}
          <strong>{g.title}</strong>
        </span>
        <span className="axr-guia-card__meta">
          {g.course ? <span className="axr-adm-pill axr-adm-pill--accent">{cursos[g.course] ?? g.course}</span> : null}
          {porTipo.map(([t, n]) => (
            <span key={t} className={`axr-guia-type axr-guia-type--${t}`}>
              {copy.types[t]} · {n}
            </span>
          ))}
          <span className="axr-guia-card__count">{fill(copy.resources, g.items.length)}</span>
        </span>
      </summary>

      <div className="axr-guia-card__body">
        {orden
          .filter((s) => g.items.some((r) => r.section === s))
          .map((s) => (
            <div key={s} className="axr-guia-section">
              <h3>{secciones[s] ?? s}</h3>
              <ul>
                {g.items
                  .filter((r) => r.section === s)
                  .map((r) => (
                    <li key={r.id}>
                      <span className={`axr-guia-file axr-guia-file--${r.tipo}`} aria-hidden>
                        {ABREV[r.tipo]}
                      </span>
                      <span className="axr-guia-file__label">{r.label}</span>
                      {r.lang ? <span className="axr-adm-pill">{r.lang.toUpperCase()}</span> : null}
                      <a className="axr-btn axr-btn--ghost axr-btn--small" href={`/admin/guia-profesores/abrir/${r.id}`} target="_blank" rel="noopener noreferrer">
                        <Icono n="descarga" size={14} /> {copy.open}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </details>
  );
}
