import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "primeros-90-dias-equipo-distribuido",
  locale: "es",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "primeros 90 días trabajo remoto",
  secondary: [
    "onboarding remoto qué esperar",
    "cómo destacar en un equipo distribuido",
    "empezar un trabajo nuevo en remoto",
    "hacer relaciones trabajando en remoto",
    "errores al incorporarse a un equipo remoto",
  ],
  title: "Tus primeros 90 días en un equipo distribuido",
  h1: "Tus primeros 90 días en un equipo distribuido",
  metaTitle: "Primeros 90 días en un trabajo remoto: qué hacer cada mes",
  metaDescription:
    "Por qué la incorporación remota falla de otra manera, qué hacer en cada uno de los tres primeros meses, cómo construir relaciones sin pasillo y los errores que fijan tu reputación en silencio.",
  ogTitle: "Tus primeros 90 días en un equipo distribuido",
  ogDescription:
    "En remoto nadie aprende por ósmosis. Qué entregar, con quién hablar y qué escribir cada mes.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 10,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["onboarding-distribuido", "documentacion-asincrona", "trabajo-asincrono", "burnout-remoto", "stack-remoto"],
  related: ["trabajo-asincrono-guia", "burnout-remoto-senales", "solapamiento-horario-ofertas-remotas"],
  external: [
    { label: "Eurofound · Teletrabajo y condiciones de trabajo", url: "https://www.eurofound.europa.eu" },
    { label: "Ley 10/2021 de trabajo a distancia · BOE", url: "https://www.boe.es" },
  ],
  intro: [
    "En una oficina, quien llega nuevo absorbe una cantidad enorme de información sin querer: quién decide de verdad, qué proyectos van mal, cuáles son las reglas que nadie ha escrito. Nada de eso se transmite solo en remoto.",
    "La consecuencia es que la incorporación remota no es más lenta, es distinta. Lo que funciona es deliberado: entregas pequeñas y visibles pronto, buscar activamente el contexto que nadie pensó en darte, y construir relaciones que no tienen pasillo donde formarse.",
  ],
  sections: [
    {
      id: "por-que",
      h2: "Por qué la incorporación remota falla de otra manera",
      answer:
        "Porque desaparece el canal informal. En una oficina el contexto llega por conversaciones oídas de paso y preguntas de pasillo. En remoto, si no está escrito o no te lo han dicho expresamente, no te llega, y nadie se da cuenta de que te falta.",
      blocks: [
        {
          t: "p",
          text: "La segunda diferencia es la visibilidad. En una oficina, estar presente se lee como estar aportando. En remoto sólo se ve lo que produces, lo que resulta más duro al principio, cuando todavía estás aprendiendo y tienes poco que enseñar.",
        },
        {
          t: "table",
          head: ["Lo que da una oficina", "Qué lo sustituye en remoto"],
          rows: [
            ["Contexto oído de paso", "Leer el registro escrito a propósito"],
            ["Preguntas de pasillo", "Preguntar explícitamente y en canales públicos"],
            ["Presencia visible", "Entregas pequeñas, tempranas y visibles"],
            ["Relaciones informales", "Reuniones uno a uno agendadas y sin orden del día"],
          ],
        },
      ],
      takeaway:
        "Nada llega por accidente. Todo lo que habrías absorbido, ahora tienes que ir a buscarlo.",
    },
    {
      id: "mes-uno",
      h2: "Mes uno: contexto y una entrega pequeña",
      answer:
        "El objetivo no es impacto, es orientación más prueba de vida. Lee el registro escrito de forma sistemática, habla con la gente uno a uno y entrega algo pequeño y visible. Esa primera entrega importa menos por lo que es que por dejar establecido que produces.",
      blocks: [
        {
          t: "ol",
          items: [
            "Lee los últimos tres meses de decisiones en la documentación, no sólo las páginas de bienvenida.",
            "Agenda media hora con cada persona con la que vayas a trabajar, sin más orden del día que entender qué hace y qué le frustra.",
            "Anota cada pregunta que no hayas podido responder con el registro. Esa lista le sirve de verdad a quien lo mantiene.",
            "Entrega algo pequeño y visible en las tres primeras semanas, aunque sea menor.",
            "Pregunta a tu responsable qué es tener éxito a los noventa días, y escribe la respuesta.",
          ],
        },
        {
          t: "note",
          text: "Pregunta en canales públicos y no por mensaje directo. Expone más y es mucho mejor: la respuesta queda buscable y dejas de ser un consumo privado del tiempo de una sola persona.",
        },
      ],
      takeaway:
        "Una entrega pequeña en tres semanas te compra meses de paciencia.",
    },
    {
      id: "mes-dos",
      h2: "Mes dos: de ejecutar a hacerte cargo",
      answer:
        "El salto es pasar de completar tareas asignadas a hacerte cargo de un área, por pequeña que sea. Hacerte cargo significa detectar problemas antes de que te los digan, proponer en lugar de preguntar y ser la persona a la que se le enruta un tipo de duda.",
      blocks: [
        {
          t: "ul",
          items: [
            "Elige algo que no tiene dueño y empieza a mantenerlo. Siempre hay cosas huérfanas, y adoptar una es la vía más rápida a ser útil.",
            "Pasa de «¿qué hago?» a «voy a hacer X salvo que veas problema». Es el hábito asíncrono de la acción por defecto aplicado a ti.",
            "Empieza a escribir las decisiones que tomas, aunque sean pequeñas. Construye registro y hace visible tu criterio.",
            "Da feedback sobre algo. Quien llega nuevo ve lo que los demás dejaron de ver, y esa ventana se cierra.",
          ],
        },
        {
          t: "p",
          text: "Ese último punto caduca. Las observaciones de mirada fresca que puedes hacer en el mes dos te serán invisibles en el mes seis, así que conviene escribirlas aunque todavía no hagas nada con ellas.",
        },
      ],
      takeaway:
        "Hacerte cargo de una cosa huérfana pesa más que completar diez tareas asignadas.",
    },
    {
      id: "relaciones",
      h2: "Relaciones sin pasillo",
      answer:
        "Tienen que ser deliberadas, porque no hay contacto accidental. El mecanismo que funciona son reuniones uno a uno periódicas sin orden del día, cruzando equipos y no sólo dentro del tuyo, asumiendo que algunas resultarán incómodas antes de resultar naturales.",
      blocks: [
        {
          t: "p",
          text: "Mucha gente se resiste porque le parece forzado. Es forzado, y también es la única versión disponible. La alternativa es conocer sólo a las personas por las que pasa tu trabajo, que en una empresa distribuida son muy pocas.",
        },
        {
          t: "ul",
          items: [
            "Mantén una lista rotatoria de gente con la que no has hablado y ve bajándola.",
            "Las conversaciones entre equipos son las que más rinden: ahí se entera uno de lo que está pasando de verdad.",
            "Enciende la cámara al principio de la relación y deja de preocuparte por ella después.",
            "Fíjate en quién responde preguntas en canales públicos. Suele merecer la pena conocerles.",
          ],
        },
      ],
      takeaway:
        "Deliberado y algo incómodo gana a orgánico e inexistente.",
    },
    {
      id: "errores",
      h2: "Los errores que fijan tu reputación en silencio",
      answer:
        "Esperar a que te den el contexto, callar para no parecer novato, desaparecer semanas dentro de un proyecto largo sin nada visible, y acabar trabajando en un horario que no es el tuyo porque nadie te dijo que no hacía falta.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Preguntar en público y construir registro buscable.",
            "Entregas pequeñas y visibles mientras aprendes.",
            "Anotar lo que te confundió, que ayuda a quien venga detrás.",
            "Fijar tu horario de forma explícita la primera semana.",
          ],
          cons: [
            "Esperar a que la incorporación te la hagan a ti.",
            "Callar para no parecer nuevo, que se lee como desconexión.",
            "Seis semanas metido en algo invisible.",
            "Derivar a un horario de tarde permanente sin haberlo decidido nunca.",
          ],
        },
        {
          t: "quote",
          text: "En remoto nadie te ve trabajar. Ven lo que terminas y lo que escribes.",
        },
      ],
      takeaway:
        "Los dos fallos son el silencio y la invisibilidad. Ambos se evitan en la primera semana.",
    },
  ],
  faqs: [
    { q: "¿En qué se diferencia la incorporación remota de la presencial?", a: "Desaparece el canal informal. El contexto que en una oficina llega por conversaciones oídas y preguntas de pasillo hay que buscarlo activamente, y nadie se da cuenta de que te falta." },
    { q: "¿Qué debería entregar el primer mes?", a: "Algo pequeño y visible en torno a la tercera semana. Su valor no está en el trabajo en sí sino en dejar establecido que produces, lo que te compra paciencia mientras aprendes." },
    { q: "¿Pregunto en público o por privado?", a: "En público, en canales compartidos. Expone más pero la respuesta queda buscable para el siguiente y dejas de consumir en privado el tiempo de una sola persona." },
    { q: "¿Cómo hago relaciones sin oficina?", a: "De forma deliberada: reuniones uno a uno periódicas sin orden del día, priorizando gente fuera de tu equipo directo. Resulta forzado porque lo es, y es la única versión disponible." },
    { q: "¿Cómo sé si lo estoy haciendo bien?", a: "Pregunta a tu responsable el primer mes qué significa tener éxito a los noventa días, y escribe la respuesta. Sin eso, los dos estáis suponiendo." },
    { q: "¿Y si la documentación es mala?", a: "Anota cada pregunta que no hayas podido responder con ella. Esa lista es valiosa para quien mantiene el registro y hace visible que estás detectando huecos, en lugar de parecer lentitud." },
    { q: "¿Debo encender la cámara?", a: "Al principio de una relación, sí: acelera mucho la familiaridad. Una vez la gente te conoce importa bastante menos y se puede relajar." },
    { q: "¿Cómo evito acabar trabajando en el horario de otros?", a: "Fija y comunica tu horario la primera semana, antes de que se formen los hábitos. La deriva hacia disponibilidad permanente de tarde ocurre poco a poco y luego cuesta muchísimo revertirla." },
    { q: "¿Y si no me dan suficiente trabajo?", a: "Busca algo sin dueño y empieza a mantenerlo. En todos los equipos hay cosas huérfanas, y adoptar una es el camino más corto de recién llegado a compañero útil." },
    { q: "¿Cuándo empiezo a dar feedback?", a: "En el mes dos, mientras todavía tengas mirada fresca. Lo que ves al llegar se vuelve invisible en pocos meses, así que anótalo aunque actúes más tarde." },
  ],
};
