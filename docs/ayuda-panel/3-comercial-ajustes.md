# Manual del panel · Parte 3: el panel en sí, Gestor comercial y Ajustes (IA, Conexiones con Claude, Slack, correo)

Todo lo que sigue sale del código del campus. Cuando algo no se puede saber desde el código, se dice.

---

## El panel en sí: menú lateral, caja de usuario, idioma y móvil

### Ruta y quién entra
- El panel vive en `/admin`. Entran solo los roles **Administrador**, **Profesor** y **Comercial**. Si no hay sesión, se manda a `/login`. Un **Alumno** que intente entrar vuelve a `/` (el campus): los alumnos nunca ven el panel.
- **Comercial**: solo puede estar en `/admin/comercial` y sus subpáginas. Si abre cualquier otra ruta del panel (por ejemplo `/admin` o `/admin/usuarios`), se le redirige a `/admin/comercial`, que a su vez lleva a **Material de apoyo**. Si entra al campus (`/`), también se le manda a `/admin/comercial`: no tiene clases que ver.

### El menú lateral, por rol (etiquetas exactas en español)

**Administrador** ve todo, en este orden:

| Grupo | Elemento (icono) | Ruta |
|---|---|---|
| (sin título) | Resumen | `/admin` (solo se marca en esa ruta exacta) |
| Formación | Manual del profesor | `/admin/manual` |
| Formación | Módulos y lecciones | `/admin/modulos` |
| Formación | Tareas | `/admin/tareas` |
| Formación | Respuestas | `/admin/respuestas` |
| Formación | Guía docente | `/admin/guia-profesores` |
| Formación | Asistente | `/admin/asistente` |
| Alumnos y ventas | Matrículas y pagos | `/admin/matriculas` |
| Alumnos y ventas | Usuarios | `/admin/usuarios` |
| Alumnos y ventas | Dry run | `/admin/dry-run` |
| Comercial | Material de apoyo | `/admin/comercial/material` |
| Comercial | Calculadora | `/admin/comercial/calculadora` |
| Comercial | Playbook | `/admin/comercial/playbook` |
| Comercial | KPIs de ventas | `/admin/comercial/kpis` (solo administración) |
| Marketing | Publicaciones (con apartados) | `/admin/publicaciones` |
| Marketing | Banners (con apartados) | `/admin/banners` |
| Ajustes | Inteligencia artificial | `/admin/ia` |
| Ajustes | Conexiones con Claude | `/admin/conexiones` |
| Ajustes | Slack | `/admin/slack` |

- **Publicaciones** y **Banners** tienen apartados que solo se despliegan cuando estás dentro de esa sección:
  - Publicaciones: Resumen · Por revisar · Calendario · Nevera · + Nueva publicación.
  - Banners: Campañas · Galería · Clonador · Normas de Meta · + Nueva campaña.
  - Dentro de una sección, se marca el apartado más concreto que coincide con la ruta.
- **Insignias (badges)**, solo para administración:
  - En **Publicaciones** y en su apartado **Por revisar**: número en tono de alerta = publicaciones (canales) en estado borrador o error, es decir, lo que espera tu decisión o ha fallado al salir.
  - En el apartado **Nevera**: número neutro = canales guardados en la nevera (listos, sin fecha).
  - Si el número es 0, no sale insignia.

**Profesor** ve solo: **Resumen** y el grupo **Formación** (Manual del profesor, Módulos y lecciones, Tareas, Respuestas, Guía docente, Asistente). No ve Alumnos y ventas, Comercial, Marketing ni Ajustes. Si escribe a mano la ruta de una página del grupo Comercial, se le devuelve a `/admin`; las páginas de IA, Conexiones y Slack también le devuelven a `/admin`.

**Comercial** ve solo el grupo **Comercial** con tres elementos: Material de apoyo, Calculadora y Playbook. **KPIs de ventas no aparece** para este rol y, si escribe la ruta, se le devuelve a `/admin/comercial`.

### Cabecera del menú
- Logotipo ΔX con el texto **ActiveXRemote** (enlace a `/admin`; para el rol comercial acaba en Material de apoyo) y la etiqueta **Panel**.

### Caja de usuario (pie del menú)
- Un círculo con tus iniciales, tu nombre (o tu email si no tienes nombre) y debajo tu rol: **Administrador**, **Profesor** o **Comercial**.
- **Selector de idioma**: dos botones, **ES** y **EN**. El activo está deshabilitado. En el panel el idioma no va en la URL: se guarda en una cookie y la página se refresca. Cambia los textos de la interfaz; el material comercial y el playbook están siempre en español.
- **Ver el campus**: enlace a `/` (el campus de alumnos). Para el rol comercial, el campus le vuelve a mandar al gestor comercial.

### En el móvil (pantallas de 900 px o menos)
- Arriba sale una barra con el botón de menú («Abrir el menú») y el logotipo.
- El menú es un cajón que se abre desde ese botón. Se cierra con la X («Cerrar el menú»), tocando el fondo oscuro, con la tecla Escape o solo al navegar a otra página.

### Dónde encuentro…
- Mi rol: en la caja de usuario, debajo de mi nombre.
- Cómo cambio el idioma del panel: botones ES/EN del pie del menú.
- Por qué no veo un elemento del menú: depende del rol (tablas de arriba). Los roles se cambian en Alumnos y ventas → Usuarios (solo administración).

---

## Gestor comercial (`/admin/comercial`)

### Qué es y quién lo usa
- **Para qué sirve**: lo que el equipo comercial necesita además de Zoho: los dosieres para mandar a los leads, la calculadora de plazos, el playbook comercial y, solo para administración, los KPIs de ventas.
- **Los leads no se gestionan en el panel**: se llevan en **Zoho CRM**. En el panel no hay fichas de leads, ni lista de leads, ni pipeline editable.
- **Quién entra**: **Comercial** y **Administrador** (material, calculadora y playbook). **KPIs de ventas**: solo **Administrador**. El **Profesor** no entra (se le devuelve a `/admin`).
- `/admin/comercial` a secas no tiene contenido: redirige a **Material de apoyo**.
- Desde el menú: grupo **Comercial**.

