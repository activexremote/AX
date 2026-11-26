import type { Locale } from "@/lib/i18n/config";
import type { CourseIcon } from "@/components/landing/course-icons";

// ══════════════════════════════════════════════════════════
//  Contenido de las dos landings de curso, formato 2.0 (nov. 2026).
//
//  Professional pasa a 8 semanas y Founder a 13, una semana por módulo y sin
//  módulos compartidos. Cada semana: material previo, 6 vídeos de 30 min,
//  una clase en directo de 2 h, ejercicio sobre el caso propio y un test.
//  Es el mismo contenido que los dosieres comerciales en PDF: si cambia uno,
//  cambia el otro.
//
//  ⚠︎ Nada de testimonios, cifras de alumnos ni nombres de docentes sin
//  confirmar. Sin precios en la web, a petición del equipo: los da admisiones.
// ══════════════════════════════════════════════════════════

export type CourseSlug = "remote-professional" | "remote-founder";

export type CourseWeek = {
  n: number;
  icon: CourseIcon;
  /** Índice de la fase en `roadmap.phases`. */
  phase: number;
  title: string;
  /** El hito: lo que tienes hecho al acabar la semana. */
  milestone: string;
  lead: string;
  keeps: string[];
};

export type CourseCopy = {
  slug: CourseSlug;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** El titular se parte en dos para resaltar el final («en 8 semanas.»). */
    title: string;
    titleHighlight: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    commitment: string;
    formTitle: string;
    facts: { value: string; label: string; icon: CourseIcon }[];
  };
  promise: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: { icon: CourseIcon; title: string; sub: string }[];
    /** Peldaños de la escalera de ingresos (sólo Founder). */
    ladder?: string[];
    note: string;
  };
  roadmap: {
    eyebrow: string;
    title: string;
    lead: string;
    week0: { label: string; body: string };
    weekLabel: string;
    keepsLabel: string;
    phases: { name: string; weeks: string }[];
    weeks: CourseWeek[];
    demo?: { title: string; body: string };
    finish: { title: string; body: string; cta: string };
  };
  learn: {
    eyebrow: string;
    title: string;
    lead: string;
    week: { title: string; total: string; perWeek: string; parts: { h: number; label: string; icon: CourseIcon }[]; note: string };
    videos: { title: string; items: string[] };
    live: { title: string; parts: { min: number; label: string }[]; note: string };
    ai: { title: string; items: string[]; note: string };
    clinics?: { title: string; weeks: number[]; length: string; note: string };
    pod: { title: string; body: string; items: string[] };
  };
  audience: { eyebrow: string; title: string; lead: string; items: { name: string; desc: string }[] };
  kit: { title: string; lead: string; items: { icon: CourseIcon; label: string }[] };
  salaries?: { title: string; cols: string[]; rows: string[][]; note: string };
  flows?: { title: string; lead: string; items: { title: string; nodes: { icon: CourseIcon; label: string }[] }[]; note: string };
  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    includes: string[];
    cta: string;
    guarantees: { icon: CourseIcon; label: string }[];
    help: { lead: string; cta: string };
  };
  faq: { title: string; items: { q: string; a: string }[] };
  closing: { title: string; lines: string[]; cta: string };
};

