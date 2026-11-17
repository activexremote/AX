# Manual del panel · Parte 1: Docencia (grupo «Formación»)

Cubre: Resumen (`/admin`), Manual del profesor (`/admin/manual`), Módulos y lecciones (`/admin/modulos`, `/admin/modulos/[id]`), Editor de lección (`/admin/lecciones/[id]`), Tareas (`/admin/tareas`), Guía docente (`/admin/guia-profesores`) y Asistente (`/admin/asistente`).

Convenciones de este documento:
- Las etiquetas entre «comillas» son el texto exacto que se ve en pantalla (versión española del panel).
- Colores de las píldoras (pills) del panel: **verde** = ok (`--ok`), **ámbar** = aviso (`--warn`), **rojo** = problema (`--bad`), **azul** = información (`--info`), **violeta** = acento (`--accent`, p. ej. el curso), **gris** = neutro.
- «Equipo» = roles `profesor` y `administrador`. El rol `comercial` NO ve nada de esta parte: el layout del panel le redirige siempre a `/admin/comercial`. Los alumnos nunca entran en `/admin` (se les redirige a `/`).

---

## 0. El menú lateral y lo común a todo el panel

### Estructura del menú (lo que ve cada rol)
- **Sin grupo, arriba del todo**: «Resumen» → `/admin` (sólo se marca activo en la ruta exacta).
- **Grupo «Formación»** (lo ven profesor y administrador):
  - «Manual del profesor» → `/admin/manual`
  - «Módulos y lecciones» → `/admin/modulos`
  - «Tareas» → `/admin/tareas`
  - «Respuestas» → `/admin/respuestas` (no se documenta en esta parte)
  - «Guía docente» → `/admin/guia-profesores`
  - «Asistente» → `/admin/asistente`
- Grupos «Alumnos y ventas», «Comercial», «Marketing» y «Ajustes»: **sólo administrador** (un profesor no los ve en el menú).
- Pie del menú: avatar con iniciales, nombre y rol («Profesor», «Administrador»), el selector de idioma (ES/EN) y el enlace «Ver el campus» (lleva a `/`).
- En móvil el menú es un cajón: se abre con el botón de hamburguesa de la barra superior («Abrir el menú»), se cierra con la X («Cerrar el menú»), con Escape, tocando fuera o al navegar.

### Patrones de interacción comunes
- **Borrar en dos pasos**: casi todos los borrados piden confirmación pulsando otra vez. El primer botón («Eliminar», «Borrar» o el icono de papelera) se convierte en «Sí, eliminar» / «¿Seguro?» + «Cancelar». No hay ventana emergente.
- **Formularios en ventana (modal)**: «Nuevo módulo», «Asignar tarea», «Editar tarea», «Nueva FAQ», «Subir documento». En «Nuevo módulo» y en las tareas, hacer clic fuera del panel cierra (cancela); las tareas también se cierran con Escape. Las FAQs/documentos sólo se cierran con «Cancelar».
- Nada de esta parte se guarda solo: siempre hay un botón de guardar (excepto el borrado y los botones «Activar/Desactivar», «Descartar», que actúan al pulsarlos).
- Tras guardar, la página se refresca sola (los datos que se ven son los nuevos).

---

## 1. Resumen (`/admin`)

**Cómo llegar**: primer elemento del menú, «Resumen» (sin grupo). También al pulsar el logo «ActiveXRemote» del menú.
**Para qué sirve**: ver de un vistazo cómo está el campus (cifras) y qué está esperando a que alguien actúe, con un botón que lleva a resolverlo.

### Quién la ve y diferencias por rol
- Profesor y administrador. El profesor ve sólo lo de formación; el administrador ve además alumnos, matrículas y publicaciones. (Además de ocultarlo en pantalla, la base de datos no deja al profesor leer matrículas ni cuentas.)

### Qué hay en pantalla
1. **Cabecera**: la fecha de hoy en letra (p. ej. «martes, 17 de noviembre»), el saludo «Hola, {nombre}» y el texto «Esto es lo que pasa hoy en el campus y lo que espera a que alguien lo mire.»
2. **Fila de cifras (tarjetas)**:
   - «Módulos»: número total de módulos. Debajo: «{n} ocultos» o «todos visibles». Pulsar → `/admin/modulos`.
   - «Lecciones»: número total de lecciones. Debajo: «{n} sin contenido» o «todas con contenido». Pulsar → `/admin/modulos`.
   - «Alumnos con acceso» (**sólo administrador**): personas distintas con al menos una matrícula activa. Debajo: «{n} cuentas en total» (todos los perfiles, de cualquier rol). Pulsar → `/admin/usuarios`.
   - «Intentos de test»: total de intentos de quiz de todos los alumnos. Debajo: «{n} % aprobados» o «aún sin intentos». Esta tarjeta **no es un enlace**.
3. **Tarjeta «Qué hacer ahora»** (con un contador del número de avisos). Lista ordenada de lo más urgente (rojo) a lo informativo (azul). Cada aviso tiene icono, título, explicación y botón:
   | Aviso (título) | Cuándo sale | Color | Botón → destino | Rol |
   |---|---|---|---|---|
   | «{n} preguntas del asistente sin respuesta» — «Alumnos que preguntaron algo que el asistente no supo contestar.» | Preguntas registradas con `answered=false` y no revisadas | rojo | «Contestar» → `/admin/asistente` | ambos |
   | «{n} tareas vencidas» — «Asignaciones con la fecha límite pasada y sin completar.» | Tareas con fecha límite anterior a hoy y estado distinto de completada | rojo | «Ver tareas» → `/admin/tareas` | ambos |
   | «{n} publicaciones por revisar» — «La IA las ha escrito y nadie las ha aprobado todavía.» | Posts pendientes de revisión | ámbar | «Revisar» → `/admin/publicaciones/revisar` | sólo admin |
   | «{n} matrículas por recuperar» — «Dejaron sus datos y no terminaron el pago.» | Pedidos en estado iniciado o expirado | ámbar | «Ver» → `/admin/matriculas` | sólo admin |
   | «{n} lecciones sin contenido» — «Tienen título pero ni bloques ni borrador: el alumno las ve vacías.» | Lecciones sin bloques y con Markdown vacío | azul | «Ver módulos» → `/admin/modulos` | ambos |
   | «{n} módulos ocultos» — «No los ve ningún alumno hasta que se marquen como disponibles.» | Módulos con «Disponible» desmarcado | azul | «Revisar» → `/admin/modulos?estado=ocultos` (abre la lista ya filtrada en «Ocultos») | ambos |
   - Estado vacío: icono de ok, «Todo al día» y «No hay nada esperando. Buen momento para preparar contenido nuevo.»
4. **Tarjeta «Atajos»**:
   - «Nuevo módulo» → `/admin/modulos?nuevo=1` (abre directamente el formulario de nuevo módulo).
   - «Asignar tarea» → `/admin/tareas` (lleva a la página; el formulario hay que abrirlo con el botón «Asignar tarea»).
   - «Nueva FAQ del asistente» → `/admin/asistente` (lleva a la página; la FAQ se crea con «+ Nueva FAQ»).
   - Sólo administrador: «Nueva publicación» (`/admin/publicaciones/nueva`), «Nueva campaña» (`/admin/banners/nueva`), «Crear usuario» (`/admin/usuarios`).
5. **Tarjeta «Contenido por curso»**: una línea por curso que tenga módulos, con un punto de color, el nombre del curso («Núcleo común», «Remote Professional», «Remote Founder», «Relámpago · Web ABC») y «{n} módulos · {n} lecciones». Los cursos sin módulos no aparecen.

### Lo que pasa por detrás
- Es una página de sólo lectura: no cambia nada, no manda avisos ni llama a ninguna IA. Los números se calculan en cada visita (recuentos en directo).
- Matiz: el recuento de «tareas vencidas» del Resumen usa el estado guardado en la base y la fecha UTC; la página Tareas calcula el estado con la fecha de Madrid y el progreso real. Por eso, en casos límite (una tarea completada por progreso pero aún no marcada, o el cambio de día), las cifras pueden diferir en una unidad.

