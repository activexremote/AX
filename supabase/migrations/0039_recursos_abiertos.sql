-- ══════════════════════════════════════════════════════════
--  Qué enlaces del material ha abierto cada alumno
--
--  Cada lectura, vídeo o descarga de una lección pasa por /recurso, que
--  apunta aquí que se ha abierto y luego lleva al destino. Una lección con
--  material no se da por terminada hasta que se ha abierto todo, y el
--  profesorado puede ver quién lo ha mirado.
-- ══════════════════════════════════════════════════════════

create table if not exists public.resource_opens (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  url text not null,
  opened_at timestamptz not null default now(),
  primary key (user_id, lesson_id, url)
);

create index if not exists resource_opens_lesson_idx on public.resource_opens (lesson_id);

alter table public.resource_opens enable row level security;

-- Lo escribe el servidor con la service role; cada uno lee lo suyo y el
-- equipo, todo.
drop policy if exists resource_opens_read on public.resource_opens;
create policy resource_opens_read on public.resource_opens
  for select using (auth.uid() = user_id or public.is_staff());
