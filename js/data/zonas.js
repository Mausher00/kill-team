// ============================================================
//  data/zonas.js — Mapas propios de la temporada anterior
//  Se cargan DESPUÉS de misiones.js y se añaden al final de cada
//  zona (marcados como «24·n»). El azar solo usa los mapas del mazo.
// ============================================================
(() => {
  const add = (id, imgs) => {
    const z = (window.ZONAS || []).find(z => z.id === id);
    if (z) z.maps.push(...imgs.map((img, k) => ({ id: 'old-' + (k + 1), label: '24·' + (k + 1), img, old: true })));
  };
  const six = f => [1, 2, 3, 4, 5, 6].map(f);
  add('volkus', six(n => `imagenes/volkus/${n}.png`));
  add('necropolis', six(n => `imagenes/necropolis/${n}.png`));
  add('octarius', six(n => `imagenes/octarius/${n}.png`));
  add('bheta-decima', six(n => `imagenes/betha-decima/${n}.png`));
  add('gallowdark', [6, 5, 4, 3, 2, 1].map((c, i) => `imagenes/gallowdark/Gallowdark_000${i}_Capa-${c}.png`));
})();
