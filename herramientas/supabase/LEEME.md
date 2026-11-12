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
     `https://mausher00.github.io/kill-team/`. En *Redirect URLs* añade `https://mausher00.github.io/kill-team/**`.
     Sin esto, los enlaces de los correos (confirmar cuenta, recuperar contraseña) llevan a `localhost`.
4. **Copia los dos datos.** Menú *Project Settings* → *API* (o *API Keys*):
   - **Project URL** (termina en `.supabase.co`)
   - clave **anon public** (la pública; **no** la `service_role`)
   Pégalos en `js/config.js`, entre las comillas de `url` y `key`.
5. **Publica.** Ejecuta `python herramientas/pwa/generar_sw.py` y sube los cambios a GitHub.
6. **Prueba.** Abre la app → botón *Entrar* (arriba a la derecha) → *Crear cuenta*. Crea un grupo, copia el código y pásaselo a otro jugador.

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

## Cuentas (versión 2)

El registro pide **nombre de usuario, correo y contraseña** (mínimo 8 caracteres) y avisa al momento si el nombre ya está cogido.
Se entra con el correo y la contraseña desde el botón *Entrar* de cualquier página o desde *Comunidad*.
En *Ajustes de la cuenta* se puede cambiar el nombre, el correo y la contraseña, y borrar la cuenta.
*¿Has olvidado la contraseña?* envía un enlace; al abrirlo, la app pide la nueva.

Si ya tenías el proyecto creado, vuelve a ejecutar **`esquema.sql`** y **`almacenamiento.sql`** enteros (se pueden repetir sin perder datos):
añaden la comprobación de nombre libre, el perfil automático al registrarse y el borrado de cuenta.

## Administrador y fotos de perfil (versión 3)

- Cada cuenta puede poner una **foto de perfil** opcional (botón de la cámara en *Tu cuenta*). Se recorta en cuadrado de 320 px.
- Las cuentas con rol **admin** ven el botón *Administrar* (página `admin.html`): lista de todas las cuentas con su correo,
  fecha de alta, último acceso y datos guardados; pueden cambiar nombre y rol, quitar fotos, enviar un correo para cambiar
  la contraseña, borrar cuentas y borrar grupos. Nadie puede darse el rol de administrador desde la app.
- **Nombrar el primer administrador:** crea la cuenta (desde la app o en *Authentication → Users → Add user* con
  *Auto Confirm User*), abre `administrador.sql`, pon tu correo y tu nombre de usuario **solo en el editor de Supabase**
  y pulsa *Run*. No guardes el correo ni la contraseña en el repositorio: es público.
- Tras actualizar, vuelve a ejecutar `esquema.sql` y `almacenamiento.sql`.

## Comunidad · fase 1 (versión 4)

Cada comunidad tiene cuatro pestañas: **Tablón**, **Partidas**, **Galería** y **Miembros**.

- **Roles:** fundador (quien la creó), administrador y miembro. El fundador nombra administradores; los administradores
  moderan (borran mensajes y fotos), fijan anuncios, conceden distinciones, expulsan miembros y cambian el nombre,
  la descripción y el código. El administrador de la app puede moderar cualquier comunidad.
- **Tablón:** 250 caracteres por mensaje (1000 para quien administra), respuestas a un nivel y anuncios fijados.
  El límite lo comprueba también el servidor.
- **Rangos:** 1 punto por partida jugada en la comunidad y 5 por cada distinción (torneo, liga o evento ganado).
  Recluta 0 · Agente 3 · Veterano 10 · Élite 25 · Comandante 50 · Leyenda 100.
- **Galería:** fotos subidas directamente o adjuntas a mensajes del tablón.
- **Compartir:** imagen y texto por el menú del móvil, o WhatsApp, Telegram y X en el ordenador. No lleva enlace a la app.

Tras actualizar, vuelve a ejecutar `esquema.sql` y `almacenamiento.sql`.


## Comunidad · fase 2 (versión 5)

Pestaña **Eventos** en cada comunidad:

- **Lista y mes:** próximos y en curso, pasados, y un calendario mensual.
- **Tipos:** partida, quedada, liga, torneo y campaña. Los crean los administradores de la comunidad.
- **Asistencia:** voy, quizá o no puedo. En ligas, torneos y campañas «voy» es la inscripción.
- **Ligas y torneos:** los inscritos apuntan sus partidas; los administradores pueden generar los emparejamientos
  de todos contra todos. Clasificación con 3 puntos por victoria y 1 por empate.
- **Cierre:** al cerrar con ganador, este recibe una distinción (5 puntos de rango). Se puede reabrir.
- Cada evento se puede añadir al calendario del móvil y compartir en redes.

Tras actualizar, vuelve a ejecutar `esquema.sql`.


## Comunidad · fase 3 (versión 6)

- **Partidas en directo:** nadie ve una partida si el jugador no lo activa. Se activa en el último paso de la preparación
  («Hacerla visible») o en Opciones → *Compartir en directo*, eligiendo las comunidades. Los miembros ven en la pestaña
  Partidas la sección «En directo» y, al abrirla, los marcadores a los lados (puntos de victoria por punto de inflexión,
  puntos de mando, operativos en pie) y el mapa en el centro. Se actualiza sola cada pocos segundos.
  Al empezar otra partida hay que volver a activarlo.
- **Vídeo:** el jugador puede pegar un enlace de YouTube, Twitch o Vimeo. Sustituye al mapa en la vista del espectador y,
  si quiere, también en su propia pantalla de partida (botón «Ver mapa / Ver vídeo»). No se admiten otros sitios.
- **Campañas compartidas:** en Campaña → *Compartir en comunidad*. Los miembros ven la hoja de datos (operativos, rangos,
  honores, cicatrices y últimas partidas) en la pestaña Partidas, en solo lectura. Se actualiza al cambiarla.

Tras actualizar, vuelve a ejecutar `esquema.sql`.
