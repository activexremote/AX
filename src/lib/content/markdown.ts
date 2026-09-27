import { parseBlocks, type Block } from "@/lib/content/blocks";

// ══════════════════════════════════════════════════════════
//  Del Markdown de siempre a bloques
//
//  Las lecciones que ya existen son un texto en Markdown. Para poder
//  editarlas haciendo clic encima hay que convertirlas una vez, y eso es lo
//  que hace esto: sin IA, sin llamadas y sin coste.
//
//  No es un intérprete de Markdown completo ni quiere serlo: cubre lo que de
//  verdad se usa en una lección —títulos, listas, tablas, citas, checklists y
//  párrafos— y lo que no reconoce acaba en un párrafo, que es la forma menos
//  dañina de equivocarse. Nada se pierde por el camino.
//
//  El negrita/cursiva de dentro de una frase SÍ se pierde: los bloques
//  guardan texto plano a propósito (ver lib/content/blocks.ts). Es el precio
//  de que nada de lo que escriba un modelo pueda ejecutarse en el navegador
//  de un alumno.
// ══════════════════════════════════════════════════════════

/** Quita el marcado de dentro de una línea y deja el texto. */
function limpiar(linea: string): string {
  return linea
    // Enlaces: se queda el texto y se añade la dirección entre paréntesis,
    // que si no, el alumno pierde la referencia.
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1 ($2)")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}

const ES_TABLA_SEP = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/;

function celdas(linea: string): string[] {
  return linea
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => limpiar(c));
}

/**
 * Convierte un Markdown en bloques.
 *
 * Pasa por `parseBlocks` antes de devolver, como todo lo demás: una sola
 * puerta de entrada al contenido.
 */
export function markdownToBlocks(md: string): Block[] {
  const lineas = (md ?? "").replace(/\r\n/g, "\n").split("\n");
  const out: Block[] = [];

  let parrafo: string[] = [];

  const cerrarParrafo = () => {
    if (!parrafo.length) return;
    const texto = parrafo.join(" ").trim();
    if (texto) out.push({ t: "p", text: texto });
    parrafo = [];
  };

  for (let i = 0; i < lineas.length; i++) {
    const cruda = lineas[i];
    const linea = cruda.trim();

    // ── Línea en blanco: cierra el párrafo ──
    if (!linea) {
      cerrarParrafo();
      continue;
    }

    // ── Bloque de código: se conserva tal cual, como párrafo ──
    if (linea.startsWith("```")) {
      cerrarParrafo();
      const dentro: string[] = [];
      i++;
      while (i < lineas.length && !lineas[i].trim().startsWith("```")) {
        dentro.push(lineas[i]);
        i++;
      }
      const texto = dentro.join("\n").trim();
      if (texto) out.push({ t: "p", text: texto });
      continue;
    }

    // ── Título ──
    const titulo = linea.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      cerrarParrafo();
      const nivel = titulo[1].length;
      out.push({ t: "h", level: nivel >= 3 ? 3 : 2, text: limpiar(titulo[2]) });
      continue;
    }

    // ── Separador ──
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(linea)) {
      cerrarParrafo();
      out.push({ t: "divider" });
      continue;
    }

    // ── Cita ──
    if (linea.startsWith(">")) {
      cerrarParrafo();
      const trozos: string[] = [];
      while (i < lineas.length && lineas[i].trim().startsWith(">")) {
        trozos.push(limpiar(lineas[i].trim().replace(/^>\s?/, "")));
        i++;
      }
      i--;
      const texto = trozos.filter(Boolean).join(" ");
      // «— Alguien» al final de una cita es su autor, no parte de la frase.
      const autor = texto.match(/[—-]{1,2}\s*([^—-]{2,60})$/);
      if (autor) {
        out.push({ t: "quote", text: texto.slice(0, autor.index).trim(), by: autor[1].trim() });
      } else if (texto) {
        out.push({ t: "quote", text: texto });
      }
      continue;
    }

    // ── Tabla ──
    if (linea.includes("|") && ES_TABLA_SEP.test(lineas[i + 1] ?? "")) {
      cerrarParrafo();
      const head = celdas(linea);
      const filas: string[][] = [];
      i += 2;
      while (i < lineas.length && lineas[i].includes("|") && lineas[i].trim()) {
        filas.push(celdas(lineas[i]));
        i++;
      }
      i--;
      out.push({ t: "table", head, rows: filas });
      continue;
    }

    // ── Listas (con casilla, con viñeta o numeradas) ──
    const esLista = /^([-*+]|\d+[.)])\s+/.test(linea);
    if (esLista) {
      cerrarParrafo();
      const numerada = /^\d+[.)]\s+/.test(linea);
      const items: string[] = [];
      let conCasilla = false;

      while (i < lineas.length) {
        const l = lineas[i].trim();
        if (!/^([-*+]|\d+[.)])\s+/.test(l)) break;
        let texto = l.replace(/^([-*+]|\d+[.)])\s+/, "");
        // `- [ ] tarea` es una checklist, que en el campus se puede marcar.
        const casilla = texto.match(/^\[([ xX])\]\s*(.*)$/);
        if (casilla) {
          conCasilla = true;
          texto = casilla[2];
        }
        items.push(limpiar(texto));
        i++;
      }
      i--;

      const limpios = items.filter(Boolean);
      if (limpios.length) {
        if (conCasilla) out.push({ t: "checklist", items: limpios });
        else out.push({ t: numerada ? "ol" : "ul", items: limpios });
      }
      continue;
    }

    // ── Cualquier otra cosa: párrafo ──
    parrafo.push(limpiar(linea));
  }

  cerrarParrafo();
  return parseBlocks(out);
}
