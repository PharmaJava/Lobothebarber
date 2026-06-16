# 🐺 Lobo the Barber — Web

Sitio web de una sola página (single-page), moderno y responsive para **Lobo the Barber**, barbería premium en Sevilla regentada por **Ivan Lobo Soto**.

> **Tu Estilo, Tu Manada.**

---

## ✨ Características

- **HTML5 + Tailwind CSS** (vía CDN) — sin build, abre `index.html` y listo.
- **100% responsive** y mobile-first.
- **Diseño oscuro premium** con paleta negro / carbón / dorado-ámbar y acentos sutiles en verde bosque y rojo lobo.
- **Tipografía**: `Oswald` (titulares bold) + `Inter` (texto).
- **Animaciones sutiles**: fade-in al hacer scroll (IntersectionObserver), hover en tarjetas y galería, navbar que cambia al desplazar.
- **SEO local**: meta tags, Open Graph y **datos estructurados JSON-LD** (`HairSalon`) con dirección, horario, valoración 5.0 y catálogo de servicios → mejor posicionamiento en Google y rich snippets.
- **Botones flotantes** de **Reservar (Booksy)** y **WhatsApp**.
- **Menú móvil** tipo hamburguesa.
- **Mapa de Google Maps** embebido y **formulario de contacto** (demo).

## 🗂️ Estructura de secciones

1. **Hero** — pantalla completa con eslogan y CTAs.
2. **Sobre Nosotros** — historia, barbero principal y valores.
3. **Servicios** — grid con precios, duración y bonos.
4. **Galería** — rejilla de fotos de cortes, barbas e interior.
5. **Reseñas** — testimonios reales y valoración 5.0 de Booksy.
6. **Ubicación y Contacto** — mapa, horario, WhatsApp y formulario.
7. **Footer** — navegación, redes sociales y copyright.

---

## 🚀 Cómo usarlo

No requiere instalación ni compilación:

```bash
# Opción 1: abrir directamente
open index.html

# Opción 2: servidor local
python3 -m http.server 8000
# y visita http://localhost:8000
```

### Despliegue

Sirve perfectamente como sitio estático en **GitHub Pages**, **Netlify**, **Vercel** o **Cloudflare Pages**. Solo sube `index.html` (y la carpeta `assets/`).

---

## 🖼️ Imágenes — qué sustituir

Actualmente se usan imágenes de stock (Unsplash) como **placeholder**. Para producción, reemplázalas por fotos reales:

| Ubicación | Recomendación |
|---|---|
| **Hero** (`#inicio`, `background-image`) | Foto horizontal impactante del local o de un corte premium (1920×1080, optimizada < 300 KB). |
| **Sobre Nosotros** (`#nosotros`) | Foto real del interior o de Ivan trabajando (vertical/cuadrada). |
| **Galería** (`#galeria`) | 6+ fotos cuadradas de degradados, barbas, antes/después e interior. |
| **`assets/og-image.jpg`** | Imagen 1200×630 para compartir en redes (Open Graph). |

**Consejos de optimización**: usa formato **WebP**, comprime con [Squoosh](https://squoosh.app/), mantén `loading="lazy"` (ya incluido) y nombres de archivo descriptivos con palabras clave (ej. `degradado-barberia-sevilla.webp`) para SEO.

---

## 🔧 Datos a personalizar antes de publicar

Busca y reemplaza estos marcadores en `index.html`:

- **WhatsApp**: `https://wa.me/34000000000` → número real.
- **Teléfono**: `+34000000000` en el JSON-LD.
- **Redes sociales**: enlaces de Instagram y Facebook (ahora apuntan a la home genérica).
- **Dominio**: `https://www.lobothebarber.es/` en `canonical`, Open Graph y JSON-LD.
- **Coordenadas GPS**: `latitude`/`longitude` en el JSON-LD (valores aproximados).
- **Formulario de contacto**: ahora es una demo (solo muestra un mensaje). Conéctalo a [Formspree](https://formspree.io/), [EmailJS](https://www.emailjs.com/) o un backend propio (ver función `handleContact`).

---

## 💡 Mejoras futuras

- 📝 **Blog "El Aullido del Lobo"** — consejos de estilo, cuidado de barba y tendencias (gran impulso SEO).
- 🛒 **Tienda de productos** — ceras, aceites de barba y kits de la marca.
- 🎁 **Tarjetas regalo** y gestión de **bonos** online.
- 🌐 **Versión en inglés** para turistas en Sevilla.
- ⭐ **Reseñas en vivo** vía API de Booksy/Google.
- 📊 Analítica (Google Analytics / Plausible) y píxel de redes.
- ♿ Auditoría de accesibilidad (contraste, foco, etiquetas ARIA).
- 🔄 Migrar Tailwind del CDN a build con PurgeCSS para máxima velocidad.

---

## 🎨 Toques personales incluidos

El concepto de **"manada"** (wolf pack) recorre todo el sitio: el eslogan *"Tu Estilo, Tu Manada"*, los **"Bonos de la Manada"**, los **"lobeznos"** (corte niño), el icono de lobo en el logo y favicon, y el cierre *"Hecho con 🐺 en Sevilla"*. Una identidad coherente, masculina y premium, fiel al nombre del negocio.

---

© Lobo the Barber · Av. de El Greco, 10, Local 3, 41007 Sevilla
