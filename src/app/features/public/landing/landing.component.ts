import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { 
  LucideAngularModule,
  CalendarDays,
  ShoppingCart,
  Users,
  Apple,
  AlertTriangle,
  Star,
  ArrowRight
} from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-dark-purple via-slate-gray to-dark-purple text-white py-32 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-cambridge-blue rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-zomp rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white">
          Planifica tus comidas con <span class="text-cambridge-blue">MealMate</span>
        </h1>
        <p class="text-xl md:text-2xl mb-12 text-celadon max-w-3xl mx-auto leading-relaxed">
          Organiza tu menú semanal, gestiona tu lista de compra y comparte recetas con tu familia de forma inteligente
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            routerLink="/register" 
            class="inline-flex items-center justify-center space-x-3 bg-cambridge-blue hover:bg-zomp text-white px-12 py-5 text-xl font-bold rounded-xl transition-all shadow-2xl hover:shadow-cambridge-blue/50 hover:scale-105"
          >
            <span>Comenzar Ahora</span>
            <lucide-icon [img]="ArrowRightIcon" class="w-6 h-6"></lucide-icon>
          </a>
          <a 
            routerLink="/recipes" 
            class="inline-flex items-center justify-center space-x-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white border-2 border-white border-opacity-30 px-12 py-5 text-xl font-bold rounded-xl transition-all backdrop-blur-sm hover:scale-105"
          >
            <span>Explorar Recetas</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-gradient-to-b from-white to-celadon">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-20">
          <h2 class="text-5xl font-bold mb-6 text-dark-purple">Características principales</h2>
          <p class="text-2xl text-slate-gray max-w-2xl mx-auto">
            Todo lo que necesitas para organizar tu alimentación
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-cambridge-blue to-zomp rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="CalendarIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Planificación Inteligente</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Organiza tu menú semanal con drag & drop. Visualiza tus comidas y optimiza tu tiempo en la cocina.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-zomp to-cambridge-blue rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="ShoppingCartIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Lista de Compra Automática</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Genera tu lista de compra basada en tu planificación semanal. No olvides ningún ingrediente.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-dark-purple to-slate-gray rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="UsersIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Colaboración Familiar</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Comparte planes con tu familia o compañeros de piso. Todos sincronizados en tiempo real.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-success to-green-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="AppleIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Control Nutricional</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Rastrea macros y calorías. Configura tus objetivos nutricionales personalizados y alcánzalos.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-error to-red-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="AlertIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Alertas de Alergias</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Configura tus alergias y recibe avisos automáticos en recetas incompatibles. Tu salud primero.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div class="flex justify-center mb-6">
              <div class="p-5 bg-gradient-to-br from-cambridge-blue to-dark-purple rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="StarIcon" class="w-12 h-12 text-white"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-4 text-center text-2xl">Comunidad Activa</h3>
            <p class="text-slate-gray text-center text-lg leading-relaxed">
              Comparte tus recetas, descubre nuevas ideas y vota tus favoritas. Crece junto a otros cocineros.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-purple text-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center">
          <div class="flex justify-center items-center space-x-4 mb-6">
            <img 
              src="/MMLogo.png" 
              alt="MealMate Logo" 
              class="h-14 w-auto"
              onerror="this.style.display='none'"
            >
            <span class="text-3xl font-bold text-white">MealMate</span>
          </div>
          <p class="text-slate-gray mb-6 text-lg">
            La forma más inteligente de planificar tus comidas
          </p>
          <div class="flex justify-center space-x-8 text-base">
            <a href="#" class="hover:text-cambridge-blue transition">Términos</a>
            <a href="#" class="hover:text-cambridge-blue transition">Privacidad</a>
            <a href="#" class="hover:text-cambridge-blue transition">Contacto</a>
          </div>
          <p class="text-slate-gray text-sm mt-8">
            © 2025 MealMate. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class LandingComponent {
  // Iconos de Lucide
  readonly CalendarIcon = CalendarDays;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly UsersIcon = Users;
  readonly AppleIcon = Apple;
  readonly AlertIcon = AlertTriangle;
  readonly StarIcon = Star;
  readonly ArrowRightIcon = ArrowRight;
}