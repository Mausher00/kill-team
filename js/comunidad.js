// ============================================================
//  comunidad.js — Cuenta, lista de comunidades, jugadores e invitaciones (la página de cada comunidad está en grupo.js)
//  Usa KT.nube (Supabase). Sin servidor configurado enseña cómo activarlo.
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  let tab = 'grupos', busy = false, cache = { grupos: null, inv: null, found: null, q: '' };
  const fecha = d => new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const run = async (fn, okMsg) => {
    if (busy) return; busy = true; document.body.style.cursor = 'progress';
    try { const r = await fn(); if (okMsg) KT.toast(typeof okMsg === 'function' ? okMsg(r) : okMsg, { type: 'ok' }); return r; }
    catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 5000 }); }
    finally { busy = false; document.body.style.cursor = ''; }
  };
  const head = (title, sub, extra = '') => `<header class="m-hd">
      <a class="back" href="index.html"><i class="ti ti-arrow-left"></i> <img class="back-logo" src="imagenes/app/logo-kt-sm.webp" alt="Kill Team" width="440" height="139"></a>
      <h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}${extra}</header>`;

  // ── Sin servidor ───────────────────────────────────────────
  function renderOff() {
    app.innerHTML = head('Comunidad', 'Cuentas para tener tus bandas en todos tus dispositivos, buscar jugadores para invitarlos a una partida y comunidades con tablón, resultados, galería de fotos y rangos.') + `
      <div class="m-sec"><i class="ti ti-plug-connected-x"></i> Falta conectar el servidor</div>
      <ol class="q-steps">
        <li>Crea un proyecto gratuito en <b>supabase.com</b> (región de Europa).</li>
        <li>En <b>SQL Editor</b>, pega y ejecuta <code>herramientas/supabase/esquema.sql</code> y después <code>almacenamiento.sql</code>.</li>
        <li>En <b>Project Settings → API</b>, copia la <b>Project URL</b> y la clave <b>anon public</b> en <code>js/config.js</code>.</li>
        <li>Sube los cambios a GitHub. Esta página pasará a mostrar el registro y las comunidades.</li>
      </ol>
      <p style="font-size:13px;color:var(--text-3);margin-top:14px">La guía completa está en <code>herramientas/supabase/LEEME.md</code>. Mientras tanto, todo lo demás funciona sin servidor: usuarios locales, liga, campaña y partidas a dos dispositivos.</p>`;
  }

  // ── Registro / entrada ─────────────────────────────────────
  function renderAuth() {
    app.innerHTML = head('Comunidad', 'Entra con tu cuenta o créala para sincronizar tus bandas, buscar jugadores y participar en comunidades.') + '<div class="acc-page" id="acc-box"></div>';
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
    const tabs = [['grupos', 'Comunidades'], ['jugadores', 'Jugadores'], ['inv', 'Invitaciones' + (pend ? ` (${pend})` : '')]];
    let body = '';
    if (tab === 'grupos') body = groupsBody();
    else if (tab === 'jugadores') body = playersBody();
    else body = invBody();
    app.innerHTML = head('Comunidad', `Sesión de <b style="color:#fff">${esc(p?.nombre || '')}</b>${last ? ' · sincronizado ' + fecha(last) : ''}`,
      `<div class="row"><button class="icon-btn accent" data-a="sync"><i class="ti ti-cloud-upload"></i> Sincronizar bandas e historial</button><button class="icon-btn" data-a="out"><i class="ti ti-logout"></i> Salir</button></div>`) +
      `<div class="m-tabs">${tabs.map(([k, v]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>${body}`;
  }
  function groupsBody() {
    const G = cache.grupos, ROL = { fundador: 'Fundador', admin: 'Administrador', miembro: 'Miembro', externo: 'No eres miembro' };
    const card = g => `<button class="m-card" data-open="${g.id}"><small>${ROL[g.rol]} · código ${esc(g.codigo)}</small><b>${esc(g.nombre)}</b><span>${esc(g.descripcion || 'Tablón, partidas, galería y miembros')}</span></button>`;
    const mine = (G || []).filter(g => g.rol !== 'externo'), other = (G || []).filter(g => g.rol === 'externo');
    return `${G == null ? '<div class="m-empty">Cargando…</div>' : mine.length ? `<div class="m-grid">${mine.map(card).join('')}</div>`
      : '<div class="m-empty"><i class="ti ti-users-group" style="font-size:28px;display:block;margin-bottom:6px"></i>Aún no estás en ninguna comunidad. Crea una o únete con un código.</div>'}
      ${other.length ? `<div class="m-sec"><i class="ti ti-shield-lock"></i> Otras comunidades <span>solo las ves por ser administrador de la app</span></div><div class="m-grid">${other.map(card).join('')}</div>` : ''}
      <div class="m-sec"><i class="ti ti-plus"></i> Nueva comunidad o unirse</div>
      <div class="m-form"><div class="m-row"><input class="m-in" id="g-name" maxlength="40" placeholder="Nombre de la comunidad (p. ej. El Bulto)" style="flex:1 1 220px"><button class="icon-btn accent" data-a="gnew"><i class="ti ti-users-plus"></i> Crear comunidad</button></div>
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

  // ── Carga de datos ─────────────────────────────────────────
  async function loadHome() {
    const [g, i] = await Promise.all([N.grupos(), N.invitaciones()]);
    cache.grupos = g; cache.inv = i; render();
  }
  function render() {
    if (!N.on) return renderOff();
    if (!N.user || N.recovery) return renderAuth();
    if (KT.grupo.active) return KT.grupo.render();
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
    if (KT.grupo.active) return;                         // dentro de una comunidad manda grupo.js
    const t = e.target.closest('[data-a], [data-tab], [data-open], [data-invite], [data-ia]'); if (!t) return;
    const d = t.dataset;
    if (d.tab) { tab = d.tab; render(); }
    else if (d.open) { const g = cache.grupos.find(x => x.id === d.open); if (g) KT.grupo.open(g, () => { render(); run(loadHome); }); }
    else if (d.invite) inviteModal(d.invite, d.n);
    else if (d.ia) {
      const id = t.closest('[data-inv]').dataset.inv, i = cache.inv.find(x => x.id === id);
      if (d.ia === 'cal') KT.cal.download({ title: `Kill Team: ${i.deNombre} vs ${i.paraNombre}`, start: new Date(i.cuando), mins: 120, desc: i.mensaje || '', url: i.enlace || '' });
      else if (d.ia === 'del') run(async () => { await N.borrarInvitacion(id); cache.inv = await N.invitaciones(); render(); });
      else run(async () => { await N.responder(id, d.ia); cache.inv = await N.invitaciones(); render(); }, d.ia === 'aceptada' ? 'Invitación aceptada' : 'Invitación rechazada');
    }
    else if (d.a === 'sync') run(() => N.sync(), r => `Sincronizado: ${r.subidas} bandas subidas, ${r.bajadas} bajadas${r.borradas ? ', ' + r.borradas + ' borradas' : ''}, ${r.partidas} partidas`).then(render);
    else if (d.a === 'out') run(async () => { await N.salir(); KT.user.logout(); cache = { grupos: null, inv: null, found: null, q: '' }; KT.grupo.close(); render(); });
    else if (d.a === 'gnew') { const n = $('#g-name').value.trim(); if (n.length < 2) { KT.toast('Ponle un nombre a la comunidad', { type: 'err' }); return; } run(async () => { const g = await N.crearGrupo(n); await loadHome(); return g; }, g => `Comunidad creada. Código para invitar: ${esc(g?.codigo || '')}`); }
    else if (d.a === 'gjoin') { const c = $('#g-code').value.trim(); if (c.length !== 6) { KT.toast('El código tiene 6 caracteres', { type: 'err' }); return; } run(async () => { await N.unirse(c); await loadHome(); }, 'Te has unido a la comunidad'); }
    else if (d.a === 'search') { cache.q = $('#p-q').value; run(async () => { cache.found = await N.buscar(cache.q); render(); }); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'p-q') { e.preventDefault(); document.querySelector('[data-a="search"]').click(); } });
  document.addEventListener('kt:nube', () => { if (!N.user) { KT.grupo.close(); render(); } });

  KT.initFx && KT.initFx();
  render();
  if (N.on) N.ready().then(() => { render(); if (N.user) run(loadHome); }).catch(e => KT.toast(esc(e.message), { type: 'err' }));
})();
