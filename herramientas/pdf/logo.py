import sys, numpy as np, pymupdf as fitz
from PIL import Image
name, out = sys.argv[1], sys.argv[2]
doc = fitz.open(name + '.pdf')
page = doc[0]
W, H = page.rect.width, page.rect.height
clip = fitz.Rect(0, 0, W * .2, H * .13)
pix = page.get_pixmap(matrix=fitz.Matrix(8, 8), clip=clip)
im = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3].astype(int)
r, g, b = im[..., 0], im[..., 1], im[..., 2]
orange = (r > 170) & (g < 150) & (b < 110) & (r - b > 100)
from scipy import ndimage
lab, n = ndimage.label(ndimage.binary_dilation(orange, iterations=6))
sizes = ndimage.sum(orange, lab, range(1, n + 1))
big = lab == (int(np.argmax(sizes)) + 1)
by, bx = np.where(big)
keep = np.zeros_like(big); keep[by.min():by.max() + 1, bx.min():bx.max() + 1] = True
orange = orange & keep
ys, xs = np.where(orange)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
crop = im[y0:y1 + 1, x0:x1 + 1]
o = orange[y0:y1 + 1, x0:x1 + 1]
# alfa suave según "naranjidad"
rr, gg, bb = crop[..., 0], crop[..., 1], crop[..., 2]
a = (np.clip((rr - bb - 40) * 3, 0, 255) * ndimage.binary_dilation(keep[y0:y1 + 1, x0:x1 + 1], iterations=2)).astype(np.uint8)
rgba = np.zeros(crop.shape[:2] + (4,), dtype=np.uint8)
rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3] = 0xF1, 0x5C, 0x22, a
img = Image.fromarray(rgba, 'RGBA')
s = max(img.size); sq = Image.new('RGBA', (s, s), (0, 0, 0, 0)); sq.paste(img, ((s - img.width) // 2, (s - img.height) // 2))
sq.resize((300, 300), Image.LANCZOS).save(out)
print(name, img.size)
