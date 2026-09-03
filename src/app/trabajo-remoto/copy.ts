import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Landing de campaña — /trabajo-remoto
//
//  Copy PROPIA y autocontenida. No importa nada de bienvenida/copy.ts a
//  propósito: esta página existe para tráfico de pago y su texto se reescribe
//  al ritmo de las campañas, no al de la web. Compartir el objeto acabaría
//  con alguien cambiando un titular aquí y rompiéndolo en la portada.
//
//  ── Regla de contenido ───────────────────────────────────
//  Aquí sólo entra lo que ya sostiene la web pública: 14 módulos, 56 h,
//  grupos de 25. Nada de cifras nuevas.
//
//  ⚠︎ SIN PRECIOS. Se han retirado a petición del equipo: esta página no
//  muestra importes por ahora. Si vuelven, van en `hero.facts`, que es de
//  donde salieron.
//
//  ⚠︎ El CALENDARIO de esta convocatoria es propio y no el de la portada:
//  siete fines de semana, del 9 de enero al 21 de febrero de 2027, dos clases
//  de cuatro horas por fin de semana. La portada sigue vendiendo la de
//  diciembre con una clase por semana, así que la fecha vive en
//  trabajo-remoto/contact.ts y no en la constante compartida. En particular NO hay rangos salariales ni número de alumnos: la
//  referencia los lleva, nosotros no tenemos dato verificable y publicarlo
//  inventado es publicidad engañosa (ver src/app/bienvenida/flags.ts).
//
//  ── Reparto: cada cosa se dice UNA vez ───────────────────
//  Una landing que repite parece más larga de lo que es y hace dudar de si te
//  has perdido algo. Cada dato tiene un dueño y sólo uno:
//
//    hero .......... qué es, para quién, cuándo empieza y cuánto cuesta
//    statement ..... quiénes somos y cómo enseñamos, en una frase
//    jobs .......... a qué empleos y a qué sectores lleva esto
//    live .......... CÓMO se da la clase (en directo, irrepetible, online)
//    pillars ....... POR QUÉ funciona — cuatro cosas que no dice nadie más
//    outcomes ...... la ESTRUCTURA y a dónde lleva cada camino
//    timeline ...... QUÉ TE PASA a ti desde que dejas los datos
//    program ....... el temario, las objeciones y las herramientas
//    final ......... la acción, con quién imparte y dónde acaba la gente
//
//  Si al añadir una frase tienes que mirar si ya está en otro sitio, va en el
//  sitio que la tiene y no en los dos.
//
//  ── Cómo se llama esto ───────────────────────────────────
//  CURSO. Siempre. Ni «programa», ni «máster», ni «formación de posgrado».
//  En inglés, «course»; nunca «programme» ni «master».
//
//  No es preferencia de estilo: «máster» está reservado en España a
//  titulaciones oficiales y a títulos propios de universidad, y esto es una
//  certificación privada de empresa —lo dice el descargo del pie—. «Programa»
//  es más vago y además se usaba mezclado con «curso» en la misma página, así
//  que quien leía no sabía si eran dos cosas distintas.
// ══════════════════════════════════════════════════════════

export type AdCopy = (typeof adCopy)["es"];