### Dónde encuentro…
- Cuántos módulos/lecciones hay en total → tarjetas «Módulos» y «Lecciones».
- Cuántos módulos hay ocultos → hint de la tarjeta «Módulos» o aviso «{n} módulos ocultos».
- Qué lecciones están vacías → el aviso dice cuántas; para ver cuáles, abre cada módulo en «Módulos y lecciones» y busca la píldora ámbar «Vacía».
- Cuántos alumnos tienen acceso (admin) → «Alumnos con acceso».
- Porcentaje de aprobados en tests → hint de «Intentos de test».
- Cuántos módulos/lecciones tiene cada curso → «Contenido por curso».

### Relación con otras secciones
Cada aviso es un atajo: Asistente (bandeja), Tareas, Módulos, y (admin) Publicaciones y Matrículas.

---

## 2. Manual del profesor (`/admin/manual`)

**Cómo llegar**: grupo «Formación» → «Manual del profesor».
**Quién**: profesor y administrador (mismo contenido para los dos).
**Para qué sirve**: el «Playbook del profesorado»: cómo preparar, dar y cerrar un módulo y cómo usar el panel en cada paso.

### Qué hay en pantalla
- Cabecera: antetítulo «Playbook del profesorado», título «Manual del profesor», texto «Cómo preparar, dar y cerrar un módulo, y cómo trabajar con el panel en cada paso. De principio a fin.»
- **Columna izquierda fija**:
  - Buscador «Buscar en el manual…»: deja sólo los capítulos que contienen **todas** las palabras escritas (sin importar tildes ni mayúsculas). Sin resultados: «Nada en el manual con esas palabras.»
  - «Índice»: los capítulos numerados; se resalta el que se está leyendo al hacer scroll. Pulsar uno salta a él.
  - Botón «Imprimir» (abre el diálogo de impresión del navegador).
- **Cuerpo**: un capítulo por tarjeta (icono, número, título y resumen). Tipos de contenido: párrafos, listas, pasos numerados (con píldoras de plazo en violeta, «dónde» en gris y, a veces, un enlace «Ir»), tablas, notas (azul = info, ámbar = aviso, verde = ok), tarjetas de atajo que enlazan a secciones del panel, una línea temporal y bloques para copiar.
- **Listas de comprobación**: casillas marcables, con la píldora «{n} de {t} hechas» (se pone verde al completarlas) y el botón «Desmarcar» (aparece en cuanto hay alguna marcada). Las marcas se guardan **sólo en este navegador** (localStorage, clave `axr-manual-checks`): no se comparten con otras personas ni con otros dispositivos, y se pierden si se borran los datos del navegador o en ventana privada.
- **Bloque copiable**: «Prompt oficial para NotebookLM (sustituye NN y TÍTULO)» con botón «Copiar» (pasa a «Copiado» 1,5 s).
- Pie: «Se actualiza con el panel: si una pantalla cambia, cambia este manual.»
- En inglés, el contenido sigue en español y aparece el aviso «The handbook is written in Spanish, the language the faculty teaches in.»

### Capítulos (en este orden)
1. **Bienvenida: cómo funciona esto** — el método en una frase (4 h en directo, ≥40 % de ejercicio, un entregable por bloque, material en el campus el mismo día); los cinco sitios del profesor (Resumen, Módulos y lecciones, Tareas, Guía docente, Asistente) como atajos; checklist «Tu primer día».
2. **Calendario del módulo: de D-14 a D+7** — línea temporal de 9 pasos (D-14→D-10 fuentes en NotebookLM; D-10→D-7 guion; D-7 códigos de plantilla; D-7→D-3 deck 40–50 diapositivas 16:9; D-3 control de 60 s y PDF; D-3 campus listo; D-3 Tema en Classroom; D-1 tarea en Classroom; DÍA 0 clase de 4 h; D+1→D+7 grabación, corrección y cierre). Nota de lo mínimo para dar el módulo por entregado.
3. **Preparar la clase: guion y diapositivas** — pasos con plazos, el prompt de NotebookLM, tabla de fuentes válidas/no válidas, checklist «Control de 60 segundos», regla de oro (copiar una de las 64 plantillas).
4. **Montar el módulo en el campus** — pasos en el panel (ver secciones 3 y 4 de este documento), nota sobre el curso del módulo, checklist «Módulo listo en el campus (D-3)».
5. **Classroom, tareas y entregables** — Tema, una tarea por bloque con rúbrica de 3 criterios, corrección en 7 días; tabla de entregables (deck, guion, plantilla del ejercicio, tarea con rúbrica, grabación, lecturas). Aclara que las tareas del campus (sección «Tareas») son otra cosa.
6. **El día de la clase: 4 horas en directo** — anatomía de la sesión (tabla de tramos y plantillas), reglas de ritmo, checklists «El día de la clase» y «Después de la clase».
7. **Seguimiento de alumnos** — asignar tareas, estados, cambiar fecha, mirar el Resumen; nota sobre Slack; aviso sobre misiones de cursos relámpago con revisión manual (no tienen pantalla en el panel).
8. **La guía docente** — qué hay y aviso de que los enlaces caducan en una hora.
9. **El asistente del campus** — vaciar la bandeja, FAQs cortas, probar el asistente.
10. **Voz, calidad y privacidad** — tuteo, cifras con fuente, sin emoji, privacidad de datos de alumnos.
11. **Dudas frecuentes y a quién acudir** — tabla «Si… / Haz esto».

### Avisos: puntos del manual que no coinciden exactamente con el código
- El manual dice «Si no existe [tu módulo] todavía, pide al equipo que lo cree». En realidad **un profesor sí puede crear módulos** (el botón «+ Nuevo módulo» y la acción lo permiten a profesor y administrador). La recomendación es organizativa, no una restricción técnica.
- El manual (cap. 7) dice que «cada viernes por la tarde» llega al canal de profesores un resumen semanal. Según los crons: el **resumen de progreso de alumnos** (canal de profesores) sale los **lunes a las 07:00 UTC**; lo que sale los **viernes a las 15:00 UTC** es el «Seguimiento de cumplimiento de profesores», que va al **canal de administración**.
- Un módulo oculto («Disponible» desmarcado) **no lo ve ningún alumno**: ni en la portada del campus, ni su página, ni sus lecciones, ni puede entregar en ellas. Lo siguen viendo el equipo (profesorado y administración; en el campus les sale con la píldora «Próximamente») y quien tenga acceso propio a ese módulo, es decir, una plaza de dry run de ese módulo. Ver sección 3.
- El manual dice que el test se aprueba con el 80 %: correcto (valor por defecto del quiz, no editable desde el panel).

### Dónde encuentro…
- El prompt de NotebookLM → capítulo 3, botón «Copiar».
- Los plazos D-14…D+7 → capítulo 2.
- Qué entregables hay y dónde se suben → capítulo 5 (tabla).
- La lista de comprobación para dejar el módulo listo en el campus → capítulo 4.

---

## 3. Módulos y lecciones (`/admin/modulos` y `/admin/modulos/[id]`)

**Cómo llegar**: grupo «Formación» → «Módulos y lecciones». También desde las tarjetas «Módulos»/«Lecciones» del Resumen.
**Quién**: profesor y administrador **con los mismos permisos**: los dos pueden crear, editar, ocultar y borrar módulos y lecciones (la comprobación en código y la seguridad de la base sólo exigen ser equipo). No hay diferencias por rol en esta sección.
**Para qué sirve**: gestionar todo el contenido del campus: módulos, sus lecciones, el contenido visual, el audio y los tests.

### 3.1 Lista de módulos (`/admin/modulos`)

**Cabecera**: «Módulos y lecciones» — «Todo el contenido del campus, agrupado por curso. Abre un módulo para editarlo o para añadirle lecciones.» A la derecha, el botón «+ Nuevo módulo».

**Barra de herramientas**:
- Buscador «Buscar por título, código o slug» (ignora tildes y mayúsculas; filtra al teclear).
- Filtros con contador: «Todos {n}», «Disponibles {n}», «Ocultos {n}». Si se llega con `?estado=ocultos` (desde el Resumen) ya está en «Ocultos».

