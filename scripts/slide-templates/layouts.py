# -*- coding: utf-8 -*-
# ══════════════════════════════════════════════════════════════════
#  Catálogo de layouts de diapositiva — ActiveXRemote
#  Fuente de verdad. Editar aquí y regenerar (ver README.md).
# ══════════════════════════════════════════════════════════════════
LT  = "Lorem ipsum dolor sit amet consectetur"
LT2 = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed"
LS  = "Lorem ipsum dolor sit amet"
LSS = "Lorem ipsum dolor"
LX  = "Lorem ipsum"
LB  = "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
LB2 = "Lorem ipsum dolor sit amet consectetur"
LP  = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
       "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud "
       "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
LP2 = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor "
       "incididunt ut labore et dolore magna aliqua.")
LP3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
LP4 = "Lorem ipsum dolor sit amet, consectetur adipiscing."
EB  = "LOREM IPSUM · DOLOR SIT"
URL = "lorem-ipsum.com/dolor-sit-amet"

# ── piezas reutilizables ─────────────────────────────────────────
def ph(label="Imagen", style="", kind=""):
    """Hueco de medio. kind: '', 'foto', 'video', 'embed', 'mapa'."""
    inner = '<span>%s</span>' % label
    cls = "ph"
    if kind == "video":
        inner = ('<div class="play"></div><span style="margin-top:18rem;">%s</span>' % label)
        cls = "ph vid"
    elif kind == "foto":
        cls = "ph foto"
    return '<div class="%s" style="%s">%s</div>' % (cls, style, inner)

_QR = ["111111101011111","100000100001000","101110100101110","101110101101110",
       "101110100001110","100000101001000","111111101011111","000000010100000",
       "110101101110110","001000100001001","111011011010111","000100010100010",
       "111111100110101","100000101011001","101110110011110"]
def qr(size=150):
    cells = ""
    for r, row in enumerate(_QR):
        for c, v in enumerate(row):
            if v == "1":
                cells += '<i style="grid-area:%d/%d;"></i>' % (r+1, c+1)
    return '<div class="qr" style="width:%drem;height:%drem;">%s</div>' % (size, size, cells)

def link(url=URL, big=False):
    return ('<div class="link%s"><b>→</b><span>%s</span></div>' % (" big" if big else "", url))

def head(eb, title, cls="h-sm", mb=34, dot=True, maxw=None, eb_cls=""):
    e = ('<div class="eb%s%s">%s</div>' % (" dot" if dot else "", (" "+eb_cls) if eb_cls else "", eb)) if eb else ""
    mw = ("max-width:%drem;" % maxw) if maxw else ""
    return '%s<div class="%s" style="margin:%drem 0 %drem;%s">%s</div>' % (
        e, cls, 18 if eb else 0, mb, mw, title)

def bullets(n=4, cls="sl", txt=None):
    txt = txt or LB
    return '<ul class="%s">%s</ul>' % (cls, "".join(
        '<li><b>%02d</b><span>%s</span></li>' % (i+1, txt) for i in range(n)))

def dashes(n=3, size=22, mb=12):
    return "".join('<div class="bd2" style="display:flex;gap:14rem;margin-bottom:%drem;font-size:%drem;">'
                   '<b style="color:currentColor;flex:none;">—</b><span>%s</span></div>' % (mb, size, LB)
                   for _ in range(n))

def table(rows=4, cols=3, first_bold=True):
    heads = ["LOREM", "IPSUM", "DOLOR", "SIT AMET", "CONSECTETUR"]
    h = "".join('<th>%s</th>' % heads[c] for c in range(cols))
    b = ""
    for r in range(rows):
        b += "<tr>" + "".join('<td>%s</td>' % (LSS if (c == 0 and first_bold) else LS)
                              for c in range(cols)) + "</tr>"
    return '<table class="sl"><tr>%s</tr>%s</table>' % (h, b)

def steps(n=4, label="PASO", acc="var(--acc)"):
    return "".join(
        '<div class="step" style="border-top:2rem solid #161616;padding-top:20rem;">'
        '<div class="n" style="color:%s;">%s %02d</div><div class="t">%s</div>'
        '<div class="d">%s</div></div>' % (acc, label, i+1, LSS.title(), LP4)
        for i in range(n))

def cards(n=3, label="IDEA", pad=30, body=True):
    return "".join(
        '<div class="card" style="padding:%drem;height:100%%;">'
        '<div style="font-size:19rem;font-weight:700;letter-spacing:.14em;color:#8d8d8d;">%s %02d</div>'
        '<div style="font-size:29rem;font-weight:700;letter-spacing:-.01em;margin:14rem 0;">%s</div>'
        '%s</div>' % (pad, label, i+1, LSS.title(),
                      '<div style="font-size:20rem;line-height:1.45;color:#525252;">%s</div>' % LP4 if body else "")
        for i in range(n))

L = []
def add(**k): L.append(k)

