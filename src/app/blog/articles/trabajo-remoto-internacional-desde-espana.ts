import type { Article } from "@/app/blog/types";

// Artículo pilar del clúster de empleo. Es el hub al que apuntan los
// satélites de candidatura, fiscalidad y contratación.
export const article: Article = {
  slug: "trabajo-remoto-internacional-desde-espana",
  locale: "es",
  cluster: "empleo",
  funnel: "mofu",
  intent: "comercial",
  keyword: "trabajo remoto internacional desde España",
  secondary: [
    "trabajar para una empresa extranjera desde España",
    "empleo remoto internacional requisitos",
    "cómo conseguir un trabajo remoto en el extranjero",
    "employer of record España",
    "contractor internacional",
    "solapamiento horario",
    "salario ajustado por ubicación",
    "residencia fiscal teletrabajo",
  ],
  title: "Trabajo remoto internacional desde España: la guía completa de 2026",
  h1: "Trabajo remoto internacional desde España: cómo funciona de verdad",
  metaTitle: "Trabajo remoto internacional desde España: guía 2026",
  metaDescription:
    "Cómo conseguir y sostener un empleo remoto para una empresa extranjera desde España: contrato, fiscalidad, solapamiento horario y salario. Guía práctica con los pasos y los errores que descartan candidaturas.",
  ogTitle: "Trabajo remoto internacional desde España: cómo funciona de verdad",
  ogDescription:
    "Contrato, impuestos, husos horarios y salario: los cuatro puntos donde se cae la mayoría de candidaturas internacionales, explicados paso a paso.",
  published: "2026-03-31",
  updated: "2026-03-31",
  readingMinutes: 14,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: [
    "trabajo-remoto",
    "solapamiento-horario",
    "employer-of-record",
    "contractor-internacional",
    "residencia-fiscal",
    "compensacion-global",
    "geo-pay",
    "ats",
  ],
  related: ["negociar-salario-remoto-internacional", "curso-trabajo-remoto-cual-elegir", "que-es-activexremote", "como-trabajar-para-empresa-extranjera-legalmente"],
  external: [
    { label: "Agencia Tributaria · Residencia fiscal de las personas físicas", url: "https://sede.agenciatributaria.gob.es" },
    { label: "Comisión Europea · Trabajar en otro país de la UE", url: "https://europa.eu/youreurope/citizens/work/index_es.htm" },
    { label: "OCDE · Modelo de Convenio Tributario", url: "https://www.oecd.org/tax/treaties/" },
    { label: "Seguridad Social · Trabajadores desplazados y teletrabajo transfronterizo", url: "https://www.seg-social.es" },
  ],
  intro: [
    "Trabajar en remoto para una empresa de fuera de España dejó de ser una rareza hace años. Lo que sigue siendo raro es hacerlo bien: con el contrato adecuado, tributando donde toca y cobrando lo que corresponde al puesto y no a tu código postal.",
    "Esta guía recorre los cuatro puntos donde se decide todo: cómo te contratan, dónde pagas impuestos, qué requisito horario te descarta antes de leerte y cómo se fija el salario. No es teoría: es el orden en el que aparecen los problemas.",
  ],
  sections: [
    {
      id: "que-es",
      h2: "Qué es exactamente un trabajo remoto internacional",
      answer:
        "Un trabajo remoto internacional es aquel en el que resides en un país y la empresa que te paga está en otro. La distancia no cambia tus funciones, pero sí cambia tres cosas: la figura con la que te contratan, el país donde tributas y las horas en las que se espera que estés disponible.",
      blocks: [
        {
          t: "p",
          text: "La confusión más común es tratar «remoto» como una sola categoría. En la práctica hay tres variables independientes, y una oferta puede combinarlas de cualquier manera:",
        },
        {
          t: "table",
          head: ["Variable", "Opciones", "Quién la decide"],
          rows: [
            ["Ubicación", "Remoto total, híbrido, remoto con países elegibles", "La empresa, en la oferta"],
            ["Coordinación", "Síncrona con horario fijo, asíncrona, mixta con solapamiento mínimo", "La cultura del equipo"],
            ["Relación", "Empleo vía filial, empleo vía Employer of Record, contrato de servicios", "El departamento legal de la empresa"],
          ],
        },
        {
          t: "p",
          text: "Una empresa puede ser «remote first» y aun así exigir cuatro horas de solapamiento con California. Otra puede pagar por encima del mercado español y contratarte como contractor, dejándote la carga fiscal y administrativa entera. Leer bien estas tres variables antes de aplicar ahorra meses.",
        },
        {
          t: "note",
          text: "Remoto internacional no significa «sin reglas». Significa que aplican las reglas de dos países a la vez, y que ninguno de los dos va a avisarte.",
        },
      ],
      takeaway:
        "Ubicación, coordinación y relación contractual son tres decisiones distintas. Confundirlas es lo que lleva a firmar contratos que no encajan.",
    },
    {
      id: "como-te-contratan",
      h2: "Cómo te contrata una empresa extranjera",
      answer:
        "Hay tres vías. La empresa abre una filial en España, lo cual es raro salvo que contrate a varias personas; usa un Employer of Record, que te emplea localmente en su nombre; o te contrata como contractor y tú facturas. Cada una cambia tus derechos, tus impuestos y tu riesgo.",
      blocks: [
        {
          t: "table",
          head: ["Vía", "Tu figura", "Ventajas", "Riesgos"],
          rows: [
            [
              "Filial en España",
              "Empleado con contrato español",
              "Derechos laborales completos, cotización normal, sin gestión por tu parte.",
              "Poco frecuente: sólo compensa si contratan a varias personas en el país.",
            ],
            [
              "Employer of Record",
              "Empleado de un tercero que actúa como empleador legal",
              "Contrato local, nómina, cotizaciones y vacaciones en regla sin filial.",
              "Coste para la empresa: puede recortar la banda salarial que te ofrecen.",
            ],
            [
              "Contractor",
              "Autónomo que factura por servicios",
              "Más rápido de arrancar, tarifas normalmente más altas.",
              "Sin indemnización ni baja pagada, y riesgo de reclasificación si trabajas como un empleado.",
            ],
          ],
        },
        {
          t: "p",
          text: "La pregunta que conviene hacer en la primera llamada es directa: «¿cómo formalizáis la contratación de alguien que reside en España?». La respuesta separa a las empresas que ya tienen esto resuelto de las que van a improvisar contigo.",
        },
        {
          t: "note",
          text: "Si una empresa propone pagarte por transferencia mensual «como si fuera nómina» pero sin estructura local ni contrato de servicios, está trasladándote su riesgo. Ese acuerdo no existe en ningún ordenamiento.",
        },
      ],
      takeaway:
        "Employer of Record y contractor cubren el 95% de los casos reales. Saber cuál te ofrecen antes de negociar el salario cambia la cifra que deberías pedir.",
    },
    {
      id: "impuestos",
      h2: "Dónde pagas impuestos si trabajas para el extranjero",
      answer:
        "Como norma general, tributas donde tienes tu residencia fiscal, que suele ser donde vives y trabajas físicamente, no donde está la empresa. Si pasas más de 183 días en España o tu centro de intereses económicos está aquí, España te considera residente y grava tu renta mundial.",
      blocks: [
        {
          t: "p",
          text: "El artículo de rentas del trabajo de los convenios de doble imposición sigue una regla sencilla: el trabajo tributa donde se ejerce. En remoto, se ejerce desde tu salón. Por eso la empresa extranjera no te retiene IRPF español y por eso necesitas saber qué te toca declarar.",
        },
        {
          t: "steps",
          items: [
            {
              title: "Determina tu residencia fiscal",
              text: "Cuenta días, mira dónde está tu vivienda habitual y dónde generas la mayor parte de tus ingresos. No es una elección: es un hecho que se comprueba.",
            },
            {
              title: "Identifica el convenio aplicable",
              text: "España tiene convenio con la mayoría de países de los que vienen estas ofertas. Ahí está escrito quién grava qué y cómo se evita la doble tributación.",
            },
            {
              title: "Elige la figura correcta",
              text: "Como empleado vía Employer of Record, la retención la practica el empleador local. Como contractor, la gestión de pagos fraccionados y declaraciones es tuya.",
            },
            {
              title: "Documenta desde el primer mes",
              text: "Contrato, facturas, justificantes de cobro y días de estancia. Reconstruirlo dos años después, cuando llega una comprobación, es mucho más caro.",
            },
          ],
        },
        {
          t: "note",
          text: "Esta sección explica el marco general. No sustituye a un asesor fiscal: tu situación concreta depende del país de la empresa, del convenio aplicable y de tu propia trayectoria de residencia.",
        },
      ],
      takeaway:
        "El país que te paga y el país que te grava rara vez coinciden. Asumir que la empresa «ya se encarga» es el error más caro de esta lista.",
    },
    {
      id: "solapamiento",
      h2: "El requisito horario que descarta candidaturas en silencio",
      answer:
        "Casi toda oferta remota internacional exige un mínimo de horas coincidiendo con el equipo, normalmente entre dos y cuatro. Ese requisito decide desde qué países se puede optar al puesto, y aparece redactado de forma tan discreta que mucha gente ni lo registra al aplicar.",
      blocks: [
        {
          t: "p",
          text: "«Must have 4 hours overlap with PST» excluye a España de facto para cualquiera que no quiera trabajar de tarde-noche. «Overlap with CET» abre la puerta a media Europa. Es la primera línea que hay que buscar en una oferta, antes incluso del salario.",
        },
        {
          t: "table",
          head: ["Zona del equipo", "Solapamiento pedido", "Qué significa desde España"],
          rows: [
            ["Europa (CET/GMT)", "4-6 h", "Jornada normal, sin ajustes."],
            ["Costa este de EE. UU. (ET)", "3-4 h", "Tardes: de 15:00 a 19:00 aproximadamente."],
            ["Costa oeste de EE. UU. (PT)", "3-4 h", "Tarde-noche: a partir de las 18:00."],
            ["Asia-Pacífico", "2-3 h", "Primera hora de la mañana."],
          ],
        },
        {
          t: "p",
          text: "Cuando el solapamiento pedido es incompatible con tu vida, hay margen de negociación si llegas con una propuesta concreta: qué franja cubres, cómo documentas lo que haces fuera de ella y cómo se desbloquean las decisiones sin ti. Eso es trabajo asíncrono, y se puede demostrar.",
        },
      ],
      takeaway:
        "El solapamiento no es un detalle de la oferta: es el filtro geográfico real. Léelo antes que el salario.",
    },
    {
      id: "salario",
      h2: "Cómo se fija tu salario y por qué varía tanto",
      answer:
        "Las empresas remotas usan dos modelos. O pagan por el mercado del puesto, con la misma banda para todo el mundo, o ajustan por la ubicación de la persona. La diferencia entre uno y otro puede superar el 40% para el mismo trabajo, y la política está escrita antes de que tú llegues.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Pago por mercado del puesto: misma banda para todos, negociación centrada en tu nivel.",
            "Suele venir de empresas con estructura de compensación pública y bandas documentadas.",
            "Facilita comparar ofertas entre países sin hacer cálculos de coste de vida.",
          ],
          cons: [
            "Pago ajustado por ubicación: la banda se recalcula según dónde vives.",
            "Mudarte de ciudad puede cambiar tu retribución sin que cambie tu trabajo.",
            "La negociación se desplaza del «cuánto valgo» al «qué índice usáis», que es más difícil de mover.",
          ],
        },
        {
          t: "p",
          text: "Antes de dar una cifra conviene preguntar cuál de los dos modelos aplican y si las bandas están documentadas. Con esa información, la conversación deja de ser un regateo y pasa a ser una discusión sobre en qué punto de la banda encajas.",
        },
        {
          t: "p",
          text: "Y compara el paquete completo, no el bruto: cotizaciones incluidas o no, seguro médico, presupuesto de equipo y formación, días de descanso reales. Dos ofertas con el mismo número pueden diferir un 30% en valor.",
        },
      ],
      takeaway:
        "Pregunta por el modelo de compensación antes de dar una cifra. Es la única pregunta que cambia el marco de toda la negociación.",
    },
    {
      id: "por-donde-empezar",
      h2: "Por dónde empezar si partes de cero",
      answer:
        "El orden que funciona es al revés de lo intuitivo: primero se arregla la candidatura, luego se busca. Enviar cien solicitudes con un currículum que el filtro automático no sabe leer produce cien silencios y la conclusión equivocada de que no hay oportunidades.",
      blocks: [
        {
          t: "ol",
          items: [
            "Deja el currículum en una sola columna, sin foto ni datos personales, con logros cuantificados y el vocabulario exacto de las ofertas que te interesan.",
            "Monta una muestra pública de trabajo: dos o tres casos explicados con problema, decisión y resultado. Sustituye a la reputación local, que no cruza fronteras.",
            "Filtra las ofertas por solapamiento horario y países elegibles antes de leer nada más.",
            "Averigua la figura contractual en la primera conversación, no en la oferta final.",
            "Prepara la negociación con el paquete completo traducido a neto anual comparable.",
          ],
        },
        {
          t: "quote",
          text: "El mercado remoto internacional no premia al que más aplica, sino al que llega antes con la candidatura menos ambigua.",
        },
      ],
      takeaway:
        "Arregla la candidatura antes de aumentar el volumen. Multiplicar envíos con un mal punto de partida multiplica el silencio.",
    },
  ],
  faqs: [
    {
      q: "¿Puedo trabajar para una empresa extranjera estando de alta como autónomo en España?",
      a: "Sí. Es la vía de contractor: te das de alta, emites factura por tus servicios y gestionas tus impuestos y cotizaciones. Es la fórmula más rápida, pero no incluye indemnización, baja pagada ni vacaciones retribuidas, así que la tarifa debería reflejarlo.",
    },
    {
      q: "¿Qué es un Employer of Record y por qué me lo proponen?",
      a: "Es una empresa que te contrata legalmente en España en nombre de la compañía extranjera. Asume nómina, cotizaciones y cumplimiento laboral local. Te lo proponen porque permite darte un contrato español real sin que la empresa tenga que abrir una filial.",
    },
    {
      q: "¿Dónde pago impuestos si vivo en España y la empresa está en Estados Unidos?",
      a: "Si eres residente fiscal en España, tributas aquí por tu renta mundial. La empresa estadounidense no practica retención española. El convenio entre ambos países determina cómo se evita que la misma renta tribute dos veces.",
    },
    {
      q: "¿Cuántos días puedo pasar fuera sin perder la residencia fiscal española?",
      a: "El criterio más conocido son 183 días en el año natural, pero no es el único: España también te considera residente si tu centro de intereses económicos está aquí. Salir del país no basta; normalmente hay que acreditar residencia fiscal en otro sitio.",
    },
    {
      q: "¿Qué significa «overlap» en una oferta de trabajo remoto?",
      a: "Son las horas en las que debes coincidir con el equipo. Suele pedirse entre dos y cuatro horas. Es el requisito que determina desde qué países se puede optar al puesto, aunque la oferta no mencione ningún país.",
    },
    {
      q: "¿Me pagarán menos por vivir en España?",
      a: "Depende de la política de la empresa. Las que pagan por mercado del puesto ofrecen la misma banda a todo el mundo; las que ajustan por ubicación recalculan según el coste de vida. Preguntarlo antes de dar una cifra cambia el marco de la negociación.",
    },
    {
      q: "¿Necesito un nivel alto de inglés?",
      a: "Necesitas escribir con claridad más que hablar con fluidez. En equipos asíncronos la mayor parte de la comunicación es escrita, y se valora más un mensaje bien estructurado que una conversación rápida.",
    },
    {
      q: "¿Sirve mi currículum español para aplicar fuera?",
      a: "Normalmente no. La foto, la fecha de nacimiento y el estado civil, habituales aquí, se perciben como riesgo de sesgo en el mercado anglosajón y algunas empresas descartan por política. Además, el formato de dos columnas suele romper el análisis automático.",
    },
    {
      q: "¿Es mejor buscar en portales de empleo remoto o contactar directamente?",
      a: "Las dos vías se complementan. Los portales concentran mucha competencia y las primeras cuarenta y ocho horas de una publicación absorben la mayoría de candidaturas leídas con atención. El contacto directo con quien decide llega a puestos que aún no se han publicado.",
    },
    {
      q: "¿Puedo cambiar de país mientras trabajo en remoto para la misma empresa?",
      a: "Técnicamente sí, legalmente depende. Muchas empresas limitan días y países en su política de trabajo desde cualquier lugar, porque tu presencia prolongada en otro país puede crearles obligaciones fiscales. Avisar antes evita rescisiones incómodas.",
    },
  ],
  hero: { file: "/blog/mercado-global.svg", alt: "Diagrama: dos husos horarios unidos por un arco de trabajo que cruza la distancia." },
};
