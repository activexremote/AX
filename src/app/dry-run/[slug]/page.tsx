import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";

import { reservar } from "@/app/dry-run/actions";
import { BrandMark } from "@/components/brand-mark";
import { getSesionPublica } from "@/lib/dry-run/datos";
import { cuandoEs, diaLargo, horaMadrid } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, leerAgenda } from "@/lib/dry-run/tipos";
import { usuarioActual } from "@/lib/data/usuario";
import { isBot } from "@/lib/i18n/negotiate";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/dry-run/dry-run.scss";

// ══════════════════════════════════════════════════════════
//  La página pública de un dry run
//
//  Adonde llevan todos los enlaces de invitación (los del panel, con sus utm,
//  y el personal de cada correo). Cuenta la sesión, qué se pide a cambio y
//  tiene un solo botón: reservar con Google. Cada visita humana con ?ref=
//  suma una al enlace; las de los robots que generan las vistas previas de
//  WhatsApp o LinkedIn no.
// ══════════════════════════════════════════════════════════

type Params = { slug: string };
type Busqueda = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const sesion = await getSesionPublica(slug);
  if (!sesion) return { title: "Dry run · ActiveXRemote" };
  const titulo = `${sesion.run.title} · ActiveXRemote`;
  const descripcion = `Clase de prueba gratuita con ${sesion.run.teacher_name}. ${cuandoEs(sesion.run.starts_at, sesion.run.ends_at)}.`;
  return {
    title: titulo,
    description: descripcion,
    // Son invitaciones: no tienen que salir en Google.
    robots: { index: false, follow: false },
    openGraph: { title: titulo, description: descripcion },
  };
}

const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const MENSAJES: Record<string, { tono: "warn" | "bad"; texto: string }> = {
  completo: { tono: "warn", texto: "Las plazas se han agotado justo ahora. Escríbenos a admin@activexremote.com y te avisamos si queda alguna libre." },
  cerrado: { tono: "warn", texto: "La inscripción a esta sesión está cerrada." },
  error: { tono: "bad", texto: "No hemos podido guardar tu plaza. Vuelve a intentarlo en un momento." },
  "no-existe": { tono: "bad", texto: "Esta sesión ya no existe." },
  google: { tono: "bad", texto: "No hemos podido conectar con Google. Vuelve a intentarlo." },
};

const PREGUNTAS: [string, string][] = [
  ["¿Cuesta algo?", "No. El dry run es gratis: a cambio te pedimos que vengas, participes y nos des tu opinión sincera al terminar."],
  ["¿Qué necesito para conectarme?", "Una cuenta de Google, un ordenador con Chrome o Edge actualizado, cámara, micrófono y una conexión estable. No hay que instalar nada."],
  ["¿Qué es Google Classroom y para qué lo uso?", "Es donde se organiza la clase: allí están las plantillas, se entregan las tareas y se publica el enlace de la sesión. Te contamos cómo unirte al confirmar tu plaza."],
  ["¿Cuánto tiempo tengo que preparar?", "Entre una y dos horas de material previo, cuando te venga bien antes del día. Si solo tienes una hora, te decimos qué tres piezas hacer."],
  ["¿Y si al final no puedo ir?", "Avísanos respondiendo a cualquiera de nuestros correos: así liberamos la plaza para otra persona."],
  ["¿Qué pasa con mis datos?", "Los usamos solo para organizar la sesión y escribirte sobre ella. Puedes dejar de recibir los correos con el enlace que va al final de cada uno."],
];

