import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CampusHeader } from "@/components/campus-header";
import { FormularioFeedback } from "@/components/campus/dry-run/formulario-feedback";
import { ListaPreparacion, type PasoVista } from "@/components/campus/dry-run/lista-preparacion";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { enlaceGoogleCalendar, enlaceIcs } from "@/lib/dry-run/correos";
import { getMiDryRun, marcarPaso } from "@/lib/dry-run/datos";
import { docenteDe } from "@/lib/dry-run/docente";
import { PASOS } from "@/lib/dry-run/preparacion";
import { cuandoEs, diaLargo, horaMadrid, partesMadrid } from "@/lib/dry-run/tiempo";
import { leerAgenda } from "@/lib/dry-run/tipos";
import { misRespuestas } from "@/lib/actividades/datos";
import { hecha } from "@/lib/actividades/tipos";
import { fmt } from "@/lib/i18n/dictionaries";
import { preparacionCopy } from "@/lib/i18n/preparacion";
import { getI18n } from "@/lib/i18n/server";
import { AbrirAsistente } from "@/components/campus/dry-run/abrir-asistente";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/(campus)/preparacion/preparacion.scss";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return { title: preparacionCopy[locale].metaTitle };
}

/** El estudio de la penalización del remoto (PLOS ONE), el obligatorio del material previo. */
const ESTUDIO = "https://doi.org/10.1371/journal.pone.0303307";

// ══════════════════════════════════════════════════════════
//  La preparación del dry run (el onboarding del invitado)
//
//  Adonde llega quien acaba de reservar plaza y adonde llevan casi todos los
//  correos. Arriba, cuándo es y los botones del día (clase, Classroom,
//  calendario); después la lista de lo que hay que hacer antes, la agenda,
//  dónde está cada cosa en el campus y, desde que empieza la clase, el
//  formulario de feedback.
// ══════════════════════════════════════════════════════════

const DIA = 24 * 3600_000;

