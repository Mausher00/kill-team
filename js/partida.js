// ============================================================
//  partida.js — Modo de juego
//  Estado serializable en localStorage ('kt.partida'), con
//  deshacer (Ctrl+Z / botón). Los datos de cada agente se leen
//  siempre de FACTIONS y las operaciones de OPS (misiones.js);
//  aquí solo se guarda lo que cambia en partida.
// ============================================================

const KEY = 'partida';
const V = 3;
const MAX_TP = 4;
const $ = s => document.querySelector(s);
const esc = s => KT.esc(s);
const norm = s => KT.norm(s).replace(/\s*\(.*?\)\s*/g, ' ').trim();
const ARQ = ['Seguridad', 'Reconocimiento', 'Buscar y destruir', 'Infiltración'];
const OPN = { crit: 'Op. crítica', kill: 'Op. de eliminación', tac: 'Op. táctica' };
const OPP = { l: 'r', r: 'l', t: 'b', b: 't' };

let S = KT.store.get(KEY) || null;
let legacy = false;           // se comprueba al cargar (migrate2 necesita los datos ya definidos)
const hist = [];
let sheet = null;          // { kind, i, peek, all }
let pop = null;            // marcador abierto en el mapa: { k } · { add: true } · { move: k }
let draft = null;          // preparación en curso

function migrate2() {
  S.v = V; S.rot = !!S.flip; delete S.flip; S.dz = 0; S.ini0 = null;
  S.players.forEach(P => { P.ployUsed = {}; });
  S.obj = initObjs(S.zone, S.map, S.crit);
}

// ── Utilidades de estado ─────────────────────────────────────
function save() { if (S) KT.store.set(KEY, S); }
function commit(fn, opts = {}) {
  hist.push(JSON.stringify(S));
  if (hist.length > 60) hist.shift();
  fn();
  save();
  if (opts.render !== false) render(opts.only);
  syncUndo();
}
function undo() {
  if (!hist.length) { KT.toast('Nada que deshacer'); return; }
  S = JSON.parse(hist.pop());
  save(); render(); syncUndo();
  KT.toast('Deshecho', { ms: 1200 });
}
function syncUndo() { const b = $('#btn-undo'); if (b) b.disabled = !hist.length; }

const opData = (P, op) => FACTIONS[P.factionId]?.ops.find(o => o.id === op.opId);
const pname = i => (draft?.names?.[i]?.trim()) || (S?.players?.[i]?.name) || 'Jugador ' + (i + 1);
const zoneOf = id => ZONAS.find(z => z.id === id);
const mapOf = (z, id) => z?.maps.find(m => m.id === id);
const critOf = n => OPS.crit.find(c => c.n === n);
const tacOf = id => OPS.tac.find(t => t.id === id);
const pick = a => a[Math.floor(Math.random() * a.length)];
const d6 = () => 1 + Math.floor(Math.random() * 6);

function archetypes(P) {
  const f = FACTIONS[P.factionId];
  return (f.roster?.archetypes || f.tags || []).filter(a => ARQ.includes(a));
}
const slug = s => KT.norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Equipo disponible para un comando (mismos ids que el constructor)
function eqOptions(f) {
  const fac = f.roster?.equipment?.faction
    ? f.roster.equipment.faction.map(e => ({ id: e.id, n: e.n, t: e.note || e.t || '' }))
    : (f.eq || []).map(e => ({ id: 'f-' + slug(e.n), n: e.n, t: e.t }));
  const allowed = f.roster?.equipment?.universal;
  const uni = (window.UNIVERSAL_EQUIPMENT || []).filter(u => !allowed || allowed.includes(u.id));
  return { fac, uni, all: [...fac, ...(window.UNIVERSAL_EQUIPMENT || [])] };
}

// ── Puntuación ───────────────────────────────────────────────
// Grado de eliminación de i: según los agentes de su rival incapacitados
function killInfo(i) {
  const E = S.players[1 - i];
  const start = E.ops.length, dead = E.ops.filter(o => o.w <= 0).length;
  const row = OPS.kill.tabla[Math.max(5, Math.min(14, start))];
  const base = row.filter(t => dead >= t).length;
  const adj = S.players[i].score.killAdj || 0;
  const grade = Math.max(0, Math.min(5, base + adj));
  return { start, dead, row, base, adj, grade, next: base < 5 ? row[base] : null };
}
function scoreOf(i) {
  const P = S.players[i], k = killInfo(i), ko = killInfo(1 - i);
  const bonus = S.ended && k.grade > ko.grade ? 1 : 0;
  const by = { crit: P.score.crit, kill: k.grade + bonus, tac: P.score.tac };
  const prim = S.ended && P.prim ? Math.ceil(by[P.prim] / 2) : 0;
  return { ...by, bonus, prim, k, total: by.crit + by.kill + by.tac + prim };
}

// ── Construir jugador desde un comando guardado o un comando completo ─
function weaponsFor(f, type, chosenText) {
  // Armas opcionales de este tipo (aparecen en alguna opción del constructor)
  const entries = [...(f.roster?.required || []), ...(f.roster?.pool?.entries || [])].filter(e => e.type === type);
  const optional = new Set();
  entries.forEach(e => {
    (e.loadouts || []).forEach(l => l.w.forEach(w => optional.add(norm(w.n))));
    if (e.label && e.label.includes('·')) optional.add(norm(e.label.split('·')[1]));
  });
  const chosen = new Set((chosenText || '').split(/;|·/).map(norm).filter(Boolean));
  const match = (base, set) => [...set].some(n => base === n || base.startsWith(n + ' '));
  return op => op.w.filter(w => {
    const b = norm(w.n);
    if (!match(b, optional)) return true;           // arma fija
    return chosen.size ? match(b, chosen) : true;    // sin elección: todas
  }).map(w => w.n);
}

function buildPlayer(src, name) {
  let f, ops = [], title = '', ploys0 = [], equipment = [];
  if (src.kind === 'roster') {
    const r = (KT.store.get('rosters', []) || []).find(x => x.id === src.id);
    if (!r || !FACTIONS[r.factionId]) return null;
    f = FACTIONS[r.factionId]; title = r.name; ploys0 = r.ploys0 || []; equipment = r.equipment || [];
    r.ops.forEach(o => {
      const od = f.ops.find(x => x.id === o.opId) || f.ops.find(x => x.type === o.type);
      if (!od) return;
      const pickW = weaponsFor(f, od.type, o.loadout || o.label);
      for (let k = 0; k < o.qty; k++) ops.push({ opId: od.id, label: o.label !== od.name ? o.label : null, wpn: pickW(od) });
    });
  } else {
    f = FACTIONS[src.id]; if (!f) return null;
    title = 'Comando completo';
    f.ops.forEach(od => ops.push({ opId: od.id, label: null, wpn: od.w.map(w => w.n) }));
  }
  // numerar repetidos
  const count = {};
  ops.forEach(o => { count[o.opId] = (count[o.opId] || 0) + 1; o.n = count[o.opId]; });
  ops.forEach(o => { if (count[o.opId] === 1) o.n = 0; });
  ops = ops.map((o, i) => {
    const od = f.ops.find(x => x.id === o.opId);
    return { uid: 'o' + i, ...o, w: od.s.h, order: 'conceal', used: false, open: false };
  });
  return {
    name: name || '', src, factionId: f.id, title, ploys0, equipment: [...equipment], ops,
    cp: 2,                                   // «Elegir agentes: cada jugador gana 2PM»
    tac: null, tacShown: false, prim: null,
    score: { crit: 0, tac: 0, killAdj: 0 },
    cards: { rr: 0, i1: 0, i2: 0, i3: 0 },   // 0 no la tiene · 1 la tiene · 2 usada
    ployUsed: {},                            // nombre -> punto de inflexión en que se usó
  };
}

// ── Mapa: geometría y marcadores de objetivo ─────────────────
// MARCADORES[img] = { o: [[x%, y%]…], j1: lado de la zona de despliegue naranja (l r t b) }
// S.dz: jugador que despliega en la zona naranja · S.rot: giro manual de 180°
function mapInfo(img) {
  const over = (KT.store.get('marcadores', {}) || {})[img];
  const base = (window.MARCADORES || {})[img] || { o: [], j1: 'l' };
  return { j1: base.j1, o: over || base.o, custom: !!over };
}
function geom() {
  const z = zoneOf(S.zone), m = mapOf(z, S.map);
  if (!m) return null;
  const info = mapInfo(m.img);
  const side = S.dz === 1 ? OPP[info.j1] : info.j1;        // dónde despliega J1 en la imagen original
  const rot = (side === 'r') !== !!S.rot;                   // se gira para dejar a J1 a la izquierda
  return { z, m, info, side, rot, shown: rot ? OPP[side] : side };
}
// Propietario de un marcador (en coordenadas de la imagen): 'c' centro, 0 J1, 1 J2
function ownerOf(x, y, side) {
  const v = side === 'l' || side === 'r' ? x : y;
  if (Math.abs(v - 50) < 4) return 'c';
  const j1low = side === 'l' || side === 't';
  return (v < 50) === j1low ? 0 : 1;
}
const objTemplate = () => ({ ctrl: null, sec: null, tx: false, orb: false, lt: [], dl: false, dp: 0, num: null, inert: false, car: null, cl: {}, mt: [0, 0], dev: [false, false], clr: [false, false], swp: false, srch: [false, false] });
function nearestCentre(objs) { return objs.reduce((b, o) => !b || Math.hypot(o.x - 50, o.y - 50) < Math.hypot(b.x - 50, b.y - 50) ? o : b, null); }
function critSetup(objs, crit) {
  objs.forEach((o, k) => { o.orb = false; o.num = crit === 9 ? k + 1 : null; });   // Reinicio: numerados 1–3
  if (crit === 4) { const c = nearestCentre(objs); if (c) c.orb = true; }          // Orbe: empieza en el central
}
function initObjs(zone, mapId, crit) {
  const m = mapOf(zoneOf(zone), mapId);
  if (!m) return [];
  const objs = mapInfo(m.img).o.map(([x, y]) => ({ ...objTemplate(), x, y }));
  critSetup(objs, crit);
  return objs;
}
const objName = (o, side) => { const w = ownerOf(o.x, o.y, side); return w === 'c' ? 'Marcador central' : `Marcador de ${pname(w)}`; };

// ── Render ───────────────────────────────────────────────────
function render(only) {
  if (!S || !S.started) { $('#app').hidden = true; openSetup(); return; }
  $('#app').hidden = false;
  if (!only || only === 'top') renderTop();
  if (!only || only === 0 || only === 'cols') renderCol(0);
  if (!only || only === 1 || only === 'cols') renderCol(1);
  if (!only || only === 'board') renderBoard();
  if (only === 'objs') renderObjs();
  // la barra y la hoja dependen de casi todo (bajas → grado de eliminación)
  renderBar();
  if (only === 0 || only === 1) renderCol(1 - only);
  if (sheet) renderSheet();
}

function renderTop() {
  const z = zoneOf(S.zone), m = mapOf(z, S.map), c = critOf(S.crit);
  $('#g-title').innerHTML = `<b>${esc(pname(0))} <span style="color:var(--text-3);font-size:12px">vs</span> ${esc(pname(1))}</b>
    <span>${z ? esc(z.name) + (m ? ' · mapa ' + esc(m.label) : '') : 'Sin zona'}${c ? ' · ' + esc(c.name) : ''}</span>`;
  document.title = 'Partida · Kill Team';
}

