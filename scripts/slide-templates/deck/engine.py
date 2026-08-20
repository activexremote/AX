# -*- coding: utf-8 -*-
"""
Motor de composición de diapositivas ActiveXRemote.

Una sola descripción de escena (lista de primitivas en píxeles sobre un lienzo
1920 × 1080) se emite dos veces:

  · a PPTX  — formas nativas de PowerPoint, editables por el profesorado
  · a PNG   — previsualización con PIL, para revisar el diseño sin abrir Office

Unidades: todo en píxeles de diapositiva (1920 × 1080).
  1 px = 6350 EMU   ·   1 px = 0,5 pt   (lienzo = 13,333 × 7,5 in = 960 × 540 pt)
"""
import os

from pptx import Presentation
from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn

# ══════════════════════════ TOKENS DE MARCA ══════════════════════════
W, H = 1920, 1080
EMU_PX = 6350                      # 12192000 / 1920
PT_PX = 0.5                        # 960 pt / 1920 px

INK   = "161616"
G90   = "262626"
G70   = "525252"
G60   = "6F6F6F"
G50   = "8D8D8D"
G30   = "A8A8A8"
BDS   = "C6C6C6"
BD    = "E0E0E0"
L10   = "F4F4F4"
PAPER = "FFFFFF"
ACC   = "5B4BF5"                   # Remote Professional
ACC2  = "4632E6"
RED   = "E4462F"                   # Remote Founder
RED2  = "C3341F"

# Sobre tinta no hay alfa en PPTX sin trucos: se usan grises equivalentes.
W82 = "D2D2D2"                     # blanco 82 % sobre #161616
W62 = "9A9A9A"                     # blanco 62 %
W55 = "8C8C8C"                     # blanco 55 %
W30 = "5A5A5A"                     # blanco 30 %
W12 = "2C2C2C"                     # blanco 12 % (retícula, filetes en oscuro)
W08 = "252525"                     # superficie elevada sobre tinta

# Retícula
MARGIN   = 96
TOP      = 72
BOTTOM   = 100
CW       = W - 2 * MARGIN          # 1728 ancho útil
GUT      = 32
COL      = (W - 2 * MARGIN - 11 * GUT) / 12.0     # 114,67 px · 12 col. sobre 1728
CONTENT_B = H - BOTTOM             # 980 · borde inferior de la zona segura

def est_lines(txt, size, w, bold=True):
    """Cuántas líneas ocupará un texto. Usa las métricas reales de Inter."""
    try:
        from PIL import Image, ImageDraw
        from .preview import _font
        d = ImageDraw.Draw(Image.new("RGB", (4, 4)))
        f = _font(size, 700 if bold else 400)
        n, cur = 1, ""
        for word in txt.split(" "):
            cand = word if not cur else cur + " " + word
            if d.textlength(cand, font=f) <= w or not cur:
                cur = cand
            else:
                n += 1
                cur = word
        return n
    except Exception:
        return max(1, int(len(txt) * size * 0.5 / float(w)) + 1)


def col(n):
    """Ancho de n columnas con sus medianiles."""
    return n * COL + (n - 1) * GUT

def colx(n):
    """X del inicio de la columna n (0-indexada)."""
    return MARGIN + n * (COL + GUT)

# Escala tipográfica de proyección (px de lienzo)
T_COVER, T_SECT, T_H, T_HSM = 128, 96, 64, 48
T_SUB, T_BD, T_BD2, T_SM, T_SRC = 36, 28, 24, 18, 14
T_EB, T_KPI = 18, 200

FONT   = "Inter"
FMONO  = "IBM Plex Mono"

