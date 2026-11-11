"""Regenera js/data/instruccion_ia.js a partir de los .md de recursos/.

Uso:  python herramientas/ia/generar.py [raíz del proyecto]
Las instrucciones se editan SOLO en recursos/convertir-comando.md (PDF → paquete nuevo) y
recursos/actualizar-comando.md (erratas → paquete actualizado). La página «Añadir comando»
lee la copia en JS para funcionar también sin servidor y sin conexión.
"""
import json, sys, pathlib
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
conv = (root / 'recursos' / 'convertir-comando.md').read_text(encoding='utf-8')
upd = (root / 'recursos' / 'actualizar-comando.md').read_text(encoding='utf-8')
out = root / 'js' / 'data' / 'instruccion_ia.js'
out.write_text('// Generado desde recursos/*.md con herramientas/ia/generar.py — no editar a mano\n'
               'window.KT_PROMPT_MD = ' + json.dumps(conv, ensure_ascii=False) + ';\n'
               'window.KT_PROMPT_UPD = ' + json.dumps(upd, ensure_ascii=False) + ';\n', encoding='utf-8')
print('OK', out, len(conv), '+', len(upd), 'caracteres')