### Material de apoyo (`/admin/comercial/material`)
- Menú: **Comercial → Material de apoyo**.
- **Para qué sirve**: descargar los dosieres del curso en PDF para mandarlos a cada lead después de hablar con él (por correo o WhatsApp).
- **En pantalla**:
  - Título **Material de apoyo** y la entradilla «Los dosieres del curso para mandar a cada lead después de hablar con él: el del curso completo y uno por camino…».
  - Tres tarjetas, cada una con portada (pulsable, descarga el PDF), una línea «para quién», el título, una descripción y el botón **Descargar PDF**:
    1. **El curso completo** — «Para quien aún no sabe qué camino elegir». Qué es ActiveXRemote, clases y campus, núcleo común, los dos caminos, acreditación de Deel, qué incluye la matrícula e inversión. Se descarga como `ActiveXRemote-El-curso-completo.pdf`.
    2. **Remote Professional** — «Para quien quiere un empleo remoto con empresas de fuera». Se descarga como `ActiveXRemote-Remote-Professional.pdf`.
    3. **Remote Founder** — «Para freelancers y founders que quieren vender fuera». Se descarga como `ActiveXRemote-Remote-Founder.pdf`.
  - Una cuarta tarjeta **Uso interno · Para ti, no para mandar.**: **Playbook comercial**, con botón **Descargar PDF** (el PDF del playbook; no se manda a leads).
  - Consejo al pie: «Manda el dosier del camino que encaja con su objetivo. Si aún no lo tiene claro, el del curso completo. Y siempre con dos líneas tuyas que conecten con lo que te ha contado.»
- **Por detrás**: los PDF y portadas no son públicos; los sirve el panel solo a quien tiene rol comercial o administrador (sin sesión: 401; otro rol: 403). Se generan fuera del panel con un script (`scripts/decks-comerciales.mts`) y se guardan en la carpeta privada del proyecto; **desde el panel no se pueden subir ni editar**.
- **Problemas**: si un dosier está desactualizado o falta, hay que regenerarlo con el script y volver a desplegar (tarea técnica). Un enlace de descarga copiado y abierto por alguien sin sesión de comercial/admin no funciona.

### Calculadora de plazos (`/admin/comercial/calculadora`)
- Menú: **Comercial → Calculadora**.
- **Para qué sirve**: dar los precios de salida, las cuotas con sus fechas y un mensaje con las condiciones listo para copiar y mandar o pegar en Zoho. Útil en una llamada.
- **Precios que usa** (fuente única para la calculadora, el playbook y sus mensajes):
  - **Un curso**: **1.990 €** pago único · **2.190 €** a plazos (200 € más). De **2 a 6** cuotas.
  - **Los dos cursos** (Remote Professional y Remote Founder): **2.790 €** pago único · **2.990 €** a plazos (200 € más). De **2 a 10** cuotas.
  - A plazos siempre se paga más que al contado: nunca se anuncia «sin intereses».
- **Controles**:
  - **Qué se lleva**: **Un curso** / **Los dos cursos** (cada botón enseña su precio al contado).
  - **Forma de pago**: **Pago único** / **A plazos** (cada uno con su total). Por defecto, A plazos.
  - Solo a plazos:
    - **Número de cuotas**: botones de 2 a 6 (un curso) o de 2 a 10 (los dos). Por defecto, 3. Si tenías 8 o más con los dos cursos y pasas a un curso, se queda en 6.
    - **Primer cargo**: fecha; por defecto hoy (hora de Madrid) y no se puede elegir una anterior a hoy. Si la borras, vuelve a hoy.
- **Resultado**:
  - **Total** y, a plazos, **Cada cuota** (si la primera es distinta, debajo «1.ª: …»).
  - Una línea: con pago único «Al contado se ahorra 200 €.»; a plazos «A plazos son 200 € más que al contado.».
  - Tabla **Calendario de pagos** (Cuota · Fecha · Importe): una cuota al mes, el mismo día del mes que el primer cargo (o el último día del mes si ese día no existe).
  - **Cómo se reparten las cuotas**: iguales, redondeadas hacia abajo a múltiplos de 5 céntimos, y lo que sobra va en la primera. Con 2.190 €: 2 → 1.095 €; 3 → 730 €; 4 → 547,50 €; 5 → 438 €; 6 → 365 €. Con 2.990 € en 10 → 299 €; en 3 → la primera de 996,70 € y dos de 996,65 €.
  - **Aviso de fin de curso** (solo con **un curso**): si el último cargo cae después del **21 de febrero de 2027** (último día del curso), sale «El último cargo llega después de que termine el curso (21 de febrero de 2027). Confírmalo con el equipo antes de ofrecerlo.» y esas filas se marcan en la tabla. Con los dos cursos no se avisa: el pago se alarga a propósito.
- **Mensaje**:
  - Campo **Su nombre (opcional)** (máx. 60 caracteres; ejemplo «Laura»). Con nombre, el mensaje empieza «Hola, Laura.»; sin él, «Hola.».
  - Pago único: condiciones con el importe, «Un solo cargo con tarjeta, por Stripe, y su factura» y la alternativa a plazos («hasta en 6 cuotas» o «hasta en 10 cuotas»).
  - A plazos: total, resumen de cuotas, «Un cargo al mes con tarjeta, por Stripe, y su factura de cada pago», la lista numerada de fechas e importes y el cierre con el precio al contado y lo que se ahorra.
  - Botón **Copiar** (pasa a **Copiado** un par de segundos). Si el navegador no deja copiar, no pasa nada visible: selecciona el texto a mano.
- **Por detrás**: todo se calcula en el navegador. **No crea ningún pago, no genera enlace de Stripe ni guarda nada en Zoho**. El cobro real lo prepara el equipo (según el playbook: al decir que sí, se marca como inscrito en Zoho y el equipo envía el enlace de pago).
- **Ojo**: estos son los precios del equipo comercial. La web y Stripe tienen su propio catálogo aparte; si un precio cambia, debe cambiarse en los dos sitios (tarea técnica).