# ══════════════════════════ ESCENA ══════════════════════════
class Slide(object):
    def __init__(self, bg=PAPER, dark=False, code=None, notes="",
                 foot=True, foot_right="MÓDULO 00 · 00", title=""):
        self.bg = G90 if bg is None else bg
        self.dark = dark
        self.code = code
        self.notes = notes
        self.items = []
        self.title = title
        self._foot = foot
        self._foot_right = foot_right

    # ── primitivas ───────────────────────────────────────────
    def rect(self, x, y, w, h, fill=None, line=None, lw=1, dash=None, shadow=0,
             shadow_color=INK, name=None):
        if shadow:
            self.items.append(dict(t="rect", x=x + shadow, y=y + shadow, w=w, h=h,
                                   fill=shadow_color, line=None, lw=0, dash=None,
                                   name="sombra"))
        self.items.append(dict(t="rect", x=x, y=y, w=w, h=h, fill=fill, line=line,
                               lw=lw, dash=dash, name=name))
        return self

    def line(self, x1, y1, x2, y2, color=BD, lw=1, dash=None):
        self.items.append(dict(t="line", x1=x1, y1=y1, x2=x2, y2=y2,
                               color=color, lw=lw, dash=dash))
        return self

    def hr(self, x, y, w, color=BD, lw=1):
        return self.line(x, y, x + w, y, color, lw)

    def vr(self, x, y, h, color=BD, lw=1):
        return self.line(x, y, x, y + h, color, lw)

    def poly(self, pts, fill=None, line=None, lw=2, close=True):
        self.items.append(dict(t="poly", pts=pts, fill=fill, line=line, lw=lw,
                               close=close))
        return self

    def ellipse(self, x, y, w, h, fill=None, line=None, lw=1):
        self.items.append(dict(t="ellipse", x=x, y=y, w=w, h=h, fill=fill,
                               line=line, lw=lw))
        return self

    def veil(self, x=0, y=0, w=W, h=H, color=INK, a0=0.0, a1=0.85, vertical=True):
        """Velo con degradado de alfa (PNG). Para texto blanco sobre fotografía."""
        self.items.append(dict(t="pic", path=veil_png(color, a0, a1, vertical),
                               x=x, y=y, w=w, h=h))
        return self

    def pic(self, path, x=0, y=0, w=W, h=H):
        self.items.append(dict(t="pic", path=path, x=x, y=y, w=w, h=h))
        return self

    def text(self, x, y, w, h, txt=None, size=T_BD, bold=False, color=G70,
             tracking=0.0, lh=1.45, align="l", anchor="t", caps=False,
             mono=False, runs=None, space=0, wrap=True):
        """`txt` string simple, o `runs` = [(texto, dict de overrides), ...]."""
        if runs is None:
            runs = [(txt if txt is not None else "", {})]
        paras = [dict(runs=[dict(txt=t, **o) for t, o in runs], align=align,
                      lh=lh, space=space)]
        self.items.append(dict(t="text", x=x, y=y, w=w, h=h, paras=paras,
                               size=size, bold=bold, color=color,
                               tracking=tracking, caps=caps, mono=mono,
                               anchor=anchor, wrap=wrap))
        return self

    def paras(self, x, y, w, h, paras, size=T_BD, bold=False, color=G70,
              tracking=0.0, caps=False, mono=False, anchor="t", align="l",
              lh=1.45, space=0):
        """paras: lista de strings o de dicts {txt, size, bold, color, lh, space, align}."""
        out = []
        for p in paras:
            if isinstance(p, str):
                p = dict(txt=p)
            out.append(dict(runs=[dict(txt=p.get("txt", ""),
                                       **{k: v for k, v in p.items()
                                          if k in ("size", "bold", "color",
                                                   "tracking", "mono", "caps")})],
                            align=p.get("align", align),
                            lh=p.get("lh", lh),
                            space=p.get("space", space)))
        self.items.append(dict(t="text", x=x, y=y, w=w, h=h, paras=out, size=size,
                               bold=bold, color=color, tracking=tracking,
                               caps=caps, mono=mono, anchor=anchor, wrap=True))
        return self

    def table(self, x, y, w, heads, rows, col_w=None, head_size=T_SM,
              body_size=T_BD2, row_h=64, head_h=46, first_bold=True,
              aligns=None, color=G70):
        self.items.append(dict(t="table", x=x, y=y, w=w, heads=heads, rows=rows,
                               col_w=col_w, head_size=head_size,
                               body_size=body_size, row_h=row_h, head_h=head_h,
                               first_bold=first_bold, aligns=aligns, color=color))
        return self

    def chart(self, kind, x, y, w, h, cats, series, accent=INK, second=G30,
              maxv=None, fmt="0"):
        self.items.append(dict(t="chart", kind=kind, x=x, y=y, w=w, h=h,
                               cats=cats, series=series, accent=accent,
                               second=second, maxv=maxv, fmt=fmt))
        return self

    # ── componentes de marca ─────────────────────────────────
    def logo(self, x, y, h=28, color=INK):
        """Símbolo ΔX. Caja 46 × 28 unidades, trazo 2, esquinas en inglete."""
        k = h / 28.0
        lw = 2 * k
        def P(pts):
            return [(x + a * k, y + b * k) for a, b in pts]
        self.poly(P([(11, 2), (20, 26), (2, 26)]), None, color, lw)
        self.poly(P([(26, 2), (44, 2), (35, 14)]), None, color, lw)
        self.poly(P([(26, 26), (44, 26), (35, 14)]), None, color, lw)
        return self

    def lockup(self, x, y, h=28, color=INK, gap=12, size=15):
        self.logo(x, y, h, color)
        self.text(x + h * 46 / 28.0 + gap, y + h / 2.0 - 14, 420, 28,
                  "ACTIVEXREMOTE", size=size, bold=True, color=color,
                  tracking=0.14, anchor="m", lh=1.0)
        return self

    def footer(self, right=None, dark=None):
        dark = self.dark if dark is None else dark
        right = right or self._foot_right
        c = PAPER if dark else INK
        self.hr(MARGIN, H - 114, CW, W12 if dark else BD, 1)
        self.lockup(MARGIN, H - 58, 28, c)
        self.text(W - MARGIN - 620, H - 58, 620, 28, right, size=T_SRC, bold=True,
                  color=(W55 if dark else G50), tracking=0.10, align="r",
                  anchor="m", lh=1.0)
        return self

    def mark(self, code=None):
        code = code or self.code
        if not code:
            return self
        self.text(W - MARGIN - 300, 26, 300, 24, code, size=T_SRC, bold=True,
                  color=(W30 if self.dark else BDS), tracking=0.18, align="r",
                  lh=1.0)
        return self

    def eyebrow(self, x, y, txt, color=None, dot=True, size=T_EB, w=1000):
        color = color or (W62 if self.dark else G60)
        if dot:
            self.rect(x, y + size * 0.20, 12, 12, fill=color, lw=0)
            x += 22
        self.text(x, y, w, size * 1.4, txt, size=size, bold=True, color=color,
                  tracking=0.16, lh=1.0)
        return self

    def h(self, x, y, w, txt, size=T_H, color=None, lh=1.06, bold=True,
          tracking=-0.03, lines=2):
        color = color or (PAPER if self.dark else INK)
        self.text(x, y, w, size * lh * lines + 8, txt, size=size, bold=bold,
                  color=color, tracking=tracking, lh=lh)
        return self

    def body(self, x, y, w, txt, size=T_BD, color=None, lh=1.5, lines=4,
             bold=False):
        color = color or (W82 if self.dark else G70)
        self.text(x, y, w, size * lh * lines + 6, txt, size=size, color=color,
                  lh=lh, bold=bold)
        return self

    def header(self, eyebrow, title, sub=None, y=128, size=T_HSM, rule=True,
               acc=None, right=None, w=None):
        """Cabecera estándar: etiqueta · título · filete. Devuelve la Y libre."""
        self.eyebrow(MARGIN, y, eyebrow, acc)
        ty = y + 40
        w = w or (CW if not sub else col(8))
        self.h(MARGIN, ty, w, title, size=size, lh=1.08, lines=1)
        by = ty + size * 1.22
        if sub:
            self.text(MARGIN, by + 6, col(9), 30, sub, size=T_BD2,
                      color=(W82 if self.dark else G60), lh=1.35)
            by += 40
        if right:
            self.text(W - MARGIN - 700, y, 700, 26, right, size=T_SRC, bold=True,
                      color=(W30 if self.dark else G50), tracking=0.14, align="r",
                      lh=1.0)
        by += 26
        if rule:
            self.hr(MARGIN, by, CW, W12 if self.dark else INK, 2)
        return by + 40

    def chip(self, x, y, txt, size=15, color=None, line=None, padx=12, pady=8,
             fill=None, bold=True, tracking=0.12):
        color = color or (W82 if self.dark else INK)
        line = line if line is not None else (W12 if self.dark else BDS)
        w = len(txt) * size * 0.72 + padx * 2
        hgt = size + pady * 2
        self.rect(x, y, w, hgt, fill=fill, line=line, lw=1)
        self.text(x + padx, y, w - padx * 2, hgt, txt, size=size, bold=bold,
                  color=color, tracking=tracking, anchor="m", lh=1.0)
        return x + w

    def arrow(self, x1, y1, x2, y2, color=None, lw=2, head=10):
        """Conector recto con punta. Solo horizontal o vertical (ángulos de 90°)."""
        color = color or (W30 if self.dark else INK)
        self.line(x1, y1, x2, y2, color, lw)
        if y1 == y2:
            d = 1 if x2 > x1 else -1
            self.poly([(x2, y2), (x2 - head * d, y2 - head * 0.62),
                       (x2 - head * d, y2 + head * 0.62)], fill=color, lw=0)
        else:
            d = 1 if y2 > y1 else -1
            self.poly([(x2, y2), (x2 - head * 0.62, y2 - head * d),
                       (x2 + head * 0.62, y2 - head * d)], fill=color, lw=0)
        return self

    def checkbox(self, x, y, s=22, on=False, color=None):
        color = color or (PAPER if self.dark else INK)
        self.rect(x, y, s, s, fill=None, line=color, lw=2)
        if on:
            self.line(x + s * 0.20, y + s * 0.52, x + s * 0.42, y + s * 0.74, color, 3)
            self.line(x + s * 0.42, y + s * 0.74, x + s * 0.82, y + s * 0.24, color, 3)
        return self

    def card(self, x, y, w, h, hard=0, fill=PAPER, line=INK, lw=1):
        # la sombra dura nunca se sale de la zona segura
        if hard:
            w = min(w, W - MARGIN - x - hard)
            h = min(h, CONTENT_B - y - hard)
        return self.rect(x, y, w, h, fill=fill, line=line, lw=lw, shadow=hard)

    def tagsolid(self, x, y, txt, size=16, fill=INK, color=PAPER, padx=16, pady=9,
                 right=None):
        w = len(txt) * size * 0.78 + padx * 2
        if right is not None:
            x = right - w
        hgt = size + pady * 2
        self.rect(x, y, w, hgt, fill=fill, lw=0)
        self.text(x + padx, y, w - padx * 2, hgt, txt, size=size, bold=True,
                  color=color, tracking=0.16, anchor="m", lh=1.0)
        return x + w

    def ph(self, x, y, w, h, label="IMAGEN / CAPTURA", kind="img", note=None):
        """Hueco de medio. kind: img · foto · video · embed · mapa · code."""
        if kind == "video":
            self.rect(x, y, w, h, fill=G90, lw=0)
            self.play(x + w / 2.0 - 43, y + h / 2.0 - 55, 86, PAPER)
            self.text(x, y + h / 2.0 + 48, w, 30, label, size=16, color=W62,
                      tracking=0.14, align="c", lh=1.0)
        else:
            dark_ph = kind == "fotodark"
            fill = "3C3C3C" if dark_ph else (L10 if kind != "foto" else "EDEDED")
            self.rect(x, y, w, h, fill=fill,
                      line=(None if dark_ph else (BDS if kind == "foto" else BD)),
                      lw=0 if dark_ph else 1)
            if kind in ("foto", "fotodark"):
                # trama diagonal técnica
                step = 56
                n = int((w + h) / step) + 1
                for i in range(n):
                    x1, y1 = x + i * step, y
                    x2, y2 = x, y + i * step
                    if x1 > x + w:
                        y1 += x1 - (x + w); x1 = x + w
                    if y2 > y + h:
                        x2 += y2 - (y + h); y2 = y + h
                    if x1 - x2 > 0 and y2 - y1 > 0:
                        self.line(x1, y1, x2, y2, "4C4C4C" if dark_ph else "E4E4E4", 1)
            self.text(x, y + h / 2.0 - 20, w, 40, label, size=16,
                      color=W55 if dark_ph else G50,
                      tracking=0.14, align="c", anchor="m", lh=1.0)
            if note:
                self.text(x, y + h / 2.0 + 12, w, 30, note, size=13,
                          color=W30 if dark_ph else G30,
                          tracking=0.10, align="c", lh=1.0)
        return self

    def play(self, x, y, s=86, color=PAPER):
        self.rect(x, y, s, s, fill=None, line=color, lw=3)
        k = s / 86.0
        cx, cy = x + s / 2.0 + 4 * k, y + s / 2.0
        self.poly([(cx - 13 * k, cy - 16 * k), (cx + 13 * k, cy),
                   (cx - 13 * k, cy + 16 * k)], fill=color, lw=0)
        return self

    QR = ["111111101011111", "100000100001000", "101110100101110", "101110101101110",
          "101110100001110", "100000101001000", "111111101011111", "000000010100000",
          "110101101110110", "001000100001001", "111011011010111", "000100010100010",
          "111111100110101", "100000101011001", "101110110011110"]

    def qr(self, x, y, size=150, pad=10):
        self.rect(x, y, size, size, fill=PAPER, line=BD, lw=1)
        c = (size - pad * 2) / 15.0
        for r, row in enumerate(self.QR):
            for k, v in enumerate(row):
                if v == "1":
                    self.rect(x + pad + k * c, y + pad + r * c, c + .5, c + .5,
                              fill=INK, lw=0)
        return self

    def link(self, x, y, url, size=22, color=ACC, w=760):
        self.text(x, y, 30, size * 1.4, "→", size=size, bold=True, color=color, lh=1.0)
        self.text(x + 32, y, w, size * 1.4, url, size=size, bold=True, color=color, lh=1.0)
        self.hr(x, y + size * 1.4 + 6, min(w, len(url) * size * 0.55 + 32), color, 2)
        return self

    def bullets(self, x, y, w, items, size=T_BD, gap=None, num=True,
                first_rule=2, color=None, rule=BD, lh=1.35, numcolor=None):
        """Lista con filete superior por ítem. Devuelve la Y final."""
        color = color or (W82 if self.dark else G70)
        numcolor = numcolor or (PAPER if self.dark else INK)
        gap = gap if gap is not None else size * 1.9
        cy = y
        for i, it in enumerate(items):
            self.hr(x, cy, w, INK if i == 0 else rule, first_rule if i == 0 else 1)
            if num:
                self.text(x, cy + 16, 60, size * 1.5, "%02d" % (i + 1), size=size,
                          bold=True, color=numcolor, lh=lh)
                self.text(x + 66, cy + 16, w - 66, size * lh * 2 + 4, it, size=size,
                          color=color, lh=lh)
            else:
                self.text(x, cy + 16, w, size * lh * 2 + 4, it, size=size,
                          color=color, lh=lh)
            cy += gap
        return cy

    def dashlist(self, x, y, w, items, size=T_BD2, gap=None, color=None, lh=1.4):
        color = color or (W82 if self.dark else G70)
        gap = gap if gap is not None else size * 1.6
        cy = y
        for it in items:
            self.text(x, cy, 30, size * 1.5, "—", size=size, bold=True,
                      color=(PAPER if self.dark else INK), lh=lh)
            self.text(x + 36, cy, w - 36, size * lh * 2, it, size=size,
                      color=color, lh=lh)
            cy += gap
        return cy

    def note(self, x, y, w, h, txt, size=T_BD2, accent=ACC, fill=None, lh=1.45):
        fill = fill or (W08 if self.dark else L10)
        self.rect(x, y, w, h, fill=fill, lw=0)
        self.rect(x, y, 5, h, fill=accent, lw=0)
        self.text(x + 28, y + 22, w - 56, h - 44, txt, size=size,
                  color=(W82 if self.dark else G70), lh=lh)
        return self

    def kpi(self, x, y, w, value, label, size=T_KPI, color=None, lcolor=None,
            align="l", lsize=22):
        color = color or (PAPER if self.dark else INK)
        lcolor = lcolor or (W62 if self.dark else G60)
        self.text(x, y, w, size * 0.98, value, size=size, bold=True, color=color,
                  tracking=-0.04, lh=0.88, align=align)
        self.text(x, y + size * 0.92, w, lsize * 2.4, label, size=lsize,
                  color=lcolor, lh=1.3, align=align)
        return self

    def hbar(self, x, y, w, label, pct, value=None, lab_w=430, h=34,
            fill=INK, track=L10, size=T_BD2):
        self.text(x, y, lab_w - 26, h, label, size=size,
                  color=(W82 if self.dark else G70), anchor="m", lh=1.2)
        tw = w - lab_w - 130
        self.rect(x + lab_w, y, tw, h, fill=track, lw=0)
        self.rect(x + lab_w, y, tw * pct, h, fill=fill, lw=0)
        self.text(x + lab_w + tw + 10, y, 120, h, value or "%d %%" % round(pct * 100),
                  size=T_BD, bold=True, color=(PAPER if self.dark else INK),
                  align="r", anchor="m", lh=1.0)
        return self

    def steps(self, x, y, w, items, gap=32, acc=ACC, label="PASO", top=2,
              body=True, num_fmt="%s %02d"):
        """items: [(titulo, descripcion), ...] en columnas iguales."""
        n = len(items)
        cw = (w - gap * (n - 1)) / float(n)
        for i, (t, d) in enumerate(items):
            cx = x + i * (cw + gap)
            self.hr(cx, y, cw, INK, top)
            self.text(cx, y + 20, cw, 26, num_fmt % (label, i + 1), size=20,
                      bold=True, color=acc, tracking=0.14, lh=1.0)
            self.text(cx, y + 54, cw, 34 * 2.2, t, size=28, bold=True,
                      color=(PAPER if self.dark else INK), tracking=-0.01, lh=1.15)
            if body and d:
                self.text(cx, y + 122, cw, 20 * 1.45 * 4, d, size=20,
                          color=(W82 if self.dark else G70), lh=1.45)
        return self

    def grid_ticks(self, color=None, every=COL + GUT):
        """Marcas técnicas de retícula en el borde superior e inferior."""
        color = color or (W12 if self.dark else BD)
        for i in range(13):
            x = MARGIN + i * (COL + GUT) - (GUT if i == 12 else 0)
            x = min(x, W - MARGIN)
            self.line(x, 40, x, 52, color, 1)
        return self

    def corner_marks(self, color=None, s=18, m=40):
        color = color or (W12 if self.dark else BD)
        for (cx, cy, dx, dy) in ((m, m, 1, 1), (W - m, m, -1, 1),
                                 (m, H - m, 1, -1), (W - m, H - m, -1, -1)):
            self.line(cx, cy, cx + s * dx, cy, color, 1)
            self.line(cx, cy, cx, cy + s * dy, color, 1)
        return self

    def build(self):
        """Añade pie y marca al final para que queden por encima."""
        if self._foot:
            self.footer()
        self.mark()
        return self


