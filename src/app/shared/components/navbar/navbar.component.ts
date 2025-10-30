import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { 
  LucideAngularModule, 
  ChefHat, 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="bg-dark-purple text-white shadow-xl border-b-2 border-cambridge-blue">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <!-- Logo y navegación principal -->
          <div class="flex items-center space-x-8">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-3 group">
              <img 
                src="/MMLogo.png" 
                alt="MealMate Logo" 
                class="h-12 w-auto transition-transform group-hover:scale-105"
                onerror="this.style.display='none'"
              >
              <span class="text-2xl font-bold text-white group-hover:text-cambridge-blue transition-colors">
                MealMate
              </span>
            </a>

            <!-- Navegación principal -->
            <div class="hidden md:flex space-x-2">
              <a
                routerLink="/recipes"
                routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                class="flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
              >
                <lucide-icon [img]="ChefHatIcon" class="w-5 h-5"></lucide-icon>
                <span>Recetas</span>
              </a>

              @if (currentUser) {
                <a
                  routerLink="/dashboard"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                >
                  <lucide-icon [img]="DashboardIcon" class="w-5 h-5"></lucide-icon>
                  <span>Dashboard</span>
                </a>
                <a
                  routerLink="/planner"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                >
                  <lucide-icon [img]="CalendarIcon" class="w-5 h-5"></lucide-icon>
                  <span>Planner</span>
                </a>
                <a
                  routerLink="/groups"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                >
                  <lucide-icon [img]="GroupsIcon" class="w-5 h-5"></lucide-icon>
                  <span>Grupos</span>
                </a>
              }
            </div>
          </div>

          <!-- Acciones de usuario -->
          <div class="flex items-center space-x-3">
            @if (currentUser) {
              <div class="flex items-center space-x-3">
                <!-- Perfil de usuario -->
                <a
                  [routerLink]="['/user', currentUser.username]"
                  class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all"
                >
                  <img
                    [src]="
                      currentUser.avatar ||
                      'https://ui-avatars.com/api/?name=' + currentUser.username + '&background=4ECDC4&color=fff&size=128'
                    "
                    [alt]="currentUser.username"
                    class="w-10 h-10 rounded-full border-2 border-cambridge-blue object-cover shadow-md"
                    (error)="onImageError($event)"
                  />
                  <span class="hidden md:block font-medium text-base">{{ currentUser.username }}</span>
                </a>
                
                <!-- Botón logout -->
                <button 
                  (click)="logout()" 
                  class="flex items-center space-x-2 px-4 py-2.5 bg-error hover:bg-red-700 text-white rounded-lg transition-all text-base font-medium shadow-md"
                >
                  <lucide-icon [img]="LogOutIcon" class="w-4 h-4"></lucide-icon>
                  <span class="hidden md:block">Salir</span>
                </button>
              </div>
            } @else {
              <a 
                routerLink="/login" 
                class="flex items-center space-x-2 px-5 py-2.5 bg-transparent border-2 border-cambridge-blue text-cambridge-blue hover:bg-cambridge-blue hover:text-white rounded-lg transition-all text-base font-medium"
              >
                <lucide-icon [img]="LogInIcon" class="w-4 h-4"></lucide-icon>
                <span>Iniciar Sesión</span>
              </a>
              <a 
                routerLink="/register" 
                class="flex items-center space-x-2 px-5 py-2.5 bg-cambridge-blue hover:bg-zomp text-white rounded-lg transition-all text-base font-medium shadow-md"
              >
                <lucide-icon [img]="UserPlusIcon" class="w-4 h-4"></lucide-icon>
                <span>Registrarse</span>
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  
  // Iconos de Lucide
  readonly ChefHatIcon = ChefHat;
  readonly DashboardIcon = LayoutDashboard;
  readonly CalendarIcon = CalendarDays;
  readonly GroupsIcon = Users;
  readonly LogOutIcon = LogOut;
  readonly LogInIcon = LogIn;
  readonly UserPlusIcon = UserPlus;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onImageError(event: any): void {
    if (this.currentUser) {
      event.target.src = `https://ui-avatars.com/api/?name=${this.currentUser.username}&background=4ECDC4&color=fff&size=128`;
    }
  }
}