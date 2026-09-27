"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { proponerDesdeArchivo, crearLeccionConBloques } from "@/app/admin/lecciones/crear";
import { ProposalReview, type Decision } from "@/components/admin/proposal-review";
import { ACCEPT } from "@/lib/ingesta/formatos";
import type { Block } from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  Crear una lección soltando un archivo
//
//  Es la puerta principal para crear contenido, así que ocupa lo que tiene
//  que ocupar: una caja grande que dice qué hacer. Crear la lección a mano
//  sigue estando, debajo y en pequeño, porque es el camino de después.
//
//  El archivo NO se guarda en ninguna parte: se lee, se convierte en texto,
//  se manda a la IA y se olvida. Lo que queda es la lección.
// ══════════════════════════════════════════════════════════

type Fase = "reposo" | "leyendo" | "revisando";

export function LessonDropzone({
  moduleId,
  aiReady,
  copy,
  onManual,
}: {
  moduleId: string;
  aiReady: boolean;
  copy: Copy;
  /** El camino de siempre: el formulario de lección vacía. */
  onManual: () => void;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [fase, setFase] = useState<Fase>("reposo");
  const [encima, setEncima] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [decisiones, setDecisiones] = useState<Decision[]>([]);
  const [pending, startTransition] = useTransition();

  function leer(file: File) {
    setError(null);
    setAviso(null);
    setNombre(file.name);
    setFase("leyendo");

    startTransition(async () => {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("module_id", moduleId);

      const r = await proponerDesdeArchivo(fd);
      if (r.error) {
        setError(r.error);
        setFase("reposo");
        return;
      }

      setBlocks(r.blocks);
      setNotes(r.notes);
      setTitulo(r.title);
      setAviso(r.note ?? null);
      // Todo llega aceptado: descartar tres es menos trabajo que aceptar treinta.
      setDecisiones(r.blocks.map(() => "accepted" as Decision));
      setFase("revisando");
    });
  }

  function crear() {
    const aceptados = blocks.filter((_, i) => decisiones[i] === "accepted");
    if (!aceptados.length) {
      setError(copy.dropNothing);
      return;
    }

    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("module_id", moduleId);
      fd.set("title", titulo.trim());
      fd.set("blocks", JSON.stringify(aceptados));

      const r = await crearLeccionConBloques(fd);
      if ("error" in r) {
        setError(r.error);
        return;
      }
      // Directo al editor de la lección recién creada: el siguiente paso
      // natural es retocarla, no volver a la lista.
      router.push(`/admin/lecciones/${r.lessonId}`);
    });
  }

  function reiniciar() {
    setFase("reposo");
    setBlocks([]);
    setNotes([]);
    setDecisiones([]);
    setTitulo("");
    setNombre("");
    setError(null);
    setAviso(null);
    if (input.current) input.current.value = "";
  }

  // ── Revisión ───────────────────────────────────────────
  if (fase === "revisando") {
    const aceptados = decisiones.filter((d) => d === "accepted").length;

    return (
      <div className="axr-blked">
        <div className="axr-blked__bar">
          <div className="axr-blked__bar-info">
            <strong>{nombre}</strong>
            <em className="axr-blked__ok">
              {aceptados} / {blocks.length}
            </em>
          </div>
          <div className="axr-blked__bar-actions">
            <button type="button" className="axr-blked__mini" onClick={reiniciar} disabled={pending}>
              {copy.dropCancel}
            </button>
            <button
              type="button"
              className="axr-blked__mini"
              onClick={() => setDecisiones(blocks.map(() => "accepted"))}
              disabled={pending}
            >
              {copy.aiAcceptAll}
            </button>
            <button type="button" className="axr-btn" onClick={crear} disabled={pending}>
              {pending ? copy.dropCreating : copy.dropCreate}
            </button>
          </div>
        </div>

        {error ? <div className="axr-login__error">{error}</div> : null}
        {aviso ? <p className="axr-blked__hint">{aviso}</p> : null}

        <label className="axr-blked__field">
          <span>{copy.dropTitleField}</span>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={120} />
        </label>

        <div className="axr-blked__prop">
          <ProposalReview
            blocks={blocks}
            decisions={decisiones}
            onDecisions={setDecisiones}
            notes={notes}
            copy={copy}
          />
        </div>
      </div>
    );
  }

  // ── Caja de arrastre ───────────────────────────────────
  const trabajando = fase === "leyendo" || pending;

  return (
    <div className="axr-drop">
      <div
        className="axr-drop__zone"
        data-over={encima ? "" : undefined}
        data-busy={trabajando ? "" : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          if (!aiReady || trabajando) return;
          const file = e.dataTransfer.files?.[0];
          if (file) leer(file);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) leer(file);
          }}
        />

        {trabajando ? (
          <>
            <span className="axr-drop__spinner" aria-hidden />
            <strong>{fase === "leyendo" && !pending ? copy.dropReading : copy.dropThinking}</strong>
            <span className="axr-drop__file">{nombre}</span>
          </>
        ) : (
          <>
            <span className="axr-drop__icon" aria-hidden>
              ⭳
            </span>
            <strong>{encima ? copy.dropDrop : copy.dropTitle}</strong>
            <p>{copy.dropLead}</p>
            <button
              type="button"
              className="axr-btn"
              onClick={() => input.current?.click()}
              disabled={!aiReady}
            >
              {copy.dropCta}
            </button>
            <span className="axr-drop__formats">{copy.dropFormats}</span>
          </>
        )}
      </div>

      {!aiReady ? <p className="axr-blked__hint">{copy.dropAiOff}</p> : null}
      {error ? <div className="axr-login__error">{error}</div> : null}

      <button type="button" className="axr-drop__manual" onClick={onManual}>
        {copy.dropOrManual}
      </button>
    </div>
  );
}
