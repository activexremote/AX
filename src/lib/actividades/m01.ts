import type { Actividad, Campo, Criterio, Opcion, Texto } from "@/lib/actividades/tipos";

// ══════════════════════════════════════════════════════════
//  Módulo 01 · Mentalidad remota y el nuevo mercado global
//
//  Las actividades del módulo, sacadas del material previo, las plantillas
//  de cada hora y los enunciados de las tareas 01 a 03. Lo que antes se
//  rellenaba en un XLSX o un DOCX y se entregaba en Classroom, aquí es un
//  formulario.
// ══════════════════════════════════════════════════════════

const MOD = "nucleo-01";

const t = (es: string, en: string): Texto => ({ es, en });
const op = (v: string, es: string, en: string, puntos?: number): Opcion => ({ v, es, en, puntos });
/** Cuatro respuestas de menos a más, que puntúan 0, 1, 2 y 3. */
const escalera = (...r: [string, string][]): Opcion[] => r.map(([es, en], i) => op(String(i), es, en, i));
const seccion = (k: string, es: string, en: string, ayuda?: Texto): Campo => ({ k, tipo: "seccion", label: t(es, en), ayuda });

// ── Rúbricas (las de los enunciados de cada tarea) ─────────────

const rubrica = (completitud: [Texto, Texto, Texto, Texto], rigor: [Texto, Texto, Texto, Texto], aplicacion: [Texto, Texto, Texto, Texto]): Criterio[] => [
  { k: "completitud", titulo: t("Completitud", "Completeness"), niveles: completitud },
  { k: "rigor", titulo: t("Rigor", "Rigour"), niveles: rigor },
  { k: "aplicacion", titulo: t("Aplicación al caso propio", "Applied to your own case"), niveles: aplicacion },
];
const aplicacionComun: [Texto, Texto, Texto, Texto] = [
  t("El ejemplo de clase, apenas cambiado.", "The class example, barely changed."),
  t("Genérico, con algún ajuste.", "Generic, with some tweaks."),
  t("Aplicado a tu caso.", "Applied to your case."),
  t("Tu trabajo real, con detalles concretos que solo puedes saber tú.", "Your real work, with concrete details only you could know."),
];

// ══════════════════════════════════════════════════════════
//  Antes de la clase
// ══════════════════════════════════════════════════════════

const ficha: Actividad = {
  key: "m01-ficha",
  modulo: MOD,
  leccion: 1,
  tipo: "formulario",
  titulo: t("Ficha de presentación", "Introduction card"),
  resumen: t(
    "10 minutos. El docente la lee antes de la clase para llamarte por tu nombre y conectar los ejemplos con tu caso. Escribe corto: lo concreto gana a lo ambicioso.",
    "10 minutes. The teacher reads it before class to call you by your name and connect the examples to your case. Keep it short: concrete beats ambitious.",
  ),
  minutos: 10,
  obligatoria: true,
  plazo: "antes-clase",
  pasoDryRun: "ficha",
  visible: t(
    "La lee el profesorado. No incluyas números de documento, direcciones, teléfonos personales ni datos salariales concretos.",
    "The teaching staff read it. Don't include ID numbers, addresses, personal phone numbers or specific salary figures.",
  ),
  campos: [
    seccion("s1", "Quién eres", "Who you are"),
    { k: "nombre", tipo: "texto", label: t("Nombre y cómo prefieres que te llamen", "Your name and what you like to be called"), max: 120 },
    {
      k: "lugar",
      tipo: "texto",
      label: t("De dónde eres y dónde estás ahora mismo", "Where you're from and where you are right now"),
      ayuda: t("Si el sitio de hoy no es el de siempre, dilo. Casi nadie lo dice y es la mitad de la conversación.", "If today's place isn't your usual one, say so. Almost nobody does, and it's half the conversation."),
      max: 200,
    },
    {
      k: "huso",
      tipo: "texto",
      label: t("Tu huso horario, y con quién necesitas solapar horas", "Your time zone, and who you need to overlap hours with"),
      placeholder: t("Ej.: CET; solapo con un equipo en Nueva York de 15:00 a 18:00", "E.g. CET; I overlap with a team in New York from 15:00 to 18:00"),
      max: 200,
    },
    seccion("s2", "Qué haces", "What you do"),
    {
      k: "dedicas",
      tipo: "parrafo",
      label: t("A qué te dedicas", "What you do for a living"),
      ayuda: t("Una frase que entienda alguien de otro sector. Sin siglas internas de tu empresa.", "One sentence someone from another industry would understand. No internal acronyms."),
      max: 300,
    },
    {
      k: "situacion",
      tipo: "opcion",
      label: t("Tu situación hoy: la que más se acerque", "Your situation today: the closest one"),
      opciones: [
        op("plantilla-presencial", "Empleado en plantilla, presencial o híbrido", "Employee, on-site or hybrid"),
        op("plantilla-remoto", "Empleado en plantilla, ya en remoto", "Employee, already remote"),
        op("contractor", "Contractor o autónomo con cliente principal", "Contractor or self-employed with one main client"),
        op("freelance", "Freelance con varios clientes", "Freelancer with several clients"),
        op("fundador", "Fundador o socio de un negocio propio", "Founder or partner in your own business"),
        op("entre-trabajos", "Entre trabajos, buscando el siguiente", "Between jobs, looking for the next one"),
      ],
    },
    seccion("s3", "Por qué estás aquí", "Why you're here"),
    { k: "porque", tipo: "parrafo", label: t("Por qué haces este curso", "Why you're taking this course"), max: 400 },
    {
      k: "objetivo",
      tipo: "parrafo",
      label: t("Tu objetivo a 12 meses", "Your 12-month goal"),
      ayuda: t(
        "Con una cifra o una fecha dentro, si puedes. «Cobrar en euros desde Colombia antes de junio» funciona mejor que «mejorar profesionalmente».",
        "With a number or a date in it, if you can. “Get paid in euros from Colombia before June” works better than “grow professionally”.",
      ),
      max: 300,
    },
    {
      k: "frenos",
      tipo: "multiple",
      label: t("Qué te frena hoy: marca todas las que apliquen", "What's holding you back today: tick all that apply"),
      opciones: [
        op("empezar", "No sé por dónde empezar a buscar", "I don't know where to start looking"),
        op("valor", "No sé cuánto vale mi perfil fuera de mi país", "I don't know what my profile is worth outside my country"),
        op("papeleo", "El papeleo, los visados o la fiscalidad", "Paperwork, visas or tax"),
        op("idioma", "El idioma", "The language"),
        op("atras", "Dejar a alguien atrás", "Leaving someone behind"),
        op("estabilidad", "Miedo a perder estabilidad", "Fear of losing stability"),
      ],
      otra: true,
    },
    seccion("s4", "Para el primer minuto de clase", "For the first minute of class", t(
      "En la hora 1 tienes 60 segundos para contar: nombre · de dónde eres y dónde estás · a qué te dedicas · por qué el curso · tu objetivo a 12 meses.",
      "In hour 1 you get 60 seconds to say: name · where you're from and where you are · what you do · why the course · your 12-month goal.",
    )),
    {
      k: "pitch",
      tipo: "parrafo",
      label: t("Tu versión corta, para leerla si te bloqueas", "Your short version, to read if you freeze"),
      max: 600,
    },
  ],
};

// ── Test de Punto de Partida ─────────────────────────────────

const p = (k: string, bloque: string, es: string, en: string, ...r: [string, string][]): Campo => ({
  k,
  tipo: "opcion",
  bloque,
  label: t(es, en),
  opciones: escalera(...r),
});

