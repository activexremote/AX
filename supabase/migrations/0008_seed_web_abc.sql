-- Contenido de «The Web ABC» — Entiende. Construye. Publica.
--
-- ⚠︎ GENERADO. No editar a mano: se sobrescribe.
-- Fuente: src/lib/relampago/web-abc.ts · Generador: scripts/build-relampago-seed.mjs
--
-- 6 módulos · 24 lecciones · 5 desbloqueos.
-- Es idempotente: se puede volver a ejecutar tras regenerarlo y actualiza
-- en vez de duplicar. El progreso de los alumnos no se toca, porque las
-- lecciones se identifican por (módulo, slug) y conservan su id.

begin;

-- ── Módulos ──────────────────────────────────────────
insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-el-mapa', 101, 'MÓDULO 1 · EL MAPA', 'El mapa', 'Qué ocurre de verdad entre que alguien escribe una URL y ve tu web. Las piezas, sus nombres y qué hace cada una.', 'map', '#5B4BF5', true, 28, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-ai-building', 102, 'MÓDULO 2 · AI BUILDING', 'Construir con IA sin caja negra', 'Terminal, proyecto y un flujo de trabajo con Claude Code que puedes explicar línea a línea.', 'terminal', '#7C5CFF', true, 30, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-datos', 103, 'MÓDULO 3 · DATOS', 'Dónde viven los datos', 'Persistencia, PostgreSQL, Supabase, esquema, CRUD inicial y cómo viaja un dato entre el formulario y la tabla.', 'database', '#2F6BFF', true, 39, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-usuarios', 104, 'MÓDULO 4 · USUARIOS Y SEGURIDAD', 'Usuarios y seguridad', 'Identidad, sesión, autorización y RLS. La diferencia entre saber quién eres y decidir qué puedes ver.', 'shield', '#14B8C4', true, 41, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-ship', 105, 'MÓDULO 5 · SHIP', 'Ponerlo online', 'Depuración, checkpoints de Git, deploy en Vercel, variables de entorno, dominio, DNS y hosting estático.', 'rocket', '#FF6A3D', true, 58, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values
  ('web-abc-autonomia', 106, 'MÓDULO 6 · AUTONOMÍA', 'Autonomía', 'De landing a producto, workflow con IA de verdad, arquitectura final y entrega.', 'compass', '#D61F9C', true, 43, 'web-abc')
on conflict (slug) do update set
  order_index = excluded.order_index, code = excluded.code, title = excluded.title,
  description = excluded.description, icon = excluded.icon, accent = excluded.accent,
  estimated_minutes = excluded.estimated_minutes, course = excluded.course;

-- ── Lecciones ────────────────────────────────────────
-- 01 · La web que ya sabes hacer no está terminada
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-el-mapa'),
  'la-web-que-ya-sabes-hacer-no-esta-terminada', 1, 'La web que ya sabes hacer no está terminada', 'Descubres que una web no es una cosa, sino una pila de capas con nombres propios.', 9,
  'Cuando escribes una URL y pulsas enter no ocurre *una* cosa: ocurren ocho, y cada una tiene nombre.

El **navegador** pide algo (*request*). Antes de poder pedirlo tiene que saber a qué máquina hablar, y eso lo resuelve el **DNS**. La máquina que responde está en algún **hosting**, y lo que devuelve (*response*) es el **frontend**: el código que se ejecuta en tu navegador y dibuja lo que ves.

Si esa web guarda algo —un formulario, un usuario, un pedido— hay una **database** detrás, y algo que habla con ella en nombre del frontend: el **backend** o un servicio de datos. Y para que todo eso pase de tu carpeta a Internet hay un proceso llamado **deploy**.

Tú ya sabes hacer la capa que se ve. Las otras siete existen igual, las conozcas o no.',
  'Has hecho la parte que se ve. Ahora vamos a entender todo lo que no se ve.', 'Descubres que una web no es una cosa, sino una pila de capas con nombres propios.', array['request', 'response', 'browser', 'frontend', 'backend', 'database', 'hosting', 'DNS', 'deploy']::text[],
  'Dibuja la arquitectura de un proyecto web —el tuyo o uno que uses a diario— nombrando las ocho piezas. A mano, en Figma o en un papel: da igual la herramienta.', 10, 'Aparecen las ocho piezas con su nombre y una flecha que indique quién habla con quién.', 'Una foto o captura del diagrama.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 02 · ¿Qué coño es un servidor?
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-el-mapa'),
  'que-es-un-servidor', 2, '¿Qué coño es un servidor?', 'Entiendes qué ejecuta y qué entrega un servidor, y por qué localhost sólo existe para ti.', 9,
  'Un servidor no es una caja mágica en un sótano: es **un programa en ejecución** que está esperando peticiones y sabe responderlas.

Cuando arrancas `npm run dev` y ves `localhost:3000`, tu propio ordenador se ha convertido en servidor. El **proceso** está vivo, el **runtime** ejecuta tu código y responde a cada *request* con una *response*. Funciona perfectamente… para ti. `localhost` significa literalmente «esta máquina»: nadie más en el mundo puede resolver esa dirección.

Poner algo online es conseguir que **otra** máquina, encendida siempre y con una dirección pública, haga ese mismo trabajo.

De ahí la distinción que vas a usar todo el curso: contenido **estático** (archivos ya hechos que sólo hay que entregar) frente a **dinámico** (algo que se calcula en el momento de cada petición).',
  '«Funciona en localhost» no significa que esté online.', 'Entiendes qué ejecuta y qué entrega un servidor, y por qué localhost sólo existe para ti.', array['server', 'process', 'runtime', 'request', 'response', 'static vs dynamic', 'localhost']::text[],
  'Arranca tu proyecto en local y abre una web pública cualquiera. Explica en cinco líneas qué está pasando en cada caso y por qué tu URL no la puede abrir nadie más.', 8, 'La explicación distingue request/response y dice qué aporta el hosting.', 'Tu explicación + una captura de la terminal y del navegador.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 03 · GitHub, ¿para qué sirve realmente?
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-el-mapa'),
  'github-para-que-sirve-realmente', 3, 'GitHub, ¿para qué sirve realmente?', 'Separas control de versiones de hosting, dos cosas que casi todo el mundo confunde al empezar.', 10,
  '**Git** es un sistema de control de versiones que corre en tu ordenador: guarda el historial de tu proyecto en instantáneas llamadas *commits*. **GitHub** es un sitio donde alojar ese historial para tenerlo a salvo y compartirlo.

Fíjate en lo que no ha aparecido en ninguna de las dos frases: **servir tu web a nadie**. Subir código a GitHub no lo pone online. Son cosas distintas que a veces se conectan (más adelante Vercel leerá tu repo para desplegarlo), pero no son la misma.

El ciclo mínimo que vas a repetir cien veces:

```bash
git status              # qué ha cambiado
git add .               # qué quiero guardar
git commit -m "..."     # guardarlo con un mensaje
git push                # mandarlo al remoto
```

Un *commit* es un punto de recuperación. Cuantos más tengas, menos miedo te da romper algo.',
  'GitHub guarda tu código; no es automáticamente tu backend.', 'Separas control de versiones de hosting, dos cosas que casi todo el mundo confunde al empezar.', array['git init', 'clone', 'status', 'add', 'commit', 'push', 'remote', 'branch']::text[],
  'Crea un repositorio en GitHub para tu proyecto, súbelo y deja al menos tres commits con mensajes que se entiendan sin abrir el código.', 10, 'El repo existe, es accesible y tiene tres commits con mensajes descriptivos.', 'La URL del repositorio.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 04 · Claude Code + Warp
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ai-building'),
  'claude-code-y-warp', 1, 'Claude Code + Warp', 'Trabajas con IA siguiendo un flujo controlado en el que puedes explicar cada cambio.', 11,
  'El flujo que vas a usar el resto del curso tiene siempre la misma forma:

**abrir → inspeccionar → planificar → cambiar una pieza → ejecutar → probar → revisar el diff → commit**.

Las tres reglas que separan usar IA de depender de ella:

1. **Contexto antes que orden.** «Hazme un login» produce basura. «Este proyecto usa Next y Supabase, el cliente está en `lib/supabase`, quiero un login por email; explícame qué archivos vas a tocar» produce algo revisable.
2. **Cambios pequeños.** Un cambio grande que no entiendes es deuda, no velocidad.
3. **Revisa el diff.** El *diff* es la lista exacta de lo que ha cambiado. Si no lo lees, no sabes qué has aceptado.

