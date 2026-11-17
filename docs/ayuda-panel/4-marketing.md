# Manual del panel · Marketing: Publicaciones y Banners

Este capítulo cubre las dos secciones del grupo **Marketing** del menú lateral: **Publicaciones** (X, LinkedIn y blog) y **Banners** (anuncios para Meta: Facebook e Instagram). Todo lo que sigue sale del código del campus. Cuando algo no se puede afirmar, se dice.

## Marketing · Visión general y acceso

### Quién lo ve
- Solo el rol **administrador**. El grupo «Marketing» del menú lateral solo se pinta para administradores. Además, las rutas `/admin/publicaciones/**` y `/admin/banners/**` redirigen a `/admin` a cualquiera que no sea administrador, aunque escriba la URL a mano. Ni el profesorado ni el rol comercial (que solo ve su gestor comercial) tienen acceso.
- En el servidor, cada acción (generar, guardar, programar, aprobar, descargar…) vuelve a comprobar que eres administrador. Las tablas también están cerradas por RLS a administradores.

### El menú lateral (grupo «Marketing»)
- **Publicaciones** (icono de megáfono). Lleva una **insignia roja** con el número de canales que esperan revisión: los que están en «Por revisar» más los que han dado error. Sus subelementos:
  - **Resumen** → `/admin/publicaciones`
  - **Por revisar** → `/admin/publicaciones/revisar` (con la misma insignia roja)
  - **Calendario** → `/admin/publicaciones/calendario`
  - **Nevera** → `/admin/publicaciones/nevera` (con una insignia neutra: cuántos canales hay en la nevera)
  - **+ Nueva publicación** → `/admin/publicaciones/nueva`
- **Banners** (icono de imagen). Sus subelementos:
  - **Campañas** → `/admin/banners`
  - **Galería** → `/admin/banners/galeria`
  - **Clonador** → `/admin/banners/clonar`
  - **Normas de Meta** → `/admin/banners/normas`
  - **+ Nueva campaña** → `/admin/banners/nueva`

Las insignias cuentan **canales** (versiones), no publicaciones: una publicación con X y LinkedIn por revisar suma 2.

Dos pantallas de Publicaciones **no están en el menú lateral**: **Todas** (`/admin/publicaciones/todas`) y **Ajustes** (`/admin/publicaciones/ajustes`). Se llega a ellas desde las pestañas de la cabecera de la sección (ver más abajo) o desde los enlaces de las tareas.

### Qué IA usa cada sección y dónde se configura
| Qué | Proveedor | Dónde está la clave |
|---|---|---|
| Textos de publicaciones (X, LinkedIn, blog), ideas de imagen y hashtags | **DeepSeek** | Publicaciones → pestaña **Ajustes** → «1 · DeepSeek (la IA que escribe)» (o la variable de entorno `DEEPSEEK_API_KEY`) |
| Imágenes de IA de publicaciones | **OpenAI** (modelo de imagen) | Menú **Ajustes → Inteligencia artificial** (`/admin/ia`), la misma clave que los banners |
| GIFs de publicaciones | **GIPHY** (sin coste de IA) | Publicaciones → Ajustes → «GIPHY (GIFs)» |
| Publicar en X y LinkedIn (cuentas conectadas) | **Upload-Post** | Publicaciones → Ajustes → «4 · Upload-Post (publica en X y LinkedIn)» |
| Textos, ideas de imagen, clonador y traducciones de banners | **OpenAI** (modelo de texto configurado en `/admin/ia`; por defecto `gpt-4o`) | Menú **Ajustes → Inteligencia artificial** |
| Fotos de banners | **OpenAI** (modelo de imagen: `OPENAI_IMAGE_MODEL` si está definido; si no, el primero que acepte la clave entre `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`) | Menú **Ajustes → Inteligencia artificial** |

### También desde Claude (conector MCP)
Ambas secciones se pueden manejar desde Claude con el conector de ActiveXRemote (endpoint `/api/mcp`). Se conecta y se revoca en el menú **Ajustes → Conexiones con Claude** (`/admin/conexiones`). Solo funciona con un token de una cuenta **administrador**; sin token válido responde «Hace falta conectar con una cuenta de administrador.» Las acciones del conector llaman a las mismas funciones que los botones del panel (mismas validaciones, mismos avisos, mismo registro de gasto).

Herramientas disponibles:

| Herramienta | Qué hace | ¿Gasta IA? |
|---|---|---|
| `banners_carpetas` | Lista carpetas con cuántas variantes tiene cada una | No |
| `banners_campanas` | Lista campañas recientes con carpeta y variantes por estado | No |
| `banners_campana` | Todas las variantes de una campaña con textos, composición, botón, carpeta y avisos | No |
| `banners_ver_imagen` | Devuelve la imagen de hasta 6 variantes (reducidas a 540 px de ancho) | No |
| `banners_crear_campana` | Crea una campaña y genera sus variantes (curso, objetivo, 1-8 variantes, 0-8 nativas, ángulos, plantilla, idioma, público, notas, qué ver, líneas visuales, carpeta, nombre, calidad). Tarda 1-3 min | **Sí, OpenAI** |
| `banners_anadir_variantes` | Añade variantes nuevas a una campaña | **Sí, OpenAI** |
| `banners_mas_como_esta` | Variantes del mismo estilo que una | **Sí, OpenAI** |
| `banners_estado` | Cambia estado (aprobado, borrador, descartado) de una o varias; lo que bloquea no se aprueba | No |
| `banners_editar` | Cambia textos, composición, plantilla o botón sin regenerar imagen | No |
| `banners_reescribir` | La IA reescribe los textos con indicaciones (la imagen no cambia) | **Sí, OpenAI** |
| `banners_mover` | Mueve variantes o una campaña entera a una carpeta (si no existe, la crea) | No |
| `banners_descargar` | Crea un enlace de 1 hora para bajar un .zip (máx. 60 variantes) con los textos para Meta | No |
| `banners_video` | Crea un enlace de 1 hora para bajar una variante en MP4 (formato por defecto: story) | No (sin IA) |
| `publicaciones_listar` | Lista por estado: revisar, nevera, programadas, publicadas, errores | No |
| `publicaciones_ver` | Una publicación con todos sus canales, estado, fechas y avisos | No |
| `publicaciones_crear` | Escribe una publicación desde un tema o enlace; queda por revisar | **Sí, DeepSeek** |
| `publicaciones_editar` | Cambia el texto de un canal | No |
| `publicaciones_regenerar` | La IA reescribe un canal con indicaciones; vuelve a «Por revisar» | **Sí, DeepSeek** |
| `publicaciones_programar` | Fecha ISO con zona, `proximo_hueco`, `nevera` o `quitar` | No |
| `publicaciones_desechar` | Borra un canal (si era el último, la publicación entera); lo publicado no se puede | No |

Las instrucciones del conector piden a Claude confirmar contigo antes de crear o regenerar si no lo has pedido explícitamente, porque gasta saldo.

---

## Publicaciones

**Para qué sirve:** convertir un tema o un enlace en un post para X, otro para LinkedIn y un artículo para el blog, revisarlos con vista previa, y darles fecha o guardarlos en la «nevera» para tapar huecos del calendario.

### Conceptos clave
- **Publicación**: lo que creas (nombre interno, tema, enlace de origen, imágenes, idioma). Tabla `social_posts`.
- **Canal / versión**: cada publicación tiene hasta tres versiones, una por canal (X, LinkedIn, Blog). Cada versión tiene **su propio estado y su propia fecha**: publicar en uno no obliga a publicar en los demás. Tabla `social_variants`.
- **Estados de un canal** (etiqueta exacta en pantalla):
  - **Por revisar** (`borrador`): recién escrito o regenerado; nadie ha decidido.
  - **En la nevera** (`nevera`): revisado y listo, sin fecha.
  - **Programada** (`programado`): con fecha y hora.
  - **Publicada** (`publicado`): ya ha salido. No se puede editar, regenerar, desechar ni borrar.
  - **Error** (`error`): ha fallado al salir. Aparece en «Por revisar».
- **Ritmo**: qué días de la semana y a qué hora (de Madrid) publica cada canal. Por defecto: X lunes, miércoles y viernes a las 10:00; LinkedIn martes y jueves a las 09:00; Blog martes a las 08:00.
- **Hueco**: cada momento del ritmo. Un hueco está cubierto si ese día (de Madrid) hay algo programado o publicado en ese canal.
- **Cobertura**: cuánto tiempo seguido, desde hoy, tienes cubiertos todos los huecos; llega hasta el **primer hueco vacío**. Se mide hasta 365 días.
- **Pareja de idioma**: una publicación puede tener su gemela en el otro idioma (ES/EN), enlazada en las dos direcciones, con el mismo material e imágenes. Su nombre acaba en « · EN» o « · ES».
- Todas las fechas y horas del calendario se muestran en hora de **Madrid** (Europe/Madrid). El selector manual de fecha del editor usa la hora local de tu navegador.

