import Link from "next/link";

// ══════════════════════════════════════════════════════════
//  Qué versión de la lección se está editando: español o inglés.
//
//  Va en la URL (?editar=en) y no en el idioma del campus: así un profesor
//  con el campus en español puede revisar la versión inglesa, y al revés,
//  sin cambiar de idioma toda la interfaz. Son enlaces y no un botón con
//  estado: el editor se vuelve a montar con los bloques de esa versión, y
//  lo que hubiera sin guardar en la otra no se mezcla.
// ══════════════════════════════════════════════════════════

export type EditLang = "es" | "en";

export function readEditLang(v: string | string[] | undefined, fallback: EditLang): EditLang {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "en" || s === "es" ? s : fallback;
}

export function EditLangSwitch({
  current,
  basePath,
  labels,
}: {
  current: EditLang;
  basePath: string;
  labels: { editingLang: string; langEs: string; langEn: string };
}) {
  const item = (lang: EditLang, label: string) => (
    <Link
      href={`${basePath}?editar=${lang}`}
      scroll={false}
      aria-current={current === lang ? "true" : undefined}
      className={`axr-btn ${current === lang ? "axr-btn--primary" : "axr-btn--ghost"}`}
      style={{ minHeight: 0, padding: "0.3rem 0.75rem", fontSize: "0.8125rem" }}
    >
      {label}
    </Link>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", margin: "0 0 0.75rem" }}>
      <span style={{ fontSize: "0.8125rem", color: "var(--axr-text-helper)" }}>{labels.editingLang}:</span>
      {item("es", labels.langEs)}
      {item("en", labels.langEn)}
    </div>
  );
}
