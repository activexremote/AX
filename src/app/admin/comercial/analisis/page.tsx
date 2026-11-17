import Link from "next/link";

import { BotonAnalizar } from "@/components/admin/comercial/boton-analizar";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { distribucion, indicadores, porTipologia, senales, target, type Barra } from "@/lib/comercial/analisis";
import { exigirComercial } from "@/lib/comercial/acceso";
import type { Insight } from "@/lib/comercial/insights";
import { fichas, leadsDeZoho } from "@/lib/comercial/leads";
import { pregunta, type Respuestas } from "@/lib/comercial/perfilado";
import { createAdminClient } from "@/lib/supabase/admin";
import "../comercial.scss";
import "./analisis.scss";

// ══════════════════════════════════════════════════════════
//  Análisis de leads
//
//  Lo que dicen los perfilados del equipo comercial: los indicadores
//  principales, la tipología a la que apuntar, la comparativa entre
//  tipologías, señales automáticas de lo que puede fallar en los anuncios,
//  el reparto de cada respuesta y, a demanda, una lectura con IA.
// ══════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

const coma = (n: number | null, d = 1) => (n === null ? "—" : n.toFixed(d).replace(".", ","));

/** Un medidor de media luna. `bueno` dice hacia dónde es mejor: arriba o abajo. */
function Medidor({ titulo, valor, max, sufijo, bueno, ayuda, umbral }: {
  titulo: string;
  valor: number | null;
  max: number;
  sufijo: string;
  bueno: "alto" | "bajo";
  ayuda: string;
  umbral: [number, number];
}) {
  const p = valor === null ? 0 : Math.max(0, Math.min(100, (valor / max) * 100));
  const [a, b] = umbral;
  const tono =
    valor === null ? "neutro" : bueno === "alto" ? (valor >= b ? "ok" : valor >= a ? "warn" : "bad") : valor <= a ? "ok" : valor <= b ? "warn" : "bad";
  const etiqueta = { ok: "Bien", warn: "Regular", bad: "Mal", neutro: "Sin datos" }[tono];
  return (
    <div className={`axr-la-gauge is-${tono}`} title={ayuda}>
      <svg viewBox="0 0 120 68" aria-hidden>
        <path d="M10 62 A50 50 0 0 1 110 62" pathLength={100} className="axr-la-gauge__track" />
        <path d="M10 62 A50 50 0 0 1 110 62" pathLength={100} className="axr-la-gauge__val" strokeDasharray={`${p} 100`} />
      </svg>
      <strong>
        {valor === null ? "—" : sufijo === "%" ? Math.round(valor) : coma(valor)}
        <small>{sufijo === "%" ? " %" : `/${max}`}</small>
      </strong>
      <span className="axr-la-gauge__t">{titulo}</span>
      <span className={`axr-la-status is-${tono}`}>
        <Icono n={tono === "ok" ? "ok" : tono === "bad" ? "error" : tono === "warn" ? "aviso" : "info"} size={12} /> {etiqueta}
      </span>
    </div>
  );
}

/** Barra horizontal fina con su valor al lado. */
function Bar({ v, max, texto, tip }: { v: number | null; max: number; texto: string; tip: string }) {
  const p = v === null ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
  return (
    <span className="axr-la-bar" title={tip}>
      <span aria-hidden>
        <span style={{ width: `${p}%` }} />
      </span>
      <small>{texto}</small>
    </span>
  );
}

