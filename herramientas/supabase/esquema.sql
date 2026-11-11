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
  if g is null then raise exception 'No existe ninguna comunidad con ese código'; end if;
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

-- ============================================================
--  Comunidad · fase 1 (v4)
--  · Roles dentro de cada comunidad: fundador (quien la creó), administrador y miembro
--  · Tablón: respuestas, anuncios fijados y límite de 250 caracteres para quien no administra
--  · Galería: fotos subidas directamente, sin pasar por el tablón (publicaciones.galeria = no sale en el tablón;
--    también lo llevan los resultados publicados desde la pestaña Partidas)
--  · Distinciones: títulos que dan los administradores (torneos y eventos ganados); suben el rango
-- ============================================================
alter table public.grupos add column if not exists descripcion text;
alter table public.grupos drop constraint if exists grupos_descripcion_ck;
alter table public.grupos add constraint grupos_descripcion_ck check (descripcion is null or char_length(descripcion) <= 300);

alter table public.publicaciones add column if not exists fijada boolean not null default false;
alter table public.publicaciones add column if not exists galeria boolean not null default false;
alter table public.publicaciones add column if not exists respuesta_a uuid references public.publicaciones (id) on delete cascade;
alter table public.publicaciones drop constraint if exists publicaciones_texto_check;
alter table public.publicaciones drop constraint if exists publicaciones_texto_ck;
alter table public.publicaciones add constraint publicaciones_texto_ck check (texto is null or char_length(texto) <= 1000);
create index if not exists publicaciones_resp_idx on public.publicaciones (respuesta_a);

create table if not exists public.distinciones (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null references public.grupos (id) on delete cascade,
  usuario uuid not null references auth.users (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 2 and 60),
  tipo text not null default 'torneo' check (tipo in ('torneo', 'liga', 'campana', 'evento', 'oficial', 'otro')),
  fecha date not null default current_date,
  otorgada_por uuid references auth.users (id) on delete set null,
  creado timestamptz not null default now()
);
create index if not exists distinciones_grupo_idx on public.distinciones (grupo, usuario);

-- ¿El usuario actual administra la comunidad? (fundador, administrador de la comunidad o administrador de la app)
create or replace function public.es_admin_grupo(g uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.grupos x where x.id = g and x.creador = auth.uid())
       or exists (select 1 from public.miembros m where m.grupo = g and m.usuario = auth.uid() and m.rol = 'admin')
       or public.es_admin() $$;

-- Reglas del tablón que no caben en una política
create or replace function public.reglas_publicacion() returns trigger
  language plpgsql security definer set search_path = public as
$$
declare madre public.publicaciones;
begin
  if auth.uid() is null then return new; end if;                       -- editor SQL / mantenimiento
  if not public.es_admin_grupo(new.grupo) then
    if char_length(coalesce(new.texto, '')) > 250 then raise exception 'El mensaje no puede pasar de 250 caracteres'; end if;
    if new.fijada then raise exception 'Solo los administradores pueden fijar anuncios'; end if;
  end if;
  if new.respuesta_a is not null then
    select * into madre from public.publicaciones where id = new.respuesta_a;
    if madre.id is null or madre.grupo <> new.grupo then raise exception 'La publicación a la que respondes ya no existe'; end if;
    if madre.respuesta_a is not null then raise exception 'No se puede responder a una respuesta'; end if;
    new.fijada := false; new.galeria := false;
  end if;
  return new;
end $$;
drop trigger if exists publicaciones_reglas on public.publicaciones;
create trigger publicaciones_reglas before insert on public.publicaciones for each row execute function public.reglas_publicacion();

-- Fijar o soltar un anuncio
create or replace function public.fijar_publicacion(p uuid, f boolean) returns void
  language plpgsql security definer set search_path = public as
$$
declare g uuid;
begin
  select grupo into g from public.publicaciones where id = p and respuesta_a is null;
  if g is null then raise exception 'La publicación no existe'; end if;
  if not public.es_admin_grupo(g) then raise exception 'Solo los administradores pueden fijar anuncios'; end if;
  update public.publicaciones set fijada = f where id = p;
end $$;

-- Nombre y descripción de la comunidad
create or replace function public.editar_grupo(g uuid, n text, d text) returns void
  language plpgsql security definer set search_path = public as
$$
begin
  if not public.es_admin_grupo(g) then raise exception 'Solo los administradores pueden cambiar la comunidad'; end if;
  update public.grupos set nombre = trim(n), descripcion = nullif(trim(coalesce(d, '')), '') where id = g;
end $$;

-- Código nuevo (el anterior deja de valer)
create or replace function public.nuevo_codigo(g uuid) returns text
  language plpgsql security definer set search_path = public as
