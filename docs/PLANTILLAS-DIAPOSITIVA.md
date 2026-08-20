# ActiveXRemote — Plantillas de diapositiva

**Versión 2.0 · Lienzo 1920 × 1080 px (16:9) · Uso interno**

Catálogo de **64 formatos de diapositiva** agrupados en **10 familias**, con soporte para fotografía,
capturas, vídeo, audio, enlaces y códigos QR.

Este documento es la **única referencia de formato**: toda diapositiva generada debe corresponder a uno
de los layouts del catálogo y respetar sus zonas de texto y sus límites de caracteres.

El PDF que acompaña a este archivo contiene cada layout dibujado en blanco, con el texto sustituido por
*lorem ipsum* para marcar dónde se escribe y cuánto cabe.

---

## Prompt base

```
Usa el documento «ActiveXRemote — Plantillas de diapositiva» como única
referencia de formato. Reglas:

1. Cada diapositiva DEBE corresponder a uno de los 64 layouts del catálogo.
   Encabeza cada diapositiva con su código, así:  [C01 · Texto + imagen]
2. Respeta las zonas de texto y los límites de caracteres de la ficha de ese
   layout. No inventes zonas nuevas ni escribas texto fuera de ellas.
3. Devuelve el contenido zona por zona, con la clave delante:
      etiqueta: ...
      titulo: ...
      texto: ...
4. No mezcles dos layouts en una misma diapositiva.
5. Varía la familia: no encadenes más de 3 diapositivas de la misma.
6. Estructura de cada sesión de 4 h (unas 45 diapositivas):
      A01 → A05 → A06 → [A03 + contenido ×8-12 → I01] ×3 → I06 → I08
7. Para foto, vídeo, audio, enlace o QR usa SIEMPRE un layout de las familias
   C, D o E; describe el medio entre corchetes:
      [FOTO: equipo trabajando desde un coworking en Lisboa]
      [CAPTURA: panel de Deel con un contrato de contractor]
      [VÍDEO: 02:15 — fragmento de entrevista con un hiring manager]
      [QR → activexremote.com/plantilla-banda-salarial]
8. Tono: tuteo, frases de menos de 20 palabras, títulos que afirman.
   Sin emoji. Cifras en dígitos y siempre con fuente.
   Máximo 40 palabras por diapositiva.

Genera ahora las diapositivas del MÓDULO 01 — HORA 1.
```

---

## Especificación del lienzo

| | |
|---|---|
| Formato | 1920 × 1080 px · 16:9 |
| Pulgadas | 13,33 × 7,5 in |
| Centímetros | 33,87 × 19,05 cm |
| Margen lateral | 96 px |
| Margen superior | 72 px |
| Margen inferior | 100 px |
| Columnas | 12 · medianil 32 px |
| Ancho útil | 1728 px |
| Rejilla base | 8 px |

**Repartos:** `7+5` y `5+7` texto e imagen · `6+6` comparativa · `8+4` gráfico y lectura ·
`4+4+4` tres bloques · `12` a sangre.

**Forma:** radio `0 px` en todo. Filete 1 px (2 px si la caja tiene peso propio).
Sombra dura `14px 14px 0 #161616` solo en la caja de entregable.

### Tipografía — Inter

| Zona | px | pt | Peso |
|---|---|---|---|
| Título portada | 128 | 96 | 700 |
| Separador | 96 | 72 | 700 |
| Manifiesto | 82 | 62 | 700 |
| Título | 64 | 48 | 700 |
| Título medio | 48 | 36 | 700 |
| Cita | 52 | 39 | 600 |
| Subtítulo | 36 | 27 | 600 |
| Cuerpo | 28 | 21 | 400 |
| Cuerpo 2 | 24 | 18 | 400 |
| Etiqueta | 18 | 13 | 700 |
| Pie / fuente | 14 | 10 | 500 |
| Cifra destacada | 200 | 150 | 700 |

Titulares: tracking −0,03 em. Etiquetas: +0,16 em en mayúsculas. Cuerpo: 0.
**Nada por debajo de 18 px / 14 pt.**

### Color

| Uso | Hex |
|---|---|
| Tinta / texto | `#161616` |
| Superficie oscura | `#262626` |
| Texto secundario | `#525252` |
| Etiquetas, pies | `#6F6F6F` · `#8D8D8D` |
| Filetes | `#E0E0E0` · `#C6C6C6` |
| Fondo de hueco | `#F4F4F4` |
| Acento Remote Professional | `#5B4BF5` |
| Acento Remote Founder | `#E4462F` |

El acento solo en etiquetas, enlaces, llamadas sobre imagen, atribución de citas y la serie
protagonista de un gráfico. **Nunca como fondo ni como color de titular.**
Para texto pequeño en rojo, `#C3341F`.

### Chrome fijo

- **Pie izquierda:** lockup ΔX + `ACTIVEXREMOTE`, 28 px de alto.
- **Pie derecha:** `MÓDULO NN · NN` en 14 px, tracking 0,10 em, gris 50.
- Se omite en `A01`, `A02`, `A03`, `A04` y `B08`.

---

## Sistema de medios

### Fotografía

Real y propia siempre que se pueda. A sangre (`A02`, `A04`, `C03`) siempre con velo
`rgba(0,0,0,.55)` y texto en blanco puro peso ≥ 600.

- Recorte 16:9, 4:3 o 1:1. Nunca deformada.
- Retratos: 1:1 o 3:4, mirada hacia dentro de la diapositiva.
- Sin filtros de color ni marcos redondeados.
- Crédito en 14 px cuando no es propia.
- Nada de stock de gente sonriendo con portátiles.

### Capturas de pantalla

Del producto real, con datos coherentes y anonimizados. Filete de 1 px `#E0E0E0`, sin sombra
ni marco de navegador falso.

- Recorta a lo que importa: si hay que hacer zoom, está mal.
- Para destacar: rectángulo de 2 px en el acento.
- Llamadas numeradas (`C08`), máximo 4.
- Nunca «Lorem ipsum» ni «John Doe» dentro de la captura.

### Vídeo y audio

**Incrustado, nunca enlazado**: un enlace externo rompe la clase si falla la red.
Subtítulos siempre — la cohorte es internacional.

- Máx. 3 min sin pausa; si es más largo, córtalo.
- Cartela inicial con el logo en tinta sobre blanco.
- Bucles (`D05`): máx. 10 s y sin audio.
- Audio (`D04`): siempre con transcripción visible.
- Duración escrita en pantalla antes de darle al play.

### Enlaces y QR

Toda URL se **escribe visible** y se acompaña de QR cuando el alumno deba abrirla en el momento.

- Nada de acortadores ni de parámetros de seguimiento.
- QR mínimo 150 px de lado en pantalla.
- El QR y la URL apuntan siempre al mismo sitio.
- Enlace en el acento con subrayado de 2 px, nunca en azul de sistema.
- Más de 6 enlaces: van al campus, no a la diapositiva.

### Cómo se describe un medio cuando lo genera la IA

La IA no produce las imágenes: deja el hueco descrito para que el docente lo rellene.

```
[FOTO: equipo trabajando desde un coworking en Lisboa]
[CAPTURA: panel de Deel con un contrato de contractor]
[VÍDEO: 02:15 — fragmento de entrevista con un hiring manager]
[AUDIO: 01:40 — testimonio de una alumna en Bogotá]
[QR → activexremote.com/plantilla-banda-salarial]
```

---

## Índice del catálogo

### Apertura

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `A01` | Portada de módulo | Primera diapositiva de cada sesión. Identifica módulo, camino, docente y fecha. | 007 |
| `A02` | Portada con fotografía | Portada de alto impacto para sesiones abiertas, webinars o bienvenida de cohorte. | 009 |
| `A03` | Separador de bloque | Marca el cambio de tema dentro de la sesión. Da respiro. | 011 |
| `A04` | Separador con fotografía | Separador cuando el bloque tiene una imagen que lo representa. | 013 |
| `A05` | Agenda / índice | Qué se va a ver en la sesión. Lista numerada corta. | 015 |
| `A06` | Objetivos de aprendizaje | Qué sabrá hacer el alumno al terminar. Verbo de acción por objetivo. | 017 |
| `A07` | Mapa del curso | Dónde estamos dentro del programa. Orienta en sesiones largas. | 019 |

### Texto

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `B01` | Título + texto | La explicación más simple: una idea desarrollada en un párrafo. | 021 |
| `B02` | Viñetas | Lista de puntos paralelos. El formato más frecuente del temario. | 023 |
| `B03` | Viñetas en dos columnas | Lista larga que no cabe en cinco puntos: hasta 8, repartidos en dos columnas. | 025 |
| `B04` | Dos columnas de texto | Dos ideas paralelas del mismo peso, una a cada lado. | 027 |
| `B05` | Tres columnas de texto | Tres ideas hermanas. El máximo antes de que el texto sea ilegible. | 029 |
| `B06` | Definición / concepto clave | Fijar un término del oficio. Palabra grande, definición debajo. | 031 |
| `B07` | Texto + nota lateral | Explicación principal con un aviso, matiz o dato al margen. | 033 |
| `B08` | Frase manifiesto | Una sola frase a pantalla completa. Corta el ritmo y fija una idea. | 035 |
| `B09` | Pregunta detonante | Lanzar una pregunta al aula antes de dar la respuesta. | 037 |

