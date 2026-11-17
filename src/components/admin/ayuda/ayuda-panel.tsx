"use client";

import { usePathname } from "next/navigation";

import { AssistantWidget, type TextosChat } from "@/components/campus/assistant-chat";

/**
 * El botón «Ayuda del panel», abajo a la derecha en todas las páginas del
 * panel. Con cada pregunta va la página en la que se está (ruta y título),
 * para que «¿qué es esto?» tenga respuesta.
 */
export function AyudaPanel({ textos }: { textos: TextosChat }) {
  const ruta = usePathname();
  return (
    <AssistantWidget
      className="axr-assistant-widget--panel"
      endpoint="/api/ayuda-panel"
      textos={textos}
      extra={() => ({
        ruta,
        titulo: document.querySelector(".axr-admin__main h1")?.textContent?.trim() ?? null,
      })}
    />
  );
}
