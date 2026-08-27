// ══════════════════════════════════════════════════════════
//  Contacto directo de la landing de campaña.
//
//  ⚠︎ PENDIENTE: el número es un MARCADOR DE POSICIÓN. Hay que poner el de
//  verdad —formato internacional, sólo dígitos, sin "+" ni espacios— antes de
//  lanzar cualquier anuncio hacia esta página: la insignia de WhatsApp es una
//  promesa de respuesta, y una que marca a un número que no es nuestro es
//  peor que no tenerla.
//
//  Con la constante vacía la insignia no se pinta, así que dejarlo en blanco
//  también es una salida válida.
// ══════════════════════════════════════════════════════════
export const WHATSAPP_NUMBER = "34600000000";

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
