-- ══════════════════════════════════════════════════════════
--  Actividades que se hacen dentro del campus
--
--  Hasta ahora cada lección se cerraba con «marcar como completada» y las
--  tareas se hacían en una plantilla descargada y se entregaban en
--  Classroom: el campus no sabía si alguien había hecho algo y el profesor
--  no veía nada. Ahora cada actividad (la ficha de presentación, los
--  cuestionarios, las tareas, el test) es un formulario del campus, y sus
--  respuestas se guardan aquí.
--
--  Qué pregunta cada actividad vive en el código (src/lib/actividades), no
--  en la base: aquí sólo están las respuestas, una fila por alumno y
--  actividad. Reenviar sustituye la anterior.
--
--  También: el título y la agenda del dry run en inglés.
-- ══════════════════════════════════════════════════════════

create table if not exists public.activity_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  -- La clave de la actividad en el catálogo, p. ej. «m01-ficha».
  activity_key text not null,

  answers jsonb not null default '{}'::jsonb,
  -- Lo que calcula el servidor al enviar: la puntuación de un test, el
  -- estadio de un diagnóstico. El alumno no lo escribe.
  result jsonb,

  -- borrador: guardado sin enviar · enviada: lista para revisar ·
  -- revisada: el profesor la ha dado por buena · devuelta: hay que rehacerla.
  status text not null default 'borrador' check (status in ('borrador', 'enviada', 'revisada', 'devuelta')),
  attempts integer not null default 0,
  submitted_at timestamptz,

  -- La revisión del profesor: la rúbrica de tres criterios (1–4 cada uno) y
  -- un comentario.
  rubric jsonb,
  feedback text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, activity_key)
);

create index if not exists activity_responses_lesson_idx on public.activity_responses (lesson_id);
create index if not exists activity_responses_key_idx on public.activity_responses (activity_key);

alter table public.activity_responses enable row level security;

drop policy if exists "activity_responses_own_read" on public.activity_responses;
create policy "activity_responses_own_read" on public.activity_responses
  for select using (user_id = auth.uid() or public.is_staff());

-- Las escrituras van por el servidor (service role, tras comprobar quién es y
-- que tiene acceso a la lección), que es quien calcula el resultado y el
-- estado. Desde el navegador no se escribe nada aquí.
drop policy if exists "activity_responses_staff_manage" on public.activity_responses;
create policy "activity_responses_staff_manage" on public.activity_responses
  for all using (public.is_staff()) with check (public.is_staff());

drop trigger if exists activity_responses_touch_updated_at on public.activity_responses;
create trigger activity_responses_touch_updated_at
  before update on public.activity_responses
  for each row execute function public.touch_updated_at();

------------------------------------------------------------
-- El dry run, en inglés
------------------------------------------------------------
alter table public.dry_runs add column if not exists title_en text;
alter table public.dry_runs add column if not exists agenda_en text;

update public.dry_runs
set
  title_en = coalesce(title_en, 'Dry run · Module 1'),
  agenda_en = coalesce(agenda_en, $$09:30–10:00 | Introductions
10:00–10:55 | Hour 1 · From where you work to what you deliver
10:55–11:00 | Break
11:00–11:55 | Hour 2 · The Visibility Engine
11:55–12:05 | Break
12:05–13:00 | Hour 3 · The impact update
13:00–13:05 | Break
13:05–14:00 | Hour 4 · Open Q&A and the bridge to module 02$$)
where slug = 'modulo-1';
