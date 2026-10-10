"""Tablas de armas desde el texto maquetado (pdftotext -layout), respetando columnas."""
import re, json, sys, unicodedata

ROW = re.compile(r'^(\s*)(\S.*?)\s+(\d+)\s+(\d\s*\+)\s+(\d+\s*/\s*\d+|\*|-)\s*(.*)$')

def norm(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', s)).strip().upper()

def parse(name, cards):
    lines = open(f'{name}.layout.txt', encoding='utf-8').read().split('\n')
    names = sorted([c['name'] for c in cards], key=len, reverse=True)
    out = {}
    i = 0
    while i < len(lines):
        L = lines[i]
        if 'NOMBRE' in L and re.search(r'ATA?Q', L) and 'DAÑO' in L:
            # ficha a la que pertenece: buscar hacia atrás
            ctx = ' '.join(norm(x) for x in lines[max(0, i - 5):i])
            hits = [(ctx.rfind(norm(n)), len(n), n) for n in names if norm(n) in ctx]
            owner = max(hits)[2] if hits else None
            if owner is None:
                # nombre partido en dos líneas: probar uniendo
                ctx2 = re.sub(r'\s+\d.*$', '', ctx)
                owner = next((n for n in names if all(w in ctx for w in norm(n).split())), None)
            rcol = L.find('REGLAS')
            ncol = L.find('NOMBRE')
            ws = []
            j = i + 1
            while j < len(lines):
                s = lines[j]
                if not s.strip(): break
                if len(s) - len(s.lstrip()) < max(ncol - 3, 2) and not ROW.match(s): break
                m = ROW.match(s)
                if m and m.group(3):
                    ws.append({'n': m.group(2).strip(), 'a': int(m.group(3)), 'i': m.group(4).replace(' ', ''),
                               'd': m.group(5).replace(' ', ''), 'r': m.group(6).strip()})
                elif ws:
                    st = len(s) - len(s.lstrip())
                    txt = s.strip()
                    # puede haber texto en ambas columnas: dividir por un hueco grande
                    parts = re.split(r'\s{3,}', txt)
                    if st >= rcol - 4:
                        ws[-1]['r'] = (ws[-1]['r'] + ' ' + txt).strip()
                    elif len(parts) >= 2:
                        ws[-1]['n'] += ' ' + parts[0]
                        ws[-1]['r'] = (ws[-1]['r'] + ' ' + ' '.join(parts[1:])).strip()
                    else:
                        ws[-1]['n'] += ' ' + txt
                else:
                    break
                j += 1
            if owner and owner not in out:
                for w in ws:
                    w['r'] = re.sub(r'\s+,', ',', w['r']).strip()
                    if w['r'] == '-': w['r'] = ''
                    w['n'] = re.sub(r'\s+', ' ', w['n'])
                out[owner] = ws
            i = j
        i += 1
    return out

if __name__ == '__main__':
    name = sys.argv[1]
    d = json.load(open(f'out/{name}.json'))
    res = parse(name, d['cards'])
    for c in d['cards']:
        new = res.get(c['name'])
        if new is None: print('!! sin tabla:', c['name']); continue
        old = [w['n'] for w in c['weapons']]
        nn = [w['n'] for w in new]
        if old != nn or len(new) != len(c['weapons']):
            print('~', c['name']); print('    antes:', old); print('    ahora:', nn)
