// ============================================================
//  render.js — Motor compartido para todas las facciones
//  Imágenes operativos: rutas locales desde carpeta Imagenes/
// ============================================================

const ICONS = {
  lpa:    'Imagenes/lpa.png',
  mov:    'Imagenes/mov.png',
  def:    'Imagenes/def.png',
  her:    'Imagenes/her.png',
  ranged: 'Imagenes/ranged.png',
  cac:    'Imagenes/cac.png',
};



// ── DETECCIÓN DE ARMAS CaC ───────────────────────────────────
// Lista de términos que identifican armas de combate cuerpo a cuerpo.
// Amplía esta lista cuando añadas nuevas facciones con armas de cuerpo a cuerpo.
const MELEE_TERMS = [
  // Armas genéricas
  'bayoneta', 'puño', 'puños', 'nudillos', 'hacha', 'espada', 'cuchillo', 'sierra', 'garra', 'garras',
  // Armas con prefijo de material/energía presentes en las facciones actuales
  'brazo biónico', 'arma de energía', 'puño de energía', 'garra relámpago', 'garras relámpago',
  'guantelete', 'cuchillo de plasma', 'garras mutadas',
];

// ── UTILIDADES ───────────────────────────────────────────────

// annotate() convierte texto plano en HTML con keywords enlazadas.
// — Opera siempre sobre texto plano: si recibe HTML ya anotado, lo desamarca primero
//   para evitar doble-wrap (idempotente).
// — Procesa keywords de más largo a más corto para que "Críticos de penetración"
//   gane frente a "Penetración".
// — Descarta solapamientos: el match más largo (o el primero en caso de empate) gana.
function annotate(text) {
  if (!text) return '';

  // Guardia: si el texto ya tiene spans de keyword, extraer el texto plano primero.
  // Esto hace la función segura ante llamadas accidentales sobre HTML ya generado.
  const plain = text.includes('<span class="rkw"')
    ? text.replace(/<[^>]+>/g, '')
    : text;

  const sorted = Object.keys(KEYWORDS).slice().sort((a, b) => b.length - a.length);

  const matches = [];
  sorted.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b(${escaped})\\b`, 'gi');
    let m;
    while ((m = re.exec(plain)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, key: kw, matched: m[0] });
    }
  });

  if (matches.length === 0) return plain;

  // Ordenar por posición; en caso de empate de inicio, el más largo primero
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // Descartar solapamientos
  const kept = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start >= cursor) { kept.push(m); cursor = m.end; }
  }

  // Reconstruir el string intercalando spans solo donde corresponde
  let result = '';
  let pos = 0;
  for (const m of kept) {
    result += plain.slice(pos, m.start);
    result += `<span class="rkw" data-kw="${m.key}">${m.matched}</span>`;
    pos = m.end;
  }
  result += plain.slice(pos);
  return result;
}

function weaponRules(arr) {
  if (!arr || arr.length === 0) return '—';
  return arr.map(r => {
    const base = r.replace(/\s*\d+[""]?\s*$/, '').replace(/\s*\*$/, '').trim();
    const found = Object.keys(KEYWORDS).find(k => base.toLowerCase().startsWith(k.toLowerCase()));
    return found
      ? `<span class="rkw" data-kw="${found}">${r}</span>`
      : `<span style="color:var(--text-2)">${r}</span>`;
  }).join(', ');
}

function weaponIcon(w) {
  const name = w.n.toLowerCase();
  const isMelee = MELEE_TERMS.some(term => name.includes(term));
  const src = isMelee ? ICONS.cac : ICONS.ranged;
  return `<img src="${src}" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;opacity:.85;margin-right:5px">`;
}

// ── HOME ─────────────────────────────────────────────────────