### Importante: ¿se publica algo automáticamente?
En el código actual **no existe ningún proceso que publique** las publicaciones programadas:
- Los crons de `vercel.json` son solo `reminders` (diario 07:00 UTC), `digest-students` (lunes 07:00 UTC) y `digest-teachers` (viernes 15:00 UTC), todos de Slack/alumnos. El endpoint `/api/cron/[job]` solo conoce `reminders`, `digest-students`, `digest-teachers`, `correos` y `all`; ninguno toca publicaciones. El cron de pg_cron (migración 0031) solo manda correos de los dry run.
- Ningún código del campus cambia un canal a «Publicada» o «Error», ni llama a la API de Upload-Post para publicar (solo la consulta para saber qué cuentas están conectadas).
- El blog público no lee estas publicaciones: un artículo «Programado» para el blog no aparece solo en `/blog`.
- La propia pantalla de Ajustes dice de Upload-Post: «Se usará en la siguiente fase; puedes dejarlo ya configurado.»

Por tanto, hoy «Programar» **deja la fecha fijada** en el calendario y cuenta para la cobertura y la cuota, pero no publica. Los estados «Publicada» y «Error», el enlace «Ver en la red» y los errores de salida están preparados en pantalla pero, con este código, no se producen. (Las instrucciones del conector de Claude dicen «el campus las publica a su hora»; eso no está implementado en este código.)

### La cabecera de la sección (en todas las pantallas de Publicaciones)
**Pestañas** (en este orden):
- **Inicio** → `/admin/publicaciones` (en el menú lateral se llama «Resumen»).
- **Por revisar** → con insignia roja = canales en «Por revisar» + con «Error».
- **Calendario** → con insignia = canales «Programada».
- **Nevera** → con insignia = canales «En la nevera».
- **Todas** → sin insignia.
- **Ajustes** → lleva un **punto** si falta configuración: no hay clave de DeepSeek, el ritmo no se ha guardado nunca o falta conectar X/LinkedIn en Upload-Post.
- A la derecha, el botón **Nueva publicación**, siempre visible.

**Barra «Estado de los canales»** (chips de colores; cada uno es un enlace a donde se arregla):
- **X**, **LinkedIn**, **Blog**: hasta cuándo va cubierto cada canal (p. ej. «2 semanas», «4 días», «3,5 meses»).
  - Verde: cobertura ≥ días de alerta (Ajustes, por defecto 14). Ámbar: más de 2 días pero menos que el umbral. Rojo: 2 días o menos.
  - «vacío»: el primer hueco ya está vacío.
  - «sin ritmo» (gris): el canal no tiene días marcados → lleva a Ajustes#ritmo.
  - «sin conectar» (rojo, solo X y LinkedIn): la red no está conectada en Upload-Post o hay que reautorizarla → lleva a Ajustes#upload-post.
- **Saldo IA**: saldo de DeepSeek en USD (se refresca como mucho cada 5 minutos). Rojo si no hay clave («sin clave») o el saldo es 0 o menos; ámbar si está por debajo del mínimo de Ajustes; «—» si DeepSeek no contesta. Con clave, el chip abre la página de recarga de DeepSeek (`platform.deepseek.com/top_up`) en otra pestaña.
- **Cuota del mes** (solo si en Ajustes hay un límite distinto de 0): «usadas/límite». Cuenta los canales de X y LinkedIn con fecha este mes (programados o publicados). Ámbar al 80 %, rojo al llegar al límite.

### Inicio / Resumen (`/admin/publicaciones`)
**Para qué:** contestar «¿va todo bien?» y decirte qué hacer ahora.

**Si todavía no hay ninguna publicación** se ve la bienvenida:
- Título «Un tema, tres publicaciones listas para salir», texto explicativo y botón **Crear la primera publicación**.
- Los cuatro pasos de «Cómo funciona»: Crea, Revisa, Programa o guarda, Vigila.
- Tarjeta **Primeros pasos** («n/4 hechos»), cada uno con botón si falta: **Conecta DeepSeek** (Ajustes; hecho si hay clave y el saldo no es 0), **Conecta tus redes** (Cómo; hecho si X o LinkedIn están conectados en Upload-Post), **Crea una publicación** (Crear), **Prográmala** (Revisar; hecho si algo está programado, publicado o en la nevera).

**Con publicaciones**, de arriba abajo:
1. **Veredicto** (banda de color con una frase):
   - Verde «Todo al día»: no hay tareas.
   - Azul «Vas bien: quedan n cosas por hacer» / «queda una cosa por hacer»: solo tareas pendientes o de mejora.
   - Ámbar «Atención: n cosas no pueden esperar» / «hay una cosa que no puede esperar»: hay tareas urgentes.
   - Rojo «Hay algo que impide publicar»: hay alguna tarea que bloquea.
   - Debajo: «Lo próximo que sale: Canal · día · hora · «título»» (enlace al canal), o «No hay nada programado. Crea una publicación o rellena huecos con la nevera.»
   - Tres cifras enlazadas: **Por revisar** (borradores + errores), **Programadas**, **Nevera**.
2. **Qué hacer ahora** (con contador). Lista ordenada de lo que bloquea a lo que mejora. Iconos: error (bloquea), aviso (urgente), info (pendiente), chispa (mejora). Las tareas posibles:
   - «Conecta DeepSeek» (bloquea) → botón «Añadir la clave».
   - «DeepSeek no tiene saldo» (bloquea) → «Recargar». «Queda poco saldo en DeepSeek · Quedan X $» (mejora) → «Recargar».
   - «n no ha/han podido salir» (bloquea) → «Ver errores».
   - «Conecta X/LinkedIn» o «Vuelve a conectar X/LinkedIn» (urgente si ya hay algo programado en ese canal; si no, pendiente) → «Cómo conectarlo». Solo aparece si el canal tiene ritmo y hay clave de Upload-Post.
   - «n por revisar» (pendiente) → «Revisar».
   - «Canal: no sale nada el [día]» (urgente si faltan 2 días o menos; si no, pendiente). Aparece cuando la cobertura del canal es menor que los días de alerta. Si hay algo en la nevera de ese canal, el botón es **Rellenar con la nevera** (reparte la nevera al momento); si no, **Crear una** (abre Nueva con ese canal ya elegido).
   - «Cuota de Upload-Post agotada» (urgente) → «Revisar el plan». «Cuota de Upload-Post casi agotada» (mejora, al 80 %) → «Ver calendario».
   - «Confirma el ritmo» (pendiente, hasta que alguien guarde los Ajustes por primera vez) → «Fijar el ritmo».
   - Vacío: «No hay nada pendiente · Todo está revisado, programado y cubierto…».
3. **Próximas dos semanas** (enlace «Calendario →»). Días de hoy a 13 días después que tengan algo: cada canal programado o publicado con su hora (los publicados con ✓) y cada **hueco vacío** («Hueco en X» con botón «Rellenar» si hay nevera de ese canal —lleva a la Nevera— o «Crear»). Vacío: «Nada programado y ningún hueco del ritmo en estas dos semanas.»
4. **Cobertura**: una barra por canal (llena a los 90 días): parte sólida = «programado», parte clara = «con la nevera». A la derecha la duración (en rojo si está por debajo del umbral de alerta) o «sin ritmo». Al pasar el ratón: «Con la nevera, llegaríamos a …».
5. **Este mes**: **Creadas** (publicaciones creadas este mes), **Publicadas** (canales publicados este mes), **Publicaciones creadas** (total histórico), **Cuota del mes** (usadas/límite o solo usadas si no hay límite).
6. **Coste de la IA** (enlace «Recargar saldo ↗»): **Este mes**, **Por publicación** (coste medio por publicación que ha gastado algo), **Gastado en total**, **Saldo en DeepSeek** (en rojo si está bajo el mínimo).
7. **Lo último que has creado**: las 5 publicaciones más recientes, con una pastilla por canal y su estado, y la fecha de creación. Enlace «Ver todas».
8. Desplegable **Cómo funciona** con los cuatro pasos.

### Por revisar (`/admin/publicaciones/revisar`)
**Ruta:** menú Marketing → Publicaciones → **Por revisar**, o pestaña «Por revisar».
**Para qué:** la bandeja de entrada: todo lo escrito por la IA sin decidir y lo que ha fallado al salir.

En pantalla:
- Texto: «Lo que la IA ha escrito y está esperando tu decisión, y lo que ha fallado al salir…».
- Una fila por publicación (las que tienen algún canal con error, primero; luego por fecha de creación, más nuevas arriba). Cada fila:
  - Título (enlace), pastilla de idioma **ES/EN**, «Escrita el [fecha]».
  - Una pastilla por canal en «Por revisar» o «Error», con color: **rojo** «no ha salido» (estado Error) o «n error(es)» (no cumple una regla obligatoria); **ámbar** «n aviso(s)»; **verde** «lista». Al pasar el ratón por un canal con error se ve el mensaje.
  - Si un canal ha fallado, se muestra «Canal: [mensaje de error]».
  - Botones: **Desechar** (borra la publicación entera con todos sus canales; pide confirmación en línea «¿Seguro?» → «Desechar» / «Cancelar») y **Revisar →** (abre el canal que más atención necesita: el que ha fallado, luego el que tiene errores, luego el primero).
- Vacío: «Nada por revisar · Todo lo escrito tiene fecha o está en la nevera.» con botón «Nueva publicación».

Solo aparecen canales en estado «Por revisar» o «Error». Un canal en la nevera o programado no sale aquí aunque otros canales de la misma publicación sí.

