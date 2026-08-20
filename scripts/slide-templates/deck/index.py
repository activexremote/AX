# -*- coding: utf-8 -*-
"""Parte 3: mapa del documento, índice de los 64 layouts y separadores de familia."""
from collections import OrderedDict

from .engine import *          # noqa
from .engine import Slide
import layouts as CAT

ASSETS = {}

FAMILIES = OrderedDict()
for _l in CAT.L:
    FAMILIES.setdefault(_l["family"], []).append(_l)

FAM_LETTER = {f: v[0]["code"][0] for f, v in FAMILIES.items()}
FAM_WHEN = {
    "Apertura": "Abrir la sesión, cambiar de bloque y situar al alumno.",
    "Texto": "Cuando la idea se sostiene sola, sin medio ni dato.",
    "Imagen": "Cuando la prueba es visual: captura, foto o diagrama.",
    "Vídeo": "Vídeo, audio y demo en vivo. Siempre con subtítulos.",
    "Recursos": "Enlaces, plantillas, herramientas y descargas.",
    "Datos": "Cifras con fuente. Nunca un dato sin de dónde sale.",
    "Estructura": "Procesos, comparativas y marcos de decisión.",
    "Personas": "Citas, casos y perfiles. La prueba social del programa.",
    "Actividad": "El 40 % del tiempo de clase. Siempre con entregable.",
    "Cierre": "Resumir, mandar tarea y salir con una acción concreta.",
}


def doc_map(sections):
    """sections: [(nombre, desde, hasta, descripción)] en números de diapositiva."""
    s = Slide(foot_right="MAPA · 00")
    y = s.header("QUÉ HAY DENTRO", "Cuatro partes: proceso, sistema, índice y plantillas",
                 right="MAPA DEL DOCUMENTO")
    gap = 24
    cwid = (CW - gap * 3) / 4.0
    for i, (name, a, b, desc) in enumerate(sections):
        x = MARGIN + i * (cwid + gap)
        s.card(x, y, cwid, 470, hard=14 if i == 0 else 0)
        s.rect(x, y, cwid, 6, fill=ACC if i == 0 else INK, lw=0)
        s.text(x + 30, y + 36, cwid - 60, 26, "PARTE %d" % (i + 1), size=T_SRC,
               bold=True, color=G50, tracking=0.16, lh=1.0)
        s.text(x + 30, y + 76, cwid - 60, 110, name, size=34, bold=True, color=INK,
               tracking=-0.02, lh=1.12)
        s.text(x + 30, y + 200, cwid - 60, 180, desc, size=20, color=G70, lh=1.5)
        s.hr(x + 30, y + 396, cwid - 60, BD, 1)
        s.text(x + 30, y + 414, cwid - 60, 30,
               "DIAPOSITIVAS %02d–%02d" % (a, b), size=T_SRC, bold=True, color=INK,
               tracking=0.12, lh=1.0)
    s.notes = ("Mapa del documento. La Parte 1 es el proceso obligatorio de creación "
               "de un módulo; la Parte 4, el catálogo de plantillas.")
    return s.build()


def _index_slide(fams, part, of=2):
    s = Slide(foot_right="ÍNDICE · %02d" % part)
    y = s.header("ÍNDICE DE PLANTILLAS",
                 "64 layouts en 10 familias" if part == 1 else "64 layouts en 10 familias",
                 right="%d DE %d" % (part, of))
    gap = 24
    n = len(fams)
    cwid = (CW - gap * (n - 1)) / float(n)
    for i, fam in enumerate(fams):
        items = FAMILIES[fam]
        x = MARGIN + i * (cwid + gap)
        s.rect(x, y, cwid, 92, fill=INK, lw=0)
        s.text(x + 20, y + 16, 60, 60, FAM_LETTER[fam], size=44, bold=True,
               color=PAPER, tracking=-0.03, lh=1.0)
        s.text(x + 76, y + 22, cwid - 96, 30, fam.upper(), size=T_SRC, bold=True,
               color=W62, tracking=0.16, lh=1.0)
        s.text(x + 76, y + 52, cwid - 96, 30, "%d plantillas" % len(items), size=T_SM,
               color=W55, lh=1.0)
        cy = y + 114
        for l in items:
            s.text(x, cy, 60, 26, l["code"], size=T_SM, bold=True, color=ACC,
                   tracking=0.04, lh=1.0)
            s.text(x + 62, cy - 2, cwid - 62, 52, l["name"], size=T_SM, color=G70,
                   lh=1.25)
            s.hr(x, cy + 40, cwid, BD, 1)
            cy += 52
        s.text(x, y + 114 + 9 * 52 + 18, cwid, 60, FAM_WHEN[fam], size=13, color=G60,
               lh=1.35)
    s.notes = "Índice de las plantillas. Cada código lleva a su diapositiva en la Parte 4."
    return s.build()


def index_slides():
    fams = list(FAMILIES.keys())
    return [_index_slide(fams[:5], 1), _index_slide(fams[5:], 2)]


def family_divider(fam, first_num=None):
    items = FAMILIES[fam]
    letter = FAM_LETTER[fam]
    s = Slide(bg=INK, dark=True, foot_right="FAMILIA %s" % letter)
    if ASSETS.get("dots_dark"):
        s.pic(ASSETS["dots_dark"])
    s.eyebrow(MARGIN, 250, "PARTE 4 · CATÁLOGO DE PLANTILLAS", ACC)
    s.h(MARGIN, 294, col(6), fam, size=T_SECT, lh=1.02, lines=1)
    s.hr(MARGIN, 424, 120, PAPER, 3)
    s.text(MARGIN, 460, col(5), 90, FAM_WHEN[fam], size=T_BD, color=W82, lh=1.45)
    s.text(MARGIN, 590, col(5), 40, "%d PLANTILLAS · %s–%s"
           % (len(items), items[0]["code"], items[-1]["code"]), size=T_SRC, bold=True,
           color=W55, tracking=0.16, lh=1.0)
    s.text(MARGIN - 8, 640, 900, 250, items[0]["code"], size=210, bold=True,
           color=W12, tracking=-0.04, lh=1.0)
    rx = colx(7)
    rw = W - MARGIN - rx
    cy = 260
    for l in items:
        s.hr(rx, cy, rw, W12, 1)
        s.text(rx, cy + 14, 70, 26, l["code"], size=T_SM, bold=True, color=ACC,
               tracking=0.04, lh=1.0)
        s.text(rx + 80, cy + 12, rw - 80, 50, l["name"], size=T_SM, color=W82, lh=1.2)
        cy += 56
    s.notes = ("Separador de la familia %s (%s). %s"
               % (letter, fam, FAM_WHEN[fam]))
    return s.build()
