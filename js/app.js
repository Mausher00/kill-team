// ============================================================
//  app.js — SPA Kill Team
//  Navegación por hash: #home | #korps | #sucesores | ...
// ============================================================

// Glosario global: js/data/keywords.js

// ── ESTADO ───────────────────────────────────────────────────
let currentFaction = null;
let activeTab      = 'op';
let searchQ        = '';
let openOps        = new Set();

const TAB_IDS = ['op', 'gr', 'rf', 'ar', 'eq', 'er'];

// Persistencia por facción: última pestaña y operativos abiertos
const saveView = () => {
  if (!currentFaction) return;
  KT.store.set('lib.' + currentFaction, { tab: activeTab, open: [...openOps] });
};
const loadView = id => {
  const v = KT.store.get('lib.' + id, {});
  activeTab = TAB_IDS.includes(v.tab) ? v.tab : 'op';
  openOps   = new Set(v.open || []);
};

// ── NAVEGACIÓN ───────────────────────────────────────────────
// Rutas: #faccion  ·  #faccion/pestaña  ·  #faccion/op/idOperativo
function setHash() {
  const h = currentFaction ? '#' + currentFaction + (activeTab !== 'op' ? '/' + activeTab : '') : ' ';
  if (location.hash !== h.trim()) history.replaceState(null, '', h.trim() || location.pathname);
}

function goTo(factionId, opts = {}) {
  KT.vt(() => {
    const changed = currentFaction !== factionId;
    currentFaction = factionId;
    if (changed) loadView(factionId);
    if (opts.tab) activeTab = opts.tab;
    if (opts.op) openOps.add(opts.op);
    searchQ = '';
    history.pushState(null, '', '#' + factionId + (activeTab !== 'op' ? '/' + activeTab : ''));
    render();
    if (!opts.op && !opts.find) window.scrollTo(0, 0);
  });
  if (opts.op)   setTimeout(() => focusCard(document.getElementById('op-' + opts.op)), 60);
  if (opts.find) setTimeout(() => focusCard(findCard(opts.find)), 60);
}

function goHome() {
  KT.vt(() => {
    saveView();
    currentFaction = null;
    history.pushState(null, '', location.pathname);
    render();
    window.scrollTo(0, 0);
  });
}

function findCard(title) {
  const t = KT.norm(title);
  return [...document.querySelectorAll('#pane .filt')].find(c => {
    const n = c.querySelector('.gr-name,.ord-name,.pl-name,.eq-name,.er-sec,.fr-name');
    return n && KT.norm(n.textContent) === t;
  }) || document.querySelector('#pane .fr-card');
}

function focusCard(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  KT.flash(el);
}

function toggleOp(id) {
  const card = document.getElementById('op-' + id);
  if (!card) return;
  const open = !card.classList.contains('open');
  card.classList.toggle('open', open);
  card.querySelector('.op-hd-card').setAttribute('aria-expanded', open);
  open ? openOps.add(id) : openOps.delete(id);
  saveView();
  syncAllBtn();
}

function toggleAllOps() {
  const cards = [...document.querySelectorAll('#pane .op-card')];
  const open = !cards.every(c => c.classList.contains('open'));
  cards.forEach((c, i) => setTimeout(() => {
    c.classList.toggle('open', open);
    c.querySelector('.op-hd-card').setAttribute('aria-expanded', open);
  }, i * 25));
  cards.forEach(c => { const id = c.id.slice(3); open ? openOps.add(id) : openOps.delete(id); });
  saveView();
  setTimeout(syncAllBtn, cards.length * 25);
}

function syncAllBtn() {
  const btn = document.querySelector('#pane .list-bar .link-btn');
  if (!btn) return;
  const cards = [...document.querySelectorAll('#pane .op-card')];
  const allOpen = cards.length && cards.every(c => c.classList.contains('open'));
  btn.innerHTML = `<i class="ti ti-${allOpen ? 'fold' : 'fold-down'}"></i> ${allOpen ? 'Contraer todo' : 'Expandir todo'}`;
}