export default async function PreparacionPage({ searchParams }: { searchParams: Promise<{ bienvenida?: string }> }) {
  const [mio, { bienvenida }, { locale }, respuestas] = await Promise.all([getMiDryRun(), searchParams, getI18n(), misRespuestas()]);
  const c = preparacionCopy[locale];
  if (!mio) redirect("/");
  const { run, guest } = mio;
  const docente = docenteDe(run.teacher_name);

  const admin = createAdminClient();
  const [{ data: modulo }, { data: lecciones }] = await Promise.all([
    admin.from("modules").select("title, title_en, slug, order_index").eq("id", run.module_id).maybeSingle(),
    admin.from("lessons").select("id, title").eq("module_id", run.module_id).order("order_index"),
  ]);
  const primera = lecciones?.[0];

  // Los pasos que se marcan solos: se comprueban aquí y se guardan, para que
  // el panel los vea sin tener que recalcularlos.
  if (guest.user_id) {
    const [{ count: visitas }, { count: preguntas }] = await Promise.all([
      primera
        ? admin.from("user_lesson_progress").select("lesson_id", { count: "exact", head: true }).eq("user_id", guest.user_id).eq("lesson_id", primera.id)
        : Promise.resolve({ count: 0 }),
      admin.from("assistant_questions").select("id", { count: "exact", head: true }).eq("user_id", guest.user_id),
    ]);
    const nuevos: string[] = [];
    if (!guest.onboarding.cuenta) nuevos.push("cuenta");
    if ((visitas ?? 0) > 0 && !guest.onboarding.material) nuevos.push("material");
    if ((preguntas ?? 0) > 0 && !guest.onboarding.asistente) nuevos.push("asistente");
    // La ficha y el test se hacen en el campus: cuentan cuando están enviados.
    if (hecha(respuestas.get("m01-ficha")?.status) && !guest.onboarding.ficha) nuevos.push("ficha");
    if (hecha(respuestas.get("m01-punto-partida")?.status) && !guest.onboarding.test) nuevos.push("test");
    for (const k of nuevos) {
      await marcarPaso(guest.user_id, k);
      guest.onboarding[k] = new Date().toISOString();
    }
  }

  const ahora = Date.now();
  const empieza = new Date(run.starts_at).getTime();
  const termina = new Date(run.ends_at).getTime();
  // Días de calendario en Madrid, no bloques de 24 horas: el viernes por la
  // noche la clase del sábado por la mañana es «mañana».
  const fechaDe = (d: Date) => {
    const p = partesMadrid(d);
    return Date.UTC(p.y, p.m - 1, p.d);
  };
  const faltan = Math.round((fechaDe(new Date(run.starts_at)) - fechaDe(new Date())) / DIA);
  const cuenta = ahora > termina ? c.past : ahora >= empieza ? c.now : faltan === 0 ? c.today : faltan === 1 ? c.tomorrow : fmt(c.inDays, { n: faltan });
  const dia = diaLargo(run.starts_at, locale);
  const agenda = leerAgenda((locale === "en" && run.agenda_en?.trim()) || run.agenda);
  const tituloModulo = (locale === "en" && modulo?.title_en) || modulo?.title;
  const perfilDocente = docente ? docente[locale] : null;
  const leccion = primera ? `/lecciones/${primera.id}` : null;
  const fichaHecha = hecha(respuestas.get("m01-ficha")?.status);
  const testHecho = hecha(respuestas.get("m01-punto-partida")?.status);
  const numero = modulo?.order_index ?? 1;

  // Cada paso lleva directo a lo que hay que hacer, no a la lección en general.
  const enlacesDe: Record<string, PasoVista["enlaces"]> = {
    classroom: run.classroom_url
      ? [{ texto: run.classroom_code ? fmt(c.openClassroomCode, { c: run.classroom_code }) : c.openClassroom, href: run.classroom_url, externo: true }]
      : undefined,
    calendario: [
      { texto: "Google Calendar", href: enlaceGoogleCalendar(run), externo: true },
      { texto: c.downloadIcs, href: enlaceIcs(run) },
    ],
    material: leccion ? [{ texto: c.openLesson, href: leccion }] : undefined,
    ficha: leccion ? [{ texto: fichaHecha ? c.seeFicha : c.doFicha, href: `${leccion}#act-m01-ficha` }] : undefined,
    test: leccion ? [{ texto: testHecho ? c.seeTest : c.doTest, href: `${leccion}#act-m01-punto-partida` }] : undefined,
    estudio: [{ texto: c.openStudy, href: ESTUDIO, externo: true }],
    equipo: [{ texto: c.testDevices, href: "/preparacion/equipo" }],
    asistente: [{ texto: c.askAssistant, href: "#asistente", asistente: true }],
  };
  const pasos: PasoVista[] = PASOS.map((p) => {
    const detalle = locale === "en" ? p.detalle_en : p.detalle;
    const extra = p.key === "classroom" ? (run.classroom_code ? ` ${fmt(c.classroomCode, { c: run.classroom_code })}` : run.classroom_url ? "" : ` ${c.classroomSoon}`) : "";
    return {
      ...p,
      titulo: locale === "en" ? p.titulo_en : p.titulo,
      detalle: `${detalle}${extra}`,
      hecho: Boolean(guest.onboarding[p.key]),
      enlaces: enlacesDe[p.key],
    };
  });

  const feedbackAbierto = ahora >= empieza;

  return (
    <>
      <CampusHeader />
      <div className="axr-c-wrap axr-prep">
        {bienvenida ? (
          <p className="axr-c-note axr-c-note--ok axr-prep__welcome">
            <Icono n="ok" />
            <span>
              <strong>{c.welcomeTitle}</strong> {c.welcomeBody}
            </span>
          </p>
        ) : null}

        <section className="axr-prep__hero">
          <div>
            <span className="axr-c-pill axr-c-pill--accent">{fmt(c.pill, { n: numero })}</span>
            <h1>{fmt(c.heroTitle, { d: dia })}</h1>
            <p>
              {fmt(c.heroLead, { when: cuandoEs(run.starts_at, run.ends_at, locale), who: "{who}", what: "{what}" })
                .split(/(\{who\}|\{what\})/)
                .map((parte, i) =>
                  parte === "{who}" ? <strong key={i}>{docente?.name ?? run.teacher_name}</strong> : parte === "{what}" ? <strong key={i}>{tituloModulo}</strong> : parte,
                )}
            </p>
            <div className="axr-prep__actions">
              {run.meet_url ? (
                <a href={run.meet_url} className="axr-btn" target="_blank" rel="noreferrer">
                  <Icono n="play" /> {c.joinClass}
                </a>
              ) : null}
              {run.classroom_url ? (
                <a href={run.classroom_url} className={`axr-btn${run.meet_url ? " axr-btn--ghost" : ""}`} target="_blank" rel="noreferrer">
                  <Icono n="birrete" /> Google Classroom{run.classroom_code ? ` · ${run.classroom_code}` : ""}
                </a>
              ) : null}
              <a href={enlaceGoogleCalendar(run)} className="axr-btn axr-btn--ghost" target="_blank" rel="noreferrer">
                <Icono n="calendario" /> {c.addCalendar}
              </a>
            </div>
          </div>
          <div className="axr-prep__count" aria-live="polite">
            <strong>{cuenta}</strong>
            <span>
              {horaMadrid(run.starts_at, locale)}–{horaMadrid(run.ends_at, locale)} · {c.madridTime}
            </span>
          </div>
        </section>

        <div className="axr-prep__grid">
          <ListaPreparacion pasos={pasos} copy={{ title: c.listTitle, count: c.listCount, done: c.done, pending: c.pending }} />

          <div className="axr-prep__side">
            {docente && perfilDocente ? (
              <section className="axr-c-card axr-prep__teacher">
                <h2 className="axr-c-card__title">{c.teacherTitle}</h2>
                <div className="axr-prep__teacher-head">
                  <Image src={docente.photo} alt="" width={64} height={64} />
                  <div>
                    <strong>{docente.name}</strong>
                    <span>{perfilDocente.role}</span>
                  </div>
                </div>
                <p className="axr-prep__text">{perfilDocente.bio}</p>
                <a href={docente.url} target="_blank" rel="noreferrer" className="axr-prep__teacher-link">
                  {c.linkedin}
                </a>
              </section>
            ) : null}

            {agenda.length ? (
              <section className="axr-c-card">
                <h2 className="axr-c-card__title">{c.agendaTitle}</h2>
                <ol className="axr-prep__agenda">
                  {agenda.map((a) => (
                    <li key={`${a.hora}${a.que}`}>
                      <span>{a.hora}</span>
                      <span>{a.que}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <section className="axr-c-card">
              <h2 className="axr-c-card__title">{c.whatTitle}</h2>
              <p className="axr-prep__text">{c.whatBody}</p>
              <ul className="axr-prep__bullets">
                <li>{c.what1}</li>
                <li>{c.what2}</li>
                <li>{c.what3}</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Todas las fichas llevan a su sitio: ninguna es sólo un texto. */}
        <section className="axr-prep__tour" aria-labelledby="prep-tour">
          <h2 id="prep-tour">{c.tourTitle}</h2>
          <div className="axr-prep__tour-grid">
            {modulo?.slug ? (
              <Link href={`/modulos/${modulo.slug}`} className="axr-c-card axr-prep__tile">
                <Icono n="libro" size={20} />
                <strong>{c.tourModule}</strong>
                <span>{fmt(c.tourModuleBody, { n: lecciones?.length ?? 0 })}</span>
              </Link>
            ) : null}
            <Link href="/mis-tareas" className="axr-c-card axr-prep__tile">
              <Icono n="tareas" size={20} />
              <strong>{c.tourTasks}</strong>
              <span>{c.tourTasksBody}</span>
            </Link>
            {leccion ? (
              <Link href={leccion} className="axr-c-card axr-prep__tile">
                <Icono n="play" size={20} />
                <strong>{c.tourAudio}</strong>
                <span>{c.tourAudioBody}</span>
              </Link>
            ) : null}
            {leccion ? (
              <Link href={`${leccion}#descargas`} className="axr-c-card axr-prep__tile">
                <Icono n="descarga" size={20} />
                <strong>{c.tourDownloads}</strong>
                <span>{c.tourDownloadsBody}</span>
              </Link>
            ) : null}
            <Link href="/mi-progreso" className="axr-c-card axr-prep__tile">
              <Icono n="grafica" size={20} />
              <strong>{c.tourProgress}</strong>
              <span>{c.tourProgressBody}</span>
            </Link>
            <AbrirAsistente className="axr-c-card axr-prep__tile">
              <Icono n="chat" size={20} />
              <strong>{c.tourAssistant}</strong>
              <span>{c.tourAssistantBody}</span>
            </AbrirAsistente>
            {run.classroom_url ? (
              <a href={run.classroom_url} target="_blank" rel="noreferrer" className="axr-c-card axr-prep__tile">
                <Icono n="birrete" size={20} />
                <strong>{c.tourClassroom}</strong>
                <span>{c.tourClassroomBody}</span>
              </a>
            ) : (
              <div className="axr-c-card axr-prep__tile is-soon">
                <Icono n="birrete" size={20} />
                <strong>{c.tourClassroom}</strong>
                <span>
                  {c.tourClassroomBody} {c.tourClassroomSoon}
                </span>
              </div>
            )}
          </div>
        </section>

        <section id="feedback" className="axr-c-card axr-prep__feedback">
          <h2 className="axr-c-card__title">{c.feedbackTitle}</h2>
          {feedbackAbierto ? (
            <>
              <p className="axr-prep__text">{c.feedbackBody}</p>
              <FormularioFeedback guestId={guest.id} previo={guest.feedback} />
            </>
          ) : (
            <p className="axr-prep__text">{c.feedbackClosed}</p>
          )}
        </section>
      </div>
    </>
  );
}