// ── ES · Remote Professional ───────────────────────────────
const professionalEs: CourseCopy = {
  slug: "remote-professional",
  meta: {
    title: "Remote Professional · Consigue tu empleo remoto internacional en 8 semanas",
    description:
      "Curso online en directo de 8 semanas: decides qué buscas, haces que te encuentren, superas la entrevista, firmas el contrato adecuado y empiezas con la IA de tu lado.",
  },
  hero: {
    eyebrow: "Remote Professional · Career Accelerator",
    title: "Consigue tu empleo remoto internacional",
    titleHighlight: "en 8 semanas.",
    lead: "Un método paso a paso, en el orden en que lo vas a vivir: decides qué buscas, haces que te encuentren, firmas el contrato adecuado y empiezas con la IA de tu lado.",
    ctaPrimary: "Reserva tu plaza",
    ctaSecondary: "Ver la hoja de ruta",
    commitment: "Unas 12,5 h a la semana. Compatible con tu trabajo actual.",
    formTitle: "Reserva tu plaza o pide información.",
    facts: [
      { value: "8", label: "semanas", icon: "calendario" },
      { value: "16 h", label: "en directo", icon: "directo" },
      { value: "24 h", label: "de vídeo", icon: "video" },
      { value: "8", label: "herramientas de IA", icon: "chispa" },
    ],
  },
  promise: {
    eyebrow: "Lo que te llevas",
    title: "Sales con el trabajo hecho, no con apuntes.",
    lead: "Cada semana termina con algo que ya puedes usar en tu búsqueda real: un CV, unas alertas, una entrevista ensayada o un contrato que entiendes.",
    cards: [
      { icon: "iman", title: "Te encuentran", sub: "CV y LinkedIn listos" },
      { icon: "micro", title: "Entrevista superada", sub: "Oferta negociada" },
      { icon: "contrato", title: "Contrato firmado", sub: "En regla en cualquier país" },
    ],
    note: "Los ejercicios se hacen sobre tu objetivo real, no sobre un caso inventado.",
  },
  roadmap: {
    eyebrow: "Tu hoja de ruta",
    title: "8 semanas, 8 hitos. Cada semana desbloqueas una habilidad.",
    lead: "El orden sigue tu calendario real: decides, te encuentran, te contratan, firmas y empiezas.",
    week0: {
      label: "Semana 0.",
      body: "Te presentas a tu grupo en Slack y conoces a tu pod antes de la primera clase.",
    },
    weekLabel: "Semana",
    keepsLabel: "Lo que te llevas",
    phases: [
      { name: "Decides", weeks: "Semana 1" },
      { name: "Te encuentran", weeks: "Semanas 2–3" },
      { name: "Te contratan", weeks: "Semanas 4–5" },
      { name: "Empiezas y te asientas", weeks: "Semanas 6–8" },
    ],
    weeks: [
      {
        n: 1,
        icon: "brujula",
        phase: 0,
        title: "Deja el trayecto, no tu carrera",
        milestone: "Tu objetivo remoto a 90 días",
        lead: "Eliges el nivel de trabajo remoto y el estilo de vida que encajan contigo, partiendo de un punto de partida medido.",
        keeps: [
          "Starting Point Test y tu nivel de habilidades remotas",
          "Los 5 niveles del trabajo remoto",
          "Tu objetivo remoto a 90 días",
          "Tu asistente personal de IA",
        ],
      },
      {
        n: 2,
        icon: "iman",
        phase: 1,
        title: "Deja de enviar currículums. Haz que te busquen",
        milestone: "CV y LinkedIn que atraen reclutadores",
        lead: "Apuntas a los puestos remotos que encajan con tu perfil y consigues que los reclutadores vengan a ti.",
        keeps: [
          "Test de encaje con el puesto",
          "CV remoto y LinkedIn reescritos",
          "Directorio de portales de empleo y plataformas freelance",
          "Seguimiento de candidaturas y primeros mensajes de contacto",
        ],
      },
      {
        n: 3,
        icon: "radar",
        phase: 1,
        title: "Tu buscador con IA no duerme",
        milestone: "Búsqueda automática en marcha",
        lead: "Montas una búsqueda que encuentra vacantes y te prepara las candidaturas mientras tú haces otra cosa.",
        keeps: [
          "Alertas diarias de empleo y de noticias del sector",
          "Asistente de IA que adapta tu CV a cada oferta",
          "Biblioteca de prompts",
        ],
      },
      {
        n: 4,
        icon: "micro",
        phase: 2,
        title: "Gana la entrevista y pon tu precio",
        milestone: "Entrevista superada, oferta negociada",
        lead: "Superas entrevistas en vídeo y evaluadas con IA, y negocias la oferta entera, no solo el sueldo.",
        keeps: [
          "Checklist para preparar la entrevista",
          "Simulador de entrevistas con IA",
          "Banco de objeciones y guion de negociación",
          "«¿Qué contrato es esta oferta?»",
        ],
      },
      {
        n: 5,
        icon: "contrato",
        phase: 2,
        title: "Cobra desde cualquier país, en regla",
        milestone: "Contrato y fiscalidad bajo control",
        lead: "Lees cualquier oferta remota y sabes qué contrato y qué situación fiscal te crea: EOR, empleado, contractor o autónomo.",
        keeps: [
          "Comparador de tipos de contrato",
          "Checklist de residencia fiscal",
          "Calculadora de sueldo neto",
          "Señales de alarma en un contrato",
        ],
      },
      {
        n: 6,
        icon: "chispa",
        phase: 3,
        title: "La IA como ayudante, no como sustituta",
        milestone: "Tus primeros 90 días, con IA",
        lead: "Superas el periodo de prueba, te haces visible en remoto y dejas a la IA la mitad repetitiva del trabajo.",
        keeps: [
          "Plan de confianza a 90 días",
          "Informe semanal de impacto",
          "Kit de IA para tu trabajo",
          "Plan de habilidades a prueba de IA y plantilla para pedir un ascenso",
        ],
      },
      {
        n: 7,
        icon: "avion",
        phase: 3,
        title: "Elige país y viaja ligero",
        milestone: "Destino y visado elegidos",
        lead: "Eliges destino y visado, y te mudas sin perder dinero ni datos por el camino.",
        keeps: [
          "Test «Encuentra tu destino» y lista de visados",
          "Checklist de mudanza, de 90 días antes a 30 después",
          "Checklist de ciberseguridad en viaje",
          "Cuentas multidivisa y de ahorro",
        ],
      },
      {
        n: 8,
        icon: "personas",
        phase: 3,
        title: "Sin soledad y sin quemarte",
        milestone: "Red y rutina que se sostienen",
        lead: "Construyes una red y una comunidad vivas donde vivas, y una rutina que puedes mantener.",
        keeps: [
          "CRM de networking",
          "Plan de comunidad en 3 capas",
          "Rutina semanal de energía y límites",
          "Tu puntuación de habilidades, antes y después",
        ],
      },
    ],
    finish: {
      title: "Semana 8 · Graduación.",
      body: "Presentas tu perfil remoto en 60 segundos y sales con el diploma de ActiveXRemote y tu kit completo.",
      cta: "Quiero empezar",
    },
  },
  learn: {
    eyebrow: "Cómo aprendes",
    title: "La teoría, antes y en vídeo. El directo, para practicar.",
    lead: "Todas las semanas siguen el mismo ritmo, así que siempre sabes qué toca y cuándo.",
    week: {
      title: "Tu semana tipo",
      total: "12,5 h",
      perWeek: "por semana",
      parts: [
        { h: 3.5, label: "Material previo", icon: "libro" },
        { h: 3, label: "6 vídeos de 30 min", icon: "video" },
        { h: 2, label: "Clase en directo", icon: "directo" },
        { h: 3.5, label: "Ejercicio sobre tu caso", icon: "lapiz" },
        { h: 0.5, label: "Test de 20 preguntas", icon: "test" },
      ],
      note: "Vídeos y material, a tu ritmo. La clase en directo, un día fijo entre semana, y queda grabada.",
    },
    videos: {
      title: "Los 6 vídeos de cada semana",
      items: [
        "El tema a fondo",
        "Un caso real, con lo que salió mal",
        "El método, paso a paso",
        "La herramienta, construida en pantalla",
        "Antes y después: errores corregidos",
        "Tus próximos 30 días",
      ],
    },
    live: {
      title: "Una clase en directo de 2 horas",
      parts: [
        { min: 5, label: "Pulso" },
        { min: 25, label: "3 mitos" },
        { min: 30, label: "Historias reales" },
        { min: 10, label: "Quiz" },
        { min: 30, label: "El ejercicio, en directo" },
        { min: 20, label: "Preguntas" },
      ],
      note: "El pulso abre con tu encuesta previa y el quiz son tres preguntas en directo. Los mitos y las historias se trabajan con casos reales del docente, también los que salieron mal.",
    },
    ai: {
      title: "Una herramienta de IA cada semana",
      items: [
        "Asistente personal",
        "CV y LinkedIn con IA",
        "Alertas automáticas",
        "Simulador de entrevistas",
        "Lector de contratos",
        "Kit de IA para el trabajo",
        "Planificador de mudanza",
        "Revisión semanal",
      ],
      note: "Llegas a un mercado lleno de IA con la IA de tu lado, siguiendo la política de tu empresa y revisando cada resultado.",
    },
    pod: {
      title: "Nunca buscas en soledad",
      body: "Tu pod de 4–5 personas, fijo las 8 semanas y agrupado por zona horaria y objetivo. Revisáis los ejercicios entre vosotros, compartís ofertas en un canal común y seguís conectados en la comunidad de antiguos alumnos.",
      items: ["Rituales semanales en Slack", "Café a ciegas con el grupo", "Canal de ofertas compartidas", "Comunidad alumni para siempre"],
    },
  },
  audience: {
    eyebrow: "Para quién es",
    title: "Si quieres trabajar en remoto para fuera, es para ti.",
    lead: "No hace falta experiencia previa en remoto. Sí hace falta una profesión y ganas de dedicarle unas 12,5 h a la semana.",
    items: [
      {
        name: "Quieres trabajar para empresas internacionales",
        desc: "Y dejar de limitar tus oportunidades a las empresas que contratan donde vives.",
      },
      {
        name: "Tienes experiencia, pero nunca has trabajado en remoto",
        desc: "Necesitas adaptar tu perfil, tu búsqueda y tus entrevistas al mercado remoto.",
      },
      {
        name: "Ya trabajas por tu cuenta",
        desc: "Y quieres acceder a contratos internacionales de más valor, en regla.",
      },
      {
        name: "Quieres cobrar lo que vales",
        desc: "Aprender a valorar tu perfil en un mercado global y negociar la oferta entera.",
      },
    ],
  },
  kit: {
    title: "Te llevas más de 30 herramientas listas para usar",
    lead: "Plantillas, calculadoras y asistentes de IA que sigues usando cuando acaba el curso.",
    items: [
      { icon: "brujula", label: "Starting Point Test y objetivo a 90 días" },
      { icon: "iman", label: "CV remoto y LinkedIn reescritos" },
      { icon: "radar", label: "Alertas diarias de empleo con IA" },
      { icon: "micro", label: "Simulador de entrevistas con IA" },
      { icon: "grafica", label: "Guion de negociación salarial" },
      { icon: "contrato", label: "Comparador de contratos y calculadora de neto" },
      { icon: "chispa", label: "Kit de IA para tu trabajo" },
      { icon: "calendario", label: "Plan de confianza a 90 días" },
      { icon: "maleta", label: "Checklist de mudanza" },
      { icon: "escudo", label: "Checklist de ciberseguridad" },
      { icon: "personas", label: "CRM de networking" },
      { icon: "reloj", label: "Rutina de energía y límites" },
    ],
  },
  salaries: {
    title: "El mismo puesto, otro mercado",
    cols: ["Sueldo medio anual", "España", "Reino Unido", "EE. UU."],
    rows: [
      ["Product Manager", "45.000 €", "£63.126", "$151.317"],
      ["Product Marketing Manager", "48.000 €", "£63.157", "$141.190"],
      ["Sales Development Rep.", "33.000 €", "£39.680", "$103.886"],
    ],
    note: "Medias públicas de Glassdoor, sept. 2026, en moneda local. Son sueldos de mercado, no una promesa de lo que vas a ganar.",
  },
  pricing: {
    eyebrow: "Reserva tu plaza",
    title: "Empieza ahora. En 8 semanas, estás dentro.",
    lead: "Todo incluido. Déjanos tus datos y admisiones te cuenta precio, formas de pago y próxima convocatoria.",
    includes: [
      "8 clases en directo y sus grabaciones",
      "48 vídeos (24 h) y todo el material",
      "Más de 30 plantillas y herramientas",
      "Ejercicios con rúbrica y tests",
      "Tu pod y la comunidad en Slack",
      "Diploma de ActiveXRemote",
    ],
    cta: "Quiero reservar mi plaza",
    guarantees: [
      { icon: "escudo", label: "Pago seguro con Stripe" },
      { icon: "tarjeta", label: "Factura de cada pago" },
      { icon: "calendario", label: "14 días de desistimiento" },
    ],
    help: { lead: "¿Dudas? Te responde admisiones en menos de 24 h laborables.", cta: "Habla con admisiones" },
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Cuánto tiempo necesito a la semana?",
        a: "Unas 12,5 horas: 3,5 h de material previo, 3 h de vídeo, la clase en directo de 2 h, 3,5 h de ejercicio y un test de 20 preguntas. Es un compromiso real si trabajas a jornada completa, pero todo menos la clase se hace a tu ritmo.",
      },
      {
        q: "¿Y si no puedo ir a una clase en directo?",
        a: "Todas las clases quedan grabadas en el campus. Es un día fijo entre semana para que puedas organizarte, y el ejercicio se entrega antes de la clase siguiente.",
      },
      {
        q: "¿Necesito experiencia previa en trabajo remoto?",
        a: "No. La semana 1 parte de un test que mide desde dónde empiezas, y las plataformas freelance de la semana 2 sirven de puente si nunca has trabajado en remoto.",
      },
      {
        q: "¿Es solo un curso para encontrar trabajo?",
        a: "No. Además de la búsqueda y la entrevista, cubre lo que casi ningún curso toca: qué contrato y qué fiscalidad te crea una oferta, cómo superar los primeros 90 días con IA, cómo mudarte de país y cómo no quemarte trabajando en remoto.",
      },
      {
        q: "¿Se puede pagar a plazos?",
        a: "Sí: puedes pagarlo de una vez o en cuotas mensuales con tarjeta, y cada pago lleva su factura. Admisiones te da el detalle.",
      },
      {
        q: "¿Qué tiene que ver Deel con el curso?",
        a: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner, y Deel ha acreditado los contenidos sobre compensación, contratos y fiscalidad, onboarding en equipos distribuidos y visados que se trabajan en las semanas 4 a 7.",
      },
    ],
  },
  closing: {
    title: "Tu carrera no tiene por qué tener fronteras.",
    lines: [
      "Déjanos tus datos y te ayudamos a reservar tu plaza.",
      "Si tienes dudas, admisiones te llama y te las resuelve antes de pagar nada.",
    ],
    cta: "Quiero reservar mi plaza",
  },
};

