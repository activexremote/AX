import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { FormPerfil } from "@/components/admin/comercial/form-perfil";
import { exigirComercial } from "@/lib/comercial/acceso";
import { fichas, leadsDeZoho, type FichaLead, type LeadZoho } from "@/lib/comercial/leads";
import { contestadas, perfilado, PREGUNTAS } from "@/lib/comercial/perfilado";
import "../comercial.scss";
import "./leads.scss";

// ══════════════════════════════════════════════════════════
//  Perfilado de leads
//
//  A la izquierda, los leads de Zoho (los más nuevos arriba) con cómo va su
//  ficha; a la derecha, la ficha del que se ha elegido. Lo que se apunta
//  aquí alimenta el análisis (/admin/comercial/analisis).
// ══════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

type Filtro = "todos" | "pendientes" | "perfilados";

const TONO_ZOHO: Record<string, string> = {
  "Pendiente Contactar": "accent",
  Seguimiento: "info",
  "Seguimiento Bueno": "ok",
  "Seguimiento Futuro": "info",
  "Seguimiento Antiguo": "warn",
  "No contesta": "warn",
  Rechazado: "bad",
  "No válido": "bad",
};

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", timeZone: "Europe/Madrid" }) : "—";

function iniciales(nombre: string) {
  const p = nombre.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "?") + (p[1]?.[0] ?? "")).toUpperCase();
}

