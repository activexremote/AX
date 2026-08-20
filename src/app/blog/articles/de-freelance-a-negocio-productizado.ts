import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "de-freelance-a-negocio-productizado",
  locale: "es",
  cluster: "negocio",
  funnel: "mofu",
  intent: "comercial",
  keyword: "dejar de cobrar por horas",
  secondary: [
    "servicio productizado ejemplos",
    "cómo escalar como freelance sin contratar",
    "poner precio a un servicio",
    "alcance cerrado presupuesto",
    "solopreneur negocio",
  ],
  title: "Dejar de cobrar por horas: el salto de freelance a negocio",
  h1: "Dejar de cobrar por horas: el salto de freelance a negocio",
  metaTitle: "Dejar de cobrar por horas: pasar a un servicio productizado",
  metaDescription:
    "Por qué el modelo por horas tiene un techo con fecha y cómo se convierte un servicio en producto: alcance cerrado, precio fijo y un proceso que mejora con cada repetición.",
  ogTitle: "Dejar de cobrar por horas",
  ogDescription:
    "Cómo pasar de vender tiempo a vender un resultado con alcance y precio cerrados, sin contratar a nadie.",
  published: "2026-07-21",
  updated: "2026-07-21",
  readingMinutes: 12,
  author: "Equipo ActiveXRemote",
  course: "remote-founder",
  terms: ["oferta-productizada", "solopreneur", "negocio-borderless", "sop", "automatizacion-no-code"],
  related: ["sop-documentar-procesos", "conseguir-clientes-b2b-internacionales", "automatizar-negocio-sin-codigo", "curso-trabajo-remoto-cual-elegir"],
  external: [
    { label: "Comisión Europea · Apoyo a pymes y trabajo autónomo", url: "https://single-market-economy.ec.europa.eu" },
    { label: "OCDE · Estudios sobre trabajo por cuenta propia", url: "https://data.oecd.org" },
  ],
  intro: [
    "El problema del modelo por horas no es la tarifa. Es que cada euro adicional exige una hora adicional, y las horas se acaban. Subir el precio compra tiempo; no cambia la ecuación.",
    "Este artículo describe el cambio concreto: qué se modifica en la oferta, en el precio, en la entrega y en la captación cuando se deja de vender tiempo y se empieza a vender un resultado con alcance cerrado.",
  ],
  sections: [
    {
      id: "techo",
      h2: "Por qué el modelo por horas tiene un techo con fecha",
      answer:
        "Porque el ingreso está atado a una unidad que no se puede multiplicar. Puedes subir la tarifa, pero el mercado pone un límite; puedes trabajar más horas, pero la semana también. Y el día que paras de trabajar, el ingreso para el mismo día.",
      blocks: [
        {
          t: "table",
          head: ["", "Vendes horas", "Vendes un resultado"],
          rows: [
            ["Unidad de venta", "Tiempo", "Un entregable con alcance definido"],
            ["Cómo crece el ingreso", "Más horas o más tarifa", "Más repeticiones del mismo proceso"],
            ["Quién puede entregarlo", "Sólo tú", "Tú, un proceso documentado o una automatización"],
            ["Qué pasa si te vas dos semanas", "El ingreso se detiene", "El sistema sigue entregando y captando"],
            ["Qué mejora con la repetición", "Nada: cada proyecto empieza de cero", "Todo: cada iteración afina el proceso"],
          ],
        },
        {
          t: "p",
          text: "Hay una trampa adicional: cuanto mejor eres, menos horas necesitas para el mismo resultado, así que facturar por tiempo penaliza tu propia mejora. Es el único modelo en el que ser más competente reduce tus ingresos.",
        },
      ],
      takeaway:
        "El modelo por horas castiga la eficiencia. Es una razón suficiente para abandonarlo.",
    },
    {
      id: "que-es",
      h2: "Qué es exactamente una oferta productizada",
      answer:
        "Un servicio vendido con alcance cerrado, plazo definido y precio fijo, como si fuera un producto. El cliente sabe qué recibe, cuándo y por cuánto antes de contratar, y tú sabes cuánto cuesta entregarlo. Desaparecen el presupuesto a medida y la negociación caso por caso.",
      blocks: [
        {
          t: "p",
          text: "No es vender más barato ni recortar calidad. Es tomar una decisión incómoda: qué NO está incluido. Ese límite explícito es precisamente lo que evita que el alcance se expanda solo, que es donde se evapora el margen de la mayoría de los freelances.",
        },
        {
          t: "steps",
          items: [
            { title: "Elige un problema recurrente", text: "Mira tus últimos veinte encargos y busca el que se repite con variaciones menores. Ése es el candidato, no el más interesante." },
            { title: "Define el entregable", text: "Qué recibe exactamente el cliente al terminar. Si no lo puedes enumerar en cinco líneas, todavía no está cerrado." },
            { title: "Fija el límite", text: "Escribe qué queda fuera con la misma claridad con la que escribes qué entra. Es la parte que protege el margen." },
            { title: "Pon plazo y precio", text: "Un plazo que puedas cumplir con holgura y un precio que cubra el peor caso de las últimas repeticiones, no el mejor." },
            { title: "Documenta el proceso", text: "Escribe los pasos mientras ejecutas la siguiente entrega. Ese documento es lo que después permite delegar o automatizar." },
          ],
        },
      ],
      takeaway:
        "Productizar es decidir qué no haces. Lo demás es consecuencia de eso.",
    },
    {
      id: "precio",
      h2: "Cómo poner precio cuando dejas de contar horas",
      answer:
        "El precio deja de salir del coste y pasa a salir del valor y de la repetibilidad. Se calcula mirando qué le resuelve al cliente, cuánto cuesta entregarlo en el peor caso y qué margen necesitas para que el proceso mejore en vez de sobrevivir.",
      blocks: [
        {
          t: "ul",
          items: [
            "Parte del resultado: qué gana o deja de perder el cliente. Si no lo sabes, todavía no conoces bien el problema.",
            "Calcula el coste de entrega del peor caso de tus últimas cinco repeticiones, no del mejor.",
            "Añade el margen que financia la mejora del proceso: sin él, cada entrega es igual de cara que la anterior.",
            "Publica el precio. Un precio publicado filtra clientes antes de la llamada y elimina la negociación de partida.",
            "Sube el precio cuando el proceso mejore, no cuando tengas más trabajo del que puedes atender.",
          ],
        },
        {
          t: "note",
          text: "Publicar el precio da vértigo porque se pierde el margen de negociar al alza con clientes grandes. A cambio se gana algo más valioso: dejas de dedicar horas a presupuestar encargos que no se cierran.",
        },
      ],
      takeaway:
        "Si el precio depende de cada cliente, sigues vendiendo tiempo con otro nombre.",
    },
    {
      id: "transicion",
      h2: "Cómo hacer la transición sin quedarte sin ingresos",
      answer:
        "No se cambia de golpe. Se lanza la oferta productizada en paralelo a los encargos por horas, se validan tres o cuatro entregas reales y sólo cuando cubre una parte estable del ingreso se empieza a rechazar trabajo del modelo antiguo.",
      blocks: [
        {
          t: "ol",
          items: [
            "Mes 1: define la oferta y véndela a dos clientes actuales que ya confían en ti, avisando de que es una primera edición.",
            "Mes 2: entrega, documenta cada paso y anota dónde se te fue el tiempo respecto a lo previsto.",
            "Mes 3: ajusta alcance, plazo y precio con lo aprendido, y publícalo.",
            "Mes 4-6: capta con la oferta cerrada mientras mantienes los encargos por horas que ya tienes.",
            "A partir de ahí: deja de aceptar trabajo por horas que no encaje en el proceso documentado.",
          ],
        },
        {
          t: "quote",
          text: "El objetivo no es dejar de trabajar. Es que el trabajo que haces deje de ser irrepetible.",
        },
      ],
      takeaway:
        "Valida con clientes que ya te conocen antes de publicar nada. Sale mucho más barato equivocarse ahí.",
    },
    {
      id: "errores",
      h2: "Los errores que más lo estropean",
      answer:
        "Productizar demasiado pronto, sin haber repetido el trabajo lo suficiente para saber qué cuesta; dejar el alcance abierto por miedo a perder al cliente; y automatizar un proceso que todavía no está estabilizado, lo que sólo consigue equivocarse más rápido y a mayor escala.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Empezar por el encargo que más veces has repetido, aunque sea el menos vistoso.",
            "Escribir el «no incluye» antes que el «incluye».",
            "Documentar mientras entregas, no después de memoria.",
            "Subir el precio cuando baje el coste de entrega.",
          ],
          cons: [
            "Elegir el servicio que más te apetece en vez del que mejor conoces.",
            "Aceptar excepciones «sólo por esta vez»: son el 90% del desbordamiento de alcance.",
            "Automatizar antes de que el proceso sea estable.",
            "Cambiar el precio en cada llamada, que devuelve el modelo al punto de partida.",
          ],
        },
      ],
      takeaway:
        "Documentar, estabilizar y sólo entonces automatizar. Ese orden no se puede saltar.",
    },
  ],
  faqs: [
    { q: "¿Qué es un servicio productizado?", a: "Un servicio vendido con alcance cerrado, plazo definido y precio fijo, como si fuera un producto. El cliente sabe qué recibe, cuándo y por cuánto antes de contratar." },
    { q: "¿Puedo productizar cualquier servicio?", a: "Casi cualquiera que se repita con variaciones menores. Lo que no se puede productizar bien es un encargo que cada vez tiene un alcance radicalmente distinto: ahí conviene otro modelo." },
    { q: "¿Pierdo clientes grandes si publico el precio?", a: "Pierdes algunos, y ganas tiempo. Los clientes que sólo entran con presupuesto a medida suelen ser los que más horas de venta consumen. Muchos negocios mantienen una vía cerrada y otra a medida con precio de partida alto." },
    { q: "¿Cómo evito que el alcance se expanda?", a: "Escribiendo qué queda fuera con la misma claridad que lo que entra, y tratando cualquier añadido como una nueva unidad con su precio. La palabra que protege el margen es «eso es un segundo paquete»." },
    { q: "¿Necesito contratar a alguien para escalar?", a: "No necesariamente. Un proceso documentado y unas automatizaciones bien puestas suelen dar más margen que una primera contratación, y sin añadir una nómina fija." },
    { q: "¿Cuánto debería costar mi servicio productizado?", a: "Lo que cubra el coste del peor caso de tus últimas entregas más el margen que financie mejorar el proceso. Si el precio sólo cubre el caso ideal, cada imprevisto se come el beneficio." },
    { q: "¿Cuánto se tarda en hacer la transición?", a: "Entre tres y seis meses si se hace en paralelo al trabajo actual. Hacerlo de golpe obliga a validar el modelo con la presión de necesitar el ingreso, que es cuando se aceptan las excepciones que lo rompen." },
    { q: "¿Y si mi sector no funciona así?", a: "Casi todos tienen una parte repetible aunque el conjunto no lo sea. Suele estar en el diagnóstico inicial, en la puesta en marcha o en el mantenimiento recurrente." },
    { q: "¿Puedo cobrar por horas y productizado a la vez?", a: "Durante la transición, sí, y es lo recomendable. A largo plazo conviene que la vía por horas tenga un precio claramente superior, para que no compita con la cerrada." },
    { q: "¿Cuándo automatizo?", a: "Cuando hayas entregado el mismo proceso varias veces sin cambios y sepas exactamente qué pasos no requieren criterio. Automatizar antes multiplica los errores en lugar del margen." },
  ],
  hero: { file: "/blog/producto-cerrado.svg", alt: "Diagrama: horas sueltas de distinta longitud que se compactan en un único bloque cerrado." },
};
