// ══════════════════════════════════════════════════════════
//  Lo que cuesta un banner
//
//  Tarifas de OpenAI en USD por millón de tokens. ⚠︎ Comprobar en
//  platform.openai.com/docs/pricing cuando cambie el modelo: el de imagen se
//  cobra por tokens de salida y una imagen vertical de calidad media ronda los
//  1.600 tokens. Un modelo que no está en la tabla se cuenta al precio del más
//  caro: mejor pasarse que quedarse corto.
//
//  Sin nada de servidor: el formulario enseña la estimación antes de generar.
// ══════════════════════════════════════════════════════════

type Tarifa = { in: number; out: number };

export const TARIFAS: Record<string, Tarifa> = {
  "gpt-4o": { in: 2.5, out: 10 },
  "gpt-4o-mini": { in: 0.15, out: 0.6 },
  "gpt-4.1": { in: 2, out: 8 },
  "gpt-4.1-mini": { in: 0.4, out: 1.6 },
  "gpt-5": { in: 1.25, out: 10 },
  "gpt-5-mini": { in: 0.25, out: 2 },
  // Imagen: entrada de texto y salida de imagen.
  "gpt-image-1": { in: 5, out: 40 },
  "gpt-image-1.5": { in: 5, out: 40 },
  "gpt-image-2": { in: 5, out: 40 },
};

const tarifa = (model: string) =>
  TARIFAS[model] ?? TARIFAS[Object.keys(TARIFAS).find((k) => model.startsWith(k)) ?? ""] ?? { in: 5, out: 40 };

export function costeUsd(model: string, input: number, output: number): number {
  const t = tarifa(model);
  return (input * t.in + output * t.out) / 1_000_000;
}

/** Tokens de una imagen 1024×1536 según la calidad (medidos con gpt-image-1). */
export const TOKENS_IMAGEN = { low: 400, medium: 1_600, high: 6_300 } as const;
export type Calidad = keyof typeof TOKENS_IMAGEN;

/** Estimación antes de generar: textos de todas las variantes + una imagen por variante con foto. */
export function estimar(textModel: string, imageModel: string, variantes: number, conImagen: boolean, calidad: Calidad): number {
  const texto = costeUsd(textModel, 3_500, 450 * variantes + 200);
  const imagen = conImagen ? variantes * costeUsd(imageModel, 350, TOKENS_IMAGEN[calidad]) : 0;
  return texto + imagen;
}
