import type { Locale } from "@/lib/i18n/config";

// Contenido de las dos landings de curso. Misma forma para los dos cursos: la
// vista (course-view.tsx) es genérica y sólo pinta lo que hay aquí.
export type CourseSlug = "remote-professional" | "remote-founder";

export type CourseModule = {
  n: string;
  title: string;
  lead: string;
  points: string[];
  exercise?: string;
};

export type CourseCopy = {
  slug: CourseSlug;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    lead: string;
    body: string[];
    cta: string;
    formTitle: string;
    /** Barra de cifras del programa (módulos, horas, duración, convocatoria). */
    facts: { value: string; label: string }[];
  };
  shift: { title: string; body: string[]; listLead: string; points: string[]; close: string };
  contrast: { title: string; lead: string; highlight?: string; items: string[] };
  audience: { title: string; lead: string; items: { name: string; desc: string }[] };
  build: { title: string; lead: string; items: { name: string; desc: string }[] };
  program: {
    eyebrow: string;
    title: string;
    lead: string;
    phases: { tag: string; name: string; lead?: string; modules: CourseModule[] }[];
  };
  method: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { n: string; title: string; desc: string }[];
    note?: string;
  };
  system: { title: string; lead: string[]; chain: string[]; close: string };
  enroll: {
    eyebrow: string;
    title: string;
    lead: string;
    items: string[];
    cta: string;
  };
  outcomes: { title: string; items: { title: string; desc: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  closing: { title: string; lines: string[]; cta: string };
};

// ── ES ─────────────────────────────────────────────────────
const professionalEs: CourseCopy = {
  slug: "remote-professional",
  meta: {
    title: "Curso Remote Professional",
    description:
      "Construye una carrera profesional sin fronteras: 14 módulos para competir por oportunidades remotas internacionales.",
  },
  hero: {
    eyebrow: "ActiveX Curso",
    title: "Curso Remote Professional",
    subtitle: "Construye una carrera profesional sin fronteras",
    lead: "Aprende a trabajar, crecer y ganar en el mercado global del trabajo remoto.",
    body: [
      "El mercado laboral ya no está limitado por la ciudad en la que vives.",
      "La Escuela ActiveXRemote te prepara para competir por oportunidades internacionales, trabajar con equipos distribuidos y construir una carrera profesional diseñada para el mundo remoto.",
      "No se trata simplemente de encontrar un trabajo remoto. Se trata de convertirte en un profesional preparado para el mercado global.",
    ],
    cta: "Quiero prepararme para el mercado global",
    formTitle: "Pide información del curso.",
    facts: [
      { value: "14", label: "módulos" },
      { value: "56h", label: "en directo" },
      { value: "7", label: "fines de semana" },
      { value: "9 Ene", label: "arranca la convocatoria" },
    ],
  },
  shift: {
    title: "El trabajo ha cambiado. Tu estrategia profesional también debe hacerlo.",
    body: [
      "Las empresas pueden contratar talento prácticamente en cualquier lugar del mundo. Eso significa más oportunidades. Pero también significa más competencia.",
      "Tu experiencia ya no compite únicamente con profesionales de tu ciudad o de tu país. Compite en un mercado global.",
      "Por eso necesitas mucho más que un buen CV.",
    ],
    listLead: "Necesitas saber:",
    points: [
      "Cómo posicionarte frente a empresas internacionales.",
      "Cómo encontrar oportunidades que no aparecen en los portales tradicionales.",
      "Cómo presentar tu experiencia para un mercado global.",
      "Cómo utilizar IA para mejorar tu búsqueda y tus candidaturas.",
      "Cómo destacar durante entrevistas remotas.",
      "Cómo negociar tu compensación.",
      "Cómo trabajar y generar confianza en equipos distribuidos.",
      "Cómo convertir una posición remota en una carrera profesional sostenible.",
    ],
    close: "ActiveX Remote Professional te enseña a construir ese sistema.",
  },
  contrast: {
    title: "Deja de buscar trabajo remoto. Aprende a competir por oportunidades globales.",
    lead: "La diferencia está en el enfoque.",
    items: [
      "En lugar de enviar cientos de candidaturas genéricas, aprenderás a identificar empresas, posiciones y responsables de contratación que encajan con tu perfil.",
      "En lugar de depender únicamente de tu CV, construirás una presencia profesional preparada para ser encontrada y evaluada por empresas internacionales.",
      "En lugar de improvisar entrevistas y negociaciones, tendrás sistemas, frameworks y herramientas para afrontarlas con mayor preparación.",
    ],
  },
  audience: {
    title: "¿Para quién es ActiveX Remote Professional?",
    lead: "Este programa está diseñado especialmente para:",
    items: [
      {
        name: "Profesionales que quieren trabajar para empresas internacionales",
        desc: "Si quieres dejar de limitar tus oportunidades al mercado laboral local.",
      },
      {
        name: "Empleados que quieren pasar al trabajo remoto",
        desc: "Si tienes experiencia profesional pero necesitas adaptar tu perfil y estrategia al mercado remoto.",
      },
      {
        name: "Contractors y profesionales independientes",
        desc: "Si quieres acceder a contratos internacionales de mayor valor.",
      },
      {
        name: "Profesionales que quieren mejorar su compensación",
        desc: "Si quieres aprender a valorar tu perfil en un mercado global y negociar más allá del salario base.",
      },
      {
        name: "Profesionales que quieren construir una carrera internacional",
        desc: "Si quieres que tu carrera tenga más libertad geográfica y más posibilidades de crecimiento.",
      },
    ],
  },
  build: {
    title: "Lo que vas a construir durante el programa",
    lead: "No vas a terminar el curso simplemente con conocimientos. Vas a trabajar sobre activos y sistemas que podrás utilizar en tu carrera.",
    items: [
      {
        name: "Tu Remote Readiness Roadmap",
        desc: "Identificarás tus fortalezas, vulnerabilidades y áreas de mejora para competir en el mercado remoto global.",
      },
      {
        name: "Tu sistema de búsqueda de oportunidades",
        desc: "Construirás una estrategia para identificar empresas remote-first y oportunidades relevantes.",
      },
      {
        name: "Tu perfil profesional internacional",
        desc: "Trabajarás tu CV, LinkedIn y portfolio para comunicar tu valor de forma clara.",
      },
      {
        name: "Tu sistema de aplicaciones con IA",
        desc: "Aprenderás a utilizar IA para analizar ofertas, adaptar candidaturas y mejorar tus materiales.",
      },
      {
        name: "Tu sistema de preparación para entrevistas",
        desc: "Practicarás entrevistas remotas y comunicación asíncrona.",
      },
      {
        name: "Tu estrategia de negociación",
        desc: "Aprenderás a analizar compensación, establecer referencias y preparar contraofertas.",
      },
      {
        name: "Tu plan de crecimiento profesional",
        desc: "Diseñarás una estrategia para crecer dentro del ecosistema remoto y evolucionar hacia posiciones de mayor valor.",
      },
    ],
  },
  program: {
    eyebrow: "El programa completo",
    title: "14 módulos para construir una carrera profesional global",
    lead: "Los primeros 7 módulos son comunes y construyen las bases necesarias para desenvolverte en un entorno remoto internacional. Después, la ruta Professional profundiza en adquisición de oportunidades, marca personal, entrevistas, negociación y crecimiento profesional.",
    phases: [
      {
        tag: "Fase 1",
        name: "Fundamentos globales",
        modules: [
          {
            n: "01",
            title: "The Remote Mindset & The New Global Market",
            lead: "Cambia tu forma de entender el trabajo. Aprenderás a pasar de una mentalidad laboral localizada a una mentalidad de profesional global, orientada a resultados y preparada para competir en mercados internacionales.",
            points: [
              "El nuevo mercado laboral distribuido.",
              "El concepto de «Personal Startup».",
              "Cómo comunicar valor más allá de las horas trabajadas.",
              "Competencia internacional.",
              "Comunicación asíncrona.",
              "Ownership y autonomía.",
              "Competencia intercultural.",
              "Resiliencia profesional.",
            ],
            exercise: "Remote Readiness Audit + roadmap de 90 días.",
          },
          {
            n: "02",
            title: "Smart Geo-Positioning & Tax Optimization",
            lead: "Tu ubicación puede afectar a tus ingresos, costes y calidad de vida. Aprenderás los fundamentos para analizar diferentes ubicaciones, modelos de residencia y escenarios internacionales.",
            points: [
              "Digital Nomad Visas.",
              "Residencia fiscal.",
              "Coste de vida.",
              "Calidad de vida.",
              "Comparación de mercados.",
              "Herramientas como Nomad List, VisaDB y FlagTheory.",
            ],
            exercise: "Comparar tu situación actual con tres posibles hubs remotos.",
          },
          {
            n: "03",
            title: "The Global Relocation Blueprint",
            lead: "Si tu carrera se vuelve global, tu vida también puede necesitarlo. Aprenderás a planificar una transición internacional de forma estructurada.",
            points: [
              "Banca internacional.",
              "Pagos multidivisa.",
              "Seguro médico internacional.",
              "Vivienda.",
              "Logística.",
              "Primeros 30 días.",
              "Integración cultural.",
              "Construcción de comunidad.",
            ],
            exercise: "Crear tu checklist de relocation para un país objetivo.",
          },
          {
            n: "04",
            title: "The High-Performance Remote Tech Stack",
            lead: "Construye tu infraestructura digital para trabajar desde cualquier lugar. Trabajarás con herramientas como Notion, Coda, ClickUp, Slack, Loom, Wise, Deel, Payoneer, Zapier y Make.",
            points: [
              "Gestión de proyectos.",
              "Knowledge management.",
              "Comunicación asíncrona.",
              "Pagos internacionales.",
              "Automatización.",
              "Seguridad digital.",
            ],
            exercise: "Construir tu propio Remote Operating Dashboard.",
          },
          {
            n: "05",
            title: "AI Productivity Engines for Remote Professionals",
            lead: "La IA no sustituye tu experiencia: puede multiplicar su impacto. Aprenderás a integrarla en tu workflow profesional.",
            points: [
              "Investigar.",
              "Sintetizar información.",
              "Preparar reuniones.",
              "Crear documentación.",
              "Mejorar comunicaciones.",
              "Construir sistemas de conocimiento.",
              "Automatizar tareas repetitivas.",
              "Crear asistentes personalizados.",
            ],
            exercise: "Construir un sistema de IA personalizado para una tarea profesional recurrente.",
          },
          {
            n: "06",
            title: "Life Ops: Energy & Health Management",
            lead: "Trabajar desde cualquier lugar no significa trabajar todo el tiempo. Aprenderás a diseñar un sistema sostenible de trabajo y vida.",
            points: [
              "Timeboxing.",
              "Gestión de energía.",
              "Deep work.",
              "Límites digitales.",
              "Rutinas.",
              "Ergonomía.",
              "Gestión de zonas horarias.",
              "Prevención del burnout.",
              "Construcción de comunidad.",
            ],
            exercise: "Crear tu High-Performance Weekly Template.",
          },
          {
            n: "07",
            title: "Global Legal & Compliance Fundamentals",
            lead: "Antes de trabajar internacionalmente necesitas entender el marco que sostiene tu relación profesional.",
            points: [
              "Employee vs Independent Contractor.",
              "Employer of Record.",
              "Contratos internacionales.",
              "Facturación.",
              "Compliance.",
              "Propiedad intelectual.",
              "NDA y SLA.",
              "Fiscalidad internacional.",
            ],
            exercise: "Crear tu Contractor Fact Sheet o Service Agreement framework.",
          },
        ],
      },
      {
        tag: "Fase 2",
        name: "Remote Career Accelerator",
        lead: "Ahora empieza tu ventaja competitiva. Los siguientes módulos están diseñados específicamente para profesionales que quieren conseguir posiciones, contratos y oportunidades con empresas internacionales.",
        modules: [
          {
            n: "08",
            title: "Advanced Remote Job Hacking",
            lead: "Deja de depender exclusivamente de los portales de empleo. Trabajarás con plataformas y fuentes como LinkedIn, RemoteOK, Wellfound, Crunchbase y Dealroom.",
            points: [
              "Identificar empresas remote-first.",
              "Encontrar oportunidades ocultas.",
              "Investigar compañías de alto crecimiento.",
              "Identificar decision-makers.",
              "Crear campañas de outbound.",
              "Automatizar el seguimiento de oportunidades.",
            ],
            exercise:
              "Crear una matriz con 20 empresas objetivo y desarrollar una secuencia personalizada de contacto.",
          },
          {
            n: "09",
            title: "AI-Driven Job Hunting & Application Engineering",
            lead: "Haz que cada candidatura sea más relevante. Aprenderás a utilizar IA en todo el proceso.",
            points: [
              "Analizar job descriptions.",
              "Entender filtros ATS.",
              "Adaptar tu experiencia.",
              "Crear candidaturas personalizadas.",
              "Preparar cover letters.",
              "Construir casos de estudio.",
              "Crear un pipeline de aplicaciones.",
            ],
            exercise: "Optimizar tu candidatura frente a una oportunidad real.",
          },
          {
            n: "10",
            title: "International Personal Branding & Portfolios",
            lead: "Tu perfil profesional es tu escaparate global. El objetivo: que tu experiencia pueda ser comprendida y valorada rápidamente por recruiters y empresas internacionales.",
            points: [
              "CV internacional.",
              "LinkedIn.",
              "Keywords.",
              "Storytelling profesional.",
              "Portfolio.",
              "Proof of Work.",
              "Case studies.",
            ],
            exercise: "Rediseñar tu presencia profesional digital y crear un portfolio de una página.",
          },
          {
            n: "11",
            title: "Video & Asynchronous Interview Performance",
            lead: "Las entrevistas remotas requieren habilidades específicas.",
            points: [
              "Crear un entorno profesional.",
              "Comunicarte eficazmente ante cámara.",
              "Responder preguntas sobre autonomía.",
              "Gestionar preguntas sobre zonas horarias.",
              "Utilizar Loom y herramientas de vídeo.",
              "Comunicar logros de forma clara y memorable.",
            ],
            exercise: "Grabar una respuesta de entrevista remota y analizarla con un framework de feedback.",
          },
          {
            n: "12",
            title: "Global Salary Negotiation & Compensation",
            lead: "Tu salario no es necesariamente el valor total de tu oferta. También trabajarás estrategias de negociación, anchoring y counter-offers.",
            points: [
              "Salario base.",
              "Incentivos.",
              "Equity.",
              "Stipends.",
              "Vacaciones.",
              "Beneficios.",
              "Compensación internacional.",
            ],
            exercise: "Crear tu Salary Negotiation Playbook y preparar una contraoferta.",
          },
          {
            n: "13",
            title: "Onboarding & Succeeding in Distributed Teams",
            lead: "Conseguir el trabajo es solo el principio. Aprenderás a construir confianza durante tus primeros 90 días.",
            points: [
              "Comunicación interna.",
              "Documentación.",
              "Visibilidad asíncrona.",
              "Gestión de stakeholders.",
              "Cultura distribuida.",
              "Autonomía.",
              "Trust building.",
            ],
            exercise: "Crear tu First 30 Days Action Strategy y tu Personal ReadMe.",
          },
          {
            n: "14",
            title: "Career Scaling & Fractional Remote Operations",
            lead: "Diseña lo que viene después. Aprenderás a vender resultados y aumentar tu valor de mercado sin depender exclusivamente de aumentar tus horas de trabajo.",
            points: [
              "Roles senior.",
              "Advisory.",
              "Fractional work.",
              "Consultoría.",
              "Múltiples contratos.",
              "Posicionamiento experto.",
            ],
            exercise: "Crear tu Fractional Transition Blueprint.",
          },
        ],
      },
    ],
  },
  method: {
    eyebrow: "Cómo se aprende",
    title: "Una experiencia de aprendizaje diseñada para aplicar",
    lead: "Cada módulo está pensado para una sesión online de 4 horas combinando teoría, walkthroughs prácticos, casos reales y trabajo sobre situaciones concretas.",
    items: [
      { n: "01", title: "Macro Insight & Core Theory", desc: "Entiende el contexto y los frameworks." },
      { n: "02", title: "Live Technical Deep-Dive", desc: "Configura herramientas y sistemas." },
      { n: "03", title: "Interactive Case Workshop", desc: "Aplica lo aprendido a situaciones reales." },
      { n: "04", title: "Tactical Q&A & Action Steps", desc: "Resuelve casos específicos y define tus siguientes acciones." },
    ],
  },
  system: {
    title: "No es un curso para consumir. Es un sistema para implementar.",
    lead: [
      "Cada módulo termina con una acción concreta.",
      "Durante el programa construirás progresivamente tu infraestructura profesional global:",
    ],
    chain: [
      "Mindset",
      "Tech Stack",
      "IA",
      "Legal",
      "Job Strategy",
      "Marca personal",
      "Entrevistas",
      "Negociación",
      "Crecimiento",
    ],
    close: "Al finalizar, tendrás mucho más que conocimientos. Tendrás un sistema.",
  },
  enroll: {
    eyebrow: "Convocatoria",
    title: "Empieza el 9 de enero de 2027",
    lead: "7 fines de semana, hasta el 21 de febrero: dos clases en directo de 4 horas cada fin de semana, en grupos de 25 plazas.",
    items: [
      "14 módulos en directo (56 h lectivas)",
      "Campus virtual con grabaciones y audio narrado",
      "Frameworks y plantillas descargables",
      "Ejercicio y feedback en cada módulo",
      "Comunidad y seguimiento en Slack",
      "Diploma de ActiveXRemote con los módulos superados",
    ],
    cta: "Solicita información",
  },
  outcomes: {
    title: "¿Qué puedes conseguir con ActiveX Remote Professional?",
    items: [
      {
        title: "Acceder a un mercado laboral más amplio",
        desc: "Deja de limitar tus oportunidades a las empresas que contratan donde vives.",
      },
      {
        title: "Trabajar eficazmente en remoto",
        desc: "Desarrolla las habilidades, herramientas y sistemas necesarios para trabajar de forma autónoma.",
      },
      {
        title: "Utilizar IA como ventaja profesional",
        desc: "Integra IA en tus procesos para aumentar velocidad, calidad y capacidad de ejecución.",
      },
      {
        title: "Mejorar tu capacidad de negociación",
        desc: "Aprende a analizar y defender el valor de tu perfil en un mercado global.",
      },
      {
        title: "Diseñar una carrera más flexible",
        desc: "Construye una trayectoria que pueda evolucionar hacia roles senior, fractional, advisory o consulting.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Necesito experiencia previa en trabajo remoto?",
        a: "El programa está diseñado para profesionales que quieren prepararse para el mercado remoto y desarrollar una carrera internacional.",
      },
      {
        q: "¿Es únicamente un curso para encontrar trabajo?",
        a: "No. La primera parte construye las bases para desenvolverte en un ecosistema remoto global y la segunda se centra específicamente en conseguir, desarrollar y escalar una carrera internacional.",
      },
      {
        q: "¿Se trabaja con herramientas reales?",
        a: "Sí. El programa incorpora walkthroughs y ejercicios prácticos con herramientas utilizadas para productividad, comunicación, IA, búsqueda de empleo, pagos y trabajo remoto.",
      },
      {
        q: "¿Cuánto dura cada sesión?",
        a: "La estructura propuesta contempla bloques lectivos de 4 horas por módulo.",
      },
      {
        q: "¿Qué ocurre después del curso?",
        a: "El objetivo es que cada módulo produzca un activo, sistema, análisis o plan que puedas seguir utilizando después de la formación.",
      },
    ],
  },
  closing: {
    title: "Tu carrera no tiene por qué tener fronteras.",
    lines: [
      "El mercado global está abierto.",
      "La pregunta es si tu perfil está preparado para competir en él.",
      "Empieza a construir una carrera profesional global.",
    ],
    cta: "Quiero convertirme en un Remote Professional",
  },
};

const founderEs: CourseCopy = {
  slug: "remote-founder",
  meta: {
    title: "Curso Remote Founder",
    description:
      "Construye un negocio que pueda funcionar desde cualquier lugar: 14 módulos para pasar de habilidad a negocio global.",
  },
  hero: {
    eyebrow: "ActiveX Curso",
    title: "Curso Remote Founder",
    subtitle: "Construye un negocio que pueda funcionar desde cualquier lugar",
    lead: "Convierte tu experiencia en una oferta global, consigue clientes internacionales y crea un negocio remoto diseñado para darte más libertad.",
    body: [
      "No necesitas construir una gran empresa para construir una gran vida.",
      "Puedes empezar con una habilidad. Convertirla en una oferta. Encontrar clientes en cualquier mercado. Automatizar lo repetitivo. Delegar lo que no necesitas hacer tú.",
      "Y construir progresivamente un negocio que no dependa de estar físicamente en un lugar concreto. La Escuela ActiveXRemote te enseña a hacerlo.",
    ],
    cta: "Quiero construir mi negocio remoto",
    formTitle: "Pide información del curso.",
    facts: [
      { value: "14", label: "módulos" },
      { value: "56h", label: "en directo" },
      { value: "7", label: "fines de semana" },
      { value: "9 Ene", label: "arranca la convocatoria" },
    ],
  },
  shift: {
    title: "Deja de vender horas. Empieza a construir un activo.",
    body: [
      "El modelo tradicional de trabajo tiene una limitación: si tú paras, los ingresos pueden parar contigo.",
      "Un negocio remoto bien diseñado puede funcionar de otra manera.",
    ],
    listLead: "Puedes convertir tus conocimientos en:",
    points: [
      "Servicios especializados.",
      "Productized services.",
      "Consultoría.",
      "Agencia.",
      "Productos digitales.",
      "SaaS.",
      "Sistemas de ingresos diversificados.",
    ],
    close:
      "Y utilizar tecnología, IA, automatización y talento distribuido para aumentar tu capacidad sin aumentar proporcionalmente tus horas. Ese es el cambio que busca ActiveX Remote Founder.",
  },
  contrast: {
    title: "Tu objetivo no es simplemente facturar más. Es construir más libertad.",
    lead: "Un negocio remoto debería ayudarte a conseguir tres cosas:",
    highlight: "Ingresos + autonomía + movilidad",
    items: [
      "Por eso el programa combina estrategia empresarial con sistemas operativos, adquisición de clientes, IA, automatización y estructura internacional.",
    ],
  },
  audience: {
    title: "¿Para quién es este programa?",
    lead: "Está diseñado para quien quiere construir, no sólo trabajar:",
    items: [
      {
        name: "Freelancers",
        desc: "Si quieres dejar de competir únicamente por precio y construir ofertas de mayor valor.",
      },
      {
        name: "Solopreneurs",
        desc: "Si quieres crear un negocio ligero que puedas operar desde cualquier lugar.",
      },
      {
        name: "Consultores",
        desc: "Si quieres convertir tu experiencia en servicios premium y recurrentes.",
      },
      {
        name: "Fundadores",
        desc: "Si quieres diseñar una empresa preparada para operar internacionalmente.",
      },
      {
        name: "Profesionales que quieren independizarse",
        desc: "Si tienes una habilidad comercializable y quieres transformarla en un negocio.",
      },
    ],
  },
  build: {
    title: "Lo que vas a construir",
    lead: "Durante el programa trabajarás sobre los principales componentes de un negocio remoto.",
    items: [
      {
        name: "Tu Freedom Business Model",
        desc: "Elegirás un modelo alineado con tus habilidades, objetivos económicos y nivel de libertad deseado.",
      },
      {
        name: "Tu nicho y oferta",
        desc: "Identificarás problemas de alto valor y convertirás tu experiencia en una propuesta concreta.",
      },
      {
        name: "Tu sistema de adquisición de clientes",
        desc: "Construirás mecanismos outbound e inbound para generar oportunidades internacionales.",
      },
      {
        name: "Tu máquina de marketing",
        desc: "Utilizarás contenido, autoridad e IA para crear distribución.",
      },
      {
        name: "Tu sistema de ventas",
        desc: "Aprenderás a vender de forma asíncrona y reducir la dependencia de reuniones.",
      },
      {
        name: "Tu infraestructura operativa",
        desc: "Documentarás procesos, crearás SOPs y organizarás la entrega.",
      },
      {
        name: "Tu sistema de automatización",
        desc: "Automatizarás tareas y conectarás tus herramientas.",
      },
      {
        name: "Tu estrategia de delegación",
        desc: "Aprenderás qué automatizar, qué delegar y qué mantener bajo tu control.",
      },
      {
        name: "Tu arquitectura empresarial internacional",
        desc: "Explorarás estructuras corporativas y sistemas de pago para operar globalmente.",
      },
    ],
  },
  program: {
    eyebrow: "El programa",
    title: "14 módulos para pasar de habilidad a negocio global",
    lead: "Los primeros siete módulos son comunes y crean la infraestructura personal, tecnológica, legal y operativa necesaria para trabajar internacionalmente. Después comienza la ruta específica para solopreneurs, freelancers y founders.",
    phases: [
      {
        tag: "Fase 1",
        name: "Construye tu infraestructura global",
        modules: [
          {
            n: "01",
            title: "The Remote Mindset & The New Global Market",
            lead: "Deja de pensar como un profesional limitado por un mercado local. Aprende a posicionarte como un proveedor de valor dentro de un mercado global.",
            points: [
              "Economía del trabajo remoto.",
              "Personal Startup.",
              "Value-Provider Matrix.",
              "Competencia internacional.",
              "Comunicación asíncrona.",
              "Ownership.",
              "Autonomía.",
              "Resiliencia.",
            ],
            exercise: "Remote Readiness Audit y roadmap de 90 días.",
          },
          {
            n: "02",
            title: "Smart Geo-Positioning & Tax Optimization",
            lead: "Una empresa global requiere entender dónde trabajas, dónde resides y cómo se estructura tu actividad.",
            points: [
              "Localización estratégica.",
              "Residencia.",
              "Fiscalidad.",
              "Coste de vida.",
              "Digital Nomad Visas.",
              "Hubs internacionales.",
            ],
            exercise: "Comparar tres posibles ubicaciones y escenarios económicos.",
          },
          {
            n: "03",
            title: "The Global Relocation Blueprint",
            lead: "Diseña una infraestructura de vida que pueda acompañar a tu negocio.",
            points: [
              "Banca.",
              "Pagos.",
              "Seguros.",
              "Vivienda.",
              "Logística.",
              "Seguridad.",
              "Integración internacional.",
            ],
            exercise: "Construir tu Relocation Checklist.",
          },
          {
            n: "04",
            title: "The High-Performance Remote Tech Stack",
            lead: "Tu negocio necesita una infraestructura digital. El objetivo es crear un entorno operativo donde puedas gestionar proyectos, conocimiento, comunicación, pagos y automatizaciones desde cualquier lugar.",
            points: [
              "Notion.",
              "Coda.",
              "ClickUp.",
              "Slack.",
              "Loom.",
              "Wise.",
              "Deel.",
              "Payoneer.",
              "Zapier.",
              "Make.",
            ],
          },
          {
            n: "05",
            title: "AI Productivity Engines",
            lead: "Convierte la IA en parte de tu equipo operativo.",
            points: [
              "Investigación.",
              "Creación de contenido.",
              "Síntesis.",
              "Documentación.",
              "Automatización.",
              "Sistemas de conocimiento.",
              "Asistentes personalizados.",
            ],
            exercise: "Construir un AI Agent adaptado a una necesidad profesional concreta.",
          },
          {
            n: "06",
            title: "Life Ops: Energy & Health Management",
            lead: "El objetivo no es construir un negocio que te esclavice. Aprenderás a diseñar una forma sostenible de operar.",
            points: [
              "Gestión de energía.",
              "Deep work.",
              "Timeboxing.",
              "Límites digitales.",
              "Rutinas.",
              "Ergonomía.",
              "Gestión de zonas horarias.",
              "Comunidad.",
            ],
            exercise: "Crear tu sistema semanal de alto rendimiento.",
          },
          {
            n: "07",
            title: "Global Legal & Compliance Fundamentals",
            lead: "Construye tu negocio sobre bases legales y operativas que puedas entender.",
            points: [
              "Contractor vs Employee.",
              "EOR.",
              "Contratos.",
              "Facturación.",
              "Compliance.",
              "Propiedad intelectual.",
              "NDA.",
              "SLA.",
              "Fiscalidad internacional.",
            ],
            exercise: "Crear un framework de contrato o documentación profesional.",
          },
        ],
      },
      {
        tag: "Fase 2",
        name: "Global Remote Builder",
        lead: "Ahora construye el negocio.",
        modules: [
          {
            n: "08",
            title: "Freedom Business Design & Market Validation",
            lead: "Antes de construir, valida. Aprenderás a comparar modelos y a encontrar problemas por los que empresas internacionales estén dispuestas a pagar. Trabajarás sobre el Freedom Business Canvas: nicho → problema → oferta → validación.",
            points: [
              "Freelance.",
              "Productized Services.",
              "Agencia.",
              "SaaS.",
              "Infoproductos.",
            ],
            exercise: "Entrevistar a tres potenciales compradores y validar tu hipótesis de negocio.",
          },
          {
            n: "09",
            title: "AI-Driven Business Operations & Marketing",
            lead: "Construye un negocio más ligero gracias a la IA.",
            points: [
              "Generación de leads.",
              "Investigación de empresas.",
              "Creación de contenido.",
              "Distribución.",
              "Creación de assets.",
              "Comunicación con clientes.",
              "Onboarding.",
              "Automatización.",
            ],
            exercise:
              "Construir un Automated Marketing Loop que transforme una idea en contenido y capture nuevos leads.",
          },
          {
            n: "10",
            title: "B2B Client Acquisition & International Sales",
            lead: "Aprende a encontrar clientes internacionales sin depender exclusivamente de recomendaciones.",
            points: [
              "Cold outreach.",
              "LinkedIn.",
              "Email.",
              "Upwork.",
              "Propuestas.",
              "Inbound marketing.",
              "Discovery audits.",
              "Ventas asíncronas.",
            ],
            exercise: "Lanzar una campaña real de outreach con 10 potenciales clientes internacionales.",
          },
          {
            n: "11",
            title: "High-Converting Offers & Minimalist Landing Pages",
            lead: "Una buena habilidad no es suficiente. Necesitas una oferta que el mercado entienda.",
            points: [
              "Dejar de vender únicamente horas.",
              "Diseñar servicios productizados.",
              "Crear ofertas premium.",
              "Escribir copy de conversión.",
              "Diseñar garantías.",
              "Construir landing pages simples.",
              "Integrar pagos y contratos.",
            ],
            exercise: "Publicar una Minimum Viable Service Page y conectar un sistema de pago.",
          },
          {
            n: "12",
            title: "Distributed Operations Systems & SOPs",
            lead: "El crecimiento empieza cuando tu negocio deja de depender de tu memoria.",
            points: [
              "Sistemas operativos.",
              "Dashboards.",
              "SOPs.",
              "Client portals.",
              "Workflows.",
              "Sistemas de seguimiento.",
              "Control de márgenes.",
              "Gestión de scope creep.",
            ],
            exercise: "Construir un Client Delivery Hub y documentar tu principal proceso de entrega.",
          },
          {
            n: "13",
            title: "Automation, Delegation & Scaling Up",
            lead: "Tu objetivo no debería ser hacer más. Debería ser hacer menos cosas de menor valor: automatizar → delegar → mantener.",
            points: [
              "Automatizaciones avanzadas.",
              "Zapier.",
              "Make.",
              "Webhooks.",
              "Contratación de freelancers.",
              "Virtual Assistants.",
              "Onboarding.",
              "Gestión de equipos distribuidos.",
            ],
            exercise: "Crear un Backoffice Automation Loop.",
          },
          {
            n: "14",
            title: "Borderless Corporate Formations & Asset Protection",
            lead: "Cuando el negocio crece, también necesita una infraestructura empresarial adecuada.",
            points: [
              "US LLC para no residentes.",
              "Estonia e-Residency.",
              "UAE Freezone.",
              "Banca corporativa.",
              "Pagos multidivisa.",
              "Protección de propiedad intelectual.",
              "Compliance internacional.",
              "Estructuras empresariales.",
            ],
            exercise: "Completar tu Corporate Entity Matrix y definir la estructura adecuada para tu etapa actual.",
          },
        ],
      },
    ],
  },
  method: {
    eyebrow: "La metodología",
    title: "Aprende → construye → prueba → automatiza → escala",
    lead: "Cada sesión está diseñada para combinar:",
    items: [
      { n: "01", title: "Estrategia", desc: "Entiende el mercado y los frameworks." },
      { n: "02", title: "Implementación", desc: "Construye herramientas y sistemas en directo." },
      { n: "03", title: "Casos reales", desc: "Trabaja sobre situaciones concretas de negocio." },
      { n: "04", title: "Acción", desc: "Termina cada módulo sabiendo exactamente qué implementar después." },
    ],
    note: "La estructura propuesta combina teoría, walkthroughs técnicos, workshops y una sesión final de preguntas y acciones.",
  },
  system: {
    title: "Tu negocio remoto empieza con una habilidad.",
    lead: ["Pero no termina ahí."],
    chain: [
      "Habilidad",
      "Nicho",
      "Oferta",
      "Clientes",
      "Sistemas",
      "Automatización",
      "Delegación",
      "Escala",
      "Libertad",
    ],
    close: "ActiveX Remote Founder está diseñado para acompañarte a través de ese proceso.",
  },
  enroll: {
    eyebrow: "Convocatoria",
    title: "Empieza el 9 de enero de 2027",
    lead: "7 fines de semana, hasta el 21 de febrero: dos clases en directo de 4 horas cada fin de semana, en grupos de 25 plazas.",
    items: [
      "14 módulos en directo (56 h lectivas)",
      "Campus virtual con grabaciones y audio narrado",
      "Frameworks y plantillas descargables",
      "Ejercicio y feedback en cada módulo",
      "Comunidad y seguimiento en Slack",
      "Diploma de ActiveXRemote con los módulos superados",
    ],
    cta: "Solicita información",
  },
  outcomes: {
    title: "¿Qué puedes conseguir?",
    items: [
      {
        title: "Acceder a clientes internacionales",
        desc: "Construye una estrategia comercial que no dependa exclusivamente de tu mercado local.",
      },
      {
        title: "Crear ofertas de mayor valor",
        desc: "Aprende a empaquetar tu experiencia en servicios y soluciones que puedan venderse internacionalmente.",
      },
      {
        title: "Automatizar operaciones",
        desc: "Utiliza IA y no-code para reducir trabajo administrativo y repetitivo.",
      },
      {
        title: "Crear sistemas",
        desc: "Documenta procesos para que el negocio sea más fácil de operar y escalar.",
      },
      {
        title: "Delegar",
        desc: "Aprende a incorporar colaboradores distribuidos sin perder control sobre la calidad.",
      },
      {
        title: "Diseñar libertad geográfica",
        desc: "Construye un negocio compatible con una vida más flexible y móvil.",
      },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Tengo que ser emprendedor para hacer este programa?",
        a: "Está específicamente diseñado para freelancers, solopreneurs, founders y profesionales que quieren construir un negocio remoto.",
      },
      {
        q: "¿Necesito tener ya un negocio?",
        a: "No necesariamente. Una parte importante del programa está dedicada a elegir un modelo, identificar un nicho y validar una oportunidad antes de construir infraestructura.",
      },
      {
        q: "¿Puedo utilizar IA aunque no tenga conocimientos técnicos?",
        a: "El programa está orientado a la aplicación práctica de herramientas de IA y automatización dentro de los procesos de negocio.",
      },
      {
        q: "¿Se trabaja sobre mi propio negocio?",
        a: "La estructura incluye ejercicios de aplicación, validación, construcción de ofertas, adquisición de clientes, operaciones y automatización para llevar los conceptos a la práctica.",
      },
      {
        q: "¿El programa enseña solamente marketing?",
        a: "No. La ruta cubre el negocio completo: modelo, validación, adquisición de clientes, oferta, ventas, operaciones, SOPs, automatización, delegación y estructuras empresariales internacionales.",
      },
    ],
  },
  closing: {
    title: "No construyas un negocio que te obligue a estar siempre presente.",
    lines: [
      "Construye un negocio diseñado para darte libertad.",
      "El mercado es global. Tus clientes pueden estar en cualquier lugar. Tu equipo puede estar en cualquier lugar. Tu negocio también puede estarlo.",
      "Empieza a construir tu Global Remote Business.",
    ],
    cta: "Quiero ser un ActiveX Remote Founder",
  },
};

