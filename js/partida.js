// ============================================================
//  partida.js — Modo de juego
//  Estado serializable en localStorage ('kt.partida'), con
//  deshacer (Ctrl+Z / botón). Los datos de cada agente se leen
//  siempre de FACTIONS y las operaciones de OPS (misiones.js);
//  aquí solo se guarda lo que cambia en partida.
// ============================================================

const KEY = 'partida';
const V = 2;
const MAX_TP = 4;
const $ = s => document.querySelector(s);
const esc = s => KT.esc(s);
const norm = s => KT.norm(s).replace(/\s*\(.*?\)\s*/g, ' ').trim();
const ARQ = ['Seguridad', 'Reconocimiento', 'Buscar y destruir', 'Infiltración'];
const OPN = { crit: 'Op. crítica', kill: 'Op. de eliminación', tac: 'Op. táctica' };

let S = KT.store.get(KEY) || null;
let legacy = false;
if (S && S.v !== V) { S = null; legacy = true; }
const hist = [];
let sheet = null;          // { kind, i, peek, all }

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
const pname = i => S.players[i].name || 'Jugador ' + (i + 1);
const zoneOf = id => ZONAS.find(z => z.id === id);
const mapOf = (z, id) => z?.maps.find(m => m.id === id);
const critOf = n => OPS.crit.find(c => c.n === n);
const tacOf = id => OPS.tac.find(t => t.id === id);
const pick = a => a[Math.floor(Math.random() * a.length)];

function archetypes(P) {
  const f = FACTIONS[P.factionId];
  return (f.roster?.archetypes || f.tags || []).filter(a => ARQ.includes(a));
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
    name: name || '', src, factionId: f.id, title, ploys0, equipment, ops,
    cp: 2,                                   // «Elegir agentes: cada jugador gana 2PM»
    tac: null, tacShown: false, prim: null,
    score: { crit: 0, tac: 0, killAdj: 0 },
    cards: { rr: 0, i1: 0, i2: 0, i3: 0 },   // 0 no la tiene · 1 la tiene · 2 usada
  };
}

