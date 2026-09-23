"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { saveLessonBlocks, proposeLessonStructure } from "@/app/admin/lecciones/actions";
import { BlockList, BlockView } from "@/components/content/block-view";
import { BlockFields, blockSummary } from "@/components/admin/block-fields";
import {
  BLOCK_KINDS,
  BLOCK_LABEL,
  emptyBlock,
  parseBlocks,
  type Block,
  type BlockType,
} from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  El editor de la lección
//
//  Lo que ve el profesor: una pila de bloques que se arrastran, se editan en
//  el sitio y se guardan. Y un botón que convierte su borrador en esa pila.
//
//  Decisiones que se notan al usarlo:
//
//  · SE EDITA EN EL SITIO, no en un panel lateral. El bloque abierto enseña
//    sus campos donde está, así que no hay que recordar cuál se estaba
//    tocando.
//  · LA VISTA PREVIA ES EL COMPONENTE DE VERDAD (BlockList, el mismo del
//    campus). No es una imitación: si algo se ve bien aquí, se ve bien allí.
//  · ARRASTRAR NO PUEDE SER LA ÚNICA FORMA de reordenar. Cada bloque lleva
//    subir y bajar, que funcionan con teclado y en un móvil.
//  · NADA SE GUARDA SOLO. Un guardado automático a media frase publicaría
//    medias frases a los alumnos. Se guarda al pulsar, y mientras tanto el
//    aviso de cambios sin guardar queda a la vista.
// ══════════════════════════════════════════════════════════

type Decision = "pending" | "accepted" | "rejected";

