// ============================================================
//  ui.js — Utilidades de interfaz compartidas (sin dependencias)
//  Expone window.KT con: store, toast, keys, palette, modal,
//  markText, norm, vt, bump, shake, initFx.
// ============================================================
(function () {
  const KT = (window.KT = window.KT || {});
  const ROOT = document.currentScript ? new URL('../', document.currentScript.src) : new URL('./', location.href);
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Texto ────────────────────────────────────────────────
  KT.norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  KT.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ── Almacenamiento seguro (modo privado, bloqueos…) ──────
  KT.store = {
    get(k, def = null) { try { const v = localStorage.getItem('kt.' + k); return v == null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { localStorage.setItem('kt.' + k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem('kt.' + k); } catch {} },
  };

  // ── View Transitions (con alternativa) ───────────────────
  KT.vt = fn => (document.startViewTransition && !reduced()) ? document.startViewTransition(fn) : fn();

  // ── Micro-animaciones ────────────────────────────────────
  const replay = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  KT.bump = el => replay(el, 'bump');
  KT.shake = el => replay(el, 'shake');
  KT.flash = el => replay(el, 'flash');

  // ── Toasts ───────────────────────────────────────────────
  KT.toast = (msg, opt = {}) => {
    let box = document.querySelector('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    const t = document.createElement('div');
    const icon = opt.type === 'ok' ? 'circle-check' : opt.type === 'err' ? 'alert-triangle' : 'info-circle';
    t.className = 'toast ' + (opt.type || '');
    t.innerHTML = `<i class="ti ti-${icon}"></i><span>${msg}</span>${opt.action ? `<button>${opt.action}</button>` : ''}`;
    const close = () => { t.classList.add('out'); setTimeout(() => t.remove(), 260); };
    if (opt.action) t.querySelector('button').onclick = () => { opt.onAction && opt.onAction(); close(); };
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(close, opt.ms || 2600);
    return close;
  };

  // ── Atajos de teclado ────────────────────────────────────
  // KT.keys({ 'mod+k': fn, '/': fn, 'Escape': fn }, { allowInInput: ['Escape','mod+k'] })
  const bindings = [];
  KT.keys = (map, opt = {}) => bindings.push({ map, allow: new Set(opt.allowInInput || ['Escape']) });
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    const combo = ((e.ctrlKey || e.metaKey) ? 'mod+' : '') + (e.altKey ? 'alt+' : '') + (e.key.length === 1 ? e.key.toLowerCase() : e.key);
    for (let i = bindings.length - 1; i >= 0; i--) {
      const b = bindings[i];
      const fn = b.map[combo];
      if (!fn) continue;
      if (typing && !b.allow.has(combo)) continue;
      if (fn(e) !== false) { e.preventDefault(); return; }
    }
  });

  // ── Resaltado de coincidencias sobre el DOM ──────────────
  // Recorre solo nodos de texto: no rompe el HTML ni los spans de keywords.
  KT.markText = (root, q) => {
    if (!root || !q || q.trim().length < 2) return;
    const nq = KT.norm(q.trim());
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement && !n.parentElement.closest('mark,script,style,input') && KT.norm(n.nodeValue).includes(nq) ? 1 : 2,
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue, ntext = KT.norm(text);
      const frag = document.createDocumentFragment();
      let pos = 0, idx;
      while ((idx = ntext.indexOf(nq, pos)) !== -1) {
        frag.appendChild(document.createTextNode(text.slice(pos, idx)));
        const m = document.createElement('mark'); m.className = 'hl'; m.textContent = text.slice(idx, idx + nq.length);
        frag.appendChild(m); pos = idx + nq.length;
      }
      frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    });
  };

  // ── Modal sencillo ───────────────────────────────────────
  KT.modal = (title, html, icon = 'keyboard') => {
    const back = document.createElement('div');
    back.className = 'cmdk-back on';
    back.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="${KT.esc(title)}">
      <div class="cmdk-in"><i class="ti ti-${icon}"></i><strong style="flex:1;font-family:var(--font-display);letter-spacing:.1em;text-transform:uppercase">${title}</strong><kbd>Esc</kbd></div>
      <div class="cmdk-list">${html}</div></div>`;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); close(); } };
    back.addEventListener('mousedown', e => { if (e.target === back) close(); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(back);
    return close;
  };

  KT.helpModal = rows => KT.modal('Atajos de teclado',
    `<div class="help-grid">${rows.map(([k, d]) => `<div class="k">${k.split(' ').map(x => `<kbd>${x}</kbd>`).join('')}</div><div>${d}</div>`).join('')}</div>`);

  // ── Paleta de comandos ───────────────────────────────────
  // source(): [{ group, icon, title, sub, tag, text, run }]
  KT.palette = (source, opt = {}) => {
    let back, input, list, items = [], results = [], sel = 0;
    const MAX = 60;

    function score(it, terms) {
      const t = it._nt || (it._nt = KT.norm(it.title));
      const all = it._na || (it._na = KT.norm([it.title, it.sub, it.tag, it.text].join(' ')));
      let s = 0;
      for (const term of terms) {
        if (!all.includes(term)) return -1;
        if (t.startsWith(term)) s += 6; else if (t.includes(' ' + term)) s += 4; else if (t.includes(term)) s += 3; else s += 1;
      }
      return s + (it.boost || 0);
    }

    function draw() {
      const q = KT.norm(input.value.trim());
      const terms = q.split(/\s+/).filter(Boolean);
      if (!terms.length) results = items.filter(i => i.suggest).slice(0, MAX);
      else {
        const ranked = items.map(i => [score(i, terms), i]).filter(x => x[0] >= 0).sort((a, b) => b[0] - a[0]).slice(0, MAX).map(x => x[1]);
        // Agrupar respetando la relevancia del primer resultado de cada grupo
        const groups = new Map();
        ranked.forEach(r => { if (!groups.has(r.group)) groups.set(r.group, []); groups.get(r.group).push(r); });
        results = [...groups.values()].flat();
      }
      sel = Math.min(sel, Math.max(0, results.length - 1));
      if (!results.length) { list.innerHTML = `<div class="cmdk-empty">Sin resultados para “${KT.esc(input.value)}”</div>`; return; }
      let html = '', last = null;
      results.forEach((r, i) => {
        if (r.group !== last) { html += `<div class="cmdk-group">${r.group}</div>`; last = r.group; }
        html += `<div class="cmdk-item${i === sel ? ' on' : ''}" data-i="${i}" role="option" aria-selected="${i === sel}">
          <i class="ci ti ti-${r.icon || 'point'}"></i>
          <div class="cn"><div class="ct">${KT.esc(r.title)}</div>${r.sub ? `<div class="cs">${KT.esc(r.sub)}</div>` : ''}</div>
          <span class="cf">${KT.esc(r.tag || '')}</span></div>`;
      });
      list.innerHTML = html;
      if (input.value.trim().length >= 2) KT.markText(list, input.value.trim().split(/\s+/)[0]);
    }

    function move(d) {
      if (!results.length) return;
      sel = (sel + d + results.length) % results.length;
      list.querySelectorAll('.cmdk-item').forEach((el, i) => { el.classList.toggle('on', i === sel); el.setAttribute('aria-selected', i === sel); });
      const on = list.querySelector('.cmdk-item.on'); on && on.scrollIntoView({ block: 'nearest' });
    }

    function pick(i) { const r = results[i]; if (!r) return; close(); setTimeout(() => r.run(), 10); }

    function open(prefill = '') {
      if (back) return;
      items = source();
      back = document.createElement('div');
      back.className = 'cmdk-back on';
      back.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="Buscar">
        <div class="cmdk-in"><i class="ti ti-search"></i><input type="text" placeholder="${opt.placeholder || 'Buscar…'}" aria-label="Buscar" autocomplete="off" spellcheck="false"><kbd>Esc</kbd></div>
        <div class="cmdk-list" role="listbox"></div>
        <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> mover</span><span><kbd>↵</kbd> abrir</span><span><kbd>Esc</kbd> cerrar</span></div></div>`;
      document.body.appendChild(back);
      input = back.querySelector('input'); list = back.querySelector('.cmdk-list');
      input.value = prefill; sel = 0; draw();
      input.focus();
      input.addEventListener('input', () => { sel = 0; draw(); });
      input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      });
      list.addEventListener('mousemove', e => { const it = e.target.closest('.cmdk-item'); if (it && +it.dataset.i !== sel) { sel = +it.dataset.i; list.querySelectorAll('.cmdk-item').forEach((el, i) => el.classList.toggle('on', i === sel)); } });
      list.addEventListener('click', e => { const it = e.target.closest('.cmdk-item'); if (it) pick(+it.dataset.i); });
      back.addEventListener('mousedown', e => { if (e.target === back) close(); });
    }
    function close() { if (back) { back.remove(); back = null; } }
    return { open, close, isOpen: () => !!back };
  };

  // ── Efectos globales: spotlight, ripple, volver arriba ───
  KT.initFx = () => {
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    document.addEventListener('pointerdown', e => {
      const el = e.target.closest && e.target.closest('.ripple');
      if (!el || reduced()) return;
      const r = el.getBoundingClientRect(), size = Math.max(r.width, r.height);
      const dot = document.createElement('span');
      dot.className = 'ripple-dot';
      dot.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      el.appendChild(dot); setTimeout(() => dot.remove(), 600);
    }, { passive: true });

    const top = document.createElement('button');
    top.className = 'to-top'; top.setAttribute('aria-label', 'Volver arriba'); top.title = 'Volver arriba';
    top.innerHTML = '<i class="ti ti-arrow-up"></i>';
    top.onclick = () => window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
    document.body.appendChild(top);
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        top.classList.toggle('on', scrollY > 600);
        document.querySelectorAll('.sticky-head').forEach(h => h.classList.toggle('stuck', h.getBoundingClientRect().top <= 0 && scrollY > 10));
        ticking = false;
      });
    }, { passive: true });
  };

  // Indicador deslizante para pestañas (.tabs > .tab-btn.on)
  KT.inkTabs = (tabs, activeSel = '.on') => {
    if (!tabs) return;
    let ink = tabs.querySelector('.tab-ink');
    if (!ink) { ink = document.createElement('span'); ink.className = 'tab-ink'; tabs.prepend(ink); tabs.classList.add('has-ink'); }
    const on = tabs.querySelector(activeSel);
    if (!on) { ink.style.width = '0'; return; }
    ink.style.width = on.offsetWidth + 'px';
    ink.style.transform = `translateX(${on.offsetLeft}px)`;
    // Mantener visible la pestaña activa en móvil
    const l = on.offsetLeft - tabs.scrollLeft, r = l + on.offsetWidth;
    if (l < 0 || r > tabs.clientWidth) tabs.scrollTo({ left: on.offsetLeft - 24, behavior: 'smooth' });
  };
  // ── Sin conexión (service worker en la raíz: sw.js) ───────
  // Guarda la app al visitarla; KT.offline.download() descarga además todas las imágenes.
  KT.offline = {
    supported: 'serviceWorker' in navigator && /^https?:$/.test(location.protocol),
    ready: null,
    async status() {
      if (!this.supported) return null;
      const reg = await this.ready; if (!reg?.active) return null;
      return new Promise(res => {
        const ch = new MessageChannel();
        ch.port1.onmessage = e => res(e.data);
        reg.active.postMessage({ type: 'status' }, [ch.port2]);
        setTimeout(() => res(null), 3000);
      });
    },
    async download(onProgress) {
      if (!this.supported) { KT.toast('Este navegador no permite guardar la app sin conexión', { type: 'err' }); return false; }
      const reg = await this.ready; const sw = reg?.active || reg?.waiting || reg?.installing;
      if (!sw) { KT.toast('Vuelve a intentarlo en unos segundos', { type: 'err' }); return false; }
      return new Promise(res => {
        const ch = new MessageChannel();
        ch.port1.onmessage = e => {
          const d = e.data || {};
          if (d.type === 'progress') onProgress && onProgress(d.done, d.total);
          if (d.type === 'done') { res(d.failed === 0); }
        };
        sw.postMessage({ type: 'cacheAll' }, [ch.port2]);
      });
    },
  };
  if (KT.offline.supported) {
    KT.offline.ready = navigator.serviceWorker.register(new URL('sw.js', ROOT), { scope: ROOT.pathname })
      .then(() => navigator.serviceWorker.ready).catch(() => null);
  }
})();
