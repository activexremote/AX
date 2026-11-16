import Link from "next/link";
import { notFound } from "next/navigation";

import { asignarProfesor, quitarProfesor } from "@/app/admin/respuestas/actions";
import { RespuestasVista, ResultadoVista } from "@/components/actividades/vista";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { alumnosVisibles, puedeVer } from "@/lib/actividades/acceso";
import { calcular } from "@/lib/actividades/catalogo";
import { fichaAlumno, hechaPor, materialDe, type Evento } from "@/lib/actividades/seguimiento";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { fichaCopy } from "@/lib/i18n/ficha-alumno";
import { getI18n } from "@/lib/i18n/server";
import "@/components/actividades/actividades.scss";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  La ficha del alumno
//
//  Todo lo de una persona en una página, para su profesor y para la
//  administración:
//    · resumen (lecciones, material, actividades, nota media, tiempo) y
//      quién le corrige;
//    · su preparación del dry run;
//    · lección a lección: visitas, cada enlace abierto (o no) y cada
//      actividad con lo que ha contestado y el botón para corregir;
//    · archivos y enlaces entregados, preguntas al asistente, tests y
//      misiones;
//    · y toda su actividad, en orden.
// ══════════════════════════════════════════════════════════

const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };
const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

function resultado(a: Actividad, x: FilaRespuesta | undefined) {
  if (!x) return null;
  if (x.grade !== null && x.grade !== undefined) return `${String(x.grade).replace(".", ",")}/10`;
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return x.rubric ? Object.values(x.rubric).join(" · ") : null;
  return a.tipo === "diagnostico" ? `${r.pct} %` : `${r.puntos}/${r.max} · ${r.pct} %`;
}

