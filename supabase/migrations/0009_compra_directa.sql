-- Compra directa: el botón «comprar» de la landing, sin formulario previo.
--
-- Hasta ahora un pedido nacía SIEMPRE con email, porque siempre venía de un
-- formulario que lo pedía antes de salir hacia Stripe. Eso sigue siendo lo
-- mejor cuando hay formulario: si abandonan el pago, tenemos a quién llamar.
--
-- Pero para un curso de precio cerrado que se compra por impulso desde un
-- anuncio, pedir tres campos antes de enseñar la pasarela es una pantalla de
-- más justo en el peor momento. En ese camino el email lo recoge Stripe, y
-- llega en el webhook: en `checkout.session.completed` si paga, y en
-- `checkout.session.expired` si lo deja a medias —Stripe rellena
-- `customer_details` en cuanto la persona escribe el correo, así que el
-- contacto tampoco se pierde—.
--
-- De ahí que la columna pase a admitir nulos: durante unos minutos, un pedido
-- puede existir sin email. El webhook lo rellena.

begin;

alter table public.orders alter column email drop not null;

comment on column public.orders.email is
  'Nulo sólo mientras dura una compra directa sin formulario: lo rellena el webhook con el correo que recoge Stripe.';

-- El índice era sobre lower(email) y con nulos no sirve para nada: se limita a
-- las filas que sí lo tienen, que son las que se buscan.
drop index if exists orders_email_idx;
create index orders_email_idx on public.orders (lower(email)) where email is not null;

commit;
