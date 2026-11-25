import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { cambiarCuenta, entrarParaResponder } from "@/app/dry-run/[slug]/encuesta/actions";
import { BrandMark } from "@/components/brand-mark";
import { FormularioEncuesta } from "@/components/dry-run/formulario-encuesta";
import { LocaleToggle } from "@/components/locale-toggle";
import { bloquesEn } from "@/lib/dry-run/encuesta";
import { getSesionPublica } from "@/lib/dry-run/datos";
import { docenteDe } from "@/lib/dry-run/docente";
import { invitadoDe, miRespuesta } from "@/lib/dry-run/encuesta-datos";
import { diaLargo } from "@/lib/dry-run/tiempo";
import { getI18n } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import "@/app/dry-run/dry-run.scss";
import "@/app/dry-run/[slug]/encuesta/encuesta.scss";

// ══════════════════════════════════════════════════════════
//  /dry-run/<slug>/encuesta — la encuesta de después de la clase
//
//  Un solo enlace para todos los invitados. Para responder hay que entrar
//  con Google: la respuesta queda a nombre de esa cuenta y el panel sabe
//  quién ha contestado (y quién falta). Se puede volver a entrar y cambiar
//  las respuestas; cuenta la última.
// ══════════════════════════════════════════════════════════

type Params = { slug: string };

const TXT = {
  es: {
    meta: "Tu opinión",
    desc: "Cinco minutos para contarnos qué te pareció la clase de prueba.",
    eyebrow: "Encuesta",
    titulo: (n: string) => (n ? `${n}, ¿qué te pareció la clase?` : "¿Qué te pareció la clase?"),
    lead: "Son unos cinco minutos. Lo bueno nos ayuda, pero lo que más nos sirve es lo mejorable: lo que nos cuentes cambia la versión final del curso.",
    google: "No hemos podido conectar con Google. Vuelve a intentarlo.",
    cerradaT: "La encuesta todavía no está abierta",
    cerradaB: "Se abre cuando empieza la clase. Guarda este enlace y vuelve al terminar.",
    loginT: "Entra con tu cuenta de Google para responder",
    loginB: "Usa la misma cuenta con la que reservaste tu plaza. Así sabemos que la respuesta es tuya y no te volvemos a escribir para pedírtela.",
    loginBtn: "Entrar con Google y responder",
    como: "Respondes como",
    cambiar: "¿No eres tú? Cambiar de cuenta",
    fuera: "No encontramos esta cuenta en la lista de invitados. Puedes responder igualmente; si reservaste con otra cuenta de Google, cámbiala arriba.",
    ya: (d: string) => `Ya respondiste el ${d}. Puedes cambiar lo que quieras y volver a guardar: cuenta la última versión.`,
  },
  en: {
    meta: "Your feedback",
    desc: "Five minutes to tell us what you thought of the trial class.",
    eyebrow: "Survey",
    titulo: (n: string) => (n ? `${n}, what did you think of the class?` : "What did you think of the class?"),
    lead: "It takes about five minutes. The good things help, but what helps most is what could be better: what you tell us changes the final version of the course.",
    google: "We couldn't connect to Google. Please try again.",
    cerradaT: "The survey isn't open yet",
    cerradaB: "It opens when the class starts. Keep this link and come back afterwards.",
    loginT: "Sign in with your Google account to answer",
    loginB: "Use the same account you booked your seat with. That way we know the answer is yours and we won't email you asking for it again.",
    loginBtn: "Sign in with Google and answer",
    como: "Answering as",
    cambiar: "Not you? Switch account",
    fuera: "We can't find this account on the guest list. You can still answer; if you booked with another Google account, switch it above.",
    ya: (d: string) => `You already answered on ${d}. You can change anything and save again: the latest version counts.`,
  },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const [sesion, { locale }] = await Promise.all([getSesionPublica(slug), getI18n()]);
  const x = TXT[locale];
  return {
    title: sesion ? `${x.meta} · ${sesion.run.title}` : x.eyebrow,
    description: x.desc,
    robots: { index: false, follow: false },
  };
}

export default async function EncuestaDryRun({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<{ estado?: string }> }) {
  const [{ slug }, { estado }, { locale }] = await Promise.all([params, searchParams, getI18n()]);
  const x = TXT[locale];
  const sesion = await getSesionPublica(slug);
  if (!sesion) notFound();
  const { run, modulo } = sesion;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const perfil = user
    ? (await createAdminClient().from("profiles").select("full_name, email").eq("id", user.id).maybeSingle()).data
    : null;
  const email = perfil?.email || user?.email || "";
  const nombre = perfil?.full_name || null;
  const [previa, guest] = user && email ? await Promise.all([miRespuesta(run.id, user.id), invitadoDe(run.id, { id: user.id, email, nombre })]) : [null, null];

  const abierta = Date.now() >= new Date(run.starts_at).getTime();
  const docente = docenteDe(run.teacher_name)?.name ?? run.teacher_name;
  const primerNombre = (guest?.full_name || nombre || "").trim().split(/\s+/)[0];

  return (
    <main className="axr-dr axr-enc">
      <header className="axr-dr__bar">
        <Link href="/bienvenida" className="axr-dr__brand" prefetch={false}>
          <BrandMark size={20} />
          <span>ActiveXRemote</span>
        </Link>
        <span className="axr-enc__bar-right">
          <span className="axr-dr__bar-tag">
            Dry run · {locale === "en" ? "Module" : "Módulo"} {modulo.numero}
          </span>
          <LocaleToggle tone="dark" />
        </span>
      </header>

      <section className="axr-enc__hero">
        <p className="axr-enc__eyebrow">
          {x.eyebrow} · {diaLargo(run.starts_at, locale)}
        </p>
        <h1>{x.titulo(primerNombre)}</h1>
        <p>{x.lead}</p>
      </section>

      <section className="axr-enc__body">
        {estado === "google" ? <p className="axr-enc__error">{x.google}</p> : null}

        {!abierta ? (
          <div className="axr-enc__card">
            <h2>{x.cerradaT}</h2>
            <p>{x.cerradaB}</p>
          </div>
        ) : !user ? (
          <form action={entrarParaResponder} className="axr-enc__card axr-enc__login">
            <input type="hidden" name="slug" value={run.slug} />
            <h2>{x.loginT}</h2>
            <p>{x.loginB}</p>
            <button type="submit" className="axr-dr__cta">
              <span className="axr-dr__cta-g">
                <GoogleG />
              </span>
              {x.loginBtn} <span aria-hidden>→</span>
            </button>
          </form>
        ) : (
          <>
            <form action={cambiarCuenta} className="axr-enc__who">
              <input type="hidden" name="slug" value={run.slug} />
              <span>
                {x.como} <strong>{nombre || email}</strong>
                {nombre ? <small> · {email}</small> : null}
              </span>
              <button type="submit">{x.cambiar}</button>
            </form>
            {!guest ? (
              <p className="axr-enc__note">{x.fuera}</p>
            ) : null}
            {previa?.source === "encuesta" ? (
              <p className="axr-enc__note">{x.ya(diaLargo(previa.updated_at, locale))}</p>
            ) : null}
            <FormularioEncuesta slug={run.slug} previas={previa?.answers ?? null} docente={docente} bloques={bloquesEn(locale)} locale={locale} />
          </>
        )}
      </section>
    </main>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
