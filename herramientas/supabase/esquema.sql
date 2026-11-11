-- ============================================================
--  Kill Team Companion · esquema de Supabase
--  Pégalo entero en  SQL Editor → New query → Run.
--  Se puede ejecutar más de una vez sin romper nada.
--
--  Qué crea:
--   · perfiles      nombre público de cada cuenta (para buscar jugadores)
--   · bandas        copia en la nube de las bandas guardadas de cada usuario
--   · partidas      copia en la nube del historial de cada usuario
--   · grupos        comunidades; se entra con un código
--   · miembros      quién está en cada grupo
--   · publicaciones lo que se comparte en un grupo: resultados, bandas, comandos, imágenes, mensajes
--   · invitaciones  invitación a jugar de un usuario a otro, con fecha y enlace
--   · almacenamiento «imagenes» para las fotos subidas
--  Todas las tablas tienen seguridad por filas: cada uno solo ve lo suyo y lo de sus grupos.
-- ============================================================

create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 2 and 24),
  creado timestamptz not null default now()
);
create unique index if not exists perfiles_nombre_uq on public.perfiles (lower(nombre));

create table if not exists public.bandas (
  id text not null,
  usuario uuid not null references auth.users (id) on delete cascade,
  nombre text not null,
  comando text not null,
  datos jsonb not null,
  borrada boolean not null default false,
  actualizado timestamptz not null default now(),
  primary key (usuario, id)
);

create table if not exists public.partidas (
  id text not null,
  usuario uuid not null references auth.users (id) on delete cascade,
  fecha timestamptz not null,
  datos jsonb not null,
  primary key (usuario, id)
);

create table if not exists public.grupos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 40),
  codigo text not null unique check (codigo ~ '^[A-Z0-9]{6}$'),
  creador uuid not null references auth.users (id) on delete cascade,
  creado timestamptz not null default now()
);

create table if not exists public.miembros (
  grupo uuid not null references public.grupos (id) on delete cascade,
  usuario uuid not null references auth.users (id) on delete cascade,
  rol text not null default 'miembro' check (rol in ('admin', 'miembro')),
  desde timestamptz not null default now(),
  primary key (grupo, usuario)
);

create table if not exists public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null references public.grupos (id) on delete cascade,
  usuario uuid not null references auth.users (id) on delete cascade,
  tipo text not null check (tipo in ('resultado', 'banda', 'comando', 'imagen', 'mensaje')),
  texto text check (char_length(texto) <= 600),
  datos jsonb,
  imagen text,
  creado timestamptz not null default now()
);
create index if not exists publicaciones_grupo_idx on public.publicaciones (grupo, creado desc);

create table if not exists public.invitaciones (
  id uuid primary key default gen_random_uuid(),
  de uuid not null references auth.users (id) on delete cascade,
  para uuid not null references auth.users (id) on delete cascade,
  mensaje text check (char_length(mensaje) <= 300),
  cuando timestamptz,
  enlace text check (char_length(enlace) <= 500),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'rechazada')),
  creado timestamptz not null default now()
);
create index if not exists invitaciones_para_idx on public.invitaciones (para, creado desc);

-- ¿El usuario actual pertenece al grupo? (security definer: evita recursión en las políticas)
create or replace function public.es_miembro(g uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.miembros m where m.grupo = g and m.usuario = auth.uid()) $$;

-- ¿Comparte algún grupo con ese usuario?
create or replace function public.comparte_grupo(u uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.miembros a join public.miembros b on a.grupo = b.grupo where a.usuario = auth.uid() and b.usuario = u) $$;

-- Entrar en un grupo con su código (los grupos no se pueden listar sin ser miembro)
create or replace function public.unirse_grupo(c text) returns uuid
  language plpgsql security definer set search_path = public as
