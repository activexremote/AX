import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CampusHeader } from "@/components/campus-header";
import { UnlockDownload } from "@/components/campus/unlock-download";
import { createClient } from "@/lib/supabase/server";
import { unlockContent, unlockFilename } from "@/lib/relampago/unlocks";
import { getI18n } from "@/lib/i18n/server";
import "@/app/(campus)/lecciones/lesson.scss";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

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

  const { t } = await getI18n();

  return (
    <>
      <CampusHeader />

      <div className="axr-lesson-bar">
        <div className="axr-lesson-bar__inner">
          <Link href="/">{t.lesson.breadcrumb}</Link>
          <span aria-hidden>·</span>
          <span>{t.unlocks.title}</span>
          <span aria-hidden>·</span>
          <span>{unlock.title}</span>
        </div>
      </div>

      <div className="axr-lesson axr-lesson--unlock">
        <main className="axr-lesson__main">
          <span className="axr-section-tag">
            {ganado ? t.unlocks.earned : t.unlocks.staffPreview}
          </span>
          <h1>{unlock.title}</h1>
          {unlock.description && <p className="axr-unlock__lead">{unlock.description}</p>}

          <UnlockDownload
            filename={unlockFilename(key)}
            content={contenido}
            label={t.unlocks.download}
          />

          <article className="axr-lesson__content prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contenido}</ReactMarkdown>
          </article>

          <div className="axr-lesson__cta-bar">
            <Link className="axr-btn axr-btn--ghost" href="/">
              ← {t.unlocks.backToCampus}
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