# ══════════════════════════ FONDOS DE PUNTOS ══════════════════════════
def dot_png(path, dark=True, step=36, color=(255, 255, 255), alpha=33,
            bg=(0x16, 0x16, 0x16)):
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    r, g, b = color
    mix = tuple(int(bg[i] + (color[i] - bg[i]) * alpha / 255.0) for i in range(3))
    for yy in range(0, H, step):
        for xx in range(0, W, step):
            d.rectangle([xx, yy, xx + 1, yy + 1], fill=mix)
    img.save(path)
    return path


_VEILS = {}
VEIL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_assets")


def veil_png(color=INK, a0=0.0, a1=0.85, vertical=True):
    """Genera (y cachea) el PNG del velo. 2 px de ancho: se estira sin coste."""
    from PIL import Image
    key = (color, round(a0, 3), round(a1, 3), vertical)
    if key in _VEILS:
        return _VEILS[key]
    if not os.path.isdir(VEIL_DIR):
        os.makedirs(VEIL_DIR)
    n = 256
    rgb = tuple(int(color[i:i + 2], 16) for i in (0, 2, 4))
    img = Image.new("RGBA", (2, n) if vertical else (n, 2))
    px = img.load()
    for i in range(n):
        a = int(round(255 * (a0 + (a1 - a0) * i / float(n - 1))))
        for j in range(2):
            if vertical:
                px[j, i] = rgb + (a,)
            else:
                px[i, j] = rgb + (a,)
    path = os.path.join(VEIL_DIR, "veil_%s_%03d_%03d_%s.png"
                        % (color, int(a0 * 100), int(a1 * 100),
                           "v" if vertical else "h"))
    img.save(path)
    _VEILS[key] = path
    return path


