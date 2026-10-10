"""Borra los .jpg/.png de imagenes/ que ya tienen su .webp al lado.
Uso: python herramientas/imagenes/limpiar.py [raíz del proyecto]   (añade --si para borrar de verdad)
"""
import sys, os
args = [a for a in sys.argv[1:] if not a.startswith('--')]
root = args[0] if args else '.'
borrar = '--si' in sys.argv
total = 0
for d, _, files in os.walk(os.path.join(root, 'imagenes')):
    for f in files:
        p = os.path.join(d, f)
        if f.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.exists(os.path.splitext(p)[0] + '.webp'):
            total += os.path.getsize(p)
            print(('borrado  ' if borrar else 'sobra    ') + p)
            if borrar: os.remove(p)
print(f'{total/1e6:.1f} MB {"liberados" if borrar else "se liberarían (ejecuta con --si para borrar)"}')
