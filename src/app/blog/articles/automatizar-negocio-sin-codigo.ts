import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "automatizar-negocio-sin-codigo",
  locale: "es",
  cluster: "herramientas",
  funnel: "mofu",
  intent: "informacional",
  keyword: "automatizar negocio sin código",
  secondary: [
    "make vs zapier vs n8n",
    "automatizaciones para freelance",
    "qué automatizar en un negocio pequeño",
    "automatizar la entrada de clientes",
    "agentes de IA para pymes",
  ],
  title: "Automatizar tu negocio sin código: qué automatizar y en qué orden",
  h1: "Automatizar tu negocio sin código: qué automatizar y en qué orden",
  metaTitle: "Automatizar sin código: qué automatizar primero y con qué",
  metaDescription:
    "Por qué automatizar un proceso sin definir empeora las cosas, qué tareas devuelven antes la inversión, cómo elegir entre las principales plataformas y dónde encajan de verdad los agentes de IA.",
  ogTitle: "Automatizar sin código: qué automatizar primero",
  ogDescription:
    "Documentar, estabilizar y sólo entonces automatizar. El orden importa más que la herramienta.",
  published: "2026-08-11",
  updated: "2026-08-11",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-founder",
  terms: ["automatizacion-no-code", "sop", "agente-ia", "solopreneur", "stack-remoto"],
  related: ["de-freelance-a-negocio-productizado", "sop-documentar-procesos", "stack-remoto-imprescindible", "conseguir-clientes-b2b-internacionales"],
  external: [
    { label: "AEPD · Tratamientos automatizados y protección de datos", url: "https://www.aepd.es" },
    { label: "Comisión Europea · Digitalización de pymes", url: "https://single-market-economy.ec.europa.eu" },
    { label: "INCIBE · Seguridad en herramientas en la nube", url: "https://www.incibe.es" },
  ],
  intro: [
    "La automatización se vende como una forma de hacer más. En un negocio de una persona resulta más útil como forma de dejar de hacer cosas: los pasos repetitivos y sin criterio que llenan la semana sin producir nada por lo que un cliente pagaría.",
    "El error es empezar por la herramienta. Automatizar un proceso que no has definido sólo significa cometer los mismos errores más rápido y en mayor cantidad, que es un resultado genuinamente peor que hacerlo a mano.",
  ],
  sections: [
    {
      id: "orden",
      h2: "El orden que funciona: documentar, estabilizar, automatizar",
      answer:
        "Escribe el proceso mientras lo ejecutas, hazlo a mano hasta que deje de cambiar, y sólo entonces automatiza los pasos que no requieren criterio. Saltar directo a automatizar codifica lo que estuviera mal en un sistema que ahora lo repite con toda fiabilidad.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Documenta ejecutando", text: "Escribe cada paso durante la siguiente vez real, no después de memoria. La memoria suaviza las excepciones, y las excepciones son lo que rompe las automatizaciones." },
            { title: "Hazlo a mano hasta que sea estable", text: "Si los pasos han cambiado en las tres últimas veces, el proceso no está listo. Automatizar un objetivo en movimiento garantiza rehacerlo." },
            { title: "Marca qué pasos requieren criterio", text: "Esos siguen siendo humanos. Todo lo demás es candidato." },
            { title: "Automatiza un paso cada vez", text: "Las automatizaciones de proceso entero fallan de forma opaca. Los pasos sueltos fallan de forma visible, que es lo que quieres mientras aprendes." },
          ],
        },
        {
          t: "note",
          text: "Una prueba útil: si no puedes entregarle el proceso escrito a otra persona y que produzca el mismo resultado, tampoco está listo para entregárselo a una máquina.",
        },
      ],
      takeaway:
        "La automatización codifica el proceso que tienes, no el que creías tener.",
    },
    {
      id: "que-primero",
      h2: "Qué devuelve antes la inversión",
      answer:
        "Lo aburrido del medio: mover información entre herramientas, crear fichas, enviar mensajes previsibles y recoger cosas que la gente olvida mandar. Son de frecuencia alta, riesgo bajo y sin criterio, que es exactamente el perfil que se automatiza bien.",
      blocks: [
        {
          t: "table",
          head: ["Tarea", "Por qué compensa", "Riesgo si falla"],
          rows: [
            ["Formulario de entrada a ficha de cliente", "Ocurre en cada consulta, sin criterio", "Bajo: se ve al momento"],
            ["Secuencia de alta de cliente", "Mismos pasos siempre, fácil olvidar uno", "Bajo: recuperable"],
            ["Recordatorios de factura", "Recurrente, e incómodo de hacer a mano", "Bajo, pero cuida el tono"],
            ["Recogida de documentación", "Los clientes olvidan, y perseguirlo te cuesta tiempo", "Bajo"],
            ["Seguimiento de propuestas", "Se olvida a menudo y afecta directo a los ingresos", "Medio: la personalización importa"],
            ["Cualquier cosa de cara al cliente sin revisar", "—", "Alto: no automatices el último tramo a ciegas"],
          ],
        },
        {
          t: "p",
          text: "Fíjate en lo que no está: nada que exija una valoración sobre un cliente concreto. Esos pasos parecen automatizables y son justo donde los sistemas automáticos producen los mensajes que dañan relaciones.",
        },
      ],
      takeaway:
        "Automatiza la fontanería, quédate el criterio. La fontanería ya es la mayor parte de la semana.",
    },
    {
      id: "elegir",
      h2: "Cómo elegir entre las principales plataformas",
      answer:
        "Las diferencias prácticas son el modelo de precio, cuánta lógica puedes expresar y si puedes alojarlo tú. Para la mayoría de negocios de una persona cualquiera de las opciones sirve, así que decide por cuál conecta con las herramientas que ya usas.",
      blocks: [
        {
          t: "table",
          head: ["", "Encaja mejor en", "A cambio"],
          rows: [
            ["Zapier", "Flujos lineales sencillos, más aplicaciones conectadas", "El coste sube rápido con el volumen"],
            ["Make", "Flujos visuales de varios pasos con bifurcaciones", "Curva de aprendizaje más pronunciada"],
            ["n8n", "Lógica compleja, autoalojado, control del dato", "Lo mantienes tú, actualizaciones incluidas"],
          ],
        },
        {
          t: "p",
          text: "Si manejas datos personales de clientes, el autoalojamiento deja de ser una preferencia y pasa a ser una consideración real: cambia dónde residen los datos y qué tienes que declarar en tus contratos de encargado del tratamiento.",
        },
      ],
      takeaway:
        "Elige por integraciones y modelo de precio. Las tres hacen bien lo básico.",
    },
    {
      id: "agentes",
      h2: "Dónde encajan de verdad los agentes de IA",
      answer:
        "En los pasos que necesitan interpretación pero no decisión final: clasificar peticiones entrantes, redactar borradores para revisar, extraer datos de documentos sin estructura y resumir. Lo que no deben hacer es ejecutar acciones irreversibles sin un punto de revisión humana.",
      blocks: [
        {
          t: "ul",
          items: [
            "Clasificar: ordenar las consultas entrantes por tipo y urgencia, y enrutarlas.",
            "Redactar: preparar una primera versión de una respuesta recurrente para que la revises y la envíes.",
            "Extraer: sacar datos estructurados de documentos que llegan en formatos inconsistentes.",
            "Resumir: condensar hilos largos o llamadas en la decisión y el siguiente paso.",
          ],
        },
        {
          t: "note",
          text: "Dale a cada agente límites explícitos sobre qué puede tocar y un punto de revisión antes de cualquier cosa irreversible: enviar a un cliente, mover dinero, borrar datos. El fallo peligroso no es un borrador malo, es una acción segura tomada sobre una lectura equivocada.",
        },
      ],
      takeaway:
        "Interpretación sí, acción irreversible no. El punto de revisión es todo el diseño.",
    },
    {
      id: "errores",
      h2: "Los errores que más cuestan",
      answer:
        "Se repiten cuatro. Automatizar un proceso inestable. Construir flujos que nadie documentó y que después no se pueden arreglar. Encadenar tantos pasos que los fallos se vuelven invisibles. Y automatizar el último tramo de cara al cliente, donde la personalización es todo el valor.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Una automatización por paso, cada una comprobable por separado.",
            "Avisos de fallo que te lleguen a ti, no a un registro que nadie lee.",
            "Una nota escrita de qué hace cada flujo y por qué.",
            "Un plan manual de respaldo para todo lo que dependa un cliente.",
          ],
          cons: [
            "Un flujo de veinte pasos que falla en silencio por la mitad.",
            "Automatizaciones construidas por tu yo pasado sin documentación.",
            "Mensajes automáticos a clientes que nadie revisa nunca.",
            "Automatizar antes de la tercera ejecución manual.",
          ],
        },
        {
          t: "quote",
          text: "Una automatización que no puedes depurar es un pasivo que antes era una tarea.",
        },
      ],
      takeaway:
        "Pequeñas, documentadas y ruidosas al fallar. Las silenciosas son las peligrosas.",
    },
  ],
  faqs: [
    { q: "¿Qué debería automatizar primero en un negocio pequeño?", a: "La fontanería repetitiva: mover información entre herramientas, crear fichas desde formularios, secuencias de alta, recordatorios de factura y recogida de documentación. Frecuencia alta, sin criterio y riesgo bajo si falla." },
    { q: "¿Automatizo antes o después de documentar el proceso?", a: "Después. Automatizar un proceso sin definir codifica lo que esté mal y lo repite con fiabilidad, que es peor que hacerlo a mano." },
    { q: "¿Cuál es mejor, Zapier, Make o n8n?", a: "Para la mayoría de negocios de una persona cualquiera sirve. Zapier conecta con más aplicaciones y encarece con el volumen, Make maneja bien las bifurcaciones con más curva, y n8n permite autoalojar si el control del dato importa." },
    { q: "¿Cuándo está listo un proceso para automatizarse?", a: "Cuando los pasos no han cambiado en las tres últimas ejecuciones y podrías entregarle la versión escrita a otra persona obteniendo el mismo resultado." },
    { q: "¿Para qué sirven los agentes de IA en un negocio pequeño?", a: "Para interpretar sin decidir en firme: clasificar consultas, redactar borradores para revisión, extraer datos de documentos inconsistentes y resumir. No para ejecutar acciones irreversibles sin revisión humana." },
    { q: "¿Conviene automatizar la comunicación con clientes?", a: "En parte. Recordatorios y peticiones de documentación, sí. Todo aquello donde la personalización sea el valor debería redactarse automáticamente y enviarse a mano tras revisarlo." },
    { q: "¿Cómo evito que una automatización falle en silencio?", a: "Configurando avisos de fallo que te lleguen directamente en lugar de a un registro, y manteniendo los flujos cortos para que un fallo apunte con claridad a un paso." },
    { q: "¿Hace falta documentar las automatizaciones?", a: "Sí, brevemente: qué hace cada una y por qué existe. Las construidas sin notas se vuelven imposibles de depurar en pocos meses, y entonces no puedes tocar nada de lo que dependen." },
    { q: "¿Tiene implicaciones de protección de datos?", a: "Sí, si los flujos manejan datos personales. Dónde se tratan y quién accede son cuestiones que puede que tengas que declarar, y es una de las razones por las que el autoalojamiento a veces compensa el mantenimiento." },
    { q: "¿Cuánto tiempo ahorra realmente?", a: "Depende por completo de la frecuencia. Un paso de cinco minutos diez veces por semana devuelve horas reales; el mismo paso una vez al mes rara vez compensa el coste de construirlo y mantenerlo." },
  ],
  hero: { file: "/blog/automatismo.svg", alt: "Diagrama: un disparador que encadena una tarea y ésta, dos más en paralelo." },
};
