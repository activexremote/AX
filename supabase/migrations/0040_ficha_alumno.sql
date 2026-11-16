-- ══════════════════════════════════════════════════════════
--  La ficha del alumno: quién le corrige y la nota
--
--  · student_teachers: qué profesor tiene asignado cada alumno. Un profesor
--    ve en el panel a sus alumnos (y a los que les asignó un módulo); la
--    administración, a todos.
--  · activity_responses.grade: la nota de 0 a 10 que pone el profesor al
--    corregir, y notified_at, cuándo se le avisó al alumno por correo.
-- ══════════════════════════════════════════════════════════

create table if not exists public.student_teachers (
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (student_id, teacher_id)
);

create index if not exists student_teachers_teacher_idx on public.student_teachers (teacher_id);

alter table public.student_teachers enable row level security;

drop policy if exists student_teachers_staff on public.student_teachers;
create policy student_teachers_staff on public.student_teachers
  for select using (public.is_staff() or auth.uid() = student_id);

alter table public.activity_responses
  add column if not exists grade numeric(4,2) check (grade is null or (grade >= 0 and grade <= 10)),
  add column if not exists notified_at timestamptz;

-- Los invitados del dry run del módulo 1, a la cuenta del profesorado
-- (profesor@activexremote.com), que es con la que se corrige el dry run.
insert into public.student_teachers (student_id, teacher_id)
select distinct g.user_id, t.id
from public.dry_run_guests g
join public.profiles s on s.id = g.user_id and s.role = 'alumno'
cross join (select id from public.profiles where email = 'profesor@activexremote.com' and role = 'profesor') t
where g.user_id is not null and g.status in ('registrado', 'asistio', 'no_asistio')
on conflict do nothing;
