import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Copy de los cursos relámpago.
//
//  Aquí va sólo el MARCO —qué es un relámpago, cómo funciona, qué botones
//  hay—, y está en los dos idiomas. El contenido de cada curso (temario,
//  misiones, lenguaje del instructor) vive en src/lib/relampago/ y NO se
//  traduce: los cursos se imparten en español.
//
//  Por eso la versión inglesa dice desde el primer momento en qué idioma es
//  el curso, arriba y a la vista. Vender en inglés algo que se imparte en
//  español sin avisar es la clase de sorpresa que acaba en devolución.
//
//  ── Regla de longitud ────────────────────────────────────
//  Estas páginas reciben tráfico de anuncios. Quien llega no ha decidido
//  nada todavía y decide en segundos, así que aquí NO hay párrafos largos:
//  cada bloque es un titular, una línea y un dato. Si algo necesita tres
//  frases para explicarse, o se corta o no va en la landing.
// ══════════════════════════════════════════════════════════

export type FlashCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;

  /** Qué es un relámpago: cuatro rasgos de una línea. */
  traits: { title: string; body: string }[];
  /** El ciclo de cada lección, en seis pasos de tres palabras. */
  loopTitle: string;
  loop: { step: string; title: string; body: string }[];

  vsTitle: string;
  vsLead: string;
  flashLabel: string;
  programLabel: string;
  vs: { flash: string[]; program: string[] };

  featuredLabel: string;
  featuredCta: string;
  /** Los CTA repartidos por la página. */
  cta: {
    heroBuy: string;
    heroSee: string;
    afterLoop: string;
    afterVs: string;
    finalEyebrow: string;
    finalTitle: string;
    finalLead: string;
    finalNote: string;
    orSee: string;
  };
  listTitle: string;
  listLead: string;
  scale: { flash: string; flashValue: string; program: string; programValue: string; note: string };
  soonTitle: string;
  soonBody: string;

  card: {
    lessons: string;
    hours: string;
    missions: string;
    cta: string;
    buy: string;
    sending: string;
    buyError: string;
    gift: string;
    ninja: string;
  };
  languageNote: string | null;
  thanks: { title: string; body: string };

  /** Página de un curso. */
  course: {
    backToIndex: string;
    watch: string;
    demoLabel: string;
    buyNow: string;
    problemLabel: string;
    buildLabel: string;
    stackLabel: string;

    extrasTitle: string;
    extrasLead: string;
    extrasNote: string;

    curriculumTitle: string;
    curriculumLead: string;
    modulesLabel: string;
    lessonsWord: string;
    seeSyllabus: string;
    missionLabel: string;
    criterionLabel: string;
    evidenceLabel: string;
    minutes: string;

    unlockTitle: string;
    unlockLead: string;

    notPromisedTitle: string;

    priceTitle: string;
    priceNote: string;
    includes: string[];
    buyTitle: string;
    buyLead: string;
    cancelled: string;

    faqTitle: string;
    faq: { q: string; a: string }[];
  };
};

