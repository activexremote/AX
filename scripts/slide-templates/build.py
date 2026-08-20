# -*- coding: utf-8 -*-
import io, os
from collections import OrderedDict
from gen_css import CSS
from layouts import L

FONTS = open('fonts.css').read()
FRONT = 6                      # páginas de portada, guía, hoja técnica, medios e índices
def page_of(i): return FRONT + 1 + 2*i      # página de la plantilla del layout i

FAMILIES = OrderedDict()
for l in L:
    FAMILIES.setdefault(l["family"], []).append(l)

def logo(dark=False, h=28):
    c = "#fff" if dark else "#161616"
    return ('<svg height="%drem" width="%drem" viewBox="0 0 46 28" fill="none" stroke="%s" '
            'stroke-width="2" stroke-linejoin="miter"><path d="M11 2 L20 26 L2 26 Z"/>'
            '<path d="M26 2 L44 2 L35 14 Z"/><path d="M26 26 L44 26 L35 14 Z"/></svg>'
            % (h, round(h*46/28), c))

def foot(dark=False, right="MÓDULO 00 · 00"):
    return ('<div class="foot"><div class="lock">%s<span>ACTIVEXREMOTE</span></div>'
            '<div class="pg">%s</div></div>' % (logo(dark), right))

def slide(body, code=None, dark=False, extra_cls="", foot_right="MÓDULO 00 · 00", show_foot=True):
    cls = "slide" + (" ink dots" if dark else "") + ((" " + extra_cls) if extra_cls else "")
    mark = '<div class="mark">%s</div>' % code if code else ""
    return '<section class="%s">%s%s%s</section>' % (
        cls, mark, body, foot(dark, foot_right) if show_foot else "")

def spec_block(l):
    zs = " | ".join("%s(%s)" % (k, lim.replace(" car.", "").replace(" · ", "/").strip())
                    for k, lim, _ in l["zones"])
    return ("LAYOUT: %s — %s\nFAMILIA: %s\nFONDO: %s\nZONAS: %s\nUSAR: %s\nEVITAR: %s"
            % (l["code"], l["name"], l["family"],
               "tinta #161616" if l["dark"] else "blanco", zs, l["use"][0], l["avoid"][0]))

def ficha(l, pg):
    zrows = "".join('<tr><td class="k">%s</td><td>%s</td><td>%s</td></tr>' % z for z in l["zones"])
    body = '''<div class="canvas">
      <div class="doc-h"><span class="code">%s</span><span class="nm">%s</span><span class="kind">Ficha · %s</span></div>
      <div style="display:grid;grid-template-columns:7fr 5fr;gap:44rem;">
        <div>
          <h4>Para qué sirve</h4><p>%s</p>
          <h4 style="margin-top:22rem;">Zonas de texto</h4>
          <table><tr><th>Clave</th><th>Límite</th><th>Nota</th></tr>%s</table>
          <h4 style="margin-top:24rem;">Vista</h4>
          <div class="mini"><div class="inner%s">%s%s</div></div>
        </div>
        <div>
          <div class="box"><h4>Usar cuando</h4><ul>%s</ul>
            <h4 style="margin-top:18rem;">No usar cuando</h4><ul>%s</ul></div>
          <h4 style="margin-top:22rem;">Bloque para la IA</h4>
          <div class="codeblk">%s</div>
        </div>
      </div>
    </div>''' % (l["code"], l["name"], l["family"], l["purpose"], zrows,
                 " ink dots" if l["dark"] else "", l["body"], foot(l["dark"]),
                 "".join("<li>%s</li>" % x for x in l["use"]),
                 "".join("<li>%s</li>" % x for x in l["avoid"]), spec_block(l))
    return slide(body, extra_cls="doc", foot_right="FICHA %s · %03d" % (l["code"], pg))

# ══════════════════════════ PORTADA ══════════════════════════
def p_cover():
    b = '''<div class="canvas" style="display:flex;flex-direction:column;justify-content:space-between;">
      <div>%s</div>
      <div>
        <div class="eb" style="margin-bottom:26rem;">ACTIVEXREMOTE · THE REMOTE BUSINESS SCHOOL</div>
        <div style="font-size:112rem;font-weight:700;letter-spacing:-.035em;line-height:.98;">Plantillas de<br>diapositiva</div>
        <div style="width:220rem;height:3rem;background:#fff;margin:38rem 0 28rem;"></div>
        <div class="bd" style="font-size:26rem;max-width:1250rem;">%d formatos de diapositiva en blanco, agrupados en %d familias,
          con la marca aplicada y el texto sustituido por lorem ipsum. Incluye fotografía, vídeo, audio,
          enlaces y códigos QR. Documento de referencia para generar el contenido de los cursos.</div>
      </div>
      <div class="src" style="color:rgba(255,255,255,.5);">Versión 2.0 · Lienzo 1920 × 1080 px (16:9) · Uso interno</div>
    </div>''' % (logo(True, 46), len(L), len(FAMILIES))
    return slide(b, dark=True, show_foot=False)

