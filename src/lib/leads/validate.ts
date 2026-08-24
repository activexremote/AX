// ══════════════════════════════════════════════════════════
//  Validación de los formularios públicos
// ══════════════════════════════════════════════════════════
//
//  Todo esto corre en el SERVIDOR. Lo del navegador —`required`, `pattern`,
//  `type="email"`— es para ayudar a quien rellena de buena fe: se salta con
//  la consola abierta o mandando un POST a pelo, y los bots hacen justo eso.
//  Aquí no se ayuda a nadie: aquí se decide qué entra.
//
//  El criterio para rechazar es "esto no puede ser un dato real", nunca "esto
//  no me gusta". Un formulario de captación que rechaza a un cliente de
//  verdad cuesta mucho más caro que uno que deja pasar algo de basura: por eso
//  no se comprueban ortografías, ni se exige prefijo internacional, ni se
//  bloquean dominios raros por serlo.

export type LeadFieldError =
  | "bad_name"
  | "bad_email"
  | "bad_phone"
  | "bad_city"
  | "spam"
  | "too_many";

/** Lo que llega del formulario, ya limpio y listo para guardar. */
export type CleanLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
};

// ── Señales de spam ──────────────────────────────────────
//
// Un enlace en el nombre o en la ciudad no es un error de tecleo: es el
// patrón de bot más viejo que hay, meter la URL que quieren promocionar en
// cualquier campo de texto que encuentren.
const ENLACE = /(https?:\/\/|www\.|<a\s|\[url|\.(com|net|ru|xyz|top)\b)/i;

/** Cuatro veces el mismo carácter seguido: "aaaa", "1111". Nadie se llama así. */
const REPETIDO = /(.)\1{3,}/;

/** Letras de cualquier alfabeto, espacios, guiones, apóstrofos y puntos. */
const NOMBRE_OK = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]*$/u;

function limpiar(texto: string): string {
  // Espacios repetidos y espacios raros (los que pegan los bots) a uno normal.
  return texto.replace(/[\s ​]+/g, " ").trim();
}

/**
 * Escrituras en las que un nombre de UN solo carácter es de lo más normal:
 * 李 es un apellido chino y 伟 un nombre. Pedir dos caracteres a todo el
 * mundo rechazaría a clientes reales de un mercado entero, que es justo lo
 * que no puede hacer un formulario de captación.
 */
const IDEOGRAMA = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export function validateName(raw: string): string | null {
  const v = limpiar(raw);
  if (v.length < 1 || v.length > 60) return null;
  // Una sola letra latina sí es basura: "A", "x".
  if (v.length === 1 && !IDEOGRAMA.test(v)) return null;
  if (!NOMBRE_OK.test(v)) return null;
  if (REPETIDO.test(v) || ENLACE.test(v)) return null;
  return v;
}

export function validateCity(raw: string): string | null {
  const v = limpiar(raw);
  if (v.length < 2 || v.length > 80) return null;
  // Las ciudades sí llevan números alguna vez, pero nunca son sólo números.
  if (!/[\p{L}]/u.test(v)) return null;
  if (REPETIDO.test(v) || ENLACE.test(v)) return null;
  return v;
}

// ── Email ────────────────────────────────────────────────
//
// Dominios que no pueden recibir correo nunca: los reservados por la norma
// para documentación y pruebas. No es una lista negra de correos temporales
// —esas listas envejecen mal y acaban rechazando clientes—, es la lista de
// lo que técnicamente no existe.
const DOMINIOS_IMPOSIBLES = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test",
  "localhost",
  "invalid",
  "example",
]);

const EMAIL = /^[^\s@,;:<>()[\]\\"]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateEmail(raw: string): string | null {
  const v = limpiar(raw).toLowerCase();
  if (v.length < 6 || v.length > 254) return null;
  if (!EMAIL.test(v)) return null;

  const [local, dominio] = v.split("@");
  if (local.length > 64) return null;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;

  const tld = dominio.slice(dominio.lastIndexOf(".") + 1);
  // Un TLD de una letra o con números no existe.
  if (tld.length < 2 || /\d/.test(tld)) return null;
  if (DOMINIOS_IMPOSIBLES.has(dominio) || DOMINIOS_IMPOSIBLES.has(tld)) return null;

  return v;
}

// ── Teléfono ─────────────────────────────────────────────
//
// A propósito NO se exige prefijo internacional. Este formulario lo rellena
// gente de media docena de países desde el móvil, y quien escribe su número
// de siempre sin el +34 es un cliente, no un bot. Se guarda tal y como lo
// escribió, sólo con la basura de separadores quitada.
const SECUENCIAS = ["0123456789", "1234567890", "9876543210", "0987654321"];

export function validatePhone(raw: string): string | null {
  const v = limpiar(raw).replace(/[()\-.·]/g, "").replace(/\s+/g, " ").trim();
  const digitos = v.replace(/\D/g, "");

  // Menos de siete no es un teléfono en ningún país; más de quince se sale
  // del máximo que fija la norma E.164.
  if (digitos.length < 7 || digitos.length > 15) return null;
  // Letras dentro del número: no.
  if (/[^\d\s+]/.test(v)) return null;
  // "000000000", "111111111": relleno, no un número.
  if (/^(\d)\1+$/.test(digitos)) return null;
  if (SECUENCIAS.some((s) => s.includes(digitos) || digitos.includes(s))) return null;

  return v;
}

// ── El formulario entero ─────────────────────────────────

export type LeadCheck = { ok: true; value: CleanLead } | { ok: false; error: LeadFieldError };

export function validateLead(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  /** El campo trampa: invisible para personas. */
  honeypot?: string;
  /** Milisegundos que ha tardado en enviarlo, si el formulario lo dice. */
  elapsedMs?: number | null;
}): LeadCheck {
  // El bote de miel primero: si ha caído ahí, no hace falta mirar nada más.
  if (input.honeypot?.trim()) return { ok: false, error: "spam" };

  // Y el reloj: un formulario de cinco campos no se rellena en dos segundos.
  // Sólo se mira si el dato viene; una página servida desde caché puede no
  // traerlo, y eso no debe bloquear a nadie.
  if (typeof input.elapsedMs === "number" && input.elapsedMs >= 0 && input.elapsedMs < 2500) {
    return { ok: false, error: "spam" };
  }

  const firstName = validateName(input.firstName);
  const lastName = validateName(input.lastName);
  if (!firstName || !lastName) return { ok: false, error: "bad_name" };

  const email = validateEmail(input.email);
  if (!email) return { ok: false, error: "bad_email" };

  const phone = validatePhone(input.phone);
  if (!phone) return { ok: false, error: "bad_phone" };

  const city = validateCity(input.city);
  if (!city) return { ok: false, error: "bad_city" };

  return { ok: true, value: { firstName, lastName, email, phone, city } };
}