const puntoPartida: Actividad = {
  key: "m01-punto-partida",
  modulo: MOD,
  leccion: 1,
  tipo: "diagnostico",
  titulo: t("Test de Punto de Partida", "Starting Point Test"),
  resumen: t(
    "20 minutos, 26 preguntas sobre las seis cosas que deciden si esta vida te va a funcionar. Te sitúa en uno de cinco estadios y te dice por dónde empezar. No puntúa para nota: responde por la vida que tienes, no por la que quieres.",
    "20 minutes, 26 questions on the six things that decide whether this life will work for you. It places you in one of five stages and tells you where to start. It isn't graded: answer for the life you have, not the one you want.",
  ),
  minutos: 20,
  obligatoria: true,
  plazo: "antes-clase",
  pasoDryRun: "test",
  visible: t("Tu resultado es solo tuyo y del profesorado.", "Your result is only for you and the teaching staff."),
  bloques: [
    { k: "geo", titulo: t("Qué te ata a un sitio", "What ties you to a place") },
    { k: "riesgo", titulo: t("Cuánto riesgo toleras", "How much risk you can take") },
    { k: "ingles", titulo: t("Tu inglés", "Your English") },
    { k: "fuera", titulo: t("Tu experiencia fuera", "Your experience abroad") },
    { k: "oficio", titulo: t("Cuánto encaja tu oficio con el remoto", "How well your work fits remote") },
    { k: "supervision", titulo: t("Cuánta supervisión necesitas", "How much supervision you need") },
  ],
  estadios: [
    {
      desde: 0,
      titulo: t("Explorador", "Explorer"),
      texto: t(
        "Estás mirando el trabajo remoto desde fuera. Hay varias cosas que hoy te atan o te frenan, y está bien: es justo el momento de entenderlas antes de mover nada. Empieza por el bloque más bajo de abajo, no por el que más te apetece. En este curso, lo primero es el módulo 01 (qué vendes) y el 02 (dónde te basas).",
        "You're looking at remote work from the outside. Several things tie you down or hold you back today, and that's fine: this is the right moment to understand them before you move anything. Start with your lowest block below, not the one you like most. In this course, first comes module 01 (what you sell) and 02 (where you're based).",
      ),
    },
    {
      desde: 30,
      titulo: t("Preparando el salto", "Getting ready"),
      texto: t(
        "Tienes parte del camino hecho, pero aún hay frenos claros. Lo que te falta no es motivación, es resolver dos o tres cosas concretas: las dos más bajas de tu desglose. Ataca una cada vez y no te mudes ni dejes tu trabajo antes de tenerlas resueltas.",
        "You've covered part of the way, but there are still clear brakes. What you're missing isn't motivation, it's solving two or three concrete things: the two lowest in your breakdown. Tackle one at a time, and don't move or quit your job before they're solved.",
      ),
    },
    {
      desde: 50,
      titulo: t("En despegue", "Taking off"),
      texto: t(
        "Lo básico está: puedes trabajar en remoto y lo sabes. Te falta convertirlo en un sistema que se vea desde fuera (lo que trabajamos en las horas 2 y 3) y cerrar el bloque que te queda más bajo. Es el estadio en el que más rinde el curso.",
        "The basics are in place: you can work remotely and you know it. What's missing is turning it into a system that can be seen from outside (what hours 2 and 3 are about) and closing your lowest block. It's the stage where the course pays off most.",
      ),
    },
    {
      desde: 68,
      titulo: t("En marcha", "Under way"),
      texto: t(
        "Ya trabajas así o estás muy cerca. Lo que te queda son ajustes: cobrar mejor por lo que ya haces, ordenar la parte legal y fiscal, y protegerte del aislamiento. Mira tu bloque más bajo: suele ser el que se ha quedado atrás por ir rápido.",
        "You already work this way or are very close. What's left are adjustments: getting paid better for what you already do, sorting out the legal and tax side, and protecting yourself from isolation. Look at your lowest block: it's usually the one left behind by moving fast.",
      ),
    },
    {
      desde: 85,
      titulo: t("Operando", "Operating"),
      texto: t(
        "Esta vida ya te funciona. El curso te sirve para profesionalizarla: más visibilidad, mejores contratos y un sistema que aguante años. Tu experiencia vale mucho para la cohorte: compártela en clase.",
        "This life already works for you. The course helps you professionalise it: more visibility, better contracts and a system that lasts for years. Your experience is valuable to the cohort: share it in class.",
      ),
    },
  ],
  campos: [
    seccion("b1", "1 · Qué te ata a un sitio", "1 · What ties you to a place"),
    p("pp01", "geo", "¿Tienes personas a tu cargo que dependan de que estés físicamente cerca (hijos pequeños, mayores, alguien a quien cuidas)?", "Do you have people who depend on you being physically close (young children, elderly relatives, someone you care for)?",
      ["Sí, y no podrían moverse", "Yes, and they couldn't move"], ["Sí, pero podrían venir conmigo o hay apoyo", "Yes, but they could come with me or there's support"], ["Solo de forma puntual", "Only occasionally"], ["No", "No"]),
    p("pp02", "geo", "¿Qué te ata a tu vivienda actual?", "What ties you to your current home?",
      ["Una hipoteca, y no podría alquilarla", "A mortgage, and I couldn't rent it out"], ["Una hipoteca, pero podría alquilarla", "A mortgage, but I could rent it out"], ["Un alquiler con permanencia", "A lease with a minimum term"], ["Un alquiler flexible, o nada", "A flexible lease, or nothing"]),
    p("pp03", "geo", "Si tienes pareja, ¿qué opina de un cambio de vida en remoto?", "If you have a partner, what do they think about a remote life change?",
      ["Está en contra", "They're against it"], ["Tiene dudas", "They have doubts"], ["A favor, pero su trabajo está atado a un sitio", "In favour, but their job is tied to a place"], ["A favor y con margen, o no aplica", "In favour and flexible, or not applicable"]),
    p("pp04", "geo", "¿Tu trabajo actual te obliga a ir a un sitio concreto?", "Does your current job require you to be in a specific place?",
      ["Todos los días", "Every day"], ["Varios días a la semana", "Several days a week"], ["Alguna vez al mes", "A few times a month"], ["Nunca", "Never"]),
    p("pp05", "geo", "¿Hay algo administrativo que te retenga (una oposición, un contrato con permanencia, un trámite pendiente)?", "Is anything administrative holding you (a civil-service exam, a contract with a minimum term, pending paperwork)?",
      ["Sí, durante años", "Yes, for years"], ["Sí, menos de un año", "Yes, for less than a year"], ["Algo menor", "Something minor"], ["Nada", "Nothing"]),

    seccion("b2", "2 · Cuánto riesgo toleras", "2 · How much risk you can take"),
    p("pp06", "riesgo", "¿Cuántos meses de gastos tienes ahorrados?", "How many months of expenses do you have saved?",
      ["Menos de uno", "Less than one"], ["Entre uno y tres", "One to three"], ["Entre tres y seis", "Three to six"], ["Más de seis", "More than six"]),
    p("pp07", "riesgo", "Si tus ingresos bajaran un 30 % durante tres meses, ¿qué pasaría?", "If your income dropped by 30% for three months, what would happen?",
      ["No llegaría a fin de mes", "I couldn't make ends meet"], ["Llegaría con mucho ajuste", "I'd get by with big cuts"], ["Lo notaría, sin problema serio", "I'd notice, without a serious problem"], ["Apenas lo notaría", "I'd barely notice"]),
    p("pp08", "riesgo", "¿Cómo llevas no saber cuánto vas a cobrar el mes que viene?", "How do you cope with not knowing how much you'll earn next month?",
      ["Me quita el sueño", "It keeps me up at night"], ["Lo aguanto poco tiempo", "I can stand it for a short while"], ["Lo llevo si hay un plan", "I'm fine if there's a plan"], ["Me resulta normal", "It feels normal to me"]),
    p("pp09", "riesgo", "¿Has cambiado alguna vez de trabajo o de sector sin tener el siguiente asegurado?", "Have you ever changed job or industry without the next one secured?",
      ["Nunca, y no lo haría", "Never, and I wouldn't"], ["Nunca, pero lo haría", "Never, but I would"], ["Una vez", "Once"], ["Varias veces", "Several times"]),

    seccion("b3", "3 · Tu inglés", "3 · Your English"),
    p("pp10", "ingles", "¿Podrías hacer una entrevista de trabajo entera en inglés?", "Could you do a whole job interview in English?",
      ["No", "No"], ["Con mucha dificultad", "With great difficulty"], ["Sí, con algún bloqueo", "Yes, with the odd block"], ["Sí, con soltura", "Yes, fluently"]),
    p("pp11", "ingles", "¿Escribes en inglés correos o mensajes de trabajo?", "Do you write work emails or messages in English?",
      ["Nunca", "Never"], ["Con traductor y repasando mucho", "With a translator and a lot of checking"], ["A menudo, con algún error", "Often, with some mistakes"], ["A diario, sin pensarlo", "Daily, without thinking"]),
    p("pp12", "ingles", "En una reunión rápida con nativos, ¿cuánto entiendes?", "In a fast meeting with native speakers, how much do you understand?",
      ["Poco", "Little"], ["La idea general", "The general idea"], ["Casi todo", "Almost everything"], ["Todo, matices incluidos", "Everything, nuances included"]),
    p("pp13", "ingles", "¿Has trabajado o estudiado en inglés?", "Have you worked or studied in English?",
      ["No", "No"], ["Algún curso", "A course or two"], ["En proyectos puntuales", "On occasional projects"], ["Durante más de un año", "For more than a year"]),

    seccion("b4", "4 · Tu experiencia fuera", "4 · Your experience abroad"),
    p("pp14", "fuera", "¿Has vivido fuera de tu país más de tres meses seguidos?", "Have you lived outside your country for more than three months in a row?",
      ["No", "No"], ["Una vez, hace tiempo", "Once, a long time ago"], ["Una vez, en los últimos cinco años", "Once, in the last five years"], ["Varias veces", "Several times"]),
    p("pp15", "fuera", "¿Has trabajado con equipos o clientes de otros países?", "Have you worked with teams or clients in other countries?",
      ["Nunca", "Never"], ["Alguna vez", "Occasionally"], ["A menudo", "Often"], ["Es mi día a día", "Every day"]),
    p("pp16", "fuera", "¿Has cobrado alguna vez de una empresa de otro país?", "Have you ever been paid by a company in another country?",
      ["Nunca", "Never"], ["Una vez", "Once"], ["Varias veces", "Several times"], ["Es lo habitual", "It's the norm for me"]),
    p("pp17", "fuera", "¿Has hecho tú algún trámite en otro país (visado, alquiler, cuenta bancaria)?", "Have you handled paperwork in another country yourself (visa, lease, bank account)?",
      ["Nunca", "Never"], ["Con mucha ayuda", "With a lot of help"], ["Alguno, por mi cuenta", "Some, on my own"], ["Varios, sin problema", "Several, without trouble"]),

    seccion("b5", "5 · Cuánto encaja tu oficio con el remoto", "5 · How well your work fits remote"),
    p("pp18", "oficio", "¿Qué parte de tu trabajo se puede hacer con un portátil y conexión?", "How much of your work can be done with a laptop and a connection?",
      ["Casi nada", "Almost none"], ["Menos de la mitad", "Less than half"], ["La mayor parte", "Most of it"], ["Todo", "All of it"]),
    p("pp19", "oficio", "¿Tu resultado se puede medir sin que nadie te vea trabajar?", "Can your output be measured without anyone watching you work?",
      ["No", "No"], ["Con esfuerzo", "With effort"], ["En general, sí", "Generally, yes"], ["Siempre", "Always"]),
    p("pp20", "oficio", "¿Hay empresas que contraten tu perfil en remoto internacional?", "Are there companies hiring your profile for international remote roles?",
      ["No lo sé", "I don't know"], ["Pocas", "A few"], ["Bastantes", "Quite a few"], ["Muchas, lo he comprobado", "Many, I've checked"]),
    p("pp21", "oficio", "¿Has trabajado ya en remoto, aunque sea a tiempo parcial?", "Have you already worked remotely, even part-time?",
      ["Nunca", "Never"], ["De forma puntual", "Occasionally"], ["En híbrido", "Hybrid"], ["Totalmente en remoto", "Fully remote"]),
    p("pp22", "oficio", "¿Sabes cuánto se paga tu perfil fuera de tu país?", "Do you know what your profile is paid outside your country?",
      ["Ni idea", "No idea"], ["Me lo imagino", "I can guess"], ["Tengo alguna referencia", "I have some reference points"], ["Lo tengo comprobado con datos", "I've checked it with data"]),

    seccion("b6", "6 · Cuánta supervisión necesitas", "6 · How much supervision you need"),
    p("pp23", "supervision", "Sin nadie que te pida cuentas, ¿cumples los plazos que te pones tú?", "With nobody holding you to account, do you meet the deadlines you set yourself?",
      ["Casi nunca", "Almost never"], ["A veces", "Sometimes"], ["Casi siempre", "Almost always"], ["Siempre", "Always"]),
    p("pp24", "supervision", "Cuando te bloqueas, ¿qué haces?", "When you get stuck, what do you do?",
      ["Espero a que alguien me ayude", "Wait for someone to help"], ["Pregunto enseguida", "Ask straight away"], ["Lo intento y pregunto con contexto", "Try first, then ask with context"], ["Lo resuelvo, o lo documento antes de preguntar", "Solve it, or document it before asking"]),
    p("pp25", "supervision", "¿Cuánto tiempo puedes trabajar solo y concentrado sin perder el ritmo?", "How long can you work alone and focused without losing pace?",
      ["Menos de una hora", "Less than an hour"], ["Una o dos horas", "One or two hours"], ["De dos a cuatro horas", "Two to four hours"], ["Más de cuatro horas", "More than four hours"]),
    p("pp26", "supervision", "¿Cómo llevas pasar días sin hablar con compañeros?", "How do you handle going days without talking to colleagues?",
      ["Me cuesta mucho", "I find it very hard"], ["Lo llevo unos días", "I can manage a few days"], ["Bien, si hay contacto cada semana", "Fine, if there's weekly contact"], ["Bien: me organizo yo el contacto", "Fine: I organise my own contact"]),
  ],
};

