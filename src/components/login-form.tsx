"use client";

import { useState, useTransition } from "react";

import "@/app/login/login.scss";
import { signInWithPassword, signUpWithPassword } from "@/app/login/actions";
import { useI18n } from "@/lib/i18n/provider";

type Props = {
  mode: "signin" | "signup";
  redirectTo: string;
};

export function LoginForm({ mode, redirectTo }: Props) {
  const { t, locale } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setOk(null);
    formData.set("redirect", redirectTo);
    formData.set("locale", locale);
    startTransition(async () => {
      const action = mode === "signin" ? signInWithPassword : signUpWithPassword;
      const result: unknown = await action(formData);
      if (result && typeof result === "object") {
        if ("error" in result && typeof result.error === "string") {
          setError(result.error);
          return;
        }
        // Navegación dura, no router.push: es la que hace que el navegador
        // ofrezca guardar el email y la contraseña que se acaban de enviar.
        // Con una navegación de cliente el gestor nunca ve el envío.
        if ("redirect" in result && typeof result.redirect === "string") {
          window.location.assign(result.redirect);
          return;
        }
        if ("message" in result && typeof result.message === "string") setOk(result.message);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      {error ? <div className="axr-login__error">{error}</div> : null}
      {ok ? <div className="axr-login__ok">{ok}</div> : null}

      {mode === "signup" && (
        <div className="axr-login__field">
          <label htmlFor="full_name">{t.login.fieldFullName}</label>
          <input id="full_name" name="full_name" type="text" autoComplete="name" />
        </div>
      )}

      <div className="axr-login__field">
        <label htmlFor="email">{t.login.fieldEmail}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t.login.emailPlaceholder}
        />
      </div>

      <div className="axr-login__field">
        <label htmlFor="password">{t.login.fieldPassword}</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          required
          minLength={6}
        />
      </div>

      <button className="axr-login__submit" type="submit" disabled={pending}>
        {pending
          ? t.common.loading
          : mode === "signin"
            ? t.login.submitSignin
            : t.login.submitSignup}
      </button>
    </form>
  );
}