// ── ES · Remote Founder ────────────────────────────────────
const founderEs: CourseCopy = {
  slug: "remote-founder",
  meta: {
    title: "Remote Founder · Construye un negocio que vende fuera en 13 semanas",
    description:
      "Curso online en directo de 13 semanas: validas, pones precio, consigues clientes internacionales, automatizas y constituyes tu empresa.",
  },
  hero: {
    eyebrow: "Remote Founder · Global Builder",
    title: "Construye un negocio que vende fuera",
    titleHighlight: "en 13 semanas.",
    lead: "Validado, con precio, vendiendo y constituido. Cada ejercicio se hace sobre tu propio negocio, así que en la semana 13 no sales con apuntes: sales con una empresa en marcha.",
    ctaPrimary: "Reserva tu plaza",
    ctaSecondary: "Ver la hoja de ruta",
    commitment: "Unas 12,5 h a la semana, sobre tu propio negocio.",
    formTitle: "Reserva tu plaza o pide información.",
    facts: [
      { value: "13", label: "semanas", icon: "calendario" },
      { value: "26 h", label: "en directo", icon: "directo" },
      { value: "39 h", label: "de vídeo", icon: "video" },
      { value: "13", label: "herramientas de IA", icon: "chispa" },
    ],
  },
  promise: {
    eyebrow: "Lo que te llevas",
    title: "Más ingresos, sin vender más horas.",
    lead: "Subes la escalera de un negocio remoto: de vender tu tiempo a vender un servicio productizado, y de ahí a productos que no dependen de tu agenda.",
    cards: [
      { icon: "chat", title: "Validado", sub: "3 compradores reales" },
      { icon: "euro", title: "Primer cobro", sub: "Tu página ya vende" },
      { icon: "edificio", title: "Empresa constituida", sub: "En regla en cualquier país" },
    ],
    ladder: ["Freelance", "Servicio productizado", "Producto digital", "Software"],
    note: "No hace falta tener ya un negocio: puedes empezar con una idea o con una habilidad que ya vendes.",
  },
  roadmap: {
    eyebrow: "Tu hoja de ruta",
    title: "13 semanas, 13 hitos. De la idea a una empresa que vende.",
    lead: "El orden sigue el de un negocio real: construyes la oferta, consigues clientes, ordenas la operación y escalas.",
    week0: {
      label: "Semana 0.",
      body: "Presentas tu idea o tu negocio a tu grupo en Slack y conoces a tu mastermind antes de la primera clase.",
    },
    weekLabel: "Semana",
    keepsLabel: "Lo que te llevas",
    phases: [
      { name: "Construye la oferta", weeks: "Semanas 1–5" },
      { name: "Consigue clientes", weeks: "Semanas 6–9" },
      { name: "Opera y protege", weeks: "Semanas 10–12" },
      { name: "Escala", weeks: "Semana 13" },
    ],
    weeks: [
      {
        n: 1,
        icon: "escalera",
        phase: 0,
        title: "De la nómina a tu propia empresa",
        milestone: "Modelo elegido y objetivo de ingresos a 90 días",
        lead: "Eliges el modelo de negocio que encaja contigo, partiendo de un punto de partida medido.",
        keeps: [
          "Founder Starting Point Test",
          "La escalera de modelos: freelance, servicio productizado, producto digital y software",
          "Objetivo de ingresos a 90 días",
          "Tu cofundador personal con IA",
        ],
      },
      {
        n: 2,
        icon: "diana",
        phase: 0,
        title: "Un problema por el que paguen",
        milestone: "Un nicho que paga y unos números que cuadran",
        lead: "Diseñas un negocio remoto de margen alto alrededor de un nicho que paga.",
        keeps: [
          "Freedom Business Canvas",
          "Puntuación de nichos",
          "Calculadora «¿cuántos clientes necesito?»",
          "Asistente de IA para estudiar el mercado",
        ],
      },
      {
        n: 3,
        icon: "chat",
        phase: 0,
        title: "Véndelo antes de construirlo",
        milestone: "3 entrevistas con compradores reales",
        lead: "Consigues pruebas de compradores reales antes de gastar un euro en construir nada.",
        keeps: ["Guion de validación", "3 entrevistas con compradores reales", "Página de preventa", "Decisión «seguir o parar» con puntuación"],
      },
      {
        n: 4,
        icon: "paquete",
        phase: 0,
        title: "Empaquétalo con precio premium",
        milestone: "Tu oferta, con 3 niveles de precio",
        lead: "Conviertes lo que sabes en una oferta productizada con un precio que se sostiene.",
        keeps: [
          "Matriz de servicio productizado",
          "Calculadora de precio por valor en 3 niveles",
          "Tu oferta en una página",
          "Crítico de tu oferta con IA",
        ],
      },
      {
        n: 5,
        icon: "cohete",
        phase: 0,
        title: "Lanza en un fin de semana, sin código",
        milestone: "Una página publicada que ya cobra",
        lead: "Publicas una página o un MVP de servicio que vende y cobra.",
        keeps: ["Página de servicio publicada", "Enlace de pago con Stripe o Wise", "MVP sin código con Lovable o Bolt", "Dominio y correo profesional"],
      },
      {
        n: 6,
        icon: "chispa",
        phase: 1,
        title: "Tu equipo de marketing con IA",
        milestone: "Contenido y captación con IA, con tu voz",
        lead: "Llevas el marketing, la captación y la atención al cliente con IA que mantiene tu voz.",
        keeps: [
          "Matriz de agentes de IA",
          "De una idea a 3 posts",
          "Formulario de captación conectado a tu seguimiento",
          "FAQ de atención con IA y checklist de calidad",
        ],
      },
      {
        n: 7,
        icon: "globo",
        phase: 1,
        title: "Clientes fuera, sin salir de casa",
        milestone: "10 prospectos internacionales verificados",
        lead: "Construyes un pipeline que trae clientes B2B internacionales.",
        keeps: [
          "Perfil de cliente ideal",
          "10 prospectos verificados",
          "Secuencias de contacto y seguimiento",
          "Perfil optimizado en LinkedIn, Upwork o Contra, y tu CRM",
        ],
      },
      {
        n: 8,
        icon: "apreton",
        phase: 1,
        title: "Cierra la venta sin presionar",
        milestone: "Propuesta y contrato listos para firmar",
        lead: "Conviertes conversaciones en contratos firmados y pagados.",
        keeps: [
          "Pipeline de ventas asíncrono",
          "Guion de llamada de descubrimiento",
          "Plantilla de propuesta y banco de objeciones",
          "Señales de alarma en contratos con clientes",
        ],
      },
      {
        n: 9,
        icon: "megafono",
        phase: 1,
        title: "Que los clientes pregunten por ti",
        milestone: "Newsletter publicada y 5 piezas programadas",
        lead: "Construyes autoridad pública para que los clientes vengan a ti.",
        keeps: [
          "Plan de autoridad: tema, canal y frecuencia",
          "5 primeras piezas programadas",
          "Newsletter publicada",
          "Flujo de reciclaje de contenido con IA",
        ],
      },
      {
        n: 10,
        icon: "engranaje",
        phase: 2,
        title: "Entrega como una empresa",
        milestone: "SOPs, hub de cliente y margen por proyecto",
        lead: "Entregas con calidad constante sin estar en cada mensaje, y sabes el margen de cada proyecto.",
        keeps: ["Arquitectura de SOPs", "Hub de entrega para clientes", "Plantilla de proyecto y panel de márgenes", "Stack remoto: Notion, Slack y Loom"],
      },
      {
        n: 11,
        icon: "rayo",
        phase: 2,
        title: "Automatiza el back office y delega",
        milestone: "Back office automatizado y primera contratación",
        lead: "Liberas horas con automatización y haces bien tu primera contratación, aunque esté en otro país.",
        keeps: [
          "Matriz de delegación",
          "Back office automatizado: formulario, carpeta, contrato y seguimiento",
          "Scorecard de contratación",
          "Contrato de contractor y pagos internacionales",
        ],
      },
      {
        n: 12,
        icon: "edificio",
        phase: 2,
        title: "Constituye en cualquier país, en regla",
        milestone: "Estructura societaria y fiscal elegida",
        lead: "Eliges la estructura societaria y fiscal que toca a tu negocio y la mantienes en regla.",
        keeps: [
          "Comparativa de sociedades a 3 años: LLC en EE. UU., e-Residency en Estonia, zona franca en EAU o tu país",
          "Fórmula de ingreso neto",
          "Checklist de residencia fiscal y plantilla de factura",
          "Calendario de obligaciones",
        ],
      },
      {
        n: 13,
        icon: "estrella",
        phase: 3,
        title: "Escala hacia la libertad, no al burnout",
        milestone: "Plan a 12 meses y tu pitch en el Demo Day",
        lead: "Planificas el siguiente escalón de ingresos sin vender más horas, con una rutina que puedes sostener.",
        keeps: ["Plan de escalera de ingresos a 12 meses", "Revisión semanal de CEO con IA", "Rutina de energía y límites", "Tu pitch del Demo Day"],
      },
    ],
    demo: {
      title: "Demo Day",
      body: "Presentas tu negocio en 90 segundos ante antiguos alumnos y empresas invitadas.",
    },
    finish: {
      title: "Al terminar:",
      body: "un negocio validado, con precio, vendiendo y constituido, y el diploma de ActiveXRemote.",
      cta: "Quiero empezar",
    },
  },
  learn: {
    eyebrow: "Cómo aprendes",
    title: "La teoría, antes y en vídeo. El directo, para trabajar tu negocio.",
    lead: "Todas las semanas siguen el mismo ritmo, y el ejercicio es siempre sobre tu negocio: trabajo que harías igualmente, pero con método.",
    week: {
      title: "Tu semana tipo",
      total: "12,5 h",
      perWeek: "por semana",
      parts: [
        { h: 3.5, label: "Material previo", icon: "libro" },
        { h: 3, label: "6 vídeos de 30 min", icon: "video" },
        { h: 2, label: "Clase en directo", icon: "directo" },
        { h: 3.5, label: "Ejercicio sobre tu negocio", icon: "lapiz" },
        { h: 0.5, label: "Test de 20 preguntas", icon: "test" },
      ],
      note: "Vídeos y material, a tu ritmo. La clase en directo, un día fijo entre semana, y queda grabada.",
    },
    videos: {
      title: "Los 6 vídeos de cada semana",
      items: [
        "El tema a fondo",
        "Un negocio real, con lo que salió mal",
        "El método, paso a paso",
        "La herramienta, construida en pantalla",
        "Antes y después: errores corregidos",
        "Tus próximos 30 días",
      ],
    },
    live: {
      title: "Una clase en directo de 2 horas",
      parts: [
        { min: 5, label: "Pulso" },
        { min: 25, label: "3 mitos" },
        { min: 30, label: "Historias reales" },
        { min: 10, label: "Quiz" },
        { min: 30, label: "El ejercicio, en directo" },
        { min: 20, label: "Preguntas" },
      ],
      note: "El pulso abre con tu encuesta previa y el quiz son tres preguntas en directo. Las historias son de negocios reales del docente, también los que salieron mal.",
    },
    ai: {
      title: "Una herramienta de IA cada semana",
      items: [
        "Cofundador con IA",
        "Estudio de mercado",
        "Síntesis de entrevistas",
        "Crítico de tu oferta",
        "MVP sin código",
        "Equipo de marketing",
        "Prospección verificada",
        "Propuestas",
        "Reciclaje de contenido",
        "SOPs desde un vídeo",
        "Back office encadenado",
        "Comparador de sociedades",
        "Revisión semanal de CEO",
      ],
      note: "Sales con un negocio que funciona con IA, no con uno que la IA deja obsoleto. Con una regla: hay una persona revisando donde hay dinero o contratos.",
    },
    clinics: {
      title: "Clínicas con los fundadores",
      weeks: [4, 8, 12],
      length: "90 min",
      note: "Tres sesiones en directo con los fundadores de ActiveXRemote. Cuatro o cinco personas ponen su negocio en el centro y todo el grupo aprende de cada caso.",
    },
    pod: {
      title: "Tu mastermind: tu consejo de administración",
      body: "Un grupo fijo de 4–5 founders durante 13 semanas, agrupados por zona horaria y fase del negocio. Os revisáis los ejercicios, os pasáis clientes y proveedores, y seguís conectados en la comunidad de antiguos alumnos.",
      items: ["Objetivos y logros en Slack", "Café a ciegas con el grupo", "Canal de referidos", "Comunidad alumni para siempre"],
    },
  },
  audience: {
    eyebrow: "Para quién es",
    title: "Para quien quiere construir, no solo trabajar.",
    lead: "Puedes llegar con una idea, con una habilidad que ya vendes o con un negocio que no despega. Hace falta dedicarle unas 12,5 h a la semana.",
    items: [
      { name: "Freelancers", desc: "Que quieren dejar de competir por precio y vender ofertas de más valor." },
      { name: "Consultores y expertos", desc: "Que quieren convertir su experiencia en un servicio productizado y recurrente." },
      { name: "Profesionales que quieren independizarse", desc: "Con una habilidad que se puede vender y ganas de convertirla en un negocio." },
      { name: "Fundadores", desc: "Que quieren una empresa preparada para vender y operar fuera desde el primer día." },
    ],
  },
  kit: {
    title: "Te llevas más de 60 herramientas para tu negocio",
    lead: "Plantillas, calculadoras y agentes de IA montados sobre tu propio negocio, que siguen funcionando cuando acaba el curso.",
    items: [
      { icon: "diana", label: "Freedom Business Canvas" },
      { icon: "chat", label: "Guion de validación con compradores" },
      { icon: "euro", label: "Calculadora de precio en 3 niveles" },
      { icon: "cohete", label: "Página de servicio y enlace de pago" },
      { icon: "chispa", label: "Equipo de agentes de IA de marketing" },
      { icon: "globo", label: "CRM de clientes internacionales" },
      { icon: "apreton", label: "Plantilla de propuesta y banco de objeciones" },
      { icon: "megafono", label: "Plan de autoridad y newsletter" },
      { icon: "engranaje", label: "Arquitectura de SOPs y panel de márgenes" },
      { icon: "rayo", label: "Matriz de delegación y back office automatizado" },
      { icon: "edificio", label: "Comparativa de sociedades a 3 años" },
      { icon: "estrella", label: "Plan de crecimiento a 12 meses" },
    ],
  },
  flows: {
    title: "La IA que lleva tu negocio",
    lead: "En las semanas 6 y 11 montas dos sistemas que trabajan para ti desde el día siguiente.",
    items: [
      {
        title: "Semana 6 · Marketing",
        nodes: [
          { icon: "chispa", label: "Idea" },
          { icon: "megafono", label: "3 posts con tu voz" },
          { icon: "chat", label: "Formulario" },
          { icon: "correo", label: "Seguimiento" },
        ],
      },
      {
        title: "Semana 11 · Back office",
        nodes: [
          { icon: "chat", label: "Formulario" },
          { icon: "contrato", label: "Contrato" },
          { icon: "grafica", label: "Seguimiento" },
          { icon: "euro", label: "Factura" },
        ],
      },
    ],
    note: "Con un control humano donde hay dinero o contratos, y alertas para que ninguna automatización falle sin avisar.",
  },
  pricing: {
    eyebrow: "Reserva tu plaza",
    title: "Empieza ahora. En 13 semanas, tu negocio vende fuera.",
    lead: "Todo incluido. Déjanos tus datos y admisiones te cuenta precio, formas de pago y próxima convocatoria.",
    includes: [
      "13 clases en directo y sus grabaciones",
      "78 vídeos (39 h) y todo el material",
      "3 clínicas con los fundadores",
      "Más de 60 plantillas y herramientas",
      "Tu mastermind y la comunidad en Slack",
      "Demo Day y diploma de ActiveXRemote",
    ],
    cta: "Quiero reservar mi plaza",
    guarantees: [
      { icon: "escudo", label: "Pago seguro con Stripe" },
      { icon: "tarjeta", label: "Factura de cada pago" },
      { icon: "calendario", label: "14 días de desistimiento" },
    ],
    help: { lead: "¿Dudas? Te responde admisiones en menos de 24 h laborables.", cta: "Habla con admisiones" },
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Necesito tener ya un negocio?",
        a: "No. Las semanas 1 a 3 sirven para elegir el modelo, encontrar un nicho que paga y validarlo con compradores reales antes de construir nada. Si ya tienes un negocio, lo trabajas sobre ese.",
      },
      {
        q: "¿Cuánto tiempo necesito a la semana?",
        a: "Unas 12,5 horas: 3,5 h de material previo, 3 h de vídeo, la clase en directo de 2 h, 3,5 h de ejercicio y un test. El ejercicio es siempre sobre tu negocio, así que es trabajo que harías igualmente.",
      },
      {
        q: "¿Y si no puedo ir a una clase en directo?",
        a: "Todas las clases quedan grabadas en el campus. Es un día fijo entre semana para que puedas organizarte.",
      },
      {
        q: "¿Necesito saber programar?",
        a: "No. La página y el MVP de la semana 5 se montan sin código (Lovable, Bolt) y las automatizaciones de las semanas 6 y 11, con herramientas como Make o Zapier.",
      },
      {
        q: "¿Se puede pagar a plazos?",
        a: "Sí: puedes pagarlo de una vez o en cuotas mensuales con tarjeta, y cada pago lleva su factura. Admisiones te da el detalle.",
      },
      {
        q: "¿Qué tiene que ver Deel con el curso?",
        a: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner, y Deel ha acreditado los contenidos sobre contratar fuera, Employer of Record y estructura societaria que se trabajan en las semanas 11 y 12.",
      },
    ],
  },
  closing: {
    title: "No construyas un negocio que te obligue a estar siempre presente.",
    lines: [
      "Déjanos tus datos y te ayudamos a reservar tu plaza.",
      "Si tienes dudas, admisiones te llama y te las resuelve antes de pagar nada.",
    ],
    cta: "Quiero reservar mi plaza",
  },
};

