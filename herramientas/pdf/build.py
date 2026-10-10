"""Genera js/data/<faccion>.js a partir de los PDF extraídos + composición definida a mano (rosters.py)."""
import json, re, sys, os, unicodedata
import pymupdf as fitz
sys.path.insert(0, '.')
import rules2, weapons
from rosters import META, ROSTERS

KT = os.environ.get('KT_PROJECT') or os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))

def slug(s):
    s = unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

SMALL = {'de', 'la', 'los', 'las', 'del', 'el', 'con', 'y', 'en', 'a', 'al', 'o', 'kon'}
def tcase(s):
    out = []
    for i, w in enumerate(s.lower().split()):
        if i and w in SMALL: out.append(w)
        elif re.fullmatch(r'[a-z]{1,3}\d+', w): out.append(w.upper())          # MB3, MV1, L7
        elif w.startswith('r-vr'): out.append('R-VR')
        else: out.append(w[:1].upper() + w[1:])
    return ' '.join(out)

PROPER = {'emperador': 'Emperador', 'nostramo': 'Nostramo', 'krieg': 'Krieg', "mont'ka": "Mont'ka", 'kauyon': 'Kauyon', 'phobos': 'Phobos',
          'astartes': 'Astartes', 'yaelindra': 'Yaelindra', 'waaagh!': 'WAAAGH!', '¡waaagh!': '¡WAAAGH!', 'nuncio': 'Nuncio', 'aquila': 'Aquila'}
def scase(s):
    """Mayúscula inicial (estilo de los archivos originales), con nombres propios y acciones (1PA)."""
    s = s.strip()
    m = re.search(r'\s*(\d+)\s*PA$', s, re.I)
    tail = ''
    if m: tail, s = f' ({m.group(1)}PA)', s[:m.start()]
    if not s.isupper(): return s + tail
    low = s.lower()
    low = re.sub(r'^([¡¿"“(]*)(\w)', lambda x: x.group(1) + x.group(2).upper(), low)
    low = re.sub(r'^(\d+\.\s*)(\w)', lambda x: x.group(1) + x.group(2).upper(), low)
    words = [PROPER.get(w, w) for w in low.split(' ')]
    return ' '.join(words) + tail

def fix(t):
    t = t.replace('­', '').replace('\xa0', ' ').replace('\x08', '')
    t = re.sub(r'\s+([,.;:])', r'\1', t)
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r' ?\n ?', '\n', t)
    return t.strip()

def split_rules(r):
    if not r: return []
    parts, depth, cur = [], 0, ''
    for ch in r:
        if ch == '(': depth += 1
        if ch == ')': depth -= 1
        if ch == ',' and depth == 0: parts.append(cur.strip()); cur = ''
        else: cur += ch
    if cur.strip(): parts.append(cur.strip())
    return [p for p in parts if p and p != '-']

def sections_text(secs):
    out = []
    for s in secs:
        if s['h'] and s['text']: out.append(f"▸ {s['h']}: {s['text']}")
        elif s['h']: out.append(f"▸ {s['h']}")
        elif s['text']: out.append(s['text'])
    return fix('\n'.join(out))

def wline(w):
    r = split_rules(w['r'])
    return f"▸ {w['n']} — ATQ {w['a']} · IMP {w['i']} · DAÑO {w['d']}" + (' · ' + ', '.join(r) if r else '')

