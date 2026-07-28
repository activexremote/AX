// Auto-regenerable with: npx supabase gen types typescript --project-id jzmllhwkplpfmjddqknh
// For now we type the parts we use manually.

export type UserRole = "alumno" | "profesor" | "administrador";
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
  role: UserRole;
  created_at: string;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lesson_status: LessonStatus;
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
