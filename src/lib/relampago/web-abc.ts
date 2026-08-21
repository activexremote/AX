import type { FlashCourse, FlashLesson, FlashModule, FlashUnlock } from "@/lib/relampago/types";

// ══════════════════════════════════════════════════════════
//  THE WEB ABC — Entiende. Construye. Publica.
//
//  Transcrito del máster plan del curso. El lenguaje del instructor se
//  respeta tal cual, incluido el taco del copy nuclear: es la frase que el
//  alumno ya se ha dicho a sí mismo, y suavizarla rompe el reconocimiento
//  que hace que el curso funcione.
//
//  Regla de comunicación del curso, que explica por qué cada lección tiene
//  `hook` antes que `terms`:
//
//      problema humano → concepto técnico → herramienta → demo → resultado
//
//  La parte técnica NO se recorta para que quepa el gancho. El gancho sólo
//  abre la puerta.
// ══════════════════════════════════════════════════════════

const MODULES: FlashModule[] = [
  {
    n: 1,
    slug: "web-abc-el-mapa",
    code: "MÓDULO 1 · EL MAPA",
    title: "El mapa",
    summary:
      "Qué ocurre de verdad entre que alguien escribe una URL y ve tu web. Las piezas, sus nombres y qué hace cada una.",
    lessons: [1, 2, 3],
    result: "Puedes mirar una arquitectura web y nombrar cada pieza.",
    icon: "map",
    accent: "#5B4BF5",
  },
  {
    n: 2,
    slug: "web-abc-ai-building",
    code: "MÓDULO 2 · AI BUILDING",
    title: "Construir con IA sin caja negra",
    summary:
      "Terminal, proyecto y un flujo de trabajo con Claude Code que puedes explicar línea a línea.",
    lessons: [4, 5, 6],
    result: "Construyes y modificas sin tratar la IA como una caja negra.",
    icon: "terminal",
    accent: "#7C5CFF",
  },
  {
    n: 3,
    slug: "web-abc-datos",
    code: "MÓDULO 3 · DATOS",
    title: "Dónde viven los datos",
    summary:
      "Persistencia, PostgreSQL, Supabase, esquema, CRUD inicial y cómo viaja un dato entre el formulario y la tabla.",
    lessons: [7, 8, 9, 10],
    result: "Entiendes dónde viven los datos y cómo viajan.",
    icon: "database",
    accent: "#2F6BFF",
  },
  {
    n: 4,
    slug: "web-abc-usuarios",
    code: "MÓDULO 4 · USUARIOS Y SEGURIDAD",
    title: "Usuarios y seguridad",
    summary:
      "Identidad, sesión, autorización y RLS. La diferencia entre saber quién eres y decidir qué puedes ver.",
    lessons: [11, 12, 13, 14],
    result: "Conviertes una web con formulario en una aplicación multiusuario.",
    icon: "shield",
    accent: "#14B8C4",
  },
  {
    n: 5,
    slug: "web-abc-ship",
    code: "MÓDULO 5 · SHIP",
    title: "Ponerlo online",
    summary:
      "Depuración, checkpoints de Git, deploy en Vercel, variables de entorno, dominio, DNS y hosting estático.",
    lessons: [15, 16, 17, 18, 19, 20],
    result: "Llevas el proyecto a producción y sabes explicar cómo llega el tráfico.",
    icon: "rocket",
    accent: "#FF6A3D",
  },
  {
    n: 6,
    slug: "web-abc-autonomia",
    code: "MÓDULO 6 · AUTONOMÍA",
    title: "Autonomía",
    summary:
      "De landing a producto, workflow con IA de verdad, arquitectura final y entrega.",
    lessons: [21, 22, 23, 24],
    result: "Puedes repetir el proceso entero en tu siguiente proyecto.",
    icon: "compass",
    accent: "#D61F9C",
  },
];

// El contenido de cada uno vive en src/lib/relampago/unlocks/ y se sirve desde
// /desbloqueos/<key>, que comprueba antes que quien lo pide lo haya ganado.
const UNLOCKS: FlashUnlock[] = [
  {
    key: "web-abc-starter-template",
    title: "The Web Starter Template",
    description:
      "El template oficial con la estructura base, los componentes, la configuración y la documentación. Tu punto de partida para el siguiente proyecto.",
    icon: "template",
  },
  {
    key: "web-abc-research-hack",
    title: "The Research Hack",
    description:
      "El flujo para investigar un producto, sus competidores y su documentación desde el navegador, y convertir lo que encuentras en contexto accionable para Claude Code.",
    icon: "search",
  },
  {
    key: "web-abc-prompt-pack",
    title: "AI Builder Prompt Pack",
    description:
      "Prompts para arquitectura, planificación de features, UI, Supabase, depuración, revisión de diffs, QA, SEO y deploy.",
    icon: "sparkles",
  },
  {
    key: "web-abc-tool-perks",
    title: "Tool Perks",
    description:
      "Descuentos, créditos y códigos preferenciales negociados con las herramientas del stack. Se actualiza con el tiempo.",
    icon: "gift",
  },
  {
    key: "web-abc-ship-checklist",
    title: "Ship Checklist",
    description:
      "La lista de lanzamiento: repo → env → base de datos → auth → build → deploy → dominio → DNS → SSL → QA → launch.",
    icon: "check",
  },
];

