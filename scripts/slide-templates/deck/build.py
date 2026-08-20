# -*- coding: utf-8 -*-
"""
Genera «ActiveXRemote — Plantillas de diapositiva» en PPTX.

    python3 -m deck.build [destino.pptx] [--png CARPETA] [--scale 0.5]

Estructura del archivo (92 diapositivas):

    01        Portada
    02        Mapa del documento
    03–12     Parte 1 · Cómo se crea un módulo (NotebookLM + Google Classroom)
    13–16     Parte 2 · El sistema de diseño aplicado
    17–18     Parte 3 · Índice de las 64 plantillas
    19–92     Parte 4 · Las 64 plantillas, por familias
"""
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from deck.engine import Deck, dot_png, INK          # noqa: E402
from deck import guide, templates, index            # noqa: E402

DEFAULT_OUT = os.path.abspath(os.path.join(
    _ROOT, "..", "..", "presentaciones del curso",
    "ActiveXRemote-Plantillas-Diapositiva.pptx"))


def build(out_path=DEFAULT_OUT, png_dir=None, scale=0.5):
    assets_dir = os.path.join(_HERE, "_assets")
    if not os.path.isdir(assets_dir):
        os.makedirs(assets_dir)
    dots = dot_png(os.path.join(assets_dir, "dots_dark.png"))
    for mod in (guide, templates, index):
        mod.ASSETS["dots_dark"] = dots

    d = Deck(title="ActiveXRemote — Plantillas de diapositiva",
             subject="Sistema de diapositivas y proceso de creación de un módulo",
             author="ActiveXRemote")

    g = guide.build_guide()                 # portada + proceso + sistema
    proceso, sistema = g[1:11], g[11:]

    tpls = templates.build_templates()      # [(código, Slide)]
    by_family = {}
    for code, sl in tpls:
        by_family.setdefault(templates.META[code]["family"], []).append(sl)

    n_parte4 = sum(1 + len(v) for v in by_family.values())
    p1a = 3
    p1b = p1a + len(proceso) - 1
    p2a, p2b = p1b + 1, p1b + len(sistema)
    p3a, p3b = p2b + 1, p2b + 2
    p4a, p4b = p3b + 1, p3b + n_parte4

    d.add(g[0])                             # 01 · portada
    d.add(index.doc_map([
        ("El proceso del módulo", p1a, p1b,
         "Cómo se crea un módulo con NotebookLM y Google Classroom, paso a paso, "
         "y qué se entrega en cada fecha."),
        ("El sistema de diseño", p2a, p2b,
         "Retícula, escala tipográfica, paleta y marca. Las medidas exactas con las "
         "que están hechas estas plantillas."),
        ("Índice de plantillas", p3a, p3b,
         "Los 64 códigos con su nombre y su familia. El mapa para elegir rápido."),
        ("Las 64 plantillas", p4a, p4b,
         "Una diapositiva por layout, vacía y con la marca aplicada. La ficha de uso "
         "va en las notas del ponente."),
    ]))
    for sl in proceso + sistema:
        d.add(sl)
    for sl in index.index_slides():
        d.add(sl)
    for fam in index.FAMILIES:
        d.add(index.family_divider(fam))
        for sl in by_family.get(fam, []):
            d.add(sl)

    outdir = os.path.dirname(out_path)
    if outdir and not os.path.isdir(outdir):
        os.makedirs(outdir)
    d.save_pptx(out_path)
    print("PPTX  %s  (%d diapositivas)" % (out_path, len(d.slides)))

    if png_dir:
        paths = d.save_png(png_dir, scale=scale)
        from deck.preview import contact_sheet
        for i in range(0, len(paths), 16):
            contact_sheet(paths[i:i + 16],
                          os.path.join(png_dir, "hoja_%02d.png" % (i // 16 + 1)),
                          cols=4, thumb_w=470)
        print("PNG   %s  (%d imágenes)" % (png_dir, len(paths)))
    return d


if __name__ == "__main__":
    args = [a for a in sys.argv[1:]]
    out = DEFAULT_OUT
    png = None
    scale = 0.5
    while args:
        a = args.pop(0)
        if a == "--png":
            png = args.pop(0)
        elif a == "--scale":
            scale = float(args.pop(0))
        else:
            out = os.path.abspath(a)
    build(out, png, scale)
