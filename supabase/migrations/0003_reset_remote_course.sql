-- Reorienta el campus a un curso de TRABAJO EN REMOTO.
-- Elimina todo el contenido anterior (temática logística) y lo reemplaza.

begin;

-- Limpieza del contenido anterior (cascade elimina lecciones, quizzes, progreso asociado)
delete from public.modules;
delete from public.learning_path_steps;

-- Ruta recomendada
insert into public.learning_path_steps (order_index, label, description) values
  (0, 'Fundamentos',     'Qué es el trabajo en remoto y la mentalidad base.'),
  (1, 'Tu setup',        'Espacio, equipo y herramientas digitales.'),
  (2, 'Comunicación',    'Escribir claro y comunicar en asíncrono.'),
  (3, 'Productividad',   'Foco, planificación y gestión del tiempo.'),
  (4, 'Operativo',       'Listo para colaborar con autonomía.');

-- Módulos
with new_modules(slug, order_index, code, title, description, icon, available, est) as (
  values
    ('fundamentos-remoto',      0, 'MÓDULO 0 · FUNDAMENTOS',          'Fundamentos del Trabajo en Remoto',
       'Qué es el trabajo en remoto, sus modalidades, la mentalidad y los hábitos base. Obligatorio antes de los módulos avanzados.',
       'Education', true, 45),
    ('herramientas-setup',      1, 'MÓDULO 1 · HERRAMIENTAS & SETUP', 'Herramientas & Setup',
       'Configura tu espacio de trabajo, tu equipo y tus herramientas digitales para rendir desde casa.',
       'Laptop', true, 20),
    ('comunicacion-remota',     2, 'MÓDULO 2 · COMUNICACIÓN',         'Comunicación Efectiva en Remoto',
       'Comunicación asíncrona y síncrona, escritura clara y cómo evitar malentendidos sin estar cara a cara.',
       'Chat', true, 60),
    ('productividad-tiempo',    3, 'MÓDULO 3 · PRODUCTIVIDAD',        'Productividad & Gestión del Tiempo',
       'Métodos de foco, planificación del día y gestión de la energía trabajando en remoto.',
       'Time', true, 50),
    ('colaboracion-equipo',     4, 'MÓDULO 4 · COLABORACIÓN',         'Colaboración y Trabajo en Equipo',
       'Cómo colaborar en proyectos, dar feedback y mantener la cohesión del equipo en la distancia.',
       'Collaborate', true, 40),
    ('reuniones-facilitacion',  5, 'MÓDULO 5 · REUNIONES',            'Reuniones y Facilitación Remota',
       'Diseñar y facilitar reuniones remotas eficaces y videollamadas que no agoten al equipo.',
       'Events', true, 35),
    ('liderazgo-remoto',        6, 'MÓDULO 6 · LIDERAZGO',            'Liderazgo de Equipos Remotos',
       'Gestión de personas, confianza, objetivos y cultura para quien lidera equipos distribuidos.',
       'GroupSecurity', true, 40),
    ('bienestar-equilibrio',    7, 'MÓDULO 7 · BIENESTAR',            'Buenas Prácticas y Bienestar',
       'Equilibrio vida-trabajo, ergonomía, desconexión y hábitos sostenibles trabajando en remoto.',
       'Favorite', true, 30)
)
insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes)
select slug, order_index, code, title, description, icon, '#161616', available, est
from new_modules;

-- Lecciones del Módulo 0 · Fundamentos (9 lecciones)
with m as (select id from public.modules where slug = 'fundamentos-remoto'),
new_lessons(slug, order_index, title, subtitle, duration_min, content_md, toc) as (
  values
    ('que-es-trabajo-remoto', 1, 'Qué es el trabajo en remoto',
       'El concepto, las modalidades y qué hace a un buen profesional en remoto.', 6,
$$### El cambio al trabajo en remoto

Trabajar en remoto significa desarrollar tu actividad profesional **fuera de una oficina central**, apoyándote en herramientas digitales para comunicarte, colaborar y entregar resultados.

No es "trabajar desde el sofá". Es una forma de organización basada en **resultados y autonomía**, no en estar sentado en una silla durante ocho horas.

### Modalidades de trabajo

- **Presencial**: todo el equipo en la misma oficina.
- **Híbrido**: se combinan días en oficina y días en remoto.
- **Remoto (o distribuido)**: el equipo trabaja desde distintas ubicaciones, y la oficina deja de ser el centro de gravedad.

En un equipo remoto bien organizado, la información vive en documentos y herramientas compartidas, **no en la cabeza de una persona ni en una reunión**.

### Qué hace a un buen profesional remoto

1. **Comunica de forma clara y por escrito.** Lo que no se escribe, se pierde.
2. **Trabaja en asíncrono.** No espera ni exige respuestas inmediatas.
3. **Es autónomo y fiable.** Se le mide por lo que entrega, no por estar conectado.
4. **Documenta.** Deja rastro para que cualquiera pueda continuar su trabajo.

Estos cuatro hábitos son la base de todo el curso.
$$::text,
       '[{"id":"cambio","title":"El cambio al trabajo en remoto"},{"id":"modalidades","title":"Modalidades de trabajo"},{"id":"buen-profesional","title":"Qué hace a un buen profesional remoto"},{"id":"examen","title":"Examen"}]'::jsonb),
    ('modalidades-trabajo', 2, 'Modalidades: remoto, híbrido y presencial',
       'Diferencias, ventajas y retos de cada modelo.', 5, 'Contenido en preparación…', null),
    ('mentalidad-remota', 3, 'La mentalidad del profesional remoto',
       'Autonomía, responsabilidad y enfoque en resultados.', 5, 'Contenido en preparación…', null),
    ('rutina-diaria', 4, 'Tu rutina diaria en remoto',
       'Cómo estructurar el día para rendir sin agotarte.', 5, 'Contenido en preparación…', null),
    ('comunicacion-asincrona', 5, 'Comunicación asíncrona: el pilar del remoto',
       'Qué es y por qué cambia la forma de trabajar.', 5, 'Contenido en preparación…', null),
    ('herramientas-imprescindibles', 6, 'Herramientas imprescindibles',
       'El stack mínimo para trabajar en remoto.', 5, 'Contenido en preparación…', null),
    ('confianza-autonomia', 7, 'Gestionar la confianza y la autonomía',
       'Cómo se construye la confianza en la distancia.', 5, 'Contenido en preparación…', null),
    ('errores-comunes', 8, 'Errores comunes al empezar',
       'Lo que conviene evitar en tus primeras semanas.', 5, 'Contenido en preparación…', null),
    ('glosario-remoto', 9, 'Glosario del trabajo en remoto',
       'Los términos del día a día.', 5, 'Contenido en preparación…', null)
)
insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, toc)
select m.id, l.slug, l.order_index, l.title, l.subtitle, l.duration_min, l.content_md, l.toc
from m, new_lessons l;

