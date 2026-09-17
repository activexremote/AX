// ══════════════════════════════════════════════════════════
//  Contacto directo de la landing de campaña.
//
//  ⚠︎ APAGADO a petición del equipo hasta que haya teléfono. Cuando lo haya,
//  va aquí en formato internacional —sólo dígitos, sin "+" ni espacios— y la
//  insignia vuelve a salir sola.
//
//  Con la constante vacía la insignia no se pinta: la insignia de WhatsApp es
//  una promesa de respuesta, y una que marca a un número que no es nuestro es
//  peor que no tenerla.
// ══════════════════════════════════════════════════════════
export const WHATSAPP_NUMBER = "";

// ══════════════════════════════════════════════════════════
//  La convocatoria
//
//  La misma que la de la portada y las páginas de curso: siete fines de
//  semana, sábado y domingo, cuatro horas cada día: 14 módulos y 56 h
//  lectivas. Del 9 de enero al 21 de febrero de 2027.
//
//  Antes era propia, porque la portada vendía otra convocatoria en diciembre.
//  Desde que la web usa las fechas de esta landing, la constante vive en
//  bienvenida/cohort.ts y aquí sólo se reexporta: dos copias de la misma
//  fecha acaban siempre diciendo cosas distintas.
// ══════════════════════════════════════════════════════════
export { COHORT_START } from "@/app/bienvenida/cohort";

/**
 * El stack que se enseña en la página, con su logotipo.
 *
 * UNA sola lista para los dos sitios donde sale —la marquesina de debajo del
 * héroe y las fichas de la sección del programa— porque es el mismo stack. Con
 * dos listas, la de abajo se quedó corta en cuanto la de arriba cambió.
 *
 * Doce, no dieciocho. Los trazos de simple-icons son largos y cada logotipo
 * viaja en el HTML: pasar de 18 a 12 quita unos 20 kB de la primera carga y
 * en una tira que se mueve nadie llega a contarlos. Y los iconos se definen
 * una vez en un <symbol>, así que enseñarlos dos veces no cuesta un byte más.
 */
export const STACK_TOOLS = [
  "notion",
  "slack",
  "wise",
  "deel",
  "zapier",
  "chatgpt",
  "claude",
  "loom",
  "linear",
  "figma",
  "stripe",
  "airtable",
] as const;