export const adCopy = {
  es: {
    meta: {
      title: "Formación online en directo para trabajar sin fronteras · 7 fines de semana",
      description:
        "Curso 100 % online y en directo, en español: consigue un empleo remoto internacional o monta tu negocio global. 14 módulos, 56 h, grupos de 25 plazas.",
    },
    nav: {
      // La marca sola no dice a qué nos dedicamos. Quien llega desde un
      // anuncio no nos conoce: en la barra tiene que leerse qué somos y qué
      // está mirando, en dos líneas.
      school: "Escuela de trabajo remoto",
      course: "Curso Remote Professional · Curso Remote Founder",
      cta: "Solicita información",
      ctaShort: "Solicita info",
    },

    // ── HÉROE ────────────────────────────────────────────
    // Lo primero que se lee tiene que contestar tres preguntas: qué es
    // (formación online en directo), qué consigues (empleo o negocio) y qué
    // pasa si dejo los datos. Todo lo demás puede esperar al scroll.
    hero: {
      badge: "Convocatoria del 9 de enero de 2027 · 25 plazas",
      // Dos líneas, como pide el documento: la escuela arriba y el curso
      // debajo. La segunda va a cuerpo menor —titular y antetítulo— porque a
      // tamaño de H1 las dos frases juntas son seis renglones y el héroe deja
      // de caber en una pantalla de portátil.
      titleTop: "La Escuela para conseguir tu empleo remoto internacional o crear tu propio negocio global.",
      titleBottom: "Escoge entre el Curso Remote Professional o el Curso Remote Founder.",
      lead: "Formación online y en directo. Clases de cuatro horas los fines de semana, durante siete semanas, y los recursos que necesitas al terminar cada módulo.",
      formTitle: "Recibe el curso completo",
      formLead: "Temario, fechas, horarios y condiciones. Sin compromiso.",
      // Cuatro datos, no seis: aquí van los de decisión —qué formato, cuándo
      // empieza, a qué ritmo y cuánto cuesta—. El tamaño del programa lo
      // cuenta la banda de cifras de justo debajo.
      facts: [
        { k: "Formato", v: "100 % online, en directo" },
        { k: "Empieza y finaliza", v: "9 ene → 21 feb de 2027" },
        { k: "Ritmo", v: "2 clases de 4 h por fin de semana" },
      ],
      partnersLabel: "Partners con beneficios para alumnos",
      partnersNote: "Acuerdos con las plataformas que sostienen el trabajo remoto internacional.",
      clocksLabel: "Ahora mismo",
      clocks: [
        { city: "Barcelona", tz: "Europe/Madrid" },
        { city: "Lisboa", tz: "Europe/Lisbon" },
        { city: "Bogotá", tz: "America/Bogota" },
        { city: "CDMX", tz: "America/Mexico_City" },
        { city: "Dubái", tz: "Asia/Dubai" },
        { city: "Nueva York", tz: "America/New_York" },
      ],
    },

    // ⚠︎ El documento de feedback traía «ActiveXRemote, Top #1 en formación
    // práctica…». El «Top #1» se ha quitado: es un superlativo comparativo sin
    // dato que lo sostenga, y afirmarlo sobre uno mismo entra de lleno en la
    // Directiva 2005/29/CE de prácticas comerciales desleales. El resto de la
    // frase se mantiene tal cual, porque describe y no compara.
    statement: {
      top: "Formación práctica y 100 % actualizada en Remote Business.",
      bottom: "En directo, online, y al ritmo al que se mueve el mercado.",
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
      videoLabel: "Fragmento de una clase en directo del curso",
    },

    // Cuatro bloques con el formato de la referencia: un titular que se lee
    // solo y dos líneas que lo sostienen. El del campus es el que más se
    // aparta: la escuela tiene sede en Dubái, pero el aula está donde estés tú.
    pillars: [
      {
        icon: "deliver" as const,
        title: "Oferta formativa puntera y actualizada",
        body: "Contenidos revisados cada convocatoria sobre lo que hoy pide el mercado remoto internacional: fiscalidad, contratación, IA aplicada y operativa distribuida.",
      },
      {
        icon: "group" as const,
        title: "Metodología práctica con profesionales en activo",
        body: "Clases en directo con quien trabaja así todos los días. Grupos de 25, un entregable por módulo y corrección con tu nombre encima.",
      },
      {
        icon: "globe" as const,
        title: "Sede en Dubái, aula en todo el mundo",
        body: "La escuela opera desde Emiratos y el curso es 100 % online: se sigue desde cualquier país y cualquier huso horario, sin mudarte a ninguna parte.",
      },
      {
        icon: "stack" as const,
        title: "Herramientas y plataformas estratégicas",
        body: "Notion, Slack, Wise, Deel, Zapier y modelos de IA, abiertos en pantalla durante la clase e integrados en los ejercicios de cada módulo.",
      },
    ],

    // ── LA ESTRUCTURA ────────────────────────────────────
    // Dueña de "dos caminos" y de las cuatro salidas. El cronograma de abajo
    // no vuelve a contar los módulos: cuenta lo que te pasa a ti.
    outcomes: {
      title: "Una base común y, después, tu camino",
      coreTag: "Módulos 01 – 07",
      coreName: "7 módulos de núcleo",
      coreNote: "Los mismos para todos",
      takeLabel: "Sales con",
      paths: [
        {
          tag: "Módulos 08 – 14",
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
          tag: "Módulos 08 – 14",
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
          when: "Findes 1 – 4",
          title: "Montas la base",
          desc: "Fiscalidad, herramientas, IA, legal y hábitos de trabajo remoto.",
        },
        {
          n: "03",
          when: "Findes 4 – 7",
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
      title: "Catorce módulos en siete fines de semana",
      lead: "Dos módulos por fin de semana: siete de núcleo común y siete de la especialización que elijas. Cada uno abre con el marco, sigue con la herramienta en pantalla y termina con un ejercicio aplicado a tu caso.",
      // Cinco dudas que no contesta ninguna otra sección. El formato, el
      // ritmo y el precio ya están en el héroe y no vuelven aquí.
      howLabel: "Las dudas de siempre",
      how: [
        { icon: "check" as const, k: "Nivel previo", v: "Ninguno: el núcleo empieza desde cero" },
        { icon: "globe" as const, k: "Idioma", v: "Clases en español, materiales en ES y EN" },
        { icon: "replay" as const, k: "Al terminar", v: "Diploma con los módulos superados y las horas" },
        { icon: "chat" as const, k: "Entre clase y clase", v: "Feedback del equipo y grupo en Slack" },
        { icon: "clock" as const, k: "Dedicación real", v: "8 h de clase el finde y 2 – 3 h de ejercicio" },
      ],
      toolsLabel: "Se abren en clase, no en un anexo",
      cta: "Recibe el temario completo",
      groups: [
        {
          tag: "Módulos 01 – 07 · Todos",
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
          tag: "Módulos 08 – 14 · Camino 01",
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
          tag: "Módulos 08 – 14 · Camino 02",
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

    // ══════════════════════════════════════════════════
    //  Sueldos: dato real o ningún dato
    //
    //  Doce cifras: cuatro puestos por tres mercados. Todas son la media
    //  publicada por Glassdoor en el sitio de cada país, consultada en
    //  septiembre de 2026, y CADA UNA enlaza a su ficha. Ésa es la diferencia
    //  entre un dato y un adorno: que se puede ir a mirar.
    //
    //  Sólo cuatro puestos, y son los cuatro de los que hay media nacional
    //  publicada en los tres países. Customer Success se quedó fuera: en
    //  España la única cifra que encontré cuelga de una página con el título
    //  descolocado, y citar algo que no inspira confianza es peor que dejar
    //  una fila menos.
    //
    //  ⚠︎ Las cifras van en moneda local y SIN convertir. Convertirlas a euros
    //  sugeriría que 151.000 $ en Estados Unidos y 151.000 € en España son lo
    //  mismo, y entre impuestos, sanidad y coste de la vivienda no se parecen.
    //  La comparación honesta es «así de distinto paga cada mercado», no «vas
    //  a ganar esto».
    //
    //  ⚠︎ Son sueldos de mercado, no promesas. El texto lo dice: prometer un
    //  sueldo es lo único que esta página no puede hacer.
    //
    //  Al revisar: vuelve a mirar las doce fichas y actualiza la fecha. Un
    //  dato de hace dos años con la fecha puesta es honesto; sin fecha, no.
    // ══════════════════════════════════════════════════
    jobs: {
      eyebrow: "A dónde lleva",
      title: "Lo que paga cada mercado por el mismo puesto",
      lead: "La misma silla, tres países. Es el argumento entero del trabajo remoto internacional en una tabla, y no lo decimos nosotros: son medias públicas de Glassdoor y cada cifra enlaza a su ficha.",
      salaryLabel: "Sueldo medio anual, en moneda local",
      markets: ["España", "Reino Unido", "EE. UU."],
      roles: [
        {
          name: "Product Manager",
          pay: [
            { v: "45.000 €", url: "https://www.glassdoor.es/Sueldos/product-manager-sueldo-SRCH_KO0,15.htm" },
            { v: "£63.126", url: "https://www.glassdoor.co.uk/Salaries/product-manager-salary-SRCH_KO0,15.htm" },
            { v: "$151.317", url: "https://www.glassdoor.com/Salaries/product-manager-salary-SRCH_KO0,15.htm" },
          ],
        },
        {
          name: "Product Marketing Manager",
          pay: [
            { v: "48.000 €", url: "https://www.glassdoor.es/Sueldos/product-marketing-manager-sueldo-SRCH_KO0,25.htm" },
            { v: "£63.157", url: "https://www.glassdoor.co.uk/Salaries/product-marketing-manager-salary-SRCH_KO0,25.htm" },
            { v: "$141.190", url: "https://www.glassdoor.com/Salaries/product-marketing-manager-salary-SRCH_KO0,25.htm" },
          ],
        },
        {
          name: "Sales Development Representative",
          pay: [
            { v: "33.000 €", url: "https://www.glassdoor.es/Sueldos/sales-development-representative-sueldo-SRCH_KO0,32.htm" },
            { v: "£39.680", url: "https://www.glassdoor.co.uk/Salaries/sales-development-representative-salary-SRCH_KO0,32.htm" },
            { v: "$103.886", url: "https://www.glassdoor.com/Salaries/sales-development-representative-salary-SRCH_KO0,32.htm" },
          ],
        },
        {
          name: "Analista de datos",
          pay: [
            { v: "29.200 €", url: "https://www.glassdoor.es/Sueldos/analista-de-datos-sueldo-SRCH_KO0,17.htm" },
            { v: "£37.641", url: "https://www.glassdoor.co.uk/Salaries/data-analyst-salary-SRCH_KO0,12.htm" },
            { v: "$93.535", url: "https://www.glassdoor.com/Salaries/data-analyst-salary-SRCH_KO0,12.htm" },
          ],
        },
      ],
      // Partida en tres para poder enlazar «Glassdoor» sin meter HTML en la
      // copy. Y recortada a la mitad: es una nota al pie, no un párrafo.
      // Lo que no se puede quitar son las dos salvedades —la fecha y que no
      // es una promesa de sueldo—, que es justo por lo que la nota existe.
      salaryNote: {
        before: "Medias de ",
        link: "Glassdoor",
        url: "https://www.glassdoor.es/Sueldos/index.htm",
        after: " en cada país, septiembre de 2026. En moneda local y sin convertir: dicen cuánto paga cada mercado, no cuánto vas a ganar tú.",
      },
      sectorsLabel: "Sectores donde se monta negocio remoto",
      sectors: [
        "SaaS y software", "Consultoría", "E-commerce", "Marketplaces", "Formación online",
        "Agencias de marketing", "Salud digital", "Fintech", "Insurtech", "Legaltech",
        "HR tech y reclutamiento", "Contenido y medios", "Diseño y creatividad", "Vídeo y audio",
        "Automatización e IA", "Ciberseguridad", "Datos y analítica", "Desarrollo a medida",
        "No-code", "Traducción y localización", "Turismo y viajes", "Inmobiliaria",
        "Logística", "Energía y sostenibilidad", "Deporte y bienestar", "Gaming",
        "Comunidades y membresías", "Coaching y mentoría", "Contabilidad y fiscalidad",
        "Comercio internacional",
      ],
    },
    // La sede, justo antes del formulario: quien va a dejar sus datos quiere
    // saber a quién se los deja y cuándo le van a coger el teléfono.
    office: {
      eyebrow: "Dónde estamos",
      title: "Sede en Dubái, alumnos en todo el mundo",
      hoursLabel: "Horario de atención",
      hours: "De lunes a viernes, de 9:00 a 18:00 · GST (UTC+4)",
      addressLabel: "Dirección",
      mapLabel: "Mapa de la sede de ActiveXRemote en Dubái",
      mapCta: "Ver el mapa",
      mapNotice: "Has rechazado las cookies de preferencias, así que el mapa de Google no se carga. Puedes abrirlo sólo para esta visita.",
      note: "La escuela opera desde Emiratos Árabes Unidos y el curso es 100 % online: no hay que venir a ninguna parte.",
    },
    alumni: {
      title: "Empresas donde trabajan nuestros alumnos",
    },

    sticky: {
      note: "La convocatoria empieza el 9 de enero",
      cta: "Solicita información",
      units: { d: "d", h: "h", m: "m" },
    },

    whatsapp: {
      label: "Escríbenos por WhatsApp",
      message: "Hola, me interesa el curso de ActiveXRemote. ¿Me contáis?",
    },

    faculty: {
      title: "Quién da las clases",
      // ⚠︎ Un solo aviso para los dos datos de maqueta de esta sección: los
      // logotipos (PLACEHOLDER_LOGOS en ad-logos.tsx) y el profesorado
      // (DEMO_FACULTY en bienvenida/faculty.ts).
      // Sólo cubre los logotipos de empresa, que siguen siendo inventados.
      // El profesorado ya no: es una persona real y su ficha enlaza al perfil.
      notice: "Logotipos de empresa de ejemplo, pendientes de sustituir por los reales.",
    },

    final: {
      title: "Hablamos y decides",
      body: "Déjanos tus datos y te enviamos el temario completo, las fechas y las condiciones. Te escribimos en menos de 24 horas laborables y no hay compromiso de nada.",
    },

    // El pie es el MISMO que el de la portada (columnas, selector de idioma,
    // tarjetas aceptadas y quién cobra), así que su texto sale de
    // bienvenida/copy.ts y aquí sólo queda lo propio de esta página.
    footer: {
      note: "Cada marca es propiedad de su compañía: los partners aportan beneficios para nuestros alumnos, pero no acreditan el curso ni emiten el diploma. El diploma lo emite ActiveXRemote detallando los módulos superados: es una certificación privada de empresa, no un título oficial ni un grado universitario.",
    },
  },

  en: {
    meta: {
      title: "Live online training to work without borders · 7 weekends",
      description:
        "A 100% online, live course in Spanish: land an international remote job or build your own global business. 14 modules, 56 hours, cohorts of 25.",
    },
    nav: {
      school: "Remote work school",
      course: "Remote Professional course · Remote Founder course",
      cta: "Request information",
      ctaShort: "Request info",
    },

    hero: {
      badge: "Cohort of 9 January 2027 · 25 seats",
      titleTop: "The school for landing an international remote job or building your own global business.",
      titleBottom: "Choose between the Remote Professional course and the Remote Founder course.",
      lead: "Live online training, taught in Spanish. Four-hour classes at weekends, over seven weeks, and the resources you need at the end of every module.",
      formTitle: "Get the full course",
      formLead: "Syllabus, dates, schedule and terms. No strings attached.",
      facts: [
        { k: "Format", v: "100% online, live" },
        { k: "Runs", v: "9 Jan → 21 Feb 2027" },
        { k: "Pace", v: "Two 4-hour classes per weekend" },
      ],
      partnersLabel: "Partners with student benefits",
      partnersNote: "Agreements with the platforms that hold up international remote work.",
      clocksLabel: "Right now",
      clocks: [
        { city: "Barcelona", tz: "Europe/Madrid" },
        { city: "Lisbon", tz: "Europe/Lisbon" },
        { city: "Bogotá", tz: "America/Bogota" },
        { city: "Mexico City", tz: "America/Mexico_City" },
        { city: "Dubai", tz: "Asia/Dubai" },
        { city: "New York", tz: "America/New_York" },
      ],
    },

    statement: {
      top: "Hands-on training, 100% up to date on Remote Business.",
      bottom: "Live, online, and at the speed the market actually moves.",
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
      videoLabel: "A clip from a live class of the course",
    },

    pillars: [
      {
        icon: "deliver" as const,
        title: "A leading, up-to-date curriculum",
        body: "Revised every cohort against what the international remote market asks for today: tax, hiring, applied AI and distributed operations.",
      },
      {
        icon: "group" as const,
        title: "Hands-on method, taught by working professionals",
        body: "Live classes with people who work this way every day. Groups of 25, one deliverable per module and marking with your name on it.",
      },
      {
        icon: "globe" as const,
        title: "Based in Dubai, classroom everywhere",
        body: "The school operates from the UAE and the course is 100% online: follow it from any country and any time zone, without moving anywhere.",
      },
      {
        icon: "stack" as const,
        title: "Strategic tools and platforms",
        body: "Notion, Slack, Wise, Deel, Zapier and AI models, open on screen during class and built into every module's exercises.",
      },
    ],

    outcomes: {
      title: "A shared base, and then your path",
      coreTag: "Modules 01 – 07",
      coreName: "7 core modules",
      coreNote: "The same for everyone",
      takeLabel: "You leave with",
      paths: [
        {
          tag: "Modules 08 – 14",
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
          tag: "Modules 08 – 14",
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
          when: "Weekends 1 – 4",
          title: "You build the base",
          desc: "Tax, tools, AI, legal and remote working habits.",
        },
        {
          n: "03",
          when: "Weekends 4 – 7",
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
      title: "Fourteen modules over seven weekends",
      lead: "Two modules per weekend: seven of common core and seven of the specialisation you pick. Each opens with the framework, moves to the tool on screen and ends with an exercise applied to your own case.",
      howLabel: "The usual questions",
      how: [
        { icon: "check" as const, k: "Prior level", v: "None: the core starts from zero" },
        { icon: "globe" as const, k: "Language", v: "Classes in Spanish, materials in ES and EN" },
        { icon: "replay" as const, k: "When it ends", v: "A diploma listing the modules passed and the hours" },
        { icon: "chat" as const, k: "Between classes", v: "Team feedback and your group on Slack" },
        { icon: "clock" as const, k: "Real workload", v: "8 h of class per weekend and 2 – 3 h of exercise" },
      ],
      toolsLabel: "Opened in class, not in an appendix",
      cta: "Get the full syllabus",
      groups: [
        {
          tag: "Modules 01 – 07 · Everyone",
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
          tag: "Modules 08 – 14 · Path 01",
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
          tag: "Modules 08 – 14 · Path 02",
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

    jobs: {
      eyebrow: "Where it leads",
      title: "What each market pays for the same job",
      lead: "The same chair, three countries. That is the whole argument for international remote work in one table, and it is not us saying it: these are public Glassdoor averages and every figure links to its page.",
      salaryLabel: "Average annual salary, in local currency",
      markets: ["Spain", "United Kingdom", "United States"],
      roles: [
        {
          name: "Product Manager",
          pay: [
            { v: "€45,000", url: "https://www.glassdoor.es/Sueldos/product-manager-sueldo-SRCH_KO0,15.htm" },
            { v: "£63,126", url: "https://www.glassdoor.co.uk/Salaries/product-manager-salary-SRCH_KO0,15.htm" },
            { v: "$151,317", url: "https://www.glassdoor.com/Salaries/product-manager-salary-SRCH_KO0,15.htm" },
          ],
        },
        {
          name: "Product Marketing Manager",
          pay: [
            { v: "€48,000", url: "https://www.glassdoor.es/Sueldos/product-marketing-manager-sueldo-SRCH_KO0,25.htm" },
            { v: "£63,157", url: "https://www.glassdoor.co.uk/Salaries/product-marketing-manager-salary-SRCH_KO0,25.htm" },
            { v: "$141,190", url: "https://www.glassdoor.com/Salaries/product-marketing-manager-salary-SRCH_KO0,25.htm" },
          ],
        },
        {
          name: "Sales Development Representative",
          pay: [
            { v: "€33,000", url: "https://www.glassdoor.es/Sueldos/sales-development-representative-sueldo-SRCH_KO0,32.htm" },
            { v: "£39,680", url: "https://www.glassdoor.co.uk/Salaries/sales-development-representative-salary-SRCH_KO0,32.htm" },
            { v: "$103,886", url: "https://www.glassdoor.com/Salaries/sales-development-representative-salary-SRCH_KO0,32.htm" },
          ],
        },
        {
          name: "Data analyst",
          pay: [
            { v: "€29,200", url: "https://www.glassdoor.es/Sueldos/analista-de-datos-sueldo-SRCH_KO0,17.htm" },
            { v: "£37,641", url: "https://www.glassdoor.co.uk/Salaries/data-analyst-salary-SRCH_KO0,12.htm" },
            { v: "$93,535", url: "https://www.glassdoor.com/Salaries/data-analyst-salary-SRCH_KO0,12.htm" },
          ],
        },
      ],
      salaryNote: {
        before: "Averages from ",
        link: "Glassdoor",
        url: "https://www.glassdoor.com/Salaries/index.htm",
        after: " in each country, September 2026. Local currency, unconverted: they say what each market pays, not what you will earn.",
      },
      sectorsLabel: "Sectors where remote businesses get built",
      sectors: [
        "SaaS and software", "Consulting", "E-commerce", "Marketplaces", "Online education",
        "Marketing agencies", "Digital health", "Fintech", "Insurtech", "Legaltech",
        "HR tech and recruiting", "Content and media", "Design and creative", "Video and audio",
        "Automation and AI", "Cybersecurity", "Data and analytics", "Custom development",
        "No-code", "Translation and localisation", "Travel and tourism", "Real estate",
        "Logistics", "Energy and sustainability", "Sport and wellbeing", "Gaming",
        "Communities and memberships", "Coaching and mentoring", "Accounting and tax",
        "International trade",
      ],
    },
    office: {
      eyebrow: "Where we are",
      title: "Based in Dubai, students everywhere",
      hoursLabel: "Opening hours",
      hours: "Monday to Friday, 9:00 to 18:00 · GST (UTC+4)",
      addressLabel: "Address",
      mapLabel: "Map of the ActiveXRemote office in Dubai",
      mapCta: "Show the map",
      mapNotice: "You turned down preference cookies, so the Google map is not loaded. You can open it just for this visit.",
      note: "The school operates from the United Arab Emirates and the course is 100% online: there is nowhere to travel to.",
    },
    alumni: {
      title: "Where our students work",
    },

    sticky: {
      note: "The cohort starts on 9 January",
      cta: "Request information",
      units: { d: "d", h: "h", m: "m" },
    },

    whatsapp: {
      label: "Message us on WhatsApp",
      message: "Hi, I'm interested in the ActiveXRemote course. Could you tell me more?",
    },

    faculty: {
      title: "Who teaches the classes",
      notice: "Sample company logos, to be replaced with the real ones.",
    },

    final: {
      title: "We talk, then you decide",
      body: "Leave us your details and we'll send you the full syllabus, the dates and the terms. We reply within 24 working hours and there is no commitment of any kind.",
    },

    footer: {
      note: "Each brand belongs to its own company: partners provide benefits for our students, but they do not accredit the course or issue the diploma. The diploma is issued by ActiveXRemote listing the modules passed: it is a private company certification, not an official qualification or a university degree.",
    },
  },
} satisfies Record<Locale, unknown>;
