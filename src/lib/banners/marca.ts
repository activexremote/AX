// ══════════════════════════════════════════════════════════
//  Lo que la IA sabe de la escuela al escribir un anuncio
//
//  ⚠︎ DATOS VERIFICADOS es la única fuente de hechos que puede usar. Sale de
//  la landing (app/bienvenida/copy.ts). Si cambia la convocatoria, el número
//  de módulos o el formato, se cambia aquí: un anuncio con un dato viejo es
//  publicidad engañosa aunque nadie lo haya hecho a propósito.
//
//  Lo que NO está a propósito:
//   · las plazas disponibles (en la web son un dato de maqueta);
//   · testimonios y cifras de alumnos;
//   · precios (cambian por plan y por fecha, y un precio en un anuncio tiene
//     que llevar IVA y condiciones).
// ══════════════════════════════════════════════════════════

import type { AdCourse } from "@/lib/supabase/types";

export const MARCA = `ActiveXRemote es The Remote Business School: una escuela online que forma a
profesionales para trabajar en remoto para empresas de todo el mundo y para
montar negocios sin fronteras.

TONO DE VOZ:
- Tuteo siempre.
- Contraste: «no es X, es Y». Rompe la expectativa y define. El gancho de la
  marca es «No es que te falte talento. Es que nadie te ha enseñado a
  trabajar sin fronteras».
- Frase corta. Cifras en dígitos. Sin adjetivos de folleto («increíble»,
  «transformador», «disruptivo»), sin emojis ni exclamaciones dobles.
- Comillas latinas «» y puntos suspensivos de un carácter (…).
- Títulos en frase, no En Mayúscula Cada Palabra.`;

export const DATOS: Record<AdCourse, string> = {
  escuela: `- 14 módulos en directo: 7 de núcleo comunes y 7 de especialización.
- Dos caminos: Remote Professional (trabajar en remoto para empresas
  internacionales) y Remote Founder (montar un negocio sin fronteras). Se
  pueden hacer los dos.
- 56 horas en directo repartidas en 7 fines de semana. Cada módulo son 4 horas
  en vivo con frameworks, herramientas reales y un ejercicio aplicado al caso
  de cada alumno: se sale con entregables, no con apuntes.
- Grupo reducido por convocatoria, campus virtual con las grabaciones y
  acompañamiento en Slack durante todo el programa.
- Herramientas que se trabajan: Notion, Slack, Wise, Deel, Zapier, LLMs.
- La próxima convocatoria arranca el 9 de enero.
- 100 % online y en directo.`,
  "remote-professional": `- Curso Remote Professional: para trabajar en remoto para empresas de todo el
  mundo. 7 módulos de núcleo + 7 de especialización (14 en total).
- Se trabaja la candidatura internacional, la marca profesional y la forma de
  trabajar en equipos distribuidos y asíncronos.
- 56 horas en directo en 7 fines de semana; módulos de 4 horas con ejercicio
  práctico aplicado a tu caso y entregables.
- Grupo reducido, campus virtual con grabaciones, acompañamiento en Slack.
- Herramientas: Notion, Slack, Wise, Deel, Zapier, LLMs.
- La próxima convocatoria arranca el 9 de enero.`,
  "remote-founder": `- Curso Remote Founder: para construir un negocio sin fronteras. 7 módulos de
  núcleo + 7 de especialización (14 en total).
- Se trabaja la oferta, la captación de clientes internacionales, los
  procesos y las herramientas para operar en remoto.
- 56 horas en directo en 7 fines de semana; módulos de 4 horas con ejercicio
  práctico aplicado a tu proyecto y entregables.
- Grupo reducido, campus virtual con grabaciones, acompañamiento en Slack.
- Herramientas: Notion, Slack, Wise, Deel, Zapier, LLMs.
- La próxima convocatoria arranca el 9 de enero.`,
};

/** Qué pide cada ángulo. Lo lee la IA; en el panel se enseña la etiqueta. */
export const ANGULO_GUIA: Record<string, string> = {
  obstaculo: "Obstáculo: nombra la barrera real (no saber cómo, no tener método) sin atribuírsela a quien lee. Contraste «no es X, es Y».",
  aspiracion: "Aspiración: el tipo de trabajo o de negocio al que se aspira (equipos internacionales, clientes en otros países), sin prometer que se consigue.",
  metodo: "Método: cómo funciona el programa. Módulos, entregables, ejercicio aplicado a tu caso.",
  directo: "En directo: clases en vivo, grupo reducido, acompañamiento en Slack. Lo opuesto a un curso grabado que nadie termina.",
  herramientas: "Herramientas: el stack remoto que se aprende a usar (Notion, Slack, Wise, Deel, Zapier, LLMs). Sin logos.",
  convocatoria: "Convocatoria: la fecha real de inicio como única urgencia. Nada de plazas ni cuentas atrás.",
};

/**
 * Las normas de cualquier imagen, sea cual sea la línea visual
 * (direcciones.ts). Van en inglés: los modelos de imagen lo siguen mejor.
 */
export const REGLAS_IMAGEN = `HARD RULES FOR THE IMAGE:
- If people appear: adults of diverse backgrounds and ages, never celebrities.
- Absolutely NO text, letters, numbers, words, captions, logos, watermarks or
  brand marks anywhere. Screens, notebooks and signs must show nothing legible.
- No user-interface elements: no play buttons, notifications, chat bubbles,
  progress bars, cursors or close buttons.
- No money, banknotes, bank balances, charts going up, luxury cars, yachts or
  "get rich" imagery. No before/after.
- No celebrities or recognisable real people.
- Keep the main subject in the CENTRAL square of the frame; the top and bottom
  of a tall frame will be cropped or covered by text.
- Leave calm, uncluttered areas for text overlay.`;

/** El acabado por defecto, cuando no se ha elegido línea visual (publicaciones, variantes antiguas). */
export const ESTILO_BASE = `Photorealistic editorial photograph, natural light, shallow depth of field,
modern and warm, shot on a 35mm lens. Authentic candid moment, not a posed
stock photo. Subtle colour accents in violet (#5B4BF5), magenta and warm coral
that match the brand.`;

export const ESTILO_IMAGEN = `${ESTILO_BASE}\n\n${REGLAS_IMAGEN}`;