### Imagen

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `C01` | Texto + imagen (7+5) | Explicación a la izquierda, captura o diagrama a la derecha. El caballo de batalla. | 039 |
| `C02` | Imagen + texto (5+7) | La misma composición invertida. Alterna con C01 para no repetir ritmo. | 041 |
| `C03` | Foto a sangre con texto | Fotografía que ocupa toda la diapositiva con un titular encima. | 043 |
| `C04` | Imagen a pantalla completa | Una captura o diagrama que necesita todo el ancho, dentro de la zona segura. | 045 |
| `C05` | Galería de tres | Tres imágenes comparables, cada una con su pie. | 047 |
| `C06` | Mosaico de cuatro | Cuatro imágenes en rejilla 2×2 con una idea al lado. | 049 |
| `C07` | Antes / después | Dos imágenes enfrentadas que muestran una transformación. | 051 |
| `C08` | Captura anotada | Una captura con llamadas numeradas y su leyenda al lado. | 053 |

### Vídeo

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `D01` | Vídeo a pantalla completa | Reproducir un vídeo como contenido principal de la diapositiva. | 055 |
| `D02` | Vídeo + puntos clave | Vídeo a un lado y qué hay que observar en él al otro. | 057 |
| `D03` | Demo en vivo | Marcador de pantalla compartida: el docente sale del deck y enseña la herramienta. | 059 |
| `D04` | Audio / entrevista | Fragmento de audio o podcast con su transcripción destacada. | 061 |
| `D05` | Bucle / GIF + explicación | Vídeo corto en bucle sin sonido que muestra una interacción, con el texto al lado. | 063 |

### Recursos

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `E01` | Recurso destacado | Un único enlace importante, con QR para abrirlo desde el móvil. | 065 |
| `E02` | Lista de recursos | Cuatro a seis enlaces agrupados, cada uno con su para qué. | 067 |
| `E03` | Descarga de plantilla | Entregar un archivo: plantilla, checklist, hoja de cálculo. | 069 |
| `E04` | Herramienta del stack | Presentar una herramienta: qué es, para qué la usamos y dónde está. | 071 |
| `E05` | Stack completo | Rejilla de logos: todo el stack del módulo de un vistazo. | 073 |

### Datos

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `F01` | Tabla | Datos comparables en filas y columnas. | 075 |
| `F02` | Tabla de decisión | Comparativa con marcas de sí / no en vez de texto. | 077 |
| `F03` | Gráfico de barras | Una serie de datos con su lectura escrita al lado. | 079 |
| `F04` | Evolución / línea | Un dato a lo largo del tiempo. | 081 |
| `F05` | Cifra destacada | Una a tres cifras que sostienen un argumento. | 083 |
| `F06` | Panel de KPIs | Cuatro métricas juntas, como un cuadro de mando. | 085 |
| `F07` | Distribución en porcentajes | Reparto de un total entre 4 o 5 categorías, en barras horizontales. | 087 |
| `F08` | Mapa / geografía | Dato por país o región. El curso es internacional: aparece a menudo. | 089 |

### Estructura

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `G01` | Proceso en pasos | Una secuencia de 3 o 4 pasos en orden. | 091 |
| `G02` | Cronología | Hitos en el tiempo sobre una línea horizontal. | 093 |
| `G03` | Comparativa A / B | Dos opciones enfrentadas con los mismos criterios. | 095 |
| `G04` | Matriz 2×2 | Cuatro cuadrantes definidos por dos ejes. Herramienta de decisión. | 097 |
| `G05` | Jerarquía / pirámide | Niveles apilados, de la base al vértice. | 099 |
| `G06` | Diagrama de flujo | Cajas conectadas con una bifurcación. Para decisiones con condición. | 101 |
| `G07` | Checklist | Lista de verificación que el alumno puede marcar. | 103 |
| `G08` | Do / Don't | Buenas prácticas frente a errores, en dos columnas simétricas. | 105 |
| `G09` | Framework con siglas | Un método memorizable: una letra por principio. | 107 |

### Personas

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `H01` | Cita | Una frase atribuida que se quiere fijar. Diapositiva de respiro. | 109 |
| `H02` | Testimonio con foto | Cita con la cara y el contexto de quien la dice. Mucho más creíble. | 111 |
| `H03` | Perfil del ponente | Quién da la clase y por qué se le escucha. | 113 |
| `H04` | Caso real | Un caso concreto: situación de partida, qué hizo, qué consiguió. | 115 |
| `H05` | Logos de empresas | Prueba social: dónde han acabado los alumnos o con quién trabajamos. | 117 |

### Actividad

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `I01` | Ejercicio práctico | La actividad en vivo. Una por bloque como mínimo. | 119 |
| `I02` | Trabajo en grupo | Dinámica en salas pequeñas, con roles y tiempos. | 121 |
| `I03` | Quiz de repaso | Pregunta con opciones para comprobar comprensión en directo. | 123 |
| `I04` | Plantilla a rellenar | Un esquema con huecos que el alumno completa en directo. | 125 |
| `I05` | Errores comunes | Los tres fallos que casi todo el mundo comete, y su corrección. | 127 |

### Cierre

| Código | Nombre | Para qué | Pág. PDF |
|---|---|---|---|
| `I06` | Resumen del bloque | Tres ideas que hay que retener. Antes de cambiar de bloque. | 129 |
| `I07` | Tarea con plazo | El entregable de la semana: qué, cómo, cuándo y dónde se entrega. | 131 |
| `I08` | Cierre y siguiente paso | Última diapositiva. Una acción concreta con fecha y canal. | 133 |

**Secuencia de una sesión de 4 h:** `A01` portada → `A05` agenda → `A06` objetivos →
[`A03` separador + 8–12 de contenido + `I01` ejercicio] × 3 → `I06` resumen → `I08` cierre.

Una diapositiva de respiro (`B08`, `F05`, `H01` o `C03`) cada 5–6 de contenido;
no encadenes más de 3 layouts de la misma familia.

---

## Fichas de layout

## Familia · Apertura

### A01 · Portada de módulo

**Fondo:** tinta `#161616` · **Página del PDF:** 007

Primera diapositiva de cada sesión. Identifica módulo, camino, docente y fecha.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 40 car. | Módulo NN · nombre del camino |
| `titulo` | 60 car. · 2 líneas | Afirmación, no etiqueta |
| `creditos` | 70 car. | Docente · fecha · duración |

**Usar cuando**
- Abrir cada módulo o cada hora de clase.

**No usar cuando**
- Poner aquí el índice o los objetivos: eso es A05 y A06.

```
LAYOUT: A01 — Portada de módulo
FAMILIA: Apertura
FONDO: tinta #161616
ZONAS: etiqueta(40) | titulo(60/2 líneas) | creditos(70)
USAR: Abrir cada módulo o cada hora de clase.
EVITAR: Poner aquí el índice o los objetivos: eso es A05 y A06.
```

### A02 · Portada con fotografía

**Fondo:** tinta `#161616` · **Página del PDF:** 009

Portada de alto impacto para sesiones abiertas, webinars o bienvenida de cohorte.

| Zona | Límite | Nota |
|---|---|---|
| `foto` | — | A sangre, con velo oscuro rgba(0,0,0,.55) |
| `etiqueta` | 40 car. | — |
| `titulo` | 55 car. · 2 líneas | — |
| `creditos` | 70 car. | — |

**Usar cuando**
- Sesiones con público externo. Primera sesión de la cohorte.

**No usar cuando**
- Fotos de stock genéricas. Texto sobre la zona más clara de la foto.

```
LAYOUT: A02 — Portada con fotografía
FAMILIA: Apertura
FONDO: tinta #161616
ZONAS: foto(—) | etiqueta(40) | titulo(55/2 líneas) | creditos(70)
USAR: Sesiones con público externo. Primera sesión de la cohorte.
EVITAR: Fotos de stock genéricas. Texto sobre la zona más clara de la foto.
```

### A03 · Separador de bloque

**Fondo:** tinta `#161616` · **Página del PDF:** 011

Marca el cambio de tema dentro de la sesión. Da respiro.

| Zona | Límite | Nota |
|---|---|---|
| `numero` | 2 car. | Número de bloque, 01–09 |
| `titulo` | 40 car. · 2 líneas | Nombre del bloque |

**Usar cuando**
- Cada 8–12 diapositivas de contenido.

**No usar cuando**
- Usarlo como portada. Meter texto de cuerpo.

