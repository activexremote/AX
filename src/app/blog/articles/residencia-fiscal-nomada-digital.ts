import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "residencia-fiscal-nomada-digital",
  locale: "es",
  cluster: "fiscalidad",
  funnel: "mofu",
  intent: "informacional",
  keyword: "residencia fiscal nómada digital",
  secondary: [
    "regla de los 183 días cómo funciona",
    "dónde tributo si trabajo en remoto desde otro país",
    "perder la residencia fiscal en España",
    "certificado de residencia fiscal",
    "convenio de doble imposición teletrabajo",
  ],
  title: "Residencia fiscal para nómadas digitales: los 183 días no son lo que crees",
  h1: "Residencia fiscal para nómadas digitales: los 183 días no son lo que crees",
  metaTitle: "Residencia fiscal nómada digital: más allá de los 183 días",
  metaDescription:
    "Los 183 días no son una frontera segura. Cómo se determina de verdad la residencia fiscal, qué es el centro de intereses económicos y qué pasa cuando dos países te reclaman a la vez.",
  ogTitle: "Residencia fiscal: los 183 días no son una frontera segura",
  ogDescription:
    "El criterio que casi todo el mundo cita mal, el que de verdad decide, y las reglas de desempate cuando dos países te consideran residente.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 12,
  author: "Equipo ActiveXRemote",
  terms: ["residencia-fiscal", "regla-183-dias", "doble-imposicion", "nomada-digital", "visado-nomada-digital"],
  related: ["visados-nomada-digital-comparativa", "como-trabajar-para-empresa-extranjera-legalmente", "cobrar-clientes-extranjero"],
  external: [
    { label: "Agencia Tributaria · Residencia fiscal de personas físicas", url: "https://sede.agenciatributaria.gob.es" },
    { label: "OCDE · Modelo de Convenio Tributario sobre la Renta", url: "https://www.oecd.org/tax/treaties/" },
    { label: "Agencia Tributaria · Convenios de doble imposición firmados", url: "https://www.hacienda.gob.es" },
    { label: "Comisión Europea · Impuestos al trasladarse dentro de la UE", url: "https://europa.eu/youreurope/citizens/work/taxes/index_es.htm" },
  ],
  intro: [
    "«Si paso menos de 183 días, no soy residente fiscal.» Es la frase más repetida en los foros de nomadismo y la que más disgustos ha provocado. No es falsa del todo: es incompleta, y la parte que falta es la que acaba costando dinero.",
    "Esta guía explica cómo se determina realmente la residencia fiscal, por qué puedes seguir siendo residente en un país donde apenas has estado, y qué ocurre cuando dos administraciones llegan a la misma conclusión sobre ti al mismo tiempo.",
  ],
  sections: [
    {
      id: "que-es",
      h2: "Qué significa ser residente fiscal",
      answer:
        "Ser residente fiscal en un país significa que ese país tiene derecho a gravar tu renta mundial, venga de donde venga. No lo eliges declarándolo ni depende de tu nacionalidad: cada legislación lo determina con criterios objetivos que se comprueban a posteriori.",
      blocks: [
        {
          t: "p",
          text: "Es importante separar tres conceptos que se confunden constantemente: la nacionalidad, que rara vez determina dónde tributas; el domicilio administrativo, que es dónde estás empadronado; y la residencia fiscal, que es la que decide quién grava tus ingresos.",
        },
        {
          t: "note",
          text: "Puedes estar empadronado en un sitio, tener la nacionalidad de otro y ser residente fiscal en un tercero. Las tres cosas viajan por separado.",
        },
      ],
      takeaway:
        "La residencia fiscal no se elige: se constata. Y la constata la administración, no tú.",
    },
    {
      id: "183-dias",
      h2: "La regla de los 183 días y sus letras pequeñas",
      answer:
        "Permanecer más de 183 días en un año natural en un país suele convertirte en residente fiscal allí. Es el criterio más conocido, pero ni es el único ni siempre el decisivo, y la forma de contar los días cambia según la jurisdicción.",
      blocks: [
        {
          t: "ul",
          items: [
            "Muchos países cuentan como día de presencia cualquier día en el que estés en el territorio, aunque sea unas horas: llegadas y salidas suman.",
            "Las ausencias esporádicas pueden computar como presencia si no acreditas residencia fiscal en otro sitio.",
            "El año de referencia no siempre es natural: algunos países usan ejercicios que no coinciden con el calendario.",
            "Superar el umbral en dos países distintos es posible cuando cada uno cuenta a su manera.",
          ],
        },
        {
          t: "p",
          text: "El error caro es tratar los 183 días como una frontera segura y organizar el año alrededor de ese número. Funciona sólo si además no se cumple ningún otro criterio, y suele haber otros.",
        },
      ],
      takeaway:
        "Los 183 días son un umbral, no un escudo. Cumplirlo no cierra la cuestión.",
    },
    {
      id: "intereses",
      h2: "El criterio que casi nadie menciona: el centro de intereses",
      answer:
        "Muchos países te consideran residente fiscal si el núcleo de tus actividades o intereses económicos está en su territorio, con independencia de los días que pases allí. En España, además, se presume la residencia cuando tu cónyuge no separado y tus hijos menores residen habitualmente en el país.",
      blocks: [
        {
          t: "p",
          text: "Esto significa que puedes pasar cuatro meses en el país y seguir siendo residente fiscal allí si es donde está tu vivienda, tu familia, tus cuentas, tus clientes principales o tus inmuebles. El criterio de días es sólo la primera puerta; ésta es la segunda, y se abre sola.",
        },
        {
          t: "table",
          head: ["Indicio", "Qué pesa"],
          rows: [
            ["Vivienda permanente disponible", "Alto: tener un piso a tu disposición todo el año cuenta aunque no lo uses."],
            ["Familia directa residiendo", "Alto: en España opera como presunción."],
            ["Origen de la mayor parte de tus ingresos", "Alto: si tus clientes o tu empleador están allí, pesa."],
            ["Cuentas bancarias e inversiones", "Medio: aporta contexto al conjunto."],
            ["Padrón y seguro médico", "Bajo por sí solos, relevantes sumados al resto."],
          ],
        },
      ],
      takeaway:
        "Se puede salir de un país y seguir siendo su residente fiscal. Lo que rompe el vínculo es acreditar residencia en otro sitio.",
    },
    {
      id: "doble",
      h2: "Cuando dos países te consideran residente",
      answer:
        "Ocurre más de lo que parece y no significa tributar dos veces por lo mismo. Los convenios de doble imposición incluyen reglas de desempate que se aplican en orden: vivienda permanente, centro de intereses vitales, permanencia habitual y, si nada resuelve, nacionalidad.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Vivienda permanente", text: "Se mira en cuál de los dos países tienes una vivienda a tu disposición de forma estable. Si sólo hay una, ahí acaba el desempate." },
            { title: "Centro de intereses vitales", text: "Si hay vivienda en ambos, se compara dónde están tus vínculos personales y económicos más estrechos." },
            { title: "Permanencia habitual", text: "Si tampoco resuelve, se mira dónde vives con más frecuencia, mirando varios años y no sólo el último." },
            { title: "Nacionalidad", text: "Sólo si los tres anteriores empatan. Y si tienes ambas nacionalidades, lo resuelven las administraciones de común acuerdo." },
          ],
        },
        {
          t: "p",
          text: "El instrumento práctico en estos casos es el certificado de residencia fiscal: lo emite la administración del país que te considera residente y sirve para que el otro aplique el convenio en lugar de tratarte como no residente sin más.",
        },
      ],
      takeaway:
        "El conflicto entre dos países se resuelve con reglas escritas, no con interpretaciones. Pero hay que invocarlas y documentarlas.",
    },
    {
      id: "practico",
      h2: "Qué hacer en la práctica si te mueves",
      answer:
        "Documentar desde el primer día y decidir antes de moverte, no después. Los problemas fiscales del nomadismo casi nunca vienen de una mala decisión: vienen de no haber tomado ninguna y descubrir dos años tarde que había que haberlo hecho.",
      blocks: [
        {
          t: "ol",
          items: [
            "Lleva un registro de días por país, con billetes y sellos. Reconstruirlo después es caro y poco fiable.",
            "Decide cuál quieres que sea tu residencia fiscal y actúa en consecuencia: dónde está tu vivienda, dónde facturas, dónde tienes cobertura.",
            "Si sales de un país, acredita entrada en otro. Salir sin destino fiscal es lo que deja la puerta abierta.",
            "Pide el certificado de residencia fiscal en el país donde lo seas, cada año.",
            "Antes de aceptar un visado de nómada digital, mira cómo interactúa con tu residencia actual: es un permiso de estancia, no un régimen fiscal.",
          ],
        },
        {
          t: "note",
          text: "Esta guía explica el marco general para que sepas qué preguntar. La decisión concreta depende de tu país de origen, del convenio aplicable y de tu situación, y esa parte la firma un asesor fiscal.",
        },
      ],
      takeaway:
        "Documenta mientras ocurre. La prueba se construye antes de que te la pidan, no cuando llega la carta.",
    },
  ],
  faqs: [
    { q: "¿Pierdo la residencia fiscal española si paso menos de 183 días en España?", a: "No automáticamente. España también te considera residente si el núcleo de tus intereses económicos está aquí, y presume residencia si tu cónyuge e hijos menores viven en el país. Hay que romper todos los vínculos, no sólo el de días." },
    { q: "¿Cómo se cuentan los 183 días exactamente?", a: "Depende del país. Muchos computan como presencia cualquier día en el que estés en el territorio, incluidas llegadas y salidas parciales, y algunos suman las ausencias esporádicas si no acreditas residencia fiscal en otro sitio." },
    { q: "¿Un visado de nómada digital me cambia la residencia fiscal?", a: "No por sí mismo: es un permiso de residencia, no un régimen tributario. Algunos países lo acompañan de incentivos fiscales, pero son cosas distintas y hay que mirarlas por separado." },
    { q: "¿Qué es el certificado de residencia fiscal y para qué sirve?", a: "Es el documento con el que la administración de un país declara que te considera residente fiscal allí. Sirve para que el otro país aplique el convenio de doble imposición en lugar de gravarte como no residente." },
    { q: "¿Puedo no ser residente fiscal en ningún sitio?", a: "En la práctica es muy difícil de sostener y suele terminar mal. Cuando nadie te reconoce como residente, el país del que saliste tiende a seguir considerándote suyo, y sin certificado no puedes invocar ningún convenio." },
    { q: "¿Tributo donde está mi empresa o donde vivo?", a: "Como norma general, las rentas del trabajo tributan donde se ejerce el trabajo físicamente. En remoto eso es tu país de residencia, no el de la empresa. Por eso una empresa extranjera no te retiene IRPF español." },
    { q: "¿Qué pasa si trabajo desde tres países distintos en un año?", a: "Cada uno aplica sus propias reglas de residencia y algunos pueden reclamarte. Se resuelve con los convenios y con el registro de días, que es la prueba que te van a pedir." },
    { q: "¿Tener una casa en propiedad me hace residente fiscal?", a: "Por sí solo no, pero pesa: una vivienda permanente a tu disposición es el primer criterio de desempate en los convenios y un indicio fuerte del centro de intereses." },
    { q: "¿Cuándo debo consultar a un asesor fiscal?", a: "Antes de mudarte, no después. Las decisiones que se pueden optimizar son las que aún no has tomado; una vez transcurrido el ejercicio, el margen es mínimo." },
    { q: "¿Hacienda puede saber dónde he estado?", a: "Sí. Hay intercambio automático de información financiera entre administraciones, y los registros de vuelos, cuentas y cotizaciones dejan rastro. La documentación propia sirve para explicar, no para ocultar." },
  ],
};