# ── Erratas ────────────────────────────────────────────────────
MONTHS = 'ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE'
def erratas(name):
    doc = fitz.open(name + '.pdf')
    res, cur_v, cur_e = [], None, None
    date = None
    for page in doc:
        txt = page.get_text()
        if not re.search(r'REGISTRO DE ACTUALIZACIONES|ERRATAS ANTERIORES|COMENTARIOS? DE REGLAS', txt): continue
        mid = page.rect.width / 2
        L = []
        for b in page.get_text('dict')['blocks']:
            if b['type']: continue
            for l in b['lines']:
                sp = [s for s in l['spans'] if s['text'].strip()]
                if not sp: continue
                f = max(sp, key=lambda s: len(s['text']))
                L.append({'x': l['bbox'][0], 'x1': l['bbox'][2], 'y': l['bbox'][1], 'font': f['font'], 'size': f['size'], 't': ''.join(s['text'] for s in l['spans'])})
        L.sort(key=lambda l: (0 if (l['x'] + l['x1']) / 2 < mid or l['size'] > 25 else 1, round(l['y']), l['x']))
        for l in L:
            t = l['t'].strip()
            eng = 'Engschrift' in l['font']
            if eng and l['size'] > 25: continue                      # título del documento
            md = re.fullmatch(rf'({MONTHS})\s+(\d{{2}}|\d{{4}})', t.upper())
            if md:
                yr = md.group(2) if len(md.group(2)) == 4 else '20' + md.group(2)
                t = md.group(1).title() + ' ' + yr
                date = date or t
                if cur_v and not cur_v['v'].endswith(t.title()): cur_v['v'] += ' · ' + t.title()
                continue
            if eng and l['size'] >= 15:
                cur_v = {'v': tcase(t).replace('Fe de Erratas', 'Fe de erratas'), 'ee': []}; res.append(cur_v); cur_e = None; continue
            if 'Demi' in l['font'] and l['size'] > 9: continue          # introducción
            if eng and l['size'] >= 10:
                if cur_v is None: cur_v = {'v': 'Cambios', 'ee': []}; res.append(cur_v)
                if cur_e and not cur_e['t']: cur_e['s'] += ' ' + t; continue
                cur_e = {'s': t, 't': ''}; cur_v['ee'].append(cur_e); continue
            if cur_e is None: continue
            if cur_e['t'].endswith('-') and t[:1].islower(): cur_e['t'] = cur_e['t'][:-1] + t
            else: cur_e['t'] = (cur_e['t'] + ' ' + t).strip()
    for v in res:
        for e in v['ee']:
            e['s'] = scase(e['s']).replace(' ,', ','); e['t'] = fix(e['t'])
        v['ee'] = [e for e in v['ee'] if e['t']]
    merged = []
    for v in res:
        v['v'] = v['v'].replace('\x08', '').strip(' ·')
        if not v['v'] and merged: merged[-1]['ee'] += v['ee']; continue
        merged.append(v)
    res = merged
    for v in res:
        v['v'] = v['v'] or 'Cambios'
        v['v'] = re.sub(r'^.*Registro de Actualizaciones', 'Cambios', v['v'], flags=re.I)
        v['v'] = re.sub(r'^Comentarios? de Reglas', 'Comentarios de reglas', v['v'], flags=re.I)
        if re.fullmatch(rf'({MONTHS.title()})\s+\d{{4}}', v['v']): v['v'] = 'Cambios · ' + v['v']
        low = v['v'].lower()
        if low.startswith(('erratas ·', 'fe de erratas ·')): v['v'] = 'Fe de erratas · ' + v['v'].split('·', 1)[1].strip()
        elif low in ('erratas', 'fe de erratas') and date: v['v'] = 'Fe de erratas · ' + date
        elif low == 'erratas anteriores': v['v'] = 'Erratas anteriores'
    return [v for v in res if v['ee']], date

