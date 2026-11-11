// ============================================================
//  cuenta.js — Cuenta online: registro con usuario, correo y contraseña,
//  entrada, recuperar contraseña y ajustes de la cuenta.
//  Se muestra dentro del panel «Entrar» (usuarios.js) y en Comunidad.
//  Necesita KT.nube con servidor configurado; si no, no hace nada.
//  También sincroniza solo al abrir la app si hay sesión.
// ============================================================
(function () {
  const N = KT.nube;
  if (!N || !N.on) return;
  const esc = KT.esc;
  const RE_NOMBRE = /^[\p{L}\p{N}][\p{L}\p{N} _.\-]{1,22}[\p{L}\p{N}]$/u;
  const fecha = d => new Date(d).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  let mode = 'in', sentTo = '', libre = null, busy = false, ready = false;

  const field = (label, input, hint = '') => `<label>${label}${input}${hint}</label>`;
  const pass = (name, ac, ph = '') => `<span class="acc-pw"><input name="${name}" type="password" required autocomplete="${ac}" placeholder="${ph}"><button type="button" class="acc-eye" data-c="eye" tabindex="-1" aria-label="Mostrar contraseña"><i class="ti ti-eye"></i></button></span>`;

  function authHtml() {
    if (!ready) return '<div class="acc acc-load"><i class="ti ti-loader-2"></i> Conectando…</div>';
    if (N.recovery) return `<div class="acc">
      <div class="acc-hd"><i class="ti ti-key"></i><div><b>Nueva contraseña</b><small>${esc(N.email)}</small></div></div>
      <form class="acc-form" data-cf="nueva">
        ${field('Nueva contraseña', pass('p1', 'new-password', 'Mínimo 8 caracteres'))}
        ${field('Repítela', pass('p2', 'new-password'))}
        <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> Guardar contraseña</button>
      </form></div>`;
    if (N.user) return meHtml();
    const tabs = `<div class="acc-tabs"><button class="${mode === 'in' ? 'on' : ''}" data-c="mode" data-m="in"><i class="ti ti-login"></i> Entrar</button><button class="${mode === 'up' ? 'on' : ''}" data-c="mode" data-m="up"><i class="ti ti-user-plus"></i> Crear cuenta</button></div>`;
    if (mode === 'sent') return `<div class="acc"><div class="acc-ok"><i class="ti ti-mail"></i><div><b>Revisa tu correo</b>
      <p>Hemos enviado un enlace a <b>${esc(sentTo)}</b>. Púlsalo para confirmar tu cuenta y vuelve aquí para entrar. Si no llega en unos minutos, mira en spam.</p></div></div>
      <button class="icon-btn" data-c="mode" data-m="in"><i class="ti ti-arrow-left"></i> Volver a entrar</button></div>`;
    if (mode === 'rec') return `<div class="acc">
      <div class="acc-hd"><i class="ti ti-key"></i><div><b>Recuperar contraseña</b><small>Te enviaremos un enlace para crear otra</small></div></div>
      <form class="acc-form" data-cf="rec">
        ${field('Correo', `<input name="email" type="email" required autocomplete="email" value="${esc(sentTo)}">`)}
        <div class="acc-row"><button class="icon-btn accent" type="submit"><i class="ti ti-send"></i> Enviar enlace</button><button class="icon-btn" type="button" data-c="mode" data-m="in">Cancelar</button></div>
      </form></div>`;
    if (mode === 'up') {
      const local = KT.user.current();
      return `<div class="acc">${tabs}
      <form class="acc-form" data-cf="up" novalidate>
        ${field('Nombre de usuario', `<input name="nombre" maxlength="24" required autocomplete="username" value="${esc(local && !local.nube ? local.name : '')}" placeholder="Así te verán los demás">`, `<small class="acc-hint" id="acc-libre">${libreHint()}</small>`)}
        ${field('Correo', '<input name="email" type="email" required autocomplete="email" placeholder="tu@correo.com">', '<small class="acc-hint">No se muestra a nadie. Sirve para entrar y recuperar la contraseña.</small>')}
        ${field('Contraseña', pass('p1', 'new-password', 'Mínimo 8 caracteres'))}
        ${field('Repite la contraseña', pass('p2', 'new-password'))}
        <button class="icon-btn accent acc-go" type="submit"><i class="ti ti-user-plus"></i> Crear cuenta</button>
      </form></div>`;
    }
    return `<div class="acc">${tabs}
      <form class="acc-form" data-cf="in">
        ${field('Correo', `<input name="email" type="email" required autocomplete="email" value="${esc(sentTo)}" placeholder="tu@correo.com">`)}
        ${field('Contraseña', pass('pass', 'current-password'))}
        <button class="icon-btn accent acc-go" type="submit"><i class="ti ti-login"></i> Entrar</button>
        <button class="acc-link" type="button" data-c="mode" data-m="rec">¿Has olvidado la contraseña?</button>
      </form></div>`;
  }
  const libreHint = () => libre == null ? '3–24 letras o números; puede llevar espacios, guiones o puntos.'
    : libre === 'mal' ? '<span class="bad"><i class="ti ti-x"></i> Usa de 3 a 24 letras o números (también espacios, - _ .)</span>'
    : libre ? '<span class="good"><i class="ti ti-check"></i> Disponible</span>' : '<span class="bad"><i class="ti ti-x"></i> Ese nombre ya está cogido</span>';

  function meHtml() {
    const p = N.perfil || {}, last = KT.store.get('nube.sync');
    return `<div class="acc">
      <div class="acc-me"><span class="acc-av">${esc((p.nombre || '?').slice(0, 1).toUpperCase())}</span>
        <div><b>${esc(p.nombre || '')}</b><small>${esc(N.email)}</small><small class="acc-sync"><i class="ti ti-cloud-check"></i> Cuenta online${last ? ' · sincronizado ' + fecha(last) : ''}</small></div></div>
      <div class="acc-row">
        <button class="icon-btn accent" data-c="sync"><i class="ti ti-refresh"></i> Sincronizar</button>
        <a class="icon-btn" href="${KT.cuenta.root}comunidad.html"><i class="ti ti-users-group"></i> Comunidad</a>
        <button class="icon-btn" data-c="out"><i class="ti ti-logout"></i> Salir</button>
      </div>
      <details class="acc-set"><summary><i class="ti ti-settings"></i> Ajustes de la cuenta</summary>
        <form class="acc-form" data-cf="nombre">${field('Nombre de usuario', `<span class="acc-inl"><input name="nombre" maxlength="24" required value="${esc(p.nombre || '')}"><button class="icon-btn" type="submit">Cambiar</button></span>`)}</form>
        <form class="acc-form" data-cf="email">${field('Correo', `<span class="acc-inl"><input name="email" type="email" required value="${esc(N.email)}"><button class="icon-btn" type="submit">Cambiar</button></span>`, '<small class="acc-hint">Te llegará un enlace de confirmación al correo nuevo.</small>')}</form>
        <form class="acc-form" data-cf="pass">
          ${field('Nueva contraseña', pass('p1', 'new-password', 'Mínimo 8 caracteres'))}
          ${field('Repítela', pass('p2', 'new-password'))}
          <button class="icon-btn" type="submit"><i class="ti ti-key"></i> Cambiar contraseña</button>
        </form>
        <div class="acc-danger"><div><b>Borrar la cuenta</b><small>Se borran del servidor tus bandas, partidas, grupos que creaste, publicaciones e imágenes. Lo guardado en este dispositivo se queda.</small></div>
          <button class="icon-btn acc-del" data-c="del"><i class="ti ti-trash"></i> Borrar cuenta</button></div>
      </details>
    </div>`;
  }

  // Validación y envío de formularios
  async function submit(form, redraw) {
    if (busy) return; busy = true;
    const d = new FormData(form), kind = form.dataset.cf, btn = form.querySelector('[type=submit]');
    btn?.classList.add('busy');
    const twice = () => { const a = String(d.get('p1') || ''), b = String(d.get('p2') || ''); if (a.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres'); if (a !== b) throw new Error('Las contraseñas no coinciden'); return a; };
    try {
      if (kind === 'in') {
        sentTo = String(d.get('email') || '').trim();
        await N.entrar(sentTo, String(d.get('pass') || ''));
        KT.toast(`Hola, ${esc(N.perfil?.nombre || '')}`, { type: 'ok' });
        N.sync().then(() => redraw()).catch(() => {});
      } else if (kind === 'up') {
        const nombre = String(d.get('nombre') || '').trim(), email = String(d.get('email') || '').trim();
        if (!RE_NOMBRE.test(nombre)) throw new Error('El nombre de usuario debe tener de 3 a 24 letras o números');
        if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Escribe un correo válido');
        const p = twice();
        const r = await N.registrar(email, p, nombre);
        sentTo = email;
        if (r.confirmar) mode = 'sent';
        else { KT.toast(`Cuenta creada. Bienvenido, ${esc(nombre)}`, { type: 'ok' }); N.sync().then(() => redraw()).catch(() => {}); }
      } else if (kind === 'rec') {
        sentTo = String(d.get('email') || '').trim();
        await N.recuperar(sentTo);
        KT.toast('Te hemos enviado un enlace para cambiar la contraseña', { type: 'ok', ms: 5000 }); mode = 'in';
      } else if (kind === 'nueva') { await N.nuevaClave(twice()); KT.toast('Contraseña cambiada', { type: 'ok' }); }
      else if (kind === 'nombre') { await N.cambiarNombre(d.get('nombre')); KT.toast('Nombre de usuario cambiado', { type: 'ok' }); }
      else if (kind === 'email') { await N.cambiarCorreo(d.get('email')); KT.toast('Revisa tu correo nuevo para confirmar el cambio', { type: 'ok', ms: 5000 }); }
      else if (kind === 'pass') { await N.nuevaClave(twice()); KT.toast('Contraseña cambiada', { type: 'ok' }); }
      redraw();
    } catch (e) { KT.toast(esc(e.message || String(e)), { type: 'err', ms: 5000 }); btn?.classList.remove('busy'); }
    finally { busy = false; }
  }

  let tCheck = null;
  const C = KT.cuenta = {
    root: (document.currentScript?.src || '').replace(/js\/cuenta\.js.*$/, ''),
    html: authHtml,
    get ready() { return ready; },
    set mode(m) { mode = m; },
    // Conecta con el servidor y vuelve a pintar cuando ya se sabe si hay sesión
    load(redraw) { if (ready) return Promise.resolve(); return N.ready().then(() => { ready = true; redraw?.(); }).catch(e => { ready = true; KT.toast(esc(e.message), { type: 'err' }); redraw?.(); }); },
    // Delegación de eventos para el contenedor donde se pinte
    bind(box, redraw) {
      box.addEventListener('submit', e => { const f = e.target.closest('[data-cf]'); if (!f) return; e.preventDefault(); e.stopImmediatePropagation(); submit(f, redraw); }, true);
      box.addEventListener('click', e => {
        const b = e.target.closest('[data-c]'); if (!b) return;
        const a = b.dataset.c;
        if (a === 'eye') { const i = b.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; b.firstElementChild.className = 'ti ti-' + (i.type === 'password' ? 'eye' : 'eye-off'); return; }
        e.stopImmediatePropagation();
        if (a === 'mode') { const em = box.querySelector('[name=email]')?.value; if (em) sentTo = em; mode = b.dataset.m; libre = null; redraw(); }
        else if (a === 'sync') { b.classList.add('busy'); N.sync().then(r => { KT.toast(`Sincronizado: ${r.subidas} bandas subidas, ${r.bajadas} bajadas, ${r.partidas} partidas`, { type: 'ok' }); redraw(); }).catch(err => { KT.toast(esc(err.message), { type: 'err' }); b.classList.remove('busy'); }); }
        else if (a === 'out') { N.salir().then(() => { KT.user.logout(); mode = 'in'; redraw(); KT.toast('Has salido de tu cuenta'); }); }
        else if (a === 'del') {
          const n = N.perfil?.nombre || '';
          const t = prompt(`Esto borra tu cuenta del servidor y no se puede deshacer.\nEscribe tu nombre de usuario («${n}») para confirmar:`);
          if (t == null) return;
          if (KT.norm(t.trim()) !== KT.norm(n)) { KT.toast('El nombre no coincide: no se ha borrado nada', { type: 'err' }); return; }
          N.borrarCuenta().then(() => { mode = 'in'; redraw(); KT.toast('Cuenta borrada'); }).catch(err => KT.toast(esc(err.message), { type: 'err', ms: 6000 }));
        }
      }, true);
      box.addEventListener('input', e => {
        if (e.target.name !== 'nombre' || !e.target.closest('[data-cf=up]')) return;
        clearTimeout(tCheck);
        const v = e.target.value.trim(), out = () => { const h = box.querySelector('#acc-libre'); if (h) h.innerHTML = libreHint(); };
        if (!v) { libre = null; out(); return; }
        if (!RE_NOMBRE.test(v)) { libre = 'mal'; out(); return; }
        tCheck = setTimeout(async () => { libre = await N.nombreLibre(v).catch(() => null); if (e.target.value.trim() === v) out(); }, 350);
      });
    },
  };

  // Al abrir la app: si se viene de un enlace del correo o hay sesión, conectar y sincronizar
  window.addEventListener('load', () => {
    const fromMail = /access_token=|type=(signup|recovery|email_change)/.test(location.hash) || sessionStorage.getItem('kt.recuperar') === '1';
    const linked = KT.user?.current()?.nube;
    if (!fromMail && !linked) return;
    setTimeout(() => C.load().then(() => {
      if (N.recovery) { KT.user.open(); return; }
      if (fromMail && N.user) { KT.toast(`Correo confirmado. Hola, ${esc(N.perfil?.nombre || '')}`, { type: 'ok', ms: 4500 }); }
      if (!N.user || document.body.classList.contains('game')) return;
      const last = Date.parse(KT.store.get('nube.sync') || 0) || 0;
      if (Date.now() - last > 10 * 60 * 1000) N.sync().catch(() => {});
    }), fromMail ? 0 : 1500);
  });
})();
