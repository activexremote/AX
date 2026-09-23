"use client";

import { useEffect, useId, useState } from "react";

// ══════════════════════════════════════════════════════════
//  La checklist que el alumno va marcando
//
//  Lo marcado se guarda en SU navegador y no viaja a ninguna parte. No es
//  pereza: una checklist es una ayuda para no perderse dentro de la lección,
//  no una entrega, y guardarla en la base convertiría cada casilla en un dato
//  de progreso que habría que explicar en la política de privacidad y que el
//  profesor vería sin que nadie se lo haya pedido.
//
//  Si el navegador no deja guardar —ventana privada, cookies bloqueadas—, la
//  lista sigue funcionando: se marca igual, sólo que no se recuerda.
// ══════════════════════════════════════════════════════════

const PREFIJO = "axr:check:";

export function ChecklistBlock({
  title,
  items,
  storageKey,
}: {
  title?: string;
  items: string[];
  storageKey?: string;
}) {
  const uid = useId();
  const [marcados, setMarcados] = useState<boolean[]>(() => items.map(() => false));

  // Se lee después de montar y no durante el primer render: el HTML lo pinta
  // el servidor, que no sabe qué hay en este navegador, y leerlo antes haría
  // que React se quejara de que las dos versiones no coinciden.
  useEffect(() => {
    if (!storageKey) return;
    try {
      const guardado = window.localStorage.getItem(PREFIJO + storageKey);
      if (!guardado) return;
      const lista = JSON.parse(guardado) as unknown;
      if (Array.isArray(lista)) setMarcados(items.map((_, i) => Boolean(lista[i])));
    } catch {
      // Sin almacenamiento, la lista arranca vacía y ya está.
    }
  }, [storageKey, items]);

  function alternar(i: number) {
    setMarcados((prev) => {
      const siguiente = prev.map((v, j) => (j === i ? !v : v));
      if (storageKey) {
        try {
          window.localStorage.setItem(PREFIJO + storageKey, JSON.stringify(siguiente));
        } catch {
          // ignorado a propósito
        }
      }
      return siguiente;
    });
  }

  const hechos = marcados.filter(Boolean).length;

  return (
    <div className="axr-blk__check">
      <div className="axr-blk__check-head">
        <strong>{title || "Checklist"}</strong>
        <span aria-live="polite">
          {hechos} / {items.length}
        </span>
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={i} data-done={marcados[i] ? "" : undefined}>
            <label htmlFor={`${uid}-${i}`}>
              <input
                id={`${uid}-${i}`}
                type="checkbox"
                checked={marcados[i] ?? false}
                onChange={() => alternar(i)}
              />
              <span className="axr-blk__check-box" aria-hidden />
              <span>{it}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
