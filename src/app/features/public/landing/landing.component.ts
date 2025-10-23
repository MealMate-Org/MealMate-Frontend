import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <section class="bg-gradient-to-br from-dark-purple to-slate-gray text-white py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">
          Planifica tus comidas con <span class="text-cambridge-blue">MealMate</span>
        </h1>
        <p class="text-xl mb-8 text-celadon">
          Organiza tu menú semanal, gestiona tu lista de compra y comparte recetas con tu familia
        </p>
        <div class="flex justify-center gap-4">
          <a routerLink="/register" class="btn-primary px-8 py-3 text-lg">
            Comenzar Gratis
          </a>
          <a routerLink="/recipes" class="btn-secondary px-8 py-3 text-lg">
            Ver Recetas
          </a>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-center mb-12">¿Por qué MealMate?</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="text-4xl mb-4">🗓️</div>
            <h3 class="mb-3">Planificación Inteligente</h3>
            <p class="text-slate-gray">
              Organiza tu menú semanal con drag & drop. Visualiza tus comidas y optimiza tu tiempo.
            </p>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">🛒</div>
            <h3 class="mb-3">Lista de Compra Automática</h3>
            <p class="text-slate-gray">
              Genera tu lista de compra basada en tu planificación semanal. ¡No olvides nada!
            </p>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">👥</div>
            <h3 class="mb-3">Colaboración Familiar</h3>
            <p class="text-slate-gray">
              Comparte planes con tu familia o compañeros de piso. Todos sincronizados.
            </p>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">🥗</div>
            <h3 class="mb-3">Control Nutricional</h3>
            <p class="text-slate-gray">
              Rastrea macros y calorías. Configura tus objetivos nutricionales personalizados.
            </p>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="mb-3">Alertas de Alergias</h3>
            <p class="text-slate-gray">
              Configura tus alergias y recibe avisos automáticos en recetas incompatibles.
            </p>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">⭐</div>
            <h3 class="mb-3">Comunidad</h3>
            <p class="text-slate-gray">
              Comparte tus recetas, descubre nuevas ideas y vota tus favoritas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-cambridge-blue text-white py-16">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="mb-4">¿Listo para empezar?</h2>
        <p class="text-xl mb-8">
          Únete a miles de usuarios que ya organizan sus comidas con MealMate
        </p>
        <a routerLink="/register" class="btn-accent px-8 py-3 text-lg inline-block">
          Crear Cuenta Gratis
        </a>
      </div>
    </section>

    <footer class="bg-dark-purple text-white py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-slate-gray">
          © 2025 MealMate. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
  styles: []
})
export class LandingComponent {}
