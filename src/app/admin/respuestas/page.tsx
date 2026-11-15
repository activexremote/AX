import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { ACTIVIDADES, actividad as buscar, calcular } from "@/lib/actividades/catalogo";
import { todasLasRespuestas } from "@/lib/actividades/datos";
import { tx, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { CON_PLAZA } from "@/lib/dry-run/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { getI18n } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Respuestas de los alumnos
//
//  Todo lo que se entrega en el campus. Arriba, cada actividad con cuántos
//  la han enviado y cuántas quedan por revisar; al elegir una, quién la ha
//  hecho, quién no, y la media de la cohorte en los cuestionarios. Una
//  encuesta anónima sólo enseña el recuento.
// ══════════════════════════════════════════════════════════

const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };

export default async function RespuestasPage({ searchParams }: { searchParams: Promise<{ act?: string }> }) {
  const [{ act: elegida }, { locale }] = await Promise.all([searchParams, getI18n()]);
  const c = actividadesCopy[locale];
  const { filas, quien } = await todasLasRespuestas(ACTIVIDADES.map((a) => a.key));
  const act = elegida ? buscar(elegida) : null;
  const fecha = (iso: string) => new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

  const resumen = ACTIVIDADES.map((a) => {
    const de = filas.filter((x) => x.activity_key === a.key);
    return {
      a,
      enviadas: de.filter((x) => x.status !== "borrador").length,
      porRevisar: a.revisa ? de.filter((x) => x.status === "enviada").length : 0,
      borradores: de.filter((x) => x.status === "borrador").length,
    };
  });

  // Quién debería haberla hecho: los invitados con plaza del dry run del módulo.
  let sinEmpezar: { id: string; nombre: string }[] = [];
  if (act) {
    const admin = createAdminClient();
    const { data: modulo } = await admin.from("modules").select("id").eq("slug", act.modulo).maybeSingle();
    if (modulo) {
      const { data: runs } = await admin.from("dry_runs").select("id").eq("module_id", modulo.id);
      const { data: guests } = runs?.length
        ? await admin
            .from("dry_run_guests")
            .select("user_id, name, email")
            .in(
              "dry_run_id",
              runs.map((r) => r.id),
            )
            .in("status", CON_PLAZA)
            .not("user_id", "is", null)
        : { data: [] };
      const conRespuesta = new Set(filas.filter((x) => x.activity_key === act.key).map((x) => x.user_id));
      sinEmpezar = (guests ?? [])
        .filter((g) => !conRespuesta.has(g.user_id as string))
        .map((g) => ({ id: g.user_id as string, nombre: (g.name as string) || (g.email as string) || "—" }));
    }
  }

  const visibles = act ? filas.filter((x) => x.activity_key === act.key) : filas.filter((x) => x.status !== "borrador");

  return (
    <div className="axr-admin-page axr-resp">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.aTitle}</h1>
          <p>{c.aLead}</p>
        </div>
      </div>

      <div className="axr-resp__grid">
        <Link href="/admin/respuestas" className={`axr-resp__tile${!act ? " is-on" : ""}`}>
          <strong>{c.aAll}</strong>
          <span>
            {filas.filter((x) => x.status !== "borrador").length} {c.aSubmitted.toLowerCase()}
          </span>
        </Link>
        {resumen.map(({ a, enviadas, porRevisar }) => (
          <Link key={a.key} href={`/admin/respuestas?act=${a.key}`} className={`axr-resp__tile${act?.key === a.key ? " is-on" : ""}`}>
            <strong>{tx(a.titulo, locale)}</strong>
            <span>
              {enviadas} {c.aSubmitted.toLowerCase()}
              {porRevisar ? (
                <>
                  {" · "}
                  <em className="axr-adm-pill axr-adm-pill--warn">
                    {porRevisar} {c.aToReview.toLowerCase()}
                  </em>
                </>
              ) : null}
            </span>
          </Link>
        ))}
      </div>

      {act?.anonima ? (
        <Anonima act={act} filas={visibles} locale={locale} c={c} />
      ) : (
        <>
          {act?.tipo === "diagnostico" || act?.tipo === "test" || act?.tipo === "juego" ? <Media act={act} filas={visibles} locale={locale} c={c} /> : null}

          {visibles.length ? (
            <div className="axr-resp__table">
              <table className="axr-admin-table">
                <thead>
                  <tr>
                    <th>{c.aStudent}</th>
                    {!act ? <th>{c.aActivity}</th> : null}
                    <th>{c.aStatus}</th>
                    <th>{c.aResult}</th>
                    <th>{c.aUpdated}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((x) => {
                    const a = buscar(x.activity_key);
                    if (!a || a.anonima) return null;
                    return (
                      <tr key={x.id}>
                        <td>
                          <strong>{quien.get(x.user_id)?.nombre ?? "—"}</strong>
                          <br />
                          <small>{quien.get(x.user_id)?.email}</small>
                        </td>
                        {!act ? <td>{tx(a.titulo, locale)}</td> : null}
                        <td>
                          <span className={`axr-adm-pill axr-adm-pill--${TONO[x.status]}`}>{c.status[x.status]}</span>
                        </td>
                        <td>{resultadoCorto(a, x, locale)}</td>
                        <td>{fecha(x.updated_at)}</td>
                        <td>
                          <Link href={`/admin/respuestas/${x.id}`} className="axr-btn axr-btn--small">
                            {a.revisa && x.status === "enviada" ? c.aReview : c.aOpen}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="axr-adm-empty">
              <Icono n="tareas" size={28} />
              <strong>{c.aNone}</strong>
            </div>
          )}
        </>
      )}

      {act && sinEmpezar.length ? (
        <section className="axr-resp__missing">
          <h2>
            {c.aNotStarted} · {sinEmpezar.length}
          </h2>
          <p>{sinEmpezar.map((g) => g.nombre).join(" · ")}</p>
        </section>
      ) : null}
    </div>
  );
}

function resultadoCorto(a: Actividad, x: FilaRespuesta, locale: "es" | "en") {
  const r = x.result ?? (x.status !== "borrador" ? calcular(a, x.answers) : null);
  if (!r) return x.rubric ? Object.values(x.rubric).join(" · ") : "—";
  if (a.tipo === "diagnostico") return `${a.estadios?.[r.estadio ?? 0] ? tx(a.estadios[r.estadio ?? 0].titulo, locale) : ""} · ${r.pct} %`;
  return `${r.puntos}/${r.max}`;
}

function Media({ act, filas, locale, c }: { act: Actividad; filas: FilaRespuesta[]; locale: "es" | "en"; c: (typeof actividadesCopy)["es"] }) {
  const res = filas.filter((x) => x.status !== "borrador" && x.result).map((x) => x.result!);
  if (!res.length) return null;
  const media = Math.round(res.reduce((s, r) => s + r.pct, 0) / res.length);
  return (
    <section className="axr-resp__avg">
      <h2>
        {c.aAverage} · {media} % <small>({res.length})</small>
      </h2>
      {act.bloques?.length ? (
        <ul>
          {act.bloques.map((b) => {
            const vals = res.map((r) => r.bloques?.find((x) => x.k === b.k)?.pct ?? 0);
            const m = Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
            return (
              <li key={b.k}>
                <span>{tx(b.titulo, locale)}</span>
                <div className="axr-resp__bar">
                  <span style={{ width: `${m}%` }} />
                </div>
                <small>{m} %</small>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function Anonima({ act, filas, locale, c }: { act: Actividad; filas: FilaRespuesta[]; locale: "es" | "en"; c: (typeof actividadesCopy)["es"] }) {
  const enviadas = filas.filter((x) => x.status !== "borrador");
  return (
    <section className="axr-resp__avg">
      <h2>{f(c.aAnonCount, { n: enviadas.length })}</h2>
      {act.campos.map((campo) =>
        campo.tipo === "opcion" ? (
          <div key={campo.k}>
            <p>
              <strong>{tx(campo.label, locale)}</strong>
            </p>
            <ul>
              {campo.opciones.map((o) => {
                const n = enviadas.filter((x) => x.answers[campo.k] === o.v).length;
                const pct = enviadas.length ? Math.round((n / enviadas.length) * 100) : 0;
                return (
                  <li key={o.v}>
                    <span>{o[locale]}</span>
                    <div className="axr-resp__bar">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <small>
                      {n} · {pct} %
                    </small>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null,
      )}
    </section>
  );
}