### Calendario (`/admin/publicaciones/calendario`)
**Ruta:** menú Marketing → Publicaciones → **Calendario**, o pestaña «Calendario».
**Para qué:** ver mes a mes lo programado y lo publicado, y los huecos del ritmo que siguen vacíos.

En pantalla:
- Si hay algo en la nevera, botón arriba a la derecha **Rellenar huecos (n)**.
- Navegación: **← Mes anterior**, nombre del mes, **Hoy** (solo si no estás en el mes actual), **Mes siguiente →**. El mes va en la URL (`?mes=AAAA-MM`).
- Rejilla de lunes a domingo («Lun … Dom»). Cada día muestra:
  - Cada canal programado o publicado ese día con su **hora** y el título, coloreado por canal; los publicados se marcan como tales. Al pasar el ratón: «Canal · Estado · título». Clic → abre ese canal en el editor.
  - Recuadros punteados «+ X», «+ LinkedIn», «+ Blog»: **huecos vacíos** del ritmo. Solo se pintan de ahora en adelante (los pasados no). Clic → a la Nevera si hay algo guardado de ese canal, o a Nueva con ese canal elegido.
- **Leyenda**: colores de X, LinkedIn y Blog; «Hueco sin nada (pulsa para taparlo)»; «✓ Publicada».

### Nevera (`/admin/publicaciones/nevera`)
**Ruta:** menú Marketing → Publicaciones → **Nevera**, o pestaña «Nevera».
**Para qué:** guardar canales revisados y listos, sin fecha, para tapar huecos del calendario. Rinde con lo atemporal (consejos, guías); lo que depende de una fecha, mejor con fecha fija.

En pantalla:
- Si hay algo, botón **Rellenar huecos (n)**.
- Tres columnas (X, LinkedIn, Blog), cada una con su número y una línea de cobertura:
  - Con elementos: «Cobertura: [actual] → [con la nevera]».
  - Sin elementos: «Cubierto: [actual o vacío]».
  - Sin ritmo: «sin ritmo».
- Cada elemento (más antiguo primero): título (enlace al canal), pastilla ES/EN, «Guardada el [fecha]», botón **Al próximo hueco** y botón **Desechar** (borra solo ese canal; si era el último de la publicación, se borra la publicación entera).
- Columna vacía: «Nada guardado para este canal.» con botón «Crear».
- Consejo al pie sobre lo atemporal.

**Rellenar huecos (cómo funciona exactamente):**
1. Toma todos los canales en la nevera, del más antiguo al más reciente (por fecha de última modificación).
2. Por cada canal (X, LinkedIn, Blog), descarta los que tengan errores obligatorios.
3. Calcula los huecos libres del ritmo en los **próximos 90 días** (un hueco está ocupado si ese día de Madrid ya hay algo programado o publicado en ese canal).
4. Coloca cada uno en el siguiente hueco libre, a la hora del ritmo, y lo pasa a «Programada».
5. Mensaje: «Programadas n.» y, si sobran, «n no tenían hueco libre en los próximos 90 días.»
El mismo botón aparece en el Calendario y en las tareas del Inicio («Rellenar con la nevera»).

**Al próximo hueco** hace lo mismo con un único canal. Si no hay hueco en 90 días: «No hay ningún hueco libre en los próximos 90 días. Revisa el ritmo o ponle fecha a mano.»

### Todas (`/admin/publicaciones/todas`)
**Ruta:** pestaña **Todas** de la cabecera (no está en el menú lateral), o «Ver todas» en el Inicio.
**Para qué:** listado completo con el estado de cada canal, filtro por estado y búsqueda por nombre.

En pantalla:
- **Filtrar por estado** (chips con contador): **Todas**, **Por revisar**, **Programada**, **En la nevera**, **Publicada**, **Error**. Una publicación entra en un filtro si **alguno** de sus canales está en ese estado; el contador cuenta publicaciones.
- **Buscar por nombre…**: busca en el nombre interno (no en el texto). Se combina con el filtro.
- Tabla (hasta 300 publicaciones, más recientes primero). Columnas: **Publicación** (título + ES/EN), **X**, **LinkedIn**, **Blog** (estado de cada canal y, si tiene, la fecha de programación o publicación; «—» si ese canal no existe), **Coste IA** (todo lo gastado en esa publicación, en USD), **Creada**, y botón **Desechar** (no aparece si algún canal está publicado).
- Vacíos: «Nada se llama «…».» (con búsqueda) o «No hay publicaciones en este estado.»

### Nueva publicación (`/admin/publicaciones/nueva`)
**Ruta:** menú Marketing → Publicaciones → **+ Nueva publicación**, o el botón «Nueva publicación» de la cabecera. Con `?canal=x|linkedin|blog` llega con solo ese canal marcado (así lo usan los botones «Crear» de los huecos).

Si no hay clave de DeepSeek, arriba sale en rojo «Falta la clave de DeepSeek. Sin ella no se puede generar nada: configúrala en Ajustes.» con botón «Ajustes».

Formulario:
1. **¿De qué quieres hablar?** (tema, hasta 4.000 caracteres). Mientras está vacío se ofrecen **Ideas:** con cuatro ejemplos que se pegan al pulsarlos. Con texto se recuerda: «La IA no inventa cifras ni estudios: si quieres un dato en el texto, escríbelo aquí.»
   - Campo de enlace: «O pega un enlace para que la IA lo cuente con nuestra voz (opcional)». El servidor descarga la página (máx. 12 s), saca el texto (hasta 15.000 caracteres) y lo guarda para poder regenerar sin volver a descargarla. Solo acepta http(s) a direcciones públicas.
2. **¿Dónde?**: casillas **X** («Post o hilo corto»), **LinkedIn** («Post de criterio, 900-1.600 caracteres»), **Blog** («Artículo SEO con tablas, checklist y CTA»). Idioma: **Español**, **English** o **Ambos (ES + EN)** («Se escribe en español y se adapta al inglés en una segunda publicación enlazada»).
3. Desplegable **Imágenes y nombre interno (opcional)**:
   - **Imágenes**: hasta 4, JPG, PNG, WebP o GIF de menos de 5 MB, cada una con su «Descripción (texto alternativo)» (máx. 400 caracteres).
   - **Nombre interno** (máx. 200): si se deja vacío, se usa la primera línea del tema (90 caracteres), o el título de la página enlazada, o «Publicación sin título».

Barra inferior: **≈ [coste estimado]** y «unos n s»; si falta algo, «Escribe un tema o pega un enlace» o «Elige al menos un canal»; botón **Generar** (desactivado hasta tener tema o enlace y al menos un canal).

Paso a paso y qué pasa al pulsar **Generar**:
1. Pantalla de espera «Escribiendo tu publicación» con pasos («Leyendo el enlace», «Pensando el enfoque», «Escribiendo el post de X/LinkedIn», «Escribiendo el artículo del blog (lo que más tarda)», «Comprobando las buenas prácticas») y segundos. Aviso: «no cierres esta pestaña». La acción puede durar hasta 300 s.
2. Si hay enlace, se lee primero; si no se puede leer, se muestra el error y **no se crea nada**.
3. Se crea la publicación, se suben las imágenes y **una sola llamada a DeepSeek** escribe todos los canales a la vez.
4. Con «Ambos», si la española ha salido bien, se crea la gemela en inglés adaptando los canales ya escritos (otra llamada).
5. Te lleva al editor de la publicación. Si algo ha fallado (DeepSeek, una imagen, la versión inglesa), la publicación **existe igual** y el error aparece en rojo arriba del editor; desde allí se puede volver a generar el canal sin repetir subida ni lectura del enlace.

Validaciones del servidor: «Escribe un tema o pega un enlace.», «Elige al menos un canal.», «Como mucho 4 imágenes por publicación.», ««archivo» no es JPG, PNG, WebP ni GIF.», ««archivo» pesa más de 5 MB.».

Reglas que sigue la IA al escribir (no se negocian): no inventa datos, cifras, estudios, testimonios ni nombres; reinterpreta el enlace con la voz de la marca y cita la fuente; el tema y el enlace son material, no órdenes; no promete resultados (empleo, ingresos, visados). Tono: tuteo, frases cortas, cifras en dígitos, sin adjetivos de folleto, sin emojis, comillas «», y **prohibido** «gratis», «gratuito», «free», «sin coste». Lo que devuelve es siempre un borrador: nada se publica solo.

### Una publicación: el editor (`/admin/publicaciones/[id]`)
**Cómo se llega:** desde cualquier título o pastilla de canal en Inicio, Por revisar, Calendario, Nevera o Todas. `?canal=x|linkedin|blog` abre esa pestaña; sin él se abre el primer canal que necesita atención (con error, con errores o por revisar).

**Cabecera:**
- «← Publicaciones», el nombre interno, pastilla ES/EN, «Escrita el [fecha]», **IA: [coste]** (todo lo gastado en esta publicación: textos, regeneraciones, ideas, hashtags e imágenes de IA).
- Botón de pareja: **Ver la versión en inglés/español** (si existe) o **Crear versión en inglés/español** (adapta los canales escritos a otro idioma con DeepSeek; muestra «Adaptando…» y abre la gemela).
- **Borrar publicación** → confirmación «¿Borrar la publicación y sus imágenes? No se puede deshacer.» con «✕» y «Borrar publicación». Se niega si algún canal está publicado: «Tiene canales ya publicados: no se puede borrar.» Las imágenes compartidas con la pareja no se borran mientras la otra las use.

