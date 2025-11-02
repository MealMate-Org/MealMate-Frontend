import { Component, OnInit, HostListener } from '@angular/core';
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
  UserPlus,
  Menu,
  X
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="bg-dark-purple text-white shadow-xl border-b-2 border-cambridge-blue relative z-50">
      <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex justify-between h-20">
          <!-- Logo y navegación principal -->
          <div class="flex items-center space-x-6">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-2 group">
              <img 
                src="/MMLogo.png" 
                alt="MealMate Logo" 
                class="h-10 w-auto transition-transform group-hover:scale-105"
                onerror="this.style.display='none'"
              >
              <span class="text-xl font-bold text-white group-hover:text-cambridge-blue transition-colors">
                MealMate
              </span>
            </a>

            <!-- Navegación principal - Desktop -->
            <div class="hidden md:flex space-x-1">
              <a
                routerLink="/recipes"
                routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
              >
                <lucide-icon [img]="ChefHatIcon" class="w-4 h-4"></lucide-icon>
                <span>Recetas</span>
              </a>

              @if (currentUser) {
                <a
                  routerLink="/dashboard"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-sm font-medium"
                >
                  <lucide-icon [img]="DashboardIcon" class="w-4 h-4"></lucide-icon>
                  <span>Dashboard</span>
                </a>
                <a
                  routerLink="/planner"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-sm font-medium"
                >
                  <lucide-icon [img]="CalendarIcon" class="w-4 h-4"></lucide-icon>
                  <span>Planner</span>
                </a>
                <a
                  routerLink="/groups"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-sm font-medium"
                >
                  <lucide-icon [img]="GroupsIcon" class="w-4 h-4"></lucide-icon>
                  <span>Grupos</span>
                </a>
              }
            </div>
          </div>

          <!-- Acciones de usuario - Desktop -->
          <div class="hidden md:flex items-center space-x-2">
            @if (currentUser) {
              <div class="flex items-center space-x-2">
                <!-- Perfil de usuario -->
                <a
                  [routerLink]="['/user', currentUser.username]"
                  class="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all"
                >
                  <img
                    [src]="
                      currentUser.avatar ||
                      'https://ui-avatars.com/api/?name=' + currentUser.username + '&background=4ECDC4&color=fff&size=128'
                    "
                    [alt]="currentUser.username"
                    class="w-8 h-8 rounded-full border-2 border-cambridge-blue object-cover shadow-md"
                    (error)="onImageError($event)"
                  />
                  <span class="font-medium text-sm">{{ currentUser.username }}</span>
                </a>
                
                <!-- Botón logout -->
                <button 
                  (click)="logout()" 
                  class="flex items-center space-x-1.5 px-3 py-1.5 bg-error hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium shadow-md"
                >
                  <lucide-icon [img]="LogOutIcon" class="w-4 h-4"></lucide-icon>
                  <span>Salir</span>
                </button>
              </div>
            } @else {
              <a 
                routerLink="/login" 
                class="flex items-center space-x-1.5 px-4 py-1.5 bg-transparent border-2 border-cambridge-blue text-cambridge-blue hover:bg-cambridge-blue hover:text-white rounded-lg transition-all text-sm font-medium"
              >
                <lucide-icon [img]="LogInIcon" class="w-4 h-4"></lucide-icon>
                <span>Iniciar Sesión</span>
              </a>
              <a 
                routerLink="/register" 
                class="flex items-center space-x-1.5 px-4 py-1.5 bg-cambridge-blue hover:bg-zomp text-white rounded-lg transition-all text-sm font-medium shadow-md"
              >
                <lucide-icon [img]="UserPlusIcon" class="w-4 h-4"></lucide-icon>
                <span>Registrarse</span>
              </a>
            }
          </div>

          <!-- Botón menú hamburguesa - Mobile -->
          <div class="md:hidden flex items-center">
            <button
              (click)="toggleMobileMenu()"
              class="p-2 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all"
              aria-label="Toggle menu"
            >
              <lucide-icon 
                [img]="isMobileMenuOpen ? XIcon : MenuIcon" 
                class="w-6 h-6"
              ></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Menú móvil -->
        @if (isMobileMenuOpen) {
          <div class="md:hidden absolute top-full left-0 right-0 bg-dark-purple border-t border-cambridge-blue border-opacity-30 shadow-lg z-50">
            <div class="px-6 py-4">
              <!-- Navegación móvil -->
              <div class="space-y-2 mb-4">
                <a
                  routerLink="/recipes"
                  (click)="closeMobileMenu()"
                  routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                  class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                >
                  <lucide-icon [img]="ChefHatIcon" class="w-5 h-5"></lucide-icon>
                  <span>Recetas</span>
                </a>

                @if (currentUser) {
                  <a
                    routerLink="/dashboard"
                    (click)="closeMobileMenu()"
                    routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                    class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                  >
                    <lucide-icon [img]="DashboardIcon" class="w-5 h-5"></lucide-icon>
                    <span>Dashboard</span>
                  </a>
                  <a
                    routerLink="/planner"
                    (click)="closeMobileMenu()"
                    routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                    class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                  >
                    <lucide-icon [img]="CalendarIcon" class="w-5 h-5"></lucide-icon>
                    <span>Planner</span>
                  </a>
                  <a
                    routerLink="/groups"
                    (click)="closeMobileMenu()"
                    routerLinkActive="bg-cambridge-blue bg-opacity-20 text-cambridge-blue"
                    class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all text-base font-medium"
                  >
                    <lucide-icon [img]="GroupsIcon" class="w-5 h-5"></lucide-icon>
                    <span>Grupos</span>
                  </a>
                }
              </div>

              <!-- Acciones de usuario móvil -->
              <div class="pt-4 border-t border-cambridge-blue border-opacity-20 space-y-3">
                @if (currentUser) {
                  <!-- Perfil de usuario móvil -->
                  <a
                    [routerLink]="['/user', currentUser.username]"
                    (click)="closeMobileMenu()"
                    class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-10 transition-all"
                  >
                    <img
                      [src]="
                        currentUser.avatar ||
                        'https://ui-avatars.com/api/?name=' + currentUser.username + '&background=4ECDC4&color=fff&size=128'
                      "
                      [alt]="currentUser.username"
                      class="w-8 h-8 rounded-full border-2 border-cambridge-blue object-cover shadow-md"
                      (error)="onImageError($event)"
                    />
                    <span class="font-medium">{{ currentUser.username }}</span>
                  </a>
                  
                  <!-- Botón logout móvil -->
                  <button 
                    (click)="logout(); closeMobileMenu();" 
                    class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-md"
                  >
                    <lucide-icon [img]="LogOutIcon" class="w-5 h-5"></lucide-icon>
                    <span>Cerrar Sesión</span>
                  </button>
                } @else {
                  <a 
                    routerLink="/login" 
                    (click)="closeMobileMenu()"
                    class="flex items-center justify-center space-x-2 px-4 py-3 bg-transparent border-2 border-cambridge-blue text-cambridge-blue hover:bg-cambridge-blue hover:text-white rounded-lg transition-all font-medium"
                  >
                    <lucide-icon [img]="LogInIcon" class="w-5 h-5"></lucide-icon>
                    <span>Iniciar Sesión</span>
                  </a>
                  <a 
                    routerLink="/register" 
                    (click)="closeMobileMenu()"
                    class="flex items-center justify-center space-x-2 px-4 py-3 bg-cambridge-blue hover:bg-zomp text-white rounded-lg transition-all font-medium shadow-md"
                  >
                    <lucide-icon [img]="UserPlusIcon" class="w-5 h-5"></lucide-icon>
                    <span>Registrarse</span>
                  </a>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Overlay para cerrar menú al hacer click fuera - SOLO en móvil -->
      @if (isMobileMenuOpen) {
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          (click)="closeMobileMenu()"
        ></div>
      }
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  
  // Iconos de Lucide
  readonly ChefHatIcon = ChefHat;
  readonly DashboardIcon = LayoutDashboard;
  readonly CalendarIcon = CalendarDays;
  readonly GroupsIcon = Users;
  readonly LogOutIcon = LogOut;
  readonly LogInIcon = LogIn;
  readonly UserPlusIcon = UserPlus;
  readonly MenuIcon = Menu;
  readonly XIcon = X;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  // Cerrar menú móvil al cambiar el tamaño de la ventana a desktop
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  onImageError(event: any): void {
    if (this.currentUser) {
      event.target.src = `https://ui-avatars.com/api/?name=${this.currentUser.username}&background=4ECDC4&color=fff&size=128`;
    }
  }
}