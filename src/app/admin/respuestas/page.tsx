import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { Avatar, Barra, coma, haceCuanto, TONO } from "@/app/admin/respuestas/ui";
import { actividad as buscar, calcular } from "@/lib/actividades/catalogo";
import { actividadesDeLeccion, avanceDe, estadoLeccion, etiquetaCorta, resumenDe, seguimiento, type Seguimiento } from "@/lib/actividades/seguimiento";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { panelRespuestasCopy, type PanelRespuestasCopy } from "@/lib/i18n/panel-respuestas";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Respuestas: el panel del profesor
//
//  Todo en una pantalla, de lo urgente a lo general:
//    1. cuatro cifras (alumnos, por corregir, lecciones completadas, nota);
//    2. la cola de entregas por corregir;
//    3. la matriz alumno × lección, que dice de un vistazo cómo va cada uno;
//    4. las actividades, con cuántos las han enviado.
//  Con ?act=clave, el detalle de una actividad.
//  Un profesor ve a sus alumnos; la administración, a todos.
// ══════════════════════════════════════════════════════════

type Locale = "es" | "en";
const SEMANA = 7 * 24 * 3600 * 1000;

export default async function RespuestasPage({ searchParams }: { searchParams: Promise<{ act?: string }> }) {
  const [{ act: clave }, { locale }, s] = await Promise.all([searchParams, getI18n(), seguimiento()]);
  const k = panelRespuestasCopy[locale];
  const c = actividadesCopy[locale];

  const act = clave ? buscar(clave) : null;
  if (act) return <DetalleActividad s={s} act={act} locale={locale} k={k} c={c} />;

  const filas = s.alumnos.map((a) => ({ a, r: resumenDe(s, a), av: avanceDe(s, a) }));
  const pendientes = filas
    .flatMap(({ a, r }) => r.porCorregir.map((x) => ({ a, x, act: buscar(x.activity_key)! })))
    .sort((p, q) => (p.x.submitted_at ?? "").localeCompare(q.x.submitted_at ?? ""));
  const ahora = Date.now();
  const activos = s.alumnos.filter((a) => a.ultima && ahora - new Date(a.ultima).getTime() < SEMANA).length;
  const hechas = filas.reduce((t, f) => t + f.av.hechas, 0);
  const abiertas = filas.reduce((t, f) => t + f.av.total, 0);
  const notas = s.alumnos.flatMap((a) => [...a.respuestas.values()].map((x) => x.grade)).filter((n): n is number => n !== null && n !== undefined).map(Number);
  const media = notas.length ? Math.round((notas.reduce((t, n) => t + n, 0) / notas.length) * 10) / 10 : null;
  const nombreEstado = { cerrada: k.legendLocked, hecha: k.legendDone, "en-curso": k.legendDoing, "sin-empezar": k.legendTodo };

  return (
    <div className="axr-admin-page axr-resp">
      <div className="axr-admin-page__header">
        <div>
          <h1>{k.title}</h1>
          <p>{k.lead}</p>
        </div>
      </div>

      {/* ── Cuatro cifras ── */}
      <div className="axr-resp-kpis">
        <div className="axr-resp-kpi">
          <span className="axr-resp-kpi__icon">
            <Icono n="usuarios" size={18} />
          </span>
          <div>
            <span className="axr-resp-kpi__label">{k.kStudents}</span>
            <strong>{s.alumnos.length}</strong>
            <small>{k.kActive.replace("{n}", String(activos))}</small>
          </div>
        </div>
        <a href="#por-corregir" className={`axr-resp-kpi ${pendientes.length ? "is-warn" : "is-ok"}`}>
          <span className="axr-resp-kpi__icon">
            <Icono n={pendientes.length ? "revisar" : "ok"} size={18} />
          </span>
          <div>
            <span className="axr-resp-kpi__label">{k.kToReview}</span>
            <strong>{pendientes.length}</strong>
            <small>{pendientes.length ? haceCuanto(pendientes[0].x.submitted_at, k, locale) : k.kAllReviewed}</small>
          </div>
        </a>
        <div className="axr-resp-kpi">
          <span className="axr-resp-kpi__icon">
            <Icono n="libro" size={18} />
          </span>
          <div>
            <span className="axr-resp-kpi__label">{k.kProgress}</span>
            <strong>
              {hechas}
              <em>/{abiertas}</em>
            </strong>
            <small>{k.kOfOpen}</small>
          </div>
        </div>
        <div className="axr-resp-kpi">
          <span className="axr-resp-kpi__icon">
            <Icono n="grafica" size={18} />
          </span>
          <div>
            <span className="axr-resp-kpi__label">{k.kGrade}</span>
            <strong>
              {media !== null ? coma(media) : "—"}
              {media !== null ? <em>/10</em> : null}
            </strong>
            <small>{media !== null ? `${notas.length} ${k.grade.toLowerCase()}` : k.kNoGrades}</small>
          </div>
        </div>
      </div>

      {/* ── Por corregir ── */}
      <section id="por-corregir" className={`axr-resp-card${pendientes.length ? " is-warn" : ""}`}>
        <header className="axr-resp-card__head">
          <h2>
            {k.queueTitle}
            {pendientes.length ? <span className="axr-resp-count is-warn">{pendientes.length}</span> : null}
          </h2>
        </header>
        {pendientes.length ? (
          <ul className="axr-resp-queue">
            {pendientes.map(({ a, x, act }) => (
              <li key={x.id}>
                <Avatar nombre={a.nombre} id={a.id} size="sm" />
                <div>
                  <strong>{tx(act.titulo, locale)}</strong>
                  <span>
                    {a.nombre} · {haceCuanto(x.submitted_at, k, locale)}
                  </span>
                </div>
                <Link href={`/admin/respuestas/${x.id}`} className="axr-btn axr-btn--small">
                  {k.correct}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="axr-resp-allgood">
            <Icono n="ok" size={16} /> {k.queueEmpty}
          </p>
        )}
      </section>

      {/* ── Matriz alumno × lección ── */}
      <section className="axr-resp-card is-flush">
        <header className="axr-resp-card__head">
          <h2>
            {k.matrixTitle}
            <span className="axr-resp-count">{s.alumnos.length}</span>
          </h2>
          <p>{k.matrixHint}</p>
        </header>
        {filas.length ? (
          <>
            <div className="axr-resp-scroll">
              <table className="axr-resp-matrix">
                <thead>
                  <tr>
                    <th className="is-who">{k.student}</th>
                    {s.lecciones.map((l, i) => (
                      <th key={l.id} title={l.title} className="is-cell">
                        {etiquetaCorta(l.title, i, k.prevShort)}
                      </th>
                    ))}
                    <th>{k.progress}</th>
                    <th className="is-num">{k.grade}</th>
                    <th>{k.lastSeen}</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map(({ a, r, av }) => (
                    <tr key={a.id}>
                      <td className="is-who">
                        <Link href={`/admin/respuestas/alumnos/${a.id}`}>
                          <Avatar nombre={a.nombre} id={a.id} size="sm" />
                          <span>
                            <strong>{a.nombre}</strong>
                            <small>{a.email}</small>
                          </span>
                        </Link>
                      </td>
                      {s.lecciones.map((l) => {
                        const e = estadoLeccion(s, l, a);
                        const tip = k.cellTip
                          .replace("{l}", l.title)
                          .replace("{e}", nombreEstado[e.estado])
                          .replace("{m}", `${e.material.abiertos}/${e.material.total}`)
                          .replace("{a}", `${e.actividades.a}/${e.actividades.b}`);
                        return (
                          <td key={l.id} className="is-cell">
                            <Link href={`/admin/respuestas/alumnos/${a.id}#l-${l.id}`} className={`axr-resp-dot is-${e.estado}${e.pendiente ? " has-review" : ""}`} title={tip} aria-label={tip}>
                              {e.estado === "hecha" ? <Icono n="ok" size={13} /> : e.estado === "en-curso" && e.actividades.b ? `${e.actividades.a}/${e.actividades.b}` : null}
                            </Link>
                          </td>
                        );
                      })}
                      <td>
                        <Barra a={av.hechas} b={av.total} ancho={64} />
                      </td>
                      <td className="is-num">{r.media !== null ? coma(r.media) : <span className="axr-resp-muted">—</span>}</td>
                      <td className="axr-resp-muted axr-resp-nowrap">{haceCuanto(a.ultima, k, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="axr-resp-legend">
              <li>
                <span className="axr-resp-dot is-hecha">
                  <Icono n="ok" size={10} />
                </span>
                {k.legendDone}
              </li>
              <li>
                <span className="axr-resp-dot is-en-curso" />
                {k.legendDoing}
              </li>
              <li>
                <span className="axr-resp-dot is-sin-empezar" />
                {k.legendTodo}
              </li>
              <li>
                <span className="axr-resp-dot is-cerrada" />
                {k.legendLocked}
              </li>
              <li>
                <span className="axr-resp-dot is-sin-empezar has-review" />
                {k.legendReview}
              </li>
            </ul>
          </>
        ) : (
          <p className="axr-resp-allgood is-muted">{k.studentsEmpty}</p>
        )}
      </section>

      {/* ── Actividades ── */}
      <section className="axr-resp-card">
        <header className="axr-resp-card__head">
          <h2>{k.activitiesTitle2}</h2>
        </header>
        <div className="axr-resp-acts">
          {s.lecciones.flatMap((l, i) =>
            actividadesDeLeccion(s, l).map((a) => {
              const env = enviadasDe(s, a);
              const pend = a.revisa ? env.filter((p) => p.x.status === "enviada").length : 0;
              const posibles = s.alumnos.filter((al) => !al.cerradas.has(l.id)).length;
              const cuerpo = (
                <>
                  <span className="axr-resp-acts__meta">
                    <span className="axr-resp-tag">{etiquetaCorta(l.title, i, k.prevShort)}</span>
                    {k.tipos[a.tipo]}
                    {a.obligatoria ? null : ` · ${k.optional}`}
                  </span>
                  <strong>{tx(a.titulo, locale)}</strong>
                  <span className="axr-resp-acts__foot">
                    {posibles ? <Barra a={env.length} b={posibles} ancho={90} /> : <span className="axr-resp-muted">{k.legendLocked}</span>}
                    {pend ? <span className="axr-adm-pill axr-adm-pill--warn">{k.pendingN.replace("{n}", String(pend))}</span> : null}
                    {a.anonima ? <span className="axr-resp-muted">{k.anonShort}</span> : null}
                  </span>
                </>
              );
              return a.anonima ? (
                <div key={a.key} className="axr-resp-acts__item is-anon">
                  {cuerpo}
                </div>
              ) : (
                <Link key={a.key} href={`/admin/respuestas?act=${a.key}`} className="axr-resp-acts__item">
                  {cuerpo}
                </Link>
              );
            }),
          )}
        </div>
      </section>
    </div>
  );
}

const enviadasDe = (s: Seguimiento, a: Actividad) =>
  s.alumnos.map((al) => ({ al, x: al.respuestas.get(a.key) })).filter((p) => p.x && p.x.status !== "borrador") as { al: Seguimiento["alumnos"][number]; x: FilaRespuesta }[];

function resultadoCorto(a: Actividad, x: FilaRespuesta) {
  if (x.grade !== null && x.grade !== undefined) return `${coma(Number(x.grade))}/10`;
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return "";
  return a.tipo === "diagnostico" ? `${r.pct} %` : `${r.puntos}/${r.max}`;
}

/** Una actividad: quién la ha enviado, con qué resultado, y quién no. */
function DetalleActividad({ s, act, locale, k, c }: { s: Seguimiento; act: Actividad; locale: Locale; k: PanelRespuestasCopy; c: (typeof actividadesCopy)["es"] }) {
  const l = s.lecciones.find((x) => s.modulos.some((m) => m.id === x.moduleId && m.slug === act.modulo) && x.orden === act.leccion);
  const filas = enviadasDe(s, act);
  const sin = s.alumnos.filter((al) => !al.respuestas.get(act.key) && !(l && al.cerradas.has(l.id)));
  const pcts = filas.map((p) => p.x.result?.pct).filter((n): n is number => typeof n === "number");
  const media = pcts.length ? Math.round(pcts.reduce((t, n) => t + n, 0) / pcts.length) : null;

  return (
    <div className="axr-admin-page axr-resp">
      <p className="axr-resp-back">
        <Link href="/admin/respuestas">← {k.title}</Link>
      </p>
      <div className="axr-admin-page__header">
        <div>
          <h1>{tx(act.titulo, locale)}</h1>
          <p>
            {l?.title} · {k.submittedOf.replace("{a}", String(filas.length)).replace("{b}", String(filas.length + sin.length))}
            {media !== null ? ` · ${k.average}: ${media} %` : ""}
          </p>
        </div>
      </div>

      {act.anonima ? (
        <p className="axr-adm-note">{k.anon}</p>
      ) : (
        <div className="axr-resp-split">
          <section className="axr-resp-card">
            <header className="axr-resp-card__head">
              <h2>
                {k.sent}
                <span className="axr-resp-count">{filas.length}</span>
              </h2>
            </header>
            {filas.length ? (
              <ul className="axr-resp-queue">
                {filas.map(({ al, x }) => (
                  <li key={x.id}>
                    <Avatar nombre={al.nombre} id={al.id} size="sm" />
                    <div>
                      <strong>{al.nombre}</strong>
                      <span>
                        <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span> {resultadoCorto(act, x)} · {haceCuanto(x.submitted_at, k, locale)}
                      </span>
                    </div>
                    <Link href={`/admin/respuestas/${x.id}`} className={`axr-btn axr-btn--small${act.revisa && x.status === "enviada" ? "" : " axr-btn--ghost"}`}>
                      {act.revisa && x.status === "enviada" ? k.correct : k.see}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="axr-resp-allgood is-muted">{k.none}</p>
            )}
          </section>
          <aside className="axr-resp-card">
            <header className="axr-resp-card__head">
              <h2>
                {k.notStarted}
                <span className="axr-resp-count">{sin.length}</span>
              </h2>
            </header>
            {sin.length ? (
              <ul className="axr-resp-people">
                {sin.map((al) => (
                  <li key={al.id}>
                    <Link href={`/admin/respuestas/alumnos/${al.id}`}>
                      <Avatar nombre={al.nombre} id={al.id} size="sm" />
                      {al.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="axr-resp-allgood">
                <Icono n="ok" size={16} /> {k.allSent}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
