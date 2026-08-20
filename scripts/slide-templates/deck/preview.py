# -*- coding: utf-8 -*-
"""
Previsualización PNG de una escena. No es PowerPoint: es una aproximación fiel
a la geometría (idéntica) y razonable al texto (métricas de Inter reales, salto
de línea propio). Sirve para revisar composición, no para entregar.
"""
import os
from PIL import Image, ImageDraw, ImageFont

from .engine import W, H, PAPER, INK, BD

_INTER = os.path.expanduser("~/Library/Fonts/Inter-VariableFont_opsz,wght.ttf")
_MONO_CANDIDATES = ["/System/Library/Fonts/Menlo.ttc",
                    "/System/Library/Fonts/Supplemental/Courier New.ttf"]
_cache = {}


def _font(size_px, weight=400, mono=False):
    key = (round(size_px), weight, mono)
    if key in _cache:
        return _cache[key]
    if mono:
        f = None
        for p in _MONO_CANDIDATES:
            if os.path.exists(p):
                try:
                    f = ImageFont.truetype(p, int(round(size_px)))
                    break
                except Exception:
                    pass
        if f is None:
            f = ImageFont.load_default()
    else:
        f = ImageFont.truetype(_INTER, int(round(size_px)))
        try:
            axes = f.get_variation_axes()
            vals = []
            for ax in axes:
                nm = ax["name"]
                nm = nm.decode() if isinstance(nm, bytes) else nm
                vals.append(float(weight) if "eight" in nm or "wght" in nm
                            else float(ax["default"]))
            f.set_variation_by_axes(vals)
        except Exception:
            pass
    _cache[key] = f
    return f


def _tw(draw, txt, font, tracking_px):
    if not txt:
        return 0
    w = draw.textlength(txt, font=font)
    return w + tracking_px * max(0, len(txt) - 1)


def _draw_tracked(draw, x, y, txt, font, fill, tracking_px):
    if tracking_px == 0:
        draw.text((x, y), txt, font=font, fill=fill)
        return
    cx = x
    for ch in txt:
        draw.text((cx, y), ch, font=font, fill=fill)
        cx += draw.textlength(ch, font=font) + tracking_px


def _wrap(draw, txt, font, tracking_px, maxw, wrap=True):
    if not wrap:
        return [txt]
    words, lines, cur = txt.split(" "), [], ""
    for wd in words:
        cand = wd if not cur else cur + " " + wd
        if _tw(draw, cand, font, tracking_px) <= maxw or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = wd
    if cur:
        lines.append(cur)
    return lines


def _hex(h, alpha=255):
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), alpha)


def render(slide, path, scale=1.0):
    img = Image.new("RGB", (int(W * scale), int(H * scale)), _hex(slide.bg)[:3])
    d = ImageDraw.Draw(img)
    S = scale

    def R(v):
        return v * S

    for it in slide.items:
        k = it["t"]
        if k == "rect":
            box = [R(it["x"]), R(it["y"]), R(it["x"] + it["w"]), R(it["y"] + it["h"])]
            d.rectangle(box, fill=_hex(it["fill"])[:3] if it["fill"] else None,
                        outline=_hex(it["line"])[:3] if it["line"] else None,
                        width=max(1, int(round(R(it["lw"])))) if it["line"] else 0)
        elif k == "line":
            d.line([R(it["x1"]), R(it["y1"]), R(it["x2"]), R(it["y2"])],
                   fill=_hex(it["color"])[:3], width=max(1, int(round(R(it["lw"])))))
        elif k == "poly":
            pts = [(R(a), R(b)) for a, b in it["pts"]]
            if it["fill"]:
                d.polygon(pts, fill=_hex(it["fill"])[:3])
            if it["line"] and it["lw"]:
                seq = pts + ([pts[0]] if it.get("close", True) else [])
                d.line(seq, fill=_hex(it["line"])[:3],
                       width=max(1, int(round(R(it["lw"])))), joint="curve")
        elif k == "ellipse":
            d.ellipse([R(it["x"]), R(it["y"]), R(it["x"] + it["w"]), R(it["y"] + it["h"])],
                      fill=_hex(it["fill"])[:3] if it["fill"] else None,
                      outline=_hex(it["line"])[:3] if it["line"] else None,
                      width=max(1, int(round(R(it["lw"])))) if it["line"] else 0)
        elif k == "veil":
            gx, gy = int(R(it["x"])), int(R(it["y"]))
            gw, gh = max(1, int(R(it["w"]))), max(1, int(R(it["h"])))
            base = Image.new("RGBA", (gw, gh), _hex(it["color"])[:3] + (0,))
            px = base.load()
            for yy in range(gh):
                t = yy / float(max(1, gh - 1)) if it["vertical"] else 0
                a = int(255 * (it["a0"] + (it["a1"] - it["a0"]) * t))
                for xx in range(gw):
                    px[xx, yy] = _hex(it["color"])[:3] + (a,)
            img.paste(base, (gx, gy), base)
            d = ImageDraw.Draw(img)
        elif k == "pic":
            try:
                im = Image.open(it["path"])
                im = im.resize((max(1, int(R(it["w"]))), max(1, int(R(it["h"])))))
                if im.mode == "RGBA":
                    img.paste(im, (int(R(it["x"])), int(R(it["y"]))), im)
                    d = ImageDraw.Draw(img)
                else:
                    img.paste(im.convert("RGB"), (int(R(it["x"])), int(R(it["y"]))))
            except Exception:
                pass
        elif k == "text":
            _render_text(d, it, S)
        elif k == "table":
            _render_table(d, it, S)

    img.save(path)
    return path


