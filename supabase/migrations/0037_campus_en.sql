-- ══════════════════════════════════════════════════════════
--  0037 · Versión inglesa de la ruta recomendada y de los desbloqueos
--
--  La portada del campus enseña la «Ruta recomendada» (learning_path_steps)
--  y el panel de los cursos relámpago, sus desbloqueos (unlocks). Las dos
--  tablas sólo tenían texto en español. Como en modules/lessons (0016), se
--  añade una columna _en por campo; vacía, el campus enseña el español.
--
--  También el código de cada módulo («MÓDULO 01 · NÚCLEO»), que sale en la
--  portada, la ficha y la lección, y los títulos de los módulos de The Web
--  ABC, que 0016 no tradujo.
-- ══════════════════════════════════════════════════════════

alter table public.learning_path_steps
  add column if not exists label_en text,
  add column if not exists description_en text;

alter table public.unlocks
  add column if not exists title_en text,
  add column if not exists description_en text;

-- ── Ruta recomendada ──
-- Por el texto español, que es lo que sembraron 0002/0003 (los id cambian
-- entre entornos). Sólo si todavía no hay traducción.
update public.learning_path_steps set
  label_en = 'Foundations',
  description_en = 'What remote work is and the core mindset.'
where label = 'Fundamentos' and coalesce(label_en, '') = '';

update public.learning_path_steps set
  label_en = 'Your setup',
  description_en = 'Workspace, equipment and digital tools.'
where label = 'Tu setup' and coalesce(label_en, '') = '';

update public.learning_path_steps set
  label_en = 'Communication',
  description_en = 'Writing clearly and communicating asynchronously.'
where label = 'Comunicación' and coalesce(label_en, '') = '';

update public.learning_path_steps set
  label_en = 'Productivity',
  description_en = 'Focus, planning and time management.'
where label = 'Productividad' and coalesce(label_en, '') = '';

update public.learning_path_steps set
  label_en = 'Operational',
  description_en = 'Ready to collaborate autonomously.'
where label = 'Operativo' and coalesce(label_en, '') = '';

-- ── Desbloqueos de Web ABC ──
-- Los títulos ya son nombres de producto en inglés; se copian tal cual.
update public.unlocks set
  title_en = 'The Web Starter Template',
  description_en = 'The official template with the base structure, components, configuration and documentation. Your starting point for your next project.'
where key = 'web-abc-starter-template' and coalesce(description_en, '') = '';

update public.unlocks set
  title_en = 'The Research Hack',
  description_en = 'The workflow for researching a product, its competitors and its documentation from the browser, and turning what you find into actionable context for Claude Code.'
where key = 'web-abc-research-hack' and coalesce(description_en, '') = '';

update public.unlocks set
  title_en = 'AI Builder Prompt Pack',
  description_en = 'Prompts for architecture, feature planning, UI, Supabase, debugging, diff review, QA, SEO and deploy.'
where key = 'web-abc-prompt-pack' and coalesce(description_en, '') = '';

update public.unlocks set
  title_en = 'Tool Perks',
  description_en = 'Discounts, credits and preferential codes negotiated with the tools in the stack. Updated over time.'
where key = 'web-abc-tool-perks' and coalesce(description_en, '') = '';

update public.unlocks set
  title_en = 'Ship Checklist',
  description_en = 'The launch checklist: repo → env → database → auth → build → deploy → domain → DNS → SSL → QA → launch.'
where key = 'web-abc-ship-checklist' and coalesce(description_en, '') = '';

-- ── Código de los módulos ──
alter table public.modules
  add column if not exists code_en text;

-- Programa: «MÓDULO 01 · NÚCLEO» → «MODULE 01 · CORE»; PROFESSIONAL y
-- FOUNDER ya son la misma palabra en inglés.
update public.modules set
  code_en = replace(replace(code, 'MÓDULO', 'MODULE'), 'NÚCLEO', 'CORE')
where course in ('core', 'remote-professional', 'remote-founder')
  and code is not null and coalesce(code_en, '') = '';

-- The Web ABC: el código, el título y la descripción de sus seis módulos.
update public.modules set
  code_en = 'MODULE 1 · THE MAP',
  title_en = coalesce(nullif(title_en, ''), 'The map'),
  description_en = coalesce(nullif(description_en, ''), 'What really happens between someone typing a URL and seeing your website. The pieces, their names and what each one does.')
where slug = 'web-abc-el-mapa' and coalesce(code_en, '') = '';

update public.modules set
  code_en = 'MODULE 2 · AI BUILDING',
  title_en = coalesce(nullif(title_en, ''), 'Building with AI, no black box'),
  description_en = coalesce(nullif(description_en, ''), 'Terminal, project and a Claude Code workflow you can explain line by line.')
where slug = 'web-abc-ai-building' and coalesce(code_en, '') = '';

update public.modules set
  code_en = 'MODULE 3 · DATA',
  title_en = coalesce(nullif(title_en, ''), 'Where the data lives'),
  description_en = coalesce(nullif(description_en, ''), 'Persistence, PostgreSQL, Supabase, schema, a first CRUD and how a piece of data travels between the form and the table.')
where slug = 'web-abc-datos' and coalesce(code_en, '') = '';

update public.modules set
  code_en = 'MODULE 4 · USERS AND SECURITY',
  title_en = coalesce(nullif(title_en, ''), 'Users and security'),
  description_en = coalesce(nullif(description_en, ''), 'Identity, session, authorisation and RLS. The difference between knowing who you are and deciding what you can see.')
where slug = 'web-abc-usuarios' and coalesce(code_en, '') = '';

update public.modules set
  code_en = 'MODULE 5 · SHIP',
  title_en = coalesce(nullif(title_en, ''), 'Putting it online'),
  description_en = coalesce(nullif(description_en, ''), 'Debugging, Git checkpoints, deploying on Vercel, environment variables, domain, DNS and static hosting.')
where slug = 'web-abc-ship' and coalesce(code_en, '') = '';

update public.modules set
  code_en = 'MODULE 6 · AUTONOMY',
  title_en = coalesce(nullif(title_en, ''), 'Autonomy'),
  description_en = coalesce(nullif(description_en, ''), 'From landing page to product, a real AI workflow, final architecture and delivery.')
where slug = 'web-abc-autonomia' and coalesce(code_en, '') = '';
