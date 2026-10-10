"""Extractor de PDFs de reglas de comando de Kill Team (formato 2024, español).
Uso: python3 extract.py nombre   ->  out/nombre.json  (+ imágenes en out/img/nombre/)
"""
import sys, json, re, os
import pymupdf as fitz

STAT_HDR = re.compile(r'LPA\s*\n.*HERIDAS', re.S)
CATS = ['REGLA DE FACCIÓN', 'ARDID DE ESTRATEGIA', 'ARDID DE TIROTEO', 'EQUIPO DE FACCIÓN',
        'GUÍA DE FICHAS Y MARCADORES', 'OPERACIÓN TÁCTICA', 'REGLAS DE FACCIÓN', 'EQUIPO']

def clean(s):
    s = s.replace('­', '').replace('\xa0', ' ')
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def join_lines(s):
    lines = [l.strip() for l in s.split('\n')]
    out = ''
    for l in lines:
        if not l: continue
        if out.endswith('-') and not out.endswith(' -'):
            out = out[:-1] + l           # palabra partida con guion
        elif l.startswith('•') or l.startswith('○'):
            out += '\n' + l
        else:
            out += (' ' if out else '') + l
    return clean(out)

def blocks(page):
    """Bloques de texto con flag de cursiva (texto de ambientación)."""
    d = page.get_text('dict')
    res = []
    for b in d['blocks']:
        if b['type'] != 0: continue
        txt, plain, ital, total = '', '', 0, 0
        for line in b['lines']:
            for sp in line['spans']:
                t = sp['text']
                txt += t
                n = len(t.strip())
                total += n
                it = 'Italic' in sp['font'] or 'Oblique' in sp['font'] or (sp['flags'] & 2) or (sp['font'].endswith('-Cn') and sp['color'] in (0x4f5d56,)) or sp['color'] == 0x4f5d56
                if it: ital += n
                else: plain += t
            txt += '\n'; plain += '\n'
        x0, y0, x1, y1 = b['bbox']
        if txt.strip():
            res.append({'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 't': txt, 'p': plain, 'ital': total and ital / total > .6})
    return res

def title_case(s):
    small = {'de', 'la', 'los', 'las', 'del', 'el', 'con', 'y', 'en', 'a', 'al', 'o'}
    words = s.lower().split()
    out = []
    for i, w in enumerate(words):
        if i and w in small: out.append(w)
        else: out.append(w[:1].upper() + w[1:])
    return ' '.join(out)

# ── FICHAS DE DATOS ─────────────────────────────────────────────
def parse_datacards(doc, name, imgdir):
    cards = {}
    order = []
    for pno, page in enumerate(doc):
        bl = blocks(page)
        stat_hdrs = [b for b in bl if STAT_HDR.search(b['t']) and 'LPA' in b['t'].split('\n')[0]]
        if not stat_hdrs: continue
        heads = []
        for sh in stat_hdrs:
            # bloque de nombre: a la izquierda, misma franja vertical
            cand = [b for b in bl if b is not sh and b['x0'] < sh['x0'] and abs(b['y0'] - sh['y0']) < 12
                    and re.search(r'[A-ZÁÉÍÓÚÑ]{3}', b['t'])]
            if not cand: continue
            nb = min(cand, key=lambda b: abs(b['y0'] - sh['y0']))
            lines = [l.strip() for l in nb['t'].split('\n') if l.strip()]
            apl = None
            if lines and re.fullmatch(r'\d', lines[-1]): apl = int(lines.pop())
            nm = ' '.join(lines)
            vals = [b for b in bl if b['x0'] > nb['x1'] - 5 and sh['y1'] - 4 < b['y0'] < sh['y1'] + 12 and b is not sh]
            vtxt = ' '.join(b['t'] for b in sorted(vals, key=lambda b: b['x0']))
            if apl is None:
                m = re.match(r'\s*(\d)\s', vtxt); apl = int(m.group(1)) if m else None
                if m: vtxt = vtxt[m.end():]
            toks = re.findall(r'\d+"|\d\s*\+|\d+', vtxt.replace('\n', ' '))
            toks = [t.replace(' ', '') for t in toks]
            heads.append({'name': nm, 'apl': apl, 'stats': toks, 'y0': nb['y0'], 'x0': nb['x0'], 'blk': [nb, sh] + vals})
        heads.sort(key=lambda h: h['y0'])
        for i, h in enumerate(heads):
            ytop = h['y0']
            ybot = heads[i + 1]['y0'] - 2 if i + 1 < len(heads) else page.rect.height
            inside = [b for b in bl if ytop - 2 <= b['y0'] < ybot and b not in h['blk'] and b['x0'] > h['x0'] - 10]
            key = h['name']
            c = cards.get(key)
            if not c:
                c = cards[key] = {'name': key, 'apl': h['apl'], 'mov': None, 'save': None, 'w': None,
                                  'weapons': [], 'kw': [], 'abil': [], 'page': pno + 1, 'img': None}
                order.append(key)
                st = h['stats']
                # MOV., SALV., HERIDAS
                for t in st:
                    if t.endswith('"') and not c['mov']: c['mov'] = t
                    elif t.endswith('+') and not c['save']: c['save'] = t
                    elif re.fullmatch(r'\d+', t) and c['save'] and not c['w']: c['w'] = int(t)
            # imagen de cabecera
            if os.environ.get('NOIMG'):
                import unicodedata
                c['img'] = re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFD', key.lower()).encode('ascii', 'ignore').decode()).strip('-') + '.jpg'
            elif not c['img']:
                try:
                    for info in page.get_image_info(xrefs=True):
                        x0, y0, x1, y1 = info['bbox']
                        if abs(y0 - ytop) < 25 and (x1 - x0) > 60 and (y1 - y0) < 70 and (x1 - x0) / (y1 - y0) > 2.2 and info.get('xref'):
                            # recorte renderizado de la cabecera (con fondo), 700px de ancho
                            r = fitz.Rect(x0, y0, x1, y1)
                            zoom = 700 / r.width
                            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=r)
                            import unicodedata
                            sl = unicodedata.normalize('NFD', key.lower()).encode('ascii', 'ignore').decode()
                            fn = os.path.join(imgdir, re.sub(r'[^a-z0-9]+', '-', sl).strip('-') + '.jpg')
                            pix.save(fn.replace('.jpg', '.png'))
                            from PIL import Image
                            Image.open(fn.replace('.jpg', '.png')).convert('RGB').save(fn, quality=85)
                            os.remove(fn.replace('.jpg', '.png'))
                            c['img'] = os.path.basename(fn)
                            break
                except Exception as e:
                    print('img err', key, e)
            # contenido
            pend_rules = None
            abil_blocks = []
            for b in sorted(inside, key=lambda b: (b['y0'], b['x0'])):
                t = b['t']
                lines = [l.strip() for l in t.split('\n') if l.strip()]
                if not lines: continue
                if 'NOMBRE' in t and re.search(r'ATA?Q', t): continue
                if 'LAS REGLAS CONTINÚAN' in t or re.fullmatch(r'\d{1,3}', lines[0]) or t.strip().startswith('NOTAS'): continue
                # fila de arma: nombre, A, IMP, D, reglas
                if len(lines) >= 4 and re.fullmatch(r'\d+', lines[1]) and re.fullmatch(r'\d\+', lines[2]) and re.fullmatch(r'\d+/\d+', lines[3]):
                    rules = ' '.join(lines[4:])
                    c['weapons'].append({'n': lines[0], 'a': int(lines[1]), 'i': lines[2], 'd': lines[3], 'r': rules})
                    pend_rules = c['weapons'][-1]
                    continue
                if pend_rules is not None and b['x0'] > 250 and len(lines) <= 2 and ':' not in t and not re.search(r'\d+PA', t) and b['y0'] - pend_rules.get('_y', b['y0']) < 30 and abil_blocks == [] and len(t) < 80 and t.strip()[0].isupper() and ',' in t or (pend_rules is not None and b['x0'] > 250 and abil_blocks == [] and re.fullmatch(r'[A-ZÁÉÍÓÚ][\wáéíóúñ ()"*,+-]+', ' '.join(lines)) and len(' '.join(lines)) < 60):
                    pend_rules['r'] = (pend_rules['r'].rstrip(',') + ', ' if pend_rules['r'] and not pend_rules['r'].endswith(',') else pend_rules['r'] + ' ') + ' '.join(lines)
                    continue
                if re.fullmatch(r"[A-ZÁÉÍÓÚÑÜÂÊÎÔÛ0-9 ,'’\-]+", ' '.join(lines)) and ',' in t and len(lines) <= 3 and b['y0'] > ytop + 40:
                    kws = [k.strip() for k in ' '.join(lines).split(',') if k.strip()]
                    if len(kws) >= 2: c['kw'] = kws; continue
                toks = [l.strip() for l in t.split('\n') if l.strip()]
                if any(re.fullmatch(r'\d\+', x) for x in toks) and any(re.fullmatch(r'\d+/\d+|\*', x) for x in toks): continue
                if re.search(r'\s\d\s+\d\+\s+(\d+/\d+|\*|-)\s', ' '.join(toks) + ' '): continue
                abil_blocks.append(b)
            # agrupar habilidades por columna
            if abil_blocks:
                # columnas por agrupación de x0 (2 o 3 columnas según la ficha)
                xs = sorted(b['x0'] for b in abil_blocks)
                anchors = []
                for x in xs:
                    if not anchors or x - anchors[-1][-1] > 15: anchors.append([x])
                    else: anchors[-1].append(x)
                col = lambda b: next(i for i, a in enumerate(anchors) if a[0] - 1 <= b['x0'] <= a[-1] + 1)
                seq = sorted(abil_blocks, key=lambda b: (col(b), b['y0']))
                for b in seq:
                    t = b['t']
                    first = t.strip().split('\n')[0].strip()
                    mact = re.match(r"^([A-ZÁÉÍÓÚÑÜ¡!¿?'’ \-]{3,})\s*\n\s*(\d+\s*PA)\s*$", t.strip().split('\n\n')[0].strip()[:80] + '\n', re.S)
                    lines = [l.strip() for l in t.split('\n') if l.strip()]
                    if len(lines) >= 2 and re.fullmatch(r"[A-ZÁÉÍÓÚÑÜ¡!¿?'’ \-]{3,}", lines[0]) and re.fullmatch(r'\d+\s*PA', lines[1]):
                        c['abil'].append({'n': title_case(lines[0]) + ' (' + lines[1].replace(' ', '') + ')', 't': join_lines('\n'.join(lines[2:])), 'isAct': True})
                        continue
                    m1 = re.match(r"^([A-ZÁÉÍÓÚÑÜ¡!¿?'’ \-]{3,}?)\s+(\d+\s*PA)\s*\n", t.strip() + '\n')
                    if m1:
                        c['abil'].append({'n': title_case(m1.group(1)) + ' (' + m1.group(2).replace(' ', '') + ')', 't': join_lines(t.strip()[m1.end() - 1:]), 'isAct': True})
                        continue
                    m = re.match(r'^\*?([^:\n]{2,60}):\s', t.strip())
                    starts_new = m and (m.group(1)[0].isupper() or m.group(1)[0] in '¡¿*') and not m.group(1).startswith('•')
                    if starts_new or not c['abil']:
                        if m and starts_new:
                            c['abil'].append({'n': m.group(1).strip('* '), 't': join_lines(t.strip()[m.end():])})
                        else:
                            c['abil'].append({'n': '', 't': join_lines(t)})
                    else:
                        c['abil'][-1]['t'] = clean(c['abil'][-1]['t'] + ('\n' if t.strip().startswith('•') else ' ') + join_lines(t))
    return [cards[k] for k in order]

# ── CARTAS DE REGLAS ────────────────────────────────────────────
def parse_rulecards(doc, faction_upper):
    out = []
    for pno, page in enumerate(doc):
        bl = blocks(page)
        mid = page.rect.width / 2
        side = lambda x: 0 if (x['x0'] + x['x1']) / 2 < mid else 1
        hdrs = []
        for b in bl:
            lines = [l.strip() for l in b['t'].split('\n') if l.strip()]
            if lines and any(lines[-1].startswith(c) for c in CATS) and len(lines[-1]) < 40 and len(lines) <= 2:
                hdrs.append((b, lines[-1]))
        if not hdrs: continue
        for b, cat in hdrs:
            sd = side(b)
            below = [h for h, _ in hdrs if h is not b and side(h) == sd and h['y0'] > b['y0'] + 5]
            ybot = min([h['y0'] for h in below], default=page.rect.height)
            hdr_ids = {id(h) for h, _ in hdrs}
            body = [x for x in bl if id(x) not in hdr_ids and side(x) == sd and b['y1'] - 2 < x['y0'] < ybot - 2
                    and not re.fullmatch(r'\s*' + re.escape(b['t'].split('\n')[0].strip()) + r'\s*', x['t'])]
            body.sort(key=lambda x: (x['y0'], x['x0']))
            out.append({'page': pno + 1, 'cat': cat, 'side': sd, 'y': round(b['y0']),
                        'blocks': [{'t': x['t'], 'p': x['p'], 'x': round(x['x0']), 'y': round(x['y0'])} for x in body]})
    return out

def all_text_pages(doc):
    """Texto de páginas sin fichas: composición, erratas, ambientación."""
    res = []
    for pno, page in enumerate(doc):
        bl = blocks(page)
        res.append({'page': pno + 1, 'blocks': [{'t': b['t'], 'ital': b['ital'], 'x': round(b['x0']), 'y': round(b['y0'])} for b in sorted(bl, key=lambda b: (round(b['x0'] / 150), b['y0']))]})
    return res

if __name__ == '__main__':
    name = sys.argv[1]
    doc = fitz.open(name + '.pdf')
    imgdir = os.path.join('out', 'img', name); os.makedirs(imgdir, exist_ok=True)
    data = {'cards': parse_datacards(doc, name, imgdir), 'rules': parse_rulecards(doc, None), 'pages': all_text_pages(doc)}
    json.dump(data, open(os.path.join('out', name + '.json'), 'w'), ensure_ascii=False, indent=1)
    for c in data['cards']:
        print(f"{c['name']:<40} {c['apl']} {c['mov']} {c['save']} {c['w']}  armas:{len(c['weapons'])} kw:{len(c['kw'])} hab:{len(c['abil'])} img:{c['img']}")
    print('cartas de reglas:', [(r['cat'], len(r['blocks'])) for r in data['rules']])
