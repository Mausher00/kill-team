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
const hist = [];              // deshacer: operaciones inversas de MIS cambios
const OPEN = new Set(KT.store.get('partida.abiertos', []) || []);   // fichas desplegadas (solo este dispositivo)
let ROT = !!KT.store.get('partida.rot', false);                     // giro manual del mapa (solo este dispositivo)
let sheet = null;          // { kind, i, peek, all }
let pop = null;            // marcador abierto en el mapa: { k } · { add: true } · { move: k }
let draft = null;          // preparación en curso

function migrate2() {
  S.v = V; delete S.flip; S.dz = 0; S.ini0 = null;
  S.players.forEach(P => { P.ployUsed = {}; });
  S.obj = initObjs(S.zone, S.map, S.crit);
}

// ── Utilidades de estado ─────────────────────────────────────
// Cada cambio se expresa como operaciones { p: ruta, v: valor } (o { p, d: 1 } para borrar).
// Así se puede deshacer solo lo propio y sincronizar con el otro dispositivo.
const clone = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
function diff(a, b, path = [], out = [], skip = null) {
  if (a === b) return out;
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    if (Array.isArray(a) && a.length !== b.length) { out.push({ p: path, v: clone(b) }); return out; }
    new Set([...Object.keys(a), ...Object.keys(b)]).forEach(k => {
      if (skip && !path.length && skip.has(k)) return;
      if (!(k in b) || b[k] === undefined) { if (k in a && a[k] !== undefined) out.push({ p: [...path, k], d: 1 }); }
      else diff(a[k], b[k], [...path, k], out);
    });
    return out;
  }
  out.push({ p: path, v: clone(b) });
  return out;
}
function applyOps(root, ops) {
  ops.forEach(({ p, v, d }) => {
    if (!p.length) { root = clone(v); return; }
    let o = root;
    for (let k = 0; k < p.length - 1; k++) { if (o[p[k]] == null || typeof o[p[k]] !== 'object') o[p[k]] = typeof p[k + 1] === 'number' || /^\d+$/.test(p[k + 1]) ? [] : {}; o = o[p[k]]; }
    if (d) delete o[p[p.length - 1]]; else o[p[p.length - 1]] = clone(v);
  });
  return root;
}
// Huella del estado (orden de claves canónico) para comprobar que ambos dispositivos coinciden
function canon(x) { return x && typeof x === 'object' ? (Array.isArray(x) ? '[' + x.map(canon).join(',') + ']' : '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canon(x[k])).join(',') + '}') : JSON.stringify(x ?? null); }
function hashOf(x) { const s = canon(x); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); }

function save() { if (S) KT.store.set(KEY, S); }
function commit(fn, opts = {}) {
  const before = clone(S);
  fn();
  const ops = diff(before, S);
  if (ops.length) {
    hist.push(diff(S, before));
    if (hist.length > 80) hist.shift();
    save();
    Net.ops('S', ops);
    if (S.ended) saveHistory();
  }
  if (opts.render !== false) render(opts.only);
  syncUndo();
}
function undo() {
  if (!hist.length) { KT.toast('Nada que deshacer'); return; }
  const inv = hist.pop();
  S = applyOps(S, inv);
  save(); render(); syncUndo();
  Net.ops('S', inv);
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
// Puntuación por punto de inflexión: score.tp.{crit,tac}[pi-1] y score.killAt[pi-1] (grado acumulado al cerrar el PI)
const zero4 = () => [0, 0, 0, 0];
const newScore = () => ({ crit: 0, tac: 0, killAdj: 0, tp: { crit: zero4(), tac: zero4() }, killAt: [null, null, null, null] });
function ensureScore(P, tp = 1) {
  const sc = P.score || (P.score = newScore());
  if (!sc.tp) { sc.tp = { crit: zero4(), tac: zero4() }; sc.tp.crit[tp - 1] = sc.crit || 0; sc.tp.tac[tp - 1] = sc.tac || 0; }
  if (!sc.killAt) sc.killAt = [null, null, null, null];
}
// PV de eliminación ganados en cada punto de inflexión
function killByTp(i) {
  const at = S.players[i].score.killAt, g = killInfo(i).grade, out = zero4();
  let prev = 0;
  for (let n = 0; n < MAX_TP; n++) {
    const cur = n + 1 < S.tp ? Math.min(at[n] ?? prev, g) : n + 1 === S.tp ? g : null;
    if (cur == null) break;
    out[n] = cur - prev; prev = cur;
  }
  return out;
}
function addScore(i, op, v, tp = S.tp) {
  const P = S.players[i], cell = P.score.tp[op][tp - 1] + v, tot = P.score[op] + v;
  if (cell < 0) return false;
  if (tot > 6) { KT.toast('Máximo 6PV por operación'); return false; }
  commit(() => { P.score.tp[op][tp - 1] = cell; P.score[op] = tot; }, { only: 'bar' });
  return true;
}
function scoreOf(i) {
  const P = S.players[i], k = killInfo(i), ko = killInfo(1 - i);
  const bonus = S.ended && k.grade > ko.grade ? 1 : 0;
  const by = { crit: P.score.crit, kill: k.grade + bonus, tac: P.score.tac };
  const prim = S.ended && P.prim ? Math.ceil(by[P.prim] / 2) : 0;
  return { ...by, bonus, prim, k, total: by.crit + by.kill + by.tac + prim };
}

// ── Historial de partidas (kt.historial) ─────────────────────
function saveHistory() {
  if (!S) return;
  const sc = [scoreOf(0), scoreOf(1)];
  const win = sc[0].total === sc[1].total ? null : sc[0].total > sc[1].total ? 0 : 1;
  const rec = {
    id: S.gid || Date.now().toString(36), date: new Date().toISOString(),
    zone: S.zone, map: S.map, crit: S.crit, dual: !!S.dual, seat: SEAT, winner: win,
    players: S.players.map((P, i) => ({
      name: P.name || 'Jugador ' + (i + 1), faction: P.factionId, title: P.title, tacOp: P.tac, primOp: P.prim,
      vp: { crit: sc[i].crit, kill: sc[i].kill, tac: sc[i].tac, prim: sc[i].prim }, total: sc[i].total,
      tp: { crit: [...P.score.tp.crit], tac: [...P.score.tp.tac], kill: killByTp(i) },
      ops: P.ops.length, lost: P.ops.filter(o => o.w <= 0).length,
      roster: P.src?.kind === 'roster' ? P.src.id : null,
      list: P.ops.map(o => ({ id: o.opId, n: o.label || opData(P, o)?.name || o.opId, ko: o.w <= 0 })),   // para la campaña
    })),
    ...(S.liga ? { liga: S.liga } : {}),
  };
  const list = (KT.store.get('historial', []) || []).filter(r => r.id !== rec.id);
  list.unshift(rec);
  KT.store.set('historial', list.slice(0, 300));
  // partida de liga/torneo: apunta el resultado en su enfrentamiento
  if (S.liga) {
    const ligas = KT.store.get('ligas', []) || [], L = ligas.find(x => x.id === S.liga.id), M = L?.matches.find(x => x.id === S.liga.m);
    if (M) { M.res = { pa: sc[0].total, pb: sc[1].total, date: rec.date, gid: rec.id }; KT.store.set('ligas', ligas); }
  }
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
    return { uid: 'o' + i, ...o, w: od.s.h, order: 'conceal', used: false };
  });
  return {
    name: name || '', src, factionId: f.id, title, ploys0, equipment: [...equipment], ops,
    cp: 2,                                   // «Elegir agentes: cada jugador gana 2PM»
    tac: null, tacShown: false, prim: null,
    score: newScore(),
    cards: { rr: 0, i1: 0, i2: 0, i3: 0 },   // 0 no la tiene · 1 la tiene · 2 usada
    ployUsed: {},                            // nombre -> punto de inflexión en que se usó
  };
}

// ── Mapa: geometría y marcadores de objetivo ─────────────────
// MARCADORES[img] = { o: [[x%, y%]…], j1: lado de la zona de despliegue naranja (l r t b) }
// S.dz: jugador que despliega en la zona naranja · ROT: giro manual de 180° (local)
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
  const rot = (side === 'r') !== ROT;                   // se gira para dejar a J1 a la izquierda
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
// En la preparación se puede usar el móvil en vertical (la partida, en horizontal)
const syncBody = () => document.body.classList.toggle('setup-open', $('#setup').classList.contains('on'));
// Vista: 'auto' (reducida en pantallas pequeñas), 'full' o 'compact' — solo este dispositivo
const mqSmall = matchMedia('(max-width: 820px), (max-height: 520px)');
let VIEW = KT.store.get('partida.vista', 'auto') || 'auto';
const isCompact = () => VIEW === 'compact' || (VIEW === 'auto' && mqSmall.matches);
function toggleView() {
  const to = !isCompact();
  VIEW = to === mqSmall.matches ? 'auto' : to ? 'compact' : 'full';
  KT.store.set('partida.vista', VIEW);
  hideTip(); render();
}
function render(only) {
  const C = $('#compact');
  if (!S || !S.started) { $('#app').hidden = true; C.hidden = true; document.body.classList.remove('compact'); openSetup(); return; }
  S.players.forEach(P => ensureScore(P, S.tp));
  const compact = isCompact();
  document.body.classList.toggle('compact', compact);
  C.hidden = !compact; $('#app').hidden = compact;
  $('#btn-end').classList.toggle('accent', !!S.ended);
  actNotice(nextToAct());
  if (compact) { $('#bar').innerHTML = ''; renderCompact(); if (sheet) renderSheet(); return; }
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
  const turn = nextToAct(), myTurn = turn && turn.p === i;
  const eqAll = eqOptions(f).all;
  const extras = [
    ...P.ploys0.map(p => `<button class="g-chip zero" data-tipploy="${esc(p)}" title="Ardid a 0PM">${esc(p)} · 0PM</button>`),
    ...P.equipment.map(id => `<button class="g-chip" data-tipeq="${esc(id)}">${esc(eqAll.find(e => e.id === id)?.n || id)}</button>`),
  ].join('');
  const t = tacOf(P.tac), k = killInfo(i);
  const own = isDual() && S.dual && SEAT === i;           // en su propio móvil cada jugador ve sus secretos
  const tacTxt = !t ? (mine(i) ? 'Elegir' : '—') : P.tacShown || own ? t.name : 'Oculta';
  const primTxt = P.prim ? (S.ended || own ? OPN[P.prim].replace('Op. ', '') : 'Oculta') : (mine(i) ? 'Elegir' : '—');
  const cards = CARDS.map(([id, l]) => {
    const st = P.cards[id];
    const tip = OPS.iniciativa.find(c => c.id === id);
    return `<button class="g-card s${st}" data-card="${id}" title="${esc(tip.name + ' ' + tip.sub)} · ${['no la tiene', 'disponible', 'usada'][st]} (tocar para cambiar)">${l}</button>`;
  }).join('');
  const nPloys = ployList(P).filter(p => P.ployUsed[p.n] === S.tp).length;
  col.innerHTML = `
    <div class="g-ph">
      <button class="g-pteam" data-sheet="team" data-p="${i}" title="Ver el comando: lista, reglas de facción y enlaces"><img src="${f.img}" alt="" onerror="this.style.visibility='hidden'"><i class="ti ti-book-2"></i></button>
      <div class="g-pn"><div class="g-pname">${esc(pname(i))}${isDual() && S.dual && SEAT === i ? ' <small class="g-you">tú</small>' : ''}</div><div class="g-pfac">${esc(f.name)} · ${esc(P.title)}</div></div>
      <div class="g-pcount ${myTurn ? 'turn' : ''}" title="Por activar / en pie / total">${myTurn ? '<em>Activa</em>' : ''}<b>${ready}</b> por activar<br>${alive.length}/${P.ops.length} en pie</div>
    </div>
    <div class="g-mis">
      <button class="g-mchip ${t ? (P.tacShown ? 'shown' : 'secret') : 'todo'}" data-sheet="tac" data-p="${i}" title="Operación táctica"><i class="ti ti-${t && !P.tacShown ? 'lock' : 'target-arrow'}"></i><span>Táctica</span><b>${esc(tacTxt)}</b></button>
      <button class="g-mchip ${P.prim ? 'secret' : 'todo'}" data-sheet="score" data-p="${i}" title="Operación principal y puntuación"><i class="ti ti-${P.prim && !S.ended ? 'lock' : 'star'}"></i><span>Principal</span><b>${esc(primTxt)}</b></button>
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
  const cls = ['g-op', o.used && 'used', dead && 'dead', hurt && 'hurt', OPEN.has(i + ':' + o.uid) && 'open'].filter(Boolean).join(' ');
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
       <div class="g-terr" id="terr">${terrLayer(g.m.img, g.z.id, g.rot)}</div>
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
      <div class="brk"><span title="Op. crítica">C<b>${s.crit}</b></span><span title="Op. de eliminación">E<b>${s.kill}</b></span><span title="Op. táctica">T<b>${s.tac}</b></span>${s.prim ? `<span title="Op. principal">P<b>${s.prim}</b></span>` : ''}${S.ended ? '' : `<span class="now" title="Puntos ganados en este punto de inflexión">PI${S.tp}<b>+${tpTotals(i)[S.tp - 1]}</b></span>`}</div>
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
      <button class="g-ini ${S.ini == null ? '' : 'p' + (S.ini + 1)}" data-sheet="ini" title="Tirada de iniciativa del punto de inflexión">Iniciativa: <b>${ini}</b></button>
      ${OPT.activ && nextToAct() ? `<div class="g-act">${actLabel(nextToAct())}</div>` : ''}
    </div>
    ${cp(1)}
    ${vp(1)}`;
}

