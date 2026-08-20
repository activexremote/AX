import type { Article } from "@/app/blog/types";

// Artículo de decisión final. Empuja a curso, pero el criterio tiene que
// servir también para descartarnos a nosotros: si no, no es un criterio.
export const article: Article = {
  slug: "curso-trabajo-remoto-cual-elegir",
  locale: "es",
  cluster: "empleo",
  funnel: "bofu",
  intent: "comercial",
  keyword: "curso de trabajo remoto cuál elegir",
  secondary: [
    "formación en trabajo remoto internacional",
    "merece la pena un curso de nómada digital",
    "cursos de trabajo remoto opiniones",
    "certificación trabajo remoto validez",
    "cómo saber si un curso online es bueno",
  ],
  title: "Cursos de trabajo remoto: cómo distinguir formación de humo",
  h1: "Cursos de trabajo remoto: cómo distinguir formación de humo",
  metaTitle: "Cursos de trabajo remoto: criterios para elegir sin equivocarte",
  metaDescription:
    "Ocho criterios verificables antes de pagar un curso de trabajo remoto: qué entregables produce, quién lo imparte, qué vale una certificación privada y qué promesas deberían hacerte desconfiar.",
  ogTitle: "Cursos de trabajo remoto: cómo distinguir formación de humo",
  ogDescription:
    "Ocho criterios verificables y las señales de alarma que aparecen antes de pagar.",
  published: "2026-08-18",
  updated: "2026-08-18",
  readingMinutes: 11,
  author: "Equipo ActiveXRemote",
  terms: ["trabajo-remoto", "negocio-borderless", "employer-of-record", "oferta-productizada"],
  related: ["que-es-activexremote", "trabajo-remoto-internacional-desde-espana", "conseguir-clientes-b2b-internacionales", "de-freelance-a-negocio-productizado"],
  external: [
    { label: "Comisión Europea · Marco Europeo de Cualificaciones", url: "https://europa.eu/europass/es/european-qualifications-framework-eqf" },
    { label: "Comisión Europea · Derechos del consumidor en contratos a distancia", url: "https://commission.europa.eu" },
    { label: "Cedefop · Reconocimiento del aprendizaje no formal", url: "https://www.cedefop.europa.eu" },
  ],
  intro: [
    "El sector de la formación en trabajo remoto tiene un problema: es fácil de vender y difícil de verificar. Cuando la promesa es un cambio de vida y el resultado depende de quien la compra, casi cualquier programa puede argumentar que funcionó.",
    "Esta guía propone ocho criterios que se pueden comprobar antes de pagar, y las señales que deberían hacerte desconfiar. Sirve para evaluar cualquier programa, incluido el nuestro.",
  ],
  sections: [
    {
      id: "entregables",
      h2: "Criterio 1: qué produces, no qué aprendes",
      answer:
        "La pregunta útil no es qué contenidos cubre un programa, sino qué tienes en la mano al terminar. Un curso que produce un currículum internacional, un portfolio publicado y una oferta validada es verificable; uno que produce apuntes y sensación de progreso, no.",
      blocks: [
        {
          t: "p",
          text: "Pide la lista de entregables antes de matricularte. Si la respuesta es vaga o se convierte en una descripción de temario, ya tienes información: probablemente no hay entregables, sólo módulos.",
        },
        {
          t: "table",
          head: ["Pregunta que conviene hacer", "Respuesta que tranquiliza"],
          rows: [
            ["¿Qué tendré hecho al terminar?", "Una lista concreta de artefactos, no de temas"],
            ["¿Quién los revisa?", "Una persona con nombre y función, no «la comunidad»"],
            ["¿Qué pasa si mi entrega está mal?", "Se corrige y se vuelve a entregar"],
            ["¿Puedo ver un entregable de otra convocatoria?", "Sí, anonimizado"],
          ],
        },
      ],
      takeaway:
        "Si no puedes enumerar qué tendrás hecho al terminar, no lo compres todavía.",
    },
    {
      id: "quien-imparte",
      h2: "Criterio 2: quién imparte y si se le puede verificar",
      answer:
        "Un programa serio dice quién enseña cada bloque, con nombre, función y trayectoria comprobable. Cuando el profesorado no aparece, aparece sólo como «nuestro equipo de expertos» o es una cara sin rastro profesional público, falta la parte más fácil de verificar y la más reveladora.",
      blocks: [
        {
          t: "ul",
          items: [
            "Comprueba que las personas existen fuera de la web del curso y que su trayectoria encaja con lo que enseñan.",
            "Desconfía de los equipos anónimos y de las fotos de banco de imágenes: es la señal más barata de detectar.",
            "Pregunta quién imparte en directo y quién sólo aparece en el material grabado.",
            "Mira si hay una persona responsable de la parte académica o si todo el peso está en el marketing.",
          ],
        },
      ],
      takeaway:
        "Si no puedes verificar a quien enseña, no puedes verificar nada de lo demás.",
    },
    {
      id: "certificacion",
      h2: "Criterio 3: qué vale realmente la certificación",
      answer:
        "Casi todas las certificaciones de este sector son privadas de empresa. Eso no las invalida, pero significa que no son títulos oficiales, no equivalen a un grado universitario y no habilitan para ninguna profesión regulada. Un programa honesto lo dice por escrito antes de que preguntes.",
      blocks: [
        {
          t: "p",
          text: "Una certificación privada vale lo que valga quien la emite en ese ámbito concreto. Un sello de una empresa reconocida en contratación internacional dice algo sobre los módulos de contratación internacional; no dice nada sobre los de marketing.",
        },
        {
          t: "note",
          text: "Señal de alarma: cualquier programa que insinúe equivalencia con titulaciones oficiales, use el término «oficial» de forma ambigua o mencione reconocimientos que no se pueden comprobar en la web del organismo citado.",
        },
      ],
      takeaway:
        "Pregunta quién certifica y en qué área concreta. «Certificado» a secas no significa nada.",
    },
    {
      id: "promesas",
      h2: "Criterio 4: qué se promete y qué se puede prometer",
      answer:
        "Ningún programa puede garantizar empleo, clientes ni un nivel de ingresos, porque el resultado depende del punto de partida de cada persona, de su dedicación y del mercado. Lo que sí puede comprometerse es el contenido, las horas lectivas, el acompañamiento y los entregables.",
      blocks: [
        {
          t: "pros",
          pros: [
            "Compromisos verificables: horas en directo, número de módulos, revisión de entregas, acceso al material.",
            "Datos de resultados con metodología explicada: cuántos respondieron, en qué plazo, sobre qué base.",
            "Condiciones de cancelación y desistimiento claras antes de pagar.",
            "Precio completo publicado, incluidos impuestos y plazos.",
          ],
          cons: [
            "«Garantía de empleo» o «te devolvemos el dinero si no encuentras trabajo» sin condiciones escritas.",
            "Cifras de éxito sin base ni metodología: «el 94% de nuestros alumnos».",
            "Testimonios sin apellido, sin cargo y sin forma de contrastar.",
            "Urgencia artificial permanente: la misma oferta «que termina hoy» durante meses.",
          ],
        },
      ],
      takeaway:
        "Compromiso sobre el proceso, sí. Garantía de resultado, imposible: quien la da, la incumple.",
    },
    {
      id: "formato",
      h2: "Criterio 5: formato, ritmo y acompañamiento",
      answer:
        "Un programa en directo con grupo reducido y otro grabado sin acompañamiento no son el mismo producto aunque cubran el mismo temario. La diferencia está en si alguien mira lo que entregas y te corrige, que es de donde viene casi todo el aprendizaje real.",
      blocks: [
        {
          t: "ol",
          items: [
            "Pregunta el tamaño del grupo. Un directo con doscientas personas es una conferencia, no una clase.",
            "Pregunta cuánto dura el acceso al material y si caduca.",
            "Pregunta cómo se resuelven las dudas entre sesiones y en cuánto tiempo se responden.",
            "Pregunta si las sesiones se graban y si se puede seguir en asíncrono cuando falles a una.",
            "Pregunta qué pasa si no puedes seguir el ritmo: si hay convocatoria siguiente o pierdes la plaza.",
          ],
        },
      ],
      takeaway:
        "Lo que distingue un programa de un curso grabado es si alguien corrige tus entregas.",
    },
    {
      id: "cuando-no",
      h2: "Cuándo un curso no es la respuesta",
      answer:
        "Cuando el problema es de ejecución y no de conocimiento. Si ya sabes qué hacer y no lo estás haciendo, un temario nuevo no lo cambia. También cuando el objetivo es muy concreto y acotado: para una duda puntual, una asesoría de dos horas resuelve más que catorce semanas.",
      blocks: [
        {
          t: "ul",
          items: [
            "Si tu bloqueo es de tiempo, no de método, un curso añade carga en lugar de quitarla.",
            "Si necesitas resolver una cuestión fiscal concreta, un asesor cuesta menos y responde tu caso.",
            "Si buscas red de contactos más que contenido, mira quién más está en la convocatoria antes que el temario.",
            "Si el precio compromete tu situación financiera, ningún programa lo compensa: la formación no es una apuesta.",
          ],
        },
        {
          t: "quote",
          text: "Un buen programa acorta el camino y evita errores caros. No sustituye al trabajo de recorrerlo.",
        },
      ],
      takeaway:
        "Formarse resuelve un problema de método. Si el problema es otro, la solución también.",
    },
  ],
  faqs: [
    { q: "¿Merece la pena pagar un curso de trabajo remoto?", a: "Depende de si tu bloqueo es de método o de ejecución. Si no sabes cómo se contrata internacionalmente, dónde tributas o cómo se estructura una candidatura, un programa acorta meses. Si ya lo sabes y no lo aplicas, un temario más no cambia nada." },
    { q: "¿Las certificaciones de trabajo remoto son oficiales?", a: "Casi ninguna. Son certificaciones privadas de empresa: acreditan que has completado un programa, no equivalen a un título académico y no habilitan para profesiones reguladas. Un programa honesto lo dice antes de que preguntes." },
    { q: "¿Cómo detecto un curso que promete demasiado?", a: "Por las garantías de resultado, las cifras de éxito sin metodología, los testimonios sin forma de contrastar y la urgencia permanente. Nadie puede garantizar empleo o ingresos, porque no dependen sólo del programa." },
    { q: "¿Qué debería incluir el precio?", a: "El importe total con impuestos, las condiciones de pago fraccionado si las hay, qué materiales están incluidos y durante cuánto tiempo mantienes el acceso. Si algo de eso no está publicado, pídelo por escrito antes de pagar." },
    { q: "¿Puedo cancelar si me arrepiento?", a: "Si contratas como consumidor en la Unión Europea, tienes catorce días naturales para desistir. Ojo con el contenido digital: si pides acceso inmediato dentro de ese plazo, puedes perder ese derecho, y debe advertírtelo por escrito." },
    { q: "¿Es mejor un curso en directo o grabado?", a: "Depende de si necesitas corrección. El material grabado transmite contenido; el directo con grupo reducido permite que alguien revise lo que entregas, que es de donde sale la mayor parte del aprendizaje." },
    { q: "¿Cuántas horas debería tener un programa serio?", a: "No hay un número correcto, pero conviene que se publique con claridad y que distinga horas en directo de material asíncrono. Un programa que no dice cuántas horas tiene rara vez las ha contado." },
    { q: "¿Sirven los testimonios de alumnos?", a: "Sirven si son contrastables: nombre, cargo, empresa o proyecto y alguna forma de verificar. Un testimonio anónimo con foto de archivo no aporta nada." },
    { q: "¿Y si el curso no me sirve una vez empezado?", a: "Pregunta antes de matricularte qué política existe: si hay cambio de convocatoria, si el acceso al material se mantiene y en qué condiciones. Que la respuesta esté por escrito importa más que cuál sea." },
    { q: "¿Qué preguntas debería hacer antes de pagar?", a: "Qué tendré hecho al terminar, quién imparte cada bloque, quién revisa mis entregas, cuánto dura el acceso, qué certifica exactamente el diploma y cuáles son las condiciones de cancelación. Si alguna se responde con evasivas, ya sabes algo." },
  ],
  hero: { file: "/blog/bifurcacion.svg", alt: "Diagrama: un camino que se bifurca en dos destinos distintos." },
};
