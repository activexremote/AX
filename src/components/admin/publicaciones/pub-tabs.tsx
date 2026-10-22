"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icono, type NombreIcono } from "@/components/admin/publicaciones/iconos";

// ══════════════════════════════════════════════════════════
//  La cabecera de la sección
//
//  Siempre arriba, en todas las pantallas de publicaciones:
//
//   · las pestañas, con el número de lo que espera en cada una (si «Por
//     revisar» tiene un 3, hay tres cosas esperando sin tener que entrar);
//   · el botón de crear, que nunca se esconde;
//   · la barra de estado: hasta cuándo va cubierto cada canal, el saldo de la
//     IA y la cuota del mes. En verde lo que va bien, en ámbar lo que pronto
//     dejará de ir, en rojo lo que ya no va. Cada cosa lleva a donde se arregla.
// ══════════════════════════════════════════════════════════

export type Tab = { href: string; label: string; icon: NombreIcono; exact?: boolean; badge?: number; tono?: "alerta" | "neutro"; punto?: boolean };
export type Chip = { tono: "ok" | "aviso" | "mal" | "neutro"; label: string; valor: string; href: string; externo?: boolean; canal?: string };

// La usa también la sección de banners: `nuevaHref` y `label` cambian de una a otra.
export function PubHeader({
  tabs,
  nueva,
  chips,
  estadoLabel,
  nuevaHref = "/admin/publicaciones/nueva",
  label = "Publicaciones",
}: {
  tabs: Tab[];
  nueva: string;
  chips: Chip[];
  estadoLabel: string;
  nuevaHref?: string;
  label?: string;
}) {
  const path = usePathname();
  // Una publicación abierta (/admin/publicaciones/<id>) cuelga del inicio.
  const propias = tabs.filter((t) => !t.exact).map((t) => t.href);
  const activa = (t: Tab) =>
    t.exact ? path === t.href || (path.startsWith(`${t.href}/`) && !propias.some((p) => path.startsWith(p)) && !path.endsWith("/nueva")) : path.startsWith(t.href);

  return (
    <header className="axr-pubh">
      <div className="axr-pubh__top">
        <nav className="axr-pubh__tabs" aria-label={label}>
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className={`axr-pubh__tab${activa(t) ? " is-active" : ""}`} aria-current={activa(t) ? "page" : undefined}>
              <Icono n={t.icon} />
              <span>{t.label}</span>
              {t.badge ? <span className={`axr-pubh__badge axr-pubh__badge--${t.tono ?? "neutro"}`}>{t.badge}</span> : null}
              {t.punto ? <span className="axr-pubh__dot" aria-hidden /> : null}
            </Link>
          ))}
        </nav>
        <Link href={nuevaHref} className={`axr-pubh__new${path.endsWith("/nueva") ? " is-active" : ""}`}>
          <Icono n="mas" />
          {nueva}
        </Link>
      </div>
      <div className="axr-pubh__status" aria-label={estadoLabel}>
        {chips.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`axr-pubh__chip axr-pubh__chip--${c.tono}`}
            {...(c.externo ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {c.canal ? <span className={`axr-pub-dot axr-pub-dot--${c.canal}`} /> : <span className="axr-pubh__led" />}
            <span className="axr-pubh__chip-label">{c.label}</span>
            <strong>{c.valor}</strong>
          </Link>
        ))}
      </div>
    </header>
  );
}
