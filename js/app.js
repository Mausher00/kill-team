// ============================================================
//  app.js — SPA Kill Team
//  Navegación por hash: #home | #korps | #sucesores | ...
// ============================================================

// ── KEYWORDS GLOBALES ────────────────────────────────────────
// (compartidas por todas las facciones)
Object.assign(KEYWORDS, {
  // Reglas de arma
  'Alcance':              { cat: 'Regla de arma', t: 'Solo los agentes a esa distancia o menos pueden ser blancos válidos.' },
  'Área':                 { cat: 'Regla de arma', t: 'Dispara también contra cada agente visible a esa distancia o menos del blanco primario.' },
  'Brutal':               { cat: 'Regla de arma', t: 'El oponente solo puede bloquear con éxitos críticos.' },
  'Buscadora':            { cat: 'Regla de arma', t: 'Los agentes con orden de ocultarse no pueden usar terreno para estar a cubierto.' },
  'Castigadora':          { cat: 'Regla de arma', t: 'Si guardas algún éxito crítico, puedes guardar uno de tus fallos como éxito normal.' },
  'Certera':              { cat: 'Regla de arma', t: 'Puedes guardar hasta X dados de ataque como éxitos normales sin tirarlos.' },
  'Choque':               { cat: 'Regla de arma', t: 'La primera vez que golpees con crítico, descarta un éxito normal sin resolver del oponente.' },
  'Críticos de penetración': { cat: 'Regla de arma', t: 'Los éxitos críticos del atacante tienen Penetración X adicional.' },
  'Desgarradora':         { cat: 'Regla de arma', t: 'Si guardas algún éxito crítico, puedes guardar uno de tus éxitos normales como éxito crítico.' },
  'Devastadora':          { cat: 'Regla de arma', t: 'Cada éxito crítico guardado inflige X daño adicional inmediato.' },
  'Equilibrada':          { cat: 'Regla de arma', t: 'Puedes repetir 1 de tus dados de ataque.' },
  'Implacable':           { cat: 'Regla de arma', t: 'Puedes repetir cualquiera de tus dados de ataque.' },
  'Incesante':            { cat: 'Regla de arma', t: 'Puedes repetir cualquiera de tus dados de ataque con un resultado concreto.' },
  'Letal':                { cat: 'Regla de arma', t: 'Tus éxitos iguales o superiores a X son éxitos críticos.' },
  'Limitada':             { cat: 'Regla de arma', t: 'El agente deja de tener esta arma tras usarla X veces.' },
  'Penetración':          { cat: 'Regla de arma', t: 'El defensor guarda X dados de defensa menos.' },
  'Pesada':               { cat: 'Regla de arma', t: 'No se puede usar si el agente ha movido, ni mover tras usarla.' },
  'Ráfaga':               { cat: 'Regla de arma', t: 'Dispara también contra blancos secundarios válidos a esa distancia.' },
  'Saturación':           { cat: 'Regla de arma', t: 'El defensor no puede guardar salvaciones por cobertura.' },
  'Severa':               { cat: 'Regla de arma', t: 'Si no guardas ningún éxito crítico, puedes cambiar un éxito normal a crítico.' },
  'Silenciosa':           { cat: 'Regla de arma', t: 'Puede usarse aunque el agente tenga orden de ocultarse.' },
  'Sobrecalentamiento':   { cat: 'Regla de arma', t: 'Tras usar esta arma, tira 1D6. Si el resultado es inferior al Impactar, sufres ese resultado × 2 de daño.' },
  // Conceptos
  'LPA':                  { cat: 'Concepto', t: 'Límite de Puntos de Acción. Cuántas acciones puede realizar el agente en su activación.' },
  'PA':                   { cat: 'Concepto', t: 'Punto de Acción. Moneda de activación.' },
  'PM':                   { cat: 'Concepto', t: 'Punto de Mando. Se ganan en la Fase de Estrategia y se gastan en ardides de tiroteo.' },
  'GAMBITO ESTRATÉGICO':  { cat: 'Concepto', t: 'Acción especial que se usa durante la Fase de Estrategia gastando PM.' },
  'APOYO':                { cat: 'Concepto', t: 'Tipo de acción que beneficia a aliados en lugar de atacar directamente.' },
  // Mecánicas
  'IMPULSO':              { cat: 'Mecánica', t: 'Mecánica del Ala Asesina. Durante Cargar, Retroceder o Reposicionarse, el agente puede retirarse y desplegarse a X" en horizontal.' },
  'ZONA DE IMPULSO':      { cat: 'Mecánica', t: 'Zona horizontal entre la ubicación actual del agente y la ubicación desde la que usó el IMPULSO.' },
  'ORDEN DE GUARDIA':     { cat: 'Mecánica', t: 'Los Korps de la Muerte pueden dar órdenes de grupo: ¡Apunten!, ¡Fijen bayonetas!, ¡Atrinchérense! o ¡Vamos, muévanse!' },
  'Agravio':              { cat: 'Mecánica', t: 'Ficha de los Sucesores Recuperadores. Por cada ficha en un enemigo, puedes convertir un éxito normal en crítico al atacarle.' },
});

