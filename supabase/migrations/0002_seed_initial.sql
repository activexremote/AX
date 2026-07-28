-- Seed inicial: módulos y ruta recomendada para ActiveXRemote Campus

-- Ruta recomendada (mismos pasos que el original)
insert into public.learning_path_steps (order_index, label, description) values
  (0, 'Onboarding General',  'Qué es ActiveXRemote y cómo funciona la operación.'),
  (1, 'Tu departamento',     'Específico del rol que vayas a ocupar.'),
  (2, 'Herramientas',        'Slack, CRM, dashboards y stack diario.'),
  (3, 'Runbooks clave',      'Procesos críticos paso a paso.'),
  (4, 'Operativo',           'Listo para operar de manera autónoma.')
on conflict do nothing;

-- Módulos
with new_modules(slug, order_index, code, title, description, icon, accent, available, est) as (
  values
    ('onboarding-general',     0, 'MÓDULO 0 · ONBOARDING GENERAL',  'Onboarding General',
       'Qué es ActiveXRemote, el modelo de negocio, los KPIs, los clientes y cómo funciona la operación. Obligatorio antes de cualquier formación departamental.',
       'Education', '#0f62fe', true, 45),
    ('herramientas-setup',     1, 'MÓDULO 1 · HERRAMIENTAS & SETUP', 'Herramientas & Setup',
       'Chrome, marcadores, Slack, CRM y PayFit. Todo lo que necesitas configurar en tu primer día.',
       'Tools', '#0f62fe', true, 20),
    ('expansion-sdr',          2, 'MÓDULO 2 · EXPANSIÓN & SDR', 'Expansión & SDR',
       'Demand Needs, prospección, Hunter, la operativa SDR en dual lane y el handoff a Network. Todo el ciclo de captación de clientes.',
       'Rocket', '#0f62fe', true, 60),
    ('network-activaciones',   3, 'MÓDULO 3 · NETWORK & ACTIVACIONES', 'Network & Activaciones',
       'Activación de clientes, mantenimiento de la red, gestión de cierres.',
       'NetworkPublic', '#0f62fe', true, 50),
    ('atencion-cliente',       4, 'MÓDULO 4 · ATENCIÓN AL CLIENTE (SAC)', 'Atención al Cliente (SAC)',
       'Gestión de incidencias, protocolos de soporte Tier 1/2, desactivación de clientes y escalado. Base de operaciones del equipo de atención.',
       'Headphones', '#0f62fe', true, 40),
    ('derivaciones-last-mile', 5, 'MÓDULO 5 · DERIVACIONES & LAST-MILE', 'Derivaciones & Last-Mile',
       'Llamadas de pre-entrega, callouts, CAC, contactabilidad y conversión. Optimización del last-mile.',
       'Phone', '#0f62fe', true, 35),
    ('ops-managers',           6, 'MÓDULO 6 · OPS — MANAGERS', 'ActiveXRemote Ops — Managers',
       'Gestión de equipos, KPIs operacionales, planificación de turnos.',
       'GroupSecurity', '#0f62fe', true, 40),
    ('ops-agentes',            7, 'MÓDULO 7 · OPS — AGENTES', 'ActiveXRemote Ops — Agentes',
       'Operativa diaria de agentes, procesos y mejores prácticas.',
       'UserMultiple', '#0f62fe', true, 30)
)
insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes)
select slug, order_index, code, title, description, icon, accent, available, est
from new_modules
on conflict (slug) do update set
  order_index = excluded.order_index,
  code = excluded.code,
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  accent = excluded.accent,
  available = excluded.available,
  estimated_minutes = excluded.estimated_minutes;

-- Lecciones del módulo Onboarding General (9 lecciones según las capturas)
with m as (select id from public.modules where slug = 'onboarding-general'),
new_lessons(slug, order_index, title, subtitle, duration_min, content_md, toc) as (
  values
    ('que-es-activexremote', 1, 'Qué es ActiveXRemote',
       'El concepto, el problema que resolvemos, y cómo funciona para clientes y usuarios.', 5,
$$### El problema: la operación remota

Cuando una empresa quiere operar de forma distribuida, el último tramo (la coordinación humana del día a día) es, **con diferencia, el más caro y complicado** de todo el proceso. Se llama "la última milla operativa".

La gente no está en oficina, las herramientas están fragmentadas, los procesos quedan en cabezas en lugar de en runbooks. Es ineficiente para todos.

### La solución: ActiveXRemote

ActiveXRemote es la red operativa que conecta a empresas, equipos remotos y procesos en un único campus de trabajo. No reemplazamos Slack ni el CRM — los **orquestamos**.

### ¿Para quién trabajamos?

Para empresas que quieren escalar operaciones remotas sin perder calidad ni control.
$$::text,
       '[{"id":"problema","title":"El problema: la operación remota"},{"id":"solucion","title":"La solución: ActiveXRemote"},{"id":"para-quien","title":"Para quién trabajamos"},{"id":"examen","title":"Examen"}]'::jsonb),
    ('modelo-negocio', 2, 'El modelo de negocio',
       'Los actores, de dónde viene el dinero, y qué gana cada parte.', 5,
       'Contenido del modelo de negocio…', null),
    ('flujo-de-paquete', 3, 'El flujo de un paquete',
       'Desde que alguien compra online hasta que recoge su paquete en un ActiveXRemote.', 5,
       'Contenido…', null),
    ('puntos-axr', 4, 'Los ActiveXRemote Points',
       'Cómo funcionan los puntos físicos y digitales de la red.', 5, 'Contenido…', null),
    ('carriers-operadores', 5, 'Carriers y operadores', 'Quiénes son y cómo encajan en la red.', 5, 'Contenido…', null),
    ('flujo-paquete-2', 6, 'El flujo de un paquete (avanzado)', 'Casos especiales y devoluciones.', 5, 'Contenido…', null),
    ('equipo-axr', 7, 'El equipo ActiveXRemote', 'Departamentos y responsables.', 5, 'Contenido…', null),
    ('herramientas-vista-general', 8, 'Las herramientas: vista general', 'Qué usa cada equipo.', 5, 'Contenido…', null),
    ('glosario-basico', 9, 'Glosario de términos', 'Las palabras del día a día.', 5, 'Contenido…', null)
)
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, toc)
select m.id, l.slug, l.order_index, l.title, l.subtitle, l.duration_min, l.content_md, l.toc
from m, new_lessons l
on conflict (module_id, slug) do nothing;

