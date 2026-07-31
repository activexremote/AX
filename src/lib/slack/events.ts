// Catálogo de eventos de notificación del campus.
// category → determina el canal de Slack. dm → si además se manda mensaje directo.

export type SlackCategory = "alumnos" | "profesores" | "admin" | "general";

export type SlackEventKey =
  | "content_published"
  | "lesson_completed"
  | "quiz_passed"
  | "quiz_failed"
  | "assignment_created"
  | "assignment_due_soon"
  | "assignment_overdue"
  | "assignment_completed"
  | "user_created"
  | "lead_created"
  | "student_progress_digest"
  | "teacher_compliance_digest"
  | "reminder_inactive";

export type SlackEventDef = {
  label: string;
  description: string;
  category: SlackCategory;
  dm: boolean;
  emoji: string;
};

export const SLACK_EVENTS: Record<SlackEventKey, SlackEventDef> = {
  content_published: {
    label: "Nuevo contenido publicado",
    description: "Se anuncia a los alumnos cuando se publica un módulo o lección.",
    category: "alumnos",
    dm: false,
    emoji: "📚",
  },
  lesson_completed: {
    label: "Lección completada por un alumno",
    description: "Avisa a los profesores cuando un alumno completa una lección.",
    category: "profesores",
    dm: false,
    emoji: "✅",
  },
  quiz_passed: {
    label: "Examen aprobado",
    description: "Avisa a los profesores cuando un alumno aprueba un examen.",
    category: "profesores",
    dm: false,
    emoji: "🎉",
  },
  quiz_failed: {
    label: "Examen suspendido",
    description: "Avisa a los profesores cuando un alumno suspende un examen.",
    category: "profesores",
    dm: false,
    emoji: "⚠️",
  },
  assignment_created: {
    label: "Tarea asignada",
    description: "Notifica al alumno que se le ha asignado un módulo con fecha límite.",
    category: "alumnos",
    dm: true,
    emoji: "📌",
  },
  assignment_due_soon: {
    label: "Recordatorio de tarea próxima a vencer",
    description: "Recuerda al alumno una tarea cuya fecha límite se acerca.",
    category: "alumnos",
    dm: true,
    emoji: "⏰",
  },
  assignment_overdue: {
    label: "Tarea vencida",
    description: "Avisa al alumno y a los profesores de una tarea fuera de plazo.",
    category: "profesores",
    dm: true,
    emoji: "🔴",
  },
  assignment_completed: {
    label: "Tarea completada",
    description: "Avisa a los profesores cuando un alumno termina una tarea asignada.",
    category: "profesores",
    dm: false,
    emoji: "🏁",
  },
  user_created: {
    label: "Nuevo usuario en el campus",
    description: "Avisa a administración cuando se da de alta un usuario.",
    category: "admin",
    dm: false,
    emoji: "👤",
  },
  lead_created: {
    label: "Nueva solicitud de información",
    description: "Avisa a administración cuando alguien pide información desde la landing.",
    category: "admin",
    dm: false,
    emoji: "🎯",
  },
  student_progress_digest: {
    label: "Resumen de progreso de alumnos",
    description: "Informe periódico del avance de los alumnos para los profesores.",
    category: "profesores",
    dm: false,
    emoji: "📊",
  },
  teacher_compliance_digest: {
    label: "Seguimiento de cumplimiento de profesores",
    description: "Informe periódico de la actividad de los profesores para administración.",
    category: "admin",
    dm: false,
    emoji: "🧭",
  },
  reminder_inactive: {
    label: "Recordatorio de inactividad",
    description: "Recuerda a un alumno que retome la formación si lleva días sin actividad.",
    category: "alumnos",
    dm: true,
    emoji: "👋",
  },
};

export const SLACK_EVENT_KEYS = Object.keys(SLACK_EVENTS) as SlackEventKey[];