### Playbook comercial (`/admin/comercial/playbook`)
- Menú: **Comercial → Playbook**.
- **Para qué sirve**: la guía de venta: qué vendemos, a quién, cómo detectar el interés, cómo despertarlo en quien duda y lo que nunca decimos. Versión: **Noviembre de 2026** (sale junto a la entradilla).
- **En pantalla**:
  - Botón **Descargar PDF** arriba a la derecha (descarga `ActiveXRemote-Playbook-Comercial.pdf`).
  - Columna **Contenido** (índice numerado 01–12; cada entrada salta a su sección).
  - 12 secciones, cada una en una tarjeta con número, título y entradilla:
    1. **Bienvenida** — los principios: responde rápido (menos de 24 h laborables), escucha 70/30, di siempre la verdad, apúntalo todo en Zoho.
    2. **Qué vendemos, en un minuto**.
    3. **Los dos cursos y cómo recomendar uno** — preguntas para elegir (empresa o para ti; cobras por horas; no lo tiene claro: la elección llega el cuarto fin de semana y es reversible; los dos cursos: 2.790 € o 2.990 € a plazos, hasta en 10 cuotas).
    4. **Por qué nosotros: los argumentos** — en directo, entregables, acreditado por Deel (Platinum + Global Partner, 7 módulos), docentes, grupos de 25, IA, sin fronteras.
    5. **Cómo detectar a un alumno interesado** — tres columnas **Señales verdes / Señales ámbar / Señales rojas** y una tabla de temperatura (Caliente, Templado, Frío) con qué hacer.
    6. **La llamada de descubrimiento** — 15–20 min en cinco pasos (abre, su situación, objetivo y freno, cómo encaja, siguiente paso con tarea en Zoho).
    7. **Cómo despertar el interés de quien duda**.
    8. **Objeciones y cómo responderlas** — desplegables: al pulsar «Es caro.», «No tengo tiempo.», «Me lo pienso.», «Lo puedo aprender gratis en YouTube.», «Mi inglés no es bueno.», «No sé si tengo el nivel.», «¿Me garantizáis un trabajo?», «¿Es un máster? ¿Es un título oficial?», «¿La empresa está en Dubái? ¿Es fiable?», «¿Quiénes son los profesores?», «¿Y si cancelan el curso?», «Lo tengo que hablar con mi pareja o con mi empresa.», etc., sale «Lo que suele haber detrás:» y la respuesta.
    9. **Seguimiento: la cadencia** — tabla Día 0 / 1 / 3 / 7 / 14 / tras una llamada, y tabla de estados (Nuevo, Contactado, Interesado, En duda, Inscrito, Descartado).
    10. **Mensajes listos para usar** — seis plantillas con su canal y cuándo usarlas: **Primer contacto** (WhatsApp), **No contesta (día 2 o 3)** (WhatsApp), **Resumen después de la llamada** (Correo), **Para quien «se lo está pensando»** (WhatsApp), **Siguiente paso para reservar** (WhatsApp), **Cerrar con buen sabor de boca** (WhatsApp). Las marcas `{nombre}`, `{comercial}` y `{curso}` se ven tal cual: hay que sustituirlas a mano.
    11. **Lo que nunca decimos** — columnas **Di esto / No digas esto** (p. ej. nunca «máster» ni «título oficial», ni garantías de empleo, ni «sin intereses», ni urgencia falsa) y un recuadro **Importante** sobre el desistimiento de 14 días.
    12. **Tus herramientas y tu primer día** — Zoho CRM, Material de apoyo, la calculadora y el playbook.
- **Por detrás / aviso**: la página se pinta a partir del contenido del código y siempre está al día con lo desplegado. El **PDF es un fichero generado aparte** (`scripts/playbook-comercial.mts`): si alguien cambia el contenido del playbook y no regenera el PDF, el PDF puede ir por detrás de la página. Si hay diferencias, manda la página.
- **No hay botones para copiar** las plantillas en esta página: se seleccionan y copian a mano.

### KPIs de ventas (`/admin/comercial/kpis`) — solo administración
- Menú: **Comercial → KPIs de ventas** (solo lo ve el Administrador).
- **Para qué sirve**: el embudo del anuncio a la matrícula en una página, con datos de Zoho, Aircall, Stripe, Meta Ads, Google Ads y GA4.
- **Ventana de datos**: siempre los **últimos 30 días en hora de Madrid, hoy incluido** (no se puede cambiar el rango). «7 días» = hoy y los 6 anteriores, comparado con los 7 previos.
- **Caché**: los datos se guardan **15 minutos** (Meta, Google y Zoho limitan las llamadas). Arriba a la derecha: botón **Actualizar** (mientras trabaja, «Actualizando…») y «Actualizado {hora}». Al pasar el ratón por esa hora: «Se guardan 15 minutos para no gastar el límite de las APIs.» **Actualizar** vacía la caché y vuelve a pedir todas las fuentes.

#### Cabecera
- «Últimos 30 días · {fecha inicio} – {hoy}», título **KPIs de ventas** y la entradilla.

#### Fila «Fuentes»
Seis chips: **Zoho CRM**, **Aircall**, **Matrículas**, **Meta Ads**, **Google Ads**, **GA4**, cada uno con su estado:
- **Conectada**: funciona.
- **Sin conectar**: faltan sus claves en el servidor (Vercel). Al pasar el ratón se ve qué falta.
- **Error**: tiene claves pero la API ha fallado. Al pasar el ratón se ve el mensaje.