```
LAYOUT: A03 — Separador de bloque
FAMILIA: Apertura
FONDO: tinta #161616
ZONAS: numero(2) | titulo(40/2 líneas)
USAR: Cada 8–12 diapositivas de contenido.
EVITAR: Usarlo como portada. Meter texto de cuerpo.
```

### A04 · Separador con fotografía

**Fondo:** tinta `#161616` · **Página del PDF:** 013

Separador cuando el bloque tiene una imagen que lo representa.

| Zona | Límite | Nota |
|---|---|---|
| `foto` | — | A sangre, velo oscuro |
| `numero` | 2 car. | — |
| `titulo` | 40 car. | — |

**Usar cuando**
- Bloques temáticos con identidad visual propia (un país, una herramienta, un caso).

**No usar cuando**
- Alternarlo con A03 sin criterio: elige uno de los dos por sesión.

```
LAYOUT: A04 — Separador con fotografía
FAMILIA: Apertura
FONDO: tinta #161616
ZONAS: foto(—) | numero(2) | titulo(40)
USAR: Bloques temáticos con identidad visual propia (un país, una herramienta, un caso).
EVITAR: Alternarlo con A03 sin criterio: elige uno de los dos por sesión.
```

### A05 · Agenda / índice

**Fondo:** blanco · **Página del PDF:** 015

Qué se va a ver en la sesión. Lista numerada corta.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 20 car. | «Hoy» o «Agenda» |
| `titulo` | 50 car. | Afirmación sobre lo que se llevan |
| `item_1..5` | 60 car. c/u | Máximo 5, una línea cada uno |

**Usar cuando**
- Segunda diapositiva de la sesión.

**No usar cuando**
- Más de 5 puntos. Sub-niveles.

```
LAYOUT: A05 — Agenda / índice
FAMILIA: Apertura
FONDO: blanco
ZONAS: etiqueta(20) | titulo(50) | item_1..5(60 c/u)
USAR: Segunda diapositiva de la sesión.
EVITAR: Más de 5 puntos. Sub-niveles.
```

### A06 · Objetivos de aprendizaje

**Fondo:** blanco · **Página del PDF:** 017

Qué sabrá hacer el alumno al terminar. Verbo de acción por objetivo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `objetivo_1..4` | 80 car. c/u | Empiezan por verbo en infinitivo |

**Usar cuando**
- Después de la agenda, o al abrir un bloque largo.

**No usar cuando**
- Verbos vagos: «conocer», «entender». Mejor «montar», «calcular», «negociar».

```
LAYOUT: A06 — Objetivos de aprendizaje
FAMILIA: Apertura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | objetivo_1..4(80 c/u)
USAR: Después de la agenda, o al abrir un bloque largo.
EVITAR: Verbos vagos: «conocer», «entender». Mejor «montar», «calcular», «negociar».
```

### A07 · Mapa del curso

**Fondo:** blanco · **Página del PDF:** 019

Dónde estamos dentro del programa. Orienta en sesiones largas.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `hito_1..7` | 18 car. c/u | Nombre corto de cada módulo |
| `actual` | 1 car. | Cuál de los hitos está activo |

**Usar cuando**
- Al abrir la sesión y al volver de una pausa larga.

**No usar cuando**
- Listar los 14 módulos: agrupa en 5–7 hitos.

```
LAYOUT: A07 — Mapa del curso
FAMILIA: Apertura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | hito_1..7(18 c/u) | actual(1)
USAR: Al abrir la sesión y al volver de una pausa larga.
EVITAR: Listar los 14 módulos: agrupa en 5–7 hitos.
```

---

## Familia · Texto

### B01 · Título + texto

**Fondo:** blanco · **Página del PDF:** 021

La explicación más simple: una idea desarrollada en un párrafo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 60 car. · 2 líneas | — |
| `texto` | 320 car. · máx. 4 líneas | Medida máxima 60–68 caracteres |

**Usar cuando**
- Introducir un concepto antes de desglosarlo.

**No usar cuando**
- Meter aquí una lista disfrazada de párrafo: usa B02.

```
LAYOUT: B01 — Título + texto
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(60/2 líneas) | texto(320/máx. 4 líneas)
USAR: Introducir un concepto antes de desglosarlo.
EVITAR: Meter aquí una lista disfrazada de párrafo: usa B02.
```

### B02 · Viñetas

**Fondo:** blanco · **Página del PDF:** 023

Lista de puntos paralelos. El formato más frecuente del temario.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 60 car. | — |
| `vineta_1..5` | 70 car. c/u | Máximo 5, una línea cada una |

**Usar cuando**
- Criterios, requisitos, errores comunes, pasos no secuenciales.

**No usar cuando**
- Más de 5 viñetas. Viñetas de más de una línea. Sub-viñetas.

```
LAYOUT: B02 — Viñetas
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(60) | vineta_1..5(70 c/u)
USAR: Criterios, requisitos, errores comunes, pasos no secuenciales.
EVITAR: Más de 5 viñetas. Viñetas de más de una línea. Sub-viñetas.
```

### B03 · Viñetas en dos columnas

**Fondo:** blanco · **Página del PDF:** 025

Lista larga que no cabe en cinco puntos: hasta 8, repartidos en dos columnas.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `vineta_1..8` | 50 car. c/u | Se leen en Z: 1–4 izquierda, 5–8 derecha |

**Usar cuando**
- Listados de herramientas, países, documentos, requisitos legales.

**No usar cuando**
- Más de 8. Si necesitas más, es una tabla (F01) o dos diapositivas.

```
LAYOUT: B03 — Viñetas en dos columnas
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | vineta_1..8(50 c/u)
USAR: Listados de herramientas, países, documentos, requisitos legales.
EVITAR: Más de 8. Si necesitas más, es una tabla (F01) o dos diapositivas.
```

### B04 · Dos columnas de texto

**Fondo:** blanco · **Página del PDF:** 027

Dos ideas paralelas del mismo peso, una a cada lado.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `izq_titulo` | 30 car. | — |
| `izq_texto` | 240 car. | — |
| `der_titulo` | 30 car. | — |
| `der_texto` | 240 car. | — |

**Usar cuando**
- Teoría vs práctica · qué sí / qué no · dos enfoques.

**No usar cuando**
- Columnas de longitud muy distinta. Tres columnas: usa B05.

```
LAYOUT: B04 — Dos columnas de texto
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | izq_titulo(30) | izq_texto(240) | der_titulo(30) | der_texto(240)
USAR: Teoría vs práctica · qué sí / qué no · dos enfoques.
EVITAR: Columnas de longitud muy distinta. Tres columnas: usa B05.
```

### B05 · Tres columnas de texto

**Fondo:** blanco · **Página del PDF:** 029

Tres ideas hermanas. El máximo antes de que el texto sea ilegible.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `col_1..3 titulo` | 24 car. c/u | — |
| `col_1..3 texto` | 160 car. c/u | — |

**Usar cuando**
- Tres pilares, tres perfiles, tres modelos de contratación.

**No usar cuando**
- Cuatro columnas de texto: pasa a B03 o a dos diapositivas.

```
LAYOUT: B05 — Tres columnas de texto
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | col_1..3 titulo(24 c/u) | col_1..3 texto(160 c/u)
USAR: Tres pilares, tres perfiles, tres modelos de contratación.
EVITAR: Cuatro columnas de texto: pasa a B03 o a dos diapositivas.
```

### B06 · Definición / concepto clave

**Fondo:** blanco · **Página del PDF:** 031

Fijar un término del oficio. Palabra grande, definición debajo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 20 car. | «Concepto» o «Definición» |
| `termino` | 28 car. | El término, en grande |
| `definicion` | 200 car. | — |
| `ejemplo` | 120 car. | Opcional, en caja gris |

**Usar cuando**
- Anglicismos y tecnicismos la primera vez que aparecen.

**No usar cuando**
- Definir tres términos en la misma diapositiva.

```
LAYOUT: B06 — Definición / concepto clave
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(20) | termino(28) | definicion(200) | ejemplo(120)
USAR: Anglicismos y tecnicismos la primera vez que aparecen.
EVITAR: Definir tres términos en la misma diapositiva.
```

### B07 · Texto + nota lateral

**Fondo:** blanco · **Página del PDF:** 033

Explicación principal con un aviso, matiz o dato al margen.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `texto` | 300 car. | — |
| `nota_titulo` | 24 car. | «Ojo», «Atención», «Truco» |
| `nota_texto` | 160 car. | — |

**Usar cuando**
- Advertencias legales o fiscales. Excepciones a la regla.

**No usar cuando**
- Usar la nota para contenido principal: si es importante, va en el cuerpo.

```
LAYOUT: B07 — Texto + nota lateral
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | texto(300) | nota_titulo(24) | nota_texto(160)
USAR: Advertencias legales o fiscales. Excepciones a la regla.
EVITAR: Usar la nota para contenido principal: si es importante, va en el cuerpo.
```

### B08 · Frase manifiesto

