-- Cursos relámpago: formaciones de ~4 h en vídeo, con misión, corrección y
-- desbloqueos, a precio cerrado.
--
-- El campus ya sabía de módulos, lecciones y tests. Lo que falta aquí es todo
-- lo que convierte una lección en un ciclo cerrado:
--
--   VER → LEER → TEST → CONSTRUIR → ENTREGAR → CORRECCIÓN → DESBLOQUEO
--
-- Es decir: el vídeo, la lectura técnica, la misión, la evidencia que sube el
-- alumno, la corrección con su puntuación y los materiales que se ganan al
-- terminar.

begin;

------------------------------------------------------------
-- 1. Un curso relámpago es un curso más del catálogo
------------------------------------------------------------
-- Reutiliza `course_key` en vez de inventar una tabla paralela: así las
-- matrículas, los pedidos y las políticas de lectura que ya existen valen tal
-- cual, y el campus no tiene que aprender un segundo concepto de "curso".
do $$
begin
  if not exists (
    select 1 from pg_enum e join pg_type t on t.oid = e.enumtypid
    where t.typname = 'course_key' and e.enumlabel = 'web-abc'
  ) then
    alter type public.course_key add value 'web-abc';
  end if;
end$$;

commit;

-- ⚠︎ Un valor nuevo de enum no se puede usar en la misma transacción en la
-- que se añade. De ahí el corte: lo que sigue ya puede nombrar 'web-abc'.
begin;

------------------------------------------------------------
-- 2. Qué clase de curso es cada uno
------------------------------------------------------------
-- Hace falta distinguirlos para una cosa muy concreta, y es un fallo que
-- venía de la migración anterior:
--
--   `has_course_access('core')` daba acceso al núcleo común con CUALQUIER
--   matrícula activa. En cuanto exista un curso relámpago de 75 €, comprarlo
--   abriría los ocho módulos del núcleo del programa de 2.400 €.
--
-- La regla correcta es: el núcleo pertenece al programa largo y sólo lo abre
-- una matrícula de programa. Un relámpago abre su propio curso y nada más.
--
-- Se resuelve con una función y no con una columna para que añadir un curso
-- relámpago nuevo sea sólo añadir un valor al enum: todo lo que no sea uno de
-- los dos caminos largos es, por definición, un relámpago.
create or replace function public.course_kind(target public.course_key)
returns text
language sql
immutable
as $$
  select case
    when target = 'core' then 'core'
    when target in ('remote-professional', 'remote-founder') then 'programa'
    else 'relampago'
  end;
$$;

comment on function public.course_kind(public.course_key) is
  'core | programa | relampago. El núcleo sólo lo abre una matrícula de programa.';

create or replace function public.has_course_access(target public.course_key)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when public.is_staff() then true
      when target = 'core' then exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid()
          and e.active
          and public.course_kind(e.course) = 'programa'
      )
      else exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid() and e.active and e.course = target
      )
    end;
$$;

------------------------------------------------------------
-- 3. Lo que una lección relámpago necesita y una normal no tenía
------------------------------------------------------------
-- Todo nullable: las lecciones del programa largo siguen exactamente igual.
alter table public.lessons
  -- El vídeo es la pieza central de un relámpago (la lectura es el apoyo).
  add column if not exists video_url text,
  add column if not exists video_provider text,
  -- El gancho humano con el que abre el instructor, antes del nombre técnico.
  add column if not exists hook text,
  -- "Qué vas a entender al terminar": una frase, no una lista.
  add column if not exists outcome text,
  -- Vocabulario técnico que se introduce. Se pinta como fichas.
  add column if not exists terms text[],
  -- La misión: qué construye el alumno y qué prueba tiene que enseñar.
  add column if not exists mission_md text,
  add column if not exists mission_minutes integer,
  add column if not exists mission_criterion text,
  add column if not exists evidence_hint text;

comment on column public.lessons.terms is
  'Vocabulario técnico de la lección. La corrección lo usa como contexto.';

------------------------------------------------------------
-- 4. Entregas y corrección
------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'submission_status') then
    create type public.submission_status as enum (
      'enviada',          -- el alumno ha subido su evidencia
      'corregida',        -- hay puntuación y feedback
      'revision_manual'   -- falta evidencia crítica o la IA no puede juzgar
    );
  end if;