# ══════════════════════════ GUÍA ══════════════════════════
def p_howto():
    fam = " · ".join("%s (%s)" % (k, v[0]["code"][0]) for k, v in FAMILIES.items())
    prompt = ("Usa el documento «ActiveXRemote — Plantillas de diapositiva» como única\n"
              "referencia de formato. Reglas:\n\n"
              "1. Cada diapositiva DEBE corresponder a uno de los %d layouts del catálogo.\n"
              "   Encabeza cada diapositiva con su código, así:  [C01 · Texto + imagen]\n"
              "2. Respeta las zonas de texto y los límites de caracteres de la ficha de ese\n"
              "   layout. No inventes zonas nuevas ni escribas texto fuera de ellas.\n"
              "3. Devuelve el contenido zona por zona, con la clave delante:\n"
              "      etiqueta: ...\n      titulo: ...\n      texto: ...\n"
              "4. No mezcles dos layouts en una misma diapositiva.\n"
              "5. Varía la familia: no encadenes más de 3 diapositivas de la misma.\n"
              "6. Estructura de cada sesión de 4 h (unas 45 diapositivas):\n"
              "      A01 → A05 → A06 → [A03 + contenido ×8-12 → I01] ×3 → I06 → I08\n"
              "7. Para foto, vídeo, audio, enlace o QR usa SIEMPRE un layout de las familias\n"
              "   C, D o E; describe el medio entre corchetes: [FOTO: ...] [VÍDEO: ...]\n"
              "8. Tono: tuteo, frases de menos de 20 palabras, títulos que afirman.\n"
              "   Sin emoji. Cifras en dígitos y siempre con fuente. Máx. 40 palabras/diapositiva.\n\n"
              "Genera ahora las diapositivas del MÓDULO 01 — HORA 1.") % len(L)
    b = '''<div class="canvas">
      <div class="doc-h"><span class="nm">Cómo usar este documento</span><span class="kind">Guía</span></div>
      <div style="display:grid;grid-template-columns:5fr 7fr;gap:44rem;">
        <div>
          <h4>Qué es</h4>
          <p>Un catálogo de <b>%d formatos de diapositiva vacíos</b>. Cada uno aparece dos veces:
             primero la <b>plantilla</b> (la diapositiva tal cual, con lorem ipsum donde va el texto)
             y después su <b>ficha</b> sobre fondo gris, con las zonas de texto y sus límites.</p>
          <h4 style="margin-top:18rem;">Las %d familias</h4>
          <p>%s</p>
          <h4 style="margin-top:18rem;">Cómo se lee</h4>
          <p>El código (<span class="mono">A01</span>…<span class="mono">I08</span>) va en gris claro
             en la esquina superior derecha de cada plantilla. <b>Es una anotación de este documento,
             no parte de la diapositiva:</b> no se copia al material final.</p>
          <h4 style="margin-top:18rem;">Qué es lorem ipsum</h4>
          <p>Texto latín de relleno. Marca <b>dónde</b> se escribe y <b>cuánto</b> cabe. Si tu texto
             no entra en el hueco, no es que la plantilla sea pequeña: es que el texto es largo.</p>
          <h4 style="margin-top:18rem;">Qué NO cambia nunca</h4>
          <ul><li>El pie: lockup a la izquierda, módulo y número a la derecha.</li>
              <li>Los márgenes de la zona segura y los tamaños de letra de cada zona.</li>
              <li>La paleta: tinta, blanco, grises y un solo acento.</li></ul>
        </div>
        <div>
          <h4>Prompt base — cópialo tal cual</h4>
          <div class="codeblk" style="font-size:13.5rem;line-height:1.5;">%s</div>
        </div>
      </div>
    </div>''' % (len(L), len(FAMILIES), fam, prompt)
    return slide(b, extra_cls="doc", foot_right="GUÍA · 002")

