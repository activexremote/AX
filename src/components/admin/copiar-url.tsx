"use client";

import { useState } from "react";

/** Una dirección en grande con su botón de copiar. */
export function CopiarUrl({ url, copiar, copiada }: { url: string; copiar: string; copiada: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="axr-copiar-url">
      <code>{url}</code>
      <button
        type="button"
        className="axr-btn axr-btn--small"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setOk(true);
            setTimeout(() => setOk(false), 1500);
          } catch {
            /* sin permiso de portapapeles: se copia a mano */
          }
        }}
      >
        {ok ? copiada : copiar}
      </button>
    </div>
  );
}
