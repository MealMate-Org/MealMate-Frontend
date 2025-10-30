import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FavoriteService } from '../../../core/services/user-actions.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../models/recipe.model';
import { Favorite } from '../../../models/social.model';
import { 
  LucideAngularModule,
  Heart,
  Trash2,
  Calendar,
  Star,
  ChefHat,
  AlertTriangle,
  Search
} from 'lucide-angular';

@Component({
  selector: 'app-saved-recipes',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <div class="mb-8">
          <h1 class="mb-2 text-4xl">Recetas Guardadas</h1>
          <p class="text-slate-gray text-lg">Tus recetas favoritas en un solo lugar</p>
        </div>

        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"></div>
            <p class="text-slate-gray text-base">Cargando recetas guardadas...</p>
          </div>
        }

        @if (errorMessage) {
          <div class="bg-red-50 border-2 border-error rounded-2xl p-4 mb-6">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="AlertIcon" class="w-5 h-5 text-error"></lucide-icon>
              <p class="text-error font-semibold text-sm">{{ errorMessage }}</p>
            </div>
          </div>
        }

        @if (!isLoading && savedRecipes.length > 0) {
          <div class="mb-5 text-slate-gray text-base">
            {{ savedRecipes.length }} recetas guardadas
          </div>
          
          <div class="grid md:grid-cols-3 gap-6">
            @for (recipe of savedRecipes; track recipe.id) {
              <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <!-- Imagen -->
                @if (recipe.imagePath) {
                  <div class="relative h-48 overflow-hidden">
                    <img 
                      [src]="recipe.imagePath" 
                      [alt]="recipe.title"
                      class="w-full h-full object-cover"
                    >
                  </div>
                } @else {
                  <div class="relative h-48 bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
                    <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-white opacity-50"></lucide-icon>
                  </div>
                }

                <div class="p-5">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="flex-1 text-lg">{{ recipe.title }}</h3>
                    <button 
                      (click)="removeFromFavorites(recipe)"
                      class="text-error hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                      title="Quitar de favoritos"
                    >
                      <lucide-icon [img]="HeartIcon" class="w-5 h-5 fill-current"></lucide-icon>
                    </button>
                  </div>

                  <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
                    {{ recipe.description || 'Sin descripción' }}
                  </p>

                  <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-1">
                      <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500 fill-current"></lucide-icon>
                      <span class="font-semibold text-base">{{ recipe.avgRating.toFixed(1) }}</span>
                      <span class="text-slate-gray text-xs">({{ recipe.ratingCount }})</span>
                    </div>
                    @if (recipe.mealTypeId) {
                      <span class="bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium">
                        {{ getMealTypeName(recipe.mealTypeId) }}
                      </span>
                    }
                  </div>

                  @if (recipe.allergens && recipe.allergens.length > 0) {
                    <div class="mb-3 flex gap-1 flex-wrap">
                      @for (allergen of recipe.allergens.slice(0, 2); track allergen.id) {
                        <span class="inline-flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded text-xs font-medium">
                          <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                          {{ allergen.name }}
                        </span>
                      }
                      @if (recipe.allergens.length > 2) {
                        <span class="text-slate-gray text-xs px-2 py-1">
                          +{{ recipe.allergens.length - 2 }} más
                        </span>
                      }
                    </div>
                  }

                  <div class="flex gap-2 pt-3 border-t border-gray-100">
                    <a 
                      [routerLink]="['/recipes', recipe.id]" 
                      class="flex-1 btn-primary text-center text-sm"
                    >
                      Ver Receta
                    </a>
                    <button 
                      (click)="addToPlanner(recipe)"
                      class="btn-secondary px-3 inline-flex items-center justify-center"
                      title="Añadir al planner"
                    >
                      <lucide-icon [img]="CalendarIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @if (!isLoading && savedRecipes.length === 0 && !errorMessage) {
          <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
            <lucide-icon [img]="HeartIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
            <h3 class="mb-3 text-xl">Aún no tienes recetas guardadas</h3>
            <p class="text-slate-gray mb-6 text-base">
              Explora recetas y guarda tus favoritas haciendo clic en el corazón
            </p>
            <a routerLink="/recipes" class="btn-primary inline-flex items-center gap-2 text-sm">
              <lucide-icon [img]="SearchIcon" class="w-4 h-4"></lucide-icon>
              Explorar Recetas
            </a>
          </div>
        }
      </div>
    </div>

    <!-- Modal de confirmación -->
    @if (recipeToRemove) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <h3 class="mb-3 text-xl">¿Quitar de favoritos?</h3>
          <p class="text-slate-gray mb-6 text-base">
            ¿Estás seguro de que quieres quitar "<strong>{{ recipeToRemove.title }}</strong>" de tus recetas guardadas?
          </p>
          <div class="flex gap-3">
            <button (click)="recipeToRemove = null" class="flex-1 btn-secondary text-sm">
              Cancelar
            </button>
            <button (click)="confirmRemove()" class="flex-1 bg-error hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm">
              Quitar
            </button>
          </div>
        </div>
      </div>
    }
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
  recipeToRemove: Recipe | null = null;

  // Iconos
  readonly HeartIcon = Heart;
  readonly TrashIcon = Trash2;
  readonly CalendarIcon = Calendar;
  readonly StarIcon = Star;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;
  readonly SearchIcon = Search;

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

    this.favoriteService.getAllFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        
        if (this.favorites.length === 0) {
          this.isLoading = false;
          return;
        }

        const recipeIds = this.favorites.map(f => f.recipeId);
        
        this.recipeService.getAllRecipes().subscribe({
          next: (recipes) => {
            this.savedRecipes = recipes.filter(r => recipeIds.includes(r.id));
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
    this.recipeToRemove = recipe;
  }

  confirmRemove(): void {
    if (!this.recipeToRemove) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.favoriteService.removeFavorite(currentUser.id, this.recipeToRemove.id).subscribe({
      next: () => {
        this.savedRecipes = this.savedRecipes.filter(r => r.id !== this.recipeToRemove?.id);
        this.favorites = this.favorites.filter(f => f.recipeId !== this.recipeToRemove?.id);
        this.recipeToRemove = null;
      },
      error: (error) => {
        console.error('Error quitando favorito:', error);
        this.errorMessage = 'Error al quitar de favoritos. Inténtalo de nuevo.';
        this.recipeToRemove = null;
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
    alert('Función de añadir al planner en desarrollo');
  }
}