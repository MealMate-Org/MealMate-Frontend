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
  Settings
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-gradient-to-br from-background via-celadon to-background py-12">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header de bienvenida -->
        <div class="mb-12">
          <h1 class="mb-3 text-5xl">Bienvenido, {{ currentUser?.username }}</h1>
          <p class="text-slate-gray text-2xl">Tu espacio personal de planificación de comidas</p>
        </div>

        <!-- Cards principales -->
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <!-- Planner -->
          <a 
            routerLink="/planner" 
            class="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-cambridge-blue"
          >
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-cambridge-blue to-zomp rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="CalendarIcon" class="w-10 h-10 text-white"></lucide-icon>
              </div>
              <span class="text-sm text-slate-gray font-medium">Esta semana</span>
            </div>
            <h3 class="mb-3 group-hover:text-cambridge-blue transition-colors text-2xl">Mi Planner</h3>
            <p class="text-slate-gray mb-6 text-lg">
              Organiza tu menú semanal
            </p>
            <div class="flex items-center text-cambridge-blue font-semibold text-lg">
              <span>Ver planner</span>
              <span class="ml-3 group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </div>
          </a>

          <!-- Mis Recetas -->
          <a 
            routerLink="/recipes/my" 
            class="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-zomp"
          >
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-zomp to-cambridge-blue rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="BookIcon" class="w-10 h-10 text-white"></lucide-icon>
              </div>
              <span class="text-sm text-slate-gray font-medium">Gestión</span>
            </div>
            <h3 class="mb-3 group-hover:text-zomp transition-colors text-2xl">Mis Recetas</h3>
            <p class="text-slate-gray mb-6 text-lg">
              Ver y editar tus recetas
            </p>
            <div class="flex items-center text-zomp font-semibold text-lg">
              <span>Gestionar recetas</span>
              <span class="ml-3 group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </div>
          </a>

          <!-- Lista de Compra -->
          <a 
            routerLink="/shopping-list" 
            class="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-success"
          >
            <div class="flex items-start justify-between mb-6">
              <div class="p-4 bg-gradient-to-br from-success to-green-600 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                <lucide-icon [img]="ShoppingCartIcon" class="w-10 h-10 text-white"></lucide-icon>
              </div>
              <span class="text-sm text-slate-gray font-medium">Compras</span>
            </div>
            <h3 class="mb-3 group-hover:text-success transition-colors text-2xl">Lista de Compra</h3>
            <p class="text-slate-gray mb-6 text-lg">
              Tu lista generada automáticamente
            </p>
            <div class="flex items-center text-success font-semibold text-lg">
              <span>Ver lista</span>
              <span class="ml-3 group-hover:translate-x-2 transition-transform text-2xl">→</span>
            </div>
          </a>
        </div>

        <!-- Acciones rápidas -->
        <div class="mb-12">
          <h2 class="mb-6 text-3xl">Acciones Rápidas</h2>
          <div class="grid md:grid-cols-4 gap-6">
            <a 
              routerLink="/recipes/new" 
              class="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100"
            >
              <div class="flex justify-center mb-4">
                <div class="p-4 bg-cambridge-blue bg-opacity-10 rounded-2xl group-hover:bg-cambridge-blue transition-all">
                  <lucide-icon [img]="PlusIcon" class="w-8 h-8 text-cambridge-blue group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold text-lg">Nueva Receta</p>
            </a>

            <a 
              routerLink="/recipes/saved" 
              class="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100"
            >
              <div class="flex justify-center mb-4">
                <div class="p-4 bg-error bg-opacity-10 rounded-2xl group-hover:bg-error transition-all">
                  <lucide-icon [img]="HeartIcon" class="w-8 h-8 text-error group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold text-lg">Guardadas</p>
            </a>

            <a 
              routerLink="/groups" 
              class="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100"
            >
              <div class="flex justify-center mb-4">
                <div class="p-4 bg-dark-purple bg-opacity-10 rounded-2xl group-hover:bg-dark-purple transition-all">
                  <lucide-icon [img]="UsersIcon" class="w-8 h-8 text-dark-purple group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold text-lg">Mis Grupos</p>
            </a>

            <a 
              routerLink="/profile" 
              class="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 group border border-gray-100"
            >
              <div class="flex justify-center mb-4">
                <div class="p-4 bg-zomp bg-opacity-10 rounded-2xl group-hover:bg-zomp transition-all">
                  <lucide-icon [img]="SettingsIcon" class="w-8 h-8 text-zomp group-hover:text-white transition-colors"></lucide-icon>
                </div>
              </div>
              <p class="font-semibold text-lg">Perfil</p>
            </a>
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}