# Activar el servidor (Supabase)

Con esto se encienden las **cuentas** (tus bandas e historial en todos tus dispositivos), **buscar jugador**
para invitarle a una partida y la **comunidad** (grupos con resultados, bandas, comandos e imágenes compartidas).
Sin estos pasos la app sigue funcionando igual que antes, sin servidor.

## Pasos (unos 10 minutos, una sola vez)

1. **Crea el proyecto.** Entra en https://supabase.com, regístrate y pulsa *New project*.
   Nombre libre (por ejemplo `kill-team`), una contraseña de base de datos (guárdala) y región **Europe**.
   Espera a que termine de prepararse.
2. **Crea las tablas.** Menú *SQL Editor* → *New query*. Pega entero el contenido de `esquema.sql` y pulsa *Run*.
   Debe terminar con «Success». Repite con `almacenamiento.sql`.
3. **Ajusta el registro.** Menú *Authentication*:
   - *Sign In / Providers* → *Email*: activado. Si no quieres que haya que confirmar el correo, desactiva *Confirm email*
     (más cómodo para un grupo de amigos; con ella activada cada uno recibe un correo de confirmación).
   - *URL Configuration* → *Site URL*: la dirección pública de la app, por ejemplo
     `https://grsambar-jpg.github.io/Kill-Team-companion/`.
4. **Copia los dos datos.** Menú *Project Settings* → *API* (o *API Keys*):
   - **Project URL** (termina en `.supabase.co`)
   - clave **anon public** (la pública; **no** la `service_role`)
   Pégalos en `js/config.js`, entre las comillas de `url` y `key`.
5. **Publica.** Ejecuta `python herramientas/pwa/generar_sw.py` y sube los cambios a GitHub.
6. **Prueba.** Abre la app → *Comunidad* → *Crear cuenta*. Crea un grupo, copia el código y pásaselo a otro jugador.

## Qué se guarda y quién lo ve

| Dato | Quién lo ve |
|---|---|
| Correo y contraseña | Nadie (los gestiona Supabase; la app solo guarda la sesión en tu navegador) |
| Nombre de jugador | Cualquier usuario con sesión (para poder buscarte) |
| Bandas e historial sincronizados | Solo tú |
| Publicaciones de un grupo (mensajes, resultados, bandas, comandos, imágenes) | Los miembros de ese grupo |
| Invitaciones | Quien la envía y quien la recibe |
| Imágenes | Quien tenga su enlace (los nombres de archivo son aleatorios); solo se enlazan dentro del grupo |

La clave `anon` es pública por diseño: lo que protege los datos son las reglas por filas de `esquema.sql`.

## Límites del plan gratuito (orientativos; compruébalos en supabase.com/pricing)

- Base de datos y almacenamiento de sobra para un grupo de amigos (las imágenes se reducen antes de subirse, máximo 3 MB).
- Los proyectos gratuitos **se pausan si pasan varios días sin uso**; se reactivan desde el panel de Supabase.

## Si algo falla

- «No tienes permiso para hacer eso»: falta ejecutar `esquema.sql` o se ejecutó a medias. Vuelve a ejecutarlo (se puede repetir).
- No se suben imágenes: falta `almacenamiento.sql`.
- «Confirma tu correo antes de entrar»: está activada la confirmación (paso 3).
- Para borrar todo y empezar de cero: *Database* → *Tables* y elimina las tablas, o crea un proyecto nuevo.