const CARDS = [['rr', 'Rep.'], ['i1', '±1'], ['i2', '±2'], ['i3', '±3']];
function renderCol(i) {
  const P = S.players[i], f = FACTIONS[P.factionId];
  const col = $('#col-' + i);
  const alive = P.ops.filter(o => o.w > 0);
  const ready = alive.filter(o => !o.used).length;
  const eqAll = eqOptions(f).all;
  const extras = [
    ...P.ploys0.map(p => `<button class="g-chip zero" data-tipploy="${esc(p)}" title="Ardid a 0PM">${esc(p)} · 0PM</button>`),
    ...P.equipment.map(id => `<button class="g-chip" data-tipeq="${esc(id)}">${esc(eqAll.find(e => e.id === id)?.n || id)}</button>`),
  ].join('');
  const t = tacOf(P.tac), k = killInfo(i);
  const tacTxt = !t ? 'Elegir' : P.tacShown ? t.name : 'Oculta';
  const cards = CARDS.map(([id, l]) => {
    const st = P.cards[id];
    const tip = OPS.iniciativa.find(c => c.id === id);
    return `<button class="g-card s${st}" data-card="${id}" title="${esc(tip.name + ' ' + tip.sub)} · ${['no la tiene', 'disponible', 'usada'][st]} (tocar para cambiar)">${l}</button>`;
  }).join('');
  const nPloys = ployList(P).filter(p => P.ployUsed[p.n] === S.tp).length;
  col.innerHTML = `
    <div class="g-ph">
      <img src="${f.img}" alt="" onerror="this.style.visibility='hidden'">
      <div class="g-pn"><div class="g-pname">${esc(pname(i))}</div><div class="g-pfac">${esc(f.name)} · ${esc(P.title)}</div></div>
      <div class="g-pcount" title="Por activar / en pie / total"><b>${ready}</b> por activar<br>${alive.length}/${P.ops.length} en pie</div>
    </div>
    <div class="g-mis">
      <button class="g-mchip ${t ? (P.tacShown ? 'shown' : 'secret') : 'todo'}" data-sheet="tac" data-p="${i}" title="Operación táctica"><i class="ti ti-${t && !P.tacShown ? 'lock' : 'target-arrow'}"></i><span>Táctica</span><b>${esc(tacTxt)}</b></button>
      <button class="g-mchip ${P.prim ? 'secret' : 'todo'}" data-sheet="score" data-p="${i}" title="Operación principal y puntuación"><i class="ti ti-${P.prim && !S.ended ? 'lock' : 'star'}"></i><span>Principal</span><b>${P.prim ? (S.ended ? esc(OPN[P.prim].replace('Op. ', '')) : 'Oculta') : 'Elegir'}</b></button>
      <button class="g-mchip kill" data-sheet="score" data-p="${i}" title="Grado de eliminación: ${k.dead} de ${k.start} enemigos incapacitados"><i class="ti ti-skull"></i><span>Elim.</span><b>${k.grade}<small>/5</small></b></button>
      <button class="g-mchip ploy" data-sheet="ploys" data-p="${i}" title="Ardides estratégicos y de tiroteo"><i class="ti ti-cards"></i><span>Ardides</span>${nPloys ? `<b>${nPloys}<small> este PI</small></b>` : ''}</button>
    </div>
    <div class="g-extras">${extras}<div class="g-cards" aria-label="Cartas de iniciativa">${cards}</div></div>
    <div class="g-list">${P.ops.map(o => opCard(i, P, o)).join('')}</div>`;
}

function opCard(i, P, o) {
  const od = opData(P, o);
  if (!od) return '';
  const max = od.s.h, hurt = o.w > 0 && o.w < max / 2, dead = o.w <= 0;
  const mov = hurt ? (parseInt(od.s.mov) - 2) + '"' : od.s.mov;
  const name = (o.label || od.name) + (o.n ? ' #' + o.n : '');
  const ws = od.w.filter(w => o.wpn.includes(w.n));
  const worse = v => hurt ? Math.min(6, parseInt(v) + 1) + '+' : v;
  const cls = ['g-op', o.used && 'used', dead && 'dead', hurt && 'hurt', o.open && 'open'].filter(Boolean).join(' ');
  const rules = w => w.r.map(r => `<button class="g-rule" data-rule="${esc(r)}">${esc(r)}</button>`).join('');
  return `
  <div class="${cls}" data-p="${i}" data-u="${o.uid}">
    <div class="g-op-hd" data-act="open" style="background-image:url('${od.img}')" title="Ver armas y habilidades">
      <div class="g-op-nm"><div class="g-op-type">${esc(od.type)}</div><div class="g-op-name">${esc(name)}</div></div>
      <div class="g-op-w">${Math.max(0, o.w)}<small>/${max}</small></div>
    </div>
    <div class="g-op-row">
      <div class="g-stats"><span>LPA <b>${od.s.lpa}</b></span><span>MOV <b class="${hurt ? 'mod' : ''}">${mov}</b></span><span>SALV <b>${od.s.salv}</b></span></div>
      ${dead ? '<span class="g-tag dead">Incapacitado</span>' : `
      ${hurt ? '<span class="g-tag hurt" title="−2&quot; MOV y empeora en 1 el Impactar">Lesionado</span>' : ''}
      <button class="g-tg ${o.order === 'engage' ? 'engage' : 'conceal'}" data-act="order" title="Cambiar orden">${o.order === 'engage' ? '<i class="ti ti-sword"></i>Trab.' : '<i class="ti ti-eye-off"></i>Ocul.'}</button>
      <button class="g-tg ${o.used ? 'on' : ''}" data-act="used" title="${o.used ? 'Usado (tocar para desmarcar)' : 'Marcar como usado'}"><i class="ti ti-${o.used ? 'check' : 'player-play'}"></i></button>`}
    </div>
    <div class="g-wnd">
      <button class="g-wbtn" data-act="dmg" data-v="1" aria-label="Recibir 1 de daño">−</button>
      <div class="g-wbar"><span style="--p:${Math.max(0, o.w) / max * 100}%"></span></div>
      <button class="g-wbtn" data-act="dmg" data-v="-1" aria-label="Recuperar 1 herida">+</button>
    </div>
    <div class="acc g-det"><div class="acc-in"><div class="g-det-in">
      <table class="g-wt">${ws.map(w => `<tr><td class="n">${esc(w.n)}${w.r.length ? `<span class="r">${rules(w)}</span>` : ''}</td>
        <td class="v">${w.a}</td><td class="v ${hurt ? 'mod' : ''}">${worse(w.i)}</td><td class="v d">${w.d}</td></tr>`).join('')}</table>
      ${od.ru.length ? `<div class="g-ab">${od.ru.map(r => `<details class="${r.isAct ? 'act' : ''}"><summary>${esc(r.n)}</summary><p>${esc(r.t).replace(/\n/g, '<br>')}</p></details>`).join('')}</div>` : ''}
    </div></div></div>
  </div>`;
}

// ── Tablero ──────────────────────────────────────────────────
function renderBoard() {
  const g = geom(), c = critOf(S.crit);
  const z = zoneOf(S.zone);
  const tools = `
    <div class="g-btools">
      <button class="g-bt" data-sheet="seq" title="Secuencia de juego y cartas de iniciativa (S)"><i class="ti ti-list-numbers"></i><span>Secuencia</span></button>
      ${z?.claves?.length ? `<button class="g-bt" data-sheet="keys" title="Leyenda del terreno"><i class="ti ti-building-castle"></i><span>Terreno</span></button>` : ''}
      ${g ? `<button class="g-bt ${pop?.add ? 'on' : ''}" data-addobj title="Añadir un marcador de objetivo (toca después en el mapa)"><i class="ti ti-map-pin-plus"></i></button>
      <button class="g-bt" data-flip title="Girar el mapa 180°"><i class="ti ti-rotate-2"></i></button>` : ''}
    </div>`;
  const tags = `
    <div class="g-board-tags">
      ${z ? `<span>${esc(z.name)}${g ? ' · ' + esc(g.m.label) : ''}</span>` : ''}
      <button class="g-crit ${c ? '' : 'todo'}" data-sheet="crit" title="Operación crítica (C)">${c ? `<b>${c.n}</b>${esc(c.name)}` : '<i class="ti ti-plus"></i> Op. crítica'}</button>
    </div>`;
  $('#board').innerHTML = (g
    ? `<div class="g-mapbox" id="mapbox"><img src="${g.m.img}" alt="Mapa ${esc(g.m.label)} de ${esc(g.z.name)}" id="board-img" class="${g.rot ? 'flip' : ''}" onerror="this.outerHTML='<div class=g-empty><i class=\\'ti ti-photo-off\\'></i>No se encuentra la imagen<br>${g.m.img}</div>'">
       <div class="g-objs" id="objs"></div>
       <div class="g-side s-${g.shown}" style="--pc:var(--p1)">${esc(pname(0))}</div><div class="g-side s-${OPP[g.shown]}" style="--pc:var(--p2)">${esc(pname(1))}</div></div>`
    : `<div class="g-empty"><i class="ti ti-map-2"></i>Elige una zona y un mapa en la preparación</div>`) + tags + tools;
  const img = $('#board-img');
  if (img) { img.complete ? placeObjs() : img.addEventListener('load', placeObjs, { once: true }); }
}

// Caja del mapa ajustada a la imagen mostrada (marcadores y etiquetas encima)
function placeObjs() {
  const img = $('#board-img'), box = $('#mapbox'), B = $('#board');
  if (!img || !box || !img.naturalWidth) return;
  const cs = getComputedStyle(B), pw = B.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), ph = B.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const k = Math.min(pw / img.naturalWidth, ph / img.naturalHeight);
  Object.assign(box.style, { width: img.naturalWidth * k + 'px', height: img.naturalHeight * k + 'px' });
  renderObjs();
}

function objBadges(o) {
  const b = [];
  const n = S.crit;
  if (n === 1 && o.sec != null) b.push(`<i class="bd p${o.sec + 1}" title="Asegurado por ${esc(pname(o.sec))}">A</i>`);
  if (n === 2) o.lt.forEach(p => b.push(`<i class="bd p${p + 1}" title="Saqueado este PI por ${esc(pname(p))}">S</i>`));
  if (n === 3 && o.tx) b.push('<i class="bd ti ti-broadcast" title="Transmitiendo"></i>');
  if (n === 4 && o.orb) b.push('<i class="bd orb ti ti-circle-dot" title="Ficha de Orbe"></i>');
  if (n === 5) [0, 1].forEach(p => { if (o.cl[p]) b.push(`<i class="bd p${p + 1}" title="Reclamación de ${esc(pname(p))}">R</i>`); });
  if (n === 6 && o.car != null) b.push(`<i class="bd p${o.car + 1} ti ti-hand-grab" title="Lo lleva ${esc(pname(o.car))}"></i>`);
  if (n === 7 && o.dl) b.push('<i class="bd ti ti-download" title="Descargado"></i>');
  if (n === 8 && o.dp) b.push(`<i class="bd" title="Puntos de Datos">${o.dp}</i>`);
  if (n === 9 && o.num) b.push(`<i class="bd num" title="Número">${o.num}</i>`);
  if (n === 9 && o.inert) b.push('<i class="bd ti ti-power" title="Inerte este PI"></i>');
  // fichas de operaciones tácticas ya reveladas
  [0, 1].forEach(p => {
    const P = S.players[p]; if (!P.tacShown) return;
    if (P.tac === 'martyrs' && o.mt[p]) b.push(`<i class="bd p${p + 1}" title="Fichas de Mártir">M${o.mt[p] > 1 ? o.mt[p] : ''}</i>`);
    if (P.tac === 'plant-devices' && o.dev[p]) b.push(`<i class="bd p${p + 1}" title="Ficha de Dispositivo">D</i>`);
    if (P.tac === 'sweep-clear' && o.clr[p]) b.push(`<i class="bd p${p + 1}" title="Limpio este PI">L</i>`);
    if (P.tac === 'sweep-clear' && o.swp) b.push('<i class="bd" title="Barrido">B</i>');
    if (P.tac === 'retrieval' && o.srch[p]) b.push(`<i class="bd p${p + 1} ti ti-check" title="Registrado"></i>`);
  });
  return b.join('');
}