end$$;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,

  -- La evidencia. Casi siempre una URL (repo, deploy, captura) más la
  -- explicación del alumno, que es la mitad de lo que se corrige: el plan
  -- pesa la comprensión un 25 % y la autonomía un 10 %.
  evidence_url text,
  explanation text not null default '',

  status public.submission_status not null default 'enviada',

  -- 0–100. La rúbrica del plan: funcionalidad 35, comprensión 25,
  -- implementación 20, evidencia 10, autonomía 10.
  score integer check (score is null or (score >= 0 and score <= 100)),
  -- { clavado: [], ojo: [], mejora: [], next: "" } — el formato de feedback
  -- del máster plan, guardado estructurado para poder pintarlo y no como un
  -- churro de texto que luego hay que parsear.
  feedback jsonb,
  reviewer text,                      -- 'ia' | email del profesor

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,

  -- Una entrega viva por lección y alumno: reenviar corrige la anterior. El
  -- plan lo pide expresamente («permitir repetición después de feedback»).
  unique (user_id, lesson_id)
);

create index if not exists submissions_user_idx   on public.submissions (user_id);
create index if not exists submissions_status_idx on public.submissions (status);

alter table public.submissions enable row level security;

drop policy if exists "submissions_own_read" on public.submissions;
create policy "submissions_own_read" on public.submissions
  for select using (user_id = auth.uid() or public.is_staff());

-- Sólo se puede entregar de una lección a la que se tiene acceso: sin esto,
-- cualquiera con cuenta podría crear entregas de un curso que no ha comprado.
drop policy if exists "submissions_own_write" on public.submissions;
create policy "submissions_own_write" on public.submissions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = lesson_id and public.has_course_access(m.course)
    )
  );

-- El alumno puede rehacer su entrega; la puntuación NO la escribe él (eso lo
-- hace el servidor con la service role, que se salta RLS).
drop policy if exists "submissions_own_update" on public.submissions;
create policy "submissions_own_update" on public.submissions
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "submissions_staff_manage" on public.submissions;
create policy "submissions_staff_manage" on public.submissions
  for all using (public.is_staff()) with check (public.is_staff());

drop trigger if exists submissions_touch_updated_at on public.submissions;
create trigger submissions_touch_updated_at
  before update on public.submissions
  for each row execute function public.touch_updated_at();

------------------------------------------------------------
-- 5. Desbloqueos
------------------------------------------------------------
-- Los materiales que se ganan al terminar: template, prompt pack, checklist…
-- No se regalan al comprar. Se abren al cumplir el requisito, que es lo que
-- sostiene que alguien termine el curso en vez de bajarse el zip y olvidarlo.
create table if not exists public.unlocks (
  key text primary key,
  course public.course_key not null,
  order_index integer not null default 0,
  title text not null,
  description text,
  -- Se sirve sólo a quien lo ha desbloqueado, nunca desde el HTML público.
  url text,
  icon text
);

create index if not exists unlocks_course_idx on public.unlocks (course, order_index);

alter table public.unlocks enable row level security;

-- Se puede LEER el catálogo de premios con acceso al curso —saber qué te
-- espera es parte del incentivo— pero la URL sólo viaja si está ganado, y eso
-- lo decide el servidor, no esta política.
drop policy if exists "unlocks_read" on public.unlocks;
create policy "unlocks_read" on public.unlocks
  for select using (public.has_course_access(course));

drop policy if exists "unlocks_staff_manage" on public.unlocks;
create policy "unlocks_staff_manage" on public.unlocks
  for all using (public.is_staff()) with check (public.is_staff());

create table if not exists public.user_unlocks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  unlock_key text not null references public.unlocks(key) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (user_id, unlock_key)
);

alter table public.user_unlocks enable row level security;

drop policy if exists "user_unlocks_own_read" on public.user_unlocks;
create policy "user_unlocks_own_read" on public.user_unlocks
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "user_unlocks_staff_manage" on public.user_unlocks;
create policy "user_unlocks_staff_manage" on public.user_unlocks
  for all using (public.is_staff()) with check (public.is_staff());

commit;
