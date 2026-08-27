"use client";

import { useEffect, useRef, useState } from "react";

// ══════════════════════════════════════════════════════════
//  Efectos de la landing de campaña.
//
//  Todo lo que se mueve en /trabajo-remoto está aquí y en un único
//  componente montado una vez: un observador para las entradas, uno para los
//  contadores y un solo listener de puntero delegado en la raíz. La
//  alternativa —un componente cliente por tarjeta— convierte media página en
//  JavaScript por unas animaciones.
//
//  ⚠︎ Nada de esto es necesario para leer la página. Si el JS no llega, el
//  contenido ya está pintado y visible: las animaciones parten de un estado
//  final por defecto y sólo se ocultan cuando esta clase se instala (ver
//  `.axr-ad.fx-on` en la hoja). Así una landing de anuncios nunca se queda en
//  blanco porque falle un script.
//
//  Y todo se apaga con `prefers-reduced-motion`. No es un detalle de estilo:
//  hay quien se marea de verdad con el movimiento en pantalla.
// ══════════════════════════════════════════════════════════

const REDUCE = "(prefers-reduced-motion: reduce)";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function AdFx() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".axr-ad");
    if (!root) return;

    const reduce = window.matchMedia(REDUCE).matches;
    const cleanup: Array<() => void> = [];

    // Marca que el JS está vivo: hasta aquí, todo se ve en su estado final.
    root.classList.add("fx-on");
    cleanup.push(() => root.classList.remove("fx-on"));

    // ── Entradas en escena ────────────────────────────────
    //
    // Lo que YA se ve al llegar no se anima: se marca como entrado en este
    // mismo bloque, junto con `fx-on`, así que el navegador nunca llega a
    // pintar el estado oculto. Sin esto había un parpadeo feo —el héroe se
    // veía, desaparecía al hidratar y volvía— y encima animar lo que está
    // sobre la línea de flotación sólo retrasa el primer pintado útil.
    const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const fold = window.innerHeight * 0.92;
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < fold) el.classList.add("is-in");
    });

    if (reduce) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );
      reveals.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
      cleanup.push(() => io.disconnect());

      // Y un barrido de seguridad a los tres segundos. Las secciones de abajo
      // llevan `content-visibility: auto` y no se maquetan hasta que se
      // acercan; si en algún navegador eso llegara a impedir que el
      // observador dispare, el contenido se quedaría invisible para siempre.
      // Una landing de anuncios no puede depender de que eso no pase.
      const t = window.setTimeout(() => {
        for (const el of reveals) {
          if (el.classList.contains("is-in")) continue;
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
        }
      }, 3000);
      cleanup.push(() => window.clearTimeout(t));
    }

    // ── Cifras que suben ──────────────────────────────────
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const paint = (el: HTMLElement, v: number) => {
      el.textContent = `${Math.round(v)}${el.dataset.suffix ?? ""}`;
    };
    if (reduce) {
      counters.forEach((el) => paint(el, Number(el.dataset.count ?? 0)));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            io.unobserve(el);
            const to = Number(el.dataset.count ?? 0);
            const t0 = performance.now();
            const step = (now: number) => {
              const p = Math.min(1, (now - t0) / 1100);
              paint(el, to * easeOutCubic(p));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        },
        { threshold: 0.5 },
      );
      counters.forEach((el) => io.observe(el));
      cleanup.push(() => io.disconnect());
    }

    // ── Foco que sigue al cursor ──────────────────────────
    // Un solo listener en la raíz en vez de uno por tarjeta, y sin tocar
    // estilos directamente: se escriben dos variables CSS y el resto lo
    // resuelve la hoja.
    if (!reduce && window.matchMedia("(hover: hover)").matches) {
      // Un fotograma por vez. `pointermove` dispara muchas más veces de las
      // que la pantalla puede pintar, y cada una de ellas medía la tarjeta
      // (`getBoundingClientRect` fuerza al navegador a recalcular el
      // maquetado): con el ratón moviéndose, eso solo ya daba tirones.
      let raf = 0;
      let last: PointerEvent | null = null;
      const apply = () => {
        raf = 0;
        const ev = last;
        if (!ev) return;
        const card = (ev.target as HTMLElement | null)?.closest<HTMLElement>("[data-spot]");
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((ev.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((ev.clientY - r.top) / r.height) * 100}%`);
      };
      const onMove = (ev: PointerEvent) => {
        last = ev;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      root.addEventListener("pointermove", onMove, { passive: true });
      cleanup.push(() => {
        root.removeEventListener("pointermove", onMove);
        if (raf) cancelAnimationFrame(raf);
      });
    }

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return null;
}

// ══════════════════════════════════════════════════════════
//  Vídeo de fondo del héroe
//
//  Ambiente, no contenido: va en silencio, en bucle, detrás del mesh y a baja
//  opacidad. Nada de lo que se cuenta en la página depende de verlo, así que
//  es lo primero que se sacrifica cuando el visitante ha pedido lo contrario.
//
//  El `src` NO se pone hasta que el efecto decide que toca. Con `src` puesto
//  desde el HTML, el navegador se descarga los 1,9 MB también para quien pide
//  movimiento reducido o lleva el ahorro de datos activado —justo a quien no
//  se los vamos a enseñar—. Mientras tanto queda el póster, que pesa 36 kB.
// ══════════════════════════════════════════════════════════

export function AdHeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia(REDUCE).matches) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    // Y no antes de que la página esté lista. Son 1,9 MB de adorno: si salen
    // a la vez que la tipografía, la hoja de estilos y el JS, compiten por el
    // ancho de banda con todo lo que sí hace falta para leer la página.
    let idle = 0;
    const arrancar = () => {
      const ric = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
      idle = ric ? ric(() => setLoad(true), { timeout: 2500 }) : window.setTimeout(() => setLoad(true), 900);
    };

    if (document.readyState === "complete") arrancar();
    else window.addEventListener("load", arrancar, { once: true });

    return () => {
      window.removeEventListener("load", arrancar);
      const cic = (window as Window & { cancelIdleCallback?: typeof cancelIdleCallback })
        .cancelIdleCallback;
      if (idle) (cic ?? window.clearTimeout)(idle);
    };
  }, []);

  useEffect(() => {
    if (!load) return;
    // `play()` devuelve una promesa que el navegador puede rechazar (política
    // de reproducción automática, pestaña en segundo plano). No es un error:
    // si se rechaza queda el póster, que es exactamente el mismo fotograma.
    ref.current?.play().catch(() => {});
  }, [load]);

  return (
    <video
      ref={ref}
      className="axr-ad__hero-video"
      data-on={on || undefined}
      poster={poster}
      src={load ? src : undefined}
      preload={load ? "auto" : "none"}
      muted
      loop
      playsInline
      tabIndex={-1}
      aria-hidden
      onCanPlay={() => setOn(true)}
    />
  );
}

// ══════════════════════════════════════════════════════════
//  Vídeo de la clase en directo
//
//  Éste sí es contenido: enseña cómo es una sesión. Pero está muy por debajo
//  del pliegue y pesa 3 MB, así que no se toca hasta que se acerca a la
//  ventana, y se para en cuanto se va. Un bucle reproduciéndose en una
//  sección que nadie está mirando gasta batería y nada más.
//
//  Va en silencio y sin controles: es una muestra de ambiente, no una clase.
// ══════════════════════════════════════════════════════════

export function AdLiveVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia(REDUCE).matches) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          // `play()` devuelve una promesa que el navegador puede rechazar
          // (política de reproducción automática). No es un error: si se
          // rechaza queda el póster, que es un fotograma de la misma clase.
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="axr-ad__live-video"
      poster={poster}
      src={load ? src : undefined}
      preload="none"
      muted
      loop
      playsInline
      aria-label={label}
    />
  );
}

// ══════════════════════════════════════════════════════════
//  Relojes del héroe
//
//  Cuatro husos horarios en hora real. Es el único adorno de la página que
//  además dice algo cierto sobre el producto: esto va de trabajar a la vez
//  desde sitios distintos.
//
//  Se pinta "--:--" hasta que monta: el servidor no sabe la hora del
//  visitante, y pintar la del servidor daría un aviso de hidratación y, peor,
//  un salto de layout en cuanto React corrigiera.
// ══════════════════════════════════════════════════════════

export function AdClocks({
  label,
  cities,
}: {
  label: string;
  cities: readonly { city: string; tz: string }[];
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="axr-ad__clocks">
      <span className="axr-ad__clocks-label">{label}</span>
      <ul>
        {cities.map((c) => (
          <li key={c.tz}>
            <strong>
              {now
                ? new Intl.DateTimeFormat("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: c.tz,
                  }).format(now)
                : "--:--"}
            </strong>
            <em>{c.city}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  Barra inferior fija
//
//  La barra de arriba y la de abajo NUNCA están a la vez: son la misma
//  función —marca y llamada a la acción— y tenerlas duplicadas en pantalla
//  enmarca el contenido por los dos lados y encoge la ventana útil.
//
//  El reparto es:
//    · héroe a la vista        → arriba. El formulario ya está en pantalla.
//    · en medio de la página   → abajo. Es cuando no hay ninguna acción cerca.
//    · sección final a la vista → arriba. Abajo estorbaría al formulario de
//      cierre, que es exactamente a donde la barra estaba empujando.
//
//  Y no pisa nada: la landing reserva siempre el alto de la barra por abajo
//  (`padding-bottom` en .axr-ad), así que el contenido acaba por encima de
//  ella y no debajo. La reserva es fija y no depende de la visibilidad: si
//  apareciera y desapareciera con la barra, la página daría un salto a mitad
//  de scroll cada vez.
// ══════════════════════════════════════════════════════════

export function AdStickyBar({
  note,
  cta,
  units,
  target,
}: {
  note: string;
  cta: string;
  units: { d: string; h: string; m: string };
  target: string;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const on = pastHero && !atEnd;

  // Se observa el HÉROE ENTERO, no un centinela puesto detrás de él.
  //
  // Con el centinela había un fallo que sólo se veía en el móvil: allí el
  // héroe mide más de una pantalla, así que el centinela nace fuera de vista,
  // la barra de arriba se daba por «pasada» desde el primer píxel y se
  // escondía al cargar — dejando su hueco en blanco, porque es `sticky` y su
  // sitio en el flujo se queda aunque ella no se vea.
  //
  // Mirando el héroe, la regla es la que siempre quiso ser: mientras se vea
  // algo del héroe, manda la barra de arriba. Da igual lo alto que sea.
  useEffect(() => {
    const hero = document.getElementById("axr-ad-hero");
    const end = document.getElementById("solicitar");
    const obs: IntersectionObserver[] = [];

    if (hero) {
      const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), {
        threshold: 0,
      });
      io.observe(hero);
      obs.push(io);
    }
    if (end) {
      // Un pelín antes de que entre del todo: la barra tiene que haberse ido
      // cuando el formulario de cierre asoma, no al mismo tiempo.
      const io = new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting), {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0,
      });
      io.observe(end);
      obs.push(io);
    }
    return () => obs.forEach((io) => io.disconnect());
  }, []);

  // La barra de arriba se esconde desde aquí: es la misma decisión, así que
  // vive en un solo sitio y viaja como atributo en la raíz.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".axr-ad");
    if (!root) return;
    root.dataset.bar = on ? "on" : "off";
    return () => {
      delete root.dataset.bar;
    };
  }, [on]);

  // Cuenta atrás. Cada 30 s basta: la barra enseña días, horas y minutos.
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  // Progreso de lectura, en una variable CSS y sobre rAF: escribir en cada
  // evento de scroll es la forma más rápida de que una página vaya a tirones.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      barRef.current?.style.setProperty("--read", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const d = left === null ? null : Math.floor(left / 86_400_000);
  const h = left === null ? null : Math.floor(left / 3_600_000) % 24;
  const m = left === null ? null : Math.floor(left / 60_000) % 60;

  return (
    <div ref={barRef} className="axr-ad__sticky" data-on={on || undefined} aria-hidden={!on}>
      <span className="axr-ad__sticky-read" aria-hidden />
      <div className="axr-ad__sticky-inner">
        <div className="axr-ad__sticky-left">
          <span className="axr-ad__pulse" aria-hidden />
          <span className="axr-ad__sticky-note">{note}</span>
          <span className="axr-ad__sticky-clock" role="timer" aria-live="off">
            {[
              [d, units.d],
              [h, units.h],
              [m, units.m],
            ].map(([v, u]) => (
              <span key={String(u)}>
                <strong>{v === null ? "--" : String(v).padStart(2, "0")}</strong>
                <em>{u}</em>
              </span>
            ))}
          </span>
        </div>
        <a href="#solicitar" className="axr-ad__sticky-cta axr-ad__buzz" tabIndex={on ? undefined : -1}>
          {cta}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
