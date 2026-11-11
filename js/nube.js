// ============================================================
//  nube.js — Cuentas, sincronización, búsqueda de jugadores,
//  invitaciones y comunidad sobre Supabase.
//  Solo se activa si js/config.js tiene url y key. Sin ellos, KT.nube.on
//  es false y la app funciona como siempre, sin servidor.
//  Tablas y permisos: herramientas/supabase/esquema.sql.
//  Expone KT.nube. Emite `kt:nube` cuando cambia la sesión.
// ============================================================
(function () {
  const CFG = window.KT_NUBE || {};
  const ROOT = (document.currentScript?.src || '').replace(/js\/nube\.js.*$/, '');
  const fire = () => document.dispatchEvent(new CustomEvent('kt:nube'));
  const fail = (error, msg) => { if (error) throw new Error(tr(error.message || String(error), msg)); };
  // mensajes habituales del servidor, en español
  const tr = (m, fallback) => {
    const t = [[/invalid login credentials/i, 'Correo o contraseña incorrectos'], [/already registered|already been registered/i, 'Ya existe una cuenta con ese correo'],
      [/password should be at least/i, 'La contraseña es demasiado corta (mínimo 6 caracteres)'], [/email not confirmed/i, 'Confirma tu correo antes de entrar (mira tu bandeja de entrada)'],
      [/perfiles_nombre_uq|duplicate key/i, 'Ese nombre ya está cogido: prueba con otro'], [/failed to fetch|networkerror|load failed/i, 'Sin conexión con el servidor'],
      [/rate limit/i, 'Demasiados intentos: espera un momento'], [/database error saving new user/i, 'Ese nombre de usuario ya está cogido'],
      [/should be different|same password/i, 'La nueva contraseña tiene que ser distinta de la anterior'], [/unable to validate email|invalid format|email address .*invalid/i, 'Ese correo no es válido'],
      [/signups? not allowed|signup.*disabled/i, 'El registro está desactivado en el servidor'], [/weak password|password is known/i, 'Esa contraseña es demasiado fácil: usa una más larga'], [/row-level security/i, 'No tienes permiso para hacer eso']].find(([re]) => re.test(m));
    return t ? t[1] : (fallback ? fallback + ': ' : '') + m;
  };
  let sb = null, loading = null, session = null, perfil = null;
  // Enlace del correo de «recuperar contraseña»: llega con #...type=recovery
  let recovery = /type=recovery/.test(location.hash) || sessionStorage.getItem('kt.recuperar') === '1';
  if (recovery) sessionStorage.setItem('kt.recuperar', '1');
  const back = page => new URL(page, ROOT || location.href).href;   // dirección a la que vuelven los enlaces de los correos

  function loadLib() {
    if (window.supabase?.createClient) return Promise.resolve();
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = ROOT + 'js/vendor/supabase.js'; s.onload = res; s.onerror = () => rej(new Error('No se pudo cargar la biblioteca del servidor')); document.head.appendChild(s); });
  }
  const uid = () => session?.user?.id || null;
  const need = () => { if (!uid()) throw new Error('Inicia sesión primero'); return uid(); };

  const N = KT.nube = {
    on: !!(CFG.url && CFG.key),
    get user() { return session?.user || null; },
    get perfil() { return perfil; },
    get email() { return session?.user?.email || ''; },
    get recovery() { return recovery && !!session; },
    // Conecta y recupera la sesión guardada (una sola vez por página)
    ready() {
      if (!N.on) return Promise.resolve(false);
      return loading || (loading = (async () => {
        await loadLib();
        sb = window.supabase.createClient(CFG.url, CFG.key);
        const { data } = await sb.auth.getSession();
        session = data?.session || null;
        if (session) await ensurePerfil().catch(() => {});
        sb.auth.onAuthStateChange?.((e, s) => {
          const was = uid(); session = s || null; if (!session) perfil = null;
          if (e === 'PASSWORD_RECOVERY') { recovery = true; sessionStorage.setItem('kt.recuperar', '1'); }
          if (was !== uid() || e === 'PASSWORD_RECOVERY') fire();
        });
        if (session && /access_token=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
        if (session) linkLocal();
        return true;
      })());
    },

    // ── Cuenta ───────────────────────────────────────────────
    async registrar(email, pass, nombre) {
      await N.ready();
      nombre = String(nombre || '').trim();
      if (nombre.length < 2 || nombre.length > 24) throw new Error('El nombre debe tener entre 2 y 24 caracteres');
      if (!(await N.nombreLibre(nombre))) throw new Error('Ese nombre de usuario ya está cogido');
      const { data, error } = await sb.auth.signUp({ email: String(email).trim(), password: pass, options: { data: { nombre }, emailRedirectTo: back('index.html') } });
      fail(error);
      session = data.session || null;
      if (!session) return { confirmar: true };             // el proyecto exige confirmar el correo
      await ensurePerfil(nombre); linkLocal(); fire();
      return { confirmar: false };
    },
    async entrar(email, pass) {
      await N.ready();
      const { data, error } = await sb.auth.signInWithPassword({ email: String(email).trim(), password: pass });
      fail(error);
      session = data.session;
      await ensurePerfil(); linkLocal(); fire();
    },
    async salir() { await N.ready(); await sb.auth.signOut(); session = null; perfil = null; recovery = false; sessionStorage.removeItem('kt.recuperar'); fire(); },
    async recuperar(email) { await N.ready(); const { error } = await sb.auth.resetPasswordForEmail(String(email).trim(), { redirectTo: back('index.html') }); fail(error); },
    async nombreLibre(nombre) {
      await N.ready();
      const { data, error } = await sb.rpc('nombre_libre', { n: String(nombre || '').trim() });
      if (error) return true;            // servidor sin la función: lo comprobará el registro
      return data !== false;
    },
    async nuevaClave(pass) {
      need();
      const { error } = await sb.auth.updateUser({ password: pass }); fail(error);
      recovery = false; sessionStorage.removeItem('kt.recuperar'); fire();
    },
    async cambiarCorreo(email) {
      need();
      const { error } = await sb.auth.updateUser({ email: String(email).trim() }, { emailRedirectTo: back('index.html') }); fail(error);
    },
    async cambiarNombre(nombre) {
      const me = need(); nombre = String(nombre || '').trim();
      if (nombre.length < 2 || nombre.length > 24) throw new Error('El nombre debe tener entre 2 y 24 caracteres');
      if (KT.norm(nombre) !== KT.norm(perfil?.nombre || '') && !(await N.nombreLibre(nombre))) throw new Error('Ese nombre de usuario ya está cogido');
      const { error } = await sb.from('perfiles').update({ nombre }).eq('id', me); fail(error);
      await sb.auth.updateUser({ data: { nombre } }).catch(() => {});
      perfil = { ...perfil, nombre };
      const l = KT.user?.list() || [], u = l.find(x => x.nube === me);
      if (u) { u.name = nombre; KT.store.set('usuarios', l); document.dispatchEvent(new CustomEvent('kt:user')); }
      fire();
    },
    // Borra la cuenta y todo lo que hay en el servidor. Lo de este dispositivo se queda.
    async borrarCuenta() {
      const me = need();
      const { data: files } = await sb.storage.from('imagenes').list(me, { limit: 1000 });
      if (files?.length) await sb.storage.from('imagenes').remove(files.map(f => me + '/' + f.name)).catch(() => {});
      const { error } = await sb.rpc('borrar_cuenta'); fail(error, 'No se pudo borrar la cuenta');
      const l = KT.user?.list() || [], u = l.find(x => x.nube === me);
      if (u) { delete u.nube; KT.store.set('usuarios', l); }
      KT.store.del('nube.sync'); KT.store.del('nube.vistas');
      await sb.auth.signOut().catch(() => {}); session = null; perfil = null; fire();
    },

    // ── Sincronización de bandas e historial ─────────────────
    // Gana la versión más reciente. Las bandas borradas aquí se marcan como borradas en la nube.
    async sync() {
      const me = need(), loc = linkLocal();
      const out = { subidas: 0, bajadas: 0, borradas: 0, partidas: 0 };
      const { data: cloud, error } = await sb.from('bandas').select('id,nombre,comando,datos,borrada,actualizado').eq('usuario', me);
      fail(error, 'No se pudieron leer las bandas');
      let all = KT.store.get('rosters', []) || [];
      const seen = new Set(KT.store.get('nube.vistas', []) || []);
      const mine = () => all.filter(r => r.owner === loc.id);
      const up = [];
      (cloud || []).forEach(c => {
        const l = all.find(r => r.id === c.id), ct = Date.parse(c.actualizado) || 0, lt = l ? Date.parse(l.updated) || 0 : 0;
        if (c.borrada) { if (l && l.owner === loc.id && lt <= ct) { all = all.filter(r => r.id !== c.id); out.borradas++; } return; }
        if (!l) {
          if (seen.has(c.id)) { up.push({ id: c.id, usuario: me, nombre: c.nombre, comando: c.comando, datos: c.datos, borrada: true, actualizado: new Date().toISOString() }); out.borradas++; }   // borrada en este dispositivo
          else { all.unshift({ ...c.datos, id: c.id, owner: loc.id, updated: c.actualizado }); out.bajadas++; }
        } else if (l.owner === loc.id && ct > lt) { all[all.indexOf(l)] = { ...c.datos, id: c.id, owner: loc.id, updated: c.actualizado }; out.bajadas++; }
      });
      mine().forEach(l => {
        const c = (cloud || []).find(x => x.id === l.id), lt = Date.parse(l.updated) || 0;
        if (!c || (!c.borrada && lt > (Date.parse(c.actualizado) || 0)) || (c.borrada && lt > (Date.parse(c.actualizado) || 0))) {
          const datos = { ...l }; delete datos.owner;
          up.push({ id: l.id, usuario: me, nombre: l.name, comando: l.factionId, datos, borrada: false, actualizado: l.updated || new Date().toISOString() }); out.subidas++;
        }
      });
      if (up.length) { const r = await sb.from('bandas').upsert(up, { onConflict: 'usuario,id' }); fail(r.error, 'No se pudieron subir las bandas'); }
      KT.store.set('rosters', all);
      KT.store.set('nube.vistas', mine().map(r => r.id));
      // historial: se unen las partidas de la nube y las de este dispositivo
      const H = KT.store.get('historial', []) || [];
      const { data: cg, error: e2 } = await sb.from('partidas').select('id,fecha,datos').eq('usuario', me);
      fail(e2, 'No se pudo leer el historial');
      const have = new Set(H.map(r => r.id)), inCloud = new Set((cg || []).map(r => r.id));
      const pull = (cg || []).filter(r => !have.has(r.id)).map(r => r.datos);
      const push = H.filter(r => !inCloud.has(r.id) || r.date > ((cg || []).find(x => x.id === r.id)?.fecha || '')).map(r => ({ id: r.id, usuario: me, fecha: r.date, datos: r }));
      if (push.length) { const r = await sb.from('partidas').upsert(push, { onConflict: 'usuario,id' }); fail(r.error, 'No se pudo subir el historial'); }
      if (pull.length) KT.store.set('historial', [...H, ...pull].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 300));
      out.partidas = push.length + pull.length;
      KT.store.set('nube.sync', new Date().toISOString());
      document.dispatchEvent(new CustomEvent('kt:user'));
      return out;
    },

    // ── Jugadores e invitaciones ─────────────────────────────
    async buscar(q) {
      const me = need(); q = String(q || '').trim().replace(/[%_,()]/g, '');
      if (q.length < 2) return [];
      const { data, error } = await sb.from('perfiles').select('id,nombre').ilike('nombre', '%' + q + '%').neq('id', me).order('nombre').limit(12);
      fail(error, 'No se pudo buscar');
      return data || [];
    },
    async nombres(ids) {
      ids = [...new Set(ids.filter(Boolean))]; if (!ids.length) return {};
      const { data, error } = await sb.from('perfiles').select('id,nombre').in('id', ids);
      fail(error);
      return Object.fromEntries((data || []).map(p => [p.id, p.nombre]));
    },
    async invitar(para, { mensaje, cuando, enlace } = {}) {
      const me = need();
      const { error } = await sb.from('invitaciones').insert({ de: me, para, mensaje: (mensaje || '').slice(0, 300) || null, cuando: cuando || null, enlace: (enlace || '').slice(0, 500) || null });
      fail(error, 'No se pudo enviar la invitación');
    },
    async invitaciones() {
      const me = need();
      const { data, error } = await sb.from('invitaciones').select('id,de,para,mensaje,cuando,enlace,estado,creado').or(`de.eq.${me},para.eq.${me}`).order('creado', { ascending: false }).limit(40);
      fail(error, 'No se pudieron leer las invitaciones');
      const nm = await N.nombres((data || []).flatMap(i => [i.de, i.para]));
      return (data || []).map(i => ({ ...i, mia: i.de === me, deNombre: nm[i.de] || '¿?', paraNombre: nm[i.para] || '¿?' }));
    },
    async responder(id, estado) { need(); const { error } = await sb.from('invitaciones').update({ estado }).eq('id', id); fail(error); },
    async borrarInvitacion(id) { need(); const { error } = await sb.from('invitaciones').delete().eq('id', id); fail(error); },

    // ── Grupos (comunidad) ───────────────────────────────────
    async grupos() {
      need();
      const { data, error } = await sb.from('grupos').select('id,nombre,codigo,creador,creado').order('creado');
      fail(error, 'No se pudieron leer los grupos');
      return data || [];
    },
    async crearGrupo(nombre) { need(); const { data, error } = await sb.rpc('crear_grupo', { n: String(nombre).trim() }); fail(error, 'No se pudo crear el grupo'); return Array.isArray(data) ? data[0] : data; },
    async unirse(codigo) { need(); const { data, error } = await sb.rpc('unirse_grupo', { c: String(codigo).trim() }); fail(error); return data; },
    async salirGrupo(grupo) { const me = need(); const { error } = await sb.from('miembros').delete().eq('grupo', grupo).eq('usuario', me); fail(error); },
    async borrarGrupo(grupo) { need(); const { error } = await sb.from('grupos').delete().eq('id', grupo); fail(error); },
    async miembros(grupo) {
      need();
      const { data, error } = await sb.from('miembros').select('usuario,rol,desde').eq('grupo', grupo).order('desde');
      fail(error);
      const nm = await N.nombres((data || []).map(m => m.usuario));
      return (data || []).map(m => ({ ...m, nombre: nm[m.usuario] || '¿?' }));
    },
    async publicaciones(grupo, limit = 60) {
      need();
      const { data, error } = await sb.from('publicaciones').select('id,usuario,tipo,texto,datos,imagen,creado').eq('grupo', grupo).order('creado', { ascending: false }).limit(limit);
      fail(error, 'No se pudo leer el grupo');
      const nm = await N.nombres((data || []).map(p => p.usuario));
      return (data || []).map(p => ({ ...p, nombre: nm[p.usuario] || '¿?', mia: p.usuario === uid(), url: p.imagen ? sb.storage.from('imagenes').getPublicUrl(p.imagen).data.publicUrl : null }));
    },
    // pub: { tipo, texto, datos, file } — la imagen se reduce antes de subirla
    async publicar(grupo, pub) {
      const me = need();
      let imagen = null;
      if (pub.file) {
        const blob = await shrink(pub.file);
        imagen = `${me}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.jpg`;
        const up = await sb.storage.from('imagenes').upload(imagen, blob, { contentType: 'image/jpeg', upsert: false });
        fail(up.error, 'No se pudo subir la imagen');
      }
      const { error } = await sb.from('publicaciones').insert({ grupo, usuario: me, tipo: pub.tipo, texto: (pub.texto || '').slice(0, 600) || null, datos: pub.datos || null, imagen });
      if (error && imagen) await sb.storage.from('imagenes').remove([imagen]).catch(() => {});
      fail(error, 'No se pudo publicar');
    },
    async borrarPublicacion(p) {
      need();
      const { error } = await sb.from('publicaciones').delete().eq('id', p.id); fail(error);
      if (p.imagen && p.mia) await sb.storage.from('imagenes').remove([p.imagen]).catch(() => {});
    },
  };

  // Perfil público: se crea al registrarse (o en el primer inicio si hubo que confirmar el correo)
  async function ensurePerfil(nombre) {
    const me = uid(); if (!me) return null;
    const { data } = await sb.from('perfiles').select('id,nombre').eq('id', me).maybeSingle();
    if (data) return (perfil = data);
    const n = nombre || session.user.user_metadata?.nombre || (session.user.email || 'jugador').split('@')[0].slice(0, 24);
    let nn = n, k = 1, r;
    while ((r = await sb.from('perfiles').insert({ id: me, nombre: nn })).error && /duplicate|perfiles_nombre_uq/i.test(r.error.message) && k < 6) nn = n.slice(0, 20) + ' ' + (++k);
    fail(r.error);
    return (perfil = { id: me, nombre: nn });
  }
  // La cuenta se enlaza con un usuario local de este dispositivo (mismo nombre): sus bandas son las que se sincronizan
  function linkLocal() {
    if (!perfil || !KT.user) return null;
    const list = KT.user.list();
    let u = list.find(x => x.nube === perfil.id) || list.find(x => !x.nube && KT.norm(x.name) === KT.norm(perfil.nombre));
    if (!u) u = KT.user.add(uniqueName(perfil.nombre, list));
    if (u.nube !== perfil.id) { const l = KT.user.list(); const x = l.find(y => y.id === u.id); x.nube = perfil.id; KT.store.set('usuarios', l); u = x; }
    if (KT.user.current()?.id !== u.id) KT.user.login(u.id);
    return u;
  }
  const uniqueName = (n, list) => { let k = 1, v = n; while (list.some(x => KT.norm(x.name) === KT.norm(v))) v = n.slice(0, 20) + ' ' + (++k); return v; };

  // Reduce la imagen a 1600 px de lado como máximo y la convierte a JPEG
  async function shrink(file, max = 1600) {
    if (!/^image\//.test(file.type)) throw new Error('El archivo no es una imagen');
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('No se pudo leer la imagen')); i.src = URL.createObjectURL(file); });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.85));
    if (!blob) throw new Error('No se pudo preparar la imagen');
    return blob;
  }
})();