Y la regla que las resume: **no aceptes una solución que no puedas explicar**. Si no puedes, pide que te la explique antes de seguir.',
  'No le pidas que haga magia. Dale contexto y verifica.', 'Trabajas con IA siguiendo un flujo controlado en el que puedes explicar cada cambio.', array['terminal', 'filesystem', 'package manager', 'scripts', 'context', 'diff']::text[],
  'Pídele a Claude Code un cambio pequeño y concreto en tu proyecto. Lee el diff entero antes de aceptarlo y escribe en dos líneas qué ha cambiado y por qué funciona.', 12, 'Hay un commit con el cambio y una explicación propia del diff, no copiada de la respuesta.', 'El commit + tu explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 05 · Primera versión
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ai-building'),
  'primera-version', 2, 'Primera versión', 'Creas un frontend funcional y sabes qué papel juega cada carpeta del proyecto.', 10,
  'Un proyecto moderno no es una carpeta con `index.html`. Tiene una estructura que se repite casi igual en todas partes:

- **rutas**: qué URL enseña qué pantalla;
- **componentes**: trozos de interfaz reutilizables;
- **assets**: imágenes, fuentes, iconos;
- **dependencias**: `package.json` dice de qué código ajeno depende el tuyo, y los *scripts* dicen cómo se arranca;
- **configuración de entorno**: valores que cambian entre tu máquina y producción.

El comando que lo arranca todo es un *script*, normalmente `npm run dev`. No es un comando mágico del sistema: está escrito en tu `package.json` y puedes leerlo.

Empieza el proyecto **LeadFlow**, el mini SaaS que vas a construir durante el curso: una landing pública con un formulario de leads y, más adelante, un panel privado para gestionarlos.',
  'Antes de añadir nada, entiende qué archivo hace qué.', 'Creas un frontend funcional y sabes qué papel juega cada carpeta del proyecto.', array['project structure', 'components', 'routes', 'assets', 'dependencies', 'env']::text[],
  'Crea el proyecto, arranca el servidor de desarrollo y deja la landing de LeadFlow con su titular y su formulario (todavía sin guardar nada).', 15, 'El servidor arranca sin errores y la interfaz se ve en el navegador.', 'Captura del navegador con la URL visible + el repo actualizado.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 06 · Frontend
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ai-building'),
  'frontend', 3, 'Frontend', 'Distingues interfaz, lógica y datos, y sabes qué desaparece al recargar.', 9,
  'El frontend hace tres cosas distintas que conviene no mezclar en la cabeza:

- **pinta** (DOM y CSS),
- **reacciona** (eventos: un clic, una tecla, un envío),
- **recuerda mientras está abierto** (*state*).

Ese último punto es el que más confusión genera. El *state* de un formulario vive en la memoria del navegador: si recargas la página, se ha ido. No es un fallo, es su naturaleza. Es memoria de trabajo, no memoria a largo plazo.

Cuando el frontend necesita algo de fuera, lo pide con `fetch`: una petición a otra máquina que devuelve datos, normalmente en JSON.

Guarda esta frase para la lección 7: **si quieres que mañana siga ahí, el state no te sirve**.',
  'Lo que ves en pantalla no es donde viven los datos.', 'Distingues interfaz, lógica y datos, y sabes qué desaparece al recargar.', array['DOM', 'component', 'CSS', 'state', 'event', 'fetch']::text[],
  'Haz que tu formulario tenga estado real: que los campos se controlen, que el botón se deshabilite mientras envía y que aparezca un mensaje al terminar.', 10, 'Se ve un cambio de estado en pantalla al interactuar.', 'Captura del antes y el después + commit.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 07 · ¿Qué es una base de datos?
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-datos'),
  'que-es-una-base-de-datos', 1, '¿Qué es una base de datos?', 'Entiendes qué es persistir y sabes diseñar una tabla con sus campos y su identificador.', 10,
  'Una base de datos es **la memoria organizada de tu producto**. Organizada es la palabra importante: no guarda cosas sueltas, guarda cosas con forma.

- La **tabla** es el tipo de cosa que guardas (`leads`).
- La **columna** es un dato de esa cosa (`email`), y tiene un **tipo** (texto, número, fecha).
- La **fila** es una cosa concreta (el lead de María).
- La **primary key** es el identificador único de cada fila. Sin ella no puedes referirte a un registro concreto sin ambigüedad.

Al conjunto de tablas y columnas se le llama **esquema**. Diseñar el esquema es decidir qué guarda tu producto antes de escribir el código que lo guarda, y es donde se ganan o se pierden las tardes.',
  'Si cierras el navegador y quieres que mañana siga ahí, necesitas persistencia.', 'Entiendes qué es persistir y sabes diseñar una tabla con sus campos y su identificador.', array['database', 'schema', 'table', 'row', 'column', 'primary key', 'persistence']::text[],
  'Diseña sobre papel la tabla `leads`: qué columnas necesita, de qué tipo es cada una y cuál es su identificador.', 10, 'Aparecen la tabla, un ID y los campos con su tipo.', 'Captura o foto del esquema.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 08 · Supabase
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-datos'),
  'supabase', 2, 'Supabase', 'Creas una base PostgreSQL real y entiendes qué servicios vienen con ella.', 10,
  'Supabase te da un **PostgreSQL** de verdad —una de las bases de datos relacionales más sólidas que existen— y, encima, un conjunto de servicios que te ahorran escribir un backend entero: una **API** automática sobre tus tablas, **autenticación**, almacenamiento de archivos y reglas de acceso.

Eso te deja dos llaves que hay que distinguir bien desde el primer día:

- La **anon key** es pública. Viaja al navegador. No es un secreto, y por eso el acceso real no puede depender de ella (lección 12).
- La **service role key** se salta todas las reglas de acceso. **Nunca** sale del servidor. Si acaba en el frontend o en un commit, tu base de datos es de todo el mundo.

Puedes crear tablas desde el editor visual o escribiendo SQL. Las dos cosas acaban en el mismo sitio.',
  'Supabase no es sólo una base de datos: nos da servicios alrededor.', 'Creas una base PostgreSQL real y entiendes qué servicios vienen con ella.', array['project', 'PostgreSQL', 'table editor', 'SQL', 'API URL', 'keys']::text[],
  'Crea el proyecto en Supabase y la tabla `leads` con los campos que diseñaste en la lección anterior.', 10, 'La tabla existe con sus campos y sus tipos.', 'Captura del esquema en Supabase (sin enseñar ninguna clave).',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 09 · La web recuerda
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-datos'),
  'la-web-recuerda', 3, 'La web recuerda', 'Conectas el formulario con la base de datos y ves el dato aparecer en la tabla.', 10,
  'Éste es el momento en que las dos mitades del curso se tocan. El formulario deja de guardar en la memoria del navegador y empieza a guardar en una tabla.

La operación que crea una fila se llama **INSERT**. La que lee se llama **SELECT**. Los nombres vienen de SQL y son los mismos en cualquier base de datos relacional del mundo.

Lo que casi nadie hace la primera vez y hay que hacer desde el principio: **gestionar el error**. Una escritura puede fallar por diez motivos —sin red, campo obligatorio vacío, permiso denegado— y una interfaz que se queda muda cuando falla es peor que una que no guarda.

Tres estados, siempre: *enviando*, *guardado*, *ha fallado y esto es lo que pasó*.',
  'Aquí es donde tu web deja de olvidarlo todo al recargar.', 'Conectas el formulario con la base de datos y ves el dato aparecer en la tabla.', array['insert', 'select', 'query', 'response', 'error handling']::text[],
  'Conecta el formulario a Supabase: al enviarlo, la fila tiene que aparecer en la tabla. Muestra confirmación al usuario y gestiona el caso de error.', 15, 'Hay una fila persistida de verdad y la interfaz responde tanto al éxito como al fallo.', 'Captura de la fila en la tabla + la URL del proyecto.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 10 · APIs sin humo
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-datos'),
  'apis-sin-humo', 4, 'APIs sin humo', 'Lees una petición real y sabes decir qué método usa, qué devuelve y si ha ido bien.', 9,
  'Una **API** es un conjunto de direcciones (*endpoints*) a las que puedes hablar y un acuerdo sobre cómo hacerlo. Ese acuerdo, en la web, se llama **HTTP**.

El **método** dice qué quieres hacer:

| Método | Intención |
|---|---|
| `GET` | dame |
| `POST` | crea |
| `PATCH` | modifica un trozo |
| `DELETE` | borra |

