import Link from "next/link";
import { notFound } from "next/navigation";

import { RespuestasVista, ResultadoVista } from "@/components/actividades/vista";
import { FormRevision } from "@/components/actividades/form-revision";
import { actividad, calcular } from "@/lib/actividades/catalogo";
import { tx, type FilaRespuesta } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { getI18n } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/components/actividades/actividades.scss";
import "@/app/admin/respuestas/respuestas.scss";

// Una respuesta, entera: el resultado, lo que ha contestado y, si es una
// tarea, la revisión con la rúbrica de tres criterios.
export default async function RespuestaPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { locale }] = await Promise.all([params, getI18n()]);
  const c = actividadesCopy[locale];
  const admin = createAdminClient();
  const { data } = await admin.from("activity_responses").select("*").eq("id", id).maybeSingle();
  const fila = data as FilaRespuesta | null;
  const act = fila ? actividad(fila.activity_key) : null;
  if (!fila || !act || act.anonima) notFound();
  const [{ data: perfil }, { data: leccion }] = await Promise.all([
    admin.from("profiles").select("full_name, email").eq("id", fila.user_id).maybeSingle(),
    admin.from("lessons").select("title").eq("id", fila.lesson_id).maybeSingle(),
  ]);
  const resultado = fila.result ?? (fila.status !== "borrador" ? calcular(act, fila.answers) : null);
  const fecha = (iso: string) => new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

  return (
    <div className="axr-admin-page axr-resp">
      <p>
        <Link href={`/admin/respuestas?act=${act.key}`}>{c.aBack}</Link>
      </p>
      <div className="axr-admin-page__header">
        <div>
          <h1>{tx(act.titulo, locale)}</h1>
          <p>
            <strong>{perfil?.full_name || perfil?.email}</strong> · {perfil?.email} · {leccion?.title}
            <br />
            {c.status[fila.status]}
            {fila.submitted_at ? ` · ${c.submittedOn.replace("{d}", fecha(fila.submitted_at))}` : ""}
            {fila.reviewed_at ? ` · ${c.reviewedOn.replace("{d}", fecha(fila.reviewed_at))}` : ""} · {c.aAttempts.replace("{n}", String(fila.attempts))}
          </p>
        </div>
      </div>

      <div className="axr-resp__detail">
        <div className="axr-resp__card">
          <ResultadoVista act={act} result={resultado} answers={fila.answers} locale={locale} copy={c} />
          {act.tipo === "formulario" || act.tipo === "encuesta" ? <RespuestasVista act={act} answers={fila.answers} locale={locale} copy={c} /> : null}
        </div>
        {act.revisa && fila.status !== "borrador" ? (
          <aside className="axr-resp__card">
            <h2>{c.aReview}</h2>
            <FormRevision
              id={fila.id}
              rubrica={(act.rubrica ?? []).map((r) => ({ k: r.k, titulo: tx(r.titulo, locale), niveles: r.niveles.map((n) => tx(n, locale)) }))}
              inicial={{ rubric: fila.rubric ?? {}, feedback: fila.feedback ?? "" }}
              copy={c}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