# ══════════════════════════ EMISOR PPTX ══════════════════════════
def _emu(v):
    return Emu(int(round(v * EMU_PX)))

def _pt(v):
    return Pt(v * PT_PX)

def _rgb(hexs):
    return RGBColor.from_string(hexs)

def _no_shadow(shape):
    spPr = shape._element.spPr
    if spPr.find(qn("a:effectLst")) is None:
        spPr.append(spPr.makeelement(qn("a:effectLst"), {}))

def _set_line(shape, color, lw, dash=None, miter=True):
    ln = shape.line
    if color is None or lw in (0, None):
        ln.fill.background()
        return
    ln.color.rgb = _rgb(color)
    ln.width = _emu(lw)
    lnel = ln._get_or_add_ln()
    if dash:
        el = lnel.makeelement(qn("a:prstDash"), {"val": dash})
        lnel.append(el)
    if miter:
        lnel.append(lnel.makeelement(qn("a:miter"), {"lim": "800000"}))

def _grad_fill(shape, color, a0, a1, vertical=True):
    """Degradado de alfa: PowerPoint sí lo soporta, python-pptx no lo expone."""
    spPr = shape._element.spPr
    for tag in ("a:solidFill", "a:noFill", "a:gradFill"):
        el = spPr.find(qn(tag))
        if el is not None:
            spPr.remove(el)
    grad = spPr.makeelement(qn("a:gradFill"), {"rotWithShape": "1"})
    gsLst = spPr.makeelement(qn("a:gsLst"), {})
    for pos, alpha in ((0, a0), (100000, a1)):
        gs = spPr.makeelement(qn("a:gs"), {"pos": str(pos)})
        clr = spPr.makeelement(qn("a:srgbClr"), {"val": color})
        al = spPr.makeelement(qn("a:alpha"), {"val": str(int(round(alpha * 100000)))})
        clr.append(al)
        gs.append(clr)
        gsLst.append(gs)
    grad.append(gsLst)
    grad.append(spPr.makeelement(qn("a:lin"),
                                 {"ang": "5400000" if vertical else "0",
                                  "scaled": "0"}))
    prstGeom = spPr.find(qn("a:prstGeom"))
    if prstGeom is not None:
        prstGeom.addnext(grad)
    else:
        spPr.append(grad)


