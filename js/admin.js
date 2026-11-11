// ============================================================
//  admin.js — Panel de administración (solo cuentas con rol «admin»)
//  Ver, buscar y editar cuentas (nombre, rol, foto), enviar correo para
//  cambiar la contraseña, borrar cuentas y grupos.
//  Toda acción la vuelve a comprobar el servidor (funciones admin_* de esquema.sql).
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  let tab = 'cuentas', q = '', cuentas = null, grupos = null, busy = false;
  const dia = d => d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';
  const hace = d => { if (!d) return 'nunca'; const m = (Date.now() - Date.parse(d)) / 60000; return m < 60 ? 'hace ' + Math.max(1, Math.round(m)) + ' min' : m < 1440 ? 'hace ' + Math.round(m / 60) + ' h' : m < 43200 ? 'hace ' + Math.round(m / 1440) + ' días' : dia(d); };
  const run = async (fn, ok) => {
    if (busy) return; busy = true; document.body.style.cursor = 'progress';
    try { const r = await fn(); if (ok) KT.toast(ok, { type: 'ok' }); return r; }
    catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 6000 }); }
    finally { busy = false; document.body.style.cursor = ''; }
  };
  const head = (sub, extra = '') => `<header class="m-hd">
    <a class="back" href="index.html"><i class="ti ti-arrow-left"></i> <img class="back-logo" src="imagenes/app/logo-kt-sm.webp" alt="Kill Team" width="440" height="139"></a>
    <h1>Administración</h1>${sub ? `<p>${sub}</p>` : ''}${extra}</header>`;
  const gate = (icon, title, txt, btn = '') => { app.innerHTML = head('') + `<div class="m-empty"><i class="ti ti-${icon}" style="font-size:30px;display:block;margin-bottom:8px"></i><b style="color:#fff">${title}</b><br>${txt}${btn ? `<div style="margin-top:12px">${btn}</div>` : ''}</div>`; };

  async function load() {
    [cuentas, grupos] = await Promise.all([N.adminCuentas(), N.adminGrupos()]);
    await N.nombres(cuentas.map(c => c.id)).catch(() => {});
  }

  function render() {
    if (!N.on) return gate('plug-connected-x', 'Servidor sin configurar', 'Primero hay que activar Supabase (ver herramientas/supabase/LEEME.md).');
    if (!N.user) return gate('lock', 'Entra con una cuenta de administrador', 'Esta página solo la pueden usar los administradores.', '<button class="icon-btn accent" data-a="login"><i class="ti ti-login"></i> Entrar</button>');
    if (!N.esAdmin) return gate('shield-lock', 'Sin permisos', `La cuenta <b>${esc(N.perfil?.nombre || '')}</b> no es administradora.`);
    if (!cuentas) { app.innerHTML = head('Cargando…'); return; }
    const C = cuentas, mes = Date.now() - 30 * 864e5;
    const stats = [['Cuentas', C.length], ['Administradores', C.filter(c => c.rol === 'admin').length], ['Activas 30 días', C.filter(c => c.ultimo_acceso && Date.parse(c.ultimo_acceso) > mes).length], ['Sin confirmar', C.filter(c => !c.confirmado).length], ['Grupos', grupos.length]];
    app.innerHTML = head(`Sesión de <b style="color:#fff">${esc(N.perfil.nombre)}</b> · administrador`, `<div class="row"><button class="icon-btn" data-a="reload"><i class="ti ti-refresh"></i> Actualizar</button></div>`) + `
      <div class="ad-stats">${stats.map(([k, v]) => `<div><b>${v}</b><small>${k}</small></div>`).join('')}</div>
      <div class="m-tabs"><button class="${tab === 'cuentas' ? 'on' : ''}" data-tab="cuentas"><i class="ti ti-users"></i> Cuentas</button><button class="${tab === 'grupos' ? 'on' : ''}" data-tab="grupos"><i class="ti ti-users-group"></i> Grupos</button></div>
      ${tab === 'cuentas' ? cuentasHtml() : gruposHtml()}`;
    const s = $('#ad-q'); if (s) { s.value = q; s.addEventListener('input', () => { q = s.value; const pos = s.selectionStart; render(); const n = $('#ad-q'); n.focus(); n.setSelectionRange(pos, pos); }); }
  }

  function cuentasHtml() {
    const k = KT.norm(q.trim());
    const L = cuentas.filter(c => !k || KT.norm((c.nombre || '') + ' ' + (c.email || '')).includes(k));
    return `<input id="ad-q" class="m-in" style="width:100%;margin-bottom:10px" placeholder="Buscar por nombre o correo…" autocomplete="off">
      <div class="ad-list">${L.map(c => {
        const me = c.id === N.user.id;
        return `<div class="ad-row" data-id="${c.id}">
          ${N.avatar(c.nombre || c.email, c.avatar, 'ad-av')}
          <div class="ad-who"><b>${esc(c.nombre || '(sin perfil)')}${c.rol === 'admin' ? ' <span class="acc-badge">Admin</span>' : ''}${me ? ' <span class="acc-badge">Tú</span>' : ''}${c.confirmado ? '' : ' <span class="ad-warn">Correo sin confirmar</span>'}</b>
            <small>${esc(c.email || '')}</small>
            <small>Alta ${dia(c.creado)} · último acceso ${hace(c.ultimo_acceso)} · ${c.bandas} bandas · ${c.partidas} partidas · ${c.grupos} grupos</small></div>
          <div class="ad-acts">
            <button class="icon-btn" data-a="edit" title="Editar nombre y rol"><i class="ti ti-edit"></i><span>Editar</span></button>
            ${c.avatar ? '<button class="icon-btn" data-a="nofoto" title="Quitar la foto de perfil"><i class="ti ti-photo-off"></i><span>Foto</span></button>' : ''}
            <button class="icon-btn" data-a="clave" title="Enviarle un correo para cambiar la contraseña"><i class="ti ti-key"></i><span>Contraseña</span></button>
            ${me ? '' : '<button class="icon-btn acc-del" data-a="del" title="Borrar la cuenta y sus datos"><i class="ti ti-trash"></i></button>'}
          </div></div>`;
      }).join('') || '<div class="m-empty">Ninguna cuenta coincide.</div>'}</div>`;
  }

  function gruposHtml() {
    return grupos.length ? `<div class="ad-list">${grupos.map(g => `<div class="ad-row" data-g="${g.id}">
        <span class="av ad-av"><i class="ti ti-users-group"></i></span>
        <div class="ad-who"><b>${esc(g.nombre)}</b><small>Código ${esc(g.codigo)} · creado por ${esc(g.creador || '¿?')} · ${dia(g.creado)}</small><small>${g.miembros} miembros · ${g.publicaciones} publicaciones</small></div>
        <div class="ad-acts"><button class="icon-btn acc-del" data-a="gdel" title="Borrar el grupo"><i class="ti ti-trash"></i><span>Borrar</span></button></div></div>`).join('')}</div>`
      : '<div class="m-empty">Todavía no hay grupos.</div>';
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
    const b = e.target.closest('[data-a], [data-tab]'); if (!b) return;
    if (b.dataset.tab) { tab = b.dataset.tab; render(); return; }
    const a = b.dataset.a, row = b.closest('.ad-row'), c = row && cuentas?.find(x => x.id === row.dataset.id), g = row && grupos?.find(x => x.id === row.dataset.g);
    if (a === 'login') KT.user.open();
    else if (a === 'reload') run(async () => { await load(); render(); }, 'Actualizado');
    else if (a === 'edit' && c) editModal(c);
    else if (a === 'nofoto' && c) { if (confirm(`¿Quitar la foto de perfil de «${c.nombre}»?`)) run(async () => { await N.adminQuitarFoto(c); await load(); render(); }, 'Foto quitada'); }
    else if (a === 'clave' && c) { if (confirm(`¿Enviar a ${c.email} un correo para que cambie su contraseña?`)) run(() => N.adminClave(c.email), 'Correo enviado'); }
    else if (a === 'del' && c) {
      const t = prompt(`Se borrará la cuenta «${c.nombre || c.email}» con sus bandas, partidas, grupos creados y publicaciones. No se puede deshacer.\nEscribe su nombre para confirmar:`);
      if (t == null) return;
      if (KT.norm(t.trim()) !== KT.norm(c.nombre || c.email || '')) { KT.toast('El nombre no coincide: no se ha borrado nada', { type: 'err' }); return; }
      run(async () => { await N.adminBorrar(c.id); await load(); render(); }, 'Cuenta borrada');
    }
    else if (a === 'gdel' && g) { if (confirm(`¿Borrar el grupo «${g.nombre}» con sus ${g.publicaciones} publicaciones?`)) run(async () => { await N.borrarGrupo(g.id); await load(); render(); }, 'Grupo borrado'); }
  });

  document.addEventListener('kt:nube', () => { cuentas = null; render(); if (N.user && N.esAdmin) run(async () => { await load(); render(); }); });
  KT.initFx && KT.initFx();
  render();
  if (N.on) N.ready().then(async () => { render(); if (N.esAdmin) { await run(load); render(); } }).catch(e => KT.toast(esc(e.message), { type: 'err' }));
})();