// ── Render ───────────────────────────────────────────────────
function render(only) {
  if (!S || !S.started) { $('#app').hidden = true; openSetup(); return; }
  $('#app').hidden = false;
  if (!only || only === 'top') renderTop();
  if (!only || only === 0 || only === 'cols') renderCol(0);
  if (!only || only === 1 || only === 'cols') renderCol(1);
  if (!only || only === 'board') renderBoard();
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
  const eqAll = [...(f.eq || []).map(e => ({ id: 'f-' + KT.norm(e.n).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), n: e.n })), ...(window.UNIVERSAL_EQUIPMENT || [])];
  const extras = [
    ...P.ploys0.map(p => `<span class="g-chip zero" title="Ardid a 0PM">${esc(p)} · 0PM</span>`),
    ...P.equipment.map(id => `<span class="g-chip">${esc(eqAll.find(e => e.id === id)?.n || id)}</span>`),
  ].join('');
  const t = tacOf(P.tac), k = killInfo(i);
  const tacTxt = !t ? 'Elegir' : P.tacShown ? t.name : 'Oculta';
  const cards = CARDS.map(([id, l]) => {
    const st = P.cards[id];
    const tip = OPS.iniciativa.find(c => c.id === id);
    return `<button class="g-card s${st}" data-card="${id}" title="${esc(tip.name + ' ' + tip.sub)} · ${['no la tiene', 'disponible', 'usada'][st]} (tocar para cambiar)">${l}</button>`;
  }).join('');
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
      <table class="g-wt">${ws.map(w => `<tr><td class="n">${esc(w.n)}${w.r.length ? `<span class="r">${esc(w.r.join(', '))}</span>` : ''}</td>
        <td class="v">${w.a}</td><td class="v ${hurt ? 'mod' : ''}">${worse(w.i)}</td><td class="v d">${w.d}</td></tr>`).join('')}</table>
      ${od.ru.length ? `<div class="g-ab">${od.ru.map(r => `<details class="${r.isAct ? 'act' : ''}"><summary>${esc(r.n)}</summary><p>${esc(r.t).replace(/\n/g, '<br>')}</p></details>`).join('')}</div>` : ''}
    </div></div></div>
  </div>`;
}

function renderBoard() {
  const z = zoneOf(S.zone), m = mapOf(z, S.map), c = critOf(S.crit);
  const tools = `
    <div class="g-btools">
      <button class="g-bt" data-sheet="seq" title="Secuencia de juego y cartas de iniciativa"><i class="ti ti-list-numbers"></i><span>Secuencia</span></button>
      ${z?.claves?.length ? `<button class="g-bt" data-sheet="keys" title="Leyenda del terreno"><i class="ti ti-building-castle"></i><span>Terreno</span></button>` : ''}
      ${m ? `<button class="g-bt" data-flip title="Girar el mapa 180° (para que la zona de despliegue de J1 quede a la izquierda)"><i class="ti ti-rotate-2"></i></button>` : ''}
    </div>`;
  const tags = `
    <div class="g-board-tags">
      ${z ? `<span>${esc(z.name)}${m ? ' · ' + esc(m.label) : ''}</span>` : ''}
      <button class="g-crit ${c ? '' : 'todo'}" data-sheet="crit" title="Operación crítica">${c ? `<b>${c.n}</b>${esc(c.name)}` : '<i class="ti ti-plus"></i> Op. crítica'}</button>
    </div>`;
  const sides = m ? `<div class="g-side l" style="--pc:var(--p1)">${esc(pname(0))}</div><div class="g-side r" style="--pc:var(--p2)">${esc(pname(1))}</div>` : '';
  $('#board').innerHTML = (m
    ? `<img src="${m.img}" alt="Mapa ${esc(m.label)} de ${esc(z.name)}" id="board-img" class="${S.flip ? 'flip' : ''}" onerror="this.outerHTML='<div class=g-empty><i class=\\'ti ti-photo-off\\'></i>No se encuentra la imagen<br>${m.img}</div>'">`
    : `<div class="g-empty"><i class="ti ti-map-2"></i>Elige una zona y un mapa en la preparación</div>`) + tags + tools + sides;
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

// ── Hoja de detalles ─────────────────────────────────────────
function openSheet(kind, i = null) { sheet = { kind, i, peek: false, all: false }; renderSheet(); $('#sheet').classList.add('on'); }
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

function renderSheet() {
  const T = $('#sheet-t'), B = $('#sheet-body'), k = sheet.kind, i = sheet.i;
  const box = $('#sheet .g-sheet-box');
  box.style.setProperty('--pc', i == null ? 'var(--orange)' : `var(--p${i + 1})`);
  if (k === 'crit') {
    const c = critOf(S.crit);
    T.innerHTML = c ? `<small>Operación crítica ${c.n}</small>${esc(c.name)}` : '<small>Operación crítica</small>Elegir';
    const list = `<div class="g-pick crit">${OPS.crit.map(x => `<button class="${x.n === S.crit ? 'on' : ''}" data-crit="${x.n}"><b>${x.n}</b>${esc(x.name)}</button>`).join('')}</div>`;
    B.innerHTML = c ? opBody(c) + `<details class="g-more"><summary>Cambiar operación crítica</summary>${list}</details>` : list;
  } else if (k === 'tac') {
    const P = S.players[i], t = tacOf(P.tac), arq = archetypes(P);
    T.innerHTML = `<small>${esc(pname(i))} · operación táctica</small>${t && (P.tacShown || sheet.peek) ? esc(t.name) : t ? 'Oculta' : 'Elegir'}`;
    const avail = sheet.all || !arq.length ? OPS.tac : OPS.tac.filter(x => arq.includes(x.arq));
    const groups = ARQ.filter(a => avail.some(x => x.arq === a));
    const list = `
      <p class="g-hint">Se elige en secreto al revelar los agentes. Arquetipos de ${esc(FACTIONS[P.factionId].name)}: <b>${esc(arq.join(' · ') || '—')}</b></p>
      ${groups.map(a => `<h4>${esc(a)}</h4><div class="g-pick">${avail.filter(x => x.arq === a).map(x => `<button class="${x.id === P.tac ? 'on' : ''}" data-tac="${x.id}">${esc(x.name)}<small>${esc(x.revelar)}</small></button>`).join('')}</div>`).join('')}
      ${arq.length ? `<label class="g-check"><input type="checkbox" data-all ${sheet.all ? 'checked' : ''}> Mostrar todas las operaciones tácticas</label>` : ''}`;
    if (!t) B.innerHTML = list;
    else if (!P.tacShown && !sheet.peek) B.innerHTML = `
      <div class="g-secret"><i class="ti ti-lock"></i><p>Operación táctica de <b>${esc(pname(i))}</b> oculta.</p>
        <button class="icon-btn accent" data-peek><i class="ti ti-eye"></i> Ver (solo ${esc(pname(i))})</button></div>`;
    else B.innerHTML = `
      <div class="g-row"><span class="g-arq">${esc(t.arq)}</span><span style="flex:1"></span>
        <button class="icon-btn ${P.tacShown ? '' : 'accent'}" data-reveal>${P.tacShown ? '<i class="ti ti-lock"></i> Volver a ocultar' : '<i class="ti ti-eye"></i> Revelar a ambos'}</button></div>
      ${opBody(t)}
      <details class="g-more"><summary>Cambiar operación táctica</summary>${list}</details>`;
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
      <button class="icon-btn g-orig" data-img="imagenes/misiones/secuencia.jpg"><i class="ti ti-cards"></i> Carta original (inglés)</button>`;
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
        ${[['crit', 'Op. crítica'], ['kill', 'Op. de eliminación'], ['tac', 'Op. táctica']].map(([o, n]) => `<tr><td>${n}</td>${[0, 1].map(j => `<td>${s[j][o]}${S.players[j].prim === o ? ' <i class="ti ti-star-filled" title="Principal"></i>' : ''}</td>`).join('')}</tr>`).join('')}
        <tr><td>Op. principal (½)</td>${[0, 1].map(j => `<td>+${s[j].prim}</td>`).join('')}</tr>
        <tr class="tot"><td>Total</td>${[0, 1].map(j => `<td>${s[j].total}</td>`).join('')}</tr></table>
      ${S.players.some(P => !P.prim) ? '<p class="g-hint">Algún jugador no tiene operación principal elegida: ábrela desde su puntuación.</p>' : ''}
      <div class="g-row"><button class="icon-btn" data-sheet-go="score" data-p="0">Puntuación J1</button><button class="icon-btn" data-sheet-go="score" data-p="1">Puntuación J2</button><span style="flex:1"></span><button class="icon-btn accent" data-newgame><i class="ti ti-refresh"></i> Nueva partida</button></div>`;
  }
}

function onSheetClick(e) {
  const t = e.target.closest('button, input');
  if (!t) return;
  const i = sheet.i, P = i != null ? S.players[i] : null, d = t.dataset;
  if (d.img) { openViewer(d.img); return; }
  if (d.crit) commit(() => { S.crit = +d.crit; }, { only: 'board' });
  else if (d.tac) { commit(() => { P.tac = d.tac; P.tacShown = false; }, { only: i }); sheet.peek = true; renderSheet(); }
  else if (t.hasAttribute('data-peek')) { sheet.peek = true; renderSheet(); }
  else if (t.hasAttribute('data-all')) { sheet.all = t.checked; renderSheet(); }
  else if (t.hasAttribute('data-reveal')) commit(() => { P.tacShown = !P.tacShown; }, { only: i });
  else if (d.prim) commit(() => { P.prim = P.prim === d.prim ? null : d.prim; }, { only: i });
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
  else if (t.hasAttribute('data-newgame')) { closeSheet(); openSetup(); }
}

// ── Interacción (delegada) ───────────────────────────────────
function onColClick(e) {
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
      if (before > 0 && o.w === 0) KT.toast(`${(o.label || opData(P, o).name)} incapacitado`, { type: 'err', action: 'Deshacer', onAction: undo });
    }
  }, { only: i });
  const g1 = killInfo(1 - i).grade;
  if (g1 > g0) setTimeout(() => KT.toast(`${pname(1 - i)}: grado de eliminación ${g1} (+1PV)`, { type: 'ok' }), 350);
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
  if (e.target.id === 'board-img') { openViewer(); return; }
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.sheet) openSheet(t.dataset.sheet);
  else if (t.hasAttribute('data-flip')) commit(() => { S.flip = !S.flip; }, { only: 'board' });
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
    if (forward) S.players.forEach(P => P.ops.forEach(o => { o.used = false; }));
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
  const flip = own && !!S?.flip;
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

// ── Preparación ──────────────────────────────────────────────
let draft = null;
function openSetup() {
  const rosters = KT.store.get('rosters', []) || [];
  closeSheet();
  draft = draft || {
    names: S ? S.players.map(p => p.name) : ['', ''],
    src: S ? S.players.map(p => p.src) : [null, null],
    zone: S?.zone || ZONAS[0].id, map: S?.map || ZONAS[0].maps[0].id, crit: S?.crit ?? null,
  };
  // ?p1=<id> desde el constructor
  const q = new URLSearchParams(location.search).get('p1');
  if (q && rosters.some(r => r.id === q) && !draft.src[0]) draft.src[0] = { kind: 'roster', id: q };
  renderSetup();
  $('#setup').classList.add('on');
}

function renderSetup() {
  const rosters = KT.store.get('rosters', []) || [];
  const facs = Object.values(FACTIONS);
  const player = i => {
    const isOn = s => draft.src[i] && draft.src[i].kind === s.kind && draft.src[i].id === s.id;
    const rost = rosters.length ? rosters.map(r => {
      const f = FACTIONS[r.factionId]; if (!f) return '';
      const n = r.ops.reduce((a, o) => a + o.qty, 0);
      return `<button class="g-opt ${isOn({ kind: 'roster', id: r.id }) ? 'on' : ''}" data-src="${i}" data-kind="roster" data-id="${r.id}">
        <img src="${f.img}" alt=""><span class="o"><b>${esc(r.name)}</b><small>${esc(f.name)} · ${n} agentes</small></span></button>`;
    }).join('') : `<div class="g-note">Aún no tienes comandos guardados. <a href="builder.html" style="color:var(--orange)">Crea uno en el constructor</a> o elige un comando completo abajo.</div>`;
    const full = facs.map(f => `<button class="g-opt ${isOn({ kind: 'faction', id: f.id }) ? 'on' : ''}" data-src="${i}" data-kind="faction" data-id="${f.id}">
        <img src="${f.img}" alt=""><span class="o"><b>${esc(f.name)}</b><small>Todos los agentes (${f.ops.length})</small></span></button>`).join('');
    return `
      <div class="g-sp p${i + 1}">
        <div class="g-sp-hd"><span class="t">J${i + 1}</span><input value="${esc(draft.names[i])}" placeholder="Jugador ${i + 1}" data-name="${i}" aria-label="Nombre del jugador ${i + 1}"></div>
        <div class="g-sp-list">
          <div class="g-sp-sec">Mis comandos</div>${rost}
          <div class="g-sp-sec">Comando completo</div>${full}
        </div>
      </div>`;
  };
  const z = zoneOf(draft.zone) || ZONAS[0];
  const mapBtn = m => `<button class="g-map ${m.id === draft.map ? 'on' : ''} ${m.old ? 'old' : ''}" data-map="${m.id}" aria-label="Mapa ${m.label}"><img src="${m.img}" alt="" loading="lazy"><span>${esc(m.label)}</span></button>`;
  const fresh = z.maps.filter(m => !m.old), old = z.maps.filter(m => m.old);
  const mission = `
    <div class="g-sp mis">
      <div class="g-sp-hd"><span class="t" style="color:var(--text-2)">Misión</span><span style="flex:1"></span>
        <button class="icon-btn ripple" id="rnd" title="Zona, mapa y operación crítica al azar"><i class="ti ti-dice-5"></i> Aleatorio</button></div>
      <div class="g-sp-list">
        <div class="g-sp-sec">Zona de aniquilación</div>
        <div class="g-zones">${ZONAS.map(x => `<button class="g-zone ${x.id === z.id ? 'on' : ''}" data-zone="${x.id}">${esc(x.name)}</button>`).join('')}</div>
        <div class="g-sp-sec">Mapa · Operaciones aprobadas 2025</div>
        <div class="g-maps">${fresh.map(mapBtn).join('')}</div>
        ${old.length ? `<details class="g-old"><summary class="g-sp-sec">Mapas de la temporada anterior (${old.length})</summary><div class="g-maps">${old.map(mapBtn).join('')}</div></details>` : ''}
        <div class="g-sp-sec">Operación crítica</div>
        <div class="g-crits">${OPS.crit.map(c => `<button class="g-zone ${c.n === draft.crit ? 'on' : ''}" data-crit="${c.n}" title="${esc(c.en)}"><b>${c.n}</b> ${esc(c.name)}</button>`).join('')}</div>
        <div class="g-note">Las operaciones tácticas y la principal se eligen en secreto ya en la partida, desde la columna de cada jugador.</div>
      </div>
    </div>`;
  $('#setup-body').innerHTML = player(0) + mission + player(1);
  const ok = draft.src[0] && draft.src[1];
  const m = mapOf(z, draft.map), c = critOf(draft.crit);
  $('#btn-start').disabled = !ok;
  $('#setup-info').textContent = ok ? `${z.name} · mapa ${m ? m.label : '—'} · ${c ? 'Op. crítica: ' + c.name : 'sin operación crítica'}` : 'Elige un comando para cada jugador';
  $('#btn-close-setup').style.display = S && S.started ? '' : 'none';
}

function onSetupClick(e) {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.src != null) { draft.src[+t.dataset.src] = { kind: t.dataset.kind, id: t.dataset.id }; renderSetup(); }
  else if (t.dataset.zone) {
    const z = zoneOf(t.dataset.zone);
    draft.zone = z.id; if (!mapOf(z, draft.map)) draft.map = z.maps[0].id; renderSetup();
  }
  else if (t.dataset.map) { draft.map = t.dataset.map; renderSetup(); }
  else if (t.dataset.crit) { draft.crit = draft.crit === +t.dataset.crit ? null : +t.dataset.crit; renderSetup(); }
  else if (t.id === 'rnd') {
    const z = pick(ZONAS), m = pick(z.maps.filter(m => !m.old)), c = pick(OPS.crit);
    Object.assign(draft, { zone: z.id, map: m.id, crit: c.n });
    renderSetup();
    KT.toast(`${z.name} · mapa ${m.label} · ${c.name}`, { type: 'ok' });
  }
}

function startGame() {
  const players = [0, 1].map(i => buildPlayer(draft.src[i], draft.names[i].trim()));
  if (players.some(p => !p)) { KT.toast('No se pudo cargar alguno de los comandos', { type: 'err' }); return; }
  const keep = S && S.started;
  if (keep) hist.push(JSON.stringify(S));
  S = { v: V, started: true, ended: false, tp: 1, ini: null, zone: draft.zone, map: draft.map, crit: draft.crit, flip: false, players };
  save(); draft = null;
  $('#setup').classList.remove('on');
  history.replaceState(null, '', location.pathname);
  render(); syncUndo();
  KT.toast('¡Que empiece la batalla! Cada jugador empieza con 2PM', { type: 'ok' });
}

function closeSetup() { if (S && S.started) { $('#setup').classList.remove('on'); draft = null; } }

// ── Pantalla completa / orientación ──────────────────────────
async function toggleFS() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      try { await screen.orientation.lock('landscape'); } catch {}
    } else await document.exitFullscreen();
  } catch { KT.toast('Tu navegador no permite pantalla completa aquí'); }
}

function showHelp() {
  KT.helpModal([
    ['Toca la ficha', 'Ver armas y habilidades (valores de lesionado en rojo)'],
    ['− +', 'Daño / curación · el grado de eliminación del rival se calcula solo'],
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
  $('#setup-body').addEventListener('input', e => { if (e.target.dataset.name != null) draft.names[+e.target.dataset.name] = e.target.value; });
  $('#btn-start').addEventListener('click', startGame);
  $('#btn-close-setup').addEventListener('click', closeSetup);
  $('#btn-setup').addEventListener('click', openSetup);
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-fs').addEventListener('click', toggleFS);
  $('#btn-help').addEventListener('click', showHelp);
  $('#viewer-close').addEventListener('click', closeViewer);
  $('#rot-continue').addEventListener('click', () => document.body.classList.add('allow-portrait'));
  $('#rot-fs').addEventListener('click', toggleFS);

  const playing = () => S?.started && !$('#setup').classList.contains('on');
  KT.keys({
    'mod+z': () => undo(),
    'ArrowRight': () => { if (playing() && !sheet) setTP(S.tp + 1); else return false; },
    'ArrowLeft': () => { if (playing() && !sheet) setTP(S.ended ? S.tp : S.tp - 1); else return false; },
    'f': () => toggleFS(),
    'm': () => openViewer(),
    'n': () => openSetup(),
    'c': () => { if (playing()) openSheet('crit'); else return false; },
    's': () => { if (playing()) openSheet('seq'); else return false; },
    '?': showHelp,
    'Escape': () => {
      if ($('#viewer').classList.contains('on')) { closeViewer(); return; }
      if (sheet) { closeSheet(); return; }
      if ($('#setup').classList.contains('on') && S?.started) { closeSetup(); return; }
      return false;
    },
  });

  if (legacy) KT.toast('La partida guardada era de una versión anterior: empieza una nueva', { ms: 5000 });
  if (new URLSearchParams(location.search).get('p1')) { $('#app').hidden = !(S && S.started); openSetup(); if (S?.started) render(); }
  else render();
  syncUndo();
});
