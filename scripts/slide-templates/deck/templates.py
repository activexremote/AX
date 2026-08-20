# -*- coding: utf-8 -*-
"""
Parte 4: las 64 plantillas de diapositiva, una por layout del catálogo
(`layouts.py`, la fuente de verdad de códigos, nombres, zonas y límites).

Cada plantilla se entrega vacía —lorem ipsum donde va el texto— con la marca ya
aplicada, y lleva su ficha completa en las notas del ponente.
"""
from .engine import *          # noqa
from .engine import Slide

import layouts as CAT          # catálogo (scripts/slide-templates/layouts.py)

LT   = CAT.LT      # 40 car.
LT2  = CAT.LT2
LS   = CAT.LS
LSS  = CAT.LSS
LX   = CAT.LX
LB   = CAT.LB
LP   = CAT.LP
LP2  = CAT.LP2
LP3  = CAT.LP3
LP4  = CAT.LP4
EB   = CAT.EB
URL  = CAT.URL
TT   = LSS.title()             # «Lorem Ipsum Dolor»

ASSETS = {}
META = {l["code"]: l for l in CAT.L}
BUILDERS = {}


def tpl(code):
    def deco(fn):
        BUILDERS[code] = fn
        return fn
    return deco


# ══════════════════════════ ANDAMIAJE ══════════════════════════
def _slide(code, dark=False, dots=False):
    s = Slide(bg=INK if dark else PAPER, dark=dark, code=code)
    if dark and dots and ASSETS.get("dots_dark"):
        s.pic(ASSETS["dots_dark"])
    return s


def head(s, title, eb=EB, y=148, size=T_H, w=None, lines=None, acc=None, sub=None,
         rule=True, counter="BLOQUE 01 · 03 / 12"):
    """Cabecera de plantilla: etiqueta, título, filete con marcas y contador."""
    w = w or col(9)
    if lines is None:
        lines = est_lines(title, size, w)
    s.eyebrow(MARGIN, y, eb, acc)
    s.h(MARGIN, y + 38, w, title, size=size, lines=lines)
    cy = y + 38 + size * 1.08 * lines + 30
    if sub:
        s.text(MARGIN, cy, col(8), 40, sub, size=T_SUB, bold=True,
               color=W82 if s.dark else G70, lh=1.25)
        cy += 58
    if rule:
        s.text(W - MARGIN - 500, cy - 44, 500, 24, counter, size=T_SRC, bold=True,
               color=W30 if s.dark else G50, tracking=0.14, align="r", lh=1.0)
        ticks(s, MARGIN, cy, CW, n=12)
        cy += 44
    return cy


def source(s, x=None, y=940, txt="FUENTE · LOREM IPSUM (2026)", w=700, align="l"):
    s.text(x if x is not None else MARGIN, y, w, 24, txt, size=T_SRC, bold=True,
           color=W30 if s.dark else G50, tracking=0.10, align=align, lh=1.0)


def caption(s, x, y, w=700, txt="LOREM IPSUM · PIE DE IMAGEN"):
    s.text(x, y, w, 24, txt, size=T_SRC, bold=True, color=G50, tracking=0.10, lh=1.0)


def ticks(s, x, y, w, n=4, color=None):
    """Filete con marcas de retícula: gesto técnico de la marca."""
    color = color or (W12 if s.dark else BDS)
    s.hr(x, y, w, color, 1)
    for i in range(n + 1):
        px = min(x + w * i / float(n), x + w - 1)
        s.line(px, y, px, y + 7, color, 1)


def notes_for(code):
    l = META[code]
    z = "\n".join("   · %s — %s%s" % (k, lim, (" · " + note) if note else "")
                  for k, lim, note in l["zones"])
    ia = ("LAYOUT: %s — %s | FAMILIA: %s | FONDO: %s\nZONAS: %s"
          % (l["code"], l["name"], l["family"],
             "tinta #161616" if l["dark"] else "blanco",
             " | ".join("%s(%s)" % (k, lim.replace(" car.", "").strip())
                        for k, lim, _ in l["zones"])))
    return ("%s · %s — %s\n\n%s\n\nZONAS DE TEXTO\n%s\n\nUSAR CUANDO\n%s\n\n"
            "NO USAR CUANDO\n%s\n\nBLOQUE PARA LA IA\n%s"
            % (l["code"], l["name"], l["family"], l["purpose"], z,
               "\n".join("   · " + u for u in l["use"]),
               "\n".join("   · " + a for a in l["avoid"]), ia))


# ══════════════════════════════════════════════════════════════════
#  A · APERTURA Y NAVEGACIÓN
# ══════════════════════════════════════════════════════════════════
@tpl("A01")
def a01(s):
    s.pic(ASSETS["dots_dark"])
    s.corner_marks()
    s.logo(MARGIN, 72, 40, PAPER)
    s.text(W - MARGIN - 600, 80, 600, 26, "REMOTE PROFESSIONAL · COHORTE 2026-01",
           size=T_SRC, bold=True, color=W30, tracking=0.16, align="r", lh=1.0)
    s.eyebrow(MARGIN, 604, EB, ACC)
    s.h(MARGIN, 646, col(10), LT, size=T_SECT, lh=1.02, lines=2)
    s.hr(MARGIN, 872, 180, PAPER, 3)
    s.text(MARGIN, 906, col(8), 36, "Lorem Ipsum · lorem ipsum dolor · 4 h en directo",
           size=T_BD2, color=W82, lh=1.3)
    # rail técnico
    s.vr(W - MARGIN - 2, 604, 300, W12, 1)
    s.text(W - MARGIN - 320, 604, 300, 26, "MÓDULO 00 · HORA 1", size=T_SRC,
           bold=True, color=W55, tracking=0.14, align="r", lh=1.0)
    s.text(W - MARGIN - 320, 878, 300, 26, "45 DIAPOSITIVAS", size=T_SRC, bold=True,
           color=W30, tracking=0.14, align="r", lh=1.0)


@tpl("A02")
def a02(s):
    s.ph(0, 0, W, H, "FOTOGRAFÍA A SANGRE · 1920 × 1080 PX", "fotodark")
    s.veil(0, 0, W, H, INK, 0.30, 0.30)
    s.veil(0, H - 620, W, 620, INK, 0.0, 0.92)
    s.logo(MARGIN, 72, 40, PAPER)
    s.eyebrow(MARGIN, 640, EB, ACC)
    s.h(MARGIN, 682, col(9), LT, size=T_SECT, lh=1.02, lines=2)
    s.text(MARGIN, 890, col(8), 36, "Lorem Ipsum · lorem ipsum dolor",
           size=T_BD2, color=W82, lh=1.3)
    s.text(W - MARGIN - 500, 80, 500, 26, "FOTO A SANGRE · VELO 55 %", size=T_SRC,
           bold=True, color=W30, tracking=0.14, align="r", lh=1.0)


@tpl("A03")
def a03(s):
    s.pic(ASSETS["dots_dark"])
    s.text(MARGIN, 300, 400, 200, "01", size=180, bold=True, color=W30,
           tracking=-0.04, lh=1.0)
    s.h(MARGIN, 500, col(7), TT, size=T_SECT, lh=1.02, lines=2)
    s.hr(MARGIN, 720, 120, PAPER, 3)
    s.text(MARGIN, 756, col(6), 90, LP4, size=T_BD, color=W82, lh=1.45)
    # índice del bloque a la derecha
    rx = colx(8)
    rw = W - MARGIN - rx
    s.text(rx, 300, rw, 26, "EN ESTE BLOQUE", size=T_SRC, bold=True, color=W55,
           tracking=0.16, lh=1.0)
    cy = 344
    for i in range(4):
        s.hr(rx, cy, rw, W12, 1)
        s.text(rx, cy + 16, 40, 26, "%02d" % (i + 1), size=T_SM, bold=True,
               color=ACC if i == 0 else W30, tracking=0.08, lh=1.0)
        s.text(rx + 52, cy + 14, rw - 52, 60, LSS, size=T_BD2,
               color=PAPER if i == 0 else W62, lh=1.3)
        cy += 78


@tpl("A04")
def a04(s):
    s.ph(0, 0, W, H, "FOTOGRAFÍA A SANGRE · 1920 × 1080 PX", "fotodark")
    s.veil(0, 0, W, H, INK, 0.55, 0.72)
    s.text(0, 330, W, 130, "02", size=120, bold=True, color=W62, tracking=-0.04,
           align="c", lh=1.0)
    s.text(0, 470, W, 110, TT, size=T_SECT, bold=True, color=PAPER, tracking=-0.03,
           align="c", lh=1.02)
    s.hr(W / 2.0 - 60, 630, 120, PAPER, 3)
    s.text(0, 664, W, 40, LP4, size=T_BD2, color=W82, align="c", lh=1.4)