function renderObjs() {
  const L = $('#objs'), g = geom();
  if (!L || !g) return;
  const tr = (x, y) => g.rot ? [100 - x, 100 - y] : [x, y];
  L.classList.toggle('adding', !!(pop && (pop.add || pop.move != null)));
  L.innerHTML = S.obj.map((o, k) => {
    const [x, y] = tr(o.x, o.y);
    const ctrl = o.ctrl == null ? '' : o.ctrl === 'd' ? 'cd' : 'c' + (o.ctrl + 1);
    const w = ownerOf(o.x, o.y, g.side);
    return `<button class="g-obj ${ctrl} ${o.inert && S.crit === 9 ? 'inert' : ''} ${pop?.k === k ? 'on' : ''}" data-obj="${k}" style="left:${x}%;top:${y}%" title="${esc(objName(o, g.side))}">
      <span class="tag">${w === 'c' ? 'C' : 'J' + (w + 1)}</span><span class="bds">${objBadges(o)}</span></button>`;
  }).join('') + (pop && pop.k != null && S.obj[pop.k] ? objPop(pop.k, tr) : '');
}

function objPop(k, tr) {
  const o = S.obj[k], g = geom(), n = S.crit;
  const [x, y] = tr(o.x, o.y);
  const seg = (field, val, opts) => `<div class="g-seg">${opts.map(([v, l, cls]) => `<button class="${cls || ''} ${JSON.stringify(val) === JSON.stringify(v) ? 'on' : ''}" data-of="${field}" data-ov='${JSON.stringify(v)}'>${l}</button>`).join('')}</div>`;
  const pl = [[0, esc(pname(0)), 'p1'], [1, esc(pname(1)), 'p2']];
  const tog = (field, p, label) => `<button class="p${p + 1} ${o[field][p] ? 'on' : ''}" data-ot="${field}" data-op="${p}">${label}</button>`;
  const rows = [];
  rows.push(['Control', seg('ctrl', o.ctrl, [[null, 'Nadie'], ...pl, ['d', 'Disputado']])]);
  if (n === 1) rows.push(['Asegurado por', seg('sec', o.sec, [[null, 'Nadie'], ...pl])]);
  if (n === 2) rows.push(['Saqueado este PI', `<div class="g-seg">${pl.map(([p, l, c]) => `<button class="${c} ${o.lt.includes(p) ? 'on' : ''}" data-ot="lt" data-op="${p}">${l}</button>`).join('')}</div>`]);
  if (n === 3) rows.push(['Transmitiendo', seg('tx', o.tx, [[false, 'No'], [true, 'Sí']])]);
  if (n === 4) rows.push(['Ficha de Orbe', seg('orb', o.orb, [[false, 'No'], [true, 'Aquí']])]);
  if (n === 5) rows.push(['Reclamación este PI', `<div class="g-seg">${pl.map(([p, l, c]) => `<button class="${c} ${o.cl[p] ? 'on' : ''}" data-ot="cl" data-op="${p}">${l}</button>`).join('')}</div>`]);
  if (n === 6) rows.push(['Lo lleva', seg('car', o.car, [[null, 'Nadie'], ...pl])]);
  if (n === 7) rows.push(['Descargado', seg('dl', o.dl, [[false, 'No'], [true, 'Sí']])]);
  if (n === 8) rows.push(['Puntos de Datos', `<div class="g-seg num"><button data-odp="-1" aria-label="Quitar">−</button><b>${o.dp}</b><button data-odp="1" aria-label="Añadir">+</button></div>`]);
  if (n === 9) {
    rows.push(['Número', seg('num', o.num, [[1, '1'], [2, '2'], [3, '3']])]);
    rows.push(['Inerte este PI', seg('inert', o.inert, [[false, 'No'], [true, 'Sí']])]);
  }
  [0, 1].forEach(p => {
    const P = S.players[p]; if (!P.tacShown) return;
    const who = `<small class="p${p + 1}">${esc(pname(p))}</small>`;
    if (P.tac === 'martyrs') rows.push(['Mártires ' + who, `<div class="g-seg num"><button data-omt="${p}" data-ov="-1">−</button><b>${o.mt[p]}</b><button data-omt="${p}" data-ov="1">+</button></div>`]);
    if (P.tac === 'plant-devices') rows.push(['Dispositivo ' + who, `<div class="g-seg">${tog('dev', p, o.dev[p] ? 'Sí' : 'No')}</div>`]);
    if (P.tac === 'sweep-clear') rows.push(['Barrer y limpiar ' + who, `<div class="g-seg">${tog('clr', p, 'Limpio')}<button class="${o.swp ? 'on' : ''}" data-of="swp" data-ov='${!o.swp}'>Barrido</button></div>`]);
    if (P.tac === 'retrieval') rows.push(['Registrado ' + who, `<div class="g-seg">${tog('srch', p, o.srch[p] ? 'Sí' : 'No')}</div>`]);
  });
  const hx = x > 58 ? 'right' : 'left', hy = y > 55 ? 'up' : 'down';
  return `<div class="g-pop ${hx} ${hy}" style="left:${x}%;top:${y}%" role="dialog">
    <div class="g-pop-hd"><b>${esc(objName(o, g.side))}</b><button class="x" data-objclose aria-label="Cerrar">×</button></div>
    ${rows.map(([l, c]) => `<div class="g-pop-row"><span>${l}</span>${c}</div>`).join('')}
    <div class="g-pop-ft"><button data-objmove><i class="ti ti-arrows-move"></i> Mover</button><button data-objdel><i class="ti ti-trash"></i> Quitar</button></div>
  </div>`;
}

function saveMapOverride() {
  const g = geom(); if (!g) return;
  const all = KT.store.get('marcadores', {}) || {};
  all[g.m.img] = S.obj.map(o => [Math.round(o.x * 10) / 10, Math.round(o.y * 10) / 10]);
  KT.store.set('marcadores', all);
}

function onObjsClick(e) {
  const L = $('#objs'), g = geom();
  if (!L || !g) return;
  const t = e.target.closest('button');
  // colocar (añadir o mover) tocando en el mapa
  if (pop && (pop.add || pop.move != null) && !t?.closest('.g-pop')) {
    const r = L.getBoundingClientRect();
    let x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
    if (g.rot) { x = 100 - x; y = 100 - y; }
    x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10;
    const mv = pop.move;
    commit(() => {
      if (mv != null) Object.assign(S.obj[mv], { x, y });
      else S.obj.push({ ...objTemplate(), x, y });
    }, { render: false });
    pop = mv != null ? { k: mv } : null;
    saveMapOverride(); renderBoard();
    KT.toast(mv != null ? 'Marcador movido · se recordará para este mapa' : 'Marcador añadido · se recordará para este mapa', { ms: 2000 });
    return;
  }
  if (!t) { if (pop) { pop = null; renderObjs(); } return; }
  if (t.dataset.obj != null) { const k = +t.dataset.obj; pop = pop?.k === k ? null : { k }; renderObjs(); return; }
  if (t.hasAttribute('data-objclose')) { pop = null; renderObjs(); return; }
  const k = pop?.k; if (k == null) return;
  const o = S.obj[k], d = t.dataset;
  if (t.hasAttribute('data-objmove')) { pop = { move: k }; renderObjs(); KT.toast('Toca en el mapa la nueva posición'); return; }
  if (t.hasAttribute('data-objdel')) {
    commit(() => { S.obj.splice(k, 1); }, { render: false }); pop = null; saveMapOverride(); renderBoard();
    KT.toast('Marcador quitado', { action: 'Deshacer', onAction: undo }); return;
  }
  commit(() => {
    if (d.of) {
      const v = JSON.parse(d.ov);
      if (d.of === 'orb' && v) S.obj.forEach(x => { x.orb = false; });
      o[d.of] = v;
    } else if (d.ot) {
      const p = +d.op;
      if (d.ot === 'lt') o.lt = o.lt.includes(p) ? o.lt.filter(x => x !== p) : [...o.lt, p];
      else if (d.ot === 'cl') { const was = o.cl[p]; S.obj.forEach(x => { delete x.cl[p]; }); if (!was) o.cl[p] = true; }
      else o[d.ot][p] = !o[d.ot][p];
    } else if (d.odp) o.dp = Math.max(0, o.dp + +d.odp);
    else if (d.omt != null) o.mt[+d.omt] = Math.max(0, o.mt[+d.omt] + +d.ov);
  }, { only: 'objs' });
}

function renderBar() {
  const cp = i => `
    <div class="g-cell p${i + 1}">
      <div class="lbl"><b>J${i + 1}</b> · <span class="l">Puntos de mando</span><span class="s">PM</span></div>
      <button class="pm" data-bar="cp" data-p="${i}" data-v="-1" aria-label="Restar PM">−</button>
      <div class="val" id="v-cp-${i}">${S.players[i].cp}</div>
      <button class="pm" data-bar="cp" data-p="${i}" data-v="1" aria-label="Sumar PM">+</button>
    </div>`;
  const vp = i => {
    const s = scoreOf(i);
    return `
    <button class="g-cell vp p${i + 1}" data-sheet="score" data-p="${i}" title="Puntuación por operación">
      <div class="lbl"><b>J${i + 1}</b> · <span class="l">Puntos de victoria</span><span class="s">PV</span></div>
      <div class="val" id="v-vp-${i}">${s.total}</div>
      <div class="brk"><span title="Op. crítica">C<b>${s.crit}</b></span><span title="Op. de eliminación">E<b>${s.kill}</b></span><span title="Op. táctica">T<b>${s.tac}</b></span>${s.prim ? `<span title="Op. principal">P<b>${s.prim}</b></span>` : ''}</div>
    </button>`;
  };
  const dots = Array.from({ length: MAX_TP }, (_, n) => `<button class="g-tp-dot ${!S.ended && n + 1 === S.tp ? 'on' : n + 1 < S.tp || S.ended ? 'done' : ''}" data-tp="${n + 1}">${n + 1}</button>`).join('');
  const ini = S.ini == null ? '—' : esc(pname(S.ini));
  $('#bar').innerHTML = `
    ${cp(0)}
    ${vp(0)}
    <div class="g-tp ${S.ended ? 'end' : ''}">
      <div class="lbl">${S.ended ? 'Fin de la batalla' : 'Punto de inflexión'}</div>
      <div class="g-tp-row">
        <button class="g-tp-dot" data-tpstep="-1" title="Anterior" aria-label="Punto de inflexión anterior"><i class="ti ti-chevron-left"></i></button>
        <div class="g-tp-dots">${dots}</div>
        <button class="g-tp-dot ${S.tp === MAX_TP && !S.ended ? 'fin' : ''}" data-tpstep="1" title="${S.tp === MAX_TP ? 'Terminar la batalla' : 'Siguiente (reinicia activaciones)'}" aria-label="Siguiente punto de inflexión"><i class="ti ti-${S.tp === MAX_TP ? 'flag' : 'chevron-right'}"></i></button>
      </div>
      <button class="g-ini ${S.ini == null ? '' : 'p' + (S.ini + 1)}" data-ini title="Cambiar quién tiene la iniciativa">Iniciativa: <b>${ini}</b></button>
    </div>
    ${cp(1)}
    ${vp(1)}`;
}

