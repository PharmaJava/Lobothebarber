/* ============================================================
   Lobo the Barber · Configuración de Tailwind (CDN)
   Se carga DESPUÉS del script de Tailwind y antes de renderizar.
   Centraliza los tokens de marca para mantener consistencia.
   ============================================================ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink:    '#0a0a0a', // negro profundo (fondo)
        coal:   '#141414', // gris carbón (secciones)
        stone:  '#1f1f1f', // gris oscuro (tarjetas)
        gold:   '#c8a04f', // dorado / ámbar (acento principal)
        goldlt: '#e7c987', // dorado claro
        forest: '#1d3a2f', // verde bosque sutil
        blood:  '#8e2a2a', // rojo lobo sutil
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'], // titulares
        body:    ['Inter', 'sans-serif'],  // texto
      },
    },
  },
};