# ══════════════════════════════════════════════════════════════════
#  A · APERTURA Y NAVEGACIÓN
# ══════════════════════════════════════════════════════════════════
add(code="A01", name="Portada de módulo", family="Apertura", dark=True,
 purpose="Primera diapositiva de cada sesión. Identifica módulo, camino, docente y fecha.",
 zones=[("etiqueta","40 car.","Módulo NN · nombre del camino"),
        ("titulo","60 car. · 2 líneas","Afirmación, no etiqueta"),
        ("creditos","70 car.","Docente · fecha · duración")],
 use=["Abrir cada módulo o cada hora de clase."],
 avoid=["Poner aquí el índice o los objetivos: eso es A05 y A06."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:flex-end;">
   <div class="eb" style="margin-bottom:24rem;">%s</div>
   <div class="h-cover" style="max-width:1500rem;">%s</div>
   <div class="bd" style="margin-top:34rem;font-size:24rem;">Lorem Ipsum · lorem ipsum dolor · lorem ipsum</div>
 </div>''' % (EB, LT))

add(code="A02", name="Portada con fotografía", family="Apertura", dark=True, bleed=True,
 purpose="Portada de alto impacto para sesiones abiertas, webinars o bienvenida de cohorte.",
 zones=[("foto","—","A sangre, con velo oscuro rgba(0,0,0,.55)"),
        ("etiqueta","40 car.",""),("titulo","55 car. · 2 líneas",""),("creditos","70 car.","")],
 use=["Sesiones con público externo. Primera sesión de la cohorte."],
 avoid=["Fotos de stock genéricas. Texto sobre la zona más clara de la foto."],
 body='''<div class="bleed">%s<div class="veil"></div></div>
 <div class="canvas" style="display:flex;flex-direction:column;justify-content:flex-end;">
   <div class="eb" style="margin-bottom:22rem;">%s</div>
   <div class="h-sect" style="max-width:1400rem;">%s</div>
   <div class="bd" style="margin-top:28rem;font-size:24rem;">Lorem Ipsum · lorem ipsum dolor</div>
 </div>''' % (ph("Fotografía a sangre", "position:absolute;inset:0;border:0;", "foto"), EB, LT))

add(code="A03", name="Separador de bloque", family="Apertura", dark=True,
 purpose="Marca el cambio de tema dentro de la sesión. Da respiro.",
 zones=[("numero","2 car.","Número de bloque, 01–09"),
        ("titulo","40 car. · 2 líneas","Nombre del bloque")],
 use=["Cada 8–12 diapositivas de contenido."],
 avoid=["Usarlo como portada. Meter texto de cuerpo."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:center;">
   <div style="font-size:120rem;font-weight:700;letter-spacing:-.04em;line-height:1;opacity:.35;">01</div>
   <div class="h-sect" style="margin-top:8rem;max-width:1200rem;">%s</div>
   <div style="width:120rem;height:3rem;background:#fff;margin-top:40rem;"></div>
 </div>''' % LSS.title())

add(code="A04", name="Separador con fotografía", family="Apertura", dark=True, bleed=True,
 purpose="Separador cuando el bloque tiene una imagen que lo representa.",
 zones=[("foto","—","A sangre, velo oscuro"),("numero","2 car.",""),("titulo","40 car.","")],
 use=["Bloques temáticos con identidad visual propia (un país, una herramienta, un caso)."],
 avoid=["Alternarlo con A03 sin criterio: elige uno de los dos por sesión."],
 body='''<div class="bleed">%s<div class="veil"></div></div>
 <div class="canvas" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
   <div style="font-size:100rem;font-weight:700;letter-spacing:-.04em;line-height:1;opacity:.5;">02</div>
   <div class="h-sect" style="margin-top:10rem;max-width:1300rem;">%s</div>
 </div>''' % (ph("Fotografía a sangre", "position:absolute;inset:0;border:0;", "foto"), LSS.title()))

add(code="A05", name="Agenda / índice", family="Apertura", dark=False,
 purpose="Qué se va a ver en la sesión. Lista numerada corta.",
 zones=[("etiqueta","20 car.","«Hoy» o «Agenda»"),("titulo","50 car.","Afirmación sobre lo que se llevan"),
        ("item_1..5","60 car. c/u","Máximo 5, una línea cada uno")],
 use=["Segunda diapositiva de la sesión."],
 avoid=["Más de 5 puntos. Sub-niveles."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s%s
 </div>''' % (head("LOREM", LT, "h", 34, maxw=1200), bullets(5, "sl spread")))

add(code="A06", name="Objetivos de aprendizaje", family="Apertura", dark=False,
 purpose="Qué sabrá hacer el alumno al terminar. Verbo de acción por objetivo.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("objetivo_1..4","80 car. c/u","Empiezan por verbo en infinitivo")],
 use=["Después de la agenda, o al abrir un bloque largo."],
 avoid=["Verbos vagos: «conocer», «entender». Mejor «montar», «calcular», «negociar»."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="two" style="gap:40rem 70rem;flex:1;align-content:stretch;">%s</div>
 </div>''' % (head("LOREM IPSUM", LT, "h", 40),
   "".join('<div class="step" style="border-top:2rem solid #161616;padding-top:18rem;">'
           '<div class="n">OBJETIVO %02d</div><div class="d" style="font-size:24rem;">%s</div></div>'
           % (i+1, LB) for i in range(4))))

add(code="A07", name="Mapa del curso", family="Apertura", dark=False,
 purpose="Dónde estamos dentro del programa. Orienta en sesiones largas.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("hito_1..7","18 car. c/u","Nombre corto de cada módulo"),
        ("actual","1 car.","Cuál de los hitos está activo")],
 use=["Al abrir la sesión y al volver de una pausa larga."],
 avoid=["Listar los 14 módulos: agrupa en 5–7 hitos."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
     <div class="track">%s</div>
   </div>
 </div>''' % (head("LOREM IPSUM", LT, "h-sm", 30),
   "".join('<div class="node%s"><i></i><span>%s</span></div>' % (" on" if i == 2 else "", LX)
           for i in range(7))))

# ══════════════════════════════════════════════════════════════════
#  B · TEXTO Y EXPLICACIÓN
# ══════════════════════════════════════════════════════════════════
add(code="B01", name="Título + texto", family="Texto", dark=False,
 purpose="La explicación más simple: una idea desarrollada en un párrafo.",
 zones=[("etiqueta","30 car.",""),("titulo","60 car. · 2 líneas",""),
        ("texto","320 car. · máx. 4 líneas","Medida máxima 60–68 caracteres")],
 use=["Introducir un concepto antes de desglosarlo."],
 avoid=["Meter aquí una lista disfrazada de párrafo: usa B02."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:center;">
   %s<div class="bd" style="max-width:1150rem;">%s</div>
 </div>''' % (head("LOREM", LT, "h", 30, maxw=1400), LP))

add(code="B02", name="Viñetas", family="Texto", dark=False,
 purpose="Lista de puntos paralelos. El formato más frecuente del temario.",
 zones=[("etiqueta","30 car.",""),("titulo","60 car.",""),
        ("vineta_1..5","70 car. c/u","Máximo 5, una línea cada una")],
 use=["Criterios, requisitos, errores comunes, pasos no secuenciales."],
 avoid=["Más de 5 viñetas. Viñetas de más de una línea. Sub-viñetas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s%s
 </div>''' % (head("LOREM IPSUM", LT, "h", 34, maxw=1300), bullets(5, "sl spread")))

add(code="B03", name="Viñetas en dos columnas", family="Texto", dark=False,
 purpose="Lista larga que no cabe en cinco puntos: hasta 8, repartidos en dos columnas.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),
        ("vineta_1..8","50 car. c/u","Se leen en Z: 1–4 izquierda, 5–8 derecha")],
 use=["Listados de herramientas, países, documentos, requisitos legales."],
 avoid=["Más de 8. Si necesitas más, es una tabla (F01) o dos diapositivas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="two" style="gap:70rem;flex:1;">
     %s%s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   '<ul class="sl spread">%s</ul>' % "".join('<li><b>%02d</b><span>%s</span></li>' % (i+1, LB2) for i in range(4)),
   '<ul class="sl spread">%s</ul>' % "".join('<li><b>%02d</b><span>%s</span></li>' % (i+5, LB2) for i in range(4))))

add(code="B04", name="Dos columnas de texto", family="Texto", dark=False,
 purpose="Dos ideas paralelas del mismo peso, una a cada lado.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),
        ("izq_titulo","30 car.",""),("izq_texto","240 car.",""),
        ("der_titulo","30 car.",""),("der_texto","240 car.","")],
 use=["Teoría vs práctica · qué sí / qué no · dos enfoques."],
 avoid=["Columnas de longitud muy distinta. Tres columnas: usa B05."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="two" style="gap:70rem;flex:1;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h", 40, maxw=1300),
   ('<div><div style="height:2rem;background:#161616;margin-bottom:20rem;"></div>'
    '<div style="font-size:32rem;font-weight:600;letter-spacing:-.01em;margin-bottom:16rem;">%s</div>'
    '<div class="bd2">%s</div></div>' % (LSS.title(), LP2)) * 2))

add(code="B05", name="Tres columnas de texto", family="Texto", dark=False,
 purpose="Tres ideas hermanas. El máximo antes de que el texto sea ilegible.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("col_1..3 titulo","24 car. c/u",""),("col_1..3 texto","160 car. c/u","")],
 use=["Tres pilares, tres perfiles, tres modelos de contratación."],
 avoid=["Cuatro columnas de texto: pasa a B03 o a dos diapositivas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="three" style="gap:56rem;flex:1;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 40),
   ('<div><div style="height:2rem;background:#161616;margin-bottom:20rem;"></div>'
    '<div style="font-size:28rem;font-weight:700;letter-spacing:-.01em;margin-bottom:14rem;">%s</div>'
    '<div class="bd2" style="font-size:21rem;">%s</div></div>' % (LSS.title(), LP3)) * 3))

add(code="B06", name="Definición / concepto clave", family="Texto", dark=False,
 purpose="Fijar un término del oficio. Palabra grande, definición debajo.",
 zones=[("etiqueta","20 car.","«Concepto» o «Definición»"),("termino","28 car.","El término, en grande"),
        ("definicion","200 car.",""),("ejemplo","120 car.","Opcional, en caja gris")],
 use=["Anglicismos y tecnicismos la primera vez que aparecen."],
 avoid=["Definir tres términos en la misma diapositiva."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:70rem;align-items:center;">
   <div>
     <div class="eb dot">DEFINICIÓN</div>
     <div style="font-size:76rem;font-weight:700;letter-spacing:-.03em;line-height:1.05;margin:20rem 0 24rem;">%s</div>
     <div class="bd">%s</div>
   </div>
   <div class="fillbox"><div class="eb" style="margin-bottom:14rem;">EJEMPLO</div>
     <div class="bd2">%s</div></div>
 </div>''' % (LSS.title(), LP2, LP3))

add(code="B07", name="Texto + nota lateral", family="Texto", dark=False,
 purpose="Explicación principal con un aviso, matiz o dato al margen.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),("texto","300 car.",""),
        ("nota_titulo","24 car.","«Ojo», «Atención», «Truco»"),("nota_texto","160 car.","")],
 use=["Advertencias legales o fiscales. Excepciones a la regla."],
 avoid=["Usar la nota para contenido principal: si es importante, va en el cuerpo."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:64rem;">
   <div>%s<div class="bd">%s</div></div>
   <div style="display:flex;align-items:center;">
     <div class="note"><div class="eb acc" style="margin-bottom:14rem;">OJO</div>
       <div class="bd2">%s</div></div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 28), LP, LP2))

add(code="B08", name="Frase manifiesto", family="Texto", dark=True,
 purpose="Una sola frase a pantalla completa. Corta el ritmo y fija una idea.",
 zones=[("frase","90 car. · 2 líneas","Sin comillas: no es una cita, es una afirmación")],
 use=["Abrir o cerrar un bloque con fuerza."],
 avoid=["Más de 90 caracteres. Usarla más de dos veces por sesión."],
 body='''<div class="canvas" style="display:flex;align-items:center;">
   <div style="font-size:82rem;font-weight:700;letter-spacing:-.035em;line-height:1.08;max-width:1500rem;">%s</div>
 </div>''' % LT)

add(code="B09", name="Pregunta detonante", family="Texto", dark=False,
 purpose="Lanzar una pregunta al aula antes de dar la respuesta.",
 zones=[("etiqueta","24 car.","«Pregunta» o «Para pensar»"),
        ("pregunta","90 car. · 2 líneas","Termina en ?"),
        ("pista","110 car.","Opcional")],
 use=["Antes de un concepto contraintuitivo. Abrir debate."],
 avoid=["Preguntas retóricas sin respuesta posterior."],
 body='''<div class="canvas dotsl-bg" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
   <div class="eb dot" style="margin-bottom:26rem;">PREGUNTA</div>
   <div style="font-size:60rem;font-weight:700;letter-spacing:-.03em;line-height:1.1;max-width:1350rem;">%s</div>
   <div class="bd2" style="margin-top:30rem;max-width:900rem;">%s</div>
 </div>''' % (LT + "?", LP3))

# ══════════════════════════════════════════════════════════════════
#  C · IMAGEN Y FOTOGRAFÍA
# ══════════════════════════════════════════════════════════════════
add(code="C01", name="Texto + imagen (7+5)", family="Imagen", dark=False,
 purpose="Explicación a la izquierda, captura o diagrama a la derecha. El caballo de batalla.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car. · 2 líneas",""),("texto","220 car.",""),
        ("vineta_1..3","55 car. c/u","Opcionales"),
        ("imagen","—","Captura real, filete 1 px, sin sombra"),("pie_imagen","60 car.","Opcional")],
 use=["Mostrar una herramienta mientras se explica. Walkthroughs."],
 avoid=["Imágenes decorativas sin información."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:64rem;">
   <div style="display:flex;flex-direction:column;">
     %s<div class="bd2" style="margin-bottom:26rem;">%s</div>%s
   </div>
   <div style="display:flex;flex-direction:column;gap:14rem;">
     %s<div class="src">Lorem ipsum · pie de imagen</div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 26), LP2, dashes(3),
   ph("Imagen / captura", "flex:1;")))

