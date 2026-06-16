/* ============================================================
   Lobo the Barber · Capa de almacenamiento (LoboStore)
   ------------------------------------------------------------
   Pequeña abstracción sobre localStorage con espacio de nombres.
   Fusiona el contenido por defecto (LOBO_CONFIG) con las
   personalizaciones guardadas desde el panel de administración.

   NOTA: las personalizaciones viven en el navegador del editor.
   Para publicarlas a TODOS los visitantes, exporta el JSON desde
   el panel admin y pégalo en assets/js/config.js (o conéctalo a
   un backend / Supabase — ver README).
   ============================================================ */
window.LoboStore = (function () {
  const NS = 'lobo.v1.';
  const CONTENT_KEY = 'content';

  const k = (key) => NS + key;

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(k(key));
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.warn('[LoboStore] No se pudo leer', key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(k(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[LoboStore] No se pudo guardar (¿cuota llena?)', key, e);
      return false;
    }
  }

  function remove(key) { localStorage.removeItem(k(key)); }

  function clearAll() {
    Object.keys(localStorage)
      .filter((x) => x.startsWith(NS))
      .forEach((x) => localStorage.removeItem(x));
  }

  /* ---- Fusión profunda sencilla (objetos planos; arrays se reemplazan) ---- */
  function deepMerge(base, override) {
    if (Array.isArray(override)) return override.slice();
    if (override && typeof override === 'object') {
      const out = Array.isArray(base) ? [] : { ...base };
      Object.keys(override).forEach((key) => {
        const b = base ? base[key] : undefined;
        const o = override[key];
        out[key] = (o && typeof o === 'object') ? deepMerge(b, o) : o;
      });
      return out;
    }
    return override;
  }

  function clone(obj) {
    return (typeof structuredClone === 'function')
      ? structuredClone(obj)
      : JSON.parse(JSON.stringify(obj));
  }

  /* ---- Contenido efectivo = defaults + overrides ---- */
  function getContent() {
    const base = clone(window.LOBO_CONFIG || {});
    const overrides = get(CONTENT_KEY, {});
    return deepMerge(base, overrides);
  }

  function getOverrides() { return get(CONTENT_KEY, {}); }

  /** Aplica un parche parcial al objeto de overrides y lo persiste. */
  function patchContent(patch) {
    const merged = deepMerge(getOverrides(), patch);
    return set(CONTENT_KEY, merged);
  }

  function setOverrides(obj) { return set(CONTENT_KEY, obj || {}); }
  function resetOverrides() { remove(CONTENT_KEY); }

  /** Tamaño aproximado usado por las personalizaciones (KB). */
  function usageKB() {
    const raw = localStorage.getItem(k(CONTENT_KEY)) || '';
    return Math.round((raw.length / 1024) * 10) / 10;
  }

  return {
    get, set, remove, clearAll,
    getContent, getOverrides, patchContent, setOverrides, resetOverrides,
    usageKB, deepMerge, clone,
  };
})();
