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
      [/signups? not allowed|signup.*disabled/i, 'El registro está desactivado en el servidor'], [/weak password|password is known/i, 'Esa contraseña es demasiado fácil: usa una más larga'], [/row-level security/i, 'No tienes permiso para hacer eso'],
      [/column .* does not exist|could not find the|schema cache|function .* does not exist/i, 'Falta actualizar el servidor: vuelve a ejecutar esquema.sql en Supabase']].find(([re]) => re.test(m));
    return t ? t[1] : (fallback ? fallback + ': ' : '') + m;
  };
  let sb = null, loading = null, session = null, perfil = null;
  const fotos = {};   // id de usuario → ruta de su foto (de las consultas de nombres)
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
    // Avatar redondo: foto si la hay, si no la inicial del nombre
    avatar(nombre, x, cls = '') {
      const u = N.foto(x), e = KT.esc;
      return u ? `<img class="av ${cls}" src="${e(u)}" alt="" loading="lazy">` : `<span class="av ${cls}">${e(String(nombre || '?').trim().slice(0, 1).toUpperCase())}</span>`;
    },
    get esAdmin() { return perfil?.rol === 'admin'; },
    // URL pública de una foto de perfil (ruta en «imagenes») o de la foto de un usuario ya visto
    foto(x) { const path = x && x.includes('/') ? x : fotos[x] ?? (x === perfil?.id ? perfil?.avatar : null); return path && sb ? sb.storage.from('imagenes').getPublicUrl(path).data.publicUrl : null; },
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
        if (session) { linkLocal(); fire(); }
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
    // ── Foto de perfil (opcional) ────────────────────────────
    async subirFoto(file) {
      const me = need();
      const blob = await square(file, 320);
      const path = `${me}/avatar-${Date.now().toString(36)}.jpg`;
      const up = await sb.storage.from('imagenes').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      fail(up.error, 'No se pudo subir la foto');
      const old = perfil?.avatar;
      const { error } = await sb.from('perfiles').update({ avatar: path }).eq('id', me);
      if (error) { await sb.storage.from('imagenes').remove([path]).catch(() => {}); fail(error, 'No se pudo guardar la foto'); }
      if (old) await sb.storage.from('imagenes').remove([old]).catch(() => {});
      perfil = { ...perfil, avatar: path }; fotos[me] = path; fire();
    },
    async quitarFoto() {
      const me = need(), old = perfil?.avatar; if (!old) return;
      const { error } = await sb.from('perfiles').update({ avatar: null }).eq('id', me); fail(error);
      await sb.storage.from('imagenes').remove([old]).catch(() => {});
      perfil = { ...perfil, avatar: null }; fotos[me] = null; fire();
    },

    // ── Administración (solo rol admin; el servidor lo vuelve a comprobar) ──
    async adminCuentas() { need(); const { data, error } = await sb.rpc('admin_cuentas'); fail(error, 'No se pudieron leer las cuentas'); return data || []; },
    async adminGrupos() { need(); const { data, error } = await sb.rpc('admin_grupos'); fail(error, 'No se pudieron leer los grupos'); return data || []; },
    async adminEditar(id, nombre, rol) {
      need(); nombre = String(nombre || '').trim();
      if (nombre.length < 2 || nombre.length > 24) throw new Error('El nombre debe tener entre 2 y 24 caracteres');
      const { error } = await sb.rpc('admin_editar', { u: id, n: nombre, r: rol }); fail(error, 'No se pudo guardar');
      if (id === uid()) perfil = { ...perfil, nombre, rol };
    },
    async adminQuitarFoto(c) {
      need(); const { error } = await sb.rpc('admin_quitar_foto', { u: c.id }); fail(error);
      if (c.avatar) await sb.storage.from('imagenes').remove([c.avatar]).catch(() => {});
    },
    async adminBorrar(id) { need(); const { error } = await sb.rpc('admin_borrar', { u: id }); fail(error, 'No se pudo borrar la cuenta'); },
    async adminClave(email) { const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: back('index.html') }); fail(error); },

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
      const { data, error } = await sb.from('perfiles').select('id,nombre,avatar').ilike('nombre', '%' + q + '%').neq('id', me).order('nombre').limit(12);
      fail(error, 'No se pudo buscar');
      (data || []).forEach(p => { fotos[p.id] = p.avatar || null; });
      return data || [];
    },
    async nombres(ids) {
      ids = [...new Set(ids.filter(Boolean))]; if (!ids.length) return {};
      const { data, error } = await sb.from('perfiles').select('id,nombre,avatar').in('id', ids);
      fail(error);
      (data || []).forEach(p => { fotos[p.id] = p.avatar || null; });
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

    // ── Comunidades ──────────────────────────────────────────
    // Cada comunidad lleva `rol`: 'fundador' | 'admin' | 'miembro' | 'externo' (administrador de la app que no es miembro)
    async grupos() {
      const me = need();
      // «miembros» solo deja ver los de las comunidades propias: sirve para contar cuántos hay en cada una
      const [g, m] = await Promise.all([
        sb.from('grupos').select('*').order('creado'),
        sb.from('miembros').select('grupo,usuario,rol'),
      ]);
      fail(g.error, 'No se pudieron leer las comunidades');
      const mine = {}, n = {}; (m.data || []).forEach(x => { n[x.grupo] = (n[x.grupo] || 0) + 1; if (x.usuario === me) mine[x.grupo] = x.rol; });
      return (g.data || []).map(x => ({ ...x, rol: x.creador === me ? 'fundador' : mine[x.id] || 'externo', n: n[x.id] || 0 }));
    },
    async crearGrupo(nombre) { need(); const { data, error } = await sb.rpc('crear_grupo', { n: String(nombre).trim() }); fail(error, 'No se pudo crear la comunidad'); return Array.isArray(data) ? data[0] : data; },
    async unirse(codigo) { need(); const { data, error } = await sb.rpc('unirse_grupo', { c: String(codigo).trim() }); fail(error); return data; },
    async salirGrupo(grupo) { const me = need(); const { error } = await sb.from('miembros').delete().eq('grupo', grupo).eq('usuario', me); fail(error); },
    async borrarGrupo(grupo) { need(); const { error } = await sb.from('grupos').delete().eq('id', grupo); fail(error); },
    async editarGrupo(grupo, nombre, descripcion) {
      need(); nombre = String(nombre || '').trim();
      if (nombre.length < 2 || nombre.length > 40) throw new Error('El nombre debe tener entre 2 y 40 caracteres');
      const { error } = await sb.rpc('editar_grupo', { g: grupo, n: nombre, d: String(descripcion || '').trim().slice(0, 300) }); fail(error, 'No se pudo guardar');
    },
    async nuevoCodigo(grupo) { need(); const { data, error } = await sb.rpc('nuevo_codigo', { g: grupo }); fail(error); return data; },
    async cambiarRol(grupo, usuario, rol) { need(); const { error } = await sb.rpc('cambiar_rol', { g: grupo, u: usuario, r: rol }); fail(error); },
    async expulsar(grupo, usuario) { need(); const { error } = await sb.rpc('expulsar', { g: grupo, u: usuario }); fail(error); },
    async miembros(grupo) {
      need();
      const { data, error } = await sb.from('miembros').select('usuario,rol,desde').eq('grupo', grupo).order('desde');
      fail(error);
      const nm = await N.nombres((data || []).map(m => m.usuario));
      return (data || []).map(m => ({ ...m, nombre: nm[m.usuario] || '¿?' }));
    },
    // Tablón: publicaciones principales (sin las fotos que solo van a la galería) con sus respuestas
    async tablon(grupo, limit = 80) {
      need();
      const cols = 'id,usuario,tipo,texto,datos,imagen,creado,fijada,galeria,respuesta_a';
      const { data, error } = await sb.from('publicaciones').select(cols).eq('grupo', grupo).is('respuesta_a', null).eq('galeria', false).order('creado', { ascending: false }).limit(limit);
      fail(error, 'No se pudo leer el tablón');
      const top = data || [];
      let resp = [];
      if (top.length) { const r = await sb.from('publicaciones').select(cols).eq('grupo', grupo).in('respuesta_a', top.map(p => p.id)).order('creado'); fail(r.error); resp = r.data || []; }
      const nm = await N.nombres([...top, ...resp].map(p => p.usuario));
      const dress = p => ({ ...p, nombre: nm[p.usuario] || '¿?', mia: p.usuario === uid(), url: N.foto(p.imagen) });
      return top.map(p => ({ ...dress(p), respuestas: resp.filter(r => r.respuesta_a === p.id).map(dress) }));
    },
    async galeria(grupo, limit = 150) {
      need();
      const { data, error } = await sb.from('publicaciones').select('id,usuario,texto,imagen,creado,galeria').eq('grupo', grupo).not('imagen', 'is', null).order('creado', { ascending: false }).limit(limit);
      fail(error, 'No se pudo leer la galería');
      const nm = await N.nombres((data || []).map(p => p.usuario));
      return (data || []).map(p => ({ ...p, nombre: nm[p.usuario] || '¿?', mia: p.usuario === uid(), url: N.foto(p.imagen) }));
    },
    async resultados(grupo) {
      need();
      const { data, error } = await sb.from('publicaciones').select('id,usuario,datos,creado').eq('grupo', grupo).eq('tipo', 'resultado').order('creado', { ascending: false }).limit(1000);
      fail(error, 'No se pudieron leer los resultados');
      const nm = await N.nombres((data || []).map(p => p.usuario));
      return (data || []).map(p => ({ ...p, tipo: 'resultado', nombre: nm[p.usuario] || '¿?', mia: p.usuario === uid() }));
    },
    // pub: { tipo, texto, datos, file, fijada, galeria, respuesta_a } — la imagen se reduce antes de subirla
    async publicar(grupo, pub) {
      const me = need();
      let imagen = null;
      if (pub.file) {
        const blob = await shrink(pub.file);
        imagen = `${me}/${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.jpg`;
        const up = await sb.storage.from('imagenes').upload(imagen, blob, { contentType: 'image/jpeg', upsert: false });
        fail(up.error, 'No se pudo subir la imagen');
      }
      const row = { grupo, usuario: me, tipo: pub.tipo, texto: (pub.texto || '').slice(0, 1000) || null, datos: pub.datos || null, imagen };
      if (pub.fijada) row.fijada = true;
      if (pub.galeria) row.galeria = true;
      if (pub.respuesta_a) row.respuesta_a = pub.respuesta_a;
      const { error } = await sb.from('publicaciones').insert(row);
      if (error && imagen) await sb.storage.from('imagenes').remove([imagen]).catch(() => {});
      fail(error, 'No se pudo publicar');
    },
    async fijar(id, f) { need(); const { error } = await sb.rpc('fijar_publicacion', { p: id, f: !!f }); fail(error); },
    async borrarPublicacion(p) {
      need();
      if (p.imagen) await sb.storage.from('imagenes').remove([p.imagen]).catch(() => {});   // antes que la fila: el permiso del moderador depende de ella
      const { error } = await sb.from('publicaciones').delete().eq('id', p.id); fail(error);
    },
    // Distinciones: títulos que dan los administradores de la comunidad
    async distinciones(grupo) {
      need();
      const { data, error } = await sb.from('distinciones').select('id,usuario,titulo,tipo,fecha').eq('grupo', grupo).order('fecha', { ascending: false });
      if (error && /does not exist|schema cache/i.test(error.message)) return [];        // servidor sin actualizar
      fail(error); return data || [];
    },
    async darDistincion(grupo, usuario, { titulo, tipo, fecha }) {
      const me = need(); titulo = String(titulo || '').trim();
      if (titulo.length < 2 || titulo.length > 60) throw new Error('El título debe tener entre 2 y 60 caracteres');
      const row = { grupo, usuario, titulo, tipo: tipo || 'torneo', otorgada_por: me }; if (fecha) row.fecha = fecha;
      const { error } = await sb.from('distinciones').insert(row); fail(error, 'No se pudo dar la distinción');
    },
    async quitarDistincion(id) { need(); const { error } = await sb.from('distinciones').delete().eq('id', id); fail(error); },

    // ── Eventos de la comunidad (calendario, ligas y torneos) ──
    // Cada evento vuelve con sus asistencias y sus encuentros (partidas de liga o torneo)
    async eventos(grupo) {
      need();
      const ev = await sb.from('eventos').select('*').eq('grupo', grupo).order('inicio');
      if (ev.error && /does not exist|schema cache|could not find/i.test(ev.error.message)) return [];   // servidor sin actualizar
      fail(ev.error, 'No se pudieron leer los eventos');
      const ids = (ev.data || []).map(e => e.id);
      let as = [], en = [];
      if (ids.length) {
        const [a, b] = await Promise.all([sb.from('asistencias').select('evento,usuario,estado').in('evento', ids), sb.from('encuentros').select('*').in('evento', ids).order('creado')]);
        fail(a.error); fail(b.error); as = a.data || []; en = b.data || [];
      }
      return (ev.data || []).map(e => ({ ...e, asistencias: as.filter(x => x.evento === e.id), encuentros: en.filter(x => x.evento === e.id) }));
    },
    async guardarEvento(grupo, ev, id) {
      const me = need();
      const row = { tipo: ev.tipo, titulo: String(ev.titulo || '').trim(), descripcion: String(ev.descripcion || '').trim().slice(0, 1000) || null, lugar: String(ev.lugar || '').trim().slice(0, 120) || null, inicio: ev.inicio, fin: ev.fin || null };
      if (row.titulo.length < 2 || row.titulo.length > 80) throw new Error('El título debe tener entre 2 y 80 caracteres');
      if (!row.inicio) throw new Error('Pon la fecha del evento');
      if (row.fin && row.fin < row.inicio) throw new Error('La fecha de fin no puede ser anterior al inicio');
      const q = id ? sb.from('eventos').update(row).eq('id', id) : sb.from('eventos').insert({ ...row, grupo, creador: me });
      const { error } = await q; fail(error, 'No se pudo guardar el evento');
    },
    async borrarEvento(id) { need(); const { error } = await sb.from('eventos').delete().eq('id', id); fail(error); },
    // estado: 'voy' | 'quiza' | 'no' | null (quitar)
    async asistir(evento, estado) {
      const me = need();
      const q = estado ? sb.from('asistencias').upsert({ evento, usuario: me, estado, actualizado: new Date().toISOString() }, { onConflict: 'evento,usuario' })
        : sb.from('asistencias').delete().eq('evento', evento).eq('usuario', me);
      const { error } = await q; fail(error);
    },
    async guardarEncuentro(x) {
      need();
      const sc = v => v === '' || v == null ? null : Math.max(0, Math.min(99, parseInt(v, 10) || 0));
      const pa = sc(x.pa), pb = sc(x.pb);
      if ((pa == null) !== (pb == null)) throw new Error('Pon los dos marcadores');
      const q = x.id ? sb.from('encuentros').update({ pa, pb }).eq('id', x.id) : sb.from('encuentros').insert({ evento: x.evento, a: x.a, b: x.b, pa, pb, ronda: x.ronda || null });
      const { error } = await q; fail(error, 'No se pudo guardar la partida');
    },
    async crearEncuentros(rows) { need(); if (!rows.length) return; const { error } = await sb.from('encuentros').insert(rows); fail(error, 'No se pudieron crear los emparejamientos'); },
    async borrarEncuentro(id) { need(); const { error } = await sb.from('encuentros').delete().eq('id', id); fail(error); },
    async cerrarEvento(id, ganador, titulo) { need(); const { error } = await sb.rpc('cerrar_evento', { e: id, g: ganador || null, t: titulo || null }); fail(error); },
    async reabrirEvento(id) { need(); const { error } = await sb.rpc('reabrir_evento', { e: id }); fail(error); },

    // ── Partidas en directo (solo si el jugador lo activa) ────
    async publicarDirecto(grupos, datos, video) {
      const me = need(); if (!grupos.length) return;
      const now = new Date().toISOString();
      const { error } = await sb.from('directos').upsert(grupos.map(g => ({ usuario: me, grupo: g, datos, video: video || null, actualizado: now })), { onConflict: 'usuario,grupo' });
      fail(error, 'No se pudo publicar la partida');
    },
    async quitarDirecto() { const me = need(); const { error } = await sb.from('directos').delete().eq('usuario', me); fail(error); },
    async directos(grupo) {
      need();
      const { data, error } = await sb.from('directos').select('usuario,datos,video,actualizado').eq('grupo', grupo).order('actualizado', { ascending: false });
      if (error && /does not exist|schema cache|could not find/i.test(error.message)) return [];
      fail(error);
      const nm = await N.nombres((data || []).map(x => x.usuario));
      return (data || []).map(x => ({ ...x, nombre: nm[x.usuario] || '¿?', mia: x.usuario === uid() }));
    },

    // ── Campañas compartidas (copia de solo lectura) ──────────
    // list: campañas locales; se suben las que llevan `compartida` y se retiran las que ya no
    async sincronizarCampanas(list) {
      const me = need();
      const mine = await sb.from('campanas').select('id,grupo').eq('usuario', me);
      if (mine.error && /does not exist|schema cache|could not find/i.test(mine.error.message)) throw new Error('Falta actualizar el servidor: vuelve a ejecutar esquema.sql en Supabase');
      fail(mine.error);
      const want = [], now = new Date().toISOString();
      list.forEach(c => (c.compartida || []).forEach(g => { const d = { ...c }; delete d.compartida; delete d.owner; want.push({ usuario: me, id: c.id, grupo: g, nombre: String(c.name || 'Campaña').slice(0, 80), comando: c.factionId, datos: d, actualizado: now }); }));
      for (const r of (mine.data || []).filter(r => !want.some(w => w.id === r.id && w.grupo === r.grupo))) await sb.from('campanas').delete().eq('usuario', me).eq('id', r.id).eq('grupo', r.grupo);
      if (want.length) { const { error } = await sb.from('campanas').upsert(want, { onConflict: 'usuario,id,grupo' }); fail(error, 'No se pudo compartir la campaña'); }
      return want.length;
    },
    async campanas(grupo) {
      need();
      const { data, error } = await sb.from('campanas').select('usuario,id,nombre,comando,datos,actualizado').eq('grupo', grupo).order('actualizado', { ascending: false });
      if (error && /does not exist|schema cache|could not find/i.test(error.message)) return [];
      fail(error);
      const nm = await N.nombres((data || []).map(x => x.usuario));
      return (data || []).map(x => ({ ...x, jugador: nm[x.usuario] || '¿?', mia: x.usuario === uid() }));
    },
  };

  // Perfil público: se crea al registrarse (o en el primer inicio si hubo que confirmar el correo)
  async function ensurePerfil(nombre) {
    const me = uid(); if (!me) return null;
    const { data } = await sb.from('perfiles').select('id,nombre,rol,avatar').eq('id', me).maybeSingle();
    if (data) return (perfil = data);
    const n = nombre || session.user.user_metadata?.nombre || (session.user.email || 'jugador').split('@')[0].slice(0, 24);
    let nn = n, k = 1, r;
    while ((r = await sb.from('perfiles').insert({ id: me, nombre: nn })).error && /duplicate|perfiles_nombre_uq/i.test(r.error.message) && k < 6) nn = n.slice(0, 20) + ' ' + (++k);
    fail(r.error);
    return (perfil = { id: me, nombre: nn, rol: 'jugador', avatar: null });
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

  // Recorta la foto al centro en un cuadrado de `size` px (JPEG)
  async function square(file, size) {
    if (!/^image\//.test(file.type)) throw new Error('El archivo no es una imagen');
    if (file.size > 15e6) throw new Error('La imagen es demasiado grande');
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('No se pudo leer la imagen')); i.src = URL.createObjectURL(file); });
    const w = img.naturalWidth, h = img.naturalHeight, side = Math.min(w, h);
    const c = document.createElement('canvas'); c.width = c.height = Math.min(size, side);
    const g = c.getContext('2d'); g.fillStyle = '#111'; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', 0.86));
    if (!blob) throw new Error('No se pudo preparar la foto');
    return blob;
  }
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