def _render_text(d, it, S):
    x, y, w, h = it["x"] * S, it["y"] * S, it["w"] * S, it["h"] * S
    blocks = []
    total = 0
    for p in it["paras"]:
        for r in p["runs"]:
            size = r.get("size", it["size"]) * S
            weight = 700 if r.get("bold", it["bold"]) else 400
            mono = r.get("mono", it.get("mono", False))
            caps = r.get("caps", it.get("caps", False))
            trk = r.get("tracking", it["tracking"]) * r.get("size", it["size"]) * S
            color = _hex(r.get("color", it["color"]))[:3]
            font = _font(size, weight, mono)
            txt = r.get("txt", "")
            if caps:
                txt = txt.upper()
            lh = p.get("lh", 1.4) * size
            lines = []
            for seg in txt.split("\n"):
                lines += _wrap(d, seg, font, trk, w, it.get("wrap", True))
            blocks.append((lines, font, color, trk, lh, p.get("align", "l"), size))
            total += len(lines) * lh + p.get("space", 0) * S
    anchor = it.get("anchor", "t")
    cy = y if anchor == "t" else (y + (h - total) / 2.0 if anchor == "m" else y + h - total)
    for lines, font, color, trk, lh, align, size in blocks:
        for ln in lines:
            lw = _tw(d, ln, font, trk)
            lx = x if align == "l" else (x + (w - lw) / 2.0 if align == "c" else x + w - lw)
            # PIL dibuja desde el ascendente: se centra la caja de línea
            _draw_tracked(d, lx, cy + (lh - size * 1.18) / 2.0 - size * 0.06,
                          ln, font, color, trk)
            cy += lh


def _render_table(d, it, S):
    from .engine import G70
    heads, rows = it["heads"], it["rows"]
    ncol = len(heads) if heads else len(rows[0])
    cw = it["col_w"] or [it["w"] / float(ncol)] * ncol
    x, y = it["x"], it["y"]
    aligns = it["aligns"] or ["l"] * ncol
    if heads:
        cx = x
        for i, hd in enumerate(heads):
            _render_text(d, dict(x=cx, y=y, w=cw[i] - 20, h=it["head_h"],
                                 size=it["head_size"], bold=True, color=INK,
                                 tracking=0.10, caps=True, mono=False, anchor="b",
                                 wrap=True,
                                 paras=[dict(runs=[dict(txt=hd)], align=aligns[i],
                                             lh=1.0, space=0)]), S)
            cx += cw[i]
        y += it["head_h"] + 12
        d.line([x * S, y * S, (x + it["w"]) * S, y * S], fill=_hex(INK)[:3],
               width=max(1, int(round(2 * S))))
    cy = y
    for row in rows:
        cx = x
        for i, cell in enumerate(row):
            bold = it["first_bold"] and i == 0
            _render_text(d, dict(x=cx, y=cy + 14, w=cw[i] - 20, h=it["row_h"] - 20,
                                 size=it["body_size"], bold=bold,
                                 color=INK if bold else it["color"], tracking=0,
                                 caps=False, mono=False, anchor="t", wrap=True,
                                 paras=[dict(runs=[dict(txt=cell)], align=aligns[i],
                                             lh=1.25, space=0)]), S)
            cx += cw[i]
        cy += it["row_h"]
        d.line([x * S, cy * S, (x + it["w"]) * S, cy * S], fill=_hex(BD)[:3],
               width=max(1, int(round(1 * S))))


def contact_sheet(paths, out, cols=4, thumb_w=480, gap=16, bg=(230, 230, 230)):
    """Hoja de contactos para revisar muchas diapositivas de un vistazo."""
    ims = [Image.open(p) for p in paths]
    tw, th = thumb_w, int(thumb_w * H / float(W))
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * gap,
                              rows * th + (rows + 1) * gap), bg)
    for i, im in enumerate(ims):
        im = im.resize((tw, th))
        r, c = divmod(i, cols)
        sheet.paste(im, (gap + c * (tw + gap), gap + r * (th + gap)))
    sheet.save(out)
    return out
