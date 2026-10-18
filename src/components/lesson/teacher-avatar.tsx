"use client";

import { useEffect, useRef, useState } from "react";

import type { Gesture, GesturePlan } from "@/lib/content/gestures";

// ══════════════════════════════════════════════════════════
//  Lía, la guía virtual del campus
//
//  Una profesora en 3D que lee la lección con el audio que ya está narrado:
//  mueve los labios con el propio audio, parpadea, respira y, en los momentos
//  que marca la lección, sonríe, guiña, piensa o asiente.
//
//  · TalkingHead (MIT) pinta el avatar con three.js, en el navegador.
//  · HeadAudio (MIT) saca los visemas del audio en tiempo real: no hace falta
//    transcripción ni marcas de tiempo, y funciona igual en español e inglés.
//  · El avatar es CC0 (MPFB / MakeHuman). Se sustituye por el definitivo
//    cambiando AVATAR_URL.
//
//  Todo se descarga sólo al pulsar el botón (≈ 8 MB la primera vez, luego en
//  caché). Quien no lo usa no paga nada en peso ni en batería.
//
//  ⚠︎ Es una guía VIRTUAL y lo dice en pantalla. No representa a ninguna
//  profesora real del programa.
// ══════════════════════════════════════════════════════════

const TH_URL = "https://esm.sh/@met4citizen/talkinghead@1.7.0/modules/talkinghead.mjs";
const HA_BASE = "https://cdn.jsdelivr.net/npm/@met4citizen/headaudio@0.1.0/dist";
const AVATAR_URL =
  process.env.NEXT_PUBLIC_TEACHER_AVATAR_URL ||
  "https://jzmllhwkplpfmjddqknh.supabase.co/storage/v1/object/public/lesson-assets/avatars/profesora.glb";

/** Ropa en los colores de la marca: tinta y el morado de Remote Professional. */
const OUTFIT_TINT = "#1c1930";

type Copy = {
  name: string;
  role: string;
  virtual: string;
  start: string;
  loading: string;
  pause: string;
  resume: string;
  restart: string;
  error: string;
};

