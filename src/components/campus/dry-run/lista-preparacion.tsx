"use client";

import { useOptimistic, useTransition } from "react";

import { cambiarPaso } from "@/app/(campus)/preparacion/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { PasoPreparacion } from "@/lib/dry-run/preparacion";

export type PasoVista = PasoPreparacion & {
  hecho: boolean;
  enlaces?: { texto: string; href: string; externo?: boolean }[];
};

/**
 * La lista de preparación, con casillas que se guardan al momento. Los pasos
 * automáticos (la cuenta, la lección abierta, la pregunta al asistente) se
 * marcan solos y no tienen casilla.
 */
export function ListaPreparacion({ pasos }: { pasos: PasoVista[] }) {
  const [, startTransition] = useTransition();
  const [vista, cambiar] = useOptimistic(pasos, (actual, { key, hecho }: { key: string; hecho: boolean }) =>
    actual.map((p) => (p.key === key ? { ...p, hecho } : p)),
  );
  const hechos = vista.filter((p) => p.hecho).length;
  const pct = Math.round((hechos / vista.length) * 100);

  return (
    <section className="axr-c-card axr-prep__list" aria-labelledby="prep-lista">
      <div className="axr-prep__list-head">
        <h2 id="prep-lista" className="axr-c-card__title">
          Tu lista antes de la clase
        </h2>
        <span className="axr-c-pill axr-c-pill--accent">
          {hechos} de {vista.length}
        </span>
      </div>
      <span className="axr-c-progress" aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </span>

      <ol>
        {vista.map((p) => (
          <li key={p.key} data-done={p.hecho || undefined}>
            {p.automatico ? (
              <span className="axr-prep__mark" aria-label={p.hecho ? "Hecho" : "Pendiente"}>
                {p.hecho ? <Icono n="ok" size={14} /> : null}
              </span>
            ) : (
              <input
                type="checkbox"
                className="axr-prep__check"
                checked={p.hecho}
                aria-label={p.titulo}
                onChange={(e) => {
                  const hecho = e.target.checked;
                  startTransition(async () => {
                    cambiar({ key: p.key, hecho });
                    await cambiarPaso(p.key, hecho);
                  });
                }}
              />
            )}
            <div>
              <strong>{p.titulo}</strong>
              <p>{p.detalle}</p>
              {p.enlaces?.length ? (
                <p className="axr-prep__links">
                  {p.enlaces.map((l) => (
                    <a key={l.href} href={l.href} {...(l.externo ? { target: "_blank", rel: "noreferrer" } : {})}>
                      {l.texto} <Icono n="flecha" size={12} />
                    </a>
                  ))}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
