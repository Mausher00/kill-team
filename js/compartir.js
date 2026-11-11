// ============================================================
//  compartir.js — Compartir en redes sociales, sin enlace a la app
//  · En el móvil abre el menú de compartir del sistema (WhatsApp, Instagram, Telegram…),
//    con la imagen adjunta cuando el navegador lo permite.
//  · En el ordenador muestra un panel: WhatsApp, Telegram, X, copiar texto y descargar imagen.
//  · KT.share.resultCard(datos) dibuja la imagen de un resultado (marcador + logo).
//  Expone KT.share.
// ============================================================
(function () {
  const esc = KT.esc;
  const ROOT = (document.currentScript?.src || '').replace(/js\/compartir\.js.*$/, '');
  const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => rej(new Error('No se pudo cargar la imagen')); i.src = src; });
  const toBlob = (c, type = 'image/png', q) => new Promise(res => c.toBlob(res, type, q));
  const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
  const fit = (g, text, max, size, font) => { do { g.font = `800 ${size}px ${font}`; size -= 2; } while (g.measureText(text).width > max && size > 18); };

  // Imagen 1200×630 con el marcador de una partida
  async function resultCard(d, extra = {}) {
    const [a, b] = d.players, W = 1200, H = 630;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), disp = '"D-DIN Condensed", "DIN Condensed", "Arial Narrow", Arial, sans-serif', body = 'Inter, "Segoe UI", Arial, sans-serif';
    await document.fonts?.ready.catch(() => {});
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#16100d'); bg.addColorStop(.55, '#0b0b0b'); bg.addColorStop(1, '#1d0d06');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = '#e8490f'; g.fillRect(0, 0, W, 8); g.fillRect(0, H - 8, W, 8);
    g.strokeStyle = 'rgba(232,73,15,.18)'; g.lineWidth = 1;
    for (let x = -H; x < W; x += 46) { g.beginPath(); g.moveTo(x, H); g.lineTo(x + H, 0); g.stroke(); }
    try { const logo = await loadImg(ROOT + 'imagenes/app/logo-kt.webp'); const lw = 330, lh = lw * logo.naturalHeight / logo.naturalWidth; g.drawImage(logo, (W - lw) / 2, 34, lw, lh); } catch { /* sin logo */ }
    const win = a.total === b.total ? -1 : a.total > b.total ? 0 : 1, fn = x => (typeof FACTIONS !== 'undefined' && FACTIONS[x.faction]?.name) || x.faction || '';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    // marcador
    g.fillStyle = '#fff'; g.font = `800 150px ${disp}`; g.fillText(`${a.total} – ${b.total}`, W / 2, 330);
    // jugadores
    [[a, 205, 0], [b, W - 205, 1]].forEach(([p, x, k]) => {
      const name = String(p.name || 'Jugador').toUpperCase();
      g.fillStyle = win === k ? '#ff6a2b' : '#f2f2f2'; fit(g, name, 330, 58, disp); g.fillText(name, x, 300);
      g.fillStyle = '#b5aca6'; fit(g, fn(p), 330, 24, body); g.font = g.font.replace('800', '500'); g.fillText(fn(p), x, 352);
      if (win === k) { g.fillStyle = '#e8490f'; g.font = `700 22px ${disp}`; g.fillText('★  VICTORIA  ★', x, 244); }
    });
    if (win === -1) { g.fillStyle = '#b5aca6'; g.font = `700 24px ${disp}`; g.fillText('EMPATE', W / 2, 226); }
    // pie
    const when = d.date ? new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const foot = [extra.comunidad, d.crit, when].filter(Boolean).join('  ·  ');
    g.fillStyle = '#8d8580'; fit(g, foot, W - 120, 26, body); g.font = g.font.replace('800', '500'); g.fillText(foot, W / 2, H - 62);
    return toBlob(c, 'image/png');
  }
  const resultText = (d, extra = {}) => {
    const [a, b] = d.players, fn = x => (typeof FACTIONS !== 'undefined' && FACTIONS[x.faction]?.name) || x.faction || '';
    const w = a.total === b.total ? 'Empate' : `Victoria de ${(a.total > b.total ? a : b).name}`;
    return `⚔️ Kill Team${extra.comunidad ? ' · ' + extra.comunidad : ''}\n${a.name} (${fn(a)}) ${a.total} – ${b.total} ${b.name} (${fn(b)})\n${w}`;
  };

  // Abre el menú del sistema o, si no hay, el panel propio
  async function share({ title = 'Kill Team', text = '', blob = null, filename = 'kill-team.png' }) {
    const file = blob ? new File([blob], filename, { type: blob.type || 'image/png' }) : null;
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      try {
        if (file && navigator.canShare?.({ files: [file] })) { await navigator.share({ title, text, files: [file] }); return; }
        if (!file) { await navigator.share({ title, text }); return; }
      } catch (e) { if (e.name === 'AbortError') return; }
    }
    panel({ title, text, blob, filename });
  }
  function panel({ title, text, blob, filename }) {
    const t = encodeURIComponent(text), url = blob ? URL.createObjectURL(blob) : null;
    const close = KT.modal('Compartir', `<div class="sh">
      ${url ? `<img class="sh-prev" src="${url}" alt="Imagen para compartir">` : ''}
      ${text ? `<textarea class="sh-text" readonly rows="${Math.min(5, text.split('\n').length + 1)}">${esc(text)}</textarea>` : ''}
      <div class="sh-row">
        <a class="sh-btn wa" target="_blank" rel="noopener" href="https://wa.me/?text=${t}"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>
        <a class="sh-btn tg" target="_blank" rel="noopener" href="https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${t}"><i class="ti ti-brand-telegram"></i> Telegram</a>
        <a class="sh-btn x" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${t}"><i class="ti ti-brand-x"></i> X</a>
      </div>
      <div class="sh-row">
        ${text ? '<button class="icon-btn" data-sh="copy"><i class="ti ti-copy"></i> Copiar texto</button>' : ''}
        ${blob ? '<button class="icon-btn accent" data-sh="dl"><i class="ti ti-download"></i> Descargar imagen</button>' : ''}
        ${blob && navigator.clipboard?.write && window.ClipboardItem && blob.type === 'image/png' ? '<button class="icon-btn" data-sh="copyimg"><i class="ti ti-photo"></i> Copiar imagen</button>' : ''}
      </div>
      ${blob ? '<p class="usr-note">Los enlaces de WhatsApp, Telegram y X llevan solo el texto. Para la imagen, descárgala o cópiala y adjúntala (Instagram y Facebook solo admiten la imagen).</p>' : ''}
    </div>`, 'share');
    const box = document.querySelector('.cmdk-back.on:last-of-type .cmdk-list');
    box.addEventListener('click', async e => {
      const b = e.target.closest('[data-sh]'); if (!b) return;
      try {
        if (b.dataset.sh === 'copy') { await navigator.clipboard.writeText(text); KT.toast('Texto copiado', { type: 'ok' }); }
        else if (b.dataset.sh === 'dl') { download(blob, filename); }
        else if (b.dataset.sh === 'copyimg') { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); KT.toast('Imagen copiada', { type: 'ok' }); }
      } catch { KT.toast('No se pudo copiar: prueba a descargar', { type: 'err' }); }
    });
    return close;
  }

  KT.share = {
    open: share, resultCard, resultText,
    async result(d, extra) { KT.toast('Preparando imagen…'); const blob = await resultCard(d, extra); return share({ title: 'Resultado de Kill Team', text: resultText(d, extra), blob, filename: 'resultado-kill-team.png' }); },
    // Foto de la galería o del tablón: se descarga para poder adjuntarla
    async photo(url, text) {
      let blob = null;
      try { const r = await fetch(url, { mode: 'cors' }); if (r.ok) blob = await r.blob(); } catch { /* sin acceso: solo texto */ }
      return share({ title: 'Kill Team', text: text || '', blob, filename: 'kill-team.jpg' });
    },
  };
})();
