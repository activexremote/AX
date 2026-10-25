"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";
import type { ManualCopy } from "@/lib/i18n/manual";
import type { Bloque, Capitulo } from "@/lib/manual/contenido";

// ══════════════════════════════════════════════════════════
//  El manual del profesorado, en pantalla
//
//  Índice fijo a la izquierda (marca el capítulo que se está leyendo), un
//  buscador que deja sólo los capítulos que hablan de lo buscado, listas de
//  comprobación que se quedan marcadas en este navegador, el prompt de
//  NotebookLM listo para copiar y una versión para imprimir.
// ══════════════════════════════════════════════════════════

const CLAVE = "axr-manual-checks";

/** Sin tildes ni mayúsculas, para buscar «rubrica» y encontrar «rúbrica». */
const plano = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** **negrita** → <strong>. Es todo el formato que lleva el contenido. */
function Rico({ text }: { text: string }) {
  const partes = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {partes.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

function textoDe(c: Capitulo): string {
  const de = (b: Bloque): string => {
    switch (b.t) {
      case "p":
        return b.text;
      case "lista":
        return b.items.join(" ");
      case "pasos":
        return b.items.map((i) => `${i.titulo} ${i.texto} ${i.donde ?? ""}`).join(" ");
      case "check":
        return `${b.titulo} ${b.items.join(" ")}`;
      case "tabla":
        return [...b.head, ...b.rows.flat()].join(" ");
      case "nota":
        return `${b.titulo ?? ""} ${b.text}`;
      case "copiar":
        return `${b.titulo} ${b.text}`;
      case "atajos":
        return b.items.map((i) => `${i.label} ${i.desc}`).join(" ");
      case "linea":
        return b.items.map((i) => `${i.cuando} ${i.que} ${i.donde}`).join(" ");
    }
  };
  return plano(`${c.titulo} ${c.resumen} ${c.bloques.map(de).join(" ")}`);
}

function Copiar({ text, copy }: { text: string; copy: ManualCopy }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="axr-btn axr-btn--ghost axr-btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* sin permiso de portapapeles: se copia a mano */
        }
      }}
    >
      <Icono n={ok ? "ok" : "lista"} size={14} /> {ok ? copy.copied : copy.copy}
    </button>
  );
}