// ── Async Autonomy Baseline ─────────────────────────────────

const frecuencia: [Texto, Texto] = [t("Nunca", "Never"), t("Siempre", "Always")];
const a = (k: string, bloque: string, es: string, en: string): Campo => ({ k, tipo: "escala", bloque, min: 1, max: 5, extremos: frecuencia, label: t(es, en) });

const baseline: Actividad = {
  key: "m01-async-baseline",
  modulo: MOD,
  leccion: 1,
  tipo: "diagnostico",
  titulo: t("Async Autonomy Baseline", "Async Autonomy Baseline"),
  resumen: t(
    "15 minutos, 12 frases sobre tus hábitos de comunicación y sobre cuánto aguantas sin que nadie te supervise. No hay respuestas correctas y no puntúa. El agregado de la cohorte se enseña en clase, y tu resultado es la línea de partida que compararás en el módulo 14.",
    "15 minutes, 12 statements about your communication habits and how well you work without supervision. There are no right answers and it isn't graded. The cohort's aggregate is shown in class, and your result is the baseline you'll compare against in module 14.",
  ),
  minutos: 15,
  obligatoria: false,
  plazo: "antes-clase",
  visible: t("En clase solo se enseña el resultado agregado de la cohorte.", "Only the cohort's aggregate result is shown in class."),
  bloques: [
    { k: "comunicacion", titulo: t("Comunicación asíncrona", "Asynchronous communication") },
    { k: "autonomia", titulo: t("Autonomía", "Autonomy") },
  ],
  estadios: [
    {
      desde: 0,
      titulo: t("Dependes del directo", "You rely on real time"),
      texto: t(
        "Hoy trabajas mejor con alguien al lado o en la misma llamada. En remoto eso se paga caro: los módulos 04 y 13 van justo de esto. Empieza por una sola costumbre: que cada mensaje diga al principio qué necesitas y para cuándo.",
        "Today you work best with someone next to you or on the same call. Remotely that's expensive: modules 04 and 13 are about exactly this. Start with one habit: every message says up front what you need and by when.",
      ),
    },
    {
      desde: 45,
      titulo: t("En construcción", "Under construction"),
      texto: t(
        "Tienes buenas costumbres, pero no siempre. Mira cuál de los dos bloques sale más bajo: casi siempre es ahí donde se te va el tiempo en reuniones de seguimiento o en esperar respuestas.",
        "You have good habits, but not always. Check which of the two blocks is lower: that's almost always where your time goes on follow-up meetings or waiting for replies.",
      ),
    },
    {
      desde: 70,
      titulo: t("Autónomo asíncrono", "Async and autonomous"),
      texto: t(
        "Escribes para que no haga falta preguntarte y te organizas sin que nadie te lo pida. El reto ahora es que se vea: es exactamente lo que se monta en la hora 2.",
        "You write so nobody needs to ask, and you organise yourself without being told. The challenge now is making it visible: that's exactly what hour 2 builds.",
      ),
    },
  ],
  campos: [
    seccion("b1", "Comunicación", "Communication", t("Del 1 (nunca) al 5 (siempre). Piensa en tu última semana normal de trabajo.", "From 1 (never) to 5 (always). Think about your last normal working week.")),
    a("ab01", "comunicacion", "Cuando escribo un mensaje de trabajo, incluyo el contexto suficiente para que no me tengan que preguntar nada.", "When I write a work message, I include enough context that nobody needs to ask me anything."),
    a("ab02", "comunicacion", "Antes de convocar una reunión, pruebo a resolverlo por escrito.", "Before calling a meeting, I try to solve it in writing."),
    a("ab03", "comunicacion", "Cuando termino algo, aviso por escrito de qué está hecho y dónde está.", "When I finish something, I say in writing what's done and where it is."),
    a("ab04", "comunicacion", "Mis mensajes dicen al principio qué necesito y para cuándo.", "My messages say up front what I need and by when."),
    a("ab05", "comunicacion", "Dejo por escrito las decisiones que se toman en una llamada.", "I write down the decisions made on a call."),
    a("ab06", "comunicacion", "Respondo a lo que me preguntan aunque nadie me esté esperando en directo.", "I answer what I'm asked even when nobody is waiting for me in real time."),
    seccion("b2", "Autonomía", "Autonomy"),
    a("ab07", "autonomia", "Organizo mi semana sin que nadie me diga en qué orden hacer las cosas.", "I plan my week without anyone telling me what order to do things in."),
    a("ab08", "autonomia", "Cuando me falta información, la busco antes de preguntar.", "When I'm missing information, I look for it before asking."),
    a("ab09", "autonomia", "Cumplo los plazos aunque nadie me los recuerde.", "I meet deadlines even when nobody reminds me."),
    a("ab10", "autonomia", "Sé parar a una hora razonable sin que el trabajo se me coma el día.", "I can stop at a reasonable time without work eating my whole day."),
    a("ab11", "autonomia", "Si algo se va a retrasar, aviso antes de que venza el plazo.", "If something is going to be late, I say so before the deadline."),
    a("ab12", "autonomia", "Me doy cuenta de cuándo estoy bloqueado y pido ayuda a tiempo.", "I notice when I'm stuck and ask for help in time."),
  ],
};

