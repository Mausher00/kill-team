// ============================================================
//  admin.js — Panel de administración (solo cuentas con rol «admin»)
//  Una sola página para ver y gestionar todo: cuentas, comunidades,
//  eventos y comandos compartidos, con un resumen y un buscador común.
//  Toda acción la vuelve a comprobar el servidor (funciones admin_* y permisos de esquema.sql).
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  let tab = ['cuentas', 'grupos', 'eventos', 'comandos'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'resumen', q = '', evf = 'prox', busy = false;   // admin.html#eventos abre esa pestaña
  let cuentas = null, grupos = null, eventos = [], comandos = [];
  const dia = d => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';
  const diaHora = d => new Date(d).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  const hace = d => { if (!d) return 'nunca'; const m = (Date.now() - Date.parse(d)) / 60000; return m < 60 ? 'hace ' + Math.max(1, Math.round(m)) + ' min' : m < 1440 ? 'hace ' + Math.round(m / 60) + ' h' : m < 43200 ? 'hace ' + Math.round(m / 1440) + ' días' : dia(d); };
  const pl = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const TIPO = { partida: 'Partida', quedada: 'Quedada', liga: 'Liga', torneo: 'Torneo', campana: 'Campaña' };
  const futuro = e => e.estado === 'abierto' && Date.parse(e.fin || e.inicio) > Date.now() - 12 * 3600e3;
  const gName = id => grupos?.find(g => g.id === id)?.nombre || '(comunidad borrada)';
  const hit = (...t) => { const k = KT.norm(q.trim()); return !k || KT.norm(t.filter(Boolean).join(' ')).includes(k); };
  const run = async (fn, ok) => {
    if (busy) return; busy = true; document.body.style.cursor = 'progress';
    try { const r = await fn(); if (ok) KT.toast(ok, { type: 'ok' }); return r; }
    catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 6000 }); }
    finally { busy = false; document.body.style.cursor = ''; }
  };
  const head = (sub, extra = '') => `<header class="m-hd">
    <a class="back" href="index.html" aria-label="Volver al inicio"><i class="ti ti-arrow-left" aria-hidden="true"></i> <img class="back-logo" src="imagenes/app/logo-kz-sm.webp" alt="Kill Zone" width="440" height="82"></a>
    <h1>Administración</h1>${sub ? `<p>${sub}</p>` : ''}${extra}</header>`;
  const gate = (icon, title, txt, btn = '') => { app.innerHTML = head('') + `<div class="g-empty"><span class="g-empty-ic" aria-hidden="true"><i class="ti ti-${icon}"></i></span><h3>${title}</h3><p>${txt}</p>${btn ? `<div class="g-empty-acts">${btn}</div>` : ''}</div>`; };
  const none = t => `<div class="m-empty">${t}</div>`;

  async function load() {
    const opt = p => p.catch(() => []);                     // servidores sin actualizar: la pestaña sale vacía en vez de romper el panel
    [cuentas, grupos, eventos, comandos] = await Promise.all([N.adminCuentas(), N.adminGrupos(), opt(N.adminEventos()), opt(N.comandosLista())]);
    await N.nombres(cuentas.map(c => c.id)).catch(() => {});
  }

  function render() {
    if (!N.on) return gate('plug-connected-x', 'Servidor sin configurar', 'Primero hay que activar Supabase (ver herramientas/supabase/LEEME.md).');
    if (!N.user) return gate('lock', 'Entra con una cuenta de administrador', 'Esta página solo la pueden usar los administradores.', '<button class="icon-btn accent" data-a="login"><i class="ti ti-login" aria-hidden="true"></i> Entrar</button>');
    if (!N.esAdmin) return gate('shield-lock', 'Sin permisos', `La cuenta <b>${esc(N.perfil?.nombre || '')}</b> no es administradora.`);
    if (!cuentas) { app.innerHTML = head('Cargando…') + '<div class="g-card sk" role="status" aria-label="Cargando"></div>'; return; }
    const C = cuentas, mes = Date.now() - 30 * 864e5, prox = eventos.filter(futuro);
    const tabs = [['resumen', 'Resumen', 'layout-dashboard', 0], ['cuentas', 'Cuentas', 'users', C.length], ['grupos', 'Comunidades', 'users-group', grupos.length], ['eventos', 'Eventos', 'calendar-event', eventos.length], ['comandos', 'Comandos', 'package', comandos.length]];
    const stat = (k, n, label, sub) => `<button class="ad-stat" data-tab="${k}"><b>${n}</b><small>${label}</small>${sub ? `<span>${sub}</span>` : ''}</button>`;
    app.innerHTML = head(`Sesión de <b style="color:#fff">${esc(N.perfil.nombre)}</b> · administrador`, `<div class="row"><button class="icon-btn" data-a="reload"><i class="ti ti-refresh" aria-hidden="true"></i> Actualizar</button></div>`) + `
      <div class="ad-stats">
        ${stat('cuentas', C.length, 'Cuentas', `${C.filter(c => c.ultimo_acceso && Date.parse(c.ultimo_acceso) > mes).length} activas en 30 días`)}
        ${stat('grupos', grupos.length, 'Comunidades', pl(grupos.reduce((a, g) => a + Number(g.miembros), 0), 'miembro', 'miembros') + ' en total')}
        ${stat('eventos', eventos.length, 'Eventos', pl(prox.length, 'próximo', 'próximos'))}
        ${stat('comandos', comandos.length, 'Comandos compartidos', comandos.length ? 'último ' + hace(comandos.map(c => c.actualizado).sort().pop()) : '')}
      </div>
      <div class="ad-bar">
        <div class="m-tabs" role="tablist" aria-label="Secciones">${tabs.map(([k, v, ic, n]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-tab="${k}"><i class="ti ti-${ic}" aria-hidden="true"></i> ${v}${n ? ` <span>${n}</span>` : ''}</button>`).join('')}</div>
        <label class="ad-q"><i class="ti ti-search" aria-hidden="true"></i><span class="sr">Buscar</span><input id="ad-q" class="m-in" placeholder="Buscar en cuentas, comunidades, eventos y comandos" autocomplete="off"></label>
      </div>
      <div role="tabpanel">${q.trim() && tab === 'resumen' ? searchHtml() : tab === 'resumen' ? resumenHtml() : tab === 'cuentas' ? cuentasHtml() : tab === 'grupos' ? gruposHtml() : tab === 'eventos' ? eventosHtml() : comandosHtml()}</div>`;
    const s = $('#ad-q'); s.value = q;
    s.addEventListener('input', () => { q = s.value; const pos = s.selectionStart; render(); const n = $('#ad-q'); n.focus(); n.setSelectionRange(pos, pos); });
  }

  // ── Filas ──────────────────────────────────────────────────
  function cuentaRow(c, full = true) {
    const me = c.id === N.user.id;
    return `<div class="ad-row" data-id="${c.id}">
      ${N.avatar(c.nombre || c.email, c.avatar, 'ad-av')}
      <div class="ad-who"><b>${esc(c.nombre || '(sin perfil)')}${c.rol === 'admin' ? ' <span class="acc-badge">Admin</span>' : ''}${me ? ' <span class="acc-badge">Tú</span>' : ''}${c.confirmado ? '' : ' <span class="ad-warn">Correo sin confirmar</span>'}</b>
        <small>${esc(c.email || '')}</small>
        <small>Alta ${dia(c.creado)} · último acceso ${hace(c.ultimo_acceso)}${full ? ` · ${pl(c.bandas, 'banda', 'bandas')} · ${pl(c.partidas, 'partida', 'partidas')} · ${pl(c.grupos, 'comunidad', 'comunidades')}` : ''}</small></div>
      ${full ? `<div class="ad-acts">
        <button class="icon-btn" data-a="edit" title="Editar nombre y rol"><i class="ti ti-edit" aria-hidden="true"></i><span>Editar</span></button>
        ${c.avatar ? '<button class="icon-btn" data-a="nofoto" title="Quitar la foto de perfil"><i class="ti ti-photo-off" aria-hidden="true"></i><span>Foto</span></button>' : ''}
        <button class="icon-btn" data-a="clave" title="Enviarle un correo para cambiar la contraseña"><i class="ti ti-key" aria-hidden="true"></i><span>Contraseña</span></button>
        ${me ? '' : '<button class="icon-btn acc-del" data-a="del" title="Borrar la cuenta y sus datos" aria-label="Borrar la cuenta"><i class="ti ti-trash" aria-hidden="true"></i></button>'}
      </div>` : ''}</div>`;
  }
  function grupoRow(g, full = true) {
    const ev = eventos.filter(e => e.grupo === g.id);
    return `<div class="ad-row" data-g="${g.id}">
      <span class="av ad-av" aria-hidden="true"><i class="ti ti-users-group"></i></span>
      <div class="ad-who"><b>${esc(g.nombre)}</b><small>Código ${esc(g.codigo)} · fundada por ${esc(g.creador || '¿?')} · ${dia(g.creado)}</small>
        <small>${pl(Number(g.miembros), 'miembro', 'miembros')} · ${pl(Number(g.publicaciones), 'publicación', 'publicaciones')} · ${pl(ev.length, 'evento', 'eventos')}${ev.some(futuro) ? ` (${ev.filter(futuro).length} por venir)` : ''}</small></div>
      <div class="ad-acts"><a class="icon-btn" href="comunidad.html?g=${g.id}"><i class="ti ti-external-link" aria-hidden="true"></i><span>Abrir</span></a>
        ${full ? '<button class="icon-btn acc-del" data-a="gdel" title="Borrar la comunidad"><i class="ti ti-trash" aria-hidden="true"></i><span>Borrar</span></button>' : ''}</div></div>`;
  }
  function eventoRow(e, full = true) {
    const d = new Date(e.inicio), comp = e.tipo === 'liga' || e.tipo === 'torneo' || e.tipo === 'campana';
    return `<div class="ad-row" data-e="${e.id}">
      <span class="ad-date" aria-hidden="true"><b>${d.getDate()}</b><small>${d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</small></span>
      <div class="ad-who"><b>${esc(e.titulo)} <span class="acc-badge">${TIPO[e.tipo] || e.tipo}</span>${e.estado === 'cerrado' ? ' <span class="ad-warn">Cerrado</span>' : futuro(e) ? '' : ' <span class="ad-warn">Pasado</span>'}</b>
        <small>${esc(gName(e.grupo))} · ${diaHora(e.inicio)}${e.lugar ? ' · ' + esc(e.lugar) : ''}</small>
        <small>${pl(e.van, 'apuntado', 'apuntados')}${comp ? ` · ${e.jugados} de ${pl(e.encuentros, 'enfrentamiento jugado', 'enfrentamientos jugados')}` : ''}</small></div>
      <div class="ad-acts"><a class="icon-btn" href="comunidad.html?g=${e.grupo}&e=${e.id}"><i class="ti ti-external-link" aria-hidden="true"></i><span>Abrir</span></a>
        ${full ? '<button class="icon-btn acc-del" data-a="edel" title="Borrar el evento" aria-label="Borrar el evento"><i class="ti ti-trash" aria-hidden="true"></i></button>' : ''}</div></div>`;
  }
  const comandoRow = c => `<div class="ad-row" data-c="${esc(c.id)}">
      <span class="av ad-av" aria-hidden="true"><i class="ti ti-package"></i></span>
      <div class="ad-who"><b>${esc(c.nombre)}</b><small>${esc(c.id)} · versión ${c.version}</small><small>Última versión de ${esc(c.autor_nombre || '¿?')} · ${hace(c.actualizado)}</small></div>
      <div class="ad-acts"><button class="icon-btn acc-del" data-a="cdel" title="Retirarlo de los comandos compartidos"><i class="ti ti-trash" aria-hidden="true"></i><span>Retirar</span></button></div></div>`;

  // ── Pestañas ───────────────────────────────────────────────
  const card = (ic, title, k, body) => `<section class="g-card"><h2><i class="ti ti-${ic}" aria-hidden="true"></i> ${title}</h2><div class="ad-list one">${body}</div><button class="icon-btn wide" data-tab="${k}">Ver todo</button></section>`;
  function resumenHtml() {
    const nuevas = [...cuentas].sort((a, b) => Date.parse(b.creado) - Date.parse(a.creado)).slice(0, 4);
    const prox = eventos.filter(futuro).sort((a, b) => Date.parse(a.inicio) - Date.parse(b.inicio)).slice(0, 4);
    const activas = [...grupos].sort((a, b) => Number(b.publicaciones) + Number(b.miembros) - Number(a.publicaciones) - Number(a.miembros)).slice(0, 4);
    const pend = cuentas.filter(c => !c.confirmado).length;
    return `${pend ? `<p class="ad-note"><i class="ti ti-alert-triangle" aria-hidden="true"></i> ${pl(pend, 'cuenta no ha confirmado', 'cuentas no han confirmado')} su correo. <button class="g-link" data-a="pend">Verlas</button></p>` : ''}
      <div class="ad-cols">
        ${card('users', 'Últimas cuentas', 'cuentas', nuevas.map(c => cuentaRow(c, false)).join('') || none('Sin cuentas.'))}
        ${card('calendar-event', 'Próximos eventos', 'eventos', prox.map(e => eventoRow(e, false)).join('') || none('No hay eventos por venir.'))}
        ${card('users-group', 'Comunidades más activas', 'grupos', activas.map(g => grupoRow(g, false)).join('') || none('Todavía no hay comunidades.'))}
      </div>`;
  }
  // Búsqueda desde el resumen: resultados de todo, agrupados
  function searchHtml() {
    const A = cuentas.filter(c => hit(c.nombre, c.email)), G = grupos.filter(g => hit(g.nombre, g.codigo, g.creador)), E = eventos.filter(e => hit(e.titulo, e.lugar, gName(e.grupo), TIPO[e.tipo])), K = comandos.filter(c => hit(c.nombre, c.id, c.autor_nombre));
    const sec = (ic, t, L, row) => L.length ? `<div class="m-sec"><i class="ti ti-${ic}" aria-hidden="true"></i> ${t} <span>${L.length}</span></div><div class="ad-list">${L.slice(0, 20).map(row).join('')}</div>` : '';
    return sec('users', 'Cuentas', A, c => cuentaRow(c)) + sec('users-group', 'Comunidades', G, g => grupoRow(g)) + sec('calendar-event', 'Eventos', E, e => eventoRow(e)) + sec('package', 'Comandos', K, comandoRow)
      || none(`Nada coincide con «${esc(q)}».`);
  }
  function cuentasHtml() {
    const L = cuentas.filter(c => hit(c.nombre, c.email));
    return `<div class="ad-list">${L.map(c => cuentaRow(c)).join('') || none('Ninguna cuenta coincide.')}</div>`;
  }
  function gruposHtml() {
    const L = grupos.filter(g => hit(g.nombre, g.codigo, g.creador));
    return grupos.length ? `<div class="ad-list">${L.map(g => grupoRow(g)).join('') || none('Ninguna comunidad coincide.')}</div>` : none('Todavía no hay comunidades.');
  }
  function eventosHtml() {
    const f = { prox: futuro, pas: e => !futuro(e), todos: () => true }[evf];
    const L = eventos.filter(e => f(e) && hit(e.titulo, e.lugar, gName(e.grupo), TIPO[e.tipo])).sort((a, b) => evf === 'prox' ? Date.parse(a.inicio) - Date.parse(b.inicio) : Date.parse(b.inicio) - Date.parse(a.inicio));
    const seg = (k, t, n) => `<button class="${evf === k ? 'on' : ''}" aria-pressed="${evf === k}" data-evf="${k}">${t} <span>${n}</span></button>`;
    return `<div class="m-tabs ad-seg" role="group" aria-label="Filtrar eventos">${seg('prox', 'Próximos', eventos.filter(futuro).length)}${seg('pas', 'Pasados y cerrados', eventos.filter(e => !futuro(e)).length)}${seg('todos', 'Todos', eventos.length)}</div>
      <div class="ad-list">${L.map(e => eventoRow(e)).join('') || none(eventos.length ? 'Ningún evento coincide.' : 'Todavía no se ha convocado ningún evento.')}</div>`;
  }
  function comandosHtml() {
    const L = comandos.filter(c => hit(c.nombre, c.id, c.autor_nombre));
    return `<p class="ad-note"><i class="ti ti-info-circle" aria-hidden="true"></i> Comandos que han añadido los jugadores y que la app reparte a todos. Si retiras uno, deja de descargarse; quien ya lo tenga lo conserva en su dispositivo.</p>
      <div class="ad-list">${L.map(comandoRow).join('') || none(comandos.length ? 'Ningún comando coincide.' : 'Nadie ha compartido comandos todavía.')}</div>`;
  }

  function editModal(c) {
    const close = KT.modal('Editar cuenta', `<form class="acc-form" id="ad-f" style="padding:6px 4px">
      <label>Nombre de usuario<input name="n" maxlength="24" required value="${esc(c.nombre || '')}"></label>
      <label>Rol<select name="r" class="m-in" style="height:42px"><option value="jugador"${c.rol !== 'admin' ? ' selected' : ''}>Jugador</option><option value="admin"${c.rol === 'admin' ? ' selected' : ''}>Administrador (ve y gestiona todas las cuentas)</option></select></label>
      <small class="acc-hint">${esc(c.email || '')}</small>
      <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> Guardar</button></form>`, 'edit');
    document.getElementById('ad-f').addEventListener('submit', e => {
      e.preventDefault(); const d = new FormData(e.target);
      run(async () => { await N.adminEditar(c.id, d.get('n'), d.get('r')); close(); await load(); render(); }, 'Cuenta actualizada');
    });
  }

  app.addEventListener('click', e => {
    const b = e.target.closest('[data-a], [data-tab], [data-evf]'); if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; render(); scrollTo({ top: 0 }); return; }
    if (b.dataset.evf) { evf = b.dataset.evf; render(); return; }
    const a = b.dataset.a, row = b.closest('.ad-row');
    const c = row && cuentas?.find(x => x.id === row.dataset.id), g = row && grupos?.find(x => x.id === row.dataset.g), ev = row && eventos.find(x => x.id === row.dataset.e), k = row && comandos.find(x => x.id === row.dataset.c);
    const again = async () => { await load(); render(); };
    if (a === 'login') KT.user.open();
    else if (a === 'reload') run(again, 'Actualizado');
    else if (a === 'pend') { tab = 'cuentas'; q = ''; cuentas.sort((x, y) => (x.confirmado ? 1 : 0) - (y.confirmado ? 1 : 0)); render(); }
    else if (a === 'edit' && c) editModal(c);
    else if (a === 'nofoto' && c) { if (confirm(`¿Quitar la foto de perfil de «${c.nombre}»?`)) run(async () => { await N.adminQuitarFoto(c); await again(); }, 'Foto quitada'); }
    else if (a === 'clave' && c) { if (confirm(`¿Enviar a ${c.email} un correo para que cambie su contraseña?`)) run(() => N.adminClave(c.email), 'Correo enviado'); }
    else if (a === 'del' && c) {
      const t = prompt(`Se borrará la cuenta «${c.nombre || c.email}» con sus bandas, partidas, comunidades creadas y publicaciones. No se puede deshacer.\nEscribe su nombre para confirmar:`);
      if (t == null) return;
      if (KT.norm(t.trim()) !== KT.norm(c.nombre || c.email || '')) { KT.toast('El nombre no coincide: no se ha borrado nada', { type: 'err' }); return; }
      run(async () => { await N.adminBorrar(c.id); await again(); }, 'Cuenta borrada');
    }
    else if (a === 'gdel' && g) { if (confirm(`¿Borrar la comunidad «${g.nombre}» con sus ${g.publicaciones} publicaciones y sus eventos?`)) run(async () => { await N.borrarGrupo(g.id); await again(); }, 'Comunidad borrada'); }
    else if (a === 'edel' && ev) { if (confirm(`¿Borrar el evento «${ev.titulo}» de ${gName(ev.grupo)}?`)) run(async () => { await N.borrarEvento(ev.id); await again(); }, 'Evento borrado'); }
    else if (a === 'cdel' && k) { if (confirm(`¿Retirar «${k.nombre}» de los comandos compartidos? Dejará de descargarse en los dispositivos que no lo tengan.`)) run(async () => { await N.comandoBorrar(k.id); await again(); }, 'Comando retirado'); }
  });

  document.addEventListener('kt:nube', () => { cuentas = null; render(); if (N.user && N.esAdmin) run(async () => { await load(); render(); }); });
  KT.initFx && KT.initFx();
  render();
  if (N.on) N.ready().then(async () => { render(); if (N.esAdmin) { await run(load); render(); } }).catch(e => KT.toast(esc(e.message), { type: 'err' }));
})();