De dónde sale cada fuente:
| Chip | Datos | Claves que necesita (en Vercel, no en el panel) |
|---|---|---|
| Zoho CRM | Leads (fecha, origen «Lead Source», estado «Lead Status»), Negocios (Deals: etapa, importe), Contactos (alumnos) y Facturas | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` (las mismas que escriben los leads del formulario) |
| Aircall | Las llamadas que Aircall guarda en el módulo **Calls** de Zoho (tipo, inicio, duración y lead vinculado) | Las mismas de Zoho |
| Matrículas | Los pedidos de Stripe guardados en la tabla `orders` del campus (estado, plan, oferta, importes; ningún dato personal). Hasta los 5.000 más recientes | Las de Supabase del servidor |
| Meta Ads | API de Marketing (Insights) de la cuenta publicitaria. La cuenta factura en dírhams (AED): se pasa a euros vía dólar (3,6725 AED = 1 USD) con el tipo del BCE (frankfurter.app, guardado 12 h), salvo que se fije un tipo con `FX_AED_EUR` | `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` |
| Google Ads | O bien una hoja de Google que rellena cada hora un script de Google Ads (camino recomendado), o bien la API de Google Ads | Hoja: `GOOGLE_ADS_SHEET_ID` + cuenta de servicio (`GOOGLE_SA_EMAIL`, `GOOGLE_SA_PRIVATE_KEY`). API: developer token, client id/secret, refresh token y customer id |
| GA4 | Data API de Google Analytics 4 con una cuenta de servicio | `GA4_PROPERTY_ID`, `GOOGLE_SA_EMAIL`, `GOOGLE_SA_PRIVATE_KEY` |

Cada fuente va por su lado: si una falla o no está conectada, su bloque lo dice y el resto del panel sigue. Las instrucciones para conectarlas están en `docs/kpis-ventas.md` del repositorio.

#### Las seis cifras principales
1. **Leads**: leads creados en Zoho en los 30 días. Mini gráfica diaria. Debajo: «{n} en los últimos 7 días · {±d} frente a los 7 anteriores» (verde si sube, rojo si baja).
2. **Leads llamados**: % de los leads de los 30 días que tienen **al menos una llamada no perdida** vinculada (por el lead de la llamada en Zoho). Cuenta cualquier llamada entrante o saliente aunque la duración sea 0; las perdidas no cuentan. Barra de color: verde desde 70 %, ámbar desde 40 %, roja por debajo. Debajo: «{a} de {b} leads».
3. **Hasta la 1.ª llamada**: media de horas desde que se crea el lead hasta su primera llamada no perdida (solo leads que tienen llamada). «Media desde que entra el lead».
4. **Matrículas**: pedidos **cobrados** (estado pagado, en plazos o completado) creados en los 30 días. Debajo: «{n} en total» (todos los tiempos).
5. **Cobrado**: euros cobrados de esas matrículas de 30 días. En pago único, el importe; a plazos, importe de cada plazo × plazos pagados (mínimo 1). Debajo: «{x} pendiente de plazos» = en todos los pedidos «en plazos», importe del plazo × (3 − plazos pagados). **Supone 3 plazos**, igual que Matrículas y pagos.
6. **Coste por lead real**: inversión (Meta + Google Ads, en euros) ÷ leads del CRM de los 30 días. «Inversión ÷ leads del CRM». Sin inversión: «—» y «Sin datos de anuncios».

«—» en cualquier cifra = su fuente no está conectada o no hay base para calcularla.

#### Embudo de 30 días
- «Cada paso, con el % que pasa del anterior. Los que aún no tienen fuente salen en gris.» Dos tramos:
  - **Captación**: **Impresiones** (Meta Ads + Google Ads) → **Clics en anuncios** (clics en el enlace) → **Visitas a la web** (sesiones de GA4).
  - **Venta**: **Leads** (entran en Zoho) → **Contactados** (llamada con conversación —no perdida y con duración— o un estado de Zoho que lo implica: Contacted, Contact in Future, Pre-Qualified, Not Qualified o Lost Lead) → **Cualificados** (estado «Pre-Qualified» en Zoho) → **Matrículas** (pagadas en Stripe).
- Cada paso sin fuente pone **Sin conectar**. El % («{p} del paso anterior») se mide frente al **paso anterior que tiene dato**, aunque sea del otro tramo (Leads se compara con Visitas a la web, o con Clics si GA4 no está). La longitud de cada barra es relativa al primer paso con dato de su tramo.

#### Lo importante
Lista de avisos sacados de los datos (con su contador), ordenados: rojo, ámbar, verde, informativo. Si no hay ninguno: «Todo en orden · No hay nada que se esté quedando atrás.»
| Aviso | Cuándo sale | Tono |
|---|---|---|
| «{n} leads de este mes sin llamar» | Hay leads de los 30 días sin llamada no perdida | Rojo |
| «Tardas {n} h de media en hacer la primera llamada» | Media > 1 h (rojo si > 24 h) | Ámbar / rojo |
| «Se pierden el {n} % de las llamadas entrantes» | Perdidas ÷ (entrantes + perdidas) > 20 % | Ámbar |
| «{n} pagos a medias en Stripe ({importe})» + botón **Ver matrículas** (a `/admin/matriculas`) | Pedidos iniciados o caducados en los 30 días | Ámbar |
| «Sólo el {n} % de los leads tiene origen» | Menos del 50 % de los leads de 30 días con «Lead Source» | Ámbar |
| «{n} leads menos que la semana anterior» | Últimos 7 días < 7 previos | Ámbar |
| «{n} leads más que la semana anterior» | Últimos 7 días > 7 previos | Verde |
| «Conecta Meta Ads y Google Ads» | Ninguna de las dos fuentes funciona | Informativo |
| «Aircall ha duplicado {n} llamadas en Zoho» | Se han descartado llamadas repetidas (mismo lead, misma hora al segundo, misma duración y tipo) | Informativo |

#### Bloque «Leads»
- **Leads nuevos por día** (columnas, 30 días; enlace desplegable **Ver tabla** con Día y valor).
- **Por estado en Zoho** (barras; estados traducidos: Intento de contacto, Contactar más adelante, Contactado, Basura, Perdido, Sin contactar, Cualificado, No cualificado; sin valor = «Sin estado»).
- **Por origen** (barras; Anuncios, Facebook, Web, Recomendación, Recomendación externa, Partner, Chat, Llamada en frío; sin valor = «Sin origen»).

#### Bloque «Llamadas»
- Cifras de los 30 días: **Llamadas** (total), **Con conversación** (no perdidas y con duración > 0), **Duración media** (de las que tienen conversación, «m min s s»), **Minutos hablados**, **Entrantes perdidas** (%).
- **Llamadas por día**: Salientes (incluye tipos no reconocidos), Entrantes, Perdidas.
- Las llamadas duplicadas por Aircall no se cuentan dos veces.

#### Bloque «Matrículas y pipeline»
- **Matrículas y pagos a medias por día** (Matrículas = cobradas; Pagos a medias = iniciados o caducados).
- **Por oferta** (tabla Oferta · N.º · Cobrado), ordenada por cobrado: «Un curso · pago único», «Un curso · anticipada», «Un curso · a plazos», «Los dos cursos», «Curso relámpago». Si no hay: «Aún no hay matrículas en estos 30 días.»
- **Pipeline en Zoho** (con **todos** los negocios de Zoho, no solo los de 30 días): **Abierto** (importe y «{n} negocios»), **Ganado** (etapa «Closed Won» o «Cierre ganado»), **Tasa de cierre** = ganados ÷ (ganados + perdidos; perdidos = etapas que empiezan por «Closed Lost» o «Cierre perdido»). Barras de importe por etapa (traducidas: Cualificación, Análisis de necesidades, Propuesta de valor, Quién decide, Propuesta / precio, Negociación, Ganado, Perdido, Perdido (competencia)). Sin negocios: «No hay negocios (Deals) en Zoho. Se crean al convertir un lead.»

#### Bloque «Anuncios»
- Arriba: **Inversión** (Meta + Google, €), **Coste por lead real** (inversión ÷ leads del CRM), **Coste por alumno** («Inversión ÷ matrículas» cobradas de 30 días), **ROAS** («Cobrado ÷ inversión», en «×»).
- **Inversión diaria** por fuente.
- Una tarjeta por fuente (Meta Ads / Google Ads): **Inversión** (si la cuenta no es en euros, debajo «{x} en la moneda de la cuenta»), **Impresiones**, **Clics**, **CTR** (clics ÷ impresiones), **CPC** (inversión ÷ clics), **Leads (píxel)** en Meta o **Conversiones** en Google, **Coste por lead** (inversión ÷ esos leads o conversiones de la plataforma). Tabla **Campañas** (Campaña · Inversión · CTR · Leads/Conversiones · Coste por lead), ordenada por inversión; vacía: «Sin campañas con impresiones en estos 30 días.» Con la hoja de Google Ads: «Hoja actualizada {fecha}».
- **Diferencia importante**: el «Coste por lead» de cada tarjeta usa los leads que cuenta la plataforma (píxel de Meta / conversiones de Google); el «Coste por lead real» usa los leads que de verdad entran en Zoho. No tienen por qué coincidir.

#### Bloque «Web · Google Analytics 4»
- **Sesiones**, **Usuarios** («{n} nuevos»), **Interacción** (%), **Eventos clave** (las conversiones de GA4). **Sesiones por canal** (barras, con sus eventos clave).
- Si GA4 está conectado pero sin sesiones: «GA4 está conectado pero no tiene sesiones: la etiqueta de GA4 de Tag Manager no está publicada.»

#### Bloque sin datos
- No conectado: «{Fuente} sin conectar · Faltan sus claves en Vercel. Cómo conseguirlas: docs/kpis-ventas.md.» y el nombre de las variables que faltan.
- Con error: «{Fuente} no ha respondido» y el mensaje de error de la API.

#### Problemas frecuentes
- Todo a cero o desfasado: pulsa **Actualizar** (la caché dura 15 min).
- Zoho y Aircall en «Error»: suele ser el token de Zoho o el límite de llamadas; espera y actualiza.
- Google Ads con «la pestaña «resumen» está vacía. ¿Se ha ejecutado el script?»: el script de Google Ads no ha rellenado la hoja.
- Zoho se lee hasta 5.000 registros por módulo; por encima, los números se quedan cortos (el panel no lo avisa en pantalla).
- «Pendiente de plazos» supone 3 plazos por pedido.
- Las claves de estas fuentes **no se configuran en el panel**: se ponen en Vercel (tarea técnica).

### Relación con otras secciones
- **Matrículas y pagos** (`/admin/matriculas`): la venta real (Stripe). Los KPIs de matrículas y cobrado salen de los mismos pedidos; el aviso de pagos a medias enlaza ahí.
- **Slack**: avisa de «Nueva solicitud de información», «Matrícula pagada», «Checkout abandonado» y «Cobro rechazado» en el canal de administración.
- **Zoho CRM** (fuera del panel): leads, estados, notas, tareas, temperatura y negocios.

### Dónde encuentro… (comercial)
- El precio a plazos y las cuotas de un curso: Comercial → Calculadora.
- El dosier para un lead indeciso: Comercial → Material de apoyo → El curso completo.
- Qué responder a «es caro»: Comercial → Playbook → 08 Objeciones.
- El mensaje de WhatsApp de primer contacto: Comercial → Playbook → 10 Mensajes listos para usar.
- Cuántos leads han entrado este mes y cuántos están sin llamar: Comercial → KPIs de ventas (solo admin).
- El coste por alumno o el ROAS: KPIs de ventas → Anuncios.
- La lista de leads y su ficha: en Zoho CRM, no en el panel.

---

## Inteligencia artificial (`/admin/ia`)

### Ruta, acceso y propósito
- Menú: **Ajustes → Inteligencia artificial**. Título de la página: **IA**. Subtítulo: «La clave de OpenAI del panel: lecciones, banners e imágenes de las publicaciones.»
- **Solo Administrador**. Un profesor que abra la ruta vuelve a `/admin` (los profesores usan la IA, pero no ven ni tocan la clave).
- **Para qué sirve**: configurar la **clave de OpenAI** de la escuela, el modelo de texto y activar o desactivar la IA de OpenAI del panel.

### Qué hay en pantalla
1. **Estado de la conexión** (tarjeta de color) con uno de estos estados:
   - **Desactivada** (gris): la IA está apagada con el interruptor.
   - **Sin clave** (rojo): no hay clave ni en el panel ni en el servidor.
   - **Sin probar** (ámbar): hay clave pero nunca se ha probado (o se cambió después de la última prueba).
   - **Conectada** (verde): la última prueba fue bien.
   - **Falla** (rojo): la última prueba falló.
   - Datos: **Clave** («Guardada en el panel (…abcd)», «Del entorno (…abcd)» o «No hay ninguna»; solo se enseñan los 4 últimos caracteres), **Modelo de texto**, **Última prueba** (fecha y resultado, o «Nunca»).
2. **Configuración** (formulario):
   - Interruptor **IA activada** — «Desactivada, el panel funciona igual pero sin los botones de IA.»
   - **Clave de la API de OpenAI** (campo de contraseña, siempre vacío; placeholder «sk-…»). Debajo, el estado de la clave y «Empieza por sk-. Se guarda en el servidor y no se vuelve a enseñar entera.» Si la clave viene del servidor: «Ahora mismo se usa la clave del entorno (OPENAI_API_KEY). Si guardas una aquí, manda ésta.»
   - Casilla **Borrar la clave guardada** (solo si hay una guardada en el panel).
   - **Modelo** (texto libre con sugerencias: gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini). «gpt-4o va bien para maquetar. Los modelos mini son más baratos y más bastos.»
   - Botones **Probar conexión** («Probando…») y **Guardar** («Guardando…» → «Guardado»).
3. **Dónde se usa** (lista que muestra la página: Editor de lecciones, Banners para Meta, Publicaciones —sólo las imágenes—, Cursos relámpago —con la clave del servidor— y Narración de lecciones —también clave del servidor—), la nota de coste «Cada propuesta es una llamada a OpenAI y se factura en tu cuenta. En el panel, la IA sólo trabaja cuando alguien pulsa el botón; la corrección de los cursos relámpago es la excepción: corre sola en cada entrega.» y la nota «No usan esta clave: los textos de las publicaciones, el asistente del campus (el chat de los alumnos) y la ayuda del panel contestan con DeepSeek, cuya clave está en Publicaciones → Ajustes.» con el enlace «Ir a Publicaciones → Ajustes».

### Cómo se hace
- **Poner o cambiar la clave**: pega la clave en el campo y pulsa **Guardar**. Una clave nueva borra el resultado de la última prueba (el estado pasa a **Sin probar**). Después pulsa **Probar conexión**.
- **Cambiar solo el modelo**: escribe el modelo y **Guardar** dejando el campo de la clave vacío: **vacío significa «déjala como está»**, no la borra. Si dejas el modelo vacío, se guarda `gpt-4o`.
- **Borrar la clave**: marca **Borrar la clave guardada** y **Guardar**. Si hay clave en el servidor (`OPENAI_API_KEY`), se seguirá usando esa.
- **Apagar la IA**: quita **IA activada** y **Guardar**.
- **Probar conexión**: pide a OpenAI la lista de modelos (no gasta tokens) y guarda el resultado. Mensajes posibles:
  - «Conectado. El modelo {modelo} está disponible.»
  - «Conectado, pero esta clave no ve el modelo {modelo}. Elige otro.»
  - «La clave no es válida o ha sido revocada.» (401)
  - «La clave no tiene permiso para este uso.» (403)
  - «La clave es válida pero no tiene saldo o ha superado el límite.» (429)
  - «No hay clave configurada.» / «No se pudo conectar: …»
  - Ojo: la prueba usa lo **guardado**, no lo que hay escrito sin guardar.

### Qué clave se usa y dónde (lo que hace el código de verdad)
Orden: primero la clave guardada en este panel; si no hay, la variable `OPENAI_API_KEY` del servidor. Si **IA activada** está apagada, no se usa ninguna (en lo que depende de esta página).

| Uso | Proveedor y modelo | ¿Depende de esta página? | ¿Cuesta? |
|---|---|---|---|
| **Editor de lecciones** (Módulos y lecciones): estructurar un borrador (PDF, Word, notas) en bloques; crear lección desde material | OpenAI, el **Modelo** de esta página | Sí (clave e interruptor). Sin clave o apagada, no sale el botón de IA y se escribe a mano | Sí, cada propuesta |
| **Banners para Meta**: escribir variantes, traducir, clonar referencias, reescribir | OpenAI, el **Modelo** de esta página | Sí | Sí |
| **Fotos de los banners** y **imágenes de las publicaciones** | OpenAI, modelo de imagen: `OPENAI_IMAGE_MODEL` del servidor o, si no, el mejor que acepte la clave (gpt-image-2 → gpt-image-1.5 → gpt-image-1) | Sí (la clave de esta página). Sin ella: «Falta la clave de OpenAI: configúrala en el panel → IA.» | Sí |
| **Textos de las publicaciones** (X, LinkedIn, blog) | **DeepSeek** (por defecto `deepseek-flash`) | **No**: la clave de DeepSeek se configura en **Marketing → Publicaciones → Ajustes** | Sí (saldo DeepSeek) |
| **Asistente del campus** (chat de alumnos) | **DeepSeek**; si no está o falla, contesta el buscador | No (clave de DeepSeek en Publicaciones → Ajustes) | Sí, poco |
| **Ayuda del panel** (este chat de ayuda) | **DeepSeek** | No (clave de DeepSeek en Publicaciones → Ajustes). | Sí, poco |
| **Cursos relámpago**: corrección automática de misiones | OpenAI, modelo `OPENAI_REVIEW_MODEL` o gpt-4o | **No**: usa solo `OPENAI_API_KEY` del servidor; ni la clave del panel ni el interruptor le afectan | Sí, **cada entrega de un alumno** (no hace falta pulsar nada en el panel) |
| **Narración de lecciones** (voz) | Fish Audio o, si no, OpenAI TTS (`gpt-4o-mini-tts`) | **No**: claves del servidor (`FISH_API_KEY` / `OPENAI_API_KEY`) | Sí |

- **Tarifas que usa el panel para estimar** el gasto de banners (USD por millón de tokens, entrada/salida): gpt-4o 2,5/10; gpt-4o-mini 0,15/0,6; gpt-4.1 2/8; gpt-4.1-mini 0,4/1,6; imagen gpt-image-* 5/40. Un modelo desconocido se estima al precio más caro. El gasto real lo factura OpenAI en la cuenta de la escuela; el panel no enseña el saldo de OpenAI.
- **El conector de Claude** (Conexiones con Claude) gasta esta misma clave cuando Claude crea o reescribe banners.

### Problemas frecuentes
- **No sale el botón de IA en el editor de lecciones**: estado «Desactivada» o «Sin clave». Actívala y guarda una clave.
- **Banners o imágenes fallan con 429**: la cuenta de OpenAI no tiene saldo. Recarga en OpenAI y pulsa **Probar conexión**.
- **«Esta clave no ve el modelo»**: cambia el modelo (p. ej. gpt-4o) y guarda.
- **Las publicaciones no se generan**: no es esta página; es la clave de DeepSeek (Publicaciones → Ajustes).
- **La corrección de cursos relámpago no funciona aunque aquí esté «Conectada»**: esa corrección usa la clave del servidor; tarea técnica.

### Dónde encuentro…
- Qué clave está en uso: tarjeta de estado → Clave (últimos 4 caracteres).
- Si la última prueba fue bien y cuándo: tarjeta de estado → Última prueba.
- Qué modelo de texto usan banners y lecciones: tarjeta de estado → Modelo de texto.

---

## Conexiones con Claude (`/admin/conexiones`)

### Ruta, acceso y propósito
- Menú: **Ajustes → Conexiones con Claude**. Solo **Administrador** (los demás vuelven a `/admin`).
- **Para qué sirve**: conectar Claude (claude.ai, Claude Desktop o Claude Code) a los **banners** y las **publicaciones** del campus para gestionarlos desde una conversación: ver, crear, editar, aprobar, programar, mover a carpetas y descargar. Es un conector MCP en `/api/mcp`.
- Esta página **solo** gestiona el conector de Claude. Las demás integraciones están en otras páginas o en el servidor (tabla al final de esta sección).

### Qué hay en pantalla
1. **Dirección del conector**: la URL (`https://<dominio>/api/mcp`, construida con el dominio desde el que abres el panel) y botón **Copiar** (→ «Copiada»). En una vista previa de Vercel sale la URL de esa vista previa.
2. **Cómo se conecta** (tres pasos):
   - **claude.ai o Claude Desktop**: Ajustes → Conectores → «Añadir conector personalizado». Pega la dirección, nombre «ActiveXRemote», Conectar. Se abre el campus: entra con tu cuenta y pulsa «Permitir».
   - **Equipo (Claude Team o Enterprise)**: quien administra la organización añade el conector una vez en Ajustes de la organización → Conectores; luego cada persona pulsa Conectar y entra con su cuenta del campus.
   - **Claude Code**: `claude mcp add --transport http activexremote <dirección>`; la primera vez, `/mcp` → activexremote → Autenticar.
   - Nota **Quién puede**: «Sólo administradores del campus. Cada persona entra con su cuenta y lo que hace queda a su nombre. Lo que no se puede hacer desde el panel tampoco se puede desde Claude: las normas de Meta, los límites y la revisión son los mismos.»