$$
declare c text; k int := 0;
begin
  if not public.es_admin_grupo(g) then raise exception 'Solo los administradores pueden cambiar el código'; end if;
  loop
    c := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    begin update public.grupos set codigo = c where id = g; exit;
    exception when unique_violation then k := k + 1; if k > 8 then raise; end if; end;
  end loop;
  return c;
end $$;

-- Nombrar o quitar administradores: solo el fundador (o un administrador de la app)
create or replace function public.cambiar_rol(g uuid, u uuid, r text) returns void
  language plpgsql security definer set search_path = public as
$$
declare f uuid;
begin
  select creador into f from public.grupos where id = g;
  if f is null then raise exception 'La comunidad no existe'; end if;
  if auth.uid() <> f and not public.es_admin() then raise exception 'Solo el fundador puede nombrar administradores'; end if;
  if u = f then raise exception 'El fundador siempre administra la comunidad'; end if;
  if r not in ('admin', 'miembro') then raise exception 'Rol no válido'; end if;
  update public.miembros set rol = r where grupo = g and usuario = u;
  if not found then raise exception 'Ese jugador no está en la comunidad'; end if;
end $$;

-- Expulsar: los administradores a los miembros; solo el fundador a otros administradores
create or replace function public.expulsar(g uuid, u uuid) returns void
  language plpgsql security definer set search_path = public as
$$
declare f uuid; rol_u text;
begin
  select creador into f from public.grupos where id = g;
  if not public.es_admin_grupo(g) then raise exception 'Solo los administradores pueden expulsar'; end if;
  if u = f then raise exception 'No se puede expulsar al fundador'; end if;
  select rol into rol_u from public.miembros where grupo = g and usuario = u;
  if rol_u is null then raise exception 'Ese jugador no está en la comunidad'; end if;
  if rol_u = 'admin' and auth.uid() <> f and not public.es_admin() then raise exception 'Solo el fundador puede expulsar a un administrador'; end if;
  delete from public.miembros where grupo = g and usuario = u;
end $$;

alter table public.distinciones enable row level security;

-- el administrador de la app puede ver y moderar cualquier comunidad
drop policy if exists grupos_ver on public.grupos;
create policy grupos_ver on public.grupos for select to authenticated using (public.es_miembro(id) or public.es_admin());
drop policy if exists miembros_ver on public.miembros;
create policy miembros_ver on public.miembros for select to authenticated using (public.es_miembro(grupo) or public.es_admin());
drop policy if exists publicaciones_ver on public.publicaciones;
create policy publicaciones_ver on public.publicaciones for select to authenticated using (public.es_miembro(grupo) or public.es_admin());

-- salir: cada uno por su cuenta, salvo el fundador (que tendría que borrar la comunidad). Expulsar va por expulsar()
drop policy if exists miembros_salir on public.miembros;
create policy miembros_salir on public.miembros for delete to authenticated
  using (usuario = auth.uid() and not exists (select 1 from public.grupos g where g.id = grupo and g.creador = auth.uid()));

-- borrar publicaciones: las propias, o cualquiera si administras la comunidad
drop policy if exists publicaciones_borrar on public.publicaciones;
create policy publicaciones_borrar on public.publicaciones for delete to authenticated
  using (usuario = auth.uid() or public.es_admin_grupo(grupo));

-- nombre y descripción se cambian con editar_grupo(); nadie edita la tabla directamente
drop policy if exists grupos_editar on public.grupos;

drop policy if exists distinciones_ver on public.distinciones;
create policy distinciones_ver on public.distinciones for select to authenticated using (public.es_miembro(grupo) or public.es_admin());
drop policy if exists distinciones_dar on public.distinciones;
create policy distinciones_dar on public.distinciones for insert to authenticated
  with check (public.es_admin_grupo(grupo) and otorgada_por = auth.uid()
              and exists (select 1 from public.miembros m where m.grupo = distinciones.grupo and m.usuario = distinciones.usuario));
drop policy if exists distinciones_quitar on public.distinciones;
create policy distinciones_quitar on public.distinciones for delete to authenticated using (public.es_admin_grupo(grupo));

grant select, insert, delete on public.distinciones to authenticated;
revoke execute on function public.reglas_publicacion() from public, anon, authenticated;
revoke execute on function public.es_admin_grupo(uuid), public.fijar_publicacion(uuid, boolean), public.editar_grupo(uuid, text, text),
  public.nuevo_codigo(uuid), public.cambiar_rol(uuid, uuid, text), public.expulsar(uuid, uuid) from public, anon;
grant execute on function public.es_admin_grupo(uuid), public.fijar_publicacion(uuid, boolean), public.editar_grupo(uuid, text, text),
  public.nuevo_codigo(uuid), public.cambiar_rol(uuid, uuid, text), public.expulsar(uuid, uuid) to authenticated;
