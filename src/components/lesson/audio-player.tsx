"use client";

import { useEffect, useRef, useState } from "react";

import { addLessonTime } from "@/app/(campus)/lecciones/actions";
import { useI18n } from "@/lib/i18n/provider";

export function LessonAudioPlayer({
  src,
  lessonId,
  lessonTitle,
}: {
  src: string | null;
  lessonId: string;
  lessonTitle: string;
}) {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const sentRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (playing) {
        addLessonTime(lessonId, 5);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [playing, lessonId]);

  useEffect(() => {
    if (!sentRef.current) {
      // Tick once on mount so the lesson counts as visited.
      addLessonTime(lessonId, 1);
      sentRef.current = true;
    }
  }, [lessonId]);

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
        {playing ? "❚❚" : "▶"}
      </button>

      <div className="axr-audio__meta">
        <span className="axr-audio__label">
          {src ? t.lesson.audioNarrated : t.lesson.audioSoon}
        </span>
        <span className="axr-audio__title">{lessonTitle}</span>
      </div>

      <div className="axr-audio__bar">
        <div className="axr-audio__bar-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <span className="axr-audio__time">
        {format(current)} / {format(duration)}
      </span>

      {src ? (
        <audio
          ref={audioRef}
          src={src}
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
