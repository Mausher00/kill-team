// ============================================================
//  render.js — Motor compartido para todas las facciones
//  Imágenes operativos: rutas locales desde carpeta imagenes/
// ============================================================

const ICONS = {
  lpa:    'imagenes/lpa.png',
  mov:    'imagenes/mov.png',
  def:    'imagenes/def.png',
  her:    'imagenes/her.png',
  ranged: 'imagenes/ranged.png',
  cac:    'imagenes/cac.png',
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

  const sorted = [...new Set([...Object.keys(KEYWORDS), ...Object.keys(window.LOCAL_KW || {})])].sort((a, b) => b.length - a.length);

  const matches = [];
  sorted.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // \b de JS no trata letras acentuadas como palabra: "Área" nunca casaba.
    const re = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped})(?![\\p{L}\\p{N}])`, 'giu');
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

function kwLookup(term) {
  const L = window.LOCAL_KW || {};
  const t = term.toLowerCase();
  return Object.keys(L).find(k => k.toLowerCase() === t) ? 'local'
       : Object.keys(KEYWORDS).find(k => k.toLowerCase() === t) ? 'global' : null;
}

function weaponRules(arr) {
  if (!arr || arr.length === 0) return '—';
  const L = window.LOCAL_KW || {};
  return arr.map(r => {
    const base = r.replace(/\s*[\d"”x+\/]+"?\s*$/, '').replace(/\*$/, '').trim();
    const local = Object.keys(L).find(k => k.toLowerCase() === base.toLowerCase());
    const found = local || Object.keys(KEYWORDS).find(k => base.toLowerCase().startsWith(k.toLowerCase()));
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

const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || '');
const MOD = IS_MAC ? '⌘' : 'Ctrl';

function renderHome() {
  const all = Object.values(FACTIONS);
  const filt = window.homeFilter || '';
  const chipsSet = [...new Set(all.flatMap(f => f.tags || []))];
  const chips = ['', ...chipsSet].map(t => `<button class="chip${t === filt ? ' on' : ''}" onclick="setHomeFilter('${t.replace(/'/g, "\\'")}')">${t || 'Todos'}<span>${t ? all.filter(f => (f.tags || []).includes(t)).length : all.length}</span></button>`).join('');
  const shown = filt ? all.filter(f => (f.tags || []).includes(filt)) : all;
  const cards = shown.map((f, i) => `
    <div class="faction-card spot lift reveal" style="--i:${i}" tabindex="0" role="link"
         aria-label="Ver comando ${f.name}" onclick="goTo('${f.id}')"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();goTo('${f.id}')}">
      ${f.img
        ? `<div class="faction-card-imgwrap"><img class="faction-card-img" src="${f.img}" alt="" loading="lazy"
             onerror="this.parentNode.outerHTML='<div class=\\'faction-card-ph\\'>${f.icon || '⚔'}</div>'"></div>`
        : `<div class="faction-card-ph">${f.icon || '⚔'}</div>`
      }
      <div class="faction-card-body">
        <span class="faction-card-sub">${f.subfaction}</span>
        <span class="faction-card-name">${f.name}</span>
        <p class="faction-card-desc">${f.desc || ''}</p>
        <div class="faction-card-tags">
          ${(f.tags || []).map(t => `<span class="faction-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="faction-card-footer">
        <span class="fc-meta">${f.ops.length} operativos${f.roster ? ' · <i class="ti ti-hammer"></i> constructor' : ''}</span>
        <span>→</span>
      </div>
    </div>`).join('');

  const n = Object.keys(FACTIONS).length;
  const soon = (window.COMING_SOON || []).map((c, i) => `
    <div class="faction-card-soon reveal" style="--i:${n + i}">
      ${c.img ? `<img src="${c.img}" alt="" class="soon-img" loading="lazy">` : `<div class="faction-card-soon-icon">${c.icon}</div>`}
      <div class="faction-card-soon-name">${c.name}</div>
      <div class="faction-card-soon-badge">Próximamente</div>
    </div>`).join('');

  return `
    <div class="wrap">
      <header class="home-hdr reveal">
        <span class="home-pre">Warhammer 40,000</span>
        <h1 class="home-h1">Kill Team</h1>
        <p class="home-sub">Selecciona un comando para ver sus operativos, reglas y ardides</p>
        <nav class="home-nav">
          <span class="nav-link active"><i class="ti ti-books"></i> Comandos</span>
          <a class="nav-link" href="builder.html"><i class="ti ti-hammer"></i> Constructor</a>
          <a class="nav-link" href="misiones/misiones.html"><i class="ti ti-map"></i> Misiones</a>
        </nav>
      </header>
      <button class="search-trigger spot reveal" style="--i:1" onclick="openPalette()" aria-label="Buscar en todos los comandos">
        <i class="ti ti-search"></i>
        <span>Buscar operativo, arma, regla, ardid…</span>
        <span class="st-keys"><kbd>${MOD}</kbd><kbd>K</kbd></span>
      </button>
      <div class="section-label">Comandos disponibles <span class="sl-count">${n}</span></div>
      <div class="chips" role="toolbar" aria-label="Filtrar comandos">${chips}</div>
      <div class="faction-grid">${cards}${filt ? '' : soon}</div>
      <footer class="page-footer">Kill Team Companion — uso personal · pulsa <kbd>?</kbd> para ver los atajos</footer>
    </div>`;
}

// ── VISTA DE FACCIÓN ─────────────────────────────────────────

const TABS = [
  { id: 'op', label: 'Operativos', count: f => f.ops.length },
  { id: 'gr', label: 'Reglas' },
  { id: 'rf', label: 'Facción' },
  { id: 'ar', label: 'Ardides',   count: f => (f.pl?.s?.length || 0) + (f.pl?.f?.length || 0) },
  { id: 'eq', label: 'Equipo',    count: f => f.eq?.length || 0 },
  { id: 'er', label: 'Erratas',   count: f => (f.er || []).reduce((n, v) => n + v.ee.length, 0) },
];

function renderFactionView(f, activeTab, searchQ, openOps) {
  const tagHtml = (f.tags || []).map(t => `<span class="hdr-tag">${t}</span>`).join('');
  const tabs = TABS.map((t, i) => {
    const c = t.count ? t.count(f) : null;
    return `<button class="tab-btn ${activeTab === t.id ? 'on' : ''}" data-tab="${t.id}" role="tab"
      aria-selected="${activeTab === t.id}" title="${t.label} (${i + 1})">${t.label}${c ? `<span class="tcount">${c}</span>` : ''}</button>`;
  }).join('');
  return `
    <div class="wrap">
      <div class="faction-hdr reveal">
        <div class="faction-hdr-inner">
          <div class="faction-hdr-left">
            <span class="faction-hdr-pre">${f.subfaction}</span>
            <span class="faction-hdr-title">${f.name}</span>
          </div>
          <div class="faction-hdr-tags">
            ${tagHtml}
            <span class="hdr-tag hdr-tag-accent" title="Fecha de la última actualización del PDF oficial">${/^\d/.test(f.version || '') ? 'v' + f.version : (f.version || '—')}</span>
          </div>
        </div>
        <div class="faction-actions">
          <button class="btn-back" onclick="goHome()" title="Volver (Alt+←)">
            <i class="ti ti-arrow-left"></i> Todos los comandos
          </button>
          <a class="btn-back" href="misiones/misiones.html"><i class="ti ti-map"></i> Misiones</a>
          <span style="flex:1"></span>
          ${f.roster ? `<a class="icon-btn accent ripple" href="builder.html#${f.id}" title="Abrir en el constructor"><i class="ti ti-hammer"></i> Construir</a>` : ''}
          <button class="icon-btn" onclick="openPalette()" title="Buscar en todo (${MOD}+K)" aria-label="Buscar en todo"><i class="ti ti-command"></i></button>
        </div>
      </div>
      <div class="sticky-head">
        <div class="srch">
          <i class="ti ti-search"></i>
          <input id="si" type="search" placeholder="Filtrar en esta pestaña…" value="${searchQ.replace(/"/g, '&quot;')}" aria-label="Filtrar">
          <kbd class="srch-kbd">/</kbd>
        </div>
        <nav class="tabs" role="tablist">${tabs}</nav>
      </div>
      <main id="pane" role="tabpanel"></main>
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
      <td class="rt${w.r && w.r.length ? '' : ' none'}">${weaponRules(w.r)}</td>
    </tr>`).join('');

  const rules = op.ru && op.ru.length
    ? op.ru.map(r => `
        <div class="${r.isAct ? 'rbox-act' : 'rbox'}">
          <div class="${r.isAct ? 'rname-act' : 'rname'}">${r.n}</div>
          <div class="rtxt">${annotate(r.t).replace(/\n/g, '<br>')}</div>
        </div>`).join('')
    : '<div class="rtxt" style="color:var(--text-3);font-size:12px">Sin reglas especiales.</div>';

  return `
  <div class="op-card spot reveal${isOpen ? ' open' : ''}" id="op-${op.id}" style="--i:${op._i || 0}">
    <div class="op-hd-card" role="button" tabindex="0" aria-expanded="${isOpen}" aria-controls="body-${op.id}"
         onclick="toggleOp('${op.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleOp('${op.id}')}">
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
          <i class="ti ti-chevron-down" id="chv-${op.id}"></i>
        </div>
      </div>
    </div>
    <div class="acc" id="body-${op.id}"><div class="acc-in"><div class="op-body">
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
    </div></div></div>
  </div>`;
}

function renderOps(f, searchQ, openOps) {
  const q = KT.norm(searchQ.trim());
  const has = t => KT.norm(t).includes(q);
  const list = q
    ? f.ops.filter(o =>
        has(o.name) || has(o.type) ||
        (o.kw || []).some(has) ||
        o.w.some(w => has(w.n) || (w.r || []).some(has)) ||
        (o.ru || []).some(r => has(r.n) || has(r.t))
      )
    : f.ops;
  if (!list.length) return `<div class="empty"><i class="ti ti-mood-empty" style="font-size:26px;display:block;margin-bottom:6px"></i>No se encontraron operativos para “${KT.esc(searchQ)}”.</div>`;
  list.forEach((o, i) => { o._i = Math.min(i, 12); });
  const allOpen = list.every(o => openOps.has(o.id));
  return `<div class="list-bar">
      <span class="cnt">${list.length} OPERATIVO${list.length !== 1 ? 'S' : ''}${q ? ` · filtro “${KT.esc(searchQ)}”` : ''}</span>
      <button class="link-btn" onclick="toggleAllOps()" title="Expandir/contraer todo (E)">
        <i class="ti ti-${allOpen ? 'fold' : 'fold-down'}"></i> ${allOpen ? 'Contraer todo' : 'Expandir todo'}
      </button>
    </div>` +
    list.map(op => renderOp(op, openOps)).join('');
}

// ── OTRAS SECCIONES ───────────────────────────────────────────

function renderGR(gr) {
  const concepts = gr.concepts.map(c => `<div class="gr-card filt spot"><div class="gr-top"><span class="gr-name">${c.n}</span></div><div class="gr-txt">${annotate(c.t)}</div></div>`).join('');
  const orders   = gr.orders.map(o => `<div class="gr-card filt spot"><div class="gr-top"><span class="gr-name">${o.n}</span></div><div class="gr-txt">${annotate(o.t)}</div></div>`).join('');
  const phases   = gr.phases.map(p => `<div class="gr-card filt spot"><div class="gr-top"><span class="gr-name">${p.n}</span></div><div class="gr-txt">${annotate(p.t)}</div></div>`).join('');
  const actions  = gr.actions.map(a => `<div class="gr-card filt spot"><div class="gr-top"><span class="gr-name">${a.n}</span><span class="gr-cost">${a.cost}</span></div><div class="gr-txt">${annotate(a.t)}</div></div>`).join('');
  const wrCards  = gr.wr.map(w => `<div class="gr-card filt spot"><div class="gr-top"><span class="gr-name">${w.n}</span></div><div class="gr-txt">${w.t}</div></div>`).join('');
  return `<span class="sec-lbl">Conceptos clave</span>${concepts}<span class="sec-lbl">Órdenes</span>${orders}<span class="sec-lbl">Fases del turno</span>${phases}<span class="sec-lbl">Acciones</span>${actions}<span class="sec-lbl">Reglas de arma</span><div class="wr-grid">${wrCards}</div>`;
}

function renderFR(f) {
  // Formato nuevo: f.frs = [{ name, text, subs:[{n,t}] }]; antiguo: f.fr = { name, type, text, orders }
  const list = f.frs && f.frs.length ? f.frs
    : f.fr ? [{ name: f.fr.name, text: f.fr.text, subs: (f.fr.orders || []).map(o => ({ n: o.n, t: o.t })) }] : [];
  if (!list.length) return '';
  const para = t => annotate(t).replace(/\n/g, '<br>');
  return list.map((r, i) => `
    <div class="fr-card filt spot reveal" style="--i:${i}">
      <span class="fr-type">Regla de facción</span>
      <div class="fr-name">${r.name}</div>
      ${r.text ? `<div class="fr-txt">${para(r.text)}</div>` : ''}
      ${r.subs && r.subs.length ? `<div style="display:flex;flex-direction:column;gap:6px">${r.subs.map(o =>
        `<div class="ord-card"><div class="ord-name">${o.n}</div><div class="ord-txt">${para(o.t)}</div></div>`).join('')}</div>` : ''}
    </div>`).join('');
}

function renderPL(pl) {
  const s = pl.s.map(p => `<div class="pl-card filt spot"><div class="pl-name">${p.n}</div><div class="pl-txt">${annotate(p.t).replace(/\n/g, '<br>')}</div></div>`).join('');
  const f = pl.f.map(p => `<div class="pl-card filt spot"><div class="pl-name">${p.n}</div><div class="pl-txt">${annotate(p.t).replace(/\n/g, '<br>')}</div></div>`).join('');
  return `<div class="pl-grid"><div><span class="pl-col-hd">Ardides de Estrategia</span>${s}</div><div><span class="pl-col-hd">Ardides de Tiroteo</span>${f}</div></div>`;
}

function renderEQ(eq) {
  return eq.map(e => `<div class="eq-card filt spot"><div class="eq-name">${e.n}</div><div class="eq-txt">${annotate(e.t).replace(/\n/g, '<br>')}</div></div>`).join('');
}

function renderER(er) {
  return er.map(v => `<div class="er-v">Versión ${v.v}</div>${v.ee.map(e => `<div class="er-entry filt spot"><div class="er-sec">${e.s}</div><div class="er-txt">${e.t.replace(/\n/g, '<br>')}</div></div>`).join('')}`).join('');
}
