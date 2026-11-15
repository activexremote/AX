-- ══════════════════════════════════════════════════════════
--  «Trae preparado» de las horas de clase, sin «plantilla descargada»
--
--  Las descargas de las horas de clase se abren a los invitados del dry run
--  cuando empieza la clase, así que no pueden traer la plantilla descargada.
--  Pasa en los siete módulos: se cambia en todos.
--  La frase nueva vale para ellos y para el alumno del curso, que la tiene
--  abierta desde el principio: la plantilla, a mano, en las descargas de la
--  lección. Sólo cambia el texto; las casillas siguen en su sitio, así que lo
--  que cada uno ya había marcado no se pierde.
--
--  Se busca la cadena JSON entera, comillas incluidas: sólo cambia el punto
--  de la lista que es exactamente esa frase. Si alguna ya no está (alguien
--  editó las lecciones), falla y no toca nada.
-- ══════════════════════════════════════════════════════════

do $$
declare
  r record;
  n integer;
begin
  for r in
    select * from (values
      ('La plantilla de la hora 1 descargada', 'La plantilla de la hora 1 a mano (está en las descargas de abajo)'),
      ('La plantilla de la hora 1, descargada.', 'La plantilla de la hora 1 a mano (está en las descargas de abajo).'),
      ('La plantilla de la hora 2 descargada', 'La plantilla de la hora 2 a mano (está en las descargas de abajo)'),
      ('La plantilla de la hora 3 descargada', 'La plantilla de la hora 3 a mano (está en las descargas de abajo)'),
      ('Las dos plantillas de la hora 2 descargadas', 'Las dos plantillas de la hora 2 a mano (están en las descargas de abajo)'),
      ('Las plantillas de la hora 2 y de la hora 3 descargadas', 'Las plantillas de la hora 2 y de la hora 3 a mano (están en las descargas de abajo)'),
      ('The hour 1 template downloaded', 'The hour 1 template to hand (it''s in the downloads below)'),
      ('The Hour 1 template, downloaded.', 'The Hour 1 template to hand (it''s in the downloads below).'),
      ('The hour 2 template downloaded', 'The hour 2 template to hand (it''s in the downloads below)'),
      ('The hour 3 template downloaded', 'The hour 3 template to hand (it''s in the downloads below)'),
      ('Both hour 2 templates downloaded', 'Both hour 2 templates to hand (they''re in the downloads below)'),
      ('The hour 2 and hour 3 templates downloaded', 'The hour 2 and hour 3 templates to hand (they''re in the downloads below)')
    ) as c(viejo, nuevo)
  loop
    update public.lessons
    set
      content_blocks = replace(content_blocks::text, to_jsonb(r.viejo)::text, to_jsonb(r.nuevo)::text)::jsonb,
      content_blocks_en = replace(content_blocks_en::text, to_jsonb(r.viejo)::text, to_jsonb(r.nuevo)::text)::jsonb
    where content_blocks::text like '%' || to_jsonb(r.viejo)::text || '%'
       or content_blocks_en::text like '%' || to_jsonb(r.viejo)::text || '%';
    get diagnostics n = row_count;
    if n = 0 then
      raise exception 'Ninguna lección dice «%»', r.viejo;
    end if;
  end loop;
end $$;
