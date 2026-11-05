import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CampusHeader } from "@/components/campus-header";
import { FormularioFeedback } from "@/components/campus/dry-run/formulario-feedback";
import { ListaPreparacion, type PasoVista } from "@/components/campus/dry-run/lista-preparacion";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { enlaceGoogleCalendar, enlaceIcs } from "@/lib/dry-run/correos";
import { getMiDryRun, marcarPaso } from "@/lib/dry-run/datos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { cuandoEs, diaLargo, horaMadrid, partesMadrid } from "@/lib/dry-run/tiempo";
import { leerAgenda } from "@/lib/dry-run/tipos";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/(campus)/preparacion/preparacion.scss";

export const metadata: Metadata = { title: "Tu preparación · ActiveXRemote" };

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
  const [mio, { bienvenida }] = await Promise.all([getMiDryRun(), searchParams]);
  if (!mio) redirect("/");
  const { run, guest } = mio;

  const admin = createAdminClient();
  const [{ data: modulo }, { data: lecciones }] = await Promise.all([
    admin.from("modules").select("title, slug, order_index").eq("id", run.module_id).maybeSingle(),
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
  const cuenta =
    ahora > termina ? "Ya se celebró" : ahora >= empieza ? "Está pasando ahora" : faltan === 0 ? "Es hoy" : faltan === 1 ? "Es mañana" : `Faltan ${faltan} días`;
  const dia = diaLargo(run.starts_at);
  const agenda = leerAgenda(run.agenda);
  const numero = modulo?.order_index ?? 1;

  const enlacesDe: Record<string, PasoVista["enlaces"]> = {
    classroom: run.classroom_url ? [{ texto: run.classroom_code ? `Abrir Classroom (código ${run.classroom_code})` : "Abrir Google Classroom", href: run.classroom_url, externo: true }] : undefined,
    calendario: [
      { texto: "Google Calendar", href: enlaceGoogleCalendar(run), externo: true },
      { texto: "Descargar .ics", href: enlaceIcs(run) },
    ],
    material: primera ? [{ texto: "Abrir la lección", href: `/lecciones/${primera.id}` }] : undefined,
    ficha: primera ? [{ texto: "Está en «Antes de la clase»", href: `/lecciones/${primera.id}` }] : undefined,
    test: primera ? [{ texto: "Está en «Antes de la clase»", href: `/lecciones/${primera.id}` }] : undefined,
    estudio: primera ? [{ texto: "Está en «Antes de la clase»", href: `/lecciones/${primera.id}` }] : undefined,
  };
  const pasos: PasoVista[] = PASOS.map((p) => ({
    ...p,
    hecho: Boolean(guest.onboarding[p.key]),
    enlaces: enlacesDe[p.key],
    detalle: p.key === "classroom" && run.classroom_code ? `${p.detalle} El código de la clase es ${run.classroom_code}.` : p.detalle,
  }));

  const feedbackAbierto = ahora >= empieza;

  return (
    <>
      <CampusHeader />
      <div className="axr-c-wrap axr-prep">
        {bienvenida ? (
          <p className="axr-c-note axr-c-note--ok axr-prep__welcome">
            <Icono n="ok" />
            <span>
              <strong>¡Plaza confirmada!</strong> Te hemos mandado un correo con todo. Empieza por la lista de abajo.
            </span>
          </p>
        ) : null}

        <section className="axr-prep__hero">
          <div>
            <span className="axr-c-pill axr-c-pill--accent">Dry run · Módulo {numero}</span>
            <h1>Tu preparación para el {dia}</h1>
            <p>
              {cuandoEs(run.starts_at, run.ends_at)}. Clase en directo con <strong>{run.teacher_name}</strong> sobre <strong>{modulo?.title}</strong>.
            </p>
            <div className="axr-prep__actions">
              {run.meet_url ? (
                <a href={run.meet_url} className="axr-btn" target="_blank" rel="noreferrer">
                  <Icono n="play" /> Entrar a la clase
                </a>
              ) : null}
              {run.classroom_url ? (
                <a href={run.classroom_url} className={`axr-btn${run.meet_url ? " axr-btn--ghost" : ""}`} target="_blank" rel="noreferrer">
                  <Icono n="birrete" /> Google Classroom{run.classroom_code ? ` · ${run.classroom_code}` : ""}
                </a>
              ) : null}
              <a href={enlaceGoogleCalendar(run)} className="axr-btn axr-btn--ghost" target="_blank" rel="noreferrer">
                <Icono n="calendario" /> Añadir al calendario
              </a>
            </div>
          </div>
          <div className="axr-prep__count" aria-live="polite">
            <strong>{cuenta}</strong>
            <span>
              {horaMadrid(run.starts_at)}–{horaMadrid(run.ends_at)} · hora de Madrid
            </span>
          </div>
        </section>

        <div className="axr-prep__grid">
          <ListaPreparacion pasos={pasos} />

          <div className="axr-prep__side">
            {agenda.length ? (
              <section className="axr-c-card">
                <h2 className="axr-c-card__title">La agenda del día</h2>
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
              <h2 className="axr-c-card__title">Qué es esto y qué esperamos de ti</h2>
              <p className="axr-prep__text">
                Un <strong>dry run</strong> es un ensayo con público: damos la clase real, con sus ejercicios y su ritmo, a un grupo pequeño antes de abrir el curso. Queremos ver cómo funcionan la dinámica de la clase y el campus con gente de verdad.
              </p>
              <ul className="axr-prep__bullets">
                <li>Llega con el material previo hecho: la clase es para trabajar, no para escuchar teoría.</li>
                <li>Participa: en las horas 1 y 3 hablas delante de tu grupo.</li>
                <li>Cuéntanos con sinceridad qué ha funcionado y qué no. Lo malo nos sirve más que lo bueno.</li>
              </ul>
            </section>
          </div>
        </div>

        <section className="axr-prep__tour" aria-labelledby="prep-tour">
          <h2 id="prep-tour">Dónde está cada cosa</h2>
          <div className="axr-prep__tour-grid">
            {(lecciones ?? []).length ? (
              <Link href={`/modulos/${modulo?.slug}`} className="axr-c-card axr-prep__tile">
                <Icono n="libro" size={20} />
                <strong>El módulo</strong>
                <span>{lecciones!.length} lecciones: el material previo y las cuatro horas de la clase, cada una con qué traer preparado y su tarea.</span>
              </Link>
            ) : null}
            <div className="axr-c-card axr-prep__tile">
              <Icono n="play" size={20} />
              <strong>Audio en cada lección</strong>
              <span>Puedes escuchar las lecciones mientras haces otra cosa. Al terminar, márcalas como completadas.</span>
            </div>
            <div className="axr-c-card axr-prep__tile">
              <Icono n="descarga" size={20} />
              <strong>Plantillas y descargas</strong>
              <span>Al final de cada lección: plantillas en Excel y Word, lecturas y los enunciados de las tareas.</span>
            </div>
            <Link href="/mi-progreso" className="axr-c-card axr-prep__tile">
              <Icono n="calendario" size={20} />
              <strong>Mi progreso</strong>
              <span>Cuánto llevas del módulo, de un vistazo.</span>
            </Link>
            <div className="axr-c-card axr-prep__tile">
              <Icono n="chat" size={20} />
              <strong>El asistente</strong>
              <span>El chat de abajo a la derecha responde dudas sobre el campus, el dry run y el contenido.</span>
            </div>
            <div className="axr-c-card axr-prep__tile">
              <Icono n="birrete" size={20} />
              <strong>Google Classroom</strong>
              <span>Donde se entregan las tareas y se publica el enlace de la sesión.</span>
            </div>
          </div>
        </section>

        <section id="feedback" className="axr-c-card axr-prep__feedback">
          <h2 className="axr-c-card__title">Tu feedback</h2>
          {feedbackAbierto ? (
            <>
              <p className="axr-prep__text">Tres minutos. Lo leemos todo, y lo que nos digas cambia la versión final del curso.</p>
              <FormularioFeedback guestId={guest.id} previo={guest.feedback} />
            </>
          ) : (
            <p className="axr-prep__text">El formulario se abre cuando empiece la clase. Te lo recordaremos por correo al terminar.</p>
          )}
        </section>
      </div>
    </>
  );
}