const expectativas: Actividad = {
  key: "m01-expectativas",
  modulo: MOD,
  leccion: 1,
  tipo: "encuesta",
  titulo: t("Encuesta de expectativas", "Expectations poll"),
  resumen: t(
    "3 minutos, una sola pregunta. Es anónima a propósito: los resultados se revelan en directo en la hora 1 y abren el bloque del sesgo de proximidad.",
    "3 minutes, one question. It's anonymous on purpose: results are revealed live in hour 1 and open the proximity-bias block.",
  ),
  minutos: 3,
  obligatoria: true,
  plazo: "antes-clase",
  anonima: true,
  visible: t("Anónima: el profesorado solo ve el recuento de respuestas, nunca quién ha dicho qué.", "Anonymous: the teaching staff only see the count of answers, never who said what."),
  campos: [
    {
      k: "preocupa",
      tipo: "opcion",
      label: t("¿Qué te preocupa más del trabajo en remoto?", "What worries you most about remote work?"),
      opciones: [
        op("ascenso", "Que te pasen por alto en un ascenso", "Being overlooked for a promotion"),
        op("demostrar", "Trabajar de más para demostrar que estás online", "Overworking to prove you're online"),
        op("aislamiento", "Aislarte del equipo y de la gente", "Becoming isolated from the team and from people"),
      ],
    },
  ],
};

// ── Micro-juego · La trampa de la proximidad ─────────────────

const esc = (k: string, es: string, en: string, mejor: string, ops: [string, string, string, Texto][]): Campo => ({
  k,
  tipo: "opcion",
  label: t(es, en),
  mejor,
  opciones: ops.map(([v, oes, oen, porque]) => ({ v, es: oes, en: oen, porque })),
});

const proximidad: Actividad = {
  key: "m01-proximidad",
  modulo: MOD,
  leccion: 1,
  tipo: "juego",
  titulo: t("La trampa de la proximidad", "The proximity trap"),
  resumen: t(
    "10 minutos, seis escenarios. Tu jefe está en otro huso horario y te escribe algo que suena a microgestión. Elige la respuesta asíncrona que mejor funciona; al enviar verás por qué.",
    "10 minutes, six scenarios. Your manager is in another time zone and writes something that sounds like micromanagement. Pick the async reply that works best; when you submit you'll see why.",
  ),
  minutos: 10,
  obligatoria: false,
  plazo: "antes-clase",
  campos: [
    esc("j1", "Son las 22:00 para ti. Tu jefa, en Nueva York, escribe: «¿Cómo va lo del informe? No veo actualizaciones.»", "It's 22:00 for you. Your manager in New York writes: “How's the report going? I don't see any updates.”", "c", [
      ["a", "«Va bien, mañana te digo.»", "“Going well, I'll let you know tomorrow.”", t("No le das ninguna información: mañana volverá a preguntar, y antes.", "You give her no information: she'll ask again tomorrow, and earlier.")],
      ["b", "«Perdona, estaba con otras cosas. Mañana me pongo.»", "“Sorry, I was on other things. I'll get to it tomorrow.”", t("Suena a disculpa y confirma su sospecha de que no hay avance.", "It sounds like an apology and confirms her suspicion that there's no progress.")],
      ["c", "«Hecho al 70 %: datos cerrados y gráficos listos (enlace). Falta la conclusión, que depende de las cifras de ventas del jueves. Te lo dejo listo el viernes a las 12:00 tuyas.»", "“70% done: data closed and charts ready (link). The conclusion is missing; it depends on Thursday's sales figures. You'll have it Friday at 12:00 your time.”", t("Estado, evidencia, bloqueo y fecha en su huso. No necesita volver a preguntar.", "Status, evidence, blocker and a date in her time zone. She doesn't need to ask again.")],
    ]),
    esc("j2", "Estabas en un bloque de concentración. Te llega: «¿Estás conectado? Te he escrito hace una hora.»", "You were in a focus block. You get: “Are you online? I wrote to you an hour ago.”", "b", [
      ["a", "«Sí, perdona, ya estoy.»", "“Yes, sorry, I'm here now.”", t("Le enseñas que la respuesta rápida es lo que cuenta, no el trabajo.", "You teach him that a fast reply is what counts, not the work.")],
      ["b", "«Estaba en un bloque de concentración hasta las 11 (lo tengo en el calendario). Ya lo he visto y te respondo abajo. Si algo es urgente, escríbeme con URGENTE y lo veo antes.»", "“I was in a focus block until 11 (it's in my calendar). I've seen it now and I'll answer below. If something's urgent, write URGENT and I'll see it sooner.”", t("Explica sin disculparse, responde y le da una vía para lo urgente.", "It explains without apologising, answers, and gives him a route for urgent things.")],
      ["c", "«Estaba trabajando; no puedo estar pendiente del chat todo el rato.»", "“I was working; I can't watch the chat all the time.”", t("Tienes razón en el fondo, pero suena defensivo y no le das nada.", "You're right at heart, but it sounds defensive and gives him nothing.")],
    ]),
    esc("j3", "Tu manager pide: «Mándame cada día a las 18:00 un resumen de lo que has hecho.»", "Your manager asks: “Send me a summary of what you've done every day at 18:00.”", "b", [
      ["a", "«Vale.» Y cada día mandas la lista de tareas.", "“OK.” And every day you send your task list.", t("Una lista diaria de actividad no le dice qué ha cambiado; pronto pedirá más.", "A daily activity list doesn't tell him what changed; soon he'll ask for more.")],
      ["b", "«Te propongo un recap cada viernes con lo entregado, su efecto y lo bloqueado, y un aviso el mismo día si algo se tuerce. ¿Lo probamos dos semanas?»", "“How about a recap every Friday with what was delivered, its effect and what's blocked, plus a same-day heads-up if anything goes wrong? Shall we try it for two weeks?”", t("Cubre lo que de verdad le preocupa (enterarse a tiempo) con menos ruido.", "It covers what really worries him (finding out in time) with less noise.")],
      ["c", "«¿No confías en mí?»", "“Don't you trust me?”", t("Convierte una petición de información en un conflicto personal.", "It turns a request for information into a personal conflict.")],
    ]),
    esc("j4", "«He visto que ayer no estuviste en verde en Slack en toda la tarde.»", "“I noticed you weren't green on Slack all yesterday afternoon.”", "c", [
      ["a", "«Tenía médico.»", "“I had a doctor's appointment.”", t("Justifica la ausencia, pero acepta que estar en verde es la medida.", "It justifies the absence, but accepts that being green is the measure.")],
      ["b", "«Ya, a veces se me olvida ponerme en verde.»", "“Yeah, I sometimes forget to go green.”", t("Te pasarás la semana pendiente del punto verde en vez del trabajo.", "You'll spend the week watching the green dot instead of the work.")],
      ["c", "«Ayer por la tarde cerré la migración de clientes (enlace al ticket). Trabajo en bloques con el chat cerrado; si te ayuda, pongo en el calendario mis horas de respuesta rápida.»", "“Yesterday afternoon I finished the customer migration (ticket link). I work in blocks with chat closed; if it helps, I'll put my quick-reply hours in the calendar.”", t("Cambia la conversación de la presencia al resultado, con evidencia.", "It moves the conversation from presence to results, with evidence.")],
    ]),
    esc("j5", "Un cliente en Singapur: «Necesito una llamada hoy para revisar el estado.» Para ti sería de madrugada.", "A client in Singapore: “I need a call today to review the status.” For you it would be the middle of the night.", "a", [
      ["a", "«Te dejo ahora un vídeo de 4 minutos con el estado y las dos decisiones que necesito de ti (enlace). Si después hace falta llamada, tengo hueco mañana a las 15:00 de Singapur.»", "“Here's a 4-minute video with the status and the two decisions I need from you (link). If we still need a call after that, I'm free tomorrow at 15:00 Singapore time.”", t("Le das hoy lo que necesita y un hueco razonable para los dos.", "You give him what he needs today and a slot that works for both of you.")],
      ["b", "Aceptas la llamada a las 3:00.", "You accept the call at 3:00.", t("Funciona una vez. A la tercera, estás quemado y él lo da por normal.", "It works once. By the third time you're burnt out and he thinks it's normal.")],
      ["c", "«Hoy imposible; lo vemos la semana que viene.»", "“Impossible today; let's look at it next week.”", t("Le dejas sin información una semana entera: la desconfianza crece.", "You leave him without information for a whole week: distrust grows.")],
    ]),
    esc("j6", "«¿Por qué este tema lleva tres días parado?»", "“Why has this been stuck for three days?”", "c", [
      ["a", "«Estoy esperando a Marketing.»", "“I'm waiting on Marketing.”", t("Cierto, pero no dice qué has hecho ni qué vas a hacer.", "True, but it doesn't say what you've done or what you'll do.")],
      ["b", "«No es culpa mía, no me han pasado los datos.»", "“It's not my fault, they haven't sent me the data.”", t("Señala culpables en vez de mover el tema.", "It points fingers instead of moving things forward.")],
      ["c", "«Está parado desde el lunes porque falta el visto bueno de Marketing a los textos. Les escribí el lunes y el miércoles (enlace). Si hoy a las 17:00 no hay respuesta, propongo publicar la versión B, que ya validó Legal. ¿Te parece?»", "“It's been stuck since Monday waiting for Marketing to approve the copy. I wrote to them Monday and Wednesday (link). If there's no answer by 17:00 today, I suggest publishing version B, which Legal already approved. OK?”", t("Contexto, evidencia de lo que has hecho y una salida con fecha.", "Context, evidence of what you did, and a way out with a deadline.")],
    ]),
  ],
};

