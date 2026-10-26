import type { Metadata } from "next";

import { BrandMark } from "@/components/brand-mark";
import { leerFirmado } from "@/lib/mcp/oauth";
import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";

import { denegar, permitir } from "./actions";
import "./autorizar.scss";

// La pantalla de «¿Dejas que Claude use tu cuenta?». Se llega desde
// /api/mcp/oauth/authorize con la solicitud firmada en la ruta; el proxy ya
// ha pedido iniciar sesión si hacía falta.

export const metadata: Metadata = { title: "Conectar Claude", robots: { index: false, follow: false } };

export default async function AutorizarPage({ params }: { params: Promise<{ solicitud: string }> }) {
  const { solicitud } = await params;
  const sol = leerFirmado<{ c: string; r: string }>(solicitud);
  const perfil = await getCurrentProfile();
  const { data: cliente } = sol ? await createAdminClient().from("mcp_clients").select("name").eq("id", sol.c).maybeSingle() : { data: null };
  const nombre = (cliente?.name as string | undefined) || "Claude";
  const destino = sol ? new URL(sol.r).host : "";
  const esAdmin = perfil?.role === "administrador";

  return (
    <main className="axr-mcpauth">
      <section className="axr-mcpauth__card">
        <div className="axr-mcpauth__brand">
          <BrandMark size={22} />
          <span>ActiveXRemote</span>
        </div>
        {!sol ? (
          <>
            <h1>Esta solicitud ha caducado</h1>
            <p>Vuelve a Claude y conecta otra vez el conector.</p>
          </>
        ) : !esAdmin ? (
          <>
            <h1>No puedes conectar Claude con esta cuenta</h1>
            <p>El conector de banners y publicaciones es sólo para administradores. Has entrado como {perfil?.email ?? "otra cuenta"}.</p>
            <form action={denegar.bind(null, solicitud)}>
              <button type="submit" className="axr-mcpauth__btn axr-mcpauth__btn--ghost">Volver a Claude</button>
            </form>
          </>
        ) : (
          <>
            <h1>¿Conectar {nombre} con tu cuenta?</h1>
            <p>
              Podrá gestionar <strong>banners</strong> y <strong>publicaciones</strong> en tu nombre ({perfil?.email}): verlos, crearlos (gasta
              saldo de OpenAI y DeepSeek), editarlos, aprobarlos, programarlos y descargarlos. No puede publicar nada fuera de la programación
              que ya hace el campus ni tocar alumnos, matrículas o pagos.
            </p>
            <ul>
              <li>Vuelve a: {destino}</li>
              <li>Puedes cortar el acceso cuando quieras en Panel → Conexiones con Claude.</li>
            </ul>
            <div className="axr-mcpauth__actions">
              <form action={denegar.bind(null, solicitud)}>
                <button type="submit" className="axr-mcpauth__btn axr-mcpauth__btn--ghost">Cancelar</button>
              </form>
              <form action={permitir.bind(null, solicitud)}>
                <button type="submit" className="axr-mcpauth__btn">Permitir</button>
              </form>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
