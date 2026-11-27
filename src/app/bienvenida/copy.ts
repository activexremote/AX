import type { Locale } from "@/lib/i18n/config";

// Contenido de la landing pública. Autocontenido (no ensucia el diccionario
// global del campus). Bilingüe ES/EN.
//
// Formato 2.0 (nov. 2026): dos cursos independientes, Remote Professional
// (8 semanas) y Remote Founder (13), sin módulos compartidos. Cada semana:
// material previo, 6 vídeos de 30 min, una clase en directo de 2 h entre
// semana, ejercicio sobre el caso propio y un test; unas 12,5 h en total.
// Las semanas de cada curso salen de cursos/copy.ts: lo que dice la home y lo
// que dicen las landings de curso no se pueden separar.
export type LandingCopy = (typeof landingCopy)["es"];

export const landingCopy = {
  es: {
    // Título y descripción de la home. Estaban en duro y en español dentro de
    // page.tsx, así que la versión inglesa se anunciaba en español tanto al
    // compartirla como en los resultados de búsqueda.
    meta: {
      title: "ActiveXRemote · The Remote Business School",
      description:
        "Consigue el empleo remoto internacional que mereces o construye tu propio negocio global. Dos cursos online con clases en directo: Remote Professional (8 semanas) y Remote Founder (13 semanas).",
    },
    // Barra superior. Sin contador de plazas libres: sólo se dice el tamaño
    // del grupo, que es real. Si algún día se enseñan las libres, que salgan
    // de las matrículas de verdad.
    ticker: {
      intro: "La convocatoria arranca el 9 de enero",
      seats: "Grupos de 25 plazas",
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
        { value: "8", label: "semanas · Professional" },
        { value: "13", label: "semanas · Founder" },
        { value: "12,5 h", label: "a la semana" },
        { value: "25", label: "plazas por grupo" },
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
    // ⚠︎ Nada de «Top #1» ni «líder»: son superlativos comparativos y la
    // Directiva 2005/29/CE pide poder demostrarlos. «Especialista» describe
    // lo que somos sin compararnos con nadie.
    statement: {
      top: "ActiveXRemote, la escuela especialista en formación práctica y 100 % actualizada en Remote Business.",
      bottom: "Fórmate en directo y online, con una metodología diseñada para avanzar al ritmo del mercado remoto actual.",
    },
    features: [
      {
        eyebrow: "El método",
        title: "No es teoría. Es ejecución.",
        body: "La teoría va antes y en vídeo: 6 vídeos de 30 minutos cada semana. La clase en directo, de 2 horas, es para practicar, y la semana acaba con un ejercicio sobre tu propio caso. Sales con entregables, no con apuntes.",
        points: ["6 vídeos por semana", "Clase en directo de 2 h", "Ejercicio sobre tu caso"],
      },
      {
        eyebrow: "Dos caminos",
        title: "Empleo o negocio. Tú eliges.",
        body: "Dos cursos, cada uno con su propio recorrido semana a semana: Remote Professional, 8 semanas para conseguir un empleo remoto internacional, o Remote Founder, 13 semanas para construir tu propio negocio borderless.",
        points: ["8 semanas · Professional", "13 semanas · Founder", "Puedes hacer los dos"],
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
      stat2: { value: "12,5 h", label: "a la semana, compatibles con tu trabajo" },
      quote:
        "«El remoto no falla por la distancia. Falla cuando no sabemos adaptarnos a esta forma de trabajar.»",
      quoteBy: "Manifiesto ActiveXRemote",
    },
    paths: {
      eyebrow: "Elige tu curso",
      title: "Dos cursos. Un mismo nivel de exigencia.",
      lead: "Cada uno con su propio recorrido, semana a semana y sobre tu caso real. Puedes hacer los dos.",
      cta: "Solicita información",
      detail: "Ver el programa completo",
      items: [
        {
          tag: "Curso 01",
          name: "Curso Remote Professional",
          sub: "Career Accelerator",
          href: "/cursos/remote-professional",
          forWho: "8 semanas · para empleados y contractors",
          desc: "Consigue tu empleo remoto internacional: decides qué buscas, haces que te encuentren, firmas el contrato adecuado y empiezas con la IA de tu lado.",
          outcomes: [
            "Decides qué buscas y adónde vas",
            "CV y LinkedIn que hacen que te encuentren",
            "Alertas con IA que encuentran las vacantes por ti",
            "Entrevista superada y oferta negociada",
            "Contrato y cobro en regla desde cualquier país",
            "La IA como ayudante en tu nuevo trabajo",
            "País, energía y comunidad para quedarte",
          ],
        },
        {
          tag: "Curso 02",
          name: "Curso Remote Founder",
          sub: "Global Builder",
          href: "/cursos/remote-founder",
          forWho: "13 semanas · para freelancers, consultores y founders",
          desc: "Construye un negocio remoto validado, con precio, vendiendo y constituido. Cada ejercicio se hace sobre tu propio negocio.",
          outcomes: [
            "Eliges modelo y un nicho que paga",
            "Validas con compradores reales antes de construir",
            "Oferta productizada con precio premium",
            "Clientes B2B internacionales y ventas cerradas",
            "Marketing, entrega y back office con IA",
            "Tu empresa constituida y en regla",
            "Escalas sin vender más horas",
          ],
        },
      ],
    },
    // Las semanas no se escriben aquí: salen de cursos/copy.ts, igual que en
    // las landings de curso. Aquí sólo van los rótulos.
    curriculum: {
      eyebrow: "El programa",
      title: "Dos recorridos, semana a semana.",
      lead: "Una semana, una habilidad. Cada curso avanza por fases, en el orden en que lo vas a vivir, y cada semana termina con algo que ya puedes usar.",
      weekLabel: "Semana",
      trackCta: "Ver el curso completo",
      tracks: [
        { tag: "Curso 01", slug: "remote-professional" as const, href: "/cursos/remote-professional", duration: "8 semanas", toggle: "Ver las 8 semanas" },
        { tag: "Curso 02", slug: "remote-founder" as const, href: "/cursos/remote-founder", duration: "13 semanas", toggle: "Ver las 13 semanas" },
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
    // Ese acuerdo ya existe con Deel (nov. 2026): acredita contenidos de los dos
    // cursos y tiene su propia sección, con su badge oficial. Ver bienvenida/deel.ts.
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
      lead: "Cada convocatoria es un grupo reducido: una clase en directo cada semana, campus virtual con vídeos y grabaciones, y tu pod y la comunidad en Slack durante todo el curso.",
      planName: "Remote Professional · Remote Founder",
      // ⚠︎ SIN PRECIOS por ahora, a petición del equipo, y sin botón de
      // matrícula: la única salida es pedir información. Los importes de
      // salida (noviembre de 2026) son 1.990 € por curso en pago único,
      // 2.190 € a plazos (3 × 730 €) y los dos 2.790 € o 2.990 € a plazos (ver
      // lib/stripe/catalog.ts); si vuelven a la web, van aquí y en el FAQ.
      planStart: "Arranca el 9 de enero de 2027 · grupos de 25 plazas",
      features: [
        "8 semanas en Remote Professional, 13 en Remote Founder",
        "Unas 12,5 h a la semana, compatibles con tu trabajo",
        "Una clase en directo de 2 h cada semana, que queda grabada",
        "6 vídeos de 30 min y material previo cada semana",
        "Ejercicio sobre tu caso real y test semanal",
        "Tu pod de 4–5 personas y la comunidad en Slack",
        "Diploma de ActiveXRemote al terminar",
      ],
      cta: "Solicita información",
    },
    // Cronograma de la convocatoria, formato 2.0. Todo sale de lo que ya dicen
    // las landings de curso (cursos/copy.ts): semana 0 en Slack, una semana
    // por habilidad, graduación en la 8 (Professional) y Demo Day en la 13
    // (Founder). Empieza el 9 de enero de 2027 en grupos de 25.
    steps: {
      eyebrow: "Cómo funciona",
      title: "De la solicitud al diploma, paso a paso.",
      lead: "Todas las semanas siguen el mismo ritmo: teoría en vídeo, una clase en directo de 2 horas para practicar y un ejercicio sobre tu caso. Esto es lo que pasa desde que solicitas plaza hasta que terminas.",
      totalLabel: "Duración",
      total: "8 o 13 semanas · unas 12,5 h a la semana",
      doesLabel: "Qué haces",
      getsLabel: "Qué te llevas",
      items: [
        {
          n: "00",
          phase: "Antes de empezar",
          when: "Antes del 9 de enero",
          meta: "Grupos de 25 plazas",
          title: "Solicitas plaza y eliges curso",
          desc: "Nos dices qué curso te interesa y admisiones te cuenta cómo funciona, el precio y las formas de pago, sin compromiso. Los grupos son de 25 plazas, así que el orden de solicitud importa.",
          does: [
            "Envías la solicitud desde esta página",
            "Te enviamos calendario, horarios y condiciones",
            "Reservas tu plaza",
          ],
          gets: "Acceso al campus virtual y al canal de tu convocatoria en Slack.",
        },
        {
          n: "01",
          phase: "Semana 0",
          when: "La semana antes",
          meta: "En Slack",
          title: "Conoces a tu grupo y a tu pod",
          desc: "Te presentas a tu grupo en Slack y conoces a tu pod, 4 o 5 personas con tu misma zona horaria y un objetivo parecido, antes de la primera clase.",
          does: [
            "Te presentas en el canal de la convocatoria",
            "Conoces a tu pod, que es fijo todo el curso",
            "Llegas a la primera clase con tu grupo hecho",
          ],
          gets: "Un grupo con el que avanzar desde el primer día.",
        },
        {
          n: "02",
          phase: "Cada semana",
          when: "Desde el 9 de enero",
          meta: "Unas 12,5 h",
          title: "Una semana, una habilidad",
          desc: "Material previo y 6 vídeos de 30 minutos a tu ritmo; una clase en directo de 2 horas, un día fijo entre semana, para practicar; y un ejercicio sobre tu caso real que revisa tu pod.",
          does: [
            "Ves los vídeos cuando te va bien",
            "Practicas en la clase en directo, que queda grabada",
            "Entregas el ejercicio y haces el test semanal",
          ],
          gets: "Al acabar cada semana, algo que ya puedes usar: un CV, unas alertas, una oferta, un contrato o un cliente.",
        },
        {
          n: "03",
          phase: "Remote Professional",
          when: "Semana 8",
          meta: "Graduación",
          title: "Sales con el empleo a tiro",
          desc: "En la semana 8 presentas tu perfil remoto en 60 segundos. Has hecho que te encuentren, has ensayado la entrevista y entiendes el contrato que vas a firmar.",
          does: [
            "Presentas tu perfil remoto ante el grupo",
            "Cierras tu plan de confianza a 90 días",
            "Te llevas el kit completo de herramientas",
          ],
          gets: "CV y LinkedIn listos, alertas con IA funcionando y la negociación preparada.",
        },
        {
          n: "04",
          phase: "Remote Founder",
          when: "Semana 13",
          meta: "Demo Day",
          title: "Sales con una empresa en marcha",
          desc: "En la semana 13 presentas tu negocio en el Demo Day: validado, con precio, vendiendo y constituido, con un plan para crecer sin vender más horas.",
          does: [
            "Presentas tu negocio en el Demo Day",
            "Cierras tu plan del siguiente escalón de ingresos",
            "Te llevas plantillas y agentes de IA montados sobre tu negocio",
          ],
          gets: "Una oferta que vende, un pipeline de clientes y la estructura en regla.",
        },
        {
          n: "05",
          phase: "Después",
          when: "Al terminar",
          meta: "Te quedas dentro",
          title: "Te certificas y sigues conectado",
          desc: "El curso termina, la comunidad no. Recibes el diploma de ActiveXRemote y sigues en la comunidad de antiguos alumnos.",
          does: [
            "Recibes el diploma de ActiveXRemote",
            "Conservas las plantillas y herramientas que has montado",
            "Sigues en la comunidad de antiguos alumnos",
          ],
          gets: "Un diploma emitido por ActiveXRemote y una red de gente que trabaja en remoto.",
        },
      ],
    },
    faq: {
      eyebrow: "Dudas",
      title: "Preguntas frecuentes.",
      items: [
        { q: "¿Qué curso me conviene?", a: "Remote Professional si buscas un empleo remoto internacional; Remote Founder si quieres lanzar tu propio negocio. Y puedes hacer los dos: cada uno tiene su propio recorrido." },
        { q: "¿Cuánto cuesta?", a: "Solicita información y te enviamos el precio, las formas de pago —pago único o a plazos— y las condiciones de la convocatoria, sin compromiso." },
        { q: "¿Cuánto dura cada curso?", a: "Remote Professional dura 8 semanas y Remote Founder 13. Cada semana trabaja una habilidad y te pide unas 12,5 horas, compatibles con tu trabajo actual." },
        { q: "¿Cómo es una semana?", a: "Material previo y 6 vídeos de 30 minutos a tu ritmo, una clase en directo de 2 horas un día fijo entre semana, un ejercicio sobre tu caso real y un test de 20 preguntas." },
        { q: "¿Necesito conocimientos previos?", a: "No. Los dos cursos empiezan desde tu punto de partida en la semana 1 y suben de nivel semana a semana." },
        { q: "¿Qué herramientas voy a usar?", a: "Notion, Slack, Wise, Deel, Zapier y modelos de IA, entre otras. Montas tu propio stack remoto durante el programa." },
        { q: "¿Es en directo o asíncrono?", a: "Las dos cosas. Los vídeos y el material van a tu ritmo; la clase de cada semana es en directo y queda grabada por si no puedes ir." },
        { q: "¿Cuándo empieza la próxima convocatoria?", a: "El 9 de enero de 2027. Remote Professional dura 8 semanas y Remote Founder 13, con una clase en directo de 2 horas cada semana. Los grupos son de 25 plazas: solicita información y te enviamos calendario y horarios." },
        { q: "¿El diploma es un título oficial?", a: "No. Es una certificación privada que emite ActiveXRemote. No equivale a un grado universitario ni a un título académico oficial. Varias semanas de cada curso tienen contenidos acreditados por Deel, y el diploma lo indica." },
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
        { title: "Cursos", links: [{ href: "/cursos/remote-professional", label: "Remote Professional" }, { href: "/cursos/remote-founder", label: "Remote Founder" }, { href: "#modulos", label: "Programa" }] },
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
      // Ver components/landing/impact-badges.tsx antes de cambiar una coma:
      // las dos frases son afirmaciones sobre terceros.
      impact: {
        label: "Nuestro impacto",
        climate: "Parte de nuestra facturación elimina CO₂",
        climateLink: "Cómo funciona",
        ngo: "ONG aliada en Kenia · liderazgo para jóvenes y mujeres",
        ngoLink: "Conoce la fundación",
      },
    },
  },
  en: {
    meta: {
      title: "ActiveXRemote · The Remote Business School",
      description:
        "Land the international remote job you deserve or build your own global business. Two online courses with live classes: Remote Professional (8 weeks) and Remote Founder (13 weeks).",
    },
    // No seats-left counter: only the group size, which is real.
    ticker: {
      intro: "The cohort starts on 9 January",
      seats: "Groups of 25 seats",
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
        { value: "8", label: "weeks · Professional" },
        { value: "13", label: "weeks · Founder" },
        { value: "12.5 h", label: "a week" },
        { value: "25", label: "seats per group" },
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
      top: "ActiveXRemote, the specialist school for hands-on, 100% up-to-date Remote Business training.",
      bottom: "Train live and online, with a method designed to keep pace with today's remote market.",
    },
    features: [
      {
        eyebrow: "The method",
        title: "Not theory. Execution.",
        body: "Theory comes first, on video: six 30-minute videos every week. The 2-hour live class is for practice, and every week ends with an exercise on your own case. You leave with deliverables, not notes.",
        points: ["6 videos a week", "2-hour live class", "Exercise on your case"],
      },
      {
        eyebrow: "Two paths",
        title: "Job or business. You choose.",
        body: "Two courses, each with its own week-by-week route: Remote Professional, 8 weeks to land an international remote job, or Remote Founder, 13 weeks to build your own borderless business.",
        points: ["8 weeks · Professional", "13 weeks · Founder", "You can take both"],
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
      stat2: { value: "12.5 h", label: "a week, alongside your job" },
      quote:
        "“Remote doesn't fail because of distance. It fails when we don't adapt to this way of working.”",
      quoteBy: "ActiveXRemote Manifesto",
    },
    paths: {
      eyebrow: "Choose your course",
      title: "Two courses. One level of rigor.",
      lead: "Each with its own route, week by week and on your real case. You can take both.",
      cta: "Request information",
      detail: "See the full program",
      items: [
        {
          tag: "Course 01",
          name: "Remote Professional course",
          sub: "Career Accelerator",
          href: "/cursos/remote-professional",
          forWho: "8 weeks · for employees and contractors",
          desc: "Land your international remote job: decide what you want, get found, sign the right contract and start with AI on your side.",
          outcomes: [
            "Decide what you want and where you're going",
            "A CV and LinkedIn that get you found",
            "AI alerts that find the openings for you",
            "Interview passed and offer negotiated",
            "Contract and payments compliant from any country",
            "AI as your assistant in the new job",
            "Country, energy and community to make it last",
          ],
        },
        {
          tag: "Course 02",
          name: "Remote Founder course",
          sub: "Global Builder",
          href: "/cursos/remote-founder",
          forWho: "13 weeks · for freelancers, consultants and founders",
          desc: "Build a remote business that is validated, priced, selling and incorporated. Every exercise is done on your own business.",
          outcomes: [
            "Pick a model and a niche that pays",
            "Validate with real buyers before you build",
            "A productised offer at a premium price",
            "International B2B clients and closed deals",
            "Marketing, delivery and back office with AI",
            "Your company incorporated and compliant",
            "Scale without selling more hours",
          ],
        },
      ],
    },
    curriculum: {
      eyebrow: "The program",
      title: "Two routes, week by week.",
      lead: "One week, one skill. Each course moves through phases, in the order you'll live them, and every week ends with something you can already use.",
      weekLabel: "Week",
      trackCta: "See the full course",
      tracks: [
        { tag: "Course 01", slug: "remote-professional" as const, href: "/cursos/remote-professional", duration: "8 weeks", toggle: "See the 8 weeks" },
        { tag: "Course 02", slug: "remote-founder" as const, href: "/cursos/remote-founder", duration: "13 weeks", toggle: "See the 13 weeks" },
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
      lead: "Every cohort is a small group: one live class every week, a virtual campus with videos and recordings, and your pod and the community on Slack throughout the course.",
      planName: "Remote Professional · Remote Founder",
      planStart: "Starts 9 January 2027 · groups of 25 seats",
      features: [
        "8 weeks in Remote Professional, 13 in Remote Founder",
        "Around 12.5 h a week, alongside your job",
        "One 2-hour live class every week, recorded",
        "Six 30-minute videos and prep material every week",
        "An exercise on your real case and a weekly test",
        "Your pod of 4–5 people and the community on Slack",
        "ActiveXRemote diploma when you finish",
      ],
      cta: "Request information",
    },
    steps: {
      eyebrow: "How it works",
      title: "From application to diploma, step by step.",
      lead: "Every week follows the same rhythm: theory on video, a 2-hour live class to practise and an exercise on your own case. This is what happens from the moment you apply until you finish.",
      totalLabel: "Length",
      total: "8 or 13 weeks · around 12.5 h a week",
      doesLabel: "What you do",
      getsLabel: "What you walk away with",
      items: [
        {
          n: "00",
          phase: "Before you start",
          when: "Before 9 January",
          meta: "Groups of 25 seats",
          title: "You apply and pick your course",
          desc: "You tell us which course interests you and admissions explains how it works, the price and the payment options, no strings attached. Groups are capped at 25 seats, so when you apply matters.",
          does: [
            "You send the application from this page",
            "We send you the calendar, schedule and terms",
            "You book your place",
          ],
          gets: "Access to the virtual campus and to your cohort's Slack channel.",
        },
        {
          n: "01",
          phase: "Week 0",
          when: "The week before",
          meta: "On Slack",
          title: "You meet your group and your pod",
          desc: "You introduce yourself to your group on Slack and meet your pod, 4 or 5 people in your time zone with a similar goal, before the first class.",
          does: [
            "You introduce yourself in the cohort channel",
            "You meet your pod, fixed for the whole course",
            "You arrive at the first class with your group in place",
          ],
          gets: "A group to move forward with from day one.",
        },
        {
          n: "02",
          phase: "Every week",
          when: "From 9 January",
          meta: "Around 12.5 h",
          title: "One week, one skill",
          desc: "Prep material and six 30-minute videos at your own pace; a 2-hour live class on a fixed weekday to practise; and an exercise on your real case that your pod reviews.",
          does: [
            "You watch the videos when it suits you",
            "You practise in the live class, which is recorded",
            "You hand in the exercise and take the weekly test",
          ],
          gets: "At the end of every week, something you can already use: a CV, alerts, an offer, a contract or a client.",
        },
        {
          n: "03",
          phase: "Remote Professional",
          when: "Week 8",
          meta: "Graduation",
          title: "You leave with the job within reach",
          desc: "In week 8 you pitch your remote profile in 60 seconds. You get found, you've rehearsed the interview and you understand the contract you'll sign.",
          does: [
            "You pitch your remote profile to the group",
            "You close your 90-day trust plan",
            "You take the full tool kit with you",
          ],
          gets: "CV and LinkedIn ready, AI alerts running and your negotiation prepared.",
        },
        {
          n: "04",
          phase: "Remote Founder",
          when: "Week 13",
          meta: "Demo Day",
          title: "You leave with a business up and running",
          desc: "In week 13 you present your business at Demo Day: validated, priced, selling and incorporated, with a plan to grow without selling more hours.",
          does: [
            "You present your business at Demo Day",
            "You close your plan for the next income step",
            "You keep templates and AI agents built on your business",
          ],
          gets: "An offer that sells, a client pipeline and a compliant structure.",
        },
        {
          n: "05",
          phase: "Afterwards",
          when: "When you finish",
          meta: "You stay in",
          title: "You get certified and stay connected",
          desc: "The course ends, the community doesn't. You receive the ActiveXRemote diploma and stay in the alumni community.",
          does: [
            "You receive the ActiveXRemote diploma",
            "You keep the templates and tools you've built",
            "You stay in the alumni community",
          ],
          gets: "A diploma issued by ActiveXRemote and a network of people who work remotely.",
        },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked.",
      items: [
        { q: "Which course suits me?", a: "Remote Professional if you want an international remote job; Remote Founder if you want to launch your own business. And you can take both: each has its own route." },
        { q: "How much does it cost?", a: "Request information and we'll send you the price, the payment options —one payment or instalments— and the cohort's terms, no strings attached." },
        { q: "How long is each course?", a: "Remote Professional runs for 8 weeks and Remote Founder for 13. Each week works on one skill and takes around 12.5 hours, alongside your current job." },
        { q: "What does a week look like?", a: "Prep material and six 30-minute videos at your own pace, a 2-hour live class on a fixed weekday, an exercise on your real case and a 20-question test." },
        { q: "Do I need prior knowledge?", a: "No. Both courses start from where you are in week 1 and level up week by week." },
        { q: "What tools will I use?", a: "Notion, Slack, Wise, Deel, Zapier and AI models, among others. You build your own remote stack during the program." },
        { q: "Is it live or async?", a: "Both. Videos and materials go at your own pace; each week's class is live and recorded in case you can't make it." },
        { q: "When does the next cohort start?", a: "9 January 2027. Remote Professional runs for 8 weeks and Remote Founder for 13, with one 2-hour live class every week. Groups are capped at 25 seats: request information and we'll send you the calendar and schedule." },
        { q: "Is the diploma an official degree?", a: "No. It is a private certification issued by ActiveXRemote. It is not equivalent to a university or official academic degree. Several weeks of each course have content accredited by Deel, and the diploma says so." },
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
        { title: "Courses", links: [{ href: "/cursos/remote-professional", label: "Remote Professional" }, { href: "/cursos/remote-founder", label: "Remote Founder" }, { href: "#modulos", label: "Program" }] },
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
      impact: {
        label: "Our impact",
        climate: "Part of our revenue removes CO₂",
        climateLink: "How it works",
        ngo: "Partner NGO in Kenya · leadership for young people and women",
        ngoLink: "Meet the foundation",
      },
    },
  },
} satisfies Record<Locale, unknown>;
