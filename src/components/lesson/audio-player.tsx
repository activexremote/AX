"use client";

import { useEffect, useRef, useState } from "react";

import { addLessonTime } from "@/app/(campus)/lecciones/actions";
import { TeacherBubble } from "@/components/lesson/teacher-bubble";
import { useI18n } from "@/lib/i18n/provider";
import type { GesturePlan } from "@/lib/content/gestures";

export function LessonAudioPlayer({
  src,
  lessonId,
  lessonTitle,
  plan = [],
}: {
  src: string | null;
  lessonId: string;
  lessonTitle: string;
  /** Cuándo gesticula Erlik, el profe virtual que acompaña el audio. */
  plan?: GesturePlan;
}) {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  // El tiempo con la pestaña a la vista ya lo apunta VisitTracker; aquí sólo
  // el que se escucha con la pestaña escondida, para no contarlo dos veces.
  useEffect(() => {
    const t = setInterval(() => {
      if (playing && document.visibilityState !== "visible") {
        addLessonTime(lessonId, 5);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [playing, lessonId]);

  return (
    <div className="axr-audio">
      <button
        type="button"
        className="axr-audio__play"
        aria-label={playing ? t.lesson.audioPause : t.lesson.audioPlay}
        onClick={() => {
          if (!audioRef.current || !src) return;
          if (playing) audioRef.current.pause();
          else audioRef.current.play();
        }}
        disabled={!src}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M4 2.2v9.6a.6.6 0 0 0 .9.5l7.7-4.8a.6.6 0 0 0 0-1L4.9 1.7a.6.6 0 0 0-.9.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="axr-audio__meta">
        <span className="axr-audio__label">
          {src ? t.lesson.audioNarrated : t.lesson.audioSoon}
        </span>
        <span className="axr-audio__title">{lessonTitle}</span>
      </div>

      {/* Un clic en la barra salta a ese punto de la narración. */}
      <div
        className="axr-audio__bar"
        role="slider"
        aria-label={lessonTitle}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        tabIndex={src ? 0 : -1}
        onClick={(e) => {
          const a = audioRef.current;
          if (!a || !src || !a.duration) return;
          const r = e.currentTarget.getBoundingClientRect();
          a.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * a.duration;
        }}
        onKeyDown={(e) => {
          const a = audioRef.current;
          if (!a || !src) return;
          if (e.key === "ArrowRight") a.currentTime = Math.min(a.duration || 0, a.currentTime + 10);
          if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 10);
        }}
      >
        <div className="axr-audio__bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <span className="axr-audio__time">
        {format(current)} / {format(duration)}
      </span>

      {src ? (
        <audio
          ref={audioRef}
          src={src}
          // Sin CORS, el analizador de Erlik recibiría silencio: el audio vive
          // en Supabase, que lo sirve con Access-Control-Allow-Origin: *.
          crossOrigin="anonymous"
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => {
            const d = e.currentTarget.duration || 1;
            setCurrent(e.currentTarget.currentTime);
            setProgress(e.currentTarget.currentTime / d);
          }}
        />
      ) : null}

      {src ? <TeacherBubble audioRef={audioRef} playing={playing} plan={plan} copy={t.lesson.teacher} /> : null}
    </div>
  );
}

function format(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
