# MealMate Frontend

Aplicación Angular 20 para planificación de comidas.

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Servicios, guards, interceptores
│   ├── features/          # Componentes de funcionalidades
│   │   ├── auth/         # Login, register
│   │   ├── public/       # Landing, recipes-list, recipe-detail
│   │   └── private/      # Dashboard, profile, my-recipes, etc.
│   ├── models/           # Interfaces TypeScript
│   └── shared/           # Componentes compartidos (navbar)
└── styles.css            # Estilos globales Tailwind
```

## Funcionalidades

- ✅ Autenticación (login/register)
- ✅ Gestión de recetas
- ✅ Planificador semanal
- ✅ Lista de compra automática
- ✅ Grupos colaborativos
- ✅ Control nutricional

## Tecnologías

- Angular 20
- Tailwind CSS
- TypeScript
- RxJS
