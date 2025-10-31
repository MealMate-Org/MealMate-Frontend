import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/user-actions.service';
import { RatingService } from '../../../core/services/user-actions.service';
import { Recipe, NutritionInfo } from '../../../models/recipe.model';
import { User } from '../../../models/user.model';
import { 
  LucideAngularModule,
  Heart,
  Star,
  Clock,
  Users,
  ChefHat,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-angular';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"></div>
            <p class="text-slate-gray text-base">Cargando receta...</p>
          </div>
        }

        @if (!isLoading && recipe) {
          <!-- Botón volver -->
          <div class="mb-6">
            <a 
              routerLink="/recipes" 
              class="inline-flex items-center gap-2 text-cambridge-blue hover:text-zomp transition-colors font-medium"
            >
              <lucide-icon [img]="ArrowLeftIcon" class="w-4 h-4"></lucide-icon>
              Volver a recetas
            </a>
          </div>

          <!-- Header de la receta -->
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <!-- Imagen -->
            <div class="relative h-96 overflow-hidden bg-gradient-to-br from-celadon to-cambridge-blue">
              @if (recipe.imagePath) {
                <img 
                  [src]="recipe.imagePath" 
                  [alt]="recipe.title"
                  class="w-full h-full object-cover"
                />
              } @else {
                <div class="w-full h-full flex items-center justify-center">
                  <img 
                    src="/MMLogo.png" 
                    alt="MealMate Logo"
                    class="w-48 h-48 object-contain opacity-80"
                  />
                </div>
              }
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              <!-- Título sobre la imagen -->
              <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 class="text-4xl font-bold mb-2 text-white drop-shadow-lg">{{ recipe.title }}</h1>
                @if (author) {
                  <div class="flex items-center gap-3 text-sm">
                    <a 
                      [routerLink]="['/user', author.username]"
                      class="flex items-center gap-2 hover:text-cambridge-blue transition-colors"
                    >
                      <img 
                        [src]="author.avatar || '/defaultProfilePicture.png'" 
                        [alt]="author.username"
                        class="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                      <span class="font-medium">{{ author.username }}</span>
                    </a>
                    <span class="text-white/70">•</span>
                    <span class="text-white/90">{{ recipe.createdAt | date: 'dd/MM/yyyy' }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Acciones y stats -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Stats -->
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="StarIcon" class="w-5 h-5 text-yellow-500"></lucide-icon>
                    <span class="font-bold text-lg">{{ recipe.avgRating.toFixed(1) }}</span>
                    <span class="text-slate-gray text-sm">({{ recipe.ratingCount }} valoraciones)</span>
                  </div>
                  @if (recipe.mealTypeId) {
                    <span class="bg-cambridge-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      {{ getMealTypeName(recipe.mealTypeId) }}
                    </span>
                  }
                </div>

                <!-- Acciones -->
                <div class="flex items-center gap-3">
                  @if (isOwner) {
                    <a 
                      [routerLink]="['/recipes/edit', recipe.id]"
                      class="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                      Editar
                    </a>
                    <button 
                      (click)="deleteRecipe()"
                      class="bg-error hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 text-sm"
                    >
                      <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                      Eliminar
                    </button>
                  } @else if (currentUser) {
                    <button 
                      (click)="toggleFavorite()"
                      [class]="isFavorite ? 'bg-error text-white' : 'bg-white text-error border-2 border-error'"
                      class="px-4 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 hover:shadow-lg text-sm"
                    >
                      <lucide-icon [img]="HeartIcon" [class.fill-current]="isFavorite" class="w-4 h-4"></lucide-icon>
                      {{ isFavorite ? 'Guardada' : 'Guardar' }}
                    </button>
                    <button 
                      (click)="addToPlanner()"
                      class="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <lucide-icon [img]="CalendarIcon" class="w-4 h-4"></lucide-icon>
                      Añadir al planner
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Columna principal -->
            <div class="md:col-span-2 space-y-8">
              <!-- Descripción -->
              @if (recipe.description) {
                <div class="bg-white rounded-2xl shadow-lg p-6">
                  <h3 class="text-xl font-bold mb-3 text-dark-purple">Descripción</h3>
                  <p class="text-slate-gray leading-relaxed">{{ recipe.description }}</p>
                </div>
              }

              <!-- Ingredientes -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h3 class="text-xl font-bold mb-4 text-dark-purple">Ingredientes</h3>
                <div class="space-y-2">
                  @for (ingredient of recipe.ingredients; track $index) {
                    <div class="flex items-center gap-3 p-3 bg-celadon rounded-lg">
                      <div class="w-2 h-2 bg-cambridge-blue rounded-full"></div>
                      <span class="font-medium">{{ ingredient.name }}</span>
                      <span class="text-slate-gray ml-auto">{{ ingredient.quantity }} {{ ingredient.unit }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Instrucciones -->
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h3 class="text-xl font-bold mb-4 text-dark-purple">Instrucciones</h3>
                <div class="prose prose-slate max-w-none">
                  <p class="text-slate-gray leading-relaxed whitespace-pre-line">{{ recipe.instructions }}</p>
                </div>
              </div>
            </div>

            <!-- Columna lateral -->
            <div class="space-y-6">
              <!-- Información nutricional -->
              @if (nutritionInfo && (nutritionInfo.calories || nutritionInfo.protein || nutritionInfo.carbs || nutritionInfo.fat)) {
                <div class="bg-white rounded-2xl shadow-lg p-6">
                  <h3 class="text-lg font-bold mb-4 text-dark-purple flex items-center gap-2">
                    <lucide-icon [img]="ChefHatIcon" class="w-5 h-5 text-success"></lucide-icon>
                    Información Nutricional
                  </h3>
                  @if (nutritionInfo.portionSize) {
                    <p class="text-sm text-slate-gray mb-4">Por porción de {{ nutritionInfo.portionSize }}g</p>
                  }
                  <div class="space-y-3">
                    @if (nutritionInfo.calories) {
                      <div class="flex justify-between items-center p-3 bg-celadon rounded-lg">
                        <span class="font-medium">Calorías</span>
                        <span class="font-bold text-dark-purple">{{ nutritionInfo.calories }} kcal</span>
                      </div>
                    }
                    @if (nutritionInfo.protein) {
                      <div class="flex justify-between items-center p-3 bg-celadon rounded-lg">
                        <span class="font-medium">Proteína</span>
                        <span class="font-bold text-dark-purple">{{ nutritionInfo.protein }}g</span>
                      </div>
                    }
                    @if (nutritionInfo.carbs) {
                      <div class="flex justify-between items-center p-3 bg-celadon rounded-lg">
                        <span class="font-medium">Carbohidratos</span>
                        <span class="font-bold text-dark-purple">{{ nutritionInfo.carbs }}g</span>
                      </div>
                    }
                    @if (nutritionInfo.fat) {
                      <div class="flex justify-between items-center p-3 bg-celadon rounded-lg">
                        <span class="font-medium">Grasas</span>
                        <span class="font-bold text-dark-purple">{{ nutritionInfo.fat }}g</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Alérgenos -->
              @if (recipe.allergens && recipe.allergens.length > 0) {
                <div class="bg-white rounded-2xl shadow-lg p-6">
                  <h3 class="text-lg font-bold mb-4 text-dark-purple flex items-center gap-2">
                    <lucide-icon [img]="AlertIcon" class="w-5 h-5 text-error"></lucide-icon>
                    Alérgenos
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    @for (allergen of recipe.allergens; track allergen.id) {
                      <span class="bg-red-50 text-error px-3 py-2 rounded-lg text-sm font-medium border border-error">
                        {{ allergen.name }}
                      </span>
                    }
                  </div>
                </div>
              }

              <!-- Valorar receta -->
              @if (currentUser && !isOwner) {
                <div class="bg-white rounded-2xl shadow-lg p-6">
                  <h3 class="text-lg font-bold mb-4 text-dark-purple">Valorar receta</h3>
                  <div class="flex gap-2 justify-center mb-4">
                    @for (star of [1, 2, 3, 4, 5]; track star) {
                      <button 
                        (click)="rateRecipe(star)"
                        class="transition-all hover:scale-110"
                      >
                        <lucide-icon 
                          [img]="StarIcon" 
                          [class.fill-current]="star <= (userRating || 0)"
                          [class.text-yellow-500]="star <= (userRating || 0)"
                          [class.text-gray-300]="star > (userRating || 0)"
                          class="w-8 h-8"
                        ></lucide-icon>
                      </button>
                    }
                  </div>
                  @if (userRating) {
                    <p class="text-center text-sm text-slate-gray">
                      Tu valoración: {{ userRating }} estrellas
                    </p>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (!isLoading && !recipe) {
          <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
            <lucide-icon [img]="AlertIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
            <h3 class="text-2xl font-bold mb-3">Receta no encontrada</h3>
            <p class="text-slate-gray mb-6 text-lg">
              No pudimos encontrar esta receta. Puede que haya sido eliminada.
            </p>
            <a routerLink="/recipes" class="btn-primary text-base">
              Volver a recetas
            </a>
          </div>
        }
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    @if (showDeleteModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
          <h3 class="mb-3 text-xl">¿Eliminar receta?</h3>
          <p class="text-slate-gray mb-6 text-base">
            ¿Estás seguro de que quieres eliminar "<strong>{{ recipe?.title }}</strong>"? Esta acción no se puede deshacer.
          </p>
          <div class="flex gap-3">
            <button (click)="showDeleteModal = false" class="flex-1 btn-secondary text-sm">
              Cancelar
            </button>
            <button (click)="confirmDelete()" class="flex-1 bg-error hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  author: User | null = null;
  nutritionInfo: NutritionInfo | null = null;
  currentUser: User | null = null;
  
  isLoading = true;
  isOwner = false;
  isFavorite = false;
  userRating: number | null = null;
  showDeleteModal = false;

  readonly HeartIcon = Heart;
  readonly StarIcon = Star;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;
  readonly CalendarIcon = Calendar;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash2;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private userService: UserService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private ratingService: RatingService
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
        this.isOwner = this.currentUser?.id === recipe.authorId;
        
        // Cargar autor
        this.loadAuthor(recipe.authorId);
        
        // Cargar información nutricional
        this.loadNutritionInfo(id);
        
        // Verificar si es favorito
        if (this.currentUser) {
          this.checkIfFavorite(id);
          this.loadUserRating(id);
        }
        
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
      error: (error) => console.error('Error cargando autor:', error)
    });
  }

  loadNutritionInfo(recipeId: number): void {
    this.recipeService.getNutritionInfo(recipeId).subscribe({
      next: (info) => {
        this.nutritionInfo = info;
      },
      error: () => {
        // No hay información nutricional
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
        // No hay valoración
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
        error: (error) => console.error('Error quitando favorito:', error)
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
        error: (error) => console.error('Error añadiendo favorito:', error)
      });
    }
  }

  rateRecipe(score: number): void {
    if (!this.currentUser || !this.recipe) return;

    const rating = {
      recipeId: this.recipe.id,
      userId: this.currentUser.id,
      score: score
    };

    this.ratingService.rateRecipe(rating).subscribe({
      next: () => {
        this.userRating = score;
        // Recargar receta para actualizar avgRating
        this.loadRecipe(this.recipe!.id);
      },
      error: (error) => console.error('Error valorando receta:', error)
    });
  }

  addToPlanner(): void {
    // TODO: Implementar añadir al planner
    alert('Función de añadir al planner en desarrollo');
  }

  deleteRecipe(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.recipe) return;

    this.recipeService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        window.location.href = '/recipes/my';
      },
      error: (error) => {
        console.error('Error eliminando receta:', error);
        alert('Error al eliminar la receta');
      }
    });
  }

  getMealTypeName(id: number): string {
    const types: {[key: number]: string} = {
      1: 'Desayuno',
      2: 'Comida',
      3: 'Cena',
      4: 'Aperitivo'
    };
    return types[id] || 'Otro';
  }
}