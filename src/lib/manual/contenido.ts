// ══════════════════════════════════════════════════════════
//  El manual del profesorado (playbook)
//
//  Todo lo que necesita un profesor para trabajar con el panel y preparar,
//  dar y cerrar un módulo, de principio a fin. Lo enseña /admin/manual.
//
//  De dónde sale cada cosa, para que se pueda mantener al día:
//   · el proceso de 9 pasos, los plazos (D-14 → D+7), el prompt de
//     NotebookLM, la anatomía de la sesión, los entregables y el control de
//     marca: del sistema oficial de diapositivas
//     (scripts/slide-templates/deck/guide.py). Si cambia allí, cambia aquí;
//   · lo que hace cada pantalla: del propio panel (admin/*). Si una pantalla
//     cambia, este texto tiene que cambiar con ella.
//
//  Texto con **negrita** (se pinta en ManualProfesor). Sin HTML.
//  Sólo en español: el claustro trabaja y enseña en español. La versión
//  inglesa del panel enseña esto mismo con un aviso.
// ══════════════════════════════════════════════════════════

export type Bloque =
  | { t: "p"; text: string }
  | { t: "lista"; items: string[] }
  | { t: "pasos"; items: { titulo: string; texto: string; plazo?: string; donde?: string; href?: string }[] }
  | { t: "check"; id: string; titulo: string; items: string[] }
  | { t: "tabla"; head: string[]; rows: string[][] }
  | { t: "nota"; tono: "info" | "aviso" | "ok"; titulo?: string; text: string }
  | { t: "copiar"; titulo: string; text: string }
  | { t: "atajos"; items: { label: string; href: string; desc: string }[] }
  | { t: "linea"; items: { cuando: string; que: string; donde: string }[] };

export type Capitulo = {
  id: string;
  icono: "info" | "calendario" | "chispa" | "libro" | "tareas" | "ok" | "reloj" | "usuarios" | "birrete" | "chat" | "escudo" | "lista";
  titulo: string;
  resumen: string;
  bloques: Bloque[];
};

const PROMPT_NOTEBOOKLM = `Actúa como diseñador instruccional de ActiveXRemote.

FUENTES: usa solo los documentos de este cuaderno.
FORMATO: usa el catálogo «Plantillas de diapositiva» (64 layouts, A01–I08).

Genera la escaleta del MÓDULO NN — «TÍTULO» (4 h en directo).

1. Divide la sesión en 4 bloques de 45 min + 3 ejercicios + cierre.
2. Para cada diapositiva devuelve, en este orden:
      [CÓDIGO · nombre del layout]
      etiqueta: ...
      titulo:   ...
      texto:    ...
      fuente:   ...
3. El título de cada diapositiva es una AFIRMACIÓN, no una etiqueta.
4. Máximo 40 palabras por diapositiva. Frases de menos de 20 palabras.
5. No encadenes más de 3 diapositivas de la misma familia.
6. Estructura obligatoria por bloque:
      A03 → contenido ×8-12 → F05 o H04 → I01 (ejercicio) → I06
7. Marca los medios entre corchetes: [FOTO: ...] [VÍDEO: ...] [CAPTURA: ...]
8. Tuteo. Sin emoji. Cifras en dígitos y siempre con fuente citada.

Empieza por el BLOQUE 1.`;

