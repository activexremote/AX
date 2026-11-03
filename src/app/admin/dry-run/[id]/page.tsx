import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { FormSesion } from "@/components/admin/dry-run/form-sesion";
import { AccionesPersona, BotonEnlace, BotonPrueba, BotonProcesar, Copiar, FormEnlace, FormInvitar } from "@/components/admin/dry-run/piezas";
import { urlDeEnlace, valoresDe } from "@/components/admin/dry-run/valores";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { correoListo, getMailSettings } from "@/lib/correo/envio";
import { PASOS } from "@/lib/dry-run/preparacion";
import { SECUENCIA } from "@/lib/dry-run/secuencia";
import { cuandoEs, fechaYHora } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, type DryRun, type DryRunEmail, type DryRunGuest, type DryRunLink, type Feedback } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { drCopy, rellenar } from "@/lib/i18n/dry-run";
import { getI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/ia/ia.scss";
import "@/app/admin/dry-run/dry-run.scss";

// ══════════════════════════════════════════════════════════
//  Un dry run: cifras, enlaces con UTM, invitaciones, personas, correos,
//  feedback y la configuración de la sesión
// ══════════════════════════════════════════════════════════

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "—");

export default async function DryRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const admin = createAdminClient();
  const { data: runRow } = await admin.from("dry_runs").select("*").eq("id", id).maybeSingle();
  if (!runRow) notFound();
  const run = runRow as DryRun;

  const [{ locale }, { data: modulos }, { data: linksRows }, { data: guestsRows }, ajustes] = await Promise.all([
    getI18n(),
    admin.from("modules").select("id, title, course, order_index").order("course").order("order_index"),
    admin.from("dry_run_links").select("*").eq("dry_run_id", id).order("created_at"),
    admin.from("dry_run_guests").select("*").eq("dry_run_id", id).order("created_at", { ascending: false }),
    getMailSettings(),
  ]);
  const copy = drCopy[locale];
  const links = (linksRows ?? []) as DryRunLink[];
  const guests = (guestsRows ?? []) as DryRunGuest[];
  const { data: emailsRows } = guests.length
    ? await admin.from("dry_run_emails").select("guest_id, kind, status, send_at, sent_at, error").in("guest_id", guests.map((g) => g.id))
    : { data: [] };
  const emails = (emailsRows ?? []) as Pick<DryRunEmail, "guest_id" | "kind" | "status" | "send_at" | "sent_at" | "error">[];

  const conPlaza = guests.filter((g) => CON_PLAZA.includes(g.status));
  const invitadosPendientes = guests.filter((g) => g.status === "invitado").length;
  const visitas = links.reduce((a, l) => a + l.visits, 0);
  const prepMedia = media(conPlaza.map((g) => PASOS.filter((p) => g.onboarding?.[p.key]).length / PASOS.length));
  const feedbacks = guests.filter((g) => g.feedback_at && g.feedback).map((g) => ({ g, f: g.feedback as Feedback }));
  const nps = feedbacks.length
    ? Math.round(((feedbacks.filter((x) => x.f.nps >= 9).length - feedbacks.filter((x) => x.f.nps <= 6).length) / feedbacks.length) * 100)
    : null;

  const linkDe = new Map(links.map((l) => [l.id, l]));
  const correosDe = (guestId: string) => emails.filter((e) => e.guest_id === guestId);
  const publica = `${SITE_URL}/dry-run/${run.slug}`;
  const listo = correoListo(ajustes);
  const opciones = (modulos ?? []).map((m) => ({ id: m.id, label: `${m.course} · ${m.order_index} · ${m.title}` }));

  return (
    <div className="axr-admin-page axr-dra">
      <Link href="/admin/dry-run" className="axr-dra-back">
        ← {copy.back}
      </Link>
      <div className="axr-admin-page__header">
        <div>
          <h1>{run.title}</h1>
          <p>
            {cuandoEs(run.starts_at, run.ends_at)} · {run.teacher_name}
          </p>
        </div>
        <div>
          <a href={publica} target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost">
            <Icono n="enlace" /> {copy.publicPage}
          </a>
          <a href={`/admin/dry-run/${run.id}/csv`} className="axr-btn axr-btn--ghost">
            <Icono n="descarga" /> {copy.exportCsv}
          </a>
        </div>
      </div>

      <div className="axr-adm-stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="enlace" /> {copy.visits}
          </span>
          <span className="axr-adm-stat__value">{visitas}</span>
          <span className="axr-adm-stat__hint">{links.length} enlaces</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="usuarios" /> {copy.registered}
          </span>
          <span className="axr-adm-stat__value">
            {conPlaza.length}
            {run.capacity ? <small> / {run.capacity}</small> : null}
          </span>
          <span className="axr-adm-stat__hint">
            {copy.lConv}: {pct(conPlaza.filter((g) => g.link_id).length, visitas)}
          </span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="reloj" /> {copy.invitedPending}
          </span>
          <span className="axr-adm-stat__value">{invitadosPendientes}</span>
          <span className="axr-adm-stat__hint">{guests.length} en total</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="lista" /> {copy.prep}
          </span>
          <span className="axr-adm-stat__value">{prepMedia === null ? "—" : `${Math.round(prepMedia * 100)} %`}</span>
          <span className="axr-adm-stat__hint">{PASOS.length} pasos</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="chat" /> {copy.feedback}
          </span>
          <span className="axr-adm-stat__value">{feedbacks.length}</span>
          <span className="axr-adm-stat__hint">{nps === null ? "—" : rellenar(copy.nps, { n: nps })}</span>
        </div>
      </div>

      {!listo ? (
        <p className="axr-adm-note axr-adm-note--warn">
          {copy.eNoMail} <Link href="/admin/dry-run">→</Link>
        </p>
      ) : null}

      {/* ── Enlaces ── */}
      <section className="axr-admin-card">
        <h2>{copy.linksTitle}</h2>
        <p className="axr-dra-lead">{copy.linksLead}</p>
        {links.length ? (
          <div className="axr-admin-scroll axr-dra-table">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{copy.lLabel}</th>
                  <th>UTM</th>
                  <th>{copy.visits}</th>
                  <th>{copy.registered}</th>
                  <th>{copy.lConv}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {links.map((l) => {
                  const url = urlDeEnlace(run.slug, l);
                  const registros = conPlaza.filter((g) => g.link_id === l.id).length;
                  return (
                    <tr key={l.id} className={l.active ? undefined : "is-off"}>
                      <td>
                        <strong>{l.label}</strong>
                        <code className="axr-dra-url">{url.replace(/^https:\/\//, "")}</code>
                      </td>
                      <td className="axr-dra-utm">
                        {l.utm_source} / {l.utm_medium}
                        <small>
                          {l.utm_campaign}
                          {l.utm_content ? ` · ${l.utm_content}` : ""}
                          {l.utm_term ? ` · ${l.utm_term}` : ""}
                        </small>
                      </td>
                      <td>{l.visits}</td>
                      <td>{registros}</td>
                      <td>{pct(registros, l.visits)}</td>
                      <td>
                        <div className="axr-admin-table__actions">
                          <Copiar texto={url} copy={copy} />
                          <BotonEnlace runId={run.id} linkId={l.id} active={l.active} copy={copy} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="axr-dra-lead">{copy.lNone}</p>
        )}
        <FormEnlace runId={run.id} campana={run.slug.replace(/-/g, "_")} copy={copy} />
      </section>

      {/* ── Invitar ── */}
      <section className="axr-admin-card">
        <h2>{copy.inviteTitle}</h2>
        <p className="axr-dra-lead">{copy.inviteLead}</p>
        <FormInvitar runId={run.id} enlaces={links.filter((l) => l.active).map((l) => ({ id: l.id, label: l.label }))} copy={copy} />
      </section>

      {/* ── Personas ── */}
      <section className="axr-admin-card axr-admin-card--flush">
        <h2 className="axr-dra-flush-title">
          {copy.peopleTitle} <span className="axr-adm-pill">{guests.length}</span>
        </h2>
        {guests.length ? (
          <div className="axr-admin-scroll">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{copy.pName}</th>
                  <th>{copy.pOrigin}</th>
                  <th>{copy.pStatus}</th>
                  <th>{copy.pPrep}</th>
                  <th>{copy.pFeedback}</th>
                  <th>{copy.pEmails}</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => {
                  const suyos = correosDe(g.id);
                  const enviados = suyos.filter((e) => e.status === "enviado").length;
                  const enCola = suyos.filter((e) => e.status === "pendiente" || e.status === "enviando").length;
                  const fallidos = suyos.filter((e) => e.status === "error");
                  const link = g.link_id ? linkDe.get(g.link_id) : null;
                  return (
                    <tr key={g.id}>
                      <td>
                        <strong>{g.full_name || g.email.split("@")[0]}</strong>
                        <small className="axr-dra-sub">
                          {g.email}
                          {g.unsubscribed_at ? ` · ${copy.unsubscribed}` : ""}
                        </small>
                      </td>
                      <td>
                        {link ? link.label : g.utm?.source ? `${g.utm.source} / ${g.utm.medium ?? "—"}` : g.invited_at ? "Invitación" : "Directo"}
                        <small className="axr-dra-sub">{fechaYHora(g.registered_at ?? g.invited_at ?? g.created_at)}</small>
                      </td>
                      <td>
                        <AccionesPersona guestId={g.id} status={g.status} conCuenta={Boolean(g.user_id)} copy={copy} />
                      </td>
                      <td>{CON_PLAZA.includes(g.status) ? `${PASOS.filter((p) => g.onboarding?.[p.key]).length}/${PASOS.length}` : "—"}</td>
                      <td>{g.feedback ? `${(g.feedback as Feedback).nps}/10` : "—"}</td>
                      <td>
                        {enviados} · {enCola}
                        {fallidos.length ? (
                          <small className="axr-dra-sub axr-dra-bad" title={fallidos.map((f) => f.error).join("\n")}>
                            {fallidos.length} error
                          </small>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="axr-dra-lead axr-dra-pad">{copy.pNone}</p>
        )}
      </section>

      {/* ── Correos ── */}
      <section className="axr-admin-card">
        <div className="axr-dra-head">
          <div>
            <h2>{copy.emailsTitle}</h2>
            <p className="axr-dra-lead">{copy.emailsLead}</p>
          </div>
          <BotonProcesar runId={run.id} copy={copy} />
        </div>
        <div className="axr-admin-scroll">
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{copy.eName}</th>
                <th>{copy.eWhen}</th>
                <th>{copy.eDate}</th>
                <th>{copy.eCounts}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {SECUENCIA.map((p) => {
                const suyos = emails.filter((e) => e.kind === p.kind);
                const n = (s: string[]) => suyos.filter((e) => s.includes(e.status)).length;
                const fija = p.kind === "invitacion" || p.kind === "bienvenida" || p.kind === "tour" ? null : p.hora(run, { invited_at: null, registered_at: null });
                return (
                  <tr key={p.kind}>
                    <td>
                      <strong>{p.nombre}</strong>
                      <small className="axr-dra-sub">{p.para === "invitados" ? copy.eForInvited : copy.eForRegistered}</small>
                    </td>
                    <td>{p.cuando}</td>
                    <td>{fija ? fechaYHora(fija) : "—"}</td>
                    <td>
                      {n(["enviado"])} · {n(["pendiente", "enviando"])} · {n(["omitido", "cancelado"])} · {n(["error"])}
                    </td>
                    <td>
                      <div className="axr-admin-table__actions">
                        <a href={`/admin/dry-run/${run.id}/correo/${p.kind}`} target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost axr-btn--small">
                          {copy.ePreview}
                        </a>
                        <BotonPrueba runId={run.id} kind={p.kind} copy={copy} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className="axr-admin-card">
        <h2>{copy.fbTitle}</h2>
        {feedbacks.length ? (
          <>
            <div className="axr-dra-fb-avg">
              {(["clase", "ritmo", "contenido", "docente", "campus"] as const).map((k) => {
                const m = media(feedbacks.map((x) => x.f[k]).filter((v): v is number => typeof v === "number"));
                return (
                  <div key={k}>
                    <span>{copy.fbAspects[k]}</span>
                    <strong>{m === null ? "—" : m.toFixed(1)}</strong>
                    <small>/ 5</small>
                  </div>
                );
              })}
              <div>
                <span>{copy.fbWould}</span>
                <strong>
                  {feedbacks.filter((x) => x.f.pagaria === "si").length}/{feedbacks.filter((x) => x.f.pagaria === "quiza").length}/
                  {feedbacks.filter((x) => x.f.pagaria === "no").length}
                </strong>
                <small>
                  {copy.fbYes}/{copy.fbMaybe}/{copy.fbNo}
                </small>
              </div>
            </div>
            <div className="axr-dra-fb-list">
              {feedbacks.map(({ g, f }) => (
                <article key={g.id}>
                  <header>
                    <strong>{g.full_name || g.email}</strong>
                    <span className="axr-adm-pill axr-adm-pill--accent">{f.nps}/10</span>
                  </header>
                  {f.gusto ? (
                    <p>
                      <b>{copy.fbLiked}:</b> {f.gusto}
                    </p>
                  ) : null}
                  {f.cambiaria ? (
                    <p>
                      <b>{copy.fbChange}:</b> {f.cambiaria}
                    </p>
                  ) : null}
                  {f.comentario ? (
                    <p>
                      <b>{copy.fbOther}:</b> {f.comentario}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="axr-dra-lead">{copy.fbNone}</p>
        )}
      </section>

      {/* ── Configuración ── */}
      <section className="axr-admin-card">
        <h2>{copy.sessionTitle}</h2>
        <FormSesion id={run.id} valores={valoresDe(run)} modulos={opciones} copy={copy} />
      </section>
    </div>
  );
}