El **status code** de la respuesta dice cómo ha ido: `2xx` bien, `4xx` la petición estaba mal (`401` no sé quién eres, `403` sé quién eres y no puedes), `5xx` el fallo es del otro lado.

Y **JSON** es simplemente el formato en el que viajan los datos. No es un lenguaje ni una tecnología: es una forma de escribir un objeto en texto.

Abre la pestaña **Network** del navegador mientras envías tu formulario. Todo esto está ahí, ocurriendo.',
  'Una API es el contrato por el que una parte le habla a otra.', 'Lees una petición real y sabes decir qué método usa, qué devuelve y si ha ido bien.', array['endpoint', 'HTTP', 'GET', 'POST', 'PATCH', 'DELETE', 'JSON', 'status codes']::text[],
  'Localiza en la pestaña Network la petición que crea un lead. Explica qué método usa, qué manda, qué devuelve y qué status code recibe.', 10, 'La explicación identifica correctamente método, cuerpo, respuesta y código.', 'Captura de Network + tu explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 11 · Usuarios
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-usuarios'),
  'usuarios', 1, 'Usuarios', 'Implementas registro, login y logout, y entiendes qué es una sesión.', 11,
  '**Autenticación** es responder a una sola pregunta: *¿quién eres?*

El flujo es siempre el mismo. Alguien se registra (*signup*) y queda creado un usuario con un **id** único. Cuando vuelve e inicia sesión (*login*), el servidor le entrega una **sesión**: una credencial temporal que su navegador guarda y adjunta en cada petición siguiente. Cerrar sesión (*logout*) es tirarla.

Ese `user_id` es la pieza que lo cambia todo, porque a partir de ahora cada lead puede tener dueño.

Y aquí va el aviso más importante del módulo: **esconder un botón no es seguridad**. Una interfaz protegida sólo protege la vista. Quien sepa hacer una petición a mano se la salta entera. Lo de verdad viene en la lección siguiente.',
  '¿Cómo sabe la web quién soy?', 'Implementas registro, login y logout, y entiendes qué es una sesión.', array['signup', 'login', 'logout', 'session', 'user id', 'protected UI']::text[],
  'Implementa registro, inicio y cierre de sesión en LeadFlow, y haz que el panel sólo se vea con sesión iniciada.', 15, 'Los tres flujos funcionan y sin sesión no se llega al panel.', 'Capturas de los tres estados + la URL.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 12 · Seguridad básica
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-usuarios'),
  'seguridad-basica', 2, 'Seguridad básica', 'Escribes tu primera policy de RLS y compruebas que un usuario no ve los datos de otro.', 10,
  '**Autenticación** es *quién eres*. **Autorización** es *qué puedes ver o hacer*. Son dos cosas distintas y sólo la primera la resuelve el login.

**RLS** (*Row Level Security*) es autorización aplicada fila a fila, dentro de la propia base de datos. No en tu código de frontend, no en tu backend: en la base. Da igual desde dónde llegue la petición.

Una **policy** es la regla. La más común es también la más útil:

```sql
create policy "cada uno ve los suyos" on leads
  for select using (user_id = auth.uid());
```

`auth.uid()` es el id del usuario que está haciendo la petición **ahora mismo**. Si no coincide con el dueño de la fila, la fila no existe para él.

El principio que hay debajo se llama **least privilege**: por defecto no se puede nada, y se abre sólo lo justo.',
  'Login no significa que los datos estén protegidos.', 'Escribes tu primera policy de RLS y compruebas que un usuario no ve los datos de otro.', array['Row Level Security', 'policies', 'auth.uid()', 'least privilege', 'authorization']::text[],
  'Activa RLS en `leads` y escribe la policy que hace que cada usuario sólo vea los suyos. Compruébalo con dos cuentas distintas.', 15, 'La policy existe y la prueba demuestra que un usuario no ve los leads del otro.', 'Captura de la policy + prueba con dos usuarios + tu explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 13 · Dashboard
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-usuarios'),
  'dashboard', 3, 'Dashboard', 'Consumes datos reales y representas los cuatro estados que toda lista tiene.', 10,
  'Una lista de datos no tiene un estado: tiene cuatro, y los cuatro ocurren de verdad.

- **Cargando**: la petición está en marcha. Sin esto la pantalla parpadea o parece rota.
- **Vacío**: la petición fue bien y no hay nada. Es el estado que más se olvida y el primero que ve un usuario nuevo, así que es donde va la invitación a crear el primero.
- **Error**: algo falló. Di qué y ofrece reintentar.
- **Con datos**: lo único que casi todo el mundo diseña.

El **detalle** es la otra mitad: desde la lista se entra a un elemento concreto, normalmente por su id.

Un panel que sólo contempla «con datos» se rompe el primer día para el primer usuario.',
  'Cada estado tiene que existir y tiene que verse.', 'Consumes datos reales y representas los cuatro estados que toda lista tiene.', array['list rendering', 'loading', 'empty', 'error', 'detail']::text[],
  'Construye el panel de leads del usuario con los cuatro estados y una vista de detalle.', 15, 'Se pueden provocar y ver los cuatro estados.', 'La URL + capturas de cada estado.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 14 · CRUD
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-usuarios'),
  'crud', 4, 'CRUD', 'Completas las cuatro operaciones sobre tus datos y entiendes que ese patrón está en todas partes.', 10,
  '**CRUD** es *Create, Read, Update, Delete*. Es el patrón que hay debajo de casi cualquier aplicación con datos: un gestor de tareas, una tienda, un CRM, tu propio LeadFlow.

Cada letra tiene su operación en la base y su método HTTP:

| Acción | SQL | HTTP |
|---|---|---|
| Crear | `INSERT` | `POST` |
| Leer | `SELECT` | `GET` |
| Modificar | `UPDATE` | `PATCH` |
| Borrar | `DELETE` | `DELETE` |

Dos avisos prácticos. **Borrar es definitivo**: si el dato importa, plantéate marcarlo como archivado en vez de eliminarlo. Y **filtrar es leer con condiciones**, no una funcionalidad aparte: es un `SELECT` con un `where`.

Y todo esto pasa por RLS. Si tu policy sólo cubre `select`, tu `update` está abierto.',
  'Cuatro letras que vas a reconocer en todos los productos del resto de tu vida.', 'Completas las cuatro operaciones sobre tus datos y entiendes que ese patrón está en todas partes.', array['create', 'read', 'update', 'delete', 'filters']::text[],
  'Completa el CRUD de leads: editar, borrar y al menos un filtro por estado. Comprueba que las policies cubren las cuatro operaciones.', 20, 'Las cuatro operaciones funcionan y el filtro devuelve lo que debe.', 'La URL + capturas de cada operación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 15 · Debugging
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'debugging', 1, 'Debugging', 'Tienes un método para encontrar un fallo en vez de dar palos de ciego.', 9,
  'Depurar no es intuición: es un método, y siempre el mismo.

1. **Reproduce.** Si no sabes provocarlo, no sabrás si lo has arreglado.
2. **Lee el error entero.** El *stack trace* dice archivo y línea. Está literalmente diciéndote dónde mirar.
3. **Mira en el sitio correcto.** La consola del navegador para el frontend, la terminal para el servidor, Network para lo que viaja entre los dos.
4. **Aísla.** Reduce hasta el trozo más pequeño que siga fallando.
5. **Un cambio cada vez.** Si tocas tres cosas y funciona, no sabes cuál era.

Éste es también el punto donde la IA se usa mejor: dale el error completo, el archivo y qué esperabas. «No me funciona» no es contexto.',
  'Cuando algo falla, no empieces reescribiéndolo todo.', 'Tienes un método para encontrar un fallo en vez de dar palos de ciego.', array['console', 'terminal', 'Network', 'logs', 'stack trace', 'reproduce', 'isolate']::text[],
  'Rompe algo a propósito en tu proyecto —un nombre de campo, una variable— y arréglalo siguiendo el método. Documenta los cinco pasos.', 15, 'El bug está resuelto y la explicación reconstruye cómo se localizó.', 'Antes y después + tu explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 16 · Git checkpoints
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'git-checkpoints', 2, 'Git checkpoints', 'Usas Git como red de seguridad y sabes leer qué has cambiado antes de guardarlo.', 9,
  'Ahora que el proyecto tiene partes que se pueden romper de verdad, Git deja de ser burocracia y se convierte en lo que te deja trabajar sin miedo.

