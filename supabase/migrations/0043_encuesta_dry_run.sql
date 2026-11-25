-- ══════════════════════════════════════════════════════════
--  Dry run: la encuesta de después de la clase
--
--  El formulario corto de /preparacion (una nota, cinco valoraciones y tres
--  preguntas abiertas) se queda corto para sacar conclusiones. La encuesta
--  nueva tiene un solo enlace para todos (/dry-run/<slug>/encuesta), se
--  responde entrando con Google y cada respuesta queda a nombre de esa
--  cuenta: se sabe quién ha contestado y quién falta.
--
--  1. dry_run_surveys  — una respuesta por persona y sesión. `answers` es
--     clave → valor (lib/dry-run/encuesta.ts): se pueden añadir preguntas sin
--     migrar. `guest_id` la une a la tabla de invitados cuando la cuenta
--     coincide (por usuario o por correo); si no, queda suelta y el panel
--     la marca como «fuera de la lista».
--  2. dry_run_survey_reports — cada lectura con IA que se pide desde el
--     panel, para ver la última sin volver a pagarla.
--  3. dry_run_guests.survey_at — cuándo contestó la encuesta. El correo de
--     la encuesta lo mira para no escribir a quien ya ha respondido.
--  4. Las dos opiniones que llegaron por el formulario corto pasan a la
--     tabla nueva, con las claves que tienen equivalente.
--
--  Sólo del servidor (service role), como el resto del dry run: sin
--  políticas, nadie lo lee con la clave pública.
-- ══════════════════════════════════════════════════════════

begin;

create table if not exists public.dry_run_surveys (
  id uuid primary key default gen_random_uuid(),
  dry_run_id uuid not null references public.dry_runs(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  guest_id uuid references public.dry_run_guests(id) on delete set null,
  -- La cuenta con la que respondió, tal y como era en ese momento.
  email text not null,
  full_name text,
  answers jsonb not null default '{}'::jsonb,
  -- 'encuesta' (la nueva) o 'formulario-corto' (las que vienen de /preparacion).
  source text not null default 'encuesta',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (dry_run_id, user_id)
);
create index if not exists dry_run_surveys_run_idx on public.dry_run_surveys (dry_run_id, submitted_at desc);

drop trigger if exists dry_run_surveys_touch_updated_at on public.dry_run_surveys;
create trigger dry_run_surveys_touch_updated_at
  before update on public.dry_run_surveys
  for each row execute function public.touch_updated_at();

create table if not exists public.dry_run_survey_reports (
  id uuid primary key default gen_random_uuid(),
  dry_run_id uuid not null references public.dry_runs(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  responses_count integer not null default 0,
  content jsonb not null
);
create index if not exists dry_run_survey_reports_run_idx on public.dry_run_survey_reports (dry_run_id, created_at desc);

alter table public.dry_run_surveys enable row level security;
alter table public.dry_run_survey_reports enable row level security;

alter table public.dry_run_guests add column if not exists survey_at timestamptz;

-- Las del formulario corto: nps, clase → global, docente, campus, pagaria y
-- los tres textos. «ritmo» y «contenido» eran notas de 1 a 5 que en la
-- encuesta nueva son otra pregunta; se guardan con prefijo para no perderlas.
insert into public.dry_run_surveys (dry_run_id, user_id, guest_id, email, full_name, answers, source, submitted_at)
select
  g.dry_run_id,
  g.user_id,
  g.id,
  coalesce(g.email, p.email, ''),
  coalesce(g.full_name, p.full_name),
  jsonb_strip_nulls(jsonb_build_object(
    'nps', g.feedback->'nps',
    'global', g.feedback->'clase',
    'docente', g.feedback->'docente',
    'campus', g.feedback->'campus',
    'pagaria', g.feedback->'pagaria',
    'gusto', nullif(g.feedback->>'gusto', ''),
    'mejorar_sesion', nullif(g.feedback->>'cambiaria', ''),
    'comentario', nullif(g.feedback->>'comentario', ''),
    'corto_ritmo', g.feedback->'ritmo',
    'corto_contenido', g.feedback->'contenido'
  )),
  'formulario-corto',
  g.feedback_at
from public.dry_run_guests g
left join public.profiles p on p.id = g.user_id
where g.feedback is not null and g.feedback_at is not null and g.user_id is not null
on conflict (dry_run_id, user_id) do nothing;

commit;
