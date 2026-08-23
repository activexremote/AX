"use client";

import { useState } from "react";

import { METRIC_INFO } from "@/lib/lens/calculadora";

export function MetricCard({
  metricKey,
  value,
  tone,
}: {
  metricKey: keyof typeof METRIC_INFO;
  value: string;
  tone?: "positive" | "negative";
}) {
  const [open, setOpen] = useState(false);
  const info = METRIC_INFO[metricKey];

  return (
    <div className={`axr-calc__kpi${tone ? ` axr-calc__kpi--${tone}` : ""}`}>
      <div className="axr-calc__kpi-top">
        <span className="axr-calc__kpi-label">{info.label}</span>
        <button
          type="button"
          className="axr-calc__info-btn"
          aria-expanded={open}
          aria-label={`Qué es ${info.label}`}
          onClick={() => setOpen((v) => !v)}
        >
          i
        </button>
      </div>
      <div className={`axr-calc__kpi-value${tone ? ` axr-calc__kpi-value--${tone}` : ""}`}>{value}</div>
      {open ? (
        <div className="axr-calc__info-panel">
          <div>{info.explanation}</div>
          <div>
            <strong>Cálculo: </strong>
            {info.formula}
          </div>
        </div>
      ) : null}
    </div>
  );
}