const LESSONS: FlashLesson[] = [
  {
    n: 1,
    slug: "la-web-que-ya-sabes-hacer-no-esta-terminada",
    title: "La web que ya sabes hacer no está terminada",
    hook: "Has hecho la parte que se ve. Ahora vamos a entender todo lo que no se ve.",
    minutes: 9,
    outcome: "Descubres que una web no es una cosa, sino una pila de capas con nombres propios.",
    terms: ["request", "response", "browser", "frontend", "backend", "database", "hosting", "DNS", "deploy"],
    reading: [
      "Cuando escribes una URL y pulsas enter no ocurre *una* cosa: ocurren ocho, y cada una tiene nombre.",
      "",
      "El **navegador** pide algo (*request*). Antes de poder pedirlo tiene que saber a qué máquina hablar, y eso lo resuelve el **DNS**. La máquina que responde está en algún **hosting**, y lo que devuelve (*response*) es el **frontend**: el código que se ejecuta en tu navegador y dibuja lo que ves.",
      "",
      "Si esa web guarda algo —un formulario, un usuario, un pedido— hay una **database** detrás, y algo que habla con ella en nombre del frontend: el **backend** o un servicio de datos. Y para que todo eso pase de tu carpeta a Internet hay un proceso llamado **deploy**.",
      "",
      "Tú ya sabes hacer la capa que se ve. Las otras siete existen igual, las conozcas o no.",
    ].join("\n"),
    mission: {
      brief:
        "Dibuja la arquitectura de un proyecto web —el tuyo o uno que uses a diario— nombrando las ocho piezas. A mano, en Figma o en un papel: da igual la herramienta.",
      minutes: 10,
      criterion: "Aparecen las ocho piezas con su nombre y una flecha que indique quién habla con quién.",
      evidence: "Una foto o captura del diagrama.",
    },
    quiz: [
      {
        prompt: "¿Qué capa representa lo que ve el usuario?",
        options: ["El frontend", "La database", "El DNS", "El repositorio"],
      },
      {
        prompt: "Abres una web y tarda en cargar la lista de productos, pero el menú aparece al instante. ¿Qué está pasando?",
        options: [
          "El frontend ya se ha pintado y todavía está esperando los datos que pidió",
          "El dominio todavía no ha terminado de resolverse",
          "El repositorio no tiene el último commit",
          "El build de producción no ha terminado",
        ],
      },
      {
        prompt: "¿Cuál de estas piezas NO participa en que una web esté disponible en Internet?",
        options: [
          "El editor de código con el que la escribiste",
          "El DNS",
          "El hosting",
          "El deploy",
        ],
      },
    ],
  },
  {
    n: 2,
    slug: "que-es-un-servidor",
    title: "¿Qué coño es un servidor?",
    hook: "«Funciona en localhost» no significa que esté online.",
    minutes: 9,
    outcome: "Entiendes qué ejecuta y qué entrega un servidor, y por qué localhost sólo existe para ti.",
    terms: ["server", "process", "runtime", "request", "response", "static vs dynamic", "localhost"],
    reading: [
      "Un servidor no es una caja mágica en un sótano: es **un programa en ejecución** que está esperando peticiones y sabe responderlas.",
      "",
      "Cuando arrancas `npm run dev` y ves `localhost:3000`, tu propio ordenador se ha convertido en servidor. El **proceso** está vivo, el **runtime** ejecuta tu código y responde a cada *request* con una *response*. Funciona perfectamente… para ti. `localhost` significa literalmente «esta máquina»: nadie más en el mundo puede resolver esa dirección.",
      "",
      "Poner algo online es conseguir que **otra** máquina, encendida siempre y con una dirección pública, haga ese mismo trabajo.",
      "",
      "De ahí la distinción que vas a usar todo el curso: contenido **estático** (archivos ya hechos que sólo hay que entregar) frente a **dinámico** (algo que se calcula en el momento de cada petición).",
    ].join("\n"),
    mission: {
      brief:
        "Arranca tu proyecto en local y abre una web pública cualquiera. Explica en cinco líneas qué está pasando en cada caso y por qué tu URL no la puede abrir nadie más.",
      minutes: 8,
      criterion: "La explicación distingue request/response y dice qué aporta el hosting.",
      evidence: "Tu explicación + una captura de la terminal y del navegador.",
    },
    quiz: [
      {
        prompt: "¿localhost es Internet?",
        options: [
          "No: es tu propia máquina y sólo tú puedes resolverla",
          "Sí, si el proyecto está en marcha",
          "Sí, siempre que tengas conexión",
          "Sólo si has hecho commit",
        ],
      },
      {
        prompt: "Tu proyecto funciona en localhost:3000 y le mandas esa dirección a un cliente. ¿Qué verá?",
        options: [
          "Un error: en su máquina esa dirección no lleva a tu proyecto",
          "Tu proyecto, porque localhost es una dirección pública",
          "Tu proyecto, pero más lento",
          "Una versión antigua del proyecto",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre un archivo y un servidor?",
        options: [
          "El archivo es contenido; el servidor es un programa en marcha que lo entrega cuando se lo piden",
          "Ninguna: un servidor es una carpeta de archivos",
          "El archivo está online y el servidor en local",
          "El servidor es el disco duro donde se guarda el archivo",
        ],
      },
    ],
  },
  {
    n: 3,
    slug: "github-para-que-sirve-realmente",
    title: "GitHub, ¿para qué sirve realmente?",
    hook: "GitHub guarda tu código; no es automáticamente tu backend.",
    minutes: 10,
    outcome: "Separas control de versiones de hosting, dos cosas que casi todo el mundo confunde al empezar.",
    terms: ["git init", "clone", "status", "add", "commit", "push", "remote", "branch"],
    reading: [
      "**Git** es un sistema de control de versiones que corre en tu ordenador: guarda el historial de tu proyecto en instantáneas llamadas *commits*. **GitHub** es un sitio donde alojar ese historial para tenerlo a salvo y compartirlo.",
      "",
      "Fíjate en lo que no ha aparecido en ninguna de las dos frases: **servir tu web a nadie**. Subir código a GitHub no lo pone online. Son cosas distintas que a veces se conectan (más adelante Vercel leerá tu repo para desplegarlo), pero no son la misma.",
      "",
      "El ciclo mínimo que vas a repetir cien veces:",
      "",
      "```bash",
      "git status              # qué ha cambiado",
      "git add .               # qué quiero guardar",
      "git commit -m \"...\"     # guardarlo con un mensaje",
      "git push                # mandarlo al remoto",
      "```",
      "",
      "Un *commit* es un punto de recuperación. Cuantos más tengas, menos miedo te da romper algo.",
    ].join("\n"),
    mission: {
      brief:
        "Crea un repositorio en GitHub para tu proyecto, súbelo y deja al menos tres commits con mensajes que se entiendan sin abrir el código.",
      minutes: 10,
      criterion: "El repo existe, es accesible y tiene tres commits con mensajes descriptivos.",
      evidence: "La URL del repositorio.",
    },
    quiz: [
      {
        prompt: "¿Qué hace un commit?",
        options: [
          "Guarda un punto de recuperación en el historial de Git",
          "Publica la web en Internet",
          "Crea una copia de la base de datos",
          "Reinicia el servidor de desarrollo",
        ],
      },
      {
        prompt: "Has roto el proyecto tocando tres archivos y quieres volver a como estaba hace una hora. ¿Qué te salva?",
        options: [
          "Un commit anterior, si lo hiciste",
          "El historial de deshacer del editor",
          "Volver a desplegar en Vercel",
          "Restaurar una copia de la base de datos",
        ],
      },
      {
        prompt: "Has subido tu código a GitHub. ¿Ya está tu web online?",
        options: [
          "No: GitHub guarda el código, no lo sirve a los visitantes",
          "Sí, GitHub publica automáticamente cualquier repositorio",
          "Sí, en cuanto el repositorio sea público",
          "Sí, pero sólo la página de inicio",
        ],
      },
    ],
  },
  {
    n: 4,
    slug: "claude-code-y-warp",
    title: "Claude Code + Warp",
    hook: "No le pidas que haga magia. Dale contexto y verifica.",
    minutes: 11,
    outcome: "Trabajas con IA siguiendo un flujo controlado en el que puedes explicar cada cambio.",
    terms: ["terminal", "filesystem", "package manager", "scripts", "context", "diff"],
    reading: [
      "El flujo que vas a usar el resto del curso tiene siempre la misma forma:",
      "",
      "**abrir → inspeccionar → planificar → cambiar una pieza → ejecutar → probar → revisar el diff → commit**.",
      "",
      "Las tres reglas que separan usar IA de depender de ella:",
      "",
      "1. **Contexto antes que orden.** «Hazme un login» produce basura. «Este proyecto usa Next y Supabase, el cliente está en `lib/supabase`, quiero un login por email; explícame qué archivos vas a tocar» produce algo revisable.",
      "2. **Cambios pequeños.** Un cambio grande que no entiendes es deuda, no velocidad.",
      "3. **Revisa el diff.** El *diff* es la lista exacta de lo que ha cambiado. Si no lo lees, no sabes qué has aceptado.",
      "",
      "Y la regla que las resume: **no aceptes una solución que no puedas explicar**. Si no puedes, pide que te la explique antes de seguir.",
    ].join("\n"),
    mission: {
      brief:
        "Pídele a Claude Code un cambio pequeño y concreto en tu proyecto. Lee el diff entero antes de aceptarlo y escribe en dos líneas qué ha cambiado y por qué funciona.",
      minutes: 12,
      criterion: "Hay un commit con el cambio y una explicación propia del diff, no copiada de la respuesta.",
      evidence: "El commit + tu explicación.",
    },
    quiz: [
      {
        prompt: "¿Por qué revisar el diff?",
        options: [
          "Para entender y verificar exactamente qué ha cambiado",
          "Porque sin revisarlo Git no deja hacer commit",
          "Para que el cambio se despliegue antes",
          "Para reducir el tamaño del repositorio",
        ],
      },
      {
        prompt: "Le pides a la IA una funcionalidad y te devuelve 400 líneas en seis archivos. ¿Qué haces?",
        options: [
          "Pedirle el plan y trocearlo en cambios pequeños que puedas verificar",
          "Aceptarlo: si funciona al probarlo, está bien",
          "Aceptarlo y hacer commit para no perderlo",
          "Descartarlo y escribirlo a mano",
        ],
      },
      {
        prompt: "¿Qué aporta el diff que no aporta probar la web en el navegador?",
        options: [
          "Te dice qué se ha cambiado exactamente, incluido lo que aún no se ve",
          "Te dice si el diseño ha quedado bien",
          "Te dice si el servidor está encendido",
          "Te dice cuánto va a tardar el build",
        ],
      },
    ],
  },
  {
    n: 5,
    slug: "primera-version",
    title: "Primera versión",
    hook: "Antes de añadir nada, entiende qué archivo hace qué.",
    minutes: 10,
    outcome: "Creas un frontend funcional y sabes qué papel juega cada carpeta del proyecto.",
    terms: ["project structure", "components", "routes", "assets", "dependencies", "env"],
    reading: [
      "Un proyecto moderno no es una carpeta con `index.html`. Tiene una estructura que se repite casi igual en todas partes:",
      "",
      "- **rutas**: qué URL enseña qué pantalla;",
      "- **componentes**: trozos de interfaz reutilizables;",
      "- **assets**: imágenes, fuentes, iconos;",
      "- **dependencias**: `package.json` dice de qué código ajeno depende el tuyo, y los *scripts* dicen cómo se arranca;",
      "- **configuración de entorno**: valores que cambian entre tu máquina y producción.",
      "",
      "El comando que lo arranca todo es un *script*, normalmente `npm run dev`. No es un comando mágico del sistema: está escrito en tu `package.json` y puedes leerlo.",
      "",
      "Empieza el proyecto **LeadFlow**, el mini SaaS que vas a construir durante el curso: una landing pública con un formulario de leads y, más adelante, un panel privado para gestionarlos.",
    ].join("\n"),
    mission: {
      brief:
        "Crea el proyecto, arranca el servidor de desarrollo y deja la landing de LeadFlow con su titular y su formulario (todavía sin guardar nada).",
      minutes: 15,
      criterion: "El servidor arranca sin errores y la interfaz se ve en el navegador.",
      evidence: "Captura del navegador con la URL visible + el repo actualizado.",
    },
    quiz: [
      {
        prompt: "¿Dónde viven los componentes de interfaz?",
        options: [
          "En el frontend, dentro del proyecto",
          "En la base de datos",
          "En el DNS",
          "En las variables de entorno",
        ],
      },
      {
        prompt: "Quieres saber con qué comando se arranca un proyecto que acabas de clonar. ¿Dónde miras?",
        options: [
          "En los scripts de package.json",
          "En el panel de Vercel",
          "En el editor de tablas de Supabase",
          "En los registros DNS del dominio",
        ],
      },
      {
        prompt: "¿Qué distingue una dependencia de un archivo tuyo del proyecto?",
        options: [
          "La dependencia es código ajeno que declaras y se instala; tu archivo lo escribes y versionas tú",
          "La dependencia va en el frontend y tu archivo en el backend",
          "La dependencia se guarda en la base de datos",
          "No hay diferencia: node_modules es parte de tu código",
        ],
      },
    ],
  },
  {
    n: 6,
    slug: "frontend",
    title: "Frontend",
    hook: "Lo que ves en pantalla no es donde viven los datos.",
    minutes: 9,
    outcome: "Distingues interfaz, lógica y datos, y sabes qué desaparece al recargar.",
    terms: ["DOM", "component", "CSS", "state", "event", "fetch"],
    reading: [
      "El frontend hace tres cosas distintas que conviene no mezclar en la cabeza:",
      "",
      "- **pinta** (DOM y CSS),",
      "- **reacciona** (eventos: un clic, una tecla, un envío),",
      "- **recuerda mientras está abierto** (*state*).",
      "",
      "Ese último punto es el que más confusión genera. El *state* de un formulario vive en la memoria del navegador: si recargas la página, se ha ido. No es un fallo, es su naturaleza. Es memoria de trabajo, no memoria a largo plazo.",
      "",
      "Cuando el frontend necesita algo de fuera, lo pide con `fetch`: una petición a otra máquina que devuelve datos, normalmente en JSON.",
      "",
      "Guarda esta frase para la lección 7: **si quieres que mañana siga ahí, el state no te sirve**.",
    ].join("\n"),
    mission: {
      brief:
        "Haz que tu formulario tenga estado real: que los campos se controlen, que el botón se deshabilite mientras envía y que aparezca un mensaje al terminar.",
      minutes: 10,
      criterion: "Se ve un cambio de estado en pantalla al interactuar.",
      evidence: "Captura del antes y el después + commit.",
    },
    quiz: [
      {
        prompt: "¿Dónde vive el estado temporal de un formulario?",
        options: [
          "En el cliente: la memoria del navegador",
          "En la base de datos",
          "En el repositorio de GitHub",
          "En el servidor DNS",
        ],
      },
      {
        prompt: "Rellenas medio formulario, recargas la página y los campos aparecen vacíos. ¿Es un fallo?",
        options: [
          "No: el state vive en la memoria del navegador y se pierde al recargar",
          "Sí: la base de datos no ha guardado los datos",
          "Sí: falta desplegar la última versión",
          "Sí: el servidor ha rechazado la petición",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre el state de un formulario y una fila de la base de datos?",
        options: [
          "El state dura mientras la página está abierta; la fila sigue ahí mañana",
          "Ninguna: el state se guarda automáticamente en la base",
          "El state es más rápido porque está comprimido",
          "La fila sólo existe mientras haya sesión iniciada",
        ],
      },
    ],
  },
  {
    n: 7,
    slug: "que-es-una-base-de-datos",
    title: "¿Qué es una base de datos?",
    hook: "Si cierras el navegador y quieres que mañana siga ahí, necesitas persistencia.",
    minutes: 10,
    outcome: "Entiendes qué es persistir y sabes diseñar una tabla con sus campos y su identificador.",
    terms: ["database", "schema", "table", "row", "column", "primary key", "persistence"],
    reading: [
      "Una base de datos es **la memoria organizada de tu producto**. Organizada es la palabra importante: no guarda cosas sueltas, guarda cosas con forma.",
      "",
      "- La **tabla** es el tipo de cosa que guardas (`leads`).",
      "- La **columna** es un dato de esa cosa (`email`), y tiene un **tipo** (texto, número, fecha).",
      "- La **fila** es una cosa concreta (el lead de María).",
      "- La **primary key** es el identificador único de cada fila. Sin ella no puedes referirte a un registro concreto sin ambigüedad.",
      "",
      "Al conjunto de tablas y columnas se le llama **esquema**. Diseñar el esquema es decidir qué guarda tu producto antes de escribir el código que lo guarda, y es donde se ganan o se pierden las tardes.",
    ].join("\n"),
    mission: {
      brief:
        "Diseña sobre papel la tabla `leads`: qué columnas necesita, de qué tipo es cada una y cuál es su identificador.",
      minutes: 10,
      criterion: "Aparecen la tabla, un ID y los campos con su tipo.",
      evidence: "Captura o foto del esquema.",
    },
    quiz: [
      {
        prompt: "¿Qué aporta la persistencia?",
        options: [
          "Que los datos sobrevivan al cierre del navegador",
          "Que la web cargue más rápido",
          "Que el código quede versionado",
          "Que el dominio apunte al hosting",
        ],
      },
      {
        prompt: "Vas a guardar contactos con nombre, email y empresa. ¿Qué te falta por decidir antes de escribir código?",
        options: [
          "El identificador único de cada contacto y el tipo de cada campo",
          "El color de los botones del formulario",
          "El dominio desde el que se accederá",
          "El proveedor de hosting",
        ],
      },
      {
        prompt: "¿Qué hace una primary key que no hace un campo normal?",
        options: [
          "Identifica una fila de forma única para poder referirse a ella sin ambigüedad",
          "Ordena la tabla alfabéticamente",
          "Impide que el campo quede vacío",
          "Cifra el contenido de la fila",
        ],
      },
    ],
  },
  {
    n: 8,
    slug: "supabase",
    title: "Supabase",
    hook: "Supabase no es sólo una base de datos: nos da servicios alrededor.",
    minutes: 10,
    outcome: "Creas una base PostgreSQL real y entiendes qué servicios vienen con ella.",
    terms: ["project", "PostgreSQL", "table editor", "SQL", "API URL", "keys"],
    reading: [
      "Supabase te da un **PostgreSQL** de verdad —una de las bases de datos relacionales más sólidas que existen— y, encima, un conjunto de servicios que te ahorran escribir un backend entero: una **API** automática sobre tus tablas, **autenticación**, almacenamiento de archivos y reglas de acceso.",
      "",
      "Eso te deja dos llaves que hay que distinguir bien desde el primer día:",
      "",
      "- La **anon key** es pública. Viaja al navegador. No es un secreto, y por eso el acceso real no puede depender de ella (lección 12).",
      "- La **service role key** se salta todas las reglas de acceso. **Nunca** sale del servidor. Si acaba en el frontend o en un commit, tu base de datos es de todo el mundo.",
      "",
      "Puedes crear tablas desde el editor visual o escribiendo SQL. Las dos cosas acaban en el mismo sitio.",
    ].join("\n"),
    mission: {
      brief:
        "Crea el proyecto en Supabase y la tabla `leads` con los campos que diseñaste en la lección anterior.",
      minutes: 10,
      criterion: "La tabla existe con sus campos y sus tipos.",
      evidence: "Captura del esquema en Supabase (sin enseñar ninguna clave).",
    },
    quiz: [
      {
        prompt: "¿Qué base de datos usa Supabase?",
        options: ["PostgreSQL", "MongoDB", "MySQL", "SQLite"],
      },
      {
        prompt: "Vas a añadir la URL y la clave de Supabase a tu proyecto. ¿Cuál puede acabar en el código del navegador?",
        options: [
          "La anon key: es pública por diseño y por eso el acceso real lo decide RLS",
          "La service role key, porque es la que da acceso a las tablas",
          "Ninguna de las dos: siempre van en el servidor",
          "Las dos: son públicas mientras el proyecto sea privado",
        ],
      },
      {
        prompt: "Supabase te da base de datos, autenticación y APIs. ¿Cuál de estas cosas NO hace?",
        options: [
          "Registrar y gestionar tu nombre de dominio",
          "Guardar filas en tablas",
          "Crear y validar sesiones de usuario",
          "Aplicar reglas de acceso por fila",
        ],
      },
    ],
  },
  {
    n: 9,
    slug: "la-web-recuerda",
    title: "La web recuerda",
    hook: "Aquí es donde tu web deja de olvidarlo todo al recargar.",
    minutes: 10,
    outcome: "Conectas el formulario con la base de datos y ves el dato aparecer en la tabla.",
    terms: ["insert", "select", "query", "response", "error handling"],
    reading: [
      "Éste es el momento en que las dos mitades del curso se tocan. El formulario deja de guardar en la memoria del navegador y empieza a guardar en una tabla.",
      "",
      "La operación que crea una fila se llama **INSERT**. La que lee se llama **SELECT**. Los nombres vienen de SQL y son los mismos en cualquier base de datos relacional del mundo.",
      "",
      "Lo que casi nadie hace la primera vez y hay que hacer desde el principio: **gestionar el error**. Una escritura puede fallar por diez motivos —sin red, campo obligatorio vacío, permiso denegado— y una interfaz que se queda muda cuando falla es peor que una que no guarda.",
      "",
      "Tres estados, siempre: *enviando*, *guardado*, *ha fallado y esto es lo que pasó*.",
    ].join("\n"),
    mission: {
      brief:
        "Conecta el formulario a Supabase: al enviarlo, la fila tiene que aparecer en la tabla. Muestra confirmación al usuario y gestiona el caso de error.",
      minutes: 15,
      criterion: "Hay una fila persistida de verdad y la interfaz responde tanto al éxito como al fallo.",
      evidence: "Captura de la fila en la tabla + la URL del proyecto.",
    },
    quiz: [
      {
        prompt: "¿Qué operación crea un registro?",
        options: ["INSERT", "SELECT", "DEPLOY", "COMMIT"],
      },
      {
        prompt: "El formulario dice «guardado» pero la tabla sigue vacía. ¿Por dónde empiezas?",
        options: [
          "Por mirar la respuesta de la petición: probablemente hay un error que no se está gestionando",
          "Por volver a desplegar el proyecto",
          "Por cambiar el nombre de la tabla",
          "Por borrar la caché del navegador",
        ],
      },
      {
        prompt: "¿Qué operación usarías para leer los contactos ya guardados?",
        options: [
          "SELECT",
          "INSERT",
          "COMMIT",
          "DEPLOY",
        ],
      },
    ],
  },
  {
    n: 10,
    slug: "apis-sin-humo",
    title: "APIs sin humo",
    hook: "Una API es el contrato por el que una parte le habla a otra.",
    minutes: 9,
    outcome: "Lees una petición real y sabes decir qué método usa, qué devuelve y si ha ido bien.",
    terms: ["endpoint", "HTTP", "GET", "POST", "PATCH", "DELETE", "JSON", "status codes"],
    reading: [
      "Una **API** es un conjunto de direcciones (*endpoints*) a las que puedes hablar y un acuerdo sobre cómo hacerlo. Ese acuerdo, en la web, se llama **HTTP**.",
      "",
      "El **método** dice qué quieres hacer:",
      "",
      "| Método | Intención |",
      "|---|---|",
      "| `GET` | dame |",
      "| `POST` | crea |",
      "| `PATCH` | modifica un trozo |",
      "| `DELETE` | borra |",
      "",
      "El **status code** de la respuesta dice cómo ha ido: `2xx` bien, `4xx` la petición estaba mal (`401` no sé quién eres, `403` sé quién eres y no puedes), `5xx` el fallo es del otro lado.",
      "",
      "Y **JSON** es simplemente el formato en el que viajan los datos. No es un lenguaje ni una tecnología: es una forma de escribir un objeto en texto.",
      "",
      "Abre la pestaña **Network** del navegador mientras envías tu formulario. Todo esto está ahí, ocurriendo.",
    ].join("\n"),
    mission: {
      brief:
        "Localiza en la pestaña Network la petición que crea un lead. Explica qué método usa, qué manda, qué devuelve y qué status code recibe.",
      minutes: 10,
      criterion: "La explicación identifica correctamente método, cuerpo, respuesta y código.",
      evidence: "Captura de Network + tu explicación.",
    },
    quiz: [
      {
        prompt: "¿Qué contiene normalmente un JSON?",
        options: [
          "Datos estructurados en pares clave-valor",
          "Código ejecutable del servidor",
          "El historial de commits",
          "Los registros DNS del dominio",
        ],
      },
      {
        prompt: "Ves en Network una petición que devuelve 401. ¿Qué significa?",
        options: [
          "Que la petición no va identificada: el servidor no sabe quién eres",
          "Que el servidor se ha caído",
          "Que la ruta no existe",
          "Que los datos se han guardado correctamente",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre una API y una base de datos?",
        options: [
          "La API es la puerta por la que se piden las cosas; la base de datos es donde están guardadas",
          "Son lo mismo con distinto nombre",
          "La API guarda los datos y la base de datos los sirve",
          "La API es del frontend y la base de datos del navegador",
        ],
      },
    ],
  },
  {
    n: 11,
    slug: "usuarios",
    title: "Usuarios",
    hook: "¿Cómo sabe la web quién soy?",
    minutes: 11,
    outcome: "Implementas registro, login y logout, y entiendes qué es una sesión.",
    terms: ["signup", "login", "logout", "session", "user id", "protected UI"],
    reading: [
      "**Autenticación** es responder a una sola pregunta: *¿quién eres?*",
      "",
      "El flujo es siempre el mismo. Alguien se registra (*signup*) y queda creado un usuario con un **id** único. Cuando vuelve e inicia sesión (*login*), el servidor le entrega una **sesión**: una credencial temporal que su navegador guarda y adjunta en cada petición siguiente. Cerrar sesión (*logout*) es tirarla.",
      "",
      "Ese `user_id` es la pieza que lo cambia todo, porque a partir de ahora cada lead puede tener dueño.",
      "",
      "Y aquí va el aviso más importante del módulo: **esconder un botón no es seguridad**. Una interfaz protegida sólo protege la vista. Quien sepa hacer una petición a mano se la salta entera. Lo de verdad viene en la lección siguiente.",
    ].join("\n"),
    mission: {
      brief:
        "Implementa registro, inicio y cierre de sesión en LeadFlow, y haz que el panel sólo se vea con sesión iniciada.",
      minutes: 15,
      criterion: "Los tres flujos funcionan y sin sesión no se llega al panel.",
      evidence: "Capturas de los tres estados + la URL.",
    },
    quiz: [
      {
        prompt: "¿Qué identifica al usuario entre peticiones?",
        options: [
          "La sesión, ligada a su user id",
          "La dirección IP del navegador",
          "El nombre del repositorio",
          "La primary key de la tabla leads",
        ],
      },
      {
        prompt: "Escondes el enlace al panel cuando no hay sesión. ¿Están protegidos los datos?",
        options: [
          "No: esconder la interfaz no impide que alguien pida los datos directamente",
          "Sí: sin enlace no hay forma de llegar",
          "Sí, si además el proyecto está desplegado en producción",
          "Sí, siempre que el repositorio sea privado",
        ],
      },
      {
        prompt: "Un usuario ha iniciado sesión. ¿Qué hace la sesión que no hace el registro?",
        options: [
          "Mantener identificado a ese usuario en las peticiones siguientes",
          "Crear su fila en la tabla de usuarios",
          "Cifrar su contraseña",
          "Darle permisos de administrador",
        ],
      },
    ],
  },
  {
    n: 12,
    slug: "seguridad-basica",
    title: "Seguridad básica",
    hook: "Login no significa que los datos estén protegidos.",
    minutes: 10,
    outcome: "Escribes tu primera policy de RLS y compruebas que un usuario no ve los datos de otro.",
    terms: ["Row Level Security", "policies", "auth.uid()", "least privilege", "authorization"],
    reading: [
      "**Autenticación** es *quién eres*. **Autorización** es *qué puedes ver o hacer*. Son dos cosas distintas y sólo la primera la resuelve el login.",
      "",
      "**RLS** (*Row Level Security*) es autorización aplicada fila a fila, dentro de la propia base de datos. No en tu código de frontend, no en tu backend: en la base. Da igual desde dónde llegue la petición.",
      "",
      "Una **policy** es la regla. La más común es también la más útil:",
      "",
      "```sql",
      "create policy \"cada uno ve los suyos\" on leads",
      "  for select using (user_id = auth.uid());",
      "```",
      "",
      "`auth.uid()` es el id del usuario que está haciendo la petición **ahora mismo**. Si no coincide con el dueño de la fila, la fila no existe para él.",
      "",
      "El principio que hay debajo se llama **least privilege**: por defecto no se puede nada, y se abre sólo lo justo.",
    ].join("\n"),
    mission: {
      brief:
        "Activa RLS en `leads` y escribe la policy que hace que cada usuario sólo vea los suyos. Compruébalo con dos cuentas distintas.",
      minutes: 15,
      criterion: "La policy existe y la prueba demuestra que un usuario no ve los leads del otro.",
      evidence: "Captura de la policy + prueba con dos usuarios + tu explicación.",
    },
    quiz: [
      {
        prompt: "¿Qué restringe RLS?",
        options: [
          "El acceso a filas concretas de una tabla",
          "El número de peticiones por minuto",
          "Los puertos abiertos del servidor",
          "El tamaño máximo de la base de datos",
        ],
      },
      {
        prompt: "Quieres que cada usuario vea sólo sus propios contactos. ¿Qué escribes?",
        options: [
          "Una policy que compare el user_id de la fila con auth.uid()",
          "Un filtro en la consulta del frontend",
          "Una comprobación en el componente antes de pintar la lista",
          "Una variable de entorno con la lista de usuarios",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre autenticación y autorización?",
        options: [
          "La autenticación dice quién eres; la autorización, qué puedes ver o hacer",
          "Son dos nombres para el login",
          "La autenticación es del servidor y la autorización del navegador",
          "La autorización ocurre antes de la autenticación",
        ],
      },
    ],
  },
  {
    n: 13,
    slug: "dashboard",
    title: "Dashboard",
    hook: "Cada estado tiene que existir y tiene que verse.",
    minutes: 10,
    outcome: "Consumes datos reales y representas los cuatro estados que toda lista tiene.",
    terms: ["list rendering", "loading", "empty", "error", "detail"],
    reading: [
      "Una lista de datos no tiene un estado: tiene cuatro, y los cuatro ocurren de verdad.",
      "",
      "- **Cargando**: la petición está en marcha. Sin esto la pantalla parpadea o parece rota.",
      "- **Vacío**: la petición fue bien y no hay nada. Es el estado que más se olvida y el primero que ve un usuario nuevo, así que es donde va la invitación a crear el primero.",
      "- **Error**: algo falló. Di qué y ofrece reintentar.",
      "- **Con datos**: lo único que casi todo el mundo diseña.",
      "",
      "El **detalle** es la otra mitad: desde la lista se entra a un elemento concreto, normalmente por su id.",
      "",
      "Un panel que sólo contempla «con datos» se rompe el primer día para el primer usuario.",
    ].join("\n"),
    mission: {
      brief:
        "Construye el panel de leads del usuario con los cuatro estados y una vista de detalle.",
      minutes: 15,
      criterion: "Se pueden provocar y ver los cuatro estados.",
      evidence: "La URL + capturas de cada estado.",
    },
    quiz: [
      {
        prompt: "¿Qué estado aparece cuando la consulta va bien pero no hay registros?",
        options: ["El estado vacío", "El estado de error", "El estado de carga", "Un 404"],
      },
      {
        prompt: "Un usuario nuevo entra en el panel y todavía no ha creado nada. ¿Qué tiene que ver?",
        options: [
          "Un estado vacío que le explique qué es esto y le invite a crear el primero",
          "Una lista en blanco, sin más",
          "Un mensaje de error",
          "Un indicador de carga permanente",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre el estado vacío y el estado de error?",
        options: [
          "El vacío significa que la consulta fue bien y no hay nada; el error, que la consulta falló",
          "Son el mismo estado con distinto texto",
          "El vacío ocurre sin conexión y el error con conexión",
          "El error sólo aparece si no has iniciado sesión",
        ],
      },
    ],
  },
  {
    n: 14,
    slug: "crud",
    title: "CRUD",
    hook: "Cuatro letras que vas a reconocer en todos los productos del resto de tu vida.",
    minutes: 10,
    outcome: "Completas las cuatro operaciones sobre tus datos y entiendes que ese patrón está en todas partes.",
    terms: ["create", "read", "update", "delete", "filters"],
    reading: [
      "**CRUD** es *Create, Read, Update, Delete*. Es el patrón que hay debajo de casi cualquier aplicación con datos: un gestor de tareas, una tienda, un CRM, tu propio LeadFlow.",
      "",
      "Cada letra tiene su operación en la base y su método HTTP:",
      "",
      "| Acción | SQL | HTTP |",
      "|---|---|---|",
      "| Crear | `INSERT` | `POST` |",
      "| Leer | `SELECT` | `GET` |",
      "| Modificar | `UPDATE` | `PATCH` |",
      "| Borrar | `DELETE` | `DELETE` |",
      "",
      "Dos avisos prácticos. **Borrar es definitivo**: si el dato importa, plantéate marcarlo como archivado en vez de eliminarlo. Y **filtrar es leer con condiciones**, no una funcionalidad aparte: es un `SELECT` con un `where`.",
      "",
      "Y todo esto pasa por RLS. Si tu policy sólo cubre `select`, tu `update` está abierto.",
    ].join("\n"),
    mission: {
      brief:
        "Completa el CRUD de leads: editar, borrar y al menos un filtro por estado. Comprueba que las policies cubren las cuatro operaciones.",
      minutes: 20,
      criterion: "Las cuatro operaciones funcionan y el filtro devuelve lo que debe.",
      evidence: "La URL + capturas de cada operación.",
    },
    quiz: [
      {
        prompt: "¿Qué significa CRUD?",
        options: [
          "Create, Read, Update, Delete",
          "Commit, Run, Update, Deploy",
          "Cache, Route, User, Data",
          "Client, Runtime, URL, Domain",
        ],
      },
      {
        prompt: "Tienes una policy que cubre la lectura y añades el botón de borrar. ¿Qué falta?",
        options: [
          "Una policy para delete: cada operación necesita la suya",
          "Nada: la policy de lectura cubre todas las operaciones",
          "Volver a desplegar el proyecto",
          "Añadir una nueva columna a la tabla",
        ],
      },
      {
        prompt: "¿Qué operación de CRUD corresponde a editar el email de un contacto?",
        options: [
          "Update",
          "Create",
          "Read",
          "Delete",
        ],
      },
    ],
  },
  {
    n: 15,
    slug: "debugging",
    title: "Debugging",
    hook: "Cuando algo falla, no empieces reescribiéndolo todo.",
    minutes: 9,
    outcome: "Tienes un método para encontrar un fallo en vez de dar palos de ciego.",
    terms: ["console", "terminal", "Network", "logs", "stack trace", "reproduce", "isolate"],
    reading: [
      "Depurar no es intuición: es un método, y siempre el mismo.",
      "",
      "1. **Reproduce.** Si no sabes provocarlo, no sabrás si lo has arreglado.",
      "2. **Lee el error entero.** El *stack trace* dice archivo y línea. Está literalmente diciéndote dónde mirar.",
      "3. **Mira en el sitio correcto.** La consola del navegador para el frontend, la terminal para el servidor, Network para lo que viaja entre los dos.",
      "4. **Aísla.** Reduce hasta el trozo más pequeño que siga fallando.",
      "5. **Un cambio cada vez.** Si tocas tres cosas y funciona, no sabes cuál era.",
      "",
      "Éste es también el punto donde la IA se usa mejor: dale el error completo, el archivo y qué esperabas. «No me funciona» no es contexto.",
    ].join("\n"),
    mission: {
      brief:
        "Rompe algo a propósito en tu proyecto —un nombre de campo, una variable— y arréglalo siguiendo el método. Documenta los cinco pasos.",
      minutes: 15,
      criterion: "El bug está resuelto y la explicación reconstruye cómo se localizó.",
      evidence: "Antes y después + tu explicación.",
    },
    quiz: [
      {
        prompt: "¿Qué haces primero al depurar?",
        options: [
          "Reproducir el error y observarlo",
          "Reescribir el componente entero",
          "Hacer un deploy a producción",
          "Borrar node_modules",
        ],
      },
      {
        prompt: "La página se queda en blanco y no sabes por qué. ¿Cuál es el primer paso?",
        options: [
          "Reproducirlo a propósito y leer el error entero en la consola",
          "Reescribir el componente desde cero",
          "Desplegar a producción para ver si allí funciona",
          "Borrar la base de datos y volver a crearla",
        ],
      },
      {
        prompt: "El error aparece en la terminal donde corre el servidor, no en la consola del navegador. ¿Qué te dice eso?",
        options: [
          "Que el fallo está en el código que se ejecuta en el servidor, no en el navegador",
          "Que hay que reinstalar las dependencias",
          "Que el dominio está mal configurado",
          "Que la sesión ha caducado",
        ],
      },
    ],
  },
  {
    n: 16,
    slug: "git-checkpoints",
    title: "Git checkpoints",
    hook: "Un commit es un punto de recuperación. Haz muchos.",
    minutes: 9,
    outcome: "Usas Git como red de seguridad y sabes leer qué has cambiado antes de guardarlo.",
    terms: ["git status", "git diff", "commit", "log", "push"],
    reading: [
      "Ahora que el proyecto tiene partes que se pueden romper de verdad, Git deja de ser burocracia y se convierte en lo que te deja trabajar sin miedo.",
      "",
      "- `git status`: qué has tocado.",
      "- `git diff`: **qué ha cambiado exactamente**, línea a línea. Léelo antes de cada commit, sobre todo si el cambio lo ha escrito una IA.",
      "- `git log`: la historia del proyecto.",
      "",
      "Un buen mensaje de commit dice **qué** y **por qué**, no cómo. `arreglos` no sirve de nada dentro de dos semanas; `valida el email antes de insertar el lead` sí.",
      "",
      "Regla práctica: haz commit **antes** de cada cambio grande, no sólo después. Así siempre tienes un sitio conocido al que volver.",
    ].join("\n"),
    mission: {
      brief:
        "Deja el historial del proyecto limpio: commits pequeños, con mensajes que se entiendan solos, y todo subido al remoto.",
      minutes: 8,
      criterion: "El historial de GitHub se lee y se entiende sin abrir el código.",
      evidence: "Captura del historial de commits.",
    },
    quiz: [
      {
        prompt: "¿Qué muestra git diff?",
        options: [
          "Los cambios que todavía no has confirmado",
          "La lista de ramas del repositorio",
          "Los despliegues de Vercel",
          "Las tablas de la base de datos",
        ],
      },
      {
        prompt: "Vas a hacer un cambio grande y arriesgado. ¿Cuándo haces commit?",
        options: [
          "Antes de empezar, para tener un punto conocido al que volver",
          "Sólo al final, cuando ya funcione todo",
          "Sólo si el cambio sale mal",
          "Nunca: para eso está el historial del editor",
        ],
      },
      {
        prompt: "¿Qué diferencia hay entre commit y push?",
        options: [
          "El commit guarda en tu máquina; el push lo manda al repositorio remoto",
          "Son lo mismo, push es el atajo",
          "El commit publica la web y el push guarda el código",
          "El push guarda en local y el commit en GitHub",
        ],
      },
    ],
  },
  {
    n: 17,
    slug: "vercel-deploy",
    title: "Vercel deploy",
    hook: "Has construido todo esto en tu ordenador. Pero nadie más puede entrar.",
    minutes: 11,
    outcome: "Pones el proyecto online con una URL pública y entiendes qué ha pasado por el camino.",
    terms: ["build", "production", "preview", "deployment", "environment variables"],
    reading: [
      "Ésta es la respuesta a la pregunta que dio nombre al curso.",
      "",
      "Vercel lee tu repositorio de GitHub, ejecuta el **build** —el paso que convierte tu código fuente en los archivos optimizados que se van a servir— y publica el resultado. A eso se le llama **deployment**.",
      "",
      "Distingue dos momentos que se confunden siempre:",
      "",
      "- **Build**: ocurre una vez, al desplegar. Si falla, no hay nada que servir.",
      "- **Runtime**: ocurre en cada visita. Si falla, la web está online pero rota.",
      "",
      "Cada rama y cada pull request generan un **preview**: una URL propia para probar sin tocar producción. Es una de las mejores costumbres que puedes coger.",
      "",
      "Y algo que sorprende a todo el mundo la primera vez: lo que funcionaba en local puede fallar en producción, casi siempre porque **faltan las variables de entorno**. Eso es la lección siguiente.",
    ].join("\n"),
    mission: {
      brief: "Importa tu repositorio en Vercel y despliega. El proyecto tiene que abrirse desde una URL pública.",
      minutes: 15,
      criterion: "La URL pública funciona y carga el proyecto.",
      evidence: "La URL pública.",
    },
    quiz: [
      {
        prompt: "¿Qué hace un deployment?",
        options: [
          "Pone una versión concreta del proyecto en un entorno accesible",
          "Guarda los cambios en el historial de Git",
          "Crea las tablas de la base de datos",
          "Registra el dominio a tu nombre",
        ],
      },
      {
        prompt: "En local todo va, pero en producción la web carga y falla al pedir datos. ¿Primera sospecha?",
        options: [
          "Que faltan las variables de entorno en el proveedor",
          "Que el dominio no ha propagado",
          "Que falta hacer commit",
          "Que la tabla no existe",
        ],
      },
      {
        prompt: "¿Qué hace Vercel que NO hace GitHub?",
        options: [
          "Construir el proyecto y servirlo a los visitantes",
          "Guardar el historial de commits",
          "Alojar el código fuente",
          "Gestionar las ramas del repositorio",
        ],
      },
    ],
  },
  {
    n: 18,
    slug: "environment-variables",
    title: "Environment variables",
    hook: "Nunca enseñes una clave privada. Nunca la subas al repo.",
    minutes: 9,
    outcome: "Separas configuración de código y sabes qué puede viajar al navegador y qué no.",
    terms: [".env.local", "Vercel env", "public vs private", "secret", "rotation"],
    reading: [
      "Una **variable de entorno** es un valor que cambia según dónde corra el proyecto: en tu máquina apunta a la base de pruebas, en producción a la real. El código es el mismo; la configuración, no.",
      "",
      "En local viven en `.env.local`, que **nunca** se sube al repositorio. En producción se configuran en el panel del proveedor.",
      "",
      "La distinción crítica: las variables con prefijo público (`NEXT_PUBLIC_…`) **se incrustan en el código que llega al navegador**. Cualquiera puede leerlas. Ahí sólo va lo que no sea secreto: la URL del proyecto, la anon key. La *service role key* y cualquier otra clave privada se quedan en el servidor, siempre.",
      "",
      "Si una clave se te escapa —a un commit, a una captura, a una grabación— no basta con borrarla: hay que **rotarla**, es decir, generar una nueva e invalidar la vieja. Lo que se publicó una vez, se publicó.",
    ].join("\n"),
    mission: {
      brief:
        "Saca toda la configuración del código a variables de entorno, en local y en Vercel. Comprueba que `.env.local` está en `.gitignore`.",
      minutes: 10,
      criterion: "El proyecto funciona en producción y no hay ni un secreto en el repositorio.",
      evidence: "Captura de la configuración en Vercel con los valores ocultos.",
    },
    quiz: [
      {
        prompt: "¿Dónde configurarías los secretos de producción?",
        options: [
          "En las variables de entorno del proveedor",
          "En un archivo del repositorio",
          "En el registro DNS del dominio",
          "En el código del frontend",
        ],
      },
      {
        prompt: "Se te ha colado una clave privada en un commit y ya la has borrado del código. ¿Basta?",
        options: [
          "No: hay que rotarla, porque quedó publicada en el historial",
          "Sí: al borrarla del archivo deja de ser válida",
          "Sí, si el repositorio es privado",
          "Sí, si haces un commit nuevo encima",
        ],
      },
      {
        prompt: "¿Qué distingue una variable pública de una privada?",
        options: [
          "La pública se incrusta en el código que llega al navegador y cualquiera puede leerla",
          "La pública es más corta",
          "La privada sólo funciona en local",
          "La pública se guarda en la base de datos",
        ],
      },
    ],
  },
  {
    n: 19,
    slug: "dominio-y-dns",
    title: "Dominio + DNS",
    hook: "El dominio no es el hosting.",
    minutes: 10,
    outcome: "Conectas un dominio a tu proyecto y entiendes quién resuelve qué.",
    terms: ["A", "AAAA", "CNAME", "nameservers", "DNS propagation", "SSL/TLS"],
    reading: [
      "**DNS** es la agenda de Internet: traduce un nombre que las personas recuerdan a la dirección de la máquina que responde.",
      "",
      "Tu dominio **no contiene** tu web. Sólo apunta a donde está.",
      "",
      "- Un registro **A** apunta a una dirección IP.",
      "- Un **CNAME** apunta a otro nombre (es lo que suele pedirte Vercel).",
      "- Los **nameservers** dicen quién manda sobre el dominio entero.",
      "",
      "Los cambios tardan en verse en todas partes: eso es la **propagación**, y es normal que durante un rato tú veas una cosa y otra persona otra.",
      "",
      "Y el candado del navegador es **SSL/TLS**: cifra lo que viaja entre el visitante y tu servidor. Hoy te lo emite el proveedor automáticamente, pero conviene saber que existe y por qué.",
    ].join("\n"),
    mission: {
      brief:
        "Conecta un dominio a tu proyecto. Si no tienes uno, documenta paso a paso qué registros harían falta y por qué.",
      minutes: 15,
      criterion: "El dominio resuelve, o el documento explica correctamente los registros necesarios.",
      evidence: "Captura de la configuración DNS o el diagrama.",
    },
    quiz: [
      {
        prompt: "¿Qué resuelve el DNS?",
        options: [
          "Un nombre de dominio hacia el destino que responde",
          "El almacenamiento de los usuarios",
          "El historial de versiones del código",
          "El proceso de build del proyecto",
        ],
      },
      {
        prompt: "Has cambiado el DNS y tu socio sigue viendo la web antigua. ¿Qué ocurre?",
        options: [
          "El cambio se está propagando y todavía no ha llegado a todas partes",
          "El deploy ha fallado",
          "Le falta iniciar sesión",
          "El certificado SSL ha caducado",
        ],
      },
      {
        prompt: "¿Qué hace el DNS que NO hace el hosting?",
        options: [
          "Traducir tu nombre de dominio a la dirección de la máquina que responde",
          "Guardar y entregar los archivos de tu web",
          "Ejecutar el código de tu proyecto",
          "Almacenar los datos de tus usuarios",
        ],
      },
    ],
  },
  {
    n: 20,
    slug: "landing-gratis",
    title: "Landing gratis",
    hook: "No todas las webs necesitan un servidor. Ni una base de datos.",
    minutes: 10,
    outcome: "Publicas una landing estática y sabes decidir cuándo no hace falta más.",
    terms: ["static assets", "static hosting", "CDN", "caché", "DNS"],
    reading: [
      "Una web **estática** es un conjunto de archivos ya hechos. No hay nada que calcular por visita: sólo entregarlos.",
      "",
      "Eso la hace rapidísima y casi gratis de alojar, porque puede repartirse desde una **CDN**: una red de nodos por todo el mundo que sirven una copia desde el más cercano a cada visitante.",
      "",
      "La regla de decisión, que es lo que de verdad te llevas de esta lección:",
      "",
      "| Proyecto | Stack orientativo |",
      "|---|---|",
      "| Landing estática | GitHub + hosting estático |",
      "| Landing con formulario simple | estático + servicio de formularios |",
      "| App con datos y usuarios | Vercel + Supabase |",
      "| SaaS | Vercel + Supabase + lo que pida |",
      "",
      "Montar una base de datos para una web de cinco secciones es pagar complejidad sin comprar nada.",
    ].join("\n"),
    mission: {
      brief: "Publica una landing estática, sin base de datos, en un hosting estático y con su URL pública.",
      minutes: 20,
      criterion: "La URL funciona y el proyecto no depende de ningún backend.",
      evidence: "La URL pública.",
    },
    quiz: [
      {
        prompt: "¿Cuándo basta con hosting estático?",
        options: [
          "Cuando no necesitas backend dinámico ni base de datos",
          "Cuando el proyecto tiene menos de diez usuarios",
          "Cuando no usas dominio propio",
          "Cuando el código está en GitHub",
        ],
      },
      {
        prompt: "Te piden una web de cinco secciones sin formularios ni usuarios. ¿Qué montas?",
        options: [
          "Hosting estático: no hay nada que calcular por visita",
          "Vercel más Supabase, por si crece",
          "Un servidor propio con base de datos",
          "Un panel privado con autenticación",
        ],
      },
      {
        prompt: "¿Qué aporta una CDN que no aporta un único servidor?",
        options: [
          "Sirve una copia desde el nodo más cercano a cada visitante",
          "Guarda los datos de los usuarios de forma más segura",
          "Ejecuta consultas a la base de datos más rápido",
          "Registra el dominio automáticamente",
        ],
      },
    ],
  },
  {
    n: 21,
    slug: "landing-a-saas",
    title: "Landing → SaaS",
    hook: "Aquí es donde deja de ser una landing.",
    minutes: 10,
    outcome: "Reconoces la escalera por la que un proyecto crece y sabes en qué peldaño estás.",
    terms: ["static", "form", "database", "auth", "dashboard", "billing"],
    reading: [
      "Todos los productos que usas recorrieron la misma escalera, y tú acabas de subirla entera:",
      "",
      "**estático → formulario → base de datos → usuarios → panel → cobro.**",
      "",
      "Cada peldaño añade capacidad y añade coste: más piezas, más cosas que pueden fallar, más que mantener. Por eso la pregunta útil no es «¿cómo llego arriba?» sino «**¿en qué peldaño está mi problema?**».",
      "",
      "El salto que marca la diferencia es el tercero. Mientras no guardas nada, tienes una web. En cuanto guardas algo de alguien, tienes un producto: hay datos que proteger, cuentas que recuperar y una copia de seguridad que alguien tendrá que haber pensado.",
      "",
      "El **cobro** aquí sólo lo nombramos. No es parte de este curso, pero sí el peldaño siguiente.",
    ].join("\n"),
    mission: {
      brief:
        "Coge la landing estática de la lección 20 y súbela un peldaño: que su formulario persista en la base de datos.",
      minutes: 15,
      criterion: "El dato llega a la tabla desde la landing publicada.",
      evidence: "La URL + captura de la fila.",
    },
    quiz: [
      {
        prompt: "¿Qué añade un SaaS frente a una landing?",
        options: [
          "Usuarios, datos propios y lógica de producto",
          "Un dominio personalizado",
          "Mejor posicionamiento en buscadores",
          "Un diseño responsive",
        ],
      },
      {
        prompt: "Tu landing estática empieza a guardar los contactos que la rellenan. ¿Qué ha cambiado?",
        options: [
          "Que ahora hay datos de personas: alguien tiene que protegerlos y respaldarlos",
          "Nada relevante: sigue siendo una landing",
          "Que ya no necesita dominio propio",
          "Que deja de necesitar hosting",
        ],
      },
      {
        prompt: "¿Cuál es el primer peldaño que convierte una web en un producto?",
        options: [
          "Guardar datos de otras personas",
          "Comprar un dominio propio",
          "Añadir una animación al héroe",
          "Publicarla en producción",
        ],
      },
    ],
  },
  {
    n: 22,
    slug: "ia-con-autonomia",
    title: "IA con autonomía",
    hook: "Tienes que poder explicar cada cambio. Si no, no es tuyo.",
    minutes: 11,
    outcome: "Añades una funcionalidad completa con IA manteniendo el control del resultado.",
    terms: ["plan", "context", "incremental changes", "diff", "tests", "documentation"],
    reading: [
      "Ya tienes el flujo. Aquí lo subes de nivel para una funcionalidad entera, no un cambio suelto.",
      "",
      "1. **Plan primero.** Pide el plan antes que el código: qué archivos, en qué orden, qué se rompe. Corregir un plan cuesta un minuto; corregir una implementación, una tarde.",
      "2. **Contexto, no deseos.** Qué hace el proyecto, qué convenciones sigue, qué archivos son relevantes, qué no se puede tocar.",
      "3. **Incrementos verificables.** Cada paso tiene que poder probarse antes del siguiente.",
      "4. **Commit entre pasos.** Cada uno es un punto de vuelta.",
      "5. **Explícalo tú.** Si no puedes contarle a alguien qué hace ese código y por qué, todavía no es tuyo: es prestado.",
      "",
      "Ésa es la diferencia entre la velocidad de la IA y depender de ella.",
    ].join("\n"),
    mission: {
      brief:
        "Añade una funcionalidad nueva a LeadFlow trabajando con Claude Code: plan, incrementos, diffs revisados y commits.",
      minutes: 20,
      criterion: "La funcionalidad va y explicas cada archivo tocado con tus palabras.",
      evidence: "Los diffs o commits + tu explicación.",
    },
    quiz: [
      {
        prompt: "¿Qué es revisar el diff?",
        options: [
          "Inspeccionar exactamente qué cambios se han generado",
          "Ejecutar la batería de tests",
          "Comparar dos despliegues de Vercel",
          "Revisar el esquema de la base de datos",
        ],
      },
      {
        prompt: "La IA te propone una solución que funciona pero no entiendes por qué. ¿Qué haces?",
        options: [
          "Pedirle que te la explique hasta poder contarla tú antes de darla por buena",
          "Aceptarla: si pasa las pruebas, es correcta",
          "Aceptarla y anotarlo para revisarlo algún día",
          "Descartarla y hacerlo a mano",
        ],
      },
      {
        prompt: "¿Qué le das a la IA para que trabaje bien que no es «lo que quieres»?",
        options: [
          "El contexto: qué hace el proyecto, qué archivos importan y qué no se puede tocar",
          "Más tiempo de ejecución",
          "Acceso a producción",
          "Un modelo más grande",
        ],
      },
    ],
  },
  {
    n: 23,
    slug: "mapa-mental",
    title: "Mapa mental",
    hook: "Herramienta ↔ capa ↔ problema. Los tres, juntos.",
    minutes: 10,
    outcome: "Consolidas la arquitectura completa y sabes qué pieza resuelve qué problema.",
    terms: ["frontend", "backend", "data", "auth", "authorization", "deploy", "DNS", "Git"],
    reading: [
      "Vuelve al diagrama de la lección 1. Ahora puedes rellenarlo con nombres propios:",
      "",
      "| Capa | Qué hace | En este curso |",
      "|---|---|---|",
      "| Frontend | Lo que corre en el navegador | Tu interfaz |",
      "| Servicio de datos | Atiende operaciones | Supabase |",
      "| Database | Persistencia estructurada | PostgreSQL |",
      "| Auth | Quién eres | Supabase Auth |",
      "| Authorization | Qué puedes ver | RLS y policies |",
      "| Repositorio | Historial del código | GitHub |",
      "| Deployment | Poner el build en producción | Vercel |",
      "| DNS | A dónde va el dominio | Tu proveedor |",
      "",
      "El objetivo del curso no era aprender estas siete herramientas. Era aprender las siete **capas**, para que cuando cambies de herramienta —y vas a cambiar— sigas sabiendo qué estás sustituyendo.",
    ].join("\n"),
    mission: {
      brief:
        "Dibuja la arquitectura real de tu proyecto terminado: cada capa, la herramienta que la ocupa y el problema que resuelve.",
      minutes: 15,
      criterion: "Aparecen todas las capas con su herramienta y su función.",
      evidence: "El diagrama.",
    },
    quiz: [
      {
        prompt: "¿Qué herramienta se ocupa de la base de datos en este curso?",
        options: ["Supabase", "Vercel", "GitHub", "Cloudflare"],
      },
      {
        prompt: "Mañana cambias Supabase por otro servicio. ¿Qué se mantiene?",
        options: [
          "Las capas: sigues necesitando datos, identidad y autorización",
          "Nada: hay que rediseñar el proyecto entero",
          "Sólo el diseño visual",
          "Sólo el nombre del dominio",
        ],
      },
      {
        prompt: "En este curso, ¿qué se ocupa del despliegue y qué de los datos?",
        options: [
          "Vercel del despliegue y Supabase de los datos",
          "Supabase del despliegue y Vercel de los datos",
          "GitHub del despliegue y Vercel de los datos",
          "Cloudflare del despliegue y GitHub de los datos",
        ],
      },
    ],
  },
  {
    n: 24,
    slug: "ship-it",
    title: "SHIP IT",
    hook: "¿Puedes explicar tu producto sin decir «lo hizo la IA»?",
    minutes: 12,
    outcome: "Entregas el proyecto terminado y demuestras que entiendes lo que has construido.",
    terms: ["QA", "build", "production", "repo", "database", "auth", "README"],
    reading: [
      "Mira dónde estás. Hace unas horas tenías una idea y una carpeta. Ahora tienes código versionado, una base de datos, usuarios, un panel y una URL pública.",
      "",
      "Antes de entregar, repasa:",
      "",
      "- El build pasa y producción carga.",
      "- El registro y el login funcionan en la URL pública, no sólo en local.",
      "- Un usuario no ve los datos de otro (compruébalo otra vez).",
      "- No hay ni una clave en el repositorio.",
      "- Los estados vacío y de error existen.",
      "- El `README` explica qué es el proyecto, cómo se arranca y qué variables necesita.",
      "",
      "Y la entrega de verdad no es la URL: es que puedas explicar en tres minutos qué has construido, qué pieza hace qué y por qué elegiste cada una.",
    ].join("\n"),
    mission: {
      brief:
        "Entrega LeadFlow terminado: URL pública, repositorio y una explicación de dos o tres minutos de tu arquitectura y tus decisiones.",
      minutes: 45,
      criterion: "URL, repo y explicación completos, y la explicación demuestra comprensión propia.",
      evidence: "URL + repositorio + vídeo o texto de la explicación.",
    },
    quiz: [
      {
        prompt: "¿Qué tiene que incluir la entrega final?",
        options: [
          "URL pública, repositorio y tu explicación",
          "Sólo la URL pública",
          "Sólo el repositorio con los commits",
          "Una captura del panel de Supabase",
        ],
      },
      {
        prompt: "Antes de entregar, ¿qué comprobación NO puedes saltarte?",
        options: [
          "Que un usuario no vea los datos de otro, probado en la URL pública",
          "Que el favicon se vea bien",
          "Que el README tenga capturas",
          "Que el repositorio tenga más de veinte commits",
        ],
      },
      {
        prompt: "¿Qué demuestra de verdad que el proyecto es tuyo?",
        options: [
          "Que puedes explicar qué hace cada pieza y por qué la elegiste",
          "Que la URL pública carga sin errores",
          "Que el historial de commits es largo",
          "Que usaste las herramientas del curso",
        ],
      },
    ],
  },
];

export const WEB_ABC: FlashCourse = {
  key: "web-abc",
  slug: "the-web-abc",
  code: "RELÁMPAGO 01",
  title: "The Web ABC",
  claim: "Entiende. Construye. Publica.",
  problem:
    "Sé hacer una web con HTML/CSS/IA, pero… ¿cómo coño la pongo online? ¿Dónde se guardan los datos? ¿Qué es un servidor? ¿Necesito una base de datos? ¿Qué diferencia hay entre GitHub, Vercel y Supabase?",
  lead: "En 4 horas construyes un proyecto web completo. No lo ves construir: lo construyes tú, lo conectas a una base de datos, le añades usuarios, le montas un panel y lo pones online. Y mientras lo haces, entiendes qué está pasando debajo.",
  priceCents: 7500,
  stack: ["Claude Code", "Warp", "GitHub", "Supabase", "Vercel", "Cloudflare"],
  build: [
    "Landing",
    "Formulario",
    "Base de datos",
    "Usuarios",
    "Panel privado",
    "CRUD",
    "Deploy",
    "Dominio",
  ],
  level: "Iniciático. Ya haces webs; te falta la infraestructura.",
  language: "Español",

  // ⚠︎ MARCADOR DE POSICIÓN. El mismo clip de muestra en las 24 lecciones,
  // hasta que estén grabadas. Se sustituye lección a lección rellenando
  // `video` en cada una y regenerando el seed (`npm run relampago:seed`);
  // cuando las 24 lo tengan, estas dos líneas se borran y el aviso
  // desaparece solo de la web y del campus.
  demoVideo: "/video/demo-web-abc.mp4",
  poster: "/video/demo-web-abc.jpg",
  demoNotice:
    "Las clases se están grabando: por ahora verás este mismo clip en todas las lecciones. La lectura técnica, el control y la misión de cada una sí son las definitivas y ya puedes hacerlas.",

  // Los dos extras de portada. Apuntan a desbloqueos que existen de verdad:
  // no se anuncia nada que luego no esté en el campus.
  gift: {
    unlock: "web-abc-starter-template",
    tag: "EL REGALO",
    title: "The Web Starter Template",
    body: "El esqueleto del proyecto ya resuelto: los tres clientes de datos, la migración con las reglas de acceso puestas y la estructura de carpetas que aguanta cuando el proyecto crece.",
    hook: "Tu siguiente proyecto empieza en la hora dos, no en la cero.",
  },
  ninja: {
    unlock: "web-abc-research-hack",
    tag: "EL TRUCO NINJA",
    title: "The Research Hack",
    body: "Cómo investigar un producto, su competencia y su documentación desde el navegador, y convertir lo que encuentras en contexto que la IA sí puede usar.",
    hook: "Es la diferencia entre que Claude te dé lo genérico y que te dé lo tuyo.",
  },
  modules: MODULES,
  lessons: LESSONS,
  unlocks: UNLOCKS,
  notPromised:
    "No te vas a convertir en desarrollador senior en cuatro horas. Lo que te llevas es comprensión, autonomía inicial y un proyecto funcional desplegado con tu nombre.",
};
