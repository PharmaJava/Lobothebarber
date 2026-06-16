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

    // WhatsApp: construir enlaces a partir del número
    const wa = path(content, 'business.whatsapp');
    if (wa) $$('[data-whatsapp]').forEach((el) => el.setAttribute('href', `https://wa.me/${wa}`));

    // Mapa de Google
    const a = content.business && content.business.address;
    if (a) {
      const q = encodeURIComponent(`${a.street}, ${a.postalCode} ${a.city}`);
      $$('[data-map]').forEach((el) => el.setAttribute('src', `https://www.google.com/maps?q=${q}&output=embed`));
      $$('[data-directions]').forEach((el) => el.setAttribute('href', `https://maps.google.com/?q=${q}`));
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
    grid.innerHTML = (content.gallery || []).map((g) => `
      <div class="gallery-item overflow-hidden rounded-xl reveal aspect-square">
        <img src="${esc(g.src)}" alt="${esc(g.alt || 'Trabajo de Lobo the Barber en Sevilla')}" loading="lazy" class="w-full h-full object-cover" />
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

  /* ---------- Datos estructurados (JSON-LD) ---------- */
  function injectSchema() {
    const b = content.business || {};
    const a = b.address || {};
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: b.name,
      image: (b.domain || '') + 'assets/og-image.jpg',
      description: 'Barbería premium en Sevilla. Cortes precisos, barbas impecables y experiencia única con ' + (b.barber || '') + '.',
      '@id': b.domain,
      url: b.domain,
      telephone: b.phone,
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        addressLocality: a.city,
        postalCode: a.postalCode,
        addressCountry: 'ES',
      },
      geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '20:30' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:30', closes: '14:00' },
      ],
      aggregateRating: { '@type': 'AggregateRating', ratingValue: b.rating, reviewCount: b.reviewCount },
      sameAs: [b.bookingUrl, b.instagram, b.facebook].filter(Boolean),
    };
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(schema);
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
    injectSchema();
    initUI();
    initContactForm();
    observeReveal();
  });
})();
