"""Escenografía pulsable — paso 2: aplicar reglas y correcciones a mano sobre la detección.

Uso:  python herramientas/misiones/terreno_datos.py      (lee det-all.json, escribe final.json)
FIX[mapa] = [(x%, y%, letra)]: corrige la etiqueta más cercana o la añade; letra None la borra.
Las posiciones de js/data/terreno.js también se pueden retocar a mano directamente.
"""
import json, math
D=json.load(open('det-all.json'))
P='imagenes/mapas/'
FIX={ # archivo: [(x%, y%, letra | None para borrar)]
 'volkus/I-1':[(40,62.5,'A')],
 'volkus/I-3':[(61.2,5,'K')],
 'volkus/I-6':[(57.9,16.6,'E'),(9.9,65.4,'K')],
 'volkus/II-2':[(64.5,61.6,'B'),(64.5,70,'G')],
 'volkus/II-3':[(27,10.5,'D')],
 'volkus/II-4':[(59.6,83.6,'E')],
 'volkus/II-5':[(81.3,42,'C')],
 'volkus/II-6':[(47,36,'C')],
 'volkus/asedio-1':[(2.6,47.3,None),(90.1,22.7,'F'),(80.7,38.8,'G'),(17.5,62,'H'),(16.4,87.1,'E')],
 'volkus/asedio-2':[(29.9,13.75,'K')],
 'bheta-decima/I-2':[(63.9,45.5,'B'),(48.3,72.3,'B')],
 'bheta-decima/I-4':[(27.6,47.5,'B')],
 'bheta-decima/I-5':[(54.3,42.5,'B')],
 'bheta-decima/II-4':[(18.7,53.6,'A')],
 'octarius/3':[(86.6,21.8,'F')],
 'octarius/4':[(24,56,'B')],
 'gallowdark/4':[(70.1,61.6,'A1')],
 'gallowdark/5':[(63.6,53.6,'B1')],
 'necropolis/1':[(79.6,71.8,'C1'),(49.7,10.2,'T'),(49.7,58,'T')],
 'necropolis/2':[(79.3,19.3,'C1'),(47,65.2,'A1'),(56.2,77.3,'A1'),(36.3,42.3,'T'),(63,65.7,'T')],
 'necropolis/3':[(87.1,17.9,'A1'),(29.6,80.9,'C1'),(36.6,18.8,'T'),(62.8,80.9,'T')],
 'necropolis/4':[(33.6,33.9,'A4'),(12.5,71.4,'C1'),(23,58,'T'),(76.6,42.5,'T')],
 'necropolis/5':[(25.7,39.6,'B2'),(22.8,46.4,'B4'),(70.4,65.7,'C1'),(90.4,42.3,'T'),(23,58,'T')],
 'necropolis/6':[(6.6,34.3,'C1'),(52.6,39.8,'B2'),(48.3,47,'B2'),(29.9,65.7,None),(43.7,85.2,'A1'),(23,26.3,'T'),(70.4,58,'T')],
}
out={}
for f,L in D.items():
    z=f.split('/')[2]; key=f[len(P):-5]
    pts=[]
    for x,y,t,conf,box,kind in L:
        if kind=='k' and z!='necropolis': continue
        if t=='?':
            if kind=='g' and z in ('volkus','octarius'): t='I'
            else: continue
        if z=='necropolis' and kind=='k' and not t.startswith('C'): continue
        if any(math.hypot(x-a,y-b)<3.5 for a,b,_ in pts): continue
        pts.append([x,y,t])
    for x,y,t in FIX.get(key,[]):
        near=sorted(pts,key=lambda p:math.hypot(p[0]-x,p[1]-y))
        hit=near[0] if near and math.hypot(near[0][0]-x,near[0][1]-y)<5 else None
        if t is None:
            if hit: pts.remove(hit)
            else: print('!! nada que borrar',key,x,y)
        elif hit: hit[2]=t
        else: pts.append([x,y,t])
    out[f]=sorted(pts,key=lambda p:(p[2],p[0]))
json.dump(out,open('final.json','w'))
# para el overlay
json.dump({k:[[x,y,t,100,[0,0,0,0],'g'] for x,y,t in v] for k,v in out.items() if 'volkus' in k},open('det-vf.json','w'))
for k,v in out.items(): print(k[len(P):], len(v), ' '.join(p[2] for p in v))
