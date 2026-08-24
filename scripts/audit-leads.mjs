// Pruebas de la validación de los formularios.
//
//   npm run leads:audit
//
// Dos listas: lo que TIENE que entrar y lo que TIENE que rebotar. La primera
// importa más que la segunda: un formulario que rechaza a un cliente real
// cuesta mucho más caro que uno que deja pasar algo de basura.
import { validateLead } from "@/lib/leads/validate.ts";

const base = {
  firstName: "Ana", lastName: "Pérez García", email: "ana@gmail.com",
  phone: "600111222", city: "Barcelona", elapsedMs: 9000,
};

const PASAN = [
  ["nombre normal", {}],
  ["apellido compuesto", { lastName: "de la Fuente Ruiz" }],
  ["apóstrofo", { lastName: "O'Donnell" }],
  ["guion", { lastName: "Sanz-Briz" }],
  ["acentos y ñ", { firstName: "Begoña", lastName: "Muñoz Íñiguez" }],
  ["nombre catalán", { firstName: "Núria", lastName: "Puig i Casals" }],
  ["cirílico", { firstName: "Даша", lastName: "Иванова" }],
  ["chino de un carácter", { firstName: "伟", lastName: "李" }],
  ["japonés", { firstName: "陽菜", lastName: "佐藤" }],
  ["árabe", { firstName: "محمد", lastName: "العلي" }],
  ["teléfono español sin prefijo", { phone: "600111222" }],
  ["con prefijo y espacios", { phone: "+34 600 11 22 33" }],
  ["con 00", { phone: "0034600111222" }],
  ["con guiones y paréntesis", { phone: "(+52) 55-1234-5678" }],
  ["móvil argentino", { phone: "+54 9 11 2345-6789" }],
  ["email con punto y +", { email: "ana.perez+cursos@midominio.co.uk" }],
  ["email con guion", { email: "ana-perez@mi-empresa.es" }],
  ["ciudad con acento", { city: "Alcalá de Henares" }],
  ["ciudad con número", { city: "Barcelona 08010" }],
  ["ciudad extranjera", { city: "São Paulo" }],
  ["sin dato de tiempo (página cacheada)", { elapsedMs: null }],
];

const REBOTAN = [
  ["honeypot relleno", { honeypot: "Acme Corp" }, "spam"],
  ["enviado en 1 segundo", { elapsedMs: 900 }, "spam"],
  ["url en el nombre", { firstName: "Compra en http://spam.ru" }, "bad_name"],
  ["url en la ciudad", { city: "www.casino-online.xyz" }, "bad_city"],
  ["nombre con dígitos", { firstName: "Ana123" }, "bad_name"],
  ["una sola letra latina", { firstName: "A" }, "bad_name"],
  ["nombre repetido", { firstName: "aaaa" }, "bad_name"],
  ["nombre vacío", { lastName: "   " }, "bad_name"],
  ["email sin arroba", { email: "anagmail.com" }, "bad_email"],
  ["email sin dominio", { email: "ana@" }, "bad_email"],
  ["email sin punto", { email: "ana@gmail" }, "bad_email"],
  ["email con dos puntos seguidos", { email: "ana..perez@gmail.com" }, "bad_email"],
  ["email con espacio", { email: "ana perez@gmail.com" }, "bad_email"],
  ["dominio reservado", { email: "ana@example.com" }, "bad_email"],
  ["TLD inventado numérico", { email: "ana@gmail.c0m" }, "bad_email"],
  ["teléfono corto", { phone: "12345" }, "bad_phone"],
  ["teléfono larguísimo", { phone: "1234567890123456789" }, "bad_phone"],
  ["teléfono todo unos", { phone: "111111111" }, "bad_phone"],
  ["teléfono secuencia", { phone: "123456789" }, "bad_phone"],
  ["teléfono con letras", { phone: "600 LLAMAME" }, "bad_phone"],
  ["ciudad sólo números", { city: "08010" }, "bad_city"],
  ["ciudad de una letra", { city: "B" }, "bad_city"],
];

let fallos = 0;
console.log("── Tiene que ENTRAR ──");
for (const [nombre, cambios] of PASAN) {
  const r = validateLead({ ...base, ...cambios });
  const bien = r.ok;
  if (!bien) fallos++;
  console.log(`  ${bien ? "OK   " : "FALLA"} ${nombre}${bien ? "" : ` → rechazado como "${r.error}"`}`);
}

console.log("\n── Tiene que REBOTAR ──");
for (const [nombre, cambios, esperado] of REBOTAN) {
  const r = validateLead({ ...base, ...cambios });
  const bien = !r.ok && r.error === esperado;
  if (!bien) fallos++;
  console.log(`  ${bien ? "OK   " : "FALLA"} ${nombre}${bien ? "" : ` → ${r.ok ? "PASÓ" : `"${r.error}" en vez de "${esperado}"`}`}`);
}

console.log(`\n${fallos === 0 ? "TODO CORRECTO" : `${fallos} CASOS MAL`}`);
process.exit(fallos === 0 ? 0 : 1);
