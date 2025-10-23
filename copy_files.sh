#!/bin/bash

# Crear estilos
cat > src/styles.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans bg-background;
  }
  
  h1 {
    @apply font-sans text-h1;
  }
  h2 {
    @apply font-sans text-h2;
  }
  h3 {
    @apply font-sans text-h3;
  }
  h4 {
    @apply font-sans text-h4;
  }
  p {
    @apply font-sans text-body;
  }
  small {
    @apply font-sans text-small;
  }
}

@layer components {
  .btn-primary {
    @apply bg-cambridge-blue text-white border-none hover:bg-dark-purple hover:bg-opacity-80 
           transition duration-200 text-body font-medium rounded px-6 py-2.5 cursor-pointer;
  }
  
  .btn-secondary {
    @apply bg-celadon text-dark-purple border border-dark-purple hover:bg-cambridge-blue hover:bg-opacity-50 
           transition duration-200 text-body font-medium rounded px-6 py-2.5 cursor-pointer;
  }
  
  .btn-accent {
    @apply bg-zomp text-white border-none hover:bg-dark-purple hover:bg-opacity-80 
           transition duration-200 text-body font-medium rounded px-6 py-2.5 cursor-pointer;
  }
  
  .btn-disabled {
    @apply bg-slate-gray text-white border-none cursor-not-allowed 
           text-body font-medium rounded px-6 py-2.5 opacity-60;
  }
  
  .card {
    @apply bg-white shadow-card rounded-card p-card-internal border border-celadon;
  }
  
  .input {
    @apply border border-slate-gray rounded-input px-3 py-2 
           focus:border-cambridge-blue focus:ring-1 focus:ring-cambridge-blue 
           font-sans text-body outline-none transition duration-200;
  }
  
  .badge {
    @apply bg-zomp text-white rounded-badge px-2 py-1 text-small inline-block;
  }
  
  .badge-success {
    @apply bg-success text-white rounded-badge px-2 py-1 text-small inline-block;
  }
  
  .badge-error {
    @apply bg-error text-white rounded-badge px-2 py-1 text-small inline-block;
  }
  
  .icon {
    @apply text-slate-gray w-5 h-5;
  }
  
  .icon-hover {
    @apply hover:text-cambridge-blue transition duration-200 cursor-pointer;
  }
}
EOF

# Crear tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Karla', 'sans-serif'],
      },
      
      colors: {
        'dark-purple': '#241623',
        'slate-gray': '#70798c',
        'celadon': '#a9cba6',
        'cambridge-blue': '#7ebea3',
        'zomp': '#53a08e',
        'error': '#E63946',
        'success': '#2A9D8F',
        'background': '#F8F9FA',
      },
      
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'button': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '12px',
        'input': '6px',
        'badge': '4px',
      },
      
      spacing: {
        'section': '24px',
        'card-internal': '16px',
        'title-subtitle': '12px',
      },
    },
  },
  plugins: [],
}
EOF

# Crear tsconfig files
cat > tsconfig.json << 'EOF'
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "typeCheckHostBindings": true,
    "strictTemplates": true
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}
EOF

cat > tsconfig.app.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}
EOF

cat > tsconfig.spec.json << 'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine"
    ]
  },
  "include": [
    "src/**/*.ts"
  ]
}
EOF

# Crear index.html
cat > src/index.html << 'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MealMate - Planifica tus comidas</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
EOF

echo "Archivos de configuración creados exitosamente"
