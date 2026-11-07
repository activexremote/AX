import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { FormSesion } from "@/components/admin/dry-run/form-sesion";
import { BotonEnlace, BotonPrueba, BotonProcesar, Copiar, FormEnlace, FormInvitar } from "@/components/admin/dry-run/piezas";
import { EditorMensaje, TablaInvitados, type FilaInvitado } from "@/components/admin/dry-run/tabla-invitados";
import { urlDeEnlace, valoresDe } from "@/components/admin/dry-run/valores";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { correoListo, getMailSettings } from "@/lib/correo/envio";
import { PASOS } from "@/lib/dry-run/preparacion";
import { SECUENCIA } from "@/lib/dry-run/secuencia";
import { docenteDe } from "@/lib/dry-run/docente";
import { cuandoEs, diaLargo, fechaYHora, horaMadrid } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, idInvitado, type DryRun, type DryRunEmail, type DryRunGuest, type DryRunLink, type Feedback } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { drCopy, rellenar } from "@/lib/i18n/dry-run";
import { getI18n } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/ia/ia.scss";
import "@/app/admin/dry-run/dry-run.scss";

// ══════════════════════════════════════════════════════════
//  Un dry run: el resumen, la tabla de invitados con su enlace personal y su
//  conversión, los enlaces públicos con UTM, la invitación por correo, la
//  secuencia de correos, el feedback y la configuración de la sesión
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
  const prepMedia = media(conPlaza.map((g) => PASOS.filter((p) => g.onboarding?.[p.key]).length / PASOS.length));
  const feedbacks = guests.filter((g) => g.feedback_at && g.feedback).map((g) => ({ g, f: g.feedback as Feedback }));
  const nps = feedbacks.length
    ? Math.round(((feedbacks.filter((x) => x.f.nps >= 9).length - feedbacks.filter((x) => x.f.nps <= 6).length) / feedbacks.length) * 100)
    : null;

  const modulo = (modulos ?? []).find((m) => m.id === run.module_id);
  const filas: FilaInvitado[] = [...guests]
    .sort((a, b) => a.seq - b.seq)
    .map((g) => ({
      ...g,
      prep: CON_PLAZA.includes(g.status) ? PASOS.filter((p) => g.onboarding?.[p.key]).length : null,
      nps: g.feedback ? (g.feedback as Feedback).nps : null,
    }));
  const datosMensaje = {
    slug: run.slug,
    fecha: diaLargo(run.starts_at),
    horario: `${horaMadrid(run.starts_at)}–${horaMadrid(run.ends_at)}`,
    docente: docenteDe(run.teacher_name)?.name ?? run.teacher_name,
    modulo: modulo?.title ?? run.title,
  };

  // El resumen de la hoja y el embudo de los enlaces personales.
  const n = (fn: (g: DryRunGuest) => boolean) => guests.filter(fn).length;
  const confirmados = n((g) => g.tracking === "confirmado" || g.tracking === "asistio" || g.tracking === "no_asistio");
  const tienePlaza = (g: DryRunGuest) => Boolean(g.user_id && g.registered_at && g.status !== "baja");
  const enviada = (g: DryRunGuest) => Boolean(g.shared_at || g.visits > 0 || tienePlaza(g));
  const abierta = (g: DryRunGuest) => g.visits > 0 || tienePlaza(g);
  const embudo = [
    { label: copy.t.steps.shared, v: n(enviada), de: guests.length },
    { label: copy.t.steps.opened, v: n(abierta), de: n(enviada) },
    { label: copy.t.steps.seat, v: n(tienePlaza), de: n(abierta) },
    { label: copy.t.steps.prep, v: n((g) => tienePlaza(g) && PASOS.every((p) => g.onboarding?.[p.key])), de: n(tienePlaza) },
    { label: copy.t.steps.feedback, v: feedbacks.length, de: n(tienePlaza) },
  ];
  const yo = profile.full_name?.trim().split(/\s+/)[0] ?? "";
  const porInvitador = [...new Set(guests.map((g) => g.inviter?.trim() || ""))]
    .sort((a, b) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b, "es")))
    .map((quien) => {
      const suyos = guests.filter((g) => (g.inviter?.trim() || "") === quien);
      const m = (fn: (g: DryRunGuest) => boolean) => suyos.filter(fn).length;
      return {
        quien: quien || copy.t.noInviter,
        total: suyos.length,
        enviadas: m(enviada),
        abiertas: m(abierta),
        plaza: m(tienePlaza),
        confirmados: m((g) => g.tracking === "confirmado" || g.tracking === "asistio" || g.tracking === "no_asistio"),
      };
    });

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
        {[
          { icono: "usuarios", label: copy.t.sum.total, v: guests.length, hint: run.capacity ? `${conPlaza.length} / ${run.capacity} ${copy.seats}` : `${conPlaza.length} ${copy.registered.toLowerCase()}` },
          { icono: "ok", label: copy.t.sum.confirmed, v: confirmados, hint: `${copy.t.sum.rate}: ${pct(confirmados, guests.length)}` },
          { icono: "reloj", label: copy.t.sum.pending, v: n((g) => g.tracking === "pendiente"), hint: `${invitadosPendientes} ${copy.invitedPending.toLowerCase()}` },
          { icono: "birrete", label: copy.t.sum.attended, v: n((g) => g.tracking === "asistio"), hint: nps === null ? "—" : rellenar(copy.nps, { n: nps }) },
          { icono: "cerrar", label: copy.t.sum.rejected, v: n((g) => g.tracking === "rechazado"), hint: `${prepMedia === null ? "—" : `${Math.round(prepMedia * 100)} %`} ${copy.prep.toLowerCase()}` },
        ].map((s) => (
          <div key={s.label} className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n={s.icono as "usuarios"} /> {s.label}
            </span>
            <span className="axr-adm-stat__value">{s.v}</span>
            <span className="axr-adm-stat__hint">{s.hint}</span>
          </div>
        ))}
      </div>

      {!listo ? (
        <p className="axr-adm-note axr-adm-note--warn">
          {copy.eNoMail} <Link href="/admin/dry-run">→</Link>
        </p>
      ) : null}

      {/* ── Invitados ── */}
      <section className="axr-admin-card axr-admin-card--flush axr-dri-card">
        <div className="axr-dri-card__head">
          <h2>
            {copy.t.title} <span className="axr-adm-pill">{guests.length}</span>
          </h2>
          <p className="axr-dra-lead">{copy.t.lead}</p>

          <div className="axr-dri-summary">
            <div className="axr-dri-funnelbar" aria-label={copy.t.funnelTitle}>
              <h3>{copy.t.funnelTitle}</h3>
              <ol>
                {embudo.map((e, i) => (
                  <li key={e.label}>
                    <span className="axr-dri-funnelbar__n">{e.v}</span>
                    <span className="axr-dri-funnelbar__label">{e.label}</span>
                    <span className="axr-dri-funnelbar__bar">
                      <span style={{ width: `${guests.length ? Math.round((e.v / guests.length) * 100) : 0}%` }} />
                    </span>
                    <small>{i === 0 ? pct(e.v, e.de) : `${pct(e.v, e.de)} ${copy.t.funnelOf}`}</small>
                  </li>
                ))}
              </ol>
            </div>
            <div className="axr-dri-byinv">
              <h3>{copy.t.byInviter}</h3>
              <table>
                <thead>
                  <tr>
                    <th>{copy.t.biCols.who}</th>
                    <th>{copy.t.biCols.n}</th>
                    <th>{copy.t.biCols.sent}</th>
                    <th>{copy.t.biCols.opened}</th>
                    <th>{copy.t.biCols.seat}</th>
                    <th>{copy.t.biCols.confirmed}</th>
                  </tr>
                </thead>
                <tbody>
                  {porInvitador.map((p) => (
                    <tr key={p.quien}>
                      <td>{p.quien}</td>
                      <td>{p.total}</td>
                      <td>{p.enviadas}</td>
                      <td>{p.abiertas}</td>
                      <td>{p.plaza}</td>
                      <td>{p.confirmados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <EditorMensaje runId={run.id} plantilla={run.invite_message} datos={datosMensaje} ejemplo={filas[0] ?? null} t={copy.t} />
        </div>
        <TablaInvitados runId={run.id} filas={filas} datos={datosMensaje} plantilla={run.invite_message} pasos={PASOS.length} yo={yo} t={copy.t} />
      </section>

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
        <FormEnlace
          runId={run.id}
          slug={run.slug}
          campana={run.slug.replace(/-/g, "_")}
          persona={profile.full_name?.trim().split(/\s+/)[0] ?? ""}
          // Quien ya comparte enlaces: lo que va tras el último « · » del nombre
          // («LinkedIn · publicación · Oriol»), si es un nombre y no el formato.
          personas={[
            ...new Set(
              links
                .map((l) => l.label.split(" · "))
                .filter((partes) => partes.length >= 2 && /^\p{Lu}/u.test(partes.at(-1) ?? ""))
                .map((partes) => partes.at(-1) as string),
            ),
          ]}
          existentes={links.map((l) => ({ source: l.utm_source, medium: l.utm_medium, content: l.utm_content }))}
          copy={copy}
        />
      </section>

      {/* ── Invitar ── */}
      <section className="axr-admin-card">
        <h2>{copy.inviteTitle}</h2>
        <p className="axr-dra-lead">{copy.inviteLead}</p>
        <FormInvitar runId={run.id} enlaces={links.filter((l) => l.active).map((l) => ({ id: l.id, label: l.label }))} copy={copy} />
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
                    <strong>{g.full_name || g.email || idInvitado(g.seq)}</strong>
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