@tpl("A05")
def a05(s):
    cy = head(s, LT, "HOY", sub=None)
    n = 5
    gap = (CONTENT_B - 40 - cy) / float(n)
    for i in range(n):
        y = cy + i * gap
        s.hr(MARGIN, y, col(9), INK if i == 0 else BD, 2 if i == 0 else 1)
        s.text(MARGIN, y + 20, 60, 40, "%02d" % (i + 1), size=T_BD, bold=True,
               color=INK, lh=1.1)
        s.text(MARGIN + 72, y + 18, col(6), 44, LB, size=T_BD, color=G70, lh=1.25)
        s.text(colx(8), y + 20, col(1), 34, "%d min" % (20 + i * 10), size=T_SM,
               bold=True, color=G50, align="r", lh=1.0)
    rx = colx(9) + 10
    rw = W - MARGIN - rx
    s.rect(rx, cy - 6, rw, 300, fill=L10, lw=0)
    s.rect(rx, cy - 6, 5, 300, fill=ACC, lw=0)
    s.text(rx + 26, cy + 22, rw - 52, 26, "SALES CON", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(rx + 26, cy + 60, rw - 52, 180, LP3, size=T_BD2, bold=True, color=INK,
           lh=1.35)


@tpl("A06")
def a06(s):
    cy = head(s, LT, "AL TERMINAR SABRÁS")
    items = [("Analizar", LB), ("Construir", LB), ("Decidir", LB), ("Entregar", LB)]
    gap = 22
    cwid = (CW - gap * 3) / 4.0
    for i, (verb, txt) in enumerate(items):
        x = MARGIN + i * (cwid + gap)
        s.card(x, cy, cwid, 430)
        s.rect(x, cy, cwid, 6, fill=ACC if i == 0 else INK, lw=0)
        s.text(x + 26, cy + 34, cwid - 52, 26, "OBJETIVO %02d" % (i + 1), size=T_SRC,
               bold=True, color=G50, tracking=0.14, lh=1.0)
        s.text(x + 26, cy + 74, cwid - 52, 50, verb, size=34, bold=True, color=INK,
               tracking=-0.02, lh=1.1)
        s.text(x + 26, cy + 140, cwid - 52, 160, txt, size=T_BD2, color=G70, lh=1.45)
    source(s, y=cy + 466, txt="CADA OBJETIVO EMPIEZA POR UN VERBO DE ACCIÓN")


@tpl("A07")
def a07(s):
    cy = head(s, LT, "MAPA DEL CURSO")
    n = 7
    tw = CW
    step = tw / float(n - 1)
    ty = cy + 90
    s.hr(MARGIN, ty, tw, BD, 2)
    for i in range(n):
        x = min(MARGIN + i * step, W - MARGIN - 9)
        on = i == 2
        s.rect(x - 9, ty - 9, 18, 18, fill=INK if on else G30, lw=0)
        if on:
            s.rect(x - 17, ty - 17, 34, 34, fill=None, line=INK, lw=2)
        lx = min(max(x - 80, MARGIN), W - MARGIN - 160)
        s.text(lx, ty - 62, 160, 26, "MOD %02d" % (i + 1), size=T_SRC, bold=True,
               color=INK if on else G50, tracking=0.10, align="c", lh=1.0)
        s.text(lx, ty + 34, 160, 70, LSS, size=T_SM, bold=on,
               color=INK if on else G60, align="c", lh=1.3)
    s.rect(MARGIN, ty + 170, col(5), 190, fill=L10, lw=0)
    s.text(MARGIN + 30, ty + 200, col(5) - 60, 26, "ESTÁS AQUÍ", size=T_SRC,
           bold=True, color=ACC, tracking=0.16, lh=1.0)
    s.text(MARGIN + 30, ty + 240, col(5) - 60, 110, LP3, size=T_BD2, color=G70, lh=1.45)
    s.hbar(colx(6), ty + 200, col(6), "PROGRESO DEL PROGRAMA", 0.29, "29 %", lab_w=430)
    s.text(colx(6), ty + 260, col(6), 90,
           "4 de 14 módulos completados. Cada módulo son 4 horas en directo.",
           size=T_BD2, color=G70, lh=1.45)


# ══════════════════════════════════════════════════════════════════
#  B · TEXTO
# ══════════════════════════════════════════════════════════════════
@tpl("B01")
def b01(s):
    cy = head(s, LT, EB, y=300, size=T_H, w=col(7), rule=False)
    s.text(MARGIN, cy, col(7), 220, LP, size=T_BD, color=G70, lh=1.55)
    s.vr(colx(8), 300, 300, BD, 1)
    s.text(colx(8) + 30, 300, col(4) - 30, 26, "EN UNA FRASE", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(colx(8) + 30, 340, col(4) - 30, 200, LP4, size=T_SUB, bold=True, color=INK,
           lh=1.3)
    source(s)


@tpl("B02")
def b02(s):
    cy = head(s, LT)
    s.bullets(MARGIN, cy, col(8), [LB] * 5, size=T_BD, gap=104)
    rx = colx(9) + 10
    s.rect(rx, cy, W - MARGIN - rx, 240, fill=L10, lw=0)
    s.rect(rx, cy, 5, 240, fill=ACC, lw=0)
    s.text(rx + 26, cy + 26, W - MARGIN - rx - 52, 26, "OJO", size=T_SRC, bold=True,
           color=G50, tracking=0.16, lh=1.0)
    s.text(rx + 26, cy + 64, W - MARGIN - rx - 52, 150, LP3, size=T_BD2, color=G70,
           lh=1.45)
    source(s)


@tpl("B03")
def b03(s):
    cy = head(s, LT)
    for c in range(2):
        x = MARGIN if c == 0 else colx(6)
        wid = col(5)
        s.text(x, cy, wid, 26, "GRUPO %02d" % (c + 1), size=T_SRC, bold=True,
               color=ACC if c == 0 else G50, tracking=0.14, lh=1.0)
        s.bullets(x, cy + 40, wid, [LB] * 3, size=T_BD2, gap=110)


@tpl("B04")
def b04(s):
    cy = head(s, LT)
    for c in range(2):
        x = MARGIN if c == 0 else colx(6)
        wid = col(5)
        s.hr(x, cy, wid, INK, 2)
        s.text(x, cy + 22, wid, 40, TT, size=T_SUB, bold=True, color=INK,
               tracking=-0.01, lh=1.2)
        s.text(x, cy + 84, wid, 300, LP, size=T_BD2, color=G70, lh=1.55)
    source(s)


@tpl("B05")
def b05(s):
    cy = head(s, LT)
    gap = 32
    wid = (CW - gap * 2) / 3.0
    for c in range(3):
        x = MARGIN + c * (wid + gap)
        s.hr(x, cy, wid, INK, 2)
        s.text(x, cy + 22, wid, 26, "%02d" % (c + 1), size=T_SM, bold=True,
               color=ACC if c == 0 else G50, tracking=0.10, lh=1.0)
        s.text(x, cy + 58, wid, 80, TT, size=30, bold=True, color=INK, tracking=-0.01,
               lh=1.15)
        s.text(x, cy + 152, wid, 260, LP2, size=T_BD2, color=G70, lh=1.5)


@tpl("B06")
def b06(s):
    s.eyebrow(MARGIN, 220, "CONCEPTO CLAVE", ACC)
    s.text(MARGIN, 262, col(7), 130, TT, size=96, bold=True, color=INK,
           tracking=-0.035, lh=1.0)
    s.text(MARGIN, 400, col(5), 40, "/ˈlɔː.rəm ˈɪp.səm/  ·  sustantivo", size=T_BD2,
           color=G50, lh=1.2)
    s.hr(MARGIN, 470, col(7), INK, 2)
    s.text(MARGIN, 500, col(7), 200, LP2, size=T_SUB, color=G70, lh=1.4)
    s.card(colx(8), 262, col(4), 400, hard=14)
    s.text(colx(8) + 34, 300, col(4) - 68, 26, "EN CLASE", size=T_SRC, bold=True,
           color=G50, tracking=0.16, lh=1.0)
    s.text(colx(8) + 34, 344, col(4) - 68, 280, LP2, size=T_BD2, color=INK, lh=1.5)
    source(s, y=720)


@tpl("B07")
def b07(s):
    cy = head(s, LT)
    s.text(MARGIN, cy, col(7), 300, LP, size=T_BD, color=G70, lh=1.55)
    s.rect(colx(8), cy - 10, col(4), 380, fill=L10, lw=0)
    s.rect(colx(8), cy - 10, 5, 380, fill=ACC, lw=0)
    s.text(colx(8) + 30, cy + 22, col(4) - 60, 26, "NOTA AL MARGEN", size=T_SRC,
           bold=True, color=G50, tracking=0.14, lh=1.0)
    s.text(colx(8) + 30, cy + 62, col(4) - 60, 280, LP2, size=T_BD2, color=G70, lh=1.5)
    source(s)


@tpl("B08")
def b08(s):
    s.pic(ASSETS["dots_dark"])
    s.text(colx(2), 340, col(8), 300, "«%s»" % LT2, size=T_SECT, bold=True,
           color=PAPER, tracking=-0.03, align="c", lh=1.1)
    s.hr(W / 2.0 - 60, 700, 120, ACC, 3)
    s.text(colx(2), 734, col(8), 40, EB, size=T_EB, bold=True, color=W62,
           tracking=0.16, align="c", lh=1.0)


@tpl("B09")
def b09(s):
    s.eyebrow(MARGIN, 250, "PARA EMPEZAR", ACC)
    s.text(MARGIN, 296, col(9), 260, "¿%s?" % LT, size=T_SECT, bold=True, color=INK,
           tracking=-0.03, lh=1.05)
    s.hr(MARGIN, 600, col(9), INK, 2)
    s.text(MARGIN, 630, col(6), 90, LP3, size=T_BD, color=G70, lh=1.5)
    s.card(colx(9), 600, col(3), 190)
    s.text(colx(9) + 26, 630, col(3) - 52, 26, "RESPONDE EN", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(colx(9) + 26, 668, col(3) - 52, 60, "2 min", size=44, bold=True, color=INK,
           tracking=-0.03, lh=1.0)
    s.text(colx(9) + 26, 730, col(3) - 52, 40, "En el chat, una línea.", size=T_SM,
           color=G60, lh=1.3)


# ══════════════════════════════════════════════════════════════════
#  C · IMAGEN
# ══════════════════════════════════════════════════════════════════
@tpl("C01")
def c01(s):
    cy = head(s, LT, w=col(7))
    s.text(MARGIN, cy, col(6), 170, LP2, size=T_BD, color=G70, lh=1.55)
    s.dashlist(MARGIN, cy + 200, col(6), [LB] * 3, size=T_BD2, gap=52)
    s.ph(colx(7), 190, col(5), 620, "IMAGEN / CAPTURA · 5 COL.", "img",
         note="700 × 620 PX")
    caption(s, colx(7), 826)


@tpl("C02")
def c02(s):
    s.ph(MARGIN, 190, col(5), 620, "IMAGEN / CAPTURA · 5 COL.", "img",
         note="700 × 620 PX")
    caption(s, MARGIN, 826)
    s.text(colx(6), 260, col(6), 26, EB, size=T_EB, bold=True, color=G60,
           tracking=0.16, lh=1.0)
    s.rect(colx(6) - 22, 260, 12, 12, fill=G60, lw=0)
    s.h(colx(6), 300, col(6), LT, size=T_H, lh=1.06, lines=2)
    s.text(colx(6), 452, col(6), 180, LP2, size=T_BD, color=G70, lh=1.55)
    s.dashlist(colx(6), 660, col(6), [LB] * 3, size=T_BD2, gap=52)


@tpl("C03")
def c03(s):
    s.ph(0, 0, W, H, "FOTOGRAFÍA A SANGRE · 1920 × 1080 PX", "fotodark")
    s.veil(0, 0, W, H, INK, 0.25, 0.25)
    s.veil(0, 420, W, H - 420, INK, 0.0, 0.94)
    s.eyebrow(MARGIN, 600, EB, ACC)
    s.h(MARGIN, 642, col(8), LT, size=T_H, lh=1.06, lines=2)
    s.text(MARGIN, 790, col(6), 90, LP3, size=T_BD, color=W82, lh=1.5)
    source(s, txt="FOTO · LOREM IPSUM", y=890)


@tpl("C04")
def c04(s):
    s.ph(MARGIN, 148, CW, 700, "IMAGEN A PANTALLA COMPLETA · 1728 × 700 PX", "img",
         note="RESPETA LA ZONA SEGURA")
    s.hr(MARGIN, 878, CW, INK, 2)
    s.text(MARGIN, 896, col(8), 60, LT, size=T_SUB, bold=True, color=INK,
           tracking=-0.01, lh=1.2)
    source(s, x=colx(8), y=904, w=col(4), align="r")


@tpl("C05")
def c05(s):
    cy = head(s, LT)
    gap = 32
    wid = (CW - gap * 2) / 3.0
    for i in range(3):
        x = MARGIN + i * (wid + gap)
        s.ph(x, cy, wid, 400, "IMAGEN %02d" % (i + 1), "img")
        s.hr(x, cy + 430, wid, INK, 2)
        s.text(x, cy + 448, wid, 60, LSS.title(), size=T_BD2, bold=True, color=INK,
               lh=1.25)
        s.text(x, cy + 500, wid, 60, LP4, size=T_SM, color=G60, lh=1.4)


@tpl("C06")
def c06(s):
    cy = head(s, LT, w=col(5))
    gx, gy = colx(5), 148
    gw, gh = col(7), 700
    cwid = (gw - 20) / 2.0
    chh = (gh - 20) / 2.0
    for i in range(4):
        x = gx + (i % 2) * (cwid + 20)
        y = gy + (i // 2) * (chh + 20)
        s.ph(x, y, cwid, chh, "IMAGEN %02d" % (i + 1), "img")
    s.text(MARGIN, cy, col(4), 220, LP2, size=T_BD2, color=G70, lh=1.55)
    s.dashlist(MARGIN, cy + 240, col(4), [LSS] * 4, size=T_SM, gap=44)


@tpl("C07")
def c07(s):
    cy = head(s, LT)
    wid = (CW - 40) / 2.0
    for i, lab in enumerate(("ANTES", "DESPUÉS")):
        x = MARGIN + i * (wid + 40)
        s.ph(x, cy + 46, wid, 470, "CAPTURA · " + lab, "img")
        s.tagsolid(x, cy, lab, fill=INK if i else G50)
        s.text(x, cy + 536, wid, 60, LP4, size=T_BD2, color=G70, lh=1.4)
    s.line(MARGIN + wid + 20, cy + 46, MARGIN + wid + 20, cy + 516, BDS, 1)
    source(s)


@tpl("C08")
def c08(s):
    cy = head(s, LT, w=col(7))
    s.ph(MARGIN, cy, col(8), 520, "CAPTURA REAL DEL PRODUCTO", "img",
         note="FILETE 1 PX #E0E0E0 · SIN SOMBRA")
    pins = [(0.22, 0.30), (0.58, 0.52), (0.80, 0.24)]
    for i, (px, py) in enumerate(pins):
        x = MARGIN + col(8) * px
        y = cy + 520 * py
        s.rect(x, y, 190, 110, fill=None, line=ACC, lw=2)
        s.rect(x - 1, y - 1, 44, 44, fill=ACC, lw=0)
        s.text(x - 1, y - 1, 44, 44, str(i + 1), size=22, bold=True, color=PAPER,
               align="c", anchor="m", lh=1.0)
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    for i in range(3):
        y = cy + i * 130
        s.rect(rx, y, 40, 40, fill=ACC, lw=0)
        s.text(rx, y, 40, 40, str(i + 1), size=21, bold=True, color=PAPER, align="c",
               anchor="m", lh=1.0)
        s.text(rx, y + 56, rw, 70, LP4, size=T_BD2, color=G70, lh=1.4)
    source(s, y=cy + 560)


# ══════════════════════════════════════════════════════════════════
#  D · VÍDEO Y AUDIO
# ══════════════════════════════════════════════════════════════════
@tpl("D01")
def d01(s):
    s.ph(MARGIN, 148, CW, 700, "VÍDEO INCRUSTADO · 16:9 · CON SUBTÍTULOS", "video")
    s.hr(MARGIN, 878, CW, INK, 2)
    s.text(MARGIN, 896, col(8), 60, LT, size=T_SUB, bold=True, color=INK,
           tracking=-0.01, lh=1.2)
    s.text(colx(8), 900, col(4), 40, "04:12 · SUBTÍTULOS ES/EN", size=T_SRC, bold=True,
           color=G50, tracking=0.10, align="r", lh=1.0)


@tpl("D02")
def d02(s):
    cy = head(s, LT, w=col(7))
    s.ph(MARGIN, cy, col(7), 500, "VÍDEO · 16:9", "video")
    rx = colx(7) + 20
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "PUNTOS CLAVE", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    times = ["00:12", "01:40", "02:58", "04:05"]
    ry = cy + 44
    for i, t in enumerate(times):
        s.hr(rx, ry, rw, INK if i == 0 else BD, 2 if i == 0 else 1)
        s.text(rx, ry + 16, 110, 26, t, size=T_SM, bold=True, color=ACC, lh=1.0)
        s.text(rx, ry + 46, rw, 60, LB, size=T_BD2, color=G70, lh=1.35)
        ry += 116
    source(s, y=cy + 530)


@tpl("D03")
def d03(s):
    cy = head(s, LT, w=col(7), eb="DEMO EN VIVO")
    s.tagsolid(0, 152, "EN VIVO · 12 MIN", fill=ACC, right=W - MARGIN)
    s.ph(MARGIN, cy, col(8), 520, "PANTALLA COMPARTIDA · APLICACIÓN REAL", "img")
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "LO QUE VAS A VER", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    ry = cy + 44
    for i in range(4):
        s.hr(rx, ry, rw, BD, 1)
        s.text(rx, ry + 14, 40, 26, "%02d" % (i + 1), size=T_SM, bold=True, color=INK,
               lh=1.0)
        s.text(rx + 50, ry + 12, rw - 50, 60, LSS, size=T_BD2, color=G70, lh=1.35)
        ry += 96
    s.note(rx, ry + 10, rw, 120, "Si la demo falla, la captura de la diapositiva "
           "siguiente cuenta lo mismo.", size=T_SM)
    source(s, y=cy + 550)


@tpl("D04")
def d04(s):
    cy = head(s, LT, eb="AUDIO · ENTREVISTA", w=col(8))
    s.rect(MARGIN, cy, col(8), 150, fill=None, line=INK, lw=1)
    s.play(MARGIN + 30, cy + 45, 60, INK)
    bars = 42
    bw = (col(8) - 220) / float(bars)
    import math
    for i in range(bars):
        hgt = 12 + abs(math.sin(i * 0.7)) * 60
        s.rect(MARGIN + 130 + i * bw, cy + 75 - hgt / 2.0, bw - 4, hgt,
               fill=INK if i < bars * 0.4 else G30, lw=0)
    s.text(MARGIN + col(8) - 130, cy, 110, 150, "12:40", size=T_BD2, bold=True,
           color=INK, align="r", anchor="m", lh=1.0)
    s.text(MARGIN, cy + 190, col(8), 160, "«%s»" % LP2, size=T_SUB, bold=True,
           color=INK, lh=1.35)
    s.hr(MARGIN, cy + 380, 120, ACC, 3)
    s.text(MARGIN, cy + 402, col(6), 40, EB, size=T_EB, bold=True, color=G60,
           tracking=0.16, lh=1.0)
    s.ph(colx(9), cy, col(3), 300, "FOTO", "foto")


@tpl("D05")
def d05(s):
    cy = head(s, LT, w=col(6))
    s.ph(MARGIN, cy, col(6), 460, "BUCLE / GIF · SIN AUDIO · 8 S", "video")
    s.text(colx(6) + 20, cy, col(6) - 20, 200, LP2, size=T_BD, color=G70, lh=1.55)
    s.dashlist(colx(6) + 20, cy + 230, col(6) - 20, [LB] * 3, size=T_BD2, gap=52)
    source(s, y=cy + 490)


# ══════════════════════════════════════════════════════════════════
#  E · RECURSOS
# ══════════════════════════════════════════════════════════════════
@tpl("E01")
def e01(s):
    cy = head(s, LT, eb="RECURSO DESTACADO", w=col(7))
    s.card(MARGIN, cy, col(8), 400, hard=14)
    s.text(MARGIN + 40, cy + 40, col(6), 26, "PLANTILLA · XLSX", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(MARGIN + 40, cy + 80, col(6), 90, TT, size=44, bold=True, color=INK,
           tracking=-0.02, lh=1.1)
    s.text(MARGIN + 40, cy + 190, col(6), 120, LP2, size=T_BD2, color=G70, lh=1.5)
    s.link(MARGIN + 40, cy + 320, URL, size=22)
    s.qr(colx(9), cy + 40, 190)
    s.text(colx(9), cy + 250, 190, 40, "ESCANEA", size=T_SRC, bold=True, color=G50,
           tracking=0.14, align="c", lh=1.0)


@tpl("E02")
def e02(s):
    cy = head(s, LT, eb="RECURSOS")
    for i in range(3):
        y = cy + i * 190
        s.hr(MARGIN, y, col(9), INK, 2)
        s.text(MARGIN, y + 20, col(6), 40, TT, size=T_SUB, bold=True, color=INK,
               tracking=-0.01, lh=1.2)
        s.text(MARGIN, y + 76, col(6), 34, URL, size=T_SM, bold=True, color=ACC, lh=1.2)
        s.text(MARGIN, y + 112, col(6), 60, LP4, size=T_SM, color=G60, lh=1.4)
        s.text(colx(7), y + 20, col(2), 30, ["ARTÍCULO", "PLANTILLA", "VÍDEO"][i],
               size=T_SRC, bold=True, color=G50, tracking=0.14, lh=1.0)
        s.text(colx(7), y + 56, col(2), 30, ["8 min", "descarga", "12 min"][i],
               size=T_SM, color=G60, lh=1.2)
    s.qr(colx(9) + 40, cy + 40, 170)
    s.text(colx(9), cy + 230, col(3), 40, "TODOS LOS ENLACES", size=T_SRC, bold=True,
           color=G50, tracking=0.14, align="c", lh=1.0)


@tpl("E03")
def e03(s):
    s.pic(ASSETS["dots_dark"])
    cy = head(s, LT, eb="DESCARGA", w=col(6))
    s.text(MARGIN, cy, col(6), 130, LP2, size=T_BD, color=W82, lh=1.55)
    s.link(MARGIN, cy + 170, URL, size=26, color=PAPER)
    s.text(MARGIN, cy + 250, col(6), 40, "SIN REGISTRO · 2 MB · XLSX", size=T_SRC,
           bold=True, color=W30, tracking=0.14, lh=1.0)
    s.rect(colx(8), cy - 20, col(4), 360, fill=PAPER, lw=0)
    s.qr(colx(8) + (col(4) - 220) / 2.0, cy + 20, 220)
    s.text(colx(8), cy + 270, col(4), 40, "ESCANEA CON EL MÓVIL", size=T_SRC,
           bold=True, color=G50, tracking=0.14, align="c", lh=1.0)


@tpl("E04")
def e04(s):
    cy = head(s, LT, eb="HERRAMIENTA DEL STACK", w=col(7))
    s.rect(MARGIN, cy, 140, 140, fill=None, line=INK, lw=2)
    s.text(MARGIN, cy, 140, 140, "LOGO", size=T_SRC, bold=True, color=G50,
           tracking=0.14, align="c", anchor="m", lh=1.0)
    s.text(MARGIN + 176, cy + 10, col(5), 60, TT, size=40, bold=True, color=INK,
           tracking=-0.02, lh=1.1)
    s.text(MARGIN + 176, cy + 76, col(5), 60, LP4, size=T_BD2, color=G70, lh=1.4)
    s.table(MARGIN, cy + 210, col(7),
            ["Para qué", "Plan", "Alternativa"],
            [[LSS, "Gratis / 12 €", LSS], [LSS, "Equipo", LSS]],
            row_h=68, body_size=T_BD2)
    rx = colx(8)
    rw = W - MARGIN - rx
    s.rect(rx, cy, rw, 300, fill=L10, lw=0)
    s.rect(rx, cy, 5, 300, fill=ACC, lw=0)
    s.text(rx + 26, cy + 26, rw - 52, 26, "CÓMO LA USAMOS", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(rx + 26, cy + 66, rw - 52, 200, LP2, size=T_BD2, color=G70, lh=1.5)
    s.link(rx, cy + 340, URL, size=T_BD2, w=rw)


@tpl("E05")
def e05(s):
    cy = head(s, LT, eb="EL STACK COMPLETO")
    cols_, rows_ = 5, 2
    gap = 20
    cwid = (CW - gap * (cols_ - 1)) / float(cols_)
    chh = 210
    for i in range(cols_ * rows_):
        x = MARGIN + (i % cols_) * (cwid + gap)
        y = cy + (i // cols_) * (chh + gap)
        s.rect(x, y, cwid, chh, fill=None, line=BD, lw=1)
        s.rect(x + cwid / 2.0 - 34, y + 56, 68, 40, fill=None, line=G50, lw=1)
        s.text(x, y + 56, cwid, 40, "LOGO", size=T_SRC, bold=True, color=G50,
               tracking=0.12, align="c", anchor="m", lh=1.0)
        s.text(x, y + 122, cwid, 30, LSS.title(), size=T_SM, bold=True, color=INK,
               align="c", lh=1.2)
        s.text(x, y + 152, cwid, 30, LX, size=13, color=G60, align="c", lh=1.2)
    source(s, txt="TODOS LOS LOGOS A LA MISMA ALTURA ÓPTICA · MONOCROMOS EN TINTA")


# ══════════════════════════════════════════════════════════════════
#  F · DATOS
# ══════════════════════════════════════════════════════════════════
@tpl("F01")
def f01(s):
    cy = head(s, LT)
    s.table(MARGIN, cy, col(9), ["Lorem", "Ipsum", "Dolor", "Sit amet"],
            [[LSS, LS, LS, LS] for _ in range(5)], row_h=76)
    s.rect(colx(9) + 10, cy, W - MARGIN - colx(9) - 10, 220, fill=L10, lw=0)
    s.text(colx(9) + 36, cy + 26, 220, 26, "LEE ASÍ", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(colx(9) + 36, cy + 64, W - MARGIN - colx(9) - 62, 130, LP3, size=T_SM,
           color=G70, lh=1.45)
    source(s)


@tpl("F02")
def f02(s):
    cy = head(s, LT, eb="TABLA DE DECISIÓN")
    heads = ["Criterio", "Opción A", "Opción B", "Opción C"]
    rows = [[LSS, "SÍ", "NO", "SÍ"], [LSS, "NO", "SÍ", "SÍ"],
            [LSS, "SÍ", "SÍ", "NO"], [LSS, "SÍ", "NO", "NO"]]
    s.table(MARGIN, cy, col(9), heads, rows, row_h=82, body_size=T_BD,
            aligns=["l", "c", "c", "c"])
    s.rect(colx(9) + 10, cy - 6, W - MARGIN - colx(9) - 10, 260, fill=INK, lw=0)
    s.text(colx(9) + 36, cy + 20, 240, 26, "RECOMENDACIÓN", size=T_SRC, bold=True,
           color=ACC, tracking=0.14, lh=1.0)
    s.text(colx(9) + 36, cy + 60, W - MARGIN - colx(9) - 62, 170, LP3, size=T_BD2,
           color=PAPER, lh=1.45)
    source(s)


@tpl("F03")
def f03(s):
    cy = head(s, LT, w=col(7))
    gx, gy = MARGIN, cy + 40
    gw, gh = col(8), 440
    vals = [0.42, 0.61, 0.55, 0.78, 0.94, 0.70]
    n = len(vals)
    bw = gw / float(n) * 0.56
    step = gw / float(n)
    for i in range(5):
        yy = gy + gh - gh * i / 4.0
        s.hr(gx, yy, gw, BD if i else INK, 1 if i else 2)
        s.text(gx - 70, yy - 14, 56, 26, "%d" % (i * 25), size=T_SRC, bold=True,
               color=G50, align="r", lh=1.0)
    for i, v in enumerate(vals):
        x = gx + i * step + (step - bw) / 2.0
        hgt = gh * v
        s.rect(x, gy + gh - hgt, bw, hgt, fill=ACC if v == max(vals) else INK, lw=0)
        s.text(x - 20, gy + gh - hgt - 40, bw + 40, 30, "%d" % round(v * 100),
               size=T_BD2, bold=True, color=INK, align="c", lh=1.0)
        s.text(x - 20, gy + gh + 18, bw + 40, 30, "T%d" % (i + 1), size=T_SM,
               color=G60, align="c", lh=1.0)
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "QUÉ DICE", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    s.text(rx, cy + 42, rw, 220, LP2, size=T_BD2, color=G70, lh=1.5)
    s.hr(rx, cy + 290, rw, INK, 2)
    s.kpi(rx, cy + 312, rw, "+94 %", "LOREM IPSUM DOLOR", size=64, lsize=T_SM)
    source(s)


@tpl("F04")
def f04(s):
    cy = head(s, LT, w=col(7))
    gx, gy = MARGIN, cy + 40
    gw, gh = col(8), 420
    pts = [0.18, 0.30, 0.26, 0.48, 0.62, 0.58, 0.86]
    n = len(pts)
    for i in range(5):
        yy = gy + gh - gh * i / 4.0
        s.hr(gx, yy, gw, BD if i else INK, 1 if i else 2)
    coords = [(gx + gw * i / float(n - 1), gy + gh - gh * v) for i, v in enumerate(pts)]
    for i in range(n - 1):
        s.line(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1], INK, 3)
    for i, (px, py) in enumerate(coords):
        s.rect(px - 7, py - 7, 14, 14, fill=INK, lw=0)
        s.text(px - 60, gy + gh + 18, 120, 30, "M%d" % (i + 1), size=T_SM, color=G60,
               align="c", lh=1.0)
    s.rect(coords[-1][0] - 11, coords[-1][1] - 11, 22, 22, fill=ACC, lw=0)
    s.rect(coords[-1][0] - 150, coords[-1][1] - 74, 160, 50, fill=PAPER, line=INK, lw=1)
    s.text(coords[-1][0] - 150, coords[-1][1] - 74, 160, 50, LX, size=T_SM, bold=True,
           color=INK, align="c", anchor="m", lh=1.0)
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "TENDENCIA", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    s.text(rx, cy + 42, rw, 220, LP2, size=T_BD2, color=G70, lh=1.5)
    source(s)


@tpl("F05")
def f05(s):
    s.eyebrow(MARGIN, 230, EB, ACC)
    s.text(MARGIN, 268, col(7), 240, "94 %", size=T_KPI, bold=True, color=INK,
           tracking=-0.04, lh=0.88)
    s.text(MARGIN, 500, col(6), 90, LT2, size=T_SUB, bold=True, color=G70, lh=1.3)
    s.hr(MARGIN, 636, col(7), INK, 2)
    source(s, y=660)
    s.hr(MARGIN, 764, CW, BD, 1)
    for i, (k, v) in enumerate((("QUÉ MIDE", LP4), ("MUESTRA", LP4),
                                ("POR QUÉ IMPORTA", LP4))):
        x = MARGIN + i * (col(4) + 16)
        s.text(x, 790, col(4) - 16, 26, k, size=T_SRC, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        s.text(x, 824, col(4) - 16, 80, v, size=T_SM, color=G70, lh=1.4)
    rx = colx(8)
    rw = W - MARGIN - rx
    s.vr(rx - 24, 230, 430, BD, 1)
    for i, (v, l) in enumerate((("3,2×", LSS), ("14", LSS), ("56 h", LSS))):
        y = 240 + i * 150
        s.text(rx, y, rw, 60, v, size=52, bold=True, color=INK, tracking=-0.03, lh=1.0)
        s.text(rx, y + 66, rw, 50, l, size=T_SM, color=G60, lh=1.35)


@tpl("F06")
def f06(s):
    cy = head(s, LT, eb="PANEL DE KPIS")
    gap = 24
    cwid = (CW - gap * 3) / 4.0
    for i in range(4):
        x = MARGIN + i * (cwid + gap)
        s.card(x, cy, cwid, 300)
        s.rect(x, cy, cwid, 5, fill=ACC if i == 0 else INK, lw=0)
        s.text(x + 26, cy + 34, cwid - 52, 26, "KPI %02d" % (i + 1), size=T_SRC,
               bold=True, color=G50, tracking=0.14, lh=1.0)
        s.text(x + 26, cy + 76, cwid - 52, 80, ["94 %", "3,2×", "14", "56 h"][i],
               size=64, bold=True, color=INK, tracking=-0.03, lh=1.0)
        s.text(x + 26, cy + 170, cwid - 52, 60, LSS, size=T_SM, color=G60, lh=1.35)
        s.hr(x + 26, cy + 244, cwid - 52, BD, 1)
        s.text(x + 26, cy + 258, cwid - 52, 30, "+12 % vs. mes anterior", size=13,
               bold=True, color=G50, lh=1.2)
    s.hr(MARGIN, cy + 360, CW, BD, 1)
    s.text(MARGIN, cy + 386, col(7), 90, LP2, size=T_BD2, color=G70, lh=1.5)
    source(s, x=colx(8), y=cy + 392, w=col(4), align="r")


@tpl("F07")
def f07(s):
    cy = head(s, LT, eb="DISTRIBUCIÓN")
    parts = [(0.52, INK, "LOREM"), (0.31, G50, "IPSUM"), (0.17, ACC, "DOLOR")]
    x = MARGIN
    for pct, c, lab in parts:
        wid = col(9) * pct
        s.rect(x, cy, wid - 4, 120, fill=c, lw=0)
        s.text(x + 20, cy, wid - 40, 120, "%d %%" % round(pct * 100), size=32,
               bold=True, color=PAPER, anchor="m", lh=1.0)
        x += wid
    x = MARGIN
    for pct, c, lab in parts:
        wid = col(9) * pct
        s.rect(x, cy + 148, 14, 14, fill=c, lw=0)
        s.text(x + 26, cy + 142, wid - 40, 30, lab, size=T_SRC, bold=True, color=G60,
               tracking=0.12, lh=1.0)
        s.text(x + 26, cy + 176, wid - 40, 60, LP4, size=T_SM, color=G60, lh=1.35)
        x += wid
    for i in range(3):
        y = cy + 290 + i * 74
        s.hbar(MARGIN, y, col(9), LB, [0.52, 0.31, 0.17][i], lab_w=col(4))
    source(s)


@tpl("F08")
def f08(s):
    cy = head(s, LT, w=col(6))
    s.ph(MARGIN, cy, col(7), 520, "MAPA · DIAGRAMA DE LÍNEA EN TINTA", "img",
         note="SIN RELIEVE NI SOMBRA")
    rx = colx(7) + 20
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "POR REGIÓN", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    ry = cy + 46
    for i, reg in enumerate(("Europa", "LATAM", "Norteamérica", "Asia-Pacífico")):
        s.hr(rx, ry, rw, INK if i == 0 else BD, 2 if i == 0 else 1)
        s.text(rx, ry + 18, rw - 120, 34, reg, size=T_BD2, bold=True, color=INK, lh=1.2)
        s.text(rx + rw - 120, ry + 18, 120, 34, ["42 %", "27 %", "19 %", "12 %"][i],
               size=T_BD2, bold=True, color=ACC if i == 0 else G70, align="r", lh=1.2)
        ry += 84
    source(s, y=cy + 546)


# ══════════════════════════════════════════════════════════════════
#  G · ESTRUCTURA
# ══════════════════════════════════════════════════════════════════
@tpl("G01")
def g01(s):
    cy = head(s, LT, eb="PROCESO")
    n = 4
    gap = 30
    cwid = (CW - gap * (n - 1)) / float(n)
    for i in range(n):
        x = MARGIN + i * (cwid + gap)
        s.hr(x, cy, cwid, INK, 2)
        s.text(x, cy + 20, cwid, 26, "PASO %02d" % (i + 1), size=20, bold=True,
               color=ACC if i == 0 else G50, tracking=0.14, lh=1.0)
        s.text(x, cy + 56, cwid, 80, TT, size=30, bold=True, color=INK, tracking=-0.01,
               lh=1.15)
        s.text(x, cy + 150, cwid, 200, LP2, size=T_BD2, color=G70, lh=1.5)
        s.text(x, cy + 372, cwid, 30, "SALES CON: " + LX, size=13, bold=True,
               color=G50, tracking=0.08, lh=1.2)
        if i < n - 1:
            s.arrow(x + cwid + 4, cy + 96, x + cwid + gap - 6, cy + 96, INK, 2, 9)
    source(s, y=cy + 430)


@tpl("G02")
def g02(s):
    cy = head(s, LT, eb="CRONOLOGÍA")
    n = 5
    step = CW / float(n)
    ty = cy + 120
    s.hr(MARGIN, ty, CW, INK, 2)
    for i in range(n):
        x = MARGIN + i * step
        s.rect(x, ty - 9, 18, 18, fill=INK if i < 3 else G30, lw=0)
        s.text(x, ty - 96, step - 30, 30, "202%d" % (i + 1), size=20, bold=True,
               color=ACC if i == 2 else G50, tracking=0.12, lh=1.0)
        s.text(x, ty - 60, step - 30, 40, LSS.title(), size=T_BD2, bold=True,
               color=INK, lh=1.2)
        s.text(x, ty + 26, step - 30, 120, LP4, size=T_SM, color=G60, lh=1.4)
    source(s, y=cy + 400)


@tpl("G03")
def g03(s):
    cy = head(s, LT, eb="COMPARATIVA")
    wid = (CW - 40) / 2.0
    for i in range(2):
        x = MARGIN + i * (wid + 40)
        s.card(x, cy, wid, 480, hard=14 if i == 1 else 0)
        s.rect(x, cy, wid, 74, fill=INK if i == 1 else PAPER, lw=0)
        if i == 0:
            s.hr(x, cy + 74, wid, INK, 1)
        s.text(x + 30, cy, wid - 60, 74, ["OPCIÓN A", "OPCIÓN B"][i], size=T_EB,
               bold=True, color=PAPER if i == 1 else INK, tracking=0.16, anchor="m",
               lh=1.0)
        s.text(x + 30, cy + 104, wid - 60, 70, TT, size=32, bold=True, color=INK,
               tracking=-0.02, lh=1.15)
        cyy = cy + 190
        for j in range(4):
            s.hr(x + 30, cyy, wid - 60, BD, 1)
            s.text(x + 30, cyy + 16, wid - 60, 60, LB, size=T_BD2, color=G70, lh=1.35)
            cyy += 70
    source(s, y=cy + 510)


@tpl("G04")
def g04(s):
    cy = head(s, LT, eb="MATRIZ 2 × 2", w=col(6))
    mx, my = MARGIN + 70, cy
    mw, mh = col(7), 470
    s.rect(mx, my, mw, mh, fill=None, line=INK, lw=2)
    s.line(mx + mw / 2.0, my, mx + mw / 2.0, my + mh, INK, 1)
    s.line(mx, my + mh / 2.0, mx + mw, my + mh / 2.0, INK, 1)
    labs = [("Lorem", LP4), ("Ipsum", LP4), ("Dolor", LP4), ("Sit amet", LP4)]
    for i, (t, d) in enumerate(labs):
        x = mx + (i % 2) * mw / 2.0
        y = my + (i // 2) * mh / 2.0
        if i == 1:
            s.rect(x + 1, y + 1, mw / 2.0 - 2, mh / 2.0 - 2, fill=L10, lw=0)
        s.text(x + 26, y + 26, mw / 2.0 - 52, 40, t, size=T_SUB, bold=True, color=INK,
               tracking=-0.01, lh=1.1)
        s.text(x + 26, y + 76, mw / 2.0 - 52, 100, d, size=T_SM, color=G70, lh=1.4)
    s.text(mx, my + mh + 20, mw, 30, "EJE X · LOREM → IPSUM", size=T_SRC, bold=True,
           color=G50, tracking=0.14, align="c", lh=1.0)
    s.text(mx, my - 34, mw, 26, "↑ EJE Y · DOLOR", size=T_SRC, bold=True, color=G50,
           tracking=0.14, lh=1.0)
    s.arrow(mx - 34, my + mh, mx - 34, my + 10, G50, 1, 8)
    s.arrow(mx, my + mh + 54, mx + mw, my + mh + 54, G50, 1, 8)
    rx = colx(8) + 30
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "CÓMO SE LEE", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    s.text(rx, cy + 42, rw, 240, LP2, size=T_BD2, color=G70, lh=1.5)
    s.rect(rx, cy + 300, rw, 150, fill=INK, lw=0)
    s.text(rx + 26, cy + 326, rw - 52, 26, "DÓNDE ESTÁS", size=T_SRC, bold=True,
           color=ACC, tracking=0.14, lh=1.0)
    s.text(rx + 26, cy + 364, rw - 52, 70, LP4, size=T_BD2, color=PAPER, lh=1.4)


@tpl("G05")
def g05(s):
    cy = head(s, LT, eb="JERARQUÍA", w=col(6))
    levels = [("NIVEL 03", 0.42), ("NIVEL 02", 0.68), ("NIVEL 01", 0.96)]
    top = cy + 20
    hgt = 130
    for i, (lab, frac) in enumerate(levels):
        wid = col(7) * frac
        x = MARGIN + (col(7) - wid) / 2.0
        y = top + i * (hgt + 14)
        s.rect(x, y, wid, hgt, fill=INK if i == 0 else (G70 if i == 1 else L10),
               line=None if i < 2 else BD, lw=0 if i < 2 else 1)
        s.text(x + 30, y, wid - 60, hgt, TT, size=30, bold=True,
               color=PAPER if i < 2 else INK, anchor="m", lh=1.15)
        s.text(x + wid + 20, y, 200, hgt, lab, size=T_SRC, bold=True, color=G50,
               tracking=0.14, anchor="m", lh=1.0)
    rx = colx(8) + 30
    rw = W - MARGIN - rx
    for i in range(3):
        y = cy + 20 + i * 150
        s.hr(rx, y, rw, BD, 1)
        s.text(rx, y + 16, rw, 34, "NIVEL %02d" % (3 - i), size=T_SRC, bold=True,
               color=ACC if i == 0 else G50, tracking=0.14, lh=1.0)
        s.text(rx, y + 50, rw, 90, LP4, size=T_BD2, color=G70, lh=1.45)


@tpl("G06")
def g06(s):
    cy = head(s, LT, eb="FLUJO")
    bw, bh = 330, 120
    st = (CW - bw) / 3.0
    row1 = cy + 60
    row2 = row1 + 240
    boxes = [(MARGIN, row1, "INICIO", INK, PAPER),
             (MARGIN + st, row1, LSS.title(), PAPER, INK),
             (MARGIN + 2 * st, row1, "¿" + LX + "?", L10, INK),
             (MARGIN + 2 * st, row2, LSS.title(), PAPER, INK),
             (MARGIN + 3 * st, row1, LSS.title(), PAPER, INK),
             (MARGIN + 3 * st, row2, "FIN", INK, PAPER)]
    for x, y, t, fill, tc in boxes:
        s.rect(x, y, bw, bh, fill=fill, line=None if fill == INK else INK,
               lw=0 if fill == INK else 1)
        s.text(x + 20, y, bw - 40, bh, t, size=T_BD2, bold=True, color=tc, align="c",
               anchor="m", lh=1.2)
    for i in range(3):
        s.arrow(MARGIN + i * st + bw, row1 + bh / 2.0, MARGIN + (i + 1) * st,
                row1 + bh / 2.0, INK, 2, 9)
    s.text(MARGIN + 2 * st + bw + 16, row1 + bh / 2.0 - 42, 120, 26, "SÍ", size=T_SRC,
           bold=True, color=G50, tracking=0.12, lh=1.0)
    s.arrow(MARGIN + 2 * st + bw / 2.0, row1 + bh, MARGIN + 2 * st + bw / 2.0, row2,
            INK, 2, 9)
    s.text(MARGIN + 2 * st + bw / 2.0 + 16, row1 + bh + 46, 120, 26, "NO", size=T_SRC,
           bold=True, color=G50, tracking=0.12, lh=1.0)
    s.line(MARGIN + 2 * st + bw, row2 + bh / 2.0, MARGIN + 3 * st + bw / 2.0,
           row2 + bh / 2.0, INK, 2)
    s.arrow(MARGIN + 3 * st + bw / 2.0 - 1, row2 + bh / 2.0, MARGIN + 3 * st + bw / 2.0,
            row2 + bh / 2.0, INK, 2, 9)
    s.text(MARGIN, row2 + bh + 60, col(7), 60, LP3, size=T_BD2, color=G70, lh=1.45)


@tpl("G07")
def g07(s):
    cy = head(s, LT, eb="CHECKLIST", w=col(7))
    items = [LB] * 6
    wid = (CW - 40) / 2.0
    for i, it in enumerate(items):
        x = MARGIN + (i % 2) * (wid + 40)
        y = cy + (i // 2) * 140
        s.hr(x, y, wid, BD, 1)
        s.checkbox(x, y + 24, 26, on=(i < 2))
        s.text(x + 46, y + 20, wid - 46, 90, it, size=T_BD2,
               color=G70 if i >= 2 else INK, lh=1.4)
    s.note(MARGIN, cy + 440, CW, 110,
           "Marca solo lo que ya está hecho. Lo que quede sin marcar es tu tarea para "
           "esta semana.", size=T_BD2)


@tpl("G08")
def g08(s):
    cy = head(s, LT, eb="ASÍ SÍ / ASÍ NO")
    wid = (CW - 40) / 2.0
    for i in range(2):
        x = MARGIN + i * (wid + 40)
        ok = i == 0
        s.rect(x, cy, wid, 74, fill=INK if ok else L10, lw=0)
        s.text(x + 26, cy, wid - 52, 74, "ASÍ SÍ" if ok else "ASÍ NO", size=T_EB,
               bold=True, color=PAPER if ok else G60, tracking=0.16, anchor="m", lh=1.0)
        cyy = cy + 104
        for j in range(4):
            s.text(x, cyy, 34, 34, "✓" if ok else "×", size=24, bold=True,
                   color=INK if ok else G50, lh=1.0)
            s.text(x + 44, cyy - 2, wid - 44, 80, LB, size=T_BD2,
                   color=G70, lh=1.4)
            cyy += 96
    s.line(MARGIN + wid + 20, cy, MARGIN + wid + 20, cy + 480, BD, 1)


@tpl("G09")
def g09(s):
    cy = head(s, LT, eb="FRAMEWORK")
    letters = ["A", "C", "T", "I", "V"]
    gap = 20
    cwid = (CW - gap * (len(letters) - 1)) / float(len(letters))
    for i, ch in enumerate(letters):
        x = MARGIN + i * (cwid + gap)
        s.rect(x, cy, cwid, 350, fill=INK if i == 0 else PAPER,
               line=None if i == 0 else INK, lw=0 if i == 0 else 1)
        s.text(x, cy + 30, cwid, 110, ch, size=96, bold=True,
               color=PAPER if i == 0 else INK, tracking=-0.04, align="c", lh=1.0)
        s.hr(x + 30, cy + 168, cwid - 60, ACC if i == 0 else BD, 2)
        s.text(x + 24, cy + 192, cwid - 48, 40, LSS.title(), size=T_BD2, bold=True,
               color=PAPER if i == 0 else INK, align="c", lh=1.2)
        s.text(x + 24, cy + 240, cwid - 48, 90, LP4, size=T_SM,
               color=W82 if i == 0 else G60, align="c", lh=1.4)
    s.text(MARGIN, cy + 400, col(8), 60, LP3, size=T_BD2, color=G70, lh=1.45)


# ══════════════════════════════════════════════════════════════════
#  H · PERSONAS
# ══════════════════════════════════════════════════════════════════
@tpl("H01")
def h01(s):
    s.text(colx(2), 300, col(8), 320, "«%s»" % LT2, size=T_H, bold=True, color=INK,
           tracking=-0.02, align="c", lh=1.25)
    s.hr(W / 2.0 - 60, 700, 120, ACC, 3)
    s.text(colx(2), 734, col(8), 30, EB, size=T_EB, bold=True, color=G60,
           tracking=0.16, align="c", lh=1.0)
    s.text(colx(2), 774, col(8), 30, LSS, size=T_SM, color=G50, align="c", lh=1.2)


@tpl("H02")
def h02(s):
    s.ph(MARGIN, 190, col(4), 620, "FOTO · RETRATO", "foto")
    s.text(colx(5), 260, col(7), 300, "«%s»" % LP2, size=T_SUB, bold=True, color=INK,
           lh=1.4)
    s.hr(colx(5), 620, 120, ACC, 3)
    s.text(colx(5), 652, col(6), 34, TT, size=T_BD2, bold=True, color=INK, lh=1.2)
    s.text(colx(5), 690, col(6), 34, LSS, size=T_SM, color=G60, lh=1.2)
    s.text(colx(5), 750, col(6), 30, "COHORTE 2026-01 · REMOTE PROFESSIONAL",
           size=T_SRC, bold=True, color=G50, tracking=0.12, lh=1.0)


@tpl("H03")
def h03(s):
    s.ph(MARGIN, 190, col(3), 380, "FOTO", "foto")
    s.eyebrow(colx(4), 200, "TU DOCENTE", ACC)
    s.text(colx(4), 244, col(8), 90, TT, size=T_H, bold=True, color=INK,
           tracking=-0.03, lh=1.05)
    s.text(colx(4), 340, col(7), 40, LS, size=T_SUB, bold=True, color=G70, lh=1.2)
    s.hr(colx(4), 410, col(8), INK, 2)
    s.dashlist(colx(4), 436, col(6), [LB] * 3, size=T_BD2, gap=54)
    s.text(colx(4), 620, col(8), 30, "LOREM-IPSUM.COM · @LOREMIPSUM", size=T_SRC,
           bold=True, color=ACC, tracking=0.12, lh=1.0)
    s.card(colx(9), 190, col(3), 380)
    s.text(colx(9) + 26, 220, col(3) - 52, 26, "EN UNA LÍNEA", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(colx(9) + 26, 260, col(3) - 52, 280, LP2, size=T_BD2, color=G70, lh=1.5)


@tpl("H04")
def h04(s):
    cy = head(s, LT, eb="CASO REAL", w=col(8))
    cols_ = [("CONTEXTO", LP2), ("QUÉ HIZO", LP2), ("RESULTADO", LP2)]
    gap = 32
    wid = (col(8) - gap * 2) / 3.0
    for i, (t, d) in enumerate(cols_):
        x = MARGIN + i * (wid + gap)
        s.hr(x, cy, wid, INK, 2)
        s.text(x, cy + 20, wid, 26, t, size=T_SRC, bold=True,
               color=ACC if i == 2 else G50, tracking=0.14, lh=1.0)
        s.text(x, cy + 60, wid, 260, d, size=T_BD2, color=G70, lh=1.5)
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.rect(rx, cy - 6, rw, 330, fill=INK, lw=0)
    s.text(rx + 26, cy + 20, rw - 52, 26, "EL DATO", size=T_SRC, bold=True, color=ACC,
           tracking=0.16, lh=1.0)
    s.text(rx + 26, cy + 60, rw - 52, 120, "3,2×", size=90, bold=True, color=PAPER,
           tracking=-0.04, lh=1.0)
    s.text(rx + 26, cy + 190, rw - 52, 100, LP4, size=T_SM, color=W82, lh=1.4)
    source(s, y=cy + 360)


@tpl("H05")
def h05(s):
    cy = head(s, LT, eb="DÓNDE TRABAJAN")
    cols_, rows_ = 4, 2
    gap = 24
    cwid = (CW - gap * (cols_ - 1)) / float(cols_)
    chh = 190
    for i in range(cols_ * rows_):
        x = MARGIN + (i % cols_) * (cwid + gap)
        y = cy + (i // cols_) * (chh + gap)
        s.rect(x, y, cwid, chh, fill=None, line=BD, lw=1)
        s.rect(x + cwid / 2.0 - 60, y + chh / 2.0 - 22, 120, 44, fill=None, line=G50,
               lw=1)
        s.text(x, y, cwid, chh, "LOGO", size=T_SRC, bold=True, color=G50,
               tracking=0.14, align="c", anchor="m", lh=1.0)
    source(s, txt="MISMA ALTURA ÓPTICA · MONOCROMO · SEPARACIÓN ≥ ALTO DEL LOGO")


# ══════════════════════════════════════════════════════════════════
#  I · ACTIVIDAD Y CIERRE
# ══════════════════════════════════════════════════════════════════
@tpl("I01")
def i01(s):
    s.tagsolid(MARGIN, 150, "EJERCICIO · 25 MIN")
    s.h(MARGIN, 216, col(8), LT, size=T_H, lines=1)
    ticks(s, MARGIN, 330, CW, n=12)
    cy = 374
    n = 3
    gap = 30
    wid = (col(8) - gap * (n - 1)) / float(n)
    for i in range(n):
        x = MARGIN + i * (wid + gap)
        s.hr(x, cy, wid, INK, 2)
        s.text(x, cy + 20, wid, 26, "PASO %02d" % (i + 1), size=T_SRC, bold=True,
               color=ACC if i == 0 else G50, tracking=0.14, lh=1.0)
        s.text(x, cy + 56, wid, 200, LP2, size=T_BD2, color=G70, lh=1.5)
    s.card(colx(8) + 24, cy - 10, W - MARGIN - colx(8) - 24, 330, hard=14)
    rx = colx(8) + 50
    rw = W - MARGIN - colx(8) - 76
    s.text(rx, cy + 24, rw, 26, "ENTREGABLE", size=T_SRC, bold=True, color=ACC,
           tracking=0.16, lh=1.0)
    s.text(rx, cy + 64, rw, 120, LP3, size=T_SUB, bold=True, color=INK, lh=1.3)
    s.hr(rx, cy + 220, rw, BD, 1)
    s.text(rx, cy + 238, rw, 60, "Entrega en Classroom · antes del viernes",
           size=T_SM, color=G60, lh=1.4)


@tpl("I02")
def i02(s):
    s.tagsolid(MARGIN, 150, "EN GRUPO · 30 MIN")
    s.h(MARGIN, 216, col(8), LT, size=T_H, lines=1)
    ticks(s, MARGIN, 330, CW, n=12)
    cy = 374
    roles = [("MODERA", LP4), ("ESCRIBE", LP4), ("PRESENTA", LP4)]
    gap = 30
    wid = (col(7) - gap * 2) / 3.0
    for i, (r, d) in enumerate(roles):
        x = MARGIN + i * (wid + gap)
        s.card(x, cy, wid, 240)
        s.rect(x, cy, wid, 5, fill=INK, lw=0)
        s.text(x + 24, cy + 30, wid - 48, 30, r, size=T_SRC, bold=True, color=ACC,
               tracking=0.16, lh=1.0)
        s.text(x + 24, cy + 74, wid - 48, 140, d, size=T_BD2, color=G70, lh=1.45)
    rx = colx(7) + 24
    rw = W - MARGIN - rx
    s.text(rx, cy, rw, 26, "CÓMO SE HACE", size=T_SRC, bold=True, color=G50,
           tracking=0.16, lh=1.0)
    ry = cy + 44
    for i, t in enumerate(("3 personas por grupo", "20 min de trabajo",
                           "2 min de puesta en común", "Un entregable por grupo")):
        s.hr(rx, ry, rw, BD, 1)
        s.text(rx, ry + 14, 40, 30, "%02d" % (i + 1), size=T_SM, bold=True, color=INK,
               lh=1.0)
        s.text(rx + 52, ry + 12, rw - 52, 40, t, size=T_BD2, color=G70, lh=1.3)
        ry += 74
    s.note(MARGIN, cy + 290, col(7), 120, LP3, size=T_BD2)


@tpl("I03")
def i03(s):
    s.tagsolid(MARGIN, 150, "QUIZ · PREGUNTA 01 DE 05")
    s.text(MARGIN, 224, col(9), 140, "¿%s?" % LT, size=T_H, bold=True, color=INK,
           tracking=-0.03, lh=1.1)
    cy = 420
    wid = (CW - 30) / 2.0
    for i, letter in enumerate("ABCD"):
        x = MARGIN + (i % 2) * (wid + 30)
        y = cy + (i // 2) * 130
        s.rect(x, y, wid, 110, fill=None, line=INK, lw=1)
        s.rect(x, y, 60, 110, fill=INK, lw=0)
        s.text(x, y, 60, 110, letter, size=32, bold=True, color=PAPER, align="c",
               anchor="m", lh=1.0)
        s.text(x + 84, y, wid - 110, 110, LB, size=T_BD2, color=G70, anchor="m",
               lh=1.35)
    s.text(MARGIN, cy + 290, col(6), 40, "Responde en el chat con la letra.",
           size=T_BD2, color=G60, lh=1.3)


@tpl("I04")
def i04(s):
    cy = head(s, LT, eb="PLANTILLA A RELLENAR", w=col(7))
    fields = [("CAMPO 01", 1), ("CAMPO 02", 1), ("CAMPO 03", 2), ("CAMPO 04", 1)]
    y = cy
    for lab, lines in fields:
        s.text(MARGIN, y, 300, 26, lab, size=T_SRC, bold=True, color=G50,
               tracking=0.14, lh=1.0)
        hgt = 60 * lines
        s.rect(MARGIN, y + 32, col(7), hgt, fill=L10, lw=0)
        s.hr(MARGIN, y + 32 + hgt, col(7), INK, 2)
        y += hgt + 76
    rx = colx(8) + 24
    rw = W - MARGIN - rx
    s.card(rx, cy, rw, 300, hard=14)
    s.text(rx + 30, cy + 28, rw - 60, 26, "EJEMPLO RELLENO", size=T_SRC, bold=True,
           color=ACC, tracking=0.14, lh=1.0)
    s.text(rx + 30, cy + 70, rw - 60, 200, LP2, size=T_BD2, color=G70, lh=1.5)
    s.text(rx, cy + 340, rw, 60, "Descarga la plantilla en Classroom.", size=T_SM,
           color=G60, lh=1.4)


@tpl("I05")
def i05(s):
    cy = head(s, LT, eb="ERRORES COMUNES")
    gap = 30
    wid = (CW - gap * 2) / 3.0
    for i in range(3):
        x = MARGIN + i * (wid + gap)
        s.rect(x, cy, wid, 90, fill=L10, lw=0)
        s.text(x + 22, cy, 40, 90, "×", size=30, bold=True, color=G50, anchor="m",
               lh=1.0)
        s.text(x + 62, cy, wid - 84, 90, "ERROR %02d" % (i + 1), size=T_SRC, bold=True,
               color=G60, tracking=0.14, anchor="m", lh=1.0)
        s.text(x, cy + 116, wid, 90, LP4, size=T_BD2, bold=True, color=INK, lh=1.35)
        s.hr(x, cy + 240, wid, INK, 2)
        s.text(x, cy + 260, wid, 26, "EN SU LUGAR", size=T_SRC, bold=True, color=ACC,
               tracking=0.14, lh=1.0)
        s.text(x, cy + 296, wid, 140, LP2, size=T_BD2, color=G70, lh=1.45)


@tpl("I06")
def i06(s):
    cy = head(s, LT, eb="RESUMEN DEL BLOQUE")
    gap = 30
    wid = (CW - gap * 2) / 3.0
    for i in range(3):
        x = MARGIN + i * (wid + gap)
        s.text(x, cy, wid, 110, "%02d" % (i + 1), size=90, bold=True,
               color=ACC if i == 0 else BDS, tracking=-0.04, lh=1.0)
        s.hr(x, cy + 130, wid, INK, 2)
        s.text(x, cy + 154, wid, 100, TT, size=32, bold=True, color=INK, tracking=-0.02,
               lh=1.2)
        s.text(x, cy + 264, wid, 160, LP2, size=T_BD2, color=G70, lh=1.5)
    s.note(MARGIN, cy + 460, CW, 110, "Si te llevas una sola cosa de este bloque, "
           "que sea esta: " + LP4, size=T_BD2)


@tpl("I07")
def i07(s):
    cy = head(s, LT, eb="TAREA", w=col(7))
    s.card(MARGIN, cy, col(7), 380, hard=14)
    s.text(MARGIN + 40, cy + 36, col(6), 26, "QUÉ ENTREGAS", size=T_SRC, bold=True,
           color=G50, tracking=0.14, lh=1.0)
    s.text(MARGIN + 40, cy + 76, col(6), 120, LP2, size=T_SUB, bold=True, color=INK,
           lh=1.3)
    s.hr(MARGIN + 40, cy + 240, col(6) - 20, BD, 1)
    s.text(MARGIN + 40, cy + 262, col(6), 90, LP3, size=T_BD2, color=G70, lh=1.45)
    rx = colx(7) + 30
    rw = W - MARGIN - rx
    s.text(rx, cy + 10, rw, 26, "FECHA LÍMITE", size=T_SRC, bold=True, color=ACC,
           tracking=0.16, lh=1.0)
    s.text(rx, cy + 50, rw, 110, "VIE 12", size=84, bold=True, color=INK,
           tracking=-0.04, lh=1.0)
    s.text(rx, cy + 170, rw, 40, "23:59 CET", size=T_BD2, color=G60, lh=1.2)
    s.hr(rx, cy + 230, rw, INK, 2)
    s.text(rx, cy + 250, rw, 26, "DÓNDE", size=T_SRC, bold=True, color=G50,
           tracking=0.14, lh=1.0)
    s.text(rx, cy + 286, rw, 90, "Google Classroom\nMódulo 00 · Tarea 01", size=T_BD2,
           bold=True, color=INK, lh=1.35)


@tpl("I08")
def i08(s):
    s.pic(ASSETS["dots_dark"])
    s.eyebrow(MARGIN, 300, "SIGUIENTE PASO", ACC)
    s.h(MARGIN, 344, col(8), LT, size=T_SECT, lh=1.02, lines=2)
    s.hr(MARGIN, 570, 180, PAPER, 3)
    s.text(MARGIN, 606, col(6), 100, LP3, size=T_BD, color=W82, lh=1.5)
    cy = 740
    for i, (k, v) in enumerate((("QUÉ", LSS), ("CUÁNDO", "Viernes 12 · 23:59"),
                                ("DÓNDE", "Google Classroom"))):
        x = MARGIN + i * (col(4) + 20)
        s.hr(x, cy, col(3), W12, 1)
        s.text(x, cy + 18, col(3), 26, k, size=T_SRC, bold=True, color=W55,
               tracking=0.14, lh=1.0)
        s.text(x, cy + 52, col(3), 60, v, size=T_BD2, bold=True, color=PAPER, lh=1.3)
    s.rect(W - MARGIN - 190, 300, 190, 190, fill=PAPER, lw=0)
    s.qr(W - MARGIN - 180, 310, 170)


# ══════════════════════════════════════════════════════════════════
def build_templates():
    """Devuelve [(código, Slide)] en el orden del catálogo."""
    out = []
    for l in CAT.L:
        code = l["code"]
        fn = BUILDERS.get(code)
        if fn is None:
            continue
        s = _slide(code, dark=l.get("dark", False))
        fn(s)
        s.notes = notes_for(code)
        out.append((code, s.build()))
    return out
