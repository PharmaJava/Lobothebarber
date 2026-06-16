/* ============================================================
   Lobo the Barber · Lógica del sitio público
   ------------------------------------------------------------
   - Renderiza las secciones a partir del contenido (data-driven).
   - Aplica enlaces de marca y personalizaciones del panel admin.
   - Gestiona navbar, menú móvil, animaciones y formulario.
   ============================================================ */
(function () {
  'use strict';

  // Se asigna tras cargar el contenido publicado (ver bootstrap).
  let content = (window.LoboStore && LoboStore.getContent())
    || window.LOBO_CONFIG || {};

  /* ---------- Carga del contenido publicado (data/content.json) ---------- */
  async function loadPublished() {
    try {
      const res = await fetch('data/content.json', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (window.LoboStore) LoboStore.setPublished(json);
      }
    } catch (e) {
      // Sin conexión o sin archivo: se usan los valores por defecto.
    }
    content = (window.LoboStore && LoboStore.getContent()) || content;
  }

  /* ---------- Utilidades ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Resuelve una ruta tipo "business.address.city" sobre el contenido.
  const path = (obj, p) => p.split('.').reduce((o, key) => (o == null ? o : o[key]), obj);

  /* ---------- Enlaces y textos de marca (data-bindings) ---------- */
  function applyBindings() {
    $$('[data-text]').forEach((el) => {
      const v = path(content, el.getAttribute('data-text'));
      if (v != null) el.textContent = v;
    });
    $$('[data-href]').forEach((el) => {
      const v = path(content, el.getAttribute('data-href'));
      if (v != null) el.setAttribute('href', v);
    });
    $$('[data-bg]').forEach((el) => {
      const v = path(content, el.getAttribute('data-bg'));
      if (v) el.style.backgroundImage = `url('${v}')`;
    });
    $$('[data-src]').forEach((el) => {
      const v = path(content, el.getAttribute('data-src'));
      if (v) el.setAttribute('src', v);
    });

    // WhatsApp: enlace con mensaje predefinido
    const wa = path(content, 'business.whatsapp');
    if (wa) {
      const msg = path(content, 'business.whatsappMessage');
      const suffix = msg ? `?text=${encodeURIComponent(msg)}` : '';
      $$('[data-whatsapp]').forEach((el) => el.setAttribute('href', `https://wa.me/${wa}${suffix}`));
    }

    // Teléfono: enlace click-to-call
    const tel = path(content, 'business.phone');
    if (tel) $$('[data-tel]').forEach((el) => el.setAttribute('href', `tel:${tel.replace(/\s+/g, '')}`));

    // Mapa de Google
    const a = content.business && content.business.address;
    if (a) {
      const q = encodeURIComponent(`Lobo the Barber, ${a.street}, ${a.postalCode} ${a.city}`);
      $$('[data-map]').forEach((el) => el.setAttribute('src', `https://www.google.com/maps?q=${q}&output=embed`));
      $$('[data-directions]').forEach((el) => el.setAttribute('href', `https://www.google.com/maps/dir/?api=1&destination=${q}`));
      $$('[data-address]').forEach((el) => { el.textContent = `${a.street}, ${a.postalCode} ${a.city}, ${a.country}`; });
    }
  }

  /* ---------- Render: Servicios ---------- */
  function renderServices() {
    const grid = $('#services-grid');
    if (!grid) return;
    grid.innerHTML = (content.services || []).map((s) => `
      <div class="bg-stone border border-white/5 rounded-2xl p-7 card-hover reveal">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-display font-600 uppercase text-white text-xl">${esc(s.name)}</h3>
          <span class="font-display text-gold text-2xl font-600 whitespace-nowrap">${esc(s.price)}</span>
        </div>
        <p class="text-gray-400 text-sm leading-relaxed">${esc(s.desc)}</p>
        <p class="mt-4 text-xs uppercase tracking-wide text-gray-500">${esc(s.duration)}${s.badge ? ' · ' + esc(s.badge) : ''}</p>
      </div>`).join('');
  }

  /* ---------- Render: Bonos / Extras ---------- */
  function renderPackages() {
    const grid = $('#packages-grid');
    if (!grid) return;
    const accent = { forest: 'from-forest/40', blood: 'from-blood/30' };
    grid.innerHTML = (content.packages || []).map((p) => `
      <div class="bg-gradient-to-br ${accent[p.accent] || 'from-stone'} to-stone border border-gold/20 rounded-2xl p-8 reveal">
        <h3 class="font-display font-600 uppercase text-gold text-xl mb-2">${esc(p.title)}</h3>
        <p class="text-gray-300 text-sm leading-relaxed mb-3">${esc(p.desc)}</p>
        <p class="text-xs uppercase tracking-wide text-gray-500">${esc(p.note)}</p>
      </div>`).join('');
  }

  /* ---------- Render: Reseñas ---------- */
  function renderReviews() {
    const grid = $('#reviews-grid');
    if (!grid) return;
    grid.innerHTML = (content.reviews || []).map((r) => `
      <figure class="bg-stone border border-white/5 rounded-2xl p-7 card-hover reveal">
        <div class="text-gold mb-3 tracking-wider">★★★★★</div>
        <blockquote class="text-gray-300 leading-relaxed mb-5">"${esc(r.text)}"</blockquote>
        <figcaption class="font-display uppercase text-white text-sm tracking-wide">${esc(r.author)}</figcaption>
      </figure>`).join('');
  }

  /* ---------- Render: Galería ---------- */
  function renderGallery() {
    const grid = $('#gallery-grid');
    if (!grid) return;
    grid.innerHTML = (content.gallery || []).map((g, i) => `
      <div class="gallery-item overflow-hidden rounded-xl reveal aspect-square" style="--i:${i % 3}">
        <img src="${esc(g.src)}" alt="${esc(g.alt || 'Trabajo de Lobo the Barber en Sevilla')}" width="600" height="600" loading="lazy" decoding="async" class="fade-img w-full h-full object-cover" />
      </div>`).join('');
  }

  /* ---------- Render: Horario ---------- */
  function renderHours() {
    const list = $('#hours-list');
    if (!list) return;
    const hours = (content.business && content.business.hours) || [];
    list.innerHTML = hours.map((h, i) => `
      <li class="flex justify-between ${i < hours.length - 1 ? 'border-b border-white/5 pb-2' : ''}">
        <span class="text-gray-300">${esc(h.days)}</span>
        <span class="${h.closed ? 'text-blood font-600' : 'text-white'}">${esc(h.time)}</span>
      </li>`).join('');
  }

  /* ---------- Render: Banda de cifras (con count-up) ---------- */
  function renderStats() {
    const grid = $('#stats-grid');
    if (!grid) return;
    grid.innerHTML = (content.stats || []).map((s, i) => `
      <div class="reveal" style="--i:${i}">
        <p class="font-display text-gold text-4xl sm:text-5xl font-700 leading-none">
          <span aria-hidden="true">${esc(s.icon || '')}</span>
          <span class="count" data-target="${Number(s.value) || 0}">0</span><span>${esc(s.suffix || '')}</span>
        </p>
        <p class="mt-2 text-xs sm:text-sm uppercase tracking-wide text-gray-400">${esc(s.label)}</p>
      </div>`).join('');
  }

  /* ---------- Render: FAQ (acordeón accesible) ---------- */
  function renderFAQ() {
    const list = $('#faq-list');
    if (!list) return;
    list.innerHTML = (content.faqs || []).map((f, i) => `
      <div class="faq-item">
        <button class="faq-q" id="faq-q-${i}" aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${esc(f.q)}</span>
          <svg class="faq-icon w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
        </button>
        <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${esc(f.a)}</p></div>
      </div>`).join('');

    $$('.faq-q', list).forEach((btn) => btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
    }));
  }

  /* ---------- Indicador "Abierto ahora" ---------- */
  const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function toMin(hhmm) { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0); }

  function computeOpenState() {
    const sched = path(content, 'business.schedule') || [];
    const now = new Date();
    const dow = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const block of sched) {
      if (block.days.includes(dow) && mins >= toMin(block.open) && mins < toMin(block.close)) {
        return { open: true, text: `Abierto ahora · cierra a las ${block.close}` };
      }
    }
    // Buscar la próxima apertura (hoy más tarde o días siguientes).
    for (let i = 0; i < 7; i++) {
      const d = (dow + i) % 7;
      const blocks = sched.filter((b) => b.days.includes(d)).sort((a, b) => toMin(a.open) - toMin(b.open));
      for (const b of blocks) {
        if (i > 0 || toMin(b.open) > mins) {
          const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DAYS[d]}`;
          return { open: false, text: `Cerrado · abre ${when} a las ${b.open}` };
        }
      }
    }
    return { open: false, text: 'Cerrado ahora' };
  }

  function renderOpenStatus() {
    const state = computeOpenState();
    ['#nav-status', '#hero-status', '#hours-status'].forEach((sel) => {
      const wrap = $(sel);
      if (!wrap) return;
      wrap.classList.remove('hidden');
      wrap.classList.add('inline-flex');
      const dot = $('.status-dot', wrap);
      const txt = $('.status-text', wrap);
      if (dot) dot.className = 'status-dot ' + (state.open ? 'open' : 'closed');
      if (txt) txt.textContent = state.text;
    });
  }

  /* ---------- Count-up de las cifras ---------- */
  function animateCount(el) {
    const target = Number(el.getAttribute('data-target')) || 0;
    if (prefersReducedMotion()) { el.textContent = target.toLocaleString('es-ES'); return; }
    const dur = 1400;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('es-ES');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = $$('.count');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) { counters.forEach(animateCount); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Scrollspy: resalta el enlace de la sección visible ---------- */
  function initScrollSpy() {
    const links = $$('.nav-link');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const map = {};
    links.forEach((l) => { map[l.getAttribute('href')] = l; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          const link = map['#' + e.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['nosotros', 'servicios', 'galeria', 'resenas', 'faq', 'contacto'].forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ---------- Carga elegante de imágenes (blur -> nítido) ---------- */
  function initImageFade() {
    $$('img.fade-img').forEach((img) => {
      if (img.complete && img.naturalWidth) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });
  }

  /* ---------- Botones magnéticos (sutil, solo ratón) ---------- */
  function initMagnetic() {
    if (prefersReducedMotion() || !window.matchMedia('(pointer:fine)').matches) return;
    $$('.btn-sheen').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Datos estructurados (JSON-LD) ---------- */
  function injectSchema() {
    const b = content.business || {};
    const a = b.address || {};
    const domain = b.domain || '';
    const ENG = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
    const hoursSpec = (b.schedule || []).map((blk) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: blk.days.map((d) => ENG[d]),
      opens: blk.open,
      closes: blk.close,
    }));

    const business = {
      '@type': ['HairSalon', 'BarberShop'],
      '@id': domain + '#barbershop',
      name: b.name,
      image: domain + 'assets/og-image.jpg',
      description: 'Barbería premium en Sevilla. Cortes precisos, barbas impecables y experiencia única con ' + (b.barber || '') + '.',
      url: domain,
      telephone: b.phone,
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Efectivo, Tarjeta',
      address: {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.region || a.city,
        postalCode: a.postalCode,
        addressCountry: 'ES',
      },
      geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
      hasMap: a.lat ? `https://www.google.com/maps?q=${a.lat},${a.lng}` : undefined,
      areaServed: (b.areaServed || []).map((n) => ({ '@type': 'City', name: n })),
      openingHoursSpecification: hoursSpec,
      aggregateRating: { '@type': 'AggregateRating', ratingValue: b.rating, reviewCount: b.reviewCount, bestRating: '5' },
      founder: b.barber ? { '@type': 'Person', name: b.barber } : undefined,
      sameAs: [b.bookingUrl, b.instagram, b.facebook].filter(Boolean),
      potentialAction: b.bookingUrl ? { '@type': 'ReserveAction', target: b.bookingUrl } : undefined,
      makesOffer: (content.services || []).map((s) => ({
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: String(s.price || '').replace(/[^0-9,.]/g, '').replace(',', '.'),
        itemOffered: { '@type': 'Service', name: s.name },
      })),
    };

    const website = {
      '@type': 'WebSite',
      '@id': domain + '#website',
      url: domain,
      name: b.name,
      inLanguage: 'es-ES',
      publisher: { '@id': domain + '#barbershop' },
    };

    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: domain },
        { '@type': 'ListItem', position: 2, name: 'Barbería en Sevilla', item: domain + '#servicios' },
      ],
    };

    const faqPage = (content.faqs && content.faqs.length) ? {
      '@type': 'FAQPage',
      '@id': domain + '#faq',
      mainEntity: content.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    } : null;

    const graph = [business, website, breadcrumb];
    if (faqPage) graph.push(faqPage);

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    document.head.appendChild(tag);
  }

  /* ---------- UI: navbar, menú, animaciones ---------- */
  function initUI() {
    // Año dinámico
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    // Navbar con fondo al hacer scroll
    const navbar = $('#navbar');
    if (navbar) {
      const cls = ['bg-ink/90', 'backdrop-blur', 'shadow-lg', 'border-b', 'border-white/10'];
      const onScroll = () => navbar.classList[window.scrollY > 40 ? 'add' : 'remove'](...cls);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Menú móvil
    const menuBtn = $('#menu-btn');
    const mobileMenu = $('#mobile-menu');
    const iconOpen = $('#icon-open');
    const iconClose = $('#icon-close');
    if (menuBtn && mobileMenu) {
      const toggle = (open) => {
        mobileMenu.classList.toggle('hidden', !open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (iconOpen) iconOpen.classList.toggle('hidden', open);
        if (iconClose) iconClose.classList.toggle('hidden', !open);
      };
      menuBtn.addEventListener('click', () => toggle(mobileMenu.classList.contains('hidden')));
      $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => toggle(false)));
    }
  }

  /* ---------- Animaciones reveal (observa nodos dinámicos) ---------- */
  function observeReveal() {
    const els = $$('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Formulario de contacto (demo) ---------- */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('#form-msg');
      if (msg) msg.classList.remove('hidden');
      form.reset();
    });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    await loadPublished();
    applyBindings();
    renderServices();
    renderPackages();
    renderReviews();
    renderGallery();
    renderHours();
    renderStats();
    renderFAQ();
    renderOpenStatus();
    injectSchema();
    initUI();
    initContactForm();
    observeReveal();
    initCounters();
    initScrollSpy();
    initImageFade();
    initMagnetic();
    // Refresca el estado abierto/cerrado cada minuto.
    setInterval(renderOpenStatus, 60000);
  });
})();