add(code="C02", name="Imagen + texto (5+7)", family="Imagen", dark=False,
 purpose="La misma composición invertida. Alterna con C01 para no repetir ritmo.",
 zones=[("imagen","—",""),("pie_imagen","60 car.","Opcional"),
        ("etiqueta","30 car.",""),("titulo","55 car.",""),("texto","260 car.",""),("vineta_1..3","55 car. c/u","")],
 use=["Cuando la imagen es lo primero que hay que mirar."],
 avoid=["Alternar sin criterio en cada diapositiva: marea."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:5fr 7fr;gap:64rem;">
   <div style="display:flex;flex-direction:column;gap:14rem;">
     %s<div class="src">Lorem ipsum · pie de imagen</div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;">
     %s<div class="bd2" style="margin-bottom:26rem;">%s</div>%s
   </div>
 </div>''' % (ph("Imagen / captura", "flex:1;"), head("LOREM", LT, "h-sm", 26), LP2, dashes(3)))

add(code="C03", name="Foto a sangre con texto", family="Imagen", dark=True, bleed=True,
 purpose="Fotografía que ocupa toda la diapositiva con un titular encima.",
 zones=[("foto","—","A sangre, velo rgba(0,0,0,.5)"),
        ("etiqueta","30 car.",""),("titulo","70 car. · 2 líneas",""),("pie","70 car.","Fuente o crédito")],
 use=["Contexto emocional: un país, un espacio de trabajo, un evento."],
 avoid=["Texto sobre la zona clara de la foto. Fotos con marca de agua."],
 body='''<div class="bleed">%s<div class="veil"></div></div>
 <div class="canvas" style="display:flex;flex-direction:column;justify-content:flex-end;">
   <div class="eb" style="margin-bottom:20rem;">%s</div>
   <div class="h" style="max-width:1350rem;">%s</div>
   <div class="src" style="color:rgba(255,255,255,.6);margin-top:22rem;">Crédito · lorem ipsum</div>
 </div>''' % (ph("Fotografía a sangre", "position:absolute;inset:0;border:0;", "foto"), EB, LT))

add(code="C04", name="Imagen a pantalla completa", family="Imagen", dark=False,
 purpose="Una captura o diagrama que necesita todo el ancho, dentro de la zona segura.",
 zones=[("titulo","50 car.","Sobre la imagen"),("imagen","—",""),("pie_imagen","90 car.","Fuente o explicación")],
 use=["Pantallazos densos: dashboards, hojas de cálculo, flujos."],
 avoid=["Imágenes que necesiten zoom para leerse: recórtalas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;gap:20rem;">
   <div style="display:flex;justify-content:space-between;align-items:baseline;">
     <div class="h-sm" style="font-size:40rem;">%s</div>
     <div class="src">Lorem ipsum · fuente</div>
   </div>
   %s
 </div>''' % (LSS.title(), ph("Imagen / captura a pantalla completa", "flex:1;")))

add(code="C05", name="Galería de tres", family="Imagen", dark=False,
 purpose="Tres imágenes comparables, cada una con su pie.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("imagen_1..3","—",""),("pie_1..3","45 car. c/u","")],
 use=["Tres ejemplos de lo mismo: tres portfolios, tres CV, tres perfiles."],
 avoid=["Imágenes de proporciones distintas: recorta todas a 4:3."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="three" style="gap:36rem;flex:1;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 32),
   ('<div style="display:flex;flex-direction:column;gap:12rem;">%s'
    '<div class="src" style="text-transform:none;letter-spacing:0;font-size:17rem;">%s</div></div>'
    % (ph("Imagen", "flex:1;"), LS)) * 3))

add(code="C06", name="Mosaico de cuatro", family="Imagen", dark=False,
 purpose="Cuatro imágenes en rejilla 2×2 con una idea al lado.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),("texto","180 car.",""),
        ("imagen_1..4","—","")],
 use=["Mostrar variedad: herramientas, países, formatos de contenido."],
 avoid=["Rellenar con imágenes que no aportan solo para completar la rejilla."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:4fr 8fr;gap:56rem;">
   <div style="display:flex;flex-direction:column;justify-content:center;">
     %s<div class="bd2">%s</div>
   </div>
   <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:24rem;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 24), LP2, ph("Imagen", "") * 4))

