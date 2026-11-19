# Manual del panel · Parte 2: Respuestas, Matrículas, Usuarios y Dry run

Convenciones de este documento:
- Las etiquetas entre comillas («…») son el texto exacto que se ve en pantalla en español.
- Colores de las píldoras (pills) del panel: **verde** = ok, **ámbar/ocre** = aviso (warn), **rojo** = mal (bad), **azul** = info, **violeta** = acento.
- Todas las horas del dry run se manejan en **hora de Madrid** (Europe/Madrid), cambio de hora incluido.
- Roles del panel: administrador, profesor, comercial. Los alumnos nunca entran en /admin (se les redirige a la portada). El rol comercial solo ve su gestor comercial (/admin/comercial) y ninguna de las secciones de este documento.

Menú lateral (lo relevante para este documento):
- Grupo «Formación» (lo ven administrador y profesor): … «Respuestas» …
- Grupo «Alumnos y ventas» (solo administrador): «Matrículas y pagos», «Usuarios», «Dry run».

---

## Respuestas

### Ruta y acceso
- Ruta: `/admin/respuestas`. Menú: grupo «Formación» → «Respuestas».
- Subpáginas:
  - `/admin/respuestas?act=<clave>` → detalle de una actividad.
  - `/admin/respuestas/alumnos/<id>` → ficha de un alumno.
  - `/admin/respuestas/<id>` → una respuesta concreta (y su corrección).
  - `/admin/respuestas/alumnos` (sin id) redirige a `/admin/respuestas`.

### Quién la ve y qué alumnos aparecen (src/lib/actividades/acceso.ts)
- **Administrador**: ve a todos los alumnos.
- **Profesor**: ve solo a sus alumnos, que son:
  1. los que tiene asignados como profesor (tabla `student_teachers`; se asignan desde la ficha del alumno, solo la administración), y
  2. los alumnos a los que **él mismo** les asignó una tarea/módulo en «Tareas» (`assignments.assigned_by` = él).
- Nadie más ve respuestas de alumnos. Si un profesor abre la URL de un alumno o de una respuesta que no es suya, obtiene una página 404.
- Diferencias de rol dentro de la sección:
  - Solo el administrador puede **asignar y quitar profesores** en la ficha del alumno (el profesor ve los nombres, pero sin «×» ni el desplegable «Añadir profesor…»).
  - Corregir: administrador (cualquier alumno) o profesor (solo sus alumnos).

Qué personas salen como «alumnos» en el panel: la unión de invitados con plaza en un dry run del módulo, alumnos con matrícula activa, alumnos asignados al profesor y cualquiera que haya abierto material o enviado una actividad; filtrado por lo que puede ver quien mira. Se **excluyen** siempre las cuentas con rol profesor, administrador o comercial (el equipo prueba el campus con sus cuentas y no cuenta como alumno). Ordenados por nombre.

Qué lecciones y actividades salen: solo las de los módulos que tienen actividades definidas en código. Hoy el catálogo solo tiene actividades del módulo con slug `nucleo-01` (Módulo 01), así que la matriz muestra las lecciones de ese módulo.

### Para qué sirve
El panel del profesor: lo que entregan los alumnos, lo que queda por corregir y cómo va cada uno, de lo urgente a lo general.

### Catálogo de actividades actual (Módulo 01, definido en src/lib/actividades/m01.ts)
| Lección (order_index) | Actividad | Tipo | Obligatoria | Se corrige con rúbrica | Notas |
|---|---|---|---|---|---|
| 1 (Antes de la clase) | Ficha de presentación | Formulario | Sí | No | Marca el paso «ficha» de la preparación del dry run al enviarla |
| 1 | Test de Punto de Partida | Diagnóstico | Sí | No | Marca el paso «test»; resultado en % y estadio |
| 1 | Async Autonomy Baseline | Diagnóstico | No (opcional) | No | |
| 1 | Encuesta de expectativas | Encuesta | Sí | No | **Anónima**: solo se ve el recuento |
| 1 | La trampa de la proximidad | Juego | No (opcional) | No | |
| 2 | Tarea 01 · Diagnóstico de Preparación Remota | Formulario | Sí | **Sí** | |
| 3 | Tarea 02 · Monta tu Motor de Visibilidad | Formulario | Sí | **Sí** | |
| 4 | Tarea 03 · Graba tu actualización de impacto y úsala tres veces | Formulario | Sí | **Sí** | |
| 5 | Test de conocimientos del módulo 01 | Test | Sí | No (se corrige solo) | Aprobado con 70 % (14 de 20); repetible |

Solo las tres **Tareas** aparecen en «Por corregir» y tienen formulario de corrección. Una actividad «cuenta como hecha» si está enviada o revisada; un test solo si además está aprobado.

Estados de una respuesta (píldora): «Borrador» (ámbar), «Enviada» (azul), «Revisada» (verde), «Para rehacer» (rojo; es el estado «devuelta»).

### Pantalla principal `/admin/respuestas`
Cabecera: título «Respuestas» y subtítulo «Lo que entregan tus alumnos, lo que tienes por corregir y cómo va cada uno.»

**1. Cuatro cifras (KPIs)**
- «Alumnos»: número de alumnos visibles. Debajo: «{n} activos esta semana» (alumnos con alguna actividad en los últimos 7 días; la «última actividad» es lo más reciente entre: abrir un enlace del material, visitar una lección o modificar una respuesta).
- «Por corregir»: número de entregas de tareas en estado «Enviada». Es un enlace que baja a la cola. Tarjeta en tono de aviso si hay alguna (icono de revisar) o en tono ok si no (icono ✓). Debajo: cuánto hace de la **más antigua** pendiente («hace 3 h», «hace 2 d»…; a partir de 7 días, la fecha), o «todo corregido».
- «Lecciones completadas»: «hechas/abiertas» sumando todos los alumnos (por ejemplo 12/40). Debajo: «de las ya abiertas». Las lecciones aún cerradas para un alumno no cuentan.
- «Nota media»: media de todas las notas (0–10) puestas, con un decimal y coma decimal, «/10». Debajo: «{n} nota» (cuántas notas hay) o «sin notas todavía». Si no hay notas: «—».

**2. «Por corregir»** (ancla `#por-corregir`)
- Título con un contador rojo/ámbar si hay pendientes.
- Lista ordenada de la más antigua a la más reciente: avatar, título de la actividad, «Nombre · hace X» y botón «Corregir» (abre `/admin/respuestas/<id>`).
- Vacía: «Nada pendiente: todas las entregas están corregidas.»

**3. «Progreso por lección» (matriz alumno × lección)**
- Contador con el número de alumnos. Ayuda: «Pasa el ratón por una casilla para ver el detalle. Pulsa un alumno para abrir su ficha.»
- Columnas: «Alumno» (avatar, nombre y email; enlace a la ficha), una columna por lección con etiqueta corta, «Avance», «Nota», «Visto».
  - Etiqueta corta de lección: «H1», «H2»… si el título empieza por «Hora N»; «Previo» si empieza por «Antes»; si no, «L1», «L2»… (posición).
- Cada casilla es un punto/cuadro que enlaza a la ficha del alumno en esa lección (`#l-<id>`):
  - **Completada**: fondo verde con ✓. La lección figura como completada en su progreso.
  - **En curso**: fondo amarillo claro con borde amarillo; si la lección tiene actividades obligatorias muestra «a/b» (obligatorias hechas / total). Se considera en curso si ha entrado en la lección, ha abierto algún enlace de su material o ha enviado alguna actividad.
  - **Sin empezar**: blanco con borde gris.
  - **Aún cerrada**: rayado gris. Solo pasa con invitados de un dry run antes de que empiece la clase: todas las lecciones del módulo menos la primera están cerradas para ellos hasta `starts_at`.
  - **Tiene algo por corregir**: punto rojo en la esquina (una tarea de esa lección está «Enviada»).
  - Tooltip de cada casilla: «{lección} · {estado} · material {abiertos/total} · actividades {hechas/obligatorias}».
- «Avance»: barra con lecciones completadas / lecciones ya abiertas para ese alumno.
- «Nota»: su nota media (o «—»).
- «Visto»: cuánto hace de su última actividad («ahora», «hace N min», «hace N h», «hace N d», o fecha).
- Leyenda debajo: «Completada», «En curso», «Sin empezar», «Aún cerrada», «Tiene algo por corregir».
- Vacía: «Todavía no tienes alumnos asignados.»