const es: FlashCopy = {
  meta: {
    title: "Cursos relámpago · ActiveXRemote",
    description:
      "Formaciones de 4 horas en vídeo, con misiones reales, corrección de tus ejercicios y precio cerrado. Entras, construyes algo y lo terminas.",
  },
  eyebrow: "CURSOS RELÁMPAGO",
  title: "Cuatro horas. Una cosa construida. Precio cerrado.",
  lead: "Entras hoy, construyes algo de verdad y te lo corrigen. Sin convocatoria y sin esperar a nadie.",

  traits: [
    { title: "4 h en microlecciones", body: "Ninguna pasa de doce minutos." },
    { title: "Se construye, no se mira", body: "Cada lección acaba en una misión." },
    { title: "Te lo corrigen", body: "Nota sobre 100 y feedback concreto." },
    { title: "Precio cerrado", body: "Un pago. Acceso para siempre." },
  ],

  loopTitle: "Así funciona cada lección",
  loop: [
    { step: "01", title: "Ves", body: "El problema, el concepto y la demo." },
    { step: "02", title: "Lees", body: "La lectura técnica que da precisión." },
    { step: "03", title: "Contestas", body: "Un control de comprensión." },
    { step: "04", title: "Construyes", body: "La misión, con su criterio." },
    { step: "05", title: "Entregas", body: "Tu evidencia y tu explicación." },
    { step: "06", title: "Te corrigen", body: "Nota y feedback. Si falla, lo rehaces." },
  ],

  vsTitle: "¿Relámpago o programa?",
  vsLead: "No compiten. Resuelven cosas distintas.",
  flashLabel: "Curso relámpago",
  programLabel: "Programa de 14 semanas",
  vs: {
    flash: [
      "Una habilidad concreta, de principio a fin",
      "Empiezas hoy, a tu ritmo",
      "Vídeo grabado + corrección de tus entregas",
      "Precio cerrado, un solo pago",
    ],
    program: [
      "Un cambio de carrera completo",
      "Convocatoria con fecha de inicio",
      "Clases en directo y acompañamiento",
      "Cohorte, comunidad y claustro",
    ],
  },

  featuredLabel: "EMPIEZA POR ESTE",
  featuredCta: "Ver el curso entero",
  cta: {
    heroBuy: "Empezar hoy",
    heroSee: "Ver el curso",
    afterLoop: "Empezar el curso hoy",
    afterVs: "Quiero el relámpago",
    finalEyebrow: "SIN CONVOCATORIA, SIN ESPERA",
    finalTitle: "Cuatro horas y una cosa terminada.",
    finalLead:
      "Pagas, recibes el acceso al campus por correo y empiezas cuando quieras. El acceso no caduca.",
    finalNote: "Pago único de 75 €. Sin suscripción, sin plazos y sin letra pequeña.",
    orSee: "o mira antes el temario completo",
  },
  listTitle: "Todos los cursos",
  listLead: "Salen de uno en uno y no se retiran.",
  scale: {
    flash: "Curso relámpago",
    flashValue: "4 h de vídeo",
    program: "Programa de 14 semanas",
    programValue: "56 h en directo",
    note: "A escala. Un relámpago no es un programa recortado: es otra cosa, con otro objetivo.",
  },
  soonTitle: "Vienen más",
  soonBody:
    "Cada relámpago sale cuando está grabado entero y probado con alumnos reales. Deja tu correo en cualquier formulario y te avisamos del siguiente.",

  card: {
    lessons: "lecciones",
    hours: "de vídeo",
    missions: "misiones",
    cta: "Ver el curso",
    buy: "Comprar",
    sending: "Abriendo el pago…",
    buyError: "No hemos podido abrir el pago. Inténtalo otra vez.",
    gift: "Regalo:",
    ninja: "Truco:",
  },
  languageNote: null,
  thanks: {
    title: "Ya es tuyo.",
    body: "El curso está esperándote en el campus. Empieza cuando quieras.",
  },

  course: {
    backToIndex: "Cursos relámpago",
    watch: "Ver la muestra con sonido",
    demoLabel: "Vídeo de muestra",
    buyNow: "Empezar hoy",
    problemLabel: "SI ESTÁS AQUÍ, ES POR ESTO",
    buildLabel: "LO QUE CONSTRUYES",
    stackLabel: "LO QUE TOCAS",

    extrasTitle: "Y dos cosas más que no verás en el índice",
    extrasLead: "Van dentro del curso y se abren al terminarlo.",
    extrasNote:
      "No entran con la compra: se desbloquean cuando acabas las lecciones y entregas las misiones.",

    curriculumTitle: "Qué hay dentro",
    curriculumLead: "Seis bloques, veinticuatro lecciones, veinticuatro misiones corregidas.",
    modulesLabel: "módulos",
    lessonsWord: "lecciones",
    seeSyllabus: "Ver el temario completo, lección a lección",
    missionLabel: "Misión",
    criterionLabel: "Se aprueba si",
    evidenceLabel: "Evidencia",
    minutes: "min",

    unlockTitle: "Los 5 desbloqueos",
    unlockLead: "Se abren al terminar el curso, no al comprarlo.",

    notPromisedTitle: "Lo que NO te prometemos",

    priceTitle: "Precio cerrado",
    priceNote: "Un pago. Acceso al campus para siempre, con las actualizaciones incluidas.",
    includes: [
      "24 microlecciones en vídeo",
      "24 misiones con corrección y nota",
      "Lectura técnica en cada lección",
      "5 desbloqueos al terminar",
      "Acceso permanente",
    ],
    buyTitle: "Empieza hoy",
    buyLead: "Pagas y en un minuto tienes el campus abierto.",
    cancelled:
      "Has vuelto sin terminar el pago. No se ha cobrado nada y tu sitio sigue aquí.",

    faqTitle: "Preguntas",
    faq: [
      {
        q: "¿Cuándo empieza?",
        a: "Cuando pagues. No hay convocatoria: recibes el acceso al campus por correo y empiezas cuando quieras.",
      },
      {
        q: "¿Cuánto tiempo tengo?",
        a: "El que quieras. El acceso no caduca y las actualizaciones entran sin pagar de nuevo.",
      },
      {
        q: "¿Cuánto se tarda de verdad?",
        a: "Cuatro horas de vídeo más unas seis de misiones. La mayoría lo hace en dos o tres tardes.",
      },
      {
        q: "¿Quién corrige los ejercicios?",
        a: "La corrección sigue la rúbrica del curso —funcionalidad, comprensión, implementación, evidencia y autonomía— y devuelve nota y feedback concreto. Cuando falta evidencia para juzgar algo, pasa a revisión de un profesor en vez de inventarse una nota.",
      },
      {
        q: "¿Necesito saber programar?",
        a: "Este curso asume que ya haces webs con HTML, CSS e IA. Lo que te falta es la infraestructura de debajo. Si no has tocado código nunca, no es tu punto de partida.",
      },
      {
        q: "¿Me da acceso al programa de 14 semanas?",
        a: "No. Un curso relámpago abre su propio curso en el campus y nada más. Son productos distintos.",
      },
      {
        q: "¿Puedo pedir factura?",
        a: "Sí. En la pantalla de pago introduces tu NIF o VAT y se emite automáticamente.",
      },
    ],
  },
};