// ── EN · Remote Professional ───────────────────────────────
const professionalEn: CourseCopy = {
  slug: "remote-professional",
  meta: {
    title: "Remote Professional · Land your international remote job in 8 weeks",
    description:
      "An 8-week live online course: decide what you want, get found, win the interview, sign the right contract and start with AI on your side.",
  },
  hero: {
    eyebrow: "Remote Professional · Career Accelerator",
    title: "Land your international remote job",
    titleHighlight: "in 8 weeks.",
    lead: "A step-by-step method, in the order you will live it: decide what you want, get found, sign the right contract and start with AI on your side.",
    ctaPrimary: "Book your place",
    ctaSecondary: "See the roadmap",
    commitment: "About 12.5 h a week. Fits around your current job.",
    formTitle: "Book your place or ask for details.",
    facts: [
      { value: "8", label: "weeks", icon: "calendario" },
      { value: "16 h", label: "live", icon: "directo" },
      { value: "24 h", label: "of video", icon: "video" },
      { value: "8", label: "AI tools", icon: "chispa" },
    ],
  },
  promise: {
    eyebrow: "What you leave with",
    title: "You leave with the work done, not with notes.",
    lead: "Every week ends with something you can use in your real search: a CV, job alerts, a rehearsed interview or a contract you understand.",
    cards: [
      { icon: "iman", title: "You get found", sub: "CV and LinkedIn ready" },
      { icon: "micro", title: "Interview passed", sub: "Offer negotiated" },
      { icon: "contrato", title: "Contract signed", sub: "Compliant in any country" },
    ],
    note: "The exercises use your real target, not a made-up case.",
  },
  roadmap: {
    eyebrow: "Your roadmap",
    title: "8 weeks, 8 milestones. Each week unlocks one skill.",
    lead: "The order follows your real timeline: decide, get found, get hired, sign and start.",
    week0: { label: "Week 0.", body: "You introduce yourself to your cohort on Slack and meet your pod before the first class." },
    weekLabel: "Week",
    keepsLabel: "What you keep",
    phases: [
      { name: "Decide", weeks: "Week 1" },
      { name: "Get found", weeks: "Weeks 2–3" },
      { name: "Get hired", weeks: "Weeks 4–5" },
      { name: "Start and settle", weeks: "Weeks 6–8" },
    ],
    weeks: [
      {
        n: 1,
        icon: "brujula",
        phase: 0,
        title: "Quit the commute, keep the career",
        milestone: "Your 90-day remote goal",
        lead: "Choose the level of remote work and the lifestyle that fit you, starting from a scored baseline.",
        keeps: ["Starting Point Test and remote skills baseline", "The 5 levels of remote work", "Your 90-day remote goal", "Your personal AI assistant"],
      },
      {
        n: 2,
        icon: "iman",
        phase: 1,
        title: "Stop applying. Start getting hunted",
        milestone: "A CV and LinkedIn that attract recruiters",
        lead: "Target the remote roles that fit your profile and get recruiters to come to you.",
        keeps: ["Role-fit questionnaire", "Remote-ready CV and rewritten LinkedIn", "Job board and freelance platform directory", "Application tracker and first outreach messages"],
      },
      {
        n: 3,
        icon: "radar",
        phase: 1,
        title: "Your AI job hunter never sleeps",
        milestone: "Automated search up and running",
        lead: "Run a job search that finds openings and drafts applications while you do something else.",
        keeps: ["Daily job and sector news alerts", "AI assistant that tailors your CV to each posting", "Prompt library"],
      },
      {
        n: 4,
        icon: "micro",
        phase: 2,
        title: "Crush the interview, name your price",
        milestone: "Interview passed, offer negotiated",
        lead: "Win video and AI-scored interviews and negotiate the whole offer, not just the salary.",
        keeps: ["Interview setup checklist", "AI interview simulator", "Objection bank and negotiation script", "«Which contract is this offer?»"],
      },
      {
        n: 5,
        icon: "contrato",
        phase: 2,
        title: "Get paid globally, stay legal everywhere",
        milestone: "Contract and tax under control",
        lead: "Read any remote offer and know which contract and tax position it creates: EOR, employee, contractor or self-employed.",
        keeps: ["Contract-type comparator", "Tax-residency checklist", "Take-home pay calculator", "Contract red-flag checklist"],
      },
      {
        n: 6,
        icon: "chispa",
        phase: 3,
        title: "Make AI your intern, not your replacement",
        milestone: "Your first 90 days, with AI",
        lead: "Pass probation, stay visible remotely and hand the repetitive half of the job to AI.",
        keeps: ["90-day trust plan", "Weekly impact update", "AI work toolkit", "AI-proof skills plan and promotion case template"],
      },
      {
        n: 7,
        icon: "avion",
        phase: 3,
        title: "Pick a country, pack one bag",
        milestone: "Destination and visa chosen",
        lead: "Choose a destination and a visa, and move without losing money or data on the way.",
        keeps: ["«Find your destination» result and visa shortlist", "Move checklist, from 90 days before to 30 after", "Travel cybersecurity checklist", "Multi-currency and savings setup"],
      },
      {
        n: 8,
        icon: "personas",
        phase: 3,
        title: "Never lonely, never burnt out",
        milestone: "A network and a routine that last",
        lead: "Build a network and a community wherever you live, and a routine you can sustain.",
        keeps: ["Networking CRM", "3-layer community plan", "Weekly energy and boundaries routine", "Your before-and-after skills score"],
      },
    ],
    finish: {
      title: "Week 8 · Graduation.",
      body: "You pitch your remote profile in 60 seconds and leave with the ActiveXRemote diploma and your full kit.",
      cta: "I want to start",
    },
  },
  learn: {
    eyebrow: "How you learn",
    title: "Theory first, on video. The live class is for practice.",
    lead: "Every week follows the same rhythm, so you always know what comes next.",
    week: {
      title: "Your typical week",
      total: "12.5 h",
      perWeek: "a week",
      parts: [
        { h: 3.5, label: "Pre-class material", icon: "libro" },
        { h: 3, label: "6 videos of 30 min", icon: "video" },
        { h: 2, label: "Live class", icon: "directo" },
        { h: 3.5, label: "Homework on your case", icon: "lapiz" },
        { h: 0.5, label: "20-question quiz", icon: "test" },
      ],
      note: "Videos and material at your own pace. The live class is on a fixed weekday, and it is recorded.",
    },
    videos: {
      title: "The 6 videos of every week",
      items: ["The topic in depth", "A real story, including what went wrong", "The method, step by step", "The tool, built on screen", "Before and after: mistakes fixed", "Your next 30 days"],
    },
    live: {
      title: "A 2-hour live class",
      parts: [
        { min: 5, label: "Pulse" },
        { min: 25, label: "3 myths" },
        { min: 30, label: "Real stories" },
        { min: 10, label: "Quiz" },
        { min: 30, label: "Homework, live" },
        { min: 20, label: "Q&A" },
      ],
      note: "The pulse opens with your pre-class poll and the quiz is three live questions. Myths and stories come with the teacher's real cases, including the ones that went wrong.",
    },
    ai: {
      title: "One AI tool every week",
      items: ["Personal assistant", "AI CV and LinkedIn", "Automated alerts", "Interview simulator", "Contract reader", "AI work toolkit", "Relocation planner", "Weekly review"],
      note: "You enter an AI-heavy job market with AI on your side, following your employer's policy and checking every output.",
    },
    pod: {
      title: "You never search alone",
      body: "Your pod of 4–5 people, fixed for 8 weeks and grouped by time zone and goal. You review each other's homework, share openings in a common channel and stay connected in the alumni community.",
      items: ["Weekly Slack rituals", "Coffee roulette with your cohort", "Shared openings channel", "Alumni community for life"],
    },
  },
  audience: {
    eyebrow: "Who it is for",
    title: "If you want to work remotely for companies abroad, it is for you.",
    lead: "No previous remote experience needed. You do need a profession and about 12.5 h a week.",
    items: [
      { name: "You want to work for international companies", desc: "And stop limiting your options to the companies hiring where you live." },
      { name: "You have experience but have never worked remotely", desc: "You need to adapt your profile, search and interviews to the remote market." },
      { name: "You already work for yourself", desc: "And want higher-value international contracts, fully compliant." },
      { name: "You want to be paid what you are worth", desc: "Learn to value your profile in a global market and negotiate the whole offer." },
    ],
  },
  kit: {
    title: "You keep more than 30 ready-to-use tools",
    lead: "Templates, calculators and AI assistants you keep using after the course.",
    items: [
      { icon: "brujula", label: "Starting Point Test and 90-day goal" },
      { icon: "iman", label: "Remote CV and rewritten LinkedIn" },
      { icon: "radar", label: "Daily AI job alerts" },
      { icon: "micro", label: "AI interview simulator" },
      { icon: "grafica", label: "Salary negotiation script" },
      { icon: "contrato", label: "Contract comparator and take-home calculator" },
      { icon: "chispa", label: "AI work toolkit" },
      { icon: "calendario", label: "90-day trust plan" },
      { icon: "maleta", label: "Relocation checklist" },
      { icon: "escudo", label: "Cybersecurity checklist" },
      { icon: "personas", label: "Networking CRM" },
      { icon: "reloj", label: "Energy and boundaries routine" },
    ],
  },
  salaries: {
    title: "Same role, another market",
    cols: ["Average annual salary", "Spain", "United Kingdom", "United States"],
    rows: [
      ["Product Manager", "€45,000", "£63,126", "$151,317"],
      ["Product Marketing Manager", "€48,000", "£63,157", "$141,190"],
      ["Sales Development Rep.", "€33,000", "£39,680", "$103,886"],
    ],
    note: "Public Glassdoor averages, Sept. 2026, in local currency. Market salaries, not a promise of what you will earn.",
  },
  pricing: {
    eyebrow: "Book your place",
    title: "Start now. In 8 weeks, you are in.",
    lead: "Everything included. Leave your details and admissions will tell you the price, payment options and next start date.",
    includes: [
      "8 live classes and their recordings",
      "48 videos (24 h) and all the material",
      "More than 30 templates and tools",
      "Homework with rubrics, and quizzes",
      "Your pod and the Slack community",
      "ActiveXRemote diploma",
    ],
    cta: "I want to book my place",
    guarantees: [
      { icon: "escudo", label: "Secure payment with Stripe" },
      { icon: "tarjeta", label: "An invoice for every payment" },
      { icon: "calendario", label: "14-day withdrawal right" },
    ],
    help: { lead: "Questions? Admissions replies within 24 working hours.", cta: "Talk to admissions" },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "How much time do I need each week?",
        a: "About 12.5 hours: 3.5 h of pre-class material, 3 h of video, the 2-hour live class, 3.5 h of homework and a 20-question quiz. It is a real commitment with a full-time job, but everything except the class is at your own pace.",
      },
      { q: "What if I miss a live class?", a: "Every class is recorded on the Campus. It runs on a fixed weekday so you can plan, and homework is due before the next class." },
      {
        q: "Do I need previous remote work experience?",
        a: "No. Week 1 starts with a test that measures where you start, and the freelance platforms in week 2 work as a bridge if you have never worked remotely.",
      },
      {
        q: "Is it just a job-search course?",
        a: "No. Beyond the search and the interview, it covers what most courses skip: which contract and tax position an offer creates, passing your first 90 days with AI, moving country and not burning out working remotely.",
      },
      { q: "Can I pay in instalments?", a: "Yes: you can pay in full or in monthly card instalments, each with its own invoice. Admissions will give you the details." },
      {
        q: "What does Deel have to do with the course?",
        a: "ActiveXRemote is a Deel Platinum Partner and Deel Global Partner, and Deel has accredited the content on compensation, contracts and tax, distributed onboarding and visas covered in weeks 4 to 7.",
      },
    ],
  },
  closing: {
    title: "Your career does not need borders.",
    lines: ["Leave your details and we will help you book your place.", "If you have questions, admissions will call you and answer them before you pay anything."],
    cta: "I want to book my place",
  },
};

