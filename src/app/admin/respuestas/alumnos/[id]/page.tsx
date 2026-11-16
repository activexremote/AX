import Link from "next/link";
import { notFound } from "next/navigation";

import { asignarProfesor, quitarProfesor } from "@/app/admin/respuestas/actions";
import { Avatar, Barra, coma, fechaHora, haceCuanto, TONO } from "@/app/admin/respuestas/ui";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { alumnosVisibles, puedeVer } from "@/lib/actividades/acceso";
import { actividad as buscar, calcular } from "@/lib/actividades/catalogo";
import { actividadesDeLeccion, avanceDe, estadoLeccion, etiquetaCorta, extrasFicha, resumenDe, seguimiento } from "@/lib/actividades/seguimiento";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { panelRespuestasCopy } from "@/lib/i18n/panel-respuestas";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  La ficha del alumno
//
//  Arriba, quién es, quién le corrige y cuatro cifras. Debajo, dos
//  columnas: a la izquierda su recorrido lección a lección, todo a la
//  vista (material abierto y actividades con su resultado); a la derecha,
//  lo que tiene por corregir, sus preguntas al asistente y lo último que
//  ha hecho.
// ══════════════════════════════════════════════════════════

const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const VISIBLES = 6;

function resultado(a: Actividad, x: FilaRespuesta) {
  if (x.grade !== null && x.grade !== undefined) return `${coma(Number(x.grade))}/10`;
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return null;
  return a.tipo === "diagnostico" ? `${r.pct} %` : `${r.puntos}/${r.max}`;
}