**Grupos por curso** (siempre en este orden: Núcleo común, Remote Professional, Remote Founder, Relámpago · Web ABC; sólo salen los que tienen módulos visibles con el filtro):
- Cabecera de grupo: punto de color, nombre del curso y explicación de quién lo ve:
  - «Núcleo común» — «Lo ven los dos caminos del programa.»
  - «Remote Professional» — «Sólo quien tiene el camino Professional.»
  - «Remote Founder» — «Sólo quien tiene el camino Founder.»
  - «Relámpago · Web ABC» — «Curso relámpago: sólo con su matrícula.»
  - Píldora «{n} módulos».
- Cada fila (toda la fila es un enlace al módulo): número de orden, título, código (o slug si no hay código), píldora «Disponible» (verde) u «Oculto» (ámbar), «{n} lecciones» y «{n} min» (minutos estimados del módulo; si no se han puesto, la suma de las duraciones de sus lecciones), flecha.
- Orden dentro de cada curso: por el campo «Orden» del módulo.

**Estados vacíos**: sin ningún módulo: «Aún no hay módulos» + «Crea el primero: luego le añades lecciones arrastrando un PDF o escribiéndolas a mano.» Con módulos pero sin coincidencias: «Ningún módulo coincide con la búsqueda.»

#### Crear un módulo
1. Pulsa «+ Nuevo módulo» (o el atajo «Nuevo módulo» del Resumen). Se abre la ventana «Nuevo módulo».
2. Rellena el formulario (ver «Formulario del módulo» abajo). Obligatorios: «Slug (URL)» y «Título».
3. Pulsa «Crear módulo» («Guardando…» mientras tanto). «Cancelar» o clic fuera cierra sin guardar.
4. Si todo va bien la ventana se cierra y el módulo aparece en la lista. Si falla, el error sale en rojo arriba del formulario (p. ej. «Slug y título son obligatorios.» o el error de la base si el slug ya existe: el slug de módulo es único en todo el campus).
- **Ojo**: «Disponible» viene **marcado por defecto**. Si creas el módulo disponible, se manda a Slack (canal de alumnos) el aviso «Nuevo módulo disponible» con el texto «Ya puedes empezarlo desde el catálogo del campus.» (si la integración de Slack está activa y el evento «Nuevo contenido publicado» no está apagado). Si aún no está listo, desmárcalo antes de crear.

#### Formulario del módulo (campos, en orden)
| Campo | Notas |
|---|---|
| «Slug (URL)» | Obligatorio. Es la dirección del módulo en el campus: `/modulos/<slug>`. Ejemplo de placeholder: `onboarding-general`. Único en todo el campus. Cambiarlo cambia la URL pública del módulo. |
| «Orden» | Número. Decide la posición dentro de su curso (lista del panel y campus). Por defecto 0. |
| «Curso al que pertenece» | «Núcleo común (los dos caminos)», «Solo Remote Professional», «Solo Remote Founder», «Relámpago · Web ABC». **Decide quién puede ver el módulo** (la base de datos filtra por esto contra las matrículas del alumno). Un valor manipulado se convierte en «Núcleo común». |
| «Código» | Texto libre que se ve como etiqueta (placeholder `MÓDULO 0 · ONBOARDING GENERAL`). Opcional. |
| «Título» | Obligatorio. |
| «Descripción» | Se ve en la tarjeta y la cabecera del módulo en el campus. |
| «Título en inglés», «Descripción en inglés» | Lo que ve un alumno con el campus en inglés. Si están vacíos, ve la versión española. |
| «Icono» | Desplegable: Education, Laptop, Chat, Time, Collaborate, Events, GroupSecurity, Favorite, UserMultiple, ChartLine. Por defecto Education. |
| «Color de acento» | Texto libre (un color hex, p. ej. `#161616`). No se valida. |
| «Minutos estimados» | Número. Si se deja en 0, se guarda vacío y se muestra la suma de duraciones de las lecciones. |
| «Disponible» | Casilla. Marcada = píldora «Disponible»; desmarcada = «Oculto» (ver qué significa abajo). |

No hay campo para el código en inglés (aunque el campus lo usaría si existiera en la base).

### 3.2 Ficha de un módulo (`/admin/modulos/[id]`)

Se llega pulsando una fila de la lista.

**Cabecera**:
- Migas: «Módulos» / código (o slug).
- Título del módulo y píldoras: curso (violeta), «Disponible» (verde) u «Oculto» (ámbar), «{n} lecciones», «{n} min».
- Botones: «Ver en el campus» (abre `/modulos/<slug>` del campus, como lo vería alguien con acceso) y «Eliminar módulo».

**Dos tarjetas**:
1. **«Lecciones»** — «En el orden en que las ve el alumno.»
   - Lista de lecciones, ordenadas por su campo «Orden». Cada una: número de orden, título (enlace al editor), «{n} min» (o «— min»), píldora «Con contenido» (verde) o «Vacía» (ámbar: sin bloques ni Markdown, el alumno la ve en blanco), píldora «Audio» (azul) o «Sin audio» (gris; mira sólo el audio en español). Botones «Editar» (abre el editor) y «Eliminar» (pide «Sí, eliminar» / «Cancelar»).
   - Sin lecciones: «Sin lecciones aún.»
   - Botón «+ Nueva lección» (ver 3.3).
2. **«Datos del módulo»** — «Lo que se ve en el catálogo del campus. El curso decide quién lo ve.» Es el mismo formulario del módulo; se guarda con «Guardar módulo». Tras guardar se refresca la página y el campus.

#### Editar los datos del módulo
Cambia los campos y pulsa «Guardar módulo». No hay guardado automático. Guardar (también al marcar «Disponible» en un módulo existente) **no** manda ningún aviso de Slack: el aviso sólo se manda al crear un módulo ya disponible.

#### Ocultar / mostrar un módulo
Desmarca o marca «Disponible» y pulsa «Guardar módulo». Qué hace exactamente según el código:
- En el panel: píldora «Oculto» y aviso «{n} módulos ocultos» en el Resumen.
- En el campus: **ningún alumno lo ve** (ni la tarjeta, ni su página, ni sus lecciones; tampoco el asistente del campus lo menciona), aunque tenga matrícula en su curso. Excepciones: el equipo lo sigue viendo (con la píldora «Próximamente») y quien tenga una plaza de dry run de ese módulo también, porque ese acceso se le dio a esa persona a propósito. Para publicarlo, marca «Disponible» y guarda.

#### Eliminar un módulo
1. «Eliminar módulo» → «Sí, eliminar» (o «Cancelar»).
2. Se vuelve a la lista de módulos.
- Borra en cascada todas sus lecciones, tests, progreso de los alumnos en ellas, tareas asignadas de ese módulo, recursos de la Guía docente asociados y accesos sueltos a ese módulo. No se puede deshacer.
- **Si el módulo lo usa una sesión de dry run, no se puede eliminar.** Al pulsar «Eliminar módulo» y confirmar, sale un aviso en rojo debajo del botón: «No se puede eliminar: lo usa la sesión de dry run «…». Cámbiale antes el módulo en Dry run, o márcalo como oculto en vez de borrarlo.» El módulo no se toca. Para borrarlo, cambia antes el módulo de esa sesión en Dry run (sólo admin).

### 3.3 Crear una lección

Pulsa «+ Nueva lección» en la tarjeta «Lecciones». Se abre el recuadro «Nueva lección» con dos caminos (y un botón «Cancelar» debajo para cerrarlo):

#### Camino A (el que sale primero): desde un archivo con IA — la caja «Crea la lección desde un archivo»
- Texto: «Arrastra aquí tu PDF, Word, Excel, PowerPoint, .md, .txt, .csv o una imagen. La IA lo lee y te propone la lección ya maquetada.»
- Botón «Elegir archivo» y nota de formatos: «PDF · Word · Excel · PowerPoint · Markdown · Texto · CSV · Imágenes. Lo de Google Drive, exportado a PDF o a Office. Hasta 12 MB.»
- Si la IA no está configurada: el botón está desactivado, soltar no hace nada y aparece «Para leer archivos con IA hace falta la clave de OpenAI (Panel → IA). Mientras tanto, puedes crear la lección a mano.»

