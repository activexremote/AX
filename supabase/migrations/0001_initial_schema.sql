-- ActiveXRemote Campus — initial schema
-- Roles: alumno, profesor, administrador
-- All tables protected with RLS

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

------------------------------------------------------------
-- 1. Profiles + roles
------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('alumno', 'profesor', 'administrador');
  end if;
end$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'alumno',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'alumno'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper to read current user role from JWT-bound profile
create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'administrador');
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('profesor','administrador'));
$$;

------------------------------------------------------------
-- 2. Modules / lessons
------------------------------------------------------------
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  order_index integer not null default 0,
  code text,                       -- e.g. "MÓDULO 0 · ONBOARDING GENERAL"
  title text not null,
  description text,
  icon text,                       -- carbon icon name
  accent text default '#0f62fe',   -- Carbon blue 60
  available boolean not null default true,
  estimated_minutes integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  order_index integer not null default 0,
  title text not null,
  subtitle text,
  duration_min integer,
  audio_url text,
  content_md text not null default '',
  toc jsonb,                       -- [{id, title}] for "Contenido de esta formación"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create index if not exists lessons_module_order on public.lessons(module_id, order_index);

------------------------------------------------------------
-- 3. Quizzes
------------------------------------------------------------
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id) on delete cascade,
  pass_score numeric(4,2) not null default 0.80, -- 80%
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  order_index integer not null default 0,
  prompt text not null
);

create table if not exists public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  order_index integer not null default 0,
  label text not null,
  is_correct boolean not null default false
);

------------------------------------------------------------
-- 4. Progress / attempts
------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lesson_status') then
    create type public.lesson_status as enum ('no_iniciada', 'en_curso', 'completada');
  end if;
end$$;

create table if not exists public.user_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status public.lesson_status not null default 'no_iniciada',
  time_spent_s integer not null default 0,
  last_visit timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists user_lesson_progress_user on public.user_lesson_progress(user_id);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score numeric(5,2) not null,        -- 0..100
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user on public.quiz_attempts(user_id);
create index if not exists quiz_attempts_quiz on public.quiz_attempts(quiz_id);

------------------------------------------------------------
-- 5. Learning paths (ruta recomendada)
------------------------------------------------------------
create table if not exists public.learning_path_steps (
  id uuid primary key default gen_random_uuid(),
  order_index integer not null default 0,
  label text not null,
  description text
);

------------------------------------------------------------
-- 6. Activity log (for "Actividad reciente")
------------------------------------------------------------
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,                -- 'lesson_start' | 'lesson_complete' | 'quiz_pass' | 'quiz_fail'
  lesson_id uuid references public.lessons(id) on delete set null,
  quiz_id uuid references public.quizzes(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_user_time on public.activity_log(user_id, created_at desc);

------------------------------------------------------------
-- 7. updated_at triggers
------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','modules','lessons','user_lesson_progress'] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', t, t);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end$$;

------------------------------------------------------------
-- 8. RLS
------------------------------------------------------------
alter table public.profiles               enable row level security;
alter table public.modules                enable row level security;
alter table public.lessons                enable row level security;
alter table public.quizzes                enable row level security;
alter table public.quiz_questions         enable row level security;
alter table public.quiz_options           enable row level security;
alter table public.user_lesson_progress   enable row level security;
alter table public.quiz_attempts          enable row level security;
alter table public.learning_path_steps    enable row level security;
alter table public.activity_log           enable row level security;

-- Drop policies if re-running
do $$
declare r record;
begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public' loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end$$;

-- profiles: a user sees their own profile, staff sees all, admin updates all
create policy "profiles_self_read"   on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles_admin_all"   on public.profiles for all    using (public.is_admin()) with check (public.is_admin());

-- modules / lessons / quiz tree: everyone authenticated reads, staff writes
create policy "modules_read"   on public.modules         for select using (auth.role() = 'authenticated');
create policy "modules_write"  on public.modules         for all    using (public.is_staff()) with check (public.is_staff());

create policy "lessons_read"   on public.lessons         for select using (auth.role() = 'authenticated');
create policy "lessons_write"  on public.lessons         for all    using (public.is_staff()) with check (public.is_staff());

create policy "quizzes_read"   on public.quizzes         for select using (auth.role() = 'authenticated');
create policy "quizzes_write"  on public.quizzes         for all    using (public.is_staff()) with check (public.is_staff());

create policy "qq_read"        on public.quiz_questions  for select using (auth.role() = 'authenticated');
create policy "qq_write"       on public.quiz_questions  for all    using (public.is_staff()) with check (public.is_staff());

create policy "qo_read"        on public.quiz_options    for select using (auth.role() = 'authenticated');
create policy "qo_write"       on public.quiz_options    for all    using (public.is_staff()) with check (public.is_staff());

create policy "lp_read"        on public.learning_path_steps for select using (auth.role() = 'authenticated');
create policy "lp_write"       on public.learning_path_steps for all    using (public.is_staff()) with check (public.is_staff());

-- progress and attempts: user manages their own, staff reads all
create policy "ulp_self_read"  on public.user_lesson_progress for select using (auth.uid() = user_id or public.is_staff());
create policy "ulp_self_write" on public.user_lesson_progress for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "qa_self_read"   on public.quiz_attempts for select using (auth.uid() = user_id or public.is_staff());
create policy "qa_self_write"  on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "qa_admin_del"   on public.quiz_attempts for delete using (public.is_admin());

create policy "activity_self_read"   on public.activity_log for select using (auth.uid() = user_id or public.is_staff());
create policy "activity_self_insert" on public.activity_log for insert with check (auth.uid() = user_id);
create policy "activity_admin_del"   on public.activity_log for delete using (public.is_admin());

------------------------------------------------------------
-- 9. Storage buckets (audios + assets)
------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('lesson-audio', 'lesson-audio', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('lesson-assets', 'lesson-assets', true)
on conflict (id) do nothing;

-- storage policies
do $$
declare p text;
begin
  for p in
    select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'
      and policyname like 'campus_%'
  loop
    execute format('drop policy if exists %I on storage.objects', p);
  end loop;
end$$;

create policy "campus_audio_public_read" on storage.objects for select
  using (bucket_id in ('lesson-audio','lesson-assets'));

create policy "campus_audio_staff_write" on storage.objects for insert
  with check (bucket_id in ('lesson-audio','lesson-assets') and public.is_staff());

create policy "campus_audio_staff_update" on storage.objects for update
  using (bucket_id in ('lesson-audio','lesson-assets') and public.is_staff())
  with check (bucket_id in ('lesson-audio','lesson-assets') and public.is_staff());

create policy "campus_audio_staff_delete" on storage.objects for delete
  using (bucket_id in ('lesson-audio','lesson-assets') and public.is_staff());
