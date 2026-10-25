"use client";

import { useMemo, useState } from "react";

import { Buscador, CopiarEmail, Segmentos, iniciales, normal } from "@/components/admin/listas/piezas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { AdminV2BCopy } from "@/lib/i18n/admin-v2-b";
import { fill } from "@/lib/i18n/publicaciones";
import type { OrderStatus } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Matrículas: a quién llamar y todos los pedidos
// ══════════════════════════════════════════════════════════

export type FilaPedido = {
  id: string;
  created_at: string;
  nombre: string;
  email: string | null;
  cursos: string[];
  oferta: string;
  plazos: string | null;
  importe: string;
  status: OrderStatus;
  /** Sin nombre ni email: el avatar lleva un «?». */
  anonimo: boolean;
};

type FiltroPedido = "todos" | "cobrados" | "abandonados" | "problemas";

const GRUPO: Record<OrderStatus, Exclude<FiltroPedido, "todos">> = {
  pagado: "cobrados",
  en_plazos: "cobrados",
  completado: "cobrados",
  iniciado: "abandonados",
  expirado: "abandonados",
  fallido: "problemas",
  reembolsado: "problemas",
};

const TONO: Record<OrderStatus, string> = {
  pagado: "axr-adm-pill--ok",
  completado: "axr-adm-pill--ok",
  en_plazos: "axr-adm-pill--info",
  iniciado: "axr-adm-pill--warn",
  expirado: "axr-adm-pill--warn",
  fallido: "axr-adm-pill--bad",
  reembolsado: "axr-adm-pill--bad",
};

export function ListaMatriculas({
  pedidos,
  recuperar,
  estados,
  filtros,
  copy,
  locale,
}: {
  pedidos: FilaPedido[];
  recuperar: FilaPedido[];
  estados: Record<string, string>;
  filtros: Record<FiltroPedido, string>;
  copy: AdminV2BCopy;
  locale: string;
}) {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<FiltroPedido>("todos");
  const fecha = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  const curso = (c: string) => copy.mCourse[c] ?? c;

  const visibles = useMemo(() => {
    const t = normal(q.trim());
    return pedidos.filter((p) => (filtro === "todos" || GRUPO[p.status] === filtro) && (!t || normal(`${p.nombre} ${p.email ?? ""}`).includes(t)));
  }, [pedidos, filtro, q]);
  const cuenta = (f: FiltroPedido) => (f === "todos" ? pedidos.length : pedidos.filter((p) => GRUPO[p.status] === f).length);

  const mailto = (p: FilaPedido) =>
    `mailto:${p.email}?subject=${encodeURIComponent(copy.mMailSubject)}&body=${encodeURIComponent(fill(copy.mMailBody, p.nombre.split(" ")[0] || ""))}`;

  return (
    <>
      {recuperar.length ? (
        <section className="axr-al-recover">
          <div className="axr-al-recover__head">
            <Icono n="aviso" />
            <h2>{copy.mRecoverTitle}</h2>
            <span className="axr-adm-pill axr-adm-pill--warn">{recuperar.length}</span>
          </div>
          <p>{copy.mRecoverLead}</p>
          <ul>
            {recuperar.map((p) => (
              <li key={p.id}>
                <div className="axr-al-who">
                  <span className="axr-al-avatar" aria-hidden>
                    {p.anonimo ? "?" : iniciales(p.nombre, p.email)}
                  </span>
                  <span>
                    <strong>{p.nombre}</strong>
                    <small>{p.email ?? copy.mRecoverNoEmail}</small>
                  </span>
                </div>
                <div className="axr-al-chips">
                  {p.cursos.map((c) => (
                    <span key={c} className="axr-adm-pill axr-adm-pill--accent">
                      {curso(c)}
                    </span>
                  ))}
                  <span className="axr-adm-pill">{p.oferta}</span>
                  {p.importe !== "—" ? <span className="axr-adm-pill">{p.importe}</span> : null}
                </div>
                <div className="axr-al-recover__foot">
                  {p.email ? (
                    <>
                      <a className="axr-btn axr-btn--small" href={mailto(p)}>
                        {copy.mWrite}
                      </a>
                      <CopiarEmail email={p.email} label={copy.copy} hecho={copy.copied} />
                    </>
                  ) : null}
                  <time dateTime={p.created_at}>{fecha(p.created_at)}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {!pedidos.length ? (
        <div className="axr-admin-card">
          <div className="axr-adm-empty">
            <Icono n="tarjeta" size={30} />
            <strong>{copy.mEmpty}</strong>
          </div>
        </div>
      ) : (
        <div className="axr-al axr-al--pedidos">
          <div className="axr-al-bar">
            <Buscador value={q} onChange={setQ} placeholder={copy.mSearchPh} />
            <Segmentos
              label={copy.mStates}
              valor={filtro}
              onChange={setFiltro}
              opciones={(["todos", "cobrados", "abandonados", "problemas"] as FiltroPedido[]).map((k) => ({ key: k, label: filtros[k], n: cuenta(k) }))}
            />
          </div>
          <ul className="axr-al-list">
            <li className="axr-al-head" aria-hidden>
              <span>{copy.mColDate}</span>
              <span>{copy.mColBuyer}</span>
              <span>{copy.mColCourses}</span>
              <span>{copy.mColOffer}</span>
              <span>{copy.mColAmount}</span>
              <span>{copy.mColState}</span>
            </li>
            {visibles.map((p) => (
              <li key={p.id} className="axr-al-row">
                <span className="axr-al-muted">{fecha(p.created_at)}</span>
                <div className="axr-al-who">
                  <span className="axr-al-avatar" aria-hidden>
                    {p.anonimo ? "?" : iniciales(p.nombre, p.email)}
                  </span>
                  <span>
                    <strong>{p.nombre}</strong>
                    <small>{p.email ?? "—"}</small>
                  </span>
                </div>
                <div className="axr-al-chips">
                  {p.cursos.map((c) => (
                    <span key={c} className="axr-adm-pill axr-adm-pill--accent">
                      {curso(c)}
                    </span>
                  ))}
                </div>
                <span className="axr-al-muted">
                  {p.oferta}
                  {p.plazos ? ` · ${p.plazos}` : ""}
                </span>
                <span className="axr-al-amount">{p.importe}</span>
                <span>
                  <span className={`axr-adm-pill ${TONO[p.status]}`}>{estados[p.status] ?? p.status}</span>
                </span>
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
      )}
    </>
  );
}