export function LessonBlocksEditor({
  lessonId,
  initial,
  draft,
  aiReady,
  copy,
}: {
  lessonId: string;
  /** Lo que hay guardado en la base, ya validado en el servidor. */
  initial: Block[];
  /** El Markdown de la lección: el borrador del que parte la IA. */
  draft: string;
  aiReady: boolean;
  copy: Copy;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initial);
  const [abierto, setAbierto] = useState<number | null>(initial.length ? null : 0);
  const [modo, setModo] = useState<"edit" | "preview">("edit");
  const [sucio, setSucio] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Cuántos bloques vacíos se cayeron en el último guardado. */
  const [descartados, setDescartados] = useState(0);
  const [pending, startTransition] = useTransition();

  // ── IA ──
  const [panelIA, setPanelIA] = useState(false);
  const [borrador, setBorrador] = useState(draft);
  const [propuesta, setPropuesta] = useState<{ blocks: Block[]; notes: string[] } | null>(null);
  const [decisiones, setDecisiones] = useState<Decision[]>([]);
  const [iaError, setIaError] = useState<string | null>(null);
  const [pensando, startIA] = useTransition();

  const arrastrando = useRef<number | null>(null);

  // Cerrar la pestaña con cambios sin guardar tiene que doler un poco.
  useEffect(() => {
    if (!sucio) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [sucio]);

  function cambiar(next: Block[]) {
    setBlocks(next);
    setSucio(true);
    setGuardado(false);
  }

  function editar(i: number, b: Block) {
    cambiar(blocks.map((x, j) => (j === i ? b : x)));
  }

  function mover(desde: number, hasta: number) {
    if (hasta < 0 || hasta >= blocks.length || desde === hasta) return;
    const next = [...blocks];
    const [b] = next.splice(desde, 1);
    next.splice(hasta, 0, b);
    cambiar(next);
    setAbierto((a) => (a === desde ? hasta : a));
  }

  function anadir(t: BlockType) {
    const next = [...blocks, emptyBlock(t)];
    cambiar(next);
    setAbierto(next.length - 1);
    setModo("edit");
  }

  function guardar() {
    setError(null);
    setDescartados(0);
    startTransition(async () => {
      const r = await saveLessonBlocks(lessonId, JSON.stringify(blocks));
      if ("error" in r) {
        setError(r.error);
        return;
      }
      // Se vuelve a validar en el servidor, así que lo guardado puede tener
      // menos bloques que la pantalla: un bloque a medio rellenar —un gráfico
      // sin etiquetas, un párrafo en blanco— no se guarda. Se refleja en
      // pantalla Y se dice cuántos se han caído: desaparecer en silencio es
      // lo que hace que alguien crea que ha perdido el trabajo.
      setSucio(false);
      setGuardado(true);
      setBlocks((actuales) => {
        if (r.count === actuales.length) return actuales;
        setDescartados(actuales.length - r.count);
        return parseBlocks(JSON.stringify(actuales));
      });
    });
  }

  function pedirIA() {
    setIaError(null);
    setPropuesta(null);
    startIA(async () => {
      const r = await proposeLessonStructure(lessonId, borrador);
      if (r.error) {
        setIaError(r.error);
        return;
      }
      setPropuesta({ blocks: r.blocks, notes: r.notes });
      // Todo empieza aceptado: la propuesta ya viene revisada por el profesor
      // de un vistazo, y descartar tres bloques es menos trabajo que aceptar
      // veinte.
      setDecisiones(r.blocks.map(() => "accepted" as Decision));
    });
  }

  const aceptados = propuesta ? propuesta.blocks.filter((_, i) => decisiones[i] === "accepted") : [];

  function aplicar(modoAplicar: "append" | "replace") {
    if (!aceptados.length) return;
    if (modoAplicar === "replace" && blocks.length && !window.confirm(copy.aiReplaceWarn)) return;
    cambiar(modoAplicar === "replace" ? aceptados : [...blocks, ...aceptados]);
    setPropuesta(null);
    setPanelIA(false);
    setModo("preview");
  }

  return (
    <div className="axr-blked">
      {/* ── Barra ───────────────────────────────────────── */}
      <div className="axr-blked__bar">
        <div className="axr-blked__bar-info">
          <strong>{copy.blocksCount(blocks.length)}</strong>
          {sucio ? <em className="axr-blked__dirty">{copy.unsaved}</em> : null}
          {guardado && !sucio ? <em className="axr-blked__ok">✓ {copy.saved}</em> : null}
        </div>

        <div className="axr-blked__bar-actions">
          <div className="axr-blked__toggle" role="group">
            <button type="button" data-on={modo === "edit"} onClick={() => setModo("edit")}>
              {copy.edit}
            </button>
            <button type="button" data-on={modo === "preview"} onClick={() => setModo("preview")}>
              {copy.preview}
            </button>
          </div>

          {aiReady ? (
            <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setPanelIA((v) => !v)}>
              ✨ {copy.aiPanel}
            </button>
          ) : null}

          <button type="button" className="axr-btn" onClick={guardar} disabled={pending || !sucio}>
            {pending ? copy.saving : copy.save}
          </button>
        </div>
      </div>

      {error ? <div className="axr-login__error">{copy.saveError}: {error}</div> : null}
      {descartados > 0 ? <p className="axr-blked__hint">{copy.dropped(descartados)}</p> : null}
      {!aiReady ? <p className="axr-blked__hint">{copy.aiOff}</p> : null}

      {/* ── Panel de la IA ──────────────────────────────── */}
      {panelIA && aiReady ? (
        <div className="axr-blked__ai">
          <p className="axr-blked__ai-lead">{copy.aiPanelLead}</p>

          <label className="axr-blked__field">
            <span>{copy.aiDraftLabel}</span>
            <textarea
              rows={8}
              value={borrador}
              placeholder={copy.aiDraftPlaceholder}
              onChange={(e) => setBorrador(e.target.value)}
            />
          </label>

          <div className="axr-blked__ai-actions">
            <button type="button" className="axr-btn" onClick={pedirIA} disabled={pensando}>
              {pensando ? copy.aiRunning : copy.aiRun}
            </button>
            {draft && borrador !== draft ? (
              <button type="button" className="axr-blked__mini" onClick={() => setBorrador(draft)}>
                {copy.aiUseDraft}
              </button>
            ) : null}
          </div>

          {iaError ? <div className="axr-login__error">{iaError}</div> : null}

          {propuesta ? (
            <div className="axr-blked__prop">
              <div className="axr-blked__prop-head">
                <strong>{copy.aiResult(propuesta.blocks.length)}</strong>
                <div className="axr-blked__prop-actions">
                  <button
                    type="button"
                    className="axr-blked__mini"
                    onClick={() => setDecisiones(propuesta.blocks.map(() => "accepted"))}
                  >
                    {copy.aiAcceptAll}
                  </button>
                  <button type="button" className="axr-blked__mini" onClick={() => setPropuesta(null)}>
                    {copy.aiDiscard}
                  </button>
                </div>
              </div>

              {propuesta.notes.length ? (
                <div className="axr-blked__prop-notes">
                  <span>{copy.aiNotes}</span>
                  <ul>
                    {propuesta.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Cada bloque propuesto se ve PINTADO, no descrito: decidir
                  sobre "note (aviso)" no es decidir sobre nada. */}
              <ul className="axr-blked__prop-list">
                {propuesta.blocks.map((b, i) => (
                  <li key={i} data-state={decisiones[i]}>
                    <div className="axr-blked__prop-item">
                      <span className="axr-blked__tag">{BLOCK_LABEL[b.t]}</span>
                      <div className="axr-blk axr-blked__prop-preview">
                        <BlockView block={b} />
                      </div>
                    </div>
                    <div className="axr-blked__prop-choice">
                      <button
                        type="button"
                        data-on={decisiones[i] === "accepted"}
                        onClick={() => setDecisiones((d) => d.map((x, j) => (j === i ? "accepted" : x)))}
                      >
                        ✓ {copy.aiAccept}
                      </button>
                      <button
                        type="button"
                        data-on={decisiones[i] === "rejected"}
                        onClick={() => setDecisiones((d) => d.map((x, j) => (j === i ? "rejected" : x)))}
                      >
                        ✕ {copy.aiReject}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="axr-blked__ai-actions">
                <button type="button" className="axr-btn" onClick={() => aplicar("append")} disabled={!aceptados.length}>
                  {copy.aiAppend} ({aceptados.length})
                </button>
                <button
                  type="button"
                  className="axr-btn axr-btn--ghost"
                  onClick={() => aplicar("replace")}
                  disabled={!aceptados.length}
                >
                  {copy.aiReplace}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── Vista previa ────────────────────────────────── */}
      {modo === "preview" ? (
        blocks.length ? (
          <div className="axr-blked__preview">
            <BlockList blocks={blocks} />
          </div>
        ) : (
          <p className="axr-blked__hint">{copy.empty}</p>
        )
      ) : (
        /* ── Lista de bloques ──────────────────────────── */
        <>
          {blocks.length === 0 ? <p className="axr-blked__hint">{copy.empty}</p> : null}

          <ul className="axr-blked__list">
            {blocks.map((b, i) => (
              <li
                key={i}
                className="axr-blked__block"
                data-open={abierto === i ? "" : undefined}
                draggable
                onDragStart={(e) => {
                  arrastrando.current = i;
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (arrastrando.current !== null) mover(arrastrando.current, i);
                  arrastrando.current = null;
                }}
              >
                <div className="axr-blked__head">
                  <span className="axr-blked__grip" aria-hidden title={copy.drag}>
                    ⠿
                  </span>
                  <button
                    type="button"
                    className="axr-blked__title"
                    onClick={() => setAbierto(abierto === i ? null : i)}
                    aria-expanded={abierto === i}
                  >
                    <span className="axr-blked__tag">{BLOCK_LABEL[b.t]}</span>
                    <span className="axr-blked__summary">{blockSummary(b) || "—"}</span>
                  </button>

                  <div className="axr-blked__tools">
                    <button type="button" onClick={() => mover(i, i - 1)} disabled={i === 0} aria-label={copy.moveUp} title={copy.moveUp}>
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(i, i + 1)}
                      disabled={i === blocks.length - 1}
                      aria-label={copy.moveDown}
                      title={copy.moveDown}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...blocks];
                        // Copia profunda: sin esto, editar el duplicado
                        // cambiaría también el original, que comparten
                        // objetos internos (items, series…).
                        next.splice(i + 1, 0, JSON.parse(JSON.stringify(b)) as Block);
                        cambiar(next);
                      }}
                      aria-label={copy.duplicate}
                      title={copy.duplicate}
                    >
                      ⧉
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(copy.confirmRemove)) return;
                        cambiar(blocks.filter((_, j) => j !== i));
                        setAbierto(null);
                      }}
                      aria-label={copy.remove}
                      title={copy.remove}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {abierto === i ? (
                  <div className="axr-blked__body">
                    <BlockFields block={b} onChange={(nb) => editar(i, nb)} copy={copy} />
                    <div className="axr-blked__mini-preview">
                      <span>{copy.preview}</span>
                      <div className="axr-blk">
                        <BlockView block={b} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          {/* ── Añadir ──────────────────────────────────── */}
          <details className="axr-blked__add">
            <summary>+ {copy.add}</summary>
            <p>{copy.addHint}</p>
            <div className="axr-blked__add-grid">
              {BLOCK_KINDS.map((k) => (
                <button key={k.t} type="button" onClick={() => anadir(k.t)}>
                  <strong>{k.label}</strong>
                  <span>{k.hint}</span>
                </button>
              ))}
            </div>
          </details>
        </>
      )}

      <p className="axr-blked__hint">{copy.fallbackNote}</p>
    </div>
  );
}
