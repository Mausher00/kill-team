// ============================================================
//  directo.js — Partidas en directo para la comunidad
//  En partida.html (quien juega):
//   · El jugador decide si su partida se ve y en qué comunidades (nunca por defecto).
//   · Publica el marcador al servidor cuando cambia (como mucho cada 4 s).
//   · Puede indicar un vídeo (YouTube, Twitch o Vimeo). En su pantalla puede sustituir al mapa.
//  En comunidad.html (quien mira):
//   · Lista «En directo» y vista de espectador: vídeo o mapa en el centro, marcadores a los lados.
//  Expone KT.directo y KT.video.
// ============================================================
(function () {
  const esc = KT.esc, N = KT.nube;
  const $ = s => document.querySelector(s);
  const inGame = document.body.classList.contains('game') || !!document.getElementById('board');

  // ── Vídeo incrustado: solo servicios conocidos ─────────────
  function embed(url) {
    let u; try { u = new URL(String(url || '').trim()); } catch { return null; }
    if (!/^https?:$/.test(u.protocol)) return null;
    const h = u.hostname.replace(/^www\.|^m\./, ''), p = u.pathname.split('/').filter(Boolean), ok = s => /^[\w-]{3,40}$/.test(s || '');
    if (h === 'youtu.be' && ok(p[0])) return { kind: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${p[0]}?rel=0` };
    if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
      const id = u.searchParams.get('v') || (['live', 'embed', 'shorts'].includes(p[0]) ? p[1] : null);
      if (ok(id)) return { kind: 'YouTube', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
      return null;
    }
    if (h === 'twitch.tv' || h === 'player.twitch.tv') {
      const parent = encodeURIComponent(location.hostname || 'localhost');
      if (p[0] === 'videos' && /^\d+$/.test(p[1] || '')) return { kind: 'Twitch', src: `https://player.twitch.tv/?video=${p[1]}&parent=${parent}&autoplay=false` };
      const ch = u.searchParams.get('channel') || p[0];
      if (ok(ch)) return { kind: 'Twitch', src: `https://player.twitch.tv/?channel=${ch}&parent=${parent}&autoplay=false` };
      return null;
    }
    if ((h === 'vimeo.com' || h === 'player.vimeo.com') && /^\d+$/.test(p[p.length - 1] || '')) return { kind: 'Vimeo', src: `https://player.vimeo.com/video/${p[p.length - 1]}` };
    return null;
  }
  const frame = e => `<iframe src="${esc(e.src)}" title="Vídeo de la partida (${e.kind})" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>`;
  KT.video = { embed, frame };

  // ════════════ Quien juega ════════════
  let LV = Object.assign({ grupos: [], video: '', local: false, gid: null }, KT.store.get('partida.directo', {}) || {});
  const keep = () => KT.store.set('partida.directo', LV);
  let timer = null, last = 0, state = '', groups = KT.store.get('nube.misgrupos', null);
  const active = () => LV.grupos.length > 0;
  const rerender = () => { if (typeof renderSheet === 'function' && $('#sheet')?.classList.contains('on')) renderSheet(); if (typeof renderWizard === 'function' && $('#setup')?.classList.contains('on') && typeof draft !== 'undefined' && draft) { try { renderSetup(); } catch { /* panel rápido */ } } };

  async function doPush() {
    timer = null;
    if (!active() || !N?.on || typeof liveSnap !== 'function') return;
    const snap = liveSnap(); if (!snap) return;
    if (LV.gid && LV.gid !== 'pendiente' && LV.gid !== snap.gid) { await stop(); return; }   // partida nueva: hay que volver a marcarlo
    if (LV.gid !== snap.gid) { LV.gid = snap.gid; keep(); }
    try { await N.ready(); if (!N.user) { state = 'sin sesión'; return; } await N.publicarDirecto(LV.grupos, snap, embed(LV.video) ? LV.video : null); last = Date.now(); state = 'ok'; }
    catch (e) { state = e.message; }
  }
  function push() { if (!active() || timer) return; timer = setTimeout(doPush, Math.max(300, 4000 - (Date.now() - last))); }
  async function stop() {
    LV = { ...LV, grupos: [], gid: null }; keep(); state = '';
    try { await N.ready(); if (N.user) await N.quitarDirecto(); } catch { /* sin conexión: caduca solo */ }
    rerender();
  }

  // Vídeo en el centro de la propia pantalla, en lugar del mapa
  function localVideo() {
    const center = $('.g-center'); if (!center) return;
    const e = LV.local && embed(LV.video);
    let box = $('#live-video'), tg = $('#live-toggle');
    if (!embed(LV.video)) { box?.remove(); tg?.remove(); document.body.classList.remove('live-video'); return; }
    if (!tg) { tg = document.createElement('button'); tg.id = 'live-toggle'; tg.className = 'g-bt live-tg'; center.prepend(tg); tg.addEventListener('click', () => { LV.local = !LV.local; keep(); localVideo(); }); }
    tg.innerHTML = LV.local ? '<i class="ti ti-map-2"></i><span>Ver mapa</span>' : '<i class="ti ti-brand-youtube"></i><span>Ver vídeo</span>';
    if (!e) { box?.remove(); document.body.classList.remove('live-video'); return; }
    if (!box) { box = document.createElement('div'); box.id = 'live-video'; box.className = 'g-live-video'; center.insertBefore(box, $('#board')); }
    if (box.dataset.src !== e.src) { box.dataset.src = e.src; box.innerHTML = frame(e); }
    document.body.classList.add('live-video');
  }

  function configModal() {
    if (!N?.on) { KT.toast('Las partidas en directo necesitan el servidor de la comunidad', { type: 'err' }); return; }
    const body = () => {
      if (!KT.user.current()?.nube) return `<div class="usr"><p class="usr-note">Para que tu comunidad vea la partida tienes que entrar con tu cuenta online.</p><div class="usr-row"><button class="icon-btn accent" data-lv="login"><i class="ti ti-login"></i> Entrar</button></div></div>`;
      if (groups == null) return '<div class="acc acc-load"><i class="ti ti-loader-2"></i> Cargando tus comunidades…</div>';
      if (!groups.length) return '<div class="usr"><p class="usr-note">Todavía no estás en ninguna comunidad. Crea una o únete con un código en la sección Comunidad.</p></div>';
      const e = embed(LV.video);
      return `<form class="acc-form" id="lvf" style="padding:6px 4px">
        <label>Visible para <small class="acc-hint">Los miembros verán jugadores, punto de inflexión, puntos de mando y puntuación. No ven tus operaciones ocultas.</small></label>
        ${groups.map(g => `<label class="lv-g"><input type="checkbox" name="g" value="${g.id}" ${LV.grupos.includes(g.id) ? 'checked' : ''}> <span>${esc(g.nombre)}</span></label>`).join('')}
        <label>Vídeo de la partida <small class="acc-hint">Opcional. Enlace de YouTube, Twitch o Vimeo: los espectadores lo ven en el centro, en lugar del mapa.</small>
          <input name="video" maxlength="300" value="${esc(LV.video)}" placeholder="https://youtu.be/…" inputmode="url"></label>
        ${LV.video && !e ? '<small class="acc-hint"><span class="bad">Ese enlace no es de YouTube, Twitch ni Vimeo.</span></small>' : ''}
        <label class="lv-g"><input type="checkbox" name="local" ${LV.local ? 'checked' : ''}> <span>Mostrar también el vídeo en el centro de esta pantalla, en lugar del mapa</span></label>
        <div class="acc-row"><button class="icon-btn accent" type="submit"><i class="ti ti-broadcast"></i> Guardar</button>
          ${active() ? '<button class="icon-btn" type="button" data-lv="stop"><i class="ti ti-broadcast-off"></i> Dejar de compartir</button>' : ''}</div>
        ${active() ? `<small class="acc-hint">${state === 'ok' ? '<span class="good"><i class="ti ti-check"></i> Publicando el marcador</span>' : state ? '<span class="bad">' + esc(state) + '</span>' : 'Se publicará al empezar la partida.'}</small>` : ''}
      </form>`;
    };
    const close = KT.modal('Partida en directo', body(), 'broadcast');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    const redraw = () => { if (box.isConnected) box.innerHTML = body(); };
    if (KT.user.current()?.nube && groups == null) N.ready().then(() => N.grupos()).then(g => { groups = g.filter(x => x.rol !== 'externo').map(x => ({ id: x.id, nombre: x.nombre })); KT.store.set('nube.misgrupos', groups); redraw(); }).catch(e => { groups = []; KT.toast(esc(e.message), { type: 'err' }); redraw(); });
    else if (KT.user.current()?.nube) N.ready().then(() => N.grupos()).then(g => { groups = g.filter(x => x.rol !== 'externo').map(x => ({ id: x.id, nombre: x.nombre })); KT.store.set('nube.misgrupos', groups); }).catch(() => {});
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-lv]'); if (!b) return;
      if (b.dataset.lv === 'login') { close(); KT.user.open(); }
      else if (b.dataset.lv === 'stop') { stop().then(() => { close(); localVideo(); KT.toast('La partida ya no se comparte'); }); }
    });
    box.addEventListener('submit', e => {
      e.preventDefault(); const d = new FormData(e.target), video = String(d.get('video') || '').trim();
      if (video && !embed(video)) { LV.video = video; redraw(); return; }
      const was = active();
      LV = { ...LV, grupos: d.getAll('g'), video, local: !!d.get('local'), gid: LV.gid || 'pendiente' }; keep();
      close(); localVideo(); rerender();
      if (active()) { last = 0; push(); KT.toast('Tu comunidad puede ver esta partida', { type: 'ok' }); }
      else if (was) stop().then(() => KT.toast('La partida ya no se comparte'));
    });
  }

  // ════════════ Quien mira ════════════
  const FRESH = 25 * 60e3, ENDED = 40 * 60e3;
  const alive = x => { const age = Date.now() - Date.parse(x.actualizado); return x.datos?.players?.length === 2 && (x.datos.ended ? age < ENDED : age < FRESH); };
  const fname = p => (typeof FACTIONS !== 'undefined' && FACTIONS[p.faction]?.name) || p.title || '';
  const ago = d => { const s = Math.max(0, (Date.now() - Date.parse(d)) / 1000); return s < 60 ? 'ahora mismo' : s < 3600 ? `hace ${Math.round(s / 60)} min` : `hace ${Math.round(s / 3600)} h`; };
  function listHtml(L) {
    const A = (L || []).filter(alive); if (!A.length) return '';
    return `<div class="m-sec"><i class="ti ti-broadcast"></i> En directo <span>${A.length}</span></div>
      ${A.map(x => { const [a, b] = x.datos.players; return `<button class="lv-card${x.datos.ended ? ' end' : ''}" data-live="${x.usuario}">
        <span class="lv-dot">${x.datos.ended ? 'Terminada' : 'En directo'}</span>
        <span class="lv-p">${esc(a.name)}<small>${esc(fname(a))}</small></span><b>${a.total} – ${b.total}</b><span class="lv-p r">${esc(b.name)}<small>${esc(fname(b))}</small></span>
        <span class="lv-meta">${x.datos.ended ? 'Final' : 'PI ' + x.datos.tp} · ${ago(x.actualizado)}${x.video && embed(x.video) ? ' · <i class="ti ti-video"></i> con vídeo' : ''} · publica ${esc(x.nombre)}</span></button>`; }).join('')}`;
  }
  function side(p, k, d) {
    const f = typeof FACTIONS !== 'undefined' && FACTIONS[p.faction];
    return `<aside class="lv-side p${k + 1}">
      ${f?.img ? `<img class="lv-fimg" src="${esc(f.img)}" alt="" onerror="this.remove()">` : ''}
      <h3>${esc(p.name)}${d.ini === k ? ' <span class="lv-ini" title="Tiene la iniciativa"><i class="ti ti-bolt"></i></span>' : ''}</h3>
      <small>${esc(fname(p))}</small>
      <div class="lv-total">${p.total}<small>PV</small></div>
      <div class="lv-cp"><span><b>${p.cp}</b> PM</span><span><b>${p.ops - p.lost}</b>/${p.ops} operativos</span></div>
      <div class="lv-tp">${[0, 1, 2, 3].map(n => `<span class="${!d.ended && d.tp === n + 1 ? 'now' : ''}"><small>PI${n + 1}</small><b>${p.tp?.[n] ?? 0}</b></span>`).join('')}</div>
      <div class="lv-brk"><span>Crítica <b>${p.vp.crit}</b></span><span>Eliminación <b>${p.vp.kill}</b></span><span>Táctica <b>${p.vp.tac}</b></span>${d.ended ? `<span>Principal <b>${p.vp.prim}</b></span>` : ''}</div>
    </aside>`;
  }
  let W = null;   // { grupo, usuario, el, t, src }
  function paint(x) {
    const d = x.datos, e = x.video && embed(x.video), mid = W.el.querySelector('.lv-mid'), src = e ? e.src : 'img:' + (d.img || '');
    W.el.querySelector('.lv-hd-t').innerHTML = `<b>${d.ended ? 'Partida terminada' : 'Punto de inflexión ' + d.tp}</b><small>${[d.crit, d.zone, d.map].filter(Boolean).map(esc).join(' · ')} · actualizado ${ago(x.actualizado)}</small>`;
    W.el.querySelector('.lv-l').innerHTML = side(d.players[0], 0, d);
    W.el.querySelector('.lv-r').innerHTML = side(d.players[1], 1, d);
    if (W.src !== src) { W.src = src; mid.innerHTML = e ? frame(e) : d.img ? `<img src="${esc(d.img)}" alt="Mapa de la partida">` : '<div class="lv-nomap"><i class="ti ti-map-2"></i>Sin mapa</div>'; }
  }
  async function poll() {
    if (!W) return;
    try { const L = await N.directos(W.grupo), x = L.find(y => y.usuario === W.usuario); if (!W) return; if (x) paint(x); else { W.el.querySelector('.lv-hd-t').innerHTML = '<b>La partida ya no se comparte</b>'; } } catch { /* reintenta */ }
  }
  function watch(grupo, x) {
    unwatch();
    const el = document.createElement('div'); el.className = 'lv-view'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Partida en directo');
    el.innerHTML = `<header class="lv-hd"><div class="lv-hd-t"></div><button class="icon-btn" data-lvw="fs" title="Pantalla completa" aria-label="Pantalla completa"><i class="ti ti-maximize"></i></button><button class="icon-btn accent" data-lvw="close"><i class="ti ti-x"></i> Cerrar</button></header>
      <div class="lv-grid"><div class="lv-l"></div><div class="lv-mid"></div><div class="lv-r"></div></div>`;
    document.body.appendChild(el); document.body.style.overflow = 'hidden';
    W = { grupo, usuario: x.usuario, el, src: null, t: setInterval(poll, 8000) };
    el.addEventListener('click', e => { const b = e.target.closest('[data-lvw]'); if (!b) return; if (b.dataset.lvw === 'close') unwatch(); else (document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen?.())?.catch?.(() => {}); });
    paint(x);
  }
  function unwatch() { if (!W) return; clearInterval(W.t); W.el.remove(); W = null; document.body.style.overflow = ''; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && W && !document.fullscreenElement) unwatch(); });

  KT.directo = {
    embed, push, stop, config: configModal, listHtml, watch, alive,
    get active() { return active(); },
    // bloque de la hoja de opciones de la partida
    optHtml() {
      if (!N?.on) return '';
      return `<h4>Comunidad</h4><div class="g-row"><button class="icon-btn ${active() ? 'accent' : ''}" data-live-cfg><i class="ti ti-broadcast"></i> ${active() ? 'En directo para tu comunidad' : 'Compartir en directo'}</button></div>
        <p class="g-hint">${active() ? 'Los miembros de las comunidades marcadas ven el marcador de esta partida.' : 'Nadie ve tu partida si no lo activas aquí. Puedes añadir un vídeo de YouTube, Twitch o Vimeo.'}</p>`;
    },
    // botón del último paso de la preparación
    setupBtn() { return N?.on ? `<button class="icon-btn ${active() ? 'on' : ''}" data-live-cfg title="Que tu comunidad pueda ver el marcador de esta partida" style="height:38px"><i class="ti ti-broadcast"></i> ${active() ? 'Visible para mi comunidad' : 'Hacerla visible'}</button>` : ''; },
  };

  if (inGame) {
    document.addEventListener('click', e => { if (e.target.closest('[data-live-cfg]')) { e.preventDefault(); configModal(); } });
    window.addEventListener('load', () => { localVideo(); if (active()) setTimeout(push, 1500); });
  }
})();
