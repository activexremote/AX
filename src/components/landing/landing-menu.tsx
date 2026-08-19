"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import type { LandingCopy } from "@/app/bienvenida/copy";

type NavCopy = LandingCopy["nav"];

// Menú del móvil. Por debajo de 981px el nav no tiene sitio para los enlaces,
// así que se pliegan en una hoja a pantalla completa. Es cliente porque hay
// que cerrarla al navegar, con Escape, y bloquear el scroll del fondo — cosas
// que un <details> sin JS deja a medias.
export function LandingMenu({ copy, base = "" }: { copy: NavCopy; base?: string }) {
  const [open, setOpen] = useState(false);
  // Ancla pendiente: el salto se hace cuando la hoja ya se ha cerrado y el
  // body ha recuperado su scroll, si no compiten entre sí.
  const [pendingHash, setPendingHash] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Bloquea el scroll del fondo mientras la hoja está abierta. En iOS hace
    // falta fijar el body: `overflow: hidden` a secas no frena el rebote.
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // El foco entra en la hoja para que el teclado y VoiceOver no se queden
    // navegando la página de detrás.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      buttonRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open || !pendingHash) return;
    const target = document.getElementById(pendingHash);
    setPendingHash(null);
    if (!target) return;
    // Un frame de margen: la restauración del scroll ya ha ocurrido.
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      history.replaceState(null, "", `#${pendingHash}`);
    });
  }, [open, pendingHash]);

  // Cualquier enlace cierra la hoja: los anclajes (#faq) no cambian de ruta,
  // así que nadie la cerraría por nosotros.
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest("a");
    if (!link) return;
    const href = link.getAttribute("href") ?? "";
    if (href.startsWith("#")) {
      e.preventDefault();
      setPendingHash(href.slice(1));
    }
    setOpen(false);
  }

  const anchor = (href: string) => (href.startsWith("#") ? `${base}${href}` : href);

  const panel = (
    <div
      id="axr-lp-menu"
      ref={panelRef}
      className="axr-lp__menu"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={copy.menuOpen}
      onClick={handleClick}
    >
      <div className="axr-lp__menu-head">
        <Link href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
          <BrandMark size={22} />
          <span>ActiveXRemote</span>
        </Link>
        <button
          type="button"
          className="axr-lp__menu-close"
          aria-label={copy.menuClose}
          onClick={() => setOpen(false)}
        >
          <span aria-hidden>✕</span>
        </button>
      </div>

      <div className="axr-lp__menu-body">
        <div className="axr-lp__menu-group">
          <span className="axr-lp__eyebrow">{copy.courses.label}</span>
          {copy.courses.items.map((l) => (
            <Link key={l.href} href={l.href} className="axr-lp__menu-link">
              {l.label}
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>

        <div className="axr-lp__menu-group">
          <span className="axr-lp__eyebrow">{copy.menuExplore}</span>
          {copy.links.map((l) => (
            <a key={l.href} href={anchor(l.href)} className="axr-lp__menu-link">
              {l.label}
              <span aria-hidden>→</span>
            </a>
          ))}
          <Link href="/login" className="axr-lp__menu-link">
            {copy.campus}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="axr-lp__menu-locale">
          <LocaleToggle />
        </div>
      </div>

      <div className="axr-lp__menu-foot">
        <a href={anchor("#solicitar")} className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
          {copy.cta}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="axr-lp__burger"
        aria-expanded={open}
        aria-controls="axr-lp-menu"
        aria-label={open ? copy.menuClose : copy.menuOpen}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="axr-lp__burger-box" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* A <body>: la píldora del nav lleva backdrop-filter y eso la convierte
          en bloque contenedor de sus hijos `position: fixed`, así que dentro de
          ella la hoja se dibujaba del tamaño de la barra. */}
      {open && createPortal(panel, document.body)}
    </>
  );
}
