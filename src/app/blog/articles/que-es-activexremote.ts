import type { Article } from "@/app/blog/types";

// Post 1. Es la pieza que explica quiénes somos y por qué existe la escuela.
// Va destacada en el blog y en las landings, así que carga con dos trabajos:
// convencer a quien llega frío y ser la puerta de entrada al resto del blog.
//
// Se escribe con las reglas del brandbook: tuteo, contraste «no es X, es Y»,
// frases por debajo de 20 palabras y cifras en vez de adjetivos.
export const article: Article = {
  slug: "que-es-activexremote",
  locale: "es",
  cluster: "metodo",
  funnel: "mofu",
  intent: "navegacional",
  keyword: "qué es ActiveXRemote",
  secondary: [
    "escuela de trabajo remoto internacional",
    "manifiesto trabajo remoto",
    "formación trabajo sin fronteras",
    "Remote Professional Remote Founder",
    "opiniones ActiveXRemote",
  ],
  title: "Qué es ActiveXRemote, y por qué existe",
  h1: "Qué es ActiveXRemote, y por qué existe",
  metaTitle: "Qué es ActiveXRemote: manifiesto, método y para quién es",
  metaDescription:
    "La escuela de trabajo remoto internacional: por qué nace, qué principios la sostienen, qué son los dos caminos y qué te llevas al terminar. Sin promesas de cambio de vida.",
  ogTitle: "Qué es ActiveXRemote, y por qué existe",
  ogDescription:
    "Manifiesto, valores y método de una escuela de trabajo remoto internacional. Con los números y los límites por delante.",
  published: "2026-03-24",
  updated: "2026-08-18",
  readingMinutes: 9,
  author: "Equipo ActiveXRemote",
  terms: [
    "trabajo-remoto",
    "negocio-borderless",
    "employer-of-record",
    "residencia-fiscal",
    "trabajo-asincrono",
    "solopreneur",
  ],
  related: ["curso-trabajo-remoto-cual-elegir", "trabajo-remoto-internacional-desde-espana", "conseguir-clientes-b2b-internacionales", "de-freelance-a-negocio-productizado"],
  external: [
    { label: "Eurofound · Telework and hybrid work in the EU", url: "https://www.eurofound.europa.eu" },
    { label: "OIT · Trabajo a distancia y condiciones de trabajo", url: "https://www.ilo.org" },
    { label: "Comisión Europea · Digital Skills and Jobs Platform", url: "https://digital-skills-jobs.europa.eu" },
  ],
  intro: [
    "ActiveXRemote es una escuela de trabajo remoto internacional. No enseña a usar Zoom. Enseña a competir por un empleo que se paga en otra moneda, a cobrarlo sin perder un cuarto por el camino y a montar un negocio que no dependa de dónde duermes.",
    "Este es el primer artículo del blog, y hace de puerta de entrada. Explica de dónde sale la escuela, qué principios la sostienen, qué recibes exactamente y —esto importa— para quién no es.",
  ],
  sections: [
    {
      id: "manifiesto",
      h2: "El manifiesto: el remoto no falla por la distancia",
      answer:
        "ActiveXRemote nace de una observación repetida: los equipos y las carreras remotas no fracasan por la distancia, sino porque nadie enseñó a trabajar así. Se traslada la oficina a casa, con sus reuniones y su presencialismo, y luego se culpa al modelo del resultado.",
      blocks: [
        {
          t: "quote",
          text: "El remoto no falla por la distancia. Falla cuando no sabemos adaptarnos a esta forma de trabajar.",
          by: "Manifiesto ActiveXRemote",
        },
        {
          t: "p",
          text: "La distancia es un hecho, no un problema. El problema aparece cuando se intenta hacer a distancia exactamente lo que se hacía en una oficina: decidir en reuniones, medir por horas visibles y comunicar de viva voz sin dejar rastro.",
        },
        {
          t: "p",
          text: "Trabajar sin fronteras es un oficio con reglas propias. Se escribe para decidir, se documenta para no repetir y se protege el foco porque nadie lo va a proteger por ti. Nada de eso es intuitivo y casi nadie lo ha estudiado.",
        },
        {
          t: "p",
          text: "A eso se suma una capa que en la oficina no existía: contratos entre países, residencia fiscal, cobros en varias monedas y husos horarios que deciden si te llaman o no. El talento no basta cuando el sistema no se conoce.",
        },
      ],
      takeaway: "El remoto no es la oficina desde casa. Es otro oficio, y se aprende.",
    },
    {
      id: "valores",
      h2: "Cuatro principios que se pueden comprobar",
      answer:
        "Un valor que no se puede verificar es un eslogan. Estos cuatro se traducen en decisiones concretas del programa: entregables en vez de apuntes, cifras en vez de adjetivos, límites declarados y herramientas reales del mercado.",
      blocks: [
        {
          t: "steps",
          items: [
            {
              title: "Sales con entregables, no con apuntes",
              text: "Cada módulo produce algo que existe fuera del campus: un currículum que pasa el filtro, un portfolio publicado, una estructura de cobro montada. Si al terminar sólo tienes notas, el módulo ha fallado.",
            },
            {
              title: "La cifra sustituye al adjetivo",
              text: "14 módulos. 56 horas en directo. 14 semanas. Grupos de 25. Nada de «formación transformadora»: los números se pueden contrastar y los adjetivos no.",
            },
            {
              title: "Los límites van por delante",
              text: "El diploma lo emitimos nosotros y no equivale a un título oficial. No garantizamos empleo. Y el temario dice qué no cubre. Quien decide con la información completa reclama menos y aprovecha más.",
            },
            {
              title: "Se estudia con las herramientas del mercado",
              text: "Los contratos que se analizan son contratos reales; las ofertas, ofertas que están publicadas. Se trabaja sobre las plataformas que se usan de verdad, no sobre capturas de ejemplo.",
            },
          ],
        },
      ],
      takeaway: "Si un principio no cambia una decisión del programa, no es un principio.",
    },
    {
      id: "dos-caminos",
      h2: "Dos caminos, un mismo núcleo",
      answer:
        "El programa tiene 14 módulos: 7 de núcleo común y 7 de especialización. El núcleo cubre lo que necesita cualquiera que trabaje sin fronteras. Después eliges camino: Remote Professional si buscas empleo, Remote Founder si montas negocio. Puedes hacer los dos.",
      blocks: [
        {
          t: "p",
          text: "El núcleo no es relleno introductorio. Son los siete módulos que casi nadie estudia y que deciden el resultado: mentalidad y mercado global, geoposicionamiento y fiscalidad, relocalización, stack de herramientas, productividad con IA, energía y salud, y fundamentos legales.",
        },
        {
          t: "table",
          head: ["", "Remote Professional", "Remote Founder"],
          rows: [
            ["Para quién", "Empleados y contractors", "Founders, freelancers y solopreneurs"],
            ["Qué persigue", "Un empleo remoto internacional mejor pagado", "Un negocio que funcione sin ti delante"],
            ["Módulos propios", "Búsqueda, candidatura con IA, marca personal, entrevista, negociación, primeros 90 días, roles fraccionales", "Diseño y validación, IA en operaciones, clientes B2B, oferta y página, SOP y sistemas, automatización, estructura societaria"],
            ["Entregable final", "Una candidatura que compite fuera", "Una oferta vendible y su sistema detrás"],
          ],
        },
        {
          t: "note",
          text: "Los dos caminos comparten los 7 módulos de núcleo. Hacer los dos no significa repetir la mitad del programa.",
        },
      ],
      takeaway: "El núcleo lo hacen todos. La especialización la eliges tú.",
    },
    {
      id: "metodo",
      h2: "Cómo es una clase, en concreto",
      answer:
        "Cada módulo es una sesión de 4 horas en directo, una por semana durante 14 semanas. La sesión tiene cuatro partes fijas: contexto, profundización técnica sobre la herramienta real, taller sobre tu propio caso y preguntas con los siguientes pasos.",
      blocks: [
        {
          t: "ol",
          items: [
            "Contexto: por qué esto decide el resultado y qué cambia en el mercado.",
            "Profundización técnica: la herramienta o el marco, en pantalla y funcionando.",
            "Taller: lo aplicas a tu caso, no a un ejemplo inventado.",
            "Preguntas y siguiente paso: qué haces esta semana antes de la próxima sesión.",
          ],
        },
        {
          t: "p",
          text: "Las clases quedan grabadas en el campus, con audio narrado y los materiales del módulo. El acompañamiento entre sesiones va por Slack, que además es una de las herramientas que se estudian.",
        },
        {
          t: "pros",
          pros: [
            "En directo: puedes preguntar por tu caso concreto",
            "Grupos de 25: hay tiempo para todos",
            "Grabado: si faltas una semana, no te descuelgas",
            "Un entregable por módulo, revisado",
          ],
          cons: [
            "Pide 4 horas fijas a la semana durante 14 semanas",
            "El taller no funciona si no traes tu caso",
            "No es a tu ritmo: la cohorte avanza junta",
          ],
        },
      ],
      takeaway: "Una sesión de 4 h por semana, 14 semanas, y un entregable cada vez.",
    },
    {
      id: "para-quien-no-es",
      h2: "Para quién no es",
      answer:
        "No es para quien busca ingresos pasivos ni un método rápido. Tampoco para quien quiere estudiar a su ritmo, ni para quien espera que el diploma sustituya a la experiencia. Decirlo antes ahorra una matrícula equivocada.",
      blocks: [
        {
          t: "ul",
          items: [
            "Si buscas ingresos pasivos o un atajo, este programa te va a decepcionar: todo lo que enseña exige trabajo.",
            "Si necesitas avanzar a tu ritmo, la cohorte con horario fijo te va a estorbar.",
            "Si esperas que una certificación privada abra puertas por sí sola, no las abre. Lo que abre puertas es el entregable que sales produciendo.",
            "Si tu problema es de oficio y no de contexto —no dominas todavía lo que quieres vender—, primero conviene resolver eso.",
          ],
        },
        {
          t: "note",
          text: "Publicamos un artículo entero con los criterios para evaluar cualquier curso de trabajo remoto, incluido el nuestro. Está enlazado al final.",
        },
      ],
      takeaway: "Un programa que no sabe decir para quién no es, no sabe para quién es.",
    },
    {
      id: "que-es-el-blog",
      h2: "Qué es este blog y cómo usarlo",
      answer:
        "El blog publica una guía por semana sobre los mismos temas del programa: empleo, fiscalidad, legal, negocio, método y herramientas. Cada guía resuelve una duda concreta y enlaza a los términos del diccionario que da por sabidos.",
      blocks: [
        {
          t: "p",
          text: "Está escrito con la misma regla que las clases: primero la respuesta, después el desarrollo. Cada sección empieza resolviendo la pregunta en cuatro o cinco líneas, para que sirva aunque no leas el resto.",
        },
        {
          t: "p",
          text: "El diccionario es la otra mitad. Reúne los términos que aparecen en cualquier proceso remoto internacional —Employer of Record, residencia fiscal, solapamiento horario— con una definición corta y una larga. Cuando un artículo usa uno, lo enlaza.",
        },
        {
          t: "ul",
          items: [
            "Si estás empezando: la guía de trabajo remoto internacional desde España.",
            "Si ya tienes claro el camino: los artículos de tu cluster, empleo o negocio.",
            "Si vas a pagar por formación: los criterios para distinguir formación de humo.",
            "Si te pierdes con un término: búscalo en el diccionario de la A a la Z.",
          ],
        },
      ],
      takeaway: "Una guía por semana. Primero la respuesta, después el desarrollo.",
    },
  ],
  faqs: [
    { q: "¿Qué es exactamente ActiveXRemote?", a: "Una escuela de trabajo remoto internacional. Imparte un programa de 14 módulos en directo, con dos caminos: Remote Professional, para conseguir empleo remoto internacional, y Remote Founder, para montar un negocio sin fronteras." },
    { q: "¿Es un curso grabado o en directo?", a: "En directo. Una sesión de 4 horas por semana durante 14 semanas, en grupos de 25. Las clases se graban y quedan en el campus con audio narrado, pero la sesión se da en vivo y el taller se hace sobre tu caso." },
    { q: "¿El diploma es un título oficial?", a: "No. Es una certificación privada que emite ActiveXRemote: detalla los módulos superados y las horas lectivas. No equivale a un grado universitario ni a un título académico oficial." },
    { q: "¿Necesito conocimientos previos?", a: "No. Los 7 módulos de núcleo común parten de cero y la especialización sube de nivel de forma progresiva. Lo que sí ayuda es traer un caso propio al taller: tu candidatura, tu servicio o tu idea." },
    { q: "¿Puedo hacer los dos caminos?", a: "Sí. Comparten los 7 módulos de núcleo, así que hacer los dos no supone repetir la mitad del programa. En la página de matrícula hay una opción concreta para los dos cursos." },
    { q: "¿Garantizáis encontrar trabajo?", a: "No, y desconfía de quien lo garantice. Lo que se garantiza es el entregable: sales con la candidatura, el portfolio y la estrategia de negociación hechos y revisados. El resultado depende también del mercado y de ti." },
    { q: "¿Dónde está la empresa?", a: "ActiveX FZC LLC está constituida en Emiratos Árabes Unidos y dirige el programa a personas residentes en la Unión Europea, por lo que aplica el RGPD. Los datos completos están en el aviso legal." },
    { q: "¿Cada cuánto publicáis en el blog?", a: "Una guía por semana. Se publican en español y en inglés, y cada versión tiene su propia dirección: las españolas cuelgan de la raíz y las inglesas de /en." },
  ],
  hero: {
    file: "/blog/manifiesto.svg",
    alt: "Diagrama: un origen del que salen dos caminos que comparten su primer tramo.",
  },
};
