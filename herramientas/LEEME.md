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