**4. «Actividades»** (tarjetas, una por actividad y lección)
- Cada tarjeta: etiqueta corta de la lección, tipo («Formulario», «Diagnóstico», «Test», «Encuesta», «Juego»), « · opcional» si no es obligatoria, el título, y una barra «enviadas/posibles» (posibles = alumnos para los que esa lección no está cerrada; si está cerrada para todos sale «Aún cerrada»).
- Píldora ámbar «{n} por corregir» si es una tarea con entregas en «Enviada».
- Las anónimas muestran «anónima» y **no son clicables**. El resto enlaza a `?act=<clave>`.

### Detalle de una actividad `/admin/respuestas?act=<clave>`
- Enlace «← Respuestas».
- Título de la actividad; debajo: «{lección} · {a} de {b} la han enviado» y, si hay resultados con %, « · Media: N %».
- Si es anónima: solo el aviso «Anónima: solo se ve el recuento.»
- Si no:
  - Columna «Enviadas» (contador): cada alumno con píldora de estado, resultado corto y cuánto hace. Resultado corto: la nota «x/10» si la hay; si no, en diagnósticos el «%», y en test/juego «puntos/máximo». Botón «Corregir» (si es una tarea en «Enviada») o «Ver».
  - Vacía: «Nadie la ha enviado todavía.»
  - Columna «Sin empezar» (contador): alumnos sin ninguna respuesta a esa actividad (y para los que la lección no está cerrada), con enlace a su ficha. Vacía: «✓ Todos la han enviado.»
  - Ojo: quien solo tiene un **borrador** no aparece en ninguna de las dos listas (no cuenta como enviada, pero tampoco como «sin empezar»).
- Si la clave no existe, se muestra la pantalla principal.

### Ficha del alumno `/admin/respuestas/alumnos/<id>`
Se llega pulsando un alumno en la matriz, una casilla, o el nombre en una respuesta. 404 si quien mira no puede ver a ese alumno o si la persona no figura como alumno (por ejemplo, una cuenta del equipo).

**Cabecera («Quién es»)**
- Avatar grande, nombre, y línea con: email · «Preparación del dry run: hechos/9» (solo si es invitado con plaza de un dry run) · «visto hace …».
- «Profesor:»: chips con los profesores asignados o «sin asignar».
  - Solo administrador: «×» en cada chip para quitarlo (sin confirmación) y el desplegable «Añadir profesor…» + botón «Asignar». El desplegable lista a todas las personas con rol profesor **o administrador** que aún no estén asignadas. Un alumno puede tener varios profesores.
- Cuatro cifras: «Lecciones completadas» (hechas/abiertas), «Actividades obligatorias» (hechas/total de las lecciones abiertas), «Enlaces del material abiertos» (abiertos/total en lecciones abiertas), «Nota media» (/10).

**«Su recorrido»** (columna izquierda): una entrada por lección.
- Punto de estado (mismos colores que la matriz), etiqueta corta, título sin el prefijo «Hora N ·», y píldora de estado: «Completada» (verde), «En curso» (azul), «Sin empezar» (ámbar), «Aún cerrada» (sin color).
- Cerrada: «Se abre con la clase en directo.»
- Abierta, dos bloques:
  - «Material» con barra abiertos/total: cada enlace de la lección con ✓ y «abierto {fecha y hora}» o reloj y «sin abrir». Los enlaces se pueden abrir desde aquí.
  - «Actividades»: cada actividad no anónima con tipo, « · opcional», píldora de estado o «sin enviar», resultado (nota, % o puntos) y botón «Corregir»/«Ver» (solo si no es borrador).

**Columna derecha**
- «Por corregir» (contador): sus tareas en «Enviada», con «Corregir». Vacía: «✓ Nada por corregir.»
- «Preguntas al asistente» (contador, hasta las 100 más recientes): se ven las 3 últimas; «Ver todo ({n})» despliega el resto. Cada una: la pregunta, cuánto hace, y la respuesta del asistente recortada a 280 caracteres, o «Sin respuesta.». Vacía: «No ha preguntado nada.»
- «Actividad reciente»: las 6 últimas; «Ver todo ({n})» despliega hasta 200. Tipos de evento:
  - «Abrió «{lección}»», «Completó «{lección}»», «Aprobó el test de «{lección}»», «Suspendió el test de «{lección}»» (del registro de actividad).
  - «Abrió el enlace «{recurso}»» (enlaza al recurso).
  - «Envió «{actividad}»» y «Corregida: «{actividad}»» / «Devuelta para rehacer: «{actividad}»» (enlazan a la respuesta). Las anónimas no salen.
  - «Preguntó al asistente: «{pregunta}»» (primeros 90 caracteres).
  - Vacía: «Todavía no hay actividad.»

### Una respuesta `/admin/respuestas/<id>`
- Migas: «Respuestas / {Nombre del alumno}».
- Cabecera: tipo · lección; título de la actividad; nombre del alumno · «Enviada el {d}» · «{n} intentos» (si más de 1) · «Corregida el {d}» (si revisada o devuelta) · «avisado por correo el {d}» (si se envió el aviso). A la derecha, píldora de estado y la nota grande «x/10» si la hay.
- «Sus respuestas»: el resultado (para test, diagnóstico y juego: puntuación, estadio, desglose, aciertos) y, para formularios y encuestas, todas sus respuestas campo a campo.
- «Corrección» (columna derecha, fija al hacer scroll): solo si la actividad es una Tarea con rúbrica y no está en borrador. En el resto de actividades la página es solo de lectura.
- 404 si: no existe, la actividad es anónima, o el profesor no puede ver a ese alumno.

### Cómo corregir una tarea (paso a paso)
1. Entra desde «Por corregir» (pantalla principal o ficha) o desde una tarjeta de actividad → botón «Corregir».
2. Rúbrica: para cada criterio («Completitud», «Rigor», «Aplicación al caso propio») elige un nivel de **4 a 1**; cada opción muestra «N · descripción del nivel».
3. «Nota (de 0 a 10)»: campo de texto; admite solo cifras, coma o punto, máximo 5 caracteres (ej. «7,5»). Debajo:
   - Si has puntuado **todos** los criterios: «Según la rúbrica: {n}» (y ese valor aparece como placeholder). Fórmula: suma de niveles / (4 × nº de criterios) × 10, con un decimal (ej. 3+3+4 = 10/12 → 8,3).
   - Si no: «Si la dejas vacía, se calcula con la rúbrica.»
   - El servidor limita la nota a 0–10 y redondea a 2 decimales.
4. «Comentario del profesor»: texto libre (placeholder «Qué está bien, qué hay que mejorar y su siguiente paso.»). Se guardan como máximo 4000 caracteres; vacío se guarda como sin comentario.
5. Casilla «Avisar al alumno por correo con la nota y el comentario» — **marcada por defecto**.
6. Pulsa uno de los dos botones:
   - «Dar por revisada» → estado «Revisada». Nota guardada = la que escribiste o, si la dejaste vacía, la de la rúbrica (si la rúbrica está incompleta, queda sin nota).
   - «Devolver para rehacer» → estado «Para rehacer». Nota guardada = solo la que escribiste (no se usa la de la rúbrica). Como las tres tareas son obligatorias, la lección del alumno **deja de contar como completada** (vuelve a «en curso»).
7. Mensaje tras guardar: «Revisión guardada.», «Revisión guardada y correo enviado al alumno.» o «Revisión guardada, pero el correo no se pudo enviar.». Error genérico: «No se ha podido guardar. Inténtalo otra vez.» (también es lo que sale si no tienes permiso); sesión caducada: «Tu sesión ha caducado. Vuelve a entrar.»; respuesta borrada: «Esta actividad ya no existe.»
- Se puede volver a corregir en cualquier momento (el formulario sigue ahí con los valores anteriores); cada guardado sobrescribe rúbrica, nota, comentario y fecha de corrección.

