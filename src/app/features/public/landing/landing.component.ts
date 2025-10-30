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
  ArrowRight,
  CheckCircle2
} from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-dark-purple via-slate-gray to-dark-purple text-white py-24 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-cambridge-blue rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-zomp rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Planifica tus comidas con <span class="text-cambridge-blue">MealMate</span>
        </h1>
        <p class="text-xl md:text-2xl mb-10 text-celadon max-w-3xl mx-auto leading-relaxed">
          Organiza tu menú semanal, gestiona tu lista de compra y comparte recetas con tu familia de forma inteligente
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a 
            routerLink="/register" 
            class="inline-flex items-center justify-center space-x-2 bg-cambridge-blue hover:bg-zomp text-white px-10 py-4 text-lg font-semibold rounded-xl transition-all shadow-2xl hover:shadow-cambridge-blue/50 hover:scale-105"
          >
            <span>Comenzar Gratis</span>
            <lucide-icon [img]="ArrowRightIcon" class="w-5 h-5"></lucide-icon>
          </a>
          <a 
            routerLink="/recipes" 
            class="inline-flex items-center justify-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white border-2 border-white border-opacity-30 px-10 py-4 text-lg font-semibold rounded-xl transition-all backdrop-blur-sm"
          >
            <span>Explorar Recetas</span>
          </a>
        </div>
        
        <!-- Stats -->
        <div class="flex flex-wrap justify-center gap-8 text-sm">
          <div class="flex items-center space-x-2">
            <lucide-icon [img]="CheckIcon" class="w-5 h-5 text-cambridge-blue"></lucide-icon>
            <span>100% Gratis</span>
          </div>
          <div class="flex items-center space-x-2">
            <lucide-icon [img]="CheckIcon" class="w-5 h-5 text-cambridge-blue"></lucide-icon>
            <span>Sin tarjeta de crédito</span>
          </div>
          <div class="flex items-center space-x-2">
            <lucide-icon [img]="CheckIcon" class="w-5 h-5 text-cambridge-blue"></lucide-icon>
            <span>Configuración en 2 minutos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">¿Por qué elegir MealMate?</h2>
          <p class="text-xl text-slate-gray">Todo lo que necesitas para organizar tu alimentación</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-cambridge-blue bg-opacity-10 rounded-2xl group-hover:bg-cambridge-blue group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="CalendarIcon" class="w-10 h-10 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Planificación Inteligente</h3>
            <p class="text-slate-gray text-center">
              Organiza tu menú semanal con drag & drop. Visualiza tus comidas y optimiza tu tiempo en la cocina.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-zomp bg-opacity-10 rounded-2xl group-hover:bg-zomp group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="ShoppingCartIcon" class="w-10 h-10 text-zomp group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Lista de Compra Automática</h3>
            <p class="text-slate-gray text-center">
              Genera tu lista de compra basada en tu planificación semanal. ¡No olvides ningún ingrediente!
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-dark-purple bg-opacity-10 rounded-2xl group-hover:bg-dark-purple group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="UsersIcon" class="w-10 h-10 text-dark-purple group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Colaboración Familiar</h3>
            <p class="text-slate-gray text-center">
              Comparte planes con tu familia o compañeros de piso. Todos sincronizados en tiempo real.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-success bg-opacity-10 rounded-2xl group-hover:bg-success group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="AppleIcon" class="w-10 h-10 text-success group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Control Nutricional</h3>
            <p class="text-slate-gray text-center">
              Rastrea macros y calorías. Configura tus objetivos nutricionales personalizados y alcánzalos.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-error bg-opacity-10 rounded-2xl group-hover:bg-error group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="AlertIcon" class="w-10 h-10 text-error group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Alertas de Alergias</h3>
            <p class="text-slate-gray text-center">
              Configura tus alergias y recibe avisos automáticos en recetas incompatibles. Tu salud primero.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-cambridge-blue bg-opacity-10 rounded-2xl group-hover:bg-cambridge-blue group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="StarIcon" class="w-10 h-10 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-3 text-center">Comunidad Activa</h3>
            <p class="text-slate-gray text-center">
              Comparte tus recetas, descubre nuevas ideas y vota tus favoritas. Crece junto a otros cocineros.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-cambridge-blue to-zomp text-white py-20">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-4xl font-bold mb-6">¿Listo para organizar tu vida?</h2>
        <p class="text-xl mb-10 opacity-90">
          Únete a miles de usuarios que ya organizan sus comidas con MealMate y ahorra tiempo cada semana
        </p>
        <a 
          routerLink="/register" 
          class="inline-flex items-center justify-center space-x-2 bg-white text-cambridge-blue hover:bg-celadon hover:text-dark-purple px-10 py-4 text-lg font-bold rounded-xl transition-all shadow-2xl hover:scale-105"
        >
          <span>Empezar Ahora</span>
          <lucide-icon [img]="ArrowRightIcon" class="w-5 h-5"></lucide-icon>
        </a>
        <p class="mt-6 text-sm opacity-75">No se requiere tarjeta de crédito • Totalmente gratis</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-purple text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center">
          <div class="flex justify-center items-center space-x-3 mb-4">
            <img 
              src="/MMLogo.png" 
              alt="MealMate Logo" 
              class="h-10 w-auto"
              onerror="this.style.display='none'"
            >
            <span class="text-2xl font-bold">MealMate</span>
          </div>
          <p class="text-slate-gray mb-4">
            La forma más inteligente de planificar tus comidas
          </p>
          <div class="flex justify-center space-x-6 text-sm">
            <a href="#" class="hover:text-cambridge-blue transition">Términos</a>
            <a href="#" class="hover:text-cambridge-blue transition">Privacidad</a>
            <a href="#" class="hover:text-cambridge-blue transition">Contacto</a>
          </div>
          <p class="text-slate-gray text-sm mt-6">
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
  readonly CheckIcon = CheckCircle2;
}