global.FACTIONS = {}; global.window = {};
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
process.chdir(ROOT);
for (const f of fs.readdirSync('js/data')) require(path.join(ROOT, 'js/data', f));
const bad = (fid, what, msg) => console.log(`[${fid}] ${what}: ${msg}`);
const susp = /CONTINÚA|NOTAS:|Ficha de|LAS REGLAS|�|  /;
for (const f of Object.values(FACTIONS)) {
  const types = new Set();
  f.ops.forEach(o => {
    if (types.has(o.type)) bad(f.id, o.name, 'tipo duplicado ' + o.type); types.add(o.type);
    if (!o.s.lpa || !o.s.mov || !o.s.salv || !o.s.h) bad(f.id, o.name, 'stats incompletos ' + JSON.stringify(o.s));
    if (!o.w.length) bad(f.id, o.name, 'sin armas');
    if (o.kw.length < 3) bad(f.id, o.name, 'kw: ' + o.kw);
    o.w.forEach(w => { if (!/^\d+\+$/.test(w.i) || !/^(\d+\/\d+|\*)$/.test(w.d) || w.n.length > 60) bad(f.id, o.name, 'arma rara ' + JSON.stringify(w)); });
    o.ru.forEach(r => { if (!r.t || r.t.length < 15 || r.n === 'Regla' || susp.test(r.t) || r.n.length > 50) bad(f.id, o.name, `habilidad "${r.n}": ${r.t.slice(0, 90)}`); });
  });
  const chk = (arr, what) => arr.forEach(x => { if (!x.t || x.t.length < 25 || susp.test(x.t) || !x.n) bad(f.id, what, `"${x.n}": ${(x.t || '').slice(0, 100)}`); });
  chk(f.pl.s, 'ardid E'); chk(f.pl.f, 'ardid T'); chk(f.eq, 'equipo');
  (f.frs || []).forEach(r => { if (!r.text && !r.subs.length) bad(f.id, 'regla', 'vacía ' + r.name); r.subs.forEach(s => { if (!s.t) bad(f.id, 'regla ' + r.name, 'sub vacía ' + s.n); }); if (susp.test(r.text)) bad(f.id, 'regla', r.name + ': ' + r.text.slice(0, 80)); });
  // roster -> tipos existentes
  const R = f.roster;
  [...(R.required || []), ...(R.pool?.entries || [])].forEach(e => { if (e.type !== 'ARDID_0PM' && !types.has(e.type)) bad(f.id, 'roster', 'tipo inexistente ' + e.type); });
  f.ops.forEach(o => { if (![...(R.required || []), ...(R.pool?.entries || [])].some(e => e.type === o.type)) bad(f.id, 'roster', 'operativo no elegible: ' + o.type); });
  if (!fs.existsSync(o_img = f.img)) bad(f.id, 'logo', 'falta ' + f.img);
}
console.log('facciones:', Object.keys(FACTIONS).length, 'operativos:', Object.values(FACTIONS).reduce((n, f) => n + f.ops.length, 0));