const en: FlashCopy = {
  meta: {
    title: "Flash courses · ActiveXRemote",
    description:
      "Four-hour video courses with real missions, graded exercises and one closed price. You come in, you build something, you finish it.",
  },
  eyebrow: "FLASH COURSES",
  title: "Four hours. One thing built. One closed price.",
  lead: "You start today, you build something real and it gets graded. No intake, nobody to wait for.",

  traits: [
    { title: "4 h in micro-lessons", body: "None runs past twelve minutes." },
    { title: "You build it", body: "Every lesson ends in a mission." },
    { title: "It gets graded", body: "A score out of 100 and real feedback." },
    { title: "Closed price", body: "One payment. Access forever." },
  ],

  loopTitle: "How every lesson works",
  loop: [
    { step: "01", title: "Watch", body: "The problem, the concept, the demo." },
    { step: "02", title: "Read", body: "The technical reading that adds precision." },
    { step: "03", title: "Answer", body: "A comprehension check." },
    { step: "04", title: "Build", body: "The mission, with its criterion." },
    { step: "05", title: "Submit", body: "Your evidence and your explanation." },
    { step: "06", title: "Get graded", body: "Score and feedback. If it's off, you redo it." },
  ],

  vsTitle: "Flash course or programme?",
  vsLead: "They don't compete. They solve different problems.",
  flashLabel: "Flash course",
  programLabel: "14-week programme",
  vs: {
    flash: [
      "One concrete skill, end to end",
      "Start today, at your own pace",
      "Recorded video + graded submissions",
      "Closed price, single payment",
    ],
    program: [
      "A full career change",
      "An intake with a start date",
      "Live classes and mentoring",
      "Cohort, community and faculty",
    ],
  },

  featuredLabel: "START WITH THIS ONE",
  featuredCta: "See the whole course",
  cta: {
    heroBuy: "Start today",
    heroSee: "See the course",
    afterLoop: "Start the course today",
    afterVs: "I want the flash course",
    finalEyebrow: "NO INTAKE, NO WAITING",
    finalTitle: "Four hours and one finished thing.",
    finalLead:
      "You pay, you get campus access by email and you start whenever you want. Access doesn't expire.",
    finalNote: "One payment of €75. No subscription, no instalments, no small print.",
    orSee: "or look at the full syllabus first",
  },
  listTitle: "All courses",
  listLead: "They ship one at a time and never get pulled.",
  scale: {
    flash: "Flash course",
    flashValue: "4 h of video",
    program: "14-week programme",
    programValue: "56 h live",
    note: "To scale. A flash course isn't a trimmed-down programme: it's a different thing, with a different goal.",
  },
  soonTitle: "More are coming",
  soonBody:
    "Each flash course ships when it is fully recorded and tested with real students. Leave your email in any form and we'll tell you about the next one.",

  card: {
    lessons: "lessons",
    hours: "of video",
    missions: "missions",
    cta: "See the course",
    buy: "Buy",
    sending: "Opening payment…",
    buyError: "We couldn't open the payment. Try again.",
    gift: "Gift:",
    ninja: "Hack:",
  },
  languageNote:
    "Taught in Spanish. Video, readings and grading are all in Spanish; the tools and the technical vocabulary are the standard English ones.",
  thanks: {
    title: "It's yours.",
    body: "The course is waiting for you in the campus. Start whenever you want.",
  },

  course: {
    backToIndex: "Flash courses",
    watch: "Watch the sample with sound",
    demoLabel: "Sample video",
    buyNow: "Start today",
    problemLabel: "IF YOU'RE HERE, THIS IS WHY",
    buildLabel: "WHAT YOU BUILD",
    stackLabel: "WHAT YOU TOUCH",

    extrasTitle: "And two things you won't see in the index",
    extrasLead: "They live inside the course and open when you finish it.",
    extrasNote:
      "They don't come with the purchase: they unlock when you finish the lessons and submit the missions.",

    curriculumTitle: "What's inside",
    curriculumLead: "Six blocks, twenty-four lessons, twenty-four graded missions.",
    modulesLabel: "modules",
    lessonsWord: "lessons",
    seeSyllabus: "See the full syllabus, lesson by lesson",
    missionLabel: "Mission",
    criterionLabel: "You pass if",
    evidenceLabel: "Evidence",
    minutes: "min",

    unlockTitle: "The 5 unlocks",
    unlockLead: "They open when you finish the course, not when you buy it.",

    notPromisedTitle: "What we do NOT promise",

    priceTitle: "One closed price",
    priceNote: "One payment. Campus access forever, updates included.",
    includes: [
      "24 video micro-lessons",
      "24 missions with grading and a score",
      "A technical reading in every lesson",
      "5 unlocks on completion",
      "Permanent access",
    ],
    buyTitle: "Start today",
    buyLead: "You pay and a minute later the campus is open.",
    cancelled: "You came back without finishing the payment. Nothing was charged and your spot is still here.",

    faqTitle: "Questions",
    faq: [
      {
        q: "When does it start?",
        a: "When you pay. There is no intake: you get campus access by email and you begin whenever you want.",
      },
      {
        q: "How long do I have?",
        a: "As long as you want. Access doesn't expire and updates are included.",
      },
      {
        q: "How long does it really take?",
        a: "Four hours of video plus about six of missions. Most people do it across two or three evenings.",
      },
      {
        q: "Who grades the exercises?",
        a: "Grading follows the course rubric — functionality, understanding, implementation, evidence and autonomy — and returns a score plus specific feedback. When there isn't enough evidence to judge something, it goes to a human teacher instead of inventing a mark.",
      },
      {
        q: "Do I need to know how to code?",
        a: "This course assumes you already build web pages with HTML, CSS and AI. What you're missing is the infrastructure underneath. If you have never touched code, this is not your starting point.",
      },
      {
        q: "Does it give me access to the 14-week programme?",
        a: "No. A flash course opens its own course in the campus and nothing else. They are separate products.",
      },
      {
        q: "Can I get an invoice?",
        a: "Yes. You enter your VAT number on the payment screen and it is issued automatically.",
      },
    ],
  },
};

export const flashCopy: Record<Locale, FlashCopy> = { es, en };
