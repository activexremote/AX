"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import type { Article } from "@/app/blog/types";
import { PLIEGUE_LINKEDIN, type LinkedInBody, type XBody } from "@/lib/social/canales";
import type { PubCopy } from "@/lib/i18n/publicaciones";
import type { SocialImage } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Cómo quedará publicado
//
//  Una maqueta de cada red con el texto que se está escribiendo, para ver
//  ANTES de programar lo que verá la gente: dónde corta LinkedIn el «…más»,
//  cómo se encadena un hilo en X, cómo luce el artículo en el blog.
//
//  X y LinkedIn se imitan aquí (fuentes, colores, medidas y cortes de cada
//  red). El blog no se imita: se pinta la página de verdad en un iframe, con
//  sus estilos, su menú y su pie, y se le manda el artículo mientras se
//  escribe. Lo que se ve es lo que saldrá.
//
//  Nada de esto copia logotipos ni marcas de las redes: sólo la maquetación.
// ══════════════════════════════════════════════════════════

const NOMBRE = "ActiveXRemote";
const USUARIO = "@ActiveXRemote";

/** El ΔX de la marca, en blanco sobre negro: el avatar de las cuentas. */
function Avatar({ size, square }: { size: number; square?: boolean }) {
  return (
    <span className="axr-pv-avatar" style={{ width: size, height: size, borderRadius: square ? 4 : "50%" }} aria-hidden>
      <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62}>
        <path d="M9.5 7 L14 25 L5 25 Z" fill="#fff" />
        <path d="M18 7 L27 7 L22.5 16 Z" fill="#fff" />
        <path d="M18 25 L27 25 L22.5 16 Z" fill="#fff" />
      </svg>
    </span>
  );
}

