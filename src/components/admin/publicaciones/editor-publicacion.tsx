"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  anadirImagenes,
  borrarPublicacion,
  guardarVariante,
  programarVariante,
  quitarImagen,
  regenerarCanal,
} from "@/app/admin/publicaciones/actions";
import { SelectorImagenes } from "@/components/admin/publicaciones/nueva-publicacion";
import {
  LIMITE_LINKEDIN,
  LIMITE_X,
  NOMBRE_CANAL,
  PLIEGUE_LINKEDIN,
  longitudX,
  parseBody,
  revisar,
  type BlogBody,
  type LinkedInBody,
  type XBody,
} from "@/lib/social/canales";
import type { PubCopy } from "@/lib/i18n/publicaciones";
import type { SocialChannel, SocialImage, SocialVariant } from "@/lib/supabase/types";

const fill = (tpl: string, n: number) => tpl.replace("{n}", n.toLocaleString());
const palabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

// ── El blog se edita en texto ──────────────────────────────
//
// Los párrafos se escriben en un textarea separados por una línea en blanco.
// Se guardan crudos mientras se escribe y sólo se trocean al guardar: si se
// trocearan en cada tecla, la línea en blanco que separa dos párrafos
// desaparecería antes de poder escribir el segundo.

type BlogForm = Omit<BlogBody, "intro" | "sections"> & {
  intro: string;
  sections: { h2: string; answer: string; paragraphs: string; bullets: string }[];
};

const aParrafos = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const aLineas = (s: string) => s.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

function blogAForm(b: BlogBody): BlogForm {
  return {
    ...b,
    intro: b.intro.join("\n\n"),
    sections: b.sections.map((s) => ({ h2: s.h2, answer: s.answer, paragraphs: s.paragraphs.join("\n\n"), bullets: s.bullets.join("\n") })),
  };
}

function formABlog(f: BlogForm): BlogBody {
  return parseBody("blog", {
    ...f,
    intro: aParrafos(f.intro),
    sections: f.sections.map((s) => ({ h2: s.h2, answer: s.answer, paragraphs: aParrafos(s.paragraphs), bullets: aLineas(s.bullets) })),
  });
}

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
      <div className="axr-form__row">
        <label>{copy.liFold}</label>
        <div className="axr-pub-fold">
          {[...body.text].slice(0, PLIEGUE_LINKEDIN).join("")}
          {n > PLIEGUE_LINKEDIN ? "…" : ""}
        </div>
      </div>
    </div>
  );
}

