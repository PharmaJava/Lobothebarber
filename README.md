# 🐺 Lobo the Barber — Web

Sitio web moderno, responsive y **listo para producción** para **Lobo the Barber**, barbería premium en Sevilla regentada por **Ivan Lobo Soto**.

> **Tu Estilo, Tu Manada.**

---

## ✨ Características

- **HTML5 + Tailwind CSS** (vía CDN) — sin build, abre y listo.
- **Arquitectura modular y *data-driven***: todo el contenido vive en `assets/js/config.js`; las secciones se renderizan solas. Cambiar un precio o una reseña es editar un objeto, no tocar el HTML.
- **Panel de administración** (`admin.html`) para gestionar imágenes y datos del negocio **sin tocar código**.
- **100% responsive** y mobile-first, con menú móvil.
- **Diseño oscuro premium**: negro / carbón / **dorado-ámbar**, con acentos de verde bosque y rojo lobo.
- **Tipografía**: `Oswald` (titulares) + `Inter` (texto).
- **Animaciones sutiles** (fade-in al scroll, hover, navbar dinámica) y respeto a `prefers-reduced-motion`.
- **SEO local**: meta tags, Open Graph y **JSON-LD `HairSalon`** generado dinámicamente (dirección, horario, rating, catálogo de servicios).
- **Botones flotantes** de Reservar (Booksy) y WhatsApp + mapa de Google Maps embebido.

---

## 🗂️ Estructura del proyecto

```
.
├── index.html                # Página principal (single-page, data-driven)
├── admin.html                # Panel de administración
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos del sitio (tokens, animaciones)
│   │   └── admin.css         # Estilos del panel
│   ├── js/
│   │   ├── tailwind.config.js # Tokens de marca para Tailwind
│   │   ├── config.js          # ⭐ CONTENIDO del sitio (fuente de verdad)
│   │   ├── store.js           # Capa de almacenamiento + fusión de overrides
│   │   ├── main.js            # Render del sitio público + UI
│   │   └── admin.js           # Lógica del panel de administración
│   ├── img/                   # Imágenes reales (sustituir placeholders)
│   └── icons/
│       └── wolf.svg           # Logo/icono del lobo
└── data/
    └── content.sample.json    # Ejemplo de configuración exportable (futuro CMS)
```

La estructura por carpetas está pensada para **crecer**: futuros módulos (blog, tienda, reservas propias) encajan sin reorganizar nada.

---

## 🛠️ Panel de administración (`admin.html`)

Editor visual para que el negocio gestione su contenido sin programar.

**Qué permite:**
- 📷 **Galería**: subir fotos (arrastrar y soltar o seleccionar) o añadir por URL. Las imágenes se **redimensionan automáticamente** (máx. 1280 px, JPEG) para que la web cargue rápido. Eliminar con un clic.
- 🖼️ **Imágenes principales**: cambiar la foto de portada (hero) y la de "Sobre Nosotros".
- 🏪 **Datos del negocio**: nombre, eslogan, barbero, enlace de Booksy, WhatsApp, teléfono y redes.
- 💾 **Copia de seguridad**: exportar/importar toda la configuración como JSON y restablecer a valores por defecto.
- 🔒 **Código de acceso** configurable.

**Acceso:** abre `admin.html` (enlace discreto "Acceso" en el footer).
**Código por defecto:** `lobo2024` → **cámbialo desde el panel** (sección Seguridad) en cuanto entres.

### ⚠️ Cómo funciona la persistencia (importante)

El panel guarda los cambios en el **navegador del editor** (`localStorage`), así que se ven al instante en ese equipo. Para publicarlos a **todos los visitantes** hay dos vías:

1. **Estático (recomendado para empezar)**: pulsa **Exportar JSON**, pega el contenido en `assets/js/config.js` (o súbelo al repo) y despliega. Permanente y gratis.
2. **Backend / CMS real**: conecta `store.js` a un servicio como **Supabase** o **Firebase** para edición multi-dispositivo en vivo (ver *Mejoras futuras*).

> El código de acceso es una barrera de **conveniencia**, no seguridad real (es client-side). No guardes datos sensibles en el panel.

---

## 🚀 Uso y despliegue

```bash
# Servidor local (recomendado: el panel usa APIs que requieren http://)
python3 -m http.server 8000
# Visita http://localhost:8000  y  http://localhost:8000/admin.html
```

Despliega como **sitio estático** en GitHub Pages, Netlify, Vercel o Cloudflare Pages. Sube todo el repositorio tal cual.

---

## 🖼️ Imágenes — qué sustituir

Se usan placeholders de Unsplash. Reemplázalos por fotos reales (vía panel admin, o colocándolas en `assets/img/` y editando `config.js`):

| Dónde | Recomendación |
|---|---|
| **Hero** | Foto horizontal del local o un corte premium (1920×1080). |
| **Sobre Nosotros** | Interior o Ivan trabajando. |
| **Galería** | Degradados, barbas, antes/después, interior. |
| **`assets/og-image.jpg`** | 1200×630 para compartir en redes. |

Usa **WebP**, comprime con [Squoosh](https://squoosh.app/) y nombres descriptivos (`degradado-barberia-sevilla.webp`) para SEO.

---

## 🔧 Datos a personalizar antes de publicar

Edita `assets/js/config.js` (o usa el panel):
- **WhatsApp / teléfono** reales.
- **Redes sociales** (Instagram, Facebook).
- **Dominio** real (afecta a `canonical`, Open Graph y JSON-LD).
- **Coordenadas GPS** del local.
- **Formulario de contacto**: hoy es demo. Conéctalo a [Formspree](https://formspree.io/) o [EmailJS](https://www.emailjs.com/) (función `initContactForm` en `main.js`).

---

## 💡 Mejoras futuras

- 📝 **Blog "El Aullido del Lobo"** — consejos de estilo y cuidado de barba (gran impulso SEO).
- 🛒 **Tienda** — ceras, aceites de barba y kits de la marca.
- 🎁 **Tarjetas regalo** y gestión de **bonos** online.
- 🌐 **Versión en inglés** para turistas en Sevilla.
- ☁️ **CMS real con Supabase** — edición multi-dispositivo, login real y subida de imágenes a la nube (la capa `store.js` ya está aislada para facilitar el cambio).
- 📊 Analítica (Plausible / GA4) y auditoría de **accesibilidad**.
- 🔄 Migrar Tailwind del CDN a build con PurgeCSS para máxima velocidad.

---

## 🎨 Toques personales

El concepto de **"manada"** recorre todo el sitio: eslogan *"Tu Estilo, Tu Manada"*, *"Bonos de la Manada"*, *"lobeznos"* (corte niño), icono de lobo en logo/favicon/panel y cierre *"Hecho con 🐺 en Sevilla"*. Identidad coherente, masculina y premium, fiel al nombre del negocio.

---

© Lobo the Barber · Av. de El Greco, 10, Local 3, 41007 Sevilla