3. **Para empezar, pídele a Claude**: cuatro ejemplos de peticiones (ver campañas de la semana, crear una campaña de 5 banners, aprobar variantes y descargarlas, programar una publicación en el próximo hueco).
4. **Accesos activos**: tabla con **Aplicación** (nombre que registró el cliente, p. ej. Claude), **Cuenta** (nombre o email del admin), **Conectado**, **Último uso** y botón **Revocar** («Corta ese acceso al momento: Claude tendrá que volver a conectar.»). Vacía: «Todavía nadie ha conectado Claude.»

### La pantalla de permiso (cuando conectas desde Claude)
- Se abre `…/mcp/autorizar/…` en el campus (si no tienes sesión, primero el login).
- Si eres administrador: «¿Conectar {aplicación} con tu cuenta?», explica que podrá gestionar banners y publicaciones en tu nombre (verlos, crearlos —gasta saldo de OpenAI y DeepSeek—, editarlos, aprobarlos, programarlos y descargarlos) y que **no puede publicar nada fuera de la programación del campus ni tocar alumnos, matrículas o pagos**. Muestra a qué dominio vuelve. Botones **Cancelar** y **Permitir**.
- Si no eres administrador: «No puedes conectar Claude con esta cuenta» y botón **Volver a Claude**.
- Si tardas más de 10 minutos: «Esta solicitud ha caducado» → vuelve a conectar desde Claude.