/** Enlaces, hashtags y menciones resaltados como los pinta cada red. */
function Rico({ text, clase, acortar }: { text: string; clase: string; acortar?: boolean }) {
  const partes = text.split(/(https?:\/\/\S+|#[\p{L}\p{N}_]+|@[A-Za-z0-9_]+)/gu);
  return (
    <>
      {partes.map((p, i) => {
        if (!p) return null;
        if (/^https?:\/\//.test(p)) {
          // X enseña el enlace sin protocolo y cortado; LinkedIn, entero.
          const visible = acortar ? p.replace(/^https?:\/\/(www\.)?/, "") : p;
          return (
            <span key={i} className={clase}>
              {acortar && visible.length > 26 ? `${visible.slice(0, 25)}…` : visible}
            </span>
          );
        }
        if (/^[#@]/.test(p)) {
          return (
            <span key={i} className={clase}>
              {p}
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function Imagenes({ images, clase }: { images: SocialImage[]; clase: string }) {
  if (!images.length) return null;
  const n = Math.min(images.length, 4);
  return (
    <div className={`${clase} ${clase}--${n}`}>
      {images.slice(0, 4).map((img) => (
        // eslint-disable-next-line @next/next/no-img-element -- imagen pública de Storage
        <img key={img.path} src={img.url} alt={img.alt} />
      ))}
    </div>
  );
}

function Selector<T extends string>({ value, onChange, opciones }: { value: T; onChange: (v: T) => void; opciones: [T, string][] }) {
  return (
    <div className="axr-pv-switch" role="group">
      {opciones.map(([v, label]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Marco({ titulo, hint, tools, children }: { titulo: string; hint: string; tools?: ReactNode; children: ReactNode }) {
  return (
    <div className="axr-pv">
      <div className="axr-pv__head">
        <div>
          <strong>{titulo}</strong>
          <span>{hint}</span>
        </div>
        {tools}
      </div>
      <div className="axr-pv__stage">{children}</div>
    </div>
  );
}

// ── Iconos (trazos propios, no los de las redes) ───────────

const Ico = {
  reply: <path d="M4 5h16v10H9l-5 4V5z" />,
  repost: (
    <>
      <path d="M7 7h10v4" />
      <path d="M14 4l3 3-3 3" />
      <path d="M17 17H7v-4" />
      <path d="M10 20l-3-3 3-3" />
    </>
  ),
  like: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  views: (
    <>
      <path d="M5 20V12" />
      <path d="M10 20V6" />
      <path d="M15 20v-9" />
      <path d="M20 20V9" />
    </>
  ),
  bookmark: <path d="M6 4h12v16l-6-4-6 4V4z" />,
  share: (
    <>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 14v6h14v-6" />
    </>
  ),
  thumb: <path d="M7 10v10H4V10h3zm0 0l4-7c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 6.8A2 2 0 0 1 17.8 20H7" />,
  comment: <path d="M4 5h16v11H8l-4 4V5z" />,
  send: <path d="M3 11l18-8-8 18-2-8-8-2z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="19" cy="12" r="1.2" />
    </>
  ),
};

function Icono({ d, size = 18 }: { d: ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d}
    </svg>
  );
}

// ── X ──────────────────────────────────────────────────────

export function VistaX({ body, images, copy }: { body: XBody; images: SocialImage[]; copy: PubCopy }) {
  const [tema, setTema] = useState<"light" | "dark">("light");
  const posts = [body.text, ...body.thread].filter((p, i) => i === 0 || p.trim());

  return (
    <Marco
      titulo={copy.pvTitleX}
      hint={copy.pvHint}
      tools={<Selector value={tema} onChange={setTema} opciones={[["light", copy.pvLight], ["dark", copy.pvDark]]} />}
    >
      <div className={`axr-pv-x axr-pv-x--${tema}`}>
        {posts.map((p, i) => (
          <article key={i} className="axr-pv-x__post">
            <div className="axr-pv-x__rail">
              <Avatar size={40} />
              {i < posts.length - 1 ? <span className="axr-pv-x__line" /> : null}
            </div>
            <div className="axr-pv-x__main">
              <div className="axr-pv-x__who">
                <strong>{NOMBRE}</strong>
                <span>
                  {USUARIO} · {copy.pvNow}
                </span>
                <span className="axr-pv-x__more">
                  <Icono d={Ico.more} />
                </span>
              </div>
              <div className="axr-pv-x__text">
                {p ? <Rico text={p} clase="axr-pv-x__link" acortar /> : <em className="axr-pv-empty">{copy.pvEmpty}</em>}
              </div>
              {i === 0 ? <Imagenes images={images} clase="axr-pv-x__media" /> : null}
              <div className="axr-pv-x__actions">
                <Icono d={Ico.reply} />
                <Icono d={Ico.repost} />
                <Icono d={Ico.like} />
                <Icono d={Ico.views} />
                <span>
                  <Icono d={Ico.bookmark} />
                  <Icono d={Ico.share} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Marco>
  );
}

// ── LinkedIn ───────────────────────────────────────────────

/**
 * Hasta dónde enseña LinkedIn antes del «…más»: unos 210 caracteres o tres
 * líneas, lo que llegue antes. Un salto de línea gasta una línea entera.
 */
function pliegue(text: string, lineas: number): number {
  let cortes = 0;
  for (let i = 0; i < text.length && i < PLIEGUE_LINKEDIN; i++) {
    if (text[i] === "\n" && ++cortes >= lineas) return i;
  }
  return Math.min(text.length, PLIEGUE_LINKEDIN);
}

export function VistaLinkedIn({ body, images, copy }: { body: LinkedInBody; images: SocialImage[]; copy: PubCopy }) {
  const [abierto, setAbierto] = useState(false);
  const [disp, setDisp] = useState<"desktop" | "mobile">("desktop");
  const text = body.text;
  const corte = pliegue(text, 3);
  const cortado = !abierto && corte < text.length;
  const visible = cortado ? text.slice(0, corte).replace(/\s+$/, "") : text;

  return (
    <Marco
      titulo={copy.pvTitleLinkedIn}
      hint={copy.pvHintLinkedIn}
      tools={<Selector value={disp} onChange={setDisp} opciones={[["desktop", copy.pvDesktop], ["mobile", copy.pvMobile]]} />}
    >
      <div className={`axr-pv-li axr-pv-li--${disp}`}>
        <div className="axr-pv-li__head">
          <Avatar size={48} square />
          <div className="axr-pv-li__who">
            <strong>{NOMBRE}</strong>
            <span>The Remote Business School</span>
            <span className="axr-pv-li__when">
              {copy.pvNow} · <Icono d={Ico.globe} size={14} />
            </span>
          </div>
          <span className="axr-pv-li__follow">+ {copy.pvFollow}</span>
        </div>
        <div className="axr-pv-li__text">
          {text ? <Rico text={visible} clase="axr-pv-li__tag" /> : <em className="axr-pv-empty">{copy.pvEmpty}</em>}
          {cortado ? (
            <button type="button" className="axr-pv-li__seemore" onClick={() => setAbierto(true)}>
              …{copy.pvSeeMore}
            </button>
          ) : null}
        </div>
        {abierto && corte < text.length ? (
          <button type="button" className="axr-pv-li__seeless" onClick={() => setAbierto(false)}>
            {copy.pvSeeLess}
          </button>
        ) : null}
        <Imagenes images={images} clase="axr-pv-li__media" />
        <div className="axr-pv-li__counts">
          <span className="axr-pv-li__reactions" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span>{copy.pvBeFirst}</span>
        </div>
        <div className="axr-pv-li__actions">
          <span>
            <Icono d={Ico.thumb} /> {copy.pvLike}
          </span>
          <span>
            <Icono d={Ico.comment} /> {copy.pvComment}
          </span>
          <span>
            <Icono d={Ico.repost} /> {copy.pvRepost}
          </span>
          <span>
            <Icono d={Ico.send} /> {copy.pvSend}
          </span>
        </div>
      </div>
      <p className="axr-pv__note">{cortado ? copy.pvFoldNote : null}</p>
    </Marco>
  );
}

// ── Blog ───────────────────────────────────────────────────

const ANCHO = { desktop: 1280, mobile: 390 } as const;
const ALTO_VISIBLE = 640;

/** Lo que enseña Google: título cortado hacia los 60 caracteres y descripción hacia los 155. */
function Serp({ a, copy }: { a: Article; copy: PubCopy }) {
  const corta = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
  return (
    <div className="axr-pv-serp">
      <span className="axr-pv-serp__label">{copy.pvGoogle}</span>
      <div className="axr-pv-serp__site">
        <Avatar size={26} />
        <div>
          <strong>{NOMBRE}</strong>
          <span>https://www.activexremote.com › {a.locale === "en" ? "en › blog" : "blog"} › {a.slug || "…"}</span>
        </div>
      </div>
      <div className="axr-pv-serp__title">{corta(a.metaTitle || copy.pvEmpty, 60)}</div>
      <div className="axr-pv-serp__desc">{corta(a.metaDescription || copy.pvEmpty, 158)}</div>
    </div>
  );
}

export function VistaBlog({ article, variantId, copy }: { article: Article; variantId: string; copy: PubCopy }) {
  const [disp, setDisp] = useState<"desktop" | "mobile">("desktop");
  const [ancho, setAncho] = useState(600);
  const caja = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const ultimo = useRef(article);
  ultimo.current = article;

  // El escenario se mide para escalar la página entera dentro: un escritorio
  // de 1.280 px se ve completo, como en pequeño, en vez de cortado.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAncho(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mandar = () => frame.current?.contentWindow?.postMessage({ type: "axr:blog-preview", article: ultimo.current }, window.location.origin);

  // El iframe avisa cuando está listo (también tras recargarse); a partir de
  // ahí recibe cada cambio, con una pausa para no repintar en cada tecla.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.source === frame.current?.contentWindow && e.data?.type === "axr:blog-preview-ready") mandar();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    const t = setTimeout(mandar, 250);
    return () => clearTimeout(t);
  }, [article]);

  const w = ANCHO[disp];
  const escala = Math.min(1, ancho / w);
  const src = `/vista-previa/blog?v=${encodeURIComponent(variantId)}`;
  const ruta = `activexremote.com${article.locale === "en" ? "/en" : ""}/blog/${article.slug || "…"}`;

  return (
    <Marco
      titulo={copy.pvTitleBlog}
      hint={copy.pvHintBlog}
      tools={
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <Selector value={disp} onChange={setDisp} opciones={[["desktop", copy.pvDesktop], ["mobile", copy.pvMobile]]} />
          <a className="axr-pv-open" href={src} target="_blank" rel="noreferrer">
            {copy.pvOpenTab} ↗
          </a>
        </div>
      }
    >
      <Serp a={article} copy={copy} />
      <div className={`axr-pv-browser axr-pv-browser--${disp}`}>
        <div className="axr-pv-browser__bar">
          <i />
          <i />
          <i />
          <span>{ruta}</span>
        </div>
        {/* Se ve un trozo fijo de pantalla y se hace scroll dentro, como en
            un navegador de verdad. */}
        <div ref={caja} className="axr-pv-browser__view" style={{ height: ALTO_VISIBLE }}>
          <iframe
            ref={frame}
            src={src}
            title={copy.pvTitleBlog}
            style={{ width: w, height: ALTO_VISIBLE / escala, transform: `scale(${escala})` }}
          />
        </div>
      </div>
    </Marco>
  );
}