- `git status`: qué has tocado.
- `git diff`: **qué ha cambiado exactamente**, línea a línea. Léelo antes de cada commit, sobre todo si el cambio lo ha escrito una IA.
- `git log`: la historia del proyecto.

Un buen mensaje de commit dice **qué** y **por qué**, no cómo. `arreglos` no sirve de nada dentro de dos semanas; `valida el email antes de insertar el lead` sí.

Regla práctica: haz commit **antes** de cada cambio grande, no sólo después. Así siempre tienes un sitio conocido al que volver.',
  'Un commit es un punto de recuperación. Haz muchos.', 'Usas Git como red de seguridad y sabes leer qué has cambiado antes de guardarlo.', array['git status', 'git diff', 'commit', 'log', 'push']::text[],
  'Deja el historial del proyecto limpio: commits pequeños, con mensajes que se entiendan solos, y todo subido al remoto.', 8, 'El historial de GitHub se lee y se entiende sin abrir el código.', 'Captura del historial de commits.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 17 · Vercel deploy
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'vercel-deploy', 3, 'Vercel deploy', 'Pones el proyecto online con una URL pública y entiendes qué ha pasado por el camino.', 11,
  'Ésta es la respuesta a la pregunta que dio nombre al curso.

Vercel lee tu repositorio de GitHub, ejecuta el **build** —el paso que convierte tu código fuente en los archivos optimizados que se van a servir— y publica el resultado. A eso se le llama **deployment**.

Distingue dos momentos que se confunden siempre:

- **Build**: ocurre una vez, al desplegar. Si falla, no hay nada que servir.
- **Runtime**: ocurre en cada visita. Si falla, la web está online pero rota.

Cada rama y cada pull request generan un **preview**: una URL propia para probar sin tocar producción. Es una de las mejores costumbres que puedes coger.

Y algo que sorprende a todo el mundo la primera vez: lo que funcionaba en local puede fallar en producción, casi siempre porque **faltan las variables de entorno**. Eso es la lección siguiente.',
  'Has construido todo esto en tu ordenador. Pero nadie más puede entrar.', 'Pones el proyecto online con una URL pública y entiendes qué ha pasado por el camino.', array['build', 'production', 'preview', 'deployment', 'environment variables']::text[],
  'Importa tu repositorio en Vercel y despliega. El proyecto tiene que abrirse desde una URL pública.', 15, 'La URL pública funciona y carga el proyecto.', 'La URL pública.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 18 · Environment variables
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'environment-variables', 4, 'Environment variables', 'Separas configuración de código y sabes qué puede viajar al navegador y qué no.', 9,
  'Una **variable de entorno** es un valor que cambia según dónde corra el proyecto: en tu máquina apunta a la base de pruebas, en producción a la real. El código es el mismo; la configuración, no.

En local viven en `.env.local`, que **nunca** se sube al repositorio. En producción se configuran en el panel del proveedor.

La distinción crítica: las variables con prefijo público (`NEXT_PUBLIC_…`) **se incrustan en el código que llega al navegador**. Cualquiera puede leerlas. Ahí sólo va lo que no sea secreto: la URL del proyecto, la anon key. La *service role key* y cualquier otra clave privada se quedan en el servidor, siempre.

Si una clave se te escapa —a un commit, a una captura, a una grabación— no basta con borrarla: hay que **rotarla**, es decir, generar una nueva e invalidar la vieja. Lo que se publicó una vez, se publicó.',
  'Nunca enseñes una clave privada. Nunca la subas al repo.', 'Separas configuración de código y sabes qué puede viajar al navegador y qué no.', array['.env.local', 'Vercel env', 'public vs private', 'secret', 'rotation']::text[],
  'Saca toda la configuración del código a variables de entorno, en local y en Vercel. Comprueba que `.env.local` está en `.gitignore`.', 10, 'El proyecto funciona en producción y no hay ni un secreto en el repositorio.', 'Captura de la configuración en Vercel con los valores ocultos.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 19 · Dominio + DNS
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'dominio-y-dns', 5, 'Dominio + DNS', 'Conectas un dominio a tu proyecto y entiendes quién resuelve qué.', 10,
  '**DNS** es la agenda de Internet: traduce un nombre que las personas recuerdan a la dirección de la máquina que responde.

Tu dominio **no contiene** tu web. Sólo apunta a donde está.

- Un registro **A** apunta a una dirección IP.
- Un **CNAME** apunta a otro nombre (es lo que suele pedirte Vercel).
- Los **nameservers** dicen quién manda sobre el dominio entero.

Los cambios tardan en verse en todas partes: eso es la **propagación**, y es normal que durante un rato tú veas una cosa y otra persona otra.

Y el candado del navegador es **SSL/TLS**: cifra lo que viaja entre el visitante y tu servidor. Hoy te lo emite el proveedor automáticamente, pero conviene saber que existe y por qué.',
  'El dominio no es el hosting.', 'Conectas un dominio a tu proyecto y entiendes quién resuelve qué.', array['A', 'AAAA', 'CNAME', 'nameservers', 'DNS propagation', 'SSL/TLS']::text[],
  'Conecta un dominio a tu proyecto. Si no tienes uno, documenta paso a paso qué registros harían falta y por qué.', 15, 'El dominio resuelve, o el documento explica correctamente los registros necesarios.', 'Captura de la configuración DNS o el diagrama.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 20 · Landing gratis
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-ship'),
  'landing-gratis', 6, 'Landing gratis', 'Publicas una landing estática y sabes decidir cuándo no hace falta más.', 10,
  'Una web **estática** es un conjunto de archivos ya hechos. No hay nada que calcular por visita: sólo entregarlos.

Eso la hace rapidísima y casi gratis de alojar, porque puede repartirse desde una **CDN**: una red de nodos por todo el mundo que sirven una copia desde el más cercano a cada visitante.

La regla de decisión, que es lo que de verdad te llevas de esta lección:

| Proyecto | Stack orientativo |
|---|---|
| Landing estática | GitHub + hosting estático |
| Landing con formulario simple | estático + servicio de formularios |
| App con datos y usuarios | Vercel + Supabase |
| SaaS | Vercel + Supabase + lo que pida |

Montar una base de datos para una web de cinco secciones es pagar complejidad sin comprar nada.',
  'No todas las webs necesitan un servidor. Ni una base de datos.', 'Publicas una landing estática y sabes decidir cuándo no hace falta más.', array['static assets', 'static hosting', 'CDN', 'caché', 'DNS']::text[],
  'Publica una landing estática, sin base de datos, en un hosting estático y con su URL pública.', 20, 'La URL funciona y el proyecto no depende de ningún backend.', 'La URL pública.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 21 · Landing → SaaS
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-autonomia'),
  'landing-a-saas', 1, 'Landing → SaaS', 'Reconoces la escalera por la que un proyecto crece y sabes en qué peldaño estás.', 10,
  'Todos los productos que usas recorrieron la misma escalera, y tú acabas de subirla entera:

**estático → formulario → base de datos → usuarios → panel → cobro.**

Cada peldaño añade capacidad y añade coste: más piezas, más cosas que pueden fallar, más que mantener. Por eso la pregunta útil no es «¿cómo llego arriba?» sino «**¿en qué peldaño está mi problema?**».

El salto que marca la diferencia es el tercero. Mientras no guardas nada, tienes una web. En cuanto guardas algo de alguien, tienes un producto: hay datos que proteger, cuentas que recuperar y una copia de seguridad que alguien tendrá que haber pensado.

El **cobro** aquí sólo lo nombramos. No es parte de este curso, pero sí el peldaño siguiente.',
  'Aquí es donde deja de ser una landing.', 'Reconoces la escalera por la que un proyecto crece y sabes en qué peldaño estás.', array['static', 'form', 'database', 'auth', 'dashboard', 'billing']::text[],
  'Coge la landing estática de la lección 20 y súbela un peldaño: que su formulario persista en la base de datos.', 15, 'El dato llega a la tabla desde la landing publicada.', 'La URL + captura de la fila.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 22 · IA con autonomía
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-autonomia'),
  'ia-con-autonomia', 2, 'IA con autonomía', 'Añades una funcionalidad completa con IA manteniendo el control del resultado.', 11,
  'Ya tienes el flujo. Aquí lo subes de nivel para una funcionalidad entera, no un cambio suelto.

