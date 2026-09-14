-- Asistente del campus: un chat que responde dudas sobre el curso, sus
-- dinámicas y su logística a partir de lo que el equipo sube desde el panel.
--
-- Sin IA y sin coste por pregunta: es un buscador. Postgres trocea, lematiza
-- en español y busca; el chat devuelve la FAQ o el fragmento de documento que
-- mejor encaja, tal cual lo escribió el equipo. Lo que no se encuentra no se
-- improvisa: queda anotado para que el equipo escriba la FAQ que falta.
--
--   kb_sources   lo que sube el equipo: FAQs (pregunta + respuesta) y
--                documentos (texto pegado, .md, .txt o .pdf).
--   kb_chunks    esos contenidos troceados por secciones, con su índice de
--                texto. Una FAQ es un solo trozo.
--   assistant_questions
--                lo que preguntan los alumnos y si se encontró respuesta.

begin;

create extension if not exists unaccent with schema extensions;

-- `unaccent` no es inmutable (depende de un diccionario que se podría
-- cambiar), y una columna generada exige que lo sea. Fijando el diccionario
-- explícitamente sí lo es en la práctica: es el apaño estándar.
--
-- Sin quitar tildes, «cuándo» y «cuando», o «matrícula» y «matricula», no se
-- encontrarían entre sí, y en un chat la mitad de la gente no pone tildes.
create or replace function public.kb_normalize(t text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, coalesce(t, ''));
$$;

------------------------------------------------------------
-- 1. Lo que sube el equipo
------------------------------------------------------------
create table if not exists public.kb_sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('faq', 'documento')),
  -- Nulo = vale para todos los cursos. Con curso, sólo lo encuentra quien
  -- tenga acceso a ese curso: la logística de un relámpago no le sirve de
  -- nada —y confunde— a un alumno del programa largo.
  course public.course_key,
  -- En una FAQ, la pregunta. En un documento, su título.
  title text not null,
  -- En una FAQ, la respuesta. En un documento, el texto entero.
  body text not null default '',
  file_name text,
  active boolean not null default true,
  chunks_count integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kb_sources_kind_idx on public.kb_sources (kind, created_at desc);

drop trigger if exists trg_kb_sources_updated_at on public.kb_sources;
create trigger trg_kb_sources_updated_at before update on public.kb_sources
  for each row execute function public.touch_updated_at();

------------------------------------------------------------
-- 2. Trozos con índice de texto
------------------------------------------------------------
create table if not exists public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.kb_sources(id) on delete cascade,
  chunk_index integer not null,
  -- En una FAQ, la pregunta. En un documento, «Título › Sección».
  heading text not null,
  content text not null,
  -- El encabezado pesa más (A) que el cuerpo (B): si alguien pregunta por
  -- «certificado», la FAQ «¿Hay certificado?» tiene que salir antes que el
  -- documento que lo menciona de pasada en la página cuatro.
  fts tsvector generated always as (
    setweight(to_tsvector('spanish'::regconfig, public.kb_normalize(heading)), 'A') ||
    setweight(to_tsvector('spanish'::regconfig, public.kb_normalize(content)), 'B')
  ) stored
);

create index if not exists kb_chunks_source_idx on public.kb_chunks (source_id);
create index if not exists kb_chunks_fts_idx on public.kb_chunks using gin (fts);

