import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "cv-internacional-ats",
  locale: "es",
  cluster: "empleo",
  funnel: "mofu",
  intent: "informacional",
  keyword: "currículum internacional ATS",
  secondary: [
    "cómo hacer un cv que pase el filtro ats",
    "cv en inglés para empresa extranjera",
    "por qué me rechazan sin leer mi currículum",
    "formato de currículum para empresas internacionales",
    "currículum sin foto",
  ],
  title: "El currículum que pasa el ATS: qué cambia cuando aplicas fuera",
  h1: "El currículum que pasa el ATS: qué cambia cuando aplicas fuera",
  metaTitle: "Currículum internacional y ATS: qué cambiar para que te lean",
  metaDescription:
    "Por qué tu currículum español no funciona en procesos internacionales: foto, columnas, tablas y verbos sin cifra. Qué lee un ATS, qué lo rompe y cómo montar un documento que llegue a un humano.",
  ogTitle: "El currículum que pasa el ATS",
  ogDescription:
    "Foto, columnas y tablas: tres cosas normales aquí que descartan tu candidatura fuera. Cómo montar el documento que sí se lee.",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  course: "remote-professional",
  terms: ["ats", "cv-internacional", "portfolio-internacional", "marca-personal"],
  related: ["trabajo-remoto-internacional-desde-espana", "portfolio-para-recruiters-internacionales", "ia-para-buscar-trabajo-remoto"],
  external: [
    { label: "Comisión Europea · Europass y formatos de CV", url: "https://europa.eu/europass/es" },
    { label: "W3C · Accesibilidad de documentos estructurados", url: "https://www.w3.org/WAI/" },
    { label: "Comisión Europea · Portal EURES de empleo", url: "https://eures.europa.eu" },
  ],
  intro: [
    "Aplicas a diez vacantes internacionales y no responde ninguna. La conclusión fácil es que no das el perfil. La conclusión probable es que tu currículum no ha llegado entero al otro lado.",
    "Entre tú y la persona que decide hay un software que lee, trocea y ordena candidaturas. No te rechaza por malo: te ordena mal cuando no puede leerte. Esta guía explica qué rompe esa lectura y cómo se arregla.",
  ],
  sections: [
    {
      id: "que-hace-ats",
      h2: "Qué hace realmente un ATS",
      answer:
        "Un ATS recibe tu documento, extrae campos estructurados —experiencia, fechas, empresas, formación, habilidades— y los ordena para que el reclutador filtre. En la mayoría de configuraciones no descarta solo: prioriza. El problema es que lo que no consigue extraer, no existe para el filtro.",
      blocks: [
        {
          t: "p",
          text: "Conviene desmontar el mito: el ATS no es un juez que te suspende. Es un lector automático. Si tu experiencia está dentro de una tabla o en una segunda columna, puede leerla en un orden que no tiene sentido, mezclar fechas o perder el nombre de la empresa. El resultado es un perfil incompleto compitiendo contra perfiles completos.",
        },
        {
          t: "table",
          head: ["Qué lee bien", "Qué le cuesta", "Qué rompe la lectura"],
          rows: [
            ["Texto en una sola columna", "Iconos con texto al lado", "Tablas con celdas combinadas"],
            ["Encabezados estándar", "Encabezados creativos", "Texto dentro de imágenes"],
            ["Fechas en formato mes/año", "Fechas sólo con año", "Cronologías en línea del tiempo gráfica"],
            ["PDF generado desde texto", "PDF con fuentes incrustadas raras", "PDF escaneado o exportado como imagen"],
          ],
        },
      ],
      takeaway:
        "Lo que el filtro no puede extraer, para efectos prácticos no lo has escrito.",
    },
    {
      id: "diferencias",
      h2: "Lo que cambia respecto a un currículum español",
      answer:
        "Tres costumbres habituales en España y buena parte de Latinoamérica se perciben como problema en el mercado anglosajón: la foto, los datos personales y el diseño en columnas. No es una cuestión de gusto, sino de política de sesgo y de legibilidad automática.",
      blocks: [
        {
          t: "ul",
          items: [
            "Foto: en muchos procesos internacionales se elimina o se descarta la candidatura por política de no discriminación. No aporta y puede excluirte.",
            "Fecha de nacimiento, estado civil y nacionalidad: mismo motivo. Sólo se indica la elegibilidad para trabajar si la oferta lo pide.",
            "Dos columnas y barras de nivel: rompen la extracción y no comunican nada verificable. Un «85% de Python» no significa nada.",
            "Carta de presentación genérica: si la envías igual a todos, resta. Mejor tres líneas específicas o ninguna.",
          ],
        },
        {
          t: "note",
          text: "La excepción son los mercados donde la foto sigue siendo norma, como algunos países de Europa continental. Si aplicas a la vez a varios mercados, mantén dos versiones del documento.",
        },
      ],
      takeaway:
        "Quitar cosas mejora el currículum internacional más que añadirlas.",
    },
    {
      id: "estructura",
      h2: "La estructura que funciona",
      answer:
        "Una sola columna, encabezados estándar y orden cronológico inverso. Arriba, nombre y titular del puesto al que aspiras. Luego un resumen de tres líneas, la experiencia con logros cuantificados, las herramientas concretas y, al final, formación. Sin adornos y sin secciones inventadas.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "Cabecera", text: "Nombre, titular profesional, ciudad y país, correo, teléfono con prefijo internacional y enlaces a portfolio y perfil profesional. Nada más." },
            { title: "Resumen", text: "Tres líneas: qué haces, para qué tipo de empresa y con qué resultado medible. Es lo único que se lee siempre." },
            { title: "Experiencia", text: "Empresa, puesto, mes y año de inicio y fin. Debajo, entre tres y cinco líneas que empiecen por verbo y terminen en cifra." },
            { title: "Herramientas", text: "Los nombres exactos que aparecen en la oferta. Sin porcentajes ni estrellas: se citan o no se citan." },
            { title: "Formación", text: "Al final salvo que seas recién titulado. Título, centro y año." },
          ],
        },
        {
          t: "p",
          text: "Sobre el idioma: si la oferta está en inglés, el currículum va en inglés, incluidos los nombres de los puestos. Traducir «Responsable de Área» como «Area Manager» es correcto; inventarse un título que no existe en ese mercado, no.",
        },
      ],
      takeaway:
        "Encabezados aburridos y estándar. La creatividad va en el contenido, no en el formato.",
    },
    {
      id: "logros",
      h2: "De funciones a logros: el cambio que más pesa",
      answer:
        "Un currículum español típico describe responsabilidades; uno internacional demuestra resultados. La diferencia práctica es una cifra: cuánto, en cuánto tiempo y comparado con qué. Sin ese dato, cualquier frase suena igual en todas las candidaturas.",
      blocks: [
        {
          t: "table",
          head: ["Cómo suele escribirse", "Cómo se lee mejor"],
          rows: [
            ["Responsable de la gestión de clientes", "Gestioné una cartera de 40 cuentas y subí la renovación del 71% al 84% en un año"],
            ["Encargado de mejorar procesos internos", "Documenté seis procesos recurrentes y reduje el tiempo de entrega de 9 a 5 días"],
            ["Participé en el desarrollo de la plataforma", "Lideré la migración del checkout, con un 30% menos de errores de pago"],
          ],
        },
        {
          t: "p",
          text: "Si no tienes cifras, sirve el contexto: tamaño del equipo, volumen gestionado, alcance geográfico. Lo que no sirve es el verbo vacío. «Colaboré», «participé» y «apoyé» son los tres que más candidaturas hunden.",
        },
      ],
      takeaway:
        "Verbo al principio, cifra al final. Si no hay cifra, que haya escala.",
    },
    {
      id: "errores",
      h2: "Los errores que más descartan",
      answer:
        "Por orden de frecuencia: exportar el documento como imagen, usar plantillas de dos columnas, no repetir el vocabulario exacto de la oferta, enviar el mismo archivo a todas las vacantes y dejar el nombre del fichero sin identificar.",
      blocks: [
        {
          t: "ol",
          items: [
            "PDF exportado desde una herramienta de diseño como imagen: el filtro no extrae nada y quedas fuera sin que nadie te lea.",
            "Plantillas con barra lateral: la experiencia y la formación se leen intercaladas.",
            "Usar sinónimos en lugar del término de la oferta: si piden «Employer of Record», escribe eso y no «contratación internacional».",
            "Un único documento para todo: adaptar el titular y el resumen a cada vacante lleva diez minutos y cambia el orden en el que apareces.",
            "Nombrar el fichero «CV_final_v3.pdf»: usa nombre, apellido y puesto.",
          ],
        },
        {
          t: "quote",
          text: "El objetivo del currículum no es contar tu vida. Es conseguir que alguien decida dedicarte quince minutos.",
        },
      ],
      takeaway:
        "La mayoría de los rechazos silenciosos son problemas de formato, no de perfil.",
    },
  ],
  faqs: [
    { q: "¿Debo poner foto en un currículum internacional?", a: "En procesos anglosajones, no. Muchas empresas la eliminan por política de no discriminación y algunas descartan la candidatura. En parte de Europa continental sigue siendo habitual, así que conviene tener dos versiones." },
    { q: "¿Cuántas páginas debe tener?", a: "Una si tienes menos de diez años de experiencia, dos como máximo si tienes más. Lo que no cabe en dos páginas va al portfolio." },
    { q: "¿Word o PDF?", a: "PDF generado desde texto, salvo que la oferta pida otra cosa. Evita los PDF exportados como imagen: son ilegibles para el filtro." },
    { q: "¿Sirve de algo poner palabras clave en blanco sobre blanco?", a: "No, y es contraproducente. Los sistemas actuales lo detectan y muchas empresas lo tratan como intento de manipulación." },
    { q: "¿Cómo adapto el currículum a cada oferta sin rehacerlo?", a: "Cambia sólo el titular, el resumen de tres líneas y el orden de las herramientas para que coincidan con la oferta. El resto se mantiene." },
    { q: "¿Qué hago si tengo un hueco en el currículum?", a: "Ponerlo con una línea de contexto en lugar de esconderlo. Los huecos sin explicar generan más preguntas que los explicados." },
    { q: "¿Traduzco los nombres de mis empresas anteriores?", a: "No. El nombre propio se mantiene; lo que se traduce o se explica en una línea es el sector y el tamaño, que fuera de tu país nadie conoce." },
    { q: "¿Incluyo el nivel de idiomas con certificados?", a: "Sí, si los tienes, con el nombre del certificado y el año. Sin certificado, un nivel autodeclarado no aporta nada frente a una entrevista en ese idioma." },
    { q: "¿Es mejor un currículum en inglés o en español?", a: "En el idioma de la oferta. Si la vacante está publicada en inglés, todo el documento va en inglés, incluidos los títulos de los puestos." },
    { q: "¿La carta de presentación sigue sirviendo?", a: "Sólo si es específica. Tres líneas que conecten tu experiencia con el problema concreto de esa vacante rinden más que una carta larga y genérica." },
  ],
};
