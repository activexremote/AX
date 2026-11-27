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
//  Aquí sólo entra lo que ya sostiene la web pública (formato 2.0, nov. 2026):
//  Remote Professional 8 semanas, Remote Founder 13, unas 12,5 h a la semana,
//  una clase en directo de 2 h entre semana, grupos de 25. Nada de cifras
//  nuevas. Las semanas de cada curso no se escriben aquí: el temario las lee
//  de cursos/copy.ts, igual que la portada.
//
//  ⚠︎ SIN PRECIOS. Se han retirado a petición del equipo: esta página no
//  muestra importes por ahora. Si vuelven, van en `hero.facts`, que es de
//  donde salieron.
//
//  ⚠︎ El CALENDARIO es el de toda la web: la convocatoria arranca el 9 de
//  enero de 2027. La fecha vive en bienvenida/cohort.ts. No se da fecha de
//  fin: depende del curso (8 o 13 semanas).
//
//  En particular NO hay rangos salariales ni número de alumnos: la
//  referencia los lleva, nosotros no tenemos dato verificable y publicarlo
//  inventado es publicidad engañosa (ver src/app/bienvenida/flags.ts).
//
//  ── Reparto: cada cosa se dice UNA vez ───────────────────
//  Una landing que repite parece más larga de lo que es y hace dudar de si te
//  has perdido algo. Cada dato tiene un dueño y sólo uno:
//
//    hero .......... qué es, para quién y cuándo empieza
//    statement ..... quiénes somos y cómo enseñamos, en una frase
//    jobs .......... a qué empleos y a qué sectores lleva esto
//    live .......... CÓMO se da la clase (en directo, irrepetible, online)
//    pillars ....... POR QUÉ funciona — cuatro cosas que no dice nadie más
//    outcomes ...... la ESTRUCTURA y a dónde lleva cada camino
//    timeline ...... QUÉ TE PASA a ti desde que dejas los datos
//    program ....... el temario, las objeciones y las herramientas
//    final ......... la acción y las empresas referentes del trabajo remoto
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
      title: "Formación online en directo para trabajar sin fronteras · Remote Professional y Remote Founder",
      description:
        "Curso 100 % online, en español y con clase en directo cada semana: consigue un empleo remoto internacional en 8 semanas o monta tu negocio global en 13. Grupos de 25 plazas.",
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
      lead: "Formación online con una clase en directo cada semana. 8 semanas para el empleo, 13 para el negocio, y cada semana terminas con algo que ya puedes usar.",
      formTitle: "Recibe el curso completo",
      formLead: "Temario, fechas, horarios y condiciones. Sin compromiso.",
      // Tres datos de decisión: qué formato, cuándo empieza y a qué ritmo.
      facts: [
        { k: "Formato", v: "100 % online, clase en directo semanal" },
        { k: "Empieza", v: "9 de enero de 2027 · 8 o 13 semanas" },
        { k: "Ritmo", v: "Unas 12,5 h a la semana" },
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

    // ⚠︎ Nada de «Top #1» ni «líder»: son superlativos comparativos y la
    // Directiva 2005/29/CE pide poder demostrarlos. «Especialista» describe
    // lo que somos sin compararnos con nadie.
    statement: {
      top: "ActiveXRemote, la escuela especialista en formación práctica y 100 % actualizada en Remote Business.",
      bottom: "Fórmate en directo y online, con una metodología diseñada para avanzar al ritmo del mercado remoto actual.",
    },

    // ── CÓMO ES LA CLASE ─────────────────────────────────
    // Esta sección es la dueña de "en directo" y de "desde donde quieras".
    // Nadie más lo explica, sólo lo da por sabido.
    live: {
      badge: "En directo",
      title: "Clases en directo de fundadores de empresas y perfiles clave que trabajan en remoto.",
      body: "Cada semana, una clase de dos horas en directo con tu grupo: la teoría ya la has visto en vídeo, así que la clase es para practicar con casos reales y las herramientas que usan las empresas que trabajan en remoto.",
      points: [
        { k: "En vivo, con tu grupo", v: "Una clase de 2 h a la semana, un día fijo entre semana, para practicar con el resto del grupo." },
        { k: "Desde donde estés", v: "Solo hace falta conexión: da igual el país o el huso. Los vídeos van a tu ritmo." },
        { k: "Y queda grabada", v: "En el campus, por si un día no puedes ir." },
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
        body: "Clases en directo con quien trabaja así todos los días. Grupos de 25, un ejercicio sobre tu caso cada semana y un pod de 4–5 personas que lo revisa contigo.",
      },
      {
        icon: "globe" as const,
        title: "Sede en Dubái, aula en todo el mundo",
        body: "La escuela opera desde Emiratos y el curso es 100 % online: se sigue desde cualquier país y cualquier huso horario, sin mudarte a ninguna parte.",
      },
      {
        icon: "stack" as const,
        title: "Herramientas y plataformas estratégicas",
        body: "Notion, Slack, Wise, Deel, Zapier y modelos de IA, abiertos en pantalla y con una herramienta de IA nueva cada semana, integrada en el ejercicio.",
      },
    ],

    // ── LA ESTRUCTURA ────────────────────────────────────
    // Dueña de "dos caminos" y de las cuatro salidas. El cronograma de abajo
    // no vuelve a contar las semanas: cuenta lo que te pasa a ti.
    outcomes: {
      title: "Una escuela, dos cursos con su propio recorrido: Remote Professional o Remote Founder",
      coreTag: "Mismo método",
      coreName: "Una semana, una habilidad",
      coreNote: "Vídeos, clase en directo y ejercicio sobre tu caso",
      takeLabel: "Sales con",
      paths: [
        {
          tag: "8 semanas",
          name: "Remote Professional",
          items: [
            {
              role: "Para conseguir empleo fuera",
              take: "CV y LinkedIn que atraen reclutadores, entrevista ensayada y oferta negociada",
            },
            {
              role: "Para trabajar desde cualquier país",
              take: "Contrato y fiscalidad bajo control, y la IA como ayudante en tu trabajo",
            },
          ],
        },
        {
          tag: "13 semanas",
          name: "Remote Founder",
          items: [
            {
              role: "Para montar tu negocio",
              take: "Una oferta validada con compradores reales y clientes B2B internacionales",
            },
            {
              role: "Para dejar de vender horas",
              take: "Entrega, back office automatizado y tu empresa constituida en regla",
            },
          ],
        },
      ],
    },

    // ── QUÉ TE PASA A TI ─────────────────────────────────
    // Empieza en el formulario a propósito: la duda de quien está leyendo un
    // anuncio no es «cuántas semanas hay», es «qué pasa si dejo mis datos».
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
          when: "Antes del 9 de enero",
          title: "Reservas plaza",
          desc: "Eliges curso y reservas tu plaza. Entras al campus y al Slack del grupo.",
        },
        {
          n: "02",
          when: "Semana 0",
          title: "Conoces a tu pod",
          desc: "Te presentas al grupo y conoces a tu pod de 4–5 personas antes de la primera clase.",
        },
        {
          n: "03",
          when: "Cada semana",
          title: "Una habilidad nueva",
          desc: "Vídeos a tu ritmo, clase en directo de 2 h y un ejercicio sobre tu caso real.",
        },
        {
          n: "04",
          when: "Semana 8 o 13",
          title: "Terminas con el trabajo hecho",
          desc: "Graduación en Professional, Demo Day en Founder, y el diploma de ActiveXRemote.",
        },
      ],
    },

    marquee: {
      label: "El stack que montas",
    },

    // ── EL TEMARIO Y LAS DUDAS ───────────────────────────
    program: {
      eyebrow: "El temario",
      title: "Dos cursos, semana a semana",
      lead: "Cada semana trabaja una habilidad: material previo y 6 vídeos de 30 minutos, una clase en directo de 2 horas para practicar, un ejercicio sobre tu caso y un test. Remote Professional son 8 semanas; Remote Founder, 13.",
      // Cinco dudas que no contesta ninguna otra sección. El formato y el
      // ritmo ya están en el héroe y no vuelven aquí.
      howLabel: "Las dudas de siempre",
      how: [
        { icon: "check" as const, k: "Nivel previo", v: "Ninguno: empiezas desde tu punto de partida" },
        { icon: "globe" as const, k: "Idioma", v: "Clases en español, materiales en ES y EN" },
        { icon: "replay" as const, k: "Al terminar", v: "Diploma de ActiveXRemote" },
        { icon: "chat" as const, k: "Entre clase y clase", v: "Tu pod y el grupo en Slack" },
        { icon: "clock" as const, k: "Dedicación real", v: "Unas 12,5 h a la semana, compatibles con tu trabajo" },
      ],
      toolsLabel: "Se abren en clase, no en un anexo",
      cta: "Recibe el temario completo",
      // Las semanas salen de cursos/copy.ts; aquí sólo los rótulos.
      tracks: [
        { slug: "remote-professional" as const, tag: "Curso 01 · 8 semanas", name: "Remote Professional" },
        { slug: "remote-founder" as const, tag: "Curso 02 · 13 semanas", name: "Remote Founder" },
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
    // ⚠︎ NO decir «donde trabajan nuestros alumnos»: sería atribuirnos una
    // relación con estas empresas que no existe. Son los referentes del
    // trabajo remoto que se estudian, y el titular dice exactamente eso.
    alumni: {
      title: "Empresas referentes del trabajo remoto",
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

    final: {
      title: "Hablamos y decides",
      body: "Déjanos tus datos y te enviamos el temario completo, las fechas y las condiciones. Te escribimos en menos de 24 horas laborables y no hay compromiso de nada.",
    },

    // El pie es el MISMO que el de la portada (columnas, selector de idioma,
    // tarjetas aceptadas y quién cobra), así que su texto sale de
    // bienvenida/copy.ts y aquí sólo queda lo propio de esta página.
    footer: {
      note: "Cada marca es propiedad de su compañía: los partners aportan beneficios para nuestros alumnos y Deel acredita contenidos de los dos cursos, pero ninguno emite el diploma. El diploma lo emite ActiveXRemote: es una certificación privada de empresa, no un título oficial ni un grado universitario.",
    },
  },

  en: {
    meta: {
      title: "Live online training to work without borders · Remote Professional and Remote Founder",
      description:
        "A 100% online course in Spanish with a live class every week: land an international remote job in 8 weeks or build your own global business in 13. Cohorts of 25.",
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
      lead: "Online training in Spanish with a live class every week. 8 weeks for the job, 13 for the business, and every week ends with something you can already use.",
      formTitle: "Get the full course",
      formLead: "Syllabus, dates, schedule and terms. No strings attached.",
      facts: [
        { k: "Format", v: "100% online, weekly live class" },
        { k: "Starts", v: "9 January 2027 · 8 or 13 weeks" },
        { k: "Pace", v: "Around 12.5 h a week" },
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
      top: "ActiveXRemote, the specialist school for hands-on, 100% up-to-date Remote Business training.",
      bottom: "Train live and online, with a method designed to keep pace with today's remote market.",
    },

    live: {
      badge: "Live",
      title: "Live classes from company founders and key people who work remotely.",
      body: "Every week, a two-hour live class with your group: you've already seen the theory on video, so class is for practising real cases with the tools remote companies use.",
      points: [
        { k: "Live, with your group", v: "One 2-hour class a week, on a fixed weekday, to practise with the rest of the group." },
        { k: "From wherever you are", v: "All you need is a connection: country and time zone don't matter. Videos go at your own pace." },
        { k: "And it is recorded", v: "It stays in the campus in case you can't make it one day." },
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
        body: "Live classes with people who work this way every day. Groups of 25, an exercise on your own case every week and a pod of 4–5 people who review it with you.",
      },
      {
        icon: "globe" as const,
        title: "Based in Dubai, classroom everywhere",
        body: "The school operates from the UAE and the course is 100% online: follow it from any country and any time zone, without moving anywhere.",
      },
      {
        icon: "stack" as const,
        title: "Strategic tools and platforms",
        body: "Notion, Slack, Wise, Deel, Zapier and AI models, open on screen, with a new AI tool every week built into the exercise.",
      },
    ],

    outcomes: {
      title: "One school, two courses with their own route: Remote Professional or Remote Founder",
      coreTag: "Same method",
      coreName: "One week, one skill",
      coreNote: "Videos, a live class and an exercise on your case",
      takeLabel: "You leave with",
      paths: [
        {
          tag: "8 weeks",
          name: "Remote Professional",
          items: [
            {
              role: "To land a job abroad",
              take: "A CV and LinkedIn that attract recruiters, a rehearsed interview and a negotiated offer",
            },
            {
              role: "To work from any country",
              take: "Contract and tax under control, and AI as your assistant at work",
            },
          ],
        },
        {
          tag: "13 weeks",
          name: "Remote Founder",
          items: [
            {
              role: "To build your business",
              take: "An offer validated with real buyers and international B2B clients",
            },
            {
              role: "To stop selling hours",
              take: "Delivery, an automated back office and your company incorporated and compliant",
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
          when: "Before 9 January",
          title: "You book a place",
          desc: "You pick your course and book your place. You get into the campus and the group's Slack.",
        },
        {
          n: "02",
          when: "Week 0",
          title: "You meet your pod",
          desc: "You introduce yourself to the group and meet your pod of 4–5 people before the first class.",
        },
        {
          n: "03",
          when: "Every week",
          title: "A new skill",
          desc: "Videos at your own pace, a 2-hour live class and an exercise on your real case.",
        },
        {
          n: "04",
          when: "Week 8 or 13",
          title: "You finish with the work done",
          desc: "Graduation in Professional, Demo Day in Founder, and the ActiveXRemote diploma.",
        },
      ],
    },

    marquee: {
      label: "The stack you build",
    },

    program: {
      eyebrow: "The syllabus",
      title: "Two courses, week by week",
      lead: "Each week works on one skill: prep material and six 30-minute videos, a 2-hour live class to practise, an exercise on your case and a test. Remote Professional runs for 8 weeks; Remote Founder for 13.",
      howLabel: "The usual questions",
      how: [
        { icon: "check" as const, k: "Prior level", v: "None: you start from where you are" },
        { icon: "globe" as const, k: "Language", v: "Classes in Spanish, materials in ES and EN" },
        { icon: "replay" as const, k: "When it ends", v: "The ActiveXRemote diploma" },
        { icon: "chat" as const, k: "Between classes", v: "Your pod and the group on Slack" },
        { icon: "clock" as const, k: "Real workload", v: "Around 12.5 h a week, alongside your job" },
      ],
      toolsLabel: "Opened in class, not in an appendix",
      cta: "Get the full syllabus",
      tracks: [
        { slug: "remote-professional" as const, tag: "Course 01 · 8 weeks", name: "Remote Professional" },
        { slug: "remote-founder" as const, tag: "Course 02 · 13 weeks", name: "Remote Founder" },
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
      title: "Leading remote-first companies",
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

    final: {
      title: "We talk, then you decide",
      body: "Leave us your details and we'll send you the full syllabus, the dates and the terms. We reply within 24 working hours and there is no commitment of any kind.",
    },

    footer: {
      note: "Each brand belongs to its own company: partners provide benefits for our students and Deel accredits content in both courses, but none of them issues the diploma. The diploma is issued by ActiveXRemote: it is a private company certification, not an official qualification or a university degree.",
    },
  },
} satisfies Record<Locale, unknown>;
