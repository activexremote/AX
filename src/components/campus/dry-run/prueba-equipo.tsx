"use client";

import { useEffect, useRef, useState } from "react";

import { equipoProbado } from "@/app/(campus)/preparacion/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { PreparacionCopy } from "@/lib/i18n/preparacion";

// ══════════════════════════════════════════════════════════
//  Prueba de cámara, micrófono y conexión
//
//  Todo en el navegador: se pide la cámara y el micrófono, se enseña la
//  imagen y una barra con el volumen, y se mide cuánto tarda en volver una
//  petición pequeña al servidor. Nada se graba ni se envía. Si la cámara da
//  imagen, el micrófono oye algo y la conexión responde, se marca el paso.
// ══════════════════════════════════════════════════════════

type Estado = "espera" | "ok" | "mal";

export function PruebaEquipo({ copy }: { copy: PreparacionCopy }) {
  const video = useRef<HTMLVideoElement>(null);
  const flujo = useRef<MediaStream | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const [empezada, setEmpezada] = useState(false);
  const [cam, setCam] = useState<Estado>("espera");
  const [mic, setMic] = useState<Estado>("espera");
  const [red, setRed] = useState<{ e: Estado; ms?: number }>({ e: "espera" });
  const [nivel, setNivel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [marcado, setMarcado] = useState(false);

  const parar = () => {
    flujo.current?.getTracks().forEach((t) => t.stop());
    flujo.current = null;
    void audio.current?.close().catch(() => undefined);
    audio.current = null;
  };
  useEffect(() => parar, []);

  const empezar = async () => {
    parar();
    setEmpezada(true);
    setError(null);
    setCam("espera");
    setMic("espera");
    setRed({ e: "espera" });
    setNivel(0);

    // Conexión: lo que tarda en volver una petición pequeña, la mejor de tres.
    void (async () => {
      const tiempos: number[] = [];
      for (let i = 0; i < 3; i++) {
        const t0 = performance.now();
        try {
          await fetch(`/icon.svg?ping=${Date.now()}`, { cache: "no-store" });
          tiempos.push(performance.now() - t0);
        } catch {
          /* se cuenta como fallo */
        }
      }
      if (!tiempos.length) return setRed({ e: "mal" });
      const ms = Math.round(Math.min(...tiempos));
      setRed({ e: ms < 400 ? "ok" : "mal", ms });
    })();

    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      flujo.current = s;
      if (video.current) {
        video.current.srcObject = s;
        await video.current.play().catch(() => undefined);
      }
      setCam(s.getVideoTracks().some((t) => t.readyState === "live") ? "ok" : "mal");

      const ctx = new AudioContext();
      audio.current = ctx;
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(s).connect(an);
      const datos = new Uint8Array(an.fftSize);
      let oido = false;
      const medir = () => {
        if (!audio.current) return;
        an.getByteTimeDomainData(datos);
        let pico = 0;
        for (const v of datos) pico = Math.max(pico, Math.abs(v - 128));
        const n = Math.min(100, Math.round((pico / 128) * 200));
        setNivel(n);
        if (n > 18 && !oido) {
          oido = true;
          setMic("ok");
        }
        requestAnimationFrame(medir);
      };
      medir();
    } catch (e) {
      const nombre = (e as { name?: string })?.name;
      setError(nombre === "NotAllowedError" || nombre === "SecurityError" ? copy.eqDenied : copy.eqNoDevice);
      setCam("mal");
      setMic("mal");
    }
  };

  const todo = cam === "ok" && mic === "ok" && red.e === "ok";
  useEffect(() => {
    if (!todo || marcado) return;
    setMarcado(true);
    void equipoProbado();
  }, [todo, marcado]);

  const fila = (label: string, e: Estado, extra?: string) => (
    <li className={`axr-eq__row is-${e}`}>
      <Icono n={e === "ok" ? "ok" : e === "mal" ? "aviso" : "reloj"} size={16} />
      <strong>{label}</strong>
      <span>{extra ?? (e === "ok" ? copy.eqOk : e === "mal" ? copy.eqFail : copy.eqWaiting)}</span>
    </li>
  );

  return (
    <div className="axr-eq">
      <div className="axr-eq__screen">
        <video ref={video} muted playsInline aria-label={copy.eqCamera} />
        {!empezada ? (
          <button type="button" className="axr-btn" onClick={empezar}>
            <Icono n="play" /> {copy.eqStart}
          </button>
        ) : null}
      </div>
      {empezada ? (
        <>
          <ul className="axr-eq__rows">
            {fila(copy.eqCamera, cam)}
            {fila(copy.eqMic, mic)}
            {fila(copy.eqNet, red.e, red.ms !== undefined ? (red.e === "ok" ? copy.eqNetGood : copy.eqNetSlow).replace("{ms}", String(red.ms)) : undefined)}
          </ul>
          <div className="axr-eq__level">
            <small>{copy.eqSpeak}</small>
            <div className="axr-c-progress" aria-hidden>
              <span style={{ width: `${nivel}%`, transition: "width 60ms linear" }} />
            </div>
          </div>
          {error ? <p className="axr-c-note axr-c-note--warn">{error}</p> : null}
          {todo ? (
            <p className="axr-c-note axr-c-note--ok">
              <Icono n="ok" /> <span>{copy.eqAllOk}</span>
            </p>
          ) : null}
          <button type="button" className="axr-btn axr-btn--ghost" onClick={empezar}>
            {copy.eqRetry}
          </button>
        </>
      ) : null}
    </div>
  );
}
