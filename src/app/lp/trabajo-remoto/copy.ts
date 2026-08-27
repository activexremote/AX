import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Landing de campaña — /lp/trabajo-remoto
//
//  Copy PROPIA y autocontenida. No importa nada de bienvenida/copy.ts a
//  propósito: esta página existe para tráfico de pago y su texto se reescribe
//  al ritmo de las campañas, no al de la web. Compartir el objeto acabaría
//  con alguien cambiando un titular aquí y rompiéndolo en la portada.
//
//  ── Regla de contenido ───────────────────────────────────
//  Aquí sólo entra lo que ya sostiene la web pública: 14 módulos, 56 h,
//  14 semanas, grupos de 25, 2.400 €, 1 de diciembre de 2026. Nada de cifras
//  nuevas. En particular NO hay rangos salariales ni número de alumnos: la
//  referencia los lleva, nosotros no tenemos dato verificable y publicarlo
//  inventado es publicidad engañosa (ver src/app/bienvenida/flags.ts).
//
//  ── Reparto: cada cosa se dice UNA vez ───────────────────
//  Una landing que repite parece más larga de lo que es y hace dudar de si te
//  has perdido algo. Cada dato tiene un dueño y sólo uno:
//
//    hero .......... qué es, para quién, cuándo empieza y cuánto cuesta
//    stats ......... el tamaño del programa (módulos, horas, semanas, plazas)
//    statement ..... la tesis de la escuela
//    live .......... CÓMO se da la clase (en directo, irrepetible, online)
//    pillars ....... POR QUÉ funciona — cuatro cosas que no dice nadie más
//    outcomes ...... la ESTRUCTURA y a dónde lleva cada camino
//    timeline ...... QUÉ TE PASA a ti desde que dejas los datos
//    program ....... el temario, las objeciones y las herramientas
//    final ......... la acción, con quién imparte y dónde acaba la gente
//
//  Si al añadir una frase tienes que mirar si ya está en otro sitio, va en el
//  sitio que la tiene y no en los dos.
// ══════════════════════════════════════════════════════════

export type AdCopy = (typeof adCopy)["es"];