// ── Ardides ──────────────────────────────────────────────────
function ployList(P) {
  const f = FACTIONS[P.factionId];
  const zero = new Set(P.ploys0 || []);
  const L = [];
  (f.pl?.s || []).forEach(p => L.push({ n: p.n, t: p.t, k: 's', cost: zero.has(p.n) ? 0 : 1 }));
  (f.pl?.f || []).forEach(p => L.push({ n: p.n, t: p.t, k: 'f', cost: zero.has(p.n) ? 0 : 1 }));
  L.push({ n: 'Repetición de mando', t: 'Ardid de tiroteo universal. Úsalo tras tirar los dados de ataque o defensa: repite uno de tus dados.', k: 'f', cost: 1, uni: true });
  return L;
}

// ── Reglas de arma y equipo al tocar ─────────────────────────
function localKw(f) {
  const out = {};
  (f.frs || []).forEach(r => { if (r.text) out[r.name] = { cat: 'Regla de facción', t: r.text }; });
  f.ops.forEach(o => o.ru.forEach(r => { if (!out[r.n]) out[r.n] = { cat: 'Regla · ' + o.name, t: r.t }; }));
  return out;
}
function ruleInfo(rule, f) {
  const base = rule.replace(/\*$/, '').replace(/\s*[\d"”x+\/]+"?\s*$/, '').trim();
  const L = localKw(f);
  const lk = Object.keys(L).find(k => k.toLowerCase() === base.toLowerCase());
  if (lk) return { n: rule, ...L[lk] };
  const gk = Object.keys(KEYWORDS).filter(k => base.toLowerCase().startsWith(k.toLowerCase())).sort((a, b) => b.length - a.length)[0];
  return gk ? { n: rule, ...KEYWORDS[gk] } : { n: rule, cat: 'Regla de arma', t: 'Sin definición en el glosario.' };
}
let tipEl = null;
function showTip(anchor, title, cat, text, key) {
  if (tipEl && tipEl.dataset.key === key) { hideTip(); return; }
  hideTip();
  tipEl = document.createElement('div');
  tipEl.className = 'g-tip';
  tipEl.dataset.key = key || '';
  tipEl.innerHTML = `<small>${esc(cat || '')}</small><b>${esc(title)}</b><p>${esc(text || '')}</p>`;
  document.body.appendChild(tipEl);
  const r = anchor.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  const x = Math.min(innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2));
  let y = r.bottom + 6; if (y + h > innerHeight - 8) y = r.top - h - 6;
  Object.assign(tipEl.style, { left: x + 'px', top: Math.max(8, y) + 'px' });
}
function hideTip() { tipEl?.remove(); tipEl = null; }

// ── Hoja de detalles ─────────────────────────────────────────
function openSheet(kind, i = null) { hideTip(); sheet = { kind, i, peek: false, all: false }; renderSheet(); $('#sheet').classList.add('on'); }
function closeSheet() { sheet = null; $('#sheet').classList.remove('on'); }

const lines = a => (a || []).map(l => `<p class="${l.startsWith('•') ? 'b' : ''}">${esc(l.replace(/^•\s*/, ''))}</p>`).join('');
const acc = a => (a || []).map(x => `
  <div class="g-act"><div class="g-act-hd"><b>${esc(x.n)}</b><span>${x.pa}PA</span></div>
    ${x.ef.map(e => e.startsWith('•') ? `<p class="b">${esc(e.slice(1).trim())}</p>` : `<p class="ef">${esc(e)}</p>`).join('')}
    ${x.no ? `<p class="no">${esc(x.no)}</p>` : ''}</div>`).join('');
function opBody(o) {
  return `
    ${o.revelar ? `<h4>Revelar</h4><p>${esc(o.revelar)}</p>` : ''}
    ${o.reglas ? `<h4>Reglas adicionales</h4>${lines(o.reglas)}` : ''}
    ${o.acciones ? `<h4>Acción de misión</h4>${acc(o.acciones)}` : ''}
    <h4>Puntos de victoria</h4>${lines(o.pv)}
    <button class="icon-btn g-orig" data-img="${o.img}"><i class="ti ti-cards"></i> Carta original (inglés)</button>`;
}
function tacPicker(P, all, selected) {
  const arq = archetypes(P);
  const avail = all || !arq.length ? OPS.tac : OPS.tac.filter(x => arq.includes(x.arq));
  const groups = ARQ.filter(a => avail.some(x => x.arq === a));
  return `
    <p class="g-hint">Arquetipos de ${esc(FACTIONS[P.factionId].name)}: <b>${esc(arq.join(' · ') || '—')}</b></p>
    ${groups.map(a => `<h4>${esc(a)}</h4><div class="g-pick">${avail.filter(x => x.arq === a).map(x => `<button class="${x.id === selected ? 'on' : ''}" data-tac="${x.id}">${esc(x.name)}<small>${esc(x.revelar)}</small></button>`).join('')}</div>`).join('')}
    ${arq.length ? `<label class="g-check"><input type="checkbox" data-all ${all ? 'checked' : ''}> Mostrar todas las operaciones tácticas</label>` : ''}`;
}

