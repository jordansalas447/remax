-- =====================================================================
-- Sistema de usuarios: auth.users -> public.profiles -> public.personas
-- Ejecutar en Supabase (SQL Editor) o con `supabase db push`.
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Trigger: al registrarse un usuario en auth.users se crea (o enlaza)
--    su persona y su profile.
--    - Si ya existe una persona con el mismo correo, se reutiliza.
--    - Si no, se crea una persona nueva con los datos del registro
--      (raw_user_meta_data: nombre, apellido_paterno, apellido_materno).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_persona_id bigint;
  v_nombre     text;
  v_ap_paterno text;
  v_ap_materno text;
  v_full_name  text;
begin
  v_nombre     := coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''), split_part(new.email, '@', 1));
  v_ap_paterno := nullif(trim(new.raw_user_meta_data ->> 'apellido_paterno'), '');
  v_ap_materno := nullif(trim(new.raw_user_meta_data ->> 'apellido_materno'), '');
  v_full_name  := trim(concat_ws(' ', v_nombre, v_ap_paterno, v_ap_materno));

  -- Reutilizar una persona existente con el mismo correo
  select p.id
    into v_persona_id
    from public.personas p
   where lower(p.correo_electronico) = lower(new.email)
     and coalesce(p.eliminado, false) = false
   order by p.id
   limit 1;

  if v_persona_id is null then
    insert into public.personas (nombre, apellido_paterno, apellido_materno, correo_electronico)
    values (v_nombre, v_ap_paterno, v_ap_materno, new.email)
    returning id into v_persona_id;
  end if;

  insert into public.profiles (id, email, full_name, id_persona, role)
  values (new.id, new.email, v_full_name, v_persona_id, 'usuario')
  on conflict (id) do update
     set email      = excluded.email,
         id_persona = coalesce(public.profiles.id_persona, excluded.id_persona),
         full_name  = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. Mantener profiles.email sincronizado si el usuario cambia su correo
-- ---------------------------------------------------------------------
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- ---------------------------------------------------------------------
-- 3. RLS en profiles: cada usuario solo ve / edita su propio profile.
--    El usuario NO puede cambiar su `role` ni su `id_persona`
--    (solo se le concede UPDATE sobre full_name).
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

-- ---------------------------------------------------------------------
-- 4. Función segura para que el usuario edite SOLO su propia persona.
--    Se usa desde la página /perfil. No requiere habilitar RLS en
--    personas (que rompería los CRUD existentes).
-- ---------------------------------------------------------------------
create or replace function public.update_my_persona(payload jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_persona_id bigint;
begin
  select id_persona into v_persona_id
    from public.profiles
   where id = auth.uid();

  if v_persona_id is null then
    raise exception 'El usuario no tiene una persona asociada';
  end if;

  update public.personas set
    nombre               = coalesce(nullif(trim(payload ->> 'nombre'), ''), nombre),
    apellido_paterno     = nullif(trim(payload ->> 'apellido_paterno'), ''),
    apellido_materno     = nullif(trim(payload ->> 'apellido_materno'), ''),
    documento_identidad  = nullif(trim(payload ->> 'documento_identidad'), ''),
    fecha_nacimiento     = nullif(payload ->> 'fecha_nacimiento', '')::date,
    numero_telefono      = nullif(trim(payload ->> 'numero_telefono'), ''),
    numero_telefono_2    = nullif(trim(payload ->> 'numero_telefono_2'), ''),
    correo_electronico_2 = nullif(trim(payload ->> 'correo_electronico_2'), ''),
    direccion            = nullif(trim(payload ->> 'direccion'), '')
  where id = v_persona_id;

  update public.profiles
     set full_name = trim(concat_ws(' ',
           nullif(trim(payload ->> 'nombre'), ''),
           nullif(trim(payload ->> 'apellido_paterno'), ''),
           nullif(trim(payload ->> 'apellido_materno'), '')))
   where id = auth.uid();
end;
$$;

revoke all on function public.update_my_persona(jsonb) from public, anon;
grant execute on function public.update_my_persona(jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- 5. (Opcional) Crear profiles para usuarios que ya existían en auth.users
-- ---------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'nombre', split_part(u.email, '@', 1)), 'usuario'
  from auth.users u
 where not exists (select 1 from public.profiles p where p.id = u.id);
