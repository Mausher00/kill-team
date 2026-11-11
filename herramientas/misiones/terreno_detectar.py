"""Escenografía pulsable — paso 1: detectar las etiquetas (A, B, C1…) de cada mapa.

Busca los recuadros grises con letra blanca de los mapas del mazo y lee la letra con Tesseract.
Requisitos: pip install opencv-python numpy · tesseract instalado en el sistema.
Uso:  python herramientas/misiones/terreno_detectar.py [zona …]     (desde la raíz del proyecto)
Deja det-<zonas>.json en la carpeta actual. Después revisa/corrige y genera js/data/terreno.js
con terreno_datos.py (ahí están las correcciones a mano y las fichas de cada pieza).
"""
import cv2, numpy as np, sys, glob, os, json, subprocess, re, tempfile
R='./'
BOX=np.array([89,86,79])
def boxes(im):
    h,w=im.shape[:2]
    d=np.abs(im.astype(int)-BOX).max(axis=2)
    box=(d<15)
    white=(im.min(axis=2)>200)
    light=(im.min(axis=2)>120)
    black=(im.max(axis=2)<78)
    res=[]
    for kind,base in (('g',box),('k',black)):
        b0=cv2.morphologyEx(base.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
        b1=cv2.morphologyEx(base.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
        for bm in (b0, cv2.morphologyEx(b0,cv2.MORPH_OPEN,np.ones((5,5),np.uint8)), b1, cv2.morphologyEx(b1,cv2.MORPH_OPEN,np.ones((7,7),np.uint8))):
            n,lab,st,cen=cv2.connectedComponentsWithStats(bm,8)
            for k in range(1,n):
                x,y,bw,bh,a=st[k]
                if not (10<=bw<=80 and 10<=bh<=80): continue
                if max(bw,bh)/min(bw,bh)>2.2: continue
                wm=white[y:y+bh,x:x+bw]; cm=(lab[y:y+bh,x:x+bw]==k)
                fill=(cm|light[y:y+bh,x:x+bw]).mean(); wr=wm.mean()
                if fill<0.8 or not (0.015<wr<0.5): continue
                edge=np.concatenate([wm[0],wm[-1],wm[:,0],wm[:,-1]]).mean()
                if edge>0.12: continue
                res.append((int(x),int(y),int(bw),int(bh),kind))
    out=[]
    for b in res:
        if not any(abs(b[0]+b[2]/2-o[0]-o[2]/2)<9 and abs(b[1]+b[3]/2-o[1]-o[3]/2)<9 for o in out): out.append(b)
    return out
def ocr(crop, wl, pat):
    best=None
    g=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY)
    g=cv2.resize(g,None,fx=5,fy=5,interpolation=cv2.INTER_CUBIC)
    g=255-g  # texto oscuro sobre claro
    g=cv2.copyMakeBorder(g,30,30,30,30,cv2.BORDER_CONSTANT,value=int(np.median(g)))
    _,g=cv2.threshold(g,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    for rot in (0,1,2,3):
        r=np.rot90(g,rot)
        for psm in (10,8,7):
            with tempfile.NamedTemporaryFile(suffix='.png') as t:
                cv2.imwrite(t.name,r)
                o=subprocess.run(['tesseract',t.name,'-','--psm',str(psm),'-c','tessedit_char_whitelist='+wl,'tsv'],capture_output=True,text=True).stdout
            for line in o.splitlines()[1:]:
                p=line.split('\t')
                if len(p)>=12 and p[11].strip() and float(p[10])>0:
                    txt=p[11].strip(); conf=float(p[10])
                    if re.fullmatch(pat,txt) and (best is None or conf>best[1]): best=(txt,conf,rot)
    return best
ZON={'volkus':('ABCDEFGHIJKLMN','[A-N]'),'bheta-decima':('ABCD','[A-D]'),'octarius':('ABCDEFGHIJK','[A-K]'),
     'gallowdark':('ABC12345678','[ABC][1-8]'),'necropolis':('ABC12345678','[ABC][1-8]'),'generica':('ABCDEFGHIJKLMN12345678','[A-N][1-8]?')}
if __name__=='__main__':
    res={}
    for z,(wl,pat) in ZON.items():
        if len(sys.argv)>1 and z not in sys.argv[1:]: continue
        for f in sorted(glob.glob(R+f'imagenes/mapas/{z}/*.webp')):
            if 'clave' in f: continue
            im=cv2.imread(f); h,w=im.shape[:2]
            L=[]
            for (x,y,bw,bh,kind) in boxes(im):
                o=ocr(im[y+1:y+bh-1,x+1:x+bw-1],wl,pat)
                L.append([round((x+bw/2)/w*100,1),round((y+bh/2)/h*100,1),o[0] if o else '?',round(o[1]) if o else 0,[x,y,bw,bh],kind])
            res[os.path.relpath(f,R)]=L
            print(os.path.basename(f),len(L),' '.join(f'{l[2]}' for l in L),'| low:',[ (l[2],l[3]) for l in L if l[3]<60])
    json.dump(res,open(f'det-{"-".join(sys.argv[1:]) or "all"}.json','w'))
