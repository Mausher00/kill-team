"""Genera un subconjunto de Tabler Icons con solo los iconos que usa la app.
  - recursos/iconos/tabler-icons.woff2   (fuente recortada, ~10 KB)
  - css/iconos.css                       (clases .ti-* usadas)
Uso:
  npm pack @tabler/icons-webfont@3.48.0 && tar xzf tabler-icons-webfont-3.48.0.tgz
  python herramientas/iconos/subset.py package/dist [raíz del proyecto]
Vuelve a ejecutarlo si añades iconos nuevos en el código (clase "ti ti-nombre" o 'nombre' entre comillas).
Requiere: pip install fonttools brotli
"""
import sys, os, re, glob
from fontTools import subset

dist = sys.argv[1]
root = sys.argv[2] if len(sys.argv) > 2 else '.'
css = open(os.path.join(dist, 'tabler-icons.css'), encoding='utf-8').read()
ver = re.search(r'Tabler Icons ([\d.]+)', css).group(1)
rules = dict(re.findall(r'\.ti-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-f]+)";', css))

src = ''
for f in glob.glob(os.path.join(root, '**', '*'), recursive=True):
    rel = os.path.relpath(f, root)
    if rel.startswith(('herramientas', 'recursos', 'imagenes')) or not f.endswith(('.html', '.js')):
        continue
    if os.sep + 'data' + os.sep in f and not f.endswith(('misiones.js', 'zonas.js', 'keywords.js')):
        continue
    src += open(f, encoding='utf-8', errors='ignore').read()
explicit = set(re.findall(r'ti-([a-z0-9]+(?:-[a-z0-9]+)*)', src))
quoted = set(re.findall(r"['\"`]([a-z0-9]+(?:-[a-z0-9]+)*)['\"`]", src))
used = sorted(n for n in rules if n in explicit or n in quoted)
missing = sorted(n for n in explicit if n not in rules and not n.startswith(('$', 'h')))
if missing:
    print('Aviso, iconos que no existen en Tabler', ver + ':', missing)

out_font = os.path.join(root, 'recursos', 'iconos'); os.makedirs(out_font, exist_ok=True)
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = []; opts.name_IDs = ['*']; opts.notdef_outline = True
font = subset.load_font(os.path.join(dist, 'fonts', 'tabler-icons.ttf'), opts)
sub = subset.Subsetter(opts); sub.populate(unicodes=[int(rules[n], 16) for n in used]); sub.subset(font)
subset.save_font(font, os.path.join(out_font, 'tabler-icons.woff2'), opts)

with open(os.path.join(root, 'css', 'iconos.css'), 'w', encoding='utf-8') as fh:
    fh.write(f'/* Tabler Icons {ver} (MIT) — subconjunto generado por herramientas/iconos/subset.py ({len(used)} iconos) */\n')
    fh.write('@font-face { font-family: "tabler-icons"; font-style: normal; font-weight: 400; font-display: block;\n'
             '  src: url("../recursos/iconos/tabler-icons.woff2") format("woff2"); }\n')
    fh.write('.ti { font-family: "tabler-icons" !important; speak: none; font-style: normal; font-weight: normal; font-variant: normal;\n'
             '  text-transform: none; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\n')
    for n in used:
        fh.write(f'.ti-{n}:before {{ content: "\\{rules[n]}"; }}\n')
print(len(used), 'iconos ·', os.path.getsize(os.path.join(out_font, 'tabler-icons.woff2')), 'bytes')