add(code="C07", name="Antes / después", family="Imagen", dark=False,
 purpose="Dos imágenes enfrentadas que muestran una transformación.",
 zones=[("titulo","50 car.",""),("antes_etiqueta","12 car.","«Antes»"),("antes_imagen","—",""),
        ("antes_pie","60 car.",""),("despues_etiqueta","12 car.","«Después»"),
        ("despues_imagen","—",""),("despues_pie","60 car.","")],
 use=["CV, perfil de LinkedIn, propuesta comercial, web antes y después."],
 avoid=["Un «después» exagerado o inventado: pierde credibilidad."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="h-sm" style="margin-bottom:30rem;">%s</div>
   <div class="two" style="gap:44rem;flex:1;">
     <div style="display:flex;flex-direction:column;gap:14rem;">
       <div class="eb">ANTES</div>%s<div class="src" style="text-transform:none;letter-spacing:0;font-size:17rem;">%s</div></div>
     <div style="display:flex;flex-direction:column;gap:14rem;">
       <div class="eb acc">DESPUÉS</div>%s<div class="src" style="text-transform:none;letter-spacing:0;font-size:17rem;">%s</div></div>
   </div>
 </div>''' % (LT, ph("Imagen «antes»", "flex:1;"), LS, ph("Imagen «después»", "flex:1;"), LS))

add(code="C08", name="Captura anotada", family="Imagen", dark=False,
 purpose="Una captura con llamadas numeradas y su leyenda al lado.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),("imagen","—","Con rectángulos de 2 px en el acento"),
        ("nota_1..4","70 car. c/u","Numeradas, coinciden con las llamadas de la imagen")],
 use=["Walkthroughs de herramientas. Explicar una interfaz paso a paso."],
 avoid=["Más de 4 llamadas. Flechas a mano alzada."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:8fr 4fr;gap:52rem;">
   <div style="display:flex;flex-direction:column;">
     %s
     <div style="flex:1;position:relative;">
       %s
       <div class="callout" style="left:12%%;top:18%%;">1</div>
       <div class="callout" style="left:56%%;top:34%%;">2</div>
       <div class="callout" style="left:28%%;top:66%%;">3</div>
     </div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;gap:22rem;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 24),
   ph("Captura anotada", "position:absolute;inset:0;"),
   "".join('<div style="display:flex;gap:16rem;align-items:flex-start;">'
           '<div class="callout stat">%d</div><div class="bd2" style="font-size:20rem;">%s</div></div>'
           % (i+1, LB) for i in range(3))))

# ══════════════════════════════════════════════════════════════════
#  D · VÍDEO Y MULTIMEDIA
# ══════════════════════════════════════════════════════════════════
add(code="D01", name="Vídeo a pantalla completa", family="Vídeo", dark=False,
 purpose="Reproducir un vídeo como contenido principal de la diapositiva.",
 zones=[("titulo","45 car.",""),("video","—","Incrustado, nunca enlazado. Con subtítulos"),
        ("duracion","10 car.","mm:ss"),("fuente","60 car.","")],
 use=["Fragmentos de entrevista, demos grabadas, casos de alumnos."],
 avoid=["Vídeos de más de 3 min sin pausa. Vídeo sin subtítulos."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;gap:18rem;">
   <div style="display:flex;justify-content:space-between;align-items:baseline;">
     <div class="h-sm" style="font-size:40rem;">%s</div>
     <div class="src">Vídeo · 00:00 · lorem ipsum</div>
   </div>
   %s
 </div>''' % (LSS.title(), ph("Vídeo incrustado · 16:9 · con subtítulos", "flex:1;", "video")))

add(code="D02", name="Vídeo + puntos clave", family="Vídeo", dark=False,
 purpose="Vídeo a un lado y qué hay que observar en él al otro.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),("video","—",""),("duracion","10 car.",""),
        ("punto_1..4","60 car. c/u","Qué mirar mientras se reproduce")],
 use=["Vídeos de análisis: una negociación, una llamada de ventas, una demo."],
 avoid=["Poner los puntos después del vídeo: el alumno debe saber qué mirar antes."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:56rem;">
   <div style="display:flex;flex-direction:column;gap:14rem;">
     %s<div class="src">Vídeo · 00:00</div>
   </div>
   <div style="display:flex;flex-direction:column;">
     %s<div style="flex:1;">%s</div>
   </div>
 </div>''' % (ph("Vídeo incrustado", "flex:1;", "video"), head("QUÉ MIRAR", LT, "h-sm", 24),
   bullets(4, "sl spread", LB2)))

add(code="D03", name="Demo en vivo", family="Vídeo", dark=False,
 purpose="Marcador de pantalla compartida: el docente sale del deck y enseña la herramienta.",
 zones=[("etiqueta","20 car.","«Demo en vivo»"),("titulo","45 car.",""),
        ("herramienta","24 car.","Qué se va a abrir"),("paso_1..4","60 car. c/u","Guion de la demo"),
        ("plan_b","80 car.","Qué hacer si falla la conexión")],
 use=["Antes de compartir pantalla. Deja el guion visible para el alumno."],
 avoid=["Demo sin guion escrito: si algo falla, se pierde la clase."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:6fr 6fr;gap:56rem;">
   <div style="display:flex;flex-direction:column;">
     <div class="tagsolid">Demo en vivo</div>
     <div class="h-sm" style="margin:24rem 0 24rem;">%s</div>
     <div style="flex:1;">%s</div>
   </div>
   <div style="display:flex;flex-direction:column;gap:20rem;">
     %s
     <div class="note"><div class="eb acc" style="margin-bottom:12rem;">PLAN B</div>
       <div class="bd2" style="font-size:20rem;">%s</div></div>
   </div>
 </div>''' % (LT, bullets(4, "sl spread", LB2),
   ph("Pantalla compartida", "flex:1;"), LP3))

add(code="D04", name="Audio / entrevista", family="Vídeo", dark=False,
 purpose="Fragmento de audio o podcast con su transcripción destacada.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),("audio","—","Reproductor incrustado"),
        ("duracion","10 car.",""),("cita_transcrita","160 car.",""),("quien","40 car.","")],
 use=["Entrevistas a empleadores, clientes o exalumnos."],
 avoid=["Audio sin transcripción: rompe la accesibilidad."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:center;gap:40rem;">
   %s
   <div class="player">%s<div class="wave">%s</div><span class="src">00:00 / 00:00</span></div>
   <div style="font-size:36rem;font-weight:600;letter-spacing:-.01em;line-height:1.3;max-width:1400rem;">«%s»</div>
   <div class="eb acc">Lorem Ipsum · lorem ipsum dolor</div>
 </div>''' % (head("LOREM", LT, "h-sm", 0),
   '<div class="play sm"></div>',
   "".join('<i style="height:%drem;"></i>' % h for h in
           [14,26,38,22,46,30,18,42,26,34,20,48,28,16,36,24,40,22,30,18,44,26,32,20,38,
            24,16,42,28,34,22,46,30,18,36,26,40,20,32,24]), LP2))

add(code="D05", name="Bucle / GIF + explicación", family="Vídeo", dark=False,
 purpose="Vídeo corto en bucle sin sonido que muestra una interacción, con el texto al lado.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),("texto","220 car.",""),
        ("loop","—","Máx. 10 s, sin audio, en bucle"),("pie","50 car.","")],
 use=["Enseñar un clic, un atajo, una automatización que ocurre en segundos."],
 avoid=["Bucles largos: distraen mientras hablas."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:5fr 7fr;gap:60rem;align-items:center;">
   <div>%s<div class="bd2">%s</div></div>
   <div style="display:flex;flex-direction:column;gap:14rem;">
     %s<div class="src">Bucle · sin audio · 00:08</div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 24), LP2,
   ph("Bucle / GIF", "height:620rem;", "video")))

# ══════════════════════════════════════════════════════════════════
#  E · ENLACES Y RECURSOS
# ══════════════════════════════════════════════════════════════════
add(code="E01", name="Recurso destacado", family="Recursos", dark=False,
 purpose="Un único enlace importante, con QR para abrirlo desde el móvil.",
 zones=[("etiqueta","24 car.","«Recurso» o «Enlace»"),("titulo","45 car.",""),("texto","180 car.",""),
        ("url","60 car.","Visible y escrita, no acortada"),("qr","—","Apunta a la misma URL")],
 use=["Plantillas, calculadoras, formularios, comunidades."],
 avoid=["URLs acortadas o con parámetros de seguimiento larguísimos."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:70rem;align-items:center;">
   <div>%s<div class="bd" style="margin-bottom:34rem;">%s</div>%s</div>
   <div style="display:flex;flex-direction:column;align-items:center;gap:18rem;">
     %s<div class="src">Escanea para abrirlo</div>
   </div>
 </div>''' % (head("RECURSO", LT, "h-sm", 26), LP2, link(URL, True), qr(260)))

add(code="E02", name="Lista de recursos", family="Recursos", dark=False,
 purpose="Cuatro a seis enlaces agrupados, cada uno con su para qué.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("recurso_1..6 nombre","30 car. c/u",""),("recurso_1..6 url","45 car. c/u",""),
        ("recurso_1..6 para_que","55 car. c/u","")],
 use=["Cierre de bloque: todo lo que se ha mencionado, junto."],
 avoid=["Más de 6 enlaces en pantalla: pasa la lista al campus."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="two" style="gap:24rem 56rem;flex:1;align-content:stretch;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   "".join('<div class="reslink"><div class="t">%s</div><div class="u">%s</div>'
           '<div class="d">%s</div></div>' % (LSS.title(), URL, LB2) for _ in range(6))))

