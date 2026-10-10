"""Genera los iconos de la app instalable (imagenes/app/icono-*.png). Uso: python herramientas/pwa/iconos_app.py [raíz]"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
root = sys.argv[1] if len(sys.argv) > 1 else '.'
out = os.path.join(root, 'imagenes', 'app'); os.makedirs(out, exist_ok=True)
font = os.path.join(root, 'recursos', 'd-din', 'd-dincondensed-bold.otf')
def icon(size, maskable=False):
    S = 1024
    im = Image.new('RGB', (S, S), (10, 10, 10)); d = ImageDraw.Draw(im)
    pad = 0 if maskable else 40
    if not maskable:
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.rounded_rectangle((pad, pad, S - pad, S - pad), radius=200, fill=(10, 10, 10))
    k = .8 if maskable else 1          # zona segura de los iconos adaptables
    f = ImageFont.truetype(font, int(560 * k))
    d.text((S / 2, S / 2 - 40 * k), 'KT', font=f, fill=(240, 240, 240), anchor='mm')
    bw, bh = 520 * k, 46 * k
    d.rectangle((S / 2 - bw / 2, S / 2 + 230 * k, S / 2 + bw / 2, S / 2 + 230 * k + bh), fill=(232, 73, 15))
    return im.resize((size, size), Image.LANCZOS)
for s in (192, 512):
    icon(s).save(os.path.join(out, f'icono-{s}.png'))
icon(512, True).save(os.path.join(out, 'icono-maskable-512.png'))
icon(180, True).convert('RGB').save(os.path.join(out, 'apple-touch-icon.png'))
print('ok')
