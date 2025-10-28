import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FavoriteService } from '../../../core/services/user-actions.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../models/recipe.model';
import { Favorite } from '../../../models/social.model';

@Component({
  selector: 'app-saved-recipes',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1>Recetas Guardadas</h1>
        <p class="text-slate-gray">Tus recetas favoritas en un solo lugar</p>
      </div>

      @if (isLoading) {
        <div class="text-center py-12">
          <p class="text-slate-gray">Cargando recetas guardadas...</p>
        </div>
      }

      @if (errorMessage) {
        <div class="card bg-red-50 border-2 border-error mb-6">
          <p class="text-error">{{ errorMessage }}</p>
        </div>
      }

      @if (!isLoading && savedRecipes.length > 0) {
        <div class="grid md:grid-cols-3 gap-6">
          @for (recipe of savedRecipes; track recipe.id) {
            <div class="card">
              @if (recipe.imagePath) {
                <img 
                  [src]="recipe.imagePath" 
                  [alt]="recipe.title"
                  class="w-full h-48 object-cover rounded-t-card -mt-4 -mx-4 mb-4"
                >
              } @else {
                <div class="w-full h-48 bg-celadon rounded-t-card -mt-4 -mx-4 mb-4 flex items-center justify-center">
                  <span class="text-6xl">🍽️</span>
                </div>
              }

              <div class="flex justify-between items-start mb-2">
                <h3 class="flex-1">{{ recipe.title }}</h3>
                <button 
                  (click)="removeFromFavorites(recipe)"
                  class="text-2xl hover:scale-110 transition"
                  title="Quitar de favoritos"
                >
                  ❤️
                </button>
              </div>

              <p class="text-slate-gray text-sm mb-3 line-clamp-2">
                {{ recipe.description || 'Sin descripción' }}
              </p>

              <div class="flex justify-between items-center mb-3 text-sm">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-500">⭐</span>
                  <span class="font-medium">{{ recipe.avgRating.toFixed(1) }}</span>
                  <span class="text-slate-gray">({{ recipe.ratingCount }})</span>
                </div>
                @if (recipe.mealTypeId) {
                  <span class="badge">
                    {{ getMealTypeName(recipe.mealTypeId) }}
                  </span>
                }
              </div>

              @if (recipe.allergens && recipe.allergens.length > 0) {
                <div class="mb-3 flex gap-1 flex-wrap">
                  @for (allergen of recipe.allergens; track allergen.id) {
                    <span class="badge-error text-xs">
                      ⚠️ {{ allergen.name }}
                    </span>
                  }
                </div>
              }

              <div class="flex gap-2 pt-3 border-t border-celadon">
                <a 
                  [routerLink]="['/recipes', recipe.id]" 
                  class="btn-primary flex-1 text-center text-sm"
                >
                  Ver Receta
                </a>
                <button 
                  (click)="addToPlanner(recipe)"
                  class="btn-secondary text-sm px-3"
                  title="Añadir al planner"
                >
                  📅
                </button>
              </div>
            </div>
          }
        </div>
      }

      @if (!isLoading && savedRecipes.length === 0 && !errorMessage) {
        <div class="card text-center py-12">
          <div class="text-6xl mb-4">❤️</div>
          <h3 class="mb-3">Aún no tienes recetas guardadas</h3>
          <p class="text-slate-gray mb-6">
            Explora recetas y guarda tus favoritas haciendo clic en el corazón
          </p>
          <a routerLink="/recipes" class="btn-primary">
            Explorar Recetas
          </a>
        </div>
      }
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
export class SavedRecipesComponent implements OnInit {
  savedRecipes: Recipe[] = [];
  favorites: Favorite[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private favoriteService: FavoriteService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSavedRecipes();
  }

  loadSavedRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'Debes iniciar sesión para ver tus recetas guardadas';
      this.isLoading = false;
      return;
    }

    console.log('Usuario actual:', currentUser);

    // Cargar favoritos del usuario
    this.favoriteService.getAllFavorites().subscribe({
      next: (favorites) => {
        console.log('Todos los favoritos:', favorites);
        
        // Filtrar solo los favoritos del usuario actual
        this.favorites = favorites.filter(f => f.userId === currentUser.id);
        console.log('Favoritos del usuario:', this.favorites);
        
        if (this.favorites.length === 0) {
          this.isLoading = false;
          return;
        }

        // Obtener los IDs de las recetas favoritas
        const recipeIds = this.favorites.map(f => f.recipeId);
        console.log('IDs de recetas favoritas:', recipeIds);
        
        // Cargar todas las recetas y filtrar las favoritas
        this.recipeService.getAllRecipes().subscribe({
          next: (recipes) => {
            console.log('Todas las recetas:', recipes.length);
            this.savedRecipes = recipes.filter(r => recipeIds.includes(r.id));
            console.log('Recetas guardadas:', this.savedRecipes.length);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error cargando recetas:', error);
            this.errorMessage = 'Error al cargar las recetas. Por favor, inténtalo de nuevo.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.errorMessage = 'Error al cargar favoritos. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(recipe: Recipe): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const confirmed = confirm(`¿Quitar "${recipe.title}" de favoritos?`);
    if (!confirmed) return;

    this.favoriteService.removeFavorite(currentUser.id, recipe.id).subscribe({
      next: () => {
        // Quitar de la lista local
        this.savedRecipes = this.savedRecipes.filter(r => r.id !== recipe.id);
        this.favorites = this.favorites.filter(f => f.recipeId !== recipe.id);
      },
      error: (error) => {
        console.error('Error quitando favorito:', error);
        alert('Error al quitar de favoritos. Inténtalo de nuevo.');
      }
    });
  }

  getMealTypeName(id: number): string {
    const types: {[key: number]: string} = {
      1: 'Desayuno',
      2: 'Comida',
      3: 'Cena',
      4: 'Aperitivo',
      5: 'Merienda'
    };
    return types[id] || 'Otro';
  }

  addToPlanner(recipe: Recipe): void {
    alert(`Función de añadir "${recipe.title}" al planner en desarrollo`);
  }
}