-- Quiz de la lección "Qué es el trabajo en remoto"
with l as (select id from public.lessons where slug = 'que-es-trabajo-remoto')
insert into public.quizzes (lesson_id, pass_score)
select id, 0.80 from l;

-- Preguntas
with q as (
  select q.id from public.quizzes q
  join public.lessons l on l.id = q.lesson_id
  where l.slug = 'que-es-trabajo-remoto'
),
qs(order_index, prompt) as (
  values
    (1, '¿Qué define principalmente el trabajo en remoto?'),
    (2, 'Un compañero dice: "trabajar en remoto es estar disponible por chat todo el día". ¿Qué le responderías?'),
    (3, '¿Qué es la comunicación asíncrona?'),
    (4, '¿Cuál es una ventaja clave del trabajo en remoto bien hecho?'),
    (5, '¿Por qué es importante documentar el trabajo en un equipo remoto?')
)
insert into public.quiz_questions (quiz_id, order_index, prompt)
select q.id, qs.order_index, qs.prompt from q, qs;

-- Opciones
do $$
declare
  qrow record;
  q_id uuid;
begin
  select q.id into q_id from public.quizzes q
    join public.lessons l on l.id = q.lesson_id
    where l.slug = 'que-es-trabajo-remoto';
  if q_id is null then return; end if;

  for qrow in
    select id, order_index from public.quiz_questions where quiz_id = q_id order by order_index
  loop
    case qrow.order_index
      when 1 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Trabajar siempre desde casa sin horario fijo', false),
          (qrow.id, 2, 'Desarrollar la actividad profesional fuera de una oficina central, apoyándose en herramientas digitales', true),
          (qrow.id, 3, 'Estar conectado al chat de la empresa durante toda la jornada', false),
          (qrow.id, 4, 'Trabajar solo por las tardes', false);
      when 2 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Es correcto: en remoto hay que responder al instante', false),
          (qrow.id, 2, 'No es correcto: el remoto se basa en resultados y comunicación asíncrona, no en estar conectado siempre', true),
          (qrow.id, 3, 'Es correcto, pero solo para los managers', false),
          (qrow.id, 4, 'Es correcto si trabajas en atención al cliente', false);
      when 3 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Hablar por videollamada en tiempo real', false),
          (qrow.id, 2, 'Intercambiar mensajes sin esperar respuesta inmediata, respetando los tiempos de cada persona', true),
          (qrow.id, 3, 'Enviar correos solo los lunes', false),
          (qrow.id, 4, 'Comunicarse únicamente con el manager', false);
      when 4 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Que nadie revisa tu trabajo', false),
          (qrow.id, 2, 'Permite enfocarse en resultados y reducir interrupciones, ganando flexibilidad y autonomía', true),
          (qrow.id, 3, 'Que puedes trabajar menos horas', false),
          (qrow.id, 4, 'Que no hacen falta reuniones nunca', false);
      when 5 then
        insert into public.quiz_options (question_id, order_index, label, is_correct) values
          (qrow.id, 1, 'Para tener más archivos en el ordenador', false),
          (qrow.id, 2, 'Porque permite que cualquiera acceda a la información sin depender de una reunión o de una persona concreta', true),
          (qrow.id, 3, 'Porque lo exige la ley', false),
          (qrow.id, 4, 'Para que el manager controle tus horas', false);
      else
        null;
    end case;
  end loop;
end$$;

commit;
