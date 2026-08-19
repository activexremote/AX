import type { Article } from "@/app/blog/types";

export const article: Article = {
  slug: "sop-documentar-procesos",
  locale: "es",
  cluster: "negocio",
  funnel: "tofu",
  intent: "informacional",
  keyword: "cómo documentar procesos SOP",
  secondary: [
    "plantilla de sop",
    "documentar para delegar",
    "procedimiento operativo estándar ejemplo",
    "manual de procesos pequeña empresa",
    "cómo delegar tareas sin repetir explicaciones",
  ],
  title: "SOPs: documentar un proceso para poder soltarlo",
  h1: "SOPs: documentar un proceso para poder soltarlo",
  metaTitle: "Cómo documentar procesos (SOP) que otra persona pueda seguir",
  metaDescription:
    "Por qué la mayoría de manuales fallan al primer uso ajeno, qué contiene un procedimiento utilizable, cómo escribirlo mientras trabajas y cómo evitar que quede desactualizado.",
  ogTitle: "SOPs: documentar un proceso para poder soltarlo",
  ogDescription:
    "La prueba es sencilla: ¿alguien de fuera lo sigue y obtiene el mismo resultado sin preguntar nada?",
  published: "2026-08-19",
  updated: "2026-08-19",
  readingMinutes: 10,
  author: "Equipo ActiveXRemote",
  course: "remote-founder",
  terms: ["sop", "documentacion-asincrona", "automatizacion-no-code", "oferta-productizada", "solopreneur"],
  related: ["automatizar-negocio-sin-codigo", "de-freelance-a-negocio-productizado", "trabajo-asincrono-guia"],
  external: [
    { label: "ISO · Principios de gestión de la calidad", url: "https://www.iso.org" },
    { label: "Comisión Europea · Recursos de digitalización para pymes", url: "https://single-market-economy.ec.europa.eu" },
  ],
  intro: [
    "Casi todo el que ha intentado delegar ha vivido lo mismo: escribes cómo se hace algo, lo entregas, y acabas dedicando más tiempo a responder preguntas del que habría costado hacer la tarea.",
    "El documento no era el problema. Estaba escrito de memoria, en el orden en que lo recordabas, sin las decisiones que tomas sin darte cuenta de que las tomas. Aquí va qué contiene un procedimiento utilizable y cómo producir uno que sobreviva al contacto con otra persona.",
  ],
  sections: [
    {
      id: "por-que-fallan",
      h2: "Por qué fallan casi todos los manuales",
      answer:
        "Porque se escriben después, de memoria y por quien ya sabe las respuestas. La memoria suaviza las excepciones, se salta las valoraciones que se hacen en automático y describe el camino ideal como si fuera el único posible.",
      blocks: [
        {
          t: "p",
          text: "El problema de fondo tiene nombre: cuando dominas algo, las decisiones que tomas se te vuelven invisibles. No puedes recordar haber elegido, porque ya no lo vives como una elección. Esas decisiones invisibles son justo donde se atasca la siguiente persona.",
        },
        {
          t: "table",
          head: ["Lo que dice el documento", "Con qué se topa quien lo lee"],
          rows: [
            ["«Comprueba que el fichero es correcto»", "¿Correcto según qué?"],
            ["«Envíaselo al cliente»", "¿Por qué canal, con qué plantilla, con copia a quién?"],
            ["«Usa la configuración estándar»", "¿Dónde está, y estándar para qué caso?"],
            ["«Si hay algún problema, escala»", "¿Qué cuenta como problema?"],
          ],
        },
      ],
      takeaway:
        "El dominio esconde decisiones. Escribir de memoria documenta los pasos y pierde el criterio.",
    },
    {
      id: "que-contiene",
      h2: "Qué contiene un procedimiento utilizable",
      answer:
        "Cinco cosas: el disparador que lo inicia, los pasos ordenados con detalle suficiente para seguirlos sin conocimiento previo, las decisiones con sus criterios, qué suele salir mal y qué hacer entonces, y cómo se sabe que el resultado es correcto.",
      blocks: [
        {
          t: "steps",
          items: [
            { title: "El disparador", text: "Qué hace que este proceso empiece. «Cuando llega un contrato firmado» es un disparador; «alta de cliente» es un título." },
            { title: "Los pasos ordenados", text: "Numerados, una acción cada uno. Si un paso contiene una «y», probablemente son dos pasos." },
            { title: "Los puntos de decisión", text: "Dónde quien lee tiene que elegir, con los criterios que usas tú. Es la parte que la memoria omite." },
            { title: "Los fallos conocidos", text: "Qué se tuerce más a menudo y qué hacer. Convierte a un lector atascado en uno que sigue." },
            { title: "La definición de terminado", text: "Cómo puede cualquiera verificar que el resultado está bien sin preguntarte." },
          ],
        },
        {
          t: "note",
          text: "Los criterios de decisión importan más que los pasos. Los pasos se pueden deducir observando; los criterios no, y son lo que separa un documento que funciona de uno que genera preguntas.",
        },
      ],
      takeaway:
        "Disparador, pasos, decisiones con criterio, fallos conocidos y definición de terminado.",
    },
    {
      id: "como-escribir",
      h2: "Cómo escribir uno sin que te lleve una semana",
      answer:
        "Escríbelo durante la siguiente ejecución real, no como proyecto aparte. Ten un documento abierto y registra cada acción según la haces, incluidos los momentos en que te paras a decidir. Añade quizá un veinte por ciento a esa ejecución y produce algo utilizable.",
      blocks: [
        {
          t: "ol",
          items: [
            "Abre un documento en blanco antes de empezar la tarea, no al terminarla.",
            "Registra cada acción según la haces, en lenguaje llano, incluidas las obvias.",
            "Cada vez que te pares a pensar, anota qué estabas decidiendo y qué inclinó la balanza.",
            "Al final, añade la definición de terminado y lo que se torció esta vez.",
            "En la siguiente ejecución, sigue tu propio documento y corrige lo que no funcione.",
          ],
        },
        {
          t: "p",
          text: "Ese quinto paso no es opcional. La primera versión siempre tiene huecos invisibles para quien la escribió, y seguirla tú mismo es la forma más barata de encontrarlos antes de que los encuentre otra persona.",
        },
      ],
      takeaway:
        "Escribe mientras haces, después sigue tu propio documento una vez. Dos ejecuciones bastan.",
    },
    {
      id: "prueba",
      h2: "La prueba que dice si funciona",
      answer:
        "Dáselo a alguien que nunca haya hecho la tarea y obsérvale sin ayudar. Cada pregunta que haga marca un hueco. Si termina y produce el mismo resultado sin preguntar nada, el documento está listo. Hasta entonces, cada pregunta es tu siguiente corrección.",
      blocks: [
        {
          t: "p",
          text: "Resistirse a ayudar durante esa prueba es la parte difícil, y es donde está el valor. Responder de viva voz arregla ese caso concreto y deja el documento exactamente igual de roto que estaba.",
        },
        {
          t: "pros",
          pros: [
            "Observar en silencio y anotar cada pregunta.",
            "Probar con alguien que de verdad no conozca la tarea.",
            "Corregir el documento en lugar de explicar la respuesta.",
            "Volver a probar después de editar, al menos una vez.",
          ],
          cons: [
            "Probar con alguien que ya sabe hacerlo.",
            "Responder preguntas en lugar de anotarlas.",
            "Dar por claro un documento porque a ti te lo parece.",
            "Darlo por terminado tras la primera pasada.",
          ],
        },
      ],
      takeaway:
        "Cada pregunta es un hueco. Corrige el documento, no el momento.",
    },
    {
      id: "mantenimiento",
      h2: "Cómo evitar que se queden desactualizados",
      answer:
        "Un manual desactualizado es peor que no tenerlo, porque la gente lo sigue y obtiene resultados equivocados. La defensa práctica es pequeña: un responsable con nombre en cada documento, una fecha de última revisión, y la norma de que quien encuentra un error corrige el documento como parte de resolverlo.",
      blocks: [
        {
          t: "ul",
          items: [
            "Pon un responsable con nombre en cada documento. La responsabilidad compartida significa que no lo actualiza nadie.",
            "Fecha cada revisión, para que quien lea sepa cuánto fiarse.",
            "Haz que corregir el documento forme parte de resolver cualquier error, no una tarea aparte para más adelante.",
            "Borra los documentos de procesos que ya no ejecutas. Uno equivocado es peor que uno inexistente.",
          ],
        },
        {
          t: "quote",
          text: "Un documento del que nadie se fía cuesta más que no tenerlo, porque se sigue antes de descubrir que está mal.",
        },
      ],
      takeaway:
        "Responsable con nombre, fecha de revisión, y corregir el documento al corregir el error.",
    },
  ],
  faqs: [
    { q: "¿Qué es un SOP?", a: "La descripción escrita, paso a paso, de cómo se ejecuta una tarea recurrente, con detalle suficiente para que otra persona o una automatización produzca el mismo resultado sin depender de quien lo hacía." },
    { q: "¿Por qué mis manuales no funcionan cuando los entrego?", a: "Porque están escritos de memoria. Cuando dominas algo, las decisiones que tomas se te vuelven invisibles, y esas valoraciones invisibles son justo donde se atasca la siguiente persona." },
    { q: "¿Cuánto debe ocupar un SOP?", a: "Lo que necesite, pero cada paso debe ser una acción. Si un paso contiene una «y», suelen ser dos pasos, y ahí es donde quien lee pierde el hilo." },
    { q: "¿Cuándo lo escribo?", a: "Mientras ejecutas la tarea, no después. Registrar las acciones según las haces añade en torno a un veinte por ciento a esa ejecución y produce algo utilizable de inmediato." },
    { q: "¿Cómo sé si mi documento es suficientemente bueno?", a: "Dáselo a alguien que no conozca la tarea y obsérvale sin ayudar. Si produce el mismo resultado sin preguntar nada, funciona. Cada pregunta que haga es tu siguiente corrección." },
    { q: "¿Debo incluir capturas de pantalla?", a: "Con moderación, sólo para interfaces difíciles de describir. Las capturas se desactualizan antes que el texto y actualizarlas es lo que suele hacer que los documentos dejen de mantenerse." },
    { q: "¿Quién debe ser responsable de un SOP?", a: "Una sola persona con nombre. La responsabilidad compartida acaba siempre en que nadie lo actualiza, y un documento sin mantener llega a ser engañoso y no sólo incompleto." },
    { q: "¿Cada cuánto hay que revisarlos?", a: "Cuando cambie el proceso, más una comprobación periódica ligera. La regla más práctica es que quien encuentra un error corrija el documento como parte de resolverlo." },
    { q: "¿Sirven los SOP si no tengo empleados?", a: "Sí. Son lo que hace posible delegar, automatizar y vender un servicio productizado, y también lo que te permite retomar una tarea poco frecuente sin volver a aprenderla." },
    { q: "¿Qué diferencia hay entre un SOP y una lista de comprobación?", a: "Una lista confirma que se hicieron los pasos, para alguien que ya sabe cómo. Un SOP enseña a quien no sabe, y por eso necesita criterios de decisión y qué hacer cuando algo falla." },
  ],
};
