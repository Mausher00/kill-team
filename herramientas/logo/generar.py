#!/usr/bin/env python3
"""Genera el logo de Kill Zone (SVG propio, sin material oficial) y los iconos PWA.
Uso:  python3 herramientas/logo/generar.py     (desde la raíz del proyecto)
Salidas: imagenes/app/logo-kz.webp, logo-kz-sm.webp, icono-192/512, icono-maskable-512, apple-touch-icon,
         imagenes/app/logo-kz.svg
"""
import math, os, sys, asyncio
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'imagenes' / 'app'
ORANGE, ORANGE2, WHITE = '#e8490f', '#ff6a2b', '#f2f2f2'
H, T = 100, 25   # altura de letra y grosor de trazo

# Letras angulosas (polígonos). Cada una devuelve (anchura, [paths]).
def K():
    return 78, [f'M0,0H{T}V{H}H0Z', f'M{T-1},{H/2+12}L48,0H78L{T+10},{H/2+4}V{H/2+12}Z', f'M{T-1},{H/2-2}L{T+16},{H/2-10}L78,{H}H48L{T-1},{H/2+16}Z']
def I():
    return T, [f'M0,0H{T}V{H}H0Z']
def L():
    return 58, [f'M0,0H{T}V{H}H0Z', f'M0,{H-T}H58V{H}H0Z']
def Z():
    return 62, [f'M0,0H62V{T}H0Z', f'M0,{H-T}H62V{H}H0Z', f'M38,{T-1}H64L24,{H-T+1}H-2Z']
def N():
    return 72, [f'M0,0H{T}V{H}H0Z', f'M{72-T},0H72V{H}H{72-T}Z', f'M0,0H{T+3}L72,{H}H{72-T-3}Z']
def E():
    return 58, [f'M0,0H{T}V{H}H0Z', f'M0,0H58V{T}H0Z', f'M0,{H/2-T/2+1}H50V{H/2+T/2-1}H0Z', f'M0,{H-T}H58V{H}H0Z']

def reticle(cx, cy, R=50, th=15, color=ORANGE, tick=7, ext=14, gap=17, dot=6):
    r = R - th / 2
    parts = []
    for k in range(4):                       # cuatro arcos con hueco en N/E/S/O
        a0 = math.radians(k * 90 + gap / 2 + 0 - 90 + 0)
        a1 = math.radians(k * 90 + 90 - gap / 2 - 90)
        x0, y0, x1, y1 = cx + r * math.cos(a0), cy + r * math.sin(a0), cx + r * math.cos(a1), cy + r * math.sin(a1)
        parts.append(f'<path d="M{x0:.2f},{y0:.2f}A{r},{r} 0 0 1 {x1:.2f},{y1:.2f}" fill="none" stroke="{color}" stroke-width="{th}"/>')
    for ang in (0, 90, 180, 270):
        c, s = math.cos(math.radians(ang)), math.sin(math.radians(ang))
        e = ext if ang in (90, 270) else ext * .45
        parts.append(f'<line x1="{cx + c * 20:.2f}" y1="{cy + s * 20:.2f}" x2="{cx + c * (R + e):.2f}" y2="{cy + s * (R + e):.2f}" stroke="{color}" stroke-width="{tick}"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{dot}" fill="{color}"/>')
    return ''.join(parts)

def wordmark(gap=15, word=34, color=WHITE):
    """Devuelve (svg_interior, anchura). 'KILL' + 'ZONE' con la O como retícula."""
    x, out = 0, []
    def put(f):
        nonlocal x
        w, paths = f()
        out.append(f'<g transform="translate({x},0)" fill="{color}">' + ''.join(f'<path d="{p}"/>' for p in paths) + '</g>')
        x += w + gap
    for f in (K, I, L, L): put(f)
    x += word - gap
    put(Z)
    x += 6                                   # la retícula necesita algo más de aire
    out.append(reticle(x + 50, H / 2)); x += 100 + gap + 6
    put(N); put(E)
    return ''.join(out), x - gap

