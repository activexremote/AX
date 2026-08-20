# -*- coding: utf-8 -*-
"""
Parte 1 y 2 del archivo: portada, proceso de creación de un módulo
(NotebookLM + Google Classroom) y el sistema de diseño aplicado.
"""
from .engine import *          # noqa
from .engine import Slide

ASSETS = {}                    # lo rellena build.py: dots_dark / dots_light


def _dark(code=None, foot="GUÍA", dots=True):
    s = Slide(bg=INK, dark=True, code=code, foot_right=foot)
    if dots and ASSETS.get("dots_dark"):
        s.pic(ASSETS["dots_dark"])
    return s


# ══════════════════════════ 01 · PORTADA ══════════════════════════
def cover():
    s = _dark(foot="", dots=True)
    s._foot = False
    s.corner_marks()
    s.logo(MARGIN, 66, 46, PAPER)
    s.text(W - MARGIN - 620, 74, 620, 30, "SISTEMA DE DIAPOSITIVAS · V3.0",
           size=T_SRC, bold=True, color=W30, tracking=0.18, align="r", lh=1.0)
    s.eyebrow(MARGIN, 560, "ACTIVEXREMOTE · THE REMOTE BUSINESS SCHOOL", W62)
    s.h(MARGIN, 604, 1500, "Plantillas de\ndiapositiva", size=T_COVER, lh=1.0, lines=2)
    s.hr(MARGIN, 890, 220, PAPER, 3)
    s.body(MARGIN, 904, 1180,
           "El proceso completo para montar un módulo con NotebookLM y Google Classroom, "
           "y 64 plantillas de diapositiva con la marca ya aplicada.", size=26, lines=2)
    s.text(MARGIN, 1010, 1400,
           28, "VERSIÓN 3.0 · LIENZO 1920 × 1080 PX (16:9) · INTER · USO INTERNO",
           size=T_SRC, bold=True, color=W30, tracking=0.14, lh=1.0)
    s.notes = ("Portada del sistema de diapositivas ActiveXRemote. "
               "Este archivo es una biblioteca: se copian diapositivas de aquí a tu "
               "presentación, no se presenta tal cual.")
    return s.build()


# ══════════════════════════ 02 · CÓMO SE USA ══════════════════════════
def how_to_use():
    s = Slide(foot_right="GUÍA · 01")
    y = s.header("EMPIEZA AQUÍ", "Esto es una biblioteca, no una presentación",
                 right="CÓMO SE USA")
    cards = [
        ("01", "Duplica, no diseñes",
         "Busca la plantilla que necesitas en la Parte 4, cópiala a tu presentación "
         "y cambia el texto. Diseñar desde cero rompe la marca.",
         "PowerPoint: clic derecho › Duplicar diapositiva"),
        ("02", "Cambia el texto, no la marca",
         "Puedes reescribir cualquier texto y sustituir los huecos por tus capturas. "
         "No muevas el pie, ni cambies tipografía, color o márgenes.",
         "Inter · tinta #161616 · esquinas rectas"),
        ("03", "Cada plantilla trae ficha",
         "En las notas del ponente de cada plantilla están sus zonas de texto, los "
         "límites de caracteres y cuándo usarla o no.",
         "Ver › Notas del ponente"),
    ]
    cw = (CW - 2 * 30) / 3.0
    for i, (n, t, d, meta) in enumerate(cards):
        x = MARGIN + i * (cw + 30)
        s.card(x, y, cw, 400, hard=0)
        s.text(x + 30, y + 28, 100, 30, n, size=20, bold=True, color=ACC,
               tracking=0.14, lh=1.0)
        s.text(x + 30, y + 74, cw - 60, 90, t, size=32, bold=True, color=INK,
               tracking=-0.02, lh=1.15)
        s.text(x + 30, y + 182, cw - 60, 160, d, size=21, color=G70, lh=1.5)
        s.hr(x + 30, y + 330, cw - 60, BD, 1)
        s.text(x + 30, y + 348, cw - 60, 40, meta, size=15, bold=True, color=G50,
               tracking=0.10, lh=1.3)
    y2 = y + 440
    s.rect(MARGIN, y2, CW, 92, fill=L10, lw=0)
    s.rect(MARGIN, y2, 5, 92, fill=INK, lw=0)
    s.text(MARGIN + 30, y2, 300, 92, "PEGAR SIN ROMPER", size=T_SRC, bold=True,
           color=G60, tracking=0.14, anchor="m", lh=1.0)
    s.text(MARGIN + 330, y2, CW - 360, 92,
           "PowerPoint y Keynote: Pegar › Mantener formato de origen.   ·   "
           "Google Slides: Archivo › Importar diapositivas › Mantener tema original.   ·   "
           "Instala Inter antes de abrir el archivo.",
           size=20, color=G70, anchor="m", lh=1.4)
    s.notes = ("Regla de oro: se copia una plantilla existente. Si tu contenido no "
               "encaja en ninguna, escribe al equipo de campus antes de inventar una.")
    return s.build()


# ══════════════════════════ 03 · HOJA PRINCIPAL ══════════════════════════
_PHASES = [
    ("FASE 1", "PREPARAR", "NOTEBOOKLM", "D-14 → D-7",
     [("01", "Reúne las fuentes", "5–12 documentos del curso"),
      ("02", "Genera el guion", "Bloques, minutos y ejercicios")],
     "Guion de 4 h verificado"),
    ("FASE 2", "DISEÑAR", "ESTAS PLANTILLAS", "D-7 → D-3",
     [("03", "Elige los códigos", "Una plantilla por diapositiva"),
      ("04", "Monta el deck", "40–50 diapositivas, 16:9"),
      ("05", "Control de 60 s", "PPTX + PDF definitivos")],
     "Deck listo para clase"),
    ("FASE 3", "MONTAR", "GOOGLE CLASSROOM", "D-3 → D-1",
     [("06", "Crea el Tema del módulo", "Material publicado antes"),
      ("07", "Publica la tarea", "Entregable, rúbrica y plazo")],
     "Módulo publicado"),
    ("FASE 4", "IMPARTIR", "AULA + CAMPUS", "DÍA 0 → D+7",
     [("08", "Imparte 4 horas", "40 % del tiempo, ejercicio"),
      ("09", "Sube, corrige y cierra", "Feedback en 7 días")],
     "Módulo cerrado"),
]


