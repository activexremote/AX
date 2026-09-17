// ══════════════════════════════════════════════════════════
//  Interruptores del contenido que todavía no es real.
//
//  Regla: mientras un dato sea inventado, no se enseña. Publicar
//  valoraciones, cifras de alumnado o testimonios que no existen es una
//  práctica comercial engañosa (Directiva 2005/29/CE y su trasposición
//  española en la Ley de Competencia Desleal), y en el caso de G2 y
//  Trustpilot las propias plataformas persiguen los distintivos falsos.
//
//  Para activarlos: sustituye antes el dato de maqueta por el real en
//  src/app/bienvenida/copy.ts y sólo entonces pon la constante en true.
// ══════════════════════════════════════════════════════════

/**
 * Insignias de valoración del héroe (la propia, G2 y Trustpilot).
 * ⚠︎ Las tres puntuaciones de copy.ts son inventadas, incluida la de
 * "320+ opiniones de alumnos". Cuando existan los perfiles, lo correcto es
 * incrustar el widget oficial de cada plataforma para que el dato se
 * actualice solo y sea verificable.
 */
export const PROTOTYPE_RATINGS = false;

/**
 * Sección "Alumni": cifras (+320 formados, 18 países, 4,8/5), testimonios
 * firmados con nombre y ciudad, y logos de empresas donde trabajarían.
 * ⚠︎ Todo es de maqueta. Un testimonio inventado atribuido a una persona es
 * el caso más claro de publicidad engañosa de toda la página.
 */
export const PROTOTYPE_ALUMNI = false;

/**
 * Banda de cursos relámpago en la portada.
 * Apagada a petición del equipo: por ahora no se quiere desviar a nadie de
 * los dos cursos largos, que son los que se venden primero. No es un dato de
 * maqueta —los relámpago existen y /cursos-relampago sigue publicada—, sólo
 * una decisión comercial; por eso tampoco salen en el menú (copy.ts → nav).
 */
export const SHOW_FLASH_COURSES = false;

/**
 * Matrícula online en /matricula.
 * Cerrada a petición del equipo mientras los precios no sean públicos. No se
 * puede dejar el formulario de pago sin importes: antes de cobrar hay que
 * enseñar el precio total. Así que, cerrada, la página no enseña ofertas ni
 * precios y manda a pedir información. El cobro en Stripe no se toca: al
 * volver a true, todo vuelve a funcionar como estaba.
 */
export const CHECKOUT_OPEN = false;