// ── ESTADO ───────────────────────────────────────────────────
let currentFaction = null;
let activeTab      = 'op';
let searchQ        = '';
let openOps        = new Set();

// ── NAVEGACIÓN ───────────────────────────────────────────────
function goTo(factionId) {
  currentFaction = factionId;
  activeTab = 'op';
  searchQ   = '';
  openOps   = new Set();
  window.location.hash = factionId;
  render();
  window.scrollTo(0, 0);
}

function goHome() {
  currentFaction = null;
  window.location.hash = '';
  render();
  window.scrollTo(0, 0);
}

function toggleOp(id) {
  const body = document.getElementById('body-' + id);
  const chv  = document.getElementById('chv-' + id);
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : '';
  if (chv) chv.style.transform = isOpen ? '' : 'rotate(180deg)';
  isOpen ? openOps.delete(id) : openOps.add(id);
}

// ── RENDER PRINCIPAL ─────────────────────────────────────────
function render() {
  const app = document.getElementById('app');

  if (!currentFaction) {
    app.innerHTML = renderHome();
    hideKw();
    return;
  }

  const f = FACTIONS[currentFaction];
  if (!f) { goHome(); return; }

  app.innerHTML = renderFactionView(f, activeTab, searchQ, openOps);
  renderPane();
  bindTabEvents();
  bindSearch();
}

function renderPane() {
  const pane = document.getElementById('pane');
  if (!pane) return;
  const f = FACTIONS[currentFaction];
  if (!f) return;

  let html = '';
  if      (activeTab === 'op') html = renderOps(f, searchQ, openOps);
  else if (activeTab === 'gr') html = renderGR(f.gr);
  else if (activeTab === 'rf') html = renderFR(f.fr);
  else if (activeTab === 'ar') html = renderPL(f.pl);
  else if (activeTab === 'eq') html = renderEQ(f.eq);
  else if (activeTab === 'er') html = renderER(f.er);

  pane.innerHTML = html;
  bindKwClicks(pane);
}

function bindTabEvents() {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => {
      activeTab = b.dataset.tab;
      searchQ   = '';
      document.querySelectorAll('.tab-btn').forEach(x => x.classList.toggle('on', x === b));
      renderPane();
      window.scrollTo(0, 0);
    });
  });
}

function bindSearch() {
  const si = document.getElementById('si');
  if (!si) return;
  si.addEventListener('input', e => {
    searchQ = e.target.value;
    if (activeTab === 'op') renderPane();
  });
}

// ── KEYWORD FOOTER ────────────────────────────────────────────
const kwIdle  = document.getElementById('kw-idle');
const kwAct   = document.getElementById('kw-active');
const kwCat   = document.getElementById('kw-cat');
const kwNm    = document.getElementById('kw-nm');
const kwDs    = document.getElementById('kw-ds');
const kwClose = document.getElementById('kw-close');

function showKw(term) {
  const key   = Object.keys(KEYWORDS).find(k => k.toLowerCase() === term.toLowerCase());
  const entry = key ? KEYWORDS[key] : null;
  if (!entry) return;
  kwIdle.style.display  = 'none';
  kwAct.classList.add('on');
  kwClose.style.display = 'block';
  kwCat.textContent     = entry.cat.toUpperCase();
  kwNm.textContent      = key;
  kwDs.textContent      = entry.t;
}

function hideKw() {
  kwIdle.style.display = 'flex';
  kwAct.classList.remove('on');
  kwClose.style.display = 'none';
}

kwClose.addEventListener('click', hideKw);

function bindKwClicks(root) {
  root.querySelectorAll('[data-kw]').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); showKw(el.dataset.kw); });
  });
}

// ── HASH ROUTING ─────────────────────────────────────────────
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && FACTIONS[hash]) {
    currentFaction = hash;
    activeTab = 'op';
    searchQ   = '';
    openOps   = new Set();
  } else {
    currentFaction = null;
  }
  render();
});

// ── INIT ─────────────────────────────────────────────────────
(function init() {
  const hash = window.location.hash.replace('#', '');
  if (hash && FACTIONS[hash]) {
    currentFaction = hash;
  }
  render();
})();