function setTab(tab, dir = 0) {
  if (!TAB_IDS.includes(tab) || tab === activeTab) return;
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(x => {
    const on = x.dataset.tab === tab;
    x.classList.toggle('on', on);
    x.setAttribute('aria-selected', on);
  });
  KT.inkTabs(document.querySelector('.tabs'));
  renderPane(dir);
  saveView();
  setHash();
  const head = document.querySelector('.sticky-head');
  if (head && head.getBoundingClientRect().top <= 0) window.scrollTo({ top: head.offsetTop - 0, behavior: 'auto' });
}

window.homeFilter = KT.store.get('lib.homeFilter', '');
function setHomeFilter(t) {
  window.homeFilter = t;
  KT.store.set('lib.homeFilter', t);
  KT.vt(() => render());
}

// ── RENDER PRINCIPAL ─────────────────────────────────────────
function render() {
  const app = document.getElementById('app');

  if (!currentFaction) {
    app.innerHTML = renderHome();
    offlineSync();
    hideKw();
    document.title = 'Kill Team';
    return;
  }

  const f = FACTIONS[currentFaction];
  if (!f) { currentFaction = null; render(); return; }

  document.title = f.name + ' · Kill Team';
  if (window._kwFaction !== f.id) { hideKw(); window._kwFaction = f.id; }
  window.LOCAL_KW = localKeywords(f);
  app.innerHTML = renderFactionView(f, activeTab, searchQ, openOps);
  renderPane();
  bindTabEvents();
  bindSearch();
  bindSwipe();
  requestAnimationFrame(() => KT.inkTabs(document.querySelector('.tabs')));
  // Re-medir cuando la D-DIN termine de cargar (cambia el ancho de las pestañas)
  document.fonts?.ready.then(() => KT.inkTabs(document.querySelector('.tabs')));
}

// Reglas propias del comando consultables desde el pie (reglas de facción
// y reglas de arma con asterisco definidas en las fichas, p. ej. "Detonar*").
function localKeywords(f) {
  const out = {};
  (f.frs || []).forEach(r => { if (r.text) out[r.name] = { cat: 'Regla de facción · ' + f.name, t: r.text }; });
  const wr = new Set();
  f.ops.forEach(o => o.w.forEach(w => w.r.forEach(r => wr.add(r.replace(/\*$/, '').replace(/\s*[\d"”x+\/]+"?\s*$/, '').trim().toLowerCase()))));
  f.ops.forEach(o => o.ru.forEach(r => { if (wr.has(r.n.toLowerCase()) && !out[r.n]) out[r.n] = { cat: 'Regla de arma · ' + o.name, t: r.t }; }));
  return out;
}

function renderPane(dir = 0) {
  const pane = document.getElementById('pane');
  if (!pane) return;
  const f = FACTIONS[currentFaction];
  if (!f) return;

  let html = '';
  if      (activeTab === 'op') html = renderOps(f, searchQ, openOps);
  else if (activeTab === 'gr') html = (f.gr || window.CORE_GR) ? renderGR(f.gr || window.CORE_GR) : '';
  else if (activeTab === 'rf') html = renderFR(f);
  else if (activeTab === 'ar') html = f.pl ? renderPL(f.pl) : '';
  else if (activeTab === 'eq') html = f.eq ? renderEQ(f.eq) : '';
  else if (activeTab === 'er') html = f.er ? renderER(f.er) : '';
  if (!html) html = '<div class="empty">Sin contenido en esta sección todavía.</div>';

  pane.innerHTML = html;
  pane.classList.remove('pane-anim');
  pane.style.setProperty('--dir', (dir * 18) + 'px');
  void pane.offsetWidth;
  pane.classList.add('pane-anim');

  if (activeTab !== 'op') filterCards(pane);
  if (searchQ.trim()) KT.markText(pane, searchQ.trim());
  bindKwClicks(pane);
}

// Filtro de texto para las pestañas que no son de operativos
function filterCards(pane) {
  const q = KT.norm(searchQ.trim());
  if (!q) return;
  let shown = 0;
  pane.querySelectorAll('.filt').forEach(c => {
    const ok = KT.norm(c.textContent).includes(q);
    c.style.display = ok ? '' : 'none';
    if (ok) shown++;
  });
  // Ocultar cabeceras de sección que se queden vacías
  pane.querySelectorAll('.sec-lbl, .er-v').forEach(lbl => {
    let el = lbl.nextElementSibling, any = false;
    while (el && !el.matches('.sec-lbl, .er-v')) {
      if ((el.matches('.filt') && el.style.display !== 'none') || el.querySelector?.('.filt:not([style*="none"])')) { any = true; break; }
      el = el.nextElementSibling;
    }
    lbl.style.display = any ? '' : 'none';
  });
  const frTxt = pane.querySelector('.fr-txt');
  if (frTxt && KT.norm(frTxt.textContent).includes(q)) shown++;
  if (!shown) pane.insertAdjacentHTML('afterbegin', `<div class="empty">Nada coincide con “${KT.esc(searchQ)}” en esta pestaña.</div>`);
  else pane.insertAdjacentHTML('afterbegin', `<div class="cnt">${shown} RESULTADO${shown !== 1 ? 'S' : ''} · filtro “${KT.esc(searchQ)}”</div>`);
}

function bindTabEvents() {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => {
      const from = TAB_IDS.indexOf(activeTab), to = TAB_IDS.indexOf(b.dataset.tab);
      setTab(b.dataset.tab, Math.sign(to - from));
    });
  });
}

