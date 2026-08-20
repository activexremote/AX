# -*- coding: utf-8 -*-
from collections import OrderedDict
from layouts import L

FAM = OrderedDict()
for l in L: FAM.setdefault(l["family"], []).append(l)
FRONT = 6
def page_of(i): return FRONT + 1 + 2*i

o = []; w = o.append
w("""# ActiveXRemote — Plantillas de diapositiva

**Versión 2.0 · Lienzo 1920 × 1080 px (16:9) · Uso interno**

Catálogo de **%d formatos de diapositiva** agrupados en **%d familias**, con soporte para fotografía,
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

1. Cada diapositiva DEBE corresponder a uno de los %d layouts del catálogo.
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
""" % (len(L), len(FAM), len(L)))

for fam, items in FAM.items():
    w("### %s\n" % fam)
    w("| Código | Nombre | Para qué | Pág. PDF |")
    w("|---|---|---|---|")
    for l in items:
        w("| `%s` | %s | %s | %03d |" % (l["code"], l["name"], l["purpose"], page_of(L.index(l))))
    w("")

w("""**Secuencia de una sesión de 4 h:** `A01` portada → `A05` agenda → `A06` objetivos →
[`A03` separador + 8–12 de contenido + `I01` ejercicio] × 3 → `I06` resumen → `I08` cierre.

Una diapositiva de respiro (`B08`, `F05`, `H01` o `C03`) cada 5–6 de contenido;
no encadenes más de 3 layouts de la misma familia.

---

## Fichas de layout
""")

for fam, items in FAM.items():
    w("## Familia · %s\n" % fam)
    for l in items:
        w("### %s · %s\n" % (l["code"], l["name"]))
        w("**Fondo:** %s · **Página del PDF:** %03d\n"
          % ("tinta `#161616`" if l["dark"] else "blanco", page_of(L.index(l))))
        w("%s\n" % l["purpose"])
        w("| Zona | Límite | Nota |\n|---|---|---|")
        for k, lim, nota in l["zones"]:
            w("| `%s` | %s | %s |" % (k, lim, nota or "—"))
        w("")
        w("**Usar cuando**")
        for x in l["use"]: w("- %s" % x)
        w("")
        w("**No usar cuando**")
        for x in l["avoid"]: w("- %s" % x)
        w("")
        zs = " | ".join("%s(%s)" % (k, lim.replace(" car.", "").replace(" · ", "/").strip())
                        for k, lim, _ in l["zones"])
        w("```\nLAYOUT: %s — %s\nFAMILIA: %s\nFONDO: %s\nZONAS: %s\nUSAR: %s\nEVITAR: %s\n```\n"
          % (l["code"], l["name"], l["family"], "tinta #161616" if l["dark"] else "blanco",
             zs, l["use"][0], l["avoid"][0]))
    w("---\n")

w("""**ActiveXRemote — The Remote Business School**

Plantillas de diapositiva · v2.0 · Documento interno""")
open('PLANTILLAS-DIAPOSITIVA.md', 'w').write("\n".join(o))
print("md ok")