**Fondo:** tinta `#161616` · **Página del PDF:** 035

Una sola frase a pantalla completa. Corta el ritmo y fija una idea.

| Zona | Límite | Nota |
|---|---|---|
| `frase` | 90 car. · 2 líneas | Sin comillas: no es una cita, es una afirmación |

**Usar cuando**
- Abrir o cerrar un bloque con fuerza.

**No usar cuando**
- Más de 90 caracteres. Usarla más de dos veces por sesión.

```
LAYOUT: B08 — Frase manifiesto
FAMILIA: Texto
FONDO: tinta #161616
ZONAS: frase(90/2 líneas)
USAR: Abrir o cerrar un bloque con fuerza.
EVITAR: Más de 90 caracteres. Usarla más de dos veces por sesión.
```

### B09 · Pregunta detonante

**Fondo:** blanco · **Página del PDF:** 037

Lanzar una pregunta al aula antes de dar la respuesta.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 24 car. | «Pregunta» o «Para pensar» |
| `pregunta` | 90 car. · 2 líneas | Termina en ? |
| `pista` | 110 car. | Opcional |

**Usar cuando**
- Antes de un concepto contraintuitivo. Abrir debate.

**No usar cuando**
- Preguntas retóricas sin respuesta posterior.

```
LAYOUT: B09 — Pregunta detonante
FAMILIA: Texto
FONDO: blanco
ZONAS: etiqueta(24) | pregunta(90/2 líneas) | pista(110)
USAR: Antes de un concepto contraintuitivo. Abrir debate.
EVITAR: Preguntas retóricas sin respuesta posterior.
```

---

## Familia · Imagen

### C01 · Texto + imagen (7+5)

**Fondo:** blanco · **Página del PDF:** 039

Explicación a la izquierda, captura o diagrama a la derecha. El caballo de batalla.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. · 2 líneas | — |
| `texto` | 220 car. | — |
| `vineta_1..3` | 55 car. c/u | Opcionales |
| `imagen` | — | Captura real, filete 1 px, sin sombra |
| `pie_imagen` | 60 car. | Opcional |

**Usar cuando**
- Mostrar una herramienta mientras se explica. Walkthroughs.

**No usar cuando**
- Imágenes decorativas sin información.

```
LAYOUT: C01 — Texto + imagen (7+5)
FAMILIA: Imagen
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55/2 líneas) | texto(220) | vineta_1..3(55 c/u) | imagen(—) | pie_imagen(60)
USAR: Mostrar una herramienta mientras se explica. Walkthroughs.
EVITAR: Imágenes decorativas sin información.
```

### C02 · Imagen + texto (5+7)

**Fondo:** blanco · **Página del PDF:** 041

La misma composición invertida. Alterna con C01 para no repetir ritmo.

| Zona | Límite | Nota |
|---|---|---|
| `imagen` | — | — |
| `pie_imagen` | 60 car. | Opcional |
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `texto` | 260 car. | — |
| `vineta_1..3` | 55 car. c/u | — |

**Usar cuando**
- Cuando la imagen es lo primero que hay que mirar.

**No usar cuando**
- Alternar sin criterio en cada diapositiva: marea.

```
LAYOUT: C02 — Imagen + texto (5+7)
FAMILIA: Imagen
FONDO: blanco
ZONAS: imagen(—) | pie_imagen(60) | etiqueta(30) | titulo(55) | texto(260) | vineta_1..3(55 c/u)
USAR: Cuando la imagen es lo primero que hay que mirar.
EVITAR: Alternar sin criterio en cada diapositiva: marea.
```

### C03 · Foto a sangre con texto

**Fondo:** tinta `#161616` · **Página del PDF:** 043

Fotografía que ocupa toda la diapositiva con un titular encima.

| Zona | Límite | Nota |
|---|---|---|
| `foto` | — | A sangre, velo rgba(0,0,0,.5) |
| `etiqueta` | 30 car. | — |
| `titulo` | 70 car. · 2 líneas | — |
| `pie` | 70 car. | Fuente o crédito |

**Usar cuando**
- Contexto emocional: un país, un espacio de trabajo, un evento.

**No usar cuando**
- Texto sobre la zona clara de la foto. Fotos con marca de agua.

```
LAYOUT: C03 — Foto a sangre con texto
FAMILIA: Imagen
FONDO: tinta #161616
ZONAS: foto(—) | etiqueta(30) | titulo(70/2 líneas) | pie(70)
USAR: Contexto emocional: un país, un espacio de trabajo, un evento.
EVITAR: Texto sobre la zona clara de la foto. Fotos con marca de agua.
```

### C04 · Imagen a pantalla completa

**Fondo:** blanco · **Página del PDF:** 045

Una captura o diagrama que necesita todo el ancho, dentro de la zona segura.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 50 car. | Sobre la imagen |
| `imagen` | — | — |
| `pie_imagen` | 90 car. | Fuente o explicación |

**Usar cuando**
- Pantallazos densos: dashboards, hojas de cálculo, flujos.

**No usar cuando**
- Imágenes que necesiten zoom para leerse: recórtalas.

```
LAYOUT: C04 — Imagen a pantalla completa
FAMILIA: Imagen
FONDO: blanco
ZONAS: titulo(50) | imagen(—) | pie_imagen(90)
USAR: Pantallazos densos: dashboards, hojas de cálculo, flujos.
EVITAR: Imágenes que necesiten zoom para leerse: recórtalas.
```

### C05 · Galería de tres

**Fondo:** blanco · **Página del PDF:** 047

Tres imágenes comparables, cada una con su pie.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `imagen_1..3` | — | — |
| `pie_1..3` | 45 car. c/u | — |

**Usar cuando**
- Tres ejemplos de lo mismo: tres portfolios, tres CV, tres perfiles.

**No usar cuando**
- Imágenes de proporciones distintas: recorta todas a 4:3.

```
LAYOUT: C05 — Galería de tres
FAMILIA: Imagen
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | imagen_1..3(—) | pie_1..3(45 c/u)
USAR: Tres ejemplos de lo mismo: tres portfolios, tres CV, tres perfiles.
EVITAR: Imágenes de proporciones distintas: recorta todas a 4:3.
```

### C06 · Mosaico de cuatro

**Fondo:** blanco · **Página del PDF:** 049

Cuatro imágenes en rejilla 2×2 con una idea al lado.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `texto` | 180 car. | — |
| `imagen_1..4` | — | — |

**Usar cuando**
- Mostrar variedad: herramientas, países, formatos de contenido.

**No usar cuando**
- Rellenar con imágenes que no aportan solo para completar la rejilla.

```
LAYOUT: C06 — Mosaico de cuatro
FAMILIA: Imagen
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | texto(180) | imagen_1..4(—)
USAR: Mostrar variedad: herramientas, países, formatos de contenido.
EVITAR: Rellenar con imágenes que no aportan solo para completar la rejilla.
```

### C07 · Antes / después

**Fondo:** blanco · **Página del PDF:** 051

Dos imágenes enfrentadas que muestran una transformación.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 50 car. | — |
| `antes_etiqueta` | 12 car. | «Antes» |
| `antes_imagen` | — | — |
| `antes_pie` | 60 car. | — |
| `despues_etiqueta` | 12 car. | «Después» |
| `despues_imagen` | — | — |
| `despues_pie` | 60 car. | — |

**Usar cuando**
- CV, perfil de LinkedIn, propuesta comercial, web antes y después.

**No usar cuando**
- Un «después» exagerado o inventado: pierde credibilidad.

```
LAYOUT: C07 — Antes / después
FAMILIA: Imagen
FONDO: blanco
ZONAS: titulo(50) | antes_etiqueta(12) | antes_imagen(—) | antes_pie(60) | despues_etiqueta(12) | despues_imagen(—) | despues_pie(60)
USAR: CV, perfil de LinkedIn, propuesta comercial, web antes y después.
EVITAR: Un «después» exagerado o inventado: pierde credibilidad.
```

### C08 · Captura anotada

**Fondo:** blanco · **Página del PDF:** 053

Una captura con llamadas numeradas y su leyenda al lado.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `imagen` | — | Con rectángulos de 2 px en el acento |
| `nota_1..4` | 70 car. c/u | Numeradas, coinciden con las llamadas de la imagen |

**Usar cuando**
- Walkthroughs de herramientas. Explicar una interfaz paso a paso.

**No usar cuando**
- Más de 4 llamadas. Flechas a mano alzada.

```
LAYOUT: C08 — Captura anotada
FAMILIA: Imagen
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | imagen(—) | nota_1..4(70 c/u)
USAR: Walkthroughs de herramientas. Explicar una interfaz paso a paso.
EVITAR: Más de 4 llamadas. Flechas a mano alzada.
```

---

## Familia · Vídeo

### D01 · Vídeo a pantalla completa

**Fondo:** blanco · **Página del PDF:** 055