### Lo que pasa por detrás
- OAuth 2.1 con PKCE. El token de acceso dura **1 hora**; el de refresco, **60 días**. Cada vez que Claude renueva el acceso se emite un token nuevo y se revoca el anterior: por eso **«Conectado» indica cuándo se emitió el token actual**, no la primera conexión. «Último uso» se actualiza como mucho una vez por minuto.
- Si nadie usa el conector en 60 días, el acceso caduca, desaparece de la tabla y hay que volver a conectar.
- En cada llamada se comprueba que la cuenta sigue siendo **administrador**: si le quitas el rol, deja de funcionar al momento (aunque la fila siga en la tabla hasta que caduque o la revoques).
- **Revocar** es inmediato y no pide confirmación.
- Herramientas que ofrece a Claude:
  - Banners: `banners_carpetas`, `banners_campanas`, `banners_campana`, `banners_ver_imagen` (hasta 6), `banners_crear_campana` (gasta OpenAI), `banners_anadir_variantes` (gasta OpenAI), `banners_mas_como_esta` (gasta OpenAI), `banners_estado` (aprobar/borrador/descartar; no se aprueba una variante con avisos que bloquean), `banners_editar`, `banners_reescribir` (IA), `banners_mover`, `banners_descargar` (enlace .zip válido 1 hora), `banners_video` (enlace MP4 válido 1 hora, sin IA ni coste).
  - Publicaciones: `publicaciones_listar`, `publicaciones_ver`, `publicaciones_crear` (DeepSeek, queda por revisar), `publicaciones_editar`, `publicaciones_regenerar` (DeepSeek), `publicaciones_programar` (fecha, «proximo_hueco», «nevera» o «quitar»), `publicaciones_desechar`.
  - Nada se publica en redes desde Claude: se programa y el campus lo publica a su hora. Los banners se aprueban y descargan para subirlos al Administrador de anuncios de Meta.
