import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <h1 class="mb-2">¡Bienvenido, {{ currentUser?.username }}! 👋</h1>
          <p class="text-slate-gray">Aquí está tu resumen de la semana</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <a routerLink="/planner" class="card hover:shadow-lg transition cursor-pointer">
            <div class="text-4xl mb-3">📅</div>
            <h3 class="mb-2">Mi Planner</h3>
            <p class="text-slate-gray text-sm">
              Organiza tu menú semanal
            </p>
          </a>

          <a routerLink="/recipes/my" class="card hover:shadow-lg transition cursor-pointer">
            <div class="text-4xl mb-3">📖</div>
            <h3 class="mb-2">Mis Recetas</h3>
            <p class="text-slate-gray text-sm">
              Ver y editar tus recetas
            </p>
          </a>

          <a routerLink="/shopping-list" class="card hover:shadow-lg transition cursor-pointer">
            <div class="text-4xl mb-3">🛒</div>
            <h3 class="mb-2">Lista de Compra</h3>
            <p class="text-slate-gray text-sm">
              Tu lista generada automáticamente
            </p>
          </a>
        </div>

        <div class="grid md:grid-cols-4 gap-4">
          <a routerLink="/recipes/new" class="card text-center hover:shadow-lg transition">
            <div class="text-2xl mb-2">➕</div>
            <p class="font-medium">Nueva Receta</p>
          </a>

          <a routerLink="/recipes/saved" class="card text-center hover:shadow-lg transition">
            <div class="text-2xl mb-2">❤️</div>
            <p class="font-medium">Guardadas</p>
          </a>

          <a routerLink="/groups" class="card text-center hover:shadow-lg transition">
            <div class="text-2xl mb-2">👥</div>
            <p class="font-medium">Mis Grupos</p>
          </a>

          <a routerLink="/profile" class="card text-center hover:shadow-lg transition">
            <div class="text-2xl mb-2">⚙️</div>
            <p class="font-medium">Perfil</p>
          </a>
        </div>

        <div class="card mt-8">
          <h3 class="mb-4">Resumen Nutricional de esta Semana</h3>
          <div class="grid md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-celadon rounded-card">
              <div class="text-2xl font-bold text-dark-purple">1,850</div>
              <div class="text-sm text-slate-gray">Calorías/día promedio</div>
            </div>
            <div class="text-center p-4 bg-celadon rounded-card">
              <div class="text-2xl font-bold text-dark-purple">120g</div>
              <div class="text-sm text-slate-gray">Proteína/día</div>
            </div>
            <div class="text-center p-4 bg-celadon rounded-card">
              <div class="text-2xl font-bold text-dark-purple">180g</div>
              <div class="text-sm text-slate-gray">Carbohidratos/día</div>
            </div>
            <div class="text-center p-4 bg-celadon rounded-card">
              <div class="text-2xl font-bold text-dark-purple">65g</div>
              <div class="text-sm text-slate-gray">Grasas/día</div>
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