Reproducir un vídeo como contenido principal de la diapositiva.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 45 car. | — |
| `video` | — | Incrustado, nunca enlazado. Con subtítulos |
| `duracion` | 10 car. | mm:ss |
| `fuente` | 60 car. | — |

**Usar cuando**
- Fragmentos de entrevista, demos grabadas, casos de alumnos.

**No usar cuando**
- Vídeos de más de 3 min sin pausa. Vídeo sin subtítulos.

```
LAYOUT: D01 — Vídeo a pantalla completa
FAMILIA: Vídeo
FONDO: blanco
ZONAS: titulo(45) | video(—) | duracion(10) | fuente(60)
USAR: Fragmentos de entrevista, demos grabadas, casos de alumnos.
EVITAR: Vídeos de más de 3 min sin pausa. Vídeo sin subtítulos.
```

### D02 · Vídeo + puntos clave

**Fondo:** blanco · **Página del PDF:** 057

Vídeo a un lado y qué hay que observar en él al otro.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `video` | — | — |
| `duracion` | 10 car. | — |
| `punto_1..4` | 60 car. c/u | Qué mirar mientras se reproduce |

**Usar cuando**
- Vídeos de análisis: una negociación, una llamada de ventas, una demo.

**No usar cuando**
- Poner los puntos después del vídeo: el alumno debe saber qué mirar antes.

```
LAYOUT: D02 — Vídeo + puntos clave
FAMILIA: Vídeo
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | video(—) | duracion(10) | punto_1..4(60 c/u)
USAR: Vídeos de análisis: una negociación, una llamada de ventas, una demo.
EVITAR: Poner los puntos después del vídeo: el alumno debe saber qué mirar antes.
```

### D03 · Demo en vivo

**Fondo:** blanco · **Página del PDF:** 059

Marcador de pantalla compartida: el docente sale del deck y enseña la herramienta.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 20 car. | «Demo en vivo» |
| `titulo` | 45 car. | — |
| `herramienta` | 24 car. | Qué se va a abrir |
| `paso_1..4` | 60 car. c/u | Guion de la demo |
| `plan_b` | 80 car. | Qué hacer si falla la conexión |

**Usar cuando**
- Antes de compartir pantalla. Deja el guion visible para el alumno.

**No usar cuando**
- Demo sin guion escrito: si algo falla, se pierde la clase.

```
LAYOUT: D03 — Demo en vivo
FAMILIA: Vídeo
FONDO: blanco
ZONAS: etiqueta(20) | titulo(45) | herramienta(24) | paso_1..4(60 c/u) | plan_b(80)
USAR: Antes de compartir pantalla. Deja el guion visible para el alumno.
EVITAR: Demo sin guion escrito: si algo falla, se pierde la clase.
```

### D04 · Audio / entrevista

**Fondo:** blanco · **Página del PDF:** 061

Fragmento de audio o podcast con su transcripción destacada.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `audio` | — | Reproductor incrustado |
| `duracion` | 10 car. | — |
| `cita_transcrita` | 160 car. | — |
| `quien` | 40 car. | — |

**Usar cuando**
- Entrevistas a empleadores, clientes o exalumnos.

**No usar cuando**
- Audio sin transcripción: rompe la accesibilidad.

```
LAYOUT: D04 — Audio / entrevista
FAMILIA: Vídeo
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | audio(—) | duracion(10) | cita_transcrita(160) | quien(40)
USAR: Entrevistas a empleadores, clientes o exalumnos.
EVITAR: Audio sin transcripción: rompe la accesibilidad.
```

### D05 · Bucle / GIF + explicación

**Fondo:** blanco · **Página del PDF:** 063

Vídeo corto en bucle sin sonido que muestra una interacción, con el texto al lado.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `texto` | 220 car. | — |
| `loop` | — | Máx. 10 s, sin audio, en bucle |
| `pie` | 50 car. | — |

**Usar cuando**
- Enseñar un clic, un atajo, una automatización que ocurre en segundos.

**No usar cuando**
- Bucles largos: distraen mientras hablas.

```
LAYOUT: D05 — Bucle / GIF + explicación
FAMILIA: Vídeo
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | texto(220) | loop(—) | pie(50)
USAR: Enseñar un clic, un atajo, una automatización que ocurre en segundos.
EVITAR: Bucles largos: distraen mientras hablas.
```

---

## Familia · Recursos

### E01 · Recurso destacado

**Fondo:** blanco · **Página del PDF:** 065

Un único enlace importante, con QR para abrirlo desde el móvil.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 24 car. | «Recurso» o «Enlace» |
| `titulo` | 45 car. | — |
| `texto` | 180 car. | — |
| `url` | 60 car. | Visible y escrita, no acortada |
| `qr` | — | Apunta a la misma URL |

**Usar cuando**
- Plantillas, calculadoras, formularios, comunidades.

**No usar cuando**
- URLs acortadas o con parámetros de seguimiento larguísimos.

```
LAYOUT: E01 — Recurso destacado
FAMILIA: Recursos
FONDO: blanco
ZONAS: etiqueta(24) | titulo(45) | texto(180) | url(60) | qr(—)
USAR: Plantillas, calculadoras, formularios, comunidades.
EVITAR: URLs acortadas o con parámetros de seguimiento larguísimos.
```

### E02 · Lista de recursos

**Fondo:** blanco · **Página del PDF:** 067

Cuatro a seis enlaces agrupados, cada uno con su para qué.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `recurso_1..6 nombre` | 30 car. c/u | — |
| `recurso_1..6 url` | 45 car. c/u | — |
| `recurso_1..6 para_que` | 55 car. c/u | — |

**Usar cuando**
- Cierre de bloque: todo lo que se ha mencionado, junto.

**No usar cuando**
- Más de 6 enlaces en pantalla: pasa la lista al campus.

```
LAYOUT: E02 — Lista de recursos
FAMILIA: Recursos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | recurso_1..6 nombre(30 c/u) | recurso_1..6 url(45 c/u) | recurso_1..6 para_que(55 c/u)
USAR: Cierre de bloque: todo lo que se ha mencionado, junto.
EVITAR: Más de 6 enlaces en pantalla: pasa la lista al campus.
```

### E03 · Descarga de plantilla

**Fondo:** tinta `#161616` · **Página del PDF:** 069

Entregar un archivo: plantilla, checklist, hoja de cálculo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 24 car. | «Descarga» |
| `titulo` | 45 car. | — |
| `que_incluye_1..3` | 50 car. c/u | — |
| `url` | 60 car. | — |
| `qr` | — | — |
| `formato` | 24 car. | Notion · Sheets · PDF |

**Usar cuando**
- Cada entregable del curso tiene su plantilla.

**No usar cuando**
- Plantillas sin ejemplo relleno: el alumno se queda en blanco.

```
LAYOUT: E03 — Descarga de plantilla
FAMILIA: Recursos
FONDO: tinta #161616
ZONAS: etiqueta(24) | titulo(45) | que_incluye_1..3(50 c/u) | url(60) | qr(—) | formato(24)
USAR: Cada entregable del curso tiene su plantilla.
EVITAR: Plantillas sin ejemplo relleno: el alumno se queda en blanco.
```

### E04 · Herramienta del stack

**Fondo:** blanco · **Página del PDF:** 071

Presentar una herramienta: qué es, para qué la usamos y dónde está.

| Zona | Límite | Nota |
|---|---|---|
| `logo` | — | Logo monocromo de public/logos/tools/ |
| `nombre` | 24 car. | — |
| `categoria` | 30 car. | — |
| `texto` | 200 car. | — |
| `uso_1..3` | 55 car. c/u | — |
| `url` | 45 car. | — |
| `captura` | — | Pantalla real de la herramienta |

**Usar cuando**
- Notion, Slack, Wise, Deel, Zapier, LLMs…

**No usar cuando**
- Logos a color mezclados con monocromos. Tutoriales completos: eso es C01 en serie.

```
LAYOUT: E04 — Herramienta del stack
FAMILIA: Recursos
FONDO: blanco
ZONAS: logo(—) | nombre(24) | categoria(30) | texto(200) | uso_1..3(55 c/u) | url(45) | captura(—)
USAR: Notion, Slack, Wise, Deel, Zapier, LLMs…
EVITAR: Logos a color mezclados con monocromos. Tutoriales completos: eso es C01 en serie.
```

### E05 · Stack completo

**Fondo:** blanco · **Página del PDF:** 073

Rejilla de logos: todo el stack del módulo de un vistazo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `texto` | 160 car. | — |
| `logo_1..10` | — | Todos monocromos, misma altura óptica |
| `pie_logo_1..10` | 16 car. c/u | — |

**Usar cuando**
- Abrir o cerrar un módulo de herramientas.

**No usar cuando**
- Mezclar logos a color y monocromos. Alturas ópticas distintas.

```
LAYOUT: E05 — Stack completo
FAMILIA: Recursos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | texto(160) | logo_1..10(—) | pie_logo_1..10(16 c/u)
USAR: Abrir o cerrar un módulo de herramientas.
EVITAR: Mezclar logos a color y monocromos. Alturas ópticas distintas.
```

