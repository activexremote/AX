"use client";

import type { BanCopy } from "@/lib/i18n/banners";

// Una carpeta de la lista, ninguna o una nueva con el nombre que se escriba.
// Con `name`, viaja en un formulario como «folder» y «folder_new»
// (actions.ts → carpetaDelFormulario).

export type ValorCarpeta = { v: string; nueva: string };

export function ElegirCarpeta({
  carpetas,
  value,
  onChange,
  copy,
  name,
  label,
}: {
  carpetas: { id: string; name: string }[];
  value: ValorCarpeta;
  onChange: (v: ValorCarpeta) => void;
  copy: BanCopy;
  /** Para un formulario: los campos «folder» y «folder_new». */
  name?: boolean;
  label?: string;
}) {
  return (
    <div className="axr-ban-folderpick">
      {label ? <span>{label}</span> : null}
      <select value={value.v} name={name ? "folder" : undefined} onChange={(e) => onChange({ ...value, v: e.target.value })} aria-label={label ?? copy.folder}>
        <option value="">{copy.folderNone}</option>
        {carpetas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value="nueva">{copy.folderNew}</option>
      </select>
      {value.v === "nueva" ? (
        <input
          name={name ? "folder_new" : undefined}
          value={value.nueva}
          maxLength={80}
          placeholder={copy.folderNewPh}
          onChange={(e) => onChange({ ...value, nueva: e.target.value })}
          autoFocus
        />
      ) : null}
    </div>
  );
}
