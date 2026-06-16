/* ============================================================
   Lobo the Barber · Contenido del sitio (fuente de verdad)
   ------------------------------------------------------------
   Edita aquí los textos, precios, reseñas e imágenes por defecto.
   El panel de administración puede sobrescribir parte de estos
   datos en tiempo real (ver assets/js/store.js y admin.js).
   ============================================================ */
window.LOBO_CONFIG = {
  business: {
    name: 'Lobo the Barber',
    tagline: 'Tu Estilo, Tu Manada',
    barber: 'Ivan Lobo Soto',
    rating: '5.0',
    reviewCount: 18,
    phone: '+34000000000',            // TODO: número real
    whatsapp: '34000000000',          // TODO: número real (formato internacional sin +)
    bookingUrl: 'https://booksy.com/es-es/175515_lobo-the-barber_barberia_29971_sevilla',
    whatsappMessage: 'Hola Lobo the Barber 🐺, me gustaría pedir cita. ¿Qué disponibilidad tenéis?',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    domain: 'https://www.lobothebarber.es/',
    foundingYear: 2021,
    address: {
      street: 'Av. de El Greco, 10, Local 3',
      city: 'Sevilla',
      region: 'Sevilla',
      postalCode: '41007',
      country: 'España',
      lat: 37.37,
      lng: -5.97,
    },
    // Para Google: barrios/zonas a las que damos servicio (SEO local).
    areaServed: ['Sevilla', 'Sevilla Este', 'Nervión', 'San Pablo', 'Santa Clara', 'El Greco'],
    hours: [
      { days: 'Lunes – Viernes', time: '9:30 – 20:30' },
      { days: 'Sábado',          time: '9:30 – 14:00' },
      { days: 'Domingo',         time: 'Cerrado', closed: true },
    ],
    // Horario en formato máquina para el indicador "Abierto ahora" (0=domingo).
    schedule: [
      { days: [1, 2, 3, 4, 5], open: '09:30', close: '20:30' },
      { days: [6],             open: '09:30', close: '14:00' },
    ],
  },

  // Métricas para la banda de cifras (animadas con count-up).
  stats: [
    { value: 5,    label: 'Valoración media', suffix: '.0', icon: '★' },
    { value: 18,   label: 'Reseñas 5 estrellas', suffix: '+', icon: '💬' },
    { value: 1500, label: 'Cortes al año', suffix: '+', icon: '✂️' },
    { value: 100,  label: 'Clientes satisfechos', suffix: '%', icon: '🐺' },
  ],

  // Preguntas frecuentes (mejoran UX y generan rich results de FAQ en Google).
  faqs: [
    { q: '¿Dónde está Lobo the Barber en Sevilla?', a: 'Estamos en Av. de El Greco, 10, Local 3, 41007 Sevilla, junto a Sevilla Este. Tienes el mapa y el botón "Cómo llegar" en la sección de contacto.' },
    { q: '¿Cómo pido cita?', a: 'Lo más rápido es reservar online en Booksy (disponible 24/7) o escribirnos por WhatsApp. También puedes pasarte por el local.' },
    { q: '¿Cuánto cuesta un corte de pelo?', a: 'El corte de caballero cuesta 12€ y el pack corte + barba 17€. Tienes la lista completa de precios en la sección de Servicios.' },
    { q: '¿Atendéis a niños?', a: '¡Por supuesto! El corte para niños (los lobeznos) cuesta 10€. Paciencia y mano firme garantizadas.' },
    { q: '¿Tenéis bonos o descuentos?', a: 'Sí: ofrecemos bonos de corte y de barba para clientes fieles, y tarifa especial para jubilados (8,50€). Pregúntanos en el local o por WhatsApp.' },
    { q: '¿Qué métodos de pago aceptáis?', a: 'Aceptamos efectivo y tarjeta. Para reservar online puedes usar Booksy.' },
  ],

  // Imágenes principales (placeholders de Unsplash; sustituir por reales).
  images: {
    hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80',
    about: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
  },

  services: [
    { name: 'Corte Caballero', price: '12€',   duration: '≈ 30 min', desc: 'Corte clásico o moderno a tijera y máquina, perfilado y acabado al detalle.' },
    { name: 'Corte + Barba',   price: '17€',   duration: '≈ 45 min', badge: '⭐ Más pedido', desc: 'El pack completo: corte a medida y barba perfilada con toalla caliente.' },
    { name: 'Arreglo de Barba',price: '8€',    duration: '≈ 20 min', desc: 'Perfilado, recorte y diseño de barba con acabado hidratante.' },
    { name: 'Corte + Lavado',  price: '13€',   duration: '≈ 35 min', desc: 'Corte completo con lavado relajante y masaje capilar.' },
    { name: 'Corte Niño',      price: '10€',   duration: '≈ 25 min', desc: 'Para los lobeznos. Paciencia, mano firme y un resultado del que presumir.' },
    { name: 'Corte Jubilado',  price: '8,50€', duration: '≈ 30 min', desc: 'Tarifa especial para nuestros mayores. El respeto también se nota en el precio.' },
  ],

  packages: [
    { title: 'Bonos de la Manada', accent: 'forest', desc: 'Bono de cortes y bono de barba con descuento para clientes fieles. Acumula sesiones y ahorra todo el año.', note: 'Consulta condiciones en tienda o por WhatsApp.' },
    { title: 'Color y Mechas',     accent: 'blood',  desc: 'Color, mechas y tratamientos especiales. Atrévete con un cambio de look estudiado para ti.', note: 'Precio según servicio · cita previa recomendada.' },
  ],

  reviews: [
    { text: 'Profesional de principio a fin. Salí con el mejor corte que me han hecho en Sevilla.', author: 'Cliente verificado' },
    { text: 'Siempre un servicio excelente. Ivan es un crack y el trato es inmejorable.', author: 'Cliente verificado' },
    { text: 'Muy buen degradado y atención al detalle. Repetiré seguro.', author: 'Cliente verificado' },
    { text: 'Genial con los niños, mi hijo salió encantado y guapísimo. ¡Mil gracias!', author: 'Cliente verificado' },
    { text: 'Ambiente top y barba perfecta. Se nota que le pone cariño a cada cliente.', author: 'Cliente verificado' },
    { text: 'Puntual, limpio y muy buen gusto. La mejor barbería del barrio sin duda.', author: 'Cliente verificado' },
  ],

  // Galería: URLs o data-URLs (las añadidas desde el panel admin se guardan aquí).
  gallery: [
    { src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80', alt: 'Degradado de pelo profesional en Lobo the Barber Sevilla' },
    { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80', alt: 'Barba perfilada en barbería de Sevilla' },
    { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80', alt: 'Corte de pelo masculino moderno Sevilla' },
    { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80', alt: 'Sillón de barbería clásica Lobo the Barber' },
    { src: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=600&q=80', alt: 'Corte con tijera de precisión en Sevilla' },
    { src: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=600&q=80', alt: 'Afeitado clásico con navaja Sevilla' },
  ],
};
