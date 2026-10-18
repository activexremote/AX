import { blocksToText, type Block } from "@/lib/content/blocks";

// ══════════════════════════════════════════════════════════
//  Qué gesto hace la guía virtual en cada momento de la lección
//
//  La narración lee los bloques en orden (ver lib/tts/fish.ts →
//  lessonNarrationText), así que la posición de cada bloque en el texto dice,
//  en proporción, cuándo suena en el audio. No es exacto al milisegundo, y no
//  hace falta: un guiño que llega medio segundo tarde sigue siendo un guiño.
//
//  El gesto sale del TIPO de bloque, no del texto: una idea clave sonríe, un
//  ejemplo guiña, un aviso se piensa, un punto de control asiente. Así el
//  avatar enfatiza lo mismo que la maquetación de la lección.
// ══════════════════════════════════════════════════════════

export type Gesture = "wave" | "smile" | "wink" | "think" | "nod" | "point" | "thumbup";
export type GesturePlan = { at: number; gesture: Gesture }[];

/** Los mismos bloques que se narran: ver lessonNarrationText. */
const SPOKEN = (b: Block) => !["resources", "table", "stats", "chart", "divider"].includes(b.t);

function gestureFor(b: Block): Gesture | null {
  switch (b.t) {
    case "h":
      return b.level === 2 ? "point" : null;
    case "note":
      return b.kind === "ejemplo" ? "wink" : b.kind === "aviso" || b.kind === "error" ? "think" : "smile";
    case "checklist":
    case "checkpoint":
      return "nod";
    case "steps":
    case "ol":
      return "point";
    case "quote":
      return "smile";
    default:
      return null;
  }
}

export function lessonGesturePlan(blocks: Block[]): GesturePlan {
  const spoken = blocks.filter(SPOKEN);
  const lengths = spoken.map((b) => blocksToText([b]).length + 2);
  const total = lengths.reduce((a, b) => a + b, 0) || 1;

  const plan: GesturePlan = [{ at: 0.01, gesture: "wave" }];
  let acc = 0;
  spoken.forEach((b, i) => {
    const g = gestureFor(b);
    // Un poco después de que empiece el bloque: el gesto acompaña a la
    // frase, no la anticipa.
    if (g) plan.push({ at: Math.min(0.95, (acc + lengths[i] * 0.15) / total), gesture: g });
    acc += lengths[i];
  });
  plan.push({ at: 0.97, gesture: "thumbup" });

  // Dos gestos pegados se pisan: se deja al menos un 6 % de lección entre ellos.
  return plan.filter((p, i) => i === 0 || p.at - plan[i - 1].at > 0.06 || p.gesture === "thumbup");
}