// ── Opciones de la partida (solo este dispositivo) ───────────
const OPT = Object.assign({ cierre: false, activ: false }, KT.store.get('partida.opciones', {}) || {});
const setOpt = (k, v) => { OPT[k] = v; KT.store.set('partida.opciones', OPT); render(); };
function optBody() {
  const sw = (k, t, d) => `<label class="g-opt-sw"><input type="checkbox" data-opt="${k}" ${OPT[k] ? 'checked' : ''}><span><b>${t}</b><small>${d}</small></span></label>`;
  return `
    <h4>Ayudas opcionales</h4>
    ${sw('cierre', 'Cierre guiado de turno', 'Al pasar de punto de inflexión se abre un resumen con los marcadores que controla cada jugador y la regla de puntuación, para apuntar los PV del turno.')}
    ${sw('activ', 'Contador de activaciones', 'Indica a quién le toca activar y avisa cuando un jugador se queda sin operativos listos.')}
    <h4>Vista</h4>
    <div class="g-row"><button class="icon-btn" data-optact="view"><i class="ti ti-${isCompact() ? 'layout-board-split' : 'layout-list'}"></i> ${isCompact() ? 'Vista completa' : 'Vista reducida (marcador)'}</button>
      <button class="icon-btn" data-optact="fs"><i class="ti ti-maximize"></i> Pantalla completa</button></div>
    <h4>Partida</h4>
    <div class="g-row"><button class="icon-btn" data-optact="restart"><i class="ti ti-refresh"></i> Reiniciar</button><button class="icon-btn" data-optact="new"><i class="ti ti-plus"></i> Nueva partida</button>
      <button class="icon-btn" data-optact="end"><i class="ti ti-flag"></i> Fin de partida</button><button class="icon-btn" data-optact="help"><i class="ti ti-help"></i> Ayuda</button></div>
    <p class="g-hint">Estas opciones se guardan en este dispositivo.</p>`;
}
// A quién le toca activar: se deduce de las activaciones hechas y de la iniciativa
function nextToAct() {
  if (!OPT.activ || S.ended || S.ini == null) return null;
  const ready = [0, 1].map(i => S.players[i].ops.filter(o => o.w > 0 && !o.used).length);
  const done = [0, 1].map(i => S.players[i].ops.filter(o => o.used).length);
  if (!ready[0] && !ready[1]) return { p: null, ready, all: true };
  let p = done[S.ini] <= done[1 - S.ini] ? S.ini : 1 - S.ini;
  if (!ready[p]) p = 1 - p;
  return { p, ready, solo: !ready[1 - p] };
}
let ACT_KEY = '';
function actNotice(a) {
  const key = !a ? '' : a.all ? 'all' + S.tp : a.solo ? 'solo' + a.p + S.tp : '';
  if (key && key !== ACT_KEY) KT.toast(a.all ? 'Todos los operativos han activado: pasa al siguiente punto de inflexión' : `${esc(pname(1 - a.p))} ya no tiene operativos listos: ${esc(pname(a.p))} activa los ${a.ready[a.p]} que le quedan`, { ms: 4500 });
  ACT_KEY = key;
}
const actLabel = a => !a ? '' : a.all ? 'Todos activados' : `Activa <b class="p${a.p + 1}">${esc(pname(a.p))}</b> · quedan ${a.ready[0]}–${a.ready[1]}`;

// Cierre guiado del punto de inflexión: marcadores controlados + regla de puntuación + PV del turno
function ctrlCount() {
  const c = [0, 0]; let d = 0, sec = [0, 0];
  (S.obj || []).forEach(o => { if (o.ctrl === 0 || o.ctrl === 1) c[o.ctrl]++; else if (o.ctrl === 'd') d++; if (o.sec === 0 || o.sec === 1) sec[o.sec]++; });
  return { c, d, sec, n: (S.obj || []).length };
}
function critSuggest() {                       // solo donde la regla se puede calcular con seguridad
  const k = ctrlCount();
  if (S.crit === 1 && S.tp > 1) return [0, 1].map(i => (k.sec[i] > 0 ? 1 : 0) + (k.sec[i] > k.sec[1 - i] ? 1 : 0));
  return null;
}
function closeBody() {
  const c = critOf(S.crit), k = ctrlCount(), sug = critSuggest(), last = S.tp >= MAX_TP;
  const pl = i => {
    const P = S.players[i], t = tacOf(P.tac), see = t && (P.tacShown || !isDual() || SEAT === i);
    return `<section class="g-end-p p${i + 1}">
      <header><div><b>${esc(pname(i))}</b><small>${k.n ? `${k.c[i]} de ${k.n} marcadores controlados${S.crit === 1 ? ' · ' + k.sec[i] + ' asegurados' : ''}` : 'sin marcadores en el mapa'}</small></div><div class="tot">${tpTotals(i)[S.tp - 1]}<small>PV este PI</small></div></header>
      ${tpGrid(i)}
      ${sug ? `<div class="g-end-row"><span>Sugerencia: crítica <b style="color:var(--pc)">+${sug[i]}</b><small>según los marcadores asegurados</small></span><button class="icon-btn" data-closeact="sug" data-p="${i}" ${P.score.tp.crit[S.tp - 1] === sug[i] ? 'disabled' : ''}>Aplicar</button></div>` : ''}
      <div class="g-end-row"><span>Táctica <small>${t ? (see ? esc(t.name) : 'oculta') : 'sin elegir'}</small></span>${t && see ? `<button class="icon-btn" data-sheet="tac" data-p="${i}">Ver</button>` : ''}</div>
    </section>`;
  };
  return `
    <div class="g-end">
      ${c ? `<h4>Operación crítica · ${esc(c.name)}</h4>${c.pv.map(l => `<p class="${l.startsWith('•') ? 'b' : ''}">${esc(l.replace(/^•\s*/, ''))}</p>`).join('')}` : '<p class="g-hint warn">No hay operación crítica elegida.</p>'}
      ${k.d ? `<p class="g-hint">${k.d} marcador(es) disputado(s): no cuentan para nadie.</p>` : ''}
      ${S.tp === 1 ? '<p class="g-hint">En el primer punto de inflexión normalmente no se puntúa la operación crítica.</p>' : ''}
      <div class="g-end-cols">${pl(0)}${pl(1)}</div>
      <p class="g-hint">Actualiza antes el control de los marcadores en el mapa si ha cambiado. La eliminación se calcula sola.</p>
      <div class="g-row g-end-acts"><span style="flex:1"></span><button class="icon-btn" data-closeact="cancel">Seguir en el PI ${S.tp}</button>
        <button class="icon-btn accent" data-closeact="go"><i class="ti ti-${last ? 'flag' : 'chevron-right'}"></i> ${last ? 'Terminar la batalla' : `Cerrar el PI ${S.tp} y pasar al ${S.tp + 1}`}</button></div>
    </div>`;
}

// ── Puntuación por punto de inflexión (rejilla compartida) ───
let CTP = null;                                   // PI seleccionado para puntuar (local); null = el actual
const selTp = () => Math.min(MAX_TP, Math.max(1, CTP || S.tp));
const tpTotals = i => { const t = S.players[i].score.tp, k = killByTp(i); return zero4().map((_, n) => t.crit[n] + t.tac[n] + k[n]); };
function tpGrid(i) {
  const P = S.players[i], s = scoreOf(i), kb = killByTp(i), sel = selTp(), tot = tpTotals(i);
  const cls = n => `${n === sel ? 'sel' : ''} ${n === S.tp && !S.ended ? 'cur' : ''} ${n > S.tp ? 'fut' : ''}`;
  const head = [1, 2, 3, 4].map(n => `<button class="h ${cls(n)}" data-ctp="${n}" title="Puntuar el punto de inflexión ${n}">PI ${n}</button>`).join('');
  const row = (lbl, tip, vals, total, auto) => `<div class="l" title="${tip}">${lbl}</div>${vals.map((v, n) => `<button class="c ${cls(n + 1)} ${v ? 'has' : ''} ${auto ? 'auto' : ''}" data-ctp="${n + 1}">${n + 1 > S.tp && !v ? '·' : v}</button>`).join('')}<div class="t">${total}</div>`;
  const step = (op, lbl) => `<div class="st"><span>${lbl}</span><button data-tps="${op}" data-p="${i}" data-v="-1" aria-label="Restar ${lbl}">−</button><b>${P.score.tp[op][sel - 1]}</b><button data-tps="${op}" data-p="${i}" data-v="1" aria-label="Sumar ${lbl}">+</button></div>`;
  return `
    <div class="g-tpg p${i + 1}">
      <div class="grid"><div class="l"></div>${head}<div class="t h">Total</div>
        ${row('Crítica', 'Operación crítica', P.score.tp.crit, s.crit)}
        ${row('Táctica', 'Operación táctica', P.score.tp.tac, s.tac)}
        ${row('Elim.', 'Operación de eliminación: se calcula sola con las bajas', kb, s.kill + (s.bonus ? '<small>+1</small>' : ''), true)}
        <div class="l sum">Turno</div>${tot.map((v, n) => `<div class="c sum ${cls(n + 1)}">${n + 1 > S.tp ? '·' : v}</div>`).join('')}<div class="t sum">${s.total}${s.prim ? `<small title="Incluye la operación principal">★${s.prim}</small>` : ''}</div>
      </div>
      <div class="edit ${sel !== S.tp ? 'past' : ''}">${sel !== S.tp ? `<button class="back" data-ctp="${S.tp}" title="Volver a puntuar el punto de inflexión actual"><em>PI ${sel}</em><small>volver al ${S.tp}</small></button>` : `<em>PI ${sel}</em>`}${step('crit', 'Crítica')}${step('tac', 'Táctica')}</div>
    </div>`;
}
// Clics de la rejilla (vale en la vista reducida, la hoja de puntuación y el fin de partida)
function onScoreClick(e) {
  const t = e.target.closest('[data-ctp], [data-tps], [data-endprim], [data-endadj], [data-endact], [data-closeact], [data-optact], [data-opt]');
  if (!t || !S) return;
  const d = t.dataset;
  if (d.opt) { setOpt(d.opt, t.checked); return; }
  if (d.optact) {
    closeSheet();
    ({ view: toggleView, fs: toggleFS, restart: askRestart, new: newGame, end: () => endGame(), help: showHelp })[d.optact]?.();
    return;
  }
  if (d.closeact) {
    if (d.closeact === 'sug') { const i = +d.p, sug = critSuggest(); if (sug) addScore(i, 'crit', sug[i] - S.players[i].score.tp.crit[S.tp - 1], S.tp); return; }
    closeSheet();
    if (d.closeact === 'go') setTP(S.tp + 1, true);
    return;
  }
  if (d.ctp) { CTP = +d.ctp === S.tp ? null : +d.ctp; render('bar'); }
  else if (d.tps) { if (addScore(+d.p, d.tps, +d.v, selTp())) KT.bump(t.parentNode.querySelector('b')); }
  else if (d.endprim) commit(() => { const P = S.players[+d.p]; P.prim = P.prim === d.endprim ? null : d.endprim; });
  else if (d.endadj) {
    const i = +d.p, v = +d.v, g = killInfo(i).grade;
    if ((v < 0 && g <= 0) || (v > 0 && g >= 5)) return;
    commit(() => { S.players[i].score.killAdj += v; });
  }
  else if (d.endact === 'share') shareResult();
  else if (d.endact === 'reopen') { closeSheet(); CTP = null; commit(() => { S.ended = false; }); KT.toast('Batalla reabierta'); }
  else if (d.endact === 'rematch') { closeSheet(); restartGame(); }
  else if (d.endact === 'new') { closeSheet(); newGame(); }
}

