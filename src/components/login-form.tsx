"use client";

import { useState, useTransition } from "react";

import "@/app/login/login.scss";
import { signInWithGoogle } from "@/app/login/actions";
import { useI18n } from "@/lib/i18n/provider";

type Props = {
  mode: "signin" | "signup";
  redirectTo: string;
  /** Error con el que vuelve Google o el callback (?error=…). */
  initialError?: string | null;
};

/**
 * Al campus sólo se entra con Google. Entrar y registrarse son el mismo botón:
 * si la cuenta no existe, Supabase la crea con el nombre y la foto de Google.
 * Crear la cuenta NO abre el contenido: eso lo hace la matrícula (ver
 * `PendingAccess` en el layout del campus).
 */
export function LoginForm({ mode, redirectTo, initialError }: Props) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(initialError ? t.login.oauthFailed : null);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("redirect", redirectTo);
    startTransition(async () => {
      // Si va bien, la acción redirige a Google y esto no vuelve nunca.
      const result = await signInWithGoogle(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit}>
      {error ? <div className="axr-login__error">{error}</div> : null}

      <button className="axr-login__google" type="submit" disabled={pending}>
        <GoogleG />
        <span>{pending ? t.common.loading : t.login.googleButton}</span>
      </button>

      <p className="axr-login__hint axr-login__hint--block">
        {mode === "signup" ? t.login.googleHintSignup : t.login.googleHint}
      </p>
    </form>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
