// Auto-regenerable with: npx supabase gen types typescript --project-id jzmllhwkplpfmjddqknh
// For now we type the parts we use manually.

export type UserRole = "alumno" | "profesor" | "administrador";
/**
 * Cursos del catálogo.
 *
 * "core" es el núcleo compartido por los dos caminos del programa largo.
 * "web-abc" es el primer curso relámpago; los siguientes se añaden aquí y al
 * enum `course_key` de Supabase. Ojo: el núcleo lo abre SÓLO una matrícula de
 * programa, nunca un relámpago (ver `course_kind` en la migración 0007).
 */
export type CourseKey = "core" | "remote-professional" | "remote-founder" | "web-abc";
export type SubmissionStatus = "enviada" | "corregida" | "revision_manual";
export type OrderStatus =
  | "iniciado"
  | "pagado"
  | "en_plazos"
  | "completado"
  | "fallido"
  | "expirado"
  | "reembolsado";
export type OrderPlan = "unico" | "plazos" | "anticipada";
export type LessonStatus = "no_iniciada" | "en_curso" | "completada";
export type AssignmentStatus = "pendiente" | "en_curso" | "completada" | "vencida";

export interface Assignment {
  id: string;
  student_id: string;
  module_id: string;
  assigned_by: string | null;
  due_date: string | null;
  status: AssignmentStatus;
  note: string | null;
  reminder_sent_at: string | null;
  overdue_notified_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  /** En E.164, tal y como se pidió en el registro. */
  phone: string | null;
  /** Null mientras el número esté declarado pero sin confirmar por SMS. */
  phone_verified_at: string | null;
  role: UserRole;
  created_at: string;
}

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  /** Nulo mientras dura una compra directa: lo rellena el webhook. */
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  locale: string | null;
  courses: CourseKey[];
  plan: OrderPlan;
  offer: string;
  status: OrderStatus;
  amount_total: number | null;
  currency: string | null;
  instalments_paid: number;
  stripe_session_id: string | null;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_subscription_id: string | null;
  user_id: string | null;
  notes: string | null;
}

export interface Enrollment {
  user_id: string;
  course: Exclude<CourseKey, "core">;
  order_id: string | null;
  granted_at: string;
  active: boolean;
}

export interface Module {
  id: string;
  slug: string;
  order_index: number;
  code: string | null;
  title: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  available: boolean;
  estimated_minutes: number | null;
  /** A qué curso pertenece. "core" es el núcleo compartido. */
  course: CourseKey;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  slug: string;
  order_index: number;
  title: string;
  subtitle: string | null;
  duration_min: number | null;
  audio_url: string | null;
  content_md: string;
  toc: { id: string; title: string }[] | null;
  created_at: string;

  // ── Sólo en los cursos relámpago ──
  // Nulas en las lecciones del programa largo, que no tienen vídeo ni misión.
  video_url: string | null;
  video_provider: string | null;
  /** El gancho humano con el que abre el instructor. */
  hook: string | null;
  /** Qué sabrá hacer al terminar. */
  outcome: string | null;
  /** Vocabulario técnico que se introduce. */
  terms: string[] | null;
  /** Qué hay que construir. */
  mission_md: string | null;
  mission_minutes: number | null;
  /** El mínimo para dar la misión por buena. */
  mission_criterion: string | null;
  evidence_hint: string | null;
}

/** El feedback de la corrección, con la forma que pide el máster plan. */
export interface SubmissionFeedback {
  clavado: string[];
  ojo: string[];
  mejora: string[];
  next: string;
}

