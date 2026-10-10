"""Detecta en cada mapa los marcadores de objetivo (círculo naranja con calavera)
y el lado de la zona de despliegue naranja (J1). Genera js/data/marcadores.js
Uso: python herramientas/misiones/marcadores.py [raíz]
"""
import sys, os, json, re
import numpy as np
from PIL import Image
from scipy import ndimage

root = sys.argv[1] if len(sys.argv) > 1 else '.'

def blobs(mask, W, smin, smax, fill=(.55, .9)):
    lab, n = ndimage.label(mask)
    out = []
    for k, sl in enumerate(ndimage.find_objects(lab), 1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if not (smin * W < w < smax * W and 0.75 < w / max(h, 1) < 1.33):
            continue
        f = (lab[sl] == k).mean()
        if not (fill[0] < f < fill[1]):
            continue
        out.append(((sl[1].start + sl[1].stop) / 2, (sl[0].start + sl[0].stop) / 2, w))
    return out

def rings(orange, W, H, R):
    """Anillos naranjas (aunque estén tapados en parte por terreno): convolución con una corona."""
    from scipy.signal import fftconvolve
    r = int(R); yy, xx = np.mgrid[-r - 3:r + 4, -r - 3:r + 4]
    d = np.hypot(xx, yy)
    ker = ((d > R * .78) & (d < R * 1.02)).astype(float)
    resp = fftconvolve(orange.astype(float), ker[::-1, ::-1], mode='same') / ker.sum()
    peaks = (resp == ndimage.maximum_filter(resp, size=int(R * 1.5))) & (resp > .30)
    ys, xs = np.nonzero(peaks)
    return [(x, y, 2 * R) for x, y in zip(xs, ys)]

def detect(path, estilo):
    im = np.asarray(Image.open(path).convert('RGB')).astype(int)
    H, W, _ = im.shape
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    orange = (r > 185) & (g > 45) & (g < 140) & (b < 95)
    found = []
    if estilo == 'anillo':
        dark = (r < 70) & (g < 70) & (b < 70)
        for x, y, w in blobs(orange, W, .035, .16, (.05, .95)):
            rr = int(w * .22)
            if dark[int(y - rr):int(y + rr), int(x - rr):int(x + rr)].mean() > .08:
                found.append((x, y, w))
    else:  # discos de color: naranja, azul, negro y blanco con calavera
        orange2 = (r > 165) & (g > 35) & (g < 140) & (b < 105) & (r - g > 70)
        blue = (b > 140) & (r < 110) & (b - r > 60)
        black = (r < 60) & (g < 60) & (b < 60)
        white = (r > 242) & (g > 242) & (b > 242)
        for m in (orange2, blue, black, white):
            m = ndimage.binary_opening(m, structure=np.ones((3, 3)))
            found += blobs(m, W, .018, .05, (.5, .92))
    out = []
    for x, y, s in sorted(found, key=lambda t: -t[2]):
        if all(abs(x - a) > .035 * W or abs(y - c) > .045 * H for a, c, _ in out):
            out.append((x, y, s))
    # lado de la zona de despliegue naranja (salmón) — banda de 6 % en cada borde
    def band(sl):
        p = im[sl]
        return (((p[..., 0] > 200) & (p[..., 1] > 120) & (p[..., 1] < 200) & (p[..., 2] < 170) & (p[..., 0] - p[..., 2] > 60)).mean())
    bw, bh = int(W * .06), int(H * .06)
    sides = {'l': band((slice(None), slice(0, bw))), 'r': band((slice(None), slice(W - bw, W))),
             't': band((slice(0, bh), slice(None))), 'b': band((slice(H - bh, H), slice(None)))}
    j1 = max(sides, key=sides.get)
    return {'o': [[round(x / W * 100, 1), round(y / H * 100, 1)] for x, y, _ in sorted(out)], 'j1': j1}

data = {}
for d, _, files in os.walk(os.path.join(root, 'imagenes')):
    for f in sorted(files):
        rel = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if not f.endswith('.webp') or 'clave' in f: continue
        if not re.match(r'imagenes/(mapas/[^/]+|volkus|necropolis|octarius|betha-decima|gallowdark)/', rel): continue
        estilo = 'disco' if re.search(r'mapas/generica|bheta-decima/II|^imagenes/betha|octarius', rel) else 'anillo'
        res = detect(os.path.join(d, f), estilo)
        data[rel] = res
# Correcciones a mano (mapas con marcadores tapados por terreno o de otro estilo)
MANUAL = json.load(open(os.path.join(os.path.dirname(__file__), 'marcadores_manual.json'), encoding='utf-8')) \
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'marcadores_manual.json')) else {}
for k, v in MANUAL.items():
    data.setdefault(k, {'o': [], 'j1': 'l'})['o'] = v
with open(os.path.join(root, 'js', 'data', 'marcadores.js'), 'w', encoding='utf-8') as fh:
    fh.write('// Generado por herramientas/misiones/marcadores.py — posiciones (%) de los marcadores de objetivo\n')
    fh.write('// y lado de la zona de despliegue naranja (J1): l, r, t, b. Se puede corregir a mano.\n')
    fh.write('window.MARCADORES = ' + json.dumps(data, ensure_ascii=False, indent=0).replace('\n', '') + ';\n')
for k, v in data.items():
    print(k.replace('imagenes/', ''), v['j1'], len(v['o']), v['o'])
