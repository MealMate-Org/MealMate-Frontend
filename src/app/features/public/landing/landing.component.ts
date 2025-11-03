import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';
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
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-dark-purple via-slate-gray to-dark-purple text-white py-16 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-cambridge-blue rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-zomp rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Planifica tus comidas con <span class="text-cambridge-blue">MealMate</span>
        </h1>
        <p class="text-lg md:text-xl mb-8 text-celadon max-w-2xl mx-auto leading-relaxed">
          Organiza tu menú semanal, gestiona tu lista de compra y comparte recetas con tu familia de forma inteligente
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <!-- Botón "Comenzar Gratis" - Solo visible si NO está logueado -->
          <a 
            *ngIf="!isLoggedIn"
            routerLink="/register" 
            class="inline-flex items-center justify-center space-x-2 bg-cambridge-blue hover:bg-zomp text-white px-8 py-3 text-base font-semibold rounded-xl transition-all shadow-xl hover:shadow-cambridge-blue/50 hover:scale-105"
          >
            <span>Comenzar Gratis</span>
            <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
          </a>
          
          <!-- Botón "Ir al Dashboard" - Solo visible si ESTÁ logueado -->
          <a 
            *ngIf="isLoggedIn"
            routerLink="/planner" 
            class="inline-flex items-center justify-center space-x-2 bg-cambridge-blue hover:bg-zomp text-white px-8 py-3 text-base font-semibold rounded-xl transition-all shadow-xl hover:shadow-cambridge-blue/50 hover:scale-105"
          >
            <span>Ir al Dashboard</span>
            <lucide-icon [img]="ArrowRightIcon" class="w-4 h-4"></lucide-icon>
          </a>
          
          <a 
            routerLink="/recipes" 
            class="inline-flex items-center justify-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white border-2 border-white border-opacity-30 px-8 py-3 text-base font-semibold rounded-xl transition-all backdrop-blur-sm"
          >
            <span>Explorar Recetas</span>
          </a>
        </div>
        
        <!-- Mensaje de bienvenida para usuarios logueados -->
        <div *ngIf="isLoggedIn && currentUser" class="mt-6">
          <p class="text-celadon text-lg">
            ¡Hola de nuevo, <span class="font-semibold">{{ currentUser.username }}</span>! 
            ¿Listo para planificar tu semana?
          </p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-3">¿Por qué elegir MealMate?</h2>
          <p class="text-lg text-slate-gray">Todo lo que necesitas para organizar tu alimentación</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-cambridge-blue bg-opacity-10 rounded-xl group-hover:bg-cambridge-blue group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="CalendarIcon" class="w-8 h-8 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Planificación Inteligente</h3>
            <p class="text-slate-gray text-center text-sm">
              Organiza tu menú semanal con drag & drop. Visualiza tus comidas y optimiza tu tiempo en la cocina.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-zomp bg-opacity-10 rounded-xl group-hover:bg-zomp group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="ShoppingCartIcon" class="w-8 h-8 text-zomp group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Lista de Compra Automática</h3>
            <p class="text-slate-gray text-center text-sm">
              Genera tu lista de compra basada en tu planificación semanal. ¡No olvides ningún ingrediente!
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-dark-purple bg-opacity-10 rounded-xl group-hover:bg-dark-purple group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="UsersIcon" class="w-8 h-8 text-dark-purple group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Colaboración Familiar</h3>
            <p class="text-slate-gray text-center text-sm">
              Comparte planes con tu familia o compañeros de piso. Todos sincronizados en tiempo real.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-success bg-opacity-10 rounded-xl group-hover:bg-success group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="AppleIcon" class="w-8 h-8 text-success group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Control Nutricional</h3>
            <p class="text-slate-gray text-center text-sm">
              Rastrea macros y calorías. Configura tus objetivos nutricionales personalizados y alcánzalos.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-error bg-opacity-10 rounded-xl group-hover:bg-error group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="AlertIcon" class="w-8 h-8 text-error group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Alertas de Alergias</h3>
            <p class="text-slate-gray text-center text-sm">
              Configura tus alergias y recibe avisos automáticos en recetas incompatibles. Tu salud primero.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-cambridge-blue bg-opacity-10 rounded-xl group-hover:bg-cambridge-blue group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="StarIcon" class="w-8 h-8 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
              </div>
            </div>
            <h3 class="mb-2 text-center text-lg">Comunidad Activa</h3>
            <p class="text-slate-gray text-center text-sm">
              Comparte tus recetas, descubre nuevas ideas y vota tus favoritas. Crece junto a otros cocineros.
            </p>
          </div>
        </div>
      </div>
    </section>

    <app-footer />
    
  `,
  styles: []
})
export class LandingComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  readonly CalendarIcon = CalendarDays;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly UsersIcon = Users;
  readonly AppleIcon = Apple;
  readonly AlertIcon = AlertTriangle;
  readonly StarIcon = Star;
  readonly ArrowRightIcon = ArrowRight;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
  }
}