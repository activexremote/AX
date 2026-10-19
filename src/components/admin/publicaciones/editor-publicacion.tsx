"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  anadirImagenes,
  borrarPublicacion,
  guardarEnNevera,
  guardarVariante,
  programarVariante,
  quitarImagen,
  regenerarCanal,
} from "@/app/admin/publicaciones/actions";
import { EditorBlog, blogAForm, formABlog, type BlogForm } from "@/components/admin/publicaciones/editor-blog";
import { SelectorImagenes } from "@/components/admin/publicaciones/nueva-publicacion";
import { VistaBlog, VistaLinkedIn, VistaX } from "@/components/admin/publicaciones/vistas-previas";
import { articuloDesdeBlog } from "@/lib/social/blog";
import { diaMadrid } from "@/lib/social/calendario";
import {
  LIMITE_LINKEDIN,
  LIMITE_X,
  NOMBRE_CANAL,
  longitudX,
  parseBody,
  revisar,
  type LinkedInBody,
  type XBody,
} from "@/lib/social/canales";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";
import type { SocialChannel, SocialImage, SocialVariant } from "@/lib/supabase/types";

/** Para `<input type="datetime-local">`, en la hora de quien mira. */
function aLocal(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function Contador({ n, max, copy }: { n: number; max: number; copy: PubCopy }) {
  return <div className={`axr-pub-count${n > max ? " axr-pub-count--over" : ""}`}>{fill(copy.chars, n)} / {max.toLocaleString()}</div>;
}

// ── Editores por canal ─────────────────────────────────────

function EditorX({ body, onChange, copy, disabled }: { body: XBody; onChange: (b: XBody) => void; copy: PubCopy; disabled: boolean }) {
  const posts = [body.text, ...body.thread];
  const set = (i: number, v: string) => {
    const next = [...posts];
    next[i] = v;
    onChange({ text: next[0], thread: next.slice(1) });
  };
  const quitar = (i: number) => {
    const next = posts.filter((_, j) => j !== i);
    onChange({ text: next[0] ?? "", thread: next.slice(1) });
  };

  return (
    <div className="axr-form">
      {posts.map((p, i) => (
        <div className="axr-form__row" key={i}>
          <label style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{posts.length > 1 ? `${copy.xThread} · ${i + 1}/${posts.length}` : copy.xPost}</span>
            {posts.length > 1 && !disabled ? (
              <button type="button" className="axr-btn axr-btn--ghost" style={{ padding: "0 0.4rem", fontSize: "0.6875rem" }} onClick={() => quitar(i)}>
                {copy.xRemovePost}
              </button>
            ) : null}
          </label>
          <textarea rows={4} value={p} onChange={(e) => set(i, e.target.value)} disabled={disabled} />
          <Contador n={longitudX(p)} max={LIMITE_X} copy={copy} />
        </div>
      ))}
      {!disabled ? (
        <div>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => onChange({ ...body, thread: [...body.thread, ""] })}>
            + {copy.xAddPost}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function EditorLinkedIn({ body, onChange, copy, disabled }: { body: LinkedInBody; onChange: (b: LinkedInBody) => void; copy: PubCopy; disabled: boolean }) {
  const n = [...body.text].length;
  return (
    <div className="axr-form">
      <div className="axr-form__row">
        <textarea rows={16} value={body.text} onChange={(e) => onChange({ text: e.target.value })} disabled={disabled} />
        <Contador n={n} max={LIMITE_LINKEDIN} copy={copy} />
      </div>
    </div>
  );
}

// ── Una versión: editar, regenerar, programar ──────────────

export function EditorVariante({
  variant,
  images,
  language,
  copy,
  locale,
}: {
  variant: SocialVariant;
  images: SocialImage[];
  language: "es" | "en";
  copy: PubCopy;
  locale: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [instr, setInstr] = useState("");
  const [cuando, setCuando] = useState("");

  const channel = variant.channel;
  const [x, setX] = useState<XBody>(() => parseBody("x", variant.body));
  const [li, setLi] = useState<LinkedInBody>(() => parseBody("linkedin", variant.body));
  const [blog, setBlog] = useState<BlogForm>(() => blogAForm(parseBody("blog", variant.body)));

  const actual = useMemo(() => (channel === "x" ? x : channel === "linkedin" ? li : formABlog(blog)), [channel, x, li, blog]);
  const avisos = useMemo(() => revisar(channel, actual), [channel, actual]);
  // El artículo tal como lo pintará el blog: la primera imagen hace de portada.
  const articulo = useMemo(
    () => (channel === "blog" ? articuloDesdeBlog(formABlog(blog), { locale: language, fecha: diaMadrid(new Date()), hero: images[0] ?? null }) : null),
    [channel, blog, language, images],
  );
  const publicado = variant.status === "publicado";
  const programado = variant.status === "programado";
  const enNevera = variant.status === "nevera";
  const hayErrores = avisos.some((a) => a.nivel === "error");

  // La fecha por defecto se calcula en el navegador, en su hora: en el
  // servidor (UTC) saldría otra y React se quejaría al hidratar.
  useEffect(() => {
    if (variant.scheduled_at) setCuando(aLocal(new Date(variant.scheduled_at)));
    else {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      setCuando(aLocal(d));
    }
  }, [variant.scheduled_at]);

  function cambia<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v);
      setDirty(true);
      setMsg(null);
    };
  }

  function ejecutar(fn: () => Promise<{ ok?: boolean; error?: string }>, okText?: string) {
    setMsg(null);
    startTransition(async () => {
      const r = await fn();
      if (r.error) setMsg({ ok: false, text: r.error });
      else {
        if (okText) setMsg({ ok: true, text: okText });
        router.refresh();
      }
    });
  }

  const guardar = () =>
    ejecutar(async () => {
      const r = await guardarVariante(variant.id, actual);
      if (!r.error) setDirty(false);
      return r;
    }, copy.saved);

  const fecha = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "full", timeStyle: "short" });

  return (
    <div className="axr-admin-card axr-pub-variant">
      <div className="axr-pub-variant__head">
        <h2>{NOMBRE_CANAL[channel]}</h2>
        <span className={`axr-pub-pill axr-pub-pill--${variant.status}`}>
          {copy[`status_${variant.status}`]}
          {programado && variant.scheduled_at ? ` · ${fecha(variant.scheduled_at)}` : null}
          {publicado && variant.published_at ? ` · ${fecha(variant.published_at)}` : null}
        </span>
      </div>

      {variant.status === "error" && variant.error ? <div className="axr-login__error">{variant.error}</div> : null}
      {publicado && variant.external_url ? (
        <p className="axr-pub-meta">
          <a href={variant.external_url} target="_blank" rel="noreferrer">
            {variant.external_url}
          </a>
        </p>
      ) : null}

      {/* Editor a un lado y, al otro, cómo quedará publicado. En pantallas
          estrechas, uno debajo del otro. */}
      <div className={`axr-pub-split axr-pub-split--${channel}`}>
        <div className="axr-pub-split__edit">
          {channel === "x" ? <EditorX body={x} onChange={cambia(setX)} copy={copy} disabled={publicado} /> : null}
          {channel === "linkedin" ? <EditorLinkedIn body={li} onChange={cambia(setLi)} copy={copy} disabled={publicado} /> : null}
          {channel === "blog" ? <EditorBlog form={blog} onChange={cambia(setBlog)} copy={copy} locale={locale} disabled={publicado} /> : null}

          <ul className="axr-pub-checks">
            {avisos.length === 0 ? <li className="is-ok">{copy.checksOk}</li> : null}
            {avisos.map((a, i) => (
              <li key={i} className={a.nivel === "error" ? "is-error" : "is-warn"}>
                {a.texto}
              </li>
            ))}
          </ul>
        </div>
        <div className="axr-pub-split__preview">
          {channel === "x" ? <VistaX body={x} images={images} copy={copy} /> : null}
          {channel === "linkedin" ? <VistaLinkedIn body={li} images={images} copy={copy} /> : null}
          {articulo ? <VistaBlog article={articulo} variantId={variant.id} copy={copy} /> : null}
        </div>
      </div>

      {msg ? (
        <div className={msg.ok ? "axr-login__ok" : "axr-login__error"} style={{ marginTop: "0.75rem" }}>
          {msg.text}
        </div>
      ) : null}

      {!publicado ? (
        <>
          <div className="axr-pub-variant__sub">{copy.regenHint}</div>
          <div className="axr-pub-variant__bar" style={{ marginTop: 0, paddingTop: 0, border: 0 }}>
            <button type="button" className="axr-btn" onClick={guardar} disabled={pending || !dirty}>
              {pending ? copy.saving : dirty ? copy.save : copy.saved}
            </button>
            <input type="text" value={instr} onChange={(e) => setInstr(e.target.value)} placeholder={copy.regenPlaceholder} maxLength={1000} />
            <button
              type="button"
              className="axr-btn axr-btn--ghost"
              disabled={pending}
              onClick={() => ejecutar(() => regenerarCanal(variant.post_id, channel, instr))}
            >
              {pending ? copy.regenerating : copy.regenerate}
            </button>
          </div>
          <div className="axr-pub-variant__sub">{copy.scheduleHint}</div>
          <div className="axr-pub-variant__bar" style={{ marginTop: 0, paddingTop: 0, border: 0 }}>
            {/* Programada: sólo se puede deshacer. Por revisar o en la nevera:
                se le pone fecha; y lo que está por revisar puede ir a la nevera. */}
            {programado ? (
              <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => ejecutar(() => programarVariante(variant.id, null))}>
                {copy.unschedule}
              </button>
            ) : (
              <>
                <input type="datetime-local" value={cuando} onChange={(e) => setCuando(e.target.value)} />
                <button
                  type="button"
                  className="axr-btn"
                  disabled={pending || dirty || !cuando || hayErrores}
                  title={dirty ? copy.saveFirst : undefined}
                  onClick={() => ejecutar(() => programarVariante(variant.id, new Date(cuando).toISOString()))}
                >
                  {copy.schedule}
                </button>
                {enNevera ? (
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => ejecutar(() => programarVariante(variant.id, null))}>
                    {copy.unschedule}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="axr-btn axr-btn--ghost"
                    disabled={pending || dirty || hayErrores}
                    onClick={() => ejecutar(() => guardarEnNevera(variant.id))}
                  >
                    {copy.toFridge}
                  </button>
                )}
                {dirty ? <span className="axr-pub-count">{copy.saveFirst}</span> : null}
              </>
            )}
          </div>
          <p className="axr-pub-note">{copy.publishNote}</p>
        </>
      ) : null}
    </div>
  );
}

