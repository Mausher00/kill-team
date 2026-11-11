# Herramientas

Scripts de apoyo (Python 3). Ninguno hace falta para usar la app: solo para regenerar datos o recursos.

## Antes de subir cambios a GitHub
```
python herramientas/pwa/generar_sw.py
```
Regenera `sw.js` con la lista de archivos. Así la app instalada y el modo sin conexión incluyen lo último.

## Imágenes (WebP)
- `imagenes/webp.py` — convierte `imagenes/**/*.jpg|png` a WebP (≈ 26 MB → 6 MB).
- `imagenes/limpiar.py` — lista los .jpg/.png que ya tienen su .webp; con `--si` los borra.
  ```
  python herramientas/imagenes/limpiar.py          (solo muestra)
  python herramientas/imagenes/limpiar.py . --si   (borra)
  ```

## Iconos (Tabler, alojados en el proyecto)
- `iconos/subset.py` — crea `recursos/iconos/tabler-icons.woff2` y `css/iconos.css` solo con los iconos usados.
  Si añades un icono nuevo en el código (`ti ti-nombre`), vuelve a ejecutarlo:
  ```
  npm pack @tabler/icons-webfont@3.48.0 && tar xzf tabler-icons-webfont-3.48.0.tgz
  python herramientas/iconos/subset.py package/dist
  ```
  (requiere `pip install fonttools brotli`)

## App instalable / sin conexión
- `pwa/generar_sw.py` + `pwa/sw.plantilla.js` → `sw.js`.
- `pwa/iconos_app.py` → iconos de la app en `imagenes/app/`.

## Misiones (mazo Approved Ops 2025)
- `misiones/extraer.py deck.pdf .` — cartas y mapas del PDF a `imagenes/misiones` e `imagenes/mapas`.
- `misiones/marcadores.py` — detecta los marcadores de objetivo y la zona de despliegue de cada mapa → `js/data/marcadores.js`.
  Las correcciones a mano van en `misiones/marcadores_manual.json`. En la app también se pueden añadir,
  mover o quitar marcadores (se recuerdan en ese navegador).

## Comandos (PDF oficiales)
Ver `pdf/LEEME.md`.

## Comandos añadidos por otros usuarios (paquetes `kt-comando/1`)
- En la app: **Añadir comando** (`comandos.html`). Copia la instrucción para la IA, se adjunta el PDF del comando
  y lo que devuelva la IA se sube o se pega allí. Se valida, se previsualiza y se guarda en ese navegador
  (`localStorage` → `kt.comandos`); `js/comandos.js` lo registra en `FACTIONS` en todas las páginas.
- Un paquete con el mismo `id` que un comando incluido lo sustituye en ese dispositivo (sirve para actualizar reglas);
  al borrarlo vuelve el original.
- **Archivo para la app** descarga `js/data/<id>.js`: cópialo a `js/data/`, añade su `<script>` en
  `index.html`, `builder.html`, `partida.html`, `historial.html` y `comandos.html`, y regenera `sw.js`.
- En partidas a dos dispositivos el comando se envía solo al otro jugador (queda como «recibido en partida»).

## Instrucción para la IA (convertir un PDF en paquete)
- El texto se edita solo en `recursos/convertir-comando.md`. Después: `python herramientas/ia/generar.py`
  regenera `js/data/instruccion_ia.js`, que es lo que lee la página «Añadir comando» (copiar / descargar `.md`).

## Escenografía pulsable de los mapas
- `js/data/terreno.js`: posición de cada etiqueta (A, B, C1…) en cada mapa y ficha de cada pieza por zona
  (nombre, tipo y recorte de la imagen de leyenda). Se puede editar a mano.
- `misiones/terreno_detectar.py` + `misiones/terreno_datos.py`: detección automática y correcciones, por si llegan mapas nuevos.

## Usuarios
- `js/usuarios.js`: perfiles locales (`kt.usuarios`, sesión en `kt.usuario`); las bandas guardadas llevan `owner`.
  No hay servidor: todo vive en el navegador de cada dispositivo.

## Liga, campaña y calendario
- `liga.html`: ligas y torneos (`kt.ligas`). «Jugar» abre `partida.html?liga=<id>&m=<enfrentamiento>` y el resultado se apunta solo.
- `campana.html` + `js/campana.js` (`kt.campanas`). Las reglas (rangos, tablas de honores y cicatrices, costes) son una
  adaptación de la casa y se editan en `js/data/campana.js`.
- `js/calendario.js`: invitaciones con fecha (.ics, Google Calendar, WhatsApp). Sin servidor.
- `recursos/actualizar-comando.md`: instrucción para aplicar erratas a un comando ya cargado (se regenera con `herramientas/ia/generar.py`).