function renderSheet() {
  const T = $('#sheet-t'), B = $('#sheet-body'), k = sheet.kind, i = sheet.i;
  const box = $('#sheet .g-sheet-box');
  box.style.setProperty('--pc', i == null || isNaN(i) ? 'var(--orange)' : `var(--p${i + 1})`);
  if (k === 'crit') {
    const c = critOf(S.crit);
    T.innerHTML = c ? `<small>Operación crítica ${c.n}</small>${esc(c.name)}` : '<small>Operación crítica</small>Elegir';
    const list = `<div class="g-pick crit">${OPS.crit.map(x => `<button class="${x.n === S.crit ? 'on' : ''}" data-crit="${x.n}"><b>${x.n}</b>${esc(x.name)}</button>`).join('')}</div>`;
    B.innerHTML = c ? opBody(c) + `<p class="g-hint">Toca cada marcador de objetivo en el mapa para marcar quién lo controla y su estado en esta operación.</p><details class="g-more"><summary>Cambiar operación crítica</summary>${list}</details>` : list;
  } else if (k === 'tac') {
    const P = S.players[i], t = tacOf(P.tac);
    T.innerHTML = `<small>${esc(pname(i))} · operación táctica</small>${t && (P.tacShown || sheet.peek) ? esc(t.name) : t ? 'Oculta' : 'Elegir'}`;
    const list = `<p class="g-hint">Se elige en secreto al revelar los agentes.</p>` + tacPicker(P, sheet.all, P.tac);
    if (!t) B.innerHTML = list;
    else if (!P.tacShown && !sheet.peek) B.innerHTML = `
      <div class="g-secret"><i class="ti ti-lock"></i><p>Operación táctica de <b>${esc(pname(i))}</b> oculta.</p>
        <button class="icon-btn accent" data-peek><i class="ti ti-eye"></i> Ver (solo ${esc(pname(i))})</button></div>`;
    else B.innerHTML = `
      <div class="g-row"><span class="g-arq">${esc(t.arq)}</span><span style="flex:1"></span>
        <button class="icon-btn ${P.tacShown ? '' : 'accent'}" data-reveal>${P.tacShown ? '<i class="ti ti-lock"></i> Volver a ocultar' : '<i class="ti ti-eye"></i> Revelar a ambos'}</button></div>
      ${opBody(t)}
      <details class="g-more"><summary>Cambiar operación táctica</summary>${list}</details>`;
  } else if (k === 'ploys') {
    const P = S.players[i], L = ployList(P);
    T.innerHTML = `<small>${esc(pname(i))} · ${P.cp} PM disponibles</small>Ardides`;
    const item = p => {
      const used = P.ployUsed[p.n] === S.tp;
      return `<div class="g-ploy ${used ? 'used' : ''}">
        <details><summary><b>${esc(p.n)}</b>${p.uni ? '<small>universal</small>' : ''}${p.cost === 0 ? '<small class="z">0PM</small>' : ''}${used ? '<small class="u">usado este PI</small>' : ''}</summary><p>${esc(p.t)}</p></details>
        <button class="icon-btn ${used ? '' : 'accent'}" data-ploy="${esc(p.n)}" data-cost="${p.cost}" ${P.cp < p.cost ? 'disabled' : ''}>${used ? 'Otra vez' : 'Usar'} · ${p.cost}PM</button></div>`;
    };
    B.innerHTML = `
      <h4>Estratégicos <small>(fase de estrategia, como GAMBITO ESTRATÉGICO)</small></h4>${L.filter(p => p.k === 's').map(item).join('') || '<p class="g-hint">—</p>'}
      <h4>De tiroteo</h4>${L.filter(p => p.k === 'f').map(item).join('')}
      <p class="g-hint">Al usar un ardid se descuentan sus PM y queda marcado en este punto de inflexión. Por norma general, cada ardid solo puede usarse una vez por punto de inflexión.</p>`;
  } else if (k === 'score') {
    const P = S.players[i], s = scoreOf(i), kk = s.k, c = critOf(S.crit), t = tacOf(P.tac);
    T.innerHTML = `<small>${esc(pname(i))} · puntos de victoria</small><span class="g-total">${s.total} PV</span>`;
    const row = (key, name, sub, val, ctrl) => `
      <div class="g-srow ${P.prim === key && (S.ended || sheet.peek) ? 'prim' : ''}">
        <div class="n"><b>${name}</b><small>${sub}</small></div>
        ${ctrl}
        <div class="g-sbar"><span style="--p:${Math.min(6, val) / 6 * 100}%"></span></div>
      </div>`;
    const pmc = (op, v) => `<div class="g-spm"><button data-sc="${op}" data-v="-1" aria-label="Restar">−</button><b>${v}</b><button data-sc="${op}" data-v="1" aria-label="Sumar">+</button></div>`;
    const showPrim = S.ended || sheet.peek;
    B.innerHTML = `
      ${row('crit', 'Operación crítica', c ? esc(c.n + '. ' + c.name) : 'sin elegir', s.crit, pmc('crit', s.crit))}
      ${row('kill', 'Operación de eliminación', `Grado ${kk.grade}/5 · ${kk.dead} de ${kk.start} enemigos incapacitados${kk.next != null ? ` · siguiente grado con ${kk.next}` : ''}${s.bonus ? ' · +1 por grado mayor' : ''}${kk.adj ? ` · ajuste ${kk.adj > 0 ? '+' : ''}${kk.adj}` : ''}`, s.kill,
        `<div class="g-spm" title="Ajuste manual del grado (agentes que no cuentan, etc.)"><button data-sc="killAdj" data-v="-1" aria-label="Bajar grado">−</button><b>${s.kill}</b><button data-sc="killAdj" data-v="1" aria-label="Subir grado">+</button></div>`)}
      ${row('tac', 'Operación táctica', t ? (P.tacShown || sheet.peek ? esc(t.name) : 'oculta') : 'sin elegir', s.tac, pmc('tac', s.tac))}
      <h4>Operación principal <small>(gambito estratégico del PI 1, secreta)</small></h4>
      ${showPrim || !P.prim
        ? `<div class="g-pick prim">${['crit', 'kill', 'tac'].map((o, n) => `<button class="${P.prim === o ? 'on' : ''}" data-prim="${o}"><b>${n + 1}</b>${OPN[o].replace('Op. ', '')}</button>`).join('')}</div>`
        : `<div class="g-secret sm"><i class="ti ti-lock"></i><p>Elegida y oculta hasta el final.</p><button class="icon-btn" data-peek><i class="ti ti-eye"></i> Ver / cambiar</button></div>`}
      <p class="g-hint">${S.ended ? (P.prim ? `Bonificación: la mitad de ${s[P.prim]} PV de la ${OPN[P.prim].toLowerCase()} → <b>+${s.prim} PV</b>.` : 'No se eligió operación principal.') : 'Al final de la batalla suma la mitad (redondeando hacia arriba) de lo puntuado con ella.'} Máximo 6PV por operación.</p>
      <div class="g-stot"><span>Total</span><b>${s.total}</b></div>`;
  } else if (k === 'seq') {
    T.innerHTML = '<small>Operaciones aprobadas 2025</small>Secuencia de juego';
    B.innerHTML = OPS.secuencia.map((s, n) => `<h4>${n + 1}. ${esc(s.t)}</h4>${s.p.map(p => `<p class="b">${esc(p)}</p>`).join('')}`).join('') + `
      <h4>Cartas de iniciativa</h4>
      <div class="g-inis">${OPS.iniciativa.map(c => `<div><b>${esc(c.name)}</b><small>${esc(c.sub)}</small><p>${esc(c.txt)}</p></div>`).join('')}</div>
      <h4>Operación de eliminación</h4><p>${esc(OPS.kill.txt)}</p>
      <table class="g-ktab"><tr><th>Enemigos</th>${[1, 2, 3, 4, 5].map(g => `<th>G${g}</th>`).join('')}</tr>
        ${Object.entries(OPS.kill.tabla).map(([n, r]) => `<tr class="${S.players.some(P => P.ops.length === +n) ? 'on' : ''}"><td>${n}</td>${r.map(v => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>
      <h4>Operación principal</h4><p>${esc(OPS.primaria.txt)}</p>
      <button class="icon-btn g-orig" data-img="imagenes/misiones/secuencia.webp"><i class="ti ti-cards"></i> Carta original (inglés)</button>`;
  } else if (k === 'keys') {
    const z = zoneOf(S.zone);
    T.innerHTML = `<small>Leyenda del terreno</small>${esc(z.name)}`;
    B.innerHTML = `<div class="g-keys">${z.claves.map(src => `<button data-img="${src}"><img src="${src}" alt="Leyenda de ${esc(z.name)}" loading="lazy"></button>`).join('')}</div>`;
  } else if (k === 'end') {
    const s = [scoreOf(0), scoreOf(1)];
    const win = s[0].total === s[1].total ? null : s[0].total > s[1].total ? 0 : 1;
    T.innerHTML = `<small>Fin de la batalla</small>${win == null ? 'Empate' : 'Gana ' + esc(pname(win))}`;
    B.innerHTML = `
      <table class="g-res"><tr><th></th><th class="p1">${esc(pname(0))}</th><th class="p2">${esc(pname(1))}</th></tr>
        ${[['crit', 'Op. crítica'], ['kill', 'Op. de eliminación'], ['tac', 'Op. táctica']].map(([o, n]) => `<tr><td>${n}</td>${[0, 1].map(j => `<td>${s[j][o]}${S.players[j].prim === o ? ' <i class="ti ti-star" title="Principal"></i>' : ''}</td>`).join('')}</tr>`).join('')}
        <tr><td>Op. principal (½)</td>${[0, 1].map(j => `<td>+${s[j].prim}</td>`).join('')}</tr>
        <tr class="tot"><td>Total</td>${[0, 1].map(j => `<td>${s[j].total}</td>`).join('')}</tr></table>
      ${S.players.some(P => !P.prim) ? '<p class="g-hint">Algún jugador no tiene operación principal elegida: ábrela desde su puntuación.</p>' : ''}
      <div class="g-row"><button class="icon-btn" data-sheet-go="score" data-p="0">Puntuación J1</button><button class="icon-btn" data-sheet-go="score" data-p="1">Puntuación J2</button><span style="flex:1"></span><button class="icon-btn accent" data-newgame><i class="ti ti-refresh"></i> Nueva partida</button></div>`;
  }
}

function onSheetClick(e) {
  const t = e.target.closest('button, input');
  if (!t) return;
  const i = sheet.i, P = i != null && !isNaN(i) ? S.players[i] : null, d = t.dataset;
  if (d.img) { openViewer(d.img); return; }
  if (d.crit) {
    commit(() => { S.crit = +d.crit; critSetup(S.obj, S.crit); });
  }
  else if (d.tac) { commit(() => { P.tac = d.tac; P.tacShown = false; }, { only: i }); sheet.peek = true; renderSheet(); }
  else if (t.hasAttribute('data-peek')) { sheet.peek = true; renderSheet(); }
  else if (t.hasAttribute('data-all')) { sheet.all = t.checked; renderSheet(); }
  else if (t.hasAttribute('data-reveal')) { commit(() => { P.tacShown = !P.tacShown; }, { only: i }); renderObjs(); }
  else if (d.prim) commit(() => { P.prim = P.prim === d.prim ? null : d.prim; }, { only: i });
  else if (d.ploy) {
    const cost = +d.cost;
    if (P.cp < cost) { KT.toast('No quedan PM suficientes', { type: 'err' }); return; }
    commit(() => { P.cp -= cost; P.ployUsed[d.ploy] = S.tp; }, { only: i });
    KT.toast(`${esc(pname(i))} usa «${d.ploy}»${cost ? ` (−${cost}PM)` : ''}`, { type: 'ok', action: 'Deshacer', onAction: undo });
    KT.bump($(`#v-cp-${i}`));
  }
  else if (d.sc) {
    const v = +d.v;
    if (d.sc === 'killAdj') {
      const g = killInfo(i).grade;
      if ((v < 0 && g <= 0) || (v > 0 && g >= 5)) return;
      commit(() => { P.score.killAdj += v; }, { only: 'bar' });
    } else {
      const nv = P.score[d.sc] + v;
      if (nv < 0) return;
      if (nv > 6) { KT.toast('Máximo 6PV por operación'); return; }
      commit(() => { P.score[d.sc] = nv; }, { only: 'bar' });
    }
  } else if (d.sheetGo) openSheet(d.sheetGo, +d.p);
  else if (t.hasAttribute('data-newgame')) { closeSheet(); draft = null; openSetup(); }
}

// ── Interacción (delegada) ───────────────────────────────────
function onColClick(e) {
  const rl = e.target.closest('[data-rule]');
  if (rl) {
    const i = +rl.closest('.g-op').dataset.p, info = ruleInfo(rl.dataset.rule, FACTIONS[S.players[i].factionId]);
    showTip(rl, info.n, info.cat, info.t, 'r:' + rl.dataset.rule); return;
  }
  const te = e.target.closest('[data-tipeq], [data-tipploy]');
  if (te) {
    const i = +te.closest('.g-col').id.slice(-1), f = FACTIONS[S.players[i].factionId];
    if (te.dataset.tipeq) { const it = eqOptions(f).all.find(x => x.id === te.dataset.tipeq); showTip(te, it?.n || te.dataset.tipeq, 'Equipo', it?.t || '', 'e:' + te.dataset.tipeq); }
    else { const p = ployList(S.players[i]).find(x => x.n === te.dataset.tipploy); showTip(te, te.dataset.tipploy, 'Ardid a 0PM', p?.t || '', 'p:' + te.dataset.tipploy); }
    return;
  }
  const sh = e.target.closest('[data-sheet]');
  if (sh) { openSheet(sh.dataset.sheet, +sh.dataset.p); return; }
  const cd = e.target.closest('[data-card]');
  if (cd) {
    const i = +cd.closest('.g-col').id.slice(-1), id = cd.dataset.card;
    commit(() => { const c = S.players[i].cards; c[id] = (c[id] + 1) % 3; }, { only: i });
    return;
  }
  const b = e.target.closest('[data-act]');
  if (!b || e.target.closest('details')) return;
  const card = b.closest('.g-op');
  const i = +card.dataset.p, uid = card.dataset.u;
  const P = S.players[i], o = P.ops.find(x => x.uid === uid);
  const act = b.dataset.act;
  if (act === 'open') {                     // sin historial: es solo vista
    o.open = !o.open; save();
    card.classList.toggle('open', o.open);
    return;
  }
  const g0 = killInfo(1 - i).grade;
  commit(() => {
    if (act === 'order') o.order = o.order === 'engage' ? 'conceal' : 'engage';
    if (act === 'used') o.used = !o.used;
    if (act === 'dmg') {
      const max = opData(P, o).s.h;
      const before = o.w;
      o.w = Math.max(0, Math.min(max, o.w - +b.dataset.v));
      if (before > 0 && o.w === 0) KT.toast(`${esc(o.label || opData(P, o).name)} incapacitado`, { type: 'err', action: 'Deshacer', onAction: undo });
    }
  }, { only: i });
  const g1 = killInfo(1 - i).grade;
  if (g1 > g0) setTimeout(() => KT.toast(`${esc(pname(1 - i))}: grado de eliminación ${g1} (+1PV)`, { type: 'ok' }), 350);
  const el = document.querySelector(`.g-op[data-u="${uid}"][data-p="${i}"] .g-op-w`);
  if (act === 'dmg') KT.bump(el);
}

function onBarClick(e) {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.sheet) { openSheet(t.dataset.sheet, +t.dataset.p); return; }
  if (t.dataset.bar) {
    const i = +t.dataset.p, k = t.dataset.bar, d = +t.dataset.v;
    if (S.players[i][k] + d < 0) return;
    commit(() => { S.players[i][k] += d; }, { only: 'bar' });
    KT.bump($(`#v-${k}-${i}`));
  } else if (t.dataset.tp) {
    setTP(+t.dataset.tp);
  } else if (t.dataset.tpstep) {
    setTP(S.tp + (S.ended && +t.dataset.tpstep < 0 ? 0 : +t.dataset.tpstep));
  } else if (t.hasAttribute('data-ini')) {
    commit(() => { S.ini = S.ini == null ? 0 : S.ini === 0 ? 1 : null; }, { only: 'bar' });
  }
}

function onBoardClick(e) {
  if (e.target.closest('#objs')) { onObjsClick(e); return; }
  if (e.target.id === 'board-img') { if (pop) { pop = null; renderBoard(); return; } openViewer(); return; }
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.sheet) openSheet(t.dataset.sheet);
  else if (t.hasAttribute('data-flip')) commit(() => { S.rot = !S.rot; }, { only: 'board' });
  else if (t.hasAttribute('data-addobj')) {
    pop = pop?.add ? null : { add: true };
    renderBoard();
    if (pop) KT.toast('Toca en el mapa donde está el marcador');
  }
}

function setTP(n) {
  if (S.ended) {                                  // reabrir la batalla
    if (n > MAX_TP) { openSheet('end'); return; }
    commit(() => { S.ended = false; S.tp = Math.min(n, MAX_TP); });
    return;
  }
  if (n > MAX_TP) {
    commit(() => { S.ended = true; });
    openSheet('end');
    return;
  }
  if (n < 1 || n === S.tp) return;
  const forward = n > S.tp;
  commit(() => {
    S.tp = n;
    if (forward) {
      S.players.forEach(P => P.ops.forEach(o => { o.used = false; }));
      // estados de marcador que duran un punto de inflexión
      S.obj.forEach(o => { o.tx = false; o.lt = []; o.inert = false; o.cl = {}; o.clr = [false, false]; o.swp = false; });
    }
  });
  if (forward) KT.toast(`Punto de inflexión ${n} · activaciones reiniciadas`, { action: 'Deshacer', onAction: undo });
}

