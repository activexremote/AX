"use client";

import { useMemo, useState } from "react";

import { KbRowActions } from "@/components/admin/kb-source-editor";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminCCopy } from "@/lib/i18n/admin-v2-c";
import type { KbSource } from "@/lib/supabase/types";

// La lista de FAQs con buscador y filtro. Se filtra en el navegador: son
// decenas, no miles, y así responde al teclear sin ir al servidor.

type Filtro = "todas" | "activas" | "inactivas";

/** Sin tildes ni mayúsculas: «envio» encuentra «envío». */
const plano = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function FaqLista({ faqs, copy, allCourses, empty }: { faqs: KbSource[]; copy: AdminCCopy["asistente"]; allCourses: string; empty: string }) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const visibles = useMemo(() => {
    const t = plano(q.trim());
    return faqs.filter(
      (f) =>
        (filtro === "todas" || (filtro === "activas") === f.active) &&
        (!t || plano(f.title).includes(t) || plano(f.body).includes(t)),
    );
  }, [faqs, q, filtro]);

  const n = { todas: faqs.length, activas: faqs.filter((f) => f.active).length, inactivas: faqs.filter((f) => !f.active).length };

  return (
    <>
      <div className="axr-kb-tools">
        <label className="axr-kb-search">
          <Icono n="buscar" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.searchFaqs} aria-label={copy.searchFaqs} />
        </label>
        <div className="axr-kb-filter" role="group">
          {(
            [
              ["todas", copy.filterAll],
              ["activas", copy.filterActive],
              ["inactivas", copy.filterInactive],
            ] as const
          ).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(k)}>
              {label} <span>{n[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {visibles.length ? (
        <ul className="axr-kb-list">
          {visibles.map((f) => (
            <li key={f.id} className={f.active ? undefined : "is-off"}>
              <div className="axr-kb-list__main">
                <strong>{f.title}</strong>
                <p>{f.body.length > 220 ? `${f.body.slice(0, 220)}…` : f.body}</p>
                <div className="axr-kb-list__meta">
                  <span className={`axr-adm-pill${f.active ? " axr-adm-pill--ok" : ""}`}>{f.active ? copy.active : copy.inactive}</span>
                  <span className="axr-adm-pill">{f.course ?? allCourses}</span>
                </div>
              </div>
              <KbRowActions source={f} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="axr-adm-empty">
          <Icono n="buscar" size={24} />
          <span>{faqs.length ? copy.noMatches : empty}</span>
        </div>
      )}
    </>
  );
}
