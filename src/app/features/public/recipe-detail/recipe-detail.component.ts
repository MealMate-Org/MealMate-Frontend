import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { FavoriteService, RatingService } from '../../../core/services/user-actions.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, NutritionInfo } from '../../../models/recipe.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    @if (isLoading) {
      <div class="max-w-6xl mx-auto px-4 py-12 text-center">
        <p class="text-slate-gray">Cargando receta...</p>
      </div>
    }

    @if (!isLoading && recipe) {
      <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="mb-2">{{ recipe.title }}</h1>
              @if (recipe.description) {
                <p class="text-slate-gray text-lg">{{ recipe.description }}</p>
              }
            </div>
            <div class="flex gap-2">
              @if (currentUser && recipe.authorId === currentUser.id) {
                <a [routerLink]="['/recipes/edit', recipe.id]" class="btn-secondary">
                  ✏️ Editar
                </a>
              }
              @if (currentUser) {
                <button 
                  (click)="toggleFavorite()"
                  [class]="isFavorite ? 'btn-accent' : 'btn-secondary'"
                >
                  {{ isFavorite ? '❤️ Guardada' : '🤍 Guardar' }}
                </button>
              }
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Columna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Imagen -->
            @if (recipe.imagePath) {
              <div class="card p-0 overflow-hidden">
                <img 
                  [src]="recipe.imagePath" 
                  [alt]="recipe.title"
                  class="w-full h-96 object-cover"
                >
              </div>
            } @else {
              <div class="card h-96 flex items-center justify-center bg-celadon">
                <span class="text-9xl">🍽️</span>
              </div>
            }

            <!-- Información básica -->
            <div class="card">
              <div class="flex gap-4 mb-4 flex-wrap">
                @if (recipe.mealTypeId) {
                  <div>
                    <span class="text-sm text-slate-gray">Tipo</span>
                    <p class="font-medium">{{ getMealTypeName(recipe.mealTypeId) }}</p>
                  </div>
                }
                <div>
                  <span class="text-sm text-slate-gray">Autor</span>
                  @if (author) {
                    <a 
                      [routerLink]="['/user', author.username]"
                      class="font-medium text-cambridge-blue hover:text-zomp transition"
                    >
                      {{ author.username }}
                    </a>
                  } @else {
                    <p class="font-medium">Usuario {{ recipe.authorId }}</p>
                  }
                </div>
                <div>
                  <span class="text-sm text-slate-gray">Visibilidad</span>
                  <p class="font-medium">{{ recipe.isPublic ? '🌍 Pública' : '🔒 Privada' }}</p>
                </div>
              </div>

              <!-- Valoración -->
              <div class="flex items-center gap-4 pt-4 border-t border-celadon">
                <div class="flex items-center gap-2">
                  @for (star of [1,2,3,4,5]; track star) {
                    <button 
                      (click)="setRating(star)"
                      [class]="star <= (userRating || 0) ? 'text-yellow-500' : 'text-slate-gray'"
                      class="text-2xl hover:text-yellow-500 transition"
                      [disabled]="!currentUser"
                    >
                      ⭐
                    </button>
                  }
                </div>
                <div>
                  <p class="text-sm">
                    <span class="font-bold">{{ recipe.avgRating.toFixed(1) }}</span>
                    <span class="text-slate-gray"> ({{ recipe.ratingCount }} valoraciones)</span>
                  </p>
                  @if (userRating) {
                    <p class="text-xs text-slate-gray">Tu valoración: {{ userRating }}/5</p>
                  }
                </div>
              </div>
            </div>

            <!-- Alérgenos -->
            @if (recipe.allergens && recipe.allergens.length > 0) {
              <div class="card bg-red-50">
                <h3 class="mb-3">⚠️ Contiene Alérgenos</h3>
                <div class="flex gap-2 flex-wrap">
                  @for (allergen of recipe.allergens; track allergen.id) {
                    <span class="badge-error">
                      {{ allergen.name }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Ingredientes -->
            <div class="card">
              <h3 class="mb-4">Ingredientes</h3>
              <ul class="space-y-2">
                @for (ingredient of recipe.ingredients; track ingredient.name) {
                  <li class="flex items-center gap-2">
                    <span class="text-cambridge-blue">✓</span>
                    <span>
                      <strong>{{ ingredient.quantity }}</strong> 
                      {{ ingredient.unit }} de 
                      {{ ingredient.name }}
                    </span>
                  </li>
                }
              </ul>
            </div>

            <!-- Instrucciones -->
            <div class="card">
              <h3 class="mb-4">Instrucciones</h3>
              <div class="prose max-w-none">
                <pre class="whitespace-pre-wrap font-sans text-body">{{ recipe.instructions }}</pre>
              </div>
            </div>
          </div>

          <!-- Columna Lateral -->
          <div class="space-y-6">
            <!-- Información Nutricional -->
            @if (nutritionInfo) {
              <div class="card">
                <h3 class="mb-4">Información Nutricional</h3>
                <p class="text-sm text-slate-gray mb-4">
                  Por porción ({{ nutritionInfo.portionSize }}g)
                </p>
                
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-3 bg-celadon rounded">
                    <span class="font-medium">Calorías</span>
                    <span class="text-lg font-bold text-dark-purple">
                      {{ nutritionInfo.calories }} kcal
                    </span>
                  </div>
                  
                  <div class="flex justify-between items-center p-2">
                    <span>Proteína</span>
                    <span class="font-bold">{{ nutritionInfo.protein }}g</span>
                  </div>
                  
                  <div class="flex justify-between items-center p-2">
                    <span>Carbohidratos</span>
                    <span class="font-bold">{{ nutritionInfo.carbs }}g</span>
                  </div>
                  
                  <div class="flex justify-between items-center p-2">
                    <span>Grasas</span>
                    <span class="font-bold">{{ nutritionInfo.fat }}g</span>
                  </div>
                </div>
              </div>
            }

            <!-- Autor -->
            @if (author) {
              <div class="card">
                <h4 class="mb-3">Sobre el autor</h4>
                <a [routerLink]="['/user', author.username]" class="flex items-center gap-3 hover:bg-celadon p-3 rounded transition">
                  <img 
                    [src]="author.avatar || 'https://via.placeholder.com/60?text=' + author.username[0].toUpperCase()" 
                    [alt]="author.username"
                    class="w-12 h-12 rounded-full object-cover"
                  >
                  <div>
                    <p class="font-medium text-cambridge-blue">{{ author.username }}</p>
                    @if (author.bio) {
                      <p class="text-sm text-slate-gray line-clamp-2">{{ author.bio }}</p>
                    }
                  </div>
                </a>
              </div>
            }

            <!-- Acciones rápidas -->
            @if (currentUser) {
              <div class="card">
                <h4 class="mb-3">Acciones</h4>
                <div class="space-y-2">
                  <button 
                    (click)="addToPlanner()"
                    class="btn-secondary w-full text-sm"
                  >
                    📅 Añadir al Planner
                  </button>
                  <button 
                    (click)="addToShoppingList()"
                    class="btn-secondary w-full text-sm"
                  >
                    🛒 Añadir a Lista de Compra
                  </button>
                  <button 
                    (click)="shareRecipe()"
                    class="btn-secondary w-full text-sm"
                  >
                    📤 Compartir Receta
                  </button>
                </div>
              </div>
            }

            <!-- Info adicional -->
            <div class="card text-sm">
              <p class="text-slate-gray">
                <strong>Creada:</strong> {{ recipe.createdAt | date:'dd/MM/yyyy' }}
              </p>
              @if (recipe.updatedAt) {
                <p class="text-slate-gray mt-1">
                  <strong>Actualizada:</strong> {{ recipe.updatedAt | date:'dd/MM/yyyy' }}
                </p>
              }
            </div>
          </div>
        </div>
      </div>
    }

    @if (!isLoading && !recipe) {
      <div class="max-w-6xl mx-auto px-4 py-12 text-center">
        <div class="card">
          <h2 class="mb-4">Receta no encontrada</h2>
          <p class="text-slate-gray mb-6">
            Lo sentimos, no pudimos encontrar esta receta.
          </p>
          <a routerLink="/recipes" class="btn-primary">
            Ver Todas las Recetas
          </a>
        </div>
      </div>
    }
  `,
  styles: [`
    .prose pre {
      background-color: transparent;
      padding: 0;
      margin: 0;
      border: none;
      color: inherit;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  author: User | null = null;
  nutritionInfo: NutritionInfo | null = null;
  isLoading = true;
  isFavorite = false;
  userRating: number | null = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadRecipe(id);
      }
    });
  }

  loadRecipe(id: number): void {
    this.isLoading = true;
    
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loadAuthor(recipe.authorId);
        this.loadNutritionInfo(id);
        this.checkIfFavorite(id);
        this.loadUserRating(id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando receta:', error);
        this.isLoading = false;
      }
    });
  }

  loadAuthor(authorId: number): void {
    this.userService.getUserById(authorId).subscribe({
      next: (user) => {
        this.author = user;
      },
      error: (error) => {
        console.error('Error cargando autor:', error);
      }
    });
  }

  loadNutritionInfo(recipeId: number): void {
    this.recipeService.getNutritionInfo(recipeId).subscribe({
      next: (nutrition) => {
        this.nutritionInfo = nutrition;
      },
      error: () => {
        // No hay info nutricional
      }
    });
  }

  checkIfFavorite(recipeId: number): void {
    if (!this.currentUser) return;

    this.favoriteService.getFavoriteById(this.currentUser.id, recipeId).subscribe({
      next: () => {
        this.isFavorite = true;
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }

  loadUserRating(recipeId: number): void {
    if (!this.currentUser) return;

    this.ratingService.getRating(recipeId, this.currentUser.id).subscribe({
      next: (rating) => {
        this.userRating = rating.score;
      },
      error: () => {
        this.userRating = null;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.currentUser || !this.recipe) return;

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.currentUser.id, this.recipe.id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => {
          console.error('Error quitando favorito:', error);
        }
      });
    } else {
      const favorite = {
        userId: this.currentUser.id,
        recipeId: this.recipe.id,
        createdAt: new Date()
      };

      this.favoriteService.addFavorite(favorite).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => {
          console.error('Error añadiendo favorito:', error);
        }
      });
    }
  }

  setRating(rating: number): void {
    if (!this.currentUser || !this.recipe) return;

    const ratingData = {
      recipeId: this.recipe.id,
      userId: this.currentUser.id,
      score: rating
    };

    this.ratingService.rateRecipe(ratingData).subscribe({
      next: () => {
        this.userRating = rating;
        // Recargar receta para actualizar promedio
        if (this.recipe) {
          this.loadRecipe(this.recipe.id);
        }
      },
      error: (error) => {
        console.error('Error guardando valoración:', error);
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

  addToPlanner(): void {
    alert('Función de añadir al planner en desarrollo');
  }

  addToShoppingList(): void {
    alert('Función de añadir a lista de compra en desarrollo');
  }

  shareRecipe(): void {
    if (this.recipe) {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      });
    }
  }
}