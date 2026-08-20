# Generador de plantillas de diapositiva

Produce `ActiveXRemote-Plantillas-Diapositiva.pdf` (134 páginas, lienzo 16:9) y
`docs/PLANTILLAS-DIAPOSITIVA.md` a partir de una única definición de layouts.

**64 layouts en 10 familias** (A apertura · B texto · C imagen · D vídeo · E recursos ·
F datos · G estructura · H personas · I actividad y cierre). Cada layout ocupa dos páginas
del PDF: la plantilla en blanco y su ficha.

## Archivos

| Archivo | Qué es |
|---|---|
| `layouts.py` | **La fuente de verdad.** Los 64 layouts: código, nombre, zonas, límites y el HTML de la plantilla. Para añadir o cambiar un layout, se toca solo aquí. Las piezas reutilizables (`ph`, `qr`, `link`, `head`, `bullets`, `table`, `steps`, `cards`) están arriba del archivo. |
| `gen_css.py` | Estilos. `1rem = 1 px de diapositiva` sobre lienzo 1920×1080. |
| `build.py` | Ensambla el HTML de las 42 páginas. |
| `gen_md.py` | Genera el Markdown que se le pasa a NotebookLM. |

## Regenerar

```sh
# 1. Fuentes Inter embebidas (una sola vez; genera fonts.css)
python3 - <<'PY'
import re, urllib.request, base64
url = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
css = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0 Chrome/120'})).read().decode()
out = []
for b in css.split('/* '):
    if b.startswith('latin */') or b.startswith('latin-ext */'):
        wgt = re.search(r"font-weight: (\d+)", b).group(1)
        u   = re.search(r"url\((https://[^)]+)\)", b).group(1)
        ur  = re.search(r"unicode-range: ([^;]+);", b).group(1)
        data = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'Mozilla/5.0'})).read()
        out.append("@font-face{font-family:'Inter';font-style:normal;font-weight:%s;font-display:block;"
                   "src:url(data:font/woff2;base64,%s) format('woff2');unicode-range:%s;}"
                   % (wgt, base64.b64encode(data).decode(), ur))
open('fonts.css','w').write("\n".join(out))
PY

# 2. HTML + Markdown
python3 build.py && python3 gen_md.py

# 3. PDF
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=30000 \
  --print-to-pdf="ActiveXRemote-Plantillas-Diapositiva.pdf" "file://$PWD/plantillas.html"
```

`fonts.css` no se versiona: pesa ~1 MB y se regenera con el paso 1.

---

## PPTX editable para el profesorado

`deck/` genera **`ActiveXRemote-Plantillas-Diapositiva.pptx`** (92 diapositivas,
lienzo 1920 × 1080, formas nativas de PowerPoint — nada de imágenes planas):

| Diapositivas | Qué es |
|---|---|
| 01–02 | Portada y mapa del documento |
| 03–12 | **Parte 1 · Cómo se crea un módulo**: hoja principal con las 4 fases y los 9 pasos, detalle paso a paso, NotebookLM (flujo + prompt para copiar), Google Classroom, entregables obligatorios, anatomía de una sesión de 4 h y control de calidad |
| 13–16 | **Parte 2 · Sistema de diseño**: retícula, escala tipográfica, paleta y marca |
| 17–18 | **Parte 3 · Índice** de las 64 plantillas |
| 19–92 | **Parte 4 · Las 64 plantillas**, con separador por familia. Cada plantilla lleva su ficha completa en las **notas del ponente** |

### Archivos

| Archivo | Qué es |
|---|---|
| `deck/engine.py` | Motor: tokens de marca, primitivas (rect, línea, texto, freeform, tabla, velo) y los dos emisores — PPTX y PNG |
| `deck/guide.py` | Portada, proceso de creación del módulo y sistema de diseño |
| `deck/templates.py` | Las 64 plantillas. Toma códigos, nombres, zonas y límites de `layouts.py` |
| `deck/index.py` | Mapa del documento, índice y separadores de familia |
| `deck/preview.py` | Previsualización PNG con métricas reales de Inter (para revisar sin abrir Office) |
| `deck/build.py` | Ensambla y guarda |

### Regenerar

```sh
python3 -m pip install --user python-pptx pillow
cd scripts/slide-templates
python3 -m deck.build                          # al destino por defecto
python3 -m deck.build salida.pptx --png /tmp/prev   # + previsualización PNG
```

### Decisiones técnicas

- **Unidades.** Todo en píxeles de diapositiva: `1 px = 6350 EMU` y `1 px = 0,5 pt`
  (13,333 × 7,5 in). Coincide con el PDF de plantillas.
- **Retícula.** 12 columnas sobre un ancho útil de 1728 px con medianil de 32 px dan
  **114,7 px** de columna. El brandbook dice 128 px, que no cuadra con 1728 y 32
  (12 × 128 + 11 × 32 = 1888). Aquí manda el ancho útil.
- **Interlínea.** En puntos exactos (`spcPts`), no en porcentaje: PowerPoint calcula el
  porcentaje sobre la caja de la fuente (~1,2 em) y el diseño se descuadra.
- **Pesos.** Solo Inter regular y bold: los nombres de instancia («Inter Medium») no
  resuelven de forma fiable si el usuario tiene la variable instalada.
- **Velos sobre foto.** PNG con alfa, no `gradFill`: hay visores que ignoran el alfa
  de un degradado y lo pintan opaco.
- **Notas.** python-pptx crea el patrón de notas pero no lo declara en
  `presentation.xml`; `deck/engine.py` añade el `notesMasterIdLst` al guardar. Sin eso,
  la Vista Rápida de macOS se cuelga al previsualizar el archivo.
- **Tipografías.** Inter (obligatoria) e IBM Plex Mono (solo el bloque de prompt).
  El tema del PPTX apunta a Inter, así que un cuadro de texto nuevo ya nace bien.