def _add_text(slide_pptx, it):
    tb = slide_pptx.shapes.add_textbox(_emu(it["x"]), _emu(it["y"]),
                                       _emu(it["w"]), _emu(it["h"]))
    tf = tb.text_frame
    tf.word_wrap = bool(it.get("wrap", True))
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = {"t": MSO_ANCHOR.TOP, "m": MSO_ANCHOR.MIDDLE,
                          "b": MSO_ANCHOR.BOTTOM}[it.get("anchor", "t")]
    bodyPr = tf._txBody.bodyPr
    for tag in ("a:normAutofit", "a:spAutoFit"):
        el = bodyPr.find(qn(tag))
        if el is not None:
            bodyPr.remove(el)
    for i, p in enumerate(it["paras"]):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = {"l": PP_ALIGN.LEFT, "c": PP_ALIGN.CENTER,
                          "r": PP_ALIGN.RIGHT, "j": PP_ALIGN.JUSTIFY}[p.get("align", "l")]
        _sz = max([r.get("size", it["size"]) for r in p["runs"]] or [it["size"]])
        para.line_spacing = _pt(p.get("lh", 1.4) * _sz)
        if p.get("space"):
            para.space_after = _pt(p["space"])
        for r in p["runs"]:
            size = r.get("size", it["size"])
            bold = r.get("bold", it["bold"])
            color = r.get("color", it["color"])
            trk = r.get("tracking", it["tracking"])
            caps = r.get("caps", it.get("caps", False))
            mono = r.get("mono", it.get("mono", False))
            txt = r.get("txt", "")
            if caps:
                txt = txt.upper()
            for j, seg in enumerate(txt.split("\n")):
                if j:
                    para._p.append(para._p.makeelement(qn("a:br"), {}))
                run = para.add_run()
                run.text = seg
                f = run.font
                f.size = _pt(size)
                f.bold = bool(bold)
                f.name = FMONO if mono else FONT
                f.color.rgb = _rgb(color)
                rPr = run._r.get_or_add_rPr()
                if trk:
                    rPr.set("spc", str(int(round(trk * size * PT_PX * 100))))
                rPr.set("dirty", "0")
                rPr.append(rPr.makeelement(qn("a:cs"),
                                           {"typeface": FMONO if mono else FONT}))
    _no_shadow(tb)
    return tb

