import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "./privado.scss";

// Vídeos internos, fuera del menú y del sitemap. La URL es la llave: quien no
// tiene el código recibe un 404 normal, igual que en una ruta que no existe.
// Los vídeos son HTML estático en public/privado/<código>/ y no pasan por el
// candado del campus (ver PUBLIC_PATHS en lib/supabase/middleware.ts).
const CODIGO = "6929bc970e6c79dd81";

export const metadata: Metadata = {
  title: "Vídeos internos",
  robots: { index: false, follow: false, nocache: true },
};

type Params = { token: string };

export default async function Privado({ params }: { params: Promise<Params> }) {
  const { token } = await params;
  if (token !== CODIGO) notFound();
  const base = `/privado/${CODIGO}`;

  return (
    <main className="axr-priv">
      <header className="axr-priv__head">
        <p className="axr-priv__eyebrow">ActiveXRemote · solo para el equipo</p>
        <h1>Los cursos, en vídeo</h1>
        <p>Esta página no está enlazada desde ningún sitio ni la indexan los buscadores. Compártela solo con quien deba verla.</p>
      </header>
      <div className="axr-priv__grid">
        <a className="axr-priv__card axr-priv__card--both" href={`${base}/presentacion.html`}>
          <span className="axr-priv__tag">Presentación · 1 min 40 s</span>
          <strong>Los dos caminos</strong>
          <span>Remote Professional y Remote Founder en diez escenas animadas, con sonido opcional.</span>
          <span className="axr-priv__go">Ver la presentación →</span>
        </a>
        <a className="axr-priv__card axr-priv__card--class" href={`${base}/clase.html`}>
          <span className="axr-priv__tag">Clase · unos 15 min · voz en off</span>
          <strong>La clase del temario</strong>
          <span>Las 21 semanas de los dos cursos explicadas una a una: qué trabajas, qué te llevas y el hito de cada semana.</span>
          <span className="axr-priv__go">Empezar la clase →</span>
        </a>
        <a className="axr-priv__card axr-priv__card--master" href={`${base}/masterclass.html`}>
          <span className="axr-priv__tag">Masterclass piloto · unos 10 min · voz en off</span>
          <strong>Dónde montar tu empresa</strong>
          <span>Semana 12 de Remote Founder: LLC en EE. UU., Estonia, Emiratos o una SL en España, con cifras de 2026, gráficos y proveedores.</span>
          <span className="axr-priv__go">Ver la masterclass →</span>
        </a>
      </div>
    </main>
  );
}