### Lo que pasa por detrás al corregir
- Se guarda quién corrigió y cuándo, y se apunta en el registro de actividad del alumno («activity_reviewed» o «activity_returned»).
- **Lo que ve el alumno**: el estado, la rúbrica, la nota y el comentario aparecen en la lección y en «Mis tareas». Si está «Para rehacer», ve el aviso «El profesor te la ha devuelto para que la rehagas…» y puede editarla y reenviarla (vuelve a «Enviada» y a tu cola). Si está «Revisada», el alumno ya no puede cambiarla («El profesor ya la ha revisado: no se puede cambiar.»); los tests sí se pueden repetir siempre.
- **Correo al alumno** (si la casilla estaba marcada): a su email de perfil.
  - Asunto: «ActiveXRemote · Corregida: {actividad} ({nota}/10)» o «ActiveXRemote · Para rehacer: {actividad}».
  - Título «Tu tarea ya está corregida» / «Tienes una tarea para rehacer»; tabla con Actividad, Lección, Estado, Nota y cada criterio «nivel/4 · texto»; «El comentario de tu profesor»; botón «Ver la corrección en el campus» / «Rehacer la tarea» que lleva a la lección (`/lecciones/<id>#act-<clave>`); firma con el nombre del profesor; «¿Dudas sobre la corrección? Responde a este correo.»
  - Sale por la misma **cuenta de envío SMTP** que se configura en «Dry run» → «Cuenta de envío». Si no está configurada o activada, el correo falla («…pero el correo no se pudo enviar.»), aunque la corrección sí se guarda.
  - Al enviarse, se anota «avisado por correo el {d}». **Cada** guardado con la casilla marcada envía otro correo (no se evita el duplicado): desmárcala si solo corriges una errata.
- No hay llamadas a IA en esta sección.

### Dónde encuentro…
- Qué tengo pendiente de corregir → KPI «Por corregir» o bloque «Por corregir» de la pantalla principal; por alumno, en su ficha.
- Cuánto hace que espera la entrega más antigua → texto pequeño bajo «Por corregir».
- Cómo va un alumno en cada lección → matriz «Progreso por lección» o su ficha («Su recorrido»).
- Qué enlaces del material ha abierto y cuándo → ficha → «Su recorrido» → «Material».
- Su nota media → columna «Nota» de la matriz o cifra «Nota media» de la ficha.
- Cuándo entró por última vez → columna «Visto» o cabecera de la ficha.
- Quién no ha enviado una actividad → tarjeta de la actividad → columna «Sin empezar».
- La media de la cohorte en un test/diagnóstico → detalle de la actividad («Media: N %»).
- Qué preguntó al asistente → ficha → «Preguntas al asistente».
- Cuánta preparación del dry run lleva → cabecera de la ficha («Preparación del dry run: x/9»).
- Quién es su profesor / asignarle uno → cabecera de la ficha («Profesor:»).
- Cuántas veces envió una tarea, cuándo se corrigió, si se le avisó → cabecera de la página de la respuesta.
- Los resultados de la encuesta anónima → no se ven nominalmente; solo el recuento en la tarjeta.

### Problemas frecuentes
- **Un profesor no ve a un alumno**: no lo tiene asignado. La administración debe asignárselo en la ficha (Profesor → «Añadir profesor…» → «Asignar»), o el profesor asignarle una tarea en «Tareas».
- **«Todavía no tienes alumnos asignados.»** (profesor): mismo motivo.
- **Una cuenta del equipo no aparece**: es intencionado; profesores, administradores y comerciales nunca salen como alumnos. Para ver a alguien como alumno, su rol debe ser «Alumno» (en «Usuarios»).
- **Lecciones «Aún cerradas»**: es un invitado del dry run y la clase aún no ha empezado; se abren solas a la hora de inicio de la sesión.
- **«…pero el correo no se pudo enviar.»**: revisar «Dry run» → «Cuenta de envío» (activada, usuario y contraseña de aplicación), o el alumno no tiene email.
- **Una actividad no tiene botón de corregir**: solo las Tareas 01–03 se corrigen; el resto se corrige sola o es informativa.
- **Un alumno con un borrador no sale en «Sin empezar» ni en «Enviadas»**: comportamiento actual del detalle de actividad.

### Relación con otras secciones
- «Tareas»: asignar un módulo a un alumno hace que el profesor que lo asigna lo vea aquí.
- «Usuarios»: el rol decide si alguien cuenta como alumno.
- «Dry run»: los invitados con plaza aparecen como alumnos; su preparación sale en la ficha; enviar la Ficha de presentación o el Test de Punto de Partida marca pasos de su preparación; la cuenta de envío del dry run es la que manda el aviso de corrección.
- «Asistente»: las preguntas que se ven en la ficha son las del chat del campus.

---

## Matrículas y pagos

### Ruta y acceso
- Ruta: `/admin/matriculas`. Menú: grupo «Alumnos y ventas» → «Matrículas y pagos».
- Quién la ve: el menú solo la muestra al **administrador**. (Nota técnica: la página no comprueba el rol por sí misma y la base de datos deja leer pedidos a profesores; un profesor que escribiera la URL a mano podría verla. No hay acciones de escritura en esta pantalla.)

### Para qué sirve
Ver todo lo que ha pasado por el checkout de Stripe y, sobre todo, a quién recuperar: gente que dejó sus datos y no llegó a pagar.

Cabecera: «Matrículas y pagos» — «Todo lo que ha pasado por el checkout. Lo más importante va arriba: quien dejó sus datos y no llegó a pagar.»

### Qué hay en pantalla
**Cuatro cifras**
- «Cobrado»: total cobrado en euros. Hint: «{n} pedidos pagados o en plazos». Cuenta los pedidos en «Pagado», «En plazos» y «Completado». En un pago a plazos, lo cobrado = importe de un plazo × plazos pagados (mínimo 1).
- «Plazos por cobrar»: lo que falta de los pagos a plazos en curso = importe del plazo × (3 − plazos pagados), solo de pedidos «En plazos». Hint: «Lo que falta de los pagos a plazos».
- «Por recuperar»: número de abandonos a recuperar (en ámbar si hay alguno). Hint: «Abandonaron el pago».
- «Pedidos»: total de pedidos. Hint: «Desde el principio».

**«Para recuperar»** (solo si hay alguno; píldora ámbar con el número)
- Texto: «Dejaron los datos y no completaron el pago. Quien después pagó por otro pedido ya no sale aquí.»
- Incluye pedidos «Sin pagar» (iniciado) o «Abandonado» (expirado), **una sola vez por email** (el intento más reciente), y excluye a quien tiene otro pedido cobrado con el mismo email. Los pedidos sin email salen todos.
- Cada tarjeta: avatar (o «?» si no hay ni nombre ni email), nombre (o la parte del email antes de @, o «Sin datos»), email o «Sin email: no llegó a dejarlo», chips de cursos (violeta), oferta e importe, fecha.
- Botones (si hay email): «Escribir» (abre tu cliente de correo con asunto «Tu matrícula en ActiveXRemote» y un cuerpo ya escrito: «Hola {nombre}, Vimos que empezaste la matrícula y no llegaste a terminarla. ¿Te podemos ayudar con algo? …») y «Copiar email» (cambia a «Copiado» un momento).

**Lista de todos los pedidos**
- Buscador «Buscar comprador o email» (sin importar tildes ni mayúsculas).
- Filtros con contador: «Todos», «Cobrados» (Pagado, En plazos, Completado), «Abandonados» (Sin pagar, Abandonado), «Fallidos y reembolsos» (Cobro fallido, Reembolsado).
- Columnas: «Fecha», «Comprador» (avatar, nombre, email), «Cursos» (chips: «Núcleo», «Remote Professional», «Remote Founder», «Web ABC»), «Oferta» (y « · Plazo {n}/3» si es a plazos), «Importe» (en €; «—» si no hay), «Estado».
- Píldoras de estado: «Pagado» y «Completado» (verde), «En plazos» (azul), «Sin pagar» y «Abandonado» (ámbar), «Cobro fallido» y «Reembolsado» (rojo).
- Vacíos: «Todavía no hay ningún pedido.»; sin coincidencias: «Nada coincide con los filtros.»

### Qué significa cada estado (según el webhook de Stripe)
- «Sin pagar»: se creó el pedido al iniciar el checkout y no hay pago aún.
- «Abandonado»: la sesión de pago de Stripe caducó sin pagar (se guarda el email que tecleó en la pasarela si lo dejó).
- «Pagado»: pago único cobrado.
- «En plazos»: plan de 3 plazos con algún plazo pagado y aún no todos.
- «Completado»: los 3 plazos pagados.
- «Cobro fallido»: pago diferido rechazado, factura de plazo impagada o suscripción de plazos cancelada antes de pagar todos. Si después se pone al día, el acceso se reactiva solo.
- «Reembolsado»: no he encontrado en el código dónde se asigna automáticamente este estado (no está en el webhook); no se puede afirmar cómo llega un pedido a él.

