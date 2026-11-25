import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BotonAnalizarEncuesta, BotonEnviarEncuesta, CopiarTexto } from "@/components/admin/dry-run/encuesta";
import { Bar, coma, Medidor } from "@/components/admin/medidor";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { correoListo, getMailSettings } from "@/lib/correo/envio";
import { enlaceEncuesta } from "@/lib/dry-run/correos";
import {
  BLOQUES,
  distribucion,
  grupoNps,
  media,
  mediana,
  nps,
  pregunta,
  textoOpcion,
  textoTema,
  TEMAS,
  valorLegible,
  type Respuestas,
} from "@/lib/dry-run/encuesta";
import type { RespuestaEncuesta } from "@/lib/dry-run/encuesta-datos";
import type { Clasificacion, InformeEncuesta } from "@/lib/dry-run/encuesta-ia";
import { cuandoEs } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, idInvitado, type DryRun, type DryRunGuest } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/comercial/analisis/analisis.scss";
import "@/app/admin/dry-run/dry-run.scss";
import "@/app/admin/dry-run/[id]/encuesta/encuesta.scss";

// ══════════════════════════════════════════════════════════
//  /admin/dry-run/<id>/encuesta — lo que han dicho los invitados
//
//  Arriba, el enlace para mandar y quién falta por responder (con su
//  WhatsApp o el correo). Después los indicadores, el precio, la lectura con
//  IA (qué funciona, qué mejorar, qué frena la compra, testimonios), el
//  reparto de cada pregunta y las respuestas una a una, clasificadas.
// ══════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const fecha = (d: string) =>
  new Date(d).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
const SENT: Record<Clasificacion["sentimiento"], string> = { positivo: "Positivo", mixto: "Mixto", negativo: "Negativo" };
const tonoSent = (s: Clasificacion["sentimiento"]) => (s === "positivo" ? "ok" : s === "negativo" ? "bad" : "warn");
const tonoNivel = (n: "alta" | "media" | "baja", alto: "ok" | "bad") => (n === "alta" ? alto : n === "media" ? "warn" : alto === "ok" ? "bad" : "ok");

