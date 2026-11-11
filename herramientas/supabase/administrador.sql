-- ============================================================
--  Nombrar administrador
--  1. Crea la cuenta desde la app (Entrar → Crear cuenta) o en Supabase:
--     Authentication → Users → Add user → Create new user (marca «Auto Confirm User»).
--  2. Cambia el correo y el nombre de abajo, pega esto en SQL Editor y pulsa Run.
--  No guardes aquí tu correo si el repositorio es público: escríbelo solo en el editor de Supabase.
-- ============================================================
insert into public.perfiles (id, nombre, rol)
select id, 'NOMBRE_DE_USUARIO', 'admin' from auth.users where lower(email) = lower('TU_CORREO@ejemplo.com')
on conflict (id) do update set rol = 'admin', nombre = excluded.nombre;

-- comprobar: debe salir una fila con rol = admin
select p.nombre, u.email, p.rol from public.perfiles p join auth.users u on u.id = p.id where p.rol = 'admin';
