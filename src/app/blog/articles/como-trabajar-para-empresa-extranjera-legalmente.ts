import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "como-trabajar-para-empresa-extranjera-legalmente",
  locale: "es",
  cluster: "legal",
  funnel: "mofu",
  intent: "informacional",
  keyword: "cómo trabajar para una empresa extranjera legalmente",
  secondary: [
    "contrato para trabajar en remoto para empresa extranjera",
    "employer of record España",
    "ser contractor de una empresa extranjera",
    "falso autónomo empresa extranjera",
    "nómina internacional",
    "establecimiento permanente teletrabajo",
  ],
  title: "Cómo trabajar para una empresa extranjera sin meterte en un lío legal",
  h1: "Cómo trabajar para una empresa extranjera sin meterte en un lío legal",
  metaTitle: "Trabajar para una empresa extranjera: contrato y figura legal",
  metaDescription:
    "Las tres formas de contratar a alguien que reside en otro país: filial, Employer of Record y contractor. Qué cambia en derechos, impuestos y riesgo, y cómo detectar un acuerdo que no se sostiene.",
  ogTitle: "Trabajar para una empresa extranjera: qué figura te conviene",
  ogDescription:
    "Filial, Employer of Record o contractor. Comparativa honesta de las tres vías, con los riesgos que nadie te cuenta en la entrevista.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 12,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["employer-of-record", "contractor-internacional", "falso-autonomo", "nomina-internacional", "establecimiento-permanente"],
  related: ["trabajo-remoto-internacional-desde-espana", "residencia-fiscal-nomada-digital", "cobrar-clientes-extranjero"],
  external: [
    { label: "Seguridad Social · Trabajo transfronterizo y teletrabajo", url: "https://www.seg-social.es" },
    { label: "Comisión Europea · Derechos laborales en la UE", url: "https://europa.eu/youreurope/citizens/work/index_es.htm" },
    { label: "OIT · Convenio sobre relación de trabajo", url: "https://www.ilo.org" },
    { label: "Agencia Tributaria · Obligaciones de los profesionales", url: "https://sede.agenciatributaria.gob.es" },
  ],
  intro: [
    "Te han hecho una oferta desde fuera y ahora viene la parte que nadie explica en la entrevista: cómo te van a contratar exactamente. La respuesta determina si tendrás indemnización, quién paga tus cotizaciones y qué pasa si mañana la empresa decide prescindir de ti.",
    "Hay tres vías posibles y una cuarta que circula bastante y no se sostiene. Esta guía las separa, dice qué se gana y qué se pierde con cada una, y señala las banderas rojas que conviene detectar antes de firmar.",
  ],
  sections: [
    {
      id: "tres-vias",
      h2: "Las tres vías legales, y la que no lo es",
      answer:
        "Una empresa extranjera puede contratarte de tres formas: abriendo una filial en tu país, usando un Employer of Record que te emplee localmente en su nombre, o contratándote como profesional independiente que factura. Cualquier otra fórmula, como pagarte por transferencia sin contrato ni estructura, no encaja en ningún ordenamiento.",
      blocks: [
        {
          t: "table",
          head: ["Vía", "Quién es tu empleador", "Cuándo se usa"],
          rows: [
            ["Filial local", "La sociedad que la empresa constituye en tu país", "Cuando contratan a varias personas en el mismo territorio y compensa la estructura."],
            ["Employer of Record", "Un tercero especializado, que te emplea por cuenta de la empresa", "Cuando quieren un contrato laboral real sin abrir sociedad. Es la vía más común hoy."],
            ["Contractor", "Nadie: eres autónomo y prestas un servicio", "Cuando el trabajo es por proyecto o la empresa no quiere asumir estructura."],
            ["«Te pago la nómina por transferencia»", "Un limbo", "Nunca. No existe como figura y el riesgo recae en ti."],
          ],
        },
        {
          t: "note",
          text: "Si en la conversación aparece la frase «te lo pagamos como si fuera nómina pero facturas tú», te están pidiendo que asumas la carga de un empleado con los derechos de un autónomo. Es negociable, pero la tarifa debería reflejarlo.",
        },
      ],
      takeaway:
        "Pregunta la figura contractual en la primera llamada, no en la oferta final. Cambia la cifra que deberías pedir.",
    },
    {
      id: "eor",
      h2: "Employer of Record: qué es y qué te da",
      answer:
        "Un Employer of Record es una empresa que te contrata legalmente en tu país en nombre de la compañía extranjera. Asume la nómina, las cotizaciones y el cumplimiento laboral local, mientras tu trabajo diario lo dirige la empresa cliente. Tienes contrato local con todos sus derechos.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Contrato laboral en tu país, con vacaciones retribuidas y baja pagada.",
            "Cotizaciones y retenciones gestionadas: no tienes que declarar como autónomo.",
            "Indemnización por despido según la normativa local.",
            "La empresa evita crear un establecimiento permanente por accidente.",
          ],
          cons: [
            "Tiene un coste para la empresa, y a veces sale de la banda salarial que te ofrecen.",
            "Tu empleador legal no es quien dirige tu trabajo, lo que puede complicar incidencias.",
            "No todas las condiciones de la empresa matriz llegan igual: revisa equity y bonus.",
          ],
        },
        {
          t: "p",
          text: "Al firmar con un Employer of Record, lee quién asume qué. El contrato laboral es con el intermediario, pero las condiciones económicas y el alcance del puesto los define la empresa cliente. Que ambas cosas coincidan por escrito es lo que evita sorpresas.",
        },
      ],
      takeaway:
        "Es la vía más protectora para ti. Si te la ofrecen, la conversación pasa a ser sobre la cifra, no sobre el riesgo.",
    },
    {
      id: "contractor",
      h2: "Contractor: más rápido, más expuesto",
      answer:
        "Como contractor eres autónomo: emites factura por tus servicios y gestionas tus impuestos y cotizaciones. Es la vía más rápida de arrancar y suele venir con tarifas más altas, pero no incluye indemnización, baja pagada ni vacaciones retribuidas. Esa diferencia debería estar en el precio.",
      blocks: [
        {
          t: "p",
          text: "Al comparar una oferta de contractor con una de empleado, el bruto no vale. Hay que restar la cuota de autónomos, la parte de impuestos que antes retenía la empresa, los días que no facturas cuando estás enfermo o de vacaciones, y el colchón por no tener indemnización.",
        },
        {
          t: "steps",
          items: [
            { title: "Revisa la cláusula de preaviso", text: "Un contrato que permite rescindir con quince días te deja sin margen. Treinta o sesenta días es lo razonable en relaciones continuadas." },
            { title: "Lee la de propiedad intelectual", text: "Cede lo que produzcas para el cliente, no todo lo que hagas en tu vida profesional. Las cláusulas amplias son negociables." },
            { title: "Mira el límite de responsabilidad", text: "Sin tope, respondes de forma ilimitada. Un límite ligado al importe facturado es lo habitual." },
            { title: "Comprueba la exclusividad", text: "Si te impide tener otros clientes y además te fija horario, estás en zona de reclasificación." },
          ],
        },
      ],
      takeaway:
        "La tarifa de contractor no es el salario de empleado: es el salario más todo lo que ahora pagas tú.",
    },
    {
      id: "falso-autonomo",
      h2: "Cuándo un contrato de servicios es en realidad un empleo",
      answer:
        "Se llama reclasificación y ocurre cuando facturas como independiente pero trabajas como empleado: horario impuesto, medios de la empresa, exclusividad y dependencia jerárquica. La inspección atiende a los hechos, no a lo que diga el contrato, y el riesgo recae sobre las dos partes.",
      blocks: [
        {
          t: "p",
          text: "Los indicios que más pesan son tres: quién controla el cómo y el cuándo del trabajo, si estás integrado en la estructura de la empresa como uno más, y si tienes otros clientes. Cuantos más se cumplan, más se parece a una relación laboral encubierta.",
        },
        {
          t: "ul",
          items: [
            "Te asignan un horario fijo y te piden justificar ausencias.",
            "Usas el equipo, las cuentas y las herramientas de la empresa en exclusiva.",
            "Tienes un responsable jerárquico que dirige tu trabajo día a día.",
            "Llevas años facturando a un único cliente que supone casi todos tus ingresos.",
            "Apareces en el organigrama y en las reuniones de equipo como uno más.",
          ],
        },
        {
          t: "note",
          text: "Esto no significa que un contrato de servicios sea siempre irregular. Significa que la forma tiene que corresponderse con el fondo: autonomía real en cómo organizas tu trabajo.",
        },
      ],
      takeaway:
        "Si el día a día es el de un empleado, el contrato de servicios no protege a nadie. Es el punto que más caro sale a posteriori.",
    },
    {
      id: "riesgo-empresa",
      h2: "Por qué a la empresa le preocupa dónde estás",
      answer:
        "Porque tu presencia continuada en un país puede generarle obligaciones fiscales allí. Se llama establecimiento permanente y puede activarse sin oficina: basta con que alguien cierre contratos habitualmente desde otro territorio en nombre de la compañía. Por eso muchas políticas limitan días, países y funciones.",
      blocks: [
        {
          t: "p",
          text: "Un perfil técnico rara vez genera ese riesgo. Un perfil comercial que negocia y firma desde otro país sí puede. Entender esto te da una ventaja en la conversación: sabes por qué te ponen límites y puedes proponer alternativas en lugar de chocar con la política.",
        },
        {
          t: "p",
          text: "También explica por qué algunas empresas prefieren el Employer of Record aunque cueste más: externalizan un riesgo que no saben calcular.",
        },
      ],
      takeaway:
        "Las restricciones de país no son burocracia arbitraria. Saber de dónde vienen te permite negociarlas.",
    },
  ],
  faqs: [
    { q: "¿Necesito darme de alta como autónomo para trabajar con una empresa extranjera?", a: "Sólo si te contratan como contractor. Si usan un Employer of Record o una filial, eres empleado con contrato local y no necesitas alta como autónomo." },
    { q: "¿Qué diferencia hay entre Employer of Record y una ETT?", a: "Una empresa de trabajo temporal cede trabajadores para necesidades puntuales de otra. Un Employer of Record te emplea de forma estable por cuenta de una compañía que no tiene estructura en tu país; la relación es continuada y el cliente es siempre el mismo." },
    { q: "¿Puede una empresa extranjera pagarme sin contrato de ningún tipo?", a: "No de forma sostenible. Sin contrato laboral ni de servicios no hay título que justifique el cobro, ni deducción de gastos para ti, ni prueba de la relación si hay conflicto." },
    { q: "¿Cobro más como contractor que como empleado?", a: "El bruto suele ser mayor, el neto no siempre. Hay que descontar cotizaciones, la ausencia de vacaciones y bajas retribuidas y la falta de indemnización. Comparar sólo la cifra facial lleva a decisiones equivocadas." },
    { q: "¿Qué pasa si me reclasifican como empleado?", a: "La empresa puede afrontar cotizaciones atrasadas y sanciones, y tú puedes perder la deducibilidad de gastos declarados como autónomo. También puede reconocerse la antigüedad, lo que en algunos casos te beneficia." },
    { q: "¿Puedo tener contrato con una empresa de otro país y vivir en un tercero?", a: "Técnicamente sí, pero se complica: entran en juego el permiso de residencia del país donde vives, su normativa laboral y la fiscalidad. Conviene consultarlo antes de mudarte, no después." },
    { q: "¿El Employer of Record me da los mismos derechos que un contrato directo?", a: "En lo laboral, sí: es un contrato local sujeto a la normativa de tu país. Lo que puede variar son los beneficios de la empresa matriz, como equity o bonus, que dependen de cómo se hayan articulado." },
    { q: "¿Cuánto preaviso es razonable en un contrato de contractor?", a: "En relaciones continuadas, entre treinta y sesenta días. Un preaviso de quince días o menos deja sin margen para reponer el ingreso y es de los primeros puntos que conviene negociar." },
    { q: "¿Debo firmar una cláusula de exclusividad como contractor?", a: "Es un indicio fuerte de relación laboral encubierta. Si la empresa la exige, tiene sentido preguntar por qué no ofrece entonces un contrato de empleo con sus garantías." },
    { q: "¿Quién paga mi seguro médico trabajando para una empresa extranjera?", a: "Depende de la figura. Como empleado vía Employer of Record, las cotizaciones locales te dan cobertura pública y a veces se añade un seguro privado. Como contractor, la cobertura corre de tu cuenta salvo que se pacte lo contrario." },
  ],
};
