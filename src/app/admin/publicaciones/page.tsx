import Link from "next/link";

import { RellenarHuecos } from "@/components/admin/publicaciones/rellenar-huecos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { duracion, ZONA } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import { cargarPanel } from "@/lib/social/panel";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost } from "@/lib/supabase/types";

/** La barra de cobertura llega a tope a los 90 días: más allá, ya no preocupa. */
const ESCALA = 90;

export default async function PublicacionesPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const panel = await cargarPanel(locale);
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("social_posts")
    .select("id, title, language, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const lista = (posts ?? []) as Pick<SocialPost, "id" | "title" | "language" | "created_at">[];

  const fecha = (iso: string, estilo: "corta" | "dia" = "corta") =>
    new Date(iso).toLocaleString(locale, {
      timeZone: ZONA,
      ...(estilo === "corta" ? { dateStyle: "short", timeStyle: "short" } : { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    });
  const dia = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "long" });

  const porPost = new Map<string, typeof panel.variantes>();
  for (const v of panel.variantes) porPost.set(v.post_id, [...(porPost.get(v.post_id) ?? []), v]);

  const ahora = Date.now();
  const semana = panel.variantes.filter(
    (v) => v.status === "programado" && v.scheduled_at && Date.parse(v.scheduled_at) - ahora < 7 * 86_400_000,
  );
  const porRevisar = panel.variantes.filter((v) => v.status === "borrador");
  const siguiente = panel.pasos.findIndex((p) => !p.hecho);
  const { settings } = panel;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
      </div>

      {/* ── Primeros pasos: hasta que estén todos hechos ── */}
      {siguiente >= 0 ? (
        <div className="axr-admin-card">
          <h2>{copy.stepsTitle}</h2>
          <p className="axr-pub-lead">{copy.stepsLead}</p>
          <ol className="axr-pub-steps">
            {panel.pasos.map((p, i) => (
              <li key={p.titulo} className={p.hecho ? "is-done" : i === siguiente ? "is-next" : ""}>
                <span className="axr-pub-steps__n">{p.hecho ? "✓" : i + 1}</span>
                <div>
                  <strong>{p.titulo}</strong>
                  <p>{p.texto}</p>
                  {p.hecho ? (
                    <span className="axr-pub-steps__done">{copy.stepDone}</span>
                  ) : (
                    <Link href={p.href} className={`axr-btn${i === siguiente ? "" : " axr-btn--ghost"}`}>
                      {i === siguiente ? `${copy.stepNext}: ${p.boton}` : p.boton}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* ── Alertas ── */}
      <div className="axr-admin-card">
        <h2>{copy.alertsTitle}</h2>
        {panel.alertas.length === 0 ? (
          <p className="axr-pub-alert axr-pub-alert--ok">✓ {copy.alertsNone}</p>
        ) : (
          <div className="axr-pub-alerts">
            {panel.alertas.map((a, i) => (
              <div key={i} className={`axr-pub-alert axr-pub-alert--${a.nivel}`}>
                <span>
                  {a.nivel === "error" ? "✕ " : "! "}
                  {a.texto}
                </span>
                {a.accion ? (
                  <Link
                    href={a.accion.href}
                    className="axr-btn axr-btn--ghost"
                    {...(a.accion.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {a.accion.label}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── KPI ── */}
      <div className="axr-pub-kpis">
        {(
          [
            [copy.kpiPosts, panel.posts.total, fill(copy.kpiPostsHint, panel.posts.mes)],
            [copy.kpiDrafts, panel.porEstado.borrador, copy.kpiDraftsHint],
            [copy.kpiScheduled, panel.porEstado.programado, copy.kpiScheduledHint],
            [copy.kpiFridge, panel.porEstado.nevera, copy.kpiFridgeHint],
            [copy.kpiPublished, panel.porEstado.publicado, copy.kpiPublishedHint],
          ] as const
        ).map(([label, n, hint]) => (
          <div className="axr-kpi" key={label}>
            <div className="axr-kpi__label">{label}</div>
            <div className="axr-kpi__value">{n}</div>
            <div className="axr-pub-kpi-hint">{hint}</div>
          </div>
        ))}
      </div>

      <div className="axr-pub-grid">
        {/* ── Cobertura ── */}
        <div className="axr-admin-card">
          <h2>{copy.coverTitle}</h2>
          <p className="axr-pub-lead">{copy.coverLead}</p>
          <div className="axr-pub-cover">
            {CANALES.map((c) => {
              const k = panel.cobertura[c];
              const bajo = k.activo && k.dias < settings.alertDays;
              return (
                <div key={c} className="axr-pub-cover__row">
                  <div className="axr-pub-cover__head">
                    <strong>{NOMBRE_CANAL[c]}</strong>
                    {k.activo ? (
                      <span className={bajo ? "axr-pub-cover__low" : undefined}>
                        {k.hasta ? `${duracion(k.dias, locale)}` : copy.coverNone}
                      </span>
                    ) : null}
                  </div>
                  {k.activo ? (
                    <>
                      <div className="axr-pub-bar" aria-hidden="true">
                        <span
                          className="axr-pub-bar__fridge"
                          style={{ width: `${Math.min(100, (k.diasConNevera / ESCALA) * 100)}%` }}
                        />
                        <span
                          className={`axr-pub-bar__fill${bajo ? " is-low" : ""}`}
                          style={{ width: `${Math.min(100, (k.dias / ESCALA) * 100)}%` }}
                        />
                      </div>
                      <div className="axr-pub-cover__meta">
                        {k.hasta ? `${copy.coverUntil} ${dia(k.hasta)}` : copy.coverNone}
                        {k.primerVacio ? ` · ${copy.coverFirstGap}: ${dia(k.primerVacio)}` : ""}
                        {k.nevera ? ` · ${copy.coverWithFridge} ${duracion(k.diasConNevera, locale)}` : ""}
                        <br />
                        {fill(copy.coverRhythm, k.porMes)} · {fill(copy.coverScheduled, k.programadas)} · {fill(copy.coverFridge, k.nevera)}
                      </div>
                    </>
                  ) : (
                    <div className="axr-pub-cover__meta">{copy.coverOff}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="axr-pub-variant__sub">{copy.quotaTitle}</div>
          <div className="axr-pub-cover__meta">
            <strong>
              {panel.cuota.usadas} / {panel.cuota.limite || copy.quotaUnlimited}
            </strong>{" "}
            · {copy.quotaHint}
          </div>
          {panel.cuota.limite ? (
            <div className="axr-pub-bar" aria-hidden="true" style={{ marginTop: "0.4rem" }}>
              <span
                className={`axr-pub-bar__fill${panel.cuota.usadas >= panel.cuota.limite ? " is-low" : ""}`}
                style={{ width: `${Math.min(100, (panel.cuota.usadas / panel.cuota.limite) * 100)}%` }}
              />
            </div>
          ) : null}

          {panel.porEstado.nevera ? (
            <div style={{ marginTop: "1rem" }}>
              <RellenarHuecos copy={copy} />
            </div>
          ) : null}
        </div>

        {/* ── Coste ── */}
        <div className="axr-admin-card">
          <h2>{copy.costTitle}</h2>
          <p className="axr-pub-lead">{copy.costLead}</p>
          <dl className="axr-pub-stats">
            <div>
              <dt>{copy.costTotal}</dt>
              <dd>{formatoUsd(panel.gasto.total, locale)}</dd>
            </div>
            <div>
              <dt>{copy.costMonth}</dt>
              <dd>{formatoUsd(panel.gasto.mes, locale)}</dd>
            </div>
            <div>
              <dt>{copy.costAvg}</dt>
              <dd>{formatoUsd(panel.gasto.medioPorPost, locale)}</dd>
            </div>
            <div>
              <dt>{copy.costCalls}</dt>
              <dd>{panel.gasto.llamadas}</dd>
            </div>
            <div>
              <dt>{copy.costBalance}</dt>
              <dd className={panel.saldo !== null && panel.saldo < settings.minBalanceUsd ? "is-low" : undefined}>
                {panel.saldo === null ? copy.costBalanceNone : formatoUsd(panel.saldo, locale)}
              </dd>
            </div>
          </dl>
          <a href="https://platform.deepseek.com/top_up" target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost">
            {copy.costTopUp} ↗
          </a>
        </div>
      </div>

      {/* ── Próximos 7 días ── */}
      <div className="axr-admin-card">
        <h2>{copy.upcomingTitle}</h2>
        {semana.length === 0 ? (
          <p className="axr-pub-lead" style={{ margin: 0 }}>
            {copy.upcomingNone}{" "}
            <Link href="/admin/publicaciones/calendario">{copy.tabCalendar} →</Link>
          </p>
        ) : (
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{copy.colWhen}</th>
                <th>{copy.colChannel}</th>
                <th>{copy.colPost}</th>
              </tr>
            </thead>
            <tbody>
              {semana.map((v) => (
                <tr key={v.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fecha(v.scheduled_at!, "dia")}</td>
                  <td>{NOMBRE_CANAL[v.channel]}</td>
                  <td>
                    <Link href={`/admin/publicaciones/${v.post_id}`}>{v.title}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Por revisar ── */}
      {porRevisar.length ? (
        <div className="axr-admin-card" id="por-revisar">
          <h2>{copy.reviewTitle}</h2>
          <p className="axr-pub-lead">{copy.reviewLead}</p>
          <ul className="axr-pub-list">
            {porRevisar.map((v) => (
              <li key={v.id}>
                <span className="axr-pub-pill axr-pub-pill--borrador">{NOMBRE_CANAL[v.channel]}</span>
                <Link href={`/admin/publicaciones/${v.post_id}`}>{v.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ── Todas ── */}
      <div className="axr-admin-card">
        <h2>{copy.allTitle}</h2>
        {lista.length === 0 ? (
          <div>
            <p className="axr-pub-lead">{copy.empty}</p>
            <Link href="/admin/publicaciones/nueva" className="axr-btn">
              {copy.new}
            </Link>
          </div>
        ) : (
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{copy.colPost}</th>
                <th>{copy.colChannels}</th>
                <th>{copy.costPerPost}</th>
                <th>{copy.colCreated}</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/publicaciones/${p.id}`}>{p.title}</Link>{" "}
                    <span style={{ color: "var(--axr-text-helper)", fontSize: "0.75rem" }}>{p.language.toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="axr-pub-pills">
                      {(porPost.get(p.id) ?? []).map((v) => (
                        <span key={v.channel} className={`axr-pub-pill axr-pub-pill--${v.status}`}>
                          {NOMBRE_CANAL[v.channel]} · {copy[`status_${v.status}`]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatoUsd(panel.gasto.porPost.get(p.id) ?? 0, locale)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fecha(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Cómo funciona ── */}
      <details className="axr-admin-card axr-pub-how" open={panel.posts.total === 0}>
        <summary>{copy.howTitle}</summary>
        <ol>
          {copy.how.map(([t, d]) => (
            <li key={t}>
              <strong>{t}.</strong> {d}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
