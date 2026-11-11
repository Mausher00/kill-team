// ============================================================
//  calendario.js — Invitaciones con fecha
//  Sin servidor: genera un archivo .ics (cualquier calendario), un
//  enlace de Google Calendar y un mensaje para WhatsApp.
//  Expone KT.cal.
// ============================================================
(function () {
  const esc = KT.esc, pad = n => String(n).padStart(2, '0');
  const utc = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const fold = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  const C = KT.cal = {
    // ev: { title, start: Date, mins, desc, place, url }
    ics(ev) {
      const end = new Date(ev.start.getTime() + (ev.mins || 120) * 60000);
      return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kill Team Companion//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
        'UID:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + '@killteam-companion', 'DTSTAMP:' + utc(new Date()),
        'DTSTART:' + utc(ev.start), 'DTEND:' + utc(end), 'SUMMARY:' + fold(ev.title),
        'DESCRIPTION:' + fold([ev.desc, ev.url].filter(Boolean).join('\n')), ev.place ? 'LOCATION:' + fold(ev.place) : '', ev.url ? 'URL:' + ev.url : '',
        'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + fold(ev.title), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].filter(Boolean).join('\r\n');
    },
    google(ev) {
      const end = new Date(ev.start.getTime() + (ev.mins || 120) * 60000);
      const q = new URLSearchParams({ action: 'TEMPLATE', text: ev.title, dates: utc(ev.start) + '/' + utc(end), details: [ev.desc, ev.url].filter(Boolean).join('\n'), location: ev.place || '' });
      return 'https://calendar.google.com/calendar/render?' + q;
    },
    text(ev) {
      const when = ev.start.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      return [`${ev.title}`, `📅 ${when}${ev.place ? ' · ' + ev.place : ''}`, ev.desc, ev.url].filter(Boolean).join('\n');
    },
    download(ev) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([C.ics(ev)], { type: 'text/calendar;charset=utf-8' }));
      a.download = 'partida-kill-team.ics'; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },
    // Abre el panel «Proponer fecha». base: { title, desc, url, place, start? } · onSave(ev) opcional
    open(base = {}, onSave) {
      const d0 = base.start ? new Date(base.start) : (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); d.setHours(17, 0, 0, 0); return d; })();
      const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const close = KT.modal('Proponer fecha', `
        <form class="usr cal-form">
          <div class="usr-form">
            <label>Día<input type="date" name="d" value="${iso(d0)}" required></label>
            <label>Hora<input type="time" name="t" value="${pad(d0.getHours())}:${pad(d0.getMinutes())}" required></label>
            <label>Duración<select name="m"><option value="90">1 h 30</option><option value="120" selected>2 h</option><option value="180">3 h</option><option value="240">4 h</option></select></label>
          </div>
          <div class="usr-form"><label>Lugar <small>(opcional)</small><input name="p" maxlength="80" value="${esc(base.place || '')}" placeholder="Casa de…, club, tienda"></label></div>
          <div class="usr-form"><label>Título<input name="s" maxlength="80" value="${esc(base.title || 'Partida de Kill Team')}"></label></div>
          <div class="usr-row" style="flex-wrap:wrap">
            <button class="icon-btn accent" type="button" data-cal="wa"><i class="ti ti-brand-whatsapp"></i> Enviar por WhatsApp</button>
            <button class="icon-btn" type="button" data-cal="ics"><i class="ti ti-calendar-plus"></i> Añadir a mi calendario</button>
            <button class="icon-btn" type="button" data-cal="g"><i class="ti ti-brand-google"></i> Google Calendar</button>
            <button class="icon-btn" type="button" data-cal="copy"><i class="ti ti-copy"></i> Copiar</button>
            ${onSave ? '<button class="icon-btn" type="button" data-cal="save"><i class="ti ti-device-floppy"></i> Guardar fecha</button>' : ''}
          </div>
          <p class="usr-note">«Añadir a mi calendario» descarga un archivo .ics que abre cualquier calendario (móvil, Outlook, Apple). El mensaje de WhatsApp lleva la fecha${base.url ? ' y el enlace para unirse a la partida' : ''}; el otro jugador puede añadirla a su calendario desde su propia app.</p>
        </form>`, 'calendar-event');
      const form = document.querySelector('.cmdk-back.on:last-of-type .cal-form');
      const ev = () => { const f = new FormData(form); return { ...base, title: f.get('s') || 'Partida de Kill Team', start: new Date(f.get('d') + 'T' + f.get('t')), mins: +f.get('m'), place: f.get('p') }; };
      form.addEventListener('submit', e => e.preventDefault());
      form.addEventListener('click', e => {
        const b = e.target.closest('[data-cal]'); if (!b) return;
        const v = ev(); if (isNaN(v.start)) { KT.toast('Elige día y hora', { type: 'err' }); return; }
        const a = b.dataset.cal;
        if (a === 'ics') C.download(v);
        else if (a === 'g') window.open(C.google(v), '_blank', 'noopener');
        else if (a === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(C.text(v)), '_blank', 'noopener');
        else if (a === 'copy') navigator.clipboard?.writeText(C.text(v)).then(() => KT.toast('Invitación copiada', { type: 'ok' }));
        else if (a === 'save') { onSave(v); close(); }
      });
      return close;
    },
  };
})();