export default async function AlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }, visibles] = await Promise.all([params, getI18n(), alumnosVisibles()]);
  if (!puedeVer(visibles, id)) notFound();
  const datos = await fichaAlumno(id);
  if (!datos) notFound();
  const c = actividadesCopy[locale];
  const k = fichaCopy[locale];
  const { alumno, lecciones, actividades, modulos } = datos;
  const fecha = (iso: string) =>
    new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
  const minutos = (s: number) => Math.round(s / 60);

  // ── Resumen ──
  const obligatorias = actividades.filter((a) => a.obligatoria);
  const hechas = obligatorias.filter((a) => hechaPor(a, alumno)).length;
  const material = lecciones.reduce(
    (acc, l) => {
      const m = materialDe(l, alumno);
      return { a: acc.a + m.abiertos, b: acc.b + m.total };
    },
    { a: 0, b: 0 },
  );
  const notas = [...alumno.respuestas.values()].map((x) => x.grade).filter((n): n is number => n !== null && n !== undefined).map(Number);
  const media = notas.length ? Math.round((notas.reduce((s, n) => s + n, 0) / notas.length) * 10) / 10 : null;
  const tiempo = datos.visitas.reduce((s, v) => s + ((v.time_spent_s as number) ?? 0), 0);
  const ultima = datos.visitas.map((v) => v.last_visit as string | null).filter(Boolean).sort().pop() ?? null;
  const visitaDe = new Map(datos.visitas.map((v) => [v.lesson_id as string, v]));

  // ── Archivos y enlaces: cada respuesta de tipo enlace, y las misiones ──
  const archivos: { url: string; de: string; cuando: string | null }[] = [];
  for (const a of actividades) {
    const x = alumno.respuestas.get(a.key);
    if (!x) continue;
    for (const campo of a.campos) {
      const v = x.answers[campo.k];
      if (campo.tipo === "url" && typeof v === "string" && v.trim()) archivos.push({ url: v.trim(), de: tx(a.titulo, locale), cuando: x.submitted_at });
    }
  }
  for (const e of datos.entregas) {
    if (e.evidence_url) archivos.push({ url: e.evidence_url as string, de: datos.tituloDe.get(e.lesson_id as string) ?? "—", cuando: e.created_at as string });
  }

  // ── Toda la actividad, en orden ──
  const actDe = new Map(actividades.map((a) => [a.key, a]));
  const titulo = (lid: string | null | undefined) => (lid ? datos.tituloDe.get(lid) ?? lecciones.find((l) => l.id === lid)?.title ?? "—" : "—");
  const eventos: Evento[] = [];
  for (const e of datos.log) {
    const kind = e.kind as string;
    const payload = (e.payload ?? {}) as { activity?: string };
    // Los envíos de actividades salen de activity_responses, con su enlace.
    if (kind === "activity_submit" || kind === "activity_reviewed" || kind === "activity_returned") continue;
    const plantilla = (k.ev as Record<string, string>)[kind] ?? k.ev.other;
    eventos.push({ at: e.created_at as string, tipo: kind, texto: f(plantilla, { l: titulo(e.lesson_id as string), k: kind, a: payload.activity ?? "" }), href: e.lesson_id ? `/lecciones/${e.lesson_id}` : undefined });
  }
  for (const [lid, urls] of alumno.abiertos) {
    const l = lecciones.find((x) => x.id === lid);
    for (const [url, at] of urls) {
      eventos.push({ at, tipo: "open", texto: f(k.ev.open, { r: l?.recursos.find((r) => r.url === url)?.label ?? url }), href: url, extra: l?.title });
    }
  }
  for (const x of alumno.respuestas.values()) {
    const a = actDe.get(x.activity_key);
    if (!a) continue;
    if (x.submitted_at) eventos.push({ at: x.submitted_at, tipo: "activity_submit", texto: f(k.ev.activity_submit, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}` });
    if (x.reviewed_at && (x.status === "revisada" || x.status === "devuelta"))
      eventos.push({ at: x.reviewed_at, tipo: "reviewed", texto: f(x.status === "devuelta" ? k.ev.returned : k.ev.reviewed, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}`, extra: resultado(a, x) ?? undefined });
  }
  for (const q of datos.preguntas) {
    eventos.push({ at: q.created_at as string, tipo: "question", texto: f(k.ev.question, { q: String(q.question).slice(0, 140) }) });
  }
  for (const p of PASOS) {
    const at = alumno.preparacion?.pasos[p.key];
    if (at) eventos.push({ at, tipo: "step", texto: f(k.ev.step, { p: locale === "en" ? p.titulo_en : p.titulo }) });
  }
  eventos.sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="axr-admin-page axr-resp axr-ficha">
      <p>
        <Link href="/admin/respuestas/alumnos">{c.aBackStudents}</Link>
      </p>
      <div className="axr-admin-page__header">
        <div>
          <h1>{alumno.nombre}</h1>
          <p>
            {alumno.email}
            {datos.perfil?.phone ? ` · ${k.phone}: ${datos.perfil.phone}` : ""}
            {datos.perfil?.created_at ? ` · ${k.since} ${fecha(datos.perfil.created_at as string)}` : ""}
            {datos.matriculas.length ? ` · ${k.enrollments}: ${datos.matriculas.map((m) => m.course).join(", ")}` : ""}
          </p>
        </div>
      </div>

      {/* ── Resumen ── */}
      <div className="axr-resp__grid">
        <div className="axr-resp__tile">
          <span>{k.lessonsDone}</span>
          <strong>
            {lecciones.filter((l) => alumno.completadas.has(l.id)).length}/{lecciones.length}
          </strong>
        </div>
        <div className="axr-resp__tile">
          <span>{k.materialOpened}</span>
          <strong>
            {material.a}/{material.b}
          </strong>
        </div>
        <div className="axr-resp__tile">
          <span>{k.activitiesSent}</span>
          <strong>
            {hechas}/{obligatorias.length}
          </strong>
        </div>
        <div className="axr-resp__tile">
          <span>{k.avgGrade}</span>
          <strong>{media !== null ? `${String(media).replace(".", ",")}/10` : "—"}</strong>
        </div>
        <div className="axr-resp__tile">
          <span>{k.timeOnCampus}</span>
          <strong>{minutos(tiempo)} min</strong>
        </div>
        <div className="axr-resp__tile">
          <span>{k.lastSeen}</span>
          <strong>{ultima ? fecha(ultima) : k.never}</strong>
        </div>
      </div>

      <div className="axr-resp__detail">
        <div>
          {/* ── Lección a lección ── */}
          <h2 className="axr-ficha__h">{k.byLesson}</h2>
          {lecciones.map((l) => {
            const hecha = alumno.completadas.get(l.id);
            const m = materialDe(l, alumno);
            const abiertos = alumno.abiertos.get(l.id);
            const v = visitaDe.get(l.id);
            const acts = actividades.filter((a) => modulos.some((mo) => mo.id === l.moduleId && mo.slug === a.modulo) && a.leccion === l.orden);
            return (
              <section key={l.id} className="axr-resp__card">
                <h2>
                  {l.title}{" "}
                  <span className={`axr-adm-pill axr-adm-pill--${alumno.completadas.has(l.id) ? "ok" : "warn"}`}>
                    {alumno.completadas.has(l.id) ? (hecha ? f(c.aCompletedOn, { d: fecha(hecha) }) : c.lessonDone) : c.aNotCompleted}
                  </span>
                </h2>
                <p>
                  <small>
                    {v ? [f(k.timeSpent, { m: minutos((v.time_spent_s as number) ?? 0) }), v.last_visit ? f(k.lastVisit, { d: fecha(v.last_visit as string) }) : null].filter(Boolean).join(" · ") : k.notVisited}
                  </small>
                </p>

                {l.recursos.length ? (
                  <>
                    <p>
                      <strong>
                        {c.aMaterial} · {m.abiertos}/{m.total}
                      </strong>
                    </p>
                    <ul className="axr-resp__checks">
                      {l.recursos.map((r) => {
                        const cuando = abiertos?.get(r.url);
                        return (
                          <li key={r.url} className={cuando ? "is-ok" : undefined}>
                            <Icono n={cuando ? "ok" : "reloj"} size={14} />
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              {r.label}
                            </a>
                            <small>{cuando ? f(c.aOpenedOn, { d: fecha(cuando) }) : c.aNotOpened}</small>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}

                {acts.map((a) => {
                  const x = alumno.respuestas.get(a.key);
                  const res = resultado(a, x);
                  const enviada = x && x.status !== "borrador";
                  return (
                    <div key={a.key} className={`axr-ficha__act${hechaPor(a, alumno) ? " is-ok" : ""}`}>
                      <div className="axr-ficha__act-head">
                        <Icono n={hechaPor(a, alumno) ? "ok" : "reloj"} size={14} />
                        <strong>
                          {tx(a.titulo, locale)}
                          {a.obligatoria ? "" : ` (${c.optional.toLowerCase()})`}
                        </strong>
                        <span>
                          {x ? <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span> : <small>{c.aNotSent}</small>}
                          {res ? <small> · {res}</small> : null}
                        </span>
                        {enviada ? (
                          <Link href={`/admin/respuestas/${x.id}`} className={`axr-btn axr-btn--small${a.revisa && x.status === "enviada" ? "" : " axr-btn--ghost"}`}>
                            {a.revisa ? k.correct : c.aOpen}
                          </Link>
                        ) : null}
                      </div>
                      {enviada ? (
                        <details>
                          <summary>{k.seeAnswers}</summary>
                          <ResultadoVista act={a} result={x.result ?? calcular(a, x.answers)} answers={x.answers} locale={locale} copy={c} />
                          {a.tipo === "formulario" || a.tipo === "encuesta" ? <RespuestasVista act={a} answers={x.answers} locale={locale} copy={c} /> : null}
                          {x.feedback ? (
                            <p className="axr-ficha__fb">
                              <strong>{c.teacherFeedback}:</strong> {x.feedback}
                            </p>
                          ) : null}
                        </details>
                      ) : null}
                    </div>
                  );
                })}
              </section>
            );
          })}

          {/* ── Toda la actividad ── */}
          <section className="axr-resp__card">
            <h2>{k.timeline}</h2>
            <p>
              <small>{k.timelineLead}</small>
            </p>
            {eventos.length ? (
              <ol className="axr-ficha__timeline">
                {eventos.slice(0, 300).map((e, i) => (
                  <li key={`${e.at}-${i}`} data-tipo={e.tipo}>
                    <time>{fecha(e.at)}</time>
                    <span>
                      {e.href ? (
                        <a href={e.href} target={e.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                          {e.texto}
                        </a>
                      ) : (
                        e.texto
                      )}
                      {e.extra ? <small> · {e.extra}</small> : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>{k.timelineNone}</p>
            )}
          </section>
        </div>

        <aside>
          {/* ── Profesor asignado ── */}
          <section className="axr-resp__card">
            <h2>{k.teachers}</h2>
            {datos.tutores.length ? (
              <ul className="axr-resp__checks">
                {datos.tutores.map((t) => (
                  <li key={t.id}>
                    <Icono n="usuarios" size={14} />
                    <span>{t.nombre}</span>
                    {visibles.admin ? (
                      <form action={quitarProfesor.bind(null, id, t.id)}>
                        <button type="submit" className="axr-btn axr-btn--small axr-btn--ghost">
                          {k.remove}
                        </button>
                      </form>
                    ) : (
                      <small />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{k.noTeacher}</p>
            )}
            {visibles.admin ? (
              <form action={asignarProfesor.bind(null, id)} className="axr-ficha__assign">
                <select name="teacher" required defaultValue="">
                  <option value="" disabled>
                    {k.chooseTeacher}
                  </option>
                  {datos.equipo
                    .filter((p) => !datos.tutores.some((t) => t.id === p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                </select>
                <button type="submit" className="axr-btn axr-btn--small">
                  {k.assign}
                </button>
              </form>
            ) : null}
          </section>

          {/* ── Preparación ── */}
          {alumno.preparacion ? (
            <section className="axr-resp__card">
              <h2>
                {c.aPrep} · {alumno.preparacion.hechos}/{alumno.preparacion.total}
              </h2>
              <ul className="axr-resp__checks">
                {PASOS.map((p) => {
                  const cuando = alumno.preparacion!.pasos[p.key];
                  return (
                    <li key={p.key} className={cuando ? "is-ok" : undefined}>
                      <Icono n={cuando ? "ok" : "reloj"} size={14} />
                      <span>{locale === "en" ? p.titulo_en : p.titulo}</span>
                      <small>{cuando ? fecha(cuando) : "—"}</small>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* ── Archivos y enlaces ── */}
          <section className="axr-resp__card">
            <h2>{k.files}</h2>
            {archivos.length ? (
              <ul className="axr-resp__checks">
                {archivos.map((x, i) => (
                  <li key={`${x.url}-${i}`}>
                    <Icono n="enlace" size={14} />
                    <span>
                      <a href={x.url} target="_blank" rel="noopener noreferrer">
                        {x.url.replace(/^https?:\/\//, "").slice(0, 60)}
                      </a>{" "}
                      <small>{f(k.filesFrom, { a: x.de })}</small>
                    </span>
                    <small>{x.cuando ? fecha(x.cuando) : ""}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{k.filesNone}</p>
            )}
          </section>

          {/* ── Preguntas al asistente ── */}
          <section className="axr-resp__card">
            <h2>
              {k.assistant} · {datos.preguntas.length}
            </h2>
            {datos.preguntas.length ? (
              <ul className="axr-ficha__qa">
                {datos.preguntas.map((q) => (
                  <li key={q.id as string}>
                    <details>
                      <summary>
                        <strong>{q.question as string}</strong> <small>{fecha(q.created_at as string)}</small>
                      </summary>
                      <p>{(q.answer as string) || k.unanswered}</p>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{k.assistantNone}</p>
            )}
          </section>

          {/* ── Tests de las lecciones y misiones (lo de antes de las actividades) ── */}
          {datos.intentos.length ? (
            <section className="axr-resp__card">
              <h2>{k.oldQuizzes}</h2>
              <ul className="axr-resp__checks">
                {datos.intentos.map((q) => (
                  <li key={q.id as string} className={q.passed ? "is-ok" : undefined}>
                    <Icono n={q.passed ? "ok" : "aviso"} size={14} />
                    <span>
                      {titulo(q.lesson_id)} · {Math.round(Number(q.score))} % · {q.passed ? k.passed : k.failed}
                    </span>
                    <small>{fecha(q.created_at as string)}</small>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {datos.entregas.length ? (
            <section className="axr-resp__card">
              <h2>{k.missions}</h2>
              <ul className="axr-resp__checks">
                {datos.entregas.map((e) => (
                  <li key={e.id as string}>
                    <Icono n="tareas" size={14} />
                    <span>
                      {titulo(e.lesson_id as string)} · {e.status as string}
                      {e.score !== null && e.score !== undefined ? ` · ${e.score}` : ""}
                    </span>
                    <small>{fecha(e.created_at as string)}</small>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
