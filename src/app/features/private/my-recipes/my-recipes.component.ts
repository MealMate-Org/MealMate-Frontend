import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1>Mis Recetas</h1>
          <p class="text-slate-gray">Gestiona todas tus recetas creadas</p>
        </div>
        <a routerLink="/recipes/new" class="btn-primary"> + Nueva Receta </a>
      </div>

      <!-- Filtros -->
      <div class="card mb-6">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="filterRecipes()"
              class="input w-full"
              placeholder="Buscar en mis recetas..."
            />
          </div>
          <div>
            <select [(ngModel)]="visibilityFilter" (change)="filterRecipes()" class="input">
              <option value="all">Todas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
          </div>
          <div>
            <select [(ngModel)]="mealTypeFilter" (change)="filterRecipes()" class="input">
              <option [value]="null">Todos los tipos</option>
              <option [value]="1">Desayuno</option>
              <option [value]="2">Comida</option>
              <option [value]="3">Cena</option>
              <option [value]="4">Aperitivo</option>
              <option [value]="5">Merienda</option>
            </select>
          </div>
        </div>
      </div>

      @if (isLoading) {
      <div class="text-center py-12">
        <p class="text-slate-gray">Cargando tus recetas...</p>
      </div>
      } @if (!isLoading && filteredRecipes.length > 0) {
      <div class="grid md:grid-cols-3 gap-6">
        @for (recipe of filteredRecipes; track recipe.id) {
        <div class="card">
          @if (recipe.imagePath) {
          <img
            [src]="recipe.imagePath"
            [alt]="recipe.title"
            class="w-full h-48 object-cover rounded-t-card -mt-4 -mx-4 mb-4"
          />
          } @else {
          <div
            class="w-full h-48 bg-celadon rounded-t-card -mt-4 -mx-4 mb-4 flex items-center justify-center"
          >
            <span class="text-6xl">🍽️</span>
          </div>
          }

          <div class="flex justify-between items-start mb-2">
            <h3 class="flex-1">{{ recipe.title }}</h3>
            <div class="flex items-center gap-1 text-sm">
              <span class="text-yellow-500">⭐</span>
              <span>{{ recipe.avgRating.toFixed(1) }}</span>
            </div>
          </div>

          <p class="text-slate-gray text-sm mb-3 line-clamp-2">
            {{ recipe.description || 'Sin descripción' }}
          </p>

          <div class="flex justify-between items-center mb-3 text-sm">
            <span [class]="recipe.isPublic ? 'badge' : 'badge bg-slate-gray'">
              {{ recipe.isPublic ? '🌍 Pública' : '🔒 Privada' }}
            </span>
            @if (recipe.mealTypeId) {
            <span class="text-slate-gray">
              {{ getMealTypeName(recipe.mealTypeId) }}
            </span>
            }
          </div>

          @if (recipe.allergens && recipe.allergens.length > 0) {
          <div class="mb-3 flex gap-1 flex-wrap">
            @for (allergen of recipe.allergens; track allergen.id) {
            <span class="badge-error text-xs"> ⚠️ {{ allergen.name }} </span>
            }
          </div>
          }

          <div class="flex gap-2 pt-3 border-t border-celadon">
            <a
              [routerLink]="['/recipes', recipe.id]"
              class="btn-secondary flex-1 text-center text-sm"
            >
              👁️ Ver
            </a>
            <a
              [routerLink]="['/recipes/edit', recipe.id]"
              class="btn-secondary flex-1 text-center text-sm"
            >
              ✏️ Editar
            </a>
            <button (click)="deleteRecipe(recipe)" class="btn-secondary text-sm px-3">🗑️</button>
          </div>
        </div>
        }
      </div>

      <!-- Paginación simple -->
      @if (myRecipes.length > 12) {
      <div class="mt-8 text-center">
        <p class="text-slate-gray">
          Mostrando {{ filteredRecipes.length }} de {{ myRecipes.length }} recetas
        </p>
      </div>
      } } @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length === 0) {
      <div class="card text-center py-12">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="mb-3">Aún no tienes recetas</h3>
        <p class="text-slate-gray mb-6">¡Empieza a crear tus propias recetas y guárdalas aquí!</p>
        <a routerLink="/recipes/new" class="btn-primary"> Crear Mi Primera Receta </a>
      </div>
      } @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length > 0) {
      <div class="card text-center py-12">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="mb-3">No se encontraron recetas</h3>
        <p class="text-slate-gray mb-6">Intenta con otros filtros o términos de búsqueda</p>
        <button (click)="clearFilters()" class="btn-secondary">Limpiar Filtros</button>
      </div>
      }
    </div>

    <!-- Modal de confirmación de eliminación -->
    @if (recipeToDelete) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-card p-6 max-w-md mx-4">
        <h3 class="mb-3">¿Eliminar receta?</h3>
        <p class="text-slate-gray mb-6">
          ¿Estás seguro de que quieres eliminar "<strong>{{ recipeToDelete.title }}</strong
          >"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3 justify-end">
          <button (click)="recipeToDelete = null" class="btn-secondary">Cancelar</button>
          <button (click)="confirmDelete()" class="btn-primary bg-error hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class MyRecipesComponent implements OnInit {
  myRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  isLoading = true;
  searchTerm = '';
  visibilityFilter = 'all';
  mealTypeFilter: number | null = null;
  recipeToDelete: Recipe | null = null;

  constructor(private recipeService: RecipeService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadMyRecipes();
  }

  loadMyRecipes(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    console.log('✅ Usuario válido, ID:', currentUser.id);

    // Cargar todas las recetas y filtrar las del usuario
    // NOTA: El backend podría optimizarse para filtrar en servidor
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.myRecipes = recipes.filter((r) => r.authorId === currentUser.id);
        this.filteredRecipes = [...this.myRecipes];
        this.isLoading = false;
        console.log('✅ Mis recetas cargadas:', this.myRecipes.length);
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      },
    });
  }

  filterRecipes(): void {
    let filtered = [...this.myRecipes];

    // Filtro de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term)
      );
    }

    // Filtro de visibilidad
    if (this.visibilityFilter !== 'all') {
      const isPublic = this.visibilityFilter === 'public';
      filtered = filtered.filter((recipe) => recipe.isPublic === isPublic);
    }

    // Filtro de tipo de comida
    if (this.mealTypeFilter !== null) {
      filtered = filtered.filter((recipe) => recipe.mealTypeId === this.mealTypeFilter);
    }

    this.filteredRecipes = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.visibilityFilter = 'all';
    this.mealTypeFilter = null;
    this.filterRecipes();
  }

  getMealTypeName(id: number): string {
    const types: { [key: number]: string } = {
      1: 'Desayuno',
      2: 'Comida',
      3: 'Cena',
      4: 'Aperitivo',
      5: 'Merienda',
    };
    return types[id] || 'Otro';
  }

  deleteRecipe(recipe: Recipe): void {
    this.recipeToDelete = recipe;
  }

  confirmDelete(): void {
    if (!this.recipeToDelete) return;

    this.recipeService.deleteRecipe(this.recipeToDelete.id).subscribe({
      next: () => {
        // Eliminar de las listas locales
        this.myRecipes = this.myRecipes.filter((r) => r.id !== this.recipeToDelete?.id);
        this.filterRecipes();
        this.recipeToDelete = null;
      },
      error: (error) => {
        console.error('Error eliminando receta:', error);
        alert('Error al eliminar la receta. Inténtalo de nuevo.');
        this.recipeToDelete = null;
      },
    });
  }
}