---

## Familia · Datos

### F01 · Tabla

**Fondo:** blanco · **Página del PDF:** 075

Datos comparables en filas y columnas.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `cabecera_1..4` | 18 car. c/u | Mayúsculas |
| `celda` | 28 car. c/u | Máx. 6 filas × 4 columnas |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Comparar herramientas, países, modelos de contratación, precios.

**No usar cuando**
- Más de 6 filas o 4 columnas. Sombreado alterno. Bordes verticales.

```
LAYOUT: F01 — Tabla
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | cabecera_1..4(18 c/u) | celda(28 c/u) | fuente(70)
USAR: Comparar herramientas, países, modelos de contratación, precios.
EVITAR: Más de 6 filas o 4 columnas. Sombreado alterno. Bordes verticales.
```

### F02 · Tabla de decisión

**Fondo:** blanco · **Página del PDF:** 077

Comparativa con marcas de sí / no en vez de texto.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 50 car. | — |
| `criterio_1..5` | 34 car. c/u | Filas |
| `opcion_1..3` | 18 car. c/u | Columnas |
| `valor` | ✓ / — / texto de 12 car. | — |

**Usar cuando**
- Elegir entre herramientas, tipos de contrato, países de residencia.

**No usar cuando**
- Marcar con solo color: el ✓ y el — deben ser caracteres.

```
LAYOUT: F02 — Tabla de decisión
FAMILIA: Datos
FONDO: blanco
ZONAS: titulo(50) | criterio_1..5(34 c/u) | opcion_1..3(18 c/u) | valor(✓ / — / texto de 12)
USAR: Elegir entre herramientas, tipos de contrato, países de residencia.
EVITAR: Marcar con solo color: el ✓ y el — deben ser caracteres.
```

### F03 · Gráfico de barras

**Fondo:** blanco · **Página del PDF:** 079

Una serie de datos con su lectura escrita al lado.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `grafico` | — | Barras en tinta; la protagonista en el acento |
| `etiqueta_eje_1..6` | 10 car. c/u | — |
| `lectura` | 180 car. | Qué hay que ver |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Salarios por país, evolución de ofertas, reparto de mercado.

**No usar cuando**
- 3D, sombras, ejes sin etiquetar, leyendas que solo se distinguen por color.

```
LAYOUT: F03 — Gráfico de barras
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | grafico(—) | etiqueta_eje_1..6(10 c/u) | lectura(180) | fuente(70)
USAR: Salarios por país, evolución de ofertas, reparto de mercado.
EVITAR: 3D, sombras, ejes sin etiquetar, leyendas que solo se distinguen por color.
```

### F04 · Evolución / línea

**Fondo:** blanco · **Página del PDF:** 081

Un dato a lo largo del tiempo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `grafico` | — | Línea de 3 px en tinta |
| `hito_1..2` | 40 car. c/u | Anotaciones sobre puntos concretos |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Crecimiento del trabajo remoto, evolución salarial, estacionalidad.

**No usar cuando**
- Ejes truncados que exageran la pendiente.

```
LAYOUT: F04 — Evolución / línea
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | grafico(—) | hito_1..2(40 c/u) | fuente(70)
USAR: Crecimiento del trabajo remoto, evolución salarial, estacionalidad.
EVITAR: Ejes truncados que exageran la pendiente.
```

### F05 · Cifra destacada

**Fondo:** blanco · **Página del PDF:** 083

Una a tres cifras que sostienen un argumento.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 40 car. | — |
| `cifra_1..3` | 5 car. c/u | — |
| `pie_cifra_1..3` | 30 car. c/u | — |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Abrir un bloque con un dato de impacto. Cerrar un argumento.

**No usar cuando**
- Cifras sin fuente. Más de 3 cifras.

```
LAYOUT: F05 — Cifra destacada
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(40) | cifra_1..3(5 c/u) | pie_cifra_1..3(30 c/u) | fuente(70)
USAR: Abrir un bloque con un dato de impacto. Cerrar un argumento.
EVITAR: Cifras sin fuente. Más de 3 cifras.
```

### F06 · Panel de KPIs

**Fondo:** blanco · **Página del PDF:** 085

Cuatro métricas juntas, como un cuadro de mando.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `kpi_1..4 valor` | 6 car. c/u | — |
| `kpi_1..4 etiqueta` | 26 car. c/u | — |
| `kpi_1..4 nota` | 30 car. c/u | Variación o contexto |

**Usar cuando**
- Resultados de la cohorte, métricas de un negocio, salud de un pipeline.

**No usar cuando**
- Cuatro cifras sin relación entre sí.

```
LAYOUT: F06 — Panel de KPIs
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | kpi_1..4 valor(6 c/u) | kpi_1..4 etiqueta(26 c/u) | kpi_1..4 nota(30 c/u)
USAR: Resultados de la cohorte, métricas de un negocio, salud de un pipeline.
EVITAR: Cuatro cifras sin relación entre sí.
```

### F07 · Distribución en porcentajes

**Fondo:** blanco · **Página del PDF:** 087

Reparto de un total entre 4 o 5 categorías, en barras horizontales.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `categoria_1..5` | 34 car. c/u | — |
| `porcentaje_1..5` | 4 car. c/u | — |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Reparto de tiempo, de ingresos, de canales de captación.

**No usar cuando**
- Gráfico de tarta. Porcentajes que no suman 100 sin explicarlo.

```
LAYOUT: F07 — Distribución en porcentajes
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | categoria_1..5(34 c/u) | porcentaje_1..5(4 c/u) | fuente(70)
USAR: Reparto de tiempo, de ingresos, de canales de captación.
EVITAR: Gráfico de tarta. Porcentajes que no suman 100 sin explicarlo.
```

### F08 · Mapa / geografía

**Fondo:** blanco · **Página del PDF:** 089

Dato por país o región. El curso es internacional: aparece a menudo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `mapa` | — | Mapa monocromo, sin fronteras decorativas |
| `pais_1..5` | 24 car. c/u | — |
| `valor_1..5` | 10 car. c/u | — |
| `fuente` | 70 car. | Obligatoria |

**Usar cuando**
- Salarios por país, husos horarios, fiscalidad, visados de nómada digital.

**No usar cuando**
- Mapas a color con leyenda por tono: añade siempre la lista de valores.

```
LAYOUT: F08 — Mapa / geografía
FAMILIA: Datos
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | mapa(—) | pais_1..5(24 c/u) | valor_1..5(10 c/u) | fuente(70)
USAR: Salarios por país, husos horarios, fiscalidad, visados de nómada digital.
EVITAR: Mapas a color con leyenda por tono: añade siempre la lista de valores.
```

---

## Familia · Estructura

### G01 · Proceso en pasos

**Fondo:** blanco · **Página del PDF:** 091

Una secuencia de 3 o 4 pasos en orden.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 55 car. | — |
| `paso_1..4 titulo` | 24 car. c/u | — |
| `paso_1..4 texto` | 110 car. c/u | — |

**Usar cuando**
- Métodos, flujos de trabajo, procesos de negociación o alta fiscal.

**No usar cuando**
- Más de 4 pasos: parte en dos diapositivas. Flechas curvas.

```
LAYOUT: G01 — Proceso en pasos
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(55) | paso_1..4 titulo(24 c/u) | paso_1..4 texto(110 c/u)
USAR: Métodos, flujos de trabajo, procesos de negociación o alta fiscal.
EVITAR: Más de 4 pasos: parte en dos diapositivas. Flechas curvas.
```

### G02 · Cronología

**Fondo:** blanco · **Página del PDF:** 093

Hitos en el tiempo sobre una línea horizontal.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `hito_1..5 fecha` | 12 car. c/u | — |
| `hito_1..5 texto` | 55 car. c/u | — |

**Usar cuando**
- Calendario del curso, historia de una tendencia, plan a 90 días.

**No usar cuando**
- Hitos sin fecha. Más de 5 en una diapositiva.

```
LAYOUT: G02 — Cronología
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | hito_1..5 fecha(12 c/u) | hito_1..5 texto(55 c/u)
USAR: Calendario del curso, historia de una tendencia, plan a 90 días.
EVITAR: Hitos sin fecha. Más de 5 en una diapositiva.
```

### G03 · Comparativa A / B

**Fondo:** blanco · **Página del PDF:** 095

Dos opciones enfrentadas con los mismos criterios.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 50 car. | — |
| `a_etiqueta` | 16 car. | En el acento |
| `a_titulo` | 28 car. | — |
| `a_punto_1..3` | 50 car. c/u | — |
| `b_etiqueta` | 16 car. | — |
| `b_titulo` | 28 car. | — |
| `b_punto_1..3` | 50 car. c/u | — |

**Usar cuando**
- Professional vs Founder · autónomo vs empleado · antes vs después.

**No usar cuando**
- Tarjetas con distinto número de puntos.