// ── Vista reducida (móvil): turno, puntuación por turno y puntos de mando ──
function renderCompact() {
  const s = [scoreOf(0), scoreOf(1)];
  const dots = Array.from({ length: MAX_TP }, (_, n) => `<button class="g-tp-dot ${!S.ended && n + 1 === S.tp ? 'on' : n + 1 < S.tp || S.ended ? 'done' : ''}" data-tp="${n + 1}">${n + 1}</button>`).join('');
  const lead = s[0].total === s[1].total ? null : s[0].total > s[1].total ? 0 : 1;
  const pl = i => {
    const P = S.players[i], f = FACTIONS[P.factionId];
    return `
    <section class="gc-p p${i + 1} ${lead === i ? 'lead' : ''}">
      <div class="gc-ph">
        <button class="gc-team" data-sheet="team" data-p="${i}" title="Ver el comando"><img src="${f.img}" alt="" onerror="this.style.visibility='hidden'">
          <span><b>${esc(pname(i))}${isDual() && S.dual && SEAT === i ? ' <small class="g-you">tú</small>' : ''}</b><small>${esc(f.name)}</small></span></button>
        <button class="gc-vp" data-sheet="score" data-p="${i}" title="Puntos de victoria: ver detalle"><b id="v-vp-${i}">${s[i].total}</b><small>PV</small></button>
      </div>
      <div class="gc-cp"><span>Puntos de mando</span><button class="pm" data-bar="cp" data-p="${i}" data-v="-1" aria-label="Restar PM">−</button><b id="v-cp-${i}">${P.cp}</b><button class="pm" data-bar="cp" data-p="${i}" data-v="1" aria-label="Sumar PM">+</button></div>
      ${tpGrid(i)}
    </section>`;
  };
  $('#compact').innerHTML = `
    <header class="gc-top">
      <a class="btn-back" href="index.html" title="Volver a la app" aria-label="Volver a la app"><i class="ti ti-arrow-left"></i></a>
      <span class="g-net-slot"></span>
      <span style="flex:1"></span>
      <button class="icon-btn" data-c="undo" title="Deshacer" aria-label="Deshacer" ${hist.length ? '' : 'disabled'}><i class="ti ti-arrow-back-up"></i></button>
      <button class="icon-btn" data-sheet="seq" title="Secuencia de juego" aria-label="Secuencia de juego"><i class="ti ti-list-numbers"></i></button>
      <button class="icon-btn" data-c="view" title="Vista completa: operativos y mapa"><i class="ti ti-layout-board-split"></i><span>Completa</span></button>
      <button class="icon-btn" data-c="menu" title="Reiniciar o nueva partida" aria-label="Más opciones"><i class="ti ti-dots-vertical"></i></button>
    </header>
    <section class="gc-tp ${S.ended ? 'end' : ''}">
      <div class="lbl">${S.ended ? 'Fin de la batalla' : `Punto de inflexión <b>${S.tp}</b> de ${MAX_TP}`}</div>
      <div class="g-tp-row">
        <button class="g-tp-dot" data-tpstep="-1" aria-label="Punto de inflexión anterior"><i class="ti ti-chevron-left"></i></button>
        <div class="g-tp-dots">${dots}</div>
        <button class="g-tp-dot" data-tpstep="1" aria-label="Siguiente punto de inflexión" ${S.tp === MAX_TP || S.ended ? 'disabled' : ''}><i class="ti ti-chevron-right"></i></button>
      </div>
      <button class="g-ini ${S.ini == null ? '' : 'p' + (S.ini + 1)}" data-sheet="ini">Iniciativa: <b>${S.ini == null ? '—' : esc(pname(S.ini))}</b></button>
      ${OPT.activ && nextToAct() ? `<div class="g-act">${actLabel(nextToAct())}</div>` : ''}
    </section>
    ${pl(0)}${pl(1)}
    <footer class="gc-ft">
      <button class="icon-btn" data-sheet="crit"><i class="ti ti-target"></i> ${critOf(S.crit) ? esc(critOf(S.crit).name) : 'Op. crítica'}</button>
      <button class="icon-btn accent" data-c="end"><i class="ti ti-flag"></i> ${S.ended ? 'Ver resultado' : 'Fin de partida'}</button>
    </footer>`;
  renderNet();
}
function onCompactClick(e) {
  const c = e.target.closest('[data-c]');
  if (!c) { onBarClick(e); return; }
  const a = c.dataset.c;
  if (a === 'undo') undo();
  else if (a === 'view') toggleView();
  else if (a === 'end') endGame();
  else if (a === 'menu') openSheet('opt');
}

// ── Fin de partida ───────────────────────────────────────────
// force: sin preguntar (al pasar del último punto de inflexión)
function endGame(force) {
  if (!S?.started) return;
  if (S.ended) { openSheet('end'); return; }
  const go = () => { CTP = null; commit(() => { S.ended = true; }); saveHistory(); openSheet('end'); };
  if (force || S.tp >= MAX_TP) { go(); return; }
  const close = KT.modal('Terminar la batalla', `
    <div class="g-resume">
      <p>Vais por el <b>punto de inflexión ${S.tp}</b> de ${MAX_TP}. Al terminar se revela la operación principal de cada jugador y se calcula el total.</p>
      <p class="g-hint">Podrás reabrir la batalla desde el resultado si te has equivocado.</p>
      <div class="g-row"><button class="icon-btn accent" data-r="end"><i class="ti ti-flag"></i> Terminar y contar puntos</button><span style="flex:1"></span><button class="icon-btn" data-r="cancel">Seguir jugando</button></div>
    </div>`, 'flag');
  document.querySelector('.g-resume')?.addEventListener('click', ev => {
    const b = ev.target.closest('[data-r]'); if (!b) return;
    close(); if (b.dataset.r === 'end') go();
  });
}
function resultText() {
  const s = [scoreOf(0), scoreOf(1)], z = zoneOf(S.zone), m = mapOf(z, S.map), c = critOf(S.crit);
  const win = s[0].total === s[1].total ? null : s[0].total > s[1].total ? 0 : 1;
  const tt = [tpTotals(0), tpTotals(1)];
  const line = i => `${pname(i)} (${FACTIONS[S.players[i].factionId].name}): ${s[i].total} PV — crítica ${s[i].crit}, eliminación ${s[i].kill}, táctica ${s[i].tac}, principal +${s[i].prim}`;
  return [
    `Kill Team · ${z ? z.name + (m ? ' ' + m.label : '') : 'sin mapa'}${c ? ' · ' + c.name : ''}`,
    win == null ? `Empate a ${s[0].total}` : `Gana ${pname(win)} ${s[win].total}–${s[1 - win].total}`,
    line(0), line(1),
    'Por punto de inflexión: ' + [0, 1, 2, 3].map(n => `PI${n + 1} ${tt[0][n]}–${tt[1][n]}`).join(' · '),
  ].join('\n');
}
async function shareResult() {
  const text = resultText();
  try {
    if (navigator.share) await navigator.share({ title: 'Resultado de Kill Team', text });
    else { await navigator.clipboard.writeText(text); KT.toast('Resultado copiado al portapapeles', { type: 'ok' }); }
  } catch (e) { if (e?.name !== 'AbortError') { try { await navigator.clipboard.writeText(text); KT.toast('Resultado copiado', { type: 'ok' }); } catch { KT.toast('No se pudo compartir', { type: 'err' }); } } }
}
function endBody() {
  const s = [scoreOf(0), scoreOf(1)];
  const win = s[0].total === s[1].total ? null : s[0].total > s[1].total ? 0 : 1;
  const pl = i => {
    const P = S.players[i], f = FACTIONS[P.factionId], k = s[i].k;
    return `
    <section class="g-end-p p${i + 1} ${win === i ? 'win' : ''}">
      <header><img src="${f.img}" alt="" onerror="this.style.visibility='hidden'"><div><b>${esc(pname(i))}</b><small>${esc(f.name)} · ${esc(P.title)}</small></div><div class="tot">${s[i].total}<small>PV</small></div></header>
      ${tpGrid(i)}
      <div class="g-end-row"><span>Grado de eliminación <small>${k.dead} de ${k.start} enemigos incapacitados${s[i].bonus ? ' · +1PV por grado mayor que el rival' : ''}</small></span>
        <div class="g-spm"><button data-endadj data-p="${i}" data-v="-1" aria-label="Bajar grado">−</button><b>${k.grade}</b><button data-endadj data-p="${i}" data-v="1" aria-label="Subir grado">+</button></div></div>
      <div class="g-end-row col"><span>Operación principal <small>suma la mitad (hacia arriba) de lo puntuado con ella</small></span>
        <div class="g-pick prim">${['crit', 'kill', 'tac'].map(o => `<button class="${P.prim === o ? 'on' : ''}" data-endprim="${o}" data-p="${i}">${OPN[o].replace('Op. ', '').replace('de ', '')}<small>${s[i][o]} → +${Math.ceil(s[i][o] / 2)}</small></button>`).join('')}</div></div>
      <div class="g-end-sum"><span>Crítica <b>${s[i].crit}</b></span><i>+</i><span>Eliminación <b>${s[i].kill}</b></span><i>+</i><span>Táctica <b>${s[i].tac}</b></span><i>+</i><span>Principal <b>${s[i].prim}</b></span><i>=</i><span class="t"><b>${s[i].total}</b> PV</span></div>
    </section>`;
  };
  return `
    <div class="g-end">
      <div class="g-end-vs"><span class="p1 ${win === 0 ? 'w' : ''}">${esc(pname(0))}</span><b>${s[0].total}<i>–</i>${s[1].total}</b><span class="p2 ${win === 1 ? 'w' : ''}">${esc(pname(1))}</span></div>
      ${S.players.some(P => !P.prim) ? '<p class="g-hint warn"><i class="ti ti-alert-triangle"></i> Falta elegir la operación principal de algún jugador: márcala abajo para sumar su bonificación.</p>' : ''}
      <div class="g-end-cols">${pl(0)}${pl(1)}</div>
      <p class="g-hint">Corrige aquí cualquier punto: toca un PI para editarlo. El resultado se guarda en el historial y se actualiza con cada cambio.</p>
      <div class="g-row g-end-acts">
        <button class="icon-btn accent" data-endact="share"><i class="ti ti-share"></i> Compartir resultado</button>
        <a class="icon-btn" href="historial.html"><i class="ti ti-history"></i> Historial</a>
        <span style="flex:1"></span>
        <button class="icon-btn" data-endact="reopen" title="Volver a la batalla para seguir jugando"><i class="ti ti-arrow-back-up"></i> Reabrir</button>
        <button class="icon-btn" data-endact="rematch" title="Mismos comandos y misión, todo a cero"><i class="ti ti-refresh"></i> Revancha</button>
        <button class="icon-btn" data-endact="new"><i class="ti ti-plus"></i> Nueva partida</button>
      </div>
    </div>`;
}

// ── Comando del jugador: consulta rápida y enlaces ───────────
function teamBody(i) {
  const P = S.players[i], f = FACTIONS[P.factionId], eqAll = eqOptions(f).all;
  const txt = t => esc(t || '').replace(/\n/g, '<br>');
  const det = (n, t, extra = '') => `<details><summary>${esc(n)}${extra}</summary><p>${txt(t)}</p></details>`;
  const groups = {};
  P.ops.forEach(o => { const od = opData(P, o); if (!od) return; const k = o.label || od.name; (groups[k] = groups[k] || { od, n: 0, wpn: o.wpn }).n++; });
  const saved = P.src?.kind === 'roster' && (KT.store.get('rosters', []) || []).some(r => r.id === P.src.id);
  const L = ployList(P).filter(p => !p.uni);
  return `
    <div class="g-row g-team-links">
      ${saved ? `<a class="icon-btn accent" href="builder.html#r=${encodeURIComponent(P.src.id)}"><i class="ti ti-hammer"></i> Abrir mi lista guardada</a>` : ''}
      <a class="icon-btn ${saved ? '' : 'accent'}" href="index.html#${encodeURIComponent(f.id)}"><i class="ti ti-books"></i> Ficha completa del comando</a>
    </div>
    <p class="g-hint">La partida se queda guardada: en esas páginas verás el botón <b>Volver a la partida</b>.</p>
    <h4>Lista <small>${esc(P.title)} · ${P.ops.length} agentes</small></h4>
    <div class="g-team-ops">${Object.entries(groups).map(([n, g]) => `<div><b>${g.n > 1 ? g.n + '× ' : ''}${esc(n)}</b><small>${esc(g.wpn.join(' · '))}</small></div>`).join('')}</div>
    ${P.equipment.length ? `<h4>Equipo</h4><div class="g-ab">${P.equipment.map(id => { const it = eqAll.find(e => e.id === id); return det(it?.n || id, it?.t || ''); }).join('')}</div>` : ''}
    ${(f.frs || []).length ? `<h4>Reglas de facción</h4><div class="g-ab">${f.frs.map(r => det(r.name, r.text + (r.subs || []).map(x => '\n\n' + x.n + ': ' + x.t).join(''))).join('')}</div>` : ''}
    ${L.length ? `<h4>Ardides del comando</h4><div class="g-ab">${L.map(p => det(p.n, p.t, `<small>${p.k === 's' ? 'estrategia' : 'tiroteo'}</small>`)).join('')}</div>` : ''}`;
}

