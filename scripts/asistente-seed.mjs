// Contenido de EJEMPLO para probar el asistente del campus.
//
//   npm run asistente:seed              carga (o actualiza) los ejemplos
//   npm run asistente:seed -- --borrar  los quita
//
// ⚠︎ Las fechas, horarios y normas de aquí son inventadas. Todo lleva
// «(ejemplo)» para que se note, pero en cuanto el asistente esté en
// producción los alumnos lo verían: hay que borrarlo antes de fusionar la
// rama, o sustituirlo por el contenido real desde /admin/asistente.
//
// Necesita la migración 0014 aplicada. Usa la service role de .env.local.
import { readFileSync } from "node:fs";

// Mismo lector de .env.local que create-admin.mjs. Se vuelca en process.env
// porque el cliente de Supabase del proyecto lo lee de ahí.
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  if (!line.includes("=") || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { createAdminClient } = await import("@/lib/supabase/admin.ts");
const { indexSource } = await import("@/lib/asistente/knowledge.ts");

// Ids fijos: volver a lanzar el script actualiza en vez de duplicar.
const id = (n) => `a5515700-0000-4000-8000-${String(n).padStart(12, "0")}`;

const FAQS = [
  [
    "¿Cómo funcionan las entregas de las misiones?",
    "Cada lección termina con una misión. La entregas desde la propia lección con el enlace a tu trabajo (repositorio, web desplegada o captura) y una explicación breve de lo que has hecho.\n\nEl plazo es el **viernes a las 23:59** de la semana de la lección. _(ejemplo)_",
  ],
  [
    "¿Qué pasa si no llego a un plazo de entrega?",
    "No pierdes la misión: puedes entregarla hasta **7 días después** del plazo. Pasado ese margen, escribe a tu profesor por Slack y lo vemos caso por caso. _(ejemplo)_",
  ],
  [
    "¿Cómo contacto con mi profesor?",
    "Por **Slack**, en el canal `#axr-alumnos`, o por mensaje directo a tu profesor. Respondemos en menos de 24 h laborables. Para temas de pagos o matrícula, escribe a hola@activexremote.com. _(ejemplo)_",
  ],
  [
    "¿Cuándo son las sesiones en directo?",
    "Los **martes a las 18:00 (hora de Madrid)**, por Zoom. El enlace está en el canal `#axr-anuncios` de Slack. Todas quedan grabadas y se suben al campus en 48 h. _(ejemplo)_",
  ],
  [
    "¿Hay certificado al terminar el curso?",
    "Sí. Al completar todas las lecciones y aprobar todas las misiones recibes un certificado digital con código de verificación. _(ejemplo)_",
  ],
  [
    "¿Cómo se corrigen las misiones?",
    "Con una rúbrica sobre 100: funcionalidad 35, comprensión 25, implementación 20, evidencia 10 y autonomía 10. Si falta evidencia para poder juzgarla, la misión pasa a revisión de un profesor. _(ejemplo)_",
  ],
];

const GUIA = `# Calendario

El curso dura **12 semanas**. Cada lunes se abre un módulo nuevo en el campus y tienes hasta el domingo siguiente para completar sus lecciones.

La semana 6 es de descanso: no se abre módulo ni hay sesión en directo.

## Dinámica semanal

Lunes: se publica el módulo. Martes: sesión en directo de dudas. Viernes: fecha de entrega de las misiones de la semana.

Te recomendamos dedicar entre 5 y 7 horas a la semana.

## Pagos y plazos

La matrícula se puede pagar en un pago único o en **tres plazos mensuales**. Si un cobro falla, el acceso al campus se suspende hasta que se regulariza, sin perder el progreso.

## Bajas y reembolsos

Puedes pedir el reembolso completo durante los **14 días** siguientes a la matrícula, siempre que no hayas completado más del 20 % del curso.

## Herramientas

Necesitas un ordenador con navegador actualizado, una cuenta de GitHub y acceso a Slack. Todas las herramientas del curso tienen plan gratuito.`;

const SOURCES = [
  ...FAQS.map(([title, body], i) => ({ id: id(i + 1), kind: "faq", title, body, file_name: null })),
  { id: id(100), kind: "documento", title: "Guía del alumno (ejemplo)", body: GUIA, file_name: "guia-del-alumno-ejemplo.md" },
];

const admin = createAdminClient();

if (process.argv.includes("--borrar")) {
  const { error, count } = await admin
    .from("kb_sources")
    .delete({ count: "exact" })
    .in("id", SOURCES.map((s) => s.id));
  if (error) throw new Error(error.message);
  console.log(`✓ Borrados ${count ?? 0} contenidos de ejemplo.`);
  process.exit(0);
}

const { error } = await admin
  .from("kb_sources")
  .upsert(SOURCES.map((s) => ({ ...s, course: null, active: true })));
if (error) {
  console.error(`✕ ${error.message}`);
  if (error.message.includes("kb_sources")) console.error("  ¿Está aplicada la migración 0014?");
  process.exit(1);
}

for (const s of SOURCES) {
  const r = await indexSource(s.id);
  if (!r.ok) throw new Error(`${s.title}: ${r.error}`);
}

console.log(`✓ ${FAQS.length} FAQs y 1 documento de ejemplo cargados.`);
console.log("  Pruébalo con: «¿cuándo hay que entregar?», «puedo pagar a plazos», «¿dan certificado?», «quiero un reembolso».");
console.log("  Para quitarlos: npm run asistente:seed -- --borrar");
