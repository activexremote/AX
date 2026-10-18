"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import type { Gesture, GesturePlan } from "@/lib/content/gestures";

// ══════════════════════════════════════════════════════════
//  Erlik, el profe virtual de la barra de audio
//
//  Una burbuja pequeña abajo a la derecha que aparece al dar al play y
//  acompaña la narración: la boca se mueve con la voz, parpadea, respira y,
//  en los momentos que marca la lección, sonríe, guiña, piensa o asiente.
//
//  · Ilustración propia en SVG: unos KB, sin librerías 3D ni descargas.
//  · La boca sale del propio audio (Web Audio): volumen → apertura, timbre →
//    forma. No necesita transcripción y funciona igual en los dos idiomas.
//  · Los gestos salen de lib/content/gestures.ts, por la posición de cada
//    bloque en la narración.
//
//  ⚠︎ Es un personaje virtual y original. No representa a ninguna persona
//  real ni a ningún profesor del programa, y así se dice en la burbuja.
// ══════════════════════════════════════════════════════════

type Copy = { name: string; role: string; close: string };

const SKIN = "#F2C3A3";
const SKIN_SHADE = "#E2A585";
const HAIR = "#6B4329";
const HAIR_LIGHT = "#8A5A37";
const BEARD = "#6F462B";
const SWEATER = "#5E1F2C";
const FLANNEL = "#8E8B94";
const FLANNEL_STRIPE = "#6A2A3A";

/** Rizos de la melena: [cx, cy, r]. Detrás de la cara y a los lados. */
const CURLS_BACK: [number, number, number][] = [
  [62, 70, 20], [78, 52, 21], [100, 46, 22], [122, 52, 21], [138, 70, 20],
  [52, 92, 18], [148, 92, 18], [50, 114, 16], [150, 114, 16], [56, 132, 14], [144, 132, 14],
  [70, 40, 14], [130, 40, 14], [100, 32, 15],
];
/** Rizos del flequillo, por delante de la frente. */
const CURLS_FRONT: [number, number, number][] = [
  [74, 66, 11], [88, 58, 12], [102, 56, 12], [116, 59, 11], [128, 67, 10],
];

