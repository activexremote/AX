-- Audio narrado de la versión inglesa de cada lección. Si está vacío, quien
-- tenga el campus en inglés oye el español: mejor eso que nada.
alter table public.lessons
  add column if not exists audio_url_en text;
