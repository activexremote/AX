-- ══════════════════════════════════════════════════════════
--  Dry run: una clase de prueba con invitados
--
--  Gente de fuera se apunta gratis a una sesión de prueba de un módulo, entra
--  al campus con acceso sólo a ese módulo, recibe la secuencia de correos
--  (invitación, bienvenida, preparación, recordatorios, feedback) y al final
--  deja su opinión.
--
--  1. module_grants   — acceso a UN módulo suelto, sin matrícula. Las
--     políticas de modules, lessons y submissions pasan a mirarlo.
--  2. dry_runs        — la sesión: fecha, módulo, docente, enlaces de
--     Classroom y de la clase, agenda.
--  3. dry_run_links   — los enlaces de invitación con sus UTM, uno por canal.
--     Cuentan visitas; los registros se cuentan por invitado.
--  4. dry_run_guests  — cada invitado: de qué enlace vino, en qué estado está,
--     su lista de preparación y su feedback.
--  5. dry_run_emails  — la cola de correos de cada invitado. El texto se
--     compone al enviar, no al encolar: si mañana cambia el enlace de la
--     clase, el recordatorio sale con el bueno.
--  6. mail_settings   — la cuenta SMTP desde la que se envía (Google
--     Workspace con contraseña de aplicación). Una sola fila.
--
--  Todo menos module_grants es sólo del servidor (service role): sin
--  políticas, nadie lo lee con la clave pública.
-- ══════════════════════════════════════════════════════════

begin;

------------------------------------------------------------
-- 1. Acceso a un módulo suelto
------------------------------------------------------------
create table if not exists public.module_grants (
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  -- De dónde sale: 'dry-run' o 'manual'. Sólo informativo.
  source text not null default 'manual',
  -- Sin fecha, no caduca.
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.module_grants enable row level security;

drop policy if exists "module_grants_own_read" on public.module_grants;
create policy "module_grants_own_read" on public.module_grants
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "module_grants_staff_manage" on public.module_grants;
create policy "module_grants_staff_manage" on public.module_grants
  for all using (public.is_staff()) with check (public.is_staff());

-- El acceso a un módulo es el de su curso O un permiso suelto para él.
-- `has_course_access` no cambia: sigue siendo la regla de las matrículas.
create or replace function public.has_module_access(target_module uuid, target_course public.course_key)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_course_access(target_course)
    or exists (
      select 1 from public.module_grants g
      where g.user_id = auth.uid()
        and g.module_id = target_module
        and (g.expires_at is null or g.expires_at > now())
    );
$$;

drop policy if exists "modules_read" on public.modules;
create policy "modules_read" on public.modules
  for select using (public.has_module_access(id, course));

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (
    exists (
      select 1 from public.modules m
      where m.id = lessons.module_id and public.has_module_access(m.id, m.course)
    )
  );

drop policy if exists "submissions_own_write" on public.submissions;
create policy "submissions_own_write" on public.submissions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = lesson_id and public.has_module_access(m.id, m.course)
    )
  );