```
LAYOUT: G03 — Comparativa A / B
FAMILIA: Estructura
FONDO: blanco
ZONAS: titulo(50) | a_etiqueta(16) | a_titulo(28) | a_punto_1..3(50 c/u) | b_etiqueta(16) | b_titulo(28) | b_punto_1..3(50 c/u)
USAR: Professional vs Founder · autónomo vs empleado · antes vs después.
EVITAR: Tarjetas con distinto número de puntos.
```

### G04 · Matriz 2×2

**Fondo:** blanco · **Página del PDF:** 097

Cuatro cuadrantes definidos por dos ejes. Herramienta de decisión.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 45 car. | — |
| `eje_x` | 24 car. | — |
| `eje_y` | 24 car. | — |
| `cuadrante_1..4 titulo` | 22 car. c/u | — |
| `cuadrante_1..4 texto` | 70 car. c/u | — |

**Usar cuando**
- Priorizar clientes, esfuerzo vs impacto, urgente vs importante.

**No usar cuando**
- Matrices con ejes que no son opuestos reales.

```
LAYOUT: G04 — Matriz 2×2
FAMILIA: Estructura
FONDO: blanco
ZONAS: titulo(45) | eje_x(24) | eje_y(24) | cuadrante_1..4 titulo(22 c/u) | cuadrante_1..4 texto(70 c/u)
USAR: Priorizar clientes, esfuerzo vs impacto, urgente vs importante.
EVITAR: Matrices con ejes que no son opuestos reales.
```

### G05 · Jerarquía / pirámide

**Fondo:** blanco · **Página del PDF:** 099

Niveles apilados, de la base al vértice.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `nivel_1..4 titulo` | 24 car. c/u | De arriba abajo |
| `nivel_1..4 texto` | 60 car. c/u | — |

**Usar cuando**
- Escalas de seniority, niveles de automatización, madurez de un negocio.

**No usar cuando**
- Más de 4 niveles: no se leen.

```
LAYOUT: G05 — Jerarquía / pirámide
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | nivel_1..4 titulo(24 c/u) | nivel_1..4 texto(60 c/u)
USAR: Escalas de seniority, niveles de automatización, madurez de un negocio.
EVITAR: Más de 4 niveles: no se leen.
```

### G06 · Diagrama de flujo

**Fondo:** blanco · **Página del PDF:** 101

Cajas conectadas con una bifurcación. Para decisiones con condición.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `nodo_1..5` | 26 car. c/u | Texto dentro de la caja, nunca flotando |
| `condicion` | 20 car. | La pregunta de la bifurcación |

**Usar cuando**
- Árboles de decisión fiscal, flujos de automatización, criba de ofertas.

**No usar cuando**
- Más de 5 nodos. Conectores curvos. Etiquetas fuera de las cajas.

```
LAYOUT: G06 — Diagrama de flujo
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | nodo_1..5(26 c/u) | condicion(20)
USAR: Árboles de decisión fiscal, flujos de automatización, criba de ofertas.
EVITAR: Más de 5 nodos. Conectores curvos. Etiquetas fuera de las cajas.
```

### G07 · Checklist

**Fondo:** blanco · **Página del PDF:** 103

Lista de verificación que el alumno puede marcar.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `item_1..6` | 60 car. c/u | Empiezan por verbo |
| `nota` | 80 car. | Opcional |

**Usar cuando**
- Antes de enviar una candidatura, antes de facturar, antes de firmar.

**No usar cuando**
- Ítems que no se pueden verificar objetivamente.

```
LAYOUT: G07 — Checklist
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | item_1..6(60 c/u) | nota(80)
USAR: Antes de enviar una candidatura, antes de facturar, antes de firmar.
EVITAR: Ítems que no se pueden verificar objetivamente.
```

### G08 · Do / Don't

**Fondo:** blanco · **Página del PDF:** 105

Buenas prácticas frente a errores, en dos columnas simétricas.

| Zona | Límite | Nota |
|---|---|---|
| `titulo` | 45 car. | — |
| `si_1..4` | 60 car. c/u | — |
| `no_1..4` | 60 car. c/u | — |

**Usar cuando**
- Redacción de un CV, mensajes en frío, presencia en llamadas.

**No usar cuando**
- Distinto número de puntos a cada lado.

```
LAYOUT: G08 — Do / Don't
FAMILIA: Estructura
FONDO: blanco
ZONAS: titulo(45) | si_1..4(60 c/u) | no_1..4(60 c/u)
USAR: Redacción de un CV, mensajes en frío, presencia en llamadas.
EVITAR: Distinto número de puntos a cada lado.
```

### G09 · Framework con siglas

**Fondo:** blanco · **Página del PDF:** 107

Un método memorizable: una letra por principio.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `sigla` | 6 car. | 3–5 letras |
| `letra_1..4 palabra` | 18 car. c/u | — |
| `letra_1..4 texto` | 70 car. c/u | — |

**Usar cuando**
- Métodos propios que el alumno debe recordar sin apuntes.

**No usar cuando**
- Siglas forzadas que no significan nada.

```
LAYOUT: G09 — Framework con siglas
FAMILIA: Estructura
FONDO: blanco
ZONAS: etiqueta(30) | sigla(6) | letra_1..4 palabra(18 c/u) | letra_1..4 texto(70 c/u)
USAR: Métodos propios que el alumno debe recordar sin apuntes.
EVITAR: Siglas forzadas que no significan nada.
```

---

## Familia · Personas

### H01 · Cita

**Fondo:** blanco · **Página del PDF:** 109

Una frase atribuida que se quiere fijar. Diapositiva de respiro.

| Zona | Límite | Nota |
|---|---|---|
| `cita` | 180 car. · comillas latinas | — |
| `atribucion` | 40 car. | En el acento del camino |

**Usar cuando**
- Cerrar una idea. Citar a un alumno, un cliente o el manifiesto.

**No usar cuando**
- Citas de más de 180 caracteres. Citas motivacionales genéricas.

```
LAYOUT: H01 — Cita
FAMILIA: Personas
FONDO: blanco
ZONAS: cita(180/comillas latinas) | atribucion(40)
USAR: Cerrar una idea. Citar a un alumno, un cliente o el manifiesto.
EVITAR: Citas de más de 180 caracteres. Citas motivacionales genéricas.
```

### H02 · Testimonio con foto

**Fondo:** blanco · **Página del PDF:** 111

Cita con la cara y el contexto de quien la dice. Mucho más creíble.

| Zona | Límite | Nota |
|---|---|---|
| `foto` | — | Retrato, recorte cuadrado |
| `cita` | 200 car. | — |
| `nombre` | 30 car. | — |
| `cargo` | 45 car. | Rol · empresa · país |
| `dato` | 30 car. | Opcional: el resultado |

**Usar cuando**
- Casos de alumnos. Voz de empleadores.

**No usar cuando**
- Testimonios sin nombre real o sin permiso.

```
LAYOUT: H02 — Testimonio con foto
FAMILIA: Personas
FONDO: blanco
ZONAS: foto(—) | cita(200) | nombre(30) | cargo(45) | dato(30)
USAR: Casos de alumnos. Voz de empleadores.
EVITAR: Testimonios sin nombre real o sin permiso.
```

### H03 · Perfil del ponente

**Fondo:** blanco · **Página del PDF:** 113

Quién da la clase y por qué se le escucha.

| Zona | Límite | Nota |
|---|---|---|
| `foto` | — | Retrato |
| `nombre` | 30 car. | — |
| `cargo` | 45 car. | — |
| `bio` | 240 car. | — |
| `hito_1..3` | 40 car. c/u | Credenciales concretas |
| `link` | 45 car. | LinkedIn |

**Usar cuando**
- Segunda diapositiva de la primera sesión de cada docente.

**No usar cuando**
- Bios de más de 240 caracteres. Adjetivos sin datos.

```
LAYOUT: H03 — Perfil del ponente
FAMILIA: Personas
FONDO: blanco
ZONAS: foto(—) | nombre(30) | cargo(45) | bio(240) | hito_1..3(40 c/u) | link(45)
USAR: Segunda diapositiva de la primera sesión de cada docente.
EVITAR: Bios de más de 240 caracteres. Adjetivos sin datos.
```

### H04 · Caso real

**Fondo:** blanco · **Página del PDF:** 115

Un caso concreto: situación de partida, qué hizo, qué consiguió.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 24 car. | «Caso» |
| `titulo` | 45 car. | — |
| `foto` | — | Opcional |
| `punto_partida` | 140 car. | — |
| `que_hizo` | 140 car. | — |
| `resultado` | 140 car. | — |
| `cifra` | 6 car. | El resultado en un número |

**Usar cuando**
- Después de explicar un método: aquí está funcionando de verdad.

**No usar cuando**
- Casos anónimos o inventados. Resultados sin cifra.

