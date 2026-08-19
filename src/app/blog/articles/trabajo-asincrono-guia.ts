import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "trabajo-asincrono-guia",
  locale: "es",
  cluster: "metodo",
  funnel: "tofu",
  intent: "informacional",
  keyword: "trabajo asíncrono qué es",
  secondary: [
    "comunicación asíncrona ejemplos",
    "cómo trabajar en asíncrono con husos distintos",
    "reuniones innecesarias teletrabajo",
    "documentar decisiones equipo remoto",
    "teletrabajo sin horario fijo",
  ],
  title: "Trabajo asíncrono: la diferencia entre estar en remoto y funcionar en remoto",
  h1: "Trabajo asíncrono: la diferencia entre estar en remoto y funcionar en remoto",
  metaTitle: "Trabajo asíncrono: qué es y cómo se implanta de verdad",
  metaDescription:
    "Qué exige el asíncrono más allá de responder más tarde: contexto escrito, decisiones registradas y acciones por defecto. Con las reuniones que sí sobreviven y los tres fallos que hunden a los equipos.",
  ogTitle: "Trabajo asíncrono: estar en remoto no es funcionar en remoto",
  ogDescription:
    "El asíncrono no es responder luego. Es escribir para que nadie quede bloqueado esperando.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  terms: ["trabajo-asincrono", "documentacion-asincrona", "solapamiento-horario", "stack-remoto", "onboarding-distribuido"],
  related: ["solapamiento-horario-ofertas-remotas", "stack-remoto-imprescindible", "primeros-90-dias-equipo-distribuido"],
  external: [
    { label: "Eurofound · Teletrabajo y condiciones laborales", url: "https://www.eurofound.europa.eu" },
    { label: "Ley 10/2021 de trabajo a distancia · BOE", url: "https://www.boe.es" },
    { label: "OIT · Guía práctica sobre teletrabajo", url: "https://www.ilo.org" },
  ],
  intro: [
    "La mayoría de empresas que se llaman remotas son empresas presenciales cuya oficina resulta ser una videollamada. Todo el mundo trabaja las mismas horas, las decisiones se siguen tomando en reuniones, y quien está fuera de esa franja va permanentemente por detrás.",
    "El asíncrono es lo que de verdad hace funcionar la distribución, y es una disciplina de diseño, no una preferencia de comunicación. Esto cubre qué exige, qué cuesta y dónde fallan los equipos que lo intentan.",
  ],
  sections: [
    {
      id: "que-es",
      h2: "Qué significa asíncrono de verdad",
      answer:
        "Significa que las respuestas no se esperan en tiempo real y, sobre todo, que nadie queda bloqueado mientras espera una. Se apoya en contexto escrito, decisiones registradas y plazos explícitos, de modo que cada persona avanza en su franja sin necesitar a nadie despierto.",
      blocks: [
        {
          t: "p",
          text: "El malentendido habitual es que asíncrono significa «ya te contesto luego». Eso es trabajo síncrono lento. Asíncrono de verdad significa que la petición traía contexto suficiente para actuar sin repreguntar, y que la decisión que produjo quedó escrita donde la encontrará el siguiente.",
        },
        {
          t: "table",
          head: ["", "Síncrono por defecto", "Asíncrono por defecto"],
          rows: [
            ["Dónde se decide", "En reuniones", "En documentos, con responsable escrito"],
            ["Qué contiene una pregunta", "Lo justo para abrir conversación", "Lo suficiente para responderse sin ella"],
            ["Quién puede aportar", "Quien estuvo en la sala", "Cualquiera, dentro de su horario"],
            ["Coste de incorporar a alguien", "Repetir el contexto de viva voz", "Señalarle el registro escrito"],
            ["Cómo falla", "Quien está fuera de la franja se descuelga", "El silencio se confunde con acuerdo"],
          ],
        },
      ],
      takeaway:
        "Asíncrono no es responder más tarde. Es escribir para que no haga falta respuesta para avanzar.",
    },
    {
      id: "escribir",
      h2: "Escribir con contexto suficiente",
      answer:
        "Un mensaje asíncrono tiene que sobrevivir a ser leído ocho horas después por alguien que no puede preguntarte nada. Eso significa exponer la situación, qué decisión hace falta, qué opciones has considerado, tu recomendación y el plazo, en ese orden y en un solo mensaje.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Expón la situación", text: "Dos líneas de contexto, asumiendo que quien lee no ha seguido el tema. Es la parte que todo el mundo se salta y la que cuesta un viaje de ida y vuelta." },
            { title: "Di qué necesitas", text: "Una decisión, una revisión o información. Dilo. «¿Opiniones?» no es una petición." },
            { title: "Da las opciones", text: "Qué consideraste y descartaste, brevemente. Evita que te propongan lo que ya has descartado." },
            { title: "Recomienda", text: "Di qué harías tú. Un mensaje sin recomendación traslada el trabajo a quien lee." },
            { title: "Pon el plazo", text: "«Si no me dices nada antes del jueves, sigo con la opción B.» Esto es lo que impide que el asíncrono se convierta en esperar." },
          ],
        },
        {
          t: "p",
          text: "Esa última línea hace más trabajo que todas las demás juntas. Sin acción por defecto, el asíncrono colapsa en espera, y la espera es lo que hace concluir que los equipos distribuidos son lentos.",
        },
      ],
      takeaway:
        "Contexto, petición, opciones, recomendación y plazo. Si falta uno, habrá repregunta.",
    },
    {
      id: "decisiones",
      h2: "Registrar decisiones, no conversaciones",
      answer:
        "Lo valioso es la decisión y su razonamiento, no la transcripción de cómo se llegó a ella. Un registro de decisión dice qué se decidió, qué se descartó y por qué, para que quien llegue seis meses después entienda las restricciones en lugar de reabrir el debate.",
      blocks: [
        {
          t: "ul",
          items: [
            "Escribe qué se decidió, en una frase, arriba del todo.",
            "Enumera las alternativas consideradas y el motivo del descarte.",
            "Nombra a la persona responsable, no al grupo.",
            "Ponle fecha, y anota qué haría replantearlo.",
          ],
        },
        {
          t: "p",
          text: "Los equipos sin esto repiten las mismas discusiones cada pocos meses porque nadie recuerda qué se probó. El coste es invisible hasta que cuentas las horas dedicadas a relitigar decisiones cerradas hace un año.",
        },
      ],
      takeaway:
        "Registra el razonamiento, no la conversación. El razonamiento es lo que impide reabrir el debate.",
    },
    {
      id: "reuniones",
      h2: "Qué reuniones sobreviven",
      answer:
        "El asíncrono no significa cero reuniones. Significa reservarlas para lo que necesita simultaneidad de verdad: desacuerdos que se han atascado por escrito, construcción de relación y todo lo que exige ida y vuelta rápida. Las de estado y las informativas no deberían ser reuniones nunca.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Se mantienen: desacuerdos sin resolver tras una ronda escrita.",
            "Se mantienen: reuniones uno a uno y todo lo relacional.",
            "Se mantienen: exploración inicial cuando la pregunta aún no está clara.",
            "Se mantienen: incidencias y cualquier cosa realmente urgente.",
          ],
          cons: [
            "Se eliminan: reuniones de estado, que son un documento.",
            "Se eliminan: informativas, que son una grabación.",
            "Se eliminan: reuniones sin orden del día escrito y sin decisión que tomar.",
            "Se eliminan: recurrentes que nadie ha cuestionado en seis meses.",
          ],
        },
        {
          t: "note",
          text: "Una prueba práctica: si la reunión se pudiera sustituir por un documento con comentarios sin perder nada, debería sustituirse. Si la respuesta honesta es que nadie leería el documento, el problema es la cultura, no el formato.",
        },
      ],
      takeaway:
        "Reuniones para desacuerdo y relación. Documentos para todo lo demás.",
    },
    {
      id: "fallos",
      h2: "Dónde fallan de verdad los equipos asíncronos",
      answer:
        "Se repiten tres fallos. El silencio se interpreta como acuerdo cuando significa que nadie lo miró. El volumen escrito crece hasta que nadie lee nada. Y quienes se manejan bien en lo síncrono siguen decidiendo en canales paralelos que el registro nunca recoge.",
      blocks: [
        {
          t: "ol",
          items: [
            "Silencio como consentimiento: se corrige con acciones por defecto explícitas y revisores nombrados, no con avisos al grupo entero.",
            "Volumen: se corrige haciendo norma la brevedad y separando lo que hay que leer de lo que está disponible por si acaso.",
            "Canales paralelos: se corrige exigiendo que toda decisión tomada en una llamada se escriba antes de contar.",
            "Deriva horaria: se corrige rotando las horas de reunión para que no sean siempre los mismos quienes trasnochan.",
          ],
        },
        {
          t: "quote",
          text: "El asíncrono falla cuando es sólo una política. Funciona cuando la acción por defecto está escrita y alguien la firma.",
        },
      ],
      takeaway:
        "Los tres asesinos son el acuerdo presunto, el volumen no leído y las decisiones fuera de registro.",
    },
  ],
  faqs: [
    { q: "¿Qué es el trabajo asíncrono?", a: "Una forma de coordinar equipos en la que las respuestas no se esperan en tiempo real y nadie queda bloqueado esperando. Se apoya en contexto escrito, decisiones registradas y plazos explícitos para que cada persona avance en su franja horaria." },
    { q: "¿Asíncrono y remoto son lo mismo?", a: "No. Remoto es dónde trabajas, asíncrono es cómo os coordináis. Muchas empresas remotas funcionan de forma completamente síncrona, y por eso quien está en otro huso horario acaba siempre por detrás." },
    { q: "¿Trabajar en asíncrono significa no tener reuniones?", a: "No. Significa reservarlas para desacuerdos atascados, construcción de relación y urgencias reales. Las reuniones de estado y las informativas deberían ser un documento o una grabación." },
    { q: "¿Cómo se escribe un buen mensaje asíncrono?", a: "Contexto, petición concreta, opciones consideradas, tu recomendación y un plazo con acción por defecto. Esa acción por defecto es lo que evita que el asíncrono se convierta en esperar." },
    { q: "¿Cómo evito que el silencio se tome por acuerdo?", a: "Nombrando revisores concretos en lugar de avisar al grupo, y diciendo qué pasa si nadie responde antes del plazo. Las peticiones dirigidas a todos no las responde nadie." },
    { q: "¿El asíncrono ralentiza las decisiones?", a: "Mal implantado, sí: se convierte en espera. Bien implantado es más rápido, porque las decisiones no hacen cola detrás del siguiente hueco libre en la agenda." },
    { q: "¿Qué herramientas hace falta para trabajar en asíncrono?", a: "Menos de las que se cree. Un sitio para documentos, uno para conversación, un gestor de tareas y algo para grabar. Lo importante es que haya una única fuente de verdad por tipo de información, no qué producto sea." },
    { q: "¿Cómo se incorpora alguien nuevo sin contexto de viva voz?", a: "Mejor que en un equipo síncrono, si el registro es bueno. Las decisiones escritas con su razonamiento permiten reconstruir meses de contexto en días, en lugar de absorberlo poco a poco en reuniones." },
    { q: "¿Cuánto solapamiento horario necesita un equipo asíncrono?", a: "Entre dos y cuatro horas suele bastar para las reuniones que de verdad requieren simultaneidad. Los equipos que necesitan más suelen ser equipos síncronos que no lo han reconocido." },
    { q: "¿Sirve el asíncrono para trabajo creativo?", a: "En parte. La exploración inicial, cuando la pregunta aún se está formando, gana con conversación en tiempo real. Una vez clara la pregunta, la iteración escrita suele producir mejor pensamiento que otra llamada." },
  ],
};