// ── Escenografía: qué es cada elemento del mapa ──────────────
function terrOf(g) {
  const T = window.TERRENO; if (!T || !g) return null;
  const pts = T.mapas[g.m.img], zn = T.zonas[g.z.id];
  return pts && zn ? { pts, zn } : null;
}
function terrLayer(img, zoneId, rot) {
  const T = window.TERRENO, pts = T?.mapas[img];
  if (!pts || !T.zonas[zoneId]) return '';
  return pts.map(([x, y, k]) => `<button class="g-th" data-terr="${k}" data-zone="${zoneId}" style="left:${rot ? 100 - x : x}%;top:${rot ? 100 - y : y}%" aria-label="Escenografía ${k}"></button>`).join('');
}
function terrHtml(zoneId, k) {
  const zn = window.TERRENO?.zonas[zoneId], t = zn?.[k]; if (!t) return null;
  const z = zoneOf(zoneId), src = z?.claves?.[t.c];
  const [x, y, w, h] = t.b;
  const pic = src ? `<div class="g-terr-pic" style="aspect-ratio:${(w * 536 / (h * 749)).toFixed(3)};background-image:url('${src}');background-size:${(10000 / w).toFixed(1)}% ${(10000 / h).toFixed(1)}%;background-position:${(x / (100 - w) * 100).toFixed(1)}% ${(y / (100 - h) * 100).toFixed(1)}%"></div>` : '';
  return { title: `${k} · ${t.n}`, cat: t.t, html: pic + (t.d ? `<p>${esc(t.d)}</p>` : '') };
}
function onTerrClick(e) {
  const b = e.target.closest('[data-terr]'); if (!b) return false;
  const info = terrHtml(b.dataset.zone, b.dataset.terr);
  if (info) showTip(b, info.title, info.cat, '', 't:' + b.dataset.terr + b.style.left + b.style.top, info.html);
  return true;
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
function showTip(anchor, title, cat, text, key, html) {
  if (tipEl && tipEl.dataset.key === key) { hideTip(); return; }
  hideTip();
  tipEl = document.createElement('div');
  tipEl.className = 'g-tip';
  tipEl.dataset.key = key || '';
  tipEl.innerHTML = `<small>${esc(cat || '')}</small><b>${esc(title)}</b>${html || `<p>${esc(text || '')}</p>`}`;
  if (html) tipEl.classList.add('pic');
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
    const see = P.tacShown || sheet.peek || (isDual() && mine(i));
    T.innerHTML = `<small>${esc(pname(i))} · operación táctica</small>${t && see ? esc(t.name) : t ? 'Oculta' : 'Elegir'}`;
    const list = `<p class="g-hint">Se elige en secreto al revelar los agentes.</p>` + tacPicker(P, sheet.all, P.tac);
    if (!t) B.innerHTML = mine(i) ? list : `<div class="g-secret"><i class="ti ti-hourglass"></i><p>${esc(pname(i))} aún no ha elegido su operación táctica.</p></div>`;
    else if (!P.tacShown && !sheet.peek && !(isDual() && mine(i))) B.innerHTML = `
      <div class="g-secret"><i class="ti ti-lock"></i><p>Operación táctica de <b>${esc(pname(i))}</b> oculta.</p>
        ${mine(i) ? `<button class="icon-btn accent" data-peek><i class="ti ti-eye"></i> Ver (solo ${esc(pname(i))})</button>` : '<p class="g-hint">Se mostrará cuando la revele.</p>'}</div>`;
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
      <div class="g-srow ${P.prim === key && (S.ended || sheet.peek || (isDual() && mine(i))) ? 'prim' : ''}">
        <div class="n"><b>${name}</b><small>${sub}</small></div>
        ${ctrl}
        <div class="g-sbar"><span style="--p:${Math.min(6, val) / 6 * 100}%"></span></div>
      </div>`;
    const pmc = (op, v) => `<div class="g-spm"><button data-sc="${op}" data-v="-1" aria-label="Restar">−</button><b>${v}</b><button data-sc="${op}" data-v="1" aria-label="Sumar">+</button></div>`;
    const showPrim = S.ended || sheet.peek || (isDual() && mine(i));
    const seeTac = P.tacShown || sheet.peek || (isDual() && mine(i));
    B.innerHTML = `
      <h4>Por punto de inflexión <small>toca un PI para puntuarlo</small></h4>
      ${tpGrid(i)}
      <h4>Por operación</h4>
      ${row('crit', 'Operación crítica', c ? esc(c.n + '. ' + c.name) : 'sin elegir', s.crit, `<div class="g-spm ro"><b>${s.crit}</b></div>`)}
      ${row('kill', 'Operación de eliminación', `Grado ${kk.grade}/5 · ${kk.dead} de ${kk.start} enemigos incapacitados${kk.next != null ? ` · siguiente grado con ${kk.next}` : ''}${s.bonus ? ' · +1 por grado mayor' : ''}${kk.adj ? ` · ajuste ${kk.adj > 0 ? '+' : ''}${kk.adj}` : ''}`, s.kill,
        `<div class="g-spm" title="Ajuste manual del grado (agentes que no cuentan, etc.)"><button data-sc="killAdj" data-v="-1" aria-label="Bajar grado">−</button><b>${s.kill}</b><button data-sc="killAdj" data-v="1" aria-label="Subir grado">+</button></div>`)}
      ${row('tac', 'Operación táctica', t ? (seeTac ? esc(t.name) : 'oculta') : 'sin elegir', s.tac, `<div class="g-spm ro"><b>${s.tac}</b></div>`)}
      <h4>Operación principal <small>(gambito estratégico del PI 1, secreta)</small></h4>
      ${(showPrim || !P.prim) && (mine(i) || S.ended)
        ? `<div class="g-pick prim">${['crit', 'kill', 'tac'].map((o, n) => `<button class="${P.prim === o ? 'on' : ''}" data-prim="${o}"><b>${n + 1}</b>${OPN[o].replace('Op. ', '')}</button>`).join('')}</div>`
        : `<div class="g-secret sm"><i class="ti ti-lock"></i><p>${P.prim ? 'Elegida y oculta hasta el final.' : 'Aún no la ha elegido.'}</p>${mine(i) ? '<button class="icon-btn" data-peek><i class="ti ti-eye"></i> Ver / cambiar</button>' : ''}</div>`}
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
  } else if (k === 'ini') {
    const r = S.iniRoll && S.iniRoll.tp === S.tp ? S.iniRoll : null;
    const prevNo = S.tp === 1 ? (S.ini0 != null ? 1 - S.ini0 : null) : (S.ini != null ? 1 - S.ini : null);
    T.innerHTML = `<small>Punto de inflexión ${S.tp}</small>Iniciativa`;
    const die = (v, k) => dieHtml(v, k);
    B.innerHTML = `
      <p>Tirada enfrentada (aplicad antes las reglas de tirada de vuestros equipos y las cartas de iniciativa). ${prevNo != null ? `Si hay empate gana quien no tenía la iniciativa: <b>${esc(pname(prevNo))}</b>.` : ''}</p>
      <div class="g-dice" data-rid="pi${S.tp}" data-rk="${r ? r.roll.join('-') : ''}"><span class="p1">${esc(pname(0))}</span>${die(r?.roll[0], 0)}<small>vs</small>${die(r?.roll[1], 1)}<span class="p2">${esc(pname(1))}</span>
        <button class="icon-btn accent ripple" data-iniroll><i class="ti ti-dice-5"></i> Tirar</button></div>
      ${r ? `<p class="g-hint">Gana la tirada <b>${esc(pname(r.win))}</b>${S.tp < MAX_TP ? ` · ${esc(pname(1 - r.win))} recibe la carta <b>±${S.tp}</b>` : ''}.</p>` : ''}
      <h4>¿Quién tiene la iniciativa?</h4>
      <div class="g-pbtns">${[0, 1].map(p => `<button class="g-pbtn p${p + 1} ${S.ini === p ? 'on' : ''}" data-setini="${p}">${esc(pname(p))}</button>`).join('')}</div>
      <p class="g-hint">El ganador de la tirada elige quién tiene la iniciativa. El perdedor (salvo en el PI 4) gana la carta de iniciativa del punto de inflexión.</p>`;
  } else if (k === 'keys') {
    const z = zoneOf(S.zone);
    T.innerHTML = `<small>Leyenda del terreno</small>${esc(z.name)}`;
    B.innerHTML = `<div class="g-keys">${z.claves.map(src => `<button data-img="${src}"><img src="${src}" alt="Leyenda de ${esc(z.name)}" loading="lazy"></button>`).join('')}</div>`;
  } else if (k === 'end') {
    const sc = [scoreOf(0), scoreOf(1)];
    const win = sc[0].total === sc[1].total ? null : sc[0].total > sc[1].total ? 0 : 1;
    box.style.setProperty('--pc', win == null ? 'var(--orange)' : `var(--p${win + 1})`);
    T.innerHTML = `<small>Fin de la batalla</small>${win == null ? 'Empate' : 'Gana ' + esc(pname(win))}`;
    B.innerHTML = endBody();
  } else if (k === 'close') {
    T.innerHTML = `<small>Cierre de turno</small>Punto de inflexión ${S.tp}`;
    B.innerHTML = closeBody();
  } else if (k === 'opt') {
    T.innerHTML = `<small>Partida</small>Opciones`;
    B.innerHTML = optBody();
  } else if (k === 'team') {
    const P = S.players[i], f = FACTIONS[P.factionId];
    T.innerHTML = `<small>${esc(pname(i))} · comando</small>${esc(f.name)}`;
    B.innerHTML = teamBody(i);
  }
  box.classList.toggle('wide', k === 'end' || k === 'close');
  animateDice();
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
      addScore(i, d.sc, v, selTp());
    }
  } else if (d.sheetGo) openSheet(d.sheetGo, +d.p);
  else if (t.hasAttribute('data-newgame')) { closeSheet(); newGame(); }
  else if (t.hasAttribute('data-iniroll')) {
    const prevNo = S.tp === 1 ? (S.ini0 != null ? 1 - S.ini0 : null) : (S.ini != null ? 1 - S.ini : null);
    let a = d6(), b = d6();
    while (a === b && prevNo == null) { a = d6(); b = d6(); }
    const win = a === b ? prevNo : a > b ? 0 : 1, lose = 1 - win;
    commit(() => {
      S.iniRoll = { tp: S.tp, roll: [a, b], win };
      S.ini = win;
      const card = 'i' + S.tp;
      if (S.tp < MAX_TP && S.players[lose].cards[card] === 0) S.players[lose].cards[card] = 1;
    });
    afterDice(() => KT.toast(`${esc(pname(win))} gana la tirada (${a}–${b})${a === b ? ' por empate' : ''}`, { type: 'ok' }));
  }
  else if (d.setini != null) commit(() => { S.ini = +d.setini; }, { only: 'bar' });
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
    const k = i + ':' + o.uid, on = !OPEN.has(k);
    on ? OPEN.add(k) : OPEN.delete(k);
    KT.store.set('partida.abiertos', [...OPEN]);
    card.classList.toggle('open', on);
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
  }
}

function onBoardClick(e) {
  if (!pop && onTerrClick(e)) return;
  if (e.target.closest('#objs')) { onObjsClick(e); return; }
  if (e.target.id === 'board-img') { if (pop) { pop = null; renderBoard(); return; } openViewer(); return; }
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.sheet) openSheet(t.dataset.sheet);
  else if (t.hasAttribute('data-flip')) { ROT = !ROT; KT.store.set('partida.rot', ROT); renderBoard(); }
  else if (t.hasAttribute('data-addobj')) {
    pop = pop?.add ? null : { add: true };
    renderBoard();
    if (pop) KT.toast('Toca en el mapa donde está el marcador');
  }
}

