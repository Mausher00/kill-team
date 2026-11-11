// ============================================================
//  usuarios.js — Perfiles de usuario y acceso rápido a sus bandas
//  · Los perfiles viven en este dispositivo (localStorage): no hay
//    servidor ni contraseña real. El PIN opcional solo evita que
//    otro jugador entre en tu perfil por descuido.
//  · Cada banda guardada (kt.rosters) lleva `owner` = id del perfil.
//    Las que no tienen dueño las ve todo el mundo.
//  · Botón flotante «Volver a la partida» en el resto de páginas
//    cuando hay una partida en curso.
//  Expone KT.user. Emite el evento `kt:user` al cambiar de sesión.
// ============================================================
(function () {
  const esc = KT.esc;
  const hash = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  const rosters = () => KT.store.get('rosters', []) || [];
  const count = r => (r.ops || []).reduce((a, o) => a + (o.qty || 0), 0);
  const fire = () => document.dispatchEvent(new CustomEvent('kt:user'));
  const chipIcon = u => u?.nube ? 'cloud-check' : 'user-circle';
  const chipFoto = u => { const f = u?.nube && KT.store.get('nube.foto'); return f ? `<img class="av chip-av" src="${esc(f)}" alt="">` : ''; };

  const U = KT.user = {
    list: () => KT.store.get('usuarios', []) || [],
    current() { const id = KT.store.get('usuario'); return id ? U.list().find(u => u.id === id) || null : null; },
    byId: id => U.list().find(u => u.id === id) || null,
    login(id) { KT.store.set('usuario', id); fire(); },
    logout() { KT.store.del('usuario'); fire(); },
    add(name, pin) {
      name = String(name || '').trim().slice(0, 24);
      if (!name) throw new Error('Escribe un nombre');
      const list = U.list();
      if (list.some(u => KT.norm(u.name) === KT.norm(name))) throw new Error('Ya existe un usuario con ese nombre');
      const u = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name, created: new Date().toISOString() };
      if (pin) u.pin = hash(u.id + ':' + pin);
      list.push(u); KT.store.set('usuarios', list);
      return u;
    },
    checkPin: (u, pin) => !u.pin || u.pin === hash(u.id + ':' + pin),
    remove(id) {
      KT.store.set('usuarios', U.list().filter(u => u.id !== id));
      KT.store.set('rosters', rosters().map(r => { if (r.owner === id) { const c = { ...r }; delete c.owner; return c; } return r; }));
      if (KT.store.get('usuario') === id) KT.store.del('usuario');
      fire();
    },
    // Bandas visibles para un perfil: las suyas y, opcionalmente, las que no tienen dueño
    rosters(id, withFree = true) { return rosters().filter(r => FACTIONS[r.factionId] && (r.owner === id || (withFree && !r.owner))); },
    mine(id) { return rosters().filter(r => r.owner === id && FACTIONS[r.factionId]); },
    free: () => rosters().filter(r => !r.owner && FACTIONS[r.factionId]),
    claim(id) { KT.store.set('rosters', rosters().map(r => r.owner ? r : { ...r, owner: id })); fire(); },
    // Botón de sesión para las cabeceras
    chip(cls = 'nav-link') {
      const u = U.current();
      return `<button class="${cls} user-chip ${u ? 'on' : ''}" data-user-chip title="${u ? 'Tu cuenta y tus bandas' : 'Entrar o crear tu cuenta'}">${chipFoto(u) || `<i class="ti ti-${chipIcon(u)}"></i>`} <span>${u ? esc(u.name) : 'Entrar'}</span></button>`;
    },
    // Tarjetas de bandas (inicio y panel de sesión)
    cards(list, opt = {}) {
      return list.map(r => {
        const f = FACTIONS[r.factionId], o = !opt.hideOwner && r.owner ? U.byId(r.owner) : null;
        return `<div class="band">
          <img src="${f.img}" alt="" onerror="this.style.visibility='hidden'">
          <div class="band-t"><b>${esc(r.name)}</b><small>${esc(f.name)} · ${count(r)} agentes${o ? ' · ' + esc(o.name) : ''}</small></div>
          <a class="icon-btn" href="${opt.root || ''}builder.html#r=${encodeURIComponent(r.id)}" title="Abrir en el constructor"><i class="ti ti-hammer"></i><span>Abrir</span></a>
          <a class="icon-btn accent" href="${opt.root || ''}partida.html?p1=${encodeURIComponent(r.id)}" title="Jugar una partida con esta banda"><i class="ti ti-swords"></i><span>Jugar</span></a>
        </div>`;
      }).join('');
    },
    open() { openPanel(); },
  };

  // ── Panel de sesión ────────────────────────────────────────
  let close = null, pinFor = null;
  const ROOT = (document.currentScript?.src || '').replace(/js\/usuarios\.js.*$/, '');
  const online = () => !!(KT.cuenta && KT.nube?.on);
  function panelHtml() {
    const logo = `<img class="usr-logo" src="${ROOT}imagenes/app/logo-kt-sm.webp" alt="Kill Team" width="440" height="139">`;
    if (!online()) return logo + localHtml();
    const N = KT.nube;
    if (KT.cuenta.ready && N.user && !N.recovery) return logo + KT.cuenta.html() + bandsHtml(U.current());
    const u = U.current();
    return logo + KT.cuenta.html() + `<details class="usr-local"${u && !u.nube ? ' open' : ''}><summary><i class="ti ti-device-mobile"></i> Sin cuenta: perfiles en este dispositivo</summary>${localHtml()}</details>`;
  }
  function bandsHtml(u) {
    if (!u) return '';
    const mine = U.mine(u.id), free = U.free();
    return `<div class="usr"><h4>Mis bandas <span>${mine.length}</span></h4>
      ${mine.length ? `<div class="bands">${U.cards(mine, { hideOwner: true, root: ROOT })}</div>` : `<p class="usr-note">Todavía no tienes bandas guardadas. Créalas en el <a href="${ROOT}builder.html">constructor</a>: se guardarán en tu cuenta.</p>`}
      ${free.length ? `<h4>Sin dueño <span>${free.length}</span></h4><div class="bands">${U.cards(free, { root: ROOT })}</div>
        <div class="usr-row"><button class="icon-btn" data-u="claim"><i class="ti ti-user-plus"></i> Pasarlas a mi cuenta</button></div>` : ''}</div>`;
  }
  function localHtml() {
    const u = U.current(), list = U.list();
    if (u) {
      const mine = U.mine(u.id), free = U.free();
      return `<div class="usr">
        <div class="usr-me"><i class="ti ti-user-circle"></i><div><small>Sesión iniciada</small><b>${esc(u.name)}</b></div>
          <button class="icon-btn" data-u="switch"><i class="ti ti-users"></i> Cambiar</button><button class="icon-btn" data-u="logout"><i class="ti ti-logout"></i> Salir</button></div>
        <h4>Mis bandas <span>${mine.length}</span></h4>
        ${mine.length ? `<div class="bands">${U.cards(mine, { hideOwner: true, root: ROOT })}</div>` : `<p class="usr-note">Todavía no tienes bandas guardadas. Créalas en el <a href="${ROOT}builder.html">constructor</a>: se guardarán en tu perfil.</p>`}
        ${free.length ? `<h4>Sin dueño <span>${free.length}</span></h4><div class="bands">${U.cards(free, { root: ROOT })}</div>
          <div class="usr-row"><button class="icon-btn" data-u="claim"><i class="ti ti-user-plus"></i> Pasarlas a mi perfil</button></div>` : ''}
        <p class="usr-note">Los perfiles y las bandas se guardan en este dispositivo. ${online() ? 'Crea una cuenta online (arriba) para tenerlas en todos tus dispositivos y jugar con tu grupo.' : 'También puedes compartir una banda suelta desde el constructor.'}</p>
        <div class="usr-row"><span style="flex:1"></span><button class="icon-btn usr-del" data-u="del"><i class="ti ti-trash"></i> Borrar este usuario</button></div>
      </div>`;
    }
    return `<div class="usr">
      ${list.length ? `<h4>¿Quién eres?</h4><div class="usr-list">${list.map(x => `<button data-u="pick" data-id="${x.id}" class="${pinFor === x.id ? 'on' : ''}"><i class="ti ti-user-circle"></i><b>${esc(x.name)}</b><small>${U.mine(x.id).length} bandas${x.pin ? ' · con PIN' : ''}</small></button>`).join('')}</div>` : '<p class="usr-note">Crea tu usuario para tener a mano tus bandas guardadas. Cada jugador que use este dispositivo puede tener el suyo.</p>'}
      ${pinFor ? `<form class="usr-form" data-form="pin"><label>PIN de ${esc(U.byId(pinFor)?.name || '')}<input name="pin" type="password" inputmode="numeric" maxlength="8" autocomplete="off" autofocus></label><button class="icon-btn accent" type="submit">Entrar</button></form>` : ''}
      <h4>Nuevo usuario</h4>
      <form class="usr-form" data-form="new">
        <label>Nombre<input name="name" maxlength="24" autocomplete="off" placeholder="Tu nombre o apodo" required></label>
        <label>PIN <small>(opcional)</small><input name="pin" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="····"></label>
        <button class="icon-btn accent" type="submit"><i class="ti ti-user-plus"></i> Crear y entrar</button>
      </form>
      <p class="usr-note">Sin servidor ni contraseñas: el perfil vive en este dispositivo y el PIN solo evita entrar en el de otro por descuido.</p>
    </div>`;
  }
  function openPanel() {
    close?.(); pinFor = null;
    close = KT.modal(online() ? 'Tu cuenta' : 'Usuario', panelHtml(), 'user-circle');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    const redraw = () => { if (!box.isConnected) return; box.innerHTML = panelHtml(); box.querySelector('[autofocus]')?.focus(); };
    if (online()) { KT.cuenta.bind(box, redraw); KT.cuenta.load(redraw); }
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-u]'); if (!b) return;
      const a = b.dataset.u, u = U.current();
      if (a === 'pick') {
        const x = U.byId(b.dataset.id); if (!x) return;
        if (x.pin) { pinFor = x.id; redraw(); return; }
        U.login(x.id); KT.toast(`Hola, ${esc(x.name)}`, { type: 'ok' }); redraw();
      }
      else if (a === 'logout') { U.logout(); redraw(); }
      else if (a === 'switch') { KT.store.del('usuario'); fire(); redraw(); }
      else if (a === 'claim' && u) { U.claim(u.id); KT.toast('Bandas añadidas a tu perfil', { type: 'ok' }); redraw(); }
      else if (a === 'del' && u) {
        if (!confirm(`¿Borrar el usuario «${u.name}»? Sus bandas no se borran: quedan sin dueño.`)) return;
        U.remove(u.id); redraw();
      }
    });
    box.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, d = new FormData(f);
      try {
        if (f.dataset.form === 'new') { const x = U.add(d.get('name'), String(d.get('pin') || '').trim()); U.login(x.id); KT.toast(`Usuario «${esc(x.name)}» creado`, { type: 'ok' }); }
        else { const x = U.byId(pinFor); if (!U.checkPin(x, String(d.get('pin') || '').trim())) throw new Error('PIN incorrecto'); pinFor = null; U.login(x.id); KT.toast(`Hola, ${esc(x.name)}`, { type: 'ok' }); }
        redraw();
      } catch (err) { KT.toast(esc(err.message), { type: 'err' }); }
    });
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-user-chip]')) { e.preventDefault(); openPanel(); } });
  document.addEventListener('kt:user', () => document.querySelectorAll('[data-user-chip]').forEach(el => { const u = U.current(); el.classList.toggle('on', !!u); const s = el.querySelector('span'); if (s) s.textContent = u ? u.name : 'Entrar'; const old = el.querySelector('i, .chip-av'); if (old) old.outerHTML = chipFoto(u) || `<i class="ti ti-${chipIcon(u)}"></i>`; }));

  // ── Volver a la partida en curso (desde biblioteca, constructor…) ──
  window.addEventListener('load', () => {
    if (document.body.classList.contains('game')) return;
    const S = KT.store.get('partida');
    if (!S || !S.started || S.ended || !Array.isArray(S.players)) return;
    const n = i => S.players[i]?.name || 'Jugador ' + (i + 1);
    const a = document.createElement('a');
    a.className = 'back-game'; a.href = ROOT + 'partida.html?volver=1';
    a.innerHTML = `<i class="ti ti-swords"></i><span><b>Volver a la partida</b><small>${esc(n(0))} vs ${esc(n(1))} · PI ${S.tp || 1}</small></span>`;
    document.body.appendChild(a);
  });
})();