// ── Visor de imágenes con zoom y desplazamiento ──────────────
function openViewer(src) {
  const own = !src, img = $('#board-img');
  src = src || img?.src; if (!src) return;
  const v = $('#viewer'), vi = $('#viewer-img');
  vi.onload = null;
  vi.src = src;
  const flip = own && !!geom()?.rot;
  v.classList.add('on');
  let sc = 1, tx = 0, ty = 0;
  const fit = () => {
    sc = Math.min(innerWidth / vi.naturalWidth, innerHeight / vi.naturalHeight) * .95;
    tx = -vi.naturalWidth * sc / 2; ty = -vi.naturalHeight * sc / 2; apply();
  };
  const apply = () => { vi.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})` + (flip ? ` translate(${vi.naturalWidth}px, ${vi.naturalHeight}px) rotate(180deg)` : ''); };
  vi.complete && vi.naturalWidth ? fit() : (vi.onload = fit);
  const pts = new Map(); let last = null, lastDist = 0;
  v.onwheel = e => {
    e.preventDefault();
    const k = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const cx = e.clientX - innerWidth / 2, cy = e.clientY - innerHeight / 2;
    tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k; sc *= k; apply();
  };
  v.onpointerdown = e => { if (e.target.closest('.g-vtools')) return; v.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; lastDist = 0; };
  v.onpointermove = e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (lastDist) {
        const k = d / lastDist, cx = (a[0] + b[0]) / 2 - innerWidth / 2, cy = (a[1] + b[1]) / 2 - innerHeight / 2;
        tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k; sc *= k; apply();
      }
      lastDist = d;
    } else if (last) {
      tx += e.clientX - last[0]; ty += e.clientY - last[1]; last = [e.clientX, e.clientY]; apply();
    }
  };
  v.onpointerup = v.onpointercancel = e => { pts.delete(e.pointerId); lastDist = 0; last = pts.size ? [...pts.values()][0] : null; };
  v.ondblclick = fit;
  $('#viewer-fit').onclick = fit;
}
function closeViewer() { $('#viewer').classList.remove('on'); }

// ════════════════════════════════════════════════════════════
//  PREPARACIÓN — secuencia guiada (por defecto) o panel rápido
// ════════════════════════════════════════════════════════════
const STEPS = [
  { id: 'jug', t: 'Jugadores', ico: 'users' },
  { id: 'mis', t: 'Misión', ico: 'map-2' },
  { id: 'ini', t: 'Iniciativa', ico: 'dice-5' },
  { id: 'age', t: 'Agentes y equipo', ico: 'shield' },
  { id: 'tac', t: 'Op. tácticas', ico: 'target-arrow' },
  { id: 'des', t: 'Despliegue', ico: 'flag' },
  { id: 'pi1', t: 'PI 1', ico: 'swords' },
];

function newDraft() {
  const z = zoneOf(S?.zone) || ZONAS[0];
  return {
    mode: 'wiz', step: 0,
    names: S ? S.players.map(p => p.name) : ['', ''],
    src: S ? S.players.map(p => p.src) : [null, null],
    zone: z.id, map: mapOf(z, S?.map) ? S.map : z.maps[0].id, crit: S?.crit ?? null,
    roll: null, win0: null, ini0: null, dzPick: null,        // tirada de preparación y zona de despliegue
    players: null, built: null,
    tac: [null, null], tacAll: [false, false], cover: null,   // cover: jugador que está eligiendo en secreto
    roll1: null, win1: null, ini1: null, prim: [null, null], primCover: null,
  };
}

function openSetup() {
  const rosters = KT.store.get('rosters', []) || [];
  closeSheet(); hideTip();
  draft = draft || newDraft();
  // ?p1=<id> desde el constructor
  const q = new URLSearchParams(location.search).get('p1');
  if (q && rosters.some(r => r.id === q) && !draft.src[0]) draft.src[0] = { kind: 'roster', id: q };
  renderSetup();
  $('#setup').classList.add('on');
}

function renderSetup() {
  $('#btn-mode').innerHTML = draft.mode === 'wiz' ? '<i class="ti ti-layout-columns"></i><span class="hide-sm">Saltar al panel</span>' : '<i class="ti ti-list-numbers"></i><span class="hide-sm">Preparación guiada</span>';
  $('#btn-close-setup').style.display = S && S.started ? '' : 'none';
  if (draft.mode === 'panel') renderPanel(); else renderWizard();
}

// ── Bloques compartidos ──
function playerPicker(i) {
  const rosters = KT.store.get('rosters', []) || [];
  const isOn = s => draft.src[i] && draft.src[i].kind === s.kind && draft.src[i].id === s.id;
  const rost = rosters.length ? rosters.map(r => {
    const f = FACTIONS[r.factionId]; if (!f) return '';
    const n = r.ops.reduce((a, o) => a + o.qty, 0);
    return `<button class="g-opt ${isOn({ kind: 'roster', id: r.id }) ? 'on' : ''}" data-src="${i}" data-kind="roster" data-id="${r.id}">
      <img src="${f.img}" alt=""><span class="o"><b>${esc(r.name)}</b><small>${esc(f.name)} · ${n} agentes</small></span></button>`;
  }).join('') : `<div class="g-note">Aún no tienes comandos guardados. <a href="builder.html" style="color:var(--orange)">Crea uno en el constructor</a> o elige un comando completo abajo.</div>`;
  const full = Object.values(FACTIONS).map(f => `<button class="g-opt ${isOn({ kind: 'faction', id: f.id }) ? 'on' : ''}" data-src="${i}" data-kind="faction" data-id="${f.id}">
      <img src="${f.img}" alt=""><span class="o"><b>${esc(f.name)}</b><small>Todos los agentes (${f.ops.length})</small></span></button>`).join('');
  return `
    <div class="g-sp p${i + 1}">
      <div class="g-sp-hd"><span class="t">J${i + 1}</span><input value="${esc(draft.names[i])}" placeholder="Jugador ${i + 1}" data-name="${i}" aria-label="Nombre del jugador ${i + 1}"></div>
      <div class="g-sp-list">
        <div class="g-sp-sec">Mis comandos</div>${rost}
        <div class="g-sp-sec">Comando completo</div>${full}
      </div>
    </div>`;
}
function missionPicker(withCritDesc) {
  const z = zoneOf(draft.zone) || ZONAS[0];
  const mapBtn = m => `<button class="g-map ${m.id === draft.map ? 'on' : ''} ${m.old ? 'old' : ''}" data-map="${m.id}" aria-label="Mapa ${m.label}"><img src="${m.img}" alt="" loading="lazy"><span>${esc(m.label)}</span></button>`;
  const fresh = z.maps.filter(m => !m.old), old = z.maps.filter(m => m.old);
  const c = critOf(draft.crit);
  return `
    <div class="g-sp-sec">Zona de aniquilación</div>
    <div class="g-zones">${ZONAS.map(x => `<button class="g-zone ${x.id === z.id ? 'on' : ''}" data-zone="${x.id}">${esc(x.name)}</button>`).join('')}</div>
    <div class="g-sp-sec">Mapa · Operaciones aprobadas 2025</div>
    <div class="g-maps">${fresh.map(mapBtn).join('')}</div>
    ${old.length ? `<details class="g-old"><summary class="g-sp-sec">Mapas de la temporada anterior (${old.length})</summary><div class="g-maps">${old.map(mapBtn).join('')}</div></details>` : ''}
    <div class="g-sp-sec">Operación crítica</div>
    <div class="g-crits">${OPS.crit.map(x => `<button class="g-zone ${x.n === draft.crit ? 'on' : ''}" data-crit="${x.n}" title="${esc(x.en)}"><b>${x.n}</b> ${esc(x.name)}</button>`).join('')}</div>
    ${withCritDesc && c ? `<div class="g-wz-crit"><b>${c.n}. ${esc(c.name)}</b>${c.acciones ? `<span>Acción: ${c.acciones.map(a => esc(a.n) + ' (' + a.pa + 'PA)').join(', ')}</span>` : ''}${lines(c.pv)}</div>` : ''}`;
}

// ── Panel rápido (todo en una pantalla) ──
function renderPanel() {
  const mission = `
    <div class="g-sp mis">
      <div class="g-sp-hd"><span class="t" style="color:var(--text-2)">Misión</span><span style="flex:1"></span>
        <button class="icon-btn ripple" data-rnd title="Zona, mapa y operación crítica al azar"><i class="ti ti-dice-5"></i> Aleatorio</button></div>
      <div class="g-sp-list">${missionPicker(false)}
        <div class="g-note">Las operaciones tácticas y la principal se eligen en secreto ya en la partida, desde la columna de cada jugador.</div>
      </div>
    </div>`;
  $('#setup-body').className = 'g-setup-body';
  $('#setup-body').innerHTML = playerPicker(0) + mission + playerPicker(1);
  const ok = draft.src[0] && draft.src[1];
  const z = zoneOf(draft.zone), m = mapOf(z, draft.map), c = critOf(draft.crit);
  $('#setup-ft').innerHTML = `
    <span class="sp">${ok ? `${esc(z.name)} · mapa ${m ? esc(m.label) : '—'} · ${c ? 'Op. crítica: ' + esc(c.name) : 'sin operación crítica'}` : 'Elige un comando para cada jugador'}</span>
    <button class="icon-btn accent ripple" id="btn-start" data-start ${ok ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px"><i class="ti ti-swords"></i> Empezar partida</button>`;
}

// ── Secuencia guiada ──
function ensurePlayers() {
  const key = JSON.stringify(draft.src);
  if (draft.players && draft.built === key) return true;
  const pl = [0, 1].map(i => draft.src[i] && buildPlayer(draft.src[i], draft.names[i].trim()));
  if (pl.some(p => !p)) return false;
  pl.forEach(P => P.ops.forEach(o => { o.inc = true; }));
  draft.players = pl; draft.built = key; draft.tac = [null, null]; draft.prim = [null, null];
  return true;
}
function stepOk(n) {
  const id = STEPS[n].id;
  if (id === 'jug') return !!(draft.src[0] && draft.src[1]);
  if (id === 'mis') return !!(mapOf(zoneOf(draft.zone), draft.map) && draft.crit);
  if (id === 'ini') return draft.ini0 != null && draft.dzPick != null;
  if (id === 'age') return !!(draft.players && draft.built === JSON.stringify(draft.src) && draft.players.every(P => P.ops.some(o => o.inc)));
  if (id === 'tac') return draft.tac.every(Boolean);
  if (id === 'des') return true;
  if (id === 'pi1') return draft.ini1 != null && draft.prim.every(Boolean);
  return true;
}
const stepHint = {
  jug: 'Elige un comando para cada jugador',
  mis: 'Elige mapa y operación crítica (o pulsa Aleatorio)',
  ini: 'Indica quién tiene la iniciativa y qué zona de despliegue elige',
  age: 'Cada jugador necesita al menos un agente',
  tac: 'Cada jugador debe elegir su operación táctica en secreto',
  pi1: 'Falta la iniciativa del PI 1 o alguna operación principal',
};

function diceRow(roll, label) {
  const die = v => `<span class="g-die ${v ? '' : 'empty'}">${v || '?'}</span>`;
  return `<div class="g-dice"><span class="p1">${esc(pname(0))}</span>${die(roll?.[0])}<small>vs</small>${die(roll?.[1])}<span class="p2">${esc(pname(1))}</span>
    <button class="icon-btn accent ripple" data-roll="${label}"><i class="ti ti-dice-5"></i> Tirar</button></div>`;
}
const pbtn = (attr, cur) => [0, 1].map(p => `<button class="g-pbtn p${p + 1} ${cur === p ? 'on' : ''}" data-${attr}="${p}">${esc(pname(p))}</button>`).join('');

