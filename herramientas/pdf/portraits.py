"""Retratos de operativo sin texto, 700x210 como las imágenes existentes.
python3 portraits.py nombre  -> sobrescribe out/img/nombre/*.webp usando out/nombre.json
"""
import sys, json, os, re, unicodedata
import pymupdf as fitz
from PIL import Image

name = sys.argv[1]
data = json.load(open(f'out/{name}.json'))
doc = fitz.open(name + '.pdf')
imgdir = f'out/img/{name}'
os.makedirs(imgdir, exist_ok=True)

def slug(s):
    s = unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

pages_needed = sorted({c['page'] for c in data['cards']})
from collections import Counter
DOCCOUNT = Counter(i['xref'] for p in doc for i in p.get_image_info(xrefs=True))
# 1) localizar retrato por ficha ANTES de redactar (posiciones de texto)
targets = {}
for c in data['cards']:
    page = doc[c['page'] - 1]
    words = c['name'].split()
    hits = []
    for k in (len(words), 3, 2):                      # nombre completo; si está partido, sus primeras palabras
        hits = page.search_for(' '.join(words[:k]))
        if hits: break
    best = None
    infos = page.get_image_info(xrefs=True)
    masked = {im[0] for im in page.get_images(full=True) if im[1]}   # retratos: llevan máscara (smask)
    for info in infos:
        if info['xref'] not in masked: continue        # las barras genéricas no llevan máscara
        x0, y0, x1, y1 = info['bbox']
        w, h = x1 - x0, y1 - y0
        if not info.get('xref') or h < 15 or h > 110 or w < 25: continue
        for hh in hits:
            d = abs((hh.y0 + hh.y1) / 2 - (y0 + y1) / 2)
            # el retrato está a la derecha del nombre, en la misma franja
            if d < 40 and x1 > hh.x1 and (best is None or d < best[0]):
                best = (d, fitz.Rect(x0, y0, x1, y1))
    if best:
        r = best[1]
        bar = None
        for i2 in page.get_image_info():
            bx0, by0, bx1, by1 = i2['bbox']
            if i2['width'] > 700 and (bx1 - bx0) > 150 and by0 - 8 < r.y1 and by1 + 8 > r.y0 and abs((by0 + by1) / 2 - (r.y0 + r.y1) / 2) < 20:
                bar = fitz.Rect(bx0, by0, bx1, by1); break
        targets[c['name']] = (c['page'] - 1, r, bar)

# 2) quitar el texto (solo texto: imágenes y vectores intactos)
for pno in {t[0] for t in targets.values()}:
    page = doc[pno]
    for b in page.get_text('blocks'):
        r = fitz.Rect(b[:4]); r.y1 += 6; r.x1 += 4
        page.add_redact_annot(r)
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED, text=fitz.PDF_REDACT_TEXT_REMOVE)

ok = 0
for c in data['cards']:
    if c['name'] not in targets: print('sin retrato:', c['name']); continue
    pno, r, bar = targets[c['name']]
    page = doc[pno]
    top, bot = (max(r.y0, bar.y0 + 1), min(r.y1, bar.y1 - 1)) if bar else (r.y0, r.y1)
    h = bot - top
    right = min(r.x1, bar.x1) if bar else r.x1
    clip = fitz.Rect(right - h * 5, top, right, bot)          # margen extra a la izquierda
    zoom = 1000 / clip.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip)
    import numpy as np
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    g = np.asarray(im.convert('L')).astype(float)
    H, W = g.shape
    # franja superior uniforme (sin rayas): filas con varianza casi nula en la zona izquierda
    # la franja es oscura (~8); las rayas empiezan con un salto brusco de brillo
    zone = g[:, int(W * .1):int(W * .6)].mean(1)
    s0 = 0
    while s0 < H * .4 and zone[s0] > 40: s0 += 1          # margen claro / línea discontinua
    while s0 < H * .4 and zone[s0:s0 + 3].mean() > 40: s0 += 1
    base = zone[s0:s0 + 5].mean()
    t0 = s0
    if base < 12:
        for y in range(s0 + 3, int(H * .5)):
            if zone[y] > base + 6: t0 = y; break
    # borde claro a la derecha
    x1 = W
    while x1 > W * .8 and g[int(H * .3):, x1 - 1].mean() > 110: x1 -= 1
    # bordes con mucho blanco (márgenes de la ficha)
    rgb = np.asarray(im).astype(int)
    white = (rgb.min(axis=2) > 185)
    b1 = H
    while b1 > t0 + H * .5 and white[b1 - 1, :x1].mean() > .25: b1 -= 1
    while t0 < H * .4 and white[t0, :x1].mean() > .25: t0 += 1
    light = rgb.min(axis=2) > 120
    while x1 > W * .7 and (white[t0:b1, x1 - 1].mean() > .2 or light[t0:b1, x1 - 1].mean() > .6): x1 -= 1
    x1 = max(int(W * .7), x1 - 9)
    hh = b1 - t0
    ww = int(hh * 700 / 210)
    box = (max(0, x1 - ww), t0, x1, b1)
    fn = os.path.join(imgdir, slug(c['name']) + '.webp')
    im.crop(box).resize((700, 210), Image.LANCZOS).save(fn, 'WEBP', quality=82, method=6)
    c['img'] = os.path.basename(fn); ok += 1
json.dump(data, open(f'out/{name}.json', 'w'), ensure_ascii=False, indent=1)
print(name, ok, '/', len(data['cards']))
