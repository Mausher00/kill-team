# Herramientas: PDF oficiales → datos de la app

Estos scripts convierten los PDF de reglas de comando de Games Workshop (formato 2024, en español)
en los archivos `js/data/*.js` que usan la librería y el constructor.

| Script | Qué hace |
|---|---|
| `actualizar.py` | Orquesta todo: copia los PDF, extrae y regenera los `.js` y los retratos. |
| `extract.py` | Fichas de datos: stats, palabras clave, habilidades. |
| `weapons.py` | Tablas de armas (usa `pdftotext -layout`, respeta columnas). |
| `rules2.py` | Cartas de reglas de facción, ardides y equipo (clasifica por tipografía). |
| `portraits.py` | Recorta el retrato de cada ficha sin texto, 700×210 como las imágenes existentes. |
| `logo.py` | Saca el logo naranja de la esquina de la página (PNG transparente). |
| `build.py` | Ensambla y escribe `js/data/<comando>.js`. |
| `rosters.py` | **Editado a mano**: metadatos de cada comando, qué imagen tuya usar y la composición (roster) para el constructor. |
| `comprobar.js` | Control de calidad de los datos generados (`node comprobar.js`). |

## Actualizar cuando GW publique un PDF nuevo

1. Deja el PDF en `Nuevos PDF/`.
2. `cd herramientas/pdf && python actualizar.py "../../Nuevos PDF" mandrakes`
3. `node comprobar.js` y revisa la app.
4. Si cambió la composición del comando, edita su bloque en `rosters.py` y repite el paso 2.

## Comando nuevo

Añade su entrada en `META` y `ROSTERS` de `rosters.py`, una línea en `PDF_KEYS` de `actualizar.py`,
y su `<script>` en `index.html` y `builder.html`.
