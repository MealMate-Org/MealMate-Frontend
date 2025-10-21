/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // 1. FUENTE PERSONALIZADA (solo Karla)
      fontFamily: {
        'sans': ['Karla', 'sans-serif'],
      },
      
      // 2. PALETA DE COLORES COMPLETA
      colors: {
        // Colores primarios
        'dark-purple': '#241623',
        'slate-gray': '#70798c',
        'celadon': '#a9cba6',
        'cambridge-blue': '#7ebea3',
        'zomp': '#53a08e',
        
        // Colores secundarios
        'error': '#E63946',
        'success': '#2A9D8F',
        'background': '#F8F9FA',
      },
      
      // 3. TIPOGRAFÍA PERSONALIZADA
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'button': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      
      // 4. COMPONENTES PERSONALIZADOS
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '12px',
        'input': '6px',
        'badge': '4px',
      },
      
      // Espaciado
      spacing: {
        'section': '24px',
        'card-internal': '16px',
        'title-subtitle': '12px',
      },
    },
  },
  plugins: [],
}