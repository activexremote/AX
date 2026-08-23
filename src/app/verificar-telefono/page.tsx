import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { PhoneVerifyForm } from "@/components/phone-verify-form";
import { createClient } from "@/lib/supabase/server";
import { PHONE_OTP_ENABLED } from "@/lib/auth/phone";
import { getI18n } from "@/lib/i18n/server";

/**
 * Segundo paso del registro. Se llega aquí con sesión recién hecha —el enlace
 * del correo acaba de canjearse— y con un teléfono declarado pero sin
 * confirmar. El proxy manda aquí a quien esté en ese estado y no deja salir
 * al campus hasta que el SMS se conteste.
 */
export default async function VerificarTelefonoPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Con el SMS apagado esta pantalla no existe para nadie: ni el proxy manda
  // aquí ni se llega escribiendo la URL.
  if (!PHONE_OTP_ENABLED) redirect("/");

  const sp = await searchParams;
  const { t } = await getI18n();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  // Quien no tenga nada pendiente no pinta nada en esta pantalla.
  if (user.phone_confirmed_at) redirect("/");

  const pending = String(user.user_metadata?.phone ?? "");

  return (
    <main className="axr-login">
      <div className="axr-login__frame axr-login__frame--narrow">
        <header className="axr-login__bar">
          <span className="axr-login__bar-left">
            <span className="axr-login__bar-dot" aria-hidden /> {t.verify.bar}
          </span>
          <span className="axr-login__bar-meta">
            <LocaleToggle />
          </span>
        </header>

        <section className="axr-login__access">
          <div className="axr-login__brand">
            <BrandMark size={26} />
            <div>
              <div className="axr-login__wordmark">ActiveXRemote</div>
              <div className="axr-login__eyebrow">{t.verify.eyebrow}</div>
            </div>
          </div>

          <div className="axr-login__access-head">
            <h1 className="axr-login__access-title">{t.verify.title}</h1>
            <p className="axr-login__lead">{t.verify.lead}</p>
          </div>

          <PhoneVerifyForm phone={pending} next={sp.next ?? "/"} />

          <form action="/auth/sign-out" method="post" className="axr-login__switch">
            <button type="submit" className="axr-login__ghost">
              {t.verify.signOut}
            </button>
          </form>
        </section>

        <footer className="axr-login__foot">
          <span>{t.login.footName}</span>
          <span>v1.0</span>
        </footer>
      </div>
    </main>
  );
}