# ══════════════════════════ HOJA TÉCNICA ══════════════════════════
def p_spec():
    b = '''<div class="canvas">
      <div class="doc-h"><span class="nm">Especificación del lienzo</span><span class="kind">Hoja técnica</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:40rem;">
        <div>
          <h4>Lienzo y retícula</h4>
          <table>
            <tr><td>Formato</td><td class="k">1920 × 1080 px · 16:9</td></tr>
            <tr><td>Pulgadas</td><td class="k">13,33 × 7,5 in</td></tr>
            <tr><td>Centímetros</td><td class="k">33,87 × 19,05 cm</td></tr>
            <tr><td>Margen lateral</td><td class="k">96 px</td></tr>
            <tr><td>Margen superior</td><td class="k">72 px</td></tr>
            <tr><td>Margen inferior</td><td class="k">100 px</td></tr>
            <tr><td>Columnas</td><td class="k">12 · medianil 32 px</td></tr>
            <tr><td>Ancho útil</td><td class="k">1728 px</td></tr>
            <tr><td>Rejilla base</td><td class="k">8 px</td></tr>
          </table>
          <h4 style="margin-top:20rem;">Repartos</h4>
          <p style="font-size:17rem;"><b>7+5</b> y <b>5+7</b> texto e imagen · <b>6+6</b> comparativa ·
             <b>8+4</b> gráfico y lectura · <b>4+4+4</b> tres bloques · <b>12</b> a sangre.</p>
          <h4 style="margin-top:18rem;">Forma</h4>
          <p style="font-size:17rem;">Radio <b>0 px</b> en todo. Filete 1 px (2 px si la caja tiene
             peso propio). Sombra dura <span class="mono">14px 14px 0 #161616</span> solo en la caja
             de entregable.</p>
        </div>
        <div>
          <h4>Tipografía — Inter</h4>
          <table>
            <tr><th>Zona</th><th>px</th><th>pt</th><th>Peso</th></tr>
            <tr><td>Título portada</td><td class="k">128</td><td class="k">96</td><td>700</td></tr>
            <tr><td>Separador</td><td class="k">96</td><td class="k">72</td><td>700</td></tr>
            <tr><td>Manifiesto</td><td class="k">82</td><td class="k">62</td><td>700</td></tr>
            <tr><td>Título</td><td class="k">64</td><td class="k">48</td><td>700</td></tr>
            <tr><td>Título medio</td><td class="k">48</td><td class="k">36</td><td>700</td></tr>
            <tr><td>Cita</td><td class="k">52</td><td class="k">39</td><td>600</td></tr>
            <tr><td>Subtítulo</td><td class="k">36</td><td class="k">27</td><td>600</td></tr>
            <tr><td>Cuerpo</td><td class="k">28</td><td class="k">21</td><td>400</td></tr>
            <tr><td>Cuerpo 2</td><td class="k">24</td><td class="k">18</td><td>400</td></tr>
            <tr><td>Etiqueta</td><td class="k">18</td><td class="k">13</td><td>700</td></tr>
            <tr><td>Pie / fuente</td><td class="k">14</td><td class="k">10</td><td>500</td></tr>
            <tr><td>Cifra destacada</td><td class="k">200</td><td class="k">150</td><td>700</td></tr>
          </table>
          <p style="font-size:16rem;margin-top:10rem;">Titulares: tracking −0,03 em. Etiquetas: +0,16 em
             en mayúsculas. Cuerpo: 0. <b>Nada por debajo de 18 px / 14 pt.</b></p>
        </div>
        <div>
          <h4>Color</h4>
          <div style="display:flex;gap:8rem;margin-bottom:14rem;">
            <div style="flex:1;height:50rem;background:#161616;"></div>
            <div style="flex:1;height:50rem;background:#262626;"></div>
            <div style="flex:1;height:50rem;background:#525252;"></div>
            <div style="flex:1;height:50rem;background:#8d8d8d;"></div>
            <div style="flex:1;height:50rem;background:#e0e0e0;"></div>
            <div style="flex:1;height:50rem;background:#f4f4f4;border:1rem solid #e0e0e0;"></div>
          </div>
          <table>
            <tr><td>Tinta / texto</td><td class="k">#161616</td></tr>
            <tr><td>Superficie oscura</td><td class="k">#262626</td></tr>
            <tr><td>Texto secundario</td><td class="k">#525252</td></tr>
            <tr><td>Etiquetas, pies</td><td class="k">#6F6F6F · #8D8D8D</td></tr>
            <tr><td>Filetes</td><td class="k">#E0E0E0 · #C6C6C6</td></tr>
            <tr><td>Fondo de hueco</td><td class="k">#F4F4F4</td></tr>
          </table>
          <h4 style="margin-top:18rem;">Acento — uno por curso</h4>
          <div style="display:flex;gap:12rem;margin-bottom:10rem;">
            <div style="flex:1;"><div style="height:42rem;background:#5b4bf5;"></div>
              <p style="font-size:15rem;margin-top:6rem;"><b>Professional</b><br><span class="mono">#5B4BF5</span></p></div>
            <div style="flex:1;"><div style="height:42rem;background:#e4462f;"></div>
              <p style="font-size:15rem;margin-top:6rem;"><b>Founder</b><br><span class="mono">#E4462F</span></p></div>
          </div>
          <p style="font-size:16rem;">Solo en etiquetas, enlaces, llamadas sobre imagen, atribución de citas
             y la serie protagonista de un gráfico. <b>Nunca como fondo ni como color de titular.</b>
             Para texto pequeño en rojo, <span class="mono">#C3341F</span>.</p>
          <h4 style="margin-top:16rem;">Chrome fijo</h4>
          <p style="font-size:16rem;">Pie izquierda: lockup ΔX + <span class="mono">ACTIVEXREMOTE</span>, 28 px.
             Pie derecha: <span class="mono">MÓDULO NN · NN</span>. Se omite en A01–A04 y B08.</p>
        </div>
      </div>
    </div>'''
    return slide(b, extra_cls="doc", foot_right="HOJA TÉCNICA · 003")