function Reparto({ k, rs }: { k: string; rs: Respuestas[] }) {
  const p = pregunta(k);
  if (!p) return null;
  const d = distribucion(rs, k);
  const max = Math.max(1, ...d.barras.map((b) => b.n));
  return (
    <section className="axr-admin-card axr-la-dist">
      <h3>{p.titulo}</h3>
      <p>
        {d.total} {d.total === 1 ? "respuesta" : "respuestas"}
        {p.tipo === "varias" ? " · se puede marcar más de una" : ""}
        {p.tipo === "escala" || p.tipo === "nps" ? ` · media ${coma(media(rs, k))}` : ""}
      </p>
      {d.total ? (
        <ul>
          {d.barras.map((b) => (
            <li key={b.k} title={`${b.t}: ${b.n} de ${d.total} (${b.pct} %)`}>
              <span className="axr-la-dist__t">{p.tipo === "escala" ? `${b.t} · ${b.k === "1" ? p.min : b.k === "5" ? p.max : ""}`.replace(/ · $/, "") : b.t}</span>
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

type Busqueda = { tema?: string; sent?: string; grupo?: string };

export default async function EncuestaAdmin({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Busqueda> }) {
  const [{ id }, filtro] = await Promise.all([params, searchParams]);
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const admin = createAdminClient();
  const { data: runRow } = await admin.from("dry_runs").select("*").eq("id", id).maybeSingle();
  if (!runRow) notFound();
  const run = runRow as DryRun;

  const [{ data: guestsRows }, { data: filas }, { data: ultimo }, ajustes] = await Promise.all([
    admin.from("dry_run_guests").select("*").eq("dry_run_id", id).order("seq"),
    admin.from("dry_run_surveys").select("*").eq("dry_run_id", id).order("submitted_at", { ascending: false }),
    admin.from("dry_run_survey_reports").select("created_at, responses_count, content").eq("dry_run_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    getMailSettings(),
  ]);
  const guests = (guestsRows ?? []) as DryRunGuest[];
  const respuestas = (filas ?? []) as RespuestaEncuesta[];
  const rs = respuestas.map((r) => r.answers);
  const ia = ultimo?.content as InformeEncuesta | undefined;
  const clasif = new Map((ia?.respuestas ?? []).map((c) => [c.id, c]));
  const nuevas = ia ? respuestas.filter((r) => !clasif.has(r.id)).length : 0;

  const { data: correos } = guests.length
    ? await admin.from("dry_run_emails").select("guest_id, status, sent_at").eq("kind", "encuesta").in("guest_id", guests.map((g) => g.id))
    : { data: [] };
  const correoDe = new Map((correos ?? []).map((c) => [c.guest_id as string, c]));

  // ── Quién ha respondido y quién falta ──
  const respondio = new Set(respuestas.filter((r) => r.source === "encuesta" && r.guest_id).map((r) => r.guest_id as string));
  const conPlaza = guests.filter((g) => CON_PLAZA.includes(g.status) && g.status !== "no_asistio");
  const faltan = conPlaza.filter((g) => !respondio.has(g.id));
  // Los que confirmaron por WhatsApp y no llegaron a reservar con Google:
  // pueden haber venido por el enlace de Meet. También se les pide.
  const confirmadosSinPlaza = guests.filter((g) => !CON_PLAZA.includes(g.status) && (g.tracking === "confirmado" || g.tracking === "asistio") && !respondio.has(g.id));
  const fuera = respuestas.filter((r) => !r.guest_id);
  const cortas = respuestas.filter((r) => r.source === "formulario-corto").length;
  const pendientesCorreo = faltan.filter((g) => g.email && !g.unsubscribed_at).length;
  const yaEnviados = (correos ?? []).filter((c) => c.status === "enviado").length;

  const enlace = enlaceEncuesta(run);
  const mensaje = (nombre?: string | null) =>
    `¡Hola${nombre ? ` ${nombre.trim().split(/\s+/)[0]}` : ""}! Gracias otra vez por venir al dry run. ¿Nos regalas cinco minutos para contarnos qué te pareció? Casi todo es de un clic y lo que nos digas cambia el curso: ${enlace}\n\nEntra con la misma cuenta de Google con la que reservaste.`;
  const wa = (g: DryRunGuest) => {
    const tel = g.phone?.replace(/[^\d]/g, "");
    return tel && tel.length >= 8 ? `https://wa.me/${tel}?text=${encodeURIComponent(mensaje(g.full_name))}` : null;
  };

  // ── Indicadores ──
  const n = nps(rs);
  const pagaSi = rs.filter((r) => r.pagaria === "si").length;
  const conPaga = rs.filter((r) => r.pagaria !== undefined).length;
  const precios = rs.map((r) => r.precio_justo).filter((x): x is number => typeof x === "number");
  const medPrecio = mediana(precios);
  const mediaPrecio = precios.length ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length) : null;
  const rangoOpc = pregunta("rango");
  const opcionesRango = rangoOpc?.tipo === "una" ? rangoOpc.opciones : [];

  // ── Filtros de la lista ──
  const lista = respuestas.filter((r) => {
    const c = clasif.get(r.id);
    if (filtro.tema && !c?.temas.includes(filtro.tema)) return false;
    if (filtro.sent && c?.sentimiento !== filtro.sent) return false;
    if (filtro.grupo && grupoNps(r.answers.nps) !== filtro.grupo) return false;
    return true;
  });
  const conFiltro = Boolean(filtro.tema || filtro.sent || filtro.grupo);
  const urlFiltro = (cambio: Busqueda) => {
    const sp = new URLSearchParams();
    const f = { ...filtro, ...cambio };
    for (const [k, v] of Object.entries(f)) if (v) sp.set(k, v);
    const q = sp.toString();
    return `/admin/dry-run/${run.id}/encuesta${q ? `?${q}` : ""}#respuestas`;
  };
  const temasUsados = TEMAS.filter((t) => [...clasif.values()].some((c) => c.temas.includes(t.k)));
  const nombreDe = (r: RespuestaEncuesta) => r.full_name || r.email;
  const guestDe = new Map(guests.map((g) => [g.id, g]));

  return (
    <div className="axr-admin-page axr-admin-page--wide axr-dra axr-la axr-dre">
      <Link href={`/admin/dry-run/${run.id}`} className="axr-dra-back">
        ← {run.title}
      </Link>
      <div className="axr-admin-page__header">
        <div>
          <h1>Encuesta del dry run</h1>
          <p>
            {run.title} · {cuandoEs(run.starts_at, run.ends_at)}. Un solo enlace para todos: se responde entrando con Google y cada respuesta queda a nombre de
            esa cuenta.
          </p>
        </div>
        <div>
          <a href={enlace} target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost">
            <Icono n="enlace" /> Abrir la encuesta
          </a>
          <a href={`/admin/dry-run/${run.id}/encuesta/csv`} className="axr-btn axr-btn--ghost">
            <Icono n="descarga" /> Exportar CSV
          </a>
        </div>
      </div>

      {/* ── Mandarla ── */}
      <section className="axr-admin-card axr-dre-share">
        <div className="axr-dre-share__top">
          <div>
            <h2>Mandar la encuesta</h2>
            <p className="axr-la-muted">
              Han respondido <strong>{respondio.size}</strong> de <strong>{conPlaza.length}</strong> con plaza ({pct(respondio.size, conPlaza.length)} %)
              {fuera.length ? ` · ${fuera.length} fuera de la lista` : ""}
              {cortas ? ` · ${cortas} con el formulario corto de antes` : ""}.
            </p>
          </div>
          {correoListo(ajustes) ? (
            <BotonEnviarEncuesta runId={run.id} pendientes={pendientesCorreo} yaEnviados={yaEnviados} />
          ) : (
            <small className="axr-la-warn">El correo no está configurado: mándala por WhatsApp.</small>
          )}
        </div>
        <div className="axr-dre-link">
          <code>{enlace.replace(/^https:\/\//, "")}</code>
          <CopiarTexto texto={enlace} etiqueta="Copiar enlace" />
          <CopiarTexto texto={mensaje()} etiqueta="Copiar mensaje" />
        </div>

        {faltan.length || confirmadosSinPlaza.length ? (
          <details className="axr-dre-missing" open={faltan.length <= 15}>
            <summary>
              Faltan por responder: {faltan.length}
              {confirmadosSinPlaza.length ? ` (+ ${confirmadosSinPlaza.length} confirmados sin plaza en el campus)` : ""}
            </summary>
            <ul>
              {[...faltan, ...confirmadosSinPlaza].map((g) => {
                const c = correoDe.get(g.id);
                const w = wa(g);
                return (
                  <li key={g.id}>
                    <span>
                      <strong>{g.full_name || g.email || g.phone || idInvitado(g.seq)}</strong>
                      <small>
                        {idInvitado(g.seq)}
                        {g.email ? ` · ${g.email}` : ""}
                        {!CON_PLAZA.includes(g.status) ? " · sin plaza en el campus" : ""}
                        {c?.status === "enviado" && c.sent_at ? ` · correo enviado ${fecha(c.sent_at)}` : c ? ` · correo ${c.status}` : ""}
                      </small>
                    </span>
                    {w ? (
                      <a href={w} target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost axr-btn--small">
                        WhatsApp
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </details>
        ) : conPlaza.length ? (
          <p className="axr-dre-allin">
            <Icono n="ok" size={14} /> Han respondido todos los que tienen plaza.
          </p>
        ) : null}
      </section>

      {!respuestas.length ? (
        <section className="axr-admin-card axr-adm-empty">
          <Icono n="grafica" size={28} />
          <strong>Todavía no ha respondido nadie</strong>
          <span>En cuanto lleguen respuestas, aquí saldrán las gráficas, el precio y la lectura con IA.</span>
        </section>
      ) : (
        <>
          <section className="axr-la-gauges" aria-label="Indicadores">
            <Medidor titulo="Respuestas" valor={pct(respondio.size, conPlaza.length)} max={100} sufijo="%" bueno="alto" umbral={[40, 70]} ayuda={`${respondio.size} de ${conPlaza.length} invitados con plaza han respondido.`} />
            <Medidor titulo="NPS" valor={n.valor} min={-100} max={100} sufijo="" bueno="alto" umbral={[0, 30]} ayuda={`% de promotores (9–10) menos % de detractores (0–6). ${n.promotores} promotores, ${n.pasivos} pasivos, ${n.detractores} detractores.`} />
            <Medidor titulo="Nota de la clase" valor={media(rs, "global")} max={5} sufijo="/5" bueno="alto" umbral={[3, 4]} ayuda="Media de «¿Qué nota le pones a la clase en conjunto?»." />
            <Medidor titulo="Utilidad" valor={media(rs, "utilidad")} max={5} sufijo="/5" bueno="alto" umbral={[3, 4]} ayuda="Media de «¿Te sirve para tu trabajo o tu situación?»." />
            <Medidor titulo="Pagarían" valor={conPaga ? pct(pagaSi, conPaga) : null} max={100} sufijo="%" bueno="alto" umbral={[25, 50]} ayuda={`Contestan «Sí» a si pagarían el curso completo hoy (${pagaSi} de ${conPaga}).`} />
            <Medidor titulo="Docente" valor={media(rs, "docente")} max={5} sufijo="/5" bueno="alto" umbral={[3, 4]} ayuda="Media de «¿Cómo explicó el docente?»." />
          </section>

          {/* ── Precio ── */}
          <section className="axr-admin-card axr-dre-price">
            <h2>El precio</h2>
            <div className="axr-dre-price__grid">
              <div className="axr-dre-price__nums">
                <div>
                  <span>Precio justo (mediana)</span>
                  <strong>{medPrecio === null ? "—" : `${medPrecio.toLocaleString("es-ES")} €`}</strong>
                  <small>
                    {precios.length
                      ? `media ${mediaPrecio?.toLocaleString("es-ES")} € · de ${Math.min(...precios).toLocaleString("es-ES")} a ${Math.max(...precios).toLocaleString("es-ES")} € · ${precios.length} ${precios.length === 1 ? "cifra" : "cifras"}`
                      : "nadie ha escrito una cifra todavía"}
                  </small>
                </div>
                <div>
                  <span>¿Lo pagarían hoy?</span>
                  <strong>
                    {pagaSi} / {rs.filter((r) => r.pagaria === "quiza").length} / {rs.filter((r) => r.pagaria === "no").length}
                  </strong>
                  <small>sí / quizá / no</small>
                </div>
              </div>
              <div className="axr-com-scroll">
                <table className="axr-admin-table axr-dre-cross">
                  <thead>
                    <tr>
                      <th>Cuánto pagarían</th>
                      <th>Total</th>
                      <th>Sí</th>
                      <th>Quizá</th>
                      <th>No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opcionesRango.map((o) => {
                      const suyos = rs.filter((r) => r.rango === o.k);
                      return (
                        <tr key={o.k}>
                          <td>{o.t}</td>
                          <td>
                            <Bar v={suyos.length} max={Math.max(1, rs.filter((r) => r.rango).length)} texto={String(suyos.length)} tip={`${suyos.length} respuestas`} />
                          </td>
                          <td className="is-num">{suyos.filter((r) => r.pagaria === "si").length}</td>
                          <td className="is-num">{suyos.filter((r) => r.pagaria === "quiza").length}</td>
                          <td className="is-num">{suyos.filter((r) => r.pagaria === "no").length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── IA ── */}
          <section className="axr-admin-card axr-la-ai">
            <div className="axr-la-ai__head">
              <div>
                <span className="axr-la-kicker">
                  <Icono n="chispa" size={14} /> Lectura con IA
                </span>
                <h2>Qué sacamos del feedback</h2>
                <p className="axr-la-muted">
                  La IA lee todas las respuestas (sin nombres ni correos), clasifica cada una por tema, tono e intención de compra y saca qué mejorar primero.
                  {ultimo
                    ? ` Último análisis: ${fecha(ultimo.created_at as string)}, con ${ultimo.responses_count} respuestas${nuevas > 0 ? ` (hay ${nuevas} ${nuevas === 1 ? "nueva" : "nuevas"} sin analizar)` : ""}.`
                    : ""}
                </p>
              </div>
              <BotonAnalizarEncuesta
                runId={run.id}
                hayAnterior={Boolean(ia)}
                deshabilitado={respuestas.length < 2 ? `Hacen falta 2 respuestas (hay ${respuestas.length}).` : undefined}
              />
            </div>

            {ia ? (
              <div className="axr-la-ai__body">
                <p className="axr-la-ai__sum">
                  {ia.resumen}{" "}
                  <span className={`axr-adm-pill axr-adm-pill--${ia.confianza === "alta" ? "ok" : ia.confianza === "media" ? "info" : "warn"}`}>Confianza {ia.confianza}</span>
                </p>
                <div className="axr-la-ai__grid">
                  <div className="axr-la-ai__box is-target">
                    <h3>Qué mejorar primero</h3>
                    <ol>
                      {ia.mejoras.map((m) => (
                        <li key={m.titulo}>
                          <strong>{m.titulo}</strong>{" "}
                          <span className={`axr-dre-chip is-${m.prioridad === "alta" ? "bad" : m.prioridad === "media" ? "warn" : "neutral"}`}>Prioridad {m.prioridad}</span>{" "}
                          <span className="axr-dre-chip">{textoTema(m.tema)}</span>
                          <p>{m.detalle}</p>
                          {m.n ? <small>Lo mencionan {m.n} {m.n === 1 ? "respuesta" : "respuestas"}</small> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Lo que funciona</h3>
                    <ul>
                      {ia.fortalezas.map((f) => (
                        <li key={f.titulo}>
                          <strong>{f.titulo}</strong>
                          <p>{f.detalle}</p>
                          {f.n ? <small>{f.n} {f.n === 1 ? "respuesta" : "respuestas"}</small> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Qué frena la compra</h3>
                    <ul>
                      {ia.objeciones.map((o) => (
                        <li key={o.titulo}>
                          <strong>{o.titulo}</strong>
                          <p>{o.detalle}</p>
                          {o.n ? <small>{o.n} {o.n === 1 ? "respuesta" : "respuestas"}</small> : null}
                        </li>
                      ))}
                    </ul>
                    {ia.precio.lectura ? (
                      <>
                        <h4>El precio</h4>
                        <p>{ia.precio.lectura}</p>
                        {ia.precio.recomendacion ? (
                          <p>
                            <strong>Qué haría:</strong> {ia.precio.recomendacion}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                  <div className="axr-la-ai__box">
                    <h3>Temas</h3>
                    <ul className="axr-dre-themes">
                      {ia.temas.map((t) => (
                        <li key={t.tema}>
                          <Link href={urlFiltro({ tema: t.tema })} className={`axr-dre-chip is-${tonoSent(t.sentimiento)}`}>
                            {textoTema(t.tema)} · {t.n}
                          </Link>
                          <span>{t.lectura}</span>
                        </li>
                      ))}
                    </ul>
                    {ia.testimonios.length ? (
                      <>
                        <h4>Frases para testimonios</h4>
                        <ul className="axr-la-ads">
                          {ia.testimonios.map((t) => {
                            const r = respuestas.find((x) => x.id === t.id);
                            return (
                              <li key={t.id}>
                                <small>{r?.answers.testimonio === "si_nombre" ? nombreDe(r) : "Sin nombre (lo ha pedido así)"}</small>
                                <q>{t.cita}</q>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {/* ── Reparto ── */}
          {BLOQUES.map((b) => {
            const cerradas = b.preguntas.filter((p) => p.tipo !== "abierta" && p.tipo !== "numero" && p.k !== "testimonio");
            if (!cerradas.length) return null;
            return (
              <div key={b.k}>
                <h2 className="axr-la-sec">{b.titulo}</h2>
                <div className="axr-la-dists">
                  {cerradas.map((p) => (
                    <Reparto key={p.k} k={p.k} rs={rs} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── Respuestas ── */}
          <section className="axr-admin-card axr-dre-list" id="respuestas">
            <div className="axr-dre-list__head">
              <h2>
                Respuestas una a una <span className="axr-adm-pill">{lista.length}</span>
              </h2>
              <div className="axr-dre-filters">
                {(["promotor", "pasivo", "detractor"] as const).map((g) => (
                  <Link key={g} href={urlFiltro({ grupo: filtro.grupo === g ? undefined : g })} className={`axr-dre-chip${filtro.grupo === g ? " is-on" : ""}`}>
                    {g === "promotor" ? "Promotores 9–10" : g === "pasivo" ? "Pasivos 7–8" : "Detractores 0–6"}
                  </Link>
                ))}
                {ia
                  ? (["positivo", "mixto", "negativo"] as const).map((s) => (
                      <Link key={s} href={urlFiltro({ sent: filtro.sent === s ? undefined : s })} className={`axr-dre-chip is-${tonoSent(s)}${filtro.sent === s ? " is-on" : ""}`}>
                        {SENT[s]}
                      </Link>
                    ))
                  : null}
                {temasUsados.map((t) => (
                  <Link key={t.k} href={urlFiltro({ tema: filtro.tema === t.k ? undefined : t.k })} className={`axr-dre-chip${filtro.tema === t.k ? " is-on" : ""}`}>
                    {t.t}
                  </Link>
                ))}
                {conFiltro ? (
                  <Link href={`/admin/dry-run/${run.id}/encuesta#respuestas`} className="axr-dre-clear">
                    Quitar filtros
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="axr-dre-cards">
              {lista.map((r) => {
                const c = clasif.get(r.id);
                const g = r.guest_id ? guestDe.get(r.guest_id) : undefined;
                const a = r.answers;
                const abiertas = BLOQUES.flatMap((b) => b.preguntas).filter((p) => p.tipo === "abierta" && typeof a[p.k] === "string");
                return (
                  <article key={r.id} className="axr-dre-card">
                    <header>
                      <div>
                        <strong>{nombreDe(r)}</strong>
                        <small>
                          {r.email}
                          {g ? ` · ${idInvitado(g.seq)}` : ""} · {fecha(r.updated_at)}
                        </small>
                      </div>
                      <div className="axr-dre-card__tags">
                        {typeof a.nps === "number" ? (
                          <span className={`axr-dre-chip is-${grupoNps(a.nps) === "promotor" ? "ok" : grupoNps(a.nps) === "pasivo" ? "warn" : "bad"}`}>NPS {a.nps}</span>
                        ) : null}
                        {!r.guest_id ? <span className="axr-dre-chip is-warn">Fuera de la lista</span> : null}
                        {r.source === "formulario-corto" ? <span className="axr-dre-chip">Formulario corto</span> : null}
                      </div>
                    </header>

                    <p className="axr-dre-card__facts">
                      {a.global !== undefined ? <span>Clase {valorLegible("global", a.global)}</span> : null}
                      {a.pagaria !== undefined ? <span>Pagaría: {textoOpcion("pagaria", String(a.pagaria))}</span> : null}
                      {a.rango !== undefined ? <span>{textoOpcion("rango", String(a.rango))}</span> : null}
                      {typeof a.precio_justo === "number" ? <span>Precio justo {a.precio_justo.toLocaleString("es-ES")} €</span> : null}
                      {a.testimonio === "si_nombre" || a.testimonio === "si_anonimo" ? <span>Testimonio: {textoOpcion("testimonio", String(a.testimonio))}</span> : null}
                    </p>

                    {c ? (
                      <div className="axr-dre-card__ai">
                        <span className={`axr-dre-chip is-${tonoSent(c.sentimiento)}`}>{SENT[c.sentimiento]}</span>
                        <span className={`axr-dre-chip is-${tonoNivel(c.intencion, "ok")}`}>Intención de compra {c.intencion}</span>
                        {c.temas.map((t) => (
                          <span key={t} className="axr-dre-chip">
                            {textoTema(t)}
                          </span>
                        ))}
                        {c.resumen ? <p>{c.resumen}</p> : null}
                      </div>
                    ) : ia ? (
                      <p className="axr-la-muted">Sin analizar todavía: vuelve a pasar la IA.</p>
                    ) : null}

                    {abiertas.length ? (
                      <dl className="axr-dre-card__open">
                        {abiertas.map((p) => (
                          <div key={p.k}>
                            <dt>{p.titulo}</dt>
                            <dd>{String(a[p.k])}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    <details className="axr-dre-card__all">
                      <summary>Todas las respuestas</summary>
                      <dl>
                        {BLOQUES.flatMap((b) => b.preguntas)
                          .filter((p) => p.tipo !== "abierta" && a[p.k] !== undefined)
                          .map((p) => (
                            <div key={p.k}>
                              <dt>{p.titulo}</dt>
                              <dd>{valorLegible(p.k, a[p.k])}</dd>
                            </div>
                          ))}
                      </dl>
                    </details>
                  </article>
                );
              })}
              {!lista.length ? <p className="axr-la-muted">Ninguna respuesta con estos filtros.</p> : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