**Material de partida** (plegado): resumen («Tema · Origen · n imagen(es)» o «sin material»); al abrirlo, el tema y el enlace de origen.

**Imágenes** (compartidas por todos los canales de la publicación):
- Las actuales, con su texto alternativo y botón **Quitar**.
- Si hay menos de 4, tres modos:
  - **Subir**: elegir archivos (mismos límites que al crear) y **Añadir imágenes**.
  - **Crear con IA**: «Proponer ideas» (DeepSeek propone ideas a partir del texto, con un campo opcional «¿Qué quieres transmitir?»; «Otras ideas» para más), editar la «Descripción de la imagen (en inglés funciona mejor)», elegir formato **Cuadrada 1:1**, **Horizontal 3:2** o **Vertical 2:3**, y **Generar imagen** («Pintando la imagen… (20-40 s)»). Coste aproximado indicado: «Unos 0,05 $ por imagen (OpenAI).» La imagen va sin texto.
  - **GIF**: «Buscar en GIPHY» (o «Tendencia ahora en GIPHY»), **Añadir**. Aviso: «En X, un GIF tiene que ir solo, sin otras imágenes.» Sin clave: «Falta la clave de GIPHY. Ponla en Ajustes».
- Con 4: «Ya hay 4 imágenes: quita alguna para añadir otra.» (Límite de 4 porque X no admite más.)
- La primera imagen hace de portada en la vista previa del blog.

**Pestañas de canal** (X, LinkedIn, Blog): cada una con su estado («Por revisar», «En la nevera», «Programada», «Publicada», «Error» o «sin generar»), un icono (error rojo / aviso ámbar / ok verde) y un punto si hay **cambios sin guardar**. Cambiar de pestaña no pierde lo escrito. La pestaña activa queda en la URL.

**Canal sin generar:** «[Canal] no se ha generado · La IA lo escribe a partir del mismo material…» y botón **Generar para [Canal]** (gasta DeepSeek).