function EditorBlog({ form, onChange, copy, disabled }: { form: BlogForm; onChange: (f: BlogForm) => void; copy: PubCopy; disabled: boolean }) {
  const set = <K extends keyof BlogForm>(k: K, v: BlogForm[K]) => onChange({ ...form, [k]: v });
  const setSec = (i: number, k: keyof BlogForm["sections"][number], v: string) =>
    set("sections", form.sections.map((s, j) => (j === i ? { ...s, [k]: v } : s)));
  const setFaq = (i: number, k: "q" | "a", v: string) => set("faqs", form.faqs.map((f, j) => (j === i ? { ...f, [k]: v } : f)));

  return (
    <div className="axr-form">
      <div className="axr-form__row">
        <label>{copy.bTitle}</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} disabled={disabled} />
        <Contador n={form.title.length} max={65} copy={copy} />
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{copy.bSlug}</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} disabled={disabled} />
          <small>/blog/{form.slug}</small>
        </div>
        <div className="axr-form__row">
          <label>{copy.bKeyword}</label>
          <input value={form.keyword} onChange={(e) => set("keyword", e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="axr-form__row">
        <label>{copy.bMeta}</label>
        <textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} disabled={disabled} />
        <Contador n={form.metaDescription.length} max={155} copy={copy} />
      </div>
      <div className="axr-form__row">
        <label>{copy.bIntro}</label>
        <textarea rows={6} value={form.intro} onChange={(e) => set("intro", e.target.value)} disabled={disabled} />
        <small>{copy.bIntroHint}</small>
      </div>

      {form.sections.map((s, i) => (
        <div className="axr-pub-section" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "0.8125rem" }}>{fill(copy.bSection, i + 1)}</strong>
            {!disabled ? (
              <button type="button" className="axr-btn axr-btn--ghost" onClick={() => set("sections", form.sections.filter((_, j) => j !== i))}>
                {copy.bRemoveSection}
              </button>
            ) : null}
          </div>
          <div className="axr-form__row">
            <label>{copy.bH2}</label>
            <input value={s.h2} onChange={(e) => setSec(i, "h2", e.target.value)} disabled={disabled} />
          </div>
          <div className="axr-form__row">
            <label>{copy.bAnswer}</label>
            <textarea rows={3} value={s.answer} onChange={(e) => setSec(i, "answer", e.target.value)} disabled={disabled} />
            <div className="axr-pub-count">{fill(copy.words, palabras(s.answer))}</div>
          </div>
          <div className="axr-form__row">
            <label>{copy.bParagraphs}</label>
            <textarea rows={8} value={s.paragraphs} onChange={(e) => setSec(i, "paragraphs", e.target.value)} disabled={disabled} />
            <small>{copy.bIntroHint}</small>
          </div>
          <div className="axr-form__row">
            <label>{copy.bBullets}</label>
            <textarea rows={3} value={s.bullets} onChange={(e) => setSec(i, "bullets", e.target.value)} disabled={disabled} />
          </div>
        </div>
      ))}
      {!disabled ? (
        <div>
          <button
            type="button"
            className="axr-btn axr-btn--ghost"
            onClick={() => set("sections", [...form.sections, { h2: "", answer: "", paragraphs: "", bullets: "" }])}
          >
            + {copy.bAddSection}
          </button>
        </div>
      ) : null}

      <div className="axr-pub-variant__sub">{copy.bFaqs}</div>
      {form.faqs.map((f, i) => (
        <div className="axr-pub-section" key={i}>
          <div className="axr-form__row">
            <label>{copy.bQ}</label>
            <input value={f.q} onChange={(e) => setFaq(i, "q", e.target.value)} disabled={disabled} />
          </div>
          <div className="axr-form__row">
            <label>{copy.bA}</label>
            <textarea rows={3} value={f.a} onChange={(e) => setFaq(i, "a", e.target.value)} disabled={disabled} />
          </div>
        </div>
      ))}
      {!disabled ? (
        <div>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => set("faqs", [...form.faqs, { q: "", a: "" }])}>
            + {copy.bAddFaq}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Una versión: editar, regenerar, programar ──────────────

export function EditorVariante({ variant, copy, locale }: { variant: SocialVariant; copy: PubCopy; locale: string }) {
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

  const actual = channel === "x" ? x : channel === "linkedin" ? li : formABlog(blog);
  const avisos = useMemo(() => revisar(channel, actual), [channel, actual]);
  const publicado = variant.status === "publicado";
  const programado = variant.status === "programado";

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

      {channel === "x" ? <EditorX body={x} onChange={cambia(setX)} copy={copy} disabled={publicado} /> : null}
      {channel === "linkedin" ? <EditorLinkedIn body={li} onChange={cambia(setLi)} copy={copy} disabled={publicado} /> : null}
      {channel === "blog" ? <EditorBlog form={blog} onChange={cambia(setBlog)} copy={copy} disabled={publicado} /> : null}

      <ul className="axr-pub-checks">
        {avisos.length === 0 ? <li className="is-ok">{copy.checksOk}</li> : null}
        {avisos.map((a, i) => (
          <li key={i} className={a.nivel === "error" ? "is-error" : "is-warn"}>
            {a.texto}
          </li>
        ))}
      </ul>

      {msg ? (
        <div className={msg.ok ? "axr-login__ok" : "axr-login__error"} style={{ marginTop: "0.75rem" }}>
          {msg.text}
        </div>
      ) : null}

      {!publicado ? (
        <>
          <div className="axr-pub-variant__bar">
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
          <div className="axr-pub-variant__bar">
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
                  disabled={pending || dirty || !cuando || avisos.some((a) => a.nivel === "error")}
                  title={dirty ? copy.saveFirst : undefined}
                  onClick={() => ejecutar(() => programarVariante(variant.id, new Date(cuando).toISOString()))}
                >
                  {copy.schedule}
                </button>
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
