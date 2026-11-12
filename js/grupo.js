// ============================================================
//  grupo.js — Página de una comunidad (dentro de comunidad.html)
//  Pestañas: Tablón · Eventos (eventos.js) · Partidas · Galería · Miembros
//  · Roles: fundador, administrador, miembro (los permisos los comprueba el servidor)
//  · Rango honorífico: partidas jugadas en la comunidad + 5 por cada distinción
//    (torneo o evento ganado, que dan los administradores)
//  · Tablón: 250 caracteres (1000 quien administra), respuestas, anuncios fijados
//  · Compartir en redes: imagen y texto, sin enlace (compartir.js)
//  Expone KT.grupo = { open(g, onHome), render(), active }.
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  const RANGOS = [[0, 'Recluta'], [3, 'Agente'], [10, 'Veterano'], [25, 'Élite'], [50, 'Comandante'], [100, 'Leyenda']];
  const TIPOS = { torneo: 'Torneo', liga: 'Liga', campana: 'Campaña', evento: 'Evento', oficial: 'Evento oficial', otro: 'Otro' };
  const LIM = { miembro: 250, admin: 1000 };
  const fecha = d => new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const dia = d => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  let G = null, onHome = null, tab = 'tablon', D = {}, replyTo = null, busy = false;
  const canAdmin = () => G && (G.rol === 'fundador' || G.rol === 'admin' || N.esAdmin);
  const isFounder = () => G && (G.rol === 'fundador' || N.esAdmin);
  const lim = () => canAdmin() ? LIM.admin : LIM.miembro;

  const run = async (fn, ok) => {
    if (busy) return; busy = true; document.body.style.cursor = 'progress';
    try { const r = await fn(); if (ok) KT.toast(typeof ok === 'function' ? ok(r) : ok, { type: 'ok' }); return r; }
    catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 6000 }); }
    finally { busy = false; document.body.style.cursor = ''; }
  };

  // ── Rangos ─────────────────────────────────────────────────
  // Una partida cuenta para quien la publicó y para los miembros cuyo nombre coincide con un jugador.
  function stats() {
    const M = D.mem || [], byName = {}, S = {};
    M.forEach(m => { S[m.usuario] = { pj: 0, g: 0, ev: 0, dist: [] }; byName[KT.norm(m.nombre)] = m.usuario; });
    const seen = new Set();
    (D.res || []).forEach(p => {
      const d = p.datos; if (!d?.players || d.players.length !== 2) return;
      const id = d.id || p.id; if (seen.has(id)) return; seen.add(id);
      const who = new Set(); if (S[p.usuario]) who.add(p.usuario);
      d.players.forEach((pl, k) => {
        const u = byName[KT.norm(pl.name || '')]; if (!u) return;
        who.add(u); if (pl.total > d.players[1 - k].total) S[u].g++;
      });
      who.forEach(u => S[u].pj++);
    });
    // partidas de ligas, torneos y campañas de la comunidad
    (D.ev || []).forEach(e => e.encuentros.forEach(x => { if (x.pa == null) return;
      [[x.a, x.pa, x.pb], [x.b, x.pb, x.pa]].forEach(([u, m, o]) => { if (!S[u]) return; S[u].pj++; if (m > o) S[u].g++; }); }));
    (D.dist || []).forEach(x => { if (S[x.usuario]) { S[x.usuario].ev++; S[x.usuario].dist.push(x); } });
    Object.values(S).forEach(s => {
      s.pts = s.pj + 5 * s.ev;
      let k = 0; RANGOS.forEach(([min], i) => { if (s.pts >= min) k = i; });
      s.rango = RANGOS[k][1]; s.nivel = k; s.sig = RANGOS[k + 1] || null;
    });
    return S;
  }
  const rankChip = (s, big) => s ? `<span class="rk rk${s.nivel}${big ? ' big' : ''}" title="${s.pj} partidas en la comunidad · ${s.ev} distinciones">${s.rango}${s.ev ? ' ' + '★'.repeat(Math.min(s.ev, 5)) : ''}</span>` : '';
  const roleOf = m => m.usuario === G.creador ? 'Fundador' : m.rol === 'admin' ? 'Administrador' : '';

  // ── Clasificación por resultados ───────────────────────────
  function standings() {
    const T = {}, row = n => T[KT.norm(n)] || (T[KT.norm(n)] = { n, pj: 0, g: 0, e: 0, d: 0, pf: 0, pc: 0 }), seen = new Set();
    (D.res || []).filter(p => p.datos?.players?.length === 2).forEach(p => {
      const id = p.datos.id || p.id; if (seen.has(id)) return; seen.add(id);
      const [a, b] = p.datos.players, A = row(a.name), B = row(b.name);
      A.pj++; B.pj++; A.pf += a.total; A.pc += b.total; B.pf += b.total; B.pc += a.total;
      if (a.total === b.total) { A.e++; B.e++; } else if (a.total > b.total) { A.g++; B.d++; } else { B.g++; A.d++; }
    });
    return Object.values(T).sort((x, y) => y.g - x.g || (y.pf - y.pc) - (x.pf - x.pc) || y.pf - x.pf);
  }

  // ── Piezas de una publicación ──────────────────────────────
  const fn = x => FACTIONS[x.faction]?.name || x.faction || '';
  function resHtml(d) {
    const [a, b] = d.players, w = a.total === b.total ? -1 : a.total > b.total ? 0 : 1;
    return `<div class="q-res"><span class="${w === 0 ? 'w' : ''}">${esc(a.name)}<small>${esc(fn(a))}</small></span><b>${a.total} – ${b.total}</b><span class="${w === 1 ? 'w' : ''}">${esc(b.name)}<small>${esc(fn(b))}</small></span></div>`;
  }
  function attachHtml(p) {
    if (p.tipo === 'resultado' && p.datos?.players) return resHtml(p.datos);
    if (p.tipo === 'banda' && p.datos) {
      const f = FACTIONS[p.datos.factionId], n = (p.datos.ops || []).reduce((s, o) => s + (o.qty || 0), 0);
      return `<div class="q-card">${f ? `<img src="${f.img}" alt="">` : ''}<div><b>${esc(p.datos.name || 'Banda')}</b><small>${esc(f?.name || p.datos.factionId)} · ${n} agentes${f ? '' : ' · no tienes este comando'}</small>
        <small style="display:block">${(p.datos.ops || []).map(o => (o.qty > 1 ? o.qty + '× ' : '') + esc(o.label)).join(' · ')}</small></div>
        <button class="icon-btn accent" data-pa="saveband" ${f ? '' : 'disabled'}><i class="ti ti-device-floppy"></i> Guardar en mis bandas</button></div>`;
    }
    if (p.tipo === 'comando' && p.datos) {
      const c = p.datos.comando || p.datos;
      return `<div class="q-card"><div><b>${esc(c.name || 'Comando')}</b><small>${esc(c.subfaction || '')} · ${(c.ops || []).length} operativos</small></div>
        <button class="icon-btn accent" data-pa="savecmd"><i class="ti ti-package-import"></i> Añadir a mis comandos</button></div>`;
    }
    return '';
  }
  const counter = (n, max) => `<span class="g-count${n > max ? ' over' : ''}" data-count>${n}/${max}</span>`;
  function postHtml(p, S) {
    const m = (D.mem || []).find(x => x.usuario === p.usuario), role = m ? roleOf(m) : '';
    const R = p.respuestas || [], open = replyTo === p.id;
    return `<article class="q-post${p.fijada ? ' pin' : ''}" data-post="${p.id}">
      <header>${N.avatar(p.nombre, p.usuario)}<div class="g-who"><b>${esc(p.nombre)}</b>${rankChip(S[p.usuario])}${role ? `<span class="acc-badge">${role}</span>` : ''}</div>
        ${p.fijada ? '<span class="g-pin"><i class="ti ti-pin"></i> Anuncio</span>' : ''}<small>${fecha(p.creado)}</small></header>
      ${p.texto ? `<p>${esc(p.texto)}</p>` : ''}${attachHtml(p)}${p.url ? `<img class="ph" src="${esc(p.url)}" alt="Imagen compartida por ${esc(p.nombre)}" loading="lazy" data-pa="zoom">` : ''}
      <footer class="g-acts">
        <button data-pa="reply"><i class="ti ti-message"></i> Responder${R.length ? ` · ${R.length}` : ''}</button>
        <button data-pa="share"><i class="ti ti-share"></i> Compartir</button>
        ${canAdmin() ? `<button data-pa="pin"><i class="ti ti-pin"></i> ${p.fijada ? 'Soltar' : 'Fijar'}</button>` : ''}
        ${p.mia || canAdmin() ? '<button data-pa="del" class="warn"><i class="ti ti-trash"></i> Borrar</button>' : ''}
      </footer>
      ${R.length || open ? `<div class="g-replies">
        ${R.map(r => `<div class="g-reply" data-reply="${r.id}">${N.avatar(r.nombre, r.usuario)}<div><b>${esc(r.nombre)}</b> <small>${fecha(r.creado)}</small><p>${esc(r.texto || '')}</p></div>
          ${r.mia || canAdmin() ? '<button data-pa="rdel" title="Borrar respuesta" aria-label="Borrar respuesta"><i class="ti ti-x"></i></button>' : ''}</div>`).join('')}
        ${open ? `<form class="g-rform" data-rform><input name="texto" maxlength="${lim()}" placeholder="Escribe una respuesta…" autocomplete="off" autofocus>${counter(0, lim())}<button class="icon-btn accent" type="submit"><i class="ti ti-send"></i></button></form>` : ''}
      </div>` : ''}
    </article>`;
  }

  // ── Cabecera y pestañas ────────────────────────────────────
  function render() {
    if (!G) return;
    const M = D.mem, S = stats(), P = D.posts, GA = D.gal, R = D.res;
    const ctx = { G, D, canAdmin: canAdmin(), run, load, render };
    const tabs = [['tablon', 'Tablón', 'messages', P?.length], ['eventos', 'Eventos', 'calendar-event', KT.eventos.count(D)], ['partidas', 'Partidas', 'swords', R?.length], ['galeria', 'Galería', 'photo', GA?.length], ['miembros', 'Miembros', 'users-group', M?.length]];
    const rolTxt = { fundador: 'Eres el fundador', admin: 'Eres administrador', miembro: 'Eres miembro', externo: 'Moderando como administrador de la app' }[G.rol];
    app.innerHTML = `<header class="m-hd g-hd">
        <a class="back" href="#" data-g="home"><i class="ti ti-arrow-left"></i> Comunidades</a>
        <h1>${esc(G.nombre)}</h1>
        ${G.descripcion ? `<p class="g-desc">${esc(G.descripcion)}</p>` : ''}
        <p>${rolTxt}${M ? ' · ' + M.length + ' miembros' : ''}</p>
        <div class="row">
          <span class="q-code" title="Código para unirse">${esc(G.codigo)}</span>
          <button class="icon-btn" data-g="invite"><i class="ti ti-user-plus"></i> Invitar</button>
          <button class="icon-btn" data-g="refresh"><i class="ti ti-refresh"></i> Actualizar</button>
          ${canAdmin() ? '<button class="icon-btn" data-g="settings"><i class="ti ti-settings"></i> Ajustes</button>' : ''}
          ${G.rol === 'fundador' ? '' : G.rol === 'externo' ? '' : '<button class="icon-btn" data-g="leave"><i class="ti ti-logout"></i> Salir</button>'}
        </div></header>
      <div class="m-tabs g-tabs">${tabs.map(([k, v, ic, n]) => `<button class="${tab === k ? 'on' : ''}" data-gtab="${k}"><i class="ti ti-${ic}"></i> ${v}${n ? ` <span>${n}</span>` : ''}</button>`).join('')}</div>
      ${tab === 'tablon' ? boardHtml(S) : tab === 'eventos' ? KT.eventos.html(ctx) : tab === 'partidas' ? gamesHtml(S) : tab === 'galeria' ? galleryHtml() : membersHtml(S)}`;
    bindForms();
  }

  // ── Tablón ─────────────────────────────────────────────────
  function boardHtml(S) {
    const P = D.posts, me = KT.user.current();
    const rosters = me ? KT.user.mine(me.id) : [], cmds = window.KTC ? KTC.list() : [], H = (KT.store.get('historial', []) || []).slice(0, 12);
    const pins = (P || []).filter(p => p.fijada), rest = (P || []).filter(p => !p.fijada);
    return `<form class="m-form g-comp" id="pf">
        <textarea name="texto" maxlength="${lim()}" rows="2" placeholder="${canAdmin() ? 'Escribe un mensaje o un anuncio para la comunidad' : 'Escribe un mensaje (máximo 250 caracteres)'}"></textarea>
        <div class="m-row g-comp-bar">
          <select name="kind" class="m-in" aria-label="Adjuntar"><option value="">Sin adjunto</option><option value="imagen">Foto</option>
            ${H.length ? '<option value="resultado">Resultado de mi historial</option>' : ''}${rosters.length ? '<option value="banda">Una de mis bandas</option>' : ''}${cmds.length ? '<option value="comando">Un comando añadido</option>' : ''}</select>
          <input class="m-in" id="pk-img" name="file" type="file" accept="image/jpeg,image/png,image/webp" hidden style="padding-top:7px">
          <select class="m-in" id="pk-res" name="res" hidden>${H.map(r => `<option value="${esc(r.id)}">${esc(r.players[0].name)} ${r.players[0].total}–${r.players[1].total} ${esc(r.players[1].name)} · ${new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</option>`).join('')}</select>
          <select class="m-in" id="pk-band" name="band" hidden>${rosters.map(r => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select>
          <select class="m-in" id="pk-cmd" name="cmd" hidden>${cmds.map(c => `<option value="${esc(c.f.id)}">${esc(c.f.name)}</option>`).join('')}</select>
          ${canAdmin() ? '<label class="g-check"><input type="checkbox" name="fijada"> <i class="ti ti-pin"></i> Fijar como anuncio</label>' : ''}
          <span style="flex:1"></span>${counter(0, lim())}
          <button class="icon-btn accent" type="submit"><i class="ti ti-send"></i> Publicar</button>
        </div>
      </form>
      ${P == null ? '<div class="m-empty">Cargando…</div>' : !P.length ? '<div class="m-empty"><i class="ti ti-messages" style="font-size:28px;display:block;margin-bottom:6px"></i>El tablón está vacío. Escribe el primer mensaje o comparte un resultado.</div>'
        : (pins.length ? `<div class="m-sec"><i class="ti ti-pin"></i> Anuncios</div>${pins.map(p => postHtml(p, S)).join('')}<div class="m-sec"><i class="ti ti-messages"></i> Mensajes</div>` : '') + rest.map(p => postHtml(p, S)).join('')}`;
  }

  // ── Partidas ───────────────────────────────────────────────
  function gamesHtml(S) {
    const R = D.res, st = standings(), H = (KT.store.get('historial', []) || []).slice(0, 12);
    const seen = new Set(), list = (R || []).filter(p => { const id = p.datos?.id || p.id; if (!p.datos?.players || seen.has(id)) return false; seen.add(id); return true; });
    const byName = {}; (D.mem || []).forEach(m => { byName[KT.norm(m.nombre)] = m.usuario; });
    return `${KT.directo.listHtml(D.live)}${H.length ? `<form class="m-form" id="rf"><div class="m-row"><select class="m-in" name="res" style="flex:1 1 240px" aria-label="Partida de mi historial">${H.map(r => `<option value="${esc(r.id)}">${esc(r.players[0].name)} ${r.players[0].total}–${r.players[1].total} ${esc(r.players[1].name)} · ${new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</option>`).join('')}</select>
        <button class="icon-btn accent" type="submit"><i class="ti ti-trophy"></i> Publicar este resultado</button></div></form>` : '<p class="g-note">Cuando termines una partida, aparecerá aquí para publicarla en la comunidad.</p>'}
      ${R == null ? '<div class="m-empty">Cargando…</div>' : !st.length ? '<div class="m-empty"><i class="ti ti-swords" style="font-size:28px;display:block;margin-bottom:6px"></i>Todavía no hay partidas publicadas.</div>' : `
      <div class="m-sec"><i class="ti ti-trophy"></i> Clasificación</div>
      <div class="m-scroll"><table class="m-tab"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>PV+</th><th>PV−</th><th>Dif</th></tr></thead><tbody>
        ${st.map((r, k) => `<tr class="${k === 0 ? 'lead' : ''}"><td>${k + 1}</td><td class="n">${esc(r.n)} ${rankChip(S[byName[KT.norm(r.n)]])}</td><td>${r.pj}</td><td class="pts">${r.g}</td><td>${r.e}</td><td>${r.d}</td><td>${r.pf}</td><td>${r.pc}</td><td>${r.pf - r.pc > 0 ? '+' : ''}${r.pf - r.pc}</td></tr>`).join('')}</tbody></table></div>
      <div class="m-sec"><i class="ti ti-history"></i> Resultados <span>${list.length}</span></div>
      ${list.map(p => `<article class="q-post g-game" data-res="${p.id}"><header><small>${p.datos.date ? dia(p.datos.date) : fecha(p.creado)}${p.datos.crit ? ' · ' + esc(p.datos.crit) : ''} · publicado por ${esc(p.nombre)}</small></header>
        ${resHtml(p.datos)}
        <footer class="g-acts"><button data-ra="share"><i class="ti ti-share"></i> Compartir</button>${p.mia || canAdmin() ? '<button data-ra="del" class="warn"><i class="ti ti-trash"></i> Borrar</button>' : ''}</footer></article>`).join('')}`}${campsHtml()}`;
  }

  // ── Campañas compartidas por los miembros (solo lectura) ───
  const CR = () => (window.CAMPANA?.rangos || [{ n: 'Recluta', xp: 0 }]);
  const cRank = xp => { let k = 0; CR().forEach((r, i) => { if (xp >= r.xp) k = i; }); return CR()[k].n; };
  function campsHtml() {
    const C = D.camps; if (!C?.length) return '';
    return `<div class="m-sec"><i class="ti ti-flag-3"></i> Campañas de los miembros <span>${C.length}</span></div><div class="m-grid">${C.map(c => {
      const d = c.datos || {}, L = (d.log || []).filter(l => !l.spec), w = L.filter(l => l.res === 'w').length, dr = L.filter(l => l.res === 'd').length;
      return `<button class="m-card" data-camp="${c.usuario}|${esc(c.id)}"><small>${esc(c.jugador)} · ${esc(FACTIONS[c.comando]?.name || c.comando)}</small><b>${esc(c.nombre)}</b><span>${L.length} partidas · ${w}-${dr}-${L.length - w - dr} · ${(d.ops || []).filter(o => o.st !== 'dead').length} operativos</span></button>`; }).join('')}</div>`;
  }
  function campModal(c) {
    const d = c.datos || {}, f = FACTIONS[c.comando], L = (d.log || []).filter(l => !l.spec), ST = { ok: '', rec: 'En recuperación', dead: 'Caído' };
    const nm = o => o.name || f?.ops.find(x => x.id === o.opId)?.name || o.opId;
    KT.modal(`${esc(c.nombre)} · ${esc(c.jugador)}`, `<div class="g-camp">
      <div class="m-kv"><div><b>${(d.ops || []).filter(o => o.st !== 'dead').length}</b><small>Operativos</small></div><div><b>${d.pr ?? 0}</b><small>Requisición</small></div><div><b>${L.length}</b><small>Partidas</small></div><div><b>${L.filter(l => l.res === 'w').length}-${L.filter(l => l.res === 'd').length}-${L.filter(l => l.res === 'l').length}</b><small>G-E-P</small></div></div>
      <small class="g-note">${esc(f?.name || c.comando)} · actualizada el ${dia(c.actualizado)}. Solo lectura: la hoja la lleva ${esc(c.jugador)}.</small>
      <div class="m-sec"><i class="ti ti-users-group"></i> Operativos</div>
      ${[...(d.ops || [])].sort((a, b) => (a.st === 'dead') - (b.st === 'dead') || b.xp - a.xp).map(o => `<div class="g-cop${o.st === 'dead' ? ' dead' : ''}"><b>${esc(nm(o))}</b><span class="rk rk${Math.min(5, CR().findIndex(r => r.n === cRank(o.xp || 0)) + 1)}">${cRank(o.xp || 0)}</span><small>${o.xp || 0} XP · ${o.games || 0} partidas${ST[o.st] ? ' · ' + ST[o.st] : ''}</small>
        ${(o.hon || []).length ? `<small class="hon"><i class="ti ti-award"></i> ${o.hon.map(h => esc(h.n)).join(' · ')}</small>` : ''}${(o.scar || []).length ? `<small class="scar"><i class="ti ti-bandage"></i> ${o.scar.map(h => esc(h.n)).join(' · ')}</small>` : ''}</div>`).join('') || '<p class="g-note">Sin operativos.</p>'}
      ${L.length ? `<div class="m-sec"><i class="ti ti-history"></i> Últimas partidas</div>${L.slice(0, 8).map(l => `<div class="g-clog"><span class="${l.res}">${{ w: 'Victoria', d: 'Empate', l: 'Derrota' }[l.res] || ''}</span> ${l.vp ? l.vp[0] + '–' + l.vp[1] : ''} ${l.vs ? 'contra ' + esc(l.vs) : ''} <small>${l.date ? dia(l.date) : ''}</small></div>`).join('')}` : ''}
    </div>`, 'flag-3');
  }

  // ── Galería ────────────────────────────────────────────────
  function galleryHtml() {
    const GA = D.gal;
    return `<form class="m-form" id="gf"><div class="m-row">
        <input class="m-in" name="files" type="file" accept="image/jpeg,image/png,image/webp" multiple style="flex:1 1 220px;padding-top:7px" aria-label="Fotos">
        <input class="m-in" name="texto" maxlength="${lim()}" placeholder="Pie de foto (opcional)" style="flex:2 1 240px">
        <button class="icon-btn accent" type="submit"><i class="ti ti-photo-plus"></i> Subir a la galería</button></div>
        <small class="g-note">Hasta 6 fotos a la vez. Las fotos adjuntas a mensajes del tablón también aparecen aquí.</small></form>
      ${GA == null ? '<div class="m-empty">Cargando…</div>' : !GA.length ? '<div class="m-empty"><i class="ti ti-photo" style="font-size:28px;display:block;margin-bottom:6px"></i>Aún no hay fotos. Sube las de vuestras partidas y miniaturas.</div>'
        : `<div class="g-grid">${GA.map(p => `<button class="g-thumb" data-ph="${p.id}" aria-label="Foto de ${esc(p.nombre)}"><img src="${esc(p.url)}" alt="" loading="lazy"><span>${esc(p.nombre)}</span></button>`).join('')}</div>`}`;
  }
  function photoModal(p) {
    const close = KT.modal(`Foto de ${esc(p.nombre)}`, `<div class="g-photo"><img src="${esc(p.url)}" alt="">
      ${p.texto ? `<p>${esc(p.texto)}</p>` : ''}<small>${fecha(p.creado)}${p.galeria ? '' : ' · publicada en el tablón'}</small>
      <div class="usr-row"><button class="icon-btn accent" data-pm="share"><i class="ti ti-share"></i> Compartir</button><a class="icon-btn" href="${esc(p.url)}" target="_blank" rel="noopener"><i class="ti ti-maximize"></i> Abrir</a>
        ${p.mia || canAdmin() ? '<button class="icon-btn acc-del" data-pm="del"><i class="ti ti-trash"></i> Borrar</button>' : ''}</div></div>`, 'photo');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-pm]'); if (!b) return;
      if (b.dataset.pm === 'share') { close(); KT.share.photo(p.url, [p.texto, `📷 ${G.nombre} · Kill Team`].filter(Boolean).join('\n')); }
      else if (confirm('¿Borrar esta foto?')) { close(); run(async () => { await N.borrarPublicacion(p); await load(); }, 'Foto borrada'); }
    });
  }

  // ── Miembros ───────────────────────────────────────────────
  function membersHtml(S) {
    const M = D.mem; if (M == null) return '<div class="m-empty">Cargando…</div>';
    const order = m => (m.usuario === G.creador ? 0 : m.rol === 'admin' ? 1 : 2);
    const L = [...M].sort((a, b) => order(a) - order(b) || (S[b.usuario]?.pts || 0) - (S[a.usuario]?.pts || 0));
    return `<div class="ad-list">${L.map(m => {
        const s = S[m.usuario], role = roleOf(m), me = m.usuario === N.user.id, founder = m.usuario === G.creador;
        const next = s.sig ? `faltan ${s.sig[0] - s.pts} para ${s.sig[1]}` : 'rango máximo';
        return `<div class="ad-row" data-mem="${m.usuario}">
          ${N.avatar(m.nombre, m.usuario, 'ad-av')}
          <div class="ad-who"><b>${esc(m.nombre)} ${role ? `<span class="acc-badge">${role}</span>` : ''}${me ? ' <span class="acc-badge">Tú</span>' : ''}</b>
            <small>${rankChip(s, true)} ${s.pj} ${s.pj === 1 ? 'partida' : 'partidas'} · ${s.g} ${s.g === 1 ? 'victoria' : 'victorias'} · ${s.pts} ${s.pts === 1 ? 'punto' : 'puntos'} de rango · ${next}</small>
            ${s.dist.length ? `<div class="g-dist">${s.dist.map(x => `<span class="g-medal" title="${TIPOS[x.tipo] || ''} · ${dia(x.fecha)}"><i class="ti ti-award"></i> ${esc(x.titulo)}${canAdmin() ? `<button data-ma="undist" data-id="${x.id}" aria-label="Quitar distinción">×</button>` : ''}</span>`).join('')}</div>` : ''}</div>
          <div class="ad-acts">
            ${canAdmin() ? '<button class="icon-btn" data-ma="dist" title="Dar una distinción por un torneo o evento ganado"><i class="ti ti-award"></i><span>Distinción</span></button>' : ''}
            ${isFounder() && !founder ? `<button class="icon-btn" data-ma="role" title="${m.rol === 'admin' ? 'Quitarle la administración' : 'Nombrarle administrador'}"><i class="ti ti-shield${m.rol === 'admin' ? '-off' : '-check'}"></i><span>${m.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}</span></button>` : ''}
            ${canAdmin() && !founder && !me && (m.rol !== 'admin' || isFounder()) ? '<button class="icon-btn acc-del" data-ma="kick" title="Expulsar de la comunidad"><i class="ti ti-user-minus"></i></button>' : ''}
          </div></div>`;
      }).join('')}</div>
      <div class="m-sec"><i class="ti ti-military-rank"></i> Rangos</div>
      <div class="g-ranks">${RANGOS.map(([min, n], i) => `<span class="rk rk${i} big">${n}</span><small>${min} puntos</small>`).join('')}</div>
      <p class="g-note">Cada partida jugada en la comunidad (publicada en Partidas o de una liga o torneo) da 1 punto de rango. Cada distinción (un torneo, liga o evento ganado, que conceden los administradores) da 5 puntos y una estrella.</p>`;
  }
  function distModal(m) {
    const today = new Date().toISOString().slice(0, 10);
    const close = KT.modal('Distinción para ' + esc(m.nombre), `<form class="acc-form" id="df" style="padding:6px 4px">
      <label>Título<input name="titulo" maxlength="60" required placeholder="Campeón del Torneo de Otoño 2026" autofocus></label>
      <label>Por<select name="tipo" class="m-in" style="height:42px">${Object.entries(TIPOS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
      <label>Fecha<input name="fecha" type="date" value="${today}" max="${today}"></label>
      <small class="acc-hint">Suma 5 puntos de rango y una estrella junto a su nombre.</small>
      <button class="icon-btn accent" type="submit"><i class="ti ti-award"></i> Conceder</button></form>`, 'award');
    $('#df').addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target);
      run(async () => { await N.darDistincion(G.id, m.usuario, { titulo: f.get('titulo'), tipo: f.get('tipo'), fecha: f.get('fecha') }); close(); await load(); }, 'Distinción concedida'); });
  }
  function settingsModal() {
    const close = KT.modal('Ajustes de la comunidad', `<form class="acc-form" id="sf" style="padding:6px 4px">
      <label>Nombre<input name="n" maxlength="40" required value="${esc(G.nombre)}"></label>
      <label>Descripción <small class="acc-hint">Opcional, hasta 300 caracteres: dónde y cuándo jugáis, normas…</small><input name="d" maxlength="300" value="${esc(G.descripcion || '')}"></label>
      <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> Guardar</button>
      <div class="acc-danger"><div><b style="color:var(--text)">Código de invitación: ${esc(G.codigo)}</b><small>Si lo cambias, el anterior deja de servir. Los miembros actuales no se ven afectados.</small></div>
        <button class="icon-btn" type="button" data-sm="code"><i class="ti ti-refresh"></i> Código nuevo</button></div>
      ${isFounder() ? `<div class="acc-danger"><div><b>Borrar la comunidad</b><small>Se borran el tablón, la galería, los resultados y las distinciones.</small></div><button class="icon-btn acc-del" type="button" data-sm="del"><i class="ti ti-trash"></i> Borrar</button></div>` : ''}
    </form>`, 'settings');
    const f = $('#sf');
    f.addEventListener('submit', e => { e.preventDefault(); const d = new FormData(f);
      run(async () => { await N.editarGrupo(G.id, d.get('n'), d.get('d')); G = { ...G, nombre: String(d.get('n')).trim(), descripcion: String(d.get('d')).trim() || null }; close(); render(); }, 'Comunidad actualizada'); });
    f.addEventListener('click', e => {
      const b = e.target.closest('[data-sm]'); if (!b) return;
      if (b.dataset.sm === 'code') { if (confirm('¿Generar un código nuevo? El actual dejará de servir.')) run(async () => { const c = await N.nuevoCodigo(G.id); G = { ...G, codigo: c }; close(); render(); return c; }, c => `Código nuevo: ${esc(c)}`); }
      else { const t = prompt(`Se borrará «${G.nombre}» con todo su contenido. Escribe el nombre de la comunidad para confirmar:`); if (t == null) return;
        if (KT.norm(t.trim()) !== KT.norm(G.nombre)) { KT.toast('El nombre no coincide: no se ha borrado nada', { type: 'err' }); return; }
        run(async () => { await N.borrarGrupo(G.id); close(); exit(); }, 'Comunidad borrada'); }
    });
  }

  // ── Formularios ────────────────────────────────────────────
  function bindForms() {
    const f = $('#pf');
    if (f) {
      f.kind.addEventListener('change', () => { const k = f.kind.value; $('#pk-img').hidden = k !== 'imagen'; $('#pk-res').hidden = k !== 'resultado'; $('#pk-band').hidden = k !== 'banda'; $('#pk-cmd').hidden = k !== 'comando'; });
      f.addEventListener('submit', e => {
        e.preventDefault();
        const k = f.kind.value, texto = f.texto.value.trim(), pub = { tipo: k || 'mensaje', texto, fijada: !!f.fijada?.checked };
        if (texto.length > lim()) { KT.toast(`El mensaje no puede pasar de ${lim()} caracteres`, { type: 'err' }); return; }
        if (k === 'imagen') { pub.file = f.file.files[0]; if (!pub.file) { KT.toast('Elige una foto', { type: 'err' }); return; } }
        else if (k === 'resultado') { pub.datos = resData(f.res.value); if (!pub.datos) return; }
        else if (k === 'banda') { const r = (KT.store.get('rosters', []) || []).find(x => x.id === f.band.value); if (!r) return; pub.datos = { ...r }; delete pub.datos.owner; }
        else if (k === 'comando') { const c = KTC.list().find(x => x.f.id === f.cmd.value); if (!c) return; pub.datos = KTC.pack(c.f); }
        else if (!texto) { KT.toast('Escribe un mensaje o adjunta algo', { type: 'err' }); return; }
        run(async () => { await N.publicar(G.id, pub); await load(); }, pub.fijada ? 'Anuncio publicado' : 'Publicado');
      });
    }
    const rf = $('#rf');
    // los resultados publicados desde aquí llevan galeria:true para no llenar el tablón
    if (rf) rf.addEventListener('submit', e => { e.preventDefault(); const d = resData(rf.res.value); if (!d) return;
      if ((D.res || []).some(p => (p.datos?.id || '') === d.id)) { KT.toast('Esa partida ya está publicada en la comunidad', { type: 'err' }); return; }
      run(async () => { await N.publicar(G.id, { tipo: 'resultado', datos: d, galeria: true }); await load(); }, 'Resultado publicado'); });
    const gf = $('#gf');
    if (gf) gf.addEventListener('submit', e => { e.preventDefault(); const files = [...gf.files.files].slice(0, 6), texto = gf.texto.value.trim();
      if (!files.length) { KT.toast('Elige una o varias fotos', { type: 'err' }); return; }
      run(async () => { for (const file of files) await N.publicar(G.id, { tipo: 'imagen', file, texto, galeria: true }); await load(); }, files.length > 1 ? `${files.length} fotos subidas` : 'Foto subida'); });
    const r = app.querySelector('[data-rform] input'); if (r) r.focus();
  }
  const resData = id => { const r = (KT.store.get('historial', []) || []).find(x => x.id === id); return r ? { id: r.id, date: r.date, zone: r.zone, crit: r.crit, players: r.players.map(p => ({ name: p.name, faction: p.faction, total: p.total, vp: p.vp })) } : null; };

  // ── Datos ──────────────────────────────────────────────────
  async function load() {
    const [posts, gal, res, mem, dist, ev, live, camps] = await Promise.all([N.tablon(G.id), N.galeria(G.id), N.resultados(G.id), N.miembros(G.id), N.distinciones(G.id), N.eventos(G.id), N.directos(G.id), N.campanas(G.id)]);
    D = { posts, gal, res, mem, dist, ev, live, camps }; render();
  }
  function exit() { G = null; D = {}; replyTo = null; onHome?.(); }
  // la lista «En directo» se refresca sola mientras se mira la pestaña Partidas
  setInterval(async () => {
    if (!G || tab !== 'partidas' || document.hidden || busy || app.contains(document.activeElement) && /SELECT|INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    try { const g = G.id, live = await N.directos(g); if (!G || G.id !== g) return; const sig = l => JSON.stringify((l || []).filter(KT.directo.alive).map(x => [x.usuario, x.actualizado])); if (sig(live) !== sig(D.live)) { D.live = live; if (tab === 'partidas') render(); } } catch { /* sin conexión */ }
  }, 20000);

  // ── Eventos ────────────────────────────────────────────────
  app.addEventListener('input', e => {
    if (!G) return;
    const t = e.target; if (t.name !== 'texto') return;
    const c = t.closest('form')?.querySelector('[data-count]'); if (!c) return;
    c.textContent = `${t.value.length}/${lim()}`; c.classList.toggle('over', t.value.length > lim()); c.classList.toggle('near', t.value.length > lim() * .9);
  });
  app.addEventListener('submit', e => {
    if (!G) return;
    const f = e.target.closest('[data-rform]'); if (!f) return;
    e.preventDefault();
    const texto = f.texto.value.trim(), id = f.closest('[data-post]').dataset.post; if (!texto) return;
    run(async () => { await N.publicar(G.id, { tipo: 'mensaje', texto, respuesta_a: id }); replyTo = null; await load(); });
  });
  app.addEventListener('click', e => {
    if (!G) return;
    const t = e.target.closest('[data-g], [data-gtab], [data-pa], [data-ra], [data-ma], [data-ph], [data-ev], [data-live], [data-camp]'); if (!t) return;
    const d = t.dataset;
    if (d.gtab) { tab = d.gtab; replyTo = null; KT.eventos.reset(); render(); return; }
    if (d.ev) { KT.eventos.click(t, { G, D, canAdmin: canAdmin(), run, load, render }); return; }
    if (d.ph) { const p = D.gal.find(x => x.id === d.ph); if (p) photoModal(p); return; }
    if (d.live) { const x = (D.live || []).find(y => y.usuario === d.live); if (x) KT.directo.watch(G.id, x); return; }
    if (d.camp) { const c = (D.camps || []).find(y => y.usuario + '|' + y.id === d.camp); if (c) campModal(c); return; }
    if (d.g) {
      e.preventDefault();
      if (d.g === 'home') exit();
      else if (d.g === 'refresh') run(load, 'Actualizado');
      else if (d.g === 'settings') settingsModal();
      else if (d.g === 'leave') { if (confirm(`¿Salir de «${G.nombre}»?`)) run(async () => { await N.salirGrupo(G.id); exit(); }); }
      else if (d.g === 'invite') { const url = location.href.replace(/[#?].*$/, ''); KT.share.open({ title: G.nombre, text: `Únete a «${G.nombre}» en Kill Team Companion:\n${url}\nEntra en Comunidad → Unirme con código → ${G.codigo}` }); }
      return;
    }
    if (d.ra) {
      const p = D.res.find(x => x.id === t.closest('[data-res]').dataset.res); if (!p) return;
      if (d.ra === 'share') KT.share.result(p.datos, { comunidad: G.nombre });
      else if (confirm('¿Borrar este resultado de la comunidad?')) run(async () => { await N.borrarPublicacion(p); await load(); });
      return;
    }
    if (d.ma) {
      const m = D.mem.find(x => x.usuario === t.closest('[data-mem]').dataset.mem); if (!m) return;
      if (d.ma === 'dist') distModal(m);
      else if (d.ma === 'undist') { if (confirm('¿Quitar esta distinción?')) run(async () => { await N.quitarDistincion(d.id); await load(); }); }
      else if (d.ma === 'role') { const to = m.rol === 'admin' ? 'miembro' : 'admin';
        if (confirm(to === 'admin' ? `¿Nombrar administrador a ${m.nombre}? Podrá moderar, fijar anuncios, dar distinciones y expulsar miembros.` : `¿Quitar la administración a ${m.nombre}?`)) run(async () => { await N.cambiarRol(G.id, m.usuario, to); await load(); }, to === 'admin' ? `${esc(m.nombre)} ya es administrador` : 'Administración retirada'); }
      else if (d.ma === 'kick') { if (confirm(`¿Expulsar a ${m.nombre} de la comunidad? Podrá volver a entrar si tiene el código: cámbialo en Ajustes si no quieres que vuelva.`)) run(async () => { await N.expulsar(G.id, m.usuario); await load(); }, `${esc(m.nombre)} expulsado`); }
      return;
    }
    // acciones de una publicación del tablón
    const art = t.closest('[data-post]'), p = D.posts.find(x => x.id === art.dataset.post); if (!p) return;
    if (d.pa === 'reply') { replyTo = replyTo === p.id ? null : p.id; render(); }
    else if (d.pa === 'pin') run(async () => { await N.fijar(p.id, !p.fijada); await load(); }, p.fijada ? 'Anuncio soltado' : 'Fijado como anuncio');
    else if (d.pa === 'del') { if (confirm(`¿Borrar esta publicación${p.respuestas.length ? ' y sus respuestas' : ''}?`)) run(async () => { await N.borrarPublicacion(p); await load(); }); }
    else if (d.pa === 'rdel') { const r = p.respuestas.find(x => x.id === t.closest('[data-reply]').dataset.reply); if (r && confirm('¿Borrar esta respuesta?')) run(async () => { await N.borrarPublicacion(r); await load(); }); }
    else if (d.pa === 'zoom') photoModal({ ...p, galeria: false });
    else if (d.pa === 'share') {
      if (p.tipo === 'resultado' && p.datos?.players) KT.share.result(p.datos, { comunidad: G.nombre });
      else if (p.url) KT.share.photo(p.url, [p.texto, `📷 ${G.nombre} · Kill Team`].filter(Boolean).join('\n'));
      else KT.share.open({ title: G.nombre, text: `${p.texto || ''}\n— ${p.nombre}, ${G.nombre} · Kill Team` });
    }
    else if (d.pa === 'saveband') {
      const me = KT.user.current(), all = KT.store.get('rosters', []) || [];
      const safe = JSON.parse(JSON.stringify(p.datos).replace(/</g, '‹').replace(/>/g, '›'));      // datos de otro usuario: sin etiquetas
      const r = { ...safe, id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: (safe.name || 'Banda') + ' (de ' + p.nombre + ')', updated: new Date().toISOString(), created: new Date().toISOString() };
      if (me) r.owner = me.id; else delete r.owner;
      all.unshift(r); KT.store.set('rosters', all); KT.toast(`«${esc(r.name)}» guardada en tus bandas`, { type: 'ok' });
    }
    else if (d.pa === 'savecmd') {
      try { const { f, errors } = KTC.normalize(p.datos); if (!f || errors.length) throw new Error(errors[0] || 'El comando no es válido'); KTC.save(f); KT.toast(`«${esc(f.name)}» añadido a tus comandos`, { type: 'ok' }); }
      catch (err) { KT.toast(esc(err.message), { type: 'err' }); }
    }
  });

  KT.grupo = {
    get active() { return !!G; },
    open(g, home) { G = g; onHome = home; tab = 'tablon'; D = {}; replyTo = null; KT.eventos.reset(); render(); run(load); },
    close() { G = null; D = {}; },
    render,
  };
})();
