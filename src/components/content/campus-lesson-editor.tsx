"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { saveLessonBlocks } from "@/app/admin/lecciones/actions";
import { BlockView } from "@/components/content/block-view";
import { EditableText } from "@/components/content/editable-text";
import { BlockFields } from "@/components/admin/block-fields";
import { aplicarAtajo, convertirBloque } from "@/lib/content/atajos";
import { markdownToBlocks } from "@/lib/content/markdown";
import { BLOCK_KINDS, BLOCK_LABEL, emptyBlock, type Block, type BlockType } from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  El editor de la lección, dentro del campus
//
//  Se escribe encima del texto. No hay formulario, ni "editar" y "ver": el
//  profesor lee su lección, pincha en una frase y la corrige donde está, con
//  la misma tipografía que va a tener publicada.
//
//  Lo que hace que se sienta como escribir y no como rellenar una ficha:
//
//  · ENTER parte el bloque y abre el siguiente, con lo que quedaba a la
//    derecha del cursor dentro. RETROCESO en un bloque vacío lo borra y sube.
//  · ATAJOS al teclear: "## " hace un título, "- " una lista, "[] " una
//    checklist, "> " una cita, "---" un separador (ver lib/content/atajos.ts).
//  · "/" abre el menú de bloques, filtrando según se escribe.
//  · SE GUARDA SOLO, un segundo después de dejar de escribir. Hay aviso en la
//    barra y un último guardado al salir del modo edición o al cerrar la
//    pestaña, que es donde se pierde el trabajo de verdad.
//
//  Los bloques que no son texto —tablas, gráficos, cifras, comparativas— no
//  se pueden escribir a pelo: se pinchan y se abren sus campos debajo, que es
//  también lo que hace Notion con lo que no es un párrafo.
//
//  Y el alumno no recibe nada de esto: la página sólo monta este componente
//  para profesorado.
// ══════════════════════════════════════════════════════════

/** Bloques sobre los que se escribe directamente. */
const TEXTO: BlockType[] = ["p", "h", "quote", "note", "ul", "ol", "checklist", "checkpoint"];

/** Un segundo largo: lo justo para no guardar en cada tecla. */
const ESPERA_GUARDADO = 1200;

type Foco = { i: number; sub?: number } | null;
type Estado = "limpio" | "pendiente" | "guardando" | "guardado" | "error";