- Las firmas usan `MCP_SECRET` del servidor (o una derivada de la clave de servicio de Supabase). Sin ninguna de las dos, el conector falla.

### Problemas frecuentes
- **Claude dice que hace falta conectar con una cuenta de administrador**: la cuenta con la que entraste no es admin, o el acceso se revocó/caducó. Vuelve a conectar.
- **Alguien ya no debería tener acceso**: Revocar en **Accesos activos** (y, si procede, cambiar su rol en Usuarios).
- **Crear campañas desde Claude falla**: revisa la clave de OpenAI (IA) o la de DeepSeek (Publicaciones → Ajustes).

### Otras integraciones del campus (no se configuran en esta página)
| Integración | Dónde se configura | Para qué / qué deja de funcionar sin ella |
|---|---|---|
| OpenAI | Ajustes → Inteligencia artificial (o `OPENAI_API_KEY` en el servidor) | Editor de lecciones con IA, banners e imágenes |
| DeepSeek, Upload-Post, GIPHY | Marketing → Publicaciones → Ajustes (o variables del servidor) | Textos de publicaciones, asistente y ayuda del panel (DeepSeek); publicar en X y LinkedIn (Upload-Post); GIFs (GIPHY) |
| Slack | Ajustes → Slack | Avisos y resúmenes en Slack |
| Correo (SMTP de Google Workspace) | Alumnos y ventas → Dry run → **Cuenta de envío** | Correos del dry run y aviso al alumno cuando se corrige una tarea |
| Zoho CRM | Servidor (`ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`) | Leads del formulario de la web al CRM, registro de matrículas en Zoho, KPIs de Zoho y Aircall |
| Stripe | Servidor | Cobros y matrículas (webhook) |
| Meta Ads, Google Ads, GA4 | Servidor | Solo los KPIs de ventas |
| Fish Audio / voz | Servidor | Narración de lecciones |
| Crons | Servidor (`CRON_SECRET`) | Sin él, los crons responden error y no se envían recordatorios ni resúmenes |

---

## Slack (`/admin/slack`)

### Ruta, acceso y propósito
- Menú: **Ajustes → Slack**. Título: **Integración de Slack**. Subtítulo: «Convierte Slack en el canal único de comunicación del campus.»
- Solo **Administrador** (los demás vuelven a `/admin`).
- **Para qué sirve**: conectar un bot de Slack, decidir a qué canal va cada tipo de aviso, qué avisos se mandan, lanzar resúmenes a mano y ver los últimos avisos.

### Qué hay en pantalla
1. **Estado**: **Sin token** (rojo), **Desactivada** (gris; hay token pero la integración está apagada), **Sin probar** (ámbar), **Conectada** (verde), **La última prueba falló** (rojo). Datos: **Integración** (Activada/Desactivada), **Canal general (fallback)** y **Última prueba** (fecha y detalle, p. ej. «Conectado a "{workspace}" como @{bot}»).
2. **Cómo conectarla** (desplegable; abierto si no hay token). Pasos:
   1. Crea una app en api.slack.com/apps para tu workspace.
   2. En OAuth & Permissions añade los scopes de bot: chat:write, users:read, users:read.email.
   3. Instala la app en el workspace y copia el Bot User OAuth Token (xoxb-...).
   4. Invita al bot a cada canal con /invite @tu-bot.
   5. Pega el token aquí abajo, configura los canales y pulsa Probar conexión.
   - Con token guardado, los tres primeros salen marcados como hechos.
3. **Conexión**:
   - Interruptor **Integración de Slack activada**.
   - **Bot Token (xoxb-...)** (campo vacío siempre). Debajo: «Token guardado (…abcd). Déjalo vacío para conservarlo.» o «Todavía no hay token.»
   - Casilla **Borrar el token guardado** (si hay token).
   - Interruptor **Enviar mensajes directos (DM) para notificaciones personales**.
   - Botón **Probar conexión**.
