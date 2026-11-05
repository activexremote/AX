// Las preguntas frecuentes del asistente para el dry run del Módulo 1: el
// dry run, el campus y el contenido del módulo.
//
//   npm run asistente:dry-run              carga (o actualiza) las FAQs
//   npm run asistente:dry-run -- --borrar  las quita
//
// Van sin curso (course = null): las ve cualquiera con campus, también quien
// sólo tiene la plaza del dry run, que no tiene matrícula de ningún curso.
//
// Además apaga (active = false, no borra) los contenidos de EJEMPLO de
// scripts/asistente-seed.mjs: tienen fechas, canales de Slack y normas
// inventadas que el asistente contestaba como si fueran ciertas.
//
// Todo lo que dicen sale del material del Módulo 1 o de cómo funciona el
// campus. Si cambia algo (la fecha, el docente), se corrige aquí o desde
// /admin/asistente.
import { readFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  if (!line.includes("=") || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  process.env[line.slice(0, i).trim()] ??= line.slice(i + 1).trim();
}

const { createAdminClient } = await import("@/lib/supabase/admin.ts");
const { indexSource } = await import("@/lib/asistente/knowledge.ts");

// Ids fijos: volver a lanzar el script actualiza en vez de duplicar.
const id = (n) => `d4a10000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const EJEMPLOS = [1, 2, 3, 4, 5, 6, 100].map((n) => `a5515700-0000-4000-8000-${String(n).padStart(12, "0")}`);

const FAQS = [
  // ── El dry run ──
  [
    "¿Qué es el dry run?",
    "Es un ensayo con público: damos la clase real del **Módulo 1**, con sus ejercicios y su ritmo, a un grupo pequeño antes de abrir el curso. Sirve para probar la dinámica de la clase y el campus con gente de verdad y recoger tu feedback y tus primeras impresiones.\n\nNo es una demo ni una charla comercial: es la clase tal como será en el curso.",
  ],
  [
    "¿Cuándo es el dry run del Módulo 1?",
    "El **sábado 21 de noviembre, de 9:30 a 14:00 (hora de Madrid)**, en directo y online. La clase la da **Isaac**.\n\nLa fecha, la agenda del día y los enlaces están siempre actualizados en tu página de preparación: **/preparacion**.",
  ],
  [
    "¿Cuánto cuesta el dry run?",
    "Nada, es gratis. A cambio te pedimos tres cosas: llegar con el material previo hecho, conectarte con cámara y micrófono y participar, y dejarnos tu feedback sincero al terminar.",
  ],
  [
    "¿A qué tengo acceso en el campus con el dry run?",
    "Al **Módulo 1 completo**: el material previo (lección «Antes de la clase»), las cuatro horas de la clase con sus plantillas y tareas, los audios de cada lección y este asistente. El resto de módulos del programa se abren con la matrícula del curso.",
  ],
  [
    "¿Quién da la clase del dry run?",
    "**Isaac**, docente de ActiveXRemote. Antes de la clase lee las fichas de presentación para llamar a cada persona por su nombre y conectar los ejemplos con su caso.",
  ],
  [
    "¿Cómo me conecto a la clase del dry run?",
    "La clase se organiza en **Google Classroom**. El enlace de la sesión lo tienes en tu página de preparación (**/preparacion**), en Classroom y en los correos de la víspera y de una hora antes.\n\nConéctate diez minutos antes para probar audio y vídeo con calma.",
  ],
  [
    "¿Qué es Google Classroom y cómo me uno a la clase?",
    "Google Classroom es donde se organiza la clase: allí están las plantillas, se entregan las tareas y se publica el enlace de la sesión. Necesitas una cuenta de Google.\n\nEn tu página de preparación (**/preparacion**) tienes el botón para abrir la clase y, si lo hay, el código para unirte. Si no te deja entrar, responde a cualquiera de nuestros correos y te añadimos.",
  ],
  [
    "¿Qué tengo que preparar antes de la clase?",
    "El material previo de la lección **«Antes de la clase»**, entre dos y cuatro horas a tu ritmo. Si solo tienes una hora, haz estas tres piezas:\n\n- La **ficha de presentación** (10 min).\n- El **Test de Punto de Partida** (20 min).\n- El **estudio sobre la penalización del remoto** (20 min): con el apartado Results basta.\n\nEn tu página de preparación (**/preparacion**) tienes la lista completa para ir marcando lo que terminas.",
  ],
  [
    "¿Qué necesito para conectarme a la clase?",
    "Un ordenador con **Chrome o Edge** actualizado, **cámara y micrófono** que funcionen, una conexión estable y un sitio tranquilo. No hay que instalar nada. La cámara importa: en la hora 1 te presentas en 60 segundos y en la hora 3 hablas delante de tu grupo.",
  ],
  [
    "¿Cuál es la agenda del día del dry run?",
    "Cuatro horas de clase, de 9:30 a 14:00, con una pausa: hora 1 (del sitio donde trabajas al resultado que entregas), hora 2 (el Motor de Visibilidad), hora 3 (la actualización de impacto) y hora 4 (Q&A abierto y puente al módulo 02).\n\nLa agenda con horas exactas está en tu página de preparación (**/preparacion**).",
  ],
  [
    "¿Qué pasa si no puedo asistir al dry run?",
    "Avísanos cuanto antes respondiendo a cualquiera de nuestros correos (o a admin@activexremote.com). Así liberamos tu plaza para otra persona.",
  ],
  [
    "¿Cómo dejo mi feedback del dry run?",
    "En tu página de preparación, apartado **Tu feedback** (**/preparacion#feedback**). Se abre cuando empieza la clase y te lo recordamos por correo al terminar.\n\nSon tres minutos: una nota de 0 a 10, cinco valoraciones rápidas (dinámica, ritmo, contenido, docente y campus) y tres preguntas abiertas. Puedes cambiarlo después si quieres.",
  ],
  [
    "¿Qué correos voy a recibir del dry run?",
    "La bienvenida al apuntarte, una vuelta rápida por el campus, el aviso del material previo una semana antes, un checklist dos días antes, el recordatorio de la víspera, un aviso una hora antes de empezar y, al terminar, el de gracias con el enlace al feedback.\n\nSi no quieres recibirlos, cada correo tiene al final un enlace para darte de baja. Conservas la plaza y el acceso al campus.",
  ],
  [
    "¿Se puede apuntar más gente al dry run?",
    "Las plazas son limitadas. Si conoces a alguien a quien le encaje, escríbenos a admin@activexremote.com con su nombre y su correo y le mandamos una invitación.",
  ],

  // ── El campus ──
  [
    "¿Cómo entro al campus?",
    "Con tu **cuenta de Google**, desde activexremote.com → Entrar. Usa la misma cuenta con la que reservaste la plaza: el acceso va asociado a ella.",
  ],
  [
    "¿Cómo marco una lección como completada?",
    "Al final de cada lección tienes el botón **«Marcar como completada»**. Tu progreso se guarda solo y lo ves en **Mi progreso**.",
  ],
  [
    "¿Puedo escuchar las lecciones en audio?",
    "Sí. Cada lección tiene su versión en audio: puedes avanzar escuchando mientras haces otra cosa.",
  ],
  [
    "¿Dónde están las plantillas y los archivos para descargar?",
    "Al final de cada lección, en el apartado **Descargas**: plantillas en Excel y Word, lecturas de apoyo y los enunciados de las tareas. También están en Google Classroom.",
  ],
  [
    "¿Dónde entrego las tareas?",
    "En **Google Classroom**. Cada «Hora» del módulo explica qué se entrega y en qué formato (por ejemplo, la plantilla de diagnóstico en XLSX o el vídeo de 60 segundos).",
  ],
  [
    "¿Cuál es el plazo de las tareas del módulo?",
    "En el curso, las cuatro actividades del módulo vencen el **viernes a las 23:59 CET** y se entregan en Google Classroom. Las tareas 01 a 03 se devuelven con feedback en siete días.\n\nEn el dry run, el docente explica en la hora 4 qué entregar y cuándo.",
  ],
  [
    "¿Cómo funciona este asistente?",
    "Busca tu pregunta en el material que ha preparado el equipo y te devuelve la respuesta tal como está escrita: no se inventa fechas ni datos. Si no encuentra nada, la pregunta le llega al equipo para añadir la respuesta.\n\nPara algo personal (tu plaza, un problema para entrar), responde a cualquiera de nuestros correos.",
  ],
  [
    "¿Puedo ver el campus en inglés?",
    "Sí. Arriba a la derecha tienes el selector de idioma (ES / EN). El material del Módulo 1 y la clase del dry run son en español.",
  ],
  [
    "¿Cómo contacto con el equipo?",
    "Respondiendo a cualquiera de nuestros correos o escribiendo a **admin@activexremote.com**. Lo lee una persona del equipo.",
  ],

  // ── El contenido del Módulo 1 ──
  [
    "¿De qué trata el Módulo 1?",
    "**Mindset remoto y el nuevo mercado global.** Dejas de verte como un empleado atado a un sitio y empiezas a operar como un proveedor de resultados. Sales con tu posición en los cinco ejes de la **Matriz de Competencias Remotas** y con un sistema que hace visible tu trabajo: el **Motor de Visibilidad**.",
  ],
  [
    "¿Qué se hace en cada hora de la clase?",
    "- **Hora 1 · Del sitio donde trabajas al resultado que entregas:** presentaciones de 60 segundos, el sesgo de proximidad y tu posición en la Matriz de Competencias.\n- **Hora 2 · El Motor de Visibilidad:** un sistema que convierte tu trabajo en evidencia y tres métricas de resultado.\n- **Hora 3 · La actualización de impacto:** cuentas tu semana en 60 segundos, en voz alta y sin leer.\n- **Hora 4 · Q&A abierto y puente al módulo 02:** tus casos concretos, los deberes y lo que viene después.",
  ],
  [
    "¿Qué es la Matriz de Competencias Remotas?",
    "El mapa del curso: cinco ejes en los que te puntúas de 1 a 5 en la hora 1, con una línea de justificación por eje. Con eso eliges tu **eje de foco** para el curso. La misma puntuación se repite en el módulo 14: la diferencia entre las dos fotos es la medida más honesta de lo que has cambiado, así que no te infles.",
  ],
  [
    "¿Qué es la frase de valor?",
    "Parte de la Tarea 01. Es una frase **verificable** sobre lo que aportas: un verbo, a quién, qué cambia y el número que lo demuestra.",
  ],
  [
    "¿Qué es el sesgo de proximidad?",
    "La tendencia a valorar más a quien se ve en la oficina. En remoto te ascienden menos porque quien decide no tiene información sobre tu desempeño. La hora 1 explica cómo contrarrestarlo y la hora 2 monta la respuesta: el Motor de Visibilidad.",
  ],
  [
    "¿Qué es el Motor de Visibilidad?",
    "Un sistema personal que convierte tu trabajo en evidencia comprobable. Tiene cinco componentes, **RECAP**: **R**egistro, **E**videncia, **C**onsecuencia, **A**udiencia y **P**ublicación. Lo montas en la herramienta que ya usas (un documento, un canal o un tablero) y envías un recap al canal que quien decide lee de verdad.",
  ],
  [
    "¿Qué diferencia hay entre una métrica de resultado y una de actividad?",
    "Una métrica de **actividad** cuenta lo que haces (horas, reuniones, tareas cerradas). Una de **resultado** mide lo que cambia para alguien gracias a tu trabajo (tiempo ahorrado, errores evitados, ingresos). En la hora 2 escribes tres métricas de resultado, y cada una tiene que pasar los cuatro filtros que se ven en clase.",
  ],
  [
    "¿Qué es la actualización de impacto?",
    "La versión hablada de tu recap: lo que cuentas cuando te preguntan de golpe en qué andas y no hay tiempo de abrir un documento. Tiene cuatro campos y dura **60 segundos**, dicha en voz alta y **sin leer**. En la hora 3 la escribes con tu semana real, la dices delante de tu grupo y puntúas las de tus compañeros.",
  ],
  [
    "¿Qué es el Test de Punto de Partida?",
    "Un cuestionario del campus de **26 preguntas** (unos 20 minutos) que mide tus condiciones de vida para el trabajo remoto y te sitúa en uno de cinco estadios. **No puntúa para nota.** Responde por la vida que tienes, no por la que quieres: quien se infla las respuestas se queda sin diagnóstico.",
  ],
  [
    "¿Qué es el Async Autonomy Baseline?",
    "Un cuestionario de **12 preguntas** (unos 15 minutos) sobre tus hábitos de comunicación y tu autonomía en remoto. Es recomendado, no obligatorio, y no puntúa para nota.",
  ],
  [
    "¿Qué es la ficha de presentación y quién la ve?",
    "Un formulario de 10 minutos: tu nombre y cómo prefieres que te llamen, de dónde eres y dónde estás, a qué te dedicas en una frase, por qué haces el curso, tu objetivo a 12 meses y tu huso horario. El docente la lee antes de la clase y la ve también tu cohorte.\n\n**No incluyas** números de documento, direcciones, teléfonos personales ni datos salariales concretos.",
  ],
  [
    "¿Qué estudio hay que leer sobre la penalización del remoto?",
    "El de **Kasperska, Matysiak y Cukrowska-Torzewska** (PLOS ONE, 2024) sobre la penalización de trabajar en remoto. Es obligatorio: si solo lees una parte, que sea el apartado **Results**. El enlace está en la lección «Antes de la clase», en Fuentes de interés.",
  ],
  [
    "¿Qué material previo es opcional?",
    "Recomendados: el pódcast con **Nick Bloom** sobre mitos y verdades del remoto (30 min), los diez modelos de trabajo remoto del **GitLab Handbook** (15 min), el informe **State of Global Hiring** de Deel (15 min) y el Async Autonomy Baseline. Opcionales: el ensayo de Bloom, Han y Liang en **Nature** (2024) y el micro-juego «La trampa de la proximidad».",
  ],
  [
    "¿Cuáles son las tareas del Módulo 1?",
    "- **01 · Diagnóstico de Preparación Remota:** puntúas los cinco ejes, escribes tu frase de valor y nombras tu eje de foco.\n- **02 · Motor de Visibilidad:** montas el motor, eliges tres métricas de resultado y envías tu primer recap.\n- **03 · Actualización de impacto:** grabas 60 segundos sin leer y anotas tres momentos reales en que la usaste.\n- **04 · Test de conocimientos:** 20 preguntas de opción múltiple.\n\nTodo se entrega en Google Classroom.",
  ],
  [
    "¿Cómo es el test de conocimientos del módulo?",
    "Son **20 preguntas de opción múltiple** sobre el módulo. Se autocorrige con el solucionario, que se publica cuando vence el plazo.",
  ],

  // ── El programa ──
  [
    "¿Qué es ActiveXRemote?",
    "The Remote Business School: un programa de formación para trabajar en remoto con empresas de todo el mundo o montar un negocio sin fronteras. Tiene un **núcleo común** y dos caminos: **Remote Professional** y **Remote Founder**. El Módulo 1 es el primero del núcleo común.",
  ],
  [
    "¿Cómo me apunto al curso completo después del dry run?",
    "Desde **activexremote.com/matricula**. Si tienes dudas sobre el programa, escríbenos a admin@activexremote.com.",
  ],
];

const SOURCES = FAQS.map(([title, body], i) => ({ id: id(i + 1), kind: "faq", title, body, file_name: null, course: null, active: true }));
const admin = createAdminClient();

if (process.argv.includes("--borrar")) {
  const { error, count } = await admin.from("kb_sources").delete({ count: "exact" }).in("id", SOURCES.map((s) => s.id));
  if (error) throw new Error(error.message);
  console.log(`✓ Borradas ${count ?? 0} FAQs del dry run.`);
  process.exit(0);
}

const { error } = await admin.from("kb_sources").upsert(SOURCES);
if (error) throw new Error(error.message);
for (const s of SOURCES) {
  const r = await indexSource(s.id);
  if (!r.ok) throw new Error(`${s.title}: ${r.error}`);
}

const { count: apagados, error: offErr } = await admin
  .from("kb_sources")
  .update({ active: false }, { count: "exact" })
  .in("id", EJEMPLOS)
  .eq("active", true);
if (offErr) throw new Error(offErr.message);

console.log(`✓ ${SOURCES.length} FAQs del dry run cargadas.`);
if (apagados) console.log(`✓ ${apagados} contenidos de ejemplo apagados (no borrados).`);
