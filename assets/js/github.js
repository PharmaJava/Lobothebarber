/* ============================================================
   Lobo the Barber · Cliente de la API de GitHub (Contents API)
   ------------------------------------------------------------
   Permite que el panel de administración publique cambios
   directamente en el repositorio: sube imágenes a assets/img/ y
   actualiza data/content.json. El hosting (GitHub Pages / Netlify
   / Vercel) redespliega solo y el cambio queda online para todos.

   ⚠️  SEGURIDAD (opción A): el token se guarda en este navegador
   (localStorage). Usa un *fine-grained token* limitado SOLO a este
   repositorio con permiso "Contents: Read and write". Cualquiera
   con acceso a este equipo podría usarlo: no lo uses en equipos
   compartidos y revócalo si sospechas filtración.
   ============================================================ */
window.LoboGitHub = (function () {
  'use strict';

  const KEY = 'gh';
  const API = 'https://api.github.com';

  function cfg() {
    return LoboStore.get(KEY, { owner: '', repo: '', branch: 'main', token: '' });
  }
  function setCfg(c) { return LoboStore.set(KEY, c); }
  function isConfigured() { const c = cfg(); return !!(c.owner && c.repo && c.token); }

  function headers() {
    return {
      Authorization: 'Bearer ' + cfg().token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  // Base64 de texto UTF-8 (para JSON).
  function b64Text(str) { return btoa(unescape(encodeURIComponent(str))); }
  // Extrae la parte base64 de un data-URL ("data:image/jpeg;base64,XXXX").
  function dataUrlToB64(d) { const i = d.indexOf(','); return i >= 0 ? d.slice(i + 1) : d; }

  async function apiError(res) {
    let detail = '';
    try { detail = (await res.json()).message || ''; } catch (e) { /* noop */ }
    return new Error(`GitHub ${res.status}${detail ? ': ' + detail : ''}`);
  }

  /** Comprueba acceso al repositorio (lanza si falla). */
  async function test() {
    const c = cfg();
    const res = await fetch(`${API}/repos/${c.owner}/${c.repo}`, { headers: headers() });
    if (!res.ok) throw await apiError(res);
    return res.json();
  }

  /** Lee un archivo; devuelve null si no existe (404). */
  async function getFile(path) {
    const c = cfg();
    const url = `${API}/repos/${c.owner}/${c.repo}/contents/${path}?ref=${encodeURIComponent(c.branch)}`;
    const res = await fetch(url, { headers: headers() });
    if (res.status === 404) return null;
    if (!res.ok) throw await apiError(res);
    return res.json();
  }

  /** Crea o actualiza un archivo (contenido ya en base64). */
  async function putFile(path, contentB64, message, sha) {
    const c = cfg();
    const url = `${API}/repos/${c.owner}/${c.repo}/contents/${path}`;
    const body = { message, content: contentB64, branch: c.branch };
    if (sha) body.sha = sha;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await apiError(res);
    return res.json();
  }

  /** Escribe texto (resuelve el sha previo automáticamente). */
  async function putText(path, text, message) {
    let sha;
    try { const ex = await getFile(path); sha = ex && ex.sha; } catch (e) { /* nuevo archivo */ }
    return putFile(path, b64Text(text), message, sha);
  }

  /** Sube una imagen desde un data-URL. */
  async function uploadImage(path, dataUrl, message) {
    let sha;
    try { const ex = await getFile(path); sha = ex && ex.sha; } catch (e) { /* nuevo archivo */ }
    return putFile(path, dataUrlToB64(dataUrl), message, sha);
  }

  return { cfg, setCfg, isConfigured, test, getFile, putText, uploadImage };
})();
