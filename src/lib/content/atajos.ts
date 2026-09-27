import { emptyBlock, type Block } from "@/lib/content/blocks";

// ══════════════════════════════════════════════════════════
//  Atajos al escribir
//
//  Los de toda la vida, los que ya tiene en los dedos cualquiera que haya
//  usado Notion, Slack o Markdown: escribes "## " y la línea se convierte en
//  un título; "- " y empieza una lista. Sin menús y sin levantar las manos
//  del teclado.
//
//  La conversión se hace SOBRE LA MARCHA, en cuanto se teclea el espacio: si
//  hubiera que esperar al final de la línea, el texto ya estaría escrito con
//  el formato que no era.
// ══════════════════════════════════════════════════════════

/** Lo que devuelve un atajo: el bloque nuevo y dónde queda el cursor. */
export type Conversion = { block: Block };

/**
 * ¿El texto de un párrafo empieza por un atajo?
 *
 * Devuelve el bloque en el que se convierte, con el resto de la línea ya
 * dentro, o null si no hay atajo que valga.
 */
export function aplicarAtajo(texto: string): Conversion | null {
  const resto = (patron: RegExp) => texto.replace(patron, "");

  // Títulos. Tres almohadillas o más son apartado: el campus sólo tiene dos
  // niveles, y más profundidad no la lee nadie.
  if (/^#\s/.test(texto)) return { block: { t: "h", level: 2, text: resto(/^#\s/) } };
  if (/^##\s/.test(texto)) return { block: { t: "h", level: 2, text: resto(/^##\s/) } };
  if (/^#{3,6}\s/.test(texto)) return { block: { t: "h", level: 3, text: resto(/^#{3,6}\s/) } };

  // Listas.
  if (/^[-*+]\s/.test(texto)) return { block: { t: "ul", items: [resto(/^[-*+]\s/)] } };
  if (/^\d+[.)]\s/.test(texto)) return { block: { t: "ol", items: [resto(/^\d+[.)]\s/)] } };
  if (/^\[[ xX]?\]\s/.test(texto)) return { block: { t: "checklist", items: [resto(/^\[[ xX]?\]\s/)] } };

  // Cita y separador.
  if (/^>\s/.test(texto)) return { block: { t: "quote", text: resto(/^>\s/) } };
  if (/^(---|\*\*\*|___)$/.test(texto.trim())) return { block: { t: "divider" } };

  // Cuadros destacados: el tono va delante, entre corchetes.
  const cuadro = texto.match(/^!(idea|aviso|error|ejemplo|dato)\s/);
  if (cuadro) {
    return {
      block: { t: "note", kind: cuadro[1] as "idea", text: texto.slice(cuadro[0].length) },
    };
  }

  return null;
}

/**
 * Convierte un bloque en otro tipo conservando lo que se pueda del texto.
 *
 * Es lo que hace el menú de "convertir en": pasar una lista a párrafos no
 * puede perder las líneas, y pasar un párrafo a tabla tiene que dejar la
 * tabla vacía en vez de meter el párrafo en una celda.
 */
export function convertirBloque(b: Block, destino: Block["t"]): Block {
  if (b.t === destino) return b;

  const lineas = textoDe(b);
  const nuevo = emptyBlock(destino);

  switch (nuevo.t) {
    case "p":
      return { t: "p", text: lineas.join("\n") };
    case "h":
      return { t: "h", level: 2, text: lineas.join(" ") };
    case "quote":
      return { t: "quote", text: lineas.join(" ") };
    case "note":
      return { t: "note", kind: "idea", text: lineas.join("\n") };
    case "ul":
    case "ol":
    case "checklist":
      return { t: nuevo.t, items: lineas.length ? lineas : [""] };
    case "checkpoint":
      return { t: "checkpoint", title: "Antes de seguir", items: lineas.length ? lineas : [""] };
    default:
      // Tablas, gráficos y demás: no hay conversión honesta desde texto
      // suelto, así que se empieza en blanco y se rellenan sus campos.
      return nuevo;
  }
}

/** Las líneas de texto de un bloque, para poder convertirlo en otro. */
function textoDe(b: Block): string[] {
  switch (b.t) {
    case "p":
    case "quote":
      return b.text.split("\n").filter(Boolean);
    case "h":
      return [b.text];
    case "note":
      return [b.title, b.text].filter(Boolean) as string[];
    case "ul":
    case "ol":
    case "checklist":
      return b.items;
    case "checkpoint":
      return [b.title, ...b.items];
    case "steps":
      return b.items.map((s) => [s.title, s.text].filter(Boolean).join(": "));
    case "timeline":
      return b.items.map((i) => [i.when, i.title].filter(Boolean).join(" — "));
    case "pros":
      return [...b.pros, ...b.cons];
    case "compare":
      return [...b.left.items, ...b.right.items];
    case "stats":
      return b.items.map((s) => `${s.value} ${s.label}`);
    case "table":
      return b.rows.map((f) => f.join(" · "));
    case "chart":
      return b.series.map((s) => `${s.label}: ${s.value}`);
    case "divider":
      return [];
  }
}
