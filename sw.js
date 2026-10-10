// ============================================================
//  sw.js — Service worker: la app funciona sin conexión.
//  GENERADO por herramientas/pwa/generar_sw.py — no editar a mano.
// ============================================================
const VERSION = '4bbc896e91';
const CORE = [
"index.html",
"builder.html",
"partida.html",
"historial.html",
"comandos.html",
"misiones/misiones.html",
"manifest.webmanifest",
"css/fonts.css",
"css/fx.css",
"css/iconos.css",
"css/partida.css",
"css/styles.css",
"js/app.js",
"js/comandos.js",
"js/data/ala-asesina.js",
"js/data/angeles-muerte.js",
"js/data/asaltantes-phobos.js",
"js/data/core.js",
"js/data/demoledorez.js",
"js/data/escuadra-exaccion.js",
"js/data/garra-nemesis.js",
"js/data/keywords.js",
"js/data/korps.js",
"js/data/mandragoras.js",
"js/data/mano-arconte.js",
"js/data/marcadores.js",
"js/data/misiones.js",
"js/data/novicias.js",
"js/data/ork-kommandos.js",
"js/data/rastreadores.js",
"js/data/sucesores.js",
"js/data/tempestus-aquilons.js",
"js/data/universal_equipment.js",
"js/data/vespid.js",
"js/data/zonas.js",
"js/dual.js",
"js/partida.js",
"js/render.js",
"js/ui.js",
"js/vendor/qrcode.js",
"recursos/d-din/d-din-bold.otf",
"recursos/d-din/d-din-italic.otf",
"recursos/d-din/d-din.otf",
"recursos/d-din/d-dincondensed-bold.otf",
"recursos/d-din/d-dincondensed.otf",
"recursos/d-din/d-dinexp-bold.otf",
"recursos/d-din/d-dinexp-italic.otf",
"recursos/d-din/d-dinexp.otf",
"recursos/iconos/tabler-icons.woff2",
"imagenes/app/apple-touch-icon.png",
"imagenes/app/icono-192.png",
"imagenes/app/icono-512.png",
"imagenes/app/icono-maskable-512.png"
];
const IMAGES = [
"imagenes/alaasesina.webp",
"imagenes/asaltantes-phobos-img/adepto-helix-infiltrador.webp",
"imagenes/asaltantes-phobos-img/combatiente-incursor.webp",
"imagenes/asaltantes-phobos-img/combatiente-infiltrador.webp",
"imagenes/asaltantes-phobos-img/combatiente-saqueador.webp",
"imagenes/asaltantes-phobos-img/comunicador-infiltrador.webp",
"imagenes/asaltantes-phobos-img/minador-incursor.webp",
"imagenes/asaltantes-phobos-img/ojo-preciso-incursor.webp",
"imagenes/asaltantes-phobos-img/sargento-incursor.webp",
"imagenes/asaltantes-phobos-img/sargento-infiltrador.webp",
"imagenes/asaltantes-phobos-img/sargento-saqueador.webp",
"imagenes/asaltantes-phobos-img/veterano-infiltrador.webp",
"imagenes/asaltantes-phobos-img/vocopirata-infiltrador.webp",
"imagenes/asaltantes-phobos-img/zapador-infiltrador.webp",
"imagenes/asaltantes-phobos.webp",
"imagenes/betha-decima/1.webp",
"imagenes/betha-decima/2.webp",
"imagenes/betha-decima/3.webp",
"imagenes/betha-decima/4.webp",
"imagenes/betha-decima/5.webp",
"imagenes/betha-decima/6.webp",
"imagenes/cac.webp",
"imagenes/def.webp",
"imagenes/demoledorez.webp",
"imagenes/elementos-mundo-necropolis.webp",
"imagenes/escuadra-exaccion-img/arbites-amo-adiestrador.webp",
"imagenes/escuadra-exaccion-img/arbites-castigador.webp",
"imagenes/escuadra-exaccion-img/arbites-doctoforense.webp",
"imagenes/escuadra-exaccion-img/arbites-martirizador.webp",
"imagenes/escuadra-exaccion-img/arbites-ojo-preciso.webp",
"imagenes/escuadra-exaccion-img/arbites-proctojuez.webp",
"imagenes/escuadra-exaccion-img/arbites-revelatum.webp",
"imagenes/escuadra-exaccion-img/arbites-sojuzgador.webp",
"imagenes/escuadra-exaccion-img/arbites-tirador.webp",
"imagenes/escuadra-exaccion-img/arbites-vigilante.webp",
"imagenes/escuadra-exaccion-img/arbites-vocotransmisor.webp",
"imagenes/escuadra-exaccion-img/r-vr-cibermastin.webp",
"imagenes/escuadra-exaccion.webp",
"imagenes/gallowdark/Gallowdark_0000_Capa-6.webp",
"imagenes/gallowdark/Gallowdark_0001_Capa-5.webp",
"imagenes/gallowdark/Gallowdark_0002_Capa-4.webp",
"imagenes/gallowdark/Gallowdark_0003_Capa-3.webp",
"imagenes/gallowdark/Gallowdark_0004_Capa-2.webp",
"imagenes/gallowdark/Gallowdark_0005_Capa-1.webp",
"imagenes/garra-nemesis.webp",
"imagenes/her.webp",
"imagenes/korps-img/medico.webp",
"imagenes/korps-img/soldado.webp",
"imagenes/korps-img/solido-de-los-korps.webp",
"imagenes/korps-img/tirador-de-los-korps.webp",
"imagenes/korps-img/vigia.webp",
"imagenes/korps.webp",
"imagenes/lpa.webp",
"imagenes/mandragoras-img/mandragora-abisal.webp",
"imagenes/mandragoras-img/mandragora-catadora-de-carnes.webp",
"imagenes/mandragoras-img/mandragora-combatiente.webp",
"imagenes/mandragoras-img/mandragora-fauces-funebres.webp",
"imagenes/mandragoras-img/mandragora-nocturna.webp",
"imagenes/mandragoras-img/mandragora-tejesombras.webp",
"imagenes/mandragoras.webp",
"imagenes/mano-arconte-img/archisibarita-kabalista.webp",
"imagenes/mano-arconte-img/asesino-partecielos-kabalista.webp",
"imagenes/mano-arconte-img/despellejador-kabalista.webp",
"imagenes/mano-arconte-img/discipulo-de-yaelindra-kabalista.webp",
"imagenes/mano-arconte-img/duelista-carmesi-kabalista.webp",
"imagenes/mano-arconte-img/elixicante-kabalista.webp",
"imagenes/mano-arconte-img/espia-kabalista.webp",
"imagenes/mano-arconte-img/tirador-kabalista.webp",
"imagenes/mano-arconte-img/tirador-pesado-kabalista.webp",
"imagenes/mano-arconte.webp",
"imagenes/mapas/bheta-decima/I-1.webp",
"imagenes/mapas/bheta-decima/I-2.webp",
"imagenes/mapas/bheta-decima/I-3.webp",
"imagenes/mapas/bheta-decima/I-4.webp",
"imagenes/mapas/bheta-decima/I-5.webp",
"imagenes/mapas/bheta-decima/I-6.webp",
"imagenes/mapas/bheta-decima/II-1.webp",
"imagenes/mapas/bheta-decima/II-2.webp",
"imagenes/mapas/bheta-decima/II-3.webp",
"imagenes/mapas/bheta-decima/II-4.webp",
"imagenes/mapas/bheta-decima/II-5.webp",
"imagenes/mapas/bheta-decima/II-6.webp",
"imagenes/mapas/bheta-decima/clave-1.webp",
"imagenes/mapas/gallowdark/1.webp",
"imagenes/mapas/gallowdark/2.webp",
"imagenes/mapas/gallowdark/3.webp",
"imagenes/mapas/gallowdark/4.webp",
"imagenes/mapas/gallowdark/5.webp",
"imagenes/mapas/gallowdark/6.webp",
"imagenes/mapas/gallowdark/clave-1.webp",
"imagenes/mapas/gallowdark/clave-2.webp",
"imagenes/mapas/generica/1.webp",
"imagenes/mapas/generica/2.webp",
"imagenes/mapas/generica/3.webp",
"imagenes/mapas/generica/4.webp",
"imagenes/mapas/generica/5.webp",
"imagenes/mapas/generica/6.webp",
"imagenes/mapas/generica/clave-1.webp",
"imagenes/mapas/necropolis/1.webp",
"imagenes/mapas/necropolis/2.webp",
"imagenes/mapas/necropolis/3.webp",
"imagenes/mapas/necropolis/4.webp",
"imagenes/mapas/necropolis/5.webp",
"imagenes/mapas/necropolis/6.webp",
"imagenes/mapas/necropolis/clave-1.webp",
"imagenes/mapas/necropolis/clave-2.webp",
"imagenes/mapas/octarius/1.webp",
"imagenes/mapas/octarius/2.webp",
"imagenes/mapas/octarius/3.webp",
"imagenes/mapas/octarius/4.webp",
"imagenes/mapas/octarius/5.webp",
"imagenes/mapas/octarius/6.webp",
"imagenes/mapas/octarius/clave-1.webp",
"imagenes/mapas/volkus/I-1.webp",
"imagenes/mapas/volkus/I-2.webp",
"imagenes/mapas/volkus/I-3.webp",
"imagenes/mapas/volkus/I-4.webp",
"imagenes/mapas/volkus/I-5.webp",
"imagenes/mapas/volkus/I-6.webp",
"imagenes/mapas/volkus/II-1.webp",
"imagenes/mapas/volkus/II-2.webp",
"imagenes/mapas/volkus/II-3.webp",
"imagenes/mapas/volkus/II-4.webp",
"imagenes/mapas/volkus/II-5.webp",
"imagenes/mapas/volkus/II-6.webp",
"imagenes/mapas/volkus/asedio-1.webp",
"imagenes/mapas/volkus/asedio-2.webp",
"imagenes/mapas/volkus/clave-1.webp",
"imagenes/mapas/volkus/clave-2.webp",
"imagenes/mapas/volkus/clave-3.webp",
"imagenes/misiones/crit-1.webp",
"imagenes/misiones/crit-2.webp",
"imagenes/misiones/crit-3.webp",
"imagenes/misiones/crit-4.webp",
"imagenes/misiones/crit-5.webp",
"imagenes/misiones/crit-6.webp",
"imagenes/misiones/crit-7.webp",
"imagenes/misiones/crit-8.webp",
"imagenes/misiones/crit-9.webp",
"imagenes/misiones/ini-1.webp",
"imagenes/misiones/ini-2.webp",
"imagenes/misiones/ini-3.webp",
"imagenes/misiones/ini-repetir.webp",
"imagenes/misiones/kill-op.webp",
"imagenes/misiones/primaria-crit.webp",
"imagenes/misiones/primaria-kill.webp",
"imagenes/misiones/primaria-tac.webp",
"imagenes/misiones/secuencia.webp",
"imagenes/misiones/tac-dominate.webp",
"imagenes/misiones/tac-envoy.webp",
"imagenes/misiones/tac-flank.webp",
"imagenes/misiones/tac-martyrs.webp",
"imagenes/misiones/tac-plant-banner.webp",
"imagenes/misiones/tac-plant-devices.webp",
"imagenes/misiones/tac-retrieval.webp",
"imagenes/misiones/tac-rout.webp",
"imagenes/misiones/tac-scout.webp",
"imagenes/misiones/tac-steal-intelligence.webp",
"imagenes/misiones/tac-sweep-clear.webp",
"imagenes/misiones/tac-track-enemy.webp",
"imagenes/mov.webp",
"imagenes/necropolis/1.webp",
"imagenes/necropolis/2.webp",
"imagenes/necropolis/3.webp",
"imagenes/necropolis/4.webp",
"imagenes/necropolis/5.webp",
"imagenes/necropolis/6.webp",
"imagenes/novicias-img/novicia-condenadora.webp",
"imagenes/novicias-img/novicia-dialogante.webp",
"imagenes/novicias-img/novicia-duelista.webp",
"imagenes/novicias-img/novicia-exactora.webp",
"imagenes/novicias-img/novicia-hospitalaria.webp",
"imagenes/novicias-img/novicia-militante.webp",
"imagenes/novicias-img/novicia-penitente.webp",
"imagenes/novicias-img/novicia-preceptora.webp",
"imagenes/novicias-img/novicia-pronatus.webp",
"imagenes/novicias-img/novicia-purgatus.webp",
"imagenes/novicias-img/novicia-relicaria.webp",
"imagenes/novicias-img/novicia-superiora.webp",
"imagenes/novicias.webp",
"imagenes/octarius/1.webp",
"imagenes/octarius/2.webp",
"imagenes/octarius/3.webp",
"imagenes/octarius/4.webp",
"imagenes/octarius/5.webp",
"imagenes/octarius/6.webp",
"imagenes/orkomandos.webp",
"imagenes/ranged.webp",
"imagenes/rastreadores-img/dron-acelerador-de-induccion-mv31.webp",
"imagenes/rastreadores-img/dron-antigravedad-mv33.webp",
"imagenes/rastreadores-img/dron-de-combate-mv1.webp",
"imagenes/rastreadores-img/dron-de-defensa-mv4.webp",
"imagenes/rastreadores-img/dron-de-reconocimiento-mb3.webp",
"imagenes/rastreadores-img/dron-telemetrico-mv7.webp",
"imagenes/rastreadores-img/rastreador-aguerrido.webp",
"imagenes/rastreadores-img/rastreador-controlador-de-drones.webp",
"imagenes/rastreadores-img/rastreador-experto-en-armas.webp",
"imagenes/rastreadores-img/rastreador-granadero-de-asalto.webp",
"imagenes/rastreadores-img/rastreador-interferidor-transpectral.webp",
"imagenes/rastreadores-img/rastreador-ojo-preciso.webp",
"imagenes/rastreadores-img/rastreador-shasla.webp",
"imagenes/rastreadores-img/rastreador-shasui.webp",
"imagenes/rastreadores-img/rastreador-tecnico-de-comunicaciones.webp",
"imagenes/rastreadores-img/rastreador-tecnico-sanitario.webp",
"imagenes/rastreadores.webp",
"imagenes/sucesores.webp",
"imagenes/tempestus-aquilons.webp",
"imagenes/vespid.webp",
"imagenes/volkus/1.webp",
"imagenes/volkus/2.webp",
"imagenes/volkus/3.webp",
"imagenes/volkus/4.webp",
"imagenes/volkus/5.webp",
"imagenes/volkus/6.webp"
];
const C_CORE = 'kt-core-' + VERSION;
const C_IMG = 'kt-img';
const url = p => new URL(p, self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C_CORE).then(c => c.addAll(CORE.map(p => new Request(url(p), { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('kt-core-') && k !== C_CORE) await caches.delete(k);
    // quitar imágenes que ya no existen en esta versión
    const keep = new Set(IMAGES.map(url)), c = await caches.open(C_IMG);
    for (const req of await c.keys()) if (!keep.has(req.url)) await c.delete(req);
    await self.clients.claim();
  })());
});

