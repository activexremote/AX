"use client";

import { useState, useTransition } from "react";

import "@/app/login/login.scss";
import { sendSignInLink, sendSignUpLink } from "@/app/login/actions";
import { useI18n } from "@/lib/i18n/provider";
import { PHONE_OTP_ENABLED } from "@/lib/auth/phone";
import { fmt } from "@/lib/i18n/dictionaries";

type Props = {
  mode: "signin" | "signup";
  redirectTo: string;
};

export function LoginForm({ mode, redirectTo }: Props) {
  const { t, locale } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Email al que se acaba de mandar el enlace. Mientras tenga valor, el
  // formulario desaparece: dejarlo puesto invita a pulsar otra vez y a chocar
  // con el límite de envíos de Supabase.
  const [sent, setSent] = useState<string | null>(null);
  // Los campos van controlados porque React vacía el formulario en cuanto
  // termina una acción, también cuando termina en error: sin esto, cada
  // mensaje de "ese email no existe" obligaría a escribirlo todo otra vez.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("redirect", redirectTo);
    formData.set("locale", locale);
    startTransition(async () => {
      const action = mode === "signin" ? sendSignInLink : sendSignUpLink;
      const result: unknown = await action(formData);
      if (result && typeof result === "object") {
        if ("error" in result && typeof result.error === "string") {
          setError(result.error);
          return;
        }
        if ("sent" in result && typeof result.sent === "string") setSent(result.sent);
      }
    });
  }

  if (sent) {
    return (
      <div className="axr-login__sent">
        <p className="axr-login__sent-title">{t.login.linkSentTitle}</p>
        <p className="axr-login__sent-body">{fmt(t.login.linkSentBody, { email: sent })}</p>
        <p className="axr-login__hint">{t.login.linkSentHint}</p>
        <button
          type="button"
          className="axr-login__ghost"
          onClick={() => setSent(null)}
        >
          {t.login.linkSentRetry}
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit}>
      {error ? <div className="axr-login__error">{error}</div> : null}

      {mode === "signup" && (
        <div className="axr-login__field">
          <label htmlFor="full_name">{t.login.fieldFullName}</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.login.emailPlaceholder}
        />
      </div>

      {mode === "signup" && (
        <div className="axr-login__field">
          <label htmlFor="phone">{t.login.fieldPhone}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.login.phonePlaceholder}
          />
          <span className="axr-login__hint">{t.login.phoneHint}</span>
        </div>
      )}

      <button className="axr-login__submit" type="submit" disabled={pending}>
        {pending
          ? t.common.loading
          : mode === "signin"
            ? t.login.submitSignin
            : t.login.submitSignup}
      </button>

      <p className="axr-login__hint axr-login__hint--block">
        {mode === "signup" && PHONE_OTP_ENABLED ? t.login.magicHintSignup : t.login.magicHint}
      </p>
    </form>
  );
}
