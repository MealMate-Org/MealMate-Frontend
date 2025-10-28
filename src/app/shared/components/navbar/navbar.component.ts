import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-dark-purple text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <a routerLink="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-cambridge-blue">🍽️</span>
              <span class="text-xl font-bold">MealMate</span>
            </a>
            
            <div class="hidden md:flex space-x-4">
              <a routerLink="/recipes" 
                 routerLinkActive="text-cambridge-blue"
                 class="px-3 py-2 rounded-md hover:text-cambridge-blue transition">
                Recetas
              </a>
              
              @if (currentUser) {
                <a routerLink="/dashboard" 
                   routerLinkActive="text-cambridge-blue"
                   class="px-3 py-2 rounded-md hover:text-cambridge-blue transition">
                  Dashboard
                </a>
                <a routerLink="/planner" 
                   routerLinkActive="text-cambridge-blue"
                   class="px-3 py-2 rounded-md hover:text-cambridge-blue transition">
                  Planner
                </a>
                <a routerLink="/groups" 
                   routerLinkActive="text-cambridge-blue"
                   class="px-3 py-2 rounded-md hover:text-cambridge-blue transition">
                  Grupos
                </a>
              }
            </div>
          </div>

          <div class="flex items-center space-x-4">
            @if (currentUser) {
              <div class="flex items-center space-x-3">
                <!-- Enlace al perfil público del usuario -->
                <a [routerLink]="['/@' + currentUser.username]" class="flex items-center space-x-2 hover:text-cambridge-blue transition">
                  <img 
                    [src]="currentUser.avatar || 'https://via.placeholder.com/32?text=' + currentUser.username[0].toUpperCase()" 
                    [alt]="currentUser.username"
                    class="w-8 h-8 rounded-full border-2 border-cambridge-blue object-cover"
                    (error)="onImageError($event)">
                  <span class="hidden md:block">{{ currentUser.username }}</span>
                </a>
                <button 
                  (click)="logout()"
                  class="btn-secondary text-sm">
                  Cerrar Sesión
                </button>
              </div>
            } @else {
              <a routerLink="/login" class="btn-secondary text-sm">
                Iniciar Sesión
              </a>
              <a routerLink="/register" class="btn-primary text-sm">
                Registrarse
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/32?text=U';
  }
}