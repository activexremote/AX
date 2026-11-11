"use client";

import { useFormStatus } from "react-dom";

import { actualizarKpis } from "@/app/admin/comercial/kpis/acciones";

function Boton({ label, busy }: { label: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="axr-btn axr-btn--ghost axr-btn--small" disabled={pending} aria-busy={pending}>
      {pending ? busy : label}
    </button>
  );
}

export function Actualizar({ label, busy }: { label: string; busy: string }) {
  return (
    <form action={actualizarKpis}>
      <Boton label={label} busy={busy} />
    </form>
  );
}
