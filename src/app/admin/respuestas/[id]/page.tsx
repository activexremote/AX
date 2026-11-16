import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, coma, fechaHora, TONO } from "@/app/admin/respuestas/ui";
import { RespuestasVista, ResultadoVista } from "@/components/actividades/vista";
import { FormRevision } from "@/components/actividades/form-revision";
import { alumnosVisibles, puedeVer } from "@/lib/actividades/acceso";
import { actividad, calcular } from "@/lib/actividades/catalogo";
import { tx, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { panelRespuestasCopy } from "@/lib/i18n/panel-respuestas";
import { getI18n } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/components/actividades/actividades.scss";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Una respuesta
//
//  A la izquierda, lo que ha contestado (y su resultado si es un test). A
//  la derecha, si es una tarea, la corrección: rúbrica, nota, comentario y
//  el aviso por correo.
// ══════════════════════════════════════════════════════════

export default async function RespuestaPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }] = await Promise.all([params, getI18n()]);
  const c = actividadesCopy[locale];
  const k = panelRespuestasCopy[locale];
  const admin = createAdminClient();
  const { data } = await admin.from("activity_responses").select("*").eq("id", id).maybeSingle();
  const fila = data as FilaRespuesta | null;
  const act = fila ? actividad(fila.activity_key) : null;
  if (!fila || !act || act.anonima) notFound();
  // Un profesor sólo ve las de sus alumnos.
  if (!puedeVer(await alumnosVisibles(), fila.user_id)) notFound();
  const [{ data: perfil }, { data: leccion }] = await Promise.all([
    admin.from("profiles").select("full_name, email").eq("id", fila.user_id).maybeSingle(),
    admin.from("lessons").select("title").eq("id", fila.lesson_id).maybeSingle(),
  ]);
  const nombre = (perfil?.full_name as string) || (perfil?.email as string) || "—";
  const resultado = fila.result ?? (fila.status !== "borrador" ? calcular(act, fila.answers) : null);
  const fecha = (iso: string) => fechaHora(iso, locale);
  const conRevision = Boolean(act.revisa && fila.status !== "borrador");
  const meta = [
    fila.submitted_at ? k.submittedOn.replace("{d}", fecha(fila.submitted_at)) : null,
    fila.attempts > 1 ? k.attempts.replace("{n}", String(fila.attempts)) : null,
    fila.reviewed_at && (fila.status === "revisada" || fila.status === "devuelta") ? k.reviewedOn.replace("{d}", fecha(fila.reviewed_at)) : null,
    fila.notified_at ? k.notifiedOn.replace("{d}", fecha(fila.notified_at)) : null,
  ].filter(Boolean);

  return (
    <div className="axr-admin-page axr-resp">
      <p className="axr-resp-back">
        <Link href="/admin/respuestas">{k.title}</Link>
        {" / "}
        <Link href={`/admin/respuestas/alumnos/${fila.user_id}`}>{nombre}</Link>
      </p>

      <section className="axr-resp-card axr-resp-hero is-slim">
        <Avatar nombre={nombre} id={fila.user_id} size="md" />
        <div className="axr-resp-hero__who">
          <span className="axr-resp-kicker">
            {k.tipos[act.tipo]} · {leccion?.title}
          </span>
          <h1>{tx(act.titulo, locale)}</h1>
          <p>
            <Link href={`/admin/respuestas/alumnos/${fila.user_id}`}>{nombre}</Link>
            {meta.length ? ` · ${meta.join(" · ")}` : ""}
          </p>
        </div>
        <div className="axr-resp-hero__badges">
          <span className={`axr-adm-pill axr-adm-pill--${TONO[fila.status]}`}>{c.status[fila.status]}</span>
          {fila.grade !== null && fila.grade !== undefined ? (
            <span className="axr-resp-grade">
              {coma(Number(fila.grade))}
              <em>/10</em>
            </span>
          ) : null}
        </div>
      </section>

      <div className={`axr-resp-split${conRevision ? "" : " is-single"}`}>
        <section className="axr-resp-card axr-resp-answers">
          <header className="axr-resp-card__head">
            <h2>{k.answers}</h2>
          </header>
          <ResultadoVista act={act} result={resultado} answers={fila.answers} locale={locale} copy={c} />
          {act.tipo === "formulario" || act.tipo === "encuesta" ? <RespuestasVista act={act} answers={fila.answers} locale={locale} copy={c} /> : null}
        </section>
        {conRevision ? (
          <aside className="axr-resp-card axr-resp-sticky">
            <header className="axr-resp-card__head">
              <h2>{k.review}</h2>
            </header>
            <FormRevision
              id={fila.id}
              rubrica={(act.rubrica ?? []).map((r) => ({ k: r.k, titulo: tx(r.titulo, locale), niveles: r.niveles.map((n) => tx(n, locale)) }))}
              inicial={{ rubric: fila.rubric ?? {}, feedback: fila.feedback ?? "", nota: fila.grade !== null && fila.grade !== undefined ? Number(fila.grade) : null }}
              copy={c}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
