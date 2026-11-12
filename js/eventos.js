// ============================================================
//  eventos.js — Pestaña «Eventos» de una comunidad
//  · Lista de próximos y pasados, y vista de mes
//  · Tipos: partida, quedada, liga, torneo y campaña (los crean los administradores)
//  · Asistencia: voy / quizá / no puedo. En ligas, torneos y campañas «voy» es la inscripción
//  · Ligas, torneos y campañas: emparejamientos todos contra todos, resultados y clasificación
//  · Al cerrar con ganador, el servidor le concede una distinción (sube su rango)
//  Lo usa grupo.js: KT.eventos.html(ctx), KT.eventos.click(t, ctx), KT.eventos.reset()
//  ctx = { G, D, canAdmin, run, load, render }
// ============================================================
(function () {
  const $ = s => document.querySelector(s), esc = KT.esc, N = KT.nube;
  const app = $('#app');
  const TIPO = { partida: ['Partida', 'swords'], quedada: ['Quedada', 'users'], liga: ['Liga', 'trophy'], torneo: ['Torneo', 'tournament'], campana: ['Campaña', 'flag-3'] };
  const COMP = t => t === 'liga' || t === 'torneo' || t === 'campana';
  const EST = { voy: ['Voy', 'check'], quiza: ['Quizá', 'help'], no: ['No puedo', 'x'] };
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const largo = d => new Date(d).toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  const corto = d => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const hora = d => new Date(d).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  let view = 'lista', month = new Date(), sel = null, ctx = null;
  const me = () => N.user.id;
  const nom = u => (ctx.D.mem || []).find(m => m.usuario === u)?.nombre || 'Ex miembro';
  const mine = e => e.asistencias.find(a => a.usuario === me())?.estado || null;
  const going = e => e.asistencias.filter(a => a.estado === 'voy');
  const upcoming = e => (COMP(e.tipo) && e.estado === 'abierto') || Date.parse(e.fin || e.inicio) > Date.now() - 12 * 3600e3;

  // ── Clasificación de una liga o torneo ─────────────────────
  function table(e) {
    const T = {}; going(e).forEach(a => { T[a.usuario] = { u: a.usuario, pj: 0, g: 0, e: 0, d: 0, pf: 0, pc: 0, pts: 0 }; });
    e.encuentros.filter(x => x.pa != null).forEach(x => {
      [[x.a, x.pa, x.pb], [x.b, x.pb, x.pa]].forEach(([u, m, o]) => {
        const r = T[u] || (T[u] = { u, pj: 0, g: 0, e: 0, d: 0, pf: 0, pc: 0, pts: 0 });
        r.pj++; r.pf += m; r.pc += o; if (m > o) { r.g++; r.pts += 3; } else if (m === o) { r.e++; r.pts += 1; } else r.d++;
      });
    });
    return Object.values(T).sort((x, y) => y.pts - x.pts || (y.pf - y.pc) - (x.pf - x.pc) || y.pf - x.pf || nom(x.u).localeCompare(nom(y.u)));
  }

  // ── Tarjeta de la lista ────────────────────────────────────
  const rsvp = (e, small) => e.estado !== 'abierto' ? '' : `<div class="e-rsvp${small ? ' sm' : ''}" data-eid="${e.id}">${Object.entries(EST).map(([k, [t, ic]]) => `<button class="${mine(e) === k ? 'on ' + k : ''}" data-ev="rsvp" data-s="${k}"><i class="ti ti-${ic}"></i> ${COMP(e.tipo) && k === 'voy' ? (mine(e) === 'voy' ? 'Inscrito' : 'Inscribirme') : t}</button>`).join('')}</div>`;
  function card(e) {
    const d = new Date(e.inicio), [tn, ic] = TIPO[e.tipo], n = going(e).length, q = e.asistencias.filter(a => a.estado === 'quiza').length;
    return `<article class="e-card${e.estado === 'cerrado' ? ' closed' : ''}" data-eid="${e.id}">
      <button class="e-date" data-ev="open" aria-label="Abrir ${esc(e.titulo)}"><b>${d.getDate()}</b><small>${d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</small></button>
      <div class="e-body">
        <small class="e-type"><i class="ti ti-${ic}"></i> ${tn}${e.estado === 'cerrado' ? ' · cerrado' : ''}</small>
        <button class="e-title" data-ev="open">${esc(e.titulo)}</button>
        <small>${d.toLocaleDateString('es-ES', { weekday: 'long' })} · ${hora(e.inicio)}${e.lugar ? ' · ' + esc(e.lugar) : ''}</small>
        <small>${n} ${COMP(e.tipo) ? (n === 1 ? 'inscrito' : 'inscritos') : (n === 1 ? 'va' : 'van')}${q ? ` · ${q} quizá` : ''}${e.ganador ? ` · <span class="e-win"><i class="ti ti-award"></i> ${esc(nom(e.ganador))}</span>` : ''}</small>
      </div>
      <div class="e-side">${rsvp(e, true)}<button class="icon-btn" data-ev="open">Abrir <i class="ti ti-chevron-right"></i></button></div>
    </article>`;
  }

  // ── Vista de mes ───────────────────────────────────────────
  function monthHtml(E) {
    const y = month.getFullYear(), m = month.getMonth(), first = new Date(y, m, 1), off = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate(), today = ymd(new Date());
    const by = {}; E.forEach(e => { (by[ymd(new Date(e.inicio))] = by[ymd(new Date(e.inicio))] || []).push(e); });
    let cells = '';
    for (let i = 0; i < off; i++) cells += '<div class="e-cell out"></div>';
    for (let d = 1; d <= days; d++) {
      const k = `${y}-${pad(m + 1)}-${pad(d)}`, L = by[k] || [];
      cells += `<div class="e-cell${k === today ? ' today' : ''}${L.length ? ' has' : ''}"><span>${d}</span>${L.map(e => `<button class="e-chip t-${e.tipo}" data-ev="open" data-eid="${e.id}" title="${esc(e.titulo)} · ${hora(e.inicio)}">${esc(e.titulo)}</button>`).join('')}</div>`;
    }
    return `<div class="e-mnav"><button class="icon-btn" data-ev="prev" aria-label="Mes anterior"><i class="ti ti-chevron-left"></i></button><b>${first.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</b><button class="icon-btn" data-ev="next" aria-label="Mes siguiente"><i class="ti ti-chevron-right"></i></button><button class="icon-btn" data-ev="today">Hoy</button></div>
      <div class="e-month"><div class="e-dow">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => `<span>${d}</span>`).join('')}</div><div class="e-days">${cells}</div></div>`;
  }

  // ── Detalle ────────────────────────────────────────────────
  function detail(e) {
    const [tn, ic] = TIPO[e.tipo], A = ctx.canAdmin, open = e.estado === 'abierto';
    const groups = [['voy', COMP(e.tipo) ? 'Inscritos' : 'Van'], ['quiza', 'Quizá'], ['no', 'No pueden']].map(([k, t]) => [t, e.asistencias.filter(a => a.estado === k)]).filter(([, l]) => l.length);
    return `<div class="e-det" data-eid="${e.id}">
      <button class="e-back" data-ev="back"><i class="ti ti-arrow-left"></i> Todos los eventos</button>
      <small class="e-type"><i class="ti ti-${ic}"></i> ${tn}${open ? '' : ' · cerrado'}</small>
      <h2>${esc(e.titulo)}</h2>
      <p class="e-when"><i class="ti ti-calendar-event"></i> ${largo(e.inicio)}${e.fin ? ' — hasta el ' + corto(e.fin) : ''}${e.lugar ? ` &nbsp; <i class="ti ti-map-pin"></i> ${esc(e.lugar)}` : ''}</p>
      ${e.descripcion ? `<p class="e-desc">${esc(e.descripcion)}</p>` : ''}
      ${e.ganador ? `<p class="e-champ"><i class="ti ti-award"></i> Ganador: <b>${esc(nom(e.ganador))}</b></p>` : ''}
      ${rsvp(e)}
      <div class="m-row e-tools">
        <button class="icon-btn" data-ev="ics"><i class="ti ti-calendar-plus"></i> A mi calendario</button>
        <button class="icon-btn" data-ev="share"><i class="ti ti-share"></i> Compartir</button>
        ${A ? `<button class="icon-btn" data-ev="edit"><i class="ti ti-edit"></i> Editar</button>
          ${open ? `<button class="icon-btn accent" data-ev="close"><i class="ti ti-flag-check"></i> Cerrar${COMP(e.tipo) ? ' y proclamar ganador' : ''}</button>` : '<button class="icon-btn" data-ev="reopen"><i class="ti ti-lock-open"></i> Reabrir</button>'}
          <button class="icon-btn acc-del" data-ev="del"><i class="ti ti-trash"></i> Borrar</button>` : ''}
      </div>
      ${groups.length ? groups.map(([t, l]) => `<div class="m-sec"><i class="ti ti-users"></i> ${t} <span>${l.length}</span></div><div class="q-mems e-att">${l.map(a => `<span>${N.avatar(nom(a.usuario), a.usuario)} ${esc(nom(a.usuario))}</span>`).join('')}</div>`).join('') : '<p class="g-note">Todavía no se ha apuntado nadie.</p>'}
      ${COMP(e.tipo) ? compHtml(e) : ''}
    </div>`;
  }
  function compHtml(e) {
    const T = table(e), open = e.estado === 'abierto', A = ctx.canAdmin, ins = going(e).map(a => a.usuario), iAmIn = ins.includes(me());
    const rounds = {}; e.encuentros.forEach(x => { (rounds[x.ronda || 0] = rounds[x.ronda || 0] || []).push(x); });
    const canEdit = x => open && (A || x.a === me() || x.b === me());
    const row = x => `<div class="e-match${x.pa == null ? ' pend' : ''}" data-mid="${x.id}">
        <span class="${x.pa != null && x.pa > x.pb ? 'w' : ''}">${esc(nom(x.a))}</span>
        ${x.pa == null ? '<b class="vs">vs</b>' : `<b>${x.pa} – ${x.pb}</b>`}
        <span class="${x.pa != null && x.pb > x.pa ? 'w' : ''}">${esc(nom(x.b))}</span>
        <div class="e-mact">${canEdit(x) ? `<button data-ev="score" title="${x.pa == null ? 'Apuntar el resultado' : 'Corregir el resultado'}"><i class="ti ti-${x.pa == null ? 'pencil-plus' : 'pencil'}"></i>${x.pa == null ? ' Apuntar' : ''}</button>` : ''}${A ? '<button data-ev="mdel" title="Borrar la partida" aria-label="Borrar la partida"><i class="ti ti-x"></i></button>' : ''}</div></div>`;
    const opts = l => l.map(u => `<option value="${u}">${esc(nom(u))}</option>`).join('');
    return `<div class="m-sec"><i class="ti ti-trophy"></i> Clasificación</div>
      ${T.length ? `<div class="m-scroll"><table class="m-tab"><thead><tr><th>#</th><th>Jugador</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>PV+</th><th>PV−</th><th>Pts</th></tr></thead><tbody>
        ${T.map((r, k) => `<tr class="${k === 0 && r.pj ? 'lead' : ''}"><td>${k + 1}</td><td class="n">${esc(nom(r.u))}</td><td>${r.pj}</td><td>${r.g}</td><td>${r.e}</td><td>${r.d}</td><td>${r.pf}</td><td>${r.pc}</td><td class="pts">${r.pts}</td></tr>`).join('')}</tbody></table></div>
        <p class="g-note">3 puntos por victoria y 1 por empate. Desempata la diferencia de puntos de victoria.</p>` : '<p class="g-note">Nadie se ha inscrito todavía. Pulsa «Inscribirme» para participar.</p>'}
      <div class="m-sec"><i class="ti ti-swords"></i> Partidas <span>${e.encuentros.filter(x => x.pa != null).length}/${e.encuentros.length}</span></div>
      ${Object.keys(rounds).sort((a, b) => a - b).map(r => `${+r ? `<h4 class="e-round">Ronda ${r}</h4>` : (Object.keys(rounds).length > 1 ? '<h4 class="e-round">Sin ronda</h4>' : '')}${rounds[r].map(row).join('')}`).join('') || '<p class="g-note">Aún no hay partidas.</p>'}
      ${open && (A || iAmIn) && ins.length > 1 ? `<form class="m-form e-new" data-evf="match">
        <div class="m-row">${A ? `<select class="m-in" name="a" aria-label="Jugador">${opts(ins)}</select>` : `<input type="hidden" name="a" value="${me()}"><span class="e-me">${esc(nom(me()))}</span>`}
          <input class="m-in e-sc" name="pa" type="number" min="0" max="99" inputmode="numeric" placeholder="PV" aria-label="Puntos del primer jugador">
          <b>–</b>
          <input class="m-in e-sc" name="pb" type="number" min="0" max="99" inputmode="numeric" placeholder="PV" aria-label="Puntos del rival">
          <select class="m-in" name="b" aria-label="Rival">${opts(A ? ins.slice(1).concat(ins[0]) : ins.filter(u => u !== me()))}</select>
          <button class="icon-btn accent" type="submit"><i class="ti ti-plus"></i> Apuntar partida</button></div>
        <small class="g-note">Si esa partida estaba pendiente en los emparejamientos, se rellena. Deja los puntos vacíos para dejarla pendiente.</small></form>` : open && !iAmIn && !A ? '' : ''}
      ${open && A && ins.length > 1 ? `<div class="m-row" style="margin-top:8px"><button class="icon-btn" data-ev="fixtures"><i class="ti ti-arrows-shuffle"></i> Generar emparejamientos (todos contra todos)</button></div>` : ''}`;
  }

  // ── Formularios en ventana ─────────────────────────────────
  function eventModal(e) {
    const d = e ? new Date(e.inicio) : (() => { const x = new Date(); x.setDate(x.getDate() + ((6 - x.getDay() + 7) % 7 || 7)); x.setHours(17, 0, 0, 0); return x; })();
    const f = e?.fin ? new Date(e.fin) : null;
    const close = KT.modal(e ? 'Editar evento' : 'Nuevo evento', `<form class="acc-form" id="ef" style="padding:6px 4px">
      <label>Tipo<select name="tipo" class="m-in" style="height:42px">${Object.entries(TIPO).map(([k, [t]]) => `<option value="${k}"${(e?.tipo || 'quedada') === k ? ' selected' : ''}>${t}</option>`).join('')}</select>
        <small class="acc-hint">Liga, torneo y campaña tienen inscripción, partidas y clasificación.</small></label>
      <label>Título<input name="titulo" maxlength="80" required value="${esc(e?.titulo || '')}" placeholder="Liga de otoño, Quedada del sábado…"></label>
      <div class="e-two"><label>Día<input name="d" type="date" required value="${ymd(d)}"></label><label>Hora<input name="t" type="time" required value="${pad(d.getHours())}:${pad(d.getMinutes())}"></label></div>
      <label>Termina el <small class="acc-hint">Opcional, para ligas y campañas de varios días</small><input name="f" type="date" value="${f ? ymd(f) : ''}"></label>
      <label>Lugar<input name="lugar" maxlength="120" value="${esc(e?.lugar || '')}" placeholder="Opcional"></label>
      <label>Descripción<textarea name="descripcion" maxlength="1000" rows="3" placeholder="Opcional: formato, puntos, normas…">${esc(e?.descripcion || '')}</textarea></label>
      <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> ${e ? 'Guardar' : 'Crear evento'}</button></form>`, 'calendar-plus');
    $('#ef').addEventListener('submit', x => {
      x.preventDefault(); const v = new FormData(x.target), ini = new Date(`${v.get('d')}T${v.get('t') || '17:00'}`), fin = v.get('f') ? new Date(`${v.get('f')}T23:59`) : null;
      if (isNaN(ini)) { KT.toast('La fecha no es válida', { type: 'err' }); return; }
      ctx.run(async () => { await N.guardarEvento(ctx.G.id, { tipo: v.get('tipo'), titulo: v.get('titulo'), descripcion: v.get('descripcion'), lugar: v.get('lugar'), inicio: ini.toISOString(), fin: fin ? fin.toISOString() : null }, e?.id); close(); month = new Date(ini); await ctx.load(); }, e ? 'Evento actualizado' : 'Evento creado');
    });
  }
  function scoreModal(e, x) {
    const close = KT.modal('Resultado', `<form class="acc-form" id="scf" style="padding:6px 4px">
      <div class="e-score"><label>${esc(nom(x.a))}<input name="pa" type="number" min="0" max="99" inputmode="numeric" value="${x.pa ?? ''}" autofocus></label><b>–</b><label>${esc(nom(x.b))}<input name="pb" type="number" min="0" max="99" inputmode="numeric" value="${x.pb ?? ''}"></label></div>
      <small class="acc-hint">Puntos de victoria de cada jugador. Vacíos para dejarla pendiente.</small>
      <button class="icon-btn accent" type="submit"><i class="ti ti-device-floppy"></i> Guardar</button></form>`, 'pencil');
    $('#scf').addEventListener('submit', v => { v.preventDefault(); const d = new FormData(v.target);
      ctx.run(async () => { await N.guardarEncuentro({ id: x.id, pa: d.get('pa'), pb: d.get('pb') }); close(); await ctx.load(); }, 'Resultado guardado'); });
  }
  function closeModal(e) {
    const T = COMP(e.tipo) ? table(e) : [], cand = COMP(e.tipo) ? T.map(r => r.u) : going(e).map(a => a.usuario), lead = T[0]?.pj ? T[0].u : '';
    const close = KT.modal('Cerrar evento', `<form class="acc-form" id="cf" style="padding:6px 4px">
      <label>Ganador<select name="g" class="m-in" style="height:42px"><option value="">Sin ganador</option>${cand.map(u => `<option value="${u}"${u === lead ? ' selected' : ''}>${esc(nom(u))}</option>`).join('')}</select></label>
      <label>Distinción que recibe<input name="t" maxlength="60" value="${esc(('Ganador: ' + e.titulo).slice(0, 60))}"><small class="acc-hint">Suma 5 puntos de rango y una estrella. Sin ganador no se concede nada.</small></label>
      <small class="acc-hint">Al cerrar ya no se pueden apuntar partidas ni cambiar la asistencia. Se puede reabrir.</small>
      <button class="icon-btn accent" type="submit"><i class="ti ti-flag-check"></i> Cerrar evento</button></form>`, 'flag-check');
    $('#cf').addEventListener('submit', v => { v.preventDefault(); const d = new FormData(v.target);
      ctx.run(async () => { await N.cerrarEvento(e.id, d.get('g'), d.get('t')); close(); await ctx.load(); }, d.get('g') ? `Evento cerrado. Distinción para ${esc(nom(d.get('g')))}` : 'Evento cerrado'); });
  }
  // todos contra todos (método del círculo); no repite parejas que ya existen
  function fixtures(e) {
    const P = going(e).map(a => a.usuario); if (P.length % 2) P.push(null);
    const n = P.length, have = new Set(e.encuentros.map(x => [x.a, x.b].sort().join('|'))), rows = [];
    const base = Math.max(0, ...e.encuentros.map(x => x.ronda || 0));
    for (let r = 0; r < n - 1; r++) {
      for (let i = 0; i < n / 2; i++) {
        const a = P[i], b = P[n - 1 - i]; if (!a || !b) continue;
        if (!have.has([a, b].sort().join('|'))) rows.push({ evento: e.id, a: r % 2 ? b : a, b: r % 2 ? a : b, ronda: base + r + 1 });
      }
      P.splice(1, 0, P.pop());
    }
    return rows;
  }

  // ── API para grupo.js ──────────────────────────────────────
  KT.eventos = {
    reset() { sel = null; view = 'lista'; month = new Date(); },
    count: D => (D.ev || []).filter(upcoming).length,
    html(c) {
      ctx = c; const E = c.D.ev;
      if (E == null) return '<div class="m-empty">Cargando…</div>';
      const e = sel && E.find(x => x.id === sel); if (e) return detail(e); sel = null;
      const up = E.filter(upcoming), past = E.filter(x => !upcoming(x)).reverse();
      return `<div class="m-row e-bar"><div class="e-seg"><button class="${view === 'lista' ? 'on' : ''}" data-ev="view" data-v="lista"><i class="ti ti-list"></i> Lista</button><button class="${view === 'mes' ? 'on' : ''}" data-ev="view" data-v="mes"><i class="ti ti-calendar-month"></i> Mes</button></div>
          <span style="flex:1"></span>${c.canAdmin ? '<button class="icon-btn accent" data-ev="new"><i class="ti ti-calendar-plus"></i> Nuevo evento</button>' : ''}</div>
        ${view === 'mes' ? monthHtml(E) : !E.length ? `<div class="m-empty"><i class="ti ti-calendar-event" style="font-size:28px;display:block;margin-bottom:6px"></i>No hay eventos. ${c.canAdmin ? 'Crea una quedada, una liga o un torneo con «Nuevo evento».' : 'Los administradores pueden crear quedadas, ligas y torneos.'}</div>`
          : `${up.length ? `<div class="m-sec"><i class="ti ti-calendar-event"></i> Próximos y en curso <span>${up.length}</span></div>${up.map(card).join('')}` : '<p class="g-note">No hay eventos próximos.</p>'}
             ${past.length ? `<details class="e-past"><summary><i class="ti ti-history"></i> Pasados <span>${past.length}</span></summary>${past.map(card).join('')}</details>` : ''}`}`;
    },
    click(t, c) {
      ctx = c; const a = t.dataset.ev, id = t.closest('[data-eid]')?.dataset.eid || t.dataset.eid, e = id && c.D.ev.find(x => x.id === id);
      if (a === 'view') { view = t.dataset.v; c.render(); }
      else if (a === 'prev' || a === 'next') { month = new Date(month.getFullYear(), month.getMonth() + (a === 'next' ? 1 : -1), 1); c.render(); }
      else if (a === 'today') { month = new Date(); c.render(); }
      else if (a === 'new') eventModal(null);
      else if (a === 'back') { sel = null; c.render(); }
      else if (!e) return;
      else if (a === 'open') { sel = e.id; c.render(); scrollTo({ top: 0 }); }
      else if (a === 'rsvp') { const s = t.dataset.s, cur = mine(e);
        if (cur === 'voy' && s !== 'voy' && COMP(e.tipo) && e.encuentros.some(x => x.a === me() || x.b === me()) && !confirm('Tienes partidas en este evento. ¿Seguro que quieres darte de baja?')) return;
        c.run(async () => { await N.asistir(e.id, cur === s ? null : s); await c.load(); }); }
      else if (a === 'edit') eventModal(e);
      else if (a === 'close') closeModal(e);
      else if (a === 'reopen') { if (confirm('¿Reabrir el evento? Si había ganador, se le retira la distinción de este evento.')) c.run(async () => { await N.reabrirEvento(e.id); await c.load(); }, 'Evento reabierto'); }
      else if (a === 'del') { if (confirm(`¿Borrar «${e.titulo}» con su asistencia y sus partidas?`)) c.run(async () => { await N.borrarEvento(e.id); sel = null; await c.load(); }, 'Evento borrado'); }
      else if (a === 'ics') KT.cal.download({ title: `Kill Team: ${e.titulo}`, start: new Date(e.inicio), mins: 180, desc: [c.G.nombre, e.descripcion].filter(Boolean).join('\n'), place: e.lugar || '' });
      else if (a === 'share') KT.share.open({ title: e.titulo, text: `📅 ${e.titulo}\n${largo(e.inicio)}${e.lugar ? '\n📍 ' + e.lugar : ''}${e.descripcion ? '\n' + e.descripcion : ''}\n${c.G.nombre} · Kill Team` });
      else if (a === 'fixtures') { const rows = fixtures(e); if (!rows.length) { KT.toast('Ya están todos los emparejamientos', { type: 'ok' }); return; }
        if (confirm(`Se crearán ${rows.length} partidas pendientes entre los ${going(e).length} inscritos.`)) c.run(async () => { await N.crearEncuentros(rows); await c.load(); }, `${rows.length} partidas creadas`); }
      else if (a === 'score' || a === 'mdel') { const x = e.encuentros.find(m => m.id === t.closest('[data-mid]').dataset.mid); if (!x) return;
        if (a === 'score') scoreModal(e, x); else if (confirm('¿Borrar esta partida?')) c.run(async () => { await N.borrarEncuentro(x.id); await c.load(); }); }
    },
  };
  // apuntar una partida desde el detalle
  app.addEventListener('submit', v => {
    const f = v.target.closest('[data-evf="match"]'); if (!f || !ctx) return;
    v.preventDefault();
    const d = new FormData(f), a = d.get('a'), b = d.get('b'), e = ctx.D.ev.find(x => x.id === sel); if (!e) return;
    if (a === b) { KT.toast('Elige dos jugadores distintos', { type: 'err' }); return; }
    const pend = e.encuentros.find(x => x.pa == null && ((x.a === a && x.b === b) || (x.a === b && x.b === a)));
    const sw = pend && pend.a === b;
    ctx.run(async () => { await N.guardarEncuentro(pend ? { id: pend.id, pa: sw ? d.get('pb') : d.get('pa'), pb: sw ? d.get('pa') : d.get('pb') } : { evento: e.id, a, b, pa: d.get('pa'), pb: d.get('pb') }); await ctx.load(); }, 'Partida apuntada');
  });
})();