export function TeacherBubble({
  audioRef,
  playing,
  plan,
  copy,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  plan: GesturePlan;
  copy: Copy;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Piezas que se animan, tocadas directamente (sin re-render por fotograma).
  const head = useRef<SVGGElement>(null);
  const body = useRef<SVGGElement>(null);
  const mouth = useRef<SVGEllipseElement>(null);
  const smileLine = useRef<SVGPathElement>(null);
  const eyeL = useRef<SVGGElement>(null);
  const eyeR = useRef<SVGGElement>(null);
  const browL = useRef<SVGPathElement>(null);
  const browR = useRef<SVGPathElement>(null);

  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const expression = useRef<{ g: Gesture; until: number } | null>(null);
  const fired = useRef<Set<number>>(new Set());

  // Aparece al dar al play (si no se ha cerrado a mano).
  useEffect(() => {
    if (playing && !dismissed) setVisible(true);
  }, [playing, dismissed]);

  // Conecta el <audio> al analizador la primera vez que suena. El
  // AudioContext tiene que nacer después de un gesto del usuario: el play.
  useEffect(() => {
    const el = audioRef.current;
    if (!playing || !el) return;
    if (!audioCtx.current) {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const src = ctx.createMediaElementSource(el);
        const an = ctx.createAnalyser();
        an.fftSize = 1024;
        an.smoothingTimeConstant = 0.6;
        src.connect(an);
        an.connect(ctx.destination);
        audioCtx.current = ctx;
        analyser.current = an;
      } catch {
        /* sin Web Audio la burbuja sigue, sólo que la boca no lee el audio */
      }
    }
    audioCtx.current?.resume().catch(() => {});
  }, [playing, audioRef]);

  // Si se vuelve al principio, los gestos se pueden repetir.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onSeek = () => {
      const r = el.duration ? el.currentTime / el.duration : 0;
      fired.current = new Set(plan.map((p, i) => (p.at < r ? i : -1)).filter((i) => i >= 0));
    };
    el.addEventListener("seeked", onSeek);
    return () => el.removeEventListener("seeked", onSeek);
  }, [audioRef, plan]);

  // El bucle de animación.
  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    let open = 0;
    let nextBlink = performance.now() + 2500;
    let blinkUntil = 0;
    const buf = new Uint8Array(512);
    const freq = new Uint8Array(512);

    const frame = (now: number) => {
      const el = audioRef.current;
      const t = now / 1000;
      const speaking = Boolean(el && !el.paused);

      // ── Voz → boca ──
      let level = 0;
      let bright = 0.5;
      const an = analyser.current;
      if (an && speaking) {
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        level = Math.min(1, Math.sqrt(sum / buf.length) * 5.5);
        an.getByteFrequencyData(freq);
        let lo = 0;
        let hi = 0;
        for (let i = 2; i < 40; i++) lo += freq[i];
        for (let i = 40; i < 160; i++) hi += freq[i];
        bright = hi / (lo + hi + 1);
      } else if (speaking) {
        // Sin analizador: un balbuceo suave para que no hable con la boca cerrada.
        level = 0.35 + 0.3 * Math.sin(t * 11) * Math.sin(t * 3.7);
      }
      open += (level - open) * 0.45;

      // ── Gestos del plan ──
      if (el && el.duration && speaking) {
        const r = el.currentTime / el.duration;
        plan.forEach((p, i) => {
          if (p.at <= r && !fired.current.has(i)) {
            fired.current.add(i);
            expression.current = { g: p.gesture, until: now + (p.gesture === "wink" ? 700 : 2200) };
          }
        });
      }
      const ex = expression.current && expression.current.until > now ? expression.current.g : null;
      const smiling = ex === "smile" || ex === "wink" || ex === "wave" || ex === "thumbup";

      // Boca: abierta según la voz; redonda (O/U) con timbre grave, ancha (E/I) con agudo.
      const rx = 7 + bright * 5 + (smiling ? 2 : 0);
      const ry = 0.6 + open * 7;
      mouth.current?.setAttribute("rx", rx.toFixed(2));
      mouth.current?.setAttribute("ry", ry.toFixed(2));
      if (smileLine.current) {
        const c = smiling ? 6 : 2.5;
        smileLine.current.setAttribute("d", `M ${100 - rx - 3} 134 Q 100 ${134 + c} ${100 + rx + 3} 134`);
        smileLine.current.style.opacity = open < 0.15 ? "1" : "0";
      }

      // ── Ojos ──
      if (now > nextBlink) {
        blinkUntil = now + 130;
        nextBlink = now + 2200 + Math.random() * 3200;
      }
      const blink = now < blinkUntil;
      const squint = smiling ? 0.75 : 1;
      const winkLeft = ex === "wink";
      eyeL.current?.setAttribute("transform", `translate(84 104) scale(1 ${blink || winkLeft ? 0.08 : squint}) translate(-84 -104)`);
      eyeR.current?.setAttribute("transform", `translate(116 104) scale(1 ${blink ? 0.08 : squint}) translate(-116 -104)`);

      // Cejas: arriba al pensar (una más que otra) y al empezar a hablar.
      const lift = ex === "think" ? -5 : speaking ? -1.2 * open : 0;
      browL.current?.setAttribute("transform", `translate(0 ${lift.toFixed(2)})`);
      browR.current?.setAttribute("transform", `translate(0 ${(ex === "think" ? -1 : lift).toFixed(2)})`);

      // ── Cabeza y cuerpo ──
      const nod = ex === "nod" || ex === "thumbup" ? Math.sin(t * 9) * 3 : 0;
      const tilt = ex === "think" ? -6 : ex === "point" || ex === "wave" ? 5 : Math.sin(t * 0.8) * 2;
      const bob = speaking ? Math.sin(t * 4.2) * open * 1.6 : Math.sin(t * 1.1) * 0.6;
      head.current?.setAttribute("transform", `rotate(${tilt.toFixed(2)} 100 150) translate(0 ${(bob + nod).toFixed(2)})`);
      const breathe = 1 + Math.sin(t * 1.3) * 0.012;
      body.current?.setAttribute("transform", `translate(100 200) scale(${breathe.toFixed(4)} 1) translate(-100 -200)`);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [visible, audioRef, plan]);

  if (!visible) return null;

  return (
    <aside className="axr-erlik" data-playing={playing ? "" : undefined} aria-label={`${copy.name} · ${copy.role}`}>
      <div className="axr-erlik__bubble">
        <svg viewBox="0 0 200 200" role="img" aria-label={copy.name}>
          <defs>
            <linearGradient id="erlik-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6D5CFF" />
              <stop offset="1" stopColor="#3A1F6E" />
            </linearGradient>
            <pattern id="erlik-flannel" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={FLANNEL} />
              <rect y="4" width="16" height="4" fill={FLANNEL_STRIPE} />
              <rect y="11" width="16" height="1.5" fill={FLANNEL_STRIPE} opacity="0.7" />
            </pattern>
            <clipPath id="erlik-clip">
              <circle cx="100" cy="100" r="100" />
            </clipPath>
          </defs>

          <g clipPath="url(#erlik-clip)">
            <rect width="200" height="200" fill="url(#erlik-bg)" />

            {/* Cuerpo: jersey burdeos y sobrecamisa de franela abierta. */}
            <g ref={body}>
              <path d="M 30 200 Q 34 160 70 152 L 130 152 Q 166 160 170 200 Z" fill="url(#erlik-flannel)" />
              <path d="M 80 152 L 100 200 L 120 152 Z" fill={SWEATER} />
              <path d="M 86 152 Q 100 162 114 152" fill="none" stroke="#4A1622" strokeWidth="3" />
              <path d="M 70 152 L 88 176 L 82 152 Z" fill="#7E7A84" />
              <path d="M 130 152 L 112 176 L 118 152 Z" fill="#7E7A84" />
              <rect x="91" y="140" width="18" height="16" rx="6" fill={SKIN_SHADE} />
            </g>

            <g ref={head}>
              {/* Melena por detrás */}
              {CURLS_BACK.map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? HAIR_LIGHT : HAIR} />
              ))}

              {/* Orejas y cara */}
              <ellipse cx="66" cy="108" rx="6" ry="9" fill={SKIN_SHADE} />
              <ellipse cx="134" cy="108" rx="6" ry="9" fill={SKIN_SHADE} />
              <ellipse cx="100" cy="104" rx="34" ry="40" fill={SKIN} />

              {/* Flequillo rizado */}
              {CURLS_FRONT.map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? HAIR_LIGHT : HAIR} />
              ))}

              {/* Cejas */}
              <path ref={browL} d="M 75 92 Q 84 87 93 91" fill="none" stroke={BEARD} strokeWidth="3.6" strokeLinecap="round" />
              <path ref={browR} d="M 107 91 Q 116 87 125 92" fill="none" stroke={BEARD} strokeWidth="3.6" strokeLinecap="round" />

              {/* Ojos */}
              <g ref={eyeL}>
                <ellipse cx="84" cy="104" rx="6.5" ry="5" fill="#fff" />
                <circle cx="85" cy="104.5" r="3.4" fill="#5A3A22" />
                <circle cx="85.6" cy="104" r="1.5" fill="#1B120C" />
                <circle cx="86.6" cy="102.8" r="0.9" fill="#fff" />
              </g>
              <g ref={eyeR}>
                <ellipse cx="116" cy="104" rx="6.5" ry="5" fill="#fff" />
                <circle cx="115" cy="104.5" r="3.4" fill="#5A3A22" />
                <circle cx="115.6" cy="104" r="1.5" fill="#1B120C" />
                <circle cx="116.6" cy="102.8" r="0.9" fill="#fff" />
              </g>

              {/* Nariz y mejillas */}
              <path d="M 100 108 Q 97 118 101 121" fill="none" stroke={SKIN_SHADE} strokeWidth="2.4" strokeLinecap="round" />
              <ellipse cx="78" cy="120" rx="6" ry="3.5" fill="#EE9F8E" opacity="0.45" />
              <ellipse cx="122" cy="120" rx="6" ry="3.5" fill="#EE9F8E" opacity="0.45" />

              {/* Boca: abierta con la voz, una línea cuando calla */}
              <ellipse ref={mouth} cx="100" cy="134" rx="8" ry="1" fill="#5A1E22" />
              <path ref={smileLine} d="M 89 134 Q 100 137 111 134" fill="none" stroke="#5A1E22" strokeWidth="2.6" strokeLinecap="round" />

              {/* Bigote y perilla */}
              <path
                d="M 78 128 Q 88 120 100 125 Q 112 120 122 128 Q 118 133 110 131 Q 104 129 100 130 Q 96 129 90 131 Q 82 133 78 128 Z"
                fill={BEARD}
              />
              <path d="M 80 130 Q 79 138 84 142" fill="none" stroke={BEARD} strokeWidth="4" strokeLinecap="round" />
              <path d="M 120 130 Q 121 138 116 142" fill="none" stroke={BEARD} strokeWidth="4" strokeLinecap="round" />
              <path d="M 88 142 Q 100 158 112 142 Q 108 148 100 149 Q 92 148 88 142 Z" fill={BEARD} />
            </g>
          </g>
        </svg>
      </div>

      <div className="axr-erlik__tag">
        <strong>{copy.name}</strong>
        <span>{copy.role}</span>
      </div>

      <button
        type="button"
        className="axr-erlik__close"
        aria-label={copy.close}
        onClick={() => {
          setVisible(false);
          setDismissed(true);
        }}
      >
        ×
      </button>
    </aside>
  );
}
