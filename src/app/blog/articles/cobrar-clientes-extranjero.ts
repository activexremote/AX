import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "cobrar-clientes-extranjero",
  locale: "es",
  cluster: "fiscalidad",
  funnel: "mofu",
  intent: "informacional",
  keyword: "cómo cobrar de clientes extranjeros",
  secondary: [
    "facturar a empresa de estados unidos desde españa",
    "cuenta multidivisa autónomos",
    "inversión del sujeto pasivo servicios",
    "comisiones por recibir pagos internacionales",
    "pasarela de pago para freelance internacional",
  ],
  title: "Cobrar de clientes extranjeros sin perder el 4% por el camino",
  h1: "Cobrar de clientes extranjeros sin perder el 4% por el camino",
  metaTitle: "Cobrar de clientes extranjeros: métodos, comisiones y factura",
  metaDescription:
    "Qué método de cobro elegir según el cliente y el importe, dónde se esconde el coste real de una transferencia internacional y cómo emitir la factura para que no te la devuelvan.",
  ogTitle: "Cobrar de clientes extranjeros sin perder margen",
  ogDescription:
    "El margen de conversión se lleva más que las comisiones visibles. Cómo elegir método, moneda y factura.",
  published: "2026-06-16",
  updated: "2026-06-16",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-founder",
  terms: ["facturacion-internacional", "multidivisa", "contractor-internacional", "negocio-borderless"],
  related: ["negociar-salario-remoto-internacional", "conseguir-clientes-b2b-internacionales", "de-freelance-a-negocio-productizado", "curso-trabajo-remoto-cual-elegir"],
  external: [
    { label: "Agencia Tributaria · Localización de prestaciones de servicios", url: "https://sede.agenciatributaria.gob.es" },
    { label: "Comisión Europea · Normas del IVA para servicios transfronterizos", url: "https://taxation-customs.ec.europa.eu" },
    { label: "Banco Central Europeo · Tipos de cambio de referencia", url: "https://www.ecb.europa.eu" },
  ],
  intro: [
    "Cerrar un cliente en otro país es la parte difícil. Cobrarle bien es la parte que casi nadie mira, y es donde se evapora un porcentaje sorprendente de la facturación anual sin que aparezca en ninguna línea del extracto.",
    "El coste real de un cobro internacional casi nunca es la comisión que te anuncian: es el margen que se aplica al tipo de cambio. Esta guía separa las dos cosas, compara los métodos y explica cómo emitir la factura para que el cliente pueda pagarla sin devolvértela.",
  ],
  sections: [
    {
      id: "donde-se-pierde",
      h2: "Dónde se pierde el dinero en un cobro internacional",
      answer:
        "En tres sitios: la comisión fija de la transferencia, el margen sobre el tipo de cambio y las comisiones de los bancos intermediarios. El segundo suele ser el mayor y el menos visible, porque no aparece como cargo sino como un tipo de cambio peor que el real.",
      blocks: [
        {
          t: "table",
          head: ["Concepto", "Rango habitual", "¿Se ve en el extracto?"],
          rows: [
            ["Comisión de emisión o recepción", "0 € a 30 € por operación", "Sí, como cargo separado"],
            ["Margen sobre el tipo de cambio", "0,4% a 4% del importe", "No: va incorporado al tipo aplicado"],
            ["Bancos intermediarios (corresponsales)", "10 € a 40 € por salto", "A veces, y a veces sólo lo nota el cliente"],
            ["Comisión de pasarela de pago", "1,4% a 3,9% más fijo", "Sí, en la liquidación"],
          ],
        },
        {
          t: "p",
          text: "Para comprobar el margen no hace falta ningún cálculo complicado: compara el tipo que te han aplicado con el tipo de referencia del Banco Central Europeo ese mismo día. La diferencia, en porcentaje, es lo que has pagado sin verlo.",
        },
        {
          t: "note",
          text: "Sobre 60.000 € facturados al año en otra divisa, un margen del 3% son 1.800 €. Es más de lo que cuesta cualquier alternativa, y es recurrente.",
        },
      ],
      takeaway:
        "La comisión que te anuncian rara vez es el coste. El coste está en el tipo de cambio aplicado.",
    },
    {
      id: "metodos",
      h2: "Qué método elegir según el cliente",
      answer:
        "No hay un método mejor para todo. Depende de tres cosas: si el cliente es empresa o particular, del importe medio y de si el cobro es recurrente. Una empresa con contabilidad prefiere transferencia; un particular abandona si le pides datos bancarios internacionales.",
      blocks: [
        {
          t: "table",
          head: ["Método", "Cuándo encaja", "Qué vigilar"],
          rows: [
            ["Transferencia a cuenta multidivisa", "Empresas, importes medios y altos, cobro recurrente", "Que tengas datos bancarios locales en la divisa del cliente"],
            ["Pasarela de pago con tarjeta", "Particulares y ventas de importe bajo", "La comisión porcentual pesa mucho si el ticket es alto"],
            ["Plataforma de facturación con cobro integrado", "Servicios recurrentes con suscripción", "El coste total sumando conversión y comisión"],
            ["Domiciliación en la divisa del cliente", "Contratos estables y de largo plazo", "Requiere datos locales y acuerdo previo"],
          ],
        },
        {
          t: "p",
          text: "La clave práctica es tener datos bancarios locales en la divisa del cliente. Que un cliente estadounidense pague a una cuenta con datos estadounidenses elimina de golpe los bancos intermediarios y la fricción de convencerle de hacer una transferencia internacional.",
        },
      ],
      takeaway:
        "Elige por tipo de cliente e importe, no por costumbre. Y da datos locales siempre que puedas.",
    },
    {
      id: "divisa",
      h2: "En qué divisa conviene facturar",
      answer:
        "En la que gastas, si el cliente lo acepta. Facturar en tu propia moneda traslada el riesgo de tipo de cambio al cliente; facturar en la suya te lo quedas tú. Cuando no hay margen para elegir, lo que queda es controlar cuándo y cómo se convierte.",
      blocks: [
        {
          t: "ul",
          items: [
            "Si facturas en euros y el cliente paga en euros, no hay conversión: es la situación más limpia.",
            "Si facturas en la divisa del cliente, mantén el saldo en esa divisa y convierte cuando te convenga, no automáticamente al recibir.",
            "Si tienes gastos en esa divisa, no conviertas: paga con ella y ahorras la conversión entera.",
            "Fija en el contrato quién asume las comisiones. «Importe neto a recibir» evita discusiones a fin de mes.",
          ],
        },
        {
          t: "p",
          text: "Con contratos largos también existe el riesgo de que la divisa se mueva en tu contra durante meses. En importes relevantes conviene revisar el precio periódicamente o pactar una cláusula de revisión, en lugar de asumirlo en silencio.",
        },
      ],
      takeaway:
        "Mantener el saldo en la divisa que recibes y convertir cuando decides tú es la palanca más simple.",
    },
    {
      id: "factura",
      h2: "Cómo emitir la factura para que no te la devuelvan",
      answer:
        "Una factura internacional necesita datos que la nacional no pide: identificación fiscal de las dos partes, el lugar de prestación del servicio y la mención que justifica por qué no se repercute impuesto, cuando corresponde. Sin eso, el departamento contable del cliente la devuelve.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Identifica bien a las dos partes", text: "Nombre fiscal completo, dirección y número de identificación fiscal del cliente, no sólo su nombre comercial." },
            { title: "Determina el lugar de prestación", text: "En servicios entre empresas, la regla general lo sitúa donde está el cliente. Eso es lo que determina el tratamiento." },
            { title: "Aplica el tratamiento correcto", text: "Entre empresas de países distintos suele operar la inversión del sujeto pasivo, y la factura debe mencionarlo expresamente." },
            { title: "Añade los datos de cobro", text: "Datos bancarios en la divisa de la factura, referencia de pago y plazo. Cuanto menos tenga que preguntar el cliente, antes cobras." },
            { title: "Numera y archiva", text: "Serie correlativa y copia guardada. Es lo primero que se pide en cualquier comprobación." },
          ],
        },
        {
          t: "note",
          text: "El tratamiento cambia mucho según el tipo de cliente y su país, y vender a consumidores finales de otros países puede exigir registros específicos. Esta guía explica qué preguntar; el caso concreto lo confirma tu asesor.",
        },
      ],
      takeaway:
        "Una factura devuelta retrasa el cobro un mes. Los datos completos salen más baratos que la corrección.",
    },
    {
      id: "cobrar-antes",
      h2: "Cómo cobrar antes y con menos impagos",
      answer:
        "La mayoría de los retrasos no son morosidad: son fricción. Un cliente que no sabe cómo pagarte, que necesita aprobación interna o que recibe la factura sin referencia de pedido tarda semanas más de lo necesario, y el problema es del proceso, no del cliente.",
      blocks: [
        {
          t: "ol",
          items: [
            "Pide un anticipo en el primer trabajo con cada cliente nuevo. Filtra y financia el arranque.",
            "Pregunta antes de facturar qué necesita su contabilidad: número de pedido, portal de proveedores, formato concreto.",
            "Emite el mismo día que entregas. Cada día de retraso tuyo se suma al ciclo de pago de ellos.",
            "Pon el plazo en la factura y un recordatorio automático a los siete días del vencimiento.",
            "Para importes altos, fracciona en hitos: reduce el riesgo y mejora tu caja.",
          ],
        },
        {
          t: "quote",
          text: "La mayor parte del dinero que se cobra tarde se pierde en el proceso, no en la voluntad del cliente.",
        },
      ],
      takeaway:
        "Preguntar cómo quieren recibir la factura antes de emitirla acorta el cobro más que cualquier recordatorio.",
    },
  ],
  faqs: [
    { q: "¿Cuál es la forma más barata de cobrar de un cliente extranjero?", a: "Normalmente una cuenta multidivisa con datos bancarios locales en la divisa del cliente: elimina intermediarios y aplica un margen de conversión mucho menor que el bancario tradicional. Para importes bajos con particulares, una pasarela de tarjeta compensa aunque su comisión porcentual sea mayor." },
    { q: "¿Cómo sé cuánto me están cobrando por la conversión?", a: "Compara el tipo aplicado con el tipo de referencia del Banco Central Europeo del mismo día. La diferencia porcentual es el margen que has pagado, y no aparece como comisión en el extracto." },
    { q: "¿Tengo que repercutir impuesto a un cliente de otro país?", a: "Depende de si es empresa o consumidor y de dónde esté. Entre empresas de países distintos suele operar la inversión del sujeto pasivo, con mención expresa en la factura. A consumidores finales las reglas son distintas y pueden exigir registros específicos." },
    { q: "¿Puedo facturar en dólares si mi contabilidad es en euros?", a: "Sí. La factura puede emitirse en otra divisa indicando el tipo de cambio aplicado a efectos contables. Conviene fijar en el contrato qué tipo se usa y en qué fecha." },
    { q: "¿Quién paga las comisiones de la transferencia?", a: "Lo que se pacte. Si no se dice nada, suelen repartirse y acabas recibiendo menos de lo facturado. Especificar «importe neto a recibir» en el contrato evita esa merma." },
    { q: "¿Necesito una cuenta bancaria en el país del cliente?", a: "No necesariamente. Varias cuentas multidivisa proporcionan datos bancarios locales en distintos países sin abrir una cuenta allí, que es lo que elimina la fricción para el cliente." },
    { q: "¿Es mejor cobrar por adelantado?", a: "En el primer trabajo con un cliente nuevo, sí: un anticipo filtra y financia el arranque. En relaciones consolidadas suele bastar con facturar por hitos." },
    { q: "¿Qué hago si un cliente extranjero no paga?", a: "Primero comprobar que no es fricción: factura incompleta, falta de número de pedido o un portal de proveedores sin registrar. Si es impago real, la reclamación transfronteriza es lenta y cara, por lo que el anticipo y los hitos son la mejor defensa." },
    { q: "¿Las plataformas de pago retienen impuestos?", a: "Algunas aplican retenciones o exigen documentación fiscal según tu país y el suyo. Conviene revisarlo al darse de alta, no al recibir la primera liquidación con menos importe del esperado." },
    { q: "¿Cuánto tarda en llegar una transferencia internacional?", a: "Entre uno y cinco días laborables según ruta y divisa. Los pagos con datos bancarios locales suelen liquidarse como una transferencia nacional, en el mismo día o al siguiente." },
  ],
  hero: { file: "/blog/fuga-cobro.svg", alt: "Diagrama: un canal de cobro del que se desvía una parte antes de llegar al destino." },
};
