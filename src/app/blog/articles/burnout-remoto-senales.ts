import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "burnout-remoto-senales",
  locale: "es",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "burnout trabajo remoto señales",
  secondary: [
    "agotamiento teletrabajo qué hacer",
    "poner límites trabajando en remoto",
    "desconectar del trabajo en casa",
    "derecho a la desconexión digital",
    "prevenir el burnout en equipos distribuidos",
  ],
  title: "Burnout remoto: las señales que aparecen antes del cansancio",
  h1: "Burnout remoto: las señales que aparecen antes del cansancio",
  metaTitle: "Burnout en trabajo remoto: señales tempranas y qué funciona",
  metaDescription:
    "Los indicadores que aparecen antes del agotamiento, por qué el solapamiento horario es el factor más subestimado, y los cambios estructurales que funcionan mejor que la fuerza de voluntad.",
  ogTitle: "Burnout remoto: las señales antes del cansancio",
  ogDescription:
    "La pérdida de criterio y la dificultad para empezar llegan antes que el cansancio. Qué cambiar, estructuralmente.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 10,
  author: "Equipo ActiveXRemote",
  terms: ["burnout-remoto", "solapamiento-horario", "trabajo-asincrono", "onboarding-distribuido"],
  related: ["solapamiento-horario-ofertas-remotas", "trabajo-asincrono-guia", "primeros-90-dias-equipo-distribuido"],
  external: [
    { label: "Organización Mundial de la Salud · Burnout en la CIE-11", url: "https://www.who.int" },
    { label: "Instituto Nacional de Seguridad y Salud en el Trabajo", url: "https://www.insst.es" },
    { label: "Ley Orgánica 3/2018 · Desconexión digital · BOE", url: "https://www.boe.es" },
  ],
  intro: [
    "El agotamiento remoto no se presenta como cansancio. Aparece primero como una dificultad extraña para empezar cosas que sabes hacer perfectamente, y como decisiones que tardan el triple de lo normal sin ningún motivo aparente.",
    "Cuando el síntoma principal ya es el cansancio, suele llevar meses acumulándose. Aquí van las señales anteriores, las causas estructurales que la fuerza de voluntad no arregla, y lo que sí cambia la trayectoria.",
  ],
  sections: [
    {
      id: "senales",
      h2: "Las señales que llegan antes del cansancio",
      answer:
        "Tres aparecen pronto y de forma consistente: dificultad para empezar tareas que eres perfectamente capaz de hacer, decisiones pequeñas que de repente pesan mucho, y un aplanamiento del interés donde lo que antes te enganchaba ahora parece papeleo.",
      blocks: [
        {
          t: "p",
          text: "Es fácil leerlas como falta de motivación, y por eso la reacción habitual es apretar más. Esa es la intervención equivocada: lo que se está agotando es la capacidad de juicio, y añadir esfuerzo acelera el agotamiento.",
        },
        {
          t: "ul",
          items: [
            "Abrir una tarea, leerla y cerrarla sin empezar, una y otra vez.",
            "Decisiones pequeñas que se alargan o se aplazan indefinidamente.",
            "Trabajar más horas produciendo menos, y saberlo.",
            "Irritación ante interrupciones rutinarias que antes ni registrabas.",
            "Fines de semana que dejan de reponer aunque no pase nada en ellos.",
          ],
        },
        {
          t: "note",
          text: "El burnout está reconocido como fenómeno ocupacional derivado de estrés laboral crónico no gestionado con éxito. Es una condición de la situación de trabajo, no una debilidad de carácter.",
        },
      ],
      takeaway:
        "La pérdida de criterio precede al agotamiento. Si las decisiones pesan, esa es la señal.",
    },
    {
      id: "causas",
      h2: "Qué lo provoca específicamente en remoto",
      answer:
        "Cuatro factores estructurales: no hay frontera entre el espacio de trabajo y el de vivir, la disponibilidad se estira para cubrir husos horarios, buena parte del trabajo es invisible y no se reconoce, y falta el contacto social informal que amortigua el estrés en una oficina.",
      blocks: [
        {
          t: "table",
          head: ["Factor", "Cómo opera", "Qué ayuda de verdad"],
          rows: [
            ["Sin frontera espacial", "El puesto de trabajo nunca deja de estar a la vista", "Un final del día físico o ritual"],
            ["Estiramiento horario", "La disponibilidad se expande hasta cubrir a todos", "Hora de corte fija y reuniones rotatorias"],
            ["Trabajo invisible", "El esfuerzo que no produce artefacto no se reconoce", "Escribir lo que has hecho, también para ti"],
            ["Falta de amortiguador social", "No hay contacto casual donde descargar tensión", "Conversación no laboral, agendada a propósito"],
          ],
        },
        {
          t: "p",
          text: "El factor horario es el más subestimado. Aceptar reuniones a cualquier hora para no ser «el complicado» fragmenta el día hasta que no queda ningún bloque de trabajo profundo, y ocurre lo bastante despacio como para que nadie recuerde haberlo decidido.",
        },
      ],
      takeaway:
        "El solapamiento excesivo es el predictor estructural más fuerte, y nadie lo nombra.",
    },
    {
      id: "estructura",
      h2: "Por qué la estructura gana a la disciplina",
      answer:
        "Porque la fuerza de voluntad es justamente el recurso que se está agotando. Las reglas que dependen de que decidas bien cada tarde fallan precisamente los días en que más falta hacen. Lo que aguanta son los cambios que no requieren decisión: bloques de calendario, separación de dispositivos, normas de equipo.",
      blocks: [
        {
          t: "ol",
          items: [
            "Pon un bloque recurrente al final de tu jornada y deja que rechace reuniones automáticamente.",
            "Separa dispositivos o cuentas si puedes. Las notificaciones que no ves no exigen disciplina para ignorarlas.",
            "Acuerda una norma de equipo, no personal: «sin reuniones después de las 17:00» aguanta mejor que tu preferencia individual.",
            "Agenda la recuperación en lugar de dejarla a la energía que quede el viernes.",
          ],
        },
        {
          t: "quote",
          text: "Cualquier límite que dependa de que seas disciplinado a las 19:00 fallará justo los días que más lo necesitas.",
        },
      ],
      takeaway:
        "Diseña la restricción para que no necesite tu voluntad para funcionar.",
    },
    {
      id: "conversacion",
      h2: "Cómo plantearlo en el trabajo",
      answer:
        "Como una conversación de carga y estructura, no personal. «No puedo sostener cuatro horas de solapamiento por la tarde y esto es lo que propongo» es accionable. «Estoy quemado» es cierto pero deja a tu responsable sin ninguna palanca que mover.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Trae la causa concreta", text: "Nombra las reuniones, las horas o la carga. Sobre un agotamiento genérico nadie sabe actuar." },
            { title: "Trae una propuesta", text: "Otra franja, un turno rotatorio, menos proyectos simultáneos. Una propuesta se acepta mejor que un problema." },
            { title: "Pon un plazo", text: "«Durante los próximos dos meses» es más fácil de aprobar que un cambio indefinido." },
            { title: "Escala si no cambia nada", text: "En España la desconexión digital es un derecho reconocido y la empresa tiene obligaciones sobre riesgos psicosociales. No es sólo un asunto personal." },
          ],
        },
      ],
      takeaway:
        "Trae la causa y una propuesta. Los responsables actúan sobre propuestas, no sobre síntomas.",
    },
    {
      id: "recuperacion",
      h2: "Qué exige de verdad recuperarse",
      answer:
        "Más que unas vacaciones. El descanso repone energía pero no cambia las condiciones, así que volver a la misma estructura reproduce el mismo estado en pocas semanas. Recuperarse significa cambiar lo que lo provocó: normalmente carga, horas de reunión o ausencia de límite.",
      blocks: [
        {
          t: "p",
          text: "Es el error más común: tratar el descanso como la intervención. Dos semanas fuera de una situación que no ha cambiado son una pausa, no una solución, y la decepción de recaer al poco de volver desmoraliza por sí misma.",
        },
        {
          t: "ul",
          items: [
            "Cambia una cosa estructural antes de coger las vacaciones, para volver a algo distinto.",
            "Reduce compromisos simultáneos en lugar de intentar hacer lo mismo más rápido.",
            "Reconstruye el contacto no laboral, que suele ser lo primero que se abandona.",
            "Si las señales siguen tras el cambio estructural, trátalo como asunto de salud y busca apoyo profesional.",
          ],
        },
      ],
      takeaway:
        "Descansar sin cambiar las condiciones es una pausa. Cambia algo estructural antes.",
    },
  ],
  faqs: [
    { q: "¿Cuáles son las señales tempranas del burnout remoto?", a: "Dificultad para empezar tareas que sabes hacer, decisiones pequeñas que pesan de forma desproporcionada y un aplanamiento del interés. Aparecen antes que el cansancio, y por eso se confunden con falta de motivación." },
    { q: "¿El trabajo remoto quema más que el presencial?", a: "No intrínsecamente, pero elimina algunos amortiguadores y añade riesgos propios: sin frontera espacial, disponibilidad estirada entre husos horarios y menos contacto social casual donde descargar tensión." },
    { q: "¿Por qué importa tanto el solapamiento horario?", a: "Porque la disponibilidad se expande poco a poco hasta cubrir a todo el mundo. Aceptar reuniones a cualquier hora para no parecer complicado fragmenta el día hasta que no queda ningún bloque de trabajo profundo." },
    { q: "¿Por qué no funciona la disciplina?", a: "Porque la fuerza de voluntad es el recurso que se está agotando. Los límites que exigen decidir bien cada tarde fallan justo los días en que más falta hacen." },
    { q: "¿Qué cambios estructurales ayudan?", a: "Bloques de calendario que rechacen reuniones automáticamente, separación de dispositivos o cuentas, y normas de equipo en lugar de personales. Cualquier cosa que no requiera decidir en el momento." },
    { q: "¿Cómo lo hablo con mi responsable?", a: "Como conversación de carga y estructura, con una causa concreta, una propuesta y un plazo. Un responsable puede actuar sobre una propuesta; sobre un agotamiento genérico no tiene palanca." },
    { q: "¿Unas vacaciones lo arreglan?", a: "Reponen energía pero no cambian las condiciones. Volver a una estructura idéntica reproduce el mismo estado en semanas, por eso importa cambiar algo estructural antes del descanso." },
    { q: "¿El burnout es un diagnóstico médico?", a: "Está clasificado como fenómeno ocupacional derivado de estrés laboral crónico no gestionado, no como enfermedad. Si los síntomas persisten, sigue justificando apoyo profesional." },
    { q: "¿Tiene obligaciones la empresa?", a: "Sí. En España existe el derecho a la desconexión digital y obligaciones de evaluación de riesgos psicosociales. No es un asunto exclusivamente personal." },
    { q: "¿Cómo me reconstruyo después de parar?", a: "Volviendo a algo estructuralmente distinto, reduciendo compromisos simultáneos en lugar de trabajar más rápido, y recuperando a propósito el contacto no laboral que casi siempre fue lo primero en desaparecer." },
  ],
};