export const MANUAL: Capitulo[] = [
  {
    id: "bienvenida",
    icono: "info",
    titulo: "Bienvenida: cómo funciona esto",
    resumen: "Qué es el panel, qué puedes hacer tú y el resumen de todo el método en un minuto.",
    bloques: [
      {
        t: "p",
        text: "Este manual es el **playbook del profesorado** de ActiveXRemote: cómo se prepara, se da y se cierra un módulo, y cómo se trabaja con el panel en cada paso. Léelo entero una vez; después úsalo como consulta. Las casillas de las listas se quedan marcadas en tu navegador.",
      },
      {
        t: "nota",
        tono: "info",
        titulo: "El método en una frase",
        text: "Cada módulo son **4 horas en directo**, con **al menos el 40 % del tiempo en ejercicio** sobre el caso de cada alumno, **un entregable por bloque** con plazo y rúbrica, y el material en el campus **el mismo día** de la clase.",
      },
      {
        t: "p",
        text: "Como profesor, en el panel tienes cinco sitios. El resto (matrículas, usuarios, marketing, ajustes) es del equipo.",
      },
      {
        t: "atajos",
        items: [
          { label: "Resumen", href: "/admin", desc: "Lo que espera a que alguien lo mire: preguntas sin respuesta, tareas vencidas, lecciones vacías." },
          { label: "Módulos y lecciones", href: "/admin/modulos", desc: "Donde vive el contenido del campus: módulos, lecciones, audio y tests." },
          { label: "Tareas", href: "/admin/tareas", desc: "Asignar módulos a alumnos con fecha límite y seguir cómo van." },
          { label: "Guía docente", href: "/admin/guia-profesores", desc: "Material de apoyo para impartir cada módulo: diapositivas, guiones, kits." },
          { label: "Asistente", href: "/admin/asistente", desc: "Las preguntas que el chat del campus no supo contestar, y sus FAQs." },
        ],
      },
      {
        t: "check",
        id: "primer-dia",
        titulo: "Tu primer día",
        items: [
          "Entra en el panel con tu cuenta y comprueba que ves «Profesor» abajo a la izquierda.",
          "Abre la Guía docente y localiza el material de tus módulos.",
          "Abre tus módulos en «Módulos y lecciones» y pulsa «Ver en el campus» para verlos como un alumno.",
          "Pide al equipo que te añada al canal de profesores de Slack: ahí llegan los avisos del campus.",
          "Instala la tipografía Inter y descarga el catálogo de plantillas de diapositiva.",
          "Lee el capítulo «Calendario del módulo» y apunta en tu agenda las fechas de tu primer módulo.",
        ],
      },
    ],
  },
  {
    id: "calendario",
    icono: "calendario",
    titulo: "Calendario del módulo: de D-14 a D+7",
    resumen: "Los 9 pasos oficiales con sus plazos, contados desde el día de la clase (día 0).",
    bloques: [
      {
        t: "p",
        text: "Todo módulo sigue el mismo calendario. Los plazos se cuentan desde el **día de la clase (DÍA 0)**: D-7 es una semana antes; D+7, una semana después. Son 4 fases, 9 pasos y unos 14 días de trabajo.",
      },
      {
        t: "linea",
        items: [
          { cuando: "D-14 → D-10", que: "1 · Reúne las fuentes (5–12 documentos)", donde: "NotebookLM" },
          { cuando: "D-10 → D-7", que: "2 · Genera el guion por bloques", donde: "NotebookLM" },
          { cuando: "D-7", que: "3 · Elige el código de plantilla de cada diapositiva", donde: "Catálogo de plantillas" },
          { cuando: "D-7 → D-3", que: "4 · Monta el deck (40–50 diapositivas, 16:9)", donde: "PowerPoint / Slides" },
          { cuando: "D-3", que: "5 · Control de 60 segundos y PDF definitivo", donde: "Checklist" },
          { cuando: "D-3", que: "Campus: módulo y lecciones listos, revisados como alumno", donde: "Panel → Módulos" },
          { cuando: "D-3", que: "6 · Crea el Tema del módulo con el material", donde: "Google Classroom" },
          { cuando: "D-1", que: "7 · Publica la tarea: entregable, rúbrica y plazo", donde: "Google Classroom" },
          { cuando: "DÍA 0", que: "8 · Imparte 4 horas (40 % en ejercicio)", donde: "Aula en directo" },
          { cuando: "D+1 → D+7", que: "9 · Sube la grabación, corrige en 7 días y cierra", donde: "Campus + Classroom" },
        ],
      },
      {
        t: "nota",
        tono: "aviso",
        titulo: "Sin esto, el módulo no se da por entregado",
        text: "Un **deck** hecho con las plantillas oficiales, **un entregable por bloque** publicado como tarea con plazo, y **material y grabación en el campus** el mismo día de la clase.",
      },
    ],
  },
  {
    id: "preparar",
    icono: "chispa",
    titulo: "Preparar la clase: guion y diapositivas",
    resumen: "De tus fuentes al deck: NotebookLM, el prompt oficial, las plantillas y el control de 60 segundos.",
    bloques: [
      {
        t: "pasos",
        items: [
          {
            titulo: "Reúne las fuentes",
            plazo: "D-14 → D-10",
            donde: "NotebookLM",
            texto: "Abre **un cuaderno nuevo por módulo** y sube entre 5 y 12 fuentes: guía del curso, normativa, casos, informes y tus notas. Nada de mezclar módulos en un cuaderno.",
          },
          {
            titulo: "Genera el guion",
            plazo: "D-10 → D-7",
            donde: "NotebookLM",
            texto: "Pega el prompt oficial (abajo) y **pide bloque a bloque**: la salida completa se corta. Copia la escaleta a un documento y **verifica cada dato**: lo que no esté en una fuente, no entra.",
          },
          {
            titulo: "Elige los códigos",
            plazo: "D-7",
            donde: "Catálogo de plantillas",
            texto: "Asigna a cada diapositiva del guion un código de plantilla (A01, C01, F05…). No encadenes 3 de la misma familia.",
          },
          {
            titulo: "Monta el deck",
            plazo: "D-7 → D-3",
            donde: "PowerPoint / Google Slides",
            texto: "**Duplica las plantillas y escribe encima**: no diseñes desde cero. Una idea por diapositiva y menos de 40 palabras. Entre 40 y 50 diapositivas para 4 horas.",
          },
          {
            titulo: "Control de 60 segundos",
            plazo: "D-3",
            donde: "Checklist",
            texto: "Pasa la lista de marca de abajo, exporta a PDF y **ábrelo en el móvil**: si tienes que hacer zoom, no está listo.",
          },
        ],
      },
      {
        t: "nota",
        tono: "info",
        titulo: "NotebookLM es un generador de guion, nunca una fuente",
        text: "El guion lo escribe la IA; **los datos los verificas tú**. Cita siempre la fuente bajo el dato. El resumen en audio de NotebookLM no sustituye a la clase. Revisa el guion en voz alta antes de montar el deck.",
      },
      { t: "copiar", titulo: "Prompt oficial para NotebookLM (sustituye NN y TÍTULO)", text: PROMPT_NOTEBOOKLM },
      {
        t: "tabla",
        head: ["Sí se usa como fuente", "No se usa"],
        rows: [
          ["Documentos internos del curso y la guía docente", "Blogs sin fecha ni autor y contenido de terceros con copyright"],
          ["Informes con fecha y autor (Deel, Remote, OCDE…)", "Datos sin fuente: si no está en una fuente, no entra"],
          ["Casos reales anonimizados y tus propias notas", "Material de otro módulo: un cuaderno por módulo"],
        ],
      },
      {
        t: "check",
        id: "control-60",
        titulo: "Control de 60 segundos (antes de exportar el PDF)",
        items: [
          "Logo original, sin deformar ni recolorear, con su zona de respeto libre.",
          "«ActiveXRemote» escrito junto, y el pie en la misma esquina toda la sesión.",
          "Solo colores de la paleta, con un único acento: el del camino correcto.",
          "Contraste de texto suficiente y nada codificado solo por color.",
          "Máximo tres niveles por diapositiva y menos de 40 palabras.",
          "Todos los datos con fuente citada.",
          "Un entregable claro por bloque.",
          "Cierre con acción, fecha y canal.",
          "Nada de plantillas de fábrica de PowerPoint, emoji, clipart ni fotos de stock.",
          "Exportado a PDF y revisado en el móvil sin hacer zoom.",
        ],
      },
      {
        t: "nota",
        tono: "aviso",
        text: "**Regla de oro**: se copia una plantilla existente. Si tu contenido no encaja en ninguna de las 64, escribe al equipo de campus antes de inventar una.",
      },
    ],
  },
  {
    id: "campus",
    icono: "libro",
    titulo: "Montar el módulo en el campus",
    resumen: "Módulos, lecciones, contenido, audio y test en el panel, y cómo revisarlo todo como lo verá el alumno.",
    bloques: [
      {
        t: "p",
        text: "Lo que el alumno ve en el campus sale de **Módulos y lecciones**. Tiene que estar listo y revisado en **D-3**, a la vez que el material de Classroom.",
      },
      {
        t: "pasos",
        items: [
          {
            titulo: "Abre tu módulo",
            donde: "Módulos y lecciones",
            href: "/admin/modulos",
            texto: "Los módulos están agrupados por curso (Núcleo, Professional, Founder, Relámpago). Usa el buscador o el filtro «Ocultos» para encontrar el tuyo. Si no existe todavía, pide al equipo que lo cree.",
          },
          {
            titulo: "Crea las lecciones soltando tu material",
            donde: "Ficha del módulo",
            texto: "Arrastra un **PDF, Word, diapositivas o una foto de la pizarra** a la caja grande: la IA lo ordena en bloques de lección. **Nada se publica sin que lo revises**: aceptas o descartas cada bloque propuesto. El archivo no se guarda; sólo queda la lección. También puedes crear la lección a mano.",
          },
          {
            titulo: "Edita el contenido",
            donde: "Editor de lección",
            texto: "El editor tiene cuatro partes (índice fijo a la izquierda): **Datos** (título, subtítulo, duración, orden), **Contenido** (los bloques que ve el alumno), **Audio** y **Test**. El español y el inglés van en campos separados: el selector de idioma decide cuál editas.",
          },
          {
            titulo: "Añade el audio narrado",
            donde: "Editor de lección → Audio",
            texto: "Sube el audio de la lección, o genéralo con la voz del campus si el botón aparece. Cada lección debería tener su versión en audio: muchos alumnos estudian escuchando.",
          },
          {
            titulo: "Prepara el test de comprensión",
            donde: "Editor de lección → Test",
            texto: "Preguntas con varias opciones y una correcta. Se aprueba con el **80 %**. Pregunta por lo que el alumno tiene que saber hacer, no por detalles de memoria.",
          },
          {
            titulo: "Revísalo como un alumno",
            donde: "Botón «Ver en el campus»",
            texto: "Abre cada lección en el campus y léela entera. Como profesor, desde la propia lección del campus puedes **editar en línea** (barra de edición arriba) para corregir una errata sin volver al panel.",
          },
          {
            titulo: "Hazlo visible",
            donde: "Ficha del módulo",
            texto: "Un módulo **oculto** no lo ve ningún alumno. Cuando esté listo, márcalo como disponible. Lecciones vacías y módulos ocultos aparecen en el Resumen como pendientes.",
          },
        ],
      },
      {
        t: "nota",
        tono: "aviso",
        titulo: "El curso de un módulo decide quién lo ve",
        text: "Núcleo lo ven los dos caminos; Professional y Founder sólo quien tiene ese camino; Relámpago sólo quien compró ese curso. No cambies el curso de un módulo sin hablarlo con el equipo.",
      },
      {
        t: "check",
        id: "campus-listo",
        titulo: "Módulo listo en el campus (D-3)",
        items: [
          "Todas las lecciones tienen contenido (ninguna sale como «Vacía»).",
          "Títulos y subtítulos revisados en español (e inglés si aplica).",
          "Duración de cada lección puesta.",
          "Audio narrado en cada lección.",
          "Test con preguntas que miden lo importante.",
          "Revisado desde «Ver en el campus» como lo verá el alumno.",
          "Módulo marcado como disponible.",
        ],
      },
    ],
  },
  {
    id: "classroom",
    icono: "lista",
    titulo: "Classroom, tareas y entregables",
    resumen: "Cómo queda el módulo en Google Classroom y la lista cerrada de lo que entregas y cuándo.",
    bloques: [
      {
        t: "pasos",
        items: [
          {
            titulo: "Crea el Tema del módulo",
            plazo: "D-3",
            donde: "Google Classroom",
            texto: "Trabajo de clase › Crear › Tema. Nómbralo «MÓDULO NN · título». Sube el deck en PDF, la plantilla del ejercicio y las lecturas, y **programa la publicación en D-3**.",
          },
          {
            titulo: "Publica una tarea por bloque",
            plazo: "D-1",
            donde: "Google Classroom",
            texto: "Cada tarea con un **entregable concreto**, una **rúbrica de 3 criterios** y **fecha límite**. Sin fecha límite no es una tarea: es una sugerencia.",
          },
          {
            titulo: "Corrige y cierra",
            plazo: "D+1 → D+7",
            donde: "Google Classroom",
            texto: "Devuelve cada entregable corregido **en 7 días** y publica una nota de cierre con el siguiente paso.",
          },
        ],
      },
      {
        t: "tabla",
        head: ["Entregable", "Formato", "Dónde se sube", "Plazo", "Obligatorio"],
        rows: [
          ["Deck de la sesión", "PPTX + PDF · 1920 × 1080", "Campus + Classroom", "D-3", "Sí"],
          ["Guion de la sesión", "Doc con bloques y minutos", "Campus (privado)", "D-3", "Sí"],
          ["Plantilla del ejercicio", "XLSX, DOCX o Figma", "Classroom · Material", "D-3", "Sí"],
          ["Tarea con rúbrica", "Tarea de Classroom", "Classroom · Tarea", "D-1", "Sí"],
          ["Grabación de la sesión", "MP4 con subtítulos", "Campus · Módulo NN", "D+1", "Sí"],
          ["Lecturas de apoyo", "PDF o enlace con fuente", "Classroom · Material", "D-3", "No"],
        ],
      },
      {
        t: "nota",
        tono: "info",
        text: "Las **tareas del campus** (capítulo «Seguimiento de alumnos») son otra cosa: asignan un módulo del campus a un alumno con fecha límite. Las de Classroom son los entregables de cada bloque.",
      },
    ],
  },
  {
    id: "en-directo",
    icono: "reloj",
    titulo: "El día de la clase: 4 horas en directo",
    resumen: "Anatomía de la sesión, el 40 % de ejercicio y la lista de antes, durante y después.",
    bloques: [
      {
        t: "p",
        text: "Cada sesión abre con el **framework**, pasa a la **herramienta en pantalla** y termina con un **ejercicio en vivo sobre el caso de cada alumno**. El ejercicio es el contenido, no el relleno: **al menos 96 minutos** de las 4 horas.",
      },
      {
        t: "tabla",
        head: ["Tramo", "Minutos", "Diapositivas", "Plantillas"],
        rows: [
          ["Apertura", "10", "3", "A01 · A05 · A06"],
          ["Bloque 1", "45", "10–12", "A03 · B0x · C01 · F0x"],
          ["Ejercicio 1", "25", "2", "I01 · I04"],
          ["Pausa", "10", "1", "A03"],
          ["Bloque 2", "45", "10–12", "A03 · G0x · C08"],
          ["Caso real", "20", "4", "H04 · F05"],
          ["Ejercicio 2", "30", "2", "I01 · I02"],
          ["Cierre", "15", "3", "I06 · I07 · I08"],
        ],
      },
      {
        t: "lista",
        items: [
          "Un separador cada 8–12 diapositivas (A03 o A04): sin separadores, la sesión se hace plana.",
          "Una diapositiva de respiro cada 5–6: una cifra (F05), una cita (H01) o una imagen a sangre (C03).",
          "Nunca 5 diapositivas iguales seguidas: cambia de familia.",
        ],
      },
      {
        t: "check",
        id: "dia-clase",
        titulo: "El día de la clase",
        items: [
          "Material del Tema publicado en Classroom (desde D-3) y tarea publicada (D-1).",
          "Deck abierto a pantalla completa y plantilla del ejercicio a mano.",
          "Grabación en marcha desde el primer minuto.",
          "Al menos el 40 % del tiempo en ejercicio sobre el caso de cada alumno.",
          "Cada bloque termina con su entregable explicado: qué, cómo y para cuándo.",
          "Cierre con acción, fecha y canal (Slack).",
        ],
      },
      {
        t: "check",
        id: "despues-clase",
        titulo: "Después de la clase",
        items: [
          "Grabación subida al módulo en el campus (D+1), con subtítulos.",
          "Deck en PDF en el campus y en Classroom el mismo día.",
          "Entregables corregidos y devueltos en 7 días.",
          "Nota de cierre publicada con el siguiente paso.",
          "Preguntas que surgieron en clase convertidas en FAQs del asistente.",
        ],
      },
    ],
  },
  {
    id: "seguimiento",
    icono: "tareas",
    titulo: "Seguimiento de alumnos",
    resumen: "Asignar tareas del campus, ver quién va tarde y qué te llega por Slack.",
    bloques: [
      {
        t: "pasos",
        items: [
          {
            titulo: "Asigna un módulo con fecha límite",
            donde: "Tareas → Asignar tarea",
            href: "/admin/tareas",
            texto: "Elige el alumno, el módulo, la fecha límite y, si quieres, una nota. El alumno lo ve en «Mis tareas» y le llega un aviso por Slack.",
          },
          {
            titulo: "Sigue el avance",
            donde: "Tareas",
            texto: "Cada tarea muestra su progreso (lecciones hechas del módulo) y su estado: **pendiente, en curso, vence pronto, vencida o completada**. Una tarea se completa sola cuando el alumno termina todas las lecciones del módulo.",
          },
          {
            titulo: "Cambia la fecha si hace falta",
            donde: "Tareas → Editar",
            texto: "Al poner una fecha nueva, los recordatorios vuelven a empezar y una tarea vencida vuelve a pendiente.",
          },
          {
            titulo: "Mira el Resumen cada día",
            donde: "Resumen",
            href: "/admin",
            texto: "«Qué hacer ahora» junta lo que espera: tareas vencidas, preguntas del asistente sin respuesta, lecciones vacías y módulos ocultos. Cada punto lleva a donde se arregla.",
          },
        ],
      },
      {
        t: "nota",
        tono: "info",
        titulo: "Lo que te llega por Slack (canal de profesores)",
        text: "Cuando un alumno completa una lección, aprueba o suspende un test, o se le vence una tarea. Además, **cada viernes por la tarde** llega un resumen semanal. Al alumno le llegan los avisos de sus tareas y un recordatorio antes de que venzan.",
      },
      {
        t: "nota",
        tono: "aviso",
        titulo: "Misiones de los cursos relámpago",
        text: "Las entregas de misión se corrigen solas. Las que la corrección marca para **revisión manual** todavía no tienen pantalla en el panel: si te llega una, avisa al equipo.",
      },
    ],
  },
  {
    id: "guia",
    icono: "birrete",
    titulo: "La guía docente",
    resumen: "Dónde está el material para impartir cada módulo y cómo usarlo sin filtrarlo.",
    bloques: [
      {
        t: "p",
        text: "En **Guía docente** está el material de apoyo de cada módulo: diapositivas, guiones, kits de preguntas, tests y solucionarios. Busca por módulo o recurso y filtra por curso.",
      },
      {
        t: "atajos",
        items: [{ label: "Abrir la guía docente", href: "/admin/guia-profesores", desc: "Material por módulo, con buscador y filtro por curso." }],
      },
      {
        t: "nota",
        tono: "aviso",
        titulo: "Sólo para el equipo docente",
        text: "Cada recurso se abre con un **enlace que caduca en una hora**. No lo reenvíes a los alumnos: los solucionarios dejarían de servir. Si un alumno necesita un material, publícalo en Classroom o en la lección.",
      },
    ],
  },
  {
    id: "asistente",
    icono: "chat",
    titulo: "El asistente del campus",
    resumen: "Cómo mantener al día el chat que responde a los alumnos.",
    bloques: [
      {
        t: "p",
        text: "El chat del campus responde a los alumnos con lo que el equipo ha escrito: **FAQs** y **documentos**. Si no encuentra la respuesta, lo dice y la pregunta llega a una bandeja.",
      },
      {
        t: "pasos",
        items: [
          {
            titulo: "Vacía la bandeja",
            donde: "Asistente → Bandeja",
            href: "/admin/asistente",
            texto: "Cada pregunta sin respuesta es una FAQ que falta. **Crear FAQ** abre el formulario con la pregunta tal como la escribió el alumno; **Descartar** si no procede.",
          },
          {
            titulo: "Escribe FAQs cortas y exactas",
            donde: "Asistente → Preguntas frecuentes",
            texto: "Una pregunta, una respuesta directa, con fechas y enlaces concretos. Desactiva las que dejen de ser ciertas en vez de borrarlas.",
          },
          {
            titulo: "Prueba el asistente",
            donde: "Asistente → Probar",
            texto: "Pregunta como lo haría un alumno y comprueba que contesta bien antes de dar el tema por cerrado.",
          },
        ],
      },
    ],
  },
  {
    id: "estilo",
    icono: "escudo",
    titulo: "Voz, calidad y privacidad",
    resumen: "Cómo se escribe en ActiveXRemote y qué no se hace nunca.",
    bloques: [
      {
        t: "lista",
        items: [
          "**Tuteo** siempre. Frases cortas: menos de 20 palabras.",
          "**Cifras en dígitos y con fuente**. Si un dato no tiene fuente, no entra.",
          "Sin emoji y sin adjetivos de folleto: cifras y verbos.",
          "Títulos de diapositiva que **afirman** algo, no etiquetas.",
          "Un entregable claro por bloque; nada de «para casa, si os apetece».",
          "Los datos personales de los alumnos (fichas, casos) no salen del curso: nada de documentos, direcciones ni salarios en materiales compartidos.",
        ],
      },
      {
        t: "nota",
        tono: "ok",
        titulo: "Lo que define una buena clase",
        text: "El alumno sale con **algo hecho**, no con apuntes: un entregable aplicado a su caso, que ha trabajado en directo contigo.",
      },
    ],
  },
  {
    id: "ayuda",
    icono: "usuarios",
    titulo: "Dudas frecuentes y a quién acudir",
    resumen: "Respuestas rápidas a lo que más se pregunta.",
    bloques: [
      {
        t: "tabla",
        head: ["Si…", "Haz esto"],
        rows: [
          ["No ves tu módulo en «Módulos y lecciones»", "Busca en «Ocultos» o pide al equipo que lo cree."],
          ["No aparece la caja para soltar archivos", "La IA está desactivada: pide al equipo que la active (panel → Inteligencia artificial)."],
          ["Un alumno no ve un módulo", "Comprueba que el módulo está disponible y que el alumno tiene ese curso. El acceso lo da el equipo."],
          ["Quieres cambiar el curso de un módulo", "Háblalo con el equipo: cambia quién puede verlo."],
          ["Tu contenido no encaja en ninguna plantilla", "Escribe al equipo de campus antes de diseñar una nueva."],
          ["Una entrega de misión pide revisión manual", "Avisa al equipo: todavía no tiene pantalla en el panel."],
          ["Algo del panel no funciona", "Escribe al equipo por Slack con la página, lo que hiciste y una captura."],
        ],
      },
    ],
  },
];
