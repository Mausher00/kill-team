// ============================================================
//  campana.js — Modo campaña (hoja de datos del comando)
//  kt.campanas = [{ id, name, owner?, factionId, created, pr,
//     ops: [{ id, opId, name, xp, st: 'ok' | 'rec' | 'dead', hon: [{n,t}], scar: [{n,t}], games }],
//     stash: [texto], spec: { name, need, done } | null,
//     log: [{ id, date, vs, res: 'w'|'d'|'l', vp: [a, b], gid?, note, xp: n, pr: n, events: [texto] }] }]
//  Las reglas (rangos, tablas, costes) están en js/data/campana.js.
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, R = window.CAMPANA;
  const KEY = 'campanas';
  const load = () => KT.store.get(KEY, []) || [];
  // Las campañas con `compartida: [comunidades]` se copian al servidor (solo lectura para los demás)
  let tSync = null;
  const cloudOn = () => !!(KT.nube?.on && KT.user.current()?.nube);
  const syncCloud = (quiet = true) => { if (!cloudOn()) return; clearTimeout(tSync); tSync = setTimeout(() => KT.nube.ready().then(() => KT.nube.user && KT.nube.sincronizarCampanas(load())).then(n => { if (!quiet && n != null) KT.toast(n ? 'Campaña compartida con tu comunidad' : 'La campaña ya no se comparte', { type: 'ok' }); }).catch(e => { if (!quiet) KT.toast(esc(e.message), { type: 'err', ms: 6000 }); }), quiet ? 2500 : 0); };
  const saveAll = l => { KT.store.set(KEY, l); if (l.some(c => c.compartida?.length) || tSync) syncCloud(); };
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  const rankOf = xp => { let k = 0; R.rangos.forEach((r, i) => { if (xp >= r.xp) k = i; }); return k; };
  const nextRank = xp => R.rangos[rankOf(xp) + 1] || null;
  let cur = null, tab = 'hoja', form = false, post = null;

  const withC = fn => { const list = load(), C = list.find(x => x.id === cur); if (!C) return; fn(C); saveAll(list); render(); };
  const opName = (C, o) => o.name || FACTIONS[C.factionId]?.ops.find(x => x.id === o.opId)?.name || o.opId;
  const cardOf = (C, o) => FACTIONS[C.factionId]?.ops.find(x => x.id === o.opId);

  function shareModal(C) {
    if (!cloudOn()) { KT.toast('Entra con tu cuenta online para compartir la campaña', { type: 'err' }); KT.user.open(); return; }
    const close = KT.modal('Compartir campaña', '<div class="acc acc-load"><i class="ti ti-loader-2"></i> Cargando tus comunidades…</div>', 'users-group');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    KT.nube.ready().then(() => KT.nube.grupos()).then(gs => {
      const G = gs.filter(g => g.rol !== 'externo'); if (!box.isConnected) return;
      box.innerHTML = G.length ? `<form class="acc-form" id="shf" style="padding:6px 4px"><label>Visible para <small class="acc-hint">Los miembros verán la hoja de datos (operativos, rangos, honores, cicatrices y partidas) sin poder cambiarla. Se actualiza sola cuando la modificas.</small></label>
        ${G.map(g => `<label class="lv-g"><input type="checkbox" name="g" value="${g.id}" ${C.compartida?.includes(g.id) ? 'checked' : ''}> <span>${esc(g.nombre)}</span></label>`).join('')}
        <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> Guardar</button></form>` : '<div class="usr"><p class="usr-note">Todavía no estás en ninguna comunidad. Crea una o únete con un código en la sección Comunidad.</p></div>';
      box.querySelector('#shf')?.addEventListener('submit', e => { e.preventDefault(); const ids = new FormData(e.target).getAll('g'); close();
        const list = load(), c = list.find(x => x.id === C.id); if (!c) return; if (ids.length) c.compartida = ids; else delete c.compartida;
        KT.store.set(KEY, list); syncCloud(false); render(); });
    }).catch(e => { close(); KT.toast(esc(e.message), { type: 'err' }); });
  }

  function render() {
    const list = load(), C = cur && list.find(x => x.id === cur);
    if (post && C) return renderPost(C);
    if (form) return renderForm();
    if (!C) { cur = null; return renderHome(list); }
    renderCamp(C);
  }

  // ── Inicio ─────────────────────────────────────────────────
  function renderHome(list) {
    const me = KT.user.current();
    const mine = me ? list.filter(c => !c.owner || c.owner === me.id) : list;
    $('#app').innerHTML = `
      <header class="m-hd">
        <a class="back" href="index.html"><i class="ti ti-arrow-left"></i> <img class="back-logo" src="imagenes/app/logo-kt-sm.webp" alt="Kill Team" width="440" height="139"></a>
        <h1>Campaña</h1>
        <p>Lleva la hoja de datos de tu comando de partida en partida: experiencia y rangos, honores de batalla, cicatrices, requisición y operaciones especiales. Es una adaptación propia del juego narrativo de la edición anterior a las reglas actuales.</p>
        <div class="row">${KT.user.chip('icon-btn')}<button class="icon-btn accent" data-a="new"><i class="ti ti-plus"></i> Nueva campaña</button></div>
      </header>
      ${mine.length ? `<div class="m-grid">${mine.map(c => {
        const f = FACTIONS[c.factionId], alive = c.ops.filter(o => o.st !== 'dead').length, G = c.log.filter(l => !l.spec), w = G.filter(l => l.res === 'w').length;
        return `<button class="m-card" data-open="${c.id}"><small>${esc(f?.name || c.factionId)}${c.owner ? ' · ' + esc(KT.user.byId(c.owner)?.name || '') : ''}</small><b>${esc(c.name)}</b>
          <span>${alive} operativos · ${G.length} partidas (${w} victorias) · ${c.pr} PR</span></button>`;
      }).join('')}</div>` : `<div class="m-empty"><i class="ti ti-flag-3" style="font-size:28px;display:block;margin-bottom:6px"></i>${me ? 'No tienes campañas todavía.' : 'Aún no hay campañas.'} Crea la primera a partir de una banda guardada o de un comando.</div>`}`;
  }
  function renderForm() {
    const me = KT.user.current();
    const rosters = (KT.store.get('rosters', []) || []).filter(r => FACTIONS[r.factionId] && (!me || !r.owner || r.owner === me.id));
    $('#app').innerHTML = `
      <header class="m-hd"><button class="back" data-a="cancel"><i class="ti ti-arrow-left"></i> Campañas</button><h1>Nueva campaña</h1></header>
      <form class="m-form" id="f">
        <div class="m-row"><label>Nombre de la campaña<input name="name" maxlength="40" placeholder="Cruzada de Volkus" required></label></div>
        <div class="m-row"><label>Empezar desde<select name="src">
          ${rosters.length ? `<optgroup label="Mis bandas guardadas">${rosters.map(r => `<option value="r:${esc(r.id)}">${esc(r.name)} — ${esc(FACTIONS[r.factionId].name)}</option>`).join('')}</optgroup>` : ''}
          <optgroup label="Comando (hoja vacía)">${Object.values(FACTIONS).sort((a, b) => a.name.localeCompare(b.name, 'es')).map(f => `<option value="f:${esc(f.id)}">${esc(f.name)}</option>`).join('')}</optgroup></select></label></div>
        <p style="font-size:12.5px;color:var(--text-3)">Con una banda guardada, sus operativos entran directamente en la hoja de datos. Después podrás ponerles nombre y reclutar más (hasta ${R.maxOps}).</p>
        <div class="m-row"><button class="icon-btn accent" type="submit"><i class="ti ti-flag-3"></i> Crear campaña</button><button type="button" class="icon-btn" data-a="cancel">Cancelar</button></div>
      </form>`;
    $('#f').addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(e.target), [kind, id] = String(d.get('src')).split(/:(.*)/);
      let factionId = id, ops = [];
      if (kind === 'r') {
        const r = (KT.store.get('rosters', []) || []).find(x => x.id === id); if (!r) return;
        factionId = r.factionId;
        const f = FACTIONS[factionId];
        r.ops.forEach(o => { const od = f.ops.find(x => x.id === o.opId) || f.ops.find(x => x.type === o.type); if (!od) return; for (let k = 0; k < o.qty; k++) ops.push({ id: uid('o'), opId: od.id, name: '', xp: 0, st: 'ok', hon: [], scar: [], games: 0 }); });
      }
      const C = { id: uid('c'), name: String(d.get('name')).trim() || 'Campaña', owner: me?.id, factionId, created: new Date().toISOString(), pr: 1, ops, stash: [], spec: null, log: [] };
      if (!C.owner) delete C.owner;
      saveAll([C, ...load()]); form = false; cur = C.id; tab = 'hoja'; render();
      KT.toast(`Campaña «${esc(C.name)}» creada con ${ops.length} operativos y 1 PR`, { type: 'ok' });
    });
  }

  // ── Campaña ────────────────────────────────────────────────
  function opRow(C, o) {
    const od = cardOf(C, o), rk = rankOf(o.xp), nx = nextRank(o.xp), base = R.rangos[rk].xp;
    const pct = nx ? Math.round((o.xp - base) / (nx.xp - base) * 100) : 100;
    const pend = rk - o.hon.length;                                   // honores pendientes por rangos alcanzados
    return `<div class="c-op ${o.st === 'rec' ? 'rec' : o.st === 'dead' ? 'dead' : ''}" data-op="${o.id}">
      <div class="nm"><b>${esc(opName(C, o))}</b><span class="rk">${R.rangos[rk].n}</span>
        <small>${esc(od?.name || '')}${o.st === 'rec' ? ' · en recuperación' : o.st === 'dead' ? ' · muerto' : ''} · ${o.games} partidas</small></div>
      <div class="xp"><div><small>${o.xp} XP${nx ? ' · ' + nx.n + ' a ' + nx.xp : ''}</small><div class="c-bar"><span style="width:${pct}%"></span></div></div>
        <span class="m-step"><button data-oa="xp" data-v="-1" aria-label="Restar XP">−</button><button data-oa="xp" data-v="1" aria-label="Sumar XP">+</button></span></div>
      <div class="tags">
        ${o.hon.map((h, k) => `<span class="c-tag" title="${esc(h.t)}"><i class="ti ti-medal"></i>${esc(h.n)}<button data-oa="rmhon" data-k="${k}" aria-label="Quitar">×</button></span>`).join('')}
        ${o.scar.map((h, k) => `<span class="c-tag scar" title="${esc(h.t)}"><i class="ti ti-bandage"></i>${esc(h.n)}<button data-oa="rmscar" data-k="${k}" aria-label="Quitar">×</button></span>`).join('')}
        ${pend > 0 && o.st !== 'dead' ? `<button class="icon-btn accent" data-oa="honor"><i class="ti ti-medal"></i> Honor pendiente (${pend})</button>` : ''}
        <span style="flex:1"></span>
        <button class="icon-btn" data-oa="name" title="Poner nombre"><i class="ti ti-pencil"></i></button>
        <button class="icon-btn" data-oa="honor" title="Añadir un honor de batalla"><i class="ti ti-medal"></i></button>
        <button class="icon-btn" data-oa="scar" title="Añadir una cicatriz de batalla"><i class="ti ti-bandage"></i></button>
        <button class="icon-btn" data-oa="st" title="Cambiar estado: activo → en recuperación → muerto">${o.st === 'ok' ? 'Activo' : o.st === 'rec' ? 'Recuperación' : 'Muerto'}</button>
        <button class="icon-btn" data-oa="del" title="Quitar de la hoja"><i class="ti ti-trash"></i></button>
      </div></div>`;
  }
  function renderCamp(C) {
    const f = FACTIONS[C.factionId], alive = C.ops.filter(o => o.st !== 'dead');
    const G = C.log.filter(l => !l.spec), w = G.filter(l => l.res === 'w').length, dr = G.filter(l => l.res === 'd').length;
    const tabs = [['hoja', 'Hoja de datos'], ['base', 'Base'], ['partidas', 'Partidas'], ['reglas', 'Reglas']];
    let body = '';
    if (tab === 'hoja') {
      body = `<div class="m-kv"><div><b>${alive.length}<small style="font-size:12px;color:var(--text-3)"> / ${R.maxOps}</small></b><small>Operativos</small></div><div><b>${C.pr}</b><small>Requisición</small></div><div><b>${G.length}</b><small>Partidas</small></div><div><b>${w}-${dr}-${G.length - w - dr}</b><small>G-E-P</small></div></div>
        <div class="m-sec"><i class="ti ti-users-group"></i> Operativos <span>${C.ops.filter(o => o.st === 'rec').length} en recuperación</span></div>
        ${C.ops.length ? [...C.ops].sort((a, b) => (a.st === 'dead') - (b.st === 'dead') || b.xp - a.xp).map(o => opRow(C, o)).join('') : '<div class="m-empty">La hoja está vacía. Recluta operativos abajo.</div>'}
        <div class="m-form" style="margin-top:10px"><div class="m-row"><label>Reclutar operativo<select id="rec-sel">${(f?.ops || []).map(o => `<option value="${esc(o.id)}">${esc(o.name)}</option>`).join('')}</select></label>
          <button class="icon-btn accent" data-a="recruit" style="align-self:flex-end" ${alive.length >= R.maxOps ? 'disabled' : ''}><i class="ti ti-user-plus"></i> Reclutar (1 PR)</button>
          <button class="icon-btn" data-a="recruit0" style="align-self:flex-end" ${alive.length >= R.maxOps ? 'disabled' : ''}>Añadir sin coste</button></div></div>`;
    } else if (tab === 'base') {
      const S = C.spec;
      body = `<div class="m-sec"><i class="ti ti-coins"></i> Puntos de requisición</div>
        <div class="m-row"><span class="m-step"><button data-a="pr" data-v="-1">−</button><b>${C.pr}</b><button data-a="pr" data-v="1">+</button></span><span style="font-size:12.5px;color:var(--text-3)">máximo ${R.maxPR} · +${R.pr.jugar} por partida, +${R.pr.ganar} más si ganas</span></div>
        <div class="m-row" style="margin-top:8px">${R.costes.map(c => `<span class="m-chip">${esc(c.n)} · <b style="color:var(--orange)">${c.pr} PR</b></span>`).join('')}</div>
        <div class="m-sec"><i class="ti ti-backpack"></i> Arsenal <span>equipo raro y recursos</span></div>
        <div class="m-chips">${C.stash.map((s, k) => `<span class="m-chip">${esc(s)}<button data-a="rmstash" data-k="${k}" aria-label="Quitar">×</button></span>`).join('') || '<span style="font-size:13px;color:var(--text-3)">Vacío.</span>'}</div>
        <div class="m-row" style="margin-top:8px"><input class="m-in" id="stash-in" maxlength="60" placeholder="Nombre del equipo o recurso" style="flex:1 1 220px"><button class="icon-btn" data-a="stash"><i class="ti ti-plus"></i> Guardar en el arsenal</button><button class="icon-btn" data-a="stash1">Comprar (1 PR)</button></div>
        <div class="m-sec"><i class="ti ti-target-arrow"></i> Operación especial</div>
        ${S ? `<div class="m-form"><div class="m-row"><b style="font-family:var(--font-display);font-size:18px;text-transform:uppercase;color:#fff;flex:1">${esc(S.name)}</b>
            <span class="m-step"><button data-a="spec" data-v="-1">−</button><b>${S.done}/${S.need}</b><button data-a="spec" data-v="1">+</button></span></div>
            <div class="c-bar" style="width:100%"><span style="width:${Math.min(100, S.done / S.need * 100)}%"></span></div>
            <div class="m-row">${S.done >= S.need ? `<button class="icon-btn accent" data-a="specdone"><i class="ti ti-trophy"></i> Completar: +2 PR y un honor</button>` : `<span style="font-size:12.5px;color:var(--text-3)">Suma 1 de progreso por cada partida en la que cumplas su condición.</span>`}<span style="flex:1"></span><button class="icon-btn" data-a="specdel">Abandonar</button></div></div>`
          : `<div class="m-form"><div class="m-row"><label>Nombre<input id="spec-n" maxlength="50" placeholder="Sabotear la línea de suministros"></label><label style="flex:0 1 150px">Partidas necesarias<select id="spec-k"><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label>
            <button class="icon-btn accent" data-a="specnew" style="align-self:flex-end"><i class="ti ti-target-arrow"></i> Empezar</button></div>
            <p style="font-size:12.5px;color:var(--text-3)">Una operación especial es un objetivo narrativo que os marcáis para varias partidas (por ejemplo «ganar en Volkus» o «puntuar la operación táctica»). Al completarla ganas 2 PR y un honor de batalla para un operativo.</p></div>`}`;
    } else if (tab === 'partidas') {
      const H = (KT.store.get('historial', []) || []).filter(r => r.players.some(p => p.faction === C.factionId) && !C.log.some(l => l.gid === r.id)).slice(0, 6);
      body = `<div class="m-row"><button class="icon-btn accent" data-a="post"><i class="ti ti-clipboard-plus"></i> Registrar una partida a mano</button><a class="icon-btn" href="partida.html"><i class="ti ti-swords"></i> Jugar ahora</a></div>
        ${H.length ? `<div class="m-sec"><i class="ti ti-history"></i> Partidas del historial sin registrar</div>${H.map(r => {
          const k = r.players.findIndex(p => p.faction === C.factionId), me = r.players[k], op = r.players[1 - k];
          return `<div class="c-log"><div class="m-row"><div style="flex:1"><b>${esc(me.name)} ${me.total} – ${op.total} ${esc(op.name)}</b><br><small>${new Date(r.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} · contra ${esc(FACTIONS[op.faction]?.name || op.faction)} · ${me.lost} bajas</small></div>
            <button class="icon-btn accent" data-a="post" data-gid="${esc(r.id)}"><i class="ti ti-clipboard-plus"></i> Registrar</button></div></div>`; }).join('')}` : ''}
        <div class="m-sec"><i class="ti ti-notebook"></i> Diario de campaña <span>${C.log.length}</span></div>
        ${C.log.length ? C.log.map(l => `<div class="c-log"><div class="m-row"><div style="flex:1"><b>${l.spec ? 'Operación especial' : `${l.res === 'w' ? 'Victoria' : l.res === 'd' ? 'Empate' : 'Derrota'} ${l.vp[0]}–${l.vp[1]}${l.vs ? ' contra ' + esc(l.vs) : ''}`}</b><br>
          <small>${new Date(l.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} · +${l.xp} XP · +${l.pr} PR</small></div><button class="icon-btn" data-a="rmlog" data-id="${l.id}" title="Quitar del diario (no deshace sus efectos)"><i class="ti ti-trash"></i></button></div>
          ${l.events.length ? `<div style="margin-top:4px">${l.events.map(e => '• ' + esc(e)).join('<br>')}</div>` : ''}${l.note ? `<div style="margin-top:4px;font-style:italic">${esc(l.note)}</div>` : ''}</div>`).join('') : '<div class="m-empty">Todavía no hay partidas registradas.</div>'}`;
    } else {
      const tb = (rows, h) => `<table><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;
      body = `<div class="c-rules">
        <p><b style="color:var(--action)">Reglas de la casa.</b> Adaptación propia del juego narrativo de la edición anterior de Kill Team a las reglas actuales; no es material oficial. Se pueden cambiar en <code>js/data/campana.js</code>.</p>
        <h3>Hoja de datos</h3><p>Hasta ${R.maxOps} operativos. Para cada partida eliges tu comando entre los que están activos, respetando la selección normal de tu comando.</p>
        <h3>Después de cada partida</h3>
        <p>1. <b>Experiencia:</b> +${R.xp.jugar} XP cada operativo que jugó y +${R.xp.destacado} XP más al operativo destacado.<br>
           2. <b>Prueba de baja:</b> 1D6 por cada operativo incapacitado.<br>3. <b>Requisición:</b> +${R.pr.jugar} PR, +${R.pr.ganar} más si ganas (máximo ${R.maxPR}).<br>4. <b>Operación especial:</b> suma progreso si cumpliste su condición.</p>
        ${tb(R.baja.map(b => [b.de === b.a ? b.de : b.de + '–' + b.a, esc(b.t)]), ['1D6', 'Prueba de baja'])}
        <h3>Rangos</h3>${tb(R.rangos.map(r => [r.n, r.xp + ' XP']), ['Rango', 'Desde'])}<p>Al alcanzar un rango nuevo el operativo gana un <b>honor de batalla</b>: elige especialidad y tira 1D6.</p>
        ${Object.entries(R.honores).map(([k, l]) => `<h3>Honores · ${k}</h3>${tb(l.map((h, i) => [i + 1, '<b>' + esc(h.n) + '</b>', esc(h.t)]), ['1D6', 'Honor', 'Efecto'])}`).join('')}
        <h3>Cicatrices de batalla</h3>${tb(R.cicatrices.map((h, i) => [i + 1, '<b>' + esc(h.n) + '</b>', esc(h.t)]), ['1D6', 'Cicatriz', 'Efecto'])}
        <h3>Requisición</h3>${tb(R.costes.map(c => [esc(c.n), c.pr + ' PR']), ['Gasto', 'Coste'])}</div>`;
    }
    $('#app').innerHTML = `
      <header class="m-hd">
        <button class="back" data-a="home"><i class="ti ti-arrow-left"></i> Campañas</button>
        <h1>${esc(C.name)}</h1>
        <p>${esc(f?.name || C.factionId)}${C.owner ? ' · ' + esc(KT.user.byId(C.owner)?.name || '') : ''}</p>
        <div class="row"><button class="icon-btn" data-a="rename"><i class="ti ti-pencil"></i> Renombrar</button><button class="icon-btn" data-a="export"><i class="ti ti-download"></i> Exportar</button>${KT.nube?.on ? `<button class="icon-btn ${C.compartida?.length ? 'accent' : ''}" data-a="sharec"><i class="ti ti-users-group"></i> ${C.compartida?.length ? 'Compartida' : 'Compartir en comunidad'}</button>` : ''}<button class="icon-btn" data-a="delc" style="color:#f07070"><i class="ti ti-trash"></i> Borrar</button></div>
      </header>
      <div class="m-tabs">${tabs.map(([k, v]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${v}</button>`).join('')}</div>${body}`;
  }

  // ── Honores y cicatrices ───────────────────────────────────
  function pickHonor(C, o) {
    const close = KT.modal('Honor de batalla', `<div class="usr"><p class="usr-note" style="margin-top:0">Para <b style="color:#fff">${esc(opName(C, o))}</b>. Elige especialidad y tira 1D6, o elige el honor directamente.</p>
      ${Object.entries(R.honores).map(([k, l]) => `<h4>${k} <button class="icon-btn" data-roll="${k}" style="height:26px;margin-left:8px"><i class="ti ti-dice-5"></i> Tirar</button></h4>
        <div class="m-chips">${l.map((h, i) => `<button class="m-chip add" data-h="${k}:${i}" title="${esc(h.t)}">${i + 1}. ${esc(h.n)}</button>`).join('')}</div>`).join('')}</div>`, 'medal');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    const give = (k, i) => { const h = R.honores[k][i]; close(); withC(C2 => { C2.ops.find(x => x.id === o.id).hon.push({ n: h.n, t: h.t }); }); KT.toast(`${esc(opName(C, o))} gana «${esc(h.n)}»: ${esc(h.t)}`, { type: 'ok', ms: 6000 }); };
    box.addEventListener('click', e => {
      const r = e.target.closest('[data-roll]'), h = e.target.closest('[data-h]');
      if (r) { const l = R.honores[r.dataset.roll]; let i = d6() - 1, n = 0; while (o.hon.some(x => x.n === l[i].n) && n++ < 12) i = d6() - 1; give(r.dataset.roll, i); }
      else if (h) { const [k, i] = h.dataset.h.split(':'); give(k, +i); }
    });
  }
  function pickScar(C, o) {
    const close = KT.modal('Cicatriz de batalla', `<div class="usr"><p class="usr-note" style="margin-top:0">Para <b style="color:#fff">${esc(opName(C, o))}</b>.</p>
      <div class="usr-row"><button class="icon-btn accent" data-roll><i class="ti ti-dice-5"></i> Tirar 1D6</button></div>
      <div class="m-chips" style="margin-top:8px">${R.cicatrices.map((h, i) => `<button class="m-chip add" data-h="${i}" title="${esc(h.t)}">${i + 1}. ${esc(h.n)}</button>`).join('')}</div></div>`, 'bandage');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    box.addEventListener('click', e => {
      const r = e.target.closest('[data-roll]'), h = e.target.closest('[data-h]'); if (!r && !h) return;
      const s = R.cicatrices[r ? d6() - 1 : +h.dataset.h]; close();
      withC(C2 => { C2.ops.find(x => x.id === o.id).scar.push({ n: s.n, t: s.t }); });
      KT.toast(`${esc(opName(C, o))} sufre «${esc(s.n)}»: ${esc(s.t)}`, { ms: 6000 });
    });
  }

  // ── Registrar partida (secuencia posterior) ────────────────
  function startPost(C, gid) {
    const r = gid && (KT.store.get('historial', []) || []).find(x => x.id === gid);
    const k = r ? r.players.findIndex(p => p.faction === C.factionId) : 0, me = r?.players[k], op = r?.players[1 - k];
    const act = C.ops.filter(o => o.st === 'ok');
    // emparejar los operativos de la partida con los de la hoja (por ficha)
    const played = new Set(), ko = new Set();
    if (me?.list) {
      const pool = [...act];
      me.list.forEach(x => { const i = pool.findIndex(o => o.opId === x.id); if (i < 0) return; const o = pool.splice(i, 1)[0]; played.add(o.id); if (x.ko) ko.add(o.id); });
    } else act.forEach(o => played.add(o.id));
    post = { gid: r?.id || null, date: r?.date || new Date().toISOString(), vs: op ? (FACTIONS[op.faction]?.name || op.faction) + (op.name ? ' (' + op.name + ')' : '') : '',
      vp: r ? [me.total, op.total] : [0, 0], played: [...played], ko: [...ko], mvp: null, spec: false, note: '', rolls: null };
    render();
  }
  function renderPost(C) {
    const act = C.ops.filter(o => o.st === 'ok'), rec = C.ops.filter(o => o.st === 'rec');
    const res = post.vp[0] === post.vp[1] ? 'd' : post.vp[0] > post.vp[1] ? 'w' : 'l';
    $('#app').innerHTML = `
      <header class="m-hd"><button class="back" data-a="postcancel"><i class="ti ti-arrow-left"></i> ${esc(C.name)}</button><h1>Después de la partida</h1>
        <p>Marca quién jugó y quién quedó incapacitado. Al aplicar se reparte la experiencia, se tiran las pruebas de baja y se suma la requisición.</p></header>
      <form class="m-form c-post" id="pf">
        <div class="m-row"><label>Rival<input name="vs" maxlength="60" value="${esc(post.vs)}" placeholder="Comando o jugador rival"></label>
          <label style="flex:0 1 110px">Tus PV<input name="a" type="number" min="0" max="30" value="${post.vp[0]}"></label><label style="flex:0 1 110px">PV rival<input name="b" type="number" min="0" max="30" value="${post.vp[1]}"></label></div>
        <div class="m-sec" style="margin:6px 0 0"><i class="ti ti-users-group"></i> Operativos <span>${res === 'w' ? 'Victoria' : res === 'd' ? 'Empate' : 'Derrota'}</span></div>
        <div>${act.map(o => `<div class="oprow"><span>${esc(opName(C, o))} <small style="font-family:var(--font-mono);font-size:10px;color:var(--text-3)">${R.rangos[rankOf(o.xp)].n} · ${o.xp} XP</small></span>
          <label class="ck"><input type="checkbox" name="p" value="${o.id}" ${post.played.includes(o.id) ? 'checked' : ''}> Jugó</label>
          <label class="ck"><input type="checkbox" name="k" value="${o.id}" ${post.ko.includes(o.id) ? 'checked' : ''}> Incapacitado</label>
          <label class="ck"><input type="radio" name="mvp" value="${o.id}" ${post.mvp === o.id ? 'checked' : ''}> Destacado</label></div>`).join('') || '<p style="color:var(--text-3)">No hay operativos activos.</p>'}</div>
        ${rec.length ? `<p style="font-size:12.5px;color:var(--text-3)">En recuperación (vuelven a estar activos tras esta partida): ${rec.map(o => esc(opName(C, o))).join(', ')}.</p>` : ''}
        ${C.spec ? `<label class="ck"><input type="checkbox" name="spec" ${post.spec ? 'checked' : ''}> Cumplida la condición de la operación especial «${esc(C.spec.name)}» (+1 progreso)</label>` : ''}
        <label>Notas<textarea name="note" maxlength="400" placeholder="Qué pasó, quién hizo qué…">${esc(post.note)}</textarea></label>
        <div class="m-row"><button class="icon-btn accent" type="submit"><i class="ti ti-dice-5"></i> Aplicar y tirar las pruebas de baja</button><button type="button" class="icon-btn" data-a="postcancel">Cancelar</button></div>
      </form>`;
    const f = $('#pf');
    f.addEventListener('change', () => { const d = new FormData(f); post.vs = d.get('vs'); post.vp = [+d.get('a') || 0, +d.get('b') || 0]; post.played = d.getAll('p'); post.ko = d.getAll('k').filter(id => post.played.includes(id)); post.mvp = d.get('mvp'); post.spec = !!d.get('spec'); post.note = d.get('note'); });
    f.addEventListener('submit', e => { e.preventDefault(); f.dispatchEvent(new Event('change')); applyPost(); });
  }
  function applyPost() {
    const P = post, res = P.vp[0] === P.vp[1] ? 'd' : P.vp[0] > P.vp[1] ? 'w' : 'l', events = [];
    let xpTot = 0, prGain = 0;
    withC(C => {
      C.ops.filter(o => o.st === 'rec').forEach(o => { o.st = 'ok'; events.push(`${opName(C, o)} vuelve de la recuperación.`); });
      P.played.forEach(id => {
        const o = C.ops.find(x => x.id === id); if (!o) return;
        const before = rankOf(o.xp);
        let g = R.xp.jugar + (P.mvp === id ? R.xp.destacado : 0);
        if (o.scar.some(s => s.n === 'Mala racha')) g = Math.max(0, g - 1);
        o.xp += g; o.games++; xpTot += g;
        if (rankOf(o.xp) > before) events.push(`${opName(C, o)} asciende a ${R.rangos[rankOf(o.xp)].n}: tiene un honor pendiente.`);
      });
      P.ko.forEach(id => {
        const o = C.ops.find(x => x.id === id); if (!o) return;
        let roll = d6(); const raw = roll;
        if (o.hon.some(h => h.n === 'Superviviente')) roll = Math.min(6, roll + 1);
        const row = R.baja.find(b => roll >= b.de && roll <= b.a) || R.baja[R.baja.length - 1];
        if (row.r === 'scar') {
          if (o.scar.length >= 2) { o.st = 'dead'; events.push(`${opName(C, o)}: prueba de baja ${raw} → muere a causa de sus heridas.`); }
          else { const s = R.cicatrices[d6() - 1]; o.scar.push({ n: s.n, t: s.t }); events.push(`${opName(C, o)}: prueba de baja ${raw} → cicatriz «${s.n}» (${s.t})`); }
        } else if (row.r === 'rec') { o.st = 'rec'; events.push(`${opName(C, o)}: prueba de baja ${raw} → en recuperación, se pierde la siguiente partida.`); }
        else events.push(`${opName(C, o)}: prueba de baja ${raw} → sin consecuencias.`);
      });
      prGain = R.pr.jugar + (res === 'w' ? R.pr.ganar : 0);
      const pr0 = C.pr; C.pr = Math.min(R.maxPR, C.pr + prGain); prGain = C.pr - pr0;
      if (P.spec && C.spec) { C.spec.done = Math.min(C.spec.need, C.spec.done + 1); events.push(`Operación especial «${C.spec.name}»: ${C.spec.done}/${C.spec.need}.`); }
      C.log.unshift({ id: uid('g'), date: P.date, vs: P.vs, res, vp: P.vp, gid: P.gid, note: P.note, xp: xpTot, pr: prGain, events });
      tab = 'partidas'; post = null;
    });
    KT.toast(`Partida registrada: +${xpTot} XP, +${prGain} PR${events.length ? ' · ' + events.length + ' sucesos en el diario' : ''}`, { type: 'ok', ms: 5000 });
  }

  // ── Clics ──────────────────────────────────────────────────
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a], [data-open], [data-tab], [data-oa]'); if (!t) return;
    const d = t.dataset, C = load().find(x => x.id === cur);
    if (d.open) { cur = d.open; tab = 'hoja'; render(); }
    else if (d.tab) { tab = d.tab; render(); }
    else if (d.oa && C) {
      const id = t.closest('[data-op]').dataset.op, o = C.ops.find(x => x.id === id), a = d.oa;
      if (a === 'xp') withC(C2 => { const x = C2.ops.find(q => q.id === id); x.xp = Math.max(0, x.xp + +d.v); });
      else if (a === 'honor') pickHonor(C, o);
      else if (a === 'scar') pickScar(C, o);
      else if (a === 'rmhon') withC(C2 => C2.ops.find(q => q.id === id).hon.splice(+d.k, 1));
      else if (a === 'rmscar') withC(C2 => C2.ops.find(q => q.id === id).scar.splice(+d.k, 1));
      else if (a === 'st') withC(C2 => { const x = C2.ops.find(q => q.id === id); x.st = x.st === 'ok' ? 'rec' : x.st === 'rec' ? 'dead' : 'ok'; });
      else if (a === 'name') { const v = prompt('Nombre del operativo', o.name || ''); if (v != null) withC(C2 => { C2.ops.find(q => q.id === id).name = v.trim().slice(0, 40); }); }
      else if (a === 'del') { if (confirm(`¿Quitar a «${opName(C, o)}» de la hoja de datos?`)) withC(C2 => { C2.ops = C2.ops.filter(q => q.id !== id); }); }
    }
    else if (d.a === 'new') { form = true; render(); }
    else if (d.a === 'cancel') { form = false; render(); }
    else if (d.a === 'home') { cur = null; render(); }
    else if (d.a === 'post') startPost(C, d.gid);
    else if (d.a === 'postcancel') { post = null; render(); }
    else if (!C) return;
    else if (d.a === 'recruit' || d.a === 'recruit0') {
      const pay = d.a === 'recruit';
      if (pay && C.pr < 1) { KT.toast('No tienes puntos de requisición', { type: 'err' }); return; }
      const opId = $('#rec-sel').value;
      withC(C2 => { if (pay) C2.pr--; C2.ops.push({ id: uid('o'), opId, name: '', xp: 0, st: 'ok', hon: [], scar: [], games: 0 }); });
    }
    else if (d.a === 'pr') withC(C2 => { C2.pr = Math.max(0, Math.min(R.maxPR, C2.pr + +d.v)); });
    else if (d.a === 'stash' || d.a === 'stash1') {
      const v = $('#stash-in').value.trim(); if (!v) return;
      if (d.a === 'stash1' && C.pr < 1) { KT.toast('No tienes puntos de requisición', { type: 'err' }); return; }
      withC(C2 => { if (d.a === 'stash1') C2.pr--; C2.stash.push(v); });
    }
    else if (d.a === 'rmstash') withC(C2 => C2.stash.splice(+d.k, 1));
    else if (d.a === 'specnew') { const n = $('#spec-n').value.trim(); if (!n) { KT.toast('Ponle un nombre', { type: 'err' }); return; } const need = +$('#spec-k').value; withC(C2 => { C2.spec = { name: n, need, done: 0 }; }); }
    else if (d.a === 'spec') withC(C2 => { C2.spec.done = Math.max(0, Math.min(C2.spec.need, C2.spec.done + +d.v)); });
    else if (d.a === 'specdel') { if (confirm('¿Abandonar la operación especial?')) withC(C2 => { C2.spec = null; }); }
    else if (d.a === 'specdone') { const name = C.spec.name; withC(C2 => { C2.pr = Math.min(R.maxPR, C2.pr + 2); C2.log.unshift({ id: uid('g'), date: new Date().toISOString(), vs: '', res: 'w', vp: [0, 0], note: '', xp: 0, pr: 2, events: [`Operación especial «${name}» completada: +2 PR y un honor de batalla.`], spec: true }); C2.spec = null; tab = 'hoja'; }); KT.toast('Operación completada: +2 PR. Da un honor de batalla al operativo que elijas (botón de la medalla).', { type: 'ok', ms: 7000 }); }
    else if (d.a === 'rmlog') withC(C2 => { C2.log = C2.log.filter(l => l.id !== d.id); });
    else if (d.a === 'rename') { const v = prompt('Nombre de la campaña', C.name); if (v && v.trim()) withC(C2 => { C2.name = v.trim().slice(0, 40); }); }
    else if (d.a === 'export') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(C, null, 1)], { type: 'application/json' })); a.download = KT.norm(C.name).replace(/[^a-z0-9]+/g, '-') + '.ktcampana.json'; a.click(); }
    else if (d.a === 'sharec') shareModal(C);
    else if (d.a === 'delc' && C.compartida?.length && !confirm(`«${C.name}» está compartida con tu comunidad. Al borrarla también desaparece de allí. ¿Continuar?`)) return;
    else if (d.a === 'delc') { if (confirm(`¿Borrar la campaña «${C.name}»?`)) { const had = C.compartida?.length; saveAll(load().filter(x => x.id !== C.id)); if (had) syncCloud(); cur = null; render(); } }
  });
  document.addEventListener('kt:user', () => { if (!cur) render(); });
  if (location.hash.length > 1) cur = location.hash.slice(1);
  KT.initFx && KT.initFx();
  render();
})();
