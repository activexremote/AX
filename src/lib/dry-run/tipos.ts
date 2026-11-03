// Las filas de la migración 0030. Sin dependencias: lo importan también los
// componentes de cliente del panel.

export type DryRun = {
  id: string;
  slug: string;
  title: string;
  module_id: string;
  starts_at: string;
  ends_at: string;
  teacher_name: string;
  classroom_url: string | null;
  classroom_code: string | null;
  meet_url: string | null;
  agenda: string;
  capacity: number | null;
  access_until: string | null;
  registration_open: boolean;
  created_at: string;
};

export type DryRunLink = {
  id: string;
  dry_run_id: string;
  code: string;
  label: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  utm_term: string | null;
  visits: number;
  active: boolean;
  created_at: string;
};

export type EstadoInvitado = "invitado" | "registrado" | "asistio" | "no_asistio" | "baja";

export type Utm = Partial<Record<"source" | "medium" | "campaign" | "content" | "term", string>>;

export type Feedback = {
  nps: number;
  clase: number;
  ritmo: number;
  contenido: number;
  campus: number;
  docente: number;
  pagaria: "si" | "quiza" | "no";
  gusto: string;
  cambiaria: string;
  comentario: string;
};

export type DryRunGuest = {
  id: string;
  dry_run_id: string;
  link_id: string | null;
  email: string;
  full_name: string | null;
  user_id: string | null;
  status: EstadoInvitado;
  utm: Utm;
  token: string;
  invited_at: string | null;
  registered_at: string | null;
  onboarding: Record<string, string>;
  feedback: Feedback | null;
  feedback_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

export type EstadoCorreo = "pendiente" | "enviando" | "enviado" | "omitido" | "error" | "cancelado";

export type DryRunEmail = {
  id: string;
  guest_id: string;
  kind: string;
  send_at: string;
  status: EstadoCorreo;
  attempts: number;
  subject: string | null;
  error: string | null;
  sent_at: string | null;
};

/** Quien tiene plaza (y por tanto recibe la secuencia de preparación). */
export const CON_PLAZA: readonly EstadoInvitado[] = ["registrado", "asistio", "no_asistio"];

/** Una línea de la agenda: «09:30 | Bienvenida y hora 1». */
export function leerAgenda(texto: string): { hora: string; que: string }[] {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [hora, ...resto] = l.split("|");
      return resto.length ? { hora: hora.trim(), que: resto.join("|").trim() } : { hora: "", que: hora.trim() };
    });
}