1. **Plan primero.** Pide el plan antes que el código: qué archivos, en qué orden, qué se rompe. Corregir un plan cuesta un minuto; corregir una implementación, una tarde.
2. **Contexto, no deseos.** Qué hace el proyecto, qué convenciones sigue, qué archivos son relevantes, qué no se puede tocar.
3. **Incrementos verificables.** Cada paso tiene que poder probarse antes del siguiente.
4. **Commit entre pasos.** Cada uno es un punto de vuelta.
5. **Explícalo tú.** Si no puedes contarle a alguien qué hace ese código y por qué, todavía no es tuyo: es prestado.

Ésa es la diferencia entre la velocidad de la IA y depender de ella.',
  'Tienes que poder explicar cada cambio. Si no, no es tuyo.', 'Añades una funcionalidad completa con IA manteniendo el control del resultado.', array['plan', 'context', 'incremental changes', 'diff', 'tests', 'documentation']::text[],
  'Añade una funcionalidad nueva a LeadFlow trabajando con Claude Code: plan, incrementos, diffs revisados y commits.', 20, 'La funcionalidad va y explicas cada archivo tocado con tus palabras.', 'Los diffs o commits + tu explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 23 · Mapa mental
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-autonomia'),
  'mapa-mental', 3, 'Mapa mental', 'Consolidas la arquitectura completa y sabes qué pieza resuelve qué problema.', 10,
  'Vuelve al diagrama de la lección 1. Ahora puedes rellenarlo con nombres propios:

| Capa | Qué hace | En este curso |
|---|---|---|
| Frontend | Lo que corre en el navegador | Tu interfaz |
| Servicio de datos | Atiende operaciones | Supabase |
| Database | Persistencia estructurada | PostgreSQL |
| Auth | Quién eres | Supabase Auth |
| Authorization | Qué puedes ver | RLS y policies |
| Repositorio | Historial del código | GitHub |
| Deployment | Poner el build en producción | Vercel |
| DNS | A dónde va el dominio | Tu proveedor |

El objetivo del curso no era aprender estas siete herramientas. Era aprender las siete **capas**, para que cuando cambies de herramienta —y vas a cambiar— sigas sabiendo qué estás sustituyendo.',
  'Herramienta ↔ capa ↔ problema. Los tres, juntos.', 'Consolidas la arquitectura completa y sabes qué pieza resuelve qué problema.', array['frontend', 'backend', 'data', 'auth', 'authorization', 'deploy', 'DNS', 'Git']::text[],
  'Dibuja la arquitectura real de tu proyecto terminado: cada capa, la herramienta que la ocupa y el problema que resuelve.', 15, 'Aparecen todas las capas con su herramienta y su función.', 'El diagrama.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- 24 · SHIP IT
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (
  (select id from public.modules where slug = 'web-abc-autonomia'),
  'ship-it', 4, 'SHIP IT', 'Entregas el proyecto terminado y demuestras que entiendes lo que has construido.', 12,
  'Mira dónde estás. Hace unas horas tenías una idea y una carpeta. Ahora tienes código versionado, una base de datos, usuarios, un panel y una URL pública.

Antes de entregar, repasa:

- El build pasa y producción carga.
- El registro y el login funcionan en la URL pública, no sólo en local.
- Un usuario no ve los datos de otro (compruébalo otra vez).
- No hay ni una clave en el repositorio.
- Los estados vacío y de error existen.
- El `README` explica qué es el proyecto, cómo se arranca y qué variables necesita.

Y la entrega de verdad no es la URL: es que puedas explicar en tres minutos qué has construido, qué pieza hace qué y por qué elegiste cada una.',
  '¿Puedes explicar tu producto sin decir «lo hizo la IA»?', 'Entregas el proyecto terminado y demuestras que entiendes lo que has construido.', array['QA', 'build', 'production', 'repo', 'database', 'auth', 'README']::text[],
  'Entrega LeadFlow terminado: URL pública, repositorio y una explicación de dos o tres minutos de tu arquitectura y tus decisiones.', 45, 'URL, repo y explicación completos, y la explicación demuestra comprensión propia.', 'URL + repositorio + vídeo o texto de la explicación.',
  '/video/demo-web-abc.mp4', 'demo'
) on conflict (module_id, slug) do update set
  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,
  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,
  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,
  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,
  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,
  video_provider = excluded.video_provider;

-- ── Tests ────────────────────────────────────────────
-- Tres preguntas por lección, como pide el máster plan: una conceptual,
-- una de aplicación y una de discriminación entre herramientas.
--
-- Con tres y un umbral del 80 % hay que acertar las tres. Es duro a
-- propósito y no penaliza: el test se repite tantas veces como haga falta,
-- porque el objetivo es dominar el concepto, no filtrar gente.