-- La búsqueda.
--
-- Una pregunta escrita en lenguaje natural no se puede buscar con AND: en
-- «¿cuándo hay que entregar el proyecto final?» se exigiría que el texto
-- dijera "entregar", "proyecto" y "final", y la FAQ «¿Cuándo son las
-- entregas?» no saldría. Se busca con OR y se ordena por COBERTURA —qué parte
-- de las palabras de la pregunta aparece en el trozo— y después por rank.
--
-- Filtra por curso aquí y no en el servidor: si no, los trozos de otros
-- cursos se comerían el cupo de `match_count`.
create or replace function public.search_kb(
  query text,
  courses public.course_key[],
  match_count integer default 5
)
returns table (
  source_id uuid,
  kind text,
  title text,
  heading text,
  content text,
  coverage real,
  rank real
)
language sql
stable
set search_path = public, extensions
as $$
  with terms as (
    select array(
      select distinct lexeme
      from unnest(tsvector_to_array(to_tsvector('spanish'::regconfig, public.kb_normalize(query)))) as lexeme
      -- Las palabras de relleno de una pregunta («¿me puedes decir…?»,
      -- «tengo una duda»). El diccionario español no las quita, y cuentan
      -- para la cobertura: «¿dan certificado?» se quedaba en un 50 %.
      where lexeme <> all (array[
        'algui', 'ayud', 'da', 'dan', 'deb', 'dec', 'dic', 'dig', 'dud', 'explic',
        'explicam', 'form', 'graci', 'hac', 'hag', 'hol', 'info', 'informacion',
        'maner', 'necesit', 'ok', 'pas', 'pasari', 'pod', 'podri', 'pregunt',
        'pued', 'quer', 'quier', 'sab', 'si', 'tem', 'val'
      ])
    ) as lex
  ),
  q as (
    select
      lex,
      case when cardinality(lex) = 0 then null
        else array_to_string(array(select quote_literal(l) from unnest(lex) as l), ' | ')::tsquery
      end as tsq
    from terms
  )
  select
    c.source_id,
    s.kind,
    s.title,
    c.heading,
    c.content,
    (
      select count(*) from unnest(q.lex) as l where l = any(tsvector_to_array(c.fts))
    )::real / cardinality(q.lex) as coverage,
    ts_rank_cd(c.fts, q.tsq) as rank
  from q
  join public.kb_chunks c on c.fts @@ q.tsq
  join public.kb_sources s on s.id = c.source_id
  where q.tsq is not null
    and s.active
    and (s.course is null or s.course = any(courses))
  order by coverage desc, rank desc
  limit match_count;
$$;

-- Sólo la llama el servidor con la service role, que es quien sabe a qué
-- cursos tiene acceso quien pregunta.
revoke execute on function public.search_kb(text, public.course_key[], integer) from public, anon, authenticated;
grant execute on function public.search_kb(text, public.course_key[], integer) to service_role;

------------------------------------------------------------
-- 3. Lo que se pregunta
------------------------------------------------------------
create table if not exists public.assistant_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question text not null,
  -- Lo que se le enseñó: la respuesta de la FAQ o el fragmento.
  answer text,
  -- false = no se encontró nada que encajara. Es la lista de trabajo del
  -- equipo: cada una es una FAQ que falta.
  answered boolean not null default true,
  source_ids uuid[] not null default '{}',
  -- El equipo la ha visto (y ha creado la FAQ, o ha decidido que no hacía
  -- falta). Deja de salir en la lista de pendientes.
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists assistant_questions_time_idx on public.assistant_questions (created_at desc);
create index if not exists assistant_questions_pending_idx on public.assistant_questions (created_at desc)
  where not answered and not reviewed;
create index if not exists assistant_questions_user_time_idx on public.assistant_questions (user_id, created_at desc);

------------------------------------------------------------
-- 4. RLS
------------------------------------------------------------
-- Los alumnos no leen la base directamente: les llega a través del asistente,
-- que la consulta con la service role. Así un contenido desactivado, o de un
-- curso que no tienen, no se puede sacar por la API de Supabase.
alter table public.kb_sources enable row level security;
alter table public.kb_chunks enable row level security;
alter table public.assistant_questions enable row level security;

drop policy if exists "kb_sources_staff" on public.kb_sources;
create policy "kb_sources_staff" on public.kb_sources
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "kb_chunks_staff" on public.kb_chunks;
create policy "kb_chunks_staff" on public.kb_chunks
  for all using (public.is_staff()) with check (public.is_staff());

-- Las preguntas las inserta el servidor. El equipo las lee y las marca.
drop policy if exists "assistant_questions_staff_read" on public.assistant_questions;
create policy "assistant_questions_staff_read" on public.assistant_questions
  for select using (public.is_staff());

drop policy if exists "assistant_questions_staff_update" on public.assistant_questions;
create policy "assistant_questions_staff_update" on public.assistant_questions
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "assistant_questions_admin_delete" on public.assistant_questions;
create policy "assistant_questions_admin_delete" on public.assistant_questions
  for delete using (public.is_admin());

commit;
