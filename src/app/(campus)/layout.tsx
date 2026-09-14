import { getCurrentProfile } from "@/lib/data/profile";
import { LandingView } from "@/components/landing/landing-view";
import { AssistantWidget } from "@/components/campus/assistant-chat";
import { hasKnowledge } from "@/lib/asistente/knowledge";

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  // Invitados sólo pueden llegar aquí por la raíz "/" (el middleware bloquea el
  // resto de rutas del campus): les servimos la landing pública en esa URL.
  if (!profile) return <LandingView />;

  return (
    <div className="axr-page">
      {children}
      {/* Sin nada subido desde el panel, el chat no sabría contestar nada. */}
      {(await hasKnowledge()) ? <AssistantWidget /> : null}
    </div>
  );
}