# ── Ensamblado ────────────────────────────────────────────────
def build(key):
    meta = META[key]
    data = json.load(open(f'out/{key}.json'))
    cards = data['cards']
    wmap = weapons.parse(key, cards)
    rc = rules2.parse(key)
    errs, date = erratas(key)
    strip = meta.get('strip', [])

    def optype(n):
        if n in meta.get('types', {}): return meta['types'][n]
        t = n
        for s in strip: t = t.replace(s, '')
        return t.strip()

    ops = []
    for c in cards:
        t = optype(c['name'])
        img_user = meta.get('user_imgs', {}).get(t)
        img = img_user or f"imagenes/{meta['imgdir']}/{c['img']}"
        ws = wmap.get(c['name']) or c['weapons']
        abil, pend_act = [], None
        for a in c['abil']:
            n, txt = a['n'].strip(), fix(a['t'])
            if re.search(r'\s\d\s+\d\+\s+(\d+/\d+|\*)\s*-?$', txt) and len(txt) < 80: continue      # resto de fila de arma
            if not n:
                ma = re.match(r"([A-ZÁÉÍÓÚÑÜ¡!¿?'’ \-]{3,}?)\s+(\d+PA)\b\s*(.*)$", txt, re.S)
                if ma and not ma.group(3): pend_act = tcase(ma.group(1)) + ' (' + ma.group(2) + ')'; continue
                if ma: n, txt, a = tcase(ma.group(1)) + ' (' + ma.group(2) + ')', ma.group(3), dict(a, isAct=True)
                mn = re.match(r'^\*?([^:\n]{2,40}):\s*', txt)
                if n: pass
                elif pend_act: n, a = pend_act, dict(a, isAct=True); pend_act = None
                elif mn: n, txt = mn.group(1).strip(), txt[mn.end():]
                elif txt.startswith('*'): n, txt = 'Nota', txt[1:].strip()
                elif abil: abil[-1]['t'] += ' ' + txt; continue
                else: n = 'Regla'
            txt = re.sub(r'\s*\b(LPA|HERIDAS|SALV\.|MOV\.)(\s+(LPA|HERIDAS|SALV\.|MOV\.)){2,}\s*', ' ', txt).strip()
            txt = re.sub(r'(\s+[A-ZÁÉÍÓÚ][\wáéíóúñ]+){0,3}(\s+[A-D]){3,}\b.*$', '', txt).strip()   # rótulos de diagramas
            # sub-reglas "Nombre:\n•" pegadas al final de otra
            parts = re.split(r'(?<=[.)])\s+([A-ZÁÉÍÓÚ][^.:\n]{2,40}):\s*(?=\n?•)', txt)
            e = {'n': n, 't': parts[0].strip()}
            if a.get('isAct'): e['isAct'] = True
            if e['t']: abil.append(e)
            for k in range(1, len(parts) - 1, 2):
                abil.append({'n': parts[k].strip(), 't': parts[k + 1].strip()})
        ops.append({
            'id': slug(t), 'name': tcase(c['name']), 'type': t,
            'img': img, '_extracted': None if img_user else c['img'],
            's': {'lpa': c['apl'], 'mov': c['mov'], 'salv': c['save'], 'h': c['w']},
            'kw': [k.replace(' ,', ',').strip() for k in c['kw']],
            'w': [{'n': w['n'], 'a': w['a'], 'i': w['i'], 'd': w['d'], 'r': split_rules(w['r'])} for w in ws],
            'ru': abil,
        })

    # reglas de facción (fusionar por título)
    frs, idx = [], {}
    for c in rc:
        if c['cat'] != 'REGLA DE FACCIÓN': continue
        title = scase(c['title']) if c['title'] else (frs[-1]['name'] if frs else 'Regla de facción')
        if title not in idx:
            idx[title] = {'name': title, 'text': '', 'subs': []}; frs.append(idx[title])
        f = idx[title]
        for s in c['sections']:
            if s['h']: f['subs'].append({'n': scase(s['h']), 't': fix(s['text'])})
            elif f['subs']: f['subs'][-1]['t'] = fix(f['subs'][-1]['t'] + ' ' + s['text'])
            else: f['text'] = fix(f['text'] + ' ' + s['text'])
        if c['weapons']: f['text'] += '\n' + '\n'.join(wline(w) for w in c['weapons'])

    def simple(cat):
        out = []
        for c in rc:
            if c['cat'] != cat or not c['title']: continue
            t = sections_text(c['sections'])
            if c['weapons']: t = (t + '\n' + '\n'.join(wline(w) for w in c['weapons'])).strip()
            out.append({'n': scase(re.sub(r'^\d+\s+', '', c['title'])), 't': t})
        return out

    pl = {'s': simple('ARDID DE ESTRATEGIA'), 'f': simple('ARDID DE TIROTEO')}
    eq = simple('EQUIPO DE FACCIÓN')
    roster = ROSTERS[key](ops) if callable(ROSTERS[key]) else ROSTERS[key]

    f = {
        'id': meta['id'], 'name': meta['name'], 'subfaction': meta['sub'],
        'icon': meta['icon'], 'img': meta['img'], 'desc': meta['desc'], 'tags': meta['tags'],
        'version': date or meta.get('version', ''), 'source': meta['source'],
        'ops': [{k: v for k, v in o.items() if not k.startswith('_')} for o in ops],
        'fr': {'name': frs[0]['name'], 'type': 'REGLA DE FACCIÓN', 'text': frs[0]['text'],
               'orders': frs[0]['subs'] + [x for g in frs[1:] for x in ([{'n': g['name'], 't': g['text']}] + [{'n': g['name'] + ' · ' + s['n'], 't': s['t']} for s in g['subs']])]} if frs else None,
        'frs': frs,
        'pl': pl, 'eq': eq, 'er': errs, 'roster': roster,
    }
    return f, ops

