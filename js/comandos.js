// ============================================================
//  comandos.js — Comandos añadidos por el usuario («paquetes»)
//  Un paquete es un JSON { schema: 'kt-comando/1', comando: {…} }
//  con el mismo formato que js/data/*.js. Se guarda en este
//  dispositivo (localStorage 'kt.comandos') y se registra en
//  FACTIONS al cargar cada página, así aparece en la biblioteca,
//  el constructor, la partida y el historial.
//  Expone window.KTC.
// ============================================================
(function () {
  const KEY = 'kt.comandos';
  const SCHEMA = 'kt-comando/1';
  const BUILTIN = {};                       // comandos incluidos sustituidos (para restaurarlos al borrar)
  const UNIVERSAL_IDS = ['deposito-municion', 'alambre-puas', 'aparato-comunicaciones', 'minas', 'barricadas-ligeras',
    'barricada-pesada', 'escaleras', 'granadas-especiales', 'granadas-explosivas', 'carga-demolicion', 'barricada-portatil'];

  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); return true; } catch { return false; } };

  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  // Texto seguro: sin etiquetas HTML (la app pinta los datos como HTML)
  const txt = (v, def = '') => v == null ? def : String(v).replace(/</g, '‹').replace(/>/g, '›').replace(/\r\n?/g, '\n').trim();
  // Texto que acaba en atributos o claves: además sin comillas ni barras
  const tag = v => txt(v).replace(/["'`\\]/g, '').replace(/\s+/g, ' ');
  const arr = v => Array.isArray(v) ? v : v == null || v === '' ? [] : [v];
  const num = (v, def = 0) => { const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10); return Number.isFinite(n) ? n : def; };

  // Placeholder para comandos sin imágenes (SVG con el emoji)
  const ph = (icon, name) => {
    const ini = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const label = icon && [...icon].length <= 3 ? icon : ini;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='14' fill='#1c1c1c'/><rect x='3' y='3' width='94' height='94' rx='12' fill='none' stroke='#E8490F' stroke-width='3'/><text x='50' y='54' font-size='48' text-anchor='middle' dominant-baseline='middle' fill='#E8490F' font-family='sans-serif' font-weight='700'>${label.replace(/[<>&'"]/g, '')}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  };

  // ── Lectura tolerante del texto que devuelve la IA ─────────
  function parse(text) {
    let s = String(text || '').replace(/^﻿/, '').trim();
    const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) s = fence[1].trim();
    const a = s.indexOf('{'), b = s.lastIndexOf('}');
    if (a < 0 || b < a) throw new Error('No se encuentra ningún objeto JSON en el texto.');
    s = s.slice(a, b + 1);
    try { return JSON.parse(s); } catch (e1) {
      // arreglos típicos: comas finales y comillas tipográficas fuera de cadenas
      const fixed = s.replace(/,\s*([}\]])/g, '$1');
      try { return JSON.parse(fixed); } catch {
        const m = String(e1.message).match(/position (\d+)/);
        let where = '';
        if (m) { const p = +m[1], line = s.slice(0, p).split('\n').length; where = ` (línea ${line}: «${s.slice(Math.max(0, p - 30), p + 30).replace(/\s+/g, ' ')}»)`; }
        throw new Error('El JSON no es válido' + where + '. Pide a la IA que lo revise y lo devuelva completo.');
      }
    }
  }

  // ── Normaliza y valida un paquete → { f, errors, warnings } ──
  function normalize(raw) {
    const errors = [], warnings = [];
    if (raw && raw.schema && raw.schema !== SCHEMA) warnings.push(`Formato «${raw.schema}» desconocido; se intentará leer igualmente.`);
    const src = raw && (raw.comando || raw.faction || raw.kill_team || raw);
    if (!src || typeof src !== 'object' || Array.isArray(src)) return { f: null, errors: ['El archivo no contiene un comando.'], warnings };

    const f = {};
    f.name = txt(src.name || src.nombre);
    if (!f.name) errors.push('Falta el nombre del comando («name»).');
    f.id = slug(src.id || f.name) || 'comando-' + Date.now().toString(36);
    f.subfaction = txt(src.subfaction || src.faccion, '');
    f.icon = txt(src.icon, '') .slice(0, 8) || '⚔';
    f.desc = txt(src.desc || src.descripcion, '');
    f.tags = arr(src.tags).map(tag).filter(Boolean).slice(0, 6);
    f.version = txt(src.version, '');
    f.source = txt(src.source, '');

    // Operativos
    const seenOp = new Set();
    f.ops = arr(src.ops || src.operativos).map((o, i) => {
      const where = `Operativo ${i + 1}${o && o.name ? ` («${txt(o.name)}»)` : ''}`;
      if (!o || typeof o !== 'object') { errors.push(`${where}: formato no válido.`); return null; }
      const op = { name: txt(o.name) };
      if (!op.name) errors.push(`${where}: falta el nombre.`);
      let id = slug(o.id || op.name) || 'op-' + i;
      while (seenOp.has(id)) id += '-' + i;
      seenOp.add(id); op.id = id;
      op.type = tag(o.type || op.name).toUpperCase();
      op.img = '';
      const s = o.s || o.stats || {};
      op.s = { lpa: num(s.lpa ?? s.apl, 2), mov: txt(s.mov ?? s.move, '6"'), salv: txt(s.salv ?? s.save, '4+'), h: num(s.h ?? s.wounds, 8) };
      if (!/\d/.test(String(s.lpa ?? s.apl ?? '')) || !/\d/.test(String(s.h ?? s.wounds ?? ''))) warnings.push(`${where}: atributos incompletos (LPA/Heridas); revisa los valores.`);
      if (!/"$/.test(op.s.mov)) op.s.mov = op.s.mov.replace(/[^\d]/g, '') + '"';
      if (!/\+$/.test(op.s.salv)) op.s.salv = op.s.salv.replace(/[^\d]/g, '') + '+';
      op.kw = arr(o.kw || o.keywords).map(k => tag(k).toUpperCase()).filter(Boolean);
      op.w = arr(o.w || o.weapons).map((w, j) => {
        if (!w || !w.n && !w.name) { warnings.push(`${where}: arma ${j + 1} sin nombre, se omite.`); return null; }
        let r = w.r ?? w.rules ?? [];
        if (typeof r === 'string') r = r.split(/,(?![^(]*\))/);
        r = r.map(x => txt(x)).filter(x => x && x !== '-' && x !== '—');
        const i2 = txt(w.i ?? w.hit, '4+');
        return { n: txt(w.n || w.name), a: num(w.a ?? w.atk, 4), i: /\+$/.test(i2) ? i2 : i2.replace(/[^\d]/g, '') + '+', d: txt(w.d ?? w.dmg, '3/4').replace(/\s+/g, ''), r };
      }).filter(Boolean);
      if (!op.w.length) warnings.push(`${where}: no tiene armas.`);
      op.ru = arr(o.ru || o.rules || o.abilities).map(r => {
        if (!r || !(r.n || r.name)) return null;
        const n = txt(r.n || r.name), out = { n, t: txt(r.t || r.text) };
        if (r.isAct || /\(\s*\d\s*PA\s*\)/i.test(n)) out.isAct = true;
        return out;
      }).filter(Boolean);
      return op;
    }).filter(Boolean);
    if (!f.ops.length) errors.push('No hay operativos («ops»).');
    if (f.ops.length > 40) errors.push('Demasiados operativos (máx. 40).');

    // Reglas de facción
    let frs = arr(src.frs || src.reglas);
    if (!frs.length && src.fr) frs = [src.fr, ...arr(src.fr.orders).map(o => ({ name: o.n, text: o.t }))];
    f.frs = frs.map(r => r && (r.name || r.n) ? { name: txt(r.name || r.n), text: txt(r.text || r.t), subs: arr(r.subs).filter(x => x && (x.n || x.name)).map(x => ({ n: txt(x.n || x.name), t: txt(x.t || x.text) })) } : null).filter(Boolean);
    if (!f.frs.length) warnings.push('No hay reglas de facción («frs»).');

    // Ardides y equipo
    const pl = src.pl || src.ardides || {};
    const ploys = list => arr(list).map(p => p && (p.n || p.name) ? { n: txt(p.n || p.name), t: txt(p.t || p.text) } : null).filter(Boolean);
    f.pl = { s: ploys(pl.s || pl.estrategia || pl.strategy), f: ploys(pl.f || pl.tiroteo || pl.firefight) };
    if (!f.pl.s.length && !f.pl.f.length) warnings.push('No hay ardides («pl»).');
    f.eq = arr(src.eq || src.equipo).map(e => e && (e.n || e.name) ? { n: txt(e.n || e.name), t: txt(e.t || e.text) } : null).filter(Boolean);
    if (!f.eq.length) warnings.push('No hay equipo de facción («eq»).');
    f.er = arr(src.er).map(v => v && arr(v.ee).length ? { v: txt(v.v, 'Erratas'), ee: arr(v.ee).map(e => ({ s: txt(e.s), t: txt(e.t) })) } : null).filter(Boolean);

    // Composición del comando (constructor)
    const R = src.roster;
    if (R && typeof R === 'object') {
      const types = new Set(f.ops.map(o => o.type));
      const known = t => t === 'ARDID_0PM' || types.has(t);
      const loadouts = l => arr(l).filter(x => x && x.label).map(x => ({ label: txt(x.label), w: arr(x.w).filter(y => y && y.n).map(y => ({ n: txt(y.n) })) }));
      const ro = { archetypes: arr(R.archetypes).map(tag).filter(Boolean) };
      ro.required = arr(R.required).map(e => {
        if (!e || !e.type) return null;
        const t = tag(e.type).toUpperCase();
        if (!known(t)) warnings.push(`Composición: el obligatorio «${t}» no coincide con el «type» de ningún operativo.`);
        const out = { type: t, count: Math.max(1, num(e.count, 1)) };
        const lo = loadouts(e.loadouts); if (lo.length) out.loadouts = lo;
        return out;
      }).filter(Boolean);
      const P = R.pool || {};
      const keys = new Set();
      ro.pool = { slots: Math.max(0, num(P.slots, 0)), note: txt(P.note, ''), entries: arr(P.entries).map(e => {
        if (!e || !e.type) return null;
        const t = tag(e.type).toUpperCase();
        if (!known(t)) warnings.push(`Composición: «${t}» no coincide con el «type» de ningún operativo.`);
        const out = { type: t, max: e.max == null || e.max === '' ? null : Math.max(0, num(e.max, 1)) };
        if (e.key) { let k = slug(e.key) || slug(t); while (keys.has(k)) k += 'x'; keys.add(k); out.key = k; }
        else if (keys.has(t)) { const k = slug(t + '-' + (e.label || keys.size)); keys.add(k); out.key = k; }
        else keys.add(t);
        if (e.label) out.label = txt(e.label);
        if (e.half) out.half = true;
        if (e.cost != null && Number.isFinite(+e.cost)) out.cost = +e.cost;
        if (e.note) out.note = txt(e.note);
        const lo = loadouts(e.loadouts); if (lo.length) out.loadouts = lo;
        return out;
      }).filter(Boolean) };
      if (!ro.pool.slots) warnings.push('Composición: «pool.slots» (plazas a elegir) es 0.');
      ro.constraints = arr(R.constraints).map(c => {
        if (!c || (c.min == null && c.max == null)) return null;
        const out = {};
        if (c.types) out.types = arr(c.types).map(t => tag(t).toUpperCase());
        if (c.keys) out.keys = arr(c.keys).map(k => 'pool_' + slug(String(k).replace(/^pool_/, '')));
        if (c.match) { try { new RegExp(c.match, 'i'); out.match = String(c.match); } catch { warnings.push('Composición: una restricción tiene un patrón no válido; se ignora.'); } }
        if (c.min != null) out.min = num(c.min); if (c.max != null) out.max = num(c.max);
        out.label = txt(c.label, ''); out.msg = txt(c.msg, out.label || 'Restricción de composición no cumplida.');
        return out;
      }).filter(Boolean);
      const E = R.equipment || {};
      ro.equipment = { slots: Math.max(1, num(E.slots, 4)), universal: (arr(E.universal).length ? arr(E.universal).map(slug) : UNIVERSAL_IDS).filter(id => UNIVERSAL_IDS.includes(id)) };
      f.roster = ro;
    } else warnings.push('Sin reglas de composición («roster»): se verá en la biblioteca y en la partida, pero no en el constructor.');

    arr(src.dudas).forEach(d => { const s = txt(d); if (s) warnings.push('La IA indica: ' + s); });
    f.img = ph(f.icon, f.name);
    return { f, errors, warnings };
  }

  // ── Registro en FACTIONS ──────────────────────────────────
  function register(f, meta = {}) {
    if (typeof FACTIONS === 'undefined' || !f || !f.id) return;
    if (FACTIONS[f.id] && !FACTIONS[f.id]._user && !BUILTIN[f.id]) BUILTIN[f.id] = FACTIONS[f.id];
    FACTIONS[f.id] = Object.assign(f, { _user: true, _recv: !!meta.recv, _added: meta.added || Date.now() });
  }
  function unregister(id) {
    if (typeof FACTIONS === 'undefined') return;
    if (BUILTIN[id]) { FACTIONS[id] = BUILTIN[id]; delete BUILTIN[id]; } else delete FACTIONS[id];
  }
  const clean = f => { const o = { ...f }; delete o._user; delete o._recv; delete o._added; return o; };

  const KTC = window.KTC = {
    SCHEMA, parse, normalize, slug,
    list: read,
    isBuiltin: id => !!BUILTIN[id],
    builtinName: id => BUILTIN[id]?.name || (typeof FACTIONS !== 'undefined' && FACTIONS[id] && !FACTIONS[id]._user ? FACTIONS[id].name : null),
    // Guarda (o sustituye) un comando ya normalizado
    save(f, meta = {}) {
      const list = read().filter(x => x.f.id !== f.id);
      const rec = { f: clean(f), added: Date.now(), recv: !!meta.recv };
      list.push(rec);
      if (!write(list)) throw new Error('No queda espacio en este dispositivo para guardar el comando.');
      register(JSON.parse(JSON.stringify(rec.f)), rec);
      return rec;
    },
    remove(id) { write(read().filter(x => x.f.id !== id)); unregister(id); },
    // Paquete para compartir / reimportar
    pack: f => ({ schema: SCHEMA, comando: clean(f) }),
    // Archivo js/data/<id>.js para añadirlo al repositorio
    toJs(f) {
      const o = clean(f); o.img = 'imagenes/' + o.id + '.webp';
      return `// ============================================================\n//  data/${o.id}.js — ${o.name}\n//  Importado desde un paquete kt-comando/1${o.source ? ' · ' + o.source : ''}\n//  Añade <script src="js/data/${o.id}.js"></script> en index.html,\n//  builder.html, partida.html e historial.html.\n// ============================================================\n\nFACTIONS[${JSON.stringify(o.id)}] = ${JSON.stringify(o, null, 2)};\n`;
    },
    // Comando recibido del otro dispositivo en una partida a dos
    receive(f) {
      if (!f || !f.id) return false;
      const cur = typeof FACTIONS !== 'undefined' && FACTIONS[f.id];
      if (cur && JSON.stringify(clean(cur)) === JSON.stringify(clean(f))) return false;
      const { f: n, errors } = normalize({ schema: SCHEMA, comando: f });
      if (errors.length || !n) return false;
      n.id = f.id;
      const mine = read().find(x => x.f.id === f.id && !x.recv);
      if (mine) { register(n, { recv: true }); return true; }   // no pisar el mío guardado: solo en memoria
      KTC.save(n, { recv: true });
      return true;
    },
  };

  // Al cargar: registra los guardados
  read().forEach(rec => { try { register(JSON.parse(JSON.stringify(rec.f)), rec); } catch {} });
})();