// ── EN ─────────────────────────────────────────────────────
const professionalEn: CourseCopy = {
  slug: "remote-professional",
  meta: {
    title: "Remote Professional Course",
    description:
      "Build a borderless professional career: 14 modules to compete for international remote opportunities.",
  },
  hero: {
    eyebrow: "ActiveX Course",
    title: "Remote Professional Course",
    subtitle: "Build a professional career without borders",
    lead: "Learn to work, grow and earn in the global remote job market.",
    body: [
      "The job market is no longer limited by the city you live in.",
      "The ActiveXRemote School prepares you to compete for international opportunities, work with distributed teams and build a career designed for the remote world.",
      "It's not simply about finding a remote job. It's about becoming a professional ready for the global market.",
    ],
    cta: "I want to get ready for the global market",
    formTitle: "Request course information.",
    facts: [
      { value: "14", label: "modules" },
      { value: "56h", label: "live" },
      { value: "7", label: "weekends" },
      { value: "9 Jan", label: "cohort starts" },
    ],
  },
  shift: {
    title: "Work has changed. Your career strategy has to change too.",
    body: [
      "Companies can hire talent almost anywhere in the world. That means more opportunities. But it also means more competition.",
      "Your experience no longer competes only with professionals from your city or your country. It competes in a global market.",
      "That's why you need far more than a good CV.",
    ],
    listLead: "You need to know:",
    points: [
      "How to position yourself in front of international companies.",
      "How to find opportunities that never reach traditional job boards.",
      "How to present your experience for a global market.",
      "How to use AI to improve your search and your applications.",
      "How to stand out in remote interviews.",
      "How to negotiate your compensation.",
      "How to work and build trust in distributed teams.",
      "How to turn a remote position into a sustainable career.",
    ],
    close: "ActiveX Remote Professional teaches you how to build that system.",
  },
  contrast: {
    title: "Stop looking for remote jobs. Learn to compete for global opportunities.",
    lead: "The difference is in the approach.",
    items: [
      "Instead of sending hundreds of generic applications, you'll learn to identify companies, positions and hiring managers that match your profile.",
      "Instead of relying only on your CV, you'll build a professional presence ready to be found and evaluated by international companies.",
      "Instead of improvising interviews and negotiations, you'll have systems, frameworks and tools to face them better prepared.",
    ],
  },
  audience: {
    title: "Who is ActiveX Remote Professional for?",
    lead: "This program is designed especially for:",
    items: [
      {
        name: "Professionals who want to work for international companies",
        desc: "If you want to stop limiting your opportunities to the local job market.",
      },
      {
        name: "Employees moving into remote work",
        desc: "If you have professional experience but need to adapt your profile and strategy to the remote market.",
      },
      {
        name: "Contractors and independent professionals",
        desc: "If you want access to higher-value international contracts.",
      },
      {
        name: "Professionals who want better compensation",
        desc: "If you want to learn how to value your profile in a global market and negotiate beyond base salary.",
      },
      {
        name: "Professionals building an international career",
        desc: "If you want more geographic freedom and more room to grow.",
      },
    ],
  },
  build: {
    title: "What you'll build during the program",
    lead: "You won't finish the course with knowledge alone. You'll work on assets and systems you can keep using in your career.",
    items: [
      {
        name: "Your Remote Readiness Roadmap",
        desc: "You'll identify your strengths, weak spots and gaps to compete in the global remote market.",
      },
      {
        name: "Your opportunity-sourcing system",
        desc: "You'll build a strategy to identify remote-first companies and relevant openings.",
      },
      {
        name: "Your international professional profile",
        desc: "You'll work on your CV, LinkedIn and portfolio to communicate your value clearly.",
      },
      {
        name: "Your AI-powered application system",
        desc: "You'll learn to use AI to analyze job posts, tailor applications and improve your materials.",
      },
      {
        name: "Your interview preparation system",
        desc: "You'll practice remote interviews and async communication.",
      },
      {
        name: "Your negotiation strategy",
        desc: "You'll learn to analyze compensation, set benchmarks and prepare counter-offers.",
      },
      {
        name: "Your career growth plan",
        desc: "You'll design a strategy to grow inside the remote ecosystem and move toward higher-value roles.",
      },
    ],
  },
  program: {
    eyebrow: "The full program",
    title: "14 modules to build a global professional career",
    lead: "The first 7 modules are shared and build the foundation you need to operate in an international remote environment. Then the Professional track goes deep into opportunity acquisition, personal brand, interviews, negotiation and career growth.",
    phases: [
      {
        tag: "Phase 1",
        name: "Global foundations",
        modules: [
          {
            n: "01",
            title: "The Remote Mindset & The New Global Market",
            lead: "Change how you understand work. You'll move from a local employment mindset to a global professional mindset, outcome-driven and ready to compete internationally.",
            points: [
              "The new distributed job market.",
              "The “Personal Startup” concept.",
              "Communicating value beyond hours worked.",
              "International competition.",
              "Async communication.",
              "Ownership and autonomy.",
              "Cross-cultural competence.",
              "Professional resilience.",
            ],
            exercise: "Remote Readiness Audit + 90-day roadmap.",
          },
          {
            n: "02",
            title: "Smart Geo-Positioning & Tax Optimization",
            lead: "Where you live affects your income, costs and quality of life. You'll learn the fundamentals to analyze locations, residency models and international scenarios.",
            points: [
              "Digital Nomad Visas.",
              "Tax residency.",
              "Cost of living.",
              "Quality of life.",
              "Market comparison.",
              "Tools like Nomad List, VisaDB and FlagTheory.",
            ],
            exercise: "Compare your current situation against three possible remote hubs.",
          },
          {
            n: "03",
            title: "The Global Relocation Blueprint",
            lead: "If your career goes global, your life may need to follow. You'll learn to plan an international transition in a structured way.",
            points: [
              "International banking.",
              "Multi-currency payments.",
              "International health insurance.",
              "Housing.",
              "Logistics.",
              "The first 30 days.",
              "Cultural integration.",
              "Building community.",
            ],
            exercise: "Create your relocation checklist for a target country.",
          },
          {
            n: "04",
            title: "The High-Performance Remote Tech Stack",
            lead: "Build the digital infrastructure to work from anywhere. You'll work with tools like Notion, Coda, ClickUp, Slack, Loom, Wise, Deel, Payoneer, Zapier and Make.",
            points: [
              "Project management.",
              "Knowledge management.",
              "Async communication.",
              "International payments.",
              "Automation.",
              "Digital security.",
            ],
            exercise: "Build your own Remote Operating Dashboard.",
          },
          {
            n: "05",
            title: "AI Productivity Engines for Remote Professionals",
            lead: "AI doesn't replace your experience: it can multiply its impact. You'll learn to build it into your professional workflow.",
            points: [
              "Research.",
              "Synthesizing information.",
              "Preparing meetings.",
              "Creating documentation.",
              "Improving communication.",
              "Building knowledge systems.",
              "Automating repetitive tasks.",
              "Creating custom assistants.",
            ],
            exercise: "Build a custom AI system for a recurring professional task.",
          },
          {
            n: "06",
            title: "Life Ops: Energy & Health Management",
            lead: "Working from anywhere doesn't mean working all the time. You'll design a sustainable work and life system.",
            points: [
              "Timeboxing.",
              "Energy management.",
              "Deep work.",
              "Digital boundaries.",
              "Routines.",
              "Ergonomics.",
              "Time-zone management.",
              "Burnout prevention.",
              "Building community.",
            ],
            exercise: "Create your High-Performance Weekly Template.",
          },
          {
            n: "07",
            title: "Global Legal & Compliance Fundamentals",
            lead: "Before working internationally you need to understand the framework behind your professional relationship.",
            points: [
              "Employee vs Independent Contractor.",
              "Employer of Record.",
              "International contracts.",
              "Invoicing.",
              "Compliance.",
              "Intellectual property.",
              "NDAs and SLAs.",
              "International taxation.",
            ],
            exercise: "Create your Contractor Fact Sheet or Service Agreement framework.",
          },
        ],
      },
      {
        tag: "Phase 2",
        name: "Remote Career Accelerator",
        lead: "This is where your competitive edge starts. These modules are designed for professionals who want to land positions, contracts and opportunities with international companies.",
        modules: [
          {
            n: "08",
            title: "Advanced Remote Job Hacking",
            lead: "Stop depending exclusively on job boards. You'll work with platforms and sources like LinkedIn, RemoteOK, Wellfound, Crunchbase and Dealroom.",
            points: [
              "Identify remote-first companies.",
              "Find hidden opportunities.",
              "Research high-growth companies.",
              "Identify decision-makers.",
              "Build outbound campaigns.",
              "Automate opportunity tracking.",
            ],
            exercise: "Build a 20-company target matrix and develop a personalized outreach sequence.",
          },
          {
            n: "09",
            title: "AI-Driven Job Hunting & Application Engineering",
            lead: "Make every application more relevant. You'll learn to use AI across the whole process.",
            points: [
              "Analyze job descriptions.",
              "Understand ATS filters.",
              "Adapt your experience.",
              "Create tailored applications.",
              "Prepare cover letters.",
              "Build case studies.",
              "Create an application pipeline.",
            ],
            exercise: "Optimize your application against a real opportunity.",
          },
          {
            n: "10",
            title: "International Personal Branding & Portfolios",
            lead: "Your professional profile is your global storefront. The goal: your experience understood and valued quickly by international recruiters and companies.",
            points: [
              "International CV.",
              "LinkedIn.",
              "Keywords.",
              "Professional storytelling.",
              "Portfolio.",
              "Proof of Work.",
              "Case studies.",
            ],
            exercise: "Redesign your digital professional presence and build a one-page portfolio.",
          },
          {
            n: "11",
            title: "Video & Asynchronous Interview Performance",
            lead: "Remote interviews demand specific skills.",
            points: [
              "Create a professional setup.",
              "Communicate effectively on camera.",
              "Answer questions about autonomy.",
              "Handle time-zone questions.",
              "Use Loom and video tools.",
              "Communicate achievements clearly and memorably.",
            ],
            exercise: "Record a remote interview answer and analyze it with a feedback framework.",
          },
          {
            n: "12",
            title: "Global Salary Negotiation & Compensation",
            lead: "Your salary isn't necessarily the total value of your offer. You'll also work on negotiation strategy, anchoring and counter-offers.",
            points: [
              "Base salary.",
              "Incentives.",
              "Equity.",
              "Stipends.",
              "Time off.",
              "Benefits.",
              "International compensation.",
            ],
            exercise: "Create your Salary Negotiation Playbook and prepare a counter-offer.",
          },
          {
            n: "13",
            title: "Onboarding & Succeeding in Distributed Teams",
            lead: "Landing the job is only the beginning. You'll learn to build trust during your first 90 days.",
            points: [
              "Internal communication.",
              "Documentation.",
              "Async visibility.",
              "Stakeholder management.",
              "Distributed culture.",
              "Autonomy.",
              "Trust building.",
            ],
            exercise: "Create your First 30 Days Action Strategy and your Personal ReadMe.",
          },
          {
            n: "14",
            title: "Career Scaling & Fractional Remote Operations",
            lead: "Design what comes next. You'll learn to sell outcomes and raise your market value without simply adding more hours.",
            points: [
              "Senior roles.",
              "Advisory.",
              "Fractional work.",
              "Consulting.",
              "Multiple contracts.",
              "Expert positioning.",
            ],
            exercise: "Create your Fractional Transition Blueprint.",
          },
        ],
      },
    ],
  },
  method: {
    eyebrow: "How you learn",
    title: "A learning experience designed to be applied",
    lead: "Each module is a 4-hour online session combining theory, hands-on walkthroughs, real cases and work on concrete situations.",
    items: [
      { n: "01", title: "Macro Insight & Core Theory", desc: "Understand the context and the frameworks." },
      { n: "02", title: "Live Technical Deep-Dive", desc: "Set up tools and systems." },
      { n: "03", title: "Interactive Case Workshop", desc: "Apply what you learned to real situations." },
      { n: "04", title: "Tactical Q&A & Action Steps", desc: "Solve specific cases and define your next actions." },
    ],
  },
  system: {
    title: "Not a course to consume. A system to implement.",
    lead: [
      "Every module ends with a concrete action.",
      "Throughout the program you'll progressively build your global professional infrastructure:",
    ],
    chain: [
      "Mindset",
      "Tech Stack",
      "AI",
      "Legal",
      "Job Strategy",
      "Personal Brand",
      "Interviews",
      "Negotiation",
      "Career Growth",
    ],
    close: "By the end you'll have far more than knowledge. You'll have a system.",
  },
  enroll: {
    eyebrow: "Cohort",
    title: "Starts 9 January 2027",
    lead: "7 weekends, until 21 February: two 4-hour live classes every weekend, in groups of 25 seats.",
    items: [
      "14 live modules (56 teaching hours)",
      "Virtual campus with recordings and narrated audio",
      "Downloadable frameworks and templates",
      "Exercise and feedback in every module",
      "Community and follow-up on Slack",
      "An ActiveXRemote diploma listing the modules you completed",
    ],
    cta: "Request information",
  },
  outcomes: {
    title: "What can you achieve with ActiveX Remote Professional?",
    items: [
      {
        title: "Access a much larger job market",
        desc: "Stop limiting your opportunities to companies hiring where you live.",
      },
      {
        title: "Work effectively in remote",
        desc: "Develop the skills, tools and systems you need to work autonomously.",
      },
      {
        title: "Use AI as a professional advantage",
        desc: "Bring AI into your processes to increase speed, quality and execution capacity.",
      },
      {
        title: "Improve how you negotiate",
        desc: "Learn to analyze and defend the value of your profile in a global market.",
      },
      {
        title: "Design a more flexible career",
        desc: "Build a path that can evolve toward senior, fractional, advisory or consulting roles.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Do I need previous remote work experience?",
        a: "The program is designed for professionals who want to get ready for the remote market and build an international career.",
      },
      {
        q: "Is it only a course to find a job?",
        a: "No. The first part builds the foundations to operate in a global remote ecosystem; the second focuses specifically on landing, developing and scaling an international career.",
      },
      {
        q: "Do we work with real tools?",
        a: "Yes. The program includes walkthroughs and hands-on exercises with tools used for productivity, communication, AI, job hunting, payments and remote work.",
      },
      {
        q: "How long is each session?",
        a: "The structure is based on 4-hour teaching blocks per module.",
      },
      {
        q: "What happens after the course?",
        a: "The goal is that every module produces an asset, system, analysis or plan you can keep using after the training.",
      },
    ],
  },
  closing: {
    title: "Your career doesn't have to have borders.",
    lines: [
      "The global market is open.",
      "The question is whether your profile is ready to compete in it.",
      "Start building a global professional career.",
    ],
    cta: "I want to become a Remote Professional",
  },
};

