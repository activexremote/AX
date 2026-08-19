import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Diccionario de trabajo remoto internacional.
//
//  Es la capa de terminología de la que tiran tres sitios:
//   · la sección de glosario de la portada,
//   · las páginas /glosario y /glosario/[termino],
//   · el copy de la landing y los artículos del blog, que enlazan a los
//     términos en vez de volver a definirlos.
//
//  Cada término trae una definición corta autocontenida (40-60 palabras) que
//  responde a la pregunta directa, pensada para extractos destacados y para
//  que un modelo pueda citarla sin necesitar el resto de la página. La larga
//  añade el contexto y el porqué.
//
//  `related` teje el grafo de entidades: son los términos con los que este
//  coocurre de forma natural, no una lista de sinónimos.
// ══════════════════════════════════════════════════════════

export type TermCategory =
  | "modalidad"
  | "legal"
  | "fiscal"
  | "empleo"
  | "negocio"
  | "stack";

export type Term = {
  /** Se usa como slug de la URL en los dos idiomas. */
  id: string;
  category: TermCategory;
  /** Ids de términos con los que se relaciona semánticamente. */
  related: string[];
  es: TermCopy;
  en: TermCopy;
};

export type TermCopy = {
  term: string;
  /** Siglas o forma larga, cuando la hay. */
  aka?: string;
  /** Respuesta directa, 40-60 palabras, autocontenida. */
  short: string;
  /** Contexto, matices y por qué importa. */
  long: string;
  /** Sinónimos y variantes de búsqueda reales. */
  synonyms: string[];
};