$$
declare g uuid;
begin
  if auth.uid() is null then raise exception 'Hay que iniciar sesión'; end if;
  select id into g from public.grupos where codigo = upper(trim(c));
  if g is null then raise exception 'No existe ningún grupo con ese código'; end if;
  insert into public.miembros (grupo, usuario) values (g, auth.uid()) on conflict do nothing;
  return g;
end $$;

-- Crear un grupo y quedar como administrador
create or replace function public.crear_grupo(n text) returns public.grupos
  language plpgsql security definer set search_path = public as
$$
declare r public.grupos; c text; k int := 0;
begin
  if auth.uid() is null then raise exception 'Hay que iniciar sesión'; end if;
  loop
    c := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    begin
      insert into public.grupos (nombre, codigo, creador) values (trim(n), c, auth.uid()) returning * into r;
      exit;
    exception when unique_violation then k := k + 1; if k > 8 then raise; end if;
    end;
  end loop;
  insert into public.miembros (grupo, usuario, rol) values (r.id, auth.uid(), 'admin');
  return r;
end $$;

alter table public.perfiles      enable row level security;
alter table public.bandas        enable row level security;
alter table public.partidas      enable row level security;
alter table public.grupos        enable row level security;
alter table public.miembros      enable row level security;
alter table public.publicaciones enable row level security;
alter table public.invitaciones  enable row level security;

-- perfiles: cualquier usuario con sesión puede buscar nombres; cada uno edita el suyo
drop policy if exists perfiles_ver on public.perfiles;
create policy perfiles_ver on public.perfiles for select to authenticated using (true);
drop policy if exists perfiles_crear on public.perfiles;
create policy perfiles_crear on public.perfiles for insert to authenticated with check (id = auth.uid());
drop policy if exists perfiles_editar on public.perfiles;
create policy perfiles_editar on public.perfiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- bandas y partidas: privadas de cada usuario
drop policy if exists bandas_propias on public.bandas;
create policy bandas_propias on public.bandas for all to authenticated using (usuario = auth.uid()) with check (usuario = auth.uid());
drop policy if exists partidas_propias on public.partidas;
create policy partidas_propias on public.partidas for all to authenticated using (usuario = auth.uid()) with check (usuario = auth.uid());

-- grupos: los ven sus miembros; los edita o borra quien los creó
drop policy if exists grupos_ver on public.grupos;
create policy grupos_ver on public.grupos for select to authenticated using (public.es_miembro(id));
drop policy if exists grupos_editar on public.grupos;
create policy grupos_editar on public.grupos for update to authenticated using (creador = auth.uid()) with check (creador = auth.uid());
drop policy if exists grupos_borrar on public.grupos;
create policy grupos_borrar on public.grupos for delete to authenticated using (creador = auth.uid());

-- miembros: se ven entre sí; cada uno puede salir; el creador del grupo puede expulsar
drop policy if exists miembros_ver on public.miembros;
create policy miembros_ver on public.miembros for select to authenticated using (public.es_miembro(grupo));
drop policy if exists miembros_salir on public.miembros;
create policy miembros_salir on public.miembros for delete to authenticated
  using (usuario = auth.uid() or exists (select 1 from public.grupos g where g.id = grupo and g.creador = auth.uid()));

-- publicaciones: las ven y crean los miembros; cada uno borra las suyas (y el creador del grupo, cualquiera)
drop policy if exists publicaciones_ver on public.publicaciones;
create policy publicaciones_ver on public.publicaciones for select to authenticated using (public.es_miembro(grupo));
drop policy if exists publicaciones_crear on public.publicaciones;
create policy publicaciones_crear on public.publicaciones for insert to authenticated with check (usuario = auth.uid() and public.es_miembro(grupo));
drop policy if exists publicaciones_borrar on public.publicaciones;
create policy publicaciones_borrar on public.publicaciones for delete to authenticated
  using (usuario = auth.uid() or exists (select 1 from public.grupos g where g.id = grupo and g.creador = auth.uid()));

