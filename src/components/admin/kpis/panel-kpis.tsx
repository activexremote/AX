import Link from "next/link";

import { Actualizar } from "@/components/admin/kpis/actualizar";
import { Barras, Columnas, Linea } from "@/components/admin/kpis/graficas";
import { Icono, type NombreIcono } from "@/components/admin/publicaciones/iconos";
import { rellenar } from "@/lib/i18n/dry-run";
import { kpisCopy, type KpisCopy } from "@/lib/i18n/kpis";
import type { Locale } from "@/lib/i18n/config";
import { SIN_VALOR } from "@/lib/kpis/calculos";
import { getDashboardDataCached } from "@/lib/kpis/panel";
import type { AdsData, DashboardData, FunnelStep, Section } from "@/lib/kpis/types";

// ══════════════════════════════════════════════════════════
//  KPIs de ventas
//
//  Arriba, lo que hay que mirar cada mañana: seis cifras, el embudo del
//  anuncio a la matrícula y «lo importante» (lo que se está quedando atrás,
//  sacado de los datos y con su porqué). Debajo, el detalle por fuente:
//  leads, llamadas, matrículas, anuncios y web.
//
//  Sólo administración: lleva inversión, ingresos y coste por alumno. La
//  página (app/admin/comercial/kpis) lo comprueba antes de pintar esto.
//
//  Colores de las series (validados con el comprobador de paletas, también
//  para daltonismo): violeta del panel, ámbar, verde azulado y rojo coral,
//  siempre en ese orden y siempre para lo mismo.
// ══════════════════════════════════════════════════════════

const C1 = "#5b4bf5";
const C2 = "#f59e0b";
const C3 = "#0f9d8a";
const C4 = "#e4462f";

type Tono = "bad" | "warn" | "info" | "ok";
type Foco = { key: string; tono: Tono; icon: NombreIcono; titulo: string; detalle: string; href?: string; boton?: string };

