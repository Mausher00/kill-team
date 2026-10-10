"""Cartas de reglas a nivel de línea, clasificando por tipografía.
parse(name) -> lista de cartas {cat, page, side, y, title, sections:[{h, text}], weapons:[...]}
"""
import re, pymupdf as fitz

CATS = ['REGLA DE FACCIÓN', 'ARDID DE ESTRATEGIA', 'ARDID DE TIROTEO', 'EQUIPO DE FACCIÓN', 'GUÍA DE FICHAS Y MARCADORES', 'EQUIPO UNIVERSAL']
WR = r'(Alcance|Área|Ráfaga|Letal|Penetración|Pesada|Silenciosa|Devastadora|Brutal|Saturación|Equilibrada|Implacable|Incesante|Castigadora|Desgarradora|Severa|Choque|Certera|Limitada|Buscadora|Sobrecalentamiento|Críticos|Aturdidor|Veneno|Lacerante|Rompeescudos|Penetración crítica|Cegadora|-)'

def cls(sp):
    f, sz, col = sp['font'], sp['size'], sp['color']
    if col == 0x4f5d56 or f.endswith('-Cn') and col != 0x231f20: return 'flavor'
    if 'Demi' in f and col == 0xffffff: return 'note'
    if ('DINCondensed-Bold' in f or 'Engschrift' in f) and sz >= 17 and col == 0xffffff: return 'cat'
    if 'Engschrift' in f and 12.5 <= sz < 17 and col != 0xffffff and col != 0: return 'title'
    if 'Engschrift' in f and col == 0: return 'note'
    if 'DIN2014-Bold' in f and sz >= 11: return 'faction'
    if ('DINCondensed-Bold' in f and 13 <= sz < 19) or ('OratorStd' in f and sz >= 11): return 'title'
    if ('TradeGothicNextLTPro-Bd' in f and sz >= 10.5) or ('DINCondensed-Bold' in f and 9.5 <= sz < 13 and col == 0xffffff): return 'sub'
    if 'Italic' in f or f.endswith('-It') or f.endswith('-BdI'): return 'it'
    return 'body'