def _add_table(slide_pptx, it):
    heads, rows = it["heads"], it["rows"]
    ncol = len(heads) if heads else len(rows[0])
    cw = it["col_w"] or [it["w"] / float(ncol)] * ncol
    x, y = it["x"], it["y"]
    aligns = it["aligns"] or ["l"] * ncol
    shapes = []
    if heads:
        cx = x
        for i, hd in enumerate(heads):
            _add_text(slide_pptx, dict(t="text", x=cx, y=y, w=cw[i] - 20,
                                       h=it["head_h"], size=it["head_size"],
                                       bold=True, color=INK, tracking=0.10,
                                       caps=True, mono=False, anchor="b", wrap=True,
                                       paras=[dict(runs=[dict(txt=hd)],
                                                   align=aligns[i], lh=1.0, space=0)]))
            cx += cw[i]
        y += it["head_h"] + 12
        shapes.append(("line", x, y, x + it["w"], y, INK, 2))
    cy = y
    for r_i, row in enumerate(rows):
        cx = x
        for i, cell in enumerate(row):
            bold = it["first_bold"] and i == 0
            _add_text(slide_pptx, dict(t="text", x=cx, y=cy + 14, w=cw[i] - 20,
                                       h=it["row_h"] - 20, size=it["body_size"],
                                       bold=bold, color=INK if bold else it["color"],
                                       tracking=0, caps=False, mono=False,
                                       anchor="t", wrap=True,
                                       paras=[dict(runs=[dict(txt=cell)],
                                                   align=aligns[i], lh=1.25, space=0)]))
            cx += cw[i]
        cy += it["row_h"]
        shapes.append(("line", x, cy, x + it["w"], cy, BD, 1))
    return shapes

