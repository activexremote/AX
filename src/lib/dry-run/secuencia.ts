import type { TipoCorreo } from "@/lib/dry-run/correos";
import { diaRelativo } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, type DryRun, type DryRunGuest } from "@/lib/dry-run/tipos";

// ══════════════════════════════════════════════════════════
//  Cuándo sale cada correo
//
//  Dos secuencias. La de invitados (invitación y un recordatorio) sólo para
//  quien se ha invitado desde el panel y no se ha apuntado. La de plaza
//  (bienvenida, vuelta por el campus, preparación, checklist, víspera, una
//  hora antes, gracias y feedback), para quien se apunta.
//
//  Las horas cuelgan de la fecha de la sesión, en hora de Madrid. Lo que ya
//  ha pasado cuando alguien se apunta no se le encola: quien se apunta la
//  víspera recibe la bienvenida, la víspera y el aviso de una hora, y no un
//  «falta una semana» a destiempo.
//
//  Antes de enviar se vuelve a mirar si toca (`tocaEnviar`): el estado del
//  invitado puede haber cambiado entre que se encoló y que llega su hora.
// ══════════════════════════════════════════════════════════

export type PasoSecuencia = {
  kind: TipoCorreo;
  para: "invitados" | "plaza";
  /** Para el panel. */
  nombre: string;
  cuando: string;
  /** La hora a la que sale para ese invitado, o null si no le toca. */
  hora: (run: DryRun, guest: Pick<DryRunGuest, "invited_at" | "registered_at">) => Date | null;
};

const ahora = () => new Date();
const minutos = (d: Date | string, n: number) => new Date(new Date(d).getTime() + n * 60000);

export const SECUENCIA: readonly PasoSecuencia[] = [
  {
    kind: "invitacion",
    para: "invitados",
    nombre: "Invitación",
    cuando: "Al invitar desde el panel",
    hora: () => ahora(),
  },
  {
    kind: "invitacion_recordatorio",
    para: "invitados",
    nombre: "Recordatorio de invitación",
    cuando: "4 días antes, 10:00, si no se ha apuntado",
    hora: (run) => diaRelativo(new Date(run.starts_at), -4, 10),
  },
  {
    kind: "bienvenida",
    para: "plaza",
    nombre: "Bienvenida y primeros pasos",
    cuando: "Al confirmar la plaza",
    hora: () => ahora(),
  },
  {
    kind: "tour",
    para: "plaza",
    nombre: "Vuelta por el campus",
    cuando: "Al día siguiente, 10:00 (si quedan más de 3 días)",
    hora: (run, g) => {
      const t = diaRelativo(g.registered_at ? new Date(g.registered_at) : ahora(), 1, 10);
      return t < diaRelativo(new Date(run.starts_at), -3, 0) ? t : null;
    },
  },
  {
    kind: "preparacion",
    para: "plaza",
    nombre: "Material previo",
    cuando: "7 días antes, 10:00",
    hora: (run) => diaRelativo(new Date(run.starts_at), -7, 10),
  },
  {
    kind: "checklist",
    para: "plaza",
    nombre: "Checklist para la clase",
    cuando: "2 días antes, 10:00",
    hora: (run) => diaRelativo(new Date(run.starts_at), -2, 10),
  },
  {
    kind: "manana",
    para: "plaza",
    nombre: "Víspera",
    cuando: "El día antes, 18:00",
    hora: (run) => diaRelativo(new Date(run.starts_at), -1, 18),
  },
  {
    kind: "una_hora",
    para: "plaza",
    nombre: "Empezamos en una hora",
    cuando: "1 hora antes",
    hora: (run) => minutos(run.starts_at, -60),
  },
  {
    kind: "gracias",
    para: "plaza",
    nombre: "Gracias y feedback",
    cuando: "30 minutos después de terminar",
    hora: (run) => minutos(run.ends_at, 30),
  },
  {
    kind: "feedback",
    para: "plaza",
    nombre: "Recordatorio de feedback",
    cuando: "2 días después, 10:00, si no lo ha dejado",
    hora: (run) => diaRelativo(new Date(run.ends_at), 2, 10),
  },
];

export const PASO = Object.fromEntries(SECUENCIA.map((p) => [p.kind, p])) as Record<TipoCorreo, PasoSecuencia>;
export const esTipoCorreo = (k: string): k is TipoCorreo => k in PASO;

/** Los correos de una secuencia que todavía están a tiempo, con su hora. */
export function programar(para: PasoSecuencia["para"], run: DryRun, guest: Pick<DryRunGuest, "invited_at" | "registered_at">) {
  const limite = minutos(ahora(), -1);
  return SECUENCIA.filter((p) => p.para === para)
    .map((p) => ({ kind: p.kind, at: p.hora(run, guest) }))
    .filter((p): p is { kind: TipoCorreo; at: Date } => p.at !== null && p.at >= limite);
}

/**
 * Si un correo que ha llegado a su hora tiene que salir todavía. Devuelve el
 * motivo para no mandarlo, o null si se manda.
 */
export function motivoParaNoEnviar(kind: TipoCorreo, run: DryRun, guest: DryRunGuest, enviarA: Date): string | null {
  if (guest.unsubscribed_at || guest.status === "baja") return "se ha dado de baja";
  const paso = PASO[kind];
  if (paso.para === "invitados" && guest.status !== "invitado") return "ya tiene plaza";
  if (paso.para === "plaza" && !CON_PLAZA.includes(guest.status)) return "no tiene plaza";

  const t = Date.now();
  const empieza = new Date(run.starts_at).getTime();
  // Los avisos de antes de la clase no tienen sentido una vez empezada.
  if (["invitacion_recordatorio", "tour", "preparacion", "checklist", "manana", "una_hora"].includes(kind) && t > empieza) {
    return "la clase ya ha empezado";
  }
  // Uno que llega con más de medio día de retraso (la cola estuvo parada)
  // ya no dice lo que tiene que decir.
  if (["tour", "preparacion", "checklist", "manana"].includes(kind) && t - enviarA.getTime() > 12 * 3600_000) {
    return "llegó tarde";
  }
  if ((kind === "gracias" || kind === "feedback") && guest.status === "no_asistio") return "no vino a la clase";
  if (kind === "feedback" && guest.feedback_at) return "ya dejó su opinión";
  return null;
}
