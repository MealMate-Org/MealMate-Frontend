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
import { 
  LucideAngularModule,
  Heart,
  Edit,
  Star,
  ChefHat,
  Clock,
  Users,
  Calendar,
  ShoppingCart,
  Share2,
  AlertTriangle,
  Flame,
  Beef,
  Wheat,
  Droplet
} from 'lucide-angular';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    @if (isLoading) {
      <div class="max-w-6xl mx-auto px-4 py-20 text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-cambridge-blue mb-4"></div>
        <p class="text-slate-gray text-lg">Cargando receta...</p>
      </div>
    }

    @if (!isLoading && recipe) {
      <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Header -->
          <div class="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h1 class="mb-4 text-4xl">{{ recipe.title }}</h1>
                @if (recipe.description) {
                  <p class="text-slate-gray text-xl leading-relaxed">{{ recipe.description }}</p>
                }
              </div>
              <div class="flex gap-3 ml-6">
                @if (currentUser && recipe.authorId === currentUser.id) {
                  <a 
                    [routerLink]="['/recipes/edit', recipe.id]" 
                    class="btn-secondary inline-flex items-center gap-2"
                  >
                    <lucide-icon [img]="EditIcon" class="w-5 h-5"></lucide-icon>
                    Editar
                  </a>
                }
                @if (currentUser) {
                  <button 
                    (click)="toggleFavorite()"
                    [class]="isFavorite ? 'btn-primary' : 'btn-secondary'"
                    class="inline-flex items-center gap-2"
                  >
                    <lucide-icon [img]="HeartIcon" [class]="isFavorite ? 'fill-current' : ''" class="w-5 h-5"></lucide-icon>
                    {{ isFavorite ? 'Guardada' : 'Guardar' }}
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Columna Principal -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Imagen -->
              @if (recipe.imagePath) {
                <div class="bg-white rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    [src]="recipe.imagePath" 
                    [alt]="recipe.title"
                    class="w-full h-96 object-cover"
                  >
                </div>
              } @else {
                <div class="bg-gradient-to-br from-celadon to-cambridge-blue rounded-3xl h-96 flex items-center justify-center">
                  <lucide-icon [img]="ChefHatIcon" class="w-32 h-32 text-white opacity-50"></lucide-icon>
                </div>
              }

              <!-- Meta info -->
              <div class="bg-white rounded-3xl shadow-xl p-8">
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                  @if (recipe.mealTypeId) {
                    <div class="text-center">
                      <div class="inline-flex items-center justify-center w-14 h-14 bg-cambridge-blue bg-opacity-10 rounded-2xl mb-3">
                        <lucide-icon [img]="ClockIcon" class="w-7 h-7 text-cambridge-blue"></lucide-icon>
                      </div>
                      <p class="text-sm text-slate-gray">Tipo</p>
                      <p class="font-bold text-lg">{{ getMealTypeName(recipe.mealTypeId) }}</p>
                    </div>
                  }
                  <div class="text-center">
                    <div class="inline-flex items-center justify-center w-14 h-14 bg-zomp bg-opacity-10 rounded-2xl mb-3">
                      <lucide-icon [img]="UsersIcon" class="w-7 h-7 text-zomp"></lucide-icon>
                    </div>
                    <p class="text-sm text-slate-gray">Autor</p>
                    @if (author) {
                      <a 
                        [routerLink]="['/user', author.username]"
                        class="font-bold text-lg text-cambridge-blue hover:text-zomp transition"
                      >
                        {{ author.username }}
                      </a>
                    } @else {
                      <p class="font-bold text-lg">Usuario {{ recipe.authorId }}</p>
                    }
                  </div>
                  <div class="text-center">
                    <div class="inline-flex items-center justify-center w-14 h-14 bg-dark-purple bg-opacity-10 rounded-2xl mb-3">
                      <lucide-icon [img]="CalendarIcon" class="w-7 h-7 text-dark-purple"></lucide-icon>
                    </div>
                    <p class="text-sm text-slate-gray">Creada</p>
                    <p class="font-bold text-lg">{{ recipe.createdAt | date:'dd/MM/yy' }}</p>
                  </div>
                </div>

                <!-- Valoración -->
                <div class="pt-8 border-t border-gray-100">
                  <h4 class="mb-4 text-lg font-semibold">Valorar esta receta</h4>
                  <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                      @for (star of [1,2,3,4,5]; track star) {
                        <button 
                          (click)="setRating(star)"
                          [class]="star <= (userRating || 0) ? 'text-yellow-500' : 'text-gray-300'"
                          class="hover:text-yellow-500 transition text-3xl"
                          [disabled]="!currentUser"
                        >
                          <lucide-icon [img]="StarIcon" [class]="star <= (userRating || 0) ? 'fill-current' : ''" class="w-8 h-8"></lucide-icon>
                        </button>
                      }
                    </div>
                    <div>
                      <p class="text-lg">
                        <span class="font-bold text-2xl">{{ recipe.avgRating.toFixed(1) }}</span>
                        <span class="text-slate-gray"> / 5</span>
                      </p>
                      <p class="text-sm text-slate-gray">{{ recipe.ratingCount }} valoraciones</p>
                    </div>
                  </div>
                  @if (userRating) {
                    <p class="text-sm text-slate-gray mt-3">Tu valoración: {{ userRating }}/5</p>
                  }
                </div>
              </div>

              <!-- Alérgenos -->
              @if (recipe.allergens && recipe.allergens.length > 0) {
                <div class="bg-red-50 border-2 border-error rounded-3xl p-8">
                  <div class="flex items-center gap-3 mb-4">
                    <lucide-icon [img]="AlertIcon" class="w-8 h-8 text-error"></lucide-icon>
                    <h3 class="text-error text-xl font-bold">Contiene Alérgenos</h3>
                  </div>
                  <div class="flex gap-3 flex-wrap">
                    @for (allergen of recipe.allergens; track allergen.id) {
                      <span class="inline-flex items-center gap-2 bg-white text-error px-4 py-2 rounded-xl font-semibold border-2 border-error">
                        <lucide-icon [img]="AlertIcon" class="w-4 h-4"></lucide-icon>
                        {{ allergen.name }}
                      </span>
                    }
                  </div>
                </div>
              }

              <!-- Ingredientes -->
              <div class="bg-white rounded-3xl shadow-xl p-8">
                <h3 class="mb-6 text-2xl">Ingredientes</h3>
                <ul class="space-y-3">
                  @for (ingredient of recipe.ingredients; track ingredient.name) {
                    <li class="flex items-center gap-3 p-3 hover:bg-celadon rounded-xl transition">
                      <div class="w-2 h-2 bg-cambridge-blue rounded-full"></div>
                      <span class="text-lg">
                        <strong class="text-cambridge-blue">{{ ingredient.quantity }}</strong> 
                        {{ ingredient.unit }} de 
                        <strong>{{ ingredient.name }}</strong>
                      </span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Instrucciones -->
              <div class="bg-white rounded-3xl shadow-xl p-8">
                <h3 class="mb-6 text-2xl">Instrucciones</h3>
                <div class="prose max-w-none">
                  <pre class="whitespace-pre-wrap font-sans text-lg text-slate-gray leading-relaxed">{{ recipe.instructions }}</pre>
                </div>
              </div>
            </div>

            <!-- Columna Lateral -->
            <div class="space-y-8">
              <!-- Información Nutricional -->
              @if (nutritionInfo) {
                <div class="bg-white rounded-3xl shadow-xl p-8">
                  <h3 class="mb-4 text-xl">Información Nutricional</h3>
                  <p class="text-sm text-slate-gray mb-6">
                    Por porción ({{ nutritionInfo.portionSize }}g)
                  </p>
                  
                  <div class="space-y-4">
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-cambridge-blue to-zomp rounded-2xl text-white">
                      <div class="flex items-center gap-3">
                        <lucide-icon [img]="FlameIcon" class="w-6 h-6"></lucide-icon>
                        <span class="font-semibold">Calorías</span>
                      </div>
                      <span class="text-2xl font-bold">{{ nutritionInfo.calories }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center p-4 bg-celadon rounded-2xl">
                      <div class="flex items-center gap-3">
                        <lucide-icon [img]="BeefIcon" class="w-6 h-6 text-dark-purple"></lucide-icon>
                        <span class="font-semibold">Proteína</span>
                      </div>
                      <span class="text-xl font-bold">{{ nutritionInfo.protein }}g</span>
                    </div>
                    
                    <div class="flex justify-between items-center p-4 bg-celadon rounded-2xl">
                      <div class="flex items-center gap-3">
                        <lucide-icon [img]="WheatIcon" class="w-6 h-6 text-dark-purple"></lucide-icon>
                        <span class="font-semibold">Carbohidratos</span>
                      </div>
                      <span class="text-xl font-bold">{{ nutritionInfo.carbs }}g</span>
                    </div>
                    
                    <div class="flex justify-between items-center p-4 bg-celadon rounded-2xl">
                      <div class="flex items-center gap-3">
                        <lucide-icon [img]="DropletIcon" class="w-6 h-6 text-dark-purple"></lucide-icon>
                        <span class="font-semibold">Grasas</span>
                      </div>
                      <span class="text-xl font-bold">{{ nutritionInfo.fat }}g</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Autor -->
              @if (author) {
                <div class="bg-white rounded-3xl shadow-xl p-8">
                  <h4 class="mb-4 text-lg font-semibold">Sobre el autor</h4>
                  <a [routerLink]="['/user', author.username]" class="flex items-center gap-4 hover:bg-celadon p-4 rounded-2xl transition">
                    <img 
                      [src]="author.avatar || '/defaultProfilePicture.png'" 
                      [alt]="author.username"
                      class="w-16 h-16 rounded-full object-cover border-2 border-cambridge-blue"
                    >
                    <div>
                      <p class="font-bold text-lg text-cambridge-blue">{{ author.username }}</p>
                      @if (author.bio) {
                        <p class="text-sm text-slate-gray line-clamp-2">{{ author.bio }}</p>
                      }
                    </div>
                  </a>
                </div>
              }

              <!-- Acciones rápidas -->
              @if (currentUser) {
                <div class="bg-white rounded-3xl shadow-xl p-8">
                  <h4 class="mb-4 text-lg font-semibold">Acciones</h4>
                  <div class="space-y-3">
                    <button 
                      (click)="addToPlanner()"
                      class="btn-secondary w-full text-base inline-flex items-center justify-center gap-2"
                    >
                      <lucide-icon [img]="CalendarIcon" class="w-5 h-5"></lucide-icon>
                      Añadir al Planner
                    </button>
                    <button 
                      (click)="addToShoppingList()"
                      class="btn-secondary w-full text-base inline-flex items-center justify-center gap-2"
                    >
                      <lucide-icon [img]="ShoppingCartIcon" class="w-5 h-5"></lucide-icon>
                      Añadir a Lista de Compra
                    </button>
                    <button 
                      (click)="shareRecipe()"
                      class="btn-secondary w-full text-base inline-flex items-center justify-center gap-2"
                    >
                      <lucide-icon [img]="ShareIcon" class="w-5 h-5"></lucide-icon>
                      Compartir Receta
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

    @if (!isLoading && !recipe) {
      <div class="max-w-6xl mx-auto px-4 py-20 text-center">
        <div class="bg-white rounded-3xl shadow-xl p-12">
          <lucide-icon [img]="ChefHatIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
          <h2 class="mb-4 text-3xl">Receta no encontrada</h2>
          <p class="text-slate-gray mb-8 text-lg">
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

  // Iconos
  readonly HeartIcon = Heart;
  readonly EditIcon = Edit;
  readonly StarIcon = Star;
  readonly ChefHatIcon = ChefHat;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly ShareIcon = Share2;
  readonly AlertIcon = AlertTriangle;
  readonly FlameIcon = Flame;
  readonly BeefIcon = Beef;
  readonly WheatIcon = Wheat;
  readonly DropletIcon = Droplet;

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
        alert('Enlace copiado al portapapeles');
      });
    }
  }
}