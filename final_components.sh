#!/bin/bash

# LANDING COMPONENT (Documento 39)
cat > src/app/features/public/landing/landing.component.ts << 'LANDEOF'
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
LANDEOF

echo "✅ Landing component created"

# RECIPES LIST COMPONENT (Documento 40)
cat > src/app/features/public/recipes-list/recipes-list.component.ts << 'RECIPEOF'
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <h1 class="mb-4">Recetas Públicas</h1>
          
          <div class="flex gap-4 mb-4">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()"
              placeholder="Buscar recetas..."
              class="input flex-1"
            >
            <button class="btn-primary" (click)="onSearch()">
              🔍 Buscar
            </button>
          </div>

          <div class="flex gap-2 flex-wrap">
            <button 
              (click)="toggleFilter('vegetarian')"
              [class]="activeFilters.includes('vegetarian') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🥬 Vegetariano
            </button>
            <button 
              (click)="toggleFilter('vegan')"
              [class]="activeFilters.includes('vegan') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🌱 Vegano
            </button>
            <button 
              (click)="toggleFilter('glutenFree')"
              [class]="activeFilters.includes('glutenFree') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🌾 Sin Gluten
            </button>
            <button 
              (click)="toggleFilter('popular')"
              [class]="activeFilters.includes('popular') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              ⭐ Popular
            </button>
          </div>
        </div>

        @if (isLoading) {
          <div class="text-center py-12">
            <p class="text-slate-gray">Cargando recetas...</p>
          </div>
        }

        @if (!isLoading && recipes.length > 0) {
          <div class="grid md:grid-cols-3 gap-6">
            @for (recipe of recipes; track recipe.id) {
              <a [routerLink]="['/recipes', recipe.id]" class="card hover:shadow-lg transition cursor-pointer">
                @if (recipe.imagePath) {
                  <img 
                    [src]="recipe.imagePath" 
                    [alt]="recipe.title"
                    class="w-full h-48 object-cover rounded-t-card mb-4"
                  >
                } @else {
                  <div class="w-full h-48 bg-celadon rounded-t-card mb-4 flex items-center justify-center">
                    <span class="text-6xl">🍽️</span>
                  </div>
                }

                <div class="p-4">
                  <h3 class="mb-2">{{ recipe.title }}</h3>
                  <p class="text-slate-gray text-sm mb-3 line-clamp-2">
                    {{ recipe.description || 'Sin descripción' }}
                  </p>

                  <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-gray">
                      Por {{ recipe.authorId }}
                    </span>
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">⭐</span>
                      <span class="font-medium">{{ recipe.avgRating.toFixed(1) }}</span>
                      <span class="text-slate-gray">({{ recipe.ratingCount }})</span>
                    </div>
                  </div>

                  @if (recipe.allergens && recipe.allergens.length > 0) {
                    <div class="mt-3 flex gap-1 flex-wrap">
                      @for (allergen of recipe.allergens; track allergen.id) {
                        <span class="badge-error text-xs">
                          ⚠️ {{ allergen.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </a>
            }
          </div>
        }

        @if (!isLoading && recipes.length === 0) {
          <div class="text-center py-12 card">
            <p class="text-2xl mb-2">🔍</p>
            <p class="text-slate-gray">No se encontraron recetas</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  searchTerm: string = '';
  activeFilters: string[] = [];
  isLoading = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.recipeService.searchRecipes(this.searchTerm).subscribe({
        next: (recipes) => {
          this.recipes = recipes;
        },
        error: (error) => {
          console.error('Error buscando:', error);
        }
      });
    } else {
      this.loadRecipes();
    }
  }

  toggleFilter(filter: string): void {
    const index = this.activeFilters.indexOf(filter);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
    } else {
      this.activeFilters.push(filter);
    }
  }
}
RECIPEOF

echo "✅ Recipes list component created"

# DASHBOARD COMPONENT (Documento 38)
cat > src/app/features/private/dashboard/dashboard.component.ts << 'DASHEOF'
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
DASHEOF

echo "✅ Dashboard component created"
echo "✅ Todos los componentes principales han sido creados!"