Pasos:
1. Arrastra el archivo a la caja (al pasar por encima dice «Suelta el archivo aquí») o pulsa «Elegir archivo».
2. Mientras trabaja: «Leyendo el archivo…» y luego «La IA está maquetando la lección…», con el nombre del archivo.
3. Aparece la **revisión**: barra con el nombre del archivo, contador «{aceptados} / {total}», y los botones «Empezar de nuevo», «Aceptar todos» y «Crear la lección».
   - Campo «Título de la lección» (propuesto por la IA; si no saca uno, el nombre del archivo; máximo 120 caracteres).
   - Puede salir un aviso sobre cómo se leyó (p. ej. con imágenes: «Imagen leída con el modelo de visión: comprueba las cifras que haya sacado.»).
   - «Qué ha hecho»: notas de la IA (hasta 5).
   - Cada bloque propuesto se ve pintado tal como lo verá el alumno, con su tipo y los botones «✓ Aceptar» / «✕ Descartar». **Todos llegan aceptados**; lo descartado se queda atenuado y se puede recuperar con un clic.
4. Pulsa «Crear la lección» («Creando…»). Si no hay ninguno aceptado: «No has aceptado ningún bloque.» Si el título está vacío: «La lección necesita un título.»
5. Se crea la lección y se abre directamente su editor (`/admin/lecciones/[id]`).

Qué pasa por detrás:
- El archivo **no se guarda en ningún sitio**: se lee, se convierte en texto (o imagen), se manda a OpenAI y se olvida. Sólo queda la lección.
- Usa la clave de OpenAI configurada por un administrador en «Inteligencia artificial» (`/admin/ia`) o la del servidor; modelo por defecto `gpt-4o`. **Cada archivo es una llamada de pago a OpenAI.** El profesor usa la IA sin ver la clave.
- Lee como máximo los primeros 24.000 caracteres del texto extraído.
- La lección nace **sólo por bloques** (Markdown vacío), con un slug sacado del título (si ya existe en el módulo, se añade `-2`, `-3`…) y con el orden siguiente al último del módulo. Duración vacía, sin audio, sin test.
- Crear así **no manda aviso de Slack** (a diferencia del camino manual).
- No se propone nada en inglés: la versión inglesa se hace después en el editor.

Errores posibles (salen en rojo, se puede volver a intentar):
- «El archivo pesa X MB y el tope son 12 MB.»
- «Ese PDF no tiene texto: es un escaneo. Súbelo como imagen y lo leo con visión, o pásalo por un OCR.»
- «Ese formato es el antiguo de Office. Ábrelo y usa «Guardar como» en .docx, .xlsx o .pptx, o expórtalo a PDF.» (.doc, .xls, .ppt)
- «Exporta ese archivo a PDF o a formato de Office (.docx, .xlsx, .pptx) y vuelve a subirlo.» (.odt, .ods, .odp, Pages, Numbers, Keynote)
- «No sé leer ese formato. Sube un PDF, un Word, un Excel, un PowerPoint, un .md, un .txt o una imagen.»
- «El archivo está dañado o no es del formato que parece.» / «Ese .docx no trae documento dentro.» / «Esa presentación no trae diapositivas.» / «Ese libro no trae hojas dentro.»
- «Del archivo no sale texto suficiente para montar una lección.» (menos de 40 caracteres)
- «La clave de OpenAI no es válida. Avisa a un administrador.» (401) / «La cuenta de OpenAI no tiene saldo o ha superado el límite.» (429) / «No se pudo estructurar: …»
- «La IA ha devuelto algo que no se entiende. Vuelve a intentarlo.» / «La IA no ha propuesto ningún bloque válido. Prueba con un material más concreto.»

#### Camino B: a mano — enlace «O crea la lección a mano»
Abre el formulario de lección vacía:
| Campo | Notas |
|---|---|
| «Slug (URL)» | Obligatorio. Único dentro del módulo (si se repite, sale el error de la base de datos). |
| «Orden» | Por defecto 1. Posición dentro del módulo. |
| «Título» | Obligatorio. |
| «Subtítulo» | Opcional. |
| «Título en inglés», «Subtítulo en inglés» | Opcionales; si están vacíos, en inglés se ve el español. |
| «Duración (min)» | Por defecto 5. |
| «URL de audio (opcional)» | Una URL de un MP3 ya alojado (placeholder `https://...`). |
| «Contenido (Markdown)» | Texto en Markdown. Es el contenido que se pinta si la lección no tiene bloques. |
Botones: «Cancelar» y «Crear lección». Al crear se cierra el recuadro y la lección aparece en la lista (no se abre el editor: hay que pulsar «Editar»).
- Crear a mano **manda a Slack** (canal de alumnos) «Nueva lección publicada» con la lección y el módulo, aunque el módulo esté oculto (si Slack está activo y el evento no está apagado).

#### Reordenar lecciones
No hay arrastrar ni flechas en la lista: el orden se cambia con el campo «Orden» de cada lección (en «Datos de la lección» del editor) y guardando. La lista y el campus ordenan por ese número.

#### Borrar una lección
En la fila: «Eliminar» → «Sí, eliminar». Borra también su test, intentos y el progreso de los alumnos en ella. Si la base de datos rechazara el borrado, el botón no muestra el error (la lección seguiría en la lista).

---

## 4. Editor de lección (`/admin/lecciones/[id]`)

**Cómo llegar**: «Módulos y lecciones» → abre un módulo → pulsa el título de una lección o «Editar». Tras crear una lección desde archivo, se abre solo.
**Quién**: profesor y administrador, mismos permisos.

### Cabecera
- Migas: «Módulos» / título del módulo (enlace a su ficha).
- Título de la lección y píldoras: «{n} min», «Con contenido» (verde) o «Vacía» (ámbar) — mira la versión española —, «Audio» (azul) o «Sin audio».
- Botón «Ver en el campus» → `/lecciones/<id>` (la lección como la ve el alumno).

### Índice fijo
Cuatro enlaces que saltan a cada parte: «Datos de la lección», «Contenido visual», «Audio narrado», «Examen (quiz)».

### Selector de idioma de edición
En «Contenido visual» y en «Audio narrado» aparece «Editando la versión: Español | Inglés». Es un enlace (`?editar=es` / `?editar=en`): al cambiar, el editor se recarga con esa versión. **Lo que no hayas guardado en la otra versión se pierde** (el editor de bloques avisa al cerrar la pestaña, pero no al cambiar de idioma). El idioma de edición es independiente del idioma de la interfaz del panel.

### 4.1 «Datos de la lección»
El mismo formulario que «crear a mano» (Slug, Orden, Título, Subtítulo, Título/Subtítulo en inglés, Duración (min), URL de audio (opcional), Contenido (Markdown)), con el botón «Guardar lección».
- «Contenido (Markdown)» es el **borrador**: el campus lo pinta sólo si la lección no tiene bloques; también es de donde parte la IA («Usar el contenido de arriba») y la fuente de la narración cuando no hay bloques.
- Guardar refresca la lección en el panel y en el campus. No manda avisos.
- **Cuidado con el campo «URL de audio»**: este formulario también guarda el audio español. Si acabas de subir o generar un audio en «Audio narrado» y luego pulsas «Guardar lección» sin recargar la página, el campo puede conservar la URL antigua (o vacía) y pisar el audio nuevo. Recarga la página antes de guardar los datos tras tocar el audio, o comprueba que el campo muestra la URL nueva. (Deducido del código; conviene verificarlo.)

### 4.2 «Contenido visual» (editor de bloques)
Texto: «El alumno ve esto tal cual. Arrastra para reordenar, edita en el sitio y guarda.»
Si se edita la versión inglesa y aún no tiene bloques, se precarga con los bloques españoles y aparece: «Todavía no hay versión inglesa: parte de la española y tradúcela antes de guardar.»

**Barra superior**:
- Contador «{n} bloques» / «1 bloque».
- «Tienes cambios sin guardar» (si hay cambios) o «✓ Guardado» tras guardar.
- Conmutador «Editar» / «Vista previa» (la vista previa usa el mismo componente que el campus: lo que se ve aquí es lo que verá el alumno).
- «✨ Estructurar con IA» (sólo si la IA está configurada).
- «Guardar contenido» («Guardando…»; desactivado si no hay cambios).
- Sin IA: «La IA no está configurada. Un administrador puede añadir la clave de OpenAI en Panel → IA.»