// ══════════════════════════════════════════════════════════
//  Hora 1 · Tarea 01 · Diagnóstico de Preparación Remota
// ══════════════════════════════════════════════════════════

const comp = (k: string, es: string, en: string, quees: string, queen: string): Campo[] => [
  { k: `c_${k}`, tipo: "escala", min: 1, max: 5, label: t(es, en), ayuda: t(quees, queen) },
  { k: `j_${k}`, tipo: "texto", label: t("Una línea de justificación", "One line of justification"), max: 200 },
];

const COMPETENCIAS: [string, string, string][] = [
  ["async", "Comunicación asíncrona", "Asynchronous communication"],
  ["ownership", "Extreme ownership", "Extreme ownership"],
  ["intercultural", "Competencia intercultural", "Intercultural competence"],
  ["tecnica", "Autosuficiencia técnica", "Technical self-sufficiency"],
  ["resiliencia", "Resiliencia emocional", "Emotional resilience"],
];

const tarea01: Actividad = {
  key: "m01-tarea-01",
  modulo: MOD,
  leccion: 2,
  tipo: "formulario",
  titulo: t("Tarea 01 · Diagnóstico de Preparación Remota", "Assignment 01 · Remote Readiness Diagnostic"),
  resumen: t(
    "Tu fila de la Matriz Proveedor de Valor, tu puntuación en los cinco ejes de la Matriz de Competencias, tu frase de valor verificable y tu eje de foco. Se repite en el módulo 14: no te infles.",
    "Your row of the Value Provider Matrix, your score on the five axes of the Competency Matrix, your verifiable value statement and your focus axis. It's repeated in module 14: don't inflate it.",
  ),
  minutos: 30,
  obligatoria: true,
  plazo: "semana",
  revisa: true,
  visible: t("Solo la veis tú y el docente.", "Only you and the teacher can see it."),
  rubrica: rubrica(
    [
      t("Falta más de una parte.", "More than one part is missing."),
      t("Falta una parte o alguna justificación.", "One part or some justifications are missing."),
      t("Todas las partes entregadas.", "All parts delivered."),
      t("Matriz completa, los cinco ejes con su justificación, frase de valor y eje de foco.", "Full matrix, all five axes justified, value statement and focus axis."),
    ],
    [
      t("Sin verbo ni número: es un puesto y un adjetivo.", "No verb and no number: it's a job title and an adjective."),
      t("Hay un puesto en vez de un verbo, o un adjetivo en vez de un número.", "A job title instead of a verb, or an adjective instead of a number."),
      t("Empieza por un verbo y tiene un número.", "Starts with a verb and has a number."),
      t("Verbo, número comprobable y puntuaciones honestas y justificadas.", "Verb, checkable number and honest, justified scores."),
    ],
    aplicacionComun,
  ),
  campos: [
    seccion("s1", "Tu fila de la Matriz Proveedor de Valor", "Your row of the Value Provider Matrix", t(
      "Un verbo, no un puesto. Un número, no un adjetivo. Ejemplo: «Reconcilio la facturación de tres filiales» · «El equipo financiero, que cierra el mes» · «El cierre mensual deja de retrasarse» · «De 9 días a 4» · «Cada mes».",
      "A verb, not a job title. A number, not an adjective. Example: “I reconcile invoicing for three subsidiaries” · “The finance team, who close the month” · “Month-end close stops slipping” · “From 9 days to 4” · “Every month”.",
    )),
    { k: "verbo", tipo: "texto", label: t("Verbo · qué haces exactamente", "Verb · what exactly you do"), ayuda: t("En primera persona, nunca un puesto ni un departamento.", "In the first person, never a job title or a department."), max: 200 },
    { k: "aquien", tipo: "texto", label: t("A quién · quién recibe el resultado", "For whom · who receives the result"), max: 200 },
    { k: "cambia", tipo: "texto", label: t("Lo que cambia · qué se mueve en el negocio", "What changes · what moves in the business"), max: 200 },
    { k: "numero", tipo: "texto", label: t("Objetivable · el número que lo demuestra", "Measurable · the number that proves it"), ayuda: t("Si no puedes poner un número, el resultado todavía no es verificable.", "If you can't put a number on it, the result isn't verifiable yet."), max: 120 },
    { k: "ritmo", tipo: "texto", label: t("Ritmo · cada cuánto lo produces", "Rhythm · how often you produce it"), max: 120 },
    seccion("s2", "Autodiagnóstico de competencias", "Competency self-assessment", t(
      "1 · No lo he ejercido nunca · 2 · Lo he intentado, sin sistema · 3 · Lo hago cuando me acuerdo · 4 · Lo tengo sistematizado · 5 · Podría enseñárselo a otro.",
      "1 · Never done it · 2 · Tried, without a system · 3 · I do it when I remember · 4 · It's systematised · 5 · I could teach it to someone else.",
    )),
    ...comp("async", "Comunicación asíncrona", "Asynchronous communication", "Escribir para que no haga falta una reunión de seguimiento.", "Writing so that no follow-up meeting is needed."),
    ...comp("ownership", "Extreme ownership", "Extreme ownership", "Cerrar un problema entero sin que nadie te lo recuerde.", "Closing a whole problem without anyone reminding you."),
    ...comp("intercultural", "Competencia intercultural", "Intercultural competence", "Leer lo que un equipo de otro país dice y lo que quiere decir.", "Reading what a team from another country says and what it means."),
    ...comp("tecnica", "Autosuficiencia técnica", "Technical self-sufficiency", "Resolver tus propios bloqueos de herramientas y conexión.", "Solving your own tool and connection problems."),
    ...comp("resiliencia", "Resiliencia emocional", "Emotional resilience", "Sostener el ritmo sin quemarte ni aislarte.", "Keeping the pace without burning out or isolating yourself."),
    seccion("s3", "Tu frase de valor y tu eje de foco", "Your value statement and focus axis"),
    {
      k: "frase",
      tipo: "parrafo",
      label: t("Tu frase de valor verificable", "Your verifiable value statement"),
      ayuda: t("Un verbo, a quién, qué cambia y el número que lo demuestra, en una sola frase.", "A verb, for whom, what changes and the number that proves it, in one sentence."),
      max: 300,
    },
    {
      k: "eje",
      tipo: "opcion",
      label: t("El eje en el que vas a trabajar durante el curso", "The axis you'll work on during the course"),
      opciones: COMPETENCIAS.map(([v, es, en]) => op(v, es, en)),
    },
    { k: "eje_porque", tipo: "texto", label: t("Por qué ese y no otro", "Why that one and not another"), opcional: true, max: 200 },
  ],
};