def lines_of(page):
    out = []
    for b in page.get_text('dict')['blocks']:
        if b['type']: continue
        for l in b['lines']:
            spans = [s for s in l['spans'] if s['text'].strip()]
            if not spans: continue
            kinds = {}
            for s in spans: kinds[cls(s)] = kinds.get(cls(s), 0) + len(s['text'].strip())
            kind = max(kinds, key=kinds.get)
            if kind == 'body' and kinds.get('it', 0) and kinds.get('it', 0) >= kinds['body'] * .5: kind = 'body'
            text = ''.join(s['text'] for s in l['spans'] if cls(s) not in ('flavor',))
            x0, y0, x1, y1 = l['bbox']
            out.append({'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 'k': kind, 't': text})
    return out

def join(lines):
    out = ''
    for l in lines:
        l = l.strip()
        if not l: continue
        if out.endswith('-') and not out.endswith(' -') and l[:1].islower(): out = out[:-1] + l
        elif l[:1] in '•○' or re.match(r'^\d\.\s', l): out += '\n' + l
        else: out += (' ' if out else '') + l
    out = re.sub(r'[ \t]+', ' ', out.replace('­', '').replace('\xa0', ' '))
    out = re.sub(r'•\s*', '• ', out); out = re.sub(r'○\s*', '○ ', out)
    return out.strip()

def build(cat, pno, sd, y, body):
    card = {'cat': cat, 'page': pno + 1, 'side': sd, 'y': round(y), 'title': '', 'sections': [], 'weapons': []}
    cur = {'h': None, 'lines': []}
    in_table = False; wrow = []
    for l in body:
        t = l['t'].strip()
        if l['k'] in ('flavor', 'note', 'faction', 'cat') or t in ('NOTAS:',) or 'CONTINÚA EN EL REVERSO' in t: continue
        if 'ATAQ.' in t and 'DAÑO' in t: in_table = True; continue
        if re.fullmatch(r'\d{1,3}', t) and not in_table: continue
        if t == 'NOMBRE': in_table = True; continue
        if in_table:
            wrow.append(t)
            continue
        if l['k'] == 'title' and not card['title']:
            card['title'] = t; continue
        if l['k'] == 'title' and card['title'] and t == card['title']: continue
        if l['k'] == 'title' and card['title'] and not card['sections'] and not cur['lines'] and cur['h'] is None and not re.search(r'\d\s*PA$', t):
            card['title'] += ' ' + t; continue
        if l['k'] in ('sub', 'title'):
            if cur['lines'] or cur['h']: card['sections'].append(cur)
            # subtítulos partidos en dos líneas
            if cur['h'] is not None and not cur['lines'] and card['sections'] and card['sections'][-1] is cur: pass
            cur = {'h': t, 'lines': []}
            continue
        cur['lines'].append(t)
    if cur['lines'] or cur['h']: card['sections'].append(cur)
    # fusionar subtítulos consecutivos sin texto (títulos en dos líneas)
    merged = []
    for s in card['sections']:
        if merged and merged[-1]['h'] and not merged[-1]['lines'] and s['h']:
            merged[-1]['h'] += ' ' + s['h']; merged[-1]['lines'] = s['lines']
        else: merged.append(s)
    card['sections'] = [{'h': s['h'], 'text': join(s['lines'])} for s in merged]
    # tabla de armas
    toks = [t for t in wrow if t]
    i = 0; ws = []
    while i < len(toks):
        if i + 3 < len(toks) and re.fullmatch(r'\d+', toks[i + 1]) and re.fullmatch(r'\d\+', toks[i + 2]) and re.fullmatch(r'\d+/\d+', toks[i + 3]):
            w = {'n': toks[i], 'a': int(toks[i + 1]), 'i': toks[i + 2], 'd': toks[i + 3], 'r': ''}
            i += 4
            while i < len(toks) and not (i + 3 < len(toks) and re.fullmatch(r'\d+', toks[i + 1]) and re.fullmatch(r'\d\+', toks[i + 2])) and (re.match(WR, toks[i]) or toks[i].endswith(',') or w['r'].endswith(',')):
                w['r'] = (w['r'] + ' ' + toks[i]).strip(); i += 1
            ws.append(w)
        else:
            # texto tras la tabla
            card['sections'].append({'h': None, 'text': toks[i]}); i += 1
    card['weapons'] = ws

    if not card['title'] and card['sections'] and card['sections'][0]['text']:
        m = re.match(r"^([A-ZÁÉÍÓÚÑÜ¡!¿?'’ ,\-]{4,}?)\s+(?=[A-ZÁÉÍÓÚ¡¿]?[a-záéíóúñ])", card['sections'][0]['text'])
        if m:
            words = m.group(1).split()
            # la última palabra en mayúscula pertenece a la frase siguiente si va seguida de minúsculas
            card['title'] = ' '.join(words[:-1]) if len(words) > 1 and m.group(1).split()[-1][1:].islower() else m.group(1).strip()
            card['sections'][0]['text'] = card['sections'][0]['text'][len(card['title']):].strip()
    return card

def parse(name):
    doc = fitz.open(name + '.pdf')
    cards = []
    for pno, page in enumerate(doc):
        L = lines_of(page)
        mid = page.rect.width / 2
        side = lambda l: 0 if (l['x0'] + l['x1']) / 2 < mid else 1
        heads = [l for l in L if l['k'] == 'cat' and any(l['t'].strip().startswith(c) for c in CATS)]
        prev_flag = [c for c in cards if c['page'] == pno and c.get('cont')]
        for pc in prev_flag:
            sd = 1 - pc['side']                       # reverso espejado
            first = min([x['y0'] for x in heads if side(x) == sd], default=page.rect.height + 40)
            region = sorted([l for l in L if side(l) == sd and l['y0'] < first - 30], key=lambda l: (round(l['y0']), l['x0']))
            if not region or any('↘' in l['t'] or 'ATAQ.' in l['t'] and 'NOMBRE' in l['t'] for l in region): continue
            if any(l['k'] == 'cat' for l in region): continue
            extra = build(pc['cat'], pno, sd, 0, region)
            if extra['title'] and extra['title'] != pc['title']:
                extra['sections'].insert(0, {'h': extra['title'], 'text': ''})
            pc['sections'] += [x for x in extra['sections'] if x['text'] or x['h']]
            pc['weapons'] += extra['weapons']
            pc['cont'] = extra.get('cont', False) or any('CONTINÚA EN EL REVERSO' in l['t'] for l in region)
        if not heads: continue
        for h in heads:
            sd = side(h)
            nxt = [x['y0'] for x in heads if side(x) == sd and x['y0'] > h['y0'] + 5]
            ybot = min(nxt) - 30 if nxt else page.rect.height
            body = sorted([l for l in L if side(l) == sd and h['y1'] - 1 < l['y0'] < ybot], key=lambda l: (round(l['y0']), l['x0']))
            card = build(h['t'].strip(), pno, sd, h['y0'], body)
            card['cont'] = any('CONTINÚA EN EL REVERSO' in l['t'] for l in body)
            cards.append(card)
    return cards

if __name__ == '__main__':
    import sys, json
    for c in parse(sys.argv[1]):
        print(f"## {c['cat']} | {c['title']}  (p{c['page']} s{c['side']})")
        for s in c['sections']: print(f"   [{s['h']}] {s['text'][:160]}")
        for w in c['weapons']: print('   W', w)