function renderHome() {
  const cards = Object.values(FACTIONS).map(f => `
    <div class="faction-card" onclick="goTo('${f.id}')">
      ${f.img
        ? `<img class="faction-card-img" src="${f.img}" alt="${f.name}"
             onerror="this.outerHTML='<div class=\\'faction-card-ph\\'>${f.icon || '⚔'}</div>'">`
        : `<div class="faction-card-ph">${f.icon || '⚔'}</div>`
      }
      <div class="faction-card-body">
        <span class="faction-card-sub">${f.subfaction}</span>
        <span class="faction-card-name">${f.name}</span>
        <p class="faction-card-desc">${f.desc}</p>
        <div class="faction-card-tags">
          ${(f.tags || []).map(t => `<span class="faction-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="faction-card-footer">Ver comando <span>→</span></div>
    </div>`).join('');

  const soon = (window.COMING_SOON || []).map(c => `
    <div class="faction-card-soon">
      <div class="faction-card-soon-icon">${c.icon}</div>
      <div class="faction-card-soon-name">${c.name}</div>
      <div class="faction-card-soon-badge">Próximamente</div>
    </div>`).join('');

  return `
    <div class="wrap">
      <header class="home-hdr">
        <span class="home-pre">Warhammer 40,000</span>
        <h1 class="home-h1">Kill Team</h1>
        <p class="home-sub">Selecciona un comando para ver sus operativos, reglas y ardides</p>
        <nav class="home-nav">
          <span class="nav-link active">Comandos</span>
          <a class="nav-link" href="misiones/misiones.html">Misiones</a>
        </nav>
      </header>
      <div class="section-label">Comandos disponibles</div>
      <div class="faction-grid">${cards}${soon}</div>
      <footer class="page-footer">Kill Team Companion — uso personal</footer>
    </div>`;
}

// ── VISTA DE FACCIÓN ─────────────────────────────────────────

function renderFactionView(f, activeTab, searchQ, openOps) {
  const tagHtml = (f.tags || []).map(t => `<span class="hdr-tag">${t}</span>`).join('');
  return `
    <div class="wrap">
      <div class="faction-hdr">
        <div class="faction-hdr-inner">
          <div class="faction-hdr-left">
            <span class="faction-hdr-pre">${f.subfaction}</span>
            <span class="faction-hdr-title">${f.name}</span>
          </div>
          <div class="faction-hdr-tags">
            ${tagHtml}
            <span class="hdr-tag hdr-tag-accent">v${f.version || '1.0'}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:6px">
          <button class="btn-back" onclick="goHome()">
            <i class="ti ti-arrow-left"></i> Todos los comandos
          </button>
          <a class="btn-back" href="misiones/misiones.html">
            <i class="ti ti-map"></i> Misiones
          </a>
        </div>
      </div>
      <div class="srch">
        <i class="ti ti-search"></i>
        <input id="si" type="search" placeholder="Buscar operativo, arma, regla..." value="${searchQ}">
      </div>
      <nav class="tabs">
        <button class="tab-btn ${activeTab==='op'?'on':''}" data-tab="op">Operativos</button>
        <button class="tab-btn ${activeTab==='gr'?'on':''}" data-tab="gr">Reglas</button>
        <button class="tab-btn ${activeTab==='rf'?'on':''}" data-tab="rf">Facción</button>
        <button class="tab-btn ${activeTab==='ar'?'on':''}" data-tab="ar">Ardides</button>
        <button class="tab-btn ${activeTab==='eq'?'on':''}" data-tab="eq">Equipo</button>
        <button class="tab-btn ${activeTab==='er'?'on':''}" data-tab="er">Erratas</button>
      </nav>
      <main id="pane"></main>
    </div>`;
}

// ── OPERATIVOS ───────────────────────────────────────────────

function renderOp(op, openOps) {
  const imgUrl = op.img || '';
  const isOpen = openOps.has(op.id);

  const kws = op.kw.map(k =>
    KEYWORDS[k]
      ? `<span class="kpill" style="cursor:pointer;text-decoration:underline dotted;text-underline-offset:2px" data-kw="${k}">${k}</span>`
      : `<span class="kpill">${k}</span>`
  ).join('');

  const weaponRows = op.w.map(w => `
    <tr>
      <td>${weaponIcon(w)}${w.n}</td>
      <td class="cn">${w.a}</td>
      <td class="cn">${w.i}</td>
      <td class="dm">${w.d}</td>
      <td class="rt">${weaponRules(w.r)}</td>
    </tr>`).join('');

  const rules = op.ru && op.ru.length
    ? op.ru.map(r => `
        <div class="${r.isAct ? 'rbox-act' : 'rbox'}">
          <div class="${r.isAct ? 'rname-act' : 'rname'}">${r.n}</div>
          <div class="rtxt">${annotate(r.t)}</div>
        </div>`).join('')
    : '<div class="rtxt" style="color:var(--text-3);font-size:12px">Sin reglas especiales.</div>';

  return `
  <div class="op-card" id="op-${op.id}">
    <div class="op-hd-card" onclick="toggleOp('${op.id}')">
      <div class="op-hd-left"${imgUrl ? ` style="background-image:url('${imgUrl}')"` : ''}>
        <div class="op-hd-name-col">
          <span class="op-hd-type">${op.type}</span>
          <span class="op-hd-name">${op.name}</span>
        </div>
      </div>
      <div class="op-hd-stats-col">
        <div class="op-stat-box">
          <img src="${ICONS.lpa}" class="op-stat-icon">
          <span class="op-stat-lbl">LPA</span>
          <span class="op-stat-val op-stat-val-accent">${op.s.lpa}</span>
        </div>
        <div class="op-stat-box">
          <img src="${ICONS.mov}" class="op-stat-icon">
          <span class="op-stat-lbl">MOV.</span>
          <span class="op-stat-val">${op.s.mov}</span>
        </div>
        <div class="op-stat-box">
          <img src="${ICONS.def}" class="op-stat-icon">
          <span class="op-stat-lbl">SALV.</span>
          <span class="op-stat-val">${op.s.salv}</span>
        </div>
        <div class="op-stat-box">
          <img src="${ICONS.her}" class="op-stat-icon">
          <span class="op-stat-lbl">HERIDAS</span>
          <span class="op-stat-val">${op.s.h}</span>
        </div>
        <div class="op-hd-chv">
          <i class="ti ti-chevron-down" id="chv-${op.id}" style="${isOpen ? 'transform:rotate(180deg)' : ''}"></i>
        </div>
      </div>
    </div>
    <div class="op-body" id="body-${op.id}" style="${isOpen ? '' : 'display:none'}">
      <div class="kw-pills">${kws}</div>
      <span class="sec-lbl">Armamento</span>
      <div class="tbl-wrap">
        <table class="wt">
          <thead><tr>
            <th>Arma</th>
            <th class="cn" style="width:36px">ATQ</th>
            <th class="cn" style="width:36px">IMP</th>
            <th class="cn" style="width:50px">DAÑO</th>
            <th style="width:180px">Reglas de arma</th>
          </tr></thead>
          <tbody>${weaponRows}</tbody>
        </table>
      </div>
      <span class="sec-lbl" style="margin-top:14px">Habilidades</span>
      <div class="rule-list">${rules}</div>
    </div>
  </div>`;
}

function renderOps(f, searchQ, openOps) {
  const q = searchQ.toLowerCase();
  const list = q
    ? f.ops.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q) ||
        (o.kw || []).some(k => k.toLowerCase().includes(q)) ||
        o.w.some(w => w.n.toLowerCase().includes(q)) ||
        (o.ru || []).some(r => r.n.toLowerCase().includes(q))
      )
    : f.ops;
  if (!list.length) return '<div class="empty">No se encontraron operativos.</div>';
  return `<div class="cnt">${list.length} OPERATIVO${list.length !== 1 ? 'S' : ''}</div>` +
    list.map(op => renderOp(op, openOps)).join('');
}

// ── OTRAS SECCIONES ───────────────────────────────────────────

function renderGR(gr) {
  const concepts = gr.concepts.map(c => `<div class="gr-card"><div class="gr-top"><span class="gr-name">${c.n}</span></div><div class="gr-txt">${annotate(c.t)}</div></div>`).join('');
  const orders   = gr.orders.map(o => `<div class="gr-card"><div class="gr-top"><span class="gr-name">${o.n}</span></div><div class="gr-txt">${annotate(o.t)}</div></div>`).join('');
  const phases   = gr.phases.map(p => `<div class="gr-card"><div class="gr-top"><span class="gr-name">${p.n}</span></div><div class="gr-txt">${annotate(p.t)}</div></div>`).join('');
  const actions  = gr.actions.map(a => `<div class="gr-card"><div class="gr-top"><span class="gr-name">${a.n}</span><span class="gr-cost">${a.cost}</span></div><div class="gr-txt">${annotate(a.t)}</div></div>`).join('');
  const wrCards  = gr.wr.map(w => `<div class="gr-card"><div class="gr-top"><span class="gr-name">${w.n}</span></div><div class="gr-txt">${w.t}</div></div>`).join('');
  return `<span class="sec-lbl">Conceptos clave</span>${concepts}<span class="sec-lbl">Órdenes</span>${orders}<span class="sec-lbl">Fases del turno</span>${phases}<span class="sec-lbl">Acciones</span>${actions}<span class="sec-lbl">Reglas de arma</span><div class="wr-grid">${wrCards}</div>`;
}

function renderFR(fr) {
  const items = fr.orders.map(o => `<div class="ord-card"><div class="ord-name">${o.n}</div><div class="ord-txt">${annotate(o.t)}</div></div>`).join('');
  return `<div class="fr-card"><span class="fr-type">${fr.type}</span><div class="fr-name">${fr.name}</div><div class="fr-txt">${annotate(fr.text)}</div><span class="sec-lbl" style="margin-top:0">Detalles</span><div style="display:flex;flex-direction:column;gap:6px">${items}</div></div>`;
}

function renderPL(pl) {
  const s = pl.s.map(p => `<div class="pl-card"><div class="pl-name">${p.n}</div><div class="pl-txt">${annotate(p.t)}</div></div>`).join('');
  const f = pl.f.map(p => `<div class="pl-card"><div class="pl-name">${p.n}</div><div class="pl-txt">${annotate(p.t)}</div></div>`).join('');
  return `<div class="pl-grid"><div><span class="pl-col-hd">Ardides de Estrategia</span>${s}</div><div><span class="pl-col-hd">Ardides de Tiroteo</span>${f}</div></div>`;
}

function renderEQ(eq) {
  return eq.map(e => `<div class="eq-card"><div class="eq-name">${e.n}</div><div class="eq-txt">${annotate(e.t)}</div></div>`).join('');
}

function renderER(er) {
  return er.map(v => `<div class="er-v">Versión ${v.v}</div>${v.ee.map(e => `<div class="er-entry"><div class="er-sec">${e.s}</div><div class="er-txt">${e.t}</div></div>`).join('')}`).join('');
}
