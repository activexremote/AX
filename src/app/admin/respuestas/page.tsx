import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { actividad as buscar, calcular } from "@/lib/actividades/catalogo";
import { actividadesDeLeccion, resumenDe, seguimiento, type Seguimiento } from "@/lib/actividades/seguimiento";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { panelRespuestasCopy, type PanelRespuestasCopy } from "@/lib/i18n/panel-respuestas";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Respuestas
//
//  Tres pestañas, por orden de lo que hace un profesor:
//    · Por corregir: las tareas enviadas que esperan su corrección.
//    · Alumnos: cómo va cada uno, y su ficha.
//    · Por actividad: quién ha hecho cada actividad y quién no.
//  Un profesor ve a sus alumnos; la administración, a todos.
// ══════════════════════════════════════════════════════════

type Vista = "corregir" | "alumnos" | "actividades";
type Locale = "es" | "en";
const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };

export default async function RespuestasPage({ searchParams }: { searchParams: Promise<{ vista?: string; act?: string }> }) {
  const [{ vista: pedida, act: clave }, { locale }, s] = await Promise.all([searchParams, getI18n(), seguimiento()]);
  const k = panelRespuestasCopy[locale];
  const c = actividadesCopy[locale];
  const fecha = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }) : k.never;

  const resumenes = s.alumnos.map((a) => ({ a, r: resumenDe(s, a) }));
  const pendientes = resumenes
    .flatMap(({ a, r }) => r.porCorregir.map((x) => ({ a, x, act: buscar(x.activity_key)! })))
    .sort((p, q) => (p.x.submitted_at ?? "").localeCompare(q.x.submitted_at ?? ""));
  const vista: Vista = clave ? "actividades" : pedida === "alumnos" || pedida === "actividades" || pedida === "corregir" ? pedida : pendientes.length ? "corregir" : "alumnos";

  const pestañas: { v: Vista; label: string; n?: number }[] = [
    { v: "corregir", label: k.tabReview, n: pendientes.length },
    { v: "alumnos", label: k.tabStudents, n: s.alumnos.length },
    { v: "actividades", label: k.tabActivities },
  ];

  return (
    <div className="axr-admin-page axr-resp">
      <div className="axr-admin-page__header">
        <div>
          <h1>{k.title}</h1>
          <p>{k.lead}</p>
        </div>
      </div>

      <nav className="axr-resp__tabs" aria-label={k.title}>
        {pestañas.map((p) => (
          <Link key={p.v} href={`/admin/respuestas?vista=${p.v}`} className={vista === p.v ? "is-on" : undefined} aria-current={vista === p.v ? "page" : undefined}>
            {p.label}
            {p.n !== undefined ? <span className={p.v === "corregir" && p.n ? "is-alert" : undefined}>{p.n}</span> : null}
          </Link>
        ))}
      </nav>

      {vista === "corregir" ? (
        pendientes.length ? (
          <div className="axr-admin-card axr-admin-card--flush axr-admin-scroll">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{k.student}</th>
                  <th>{k.task}</th>
                  <th>{k.sentOn}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pendientes.map(({ a, x, act }) => (
                  <tr key={x.id}>
                    <td>
                      <Link href={`/admin/respuestas/alumnos/${a.id}`} className="axr-resp__who">
                        <strong>{a.nombre}</strong>
                        <small>{a.email}</small>
                      </Link>
                    </td>
                    <td>{tx(act.titulo, locale)}</td>
                    <td className="axr-resp__nowrap">{fecha(x.submitted_at)}</td>
                    <td className="axr-resp__end">
                      <Link href={`/admin/respuestas/${x.id}`} className="axr-btn axr-btn--small">
                        {k.correct}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="axr-admin-card">
            <div className="axr-adm-empty">
              <Icono n="ok" size={28} />
              <strong>{k.reviewEmpty}</strong>
              <span>{k.reviewEmptyHint}</span>
            </div>
          </div>
        )
      ) : null}

      {vista === "alumnos" ? (
        resumenes.length ? (
          <div className="axr-admin-card axr-admin-card--flush axr-admin-scroll">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{k.student}</th>
                  <th>{k.activities}</th>
                  <th>{k.material}</th>
                  <th>{k.toReview}</th>
                  <th>{k.lastActivity}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {resumenes.map(({ a, r }) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/admin/respuestas/alumnos/${a.id}`} className="axr-resp__who">
                        <strong>{a.nombre}</strong>
                        <small>{a.email}</small>
                      </Link>
                    </td>
                    <td>
                      <Barra a={r.actividades.a} b={r.actividades.b} />
                    </td>
                    <td>
                      <Barra a={r.material.a} b={r.material.b} />
                    </td>
                    <td>{r.porCorregir.length ? <span className="axr-adm-pill axr-adm-pill--warn">{r.porCorregir.length}</span> : <span className="axr-resp__muted">—</span>}</td>
                    <td className="axr-resp__nowrap">{fecha(a.ultima)}</td>
                    <td className="axr-resp__end">
                      <Link href={`/admin/respuestas/alumnos/${a.id}`} className="axr-btn axr-btn--small axr-btn--ghost">
                        {k.open}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="axr-admin-card">
            <div className="axr-adm-empty">
              <Icono n="usuarios" size={28} />
              <strong>{k.studentsEmpty}</strong>
            </div>
          </div>
        )
      ) : null}

      {vista === "actividades" ? <PorActividad s={s} clave={clave} locale={locale} k={k} c={c} fecha={fecha} /> : null}
    </div>
  );
}

/** Una barra pequeña con «a/b». */
function Barra({ a, b }: { a: number; b: number }) {
  if (!b) return <span className="axr-resp__muted">—</span>;
  const pct = Math.round((a / b) * 100);
  return (
    <span className={`axr-resp__bar${a >= b ? " is-done" : ""}`}>
      <span aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </span>
      <small>
        {a}/{b}
      </small>
    </span>
  );
}

function resultadoCorto(a: Actividad, x: FilaRespuesta) {
  if (x.grade !== null && x.grade !== undefined) return `${String(x.grade).replace(".", ",")}/10`;
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return "—";
  return a.tipo === "diagnostico" ? `${r.pct} %` : `${r.puntos}/${r.max}`;
}

function PorActividad({
  s,
  clave,
  locale,
  k,
  c,
  fecha,
}: {
  s: Seguimiento;
  clave?: string;
  locale: Locale;
  k: PanelRespuestasCopy;
  c: (typeof actividadesCopy)["es"];
  fecha: (iso: string | null) => string;
}) {
  const leccionDe = (a: Actividad) => s.lecciones.find((l) => s.modulos.some((m) => m.id === l.moduleId && m.slug === a.modulo) && l.orden === a.leccion);
  const filasDe = (a: Actividad) => s.alumnos.map((al) => ({ al, x: al.respuestas.get(a.key) })).filter((p) => p.x && p.x.status !== "borrador") as { al: (typeof s.alumnos)[number]; x: FilaRespuesta }[];
  const act = clave ? buscar(clave) : null;

  // La lista de actividades.
  if (!act) {
    return (
      <div className="axr-admin-card axr-admin-card--flush axr-admin-scroll">
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{k.activity}</th>
              <th>{k.lesson}</th>
              <th>{k.sent}</th>
              <th>{k.toReview}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {s.lecciones.flatMap((l) =>
              actividadesDeLeccion(s, l).map((a) => {
                const filas = filasDe(a);
                const pend = a.revisa ? filas.filter((p) => p.x.status === "enviada").length : 0;
                return (
                  <tr key={a.key}>
                    <td>
                      <strong>{tx(a.titulo, locale)}</strong>
                      {a.anonima ? <small className="axr-resp__muted"> · {k.anon}</small> : null}
                    </td>
                    <td className="axr-resp__muted">{l.title}</td>
                    <td>
                      {filas.length}/{s.alumnos.length}
                    </td>
                    <td>{pend ? <span className="axr-adm-pill axr-adm-pill--warn">{pend}</span> : <span className="axr-resp__muted">—</span>}</td>
                    <td className="axr-resp__end">
                      {a.anonima ? null : (
                        <Link href={`/admin/respuestas?act=${a.key}`} className="axr-btn axr-btn--small axr-btn--ghost">
                          {k.see}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // Una actividad: quién la ha enviado y quién no.
  const filas = filasDe(act);
  const l = leccionDe(act);
  const sin = s.alumnos.filter((al) => !al.respuestas.get(act.key) && !(l && al.cerradas.has(l.id)));
  const pcts = filas.map((p) => p.x.result?.pct).filter((n): n is number => typeof n === "number");
  const media = pcts.length ? Math.round(pcts.reduce((t, n) => t + n, 0) / pcts.length) : null;

  return (
    <>
      <p className="axr-resp__back">
        <Link href="/admin/respuestas?vista=actividades">{k.backToActivities}</Link>
      </p>
      <div className="axr-admin-card">
        <h2>{tx(act.titulo, locale)}</h2>
        <p className="axr-resp__muted">
          {l?.title}
          {" · "}
          {k.sent}: {filas.length}/{s.alumnos.length}
          {media !== null ? ` · ${k.average}: ${media} %` : ""}
        </p>
      </div>

      {act.anonima ? (
        <p className="axr-adm-note">{k.anon}</p>
      ) : filas.length ? (
        <div className="axr-admin-card axr-admin-card--flush axr-admin-scroll">
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{k.student}</th>
                <th>{k.status}</th>
                <th>{k.result}</th>
                <th>{k.sentOn}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filas.map(({ al, x }) => (
                <tr key={x.id}>
                  <td>
                    <Link href={`/admin/respuestas/alumnos/${al.id}`} className="axr-resp__who">
                      <strong>{al.nombre}</strong>
                      <small>{al.email}</small>
                    </Link>
                  </td>
                  <td>
                    <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span>
                  </td>
                  <td>{resultadoCorto(act, x)}</td>
                  <td className="axr-resp__nowrap">{fecha(x.submitted_at)}</td>
                  <td className="axr-resp__end">
                    <Link href={`/admin/respuestas/${x.id}`} className={`axr-btn axr-btn--small${act.revisa && x.status === "enviada" ? "" : " axr-btn--ghost"}`}>
                      {act.revisa && x.status === "enviada" ? k.correct : k.see}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="axr-admin-card">
          <div className="axr-adm-empty">
            <strong>{k.none}</strong>
          </div>
        </div>
      )}

      {!act.anonima && sin.length ? (
        <div className="axr-admin-card">
          <h2>
            {k.notStarted} · {sin.length}
          </h2>
          <p className="axr-resp__names">
            {sin.map((al) => (
              <Link key={al.id} href={`/admin/respuestas/alumnos/${al.id}`}>
                {al.nombre}
              </Link>
            ))}
          </p>
        </div>
      ) : null}
    </>
  );
}
