/* ============================================================
   Lobo the Barber · Panel de administración
   ------------------------------------------------------------
   Editor de contenido para hosting estático. Permite gestionar
   imágenes (galería, hero, "sobre nosotros") y datos del negocio
   sin tocar código. Los cambios se guardan en este navegador
   (localStorage) y se ven al instante en la web.

   ⚠️  IMPORTANTE — sobre seguridad y publicación:
   - El código de acceso es una barrera de conveniencia (cliente),
     NO seguridad real: cualquiera con el archivo puede leer el JS.
     No publiques datos sensibles aquí.
   - Para que los cambios los vean TODOS los visitantes (no solo
     este navegador), pulsa "Exportar" y:
       a) pega el JSON en assets/js/config.js y haz commit, o
       b) conéctalo a un backend / Supabase (ver README).
   ============================================================ */
(function () {
  'use strict';

  // Hash SHA-256 del código por defecto "lobo2024".
  // Cámbialo desde el panel (Ajustes) o sustituye este hash.
  const DEFAULT_PASS_HASH = 'b867d9d6dcbd663fd2f440c532e13d733a2a416ae19c077437e77c6883027f2a';
  const PASS_KEY = 'adminPassHash';
  const SESSION_KEY = 'lobo.admin.session';
  const MAX_IMG_WIDTH = 1280;   // px — redimensionado automático
  const JPEG_QUALITY = 0.82;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Hash ---------- */
  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  const getPassHash = () => LoboStore.get(PASS_KEY, DEFAULT_PASS_HASH);

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- Acceso ---------- */
  async function tryLogin(code) {
    const hash = await sha256(code);
    if (hash === getPassHash()) {
      sessionStorage.setItem(SESSION_KEY, '1');
      showPanel();
      return true;
    }
    return false;
  }
  const isLogged = () => sessionStorage.getItem(SESSION_KEY) === '1';
  function logout() { sessionStorage.removeItem(SESSION_KEY); location.reload(); }

  async function showPanel() {
    $('#login-view').classList.add('hidden');
    $('#panel-view').classList.remove('hidden');
    await loadPublished();
    renderAll();
  }

  /* ---------- Imágenes: redimensionado a data-URL ---------- */
  function fileToResizedDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) return reject(new Error('No es una imagen'));
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, MAX_IMG_WIDTH / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Estado de trabajo (overrides en memoria) ---------- */
  function content() { return LoboStore.getContent(); }

  function save(patch, msg) {
    if (LoboStore.patchContent(patch)) {
      toast(msg || 'Guardado ✓');
      renderUsage();
    } else {
      toast('⚠️ No se pudo guardar (almacenamiento lleno)');
    }
  }

  /* ---------- Render: Galería ---------- */
  function renderGallery() {
    const wrap = $('#admin-gallery');
    const items = content().gallery || [];
    wrap.innerHTML = items.map((g, i) => `
      <div class="thumb">
        <img src="${g.src}" alt="${(g.alt || '').replace(/"/g, '&quot;')}" />
        <button class="thumb-del" data-del="${i}" title="Eliminar" aria-label="Eliminar imagen">×</button>
      </div>`).join('') || '<p class="text-gray-500 text-sm col-span-full">No hay imágenes todavía.</p>';

    $$('[data-del]', wrap).forEach((btn) => btn.addEventListener('click', () => {
      const i = +btn.getAttribute('data-del');
      const arr = (content().gallery || []).slice();
      arr.splice(i, 1);
      save({ gallery: arr }, 'Imagen eliminada');
      renderGallery();
    }));
  }

  async function addGalleryFiles(files) {
    const arr = (content().gallery || []).slice();
    let added = 0;
    for (const file of files) {
      try {
        const src = await fileToResizedDataURL(file);
        arr.push({ src, alt: 'Trabajo de Lobo the Barber en Sevilla' });
        added++;
      } catch (e) { console.warn(e); }
    }
    if (added) { save({ gallery: arr }, `${added} imagen(es) añadida(s)`); renderGallery(); }
    else toast('No se añadió ninguna imagen');
  }

  /* ---------- Render: Imágenes principales ---------- */
  function renderMainImages() {
    const c = content();
    $('#hero-preview').src = c.images.hero || '';
    $('#about-preview').src = c.images.about || '';
  }

  async function setMainImage(key, file) {
    try {
      const src = await fileToResizedDataURL(file);
      save({ images: { [key]: src } }, 'Imagen actualizada');
      renderMainImages();
    } catch (e) { toast('Error al procesar la imagen'); }
  }

  /* ---------- Render: Datos del negocio ---------- */
  const BUSINESS_FIELDS = [
    ['name', 'Nombre'], ['tagline', 'Eslogan'], ['barber', 'Barbero'],
    ['bookingUrl', 'Enlace de reservas (Booksy)'], ['whatsapp', 'WhatsApp (intl. sin +)'],
    ['phone', 'Teléfono'], ['instagram', 'Instagram'], ['facebook', 'Facebook'],
  ];

  function renderBusinessForm() {
    const b = content().business || {};
    const form = $('#business-form');
    form.innerHTML = BUSINESS_FIELDS.map(([key, label]) => `
      <div>
        <label class="admin-label" for="bf-${key}">${label}</label>
        <input class="admin-input" id="bf-${key}" data-field="${key}" value="${(b[key] || '').toString().replace(/"/g, '&quot;')}" />
      </div>`).join('');
  }

  function saveBusinessForm() {
    const patch = {};
    $$('#business-form [data-field]').forEach((inp) => { patch[inp.getAttribute('data-field')] = inp.value.trim(); });
    save({ business: patch }, 'Datos guardados ✓');
  }

  /* ---------- Export / Import / Reset ---------- */
  function exportJSON() {
    const data = JSON.stringify(LoboStore.getOverrides(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lobo-content.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Exportado: lobo-content.json');
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        LoboStore.setOverrides(obj);
        toast('Importado ✓');
        renderAll();
      } catch (e) { toast('JSON no válido'); }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (confirm('¿Restablecer todo el contenido a los valores por defecto? Se perderán los cambios locales.')) {
      LoboStore.resetOverrides();
      toast('Restablecido');
      renderAll();
    }
  }

  /* ---------- Cambio de código ---------- */
  async function changePass(newCode) {
    if (!newCode || newCode.length < 4) { toast('Mínimo 4 caracteres'); return; }
    LoboStore.set(PASS_KEY, await sha256(newCode));
    toast('Código actualizado ✓');
  }

  function renderUsage() {
    const el = $('#usage');
    if (el) el.textContent = `Almacenamiento local usado: ${LoboStore.usageKB()} KB (límite del navegador ≈ 5 MB)`;
  }

  /* ---------- Carga del contenido ya publicado ---------- */
  async function loadPublished() {
    try {
      const res = await fetch('data/content.json', { cache: 'no-store' });
      if (res.ok) LoboStore.setPublished(await res.json());
    } catch (e) { /* sin archivo o sin servidor */ }
  }

  /* ---------- Conexión con GitHub ---------- */
  function renderGitHub() {
    const c = LoboGitHub.cfg();
    ['owner', 'repo', 'branch', 'token'].forEach((f) => {
      const inp = $('#gh-' + f);
      if (inp && c[f]) inp.value = c[f];
    });
    setGhStatus(LoboGitHub.isConfigured() ? 'Conexión guardada. Pulsa "Probar" para verificar.' : 'Sin configurar.', LoboGitHub.isConfigured());
  }

  function setGhStatus(msg, ok) {
    const el = $('#gh-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'text-sm mt-2 ' + (ok === true ? 'text-green-400' : ok === false ? 'text-gray-400' : 'text-yellow-400');
  }

  function saveGitHub() {
    LoboGitHub.setCfg({
      owner: $('#gh-owner').value.trim(),
      repo: $('#gh-repo').value.trim(),
      branch: ($('#gh-branch').value.trim() || 'main'),
      token: $('#gh-token').value.trim(),
    });
    toast('Conexión guardada ✓');
    renderGitHub();
  }

  async function testGitHub() {
    saveGitHub();
    setGhStatus('Comprobando…', null);
    try {
      const repo = await LoboGitHub.test();
      setGhStatus(`✓ Conectado a ${repo.full_name} (rama por defecto: ${repo.default_branch}).`, true);
    } catch (e) {
      setGhStatus('✗ ' + e.message + ' — revisa owner/repo/token y permisos (Contents: write).', false);
    }
  }

  /* ---------- Publicar en GitHub ---------- */
  function setPublishing(on) {
    const btn = $('#publish-btn');
    if (!btn) return;
    btn.disabled = on;
    btn.textContent = on ? '⏳ Publicando…' : '🚀 Publicar en la web';
    btn.classList.toggle('opacity-60', on);
  }

  async function publish() {
    if (!LoboGitHub.isConfigured()) { toast('Configura primero la conexión con GitHub'); return; }
    if (!confirm('¿Publicar los cambios en la web? Se subirán las imágenes nuevas y se actualizará el contenido para todos los visitantes.')) return;

    setPublishing(true);
    try {
      // Trabajamos sobre los overrides (borrador) para no perder los defaults.
      const data = LoboStore.clone(LoboStore.getOverrides());
      const stamp = Date.now();

      // Subir imágenes principales que estén como data-URL.
      if (data.images) {
        for (const key of ['hero', 'about']) {
          const v = data.images[key];
          if (typeof v === 'string' && v.startsWith('data:')) {
            const path = `assets/img/${key}-${stamp}.jpg`;
            await LoboGitHub.uploadImage(path, v, `admin: imagen ${key}`);
            data.images[key] = path;
          }
        }
      }

      // Subir imágenes de galería que estén como data-URL.
      if (Array.isArray(data.gallery)) {
        for (let i = 0; i < data.gallery.length; i++) {
          const g = data.gallery[i];
          if (g && typeof g.src === 'string' && g.src.startsWith('data:')) {
            const path = `assets/img/gallery/${stamp}-${i}.jpg`;
            await LoboGitHub.uploadImage(path, g.src, 'admin: imagen de galería');
            g.src = path;
          }
        }
      }

      // Escribir el contenido publicado.
      await LoboGitHub.putText('data/content.json', JSON.stringify(data, null, 2), 'admin: actualizar contenido del sitio');

      // Sincronizar estado local con lo publicado (libera espacio de data-URLs).
      LoboStore.setOverrides(data);
      LoboStore.setPublished(data);
      renderAll();
      toast('✅ Publicado. La web se actualizará en unos segundos.');
    } catch (e) {
      console.error(e);
      alert('Error al publicar:\n' + e.message);
      setGhStatus('✗ ' + e.message, false);
    } finally {
      setPublishing(false);
    }
  }

  function renderAll() {
    renderGallery();
    renderMainImages();
    renderBusinessForm();
    renderGitHub();
    renderUsage();
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (isLogged()) showPanel();

    // Login
    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = await tryLogin($('#login-code').value);
      if (!ok) { $('#login-error').classList.remove('hidden'); $('#login-code').value = ''; }
    });

    $('#logout-btn').addEventListener('click', logout);

    // Galería: file input
    $('#gallery-input').addEventListener('change', (e) => { addGalleryFiles(Array.from(e.target.files)); e.target.value = ''; });

    // Galería: añadir por URL
    $('#gallery-url-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const url = $('#gallery-url').value.trim();
      if (!url) return;
      const arr = (content().gallery || []).slice();
      arr.push({ src: url, alt: 'Trabajo de Lobo the Barber en Sevilla' });
      save({ gallery: arr }, 'Imagen añadida por URL');
      $('#gallery-url').value = '';
      renderGallery();
    });

    // Galería: drag & drop
    const dz = $('#dropzone');
    dz.addEventListener('click', () => $('#gallery-input').click());
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('drag'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) addGalleryFiles(Array.from(e.dataTransfer.files)); });

    // Imágenes principales
    $('#hero-input').addEventListener('change', (e) => { if (e.target.files[0]) setMainImage('hero', e.target.files[0]); e.target.value = ''; });
    $('#about-input').addEventListener('change', (e) => { if (e.target.files[0]) setMainImage('about', e.target.files[0]); e.target.value = ''; });

    // Datos del negocio
    $('#business-save').addEventListener('click', saveBusinessForm);

    // Export / import / reset
    $('#export-btn').addEventListener('click', exportJSON);
    $('#import-input').addEventListener('change', (e) => { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = ''; });
    $('#reset-btn').addEventListener('click', resetAll);

    // Cambio de código
    $('#pass-form').addEventListener('submit', (e) => { e.preventDefault(); changePass($('#new-pass').value); $('#new-pass').value = ''; });

    // Conexión con GitHub
    $('#gh-save').addEventListener('click', saveGitHub);
    $('#gh-test').addEventListener('click', testGitHub);

    // Publicar
    $('#publish-btn').addEventListener('click', publish);
  });
})();
