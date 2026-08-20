import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "ia-para-buscar-trabajo-remoto",
  locale: "es",
  cluster: "herramientas",
  funnel: "mofu",
  intent: "comercial",
  keyword: "usar IA para buscar trabajo",
  secondary: [
    "chatgpt para adaptar el currículum",
    "prompts para preparar entrevistas",
    "inteligencia artificial búsqueda de empleo",
    "carta de presentación con IA",
    "detectar texto generado por IA",
  ],
  title: "IA para buscar trabajo remoto: lo que funciona y lo que te delata",
  h1: "IA para buscar trabajo remoto: lo que funciona y lo que te delata",
  metaTitle: "IA para buscar trabajo remoto: usos que funcionan y errores",
  metaDescription:
    "Dónde la IA acelera de verdad una candidatura internacional, dónde la estropea, y cómo se nota que un texto está generado. Con instrucciones concretas para cada tarea.",
  ogTitle: "IA para buscar trabajo remoto",
  ogDescription:
    "Acelera la preparación, no sustituye el criterio. Los usos que funcionan y las señales que delatan un texto generado.",
  published: "2026-06-30",
  updated: "2026-06-30",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["prompt-engineering", "agente-ia", "ats", "cv-internacional", "portfolio-internacional"],
  related: ["cv-internacional-ats", "portfolio-para-recruiters-internacionales", "automatizar-negocio-sin-codigo", "entrevista-remota-video-asincrona"],
  external: [
    { label: "Comisión Europea · Reglamento Europeo de Inteligencia Artificial", url: "https://digital-strategy.ec.europa.eu" },
    { label: "Comité Europeo de Protección de Datos · Tratamiento de datos personales", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "La IA no consigue trabajo. Lo que hace es quitar horas de trabajo mecánico —adaptar, resumir, ordenar, ensayar— y devolverlas para lo que sí decide: entender la oferta, preparar ejemplos propios y hablar con personas.",
    "El problema es que la mayoría la usa justo al revés: para escribir lo que debería ser personal y para saltarse la preparación que sí importa. Esta guía separa una cosa de la otra, con instrucciones concretas para cada tarea.",
  ],
  sections: [
    {
      id: "donde-funciona",
      h2: "Dónde acelera de verdad",
      answer:
        "En cuatro tareas: entender qué pide realmente una oferta, adaptar la estructura del currículum al vocabulario de esa oferta, preparar preguntas de entrevista con respuestas propias y ensayar la negociación. Todas tienen algo en común: el material de partida lo pones tú.",
      blocks: [
        {
          t: "table",
          head: ["Tarea", "Qué le pides", "Qué sigues poniendo tú"],
          rows: [
            ["Analizar una oferta", "Extraer requisitos explícitos, implícitos y señales de solapamiento y país", "La decisión de si encaja"],
            ["Adaptar el currículum", "Reordenar y ajustar vocabulario a partir de tu texto real", "Los logros, las cifras y la verdad"],
            ["Preparar la entrevista", "Generar las quince preguntas probables para ese puesto", "Las respuestas, con tus ejemplos"],
            ["Ensayar la negociación", "Simular objeciones del reclutador", "Tu cifra y tus límites"],
          ],
        },
        {
          t: "p",
          text: "El patrón es siempre el mismo: la IA acelera la parte estructural y repetitiva; el contenido verificable sigue saliendo de tu experiencia. En cuanto se invierte esa relación, el resultado se nota y juega en tu contra.",
        },
      ],
      takeaway:
        "Úsala para ordenar y ensayar, no para inventar. El material tiene que ser tuyo.",
    },
    {
      id: "oferta",
      h2: "Analizar una oferta antes de aplicar",
      answer:
        "Es el uso más rentable y el que casi nadie hace. Antes de tocar el currículum, conviene extraer de la oferta los requisitos reales, el vocabulario exacto que usa y las condiciones que no siempre están destacadas: horas de solapamiento, países elegibles y figura contractual.",
      blocks: [
        {
          t: "note",
          text: "Instrucción tipo: «Analiza esta oferta. Devuelve: 1) requisitos imprescindibles, 2) requisitos deseables, 3) vocabulario y términos exactos que debería reflejar mi candidatura, 4) horas de solapamiento y países elegibles si se mencionan, 5) qué figura contractual sugiere el texto, 6) tres preguntas que debería hacer en la primera llamada.»",
        },
        {
          t: "p",
          text: "El punto cuatro es el que más candidaturas ahorra. Descubrir que la oferta pide cuatro horas de solapamiento con la costa oeste antes de invertir una tarde en adaptar el currículum es la diferencia entre aplicar con criterio y aplicar por volumen.",
        },
      ],
      takeaway:
        "Analiza la oferta antes de escribir nada. Es el paso que más tiempo devuelve.",
    },
    {
      id: "curriculum",
      h2: "Adaptar el currículum sin que suene generado",
      answer:
        "La forma correcta es partir de tu texto real y pedir reordenación y ajuste de vocabulario, no redacción desde cero. Un currículum escrito íntegramente por un modelo se reconoce por lo mismo siempre: frases equilibradas, adjetivos abundantes y ninguna cifra concreta.",
      blocks: [
        {
          t: "ul",
          items: [
            "Dale tu currículum actual y la oferta, y pide que ajuste el titular, el resumen y el orden de las herramientas.",
            "Prohíbe expresamente inventar: «no añadas ninguna experiencia, herramienta ni cifra que no esté en mi texto».",
            "Pide que marque los huecos en vez de rellenarlos: «señala dónde falta una cifra para que la añada yo».",
            "Revisa frase por frase. Si hay algo que no podrías defender en una entrevista, fuera.",
          ],
        },
        {
          t: "p",
          text: "Y no le pidas que «mejore» el estilo sin más. El resultado suele ser más largo, más adjetivado y menos concreto, que es exactamente lo contrario de lo que funciona en una candidatura internacional.",
        },
      ],
      takeaway:
        "Reordenar y ajustar vocabulario, sí. Redactar desde cero, no.",
    },
    {
      id: "delata",
      h2: "Lo que delata un texto generado",
      answer:
        "No es una herramienta de detección: es el patrón. Frases de longitud uniforme, estructura de tres elementos repetida, abundancia de adjetivos vacíos, ausencia total de cifras y un tono entusiasta que no encaja con ningún profesional escribiendo sobre su propio trabajo.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Frases de longitud desigual, como escribe cualquiera.",
            "Detalles concretos: nombres de herramientas, cifras, plazos.",
            "Alguna opinión o decisión discutible, que es lo que demuestra criterio.",
            "Vocabulario del sector, no vocabulario de folleto.",
          ],
          cons: [
            "«Apasionado por la excelencia y la mejora continua».",
            "Tríadas por todas partes: «rápido, eficiente y escalable».",
            "Cero números en toda la carta.",
            "Un párrafo final que resume lo ya dicho sin añadir nada.",
          ],
        },
        {
          t: "p",
          text: "Muchas empresas ya no penalizan el uso de IA en sí; penalizan la candidatura indistinguible de otras cien. Si el texto no contiene nada que sólo tú podrías haber escrito, el problema no es la herramienta sino la falta de contenido propio.",
        },
      ],
      takeaway:
        "Lo que delata no es la IA: es la ausencia de cualquier detalle que sólo tú puedas aportar.",
    },
    {
      id: "limites",
      h2: "Dos límites que conviene respetar",
      answer:
        "Primero, los datos: pegar contratos, ofertas confidenciales o información de terceros en una herramienta de terceros tiene implicaciones de privacidad. Segundo, la honestidad: adornar la experiencia se sostiene hasta la primera pregunta técnica, y a partir de ahí destruye la candidatura entera.",
      blocks: [
        {
          t: "ol",
          items: [
            "No pegues datos personales de terceros, contratos ni información sujeta a confidencialidad.",
            "Revisa qué hace la herramienta con tus datos y si los usa para entrenar; en las versiones de pago suele poder desactivarse.",
            "No declares experiencia, herramientas ni certificaciones que no tengas: en una entrevista técnica se detecta en dos preguntas.",
            "Si la empresa pregunta expresamente si has usado IA en una prueba, contesta la verdad. Mentir sobre eso pesa más que el uso en sí.",
          ],
        },
      ],
      takeaway:
        "Acelera la preparación, no inventes el fondo. Lo segundo se descubre siempre.",
    },
  ],
  faqs: [
    { q: "¿Está mal usar IA para preparar una candidatura?", a: "No. Lo que penalizan las empresas es una candidatura indistinguible de cualquier otra, sin detalles propios ni cifras. Usarla para analizar la oferta, reordenar el currículum y ensayar la entrevista es un uso legítimo y útil." },
    { q: "¿Pueden detectar que mi carta la ha escrito una IA?", a: "Los detectores automáticos son poco fiables, pero el patrón se reconoce a simple vista: frases uniformes, adjetivos abundantes y ninguna cifra. Lo que delata no es la herramienta, es la falta de contenido propio." },
    { q: "¿Puedo pedirle que escriba mi currículum desde cero?", a: "Puedes, pero saldrá genérico y con riesgo de inventar. Es mucho mejor darle tu texto real y pedir reordenación y ajuste de vocabulario, prohibiendo expresamente añadir nada que tú no hayas escrito." },
    { q: "¿Qué instrucción funciona mejor para analizar una oferta?", a: "Pedirle requisitos imprescindibles y deseables por separado, el vocabulario exacto a reflejar, las horas de solapamiento y países elegibles, la figura contractual que sugiere el texto y tres preguntas para la primera llamada." },
    { q: "¿Es seguro pegar una oferta o un contrato en una herramienta de IA?", a: "Una oferta pública no plantea problema. Un contrato, datos de terceros o información confidencial sí: revisa qué hace la herramienta con lo que le envías y si lo usa para entrenar." },
    { q: "¿Sirve la IA para preparar entrevistas?", a: "Mucho, si la usas para generar las preguntas probables y ensayar en voz alta. Las respuestas tienen que salir de tus propios ejemplos: memorizar respuestas generadas se nota en la primera repregunta." },
    { q: "¿Y para negociar el salario?", a: "Como simulador de objeciones funciona bien: le pides que actúe como reclutador y te presione sobre tu cifra. Lo que no puede darte es el dato de mercado fiable ni tu propio límite." },
    { q: "¿Debo decir que he usado IA si me lo preguntan?", a: "Sí. Mentir sobre eso pesa mucho más que el uso en sí, y en una prueba técnica se descubre con dos preguntas de seguimiento." },
    { q: "¿La IA puede rellenar formularios de candidatura por mí?", a: "Existen herramientas que lo hacen, pero conviene revisar cada envío. Los formularios enviados en masa sin revisar generan errores que sí descartan, y algunas empresas los detectan por el patrón." },
    { q: "¿Merece la pena pagar por una herramienta de IA para buscar trabajo?", a: "Depende del volumen. Si vas a preparar muchas candidaturas, las versiones de pago suelen permitir desactivar el uso de tus datos para entrenamiento, que es la diferencia relevante más allá de la calidad del modelo." },
  ],
  hero: { file: "/blog/amplificador.svg", alt: "Diagrama: una señal entra en un amplificador triangular y salen cinco." },
};