// ── EN · Remote Founder ────────────────────────────────────
const founderEn: CourseCopy = {
  slug: "remote-founder",
  meta: {
    title: "Remote Founder · Build a business that sells abroad in 13 weeks",
    description:
      "A 13-week live online course: validate, price, win international clients, automate and incorporate your company.",
  },
  hero: {
    eyebrow: "Remote Founder · Global Builder",
    title: "Build a business that sells abroad",
    titleHighlight: "in 13 weeks.",
    lead: "Validated, priced, selling and incorporated. Every exercise is done on your own business, so in week 13 you leave with a company up and running, not with notes.",
    ctaPrimary: "Book your place",
    ctaSecondary: "See the roadmap",
    commitment: "About 12.5 h a week, on your own business.",
    formTitle: "Book your place or ask for details.",
    facts: [
      { value: "13", label: "weeks", icon: "calendario" },
      { value: "26 h", label: "live", icon: "directo" },
      { value: "39 h", label: "of video", icon: "video" },
      { value: "13", label: "AI tools", icon: "chispa" },
    ],
  },
  promise: {
    eyebrow: "What you leave with",
    title: "More revenue, without selling more hours.",
    lead: "You climb the ladder of a remote business: from selling your time to selling a productised service, and from there to products that do not depend on your calendar.",
    cards: [
      { icon: "chat", title: "Validated", sub: "3 real buyers" },
      { icon: "euro", title: "First payment", sub: "Your page already sells" },
      { icon: "edificio", title: "Company incorporated", sub: "Compliant in any country" },
    ],
    ladder: ["Freelance", "Productised service", "Digital product", "Software"],
    note: "You do not need a business yet: you can start with an idea or with a skill you already sell.",
  },
  roadmap: {
    eyebrow: "Your roadmap",
    title: "13 weeks, 13 milestones. From idea to a company that sells.",
    lead: "The order follows a real business: build the offer, win clients, run the operation and scale.",
    week0: { label: "Week 0.", body: "You present your idea or business to your cohort on Slack and meet your mastermind before the first class." },
    weekLabel: "Week",
    keepsLabel: "What you keep",
    phases: [
      { name: "Build the offer", weeks: "Weeks 1–5" },
      { name: "Win clients", weeks: "Weeks 6–9" },
      { name: "Run and protect", weeks: "Weeks 10–12" },
      { name: "Scale", weeks: "Week 13" },
    ],
    weeks: [
      {
        n: 1,
        icon: "escalera",
        phase: 0,
        title: "From payroll to a company of one",
        milestone: "Model chosen and a 90-day revenue goal",
        lead: "Pick the business model that fits you, starting from a scored baseline.",
        keeps: ["Founder Starting Point Test", "The model ladder: freelance, productised service, digital product and software", "90-day revenue goal", "Your personal AI co-founder"],
      },
      {
        n: 2,
        icon: "diana",
        phase: 0,
        title: "Find a problem worth paying for",
        milestone: "A niche that pays and numbers that add up",
        lead: "Design a high-margin remote business around a niche that pays.",
        keeps: ["Freedom Business Canvas", "Niche scorecard", "«How many clients do I need?» calculator", "AI market-research assistant"],
      },
      {
        n: 3,
        icon: "chat",
        phase: 0,
        title: "Sell it before you build it",
        milestone: "3 interviews with real buyers",
        lead: "Get evidence from real buyers before spending anything on building.",
        keeps: ["Validation script", "3 real buyer interviews", "Pre-sale landing page", "Go/no-go scorecard"],
      },
      {
        n: 4,
        icon: "paquete",
        phase: 0,
        title: "Package it, price it premium",
        milestone: "Your offer, with 3 price tiers",
        lead: "Turn your expertise into a productised offer at a price that holds.",
        keeps: ["Productised Service Matrix", "Value-based pricing calculator with 3 tiers", "Offer one-pager", "AI offer critic"],
      },
      {
        n: 5,
        icon: "cohete",
        phase: 0,
        title: "Launch in a weekend, no code needed",
        milestone: "A live page that already takes payment",
        lead: "Publish a page or service MVP that sells and takes payment.",
        keeps: ["Service page live", "Payment link with Stripe or Wise", "No-code MVP with Lovable or Bolt", "Domain and professional email"],
      },
      {
        n: 6,
        icon: "chispa",
        phase: 1,
        title: "Hire an AI marketing team",
        milestone: "AI content and lead capture, in your voice",
        lead: "Run marketing, lead capture and support with AI that keeps your voice.",
        keeps: ["AI Agent Matrix", "Idea-to-3-posts chain", "Lead form connected to your tracker", "AI support FAQ and quality checklist"],
      },
      {
        n: 7,
        icon: "globo",
        phase: 1,
        title: "Clients abroad, without leaving home",
        milestone: "10 verified international prospects",
        lead: "Build a pipeline that brings in international B2B clients.",
        keeps: ["Ideal client profile", "10 verified prospects", "Outreach and follow-up sequences", "Optimised LinkedIn, Upwork or Contra profile, and your CRM"],
      },
      {
        n: 8,
        icon: "apreton",
        phase: 1,
        title: "Close the deal, skip the hard sell",
        milestone: "Proposal and contract ready to sign",
        lead: "Turn conversations into signed, paid contracts.",
        keeps: ["Asynchronous sales pipeline", "Discovery-call script", "Proposal template and objection bank", "Client-contract red-flag checklist"],
      },
      {
        n: 9,
        icon: "megafono",
        phase: 1,
        title: "Become the name clients ask for",
        milestone: "Newsletter live and 5 pieces scheduled",
        lead: "Build public authority so clients come to you.",
        keeps: ["Authority plan: topic, channel and frequency", "First 5 pieces scheduled", "Newsletter live", "AI content-repurposing workflow"],
      },
      {
        n: 10,
        icon: "engranaje",
        phase: 2,
        title: "Deliver like a company, not a freelancer",
        milestone: "SOPs, client hub and margin per project",
        lead: "Deliver consistently without being in every message, and know each project's margin.",
        keeps: ["SOP architecture", "Client delivery hub", "Project template and margin dashboard", "Remote stack: Notion, Slack and Loom"],
      },
      {
        n: 11,
        icon: "rayo",
        phase: 2,
        title: "Automate the back office, delegate the rest",
        milestone: "Automated back office and first hire",
        lead: "Free up hours with automation and make the right first hire, even in another country.",
        keeps: ["Delegation matrix", "Automated back office: form, folder, contract and tracker", "Hiring scorecard", "Contractor contract and cross-border payments"],
      },
      {
        n: 12,
        icon: "edificio",
        phase: 2,
        title: "Incorporate anywhere, stay legal everywhere",
        milestone: "Company and tax structure chosen",
        lead: "Choose the company and tax structure that fits your business stage, and keep it compliant.",
        keeps: [
          "3-year entity comparison: US LLC, Estonian e-Residency, UAE free zone or your home country",
          "Net-income formula",
          "Tax-residency checklist and invoice template",
          "Compliance calendar",
        ],
      },
      {
        n: 13,
        icon: "estrella",
        phase: 3,
        title: "Scale to freedom, not to burnout",
        milestone: "12-month plan and your Demo Day pitch",
        lead: "Plan the next revenue step without selling more hours, with a routine you can sustain.",
        keeps: ["12-month revenue-ladder plan", "Weekly CEO review run by AI", "Energy and boundaries routine", "Your Demo Day pitch"],
      },
    ],
    demo: { title: "Demo Day", body: "You pitch your business in 90 seconds to alumni and invited companies." },
    finish: { title: "When you finish:", body: "a validated, priced, selling and incorporated business, and the ActiveXRemote diploma.", cta: "I want to start" },
  },
  learn: {
    eyebrow: "How you learn",
    title: "Theory first, on video. The live class is for working on your business.",
    lead: "Every week follows the same rhythm, and homework is always your own business: work you would do anyway, with a method.",
    week: {
      title: "Your typical week",
      total: "12.5 h",
      perWeek: "a week",
      parts: [
        { h: 3.5, label: "Pre-class material", icon: "libro" },
        { h: 3, label: "6 videos of 30 min", icon: "video" },
        { h: 2, label: "Live class", icon: "directo" },
        { h: 3.5, label: "Homework on your business", icon: "lapiz" },
        { h: 0.5, label: "20-question quiz", icon: "test" },
      ],
      note: "Videos and material at your own pace. The live class is on a fixed weekday, and it is recorded.",
    },
    videos: {
      title: "The 6 videos of every week",
      items: ["The topic in depth", "A real business, including what went wrong", "The method, step by step", "The tool, built on screen", "Before and after: mistakes fixed", "Your next 30 days"],
    },
    live: {
      title: "A 2-hour live class",
      parts: [
        { min: 5, label: "Pulse" },
        { min: 25, label: "3 myths" },
        { min: 30, label: "Real stories" },
        { min: 10, label: "Quiz" },
        { min: 30, label: "Homework, live" },
        { min: 20, label: "Q&A" },
      ],
      note: "The pulse opens with your pre-class poll and the quiz is three live questions. The stories come from the teacher's real businesses, including the ones that went wrong.",
    },
    ai: {
      title: "One AI tool every week",
      items: [
        "AI co-founder",
        "Market research",
        "Interview synthesis",
        "Offer critic",
        "No-code MVP",
        "Marketing team",
        "Verified prospecting",
        "Proposals",
        "Content repurposing",
        "SOPs from a video",
        "Chained back office",
        "Entity comparator",
        "Weekly CEO review",
      ],
      note: "You leave with a business that runs on AI, not one AI makes obsolete. One rule: a person checks wherever money or contracts are involved.",
    },
    clinics: {
      title: "Founders' clinics",
      weeks: [4, 8, 12],
      length: "90 min",
      note: "Three live sessions with the ActiveXRemote founders. Four or five students put their business in the hot seat and the whole cohort learns from each case.",
    },
    pod: {
      title: "Your mastermind: your board of directors",
      body: "A fixed group of 4–5 founders for 13 weeks, grouped by time zone and business stage. You review each other's homework, pass on clients and suppliers, and stay connected in the alumni community.",
      items: ["Goals and wins on Slack", "Coffee roulette with your cohort", "Referrals channel", "Alumni community for life"],
    },
  },
  audience: {
    eyebrow: "Who it is for",
    title: "For people who want to build, not just work.",
    lead: "You can come with an idea, a skill you already sell or a business that is not taking off. You need about 12.5 h a week.",
    items: [
      { name: "Freelancers", desc: "Who want to stop competing on price and sell higher-value offers." },
      { name: "Consultants and experts", desc: "Who want to turn their expertise into a productised, recurring service." },
      { name: "Professionals going independent", desc: "With a sellable skill and the drive to turn it into a business." },
      { name: "Founders", desc: "Who want a company ready to sell and operate abroad from day one." },
    ],
  },
  kit: {
    title: "You keep more than 60 tools for your business",
    lead: "Templates, calculators and AI agents built on your own business, still working after the course.",
    items: [
      { icon: "diana", label: "Freedom Business Canvas" },
      { icon: "chat", label: "Buyer validation script" },
      { icon: "euro", label: "3-tier pricing calculator" },
      { icon: "cohete", label: "Service page and payment link" },
      { icon: "chispa", label: "AI marketing agent team" },
      { icon: "globo", label: "International client CRM" },
      { icon: "apreton", label: "Proposal template and objection bank" },
      { icon: "megafono", label: "Authority plan and newsletter" },
      { icon: "engranaje", label: "SOP architecture and margin dashboard" },
      { icon: "rayo", label: "Delegation matrix and automated back office" },
      { icon: "edificio", label: "3-year entity comparison" },
      { icon: "estrella", label: "12-month growth plan" },
    ],
  },
  flows: {
    title: "The AI that runs your business",
    lead: "In weeks 6 and 11 you build two systems that work for you from the next day.",
    items: [
      {
        title: "Week 6 · Marketing",
        nodes: [
          { icon: "chispa", label: "Idea" },
          { icon: "megafono", label: "3 posts in your voice" },
          { icon: "chat", label: "Form" },
          { icon: "correo", label: "Follow-up" },
        ],
      },
      {
        title: "Week 11 · Back office",
        nodes: [
          { icon: "chat", label: "Form" },
          { icon: "contrato", label: "Contract" },
          { icon: "grafica", label: "Tracker" },
          { icon: "euro", label: "Invoice" },
        ],
      },
    ],
    note: "With a human checkpoint wherever money or contracts are involved, and alerts so no automation fails silently.",
  },
  pricing: {
    eyebrow: "Book your place",
    title: "Start now. In 13 weeks, your business sells abroad.",
    lead: "Everything included. Leave your details and admissions will tell you the price, payment options and next start date.",
    includes: [
      "13 live classes and their recordings",
      "78 videos (39 h) and all the material",
      "3 founders' clinics",
      "More than 60 templates and tools",
      "Your mastermind and the Slack community",
      "Demo Day and ActiveXRemote diploma",
    ],
    cta: "I want to book my place",
    guarantees: [
      { icon: "escudo", label: "Secure payment with Stripe" },
      { icon: "tarjeta", label: "An invoice for every payment" },
      { icon: "calendario", label: "14-day withdrawal right" },
    ],
    help: { lead: "Questions? Admissions replies within 24 working hours.", cta: "Talk to admissions" },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Do I need to have a business already?",
        a: "No. Weeks 1 to 3 are for choosing the model, finding a niche that pays and validating it with real buyers before building anything. If you already have a business, you work on that one.",
      },
      {
        q: "How much time do I need each week?",
        a: "About 12.5 hours: 3.5 h of pre-class material, 3 h of video, the 2-hour live class, 3.5 h of homework and a quiz. Homework is always your own business, so it is work you would do anyway.",
      },
      { q: "What if I miss a live class?", a: "Every class is recorded on the Campus. It runs on a fixed weekday so you can plan." },
      {
        q: "Do I need to know how to code?",
        a: "No. The week-5 page and MVP are built without code (Lovable, Bolt), and the week-6 and week-11 automations with tools such as Make or Zapier.",
      },
      { q: "Can I pay in instalments?", a: "Yes: you can pay in full or in monthly card instalments, each with its own invoice. Admissions will give you the details." },
      {
        q: "What does Deel have to do with the course?",
        a: "ActiveXRemote is a Deel Platinum Partner and Deel Global Partner, and Deel has accredited the content on hiring abroad, Employer of Record and company structure covered in weeks 11 and 12.",
      },
    ],
  },
  closing: {
    title: "Do not build a business that needs you there all the time.",
    lines: ["Leave your details and we will help you book your place.", "If you have questions, admissions will call you and answer them before you pay anything."],
    cta: "I want to book my place",
  },
};

export const courseCopy: Record<Locale, Record<CourseSlug, CourseCopy>> = {
  es: { "remote-professional": professionalEs, "remote-founder": founderEs },
  en: { "remote-professional": professionalEn, "remote-founder": founderEn },
};