export const TERMS: readonly Term[] = [
  {
    id: "trabajo-remoto",
    category: "modalidad",
    related: ["trabajo-asincrono", "solapamiento-horario", "nomada-digital"],
    es: {
      term: "Trabajo remoto",
      short:
        "El trabajo remoto es un modelo laboral en el que la persona desempeña su puesto desde cualquier ubicación con conexión, sin acudir a una oficina de la empresa. No define el horario ni el tipo de contrato: define únicamente dónde se trabaja, y por eso convive tanto con el empleo por cuenta ajena como con la facturación como contractor.",
      long:
        "Conviene separar tres cosas que suelen confundirse: la ubicación (remoto o presencial), la coordinación (síncrona o asíncrona) y la relación contractual (empleo o prestación de servicios). Una empresa puede ser remota y seguir exigiendo presencia en horario fijo. El trabajo remoto internacional añade una cuarta capa, la jurisdicción: dónde reside la persona, dónde está la empresa y qué normas aplican a cada una.",
      synonyms: ["teletrabajo", "trabajo a distancia", "trabajo en remoto"],
    },
    en: {
      term: "Remote work",
      short:
        "Remote work is a working model in which a person performs their role from any connected location, without attending a company office. It defines neither the schedule nor the type of contract: it defines only where the work happens, which is why it coexists with both employment and contractor arrangements.",
      long:
        "Three things are worth separating, because they are routinely conflated: location (remote or on-site), coordination (synchronous or asynchronous) and contractual relationship (employment or services). A company can be remote and still require fixed hours. International remote work adds a fourth layer, jurisdiction: where the person lives, where the company sits and which rules bind each.",
      synonyms: ["telework", "working from anywhere", "distributed work"],
    },
  },
  {
    id: "trabajo-asincrono",
    category: "modalidad",
    related: ["trabajo-remoto", "documentacion-asincrona", "solapamiento-horario"],
    es: {
      term: "Trabajo asíncrono",
      short:
        "El trabajo asíncrono es una forma de coordinar equipos en la que las respuestas no se esperan en tiempo real. Cada persona avanza en su franja horaria apoyándose en documentación escrita, decisiones registradas y plazos claros, en lugar de reuniones simultáneas. Es lo que permite que un equipo funcione repartido entre husos horarios incompatibles.",
      long:
        "El asíncrono no es «responder más tarde»: es diseñar el trabajo para que nadie quede bloqueado esperando. Exige escribir con más contexto del habitual, dejar por escrito la decisión y no sólo la conversación, y sustituir la reunión de estado por un documento actualizado. Los equipos que fracasan en remoto casi siempre fracasan aquí, no en la tecnología.",
      synonyms: ["comunicación asíncrona", "async", "trabajo no simultáneo"],
    },
    en: {
      term: "Asynchronous work",
      short:
        "Asynchronous work is a way of coordinating teams in which replies are not expected in real time. Each person advances within their own hours using written documentation, recorded decisions and clear deadlines instead of simultaneous meetings. It is what lets a team operate across incompatible time zones.",
      long:
        "Async is not «reply later»: it is designing work so nobody is blocked waiting. It requires writing with more context than usual, recording the decision rather than just the conversation, and replacing the status meeting with a document that stays current. Teams that fail at remote almost always fail here, not at the technology.",
      synonyms: ["async communication", "asynchronous collaboration"],
    },
  },
  {
    id: "solapamiento-horario",
    category: "modalidad",
    related: ["trabajo-asincrono", "onboarding-distribuido"],
    es: {
      term: "Solapamiento horario",
      aka: "Time zone overlap",
      short:
        "El solapamiento horario son las horas en las que dos personas de husos distintos coinciden en su jornada laboral. Las ofertas de empleo remoto internacional suelen exigir un mínimo, normalmente de dos a cuatro horas, y ese requisito decide de facto desde qué países se puede optar a un puesto.",
      long:
        "Es el filtro silencioso de las candidaturas internacionales. Una oferta que pide cuatro horas de solapamiento con la costa oeste de Estados Unidos excluye a media Europa sin decirlo. Leer bien ese requisito, y saber negociarlo o compensarlo con un plan de trabajo asíncrono, cambia por completo el mapa de vacantes al que puedes aspirar.",
      synonyms: ["overlap horario", "horas de solape", "franja común"],
    },
    en: {
      term: "Time zone overlap",
      short:
        "Time zone overlap is the number of hours during which two people in different zones share working time. International remote job posts usually require a minimum, typically two to four hours, and that requirement effectively decides which countries can apply for a given role.",
      long:
        "It is the silent filter on international applications. A post requiring four hours of overlap with the US west coast rules out half of Europe without saying so. Reading that requirement properly, and knowing how to negotiate it or offset it with an async working plan, completely changes the map of roles open to you.",
      synonyms: ["overlap hours", "shared hours", "core hours"],
    },
  },
  {
    id: "nomada-digital",
    category: "modalidad",
    related: ["visado-nomada-digital", "residencia-fiscal", "trabajo-remoto"],
    es: {
      term: "Nómada digital",
      short:
        "Un nómada digital es una persona que trabaja en remoto mientras cambia de país de residencia con cierta frecuencia. La etiqueta describe un estilo de vida, no una figura jurídica: a efectos legales y fiscales lo que cuenta es dónde tiene su residencia fiscal y con qué permiso de estancia se encuentra en cada país.",
      long:
        "El error clásico es tratar el nomadismo como un vacío legal en el que no se rinde cuentas a nadie. Ocurre lo contrario: al moverse se multiplican las jurisdicciones que pueden reclamarte. Cada país tiene su propio umbral de días, su tratamiento de las rentas del trabajo y sus reglas de entrada, y el desconocimiento no exime.",
      synonyms: ["digital nomad", "trabajador itinerante"],
    },
    en: {
      term: "Digital nomad",
      short:
        "A digital nomad is someone who works remotely while changing country of residence fairly often. The label describes a lifestyle, not a legal status: what counts legally and fiscally is where their tax residence sits and under which permit they are staying in each country.",
      long:
        "The classic mistake is treating nomadism as a legal vacuum where nobody is owed anything. The opposite is true: moving multiplies the jurisdictions that can claim you. Each country has its own day threshold, its own treatment of employment income and its own entry rules, and not knowing them is no defence.",
      synonyms: ["location independent", "itinerant worker"],
    },
  },
  {
    id: "employer-of-record",
    category: "legal",
    related: ["contractor-internacional", "establecimiento-permanente", "nomina-internacional"],
    es: {
      term: "Employer of Record",
      aka: "EOR",
      short:
        "Un Employer of Record es una empresa que contrata legalmente a un trabajador en su país en nombre de otra compañía extranjera. Asume la nómina, las cotizaciones y el cumplimiento laboral local, mientras el trabajo diario se dirige desde la empresa cliente. Permite contratar en un país sin abrir filial allí.",
      long:
        "Es la figura que ha desbloqueado la contratación remota internacional para empresas medianas. Sin EOR, contratar a alguien en otro país obliga a constituir una entidad local, algo desproporcionado para una o dos personas. Con EOR, el trabajador tiene contrato local con todos sus derechos y la empresa evita crear un establecimiento permanente por accidente.",
      synonyms: ["EOR", "empleador registrado", "empleador de registro"],
    },
    en: {
      term: "Employer of Record",
      aka: "EOR",
      short:
        "An Employer of Record is a company that legally employs a worker in their own country on behalf of another, foreign company. It takes on payroll, social contributions and local labour compliance, while day-to-day work is directed by the client company. It allows hiring in a country without opening a subsidiary there.",
      long:
        "This is the structure that unlocked international remote hiring for mid-sized companies. Without an EOR, employing someone abroad means incorporating a local entity, which is disproportionate for one or two people. With an EOR the worker gets a local contract with full rights, and the company avoids accidentally creating a permanent establishment.",
      synonyms: ["EOR", "registered employer", "global employment organisation"],
    },
  },
  {
    id: "contractor-internacional",
    category: "legal",
    related: ["employer-of-record", "facturacion-internacional", "falso-autonomo"],
    es: {
      term: "Contractor internacional",
      short:
        "Un contractor internacional es un profesional autónomo que presta servicios a una empresa de otro país y le factura, sin relación laboral. Asume él mismo sus impuestos, cotizaciones y vacaciones, y a cambio suele acceder a tarifas más altas y a más flexibilidad que un empleado equivalente.",
      long:
        "Es la vía de entrada más rápida al mercado remoto internacional, porque la empresa no necesita estructura en tu país. También es la más expuesta: sin indemnización, sin baja pagada y con la carga administrativa de tu lado. La diferencia entre un buen contrato de contractor y uno malo está en la cláusula de preaviso, la de propiedad intelectual y la de responsabilidad.",
      synonyms: ["freelance internacional", "autónomo internacional", "independent contractor"],
    },
    en: {
      term: "International contractor",
      short:
        "An international contractor is a self-employed professional who provides services to a company in another country and invoices for them, with no employment relationship. They handle their own taxes, contributions and time off, and in exchange usually command higher rates and more flexibility than an equivalent employee.",
      long:
        "It is the fastest route into the international remote market, because the company needs no structure in your country. It is also the most exposed: no severance, no paid sick leave, and the admin burden on your side. The difference between a good contractor agreement and a bad one lies in the notice, IP and liability clauses.",
      synonyms: ["independent contractor", "international freelancer", "1099 contractor"],
    },
  },
  {
    id: "falso-autonomo",
    category: "legal",
    related: ["contractor-internacional", "employer-of-record"],
    es: {
      term: "Falso autónomo",
      short:
        "Un falso autónomo es quien factura como profesional independiente pero trabaja en condiciones propias de un empleado: horario impuesto, medios de la empresa, exclusividad y dependencia jerárquica. Es una calificación de riesgo en la contratación remota internacional, porque la inspección atiende a los hechos y no a lo que diga el contrato.",
      long:
        "Los indicios que pesan son el control sobre el cómo y el cuándo, la integración en la estructura de la empresa y la ausencia de otros clientes. En la contratación transfronteriza el riesgo recae sobre las dos partes: la empresa puede afrontar una reclasificación con cotizaciones atrasadas, y el profesional puede perder la deducibilidad de sus gastos.",
      synonyms: ["misclassification", "reclasificación laboral", "dependencia encubierta"],
    },
    en: {
      term: "Worker misclassification",
      short:
        "Misclassification is invoicing as an independent professional while working under employee-like conditions: imposed hours, company equipment, exclusivity and hierarchical dependence. It is a live risk in international remote hiring, because inspectors look at the facts on the ground rather than at what the contract says.",
      long:
        "The indicators that weigh most are control over how and when the work happens, integration into the company's structure, and the absence of other clients. In cross-border hiring the risk falls on both sides: the company can face reclassification with back contributions, and the professional can lose the deductibility of their expenses.",
      synonyms: ["disguised employment", "false self-employment", "reclassification"],
    },
  },
  {
    id: "visado-nomada-digital",
    category: "legal",
    related: ["nomada-digital", "residencia-fiscal", "trabajo-remoto"],
    es: {
      term: "Visado de nómada digital",
      short:
        "Un visado de nómada digital es un permiso de residencia que algunos países conceden a quien trabaja en remoto para empresas o clientes de fuera de ese país. Suele exigir acreditar ingresos mínimos, seguro médico y antecedentes limpios, y a cambio permite residir legalmente durante uno o varios años.",
      long:
        "Es un permiso de residencia, no una exención fiscal, aunque algunos países lo acompañan de un régimen favorable durante los primeros años. Antes de solicitarlo conviene mirar tres cosas: el umbral de ingresos exigido, si permite o no trabajar para clientes locales, y cómo interactúa con las reglas de residencia fiscal de tu país de origen.",
      synonyms: ["digital nomad visa", "visado de teletrabajo", "permiso de trabajo remoto"],
    },
    en: {
      term: "Digital nomad visa",
      short:
        "A digital nomad visa is a residence permit some countries grant to people working remotely for companies or clients based outside that country. It usually requires proof of minimum income, health insurance and a clean record, and in return allows legal residence for one or several years.",
      long:
        "It is a residence permit, not a tax exemption, although some countries pair it with a favourable regime for the first years. Before applying, check three things: the income threshold required, whether it allows working for local clients, and how it interacts with the tax residence rules of your home country.",
      synonyms: ["remote work visa", "nomad permit"],
    },
  },
  {
    id: "residencia-fiscal",
    category: "fiscal",
    related: ["doble-imposicion", "regla-183-dias", "nomada-digital"],
    es: {
      term: "Residencia fiscal",
      short:
        "La residencia fiscal es el país que tiene derecho a gravar tu renta mundial. No la eliges declarándola: la determina cada legislación con criterios objetivos como los días de permanencia, dónde está tu centro de intereses económicos y dónde reside tu familia. Puedes ser residente fiscal en un país donde apenas pasas tiempo.",
      long:
        "Es el concepto que más disgustos da en el trabajo remoto internacional, porque se confunde con la nacionalidad o con el domicilio administrativo. Dos países pueden considerarte residente a la vez, y entonces se acude a las reglas de desempate del convenio de doble imposición: vivienda permanente, centro de intereses vitales, permanencia habitual y, en último término, nacionalidad.",
      synonyms: ["domicilio fiscal", "tax residency", "residencia tributaria"],
    },
    en: {
      term: "Tax residence",
      short:
        "Tax residence is the country entitled to tax your worldwide income. You do not choose it by declaring it: each jurisdiction determines it through objective tests such as days of presence, where your centre of economic interests lies and where your family lives. You can be tax resident somewhere you barely spend time.",
      long:
        "It causes more trouble than any other concept in international remote work, because it gets confused with nationality or administrative address. Two countries can consider you resident at once, in which case the tie-breaker rules of the double tax treaty apply: permanent home, centre of vital interests, habitual abode and, last, nationality.",
      synonyms: ["tax residency", "fiscal residence"],
    },
  },
  {
    id: "regla-183-dias",
    category: "fiscal",
    related: ["residencia-fiscal", "doble-imposicion"],
    es: {
      term: "Regla de los 183 días",
      short:
        "La regla de los 183 días establece que permanecer más de medio año natural en un país suele convertirte en residente fiscal allí. Es el criterio más conocido, pero no el único ni siempre el decisivo: muchos países te consideran residente también si tu centro de intereses económicos está en su territorio.",
      long:
        "Tratar los 183 días como una frontera segura es el error más caro del nomadismo mal informado. Los días se cuentan de forma distinta según el país, a veces incluyendo llegadas y salidas parciales, y el criterio de intereses económicos puede activarse mucho antes. Salir de un país tampoco basta: la mayoría exige acreditar residencia fiscal en otro.",
      synonyms: ["183 días", "regla de permanencia", "183-day rule"],
    },
    en: {
      term: "183-day rule",
      short:
        "The 183-day rule holds that staying more than half a calendar year in a country usually makes you tax resident there. It is the best-known test, but neither the only one nor always the decisive one: many countries also treat you as resident if your centre of economic interests sits in their territory.",
      long:
        "Treating 183 days as a safe boundary is the most expensive mistake in ill-informed nomadism. Days are counted differently by country, sometimes including partial arrivals and departures, and the economic-interests test can trigger far earlier. Leaving a country is not enough either: most require proof of tax residence somewhere else.",
      synonyms: ["day count test", "physical presence test"],
    },
  },
  {
    id: "doble-imposicion",
    category: "fiscal",
    related: ["residencia-fiscal", "regla-183-dias", "establecimiento-permanente"],
    es: {
      term: "Convenio de doble imposición",
      aka: "CDI",
      short:
        "Un convenio de doble imposición es un tratado entre dos países que reparte la potestad de gravar una misma renta para que no tribute dos veces. Determina qué país cobra primero, cuál debe aplicar deducción o exención, y ofrece reglas de desempate cuando ambos te consideran residente fiscal.",
      long:
        "Para quien trabaja en remoto para una empresa extranjera, el artículo relevante suele ser el de rentas del trabajo: como norma general tributan donde se ejerce físicamente el trabajo, que en remoto es tu país de residencia y no el de la empresa. Ese detalle es el que hace que muchas empresas exijan un EOR o un contrato de contractor.",
      synonyms: ["CDI", "tratado fiscal", "double taxation treaty"],
    },
    en: {
      term: "Double taxation treaty",
      aka: "DTT",
      short:
        "A double taxation treaty is an agreement between two countries that allocates the right to tax the same income so it is not taxed twice. It determines which country taxes first, which must grant relief or exemption, and provides tie-breaker rules when both consider you tax resident.",
      long:
        "For someone working remotely for a foreign company, the relevant article is usually the one on employment income: as a rule it is taxed where the work is physically performed, which in remote work is your country of residence, not the company's. That detail is why many companies insist on an EOR or a contractor agreement.",
      synonyms: ["DTA", "tax treaty", "double tax agreement"],
    },
  },
  {
    id: "establecimiento-permanente",
    category: "fiscal",
    related: ["employer-of-record", "doble-imposicion"],
    es: {
      term: "Establecimiento permanente",
      aka: "EP",
      short:
        "Un establecimiento permanente es la presencia estable de una empresa en un país distinto al suyo que obliga a tributar allí por los beneficios atribuibles a esa presencia. Puede activarse sin oficina: basta con que un trabajador cierre contratos habitualmente desde otro país en nombre de la compañía.",
      long:
        "Es el riesgo que más preocupa a los departamentos legales cuando alguien pide trabajar desde el extranjero. Un ingeniero suele ser inocuo; un comercial que negocia y firma desde otro país puede crear establecimiento permanente y arrastrar a la empresa a tributar allí. Por eso muchas políticas de trabajo desde cualquier lugar limitan días, países y funciones.",
      synonyms: ["EP", "permanent establishment", "presencia fiscal"],
    },
    en: {
      term: "Permanent establishment",
      aka: "PE",
      short:
        "A permanent establishment is a stable presence of a company in a country other than its own that triggers an obligation to pay tax there on the profits attributable to that presence. It can arise without an office: it is enough for an employee to habitually conclude contracts from another country on the company's behalf.",
      long:
        "It is the risk that worries legal departments most when someone asks to work from abroad. An engineer is usually harmless; a salesperson negotiating and signing from another country can create a permanent establishment and drag the company into taxation there. That is why many work-from-anywhere policies cap days, countries and functions.",
      synonyms: ["PE", "taxable presence"],
    },
  },
  {
    id: "facturacion-internacional",
    category: "fiscal",
    related: ["contractor-internacional", "multidivisa"],
    es: {
      term: "Facturación internacional",
      short:
        "La facturación internacional es la emisión de facturas a clientes situados en otro país, con las reglas de impuestos indirectos que correspondan según dónde esté el cliente y si es empresa o consumidor. Determina si repercutes impuesto, si se invierte el sujeto pasivo o si la operación queda fuera de ámbito.",
      long:
        "El punto que más se falla es asumir que facturar fuera significa facturar sin impuestos. Depende del tipo de cliente y del lugar de prestación: entre empresas de distintos países suele aplicarse la inversión del sujeto pasivo, mientras que a consumidores finales pueden exigirse registros específicos. Emitir mal la factura complica después la deducción de gastos.",
      synonyms: ["facturar al extranjero", "cross-border invoicing"],
    },
    en: {
      term: "Cross-border invoicing",
      short:
        "Cross-border invoicing is issuing invoices to clients located in another country, applying whichever indirect tax rules fit depending on where the client sits and whether they are a business or a consumer. It determines whether you charge tax, whether the reverse charge applies, or whether the transaction is out of scope.",
      long:
        "The most common failure is assuming that invoicing abroad means invoicing without tax. It depends on the type of client and the place of supply: between businesses in different countries the reverse charge usually applies, whereas selling to final consumers can require specific registrations. Getting the invoice wrong complicates deducting expenses later.",
      synonyms: ["international invoicing", "foreign invoicing"],
    },
  },
  {
    id: "multidivisa",
    category: "fiscal",
    related: ["facturacion-internacional", "compensacion-global"],
    es: {
      term: "Cuenta multidivisa",
      short:
        "Una cuenta multidivisa permite recibir, mantener y convertir dinero en varias monedas dentro de la misma cuenta, con datos bancarios locales en distintos países. Evita que cada cobro internacional pase por una conversión con margen oculto, que es donde se pierde buena parte del ingreso al facturar fuera.",
      long:
        "Para quien cobra en dólares y gasta en euros, la diferencia entre una conversión al tipo real y una con margen bancario puede llegar al tres o cuatro por ciento de la facturación anual. Tener datos bancarios locales además elimina la fricción del cliente, que muchas veces prefiere no lidiar con transferencias internacionales.",
      synonyms: ["cuenta en varias divisas", "multi-currency account"],
    },
    en: {
      term: "Multi-currency account",
      short:
        "A multi-currency account lets you receive, hold and convert money in several currencies within the same account, with local banking details in different countries. It avoids every international payment going through a conversion with a hidden margin, which is where much of the income is lost when invoicing abroad.",
      long:
        "For someone billing in dollars and spending in euros, the gap between a real exchange rate and a bank margin can reach three or four per cent of annual revenue. Holding local banking details also removes friction for the client, who often prefers not to deal with international transfers.",
      synonyms: ["multi-currency wallet", "borderless account"],
    },
  },
  {
    id: "ats",
    category: "empleo",
    related: ["job-hacking", "portfolio-internacional", "cv-internacional"],
    es: {
      term: "ATS",
      aka: "Applicant Tracking System",
      short:
        "Un ATS es el software que las empresas usan para recibir, filtrar y ordenar candidaturas. Analiza el currículum, extrae campos estructurados y permite descartar o priorizar según criterios definidos por el reclutador. En procesos remotos internacionales, con cientos de candidaturas por vacante, casi nadie llega a un humano sin pasar por él.",
      long:
        "El mito de que el ATS «rechaza automáticamente» es exagerado: en la mayoría de configuraciones ordena y filtra, no descarta solo. Lo que sí hace es leer mal los formatos creativos, las tablas y los currículums en columnas. Un documento limpio, con encabezados estándar y el vocabulario exacto de la oferta, es lo que sobrevive al filtro.",
      synonyms: ["sistema de seguimiento de candidatos", "filtro de currículums"],
    },
    en: {
      term: "ATS",
      aka: "Applicant Tracking System",
      short:
        "An ATS is the software companies use to receive, filter and rank applications. It parses the CV, extracts structured fields and lets recruiters discard or prioritise against defined criteria. In international remote processes, with hundreds of applicants per opening, almost nobody reaches a human without passing through one.",
      long:
        "The myth that an ATS «auto-rejects» is overstated: in most configurations it ranks and filters rather than discarding on its own. What it genuinely does badly is read creative layouts, tables and multi-column CVs. A clean document with standard headings and the exact vocabulary of the job post is what survives the filter.",
      synonyms: ["applicant tracking", "CV parser", "recruitment software"],
    },
  },
  {
    id: "job-hacking",
    category: "empleo",
    related: ["ats", "portfolio-internacional", "solapamiento-horario"],
    es: {
      term: "Job hacking",
      short:
        "El job hacking es el conjunto de tácticas para encontrar y acceder a vacantes remotas antes de que se saturen o sin que lleguen a publicarse. Combina rastreo de fuentes poco explotadas, contacto directo con quien decide la contratación y una candidatura adaptada a cada oferta en lugar de un envío masivo.",
      long:
        "Parte de una constatación incómoda: en las vacantes remotas internacionales la competencia no es local, es global, y el orden de llegada pesa tanto como el perfil. Las primeras cuarenta y ocho horas de una publicación concentran una parte enorme de las candidaturas que se leen con atención. Todo lo demás compite contra el cansancio del reclutador.",
      synonyms: ["búsqueda proactiva de empleo", "hidden job market"],
    },
    en: {
      term: "Job hacking",
      short:
        "Job hacking is the set of tactics for finding and reaching remote openings before they saturate, or before they are published at all. It combines scanning under-used sources, contacting the person who actually decides the hire, and tailoring each application rather than sending the same one everywhere.",
      long:
        "It starts from an uncomfortable fact: in international remote openings the competition is not local but global, and arrival order weighs as much as the profile. The first forty-eight hours of a posting absorb a huge share of the applications that get read carefully. Everything after that competes against recruiter fatigue.",
      synonyms: ["proactive job search", "hidden job market"],
    },
  },
  {
    id: "cv-internacional",
    category: "empleo",
    related: ["ats", "portfolio-internacional", "compensacion-global"],
    es: {
      term: "Currículum internacional",
      short:
        "Un currículum internacional es el que se ajusta a las convenciones del mercado al que aspiras, no al del país donde vives. En la mayoría de procesos remotos anglosajones eso significa sin foto, sin fecha de nacimiento, sin estado civil, en una sola columna y con logros cuantificados en lugar de funciones enumeradas.",
      long:
        "Incluir foto y datos personales, habitual en España y en buena parte de Latinoamérica, se percibe en el mercado anglosajón como un riesgo de sesgo y algunas empresas descartan por política. El otro cambio de fondo es pasar de describir responsabilidades a demostrar resultados con cifras, plazos y contexto.",
      synonyms: ["CV internacional", "resume", "currículum en inglés"],
    },
    en: {
      term: "International resume",
      short:
        "An international resume follows the conventions of the market you are targeting, not of the country you live in. In most English-speaking remote processes that means no photo, no date of birth, no marital status, single column, and quantified achievements rather than a list of duties.",
      long:
        "Including a photo and personal details, standard in Spain and much of Latin America, reads in English-speaking markets as a bias risk, and some companies discard such applications by policy. The other substantive change is moving from describing responsibilities to demonstrating results with figures, timeframes and context.",
      synonyms: ["resume", "international CV", "English CV"],
    },
  },
  {
    id: "portfolio-internacional",
    category: "empleo",
    related: ["cv-internacional", "marca-personal", "job-hacking"],
    es: {
      term: "Portfolio internacional",
      short:
        "Un portfolio internacional es la muestra pública de trabajo que permite a un reclutador de otro país evaluarte sin conocer tus empresas anteriores. Sustituye la reputación local, que no viaja, por evidencia verificable: proyectos explicados con su contexto, tu papel concreto y el resultado medible que produjeron.",
      long:
        "Cuando alguien contrata desde otro continente no puede llamar a tu antiguo jefe ni sabe si tu antigua empresa era grande o pequeña. El portfolio cubre ese vacío. Funciona mejor con pocos casos bien explicados que con muchos enlaces sueltos: problema, restricción, decisión que tomaste y qué cambió después.",
      synonyms: ["portafolio profesional", "work portfolio", "muestra de trabajo"],
    },
    en: {
      term: "International portfolio",
      short:
        "An international portfolio is the public body of work that lets a recruiter abroad assess you without knowing your previous employers. It replaces local reputation, which does not travel, with verifiable evidence: projects explained with their context, your specific role and the measurable result they produced.",
      long:
        "Someone hiring from another continent cannot call your old manager and has no idea whether your former employer was large or small. The portfolio fills that gap. It works better with a few well-explained cases than with many loose links: problem, constraint, the decision you made and what changed afterwards.",
      synonyms: ["work portfolio", "case portfolio", "proof of work"],
    },
  },
  {
    id: "marca-personal",
    category: "empleo",
    related: ["portfolio-internacional", "job-hacking"],
    es: {
      term: "Marca personal",
      short:
        "La marca personal es la percepción que se forma alguien sobre tu criterio profesional antes de hablar contigo. En la contratación remota internacional funciona como sustituto de la red de contactos local: si un reclutador de otro país puede leerte y entender cómo piensas, deja de ser un desconocido que arriesga.",
      long:
        "No consiste en publicar constantemente. Consiste en que exista un rastro coherente y localizable de tu criterio en un ámbito concreto. Para un perfil técnico, un puñado de artículos o intervenciones bien argumentadas rinde más que un año de publicaciones genéricas, porque lo que se evalúa es el juicio, no la constancia.",
      synonyms: ["personal branding", "reputación profesional"],
    },
    en: {
      term: "Personal brand",
      short:
        "A personal brand is the impression someone forms of your professional judgement before ever speaking to you. In international remote hiring it substitutes for a local network: if a recruiter abroad can read you and understand how you think, you stop being an unknown who represents risk.",
      long:
        "It is not about posting constantly. It is about there being a coherent, findable trail of your judgement in a specific area. For a technical profile, a handful of well-argued articles or talks outperforms a year of generic posting, because what is being assessed is judgement, not consistency.",
      synonyms: ["personal branding", "professional reputation"],
    },
  },
  {
    id: "compensacion-global",
    category: "empleo",
    related: ["geo-pay", "rol-fraccional", "multidivisa"],
    es: {
      term: "Compensación global",
      short:
        "La compensación global es el paquete retributivo completo de un puesto remoto internacional: salario base, variable, participación en la empresa, presupuesto de formación y de equipo, días de descanso y cobertura médica. Comparar únicamente el salario base entre países lleva a conclusiones erróneas casi siempre.",
      long:
        "Dos ofertas con el mismo bruto pueden diferir en un treinta por ciento de valor real según cómo tributen, qué cotizaciones incluyan y qué cubra la empresa. Antes de negociar conviene traducir cada componente a una cifra anual neta comparable, incluido lo que en tu país tendrías que pagarte por tu cuenta.",
      synonyms: ["paquete retributivo", "total compensation", "compensación total"],
    },
    en: {
      term: "Total compensation",
      short:
        "Total compensation is the complete package of an international remote role: base salary, variable pay, equity, learning and equipment budgets, time off and health cover. Comparing base salary alone across countries leads to the wrong conclusion almost every time.",
      long:
        "Two offers with the same gross figure can differ by thirty per cent in real value depending on how they are taxed, which contributions they include and what the company covers. Before negotiating, translate each component into a comparable annual net figure, including what you would otherwise have to fund yourself.",
      synonyms: ["total comp", "compensation package", "global compensation"],
    },
  },
  {
    id: "geo-pay",
    category: "empleo",
    related: ["compensacion-global", "trabajo-remoto"],
    es: {
      term: "Salario ajustado por ubicación",
      aka: "Geo-pay",
      short:
        "El salario ajustado por ubicación es la práctica de fijar la retribución de un puesto remoto según el coste de vida del país donde reside la persona, y no según el valor del trabajo. Una misma función puede pagarse de forma muy distinta a dos personas del mismo equipo.",
      long:
        "Es uno de los puntos de negociación más relevantes y menos discutidos. Algunas empresas pagan por mercado del puesto y otras por ubicación de la persona, y esa política suele estar escrita antes de que llegues. Saber en cuál de los dos modelos está la empresa cambia por completo el argumento con el que se negocia.",
      synonyms: ["geo-pay", "location-based pay", "banda salarial por país"],
    },
    en: {
      term: "Location-based pay",
      aka: "Geo-pay",
      short:
        "Location-based pay is the practice of setting a remote role's salary according to the cost of living where the person lives rather than the value of the work. The same function can be paid very differently to two people on the same team.",
      long:
        "It is one of the most consequential and least discussed negotiation points. Some companies pay for the role's market and others for the person's location, and that policy is usually written before you arrive. Knowing which of the two models a company runs completely changes the argument you negotiate with.",
      synonyms: ["geo-pay", "geographic pay differential", "location adjustment"],
    },
  },
  {
    id: "rol-fraccional",
    category: "empleo",
    related: ["contractor-internacional", "compensacion-global", "negocio-borderless"],
    es: {
      term: "Rol fraccional",
      short:
        "Un rol fraccional es un puesto de responsabilidad ejercido a tiempo parcial para varias empresas a la vez, normalmente en dirección o en áreas especializadas. Permite a compañías pequeñas acceder a experiencia senior que no podrían contratar a jornada completa, y al profesional diversificar ingresos y riesgo.",
      long:
        "Es la evolución natural de la consultoría para perfiles con recorrido: en lugar de vender horas sueltas, se ocupa una silla concreta durante uno o dos días a la semana con responsabilidad sobre resultados. La clave está en limitar el número de clientes simultáneos y en dejar por escrito el alcance, que tiende a expandirse solo.",
      synonyms: ["fractional", "dirección fraccional", "part-time executive"],
    },
    en: {
      term: "Fractional role",
      short:
        "A fractional role is a senior position held part-time for several companies at once, typically in leadership or specialised functions. It gives small companies access to senior experience they could not hire full-time, and gives the professional diversified income and risk.",
      long:
        "It is the natural evolution of consulting for experienced profiles: instead of selling loose hours, you occupy a defined seat one or two days a week with accountability for outcomes. The key is capping the number of simultaneous clients and putting the scope in writing, since it tends to expand on its own.",
      synonyms: ["fractional executive", "part-time leadership"],
    },
  },
  {
    id: "negocio-borderless",
    category: "negocio",
    related: ["solopreneur", "oferta-productizada", "sop"],
    es: {
      term: "Negocio borderless",
      short:
        "Un negocio borderless es aquel cuya operación, clientes y proveedores no dependen de un territorio concreto. Vende servicios o productos digitales, cobra en varias divisas y puede seguir funcionando si su responsable cambia de país. La ubicación deja de ser una restricción del modelo de negocio.",
      long:
        "No es lo mismo que un negocio online. Un comercio electrónico con almacén propio está anclado a un territorio; una consultoría con procesos documentados y cobro internacional no lo está. Lo que hace borderless a un negocio es que sus tres dependencias críticas —entrega, cobro y captación— sean independientes de dónde estés.",
      synonyms: ["negocio sin fronteras", "borderless business", "negocio global"],
    },
    en: {
      term: "Borderless business",
      short:
        "A borderless business is one whose operations, clients and suppliers do not depend on a specific territory. It sells digital services or products, collects payment in several currencies, and keeps running if its owner changes country. Location stops being a constraint on the business model.",
      long:
        "It is not the same as an online business. An e-commerce operation with its own warehouse is anchored to a territory; a consultancy with documented processes and international payment collection is not. What makes a business borderless is that its three critical dependencies — delivery, payment and acquisition — are independent of where you are.",
      synonyms: ["location-independent business", "global business"],
    },
  },
  {
    id: "solopreneur",
    category: "negocio",
    related: ["negocio-borderless", "oferta-productizada", "automatizacion-no-code"],
    es: {
      term: "Solopreneur",
      short:
        "Un solopreneur es quien dirige un negocio sin empleados, apoyándose en automatización, herramientas y colaboradores externos puntuales. Se diferencia del freelance en que vende un servicio o producto sistematizado en lugar de su tiempo, de modo que los ingresos no crecen sólo añadiendo horas.",
      long:
        "El límite del modelo es siempre el mismo: la persona. Por eso la palanca no es trabajar más, sino reducir lo que sólo puede hacer ella. Documentar procesos, automatizar lo repetitivo y delegar lo delegable es lo que separa a un solopreneur con margen de un autónomo con la agenda llena y sin capacidad de crecer.",
      synonyms: ["emprendedor individual", "one-person business"],
    },
    en: {
      term: "Solopreneur",
      short:
        "A solopreneur runs a business with no employees, leaning on automation, tooling and occasional external collaborators. They differ from freelancers in selling a systematised service or product rather than their time, so income does not grow only by adding hours.",
      long:
        "The model's ceiling is always the same: the person. So the lever is not working more but shrinking what only they can do. Documenting processes, automating the repetitive and delegating the delegable is what separates a solopreneur with margin from a freelancer with a full calendar and no room to grow.",
      synonyms: ["one-person business", "independent operator"],
    },
  },
  {
    id: "oferta-productizada",
    category: "negocio",
    related: ["solopreneur", "negocio-borderless", "sop"],
    es: {
      term: "Oferta productizada",
      short:
        "Una oferta productizada es un servicio vendido con alcance cerrado, plazo definido y precio fijo, como si fuera un producto. Elimina la negociación caso por caso y el presupuesto a medida, lo que acorta el ciclo de venta y hace predecible tanto la entrega como el margen.",
      long:
        "Convertir un servicio en producto obliga a decidir qué no se incluye, que es justamente lo que evita el desbordamiento del alcance. El efecto secundario más valioso es que permite mejorar el proceso de entrega repetición tras repetición, algo imposible cuando cada proyecto se diseña desde cero.",
      synonyms: ["servicio productizado", "productized service", "servicio empaquetado"],
    },
    en: {
      term: "Productised offer",
      short:
        "A productised offer is a service sold with fixed scope, defined timeline and fixed price, as if it were a product. It removes case-by-case negotiation and bespoke quoting, which shortens the sales cycle and makes both delivery and margin predictable.",
      long:
        "Turning a service into a product forces you to decide what is excluded, which is precisely what prevents scope creep. The most valuable side effect is that it lets you improve the delivery process repetition after repetition, something impossible when every project is designed from scratch.",
      synonyms: ["productized service", "packaged service", "fixed-scope offer"],
    },
  },
  {
    id: "sop",
    category: "negocio",
    related: ["documentacion-asincrona", "automatizacion-no-code", "oferta-productizada"],
    es: {
      term: "SOP",
      aka: "Standard Operating Procedure",
      short:
        "Un SOP es la descripción escrita y paso a paso de cómo se ejecuta una tarea recurrente en un negocio. Permite que otra persona, o una automatización, produzca el mismo resultado sin depender de quien lo hacía habitualmente. Es la unidad básica de un negocio que puede delegarse.",
      long:
        "Un SOP útil se escribe mientras se ejecuta la tarea, no después de memoria, e incluye lo que suele fallar y cómo se decide en los casos ambiguos. La prueba de si funciona es sencilla: si alguien externo lo sigue y obtiene el mismo resultado sin preguntar nada, está bien escrito.",
      synonyms: ["procedimiento operativo", "manual de proceso", "playbook"],
    },
    en: {
      term: "SOP",
      aka: "Standard Operating Procedure",
      short:
        "An SOP is the written, step-by-step description of how a recurring task is carried out in a business. It lets another person, or an automation, produce the same result without depending on whoever usually did it. It is the basic unit of a business that can be delegated.",
      long:
        "A useful SOP is written while performing the task, not afterwards from memory, and includes what typically goes wrong and how ambiguous cases are decided. The test is simple: if an outsider follows it and gets the same result without asking anything, it is well written.",
      synonyms: ["operating procedure", "process documentation", "playbook"],
    },
  },
  {
    id: "documentacion-asincrona",
    category: "stack",
    related: ["trabajo-asincrono", "sop", "onboarding-distribuido"],
    es: {
      term: "Documentación asíncrona",
      short:
        "La documentación asíncrona es el conjunto de textos que permiten a un equipo distribuido decidir y avanzar sin coincidir en el tiempo. Recoge la decisión y su razonamiento, no sólo la conclusión, para que alguien que llegue meses después entienda por qué se hizo así.",
      long:
        "Su función real es evitar reuniones, no acompañarlas. Un documento de decisión bien escrito incluye el contexto, las alternativas descartadas y el motivo del descarte. Sin eso, los equipos repiten las mismas discusiones cada pocos meses porque nadie recuerda qué se probó ya.",
      synonyms: ["documentación interna", "async documentation", "base de conocimiento"],
    },
    en: {
      term: "Async documentation",
      short:
        "Async documentation is the body of writing that lets a distributed team decide and progress without overlapping in time. It captures the decision and the reasoning behind it, not just the conclusion, so someone arriving months later understands why it was done that way.",
      long:
        "Its real function is to avoid meetings, not to accompany them. A well-written decision document includes the context, the alternatives rejected and why they were rejected. Without that, teams rerun the same debates every few months because nobody remembers what was already tried.",
      synonyms: ["internal documentation", "knowledge base", "decision log"],
    },
  },
  {
    id: "automatizacion-no-code",
    category: "stack",
    related: ["agente-ia", "sop", "solopreneur"],
    es: {
      term: "Automatización no-code",
      short:
        "La automatización no-code consiste en conectar aplicaciones entre sí mediante flujos visuales, sin escribir código. Permite que una acción en una herramienta dispare tareas en otras: un formulario enviado crea una ficha, avisa al equipo y programa un recordatorio sin intervención humana.",
      long:
        "Su valor no está en la tecnología sino en qué se automatiza. Automatizar un proceso mal definido lo único que consigue es equivocarse más rápido y a mayor escala. El orden correcto es documentar el proceso, ejecutarlo a mano hasta que sea estable y sólo entonces automatizar los pasos que no requieren criterio.",
      synonyms: ["automatización sin código", "no-code automation", "flujos automatizados"],
    },
    en: {
      term: "No-code automation",
      short:
        "No-code automation means connecting applications through visual workflows without writing code. It lets an action in one tool trigger tasks in others: a submitted form creates a record, notifies the team and schedules a reminder with no human involvement.",
      long:
        "Its value lies not in the technology but in what gets automated. Automating a poorly defined process only makes you wrong faster and at greater scale. The right order is to document the process, run it by hand until it is stable, and only then automate the steps that require no judgement.",
      synonyms: ["no-code workflows", "workflow automation"],
    },
  },
  {
    id: "agente-ia",
    category: "stack",
    related: ["automatizacion-no-code", "prompt-engineering", "stack-remoto"],
    es: {
      term: "Agente de IA",
      short:
        "Un agente de IA es un sistema basado en modelos de lenguaje que ejecuta una tarea de varios pasos con autonomía: decide qué hacer, usa herramientas externas y encadena acciones hasta alcanzar un objetivo. Se diferencia de un chat en que actúa sobre sistemas reales, no sólo genera texto.",
      long:
        "En un negocio pequeño su uso más rentable no es el más espectacular: revisar entradas, clasificar correo, preparar borradores y consolidar información dispersa. Todo agente necesita límites explícitos sobre qué puede tocar y un punto de revisión humana antes de cualquier acción irreversible.",
      synonyms: ["AI agent", "agente autónomo", "asistente de IA"],
    },
    en: {
      term: "AI agent",
      short:
        "An AI agent is a system built on language models that carries out a multi-step task autonomously: it decides what to do, uses external tools and chains actions until it reaches a goal. It differs from a chatbot in acting on real systems rather than only producing text.",
      long:
        "In a small business the most profitable use is not the most spectacular one: triaging inputs, classifying mail, preparing drafts and consolidating scattered information. Every agent needs explicit limits on what it may touch and a human review point before any irreversible action.",
      synonyms: ["autonomous agent", "AI assistant"],
    },
  },
  {
    id: "prompt-engineering",
    category: "stack",
    related: ["agente-ia", "automatizacion-no-code"],
    es: {
      term: "Prompt engineering",
      short:
        "El prompt engineering es la práctica de formular instrucciones a un modelo de lenguaje para obtener resultados fiables y repetibles. Consiste en aportar contexto suficiente, definir el formato de salida y acotar el criterio, de modo que el mismo encargo produzca una calidad constante y no depender del azar.",
      long:
        "En un flujo de trabajo profesional lo relevante no es el prompt ingenioso sino el reutilizable. Un buen encargo especifica el papel, el material de partida, las restricciones, el formato y qué hacer ante la ambigüedad. Esa es la diferencia entre una herramienta de la que te puedes fiar y una que hay que revisar entera cada vez.",
      synonyms: ["ingeniería de prompts", "diseño de instrucciones"],
    },
    en: {
      term: "Prompt engineering",
      short:
        "Prompt engineering is the practice of framing instructions to a language model so results are reliable and repeatable. It means supplying enough context, defining the output format and bounding the criteria, so the same request produces consistent quality rather than depending on luck.",
      long:
        "In a professional workflow what matters is not the clever prompt but the reusable one. A good request specifies the role, the source material, the constraints, the format and what to do when something is ambiguous. That is the difference between a tool you can trust and one you must re-check in full every time.",
      synonyms: ["prompt design", "instruction design"],
    },
  },
  {
    id: "stack-remoto",
    category: "stack",
    related: ["automatizacion-no-code", "documentacion-asincrona", "agente-ia"],
    es: {
      term: "Stack remoto",
      short:
        "Un stack remoto es el conjunto de herramientas que sostiene el trabajo de una persona o equipo distribuido: comunicación, documentación, gestión de tareas, almacenamiento, cobros y automatización. Lo define no la lista de aplicaciones sino cómo encajan entre sí y quién hace qué en cada una.",
      long:
        "El fallo habitual es acumular herramientas que se solapan hasta que nadie sabe dónde está la información. Un stack sano tiene una única fuente de verdad por tipo de dato y reglas explícitas sobre qué se habla en cada canal. Menos herramientas bien conectadas rinden más que muchas a medio usar.",
      synonyms: ["stack de trabajo remoto", "herramientas remotas", "remote stack"],
    },
    en: {
      term: "Remote stack",
      short:
        "A remote stack is the set of tools underpinning a distributed person or team: communication, documentation, task management, storage, payments and automation. It is defined not by the list of applications but by how they fit together and who does what in each.",
      long:
        "The usual failure is accumulating overlapping tools until nobody knows where information lives. A healthy stack has a single source of truth per data type and explicit rules about what gets discussed in which channel. Fewer, well-connected tools outperform many half-used ones.",
      synonyms: ["remote work stack", "distributed tooling"],
    },
  },
  {
    id: "onboarding-distribuido",
    category: "modalidad",
    related: ["documentacion-asincrona", "trabajo-asincrono", "solapamiento-horario"],
    es: {
      term: "Onboarding distribuido",
      short:
        "El onboarding distribuido es el proceso de incorporación a un equipo remoto, donde nadie aprende por ósmosis ni preguntando al de al lado. Se apoya en documentación de entrada, objetivos explícitos para los primeros noventa días y una persona asignada como referencia para las dudas.",
      long:
        "Es donde se decide buena parte del éxito en un puesto remoto. Sin pasillo ni cafetería, la información que en presencial se absorbe sola aquí hay que buscarla activamente. Los primeros noventa días funcionan mejor con entregas pequeñas y visibles que con un periodo largo de observación silenciosa.",
      synonyms: ["incorporación remota", "remote onboarding", "primeros 90 días"],
    },
    en: {
      term: "Distributed onboarding",
      short:
        "Distributed onboarding is the process of joining a remote team, where nobody learns by osmosis or by asking the person at the next desk. It relies on entry documentation, explicit goals for the first ninety days and a named person to bring questions to.",
      long:
        "Much of your success in a remote role is decided here. With no corridor or coffee machine, the information absorbed effortlessly in an office must be actively sought. The first ninety days work better with small, visible deliveries than with a long period of silent observation.",
      synonyms: ["remote onboarding", "first 90 days"],
    },
  },
  {
    id: "burnout-remoto",
    category: "modalidad",
    related: ["trabajo-asincrono", "solapamiento-horario", "onboarding-distribuido"],
    es: {
      term: "Burnout remoto",
      short:
        "El burnout remoto es el agotamiento derivado de trabajar a distancia sin límites claros entre jornada y vida personal. Se agrava cuando el equipo está repartido en husos horarios y la disponibilidad se estira para cubrirlos todos, de modo que la jornada nunca termina del todo.",
      long:
        "Sus señales tempranas no son el cansancio sino la pérdida de criterio y la dificultad para empezar tareas. El factor de riesgo más subestimado es el solapamiento horario excesivo: aceptar reuniones a cualquier hora para «no ser el difícil» fragmenta el día hasta que no queda ningún bloque de trabajo profundo.",
      synonyms: ["agotamiento remoto", "remote burnout", "fatiga por teletrabajo"],
    },
    en: {
      term: "Remote burnout",
      short:
        "Remote burnout is the exhaustion that comes from working at a distance without clear boundaries between the working day and personal life. It worsens when the team spans time zones and availability stretches to cover them all, so the day never quite ends.",
      long:
        "Its early signs are not tiredness but loss of judgement and difficulty starting tasks. The most underestimated risk factor is excessive time zone overlap: accepting meetings at any hour so as not to be «the difficult one» fragments the day until no block of deep work survives.",
      synonyms: ["remote work burnout", "telework fatigue"],
    },
  },
  {
    id: "nomina-internacional",
    category: "legal",
    related: ["employer-of-record", "compensacion-global", "multidivisa"],
    es: {
      term: "Nómina internacional",
      short:
        "La nómina internacional es el pago periódico de salarios a personas empleadas en países distintos al de la empresa, con las retenciones y cotizaciones de cada jurisdicción. Requiere una entidad local o un Employer of Record que actúe como empleador legal en el país del trabajador.",
      long:
        "Pagar a alguien en otro país no es transferir dinero: es aplicar correctamente el impuesto retenido, las cotizaciones sociales y las obligaciones de información de ese país. Cuando una empresa propone pagar a un empleado extranjero por transferencia sin estructura local, normalmente está trasladando el riesgo al trabajador.",
      synonyms: ["global payroll", "nómina global", "pago internacional de salarios"],
    },
    en: {
      term: "International payroll",
      short:
        "International payroll is the periodic payment of salaries to people employed in countries other than the company's, with each jurisdiction's withholdings and contributions. It requires a local entity or an Employer of Record acting as the legal employer in the worker's country.",
      long:
        "Paying someone abroad is not a money transfer: it is correctly applying that country's withholding tax, social contributions and reporting duties. When a company proposes paying a foreign employee by bank transfer with no local structure, it is usually shifting the risk onto the worker.",
      synonyms: ["global payroll", "cross-border payroll"],
    },
  },
];