def _add_chart(slide_pptx, it):
    """Gráficos dibujados con formas: siempre en paleta de marca y editables."""
    out = []
    x, y, w, h = it["x"], it["y"], it["w"], it["h"]
    cats, series = it["cats"], it["series"]
    vals = [v for s in series for v in s["values"]]
    maxv = it["maxv"] or (max(vals) * 1.15 if vals else 1)
    return out


class Deck(object):
    def __init__(self, title="ActiveXRemote", subject="", author="ActiveXRemote"):
        self.prs = Presentation()
        self.prs.slide_width = _emu(W)
        self.prs.slide_height = _emu(H)
        self.slides = []
        cp = self.prs.core_properties
        cp.title = title
        cp.author = author
        cp.subject = subject
        cp.category = "Plantillas de diapositiva"

    def add(self, s):
        self.slides.append(s)
        return s

    # ── PPTX ─────────────────────────────────────────────────
    def save_pptx(self, path):
        blank = self.prs.slide_layouts[6]
        for s in self.slides:
            sl = self.prs.slides.add_slide(blank)
            fill = sl.background.fill
            fill.solid()
            fill.fore_color.rgb = _rgb(s.bg)
            extra_lines = []
            for it in s.items:
                k = it["t"]
                if k == "rect":
                    sh = sl.shapes.add_shape(MSO_SHAPE.RECTANGLE, _emu(it["x"]),
                                             _emu(it["y"]), _emu(it["w"]), _emu(it["h"]))
                    sh.adjustments  # noqa
                    if it["fill"]:
                        sh.fill.solid()
                        sh.fill.fore_color.rgb = _rgb(it["fill"])
                    else:
                        sh.fill.background()
                    _set_line(sh, it["line"], it["lw"], it.get("dash"))
                    _no_shadow(sh)
                    sh.text_frame.word_wrap = True
                    if it.get("name"):
                        sh._element._nvXxPr.cNvPr.set("name", it["name"])
                elif k == "line":
                    sh = sl.shapes.add_connector(1, _emu(it["x1"]), _emu(it["y1"]),
                                                 _emu(it["x2"]), _emu(it["y2"]))
                    _set_line(sh, it["color"], it["lw"], it.get("dash"))
                    _no_shadow(sh)
                elif k == "poly":
                    pts = it["pts"]
                    ff = sl.shapes.build_freeform(_emu(pts[0][0]), _emu(pts[0][1]))
                    ff.add_line_segments([(_emu(px), _emu(py)) for px, py in pts[1:]],
                                         close=it.get("close", True))
                    sh = ff.convert_to_shape()
                    if it["fill"]:
                        sh.fill.solid()
                        sh.fill.fore_color.rgb = _rgb(it["fill"])
                    else:
                        sh.fill.background()
                    _set_line(sh, it["line"], it["lw"])
                    _no_shadow(sh)
                elif k == "ellipse":
                    sh = sl.shapes.add_shape(MSO_SHAPE.OVAL, _emu(it["x"]), _emu(it["y"]),
                                             _emu(it["w"]), _emu(it["h"]))
                    if it["fill"]:
                        sh.fill.solid()
                        sh.fill.fore_color.rgb = _rgb(it["fill"])
                    else:
                        sh.fill.background()
                    _set_line(sh, it["line"], it["lw"])
                    _no_shadow(sh)
                elif k == "pic":
                    sl.shapes.add_picture(it["path"], _emu(it["x"]), _emu(it["y"]),
                                          _emu(it["w"]), _emu(it["h"]))
                elif k == "text":
                    _add_text(sl, it)
                elif k == "table":
                    extra_lines += _add_table(sl, it)
            for ln in extra_lines:
                _, x1, y1, x2, y2, c, lw = ln
                sh = sl.shapes.add_connector(1, _emu(x1), _emu(y1), _emu(x2), _emu(y2))
                _set_line(sh, c, lw)
                _no_shadow(sh)
            if s.notes:
                sl.notes_slide.notes_text_frame.text = s.notes
        self.prs.save(path)
        _postprocess(path)
        return path

    # ── PNG ──────────────────────────────────────────────────
    def save_png(self, outdir, scale=0.5, only=None):
        from .preview import render
        if not os.path.isdir(outdir):
            os.makedirs(outdir)
        paths = []
        for i, s in enumerate(self.slides):
            if only is not None and i not in only:
                continue
            p = os.path.join(outdir, "s%03d.png" % (i + 1))
            render(s, p, scale)
            paths.append(p)
        return paths