const founderEn: CourseCopy = {
  slug: "remote-founder",
  meta: {
    title: "Remote Founder Course",
    description:
      "Build a business that can run from anywhere: 14 modules to go from a skill to a global business.",
  },
  hero: {
    eyebrow: "ActiveX Course",
    title: "Remote Founder Course",
    subtitle: "Build a business that can run from anywhere",
    lead: "Turn your experience into a global offer, win international clients and create a remote business designed to give you more freedom.",
    body: [
      "You don't need to build a huge company to build a great life.",
      "You can start with a skill. Turn it into an offer. Find clients in any market. Automate the repetitive. Delegate what you don't need to do yourself.",
      "And progressively build a business that doesn't depend on being physically in one place. The ActiveXRemote School teaches you how.",
    ],
    cta: "I want to build my remote business",
    formTitle: "Request course information.",
    facts: [
      { value: "14", label: "modules" },
      { value: "56h", label: "live" },
      { value: "7", label: "weekends" },
      { value: "9 Jan", label: "cohort starts" },
    ],
  },
  shift: {
    title: "Stop selling hours. Start building an asset.",
    body: [
      "The traditional work model has one limitation: if you stop, the income can stop with you.",
      "A well-designed remote business can work differently.",
    ],
    listLead: "You can turn your knowledge into:",
    points: [
      "Specialized services.",
      "Productized services.",
      "Consulting.",
      "An agency.",
      "Digital products.",
      "SaaS.",
      "Diversified income systems.",
    ],
    close:
      "And use technology, AI, automation and distributed talent to increase your capacity without increasing your hours proportionally. That's the shift ActiveX Remote Founder is after.",
  },
  contrast: {
    title: "Your goal isn't simply to bill more. It's to build more freedom.",
    lead: "A remote business should help you get three things:",
    highlight: "Income + autonomy + mobility",
    items: [
      "That's why the program combines business strategy with operating systems, client acquisition, AI, automation and international structure.",
    ],
  },
  audience: {
    title: "Who is this program for?",
    lead: "It's designed for people who want to build, not just work:",
    items: [
      {
        name: "Freelancers",
        desc: "If you want to stop competing on price alone and build higher-value offers.",
      },
      {
        name: "Solopreneurs",
        desc: "If you want a lean business you can run from anywhere.",
      },
      {
        name: "Consultants",
        desc: "If you want to turn your experience into premium, recurring services.",
      },
      {
        name: "Founders",
        desc: "If you want to design a company ready to operate internationally.",
      },
      {
        name: "Professionals going independent",
        desc: "If you have a marketable skill and want to turn it into a business.",
      },
    ],
  },
  build: {
    title: "What you'll build",
    lead: "During the program you'll work on the core components of a remote business.",
    items: [
      {
        name: "Your Freedom Business Model",
        desc: "You'll pick a model aligned with your skills, financial goals and desired level of freedom.",
      },
      {
        name: "Your niche and offer",
        desc: "You'll identify high-value problems and turn your experience into a concrete proposition.",
      },
      {
        name: "Your client acquisition system",
        desc: "You'll build outbound and inbound engines to generate international opportunities.",
      },
      {
        name: "Your marketing machine",
        desc: "You'll use content, authority and AI to create distribution.",
      },
      {
        name: "Your sales system",
        desc: "You'll learn to sell asynchronously and reduce your dependence on meetings.",
      },
      {
        name: "Your operating infrastructure",
        desc: "You'll document processes, create SOPs and organize delivery.",
      },
      {
        name: "Your automation system",
        desc: "You'll automate tasks and connect your tools.",
      },
      {
        name: "Your delegation strategy",
        desc: "You'll learn what to automate, what to delegate and what to keep under your control.",
      },
      {
        name: "Your international business architecture",
        desc: "You'll explore corporate structures and payment systems to operate globally.",
      },
    ],
  },
  program: {
    eyebrow: "The program",
    title: "14 modules to go from a skill to a global business",
    lead: "The first seven modules are shared and create the personal, technical, legal and operational infrastructure you need to work internationally. Then the specific track for solopreneurs, freelancers and founders begins.",
    phases: [
      {
        tag: "Phase 1",
        name: "Build your global infrastructure",
        modules: [
          {
            n: "01",
            title: "The Remote Mindset & The New Global Market",
            lead: "Stop thinking like a professional limited by a local market. Learn to position yourself as a value provider inside a global market.",
            points: [
              "The remote work economy.",
              "Personal Startup.",
              "Value-Provider Matrix.",
              "International competition.",
              "Async communication.",
              "Ownership.",
              "Autonomy.",
              "Resilience.",
            ],
            exercise: "Remote Readiness Audit and 90-day roadmap.",
          },
          {
            n: "02",
            title: "Smart Geo-Positioning & Tax Optimization",
            lead: "A global company requires understanding where you work, where you live and how your activity is structured.",
            points: [
              "Strategic location.",
              "Residency.",
              "Taxation.",
              "Cost of living.",
              "Digital Nomad Visas.",
              "International hubs.",
            ],
            exercise: "Compare three possible locations and economic scenarios.",
          },
          {
            n: "03",
            title: "The Global Relocation Blueprint",
            lead: "Design a life infrastructure that can travel with your business.",
            points: [
              "Banking.",
              "Payments.",
              "Insurance.",
              "Housing.",
              "Logistics.",
              "Security.",
              "International integration.",
            ],
            exercise: "Build your Relocation Checklist.",
          },
          {
            n: "04",
            title: "The High-Performance Remote Tech Stack",
            lead: "Your business needs digital infrastructure. The goal is an operating environment where you can run projects, knowledge, communication, payments and automations from anywhere.",
            points: [
              "Notion.",
              "Coda.",
              "ClickUp.",
              "Slack.",
              "Loom.",
              "Wise.",
              "Deel.",
              "Payoneer.",
              "Zapier.",
              "Make.",
            ],
          },
          {
            n: "05",
            title: "AI Productivity Engines",
            lead: "Make AI part of your operating team.",
            points: [
              "Research.",
              "Content creation.",
              "Synthesis.",
              "Documentation.",
              "Automation.",
              "Knowledge systems.",
              "Custom assistants.",
            ],
            exercise: "Build an AI agent adapted to a concrete professional need.",
          },
          {
            n: "06",
            title: "Life Ops: Energy & Health Management",
            lead: "The goal isn't to build a business that enslaves you. You'll design a sustainable way to operate.",
            points: [
              "Energy management.",
              "Deep work.",
              "Timeboxing.",
              "Digital boundaries.",
              "Routines.",
              "Ergonomics.",
              "Time-zone management.",
              "Community.",
            ],
            exercise: "Create your high-performance weekly system.",
          },
          {
            n: "07",
            title: "Global Legal & Compliance Fundamentals",
            lead: "Build your business on legal and operational foundations you actually understand.",
            points: [
              "Contractor vs Employee.",
              "EOR.",
              "Contracts.",
              "Invoicing.",
              "Compliance.",
              "Intellectual property.",
              "NDA.",
              "SLA.",
              "International taxation.",
            ],
            exercise: "Create a contract or professional documentation framework.",
          },
        ],
      },
      {
        tag: "Phase 2",
        name: "Global Remote Builder",
        lead: "Now build the business.",
        modules: [
          {
            n: "08",
            title: "Freedom Business Design & Market Validation",
            lead: "Before you build, validate. You'll compare business models and learn to find problems international companies are willing to pay for. You'll work the Freedom Business Canvas: niche → problem → offer → validation.",
            points: [
              "Freelance.",
              "Productized Services.",
              "Agency.",
              "SaaS.",
              "Info-products.",
            ],
            exercise: "Interview three potential buyers and validate your business hypothesis.",
          },
          {
            n: "09",
            title: "AI-Driven Business Operations & Marketing",
            lead: "Build a leaner business thanks to AI.",
            points: [
              "Lead generation.",
              "Company research.",
              "Content creation.",
              "Distribution.",
              "Asset creation.",
              "Client communication.",
              "Onboarding.",
              "Automation.",
            ],
            exercise: "Build an Automated Marketing Loop that turns an idea into content and captures new leads.",
          },
          {
            n: "10",
            title: "B2B Client Acquisition & International Sales",
            lead: "Learn to find international clients without depending exclusively on referrals.",
            points: [
              "Cold outreach.",
              "LinkedIn.",
              "Email.",
              "Upwork.",
              "Proposals.",
              "Inbound marketing.",
              "Discovery audits.",
              "Async sales.",
            ],
            exercise: "Launch a real outreach campaign with 10 potential international clients.",
          },
          {
            n: "11",
            title: "High-Converting Offers & Minimalist Landing Pages",
            lead: "A good skill isn't enough. You need an offer the market understands.",
            points: [
              "Stop selling hours alone.",
              "Design productized services.",
              "Create premium offers.",
              "Write conversion copy.",
              "Design guarantees.",
              "Build simple landing pages.",
              "Integrate payments and contracts.",
            ],
            exercise: "Publish a Minimum Viable Service Page and connect a payment system.",
          },
          {
            n: "12",
            title: "Distributed Operations Systems & SOPs",
            lead: "Growth starts when your business stops depending on your memory.",
            points: [
              "Operating systems.",
              "Dashboards.",
              "SOPs.",
              "Client portals.",
              "Workflows.",
              "Tracking systems.",
              "Margin control.",
              "Scope creep management.",
            ],
            exercise: "Build a Client Delivery Hub and document your main delivery process.",
          },
          {
            n: "13",
            title: "Automation, Delegation & Scaling Up",
            lead: "Your goal shouldn't be doing more. It should be doing fewer low-value things: automate → delegate → keep.",
            points: [
              "Advanced automations.",
              "Zapier.",
              "Make.",
              "Webhooks.",
              "Hiring freelancers.",
              "Virtual Assistants.",
              "Onboarding.",
              "Managing distributed teams.",
            ],
            exercise: "Create a Backoffice Automation Loop.",
          },
          {
            n: "14",
            title: "Borderless Corporate Formations & Asset Protection",
            lead: "When the business grows, it also needs the right corporate infrastructure.",
            points: [
              "US LLC for non-residents.",
              "Estonia e-Residency.",
              "UAE Freezone.",
              "Corporate banking.",
              "Multi-currency payments.",
              "IP protection.",
              "International compliance.",
              "Corporate structures.",
            ],
            exercise: "Complete your Corporate Entity Matrix and define the right structure for your current stage.",
          },
        ],
      },
    ],
  },
  method: {
    eyebrow: "The methodology",
    title: "Learn → build → test → automate → scale",
    lead: "Every session is designed to combine:",
    items: [
      { n: "01", title: "Strategy", desc: "Understand the market and the frameworks." },
      { n: "02", title: "Implementation", desc: "Build tools and systems live." },
      { n: "03", title: "Real cases", desc: "Work on concrete business situations." },
      { n: "04", title: "Action", desc: "Finish every module knowing exactly what to implement next." },
    ],
    note: "The structure combines theory, technical walkthroughs, workshops and a closing session of questions and actions.",
  },
  system: {
    title: "Your remote business starts with a skill.",
    lead: ["But it doesn't end there."],
    chain: [
      "Skill",
      "Niche",
      "Offer",
      "Clients",
      "Systems",
      "Automation",
      "Delegation",
      "Scale",
      "Freedom",
    ],
    close: "ActiveX Remote Founder is designed to walk you through that process.",
  },
  enroll: {
    eyebrow: "Cohort",
    title: "Starts 9 January 2027",
    lead: "7 weekends, until 21 February: two 4-hour live classes every weekend, in groups of 25 seats.",
    items: [
      "14 live modules (56 teaching hours)",
      "Virtual campus with recordings and narrated audio",
      "Downloadable frameworks and templates",
      "Exercise and feedback in every module",
      "Community and follow-up on Slack",
      "An ActiveXRemote diploma listing the modules you completed",
    ],
    cta: "Request information",
  },
  outcomes: {
    title: "What can you achieve?",
    items: [
      {
        title: "Reach international clients",
        desc: "Build a commercial strategy that doesn't depend exclusively on your local market.",
      },
      {
        title: "Create higher-value offers",
        desc: "Learn to package your experience into services and solutions that can sell internationally.",
      },
      {
        title: "Automate operations",
        desc: "Use AI and no-code to cut administrative and repetitive work.",
      },
      {
        title: "Create systems",
        desc: "Document processes so the business is easier to run and scale.",
      },
      {
        title: "Delegate",
        desc: "Learn to bring in distributed collaborators without losing control over quality.",
      },
      {
        title: "Design geographic freedom",
        desc: "Build a business compatible with a more flexible, mobile life.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Do I have to be an entrepreneur to take this program?",
        a: "It's specifically designed for freelancers, solopreneurs, founders and professionals who want to build a remote business.",
      },
      {
        q: "Do I need to already have a business?",
        a: "Not necessarily. A significant part of the program is dedicated to choosing a model, identifying a niche and validating an opportunity before building infrastructure.",
      },
      {
        q: "Can I use AI without a technical background?",
        a: "The program is oriented toward the practical application of AI and automation tools inside business processes.",
      },
      {
        q: "Do we work on my own business?",
        a: "The structure includes exercises on application, validation, offer building, client acquisition, operations and automation to put the concepts into practice.",
      },
      {
        q: "Does the program only teach marketing?",
        a: "No. The track covers the whole business: model, validation, client acquisition, offer, sales, operations, SOPs, automation, delegation and international corporate structures.",
      },
    ],
  },
  closing: {
    title: "Don't build a business that forces you to always be present.",
    lines: [
      "Build a business designed to give you freedom.",
      "The market is global. Your clients can be anywhere. Your team can be anywhere. Your business can be too.",
      "Start building your Global Remote Business.",
    ],
    cta: "I want to be an ActiveX Remote Founder",
  },
};

export const courseCopy: Record<Locale, Record<CourseSlug, CourseCopy>> = {
  es: { "remote-professional": professionalEs, "remote-founder": founderEs },
  en: { "remote-professional": professionalEn, "remote-founder": founderEn },
};