// Imágenes: primero la caché (no cambian). Resto (HTML, JS, CSS, datos): primero la red
// para recibir siempre la última versión; sin conexión (o si tarda > 4 s), la copia guardada.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isImg = req.destination === 'image' || /\/imagenes\//.test(req.url);
  e.respondWith(isImg ? cacheFirst(req) : networkFirst(req));
});
async function cacheFirst(req) {
  const hit = await caches.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(C_IMG)).put(req, res.clone());
    return res;
  } catch { return Response.error(); }
}
async function networkFirst(req) {
  const cached = () => caches.match(req, { ignoreSearch: true });
  try {
    const res = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error('lento')), 4000))]);
    if (res.ok) { const c = await caches.open(C_CORE); c.put(req.url.split('?')[0], res.clone()); }
    return res;
  } catch {
    return (await cached()) || (req.mode === 'navigate' ? await caches.match(url('index.html')) : null) || Response.error();
  }
}

self.addEventListener('message', e => {
  const port = e.ports[0], d = e.data || {};
  if (d.type === 'status') {
    e.waitUntil((async () => {
      const c = await caches.open(C_IMG), have = new Set((await c.keys()).map(r => r.url));
      port.postMessage({ version: VERSION, images: IMAGES.length, cached: IMAGES.filter(p => have.has(url(p))).length });
    })());
  }
  if (d.type === 'cacheAll') {
    e.waitUntil((async () => {
      const c = await caches.open(C_IMG), have = new Set((await c.keys()).map(r => r.url));
      const todo = IMAGES.map(url).filter(u => !have.has(u));
      let done = IMAGES.length - todo.length, failed = 0;
      port.postMessage({ type: 'progress', done, total: IMAGES.length });
      for (let i = 0; i < todo.length; i += 6) {
        await Promise.all(todo.slice(i, i + 6).map(async u => {
          try { const r = await fetch(u); if (r.ok) await c.put(u, r); else failed++; } catch { failed++; }
          done++;
        }));
        port.postMessage({ type: 'progress', done, total: IMAGES.length });
      }
      port.postMessage({ type: 'done', failed });
    })());
  }
});