### Tareas
- Recuperar un abandono: «Para recuperar» → «Escribir» (o «Copiar email» y escribir desde otro sitio). La pantalla no registra que se haya escrito.
- Buscar un pedido: buscador + filtro.
- No se puede editar, reembolsar ni borrar pedidos desde aquí; para dar acceso a mano a quien pagó fuera de Stripe, ve a «Usuarios».

### Dónde encuentro…
- Cuánto se ha cobrado / cuánto queda de plazos → cifras de arriba.
- Quién abandonó el pago y su email → «Para recuperar».
- En qué plazo va alguien → columna «Oferta» («Plazo n/3»).
- Qué curso compró → columna «Cursos».
- Pagos fallidos → filtro «Fallidos y reembolsos».

### Relación con otras secciones
- «Usuarios»: el pago abre automáticamente el curso (matrícula activa); allí se abre o cierra a mano.
- «Comercial» / KPIs: otras vistas de ventas (fuera de este documento).

---

## Usuarios

### Ruta y acceso
- Ruta: `/admin/usuarios`. Menú: grupo «Alumnos y ventas» → «Usuarios».
- Solo el **administrador** la tiene en el menú y solo él puede ejecutar sus acciones (crear, cambiar rol, abrir/cerrar cursos): el servidor rechaza a cualquier otro rol.

### Para qué sirve
«Roles y acceso a los cursos. Un alumno sólo ve los módulos de los cursos que tiene abiertos: los abre el pago o tú, aquí.»

### Qué hay en pantalla
- Botón «+ Crear usuario» (arriba a la derecha).
- Tres cifras:
  - «Alumnos»: número de cuentas con rol alumno. Hint: «{n} con algún curso abierto».
  - «Sin acceso»: alumnos sin ninguna matrícula activa (en ámbar si hay). Hint: «Ve la pantalla de acceso pendiente». Ojo: un invitado de dry run tiene acceso al módulo por otra vía (permiso de módulo suelto), así que cuenta aquí como «Sin acceso» aunque sí puede entrar a su módulo.
  - «Equipo»: cuentas que no son alumno. Hint: «{a} profesores · {b} administradores» (los comerciales cuentan en el total de Equipo pero no en el hint).
- Buscador «Buscar por nombre o email».
- Filtro por rol con contador: «Todos», «Alumnos», «Profesores», «Comerciales», «Administradores».
- Lista, columnas «Nombre», «Rol», «Acceso» (tooltip «Pulsa un curso para abrirlo o cerrarlo.») y fecha de alta:
  - Nombre (o parte del email antes de @), email, y la píldora violeta «Tú» en tu propia fila.
  - «Rol»: desplegable «Alumno / Profesor / Comercial / Administrador». En tu propia fila está desactivado.
  - «Acceso»: para alumnos, tres interruptores: «Remote Professional», «Remote Founder», «Web ABC» (encendido = matrícula activa). Para el equipo: «Acceso total (equipo)».
  - «Alta {fecha}».
- Vacíos: «Todavía no hay usuarios.»; sin coincidencias: «Nada coincide con los filtros.»

### Tareas paso a paso
**Crear un usuario**
1. «+ Crear usuario» → ventana con «Nombre», «Email» (obligatorio) y «Rol» (por defecto «Alumno»).
2. Aviso bajo el email: «Sin contraseña: entrará con el enlace que se pide desde la página de acceso.»
3. Pulsa «Crear usuario» (pasa a «Creando…»). «Cancelar», clic fuera o Escape cierra.
4. Resultado: la cuenta se crea con el correo ya confirmado y **no se le envía ningún correo**: hay que avisar a la persona de que entre desde la página de login pidiendo su enlace. Si no pusiste nombre, se usa la parte del email antes de la @.
5. Se avisa en Slack («Nuevo usuario en el campus», con nombre, email y rol).
- Errores: «El email es obligatorio.», «Ya hay una cuenta con ese email.» u otro mensaje del sistema.

**Cambiar el rol**: elige otro en el desplegable de su fila; se guarda al momento. Si falla, vuelve al rol anterior y muestra el error. No puedes quitarte a ti mismo el rol de administrador («No puedes quitarte a ti mismo el rol de administrador.»). Efectos: un profesor/administrador ve el panel; un comercial solo su gestor comercial; un alumno no entra al panel y pasa a contar como alumno en «Respuestas».

**Abrir o cerrar un curso a un alumno** (por ejemplo, pago por transferencia o beca): pulsa el interruptor del curso. Encender crea o reactiva la matrícula; apagar la deja inactiva (no la borra, y el pedido que la abrió sigue enlazado). Error: «No se pudo cambiar el acceso.» El curso «Núcleo» no se puede abrir desde aquí («lo abre cualquier camino»).

### Dónde encuentro…
- Quién no tiene acceso a ningún curso → cifra «Sin acceso» (y filtrar por «Alumnos»).
- El rol de alguien / cambiarlo → columna «Rol».
- Qué cursos tiene abiertos → columna «Acceso».
- Cuándo se dio de alta → «Alta {fecha}».

### Problemas frecuentes
- **El nuevo usuario dice que no le ha llegado nada**: es normal; no se envía invitación. Debe ir a la página de acceso y pedir su enlace con ese email.
- **Un alumno ve la pantalla de acceso pendiente**: no tiene ningún curso abierto; enciende el interruptor del curso correspondiente.
- **No puedo cambiar mi propio rol**: está bloqueado a propósito.

### Relación con otras secciones
- «Matrículas y pagos»: los pagos abren cursos automáticamente.
- «Respuestas»: solo los usuarios con rol alumno aparecen como alumnos; los profesores asignables salen de los roles profesor/administrador.
- «Dry run»: los invitados se crean solos al reservar plaza con Google (rol alumno, con acceso solo al módulo del dry run).

---

## Dry run

### Ruta y acceso
- Lista: `/admin/dry-run`. Menú: grupo «Alumnos y ventas» → «Dry run».
- Una sesión: `/admin/dry-run/<id>` (se entra pulsando la tarjeta de la sesión).
- Otras rutas del panel: `/admin/dry-run/<id>/csv` (exportación), `/admin/dry-run/<id>/correo/<tipo>` (vista previa de un correo; con `?texto=1`, versión en texto plano).
- Solo **administrador**: cualquier otro rol que entre es redirigido a `/admin`; CSV y vistas previas devuelven «No autorizado»; todas las acciones exigen administrador.

### Para qué sirve
«Sesiones de prueba con invitados: enlaces con UTM para apuntarse gratis, acceso a un solo módulo, correos de invitación, preparación y seguimiento, y el feedback al terminar.»

### Lista de sesiones `/admin/dry-run`
- Cabecera con la píldora «Cuenta de envío: Configurado» (verde) o «Cuenta de envío: Sin configurar» (ámbar). «Configurado» exige: envío activado + usuario + contraseña guardada.
- Tarjetas de sesión (de la más reciente a la más antigua por fecha de inicio): píldora «Celebrado» (azul, ya terminó), «Abierto» (verde, inscripción abierta) o «Cerrado» (ámbar, inscripción cerrada); nombre; fecha y horario; «{a} de {b} plazas» o «{n} con plaza» si no hay límite; «Visitas: N» (suma de visitas de sus enlaces públicos); «Feedback: N».
- Sin sesiones: «Todavía no hay ninguna sesión. Crea la primera: viene rellena con la del Módulo 1.»
- «+ Nuevo dry run» (desplegable; abierto si no hay ninguna): el formulario de la sesión precargado: Nombre «Dry run · Módulo 1», Dirección «modulo-1» (vacía si ya existe), Módulo = core · 1, 21/11/2026 09:30–14:00, Docente «Isaac», agenda del Módulo 1 (09:30 Bienvenida y hora 1 · … 13:00 Hora 4 · … 14:00 Cierre), inscripción abierta. Botón «Crear dry run» → te lleva a la página de la sesión.
- «Cuenta de envío» (ver más abajo).