export function CampusLessonEditor({
  lessonId,
  initial,
  markdown,
  copy,
}: {
  lessonId: string;
  initial: Block[];
  /** El Markdown de la lección, si todavía no está convertida a bloques. */
  markdown: string;
  copy: Copy;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initial);
  const [editando, setEditando] = useState(false);
  const [foco, setFoco] = useState<Foco>(null);
  const [menu, setMenu] = useState<{ i: number; filtro: string } | null>(null);
  const [campos, setCampos] = useState<number | null>(null);
  const [acciones, setAcciones] = useState<number | null>(null);
  const [estado, setEstado] = useState<Estado>("limpio");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const arrastrando = useRef<number | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  // La última versión, para poder guardarla desde un temporizador sin
  // arrastrar dependencias raras.
  const ultimos = useRef<Block[]>(initial);

  const guardar = useCallback(
    (lista: Block[]) => {
      ultimos.current = lista;
      setEstado("guardando");
      setError(null);
      startTransition(async () => {
        const r = await saveLessonBlocks(lessonId, JSON.stringify(lista));
        if ("error" in r) {
          setEstado("error");
          setError(r.error);
          return;
        }
        setEstado("guardado");
      });
    },
    [lessonId],
  );

  /** Cambia los bloques y programa el guardado. */
  const cambiar = useCallback(
    (lista: Block[], guardarYa = false) => {
      setBlocks(lista);
      ultimos.current = lista;
      if (temporizador.current) clearTimeout(temporizador.current);
      if (guardarYa) {
        guardar(lista);
        return;
      }
      setEstado("pendiente");
      temporizador.current = setTimeout(() => guardar(lista), ESPERA_GUARDADO);
    },
    [guardar],
  );

  // Cerrar la pestaña con algo pendiente no puede costar el trabajo.
  useEffect(() => {
    if (estado !== "pendiente") return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [estado]);

  function salirDeEdicion() {
    if (temporizador.current) clearTimeout(temporizador.current);
    if (estado === "pendiente") guardar(ultimos.current);
    setEditando(false);
    setFoco(null);
    setMenu(null);
    setCampos(null);
    setAcciones(null);
  }

  // ── Operaciones sobre la lista ─────────────────────────
  const editar = (i: number, b: Block) => cambiar(blocks.map((x, j) => (j === i ? b : x)));

  function insertar(i: number, b: Block = emptyBlock("p")) {
    const next = [...blocks];
    next.splice(i, 0, b);
    cambiar(next);
    setFoco({ i });
  }

  function quitar(i: number, focoAnterior = true) {
    const next = blocks.filter((_, j) => j !== i);
    cambiar(next.length ? next : [emptyBlock("p")], true);
    if (focoAnterior) setFoco({ i: Math.max(0, i - 1) });
  }

  function mover(desde: number, hasta: number) {
    if (hasta < 0 || hasta >= blocks.length || desde === hasta) return;
    const next = [...blocks];
    const [b] = next.splice(desde, 1);
    next.splice(hasta, 0, b);
    cambiar(next, true);
  }

  function convertir(i: number, destino: BlockType) {
    // Si se está eligiendo del menú "/", lo tecleado para buscar ("/tabla")
    // es la búsqueda, no contenido: el bloque nuevo nace vacío.
    const origen =
      menu?.i === i && blocks[i].t === "p" ? ({ t: "p", text: "" } as Block) : blocks[i];
    const nuevo = convertirBloque(origen, destino);
    cambiar(blocks.map((x, j) => (j === i ? nuevo : x)));
    setMenu(null);
    setAcciones(null);
    if (TEXTO.includes(destino)) setFoco({ i });
    else setCampos(i);
  }

  /** Texto escrito en un bloque de texto: atajos y menú "/" pasan por aquí. */
  function alEscribir(i: number, texto: string, aplicar: (t: string) => Block) {
    // El menú de bloques: se abre con "/" al principio de un párrafo vacío y
    // filtra con lo que se siga escribiendo.
    if (blocks[i].t === "p" && texto.startsWith("/")) {
      setMenu({ i, filtro: texto.slice(1).toLowerCase() });
      editar(i, aplicar(texto));
      return;
    }
    if (menu?.i === i) setMenu(null);

    // Atajos: sólo en párrafos, y sólo mientras la línea empieza por el atajo.
    if (blocks[i].t === "p") {
      const conversion = aplicarAtajo(texto);
      if (conversion) {
        cambiar(blocks.map((x, j) => (j === i ? conversion.block : x)));
        setFoco({ i });
        return;
      }
    }

    editar(i, aplicar(texto));
  }

  const vacio = blocks.length === 0;
  const tiposFiltrados = menu
    ? BLOCK_KINDS.filter((k) => !menu.filtro || k.label.toLowerCase().includes(menu.filtro))
    : [];

  // ── Pintado de un bloque en edición ────────────────────
  function pintarEdicion(b: Block, i: number) {
    const comun = {
      autoFocus: foco?.i === i && foco.sub === undefined,
      onEnter: (resto: string) => insertar(i + 1, { t: "p", text: resto }),
      onBackspaceEmpty: () => quitar(i),
      onArriba: () => setFoco({ i: i - 1 }),
      onAbajo: () => setFoco({ i: i + 1 }),
    };

    switch (b.t) {
      case "p":
        return (
          <EditableText
            {...comun}
            multiline
            value={b.text}
            placeholder={copy.nteEmpty}
            className="axr-blk__p axr-nte__text"
            onChange={(v) => alEscribir(i, v, (t) => ({ t: "p", text: t }))}
          />
        );

      case "h":
        return (
          <EditableText
            {...comun}
            value={b.text}
            placeholder={copy.fTitle}
            className={b.level === 3 ? "axr-blk__h3 axr-nte__text" : "axr-blk__h2 axr-nte__text"}
            onChange={(v) => alEscribir(i, v, (t) => ({ ...b, text: t }))}
          />
        );

      case "quote":
        return (
          <figure className="axr-blk__quote">
            <EditableText
              {...comun}
              multiline
              value={b.text}
              placeholder={copy.fText}
              className="axr-nte__text"
              onChange={(v) => alEscribir(i, v, (t) => ({ ...b, text: t }))}
            />
            <figcaption>
              <EditableText
                value={b.by ?? ""}
                placeholder={copy.fAuthor}
                className="axr-nte__text"
                autoFocus={foco?.i === i && foco.sub === 1}
                onChange={(v) => editar(i, { ...b, by: v })}
                onEnter={() => insertar(i + 1)}
              />
            </figcaption>
          </figure>
        );

      case "note":
        return (
          <aside className="axr-blk__note" data-kind={b.kind}>
            <div className="axr-nte__note-kinds">
              {(Object.keys(copy.noteKinds) as (keyof typeof copy.noteKinds)[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  data-on={b.kind === k}
                  onClick={() => editar(i, { ...b, kind: k })}
                >
                  {copy.noteKinds[k]}
                </button>
              ))}
            </div>
            <EditableText
              value={b.title ?? ""}
              placeholder={copy.fTitle}
              className="axr-nte__text axr-nte__note-title"
              autoFocus={foco?.i === i && foco.sub === 0}
              onChange={(v) => editar(i, { ...b, title: v })}
              onEnter={() => setFoco({ i, sub: 1 })}
            />
            <EditableText
              multiline
              value={b.text}
              placeholder={copy.fText}
              className="axr-nte__text"
              autoFocus={foco?.i === i && (foco.sub === 1 || foco.sub === undefined)}
              onChange={(v) => alEscribir(i, v, (t) => ({ ...b, text: t }))}
              onEnter={(resto) => insertar(i + 1, { t: "p", text: resto })}
              onBackspaceEmpty={() => quitar(i)}
            />
          </aside>
        );

      case "ul":
      case "ol":
      case "checklist":
      case "checkpoint": {
        const items = b.items;
        const cambiarItems = (nuevos: string[]) =>
          nuevos.length ? editar(i, { ...b, items: nuevos }) : convertir(i, "p");

        return (
          <div className={claseLista(b.t)}>
            {b.t === "checkpoint" ? (
              <EditableText
                value={b.title}
                placeholder={copy.fTitle}
                className="axr-nte__text axr-nte__cp-title"
                autoFocus={foco?.i === i && foco.sub === -1}
                onChange={(v) => editar(i, { ...b, title: v })}
                onEnter={() => setFoco({ i, sub: 0 })}
              />
            ) : null}

            <ul>
              {items.map((item, j) => (
                <li key={j}>
                  {b.t === "ol" ? <span className="axr-blk__ol-n">{String(j + 1).padStart(2, "0")}</span> : null}
                  <EditableText
                    value={item}
                    placeholder={copy.fItem}
                    className="axr-nte__text"
                    autoFocus={foco?.i === i && foco.sub === j}
                    onChange={(v) => {
                      // Un atajo escrito dentro de una lista de un solo punto
                      // convierte el bloque entero: es lo que espera quien se
                      // ha equivocado de tipo y lo corrige escribiendo.
                      if (items.length === 1 && aplicarAtajo(v)) {
                        alEscribir(i, v, () => ({ ...b, items: [v] }));
                        return;
                      }
                      cambiarItems(items.map((x, k) => (k === j ? v : x)));
                    }}
                    onEnter={(resto) => {
                      // Enter en un punto vacío cierra la lista y abre un
                      // párrafo: es cómo se sale de una lista en cualquier
                      // editor.
                      if (!items[j] && j === items.length - 1) {
                        cambiar(
                          blocks.map((x, k) => (k === i ? { ...b, items: items.slice(0, -1) } : x)),
                        );
                        insertar(i + 1);
                        return;
                      }
                      const nuevos = [...items];
                      nuevos.splice(j + 1, 0, resto);
                      editar(i, { ...b, items: nuevos });
                      setFoco({ i, sub: j + 1 });
                    }}
                    onBackspaceEmpty={() => {
                      if (items.length === 1) {
                        convertir(i, "p");
                        return;
                      }
                      cambiarItems(items.filter((_, k) => k !== j));
                      setFoco({ i, sub: Math.max(0, j - 1) });
                    }}
                    onArriba={() => (j === 0 ? setFoco({ i: i - 1 }) : setFoco({ i, sub: j - 1 }))}
                    onAbajo={() =>
                      j === items.length - 1 ? setFoco({ i: i + 1 }) : setFoco({ i, sub: j + 1 })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      }

      default:
        // Tabla, gráfico, cifras, pasos, comparativa, cronología, separador:
        // se ven como quedan y se abren sus campos al pinchar.
        return (
          <button type="button" className="axr-nte__complejo" onClick={() => setCampos(i)}>
            <BlockView block={b} />
          </button>
        );
    }
  }

  return (
    <div className="axr-nte" data-editing={editando ? "" : undefined}>
      {/* ── Barra ──────────────────────────────────────── */}
      <div className="axr-nte__bar">
        <span className="axr-nte__badge">{copy.staffBadge}</span>

        <div className="axr-nte__bar-actions">
          <em data-state={estado}>
            {estado === "pendiente" ? copy.nteUnsaved : null}
            {estado === "guardando" ? copy.saving : null}
            {estado === "guardado" ? `✓ ${copy.saved}` : null}
            {estado === "error" ? copy.saveError : null}
          </em>

          {vacio && markdown ? (
            <button
              type="button"
              className="axr-nte__btn"
              onClick={() => {
                // Una vez, sin IA y sin coste: el Markdown pasa a bloques
                // para poder escribir encima. No se guarda hasta que toque
                // algo, así que se puede probar sin miedo.
                setBlocks(markdownToBlocks(markdown));
                setEditando(true);
              }}
            >
              {copy.convert}
            </button>
          ) : null}

          <button
            type="button"
            className="axr-nte__btn"
            data-on={editando}
            onClick={() => (editando ? salirDeEdicion() : setEditando(true))}
            disabled={vacio && !markdown}
          >
            {editando ? copy.inlineDone : copy.inlineEdit}
          </button>
        </div>
      </div>

      {error ? <div className="axr-login__error">{error}</div> : null}
      {editando ? <p className="axr-nte__hint">{copy.nteHint}</p> : null}

      {/* ── La lección ─────────────────────────────────── */}
      <div className="axr-blk">
        {blocks.map((b, i) =>
          !editando ? (
            <BlockView key={i} block={b} storageKey={`${lessonId}:${i}`} />
          ) : (
            <div
              key={i}
              className="axr-nte__row"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (arrastrando.current !== null) mover(arrastrando.current, i);
                arrastrando.current = null;
              }}
            >
              {/* Margen izquierdo: añadir debajo y agarrar para mover. Sale
                  al pasar el ratón por la fila, como en Notion. */}
              <div className="axr-nte__gutter">
                <button type="button" title={copy.add} onClick={() => insertar(i + 1)}>
                  +
                </button>
                <button
                  type="button"
                  title={copy.drag}
                  draggable
                  onDragStart={() => {
                    arrastrando.current = i;
                  }}
                  onClick={() => setAcciones(acciones === i ? null : i)}
                >
                  ⠿
                </button>
              </div>

              <div className="axr-nte__content">{pintarEdicion(b, i)}</div>

              {/* Menú del bloque */}
              {acciones === i ? (
                <div className="axr-nte__acciones">
                  <button type="button" onClick={() => { mover(i, i - 1); setAcciones(null); }} disabled={i === 0}>
                    ↑ {copy.moveUp}
                  </button>
                  <button
                    type="button"
                    onClick={() => { mover(i, i + 1); setAcciones(null); }}
                    disabled={i === blocks.length - 1}
                  >
                    ↓ {copy.moveDown}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      insertar(i + 1, JSON.parse(JSON.stringify(b)) as Block);
                      setAcciones(null);
                    }}
                  >
                    ⧉ {copy.duplicate}
                  </button>
                  {!TEXTO.includes(b.t) && b.t !== "divider" ? (
                    <button type="button" onClick={() => { setCampos(i); setAcciones(null); }}>
                      ✎ {copy.edit}
                    </button>
                  ) : null}
                  <button type="button" onClick={() => { quitar(i); setAcciones(null); }}>
                    ✕ {copy.remove}
                  </button>

                  <span className="axr-nte__acciones-label">{copy.nteTurnInto}</span>
                  <div className="axr-nte__acciones-tipos">
                    {BLOCK_KINDS.map((k) => (
                      <button key={k.t} type="button" data-on={k.t === b.t} onClick={() => convertir(i, k.t)}>
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Menú "/" */}
              {menu?.i === i ? (
                <div className="axr-nte__slash">
                  {tiposFiltrados.length ? (
                    tiposFiltrados.map((k) => (
                      <button key={k.t} type="button" onClick={() => convertir(i, k.t)}>
                        <strong>{k.label}</strong>
                        <span>{k.hint}</span>
                      </button>
                    ))
                  ) : (
                    <p>{copy.nteNoMatch}</p>
                  )}
                </div>
              ) : null}

              {/* Campos de un bloque que no es texto */}
              {campos === i ? (
                <div className="axr-nte__campos">
                  <BlockFields block={b} onChange={(nb) => editar(i, nb)} copy={copy} />
                  <button type="button" className="axr-nte__btn" onClick={() => setCampos(null)}>
                    {copy.close}
                  </button>
                </div>
              ) : null}
            </div>
          ),
        )}
      </div>

      {editando ? (
        <button type="button" className="axr-nte__final" onClick={() => insertar(blocks.length)}>
          + {copy.add}
        </button>
      ) : null}
    </div>
  );
}

function claseLista(t: BlockType): string {
  if (t === "ul") return "axr-blk__ul axr-nte__lista";
  if (t === "ol") return "axr-blk__ol axr-nte__lista";
  if (t === "checklist") return "axr-blk__check axr-nte__lista axr-nte__lista--check";
  return "axr-blk__checkpoint axr-nte__lista axr-nte__lista--cp";
}
