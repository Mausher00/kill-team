"""Convierte imagenes/**/*.jpg|png a WebP (al lado del original).
Uso: python herramientas/imagenes/webp.py [raíz del proyecto]
  - Fotos, mapas y cartas: WebP con pérdida (calidad 82).
  - PNG con transparencia (logos, retratos recortados): WebP con alfa (calidad 88).
Después de comprobar que todo se ve bien, borra los originales con:
  python herramientas/imagenes/limpiar.py
"""
import sys, os
from PIL import Image

root = sys.argv[1] if len(sys.argv) > 1 else '.'
base = os.path.join(root, 'imagenes')
antes = despues = n = 0
for d, _, files in os.walk(base):
    for f in files:
        if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue
        src = os.path.join(d, f)
        dst = os.path.splitext(src)[0] + '.webp'
        im = Image.open(src)
        alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
        im = im.convert('RGBA' if alpha else 'RGB')
        im.save(dst, 'WEBP', quality=88 if alpha else 82, method=6)
        antes += os.path.getsize(src); despues += os.path.getsize(dst); n += 1
print(f'{n} imágenes · {antes/1e6:.1f} MB -> {despues/1e6:.1f} MB')
