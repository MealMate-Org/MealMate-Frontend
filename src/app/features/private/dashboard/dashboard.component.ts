import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { 
  LucideAngularModule,
  CalendarDays,
  BookOpen,
  ShoppingCart,
  Plus,
  Heart,
  Users,
  Settings,
  TrendingUp,
  Flame,
  Apple,
  Target
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-gradient-to-br from-background to-celadon py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header de bienvenida -->
        <div class="mb-8">
          <h1 class="mb-2">¡Bienvenido, {{ currentUser?.username }}! 👋</h1>
          <p class="text-slate-gray text-lg">Aquí está tu resumen de la semana</p>
        </div>

        <!-- Cards principales -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <!-- Planner -->
          <a 
            routerLink="/planner" 
            class="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-cambridge-blue"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-cambridge-blue bg-opacity-10 rounded-xl group-hover:bg-cambridge-blue group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="CalendarIcon" class="w-8 h-8 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
              </div>
              <span class="text-xs text-slate-gray">Esta semana</span>
            </div>
            <h3 class="mb-2 group-hover:text-cambridge-blue transition-colors">Mi Planner</h3>
            <p class="text-slate-gray text-sm mb-4">
              Organiza tu menú semanal
            </p>
            <div class="flex items-center text-cambridge-blue font-medium text-sm">
              <span>Ver planner</span>
              <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          <!-- Mis Recetas -->
          <a 
            routerLink="/recipes/my" 
            class="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-zomp"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-zomp bg-opacity-10 rounded-xl group-hover:bg-zomp group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="BookIcon" class="w-8 h-8 text-zomp group-hover:text-white transition-colors"></lucide-icon>
              </div>
              <span class="text-xs text-slate-gray">12 recetas</span>
            </div>
            <h3 class="mb-2 group-hover:text-zomp transition-colors">Mis Recetas</h3>
            <p class="text-slate-gray text-sm mb-4">
              Ver y editar tus recetas
            </p>
            <div class="flex items-center text-zomp font-medium text-sm">
              <span>Gestionar recetas</span>
              <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          <!-- Lista de Compra -->
          <a 
            routerLink="/shopping-list" 
            class="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-success"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-success bg-opacity-10 rounded-xl group-hover:bg-success group-hover:bg-opacity-100 transition-all">
                <lucide-icon [img]="ShoppingCartIcon" class="w-8 h-8 text-success group-hover:text-white transition-colors"></lucide-icon>
              </div>
              <span class="text-xs text-slate-gray">8 items</span>
            </div>
            <h3 class="mb-2 group-hover:text-success transition-colors">Lista de Compra</h3>
            <p class="text-slate-gray text-sm mb-4">
              Tu lista generada automáticamente
            </p>
            <div class="flex items-center text-success font-medium text-sm">
              <span>Ver lista</span>
              <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        </div>

        <!-- Acciones rápidas -->
        <div class="mb-8">
          <h2 class="mb-4 text-2xl">Acciones Rápidas</h2>
          <div class="grid md:grid-cols-4 gap-4">
            <a 
              routerLink="/recipes/new" 
              class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div class="flex justify-center mb-3">
                <div class="p-3 bg-cambridge-blue bg-opacity-10 rounded-full group-hover:bg-cambridge-blue transition-all">
                  <lucide-icon [img]="PlusIcon" class="w-6 h-6 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold">Nueva Receta</p>
            </a>

            <a 
              routerLink="/recipes/saved" 
              class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div class="flex justify-center mb-3">
                <div class="p-3 bg-error bg-opacity-10 rounded-full group-hover:bg-error transition-all">
                  <lucide-icon [img]="HeartIcon" class="w-6 h-6 text-error group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold">Guardadas</p>
            </a>

            <a 
              routerLink="/groups" 
              class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div class="flex justify-center mb-3">
                <div class="p-3 bg-dark-purple bg-opacity-10 rounded-full group-hover:bg-dark-purple transition-all">
                  <lucide-icon [img]="UsersIcon" class="w-6 h-6 text-dark-purple group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold">Mis Grupos</p>
            </a>

            <a 
              routerLink="/profile" 
              class="card text-center hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div class="flex justify-center mb-3">
                <div class="p-3 bg-zomp bg-opacity-10 rounded-full group-hover:bg-zomp transition-all">
                  <lucide-icon [img]="SettingsIcon" class="w-6 h-6 text-zomp group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold">Perfil</p>
            </a>
          </div>
        </div>

        <!-- Resumen nutricional -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="mb-1">Resumen Nutricional de esta Semana</h3>
              <p class="text-slate-gray text-sm">Promedio diario</p>
            </div>
            <div class="flex items-center space-x-2 text-success">
              <lucide-icon [img]="TrendingUpIcon" class="w-5 h-5"></lucide-icon>
              <span class="font-bold">+5%</span>
            </div>
          </div>

          <div class="grid md:grid-cols-4 gap-4">
            <!-- Calorías -->
            <div class="text-center p-5 bg-gradient-to-br from-cambridge-blue to-zomp rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex justify-center mb-2">
                <lucide-icon [img]="FlameIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <div class="text-3xl font-bold mb-1">1,850</div>
              <div class="text-sm opacity-90">Calorías/día</div>
              <div class="mt-2 pt-2 border-t border-white border-opacity-30 text-xs">
                Meta: 2,000 kcal
              </div>
            </div>

            <!-- Proteína -->
            <div class="text-center p-5 bg-gradient-to-br from-success to-green-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex justify-center mb-2">
                <lucide-icon [img]="AppleIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <div class="text-3xl font-bold mb-1">120g</div>
              <div class="text-sm opacity-90">Proteína/día</div>
              <div class="mt-2 pt-2 border-t border-white border-opacity-30 text-xs">
                Meta: 150g
              </div>
            </div>

            <!-- Carbohidratos -->
            <div class="text-center p-5 bg-gradient-to-br from-zomp to-teal-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex justify-center mb-2">
                <lucide-icon [img]="TargetIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <div class="text-3xl font-bold mb-1">180g</div>
              <div class="text-sm opacity-90">Carbohidratos/día</div>
              <div class="mt-2 pt-2 border-t border-white border-opacity-30 text-xs">
                Meta: 250g
              </div>
            </div>

            <!-- Grasas -->
            <div class="text-center p-5 bg-gradient-to-br from-dark-purple to-purple-900 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex justify-center mb-2">
                <lucide-icon [img]="TargetIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <div class="text-3xl font-bold mb-1">65g</div>
              <div class="text-sm opacity-90">Grasas/día</div>
              <div class="mt-2 pt-2 border-t border-white border-opacity-30 text-xs">
                Meta: 70g
              </div>
            </div>
          </div>

          <!-- Barra de progreso semanal -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">Progreso semanal</span>
              <span class="text-sm text-slate-gray">5 de 7 días completados</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div class="bg-gradient-to-r from-cambridge-blue to-zomp h-3 rounded-full transition-all duration-500" style="width: 71%"></div>
            </div>
          </div>
        </div>

        <!-- Tips y consejos -->
        <div class="mt-8 card bg-gradient-to-r from-celadon to-cambridge-blue bg-opacity-20">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 p-3 bg-white rounded-full">
              <lucide-icon [img]="TargetIcon" class="w-6 h-6 text-cambridge-blue"></lucide-icon>
            </div>
            <div>
              <h4 class="mb-2">💡 Consejo del día</h4>
              <p class="text-slate-gray">
                ¡Vas muy bien! Has completado el 71% de tus objetivos esta semana. 
                Mantén el ritmo y alcanzarás todas tus metas nutricionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Iconos de Lucide
  readonly CalendarIcon = CalendarDays;
  readonly BookIcon = BookOpen;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly PlusIcon = Plus;
  readonly HeartIcon = Heart;
  readonly UsersIcon = Users;
  readonly SettingsIcon = Settings;
  readonly TrendingUpIcon = TrendingUp;
  readonly FlameIcon = Flame;
  readonly AppleIcon = Apple;
  readonly TargetIcon = Target;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}