def _postprocess(path):
    """Dos arreglos sobre el paquete ya escrito:

    1. Tipografía del tema a Inter, para que un cuadro de texto nuevo nazca bien.
    2. `notesMasterIdLst` en presentation.xml — python-pptx crea el patrón de notas
       pero no lo declara, y sin esa declaración el paquete queda inconsistente
       (Vista Rápida de macOS se cuelga al previsualizarlo).
    """
    import zipfile, shutil, re
    tmp = path + ".tmp"
    zin = zipfile.ZipFile(path, "r")
    rels = zin.read("ppt/_rels/presentation.xml.rels").decode("utf-8")
    m = re.search(r'<Relationship Id="([^"]+)"[^>]*notesMaster[^>]*/>', rels)
    notes_rid = m.group(1) if m else None
    zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "ppt/presentation.xml" and notes_rid:
            xml = data.decode("utf-8")
            if "notesMasterIdLst" not in xml:
                xml = xml.replace(
                    "</p:sldMasterIdLst>",
                    '</p:sldMasterIdLst><p:notesMasterIdLst><p:notesMasterId '
                    'r:id="%s"/></p:notesMasterIdLst>' % notes_rid)
                data = xml.encode("utf-8")
        if item.filename.startswith("ppt/theme/theme"):
            xml = data.decode("utf-8")
            xml = re.sub(r'(<a:(?:majorFont|minorFont)>\s*<a:latin typeface=")[^"]*"',
                         r'\1Inter"', xml)
            xml = xml.replace('typeface="Calibri Light"', 'typeface="Inter"')
            xml = xml.replace('typeface="Calibri"', 'typeface="Inter"')
            data = xml.encode("utf-8")
        zout.writestr(item, data)
    zin.close()
    zout.close()
    shutil.move(tmp, path)
