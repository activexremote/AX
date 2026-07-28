import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { SlackLogo } from "@/components/slack-logo";
import { LoginForm } from "@/components/login-form";
import { LocaleToggle } from "@/components/locale-toggle";
import { getI18n } from "@/lib/i18n/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; mode?: "signin" | "signup" }>;
}) {
  const sp = await searchParams;
  const mode = sp.mode === "signup" ? "signup" : "signin";
  const { t } = await getI18n();
  const tracks = [t.login.track1, t.login.track2, t.login.track3];

  return (
    <main className="axr-login">
      <div className="axr-login__frame">
        <header className="axr-login__bar">
          <span className="axr-login__bar-left">
            <span className="axr-login__bar-dot" aria-hidden /> {t.login.barAccess}
          </span>
          <span className="axr-login__bar-meta">
            <span className="axr-login__bar-right">{t.login.barTagline}</span>
            <LocaleToggle />
          </span>
        </header>

        <div className="axr-login__grid">
          <section className="axr-login__intro">
            <div className="axr-login__brand">
              <BrandMark size={26} />
              <div>
                <div className="axr-login__wordmark">ActiveXRemote</div>
                <div className="axr-login__eyebrow">{t.login.campusEyebrow}</div>
              </div>
            </div>

            <h1 className="axr-login__headline">{t.login.headline}</h1>
            <p className="axr-login__lead">{t.login.lead}</p>

            <ul className="axr-login__tracks">
              {tracks.map((track, i) => (
                <li key={track} className="axr-login__track">
                  <span className="axr-login__track-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{track}</span>
                </li>
              ))}
            </ul>

            <div className="axr-login__integration">
              <SlackLogo size={18} />
              <span>
                <strong>{t.login.integrationTitle}</strong>
                {t.login.integrationDesc}
              </span>
            </div>

            <p className="axr-login__signature">
              <span aria-hidden>{"// "}</span>
              {t.login.signature}
            </p>
          </section>

          <section className="axr-login__access">
            <div className="axr-login__access-head">
              <span className="axr-login__eyebrow">
                {mode === "signin" ? t.login.eyebrowSignin : t.login.eyebrowSignup}
              </span>
              <h2 className="axr-login__access-title">
                {mode === "signin" ? t.login.titleSignin : t.login.titleSignup}
              </h2>
            </div>

            <LoginForm mode={mode} redirectTo={sp.redirect ?? "/"} />

            <p className="axr-login__switch">
              {mode === "signin" ? (
                <>
                  {t.login.switchToSignupQuestion}{" "}
                  <Link href="/login?mode=signup">{t.login.switchToSignupLink}</Link>
                </>
              ) : (
                <>
                  {t.login.switchToSigninQuestion}{" "}
                  <Link href="/login?mode=signin">{t.login.switchToSigninLink}</Link>
                </>
              )}
            </p>
          </section>
        </div>

        <footer className="axr-login__foot">
          <span>{t.login.footName}</span>
          <span>v1.0</span>
        </footer>
      </div>
    </main>
  );
}
