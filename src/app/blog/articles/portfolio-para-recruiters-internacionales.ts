import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "portfolio-para-recruiters-internacionales",
  locale: "es",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "portfolio profesional internacional",
  secondary: [
    "cómo hacer un portfolio si no soy diseñador",
    "qué poner en un portfolio profesional",
    "mostrar trabajo confidencial",
    "caso de estudio para una candidatura",
    "web personal para buscar trabajo",
  ],
  title: "Un portfolio que convence a quien no conoce tus empresas",
  h1: "Un portfolio que convence a quien no conoce tus empresas",
  metaTitle: "Portfolio profesional internacional: qué incluir y cómo",
  metaDescription:
    "Por qué la reputación local no cruza fronteras, qué necesita un caso para ser creíble, cómo enseñar trabajo bajo confidencialidad y por qué tres casos buenos ganan a veinte enlaces.",
  ogTitle: "Un portfolio que convence a quien no conoce tus empresas",
  ogDescription:
    "Quien contrata desde otro continente no puede llamar a tu antiguo jefe. La evidencia sustituye a la reputación.",
  published: "2026-04-28",
  updated: "2026-04-28",
  readingMinutes: 10,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["portfolio-internacional", "marca-personal", "cv-internacional", "ats"],
  related: ["cv-internacional-ats", "ia-para-buscar-trabajo-remoto", "entrevista-remota-video-asincrona", "trabajo-remoto-internacional-desde-espana"],
  external: [
    { label: "Comisión Europea · Europass y documentación de competencias", url: "https://europa.eu/europass/es" },
    { label: "EURES · Portal europeo de empleo", url: "https://eures.europa.eu" },
  ],
  intro: [
    "Cuando alguien contrata desde otro continente no puede llamar a tu antiguo responsable, no sabe si tu empresa anterior era líder de su sector o tenía tres personas, y no tiene contactos comunes a quien preguntar. Todo lo que te avala aquí deja de funcionar.",
    "El portfolio es lo que cubre ese hueco. No una galería, ni una web personal con una imagen grande: un conjunto pequeño de trabajos explicados que permitan a un desconocido evaluar tu criterio.",
  ],
  sections: [
    {
      id: "por-que",
      h2: "Por qué la reputación no cruza fronteras",
      answer:
        "Porque la reputación es una propiedad de la red, y las redes son locales. Quien recluta en otro país no puede verificar el prestigio de tu empresa anterior, no llega a nadie que haya trabajado contigo y no sabe calibrar tus títulos frente a los suyos. La evidencia es lo único que viaja intacto.",
      blocks: [
        {
          t: "p",
          text: "Esto explica una frustración muy común: perfiles sólidos con trayectorias locales excelentes que no consiguen tracción fuera. La trayectoria no tiene ningún problema. Simplemente no es legible para alguien de otro mercado.",
        },
        {
          t: "table",
          head: ["Señal", "Funciona en local", "Funciona fuera"],
          rows: [
            ["Nombre de la empresa anterior", "Mucho", "Normalmente nada"],
            ["Título del puesto", "Se entiende", "Calibra distinto según el mercado"],
            ["Contactos comunes", "Decisivo", "Rara vez existen"],
            ["Trabajos explicados con resultado", "Útil", "Decisivo"],
          ],
        },
      ],
      takeaway:
        "La evidencia es la única credencial que sobrevive intacta al cruzar una frontera.",
    },
    {
      id: "formato",
      h2: "Qué contiene un caso creíble",
      answer:
        "Cuatro cosas: el problema con sus restricciones, qué decidiste tú concretamente, qué descartaste y por qué, y el resultado medible. Lo descartado es lo que más pesa, porque distingue a quien ejerció criterio de quien ejecutó instrucciones.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "La situación y la restricción", text: "Dos o tres frases. Qué estaba roto y qué lo hacía difícil: presupuesto, plazo, sistema heredado, tamaño del equipo." },
            { title: "Tu papel concreto", text: "«El equipo migró la plataforma» no dice nada de ti. Di de qué te hiciste cargo." },
            { title: "La decisión y las alternativas", text: "Qué elegiste, qué descartaste y por qué. Es la parte que demuestra que piensas." },
            { title: "El resultado, medido", text: "Una cifra, un plazo, un antes y un después. Si el resultado fue mixto, dilo: se lee como más creíble, no menos." },
          ],
        },
        {
          t: "note",
          text: "Incluye un caso que salió mal, con qué harías distinto. Convence desproporcionadamente, porque casi nadie lo hace y todo el mundo sabe que los proyectos fracasan.",
        },
      ],
      takeaway:
        "Problema, restricción, tu decisión, lo descartado y el resultado medido. En ese orden.",
    },
    {
      id: "confidencial",
      h2: "Enseñar trabajo que no puedes enseñar",
      answer:
        "La mayor parte del trabajo profesional es confidencial, y eso no es un obstáculo. Puedes describir la forma del problema, tu razonamiento y la magnitud del resultado sin nombrar al cliente, sin enseñar la interfaz y sin dar cifras que identifiquen a nadie.",
      blocks: [
        {
          t: "ul",
          items: [
            "Anonimiza al cliente y descríbelo por sector y tamaño: «una empresa de logística de unas 200 personas».",
            "Usa cifras relativas en lugar de absolutas: «reduje el tiempo de proceso un 40%» antes que datos de facturación.",
            "Recrea el material en lugar de publicarlo: un esquema redibujado, una plantilla saneada.",
            "Ante la duda, pregunta. Muchas empresas anteriores aceptan un caso descrito cuando la alternativa es nada.",
          ],
        },
        {
          t: "p",
          text: "Lo que no puedes hacer es publicar material que firmaste ceder, ni reconstruirlo con tanto detalle que el cliente sea identificable. Un portfolio que incumple una confidencialidad le dice a quien contrata exactamente cómo tratarás su información.",
        },
      ],
      takeaway:
        "Describe el razonamiento, no el material. La confidencialidad es una restricción, no un impedimento.",
    },
    {
      id: "donde",
      h2: "Dónde ponerlo y cuánto",
      answer:
        "Tres casos, en una página que controles tú, enlazada desde la parte alta del currículum. Más de cinco reduce la probabilidad de que se lea alguno con atención. El sitio importa menos que la permanencia: tiene que seguir existiendo en dos años y no depender del algoritmo de nadie.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Una página sencilla en tu propio dominio: permanente, controlable y rápida.",
            "De tres a cinco casos, cada uno legible en dos minutos.",
            "Un resumen de una línea arriba de cada caso, para quien sólo escanea.",
            "Texto y esquemas antes que capturas de pantalla que necesitan explicación.",
          ],
          cons: [
            "Una galería de veinte enlaces sin contexto.",
            "Una presentación que hay que descargar para leerla.",
            "Contenido sólo en una red social, sujeto a su alcance y a sus normas.",
            "Una web tan diseñada que tarda más en cargar de lo que dura la paciencia de quien recluta.",
          ],
        },
      ],
      takeaway:
        "Tres casos, dos minutos cada uno, en algo tuyo. Aquí el volumen juega en contra.",
    },
    {
      id: "no-visual",
      h2: "Si tu trabajo no es visual",
      answer:
        "La mayoría no lo es, y el portfolio no es sólo para perfiles de diseño. Alguien de operaciones, de administración o de gestión de proyectos puede enseñar criterio igual: un proceso rediseñado, un marco de decisión, una plantilla que otros adoptaron, un análisis escrito de un problema de su campo.",
      blocks: [
        {
          t: "ol",
          items: [
            "Escribe una decisión que tomaste y su razonamiento, como se la explicarías a alguien de tu nivel.",
            "Publica una plantilla o lista de comprobación que hayas construido, con el porqué de cada punto.",
            "Analiza un problema público de tu sector y muestra cómo lo abordarías.",
            "Graba un recorrido de cinco minutos explicando cómo atacarías un encargo típico.",
          ],
        },
        {
          t: "quote",
          text: "Nadie está evaluando tus imágenes. Están evaluando si tomarías buenas decisiones sin supervisión.",
        },
      ],
      takeaway:
        "Lo que se evalúa es el criterio, y el criterio se puede escribir en cualquier disciplina.",
    },
  ],
  faqs: [
    { q: "¿Necesito portfolio si no soy diseñador?", a: "Sí, aunque no sea visual. Cualquier perfil puede demostrar criterio: un proceso rediseñado, un marco de decisión, un análisis escrito. Lo que se evalúa es cómo piensas, no qué sabes dibujar." },
    { q: "¿Cuántos casos debe tener?", a: "De tres a cinco. A partir de ahí la probabilidad de que alguno se lea con atención cae mucho. La profundidad en pocos gana a la amplitud en muchos." },
    { q: "¿Cómo enseño trabajo sujeto a confidencialidad?", a: "Describiendo la forma del problema, tu razonamiento y resultados relativos, sin nombrar al cliente ni publicar material protegido. El sector y el tamaño de empresa suelen bastar como contexto." },
    { q: "¿Dónde debe estar alojado?", a: "En una página que controles, idealmente en tu propio dominio. Lo importante es que siga existiendo dentro de dos años y no dependa del alcance ni de las normas de una plataforma." },
    { q: "¿Qué hace creíble un caso?", a: "Las alternativas descartadas. Explicar qué consideraste y por qué lo rechazaste es lo que separa a quien ejerció criterio de quien siguió instrucciones." },
    { q: "¿Incluyo proyectos que salieron mal?", a: "Uno, sí, con qué harías distinto. Convence desproporcionadamente porque casi nadie lo hace y cualquiera con experiencia sabe que los proyectos fracasan." },
    { q: "¿Hace falta una web personal?", a: "Basta una página sencilla. Una web elaborada, lenta y sin casos rinde peor que texto plano con tres ejemplos bien explicados." },
    { q: "¿Puedo usar proyectos personales en lugar de trabajo profesional?", a: "Sí, sobre todo al principio de una carrera. Lo que importa es que el razonamiento sea real y las restricciones estén descritas con honestidad, no si alguien pagó por ello." },
    { q: "¿El portfolio debe estar en inglés?", a: "Si aspiras a puestos internacionales, sí. Mantén una versión en español si también te presentas aquí, pero la internacional debe estar en el idioma del mercado." },
    { q: "¿Cómo lo enlazo desde el currículum?", a: "Arriba, en la cabecera, como una dirección legible incluso si el documento se imprime. Enterrado al final no se pulsa." },
  ],
  hero: { file: "/blog/muestrario.svg", alt: "Diagrama: una rejilla de seis piezas de trabajo con una destacada sobre las demás." },
};