**Dentro de un canal:**
- **Progreso**: Escrita → Revisada → Con fecha (o «En la nevera») → Publicada. Si está programada: «Sale el [fecha]». Si publicada: «Salió el [fecha]» y «Ver en la red ↗» si hay URL.
- Si el estado es Error, el mensaje en rojo.
- **Izquierda, el editor:**
  - **X**: «Post» (o «Hilo · 1/n…»), contador «n caracteres / 280» (los enlaces cuentan 23; en rojo si se pasa), **Quitar** por post del hilo, **+ Añadir post al hilo** (hasta 12 en el hilo).
  - **LinkedIn**: un texto con contador «/ 3.000».
  - Encima de cada texto (X y LinkedIn), herramientas: **Emoji** (por grupos; atajo del sistema ⌃⌘Espacio o Win + .), **Mención** («usuario o página», **Insertar**, «Recientes»; en LinkedIn la mención se publica como texto, hay que etiquetar desde LinkedIn; en X, el @usuario exacto), **Hashtags** (**Proponer hashtags** con DeepSeek → «Propuesta» y «Añadir la propuesta», cada uno marcado Amplio/Medio/Nicho, más «Siempre funcionan en nuestro tema»; límites: X 1-2, LinkedIn 3-5; aviso de que no hay datos de tendencia en vivo).
  - **Blog**: editor de artículo con Título, URL (slug), Keyword principal, Meta descripción, Entradilla, Secciones (Encabezado, «Respuesta directa (40-60 palabras)», bloques —Párrafo, Lista, Lista numerada, Checklist, Pasos, Tabla, Pros y contras, Cifras, Gráfico, Consejo, Aviso legal, Cita, Llamada al producto— con Subir/Bajar/Quitar, y «En corto»), Preguntas frecuentes, Categoría del blog, Curso al que lleva (o «Ninguno (solicitar información)») y Fuentes («Nombre | https://…», una por línea). Un bloque a medias muestra «Incompleto: no se verá hasta que lo rellenes».
- **Derecha, comprobaciones y vista previa:**
  - Lista de avisos en vivo (rojo = error que impide programar; ámbar = aviso) o «Cumple las buenas prácticas del canal.»
  - **Vista previa en X** (Claro/Oscuro), **en LinkedIn** (Escritorio/Móvil, con «…más» como en el feed y la nota «Lo que está antes de «…más» es lo único que se lee seguro…»; corte a 210 caracteres), **en el blog** (la página real con lo que escribes, «Así sale en Google» y **Abrir en una pestaña**). Si la red está conectada en Upload-Post, la vista previa usa el nombre y usuario reales de la cuenta.
- **Barra inferior** (no aparece si está publicada):
  - Estado «Todo guardado» o «Cambios sin guardar» (+ «n error(es)»).
  - **Guardar** (solo con cambios).
  - **Regenerar**: abre un cajón «¿No te convence? Pide otra versión, con indicaciones si quieres.» con un campo («más corto», «otro gancho», «menos formal»…, máx. 1.000) y botón **Regenerar**. Aviso si hay cambios: «Regenerar sustituye el texto, incluidos los cambios sin guardar.» Lo regenerado **vuelve a «Por revisar» y pierde la fecha**. Gasta DeepSeek. No se puede regenerar lo publicado.
  - Si **no** está programada: **Guardar en la nevera** (o **Sacar de la nevera** si ya está en ella → vuelve a «Por revisar») y **Programar**. Ambos desactivados si hay errores («Corrige los errores antes»).
  - **Programar** abre un cajón con:
    - **Próximo hueco libre del ritmo** + la fecha (un clic lo programa ahí). Solo aparece si hay hueco en los próximos 120 días.
    - **O elige día y hora**: selector de fecha y hora (por defecto, la fecha que ya tenía, el próximo hueco, o mañana a las 10:00) y botón **Programar**.
    - Mensaje: «Programada: sale el [fecha].»
  - Si **ya está programada**: **Cambiar fecha** (mismo cajón) y **Quitar fecha** («Sin fecha: vuelve a «Por revisar».»).
  - Cualquier acción guarda antes lo que haya sin guardar, para programar exactamente lo que ves.
- Al intentar salir de la página con cambios sin guardar, el navegador avisa.

Validaciones al programar: «La fecha no es válida.», «La fecha ya ha pasado.» (más de 1 minuto en el pasado), «Corrige antes: [errores]», «Ya está publicada.». Al mandar a la nevera también se exige que no haya errores.

**Comprobaciones por canal** (rojo = error que bloquea programar/nevera; ámbar = aviso):
- X: post vacío (error); más de 280 caracteres (error); más de dos hashtags (aviso); enlace en el primer post de un hilo (aviso); palabra que la marca evita (gratis, free…) (aviso).
- LinkedIn: texto vacío (error); más de 3.000 caracteres (error); menos de 500 («Es corto para LinkedIn…») (aviso); más de 5 hashtags (aviso); palabra evitada (aviso).
- Blog: falta título o slug (error); título > 65 caracteres; meta descripción fuera de 120-155; menos de 3 secciones; respuesta de sección fuera de 30-75 palabras; sección sin bloques; menos de 800 palabras; pocos bloques visuales; ninguna o más de dos llamadas al producto; llamada en la primera sección; cifras o gráfico sin fuente; habla de impuestos/contratos/visados sin aviso legal; «Abre las fuentes y comprueba que existen antes de programar.»; palabra evitada (todos avisos).

### Ajustes (`/admin/publicaciones/ajustes`)
**Ruta:** pestaña **Ajustes** de la cabecera de Publicaciones (no está en el menú lateral; el menú «Ajustes» del panel es otra cosa). También desde las tareas y los chips.
**Para qué:** «Con qué se escribe, con qué se publica, a qué ritmo y cuándo avisar.»

Índice arriba (verde si está hecho, ámbar si falta): «1 · DeepSeek», «2 · Ritmo de publicación», «3 · Alertas», «4 · Upload-Post». Debajo, cinco tarjetas y un único botón **Guardar ajustes** al final, que guarda todo a la vez.

1. **1 · DeepSeek (la IA que escribe)** (`#deepseek`)
   - **Clave de la API** (sk-…). Estado: «Clave guardada: …abcd», «Usando DEEPSEEK_API_KEY del entorno (…abcd)» o «Sin clave». Dejarlo vacío mantiene la actual. Se consigue en platform.deepseek.com → API keys. Las claves nunca se muestran completas: solo sus 4 últimos caracteres.
   - **Borrar la clave guardada** (casilla, solo si la clave está guardada en el panel).
   - **Modelo**: `deepseek-flash` (barato y rápido, por defecto) o `deepseek-v4-pro` («escribe mejor y cuesta unas 4 veces más»). Se puede escribir otro nombre.
   - **Probar conexión** («Probando…»): pide la lista de modelos (no gasta). Respuestas: «Conectado. El modelo X está disponible.», «Conectado, pero DeepSeek no ofrece el modelo X…», «La clave no es válida o ha sido revocada.» (401), «La clave es válida pero la cuenta no tiene saldo.» (402), «Demasiadas peticiones: prueba en un minuto.» (429). Abajo, «Última prueba: [fecha] · ✓/✕ detalle» o «nunca». Cambiar o borrar la clave borra el resultado de la última prueba.
2. **2 · Ritmo de publicación** (`#ritmo`): por canal, casillas **L M X J V S D** y **Hora** (00:00-23:00, hora de Madrid), con «≈ n al mes». Sin días marcados, el canal queda «sin ritmo» (no se mide cobertura ni salen huecos). Hasta que alguien guarde los Ajustes por primera vez, se usa el ritmo de serie y aparece la tarea «Confirma el ritmo».
3. **3 · Alertas** (`#alertas`):
   - «Avisar si la cola programada dura menos de (días)» (1-180, por defecto 14).
   - «Avisar si el saldo de DeepSeek baja de (USD)» (por defecto 2).
   - «Publicaciones al mes del plan de Upload-Post» (por defecto 10; 0 = sin límite; «El plan gratuito permite 10»).
   - Las alertas son **solo en pantalla** (chips, tareas del Inicio, veredicto). No hay correos ni notificaciones de Slack de estas alertas en el código.
4. **4 · Upload-Post (publica en X y LinkedIn)** (`#upload-post`): «Se usará en la siguiente fase; puedes dejarlo ya configurado.»
   - Si hay clave y Upload-Post responde: una fila por red, «Conectada como @usuario», «No conectada: lo que programes aquí no podrá salir» o «Hay que volver a conectarla: el permiso ha caducado». Si falta alguna, pasos: entrar en Upload-Post con la cuenta de la escuela → «Manage Users» → elegir el perfil (si no pone nada, «default») → «Connect» en la red → volver (tarda un par de minutos en aparecer; el estado se refresca cada 2 minutos) y enlace **Abrir Upload-Post ↗**.
   - Si hay clave pero no responde: «Upload-Post no ha contestado: no se puede saber qué redes están conectadas.»
   - Campos **Clave de la API** (vacío = mantener; «Borrar la clave guardada») y **Perfil** (nombre del perfil de Upload-Post con las cuentas; vacío = «default» o el primero).
5. **GIPHY (GIFs)** (`#giphy`): **Clave de la API de GIPHY** (se crea gratis en developers.giphy.com → Create an API Key) y «Borrar la clave guardada».

Tras guardar: «Guardado».

### Lo que pasa por detrás (Publicaciones)
- **DeepSeek** (`api.deepseek.com`, mismo protocolo que OpenAI). Cada llamada se apunta en `social_usage` con modelo, tokens y coste, **también si la respuesta no ha servido** (DeepSeek la cobra igual).
- **Tarifas** usadas para calcular (USD por millón de tokens, hora valle; en **hora punta se cobra el doble**: 01-04 y 06-10 UTC, de lunes a viernes):
  - `deepseek-flash`: entrada en caché 0,003; entrada sin caché 0,15; salida 0,6.
  - `deepseek-v4-pro`: 0,022 / 0,66 / 1,98.
  - Un modelo que no esté en la tabla se cuenta al precio del más caro.
- **Estimación** antes de generar: aproximada; con «Ambos», el doble. El coste real se ve después en la publicación («IA: …») y en el Resumen.
- **Qué gasta IA en Publicaciones:** Generar (crear), Generar para [canal], Regenerar, Crear versión en el otro idioma, «Ambos» al crear (DeepSeek); Proponer ideas de imagen y Proponer hashtags (DeepSeek, céntimos); Generar imagen (OpenAI, ≈0,05 $). No gastan: guardar, programar, nevera, rellenar huecos, desechar, subir imágenes, GIFs.
- **Imágenes**: bucket público `social-media` (público porque las redes descargan la imagen de una URL al publicar).
- **Saldo DeepSeek**: se consulta en `/user/balance` con caché de 5 minutos. **Cuentas Upload-Post**: `api.upload-post.com/api/uploadposts/users`, caché de 2 minutos.
- Sin crons de publicación (ver «¿se publica algo automáticamente?»).

### Dónde encuentro… (Publicaciones)
- **Cuánto he gastado en IA este mes / en total / saldo**: Resumen → tarjeta «Coste de la IA»; saldo también en el chip «Saldo IA».
- **Cuánto costó una publicación concreta**: su editor («IA: …») o Todas → columna «Coste IA».
- **Qué sale mañana / esta semana**: Resumen → «Próximas dos semanas» o «Lo próximo que sale»; Calendario.
- **Hasta cuándo estamos cubiertos en LinkedIn**: chip «LinkedIn» de la cabecera, Resumen → «Cobertura», o Nevera (columna LinkedIn).
- **Qué días y hora publica cada red**: Ajustes → «2 · Ritmo de publicación».
- **Qué está pendiente de revisar**: Por revisar (o insignia roja del menú).
- **Qué hay en la nevera de X**: Nevera → columna X.
- **Una publicación por su nombre**: Todas → «Buscar por nombre…».
- **Todas las que tienen algún canal publicado / con error**: Todas → filtro «Publicada» / «Error».
- **La versión en inglés de una publicación**: su editor → «Ver la versión en inglés»; en las listas se distinguen por la pastilla ES/EN.
- **El texto o el enlace original de una publicación**: su editor → «Material de partida».
- **Si X/LinkedIn están conectados**: Ajustes → «4 · Upload-Post»; o el chip del canal («sin conectar»).
- **Cuántas publicaciones de la cuota llevamos**: chip «Cuota del mes» o Resumen → «Este mes».
- **Si la clave de DeepSeek funciona**: Ajustes → «Probar conexión» / «Última prueba».

### Problemas frecuentes (Publicaciones)
- **«Falta la clave de DeepSeek…» / chip «Saldo IA: sin clave»**: pon la clave en Ajustes → DeepSeek y guarda; luego «Probar conexión».
- **Generar falla con saldo 0**: tarea «DeepSeek no tiene saldo» → «Recargar» (platform.deepseek.com/top_up). La publicación queda creada: vuelve a ella y pulsa «Generar para [canal]».
- **El enlace no se puede leer**: no se crea nada; prueba otro enlace o pega el contenido en el tema. Solo se aceptan direcciones públicas http(s).
- **«Programar» o «Guardar en la nevera» están grises**: el canal tiene errores (rojo). Corrígelos (p. ej. post de más de 280 caracteres) y guarda.
- **«La fecha ya ha pasado.»**: elige una hora futura.
- **Al regenerar he perdido la fecha**: es lo esperado; lo regenerado vuelve a «Por revisar». Vuelve a programarlo.
- **Rellenar huecos no coloca algunos**: «n no tenían hueco libre en los próximos 90 días» → añade días al ritmo o ponles fecha a mano. Los que tienen errores no se colocan.
- **Un canal sale «sin ritmo»**: no tiene días marcados en Ajustes → Ritmo.
- **No puedo borrar / desechar**: tiene algún canal «Publicada»; lo publicado no se borra para conservar el registro.
- **Lo programado no ha salido en la red / en el blog**: con el código actual no hay publicación automática (ver arriba). Hay que publicarlo a mano en la red o en el blog.
- **El chip de X/LinkedIn dice «sin conectar»**: conecta la red en Upload-Post (pasos en Ajustes). Solo afecta a la publicación futura; programar sigue funcionando.

### Relación con otras secciones (Publicaciones)
- **Ajustes → Inteligencia artificial** (`/admin/ia`): la clave de OpenAI que pinta las imágenes con IA (compartida con Banners).
- **Banners**: comparte la cabecera de pestañas y chips, el generador de imágenes de OpenAI y el formato de coste.
- **Ajustes → Conexiones con Claude**: para usar el conector MCP.
- El blog público del campus (`/blog`) no se alimenta de esta sección en el código actual.

---

## Banners

**Para qué sirve:** generar anuncios estáticos (y su versión en vídeo MP4) para Facebook e Instagram, con la marca, en los tres formatos de campaña, revisados contra las normas de Meta, y descargarlos con los textos para pegar en el Administrador de anuncios. **Nada se publica desde aquí**: se aprueban y se suben a mano a Meta.

### Conceptos clave
- **Campaña** (`ad_campaigns`): un brief (curso, objetivo, ángulos, plantilla, idioma, público, notas, referencias de imagen, carpeta). Tipo normal o **clon** (creada desde el Clonador).
- **Variante** (`ad_banners`): una pieza de la campaña. Estados: **Por revisar** (`borrador`), **Aprobado**, **Descartado**.
- **Cursos**: **La escuela** («Los dos caminos, marca general»), **Remote Professional**, **Remote Founder**. Cambian colores y fondo (mesh).
- **Objetivos**: **Conseguir leads** («Llevar al formulario de información»), **Darnos a conocer** («Público frío…»), **Recuperar visitas** («Ya visitaron la web y no pidieron info»).
- **Ángulos**: **Obstáculo**, **Aspiración**, **Método**, **En directo**, **Herramientas**, **Convocatoria**. Se reparten entre las variantes.
- **Plantillas**: **Foto a sangre** (imagen de IA a pantalla completa), **Foto + tarjeta** (imagen con bloque blanco), **Marca (sin foto)** (mesh del curso; no gasta imagen).
- **Composiciones** (dónde va cada cosa): Clásica, Centrada, Titular arriba, Panel partido, Foto enmarcada, Cinta diagonal, Titular gigante, Bocadillo, Portada. **Formatos nativos** (parecen una captura, no un anuncio; sin foto, sin coste de imagen): Chat (WhatsApp), Chat (Telegram), Correo, Tuit, Nota del móvil, Buscador, Invitación, Billete. Imitan el estilo, nunca el logo ni la marca de esas apps.
- **Formatos de salida**:
  - **POST (1080X1080)** — Feed de Facebook e Instagram. Zona segura 60 px.
  - **POST VERTICAL (1080X1350)** — Feed de Instagram y Facebook (el que más pantalla ocupa). 68 px arriba/abajo, 60 a los lados.
  - **STORY (1080X1920)** — Stories y Reels. Reserva 270 px arriba (14 %) y 672 px abajo (35 %).
- **Línea visual**: referencia de estilo de imagen (familias: Gráficos y memes, Fondos, Ciudades, Nómada, Aprender, Personas, Lugares, Conceptual, Objetos, Ilustración y 3D, Gráfico). No se copia: marca la línea de cada variante.
- **Carpeta** (`ad_folders`): para ordenar variantes. Una variante está en una carpeta o en ninguna; una campaña tiene la carpeta donde entran sus variantes nuevas.
- **Bilingüe (ES + EN)**: cada variante puede tener una segunda versión de textos en el otro idioma, con la misma imagen, plantilla y elementos.

### La cabecera de la sección (en todas las pantallas de Banners)
- Pestañas: **Campañas**, **Galería**, **Clonador**, **Normas de Meta**; botón **Nueva campaña**.
- Barra «Estado»:
  - **OpenAI**: «sin clave» (rojo), los 4 últimos caracteres de la clave, o «conectada». Rojo también si la última prueba de la clave falló; verde si fue bien; gris si nunca se probó. Lleva a `/admin/ia`.
  - **Gasto del mes**: suma del gasto de OpenAI en banners desde el día 1 del mes (calculado en UTC), incluidas las ideas de imagen pedidas antes de crear una campaña.
  - **Aprobados**: número total de variantes aprobadas en todas las campañas (verde si hay alguna).

### Campañas (`/admin/banners`)
**Ruta:** menú Marketing → Banners → **Campañas**.
- Título «Banners para Meta» y los cuatro pasos: **Pide**, **Revisa** (lo rojo bloquea, lo ámbar es aviso), **Ajusta** (clic en cualquier texto, encender/apagar elementos, cambiar plantilla; la imagen no se vuelve a pagar), **Descarga**.
- Rejilla de campañas (las 100 más recientes). Cada tarjeta: miniatura en formato vertical (la primera aprobada o la primera no descartada), nombre, «Curso · Objetivo · ES/EN o ES + EN», pastilla **Clonador** si es un clon, «n variantes» (sin contar descartadas) y pastilla verde «n aprobadas».
- Papelera en cada tarjeta → «¿Seguro? Borrar» / «Cancelar». Borra la campaña, sus variantes y todas sus imágenes. No se puede deshacer.
- Vacío: «Todavía no hay campañas · Crea la primera…» con botón «Nueva campaña».

### Nueva campaña (`/admin/banners/nueva`)
**Ruta:** menú Marketing → Banners → **+ Nueva campaña**, o botón «Nueva campaña».
Si no hay clave de OpenAI o su última prueba falló: «Falta la clave de OpenAI (o ha caducado). Pégala en el panel → IA y vuelve.» con botón **Ir a IA**.

Formulario («Cuanto más concreto el brief, mejores las variantes. Los datos del curso ya los conoce»):
1. **¿Qué anunciamos?** — curso (por defecto Remote Professional).
2. **¿Para qué?** — objetivo (por defecto Conseguir leads).
3. **¿Desde qué ángulos?** — casillas (por defecto marcados Obstáculo, Aspiración, Método, En directo y Convocatoria; Herramientas no). «Meta trata como el mismo anuncio dos piezas casi iguales: cuanto más distintos los ángulos, mejor.»
   - **¿Cuántas variantes?** 3 a 8 (por defecto 5). Cada una sale con otra composición, otra imagen, otro botón y otro gancho.
   - **¿Cuántas en formato nativo?** 0 hasta el número de variantes (por defecto 2). No gastan imagen.
4. **¿Cómo se ve?** — plantilla (por defecto Foto a sangre) e idioma: **Español**, **English** o **Ambos · ES + EN** («Cada variante sale en español y en inglés, con la misma imagen»; el principal es el español).
5. **¿Qué imagen?** (solo con plantillas con foto). Selector con pestañas:
   - **Biblioteca**: líneas visuales por familia (filtro «Todas» o una familia), **Sorpréndeme**, **Quitar todas**, contador «n elegidas» / «Máximo 8». Sin elegir: «mezcla al azar, una línea distinta por variante». Muestra «Se crearán n variantes» y qué línea lleva cada una («Variante n»).
   - **Ideas con IA**: «¿Qué quieres ver en las imágenes? (opcional)» y **Dame 12 ideas** / **Otras 12** («Solo texto: cuesta céntimos»; gasta OpenAI).
   - Si eliges más referencias que variantes, se crea una variante por referencia (hasta 8).
- **Carpeta**: «Sin carpeta», una existente o «+ Nueva carpeta…» (con nombre). «Las variantes de esta campaña entrarán en esta carpeta.»
- Desplegable **Público, notas y calidad**: **Público** (máx. 1.000), **Notas para la IA** (máx. 2.000), **Calidad de imagen** (Borrador / Normal / Alta; por defecto Normal), **Nombre de la campaña** (máx. 120; vacío → automático «Professional · leads · fecha»).
- Barra: **Coste estimado: …**, «Unos n s» (≈45 s con foto, +30 en calidad Alta; ≈15 s sin foto), «Elige al menos un ángulo» si no hay, botón **Generar banners**.

Qué pasa al pulsar:
1. Espera «Creando tu campaña»: Leyendo el brief → Escribiendo las variantes → Revisando las normas de Meta → Pintando las fotos → Componiendo las piezas. Hasta 300 s.
2. Se crea la campaña, una llamada de texto escribe todas las variantes, cada una pasa la revisión de normas, se asignan composición y botón distintos, y se pintan las fotos **en paralelo** (20-40 s cada una). Las nativas van con plantilla Marca, sin foto.
3. Si es bilingüe, otra llamada de texto escribe la versión en el otro idioma de todas.
4. Te lleva a la campaña. Si algo falló, la campaña existe igual y el aviso sale en rojo arriba (p. ej. «Las variantes están escritas, pero n imagen(es) no se han podido pintar: … Puedes reintentarlo desde cada variante.»).

### Campaña (`/admin/banners/[id]`)
**Cómo se llega:** clic en una tarjeta de Campañas, o «Abrir campaña» en la Galería.

**Cabecera:** «← Campañas», nombre, «Curso · Objetivo · Idioma · Gastado en esta campaña: …» y, si los hay, público y notas.

**Acciones de campaña:**
- **Añadir variantes** (campañas normales): «¿Cuántas?» 1-8 (por defecto 5), «Distintas entre sí y de las que ya hay…», «Ángulos (opcional: sin elegir, se usan todos)» y **Crear n variantes nuevas**. Alrededor del 40 % salen en formato nativo. La IA recibe los titulares que ya hay para no repetirlos. Gasta OpenAI.
- **Clonar más** (solo campañas clon): 1-5, indicaciones opcionales, **Clonar n más**. Gasta OpenAI.
- Botón de **carpeta** (muestra el nombre de la carpeta actual o «Sin carpeta»): «Carpeta de la campaña» → elegir/crear → **Mover**. «Mueve todas sus variantes y las que se generen después.»
- **Descargar aprobados (.zip)** (solo si hay alguna aprobada).
- **Borrar campaña** → «¿Seguro? Borrar» / «Cancelar».

**Referencia (solo clones):** desplegable con la imagen original y el análisis de la IA: Indicaciones, Gancho, Composición, Escena, Tono, **Se conserva**, **Se adapta**, **No se ha copiado**.

**Lista de variantes** (las descartadas al final). Cada variante es un editor:

*Cabecera de la variante:* «Variante n», pastilla del ángulo, pastilla del estado, «Cambios sin guardar» si hay. Botones:
- **Más como esta**: «Mismo estilo: composición, plantilla, botón y línea visual. Cambian un poco la foto y el texto.» «¿Cuántas?» 1-8 (por defecto 3) → **Crear n parecidas** (desactivado con cambios sin guardar). Si la foto era subida, las nuevas van con plantilla Marca. Entran en la carpeta de la variante. Gasta OpenAI.
- **Descartar** (pasa a «Descartado»; se puede **Recuperar**). Una descartada muestra **Borrar** → «¿Borrar para siempre?» y **Recuperar**.
- **Aprobar** (desactivado si hay algo que bloquea —«Corrige lo que bloquea para poder aprobar»— o cambios sin guardar). Si ya está aprobada: **Volver a revisar**.

*Izquierda, la pieza:*
- Selector de formato: POST (1080X1080), POST VERTICAL (1080X1350) (por defecto), STORY (1080X1920). Si es bilingüe, selector ES/EN.
- La pieza real, pintada con el mismo componente que el PNG. **Haz clic en un texto de la pieza para editarlo. ⌘S guarda.** (Ctrl+S en Windows). En los puntos, Intro abre el siguiente (hasta 3).
- **Composición**: las nueve composiciones y, separados, los **Formatos nativos**. Cambiar no cuesta nada.
- **Zonas seguras** (casilla): sombrea los márgenes que no debe pisar nada importante, con las ubicaciones del formato.
- **Vídeo** (ver más abajo).
- **Descargar**: PNG del formato elegido (y del idioma elegido). Desactivado con cambios sin guardar.
- Desplegable **Así se verá en el feed**: maqueta con «Publicidad», el texto principal cortado a 125 caracteres con «… más», la pieza, el dominio, titular, descripción y botón.

*Derecha, lo que se edita:*
- **Revisión de normas**: cada aviso con «Regla · Bloquea la aprobación» (rojo) o «Regla · Aviso» (ámbar) y su explicación, en vivo mientras escribes. Sin nada: «Sin problemas detectados. Aun así, léela como la leería Meta.» En bilingües, los de la otra versión llevan delante «EN ·» o «ES ·».
- **Elementos** («Enciende o apaga lo que lleva la pieza. La imagen no cambia.»): Logo, Etiqueta, Titular, Línea de apoyo, Dato destacado, Puntos (con «Añadir punto», hasta 3), Botón, Etiqueta «Imagen generada con IA» (solo con foto: «Sólo con foto»). Por defecto encendidos: logo, etiqueta, titular, línea de apoyo y botón.
- **Plantilla** (las de foto se desactivan si no hay imagen) y **Botón (como el de Meta)** (CTA: Más información, Solicitar información, Ver programa, Inscribirme / en inglés Learn more, Get information, See the programme, Sign up).
- En formatos nativos: **Contenido del formato** (una línea por mensaje; en los chats «> » es quien lee, a la derecha, y «< » ActiveXRemote; sin prefijo se alternan; máx. 1.200 caracteres).
- **Estilo del botón**: forma (Pastilla, Redondeado, Recto, Contorno, Subrayado, Pegatina), color (Verde, Violeta, Coral, Amarillo, Blanco, Negro), icono (Flecha, Flecha en círculo, Sin icono) y tamaño (S, M, L).
- **Textos para el Administrador de anuncios** («Van en los campos del anuncio, no en la imagen. Pulsa para copiar.»), cada uno con botón **Copiar** y contador: **Texto principal** (recomendado 125), **Titular** (40), **Descripción** (30), **Texto alternativo**.
- **Guardar cambios** («Guardando…», «Guardado»).
- **Crear versión en inglés/español** / **Rehacer versión en …** («Misma imagen y mismos elementos, con los textos adaptados. Cuesta una llamada de texto, no otra imagen.») y **Quitar versión en …**. Desactivado con cambios sin guardar.
- **Reescribir textos**: indicaciones («más corto», «otro gancho», «habla del directo»…) → la IA reescribe los textos manteniendo el ángulo; la variante **vuelve a «Por revisar»** y, si tenía otra versión de idioma, se rehace también. La imagen no cambia. Gasta OpenAI.
- **Imagen**: «Línea visual: …», selector de línea, «Elige otra línea y pulsa «Otra imagen»: si no has tocado la escena, se escribe una nueva para esa línea.»; descripción de la escena («en inglés funciona mejor»); **Otra imagen** (pinta otra en calidad Normal; gasta OpenAI; si la plantilla era Marca, pasa a Foto a sangre); **Subir foto propia** (JPG, PNG o WebP, máx. 8 MB; «Las fotos reales del equipo o de las clases funcionan mejor que la IA»); **Quitar imagen** (pasa a plantilla Marca).

**Aprobar paso a paso:**
1. Lee la «Revisión de normas». Corrige todo lo rojo (editando el texto en la pieza o en los campos, apagando el elemento que lo contiene, o con «Reescribir textos»).
2. Pulsa **Guardar cambios** (o ⌘S).
3. Pulsa **Aprobar**. El servidor vuelve a revisar; si bloquea: «Tiene fallos que bloquean: corrígelos antes de aprobar.»
4. Si después editas una aprobada y el cambio introduce algo que bloquea, al guardar **vuelve sola a «Por revisar»**.

### Avisos que bloquean la aprobación (y los que solo avisan)
La revisión es fija, sin IA (expresiones regulares), y solo mira lo que se ve en la pieza (un elemento apagado no cuenta) más los textos para Meta.

**Bloquean (rojo):**
- **Atributos personales**: sugiere que quien lo ve está en paro o tiene deudas; alude a su edad o salud.
- **Resultados poco realistas**: promete una cifra de ingresos; lenguaje de «hazte rico»; pone plazo a un resultado («empleo en 30 días»).
- **Resultados garantizados**: garantiza un resultado.
- **Escasez inventada**: urgencia o escasez («últimas plazas», «solo hoy»…).
- **Cebo de interacción**: pide comentar, etiquetar o compartir.
- **Gratis**: «gratis» y similares.
- **Discriminación**: excluye por sexo o edad.
- **Titular**: falta el titular de la pieza (si el elemento Titular está encendido).

**Solo avisan (ámbar, se puede aprobar):** atributos personales en forma de «tu trabajo/tu sueldo» o preguntas «¿Estás…?/¿Eres…?»; sugerir que no cuesta nada; clickbait; nombrar una marca de Meta; parece un testimonio; categoría especial «Empleo»; titular de más de 10 palabras; más de 28 palabras en la imagen; titular todo en mayúsculas; exclamaciones dobles o emojis; falta el texto principal; texto principal > 125, titular > 40 o descripción > 30 caracteres; imagen de IA (con o sin etiqueta: si es realista, encender «Etiqueta «Imagen generada con IA»»; nunca presentarla como alumno real).

### Vídeo (MP4)
En cada variante, botón **Vídeo**: «El banner en movimiento: los textos entran uno a uno y la foto se acerca despacio. MP4 sin sonido, listo para Meta, TikTok o LinkedIn.»
- **Animación**: Sube, Desde el lado, Cae, Rápida (por defecto, una según la posición de la variante).
- **Duración**: 6 s (por defecto), 10 s o 15 s. 30 fotogramas por segundo, H.264.
- **Ver animación** / **Parar**: la reproduce en la propia pieza del editor, en el navegador.
- **Descargar MP4**: lo genera el servidor en el formato y el idioma elegidos («Haciendo el vídeo… puede tardar un minuto»). Desactivado con cambios sin guardar. Error: «No se ha podido hacer el vídeo. Prueba otra vez.»
- No usa IA ni tiene coste. Nombre del archivo: `[FORMATO]_[campaña]_v[n]_[IDIOMA]_[s]s.mp4`.

### Descargas para el Administrador de anuncios de Meta
- **PNG suelto**: en la variante, «Descargar» (formato e idioma elegidos). Nombre: `[FORMATO]_[campaña]_v[n]_[IDIOMA].png` (p. ej. `POST-VERTICAL-1080x1350_…`). En la Galería, «PNG» en cada tarjeta (formato de la vista).
- **.zip de la campaña** («Descargar aprobados (.zip)»): solo las **aprobadas**, en los **tres formatos** y en **los dos idiomas** si las variantes los tienen. Estructura: carpeta por formato (POST (1080X1080), POST VERTICAL (1080X1350), STORY (1080X1920)); con bilingüe, primero `ES/` y `EN/`. Incluye `textos.txt` por idioma con, por variante: Texto principal, Titular, Descripción, Botón y Texto alternativo, listos para pegar. Si no hay aprobadas: «No hay variantes aprobadas en esta campaña.»
- **.zip de la Galería**: cualquier selección (cualquier estado), hasta 60 variantes.
- Especificaciones de Meta (Normas): JPG o PNG hasta 30 MB; en historias y reels dejar libres el 14 % de arriba y el 35 % de abajo (el generador ya compone dentro).
- Subir a Meta es manual: el campus no se conecta con Meta Ads.

### Galería (`/admin/banners/galeria`)
**Ruta:** menú Marketing → Banners → **Galería**.
**Para qué:** ver todas las variantes de todas las campañas (hasta 1.000, ordenadas por campaña más reciente y posición), elegirlas, moverlas a carpetas y descargarlas en un .zip.

En pantalla:
- **Carpetas** (columna izquierda): **Todas** (con número), **Sin carpeta**, y cada carpeta con su número. Clic = filtrar. En la carpeta seleccionada: **Renombrar** (Intro guarda, Esc cancela) y **Borrar carpeta** («¿Borrar? Las variantes no se borran: se quedan sin carpeta.» → «¿Seguro? Borrar»). **+ Nueva carpeta** (nombre hasta 80 caracteres, **Crear**).
- Filtros: **Campaña** (Todas las campañas / una), **Estado** (Todos los estados / Aprobado / Por revisar / Descartado), **Tipo** (Todos / Con imagen o marca / Formatos nativos), **Vista** (formato de la miniatura y del botón PNG: 1080×1080, 1080×1350 —por defecto— o 1080×1920).
- «n variantes», **Seleccionar todas (n)**, **Quitar selección**.
- Tarjetas: miniatura (clic = seleccionar), nombre de campaña, «vN · composición» (+ «ES+EN»), estado, **Abrir campaña**, **PNG**. Se muestran 48 y **Mostrar más (n)**.
- Vacío: «No hay variantes con estos filtros.»
- Con algo seleccionado, barra inferior: «n seleccionadas», **Mover a** (carpeta, ninguna o nueva) + **Mover** («Movidas a «…»»), **Formatos** (POST, POST VERTICAL, STORY), «También la otra versión de idioma, si la hay», y **Descargar n (.zip)** («Preparando el .zip… tarda unos segundos por variante»). Más de 60: «Como mucho 60 por descarga: quita algunas.»
- El .zip de la Galería se ordena: carpeta de banners («Sin carpeta» si no tienen) / campaña / formato. Nombre: `banners-[fecha]-[n].zip`.

### Clonador (`/admin/banners/clonar`)
**Ruta:** menú Marketing → Banners → **Clonador**.
**Para qué:** a partir de un anuncio que te guste (nuestro o de otra marca), obtener hasta 5 versiones parecidas con nuestra marca, voz y normas.

Formulario:
- Zona «Arrastra aquí el banner que quieres clonar» («o haz clic para elegirlo · JPG, PNG o WebP, hasta 8 MB»). También se puede **pegar una captura con ⌘V/Ctrl+V**. «Cambiar imagen» para otra.
1. **Indicaciones para el clon (opcional)** (máx. 1.500): p. ej. «que sea para Remote Founder · sin personas…».
2. **¿Cuántos banners?** 1 a 5 (por defecto 3).
- Recuadro **Lo que nunca se copia**: su texto literal, marca, logos y precios; sus personas; lo que rompe las normas.
3. **¿Qué anunciamos?** (curso).
4. **¿Cómo se ve?**: **La que mejor encaje** (la IA elige según la composición; por defecto) o una de las tres plantillas; idioma Español / English / Ambos · ES + EN.
- Desplegable **Calidad de imagen · Nombre de la campaña**: calidad, **Carpeta**, nombre (vacío → «Clon · [archivo] · fecha»).
- Barra: coste estimado, tiempo (≈50 s con foto, ≈20 s sin), «Falta la imagen de referencia», botón **Clonar banners**.

Qué pasa: espera «Clonando tu banner» (Mirando la referencia → Entendiendo el gancho y la composición → Escribiendo las versiones → Revisando las normas de Meta → Pintando las fotos). Se crea una campaña de tipo clon (objetivo «leads»), se guarda la referencia (aunque luego falle la IA), la IA analiza la imagen y escribe las versiones, se pintan las fotos y, si es bilingüe, se traducen. Los clones usan composición Clásica. Te lleva a la campaña, con el bloque «Referencia». Gasta OpenAI (lectura de imagen + texto + una foto por banner).

### Normas de Meta (`/admin/banners/normas`)
**Ruta:** menú Marketing → Banners → **Normas de Meta**.
**Para qué:** «Normas de Meta y de la ley, en claro»: lo que el generador ya aplica, para aplicarlo también al editar a mano. «White hat siempre».

Contenido: tarjetas con «Sí» / «No» / «Por qué»:
- Habla del programa, no de la persona.
- Promete lo que haces, no lo que consigue cada alumno.
- Urgencia sólo si es verdad.
- Nada de pruebas inventadas.
- La imagen no imita una interfaz.
- Poco texto, un mensaje.
- Diversifica de verdad.
- Imagen de IA, sólo ilustrativa.
- **Nunca, aunque «funcione»**: cloaking; esquivar la revisión; escasez o cuentas atrás falsas; testimonios/reseñas/estrellas inventados; capturas de ingresos o «antes y después»; usar famosos o marcas que no nos respaldan.
- **Formatos y zonas seguras** (los tres formatos con sus ubicaciones).
- **¿Categoría especial «Empleo»?**: Meta incluye ahí los programas de certificación profesional y las ofertas de trabajo; los banners de Remote Professional hablan de habilidades y método para no caer ahí; si Meta lo rechaza por esto, marcarlo con la categoría especial (pierde segmentación por edad, sexo y código postal).

Fuentes citadas en el código: Meta Advertising Standards, Ley 34/1988 General de Publicidad, Ley 3/1991 de Competencia Desleal, Directiva Ómnibus y AI Act art. 50.

### Lo que pasa por detrás (Banners)
- **OpenAI**, con la clave de `/admin/ia`. Texto: el modelo configurado allí (por defecto `gpt-4o`). Imagen: `OPENAI_IMAGE_MODEL` o el primero disponible de `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`. La imagen nunca lleva texto: el texto lo compone el campus encima.
- Cada llamada se apunta en `ad_usage` (texto o imagen, tokens, coste), **también si falla** la respuesta. Las ideas de imagen previas a crear la campaña se apuntan sin campaña (cuentan en «Gasto del mes», no en «Gastado en esta campaña»).
- **Tarifas** de la tabla interna (USD/millón de tokens, entrada/salida): gpt-4o 2,5/10; gpt-4o-mini 0,15/0,6; gpt-4.1 2/8; gpt-4.1-mini 0,4/1,6; gpt-5 1,25/10; gpt-5-mini 0,25/2; modelos de imagen 5/40. Tokens de salida por imagen: Borrador 400, Normal 1.600, Alta 6.300. Con esa tabla, una foto cuesta aprox. 0,02 $ (Borrador), 0,07 $ (Normal) o 0,25 $ (Alta). Un modelo que no esté en la tabla se cuenta al precio más caro.
- **Qué gasta IA en Banners:** Generar banners, Dame 12 ideas / Otras 12, Añadir variantes, Más como esta, Reescribir textos, Crear/Rehacer versión en otro idioma, Otra imagen (y escribir la escena al cambiar de línea), Clonar banners, Clonar más. **No gastan:** editar textos, elementos, composición, plantilla o botón, aprobar/descartar, subir o quitar foto, carpetas, PNG, .zip y vídeo.
- **Imágenes** en el bucket **privado** `ad-banners`; el panel las enseña con enlaces firmados de 1 hora. Los PNG se generan al vuelo en `/admin/banners/render/[id]/[formato]`; el MP4 en `/admin/banners/video/[id]/[formato]` (servidor, ffmpeg).
- Sin crons: nada se programa ni se publica.

### Dónde encuentro… (Banners)
- **Cuánto he gastado este mes en banners**: chip «Gasto del mes» de la cabecera.
- **Cuánto costó una campaña**: su página → «Gastado en esta campaña: …».
- **Cuántos banners hay aprobados**: chip «Aprobados»; por campaña, pastilla «n aprobadas».
- **Los textos para pegar en Meta**: en la variante → «Textos para el Administrador de anuncios» (botones Copiar), o `textos.txt` dentro del .zip.
- **Todas las variantes aprobadas de todas las campañas**: Galería → Estado «Aprobado».
- **Solo los formatos nativos (chat, correo…)**: Galería → Tipo «Formatos nativos».
- **Las variantes de una carpeta**: Galería → columna Carpetas.
- **La imagen original de un clon y su análisis**: su campaña → bloque «Referencia».
- **Qué norma rompe una variante**: su editor → «Revisión de normas».
- **Medidas y zonas seguras**: Normas de Meta → «Formatos y zonas seguras», o casilla «Zonas seguras» en el editor.
- **Si la clave de OpenAI funciona**: chip «OpenAI» → `/admin/ia`.

### Problemas frecuentes (Banners)
- **«Falta la clave de OpenAI (o ha caducado)…»**: ve a «Ir a IA» (`/admin/ia`), pega o prueba la clave y vuelve.
- **«Aprobar» está gris**: hay algo que bloquea (rojo) o cambios sin guardar. Corrige, guarda y aprueba.
- **Una aprobada ha vuelto a «Por revisar»**: al editarla se introdujo algo que bloquea, o se usó «Reescribir textos» (que siempre la devuelve a revisión).
- **«…n imagen(es) no se han podido pintar»**: las variantes están escritas; en cada una abre «Imagen» → «Otra imagen».
- **«Esta clave no tiene acceso a ningún modelo de imagen…»**: la clave de OpenAI no tiene permiso para modelos de imagen; revisa la cuenta en OpenAI.
- **Descargar / Más como esta / Vídeo / otra versión de idioma están grises**: hay cambios sin guardar.
- **No sale «Descargar aprobados (.zip)»**: la campaña no tiene ninguna aprobada.
- **La Galería no deja descargar**: más de 60 seleccionadas o ningún formato marcado.
- **Foto rechazada**: debe ser JPG, PNG o WebP de 8 MB como mucho.
- **El vídeo falla**: «No se ha podido hacer el vídeo. Prueba otra vez.»; los de 15 s en STORY son los más pesados.
- **Borré una carpeta y no encuentro sus variantes**: no se borran; están en «Sin carpeta».
- **Meta rechaza un anuncio de Remote Professional por «Empleo»**: ver Normas → «¿Categoría especial «Empleo»?».

### Relación con otras secciones (Banners)
- **Ajustes → Inteligencia artificial** (`/admin/ia`): clave y modelo de OpenAI (texto e imagen), compartidos con las imágenes de IA de Publicaciones.
- **Publicaciones**: comparte cabecera, el generador de imágenes y el formato de coste; los gastos van en tablas distintas (`ad_usage` para banners, `social_usage` para publicaciones), así que cada sección muestra solo el suyo.
- **Ajustes → Conexiones con Claude**: para manejar banners desde Claude (crear, aprobar, editar, mover, descargar .zip o MP4).