-- Quiz de ejemplo en la lección "Qué es ActiveXRemote"
with l as (select id from public.lessons where slug = 'que-es-activexremote')
insert into public.quizzes (lesson_id, pass_score)
select id, 0.80 from l
on conflict (lesson_id) do nothing;

-- Preguntas + opciones del quiz (5 preguntas, mismo número que el original)
with q as (
  select q.id from public.quizzes q
  join public.lessons l on l.id = q.lesson_id
  where l.slug = 'que-es-activexremote'
),
qs(order_index, prompt, options) as (
  values
    (1,
     '¿Qué es ActiveXRemote?',
     ARRAY[
       ROW('Una empresa de transporte que compite con SEUR y DHL', false),
       ROW('Una red operativa que orquesta procesos remotos para empresas', true),
       ROW('Un proveedor de hosting', false),
       ROW('Un CRM como Salesforce', false)
     ]::record[]),
    (2,
     'Un nuevo empleado dice: "ActiveXRemote es una empresa de transporte". ¿Qué le responderías?',
     ARRAY[
       ROW('Es correcto, transportamos paquetes con furgonetas propias', false),
       ROW('No es correcto: somos la red operativa que conecta equipos y procesos', true),
       ROW('Es parcialmente correcto, tenemos repartidores propios', false),
       ROW('Es correcto, pero también tenemos comercios asociados', false)
     ]::record[]),
    (3,
     '¿Qué es un AXR Point?',
     ARRAY[
       ROW('Un almacén logístico', false),
       ROW('Una oficina de correos asociada', false),
       ROW('Un nodo operativo (físico o digital) integrado a la red ActiveXRemote', true),
       ROW('Un sistema de incentivos', false)
     ]::record[]),
    (4,
     '¿Cuál es el principal problema que resuelve ActiveXRemote?',
     ARRAY[
       ROW('La velocidad de descarga de archivos', false),
       ROW('La última milla operativa en empresas distribuidas', true),
       ROW('La gestión de facturas', false),
       ROW('El diseño de interfaces', false)
     ]::record[]),
    (5,
     '¿Por qué los puntos de conveniencia son más eficientes que la entrega a domicilio para el operador?',
     ARRAY[
       ROW('Porque los paquetes pesan menos cuando van a un comercio', false),
       ROW('Porque puede dejar muchos paquetes en pocos comercios en vez de ir casa por casa', true),
       ROW('Porque los comercios pagan al repartidor directamente', false),
       ROW('Porque el repartidor no necesita escanear los paquetes', false)
     ]::record[])
)
insert into public.quiz_questions (quiz_id, order_index, prompt)
select q.id, qs.order_index, qs.prompt from q, qs
on conflict do nothing;

-- Insertar opciones
do $$
declare
  qrow record;
  q_id uuid;
  opt record;
  i int;
begin
  select q.id into q_id from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    where l.slug = 'que-es-activexremote';
  if q_id is null then return; end if;

  -- Por cada question, insertar sus opciones si aún no existen
  for qrow in
    select id, order_index from public.quiz_questions where quiz_id = q_id order by order_index
  loop
    if exists (select 1 from public.quiz_options where question_id = qrow.id) then
      continue;
    end if;
    case qrow.order_index
      when 1 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Una empresa de transporte que compite con SEUR y DHL', false),
          (qrow.id, 2, 'Una red operativa que orquesta procesos remotos para empresas', true),
          (qrow.id, 3, 'Un proveedor de hosting', false),
          (qrow.id, 4, 'Un CRM como Salesforce', false);
      when 2 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Es correcto, transportamos paquetes con furgonetas propias', false),
          (qrow.id, 2, 'No es correcto: somos la red operativa que conecta equipos y procesos', true),
          (qrow.id, 3, 'Es parcialmente correcto, tenemos repartidores propios', false),
          (qrow.id, 4, 'Es correcto, pero también tenemos comercios asociados', false);
      when 3 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Un almacén logístico', false),
          (qrow.id, 2, 'Una oficina de correos asociada', false),
          (qrow.id, 3, 'Un nodo operativo (físico o digital) integrado a la red ActiveXRemote', true),
          (qrow.id, 4, 'Un sistema de incentivos', false);
      when 4 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'La velocidad de descarga de archivos', false),
          (qrow.id, 2, 'La última milla operativa en empresas distribuidas', true),
          (qrow.id, 3, 'La gestión de facturas', false),
          (qrow.id, 4, 'El diseño de interfaces', false);
      when 5 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Porque los paquetes pesan menos cuando van a un comercio', false),
          (qrow.id, 2, 'Porque puede dejar muchos paquetes en pocos comercios en vez de ir casa por casa', true),
          (qrow.id, 3, 'Porque los comercios pagan al repartidor directamente', false),
          (qrow.id, 4, 'Porque el repartidor no necesita escanear los paquetes', false);
      else
        null;
    end case;
  end loop;
end$$;