```
LAYOUT: H04 — Caso real
FAMILIA: Personas
FONDO: blanco
ZONAS: etiqueta(24) | titulo(45) | foto(—) | punto_partida(140) | que_hizo(140) | resultado(140) | cifra(6)
USAR: Después de explicar un método: aquí está funcionando de verdad.
EVITAR: Casos anónimos o inventados. Resultados sin cifra.
```

### H05 · Logos de empresas

**Fondo:** blanco · **Página del PDF:** 117

Prueba social: dónde han acabado los alumnos o con quién trabajamos.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `logo_1..8` | — | Escala de grises, misma altura óptica |
| `pie` | 70 car. | Aclaración honesta de qué significa la lista |

**Usar cuando**
- Cierre de bloque de empleabilidad.

**No usar cuando**
- Logos de empresas sin relación real: es engañoso.

```
LAYOUT: H05 — Logos de empresas
FAMILIA: Personas
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | logo_1..8(—) | pie(70)
USAR: Cierre de bloque de empleabilidad.
EVITAR: Logos de empresas sin relación real: es engañoso.
```

---

## Familia · Actividad

### I01 · Ejercicio práctico

**Fondo:** blanco · **Página del PDF:** 119

La actividad en vivo. Una por bloque como mínimo.

| Zona | Límite | Nota |
|---|---|---|
| `duracion` | 18 car. | EJERCICIO · NN MIN |
| `titulo` | 50 car. | Imperativo |
| `paso_1..4` | 90 car. c/u | — |
| `entregable` | 90 car. | Qué se sube al campus |
| `imagen` | — | Opcional: plantilla o ejemplo |

**Usar cuando**
- Toda actividad con reloj. Es el 40 % del tiempo de clase.

**No usar cuando**
- Ejercicio sin entregable. Ejercicio sin tiempo asignado.

```
LAYOUT: I01 — Ejercicio práctico
FAMILIA: Actividad
FONDO: blanco
ZONAS: duracion(18) | titulo(50) | paso_1..4(90 c/u) | entregable(90) | imagen(—)
USAR: Toda actividad con reloj. Es el 40 % del tiempo de clase.
EVITAR: Ejercicio sin entregable. Ejercicio sin tiempo asignado.
```

### I02 · Trabajo en grupo

**Fondo:** blanco · **Página del PDF:** 121

Dinámica en salas pequeñas, con roles y tiempos.

| Zona | Límite | Nota |
|---|---|---|
| `duracion` | 20 car. | GRUPOS · NN MIN |
| `titulo` | 45 car. | — |
| `consigna` | 180 car. | — |
| `rol_1..3` | 40 car. c/u | Quién hace qué en el grupo |
| `puesta_en_comun` | 60 car. | Cuánto dura y qué se comparte |

**Usar cuando**
- Sesiones largas. Temas donde el debate aporta más que la explicación.

**No usar cuando**
- Grupos sin rol asignado: siempre habla el mismo.

```
LAYOUT: I02 — Trabajo en grupo
FAMILIA: Actividad
FONDO: blanco
ZONAS: duracion(20) | titulo(45) | consigna(180) | rol_1..3(40 c/u) | puesta_en_comun(60)
USAR: Sesiones largas. Temas donde el debate aporta más que la explicación.
EVITAR: Grupos sin rol asignado: siempre habla el mismo.
```

### I03 · Quiz de repaso

**Fondo:** blanco · **Página del PDF:** 123

Pregunta con opciones para comprobar comprensión en directo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 20 car. | «Repaso» |
| `pregunta` | 110 car. | — |
| `opcion_a..d` | 55 car. c/u | — |
| `pista` | 70 car. | Opcional |

**Usar cuando**
- Cierre de bloque. Antes de una pausa.

**No usar cuando**
- Preguntas con dos respuestas válidas. Marcar la correcta en la diapositiva.

```
LAYOUT: I03 — Quiz de repaso
FAMILIA: Actividad
FONDO: blanco
ZONAS: etiqueta(20) | pregunta(110) | opcion_a..d(55 c/u) | pista(70)
USAR: Cierre de bloque. Antes de una pausa.
EVITAR: Preguntas con dos respuestas válidas. Marcar la correcta en la diapositiva.
```

### I04 · Plantilla a rellenar

**Fondo:** blanco · **Página del PDF:** 125

Un esquema con huecos que el alumno completa en directo.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 24 car. | — |
| `titulo` | 45 car. | — |
| `instruccion` | 120 car. | — |
| `campo_1..4 etiqueta` | 26 car. c/u | — |
| `url_plantilla` | 45 car. | Dónde está la copia editable |

**Usar cuando**
- Propuesta de valor, banda salarial, guion de llamada, oferta.

**No usar cuando**
- Más de 4 campos en pantalla: el resto va en la plantilla descargable.

```
LAYOUT: I04 — Plantilla a rellenar
FAMILIA: Actividad
FONDO: blanco
ZONAS: etiqueta(24) | titulo(45) | instruccion(120) | campo_1..4 etiqueta(26 c/u) | url_plantilla(45)
USAR: Propuesta de valor, banda salarial, guion de llamada, oferta.
EVITAR: Más de 4 campos en pantalla: el resto va en la plantilla descargable.
```

### I05 · Errores comunes

**Fondo:** blanco · **Página del PDF:** 127

Los tres fallos que casi todo el mundo comete, y su corrección.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 45 car. | — |
| `error_1..3` | 55 car. c/u | — |
| `correccion_1..3` | 70 car. c/u | — |

**Usar cuando**
- Después de un ejercicio, antes de que lo repitan mal.

**No usar cuando**
- Listar errores sin decir qué hacer en su lugar.

```
LAYOUT: I05 — Errores comunes
FAMILIA: Actividad
FONDO: blanco
ZONAS: etiqueta(30) | titulo(45) | error_1..3(55 c/u) | correccion_1..3(70 c/u)
USAR: Después de un ejercicio, antes de que lo repitan mal.
EVITAR: Listar errores sin decir qué hacer en su lugar.
```

---

## Familia · Cierre

### I06 · Resumen del bloque

**Fondo:** blanco · **Página del PDF:** 129

Tres ideas que hay que retener. Antes de cambiar de bloque.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 30 car. | — |
| `titulo` | 50 car. | — |
| `idea_1..3 titulo` | 30 car. c/u | — |
| `idea_1..3 texto` | 110 car. c/u | — |

**Usar cuando**
- Cierre de bloque, antes del separador siguiente.

**No usar cuando**
- Repetir literalmente las viñetas ya vistas: reformula.

```
LAYOUT: I06 — Resumen del bloque
FAMILIA: Cierre
FONDO: blanco
ZONAS: etiqueta(30) | titulo(50) | idea_1..3 titulo(30 c/u) | idea_1..3 texto(110 c/u)
USAR: Cierre de bloque, antes del separador siguiente.
EVITAR: Repetir literalmente las viñetas ya vistas: reformula.
```

### I07 · Tarea con plazo

**Fondo:** blanco · **Página del PDF:** 131

El entregable de la semana: qué, cómo, cuándo y dónde se entrega.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 20 car. | «Tarea» |
| `titulo` | 50 car. | — |
| `descripcion` | 200 car. | — |
| `criterio_1..3` | 55 car. c/u | Cómo se evalúa |
| `fecha` | 24 car. | — |
| `canal` | 24 car. | Campus o #canal de Slack |
| `url` | 45 car. | — |

**Usar cuando**
- Toda tarea entre sesiones.

**No usar cuando**
- Tareas sin criterio de evaluación ni fecha exacta.

```
LAYOUT: I07 — Tarea con plazo
FAMILIA: Cierre
FONDO: blanco
ZONAS: etiqueta(20) | titulo(50) | descripcion(200) | criterio_1..3(55 c/u) | fecha(24) | canal(24) | url(45)
USAR: Toda tarea entre sesiones.
EVITAR: Tareas sin criterio de evaluación ni fecha exacta.
```

### I08 · Cierre y siguiente paso

**Fondo:** tinta `#161616` · **Página del PDF:** 133

Última diapositiva. Una acción concreta con fecha y canal.

| Zona | Límite | Nota |
|---|---|---|
| `etiqueta` | 40 car. | «Antes de la próxima sesión» |
| `accion` | 60 car. · 2 líneas | Imperativo |
| `detalle` | 80 car. | Fecha límite · canal |

**Usar cuando**
- Cerrar toda sesión.

**No usar cuando**
- «¿Preguntas?» · «Gracias por vuestra atención» · diapositiva en blanco.

```
LAYOUT: I08 — Cierre y siguiente paso
FAMILIA: Cierre
FONDO: tinta #161616
ZONAS: etiqueta(40) | accion(60/2 líneas) | detalle(80)
USAR: Cerrar toda sesión.
EVITAR: «¿Preguntas?» · «Gracias por vuestra atención» · diapositiva en blanco.
```

---

**ActiveXRemote — The Remote Business School**

Plantillas de diapositiva · v2.0 · Documento interno