export const TERM_CATEGORY_LABEL: Record<Locale, Record<TermCategory, string>> = {
  es: {
    modalidad: "Modalidad de trabajo",
    legal: "Contratación y legal",
    fiscal: "Fiscalidad y movilidad",
    empleo: "Empleabilidad",
    negocio: "Negocio remoto",
    stack: "Herramientas y método",
  },
  en: {
    modalidad: "Ways of working",
    legal: "Hiring and legal",
    fiscal: "Tax and mobility",
    empleo: "Employability",
    negocio: "Remote business",
    stack: "Tools and method",
  },
};

export const TERM_CATEGORIES: readonly TermCategory[] = [
  "modalidad",
  "legal",
  "fiscal",
  "empleo",
  "negocio",
  "stack",
];

export function getTerm(id: string): Term | undefined {
  return TERMS.find((t) => t.id === id);
}

// ── Copy de la sección y de las páginas del glosario ─────
export const glossaryCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  all: string;
  seeAll: string;
  seeTerm: string;
  hubTitle: string;
  hubLead: string;
  hubMeta: string;
  relatedLabel: string;
  synonymsLabel: string;
  backToHub: string;
  inProgram: string;
  countLabel: (n: number) => string;
}> = {
  es: {
    eyebrow: "Diccionario",
    title: "El vocabulario que se da por sabido.",
    lead: "Employer of Record, residencia fiscal, solapamiento horario, oferta productizada. Los términos que aparecen en cualquier proceso remoto internacional, explicados en dos líneas.",
    all: "Todos",
    seeAll: "Ver el diccionario completo",
    seeTerm: "Leer la definición completa",
    hubTitle: "Diccionario del trabajo remoto internacional",
    hubLead:
      "Definiciones claras de los términos que decidan si entiendes o no una oferta remota internacional, un contrato de contractor o una obligación fiscal. Cada entrada responde primero y explica después.",
    hubMeta:
      "Diccionario de trabajo remoto internacional: employer of record, residencia fiscal, visado de nómada digital, ATS, compensación global y más de 30 términos explicados.",
    relatedLabel: "Términos relacionados",
    synonymsLabel: "También se le llama",
    backToHub: "Volver al diccionario",
    inProgram: "Este término se trabaja en el programa",
    countLabel: (n) => `${n} términos`,
  },
  en: {
    eyebrow: "Dictionary",
    title: "The vocabulary everyone assumes you know.",
    lead: "Employer of Record, tax residence, time zone overlap, productised offer. The terms that come up in every international remote process, explained in two lines.",
    all: "All",
    seeAll: "See the full dictionary",
    seeTerm: "Read the full definition",
    hubTitle: "Dictionary of international remote work",
    hubLead:
      "Clear definitions of the terms that decide whether you understand an international remote job post, a contractor agreement or a tax obligation. Every entry answers first and explains afterwards.",
    hubMeta:
      "Dictionary of international remote work: employer of record, tax residence, digital nomad visa, ATS, total compensation and 30+ terms explained.",
    relatedLabel: "Related terms",
    synonymsLabel: "Also called",
    backToHub: "Back to the dictionary",
    inProgram: "This term is covered in the program",
    countLabel: (n) => `${n} terms`,
  },
};