-- 01 · La web que ya sabes hacer no está terminada
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'la-web-que-ya-sabes-hacer-no-esta-terminada' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué capa representa lo que ve el usuario?'),
         (2, 'Abres una web y tarda en cargar la lista de productos, pero el menú aparece al instante. ¿Qué está pasando?'),
         (3, '¿Cuál de estas piezas NO participa en que una web esté disponible en Internet?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'El DNS', false),
  (1, 2, 'El repositorio', false),
  (1, 3, 'El frontend', true),
  (1, 4, 'La database', false),
  (2, 1, 'El build de producción no ha terminado', false),
  (2, 2, 'El repositorio no tiene el último commit', false),
  (2, 3, 'El dominio todavía no ha terminado de resolverse', false),
  (2, 4, 'El frontend ya se ha pintado y todavía está esperando los datos que pidió', true),
  (3, 1, 'El hosting', false),
  (3, 2, 'El editor de código con el que la escribiste', true),
  (3, 3, 'El DNS', false),
  (3, 4, 'El deploy', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 02 · ¿Qué coño es un servidor?
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'que-es-un-servidor' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿localhost es Internet?'),
         (2, 'Tu proyecto funciona en localhost:3000 y le mandas esa dirección a un cliente. ¿Qué verá?'),
         (3, '¿Qué diferencia hay entre un archivo y un servidor?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Sí, siempre que tengas conexión', false),
  (1, 2, 'No: es tu propia máquina y sólo tú puedes resolverla', true),
  (1, 3, 'Sí, si el proyecto está en marcha', false),
  (1, 4, 'Sólo si has hecho commit', false),
  (2, 1, 'Una versión antigua del proyecto', false),
  (2, 2, 'Tu proyecto, porque localhost es una dirección pública', false),
  (2, 3, 'Un error: en su máquina esa dirección no lleva a tu proyecto', true),
  (2, 4, 'Tu proyecto, pero más lento', false),
  (3, 1, 'El archivo está online y el servidor en local', false),
  (3, 2, 'El servidor es el disco duro donde se guarda el archivo', false),
  (3, 3, 'El archivo es contenido; el servidor es un programa en marcha que lo entrega cuando se lo piden', true),
  (3, 4, 'Ninguna: un servidor es una carpeta de archivos', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 03 · GitHub, ¿para qué sirve realmente?
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'github-para-que-sirve-realmente' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué hace un commit?'),
         (2, 'Has roto el proyecto tocando tres archivos y quieres volver a como estaba hace una hora. ¿Qué te salva?'),
         (3, 'Has subido tu código a GitHub. ¿Ya está tu web online?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Guarda un punto de recuperación en el historial de Git', true),
  (1, 2, 'Publica la web en Internet', false),
  (1, 3, 'Reinicia el servidor de desarrollo', false),
  (1, 4, 'Crea una copia de la base de datos', false),
  (2, 1, 'Un commit anterior, si lo hiciste', true),
  (2, 2, 'Volver a desplegar en Vercel', false),
  (2, 3, 'El historial de deshacer del editor', false),
  (2, 4, 'Restaurar una copia de la base de datos', false),
  (3, 1, 'Sí, pero sólo la página de inicio', false),
  (3, 2, 'Sí, en cuanto el repositorio sea público', false),
  (3, 3, 'Sí, GitHub publica automáticamente cualquier repositorio', false),
  (3, 4, 'No: GitHub guarda el código, no lo sirve a los visitantes', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 04 · Claude Code + Warp
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'claude-code-y-warp' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Por qué revisar el diff?'),
         (2, 'Le pides a la IA una funcionalidad y te devuelve 400 líneas en seis archivos. ¿Qué haces?'),
         (3, '¿Qué aporta el diff que no aporta probar la web en el navegador?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Para que el cambio se despliegue antes', false),
  (1, 2, 'Porque sin revisarlo Git no deja hacer commit', false),
  (1, 3, 'Para reducir el tamaño del repositorio', false),
  (1, 4, 'Para entender y verificar exactamente qué ha cambiado', true),
  (2, 1, 'Aceptarlo y hacer commit para no perderlo', false),
  (2, 2, 'Descartarlo y escribirlo a mano', false),
  (2, 3, 'Pedirle el plan y trocearlo en cambios pequeños que puedas verificar', true),
  (2, 4, 'Aceptarlo: si funciona al probarlo, está bien', false),
  (3, 1, 'Te dice cuánto va a tardar el build', false),
  (3, 2, 'Te dice si el diseño ha quedado bien', false),
  (3, 3, 'Te dice qué se ha cambiado exactamente, incluido lo que aún no se ve', true),
  (3, 4, 'Te dice si el servidor está encendido', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 05 · Primera versión
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'primera-version' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Dónde viven los componentes de interfaz?'),
         (2, 'Quieres saber con qué comando se arranca un proyecto que acabas de clonar. ¿Dónde miras?'),
         (3, '¿Qué distingue una dependencia de un archivo tuyo del proyecto?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'En la base de datos', false),
  (1, 2, 'En las variables de entorno', false),
  (1, 3, 'En el DNS', false),
  (1, 4, 'En el frontend, dentro del proyecto', true),
  (2, 1, 'En los scripts de package.json', true),
  (2, 2, 'En el editor de tablas de Supabase', false),
  (2, 3, 'En los registros DNS del dominio', false),
  (2, 4, 'En el panel de Vercel', false),
  (3, 1, 'La dependencia es código ajeno que declaras y se instala; tu archivo lo escribes y versionas tú', true),
  (3, 2, 'La dependencia va en el frontend y tu archivo en el backend', false),
  (3, 3, 'No hay diferencia: node_modules es parte de tu código', false),
  (3, 4, 'La dependencia se guarda en la base de datos', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 06 · Frontend
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'frontend' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Dónde vive el estado temporal de un formulario?'),
         (2, 'Rellenas medio formulario, recargas la página y los campos aparecen vacíos. ¿Es un fallo?'),
         (3, '¿Qué diferencia hay entre el state de un formulario y una fila de la base de datos?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'En el servidor DNS', false),
  (1, 2, 'En el cliente: la memoria del navegador', true),
  (1, 3, 'En la base de datos', false),
  (1, 4, 'En el repositorio de GitHub', false),
  (2, 1, 'Sí: la base de datos no ha guardado los datos', false),
  (2, 2, 'No: el state vive en la memoria del navegador y se pierde al recargar', true),
  (2, 3, 'Sí: falta desplegar la última versión', false),
  (2, 4, 'Sí: el servidor ha rechazado la petición', false),
  (3, 1, 'El state es más rápido porque está comprimido', false),
  (3, 2, 'La fila sólo existe mientras haya sesión iniciada', false),
  (3, 3, 'Ninguna: el state se guarda automáticamente en la base', false),
  (3, 4, 'El state dura mientras la página está abierta; la fila sigue ahí mañana', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 07 · ¿Qué es una base de datos?
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'que-es-una-base-de-datos' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué aporta la persistencia?'),
         (2, 'Vas a guardar contactos con nombre, email y empresa. ¿Qué te falta por decidir antes de escribir código?'),
         (3, '¿Qué hace una primary key que no hace un campo normal?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Que el código quede versionado', false),
  (1, 2, 'Que la web cargue más rápido', false),
  (1, 3, 'Que los datos sobrevivan al cierre del navegador', true),
  (1, 4, 'Que el dominio apunte al hosting', false),
  (2, 1, 'El color de los botones del formulario', false),
  (2, 2, 'El proveedor de hosting', false),
  (2, 3, 'El identificador único de cada contacto y el tipo de cada campo', true),
  (2, 4, 'El dominio desde el que se accederá', false),
  (3, 1, 'Cifra el contenido de la fila', false),
  (3, 2, 'Identifica una fila de forma única para poder referirse a ella sin ambigüedad', true),
  (3, 3, 'Impide que el campo quede vacío', false),
  (3, 4, 'Ordena la tabla alfabéticamente', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 08 · Supabase
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'supabase' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué base de datos usa Supabase?'),
         (2, 'Vas a añadir la URL y la clave de Supabase a tu proyecto. ¿Cuál puede acabar en el código del navegador?'),
         (3, 'Supabase te da base de datos, autenticación y APIs. ¿Cuál de estas cosas NO hace?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'PostgreSQL', true),
  (1, 2, 'SQLite', false),
  (1, 3, 'MySQL', false),
  (1, 4, 'MongoDB', false),
  (2, 1, 'La service role key, porque es la que da acceso a las tablas', false),
  (2, 2, 'Las dos: son públicas mientras el proyecto sea privado', false),
  (2, 3, 'Ninguna de las dos: siempre van en el servidor', false),
  (2, 4, 'La anon key: es pública por diseño y por eso el acceso real lo decide RLS', true),
  (3, 1, 'Crear y validar sesiones de usuario', false),
  (3, 2, 'Guardar filas en tablas', false),
  (3, 3, 'Registrar y gestionar tu nombre de dominio', true),
  (3, 4, 'Aplicar reglas de acceso por fila', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 09 · La web recuerda
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'la-web-recuerda' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué operación crea un registro?'),
         (2, 'El formulario dice «guardado» pero la tabla sigue vacía. ¿Por dónde empiezas?'),
         (3, '¿Qué operación usarías para leer los contactos ya guardados?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'COMMIT', false),
  (1, 2, 'INSERT', true),
  (1, 3, 'DEPLOY', false),
  (1, 4, 'SELECT', false),
  (2, 1, 'Por volver a desplegar el proyecto', false),
  (2, 2, 'Por borrar la caché del navegador', false),
  (2, 3, 'Por cambiar el nombre de la tabla', false),
  (2, 4, 'Por mirar la respuesta de la petición: probablemente hay un error que no se está gestionando', true),
  (3, 1, 'SELECT', true),
  (3, 2, 'COMMIT', false),
  (3, 3, 'INSERT', false),
  (3, 4, 'DEPLOY', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 10 · APIs sin humo
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'apis-sin-humo' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué contiene normalmente un JSON?'),
         (2, 'Ves en Network una petición que devuelve 401. ¿Qué significa?'),
         (3, '¿Qué diferencia hay entre una API y una base de datos?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Los registros DNS del dominio', false),
  (1, 2, 'El historial de commits', false),
  (1, 3, 'Código ejecutable del servidor', false),
  (1, 4, 'Datos estructurados en pares clave-valor', true),
  (2, 1, 'Que la petición no va identificada: el servidor no sabe quién eres', true),
  (2, 2, 'Que la ruta no existe', false),
  (2, 3, 'Que los datos se han guardado correctamente', false),
  (2, 4, 'Que el servidor se ha caído', false),
  (3, 1, 'La API es la puerta por la que se piden las cosas; la base de datos es donde están guardadas', true),
  (3, 2, 'La API es del frontend y la base de datos del navegador', false),
  (3, 3, 'Son lo mismo con distinto nombre', false),
  (3, 4, 'La API guarda los datos y la base de datos los sirve', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 11 · Usuarios
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'usuarios' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué identifica al usuario entre peticiones?'),
         (2, 'Escondes el enlace al panel cuando no hay sesión. ¿Están protegidos los datos?'),
         (3, 'Un usuario ha iniciado sesión. ¿Qué hace la sesión que no hace el registro?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'El nombre del repositorio', false),
  (1, 2, 'La primary key de la tabla leads', false),
  (1, 3, 'La sesión, ligada a su user id', true),
  (1, 4, 'La dirección IP del navegador', false),
  (2, 1, 'Sí, si además el proyecto está desplegado en producción', false),
  (2, 2, 'Sí, siempre que el repositorio sea privado', false),
  (2, 3, 'Sí: sin enlace no hay forma de llegar', false),
  (2, 4, 'No: esconder la interfaz no impide que alguien pida los datos directamente', true),
  (3, 1, 'Mantener identificado a ese usuario en las peticiones siguientes', true),
  (3, 2, 'Crear su fila en la tabla de usuarios', false),
  (3, 3, 'Cifrar su contraseña', false),
  (3, 4, 'Darle permisos de administrador', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 12 · Seguridad básica
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'seguridad-basica' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué restringe RLS?'),
         (2, 'Quieres que cada usuario vea sólo sus propios contactos. ¿Qué escribes?'),
         (3, '¿Qué diferencia hay entre autenticación y autorización?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'El número de peticiones por minuto', false),
  (1, 2, 'Los puertos abiertos del servidor', false),
  (1, 3, 'El acceso a filas concretas de una tabla', true),
  (1, 4, 'El tamaño máximo de la base de datos', false),
  (2, 1, 'Un filtro en la consulta del frontend', false),
  (2, 2, 'Una policy que compare el user_id de la fila con auth.uid()', true),
  (2, 3, 'Una variable de entorno con la lista de usuarios', false),
  (2, 4, 'Una comprobación en el componente antes de pintar la lista', false),
  (3, 1, 'La autenticación es del servidor y la autorización del navegador', false),
  (3, 2, 'La autenticación dice quién eres; la autorización, qué puedes ver o hacer', true),
  (3, 3, 'La autorización ocurre antes de la autenticación', false),
  (3, 4, 'Son dos nombres para el login', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 13 · Dashboard
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'dashboard' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué estado aparece cuando la consulta va bien pero no hay registros?'),
         (2, 'Un usuario nuevo entra en el panel y todavía no ha creado nada. ¿Qué tiene que ver?'),
         (3, '¿Qué diferencia hay entre el estado vacío y el estado de error?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Un 404', false),
  (1, 2, 'El estado de carga', false),
  (1, 3, 'El estado vacío', true),
  (1, 4, 'El estado de error', false),
  (2, 1, 'Un indicador de carga permanente', false),
  (2, 2, 'Un estado vacío que le explique qué es esto y le invite a crear el primero', true),
  (2, 3, 'Un mensaje de error', false),
  (2, 4, 'Una lista en blanco, sin más', false),
  (3, 1, 'El error sólo aparece si no has iniciado sesión', false),
  (3, 2, 'El vacío significa que la consulta fue bien y no hay nada; el error, que la consulta falló', true),
  (3, 3, 'Son el mismo estado con distinto texto', false),
  (3, 4, 'El vacío ocurre sin conexión y el error con conexión', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 14 · CRUD
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'crud' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué significa CRUD?'),
         (2, 'Tienes una policy que cubre la lectura y añades el botón de borrar. ¿Qué falta?'),
         (3, '¿Qué operación de CRUD corresponde a editar el email de un contacto?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Commit, Run, Update, Deploy', false),
  (1, 2, 'Cache, Route, User, Data', false),
  (1, 3, 'Create, Read, Update, Delete', true),
  (1, 4, 'Client, Runtime, URL, Domain', false),
  (2, 1, 'Una policy para delete: cada operación necesita la suya', true),
  (2, 2, 'Nada: la policy de lectura cubre todas las operaciones', false),
  (2, 3, 'Añadir una nueva columna a la tabla', false),
  (2, 4, 'Volver a desplegar el proyecto', false),
  (3, 1, 'Update', true),
  (3, 2, 'Read', false),
  (3, 3, 'Delete', false),
  (3, 4, 'Create', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 15 · Debugging
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'debugging' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué haces primero al depurar?'),
         (2, 'La página se queda en blanco y no sabes por qué. ¿Cuál es el primer paso?'),
         (3, 'El error aparece en la terminal donde corre el servidor, no en la consola del navegador. ¿Qué te dice eso?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Borrar node_modules', false),
  (1, 2, 'Reproducir el error y observarlo', true),
  (1, 3, 'Reescribir el componente entero', false),
  (1, 4, 'Hacer un deploy a producción', false),
  (2, 1, 'Reproducirlo a propósito y leer el error entero en la consola', true),
  (2, 2, 'Desplegar a producción para ver si allí funciona', false),
  (2, 3, 'Reescribir el componente desde cero', false),
  (2, 4, 'Borrar la base de datos y volver a crearla', false),
  (3, 1, 'Que el dominio está mal configurado', false),
  (3, 2, 'Que hay que reinstalar las dependencias', false),
  (3, 3, 'Que la sesión ha caducado', false),
  (3, 4, 'Que el fallo está en el código que se ejecuta en el servidor, no en el navegador', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 16 · Git checkpoints
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'git-checkpoints' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué muestra git diff?'),
         (2, 'Vas a hacer un cambio grande y arriesgado. ¿Cuándo haces commit?'),
         (3, '¿Qué diferencia hay entre commit y push?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Las tablas de la base de datos', false),
  (1, 2, 'Los despliegues de Vercel', false),
  (1, 3, 'Los cambios que todavía no has confirmado', true),
  (1, 4, 'La lista de ramas del repositorio', false),
  (2, 1, 'Nunca: para eso está el historial del editor', false),
  (2, 2, 'Sólo al final, cuando ya funcione todo', false),
  (2, 3, 'Sólo si el cambio sale mal', false),
  (2, 4, 'Antes de empezar, para tener un punto conocido al que volver', true),
  (3, 1, 'Son lo mismo, push es el atajo', false),
  (3, 2, 'El commit guarda en tu máquina; el push lo manda al repositorio remoto', true),
  (3, 3, 'El commit publica la web y el push guarda el código', false),
  (3, 4, 'El push guarda en local y el commit en GitHub', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 17 · Vercel deploy
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'vercel-deploy' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué hace un deployment?'),
         (2, 'En local todo va, pero en producción la web carga y falla al pedir datos. ¿Primera sospecha?'),
         (3, '¿Qué hace Vercel que NO hace GitHub?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Crea las tablas de la base de datos', false),
  (1, 2, 'Guarda los cambios en el historial de Git', false),
  (1, 3, 'Pone una versión concreta del proyecto en un entorno accesible', true),
  (1, 4, 'Registra el dominio a tu nombre', false),
  (2, 1, 'Que la tabla no existe', false),
  (2, 2, 'Que faltan las variables de entorno en el proveedor', true),
  (2, 3, 'Que el dominio no ha propagado', false),
  (2, 4, 'Que falta hacer commit', false),
  (3, 1, 'Gestionar las ramas del repositorio', false),
  (3, 2, 'Alojar el código fuente', false),
  (3, 3, 'Construir el proyecto y servirlo a los visitantes', true),
  (3, 4, 'Guardar el historial de commits', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 18 · Environment variables
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'environment-variables' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Dónde configurarías los secretos de producción?'),
         (2, 'Se te ha colado una clave privada en un commit y ya la has borrado del código. ¿Basta?'),
         (3, '¿Qué distingue una variable pública de una privada?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'En un archivo del repositorio', false),
  (1, 2, 'En el código del frontend', false),
  (1, 3, 'En las variables de entorno del proveedor', true),
  (1, 4, 'En el registro DNS del dominio', false),
  (2, 1, 'No: hay que rotarla, porque quedó publicada en el historial', true),
  (2, 2, 'Sí, si el repositorio es privado', false),
  (2, 3, 'Sí: al borrarla del archivo deja de ser válida', false),
  (2, 4, 'Sí, si haces un commit nuevo encima', false),
  (3, 1, 'La pública se guarda en la base de datos', false),
  (3, 2, 'La pública es más corta', false),
  (3, 3, 'La privada sólo funciona en local', false),
  (3, 4, 'La pública se incrusta en el código que llega al navegador y cualquiera puede leerla', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 19 · Dominio + DNS
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'dominio-y-dns' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué resuelve el DNS?'),
         (2, 'Has cambiado el DNS y tu socio sigue viendo la web antigua. ¿Qué ocurre?'),
         (3, '¿Qué hace el DNS que NO hace el hosting?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Un nombre de dominio hacia el destino que responde', true),
  (1, 2, 'El proceso de build del proyecto', false),
  (1, 3, 'El almacenamiento de los usuarios', false),
  (1, 4, 'El historial de versiones del código', false),
  (2, 1, 'El deploy ha fallado', false),
  (2, 2, 'El cambio se está propagando y todavía no ha llegado a todas partes', true),
  (2, 3, 'Le falta iniciar sesión', false),
  (2, 4, 'El certificado SSL ha caducado', false),
  (3, 1, 'Almacenar los datos de tus usuarios', false),
  (3, 2, 'Guardar y entregar los archivos de tu web', false),
  (3, 3, 'Ejecutar el código de tu proyecto', false),
  (3, 4, 'Traducir tu nombre de dominio a la dirección de la máquina que responde', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 20 · Landing gratis
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'landing-gratis' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Cuándo basta con hosting estático?'),
         (2, 'Te piden una web de cinco secciones sin formularios ni usuarios. ¿Qué montas?'),
         (3, '¿Qué aporta una CDN que no aporta un único servidor?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Cuando el proyecto tiene menos de diez usuarios', false),
  (1, 2, 'Cuando no necesitas backend dinámico ni base de datos', true),
  (1, 3, 'Cuando el código está en GitHub', false),
  (1, 4, 'Cuando no usas dominio propio', false),
  (2, 1, 'Hosting estático: no hay nada que calcular por visita', true),
  (2, 2, 'Un servidor propio con base de datos', false),
  (2, 3, 'Vercel más Supabase, por si crece', false),
  (2, 4, 'Un panel privado con autenticación', false),
  (3, 1, 'Guarda los datos de los usuarios de forma más segura', false),
  (3, 2, 'Registra el dominio automáticamente', false),
  (3, 3, 'Ejecuta consultas a la base de datos más rápido', false),
  (3, 4, 'Sirve una copia desde el nodo más cercano a cada visitante', true)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 21 · Landing → SaaS
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'landing-a-saas' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué añade un SaaS frente a una landing?'),
         (2, 'Tu landing estática empieza a guardar los contactos que la rellenan. ¿Qué ha cambiado?'),
         (3, '¿Cuál es el primer peldaño que convierte una web en un producto?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Mejor posicionamiento en buscadores', false),
  (1, 2, 'Un dominio personalizado', false),
  (1, 3, 'Usuarios, datos propios y lógica de producto', true),
  (1, 4, 'Un diseño responsive', false),
  (2, 1, 'Que ahora hay datos de personas: alguien tiene que protegerlos y respaldarlos', true),
  (2, 2, 'Nada relevante: sigue siendo una landing', false),
  (2, 3, 'Que deja de necesitar hosting', false),
  (2, 4, 'Que ya no necesita dominio propio', false),
  (3, 1, 'Publicarla en producción', false),
  (3, 2, 'Guardar datos de otras personas', true),
  (3, 3, 'Añadir una animación al héroe', false),
  (3, 4, 'Comprar un dominio propio', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 22 · IA con autonomía
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'ia-con-autonomia' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué es revisar el diff?'),
         (2, 'La IA te propone una solución que funciona pero no entiendes por qué. ¿Qué haces?'),
         (3, '¿Qué le das a la IA para que trabaje bien que no es «lo que quieres»?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Comparar dos despliegues de Vercel', false),
  (1, 2, 'Ejecutar la batería de tests', false),
  (1, 3, 'Inspeccionar exactamente qué cambios se han generado', true),
  (1, 4, 'Revisar el esquema de la base de datos', false),
  (2, 1, 'Descartarla y hacerlo a mano', false),
  (2, 2, 'Aceptarla: si pasa las pruebas, es correcta', false),
  (2, 3, 'Pedirle que te la explique hasta poder contarla tú antes de darla por buena', true),
  (2, 4, 'Aceptarla y anotarlo para revisarlo algún día', false),
  (3, 1, 'El contexto: qué hace el proyecto, qué archivos importan y qué no se puede tocar', true),
  (3, 2, 'Acceso a producción', false),
  (3, 3, 'Un modelo más grande', false),
  (3, 4, 'Más tiempo de ejecución', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 23 · Mapa mental
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'mapa-mental' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué herramienta se ocupa de la base de datos en este curso?'),
         (2, 'Mañana cambias Supabase por otro servicio. ¿Qué se mantiene?'),
         (3, 'En este curso, ¿qué se ocupa del despliegue y qué de los datos?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'GitHub', false),
  (1, 2, 'Supabase', true),
  (1, 3, 'Cloudflare', false),
  (1, 4, 'Vercel', false),
  (2, 1, 'Nada: hay que rediseñar el proyecto entero', false),
  (2, 2, 'Sólo el diseño visual', false),
  (2, 3, 'Sólo el nombre del dominio', false),
  (2, 4, 'Las capas: sigues necesitando datos, identidad y autorización', true),
  (3, 1, 'GitHub del despliegue y Vercel de los datos', false),
  (3, 2, 'Vercel del despliegue y Supabase de los datos', true),
  (3, 3, 'Supabase del despliegue y Vercel de los datos', false),
  (3, 4, 'Cloudflare del despliegue y GitHub de los datos', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- 24 · SHIP IT
with lec as (
       select l.id from public.lessons l
       join public.modules m on m.id = l.module_id
       where l.slug = 'ship-it' and m.course = 'web-abc'
     ),
     qz as (
       insert into public.quizzes (lesson_id, pass_score)
       select id, 0.80 from lec
       on conflict (lesson_id) do update set pass_score = excluded.pass_score
       returning id
     ),
     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),
     preg as (
       insert into public.quiz_questions (quiz_id, order_index, prompt)
       select qz.id, v.i, v.prompt from qz, (values
         (1, '¿Qué tiene que incluir la entrega final?'),
         (2, 'Antes de entregar, ¿qué comprobación NO puedes saltarte?'),
         (3, '¿Qué demuestra de verdad que el proyecto es tuyo?')
       ) as v(i, prompt)
       returning id, order_index
     )
insert into public.quiz_options (question_id, order_index, label, is_correct)
select preg.id, v.i, v.label, v.ok from preg join (values
  (1, 1, 'Sólo el repositorio con los commits', false),
  (1, 2, 'Sólo la URL pública', false),
  (1, 3, 'Una captura del panel de Supabase', false),
  (1, 4, 'URL pública, repositorio y tu explicación', true),
  (2, 1, 'Que el repositorio tenga más de veinte commits', false),
  (2, 2, 'Que el README tenga capturas', false),
  (2, 3, 'Que un usuario no vea los datos de otro, probado en la URL pública', true),
  (2, 4, 'Que el favicon se vea bien', false),
  (3, 1, 'Que la URL pública carga sin errores', false),
  (3, 2, 'Que usaste las herramientas del curso', false),
  (3, 3, 'Que puedes explicar qué hace cada pieza y por qué la elegiste', true),
  (3, 4, 'Que el historial de commits es largo', false)
) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;

-- ── Desbloqueos ──────────────────────────────────────
-- La URL apunta a una página del campus, no a un archivo de public/: lo
-- que se sirve como estático lo puede pedir cualquiera que adivine la
-- dirección, y esto es justamente lo que se gana terminando el curso.
-- /desbloqueos/<key> comprueba la matrícula Y que esté ganado antes de
-- enseñar nada. El contenido vive en src/lib/relampago/unlocks/.

insert into public.unlocks (key, course, order_index, title, description, icon, url) values
  ('web-abc-starter-template', 'web-abc', 1, 'The Web Starter Template', 'El template oficial con la estructura base, los componentes, la configuración y la documentación. Tu punto de partida para el siguiente proyecto.', 'template', '/desbloqueos/web-abc-starter-template')
on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,
  title = excluded.title, description = excluded.description, icon = excluded.icon,
  url = excluded.url;

insert into public.unlocks (key, course, order_index, title, description, icon, url) values
  ('web-abc-research-hack', 'web-abc', 2, 'The Research Hack', 'El flujo para investigar un producto, sus competidores y su documentación desde el navegador, y convertir lo que encuentras en contexto accionable para Claude Code.', 'search', '/desbloqueos/web-abc-research-hack')
on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,
  title = excluded.title, description = excluded.description, icon = excluded.icon,
  url = excluded.url;

insert into public.unlocks (key, course, order_index, title, description, icon, url) values
  ('web-abc-prompt-pack', 'web-abc', 3, 'AI Builder Prompt Pack', 'Prompts para arquitectura, planificación de features, UI, Supabase, depuración, revisión de diffs, QA, SEO y deploy.', 'sparkles', '/desbloqueos/web-abc-prompt-pack')
on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,
  title = excluded.title, description = excluded.description, icon = excluded.icon,
  url = excluded.url;

insert into public.unlocks (key, course, order_index, title, description, icon, url) values
  ('web-abc-tool-perks', 'web-abc', 4, 'Tool Perks', 'Descuentos, créditos y códigos preferenciales negociados con las herramientas del stack. Se actualiza con el tiempo.', 'gift', '/desbloqueos/web-abc-tool-perks')
on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,
  title = excluded.title, description = excluded.description, icon = excluded.icon,
  url = excluded.url;

insert into public.unlocks (key, course, order_index, title, description, icon, url) values
  ('web-abc-ship-checklist', 'web-abc', 5, 'Ship Checklist', 'La lista de lanzamiento: repo → env → base de datos → auth → build → deploy → dominio → DNS → SSL → QA → launch.', 'check', '/desbloqueos/web-abc-ship-checklist')
on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,
  title = excluded.title, description = excluded.description, icon = excluded.icon,
  url = excluded.url;

commit;