export default async function FichaAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }, visibles] = await Promise.all([params, getI18n(), alumnosVisibles()]);
  if (!puedeVer(visibles, id)) notFound();
  const [s, extra] = await Promise.all([seguimiento(), extrasFicha(id)]);
  const al = s.alumnos.find((a) => a.id === id);
  if (!al) notFound();
  const k = panelRespuestasCopy[locale];
  const c = actividadesCopy[locale];
  const r = resumenDe(s, al);
  const av = avanceDe(s, al);
  const fecha = (iso: string) => fechaHora(iso, locale);
  const nombreEstado = { cerrada: k.legendLocked, hecha: k.legendDone, "en-curso": k.legendDoing, "sin-empezar": k.legendTodo };
  const tono = { cerrada: "", hecha: "ok", "en-curso": "info", "sin-empezar": "warn" } as const;

  // Lo último que ha hecho: registro, aperturas, envíos, correcciones y preguntas.
  const titulo = (lid: string | null) => (lid ? (extra.tituloDe.get(lid) ?? s.lecciones.find((l) => l.id === lid)?.title ?? "—") : "—");
  const eventos: { at: string; texto: string; href?: string; icono: "libro" | "ok" | "enlace" | "tareas" | "revisar" | "chat" | "aviso" }[] = [];
  for (const e of extra.log) {
    const t = (k.ev as Record<string, string>)[e.kind];
    if (t) eventos.push({ at: e.created_at, texto: f(t, { l: titulo(e.lesson_id) }), icono: e.kind === "lesson_complete" || e.kind === "quiz_pass" ? "ok" : e.kind === "quiz_fail" ? "aviso" : "libro" });
  }
  for (const [lid, urls] of al.abiertos) {
    const l = s.lecciones.find((x) => x.id === lid);
    for (const [url, at] of urls) eventos.push({ at, texto: f(k.ev.open, { r: l?.recursos.find((x) => x.url === url)?.label ?? url }), href: url, icono: "enlace" });
  }
  for (const x of al.respuestas.values()) {
    const a = buscar(x.activity_key);
    if (!a || a.anonima) continue;
    if (x.submitted_at) eventos.push({ at: x.submitted_at, texto: f(k.ev.submit, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}`, icono: "tareas" });
    if (x.reviewed_at && (x.status === "revisada" || x.status === "devuelta"))
      eventos.push({ at: x.reviewed_at, texto: f(x.status === "devuelta" ? k.ev.returned : k.ev.reviewed, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}`, icono: "revisar" });
  }
  for (const q of extra.preguntas) eventos.push({ at: q.created_at, texto: f(k.ev.question, { q: q.question.slice(0, 90) }), icono: "chat" });
  eventos.sort((a, b) => b.at.localeCompare(a.at));

  const Evento = ({ e }: { e: (typeof eventos)[number] }) => (
    <li>
      <span className="axr-resp-feed__icon">
        <Icono n={e.icono} size={13} />
      </span>
      <span>
        {e.href ? (
          <a href={e.href} target={e.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {e.texto}
          </a>
        ) : (
          e.texto
        )}
        <time>{haceCuanto(e.at, k, locale)}</time>
      </span>
    </li>
  );

  return (
    <div className="axr-admin-page axr-resp">
      <p className="axr-resp-back">
        <Link href="/admin/respuestas">← {k.title}</Link>
      </p>

      {/* ── Quién es ── */}
      <section className="axr-resp-card axr-resp-hero">
        <Avatar nombre={al.nombre} id={al.id} size="lg" />
        <div className="axr-resp-hero__who">
          <h1>{al.nombre}</h1>
          <p>
            {al.email}
            {al.preparacion ? ` · ${k.prep}: ${al.preparacion.hechos}/${al.preparacion.total}` : ""}
            {al.ultima ? ` · ${k.lastSeen.toLowerCase()} ${haceCuanto(al.ultima, k, locale)}` : ""}
          </p>
          <div className="axr-resp-teacher">
            <span className="axr-resp-muted">{k.teacher}:</span>
            {extra.tutores.length ? (
              extra.tutores.map((t) => (
                <span key={t.id} className="axr-resp-chip">
                  {t.nombre}
                  {visibles.admin ? (
                    <form action={quitarProfesor.bind(null, id, t.id)}>
                      <button type="submit" aria-label={`${k.remove} ${t.nombre}`} title={k.remove}>
                        ×
                      </button>
                    </form>
                  ) : null}
                </span>
              ))
            ) : (
              <span className="axr-resp-chip is-empty">{k.noTeacher}</span>
            )}
            {visibles.admin ? (
              <form action={asignarProfesor.bind(null, id)} className="axr-resp-assign">
                <select name="teacher" required defaultValue="" aria-label={k.chooseTeacher}>
                  <option value="" disabled>
                    {k.chooseTeacher}
                  </option>
                  {extra.equipo
                    .filter((p) => !extra.tutores.some((t) => t.id === p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                </select>
                <button type="submit" className="axr-btn axr-btn--small axr-btn--ghost">
                  {k.assign}
                </button>
              </form>
            ) : null}
          </div>
        </div>
        <dl className="axr-resp-hero__stats">
          <div>
            <dt>{k.kProgress}</dt>
            <dd>
              {av.hechas}
              <em>/{av.total}</em>
            </dd>
          </div>
          <div>
            <dt>{k.statActivities}</dt>
            <dd>
              {r.actividades.a}
              <em>/{r.actividades.b}</em>
            </dd>
          </div>
          <div>
            <dt>{k.statMaterial}</dt>
            <dd>
              {r.material.a}
              <em>/{r.material.b}</em>
            </dd>
          </div>
          <div>
            <dt>{k.statGrade}</dt>
            <dd>
              {r.media !== null ? coma(r.media) : "—"}
              {r.media !== null ? <em>/10</em> : null}
            </dd>
          </div>
        </dl>
      </section>

      <div className="axr-resp-split">
        {/* ── Su recorrido ── */}
        <section className="axr-resp-card is-flush">
          <header className="axr-resp-card__head">
            <h2>{k.journey}</h2>
          </header>
          <ol className="axr-resp-journey">
            {s.lecciones.map((l, i) => {
              const e = estadoLeccion(s, l, al);
              const acts = actividadesDeLeccion(s, l).filter((a) => !a.anonima);
              const abiertos = al.abiertos.get(l.id);
              return (
                <li key={l.id} id={`l-${l.id}`} className={`is-${e.estado}`}>
                  <span className={`axr-resp-dot is-${e.estado}${e.pendiente ? " has-review" : ""}`}>{e.estado === "hecha" ? <Icono n="ok" size={13} /> : null}</span>
                  <div className="axr-resp-journey__body">
                    <div className="axr-resp-journey__head">
                      <span className="axr-resp-tag">{etiquetaCorta(l.title, i, k.prevShort)}</span>
                      <strong>{l.title.replace(/^(hora|hour)\s*\d+\s*·\s*/i, "")}</strong>
                      <span className={`axr-adm-pill${tono[e.estado] ? ` axr-adm-pill--${tono[e.estado]}` : ""}`}>{nombreEstado[e.estado]}</span>
                    </div>
                    {e.estado === "cerrada" ? (
                      <p className="axr-resp-muted axr-resp-journey__locked">{k.lessonLocked}</p>
                    ) : (
                      <div className="axr-resp-journey__cols">
                        {l.recursos.length ? (
                          <div>
                            <h3>
                              {k.linksTitle} <Barra a={e.material.abiertos} b={e.material.total} ancho={48} />
                            </h3>
                            <ul className="axr-resp-checks">
                              {l.recursos.map((rec) => {
                                const at = abiertos?.get(rec.url);
                                return (
                                  <li key={rec.url} className={at ? "is-ok" : undefined}>
                                    <Icono n={at ? "ok" : "reloj"} size={13} />
                                    <span>
                                      <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                        {rec.label}
                                      </a>
                                      <small>{at ? f(k.opened, { d: fecha(at) }) : k.notOpened}</small>
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}
                        {acts.length ? (
                          <div>
                            <h3>{k.activitiesTitle}</h3>
                            <ul className="axr-resp-tasks">
                              {acts.map((a) => {
                                const x = al.respuestas.get(a.key);
                                const enviada = x && x.status !== "borrador";
                                const res = x ? resultado(a, x) : null;
                                const corregir = a.revisa && x?.status === "enviada";
                                return (
                                  <li key={a.key}>
                                    <span>
                                      <strong>{tx(a.titulo, locale)}</strong>
                                      <small>
                                        {k.tipos[a.tipo]}
                                        {a.obligatoria ? "" : ` · ${k.optional}`}
                                      </small>
                                    </span>
                                    <span className="axr-resp-tasks__state">
                                      {x ? <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span> : <span className="axr-resp-muted">{k.notSent}</span>}
                                      {res ? <b>{res}</b> : null}
                                    </span>
                                    {enviada ? (
                                      <Link href={`/admin/respuestas/${x.id}`} className={`axr-btn axr-btn--small${corregir ? "" : " axr-btn--ghost"}`}>
                                        {corregir ? k.correct : k.see}
                                      </Link>
                                    ) : (
                                      <span />
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="axr-resp-side">
          {/* ── Por corregir ── */}
          <section className={`axr-resp-card${r.porCorregir.length ? " is-warn" : ""}`}>
            <header className="axr-resp-card__head">
              <h2>
                {k.pendingTitle}
                {r.porCorregir.length ? <span className="axr-resp-count is-warn">{r.porCorregir.length}</span> : null}
              </h2>
            </header>
            {r.porCorregir.length ? (
              <ul className="axr-resp-queue is-compact">
                {r.porCorregir.map((x) => {
                  const a = buscar(x.activity_key);
                  return (
                    <li key={x.id}>
                      <div>
                        <strong>{a ? tx(a.titulo, locale) : x.activity_key}</strong>
                        <span>{haceCuanto(x.submitted_at, k, locale)}</span>
                      </div>
                      <Link href={`/admin/respuestas/${x.id}`} className="axr-btn axr-btn--small">
                        {k.correct}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="axr-resp-allgood">
                <Icono n="ok" size={16} /> {k.nothingToReview}
              </p>
            )}
          </section>

          {/* ── Asistente ── */}
          <section className="axr-resp-card">
            <header className="axr-resp-card__head">
              <h2>
                {k.questionsN}
                <span className="axr-resp-count">{extra.preguntas.length}</span>
              </h2>
            </header>
            {extra.preguntas.length ? (
              <>
                <ul className="axr-resp-qa">
                  {extra.preguntas.slice(0, 3).map((q) => (
                    <Pregunta key={q.id} q={q} cuando={haceCuanto(q.created_at, k, locale)} sin={k.unanswered} />
                  ))}
                </ul>
                {extra.preguntas.length > 3 ? (
                  <details className="axr-resp-more">
                    <summary>{f(k.seeAll, { n: extra.preguntas.length })}</summary>
                    <ul className="axr-resp-qa">
                      {extra.preguntas.slice(3).map((q) => (
                        <Pregunta key={q.id} q={q} cuando={haceCuanto(q.created_at, k, locale)} sin={k.unanswered} />
                      ))}
                    </ul>
                  </details>
                ) : null}
              </>
            ) : (
              <p className="axr-resp-allgood is-muted">{k.noQuestions}</p>
            )}
          </section>

          {/* ── Actividad reciente ── */}
          <section className="axr-resp-card">
            <header className="axr-resp-card__head">
              <h2>{k.recent}</h2>
            </header>
            {eventos.length ? (
              <>
                <ol className="axr-resp-feed">
                  {eventos.slice(0, VISIBLES).map((e, i) => (
                    <Evento key={`${e.at}-${i}`} e={e} />
                  ))}
                </ol>
                {eventos.length > VISIBLES ? (
                  <details className="axr-resp-more">
                    <summary>{f(k.seeAll, { n: eventos.length })}</summary>
                    <ol className="axr-resp-feed">
                      {eventos.slice(VISIBLES, 200).map((e, i) => (
                        <Evento key={`${e.at}-${i}`} e={e} />
                      ))}
                    </ol>
                  </details>
                ) : null}
              </>
            ) : (
              <p className="axr-resp-allgood is-muted">{k.noHistory}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Pregunta({ q, cuando, sin }: { q: { question: string; answer: string | null }; cuando: string; sin: string }) {
  return (
    <li>
      <p className="axr-resp-qa__q">
        {q.question}
        <time>{cuando}</time>
      </p>
      <p className="axr-resp-qa__a">{q.answer ? q.answer.slice(0, 280) + (q.answer.length > 280 ? "…" : "") : sin}</p>
    </li>
  );
}
