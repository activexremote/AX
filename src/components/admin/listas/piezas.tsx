"use client";

import { useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";

import "./listas.scss";

// Piezas que comparten las listas del panel (Tareas, Usuarios, Matrículas).

/** La caja de buscar, con su lupa. Filtra mientras se escribe. */
export function Buscador({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="axr-al-search">
      <Icono n="buscar" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  );
}

/** Pestañas de filtro, cada una con cuántas cosas tiene. */
export function Segmentos<K extends string>({
  opciones,
  valor,
  onChange,
  label,
}: {
  opciones: { key: K; label: string; n?: number }[];
  valor: K;
  onChange: (k: K) => void;
  label: string;
}) {
  return (
    <div className="axr-al-seg" role="group" aria-label={label}>
      {opciones.map((o) => (
        <button key={o.key} type="button" aria-pressed={valor === o.key} onClick={() => onChange(o.key)}>
          {o.label}
          {o.n !== undefined ? <small>{o.n}</small> : null}
        </button>
      ))}
    </div>
  );
}

/** Lápiz para «editar» (no está entre los iconos de publicaciones). */
export function IconoEditar() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
    </svg>
  );
}

/** Borrar en dos pasos: papelera → «¿Seguro?» + cancelar. Sin diálogos del navegador. */
export function BorrarEnDosPasos({
  onConfirm,
  label,
  confirmar,
  cancelar,
  disabled,
}: {
  onConfirm: () => void;
  label: string;
  confirmar: string;
  cancelar: string;
  disabled?: boolean;
}) {
  const [armado, setArmado] = useState(false);
  if (!armado) {
    return (
      <button type="button" className="axr-al-icon axr-al-icon--danger" aria-label={label} title={label} disabled={disabled} onClick={() => setArmado(true)}>
        <Icono n="papelera" />
      </button>
    );
  }
  return (
    <span className="axr-al-actions">
      <button type="button" className="axr-btn axr-btn--danger axr-btn--small" disabled={disabled} onClick={onConfirm}>
        {confirmar}
      </button>
      <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setArmado(false)}>
        {cancelar}
      </button>
    </span>
  );
}

/** Copia un email al portapapeles y lo confirma un momento. */
export function CopiarEmail({ email, label, hecho }: { email: string; label: string; hecho: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="axr-btn axr-btn--ghost axr-btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* sin permiso de portapapeles: el email está a la vista */
        }
      }}
    >
      {ok ? <Icono n="ok" size={14} /> : null}
      {ok ? hecho : label}
    </button>
  );
}

/** Iniciales para el avatar: dos letras del nombre, o la primera del email. */
export function iniciales(nombre: string | null | undefined, email: string | null | undefined): string {
  const base = (nombre || email || "?").trim();
  const partes = base.split(/\s+/).filter(Boolean);
  if (nombre && partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return base.slice(0, 1).toUpperCase();
}

/** Para buscar sin que importen tildes ni mayúsculas. */
export const normal = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
