-- ══════════════════════════════════════════════════════════
--  Un módulo «Oculto» no lo ve ningún alumno
--
--  Hasta ahora `available = false` sólo cambiaba la tarjeta del campus a
--  «Próximamente»: el módulo y sus lecciones seguían abriéndose. Ahora la
--  base no se los da a ningún alumno. Lo siguen viendo:
--    · el equipo (profesorado y administración), para prepararlo;
--    · quien tiene acceso propio a ese módulo (module_grants: la plaza de un
--      dry run), porque ese acceso se dio a esa persona a propósito.
-- ══════════════════════════════════════════════════════════

create or replace function public.can_read_module(target_module uuid, target_course public.course_key, is_available boolean)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_staff()
    or (is_available and public.has_course_access(target_course))
    or exists (
      select 1 from public.module_grants g
      where g.user_id = auth.uid()
        and g.module_id = target_module
        and (g.expires_at is null or g.expires_at > now())
    );
$$;

drop policy if exists "modules_read" on public.modules;
create policy "modules_read" on public.modules
  for select using (public.can_read_module(id, course, available));

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (
    exists (
      select 1 from public.modules m
      where m.id = lessons.module_id
        and public.can_read_module(m.id, m.course, m.available)
    )
  );

-- Y lo mismo para entregar: no se entrega en una lección que no se ve.
drop policy if exists "submissions_own_write" on public.submissions;
create policy "submissions_own_write" on public.submissions
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = lesson_id and public.can_read_module(m.id, m.course, m.available)
    )
  );
