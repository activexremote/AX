"use client";

import type { ReactNode } from "react";

/** Un botón que abre el chat del asistente (el widget escucha este evento). */
export function AbrirAsistente({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("axr:abrir-asistente"))}>
      {children}
    </button>
  );
}