-- invitaciones: las ve quien la envía y quien la recibe; responde solo quien la recibe
drop policy if exists invitaciones_ver on public.invitaciones;
create policy invitaciones_ver on public.invitaciones for select to authenticated using (de = auth.uid() or para = auth.uid());
drop policy if exists invitaciones_crear on public.invitaciones;
create policy invitaciones_crear on public.invitaciones for insert to authenticated with check (de = auth.uid() and para <> auth.uid());
drop policy if exists invitaciones_responder on public.invitaciones;
create policy invitaciones_responder on public.invitaciones for update to authenticated using (para = auth.uid()) with check (para = auth.uid());
drop policy if exists invitaciones_borrar on public.invitaciones;
create policy invitaciones_borrar on public.invitaciones for delete to authenticated using (de = auth.uid() or para = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.perfiles, public.bandas, public.partidas, public.grupos, public.miembros, public.publicaciones, public.invitaciones to authenticated;
grant execute on function public.es_miembro(uuid), public.comparte_grupo(uuid), public.unirse_grupo(text), public.crear_grupo(text) to authenticated;

-- ============================================================
--  Cuentas (v2): registro con nombre de usuario, correo y contraseña
-- ============================================================

-- ¿Está libre este nombre de usuario? (se puede consultar antes de registrarse)
create or replace function public.nombre_libre(n text) returns boolean
  language sql stable security definer set search_path = public as
$$ select not exists (select 1 from public.perfiles where lower(nombre) = lower(trim(n))) $$;

-- Al registrarse se crea su perfil con el nombre elegido. Si el nombre ya está cogido, el registro falla.
create or replace function public.nuevo_usuario() returns trigger
  language plpgsql security definer set search_path = public as
$$
declare n text := trim(coalesce(new.raw_user_meta_data ->> 'nombre', ''));
begin
  if char_length(n) between 2 and 24 then
    insert into public.perfiles (id, nombre) values (new.id, n);
  end if;
  return new;
end $$;
drop trigger if exists al_registrarse on auth.users;
create trigger al_registrarse after insert on auth.users for each row execute function public.nuevo_usuario();

-- Borrar la propia cuenta y todos sus datos (bandas, partidas, grupos creados, publicaciones…)
-- Las imágenes subidas las borra antes la app con la API de almacenamiento.
create or replace function public.borrar_cuenta() returns void
  language plpgsql security definer set search_path = public, auth as
$$
begin
  if auth.uid() is null then raise exception 'Hay que iniciar sesión'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke execute on function public.nuevo_usuario() from public, anon, authenticated;
revoke execute on function public.borrar_cuenta() from public, anon;
grant execute on function public.nombre_libre(text) to anon, authenticated;
grant execute on function public.borrar_cuenta() to authenticated;

-- ============================================================
--  Roles y foto de perfil (v3)
--  · perfiles.rol: 'jugador' (todos) o 'admin' (ve y administra las cuentas)
--  · perfiles.avatar: ruta de la foto en el almacenamiento «imagenes» (opcional)
--  Para nombrar el primer administrador, ver LEEME.md (no se guarda aquí ningún correo).
-- ============================================================
alter table public.perfiles add column if not exists rol text not null default 'jugador';
alter table public.perfiles add column if not exists avatar text;
alter table public.perfiles drop constraint if exists perfiles_rol_ck;
alter table public.perfiles add constraint perfiles_rol_ck check (rol in ('jugador', 'admin'));
alter table public.perfiles drop constraint if exists perfiles_avatar_ck;
alter table public.perfiles add constraint perfiles_avatar_ck check (avatar is null or char_length(avatar) <= 200);

create or replace function public.es_admin() returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin') $$;

-- Nadie puede darse a sí mismo el rol de administrador desde la app
create or replace function public.proteger_rol() returns trigger
  language plpgsql security definer set search_path = public as
$$
begin
  if auth.uid() is not null and new.rol is distinct from coalesce(old.rol, 'jugador') and not public.es_admin() then
    raise exception 'Solo un administrador puede cambiar roles';
  end if;
  return new;
end $$;
drop trigger if exists perfiles_rol on public.perfiles;
create trigger perfiles_rol before insert or update on public.perfiles for each row execute function public.proteger_rol();

-- Lista de cuentas para el administrador (incluye el correo, que nadie más ve)
create or replace function public.admin_cuentas()
  returns table (id uuid, nombre text, email text, rol text, avatar text, creado timestamptz, ultimo_acceso timestamptz,
                 confirmado boolean, bandas bigint, partidas bigint, grupos bigint)
  language plpgsql stable security definer set search_path = public, auth as
$$
begin
  if not public.es_admin() then raise exception 'Solo para administradores'; end if;
  return query
    select u.id, p.nombre, u.email::text, coalesce(p.rol, 'jugador'), p.avatar, u.created_at, u.last_sign_in_at,
           u.email_confirmed_at is not null,
           (select count(*) from public.bandas b where b.usuario = u.id and not b.borrada),
           (select count(*) from public.partidas x where x.usuario = u.id),
           (select count(*) from public.miembros m where m.usuario = u.id)
    from auth.users u left join public.perfiles p on p.id = u.id
    order by u.created_at desc;
end $$;

create or replace function public.admin_editar(u uuid, n text, r text) returns void
  language plpgsql security definer set search_path = public as
$$
begin
  if not public.es_admin() then raise exception 'Solo para administradores'; end if;
  if r not in ('jugador', 'admin') then raise exception 'Rol no válido'; end if;
  if r = 'jugador' and u = auth.uid() and (select count(*) from public.perfiles where rol = 'admin') <= 1 then
    raise exception 'Tiene que quedar al menos un administrador';
  end if;
  insert into public.perfiles (id, nombre, rol) values (u, trim(n), r)
    on conflict (id) do update set nombre = trim(n), rol = r;
end $$;

create or replace function public.admin_quitar_foto(u uuid) returns void
  language plpgsql security definer set search_path = public as
$$
begin
  if not public.es_admin() then raise exception 'Solo para administradores'; end if;
  update public.perfiles set avatar = null where id = u;
end $$;

create or replace function public.admin_borrar(u uuid) returns void
  language plpgsql security definer set search_path = public, auth as
$$
begin
  if not public.es_admin() then raise exception 'Solo para administradores'; end if;
  if u = auth.uid() then raise exception 'Para borrar tu propia cuenta usa Ajustes de la cuenta'; end if;
  delete from auth.users where id = u;
end $$;

create or replace function public.admin_grupos()
  returns table (id uuid, nombre text, codigo text, creador text, miembros bigint, publicaciones bigint, creado timestamptz)
  language plpgsql stable security definer set search_path = public as
$$
begin
  if not public.es_admin() then raise exception 'Solo para administradores'; end if;
  return query
    select g.id, g.nombre, g.codigo, p.nombre, (select count(*) from public.miembros m where m.grupo = g.id),
           (select count(*) from public.publicaciones x where x.grupo = g.id), g.creado
    from public.grupos g left join public.perfiles p on p.id = g.creador order by g.creado desc;
end $$;

-- el administrador puede borrar cualquier grupo
drop policy if exists grupos_borrar on public.grupos;
create policy grupos_borrar on public.grupos for delete to authenticated using (creador = auth.uid() or public.es_admin());

revoke execute on function public.admin_cuentas(), public.admin_editar(uuid, text, text), public.admin_quitar_foto(uuid),
  public.admin_borrar(uuid), public.admin_grupos(), public.proteger_rol() from public, anon;
grant execute on function public.es_admin(), public.admin_cuentas(), public.admin_editar(uuid, text, text),
  public.admin_quitar_foto(uuid), public.admin_borrar(uuid), public.admin_grupos() to authenticated;
