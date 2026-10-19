"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  anadirImagenes,
  borrarPublicacion,
  guardarEnNevera,
  guardarVariante,
  programarEnProximoHueco,
  programarVariante,
  quitarImagen,
  regenerarCanal,
} from "@/app/admin/publicaciones/actions";
import { EditorBlog, blogAForm, formABlog, type BlogForm } from "@/components/admin/publicaciones/editor-blog";
import { Icono } from "@/components/admin/publicaciones/iconos";
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

export type EstadoCanal = { errores: number; avisos: number; dirty: boolean };
export type CuentaVista = { nombre: string | null; usuario: string | null; avatar: string | null };

/** Escrita → revisada → con fecha (o en la nevera) → publicada. */
function Progreso({ status, copy }: { status: SocialVariant["status"]; copy: PubCopy }) {
  const paso = status === "publicado" ? 4 : status === "programado" || status === "nevera" ? 3 : 1;
  const pasos = [copy.uStepWritten, copy.uStepReviewed, status === "nevera" ? copy.status_nevera : copy.uStepScheduled, copy.uStepPublished];
  return (
    <ol className="axr-studio__steps" aria-label={copy.uProgress}>
      {pasos.map((p, i) => (
        <li key={p} className={i < paso ? "is-done" : i === paso ? "is-now" : ""}>
          <span>{i < paso ? <Icono n="ok" size={12} /> : i + 1}</span>
          {p}
        </li>
      ))}
    </ol>
  );
}