def master_sheet():
    """Hoja principal: las 4 fases, los 9 pasos y lo que es obligatorio."""
    s = Slide(foot_right="HOJA PRINCIPAL · 02")
    s.eyebrow(MARGIN, 100, "PROCESO OFICIAL · PROFESORADO", ACC)
    s.h(MARGIN, 140, col(9), "Cómo se crea un módulo, paso a paso", size=T_HSM, lines=1)
    s.text(MARGIN, 212, col(10), 34,
           "De la primera fuente a la clase cerrada: 4 fases, 9 pasos, 14 días.",
           size=T_BD2, color=G60, lh=1.35)
    s.text(W - MARGIN - 520, 100, 520, 26, "HOJA PRINCIPAL", size=T_SRC, bold=True,
           color=G50, tracking=0.18, align="r", lh=1.0)
    s.hr(MARGIN, 268, CW, INK, 2)

    # ── eje de tiempo ──
    ay = 306
    s.arrow(MARGIN, ay, W - MARGIN, ay, BDS, 1, 10)
    cwid = (CW - 3 * 24) / 4.0
    for i, (_, _, _, when, _, _) in enumerate(_PHASES):
        x = MARGIN + i * (cwid + 24)
        s.line(x, ay - 7, x, ay + 7, INK, 2)
        s.text(x + 14, ay - 12, 300, 24, when, size=T_SRC, bold=True, color=G60,
               tracking=0.12, lh=1.0)

    # ── las cuatro fases ──
    py, ph = 330, 492
    for i, (fase, name, tool, when, steps_, out) in enumerate(_PHASES):
        x = MARGIN + i * (cwid + 24)
        s.rect(x, py, cwid, ph, fill=PAPER, line=INK, lw=1)
        s.rect(x, py, cwid, 104, fill=INK, lw=0)
        s.text(x + 24, py + 22, cwid - 48, 24, fase, size=T_SRC, bold=True,
               color=W55, tracking=0.18, lh=1.0)
        s.text(x + 24, py + 52, cwid - 48, 40, name, size=32, bold=True, color=PAPER,
               tracking=-0.02, lh=1.0)
        s.text(x + 24, py + 124, cwid - 48, 24, tool, size=T_SRC, bold=True, color=ACC,
               tracking=0.16, lh=1.0)
        cy = py + 158
        for n, t, note in steps_:
            s.hr(x + 24, cy, cwid - 48, BD, 1)
            s.text(x + 24, cy + 16, 44, 24, n, size=17, bold=True, color=G50,
                   tracking=0.08, lh=1.0)
            s.text(x + 72, cy + 12, cwid - 96, 34, t, size=22, bold=True, color=INK,
                   tracking=-0.01, lh=1.15)
            s.text(x + 72, cy + 46, cwid - 96, 30, note, size=16, color=G60, lh=1.25)
            cy += 84
        s.hr(x + 24, py + ph - 78, cwid - 48, INK, 2)
        s.text(x + 24, py + ph - 64, cwid - 48, 22, "SALES CON", size=13, bold=True,
               color=G50, tracking=0.14, lh=1.0)
        s.text(x + 24, py + ph - 38, cwid - 48, 30, out, size=19, bold=True,
               color=INK, lh=1.2)
        if i < 3:
            s.arrow(x + cwid + 2, py + 54, x + cwid + 22, py + 54, INK, 2, 8)

    # ── franja obligatoria ──
    by = py + ph + 22
    s.rect(MARGIN, by, CW, 108, fill=INK, lw=0)
    s.text(MARGIN + 34, by + 22, 260, 26, "SÍ O SÍ", size=T_SRC, bold=True,
           color=PAPER, tracking=0.18, lh=1.0)
    s.text(MARGIN + 34, by + 52, 300, 44,
           "Sin esto, el módulo\nno se da por entregado.", size=16, color=W62, lh=1.3)
    musts = ["Un deck de diapositivas hecho con estas plantillas",
             "Un entregable por bloque, publicado como tarea con plazo",
             "Material y grabación en el Campus el mismo día de la clase"]
    mw = (CW - 380 - 2 * 24) / 3.0
    for i, m in enumerate(musts):
        x = MARGIN + 380 + i * (mw + 24)
        s.checkbox(x, by + 26, 22, on=True, color=PAPER)
        s.text(x + 36, by + 20, mw - 40, 70, m, size=18, color=PAPER, lh=1.35)
    s.notes = (
        "HOJA PRINCIPAL — Proceso oficial de creación de un módulo.\n\n"
        "Carril 1 · NotebookLM: se cargan las fuentes del módulo (guía del curso, casos, "
        "normativa, plantillas) y se le pide el guion por bloques con minutos y ejercicios.\n"
        "Carril 2 · Diapositivas: se eligen los códigos de plantilla de este archivo y se "
        "monta el deck. Una idea por diapositiva.\n"
        "Carril 3 · Classroom: el módulo es un Tema. El material se publica antes de clase; "
        "la tarea con entregable y fecha límite, el día anterior.\n"
        "Carril 4 · Aula y Campus: 4 h en directo con el 40 % del tiempo en ejercicio; "
        "grabación y deck el mismo día; corrección en 7 días.\n\n"
        "Obligatorio: deck de diapositivas, un entregable por bloque y material publicado.")
    return s.build()


# ══════════════════════════ 04-05 · LOS 9 PASOS ══════════════════════════
_STEPS = [
    ("01", "Reúne las fuentes", "NOTEBOOKLM", "D-14 → D-10",
     "Abre un cuaderno nuevo y sube todo lo que ya existe: guía del curso, normativa, "
     "casos, informes y tus notas.",
     "Cuaderno con 5–12 fuentes"),
    ("02", "Genera el guion", "NOTEBOOKLM", "D-10 → D-7",
     "Pide el guion por bloques, con minutos y ejercicios. Verifica los datos: lo que no "
     "esté en una fuente, no entra.",
     "Guion de 4 h por bloques"),
    ("03", "Elige los códigos", "ESTE ARCHIVO", "D-7",
     "Asigna a cada diapositiva del guion un código de plantilla (A01, C01, F05…). "
     "No encadenes 3 de la misma familia.",
     "Escaleta con códigos"),
    ("04", "Monta el deck", "POWERPOINT / SLIDES", "D-7 → D-3",
     "Duplica las plantillas y escribe encima. Una idea por diapositiva y menos de 40 "
     "palabras en cada una.",
     "Deck de 40–50 diapositivas"),
    ("05", "Control de 60 segundos", "CHECKLIST", "D-3",
     "Pasa el checklist de marca, exporta a PDF y ábrelo en el móvil. Si tienes que "
     "hacer zoom, no está listo.",
     "PPTX + PDF definitivos"),
    ("06", "Crea el Tema del módulo", "GOOGLE CLASSROOM", "D-3",
     "Un Tema por módulo. Sube el deck en PDF, la plantilla del ejercicio y las lecturas "
     "de apoyo.",
     "Tema publicado con material"),
    ("07", "Publica la tarea", "GOOGLE CLASSROOM", "D-1",
     "Una tarea por bloque, con entregable concreto, rúbrica de tres criterios y fecha "
     "límite.",
     "Tarea con plazo y rúbrica"),
    ("08", "Imparte 4 horas", "AULA EN DIRECTO", "DÍA 0",
     "Al menos el 40 % del tiempo en ejercicio. Comparte el deck a pantalla completa y "
     "graba la sesión.",
     "Sesión impartida y grabada"),
    ("09", "Sube, corrige y cierra", "CAMPUS", "D+1 → D+7",
     "Grabación y deck el mismo día. Feedback de cada entregable en 7 días y nota de "
     "cierre con el siguiente paso.",
     "Módulo cerrado en el Campus"),
]