### Formulario de la sesión («La sesión», al final de la página de la sesión; o «+ Nuevo dry run»)
Campos:
- «Nombre» (obligatorio, máx. 140).
- «Dirección»: el slug; ayuda «activexremote.com/dry-run/<dirección>. Minúsculas, números y guiones.» No puede ser «baja».
- «Módulo»: desplegable «curso · nº · título». Es el único módulo al que tendrán acceso los invitados.
- «Docente» (por defecto «Isaac»). Si coincide con una ficha de profesorado, la página pública muestra su foto y biografía; si no, solo el nombre.
- «Empieza (hora de Madrid)» y «Termina (hora de Madrid)».
- «Enlace de Google Classroom» y «Código de la clase».
- «Enlace de la videollamada» — «Meet, Zoom… Sale en los correos de la víspera y de una hora antes, y en la preparación.»
- «Agenda» — «Una línea por tramo: «09:30 | Bienvenida y hora 1».» (máx. 3000).
- «Plazas» — «Vacío: sin límite.»
- «Acceso al módulo hasta» — «Vacío: no caduca. Se aplica a quien se apunte a partir de ahora.» (cambiarlo no modifica el acceso de quien ya tiene plaza).
- Interruptor «Inscripción abierta».
- Botón «Guardar» (editar) → «Guardado.» / «Crear dry run» (nuevo).
Validaciones y errores: «Falta el nombre.», «La dirección solo admite minúsculas, números y guiones.», «Elige el módulo.», «Revisa la fecha y la hora de inicio y de fin.», «La sesión tiene que terminar después de empezar.», «Revisa la fecha de fin del acceso.», «Las plazas tienen que ser un número entero.», «Los enlaces tienen que empezar por https://», «Ya hay un dry run con esa dirección.»
Efecto de cambiar la fecha/hora de inicio o fin: los correos **pendientes** se reprograman solos a la nueva hora (salvo invitación y bienvenida); los que ya no tienen hora (la «Vuelta por el campus» de alguien demasiado cerca de la clase) se cancelan con «sin hora tras cambiar la fecha»; y se encolan los avisos que con la nueva fecha vuelven a caber.
No hay botón para borrar una sesión en el panel.

### Página de una sesión `/admin/dry-run/<id>` — de arriba abajo

**Cabecera**: «← Todos los dry run»; nombre; fecha · docente. Botones «Página pública» (abre `/dry-run/<dirección>` en otra pestaña) y «Exportar CSV».

**Cinco cifras** (basadas en la columna «Estado» de la tabla de invitados, que lleva el equipo):
- «Total invitados» — hint «{con plaza} / {plazas} plazas» o «{n} con plaza».
- «Confirmados» (Confirmado + Asistió + No asistió) — hint «% confirmación: N %» sobre el total.
- «Pendientes» — hint «{n} invitados sin apuntar» (personas en estado del sistema «invitado», es decir, sin plaza).
- «Asistieron» — hint «NPS {n}» (o «—»). NPS = % de notas 9–10 menos % de notas 0–6, sobre los feedbacks recibidos.
- «Rechazados» — hint «{N %} preparación media» (media de pasos de preparación hechos de quien tiene plaza).

**Aviso** (si el correo no está listo): «El envío de correo no está configurado: los correos se quedan en cola hasta que lo esté. Configúralo en la página de Dry run. →»

#### «Invitados» (la tabla del equipo)
Texto: «Cada fila tiene su enlace personal con UTM. Copia la invitación, o ábrela ya escrita en WhatsApp o en el correo, y mándala tal cual: cuando la abra, reserve plaza o deje su opinión, lo verás en su fila.»

**«Conversión de las invitaciones personales»** (embudo de 5 pasos; cada uno con número, barra relativa al total y % sobre el paso anterior «del anterior»):
1. «Invitación enviada»: tiene fecha de envío (al copiar/abrir la invitación o enviarse por correo), o ya ha visitado, o ya tiene plaza.
2. «Abrió el enlace»: ha visitado su enlace personal, o tiene plaza.
3. «Reservó plaza»: tiene cuenta, fecha de reserva y no está de baja.
4. «Preparación»: con plaza y los 9 pasos hechos.
5. «Dejó su opinión»: ha enviado el feedback.

**«Por invitador»**: tabla con «Invitador», «Invitados», «Enviadas», «Abrieron», «Con plaza», «Confirmados»; una fila por invitador y «Sin invitador» al final.

**«Mensaje de invitación»** (desplegable): «El texto que se copia con cada enlace. Las marcas entre llaves se rellenan solas para cada persona.»
- Botones para insertar marcas: `{nombre}` (primer nombre del invitado), `{invitador}` (o «el equipo» si no hay), `{fecha}` (día largo), `{horario}` (HH:MM–HH:MM), `{docente}`, `{modulo}` (título del módulo), `{enlace}` (su enlace personal).
- Caja de texto (máx. 4000) con el mensaje por defecto si no hay uno propio. «Guardar mensaje» → «Mensaje guardado.»; «Volver al mensaje por defecto» (restaura el texto en la caja; hay que guardar). Si guardas el texto igual al de por defecto, se guarda como «por defecto».
- Vista previa «Así le llega a {primer invitado}» (o a «Ana Pérez» de ejemplo). Si la persona no tiene nombre, se quita la coma suelta de «¡Hola, !».
- Mensaje por defecto: «¡Hola, {nombre}! 👋 Soy {invitador}, de ActiveXRemote. El {fecha} hacemos un dry run gratuito de «{modulo}»: una clase en directo de {horario} (hora de Madrid) con {docente}… Reserva tu plaza aquí, con tu cuenta de Google (es un minuto): {enlace} ¡Te esperamos!»

**Barra de herramientas de la tabla**
- Buscador «Buscar por nombre, correo, teléfono o notas» (busca también en ID, país, perfil e invitador).
- Chips de invitador con contador: «Todos», cada invitador, y «Sin invitador» (si hay filas sin él).
- Chips de estado con contador (pulsa otra vez para quitar el filtro): «Pendiente», «Confirmado», «Rechazado», «Asistió», «No asistió».
- Sin resultados: «Nadie coincide con el filtro.»

**Columnas** (las celdas de texto se editan en el sitio y se guardan al salir de la celda; Enter guarda, Escape deshace; en Notas, Ctrl/Cmd+Enter guarda y Enter hace salto de línea; si hay error, la celda se marca en rojo con el mensaje):
- «ID»: «ALU-001», «ALU-002»… (número dentro de la sesión).
- «Nombre» (fija al hacer scroll horizontal).
- «Correo»: se valida («Ese correo no parece válido.»); no puede repetirse en la sesión («Ya hay otro invitado con ese correo en esta sesión.»); si tiene plaza no puede quedar vacío («Tiene plaza: el correo no se puede dejar vacío.»).
- «Teléfono»: solo números, espacios, +, paréntesis, puntos y guiones («El teléfono solo admite números, espacios y +.»); «00» inicial se convierte en «+».
- «País» (con sugerencias de los ya usados).
- «Invitador» (con sugerencias).
- «Estado» (desplegable de seguimiento del equipo, con color): «Pendiente» (ámbar), «Confirmado» (azul), «Rechazado» (rojo), «Asistió» (verde), «No asistió» (gris). Si la persona tiene plaza, elegir «Asistió»/«No asistió» cambia también su estado en el sistema, y cualquier otra opción la deja como «con plaza»; esto importa porque a quien está en «No asistió» **no** le llegan «Gracias y feedback» ni el «Recordatorio de feedback». Sin plaza, solo cambia la etiqueta.
- «Conversión»: cinco segmentos (los dos primeros violeta al cumplirse, los demás verdes; Preparación a medias = medio verde) y un texto con la etapa más avanzada:
  - «Sin enviar»
  - «Enviada por {WhatsApp|correo|mensaje} · {fecha hora}»
  - «Abrió el enlace {n}× · {última visita}»
  - «Plaza reservada · {fecha}»
  - «Preparación {a}/{9}»
  - «Feedback · NPS {n}»
  - y, añadido al final, « · No quiere correos» si se dio de baja de los correos.