export interface Submission {
  id: string;
  user_id: string;
  lesson_id: string;
  evidence_url: string | null;
  explanation: string;
  status: SubmissionStatus;
  /** 0–100 según la rúbrica: funcionalidad 35, comprensión 25, implementación 20, evidencia 10, autonomía 10. */
  score: number | null;
  feedback: SubmissionFeedback | null;
  reviewer: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

export interface Unlock {
  key: string;
  course: CourseKey;
  order_index: number;
  title: string;
  description: string | null;
  /** Sólo viaja al navegador si está ganado. */
  url: string | null;
  icon: string | null;
}

export interface UserUnlock {
  user_id: string;
  unlock_key: string;
  granted_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  pass_score: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  order_index: number;
  prompt: string;
}

export interface QuizOption {
  id: string;
  question_id: string;
  order_index: number;
  label: string;
  is_correct: boolean;
}

export interface LearningPathStep {
  id: string;
  order_index: number;
  label: string;
  state: "done" | "current" | "pending";
}

export interface UserLessonProgress {
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  time_spent_s: number;
  last_visit: string | null;
  completed_at: string | null;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  created_at: string;
}

export type KbKind = "faq" | "documento";

/** Lo que el equipo sube para el asistente del campus. */
export interface KbSource {
  id: string;
  kind: KbKind;
  /** null = vale para todos los cursos. */
  course: CourseKey | null;
  /** En una FAQ, la pregunta; en un documento, el título. */
  title: string;
  /** En una FAQ, la respuesta; en un documento, el texto entero. */
  body: string;
  file_name: string | null;
  active: boolean;
  chunks_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssistantQuestion {
  id: string;
  user_id: string;
  question: string;
  answer: string | null;
  /** false = no se encontró nada que encajara. */
  answered: boolean;
  source_ids: string[];
  reviewed: boolean;
  created_at: string;
}

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile, Partial<Profile> & { id: string; email: string }, Partial<Profile>>;
      modules: TableDef<Module, Partial<Module> & { slug: string; title: string }, Partial<Module>>;
      lessons: TableDef<Lesson, Partial<Lesson> & { module_id: string; slug: string; title: string }, Partial<Lesson>>;
      quizzes: TableDef<Quiz, Partial<Quiz> & { lesson_id: string }, Partial<Quiz>>;
      quiz_questions: TableDef<QuizQuestion, Partial<QuizQuestion> & { quiz_id: string; prompt: string }, Partial<QuizQuestion>>;
      quiz_options: TableDef<QuizOption, Partial<QuizOption> & { question_id: string; label: string }, Partial<QuizOption>>;
      user_lesson_progress: TableDef<UserLessonProgress, Partial<UserLessonProgress> & { user_id: string; lesson_id: string }, Partial<UserLessonProgress>>;
      quiz_attempts: TableDef<QuizAttempt, Partial<QuizAttempt> & { user_id: string; quiz_id: string }, Partial<QuizAttempt>>;
      learning_path_steps: TableDef<LearningPathStep, Partial<LearningPathStep> & { label: string }, Partial<LearningPathStep>>;
      activity_log: TableDef<ActivityLog, Partial<ActivityLog> & { user_id: string; kind: string }, Partial<ActivityLog>>;
      orders: TableDef<Order, Partial<Order> & { courses: CourseKey[]; plan: OrderPlan; offer: string }, Partial<Order>>;
      enrollments: TableDef<Enrollment, Partial<Enrollment> & { user_id: string; course: Exclude<CourseKey, "core"> }, Partial<Enrollment>>;
      submissions: TableDef<Submission, Partial<Submission> & { user_id: string; lesson_id: string }, Partial<Submission>>;
      unlocks: TableDef<Unlock, Partial<Unlock> & { key: string; course: CourseKey; title: string }, Partial<Unlock>>;
      user_unlocks: TableDef<UserUnlock, Partial<UserUnlock> & { user_id: string; unlock_key: string }, Partial<UserUnlock>>;
      kb_sources: TableDef<KbSource, Partial<KbSource> & { kind: KbKind; title: string }, Partial<KbSource>>;
      assistant_questions: TableDef<AssistantQuestion, Partial<AssistantQuestion> & { user_id: string; question: string }, Partial<AssistantQuestion>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lesson_status: LessonStatus;
      course_key: CourseKey;
      order_status: OrderStatus;
      order_plan: OrderPlan;
      submission_status: SubmissionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

export interface ActivityLog {
  id: string;
  user_id: string;
  kind: string;
  lesson_id: string | null;
  quiz_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}
