import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "entrevista-remota-video-asincrona",
  locale: "es",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "entrevista de trabajo remota en vídeo",
  secondary: [
    "prueba técnica asíncrona",
    "cómo preparar una entrevista en inglés en vídeo",
    "entrevista grabada de una sola toma",
    "prueba take home entrevista",
    "entrevista por escrito proceso de selección",
  ],
  title: "La entrevista remota se gana antes de encenderse la cámara",
  h1: "La entrevista remota se gana antes de encenderse la cámara",
  metaTitle: "Entrevista remota en vídeo y prueba asíncrona: cómo prepararla",
  metaDescription:
    "Por qué los procesos remotos usan vídeos grabados, rondas escritas y pruebas con plazo, qué evalúa cada formato y cómo prepararse para algo que casi nadie ha practicado.",
  ogTitle: "La entrevista remota se gana antes de encender la cámara",
  ogDescription:
    "Vídeo grabado, ronda escrita y prueba con plazo evalúan cosas distintas que una conversación.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["trabajo-asincrono", "onboarding-distribuido", "portfolio-internacional", "documentacion-asincrona"],
  related: ["cv-internacional-ats", "portfolio-para-recruiters-internacionales", "negociar-salario-remoto-internacional"],
  external: [
    { label: "AEPD · Protección de datos en procesos de selección", url: "https://www.aepd.es" },
    { label: "Comisión Europea · Reglamento de Inteligencia Artificial", url: "https://digital-strategy.ec.europa.eu" },
    { label: "Comité Europeo de Protección de Datos · Decisiones automatizadas", url: "https://www.edpb.europa.eu" },
  ],
  intro: [
    "Los procesos remotos internacionales desconciertan la primera vez. En lugar de una conversación te llega un enlace para grabar respuestas de noventa segundos a tres preguntas, o un documento con cinco preguntas escritas, o un ejercicio con fecha de entrega.",
    "Nada de esto es un obstáculo por capricho. Cada formato evalúa algo que una conversación en directo no evalúa, y saber cuál es cambia por completo cómo hay que prepararse.",
  ],
  sections: [
    {
      id: "por-que",
      h2: "Por qué las empresas remotas usan estos formatos",
      answer:
        "Por tres razones: volumen, husos horarios y equidad. Una vacante internacional recibe muchísimas más candidaturas que una local, no se puede citar a todo el mundo en horas compatibles, y los formatos estructurados permiten que varias personas evalúen las mismas respuestas y no conversaciones distintas.",
      blocks: [
        {
          t: "p",
          text: "Hay además una señal que se está midiendo. En un equipo distribuido, la mayor parte de tu comunicación será escrita o grabada, no en directo. Un proceso que evalúa esas habilidades está evaluando el trabajo real, no una aproximación.",
        },
        {
          t: "note",
          text: "Cuando interviene puntuación automatizada, la normativa europea te reconoce derecho a información sobre ella y, en decisiones significativas, a revisión humana. Preguntar cómo se evalúa tu envío es una pregunta legítima.",
        },
      ],
      takeaway:
        "Estos formatos evalúan el medio en el que vas a trabajar. Trátalos como el trabajo, no como un trámite.",
    },
    {
      id: "video",
      h2: "El vídeo grabado de una toma",
      answer:
        "Te dan unas preguntas, un límite de tiempo por respuesta y normalmente una o dos tomas. Mide si eres capaz de ser claro y ordenado sin que nadie te ayude con repreguntas, que es exactamente lo que necesita un equipo asíncrono. Divagar es el fallo, no ponerse nervioso.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Prepara una estructura, no un guion", text: "Situación, qué hiciste, resultado, en unos sesenta segundos. Los guiones memorizados suenan memorizados y se caen si la pregunta cambia." },
            { title: "Arregla lo técnico una sola vez", text: "Cámara a la altura de los ojos, luz de frente y no a la espalda, y micrófono más cerca que el del portátil. Diez minutos que se notan en todas las respuestas." },
            { title: "Responde primero", text: "Empieza por la respuesta y sigue con el contexto. Quien revisa puede estar viendo a doble velocidad y saltándose el preámbulo." },
            { title: "Ensaya en voz alta y con reloj", text: "La distancia entre pensar una respuesta y decirla en sesenta segundos es mayor de lo que parece hasta que se prueba." },
          ],
        },
        {
          t: "p",
          text: "No busques quedar impecable. Quien revisa no te compara con un presentador, te compara con otras candidaturas que en su mayoría divagan. Claro y ordenado gana a pulido.",
        },
      ],
      takeaway:
        "Respuesta primero, contexto después, sesenta segundos. La estructura gana al pulido.",
    },
    {
      id: "escrita",
      h2: "La ronda escrita",
      answer:
        "Algunas empresas sustituyen la primera llamada por preguntas escritas. Es la fase más predictiva para puestos asíncronos y la que más se subestima: se trata como un formulario que rellenar cuando en realidad es una muestra de trabajo que se evalúa por sí misma.",
      blocks: [
        {
          t: "ul",
          items: [
            "Escribe como le escribirías a un compañero: contexto primero, después la idea, después el detalle.",
            "Responde lo que se pregunta. Las respuestas largas que se van por las ramas señalan justo lo que un equipo asíncrono teme.",
            "Usa estructura, encabezados y párrafos cortos. Cómo organizas una respuesta escrita forma parte de lo que se lee.",
            "No rellenes. Una respuesta precisa de tres párrafos gana a una página exhaustiva.",
          ],
        },
        {
          t: "p",
          text: "Si te ayudas de IA, úsala para revisar la estructura y no para generar el fondo. La ronda escrita es donde más se nota un texto generado, porque quien revisa lee con atención y compara varias respuestas seguidas.",
        },
      ],
      takeaway:
        "La ronda escrita es una muestra de trabajo. Estar ordenado cuenta tanto como acertar.",
    },
    {
      id: "prueba",
      h2: "La prueba con plazo",
      answer:
        "Un ejercicio acotado, normalmente con un tiempo estimado, que evalúa cómo abordas un problema realista. Lo que se mide rara vez es sólo el resultado: son tus supuestos, cómo priorizas bajo una restricción y con qué claridad explicas qué hiciste y qué dejaste fuera.",
      blocks: [
        {
          t: "ol",
          items: [
            "Respeta el tiempo indicado y di qué harías con más. Entregar el triple señala mala priorización, no entusiasmo.",
            "Escribe tus supuestos de forma explícita. Los encargos reales son ambiguos y cómo gestionas la ambigüedad es el punto.",
            "Añade una nota breve con tu razonamiento y tus compromisos. Mucha gente entrega sólo el resultado.",
            "Di qué dejaste fuera a propósito y por qué. Se lee como criterio, no como huecos.",
          ],
        },
        {
          t: "note",
          text: "Si el ejercicio parece trabajo de producción no remunerado en lugar de una evaluación, es razonable preguntarlo. Un ejercicio acotado de unas horas es normal; un entregable completo para su cliente real, no.",
        },
      ],
      takeaway:
        "La nota de razonamiento pesa más que el entregable. Casi nadie la incluye.",
    },
    {
      id: "errores",
      h2: "Lo que de verdad descarta",
      answer:
        "Ni los nervios ni los fallos técnicos. Es responder a una pregunta distinta de la formulada, saltarse las restricciones indicadas, entregar sin explicar ningún razonamiento y tratar las fases asíncronas como papeleo previo a la entrevista de verdad.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Respuestas que empiezan por la respuesta.",
            "Supuestos explícitos y compromisos declarados.",
            "Respetar límites de tiempo y de alcance.",
            "Una nota breve sobre qué harías a continuación.",
          ],
          cons: [
            "Respuestas de noventa segundos con cincuenta de contexto previo.",
            "Pruebas que triplican el tiempo indicado.",
            "Respuestas escritas sin estructura ni párrafos.",
            "Tratar la fase asíncrona como un trámite antes de la conversación real.",
          ],
        },
      ],
      takeaway:
        "La fase asíncrona es la evaluación. Quien la trata como trámite es a quien se filtra.",
    },
  ],
  faqs: [
    { q: "¿Por qué las empresas remotas usan entrevistas grabadas?", a: "Por volumen, husos horarios y consistencia. Las vacantes internacionales reciben muchas más candidaturas, no se puede citar a todo el mundo en horas compatibles, y los formatos estructurados permiten que varias personas evalúen las mismas respuestas." },
    { q: "¿Cuánto debe durar una respuesta grabada?", a: "En torno a sesenta segundos salvo que indiquen otra cosa, con estructura de situación, qué hiciste y resultado. Empieza por la respuesta, porque quien revisa suele ver a velocidad aumentada y saltarse preámbulos." },
    { q: "¿Puedo repetir una respuesta grabada?", a: "Normalmente una o dos veces, y la plataforma lo indica. No busques la toma perfecta: claro y ordenado rinde más que pulido, y te comparan con otras candidaturas, no con presentadores." },
    { q: "¿Cuánto tiempo dedico a una prueba con plazo?", a: "El indicado, y no más. Después anota qué harías con más tiempo. Entregar muy por encima señala mala priorización antes que compromiso." },
    { q: "¿Puedo preguntar si la prueba está remunerada?", a: "Sí, sobre todo si se parece a trabajo de producción para un cliente real en lugar de a una evaluación acotada. Unas horas es normal; un entregable completo, no." },
    { q: "¿Puedo usar IA en una fase asíncrona?", a: "Comprueba si la empresa tiene una política. Usarla para revisar la estructura suele ser aceptable; generar el fondo se nota mucho en las rondas escritas y anula la muestra que se está evaluando." },
    { q: "¿Qué evalúa una ronda escrita que no evalúe una llamada?", a: "Cómo organizas el pensamiento sin que nadie te ayude con repreguntas. En equipos asíncronos casi toda la comunicación es escrita, así que la ronda escrita se parece más al trabajo real que una conversación." },
    { q: "¿Estos procesos usan puntuación automática?", a: "Algunos sí. La normativa europea te reconoce derecho a información sobre decisiones automatizadas y, en las significativas, a revisión humana. Preguntar cómo se evalúa tu envío es legítimo." },
    { q: "¿Qué equipo necesito para grabar?", a: "Cámara a la altura de los ojos, luz de frente y no a la espalda, y un micrófono más cercano que el del portátil. Diez minutos de preparación mejoran todas las respuestas que grabes." },
    { q: "¿Conviene hacer seguimiento tras una fase asíncrona?", a: "Un mensaje corto confirmando el envío y ofreciéndote a ampliar cualquier punto está bien. Los seguimientos largos que repiten tus respuestas no ayudan y pueden leerse como desconfianza en el proceso." },
  ],
};