function Checklist({
  b,
  hechas,
  marcar,
  copy,
}: {
  b: Extract<Bloque, { t: "check" }>;
  hechas: Record<string, boolean>;
  marcar: (k: string, v: boolean) => void;
  copy: ManualCopy;
}) {
  const n = b.items.filter((_, i) => hechas[`${b.id}:${i}`]).length;
  return (
    <div className="axr-man-check">
      <div className="axr-man-check__head">
        <strong>{b.titulo}</strong>
        <span className={`axr-adm-pill${n === b.items.length ? " axr-adm-pill--ok" : ""}`}>
          {copy.checks.replace("{n}", String(n)).replace("{t}", String(b.items.length))}
        </span>
        {n ? (
          <button type="button" className="axr-man-check__reset" onClick={() => b.items.forEach((_, i) => marcar(`${b.id}:${i}`, false))}>
            {copy.resetChecks}
          </button>
        ) : null}
      </div>
      <ul>
        {b.items.map((it, i) => {
          const k = `${b.id}:${i}`;
          return (
            <li key={k}>
              <label className={hechas[k] ? "is-done" : undefined}>
                <input type="checkbox" checked={Boolean(hechas[k])} onChange={(e) => marcar(k, e.target.checked)} />
                <span>
                  <Rico text={it} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Pieza({ b, hechas, marcar, copy }: { b: Bloque; hechas: Record<string, boolean>; marcar: (k: string, v: boolean) => void; copy: ManualCopy }): ReactNode {
  switch (b.t) {
    case "p":
      return (
        <p className="axr-man-p">
          <Rico text={b.text} />
        </p>
      );
    case "lista":
      return (
        <ul className="axr-man-list">
          {b.items.map((i) => (
            <li key={i}>
              <Rico text={i} />
            </li>
          ))}
        </ul>
      );
    case "pasos":
      return (
        <ol className="axr-man-steps">
          {b.items.map((s, i) => (
            <li key={s.titulo}>
              <span className="axr-man-steps__n">{i + 1}</span>
              <div>
                <div className="axr-man-steps__head">
                  <strong>{s.titulo}</strong>
                  {s.plazo ? <span className="axr-adm-pill axr-adm-pill--accent">{s.plazo}</span> : null}
                  {s.donde ? <span className="axr-adm-pill">{s.donde}</span> : null}
                  {s.href ? (
                    <Link href={s.href} className="axr-man-go">
                      {copy.go} <Icono n="flecha" size={12} />
                    </Link>
                  ) : null}
                </div>
                <p>
                  <Rico text={s.texto} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "check":
      return <Checklist b={b} hechas={hechas} marcar={marcar} copy={copy} />;
    case "tabla":
      return (
        <div className="axr-admin-scroll axr-man-table">
          <table className="axr-admin-table">
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <Rico text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "nota":
      return (
        <div className={`axr-adm-note${b.tono === "aviso" ? " axr-adm-note--warn" : b.tono === "ok" ? " axr-adm-note--ok" : ""}`}>
          <Icono n={b.tono === "aviso" ? "aviso" : b.tono === "ok" ? "ok" : "info"} />
          <span>
            {b.titulo ? <strong className="axr-man-note__title">{b.titulo}</strong> : null}
            <Rico text={b.text} />
          </span>
        </div>
      );
    case "copiar":
      return (
        <div className="axr-man-copy">
          <div className="axr-man-copy__head">
            <strong>{b.titulo}</strong>
            <Copiar text={b.text} copy={copy} />
          </div>
          <pre>{b.text}</pre>
        </div>
      );
    case "atajos":
      return (
        <div className="axr-man-links">
          {b.items.map((a) => (
            <Link key={a.href} href={a.href} className="axr-man-link">
              <strong>
                {a.label} <Icono n="flecha" size={13} />
              </strong>
              <span>{a.desc}</span>
            </Link>
          ))}
        </div>
      );
    case "linea":
      return (
        <ol className="axr-man-timeline">
          {b.items.map((it) => (
            <li key={`${it.cuando}-${it.que}`} className={it.cuando === "DÍA 0" ? "is-day" : undefined}>
              <span className="axr-man-timeline__when">{it.cuando}</span>
              <span className="axr-man-timeline__dot" aria-hidden />
              <span className="axr-man-timeline__what">
                <strong>{it.que}</strong>
                <small>{it.donde}</small>
              </span>
            </li>
          ))}
        </ol>
      );
  }
}

export function ManualProfesor({ capitulos, copy }: { capitulos: Capitulo[]; copy: ManualCopy }) {
  const [q, setQ] = useState("");
  const [hechas, setHechas] = useState<Record<string, boolean>>({});
  const [activo, setActivo] = useState(capitulos[0]?.id);

  // Las casillas marcadas, en este navegador. Si no hay almacenamiento, se
  // marcan igual y se olvidan al salir.
  useEffect(() => {
    try {
      setHechas(JSON.parse(localStorage.getItem(CLAVE) ?? "{}"));
    } catch {
      /* sin almacenamiento */
    }
  }, []);
  const marcar = (k: string, v: boolean) =>
    setHechas((prev) => {
      const next = { ...prev, [k]: v };
      if (!v) delete next[k];
      try {
        localStorage.setItem(CLAVE, JSON.stringify(next));
      } catch {
        /* sin almacenamiento */
      }
      return next;
    });

  const indice = useMemo(() => capitulos.map((c) => ({ c, texto: textoDe(c) })), [capitulos]);
  const palabras = plano(q).split(/\s+/).filter(Boolean);
  const visibles = palabras.length ? indice.filter(({ texto }) => palabras.every((p) => texto.includes(p))).map(({ c }) => c) : capitulos;

  // El capítulo que se está leyendo, para marcarlo en el índice.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        const vista = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vista) setActivo(vista.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    visibles.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [visibles]);

  return (
    <div className="axr-man">
      <aside className="axr-man__toc" aria-label={copy.index}>
        <div className="axr-man__search">
          <Icono n="buscar" size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={copy.search} aria-label={copy.search} />
        </div>
        <nav>
          <span className="axr-man__toc-label">{copy.index}</span>
          <ol>
            {visibles.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className={activo === c.id ? "is-active" : undefined}>
                  <span className="axr-man__toc-n">{capitulos.indexOf(c) + 1}</span>
                  {c.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <button type="button" className="axr-btn axr-btn--ghost axr-btn--small axr-man__print" onClick={() => window.print()}>
          <Icono n="descarga" size={14} /> {copy.print}
        </button>
      </aside>

      <div className="axr-man__body">
        {copy.onlySpanish ? (
          <div className="axr-adm-note">
            <Icono n="info" />
            <span>{copy.onlySpanish}</span>
          </div>
        ) : null}
        {visibles.length === 0 ? (
          <div className="axr-admin-card axr-adm-empty">
            <Icono n="buscar" size={28} />
            <span>{copy.noResults}</span>
          </div>
        ) : null}
        {visibles.map((c) => (
          <section key={c.id} id={c.id} className="axr-admin-card axr-man-chapter">
            <header className="axr-man-chapter__head">
              <span className="axr-man-chapter__icon" aria-hidden>
                <Icono n={c.icono} size={20} />
              </span>
              <div>
                <span className="axr-man-chapter__n">{capitulos.indexOf(c) + 1}</span>
                <h2>{c.titulo}</h2>
                <p>{c.resumen}</p>
              </div>
            </header>
            <div className="axr-man-chapter__content">
              {c.bloques.map((b, i) => (
                <Pieza key={i} b={b} hechas={hechas} marcar={marcar} copy={copy} />
              ))}
            </div>
          </section>
        ))}
        <p className="axr-man__foot">{copy.updated}</p>
      </div>
    </div>
  );
}