def steps_detail(part=1):
    s = Slide(foot_right="GUÍA · %02d" % (2 + part))
    rng = _STEPS[:5] if part == 1 else _STEPS[5:]
    y = s.header("PROCESO · DETALLE",
                 "Los nueve pasos, uno a uno" if part == 1 else "De Classroom al cierre",
                 right="PASOS %s DE 9" % ("01–05" if part == 1 else "06–09"))
    n = len(rng)
    gap = 28
    cw = (CW - gap * (n - 1)) / float(n)
    for i, (num, t, tool, when, desc, out) in enumerate(rng):
        x = MARGIN + i * (cw + gap)
        s.hr(x, y, cw, INK, 2)
        s.text(x, y + 22, cw, 26, "PASO " + num, size=20, bold=True, color=ACC,
               tracking=0.14, lh=1.0)
        s.text(x, y + 58, cw, 84, t, size=30, bold=True, color=INK, tracking=-0.02,
               lh=1.12)
        s.text(x, y + 160, cw, 180, desc, size=20, color=G70, lh=1.5)
        by = y + 380
        s.hr(x, by, cw, BD, 1)
        s.text(x, by + 16, cw, 24, "DÓNDE", size=13, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        s.text(x, by + 40, cw, 26, tool, size=17, bold=True, color=INK, lh=1.2)
        s.text(x, by + 78, cw, 24, "CUÁNDO", size=13, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        s.text(x, by + 102, cw, 26, when, size=17, bold=True, color=INK, lh=1.2)
        s.text(x, by + 140, cw, 24, "SALES CON", size=13, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        s.text(x, by + 164, cw, 60, out, size=17, color=G70, lh=1.3)
    s.notes = "Detalle de los pasos %s. Los plazos son sobre el día de la clase (DÍA 0)." % (
        "01–05" if part == 1 else "06–09")
    return s.build()


# ══════════════════════════ 06 · NOTEBOOKLM ══════════════════════════
def notebooklm_flow():
    s = Slide(foot_right="GUÍA · 05")
    y = s.header("HERRAMIENTA · NOTEBOOKLM",
                 "Del material que ya tienes al guion de 4 horas",
                 right="PASO 01–02")
    boxes = [("FUENTES", "Guía del curso, normativa,\ncasos, informes, tus notas",
              "5–12 documentos"),
             ("CUADERNO", "Un cuaderno por módulo.\nNada de mezclar módulos",
              "notebooklm.google.com"),
             ("GUION", "Bloques, minutos,\nejercicios y datos citados",
              "Salida en texto"),
             ("ESCALETA", "Cada diapositiva con su\ncódigo de plantilla",
              "A01 · C01 · F05 …")]
    bw = (col(8) - 3 * 38) / 4.0
    for i, (t, d, meta) in enumerate(boxes):
        x = MARGIN + i * (bw + 38)
        s.rect(x, y, bw, 210, fill=PAPER, line=INK, lw=1)
        s.text(x + 20, y + 22, bw - 40, 26, t, size=T_SRC, bold=True, color=ACC,
               tracking=0.16, lh=1.0)
        s.text(x + 20, y + 58, bw - 40, 110, d, size=19, bold=True, color=INK, lh=1.35)
        s.hr(x + 20, y + 158, bw - 40, BD, 1)
        s.text(x + 20, y + 172, bw - 40, 30, meta, size=14, color=G60, lh=1.2)
        if i < 3:
            s.arrow(x + bw + 6, y + 105, x + bw + 30, y + 105, INK, 2, 8)

    y2 = y + 262
    s.hr(MARGIN, y2, col(8), BD, 1)
    left = [("Qué fuentes valen",
             ["Documentos internos del curso y la guía docente",
              "Informes con fecha y autor (Deel, Remote, OCDE…)",
              "Casos reales anonimizados y tus propias notas"]),
            ("Qué no vale",
             ["Blogs sin fecha ni autor y contenido de terceros con copyright",
              "Datos sin fuente: si no está en una fuente, no entra en la diapositiva",
              "Material de otro módulo: un cuaderno por módulo"])]
    cwid = (col(8) - 46) / 2.0
    for i, (t, items) in enumerate(left):
        x = MARGIN + i * (cwid + 46)
        s.text(x, y2 + 22, cwid, 30, t, size=24, bold=True, color=INK, lh=1.2)
        cy = y2 + 66
        for it in items:
            s.text(x, cy, 24, 26, "—", size=19, bold=True, color=INK, lh=1.3)
            s.text(x + 30, cy, cwid - 30, 70, it, size=19, color=G70, lh=1.4)
            cy += 62
    # rail derecha
    rx = colx(8) + 26
    rw = W - MARGIN - rx
    s.rect(rx, y, rw, CONTENT_B - y - 10, fill=INK, lw=0)
    s.text(rx + 26, y + 26, rw - 52, 26, "REGLAS DE USO", size=T_SRC, bold=True,
           color=W62, tracking=0.16, lh=1.0)
    rules = ["El guion lo escribe la IA; los datos los verificas tú.",
             "Cita siempre la fuente bajo el dato, en 10 pt.",
             "Nada de emoji ni de adjetivos: cifras y verbos.",
             "El resumen en audio de NotebookLM no sustituye a la clase.",
             "Revisa el guion en voz alta antes de montar el deck."]
    cy = y + 78
    for r in rules:
        s.rect(rx + 26, cy + 8, 8, 8, fill=ACC, lw=0)
        s.text(rx + 46, cy, rw - 72, 110, r, size=19, color=W82, lh=1.45)
        cy += 104
    s.notes = ("NotebookLM se usa como generador de guion, nunca como fuente. "
               "Un cuaderno por módulo, entre 5 y 12 fuentes, y verificación humana "
               "de cada dato antes de que llegue a una diapositiva.")
    return s.build()


# ══════════════════════════ 07 · EL PROMPT ══════════════════════════
PROMPT = """Actúa como diseñador instruccional de ActiveXRemote.

FUENTES: usa solo los documentos de este cuaderno.
FORMATO: usa el catálogo «Plantillas de diapositiva» (64 layouts, A01–I08).

Genera la escaleta del MÓDULO NN — «TÍTULO» (4 h en directo).

1. Divide la sesión en 4 bloques de 45 min + 3 ejercicios + cierre.
2. Para cada diapositiva devuelve, en este orden:
      [CÓDIGO · nombre del layout]
      etiqueta: ...
      titulo:   ...
      texto:    ...
      fuente:   ...
3. El título de cada diapositiva es una AFIRMACIÓN, no una etiqueta.
4. Máximo 40 palabras por diapositiva. Frases de menos de 20 palabras.
5. No encadenes más de 3 diapositivas de la misma familia.
6. Estructura obligatoria por bloque:
      A03 → contenido ×8-12 → F05 o H04 → I01 (ejercicio) → I06
7. Marca los medios entre corchetes: [FOTO: ...] [VÍDEO: ...] [CAPTURA: ...]
8. Tuteo. Sin emoji. Cifras en dígitos y siempre con fuente citada.

Empieza por el BLOQUE 1."""


def notebooklm_prompt():
    s = _dark(foot="GUÍA · 06")
    y = s.header("HERRAMIENTA · NOTEBOOKLM", "El prompt que se pega tal cual",
                 right="COPIAR Y PEGAR")
    bw = col(7)
    s.rect(MARGIN, y, bw, 640, fill=W08, lw=0)
    s.rect(MARGIN, y, 5, 640, fill=ACC, lw=0)
    s.text(MARGIN + 30, y + 24, bw - 60, 26, "PROMPT · MÓDULO", size=T_SRC, bold=True,
           color=W62, tracking=0.16, lh=1.0)
    s.text(MARGIN + 30, y + 62, bw - 60, 560, PROMPT, size=15, color=PAPER, lh=1.62,
           mono=True)
    rx = colx(7) + 12
    rw = W - MARGIN - rx
    s.text(rx, y, rw, 40, "Cómo se usa", size=32, bold=True, color=PAPER,
           tracking=-0.02, lh=1.1)
    items = [("01", "Sustituye NN y TÍTULO por los de tu módulo."),
             ("02", "Pégalo en el chat del cuaderno con tus fuentes ya cargadas."),
             ("03", "Pide bloque a bloque: la salida completa se corta."),
             ("04", "Copia la escaleta a un documento y verifica cada dato."),
             ("05", "Solo entonces abre las plantillas y monta el deck.")]
    cy = y + 64
    for n, t in items:
        s.hr(rx, cy, rw, W12, 1)
        s.text(rx, cy + 18, 46, 26, n, size=18, bold=True, color=ACC, lh=1.0)
        s.text(rx + 54, cy + 16, rw - 54, 90, t, size=20, color=W82, lh=1.4)
        cy += 96
    s.note(rx, cy + 8, rw, 116,
           "Si una diapositiva no encaja en ningún código del catálogo, no inventes un "
           "diseño nuevo: escribe al equipo de campus.", size=19, accent=ACC)
    s.notes = ("Prompt oficial para NotebookLM. Se pega en el cuaderno del módulo, "
               "con las fuentes ya cargadas, y se pide bloque a bloque.")
    return s.build()


# ══════════════════════════ 08 · CLASSROOM ══════════════════════════
def classroom():
    s = Slide(foot_right="GUÍA · 07")
    y = s.header("HERRAMIENTA · GOOGLE CLASSROOM",
                 "Cómo queda montado el módulo en Classroom",
                 right="PASO 05–07")
    # ── wireframe de la clase ──
    bx, bw = MARGIN, col(7)
    s.card(bx, y, bw, 560, hard=12)
    s.rect(bx, y, bw, 74, fill=INK, lw=0)
    s.text(bx + 24, y, 500, 74, "TRABAJO DE CLASE", size=T_SRC, bold=True,
           color=PAPER, tracking=0.16, anchor="m", lh=1.0)
    s.text(bx + bw - 250, y, 226, 74, "COHORTE 2026-01", size=T_SRC, bold=True,
           color=W55, tracking=0.12, align="r", anchor="m", lh=1.0)
    s.text(bx + 24, y + 100, bw - 48, 40, "MÓDULO 03 · Tu salario se negocia antes "
           "de la primera llamada", size=26, bold=True, color=INK, tracking=-0.02,
           lh=1.2)
    s.hr(bx + 24, y + 156, bw - 48, INK, 2)
    rows = [("MATERIAL", "Deck de la sesión (PDF)", "Publicado D-3", True),
            ("MATERIAL", "Plantilla del ejercicio (XLSX)", "Publicado D-3", True),
            ("MATERIAL", "Lectura previa · 2 páginas", "Publicado D-3", False),
            ("TAREA", "Entregable bloque 1 · Guion de negociación", "Entrega D+3", True),
            ("TAREA", "Entregable bloque 2 · Simulación grabada", "Entrega D+7", True),
            ("PREGUNTA", "Quiz de repaso · 5 preguntas", "Cierra D+2", False)]
    cy = y + 176
    for kind, name, when, must in rows:
        s.rect(bx + 24, cy, bw - 48, 58, fill=L10 if kind == "TAREA" else PAPER, lw=0)
        s.rect(bx + 24, cy + 14, 30, 30, fill=INK if kind == "TAREA" else None,
               line=INK, lw=1)
        s.text(bx + 66, cy, 130, 58, kind, size=13, bold=True,
               color=G50, tracking=0.12, anchor="m", lh=1.0)
        s.text(bx + 200, cy, bw - 200 - 220, 58, name, size=20,
               bold=(kind == "TAREA"), color=INK, anchor="m", lh=1.2)
        s.text(bx + bw - 244, cy, 220, 58, when, size=16, color=G60, align="r",
               anchor="m", lh=1.0)
        if must:
            s.rect(bx + 8, cy + 20, 8, 18, fill=ACC, lw=0)
        s.hr(bx + 24, cy + 58, bw - 48, BD, 1)
        cy += 58
    s.text(bx + 24, cy + 18, bw - 48, 30,
           "■ Marcado en morado: obligatorio para dar el módulo por entregado.",
           size=15, color=G60, lh=1.3)

    # ── instrucciones ──
    rx = colx(7) + 12
    rw = W - MARGIN - rx
    steps_ = [("01", "Un Tema por módulo",
               "Trabajo de clase › Crear › Tema. Nómbralo «MÓDULO NN · título»."),
              ("02", "Material antes de clase",
               "Sube el deck en PDF y las plantillas del ejercicio. Programa la publicación en D-3."),
              ("03", "Una tarea por bloque",
               "Con entregable concreto, rúbrica de 3 criterios y fecha límite."),
              ("04", "Todo con plazo",
               "Sin fecha límite no es una tarea: es una sugerencia."),
              ("05", "Cierra el ciclo",
               "Devuelve corregido en 7 días y publica una nota de cierre con el siguiente paso.")]
    cy = y
    for n, t, d in steps_:
        s.hr(rx, cy, rw, BD, 1)
        s.text(rx, cy + 18, 44, 26, n, size=18, bold=True, color=ACC, lh=1.0)
        s.text(rx + 50, cy + 14, rw - 50, 32, t, size=22, bold=True, color=INK,
               tracking=-0.01, lh=1.15)
        s.text(rx + 50, cy + 50, rw - 50, 70, d, size=18, color=G70, lh=1.4)
        cy += 112
    s.notes = ("Estructura obligatoria en Classroom: un Tema por módulo, material "
               "publicado en D-3, una tarea por bloque con entregable y plazo, "
               "corrección en 7 días.")
    return s.build()


# ══════════════════════════ 09 · ENTREGABLES ══════════════════════════
def deliverables():
    s = Slide(foot_right="GUÍA · 08")
    y = s.header("ENTREGA", "Qué entregas y cuándo. Sin excepciones.",
                 right="OBLIGATORIO")
    heads = ["Entregable", "Formato", "Dónde se sube", "Plazo", "Obligatorio"]
    rows = [["Deck de la sesión", "PPTX + PDF · 1920 × 1080", "Campus + Classroom", "D-3", "SÍ"],
            ["Guion de la sesión", "Doc con bloques y minutos", "Campus (privado)", "D-3", "SÍ"],
            ["Plantilla del ejercicio", "XLSX, DOCX o Figma", "Classroom · Material", "D-3", "SÍ"],
            ["Tarea con rúbrica", "Tarea de Classroom", "Classroom · Tarea", "D-1", "SÍ"],
            ["Grabación de la sesión", "MP4 con subtítulos", "Campus · Módulo NN", "D+1", "SÍ"],
            ["Lecturas de apoyo", "PDF o enlace con fuente", "Classroom · Material", "D-3", "No"]]
    s.table(MARGIN, y, col(8), heads, rows,
            col_w=[col(8) * f for f in (.30, .24, .22, .12, .12)],
            row_h=76, body_size=21, color=G70,
            aligns=["l", "l", "l", "l", "c"])
    # tarjeta de énfasis
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.rect(rx, y - 6, rw, 300, fill=INK, lw=0)
    s.text(rx + 30, y + 22, rw - 60, 30, "NO NEGOCIABLE", size=T_SRC, bold=True,
           color=ACC, tracking=0.18, lh=1.0)
    s.text(rx + 30, y + 66, rw - 60, 150,
           "Todo módulo tiene deck de diapositivas.", size=34, bold=True, color=PAPER,
           tracking=-0.02, lh=1.15)
    s.text(rx + 30, y + 200, rw - 60, 90,
           "Hecho con estas plantillas, en 16:9, exportado también a PDF. "
           "Sin deck no se abre el módulo en el Campus.", size=19, color=W82, lh=1.45)
    s.rect(rx, y + 330, rw, 250, fill=None, line=INK, lw=1)
    s.text(rx + 30, y + 356, rw - 60, 26, "TAMAÑO ORIENTATIVO", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    kp = [("40–50", "diapositivas por sesión de 4 h"),
          ("3", "ejercicios como mínimo"),
          ("40 %", "del tiempo, en ejercicio")]
    cy = y + 396
    for v, l in kp:
        s.text(rx + 30, cy, 150, 46, v, size=38, bold=True, color=INK, tracking=-0.03,
               lh=1.0)
        s.text(rx + 190, cy + 6, rw - 220, 44, l, size=17, color=G70, lh=1.25)
        cy += 62
    s.notes = ("Lista cerrada de entregables del profesorado. El deck de diapositivas "
               "es obligatorio en todos los módulos, en PPTX y PDF, 1920 × 1080.")
    return s.build()


# ══════════════════════════ 10 · ANATOMÍA DE LA SESIÓN ══════════════════════════
def session_anatomy():
    s = Slide(foot_right="GUÍA · 09")
    y = s.header("EN DIRECTO", "Anatomía de una sesión de 4 horas",
                 right="RITMO Y PLANTILLAS")
    blocks = [("Apertura", 10, "3", "A01 · A05 · A06"),
              ("Bloque 1", 45, "10-12", "A03 · B0x · C01 · F0x"),
              ("Ejercicio 1", 25, "2", "I01 · I04"),
              ("Pausa", 10, "1", "A03"),
              ("Bloque 2", 45, "10-12", "A03 · G0x · C08"),
              ("Caso real", 20, "4", "H04 · F05"),
              ("Ejercicio 2", 30, "2", "I01 · I02"),
              ("Cierre", 15, "3", "I06 · I07 · I08")]
    total = sum(b[1] for b in blocks)
    tx, tw = MARGIN, CW
    x = tx
    bh = 150
    for i, (name, mins, slides_, codes) in enumerate(blocks):
        bwid = tw * mins / float(total)
        dark_b = name.startswith("Ejercicio")
        s.rect(x, y, bwid - 4, bh, fill=INK if dark_b else L10, lw=0)
        s.text(x + 16, y + 18, bwid - 32, 26, "%d MIN" % mins, size=14, bold=True,
               color=ACC if dark_b else G50, tracking=0.12, lh=1.0)
        s.text(x + 16, y + 48, bwid - 32, 60, name, size=22, bold=True,
               color=PAPER if dark_b else INK, tracking=-0.01, lh=1.15)
        s.text(x + 16, y + 108, bwid - 32, 26, "%s diap." % slides_, size=15,
               color=W62 if dark_b else G60, lh=1.0)
        s.text(x, y + bh + 16, bwid - 4, 60, codes, size=13, bold=True,
               color=G60, tracking=0.06, lh=1.35)
        x += bwid
    # eje
    s.hr(tx, y + bh + 92, tw, INK, 2)
    for i, lab in enumerate(["0:00", "1:00", "2:00", "3:00", "4:00"]):
        px = tx + tw * i / 4.0
        s.line(px, y + bh + 92, px, y + bh + 106, INK, 2)
        s.text(min(px - 50, W - MARGIN - 100), y + bh + 116, 100, 24, lab, size=T_SRC,
               bold=True, color=G60, tracking=0.12, align="c", lh=1.0)

    y2 = y + bh + 176
    rules = [("Un separador cada 8–12 diapositivas",
              "Marca el cambio de bloque con A03 o A04. Sin separadores, la sesión se hace plana."),
             ("Una diapositiva de respiro cada 5–6",
              "Una cifra (F05), una cita (H01) o una imagen a sangre (C03)."),
             ("Nunca 5 diapositivas iguales seguidas",
              "Cambia de familia. Si repites plantilla, cambia al menos el reparto."),
             ("40 % del tiempo en ejercicio",
              "Son 96 minutos de las 4 horas. El ejercicio es el contenido, no el relleno.")]
    cwid = (CW - 3 * 28) / 4.0
    for i, (t, d) in enumerate(rules):
        x = MARGIN + i * (cwid + 28)
        s.hr(x, y2, cwid, INK, 2)
        s.text(x, y2 + 20, cwid, 70, t, size=22, bold=True, color=INK, tracking=-0.01,
               lh=1.2)
        s.text(x, y2 + 100, cwid, 90, d, size=18, color=G70, lh=1.45)
    s.notes = ("Reparto de referencia de una sesión de 4 h y qué familia de plantillas "
               "usar en cada tramo. Los bloques oscuros son ejercicio en vivo.")
    return s.build()


# ══════════════════════════ 11 · CONTROL DE CALIDAD ══════════════════════════
def quality():
    s = Slide(foot_right="GUÍA · 10")
    y = s.header("ANTES DE ENTREGAR", "Control de 60 segundos", right="CALIDAD")
    groups = [("MARCA", ["Logo original, sin deformar ni recolorear",
                         "Zona de respeto libre alrededor del logo",
                         "«ActiveXRemote» escrito junto",
                         "El pie, en la misma esquina toda la sesión"]),
              ("COLOR", ["Solo colores de la paleta",
                         "Un único acento, y el del camino correcto",
                         "Contraste de texto ≥ 4,5:1",
                         "Nada codificado solo por color"]),
              ("TIPOGRAFÍA", ["Inter en toda la pieza",
                              "Nada por debajo de 14 pt",
                              "Máximo tres niveles por diapositiva",
                              "Titulares con tracking negativo"]),
              ("CONTENIDO", ["Menos de 40 palabras por diapositiva",
                             "Todos los datos con fuente citada",
                             "Un entregable claro por bloque",
                             "Cierre con acción, fecha y canal"])]
    cwid = (col(8) - 3 * 24) / 4.0
    for i, (t, items) in enumerate(groups):
        x = MARGIN + i * (cwid + 24)
        s.hr(x, y, cwid, INK, 2)
        s.text(x, y + 20, cwid, 26, t, size=T_SRC, bold=True, color=G50,
               tracking=0.16, lh=1.0)
        cy = y + 58
        for it in items:
            s.checkbox(x, cy + 2, 20, on=False)
            s.text(x + 32, cy - 2, cwid - 32, 100, it, size=18, color=G70, lh=1.4)
            cy += 92
    # nunca
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.rect(rx, y - 6, rw, 520, fill=INK, lw=0)
    s.text(rx + 30, y + 24, rw - 60, 30, "NUNCA", size=T_SRC, bold=True, color=ACC,
           tracking=0.18, lh=1.0)
    never = ["Plantillas de fábrica de PowerPoint",
             "Emoji, clipart o fotos de stock",
             "Texto por debajo de 14 pt",
             "Párrafos completos proyectados",
             "Gráficos 3D o quesitos de siete porciones",
             "Transiciones animadas",
             "Terminar con «¿Preguntas?» o «Gracias»"]
    cy = y + 76
    for n in never:
        s.text(rx + 30, cy, 26, 26, "×", size=22, bold=True, color=W55, lh=1.0)
        s.text(rx + 58, cy - 2, rw - 88, 60, n, size=19, color=W82, lh=1.35)
        cy += 60
    s.rect(rx, y + 540, rw, 130, fill=None, line=INK, lw=1)
    s.text(rx + 30, y + 566, rw - 60, 80,
           "Exporta a PDF y ábrelo en el móvil. Si un título no se lee de un vistazo, "
           "no está listo.", size=20, bold=True, color=INK, lh=1.4)
    s.notes = "Checklist de 60 segundos del brandbook, sección 18."
    return s.build()


# ══════════════════════════ 12 · RETÍCULA ══════════════════════════
def grid_spec():
    s = Slide(foot_right="SISTEMA · 01")
    y = s.header("SISTEMA DE DISEÑO", "La retícula: 12 columnas sobre 1920 × 1080",
                 right="RETÍCULA 16:9")
    gy, gh = y + 10, 330
    s.rect(MARGIN, gy, CW, gh, fill=L10, lw=0)
    for i in range(12):
        s.rect(colx(i), gy, COL, gh, fill="E9E9E9", lw=0)
        s.text(colx(i), gy + gh + 12, COL, 24, "%02d" % (i + 1), size=13, bold=True,
               color=G50, tracking=0.10, align="c", lh=1.0)
    # cotas
    s.line(MARGIN, gy - 26, MARGIN + COL, gy - 26, INK, 1)
    s.text(MARGIN, gy - 56, COL, 24, "114,7 PX", size=13, bold=True, color=INK,
           tracking=0.10, align="c", lh=1.0)
    s.line(colx(1) - GUT, gy - 26, colx(1), gy - 26, ACC, 2)
    s.text(colx(1) - GUT - 40, gy - 56, GUT + 80, 24, "32", size=13, bold=True,
           color=ACC, tracking=0.10, align="c", lh=1.0)
    s.text(MARGIN, gy + gh / 2.0 - 40, CW, 80, "ANCHO ÚTIL · 1728 PX", size=T_SRC,
           bold=True, color=G50, tracking=0.20, align="c", anchor="m", lh=1.0)
    specs = [("Margen lateral", "96 px"), ("Margen superior", "72 px"),
             ("Margen inferior", "100 px"), ("Columnas", "12 × 114,7 px"),
             ("Medianil", "32 px"), ("Rejilla base", "8 px")]
    reparts = [("7 + 5", "Texto e imagen. El reparto que más se usa."),
               ("6 + 6", "Comparativa, dos tarjetas de la misma altura."),
               ("4 + 4 + 4", "Tres bloques, tres ideas."),
               ("8 centrado", "Citas y frases manifiesto."),
               ("12 a sangre", "Portadas, separadores e imagen completa.")]
    y2 = gy + gh + 66
    s.hr(MARGIN, y2, CW, INK, 2)
    s.text(MARGIN, y2 + 20, 300, 26, "MEDIDAS", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    cy = y2 + 58
    for k, v in specs:
        s.text(MARGIN, cy, 260, 28, k, size=19, color=G70, lh=1.2)
        s.text(MARGIN + 260, cy, 140, 28, v, size=19, bold=True, color=INK, lh=1.2)
        cy += 34
    s.text(colx(4), y2 + 20, 400, 26, "REPARTOS HABITUALES", size=T_SRC, bold=True,
           color=G50, tracking=0.16, lh=1.0)
    cy = y2 + 58
    for k, v in reparts:
        s.text(colx(4), cy, 160, 28, k, size=19, bold=True, color=INK, lh=1.2)
        s.text(colx(4) + 170, cy, col(7), 28, v, size=19, color=G70, lh=1.2)
        cy += 34
    s.notes = ("Retícula oficial: 12 columnas de 128 px, medianil 32 px, márgenes "
               "96 / 72 / 100. Todo se apoya en ella, también las imágenes.")
    return s.build()


# ══════════════════════════ 13 · TIPOGRAFÍA ══════════════════════════
def type_spec():
    s = Slide(foot_right="SISTEMA · 02")
    y = s.header("SISTEMA DE DISEÑO", "Escala tipográfica de proyección",
                 right="INTER · UN SOLO TIPO")
    rows = [("Portada", "Aa Título de portada", T_COVER * 0.55, 700, -0.035, "128 px · 96 pt"),
            ("Separador", "Aa Separador de bloque", T_SECT * 0.62, 700, -0.03, "96 px · 72 pt"),
            ("Título", "Aa Título de diapositiva", T_H, 700, -0.03, "64 px · 48 pt"),
            ("Subtítulo", "Aa Subtítulo de apoyo", T_SUB, 600, -0.01, "36 px · 27 pt"),
            ("Cuerpo", "Aa Cuerpo y viñetas", T_BD, 400, 0, "28 px · 21 pt"),
            ("Secundario", "Aa Cuerpo secundario", T_BD2, 400, 0, "24 px · 18 pt"),
            ("Etiqueta", "ETIQUETA / EYEBROW", T_EB, 700, 0.16, "18 px · 13 pt"),
            ("Pie", "PIE Y FUENTE CITADA", T_SRC, 500, 0.10, "14 px · 10 pt")]
    cy = y
    for name, sample, size, wgt, trk, spec in rows:
        s.hr(MARGIN, cy, col(9), BD, 1)
        s.text(MARGIN, cy + 12, 200, 30, name.upper(), size=13, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        s.text(MARGIN + 210, cy + 6, col(6), size * 1.3 + 10, sample, size=size,
               bold=(wgt >= 600), color=INK, tracking=trk, lh=1.1)
        s.text(W - MARGIN - col(3) - 10, cy + 12, col(3), 30, spec, size=15, bold=True,
               color=G60, tracking=0.08, align="r", lh=1.0)
        cy += max(size * 1.35 + 26, 62)
    ry = y + 20
    rx = colx(9) + 30
    rw = W - MARGIN - rx
    s.rect(rx - 30, ry - 40, 1, CONTENT_B - ry + 20, fill=BD, lw=0)
    s.text(rx, ry, rw, 30, "REGLAS", size=T_SRC, bold=True, color=G50, tracking=0.16,
           lh=1.0)
    rules = ["Titular: tracking negativo.\nEtiqueta: tracking positivo.\nCuerpo: cero.",
             "Cuanto mayor el cuerpo,\nmás apretada la interlínea.",
             "Máximo tres niveles\npor diapositiva.",
             "Mínimo absoluto 14 pt.\nNi en las notas al pie.",
             "Sin cursiva y sin 800/900:\nel énfasis es peso o color."]
    cy = ry + 46
    for r in rules:
        s.text(rx, cy, rw, 100, r, size=19, color=G70, lh=1.45)
        cy += 108
    s.notes = ("Escala de proyección del brandbook (sección 15). Las medidas en px son "
               "sobre lienzo 1920 × 1080; los pt, sobre 13,33 × 7,5 in.")
    return s.build()


# ══════════════════════════ 14 · COLOR ══════════════════════════
def color_spec():
    s = Slide(foot_right="SISTEMA · 03")
    y = s.header("SISTEMA DE DISEÑO", "Paleta: contraste primero, color al final",
                 right="MONOCROMO + 1 ACENTO")
    swatches = [(INK, "Ink", "#161616", "18,9:1", PAPER),
                (G90, "Gray 90", "#262626", "16,1:1", PAPER),
                (G70, "Gray 70", "#525252", "7,5:1", PAPER),
                (G60, "Gray 60", "#6F6F6F", "5,3:1", PAPER),
                (G50, "Gray 50", "#8D8D8D", "3,2:1", INK),
                (BD, "Border", "#E0E0E0", "—", INK),
                (L10, "Layer 01", "#F4F4F4", "—", INK),
                (PAPER, "Papel", "#FFFFFF", "—", INK)]
    sw = (col(8) - 7 * 12) / 8.0
    for i, (hexv, name, code, ratio, tcol) in enumerate(swatches):
        x = MARGIN + i * (sw + 12)
        s.rect(x, y, sw, 210, fill=hexv, line=BD if hexv in (PAPER, L10) else None,
               lw=1 if hexv in (PAPER, L10) else 0)
        s.text(x + 14, y + 150, sw - 28, 24, code, size=14, bold=True, color=tcol,
               tracking=0.06, lh=1.0)
        s.text(x + 14, y + 176, sw - 28, 22, ratio, size=13, color=tcol, lh=1.0)
        s.text(x, y + 222, sw, 26, name, size=15, bold=True, color=INK, lh=1.0)
    y2 = y + 290
    s.hr(MARGIN, y2, col(8), INK, 2)
    s.text(MARGIN, y2 + 22, 400, 30, "EL ACENTO DEL CAMINO", size=T_SRC, bold=True,
           color=G50, tracking=0.16, lh=1.0)
    acc = [(ACC, "Remote Professional", "#5B4BF5", "Career Accelerator"),
           (RED, "Remote Founder", "#E4462F", "Global Builder")]
    for i, (hexv, name, code, sub) in enumerate(acc):
        x = MARGIN + i * (col(4) + 20)
        s.rect(x, y2 + 66, col(4) - 20, 130, fill=hexv, lw=0)
        s.text(x + 24, y2 + 90, col(4) - 68, 34, name, size=26, bold=True, color=PAPER,
               tracking=-0.01, lh=1.1)
        s.text(x + 24, y2 + 132, col(4) - 68, 30, code + " · " + sub, size=16,
               color=PAPER, lh=1.2)
    s.text(MARGIN, y2 + 216, col(8), 60,
           "Se usa en la etiqueta de la portada, en la atribución de una cita y en el "
           "rectángulo que destaca una captura. Nunca como fondo ni como color de titular.",
           size=19, color=G70, lh=1.45)
    # 70/20/10
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.text(rx, y, rw, 40, "70 / 20 / 10", size=44, bold=True, color=INK,
           tracking=-0.03, lh=1.0)
    s.text(rx, y + 58, rw, 90,
           "Papel, tinta y acento. El acento aparece una vez por diapositiva: repetido "
           "cinco veces deja de ser acento.", size=19, color=G70, lh=1.45)
    bars = [(0.70, PAPER, "70 % PAPEL", "l"), (0.20, INK, "20 % TINTA", "l"),
            (0.10, ACC, "10 % ACENTO", "r")]
    by = y + 176
    bx = rx
    for pct, c, lab, al in bars:
        bwid = rw * pct
        s.rect(bx, by, bwid - 4, 90, fill=c, line=BD if c == PAPER else None,
               lw=1 if c == PAPER else 0)
        s.text(bx if al == "l" else rx, by + 100,
               min(300, W - MARGIN - bx) if al == "l" else rw, 24,
               lab, size=13, bold=True, color=G60, tracking=0.12, align=al, lh=1.0)
        bx += bwid
    s.text(rx, by + 150, rw, 30, "REGLA DE ORO", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    s.text(rx, by + 186, rw, 200,
           "El campus no tiene color de marca: tiene contraste. El color entra en el "
           "contenido —una captura, un gráfico— no en la decoración.",
           size=19, color=G70, lh=1.5)
    s.notes = "Paleta Campus del brandbook (secciones 4 a 7) y uso del acento del camino."
    return s.build()


# ══════════════════════════ 15 · MARCA ══════════════════════════
def brand_spec():
    s = Slide(foot_right="SISTEMA · 04")
    y = s.header("SISTEMA DE DISEÑO", "El símbolo, el lockup y los cinco gestos",
                 right="MARCA")
    # construcción del símbolo
    s.text(MARGIN, y, col(4), 30, "CONSTRUCCIÓN", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    gx, gy = MARGIN, y + 50
    k = 5.6                                    # 46 × 28 unidades a escala
    s.rect(gx, gy, 46 * k, 28 * k, fill=L10, lw=0)
    for i in range(0, 47, 2):
        s.line(gx + i * k, gy, gx + i * k, gy + 28 * k, "E4E4E4", 1)
    for j in range(0, 29, 2):
        s.line(gx, gy + j * k, gx + 46 * k, gy + j * k, "E4E4E4", 1)
    s.logo(gx, gy, 28 * k, INK)
    s.text(gx, gy + 28 * k + 20, 46 * k, 26, "CAJA 46 × 28 · TRAZO 2 · INGLETE",
           size=13, bold=True, color=G60, tracking=0.10, lh=1.0)
    # lockups
    lx = colx(4) + 10
    s.text(lx, y, col(4), 30, "LOCKUP", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    s.rect(lx, y + 50, col(4), 100, fill=None, line=BD, lw=1)
    s.lockup(lx + 30, y + 86, 28, INK)
    s.rect(lx, y + 166, col(4), 100, fill=INK, lw=0)
    s.lockup(lx + 30, y + 202, 28, PAPER)
    s.text(lx, y + 286, col(4), 60,
           "Zona de respeto: la altura del símbolo por cada lado. Mínimo en diapositiva: "
           "28 px de alto.", size=17, color=G70, lh=1.4)
    # gestos
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.text(rx, y, rw, 30, "LOS CINCO GESTOS", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    gestures = [("Esquina recta", "Radio 0 px en todo el campus."),
                ("Sombra dura", "8 px 8 px 0 en tinta. Sin difuminar."),
                ("Retícula de puntos", "1 px cada 22 px. Fondos y vacíos."),
                ("Cuadrado indicador", "7 px sólidos antes de cada etiqueta."),
                ("Strip de cabecera", "Filete con etiqueta y contador.")]
    cy = y + 50
    for t, d in gestures:
        s.hr(rx, cy, rw, BD, 1)
        s.text(rx, cy + 14, rw, 30, t, size=21, bold=True, color=INK, lh=1.15)
        s.text(rx, cy + 46, rw, 30, d, size=17, color=G70, lh=1.3)
        cy += 92
    # muestras de los gestos
    my = y + 380
    s.hr(MARGIN, my, col(8), INK, 2)
    s.card(MARGIN, my + 30, 240, 150, hard=14)
    s.text(MARGIN + 24, my + 58, 200, 90, "Tarjeta con\nsombra dura", size=22,
           bold=True, color=INK, lh=1.25)
    s.rect(MARGIN + 300, my + 30, 240, 150, fill=L10, lw=0)
    for yy in range(0, 150, 22):
        for xx in range(0, 240, 22):
            s.rect(MARGIN + 300 + xx + 8, my + 30 + yy + 8, 2, 2, fill=BDS, lw=0)
    s.text(MARGIN + 300, my + 192, 240, 26, "RETÍCULA DE PUNTOS", size=13, bold=True,
           color=G60, tracking=0.10, lh=1.0)
    s.rect(MARGIN + 600, my + 30, 7, 7, fill=INK, lw=0)
    s.text(MARGIN + 620, my + 26, 300, 26, "CUADRADO INDICADOR", size=T_EB, bold=True,
           color=G60, tracking=0.16, lh=1.0)
    s.hr(MARGIN + 600, my + 74, col(4), INK, 2)
    s.text(MARGIN + 600, my + 88, 300, 26, "STRIP DE CABECERA", size=13, bold=True,
           color=G60, tracking=0.10, lh=1.0)
    s.text(MARGIN + 600 + col(4) - 200, my + 88, 200, 26, "03 / 12", size=13,
           bold=True, color=G60, tracking=0.10, align="r", lh=1.0)
    s.text(MARGIN + 600, my + 140, col(4), 60,
           "Nunca redibujes el símbolo a mano: se usa siempre el original del repositorio.",
           size=17, color=G70, lh=1.4)
    s.notes = ("Construcción del símbolo ΔX (46 × 28, trazo 2, inglete), lockups y los "
               "cinco gestos gráficos de la marca.")
    return s.build()


def build_guide():
    return [cover(), how_to_use(), master_sheet(),
            steps_detail(1), steps_detail(2),
            notebooklm_flow(), notebooklm_prompt(), classroom(),
            deliverables(), session_anatomy(), quality(),
            grid_spec(), type_spec(), color_spec(), brand_spec()]
