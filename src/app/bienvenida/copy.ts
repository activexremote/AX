import type { Locale } from "@/lib/i18n/config";

// Contenido de la landing pública. Autocontenido (no ensucia el diccionario
// global del campus). Bilingüe ES/EN. Basado en el programa real:
// Global XRemote Talent Blueprint — 14 módulos (7 núcleo + 7 por camino),
// dos caminos: Remote Professional (empleo) y Remote Founder (negocio).
export type LandingCopy = (typeof landingCopy)["es"];

export const landingCopy = {
  es: {
    // Título y descripción de la home. Estaban en duro y en español dentro de
    // page.tsx, así que la versión inglesa se anunciaba en español tanto al
    // compartirla como en los resultados de búsqueda.
    meta: {
      title: "ActiveXRemote · The Remote Business School",
      description:
        "Consigue el empleo remoto internacional que mereces y aprende a construir tu propio negocio global. 14 módulos en directo y dos caminos: Remote Professional y Remote Founder.",
    },
    // Barra superior. ⚠︎ Las plazas disponibles son un dato de maqueta.
    ticker: {
      intro: "La convocatoria arranca el 9 de enero",
      seats: "8 de 25 plazas disponibles",
      units: { d: "días", h: "horas", m: "min", s: "seg" },
    },
    nav: {
      // ⚠︎ Sin «Cursos relámpago» por ahora, a petición del equipo: no se quiere
      // desviar a nadie de los dos cursos que se venden primero. La página
      // /cursos-relampago sigue viva; sólo deja de enlazarse desde aquí.
      courses: {
        label: "Cursos",
        items: [
          { href: "/cursos/remote-professional", label: "Curso Remote Professional" },
          { href: "/cursos/remote-founder", label: "Curso Remote Founder" },
        ],
      },
      links: [
        { href: "#metodo", label: "Método" },
        { href: "/blog", label: "Blog" },
        { href: "#faq", label: "FAQ" },
      ],
      campus: "Campus virtual",
      cta: "Solicita información",
      // El nav del móvil no tiene sitio para la frase entera.
      ctaShort: "Solicita info",
      menuOpen: "Abrir el menú",
      menuClose: "Cerrar el menú",
      menuExplore: "Explora",
    },
    hero: {
      brand: "ACTIVEXREMOTE",
      tagline: "The Remote Business School",
      titleTop: "No es que te falte talento.",
      titleBottom: "Es que nadie te ha enseñado a trabajar sin fronteras.",
      lead: "Consigue el empleo remoto internacional que mereces y aprende a construir tu propio negocio global.",
      // Atajo binario a las dos landings. La decisión que más pesa —empleo o
      // negocio— estaba en la sección 9 de 17: aquí se resuelve en el primer
      // pantallazo y sin scroll.
      chooseLabel: "¿Qué quieres conseguir?",
      choose: [
        { title: "Quiero un empleo remoto internacional", name: "Curso Remote Professional", href: "/cursos/remote-professional" },
        { title: "Quiero montar mi negocio remoto", name: "Curso Remote Founder", href: "/cursos/remote-founder" },
      ],
      stats: [
        { value: "14", label: "módulos" },
        { value: "56h", label: "en directo" },
        { value: "7", label: "fines de semana" },
        { value: "2", label: "cursos" },
      ],
    },
    form: {
      eyebrow: "Solicita información",
      title: "Da el primer paso.",
      lead: "Cuéntanos qué curso te interesa y te enviamos el programa completo, fechas y condiciones.",
      courseLabel: "¿Qué curso te interesa?",
      courseHint: "Opcional. Puedes escoger los dos.",
      courses: [
        { key: "remote-professional", label: "Curso Remote Professional", sub: "Career Accelerator" },
        { key: "remote-founder", label: "Curso Remote Founder", sub: "Global Builder" },
      ],
      firstName: "Nombre",
      lastName: "Apellidos",
      email: "Email",
      phone: "Teléfono",
      city: "Ciudad",
      submit: "Solicita información",
      sending: "Enviando…",
      okTitle: "Solicitud recibida.",
      okBody: "Te escribimos en menos de 24 horas laborables con toda la información.",
      legal: "Solo usamos tus datos para enviarte información del curso. Nada de spam.",
      errors: {
        missing_course: "Elige al menos un curso.",
        missing_fields: "Completa todos los campos.",
        bad_name: "Revisa el nombre y los apellidos.",
        bad_email: "Revisa la dirección de email.",
        bad_phone: "Revisa el teléfono: sólo números, con prefijo si es de fuera de España.",
        bad_city: "Revisa la ciudad.",
        too_many: "Ya hemos recibido tu solicitud. Te escribimos en menos de 24 horas laborables.",
        db: "No se pudo enviar. Inténtalo de nuevo en un momento.",
      },
    },
    proof: {
      title: "Todo lo que necesitas para operar en remoto, a nivel global",
      // Marquesina de temas del programa. El orden alterna bloques (empleo,
      // dinero, movilidad, negocio, método) para que en cualquier instante se
      // vea variedad y no cinco chips seguidos del mismo tema.
      chips: [
        "Trabajo remoto",
        "Contratación internacional",
        "Banca internacional",
        "Cobros globales",
        "Divisas y multicurrency",
        "Seguridad financiera",
        "Optimización fiscal",
        "Visados internacionales",
        "Movilidad internacional",
        "Freelance global",
        "Emprendimiento remoto",
        "Empresa sin fronteras",
        "Compliance internacional",
        "Seguridad digital",
        "Herramientas remote-first",
        "Productividad remota",
        "Gestión de equipos",
        "Contratos internacionales",
        "Beneficios para empleados",
        "Equity & stock options",
        "Coste de vida global",
        "Geografía fiscal",
        "Digital nomad hubs",
        "Seguridad social internacional",
        "Seguros internacionales",
        "Contabilidad global",
        "Pagos internacionales",
        "Finanzas personales",
        "Ingresos en varias monedas",
        "Networking global",
        "Carrera internacional",
        "Libertad geográfica",
        "IA aplicada",
        "Negociación salarial",
        "Automatización",
      ],
    },
    flash: {
      eyebrow: "CURSOS RELÁMPAGO",
      title: "¿Todavía no para un programa entero?",
      lead: "Un curso relámpago son cuatro horas en vídeo con misiones reales y corrección de tus ejercicios, a precio cerrado. Entras hoy, construyes una cosa concreta y la terminas.",
      traits: [
        { title: "4 h en microlecciones", body: "Ninguna pasa de doce minutos." },
        { title: "Se construye, no se mira", body: "Cada lección acaba en una misión." },
        { title: "Te lo corrigen", body: "Nota sobre 100 y feedback concreto." },
        { title: "Precio cerrado", body: "Un pago. Acceso para siempre." },
      ],
      allCta: "Ver todos los cursos relámpago",
      card: {
        hours: "de vídeo",
        lessons: "lecciones",
        missions: "misiones",
        cta: "Ver el curso",
        buy: "Comprar",
        sending: "Abriendo el pago…",
        buyError: "No hemos podido abrir el pago. Inténtalo otra vez.",
        gift: "Regalo:",
        ninja: "Truco:",
      },
    },
    // ⚠︎ «Top #1» a petición expresa del equipo. Es un superlativo
    // comparativo: la Directiva 2005/29/CE pide poder sostenerlo, así que hay
    // que tener a mano con qué criterio o en qué ranking somos el #1.
    statement: {
      top: "ActiveXRemote, Top #1 en formación práctica y 100 % actualizada en Remote Business.",
      bottom: "Fórmate en directo y online, con una metodología diseñada para avanzar al ritmo del mercado remoto actual.",
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
        points: ["7 módulos núcleo", "7 especializados", "Puedes hacer los dos caminos"],
      },
      {
        eyebrow: "IA aplicada",
        title: "La IA como tu ventaja injusta.",
        body: "De prompt engineering a agentes personalizados y automatizaciones que multiplican tu output. Aprendes a usar la IA para buscar empleo, cerrar clientes y operar tu negocio.",
        points: ["Prompt engineering", "Agentes a medida", "Automatización no-code"],
      },
    ],
    // Textos de los mockups del héroe (las "capturas" del campus). Van aquí
    // y no en el componente porque también hay que leerlos en inglés.
    mock: {
      trackBadge: "RUTA 02 · 3/5",
      steps: ["Comunicar en asíncrono", "Escribir para decidir", "Proteger tu foco"],
      slackMsg: "Nueva lección disponible en tu ruta · Ruta 03",
      slackCta: "Abrir en el campus",
    },
    integration: {
      eyebrow: "Stack real",
      title: "Aprendes con las herramientas que de verdad se usan.",
      body: "Notion, Slack, Wise, Deel, Zapier, LLMs… Montas tu propio sistema operativo remoto y el campus te avisa de cada avance en Slack.",
    },
    bento: {
      stat1: { value: "+320", label: "profesionales formados en 18 países" },
      stat2: { value: "56h", label: "en directo, en 7 fines de semana" },
      quote:
        "«El remoto no falla por la distancia. Falla cuando no sabemos adaptarnos a esta forma de trabajar.»",
      quoteBy: "Manifiesto ActiveXRemote",
    },
    paths: {
      eyebrow: "Elige tu curso",
      title: "Dos cursos. Un mismo nivel de exigencia.",
      lead: "Comparten los 7 módulos núcleo y se separan en la especialización. Puedes hacer los dos cursos.",
      cta: "Solicita información",
      detail: "Ver el programa completo",
      items: [
        {
          tag: "Curso 01",
          name: "Curso Remote Professional",
          sub: "Career Accelerator",
          href: "/cursos/remote-professional",
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
          tag: "Curso 02",
          name: "Curso Remote Founder",
          sub: "Global Builder",
          href: "/cursos/remote-founder",
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
      coreTag: "Fase 1 · Núcleo común",
      coreName: "Fundamentos globales",
      // El currículo entero desplegado añadía miles de píxeles al centro del
      // embudo. Ahora se ve la estructura y el detalle se pide.
      coreToggle: "Ver los 7 módulos del núcleo",
      trackToggle: "Ver los 7 módulos",
      modules: [
        { n: "01", title: "Mindset remoto y el nuevo mercado global", desc: "De empleado local a «startup personal» en un mercado global competitivo." },
        { n: "02", title: "Geoposicionamiento y optimización fiscal", desc: "Maximiza tu ingreso neto con residencia, visados y fiscalidad inteligente." },
        { n: "03", title: "Blueprint de reubicación internacional", desc: "La logística real de montar tu vida y tu banca en otro país, sin sustos." },
        { n: "04", title: "Stack tecnológico de alto rendimiento", desc: "Notion, Slack, Wise y automatización para operar en asíncrono." },
        { n: "05", title: "IA para productividad remota", desc: "Prompt engineering, agentes y síntesis para multiplicar tu output." },
        { n: "06", title: "Life Ops: energía y anti-burnout", desc: "Timeboxing, límites digitales y hábitos para rendir sin quemarte." },
        { n: "07", title: "Legal y compliance transfronterizo", desc: "Contratos, facturación internacional y estatus legal claro." },
      ],
      tracksTag: "Fase 2 · Especialización",
      tracksTitle: "Y después, los 7 módulos de tu curso.",
      trackCta: "Ver el curso completo",
      tracks: [
        {
          tag: "Camino 01",
          name: "Remote Professional",
          href: "/cursos/remote-professional",
          modules: [
            { n: "08", title: "Advanced Remote Job Hacking", desc: "Encuentra las oportunidades ocultas y llega a quien decide." },
            { n: "09", title: "AI-Driven Job Hunting & Application Engineering", desc: "IA para analizar ofertas, superar filtros ATS y personalizar candidaturas." },
            { n: "10", title: "International Personal Branding & Portfolios", desc: "CV, LinkedIn y portfolio listos para recruiters internacionales." },
            { n: "11", title: "Video & Asynchronous Interview Performance", desc: "Domina la entrevista en vídeo y la comunicación asíncrona." },
            { n: "12", title: "Global Salary Negotiation & Compensation", desc: "Analiza tu compensación total y prepara contraofertas." },
            { n: "13", title: "Onboarding & Succeeding in Distributed Teams", desc: "Construye confianza durante tus primeros 90 días." },
            { n: "14", title: "Career Scaling & Fractional Remote Operations", desc: "Evoluciona hacia roles senior, advisory y fractional." },
          ],
        },
        {
          tag: "Camino 02",
          name: "Remote Founder",
          href: "/cursos/remote-founder",
          modules: [
            { n: "08", title: "Freedom Business Design & Market Validation", desc: "Elige modelo, encuentra el problema y valida antes de construir." },
            { n: "09", title: "AI-Driven Business Operations & Marketing", desc: "Opera y haz marketing con IA de principio a fin." },
            { n: "10", title: "B2B Client Acquisition & International Sales", desc: "Consigue clientes internacionales con outbound e inbound." },
            { n: "11", title: "High-Converting Offers & Minimalist Landing Pages", desc: "Ofertas premium y páginas simples que convierten." },
            { n: "12", title: "Distributed Operations Systems & SOPs", desc: "Documenta procesos, dashboards y entrega al cliente." },
            { n: "13", title: "Automation, Delegation & Scaling Up", desc: "Decide qué automatizar, qué delegar y qué mantener." },
            { n: "14", title: "Borderless Corporate Formations & Asset Protection", desc: "Estructura tu empresa y protege tus activos a nivel global." },
          ],
        },
      ],
    },
    // Valoraciones del héroe. ⚠︎ PLACEHOLDER: son datos de maqueta sobre
    // nuestro propio programa. Para G2/Trustpilot hace falta perfil real y
    // su widget oficial (ver rating-badges.tsx).
    ratings: [
      { mark: "star" as const, score: "4,8/5", label: "320+ opiniones de alumnos" },
      { mark: "g2" as const, score: "4,8/5", label: "120+ reseñas" },
      { mark: "trustpilot" as const, score: "4,7/5", label: "90+ reseñas" },
    ],
    // Colaboradores del programa.
    //
    // ⚠︎ Esta sección decía que Deel, Remoteandtalent.com y Slack "auditan y
    // certifican" los módulos y que su sello va en el diploma. Sin un acuerdo
    // firmado con las tres, eso es una afirmación sobre terceros que no se
    // puede sostener. Ahora se describen como lo que son —las herramientas que
    // se estudian— y la nota final incluye el descargo de marcas. Si algún día
    // hay acuerdo por escrito, se podrá volver a hablar de certificación.
    // ⚠︎ PLACEHOLDER — cifras, valoraciones, testimonios y marcas son
    // ejemplos de maquetación. Sustituir por datos reales antes de publicar:
    // un testimonio inventado atribuido a una persona es publicidad engañosa.
    social: {
      eyebrow: "Alumni",
      title: "Ya lo están haciendo.",
      lead: "Profesionales que salieron del programa con un sistema, no con apuntes.",
      stats: [
        { value: "+320", label: "alumnos formados" },
        { value: "18", label: "países" },
        { value: "4,8/5", label: "valoración media" },
      ],
      logosTitle: "Nuestros alumnos trabajan hoy en equipos distribuidos como",
      logos: ["Northwind", "Lumen Labs", "Cobalt", "Fernweh", "Atlas Remote", "Kiona"],
      items: [
        {
          quote:
            "Llevaba un año echando currículums a ciegas. Con el módulo de job hacking pasé de enviar CV a hablar directamente con quien contrata: tres procesos abiertos en cinco semanas.",
          name: "Marta G.",
          role: "Product Designer · Valencia",
          course: "Remote Professional",
        },
        {
          quote:
            "Facturaba por horas y vivía pegada al calendario. Empaqueté mi servicio, subí precio y ahora entrego lo mismo con la mitad de reuniones.",
          name: "Nadia R.",
          role: "Consultora de operaciones · Bogotá",
          course: "Remote Founder",
        },
        {
          quote:
            "La parte legal y fiscal era mi bloqueo real. Salí con el contrato, la facturación internacional y la estructura resueltas, y firmé mi primer cliente en EE. UU.",
          name: "Iván P.",
          role: "Desarrollador freelance · Bilbao",
          course: "Remote Founder",
        },
      ],
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
      eyebrow: "Convocatoria",
      title: "Una escuela. Dos cursos. Un mismo campus.",
      lead: "Cada convocatoria es un grupo reducido: clases en directo, campus virtual con las grabaciones y acompañamiento en Slack durante todo el programa.",
      planName: "Un curso · 14 módulos",
      // ⚠︎ SIN PRECIOS por ahora, a petición del equipo, y sin botón de
      // matrícula: la única salida es pedir información. Los importes eran
      // 2.400 € por curso (o 3 plazos de 800 €), 3.900 € los dos y 2.100 € de
      // matrícula anticipada; si vuelven, van aquí y en el FAQ.
      planStart: "Arranca el 9 de enero de 2027 · grupos de 25 plazas",
      features: [
        "14 módulos en directo (56 h lectivas)",
        "Dos clases de 4 h por fin de semana, durante 7 fines de semana",
        "Campus virtual con grabaciones y audio narrado",
        "Frameworks y plantillas descargables",
        "Ejercicio práctico y feedback en cada módulo",
        "Comunidad y seguimiento en Slack",
        "Diploma de ActiveXRemote con los módulos superados",
      ],
      cta: "Solicita información",
    },
    // Cronograma real de la convocatoria. Todo lo que se afirma aquí sale de
    // datos que ya sostiene el resto de la página (14 módulos, dos clases de
    // 4 h por fin de semana, 7 fines de semana del 9 de enero al 21 de febrero
    // de 2027, grupos de 25, diploma emitido por la escuela). Es el mismo
    // calendario que la landing de campaña (trabajo-remoto/copy.ts).
    steps: {
      eyebrow: "Cómo funciona",
      title: "Siete fines de semana, paso a paso.",
      lead: "Dos clases de 4 horas en directo cada fin de semana. Un módulo, un ejercicio y un entregable por clase. Esto es lo que pasa desde que solicitas plaza hasta que sales con el diploma.",
      totalLabel: "Duración total",
      total: "7 fines de semana · 56 h en directo",
      doesLabel: "Qué haces",
      getsLabel: "Qué te llevas",
      items: [
        {
          n: "00",
          phase: "Antes de empezar",
          when: "Antes del 9 de enero",
          meta: "Grupos de 25 plazas",
          title: "Solicitas plaza y entras al campus",
          desc: "Nos dices qué camino te interesa y te contamos cómo funciona el programa, sin compromiso. Las convocatorias son de 25 plazas, así que el orden de solicitud importa.",
          does: [
            "Envías la solicitud desde esta página",
            "Te enviamos calendario, horarios y condiciones",
            "Reservas plaza en pago único o en 3 plazos",
          ],
          gets: "Acceso al campus virtual y al canal de tu convocatoria en Slack.",
        },
        {
          n: "01",
          phase: "Fase 1 · Núcleo común",
          when: "Fines de semana 1 – 4",
          meta: "7 módulos · 28 h",
          title: "Montas la base del trabajo remoto",
          desc: "Los siete módulos que comparten los dos caminos: mindset y mercado global, geoposicionamiento y fiscalidad, reubicación, stack tecnológico, IA aplicada, energía y anti-burnout, y legal transfronterizo.",
          does: [
            "Dos módulos por fin de semana, 4 h en directo cada uno",
            "Teoría, walkthrough de herramientas y workshop",
            "Un ejercicio por módulo, aplicado a tu caso",
          ],
          gets: "Tu propio sistema operativo remoto: fiscalidad, herramientas, comunicación asíncrona y hábitos montados y funcionando.",
        },
        {
          n: "02",
          phase: "El cruce",
          when: "Fin de semana 4",
          meta: "Decisión reversible",
          title: "Eliges camino con criterio",
          desc: "Con el núcleo terminado ya sabes dónde encajas: Remote Professional si vas a por el empleo remoto internacional, Remote Founder si vas a construir tu propio negocio. No es una decisión a ciegas, y puedes cambiar cuando quieras.",
          does: [
            "Repasas lo que has entregado en el núcleo",
            "Eliges Professional o Founder",
            "Si te interesan los dos, puedes cursarlos",
          ],
          gets: "Los siete módulos que vienen, elegidos con datos y no con intuición.",
        },
        {
          n: "03",
          phase: "Fase 2 · Especialización",
          when: "Fines de semana 4 – 7",
          meta: "7 módulos · 28 h",
          title: "Construyes lo que vas a enseñar",
          desc: "Aquí ya no se estudia: se produce. Professional sale con la candidatura, el portfolio y la negociación preparados. Founder sale con la oferta validada, los clientes y la operativa documentada.",
          does: [
            "Dos módulos por fin de semana, 4 h en directo cada uno",
            "Entregables reales, no apuntes",
            "Feedback del equipo y seguimiento en Slack",
          ],
          gets: "Professional: CV, LinkedIn y portfolio internacionales listos para recruiters. Founder: oferta, captación y operativa de tu negocio en marcha.",
        },
        {
          n: "04",
          phase: "Después",
          when: "Desde el 21 de febrero",
          meta: "Acceso sin caducidad",
          title: "Te certificas y te quedas dentro",
          desc: "El programa termina, el acceso no. El campus con las grabaciones y el audio narrado sigue abierto, y el diploma detalla módulo a módulo lo que has superado.",
          does: [
            "Recibes el diploma con los módulos superados y las horas lectivas",
            "Conservas campus, grabaciones y plantillas",
            "Sigues en la comunidad de la convocatoria",
          ],
          gets: "Un diploma verificable emitido por ActiveXRemote, con el detalle de lo que has superado.",
        },
      ],
    },
    faq: {
      eyebrow: "Dudas",
      title: "Preguntas frecuentes.",
      items: [
        { q: "¿Qué camino me conviene?", a: "Remote Professional si buscas un empleo remoto internacional; Remote Founder si quieres lanzar tu propio negocio. Y puedes hacer los dos: comparten los 7 módulos núcleo." },
        { q: "¿Cuánto cuesta?", a: "Solicita información y te enviamos el precio, las formas de pago —pago único o a plazos— y las condiciones de la convocatoria, sin compromiso." },
        { q: "¿Cuántos módulos tiene el programa?", a: "14 en total: 7 módulos núcleo compartidos y 7 especializados según el camino que elijas (Professional o Founder)." },
        { q: "¿Cuánto dura cada clase?", a: "Cada módulo es una clase de 4 horas en vivo: teoría, walkthrough de herramientas, workshop práctico y Q&A." },
        { q: "¿Necesito conocimientos previos?", a: "No. Los 7 módulos núcleo parten de cero y la especialización sube de nivel de forma progresiva." },
        { q: "¿Qué herramientas voy a usar?", a: "Notion, Slack, Wise, Deel, Zapier y modelos de IA, entre otras. Montas tu propio stack remoto durante el programa." },
        { q: "¿Es en directo o asíncrono?", a: "Las clases son en vivo, y tienes material, audio narrado y ejercicios para avanzar a tu ritmo en asíncrono." },
        { q: "¿Cuándo empieza la próxima convocatoria?", a: "El 9 de enero de 2027. Son siete fines de semana, hasta el 21 de febrero, con dos clases de 4 h cada fin de semana. Los grupos son de 25 plazas: solicita información y te enviamos calendario y horarios." },
        { q: "¿El diploma es un título oficial?", a: "No. Es una certificación privada que emite ActiveXRemote: el diploma detalla los módulos superados y las horas lectivas. No equivale a un grado universitario ni a un título académico oficial, y no lo acredita ninguna de las plataformas que se estudian en el programa." },
      ],
    },
    finalCta: {
      title: "Tu carrera —o tu negocio— sin fronteras",
      titleAccent: "empieza aquí.",
      body: "Déjanos tus datos y te contamos cómo funciona el programa, sin compromiso.",
    },
    footer: {
      tagline: "The Remote Business School · formación en trabajo remoto global",
      access: "El campus virtual es de acceso restringido a alumnos matriculados",
      cols: [
        { title: "Cursos", links: [{ href: "/cursos/remote-professional", label: "Remote Professional" }, { href: "/cursos/remote-founder", label: "Remote Founder" }, { href: "#modulos", label: "Módulos" }] },
        { title: "Escuela", links: [{ href: "#metodo", label: "Método" }, { href: "#faq", label: "FAQ" }, { href: "#solicitar", label: "Solicita información" }] },
        {
          title: "Recursos",
          links: [
            { href: "/blog", label: "Blog" },
            { href: "/glosario", label: "Diccionario" },
          ],
        },
        { title: "Campus virtual", links: [{ href: "/login", label: "Entrar al campus" }] },
        {
          title: "Legal",
          links: [
            { href: "/legal/aviso-legal", label: "Aviso legal" },
            { href: "/legal/privacidad", label: "Privacidad" },
            { href: "/legal/cookies", label: "Cookies" },
            { href: "/legal/terminos", label: "Condiciones" },
          ],
        },
      ],
      cookieSettings: "Configurar cookies",
      pay: {
        // Se afirma sólo lo comprobable: el sitio va por HTTPS y el cobro lo
        // hace Stripe, así que la tarjeta no pasa por nuestros servidores.
        secure: "Conexión cifrada (TLS/SSL). La tarjeta la procesa Stripe: no la vemos ni la guardamos.",
        accepted: "Métodos de pago aceptados",
        processor: "Pagos procesados por",
      },
    },
  },
  en: {
    meta: {
      title: "ActiveXRemote · The Remote Business School",
      description:
        "Land the international remote job you deserve and learn to build your own global business. 14 live modules and two paths: Remote Professional and Remote Founder.",
    },
    // ⚠︎ Seats left is placeholder data.
    ticker: {
      intro: "The cohort starts on 9 January",
      seats: "8 of 25 seats left",
      units: { d: "days", h: "hours", m: "min", s: "sec" },
    },
    nav: {
      courses: {
        label: "Courses",
        items: [
          { href: "/cursos/remote-professional", label: "Remote Professional Course" },
          { href: "/cursos/remote-founder", label: "Remote Founder Course" },
        ],
      },
      links: [
        { href: "#metodo", label: "Method" },
        { href: "/blog", label: "Blog" },
        { href: "#faq", label: "FAQ" },
      ],
      campus: "Virtual campus",
      cta: "Request information",
      ctaShort: "Get info",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      menuExplore: "Explore",
    },
    hero: {
      brand: "ACTIVEXREMOTE",
      tagline: "The Remote Business School",
      titleTop: "It's not that you lack talent.",
      titleBottom: "It's that nobody taught you to work without borders.",
      lead: "Land the international remote job you deserve and learn to build your own global business.",
      chooseLabel: "What do you want to achieve?",
      choose: [
        { title: "I want an international remote job", name: "Remote Professional course", href: "/cursos/remote-professional" },
        { title: "I want to build my own remote business", name: "Remote Founder course", href: "/cursos/remote-founder" },
      ],
      stats: [
        { value: "14", label: "modules" },
        { value: "56h", label: "live" },
        { value: "7", label: "weekends" },
        { value: "2", label: "courses" },
      ],
    },
    form: {
      eyebrow: "Request information",
      title: "Take the first step.",
      lead: "Tell us which course you're interested in and we'll send you the full program, dates and terms.",
      courseLabel: "Which course interests you?",
      courseHint: "Optional. You can pick both.",
      courses: [
        { key: "remote-professional", label: "Remote Professional course", sub: "Career Accelerator" },
        { key: "remote-founder", label: "Remote Founder course", sub: "Global Builder" },
      ],
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      city: "City",
      submit: "Request information",
      sending: "Sending…",
      okTitle: "Request received.",
      okBody: "We'll get back to you within 24 business hours with all the details.",
      legal: "We only use your data to send you course information. No spam.",
      errors: {
        missing_course: "Pick at least one course.",
        missing_fields: "Please fill in every field.",
        bad_name: "Check the first name and surname.",
        bad_email: "Check the email address.",
        bad_phone: "Check the phone number: digits only, with country code if you're outside Spain.",
        bad_city: "Check the city.",
        too_many: "We already have your request. We'll write within 24 working hours.",
        db: "Couldn't send it. Please try again in a moment.",
      },
    },
    proof: {
      title: "Everything you need to operate remotely, on a global scale",
      chips: [
        "Remote work",
        "International hiring",
        "International banking",
        "Global collections",
        "FX and multicurrency",
        "Financial security",
        "Tax optimization",
        "International visas",
        "Global mobility",
        "Global freelancing",
        "Remote entrepreneurship",
        "Borderless company",
        "International compliance",
        "Digital security",
        "Remote-first tooling",
        "Remote productivity",
        "Team management",
        "International contracts",
        "Employee benefits",
        "Equity & stock options",
        "Global cost of living",
        "Tax geography",
        "Digital nomad hubs",
        "International social security",
        "International insurance",
        "Global accounting",
        "Cross-border payments",
        "Personal finance",
        "Multi-currency income",
        "Global networking",
        "International career",
        "Geographic freedom",
        "Applied AI",
        "Salary negotiation",
        "Automation",
      ],
    },
    flash: {
      eyebrow: "FLASH COURSES",
      title: "Not ready for a whole programme?",
      lead: "A flash course is four hours of video with real missions and graded exercises, at one closed price. You start today, you build one concrete thing and you finish it.",
      traits: [
        { title: "4 h in micro-lessons", body: "None runs past twelve minutes." },
        { title: "You build it", body: "Every lesson ends in a mission." },
        { title: "It gets graded", body: "A score out of 100 and real feedback." },
        { title: "Closed price", body: "One payment. Access forever." },
      ],
      allCta: "See all flash courses",
      card: {
        hours: "of video",
        lessons: "lessons",
        missions: "missions",
        cta: "See the course",
        buy: "Buy",
        sending: "Opening payment…",
        buyError: "We couldn't open the payment. Try again.",
        gift: "Gift:",
        ninja: "Hack:",
      },
    },
    statement: {
      top: "ActiveXRemote, Top #1 in hands-on, 100% up-to-date Remote Business training.",
      bottom: "Train live and online, with a method designed to keep pace with today's remote market.",
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
        points: ["7 core modules", "7 specialized", "You can take both paths"],
      },
      {
        eyebrow: "Applied AI",
        title: "AI as your unfair advantage.",
        body: "From prompt engineering to custom agents and automations that multiply your output. Learn to use AI to find work, close clients and run your business.",
        points: ["Prompt engineering", "Custom agents", "No-code automation"],
      },
    ],
    mock: {
      trackBadge: "TRACK 02 · 3/5",
      steps: ["Communicating async", "Writing to decide", "Protecting your focus"],
      slackMsg: "New lesson available on your track · Track 03",
      slackCta: "Open in the campus",
    },
    integration: {
      eyebrow: "Real stack",
      title: "Learn with the tools people actually use.",
      body: "Notion, Slack, Wise, Deel, Zapier, LLMs… You build your own remote operating system and the campus pings every milestone in Slack.",
    },
    bento: {
      stat1: { value: "+320", label: "professionals trained across 18 countries" },
      stat2: { value: "56h", label: "live, across 7 weekends" },
      quote:
        "“Remote doesn't fail because of distance. It fails when we don't adapt to this way of working.”",
      quoteBy: "ActiveXRemote Manifesto",
    },
    paths: {
      eyebrow: "Choose your course",
      title: "Two courses. One level of rigor.",
      lead: "They share the 7 core modules and split at specialization. You can take both courses.",
      cta: "Request information",
      detail: "See the full program",
      items: [
        {
          tag: "Course 01",
          name: "Remote Professional course",
          sub: "Career Accelerator",
          href: "/cursos/remote-professional",
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
          tag: "Course 02",
          name: "Remote Founder course",
          sub: "Global Builder",
          href: "/cursos/remote-founder",
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
      coreTag: "Phase 1 · Shared core",
      coreName: "Global foundations",
      coreToggle: "See the 7 core modules",
      trackToggle: "See the 7 modules",
      modules: [
        { n: "01", title: "Remote mindset & the new global market", desc: "From local employee to a “personal startup” in a competitive global market." },
        { n: "02", title: "Geo-positioning & tax optimization", desc: "Maximize your net income with smart residency, visas and taxes." },
        { n: "03", title: "International relocation blueprint", desc: "The real logistics of setting up your life and banking abroad, safely." },
        { n: "04", title: "High-performance tech stack", desc: "Notion, Slack, Wise and automation to operate asynchronously." },
        { n: "05", title: "AI for remote productivity", desc: "Prompt engineering, agents and synthesis to multiply your output." },
        { n: "06", title: "Life Ops: energy & anti-burnout", desc: "Timeboxing, digital boundaries and habits to perform without burning out." },
        { n: "07", title: "Cross-border legal & compliance", desc: "Contracts, international invoicing and a clear legal status." },
      ],
      tracksTag: "Phase 2 · Specialization",
      tracksTitle: "Then, the 7 modules of your course.",
      trackCta: "See the full course",
      tracks: [
        {
          tag: "Path 01",
          name: "Remote Professional",
          href: "/cursos/remote-professional",
          modules: [
            { n: "08", title: "Advanced Remote Job Hacking", desc: "Find the hidden openings and reach the people who decide." },
            { n: "09", title: "AI-Driven Job Hunting & Application Engineering", desc: "AI to analyze job posts, beat ATS filters and tailor applications." },
            { n: "10", title: "International Personal Branding & Portfolios", desc: "CV, LinkedIn and portfolio ready for international recruiters." },
            { n: "11", title: "Video & Asynchronous Interview Performance", desc: "Master the video interview and async communication." },
            { n: "12", title: "Global Salary Negotiation & Compensation", desc: "Analyze total compensation and prepare counter-offers." },
            { n: "13", title: "Onboarding & Succeeding in Distributed Teams", desc: "Build trust during your first 90 days." },
            { n: "14", title: "Career Scaling & Fractional Remote Operations", desc: "Move toward senior, advisory and fractional roles." },
          ],
        },
        {
          tag: "Path 02",
          name: "Remote Founder",
          href: "/cursos/remote-founder",
          modules: [
            { n: "08", title: "Freedom Business Design & Market Validation", desc: "Pick a model, find the problem and validate before you build." },
            { n: "09", title: "AI-Driven Business Operations & Marketing", desc: "Run operations and marketing with AI end to end." },
            { n: "10", title: "B2B Client Acquisition & International Sales", desc: "Win international clients with outbound and inbound." },
            { n: "11", title: "High-Converting Offers & Minimalist Landing Pages", desc: "Premium offers and simple pages that convert." },
            { n: "12", title: "Distributed Operations Systems & SOPs", desc: "Document processes, dashboards and client delivery." },
            { n: "13", title: "Automation, Delegation & Scaling Up", desc: "Decide what to automate, what to delegate and what to keep." },
            { n: "14", title: "Borderless Corporate Formations & Asset Protection", desc: "Structure your company and protect your assets globally." },
          ],
        },
      ],
    },
    // ⚠︎ PLACEHOLDER — see the note on the Spanish block above.
    ratings: [
      { mark: "star" as const, score: "4.8/5", label: "320+ student reviews" },
      { mark: "g2" as const, score: "4.8/5", label: "120+ reviews" },
      { mark: "trustpilot" as const, score: "4.7/5", label: "90+ reviews" },
    ],
    // ⚠︎ PLACEHOLDER — see the note on the Spanish block above.
    social: {
      eyebrow: "Alumni",
      title: "They're already doing it.",
      lead: "Professionals who left the program with a system, not with notes.",
      stats: [
        { value: "+320", label: "students trained" },
        { value: "18", label: "countries" },
        { value: "4.8/5", label: "average rating" },
      ],
      logosTitle: "Our alumni now work in distributed teams like",
      logos: ["Northwind", "Lumen Labs", "Cobalt", "Fernweh", "Atlas Remote", "Kiona"],
      items: [
        {
          quote:
            "I spent a year sending CVs into the void. With the job hacking module I went from applying to talking directly to hiring managers: three live processes in five weeks.",
          name: "Marta G.",
          role: "Product Designer · Valencia",
          course: "Remote Professional",
        },
        {
          quote:
            "I billed by the hour and lived glued to my calendar. I productized my service, raised my price and now I deliver the same with half the meetings.",
          name: "Nadia R.",
          role: "Operations consultant · Bogotá",
          course: "Remote Founder",
        },
        {
          quote:
            "Legal and tax was my real blocker. I finished with the contract, international invoicing and structure sorted, and signed my first US client.",
          name: "Iván P.",
          role: "Freelance developer · Bilbao",
          course: "Remote Founder",
        },
      ],
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
      eyebrow: "Cohort",
      title: "One school. Two courses. One campus.",
      lead: "Every cohort is a small group: live classes, a virtual campus with the recordings and support on Slack throughout the program.",
      planName: "One course · 14 modules",
      planStart: "Starts 9 January 2027 · groups of 25 seats",
      features: [
        "14 live modules (56 teaching hours)",
        "Two 4h classes per weekend, over 7 weekends",
        "Virtual campus with recordings and narrated audio",
        "Downloadable frameworks and templates",
        "Hands-on exercise and feedback in every module",
        "Community and follow-up on Slack",
        "An ActiveXRemote diploma listing the modules you completed",
      ],
      cta: "Request information",
    },
    steps: {
      eyebrow: "How it works",
      title: "Seven weekends, step by step.",
      lead: "Two 4-hour live classes every weekend. One module, one exercise and one deliverable per class. This is what happens from the moment you apply to the day you leave with the diploma.",
      totalLabel: "Total length",
      total: "7 weekends · 56 h live",
      doesLabel: "What you do",
      getsLabel: "What you walk away with",
      items: [
        {
          n: "00",
          phase: "Before you start",
          when: "Before 9 January",
          meta: "Groups of 25 seats",
          title: "You apply and get into the campus",
          desc: "You tell us which path interests you and we explain how the program works, no strings attached. Cohorts are capped at 25 seats, so when you apply matters.",
          does: [
            "You send the application from this page",
            "We send you the calendar, schedule and terms",
            "You book your seat in one payment or 3 instalments",
          ],
          gets: "Access to the virtual campus and to your cohort's Slack channel.",
        },
        {
          n: "01",
          phase: "Phase 1 · Common core",
          when: "Weekends 1 – 4",
          meta: "7 modules · 28 h",
          title: "You build the remote-work base",
          desc: "The seven modules both paths share: mindset and global market, geopositioning and tax, relocation, tech stack, applied AI, energy and anti-burnout, and cross-border legal.",
          does: [
            "Two modules per weekend, 4 h live each",
            "Theory, tool walkthrough and workshop",
            "One exercise per module, applied to your own case",
          ],
          gets: "Your own remote operating system: tax, tools, async communication and habits set up and running.",
        },
        {
          n: "02",
          phase: "The fork",
          when: "Weekend 4",
          meta: "Reversible decision",
          title: "You choose your path on evidence",
          desc: "With the core done you know where you fit: Remote Professional if you're going for an international remote job, Remote Founder if you're building your own business. It isn't a blind call, and you can switch anytime.",
          does: [
            "You review what you delivered in the core",
            "You pick Professional or Founder",
            "If both appeal to you, you can take both",
          ],
          gets: "The next seven modules, chosen on evidence rather than instinct.",
        },
        {
          n: "03",
          phase: "Phase 2 · Specialization",
          when: "Weekends 4 – 7",
          meta: "7 modules · 28 h",
          title: "You build what you'll show",
          desc: "This is no longer studying: it's producing. Professional leaves with the application, portfolio and negotiation ready. Founder leaves with a validated offer, clients and documented operations.",
          does: [
            "Two modules per weekend, 4 h live each",
            "Real deliverables, not lecture notes",
            "Team feedback and follow-up in Slack",
          ],
          gets: "Professional: international CV, LinkedIn and portfolio ready for recruiters. Founder: your offer, client acquisition and operations up and running.",
        },
        {
          n: "04",
          phase: "Afterwards",
          when: "From 21 February",
          meta: "Access never expires",
          title: "You get certified and you stay in",
          desc: "The program ends, the access doesn't. The campus with recordings and narrated audio stays open, and the diploma lists module by module what you completed.",
          does: [
            "You receive the diploma with the modules completed and the teaching hours",
            "You keep campus, recordings and templates",
            "You stay in your cohort's community",
          ],
          gets: "A verifiable diploma issued by ActiveXRemote, detailing exactly what you completed.",
        },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked.",
      items: [
        { q: "Which path suits me?", a: "Remote Professional if you want an international remote job; Remote Founder if you want to launch your own business. And you can take both: they share the 7 core modules." },
        { q: "How much does it cost?", a: "Request information and we'll send you the price, the payment options —one payment or instalments— and the cohort's terms, no strings attached." },
        { q: "How many modules are there?", a: "14 in total: 7 shared core modules and 7 specialized ones based on your chosen path (Professional or Founder)." },
        { q: "How long is each class?", a: "Every module is a 4-hour live class: theory, tool walkthrough, hands-on workshop and Q&A." },
        { q: "Do I need prior knowledge?", a: "No. The 7 core modules start from scratch and the specialization levels up progressively." },
        { q: "What tools will I use?", a: "Notion, Slack, Wise, Deel, Zapier and AI models, among others. You build your own remote stack during the program." },
        { q: "Is it live or async?", a: "Classes are live, and you get materials, narrated audio and exercises to progress at your own pace, async." },
        { q: "When does the next cohort start?", a: "9 January 2027. It runs over seven weekends, until 21 February, with two 4h classes each weekend. Groups are capped at 25 seats: request information and we'll send you the calendar and schedule." },
        { q: "Is the diploma an official degree?", a: "No. It is a private certification issued by ActiveXRemote: the diploma lists the modules you completed and the teaching hours. It is not equivalent to a university or official academic degree, and none of the platforms studied in the program accredits it." },
      ],
    },
    finalCta: {
      title: "Your borderless career —or business—",
      titleAccent: "starts here.",
      body: "Leave us your details and we'll walk you through the program, no strings attached.",
    },
    footer: {
      tagline: "The Remote Business School · global remote work training",
      access: "The virtual campus is restricted to enrolled students",
      cols: [
        { title: "Courses", links: [{ href: "/cursos/remote-professional", label: "Remote Professional" }, { href: "/cursos/remote-founder", label: "Remote Founder" }, { href: "#modulos", label: "Modules" }] },
        { title: "School", links: [{ href: "#metodo", label: "Method" }, { href: "#faq", label: "FAQ" }, { href: "#solicitar", label: "Request information" }] },
        {
          title: "Resources",
          links: [
            { href: "/blog", label: "Blog" },
            { href: "/glosario", label: "Dictionary" },
          ],
        },
        { title: "Virtual campus", links: [{ href: "/login", label: "Enter the campus" }] },
        {
          title: "Legal",
          links: [
            { href: "/legal/aviso-legal", label: "Legal notice" },
            { href: "/legal/privacidad", label: "Privacy" },
            { href: "/legal/cookies", label: "Cookies" },
            { href: "/legal/terminos", label: "Terms" },
          ],
        },
      ],
      cookieSettings: "Cookie settings",
      pay: {
        secure: "Encrypted connection (TLS/SSL). Your card is processed by Stripe: we never see it or store it.",
        accepted: "Accepted payment methods",
        processor: "Payments processed by",
      },
    },
  },
} satisfies Record<Locale, unknown>;
