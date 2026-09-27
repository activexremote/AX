"use client";

import { BlockView } from "@/components/content/block-view";
import { BLOCK_LABEL, type Block } from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

export type Decision = "accepted" | "rejected";

// ══════════════════════════════════════════════════════════
//  Revisar lo que propone la IA
//
//  La regla de la casa: nada que haya escrito un modelo se publica sin que
//  una persona lo mire. Y para poder mirarlo de verdad hay que VERLO, no
//  leer que es un «note (aviso)»: cada bloque se pinta con el mismo
//  componente del campus y debajo se acepta o se descarta.
//
//  Lo descartado no desaparece: se queda apagado. Así se puede recuperar de
//  un clic y se ve de un vistazo cuánto se ha tirado.
// ══════════════════════════════════════════════════════════

export function ProposalReview({
  blocks,
  decisions,
  onDecisions,
  notes,
  copy,
}: {
  blocks: Block[];
  decisions: Decision[];
  onDecisions: (d: Decision[]) => void;
  notes: string[];
  copy: Copy;
}) {
  const decidir = (i: number, d: Decision) => onDecisions(decisions.map((x, j) => (j === i ? d : x)));

  return (
    <>
      {notes.length ? (
        <div className="axr-blked__prop-notes">
          <span>{copy.aiNotes}</span>
          <ul>
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="axr-blked__prop-list">
        {blocks.map((b, i) => (
          <li key={i} data-state={decisions[i]}>
            <div className="axr-blked__prop-item">
              <span className="axr-blked__tag">{BLOCK_LABEL[b.t]}</span>
              {/* Sin interacción: aquí se decide sobre el bloque, no se usa.
                  Una checklist marcable dentro de una propuesta confunde. */}
              <div className="axr-blk axr-blked__prop-preview">
                <BlockView block={b} />
              </div>
            </div>
            <div className="axr-blked__prop-choice">
              <button type="button" data-on={decisions[i] === "accepted"} onClick={() => decidir(i, "accepted")}>
                ✓ {copy.aiAccept}
              </button>
              <button type="button" data-on={decisions[i] === "rejected"} onClick={() => decidir(i, "rejected")}>
                ✕ {copy.aiReject}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