# ══════════════════════════ SISTEMA DE MEDIOS ══════════════════════════
def p_media():
    b = '''<div class="canvas">
      <div class="doc-h"><span class="nm">Fotografía, vídeo, audio y enlaces</span><span class="kind">Sistema de medios</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:34rem;">
        <div>
          <h4>Fotografía</h4>
          <div class="ph foto" style="height:150rem;margin-bottom:14rem;"><span>Fotografía</span></div>
          <p style="font-size:17rem;">Real y propia siempre que se pueda. A sangre (<span class="mono">A02</span>,
             <span class="mono">A04</span>, <span class="mono">C03</span>) siempre con velo
             <span class="mono">rgba(0,0,0,.55)</span> y texto en blanco puro peso ≥ 600.</p>
          <ul>
            <li>Recorte 16:9, 4:3 o 1:1. Nunca deformada.</li>
            <li>Retratos: 1:1 o 3:4, mirada hacia dentro de la diapositiva.</li>
            <li>Sin filtros de color ni marcos redondeados.</li>
            <li>Crédito en 14 px cuando no es propia.</li>
            <li>Nada de stock de gente sonriendo con portátiles.</li>
          </ul>
        </div>
        <div>
          <h4>Capturas de pantalla</h4>
          <div class="ph" style="height:150rem;margin-bottom:14rem;"><span>Captura</span></div>
          <p style="font-size:17rem;">Del producto real, con datos coherentes y anonimizados.
             Filete de 1 px <span class="mono">#E0E0E0</span>, sin sombra ni marco de navegador falso.</p>
          <ul>
            <li>Recorta a lo que importa: si hay que hacer zoom, está mal.</li>
            <li>Para destacar: rectángulo de 2 px en el acento.</li>
            <li>Llamadas numeradas (<span class="mono">C08</span>), máximo 4.</li>
            <li>Nunca «Lorem ipsum» ni «John Doe» dentro de la captura.</li>
          </ul>
        </div>
        <div>
          <h4>Vídeo y audio</h4>
          <div class="ph vid" style="height:150rem;margin-bottom:14rem;"><div class="play" style="width:54rem;height:54rem;border-width:2rem;"></div></div>
          <p style="font-size:17rem;"><b>Incrustado, nunca enlazado</b>: un enlace externo rompe la clase
             si falla la red. Subtítulos siempre — la cohorte es internacional.</p>
          <ul>
            <li>Máx. 3 min sin pausa; si es más largo, córtalo.</li>
            <li>Cartela inicial con el logo en tinta sobre blanco.</li>
            <li>Bucles (<span class="mono">D05</span>): máx. 10 s y sin audio.</li>
            <li>Audio (<span class="mono">D04</span>): siempre con transcripción visible.</li>
            <li>Duración escrita en pantalla antes de darle al play.</li>
          </ul>
        </div>
        <div>
          <h4>Enlaces y QR</h4>
          <div style="display:flex;gap:16rem;align-items:center;margin-bottom:14rem;height:150rem;">
            <div class="qr" style="width:150rem;height:150rem;">%s</div>
            <div class="link" style="font-size:17rem;"><b>→</b><span>lorem-ipsum.com</span></div>
          </div>
          <p style="font-size:17rem;">Toda URL se <b>escribe visible</b> y se acompaña de QR cuando el alumno
             deba abrirla en el momento.</p>
          <ul>
            <li>Nada de acortadores ni de parámetros de seguimiento.</li>
            <li>QR mínimo 150 px de lado en pantalla.</li>
            <li>El QR y la URL apuntan siempre al mismo sitio.</li>
            <li>Enlace en el acento con subrayado de 2 px, nunca en azul de sistema.</li>
            <li>Más de 6 enlaces: van al campus, no a la diapositiva.</li>
          </ul>
        </div>
      </div>
      <div class="box" style="margin-top:26rem;">
        <h4>Cómo se describe un medio cuando lo genera la IA</h4>
        <p style="font-size:17rem;">La IA no produce las imágenes: deja el hueco descrito para que el docente lo
           rellene. Formato esperado dentro de la zona correspondiente:
           <span class="mono">[FOTO: equipo trabajando desde un coworking en Lisboa]</span> ·
           <span class="mono">[CAPTURA: panel de Deel con un contrato de contractor]</span> ·
           <span class="mono">[VÍDEO: 02:15 — fragmento de entrevista con un hiring manager]</span> ·
           <span class="mono">[QR → activexremote.com/plantilla-banda-salarial]</span></p>
      </div>
    </div>''' % "".join('<i style="grid-area:%d/%d;"></i>' % (r+1, c+1)
                        for r, row in enumerate(__import__('layouts')._QR)
                        for c, v in enumerate(row) if v == "1")
    return slide(b, extra_cls="doc", foot_right="MEDIOS · 004")

