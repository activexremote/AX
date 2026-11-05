# Genera public/logos/partners/quantum.svg: el sello de Quantum Mindset
# Solutions redibujado en vectores (el PNG de 512 px se veía borroso).
# Las letras van convertidas a trazados con Times New Roman de macOS, así
# que el SVG no depende de ninguna fuente. Uso: python3 scripts/quantum-logo.py
import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

F = TTFont("/System/Library/Fonts/Supplemental/Times New Roman.ttf")
GS = F.getGlyphSet(); CMAP = F.getBestCmap(); UPM = F["head"].unitsPerEm
HM = F["hmtx"]
C = 256

def glyph(ch, size, tx, ty, rot_deg, pen):
    name = CMAP[ord(ch)]
    s = size / UPM
    adv = HM[name][0] * s
    r = math.radians(rot_deg)
    cos, sin = math.cos(r), math.sin(r)
    # local: x' = (x*s - adv/2), y' = -y*s ; then rotate, then translate
    a, b = cos * s, sin * s
    c_, d = sin * s, -cos * s  # for y: rotate(0,-y*s)
    # matrix maps (x,y) -> (a*x - (-c_)... ) build explicitly:
    # X = cos*(x*s - adv/2) - sin*(-y*s) + tx
    # Y = sin*(x*s - adv/2) + cos*(-y*s) + ty
    m = (cos * s, sin * s, sin * s, -cos * s,
         tx - cos * adv / 2, ty - sin * adv / 2)
    GS[name].draw(TransformPen(pen, m))
    return adv

def arc_text(text, size, r, center_deg, track, outward, pen):
    s = size / UPM
    advs = [HM[CMAP[ord(ch)]][0] * s for ch in text]
    total = sum(advs) + track * (len(text) - 1)
    # angular direction: top text goes clockwise (+), bottom text counter-clockwise (-)
    sign = 1 if outward else -1
    pos = -total / 2
    for ch, adv in zip(text, advs):
        mid = pos + adv / 2
        th = math.radians(center_deg) + sign * mid / r
        x, y = C + r * math.cos(th), C + r * math.sin(th)
        rot = math.degrees(th) + (90 if outward else -90)
        if ch != " ":
            glyph(ch, size, x, y, rot, pen)
        pos += adv + track

pen = SVGPathPen(GS, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
arc_text("QUANTUM", 66, 160, -90, 13, True, pen)
arc_text("MINDSET SOLUTIONS", 41, 197, 90, 6.5, False, pen)
# Psi en el centro
s = 104 / UPM
name = CMAP[0x03A8]
adv = HM[name][0] * s
GS[name].draw(TransformPen(pen, (s, 0, 0, -s, C - adv / 2, 290)))
letters = pen.getCommands()

def ell_pt(phi, a, b, t):
    p, t = math.radians(phi), math.radians(t)
    x, y = a * math.cos(t), b * math.sin(t)
    return C + x * math.cos(p) - y * math.sin(p), C + x * math.sin(p) + y * math.cos(p)

A, B = 128, 60
def t_de(phi, x, y):
    p = math.radians(phi); dx, dy = x - C, y - C
    u = dx * math.cos(p) + dy * math.sin(p); v = -dx * math.sin(p) + dy * math.cos(p)
    return math.degrees(math.atan2(v / B, u / A))
# Los cuatro electrones, en la órbita en que caen en el logo original.
obj = [(310, 160), (212, 340), (168, 205), (350, 300)]
dots = []
for x, y in obj:
    best = min(((phi, t_de(phi, x, y)) for phi in (45, -45)), key=lambda pt: math.dist(ell_pt(pt[0], A, B, pt[1]), (x, y)))
    dots.append(ell_pt(*best[:1], A, B, best[1]))
dots_svg = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="9.5"/>' for x, y in dots)
# Cruces de las dos órbitas: se cortan en cuatro puntos. Para el trenzado,
# cada órbita se interrumpe en dos de ellos (pasa «por debajo»).
cruces = []
for i in range(3600):
    t = i / 10
    x, y = ell_pt(45, A, B, t)
    p = math.radians(-45); dx, dy = x - C, y - C
    u = dx * math.cos(p) + dy * math.sin(p); v = -dx * math.sin(p) + dy * math.cos(p)
    f = (u / A) ** 2 + (v / B) ** 2 - 1
    cruces.append((abs(f), x, y))
pts = []
for f, x, y in sorted(cruces):
    if all(math.dist((x, y), q) > 20 for q in pts): pts.append((x, y))
    if len(pts) == 4: break
pts.sort(key=lambda q: math.atan2(q[1] - C, q[0] - C))
def hueco(qs):
    return "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="10" fill="#000"/>' for x, y in qs)
mask_a = hueco([pts[0], pts[2]]); mask_b = hueco([pts[1], pts[3]])
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Quantum Mindset Solutions">
<defs>
<mask id="qa" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="#fff"/>{mask_a}</mask>
<mask id="qb" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="#fff"/>{mask_b}</mask>
</defs>
<g fill="none" stroke="#000">
<circle cx="256" cy="256" r="245" stroke-width="6.5"/>
<circle cx="256" cy="256" r="233" stroke-width="2.5"/>
<g mask="url(#qa)"><ellipse cx="256" cy="256" rx="{A}" ry="{B}" transform="rotate(45 256 256)" stroke-width="4.5"/></g>
<g mask="url(#qb)"><ellipse cx="256" cy="256" rx="{A}" ry="{B}" transform="rotate(-45 256 256)" stroke-width="4.5"/></g>
</g>
<g fill="#000">{dots_svg}<circle cx="70" cy="256" r="6.5"/><circle cx="442" cy="256" r="6.5"/><path d="{letters}"/></g>
</svg>
'''
open("public/logos/partners/quantum.svg", "w").write(svg)
print(len(svg))
