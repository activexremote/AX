-- ══════════════════════════════════════════════════════════
--  Contenido en dos idiomas y guía del profesorado
--
--  1. Versión inglesa de módulos y lecciones. Columnas paralelas y no una
--     tabla de traducciones: el campus sólo tiene dos idiomas, y una tabla
--     aparte obligaría a reescribir cada consulta. Si la columna _en está
--     vacía, se sirve la española: nunca una lección en blanco.
--
--  2. Bucket PRIVADO para el material del profesorado: solucionarios, guiones
--     de diapositivas, kits de preguntas, tests con respuestas. Privado de
--     verdad: `lesson-assets` es público, y una URL de un solucionario que
--     circula entre alumnos es un examen regalado. Aquí sólo entra el staff,
--     y desde el panel se sirve con URL firmada y caducidad corta.
-- ══════════════════════════════════════════════════════════

alter table public.modules
  add column if not exists title_en text,
  add column if not exists description_en text;

alter table public.lessons
  add column if not exists title_en text,
  add column if not exists subtitle_en text,
  add column if not exists content_blocks_en jsonb;

insert into storage.buckets (id, name, public)
values ('teacher-guides', 'teacher-guides', false)
on conflict (id) do update set public = false;

drop policy if exists "teacher_guides_staff_read" on storage.objects;
create policy "teacher_guides_staff_read" on storage.objects
  for select using (bucket_id = 'teacher-guides' and public.is_staff());

drop policy if exists "teacher_guides_staff_write" on storage.objects;
create policy "teacher_guides_staff_write" on storage.objects
  for insert with check (bucket_id = 'teacher-guides' and public.is_staff());

drop policy if exists "teacher_guides_staff_update" on storage.objects;
create policy "teacher_guides_staff_update" on storage.objects
  for update using (bucket_id = 'teacher-guides' and public.is_staff())
  with check (bucket_id = 'teacher-guides' and public.is_staff());

drop policy if exists "teacher_guides_staff_delete" on storage.objects;
create policy "teacher_guides_staff_delete" on storage.objects
  for delete using (bucket_id = 'teacher-guides' and public.is_staff());

-- ── Índice de la guía del profesorado ─────────────────────
-- Una fila por archivo del bucket privado, con su módulo y su apartado
-- (pre-clase, hora 1–4, rúbricas). Listar el bucket carpeta a carpeta en cada
-- visita serían 21 × 6 llamadas; esto es una.
create table if not exists public.teacher_resources (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade,
  section text not null,
  label text not null,
  path text not null unique,
  lang text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists teacher_resources_module_idx on public.teacher_resources (module_id, section, order_index);

alter table public.teacher_resources enable row level security;

drop policy if exists "teacher_resources_staff_all" on public.teacher_resources;
create policy "teacher_resources_staff_all" on public.teacher_resources
  for all using (public.is_staff()) with check (public.is_staff());