function estadoFicha(f: FichaLead | undefined) {
  if (!f || !contestadas(f.answers)) return { k: "pendiente", t: "Sin perfilar", tono: "" };
  if (perfilado(f.answers)) return { k: "hecho", t: "Perfilado", tono: "ok" };
  return { k: "medias", t: `A medias · ${contestadas(f.answers)}/${PREGUNTAS.length}`, tono: "warn" };
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ lead?: string; ver?: string }> }) {
  await exigirComercial();
  const [{ lead: elegido, ver }, { leads, error }, todas] = await Promise.all([searchParams, leadsDeZoho(), fichas()]);
  const porId = new Map(todas.map((f) => [f.zoho_id, f]));
  const filtro: Filtro = ver === "pendientes" || ver === "perfilados" ? ver : "todos";

  const hechos = leads.filter((l) => estadoFicha(porId.get(l.id)).k === "hecho").length;
  const pendientes = leads.filter((l) => estadoFicha(porId.get(l.id)).k !== "hecho");
  const visibles = filtro === "pendientes" ? pendientes : filtro === "perfilados" ? leads.filter((l) => !pendientes.includes(l)) : leads;

  const actual: LeadZoho | undefined = leads.find((l) => l.id === elegido);
  const fichaActual = actual ? porId.get(actual.id) : undefined;
  const siguiente = pendientes.find((l) => l.id !== actual?.id)?.id ?? null;
  const href = (q: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ ver: filtro === "todos" ? undefined : filtro, lead: elegido, ...q }).filter(([, v]) => v) as [string, string][]);
    return `/admin/comercial/leads${p.size ? `?${p}` : ""}`;
  };

  return (
    <div className="axr-admin-page axr-admin-page--wide axr-com axr-lp">
      <div className="axr-admin-page__header">
        <div>
          <h1>Perfilado de leads</h1>
          <p>
            Después de hablar con cada lead de Zoho, contesta sus preguntas: qué perfil es, qué buscaba, qué le pareció el precio y cuánto interés
            real tenía. Con eso, el <Link href="/admin/comercial/analisis">análisis</Link> compara tipologías y dice a quién deberían apuntar los anuncios.
          </p>
        </div>
        <div className="axr-lp-progress" aria-label="Progreso del perfilado">
          <strong>
            {hechos}
            <small>/{leads.length}</small>
          </strong>
          <span>perfilados</span>
          <span className="axr-lp-progress__bar" aria-hidden>
            <span style={{ width: `${leads.length ? Math.round((hechos / leads.length) * 100) : 0}%` }} />
          </span>
        </div>
      </div>

      {error ? (
        <section className="axr-admin-card axr-lp-error" role="alert">
          <Icono n="aviso" /> {error} Las fichas ya guardadas siguen contando en el análisis.
        </section>
      ) : null}

      <div className={`axr-lp-layout${actual ? " has-lead" : ""}`}>
        <section className="axr-admin-card axr-lp-list" aria-label="Leads de Zoho">
          <nav className="axr-lp-tabs" aria-label="Filtrar">
            {(
              [
                ["todos", "Todos", leads.length],
                ["pendientes", "Por perfilar", pendientes.length],
                ["perfilados", "Perfilados", hechos],
              ] as const
            ).map(([k, t, n]) => (
              <Link key={k} href={href({ ver: k === "todos" ? undefined : k })} className={filtro === k ? "is-on" : ""} aria-current={filtro === k ? "page" : undefined}>
                {t} <span>{n}</span>
              </Link>
            ))}
          </nav>
          {visibles.length ? (
            <ul>
              {visibles.map((l) => {
                const e = estadoFicha(porId.get(l.id));
                return (
                  <li key={l.id}>
                    <Link href={href({ lead: l.id })} className={l.id === elegido ? "is-on" : ""} aria-current={l.id === elegido ? "true" : undefined}>
                      <span className={`axr-lp-av is-${e.k}`} aria-hidden>
                        {iniciales(l.nombre)}
                      </span>
                      <span className="axr-lp-who">
                        <strong>{l.nombre}</strong>
                        <small>
                          {fecha(l.creado)}
                          {l.ciudad ? ` · ${l.ciudad}` : ""}
                        </small>
                      </span>
                      <span className="axr-lp-tags">
                        <span className={`axr-adm-pill${e.tono ? ` axr-adm-pill--${e.tono}` : ""}`}>{e.t}</span>
                        {l.estado ? <span className={`axr-adm-pill axr-adm-pill--${TONO_ZOHO[l.estado] ?? "info"} is-zoho`}>{l.estado}</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="axr-adm-empty">{filtro === "pendientes" ? "No queda ninguno por perfilar." : "No hay leads en Zoho."}</p>
          )}
        </section>

        <section className="axr-admin-card axr-lp-ficha" aria-label="Ficha del lead">
          {actual ? (
            <>
              <header className="axr-lp-head">
                <Link href={href({ lead: undefined })} className="axr-lp-back">
                  ← Leads
                </Link>
                <span className={`axr-lp-av axr-lp-av--lg is-${estadoFicha(fichaActual).k}`} aria-hidden>
                  {iniciales(actual.nombre)}
                </span>
                <div>
                  <h2>{actual.nombre}</h2>
                  <p>
                    {actual.telefono ? <a href={`tel:${actual.telefono.replace(/\s+/g, "")}`}>{actual.telefono}</a> : null}
                    {actual.email ? <a href={`mailto:${actual.email}`}>{actual.email}</a> : null}
                    {actual.ciudad ? <span>{actual.ciudad}</span> : null}
                    <span>Entró el {fecha(actual.creado)}</span>
                  </p>
                </div>
                {actual.estado ? <span className={`axr-adm-pill axr-adm-pill--${TONO_ZOHO[actual.estado] ?? "info"}`}>Zoho: {actual.estado}</span> : null}
              </header>
              {fichaActual ? (
                <p className="axr-lp-meta">
                  Última edición: {new Date(fichaActual.updated_at).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" })}
                </p>
              ) : null}
              <FormPerfil
                key={actual.id}
                lead={actual}
                inicial={fichaActual?.answers ?? {}}
                notasIniciales={fichaActual?.notes ?? ""}
                siguiente={siguiente}
              />
            </>
          ) : (
            <div className="axr-adm-empty axr-lp-vacio">
              <Icono n="usuarios" size={28} />
              <strong>Elige un lead de la lista</strong>
              <span>
                {pendientes.length
                  ? `Te quedan ${pendientes.length} por perfilar. Empieza por el más reciente.`
                  : "Están todos perfilados. Mira el análisis para ver qué dicen."}
              </span>
              {pendientes[0] ? (
                <Link className="axr-btn" href={href({ lead: pendientes[0].id })}>
                  Perfilar el siguiente →
                </Link>
              ) : (
                <Link className="axr-btn" href="/admin/comercial/analisis">
                  Ver el análisis →
                </Link>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