def compact(o, ind=1, width=150):
    """JSON legible: objetos/listas cortos en una línea, claves sin comillas."""
    def key(k): return k if re.fullmatch(r'[a-zA-Z_][a-zA-Z0-9_]*', k) else json.dumps(k, ensure_ascii=False)
    one = lambda x: json.dumps(x, ensure_ascii=False, separators=(', ', ': '))
    def oneline(x):
        if isinstance(x, dict): return '{ ' + ', '.join(f'{key(k)}: {oneline(v)}' for k, v in x.items()) + ' }' if x else '{}'
        if isinstance(x, list): return '[' + ', '.join(oneline(v) for v in x) + ']'
        return one(x)
    sp = '  ' * ind
    s1 = oneline(o)
    if len(s1) + len(sp) <= width or not isinstance(o, (dict, list)): return s1
    if isinstance(o, dict):
        return '{\n' + ',\n'.join(f'{sp}{key(k)}: {compact(v, ind + 1, width)}' for k, v in o.items()) + ',\n' + '  ' * (ind - 1) + '}'
    return '[\n' + ',\n'.join(f'{sp}{compact(v, ind + 1, width)}' for v in o) + ',\n' + '  ' * (ind - 1) + ']'

def js(f, meta):
    hdr = f"""// ============================================================
//  data/{meta['file']} — {f['name']}
//  Generado desde el PDF oficial: {meta['source']}
//  Si se regenera desde el PDF, este archivo se sobrescribe.
// ============================================================

FACTIONS['{f['id']}'] = """
    return hdr + compact(f) + ';\n'

if __name__ == '__main__':
    keys = sys.argv[1:] or list(META)
    report = {}
    for k in keys:
        f, ops = build(k)
        open(os.path.join(KT, 'js/data', META[k]['file']), 'w', encoding='utf-8').write(js(f, META[k]))
        report[k] = {'ops': len(f['ops']), 'frs': len(f['frs']), 'pl': (len(f['pl']['s']), len(f['pl']['f'])), 'eq': len(f['eq']), 'er': sum(len(v['ee']) for v in f['er']), 'version': f['version'],
                     'imgs_extraidas': [o['_extracted'] for o in ops if o['_extracted']]}
        print(k, {x: y for x, y in report[k].items() if x != 'imgs_extraidas'}, 'img nuevas:', len(report[k]['imgs_extraidas']))
    json.dump(report, open('out/report.json', 'w'), ensure_ascii=False, indent=1)
