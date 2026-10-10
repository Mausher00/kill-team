"""Regenera los comandos de la app a partir de los PDF oficiales de Kill Team.

Uso (desde esta carpeta):
    python actualizar.py "../../Nuevos PDF"            # todos los comandos
    python actualizar.py "../../Nuevos PDF" mandrakes  # solo uno (clave de rosters.py)

Requisitos: Python 3.10+, `pip install pymupdf pillow numpy scipy`
y `pdftotext` (Poppler) en el PATH.
"""
import sys, os, glob, shutil, subprocess, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from rosters import META

# Palabra del nombre del PDF oficial (en inglés) -> clave de rosters.py
PDF_KEYS = {
    'death_korps': 'death_korps', 'hearthkyn': 'hearthkyn_salvagers', 'murderwing': 'murderwing',
    'nemesis_claw': 'nemesis_claw', 'wrecka_krew': 'wrecka_krew', 'kommandos': 'kommandos',
    'tempestus_aquilons': 'tempestus_aquilons', 'angels_of_death': 'angels_of_death',
    'exaction_squad': 'exaction_squad', 'hand_of_the_archon': 'hand_of_the_archon', 'mandrakes': 'mandrakes',
    'novitiates': 'novitiates', 'pathfinders': 'pathfinders', 'phobos': 'phobos_strike_team',
    'vespid': 'vespid_stingwings',
}

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', 'Nuevos PDF')
    only = set(sys.argv[2:])
    work = os.path.join(HERE, 'trabajo'); os.makedirs(os.path.join(work, 'out', 'img'), exist_ok=True)
    os.chdir(work)
    keys = []
    for pdf in glob.glob(os.path.join(src, '*.pdf')):
        low = os.path.basename(pdf).lower()
        key = next((v for k, v in PDF_KEYS.items() if k in low), None)
        if not key or (only and key not in only): continue
        shutil.copy(pdf, key + '.pdf')
        subprocess.run(['pdftotext', '-layout', key + '.pdf', key + '.layout.txt'], check=True)
        subprocess.run(['pdftotext', key + '.pdf', key + '.txt'], check=True)
        keys.append(key)
    if not keys: sys.exit('No se encontró ningún PDF de comando conocido en ' + src)
    for k in keys:
        print('·', k)
        subprocess.run([sys.executable, os.path.join(HERE, 'extract.py'), k], check=True, stdout=subprocess.DEVNULL)
        subprocess.run([sys.executable, os.path.join(HERE, 'portraits.py'), k], check=True)
    subprocess.run([sys.executable, os.path.join(HERE, 'build.py'), *keys], check=True)
    # copiar retratos nuevos (los que no tienen imagen tuya asignada en rosters.py)
    root = os.path.abspath(os.path.join(HERE, '..', '..'))
    rep = json.load(open(os.path.join('out', 'report.json')))
    for k, r in rep.items():
        d = os.path.join(root, 'imagenes', META[k]['imgdir']); os.makedirs(d, exist_ok=True)
        for f in r['imgs_extraidas']:
            dst = os.path.join(d, f)
            if not os.path.exists(dst): shutil.copy(os.path.join('out', 'img', k, f), dst)
    print('Listo. Revisa con: node comprobar.js')

if __name__ == '__main__':
    main()
