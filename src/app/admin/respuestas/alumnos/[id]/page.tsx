import Link from "next/link";
import { notFound } from "next/navigation";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { calcular } from "@/lib/actividades/catalogo";
import { hechaPor, materialDe, seguimiento } from "@/lib/actividades/seguimiento";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Un alumno, entero
//
//  Su lista de preparación, y lección a lección: si la ha completado, cada
//  enlace del material con la fecha en que lo abrió (o «sin abrir») y cada
//  actividad con su estado, su resultado y el enlace a la respuesta.
// ══════════════════════════════════════════════════════════

const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };

function resultado(a: Actividad, x: FilaRespuesta | undefined) {
  if (!x) return null;
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return x.rubric ? Object.values(x.rubric).join(" · ") : null;
  return a.tipo === "diagnostico" ? `${r.pct} %` : `${r.puntos}/${r.max} · ${r.pct} %`;
}

export default async function AlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }, datos] = await Promise.all([params, getI18n(), seguimiento()]);
  const c = actividadesCopy[locale];
  const alumno = datos.alumnos.find((a) => a.id === id);
  if (!alumno) notFound();
  const fecha = (iso: string) => new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
  const f = (s: string, d: string) => s.replace("{d}", d);

  return (
    <div className="axr-admin-page axr-resp">
      <p>
        <Link href="/admin/respuestas/alumnos">{c.aBackStudents}</Link>
      </p>
      <div className="axr-admin-page__header">
        <div>
          <h1>{alumno.nombre}</h1>
          <p>{alumno.email}</p>
        </div>
      </div>

      <section className="axr-resp__card">
        <h2>
          {c.aPrep}
          {alumno.preparacion ? ` · ${alumno.preparacion.hechos}/${alumno.preparacion.total}` : ""}
        </h2>
        {alumno.preparacion ? (
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
        ) : (
          <p>{c.aPrepNone}</p>
        )}
      </section>

      {datos.lecciones.map((l) => {
        const hecha = alumno.completadas.get(l.id);
        const m = materialDe(l, alumno);
        const abiertos = alumno.abiertos.get(l.id);
        const acts = datos.actividades.filter((a) => datos.modulos.some((mo) => mo.id === l.moduleId && mo.slug === a.modulo) && a.leccion === l.orden);
        return (
          <section key={l.id} className="axr-resp__card">
            <h2>
              {l.title}{" "}
              <span className={`axr-adm-pill axr-adm-pill--${alumno.completadas.has(l.id) ? "ok" : "warn"}`}>
                {alumno.completadas.has(l.id) ? (hecha ? f(c.aCompletedOn, fecha(hecha)) : c.lessonDone) : c.aNotCompleted}
              </span>
            </h2>

            <p>
              <strong>
                {c.aMaterial} · {m.abiertos}/{m.total}
              </strong>
            </p>
            {l.recursos.length ? (
              <ul className="axr-resp__checks">
                {l.recursos.map((r) => {
                  const cuando = abiertos?.get(r.url);
                  return (
                    <li key={r.url} className={cuando ? "is-ok" : undefined}>
                      <Icono n={cuando ? "ok" : "reloj"} size={14} />
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.label}
                      </a>
                      <small>{cuando ? f(c.aOpenedOn, fecha(cuando)) : c.aNotOpened}</small>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>{c.aNoMaterial}</p>
            )}

            {acts.length ? (
              <>
                <p>
                  <strong>{c.aActivity}</strong>
                </p>
                <ul className="axr-resp__checks">
                  {acts.map((a) => {
                    const x = alumno.respuestas.get(a.key);
                    const res = resultado(a, x);
                    return (
                      <li key={a.key} className={hechaPor(a, alumno) ? "is-ok" : undefined}>
                        <Icono n={hechaPor(a, alumno) ? "ok" : "reloj"} size={14} />
                        <span>
                          {tx(a.titulo, locale)}
                          {a.obligatoria ? "" : ` (${c.optional.toLowerCase()})`}
                        </span>
                        <small>
                          {x ? <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span> : c.aNotSent}
                          {res ? ` · ${res}` : ""}
                          {x && x.status !== "borrador" ? (
                            <>
                              {" · "}
                              <Link href={`/admin/respuestas/${x.id}`}>{c.aSeeAnswer}</Link>
                            </>
                          ) : null}
                        </small>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