- «Perfil», «Notas» (texto libre; notas hasta 2000 caracteres).
- Última columna, acciones de envío:
  - «Copiar invitación»: copia el mensaje con su enlace (vía «mensaje») → «¡Copiada!» y marca la invitación como enviada por «mensaje».
  - Icono WhatsApp «Abrir en WhatsApp»: abre wa.me con el mensaje ya escrito y la marca como enviada por WhatsApp. Desactivado si no hay teléfono válido (mín. 8 dígitos, con prefijo de país): «Añade su teléfono para mandarlo por WhatsApp».
  - Icono sobre «Abrir en el correo»: abre tu cliente de correo con asunto «Te invito a la clase de prueba de ActiveXRemote» y el mensaje; la marca como enviada por correo. Desactivado sin correo: «Añade su correo para mandarlo por correo».
  - «⋯» («Más»): «Copiar solo el enlace» («Enlace copiado»; también marca enviada por «mensaje»); «Quitar plaza y correos» (solo si tiene cuenta y no está de baja; sin confirmación); «Eliminar fila» → hay que pulsar otra vez («Pulsa otra vez para eliminar»).
  - Importante: «marcar como enviada» lo hace el panel cuando pulsas el botón; no comprueba que de verdad la mandaste.
- Fila nueva al final («+»): «Nombre y apellidos», correo, teléfono («+34 …»), país, invitador (por defecto tu nombre de pila), estado (por defecto «Pendiente») y botón «+ Añadir» («Guardando…»). Requiere al menos nombre, correo o teléfono («Pon al menos el nombre.»). **Añadir una fila no envía nada.**

**El enlace personal de cada fila**: `activexremote.com/dry-run/<dirección>?inv=<token>&utm_source=<whatsapp|email|directo>&utm_medium=invitacion_personal&utm_campaign=<dirección_con_guiones_bajos>&utm_content=alu_007&utm_term=<invitador>`. El token hace que la reserva caiga en su fila aunque entre con otra cuenta de Google.

**«Pegar filas desde una hoja de cálculo»** (desplegable)
- «Una persona por línea y las columnas en este orden: nombre, correo, teléfono, país, invitador, estado, perfil, notas. Se puede copiar y pegar directamente desde Google Sheets o Excel; la columna de ID y la cabecera se ignoran.»
- Separador: tabulador (lo que da copiar de una hoja); si no hay tabuladores, coma o punto y coma. Una primera columna «ALU-…» se ignora; una línea que empiece por «nombre» se toma como cabecera y se salta.
- Estado admitido: pendiente, confirmado, rechazado, asistio/asistió, no asistio/no asistió (otro valor → Pendiente).
- Máximo 300 filas por tanda («Como mucho 300 filas por tanda.»).
- Resultado: «{n} añadidos.» y «{n} saltados (correo repetido o fila vacía).» (también se saltan filas con correo o teléfono inválidos).
- **Importar no envía ningún correo.**

#### «Enlaces de invitación» (enlaces públicos con UTM)
Texto: «Uno por canal o por persona que lo comparte. Cada enlace lleva sus UTM y un ?ref= que lo identifica aunque se pierdan las UTM al compartirlo.»
- Tabla: «Nombre del enlace» (con la URL), «UTM» (source / medium; debajo campaign · content · term), «Visitas», «Con plaza» (personas con plaza atribuidas a ese enlace), «Conversión» (con plaza / visitas), y botones «Copiar» («Copiado») y «Desactivar»/«Activar». Los desactivados se ven atenuados. Vacía: «Todavía no hay enlaces.»
- Visitas: suman solo visitas humanas (se descartan robots) y **solo si el enlace está activo**. Un enlace desactivado sigue llevando a la página y su ?ref= sigue atribuyendo la plaza, pero ya no suma visitas.
- **«Nuevo enlace»** (generador):
  1. «¿Dónde lo vas a compartir?»: «LinkedIn · publicación» (linkedin/social), «LinkedIn · mensaje» (linkedin/mensaje), «WhatsApp · chat» (whatsapp/mensaje), «WhatsApp · grupo» (whatsapp/comunidad), «Email personal» (email/email), «Newsletter» (newsletter/email), «Instagram», «X», «Facebook» (…/social), «Slack / comunidad», «Telegram» (…/comunidad), «QR / presencial» (qr/presencial). Un ✓ indica que esa persona ya tiene ese canal.
  2. «¿Quién lo comparte?» (por defecto tu nombre; sugerencias de quien ya comparte). «Va en utm_content: así ves quién trae a cada persona. Vacío si es de la marca.»
  - Vista previa del nombre («LinkedIn · publicación · Oriol») y la URL. Si ya existe uno igual: «Ya hay un enlace igual: se creará otro con un número detrás.»
  - «Ajustar a mano»: «Nombre del enlace», «utm_source», «utm_medium», «utm_campaign» (por defecto la dirección con guiones bajos), «utm_content», «ref». Los valores se normalizan (minúsculas, sin tildes, «_»). Si el ref ya existe en cualquier sesión, se le añade «-2», «-3»…
  - «Crear y copiar enlace» → «Creado y copiado: …» (o «Enlace creado:» + «Copiar» si el navegador no deja copiar).
  - «Paquete básico (LinkedIn, mensaje, WhatsApp y email)»: crea de golpe los que falten para esa persona entre LinkedIn · publicación, LinkedIn · mensaje, WhatsApp · chat y Email personal → «Creados {n} enlaces.» o «Ya tienes todos los del paquete básico para esta persona.»
  - Errores: «Ponle nombre al enlace.», «utm_source y utm_medium son obligatorios.»
- No se pueden borrar enlaces, solo desactivar.

#### «Invitar por correo»
Texto: «Un correo por línea, con nombre si quieres: «Ana Pérez <ana@correo.com>». A cada persona le llega la invitación con su enlace personal y, si no se apunta, un recordatorio cuatro días antes.»
1. Pega las direcciones (una por línea o separadas por «;»). Se acepta «Nombre <correo>», «correo, Nombre» o solo el correo; los duplicados se ignoran.
2. «Atribuir a»: «Correo directo (email / invitacion)» o uno de los enlaces activos (para que la reserva cuente para ese enlace).
3. «Enviar invitaciones».
- Límites/errores: «No hay ningún correo válido.», «Como mucho 300 por tanda.»
- Qué hace: crea una fila por persona nueva (invitador = tu nombre de pila; estado del sistema «invitado»; marcada como enviada por correo), encola la «Invitación» para ya y el «Recordatorio de invitación» para 4 días antes a las 10:00, y lanza el envío inmediatamente. Personas que ya estaban en la tabla **sin plaza, sin baja y sin una invitación enviada con éxito** (por ejemplo, añadidas a mano o cuya invitación falló) también la reciben. A quien ya la recibió, tiene plaza o se dio de baja no se le vuelve a escribir.
- Resultado: «{n} invitaciones en cola.» y «{n} ya tenían la invitación enviada, plaza o se dieron de baja.»
- Nota: en el código existe una acción de «Reenviar invitación» (también quita la baja de correos), pero **no hay ningún botón en el panel que la use**. Para reenviar a alguien cuya invitación falló o no salió, vuelve a meter su correo en «Invitar por correo»; si ya salió con éxito, no se reenvía desde aquí (usa «Copiar invitación» / WhatsApp / correo desde la tabla).

#### «Correos» (la secuencia)
Texto: «La secuencia de cada persona. La hora se calcula con la fecha de la sesión; si la cambias, lo pendiente se reprograma solo.»
- Botón «Enviar lo pendiente ahora» → «{a} enviados, {b} omitidos, {c} con error.» o «El envío de correo no está configurado.». Procesa hasta 100 correos ya vencidos de la cola (de todas las sesiones, no solo esta). No adelanta correos programados para el futuro.
- Tabla: «Correo» (nombre y para quién: «invitados» o «con plaza»), «Cuándo», «Sale» (fecha y hora fija calculada; «—» para los que dependen de cada persona), «Enviados · en cola · omitidos · error» (cuatro cifras; «en cola» incluye los que se están enviando; «omitidos» incluye cancelados), y botones «Ver» (vista previa en otra pestaña, a tu nombre, con el asunto y el preheader arriba) y «Enviarme una prueba» (te la manda a tu correo con «[Prueba]» delante del asunto → «Prueba enviada a {correo}.»).

