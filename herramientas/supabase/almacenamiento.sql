-- ============================================================
--  Kill Team Companion · almacenamiento de imágenes
--  Ejecútalo después de esquema.sql (SQL Editor → New query → Run).
--  Crea el contenedor «imagenes»: lectura pública por enlace (los nombres de archivo
--  son aleatorios), y cada usuario solo puede subir y borrar dentro de su carpeta.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists imagenes_subir on storage.objects;
create policy imagenes_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'imagenes' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists imagenes_borrar on storage.objects;
create policy imagenes_borrar on storage.objects for delete to authenticated
  using (bucket_id = 'imagenes' and (storage.foldername(name))[1] = auth.uid()::text);
-- ver la lista de las propias imágenes (para poder borrarlas al eliminar la cuenta)
drop policy if exists imagenes_ver_propias on storage.objects;
create policy imagenes_ver_propias on storage.objects for select to authenticated
  using (bucket_id = 'imagenes' and (storage.foldername(name))[1] = auth.uid()::text);
-- el administrador puede borrar cualquier imagen (fotos de perfil o publicaciones inadecuadas)
drop policy if exists imagenes_borrar_admin on storage.objects;
create policy imagenes_borrar_admin on storage.objects for delete to authenticated
  using (bucket_id = 'imagenes' and public.es_admin());
-- quien administra una comunidad puede borrar las fotos publicadas en ella
drop policy if exists imagenes_borrar_moderador on storage.objects;
create policy imagenes_borrar_moderador on storage.objects for delete to authenticated
  using (bucket_id = 'imagenes' and exists (select 1 from public.publicaciones p where p.imagen = name and public.es_admin_grupo(p.grupo)));
