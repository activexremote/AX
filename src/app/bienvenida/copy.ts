import type { Locale } from "@/lib/i18n/config";

// Contenido de la landing pública. Autocontenido (no ensucia el diccionario
// global del campus). Bilingüe ES/EN. Basado en el programa real:
// Global XRemote Talent Blueprint — 14 módulos (7 núcleo + 7 por camino),
// dos caminos: Remote Professional (empleo) y Remote Founder (negocio).
export type LandingCopy = (typeof landingCopy)["es"];

export const landingCopy = {
  es: {
    nav: {
      links: [
        { href: "#metodo", label: "Método" },
        { href: "#caminos", label: "Caminos" },
        { href: "#modulos", label: "Módulos" },
        { href: "#faq", label: "FAQ" },
      ],
      enter: "Entrar al campus",
    },
    hero: {
      tag: "Programa de formación · ActiveXRemote",
      titleTop: "¿Listo para trabajar sin fronteras?",
      titleBottom: "Consigue el empleo remoto o construye el negocio.",
      lead: "14 módulos, 2 caminos, un objetivo: dominar el trabajo remoto a nivel global. Consigue roles internacionales mejor pagados o lanza tu propio negocio borderless.",
      ctaPrimary: "Entrar al campus",
      ctaSecondary: "Ver el programa",
      stats: [
        { value: "14", label: "módulos" },
        { value: "2", label: "caminos" },
        { value: "4h", label: "por clase en vivo" },
      ],
    },
    proof: {
      title: "Todo lo que necesitas para operar en remoto, a nivel global",
      chips: [
        "IA aplicada",
        "Fiscalidad global",
        "Nómada digital",
        "Negociación salarial",
        "Automatización",
        "Sin fronteras",
      ],
    },
    statement: {
      top: "El trabajo en remoto se aprende",
      bottom: "trabajando en remoto.",
    },
    features: [
      {
        eyebrow: "El método",
        title: "No es teoría. Es ejecución.",
        body: "Cada módulo son 4 horas en vivo que combinan frameworks, walkthroughs de herramientas reales y un ejercicio práctico que aplicas a tu propio caso. Sales con entregables, no con apuntes.",
        points: ["Clases de 4h en vivo", "Herramientas reales", "Ejercicio por módulo"],
      },
      {
        eyebrow: "Dos caminos",
        title: "Empleo o negocio. Tú eliges.",
        body: "7 módulos núcleo sientan la base para todos. Después te especializas: Remote Professional para conseguir empleos remotos de élite, o Remote Founder para construir tu propio negocio borderless.",
        points: ["7 módulos núcleo", "7 especializados", "Cambia de camino cuando quieras"],
      },
      {
        eyebrow: "IA aplicada",
        title: "La IA como tu ventaja injusta.",
        body: "De prompt engineering a agentes personalizados y automatizaciones que multiplican tu output. Aprendes a usar la IA para buscar empleo, cerrar clientes y operar tu negocio.",
        points: ["Prompt engineering", "Agentes a medida", "Automatización no-code"],
      },
    ],
    integration: {
      eyebrow: "Stack real",
      title: "Aprendes con las herramientas que de verdad se usan.",
      body: "Notion, Slack, Wise, Deel, Zapier, LLMs… Montas tu propio sistema operativo remoto y el campus te avisa de cada avance en Slack.",
    },
    bento: {
      stat1: { value: "14", label: "módulos · 7 núcleo + 7 por camino" },
      stat2: { value: "4h", label: "por clase, en vivo" },
      quote:
        "«El remoto no falla por la distancia. Falla por no haber aprendido a trabajar así.»",
      quoteBy: "Manifiesto ActiveXRemote",
    },
    paths: {
      eyebrow: "Elige tu camino",
      title: "Dos rutas. Un mismo nivel de exigencia.",
      lead: "Comparten los 7 módulos núcleo y se separan en la especialización. Puedes cambiar de camino cuando quieras.",
      cta: "Empezar este camino",
      items: [
        {
          tag: "Camino 01",
          name: "Remote Professional",
          sub: "Career Accelerator",
          forWho: "Para empleados y contractors",
          desc: "Consigue roles remotos internacionales mejor pagados y conviértete en el profesional distribuido que las empresas se pelean por contratar.",
          outcomes: [
            "Job hacking: encuentra los roles remotos ocultos",
            "Optimiza tu candidatura con IA (ATS, CV, cover letters)",
            "Marca personal y portfolio internacional",
            "Domina la entrevista en vídeo y asíncrona",
            "Negocia tu salario y compensación global",
            "Triunfa en tus primeros 90 días en equipos distribuidos",
            "Escala a roles fraccionales y consultoría",
          ],
        },
        {
          tag: "Camino 02",
          name: "Remote Founder",
          sub: "Global Builder",
          forWho: "Para founders, freelancers y solopreneurs",
          desc: "Lanza, automatiza y escala un negocio borderless de altos márgenes, con la IA como tu primer empleado y clientes en todo el mundo.",
          outcomes: [
            "Diseña y valida tu negocio remoto (Freedom Canvas)",
            "Opera y haz marketing con IA",
            "Consigue clientes B2B internacionales",
            "Crea ofertas premium y landing pages que convierten",
            "Sistematiza con SOPs y dashboards",
            "Automatiza y delega para escalar",
            "Monta tu estructura corporativa borderless",
          ],
        },
      ],
    },
    curriculum: {
      eyebrow: "El programa",
      title: "14 módulos que lo cubren todo.",
      lead: "Empieza por los 7 módulos núcleo, compartidos por ambos caminos. Son la base de todo profesional remoto de élite.",
      modules: [
        { n: "01", title: "Mindset remoto y el nuevo mercado global", desc: "De empleado local a «startup personal» en un mercado global competitivo." },
        { n: "02", title: "Geoposicionamiento y optimización fiscal", desc: "Maximiza tu ingreso neto con residencia, visados y fiscalidad inteligente." },
        { n: "03", title: "Blueprint de reubicación internacional", desc: "La logística real de montar tu vida y tu banca en otro país, sin sustos." },
        { n: "04", title: "Stack tecnológico de alto rendimiento", desc: "Notion, Slack, Wise y automatización para operar en asíncrono." },
        { n: "05", title: "IA para productividad remota", desc: "Prompt engineering, agentes y síntesis para multiplicar tu output." },
        { n: "06", title: "Life Ops: energía y anti-burnout", desc: "Timeboxing, límites digitales y hábitos para rendir sin quemarte." },
        { n: "07", title: "Legal y compliance transfronterizo", desc: "Contratos, facturación internacional y estatus legal claro." },
      ],
      pathNote: "7 módulos especializados según tu camino: Professional o Founder.",
    },
    team: {
      eyebrow: "Quién está detrás",
      title: "Un equipo que trabaja como enseña.",
      lead: "El programa lo diseña e imparte el equipo de ActiveXRemote: en remoto, en asíncrono y con el mismo método que aprendes aquí.",
      roles: [
        { tag: "01", role: "Diseño instruccional", desc: "Convierte la experiencia del equipo en rutas y lecciones claras y accionables." },
        { tag: "02", role: "Mentoría", desc: "Acompaña, resuelve dudas y da feedback sobre lo que aplicas en tu día a día." },
        { tag: "03", role: "Producto & plataforma", desc: "Construye y mejora el campus donde aprendes, lección a lección." },
      ],
    },
    access: {
      eyebrow: "Acceso",
      title: "Un campus. Los dos caminos.",
      lead: "Acceso completo al programa para el personal autorizado de ActiveXRemote. Sin coste, sin límites de tiempo.",
      planName: "Acceso al campus",
      planPrice: "Incluido",
      planNote: "para el personal autorizado",
      features: [
        "Los 14 módulos (núcleo + ambos caminos)",
        "Clases de 4h con audio narrado",
        "Frameworks y plantillas descargables",
        "Ejercicio práctico en cada módulo",
        "Integración con Slack",
        "A tu ritmo, sin caducidad",
      ],
      cta: "Entrar al campus",
    },
    steps: {
      eyebrow: "Cómo funciona",
      title: "Tu ruta, en tres pasos.",
      items: [
        { n: "01", title: "Empieza por el núcleo", desc: "7 módulos compartidos que sientan las bases del trabajo remoto global." },
        { n: "02", title: "Elige tu camino", desc: "Professional para conseguir empleo; Founder para construir tu negocio." },
        { n: "03", title: "Ejecuta y demuéstralo", desc: "Cada módulo termina con un ejercicio real que aplicas a tu caso." },
      ],
    },
    faq: {
      eyebrow: "Dudas",
      title: "Preguntas frecuentes.",
      items: [
        { q: "¿Cuántos módulos tiene el programa?", a: "14 en total: 7 módulos núcleo compartidos y 7 especializados según el camino que elijas (Professional o Founder)." },
        { q: "¿Cuánto dura cada clase?", a: "Cada módulo es una clase de 4 horas en vivo: teoría, walkthrough de herramientas, workshop práctico y Q&A." },
        { q: "¿Qué camino me conviene?", a: "Remote Professional si buscas un empleo remoto internacional; Remote Founder si quieres lanzar tu propio negocio. Puedes cambiar cuando quieras." },
        { q: "¿Necesito conocimientos previos?", a: "No. Los 7 módulos núcleo parten de cero y la especialización sube de nivel de forma progresiva." },
        { q: "¿Qué herramientas voy a usar?", a: "Notion, Slack, Wise, Deel, Zapier y modelos de IA, entre otras. Montas tu propio stack remoto durante el programa." },
        { q: "¿Es en directo o asíncrono?", a: "Las clases son en vivo, y tienes material, audio narrado y ejercicios para avanzar a tu ritmo en asíncrono." },
      ],
    },
    finalCta: {
      title: "Tu carrera —o tu negocio— sin fronteras",
      titleAccent: "empieza aquí.",
      body: "Entra al campus y empieza por el primer módulo del núcleo.",
      cta: "Entrar al campus",
    },
    footer: {
      tagline: "Campus de formación · trabajo remoto global",
      access: "Acceso restringido al personal autorizado",
      cols: [
        { title: "Programa", links: [{ href: "#metodo", label: "Método" }, { href: "#caminos", label: "Caminos" }, { href: "#modulos", label: "Módulos" }, { href: "#faq", label: "FAQ" }] },
        { title: "Acceso", links: [{ href: "/login", label: "Entrar" }, { href: "/login?mode=signup", label: "Crear cuenta" }] },
      ],
    },
  },
  en: {
    nav: {
      links: [
        { href: "#metodo", label: "Method" },
        { href: "#caminos", label: "Paths" },
        { href: "#modulos", label: "Modules" },
        { href: "#faq", label: "FAQ" },
      ],
      enter: "Enter the campus",
    },
    hero: {
      tag: "Training program · ActiveXRemote",
      titleTop: "Ready to work without borders?",
      titleBottom: "Land the remote job or build the business.",
      lead: "14 modules, 2 paths, one goal: master remote work on a global scale. Land better-paid international roles or launch your own borderless business.",
      ctaPrimary: "Enter the campus",
      ctaSecondary: "See the program",
      stats: [
        { value: "14", label: "modules" },
        { value: "2", label: "paths" },
        { value: "4h", label: "per live class" },
      ],
    },
    proof: {
      title: "Everything you need to operate remotely, on a global scale",
      chips: [
        "Applied AI",
        "Global tax",
        "Digital nomad",
        "Salary negotiation",
        "Automation",
        "Borderless",
      ],
    },
    statement: {
      top: "Remote work is learned",
      bottom: "by working remotely.",
    },
    features: [
      {
        eyebrow: "The method",
        title: "Not theory. Execution.",
        body: "Each module is 4 live hours mixing frameworks, real tool walkthroughs and a hands-on exercise you apply to your own case. You leave with deliverables, not notes.",
        points: ["4h live classes", "Real tools", "Exercise per module"],
      },
      {
        eyebrow: "Two paths",
        title: "Job or business. You choose.",
        body: "7 core modules set the foundation for everyone. Then you specialize: Remote Professional to land elite remote jobs, or Remote Founder to build your own borderless business.",
        points: ["7 core modules", "7 specialized", "Switch paths anytime"],
      },
      {
        eyebrow: "Applied AI",
        title: "AI as your unfair advantage.",
        body: "From prompt engineering to custom agents and automations that multiply your output. Learn to use AI to find work, close clients and run your business.",
        points: ["Prompt engineering", "Custom agents", "No-code automation"],
      },
    ],
    integration: {
      eyebrow: "Real stack",
      title: "Learn with the tools people actually use.",
      body: "Notion, Slack, Wise, Deel, Zapier, LLMs… You build your own remote operating system and the campus pings every milestone in Slack.",
    },
    bento: {
      stat1: { value: "14", label: "modules · 7 core + 7 per path" },
      stat2: { value: "4h", label: "per class, live" },
      quote:
        "“Remote doesn't fail because of distance. It fails when nobody learned to work this way.”",
      quoteBy: "ActiveXRemote Manifesto",
    },
    paths: {
      eyebrow: "Choose your path",
      title: "Two routes. One level of rigor.",
      lead: "They share the 7 core modules and split at specialization. You can switch paths whenever you want.",
      cta: "Start this path",
      items: [
        {
          tag: "Path 01",
          name: "Remote Professional",
          sub: "Career Accelerator",
          forWho: "For employees and contractors",
          desc: "Land better-paid international remote roles and become the distributed professional companies fight to hire.",
          outcomes: [
            "Job hacking: find the hidden remote roles",
            "Optimize your application with AI (ATS, CV, cover letters)",
            "International personal brand and portfolio",
            "Master the video and async interview",
            "Negotiate your salary and global comp",
            "Nail your first 90 days on distributed teams",
            "Scale to fractional roles and consulting",
          ],
        },
        {
          tag: "Path 02",
          name: "Remote Founder",
          sub: "Global Builder",
          forWho: "For founders, freelancers and solopreneurs",
          desc: "Launch, automate and scale a high-margin borderless business, with AI as your first employee and clients worldwide.",
          outcomes: [
            "Design and validate your remote business (Freedom Canvas)",
            "Run ops and marketing with AI",
            "Win international B2B clients",
            "Craft premium offers and landing pages that convert",
            "Systematize with SOPs and dashboards",
            "Automate and delegate to scale",
            "Set up your borderless corporate structure",
          ],
        },
      ],
    },
    curriculum: {
      eyebrow: "The program",
      title: "14 modules that cover it all.",
      lead: "Start with the 7 core modules, shared by both paths. They're the foundation of every elite remote professional.",
      modules: [
        { n: "01", title: "Remote mindset & the new global market", desc: "From local employee to a “personal startup” in a competitive global market." },
        { n: "02", title: "Geo-positioning & tax optimization", desc: "Maximize your net income with smart residency, visas and taxes." },
        { n: "03", title: "International relocation blueprint", desc: "The real logistics of setting up your life and banking abroad, safely." },
        { n: "04", title: "High-performance tech stack", desc: "Notion, Slack, Wise and automation to operate asynchronously." },
        { n: "05", title: "AI for remote productivity", desc: "Prompt engineering, agents and synthesis to multiply your output." },
        { n: "06", title: "Life Ops: energy & anti-burnout", desc: "Timeboxing, digital boundaries and habits to perform without burning out." },
        { n: "07", title: "Cross-border legal & compliance", desc: "Contracts, international invoicing and a clear legal status." },
      ],
      pathNote: "7 specialized modules based on your path: Professional or Founder.",
    },
    team: {
      eyebrow: "Who's behind it",
      title: "A team that works how it teaches.",
      lead: "The program is designed and taught by the ActiveXRemote team: remote, async and with the same method you learn here.",
      roles: [
        { tag: "01", role: "Instructional design", desc: "Turns the team's experience into clear, actionable tracks and lessons." },
        { tag: "02", role: "Mentorship", desc: "Guides you, answers questions and gives feedback on what you apply day to day." },
        { tag: "03", role: "Product & platform", desc: "Builds and improves the campus where you learn, lesson by lesson." },
      ],
    },
    access: {
      eyebrow: "Access",
      title: "One campus. Both paths.",
      lead: "Full access to the program for authorized ActiveXRemote staff. No cost, no time limits.",
      planName: "Campus access",
      planPrice: "Included",
      planNote: "for authorized staff",
      features: [
        "All 14 modules (core + both paths)",
        "4h classes with narrated audio",
        "Downloadable frameworks and templates",
        "Hands-on exercise in every module",
        "Slack integration",
        "At your pace, no expiry",
      ],
      cta: "Enter the campus",
    },
    steps: {
      eyebrow: "How it works",
      title: "Your route, in three steps.",
      items: [
        { n: "01", title: "Start with the core", desc: "7 shared modules that lay the foundations of global remote work." },
        { n: "02", title: "Choose your path", desc: "Professional to land a job; Founder to build your business." },
        { n: "03", title: "Execute and prove it", desc: "Every module ends with a real exercise you apply to your own case." },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked.",
      items: [
        { q: "How many modules are there?", a: "14 in total: 7 shared core modules and 7 specialized ones based on your chosen path (Professional or Founder)." },
        { q: "How long is each class?", a: "Every module is a 4-hour live class: theory, tool walkthrough, hands-on workshop and Q&A." },
        { q: "Which path suits me?", a: "Remote Professional if you want an international remote job; Remote Founder if you want to launch your own business. You can switch anytime." },
        { q: "Do I need prior knowledge?", a: "No. The 7 core modules start from scratch and the specialization levels up progressively." },
        { q: "What tools will I use?", a: "Notion, Slack, Wise, Deel, Zapier and AI models, among others. You build your own remote stack during the program." },
        { q: "Is it live or async?", a: "Classes are live, and you get materials, narrated audio and exercises to progress at your own pace, async." },
      ],
    },
    finalCta: {
      title: "Your borderless career —or business—",
      titleAccent: "starts here.",
      body: "Enter the campus and start with the first core module.",
      cta: "Enter the campus",
    },
    footer: {
      tagline: "Training campus · global remote work",
      access: "Access restricted to authorized staff",
      cols: [
        { title: "Program", links: [{ href: "#metodo", label: "Method" }, { href: "#caminos", label: "Paths" }, { href: "#modulos", label: "Modules" }, { href: "#faq", label: "FAQ" }] },
        { title: "Access", links: [{ href: "/login", label: "Sign in" }, { href: "/login?mode=signup", label: "Create account" }] },
      ],
    },
  },
} satisfies Record<Locale, unknown>;