4. **Canales** — «Pega el ID del canal de Slack (ej. C012AB3CD) o su nombre (#axr-alumnos). Si dejas uno vacío se usará el canal general.» Campos: **Canal general (fallback)**, **Canal de alumnos**, **Canal de profesores**, **Canal de administración**.
5. **Qué se avisa** — «Apaga lo que no quieras recibir. Cada aviso va al canal de su tipo y, si está marcado, también por mensaje directo.» Un interruptor por evento, con su canal y «· DM» si admite mensaje directo:

| Evento | Canal | DM | Cuándo se dispara |
|---|---|---|---|
| 📚 Nuevo contenido publicado | alumnos | — | Al publicar un módulo o lección |
| ✅ Lección completada por un alumno | profesores | — | Un alumno completa una lección |
| 🎉 Examen aprobado / ⚠️ Examen suspendido | profesores | — | Resultado de un examen |
| 📌 Tarea asignada | alumnos | Sí | Al asignar una tarea con fecha límite |
| ⏰ Recordatorio de tarea próxima a vencer | alumnos | Sí | Cron de recordatorios: vence en 3 días o menos |
| 🔴 Tarea vencida | profesores | Sí (al alumno) | Cron de recordatorios: fecha superada |
| Tarea completada | profesores | — | Un alumno termina una tarea asignada |
| Nuevo usuario en el campus | administración | — | Alta de un usuario |
| Nueva solicitud de información | administración | — | Alguien pide información desde la landing |
| Matrícula pagada | administración | — | Pago completado en Stripe |
| Checkout abandonado | administración | — | Deja su email y no paga |
| Cobro rechazado | administración | — | Falla un plazo y el acceso queda suspendido |
| Resumen de progreso de alumnos | profesores | — | Cron semanal o envío manual |
| Seguimiento de cumplimiento de profesores | administración | — | Cron semanal o envío manual |
| Recordatorio de inactividad | alumnos | Sí | **En el código no se ha encontrado nada que lo dispare**: el interruptor existe pero hoy no envía nada |

6. Botón **Guardar configuración** («Configuración guardada.»). Guarda conexión, canales y avisos a la vez.
7. **Envíos manuales** — «Lánzalos manualmente cuando quieras, o prográmalos con el cron (ver README).» Tres botones:
   - 📊 **Resumen de progreso de alumnos** → canal de profesores: alumnos totales, lecciones completadas en 7 días, exámenes en 7 días y aprobados, alumnos sin actividad esta semana (y hasta 12 nombres). Resultado: «Resumen de alumnos enviado (n mensaje/s).» o «No enviado (motivo). Revisa la configuración de Slack.»
   - 🧭 **Cumplimiento de profesores** → canal de administración: profesores y, por cada uno, tareas asignadas y pendientes de cierre.
   - ⏰ **Procesar recordatorios de tareas**: «Recordatorios procesados: {n} próximas, {m} vencidas.»
8. **Últimos avisos**: los 25 últimos, con **Evento**, **Destino** (canal o usuario, «· canal» o «· DM»), **Estado** (**Enviado**, **Falló**, **Omitido**, **Pendiente**, con el error debajo) y **Cuándo**. Vacío: «Sin notificaciones registradas.»

### Cómo se hace
- **Conectar por primera vez**: sigue los 5 pasos, pega el token, activa la integración, rellena al menos el **Canal general**, **Guardar configuración** y luego **Probar conexión** (la prueba usa el token **guardado**: si no has guardado, dice «No hay token configurado. Guarda el Bot Token primero.»).
- **Cambiar un canal o apagar un aviso**: cambia y **Guardar configuración**. El token no se toca si su campo queda vacío.
- **Quitar el token**: marca **Borrar el token guardado** y guarda.
- Un token nuevo o borrado pone el estado en **Sin probar**.

### Lo que pasa por detrás
- **Crons** (horas en UTC; en Madrid +1 h en invierno, +2 h en verano):
  - Recordatorios de tareas: **cada día a las 07:00 UTC**.
  - Resumen de progreso de alumnos: **los lunes a las 07:00 UTC**.
  - Cumplimiento de profesores: **los viernes a las 15:00 UTC**.
  - (Además, cada 5 minutos un cron de base de datos manda la cola de correos del dry run; no es de Slack.)
- **Procesar recordatorios** (cron o botón) **cambia datos**: marca como **vencida** cada tarea con la fecha superada y apunta que ya se avisó; las que vencen en 3 días o menos quedan marcadas como recordadas. Cada tarea se avisa **una sola vez**, y esto pasa **aunque Slack esté apagado**: si Slack estaba desactivado ese día, ese aviso no se repite después.
- Cada aviso escribe una fila en Últimos avisos, también cuando no se manda. Motivos de **Omitido**: `slack_no_configurado` (apagado o sin token), `evento_desactivado` (su interruptor está apagado), `sin_destino` (no hay canal ni DM).
- Canal: el de su tipo; si está vacío, el general. DM: solo si el evento lo admite, el interruptor de DM está activo y el email del alumno existe en Slack.
- Si el bot no está invitado al canal, el aviso sale como **Falló** con el error de Slack.

### Problemas frecuentes
- **Todo sale «Omitido»**: integración desactivada, sin token o el evento apagado (mira el error de la fila).
- **«Falló» con `not_in_channel` o `channel_not_found`**: invita al bot al canal (/invite) o revisa el nombre/ID.
- **No llegan los DM**: activa el interruptor de DM y comprueba que el alumno usa en Slack el mismo email que en el campus.
- **No sale el formulario de configuración**: la fila de ajustes de Slack no existe en la base de datos (tarea técnica).

### Dónde encuentro…
- Si un aviso concreto se mandó: Slack → Últimos avisos (solo los 25 últimos).
- A qué canal va cada aviso: Slack → Qué se avisa (etiqueta #canal) y Canales.

---

## Correo saliente (SMTP)

### Dónde vive
- **No está en Ajustes**. Está en **Alumnos y ventas → Dry run** (`/admin/dry-run`), tarjeta **Cuenta de envío**, al final de la página. Solo **Administrador**.
- En la cabecera de Dry run hay una etiqueta **Cuenta de envío: Configurado** (verde) o **Sin configurar** (ámbar). «Configurado» = envío activado + usuario + contraseña guardados.

### Qué hay en pantalla
- «Los correos salen por SMTP de Google Workspace. Usa admin@activexremote.com con una contraseña de aplicación (Cuenta de Google → Seguridad → Verificación en dos pasos → Contraseñas de aplicación).»
- Interruptor **Envío activado**.
- **Usuario** (por defecto admin@activexremote.com) y **Contraseña de aplicación** (campo vacío; «Guardada (termina en …). Déjalo vacío para no cambiarla.» o «Sin guardar.»). Los espacios de la contraseña se quitan al guardar.
- **Nombre del remitente** (por defecto ActiveXRemote) y **Correo del remitente** («Vacío: el del usuario.»).
- **Servidor SMTP** (por defecto smtp.gmail.com) y **Puerto** (por defecto 465; debe ser un número de 1 a 65535, si no: «Puerto no válido.»). Con 465 se usa conexión segura directa.
- **Responder a**.
- Botones **Enviarme un correo de prueba** (te manda «Prueba de envío · ActiveXRemote» a tu email; «Prueba enviada a {email}.») y **Guardar** («Guardado.»).

### Para qué se usa
- Correos del **dry run** (invitaciones, recordatorios, preparación, seguimiento): salen de una cola que se procesa cada 5 minutos. Sin correo configurado se quedan en cola hasta que se configure.
- El correo al alumno **«Tu profesor ha corregido…»** cuando se corrige una tarea en Respuestas.
- Google permite unos 2.000 envíos al día por cuenta. Los correos quedan en «Enviados» del buzón y las respuestas llegan a esa bandeja.
- Los correos de acceso al campus (login) y el de confirmación de Zoho al pedir información **no salen de aquí** (no se gestionan desde estas pantallas).

### Problemas frecuentes
- **La prueba falla con error de autenticación**: usa una contraseña de aplicación de Google, no la contraseña normal (hace falta la verificación en dos pasos).
- **Dry run dice que los correos están en cola**: activa el envío y guarda usuario y contraseña.
