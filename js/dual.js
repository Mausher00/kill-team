// ============================================================
//  dual.js — Partida en dos dispositivos
//  · Cliente MQTT 3.1.1 mínimo sobre WebSocket (sin dependencias)
//    contra brokers públicos gratuitos (con alternativa si uno falla).
//  · Cada sala tiene un id aleatorio y una clave AES-GCM que solo
//    viaja en el enlace de invitación (#k=…): el broker no puede leer
//    la partida.
//  Expone window.KTD.
// ============================================================
(function () {
  const BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081',
  ];
  const BASE = 'ktcomp/v1/';
  const te = new TextEncoder(), td = new TextDecoder();

  // ── utilidades binarias ───────────────────────────────────
  const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
  const rnd = n => crypto.getRandomValues(new Uint8Array(n));
  const roomId = () => Array.from(rnd(10), b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
  const cat = (...parts) => { const out = new Uint8Array(parts.reduce((a, p) => a + p.length, 0)); let o = 0; parts.forEach(p => { out.set(p, o); o += p.length; }); return out; };
  const str = s => { const b = te.encode(s); return cat(Uint8Array.of(b.length >> 8, b.length & 255), b); };
  const varlen = n => { const out = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; out.push(d); } while (n > 0); return Uint8Array.from(out); };
  const packet = (type, body) => cat(Uint8Array.of(type), varlen(body.length), body);

  // ── Cliente MQTT mínimo (QoS 0, retained, last will, ping, reconexión) ──
  class Mqtt {
    constructor(url, opt) {
      this.url = url; this.opt = opt; this.subs = new Set(); this.buf = new Uint8Array(0);
      this.closed = false; this.connected = false; this.pid = 1; this.retry = 0;
    }
    connect() {
      return new Promise((res, rej) => {
        let done = false;
        const fail = e => { if (!done) { done = true; rej(e); } };
        const t = setTimeout(() => { fail(new Error('timeout')); try { this.ws.close(); } catch {} }, 7000);
        try { this.ws = new WebSocket(this.url, 'mqtt'); } catch (e) { clearTimeout(t); fail(e); return; }
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = () => this.ws.send(this.connectPacket());
        this.ws.onmessage = ev => this.feed(new Uint8Array(ev.data), ok => { if (!done) { done = true; clearTimeout(t); ok ? res() : rej(new Error('rechazado')); } });
        this.ws.onerror = () => { clearTimeout(t); fail(new Error('error de conexión')); };
        this.ws.onclose = () => {
          clearTimeout(t); clearInterval(this.ping);
          const was = this.connected; this.connected = false;
          fail(new Error('cerrado'));
          if (was) this.opt.onState?.('off');
          if (!this.closed && was) this.reconnect();
        };
      });
    }
    async reconnect() {
      while (!this.closed) {
        await new Promise(r => setTimeout(r, Math.min(8000, 800 * 2 ** this.retry++)));
        if (this.closed) return;
        try { await this.connect(); return; } catch {}
      }
    }
    connectPacket() {
      const { clientId, will, keepalive = 30 } = this.opt;
      let flags = 0x02;
      if (will) flags |= 0x04 | 0x20;          // will + will retain (QoS 0)
      const vh = cat(str('MQTT'), Uint8Array.of(4, flags, keepalive >> 8, keepalive & 255));
      const pl = will ? cat(str(clientId), str(will.topic), Uint8Array.of(will.payload.length >> 8, will.payload.length & 255), will.payload) : str(clientId);
      return packet(0x10, cat(vh, pl));
    }
    feed(chunk, onConnack) {
      this.buf = cat(this.buf, chunk);
      for (;;) {
        if (this.buf.length < 2) return;
        let len = 0, mul = 1, i = 1, b;
        do { if (i >= this.buf.length) return; b = this.buf[i++]; len += (b & 127) * mul; mul *= 128; } while (b & 128);
        if (this.buf.length < i + len) return;
        const type = this.buf[0], body = this.buf.subarray(i, i + len);
        this.buf = this.buf.slice(i + len);
        const kind = type >> 4;
        if (kind === 2) {                                  // CONNACK
          const ok = body[1] === 0;
          if (ok) {
            this.connected = true; this.retry = 0;
            this.subs.forEach(tp => this.sendSub(tp));
            clearInterval(this.ping);
            this.ping = setInterval(() => this.raw(Uint8Array.of(0xC0, 0)), (this.opt.keepalive || 30) * 1000 * 0.8);
            this.opt.onState?.('on');
          }
          onConnack(ok);
        } else if (kind === 3) {                           // PUBLISH
          const qos = (type >> 1) & 3, tl = (body[0] << 8) | body[1];
          const topic = td.decode(body.subarray(2, 2 + tl));
          const payload = body.slice(2 + tl + (qos ? 2 : 0));
          if (qos === 1) this.raw(Uint8Array.of(0x40, 2, body[2 + tl], body[3 + tl]));   // PUBACK
          this.opt.onMessage?.(topic, payload, !!(type & 1));
        }
      }
    }
    raw(bytes) { if (this.ws && this.ws.readyState === 1) this.ws.send(bytes); }
    sendSub(topic) { const id = this.pid++ & 0xffff || 1; this.raw(packet(0x82, cat(Uint8Array.of(id >> 8, id & 255), str(topic), Uint8Array.of(0)))); }
    subscribe(topic) { this.subs.add(topic); if (this.connected) this.sendSub(topic); }
    publish(topic, payload, retain = false) { this.raw(packet(0x30 | (retain ? 1 : 0), cat(str(topic), payload))); }
    close() { this.closed = true; clearInterval(this.ping); try { this.raw(Uint8Array.of(0xE0, 0)); this.ws.close(); } catch {} }
  }

  // ── Cifrado ───────────────────────────────────────────────
  const importKey = async k => crypto.subtle.importKey('raw', unb64u(k), 'AES-GCM', false, ['encrypt', 'decrypt']);
  async function seal(key, obj) {
    const iv = rnd(12);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(JSON.stringify(obj))));
    return cat(iv, ct);
  }
  async function open(key, bytes) {
    if (bytes.length < 13) return null;
    try { return JSON.parse(td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12)))); }
    catch { return null; }
  }

  // ── Sala ──────────────────────────────────────────────────
  // cfg: { room, key, seat (0 anfitrión · 1 invitado), broker (url) }
  const KTD = window.KTD = {
    BROKERS,
    supported: !!(window.crypto && crypto.subtle && window.WebSocket),
    cfg: null, client: null, key: null, peer: false, online: false,
    onMessage: null, onPeer: null, onState: null,

    newRoom() { return { room: roomId(), key: b64u(rnd(16)) }; },
    inviteUrl(cfg) {
      const u = new URL(location.href);
      u.search = ''; u.hash = '';
      u.searchParams.set('sala', cfg.room);
      if (BROKERS.indexOf(cfg.broker) >= 0) u.searchParams.set('b', BROKERS.indexOf(cfg.broker));
      else u.searchParams.set('broker', cfg.broker);
      return u.href + '#k=' + cfg.key;
    },
    // Lee una invitación de la URL actual (o null)
    fromUrl() {
      const q = new URLSearchParams(location.search), k = new URLSearchParams(location.hash.slice(1)).get('k');
      if (!q.get('sala') || !k) return null;
      const broker = q.get('broker') || BROKERS[+q.get('b') || 0] || BROKERS[0];
      return { room: q.get('sala'), key: k, broker, seat: 1 };
    },

    // Conecta. Si cfg.broker no está fijado (anfitrión), prueba la lista en orden.
    async connect(cfg) {
      this.close();
      this.cfg = { ...cfg };
      this.key = await importKey(cfg.key);
      const t = BASE + cfg.room;
      const me = cfg.seat, other = 1 - cfg.seat;
      const list = cfg.broker ? [cfg.broker] : (new URLSearchParams(location.search).get('broker') ? [new URLSearchParams(location.search).get('broker')] : BROKERS);
      let lastErr;
      for (const url of list) {
        const c = new Mqtt(url, {
          clientId: 'ktc-' + b64u(rnd(9)),
          keepalive: 30,
          will: { topic: `${t}/p/${me}`, payload: te.encode('0') },
          onState: s => { this.online = s === 'on'; if (s === 'on') c.publish(`${t}/p/${me}`, te.encode('1'), true); this.onState?.(s); },
          onMessage: async (topic, payload) => {
            if (topic === `${t}/p/${other}`) { this.peer = td.decode(payload) === '1'; this.onPeer?.(this.peer); return; }
            if (topic.startsWith(`${t}/p/`)) return;
            const msg = await open(this.key, payload);
            if (!msg || msg.from === me) return;          // ajeno o eco propio
            this.onMessage?.(msg, topic.endsWith('/s'));
          },
        });
        try {
          await c.connect();
          this.client = c; this.cfg.broker = url;
          c.subscribe(`${t}/p/${other}`);
          c.subscribe(`${t}/m/${other}`);
          c.subscribe(`${t}/s`);
          c.publish(`${t}/p/${me}`, te.encode('1'), true);
          this.online = true; this.onState?.('on');
          return this.cfg;
        } catch (e) { lastErr = e; c.close(); }
      }
      throw lastErr || new Error('sin conexión');
    },
    async send(obj) {
      if (!this.client) return;
      const t = BASE + this.cfg.room;
      this.client.publish(`${t}/m/${this.cfg.seat}`, await seal(this.key, { ...obj, from: this.cfg.seat }));
    },
    // Instantánea guardada en el broker (la recibe quien se conecte después)
    async snapshot(obj) {
      if (!this.client) return;
      this.client.publish(`${BASE + this.cfg.room}/s`, await seal(this.key, { ...obj, from: this.cfg.seat, t: 'snap' }), true);
    },
    close() {
      if (this.client) {
        try { this.client.publish(`${BASE + this.cfg.room}/p/${this.cfg.seat}`, te.encode('0'), true); } catch {}
        this.client.close();
      }
      this.client = null; this.peer = false; this.online = false;
    },
    // QR en SVG
    qrSvg(text, cell = 5) {
      const q = qrcode(0, 'M'); q.addData(text); q.make();
      return q.createSvgTag({ cellSize: cell, margin: 2, scalable: true });
    },
  };
})();
