import Link from "next/link";

import { Icono, type NombreIcono } from "@/components/admin/publicaciones/iconos";
import { RellenarHuecos } from "@/components/admin/publicaciones/rellenar-huecos";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { diaMadrid, duracion, sumarDias, ZONA } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import type { Nivel, Panel, Tarea } from "@/lib/social/panel";
import type { SocialPost } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Inicio de publicaciones (lo que se pinta; los datos los carga la página)
//
//  Lo primero que se ve contesta a «¿va todo bien?» en una frase. Debajo,
//  lo que hay que hacer (de lo que bloquea a lo que mejora, cada cosa con su
//  botón) y lo que sale en las próximas dos semanas, con los huecos en rojo.
//  Los números van al final y en pequeño: informan, no piden nada.
// ══════════════════════════════════════════════════════════

const ICONO: Record<Nivel, NombreIcono> = { bloquea: "error", urgente: "aviso", pendiente: "info", mejora: "chispa" };
/** La barra de cobertura llega a tope a los 90 días: más allá, ya no preocupa. */
const ESCALA = 90;

function FilaTarea({ t, copy }: { t: Tarea; copy: PubCopy }) {
  return (
    <li className={`axr-pubtask axr-pubtask--${t.nivel}`}>
      <span className="axr-pubtask__icon">
        <Icono n={ICONO[t.nivel]} />
      </span>
      <div className="axr-pubtask__text">
        <strong>{t.titulo}</strong>
        <span>{t.texto}</span>
      </div>
      {"rellenar" in t.accion ? (
        <RellenarHuecos copy={copy} label={t.accion.label} ghost />
      ) : (
        <Link
          href={t.accion.href}
          className="axr-btn axr-btn--ghost axr-pubtask__btn"
          {...(t.accion.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {t.accion.label}
        </Link>
      )}
    </li>
  );
}

type Reciente = Pick<SocialPost, "id" | "title" | "language" | "created_at">;

export function Inicio({ panel, ultimas, copy, locale }: { panel: Panel; ultimas: Reciente[]; copy: PubCopy; locale: string }) {
  const hoy = diaMadrid(new Date());
  const hora = (iso: string) => new Date(iso).toLocaleTimeString(locale, { timeZone: ZONA, hour: "2-digit", minute: "2-digit" });
  const nombreDia = (d: string) =>
    d === hoy ? copy.uToday : d === sumarDias(hoy, 1) ? copy.uTomorrow : new Date(`${d}T12:00:00Z`).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const fechaLarga = (iso: string) =>
    `${nombreDia(diaMadrid(iso))} · ${hora(iso)}`;

  const { tareas, porEstado, cobertura, settings } = panel;
  const porPost = new Map<string, typeof panel.variantes>();
  for (const v of panel.variantes) porPost.set(v.post_id, [...(porPost.get(v.post_id) ?? []), v]);

  // ── El veredicto: una frase que dice si va todo bien ──
  const peor = tareas[0]?.nivel;
  const tono = peor === "bloquea" ? "mal" : peor === "urgente" ? "aviso" : peor ? "info" : "ok";
  const urgentes = tareas.filter((t) => t.nivel === "bloquea" || t.nivel === "urgente").length;
  const titulo =
    tono === "mal"
      ? copy.uVerdictBlocked
      : tono === "aviso"
        ? urgentes === 1 ? copy.uVerdictUrgent1 : fill(copy.uVerdictUrgent, urgentes)
        : tono === "info"
          ? tareas.length === 1 ? copy.uVerdictPending1 : fill(copy.uVerdictPending, tareas.length)
          : copy.uVerdictOk;
  const siguiente = panel.variantes.find((v) => v.status === "programado" && v.scheduled_at && Date.parse(v.scheduled_at) > Date.now());

  // ── Sin nada todavía: la bienvenida ──
  if (panel.posts.total === 0) {
    const hechos = panel.pasos.filter((p) => p.hecho).length;
    return (
      <div className="axr-admin-page axr-pubhome">
        <section className="axr-pubwelcome">
          <div className="axr-pubwelcome__intro">
            <span className="axr-pubwelcome__eyebrow">{copy.uWelcomeEyebrow}</span>
            <h1>{copy.uWelcomeTitle}</h1>
            <p>{copy.uWelcomeLead}</p>
            <Link href="/admin/publicaciones/nueva" className="axr-btn axr-pubwelcome__cta">
              <Icono n="chispa" /> {copy.uWelcomeCta}
            </Link>
          </div>
          <ol className="axr-pubwelcome__flow" aria-label={copy.howTitle}>
            {copy.how.map(([t, d], i) => (
              <li key={t}>
                <span>{i + 1}</span>
                <strong>{t}</strong>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.stepsTitle}</h2>
            <span className="axr-pubcard__meta">{fill(copy.uStepsDone, `${hechos}/${panel.pasos.length}`)}</span>
          </div>
          <ol className="axr-pubsteps">
            {panel.pasos.map((p, i) => (
              <li key={p.titulo} className={p.hecho ? "is-done" : ""}>
                <span className="axr-pubsteps__n">{p.hecho ? <Icono n="ok" /> : i + 1}</span>
                <div>
                  <strong>{p.titulo}</strong>
                  <span>{p.texto}</span>
                </div>
                {!p.hecho ? (
                  <Link href={p.href} className="axr-btn axr-btn--ghost">
                    {p.boton}
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      </div>
    );
  }

  const conAlgo = panel.agenda.filter((d) => d.items.length || d.huecos.length);

  return (
    <div className="axr-admin-page axr-pubhome">
      {/* ── ¿Va todo bien? ── */}
      <section className={`axr-pubverdict axr-pubverdict--${tono}`}>
        <span className="axr-pubverdict__icon">
          <Icono n={tono === "ok" ? "ok" : tono === "mal" ? "error" : tono === "aviso" ? "aviso" : "info"} size={22} />
        </span>
        <div className="axr-pubverdict__text">
          <h1>{titulo}</h1>
          <p>
            {siguiente ? (
              <>
                {copy.uNext}:{" "}
                <Link href={`/admin/publicaciones/${siguiente.post_id}?canal=${siguiente.channel}`}>
                  <strong>{NOMBRE_CANAL[siguiente.channel]}</strong> · {fechaLarga(siguiente.scheduled_at!)} · «{siguiente.title}»
                </Link>
              </>
            ) : (
              copy.uNothingNext
            )}
          </p>
        </div>
        <div className="axr-pubverdict__nums">
          <Link href="/admin/publicaciones/revisar">
            <strong>{porEstado.borrador + porEstado.error}</strong>
            <span>{copy.uReview}</span>
          </Link>
          <Link href="/admin/publicaciones/calendario">
            <strong>{porEstado.programado}</strong>
            <span>{copy.kpiScheduled}</span>
          </Link>
          <Link href="/admin/publicaciones/nevera">
            <strong>{porEstado.nevera}</strong>
            <span>{copy.tabFridge}</span>
          </Link>
        </div>
      </section>

      <div className="axr-pubhome__grid">
        {/* ── Qué hacer ahora ── */}
        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.uTodo}</h2>
            {tareas.length ? <span className="axr-pubcard__count">{tareas.length}</span> : null}
          </div>
          {tareas.length ? (
            <ul className="axr-pubtasks">
              {tareas.map((t) => (
                <FilaTarea key={t.id} t={t} copy={copy} />
              ))}
            </ul>
          ) : (
            <div className="axr-pubempty">
              <Icono n="ok" size={28} />
              <strong>{copy.uTodoNone}</strong>
              <span>{copy.uTodoNoneHint}</span>
            </div>
          )}
        </section>

        {/* ── Próximas dos semanas ── */}
        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.uAgenda}</h2>
            <Link href="/admin/publicaciones/calendario" className="axr-pubcard__link">
              {copy.tabCalendar} <Icono n="flecha" size={14} />
            </Link>
          </div>
          {conAlgo.length ? (
            <ol className="axr-pubagenda">
              {conAlgo.map((d) => (
                <li key={d.dia} className={d.dia === hoy ? "is-today" : undefined}>
                  <span className="axr-pubagenda__day">{nombreDia(d.dia)}</span>
                  <div className="axr-pubagenda__items">
                    {d.items.map((v) => (
                      <Link
                        key={v.id}
                        href={`/admin/publicaciones/${v.post_id}?canal=${v.channel}`}
                        className={`axr-pubagenda__item${v.status === "publicado" ? " is-done" : ""}`}
                      >
                        <span className={`axr-pub-dot axr-pub-dot--${v.channel}`} />
                        <span className="axr-pubagenda__time">{hora((v.scheduled_at ?? v.published_at)!)}</span>
                        <span className="axr-pubagenda__title">{v.title}</span>
                        {v.status === "publicado" ? <Icono n="ok" size={14} /> : null}
                      </Link>
                    ))}
                    {d.huecos.map((c) => (
                      <Link
                        key={c}
                        href={cobertura[c].nevera ? "/admin/publicaciones/nevera" : `/admin/publicaciones/nueva?canal=${c}`}
                        className="axr-pubagenda__gap"
                      >
                        <span className={`axr-pub-dot axr-pub-dot--${c}`} />
                        {fill(copy.uGapIn, NOMBRE_CANAL[c])}
                        <span className="axr-pubagenda__fix">{cobertura[c].nevera ? copy.uFillFromFridge : copy.uCreate}</span>
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="axr-pubempty">
              <Icono n="calendario" size={28} />
              <strong>{copy.uAgendaEmpty}</strong>
            </div>
          )}
        </section>
      </div>

      <div className="axr-pubhome__grid axr-pubhome__grid--3">
        {/* ── Cobertura ── */}
        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.coverTitle}</h2>
          </div>
          <div className="axr-pubcover">
            {CANALES.map((c) => {
              const k = cobertura[c];
              const bajo = k.activo && k.dias < settings.alertDays;
              return (
                <div key={c} className="axr-pubcover__row" title={k.nevera ? `${copy.coverWithFridge} ${duracion(k.diasConNevera, locale)}` : undefined}>
                  <span className="axr-pubcover__name">
                    <span className={`axr-pub-dot axr-pub-dot--${c}`} /> {NOMBRE_CANAL[c]}
                  </span>
                  {k.activo ? (
                    <>
                      <span className="axr-pub-bar" aria-hidden>
                        <span className="axr-pub-bar__fridge" style={{ width: `${Math.min(100, (k.diasConNevera / ESCALA) * 100)}%` }} />
                        <span className={`axr-pub-bar__fill${bajo ? " is-low" : ""}`} style={{ width: `${Math.min(100, (k.dias / ESCALA) * 100)}%` }} />
                      </span>
                      <span className={`axr-pubcover__val${bajo ? " is-low" : ""}`}>{k.hasta ? duracion(k.dias, locale) : copy.uEmpty}</span>
                    </>
                  ) : (
                    <span className="axr-pubcover__off">{copy.uNoRhythm}</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="axr-pubcard__foot">
            <span className="axr-pub-bar__key" /> {copy.uCoverKey} · <span className="axr-pub-bar__key axr-pub-bar__key--fridge" /> {copy.uCoverKeyFridge}
          </p>
        </section>

        {/* ── Números ── */}
        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.uNumbers}</h2>
          </div>
          <dl className="axr-pubnums">
            <div>
              <dt>{copy.uCreatedMonth}</dt>
              <dd>{panel.posts.mes}</dd>
            </div>
            <div>
              <dt>{copy.uPublishedMonth}</dt>
              <dd>{panel.publicadasMes}</dd>
            </div>
            <div>
              <dt>{copy.kpiPosts}</dt>
              <dd>{panel.posts.total}</dd>
            </div>
            <div>
              <dt>{copy.uQuota}</dt>
              <dd>{panel.cuota.limite ? `${panel.cuota.usadas}/${panel.cuota.limite}` : panel.cuota.usadas}</dd>
            </div>
          </dl>
        </section>

        {/* ── Coste ── */}
        <section className="axr-pubcard">
          <div className="axr-pubcard__head">
            <h2>{copy.costTitle}</h2>
            <a href="https://platform.deepseek.com/top_up" target="_blank" rel="noreferrer" className="axr-pubcard__link">
              {copy.costTopUp} ↗
            </a>
          </div>
          <dl className="axr-pubnums">
            <div>
              <dt>{copy.costMonth}</dt>
              <dd>{formatoUsd(panel.gasto.mes, locale)}</dd>
            </div>
            <div>
              <dt>{copy.uPerPost}</dt>
              <dd>{formatoUsd(panel.gasto.medioPorPost, locale)}</dd>
            </div>
            <div>
              <dt>{copy.costTotal}</dt>
              <dd>{formatoUsd(panel.gasto.total, locale)}</dd>
            </div>
            <div>
              <dt>{copy.costBalance}</dt>
              <dd className={panel.saldo !== null && panel.saldo < settings.minBalanceUsd ? "is-low" : undefined}>
                {panel.saldo === null ? "—" : formatoUsd(panel.saldo, locale)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* ── Lo último ── */}
      <section className="axr-pubcard">
        <div className="axr-pubcard__head">
          <h2>{copy.uLatest}</h2>
          <Link href="/admin/publicaciones/todas" className="axr-pubcard__link">
            {copy.uSeeAll} <Icono n="flecha" size={14} />
          </Link>
        </div>
        <ul className="axr-publist">
          {ultimas.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/publicaciones/${p.id}`} className="axr-publist__row">
                <span className="axr-publist__title">{p.title}</span>
                <span className="axr-publist__channels">
                  {(porPost.get(p.id) ?? []).map((v) => (
                    <span key={v.channel} className={`axr-pubstate axr-pubstate--${v.status}`} title={`${NOMBRE_CANAL[v.channel]} · ${copy[`status_${v.status}`]}`}>
                      <span className={`axr-pub-dot axr-pub-dot--${v.channel}`} />
                      {copy[`status_${v.status}`]}
                    </span>
                  ))}
                </span>
                <span className="axr-publist__date">{new Date(p.created_at).toLocaleDateString(locale, { day: "numeric", month: "short" })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <details className="axr-pubhow">
        <summary>
          <Icono n="info" /> {copy.howTitle}
        </summary>
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
