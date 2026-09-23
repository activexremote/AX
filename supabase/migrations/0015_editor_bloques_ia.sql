-- ══════════════════════════════════════════════════════════
--  Lecciones por bloques + clave de IA gestionada desde el panel
--
--  Dos cosas, y las dos para lo mismo: que el profesor escriba en texto y la
--  lección salga con checklists, cuadros y gráficos sin tocar Markdown.
--
--  1. lessons.content_blocks — el contenido estructurado.
--
--     NO sustituye a content_md: convive con él. Mientras una lección no
--     tenga bloques, el campus sigue pintando su Markdown exactamente igual
--     que hasta ahora, así que ninguna lección existente cambia de aspecto
--     ni hay que migrar nada. `content_md` se queda además como el borrador
--     del profesor y como el texto que lee la narración de audio y el
--     corrector de misiones, que trabajan sobre texto plano.
--
--     El formato lo valida la aplicación (src/lib/content/blocks.ts), no la
--     base de datos: es jsonb libre a propósito, porque el catálogo de
--     bloques va a crecer y una restricción aquí obligaría a una migración
--     por cada tipo nuevo.
--
--  2. ai_settings — una fila, la clave de OpenAI y el modelo.
--
--     Misma forma que slack_settings (0004): singleton, sólo administradores
--     y con el resultado del último test guardado. La clave se guarda tal
--     cual, como el bot_token de Slack: en Postgres no hay ningún secreto
--     cifrado en este proyecto y fingir que éste lo está sería peor que
--     decirlo. Lo que sí se cumple es que NUNCA sale del servidor: las
--     páginas del panel sólo reciben los cuatro últimos caracteres.
-- ══════════════════════════════════════════════════════════

begin;

-- ── 1. El contenido por bloques ──────────────────────────
alter table public.lessons
  add column if not exists content_blocks jsonb;

comment on column public.lessons.content_blocks is
  'Bloques de la lección (ver src/lib/content/blocks.ts). Nulo o vacío = se pinta content_md.';

-- ── 2. La configuración de IA ────────────────────────────
create table if not exists public.ai_settings (
  -- Una sola fila, igual que slack_settings.
  id text primary key default 'default',
  enabled boolean not null default true,
  -- Clave de la API de OpenAI. Sin ella, el panel sigue funcionando entero:
  -- lo único que no aparece es el botón de estructurar con IA.
  openai_api_key text,
  model text not null default 'gpt-4o',
  -- Resultado del último "probar conexión", para no tener que adivinar si la
  -- clave vale.
  last_test_ok boolean,
  last_test_at timestamptz,
  last_test_detail text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.ai_settings (id) values ('default')
on conflict (id) do nothing;

alter table public.ai_settings enable row level security;

-- Sólo administradores. Los profesores usan la IA sin ver nunca la clave:
-- las llamadas las hace el servidor con la service role.
drop policy if exists ai_settings_admin on public.ai_settings;
create policy ai_settings_admin on public.ai_settings
  for all using (public.is_admin()) with check (public.is_admin());

commit;