export default async function DryRunLanding({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Busqueda> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const sesion = await getSesionPublica(slug);
  if (!sesion) notFound();
  const { run, modulo, lecciones } = sesion;

  const ref = uno(sp.ref).slice(0, 40);
  const inv = uno(sp.inv).slice(0, 40);
  const estado = MENSAJES[uno(sp.estado)];

  const admin = createAdminClient();
  const [user, invitado, ua] = await Promise.all([
    usuarioActual(),
    /^[a-f0-9]{32}$/.test(inv)
      ? admin.from("dry_run_guests").select("full_name").eq("token", inv).eq("dry_run_id", run.id).maybeSingle().then((r) => r.data)
      : null,
    headers().then((h) => h.get("user-agent")),
  ]);
  const yaTienePlaza = user
    ? Boolean(
        (await admin.from("dry_run_guests").select("status").eq("dry_run_id", run.id).eq("user_id", user.id).in("status", CON_PLAZA).maybeSingle()).data,
      )
    : false;

  if (ref && !isBot(ua)) {
    after(async () => {
      await createAdminClient().rpc("dry_run_visit", { link_code: ref });
    });
  }

  const terminado = new Date(run.ends_at).getTime() < Date.now();
  const libres = run.capacity ? Math.max(run.capacity - sesion.ocupadas, 0) : null;
  const abierto = run.registration_open && !terminado && libres !== 0;
  const agenda = leerAgenda(run.agenda);
  const nombre = invitado?.full_name?.trim().split(/\s+/)[0];
  const dia = diaLargo(run.starts_at);

  return (
    <main className="axr-dr">
      <header className="axr-dr__bar">
        <Link href="/bienvenida" className="axr-dr__brand">
          <BrandMark size={20} />
          <span>ActiveXRemote</span>
        </Link>
        <span className="axr-dr__bar-tag">Dry run · Módulo {modulo.numero}</span>
      </header>

      <section className="axr-dr__hero">
        <div className="axr-dr__hero-text">
          <p className="axr-dr__eyebrow">
            <span aria-hidden>■</span> Clase de prueba · Plazas limitadas
          </p>
          <h1>{nombre ? `${nombre}, prueba gratis la primera clase de ActiveXRemote` : "Prueba gratis la primera clase de ActiveXRemote"}</h1>
          <p className="axr-dr__lead">
            Antes de abrir el programa damos el módulo <strong>{modulo.title}</strong> a un grupo reducido, en directo y con {run.teacher_name}. Queremos ver cómo funciona la clase con gente real y escuchar qué te parece.
          </p>
          {modulo.description ? <p className="axr-dr__desc">{modulo.description}</p> : null}
        </div>

        <aside className="axr-dr__card" aria-label="Reserva">
          <dl className="axr-dr__facts">
            <div>
              <dt>Cuándo</dt>
              <dd>
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                <br />
                {horaMadrid(run.starts_at)}–{horaMadrid(run.ends_at)} · hora de Madrid
              </dd>
            </div>
            <div>
              <dt>Dónde</dt>
              <dd>En directo, online, con Google Classroom</dd>
            </div>
            <div>
              <dt>Docente</dt>
              <dd>{run.teacher_name}</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>Gratis</dd>
            </div>
          </dl>

          {estado ? <p className={`axr-dr__msg axr-dr__msg--${estado.tono}`}>{estado.texto}</p> : null}

          {yaTienePlaza ? (
            <>
              <p className="axr-dr__ok">Ya tienes tu plaza.</p>
              <Link href="/preparacion" className="axr-dr__cta">
                Ir a mi preparación <span aria-hidden>→</span>
              </Link>
            </>
          ) : abierto ? (
            <form action={reservar}>
              <input type="hidden" name="slug" value={run.slug} />
              <input type="hidden" name="ref" value={ref} />
              <input type="hidden" name="inv" value={inv} />
              {(["source", "medium", "campaign", "content", "term"] as const).map((k) => (
                <input key={k} type="hidden" name={`utm_${k}`} value={uno(sp[`utm_${k}`]).slice(0, 120)} />
              ))}
              <button type="submit" className="axr-dr__cta">
                <GoogleG /> Reservar mi plaza con Google
              </button>
              <p className="axr-dr__hint">
                {libres !== null ? `Quedan ${libres} ${libres === 1 ? "plaza" : "plazas"}. ` : ""}
                Entras con tu cuenta de Google y tienes acceso al módulo en el campus al momento.
              </p>
            </form>
          ) : (
            <p className="axr-dr__msg axr-dr__msg--warn">
              {terminado ? "Esta sesión ya se ha celebrado. ¡Gracias a quienes vinieron!" : libres === 0 ? "No quedan plazas." : "La inscripción está cerrada."}
            </p>
          )}
        </aside>
      </section>

      <section className="axr-dr__section">
        <h2>Qué es un dry run</h2>
        <div className="axr-dr__grid3">
          <article>
            <span className="axr-dr__num">01</span>
            <h3>Una clase real</h3>
            <p>El mismo módulo, con los mismos ejercicios y el mismo ritmo que tendrá el curso. No es una demo ni una charla comercial.</p>
          </article>
          <article>
            <span className="axr-dr__num">02</span>
            <h3>Con el campus abierto</h3>
            <p>Desde que te apuntas tienes el módulo en el campus: lecciones, audios, plantillas, el material previo y un asistente para tus dudas.</p>
          </article>
          <article>
            <span className="axr-dr__num">03</span>
            <h3>Tu opinión cuenta</h3>
            <p>Al terminar te pedimos tres minutos de feedback. Lo que nos digas cambia la versión final del curso.</p>
          </article>
        </div>
      </section>

      {lecciones.length ? (
        <section className="axr-dr__section">
          <h2>Lo que vas a trabajar</h2>
          <ol className="axr-dr__lessons">
            {lecciones.map((l, i) => (
              <li key={l.title}>
                <span className="axr-dr__num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{l.title}</strong>
                  {l.subtitle ? <p>{l.subtitle}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {agenda.length ? (
        <section className="axr-dr__section">
          <h2>La agenda del día</h2>
          <table className="axr-dr__agenda">
            <tbody>
              {agenda.map((a) => (
                <tr key={`${a.hora}${a.que}`}>
                  <th scope="row">{a.hora}</th>
                  <td>{a.que}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className="axr-dr__section axr-dr__ask">
        <h2>Qué te pedimos a cambio</h2>
        <ul>
          <li>Una o dos horas de material previo antes de la clase. Te guiamos paso a paso.</li>
          <li>Conectarte el día de la clase con cámara y micrófono, y participar.</li>
          <li>Tres minutos de feedback sincero al terminar.</li>
        </ul>
      </section>

      <section className="axr-dr__section">
        <h2>Preguntas frecuentes</h2>
        <div className="axr-dr__faq">
          {PREGUNTAS.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="axr-dr__foot">
        <span>ActiveXRemote · The Remote Business School</span>
        <Link href="/legal/privacidad">Privacidad</Link>
      </footer>
    </main>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