function setTP(n, force) {
  if (!S.ended && OPT.cierre && !force && n === S.tp + 1) { CTP = null; openSheet('close'); return; }
  if (S.ended) {                                  // reabrir la batalla
    if (n > MAX_TP) { openSheet('end'); return; }
    CTP = null;
    commit(() => { S.ended = false; S.tp = Math.min(n, MAX_TP); });
    return;
  }
  if (n > MAX_TP) { endGame(true); return; }
  if (n < 1 || n === S.tp) return;
  const forward = n > S.tp;
  const g = [killInfo(0).grade, killInfo(1).grade], old = S.tp;
  CTP = null;
  commit(() => {
    S.tp = n;
    S.players.forEach((P, i) => { for (let k = 0; k < MAX_TP; k++) P.score.killAt[k] = k + 1 < n ? (k + 1 >= old ? g[i] : P.score.killAt[k] ?? g[i]) : null; });
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
//  PREPARACIÓN — secuencia guiada (por defecto) o panel rápido.
//  En modo «dos dispositivos» la preparación (draft) se comparte:
//  cada dispositivo edita su asiento (SEAT 0 anfitrión, 1 invitado)
//  y el anfitrión decide la misión.
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
// Campos de la preparación que se sincronizan entre dispositivos
const SHARED = ['names', 'players', 'zone', 'map', 'crit', 'roll', 'win0', 'ini0', 'dzPick', 'tac', 'prim', 'roll1', 'win1', 'ini1', 'ready', 'room'];
const sharedOf = d => { const o = {}; SHARED.forEach(k => { o[k] = clone(d[k]); }); return o; };
const isDual = () => SEAT != null;
const mine = i => SEAT == null || SEAT === i;

function newDraft() {
  const z = zoneOf(S?.zone) || ZONAS[0];
  const d = draftBase(z);
  // usuario con sesión iniciada: su nombre y sus bandas primero (en su asiento)
  const me = KT.user?.current(), k = SEAT ?? 0;
  if (me) { d.usr[k] = me.id; if (!d.names[k]) d.names[k] = me.name; }
  return d;
}
function draftBase(z) {
  return {
    usr: [null, null],                                         // usuario elegido por jugador (solo este dispositivo)
    mode: 'wiz', step: 0,
    names: S ? S.players.map(p => p.name) : ['', ''],
    src: S && !S.dual ? S.players.map(p => p.src) : [null, null],
    zone: z.id, map: mapOf(z, S?.map) ? S.map : z.maps[0].id, crit: S?.crit ?? null,
    roll: null, win0: null, ini0: null, dzPick: null,        // tirada de preparación y zona de despliegue
    players: [null, null], built: null,
    tac: [null, null], tacAll: [false, false], cover: null,   // cover: jugador que está eligiendo en secreto
    roll1: null, win1: null, ini1: null, prim: [null, null], primCover: null,
    ready: [false, false], room: Net.cfg?.room || null,
  };
}

function openSetup() {
  const rosters = KT.store.get('rosters', []) || [];
  closeSheet(); hideTip();
  draft = draft || newDraft();
  // ?p1=<id> desde el constructor
  const q = new URLSearchParams(location.search).get('p1');
  if (q && rosters.some(r => r.id === q) && !draft.src[0] && !isDual()) draft.src[0] = { kind: 'roster', id: q };
  // ?liga=<id>&m=<enfrentamiento>: partida de liga, con los nombres ya puestos
  const qs = new URLSearchParams(location.search), lg = (KT.store.get('ligas', []) || []).find(x => x.id === qs.get('liga')), mt = lg?.matches.find(x => x.id === qs.get('m'));
  if (mt && !isDual() && !draft.liga) {
    const pl = id => lg.players.find(x => x.id === id);
    draft.liga = { id: lg.id, m: mt.id, name: lg.name };
    [mt.a, mt.b].forEach((id, k) => { const x = pl(id); if (!x) return; draft.names[k] = x.name; draft.usr[k] = x.user || null; });
    KT.toast(`Partida de «${esc(lg.name)}»: el resultado se apuntará solo al terminar`, { ms: 4500 });
  }
  renderSetup();
  $('#setup').classList.add('on');
  syncBody();
}

function renderSetup() {
  if (!draft) return;
  $('#btn-mode').hidden = isDual();
  $('#btn-mode').innerHTML = draft.mode === 'wiz' ? '<i class="ti ti-layout-columns"></i><span class="hide-sm">Saltar al panel</span>' : '<i class="ti ti-list-numbers"></i><span class="hide-sm">Preparación guiada</span>';
  $('#btn-close-setup').style.display = S && S.started && (!isDual() || S.dual === Net.cfg?.room) ? '' : 'none';
  // conserva el foco si se está escribiendo un nombre mientras llegan cambios del otro dispositivo
  const act = document.activeElement, nameIdx = act?.dataset?.name, sel = nameIdx != null ? [act.selectionStart, act.selectionEnd] : null;
  if (draft.mode === 'panel' && !isDual()) renderPanel(); else renderWizard();
  if (isDual() && SEAT === 0) KT.store.set('partida.lobby', draft);
  if (nameIdx != null) { const el = document.querySelector(`[data-name="${nameIdx}"]`); if (el) { el.focus(); try { el.setSelectionRange(...sel); } catch {} } }
  renderNet();
  animateDice();
}

// ── Bloques compartidos ──
function playerPicker(i) {
  const users = KT.user?.list() || [], usr = users.find(u => u.id === draft.usr?.[i]) || null;
  const rosters = (KT.store.get('rosters', []) || []).filter(r => !usr || !r.owner || r.owner === usr.id);
  const who = users.length ? `<div class="g-sp-users" role="group" aria-label="Usuario">
      <button class="${usr ? '' : 'on'}" data-usr="${i}" data-id="">Todos</button>
      ${users.map(u => `<button class="${usr?.id === u.id ? 'on' : ''}" data-usr="${i}" data-id="${u.id}"><i class="ti ti-user-circle"></i>${esc(u.name)}</button>`).join('')}</div>` : '';
  const cur = isDual() ? draft.src[i] : draft.src[i];
  const isOn = s => cur && cur.kind === s.kind && cur.id === s.id;
  const rost = rosters.length ? rosters.map(r => {
    const f = FACTIONS[r.factionId]; if (!f) return '';
    const n = r.ops.reduce((a, o) => a + o.qty, 0);
    return `<button class="g-opt ${isOn({ kind: 'roster', id: r.id }) ? 'on' : ''}" data-src="${i}" data-kind="roster" data-id="${r.id}">
      <img src="${f.img}" alt=""><span class="o"><b>${esc(r.name)}</b><small>${esc(f.name)} · ${n} agentes</small></span></button>`;
  }).join('') : `<div class="g-note">Aún no tienes comandos guardados en este dispositivo. <a href="builder.html" style="color:var(--orange)">Crea uno en el constructor</a> o elige un comando completo abajo.</div>`;
  const full = Object.values(FACTIONS).map(f => `<button class="g-opt ${isOn({ kind: 'faction', id: f.id }) ? 'on' : ''}" data-src="${i}" data-kind="faction" data-id="${f.id}">
      <img src="${f.img}" alt=""><span class="o"><b>${esc(f.name)}</b><small>Todos los agentes (${f.ops.length})</small></span></button>`).join('');
  return `
    <div class="g-sp p${i + 1}">
      <div class="g-sp-hd"><span class="t">J${i + 1}${isDual() ? ' · tú' : ''}</span><input value="${esc(draft.names[i])}" placeholder="Jugador ${i + 1}" data-name="${i}" aria-label="Nombre del jugador ${i + 1}"></div>
      ${mine(i) ? who : ''}
      <div class="g-sp-list">
        <div class="g-sp-sec">${usr ? 'Comandos de ' + esc(usr.name) : 'Mis comandos'}</div>${rost}
        <div class="g-sp-sec">Comando completo</div>${full}
      </div>
    </div>`;
}
// Tarjeta del rival (modo dos dispositivos)
function rivalCard(i) {
  const P = draft.players[i], f = P && FACTIONS[P.factionId];
  const online = KTD.peer;
  return `<div class="g-sp p${i + 1} g-rival">
    <div class="g-sp-hd"><span class="t">J${i + 1}</span><b class="g-rival-n">${esc(draft.names[i] || (i ? 'Invitado' : 'Anfitrión'))}</b>
      <span class="g-dot ${online ? 'on' : ''}" title="${online ? 'Conectado' : 'Desconectado'}"></span></div>
    <div class="g-sp-list">${P
      ? `<div class="g-rival-team"><img src="${f.img}" alt=""><div><b>${esc(f.name)}</b><small>${esc(P.title)} · ${P.ops.filter(o => o.inc !== false).length} agentes</small></div></div>`
      : `<div class="g-secret"><i class="ti ti-${online ? 'hourglass' : 'user-plus'}"></i><p>${online ? 'Eligiendo comando…' : i ? 'Todavía no se ha unido nadie.' : 'Esperando al anfitrión…'}</p></div>`}
      ${SEAT === 0 && i === 1 ? invitePanel() : ''}
    </div></div>`;
}
function invitePanel() {
  if (!Net.cfg) return '';
  const url = KTD.inviteUrl(Net.cfg);
  const msg = `¡Te reto a una partida de Kill Team! Únete desde tu móvil: ${url}`;
  return `<div class="g-invite ${KTD.peer ? 'joined' : ''}">
    <div class="g-qr" title="Escanea para unirte">${KTD.qrSvg(url)}</div>
    <div class="g-invite-b">
      <p>${KTD.peer ? '<i class="ti ti-circle-check"></i> Rival conectado' : 'Invita al otro jugador: escanea el QR o envíale el enlace.'}</p>
      <a class="icon-btn g-wa" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>
      ${navigator.share ? '<button class="icon-btn" data-share><i class="ti ti-share"></i> Compartir</button>' : ''}
      <button class="icon-btn" data-copy="${esc(url)}"><i class="ti ti-copy"></i> Copiar enlace</button>
      <button class="icon-btn" data-calinv title="Quedar un día: invitación para el calendario con el enlace de la partida"><i class="ti ti-calendar-event"></i> Proponer fecha</button>
    </div></div>`;
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

// ── Panel rápido (todo en una pantalla, un dispositivo) ──
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
function withInc(P) { if (P) P.ops.forEach(o => { if (o.inc === undefined) o.inc = true; }); return P; }
function ensurePlayers() {
  if (isDual()) return !!(draft.players[0] && draft.players[1]);
  const key = JSON.stringify(draft.src);
  if (draft.players[0] && draft.players[1] && draft.built === key) return true;
  const pl = [0, 1].map(i => draft.src[i] && buildPlayer(draft.src[i], draft.names[i].trim()));
  if (pl.some(p => !p)) return false;
  pl.forEach(withInc);
  draft.players = pl; draft.built = key; draft.tac = [null, null]; draft.prim = [null, null];
  return true;
}
function stepOk(n) {
  const id = STEPS[n].id;
  const seats = isDual() ? [SEAT] : [0, 1];
  if (id === 'jug') return isDual() ? !!(draft.players[0] && draft.players[1]) : !!(draft.src[0] && draft.src[1]);
  if (id === 'mis') return !!(mapOf(zoneOf(draft.zone), draft.map) && draft.crit);
  if (id === 'ini') return draft.ini0 != null && draft.dzPick != null;
  if (id === 'age') return isDual() ? !!draft.players[SEAT]?.ops.some(o => o.inc) : !!(draft.players[0] && draft.built === JSON.stringify(draft.src) && draft.players.every(P => P.ops.some(o => o.inc)));
  if (id === 'tac') return seats.every(i => draft.tac[i]);
  if (id === 'des') return true;
  if (id === 'pi1') return draft.ini1 != null && seats.every(i => draft.prim[i]);
  return true;
}
const stepHint = {
  jug: () => isDual() ? (KTD.peer ? 'Esperando a que ambos elijáis comando' : SEAT === 0 ? 'Invita al otro jugador y elige tu comando' : 'Elige tu comando') : 'Elige un comando para cada jugador',
  mis: () => isDual() && SEAT === 1 ? 'El anfitrión está eligiendo la misión' : 'Elige mapa y operación crítica (o pulsa Aleatorio)',
  ini: () => 'Indica quién tiene la iniciativa y qué zona de despliegue elige',
  age: () => isDual() ? 'Necesitas al menos un agente' : 'Cada jugador necesita al menos un agente',
  tac: () => isDual() ? 'Elige tu operación táctica' : 'Cada jugador debe elegir su operación táctica en secreto',
  pi1: () => isDual() ? 'Falta la iniciativa del PI 1 o tu operación principal' : 'Falta la iniciativa del PI 1 o alguna operación principal',
};

// Dados: uno por jugador, con su color. Se animan cuando cambia la tirada (también la que llega del otro dispositivo)
const dieHtml = (v, k) => `<span class="g-die dj${k + 1} ${v ? 'v' + v : 'empty'}" data-v="${v || ''}" role="img" aria-label="${v ? 'Dado: ' + v : 'Dado sin tirar'}">${'<i></i>'.repeat(9)}</span>`;
const DICE_SEEN = {};
function animateDice() {
  document.querySelectorAll('.g-dice[data-rid]').forEach(box => {
    const id = box.dataset.rid, key = box.dataset.rk, prev = DICE_SEEN[id];
    DICE_SEEN[id] = key;
    if (prev === undefined || prev === key || !key || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dice = [...box.querySelectorAll('.g-die')], fin = dice.map(d => d.dataset.v);
    box.classList.add('rolling');
    let n = 0;
    const tick = () => {
      if (!box.isConnected) return;
      const last = ++n > 12;
      dice.forEach((d, k) => { d.className = d.className.replace(/\bv\d\b/, 'v' + (last ? fin[k] : d6())); d.style.setProperty('--r', (last ? 0 : (Math.random() * 50 - 25)) + 'deg'); });
      if (last) { box.classList.remove('rolling'); box.classList.add('landed'); return; }
      setTimeout(tick, 60 + n * 6);
    };
    tick();
  });
}
const afterDice = fn => setTimeout(fn, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1250);
function diceRow(roll, label) {
  const die = (v, k) => dieHtml(v, k);
  return `<div class="g-dice" data-rid="${label}" data-rk="${roll ? roll.join('-') : ''}"><span class="p1">${esc(pname(0))}</span>${die(roll?.[0], 0)}<small>vs</small>${die(roll?.[1], 1)}<span class="p2">${esc(pname(1))}</span>
    <button class="icon-btn accent ripple" data-roll="${label}"><i class="ti ti-dice-5"></i> Tirar</button></div>`;
}
const pbtn = (attr, cur) => [0, 1].map(p => `<button class="g-pbtn p${p + 1} ${cur === p ? 'on' : ''}" data-${attr}="${p}">${esc(pname(p))}</button>`).join('');

function mapPreview(dzPlayer, z0, m0) {
  const z = z0 || zoneOf(draft.zone), m = m0 || mapOf(z, draft.map);
  if (!m) return '';
  const info = mapInfo(m.img);
  const lab = (p, side) => `<span class="g-dz s-${side} p${p + 1}">${esc(pname(p))}</span>`;
  const sides = dzPlayer == null
    ? `<span class="g-dz s-${info.j1} or">Zona naranja</span><span class="g-dz s-${OPP[info.j1]} gr">Zona contraria</span>`
    : lab(dzPlayer, info.j1) + lab(1 - dzPlayer, OPP[info.j1]);
  return `<div class="g-prev"><img src="${m.img}" alt="Mapa ${esc(m.label)}">${sides}${info.o.map(([x, y]) => `<i class="g-prev-o" style="left:${x}%;top:${y}%"></i>`).join('')}${terrLayer(m.img, z.id, false)}</div>`;
}

// ¿Está todo lo de este dispositivo listo para empezar?
const allOk = () => STEPS.every((_, k) => stepOk(k));

function renderWizard() {
  const n = draft.step, id = STEPS[n].id;
  const bar = `<div class="g-steps">${STEPS.map((s, k) => {
    const reach = k <= n || STEPS.slice(0, k).every((_, j) => stepOk(j));
    return `<button class="g-step ${k === n ? 'on' : k < n ? 'done' : ''}" data-step="${k}" ${reach ? '' : 'disabled'}><b>${k < n ? '<i class="ti ti-check"></i>' : k + 1}</b><span>${s.t}</span></button>`;
  }).join('')}</div>`;
  let body = '';
  if (isDual() && !Net.synced) {
    body = `<div class="g-secret"><i class="ti ti-loader-2 spin"></i><p>Conectando con la partida…</p></div>`;
  } else if (id === 'jug') {
    body = isDual()
      ? `<p class="g-wz-lead">Partida en <b>dos dispositivos</b>: cada jugador elige su comando, equipo y operaciones en su móvil. La batalla empieza cuando ambos estéis listos.
          ${SEAT === 0 ? '<button class="link-btn" data-dual="off">Volver a un solo dispositivo</button>' : '<button class="link-btn" data-dual="off">Salir de la partida</button>'}</p>
         <div class="g-wz-2">${SEAT === 0 ? playerPicker(0) + rivalCard(1) : rivalCard(0) + playerPicker(1)}</div>`
      : `<div class="g-mode">
           <button class="g-mode-b on"><i class="ti ti-device-mobile"></i><b>Un dispositivo</b><small>Los dos jugadores comparten esta pantalla</small></button>
           <button class="g-mode-b" data-dual="on"><i class="ti ti-devices"></i><b>Dos dispositivos</b><small>Invita por WhatsApp o QR: cada uno usa su móvil</small></button>
         </div>
         <p class="g-wz-lead">Elegid los equipos. Podéis usar un comando guardado del constructor o el comando completo de una facción.</p>
         <div class="g-wz-2">${playerPicker(0)}${playerPicker(1)}</div>`;
  } else if (id === 'mis') {
    const ro = isDual() && SEAT !== 0;
    body = `<div class="g-wz-head"><p class="g-wz-lead">${ro ? `<b>${esc(pname(0))}</b> elige la zona, el mapa y la operación crítica.` : 'Montad la zona de aniquilación y determinad la operación crítica; después colocad los marcadores de objetivo.'}</p>
      ${ro ? '' : '<button class="icon-btn ripple" data-rnd><i class="ti ti-dice-5"></i> Aleatorio</button>'}</div>
      <div class="g-wz-card ${ro ? 'ro' : ''}">${missionPicker(true)}</div>`;
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
    body = `<p class="g-wz-lead">${isDual() ? 'Elige <b>en secreto</b> tu operación táctica: tu rival no la verá hasta que la reveles.' : 'Cada jugador elige <b>en secreto</b> una operación táctica de sus arquetipos. Pasaos el dispositivo: el otro jugador no debe mirar.'}</p>
      <div class="g-wz-2">${[0, 1].map(i => tacPanel(i)).join('')}</div>`;
  } else if (id === 'des') {
    const ini = draft.ini0;
    body = `<div class="g-wz-cols">
      <div class="g-wz-card">
        <h3><b>1</b> Equipo</h3><p>Alternad colocando los elementos de equipo, empezando por <b>${esc(pname(ini))}</b>.</p>
        <h3><b>2</b> Agentes</h3><p>Alternad desplegando <b>⅓ del equipo</b> cada vez, totalmente dentro de vuestra zona de despliegue y con <b>orden de ocultarse</b>, empezando por <b>${esc(pname(ini))}</b>.</p>
        <ul class="g-wz-list">${[0, 1].map(i => { const P = draft.players[i]; if (!P) return ''; const k = P.ops.filter(o => o.inc).length; return `<li><span class="p${i + 1}">${esc(pname(i))}</span> ${k} agentes · tandas de ${Math.ceil(k / 3)}</li>`; }).join('')}</ul>
        <p class="g-hint">Todos los agentes empiezan con orden de ocultarse; podrás cambiarla en su ficha.</p>
      </div>
      <div class="g-wz-card"><h3><b>3</b> Zonas de despliegue</h3>${mapPreview(draft.dzPick)}</div>
    </div>`;
  } else if (id === 'pi1') {
    const w = draft.win1, ini = draft.ini1, loser = w == null ? null : 1 - w;
    body = `<div class="g-wz-cols">
      <div class="g-wz-card">
        <h3><b>1</b> Iniciativa del punto de inflexión 1</h3>
        <p>Tirada enfrentada (aplicad antes las reglas de tirada de vuestros equipos). Si hay empate gana quien no tenía la iniciativa: <b>${esc(pname(1 - (draft.ini0 ?? 0)))}</b>.</p>
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
  let right;
  if (!last) right = `<button class="icon-btn accent ripple" data-next ${ok ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px">Siguiente <i class="ti ti-chevron-right"></i></button>`;
  else if (!isDual()) right = `<button class="icon-btn accent ripple" data-finish ${ok ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px"><i class="ti ti-swords"></i> ¡A la batalla!</button>`;
  else {
    const me = draft.ready[SEAT], other = draft.ready[1 - SEAT];
    right = `<span class="g-readys"><span class="${draft.ready[0] ? 'on' : ''}">${esc(pname(0))}</span><span class="${draft.ready[1] ? 'on' : ''}">${esc(pname(1))}</span></span>
      <button class="icon-btn ${me ? '' : 'accent'} ripple" data-ready ${allOk() || me ? '' : 'disabled'} style="height:38px;padding:0 18px;font-size:13px"><i class="ti ti-${me ? 'x' : 'circle-check'}"></i> ${me ? 'No estoy listo' : '¡Estoy listo!'}</button>`;
    if (me && !other) right = `<span class="sp-wait"><i class="ti ti-hourglass"></i> Esperando a ${esc(pname(1 - SEAT))}…</span>` + right;
  }
  const hint = isDual() && last
    ? (!allOk() ? (ok ? 'Completa los pasos anteriores' : stepHint[id]()) : draft.ready[SEAT] ? '' : 'Todo listo: pulsa «¡Estoy listo!»')
    : ok ? `Paso ${n + 1} de ${STEPS.length}` : stepHint[id]?.();
  $('#setup-ft').innerHTML = `
    <button class="icon-btn" data-back ${n ? '' : 'disabled'}><i class="ti ti-chevron-left"></i> Atrás</button>
    <span class="sp">${esc(hint || '')}</span>
    ${right}`;
}

function agePanel(i) {
  const P = draft.players[i];
  if (!P) return `<div class="g-sp p${i + 1}"><div class="g-sp-list"><div class="g-secret"><i class="ti ti-hourglass"></i><p>Esperando a ${esc(pname(i))}…</p></div></div></div>`;
  const f = FACTIONS[P.factionId], E = eqOptions(f);
  const max = f.roster?.equipment?.slots || 4;
  const inc = P.ops.filter(o => o.inc).length;
  const ro = !mine(i);
  const eqBtn = e => `<button class="g-eq ${P.equipment.includes(e.id) ? 'on' : ''}" data-eq="${i}" data-id="${esc(e.id)}" title="${esc(e.t || '')}">${esc(e.n)}</button>`;
  return `<div class="g-sp p${i + 1} ${ro ? 'ro' : ''}">
    <div class="g-sp-hd"><span class="t">${esc(pname(i))}</span><span class="g-sp-sub">${esc(f.name)} · ${inc}/${P.ops.length} agentes</span></div>
    <div class="g-sp-list">
      <div class="g-sp-sec">Agentes${P.src?.kind === 'faction' && !ro ? ' · desmarca los que no juegan' : ''}</div>
      <div class="g-ages">${P.ops.map(o => { const od = f.ops.find(x => x.id === o.opId); return `<button class="g-age ${o.inc ? 'on' : ''}" data-age="${i}" data-u="${o.uid}"><i class="ti ti-${o.inc ? 'checkbox' : 'square'}"></i>${esc((o.label || od.name) + (o.n ? ' #' + o.n : ''))}</button>`; }).join('')}</div>
      <div class="g-sp-sec">Equipo · ${P.equipment.length}/${max}</div>
      <div class="g-eqs">${E.fac.map(eqBtn).join('')}</div>
      <details class="g-old" ${P.equipment.some(id => E.uni.some(u => u.id === id)) ? 'open' : ''}><summary class="g-sp-sec">Equipo universal (${E.uni.length})</summary><div class="g-eqs">${E.uni.map(eqBtn).join('')}</div></details>
    </div></div>`;
}
function tacPanel(i) {
  const P = draft.players[i];
  if (!P) return `<div class="g-sp p${i + 1}"><div class="g-sp-list"><div class="g-secret"><i class="ti ti-hourglass"></i><p>Esperando a ${esc(pname(i))}…</p></div></div></div>`;
  let body;
  if (isDual()) {
    body = mine(i)
      ? tacPicker(P, draft.tacAll[i], draft.tac[i])
      : `<div class="g-secret"><i class="ti ti-${draft.tac[i] ? 'circle-check' : 'hourglass'}"></i><p>${draft.tac[i] ? `<b>${esc(pname(i))}</b> ya ha elegido su operación táctica.` : `${esc(pname(i))} está eligiendo…`}</p></div>`;
  } else body = draft.cover === i
    ? tacPicker(P, draft.tacAll[i], draft.tac[i]) + `<div class="g-row"><span style="flex:1"></span><button class="icon-btn accent" data-hide="${i}" ${draft.tac[i] ? '' : 'disabled'}><i class="ti ti-lock"></i> Ocultar y pasar el dispositivo</button></div>`
    : draft.cover != null
      ? `<div class="g-secret"><i class="ti ti-eye-off"></i><p>${esc(pname(draft.cover))} está eligiendo. No mires.</p></div>`
      : `<div class="g-secret"><i class="ti ti-${draft.tac[i] ? 'circle-check' : 'lock'}"></i>
        <p>${draft.tac[i] ? `<b>${esc(pname(i))}</b> ya ha elegido su operación táctica.` : `Turno de <b>${esc(pname(i))}</b>.`}</p>
        <button class="icon-btn ${draft.tac[i] ? '' : 'accent'}" data-cover="${i}"><i class="ti ti-eye"></i> ${draft.tac[i] ? 'Ver / cambiar' : 'Soy ' + esc(pname(i)) + ': elegir'}</button></div>`;
  return `<div class="g-sp p${i + 1}"><div class="g-sp-hd"><span class="t">${esc(pname(i))}</span><span class="g-sp-sub">${esc(archetypes(P).join(' · '))}</span></div><div class="g-sp-list">${body}</div></div>`;
}
function primPanel(i) {
  const v = draft.prim[i];
  const open = isDual() ? mine(i) : draft.primCover === i;
  const btns = `<div class="g-pick prim">${['crit', 'kill', 'tac'].map((o, n) => `<button class="${v === o ? 'on' : ''}" data-primw="${i}" data-o="${o}"><b>${n + 1}</b>${OPN[o].replace('Op. ', '')}</button>`).join('')}</div>`;
  let ctl;
  if (open) ctl = btns;
  else if (isDual()) ctl = `<span class="g-hint">${v ? '<i class="ti ti-circle-check"></i> Ya ha elegido' : 'Eligiendo…'}</span>`;
  else ctl = `<button class="icon-btn ${v ? '' : 'accent'}" data-primcover="${i}"><i class="ti ti-${v ? 'circle-check' : 'lock'}"></i> ${v ? 'Elegida · ver' : 'Elegir en secreto'}</button>`;
  return `<div class="g-prim p${i + 1}"><span class="who">${esc(pname(i))}</span>${ctl}</div>`;
}

function rollOff(tieTo) {
  let a, b;
  do { a = d6(); b = d6(); } while (a === b && tieTo == null);
  return { roll: [a, b], win: a === b ? tieTo : a > b ? 0 : 1 };
}

function onSetupClick(e) {
  const t = e.target.closest('button, input[type=checkbox], a[data-copy]');
  if (!t || t.disabled) return;
  const d = t.dataset;
  // acciones que no cambian la preparación compartida
  if (d.dual === 'on') { Net.host(); return; }
  if (d.dual === 'off') { Net.leave(true); return; }
  if (d.copy) { navigator.clipboard?.writeText(d.copy).then(() => KT.toast('Enlace copiado', { type: 'ok' }), () => KT.toast(d.copy, { ms: 8000 })); return; }
  if (t.hasAttribute('data-share')) { const url = KTD.inviteUrl(Net.cfg); navigator.share({ title: 'Kill Team', text: '¡Te reto a una partida de Kill Team!', url }).catch(() => {}); return; }
  if (t.closest('.ro')) return;                                         // paneles del rival / misión del invitado
  const before = isDual() ? sharedOf(draft) : null;
  const ownChange = () => { if (isDual()) draft.ready[SEAT] = false; };
  const hostOnly = () => isDual() && SEAT !== 0;
  if (d.usr != null) {
    const i = +d.usr, u = KT.user.byId(d.id);
    if (!mine(i)) return;
    draft.usr = draft.usr || [null, null];
    const names = KT.user.list().map(x => x.name);
    draft.usr[i] = u ? u.id : null;
    if (u && (!draft.names[i].trim() || names.includes(draft.names[i]))) draft.names[i] = u.name;   // no pisa un nombre escrito a mano
  }
  else if (d.src != null) {
    const i = +d.src;
    if (!mine(i)) return;
    draft.src[i] = { kind: d.kind, id: d.id };
    if (isDual()) { draft.players[i] = withInc(buildPlayer(draft.src[i], draft.names[i].trim())); draft.tac[i] = null; draft.prim[i] = null; ownChange(); }
  }
  else if (d.zone) { if (hostOnly()) return; const z = zoneOf(d.zone); draft.zone = z.id; if (!mapOf(z, draft.map)) draft.map = z.maps[0].id; draft.dzPick = null; }
  else if (d.map) { if (hostOnly()) return; draft.map = d.map; draft.dzPick = null; }
  else if (d.crit) { if (hostOnly()) return; draft.crit = draft.crit === +d.crit ? null : +d.crit; }
  else if (t.hasAttribute('data-rnd')) {
    if (hostOnly()) return;
    const z = pick(ZONAS), m = pick(z.maps.filter(m => !m.old)), c = pick(OPS.crit);
    Object.assign(draft, { zone: z.id, map: m.id, crit: c.n, dzPick: null });
    KT.toast(`${z.name} · mapa ${m.label} · ${c.name}`, { type: 'ok' });
  }
  else if (d.roll === 'r0') { const r = rollOff(null); Object.assign(draft, { roll: r.roll, win0: r.win, ini0: r.win, dzPick: null }); afterDice(() => KT.toast(`${esc(pname(r.win))} gana la tirada (${r.roll[0]}–${r.roll[1]})`, { type: 'ok' })); }
  else if (d.win0 != null) { Object.assign(draft, { win0: +d.win0, ini0: +d.win0, roll: null, dzPick: null }); }
  else if (d.ini0 != null) { draft.ini0 = +d.ini0; draft.dzPick = null; }
  else if (d.dz) { draft.dzPick = d.dz === 'or' ? draft.ini0 : 1 - draft.ini0; }
  else if (d.age != null) { if (!mine(+d.age)) return; const o = draft.players[+d.age].ops.find(x => x.uid === d.u); o.inc = !o.inc; ownChange(); }
  else if (d.eq != null) {
    if (!mine(+d.eq)) return;
    const P = draft.players[+d.eq], max = FACTIONS[P.factionId].roster?.equipment?.slots || 4;
    if (P.equipment.includes(d.id)) P.equipment = P.equipment.filter(x => x !== d.id);
    else if (P.equipment.length >= max) { KT.toast(`Máximo ${max} opciones de equipo`, { type: 'err' }); return; }
    else P.equipment = [...P.equipment, d.id];
    ownChange();
  }
  else if (d.cover != null) { draft.cover = +d.cover; }
  else if (d.hide != null) { draft.cover = null; }
  else if (d.tac) { const i = isDual() ? SEAT : draft.cover; if (i == null) return; draft.tac[i] = d.tac; ownChange(); }
  else if (t.hasAttribute('data-all')) { const i = isDual() ? SEAT : draft.cover; draft.tacAll[i] = t.checked; }
  else if (d.roll === 'r1') { const r = rollOff(1 - (draft.ini0 ?? 0)); Object.assign(draft, { roll1: r.roll, win1: r.win, ini1: r.win }); afterDice(() => KT.toast(`${esc(pname(r.win))} gana la tirada${r.roll[0] === r.roll[1] ? ' (empate)' : ''} (${r.roll[0]}–${r.roll[1]})`, { type: 'ok' })); }
  else if (d.win1 != null) { Object.assign(draft, { win1: +d.win1, ini1: +d.win1, roll1: null }); }
  else if (d.ini1 != null) { draft.ini1 = +d.ini1; }
  else if (d.primcover != null) { draft.primCover = +d.primcover; }
  else if (d.primw != null) { const i = +d.primw; if (!mine(i)) return; draft.prim[i] = d.o; draft.primCover = null; ownChange(); if (!isDual()) KT.toast(`${esc(pname(i))} ya ha elegido`, { ms: 1400 }); }
  else if (d.step != null) { leaveStep(); draft.step = +d.step; }
  else if (t.hasAttribute('data-back')) { leaveStep(); draft.step = Math.max(0, draft.step - 1); }
  else if (t.hasAttribute('data-next')) { if (!stepOk(draft.step)) return; leaveStep(); draft.step++; $('#setup-body').scrollTop = 0; }
  else if (t.hasAttribute('data-finish')) { finishWizard(); return; }
  else if (t.hasAttribute('data-start')) { startQuick(); return; }
  else if (t.hasAttribute('data-ready')) { if (!draft.ready[SEAT] && !allOk()) return; draft.ready[SEAT] = !draft.ready[SEAT]; }
  else return;
  if (isDual()) { Net.ops('L', diff(before, sharedOf(draft))); Net.checkStart(); }
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
    return { ...clone(P), name: (draft.names[i] || '').trim(), ops, tac: draft.tac[i], tacShown: false, prim: draft.prim[i], cards };
  });
  begin({ players, ini: draft.ini1, ini0: draft.ini0, dz: draft.dzPick ?? 0 });
  KT.store.del('partida.lobby');
}
function begin({ players, ini, ini0, dz }) {
  hist.length = 0;
  const d = draft;
  draft = null; pop = null;
  S = { v: V, gid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), started: true, ended: false, tp: 1, ini, ini0,
    zone: d.zone, map: d.map, crit: d.crit, dz, players, obj: initObjs(d.zone, d.map, d.crit), dual: isDual() ? Net.cfg.room : null,
    start: { ini, cards: players.map(P => clone(P.cards)) } };
  if (d.liga) S.liga = d.liga;
  save();
  if (isDual()) Net.startGame();
  enterGame();
}
function enterGame() {
  $('#setup').classList.remove('on'); syncBody();
  history.replaceState(null, '', location.pathname);
  render(); syncUndo();
  KT.toast('¡Que empiece la batalla!', { type: 'ok' });
  prefetch(); keepAwake();
}
// ── Reiniciar la partida en curso (mismos comandos y misión, todo a cero) ──
function restartGame() {
  if (!S?.started) return;
  commit(() => {
    const st = S.start || {};
    S.gid = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    Object.assign(S, { tp: 1, ended: false, ini: st.ini ?? null, iniRoll: null, obj: initObjs(S.zone, S.map, S.crit) });
    S.players.forEach((P, i) => {
      P.ops.forEach(o => { o.w = opData(P, o)?.s.h ?? o.w; o.order = 'conceal'; o.used = false; });
      Object.assign(P, { cp: 2, tacShown: false, ployUsed: {}, score: newScore(), cards: clone(st.cards?.[i]) || { rr: 0, i1: 0, i2: 0, i3: 0 } });
    });
  });
  OPEN.clear(); KT.store.set('partida.abiertos', []);
  pop = null; closeSheet(); renderBoard();
  KT.toast('Partida reiniciada: punto de inflexión 1', { type: 'ok', action: 'Deshacer', onAction: undo });
}
function askRestart() {
  if (!S?.started) return;
  const close = KT.modal('Reiniciar partida', `
    <div class="g-resume">
      <p>Se vuelve al <b>punto de inflexión 1</b> con los mismos comandos, operaciones y misión: heridas, PM, PV, cartas y marcadores a cero.${S.dual ? ' Se reinicia también en el otro dispositivo.' : ''}</p>
      <p class="g-hint">Si quieres otros comandos u otra misión, usa «Nueva partida».</p>
      <div class="g-row"><button class="icon-btn accent" data-r="restart"><i class="ti ti-refresh"></i> Reiniciar</button>
        <button class="icon-btn" data-r="new"><i class="ti ti-plus"></i> Nueva partida</button><span style="flex:1"></span>
        <button class="icon-btn" data-r="cancel">Cancelar</button></div>
    </div>`, 'refresh');
  resumeButtons(close);
}
// Al abrir la página con una partida guardada: continuar, reiniciar o empezar otra
function askResume() {
  const z = zoneOf(S.zone), m = mapOf(z, S.map), c = critOf(S.crit);
  const sc = [scoreOf(0), scoreOf(1)];
  const close = KT.modal(S.ended ? 'Última partida' : 'Partida en curso', `
    <div class="g-resume">
      <div class="g-resume-vs">${[0, 1].map(i => { const f = FACTIONS[S.players[i].factionId]; return `<div class="p${i + 1}"><img src="${f.img}" alt=""><b>${esc(pname(i))}</b><small>${esc(f.name)}</small><span>${sc[i].total} PV</span></div>`; }).join('<i>vs</i>')}</div>
      <p class="g-hint" style="text-align:center">${S.ended ? 'Batalla terminada' : 'Punto de inflexión ' + S.tp}${z ? ' · ' + esc(z.name) : ''}${m ? ' · mapa ' + esc(m.label) : ''}${c ? ' · ' + esc(c.name) : ''}</p>
      <div class="g-row" style="justify-content:center">
        ${S.ended ? '' : '<button class="icon-btn accent" data-r="cancel"><i class="ti ti-player-play"></i> Continuar</button>'}
        <button class="icon-btn ${S.ended ? 'accent' : ''}" data-r="new"><i class="ti ti-plus"></i> Nueva partida</button>
        <button class="icon-btn" data-r="restart"><i class="ti ti-refresh"></i> ${S.ended ? 'Jugar otra vez igual' : 'Reiniciar'}</button>
        ${S.ended ? '<button class="icon-btn" data-r="result"><i class="ti ti-eye"></i> Ver resultado</button>' : ''}
      </div>
    </div>`, 'swords');
  resumeButtons(close);
}
function resumeButtons(close) {
  document.querySelectorAll('.cmdk [data-r]').forEach(b => b.addEventListener('click', () => {
    close();
    if (b.dataset.r === 'restart') restartGame();
    else if (b.dataset.r === 'new') newGame();
    else if (b.dataset.r === 'result') openSheet('end');
  }));
}

function closeSetup() { if (S && S.started) { $('#setup').classList.remove('on'); syncBody(); draft = null; if (isDual() && SEAT === 0 && S.dual === Net.cfg?.room) Net.snapSoon(0); } }
function newGame() {
  if (isDual() && SEAT === 1) { KT.toast('El anfitrión es quien prepara la siguiente partida'); return; }
  draft = null; openSetup();
  if (isDual()) { draft.room = Net.cfg.room; Net.lobby(); }
}

// ════════════════════════════════════════════════════════════
//  RED — partida en dos dispositivos (ver js/dual.js)
//  El anfitrión es la referencia: aplica los cambios del invitado,
//  los reenvía con una huella del estado y publica una instantánea
//  para quien se conecte (o reconecte) después.
// ════════════════════════════════════════════════════════════
let SEAT = null;
const Net = {
  cfg: null, synced: false, pending: new Set(), snapT: null, facSent: new Set(),
  rid: () => Math.random().toString(36).slice(2, 10),
  bind() {
    KTD.onMessage = (m, retained) => this.receive(m, retained);
    KTD.onPeer = on => { if (on) this.facSent.clear(); renderNet(); if ($('#setup').classList.contains('on')) renderSetup(); if (on && SEAT === 0) this.snapSoon(0); KT.toast(on ? `${esc(pname(1 - SEAT))} está conectado` : `${esc(pname(1 - SEAT))} se ha desconectado`, { type: on ? 'ok' : 'err' }); };
    KTD.onState = () => renderNet();
  },
  async host() {
    if (!KTD.supported) { KT.toast('Este navegador no permite el modo dos dispositivos', { type: 'err' }); return; }
    KT.toast('Creando la sala…', { ms: 1500 });
    try {
      SEAT = 0; this.bind();
      this.cfg = await KTD.connect({ ...KTD.newRoom(), seat: 0 });
      KT.store.set('sala', this.cfg);
      this.synced = true;
      // lo ya elegido en este dispositivo pasa a mi asiento
      draft.room = this.cfg.room; draft.ready = [false, false]; draft.mode = 'wiz';
      if (draft.src[0]) draft.players[0] = withInc(buildPlayer(draft.src[0], draft.names[0].trim()));
      draft.players[1] = null; draft.src[1] = null; draft.names[1] = ''; draft.tac = [draft.tac[0], null]; draft.prim = [draft.prim[0], null];
      renderSetup(); this.snapSoon(0);
    } catch (e) { SEAT = null; this.cfg = null; KT.toast('No se pudo conectar con el servidor de partidas. Revisa la conexión a internet.', { type: 'err', ms: 5000 }); renderSetup(); }
  },
  async join(cfg) {
    SEAT = 1; this.bind(); this.synced = false;
    draft = draft || newDraft();
    openSetup();
    try {
      this.cfg = await KTD.connect({ ...cfg, seat: 1 });
      KT.store.set('sala', this.cfg);
      KTD.send({ t: 'hello' });
      setTimeout(() => { if (!this.synced) KTD.send({ t: 'snap?' }); }, 2500);
    } catch (e) { KT.toast('No se pudo conectar con la partida. Revisa la conexión a internet.', { type: 'err', ms: 5000 }); }
  },
  async resume(cfg) {
    SEAT = cfg.seat; this.bind(); this.synced = SEAT === 0;
    try { this.cfg = await KTD.connect(cfg); if (SEAT === 1) KTD.send({ t: 'snap?' }); else this.snapSoon(0); }
    catch { this.cfg = cfg; KT.toast('Sin conexión con el otro dispositivo. Se reintentará al recargar.', { type: 'err', ms: 4000 }); }
    renderNet();
  },
  leave(ask) {
    if (ask && !confirm('¿Salir del modo dos dispositivos?')) return;
    KTD.close(); this.cfg = null; SEAT = null; this.synced = false; KT.store.del('sala');
    if (S?.dual) { S.dual = null; save(); }
    if (draft) { draft.room = null; draft.ready = [false, false]; }
    history.replaceState(null, '', location.pathname);
    renderNet(); if ($('#setup').classList.contains('on')) renderSetup();
  },
  // Enviar mis cambios (ch: 'L' preparación · 'S' partida)
  ops(ch, ops) {
    if (!this.cfg || !ops || !ops.length) return;
    if (ch === 'S' && S?.dual !== this.cfg.room) return;
    const id = this.rid();
    this.sendFacs();
    if (SEAT === 0) { KTD.send({ t: 'ops', ch, id, ops, h: this.hash(ch) }); this.snapSoon(); }
    else { this.pending.add(id); KTD.send({ t: 'ops', ch, id, ops }); setTimeout(() => this.pending.delete(id), 8000); }
  },
  hash(ch) { return ch === 'S' ? hashOf(S) : hashOf(sharedOf(draft)); },
  phase() { return draft ? 'lobby' : 'game'; },
  data() { return { phase: this.phase(), L: draft ? sharedOf(draft) : null, S: S?.dual === this.cfg?.room ? S : null, F: this.customs() }; },
  // Comandos añadidos por el usuario (js/comandos.js) que están en juego: el otro dispositivo puede no tenerlos
  customs() {
    const ids = new Set([...(draft?.players || []), ...(S?.players || [])].filter(Boolean).map(P => P.factionId));
    const out = {};
    ids.forEach(id => { if (FACTIONS[id]?._user && window.KTC) out[id] = KTC.pack(FACTIONS[id]).comando; });
    return out;
  },
  sendFacs() {
    Object.entries(this.customs()).forEach(([id, f]) => { if (!this.facSent.has(id)) { this.facSent.add(id); KTD.send({ t: 'fac', f }); } });
  },
  gotFacs(F) {
    let n = 0;
    Object.values(F || {}).forEach(f => { try { if (KTC.receive(f)) { n++; KT.toast(`Recibido el comando «${esc(f.name)}» del otro jugador`, { type: 'ok' }); } } catch {} });
    return n;
  },
  snapSoon(ms = 1200) {
    if (SEAT !== 0 || !this.cfg) return;
    clearTimeout(this.snapT);
    this.snapT = setTimeout(() => { const d = this.data(); KTD.snapshot(d); }, ms);
  },
  startGame() { this.sendFacs(); KTD.send({ t: 'start', S }); this.snapSoon(0); },
  lobby() { this.sendFacs(); KTD.send({ t: 'lobby', L: sharedOf(draft) }); this.snapSoon(0); },
  checkStart() {
    if (SEAT === 0 && draft && draft.ready[0] && draft.ready[1] && draft.players[0] && draft.players[1]) {
      KT.toast('¡Los dos estáis listos!', { type: 'ok' });
      setTimeout(() => { if (draft && draft.ready[0] && draft.ready[1]) finishWizard(); }, 900);
    }
  },
  applyL(L) {
    if (!draft) draft = newDraft();
    SHARED.forEach(k => { if (k in L) draft[k] = clone(L[k]); });
  },
  receive(m, retained) {
    if (m.t === 'fac') {
      if (this.gotFacs({ x: m.f })) { if ($('#setup').classList.contains('on')) renderSetup(); else if (S) render(); }
      return;
    }
    if (m.F) this.gotFacs(m.F);
    if (SEAT === 0) {                                   // ── anfitrión
      if (m.t === 'hello' || m.t === 'snap?') { KTD.send({ t: 'snap', ...this.data() }); return; }
      if (m.t === 'ops') {
        if (m.ch === 'L' && draft) {
          Object.assign(draft, applyOps(sharedOf(draft), m.ops));
          if ($('#setup').classList.contains('on')) renderSetup();
          KTD.send({ t: 'ops', ch: 'L', id: m.id, ops: m.ops, origin: 1, h: this.hash('L') });
          this.checkStart();
        } else if (m.ch === 'S' && S?.dual === this.cfg.room) {
          S = applyOps(S, m.ops); save(); render();
          KTD.send({ t: 'ops', ch: 'S', id: m.id, ops: m.ops, origin: 1, h: this.hash('S') });
        } else KTD.send({ t: 'snap', ...this.data() });
        this.snapSoon();
      }
      return;
    }
    // ── invitado
    if (m.t === 'snap') {
      this.synced = true;
      if (m.phase === 'game' && m.S) {
        S = m.S; save(); draft = null; this.pending.clear();
        if ($('#setup').classList.contains('on')) { $('#setup').classList.remove('on'); syncBody(); }
        $('#app').hidden = false; render(); syncUndo();
      } else if (m.L) {
        this.applyL(m.L);
        if (!$('#setup').classList.contains('on')) openSetup(); else renderSetup();
      }
      return;
    }
    if (m.t === 'start') { S = m.S; save(); draft = null; hist.length = 0; this.pending.clear(); enterGame(); return; }
    if (m.t === 'lobby') { this.synced = true; draft = newDraft(); this.applyL(m.L); openSetup(); return; }
    if (m.t === 'ops') {
      const echo = m.origin === 1 && this.pending.has(m.id);
      if (echo) this.pending.delete(m.id);
      if (m.ch === 'L') {
        if (!draft) { KTD.send({ t: 'snap?' }); return; }
        if (!echo) { Object.assign(draft, applyOps(sharedOf(draft), m.ops)); if ($('#setup').classList.contains('on')) renderSetup(); }
      } else if (m.ch === 'S') {
        if (!S || S.dual !== this.cfg.room) { KTD.send({ t: 'snap?' }); return; }
        if (!echo) { S = applyOps(S, m.ops); save(); render(); }
      }
      if (!this.pending.size && m.h && m.h !== this.hash(m.ch)) KTD.send({ t: 'snap?' });   // nos hemos desincronizado
    }
  },
};
function renderNet() {
  const html = !isDual() ? '' : `<span class="g-net ${KTD.online ? (KTD.peer ? 'ok' : 'wait') : 'off'}" ${SEAT === 0 ? 'data-invite role="button"' : ''} title="Partida en dos dispositivos${SEAT === 0 ? ' · toca para volver a invitar' : ''}">
    <span class="g-dot ${KTD.peer ? 'on' : ''}"></span>${!KTD.online ? 'Sin conexión' : KTD.peer ? `${esc(pname(1 - SEAT))} conectado` : `${esc(pname(1 - SEAT))} desconectado`}</span>`;
  document.querySelectorAll('.g-net-slot').forEach(el => { el.innerHTML = html; });
}

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
    ['PV', 'Toca los puntos de victoria para puntuar cada punto de inflexión'],
    ['Escenografía', 'Toca la letra de un elemento del mapa para ver qué pieza es'],
    ['Comando', 'Toca el emblema del jugador: lista, reglas de facción y enlaces'],
    ['V', 'Cambiar entre vista completa y reducida (marcador)'],
    ['O', 'Opciones: cierre guiado de turno y contador de activaciones'],
    ['E', 'Fin de partida: recuento total'],
    ['Rep. ±1', 'Cartas de iniciativa: toca para marcar disponible / usada'],
    [MOD_KEY + ' Z', 'Deshacer el último cambio'],
    ['→', 'Siguiente punto de inflexión (tras el 4.º, fin de la batalla)'],
    ['←', 'Punto de inflexión anterior'],
    ['C', 'Operación crítica'],
    ['S', 'Secuencia de juego'],
    ['F', 'Pantalla completa'],
    ['M', 'Ampliar el mapa'],
    ['R', 'Reiniciar la partida (mismos comandos y misión)'],
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
  let nameT = null;
  $('#setup-body').addEventListener('input', e => {
    if (e.target.dataset.name == null || !draft) return;
    const i = +e.target.dataset.name;
    if (!mine(i)) return;
    const before = isDual() ? sharedOf(draft) : null;
    draft.names[i] = e.target.value;
    if (isDual()) { clearTimeout(nameT); const b = before; nameT = setTimeout(() => Net.ops('L', diff(b, sharedOf(draft))), 450); }
  });
  $('#btn-mode').addEventListener('click', () => { draft.mode = draft.mode === 'wiz' ? 'panel' : 'wiz'; renderSetup(); });
  $('#btn-close-setup').addEventListener('click', closeSetup);
  $('#btn-setup').addEventListener('click', newGame);
  $('#btn-restart').addEventListener('click', askRestart);
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-end').addEventListener('click', () => endGame());
  $('#btn-view').addEventListener('click', toggleView);
  $('#btn-opt').addEventListener('click', () => openSheet('opt'));
  $('#compact').addEventListener('click', onCompactClick);
  $('#rot-compact').addEventListener('click', () => { VIEW = 'compact'; KT.store.set('partida.vista', VIEW); render(); });
  document.addEventListener('click', onScoreClick);
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-calinv]') || !Net.cfg || !KT.cal) return;
    const n = draft?.names || S?.players.map(P => P.name) || [];
    KT.cal.open({ title: `Kill Team: ${n[0] || 'Jugador 1'} vs ${n[1] || 'Jugador 2'}`, desc: '¡Te reto a una partida de Kill Team! El día de la partida, únete desde tu móvil con este enlace:', url: KTD.inviteUrl(Net.cfg) });
  });
  document.addEventListener('click', e => { if (e.target.closest('.g-prev')) onTerrClick(e); });
  mqSmall.addEventListener('change', () => { if (S?.started) render(); });
  $('#btn-fs').addEventListener('click', toggleFS);
  $('#btn-help').addEventListener('click', showHelp);
  $('#viewer-close').addEventListener('click', closeViewer);
  $('#rot-continue').addEventListener('click', () => document.body.classList.add('allow-portrait'));
  $('#rot-fs').addEventListener('click', toggleFS);
  document.addEventListener('click', e => { if (e.target.closest('[data-invite]') && Net.cfg) KT.modal('Invitar al otro jugador', invitePanel(), 'user-plus'); });
  document.addEventListener('click', e => { const c = e.target.closest('.cmdk [data-copy]'); if (c) navigator.clipboard?.writeText(c.dataset.copy).then(() => KT.toast('Enlace copiado', { type: 'ok' })); const sh = e.target.closest('.cmdk [data-share]'); if (sh) navigator.share({ title: 'Kill Team', url: KTD.inviteUrl(Net.cfg) }).catch(() => {}); });
  document.addEventListener('click', e => { if (tipEl && !e.target.closest('.g-tip, [data-rule], [data-tipeq], [data-tipploy], [data-terr]')) hideTip(); });
  new ResizeObserver(() => placeObjs()).observe($('#board'));
  document.addEventListener('visibilitychange', () => { if (S?.started) keepAwake(); });

  const playing = () => S?.started && !$('#setup').classList.contains('on');
  KT.keys({
    'mod+z': () => undo(),
    'ArrowRight': () => { if (playing() && !sheet) setTP(S.tp + 1); else return false; },
    'ArrowLeft': () => { if (playing() && !sheet) setTP(S.ended ? S.tp : S.tp - 1); else return false; },
    'f': () => toggleFS(),
    'm': () => openViewer(),
    'n': () => newGame(),
    'r': () => { if (playing()) askRestart(); else return false; },
    'c': () => { if (playing()) openSheet('crit'); else return false; },
    'v': () => { if (playing()) toggleView(); else return false; },
    'o': () => { if (playing()) openSheet('opt'); else return false; },
    'e': () => { if (playing() && !sheet) endGame(); else return false; },
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
  // Comando borrado de este dispositivo (añadido por el usuario): no se puede reanudar
  if (S && !S.dual && (S.players || []).some(P => P && !FACTIONS[P.factionId])) {
    S = null; KT.store.del(KEY);
    KT.toast('La partida guardada usaba un comando que ya no está en este dispositivo: empieza una nueva', { type: 'err', ms: 5000 });
  }
  // Partida en dos dispositivos: invitación en la URL o sala guardada
  const inv = KTD.fromUrl(), sala = KT.store.get('sala');
  if (inv) {
    history.replaceState(null, '', location.pathname);
    if (sala && sala.room === inv.room) { draft = null; Net.resume(sala); render(); }
    else Net.join(inv);
  } else if (sala && S?.dual === sala.room) { Net.resume(sala); render(); }
  else if (sala && sala.seat === 0) {
    const saved = KT.store.get('partida.lobby');
    draft = saved && saved.room === sala.room ? saved : null;
    Net.resume(sala).then(() => { if (!draft) { draft = newDraft(); draft.room = sala.room; } openSetup(); Net.lobby(); });
  }
  else if (sala) { Net.resume(sala); openSetup(); }
  else if (new URLSearchParams(location.search).get('p1') || new URLSearchParams(location.search).get('liga')) { $('#app').hidden = !(S && S.started); openSetup(); if (S?.started) render(); }
  else {
    render();
    // «Volver a la partida» desde otra página: se reanuda sin preguntar
    const back = new URLSearchParams(location.search).has('volver');
    if (back) history.replaceState(null, '', location.pathname);
    if (S?.started && !S.dual && !back) askResume();
  }
  syncUndo();
  if (S?.started) keepAwake();
});
