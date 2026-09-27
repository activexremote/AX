"use client";

import { useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════
//  Escribir encima del texto
//
//  La pieza de abajo de todo del editor del campus: un trozo de la lección
//  sobre el que se escribe directamente, con la tipografía y el tamaño que va
//  a tener publicado. No es un campo de formulario disfrazado.
//
//  ⚠︎ `contentEditable` y React se llevan mal, y el motivo es concreto: si
//  React vuelve a pintar el nodo mientras alguien escribe, el cursor salta al
//  principio. Por eso este componente NO controla su contenido; lo escribe a
//  mano UNA vez al montar, y después sólo si el valor cambia desde fuera
//  (deshacer, propuesta de la IA) y el foco no está dentro.
//
//  ⚠︎ Y sólo texto: `plaintext-only` impide que al pegar desde Word entre
//  HTML con estilos, colores y fuentes ajenas. Los bloques guardan texto
//  plano a propósito (ver lib/content/blocks.ts).
// ══════════════════════════════════════════════════════════

export type EditableHandle = HTMLDivElement | null;

export function EditableText({
  value,
  onChange,
  onEnter,
  onBackspaceEmpty,
  onArriba,
  onAbajo,
  placeholder,
  className,
  multiline = false,
  autoFocus = false,
  refCallback,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Enter (sin Shift). Recibe el texto que quedaba a la derecha del cursor. */
  onEnter?: (resto: string) => void;
  /** Retroceso con el bloque ya vacío: quien llame decide si se borra. */
  onBackspaceEmpty?: () => void;
  onArriba?: () => void;
  onAbajo?: () => void;
  placeholder?: string;
  className?: string;
  /** Con saltos de línea dentro (párrafos). Los títulos van en una línea. */
  multiline?: boolean;
  autoFocus?: boolean;
  refCallback?: (el: EditableHandle) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // El contenido se escribe a mano, nunca como hijo de React.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value]);

  useEffect(() => {
    if (!autoFocus) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    // El cursor al final: quien acaba de crear un bloque quiere escribir, no
    // insertar delante de lo que haya.
    const rango = document.createRange();
    rango.selectNodeContents(el);
    rango.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(rango);
  }, [autoFocus]);

  useEffect(() => {
    refCallback?.(ref.current);
    return () => refCallback?.(null);
  }, [refCallback]);

  return (
    <div
      ref={ref}
      className={className}
      // `plaintext-only` es lo que hace que pegar desde Word o Google Docs
      // entre como texto y no como un pegote de HTML.
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={multiline}
      data-placeholder={placeholder}
      data-empty={value ? undefined : ""}
      onInput={(e) => onChange((e.currentTarget.textContent ?? "").replace(/ /g, " "))}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          if (!multiline || !e.altKey) {
            e.preventDefault();
            // Lo que quedaba a la derecha del cursor se va con el bloque
            // nuevo, como en cualquier editor de texto.
            const sel = window.getSelection();
            const el = e.currentTarget;
            let resto = "";
            if (sel && sel.rangeCount) {
              const r = sel.getRangeAt(0).cloneRange();
              r.setEnd(el, el.childNodes.length);
              resto = r.toString();
              if (resto) {
                const borrar = sel.getRangeAt(0).cloneRange();
                borrar.setEnd(el, el.childNodes.length);
                borrar.deleteContents();
                onChange((el.textContent ?? "").replace(/ /g, " "));
              }
            }
            onEnter?.(resto);
          }
          return;
        }

        if (e.key === "Backspace" && !e.currentTarget.textContent) {
          e.preventDefault();
          onBackspaceEmpty?.();
          return;
        }

        // Subir y bajar entre bloques sólo cuando no hay adónde ir dentro del
        // bloque: si no, se rompería mover el cursor por un párrafo largo.
        if (e.key === "ArrowUp" && onArriba && enPrimeraLinea(e.currentTarget)) {
          e.preventDefault();
          onArriba();
        }
        if (e.key === "ArrowDown" && onAbajo && enUltimaLinea(e.currentTarget)) {
          e.preventDefault();
          onAbajo();
        }
      }}
    />
  );
}

/** ¿El cursor está en el primer renglón pintado del bloque? */
function enPrimeraLinea(el: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return true;
  const caret = sel.getRangeAt(0).getBoundingClientRect();
  const caja = el.getBoundingClientRect();
  // Sin selección pintada (bloque vacío) el rectángulo viene a cero.
  if (!caret.top && !caret.height) return true;
  return caret.top - caja.top < 8;
}

function enUltimaLinea(el: HTMLElement): boolean {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) return true;
  const caret = sel.getRangeAt(0).getBoundingClientRect();
  const caja = el.getBoundingClientRect();
  if (!caret.bottom && !caret.height) return true;
  return caja.bottom - caret.bottom < 8;
}