------------------------------------------------------------
-- 2. La sesión
------------------------------------------------------------
create table if not exists public.dry_runs (
  id uuid primary key default gen_random_uuid(),
  -- La dirección pública: /dry-run/<slug>
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  module_id uuid not null references public.modules(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  teacher_name text not null default 'Isaac',
  -- La clase en Google Classroom y el enlace de la videollamada.
  classroom_url text,
  classroom_code text,
  meet_url text,
  -- Una línea por tramo: «09:30 | Bienvenida y hora 1».
  agenda text not null default '',
  -- Plazas. Sin número, no hay tope.
  capacity integer check (capacity is null or capacity > 0),
  -- Hasta cuándo dura el acceso al módulo. Sin fecha, no caduca.
  access_until timestamptz,
  -- Con el registro cerrado el enlace sigue enseñando la sesión, pero ya no
  -- deja apuntarse.
  registration_open boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists dry_runs_touch_updated_at on public.dry_runs;
create trigger dry_runs_touch_updated_at
  before update on public.dry_runs
  for each row execute function public.touch_updated_at();

------------------------------------------------------------
-- 3. Enlaces con UTM
------------------------------------------------------------
create table if not exists public.dry_run_links (
  id uuid primary key default gen_random_uuid(),
  dry_run_id uuid not null references public.dry_runs(id) on delete cascade,
  -- Va en la URL como ?ref=<code>: identifica el enlace aunque alguien borre
  -- las utm al compartirlo.
  code text not null unique check (code ~ '^[a-z0-9-]{3,40}$'),
  label text not null,
  utm_source text not null,
  utm_medium text not null,
  utm_campaign text not null,
  utm_content text,
  utm_term text,
  visits integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists dry_run_links_run_idx on public.dry_run_links (dry_run_id, created_at);

------------------------------------------------------------
-- 4. Invitados
------------------------------------------------------------
create table if not exists public.dry_run_guests (
  id uuid primary key default gen_random_uuid(),
  dry_run_id uuid not null references public.dry_runs(id) on delete cascade,
  link_id uuid references public.dry_run_links(id) on delete set null,
  email text not null,
  full_name text,
  -- Se rellena al entrar con Google y confirmar la plaza.
  user_id uuid references public.profiles(id) on delete set null,
  -- invitado: se le ha mandado la invitación y no se ha apuntado.
  -- registrado: tiene plaza y acceso al módulo.
  -- asistio / no_asistio: lo marca el equipo después de la clase.
  -- baja: no quiere más correos (o se le ha quitado la plaza).
  status text not null default 'invitado'
    check (status in ('invitado', 'registrado', 'asistio', 'no_asistio', 'baja')),
  -- Las utm con las que llegó de verdad (pueden no ser las del enlace).
  utm jsonb not null default '{}'::jsonb,
  -- Va en el enlace personal de la invitación y en el de darse de baja.
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  invited_at timestamptz,
  registered_at timestamptz,
  -- La lista de preparación: { "<clave>": "<fecha en que la marcó>" }.
  onboarding jsonb not null default '{}'::jsonb,
  feedback jsonb,
  feedback_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (dry_run_id, email)
);
create index if not exists dry_run_guests_run_idx on public.dry_run_guests (dry_run_id, created_at desc);
create index if not exists dry_run_guests_user_idx on public.dry_run_guests (user_id);

------------------------------------------------------------
-- 5. Cola de correos
------------------------------------------------------------
create table if not exists public.dry_run_emails (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.dry_run_guests(id) on delete cascade,
  -- invitacion, bienvenida, tour, preparacion, checklist, manana, una_hora,
  -- gracias, feedback, invitacion_recordatorio… (lib/dry-run/secuencia.ts)
  kind text not null,
  send_at timestamptz not null,
  -- omitido: llegó su hora y ya no tocaba (se apuntó, se dio de baja,
  -- ya dejó el feedback…).
  status text not null default 'pendiente'
    check (status in ('pendiente', 'enviando', 'enviado', 'omitido', 'error', 'cancelado')),
  attempts integer not null default 0,
  -- Cuándo lo cogió un envío. Uno que se quede «enviando» más de un cuarto
  -- de hora es un envío que murió a medias y se vuelve a intentar.
  claimed_at timestamptz,
  subject text,
  error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  -- Cada correo de la secuencia se manda una vez por invitado. Volver a
  -- encolar es idempotente.
  unique (guest_id, kind)
);
create index if not exists dry_run_emails_due_idx on public.dry_run_emails (status, send_at);

------------------------------------------------------------
-- 6. Cuenta de envío
------------------------------------------------------------
create table if not exists public.mail_settings (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  smtp_host text not null default 'smtp.gmail.com',
  smtp_port integer not null default 465,
  smtp_user text,
  -- Contraseña de aplicación. Nunca viaja al navegador.
  smtp_pass text,
  from_name text not null default 'ActiveXRemote',
  from_email text,
  reply_to text,
  updated_at timestamptz not null default now()
);

alter table public.dry_runs enable row level security;
alter table public.dry_run_links enable row level security;
alter table public.dry_run_guests enable row level security;
alter table public.dry_run_emails enable row level security;
alter table public.mail_settings enable row level security;

-- Sumar una visita sin leer y reescribir la fila (dos visitas a la vez no se
-- pisan).
create or replace function public.dry_run_visit(link_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.dry_run_links set visits = visits + 1 where code = link_code and active;
$$;
revoke all on function public.dry_run_visit(text) from public, anon, authenticated;

commit;
