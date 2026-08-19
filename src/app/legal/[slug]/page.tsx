import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { getLocale } from "@/lib/i18n/server";
import { ENTITY_READY, EU_REP_READY } from "@/app/legal/entity";
import { LEGAL_SLUGS, legalDocs, legalNav, type LegalSlug } from "@/app/legal/copy";
import "@/app/bienvenida/landing.scss";
import "@/app/legal/legal.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

function isSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const locale = await getLocale();
  const doc = legalDocs[locale][slug];
  return {
    title: `${doc.title} · ActiveXRemote`,
    description: doc.summary,
    // Son páginas de servicio: que no compitan por posicionamiento.
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();

  const locale = await getLocale();
  const doc = legalDocs[locale][slug];
  const nav = legalNav[locale];

  return (
    <main className="axr-lp axr-legal">
      <LandingNav base="/bienvenida" />

      <article className="axr-legal__doc">
        <header className="axr-legal__head">
          <span className="axr-lp__eyebrow">{nav.eyebrow}</span>
          <h1>{doc.title}</h1>
          <p className="axr-legal__summary">{doc.summary}</p>
          <p className="axr-legal__updated">
            {nav.updatedLabel}: <time>{doc.updated}</time>
          </p>
        </header>

        {/* Si falta un dato obligatorio, el documento no es válido: se avisa
            en la propia página en vez de publicarlo con huecos silenciosos. */}
        {!ENTITY_READY && (
          <p className="axr-legal__warning" role="alert">
            {nav.warning}
          </p>
        )}
        {/* El representante en la UE sólo lo exige el RGPD: aviso aparte y
            sólo donde importa. */}
        {!EU_REP_READY && slug === "privacidad" && (
          <p className="axr-legal__warning" role="alert">
            {nav.warningRep}
          </p>
        )}

        <nav className="axr-legal__tabs" aria-label={nav.indexLabel}>
          {LEGAL_SLUGS.map((s) => (
            <Link key={s} href={`/legal/${s}`} aria-current={s === slug ? "page" : undefined}>
              {nav.labels[s]}
            </Link>
          ))}
          <CookieSettingsLink className="axr-legal__tabs-cookies" label={nav.cookieSettings} />
        </nav>

        <div className="axr-legal__body">
          {doc.sections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              {section.blocks.map((block, i) => {
                if (block.t === "p") return <p key={i}>{block.text}</p>;
                if (block.t === "note")
                  return (
                    <p key={i} className="axr-legal__note">
                      {block.text}
                    </p>
                  );
                if (block.t === "ul")
                  return (
                    <ul key={i}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                return (
                  // El scroll propio evita que una tabla ancha desborde el móvil.
                  <div key={i} className="axr-legal__table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {block.head.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, j) => (
                              <td key={j}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </article>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
