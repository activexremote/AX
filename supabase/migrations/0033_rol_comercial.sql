-- ══════════════════════════════════════════════════════════
--  El rol comercial
--
--  Va solo en su migración: un valor nuevo de un enum no se puede usar en
--  la misma transacción que lo crea, y la 0034 ya lo usa.
-- ══════════════════════════════════════════════════════════

alter type public.user_role add value if not exists 'comercial';
