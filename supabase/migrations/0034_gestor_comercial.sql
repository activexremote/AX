-- ══════════════════════════════════════════════════════════
--  El gestor comercial
--
--  1. Roles preasignados por correo. Al equipo nuevo no se le crea la cuenta
--     a mano ni se le inventa una contraseña: se apunta su correo con el rol
--     que tendrá, y la primera vez que entra (con Google o con el enlace
--     mágico) el alta le da ese rol en vez de «alumno».
--  2. El seguimiento de los leads de la web: estado del embudo, temperatura,
--     la próxima acción con su fecha y quién lo lleva.
--  3. El historial de cada lead: llamadas, WhatsApp, correos, notas y
--     cambios de estado, con quién y cuándo.
--
--  El panel lee y escribe todo esto con la service role después de comprobar
--  el rol en el servidor; las políticas son la segunda línea.
-- ══════════════════════════════════════════════════════════

begin;

create or replace function public.is_comercial()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('comercial', 'administrador'));
$$;

------------------------------------------------------------
-- 1. Roles preasignados
------------------------------------------------------------
create table if not exists public.role_grants (
  email text primary key check (email = lower(email)),
  role public.user_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  -- Cuándo entró por primera vez y se le aplicó.
  used_at timestamptz
);

alter table public.role_grants enable row level security;
create policy "role_grants_admin" on public.role_grants
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rol public.user_role;
begin
  select role into rol from public.role_grants where email = lower(new.email);

  insert into public.profiles (id, email, full_name, avatar_url, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    coalesce(rol, 'alumno')
  )
  on conflict (id) do nothing;

  if rol is not null then
    update public.role_grants set used_at = now() where email = lower(new.email);
  end if;
  return new;
end;
$$;

------------------------------------------------------------
-- 2. Seguimiento de los leads
------------------------------------------------------------
update public.leads set status = 'nuevo'
where status not in ('nuevo', 'contactado', 'interesado', 'en_duda', 'inscrito', 'descartado');

alter table public.leads
  add constraint leads_status_check
    check (status in ('nuevo', 'contactado', 'interesado', 'en_duda', 'inscrito', 'descartado')),
  -- Lo que se nota en la conversación: frío, templado o caliente.
  add column if not exists temperature text check (temperature in ('frio', 'templado', 'caliente')),
  add column if not exists next_action text,
  add column if not exists next_action_at date,
  add column if not exists last_contact_at timestamptz,
  add column if not exists owner_id uuid references public.profiles (id) on delete set null,
  -- Por qué se descartó o qué le frena: precio, tiempo, idioma…
  add column if not exists objection text;

create index if not exists leads_next_action_idx on public.leads (next_action_at) where next_action_at is not null;

------------------------------------------------------------
-- 3. Historial
------------------------------------------------------------
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  author_id uuid references public.profiles (id) on delete set null,
  kind text not null check (kind in ('nota', 'llamada', 'whatsapp', 'email', 'reunion', 'estado')),
  body text not null default '',
  -- En los cambios de estado: de cuál a cuál.
  from_status text,
  to_status text
);

create index if not exists lead_events_lead_idx on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;
create policy "lead_events_comercial" on public.lead_events
  for all using (public.is_comercial()) with check (public.is_comercial());

-- Los leads, también para el equipo comercial (antes sólo el staff).
create policy "leads_comercial_read" on public.leads
  for select using (public.is_comercial());
create policy "leads_comercial_update" on public.leads
  for update using (public.is_comercial()) with check (public.is_comercial());

------------------------------------------------------------
-- 4. Ainhoa, del equipo comercial
------------------------------------------------------------
insert into public.role_grants (email, role) values ('ainhoa@activexremote.com', 'comercial')
on conflict (email) do update set role = excluded.role;
-- Por si ya hubiera entrado antes de esta migración (y el alta le dio «alumno»).
update public.profiles set role = 'comercial' where lower(email) = 'ainhoa@activexremote.com' and role = 'alumno';
update public.role_grants set used_at = now()
where email = 'ainhoa@activexremote.com' and exists (select 1 from public.profiles where lower(email) = 'ainhoa@activexremote.com');

commit;