function mapPreview(dzPlayer) {
  const z = zoneOf(draft.zone), m = mapOf(z, draft.map);
  if (!m) return '';
  const info = mapInfo(m.img);
  const lab = (p, side) => `<span class="g-dz s-${side} p${p + 1}">${esc(pname(p))}</span>`;
  const sides = dzPlayer == null
    ? `<span class="g-dz s-${info.j1} or">Zona naranja</span><span class="g-dz s-${OPP[info.j1]} gr">Zona contraria</span>`
    : lab(dzPlayer, info.j1) + lab(1 - dzPlayer, OPP[info.j1]);
  return `<div class="g-prev"><img src="${m.img}" alt="Mapa ${esc(m.label)}">${sides}${info.o.map(([x, y]) => `<i class="g-prev-o" style="left:${x}%;top:${y}%"></i>`).join('')}</div>`;
}

function renderWizard() {
  const n = draft.step, id = STEPS[n].id;
  const bar = `<div class="g-steps">${STEPS.map((s, k) => {
    const reach = k <= n || STEPS.slice(0, k).every((_, j) => stepOk(j));
    return `<button class="g-step ${k === n ? 'on' : k < n ? 'done' : ''}" data-step="${k}" ${reach ? '' : 'disabled'}><b>${k < n ? '<i class="ti ti-check"></i>' : k + 1}</b><span>${s.t}</span></button>`;
  }).join('')}</div>`;
  let body = '';
  if (id === 'jug') {
    body = `<p class="g-wz-lead">Elegid los equipos. Podéis usar un comando guardado del constructor o el comando completo de una facción.</p>
      <div class="g-wz-2">${playerPicker(0)}${playerPicker(1)}</div>`;
  } else if (id === 'mis') {
    body = `<div class="g-wz-head"><p class="g-wz-lead">Montad la zona de aniquilación y determinad la operación crítica; después colocad los marcadores de objetivo.</p>
      <button class="icon-btn ripple" data-rnd><i class="ti ti-dice-5"></i> Aleatorio</button></div>
      <div class="g-wz-card">${missionPicker(true)}</div>`;
  } else if (id === 'ini') {
    const w = draft.win0, ini = draft.ini0;
    body = `
      <div class="g-wz-cols">
        <div class="g-wz-card">
          <h3><b>1</b> Tirada enfrentada</h3>
          <p>El ganador decide quién tiene la iniciativa. Los empates se repiten.</p>
          ${diceRow(draft.roll, 'r0')}
          <div class="g-wz-or">o marca quién ganó</div>
          <div class="g-pbtns">${pbtn('win0', w)}</div>
          <h3><b>2</b> ¿Quién tiene la iniciativa?</h3>
          <p>${w != null ? `Decide <b>${esc(pname(w))}</b>.` : 'Lo decide el ganador de la tirada.'}</p>
          <div class="g-pbtns">${pbtn('ini0', ini)}</div>
          ${ini != null ? `<p class="g-hint"><i class="ti ti-cards"></i> ${esc(pname(1 - ini))} recibe la carta de iniciativa <b>Repetir</b>.</p>` : ''}
        </div>
        <div class="g-wz-card">
          <h3><b>3</b> Zona de despliegue</h3>
          <p>${ini != null ? `<b>${esc(pname(ini))}</b> elige zona de despliegue:` : 'La elige el jugador con la iniciativa.'}</p>
          ${mapPreview(draft.dzPick)}
          <div class="g-pbtns">
            <button class="g-pbtn ${ini != null && draft.dzPick === ini ? 'on' : ''}" data-dz="or" ${ini == null ? 'disabled' : ''}>Zona naranja</button>
            <button class="g-pbtn ${ini != null && draft.dzPick === 1 - ini ? 'on' : ''}" data-dz="gr" ${ini == null ? 'disabled' : ''}>Zona contraria</button>
          </div>
        </div>
      </div>`;
  } else if (id === 'age') {
    body = !ensurePlayers() ? '<p class="g-wz-lead">No se pudieron cargar los comandos.</p>'
      : `<p class="g-wz-lead">Revelad a la vez la selección de agentes y hasta cuatro opciones de equipo. Cada jugador gana <b>2PM</b>.</p>
      <div class="g-wz-2">${[0, 1].map(i => agePanel(i)).join('')}</div>`;
  } else if (id === 'tac') {
    ensurePlayers();
    body = `<p class="g-wz-lead">Cada jugador elige <b>en secreto</b> una operación táctica de sus arquetipos. Pasaos el dispositivo: el otro jugador no debe mirar.</p>
      <div class="g-wz-2">${[0, 1].map(i => tacPanel(i)).join('')}</div>`;
  } else if (id === 'des') {
    const ini = draft.ini0;
    body = `<div class="g-wz-cols">
      <div class="g-wz-card">
        <h3><b>1</b> Equipo</h3><p>Alternad colocando los elementos de equipo, empezando por <b>${esc(pname(ini))}</b>.</p>
        <h3><b>2</b> Agentes</h3><p>Alternad desplegando <b>⅓ del equipo</b> cada vez, totalmente dentro de vuestra zona de despliegue y con <b>orden de ocultarse</b>, empezando por <b>${esc(pname(ini))}</b>.</p>
        <ul class="g-wz-list">${[0, 1].map(i => { const P = draft.players[i]; const k = P.ops.filter(o => o.inc).length; return `<li><span class="p${i + 1}">${esc(pname(i))}</span> ${k} agentes · tandas de ${Math.ceil(k / 3)}</li>`; }).join('')}</ul>
        <p class="g-hint">Todos los agentes empiezan con orden de ocultarse; podrás cambiarla en su ficha.</p>
      </div>
      <div class="g-wz-card"><h3><b>3</b> Zonas de despliegue</h3>${mapPreview(draft.dzPick)}</div>
    </div>`;
  } else if (id === 'pi1') {
    const w = draft.win1, ini = draft.ini1, loser = w == null ? null : 1 - w;
    body = `<div class="g-wz-cols">
      <div class="g-wz-card">
        <h3><b>1</b> Iniciativa del punto de inflexión 1</h3>
        <p>Tirada enfrentada (aplicad antes las reglas de tirada de vuestros equipos). Si hay empate gana quien no tenía la iniciativa: <b>${esc(pname(1 - draft.ini0))}</b>.</p>
        ${diceRow(draft.roll1, 'r1')}
        <div class="g-wz-or">o marca quién ganó</div>
        <div class="g-pbtns">${pbtn('win1', w)}</div>
        <h3><b>2</b> ¿Quién tiene la iniciativa?</h3>
        <div class="g-pbtns">${pbtn('ini1', ini)}</div>
        ${loser != null ? `<p class="g-hint"><i class="ti ti-cards"></i> ${esc(pname(loser))} perdió la tirada y gana la carta <b>+1 / −1</b>.</p>` : ''}
      </div>
      <div class="g-wz-card">
        <h3><b>3</b> Operación principal (secreta)</h3>
        <p>Como GAMBITO ESTRATÉGICO, cada jugador elige en secreto una de sus tres operaciones. Al final suma la mitad de lo puntuado con ella.</p>
        ${[0, 1].map(i => primPanel(i)).join('')}
      </div>
    </div>`;
  }
  $('#setup-body').className = 'g-setup-body wiz';
  $('#setup-body').innerHTML = `${bar}<div class="g-wz"><h2 class="g-wz-t"><i class="ti ti-${STEPS[n].ico}"></i> ${STEPS[n].t}</h2>${body}</div>`;
  const ok = stepOk(n), last = n === STEPS.length - 1;
  $('#setup-ft').innerHTML = `
    <button class="icon-btn" data-back ${n ? '' : 'disabled'}><i class="ti ti-chevron-left"></i> Atrás</button>
    <span class="sp">${ok ? `Paso ${n + 1} de ${STEPS.length}` : esc(stepHint[id] || '')}</span>
    ${last
      ? `<button class="icon-btn accent ripple" data-finish ${ok ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px"><i class="ti ti-swords"></i> ¡A la batalla!</button>`
      : `<button class="icon-btn accent ripple" data-next ${ok ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px">Siguiente <i class="ti ti-chevron-right"></i></button>`}`;
}

function agePanel(i) {
  const P = draft.players[i], f = FACTIONS[P.factionId], E = eqOptions(f);
  const max = f.roster?.equipment?.slots || 4;
  const inc = P.ops.filter(o => o.inc).length;
  const eqBtn = e => `<button class="g-eq ${P.equipment.includes(e.id) ? 'on' : ''}" data-eq="${i}" data-id="${esc(e.id)}" title="${esc(e.t || '')}">${esc(e.n)}</button>`;
  return `<div class="g-sp p${i + 1}">
    <div class="g-sp-hd"><span class="t">${esc(pname(i))}</span><span class="g-sp-sub">${esc(f.name)} · ${inc}/${P.ops.length} agentes</span></div>
    <div class="g-sp-list">
      <div class="g-sp-sec">Agentes${P.src.kind === 'faction' ? ' · desmarca los que no juegan' : ''}</div>
      <div class="g-ages">${P.ops.map(o => { const od = f.ops.find(x => x.id === o.opId); return `<button class="g-age ${o.inc ? 'on' : ''}" data-age="${i}" data-u="${o.uid}"><i class="ti ti-${o.inc ? 'checkbox' : 'square'}"></i>${esc((o.label || od.name) + (o.n ? ' #' + o.n : ''))}</button>`; }).join('')}</div>
      <div class="g-sp-sec">Equipo · ${P.equipment.length}/${max}</div>
      <div class="g-eqs">${E.fac.map(eqBtn).join('')}</div>
      <details class="g-old" ${P.equipment.some(id => E.uni.some(u => u.id === id)) ? 'open' : ''}><summary class="g-sp-sec">Equipo universal (${E.uni.length})</summary><div class="g-eqs">${E.uni.map(eqBtn).join('')}</div></details>
    </div></div>`;
}
function tacPanel(i) {
  const P = draft.players[i];
  const body = draft.cover === i
    ? tacPicker(P, draft.tacAll[i], draft.tac[i]) + `<div class="g-row"><span style="flex:1"></span><button class="icon-btn accent" data-hide="${i}" ${draft.tac[i] ? '' : 'disabled'}><i class="ti ti-lock"></i> Ocultar y pasar el dispositivo</button></div>`
    : draft.cover != null
      ? `<div class="g-secret"><i class="ti ti-eye-off"></i><p>${esc(pname(draft.cover))} está eligiendo. No mires.</p></div>`
      : `<div class="g-secret"><i class="ti ti-${draft.tac[i] ? 'circle-check' : 'lock'}"></i>
        <p>${draft.tac[i] ? `<b>${esc(pname(i))}</b> ya ha elegido su operación táctica.` : `Turno de <b>${esc(pname(i))}</b>.`}</p>
        <button class="icon-btn ${draft.tac[i] ? '' : 'accent'}" data-cover="${i}"><i class="ti ti-eye"></i> ${draft.tac[i] ? 'Ver / cambiar' : 'Soy ' + esc(pname(i)) + ': elegir'}</button></div>`;
  return `<div class="g-sp p${i + 1}"><div class="g-sp-hd"><span class="t">${esc(pname(i))}</span><span class="g-sp-sub">${esc(archetypes(P).join(' · '))}</span></div><div class="g-sp-list">${body}</div></div>`;
}
function primPanel(i) {
  const open = draft.primCover === i, v = draft.prim[i];
  return `<div class="g-prim p${i + 1}">
    <span class="who">${esc(pname(i))}</span>
    ${open ? `<div class="g-pick prim">${['crit', 'kill', 'tac'].map((o, n) => `<button class="${v === o ? 'on' : ''}" data-primw="${i}" data-o="${o}"><b>${n + 1}</b>${OPN[o].replace('Op. ', '')}</button>`).join('')}</div>`
      : `<button class="icon-btn ${v ? '' : 'accent'}" data-primcover="${i}"><i class="ti ti-${v ? 'circle-check' : 'lock'}"></i> ${v ? 'Elegida · ver' : 'Elegir en secreto'}</button>`}
  </div>`;
}

function rollOff(tieTo) {
  let a, b;
  do { a = d6(); b = d6(); } while (a === b && tieTo == null);
  return { roll: [a, b], win: a === b ? tieTo : a > b ? 0 : 1 };
}

function onSetupClick(e) {
  const t = e.target.closest('button, input[type=checkbox]');
  if (!t || t.disabled) return;
  const d = t.dataset;
  if (d.src != null) { draft.src[+d.src] = { kind: d.kind, id: d.id }; }
  else if (d.zone) { const z = zoneOf(d.zone); draft.zone = z.id; if (!mapOf(z, draft.map)) draft.map = z.maps[0].id; draft.dzPick = null; }
  else if (d.map) { draft.map = d.map; draft.dzPick = null; }
  else if (d.crit) { draft.crit = draft.crit === +d.crit ? null : +d.crit; }
  else if (t.hasAttribute('data-rnd')) {
    const z = pick(ZONAS), m = pick(z.maps.filter(m => !m.old)), c = pick(OPS.crit);
    Object.assign(draft, { zone: z.id, map: m.id, crit: c.n, dzPick: null });
    KT.toast(`${z.name} · mapa ${m.label} · ${c.name}`, { type: 'ok' });
  }
  else if (d.roll === 'r0') { const r = rollOff(null); Object.assign(draft, { roll: r.roll, win0: r.win, ini0: r.win, dzPick: null }); KT.toast(`${esc(pname(r.win))} gana la tirada (${r.roll[0]}–${r.roll[1]})`, { type: 'ok' }); }
  else if (d.win0 != null) { Object.assign(draft, { win0: +d.win0, ini0: +d.win0, roll: null, dzPick: null }); }
  else if (d.ini0 != null) { draft.ini0 = +d.ini0; draft.dzPick = null; }
  else if (d.dz) { draft.dzPick = d.dz === 'or' ? draft.ini0 : 1 - draft.ini0; }
  else if (d.age != null) { const o = draft.players[+d.age].ops.find(x => x.uid === d.u); o.inc = !o.inc; }
  else if (d.eq != null) {
    const P = draft.players[+d.eq], max = FACTIONS[P.factionId].roster?.equipment?.slots || 4;
    if (P.equipment.includes(d.id)) P.equipment = P.equipment.filter(x => x !== d.id);
    else if (P.equipment.length >= max) { KT.toast(`Máximo ${max} opciones de equipo`, { type: 'err' }); return; }
    else P.equipment = [...P.equipment, d.id];
  }
  else if (d.cover != null) { draft.cover = +d.cover; }
  else if (d.hide != null) { draft.cover = null; }
  else if (d.tac) { draft.tac[draft.cover] = d.tac; }
  else if (t.hasAttribute('data-all')) { draft.tacAll[draft.cover] = t.checked; }
  else if (d.roll === 'r1') { const r = rollOff(1 - draft.ini0); Object.assign(draft, { roll1: r.roll, win1: r.win, ini1: r.win }); KT.toast(`${esc(pname(r.win))} gana la tirada${r.roll[0] === r.roll[1] ? ' (empate)' : ''} (${r.roll[0]}–${r.roll[1]})`, { type: 'ok' }); }
  else if (d.win1 != null) { Object.assign(draft, { win1: +d.win1, ini1: +d.win1, roll1: null }); }
  else if (d.ini1 != null) { draft.ini1 = +d.ini1; }
  else if (d.primcover != null) { draft.primCover = +d.primcover; }
  else if (d.primw != null) { draft.prim[+d.primw] = d.o; draft.primCover = null; KT.toast(`${esc(pname(+d.primw))} ya ha elegido`, { ms: 1400 }); }
  else if (d.step != null) { leaveStep(); draft.step = +d.step; }
  else if (t.hasAttribute('data-back')) { leaveStep(); draft.step = Math.max(0, draft.step - 1); }
  else if (t.hasAttribute('data-next')) { if (!stepOk(draft.step)) return; leaveStep(); draft.step++; $('#setup-body').scrollTop = 0; }
  else if (t.hasAttribute('data-finish')) { finishWizard(); return; }
  else if (t.hasAttribute('data-start')) { startQuick(); return; }
  else return;
  renderSetup();
}
function leaveStep() { draft.cover = null; draft.primCover = null; }

function startQuick() {
  const players = [0, 1].map(i => buildPlayer(draft.src[i], draft.names[i].trim()));
  if (players.some(p => !p)) { KT.toast('No se pudo cargar alguno de los comandos', { type: 'err' }); return; }
  begin({ players, ini: null, ini0: null, dz: 0 });
}
function finishWizard() {
  if (!ensurePlayers()) return;
  const players = draft.players.map((P, i) => {
    const ops = P.ops.filter(o => o.inc).map(({ inc, ...o }) => o);
    const cards = { rr: i === draft.ini0 ? 0 : 1, i1: i === draft.win1 ? 0 : 1, i2: 0, i3: 0 };
    return { ...P, name: draft.names[i].trim(), ops, tac: draft.tac[i], tacShown: false, prim: draft.prim[i], cards };
  });
  begin({ players, ini: draft.ini1, ini0: draft.ini0, dz: draft.dzPick ?? 0 });
}
function begin({ players, ini, ini0, dz }) {
  const keep = S && S.started;
  if (keep) hist.push(JSON.stringify(S));
  const d = draft;
  draft = null; pop = null;
  S = { v: V, started: true, ended: false, tp: 1, ini, ini0, zone: d.zone, map: d.map, crit: d.crit, dz, rot: false, players, obj: initObjs(d.zone, d.map, d.crit) };
  save();
  $('#setup').classList.remove('on');
  history.replaceState(null, '', location.pathname);
  render(); syncUndo();
  KT.toast('¡Que empiece la batalla!', { type: 'ok' });
  prefetch(); keepAwake();
}
function closeSetup() { if (S && S.started) { $('#setup').classList.remove('on'); draft = null; } }

// Precarga las imágenes de la partida (para jugar sin conexión)
function prefetch() {
  const urls = new Set();
  const g = geom(); if (g) { urls.add(g.m.img); (g.z.claves || []).forEach(u => urls.add(u)); }
  const c = critOf(S.crit); if (c) urls.add(c.img);
  S.players.forEach(P => {
    const f = FACTIONS[P.factionId]; urls.add(f.img);
    P.ops.forEach(o => { const od = opData(P, o); if (od?.img) urls.add(od.img); });
    const t = tacOf(P.tac); if (t) urls.add(t.img);
  });
  urls.forEach(u => { const im = new Image(); im.src = u; });
}

// ── Pantalla completa / orientación / pantalla encendida ─────
async function toggleFS() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      try { await screen.orientation.lock('landscape'); } catch {}
    } else await document.exitFullscreen();
  } catch { KT.toast('Tu navegador no permite pantalla completa aquí'); }
}
let wakeLock = null;
async function keepAwake() {
  try {
    if ('wakeLock' in navigator && !wakeLock && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    }
  } catch {}
}

function showHelp() {
  KT.helpModal([
    ['Toca la ficha', 'Ver armas y habilidades (valores de lesionado en rojo)'],
    ['Regla de arma', 'Toca «Letal 5+», «Penetración 1»… para ver qué hace'],
    ['− +', 'Daño / curación · el grado de eliminación del rival se calcula solo'],
    ['Marcadores', 'Toca un objetivo del mapa para marcar control y estados de la operación'],
    ['Ardides', 'Úsalos desde la columna del jugador: descuentan los PM'],
    ['PV', 'Toca los puntos de victoria para puntuar cada operación'],
    ['Rep. ±1', 'Cartas de iniciativa: toca para marcar disponible / usada'],
    [MOD_KEY + ' Z', 'Deshacer el último cambio'],
    ['→', 'Siguiente punto de inflexión (tras el 4.º, fin de la batalla)'],
    ['←', 'Punto de inflexión anterior'],
    ['C', 'Operación crítica'],
    ['S', 'Secuencia de juego'],
    ['F', 'Pantalla completa'],
    ['M', 'Ampliar el mapa'],
    ['N', 'Nueva partida / preparación'],
  ]);
}
const MOD_KEY = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘' : 'Ctrl';

// ── Inicio ───────────────────────────────────────────────────
window.addEventListener('load', () => {
  KT.initFx();
  $('#col-0').addEventListener('click', onColClick);
  $('#col-1').addEventListener('click', onColClick);
  $('#bar').addEventListener('click', onBarClick);
  $('#board').addEventListener('click', onBoardClick);
  $('#sheet-body').addEventListener('click', onSheetClick);
  $('#sheet-close').addEventListener('click', closeSheet);
  $('#sheet').addEventListener('mousedown', e => { if (e.target.id === 'sheet') closeSheet(); });
  $('#setup-body').addEventListener('click', onSetupClick);
  $('#setup-ft').addEventListener('click', onSetupClick);
  $('#setup-body').addEventListener('input', e => { if (e.target.dataset.name != null) draft.names[+e.target.dataset.name] = e.target.value; });
  $('#btn-mode').addEventListener('click', () => { draft.mode = draft.mode === 'wiz' ? 'panel' : 'wiz'; renderSetup(); });
  $('#btn-close-setup').addEventListener('click', closeSetup);
  $('#btn-setup').addEventListener('click', () => { draft = null; openSetup(); });
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-fs').addEventListener('click', toggleFS);
  $('#btn-help').addEventListener('click', showHelp);
  $('#viewer-close').addEventListener('click', closeViewer);
  $('#rot-continue').addEventListener('click', () => document.body.classList.add('allow-portrait'));
  $('#rot-fs').addEventListener('click', toggleFS);
  document.addEventListener('click', e => { if (tipEl && !e.target.closest('.g-tip, [data-rule], [data-tipeq], [data-tipploy]')) hideTip(); });
  new ResizeObserver(() => placeObjs()).observe($('#board'));
  document.addEventListener('visibilitychange', () => { if (S?.started) keepAwake(); });

  const playing = () => S?.started && !$('#setup').classList.contains('on');
  KT.keys({
    'mod+z': () => undo(),
    'ArrowRight': () => { if (playing() && !sheet) setTP(S.tp + 1); else return false; },
    'ArrowLeft': () => { if (playing() && !sheet) setTP(S.ended ? S.tp : S.tp - 1); else return false; },
    'f': () => toggleFS(),
    'm': () => openViewer(),
    'n': () => { draft = null; openSetup(); },
    'c': () => { if (playing()) openSheet('crit'); else return false; },
    's': () => { if (playing()) openSheet('seq'); else return false; },
    '?': showHelp,
    'Escape': () => {
      if (tipEl) { hideTip(); return; }
      if ($('#viewer').classList.contains('on')) { closeViewer(); return; }
      if (sheet) { closeSheet(); return; }
      if (pop) { pop = null; renderBoard(); return; }
      if ($('#setup').classList.contains('on') && S?.started) { closeSetup(); return; }
      return false;
    },
  });

  if (S && S.v === 2) { try { migrate2(); save(); } catch { S = null; } }
  if (S && S.v !== V) { S = null; legacy = true; }
  if (legacy) KT.toast('La partida guardada era de una versión anterior: empieza una nueva', { ms: 5000 });
  if (new URLSearchParams(location.search).get('p1')) { $('#app').hidden = !(S && S.started); openSetup(); if (S?.started) render(); }
  else render();
  syncUndo();
  if (S?.started) keepAwake();
});