function bindSearch() {
  const si = document.getElementById('si');
  if (!si) return;
  let t;
  si.addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => { searchQ = e.target.value; renderPane(); }, 110);
  });
  si.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (si.value) { si.value = ''; searchQ = ''; renderPane(); } else si.blur();
      e.stopPropagation(); e.preventDefault();
    } else if (e.key === 'Enter') {
      // Enter: abre el primer operativo filtrado
      const first = document.querySelector('#pane .op-card:not(.open) .op-hd-card');
      if (first) { first.click(); si.blur(); }
    }
  });
}

// Deslizar horizontalmente en móvil para cambiar de pestaña
function bindSwipe() {
  const pane = document.getElementById('pane');
  if (!pane) return;
  let x0 = null, y0 = 0;
  pane.addEventListener('touchstart', e => {
    if (e.target.closest('.tbl-wrap, .tabs')) { x0 = null; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  pane.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 2) return;
    const i = TAB_IDS.indexOf(activeTab) + (dx < 0 ? 1 : -1);
    if (i >= 0 && i < TAB_IDS.length) setTab(TAB_IDS[i], dx < 0 ? 1 : -1);
  }, { passive: true });
}

// ── KEYWORD FOOTER ────────────────────────────────────────────
const kwFoot  = document.getElementById('kw-footer');
const kwIdle  = document.getElementById('kw-idle');
const kwAct   = document.getElementById('kw-active');
const kwCat   = document.getElementById('kw-cat');
const kwNm    = document.getElementById('kw-nm');
const kwDs    = document.getElementById('kw-ds');
const kwClose = document.getElementById('kw-close');

function showKw(term) {
  const L = window.LOCAL_KW || {};
  const lk = Object.keys(L).find(k => k.toLowerCase() === term.toLowerCase());
  const key   = lk || Object.keys(KEYWORDS).find(k => k.toLowerCase() === term.toLowerCase());
  const entry = lk ? L[lk] : key ? KEYWORDS[key] : null;
  if (!entry) return;
  kwIdle.style.display  = 'none';
  kwAct.classList.add('on');
  kwClose.style.display = 'block';
  kwCat.textContent     = entry.cat.toUpperCase();
  kwNm.textContent      = key;
  kwDs.textContent      = entry.t;
  kwAct.classList.remove('kw-swap'); void kwAct.offsetWidth; kwAct.classList.add('kw-swap');
  kwFoot.classList.add('lit');
  document.querySelectorAll('.rkw.on').forEach(x => x.classList.remove('on'));
}

function hideKw() {
  kwIdle.style.display = 'flex';
  kwAct.classList.remove('on');
  kwClose.style.display = 'none';
  kwFoot.classList.remove('lit');
  document.querySelectorAll('.rkw.on').forEach(x => x.classList.remove('on'));
}