// ── Canal sin generar ──────────────────────────────────────

export function GenerarCanal({ postId, channel, copy }: { postId: string; channel: SocialChannel; copy: PubCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="axr-admin-card axr-pub-variant">
      <div className="axr-pub-variant__head">
        <h2>{NOMBRE_CANAL[channel]}</h2>
      </div>
      {error ? <div className="axr-login__error">{error}</div> : null}
      <p style={{ margin: "0 0 1rem", color: "var(--axr-text-helper)", fontSize: "0.875rem" }}>{copy.notGenerated}</p>
      <button
        type="button"
        className="axr-btn"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const r = await regenerarCanal(postId, channel, "");
            if (r.error) setError(r.error);
            router.refresh();
          })
        }
      >
        {pending ? copy.regenerating : copy.generateChannel}
      </button>
    </div>
  );
}

// ── Imágenes y borrado ─────────────────────────────────────

export function ImagenesPublicacion({ postId, images, copy }: { postId: string; images: SocialImage[]; copy: PubCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  return (
    <div>
      {error ? <div className="axr-login__error">{error}</div> : null}
      {images.length ? (
        <div className="axr-pub-images" style={{ marginBottom: "1rem" }}>
          {images.map((img) => (
            <figure key={img.path}>
              {/* eslint-disable-next-line @next/next/no-img-element -- imagen pública de Storage */}
              <img src={img.url} alt={img.alt} />
              {img.alt ? <figcaption>{img.alt}</figcaption> : null}
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const r = await quitarImagen(postId, img.path);
                    if (r.error) setError(r.error);
                    router.refresh();
                  })
                }
              >
                {copy.removeImage}
              </button>
            </figure>
          ))}
        </div>
      ) : null}
      {images.length < 4 ? (
        <form
          key={formKey}
          className="axr-form"
          action={(fd) =>
            startTransition(async () => {
              setError(null);
              const r = await anadirImagenes(postId, fd);
              if (r.error) setError(r.error);
              setFormKey((k) => k + 1);
              router.refresh();
            })
          }
        >
          <SelectorImagenes copy={copy} max={4 - images.length} />
          <div>
            <button type="submit" className="axr-btn axr-btn--ghost" disabled={pending}>
              {copy.addImages}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export function BorrarPublicacion({ postId, copy }: { postId: string; copy: PubCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmación en la propia página: un `confirm()` del navegador bloquea la
  // pestaña y no se puede maquetar.
  if (!confirmar) {
    return (
      <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setConfirmar(true)}>
        {copy.deletePost}
      </button>
    );
  }
  return (
    <div style={{ display: "grid", gap: "0.4rem", justifyItems: "end" }}>
      <span style={{ fontSize: "0.8125rem" }}>{copy.confirmDelete}</span>
      {error ? <span style={{ color: "#da1e28", fontSize: "0.8125rem" }}>{error}</span> : null}
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setConfirmar(false)} disabled={pending}>
          ✕
        </button>
        <button
          type="button"
          className="axr-btn"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await borrarPublicacion(postId);
              if (r.error) setError(r.error);
              else router.push("/admin/publicaciones");
            })
          }
        >
          {copy.deletePost}
        </button>
      </div>
    </div>
  );
}
