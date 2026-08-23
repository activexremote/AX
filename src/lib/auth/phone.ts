/**
 * ══════════════════════════════════════════════════════════
 *  Verificación del teléfono por SMS — APAGADA
 * ══════════════════════════════════════════════════════════
 *
 * Cada código cuesta dinero en el proveedor de SMS y hoy no compensa, así que
 * el paso está escondido, no borrado: el registro sigue pidiendo el teléfono
 * y guardándolo en el perfil, pero nadie tiene que confirmarlo para entrar.
 * Al campus se accede sólo con el enlace mágico del correo.
 *
 * Para encenderlo el día que toque: `NEXT_PUBLIC_PHONE_OTP=on` en el entorno
 * y un proveedor de SMS configurado en Supabase (Authentication → Providers →
 * Phone). Con eso vuelve el paso /verificar-telefono, el proxy vuelve a
 * cerrar el campus hasta confirmarlo y el callback vuelve a llevar allí.
 *
 * ⚠︎ Es NEXT_PUBLIC_ porque lo miran los tres lados: el proxy (edge), la
 * pantalla de verificación (servidor) y el formulario de acceso (navegador,
 * para decir o callar que habrá un SMS).
 */
export const PHONE_OTP_ENABLED = process.env.NEXT_PUBLIC_PHONE_OTP === "on";

/**
 * Teléfonos en formato E.164 (+34600111222), que es el único que acepta el
 * proveedor de SMS.
 *
 * Nadie escribe su número así. Se aceptan espacios, guiones, puntos y
 * paréntesis, y el prefijo internacional en las dos formas en que se dicta de
 * viva voz ("+34" y "0034"). Lo que NO se hace es adivinar el país cuando
 * falta el prefijo: este campus vende trabajo remoto internacional, y dar por
 * hecho un +34 mandaría el código de media clase a un número español que no
 * es suyo. Sin prefijo, el número se rechaza y se pide entero.
 */
export function normalizePhone(input: string): string | null {
  const cleaned = input.trim().replace(/[\s.\-()]/g, "").replace(/^00/, "+");
  // E.164: "+", país que no empieza por 0, y entre 8 y 15 dígitos en total.
  return /^\+[1-9]\d{7,14}$/.test(cleaned) ? cleaned : null;
}