Los 10 correos y cuándo salen (hora de Madrid):
| Correo | Para | Cuándo | Asunto («ActiveXRemote · …») |
|---|---|---|---|
| «Invitación» | invitados | «Al invitar desde el panel» (en el momento) | «Te invitamos al dry run del Módulo {n} · {día}» |
| «Recordatorio de invitación» | invitados | «4 días antes, 10:00, si no se ha apuntado» | «Quedan pocos días para el dry run del {día}» |
| «Enlace de la clase» | con plaza | «A mano, al publicar el enlace de Meet» (no sale sola; se mandó el 19 nov. 2026 a todos los que tenían plaza) | «El enlace de la clase del {día}» |
| «Bienvenida y primeros pasos» | con plaza | «Al confirmar la plaza» (en el momento) | «Tu plaza está confirmada: ya puedes entrar al campus» |
| «Vuelta por el campus» | con plaza | «Al día siguiente, 10:00 (si quedan más de 3 días)» | «Cómo sacarle partido al campus en diez minutos» |
| «Material previo» | con plaza | «7 días antes, 10:00» | «Falta una semana: empieza por el material previo» |
| «Checklist para la clase» | con plaza | «2 días antes, 10:00» | «Tu checklist para el {día}» |
| «Víspera» | con plaza | «El día antes, 18:00» | «Mañana a las {hora}: dry run del Módulo {n}» |
| «Empezamos en una hora» | con plaza | «1 hora antes» | «Empezamos en una hora» |
| «Gracias y feedback» | con plaza | «30 minutos después de terminar» | «Gracias por venir. ¿Nos cuentas qué te ha parecido?» |
| «Recordatorio de feedback» | con plaza | «2 días después, 10:00, si no lo ha dejado» | «¿Nos regalas tres minutos? Tu opinión del dry run» |

Contenido resumido: la invitación y su recordatorio llevan los datos de la sesión (cuándo, online en Google Classroom, docente, módulo, «Gratis») y el botón «Reservar mi plaza» con su enlace personal. La bienvenida: primeros pasos (preparación, unirse a Classroom con código, guardar la fecha, empezar por «Antes de la clase»), botón «Ir a mi preparación» y enlaces «Añadir a Google Calendar» y «Descargar evento (.ics)». La vuelta por el campus: dónde está cada cosa y botón «Entrar al módulo». Material previo: qué hacer si solo tienes una hora y botón «Abrir el material previo». Checklist: lista de comprobación, agenda y «Ver mi preparación». Víspera y una hora antes: enlace de la clase y botón «Entrar a la clase» (videollamada) o, si no hay, «Abrir Google Classroom», o «Ver mi preparación». Gracias y recordatorio de feedback: botón «Dejar mi feedback» (`/preparacion#feedback`). Con el campo «Enlace de Google Meet» de la sesión relleno, **todos los correos de antes de la clase llevan el enlace de Meet** (en los datos de la sesión, en una nota o en el checklist), el campus enseña el botón «Entrar a la clase (Meet)» en el aviso de la portada y en `/preparacion`, y el calendario (.ics y Google Calendar) lo lleva como ubicación. El correo «Enlace de la clase»: fecha, enlace, botón «Entrar a la clase», enlaces de calendario y «Ver mi preparación». Todos llevan enlace de baja (y cabecera List-Unsubscribe) y UTM (`utm_source=email`, `utm_medium=dry-run`, `utm_content=<tipo>`).

Cómo funciona la cola (lo que pasa por detrás):
- **Encolar** = apuntar qué correo toca y a qué hora (uno de cada tipo por persona; volver a encolar no duplica). **Enviar** lo hace un proceso que corre cada **5 minutos** (pg_cron de Supabase llama a `/api/cron/correos`, solo si hay algo vencido), y además justo después de invitar o de reservar plaza, para que la invitación y la bienvenida salgan al momento. Este cron no está en vercel.json.
- Al reservar plaza se encola la secuencia «con plaza» **solo con lo que aún está a tiempo** (y solo los tipos que esa persona aún no tenga en la cola: los que se le cancelaron antes, p. ej. al quitarle la plaza, no se vuelven a encolar): quien se apunta la víspera recibe bienvenida, víspera y aviso de una hora, no el «falta una semana». Y se cancelan su invitación y recordatorio pendientes («ya tiene plaza»).
- Justo antes de enviar se vuelve a comprobar; si no toca, queda **omitido** con uno de estos motivos:
  - «se ha dado de baja» (se dio de baja de los correos o su estado es Baja);
  - «ya tiene plaza» (correo de invitados a alguien que ya reservó);
  - «no tiene plaza» (correo de plaza a alguien sin plaza);
  - «la clase ya ha empezado» (recordatorio de invitación, vuelta por el campus, material previo, checklist, víspera o una hora, una vez empezada la clase);
  - «llegó tarde» (vuelta por el campus, material previo, checklist o víspera con más de 12 h de retraso, p. ej. porque la cola estuvo parada o sin configurar);
  - «no vino a la clase» (gracias/feedback a alguien marcado «No asistió»);
  - «ya dejó su opinión» (recordatorio de feedback);
  - «sin correo» (fila sin correo, p. ej. añadida solo con teléfono).
- **Cancelados** (cuentan en la cifra de omitidos): «ya tiene plaza», «baja desde el panel» (Quitar plaza y correos), «se dio de baja», «ya dejó su opinión», «sin hora tras cambiar la fecha», «invitado o tipo desconocido», «la sesión ya no existe».
- **Error**: si el servidor de correo falla, se reintenta hasta 3 intentos en total (a los 10 y luego 20 minutos); al tercer fallo queda en «error» con el mensaje del servidor. Un envío que se quedó colgado más de 15 minutos vuelve a pendiente.
- Si la cuenta de envío no está configurada, nada sale: todo se queda «en cola» hasta configurarla (y lo que entonces llegue con más de 12 h de retraso se omitirá por «llegó tarde»).
- Cuando sale con éxito una invitación o su recordatorio, la fila de la tabla queda marcada como «Enviada por correo» si aún no lo estaba.
- El panel muestra solo los recuentos por tipo; no hay vista por persona de sus correos ni de los motivos (el motivo se guarda en la base de datos; aparece en el CSV solo indirectamente).

#### «Feedback»
- Si no hay: «Todavía no ha llegado ninguno.»
- Medias sobre 5 de «Dinámica de clase», «Ritmo», «Contenido», «Docente», «Campus», y «¿Lo haría?» como «Sí/Quizá/No» (recuentos, p. ej. «4/2/1»).
- Una tarjeta por persona: nombre (o correo, o ALU-…), píldora violeta «{nps}/10», y si los dejó: «Lo que más le sirvió», «Lo que cambiaría», «Otros comentarios».
- El invitado lo rellena en `/preparacion#feedback`, que se abre **cuando empieza la clase** (antes ve «El formulario se abre cuando empiece la clase…»). Preguntas: recomendación 0–10 (obligatoria), cinco valoraciones de 1 a 5 (dinámica de la clase, ritmo y duración, contenido, docente, campus), «Si el curso completo estuviera abierto, ¿lo harías?» (Sí/Quizá/No) y tres textos. Puede reenviarlo: cuenta el último. Al enviarlo se cancela su recordatorio de feedback y se avisa en Slack («Feedback nuevo del dry run»).

#### Exportar CSV
«Exportar CSV» descarga `dry-run-<dirección>.csv` (UTF-8 con BOM para Excel; las celdas que empiezan por =, +, - o @ se protegen con un apóstrofo). Columnas: id, nombre, email, telefono, pais, invitador, seguimiento (estado del equipo), perfil, notas, invitacion_enviada, enviada_por, visitas, ultima_visita, estado (estado del sistema: invitado/registrado/asistio/no_asistio/baja), enlace (nombre del enlace público), utm_source…utm_term, invitado (fecha de invitación), apuntado (fecha de reserva), preparacion (nº de pasos), paso_cuenta, paso_classroom, paso_calendario, paso_material, paso_ficha, paso_test, paso_estudio, paso_equipo, paso_asistente (1/0), nps, clase, ritmo, contenido, docente, campus, lo_haria, lo_que_sirvio, cambiaria, comentario, sin_correos (1/0).

#### «Cuenta de envío» (en `/admin/dry-run`, abajo)
Texto: «Los correos salen por SMTP de Google Workspace. Usa admin@activexremote.com con una contraseña de aplicación (Cuenta de Google → Seguridad → Verificación en dos pasos → Contraseñas de aplicación).»
- Interruptor «Envío activado».
- «Usuario» (por defecto admin@activexremote.com), «Contraseña de aplicación» (nunca se muestra; «Guardada (termina en XXXX). Déjalo vacío para no cambiarla.» o «Sin guardar.»; los espacios se quitan solos).
- «Nombre del remitente» (por defecto «ActiveXRemote»), «Correo del remitente» («Vacío: el del usuario.»).
- «Servidor SMTP» (smtp.gmail.com), «Puerto» (465; error «Puerto no válido.»), «Responder a».
- «Enviarme un correo de prueba» (asunto «Prueba de envío · ActiveXRemote», a tu correo → «Prueba enviada a {correo}.») y «Guardar» («Guardado.»). Nota: la prueba usa los ajustes **guardados**, no lo que tengas escrito sin guardar.
- Esta misma cuenta envía también los avisos de corrección de «Respuestas».

