"use client";

import Link from "next/link";
import { useState } from "react";

import { ModuleIcon } from "@/components/module-icon";
import type { ModuloProgreso } from "@/lib/data/progress";

// Módulo a módulo. Por defecto, sólo los empezados: con 20 módulos a cero la
// lista no dice nada. Un botón enseña el resto.
export function ModulosProgreso({
  modulos,
  textos,
}: {
  modulos: ModuloProgreso[];
  textos: { lessons: string; notStarted: string; done: string; showAll: string; showStarted: string };
}) {
  const empezados = modulos.filter((m) => m.started);
  const [todos, setTodos] = useState(empezados.length === 0);
  const lista = todos ? modulos : empezados;

  return (
    <>
      <ul className="axr-mp__modules">
        {lista.map((m) => {
          const pct = m.lessons ? Math.round((m.completed / m.lessons) * 100) : 0;
          const hecho = m.lessons > 0 && m.completed >= m.lessons;
          return (
            <li key={m.id}>
              <Link href={`/modulos/${m.slug}`} className="axr-mp__module-row">
                <span className="axr-mp__module-icon">
                  <ModuleIcon name={m.icon} size={18} />
                </span>
                <span className="axr-mp__module-body">
                  <span className="axr-mp__module-title">{m.title}</span>
                  <span className={`axr-c-progress${hecho ? " axr-c-progress--ok" : ""}`} aria-hidden>
                    <span style={{ width: `${pct}%` }} />
                  </span>
                </span>
                <span className="axr-mp__module-pct">
                  <strong>{hecho ? textos.done : m.started ? `${pct}%` : textos.notStarted}</strong>
                  <small>
                    {m.completed}/{m.lessons} {textos.lessons}
                  </small>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {empezados.length > 0 && empezados.length < modulos.length ? (
        <button type="button" className="axr-mp__more" onClick={() => setTodos(!todos)}>
          {todos ? textos.showStarted : textos.showAll.replace("{n}", String(modulos.length))}
        </button>
      ) : null}
    </>
  );
}
