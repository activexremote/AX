import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "solapamiento-horario-ofertas-remotas",
  locale: "es",
  cluster: "empleo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "solapamiento horario ofertas remotas",
  secondary: [
    "qué significa overlap en una oferta de trabajo",
    "trabajar con horario de estados unidos desde españa",
    "horas de solape trabajo remoto",
    "ofertas remotas con horario flexible",
    "husos horarios equipos distribuidos",
  ],
  title: "El requisito que te descarta sin que lo leas: el solapamiento horario",
  h1: "El requisito que te descarta sin que lo leas: el solapamiento horario",
  metaTitle: "Solapamiento horario en ofertas remotas: qué significa de verdad",
  metaDescription:
    "Qué pide realmente un requisito de overlap, cuántas horas exige cada zona, cuándo es negociable y cómo proponer una alternativa que una empresa pueda aceptar.",
  ogTitle: "El solapamiento horario: el requisito que descarta en silencio",
  ogDescription:
    "Una línea de la oferta decide desde qué países se puede optar. Cómo leerla y cuándo negociarla.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 10,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["solapamiento-horario", "trabajo-asincrono", "burnout-remoto", "onboarding-distribuido"],
  related: ["trabajo-remoto-internacional-desde-espana", "trabajo-asincrono-guia", "burnout-remoto-senales"],
  external: [
    { label: "Ley 10/2021 de trabajo a distancia · BOE", url: "https://www.boe.es" },
    { label: "Eurofound · Tiempo de trabajo y teletrabajo", url: "https://www.eurofound.europa.eu" },
    { label: "EU-OSHA · Riesgos psicosociales", url: "https://osha.europa.eu" },
  ],
  intro: [
    "Las ofertas se leen por el salario, la tecnología y el puesto. La línea que más veces decide si puedes aceptar el trabajo está tres párrafos más abajo y dice algo así como «must have 4 hours overlap with PST».",
    "Esa frase es el filtro geográfico real. Aquí va qué significa en la práctica, cuándo es innegociable de verdad y cómo proponer una alternativa que quien contrata pueda aceptar sin quedar mal.",
  ],
  sections: [
    {
      id: "que-pide",
      h2: "Qué pide realmente un requisito de solapamiento",
      answer:
        "Pide que estés trabajando a la vez que el equipo principal durante un número de horas al día. No va de horas totales ni de disponibilidad para urgencias: va de una franja predecible en la que se pueda colaborar en directo sin que nadie tenga que conectarse de madrugada.",
      blocks: [
        {
          t: "table",
          head: ["Dónde está el equipo", "Solapamiento habitual", "Qué significa desde España"],
          rows: [
            ["Europa (CET)", "4-6 horas", "Jornada normal, sin ajustes."],
            ["Costa este de EE. UU.", "3-4 horas", "Aproximadamente de 15:00 a 19:00."],
            ["Costa oeste de EE. UU.", "3-4 horas", "A partir de las 18:00."],
            ["Asia-Pacífico", "2-3 horas", "Primera hora de la mañana, antes de las 10:00."],
            ["«Fully async»", "0-2 horas", "Poco común: conviene verificarlo en la entrevista."],
          ],
        },
        {
          t: "p",
          text: "Fíjate en la asimetría. Cuatro horas con la costa oeste significan trabajar de noche indefinidamente, no de vez en cuando. Cuatro horas con la costa este caben en una tarde normal. Mismo número, vida completamente distinta.",
        },
      ],
      takeaway:
        "Importa menos el número que en qué horas cae. Conviértelo antes de decidir.",
    },
    {
      id: "por-que",
      h2: "Por qué las empresas lo piden",
      answer:
        "Normalmente porque sus procesos son síncronos. Un equipo que decide en reuniones necesita a todo el mundo presente en esas reuniones. El requisito es real, pero describe cómo trabaja esa empresa hoy, no una propiedad permanente del puesto.",
      blocks: [
        {
          t: "ul",
          items: [
            "Las decisiones se toman en llamadas, así que faltar a la llamada es faltar a la decisión.",
            "La incorporación depende de disponibilidad informal en lugar de documentación.",
            "Los puestos de cara al cliente necesitan estar localizables cuando el cliente lo está.",
            "La atención a incidencias exige cobertura, que es una cuestión de turnos y no de solapamiento.",
          ],
        },
        {
          t: "p",
          text: "Las dos primeras son culturales y por tanto negociables en principio. Las dos últimas son estructurales: si los clientes están en una zona horaria, alguien tiene que estar despierto para ellos. Saber contra cuál estás argumentando determina si tiene sentido insistir.",
        },
      ],
      takeaway:
        "El solapamiento cultural se puede mover. El estructural, marcado por clientes o guardias, no.",
    },
    {
      id: "leer",
      h2: "Cómo leer una oferta para ver la restricción real",
      answer:
        "Busca tres cosas más allá del número: qué países figuran como elegibles, si el puesto es de cara al cliente y si la empresa documenta sus decisiones en abierto. Juntas dicen mucho más sobre tu horario real que la línea del solapamiento.",
      blocks: [
        {
          t: "ol",
          items: [
            "Localiza la lista de países elegibles. Que no aparezca suele significar que no han resuelto la contratación transfronteriza, no que valga cualquier sitio.",
            "Mira si mencionan manual público o proceso escrito de decisiones. Eso sí indica capacidad asíncrona real.",
            "Fíjate en dónde está el equipo directivo. Las decisiones gravitan hacia la zona horaria de quien decide.",
            "Comprueba si se menciona guardia o cobertura de clientes, porque cambia el panorama entero.",
          ],
        },
        {
          t: "note",
          text: "«Totalmente en remoto, trabaja desde donde quieras» junto a cuatro horas de solapamiento con una sola zona horaria es una contradicción que conviene plantear en la primera llamada. Suele resolverse en «desde donde quieras dentro de estos cinco países».",
        },
      ],
      takeaway:
        "Los países elegibles y dónde está la dirección dicen más que el solapamiento declarado.",
    },
    {
      id: "negociar",
      h2: "Cómo negociarlo sin parecer complicado",
      answer:
        "No pidiendo una excepción, sino proponiendo un modo de trabajo. Nombra la franja que vas a cubrir, explica cómo se desbloquean las decisiones fuera de ella y ofrece un punto de revisión. Quien contrata puede aceptar una propuesta; difícilmente puede aceptar una petición de menos.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Nombra tu franja con precisión", text: "«Cubro de 15:00 a 19:00 CET, que son las 09:00 a 13:00 en Nueva York» es concreto. «Soy flexible» no lo es." },
            { title: "Explica cómo desbloqueas", text: "Traspasos escritos al terminar el día, decisiones documentadas con acción por defecto y un contacto de respaldo para lo urgente." },
            { title: "Ofrece un periodo de prueba", text: "«Lo revisamos a los noventa días» reduce el riesgo percibido de decir que sí." },
            { title: "Sé honesto con tu límite", text: "Si no puedes trabajar de noche a largo plazo, dilo ahora. Descubrirlo en el mes cuatro es peor para los dos." },
          ],
        },
        {
          t: "p",
          text: "La propuesta funciona porque responde al miedo real de quien contrata, que no es tu horario sino quedarse bloqueado esperándote. Resuelve eso explícitamente y el número de horas pasa a segundo plano.",
        },
      ],
      takeaway:
        "A quien contrata le preocupa el bloqueo, no tu horario. Resuelve el bloqueo y las horas se negocian.",
    },
    {
      id: "coste",
      h2: "Lo que cuesta aceptar un mal solapamiento",
      answer:
        "Trabajar de noche de forma sostenida fragmenta el día, borra el límite entre trabajo y vida y es uno de los predictores más claros del agotamiento remoto. Además es invisible durante los primeros meses, y por eso se acepta y sólo se revisa un año después.",
      blocks: [
        {
          t: "p",
          text: "El patrón se repite: el entusiasmo inicial tapa el coste, después las reuniones se van desplazando hacia más tarde, y luego las tardes dejan de ser tuyas. Quien sostiene un solapamiento grande a largo plazo casi siempre tiene o una hora de corte firme o un turno rotatorio con compañeros.",
        },
        {
          t: "ul",
          items: [
            "Fija la hora de corte antes de empezar, no cuando ya sea un problema.",
            "Pregunta si las horas de reunión rotan o si siempre se adaptan los mismos.",
            "Cuenta las reuniones recurrentes reales en esa franja, no el solapamiento teórico.",
            "Revísalo a los noventa días de forma deliberada, en lugar de dejarlo correr.",
          ],
        },
      ],
      takeaway:
        "Un mal solapamiento no duele durante tres meses. Decide antes de ese plazo, no después.",
    },
  ],
  faqs: [
    { q: "¿Qué significa «4 horas de overlap» en una oferta?", a: "Que debes estar trabajando a la vez que el equipo principal al menos cuatro horas al día. Va de disponibilidad síncrona predecible, no de horas totales trabajadas." },
    { q: "¿Qué zonas horarias son realistas desde España?", a: "Los equipos europeos caben en una jornada normal. La costa este de EE. UU. son tardes; la costa oeste, a partir de las 18:00; Asia-Pacífico, primera hora de la mañana. El mismo número de horas produce vidas muy distintas." },
    { q: "¿Se puede negociar el solapamiento?", a: "A menudo sí, cuando es cultural y no estructural. Si existe porque las decisiones se toman en reuniones, una propuesta asíncrona concreta puede moverlo. Si lo marcan clientes o guardias, normalmente no." },
    { q: "¿Cómo propongo una alternativa?", a: "Nombra la franja exacta que cubrirás, explica cómo desbloqueas al equipo fuera de ella con traspasos escritos y acciones por defecto, y ofrece una revisión a los noventa días. Una propuesta se acepta mejor que una petición." },
    { q: "¿Por qué ponen «trabaja desde donde quieras» y luego exigen solapamiento?", a: "Porque las dos frases las escriben personas distintas. En la práctica suele significar desde donde quieras dentro de una lista corta de países que además cumpla el solapamiento." },
    { q: "¿Un solapamiento alto significa que la empresa no es realmente remota?", a: "Suele significar que está distribuida pero funciona en síncrono. Es una forma legítima de operar, pero conviene saberlo antes de entrar y no después." },
    { q: "¿Se puede trabajar de tarde-noche a largo plazo?", a: "Algunas personas lo sostienen, casi siempre con una hora de corte firme o con turnos rotatorios. El trabajo nocturno sostenido con reuniones que se desplazan es uno de los predictores más claros del agotamiento remoto." },
    { q: "¿Debo preguntar por el solapamiento en la primera llamada?", a: "Sí, y cuanto antes. No cuesta nada y evita invertir semanas en un proceso que no puede encajar con tu vida." },
    { q: "¿Y si la oferta no menciona el solapamiento?", a: "Pregúntalo. Que no aparezca suele significar que nadie lo escribió, no que no exista expectativa. La respuesta también te dirá cuánto han pensado sobre distribución." },
    { q: "¿El solapamiento cambia una vez dentro?", a: "Puede derivar, normalmente al alza, según se acumulan reuniones. Acordar un punto de revisión a los noventa días te da un momento legítimo para reajustarlo antes de que se convierta en la norma." },
  ],
};