add(code="E03", name="Descarga de plantilla", family="Recursos", dark=True,
 purpose="Entregar un archivo: plantilla, checklist, hoja de cálculo.",
 zones=[("etiqueta","24 car.","«Descarga»"),("titulo","45 car.",""),("que_incluye_1..3","50 car. c/u",""),
        ("url","60 car.",""),("qr","—",""),("formato","24 car.","Notion · Sheets · PDF")],
 use=["Cada entregable del curso tiene su plantilla."],
 avoid=["Plantillas sin ejemplo relleno: el alumno se queda en blanco."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:70rem;align-items:center;">
   <div>
     <div class="eb">DESCARGA · LOREM IPSUM</div>
     <div class="h" style="margin:20rem 0 30rem;">%s</div>
     <div style="color:rgba(255,255,255,.85);">%s</div>
     <div style="margin-top:30rem;">%s</div>
   </div>
   <div style="display:flex;flex-direction:column;align-items:center;gap:18rem;">
     <div class="qrbox">%s</div><div class="src" style="color:rgba(255,255,255,.6);">Escanea para descargar</div>
   </div>
 </div>''' % (LT, dashes(3, 22), link(URL, True), qr(240)))

add(code="E04", name="Herramienta del stack", family="Recursos", dark=False,
 purpose="Presentar una herramienta: qué es, para qué la usamos y dónde está.",
 zones=[("logo","—","Logo monocromo de public/logos/tools/"),("nombre","24 car.",""),
        ("categoria","30 car.",""),("texto","200 car.",""),("uso_1..3","55 car. c/u",""),
        ("url","45 car.",""),("captura","—","Pantalla real de la herramienta")],
 use=["Notion, Slack, Wise, Deel, Zapier, LLMs…"],
 avoid=["Logos a color mezclados con monocromos. Tutoriales completos: eso es C01 en serie."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:5fr 7fr;gap:60rem;">
   <div style="display:flex;flex-direction:column;justify-content:center;">
     <div class="logobox"><span class="src" style="font-size:13rem;">LOGO</span></div>
     <div class="eb" style="margin:24rem 0 12rem;">Lorem · categoría</div>
     <div class="h-sm" style="font-size:44rem;margin-bottom:20rem;">%s</div>
     <div class="bd2" style="margin-bottom:22rem;">%s</div>
     %s
     <div style="margin-top:22rem;">%s</div>
   </div>
   %s
 </div>''' % (LSS.title(), LP2, dashes(3, 21), link(), ph("Captura de la herramienta", "height:100%;")))

add(code="E05", name="Stack completo", family="Recursos", dark=False,
 purpose="Rejilla de logos: todo el stack del módulo de un vistazo.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),("texto","160 car.",""),
        ("logo_1..10","—","Todos monocromos, misma altura óptica"),("pie_logo_1..10","16 car. c/u","")],
 use=["Abrir o cerrar un módulo de herramientas."],
 avoid=["Mezclar logos a color y monocromos. Alturas ópticas distintas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s<div class="bd2" style="max-width:1100rem;margin-bottom:34rem;">%s</div>
   <div style="flex:1;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:1fr 1fr;gap:22rem;">
     %s
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 20), LP3,
   ('<div class="logocell"><span class="src" style="font-size:13rem;">LOGO</span>'
    '<div class="src" style="font-size:12rem;">%s</div></div>' % LX) * 10))

# ══════════════════════════════════════════════════════════════════
#  F · DATOS
# ══════════════════════════════════════════════════════════════════
add(code="F01", name="Tabla", family="Datos", dark=False,
 purpose="Datos comparables en filas y columnas.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),("cabecera_1..4","18 car. c/u","Mayúsculas"),
        ("celda","28 car. c/u","Máx. 6 filas × 4 columnas"),("fuente","70 car.","Obligatoria")],
 use=["Comparar herramientas, países, modelos de contratación, precios."],
 avoid=["Más de 6 filas o 4 columnas. Sombreado alterno. Bordes verticales."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s<div style="flex:1;">%s</div>
   <div class="src" style="margin-top:24rem;">Fuente · lorem ipsum dolor sit amet, 2026</div>
 </div>''' % (head("LOREM", LT, "h-sm", 30), table(5, 4)))

add(code="F02", name="Tabla de decisión", family="Datos", dark=False,
 purpose="Comparativa con marcas de sí / no en vez de texto.",
 zones=[("titulo","50 car.",""),("criterio_1..5","34 car. c/u","Filas"),
        ("opcion_1..3","18 car. c/u","Columnas"),("valor","✓ / — / texto de 12 car.","")],
 use=["Elegir entre herramientas, tipos de contrato, países de residencia."],
 avoid=["Marcar con solo color: el ✓ y el — deben ser caracteres."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="h-sm" style="margin-bottom:30rem;">%s</div>
   <div style="flex:1;"><table class="sl dec"><tr><th></th><th>LOREM</th><th>IPSUM</th><th>DOLOR</th></tr>%s</table></div>
   <div class="src" style="margin-top:20rem;">Fuente · lorem ipsum, 2026</div>
 </div>''' % (LT, "".join(
   '<tr><td>%s</td><td class="c">✓</td><td class="c mut">—</td><td class="c">✓</td></tr>' % LSS
   for _ in range(5))))

add(code="F03", name="Gráfico de barras", family="Datos", dark=False,
 purpose="Una serie de datos con su lectura escrita al lado.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),("grafico","—","Barras en tinta; la protagonista en el acento"),
        ("etiqueta_eje_1..6","10 car. c/u",""),("lectura","180 car.","Qué hay que ver"),("fuente","70 car.","Obligatoria")],
 use=["Salarios por país, evolución de ofertas, reparto de mercado."],
 avoid=["3D, sombras, ejes sin etiquetar, leyendas que solo se distinguen por color."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:8fr 4fr;gap:60rem;">
   <div style="display:flex;flex-direction:column;">
     %s
     <div style="flex:1;display:flex;align-items:flex-end;gap:26rem;border-bottom:2rem solid #161616;">%s</div>
     <div style="display:flex;gap:26rem;margin-top:12rem;">%s</div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;gap:18rem;">
     <div class="bd2">%s</div><div class="src">Fuente · lorem ipsum, 2026</div>
   </div>
 </div>''' % (head("LOREM", LSS.title(), "h-sm", 30),
   "".join('<div class="bar%s" style="flex:1;height:%drem;"></div>' % ("" if i == 3 else " l", h)
           for i, h in enumerate([180, 260, 320, 430, 360, 240])),
   "".join('<div style="flex:1;" class="src">L%02d</div>' % (i+1) for i in range(6)), LP2))

add(code="F04", name="Evolución / línea", family="Datos", dark=False,
 purpose="Un dato a lo largo del tiempo.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),("grafico","—","Línea de 3 px en tinta"),
        ("hito_1..2","40 car. c/u","Anotaciones sobre puntos concretos"),("fuente","70 car.","Obligatoria")],
 use=["Crecimiento del trabajo remoto, evolución salarial, estacionalidad."],
 avoid=["Ejes truncados que exageran la pendiente."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;position:relative;border-bottom:2rem solid #161616;border-left:2rem solid #161616;">
     <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%%;height:100%%;">
       <polyline points="2,36 16,31 30,32 44,24 58,18 72,19 86,8 98,4" fill="none"
         stroke="#161616" stroke-width="1" vector-effect="non-scaling-stroke"
         style="stroke-width:3px;" stroke-linejoin="round" stroke-linecap="round"/>
     </svg>
     <div class="pin" style="left:56%%;top:38%%;"><i></i><span>%s</span></div>
     <div class="pin" style="left:84%%;top:14%%;"><i></i><span>%s</span></div>
   </div>
   <div style="display:flex;justify-content:space-between;margin-top:12rem;">%s</div>
   <div class="src" style="margin-top:18rem;">Fuente · lorem ipsum, 2026</div>
 </div>''' % (head("LOREM", LT, "h-sm", 26), LS, LS,
   "".join('<div class="src">20%02d</div>' % (20+i) for i in range(7))))