kwClose.addEventListener('click', hideKw);

function bindKwClicks(root) {
  root.querySelectorAll('[data-kw]').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    const go = e => { e.stopPropagation(); showKw(el.dataset.kw); el.classList.add('on'); };
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
  });
}

// ── PALETA DE BÚSQUEDA GLOBAL ─────────────────────────────────
function paletteSource() {
  const out = [];
  out.push({ group: 'Ir a', icon: 'hammer', title: 'Constructor de comando', sub: 'Montar y guardar un comando', tag: 'página', suggest: true, boost: 2, run: () => location.href = 'builder.html' });
  out.push({ group: 'Ir a', icon: 'swords', title: 'Partida', sub: 'Modo de juego: operativos, mapa, PM y PV', tag: 'página', suggest: true, boost: 2, run: () => location.href = 'partida.html' });
  out.push({ group: 'Ir a', icon: 'map', title: 'Misiones y zonas', sub: 'Terreno, acciones y misiones', tag: 'página', suggest: true, boost: 2, run: () => location.href = 'misiones/misiones.html' });
  Object.values(FACTIONS).forEach(f => {
    const tag = f.name;
    out.push({ group: 'Comandos', icon: 'shield', title: f.name, sub: f.subfaction + ' · ' + f.ops.length + ' operativos', tag: 'comando', text: (f.tags || []).join(' '), suggest: true, boost: 4, run: () => goTo(f.id) });
    f.ops.forEach(op => {
      out.push({ group: 'Operativos', icon: 'user-shield', title: op.name, sub: `${op.type} · LPA ${op.s.lpa} · MOV ${op.s.mov} · SALV ${op.s.salv} · H ${op.s.h}`, tag, text: (op.kw || []).join(' '), boost: 3, run: () => goTo(f.id, { tab: 'op', op: op.id }) });
      op.w.forEach(w => out.push({ group: 'Armas', icon: MELEE_TERMS.some(t => w.n.toLowerCase().includes(t)) ? 'sword' : 'target', title: w.n, sub: `${op.name} · ATQ ${w.a} · IMP ${w.i} · DAÑO ${w.d}${w.r?.length ? ' · ' + w.r.join(', ') : ''}`, tag, run: () => goTo(f.id, { tab: 'op', op: op.id }) }));
      (op.ru || []).forEach(r => out.push({ group: 'Habilidades', icon: r.isAct ? 'bolt' : 'sparkles', title: r.n, sub: op.name + ' — ' + r.t, tag, run: () => goTo(f.id, { tab: 'op', op: op.id }) }));
    });
    (f.frs || []).forEach(r => {
      out.push({ group: 'Reglas de facción', icon: 'flag', title: r.name, sub: r.text, tag, run: () => goTo(f.id, { tab: 'rf', find: r.name }) });
      (r.subs || []).forEach(o => out.push({ group: 'Reglas de facción', icon: 'flag', title: o.n, sub: r.name + ' — ' + o.t, tag, run: () => goTo(f.id, { tab: 'rf', find: r.name }) }));
    });
    (f.pl?.s || []).forEach(p => out.push({ group: 'Ardides', icon: 'chess-knight', title: p.n, sub: 'Estrategia — ' + p.t, tag, run: () => goTo(f.id, { tab: 'ar', find: p.n }) }));
    (f.pl?.f || []).forEach(p => out.push({ group: 'Ardides', icon: 'flame', title: p.n, sub: 'Tiroteo — ' + p.t, tag, run: () => goTo(f.id, { tab: 'ar', find: p.n }) }));
    (f.eq || []).forEach(e => out.push({ group: 'Equipo', icon: 'package', title: e.n, sub: e.t, tag, run: () => goTo(f.id, { tab: 'eq', find: e.n }) }));
  });
  Object.entries(KEYWORDS).forEach(([k, v]) => out.push({ group: 'Glosario', icon: 'book-2', title: k, sub: v.t, tag: v.cat, run: () => showKw(k) }));
  return out;
}

const palette = KT.palette(paletteSource, { placeholder: 'Buscar en todos los comandos…' });
function openPalette() { palette.open(); }

