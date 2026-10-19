"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; exact?: boolean; primary?: boolean };

/** Las pestañas de la sección: siempre a la vista, para que nadie se pierda. */
export function PubTabs({ tabs }: { tabs: Tab[] }) {
  const path = usePathname();
  // Una publicación abierta (/admin/publicaciones/<id>) cuelga del resumen.
  const propias = tabs.filter((t) => !t.exact).map((t) => t.href);
  const activa = (t: Tab) =>
    t.exact ? path === t.href || (path.startsWith(`${t.href}/`) && !propias.some((p) => path.startsWith(p))) : path.startsWith(t.href);

  return (
    <nav className="axr-pub-tabs" aria-label="Publicaciones">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`axr-pub-tabs__tab${activa(t) ? " is-active" : ""}${t.primary ? " is-primary" : ""}`}
          aria-current={activa(t) ? "page" : undefined}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
