import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { CampusHeader } from "@/components/campus-header";
import { UnlockDownload } from "@/components/campus/unlock-download";
import { usuarioActual } from "@/lib/data/usuario";
import { createClient } from "@/lib/supabase/server";
import { unlockContent, unlockFilename } from "@/lib/relampago/unlocks";
import { getI18n } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/dictionaries";
import { campusLessonCopy } from "@/lib/i18n/campus-v2-b";
import "@/app/(campus)/lecciones/lesson.scss";
import "./desbloqueo.scss";

// Un material de los que se ganan al terminar un curso relámpago.
//
// ⚠︎ La comprobación de acceso se hace AQUÍ y no sólo al pintar el botón en la
// portada del campus. Esconder un enlace no protege nada: quien conozca la
// URL —porque la vio una vez, porque se la pasaron— entraría igual. El
// candado tiene que estar en la puerta, no en el cartel.
export default async function UnlockPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  const contenido = unlockContent(key);
  if (!contenido) notFound();

  const [supabase, user, { t, locale }] = await Promise.all([createClient(), usuarioActual(), getI18n()]);
  if (!user) notFound();
  const c = campusLessonCopy[locale];

  // Tres consultas. Para un alumno tienen que decir que sí las dos primeras:
  //  · que el desbloqueo exista y tenga acceso al curso (la RLS de `unlocks`
  //    filtra por has_course_access),
  //  · y que se lo haya ganado de verdad.
  const [{ data: unlock }, { data: ganado }, { data: perfil }] = await Promise.all([
    supabase.from("unlocks").select("key, title, description, course").eq("key", key).maybeSingle(),
    supabase
      .from("user_unlocks")
      .select("unlock_key, granted_at")
      .eq("user_id", user.id)
      .eq("unlock_key", key)
      .maybeSingle(),
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
  ]);

  // El claustro entra sin haberlo ganado. No es un agujero: quien enseña el
  // curso tiene que poder revisar el material que se entrega al terminarlo,
  // y encerrarlo obligaría a un profesor a hacerse las 24 misiones para leer
  // su propio temario. Se marca como revisión para que no se confunda con
  // haberlo ganado.
  const revisando = perfil?.role === "profesor" || perfil?.role === "administrador";

  if (!unlock || (!ganado && !revisando)) notFound();

  const fecha = ganado?.granted_at
    ? new Date(ganado.granted_at).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <CampusHeader />

      <div className="axr-unlock">
        <nav className="axr-lsn__crumbs" aria-label="Breadcrumb">
          <Link href="/">{t.nav.home}</Link>
          <span aria-hidden>/</span>
          <span>{t.unlocks.title}</span>
          <span aria-hidden>/</span>
          <span>{unlock.title}</span>
        </nav>

        {/* ── La recompensa ── */}
        <header className={`axr-unlock__hero${ganado ? "" : " is-preview"}`}>
          <span className="axr-unlock__badge" aria-hidden>
            <Icono n={ganado ? "escudo" : "capas"} size={28} />
          </span>
          <div className="axr-unlock__hero-text">
            <span className={`axr-c-pill ${ganado ? "axr-c-pill--ok" : "axr-c-pill--warn"}`}>
              {ganado ? t.unlocks.earned : t.unlocks.staffPreview}
            </span>
            <span className="axr-unlock__eyebrow">{c.unlockEyebrow}</span>
            <h1>{unlock.title}</h1>
            {unlock.description && <p className="axr-unlock__lead">{unlock.description}</p>}
            {fecha ? <small className="axr-unlock__when">{fmt(c.unlockEarnedOn, { date: fecha })}</small> : null}
            {!ganado ? <small className="axr-unlock__when">{c.unlockStaff}</small> : null}
            <UnlockDownload
              filename={unlockFilename(key)}
              content={contenido}
              label={t.unlocks.download}
              copyLabel={c.unlockCopy}
              copiedLabel={c.unlockCopied}
            />
            <small className="axr-unlock__how">{c.unlockHow}</small>
          </div>
        </header>

        {/* ── El material ── */}
        <article className="axr-lsn__paper axr-unlock__paper">
          <span className="axr-lsn__label">{c.unlockWhat}</span>
          <div className="axr-lsn__content prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contenido}</ReactMarkdown>
          </div>
        </article>

        <div className="axr-unlock__back">
          <Link className="axr-btn axr-btn--ghost" href="/">
            ← {t.unlocks.backToCampus}
          </Link>
        </div>
      </div>
    </>
  );
}