export async function PanelKpis({ locale }: { locale: Locale }) {
  const d = await getDashboardDataCached();
  const c = kpisCopy[locale];
  const tag = locale === "en" ? "en-IE" : "es-ES";
  const n = (v: number) => new Intl.NumberFormat(tag, { maximumFractionDigits: 1, useGrouping: "always" }).format(v);
  const eur = (v: number) =>
    new Intl.NumberFormat(tag, { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: Number.isInteger(v) ? 0 : 2, useGrouping: "always" }).format(v);
  const cents = (v: number) => eur(v / 100);
  const fecha = (iso: string, extra: Intl.DateTimeFormatOptions = {}) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "short", ...extra }).format(new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso));

  const crm = d.crm.status === "ok" ? d.crm.data : null;
  const calls = d.calls.status === "ok" ? d.calls.data : null;
  const ventas = d.ventas.status === "ok" ? d.ventas.data : null;
  const meta = d.meta.status === "ok" ? d.meta.data : null;
  const gads = d.googleAds.status === "ok" ? d.googleAds.data : null;
  const ga4 = d.ga4.status === "ok" ? d.ga4.data : null;
  const days = (crm?.leadsDaily ?? calls?.daily ?? ventas?.daily ?? []).map((x) => x.day);

  const fuentes = [
    ["crm", d.crm],
    ["calls", d.calls],
    ["ventas", d.ventas],
    ["meta", d.meta],
    ["googleAds", d.googleAds],
    ["ga4", d.ga4],
  ] as const;

  const focos = buildFocos(d, c, n, cents);
  const delta = crm ? crm.leadsLast7 - crm.leadsPrev7 : 0;

  return (
    <div className="axr-admin-page axr-com axr-kpi">
      <div className="axr-admin-page__header">
        <div>
          <span className="axr-kpi__range">{rellenar(c.range, { a: fecha(d.range.since), b: fecha(d.range.until) })}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
        <div className="axr-kpi__refresh">
          <Actualizar label={c.refresh} busy={c.refreshing} />
          <small title={c.cacheHint}>{rellenar(c.updated, { t: fecha(d.generatedAt, { hour: "2-digit", minute: "2-digit" }) })}</small>
        </div>
      </div>

      <ul className="axr-kpi__sources" aria-label={c.sources}>
        {fuentes.map(([k, s]) => (
          <li key={k} className={`axr-kpi__source axr-kpi__source--${s.status}`} title={s.status === "ok" ? undefined : s.message}>
            <Icono n={s.status === "ok" ? "ok" : s.status === "error" ? "error" : "enchufe"} size={14} />
            <strong>{c.src[k]}</strong>
            <span>{s.status === "ok" ? c.stOk : s.status === "error" ? c.stError : c.stOff}</span>
          </li>
        ))}
      </ul>

      {/* ── Las seis cifras ── */}
      <div className="axr-adm-stats axr-kpi__stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="usuarios" /> {c.kLeads}
          </span>
          <span className="axr-adm-stat__value">{crm ? n(crm.leads30) : c.none}</span>
          {crm ? (
            <>
              <Linea values={crm.leadsDaily.map((x) => x.leads)} label={c.leadsDaily} />
              <span className="axr-adm-stat__hint">
                {rellenar(c.kLeadsHint, { n: crm.leadsLast7 })} ·{" "}
                <b className={delta > 0 ? "is-up" : delta < 0 ? "is-down" : undefined}>{rellenar(c.kVs, { d: delta > 0 ? `+${delta}` : String(delta) })}</b>
              </span>
            </>
          ) : null}
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="telefono" /> {c.kCalled}
          </span>
          <span className="axr-adm-stat__value">{calls?.leadsCalled.pct != null ? `${calls.leadsCalled.pct} %` : c.none}</span>
          {calls ? (
            <>
              <Medidor pct={calls.leadsCalled.pct ?? 0} />
              <span className="axr-adm-stat__hint">{rellenar(c.kCalledHint, { a: calls.leadsCalled.called, b: calls.leadsCalled.total })}</span>
            </>
          ) : null}
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="reloj" /> {c.kFirstCall}
          </span>
          <span className="axr-adm-stat__value">{calls?.avgHoursToFirstCall != null ? rellenar(c.hours, { n: n(calls.avgHoursToFirstCall) }) : c.none}</span>
          <span className="axr-adm-stat__hint">{c.kFirstCallHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="birrete" /> {c.kEnrol}
          </span>
          <span className="axr-adm-stat__value">{ventas ? n(ventas.matriculas30) : c.none}</span>
          {ventas ? <span className="axr-adm-stat__hint">{rellenar(c.kEnrolHint, { n: ventas.matriculasTotal })}</span> : null}
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="euro" /> {c.kCashed}
          </span>
          <span className="axr-adm-stat__value">{ventas ? cents(ventas.cobrado30) : c.none}</span>
          {ventas ? <span className="axr-adm-stat__hint">{rellenar(c.kCashedHint, { x: cents(ventas.porCobrar) })}</span> : null}
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="megafono" /> {c.kCpl}
          </span>
          <span className="axr-adm-stat__value">{d.cross.cplCrmEur != null ? eur(d.cross.cplCrmEur) : c.none}</span>
          <span className="axr-adm-stat__hint">{d.cross.cplCrmEur != null ? c.kCplHint : c.kCplNone}</span>
        </div>
      </div>

      {/* ── Embudo y lo importante ── */}
      <div className="axr-kpi__top">
        <section className="axr-admin-card axr-kpi__funnel">
          <h2>{c.funnel}</h2>
          <p className="axr-kpi__lead">{c.funnelLead}</p>
          <Embudo pasos={d.funnel} c={c} n={n} />
        </section>

        <section className="axr-admin-card">
          <h2>
            {c.focus}
            {focos.length ? <span className="axr-kpi__count">{focos.length}</span> : null}
          </h2>
          {focos.length ? (
            <ul className="axr-kpi__focus">
              {focos.map((f) => (
                <li key={f.key} className={`axr-kpi__item axr-kpi__item--${f.tono}`}>
                  <span className="axr-kpi__icon">
                    <Icono n={f.icon} size={16} />
                  </span>
                  <span className="axr-kpi__text">
                    <strong>{f.titulo}</strong>
                    <small>{f.detalle}</small>
                    {f.href ? (
                      <Link href={f.href} className="axr-kpi__link">
                        {f.boton} <Icono n="flecha" size={12} />
                      </Link>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="axr-adm-empty">
              <Icono n="ok" size={28} />
              <strong>{c.focusNone}</strong>
              <span>{c.focusNoneHint}</span>
            </div>
          )}
        </section>
      </div>

      {/* ── Leads ── */}
      <h2 className="axr-kpi__section">{c.sLeads}</h2>
      <Bloque s={d.crm} name={c.src.crm} c={c}>
        {crm ? (
          <div className="axr-kpi__grid">
            <section className="axr-admin-card">
              <h3>{c.leadsDaily}</h3>
              <Columnas
                days={days}
                series={[{ label: c.kLeads, color: C1, values: crm.leadsDaily.map((x) => x.leads) }]}
                locale={locale}
                label={c.leadsDaily}
                tablaLabel={c.table}
                diaLabel={c.day}
              />
            </section>
            <section className="axr-admin-card axr-kpi__split">
              <div>
                <h3>{c.byStatus}</h3>
                <Barras rows={crm.leadsByStatus.map((r) => ({ label: r.key === SIN_VALOR ? c.noStatus : (c.status[r.key] ?? r.key), value: r.count }))} color={C1} locale={locale} />
              </div>
              <div>
                <h3>{c.bySource}</h3>
                <Barras rows={crm.leadsBySource.map((r) => ({ label: r.key === SIN_VALOR ? c.noSource : (c.source[r.key] ?? r.key), value: r.count }))} color={C3} locale={locale} />
              </div>
            </section>
          </div>
        ) : null}
      </Bloque>

      {/* ── Llamadas ── */}
      <h2 className="axr-kpi__section">{c.sCalls}</h2>
      <Bloque s={d.calls} name={c.src.calls} c={c}>
        {calls ? (
          <>
            <div className="axr-adm-stats axr-kpi__mini">
              <Mini label={c.cTotal} value={n(calls.total)} />
              <Mini label={c.cConnected} value={n(calls.connected)} />
              <Mini label={c.cAvg} value={calls.avgDurationSec != null ? duracion(calls.avgDurationSec) : c.none} />
              <Mini label={c.cTalk} value={rellenar(c.minutes, { n: n(calls.talkMinutes) })} />
              <Mini label={c.cMissed} value={calls.missedPct != null ? `${calls.missedPct} %` : c.none} />
            </div>
            <section className="axr-admin-card">
              <h3>{c.callsDaily}</h3>
              <Columnas
                days={days}
                series={[
                  { label: c.outbound, color: C1, values: calls.daily.map((x) => x.outbound) },
                  { label: c.inbound, color: C3, values: calls.daily.map((x) => x.inbound) },
                  { label: c.missed, color: C4, values: calls.daily.map((x) => x.missed) },
                ]}
                locale={locale}
                label={c.callsDaily}
                tablaLabel={c.table}
                diaLabel={c.day}
              />
            </section>
          </>
        ) : null}
      </Bloque>

      {/* ── Matrículas y pipeline ── */}
      <h2 className="axr-kpi__section">{c.sSales}</h2>
      <div className="axr-kpi__grid">
        <Bloque s={d.ventas} name={c.src.ventas} c={c}>
          {ventas ? (
            <section className="axr-admin-card">
              <h3>{c.enrolDaily}</h3>
              <Columnas
                days={days}
                series={[
                  { label: c.enrolments, color: C3, values: ventas.daily.map((x) => x.matriculas) },
                  { label: c.abandons, color: C2, values: ventas.daily.map((x) => x.abandonos) },
                ]}
                locale={locale}
                label={c.enrolDaily}
                tablaLabel={c.table}
                diaLabel={c.day}
              />
              <h3 className="axr-kpi__sub">{c.byOffer}</h3>
              {ventas.porOferta.length ? (
                <div className="axr-admin-scroll">
                  <table className="axr-admin-table axr-kpi__table">
                    <thead>
                      <tr>
                        <th>{c.offer}</th>
                        <th>{c.count}</th>
                        <th>{c.amount}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.porOferta.map((o) => (
                        <tr key={o.offer}>
                          <td>{c.offers[o.offer] ?? (o.offer.startsWith("relampago-") ? c.offerFlash : o.offer)}</td>
                          <td>{n(o.n)}</td>
                          <td>{cents(o.cobrado)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="axr-kpi__muted">{c.noSales}</p>
              )}
            </section>
          ) : null}
        </Bloque>
        <Bloque s={d.crm} name={c.src.crm} c={c}>
          {crm ? (
            <section className="axr-admin-card">
              <h3>{c.pipeline}</h3>
              <div className="axr-kpi__pipe">
                <Mini label={c.pipeOpen} value={eur(crm.pipeline.openAmount)} hint={rellenar(c.deals, { n: crm.pipeline.openDeals })} />
                <Mini label={c.pipeWon} value={eur(crm.pipeline.wonAmount)} hint={rellenar(c.deals, { n: crm.pipeline.wonDeals })} />
                <Mini label={c.pipeRate} value={crm.pipeline.winRate != null ? `${crm.pipeline.winRate} %` : c.none} />
              </div>
              {crm.dealsByStage.length ? (
                <Barras
                  rows={crm.dealsByStage.map((s) => ({ label: c.stages[s.stage] ?? s.stage, value: s.amount, extra: String(s.deals) }))}
                  color={C1}
                  fmt="eur"
                  locale={locale}
                />
              ) : (
                <p className="axr-kpi__muted">{c.pipeNone}</p>
              )}
            </section>
          ) : null}
        </Bloque>
      </div>

      {/* ── Anuncios ── */}
      <h2 className="axr-kpi__section">{c.sAds}</h2>
      <div className="axr-adm-stats axr-kpi__mini">
        <Mini label={c.aSpend} value={meta || gads ? eur(d.cross.spendEur) : c.none} />
        <Mini label={c.kCpl} value={d.cross.cplCrmEur != null ? eur(d.cross.cplCrmEur) : c.none} hint={c.kCplHint} />
        <Mini label={c.aCac} value={d.cross.cacEur != null ? eur(d.cross.cacEur) : c.none} hint={c.aCacHint} />
        <Mini label={c.aRoas} value={d.cross.roas != null ? `${n(d.cross.roas)}×` : c.none} hint={c.aRoasHint} />
      </div>
      {meta || gads ? (
        <section className="axr-admin-card">
          <h3>{c.spendDaily}</h3>
          <Columnas
            days={days}
            series={[
              ...(meta ? [{ label: c.src.meta, color: C1, values: meta.daily.map((x) => x.spendEur) }] : []),
              ...(gads ? [{ label: c.src.googleAds, color: C2, values: gads.daily.map((x) => x.spendEur) }] : []),
            ]}
            fmt="eur"
            locale={locale}
            label={c.spendDaily}
            tablaLabel={c.table}
            diaLabel={c.day}
          />
        </section>
      ) : null}
      <div className="axr-kpi__grid">
        <Bloque s={d.meta} name={c.src.meta} c={c}>
          {meta ? <Anuncios a={meta} titulo={c.src.meta} conv={c.aConv} c={c} n={n} eur={eur} /> : null}
        </Bloque>
        <Bloque s={d.googleAds} name={c.src.googleAds} c={c}>
          {gads ? (
            <Anuncios
              a={gads}
              titulo={c.src.googleAds}
              conv={c.aConvG}
              c={c}
              n={n}
              eur={eur}
              nota={gads.via === "sheet" && gads.updatedAt ? rellenar(c.sheetAt, { t: gads.updatedAt }) : undefined}
            />
          ) : null}
        </Bloque>
      </div>

      {/* ── Web ── */}
      <h2 className="axr-kpi__section">{c.sWeb}</h2>
      <Bloque s={d.ga4} name={c.src.ga4} c={c}>
        {ga4 ? (
          ga4.kpi ? (
            <div className="axr-kpi__grid">
              <div className="axr-adm-stats axr-kpi__mini axr-kpi__mini--2">
                <Mini label={c.wSessions} value={n(ga4.kpi.sessions)} />
                <Mini label={c.wUsers} value={n(ga4.kpi.users)} hint={rellenar(c.wNew, { n: n(ga4.kpi.newUsers) })} />
                <Mini label={c.wEngaged} value={`${n(ga4.kpi.engagementPct)} %`} />
                <Mini label={c.wConv} value={n(ga4.kpi.conversions)} />
              </div>
              <section className="axr-admin-card">
                <h3>{c.channels}</h3>
                <Barras rows={ga4.channels.map((ch) => ({ label: ch.channel, value: ch.sessions, extra: ch.keyEvents ? `${n(ch.keyEvents)} ${c.wConv.toLowerCase()}` : undefined }))} color={C3} locale={locale} />
              </section>
            </div>
          ) : (
            <div className="axr-adm-note">{c.ga4Empty}</div>
          )
        ) : null}
      </Bloque>
    </div>
  );
}

// ───────────── Piezas ─────────────

function duracion(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${s} s` : `${s} s`;
}

function Mini({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="axr-adm-stat axr-kpi__ministat">
      <span className="axr-adm-stat__label">{label}</span>
      <span className="axr-adm-stat__value">{value}</span>
      {hint ? <span className="axr-adm-stat__hint">{hint}</span> : null}
    </div>
  );
}

/** Una barra de 0 a 100: verde de 70 en adelante, ámbar desde 40, rojo por debajo. */
function Medidor({ pct }: { pct: number }) {
  const tono = pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad";
  return (
    <span className={`axr-kpi__meter axr-kpi__meter--${tono}`} aria-hidden>
      <span style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </span>
  );
}

/** El bloque de una fuente: su contenido, o por qué no lo hay. */
function Bloque<T>({ s, name, c, children }: { s: Section<T>; name: string; c: KpisCopy; children: React.ReactNode }) {
  if (s.status === "ok") return <>{children}</>;
  const off = s.status === "not_configured";
  return (
    <div className={`axr-kpi__off axr-kpi__off--${s.status}`}>
      <Icono n={off ? "enchufe" : "error"} size={20} />
      <div>
        <strong>{rellenar(off ? c.offTitle : c.errorTitle, { s: name })}</strong>
        <small>{off ? c.offHint : s.message}</small>
        {off ? <code>{s.message.replace(/^[^:]+: /, "")}</code> : null}
      </div>
    </div>
  );
}

/** Del anuncio a la matrícula, en dos tramos: cada barra, frente al primer paso de su tramo. */
function Embudo({ pasos, c, n }: { pasos: FunnelStep[]; c: KpisCopy; n: (v: number) => string }) {
  const tramos = [
    { label: c.funnelAcq, keys: ["impresiones", "clics", "sesiones"] },
    { label: c.funnelSale, keys: ["leads", "contactados", "cualificados", "matriculas"] },
  ];
  return (
    <div className="axr-kf">
      {tramos.map((t) => {
        const del = pasos.filter((p) => t.keys.includes(p.key));
        const base = del.find((p) => p.value)?.value ?? 0;
        return (
          <div key={t.label} className="axr-kf__tramo">
            <span className="axr-kf__label">{t.label}</span>
            <ol>
              {del.map((p) => {
                const ancho = p.value && base ? Math.max((p.value / base) * 100, 3) : 0;
                return (
                  <li key={p.key} className={p.value === null ? "is-off" : undefined}>
                    <div className="axr-kf__head">
                      <span>
                        <strong>{c.step[p.key]}</strong>
                        <small>{c.stepHint[p.key]}</small>
                      </span>
                      <b>{p.value === null ? c.notConnected : n(p.value)}</b>
                    </div>
                    <span className="axr-kf__track">
                      <span style={{ width: `${ancho}%` }} />
                    </span>
                    {p.rate !== null ? <span className="axr-kf__rate">{rellenar(c.ofPrev, { p: `${n(p.rate)} %` })}</span> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

function Anuncios({ a, titulo, conv, c, n, eur, nota }: { a: AdsData; titulo: string; conv: string; c: KpisCopy; n: (v: number) => string; eur: (v: number) => string; nota?: string }) {
  const k = a.kpi;
  return (
    <section className="axr-admin-card">
      <h3>{titulo}</h3>
      {nota ? <p className="axr-kpi__muted">{nota}</p> : null}
      <dl className="axr-kpi__dl">
        <div>
          <dt>{c.aSpend}</dt>
          <dd>
            {eur(k.spendEur)}
            {k.currency && k.currency !== "EUR" ? <small>{rellenar(c.local, { x: `${n(k.spendLocal)} ${k.currency}` })}</small> : null}
          </dd>
        </div>
        <div>
          <dt>{c.aImpr}</dt>
          <dd>{n(k.impressions)}</dd>
        </div>
        <div>
          <dt>{c.aClicks}</dt>
          <dd>{n(k.clicks)}</dd>
        </div>
        <div>
          <dt>{c.aCtr}</dt>
          <dd>{k.ctrPct != null ? `${n(k.ctrPct)} %` : c.none}</dd>
        </div>
        <div>
          <dt>{c.aCpc}</dt>
          <dd>{k.cpcEur != null ? eur(k.cpcEur) : c.none}</dd>
        </div>
        <div>
          <dt>{conv}</dt>
          <dd>{n(k.conversions)}</dd>
        </div>
        <div>
          <dt>{c.aCpl}</dt>
          <dd>{k.cplEur != null ? eur(k.cplEur) : c.none}</dd>
        </div>
      </dl>
      <h3 className="axr-kpi__sub">{c.campaigns}</h3>
      {a.campaigns.length ? (
        <div className="axr-admin-scroll">
          <table className="axr-admin-table axr-kpi__table">
            <thead>
              <tr>
                <th>{c.campaign}</th>
                <th>{c.aSpend}</th>
                <th>{c.aCtr}</th>
                <th>{conv}</th>
                <th>{c.aCpl}</th>
              </tr>
            </thead>
            <tbody>
              {a.campaigns.map((x) => (
                <tr key={x.campaign}>
                  <td>{x.campaign}</td>
                  <td>{eur(x.spendEur)}</td>
                  <td>{x.ctrPct != null ? `${n(x.ctrPct)} %` : c.none}</td>
                  <td>{n(x.conversions)}</td>
                  <td>{x.cplEur != null ? eur(x.cplEur) : c.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="axr-kpi__muted">{c.noCampaigns}</p>
      )}
    </section>
  );
}

// ───────────── Lo importante ─────────────

/** Lo que se está quedando atrás, de lo más urgente a lo informativo. */
function buildFocos(d: DashboardData, c: KpisCopy, n: (v: number) => string, cents: (v: number) => string): Foco[] {
  const out: Foco[] = [];
  const crm = d.crm.status === "ok" ? d.crm.data : null;
  const calls = d.calls.status === "ok" ? d.calls.data : null;
  const ventas = d.ventas.status === "ok" ? d.ventas.data : null;

  if (calls) {
    const sin = calls.leadsCalled.total - calls.leadsCalled.called;
    if (sin > 0) out.push({ key: "uncalled", tono: "bad", icon: "telefono", titulo: rellenar(c.fUncalled, { n: sin }), detalle: c.fUncalledHint });
    if (calls.avgHoursToFirstCall != null && calls.avgHoursToFirstCall > 1)
      out.push({ key: "slow", tono: calls.avgHoursToFirstCall > 24 ? "bad" : "warn", icon: "reloj", titulo: rellenar(c.fSlow, { n: n(calls.avgHoursToFirstCall) }), detalle: c.fSlowHint });
    if (calls.missedPct != null && calls.missedPct > 20) out.push({ key: "missed", tono: "warn", icon: "aviso", titulo: rellenar(c.fMissed, { n: calls.missedPct }), detalle: c.fMissedHint });
  }
  if (ventas && ventas.abandonados30 > 0) {
    out.push({
      key: "abandon",
      tono: "warn",
      icon: "tarjeta",
      titulo: rellenar(c.fAbandon, { n: ventas.abandonados30, x: cents(ventas.abandonadoValor30) }),
      detalle: c.fAbandonHint,
      href: "/admin/matriculas",
      boton: c.fAbandonBtn,
    });
  }
  if (crm) {
    if (crm.attribution.pct !== null && crm.attribution.pct < 50)
      out.push({ key: "source", tono: "warn", icon: "enlace", titulo: rellenar(c.fSource, { n: crm.attribution.pct }), detalle: c.fSourceHint });
    const delta = crm.leadsLast7 - crm.leadsPrev7;
    if (delta < 0) out.push({ key: "down", tono: "warn", icon: "aviso", titulo: rellenar(c.fDown, { n: -delta }), detalle: c.fDownHint });
    if (delta > 0) out.push({ key: "up", tono: "ok", icon: "chispa", titulo: rellenar(c.fUp, { n: delta }), detalle: c.fUpHint });
  }
  if (d.meta.status !== "ok" && d.googleAds.status !== "ok") out.push({ key: "ads", tono: "info", icon: "enchufe", titulo: c.fNoAds, detalle: c.fNoAdsHint });
  if (calls && calls.duplicates > 0) out.push({ key: "dupes", tono: "info", icon: "info", titulo: rellenar(c.fDupes, { n: calls.duplicates }), detalle: c.fDupesHint });

  const orden: Record<Tono, number> = { bad: 0, warn: 1, ok: 2, info: 3 };
  return out.sort((a, b) => orden[a.tono] - orden[b.tono]);
}