type Status = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function TeacherAvatar({ audioUrl, plan, copy }: { audioUrl: string; plan: GesturePlan; copy: Copy }) {
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<any>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const timers = useRef<number[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      try {
        source.current?.stop();
      } catch {
        /* ya parado */
      }
      head.current?.stop?.();
    },
    [],
  );

  async function load() {
    const { TalkingHead } = await import(/* webpackIgnore: true */ TH_URL);
    const { HeadAudio } = await import(/* webpackIgnore: true */ `${HA_BASE}/headaudio.min.mjs`);

    const h = new TalkingHead(stage.current!, {
      ttsEndpoint: "N/A",
      lipsyncModules: [],
      cameraView: "upper",
      cameraRotateEnable: false,
      cameraZoomEnable: false,
      cameraPanEnable: false,
      avatarMood: "happy",
      modelFPS: 30,
      mixerGainSpeech: 2,
    });
    head.current = h;

    await h.showAvatar({ url: AVATAR_URL, body: "F", avatarMood: "happy", lipsyncLang: "en" });

    // El atuendo: camiseta lisa en los colores del campus. Se le quita la
    // textura porque la del avatar de partida trae estampado un logotipo.
    h.armature?.traverse?.((o: any) => {
      if (o.isMesh && /suit|casual|cloth/i.test(o.name) && o.material?.color) {
        o.material.map = null;
        o.material.color.set(OUTFIT_TINT);
        o.material.needsUpdate = true;
      }
    });

    await h.audioCtx.audioWorklet.addModule(`${HA_BASE}/headworklet.min.mjs`);
    const ha = new HeadAudio(h.audioCtx, { processorOptions: {}, parameterData: { vadMode: 1 } });
    await ha.loadModel(`${HA_BASE}/model-en-mixed.bin`);

    // Labios: el audio entra en HeadAudio y, con un pequeño retardo, sale por
    // los altavoces, para que boca y voz vayan a la par.
    h.audioSpeechGainNode.connect(ha);
    const delay = new DelayNode(h.audioCtx, { delayTime: 0.12 });
    h.audioSpeechGainNode.disconnect(h.audioReverbNode);
    h.audioSpeechGainNode.connect(delay);
    delay.connect(h.audioReverbNode);
    ha.onvalue = (key: string, value: number) => {
      Object.assign(h.mtAvatar[key], { newvalue: value, needsUpdate: true });
    };
    h.opt.update = ha.update.bind(ha);

    // Al empezar cada frase, mira a cámara y acompaña con las manos.
    let lastEnded = 0;
    ha.onended = () => {
      lastEnded = Date.now();
    };
    ha.onstarted = () => {
      if (Date.now() - lastEnded > 250) {
        h.lookAtCamera(600);
        if (Math.random() < 0.35) h.speakWithHands();
      }
    };

    const res = await fetch(audioUrl);
    buffer.current = await h.audioCtx.decodeAudioData(await res.arrayBuffer());
  }

  function gesture(g: Gesture) {
    const h = head.current;
    if (!h) return;
    switch (g) {
      case "wave":
        h.playGesture("✋", 2.2);
        break;
      case "smile":
        h.playGesture("😊", 2.5);
        break;
      case "wink":
        h.playGesture("😉", 1.6);
        break;
      case "think":
        h.playGesture("🤔", 2.5);
        break;
      case "nod":
        h.playGesture("yes", 1.6);
        break;
      case "point":
        h.playGesture("index", 2.2, Math.random() < 0.5);
        break;
      case "thumbup":
        h.playGesture("👍", 2.5);
        break;
    }
  }

  function play() {
    const h = head.current;
    const buf = buffer.current;
    if (!h || !buf) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const src = h.audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(h.audioSpeechGainNode);
    src.onended = () => {
      if (source.current === src) {
        source.current = null;
        setStatus("ended");
      }
    };
    source.current = src;
    src.start(0);

    const ms = buf.duration * 1000;
    for (const p of plan) timers.current.push(window.setTimeout(() => gesture(p.gesture), p.at * ms));
    setStatus("playing");
  }

  async function start() {
    setError(null);
    try {
      if (!head.current) {
        setStatus("loading");
        await load();
      }
      await head.current.audioCtx.resume();
      play();
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  async function togglePause() {
    const ctx: AudioContext | undefined = head.current?.audioCtx;
    if (!ctx) return;
    if (status === "playing") {
      await ctx.suspend();
      setStatus("paused");
    } else {
      await ctx.resume();
      setStatus("playing");
    }
  }

  function restart() {
    try {
      source.current?.stop();
    } catch {
      /* ya parado */
    }
    source.current = null;
    play();
  }

  return (
    <section className="axr-teacher" data-status={status} aria-label={`${copy.name} · ${copy.role}`}>
      <div className="axr-teacher__stage" ref={stage} aria-hidden>
        {status === "idle" || status === "loading" || status === "error" ? (
          <div className="axr-teacher__poster">
            <span className="axr-teacher__initial">L</span>
          </div>
        ) : null}
      </div>

      <div className="axr-teacher__bar">
        <div className="axr-teacher__who">
          <strong>{copy.name}</strong>
          <span>{copy.role}</span>
          <em>{copy.virtual}</em>
        </div>

        <div className="axr-teacher__actions">
          {status === "idle" || status === "error" ? (
            <button type="button" className="axr-btn axr-btn--primary" onClick={start}>
              ▶ {copy.start}
            </button>
          ) : null}
          {status === "loading" ? (
            <button type="button" className="axr-btn axr-btn--ghost" disabled>
              {copy.loading}
            </button>
          ) : null}
          {status === "playing" || status === "paused" ? (
            <button type="button" className="axr-btn axr-btn--ghost" onClick={togglePause}>
              {status === "playing" ? `❚❚ ${copy.pause}` : `▶ ${copy.resume}`}
            </button>
          ) : null}
          {status === "playing" || status === "paused" || status === "ended" ? (
            <button type="button" className="axr-btn axr-btn--ghost" onClick={restart}>
              ↺ {copy.restart}
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="axr-teacher__error">
          {copy.error} <span>({error})</span>
        </p>
      ) : null}
    </section>
  );
}
