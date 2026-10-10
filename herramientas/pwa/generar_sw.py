"""Genera sw.js (service worker) con la lista de archivos de la app.
Ejecútalo cada vez que cambies archivos antes de subir a GitHub:
    python herramientas/pwa/generar_sw.py [raíz]
La versión se calcula a partir del contenido: si algo cambia, los usuarios
reciben la versión nueva la próxima vez que abran la app con conexión.
"""
import sys, os, hashlib, json
root = sys.argv[1] if len(sys.argv) > 1 else '.'

def files(base, exts):
    out = []
    for d, dirs, fs in os.walk(os.path.join(root, base)):
        dirs[:] = [x for x in dirs if not x.startswith('.')]
        for f in fs:
            if f.lower().endswith(exts):
                out.append(os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/'))
    return sorted(out)

core = ['index.html', 'builder.html', 'partida.html', 'misiones/misiones.html', 'manifest.webmanifest']
core += files('css', ('.css',)) + files('js', ('.js',)) + files('recursos', ('.otf', '.woff2', '.woff', '.ttf'))
core += files('imagenes/app', ('.png',))
core = [f for f in core if os.path.exists(os.path.join(root, f))]
imgs = [f for f in files('imagenes', ('.webp',))]

h = hashlib.sha1()
for f in core + imgs:
    h.update(f.encode()); h.update(open(os.path.join(root, f), 'rb').read())
version = h.hexdigest()[:10]

tpl = open(os.path.join(os.path.dirname(__file__), 'sw.plantilla.js'), encoding='utf-8').read()
sw = tpl.replace('__VERSION__', version).replace('__CORE__', json.dumps(core, indent=0)).replace('__IMAGES__', json.dumps(imgs, indent=0))
open(os.path.join(root, 'sw.js'), 'w', encoding='utf-8').write(sw)
print(f'sw.js · versión {version} · {len(core)} archivos base · {len(imgs)} imágenes')