// ══════════════════════════════════════════════════════════
//  Hora 2 · Tarea 02 · Monta tu Motor de Visibilidad
// ══════════════════════════════════════════════════════════

const FILTROS: [string, string, string][] = [
  ["f1", "¿Se comprueba sin ti?", "Can it be checked without you?"],
  ["f2", "¿Sigue siendo verdad en un año?", "Will it still be true in a year?"],
  ["f3", "¿Le importa a quien decide?", "Does it matter to whoever decides?"],
  ["f4", "¿Mejora con la calidad de tu trabajo?", "Does it improve with the quality of your work?"],
];
const metrica = (n: number): Campo[] => [
  seccion(`sm${n}`, `Métrica ${n}`, `Metric ${n}`),
  { k: `m${n}_que`, tipo: "texto", label: t("Qué mide", "What it measures"), max: 200 },
  { k: `m${n}_numero`, tipo: "texto", label: t("El número: de cuánto a cuánto", "The number: from what to what"), placeholder: t("Ej.: del 12 % al 3 % en un trimestre", "E.g. from 12% to 3% in a quarter"), max: 120 },
  { k: `m${n}_donde`, tipo: "texto", label: t("Dónde se ve cada semana", "Where it shows up every week"), max: 200 },
  ...FILTROS.map(([f, es, en]): Campo => ({ k: `m${n}_${f}`, tipo: "sino", label: t(es, en) })),
];

const tarea02: Actividad = {
  key: "m01-tarea-02",
  modulo: MOD,
  leccion: 3,
  tipo: "formulario",
  titulo: t("Tarea 02 · Monta tu Motor de Visibilidad", "Assignment 02 · Build your Visibility Engine"),
  resumen: t(
    "El motor montado en la herramienta que ya usas, tres métricas de resultado que pasen los cuatro filtros y tu primer recap semanal, enviado de verdad. Una métrica que no sea «sí» en los cuatro filtros es actividad disfrazada de resultado: reescríbela.",
    "The engine set up in the tool you already use, three outcome metrics that pass the four filters, and your first weekly recap, actually sent. A metric that isn't “yes” on all four filters is activity dressed up as a result: rewrite it.",
  ),
  minutos: 45,
  obligatoria: true,
  plazo: "semana",
  revisa: true,
  visible: t("Solo la veis tú y el docente.", "Only you and the teacher can see it."),
  rubrica: rubrica(
    [
      t("Falta más de una parte.", "More than one part is missing."),
      t("Falta una parte, o el recap está solo en borrador.", "One part is missing, or the recap is only a draft."),
      t("Las tres partes entregadas.", "All three parts delivered."),
      t("Motor montado, tres métricas escritas y el primer recap enviado, con su prueba.", "Engine set up, three metrics written and the first recap sent, with proof."),
    ],
    [
      t("Las métricas son recuentos de actividad; el recap es una lista de tareas sin números.", "The metrics are activity counts; the recap is a task list without numbers."),
      t("Alguna métrica es volumen o presencia; el recap mezcla actividad y efecto.", "Some metric is volume or presence; the recap mixes activity and effect."),
      t("Métricas de resultado con números; el recap abre con resultados.", "Outcome metrics with numbers; the recap opens with results."),
      t("Las tres pasan los cuatro filtros; el recap abre con un resultado y cada afirmación lleva número.", "All three pass the four filters; the recap opens with a result and every claim has a number."),
    ],
    [
      t("El ejemplo de clase, apenas cambiado.", "The class example, barely changed."),
      t("Genérico, con algún ajuste.", "Generic, with some tweaks."),
      t("Aplicado a tu caso.", "Applied to your case."),
      t("En la herramienta que usas de verdad, sobre tu trabajo real, y el recap fue al canal que lee quien decide.", "In the tool you really use, on your real work, and the recap went to the channel the decision-maker reads."),
    ],
  ),
  campos: [
    seccion("s1", "Tu Motor de Visibilidad", "Your Visibility Engine", t(
      "Con los cinco campos RECAP: Registro, Evidencia, Consecuencia, Audiencia y Publicación.",
      "With the five RECAP fields: Record, Evidence, Consequence, Audience and Publication.",
    )),
    { k: "herramienta", tipo: "texto", label: t("Dónde lo has montado", "Where you set it up"), placeholder: t("Un documento, un canal, un tablero…", "A document, a channel, a board…"), max: 200 },
    { k: "motor_url", tipo: "url", label: t("Enlace a tu motor", "Link to your engine"), ayuda: t("Con permiso para que lo abra quien tenga el enlace.", "Shared so anyone with the link can open it.") },
    {
      k: "cadencia",
      tipo: "opcion",
      label: t("Cada cuánto vas a mandar tu recap", "How often you'll send your recap"),
      opciones: [
        op("viernes", "Cada viernes", "Every Friday"),
        op("lunes", "Cada lunes", "Every Monday"),
        op("quincenal", "Cada dos semanas", "Every two weeks"),
        op("otra", "Otra cadencia", "Another rhythm"),
      ],
    },
    ...metrica(1),
    ...metrica(2),
    ...metrica(3),
    seccion("s5", "Tu primer recap semanal", "Your first weekly recap", t(
      "Quince minutos el viernes. Si tarda más de dos minutos en leerse, sobra texto.",
      "Fifteen minutes on Friday. If it takes more than two minutes to read, cut text.",
    )),
    { k: "recap_aquien", tipo: "texto", label: t("A quién se lo mandas", "Who you send it to"), max: 160 },
    { k: "recap_canal", tipo: "texto", label: t("Por qué canal", "Through which channel"), max: 160 },
    { k: "recap_entregado", tipo: "parrafo", label: t("Lo entregado", "What was delivered"), ayuda: t("Tres líneas como máximo. Una por entrega, con su número al final.", "Three lines at most. One per delivery, with its number at the end."), max: 600 },
    { k: "recap_efecto", tipo: "parrafo", label: t("El efecto", "The effect"), ayuda: t("Qué cambió en el negocio o en el equipo gracias a eso.", "What changed in the business or the team because of it."), max: 400 },
    { k: "recap_viene", tipo: "texto", label: t("Lo que viene", "What's next"), ayuda: t("Una línea con lo próximo y su fecha.", "One line with what's next and its date."), max: 200 },
    { k: "recap_bloqueado", tipo: "texto", label: t("Lo bloqueado", "What's blocked"), ayuda: t("Qué está parado y qué necesitas exactamente para desbloquearlo.", "What's stuck and exactly what you need to unblock it."), max: 300 },
    { k: "recap_prueba", tipo: "url", label: t("Enlace al recap enviado, o a una captura", "Link to the sent recap, or to a screenshot"), ayuda: t("El mensaje en el canal, el correo o una captura subida a Drive.", "The message in the channel, the email, or a screenshot uploaded to Drive.") },
    { k: "recap_enviado", tipo: "sino", label: t("¿Está enviado, y no en borrador?", "Has it been sent, not left as a draft?") },
  ],
};

// ══════════════════════════════════════════════════════════
//  Hora 3 · Tarea 03 · Graba tu actualización de impacto
// ══════════════════════════════════════════════════════════

