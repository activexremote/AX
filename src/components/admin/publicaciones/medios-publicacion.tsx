"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type RefObject } from "react";
import { useRouter } from "next/navigation";

import { anadirGif, buscarGif, crearImagenIa, hashtagsPara, ideasImagen } from "@/app/admin/publicaciones/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { PubCopy } from "@/lib/i18n/publicaciones";
import { EMOJIS, HASHTAGS_BASE, anadirHashtags, hashtagsDe, limpiarMencion } from "@/lib/social/hashtags";
import type { Gif, HashtagSugerido, IdeaImagen } from "@/lib/social/medios";

// ══════════════════════════════════════════════════════════
//  Lo que se añade al post sin salir del editor
//
//  · Encima de cada texto (X y LinkedIn): emoji, mención y hashtags, que se
//    insertan donde está el cursor (los hashtags, donde los pone cada red).
//  · En las imágenes de la publicación: subir, crear con IA (primero ideas,
//    luego la imagen) o buscar un GIF en GIPHY.
// ══════════════════════════════════════════════════════════

type Canal = "x" | "linkedin";

// ── Herramientas del texto ────────────────────────────────

/** Inserta en la posición del cursor y deja el cursor detrás de lo insertado. */
function insertar(ref: RefObject<HTMLTextAreaElement | null>, value: string, onChange: (v: string) => void, texto: string) {
  const ta = ref.current;
  const ini = ta?.selectionStart ?? value.length;
  const fin = ta?.selectionEnd ?? value.length;
  // Un espacio delante si se pega a una palabra.
  const antes = value.slice(0, ini);
  const pieza = antes && !/\s$/.test(antes) && /^[@#]/.test(texto) ? ` ${texto}` : texto;
  onChange(antes + pieza + value.slice(fin));
  requestAnimationFrame(() => {
    if (!ta) return;
    ta.focus();
    const pos = ini + pieza.length;
    ta.setSelectionRange(pos, pos);
  });
}

const RECIENTES = "axr-pub-menciones";
function leerRecientes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECIENTES) ?? "[]").filter((x: unknown) => typeof x === "string").slice(0, 8);
  } catch {
    return [];
  }
}
function guardarReciente(m: string) {
  try {
    localStorage.setItem(RECIENTES, JSON.stringify([m, ...leerRecientes().filter((x) => x !== m)].slice(0, 8)));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

/** Un desplegable que se cierra al hacer clic fuera o con Escape. */
function Pop({ label, icon, abierto, setAbierto, children, disabled }: { label: string; icon: string; abierto: boolean; setAbierto: (v: boolean) => void; children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAbierto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto, setAbierto]);
  return (
    <div className="axr-pubtools__item" ref={ref}>
      <button type="button" className="axr-pubtools__btn" aria-expanded={abierto} disabled={disabled} onClick={() => setAbierto(!abierto)}>
        <span aria-hidden>{icon}</span> {label}
      </button>
      {abierto ? <div className="axr-pubtools__pop">{children}</div> : null}
    </div>
  );
}

export function HerramientasTexto({
  postId,
  channel,
  language,
  value,
  onChange,
  textarea,
  copy,
  disabled,
}: {
  postId: string;
  channel: Canal;
  language: "es" | "en";
  value: string;
  onChange: (v: string) => void;
  textarea: RefObject<HTMLTextAreaElement | null>;
  copy: PubCopy;
  disabled?: boolean;
}) {
  const [abierto, setAbierto] = useState<"emoji" | "mencion" | "hashtags" | null>(null);
  const [grupo, setGrupo] = useState(EMOJIS[0].grupo);
  const [mencion, setMencion] = useState("");
  const [recientes, setRecientes] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const [sug, setSug] = useState<{ propuesta: string[]; opciones: HashtagSugerido[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abre = (k: NonNullable<typeof abierto>) => (v: boolean) => setAbierto(v ? k : null);
  const puestos = hashtagsDe(value);

  useEffect(() => {
    if (abierto === "mencion") setRecientes(leerRecientes());
  }, [abierto]);

  const meterMencion = (m: string) => {
    const limpia = limpiarMencion(m);
    if (!limpia) return;
    insertar(textarea, value, onChange, `${limpia} `);
    guardarReciente(limpia);
    setMencion("");
    setAbierto(null);
  };
  const meterTags = (tags: string[]) => onChange(anadirHashtags(value, tags, channel));

  const Chip = ({ tag, title }: { tag: string; title?: string }) => {
    const ya = puestos.has(tag.toLowerCase());
    return (
      <button type="button" className={`axr-pubchip${ya ? " is-on" : ""}`} disabled={ya} title={ya ? copy.tHashAdded : title} onClick={() => meterTags([tag])}>
        {tag}
      </button>
    );
  };

  return (
    <div className="axr-pubtools" role="toolbar" aria-label={copy.tHashtags}>
      <Pop label={copy.tEmoji} icon="😊" abierto={abierto === "emoji"} setAbierto={abre("emoji")} disabled={disabled}>
        <div className="axr-pubemoji__tabs" role="tablist">
          {EMOJIS.map((g) => (
            <button key={g.grupo} type="button" role="tab" aria-selected={grupo === g.grupo} onClick={() => setGrupo(g.grupo)}>
              {copy.tEmojiGroups[g.grupo]}
            </button>
          ))}
        </div>
        <div className="axr-pubemoji__grid">
          {EMOJIS.find((g) => g.grupo === grupo)!.lista.map((e) => (
            <button key={e} type="button" onClick={() => insertar(textarea, value, onChange, e)} aria-label={e}>
              {e}
            </button>
          ))}
        </div>
        <small className="axr-pubtools__hint">{copy.tEmojiHint}</small>
      </Pop>

      <Pop label={copy.tMention} icon="@" abierto={abierto === "mencion"} setAbierto={abre("mencion")} disabled={disabled}>
        <form
          className="axr-pubmention"
          onSubmit={(e) => {
            e.preventDefault();
            meterMencion(mencion);
          }}
        >
          <span aria-hidden>@</span>
          <input autoFocus value={mencion} onChange={(e) => setMencion(e.target.value)} placeholder={copy.tMentionPh} maxLength={60} />
          <button type="submit" className="axr-btn" disabled={!limpiarMencion(mencion)}>
            {copy.tMentionAdd}
          </button>
        </form>
        {recientes.length ? (
          <div className="axr-pubchips">
            <small>{copy.tMentionRecent}</small>
            {recientes.map((m) => (
              <button key={m} type="button" className="axr-pubchip" onClick={() => meterMencion(m)}>
                {m}
              </button>
            ))}
          </div>
        ) : null}
        <small className="axr-pubtools__hint">{channel === "linkedin" ? copy.tMentionLiNote : copy.tMentionXNote}</small>
      </Pop>

      <Pop label={copy.tHashtags} icon="#" abierto={abierto === "hashtags"} setAbierto={abre("hashtags")} disabled={disabled}>
        <div className="axr-pubhash">
          <div className="axr-pubhash__head">
            <button
              type="button"
              className="axr-btn"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  setError(null);
                  const r = await hashtagsPara(postId, channel, value);
                  if (r.error) setError(r.error);
                  if (r.opciones.length || r.propuesta.length) setSug({ propuesta: r.propuesta, opciones: r.opciones });
                })
              }
            >
              <Icono n="chispa" /> {pending ? copy.tHashThinking : copy.tHashSuggest}
            </button>
            <small>{channel === "x" ? copy.tHashLimitX : copy.tHashLimitLi}</small>
          </div>
          {error ? <div className="axr-login__error">{error}</div> : null}
          {sug?.propuesta.length ? (
            <div className="axr-pubhash__prop">
              <strong>{copy.tHashProposal}</strong>
              <div className="axr-pubchips">
                {sug.propuesta.map((t) => (
                  <Chip key={t} tag={t} />
                ))}
              </div>
              <button type="button" className="axr-btn axr-btn--ghost" onClick={() => meterTags(sug.propuesta)} disabled={sug.propuesta.every((t) => puestos.has(t.toLowerCase()))}>
                + {copy.tHashUseProposal}
              </button>
            </div>
          ) : null}
          {sug?.opciones.length
            ? (["amplio", "medio", "nicho"] as const).map((a) => {
                const items = sug.opciones.filter((o) => o.alcance === a);
                return items.length ? (
                  <div key={a} className="axr-pubchips">
                    <small>{copy.tHashReach[a]}</small>
                    {items.map((o) => (
                      <Chip key={o.tag} tag={o.tag} title={o.motivo} />
                    ))}
                  </div>
                ) : null;
              })
            : null}
          <div className="axr-pubchips">
            <small>{copy.tHashBase}</small>
            {HASHTAGS_BASE[language].map((t) => (
              <Chip key={t} tag={t} />
            ))}
          </div>
          <small className="axr-pubtools__hint">{copy.tHashHonest}</small>
        </div>
      </Pop>
    </div>
  );
}

