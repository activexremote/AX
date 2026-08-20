-- Cobro con Stripe: catálogo por curso, pedidos y matrículas.
--
-- Hasta ahora el campus no tenía ninguna noción de compra: cualquiera con
-- cuenta veía todos los módulos. Aquí entran las tres piezas que faltan:
--   · a qué curso pertenece cada módulo,
--   · el pedido (que nace ANTES de pagar, para no perder el email de quien
--     abandona el checkout),
--   · la matrícula, que es lo que abre el acceso.

begin;

------------------------------------------------------------
-- 1. Catálogo: a qué curso pertenece cada módulo
------------------------------------------------------------
-- 'core' son los módulos compartidos por los dos caminos. Por defecto todo lo
-- que ya existe entra como núcleo común: los 8 módulos sembrados son de
-- fundamentos genéricos de trabajo remoto y ninguno es específico de un
-- camino. ⚠︎ Cuando se carguen los 14 módulos reales del programa hay que
-- asignar cada uno desde el panel de administración.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'course_key') then
    create type public.course_key as enum ('core', 'remote-professional', 'remote-founder');
  end if;
end$$;

alter table public.modules
  add column if not exists course public.course_key not null default 'core';

create index if not exists modules_course_idx on public.modules (course);

------------------------------------------------------------
-- 2. Pedidos
------------------------------------------------------------
-- Un pedido se crea en cuanto alguien deja su email y pulsa "pagar", con
-- estado 'iniciado'. El webhook de Stripe lo mueve a 'pagado' o 'expirado'.
-- Ese orden importa: si el pedido sólo naciera al confirmarse el pago,
-- perderíamos el contacto de todo el que se cae por el camino, que es
-- justamente a quien hay que recuperar.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum (
      'iniciado',    -- email capturado, sesión de pago abierta
      'pagado',      -- pago único cobrado
      'en_plazos',   -- suscripción de 3 plazos viva
      'completado',  -- los 3 plazos cobrados
      'fallido',     -- un cobro rechazado
      'expirado',    -- checkout abandonado
      'reembolsado'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'order_plan') then
    create type public.order_plan as enum ('unico', 'plazos', 'anticipada');
  end if;
end$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Datos de contacto. Se piden antes de ir a Stripe, así que están siempre.
  email text not null,
  first_name text,
  last_name text,
  locale text,

  -- Qué se compra: uno de los dos cursos, o los dos.
  courses public.course_key[] not null,
  plan public.order_plan not null,
  offer text not null,                 -- clave de la oferta en el catálogo

  status public.order_status not null default 'iniciado',

  -- Importes en la unidad mínima (céntimos), tal y como los devuelve Stripe.
  amount_total integer,
  currency text,
  instalments_paid integer not null default 0,

  stripe_session_id text unique,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,

  -- Se rellena cuando el pago crea (o encuentra) la cuenta del campus.
  user_id uuid references public.profiles(id) on delete set null,

  notes text,

  constraint orders_courses_not_empty check (cardinality(courses) > 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_email_idx      on public.orders (lower(email));
create index if not exists orders_user_idx       on public.orders (user_id);
create index if not exists orders_subscription_idx on public.orders (stripe_subscription_id);

------------------------------------------------------------
-- 3. Matrículas
------------------------------------------------------------
-- Lo que de verdad abre el acceso. Se separa del pedido porque un pedido
-- puede dar dos matrículas (el pack) y porque una matrícula puede suspenderse
-- sin tocar el histórico de la compra.
create table if not exists public.enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course public.course_key not null,
  order_id uuid references public.orders(id) on delete set null,
  granted_at timestamptz not null default now(),
  -- Un impago de un plazo suspende sin borrar: al ponerse al día se reactiva.
  active boolean not null default true,
  primary key (user_id, course),
  constraint enrollments_no_core check (course <> 'core')
);

create index if not exists enrollments_user_idx on public.enrollments (user_id) where active;

------------------------------------------------------------
-- 4. Quién ve qué
------------------------------------------------------------
-- El núcleo común se abre con cualquier matrícula activa; los módulos de un
-- camino, sólo con la matrícula de ese camino.
create or replace function public.has_course_access(target public.course_key)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when public.is_staff() then true
      when target = 'core' then exists (
        select 1 from public.enrollments e where e.user_id = auth.uid() and e.active
      )
      else exists (
        select 1 from public.enrollments e
        where e.user_id = auth.uid() and e.active and e.course = target
      )
    end;
$$;

-- ⚠︎ Cambio de comportamiento: hasta ahora bastaba con estar autenticado para
-- ver todos los módulos. A partir de aquí hace falta matrícula. Las cuentas de
-- prueba que existan sin matrícula dejarán de ver contenido hasta que se les
-- dé una desde el panel.
drop policy if exists "modules_read" on public.modules;
create policy "modules_read" on public.modules
  for select using (public.has_course_access(course));

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (
    exists (
      select 1 from public.modules m
      where m.id = lessons.module_id and public.has_course_access(m.course)
    )
  );

------------------------------------------------------------
-- 5. RLS de las tablas nuevas
------------------------------------------------------------
-- Los pedidos los escribe siempre el servidor con la service role (el importe
-- no puede venir del navegador). Por eso no hay ninguna política de insert.
alter table public.orders enable row level security;

drop policy if exists "orders_own_read" on public.orders;
create policy "orders_own_read" on public.orders
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "orders_staff_manage" on public.orders;
create policy "orders_staff_manage" on public.orders
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete" on public.orders
  for delete using (public.is_admin());

alter table public.enrollments enable row level security;

drop policy if exists "enrollments_own_read" on public.enrollments;
create policy "enrollments_own_read" on public.enrollments
  for select using (user_id = auth.uid() or public.is_staff());

drop policy if exists "enrollments_staff_manage" on public.enrollments;
create policy "enrollments_staff_manage" on public.enrollments
  for all using (public.is_staff()) with check (public.is_staff());

------------------------------------------------------------
-- 6. updated_at
------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

commit;
