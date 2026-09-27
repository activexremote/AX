"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { saveLessonBlocks } from "@/app/admin/lecciones/actions";
import { BlockView } from "@/components/content/block-view";
import { BlockFields } from "@/components/admin/block-fields";
import { markdownToBlocks } from "@/lib/content/markdown";
import { BLOCK_KINDS, BLOCK_LABEL, emptyBlock, type Block, type BlockType } from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  Editar la lección desde el campus
//
//  Un profesor no debería tener que irse al panel para corregir una frase que
//  acaba de ver mal. Aquí lee la lección como la lee un alumno y, si enciende
//  el modo edición, hace clic encima de cualquier bloque y lo corrige donde
//  está.
//
//  Tres cosas que sostienen esto:
//
//  · EL MODO LECTURA ES EL DE VERDAD. Apagado, esto pinta exactamente lo
//    mismo que ve un alumno, con el mismo componente. No hay una "vista de
//    profesor" que se parezca: es la misma.
//  · SE GUARDA AL CERRAR EL BLOQUE. Cada bloque tiene su botón, y al pulsarlo
//    se guarda la lección entera. Nada de guardado automático mientras se
//    escribe: publicar medias frases a los alumnos matriculados no es una
//    opción.
//  · QUIEN MANDA ES EL SERVIDOR. La acción comprueba que quien guarda es
//    profesor o administrador; esto sólo decide qué se pinta.
// ══════════════════════════════════════════════════════════

type Estado = "limpio" | "guardando" | "guardado" | "error";

