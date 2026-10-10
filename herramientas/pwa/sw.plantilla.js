// ============================================================
//  sw.js — Service worker: la app funciona sin conexión.
//  GENERADO por herramientas/pwa/generar_sw.py — no editar a mano.
// ============================================================
const VERSION = '__VERSION__';
const CORE = __CORE__;
const IMAGES = __IMAGES__;
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