export function EditorVariante({
  variant,
  images,
  language,
  copy,
  locale,
  proximoHueco,
  cuenta,
  onEstado,
}: {
  variant: SocialVariant;
  images: SocialImage[];
  language: "es" | "en";
  copy: PubCopy;
  locale: string;
  /** Primer hueco libre del ritmo de este canal (ISO), si lo hay. */
  proximoHueco: string | null;
  cuenta?: CuentaVista | null;
  onEstado?: (e: EstadoCanal) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [instr, setInstr] = useState("");
  const [cuando, setCuando] = useState("");
  const [panel, setPanel] = useState<"regenerar" | "programar" | null>(null);

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
  const errores = avisos.filter((a) => a.nivel === "error").length;
  const hayErrores = errores > 0;

  // Las pestañas enseñan si el canal tiene errores o cambios sin guardar.
  useEffect(() => {
    onEstado?.({ errores, avisos: avisos.length - errores, dirty });
  }, [errores, avisos.length, dirty, onEstado]);

  // La fecha por defecto se calcula en el navegador, en su hora: en el
  // servidor (UTC) saldría otra y React se quejaría al hidratar.
  useEffect(() => {
    const base = variant.scheduled_at ?? proximoHueco;
    if (base) setCuando(aLocal(new Date(base)));
    else {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      setCuando(aLocal(d));
    }
  }, [variant.scheduled_at, proximoHueco]);

  // Avisar antes de salir con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function cambia<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v);
      setDirty(true);
      setMsg(null);
    };
  }

  /**
   * Ejecuta una acción guardando antes lo que haya sin guardar: programar
   * lo que se ve en pantalla, no la última versión guardada.
   */
  function ejecutar(fn: () => Promise<{ ok?: boolean; error?: string; cuando?: string }>, okText?: string | ((r: { cuando?: string }) => string)) {
    setMsg(null);
    startTransition(async () => {
      if (dirty) {
        const g = await guardarVariante(variant.id, actual);
        if (g.error) {
          setMsg({ ok: false, text: g.error });
          return;
        }
        setDirty(false);
      }
      const r = await fn();
      if (r.error) setMsg({ ok: false, text: r.error });
      else {
        setPanel(null);
        if (okText) setMsg({ ok: true, text: typeof okText === "function" ? okText(r) : okText });
        router.refresh();
      }
    });
  }

  const guardar = () => ejecutar(async () => ({ ok: true }), copy.saved);
  const fecha = (iso: string) => new Date(iso).toLocaleString(locale, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="axr-studio">
      <div className="axr-studio__top">
        <Progreso status={variant.status} copy={copy} />
        {programado && variant.scheduled_at ? (
          <span className="axr-studio__when">
            <Icono n="reloj" size={14} /> {fill(copy.uGoesOut, fecha(variant.scheduled_at))}
          </span>
        ) : null}
        {publicado && variant.published_at ? (
          <span className="axr-studio__when">
            <Icono n="ok" size={14} /> {fill(copy.uWentOut, fecha(variant.published_at))}
            {variant.external_url ? (
              <a href={variant.external_url} target="_blank" rel="noreferrer">
                {copy.uSeePost} ↗
              </a>
            ) : null}
          </span>
        ) : null}
      </div>

      {variant.status === "error" && variant.error ? <div className="axr-login__error">{variant.error}</div> : null}

      <div className={`axr-pub-split axr-pub-split--${channel}`}>
        <div className="axr-pub-split__edit">
          {channel === "x" ? <EditorX body={x} onChange={cambia(setX)} copy={copy} disabled={publicado} /> : null}
          {channel === "linkedin" ? <EditorLinkedIn body={li} onChange={cambia(setLi)} copy={copy} disabled={publicado} /> : null}
          {channel === "blog" ? <EditorBlog form={blog} onChange={cambia(setBlog)} copy={copy} locale={locale} disabled={publicado} /> : null}
        </div>
        <div className="axr-pub-split__preview">
          <ul className="axr-pub-checks">
            {avisos.length === 0 ? <li className="is-ok">{copy.checksOk}</li> : null}
            {avisos.map((a, i) => (
              <li key={i} className={a.nivel === "error" ? "is-error" : "is-warn"}>
                {a.texto}
              </li>
            ))}
          </ul>
          {channel === "x" ? <VistaX body={x} images={images} copy={copy} cuenta={cuenta} /> : null}
          {channel === "linkedin" ? <VistaLinkedIn body={li} images={images} copy={copy} cuenta={cuenta} /> : null}
          {articulo ? <VistaBlog article={articulo} variantId={variant.id} copy={copy} /> : null}
        </div>
      </div>

      {!publicado ? (
        <div className="axr-studio__bar">
          {panel === "regenerar" ? (
            <div className="axr-studio__drawer">
              <label htmlFor={`regen-${variant.id}`}>{copy.regenHint}</label>
              <div>
                <input
                  id={`regen-${variant.id}`}
                  type="text"
                  value={instr}
                  onChange={(e) => setInstr(e.target.value)}
                  placeholder={copy.regenPlaceholder}
                  maxLength={1000}
                  autoFocus
                />
                <button
                  type="button"
                  className="axr-btn"
                  disabled={pending}
                  onClick={() => {
                    setMsg(null);
                    startTransition(async () => {
                      const r = await regenerarCanal(variant.post_id, channel, instr);
                      if (r.error) setMsg({ ok: false, text: r.error });
                      else router.refresh();
                    });
                  }}
                >
                  <Icono n="chispa" /> {pending ? copy.regenerating : copy.regenerate}
                </button>
              </div>
              {dirty ? <small>{copy.uRegenLoses}</small> : null}
            </div>
          ) : null}

          {panel === "programar" ? (
            <div className="axr-studio__drawer">
              {proximoHueco ? (
                <button
                  type="button"
                  className="axr-studio__slot"
                  disabled={pending || hayErrores}
                  onClick={() => ejecutar(() => programarEnProximoHueco(variant.id), (r) => fill(copy.uScheduledOk, r.cuando ? fecha(r.cuando) : ""))}
                >
                  <Icono n="chispa" size={18} />
                  <span>
                    <strong>{copy.uNextSlot}</strong>
                    <em>{fecha(proximoHueco)}</em>
                  </span>
                  <Icono n="flecha" size={16} />
                </button>
              ) : null}
              <div className="axr-studio__custom">
                <label htmlFor={`cuando-${variant.id}`}>{copy.uOrPick}</label>
                <input id={`cuando-${variant.id}`} type="datetime-local" value={cuando} onChange={(e) => setCuando(e.target.value)} />
                <button
                  type="button"
                  className="axr-btn axr-btn--ghost"
                  disabled={pending || !cuando || hayErrores}
                  onClick={() => ejecutar(() => programarVariante(variant.id, new Date(cuando).toISOString()), fill(copy.uScheduledOk, fecha(new Date(cuando).toISOString())))}
                >
                  {copy.schedule}
                </button>
              </div>
            </div>
          ) : null}

          {msg ? (
            <div className={`axr-studio__msg ${msg.ok ? "is-ok" : "is-error"}`} role="status">
              <Icono n={msg.ok ? "ok" : "error"} size={14} /> {msg.text}
            </div>
          ) : null}

          <div className="axr-studio__actions">
            <span className={`axr-studio__state${dirty ? " is-dirty" : ""}`}>
              {dirty ? copy.unsaved : copy.uAllSaved}
              {hayErrores ? <em> · {fill(copy.uErrors, errores)}</em> : null}
            </span>
            <button type="button" className="axr-btn axr-btn--ghost" onClick={guardar} disabled={pending || !dirty}>
              {pending && dirty ? copy.saving : copy.save}
            </button>
            <button
              type="button"
              className={`axr-btn axr-btn--ghost${panel === "regenerar" ? " is-on" : ""}`}
              onClick={() => setPanel(panel === "regenerar" ? null : "regenerar")}
              aria-expanded={panel === "regenerar"}
            >
              <Icono n="chispa" /> {copy.regenerate}
            </button>
            <span className="axr-studio__spacer" />
            {programado ? (
              <>
                <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => setPanel(panel === "programar" ? null : "programar")}>
                  {copy.uChangeDate}
                </button>
                <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => ejecutar(() => programarVariante(variant.id, null), copy.uUnscheduled)}>
                  {copy.uRemoveDate}
                </button>
              </>
            ) : (
              <>
                {enNevera ? (
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => ejecutar(() => programarVariante(variant.id, null), copy.uOutOfFridge)}>
                    {copy.uTakeOut}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="axr-btn axr-btn--ghost"
                    disabled={pending || hayErrores}
                    title={hayErrores ? copy.uFixFirst : copy.uFridgeHint}
                    onClick={() => ejecutar(() => guardarEnNevera(variant.id), copy.uInFridge)}
                  >
                    <Icono n="nevera" /> {copy.toFridge}
                  </button>
                )}
                <button
                  type="button"
                  className="axr-btn"
                  disabled={pending || hayErrores}
                  title={hayErrores ? copy.uFixFirst : undefined}
                  onClick={() => setPanel(panel === "programar" ? null : "programar")}
                  aria-expanded={panel === "programar"}
                >
                  <Icono n="calendario" /> {copy.schedule}
                </button>
              </>
            )}
          </div>
        </div>
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
    <div className="axr-pubempty axr-pubempty--big">
      <Icono n="chispa" size={28} />
      <strong>{fill(copy.uNotGenerated, NOMBRE_CANAL[channel])}</strong>
      <span>{copy.uNotGeneratedHint}</span>
      {error ? <div className="axr-login__error">{error}</div> : null}
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
        <Icono n="chispa" /> {pending ? copy.regenerating : fill(copy.uGenerateFor, NOMBRE_CANAL[channel])}
      </button>
    </div>
  );
}

