-- ══════════════════════════════════════════════════════════
--  Dry run: la tabla de invitados
--
--  El equipo invita sobre todo a mano (WhatsApp, un mensaje directo), y lo
--  seguía en una hoja de cálculo: ID, nombre, correo, teléfono, país, quién
--  le invita, estado, perfil y notas. Esa hoja pasa al panel.
--
--  1. dry_run_guests gana las columnas de la hoja y el correo deja de ser
--     obligatorio: a muchos se les invita por teléfono y el correo llega al
--     reservar con Google.
--  2. Cada invitado tiene su número dentro de la sesión (ALU-001…), que lo
--     pone un trigger.
--  3. tracking es el estado que lleva el equipo (pendiente, confirmado,
--     rechazado, asistió, no asistió). status sigue siendo el del sistema
--     (si tiene plaza, si recibe correos).
--  4. Las visitas del enlace personal se cuentan por invitado.
--  5. dry_runs.invite_message: el mensaje que se copia con el enlace.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.dry_run_guests alter column email drop not null;

alter table public.dry_run_guests
  add column if not exists seq integer,
  add column if not exists phone text,
  add column if not exists country text,
  -- Quién le invita: «Oriol», «Isaac», «Ángel»…
  add column if not exists inviter text,
  -- Especialidad o perfil.
  add column if not exists profile text,
  add column if not exists notes text,
  add column if not exists tracking text not null default 'pendiente'
    check (tracking in ('pendiente', 'confirmado', 'rechazado', 'asistio', 'no_asistio')),
  -- Visitas humanas a la página con su enlace personal (?inv=).
  add column if not exists visits integer not null default 0,
  add column if not exists first_visit_at timestamptz,
  add column if not exists last_visit_at timestamptz,
  -- La última vez que alguien del equipo copió o mandó su invitación, y por dónde.
  add column if not exists shared_at timestamptz,
  add column if not exists shared_via text;

-- Los que ya había, numerados por orden de llegada y con el estado que toca.
with orden as (
  select id, row_number() over (partition by dry_run_id order by created_at) as n
  from public.dry_run_guests
  where seq is null
)
update public.dry_run_guests g set seq = orden.n from orden where g.id = orden.id;

update public.dry_run_guests set tracking = case status
  when 'registrado' then 'confirmado'
  when 'asistio' then 'asistio'
  when 'no_asistio' then 'no_asistio'
  else 'pendiente'
end
where tracking = 'pendiente';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'dry_run_guests_seq_key') then
    alter table public.dry_run_guests add constraint dry_run_guests_seq_key unique (dry_run_id, seq);
  end if;
end $$;

-- El siguiente número de la sesión, venga de donde venga la fila (la tabla,
-- la invitación por correo o alguien que reserva por un enlace público).
create or replace function public.dry_run_guest_seq()
returns trigger
language plpgsql
as $$
begin
  if new.seq is null then
    perform pg_advisory_xact_lock(hashtext('dry_run_guest_seq:' || new.dry_run_id::text));
    select coalesce(max(seq), 0) + 1 into new.seq from public.dry_run_guests where dry_run_id = new.dry_run_id;
  end if;
  return new;
end;
$$;

drop trigger if exists dry_run_guests_seq on public.dry_run_guests;
create trigger dry_run_guests_seq
  before insert on public.dry_run_guests
  for each row execute function public.dry_run_guest_seq();

-- Sumar una visita al enlace personal sin leer y reescribir la fila.
create or replace function public.dry_run_guest_visit(guest_token text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.dry_run_guests
  set visits = visits + 1,
      first_visit_at = coalesce(first_visit_at, now()),
      last_visit_at = now()
  where token = guest_token;
$$;
revoke all on function public.dry_run_guest_visit(text) from public, anon, authenticated;

-- Vacío: el mensaje por defecto (components/admin/dry-run/mensaje.ts).
alter table public.dry_runs add column if not exists invite_message text;

commit;
