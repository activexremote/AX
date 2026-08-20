import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "negociar-salario-remoto-internacional",
  locale: "es",
  cluster: "empleo",
  funnel: "bofu",
  intent: "comercial",
  keyword: "negociar salario trabajo remoto internacional",
  secondary: [
    "cuánto pedir en una empresa extranjera",
    "salario ajustado por ubicación qué es",
    "compensación global negociación",
    "bandas salariales empresas remotas",
    "contraoferta trabajo remoto",
  ],
  title: "Negociar un salario remoto internacional sin regalar el 30%",
  h1: "Negociar un salario remoto internacional sin regalar el 30%",
  metaTitle: "Negociar salario remoto internacional: guía práctica",
  metaDescription:
    "Cómo se fijan las bandas en empresas remotas, qué es el salario ajustado por ubicación y cómo preparar la conversación para no anclar la cifra en tu sueldo anterior.",
  ogTitle: "Negociar un salario remoto internacional",
  ogDescription:
    "Pago por mercado o por ubicación, paquete completo y la pregunta que hay que hacer antes de decir una cifra.",
  published: "2026-05-12",
  updated: "2026-05-12",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["compensacion-global", "geo-pay", "multidivisa", "contractor-internacional", "employer-of-record"],
  related: ["trabajo-remoto-internacional-desde-espana", "como-trabajar-para-empresa-extranjera-legalmente", "cobrar-clientes-extranjero", "curso-trabajo-remoto-cual-elegir"],
  external: [
    { label: "Eurostat · Estadísticas de salarios y coste laboral", url: "https://ec.europa.eu/eurostat" },
    { label: "OCDE · Estadísticas de remuneración media", url: "https://data.oecd.org" },
    { label: "Comisión Europea · Directiva de transparencia retributiva", url: "https://ec.europa.eu/social" },
  ],
  intro: [
    "En una negociación remota internacional casi nunca se pierde dinero por pedir demasiado. Se pierde por contestar demasiado pronto, con una cifra anclada en lo que cobrabas en tu país anterior y sin saber cómo fija esa empresa sus bandas.",
    "Esta guía ordena la conversación: qué averiguar antes, qué preguntar en la primera llamada, cómo traducir un paquete completo a una cifra comparable y qué hacer cuando la respuesta es «pagamos según tu ubicación».",
  ],
  sections: [
    {
      id: "dos-modelos",
      h2: "Los dos modelos de compensación remota",
      answer:
        "Las empresas remotas pagan de dos maneras. O fijan la banda por el mercado del puesto, igual para todo el mundo, o la ajustan por el coste de vida de donde vives. La diferencia entre uno y otro puede superar el 40% para el mismo trabajo, y la política existe antes de que tú aparezcas.",
      blocks: [
        {
          t: "table",
          head: ["", "Pago por mercado del puesto", "Pago ajustado por ubicación"],
          rows: [
            ["Cómo se fija", "Una banda global por rol y nivel", "Una banda base ajustada por un índice geográfico"],
            ["Qué se negocia", "En qué punto de la banda encajas", "El punto de la banda y, a veces, el índice aplicado"],
            ["Si te mudas", "No cambia", "Puede recalcularse tu retribución"],
            ["Suele venir de", "Empresas con bandas documentadas y públicas", "Empresas con presencia en muchos países"],
          ],
        },
        {
          t: "p",
          text: "Ninguno de los dos es ilegítimo. Lo que no funciona es entrar a negociar sin saber en cuál estás: los argumentos que mueven una banda global no sirven para discutir un índice geográfico, y al revés.",
        },
      ],
      takeaway:
        "La primera pregunta no es «cuánto pagáis», sino «cómo fijáis las bandas».",
    },
    {
      id: "antes",
      h2: "Qué averiguar antes de la primera llamada",
      answer:
        "Tres cosas: cómo te van a contratar, en qué modelo de compensación están y cuál es el rango de mercado del puesto para el nivel que ocupas. Las tres se pueden averiguar sin preguntar nada comprometido, y cambian por completo la cifra que tiene sentido pedir.",
      blocks: [
        {
          t: "ol",
          items: [
            "Figura contractual: empleado vía Employer of Record o contractor. Un bruto de contractor y uno de empleado no son comparables.",
            "Modelo de compensación: mira si publican bandas, si tienen manual público o si la oferta menciona países elegibles con rangos distintos.",
            "Rango de mercado: contrasta al menos dos fuentes del mercado de la empresa, no del tuyo.",
            "Moneda y forma de pago: cobrar en una divisa distinta a la de tus gastos añade coste de conversión si no lo gestionas.",
          ],
        },
        {
          t: "note",
          text: "Si te contratan como contractor, la cifra tiene que absorber cuota de autónomos, impuestos que antes retenía la empresa, días no facturados por vacaciones o enfermedad y la ausencia de indemnización. Es habitual que eso suponga entre un 25% y un 40% sobre el equivalente de empleado.",
        },
      ],
      takeaway:
        "Llegar con el modelo de contratación y el rango de mercado claros es la mitad de la negociación.",
    },
    {
      id: "primera-cifra",
      h2: "Quién dice la primera cifra",
      answer:
        "Idealmente, la empresa. Si insisten en que la digas tú, la respuesta útil no es un número aislado sino un rango justificado por el mercado del puesto, no por tu salario anterior. Anclar en lo que cobrabas antes traslada las condiciones de tu país anterior a un puesto que ya no las tiene.",
      blocks: [
        {
          t: "p",
          text: "Cuando preguntan «¿cuáles son tus expectativas?», hay tres respuestas que funcionan mejor que un número: preguntar por la banda del puesto, preguntar por el modelo de compensación, o dar un rango amplio anclado explícitamente en el mercado de la empresa y no en tu histórico.",
        },
        {
          t: "quote",
          text: "Tu salario anterior es información sobre tu país anterior, no sobre el valor del puesto que estás negociando.",
        },
        {
          t: "p",
          text: "En varios mercados europeos ya no se puede exigir el historial salarial, y la normativa de transparencia retributiva empuja a publicar rangos en las ofertas. Preguntar por el rango es cada vez más una pregunta normal, no atrevida.",
        },
      ],
      takeaway:
        "Si tienes que dar una cifra, da un rango y di de dónde sale. Nunca de tu nómina anterior.",
    },
    {
      id: "paquete",
      h2: "Traducir el paquete completo a una cifra comparable",
      answer:
        "Dos ofertas con el mismo bruto pueden diferir un 30% en valor real. Antes de comparar hay que traducir cada componente a una cifra anual neta: cotizaciones incluidas o no, seguro médico, equity, presupuesto de equipo y formación, días de descanso y coste de conversión de divisa.",
      blocks: [
        {
          t: "table",
          head: ["Componente", "Qué preguntar", "Por qué importa"],
          rows: [
            ["Bruto anual", "¿Incluye o excluye cotizaciones del empleador?", "Cambia el neto entre un 20% y un 35%."],
            ["Variable", "¿Es garantizado, por objetivos, discrecional?", "Un variable discrecional no se puede presupuestar."],
            ["Equity", "Tipo de instrumento, calendario y valoración", "Su valor real depende de condiciones que rara vez se explican."],
            ["Cobertura médica", "¿La cubre la empresa o corre de tu cuenta?", "Como contractor puede ser una partida anual relevante."],
            ["Días de descanso", "Días reales y si hay mínimo obligatorio", "Una política de días ilimitados sin mínimo suele traducirse en menos días."],
            ["Divisa", "Moneda de pago y quién asume la conversión", "El margen bancario puede llevarse varios puntos del ingreso."],
          ],
        },
      ],
      takeaway:
        "Compara netos anuales, no brutos. El bruto es la cifra que se anuncia; el neto es la que vives.",
    },
    {
      id: "ubicacion",
      h2: "Qué hacer si pagan según tu ubicación",
      answer:
        "Preguntar por el índice concreto y por su fecha de revisión. El ajuste por ubicación se apoya en un dato externo, y ese dato es discutible: qué ciudad se toma como referencia, qué cesta se compara y cada cuánto se actualiza. Ahí es donde hay margen, no en el «yo valgo más».",
      blocks: [
        {
          t: "ul",
          items: [
            "Pregunta qué referencia geográfica aplican: no es lo mismo el índice de tu país que el de tu ciudad.",
            "Pregunta cuándo se revisó por última vez: los índices desactualizados juegan en tu contra en contextos de inflación.",
            "Pregunta qué pasa si te mudas dentro del mismo país: si la respuesta es que no cambia, el índice es nacional y hay menos margen.",
            "Negocia los componentes que no dependen del índice: variable, formación, equipo, días o equity suelen estar fuera del ajuste.",
          ],
        },
        {
          t: "p",
          text: "Y si la banda ajustada sigue estando muy por debajo del mercado del puesto, es información útil: dice que esa empresa optimiza coste por geografía. Puedes aceptarlo con los ojos abiertos o priorizar empresas del otro modelo.",
        },
      ],
      takeaway:
        "Contra un índice no se argumenta con méritos: se argumenta con el índice.",
    },
  ],
  faqs: [
    { q: "¿Es cierto que cobraré menos por vivir en España?", a: "Sólo si la empresa ajusta por ubicación. Las que pagan por mercado del puesto ofrecen la misma banda a todo el mundo. Preguntarlo antes de dar una cifra cambia el marco entero de la conversación." },
    { q: "¿Puedo negarme a decir mi salario anterior?", a: "Sí, y en varios mercados ya no se puede exigir. Basta con reconducir la pregunta hacia la banda del puesto: tu histórico refleja las condiciones de otro mercado." },
    { q: "¿Cuánto más debo pedir como contractor que como empleado?", a: "Lo suficiente para absorber cotizaciones, impuestos no retenidos, días no facturados y ausencia de indemnización. En la práctica suele situarse entre un 25% y un 40% por encima del equivalente de empleado." },
    { q: "¿Cuándo se negocia el salario, al principio o al final?", a: "El rango, cuanto antes mejor, para no invertir semanas en un proceso que no encaja. La cifra concreta, cuando ya hay intención de oferta y tienes la información del paquete completo." },
    { q: "¿Qué hago si la oferta llega por debajo de mi mínimo?", a: "Decirlo con una cifra y una razón, no con un rechazo genérico. Muchas ofertas se mueven dentro de la banda si hay un argumento concreto y disposición real a aceptar." },
    { q: "¿Se puede negociar algo más que el salario?", a: "Casi siempre. Días de descanso, presupuesto de formación y equipo, fecha de incorporación, revisión salarial a los seis meses o cobertura médica suelen tener más margen que el bruto." },
    { q: "¿En qué moneda conviene cobrar?", a: "En la que gastas, si es posible. Si no, negocia quién asume la conversión y usa una cuenta multidivisa: el margen bancario puede llevarse varios puntos del ingreso anual." },
    { q: "¿El equity cuenta como salario?", a: "No para pagar el alquiler. Cuenta si entiendes el instrumento, el calendario de consolidación y la valoración. Si no puedes explicar esas tres cosas, valóralo en cero al comparar ofertas." },
    { q: "¿Debo mencionar otras ofertas que tengo?", a: "Sólo si son reales y estás dispuesto a aceptarlas. Como dato objetivo funciona; como farol es fácil de detectar y quema la relación." },
    { q: "¿Cada cuánto se revisan los salarios en empresas remotas?", a: "Lo habitual es una revisión anual, a veces ligada a un ciclo de evaluación. Preguntarlo en la negociación evita descubrir a los dos años que no hay ningún mecanismo." },
  ],
  hero: { file: "/blog/balanza.svg", alt: "Diagrama: una balanza desequilibrada entre lo que se ofrece y lo que se pide." },
};
