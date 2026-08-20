CSS = r"""
:root{
  --ink:#161616; --g90:#262626; --g70:#525252; --g60:#6f6f6f; --g50:#8d8d8d;
  --g30:#a8a8a8; --bd:#e0e0e0; --bds:#c6c6c6; --l10:#f4f4f4;
  --acc:#5b4bf5; --acc2:#4632e6; --red:#e4462f; --red2:#c3341f;
}
*{box-sizing:border-box;}
html{font-size:0.176389mm;}            /* 1rem = 1 px de diapositiva 1920x1080 */
body{margin:0;background:#fff;color:var(--ink);
  font-family:'Inter',-apple-system,'Helvetica Neue',Arial,sans-serif;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;-webkit-font-smoothing:antialiased;}
@page{size:338.667mm 190.5mm;margin:0;}
.slide{width:338.667mm;height:190.5mm;position:relative;overflow:hidden;background:#fff;
  page-break-after:always;break-after:page;}
.slide:last-child{page-break-after:auto;break-after:auto;}
.ink{background:var(--ink);color:#fff;}
.dots{background-image:radial-gradient(rgba(255,255,255,.13) 1px,transparent 1px);background-size:36rem 36rem;}
.dotsl{background-image:radial-gradient(#e0e0e0 1px,transparent 1px);background-size:22rem 22rem;}

/* ── zona segura ── */
.canvas{position:absolute;left:96rem;right:96rem;top:72rem;bottom:100rem;}
.foot{position:absolute;left:96rem;right:96rem;bottom:44rem;height:28rem;
  display:flex;justify-content:space-between;align-items:center;}
.foot .lock{display:flex;align-items:center;gap:12rem;}
.foot .lock span{font-size:15rem;font-weight:700;letter-spacing:.14em;}
.foot .pg{font-size:14rem;font-weight:500;letter-spacing:.10em;color:var(--g50);}
.ink .foot .pg{color:rgba(255,255,255,.55);}
.mark{position:absolute;top:26rem;right:30rem;font-size:14rem;font-weight:700;
  letter-spacing:.18em;color:var(--bds);}
.ink .mark{color:rgba(255,255,255,.30);}

/* ── tipografía de diapositiva ── */
.eb{font-size:18rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--g60);}
.ink .eb{color:rgba(255,255,255,.62);}
.eb.acc{color:var(--acc);}
.eb.dot{display:inline-flex;align-items:center;gap:10rem;}
.eb.dot::before{content:"";width:12rem;height:12rem;background:currentColor;flex:none;}
.h-cover{font-size:128rem;font-weight:700;letter-spacing:-.035em;line-height:1.0;}
.h-sect{font-size:96rem;font-weight:700;letter-spacing:-.03em;line-height:1.02;}
.h{font-size:64rem;font-weight:700;letter-spacing:-.03em;line-height:1.06;}
.h-sm{font-size:48rem;font-weight:700;letter-spacing:-.03em;line-height:1.08;}
.sub{font-size:36rem;font-weight:600;letter-spacing:-.01em;line-height:1.25;color:var(--g70);}
.ink .sub{color:rgba(255,255,255,.82);}
.bd{font-size:28rem;font-weight:400;line-height:1.5;color:var(--g70);}
.ink .bd{color:rgba(255,255,255,.82);}
.bd2{font-size:24rem;font-weight:400;line-height:1.5;color:var(--g70);}
.sm{font-size:18rem;line-height:1.45;color:var(--g60);}
.src{font-size:14rem;letter-spacing:.10em;text-transform:uppercase;color:var(--g50);}
.kpi{font-size:200rem;font-weight:700;letter-spacing:-.04em;line-height:.88;font-variant-numeric:tabular-nums;}
.kpi-l{font-size:22rem;color:var(--g60);margin-top:14rem;}
.ink .kpi-l{color:rgba(255,255,255,.7);}

/* ── piezas ── */
.ph{background:var(--l10);border:1rem solid var(--bd);display:grid;place-items:center;}
.ph span{font-size:16rem;letter-spacing:.14em;text-transform:uppercase;color:var(--g50);}
.card{border:1rem solid var(--ink);padding:36rem;background:#fff;}
.card.hard{box-shadow:14rem 14rem 0 var(--ink);}
.tagsolid{display:inline-block;background:var(--ink);color:#fff;font-size:16rem;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;padding:8rem 16rem;}
.rule{height:1rem;background:var(--bd);}
.rule-ink{height:2rem;background:var(--ink);width:120rem;}
table.sl{border-collapse:collapse;width:100%;}
table.sl th{font-size:18rem;font-weight:700;letter-spacing:.10em;text-transform:uppercase;
  text-align:left;padding:0 20rem 14rem 0;border-bottom:2rem solid var(--ink);}
table.sl td{font-size:24rem;padding:16rem 20rem 16rem 0;border-bottom:1rem solid var(--bd);color:var(--g70);}
table.sl td:first-child{color:var(--ink);font-weight:600;}
ul.sl{margin:0;padding:0;list-style:none;}
ul.sl li{font-size:28rem;line-height:1.4;color:var(--g70);padding:18rem 0;border-top:1rem solid var(--bd);
  display:flex;gap:20rem;}
ul.sl li:first-child{border-top:2rem solid var(--ink);}
ul.sl.spread{flex:1;display:flex;flex-direction:column;}
ul.sl.spread li{flex:1;align-items:center;padding:0;}
ul.sl li b{color:var(--ink);font-weight:700;flex:none;}
.num-list{counter-reset:s;}
.step{display:flex;flex-direction:column;gap:14rem;}
.step .n{font-size:20rem;font-weight:700;letter-spacing:.14em;color:var(--acc);}
.step .t{font-size:28rem;font-weight:700;letter-spacing:-.01em;}
.step .d{font-size:20rem;line-height:1.45;color:var(--g70);}
.bar{background:var(--ink);}
.bar.l{background:var(--g30);}

/* ── páginas de ficha (documento, no plantilla) ── */
.doc{background:#f4f4f4;}
.doc .canvas{top:64rem;bottom:64rem;}
.doc-h{display:flex;align-items:baseline;gap:20rem;border-bottom:2rem solid var(--ink);padding-bottom:14rem;margin-bottom:26rem;}
.doc-h .code{font-size:34rem;font-weight:700;letter-spacing:.06em;}
.doc-h .nm{font-size:34rem;font-weight:700;letter-spacing:-.02em;}
.doc-h .kind{margin-left:auto;font-size:15rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--g50);}
.doc h4{font-size:16rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--g60);margin:0 0 10rem;}
.doc p{font-size:19rem;line-height:1.5;color:var(--g70);margin:0 0 12rem;}
.doc b{color:var(--ink);}
.doc .box{background:#fff;border:1rem solid var(--bd);padding:22rem 24rem;}
.doc table{border-collapse:collapse;width:100%;}
.doc table th{font-size:14rem;font-weight:700;letter-spacing:.10em;text-transform:uppercase;color:var(--g60);
  text-align:left;padding:0 14rem 8rem 0;border-bottom:1rem solid var(--ink);}
.doc table td{font-size:17rem;padding:8rem 14rem 8rem 0;border-bottom:1rem solid var(--bd);color:var(--g70);
  vertical-align:top;line-height:1.35;}
.doc table td.k{font-family:'SFMono-Regular',Menlo,monospace;color:var(--ink);font-size:16rem;white-space:nowrap;}
.doc ul{margin:0;padding-left:22rem;} .doc li{font-size:18rem;line-height:1.45;color:var(--g70);margin-bottom:6rem;}
.mono{font-family:'SFMono-Regular',Menlo,Consolas,monospace;}
.codeblk{background:var(--ink);color:#fff;padding:20rem 22rem;font-family:'SFMono-Regular',Menlo,monospace;
  font-size:15rem;line-height:1.6;white-space:pre-wrap;}
.doc .foot{bottom:26rem;}
.doc .foot .pg{color:var(--g50);}
.mini{width:576rem;height:324rem;position:relative;overflow:hidden;border:1rem solid var(--bds);background:#fff;}
.mini .inner{position:absolute;top:0;left:0;width:1920rem;height:1080rem;transform:scale(.3);transform-origin:top left;background:#fff;}
.mini .inner.ink{background:var(--ink);color:#fff;}

/* ══ fondos a sangre y velos ══ */
.bleed{position:absolute;inset:0;overflow:hidden;z-index:0;}
.veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.72) 100%);}
.canvas{z-index:2;} .foot{z-index:3;} .mark{z-index:3;}
.dotsl-bg{background-image:radial-gradient(#e0e0e0 1px,transparent 1px);background-size:22rem 22rem;}

/* ══ huecos de medio ══ */
.ph.foto{background:repeating-linear-gradient(135deg,#e8e8e8 0 14rem,#f4f4f4 14rem 28rem);border-color:var(--bds);}
.ph.vid{background:var(--g90);border-color:var(--g90);}
/* la foto a sangre se rellenará con una imagen real: el marcador va oscuro para que
   el blanco del texto se lea igual que se leerá sobre la fotografía definitiva */
.bleed .ph.foto{background:repeating-linear-gradient(135deg,#3c3c3c 0 16rem,#4c4c4c 16rem 32rem);}
.bleed .ph span{color:rgba(255,255,255,.5);}
.ph.vid span{color:rgba(255,255,255,.65);}
.play{width:86rem;height:86rem;border:3rem solid currentColor;display:grid;place-items:center;color:#fff;}
.play::after{content:"";width:0;height:0;margin-left:8rem;
  border-left:26rem solid currentColor;border-top:16rem solid transparent;border-bottom:16rem solid transparent;}
.play.sm{width:56rem;height:56rem;color:var(--ink);flex:none;}
.play.sm::after{margin-left:6rem;border-left:18rem solid currentColor;
  border-top:11rem solid transparent;border-bottom:11rem solid transparent;}

/* ══ QR y enlaces ══ */
.qr{display:grid;grid-template-columns:repeat(15,1fr);grid-template-rows:repeat(15,1fr);
  background:#fff;padding:10rem;border:1rem solid var(--bd);}
.qr i{background:#161616;}
.qrbox{background:#fff;padding:18rem;}
.link{display:inline-flex;align-items:center;gap:12rem;font-size:22rem;font-weight:600;
  color:var(--acc);border-bottom:2rem solid var(--acc);padding-bottom:6rem;}
.link.big{font-size:28rem;}
.link b{font-weight:700;}
.ink .link{color:#fff;border-color:#fff;}
.reslink{border-top:2rem solid var(--ink);padding-top:16rem;}
.reslink .t{font-size:24rem;font-weight:700;letter-spacing:-.01em;}
.reslink .u{font-size:18rem;color:var(--acc);margin:6rem 0 8rem;}
.reslink .d{font-size:18rem;color:var(--g60);line-height:1.35;}
.logobox{width:110rem;height:110rem;border:2rem solid var(--ink);display:grid;place-items:center;}
.logocell{border:1rem solid var(--bd);display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:10rem;background:#fff;}

/* ══ cajas de apoyo ══ */
.note{border-left:5rem solid var(--acc);background:var(--l10);padding:28rem 30rem;}
.ink .note{background:rgba(255,255,255,.08);}
.fillbox{background:var(--l10);padding:34rem;}

/* ══ mapa del curso ══ */
.track{display:flex;align-items:flex-start;width:100%;}
.node{flex:1;display:flex;flex-direction:column;align-items:center;gap:16rem;position:relative;text-align:center;}
.node::before{content:"";position:absolute;top:8rem;right:50%;width:100%;height:2rem;background:var(--bd);}
.node:first-child::before{display:none;}
.node i{width:18rem;height:18rem;background:var(--g30);position:relative;z-index:1;}
.node.on i{background:var(--ink);box-shadow:0 0 0 8rem rgba(22,22,22,.12);}
.node span{font-size:17rem;color:var(--g60);}
.node.on span{color:var(--ink);font-weight:700;}

/* ══ llamadas sobre imagen ══ */
.callout{width:46rem;height:46rem;background:var(--acc);color:#fff;display:grid;place-items:center;
  font-size:23rem;font-weight:700;position:absolute;z-index:3;}
.callout.stat{position:static;flex:none;}

/* ══ reproductor de audio ══ */
.player{display:flex;align-items:center;gap:26rem;border:1rem solid var(--ink);padding:24rem 28rem;}
.wave{flex:1;display:flex;align-items:center;gap:5rem;height:64rem;}
.wave i{flex:1;background:var(--g30);display:block;}

/* ══ tabla de decisión ══ */
table.sl.dec th{text-align:center;} table.sl.dec th:first-child{text-align:left;}
table.sl.dec td.c{text-align:center;font-size:28rem;font-weight:700;color:var(--ink);}
table.sl.dec td.c.mut{color:var(--g30);}

/* ══ gráfico de línea ══ */
.pin{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10rem;z-index:2;}
.pin i{width:16rem;height:16rem;background:var(--ink);flex:none;}
.pin span{font-size:17rem;color:var(--g70);background:#fff;padding:3rem 9rem;white-space:nowrap;}

/* ══ barras horizontales ══ */
.hbar{display:flex;align-items:center;gap:26rem;}
.hbar .lab{width:430rem;font-size:24rem;color:var(--g70);}
.hbar .tr{flex:1;height:34rem;background:var(--l10);}
.hbar .tr i{display:block;height:100%;background:var(--ink);}
.hbar .val{width:120rem;text-align:right;font-size:28rem;font-weight:700;font-variant-numeric:tabular-nums;}

/* ══ cronología ══ */
.timeline{display:flex;width:100%;}
.tl-item{flex:1;display:flex;flex-direction:column;gap:16rem;padding-right:28rem;}
.tl-item .d{font-size:19rem;font-weight:700;letter-spacing:.12em;color:var(--acc);}
.tl-item i{height:2rem;background:var(--ink);position:relative;display:block;}
.tl-item i::before{content:"";position:absolute;left:0;top:-8rem;width:18rem;height:18rem;background:var(--ink);}
.tl-item .t{font-size:20rem;color:var(--g70);line-height:1.4;}

/* ══ matriz 2x2 ══ */
.matrix{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2rem;
  background:var(--ink);border:2rem solid var(--ink);position:relative;margin:0 0 46rem 46rem;}
.matrix .q{background:#fff;padding:28rem;}
.qt{font-size:26rem;font-weight:700;letter-spacing:-.01em;}
.qd{font-size:19rem;color:var(--g60);margin-top:10rem;line-height:1.4;}
.ax{position:absolute;font-size:17rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--g60);}
.ax.x{bottom:-38rem;left:50%;transform:translateX(-50%);}
.ax.y{left:-38rem;top:50%;transform:translateY(-50%) rotate(-90deg);}

/* ══ pirámide ══ */
.pyr{display:flex;flex-direction:column;align-items:center;gap:12rem;}
.lvl{border:2rem solid var(--ink);padding:18rem 26rem;text-align:center;}
.lvl b{display:block;font-size:24rem;font-weight:700;letter-spacing:-.01em;}
.lvl span{font-size:18rem;color:var(--g60);}

/* ══ diagrama de flujo ══ */
.flow{flex:1;display:flex;align-items:center;justify-content:center;}
.fnode{border:2rem solid var(--ink);padding:26rem 30rem;font-size:22rem;font-weight:600;
  text-align:center;min-width:250rem;background:#fff;}
.fnode.dia{background:var(--l10);}
.fconn{width:76rem;height:2rem;background:var(--ink);position:relative;flex:none;}
.fconn::after{content:"";position:absolute;right:0;top:-8rem;
  border-left:15rem solid var(--ink);border-top:9rem solid transparent;border-bottom:9rem solid transparent;}
.fcol{display:flex;flex-direction:column;gap:28rem;}

/* ══ checklist ══ */
.chk{display:flex;gap:20rem;align-items:center;font-size:23rem;color:var(--g70);
  border-bottom:1rem solid var(--bd);padding-bottom:16rem;}
.chk i{width:28rem;height:28rem;border:2rem solid var(--ink);flex:none;}

/* ══ do / dont ══ */
.dd{display:flex;flex-direction:column;}
.ddh{font-size:25rem;font-weight:700;border-top:4rem solid var(--ink);padding-top:16rem;margin-bottom:6rem;}
.dd.no .ddh{border-top-color:var(--g30);color:var(--g60);}
.ddi{font-size:21rem;color:var(--g70);padding:15rem 0;border-bottom:1rem solid var(--bd);line-height:1.35;}

/* ══ quiz ══ */
.opt{display:flex;gap:20rem;align-items:center;border:2rem solid var(--ink);padding:22rem 26rem;}
.opt b{font-size:24rem;font-weight:700;flex:none;width:34rem;}
.opt span{font-size:21rem;color:var(--g70);line-height:1.35;}

/* ══ campos rellenables ══ */
.field .fl{font-size:19rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--g60);margin-bottom:12rem;}
.field .fb{height:80rem;background:var(--l10);border-bottom:2rem solid var(--ink);}

/* ══ correcciones sobre fondo tinta ══ */
.ink .bd2{color:rgba(255,255,255,.82);}
.ink .src{color:rgba(255,255,255,.55);}
.ink .card{border-color:rgba(255,255,255,.4);background:transparent;}

/* índice compacto: una línea por layout */
.idx td{font-size:15rem;padding:6rem 12rem 6rem 0;line-height:1.25;}
.idx td.k{font-size:14rem;}
.idx h4{margin-bottom:6rem;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:28rem;}
.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:28rem;}
"""