# ══════════════════════════ ÍNDICES ══════════════════════════
def index_pages():
    fams = list(FAMILIES.items())
    half = 5                                   # primeras 5 familias en la página 5
    pages = []
    for n, (title, chunk) in enumerate([("A–E · Apertura, texto, imagen, vídeo y recursos", fams[:half]),
                                        ("F–I · Datos, estructura, personas y actividad", fams[half:])]):
        cols = ""
        for famname, items in chunk:
            def short(t, n=58):
                return t if len(t) <= n else t[:n].rsplit(" ", 1)[0] + "…"
            rows = "".join(
                '<tr><td class="k">%s</td><td style="color:#161616;font-weight:600;">%s</td>'
                '<td>%s</td><td class="k">%03d</td></tr>'
                % (l["code"], l["name"], short(l["purpose"]), page_of(L.index(l)))
                for l in items)
            cols += ('<div style="break-inside:avoid;margin-bottom:16rem;">'
                     '<h4 style="color:#161616;border-bottom:2rem solid #161616;padding-bottom:6rem;">%s</h4>'
                     '<table class="idx">%s</table></div>' % (famname, rows))
        extra = ""
        if n == 1:
            extra = ('<div class="box" style="padding:14rem 20rem;">'
                     '<h4 style="margin-bottom:6rem;">Secuencia de una sesión de 4 h</h4>'
                     '<p style="font-size:15.5rem;line-height:1.45;margin:0;">'
                     '<span class="mono">A01</span> portada → <span class="mono">A05</span> agenda → '
                     '<span class="mono">A06</span> objetivos → [<span class="mono">A03</span> separador + '
                     '8–12 de contenido + <span class="mono">I01</span> ejercicio] × 3 → '
                     '<span class="mono">I06</span> resumen → <span class="mono">I08</span> cierre. '
                     'Una diapositiva de respiro (<span class="mono">B08</span>, <span class="mono">F05</span>, '
                     '<span class="mono">H01</span> o <span class="mono">C03</span>) cada 5–6 de contenido; '
                     'no encadenes más de 3 layouts de la misma familia.</p></div>')
        b = ('<div class="canvas"><div class="doc-h"><span class="nm">Catálogo</span>'
             '<span class="kind">Índice · %s</span></div>'
             '<div style="column-count:2;column-gap:48rem;">%s</div>%s</div>' % (title, cols, extra))
        pages.append(slide(b, extra_cls="doc", foot_right="ÍNDICE · %03d" % (5+n)))
    return pages

# ══════════════════════════ ENSAMBLADO ══════════════════════════
out = io.StringIO()
out.write('<meta charset="utf-8"><title>ActiveXRemote · Plantillas de diapositiva</title>')
out.write('<style>%s\n%s</style>' % (FONTS, CSS))
out.write(p_cover()); out.write(p_howto()); out.write(p_spec()); out.write(p_media())
for p in index_pages(): out.write(p)
for i, l in enumerate(L):
    out.write(slide(l["body"], code=l["code"], dark=l["dark"],
                    show_foot=l["code"] not in ("A01", "A02", "A03", "A04", "B08")))
    out.write(ficha(l, page_of(i)))
open('plantillas.html', 'w').write(out.getvalue())
print("layouts:", len(L), "· familias:", len(FAMILIES), "· páginas:", FRONT + 2*len(L),
      "· bytes:", os.path.getsize('plantillas.html'))