// ── Las pestañas de canal ──────────────────────────────────

export type CanalEstudio = {
  channel: SocialChannel;
  variant: SocialVariant | null;
  /** Comprobaciones de la versión guardada, para la pestaña antes de que el editor monte. */
  inicial: EstadoCanal;
};

export function Estudio({
  postId,
  canales,
  inicial,
  images,
  language,
  copy,
  locale,
  proximoHueco,
  cuentas,
}: {
  postId: string;
  canales: CanalEstudio[];
  inicial: SocialChannel;
  images: SocialImage[];
  language: "es" | "en";
  copy: PubCopy;
  locale: string;
  proximoHueco: Record<SocialChannel, string | null>;
  cuentas: Partial<Record<SocialChannel, CuentaVista | null>>;
}) {
  const [activo, setActivo] = useState<SocialChannel>(inicial);
  const [estados, setEstados] = useState<Record<string, EstadoCanal>>(() => Object.fromEntries(canales.map((c) => [c.channel, c.inicial])));
  const setters = useMemo(
    () =>
      Object.fromEntries(
        canales.map((c) => [c.channel, (e: EstadoCanal) => setEstados((prev) => (sameEstado(prev[c.channel], e) ? prev : { ...prev, [c.channel]: e }))]),
      ) as Record<SocialChannel, (e: EstadoCanal) => void>,
    [canales],
  );

  const elegir = (c: SocialChannel) => {
    setActivo(c);
    // La pestaña queda en la URL (para volver o compartirla) sin recargar.
    const url = new URL(window.location.href);
    url.searchParams.set("canal", c);
    window.history.replaceState(null, "", url);
  };

  return (
    <section className="axr-studio-wrap">
      <div className="axr-studio-tabs" role="tablist" aria-label={copy.fChannels}>
        {canales.map(({ channel, variant }) => {
          const e = estados[channel];
          const icono = !variant ? null : variant.status === "error" || e?.errores ? "error" : e?.avisos ? "aviso" : "ok";
          return (
            <button
              key={channel}
              type="button"
              role="tab"
              id={`tab-${channel}`}
              aria-selected={activo === channel}
              aria-controls={`panel-${channel}`}
              className={`axr-studio-tab axr-studio-tab--${channel}${activo === channel ? " is-active" : ""}`}
              onClick={() => elegir(channel)}
            >
              <span className={`axr-pub-dot axr-pub-dot--${channel}`} />
              <strong>{NOMBRE_CANAL[channel]}</strong>
              {variant ? (
                <span className={`axr-pubstate axr-pubstate--${variant.status}`}>{copy[`status_${variant.status}`]}</span>
              ) : (
                <span className="axr-pubstate">{copy.uNotYet}</span>
              )}
              {icono ? (
                <span className={`axr-studio-tab__check is-${icono}`} title={e?.errores ? fill(copy.uErrors, e.errores) : e?.avisos ? fill(copy.uWarnings, e.avisos) : copy.uReady}>
                  <Icono n={icono} size={14} />
                </span>
              ) : null}
              {e?.dirty ? <span className="axr-studio-tab__dirty" title={copy.unsaved} /> : null}
            </button>
          );
        })}
      </div>

      {canales.map(({ channel, variant }) => (
        // Todos montados y sólo uno a la vista: cambiar de pestaña no pierde lo escrito.
        <div key={channel} role="tabpanel" id={`panel-${channel}`} aria-labelledby={`tab-${channel}`} hidden={activo !== channel} className="axr-studio-panel">
          {variant ? (
            <EditorVariante
              // La clave cambia cuando cambia el contenido guardado: tras
              // regenerar, el editor se vuelve a montar con el texto nuevo.
              key={`${variant.id}-${variant.updated_at}`}
              variant={variant}
              images={images}
              language={language}
              copy={copy}
              locale={locale}
              proximoHueco={proximoHueco[channel]}
              cuenta={cuentas[channel]}
              onEstado={setters[channel]}
            />
          ) : (
            <GenerarCanal postId={postId} channel={channel} copy={copy} />
          )}
        </div>
      ))}
    </section>
  );
}

function sameEstado(a: EstadoCanal | undefined, b: EstadoCanal) {
  return a !== undefined && a.errores === b.errores && a.avisos === b.avisos && a.dirty === b.dirty;
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
