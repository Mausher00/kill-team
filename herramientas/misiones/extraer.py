"""Extrae cartas y mapas del mazo Approved Ops 2025 (recopilación de aficionado).
Uso: python extraer.py deck.pdf <raíz del proyecto>
 - Cartas (vectoriales): se renderizan a JPG  -> imagenes/misiones/
 - Mapas (raster): se extraen a su resolución nativa y se giran a horizontal
   (la zona de despliegue inferior queda a la izquierda, la superior a la derecha)
   -> imagenes/mapas/<zona>/<id>.jpg ; claves de terreno -> imagenes/mapas/<zona>/clave-N.jpg
"""
import sys, os, io
import pymupdf as fitz
from PIL import Image

deck, root = sys.argv[1], sys.argv[2]
d = fitz.open(deck)
ZOOM = 3

CARTAS = {  # página (1-based) -> nombre
    2: 'secuencia', 4: 'primaria-crit', 5: 'primaria-kill', 6: 'primaria-tac', 8: 'kill-op',
    10: 'ini-repetir', 11: 'ini-1', 12: 'ini-2', 13: 'ini-3',
    **{14 + n: f'crit-{n}' for n in range(1, 10)},
    25: 'tac-envoy', 26: 'tac-martyrs', 27: 'tac-plant-banner', 28: 'tac-flank', 29: 'tac-retrieval',
    30: 'tac-scout', 31: 'tac-sweep-clear', 32: 'tac-dominate', 33: 'tac-rout', 34: 'tac-plant-devices',
    35: 'tac-steal-intelligence', 36: 'tac-track-enemy',
}
MAPAS = {  # zona -> [(página, id)]
    'generica': [(38 + n, str(n)) for n in range(1, 7)],
    'volkus': [(47 + n, f'I-{n}') for n in range(1, 7)] + [(53 + n, f'II-{n}') for n in range(1, 7)] + [(62, 'asedio-1'), (63, 'asedio-2')],
    'bheta-decima': [(65 + n, f'I-{n}') for n in range(1, 7)] + [(71 + n, f'II-{n}') for n in range(1, 7)],
    'gallowdark': [(80 + n, str(n)) for n in range(1, 7)],
    'necropolis': [(89 + n, str(n)) for n in range(1, 7)],
    'octarius': [(97 + n, str(n)) for n in range(1, 7)],
}
CLAVES = {'generica': [38], 'volkus': [46, 47, 61], 'bheta-decima': [65], 'gallowdark': [79, 80],
          'necropolis': [88, 89], 'octarius': [97]}

def render(pn, path, zoom=ZOOM):
    pix = d[pn - 1].get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB').save(path, quality=84, optimize=True, progressive=True)

out = os.path.join(root, 'imagenes', 'misiones'); os.makedirs(out, exist_ok=True)
for pn, name in CARTAS.items():
    render(pn, os.path.join(out, name + '.jpg'))

for zona, pages in MAPAS.items():
    od = os.path.join(root, 'imagenes', 'mapas', zona); os.makedirs(od, exist_ok=True)
    for pn, mid in pages:
        page = d[pn - 1]
        info = max(page.get_image_info(xrefs=True), key=lambda i: (i['bbox'][2] - i['bbox'][0]) * (i['bbox'][3] - i['bbox'][1]))
        im = Image.open(io.BytesIO(fitz.Pixmap(d, info['xref']).tobytes('png'))).convert('RGB')
        im.transpose(Image.Transpose.ROTATE_270).save(os.path.join(od, mid + '.jpg'), quality=86, optimize=True, progressive=True)
    for k, pn in enumerate(CLAVES[zona], 1):
        render(pn, os.path.join(od, f'clave-{k}.jpg'))
print('ok')