export const adCopy = {
  es: {
    meta: {
      title: "Formación online en directo para trabajar sin fronteras · 14 semanas",
      description:
        "Programa 100 % online y en directo, en español: consigue un empleo remoto internacional o monta tu negocio global. 14 módulos, 56 h, grupos de 25 plazas.",
    },
    nav: {
      cta: "Solicita información",
      ctaShort: "Solicita info",
    },

    // ── HÉROE ────────────────────────────────────────────
    // Lo primero que se lee tiene que contestar tres preguntas: qué es
    // (formación online en directo), qué consigues (empleo o negocio) y qué
    // pasa si dejo los datos. Todo lo demás puede esperar al scroll.
    hero: {
      badge: "Convocatoria del 1 de diciembre · 25 plazas",
      titleTop: "Empleo remoto internacional",
      titleBottom: "o tu propio negocio global",
      lead: "Formación online y en directo. Una clase de cuatro horas por semana durante catorce semanas, y algo terminado al final de cada una.",
      formTitle: "Recibe el programa completo",
      formLead: "Temario, fechas, horarios y condiciones. Sin compromiso.",
      // Cuatro datos, no seis: aquí van los de decisión —qué formato, cuándo
      // empieza, a qué ritmo y cuánto cuesta—. El tamaño del programa lo
      // cuenta la banda de cifras de justo debajo.
      facts: [
        { k: "Formato", v: "100 % online, en directo" },
        { k: "Empieza", v: "1 de diciembre de 2026" },
        { k: "Ritmo", v: "1 clase de 4 h por semana" },
        { k: "Precio", v: "2.400 € · o 3 plazos de 800 €" },
      ],
      partnersLabel: "Partners con beneficios para alumnos",
      partnersNote: "Acuerdos con las plataformas que sostienen el trabajo remoto internacional.",
      clocksLabel: "Ahora mismo",
      clocks: [
        { city: "Barcelona", tz: "Europe/Madrid" },
        { city: "Lisboa", tz: "Europe/Lisbon" },
        { city: "Bogotá", tz: "America/Bogota" },
        { city: "CDMX", tz: "America/Mexico_City" },
      ],
      stats: [
        { value: 14, suffix: "", label: "módulos" },
        { value: 56, suffix: " h", label: "de clase" },
        { value: 14, suffix: "", label: "semanas" },
        { value: 25, suffix: "", label: "plazas por grupo" },
      ],
    },

    statement: {
      top: "El trabajo en remoto se aprende",
      bottom: "trabajando en remoto.",
    },

    // ── CÓMO ES LA CLASE ─────────────────────────────────
    // Esta sección es la dueña de "en directo" y de "desde donde quieras".
    // Nadie más lo explica, sólo lo da por sabido.
    live: {
      badge: "En directo",
      title: "Es online, pero no es un vídeo.",
      body: "Cada módulo es una clase de cuatro horas con el equipo delante: se explica, se abre la herramienta en pantalla y se trabaja sobre tu caso. Las preguntas son las de tu grupo, así que ninguna clase se repite igual.",
      points: [
        { k: "En vivo, no grabado", v: "El equipo está ahí y responde en el momento." },
        { k: "Desde donde estés", v: "Solo hace falta conexión: da igual el país o el huso." },
        { k: "Y queda grabada", v: "En el campus, sin caducidad, por si te pierdes una." },
      ],
      videoLabel: "Fragmento de una clase en directo del programa",
    },

    // ── POR QUÉ FUNCIONA ─────────────────────────────────
    // Cuatro razones que no repiten a nadie: los entregables, el tamaño del
    // grupo, la IA y el stack. El formato lo cuenta la clase de arriba y la
    // estructura, el diagrama de abajo.
    pillars: [
      {
        icon: "deliver" as const,
        title: "Sales con cosas hechas",
        body: "Un entregable por módulo, corregido con tu nombre. No apuntes.",
      },
      {
        icon: "group" as const,
        title: "Grupo de 25, no un curso masivo",
        body: "Se te conoce, se te pregunta y se te sigue durante las 14 semanas.",
      },
      {
        icon: "ai" as const,
        title: "IA dentro de cada módulo",
        body: "Prompts, agentes y automatizaciones sobre tu propio trabajo.",
      },
      {
        icon: "stack" as const,
        title: "Las herramientas de verdad",
        body: "Las mismas que usan los equipos remotos, abiertas en pantalla.",
      },
    ],

    // ── LA ESTRUCTURA ────────────────────────────────────
    // Dueña de "dos caminos" y de las cuatro salidas. El cronograma de abajo
    // no vuelve a contar los módulos: cuenta lo que te pasa a ti.
    outcomes: {
      title: "Una base común y, después, tu camino",
      coreTag: "Semanas 1 – 7",
      coreName: "7 módulos de núcleo",
      coreNote: "Los mismos para todos",
      takeLabel: "Sales con",
      paths: [
        {
          tag: "Semanas 8 – 14",
          name: "Remote Professional",
          items: [
            {
              role: "Para conseguir empleo fuera",
              take: "CV, LinkedIn y portfolio listos para recruiters internacionales",
            },
            {
              role: "Para facturar como contractor",
              take: "Contrato, facturación internacional y fiscalidad resueltas",
            },
          ],
        },
        {
          tag: "Semanas 8 – 14",
          name: "Remote Founder",
          items: [
            {
              role: "Para montar tu negocio",
              take: "Una oferta validada y un sistema de captación B2B en marcha",
            },
            {
              role: "Para dejar de vender horas",
              take: "Servicio empaquetado, procesos escritos y tareas automatizadas",
            },
          ],
        },
      ],
    },

    // ── QUÉ TE PASA A TI ─────────────────────────────────
    // Empieza en el formulario a propósito: la duda de quien está leyendo un
    // anuncio no es «cuántos módulos hay», es «qué pasa si dejo mis datos».
    timeline: {
      title: "Qué pasa desde que dejas tus datos",
      items: [
        {
          n: "00",
          when: "Hoy",
          title: "Nos escribes",
          desc: "Te llamamos en menos de 24 h laborables y resolvemos dudas.",
        },
        {
          n: "01",
          when: "Antes de empezar",
          title: "Reservas plaza",
          desc: "Pago único o tres plazos. Entras al campus y al Slack del grupo.",
        },
        {
          n: "02",
          when: "Semanas 1 – 7",
          title: "Montas la base",
          desc: "Fiscalidad, herramientas, IA, legal y hábitos de trabajo remoto.",
        },
        {
          n: "03",
          when: "Semanas 8 – 14",
          title: "Construyes lo tuyo",
          desc: "Con el núcleo hecho ya sabes qué camino te encaja. Aquí se produce.",
        },
        {
          n: "04",
          when: "Al terminar",
          title: "Te lo llevas todo",
          desc: "Diploma, grabaciones, plantillas y comunidad. Sin caducidad.",
        },
      ],
    },

    marquee: {
      label: "El stack que montas",
    },

    // ── EL TEMARIO Y LAS DUDAS ───────────────────────────
    program: {
      eyebrow: "El temario",
      title: "Catorce módulos, uno por semana",
      lead: "Siete de núcleo común y siete de la especialización que elijas. Cada módulo abre con el marco, sigue con la herramienta en pantalla y termina con un ejercicio aplicado a tu caso.",
      // Cinco dudas que no contesta ninguna otra sección. El formato, el
      // ritmo y el precio ya están en el héroe y no vuelven aquí.
      howLabel: "Las dudas de siempre",
      how: [
        { icon: "check" as const, k: "Nivel previo", v: "Ninguno: el núcleo empieza desde cero" },
        { icon: "globe" as const, k: "Idioma", v: "Clases en español, materiales en ES y EN" },
        { icon: "replay" as const, k: "Al terminar", v: "Diploma con los módulos superados y las horas" },
        { icon: "chat" as const, k: "Entre clase y clase", v: "Feedback del equipo y grupo en Slack" },
        { icon: "clock" as const, k: "Dedicación real", v: "4 h de clase y 2 – 3 h de ejercicio" },
      ],
      toolsLabel: "Se abren en clase, no en un anexo",
      cta: "Recibe el temario completo",
      groups: [
        {
          tag: "Semanas 1 – 7 · Todos",
          name: "Núcleo común · 7 módulos",
          modules: [
            { n: "01", title: "Mindset remoto y el nuevo mercado global" },
            { n: "02", title: "Geoposicionamiento y optimización fiscal" },
            { n: "03", title: "Blueprint de reubicación internacional" },
            { n: "04", title: "Stack tecnológico de alto rendimiento" },
            { n: "05", title: "IA para productividad remota" },
            { n: "06", title: "Life Ops: energía y anti-burnout" },
            { n: "07", title: "Legal y compliance transfronterizo" },
          ],
        },
        {
          tag: "Semanas 8 – 14 · Camino 01",
          name: "Remote Professional · 7 módulos",
          modules: [
            { n: "08", title: "Cómo encontrar los empleos remotos que no se publican" },
            { n: "09", title: "Candidaturas con IA y filtros ATS" },
            { n: "10", title: "Marca personal y portfolio internacional" },
            { n: "11", title: "Entrevista en vídeo y asíncrona" },
            { n: "12", title: "Negociación salarial y compensación global" },
            { n: "13", title: "Tus primeros 90 días en un equipo distribuido" },
            { n: "14", title: "Roles senior, advisory y fraccionales" },
          ],
        },
        {
          tag: "Semanas 8 – 14 · Camino 02",
          name: "Remote Founder · 7 módulos",
          modules: [
            { n: "08", title: "Diseño y validación del negocio remoto" },
            { n: "09", title: "Operaciones y marketing con IA" },
            { n: "10", title: "Captación de clientes B2B internacionales" },
            { n: "11", title: "Ofertas premium y landings que convierten" },
            { n: "12", title: "Procesos, SOPs y entrega al cliente" },
            { n: "13", title: "Automatización, delegación y escala" },
            { n: "14", title: "Estructura corporativa borderless" },
          ],
        },
      ],
    },

    alumni: {
      title: "Empresas donde trabajan nuestros alumnos",
    },

    sticky: {
      note: "La convocatoria empieza el 1 de diciembre",
      cta: "Solicita información",
      units: { d: "d", h: "h", m: "m" },
    },

    whatsapp: {
      label: "Escríbenos por WhatsApp",
      message: "Hola, me interesa el programa de ActiveXRemote. ¿Me contáis?",
    },

    faculty: {
      title: "Quién da las clases",
      // ⚠︎ Un solo aviso para los dos datos de maqueta de esta sección: los
      // logotipos (PLACEHOLDER_LOGOS en ad-logos.tsx) y el profesorado
      // (DEMO_FACULTY en bienvenida/faculty.ts).
      notice:
        "Logotipos, fotografías y nombres de muestra: se sustituyen por los reales antes de publicar. El equipo docente de cada convocatoria se comunica antes de formalizar la matrícula.",
    },

    final: {
      title: "Hablamos y decides",
      body: "Déjanos tus datos y te enviamos el temario completo, las fechas y las condiciones. Te escribimos en menos de 24 horas laborables y no hay compromiso de nada.",
    },

    // El pie es el MISMO que el de la portada (columnas, selector de idioma,
    // tarjetas aceptadas y quién cobra), así que su texto sale de
    // bienvenida/copy.ts y aquí sólo queda lo propio de esta página.
    footer: {
      note: "Cada marca es propiedad de su compañía: los partners aportan beneficios para nuestros alumnos, pero no acreditan el programa ni emiten el diploma. El diploma lo emite ActiveXRemote detallando los módulos superados: es una certificación privada de empresa, no un título oficial ni un grado universitario.",
    },
  },

  en: {
    meta: {
      title: "Live online training to work without borders · 14 weeks",
      description:
        "A 100% online, live programme in Spanish: land an international remote job or build your own global business. 14 modules, 56 hours, cohorts of 25.",
    },
    nav: {
      cta: "Request information",
      ctaShort: "Request info",
    },

    hero: {
      badge: "Cohort of 1 December · 25 seats",
      titleTop: "An international remote job",
      titleBottom: "or your own global business",
      lead: "Live online training, taught in Spanish. One four-hour class a week for fourteen weeks, and something finished at the end of each one.",
      formTitle: "Get the full programme",
      formLead: "Syllabus, dates, schedule and terms. No strings attached.",
      facts: [
        { k: "Format", v: "100% online, live" },
        { k: "Starts", v: "1 December 2026" },
        { k: "Pace", v: "One 4-hour class a week" },
        { k: "Price", v: "€2,400 · or 3 × €800" },
      ],
      partnersLabel: "Partners with student benefits",
      partnersNote: "Agreements with the platforms that hold up international remote work.",
      clocksLabel: "Right now",
      clocks: [
        { city: "Barcelona", tz: "Europe/Madrid" },
        { city: "Lisbon", tz: "Europe/Lisbon" },
        { city: "Bogotá", tz: "America/Bogota" },
        { city: "Mexico City", tz: "America/Mexico_City" },
      ],
      stats: [
        { value: 14, suffix: "", label: "modules" },
        { value: 56, suffix: " h", label: "of class" },
        { value: 14, suffix: "", label: "weeks" },
        { value: 25, suffix: "", label: "seats per group" },
      ],
    },

    statement: {
      top: "Remote work is learned",
      bottom: "by working remotely.",
    },

    live: {
      badge: "Live",
      title: "It's online, but it isn't a video.",
      body: "Every module is a four-hour class with the team in front of you: they explain, they open the tool on screen and you work on your own case. The questions are your group's, so no class ever repeats itself.",
      points: [
        { k: "Live, not recorded", v: "The team is there and answers on the spot." },
        { k: "From wherever you are", v: "All you need is a connection: country and time zone don't matter." },
        { k: "And it is recorded", v: "It stays in the campus, with no expiry, in case you miss one." },
      ],
      videoLabel: "A clip from a live class of the programme",
    },

    pillars: [
      {
        icon: "deliver" as const,
        title: "You leave with things built",
        body: "One deliverable per module, marked with your name on it. Not notes.",
      },
      {
        icon: "group" as const,
        title: "A group of 25, not a mass course",
        body: "They know you, ask you and follow you for all 14 weeks.",
      },
      {
        icon: "ai" as const,
        title: "AI inside every module",
        body: "Prompts, agents and automations applied to your own work.",
      },
      {
        icon: "stack" as const,
        title: "The tools people really use",
        body: "The same ones remote teams run on, open on screen.",
      },
    ],

    outcomes: {
      title: "A shared base, and then your path",
      coreTag: "Weeks 1 – 7",
      coreName: "7 core modules",
      coreNote: "The same for everyone",
      takeLabel: "You leave with",
      paths: [
        {
          tag: "Weeks 8 – 14",
          name: "Remote Professional",
          items: [
            {
              role: "To land a job abroad",
              take: "CV, LinkedIn and portfolio ready for international recruiters",
            },
            {
              role: "To invoice as a contractor",
              take: "Contract, international invoicing and tax position sorted",
            },
          ],
        },
        {
          tag: "Weeks 8 – 14",
          name: "Remote Founder",
          items: [
            {
              role: "To build your business",
              take: "A validated offer and a B2B acquisition system running",
            },
            {
              role: "To stop selling hours",
              take: "A packaged service, written processes and automated tasks",
            },
          ],
        },
      ],
    },

    timeline: {
      title: "What happens after you leave your details",
      items: [
        {
          n: "00",
          when: "Today",
          title: "You write to us",
          desc: "We call you within 24 working hours and answer your questions.",
        },
        {
          n: "01",
          when: "Before it starts",
          title: "You book a seat",
          desc: "One payment or three instalments. You get into the campus and the group's Slack.",
        },
        {
          n: "02",
          when: "Weeks 1 – 7",
          title: "You build the base",
          desc: "Tax, tools, AI, legal and remote working habits.",
        },
        {
          n: "03",
          when: "Weeks 8 – 14",
          title: "You build your own thing",
          desc: "With the core done you know which path fits. This is where you produce.",
        },
        {
          n: "04",
          when: "When it ends",
          title: "You keep everything",
          desc: "Diploma, recordings, templates and community. No expiry.",
        },
      ],
    },

    marquee: {
      label: "The stack you build",
    },

    program: {
      eyebrow: "The syllabus",
      title: "Fourteen modules, one a week",
      lead: "Seven of common core and seven of the specialisation you pick. Each module opens with the framework, moves to the tool on screen and ends with an exercise applied to your own case.",
      howLabel: "The usual questions",
      how: [
        { icon: "check" as const, k: "Prior level", v: "None: the core starts from zero" },
        { icon: "globe" as const, k: "Language", v: "Classes in Spanish, materials in ES and EN" },
        { icon: "replay" as const, k: "When it ends", v: "A diploma listing the modules passed and the hours" },
        { icon: "chat" as const, k: "Between classes", v: "Team feedback and your group on Slack" },
        { icon: "clock" as const, k: "Real workload", v: "4 h of class and 2 – 3 h of exercise" },
      ],
      toolsLabel: "Opened in class, not in an appendix",
      cta: "Get the full syllabus",
      groups: [
        {
          tag: "Weeks 1 – 7 · Everyone",
          name: "Common core · 7 modules",
          modules: [
            { n: "01", title: "Remote mindset and the new global market" },
            { n: "02", title: "Geopositioning and tax optimisation" },
            { n: "03", title: "International relocation blueprint" },
            { n: "04", title: "High-performance tech stack" },
            { n: "05", title: "AI for remote productivity" },
            { n: "06", title: "Life Ops: energy and anti-burnout" },
            { n: "07", title: "Cross-border legal and compliance" },
          ],
        },
        {
          tag: "Weeks 8 – 14 · Path 01",
          name: "Remote Professional · 7 modules",
          modules: [
            { n: "08", title: "Finding the remote jobs that never get posted" },
            { n: "09", title: "AI-driven applications and ATS filters" },
            { n: "10", title: "International personal branding and portfolio" },
            { n: "11", title: "Video and asynchronous interviews" },
            { n: "12", title: "Salary negotiation and global compensation" },
            { n: "13", title: "Your first 90 days in a distributed team" },
            { n: "14", title: "Senior, advisory and fractional roles" },
          ],
        },
        {
          tag: "Weeks 8 – 14 · Path 02",
          name: "Remote Founder · 7 modules",
          modules: [
            { n: "08", title: "Remote business design and validation" },
            { n: "09", title: "AI-driven operations and marketing" },
            { n: "10", title: "International B2B client acquisition" },
            { n: "11", title: "Premium offers and landing pages that convert" },
            { n: "12", title: "Processes, SOPs and client delivery" },
            { n: "13", title: "Automation, delegation and scale" },
            { n: "14", title: "Borderless corporate structure" },
          ],
        },
      ],
    },

    alumni: {
      title: "Where our students work",
    },

    sticky: {
      note: "The cohort starts on 1 December",
      cta: "Request information",
      units: { d: "d", h: "h", m: "m" },
    },

    whatsapp: {
      label: "Message us on WhatsApp",
      message: "Hi, I'm interested in the ActiveXRemote programme. Could you tell me more?",
    },

    faculty: {
      title: "Who teaches the classes",
      notice:
        "Sample logos, photographs and names: they will be replaced with the real ones before publishing. Each cohort's teaching team is communicated before enrolment is formalised.",
    },

    final: {
      title: "We talk, then you decide",
      body: "Leave us your details and we'll send you the full syllabus, the dates and the terms. We reply within 24 working hours and there is no commitment of any kind.",
    },

    footer: {
      note: "Each brand belongs to its own company: partners provide benefits for our students, but they do not accredit the programme or issue the diploma. The diploma is issued by ActiveXRemote listing the modules passed: it is a private company certification, not an official qualification or a university degree.",
    },
  },
} satisfies Record<Locale, unknown>;
