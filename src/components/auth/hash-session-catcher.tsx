"use client";

import { useEffect } from "react";

// ══════════════════════════════════════════════════════════
//  La llave que se queda en la puerta
//
//  Los enlaces de acceso pueden traer la sesión en el FRAGMENTO de la URL:
//
//      https://activexremote.com/#access_token=…&refresh_token=…
//
//  El fragmento no se envía al servidor —eso no es una peculiaridad de Next,
//  es cómo funciona la web—, así que la página se pinta como si no hubiera
//  nadie: quien acaba de pulsar el enlace del correo ve la portada y cree que
//  el acceso ha fallado, con la sesión colgando en su propia barra de
//  direcciones.
//
//  Este componente va en el layout raíz y mira una sola cosa: si el fragmento
//  trae tokens, se lleva la URL entera —fragmento incluido— a /auth/sesion,
//  que es quien sabe recogerlos. En cualquier otra página no hace nada y no
//  pinta nada.
//
//  `replace` y no `push`: la URL con la llave dentro no tiene por qué quedarse
//  en el historial del navegador.
// ══════════════════════════════════════════════════════════

export function HashSessionCatcher() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token=")) return;
    // Si ya estamos en la página que los recoge, no hay nada que hacer.
    if (window.location.pathname === "/auth/sesion") return;
    // El destino es donde aterrizó, salvo la portada pública: de ahí se entra
    // al campus, que es lo que la persona venía buscando.
    const aterrizaje = window.location.pathname;
    const next = aterrizaje === "/bienvenida" ? "/" : aterrizaje;
    window.location.replace(`/auth/sesion?next=${encodeURIComponent(next)}${hash}`);
  }, []);

  return null;
}