### Estados del invitado (dos capas)
- **Estado del sistema** (no se ve como columna en la tabla; sí en el CSV como «estado»): «invitado» (sin plaza), «registrado» (con plaza), «asistio», «no_asistio» (los tres últimos = con plaza) y «baja».
- **Estado del equipo** (columna «Estado»): Pendiente / Confirmado / Rechazado / Asistió / No asistió. Al reservar plaza, si estaba en Pendiente o Rechazado pasa solo a Confirmado.
- «Quitar plaza y correos» pone el estado del sistema en baja: le quita el acceso al módulo (si se lo dio este dry run) y cancela sus correos pendientes. La columna «Estado» del equipo no cambia sola. En el panel no hay botón para devolverle la plaza (la lógica existe en el código pero ninguna pantalla la ofrece). Lo que sí funciona: la persona puede volver a reservar desde su enlace; su misma fila vuelve a «con plaza», y recupera el acceso al módulo, siempre que la inscripción esté abierta, la sesión no haya terminado y queden plazas.
- «Eliminar fila» borra la fila y sus correos, y el acceso al módulo si se lo dio este dry run.

### Lo que ve el invitado (solo lo necesario para entender el panel)
- **Página pública `/dry-run/<dirección>`** (no indexada): datos de la sesión, agenda, lecciones del módulo, docente, preguntas frecuentes y un único botón «Reservar mi plaza gratis» (con Google). Si llega con su enlace personal (`?inv=`), se le saluda por su nombre y la visita suma en su fila; con `?ref=` suma en el enlace público (solo humanos).
  - El botón solo aparece si la inscripción está abierta, la sesión no ha terminado y quedan plazas; si ya tiene plaza: «✓ Ya tienes tu plaza.» + «Ir a mi preparación».
  - Mensajes posibles: plazas agotadas («Las plazas se han agotado justo ahora. Escríbenos a admin@activexremote.com…»), «La inscripción a esta sesión está cerrada.», «No hemos podido guardar tu plaza…», «Esta sesión ya no existe.», «No hemos podido conectar con Google…».
- **Reserva**: entra con Google → se busca su fila por este orden: la del token de su enlace personal (aunque entre con otra cuenta de Google), su usuario o su correo; si no hay, se crea una fila nueva (estado Confirmado, origen = el enlace/UTM con que llegó). Se le da acceso solo al módulo del dry run (hasta «Acceso al módulo hasta», o sin caducidad), se encola su secuencia, sale la bienvenida al momento, se avisa en Slack («Nueva plaza en el dry run», con origen) y se le lleva a `/preparacion`. Si entra con otra cuenta distinta de la invitada, los correos van a la cuenta con la que entró (salvo que esa dirección ya tenga otra fila). La cuenta se crea con rol alumno.
- **`/preparacion`**: cuenta atrás, agenda, enlaces y la lista de 9 pasos que el panel cuenta como «Preparación x/9»: «Entra al campus con tu cuenta de Google» (auto), «Únete a la clase de Google Classroom» (manual), «Guarda la fecha en tu calendario» (manual), «Mira todo el material previo» (auto, al abrir todos los enlaces de la lección «Antes de la clase»), «Rellena tu ficha de presentación» (auto al enviarla), «Haz el Test de Punto de Partida» (auto al enviarlo), «Lee el estudio sobre la penalización del remoto» (auto al abrirlo desde el campus), «Prueba cámara, micrófono y conexión» (se marca si la prueba del campus va bien), «Hazle una pregunta al asistente» (auto). Varios automáticos se guardan cuando el invitado abre /preparacion, así que el panel puede ir por detrás hasta que la visite. Desde que empieza la clase, aquí está el formulario de feedback.
- **Baja de correos** `/dry-run/baja?t=<token>`: «¿Dejar de recibir estos correos?» y un botón (no basta con abrir el enlace, para que los antivirus no den de baja a nadie). Solo quita los correos (cancela los pendientes con «se dio de baja»); no quita la plaza ni el acceso. En la tabla se ve « · No quiere correos».

### Dónde encuentro…
- Cuántos tienen plaza / plazas libres → tarjeta de la sesión en la lista, o cifra «Total invitados» (hint).
- Quién ha abierto su invitación y cuántas veces → columna «Conversión» («Abrió el enlace n×»).
- Quién trae más gente → «Por invitador» y, para enlaces públicos, columnas «Visitas»/«Con plaza»/«Conversión» de «Enlaces de invitación».
- Desde qué canal llegó cada persona → CSV (utm_* y «enlace»).
- Cuánta preparación lleva cada uno → «Conversión» («Preparación a/9») o la ficha del alumno en «Respuestas»; el detalle paso a paso, en el CSV (paso_*).
- Cuántos correos de cada tipo han salido, están en cola, omitidos o con error → tabla «Correos».
- Cómo se ve un correo → «Ver»; recibirlo → «Enviarme una prueba».
- El NPS y las opiniones → cifra «Asistieron» (hint NPS) y bloque «Feedback».
- Si el correo está configurado → píldora «Cuenta de envío» en la lista de dry runs.
- El enlace público de la sesión → botón «Página pública».

### Problemas frecuentes
- **La fila dice «Sin enviar»**: nadie ha pulsado «Copiar invitación», WhatsApp, correo ni «Copiar solo el enlace», no se ha invitado por correo y la persona no ha visitado su enlace. Las filas añadidas a mano o importadas empiezan así. Cuando la invitación (o su recordatorio) sale por correo desde la cola, la fila pasa sola a «Enviada por correo» con la hora real del envío, aunque la persona ya estuviera en la tabla. Solución: usa uno de los botones de la fila, o mete su correo en «Invitar por correo»; si la invitaste por correo hace un momento, recarga la página.
- **Correos «en cola» que no salen**: (1) la cuenta de envío no está configurada o el interruptor «Envío activado» está apagado → configúrala y pulsa «Enviar lo pendiente ahora»; (2) todavía no es su hora (la columna «Sale» dice cuándo); (3) el cron pasa cada 5 minutos: espera o pulsa «Enviar lo pendiente ahora».
- **Muchos «omitidos»**: es normal y deseable: son correos que ya no tocaban (ya tiene plaza, baja, clase empezada, no asistió, ya dejó opinión, llegó tarde, sin correo). Si son «llegó tarde», la cola estuvo parada más de 12 h (normalmente, sin cuenta de envío).
- **Correos con «error»**: el servidor SMTP rechazó el envío tres veces. Revisa usuario y contraseña de aplicación con «Enviarme un correo de prueba». Los que quedaron en error no se reintentan solos.
- **«Todavía no ha entrado al campus: tiene que reservar la plaza desde su enlace.»**: no se puede dar plaza a mano; la persona debe reservar con Google desde su enlace.
- **La visita de un enlace público no suma**: el enlace está desactivado o la visita era de un robot.
- **El invitado no ve las lecciones**: antes de la hora de inicio solo está abierta la primera lección del módulo («Antes de la clase»).
- **Reenviar una invitación ya enviada**: no hay botón; usa «Copiar invitación», WhatsApp o «Abrir en el correo» desde la fila.
- **No se puede desmarcar la baja de correos de alguien** desde el panel (la acción existente que lo haría no tiene botón).

### Relación con otras secciones
- «Respuestas»: los invitados con plaza aparecen como alumnos; su preparación y sus lecciones cerradas se ven en la matriz y la ficha. La «Ficha de presentación» y el «Test de Punto de Partida» enviados en el campus marcan pasos de la preparación.
- «Usuarios»: cada invitado que reserva es una cuenta de rol alumno; en «Usuarios» aparecerá en «Sin acceso» porque su acceso es al módulo suelto, no a un curso.
- «Slack»: avisos de nueva plaza y de nuevo feedback.
- La cuenta de envío configurada aquí la usan también los avisos de corrección de «Respuestas».
