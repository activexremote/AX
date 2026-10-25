-- ══════════════════════════════════════════════════════════
--  Publicaciones: la misma publicación en español y en inglés
--
--  Una publicación sigue teniendo UN idioma (social_posts.language): así el
--  calendario, la nevera y la publicación por canal no cambian. La versión en
--  el otro idioma es otra publicación, enlazada con `pair_id`, que se escribe
--  adaptando la primera (no se reescribe de cero) y comparte sus imágenes.
--
--  El enlace va en las dos direcciones. Si se borra una, la otra se queda
--  sin pareja (on delete set null) pero sigue existiendo.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.social_posts
  add column if not exists pair_id uuid references public.social_posts(id) on delete set null;

create index if not exists social_posts_pair on public.social_posts (pair_id);

commit;
