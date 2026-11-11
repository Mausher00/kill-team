// ============================================================
//  comunidad.js — Cuenta, grupos, jugadores e invitaciones
//  Usa KT.nube (Supabase). Sin servidor configurado enseña cómo activarlo.
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  let tab = 'grupos', group = null, busy = false, cache = { grupos: null, posts: null, miembros: null, inv: null, found: null, q: '' };
  const fecha = d => new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const run = async (fn, okMsg) => {
    if (busy) return; busy = true; document.body.style.cursor = 'progress';
    try { const r = await fn(); if (okMsg) KT.toast(typeof okMsg === 'function' ? okMsg(r) : okMsg, { type: 'ok' }); return r; }
    catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 5000 }); }
    finally { busy = false; document.body.style.cursor = ''; }
  };
  const head = (title, sub, extra = '') => `<header class="m-hd">
      ${group ? `<button class="back" data-a="home"><i class="ti ti-arrow-left"></i> Comunidad</button>` : `<a class="back" href="index.html"><i class="ti ti-arrow-left"></i> <img class="back-logo" src="imagenes/app/logo-kt-sm.webp" alt="Kill Team" width="440" height="139"></a>`}
      <h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}${extra}</header>`;

  // ── Sin servidor ───────────────────────────────────────────
  function renderOff() {
    app.innerHTML = head('Comunidad', 'Cuentas para tener tus bandas en todos tus dispositivos, buscar jugadores para invitarlos a una partida y grupos donde ver resultados y compartir bandas, comandos e imágenes.') + `
      <div class="m-sec"><i class="ti ti-plug-connected-x"></i> Falta conectar el servidor</div>
      <ol class="q-steps">
        <li>Crea un proyecto gratuito en <b>supabase.com</b> (región de Europa).</li>
        <li>En <b>SQL Editor</b>, pega y ejecuta <code>herramientas/supabase/esquema.sql</code> y después <code>almacenamiento.sql</code>.</li>
        <li>En <b>Project Settings → API</b>, copia la <b>Project URL</b> y la clave <b>anon public</b> en <code>js/config.js</code>.</li>
        <li>Sube los cambios a GitHub. Esta página pasará a mostrar el registro y los grupos.</li>
      </ol>
      <p style="font-size:13px;color:var(--text-3);margin-top:14px">La guía completa está en <code>herramientas/supabase/LEEME.md</code>. Mientras tanto, todo lo demás funciona sin servidor: usuarios locales, liga, campaña y partidas a dos dispositivos.</p>`;
  }

  // ── Registro / entrada ─────────────────────────────────────
  function renderAuth() {
    app.innerHTML = head('Comunidad', 'Entra con tu cuenta o créala para sincronizar tus bandas, buscar jugadores y participar en grupos.') + '<div class="acc-page" id="acc-box"></div>';
    const box = $('#acc-box');
    const redraw = () => {
      if (N.user && !N.recovery) { render(); run(loadHome); return; }
      if (box.isConnected) box.innerHTML = KT.cuenta.html();
    };
    KT.cuenta.bind(box, redraw); redraw(); KT.cuenta.load(redraw);
  }

  // ── Dentro ─────────────────────────────────────────────────
  function renderIn() {
    const p = N.perfil, last = KT.store.get('nube.sync');
    const pend = (cache.inv || []).filter(i => !i.mia && i.estado === 'pendiente').length;
    const tabs = [['grupos', 'Grupos'], ['jugadores', 'Jugadores'], ['inv', 'Invitaciones' + (pend ? ` (${pend})` : '')]];
    let body = '';
    if (tab === 'grupos') body = groupsBody();
    else if (tab === 'jugadores') body = playersBody();
    else body = invBody();
    app.innerHTML = head('Comunidad', `Sesión de <b style="color:#fff">${esc(p?.nombre || '')}</b>${last ? ' · sincronizado ' + fecha(last) : ''}`,
      `<div class="row"><button class="icon-btn accent" data-a="sync"><i class="ti ti-cloud-upload"></i> Sincronizar bandas e historial</button><button class="icon-btn" data-a="out"><i class="ti ti-logout"></i> Salir</button></div>`) +
      `<div class="m-tabs">${tabs.map(([k, v]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>${body}`;
  }
  function groupsBody() {
    const G = cache.grupos;
    return `${G == null ? '<div class="m-empty">Cargando…</div>' : G.length ? `<div class="m-grid">${G.map(g => `<button class="m-card" data-open="${g.id}"><small>Código ${esc(g.codigo)}</small><b>${esc(g.nombre)}</b><span>${g.creador === N.user.id ? 'Lo creaste tú' : 'Eres miembro'}</span></button>`).join('')}</div>`
      : '<div class="m-empty"><i class="ti ti-users-group" style="font-size:28px;display:block;margin-bottom:6px"></i>Aún no estás en ningún grupo. Crea uno o únete con un código.</div>'}
      <div class="m-sec"><i class="ti ti-plus"></i> Nuevo grupo o unirse</div>
      <div class="m-form"><div class="m-row"><input class="m-in" id="g-name" maxlength="40" placeholder="Nombre del grupo (p. ej. El Bulto)" style="flex:1 1 220px"><button class="icon-btn accent" data-a="gnew"><i class="ti ti-users-plus"></i> Crear grupo</button></div>
        <div class="m-row"><input class="m-in" id="g-code" maxlength="6" placeholder="Código de 6 caracteres" style="flex:1 1 220px;text-transform:uppercase;letter-spacing:.2em"><button class="icon-btn" data-a="gjoin"><i class="ti ti-login"></i> Unirme con código</button></div></div>`;
  }
  function playersBody() {
    const F = cache.found;
    return `<div class="m-form"><div class="m-row"><input class="m-in" id="p-q" maxlength="24" value="${esc(cache.q)}" placeholder="Nombre de jugador" style="flex:1 1 220px"><button class="icon-btn accent" data-a="search"><i class="ti ti-search"></i> Buscar</button></div></div>
      ${F == null ? '<p style="font-size:13px;color:var(--text-3);margin-top:10px">Busca por nombre de jugador (dos letras o más) e invítale a una partida: le llegará a su pestaña de invitaciones con la fecha y el enlace.</p>'
        : F.length ? `<div style="margin-top:10px">${F.map(u => `<div class="c-log"><div class="m-row">${N.avatar(u.nombre, u.avatar)}<b style="flex:1">${esc(u.nombre)}</b><button class="icon-btn accent" data-invite="${u.id}" data-n="${esc(u.nombre)}"><i class="ti ti-swords"></i> Invitar a jugar</button></div></div>`).join('')}</div>`
        : '<div class="m-empty" style="margin-top:10px">Nadie con ese nombre.</div>'}`;
  }
  function invBody() {
    const I = cache.inv;
    if (I == null) return '<div class="m-empty">Cargando…</div>';
    if (!I.length) return '<div class="m-empty"><i class="ti ti-mail" style="font-size:28px;display:block;margin-bottom:6px"></i>No tienes invitaciones. Busca un jugador en la pestaña «Jugadores» para retarle.</div>';
    const st = { pendiente: ['pend', 'pendiente'], aceptada: ['ok', 'aceptada'], rechazada: ['no', 'rechazada'] };
    return I.map(i => `<div class="c-log" data-inv="${i.id}"><div class="q-inv">
        <div>${N.avatar(i.mia ? i.paraNombre : i.deNombre, i.mia ? i.para : i.de)} <b>${i.mia ? 'Para ' + esc(i.paraNombre) : 'De ' + esc(i.deNombre)}</b> <span class="q-badge ${st[i.estado][0]}">${st[i.estado][1]}</span><br>
          <small>${fecha(i.creado)}${i.cuando ? ' · partida el ' + new Date(i.cuando).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}</small>
          ${i.mensaje ? `<div style="margin-top:3px;color:var(--text)">${esc(i.mensaje)}</div>` : ''}</div>
        <div class="m-row" style="justify-content:flex-end">
          ${!i.mia && i.estado === 'pendiente' ? `<button class="icon-btn accent" data-ia="aceptada"><i class="ti ti-check"></i> Aceptar</button><button class="icon-btn" data-ia="rechazada">Rechazar</button>` : ''}
          ${i.cuando && i.estado !== 'rechazada' ? `<button class="icon-btn" data-ia="cal" title="Añadir a mi calendario"><i class="ti ti-calendar-plus"></i></button>` : ''}
          ${i.enlace && /^https?:\/\//i.test(i.enlace) && i.estado !== 'rechazada' ? `<a class="icon-btn" href="${esc(i.enlace)}" title="Abrir la partida"><i class="ti ti-swords"></i> Partida</a>` : ''}
          <button class="icon-btn" data-ia="del" title="Borrar"><i class="ti ti-trash"></i></button></div></div></div>`).join('');
  }

  // ── Grupo ──────────────────────────────────────────────────
  function standings(posts) {
    const T = {};
    const row = n => T[KT.norm(n)] || (T[KT.norm(n)] = { n, pj: 0, g: 0, e: 0, d: 0, pf: 0, pc: 0 });
    const seen = new Set();
    posts.filter(p => p.tipo === 'resultado' && p.datos?.players?.length === 2).forEach(p => {
      const id = p.datos.id || p.id; if (seen.has(id)) return; seen.add(id);             // la misma partida publicada por los dos jugadores cuenta una vez
      const [a, b] = p.datos.players, A = row(a.name), B = row(b.name);
      A.pj++; B.pj++; A.pf += a.total; A.pc += b.total; B.pf += b.total; B.pc += a.total;
      if (a.total === b.total) { A.e++; B.e++; } else if (a.total > b.total) { A.g++; B.d++; } else { B.g++; A.d++; }
    });
    return Object.values(T).sort((x, y) => y.g - x.g || (y.pf - y.pc) - (x.pf - x.pc) || y.pf - x.pf);
  }
  function postHtml(p) {
    let inner = '';
    if (p.tipo === 'resultado' && p.datos?.players) {
      const [a, b] = p.datos.players, w = a.total === b.total ? -1 : a.total > b.total ? 0 : 1, fn = x => FACTIONS[x.faction]?.name || x.faction || '';
      inner = `<div class="q-res"><span class="${w === 0 ? 'w' : ''}">${esc(a.name)}<small>${esc(fn(a))}</small></span><b>${a.total} – ${b.total}</b><span class="${w === 1 ? 'w' : ''}">${esc(b.name)}<small>${esc(fn(b))}</small></span></div>`;
    } else if (p.tipo === 'banda' && p.datos) {
      const f = FACTIONS[p.datos.factionId], n = (p.datos.ops || []).reduce((s, o) => s + (o.qty || 0), 0);
      inner = `<div class="q-card">${f ? `<img src="${f.img}" alt="">` : ''}<div><b>${esc(p.datos.name || 'Banda')}</b><small>${esc(f?.name || p.datos.factionId)} · ${n} agentes${f ? '' : ' · no tienes este comando'}</small>
        <small style="display:block">${(p.datos.ops || []).map(o => (o.qty > 1 ? o.qty + '× ' : '') + esc(o.label)).join(' · ')}</small></div>
        <button class="icon-btn accent" data-pa="saveband" ${f ? '' : 'disabled'}><i class="ti ti-device-floppy"></i> Guardar en mis bandas</button></div>`;
    } else if (p.tipo === 'comando' && p.datos) {
      const c = p.datos.comando || p.datos;
      inner = `<div class="q-card"><div><b>${esc(c.name || 'Comando')}</b><small>${esc(c.subfaction || '')} · ${(c.ops || []).length} operativos</small></div>
        <button class="icon-btn accent" data-pa="savecmd"><i class="ti ti-package-import"></i> Añadir a mis comandos</button></div>`;
    }
    return `<article class="q-post" data-post="${p.id}"><header>${N.avatar(p.nombre, p.usuario)}<b>${esc(p.nombre)}</b><small>${fecha(p.creado)}</small>${p.mia || group.creador === N.user.id ? '<button data-pa="del" title="Borrar" aria-label="Borrar"><i class="ti ti-trash"></i></button>' : ''}</header>
      ${p.texto ? `<p>${esc(p.texto)}</p>` : ''}${inner}${p.url ? `<img class="ph" src="${esc(p.url)}" alt="Imagen compartida por ${esc(p.nombre)}" loading="lazy" data-pa="zoom">` : ''}</article>`;
  }
  function renderGroup() {
    const P = cache.posts, M = cache.miembros, me = KT.user.current();
    const st = P ? standings(P) : [];
    const rosters = me ? KT.user.mine(me.id) : [], cmds = window.KTC ? KTC.list() : [], H = (KT.store.get('historial', []) || []).slice(0, 12);
    const url = location.href.replace(/[#?].*$/, '');
    app.innerHTML = head(esc(group.nombre), `${M ? M.length + ' miembros: <span class="q-mems">' + M.map(m => `<span>${N.avatar(m.nombre, m.usuario)} ${esc(m.nombre)}</span>`).join('') + '</span>' : 'Cargando…'}`,
      `<div class="row"><span class="q-code" title="Código para unirse">${esc(group.codigo)}</span>
        <a class="icon-btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(`Únete a «${group.nombre}» en Kill Team Companion: entra en ${url} → Unirme con código → ${group.codigo}`)}"><i class="ti ti-brand-whatsapp"></i> Invitar al grupo</a>
        <button class="icon-btn" data-a="refresh"><i class="ti ti-refresh"></i> Actualizar</button>
        ${group.creador === N.user.id ? '<button class="icon-btn" data-a="gdel" style="color:#f07070"><i class="ti ti-trash"></i> Borrar grupo</button>' : '<button class="icon-btn" data-a="gleave"><i class="ti ti-logout"></i> Salir del grupo</button>'}</div>`) + `
      ${st.length ? `<div class="m-sec"><i class="ti ti-trophy"></i> Resultados del grupo</div><div class="m-scroll"><table class="m-tab"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>PV+</th><th>PV−</th><th>Dif</th></tr></thead><tbody>
        ${st.map((r, k) => `<tr class="${k === 0 ? 'lead' : ''}"><td>${k + 1}</td><td class="n">${esc(r.n)}</td><td>${r.pj}</td><td class="pts">${r.g}</td><td>${r.e}</td><td>${r.d}</td><td>${r.pf}</td><td>${r.pc}</td><td>${r.pf - r.pc > 0 ? '+' : ''}${r.pf - r.pc}</td></tr>`).join('')}</tbody></table></div>` : ''}
      <div class="m-sec"><i class="ti ti-send"></i> Compartir en el grupo</div>
      <form class="m-form" id="pf">
        <label>Mensaje<textarea name="texto" maxlength="600" placeholder="Escribe algo, o acompaña lo que compartes"></textarea></label>
        <div class="m-row">
          <label>Adjuntar<select name="kind"><option value="">Solo el mensaje</option><option value="imagen">Una imagen</option>
            ${H.length ? '<option value="resultado">Un resultado de mi historial</option>' : ''}${rosters.length ? '<option value="banda">Una de mis bandas</option>' : ''}${cmds.length ? '<option value="comando">Un comando añadido</option>' : ''}</select></label>
          <label id="pk-img" hidden>Imagen (JPG, PNG o WebP)<input name="file" type="file" accept="image/jpeg,image/png,image/webp" style="padding-top:7px"></label>
          <label id="pk-res" hidden>Partida<select name="res">${H.map(r => `<option value="${esc(r.id)}">${esc(r.players[0].name)} ${r.players[0].total}–${r.players[1].total} ${esc(r.players[1].name)} · ${new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</option>`).join('')}</select></label>
          <label id="pk-band" hidden>Banda<select name="band">${rosters.map(r => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select></label>
          <label id="pk-cmd" hidden>Comando<select name="cmd">${cmds.map(c => `<option value="${esc(c.f.id)}">${esc(c.f.name)}</option>`).join('')}</select></label>
        </div>
        <div class="m-row"><button class="icon-btn accent" type="submit"><i class="ti ti-send"></i> Publicar</button></div>
      </form>
      <div class="m-sec"><i class="ti ti-messages"></i> Actividad <span>${P ? P.length : ''}</span></div>
      ${P == null ? '<div class="m-empty">Cargando…</div>' : P.length ? P.map(postHtml).join('') : '<div class="m-empty">Todavía no hay nada. Comparte un resultado, una banda o una foto de tus miniaturas.</div>'}`;
    const f = $('#pf');
    f.kind.addEventListener('change', () => { const k = f.kind.value; $('#pk-img').hidden = k !== 'imagen'; $('#pk-res').hidden = k !== 'resultado'; $('#pk-band').hidden = k !== 'banda'; $('#pk-cmd').hidden = k !== 'comando'; });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const k = f.kind.value, texto = f.texto.value.trim(), pub = { tipo: k || 'mensaje', texto };
      if (k === 'imagen') { pub.file = f.file.files[0]; if (!pub.file) { KT.toast('Elige una imagen', { type: 'err' }); return; } }
      else if (k === 'resultado') { const r = (KT.store.get('historial', []) || []).find(x => x.id === f.res.value); if (!r) return; pub.datos = { id: r.id, date: r.date, zone: r.zone, crit: r.crit, players: r.players.map(p => ({ name: p.name, faction: p.faction, total: p.total, vp: p.vp })) }; }
      else if (k === 'banda') { const r = (KT.store.get('rosters', []) || []).find(x => x.id === f.band.value); if (!r) return; pub.datos = { ...r }; delete pub.datos.owner; }
      else if (k === 'comando') { const c = KTC.list().find(x => x.f.id === f.cmd.value); if (!c) return; pub.datos = KTC.pack(c.f); }
      else if (!texto) { KT.toast('Escribe un mensaje o adjunta algo', { type: 'err' }); return; }
      run(async () => { await N.publicar(group.id, pub); await loadGroup(); }, 'Publicado');
    });
  }

  // ── Carga de datos ─────────────────────────────────────────
  async function loadHome() {
    const [g, i] = await Promise.all([N.grupos(), N.invitaciones()]);
    cache.grupos = g; cache.inv = i; render();
  }
  async function loadGroup() {
    const [p, m] = await Promise.all([N.publicaciones(group.id), N.miembros(group.id)]);
    cache.posts = p; cache.miembros = m; render();
  }
  function render() {
    if (!N.on) return renderOff();
    if (!N.user || N.recovery) return renderAuth();
    if (group) return renderGroup();
    renderIn();
  }

  // ── Invitar a un jugador ───────────────────────────────────
  function inviteModal(id, nombre) {
    // si hay una sala de dos dispositivos abierta en este dispositivo, se propone su enlace
    const sala = KT.store.get('sala'), B = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081'];
    let link = '';
    if (sala && sala.seat === 0 && sala.room && sala.key) { const u = new URL('partida.html', location.href); u.searchParams.set('sala', sala.room); const bi = B.indexOf(sala.broker); if (bi >= 0) u.searchParams.set('b', bi); else if (sala.broker) u.searchParams.set('broker', sala.broker); link = u.href + '#k=' + sala.key; }
    const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    const pad = n => String(n).padStart(2, '0');
    const close = KT.modal('Invitar a ' + esc(nombre), `<form class="usr" id="if">
      <div class="usr-form"><label>Mensaje<input name="m" maxlength="300" value="¿Echamos una partida de Kill Team?"></label></div>
      <div class="usr-form"><label>Día <small>(opcional)</small><input type="date" name="d" value="${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}"></label><label>Hora<input type="time" name="t" value="17:00"></label></div>
      <div class="usr-form"><label>Enlace de la partida <small>(opcional)</small><input name="l" maxlength="500" value="${esc(link)}" placeholder="Pega aquí el enlace de «Dos dispositivos»"></label></div>
      <p class="usr-note">${link ? 'Se ha puesto el enlace de la sala que tienes abierta en este dispositivo.' : 'Para jugar cada uno con su móvil, crea antes la sala en Partida → Dos dispositivos y pega aquí su enlace. Si jugáis en la misma mesa no hace falta.'}</p>
      <div class="usr-row"><button class="icon-btn accent" type="submit"><i class="ti ti-send"></i> Enviar invitación</button></div></form>`, 'swords');
    document.querySelector('#if').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target), when = f.get('d') ? new Date(f.get('d') + 'T' + (f.get('t') || '17:00')) : null;
      run(async () => { await N.invitar(id, { mensaje: f.get('m'), cuando: when && !isNaN(when) ? when.toISOString() : null, enlace: f.get('l') }); close(); cache.inv = await N.invitaciones(); render(); }, `Invitación enviada a ${esc(nombre)}`);
    });
  }

  // ── Clics ──────────────────────────────────────────────────
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a], [data-tab], [data-open], [data-invite], [data-ia], [data-pa]'); if (!t) return;
    const d = t.dataset;
    if (d.tab) { tab = d.tab; render(); }
    else if (d.open) { group = cache.grupos.find(g => g.id === d.open); cache.posts = cache.miembros = null; render(); run(loadGroup); }
    else if (d.invite) inviteModal(d.invite, d.n);
    else if (d.ia) {
      const id = t.closest('[data-inv]').dataset.inv, i = cache.inv.find(x => x.id === id);
      if (d.ia === 'cal') KT.cal.download({ title: `Kill Team: ${i.deNombre} vs ${i.paraNombre}`, start: new Date(i.cuando), mins: 120, desc: i.mensaje || '', url: i.enlace || '' });
      else if (d.ia === 'del') run(async () => { await N.borrarInvitacion(id); cache.inv = await N.invitaciones(); render(); });
      else run(async () => { await N.responder(id, d.ia); cache.inv = await N.invitaciones(); render(); }, d.ia === 'aceptada' ? 'Invitación aceptada' : 'Invitación rechazada');
    }
    else if (d.pa) {
      const p = cache.posts.find(x => x.id === t.closest('[data-post]').dataset.post); if (!p) return;
      if (d.pa === 'del') { if (confirm('¿Borrar esta publicación?')) run(async () => { await N.borrarPublicacion(p); await loadGroup(); }); }
      else if (d.pa === 'zoom') window.open(p.url, '_blank', 'noopener');
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
    }
    else if (d.a === 'home') { group = null; render(); run(loadHome); }
    else if (d.a === 'refresh') run(loadGroup);
    else if (d.a === 'sync') run(() => N.sync(), r => `Sincronizado: ${r.subidas} bandas subidas, ${r.bajadas} bajadas${r.borradas ? ', ' + r.borradas + ' borradas' : ''}, ${r.partidas} partidas`).then(render);
    else if (d.a === 'out') run(async () => { await N.salir(); KT.user.logout(); cache = { grupos: null, posts: null, miembros: null, inv: null, found: null, q: '' }; group = null; render(); });
    else if (d.a === 'gnew') { const n = $('#g-name').value.trim(); if (n.length < 2) { KT.toast('Ponle un nombre al grupo', { type: 'err' }); return; } run(async () => { const g = await N.crearGrupo(n); await loadHome(); return g; }, g => `Grupo creado. Código para invitar: ${esc(g?.codigo || '')}`); }
    else if (d.a === 'gjoin') { const c = $('#g-code').value.trim(); if (c.length !== 6) { KT.toast('El código tiene 6 caracteres', { type: 'err' }); return; } run(async () => { await N.unirse(c); await loadHome(); }, 'Te has unido al grupo'); }
    else if (d.a === 'gleave') { if (confirm(`¿Salir de «${group.nombre}»?`)) run(async () => { await N.salirGrupo(group.id); group = null; await loadHome(); }); }
    else if (d.a === 'gdel') { if (confirm(`¿Borrar el grupo «${group.nombre}» con todas sus publicaciones?`)) run(async () => { await N.borrarGrupo(group.id); group = null; await loadHome(); }); }
    else if (d.a === 'search') { cache.q = $('#p-q').value; run(async () => { cache.found = await N.buscar(cache.q); render(); }); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'p-q') { e.preventDefault(); document.querySelector('[data-a="search"]').click(); } });
  document.addEventListener('kt:nube', () => { if (!N.user) { group = null; render(); } });

  KT.initFx && KT.initFx();
  render();
  if (N.on) N.ready().then(() => { render(); if (N.user) run(loadHome); }).catch(e => KT.toast(esc(e.message), { type: 'err' }));
})();
