-- =====================================================================
-- Administración del control de acceso por horario.
-- Requiere las tablas/funciones: horarios_acceso, control_acceso,
-- sesiones_acceso, horario_actual_permitido, acceso_habilitado y
-- registrar_sesion_acceso.
--
-- Se asume que el rol administrador es profiles.role = 'admin'.
-- Si usas otro valor, cámbialo en public.es_admin().
-- =====================================================================

-- 1. Helper: ¿el usuario actual es administrador? -----------------------
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles as p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

-- 2. Cada usuario puede leer SU propio horario (para mostrarlo en /perfil)
drop policy if exists "horarios_acceso_select_own" on public.horarios_acceso;
create policy "horarios_acceso_select_own"
  on public.horarios_acceso for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "control_acceso_select_own" on public.control_acceso;
create policy "control_acceso_select_own"
  on public.control_acceso for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 3. Listado de usuarios con su acceso y horarios (solo admin) -----------
create or replace function public.admin_listar_accesos()
returns table (
  user_id    uuid,
  email      text,
  full_name  text,
  role       text,
  activo     boolean,
  horarios   jsonb
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    p.email::text,
    p.full_name::text,
    p.role::text,
    coalesce(c.activo, false),
    coalesce(
      (
        select jsonb_agg(
                 jsonb_build_object(
                   'dia_semana',  h.dia_semana,
                   'hora_inicio', to_char(h.hora_inicio, 'HH24:MI'),
                   'hora_fin',    to_char(h.hora_fin, 'HH24:MI'),
                   'activo',      h.activo
                 )
                 order by h.dia_semana
               )
        from public.horarios_acceso as h
        where h.user_id = p.id
      ),
      '[]'::jsonb
    )
  from public.profiles as p
  left join public.control_acceso as c on c.user_id = p.id
  order by p.full_name nulls last, p.email;
end;
$$;

revoke all on function public.admin_listar_accesos() from public, anon;
grant execute on function public.admin_listar_accesos() to authenticated;

-- 4. Guardar acceso + horarios de un usuario (solo admin) ----------------
--    p_horarios: [{ "dia_semana": 1, "hora_inicio": "08:00",
--                   "hora_fin": "18:00", "activo": true }, ...]
--    Reemplaza el horario completo e invalida sus sesiones registradas,
--    de modo que deba volver a iniciar sesión con el nuevo horario.
create or replace function public.admin_guardar_acceso(
  p_user_id  uuid,
  p_activo   boolean,
  p_horarios jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  if not exists (select 1 from auth.users as u where u.id = p_user_id) then
    raise exception 'Usuario no encontrado';
  end if;

  insert into public.control_acceso (user_id, activo, actualizado_at)
  values (p_user_id, p_activo, now())
  on conflict (user_id)
  do update set activo = excluded.activo, actualizado_at = now();

  delete from public.horarios_acceso as h where h.user_id = p_user_id;

  insert into public.horarios_acceso (user_id, dia_semana, hora_inicio, hora_fin, activo)
  select
    p_user_id,
    (x ->> 'dia_semana')::smallint,
    (x ->> 'hora_inicio')::time,
    (x ->> 'hora_fin')::time,
    coalesce((x ->> 'activo')::boolean, true)
  from jsonb_array_elements(coalesce(p_horarios, '[]'::jsonb)) as x;

  delete from public.sesiones_acceso as s where s.user_id = p_user_id;
end;
$$;

revoke all on function public.admin_guardar_acceso(uuid, boolean, jsonb) from public, anon;
grant execute on function public.admin_guardar_acceso(uuid, boolean, jsonb) to authenticated;