const tarea03: Actividad = {
  key: "m01-tarea-03",
  modulo: MOD,
  leccion: 4,
  tipo: "formulario",
  titulo: t("Tarea 03 · Graba tu actualización de impacto y úsala tres veces", "Assignment 03 · Record your impact update and use it three times"),
  resumen: t(
    "Tu actualización con los cuatro campos, un vídeo de 60 segundos dicho sin leer y los tres momentos reales de esta semana en que la usaste. Las dos partes son obligatorias.",
    "Your update with the four fields, a 60-second video said without reading, and the three real moments this week when you used it. Both parts are required.",
  ),
  minutos: 40,
  obligatoria: true,
  plazo: "semana",
  revisa: true,
  visible: t("Solo la veis tú y el docente.", "Only you and the teacher can see it."),
  rubrica: rubrica(
    [
      t("Falta una parte: sin vídeo, o menos de tres momentos.", "A part is missing: no video, or fewer than three moments."),
      t("Una parte floja: vídeo leído, o un momento sin su detalle.", "One weak part: a read video, or a moment without its detail."),
      t("Las dos partes presentes.", "Both parts present."),
      t("Vídeo de menos de 60 s dicho sin leer, y tres momentos con dónde, con quién y qué pasó.", "Video under 60 s said without reading, and three moments with where, with whom and what happened."),
    ],
    [
      t("Actividad sin número, o hay que preguntarte qué hiciste.", "Activity without a number, or one has to ask what you did."),
      t("Abre con contexto o el número es vago; se alarga o va con prisa.", "Opens with context or the number is vague; runs long or rushed."),
      t("Claro, con número, y cabe.", "Clear, with a number, and it fits."),
      t("Abre con el resultado, un número comprobable, lo entiende alguien de fuera y cabe holgado en 60 s.", "Opens with the result, a checkable number, an outsider understands it and it fits easily in 60 s."),
    ],
    [
      t("El ejemplo de clase, apenas cambiado.", "The class example, barely changed."),
      t("Genérico; apenas adaptado del ejemplo.", "Generic; barely adapted from the example."),
      t("Aplicado a tu caso.", "Applied to your case."),
      t("Tu semana real, y los tres momentos son situaciones concretas con nombres.", "Your real week, and the three moments are concrete situations with names."),
    ],
  ),
  campos: [
    seccion("s1", "Tu actualización de impacto", "Your impact update", t(
      "Cuatro campos y 60 segundos. Escribe como hablas, no como redactas un correo. Si no cabe, quita texto: no hables más rápido.",
      "Four fields and 60 seconds. Write the way you speak, not the way you write an email. If it doesn't fit, cut text: don't talk faster.",
    )),
    { k: "u1", tipo: "texto", label: t("01 · Qué entregué esta semana", "01 · What I delivered this week"), placeholder: t("Cerré la automatización del cierre mensual", "I finished automating the month-end close"), max: 200 },
    { k: "u2", tipo: "texto", label: t("02 · Qué cambió por ello, con su número", "02 · What changed because of it, with its number"), placeholder: t("El cierre pasa de 9 días a 4", "The close goes from 9 days to 4"), max: 200 },
    { k: "u3", tipo: "texto", label: t("03 · Qué viene y cuándo", "03 · What's next and when"), placeholder: t("La semana que viene la documento para el equipo", "Next week I'll document it for the team"), max: 200 },
    { k: "u4", tipo: "texto", label: t("04 · Qué necesito y de quién", "04 · What I need and from whom"), placeholder: t("30 minutos de Marta para validar el flujo", "30 minutes from Marta to validate the flow"), max: 200 },
    {
      k: "comprobado",
      tipo: "multiple",
      label: t("Antes de darla por buena: marca lo que cumple", "Before calling it done: tick what it meets"),
      opcional: true,
      opciones: [
        op("resultado", "Empieza por el resultado, no por el día de la semana", "It starts with the result, not the day of the week"),
        op("numero", "Tiene un número que alguien puede comprobar", "It has a number someone can check"),
        op("siglas", "Se entiende sin conocer tu equipo ni tus siglas", "It makes sense without knowing your team or acronyms"),
        op("necesito", "Dice qué necesitas, de quién y para cuándo", "It says what you need, from whom and by when"),
        op("60s", "Se dice en 60 segundos sin acelerar", "It can be said in 60 seconds without rushing"),
        op("voz", "La has dicho en voz alta al menos una vez", "You've said it out loud at least once"),
      ],
    },
    seccion("s2", "Tu vídeo de 60 segundos", "Your 60-second video", t(
      "Dicho en voz alta, con el documento cerrado. Sin leer y sin cortes: vale la primera toma decente.",
      "Said out loud, with the document closed. No reading and no cuts: the first decent take counts.",
    )),
    {
      k: "video_url",
      tipo: "url",
      label: t("Enlace al vídeo", "Link to the video"),
      ayuda: t("Loom, Google Drive o YouTube en oculto, con permiso para que lo vea quien tenga el enlace.", "Loom, Google Drive or unlisted YouTube, shared so anyone with the link can watch it."),
    },
    seccion("s3", "Los tres momentos en que la usaste", "The three moments you used it", t(
      "En momentos reales de esta semana: un stand-up, un mensaje, un uno a uno. Una línea por momento: dónde, con quién y qué pasó.",
      "In real moments this week: a stand-up, a message, a one-to-one. One line per moment: where, with whom and what happened.",
    )),
    { k: "mom1", tipo: "texto", label: t("Momento 1", "Moment 1"), max: 240 },
    { k: "mom2", tipo: "texto", label: t("Momento 2", "Moment 2"), max: 240 },
    { k: "mom3", tipo: "texto", label: t("Momento 3", "Moment 3"), max: 240 },
  ],
};

// ══════════════════════════════════════════════════════════
//  Hora 4 · Test de conocimientos del módulo 01
// ══════════════════════════════════════════════════════════

const q = (k: string, es: string, en: string, correcta: string, ops: [string, string, string][], expEs: string, expEn: string): Campo => ({
  k,
  tipo: "opcion",
  label: t(es, en),
  correcta,
  explicacion: t(expEs, expEn),
  opciones: ops.map(([v, oes, oen]) => op(v, oes, oen)),
});

