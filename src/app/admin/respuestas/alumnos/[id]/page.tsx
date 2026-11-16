import Link from "next/link";
import { notFound } from "next/navigation";

import { asignarProfesor, quitarProfesor } from "@/app/admin/respuestas/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { alumnosVisibles, puedeVer } from "@/lib/actividades/acceso";
import { actividad as buscar } from "@/lib/actividades/catalogo";
import { actividadesDeLeccion, extrasFicha, hechaPor, materialDe, resumenDe, seguimiento } from "@/lib/actividades/seguimiento";
import { tx, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { panelRespuestasCopy } from "@/lib/i18n/panel-respuestas";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  La ficha del alumno
//
//  De arriba abajo, lo que un profesor busca:
//    1. quién es, quién le corrige y tres cifras (actividades, material,
//       nota media);
//    2. lo que tiene por corregir;
//    3. sus lecciones, una línea cada una; al abrirla, el material que ha
//       abierto y sus actividades, con el enlace a cada respuesta;
//    4. plegados: sus preguntas al asistente y su historial.
// ══════════════════════════════════════════════════════════

const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };
const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const coma = (n: number) => String(n).replace(".", ",");

export default async function FichaAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }, visibles] = await Promise.all([params, getI18n(), alumnosVisibles()]);
  if (!puedeVer(visibles, id)) notFound();
  const [s, extra] = await Promise.all([seguimiento(), extrasFicha(id)]);
  const al = s.alumnos.find((a) => a.id === id);
  if (!al) notFound();
  const k = panelRespuestasCopy[locale];
  const c = actividadesCopy[locale];
  const r = resumenDe(s, al);
  const fecha = (iso: string) =>
    new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

  // El historial: lo del registro, más aperturas, envíos, correcciones y preguntas.
  const titulo = (lid: string | null) => (lid ? extra.tituloDe.get(lid) ?? s.lecciones.find((l) => l.id === lid)?.title ?? "—" : "—");
  const eventos: { at: string; texto: string; href?: string }[] = [];
  for (const e of extra.log) {
    const t = (k.ev as Record<string, string>)[e.kind];
    if (t) eventos.push({ at: e.created_at, texto: f(t, { l: titulo(e.lesson_id) }) });
  }
  for (const [lid, urls] of al.abiertos) {
    const l = s.lecciones.find((x) => x.id === lid);
    for (const [url, at] of urls) eventos.push({ at, texto: f(k.ev.open, { r: l?.recursos.find((x) => x.url === url)?.label ?? url }), href: url });
  }
  for (const x of al.respuestas.values()) {
    const a = buscar(x.activity_key);
    if (!a || a.anonima) continue;
    if (x.submitted_at) eventos.push({ at: x.submitted_at, texto: f(k.ev.submit, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}` });
    if (x.reviewed_at && (x.status === "revisada" || x.status === "devuelta"))
      eventos.push({ at: x.reviewed_at, texto: f(x.status === "devuelta" ? k.ev.returned : k.ev.reviewed, { a: tx(a.titulo, locale) }), href: `/admin/respuestas/${x.id}` });
  }
  for (const q of extra.preguntas) eventos.push({ at: q.created_at, texto: f(k.ev.question, { q: q.question.slice(0, 120) }) });
  eventos.sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="axr-admin-page axr-resp">
      <p className="axr-resp__back">
        <Link href="/admin/respuestas?vista=alumnos">{k.backToStudents}</Link>
      </p>

      {/* ── Quién es ── */}
      <div className="axr-admin-page__header">
        <div>
          <h1>{al.nombre}</h1>
          <p>
            {al.email}
            {al.preparacion ? ` · ${k.prep}: ${al.preparacion.hechos}/${al.preparacion.total}` : ""}
          </p>
        </div>
      </div>

      <div className="axr-resp__teacher">
        <span className="axr-resp__muted">{k.teacher}:</span>
        {extra.tutores.length ? (
          extra.tutores.map((t) => (
            <span key={t.id} className="axr-adm-pill">
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
          <span className="axr-resp__muted">{k.noTeacher}</span>
        )}
        {visibles.admin ? (
          <form action={asignarProfesor.bind(null, id)} className="axr-resp__assign">
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

      {/* ── Tres cifras ── */}
      <div className="axr-adm-stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">{k.statActivities}</span>
          <span className="axr-adm-stat__value">
            {r.actividades.a}/{r.actividades.b}
          </span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">{k.statMaterial}</span>
          <span className="axr-adm-stat__value">
            {r.material.a}/{r.material.b}
          </span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">{k.statGrade}</span>
          <span className="axr-adm-stat__value">{r.media !== null ? `${coma(r.media)}/10` : "—"}</span>
        </div>
      </div>

      {/* ── Por corregir ── */}
      {r.porCorregir.length ? (
        <div className="axr-admin-card axr-resp__pending">
          <h2>
            {k.pendingTitle} · {r.porCorregir.length}
          </h2>
          {r.porCorregir.map((x) => {
            const a = buscar(x.activity_key);
            return (
              <div key={x.id} className="axr-resp__row">
                <span>
                  <strong>{a ? tx(a.titulo, locale) : x.activity_key}</strong>
                  {x.submitted_at ? <small> · {fecha(x.submitted_at)}</small> : null}
                </span>
                <Link href={`/admin/respuestas/${x.id}`} className="axr-btn axr-btn--small">
                  {k.correct}
                </Link>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── Lecciones ── */}
      <div className="axr-admin-card axr-admin-card--flush">
        <h2 className="axr-resp__card-title">{k.lessons}</h2>
        {s.lecciones.map((l) => {
          const cerrada = al.cerradas.has(l.id);
          const hecha = al.completadas.has(l.id);
          const m = materialDe(l, al);
          const acts = actividadesDeLeccion(s, l).filter((a) => !a.anonima);
          const obl = acts.filter((a) => a.obligatoria);
          const oblHechas = obl.filter((a) => hechaPor(a, al)).length;
          const abiertos = al.abiertos.get(l.id);
          return (
            <details key={l.id} className="axr-resp__lesson">
              <summary>
                <span className="axr-resp__lesson-title">{l.title}</span>
                <span className="axr-resp__lesson-meta">
                  {m.total ? (
                    <span className="axr-resp__muted">
                      {k.material} {m.abiertos}/{m.total}
                    </span>
                  ) : null}
                  {obl.length ? (
                    <span className="axr-resp__muted">
                      {k.activities} {oblHechas}/{obl.length}
                    </span>
                  ) : null}
                  <span className={`axr-adm-pill axr-adm-pill--${cerrada ? "" : hecha ? "ok" : "warn"}`}>{cerrada ? k.locked : hecha ? k.done : k.notDone}</span>
                </span>
              </summary>
              <div className="axr-resp__lesson-body">
                {l.recursos.length ? (
                  <div>
                    <h3>{k.linksTitle}</h3>
                    <ul className="axr-resp__list">
                      {l.recursos.map((rec) => {
                        const at = abiertos?.get(rec.url);
                        return (
                          <li key={rec.url} className={at ? "is-ok" : undefined}>
                            <Icono n={at ? "ok" : "reloj"} size={14} />
                            <a href={rec.url} target="_blank" rel="noopener noreferrer">
                              {rec.label}
                            </a>
                            <small>{at ? f(k.opened, { d: fecha(at) }) : k.notOpened}</small>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                {acts.length ? (
                  <div>
                    <h3>{k.activitiesTitle}</h3>
                    <ul className="axr-resp__list">
                      {acts.map((a) => {
                        const x = al.respuestas.get(a.key);
                        const enviada = x && x.status !== "borrador";
                        return (
                          <li key={a.key} className={hechaPor(a, al) ? "is-ok" : undefined}>
                            <Icono n={hechaPor(a, al) ? "ok" : "reloj"} size={14} />
                            <span>
                              {tx(a.titulo, locale)}
                              {a.obligatoria ? null : <small> · {k.optional}</small>}
                            </span>
                            <small>
                              {x ? <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span> : k.notSent}
                              {x?.grade !== null && x?.grade !== undefined ? ` · ${coma(Number(x.grade))}/10` : x?.result ? ` · ${x.result.pct} %` : ""}
                              {enviada ? (
                                <>
                                  {" · "}
                                  <Link href={`/admin/respuestas/${x.id}`}>{a.revisa && x.status === "enviada" ? k.correct : k.seeAnswers}</Link>
                                </>
                              ) : null}
                            </small>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            </details>
          );
        })}
      </div>

      {/* ── Asistente ── */}
      <details className="axr-admin-card axr-resp__fold">
        <summary>
          {k.assistant} · {extra.preguntas.length}
        </summary>
        {extra.preguntas.length ? (
          <ul className="axr-resp__qa">
            {extra.preguntas.map((q) => (
              <li key={q.id}>
                <p>
                  <strong>{q.question}</strong> <small>{fecha(q.created_at)}</small>
                </p>
                <p className="axr-resp__muted">{q.answer || k.unanswered}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="axr-resp__muted">{k.noQuestions}</p>
        )}
      </details>

      {/* ── Historial ── */}
      <details className="axr-admin-card axr-resp__fold">
        <summary>
          {k.history} · {eventos.length}
        </summary>
        {eventos.length ? (
          <ol className="axr-resp__history">
            {eventos.slice(0, 200).map((e, i) => (
              <li key={`${e.at}-${i}`}>
                <time>{fecha(e.at)}</time>
                <span>
                  {e.href ? (
                    <a href={e.href} target={e.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {e.texto}
                    </a>
                  ) : (
                    e.texto
                  )}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="axr-resp__muted">{k.noHistory}</p>
        )}
      </details>
    </div>
  );
}