def svg_wordmark(sub=None, pad=18):
    body, w = wordmark()
    W, Ht = w + pad * 2, H + pad * 2 + 8 + (46 if sub else 0)
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {Ht}" width="{W}" height="{Ht}"><g transform="translate({pad},{pad + 4})">{body}</g>'
    if sub:
        yb = pad + H + 26
        s += f'<rect x="{pad}" y="{yb - 14}" width="{w}" height="3" fill="{ORANGE}"/>'
        s += f'<text x="{pad}" y="{yb + 12}" font-family="D-DINCondensed" font-weight="700" font-size="20" textLength="{w}" lengthAdjust="spacing" fill="#b5aca6">{sub}</text>'
    return s + '</svg>', W, Ht

def svg_icon(size=512, maskable=False):
    bg = f'<rect width="{size}" height="{size}" fill="#0a0a0a"/>' if maskable else f'<rect x="8" y="8" width="{size-16}" height="{size-16}" rx="{size*.2}" fill="#0a0a0a"/>'
    s = size / 512
    R = 150 if maskable else 175
    sc = R / 50                              # retícula escalada
    ring = f'<g transform="translate({size/2},{size/2}) scale({sc})">{reticle(0, 0, R=50, th=14, ext=9, gap=15, dot=0)}</g>'
    # K y Z centradas dentro del anillo
    k_w, kp = K(); z_w, zp = Z()
    k = 1.0 * (R / 175)
    scl = 1.05 * (R / 175)
    tot = (k_w + 10 + z_w) * scl
    x0, y0 = size / 2 - tot / 2, size / 2 - H * scl / 2
    letters = f'<g transform="translate({x0},{y0}) scale({scl})" fill="{WHITE}">' + ''.join(f'<path d="{p}"/>' for p in kp) + \
              f'<g transform="translate({k_w + 10},0)">' + ''.join(f'<path d="{p}"/>' for p in zp) + '</g></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{bg}{ring}{letters}</svg>'

async def render(svg, w, h, path, scale=2, transparent=True):
    import base64
    f = (ROOT / 'recursos' / 'd-din' / 'd-dincondensed-bold.otf').read_bytes()
    css = "@font-face{font-family:'D-DINCondensed';font-weight:700;src:url(data:font/otf;base64," + base64.b64encode(f).decode() + ")}"
    html = f'<html><head><style>{css} html,body{{margin:0;background:transparent}}svg{{display:block}}</style></head><body>{svg}</body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': int(w), 'height': int(h)}, device_scale_factor=scale)
        await pg.set_content(html); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=str(path), omit_background=transparent, clip={'x': 0, 'y': 0, 'width': w, 'height': h})
        await b.close()

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = OUT / '_tmp.png'
    # Logo grande (portada): palabra + subtítulo
    svg, W, Ht = svg_wordmark('COMPAÑERO NO OFICIAL · KILL TEAM')
    (OUT / 'logo-kz.svg').write_text(svg, encoding='utf-8')
    await render(svg, W, Ht, tmp, scale=937 / W)
    Image.open(tmp).save(OUT / 'logo-kz.webp', quality=92, method=6)
    # Logo pequeño (cabeceras): solo palabra
    svg2, W2, H2 = svg_wordmark(None, pad=8)
    await render(svg2, W2, H2, tmp, scale=440 / W2)
    Image.open(tmp).save(OUT / 'logo-kz-sm.webp', quality=92, method=6)
    # Iconos
    for size, name, mk in ((512, 'icono-512.png', False), (192, 'icono-192.png', False), (512, 'icono-maskable-512.png', True), (180, 'apple-touch-icon.png', True)):
        await render(svg_icon(512, mk), 512, 512, tmp, scale=size / 512, transparent=not mk)
        im = Image.open(tmp)
        if name in ('icono-maskable-512.png', 'apple-touch-icon.png'): im = im.convert('RGB')
        im.save(OUT / name, optimize=True)
    tmp.unlink(missing_ok=True)
    for f in ('logo-kz.webp', 'logo-kz-sm.webp'):
        print(f, Image.open(OUT / f).size)

asyncio.run(main())