const testM1: Actividad = {
  key: "m01-test",
  modulo: MOD,
  leccion: 5,
  tipo: "test",
  titulo: t("Test de conocimientos del módulo 01", "Module 01 knowledge test"),
  resumen: t(
    "20 preguntas de opción múltiple sobre todo el módulo. Se corrige solo al enviarlo: verás cuáles has acertado y por qué. Se aprueba con 14 de 20 y puedes repetirlo.",
    "20 multiple-choice questions on the whole module. It's marked automatically when you submit: you'll see which ones you got right and why. The pass mark is 14 out of 20 and you can retake it.",
  ),
  minutos: 20,
  obligatoria: true,
  plazo: "semana",
  aprobado: 70,
  campos: [
    q("t01", "Según el estudio de PLOS ONE con 937 directivos, ¿cuánto menos probable es que asciendan a quien trabaja íntegramente desde casa?", "According to the PLOS ONE study of 937 managers, how much less likely is someone working fully from home to be promoted?", "b",
      [["a", "Un 3,2 % menos", "3.2% less"], ["b", "Un 10,7 % menos", "10.7% less"], ["c", "Un 25 % menos", "25% less"], ["d", "No hay diferencia", "There's no difference"]],
      "10,7 % menos para un ascenso, 9,4 % para una subida y 6,6 % para formación.", "10.7% less for a promotion, 9.4% for a raise and 6.6% for training."),
    q("t02", "¿Por qué pasa, según el propio estudio?", "Why does it happen, according to the study itself?", "b",
      [["a", "Porque en remoto se rinde menos", "Because people perform worse remotely"], ["b", "Porque quien decide no tiene información de tu desempeño y la supone", "Because the decision-maker has no information on your performance and assumes it"], ["c", "Porque se trabajan menos horas", "Because people work fewer hours"], ["d", "Porque las empresas lo hacen a propósito", "Because companies do it on purpose"]],
      "No es mala fe: es un problema de información. Cuando hay datos de desempeño, el sesgo se diluye.", "It isn't bad faith: it's an information problem. When performance data exists, the bias fades."),
    q("t03", "¿Cuándo desaparece la penalización?", "When does the penalty disappear?", "a",
      [["a", "Cuando más del 80 % del equipo trabaja en remoto", "When more than 80% of the team works remotely"], ["b", "Cuando vas un día a la semana a la oficina", "When you go to the office one day a week"], ["c", "Después de dos años en la empresa", "After two years at the company"], ["d", "Nunca", "Never"]],
      "Es una regla sobre el entorno, no sobre ti.", "It's a rule about the environment, not about you."),
    q("t04", "El ensayo de Nature con 1.612 empleados encontró que el trabajo híbrido…", "The Nature trial with 1,612 employees found that hybrid work…", "b",
      [["a", "Bajó el rendimiento", "Lowered performance"], ["b", "Redujo las bajas voluntarias en un tercio sin afectar a las evaluaciones", "Cut voluntary quits by a third without affecting performance reviews"], ["c", "Subió los sueldos un 10 %", "Raised salaries by 10%"], ["d", "Aumentó las bajas", "Increased quits"]],
      "Los empleados valoraban los días en casa como una subida del 10 %, pero el sueldo no cambió.", "Employees valued home days like a 10% raise, but pay didn't change."),
    q("t05", "¿Cuál es la tesis del módulo, en una frase?", "What is the module's thesis, in one sentence?", "c",
      [["a", "En remoto se rinde menos", "People perform worse remotely"], ["b", "La oficina es más justa", "The office is fairer"], ["c", "Rindes lo mismo y te promocionan menos", "You perform the same and get promoted less"], ["d", "El remoto no funciona", "Remote doesn't work"]],
      "La primera parte la prueba Nature; la segunda, PLOS ONE. El módulo resuelve la segunda.", "Nature proves the first half; PLOS ONE the second. The module solves the second."),
    q("t06", "¿Cuál es la contramedida que propone el módulo frente al sesgo de proximidad?", "What countermeasure does the module propose against proximity bias?", "b",
      [["a", "Estar conectado más horas", "Being online more hours"], ["b", "Documentar y hacer visible el resultado", "Documenting and making the result visible"], ["c", "Ir más a la oficina", "Going to the office more"], ["d", "Cambiar de empresa", "Changing companies"]],
      "Si el problema es de información, se resuelve con información, no con más esfuerzo.", "If the problem is information, it's solved with information, not more effort."),
    q("t07", "En la Matriz Proveedor de Valor, la primera columna es…", "In the Value Provider Matrix, the first column is…", "c",
      [["a", "Tu puesto", "Your job title"], ["b", "Tu departamento", "Your department"], ["c", "Un verbo en primera persona", "A first-person verb"], ["d", "Un adjetivo que te describa", "An adjective describing you"]],
      "Un verbo, no un puesto: describe lo que produces, no dónde te sientas.", "A verb, not a title: it describes what you produce, not where you sit."),
    q("t08", "Si no puedes poner un número en la columna «Objetivable»…", "If you can't put a number in the “Measurable” column…", "a",
      [["a", "El resultado todavía no es verificable", "The result isn't verifiable yet"], ["b", "Se deja vacía", "You leave it empty"], ["c", "Se pone un adjetivo", "You put an adjective"], ["d", "No pasa nada", "It doesn't matter"]],
      "Sin número, quien decide sigue teniendo que suponer.", "Without a number, the decision-maker still has to guess."),
    q("t09", "¿Cuál de estas NO es una de las cinco competencias de la Matriz de Competencias Remotas?", "Which of these is NOT one of the five competencies in the Remote Competency Matrix?", "c",
      [["a", "Comunicación asíncrona", "Asynchronous communication"], ["b", "Extreme ownership", "Extreme ownership"], ["c", "Liderazgo de equipos presenciales", "Leading on-site teams"], ["d", "Resiliencia emocional", "Emotional resilience"]],
      "Las cinco: comunicación asíncrona, extreme ownership, competencia intercultural, autosuficiencia técnica y resiliencia emocional.", "The five: async communication, extreme ownership, intercultural competence, technical self-sufficiency and emotional resilience."),
    q("t10", "¿Qué significan las letras de RECAP?", "What do the letters in RECAP stand for?", "a",
      [["a", "Registro, Evidencia, Consecuencia, Audiencia, Publicación", "Record, Evidence, Consequence, Audience, Publication"], ["b", "Resumen, Esfuerzo, Calendario, Agenda, Plan", "Summary, Effort, Calendar, Agenda, Plan"], ["c", "Reunión, Email, Chat, Acta, Presentación", "Meeting, Email, Chat, Minutes, Presentation"], ["d", "Resultado, Equipo, Cliente, Acción, Proceso", "Result, Team, Client, Action, Process"]],
      "Son los cinco componentes del Motor de Visibilidad.", "They are the five components of the Visibility Engine."),
    q("t11", "¿Cuál de estos NO es uno de los cuatro filtros de una métrica de resultado?", "Which of these is NOT one of the four filters for an outcome metric?", "d",
      [["a", "Se comprueba sin ti", "It can be checked without you"], ["b", "Sigue siendo verdad en un año", "It's still true in a year"], ["c", "Le importa a quien decide", "It matters to whoever decides"], ["d", "Demuestra cuántas horas has trabajado", "It shows how many hours you worked"]],
      "El cuarto es «mejora con la calidad». Las horas son actividad, no resultado.", "The fourth is “improves with quality”. Hours are activity, not results."),
    q("t12", "¿Cuál de estas es una métrica de resultado, y no de actividad?", "Which of these is an outcome metric, not an activity metric?", "c",
      [["a", "Reuniones a las que asistí", "Meetings I attended"], ["b", "Correos enviados", "Emails sent"], ["c", "Incidencias reabiertas tras mi entrega, del 12 % al 3 %", "Tickets reopened after my delivery, from 12% to 3%"], ["d", "Horas conectado", "Hours online"]],
      "Se comprueba sin ti, sigue valiendo en un año, importa a quien decide y mejora con la calidad.", "It can be checked without you, still holds in a year, matters to the decision-maker and improves with quality."),
    q("t13", "Un recap semanal…", "A weekly recap…", "a",
      [["a", "Tiene que estar enviado al canal que lee quien decide", "Must be sent to the channel the decision-maker reads"], ["b", "Vale si está guardado en una carpeta privada", "Counts if it's saved in a private folder"], ["c", "Se manda solo si te lo piden", "Is only sent if someone asks"], ["d", "Es una lista de tus tareas", "Is a list of your tasks"]],
      "Un documento que nadie ha abierto no es un sistema de visibilidad.", "A document nobody has opened isn't a visibility system."),
    q("t14", "¿Cuánto debería tardar en leerse un recap?", "How long should a recap take to read?", "a",
      [["a", "Menos de dos minutos", "Under two minutes"], ["b", "Unos diez minutos", "About ten minutes"], ["c", "Lo que haga falta", "As long as needed"], ["d", "Media hora", "Half an hour"]],
      "Si tarda más de dos minutos, sobra texto.", "If it takes more than two minutes, there's too much text."),
    q("t15", "¿Cuáles son los cuatro campos de la actualización de impacto, en orden?", "What are the four fields of the impact update, in order?", "a",
      [["a", "Qué entregué · qué cambió, con su número · qué viene y cuándo · qué necesito y de quién", "What I delivered · what changed, with its number · what's next and when · what I need and from whom"], ["b", "Saludo · contexto · problema · despedida", "Greeting · context · problem · sign-off"], ["c", "Lo que hice cada día de la semana", "What I did each day of the week"], ["d", "Tareas · horas · dudas · quejas", "Tasks · hours · questions · complaints"]],
      "Es la versión hablada del recap.", "It's the spoken version of the recap."),
    q("t16", "¿Por dónde empieza una buena actualización de impacto?", "How does a good impact update start?", "b",
      [["a", "Por el día de la semana", "With the day of the week"], ["b", "Por el resultado", "With the result"], ["c", "Por el contexto del proyecto", "With the project context"], ["d", "Por una disculpa", "With an apology"]],
      "Quien escucha decide en los primeros segundos si le importa.", "Listeners decide in the first seconds whether it matters to them."),
    q("t17", "¿Cuánto debe durar la actualización de impacto?", "How long should the impact update last?", "a",
      [["a", "60 segundos", "60 seconds"], ["b", "5 minutos", "5 minutes"], ["c", "15 minutos", "15 minutes"], ["d", "Lo que dure la reunión", "As long as the meeting"]],
      "Es lo que tienes cuando te preguntan de golpe en qué andas.", "It's what you have when someone suddenly asks what you're working on."),
    q("t18", "Si tu actualización no cabe en el tiempo…", "If your update doesn't fit in the time…", "b",
      [["a", "Hablas más rápido", "You talk faster"], ["b", "Quitas texto", "You cut text"], ["c", "Pides más tiempo", "You ask for more time"], ["d", "La lees", "You read it"]],
      "Si no cabe, sobra texto: no hables más rápido.", "If it doesn't fit, there's too much text: don't talk faster."),
    q("t19", "Según Buffer y Gallup, ¿cuál es el mayor riesgo para quien lleva tiempo en remoto?", "According to Buffer and Gallup, what's the biggest risk for people who've been remote for a while?", "b",
      [["a", "Distraerse", "Getting distracted"], ["b", "El aislamiento y la soledad", "Isolation and loneliness"], ["c", "La conexión a internet", "The internet connection"], ["d", "El jet lag", "Jet lag"]],
      "El 25 % de los trabajadores remotos declara soledad diaria, frente al 16 % de los presenciales.", "25% of remote workers report daily loneliness, versus 16% of on-site workers."),
    q("t20", "Un visado de nómada digital…", "A digital nomad visa…", "b",
      [["a", "Te exime de pagar impuestos en ese país", "Exempts you from tax in that country"], ["b", "Es un permiso de residencia: no decide dónde tributas", "Is a residence permit: it doesn't decide where you pay tax"], ["c", "Solo vale un mes", "Is only valid for a month"], ["d", "Es lo mismo que la residencia fiscal", "Is the same as tax residency"]],
      "Inmigración y fiscalidad son dos sistemas independientes. Se trabaja en el módulo 02.", "Immigration and tax are two separate systems. Module 02 covers it."),
  ],
};

export const ACTIVIDADES_M01: Actividad[] = [ficha, puntoPartida, expectativas, baseline, proximidad, tarea01, tarea02, tarea03, testM1];
