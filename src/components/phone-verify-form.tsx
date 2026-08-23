"use client";

import { useState, useTransition } from "react";

import "@/app/login/login.scss";
import { sendPhoneCode, verifyPhoneCode } from "@/app/verificar-telefono/actions";
import { useI18n } from "@/lib/i18n/provider";
import { fmt } from "@/lib/i18n/dictionaries";

type Props = {
  /** Número declarado en el registro, todavía sin confirmar. */
  phone: string;
  /** A dónde iba la persona antes de que se le pidiera el teléfono. */
  next: string;
};

export function PhoneVerifyForm({ phone, next }: Props) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [number, setNumber] = useState(phone);
  // Dos pasos en la misma pantalla: pedir el SMS y meter el código. El código
  // no se enseña antes de mandarlo para no dejar un campo vacío pidiendo algo
  // que todavía no ha llegado a ningún sitio.
  const [step, setStep] = useState<"send" | "code">("send");

  function run(fn: () => Promise<unknown>, onOk: (result: Record<string, unknown>) => void) {
    setError(null);
    startTransition(async () => {
      const result = (await fn()) as Record<string, unknown> | undefined;
      if (result && typeof result === "object") {
        if (typeof result.error === "string") {
          setError(result.error);
          return;
        }
        onOk(result);
      }
    });
  }

  function handleSend(formData: FormData) {
    formData.set("phone", number);
    run(
      () => sendPhoneCode(formData),
      (result) => {
        // El proyecto puede tener desactivada la confirmación de teléfono: en
        // ese caso no hay SMS que esperar y se entra directamente.
        if (result.verified) {
          window.location.assign(next || "/");
          return;
        }
        setStep("code");
      },
    );
  }

  function handleVerify(formData: FormData) {
    formData.set("phone", number);
    formData.set("next", next);
    run(
      () => verifyPhoneCode(formData),
      (result) => {
        // Navegación dura: el proxy tiene que volver a leer la sesión para
        // dejar pasar al campus.
        window.location.assign(typeof result.redirect === "string" ? result.redirect : "/");
      },
    );
  }

  return (
    <>
      {error ? <div className="axr-login__error">{error}</div> : null}

      {step === "send" ? (
        <form action={handleSend}>
          <div className="axr-login__field">
            <label htmlFor="phone">{t.verify.fieldPhone}</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t.login.phonePlaceholder}
            />
            <span className="axr-login__hint">{t.login.phoneHint}</span>
          </div>

          <button className="axr-login__submit" type="submit" disabled={pending}>
            {pending ? t.common.loading : t.verify.send}
          </button>
        </form>
      ) : (
        <form action={handleVerify}>
          <div className="axr-login__ok">{fmt(t.verify.sent, { phone: number })}</div>

          <div className="axr-login__field">
            <label htmlFor="token">{t.verify.fieldCode}</label>
            <input
              id="token"
              name="token"
              // `type="text"` con inputMode numérico: con type="number" el
              // navegador se come los ceros a la izquierda del código.
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
              placeholder="000000"
              className="axr-login__code"
            />
          </div>

          <button className="axr-login__submit" type="submit" disabled={pending}>
            {pending ? t.common.loading : t.verify.submit}
          </button>

          <div className="axr-login__actions">
            <button
              type="button"
              className="axr-login__ghost"
              disabled={pending}
              onClick={() => {
                const fd = new FormData();
                fd.set("phone", number);
                run(
                  () => sendPhoneCode(fd),
                  () => setStep("code"),
                );
              }}
            >
              {t.verify.resend}
            </button>
            <button
              type="button"
              className="axr-login__ghost"
              disabled={pending}
              onClick={() => {
                setError(null);
                setStep("send");
              }}
            >
              {t.verify.change}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