add(code="F05", name="Cifra destacada", family="Datos", dark=False,
 purpose="Una a tres cifras que sostienen un argumento.",
 zones=[("etiqueta","40 car.",""),("cifra_1..3","5 car. c/u",""),
        ("pie_cifra_1..3","30 car. c/u",""),("fuente","70 car.","Obligatoria")],
 use=["Abrir un bloque con un dato de impacto. Cerrar un argumento."],
 avoid=["Cifras sin fuente. Más de 3 cifras."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:center;">
   <div class="eb dot" style="margin-bottom:44rem;">%s</div>
   <div style="display:flex;gap:130rem;align-items:baseline;">%s</div>
   <div class="src" style="margin-top:56rem;">Fuente · lorem ipsum dolor sit amet, 2026</div>
 </div>''' % (EB, "".join('<div><div class="kpi">%s</div><div class="kpi-l">%s</div></div>' % (v, LSS)
                          for v in ["00", "00%", "+00"])))

add(code="F06", name="Panel de KPIs", family="Datos", dark=False,
 purpose="Cuatro métricas juntas, como un cuadro de mando.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("kpi_1..4 valor","6 car. c/u",""),("kpi_1..4 etiqueta","26 car. c/u",""),
        ("kpi_1..4 nota","30 car. c/u","Variación o contexto")],
 use=["Resultados de la cohorte, métricas de un negocio, salud de un pipeline."],
 avoid=["Cuatro cifras sin relación entre sí."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:26rem;">%s</div>
   <div class="src" style="margin-top:22rem;">Fuente · lorem ipsum, 2026</div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   "".join('<div class="card" style="padding:30rem;display:flex;flex-direction:column;justify-content:center;">'
           '<div style="font-size:19rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#6f6f6f;">%s</div>'
           '<div style="font-size:78rem;font-weight:600;letter-spacing:-.03em;line-height:1;margin:16rem 0 12rem;">00</div>'
           '<div style="font-size:19rem;color:#6f6f6f;">%s</div></div>' % (LX, LSS) for _ in range(4))))

add(code="F07", name="Distribución en porcentajes", family="Datos", dark=False,
 purpose="Reparto de un total entre 4 o 5 categorías, en barras horizontales.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("categoria_1..5","34 car. c/u",""),("porcentaje_1..5","4 car. c/u",""),("fuente","70 car.","Obligatoria")],
 use=["Reparto de tiempo, de ingresos, de canales de captación."],
 avoid=["Gráfico de tarta. Porcentajes que no suman 100 sin explicarlo."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:26rem;">%s</div>
   <div class="src" style="margin-top:20rem;">Fuente · lorem ipsum, 2026</div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   "".join('<div class="hbar"><div class="lab">%s</div><div class="tr"><i style="width:%d%%;"></i></div>'
           '<div class="val">%d%%</div></div>' % (LSS, w, w) for w in [42, 27, 18, 9, 4])))

add(code="F08", name="Mapa / geografía", family="Datos", dark=False,
 purpose="Dato por país o región. El curso es internacional: aparece a menudo.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),("mapa","—","Mapa monocromo, sin fronteras decorativas"),
        ("pais_1..5","24 car. c/u",""),("valor_1..5","10 car. c/u",""),("fuente","70 car.","Obligatoria")],
 use=["Salarios por país, husos horarios, fiscalidad, visados de nómada digital."],
 avoid=["Mapas a color con leyenda por tono: añade siempre la lista de valores."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:56rem;">
   <div style="display:flex;flex-direction:column;">
     %s%s
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;">
     <table class="sl"><tr><th>LOREM</th><th>IPSUM</th></tr>%s</table>
     <div class="src" style="margin-top:20rem;">Fuente · lorem ipsum, 2026</div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 24), ph("Mapa monocromo", "flex:1;"),
   "".join('<tr><td>%s</td><td>00</td></tr>' % LSS for _ in range(5))))

# ══════════════════════════════════════════════════════════════════
#  G · ESTRUCTURA Y CONCEPTOS
# ══════════════════════════════════════════════════════════════════
add(code="G01", name="Proceso en pasos", family="Estructura", dark=False,
 purpose="Una secuencia de 3 o 4 pasos en orden.",
 zones=[("etiqueta","30 car.",""),("titulo","55 car.",""),
        ("paso_1..4 titulo","24 car. c/u",""),("paso_1..4 texto","110 car. c/u","")],
 use=["Métodos, flujos de trabajo, procesos de negociación o alta fiscal."],
 avoid=["Más de 4 pasos: parte en dos diapositivas. Flechas curvas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:36rem;flex:1;align-content:stretch;">%s</div>
 </div>''' % (head("LOREM", LT, "h-sm", 46), steps(4)))

add(code="G02", name="Cronología", family="Estructura", dark=False,
 purpose="Hitos en el tiempo sobre una línea horizontal.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("hito_1..5 fecha","12 car. c/u",""),("hito_1..5 texto","55 car. c/u","")],
 use=["Calendario del curso, historia de una tendencia, plan a 90 días."],
 avoid=["Hitos sin fecha. Más de 5 en una diapositiva."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:flex;align-items:center;">
     <div class="timeline">%s</div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   "".join('<div class="tl-item"><div class="d">%s</div><i></i><div class="t">%s</div></div>'
           % ("00 LOR", LB2) for _ in range(5))))

add(code="G03", name="Comparativa A / B", family="Estructura", dark=False,
 purpose="Dos opciones enfrentadas con los mismos criterios.",
 zones=[("titulo","50 car.",""),("a_etiqueta","16 car.","En el acento"),("a_titulo","28 car.",""),
        ("a_punto_1..3","50 car. c/u",""),("b_etiqueta","16 car.",""),("b_titulo","28 car.",""),
        ("b_punto_1..3","50 car. c/u","")],
 use=["Professional vs Founder · autónomo vs empleado · antes vs después."],
 avoid=["Tarjetas con distinto número de puntos."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="h-sm" style="margin-bottom:38rem;">%s</div>
   <div class="two" style="gap:44rem;flex:1;">%s</div>
 </div>''' % (LT, "".join(
   '<div class="card" style="padding:34rem;"><div class="eb" style="color:%s;">LOREM IPSUM</div>'
   '<div style="font-size:34rem;font-weight:600;letter-spacing:-.01em;margin:14rem 0 22rem;">%s</div>%s</div>'
   % (c, LSS.title(), dashes(3, 22)) for c in ["var(--acc)", "var(--red2)"])))

add(code="G04", name="Matriz 2×2", family="Estructura", dark=False,
 purpose="Cuatro cuadrantes definidos por dos ejes. Herramienta de decisión.",
 zones=[("titulo","45 car.",""),("eje_x","24 car.",""),("eje_y","24 car.",""),
        ("cuadrante_1..4 titulo","22 car. c/u",""),("cuadrante_1..4 texto","70 car. c/u","")],
 use=["Priorizar clientes, esfuerzo vs impacto, urgente vs importante."],
 avoid=["Matrices con ejes que no son opuestos reales."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:8fr 4fr;gap:56rem;">
   <div class="matrix">
     <div class="ax y">%s</div><div class="ax x">%s</div>
     <div class="q">%s</div><div class="q">%s</div><div class="q">%s</div><div class="q">%s</div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;">
     %s<div class="bd2">%s</div>
   </div>
 </div>''' % (LX, LX,
   *[('<div class="qt">%s</div><div class="qd">%s</div>' % (LSS.title(), LB2))] * 4,
   head("LOREM", LT, "h-sm", 22), LP3))

add(code="G05", name="Jerarquía / pirámide", family="Estructura", dark=False,
 purpose="Niveles apilados, de la base al vértice.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("nivel_1..4 titulo","24 car. c/u","De arriba abajo"),("nivel_1..4 texto","60 car. c/u","")],
 use=["Escalas de seniority, niveles de automatización, madurez de un negocio."],
 avoid=["Más de 4 niveles: no se leen."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:6fr 6fr;gap:56rem;align-items:center;">
   <div class="pyr">%s</div>
   <div>%s<div class="bd2">%s</div></div>
 </div>''' % ("".join('<div class="lvl" style="width:%d%%;"><b>%s</b><span>%s</span></div>' % (w, LSS.title(), LB2)
                      for w in [46, 64, 82, 100]),
   head("LOREM", LT, "h-sm", 22), LP3))

add(code="G06", name="Diagrama de flujo", family="Estructura", dark=False,
 purpose="Cajas conectadas con una bifurcación. Para decisiones con condición.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("nodo_1..5","26 car. c/u","Texto dentro de la caja, nunca flotando"),
        ("condicion","20 car.","La pregunta de la bifurcación")],
 use=["Árboles de decisión fiscal, flujos de automatización, criba de ofertas."],
 avoid=["Más de 5 nodos. Conectores curvos. Etiquetas fuera de las cajas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="flow">
     <div class="fnode">%s</div><div class="fconn"></div>
     <div class="fnode dia">%s</div><div class="fconn"></div>
     <div class="fcol"><div class="fnode">%s</div><div class="fnode">%s</div></div>
   </div>
 </div>''' % (head("LOREM", LT, "h-sm", 34), LSS, "¿Lorem?", LSS, LSS))

add(code="G07", name="Checklist", family="Estructura", dark=False,
 purpose="Lista de verificación que el alumno puede marcar.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("item_1..6","60 car. c/u","Empiezan por verbo"),("nota","80 car.","Opcional")],
 use=["Antes de enviar una candidatura, antes de facturar, antes de firmar."],
 avoid=["Ítems que no se pueden verificar objetivamente."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:20rem 56rem;align-content:center;">%s</div>
 </div>''' % (head("LOREM", LT, "h-sm", 34),
   ('<div class="chk"><i></i><span>%s</span></div>' % LB) * 6))

add(code="G08", name="Do / Don't", family="Estructura", dark=False,
 purpose="Buenas prácticas frente a errores, en dos columnas simétricas.",
 zones=[("titulo","45 car.",""),("si_1..4","60 car. c/u",""),("no_1..4","60 car. c/u","")],
 use=["Redacción de un CV, mensajes en frío, presencia en llamadas."],
 avoid=["Distinto número de puntos a cada lado."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="h-sm" style="margin-bottom:36rem;">%s</div>
   <div class="two" style="gap:64rem;flex:1;">
     <div class="dd"><div class="ddh">✓&nbsp;&nbsp;Así sí</div>%s</div>
     <div class="dd no"><div class="ddh">✗&nbsp;&nbsp;Así no</div>%s</div>
   </div>
 </div>''' % (LT, ('<div class="ddi">%s</div>' % LB) * 4, ('<div class="ddi">%s</div>' % LB) * 4))

add(code="G09", name="Framework con siglas", family="Estructura", dark=False,
 purpose="Un método memorizable: una letra por principio.",
 zones=[("etiqueta","30 car.",""),("sigla","6 car.","3–5 letras"),
        ("letra_1..4 palabra","18 car. c/u",""),("letra_1..4 texto","70 car. c/u","")],
 use=["Métodos propios que el alumno debe recordar sin apuntes."],
 avoid=["Siglas forzadas que no significan nada."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="eb dot">LOREM IPSUM</div>
   <div style="display:flex;align-items:baseline;gap:22rem;margin:16rem 0 34rem;">
     <div style="font-size:72rem;font-weight:700;letter-spacing:.06em;">LIDS</div>
     <div class="bd2">%s</div>
   </div>
   <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:32rem;align-content:stretch;">%s</div>
 </div>''' % (LP4, "".join(
   '<div class="step" style="border-top:2rem solid #161616;padding-top:20rem;">'
   '<div style="font-size:52rem;font-weight:700;letter-spacing:-.02em;line-height:1;">%s</div>'
   '<div class="t" style="margin-top:10rem;">%s</div><div class="d">%s</div></div>' % (c, LX, LP4)
   for c in "LIDS")))

# ══════════════════════════════════════════════════════════════════
#  H · PERSONAS Y PRUEBA SOCIAL
# ══════════════════════════════════════════════════════════════════
add(code="H01", name="Cita", family="Personas", dark=False,
 purpose="Una frase atribuida que se quiere fijar. Diapositiva de respiro.",
 zones=[("cita","180 car. · comillas latinas",""),("atribucion","40 car.","En el acento del camino")],
 use=["Cerrar una idea. Citar a un alumno, un cliente o el manifiesto."],
 avoid=["Citas de más de 180 caracteres. Citas motivacionales genéricas."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:center;padding-right:180rem;">
   <div style="font-size:52rem;font-weight:600;letter-spacing:-.02em;line-height:1.25;">«%s»</div>
   <div class="eb acc" style="margin-top:38rem;">Lorem ipsum · dolor sit</div>
 </div>''' % LP2)

add(code="H02", name="Testimonio con foto", family="Personas", dark=False,
 purpose="Cita con la cara y el contexto de quien la dice. Mucho más creíble.",
 zones=[("foto","—","Retrato, recorte cuadrado"),("cita","200 car.",""),
        ("nombre","30 car.",""),("cargo","45 car.","Rol · empresa · país"),("dato","30 car.","Opcional: el resultado")],
 use=["Casos de alumnos. Voz de empleadores."],
 avoid=["Testimonios sin nombre real o sin permiso."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:4fr 8fr;gap:60rem;align-items:center;">
   %s
   <div>
     <div style="font-size:40rem;font-weight:600;letter-spacing:-.02em;line-height:1.3;">«%s»</div>
     <div style="margin-top:32rem;padding-top:24rem;border-top:2rem solid #161616;">
       <div style="font-size:26rem;font-weight:700;">%s</div>
       <div class="src" style="text-transform:none;letter-spacing:0;font-size:19rem;margin-top:6rem;">%s</div>
     </div>
   </div>
 </div>''' % (ph("Retrato", "aspect-ratio:1/1;", "foto"), LP2, LSS.title(), LB2))

add(code="H03", name="Perfil del ponente", family="Personas", dark=False,
 purpose="Quién da la clase y por qué se le escucha.",
 zones=[("foto","—","Retrato"),("nombre","30 car.",""),("cargo","45 car.",""),
        ("bio","240 car.",""),("hito_1..3","40 car. c/u","Credenciales concretas"),("link","45 car.","LinkedIn")],
 use=["Segunda diapositiva de la primera sesión de cada docente."],
 avoid=["Bios de más de 240 caracteres. Adjetivos sin datos."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:4fr 8fr;gap:56rem;align-items:center;">
   %s
   <div>
     <div class="eb dot">LOREM IPSUM</div>
     <div class="h-sm" style="margin:18rem 0 10rem;">%s</div>
     <div class="src" style="text-transform:none;letter-spacing:0;font-size:22rem;margin-bottom:24rem;">%s</div>
     <div class="bd2" style="margin-bottom:26rem;max-width:900rem;">%s</div>
     %s
     <div style="margin-top:22rem;">%s</div>
   </div>
 </div>''' % (ph("Retrato", "aspect-ratio:3/4;", "foto"), LSS.title(), LB2, LP2, dashes(3, 21), link()))

add(code="H04", name="Caso real", family="Personas", dark=False,
 purpose="Un caso concreto: situación de partida, qué hizo, qué consiguió.",
 zones=[("etiqueta","24 car.","«Caso»"),("titulo","45 car.",""),("foto","—","Opcional"),
        ("punto_partida","140 car.",""),("que_hizo","140 car.",""),("resultado","140 car.",""),
        ("cifra","6 car.","El resultado en un número")],
 use=["Después de explicar un método: aquí está funcionando de verdad."],
 avoid=["Casos anónimos o inventados. Resultados sin cifra."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:grid;grid-template-columns:3fr 9fr;gap:44rem;">
     %s
     <div class="three" style="gap:32rem;">%s</div>
   </div>
 </div>''' % (head("CASO", LT, "h-sm", 30), ph("Foto", "", "foto"),
   "".join('<div style="border-top:2rem solid #161616;padding-top:20rem;">'
           '<div class="n" style="font-size:19rem;font-weight:700;letter-spacing:.14em;color:var(--acc);">%s</div>'
           '<div class="bd2" style="margin-top:14rem;font-size:21rem;">%s</div></div>'
           % (t, LP4) for t in ["PUNTO DE PARTIDA", "QUÉ HIZO", "RESULTADO"])))

add(code="H05", name="Logos de empresas", family="Personas", dark=False,
 purpose="Prueba social: dónde han acabado los alumnos o con quién trabajamos.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),("logo_1..8","—","Escala de grises, misma altura óptica"),
        ("pie","70 car.","Aclaración honesta de qué significa la lista")],
 use=["Cierre de bloque de empleabilidad."],
 avoid=["Logos de empresas sin relación real: es engañoso."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr;gap:26rem;">%s</div>
   <div class="src" style="margin-top:22rem;text-transform:none;letter-spacing:0;font-size:17rem;">%s</div>
 </div>''' % (head("LOREM", LT, "h-sm", 30),
   '<div class="logocell"><span class="src" style="font-size:13rem;">LOGO</span></div>' * 8, LP4))

# ══════════════════════════════════════════════════════════════════
#  I · ACTIVIDAD Y CIERRE
# ══════════════════════════════════════════════════════════════════
add(code="I01", name="Ejercicio práctico", family="Actividad", dark=False,
 purpose="La actividad en vivo. Una por bloque como mínimo.",
 zones=[("duracion","18 car.","EJERCICIO · NN MIN"),("titulo","50 car.","Imperativo"),
        ("paso_1..4","90 car. c/u",""),("entregable","90 car.","Qué se sube al campus"),
        ("imagen","—","Opcional: plantilla o ejemplo")],
 use=["Toda actividad con reloj. Es el 40 % del tiempo de clase."],
 avoid=["Ejercicio sin entregable. Ejercicio sin tiempo asignado."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:64rem;">
   <div style="display:flex;flex-direction:column;">
     <div class="tagsolid">Ejercicio · 00 min</div>
     <div class="h-sm" style="margin:24rem 0 26rem;">%s</div>
     <div class="bd2" style="line-height:1.9;flex:1;">%s</div>
     <div class="card hard" style="padding:24rem 26rem;">
       <span style="font-size:22rem;"><b>Entregable:</b> <span style="color:#525252;">%s</span></span>
     </div>
   </div>
   %s
 </div>''' % (LT, "".join('%d · %s<br>' % (i+1, LB) for i in range(4)), LS,
   ph("Plantilla / ejemplo", "height:100%;")))

add(code="I02", name="Trabajo en grupo", family="Actividad", dark=False,
 purpose="Dinámica en salas pequeñas, con roles y tiempos.",
 zones=[("duracion","20 car.","GRUPOS · NN MIN"),("titulo","45 car.",""),("consigna","180 car.",""),
        ("rol_1..3","40 car. c/u","Quién hace qué en el grupo"),
        ("puesta_en_comun","60 car.","Cuánto dura y qué se comparte")],
 use=["Sesiones largas. Temas donde el debate aporta más que la explicación."],
 avoid=["Grupos sin rol asignado: siempre habla el mismo."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:6fr 6fr;gap:56rem;">
   <div style="display:flex;flex-direction:column;">
     <div class="tagsolid">Grupos de 4 · 00 min</div>
     <div class="h-sm" style="margin:24rem 0 24rem;">%s</div>
     <div class="bd2" style="flex:1;">%s</div>
     <div class="note"><div class="eb acc" style="margin-bottom:12rem;">PUESTA EN COMÚN</div>
       <div class="bd2" style="font-size:20rem;">%s</div></div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;gap:22rem;">%s</div>
 </div>''' % (LT, LP2, LP4,
   "".join('<div class="card" style="padding:26rem;"><div class="eb">ROL %02d</div>'
           '<div class="bd2" style="margin-top:12rem;font-size:21rem;">%s</div></div>' % (i+1, LB)
           for i in range(3))))

add(code="I03", name="Quiz de repaso", family="Actividad", dark=False,
 purpose="Pregunta con opciones para comprobar comprensión en directo.",
 zones=[("etiqueta","20 car.","«Repaso»"),("pregunta","110 car.",""),
        ("opcion_a..d","55 car. c/u",""),("pista","70 car.","Opcional")],
 use=["Cierre de bloque. Antes de una pausa."],
 avoid=["Preguntas con dos respuestas válidas. Marcar la correcta en la diapositiva."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   <div class="eb dot">REPASO</div>
   <div class="h-sm" style="margin:18rem 0 36rem;max-width:1400rem;">%s</div>
   <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:22rem 44rem;align-content:center;">%s</div>
 </div>''' % (LT + "?", "".join(
   '<div class="opt"><b>%s</b><span>%s</span></div>' % (c, LB) for c in "ABCD")))

add(code="I04", name="Plantilla a rellenar", family="Actividad", dark=False,
 purpose="Un esquema con huecos que el alumno completa en directo.",
 zones=[("etiqueta","24 car.",""),("titulo","45 car.",""),("instruccion","120 car.",""),
        ("campo_1..4 etiqueta","26 car. c/u",""),("url_plantilla","45 car.","Dónde está la copia editable")],
 use=["Propuesta de valor, banda salarial, guion de llamada, oferta."],
 avoid=["Más de 4 campos en pantalla: el resto va en la plantilla descargable."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s<div class="bd2" style="margin-bottom:30rem;">%s</div>
   <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:26rem 44rem;">%s</div>
   <div style="margin-top:24rem;">%s</div>
 </div>''' % (head("PLANTILLA", LT, "h-sm", 20), LP3,
   "".join('<div class="field"><div class="fl">%s</div><div class="fb"></div></div>' % LSS
           for _ in range(4)), link()))

add(code="I05", name="Errores comunes", family="Actividad", dark=False,
 purpose="Los tres fallos que casi todo el mundo comete, y su corrección.",
 zones=[("etiqueta","30 car.",""),("titulo","45 car.",""),
        ("error_1..3","55 car. c/u",""),("correccion_1..3","70 car. c/u","")],
 use=["Después de un ejercicio, antes de que lo repitan mal."],
 avoid=["Listar errores sin decir qué hacer en su lugar."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="three" style="gap:36rem;flex:1;">%s</div>
 </div>''' % (head("LOREM", LT, "h-sm", 34),
   "".join('<div style="display:flex;flex-direction:column;gap:18rem;">'
           '<div class="card" style="padding:26rem;border-color:#c6c6c6;background:#f4f4f4;">'
           '<div class="eb" style="color:#8d8d8d;">ERROR %02d</div>'
           '<div class="bd2" style="margin-top:12rem;font-size:21rem;">%s</div></div>'
           '<div class="card" style="padding:26rem;flex:1;"><div class="eb acc">EN SU LUGAR</div>'
           '<div class="bd2" style="margin-top:12rem;font-size:21rem;">%s</div></div></div>'
           % (i+1, LB, LB) for i in range(3))))

add(code="I06", name="Resumen del bloque", family="Cierre", dark=False,
 purpose="Tres ideas que hay que retener. Antes de cambiar de bloque.",
 zones=[("etiqueta","30 car.",""),("titulo","50 car.",""),
        ("idea_1..3 titulo","30 car. c/u",""),("idea_1..3 texto","110 car. c/u","")],
 use=["Cierre de bloque, antes del separador siguiente."],
 avoid=["Repetir literalmente las viñetas ya vistas: reformula."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;">
   %s
   <div class="three" style="gap:44rem;flex:1;">%s</div>
 </div>''' % (head("LOREM IPSUM", LT, "h-sm", 46), cards(3)))

add(code="I07", name="Tarea con plazo", family="Cierre", dark=False,
 purpose="El entregable de la semana: qué, cómo, cuándo y dónde se entrega.",
 zones=[("etiqueta","20 car.","«Tarea»"),("titulo","50 car.",""),("descripcion","200 car.",""),
        ("criterio_1..3","55 car. c/u","Cómo se evalúa"),("fecha","24 car.",""),
        ("canal","24 car.","Campus o #canal de Slack"),("url","45 car.","")],
 use=["Toda tarea entre sesiones."],
 avoid=["Tareas sin criterio de evaluación ni fecha exacta."],
 body='''<div class="canvas" style="display:grid;grid-template-columns:7fr 5fr;gap:60rem;">
   <div style="display:flex;flex-direction:column;">
     <div class="tagsolid">Tarea</div>
     <div class="h-sm" style="margin:24rem 0 24rem;">%s</div>
     <div class="bd2" style="margin-bottom:26rem;">%s</div>
     <div style="flex:1;">%s</div>
   </div>
   <div style="display:flex;flex-direction:column;justify-content:center;gap:22rem;">
     <div class="card" style="padding:30rem;"><div class="eb">FECHA LÍMITE</div>
       <div style="font-size:44rem;font-weight:700;letter-spacing:-.02em;margin-top:12rem;">00 · 00 · 26</div>
       <div class="src" style="margin-top:10rem;">23:59 · lorem ipsum</div></div>
     <div class="card" style="padding:30rem;"><div class="eb">DÓNDE</div>
       <div class="bd2" style="margin-top:12rem;font-size:21rem;">%s</div>%s</div>
   </div>
 </div>''' % (LT, LP2, dashes(3, 21), LSS, link()))

add(code="I08", name="Cierre y siguiente paso", family="Cierre", dark=True,
 purpose="Última diapositiva. Una acción concreta con fecha y canal.",
 zones=[("etiqueta","40 car.","«Antes de la próxima sesión»"),
        ("accion","60 car. · 2 líneas","Imperativo"),("detalle","80 car.","Fecha límite · canal")],
 use=["Cerrar toda sesión."],
 avoid=["«¿Preguntas?» · «Gracias por vuestra atención» · diapositiva en blanco."],
 body='''<div class="canvas" style="display:flex;flex-direction:column;justify-content:space-between;">
   <div class="eb">LOREM IPSUM DOLOR</div>
   <div>
     <div class="h" style="max-width:1400rem;">%s</div>
     <div class="bd" style="margin-top:26rem;font-size:24rem;">Lorem ipsum · lorem ipsum dolor sit amet</div>
   </div>
   <div></div>
 </div>''' % LT)
