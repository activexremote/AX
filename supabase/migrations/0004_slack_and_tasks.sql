-- Integración Slack + sistema de tareas/asignaciones

begin;

------------------------------------------------------------
-- 1. Configuración de Slack (singleton)
------------------------------------------------------------
create table if not exists public.slack_settings (
  id text primary key default 'default',
  enabled boolean not null default false,
  bot_token text,                      -- xoxb-...
  channel_general text,                -- fallback / anuncios globales
  channel_alumnos text,
  channel_profesores text,
  channel_admin text,
  dm_enabled boolean not null default true,
  disabled_events text[] not null default '{}',  -- eventos desactivados por el admin
  last_test_ok boolean,
  last_test_at timestamptz,
  last_test_detail text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.slack_settings (id) values ('default')
on conflict (id) do nothing;

------------------------------------------------------------
-- 2. Registro de notificaciones enviadas
------------------------------------------------------------
create table if not exists public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  target text,                         -- channel id o user id de Slack
  target_type text not null default 'channel',  -- 'channel' | 'dm'
  title text,
  status text not null default 'sent', -- 'sent' | 'failed' | 'skipped'
  error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_log_time on public.notifications_log(created_at desc);

------------------------------------------------------------
-- 3. Tareas / asignaciones
------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'assignment_status') then
    create type public.assignment_status as enum ('pendiente', 'en_curso', 'completada', 'vencida');
  end if;
end$$;

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  due_date date,
  status public.assignment_status not null default 'pendiente',
  note text,
  reminder_sent_at timestamptz,        -- evita recordatorios duplicados
  overdue_notified_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, module_id)
);

create index if not exists assignments_student on public.assignments(student_id);
create index if not exists assignments_due on public.assignments(due_date);

drop trigger if exists trg_assignments_updated_at on public.assignments;
create trigger trg_assignments_updated_at
  before update on public.assignments
  for each row execute function public.touch_updated_at();

------------------------------------------------------------
-- 4. RLS
------------------------------------------------------------
alter table public.slack_settings    enable row level security;
alter table public.notifications_log enable row level security;
alter table public.assignments       enable row level security;

do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
      and tablename in ('slack_settings', 'notifications_log', 'assignments')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end$$;

-- slack_settings: solo administradores
create policy "slack_settings_admin" on public.slack_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- notifications_log: staff lee, nadie escribe vía cliente (se inserta con service role)
create policy "notifications_log_staff_read" on public.notifications_log
  for select using (public.is_staff());

-- assignments: alumno ve y avanza las suyas; staff ve/gestiona todas
create policy "assignments_student_read" on public.assignments
  for select using (auth.uid() = student_id or public.is_staff());

create policy "assignments_student_update" on public.assignments
  for update using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "assignments_staff_all" on public.assignments
  for all using (public.is_staff()) with check (public.is_staff());

commit;
