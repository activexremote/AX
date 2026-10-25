"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { Icono, type NombreIcono } from "@/components/admin/publicaciones/iconos";

// ══════════════════════════════════════════════════════════
//  El menú lateral del panel
//
//  Agrupado por lo que se viene a hacer (formación, alumnos, marketing,
//  ajustes), con icono y nombre corto, y la sección en la que se está
//  marcada. Las secciones con apartados (Publicaciones, Banners) los abren
//  sólo cuando se está dentro: el resto del tiempo son una línea.
//
//  En el móvil es un cajón que se abre desde la barra de arriba y se cierra
//  solo al navegar.
// ══════════════════════════════════════════════════════════

export type ItemMenu = {
  href: string;
  label: string;
  icon: NombreIcono;
  /** Sólo esta ruta exacta (el Resumen, que es la raíz del panel). */
  exact?: boolean;
  badge?: number;
  tono?: "alerta" | "neutro";
  sub?: Omit<ItemMenu, "icon" | "sub">[];
};

export type GrupoMenu = { label?: string; items: ItemMenu[] };

export type TextosMenu = { open: string; close: string; viewCampus: string; panel: string };

export function MenuAdmin({
  grupos,
  persona,
  textos,
}: {
  grupos: GrupoMenu[];
  persona: { nombre: string; rol: string; iniciales: string };
  textos: TextosMenu;
}) {
  const path = usePathname();
  const [abierto, setAbierto] = useState(false);

  // Al navegar, el cajón del móvil se cierra.
  useEffect(() => setAbierto(false), [path]);
  useEffect(() => {
    if (!abierto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [abierto]);

  const activo = (it: { href: string; exact?: boolean }) => (it.exact ? path === it.href : path === it.href || path.startsWith(`${it.href}/`));
  // Dentro de una sección con apartados, gana el apartado más concreto.
  const subActivo = (sub: NonNullable<ItemMenu["sub"]>, it: Omit<ItemMenu, "icon" | "sub">) => {
    const candidatos = sub.filter((s) => activo(s));
    const mejor = candidatos.sort((a, b) => b.href.length - a.href.length)[0];
    return mejor?.href === it.href;
  };

  return (
    <>
      <header className="axr-am-top">
        <button type="button" className="axr-am-top__btn" aria-label={textos.open} aria-expanded={abierto} onClick={() => setAbierto(true)}>
          <Icono n="menu" size={20} />
        </button>
        <Link href="/admin" className="axr-am-brand">
          <BrandMark size={18} />
          <span>ActiveXRemote</span>
        </Link>
      </header>

      {abierto ? <div className="axr-am-veil" onClick={() => setAbierto(false)} aria-hidden /> : null}

      <aside className={`axr-am${abierto ? " is-open" : ""}`} aria-label="Panel">
        <div className="axr-am__head">
          <Link href="/admin" className="axr-am-brand">
            <BrandMark size={18} />
            <span>ActiveXRemote</span>
          </Link>
          <span className="axr-am__tag">{textos.panel}</span>
          <button type="button" className="axr-am__close" aria-label={textos.close} onClick={() => setAbierto(false)}>
            <Icono n="cerrar" size={18} />
          </button>
        </div>

        <nav className="axr-am__nav">
          {grupos.map((g, gi) => (
            <div key={g.label ?? gi} className="axr-am__group">
              {g.label ? <div className="axr-am__label">{g.label}</div> : null}
              <ul>
                {g.items.map((it) => {
                  const on = activo(it);
                  return (
                    <li key={it.href}>
                      <Link href={it.href} className={`axr-am__item${on ? " is-active" : ""}`} aria-current={on && !it.sub ? "page" : undefined}>
                        <Icono n={it.icon} size={18} />
                        <span className="axr-am__text">{it.label}</span>
                        {it.badge ? <span className={`axr-am__badge axr-am__badge--${it.tono ?? "neutro"}`}>{it.badge}</span> : null}
                      </Link>
                      {it.sub && on ? (
                        <ul className="axr-am__sub">
                          {it.sub.map((s) => {
                            const sOn = subActivo(it.sub!, s);
                            return (
                              <li key={s.href}>
                                <Link href={s.href} className={`axr-am__subitem${sOn ? " is-active" : ""}`} aria-current={sOn ? "page" : undefined}>
                                  <span className="axr-am__text">{s.label}</span>
                                  {s.badge ? <span className={`axr-am__badge axr-am__badge--${s.tono ?? "neutro"}`}>{s.badge}</span> : null}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="axr-am__foot">
          <div className="axr-am__me">
            <span className="axr-am__avatar" aria-hidden>
              {persona.iniciales}
            </span>
            <span className="axr-am__who">
              <strong>{persona.nombre}</strong>
              <small>{persona.rol}</small>
            </span>
          </div>
          <div className="axr-am__actions">
            <LocaleToggle />
            <Link href="/" className="axr-am__campus">
              <Icono n="salir" size={16} /> {textos.viewCampus}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