// ── Imágenes: subir, crear con IA o GIF ───────────────────

const FORMATOS = ["cuadrada", "horizontal", "vertical"] as const;

export function CrearImagenIa({ postId, copy }: { postId: string; copy: PubCopy }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [fase, setFase] = useState<"ideas" | "imagen" | null>(null);
  const [indicacion, setIndicacion] = useState("");
  const [ideas, setIdeas] = useState<IdeaImagen[]>([]);
  const [elegida, setElegida] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [formato, setFormato] = useState<(typeof FORMATOS)[number]>("cuadrada");
  const [error, setError] = useState<string | null>(null);

  const pedirIdeas = () =>
    start(async () => {
      setFase("ideas");
      setError(null);
      const r = await ideasImagen(postId, indicacion);
      if (r.error) setError(r.error);
      if (r.ideas.length) {
        setIdeas(r.ideas);
        setElegida(null);
      }
      setFase(null);
    });

  return (
    <div className="axr-pubai">
      <p className="axr-pubtools__hint">{copy.mAiLead}</p>
      <div className="axr-form__row">
        <label htmlFor={`ai-ask-${postId}`}>{copy.mAiAsk}</label>
        <textarea id={`ai-ask-${postId}`} rows={2} value={indicacion} onChange={(e) => setIndicacion(e.target.value)} placeholder={copy.mAiAskPh} maxLength={1000} />
      </div>
      <div>
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={pedirIdeas}>
          <Icono n="chispa" /> {fase === "ideas" ? copy.mAiThinking : ideas.length ? copy.mAiIdeasAgain : copy.mAiIdeas}
        </button>
      </div>

      {ideas.length ? (
        <ul className="axr-pubai__ideas">
          {ideas.map((i, n) => (
            <li key={n}>
              <button
                type="button"
                className={elegida === n ? "is-on" : undefined}
                aria-pressed={elegida === n}
                onClick={() => {
                  setElegida(n);
                  setPrompt(i.prompt);
                }}
              >
                <strong>{i.titulo}</strong>
                <span>{i.idea}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="axr-form__row">
        <label htmlFor={`ai-prompt-${postId}`}>{copy.mAiPrompt}</label>
        <textarea id={`ai-prompt-${postId}`} rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} maxLength={2000} />
      </div>
      <div className="axr-pubai__row">
        <div className="axr-pv-switch" role="group" aria-label={copy.mAiFormatHint}>
          {FORMATOS.map((f) => (
            <button key={f} type="button" aria-pressed={formato === f} onClick={() => setFormato(f)}>
              {copy.mAiFormat[f]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="axr-btn"
          disabled={pending || !prompt.trim()}
          onClick={() =>
            start(async () => {
              setFase("imagen");
              setError(null);
              const alt = elegida !== null ? ideas[elegida]?.idea ?? "" : "";
              const r = await crearImagenIa(postId, prompt, formato, alt);
              if (r.error) setError(r.error);
              else {
                setPrompt("");
                setElegida(null);
                router.refresh();
              }
              setFase(null);
            })
          }
        >
          <Icono n="imagen" /> {fase === "imagen" ? copy.mAiGenerating : copy.mAiGenerate}
        </button>
      </div>
      <small className="axr-pubtools__hint">
        {copy.mAiFormatHint} {copy.mAiCost}
      </small>
      {error ? <div className="axr-login__error">{error}</div> : null}
    </div>
  );
}

export function BuscadorGif({ postId, language, copy }: { postId: string; language: "es" | "en"; copy: PubCopy }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [buscado, setBuscado] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [anadiendo, setAnadiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();

  const buscar = async (texto: string) => {
    setCargando(true);
    setError(null);
    const r = await buscarGif(texto, language);
    setGifs(r.gifs);
    setError(r.error ?? null);
    setBuscado(texto);
    setCargando(false);
  };

  // Al abrir, lo que es tendencia: así hay algo que mirar antes de escribir.
  useEffect(() => {
    void buscar("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sólo al montar
  }, []);

  // Busca solo al dejar de escribir.
  useEffect(() => {
    if (buscado === null || q.trim() === buscado) return;
    const t = setTimeout(() => void buscar(q.trim()), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `buscar` cambia en cada render
  }, [q]);

  const sinClave = error?.includes("GIPHY") && error.includes("Ajustes");

  return (
    <div className="axr-pubgif">
      <div className="axr-pubgif__search">
        <Icono n="buscar" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.mGifPh} aria-label={copy.mGifSearch} maxLength={50} />
      </div>
      <small className="axr-pubtools__hint">{buscado ? null : copy.mGifTrending}</small>
      {sinClave ? (
        <div className="axr-login__error">
          {copy.mGifNoKey} <Link href="/admin/publicaciones/ajustes">{copy.mGifKeyLink}</Link>
        </div>
      ) : error ? (
        <div className="axr-login__error">{error}</div>
      ) : null}
      <div className={`axr-pubgif__grid${cargando ? " is-loading" : ""}`}>
        {gifs.map((g) => (
          <button
            key={g.id}
            type="button"
            title={g.title}
            disabled={Boolean(anadiendo)}
            onClick={() =>
              start(async () => {
                setAnadiendo(g.id);
                setError(null);
                const r = await anadirGif(postId, g.id);
                if (r.error) setError(r.error);
                else router.refresh();
                setAnadiendo(null);
              })
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de GIPHY */}
            <img src={g.preview} alt={g.title} loading="lazy" width={g.width} height={g.height} />
            <span>{anadiendo === g.id ? copy.mGifAdding : copy.mGifAdd}</span>
          </button>
        ))}
      </div>
      {!cargando && buscado && !gifs.length && !error ? <p className="axr-pubtools__hint">{copy.mGifNone}</p> : null}
      <div className="axr-pubgif__foot">
        <small>{copy.mGifNote}</small>
        <strong>{copy.mGifPowered}</strong>
      </div>
    </div>
  );
}