// ── ATAJOS ───────────────────────────────────────────────────
function showHelp() {
  KT.helpModal([
    [MOD + ' K', 'Buscar en todos los comandos'],
    ['/', 'Filtrar la pestaña actual'],
    ['1 2 3 4 5 6', 'Cambiar de pestaña'],
    ['← →', 'Pestaña anterior / siguiente'],
    ['E', 'Expandir / contraer todos los operativos'],
    ['Alt ←', 'Volver a todos los comandos'],
    ['Esc', 'Cerrar definición · limpiar filtro'],
    ['?', 'Mostrar esta ayuda'],
  ]);
}

KT.keys({
  'mod+k': () => palette.isOpen() ? palette.close() : palette.open(),
  '/': () => { const si = document.getElementById('si'); if (si) { si.focus(); si.select(); } else palette.open(); },
  '?': showHelp,
  'e': () => { if (currentFaction && activeTab === 'op') toggleAllOps(); else return false; },
  'alt+ArrowLeft': () => { if (currentFaction) goHome(); else return false; },
  'ArrowRight': () => { if (!currentFaction) return false; const i = TAB_IDS.indexOf(activeTab); if (i < TAB_IDS.length - 1) setTab(TAB_IDS[i + 1], 1); },
  'ArrowLeft':  () => { if (!currentFaction) return false; const i = TAB_IDS.indexOf(activeTab); if (i > 0) setTab(TAB_IDS[i - 1], -1); },
  'Escape': () => {
    if (kwAct.classList.contains('on')) { hideKw(); return; }
    if (searchQ) { searchQ = ''; const si = document.getElementById('si'); if (si) si.value = ''; renderPane(); return; }
    return false;
  },
  ...Object.fromEntries(TAB_IDS.map((t, i) => [String(i + 1), () => { if (!currentFaction) return false; setTab(t, Math.sign(i - TAB_IDS.indexOf(activeTab))); }])),
}, { allowInInput: ['mod+k', 'Escape'] });

// ── HASH ROUTING ─────────────────────────────────────────────
function readHash() {
  const [fid, tab, op] = decodeURIComponent(location.hash.replace('#', '')).split('/');
  if (fid && FACTIONS[fid]) {
    if (currentFaction !== fid) loadView(fid);
    currentFaction = fid;
    if (TAB_IDS.includes(tab)) activeTab = tab;
    if (op) { activeTab = 'op'; openOps.add(op); }
    searchQ = '';
    return op;
  }
  currentFaction = null;
  return null;
}

window.addEventListener('popstate', () => { KT.vt(() => { readHash(); render(); }); });

// ── INIT ─────────────────────────────────────────────────────
(function init() {
  KT.initFx();
  addEventListener('resize', () => KT.inkTabs(document.querySelector('.tabs')), { passive: true });
  const op = readHash();
  render();
  if (op) setTimeout(() => focusCard(document.getElementById('op-' + op)), 80);
  window.addEventListener('beforeunload', saveView);
})();

// ── Sin conexión: descargar todas las imágenes ──────────────
async function offlineSync() {
  const b = document.getElementById('btn-offline');
  if (!b || !KT.offline.supported) return;
  b.hidden = false;
  const st = await KT.offline.status();
  if (st && st.cached >= st.images) { b.classList.add('done'); b.innerHTML = '<i class="ti ti-circle-check"></i> <span>Disponible sin conexión</span>'; b.title = 'Todo está guardado en este dispositivo'; }
}
async function offlineDownload() {
  const b = document.getElementById('btn-offline');
  if (!b || b.classList.contains('busy')) return;
  b.classList.add('busy');
  const label = b.querySelector('span');
  const ok = await KT.offline.download((done, total) => { label.textContent = `Descargando ${Math.round(done / total * 100)} %`; });
  b.classList.remove('busy');
  if (ok) { KT.toast('Listo: la app funciona sin conexión en este dispositivo', { type: 'ok', ms: 4000 }); offlineSync(); }
  else { label.textContent = 'Reintentar descarga'; KT.toast('No se pudieron descargar todas las imágenes', { type: 'err' }); }
}
