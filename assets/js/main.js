/* =========================================================
   Vetro OS · Capri — interacción de la presentación
   ========================================================= */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · Plantillas compartidas: barra de menú y Dock */
  $$('[data-menubar]').forEach((slot) => {
    const frag = $('#tpl-menubar').content.cloneNode(true);
    $('.mb-app', frag).textContent = slot.dataset.menubar;
    const menus = (slot.dataset.menus || 'Archivo,Edición,Visualización,Ir,Ventana,Ayuda').split(',');
    const wrap = $('.mb-menus', frag);
    menus.forEach((name) => {
      const item = document.createElement('span');
      item.textContent = name;
      wrap.append(item);
    });
    if (slot.hasAttribute('data-shown')) $('.menubar', frag).classList.add('is-shown');
    slot.replaceWith(frag);
  });

  $$('[data-dock]').forEach((slot) => {
    const frag = $('#tpl-dock').content.cloneNode(true);
    const active = $(`[data-app="${slot.dataset.dock}"]`, frag);
    if (active) active.classList.add('is-running', 'is-active');
    slot.replaceWith(frag);
  });

  /* 2 · El escritorio también trae su Centro de control (cerrado) */
  const desk = $('#desk-screen');
  const ccSource = $('#cc-panel');
  if (desk && ccSource) {
    const cc = ccSource.cloneNode(true);
    cc.removeAttribute('id');
    desk.append(cc);
  }

  /* 3 · Clones: widgets y portada */
  $$('[data-clone]').forEach((slot) => {
    const src = $(slot.dataset.clone);
    if (!src) return;
    const copy = src.cloneNode(true);
    copy.removeAttribute('id');
    slot.append(copy);
  });

  $$('[data-clone-screen]').forEach((stage) => {
    const src = $(stage.dataset.cloneScreen);
    if (!src) return;
    const copy = src.cloneNode(true);
    copy.removeAttribute('id');
    $$('[id]', copy).forEach((el) => el.removeAttribute('id'));
    $$('label[for]', copy).forEach((el) => el.removeAttribute('for'));
    $('.menubar', copy)?.classList.add('is-shown');
    stage.append(copy);
  });

  /* 4 · Respaldo de escala para navegadores sin tan(atan2()) */
  const cssScales = CSS.supports('width: calc(1px * tan(atan2(1px, 2px)))');
  if (!cssScales && 'ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const w = parseFloat(getComputedStyle(target).getPropertyValue('--design-w')) || 1440;
        target.querySelectorAll(':scope > .screen').forEach((s) => s.style.setProperty('--k', target.clientWidth / w));
      });
    });
    $$('.stage').forEach((s) => ro.observe(s));
  }

  /* 5 · Barra de menú: aparece al llevar el cursor arriba */
  $$('.screen').forEach((screen) => {
    const bar = $('.menubar', screen);
    const zone = $('.mb-zone', screen);
    const handle = $('.mb-handle', screen);
    if (!bar) return;
    const show = () => bar.classList.add('is-shown');
    zone?.addEventListener('mouseenter', show);
    handle?.addEventListener('click', show);
  });

  /* Demostración en el escritorio: el cursor sube y la barra baja */
  if (desk && 'IntersectionObserver' in window) {
    const bar = $('.menubar', desk);
    let played = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        if (reduceMotion) { bar?.classList.add('is-shown'); return; }
        desk.classList.add('demo-cursor');
        setTimeout(() => bar?.classList.add('is-shown'), 1450);
      });
    }, { threshold: 0.55 });
    io.observe(desk);
  }

  /* 6 · Centro de control y menú Inicio del escritorio */
  // Sección dedicada: vuelve a deslizarse cada vez que entra en pantalla
  const ccPanel = $('#cc-panel');
  if (ccPanel && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        ccPanel.classList.remove('is-sliding');
        void ccPanel.offsetWidth;
        ccPanel.classList.add('is-sliding');
      });
    }, { threshold: 0.6 });
    io.observe(ccPanel.closest('.screen'));
  }

  // En el escritorio: la barra abre el Centro de control y el Dock abre Inicio
  if (desk) {
    const ccBtn = $('.mb-cc', desk);
    const panel = $('.cc', desk);
    const start = $('.dock-start', desk);
    const menu = $('.startmenu', desk);
    const setCC = (open) => {
      panel?.classList.toggle('is-open', open);
      ccBtn?.classList.toggle('is-on', open);
    };
    const setStart = (open) => menu?.classList.toggle('is-open', open);

    ccBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      setStart(false);
      setCC(!panel.classList.contains('is-open'));
    });
    start?.addEventListener('click', (e) => {
      e.stopPropagation();
      setCC(false);
      setStart(!menu.classList.contains('is-open'));
    });
    desk.addEventListener('click', (e) => {
      if (panel && !panel.contains(e.target)) setCC(false);
      if (menu && !menu.contains(e.target)) setStart(false);
    });
  }

  /* 8 · Pequeños detalles interactivos */
  $$('.cc-round, .cc-row--a .cc-tile').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('cc-batt')) return;
      (el.matches('.cc-tile') ? $('.cc-ico', el) : el).classList.toggle('on');
    });
  });

  $$('.tg').forEach((el) => el.addEventListener('click', () => el.classList.toggle('on')));

  $$('.seg').forEach((seg) => {
    seg.addEventListener('click', (e) => {
      const opt = e.target.closest('span');
      if (!opt) return;
      $$('span', seg).forEach((s) => s.classList.toggle('on', s === opt));
    });
  });

  $$('.fx-plus').forEach((btn) => {
    const menu = $('.attach-menu', btn.closest('.fx-composer'));
    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('on');
      menu?.classList.toggle('is-closed', !open);
    });
  });

  // Inicio de sesión: solo efecto visual, nunca envía datos
  $$('.login-card').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('is-ok');
      setTimeout(() => form.classList.remove('is-ok'), 1600);
    });
  });

  /* 9 · Navegación: parte activa y teclado para presentar */
  const links = $$('.parts-nav a');
  const parts = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((a) => {
          const on = a.getAttribute('href') === id;
          a.classList.toggle('is-active', on);
          if (on) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    parts.forEach((p) => io.observe(p));
  }

  const stops = [$('#portada'), ...parts].filter(Boolean);
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    const next = ['ArrowRight', 'PageDown'].includes(e.key);
    const prev = ['ArrowLeft', 'PageUp'].includes(e.key);
    if (!next && !prev) return;
    e.preventDefault();
    const y = window.scrollY + 120;
    let i = stops.findIndex((s) => s.offsetTop > y);
    if (i === -1) i = stops.length;
    const target = next ? stops[i] : stops[Math.max(0, i - 2)];
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
