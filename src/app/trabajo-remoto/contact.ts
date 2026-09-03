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

// ══════════════════════════════════════════════════════════
//  La convocatoria de ESTA landing
//
//  Propia, no la de bienvenida/cohort.ts. La portada vende la convocatoria de
//  diciembre con su formato de una clase por semana; ésta vende la de enero,
//  que va en fines de semana. Tocar la constante compartida habría cambiado
//  la cuenta atrás y las fechas de la portada de rebote.
//
//  Siete fines de semana, sábado y domingo, cuatro horas cada día: 14 módulos
//  y 56 h lectivas. Del 9 de enero al 21 de febrero de 2027.
// ══════════════════════════════════════════════════════════
export const COHORT_START = "2027-01-09T10:00:00+01:00";

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