**Lista de bloques** (modo «Editar»). Cada bloque es una fila con:
- Asa «⠿» para arrastrar y soltar en otra posición.
- Su tipo (etiqueta) y un resumen; al pulsarlo se abre/cierra y enseña sus campos y una «Vista previa» pequeña.
- Herramientas: «↑» «Subir», «↓» «Bajar», «⧉» «Duplicar» (copia independiente), «✕» «Quitar» (pide confirmación del navegador: «¿Quitar este bloque?»).
- Lección sin bloques: «Esta lección todavía no tiene bloques. Añade uno, o pega tu borrador y deja que la IA proponga la estructura.»
- Abajo: «+ Añadir bloque» («Elige qué tipo de bloque quieres añadir») con el catálogo cerrado de tipos.
- Al pie: «Sin bloques, el campus sigue pintando el Markdown de arriba.»

**Tipos de bloque y sus campos** (catálogo cerrado: no existen otros):
| Tipo | Para qué | Campos | Se descarta al guardar si… |
|---|---|---|---|
| Título | Abre sección o apartado | «Texto», «Nivel» («Sección» / «Apartado») | no tiene texto |
| Párrafo | Texto corrido | «Texto» (máx. 4.000 caracteres) | vacío |
| Lista / Lista numerada | Puntos sin orden / con orden | «Puntos» («Añadir punto», «Quitar») | sin puntos |
| Checklist | Lo que el alumno va marcando (se guarda en su navegador) | «Título», «Puntos» | sin puntos |
| Punto de control | Qué debe estar hecho antes de seguir | «Título» (por defecto «Antes de seguir»), «Puntos» | sin puntos |
| Cuadro destacado | Idea clave, aviso… | «Tono» («Idea clave», «Aviso», «Error típico», «Ejemplo», «Dato»), «Título», «Texto» (máx. 1.200) | sin texto |
| Cita | Frase con autor | «Texto» (máx. 800), «Autor» | sin texto |
| Tabla | Datos en columnas | «Cabecera» (máx. 8 columnas; «Añadir columna», «− Quitar columna»), «Filas» (máx. 60; «Añadir fila», «Quitar fila»), «Pie» | sin cabecera o sin ninguna fila con datos |
| Pasos | Procedimiento | por paso «Título del paso» y «Explicación» | sin pasos |
| Pros y contras | Ventajas e inconvenientes | «Título», «A favor», «En contra» | las dos listas vacías |
| Comparativa | Dos opciones enfrentadas | «Lado izquierdo» / «Lado derecho» (título por defecto «Antes»/«Después») y sus puntos | los dos lados vacíos |
| Cifras | 2–4 números grandes | por cifra «Cifra» (máx. 24 caracteres), «Etiqueta», «Aclaración»; máx. 4 | ninguna cifra con valor y etiqueta |
| Gráfico | Barras, línea o tarta | «Forma» («Barras», «Línea», «Tarta»), «Unidad» (€, %, h), «Título», «Datos» (etiqueta + valor; máx. 12), «Fuente del dato» («Un gráfico sin fuente es un adorno.») | menos de 2 datos válidos. Una tarta con negativos se convierte en barras |
| Cronología | Qué pasa y cuándo | por hito «Cuándo», «Título», «Texto» | sin hitos |
| Recursos | Descargas y enlaces | «Título»; por recurso «Etiqueta», «Enlace (https://… o /ruta)», «Aclaración» | ningún enlace válido. Sólo se aceptan `http(s)://…` o rutas internas que empiezan por `/` |
| Separador | Respiro entre partes | (sin campos) | — |
Límites generales: máximo 40 puntos por lista, 400 bloques por lección, líneas de 600 caracteres. Nunca se guarda HTML: sólo texto y números.

**Guardar**: pulsa «Guardar contenido». **Nada se guarda solo.** Al guardar, el servidor vuelve a validar y descarta los bloques incompletos, y lo dice: «Se han descartado {n} bloques vacíos al guardar.» / «Se ha descartado 1 bloque vacío al guardar.» Si falla: «No se ha podido guardar: …». Si cierras la pestaña con cambios sin guardar, el navegador avisa. Vaciar todos los bloques y guardar devuelve la lección a su Markdown. Guardar en «Español» escribe la versión española; en «Inglés», la inglesa (no se pisan entre sí). El campus se actualiza al momento.

**Panel «Estructurar con IA»** (botón «✨ Estructurar con IA»):
1. Texto: «Pega tu borrador —texto y números, sin formato— y la IA propone cómo presentarlo. Nada se publica hasta que tú lo aceptes.»
2. Campo «Borrador» (precargado con el Markdown de la lección; si lo cambias, aparece «Usar el contenido de arriba» para recuperarlo).
3. «Proponer estructura» («Pensando la estructura…»). Mínimo 40 caracteres («El borrador está casi vacío: escribe algo más y vuelve a intentarlo.»); máximo leído 24.000.
4. Resultado: «Propuesta: {n} bloques», notas «Qué ha hecho», cada bloque pintado con «✓ Aceptar» / «✕ Descartar» (todos empiezan aceptados), y «Aceptar todos», «Descartar propuesta».
5. Aplicar: «Añadir al final ({n})» o «Sustituir el contenido» (si ya hay bloques, pide confirmación: «Esto sustituye todos los bloques actuales. ¿Seguir?»).
6. Los bloques pasan al editor y se muestra la vista previa. **Hay que pulsar «Guardar contenido»** para que se guarden.
- Coste: una llamada a OpenAI (de pago) por cada «Proponer estructura». Mismos errores de OpenAI que en la caja de archivos.

**Edición desde el propio campus**: un profesor que abre una lección en el campus ve «Estás viendo esto como profesor» y el botón «Editar contenido», que permite editar bloques en línea («Terminar» para salir). Esa edición guarda la versión del idioma en que el profesor tiene el campus.

### 4.3 «Audio narrado»
Sigue al selector de idioma: trabaja con el audio español o el inglés.
- Si hay audio: reproductor. Si no: «Esta lección aún no tiene audio.»
- **Generar**: botón «Generar narración con Fish Audio» (texto del botón aunque el proveedor configurado sea OpenAI). Mientras: «Generando narración… puede tardar un par de minutos.» Al terminar: «Narración generada a partir del contenido de la lección.»
  - Sólo aparece si el servidor tiene clave de voz; si no: «Añade FISH_API_KEY al servidor para generar la narración automáticamente.» (Esto lo configura quien despliega el servidor, no se puede hacer desde el panel.)
  - Proveedor: Fish Audio si existe `FISH_API_KEY` (o si `TTS_PROVIDER=fish`); si no, OpenAI TTS (`gpt-4o-mini-tts`). **Cuesta dinero** por carácter narrado en el proveedor.
  - Qué se narra: con bloques, el texto de los bloques de esa versión, **saltándose** recursos, tablas, cifras, gráficos y separadores; sin bloques, el Markdown (sólo en español: en inglés sin bloques da «La lección no tiene contenido que narrar.»). Los bloques de código no se leen.
  - Se narra lo **guardado**: guarda el contenido antes de generar.
  - El audio anterior no se borra del almacenamiento: queda la URL vieja, pero la lección pasa a apuntar al nuevo.
  - Límite de tiempo de la operación: 5 minutos.
- **Subir**: «…o sube tú el archivo:» (o «Subir archivo de audio (.mp3, .wav)» si no hay generación) + selector (acepta cualquier audio) + «Subir audio» («Subiendo…»). Éxito: «Audio subido correctamente.» Error: «Error: …» (p. ej. «Selecciona un archivo.»). Tamaño práctico máximo ~14 MB (límite de subida del servidor).
- Los audios se guardan en el almacenamiento público `lesson-audio` (cualquiera con la URL puede escucharlo).
- En el campus en inglés, si no hay audio inglés, se usa el español.

### 4.4 «Examen (quiz)»
- Lista numerada de preguntas con sus opciones; la correcta lleva «✓». Cada pregunta: «Editar» y «Eliminar» (**borra al instante, sin confirmación**).
- «+ Añadir pregunta» abre el editor de pregunta:
  - «Enunciado de la pregunta».
  - Opciones: empieza con 4 («Opción 1»…), con un botón de radio para marcar la correcta (sólo una). «✕» quita una opción (mínimo 2 en pantalla). «+ Opción» añade otra.
  - «Cancelar» / «Guardar pregunta».
  - Validaciones: «Escribe el enunciado.», «Añade al menos 2 opciones.» (las opciones vacías se ignoran), «Marca la opción correcta.»
- El quiz se crea solo al guardar la primera pregunta. La nota de aprobado es el **80 %** (valor fijo de la base, no editable en el panel).
- No hay reordenación de preguntas (se numeran en el orden de creación) ni versión inglesa de las preguntas.
- Efectos: los alumnos ven el test en la lección; cada intento cuenta en «Intentos de test» del Resumen, y aprobar/suspender avisa por Slack al canal de profesores (eventos «Examen aprobado» / «Examen suspendido»).

### Dónde encuentro… (módulos y lecciones)
- Qué lecciones tiene el módulo X → «Módulos y lecciones» → pulsa el módulo → tarjeta «Lecciones».
- Qué lecciones están vacías o sin audio → misma lista: píldoras «Vacía» y «Sin audio».
- La URL del módulo en el campus → campo «Slug (URL)» o botón «Ver en el campus».
- Quién puede ver un módulo → «Curso al que pertenece» (píldora violeta en la ficha) + matrículas del alumno (sección Usuarios, admin).
- Los módulos ocultos → filtro «Ocultos».
- Las preguntas del test de una lección → editor de lección → «Examen (quiz)».
- La versión inglesa de una lección → editor → «Editando la versión: Inglés».
- Cuánto dura un módulo → píldora «{n} min» (minutos estimados o suma de lecciones).

### Problemas frecuentes
- **No aparece la caja de arrastrar / el botón «Elegir archivo» está gris / no hay «Estructurar con IA»** → la IA (OpenAI) no está configurada o está desactivada. Un administrador la activa en «Ajustes» → «Inteligencia artificial».
- **El slug ya existe** → error de la base al guardar: cambia el slug (los de módulo son únicos en todo el campus; los de lección, dentro del módulo).
- **He guardado y han desaparecido bloques** → estaban incompletos; mira el aviso «Se han descartado…» y la tabla de arriba.
- **El alumno ve la lección en blanco** → no tiene bloques ni Markdown (píldora «Vacía»).
- **El alumno no ve un módulo** → mira si está «Oculto» (los ocultos no los ve ningún alumno) y, si no, comprueba el curso del módulo y que el alumno tenga ese curso abierto (Usuarios, admin).
- **«No se puede eliminar: lo usa la sesión de dry run…»** → cambia antes el módulo de esa sesión en Dry run, o déjalo oculto (ver 3.2).
- **La narración no se genera** → falta la clave de voz en el servidor, la lección no tiene texto narrable, o el proveedor falló (mensaje de error en rojo).
- **El audio subido no aparece en el campus en inglés** → se subió con «Español» seleccionado (o al revés).

### Relación con otras secciones
- Los interruptores de acceso a cursos por alumno (Remote Professional, Remote Founder, Web ABC) **no están aquí**: están en «Usuarios» (sólo administrador).
- La clave de OpenAI: «Inteligencia artificial» (admin). Los avisos de Slack: «Slack» (admin).
- Tareas asigna módulos de esta lista; la Guía docente agrupa su material por estos módulos; el asistente del campus lee los títulos y el texto de los módulos y lecciones.

---

## 5. Tareas (`/admin/tareas`)

**Cómo llegar**: grupo «Formación» → «Tareas». También desde el aviso «{n} tareas vencidas» del Resumen o el atajo «Asignar tarea».
**Quién**: profesor y administrador, mismos permisos (asignar, editar y borrar cualquier tarea, no sólo las propias).
**Para qué sirve**: asignar un módulo del campus a un alumno con fecha límite y seguir su avance. (No confundir con las tareas de Google Classroom: ver Manual, cap. 5.)

### Qué hay en pantalla
- Cabecera: «Tareas» — «Módulos asignados a cada alumno, con fecha límite. Slack avisa al asignar, recuerda antes de que venza y marca las vencidas.» Botón «+ Asignar tarea» (desactivado si no hay ningún alumno, con el aviso «No hay alumnos todavía: crea uno en Usuarios para poder asignarle tareas.»).
- **Cifras** (sólo si hay tareas):
  - «Abiertas» — «Pendientes o en curso» (incluye las que vencen pronto).
  - «Vencen pronto» — «En los próximos 3 días» (número en ámbar si hay alguna).
  - «Vencidas» — «Fuera de plazo y sin terminar» (en rojo si hay alguna).
  - «Completadas» — «Módulo terminado».
- **Filtros**:
  - Segmentos de «Estado» con contador: «Todas», «Abiertas», «Vencen pronto», «Vencidas», «Completadas».
  - Buscador «Buscar alumno o módulo» (nombre, email, título o código del módulo).
  - Desplegable «Alumno: Todos» y «Módulo: Todos» (sólo aparecen si hay más de un alumno / módulo con tareas; sólo listan los que tienen alguna).
  - «Quitar filtros» (aparece con cualquier filtro puesto).
- **Lista** con columnas «Alumno», «Módulo», «Progreso», «Fecha límite», «Estado» y acciones:
  - Alumno: iniciales, nombre y email.
  - Módulo: título, código y, si hay, «Nota: …».
  - Progreso: «{hechas}/{total} · {pct}%» y barra (lecciones del módulo completadas por el alumno).
  - Fecha límite: «Sin fecha límite», «Vence {fecha}», «Vence hoy», «Vence mañana», «Venció ayer», «Venció hace {n} días» (en completadas, la fecha). Debajo: «Asignada el {fecha}».
  - Estado (píldora): «Pendiente» (gris), «En curso» (azul), «Vence pronto» (ámbar), «Vencida» (rojo), «Completada» (verde).
  - Acciones: lápiz «Editar» y papelera «Borrar» (→ «¿Seguro?» / «Cancelar»).
- Vacíos: «Todavía no hay tareas» + «Asigna un módulo a un alumno con fecha límite: le llega por Slack y lo ve en «Mis tareas».»; con filtros sin resultado: «Nada coincide con los filtros.»

### Cómo se calcula el estado (lo que se ve)
Con la fecha de hoy en Madrid y el progreso real, en este orden:
1. «Completada» si está marcada como completada o el alumno ha terminado todas las lecciones del módulo.
2. «Vencida» si la fecha límite ya pasó.
3. «Vence pronto» si vence en 3 días o menos (incluido hoy).
4. «En curso» si está marcada en curso o tiene alguna lección hecha.
5. «Pendiente» en otro caso.
Por eso una tarea puede salir vencida aunque el aviso diario de Slack aún no la haya marcado.

### Asignar una tarea
1. «+ Asignar tarea» → ventana «Asignar tarea».
2. «Alumno» («Elige un alumno»): sólo cuentas con rol alumno, como «Nombre · email».
3. «Módulo» («Elige un módulo»): todos los módulos (también ocultos y de cualquier curso), como «Código · Título».
4. «Fecha límite» (opcional) — «Opcional. Slack le recuerda la tarea antes de que venza.»
5. «Nota para el alumno» (opcional, máx. 2.000 caracteres) — placeholder «Opcional: qué esperas, por dónde empezar…».
6. «Asignar» («Asignando…»). Errores: «Selecciona alumno y módulo.», «Ese alumno ya tiene asignado ese módulo.» (un alumno sólo puede tener una tarea por módulo).
- Efectos: el alumno la ve en «Mis tareas» del campus; se manda a Slack «Nueva tarea asignada» (alumno, módulo, fecha o «Sin fecha límite», quién la asignó, nota) al canal de alumnos y, si los mensajes directos están activos, por mensaje directo al alumno (buscado por su email en Slack).
- El panel no comprueba que el alumno tenga acceso al curso del módulo: si no lo tiene, es probable que no pueda abrir el módulo aunque le salga la tarea. Asegúrate de que tiene el curso abierto (Usuarios).

### Editar una tarea
Lápiz → «Editar tarea». Alumno y módulo se ven pero **no se pueden cambiar** (para eso, borra y asigna otra). Se cambian «Fecha límite» (se puede vaciar) y «Nota». «Guardar».
- Si cambias la fecha: se reinician los avisos (recordatorio y vencida se vuelven a mandar a su debido tiempo) y una tarea vencida vuelve a «pendiente». Una completada sigue completada. Editar no manda ningún aviso.

### Borrar una tarea
Papelera → «¿Seguro?». Desaparece también de «Mis tareas» del alumno. No avisa a nadie.

### Lo que pasa por detrás (automático)
- **Cron diario** (`/api/cron/reminders`, todos los días a las 07:00 UTC): para tareas no completadas con fecha:
  - Si la fecha ya pasó y no se había avisado: la marca «vencida» y manda «Tarea vencida» (canal de profesores + mensaje directo al alumno). Una sola vez por tarea.
  - Si vence entre hoy y dentro de 3 días y no se había recordado: manda «Tienes una tarea próxima a vencer» (canal de alumnos + mensaje directo). Una sola vez.
- **Al completar lecciones**: cuando el alumno completa una lección se avisa «Lección completada» (canal de profesores); si tiene asignado ese módulo, la tarea pasa a «en curso» y, al completar todas las lecciones, a «completada» con aviso «Tarea completada» (canal de profesores).
- **Resúmenes semanales** (Slack): lunes 07:00 UTC «Resumen semanal de progreso de alumnos» (canal de profesores); viernes 15:00 UTC «Seguimiento de cumplimiento de profesores» con tareas asignadas y pendientes de cierre por profesor (canal de administración).
- Todos los avisos dependen de que Slack esté configurado y de que el evento no esté apagado en «Slack» (admin). Si fallan, no rompen nada.

### Dónde encuentro…
- Las tareas de un alumno concreto → desplegable «Alumno» o buscador.
- Quién tiene asignado un módulo → desplegable «Módulo».
- Las vencidas → segmento «Vencidas» (o aviso del Resumen).
- Cuánto lleva hecho un alumno de su módulo → columna «Progreso».
- Quién asignó la tarea → no se muestra en el panel (sólo va en el aviso de Slack y en el resumen semanal de profesores).

### Problemas frecuentes
- Botón «Asignar tarea» gris → no hay alumnos (rol alumno). Créalos en Usuarios (admin).
- «Ese alumno ya tiene asignado ese módulo.» → edita la existente o bórrala.
- No llegó el aviso de Slack → Slack desactivado, sin canal, evento apagado, o el alumno no tiene cuenta de Slack con el mismo email (para el mensaje directo).
- Una tarea sale completada pero el resumen de Slack la cuenta como pendiente → el estado guardado se actualiza cuando el alumno completa una lección; la pantalla lo calcula en directo.

---

## 6. Guía docente (`/admin/guia-profesores`)

**Cómo llegar**: grupo «Formación» → «Guía docente».
**Quién**: profesor y administrador (mismo contenido). Para alumnos no existe: la tabla y el almacenamiento sólo dejan leer al equipo, y los enlaces exigen sesión de profesor/administrador.
**Para qué sirve**: el material privado para impartir cada módulo (diapositivas, guiones, kits de preguntas, tests con respuestas, solucionarios, rúbricas).

### Qué hay en pantalla
- Cabecera: «Guía para profesores» — «Material de apoyo para impartir cada módulo: diapositivas, guiones, kits de preguntas, tests y solucionarios. Sólo lo ve el equipo docente; los enlaces caducan en una hora.»
- Sin material: «Todavía no hay material cargado.»
- **Cifras**: «Módulos con material» (número), «Recursos» (total), «Por tipo» (etiquetas «PDF · n», «Presentación · n», «Documento · n», «Hoja de cálculo · n», «Texto · n», «Imagen · n», «Vídeo · n», «Archivo · n»).
- Nota: «Cada enlace se firma al abrirlo y caduca en una hora: reenviarlo a un alumno no sirve.»
- **Herramientas**: buscador «Buscar un recurso o un módulo…» (si coincide con el título/código del módulo, enseña todo el módulo; si no, sólo los recursos cuyo nombre coincide; sin tildes ni mayúsculas); filtros de curso «Todos», «Núcleo común», «Remote Professional», «Remote Founder» (sólo los cursos presentes); botón «Abrir todos» / «Cerrar todos».
- **Tarjetas desplegables**, una por módulo con material (y una «General» primero si hay material sin módulo). Cabecera: código, título, píldora del curso, recuento por tipo y «{n} recursos». Cerradas por defecto; al buscar se abren solas.
- Dentro, por apartados en este orden: «General», «Pre-clase», «Hora 1», «Hora 2», «Hora 3», «Hora 4», «Rúbricas y tareas» (y cualquier otro apartado que exista, al final). Cada recurso: icono de tipo (PDF, PPT, DOC, XLS, TXT, IMG, VID, FILE), nombre, píldora de idioma (ES/EN) si tiene, y botón «Abrir».
- Sin coincidencias: «Nada coincide con la búsqueda.»

### Abrir un recurso
«Abrir» abre una pestaña nueva en `/admin/guia-profesores/abrir/<id>`, que comprueba tu rol, firma un enlace de descarga válido **una hora** y te redirige al archivo. Errores posibles: «No autorizado» (no eres profesor/admin), «No existe», «No se ha podido abrir el archivo».

### Lo que NO se puede hacer aquí
- **No hay subida, edición ni borrado desde el panel.** El material se carga desde fuera (script de importación del equipo técnico, `scripts/campus-import.mjs`, al almacenamiento privado `teacher-guides`). Para añadir o corregir material hay que pedirlo al equipo.
- Los módulos del curso Relámpago no tienen etiqueta traducida en esta página (si tuvieran material, la píldora mostraría el código interno `web-abc`).

### Dónde encuentro…
- El material de la hora 2 del módulo 3 → busca el módulo, ábrelo y mira el apartado «Hora 2».
- Las rúbricas → apartado «Rúbricas y tareas» de cada módulo.
- Cuánto material hay de cada tipo → cifra «Por tipo».

### Avisos
- No reenvíes enlaces a alumnos: el enlace de la página exige sesión de equipo y el firmado caduca en una hora. Si un alumno necesita algo, publícalo en Classroom o en la lección (bloque «Recursos»).

---

## 7. Asistente (`/admin/asistente`) — gestión del chat de los alumnos

**Cómo llegar**: grupo «Formación» → «Asistente». También desde el aviso «{n} preguntas del asistente sin respuesta» del Resumen y el atajo «Nueva FAQ del asistente».
**Quién**: profesor y administrador, mismos permisos: crear, editar, activar/desactivar y borrar FAQs y documentos, y descartar preguntas. (Borrar preguntas registradas sólo lo permite la base a administradores, pero no hay botón para ello en el panel.)
**Para qué sirve**: mantener lo que sabe el chat «Asistente del campus» que ven los alumnos (botón «¿Dudas? Pregúntame» en el campus) y revisar lo que preguntan.

### Qué hay en pantalla
- Cabecera: «Asistente del campus» — «Sube FAQs y documentos sobre el curso, sus dinámicas y su logística. El chat del campus busca en ellos y responde con lo que haya escrito el equipo.» Botones «Subir documento» y «+ Nueva FAQ».
- **Cifras**:
  - «FAQs» (total) — «{n} activas».
  - «Documentos» (total) — «{n} activos».
  - «Fragmentos» — suma de fragmentos de las fuentes activas — «Lo que el chat puede leer».
  - «Sin respuesta» — preguntas pendientes en la bandeja (máximo 50 mostradas) — «Esperan una FAQ». Si hay alguna, tarjeta destacada con icono de aviso; pulsarla baja a la bandeja.
- **«Bandeja: preguntas sin respuesta»** (las 50 más recientes no respondidas y no revisadas):
  - Texto: «El chat no encontró nada que encajara. Cada una es una FAQ que falta: créala con la pregunta tal como la escribió el alumno.»
  - Cada pregunta: texto, «{quién} · {cuándo}», desplegable «Lo más parecido que encontró» (lo que contestó el chat, si contestó algo), y botones «Crear FAQ» y «Descartar».
  - Vacía: «Nada pendiente: el asistente ha sabido contestar todo lo que le han preguntado.»
- **«Preguntas frecuentes»** (botón «+ Nueva FAQ»):
  - Buscador «Buscar en las FAQs…» (busca en pregunta y respuesta) y filtros «Todas {n}», «Activas {n}», «Inactivas {n}».
  - Cada FAQ: pregunta, respuesta (cortada a 220 caracteres), píldoras «Activa» (verde) / «Inactiva» (gris) y curso (código interno, p. ej. `core`, o «Todos los cursos»). Las inactivas se ven atenuadas. Acciones: «Editar», «Desactivar»/«Activar», «Eliminar» (→ «Sí, eliminar» / «Cancelar»).
  - Vacíos: «Aún no hay FAQs.» / «Ninguna FAQ coincide con la búsqueda.»
- **«Documentos»** (botón «+ Subir documento»): cada uno con la extensión (PDF, MD, TXT), título, nombre del archivo, píldoras «Activo»/«Inactivo», curso y «{n} fragmentos». Mismas acciones. Vacío: «Aún no hay documentos.»
- **«Probar el asistente»**: «Responde como a un alumno, pero buscando en el material de todos los cursos. Tus preguntas también quedan registradas.» Contiene el mismo chat del campus.
- **«Últimas preguntas»**: las 25 últimas preguntas de cualquiera (incluido el equipo), con autor, fecha y píldora «Respondida» (verde) o «Sin respuesta» (ámbar). Vacío: «Todavía nadie ha preguntado nada.»

### Crear o editar una FAQ
1. «+ Nueva FAQ» (o «Editar» en una FAQ) → ventana «Nueva FAQ» / «Editar FAQ».
2. «Pregunta» (obligatoria) y «Respuesta» (obligatoria; «Escríbela como la dirías tú. Puedes usar markdown.»).
3. «Curso»: «Todos los cursos» o un curso (las opciones se ven con su código interno: `core`, `remote-professional`, `remote-founder`, `web-abc`). Una FAQ de un curso sólo la usa el chat con alumnos que tienen ese curso (y `core` lo tienen quienes tienen Professional o Founder).
4. Sólo al editar: casilla «Activo (el asistente lo usa)».
5. «Guardar» («Guardando…») o «Cancelar». Errores: «Falta la pregunta.», «Falta la respuesta.»
- Las nuevas se crean activas. Al guardar se «indexa» (una FAQ = un fragmento). Si la indexación falla al crear, la FAQ se borra y sale el error.

### Convertir una pregunta de la bandeja en FAQ
«Crear FAQ» abre «Nueva FAQ» con la pregunta del alumno ya escrita. Escribe la respuesta y guarda: se crea la FAQ y la pregunta **sale de la bandeja** (queda marcada como revisada). «Descartar» la saca de la bandeja sin crear nada (se marca revisada; no se borra, sigue en «Últimas preguntas»).

### Subir o editar un documento
1. «Subir documento» → «Subir documento».
2. «Título» (obligatorio; placeholder «Calendario y normas del curso»).
3. «Archivo (PDF, .md o .txt)» — «Si subes un archivo, se usa su texto. Si no, pega el texto abajo.» (Word y otros no: hay que exportarlos a PDF.)
4. «Texto»: lo pegas tú o, al editar, es el texto extraído («Es el texto extraído. Puedes corregirlo: se vuelve a trocear al guardar.»). Si subes un archivo, **el archivo manda sobre el texto**.
5. «Curso», y al editar «Activo (el asistente lo usa)». «Guardar».
- Errores: «Falta el título.», «Sube un archivo o pega el texto.», «No se ha podido sacar texto del archivo. Si es un PDF escaneado, pega el texto a mano.», «Formato no soportado. Sube un PDF, un .md o un .txt.»
- El archivo no se guarda: sólo su texto (máximo 300.000 caracteres; lo demás se corta). Se trocea en fragmentos de unos 1.200 caracteres respetando los encabezados Markdown (`## …`); cada fragmento lleva «Título › Sección».
- Subir un archivo nuevo al editar sustituye el texto y el nombre del archivo.
- Tamaño de subida práctico máximo ~14 MB.

### Activar, desactivar, borrar
- «Desactivar»/«Activar»: inmediato. Una fuente inactiva deja de usarse en el chat pero no se pierde (recomendado en vez de borrar cuando algo deja de ser cierto).
- «Eliminar» → «Sí, eliminar»: borra la fuente y sus fragmentos. Los errores salen en rojo junto a los botones.

### Cómo responde el chat a los alumnos (por detrás)
- **Con DeepSeek configurado** (clave de DeepSeek en los ajustes de Publicaciones, `/admin/publicaciones/ajustes`, sólo admin, o `DEEPSEEK_API_KEY` en el servidor): el chat usa IA (DeepSeek) que **sólo** puede contestar con: las FAQs activas que ve el alumno (todas las generales + las de sus cursos, hasta ~60.000 caracteres), los fragmentos de documentos que encuentra el buscador, el temario y el texto de los módulos/lecciones a los que tiene acceso, las herramientas y el claustro de la web pública, y los datos de su dry run. Entiende el contexto de los últimos 6 turnos. Si la respuesta no está ahí, debe decirlo y la pregunta cuenta como «sin respuesta». **Cada pregunta es una llamada de pago a DeepSeek** (barata; parte del contexto va en caché).
- **Sin DeepSeek**: contesta un buscador de texto en Postgres (sin IA, sin coste), devolviendo la FAQ o el fragmento que mejor encaja tal cual; si no cubre al menos la mitad de las palabras de la pregunta, cuenta como «sin respuesta» y ofrece hasta 3 FAQs relacionadas. Si DeepSeek falla, el alumno ve «Perdona, ahora mismo no he podido pensar bien la respuesta…» con sugerencias, y la pregunta cuenta como sin respuesta.
- La indexación de FAQs y documentos **no usa IA ni cuesta nada** (troceado + índice de texto en español sin tildes). Las respuestas del chat de los alumnos sí usan IA: DeepSeek, con la clave de Publicaciones → Ajustes.
- **Registro**: cada pregunta (de alumnos y del equipo, incluida la caja «Probar el asistente») se guarda con la respuesta mostrada y si se respondió. Las no respondidas alimentan la bandeja y el aviso del Resumen.
- **Límite**: un alumno puede hacer 40 preguntas por hora («Has hecho muchas preguntas seguidas. Prueba de nuevo dentro de un rato.»). El equipo no tiene límite.
- **Visibilidad del chat en el campus**: el botón del asistente sólo aparece en el campus si existe **al menos una FAQ o documento activo**. Si desactivas todo, el chat desaparece para los alumnos.
- El equipo, al probar, busca en el material de todos los cursos (no reproduce exactamente lo que ve un alumno concreto con menos cursos).
- Los alumnos no pueden leer la base de conocimiento directamente: sólo reciben respuestas del chat.

### Dónde encuentro…
- Qué preguntaron los alumnos y no supo contestar → «Bandeja: preguntas sin respuesta».
- Lo último que se ha preguntado (respondido o no) → «Últimas preguntas» (25).
- Qué contestó el chat a una pregunta pendiente → desplegable «Lo más parecido que encontró».
- Qué FAQs están desactivadas → filtro «Inactivas».
- De qué curso es una FAQ → píldora con el código del curso.
- En cuántos trozos se ha partido un documento → píldora «{n} fragmentos».
- Si la IA del asistente está activa → no se muestra en esta página; depende de la clave de DeepSeek (admin, ajustes de Publicaciones).

### Problemas frecuentes
- **El chat contesta algo antiguo** → hay una FAQ o documento con información vieja: edítalo o desactívalo.
- **Un alumno de un curso no recibe la respuesta de una FAQ** → la FAQ está asignada a otro curso; pon «Todos los cursos» o el curso correcto.
- **El PDF no da texto** → es escaneado: pega el texto a mano.
- **No veo el chat en el campus** → no hay ninguna fuente activa.
- **La bandeja dice 50 y hay más** → sólo se muestran las 50 más recientes; ve vaciándola.

### Relación con otras secciones
- Resumen: aviso «preguntas del asistente sin respuesta».
- Módulos y lecciones: el chat (con DeepSeek) lee títulos y texto de las lecciones; mejorar el contenido mejora las respuestas.
- Dry run (admin): el chat usa los datos del dry run del alumno.
- Publicaciones → ajustes (admin): ahí vive la clave de DeepSeek que usa el chat.