export function CampusLessonEditor({
  lessonId,
  initial,
  markdown,
  copy,
}: {
  lessonId: string;
  initial: Block[];
  /** El Markdown de la lección, si todavía no está convertida a bloques. */
  markdown: string;
  copy: Copy;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initial);
  const [editando, setEditando] = useState(false);
  const [abierto, setAbierto] = useState<number | null>(null);
  const [estado, setEstado] = useState<Estado>("limpio");
  const [error, setError] = useState<string | null>(null);
  const [anadiendo, setAnadiendo] = useState(false);
  const [pending, startTransition] = useTransition();
  const arrastrando = useRef<number | null>(null);

  // Al salir del modo edición no puede quedarse nada sin guardar.
  useEffect(() => {
    if (!editando) setAbierto(null);
  }, [editando]);

  function guardar(siguientes: Block[]) {
    setBlocks(siguientes);
    setEstado("guardando");
    setError(null);

    startTransition(async () => {
      const r = await saveLessonBlocks(lessonId, JSON.stringify(siguientes));
      if ("error" in r) {
        setEstado("error");
        setError(r.error);
        return;
      }
      setEstado("guardado");
    });
  }

  function editar(i: number, b: Block) {
    setBlocks((prev) => prev.map((x, j) => (j === i ? b : x)));
    setEstado("limpio");
  }

  function mover(desde: number, hasta: number) {
    if (hasta < 0 || hasta >= blocks.length || desde === hasta) return;
    const next = [...blocks];
    const [b] = next.splice(desde, 1);
    next.splice(hasta, 0, b);
    guardar(next);
    setAbierto((a) => (a === desde ? hasta : a));
  }

  function anadir(t: BlockType) {
    const next = [...blocks, emptyBlock(t)];
    setBlocks(next);
    setAbierto(next.length - 1);
    setAnadiendo(false);
    setEstado("limpio");
  }

  const vacio = blocks.length === 0;

  return (
    <div className="axr-inline" data-editing={editando ? "" : undefined}>
      {/* ── Barra del profesor ────────────────────────── */}
      <div className="axr-inline__bar">
        <span className="axr-inline__badge">{copy.staffBadge}</span>

        <div className="axr-inline__bar-actions">
          {estado === "guardando" || pending ? <em>{copy.saving}</em> : null}
          {estado === "guardado" && !pending ? <em className="axr-inline__ok">✓ {copy.saved}</em> : null}
          {estado === "error" ? <em className="axr-inline__err">{copy.saveError}</em> : null}

          {vacio && markdown ? (
            <button
              type="button"
              className="axr-inline__btn"
              onClick={() => {
                // Una sola vez y sin IA: el Markdown de la lección pasa a
                // bloques para poder editarlo a clics. No se guarda hasta que
                // el profesor toque algo, así que se puede probar sin miedo.
                setBlocks(markdownToBlocks(markdown));
                setEditando(true);
              }}
            >
              {copy.convert}
            </button>
          ) : null}

          <button
            type="button"
            className="axr-inline__btn"
            data-on={editando}
            onClick={() => setEditando((v) => !v)}
            disabled={vacio && !markdown}
          >
            {editando ? copy.inlineDone : copy.inlineEdit}
          </button>
        </div>
      </div>

      {error ? <div className="axr-login__error">{error}</div> : null}
      {editando ? <p className="axr-inline__hint">{copy.inlineHint}</p> : null}

      {/* ── La lección ────────────────────────────────── */}
      <div className="axr-blk">
        {blocks.map((b, i) => {
          const editandoEste = editando && abierto === i;

          if (editandoEste) {
            return (
              <div key={i} className="axr-inline__editor">
                <div className="axr-inline__editor-head">
                  <span className="axr-blked__tag">{BLOCK_LABEL[b.t]}</span>
                  <div className="axr-inline__tools">
                    <button type="button" onClick={() => mover(i, i - 1)} disabled={i === 0} title={copy.moveUp}>
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(i, i + 1)}
                      disabled={i === blocks.length - 1}
                      title={copy.moveDown}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(copy.confirmRemove)) return;
                        guardar(blocks.filter((_, j) => j !== i));
                        setAbierto(null);
                      }}
                      title={copy.remove}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <BlockFields block={b} onChange={(nb) => editar(i, nb)} copy={copy} />

                <div className="axr-inline__editor-foot">
                  <div className="axr-blk axr-inline__mini">
                    <BlockView block={b} />
                  </div>
                  <div className="axr-inline__editor-actions">
                    <button
                      type="button"
                      className="axr-inline__btn axr-inline__btn--solid"
                      onClick={() => {
                        guardar(blocks);
                        setAbierto(null);
                      }}
                      disabled={pending}
                    >
                      {pending ? copy.saving : copy.saveBlock}
                    </button>
                    <button type="button" className="axr-inline__btn" onClick={() => setAbierto(null)}>
                      {copy.close}
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (!editando) {
            return <BlockView key={i} block={b} storageKey={`${lessonId}:${i}`} />;
          }

          // Modo edición, bloque cerrado: se pinta igual que lo ve el alumno,
          // pero todo él es un objetivo de clic.
          return (
            <div
              key={i}
              className="axr-inline__slot"
              draggable
              onDragStart={() => {
                arrastrando.current = i;
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (arrastrando.current !== null) mover(arrastrando.current, i);
                arrastrando.current = null;
              }}
              onClick={() => setAbierto(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAbierto(i);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${copy.edit}: ${BLOCK_LABEL[b.t]}`}
            >
              <span className="axr-inline__slot-tag" aria-hidden>
                {BLOCK_LABEL[b.t]}
              </span>
              {/* Sin interacción dentro: el clic es para editar, no para
                  marcar una casilla de la checklist. */}
              <div className="axr-inline__slot-body">
                <BlockView block={b} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Añadir ────────────────────────────────────── */}
      {editando ? (
        <div className="axr-inline__add">
          {anadiendo ? (
            <div className="axr-blked__add-grid">
              {BLOCK_KINDS.map((k) => (
                <button key={k.t} type="button" onClick={() => anadir(k.t)}>
                  <strong>{k.label}</strong>
                  <span>{k.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <button type="button" className="axr-inline__btn" onClick={() => setAnadiendo(true)}>
              + {copy.add}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