function Reparto({ k, rs }: { k: string; rs: Respuestas[] }) {
  const p = pregunta(k);
  if (!p) return null;
  const d = distribucion(rs, k);
  const max = Math.max(1, ...d.barras.map((b: Barra) => b.n));
  return (
    <section className="axr-admin-card axr-la-dist">
      <h3>{p.titulo}</h3>
      <p>
        {d.total} {d.total === 1 ? "respuesta" : "respuestas"}
        {p.tipo === "varias" ? " · se puede marcar más de una" : ""}
      </p>
      {d.total ? (
        <ul>
          {d.barras.map((b) => (
            <li key={b.k} title={`${b.t}: ${b.n} de ${d.total} (${b.pct} %)`}>
              <span className="axr-la-dist__t">{b.t}</span>
              <span className="axr-la-dist__bar" aria-hidden>
                <span style={{ width: `${(b.n / max) * 100}%` }} />
              </span>
              <span className="axr-la-dist__n">
                {b.n} <small>· {b.pct} %</small>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="axr-la-muted">Aún sin respuestas.</p>
      )}
    </section>
  );
}

export default async function AnalisisPage() {
  await exigirComercial();
  const [todas, { leads, error }, { data: ultimo }] = await Promise.all([
    fichas(),
    leadsDeZoho(),
    createAdminClient().from("lead_insights").select("created_at, leads_count, content").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const conDatos = todas.filter((f) => Object.keys(f.answers ?? {}).length);
  const rs = conDatos.map((f) => f.answers as Respuestas);
  const ind = indicadores(rs);
  const tipos = porTipologia(rs);
  const tg = target(tipos);
  const avisos = senales(rs, ind);
  const ia = ultimo?.content as Insight | undefined;
  const nuevos = ultimo ? conDatos.length - (ultimo.leads_count as number) : 0;

  return (
    <div className="axr-admin-page axr-admin-page--wide axr-com axr-la">
      <div className="axr-admin-page__header">
        <div>
          <h1>Análisis de leads</h1>
          <p>
            Qué tipo de persona deja sus datos, qué esperaba y cuánto interés tenía de verdad, a partir de lo que apunta el equipo comercial en{" "}
            <Link href="/admin/comercial/leads">Perfilado de leads</Link>. Sirve para decidir a quién apuntar las campañas y por qué las actuales no
            terminan de funcionar.
          </p>
        </div>
        <Link className="axr-btn axr-btn--ghost" href="/admin/comercial/leads?ver=pendientes">
          Perfilar leads
        </Link>
      </div>

      <p className="axr-la-cov">
        <strong>{conDatos.length}</strong> de <strong>{leads.length || "—"}</strong> leads de Zoho perfilados
        {error ? <span className="axr-la-muted"> · Zoho no ha contestado ahora mismo</span> : null}
        {conDatos.length > 0 && conDatos.length < 10 ? <span className="axr-la-warn"> · Con tan pocos casos, tómalo como orientación, no como verdad.</span> : null}
      </p>

      {!conDatos.length ? (
        <section className="axr-admin-card axr-adm-empty">
          <Icono n="grafica" size={28} />
          <strong>Aún no hay ningún lead perfilado</strong>
          <span>En cuanto el equipo comercial conteste las fichas, aquí saldrán las gráficas y la comparativa.</span>
          <Link className="axr-btn" href="/admin/comercial/leads?ver=pendientes">
            Empezar a perfilar →
          </Link>
        </section>
      ) : (
        <>
          <section className="axr-la-gauges" aria-label="Indicadores">
            <Medidor titulo="Interés real" valor={ind.interes} max={5} sufijo="/5" bueno="alto" umbral={[2.5, 3.5]} ayuda="Media de «¿Cuánto interés real tenía?» (1 = sólo por educación, 5 = mucho interés)." />
            <Medidor titulo="Encaje con el curso" valor={ind.encaje} max={5} sufijo="/5" bueno="alto" umbral={[2.5, 3.5]} ayuda="Media de «¿Encaja con el curso?»." />
            <Medidor titulo="Acaban bien" valor={ind.positivo} max={100} sufijo="%" bueno="alto" umbral={[20, 40]} ayuda="Parte que acaba en matrícula, seguimiento o pidiendo información." />
            <Medidor titulo="El precio les frena" valor={ind.precio} max={100} sufijo="%" bueno="bajo" umbral={[20, 35]} ayuda="Parte para quien el precio es el motivo principal o uno más para no seguir." />
            <Medidor titulo="Esperaban otra cosa" valor={ind.otraCosa} max={100} sufijo="%" bueno="bajo" umbral={[15, 30]} ayuda="Esperaban ofertas de trabajo o algo gratis, no recordaban haber dejado sus datos, o el anuncio les prometía otra cosa." />
            <Medidor titulo="Sólo por educación" valor={ind.soloEducacion} max={100} sufijo="%" bueno="bajo" umbral={[20, 40]} ayuda="Interés real de 1 o 2: escuchaban por educación." />
          </section>

          <div className="axr-la-top">
            {tg ? (
              <section className="axr-admin-card axr-la-target">
                <span className="axr-la-kicker">
                  <Icono n="chispa" size={14} /> A quién apuntar
                </span>
                <h2>{tg.tipo.t}</h2>
                <p>
                  Es la tipología con mejor puntuación: interés {coma(tg.tipo.interes)}/5, encaje {coma(tg.tipo.encaje)}/5 y el {tg.tipo.positivo} %
                  acaba bien ({tg.tipo.n} {tg.tipo.n === 1 ? "caso" : "casos"}).
                </p>
                <div className="axr-la-score">
                  <span aria-hidden>
                    <span style={{ width: `${tg.tipo.puntuacion}%` }} />
                  </span>
                  <strong>{tg.tipo.puntuacion}</strong>
                  <small>/100</small>
                </div>
                {tg.pocosDatos ? <p className="axr-la-warn">Pocos casos todavía: confírmalo con más perfilados.</p> : null}
              </section>
            ) : null}

            <section className="axr-admin-card axr-la-signals">
              <h2>Qué puede estar fallando en los anuncios</h2>
              {avisos.length ? (
                <ul>
                  {avisos.map((s) => (
                    <li key={s.titulo} className={`is-${s.tono}`}>
                      <Icono n={s.tono === "ok" ? "ok" : s.tono === "bad" ? "error" : "aviso"} size={16} />
                      <div>
                        <strong>{s.titulo}</strong>
                        <p>{s.texto}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="axr-la-muted">
                  {rs.length < 5 ? `Las señales automáticas salen a partir de 5 leads perfilados (vas por ${rs.length}).` : "Nada pasa de los umbrales de alarma."}
                </p>
              )}
            </section>
          </div>

          <section className="axr-admin-card axr-la-compare">
            <h2>Comparativa por tipología</h2>
            <p className="axr-la-muted">
              La puntuación (0–100) suma el interés real (35 %), el encaje (35 %) y la parte que acaba bien (30 %). Ordenadas de mejor a peor.
            </p>
            <div className="axr-com-scroll">
              <table className="axr-admin-table">
                <thead>
                  <tr>
                    <th>Tipología</th>
                    <th>Casos</th>
                    <th>Puntuación</th>
                    <th>Interés</th>
                    <th>Encaje</th>
                    <th>Acaban bien</th>
                    <th>Precio frena</th>
                    <th>Esperaban otra cosa</th>
                  </tr>
                </thead>
                <tbody>
                  {tipos.map((t) => (
                    <tr key={t.k} className={tg?.tipo.k === t.k ? "is-target" : ""}>
                      <td>
                        <strong>{t.t}</strong>
                        {tg?.tipo.k === t.k ? <span className="axr-adm-pill axr-adm-pill--accent">Target</span> : null}
                      </td>
                      <td className="is-num">{t.n}</td>
                      <td>
                        <Bar v={t.puntuacion} max={100} texto={String(t.puntuacion)} tip={`Puntuación ${t.puntuacion}/100`} />
                      </td>
                      <td>
                        <Bar v={t.interes} max={5} texto={coma(t.interes)} tip={`Interés medio ${coma(t.interes)}/5`} />
                      </td>
                      <td>
                        <Bar v={t.encaje} max={5} texto={coma(t.encaje)} tip={`Encaje medio ${coma(t.encaje)}/5`} />
                      </td>
                      <td>
                        <Bar v={t.positivo} max={100} texto={`${t.positivo} %`} tip={`${t.positivo} % acaba en matrícula, seguimiento o información`} />
                      </td>
                      <td>
                        <Bar v={t.precio} max={100} texto={`${t.precio} %`} tip={`Al ${t.precio} % le frena el precio`} />
                      </td>
                      <td>
                        <Bar v={t.otraCosa} max={100} texto={`${t.otraCosa} %`} tip={`El ${t.otraCosa} % esperaba otra cosa`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="axr-admin-card axr-la-ai">
            <div className="axr-la-ai__head">
              <div>
                <span className="axr-la-kicker">
                  <Icono n="chispa" size={14} /> Lectura con IA
                </span>
                <h2>Insights para las campañas</h2>
                <p className="axr-la-muted">
                  La IA cruza las fichas (sin nombres ni correos), lo que dicen los banners aprobados y el rendimiento de las campañas de Meta.
                  {ultimo
                    ? ` Último análisis: ${new Date(ultimo.created_at as string).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" })}, con ${ultimo.leads_count} leads${nuevos > 0 ? ` (hay ${nuevos} nuevos desde entonces)` : ""}.`
                    : ""}
                </p>
              </div>
              <BotonAnalizar hayAnterior={Boolean(ia)} deshabilitado={conDatos.length < 3 ? `Hacen falta 3 leads perfilados (hay ${conDatos.length}).` : undefined} />
            </div>

            {ia ? (
              <div className="axr-la-ai__body">
                <p className="axr-la-ai__sum">
                  {ia.resumen} <span className={`axr-adm-pill axr-adm-pill--${ia.confianza === "alta" ? "ok" : ia.confianza === "media" ? "info" : "warn"}`}>Confianza {ia.confianza}</span>
                </p>
                <div className="axr-la-ai__grid">
                  <div className="axr-la-ai__box is-target">
                    <h3>A quién apuntar</h3>
                    <strong>{ia.target.perfil}</strong>
                    <p>{ia.target.porque}</p>
                    {ia.evitar.length ? (
                      <>
                        <h4>A quién no</h4>
                        <ul>
                          {ia.evitar.map((e) => (
                            <li key={e.perfil}>
                              <strong>{e.perfil}:</strong> {e.porque}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Por qué los anuncios no terminan de funcionar</h3>
                    <ol>
                      {ia.problemas.map((p) => (
                        <li key={p.titulo}>
                          <strong>{p.titulo}</strong>
                          <p>{p.explicacion}</p>
                          {p.evidencia ? <small>Datos: {p.evidencia}</small> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Qué cambiar</h3>
                    <ol>
                      {ia.acciones.map((a) => (
                        <li key={a.titulo}>
                          <strong>{a.titulo}</strong>
                          <p>{a.detalle}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Mensajes para probar</h3>
                    <ul className="axr-la-ads">
                      {ia.mensajes.map((m) => (
                        <li key={m.ejemplo}>
                          <small>{m.angulo}</small>
                          <q>{m.ejemplo}</q>
                        </li>
                      ))}
                    </ul>
                    {ia.validar.length ? (
                      <>
                        <h4>Para confirmarlo</h4>
                        <ul>
                          {ia.validar.map((v) => (
                            <li key={v}>{v}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <h2 className="axr-la-sec">Cómo se reparte cada respuesta</h2>
          <div className="axr-la-dists">
            {["perfil", "esperaba", "motivo", "precio", "freno_precio", "frenos", "interes", "encaje", "resultado", "urgencia", "origen", "anuncio_recuerdo", "edad", "ingles"].map((k) => (
              <Reparto key={k} k={k} rs={rs} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
