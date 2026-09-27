"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

// ══════════════════════════════════════════════════════════
//  La sesión que viaja en el fragmento de la URL
//
//  Un enlace de acceso puede llegar de dos formas:
//
//   · ?code=…            → lo canjea el servidor en /auth/callback.
//   · #access_token=…    → los tokens vienen en el FRAGMENTO, y un fragmento
//                          NO SE ENVÍA AL SERVIDOR. Nunca. Ni al servidor de
//                          la página, ni en ninguna redirección.
//
//  La segunda es la que dejaba a todo el mundo fuera: el enlace del correo
//  aterrizaba en la portada con los tokens colgando detrás de la almohadilla,
//  el servidor no veía ninguna sesión y servía la landing. Parecía que el
//  acceso había fallado cuando en realidad la llave estaba en la puerta.
//
//  Esta página es la única que puede recogerla, porque corre en el navegador.
//  Lee el fragmento, guarda la sesión y sigue al destino. Y lo primero que
//  hace después es borrar el fragmento de la barra de direcciones: un
//  `access_token` en una URL es una llave, y las llaves no se dejan en sitios
//  que se copian y se pegan.
// ══════════════════════════════════════════════════════════

type Estado = "trabajando" | "error";

export default function AuthSesionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [estado, setEstado] = useState<Estado>("trabajando");
  const [detalle, setDetalle] = useState<string | null>(null);

  useEffect(() => {
    const next = params.get("next") || "/";

    async function entrar() {
      // `location.hash` incluye la almohadilla: fuera antes de parsear.
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      // Supabase también usa el fragmento para contar lo que salió mal.
      const errorDescripcion = hash.get("error_description") || params.get("error_description");
      if (errorDescripcion) {
        setDetalle(errorDescripcion);
        setEstado("error");
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (!accessToken || !refreshToken) {
        // Sin tokens no hay nada que recoger: o el enlace ya se usó, o se
        // abrió en un navegador distinto del que lo pidió.
        setEstado("error");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        setDetalle(error.message);
        setEstado("error");
        return;
      }

      // La llave, fuera de la barra de direcciones.
      window.history.replaceState(null, "", window.location.pathname);
      // `refresh()` antes de navegar: el servidor tiene que volver a mirar la
      // sesión, o el campus se pintaría todavía como si no hubiera nadie.
      router.replace(next);
      router.refresh();
    }

    void entrar();
  }, [params, router]);

  return (
    <main className="axr-login">
      <div className="axr-login__panel" style={{ maxWidth: "26rem", margin: "4rem auto", textAlign: "center" }}>
        {estado === "trabajando" ? (
          <p>Entrando…</p>
        ) : (
          <>
            <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Este enlace ya no sirve</h1>
            <p style={{ color: "var(--axr-text-secondary)", fontSize: "0.875rem" }}>
              Los enlaces de acceso caducan y sólo se pueden usar una vez. Ábrelo en el mismo navegador
              desde el que lo pediste, o pide uno nuevo.
            </p>
            {detalle ? (
              <p style={{ color: "var(--axr-text-helper)", fontSize: "0.75rem" }}>{detalle}</p>
            ) : null}
            <a href="/login" className="axr-btn" style={{ marginTop: "1rem", display: "inline-block" }}>
              Pedir un enlace nuevo
            </a>
          </>
        )}
      </div>
    </main>
  );
}
