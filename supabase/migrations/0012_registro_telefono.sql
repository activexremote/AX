-- Registro con enlace mágico + teléfono verificado por SMS
--
-- El acceso al campus deja de tener contraseña: se entra con un enlace de un
-- solo uso enviado al correo. El registro, en cambio, pide nombre, email y
-- teléfono, y el teléfono se confirma con un código SMS justo después de
-- abrir el enlace. Aquí sólo vive la parte de datos: el perfil necesita
-- guardar el número y desde cuándo está verificado.

begin;

------------------------------------------------------------
-- 1. Teléfono en el perfil
------------------------------------------------------------
-- `phone` guarda el número en E.164 tal y como se pidió en el registro, esté
-- verificado o no: es a donde se manda el SMS. `phone_verified_at` es la
-- prueba de que alguien contestó al código; mientras sea null, el número
-- está declarado pero no demostrado.
--
-- auth.users también acaba guardando el teléfono al confirmarse el código,
-- pero esa tabla no se puede leer desde la app con la clave pública: sin esta
-- copia, cada pantalla que quisiera enseñar el número tendría que pasar por
-- la service role.
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists phone_verified_at timestamptz;

------------------------------------------------------------
-- 2. El alta copia el teléfono de los metadatos
------------------------------------------------------------
-- El registro manda nombre y teléfono dentro del enlace mágico, así que
-- cuando la cuenta se crea (al abrir el enlace) los dos vienen en
-- raw_user_meta_data. Se copian igual que ya se copiaba el nombre.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    'alumno'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
