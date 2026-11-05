import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";

import { reservar } from "@/app/dry-run/actions";
import { BrandMark } from "@/components/brand-mark";
import { CuentaAtras } from "@/components/dry-run/cuenta-atras";
import { getSesionPublica } from "@/lib/dry-run/datos";
import { docenteDe } from "@/lib/dry-run/docente";
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
  if (!sesion) return { title: "Dry run" };
  // El layout ya añade « · ActiveXRemote».
  const titulo = sesion.run.title;
  const descripcion = `Clase de prueba gratuita y en directo con ${docenteDe(sesion.run.teacher_name)?.name ?? sesion.run.teacher_name}. ${cuandoEs(sesion.run.starts_at, sesion.run.ends_at)}.`;
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
  const docente = docenteDe(run.teacher_name);
  const nombreDocente = docente?.name ?? run.teacher_name;
  // 9:30–14:00 son «4,5 h», no «5 h».
  const horas = (Math.round(((new Date(run.ends_at).getTime() - new Date(run.starts_at).getTime()) / 3_600_000) * 2) / 2)
    .toLocaleString("es-ES");

  const reserva = (id: string) =>
    yaTienePlaza ? (
      <>
        <p className="axr-dr__ok">✓ Ya tienes tu plaza.</p>
        <Link href="/preparacion" className="axr-dr__cta">
          Ir a mi preparación <span aria-hidden>→</span>
        </Link>
      </>
    ) : abierto ? (
      <form action={reservar} id={id}>
        <input type="hidden" name="slug" value={run.slug} />
        <input type="hidden" name="ref" value={ref} />
        <input type="hidden" name="inv" value={inv} />
        {(["source", "medium", "campaign", "content", "term"] as const).map((k) => (
          <input key={k} type="hidden" name={`utm_${k}`} value={uno(sp[`utm_${k}`]).slice(0, 120)} />
        ))}
        <button type="submit" className="axr-dr__cta">
          <span className="axr-dr__cta-g">
            <GoogleG />
          </span>
          Reservar mi plaza gratis
          <span aria-hidden>→</span>
        </button>
        <p className="axr-dr__hint">
          {libres !== null ? (
            <>
              <strong>
                Quedan {libres} {libres === 1 ? "plaza" : "plazas"}.
              </strong>{" "}
            </>
          ) : null}
          Entras con tu cuenta de Google y el Módulo {modulo.numero} se abre en el campus al momento.
        </p>
      </form>
    ) : (
      <p className="axr-dr__msg axr-dr__msg--warn">
        {terminado ? "Esta sesión ya se ha celebrado. ¡Gracias a quienes vinieron!" : libres === 0 ? "No quedan plazas." : "La inscripción está cerrada."}
      </p>
    );

  return (
    <main className="axr-dr axr-dr--landing">
      <div className="axr-dr__hero-wrap">
        <div className="axr-dr__mesh" aria-hidden />
        <div className="axr-dr__glyph" aria-hidden>
          <BrandMark size={520} />
        </div>

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
              <span className="axr-dr__pulse" aria-hidden /> Clase de prueba en directo · Plazas limitadas
            </p>
            <h1>
              {nombre ? <span className="axr-dr__hi">{nombre}, </span> : null}
              {nombre ? "vive" : "Vive"} la primera clase de <em>ActiveXRemote</em> antes que nadie
            </h1>
            <p className="axr-dr__lead">
              Damos el módulo <strong>{modulo.title}</strong> a un grupo reducido, en directo y con {nombreDocente}. Una clase real, gratis, para que nos digas qué te parece antes de abrir el programa.
            </p>

            <CuentaAtras inicio={run.starts_at} fin={run.ends_at} />

            {docente ? (
              <a href="#docente" className="axr-dr__teacher-chip">
                <Image src={docente.photo} alt="" width={40} height={40} />
                <span>
                  Con <strong>{docente.name}</strong>
                  <small>{docente.es.role}</small>
                </span>
              </a>
            ) : null}
          </div>

          <aside className="axr-dr__card" aria-label="Reserva">
            <p className="axr-dr__card-kicker">Tu plaza</p>
            <dl className="axr-dr__facts">
              <div>
                <dt>Cuándo</dt>
                <dd>
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  <small>
                    {horaMadrid(run.starts_at)}–{horaMadrid(run.ends_at)} · hora de Madrid
                  </small>
                </dd>
              </div>
              <div>
                <dt>Dónde</dt>
                <dd>
                  Online, en directo
                  <small>Con Google Classroom</small>
                </dd>
              </div>
              <div>
                <dt>Docente</dt>
                <dd>{nombreDocente}</dd>
              </div>
              <div>
                <dt>Precio</dt>
                <dd className="axr-dr__free">Gratis</dd>
              </div>
            </dl>

            {estado ? <p className={`axr-dr__msg axr-dr__msg--${estado.tono}`}>{estado.texto}</p> : null}
            {reserva("reserva")}
          </aside>
        </section>

        <ul className="axr-dr__stats" aria-label="La sesión en cifras">
          <li>
            <strong>{horas} h</strong>
            <span>de clase en directo</span>
          </li>
          <li>
            <strong>{lecciones.length || 1}</strong>
            <span>{lecciones.length === 1 ? "lección" : "lecciones"} en el campus</span>
          </li>
          <li>
            <strong>0 €</strong>
            <span>sin tarjeta, sin letra pequeña</span>
          </li>
          <li>
            <strong>{libres !== null ? libres : "∞"}</strong>
            <span>{libres !== null ? "plazas libres" : "grupo reducido"}</span>
          </li>
        </ul>
      </div>

      <section className="axr-dr__section">
        <p className="axr-dr__kicker">Qué es un dry run</p>
        <h2>Un ensayo general, con público. Y el público eres tú.</h2>
        <div className="axr-dr__grid3">
          <article>
            <span className="axr-dr__icon axr-dr__icon--1" aria-hidden>
              ▶
            </span>
            <h3>Una clase real</h3>
            <p>El mismo módulo, con los mismos ejercicios y el mismo ritmo que tendrá el curso. No es una demo ni una charla comercial.</p>
          </article>
          <article>
            <span className="axr-dr__icon axr-dr__icon--2" aria-hidden>
              ◆
            </span>
            <h3>El campus, abierto</h3>
            <p>Desde que te apuntas tienes el módulo en el campus: lecciones, audios, plantillas, el material previo y un asistente con IA para tus dudas.</p>
          </article>
          <article>
            <span className="axr-dr__icon axr-dr__icon--3" aria-hidden>
              ✦
            </span>
            <h3>Tu opinión manda</h3>
            <p>Al terminar te pedimos tres minutos de feedback. Lo que nos digas cambia la versión final del curso.</p>
          </article>
        </div>
      </section>

      {docente ? (
        <section className="axr-dr__section axr-dr__teacher" id="docente">
          <div className="axr-dr__teacher-photo">
            <Image src={docente.photo} alt={`Retrato de ${docente.name}`} width={320} height={320} />
          </div>
          <div className="axr-dr__teacher-text">
            <p className="axr-dr__kicker">Quién da la clase</p>
            <h2>{docente.name}</h2>
            <p className="axr-dr__teacher-role">{docente.es.role}</p>
            <p>{docente.es.bio}</p>
            <ul className="axr-dr__tags">
              {docente.es.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a href={docente.url} target="_blank" rel="noreferrer" className="axr-dr__link">
              Ver su perfil en LinkedIn <span aria-hidden>↗</span>
            </a>
          </div>
        </section>
      ) : null}

      {lecciones.length ? (
        <section className="axr-dr__section">
          <p className="axr-dr__kicker">Módulo {modulo.numero}</p>
          <h2>{modulo.title}</h2>
          {modulo.description ? <p className="axr-dr__section-lead">{modulo.description}</p> : null}
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
          <p className="axr-dr__kicker">{dia.charAt(0).toUpperCase() + dia.slice(1)}</p>
          <h2>La agenda del día</h2>
          <ol className="axr-dr__timeline">
            {agenda.map((a) => (
              <li key={`${a.hora}${a.que}`} className={/^pausa|^cierre/i.test(a.que) ? "is-quiet" : undefined}>
                <time>{a.hora}</time>
                <span>{a.que}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="axr-dr__section axr-dr__ask">
        <p className="axr-dr__kicker">El trato</p>
        <h2>Gratis. A cambio te pedimos tres cosas.</h2>
        <ol>
          <li>
            <strong>Llegar con el material previo hecho.</strong> Una o dos horas, a tu ritmo. Te guiamos paso a paso.
          </li>
          <li>
            <strong>Conectarte con cámara y micrófono.</strong> Y participar: es una clase, no un webinar.
          </li>
          <li>
            <strong>Tres minutos de feedback sincero.</strong> Lo bueno y, sobre todo, lo mejorable.
          </li>
        </ol>
      </section>

      <section className="axr-dr__section">
        <p className="axr-dr__kicker">Dudas</p>
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

      <section className="axr-dr__closing">
        <div className="axr-dr__mesh" aria-hidden />
        <div className="axr-dr__closing-inner">
          <h2>{nombre ? `${nombre}, te guardamos un sitio` : "Te guardamos un sitio"}</h2>
          <p>
            {dia.charAt(0).toUpperCase() + dia.slice(1)} · {horaMadrid(run.starts_at)}–{horaMadrid(run.ends_at)} · online y en directo con {nombreDocente}
          </p>
          {reserva("reserva-final")}
        </div>
      </section>

      {abierto && !yaTienePlaza ? (
        <a href="#reserva" className="axr-dr__sticky">
          Reservar plaza gratis <span aria-hidden>→</span>
        </a>
      ) : null}

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
