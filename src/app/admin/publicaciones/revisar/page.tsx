import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL, revisar } from "@/lib/social/canales";
import { createClient } from "@/lib/supabase/server";
import type { SocialChannel, SocialStatus } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Por revisar
//
//  La bandeja de entrada: todo lo que la IA ha escrito y nadie ha decidido
//  todavía, y lo que ha fallado al salir. Cada publicación dice, canal a
//  canal, si está lista o qué le falta, y el botón abre el canal que más
//  atención necesita.
// ══════════════════════════════════════════════════════════

type Fila = {
  id: string;
  post_id: string;
  channel: SocialChannel;
  status: SocialStatus;
  body: unknown;
  error: string | null;
  updated_at: string;
  social_posts: { title: string; created_at: string } | null;
};

export default async function RevisarPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_variants")
    .select("id, post_id, channel, status, body, error, updated_at, social_posts(title, created_at)")
    .in("status", ["borrador", "error"])
    .order("updated_at", { ascending: false });
  const filas = (data ?? []) as unknown as Fila[];

  // Agrupadas por publicación, con lo que ha fallado primero.
  const grupos = new Map<string, Fila[]>();
  for (const f of filas) grupos.set(f.post_id, [...(grupos.get(f.post_id) ?? []), f]);
  const lista = [...grupos.entries()]
    .map(([postId, vs]) => {
      const canales = CANALES.map((c) => vs.find((v) => v.channel === c)).filter((v): v is Fila => Boolean(v)).map((v) => {
        const avisos = revisar(v.channel, v.body);
        return {
          v,
          errores: avisos.filter((a) => a.nivel === "error").length,
          avisos: avisos.filter((a) => a.nivel === "aviso").length,
        };
      });
      const conError = canales.some((c) => c.v.status === "error");
      // El canal que se abre: el que ha fallado, luego el que tiene errores, luego el primero.
      const abrir = canales.find((c) => c.v.status === "error") ?? canales.find((c) => c.errores) ?? canales[0];
      return { postId, title: vs[0].social_posts?.title ?? "—", creada: vs[0].social_posts?.created_at ?? vs[0].updated_at, canales, conError, abrir };
    })
    .sort((a, b) => Number(b.conError) - Number(a.conError) || b.creada.localeCompare(a.creada));

  const fecha = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short" });

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head">
        <h1>{copy.uReview}</h1>
        <p>{copy.uReviewLead}</p>
      </div>

      {lista.length === 0 ? (
        <section className="axr-pubcard">
          <div className="axr-pubempty axr-pubempty--big">
            <Icono n="ok" size={32} />
            <strong>{copy.uReviewNone}</strong>
            <span>{copy.uReviewNoneHint}</span>
            <Link href="/admin/publicaciones/nueva" className="axr-btn">
              <Icono n="mas" /> {copy.new}
            </Link>
          </div>
        </section>
      ) : (
        <ul className="axr-pubinbox">
          {lista.map((p) => (
            <li key={p.postId} className={p.conError ? "has-error" : undefined}>
              <div className="axr-pubinbox__main">
                <Link href={`/admin/publicaciones/${p.postId}?canal=${p.abrir.v.channel}`} className="axr-pubinbox__title">
                  {p.title}
                </Link>
                <span className="axr-pubinbox__date">{fill(copy.uWrittenOn, fecha(p.creada))}</span>
                <div className="axr-pubinbox__channels">
                  {p.canales.map(({ v, errores, avisos }) => (
                    <Link
                      key={v.channel}
                      href={`/admin/publicaciones/${p.postId}?canal=${v.channel}`}
                      className={`axr-pubcheck ${v.status === "error" || errores ? "is-error" : avisos ? "is-warn" : "is-ok"}`}
                      title={v.error ?? undefined}
                    >
                      <span className={`axr-pub-dot axr-pub-dot--${v.channel}`} />
                      <strong>{NOMBRE_CANAL[v.channel]}</strong>
                      <Icono n={v.status === "error" || errores ? "error" : avisos ? "aviso" : "ok"} size={14} />
                      <span>
                        {v.status === "error"
                          ? copy.uFailed
                          : errores
                            ? fill(copy.uErrors, errores)
                            : avisos
                              ? fill(copy.uWarnings, avisos)
                              : copy.uReady}
                      </span>
                    </Link>
                  ))}
                </div>
                {p.canales
                  .filter((c) => c.v.status === "error" && c.v.error)
                  .map((c) => (
                    <p key={c.v.id} className="axr-pubinbox__error">
                      <strong>{NOMBRE_CANAL[c.v.channel]}:</strong> {c.v.error}
                    </p>
                  ))}
              </div>
              <Link href={`/admin/publicaciones/${p.postId}?canal=${p.abrir.v.channel}`} className="axr-btn axr-pubinbox__btn">
                {copy.uReviewBtn} <Icono n="flecha" size={14} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
