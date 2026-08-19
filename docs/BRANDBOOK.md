# ActiveXRemote — Brandbook & Design System

**Versión 1.0 · Agosto de 2026 · Uso interno**

Guía de marca, identidad visual y sistema de diseño del Campus. Documento de referencia para el profesorado: cómo diseñar presentaciones que se vean ActiveXRemote.

> Refleja el estado del código en `main` a agosto de 2026. Cuando cambien los tokens del campus, cambia este documento.

---

## Índice

| | Sección |
|---|---|
| [0](#0-una-marca-dos-registros) | Una marca, dos registros |
| [1](#1-el-símbolo-δx) | El símbolo ΔX |
| [2](#2-wordmark-y-lockups) | Wordmark, lockups y zona de respeto |
| [3](#3-usos-incorrectos) | Usos incorrectos |
| [4](#4-paleta-campus--monocroma) | Paleta Campus — monocroma |
| [5](#5-paleta-pública--remote-professional) | Paleta pública — Remote Professional |
| [6](#6-paleta-pública--remote-founder) | Paleta pública — Remote Founder |
| [7](#7-uso-del-color-y-accesibilidad) | Uso del color y accesibilidad |
| [8](#8-tipografía) | Tipografía |
| [9](#9-escala-tipográfica) | Escala tipográfica |
| [10](#10-elementos-gráficos-de-marca) | Elementos gráficos de marca |
| [11](#11-componentes) | Componentes |
| [12](#12-iconografía-e-imagen) | Iconografía e imagen |
| [13](#13-tono-de-voz-y-copy) | Tono de voz y copy |
| [14](#14-retícula-de-diapositiva-169) | Retícula de diapositiva 16:9 |
| [15](#15-escala-tipográfica-de-proyección) | Escala tipográfica de proyección |
| [16](#16-plantillas-de-diapositiva) | Plantillas de diapositiva |
| [17](#17-reglas-para-el-profesorado) | Reglas para el profesorado |
| [18](#18-checklist-y-recursos) | Checklist y recursos |

---

## 0. Una marca, dos registros

ActiveXRemote habla con dos voces visuales que comparten la misma tipografía, el mismo símbolo y el mismo tono. Sabemos cuál usar por el **contexto**, no por el gusto.

### Sistema A — Campus

Monocromo, esquinas rectas, sombra dura. Herramienta de trabajo: sobrio, denso, legible durante horas.

`#161616` · `#525252` · `#E0E0E0` · `#F4F4F4`

### Sistema B — Público

Color, gradientes, píldoras y esquinas suaves. Captación y comunicación: energía, promesa, movimiento.

`#5B4BF5` · `#E4462F` · gradientes · `#F4F3FB`

### ¿Y para las presentaciones de clase?

Las diapositivas de curso usan el **Sistema Campus** como base —es el entorno donde el alumno vive el programa— y toman del Sistema Público **un único acento de color** según el camino:

- Morado `#5B4BF5` → Remote Professional
- Rojo `#E4462F` → Remote Founder

Nada más. Ver secciones 14–17.

---

## 1. El símbolo ΔX

Dos formas geométricas construyen el nombre: un **triángulo** que lee como **A** (Active) y un **reloj de arena** que lee como **X** (Remote, sin fronteras — el tiempo que cruza husos horarios).

El símbolo carga todo el carácter de marca. Por eso el nombre se escribe en Inter neutra: si la letra también fuera excéntrica, el conjunto sería ilegible.

> **Aprendizaje real:** el wordmark usó Major Mono Display y hubo que retirarlo — sus glifos convertían la A en triángulo y la R en Ʀ.

### Construcción

| | |
|---|---|
| Caja del glifo | 46 × 28 unidades (viewBox) |
| Trazo | 2 unidades · `stroke-linejoin: miter` |
| Color | `currentColor` — hereda del contexto |
| Proporción | ancho = alto × 46 / 28 ≈ 1,64 |
| Versiones | Contorno (por defecto) · Sólido (favicon, tamaños < 16 px) |

### Versiones

| Versión | Uso |
|---|---|
| Positivo, contorno tinta | Fondo claro |
| Negativo, contorno blanco | Fondo tinta u oscuro |
| Sólido blanco sobre tinta | Favicon, app, tamaños muy pequeños |

**Nunca redibujar el símbolo a mano.** Se usa siempre el SVG del repositorio: `src/components/brand-mark.tsx` (componente) y `src/app/icon.svg` (versión sólida).

---

## 2. Wordmark y lockups

| Lockup | Uso |
|---|---|
| **Horizontal** (símbolo + wordmark) | El uso principal |
| **Vertical + tagline** | Portadas y cierres |
| **Wordmark solo** | Cuando el símbolo ya está presente en la pieza |

Tagline: `THE REMOTE BUSINESS SCHOOL`

### Especificación del wordmark

| | |
|---|---|
| Tipografía | Inter — nunca otra |
| Peso | 700 (Bold) |
| Caja | MAYÚSCULAS siempre |
| Tracking | 0,14 em (140/1000) |
| Escritura | Una sola palabra, sin espacio ni guion: **ActiveXRemote** en texto corrido, **ACTIVEXREMOTE** como marca |

### Zona de respeto

El margen libre alrededor del logo equivale a la **altura del símbolo (X)** por cada lado. Ningún texto, imagen ni borde entra en esa zona.

### Tamaños mínimos

| Soporte | Símbolo | Lockup |
|---|---|---|
| Pantalla | 16 px de alto | 110 px de ancho |
| Diapositiva 16:9 (1920×1080) | 28 px | 180 px |
| Impresión | 5 mm de alto | 32 mm de ancho |

**En diapositivas:** el logo va en una sola esquina, siempre la misma en toda la sesión. Recomendado: inferior izquierda, altura 28 px, color tinta sobre claro y blanco sobre oscuro.

---

## 3. Usos incorrectos

Ocho errores que rompen la marca. Si dudas, usa el archivo original sin tocar.

1. **No recolorear** el símbolo. Solo tinta, blanco o el color heredado del texto.
2. **No deformar.** Escalar siempre de forma proporcional.
3. **No rotar** ni inclinar. El símbolo va siempre a 0°.
4. **No usar tinta sobre fondos oscuros o saturados.** Ahí va en blanco.
5. **No cambiar la tipografía** del wordmark ni quitarle el tracking.
6. **No añadir efectos:** sombras, contornos, biseles, degradados.
7. **No separar el nombre** en palabras ni escribir «Active X Remote».
8. **No invadir la zona de respeto** ni encajonar el logo en una caja ajustada.

### Cotitulaciones y logos de terceros

Cuando ActiveXRemote aparece junto a marcas aliadas (Deel, Remote&Talent, certificadores), todos los logos se normalizan a la **misma altura óptica**, en escala de grises al 60 % si son marcas de apoyo, y separados por un filete de 1 px `#E0E0E0`. ActiveXRemote va siempre primero por la izquierda.

### Logos de herramientas en clase

Los logos del stack viven en `public/logos/tools/` y se usan **monocromos en tinta** dentro del campus. En material público pueden ir a color siempre que todos lo estén: no se mezclan versiones color y monocromas en la misma retícula.

---

## 4. Paleta Campus — monocroma

El campus no tiene color de marca: tiene **contraste**. Toda la jerarquía se resuelve con negro sobre blanco, un gris de apoyo y un filete. Así el contenido del curso —capturas, código, gráficos— es lo único que aporta color.

| Nombre | Hex | Uso |
|---|---|---|
| Ink | `#161616` | Texto, bordes, botón primario |
| Gray 90 | `#262626` | Superficie oscura alterna |
| Gray 70 | `#525252` | Texto secundario |
| Gray 60 | `#6F6F6F` | Texto de ayuda, etiquetas |
| Gray 50 | `#8D8D8D` | Deshabilitado. **No para texto** |
| Gray 30 | `#A8A8A8` | Placeholder |
| Border strong | `#C6C6C6` | Filete de énfasis |
| Border | `#E0E0E0` | Filete estándar, retícula |
| Layer 01 | `#F4F4F4` | Fondo de campo, hover |
| Papel | `#FFFFFF` | Fondo por defecto |
| Error bg | `#FFF1F1` | Solo mensajes de error |
| Error ink | `#750E13` | Texto de error |

**Regla de oro.** Negro y blanco cargan el **90 %** de la superficie. El gris aparece solo para bajar de nivel una información. El color entra únicamente en el contenido (una captura, un gráfico de datos, un logo) o como acento único de camino en presentaciones.

**Herencia Carbon.** El campus se construye sobre IBM Carbon Design System con el tema sobrescrito a monocromo: `interactive`, `link-primary` y `focus` pasan a `#161616`. Componentes, espaciados y foco siguen Carbon; el color, no.

> ⚠️ **Nombres heredados.** En el código las variables se llaman `--axr-blue-*` y `--axr-green-*` por historia del proyecto, pero **ya no son azules ni verdes**: son la escala monocroma. No fiarse del nombre, fiarse del valor.

---

## 5. Paleta pública — Remote Professional

El acento de **Remote Professional** (Career Accelerator). Energía, tecnología, ambición profesional. Es el color por defecto de toda la comunicación pública cuando no se habla de un camino concreto.

| Nombre | Hex |
|---|---|
| Accent | `#5B4BF5` |
| Accent strong | `#4632E6` |
| Ink | `#161326` |
| Body | `#514D69` |
| Muted | `#8A86A0` |
| Soft | `#F4F3FB` |
| Soft 2 | `#EEECFA` |
| Border | `#E7E4F5` |

**Gradientes**

- Grad 1: `linear-gradient(140deg, #6D5CFF, #A855F7)`
- Grad 2: `linear-gradient(140deg, #FF7A3D, #E11D74)`
- Grad 3: `linear-gradient(140deg, #2F6BFF, #14B8C4)`

**Mesh oscuro** — cuatro radiales sobre base `#3A1F6E → #241246`. Solo para héroes, bloques de cierre y portadas. Nunca detrás de texto largo.

```
radial-gradient(60% 85% at 12% 18%, #7B5CFF 0, transparent 60%),
radial-gradient(55% 75% at 88% 12%, #FF6A3D 0, transparent 55%),
radial-gradient(65% 85% at 78% 88%, #D61F9C 0, transparent 58%),
radial-gradient(70% 90% at 22% 92%, #4F46E5 0, transparent 60%),
linear-gradient(160deg, #3A1F6E 0, #241246 100%)
```

**Radios y forma.** El sistema público redondea: `26 px` tarjeta grande · `18 px` media · `12 px` pequeña · `999 px` botón píldora. Es la diferencia formal más rápida de leer frente al campus, que va a `0 px`.

---

## 6. Paleta pública — Remote Founder

El acento de **Remote Founder** (Global Builder). Riesgo, iniciativa, calor. Se activa cambiando **solo las variables de acento**: la estructura, la tipografía y los componentes son idénticos.

| Nombre | Hex |
|---|---|
| Accent | `#E4462F` |
| Accent strong | `#C3341F` |
| Soft | `#FDF3F0` |
| Soft 2 | `#FBE9E4` |
| Border | `#F6DDD6` |

**Mesh Founder** — base `#4A1636 → #2A0F2C` con radiales naranja, ámbar, magenta y violeta. Gradiente lineal: `linear-gradient(140deg, #FF7A3D, #E11D74)`.

> ⚠️ **Contraste del rojo.** `#E4462F` sobre blanco da **4,33:1** — no llega al mínimo AA de 4,5:1 para texto pequeño. Úsalo en titulares (≥ 24 px), iconos y fondos. Para texto pequeño en rojo, usa siempre `#C3341F` (5,5:1).

### Cómo se decide el acento

| Pieza | Acento |
|---|---|
| Campus, admin, lecciones | Ninguno — monocromo puro |
| Landing general, marca | Morado `#5B4BF5` |
| Curso Remote Professional | Morado `#5B4BF5` |
| Curso Remote Founder | Rojo `#E4462F` |

Todos los gradientes lineales van a **140°**, dos paradas, sin paradas intermedias.

---

## 7. Uso del color y accesibilidad

### La proporción 70 / 20 / 10

- **70 %** papel (blanco)
- **20 %** tinta (estructura y jerarquía)
- **10 %** acento — aparece **una vez por pantalla**: en la acción principal, en un dato clave o en una etiqueta

Un acento repetido cinco veces deja de ser acento.

### Contraste sobre blanco

| Color | Ratio | Uso permitido |
|---|---|---|
| `#161616` | 18,9:1 | Todo. AAA |
| `#525252` | 7,5:1 | Texto secundario. AAA |
| `#514D69` | 8,0:1 | Cuerpo público. AAA |
| `#6F6F6F` | 5,3:1 | Etiquetas y ayuda. AA |
| `#5B4BF5` | 5,6:1 | Texto y enlaces. AA |
| `#E4462F` | 4,3:1 | Solo ≥ 24 px o negrita ≥ 19 px |
| `#8A86A0` | 3,5:1 | Solo texto grande y decoración |
| `#8D8D8D` | 3,2:1 | Nunca texto. Solo deshabilitado |

### El color nunca es el único mensaje

Estado, categoría o resultado se marcan además con **texto, icono o posición**. Un alumno con daltonismo debe entender la diapositiva igual de rápido.

**✓ Correcto**
- «✓ Completado» en verde **y** con la palabra
- Camino marcado con etiqueta «FOUNDER» además del rojo
- Barra de progreso con porcentaje escrito

**✗ Incorrecto**
- Leyenda «los rojos son los avanzados»
- Puntos de color sin etiqueta
- Enlaces que solo se distinguen por el tono

### Texto sobre mesh o foto

Siempre en **blanco puro**, peso ≥ 600 y, si hace falta, sobre una capa `rgba(0,0,0,.35)`. Los textos secundarios sobre oscuro usan `rgba(255,255,255,.82)`; nunca gris opaco.

---

## 8. Tipografía

### Inter lo hace todo

Inter cubre desde el titular a la etiqueta de 10 px sin perder legibilidad, tiene cifras tabulares y funciona igual en pantalla, PDF y proyector. Menos familias = menos formas de romper la marca.

| Peso | Uso |
|---|---|
| 300 Light | Solo cifras muy grandes |
| 400 Regular | Cuerpo de texto |
| 500 Medium | Listas, etiquetas, UI |
| 600 SemiBold | Subtítulos, énfasis |
| 700 Bold | Titulares y wordmark |

No se usan 800/900 ni la cursiva: el énfasis se hace con peso o color, no inclinando.

### La excepción: código

**IBM Plex Mono** (400 / 500) aparece **solo** en contenido de código real: bloques, rutas de archivo, comandos, respuestas de terminal. Nunca en etiquetas, cifras ni titulares.

> ⚠️ **Nota histórica.** Las variables del código llaman `--axr-mono` y `--axr-display` a lo que **hoy es Inter**. Antes eran IBM Plex Mono y Major Mono Display; se retiraron por legibilidad. Si ves esos nombres, el valor es Inter.

### Sustitutos

| Herramienta | Fuente |
|---|---|
| PowerPoint / Keynote | Inter (instalar) → si no: **Helvetica Neue** o **Arial** |
| Google Slides | Inter (disponible en el catálogo) |
| Sistema | -apple-system, Segoe UI, Roboto |

Descarga libre: `fonts.google.com/specimen/Inter` — licencia SIL Open Font.

---

## 9. Escala tipográfica

Toda la tipografía de marca sale de combinar cuerpo, peso, tracking e interlínea según cuatro familias de uso.

### 01 · Titular

Peso 700 · tracking **negativo** −0,03 em · interlínea 1,05–1,12 · máx. 2 líneas · `text-wrap: balance`

### 02 · Cuerpo

Peso 400 · tracking 0 · interlínea **1,5–1,6** · medida máxima **60–68 caracteres**. Nunca justificado, nunca centrado en párrafos de más de dos líneas.

### 03 · Etiqueta / eyebrow

Peso 500–700 · MAYÚSCULAS · tracking **positivo** 0,10–0,14 em · cuerpo 11–12 px · opcionalmente precedida de un cuadrado sólido de 7 px.

### 04 · Cifra destacada

Peso 700 · tracking −0,03 em · interlínea 0,9 · etiqueta debajo en 11–13 px peso 400, color gris. Cifras siempre **tabulares**.

### Escala web (rem)

| Nivel | Cuerpo | Peso | Tracking | Interlínea |
|---|---|---|---|---|
| Hero H1 | 1,85 → 3,10 rem | 700 | −0,03 em | 1,06 |
| Sección H2 | 1,75 → 2,50 rem | 700 | −0,03 em | 1,10 |
| Bloque H3 | 1,35 → 1,50 rem | 700 | −0,02 em | 1,20 |
| Tarjeta H4 | 1,125 rem | 600 | −0,01 em | 1,30 |
| Cuerpo | 1,00 → 1,0625 rem | 400 | 0 | 1,55 |
| Secundario | 0,875 rem | 500 | 0 | 1,45 |
| Etiqueta | 0,6875 → 0,75 rem | 500–700 | +0,10 a +0,14 em | 1,30 |

### Reglas que no se negocian

- Titular = tracking negativo. Etiqueta = tracking positivo. Cuerpo = tracking cero.
- Cuanto mayor el cuerpo, más apretada la interlínea.
- Máximo **tres** niveles tipográficos por pantalla o diapositiva.
- Nada de subrayados salvo en enlaces al pasar el cursor.
- Nunca texto en mayúsculas de más de 4 palabras.

---

## 10. Elementos gráficos de marca

Cinco gestos reconocibles. Si una pieza los usa, es ActiveXRemote aunque le quites el logo.

1. **Esquina recta.** Radio `0 px` en todo el campus: tarjetas, campos, botones, avatares. Sin excepciones.
2. **Sombra dura.** `8px 8px 0 #161616` (o `5px 5px` en piezas pequeñas). Desplazada, sin difuminado, siempre abajo-derecha.
3. **Retícula de puntos.** Punto de 1 px `#E0E0E0` cada 22 px. Fondo del login y de zonas vacías. Nunca bajo texto de párrafo.
4. **Cuadrado indicador.** 7 px sólidos en tinta antes de cada etiqueta de sección. Es el «punto y aparte» de la marca.
5. **Strip de cabecera.** Filete con etiqueta a la izquierda y contador a la derecha. Ordena y da ritmo a las secciones largas.

### Espaciado

Todo múltiplo de **4 px**; los saltos habituales son 8 · 12 · 16 · 24 · 32 · 48 · 64. En diapositivas, múltiplos de **8 px** sobre lienzo 1920×1080.

### Bordes

**1 px** siempre. Tinta `#161616` para contenedores con peso propio (tarjeta, KPI, campo activo); `#E0E0E0` para separadores y filas de tabla. Nunca 2 px salvo el subrayado de pestaña activa.

### Movimiento

Transiciones de **0,15 s** (UI) a **0,18 s** (público), curva `ease`. El hover de una tarjeta la mueve **−2 px en X e Y** y saca la sombra dura. Nada rebota, nada gira.

### Foco

Anillo de **2 px** sólido, `#161616` en campus y `#5B4BF5` en público, con `outline-offset: 3px`. Sobre fondo oscuro pasa a blanco. Solo con teclado (`:focus-visible`).

---

## 11. Componentes

### Botones — Campus

Rectangular, altura mínima 48 px, sin radio. Hover del primario: `#000000`.

| Variante | Estilo |
|---|---|
| Primario | Fondo `#161616`, texto blanco |
| Secundario | Filete `#161616` 1 px, fondo blanco |
| Deshabilitado | Fondo `#8D8D8D`, cursor `not-allowed` |

### Botones — Público

Píldora `999 px`, altura mínima **44 px** (52 px en tamaño grande) por accesibilidad táctil. Hover: sube 2 px. Sombra de color solo en el sólido.

| Variante | Estilo |
|---|---|
| Sólido | Fondo acento, sombra `0 10px 26px rgba(91,75,245,.38)` |
| Fantasma | Fondo blanco, filete `#E7E4F5` |
| Invertido | Fondo blanco, texto acento — sobre superficies oscuras |

### Tarjeta y KPI

- **Tarjeta:** fondo blanco, filete tinta 1 px, padding 24 px.
- **Tarjeta pulsable:** al pasar el cursor sale la sombra dura y se desplaza −2 px.
- **KPI:** etiqueta en mayúsculas 11 px gris, cifra 36 px peso 600 tracking −0,02 em, pista debajo en 12 px.

### Barra de progreso

Altura 6 px, filete gris, relleno tinta. El porcentaje va siempre escrito al lado.

### Chips y etiquetas

- Chip informativo: píldora con filete.
- Chip de rol o estado: rectángulo sólido en tinta, mayúsculas, 10 px.

### Campo de formulario

Fondo `#F4F4F4`, sin borde salvo el inferior en tinta (patrón Carbon). Al enfocar, fondo blanco y anillo de 2 px.

### Mensajes de estado

Rectángulo con filete izquierdo de 2 px. El error es el **único** lugar donde entra un rojo del sistema (`#FFF1F1` / `#750E13`). No hay iconos de alerta ni emoji.

### Avatar

Cuadrado de 30 px en tinta con las iniciales en blanco. Sin foto, sin círculo, sin degradado de color por usuario.

### Conmutador de idioma

Todo el campus y la web son **bilingües ES / EN**. Las presentaciones se entregan en el idioma de la cohorte, pero los títulos de módulo mantienen su nombre original en inglés.

---

## 12. Iconografía e imagen

### Iconografía

Set único: **IBM Carbon Icons** (`@carbon/icons-react`). Estilo de línea, trazo uniforme, esquinas rectas — el mismo lenguaje geométrico que el símbolo ΔX.

| | |
|---|---|
| Tamaños | 16 · 20 · 24 · 32 px (nunca intermedios) |
| Color | Hereda del texto: tinta, gris 60 o blanco |
| Relleno | Solo la versión de línea; el sólido queda para el favicon |
| Emoji | **No se usan** en material de marca ni en diapositivas |

### Ilustración

No hay ilustración de marca. Lo que la sustituye: **capturas reales de herramientas**, diagramas de línea en tinta y retículas de logos. Nada de vectores genéricos de personas ni de stock corporativo.

### Capturas de pantalla en clase

- Siempre reales, del producto real, con datos coherentes (nada de «Lorem ipsum» ni «John Doe»).
- Encuadre a **1 px de filete** `#E0E0E0`, sin sombra difusa ni marco de navegador falso.
- Si hay que destacar algo, se usa un **rectángulo de 2 px en el acento del camino**, nunca una flecha roja a mano alzada.
- Datos personales siempre anonimizados.

### Logos de herramientas

Disponibles en `public/logos/tools/`: Adobe, Ahrefs, Apollo, Bolt, Canva, ChatGPT, Copilot, Granola, LinkedIn, Lovable, Microsoft 365, OneDrive, Salesforce, Teams, VS Code. Además `deel.svg` y `remoteandtalent.svg`.

En retícula: **todos a la misma altura óptica**, mismo tratamiento (color o monocromo, no mezclado), separación mínima igual al alto del logo.

---

## 13. Tono de voz y copy

> «No es que te falte talento. Es que nadie te ha enseñado a trabajar sin fronteras.»

Titular de marca. Contiene los cuatro rasgos: tuteo, negación + afirmación, frase corta, promesa concreta.

### Los cuatro rasgos

| Rasgo | Cómo se aplica |
|---|---|
| **Tuteo** | Siempre «tú», nunca «usted» ni impersonal. «Sales con entregables», no «el alumno obtiene entregables». |
| **Contraste** | Estructura «no es X, es Y». Rompe la expectativa y define. «No es teoría. Es ejecución.» |
| **Frase corta** | Punto antes que coma. Máximo 20 palabras por frase; los titulares, por debajo de 10. |
| **Dato concreto** | 14 módulos. 56 h en directo. 14 semanas. 2 caminos. La cifra sustituye al adjetivo. |

### Vocabulario propio

Campus · cohorte · camino (no «itinerario») · módulo · lección · entregable · en directo (no «webinar») · Remote Professional · Remote Founder · stack · borderless / sin fronteras.

### ✓ Así sí

- «Cada módulo son 4 horas en vivo.»
- «Sales con entregables, no con apuntes.»
- «Elige al menos un curso.»
- «Te escribimos en menos de 24 horas laborables.»
- «La IA como tu ventaja injusta.»

### ✗ Así no

- «Una experiencia formativa transformadora y disruptiva.»
- «El alumno adquirirá competencias.»
- «Líderes en excelencia educativa.»
- «¡¡No te lo pierdas!! 🚀🔥»
- «Nuestra metodología de vanguardia.»

### Reglas de escritura

- **Sin signos dobles** de exclamación ni emoji en material oficial.
- **Cifras en dígitos** siempre que sean dato: 4 horas, 14 módulos, 56 h.
- **Puntos suspensivos** como carácter único (…), comillas latinas «».
- **Títulos en frase**, no en Mayúscula De Cada Palabra. Solo las etiquetas van en caja alta.
- **Sin punto final** en titulares de una línea y en etiquetas.
- Los anglicismos del oficio se mantienen (*stack*, *pipeline*, *prompt*) y se explican la primera vez.

> **En clase:** el título de cada diapositiva es una **afirmación**, no una etiqueta. «Cómo negociar tu salario en remoto» → mejor «Tu salario se negocia antes de la primera llamada».

---

## 14. Retícula de diapositiva 16:9

Todas las presentaciones se diseñan sobre un lienzo de **1920 × 1080 px**. Si tu herramienta trabaja en pulgadas, usa **13,33 × 7,5 in**; en centímetros, **33,87 × 19,05 cm**.

### Medidas exactas (1920 × 1080)

| Elemento | Valor |
|---|---|
| Margen lateral | 96 px |
| Margen superior | 72 px |
| Margen inferior | 100 px (pie incluido) |
| Columnas | 12 |
| Ancho de columna | 128 px |
| Medianil | 32 px |
| Rejilla base | 8 px |
| Ancho útil | 1728 px |

### Repartos habituales

**7 + 5** texto e imagen · **6 + 6** comparativa · **4 + 4 + 4** tres bloques · **8** centrado para citas · **12** a sangre para portadas y separadores.

### Pie de diapositiva

Izquierda: lockup a 28 px de alto. Derecha: `MÓDULO NN · página` en 12 px, tracking 0,1 em, gris 50. Se omite en portada y separadores.

> **Una idea por diapositiva.** Si necesitas dos títulos, necesitas dos diapositivas. Es la regla que más protege la marca en clase.

---

## 15. Escala tipográfica de proyección

Valores en píxeles sobre lienzo 1920 × 1080 y su equivalente en puntos para PowerPoint / Keynote a 13,33 × 7,5 in.

| Uso | px @1920 | pt | Peso | Tracking |
|---|---|---|---|---|
| Título de portada | 128–160 | 96–120 | 700 | −0,035 em |
| Separador de sección | 96 | 72 | 700 | −0,03 em |
| Título de diapositiva | 64 | 48 | 700 | −0,03 em |
| Subtítulo | 36 | 27 | 600 | −0,01 em |
| Cuerpo / viñeta | 28 | 21 | 400 | 0 |
| Cuerpo secundario | 24 | 18 | 400 | 0 |
| Cifra destacada | 180–240 | 135–180 | 700 | −0,04 em |
| Etiqueta / eyebrow | 18 | 13 | 700 | +0,16 em |
| Pie y fuente | 14 | 10 | 500 | +0,10 em |
| **Mínimo absoluto** | **18** | **14** | — | Nada por debajo |

**Regla del ×3.** Si la diapositiva se proyecta, el cuerpo mínimo legible es aproximadamente el **ancho de la sala en metros × 3 pt**. En un aula de 8 m: 24 pt. Ante la duda, sube un escalón.

### Cantidad de texto

| | |
|---|---|
| Título | Máx. 2 líneas / 10 palabras |
| Viñetas | Máx. 5 por diapositiva, 1 línea cada una |
| Párrafo | Máx. 3 líneas, 60 caracteres de medida |
| Palabras totales | Objetivo: menos de 40 por diapositiva |

> **La diapositiva no es el manual.** Lo que no cabe en 40 palabras va al material de apoyo del campus, no a un cuerpo de 14 pt.

---

## 16. Plantillas de diapositiva

### Apertura

**01 · Portada.** Fondo tinta con retícula de puntos. Lockup arriba, bloque de texto abajo a la izquierda. Etiqueta con módulo y camino, título en 96–120 pt (dos líneas máximo), línea de créditos: docente · fecha · duración. Sin pie de página.

**02 · Separador de sección.** Número de bloque grande al 35 % de opacidad, título en 72 pt y filete. Marca el cambio de tema y da respiro. Sin pie.

**03 · Agenda.** Lista numerada con filetes. El primer filete va en tinta; el resto en gris. Cinco puntos como máximo.

### Contenido

**04 · Contenido 7 + 5.** Texto a la izquierda (7 columnas), captura o diagrama a la derecha (5). La plantilla que más se usa.

**05 · Comparativa 6 + 6.** Dos tarjetas de filete en tinta, misma altura, mismo número de líneas. El único color son las dos etiquetas (`PROFESSIONAL` / `FOUNDER`).

**06 · Dato.** Una o dos cifras enormes, etiqueta debajo y fuente citada en 10 pt. Nunca una cifra sin fuente.

### Énfasis y cierre

**07 · Cita.** Ocho columnas centradas, peso 600 (no 700), comillas latinas. La atribución en etiqueta con el acento del camino.

**08 · Ejercicio.** Etiqueta sólida con la duración (`EJERCICIO · 25 MIN`), pasos numerados y el entregable en una caja con sombra dura. Una por bloque como mínimo.

**09 · Cierre.** Vuelve al fondo tinta de la portada y termina con **una acción concreta**, con fecha y canal. Nunca un «¿Preguntas?» ni un «Gracias».

### Orden recomendado de una sesión

Portada → Agenda → Separador → Contenido (×n) → Dato o caso → Ejercicio → Separador → Contenido → Cita o cierre de idea → **Entregable** → Cierre con siguiente paso.

**Ritmo.** Un separador cada **8–12 diapositivas**. Una diapositiva de respiro (cifra, cita o imagen a sangre) cada 5–6 de contenido. Evita cinco diapositivas seguidas con la misma plantilla.

**Duración.** Los módulos son de **4 horas en directo**: calcula 1,5–2 min por diapositiva de contenido y reserva al menos el 40 % del tiempo a ejercicio en vivo.

### Gráficos, tablas y diagramas

- **Gráficos de datos.** Barras y líneas en **tinta**; si hay que distinguir series, se usan tramas o grises (100 / 70 / 50 / 30), no colores. Solo la serie protagonista puede llevar el acento del camino. Sin 3D, sin sombras, sin quesitos de más de tres porciones.
- **Tablas.** Cabecera en mayúsculas 13 pt sobre filete en tinta; filas separadas por filete `#E0E0E0`; sin bordes verticales y sin sombreado alterno. Máximo 6 filas por diapositiva.
- **Diagramas.** Cajas rectangulares de 1 px, conectores rectos con ángulo de 90°, sin flechas curvas. Etiquetas dentro de la caja, nunca flotando.

### Cuándo usar el mesh de color

El fondo mesh es lenguaje **público**: se reserva para la portada de una sesión abierta, un webinar de captación o una diapositiva de bienvenida a la cohorte. Dentro del temario, el fondo es blanco o tinta. Una sesión de 4 horas no debería tener más de **dos** diapositivas con mesh.

### Transiciones, animación, vídeo

- Sin transiciones entre diapositivas (o «corte» / «aparecer»). Las apariciones progresivas solo si el contenido se construye paso a paso, y siempre con **fundido simple**. Prohibido: cubo, giro, persiana, rebote.
- Vídeo y audio incrustados, no enlazados. Con subtítulos siempre —la cohorte es internacional y bilingüe. Cartela inicial con el logo en tinta sobre blanco.

---

## 17. Reglas para el profesorado

Si solo lees una sección de este documento, que sea esta.

### ✓ Hazlo así

1. **Una idea por diapositiva.** Si hay dos títulos posibles, son dos diapositivas.
2. **El título afirma.** «Tu salario se negocia antes de la primera llamada.»
3. **Inter en todo.** 700 para titulares, 400 para cuerpo, 500 para listas.
4. **Blanco o tinta de fondo.** El color entra solo como acento del camino.
5. **Esquinas rectas** en cajas, tablas y capturas.
6. **Cifras con fuente citada** en 10 pt bajo el dato.
7. **Capturas reales** con filete de 1 px y datos anonimizados.
8. **Menos de 40 palabras** por diapositiva.
9. **Un ejercicio por bloque**, con entregable explícito y plazo.
10. **Cierra con una acción**: qué, cuándo y en qué canal.

### ✗ Nunca

1. **Plantillas de PowerPoint** de fábrica, con sus degradados y sus sombras.
2. **Emoji, clipart o fotos de stock** de gente sonriendo con portátiles.
3. **Texto por debajo de 14 pt**, ni siquiera en una nota al pie.
4. **Párrafos completos** proyectados y leídos en voz alta.
5. **Más de tres tamaños** de letra en la misma diapositiva.
6. **Colores fuera de paleta**, incluidos los de la propia herramienta.
7. **Gráficos 3D**, quesitos de siete porciones, ejes sin etiquetar.
8. **Transiciones animadas** entre diapositivas.
9. **Logos deformados** o rescatados de una búsqueda de imágenes.
10. **Terminar con «¿Preguntas?»** o «Gracias por vuestra atención».

### El acento de tu curso

| Camino | Color |
|---|---|
| Remote Professional | `#5B4BF5` |
| Remote Founder | `#E4462F` |

Se usa en: la etiqueta de la portada, la atribución de las citas, el rectángulo que destaca una captura y, como mucho, una serie de un gráfico. **Nunca como fondo de diapositiva ni como color de titular.**

**Antes de entregar.** Exporta a PDF y ábrelo en el móvil. Si un título no se lee de un vistazo o una diapositiva te obliga a hacer zoom, no está lista.

**Accesibilidad mínima.** Texto alternativo en imágenes con información, subtítulos en vídeo, contraste ≥ 4,5:1 y nada codificado solo por color.

---

## 18. Checklist y recursos

### Checklist de 60 segundos

**Marca**
- [ ] Logo original, sin deformar ni recolorear
- [ ] Zona de respeto libre
- [ ] «ActiveXRemote» escrito junto
- [ ] El logo está en una sola esquina, siempre la misma

**Color**
- [ ] Solo colores de paleta
- [ ] Un único acento, y del camino correcto
- [ ] Contraste de texto ≥ 4,5:1
- [ ] Ninguna información codificada solo por color

**Tipografía**
- [ ] Inter en toda la pieza
- [ ] Nada por debajo de 14 pt
- [ ] Máximo tres niveles por diapositiva
- [ ] Titulares con tracking negativo, etiquetas con positivo

**Contenido**
- [ ] Menos de 40 palabras por diapositiva
- [ ] Todos los datos con fuente
- [ ] Un entregable claro por bloque
- [ ] Cierre con acción, fecha y canal

### Resumen de un vistazo

| | Campus / clase | Público / captación |
|---|---|---|
| Color | Monocromo + 1 acento | Acento del camino + gradientes |
| Radio | 0 px | 12 / 18 / 26 px · botón píldora |
| Sombra | Dura, desplazada, en tinta | Difusa y de color, solo en botones y tarjetas |
| Fondo | Blanco o tinta | Blanco, soft o mesh |
| Tono | Instructivo y concreto | Promesa y contraste |

### Dónde están los originales

| Recurso | Ruta |
|---|---|
| Símbolo (componente) | `src/components/brand-mark.tsx` |
| Símbolo sólido | `src/app/icon.svg` |
| Tokens de diseño | `src/styles/globals.scss` |
| Sistema público | `src/app/bienvenida/landing.scss` |
| Acentos de curso | `src/app/cursos/course.scss` |
| Cabecera del campus | `src/components/campus-header.scss` |
| Copy y tono | `src/app/bienvenida/copy.ts` |
| Logos de aliados | `public/logos/` |
| Logos de herramientas | `public/logos/tools/` |

### Tipografía

- **Inter** — `fonts.google.com/specimen/Inter` · licencia SIL OFL, instalación libre.
- **IBM Plex Mono** — solo para bloques de código.

### ¿Dudas o un caso nuevo?

Si tu pieza no encaja en ninguna plantilla, no improvises una solución nueva: escribe al equipo de campus antes de diseñarla. La marca se mantiene por acumulación de decisiones pequeñas.

---

**ActiveXRemote — The Remote Business School**
*El trabajo en remoto se aprende trabajando en remoto.*

Brandbook & Design System · v1.0 · Documento interno
