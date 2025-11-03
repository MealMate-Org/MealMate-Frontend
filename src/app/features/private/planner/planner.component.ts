import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PlannerService } from '../../../core/services/planner.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { FavoriteService, ShoppingListService } from '../../../core/services/user-actions.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, NutritionInfo } from '../../../models/recipe.model';
import { User, UserPreference } from '../../../models/user.model';
import {
  MealPlan,
  MealPlanItem,
  MealPlanItemCreateDTO,
  MealType,
  ShoppingItem,
  ShoppingListCreateDTO,
} from '../../../models/planner.model';
import {
  LucideAngularModule,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  TrendingUp,
  Target,
  ShoppingCart,
  Info,
  Loader2,
  ChefHat
} from 'lucide-angular';
import { forkJoin } from 'rxjs';

interface DayPlan {
  date: Date;
  dayName: string;
  breakfast?: PlannedMeal;
  lunch?: PlannedMeal;
  dinner?: PlannedMeal;
  dailyTotals: MacroTotals;
}

interface PlannedMeal {
  recipe: Recipe;
  nutritionInfo?: NutritionInfo;
  itemId?: number;
}

interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent,FooterComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-3 sm:px-6">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
          >
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold text-dark-purple mb-2">Planificador Semanal</h1>
              <p class="text-slate-gray text-base sm:text-lg">Organiza tu menú y controla tus macros</p>
            </div>
            <button
              (click)="generateShoppingList()"
              class="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              [disabled]="!hasAnyMeals() || isGeneratingShoppingList"
            >
              @if (isGeneratingShoppingList) {
              <lucide-icon [img]="Loader2Icon" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin"></lucide-icon>
              Generando... } @else {
              <lucide-icon [img]="ShoppingCartIcon" class="w-4 h-4 sm:w-5 sm:h-5"></lucide-icon>
              <span class="hidden sm:inline">Generar Lista de Compra</span>
              <span class="sm:hidden">Lista Compra</span>
              }
            </button>
          </div>

          <!-- Selector de semana -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <div class="flex items-center justify-between gap-2 sm:gap-4">
              <button
                (click)="previousWeek()"
                class="btn-secondary px-3 py-2 sm:px-4 sm:py-2 inline-flex items-center gap-1 sm:gap-2 text-sm"
                [disabled]="isLoading"
              >
                <lucide-icon [img]="ChevronLeftIcon" class="w-4 h-4 sm:w-5 sm:h-5"></lucide-icon>
                <span class="hidden xs:inline">Anterior</span>
              </button>

              <div class="text-center flex-1 min-w-0">
                <div class="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <lucide-icon
                    [img]="CalendarIcon"
                    class="w-5 h-5 sm:w-6 sm:h-6 text-cambridge-blue"
                  ></lucide-icon>
                  <h3 class="text-lg sm:text-xl font-bold text-dark-purple truncate">
                    {{ getWeekRange() }}
                  </h3>
                </div>
                @if (isCurrentWeek()) {
                <span
                  class="inline-block bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium"
                >
                  Semana actual
                </span>
                } @else {
                <button
                  (click)="goToCurrentWeek()"
                  class="text-cambridge-blue hover:text-zomp font-medium text-xs sm:text-sm transition-colors"
                >
                  Ir a semana actual
                </button>
                }
              </div>

              <button
                (click)="nextWeek()"
                class="btn-secondary px-3 py-2 sm:px-4 sm:py-2 inline-flex items-center gap-1 sm:gap-2 text-sm"
                [disabled]="isLoading"
              >
                <span class="hidden xs:inline">Siguiente</span>
                <lucide-icon [img]="ChevronRightIcon" class="w-4 h-4 sm:w-5 sm:h-5"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        @if (isLoading) {
        <div class="text-center py-16">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-4"
          ></div>
          <p class="text-slate-gray text-lg">Cargando planner...</p>
        </div>
        } @if (!isLoading) {
        <!-- Grid de días -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
          @for (day of weekPlan; track day.date.toISOString()) {
          <div
            class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-200"
            [class.border-cambridge-blue]="isToday(day.date)"
            [class.border-gray-100]="!isToday(day.date)"
          >
            <!-- Header del día -->
            <div
              class="p-3 sm:p-4 text-center"
              [class.bg-cambridge-blue]="isToday(day.date)"
              [class.bg-gradient-to-r]="isToday(day.date)"
              [class.from-cambridge-blue]="isToday(day.date)"
              [class.to-zomp]="isToday(day.date)"
              [class.bg-celadon]="!isToday(day.date)"
            >
              <h4
                class="font-bold mb-1 text-sm sm:text-base"
                [class.text-white]="isToday(day.date)"
                [class.text-dark-purple]="!isToday(day.date)"
              >
                {{ day.dayName }}
              </h4>
              <p
                class="text-xs sm:text-sm"
                [class.text-white]="isToday(day.date)"
                [class.opacity-90]="isToday(day.date)"
                [class.text-slate-gray]="!isToday(day.date)"
              >
                {{ formatDate(day.date) }}
              </p>
              @if (isToday(day.date)) {
              <span
                class="inline-block mt-1 sm:mt-2 bg-white text-cambridge-blue px-1.5 py-0.5 rounded-full text-xs font-bold"
              >
                HOY
              </span>
              }
            </div>

            <!-- Comidas -->
            <div class="p-2 sm:p-3 space-y-2 sm:space-y-3">
              <!-- Desayuno -->
              <div>
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <span class="text-xs font-semibold text-slate-gray">
                    <span class="hidden sm:inline">🌅 Desayuno</span>
                    <span class="sm:hidden">🌅 D</span>
                  </span>
                  @if (!day.breakfast) {
                  <button
                    (click)="openRecipeSelector(day.date, 'breakfast')"
                    class="text-cambridge-blue hover:text-zomp transition-colors"
                  >
                    <lucide-icon [img]="PlusIcon" class="w-3 h-3 sm:w-4 sm:h-4"></lucide-icon>
                  </button>
                  }
                </div>
                @if (day.breakfast) {
                <div class="bg-celadon rounded-lg p-2 group relative">
                  <button
                    (click)="removeMeal(day.date, 'breakfast')"
                    class="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    [disabled]="isSaving"
                  >
                    <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
                  </button>
                  <p class="text-xs font-medium text-dark-purple line-clamp-2">
                    {{ day.breakfast.recipe.title }}
                  </p>
                  @if (day.breakfast.nutritionInfo?.calories) {
                  <p class="text-xs text-slate-gray mt-1">
                    {{ day.breakfast.nutritionInfo?.calories }} kcal
                  </p>
                  }
                </div>
                } @else {
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center text-xs text-slate-gray cursor-pointer hover:border-cambridge-blue hover:bg-celadon transition-all"
                  (click)="openRecipeSelector(day.date, 'breakfast')"
                >
                  Añadir receta
                </div>
                }
              </div>

              <!-- Comida -->
              <div>
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <span class="text-xs font-semibold text-slate-gray">
                    <span class="hidden sm:inline">☀️ Comida</span>
                    <span class="sm:hidden">☀️ C</span>
                  </span>
                  @if (!day.lunch) {
                  <button
                    (click)="openRecipeSelector(day.date, 'lunch')"
                    class="text-cambridge-blue hover:text-zomp transition-colors"
                  >
                    <lucide-icon [img]="PlusIcon" class="w-3 h-3 sm:w-4 sm:h-4"></lucide-icon>
                  </button>
                  }
                </div>
                @if (day.lunch) {
                <div class="bg-celadon rounded-lg p-2 group relative">
                  <button
                    (click)="removeMeal(day.date, 'lunch')"
                    class="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    [disabled]="isSaving"
                  >
                    <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
                  </button>
                  <p class="text-xs font-medium text-dark-purple line-clamp-2">
                    {{ day.lunch.recipe.title }}
                  </p>
                  @if (day.lunch.nutritionInfo?.calories) {
                  <p class="text-xs text-slate-gray mt-1">
                    {{ day.lunch.nutritionInfo?.calories }} kcal
                  </p>
                  }
                </div>
                } @else {
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center text-xs text-slate-gray cursor-pointer hover:border-cambridge-blue hover:bg-celadon transition-all"
                  (click)="openRecipeSelector(day.date, 'lunch')"
                >
                  Añadir receta
                </div>
                }
              </div>

              <!-- Cena -->
              <div>
                <div class="flex items-center justify-between mb-1 sm:mb-2">
                  <span class="text-xs font-semibold text-slate-gray">
                    <span class="hidden sm:inline">🌙 Cena</span>
                    <span class="sm:hidden">🌙 C</span>
                  </span>
                  @if (!day.dinner) {
                  <button
                    (click)="openRecipeSelector(day.date, 'dinner')"
                    class="text-cambridge-blue hover:text-zomp transition-colors"
                  >
                    <lucide-icon [img]="PlusIcon" class="w-3 h-3 sm:w-4 sm:h-4"></lucide-icon>
                  </button>
                  }
                </div>
                @if (day.dinner) {
                <div class="bg-celadon rounded-lg p-2 group relative">
                  <button
                    (click)="removeMeal(day.date, 'dinner')"
                    class="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    [disabled]="isSaving"
                  >
                    <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
                  </button>
                  <p class="text-xs font-medium text-dark-purple line-clamp-2">
                    {{ day.dinner.recipe.title }}
                  </p>
                  @if (day.dinner.nutritionInfo?.calories) {
                  <p class="text-xs text-slate-gray mt-1">
                    {{ day.dinner.nutritionInfo?.calories }} kcal
                  </p>
                  }
                </div>
                } @else {
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center text-xs text-slate-gray cursor-pointer hover:border-cambridge-blue hover:bg-celadon transition-all"
                  (click)="openRecipeSelector(day.date, 'dinner')"
                >
                  Añadir receta
                </div>
                }
              </div>

              <!-- Totales del día -->
              <div class="pt-2 sm:pt-3 border-t border-gray-200">
                <div class="text-xs space-y-1">
                  <div class="flex justify-between">
                    <span class="text-slate-gray">Total:</span>
                    <span class="font-bold text-dark-purple">
                      {{ day.dailyTotals.calories }} kcal
                    </span>
                  </div>
                  @if (userPreferences) {
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all"
                      [class.bg-success]="getDayProgress(day) <= 110"
                      [class.bg-yellow-500]="
                        getDayProgress(day) > 110 && getDayProgress(day) <= 130
                      "
                      [class.bg-error]="getDayProgress(day) > 130"
                      [style.width.%]="Math.min(getDayProgress(day), 100)"
                    ></div>
                  </div>
                  <p class="text-slate-gray text-center text-xs">
                    {{ getDayProgress(day).toFixed(0) }}% del objetivo
                  </p>
                  }
                </div>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Resumen semanal -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6">
          <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <lucide-icon [img]="TrendingUpIcon" class="w-6 h-6 sm:w-8 sm:h-8 text-cambridge-blue"></lucide-icon>
            <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-dark-purple">Resumen Nutricional de la Semana</h3>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            <div
              class="text-center p-3 sm:p-4 bg-gradient-to-br from-celadon to-cambridge-blue bg-opacity-10 rounded-xl sm:rounded-2xl"
            >
              <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-purple mb-1">
                {{ weeklyTotals.calories }}
              </div>
              <div class="text-xs sm:text-sm text-slate-gray">Calorías totales</div>
              @if (userPreferences) {
              <div class="text-xs text-dark-purple mt-1 sm:mt-2 font-medium">
                / {{ (getTargetCalories() * 7).toFixed(0) }} objetivo
              </div>
              }
            </div>

            <div
              class="text-center p-3 sm:p-4 bg-gradient-to-br from-celadon to-cambridge-blue bg-opacity-10 rounded-xl sm:rounded-2xl"
            >
              <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-purple mb-1">
                {{ weeklyTotals.protein.toFixed(1) }}g
              </div>
              <div class="text-xs sm:text-sm text-slate-gray">Proteína total</div>
              @if (userPreferences) {
              <div class="text-xs text-dark-purple mt-1 sm:mt-2 font-medium">
                / {{ (getTargetProtein() * 7).toFixed(0) }}g objetivo
              </div>
              }
            </div>

            <div
              class="text-center p-3 sm:p-4 bg-gradient-to-br from-celadon to-cambridge-blue bg-opacity-10 rounded-xl sm:rounded-2xl"
            >
              <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-purple mb-1">
                {{ weeklyTotals.carbs.toFixed(1) }}g
              </div>
              <div class="text-xs sm:text-sm text-slate-gray">Carbohidratos</div>
              @if (userPreferences) {
              <div class="text-xs text-dark-purple mt-1 sm:mt-2 font-medium">
                / {{ (getTargetCarbs() * 7).toFixed(0) }}g objetivo
              </div>
              }
            </div>

            <div
              class="text-center p-3 sm:p-4 bg-gradient-to-br from-celadon to-cambridge-blue bg-opacity-10 rounded-xl sm:rounded-2xl"
            >
              <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-purple mb-1">
                {{ weeklyTotals.fat.toFixed(1) }}g
              </div>
              <div class="text-xs sm:text-sm text-slate-gray">Grasas</div>
              @if (userPreferences) {
              <div class="text-xs text-dark-purple mt-1 sm:mt-2 font-medium">
                / {{ (getTargetFat() * 7).toFixed(0) }}g objetivo
              </div>
              }
            </div>
          </div>

          @if (!userPreferences) {
          <div class="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4">
            <div class="flex items-start gap-2 sm:gap-3">
              <lucide-icon
                [img]="InfoIcon"
                class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
              ></lucide-icon>
              <div>
                <p class="text-xs sm:text-sm text-blue-800 mb-2">
                  <strong>¿Quieres ver tu progreso?</strong> Configura tus objetivos nutricionales
                  en tu perfil.
                </p>
                <a
                  routerLink="/profile"
                  class="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm underline"
                >
                  Ir a Perfil →
                </a>
              </div>
            </div>
          </div>
          }
        </div>
        }
      </div>
    </div>
    <app-footer />


<!-- Modal de selección de recetas -->
@if (showRecipeSelector) {
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
  <div class="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    <div class="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl sm:text-2xl font-bold text-dark-purple">Seleccionar Receta</h3>
        <button
          (click)="closeRecipeSelector()"
          class="text-slate-gray hover:text-error transition-colors"
        >
          <lucide-icon [img]="XIcon" class="w-5 h-5 sm:w-6 sm:h-6"></lucide-icon>
        </button>
      </div>

      <!-- Filtros -->
      <div class="flex gap-2">
        <button
          (click)="recipesFilter = 'my'"
          [class]="
            recipesFilter === 'my'
              ? 'bg-cambridge-blue text-white'
              : 'bg-gray-100 text-slate-gray'
          "
          class="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm"
        >
          Mis Recetas ({{ myRecipes.length }})
        </button>
        <button
          (click)="recipesFilter = 'saved'"
          [class]="
            recipesFilter === 'saved'
              ? 'bg-cambridge-blue text-white'
              : 'bg-gray-100 text-slate-gray'
          "
          class="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm"
        >
          Guardadas ({{ savedRecipes.length }})
        </button>
      </div>
    </div>

    <div class="p-4 sm:p-6">
      @if (getFilteredRecipes().length > 0) {
      <div class="grid md:grid-cols-2 gap-3 sm:gap-4">
        @for (recipe of getFilteredRecipes(); track recipe.id) {
        <div
          (click)="selectRecipe(recipe)"
          class="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer hover:border-cambridge-blue hover:shadow-lg transition-all"
        >
          <div class="flex gap-2 sm:gap-3">
            @if (recipe.imagePath) {
            <img
              [src]="recipe.imagePath"
              [alt]="recipe.title"
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
            />
            } @else {
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
              <lucide-icon [img]="ChefHatIcon" class="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-50"></lucide-icon>
            </div>
            }

            <div class="flex-1">
              <h4 class="font-bold text-dark-purple mb-1 text-sm sm:text-base">{{ recipe.title }}</h4>
              <p class="text-xs sm:text-sm text-slate-gray line-clamp-2 mb-2">
                {{ recipe.description || 'Sin descripción' }}
              </p>
              <div class="flex items-center gap-2 sm:gap-3 text-xs text-slate-gray">
                @if (getRecipeNutrition(recipe.id)) {
                <span>{{ getRecipeNutrition(recipe.id)?.calories }} kcal</span>
                }
                <span class="flex items-center gap-1">
                  ⭐ {{ recipe.avgRating.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
      } @else {
      <div class="text-center py-8 sm:py-12">
        <p class="text-slate-gray text-base sm:text-lg mb-4">
          @if (recipesFilter === 'my') { No tienes recetas creadas todavía } @else { No tienes
          recetas guardadas todavía }
        </p>
        <a
          [routerLink]="recipesFilter === 'my' ? '/recipes/new' : '/recipes'"
          class="btn-primary inline-flex items-center gap-2 text-sm sm:text-base"
          (click)="closeRecipeSelector()"
        >
          @if (recipesFilter === 'my') {
          <lucide-icon [img]="PlusIcon" class="w-4 h-4 sm:w-5 sm:h-5"></lucide-icon>
          Crear Receta } @else { Explorar Recetas }
        </a>
      </div>
      }
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
      
      /* Estilos para breakpoints personalizados */
      @media (max-width: 475px) {
        .xs\\:inline {
          display: inline !important;
        }
      }
    `,
  ],
})
export class PlannerComponent implements OnInit {
  weekPlan: DayPlan[] = [];
  currentWeekStart: Date = new Date();
  weeklyTotals: MacroTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  userPreferences: UserPreference | null = null;

  currentMealPlan: MealPlan | null = null;
  mealTypes: MealType[] = [];

  myRecipes: Recipe[] = [];
  savedRecipes: Recipe[] = [];
  recipesNutrition: Map<number, NutritionInfo> = new Map();

  isLoading = true;
  isSaving = false;
  isGeneratingShoppingList = false;
  showRecipeSelector = false;
  selectedDate: Date | null = null;
  selectedMealType: 'breakfast' | 'lunch' | 'dinner' | null = null;
  recipesFilter: 'my' | 'saved' = 'my';

  currentUser: User | null = null;
  Math = Math;

  // Iconos
  readonly CalendarIcon = Calendar;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly PlusIcon = Plus;
  readonly XIcon = X;
  readonly TrendingUpIcon = TrendingUp;
  readonly TargetIcon = Target;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly InfoIcon = Info;
  readonly Loader2Icon = Loader2;
  readonly ChefHatIcon = ChefHat; // ← Agrega esto

  constructor(
    private plannerService: PlannerService,
    private recipeService: RecipeService,
    private favoriteService: FavoriteService,
    private userService: UserService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.goToCurrentWeek();
      this.loadUserPreferences();
      this.loadRecipes();
      this.loadMealTypes();
    }
  }

  getShortDayName(fullDayName: string): string {
    const dayMap: { [key: string]: string } = {
      'Lunes': 'Lun',
      'Martes': 'Mar', 
      'Miércoles': 'Mié',
      'Jueves': 'Jue',
      'Viernes': 'Vie',
      'Sábado': 'Sáb',
      'Domingo': 'Dom'
    };
    return dayMap[fullDayName] || fullDayName;
  }

  loadMealTypes(): void {
    this.plannerService.getAllMealTypes().subscribe({
      next: (types) => {
        this.mealTypes = types;
        console.log('Loaded meal types:', types);
      },
      error: (error) => {
        console.error('Error cargando tipos de comida:', error);
        // Usar valores por defecto según tu BD
        this.mealTypes = [
          { id: 1, name: 'Desayuno' },
          { id: 2, name: 'Comida' },
          { id: 3, name: 'Cena' },
        ];
      },
    });
  }

  goToCurrentWeek(): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() + diff);
    this.currentWeekStart.setHours(0, 0, 0, 0);
    this.loadWeekData();
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadWeekData();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.loadWeekData();
  }

  loadWeekData(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(this.currentWeekStart.getDate() + 6);

    // Obtener o crear meal plan para esta semana
    this.plannerService
      .getOrCreateMealPlanForWeek(
        this.currentUser.id,
        this.formatDateISO(this.currentWeekStart),
        this.formatDateISO(weekEnd)
      )
      .subscribe({
        next: (mealPlan) => {
          this.currentMealPlan = mealPlan;
          this.generateWeekPlan();
          this.loadMealPlanItems();
        },
        error: (error) => {
          console.error('Error cargando meal plan:', error);
          this.generateWeekPlan();
          this.isLoading = false;
        },
      });
  }

  loadMealPlanItems(): void {
    if (!this.currentMealPlan) return;

    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(this.currentWeekStart.getDate() + 6);

    this.plannerService
      .getItemsByMealPlanAndDateRange(
        this.currentMealPlan.id,
        this.formatDateISO(this.currentWeekStart),
        this.formatDateISO(weekEnd)
      )
      .subscribe({
        next: (items) => {
          // Cargar los detalles de cada item
          this.loadItemsDetails(items);
        },
        error: (error) => {
          console.error('Error cargando items:', error);
          this.isLoading = false;
        },
      });
  }

  loadItemsDetails(items: MealPlanItem[]): void {
    if (items.length === 0) {
      this.isLoading = false;
      return;
    }

    const recipeObservables = items.map((item) => this.recipeService.getRecipeById(item.recipeId));

    forkJoin(recipeObservables).subscribe({
      next: (recipes) => {
        items.forEach((item, index) => {
          const recipe = recipes[index];
          const itemDate = new Date(item.date);
          const day = this.weekPlan.find((d) => d.date.toDateString() === itemDate.toDateString());

          if (day) {
            const mealType = this.getMealTypeFromId(item.mealTypeId);
            const nutritionInfo = this.getRecipeNutrition(recipe.id);

            const plannedMeal: PlannedMeal = {
              recipe,
              nutritionInfo,
              itemId: item.id,
            };

            switch (mealType) {
              case 'breakfast':
                day.breakfast = plannedMeal;
                break;
              case 'lunch':
                day.lunch = plannedMeal;
                break;
              case 'dinner':
                day.dinner = plannedMeal;
                break;
            }

            this.calculateDayTotals(day);
          }
        });

        this.calculateWeeklyTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando detalles de recetas:', error);
        this.isLoading = false;
      },
    });
  }

  getMealTypeFromId(mealTypeId: number): 'breakfast' | 'lunch' | 'dinner' | null {
    // IDs según tu BD: 1=Desayuno, 2=Comida, 3=Cena
    switch (mealTypeId) {
      case 1:
        return 'breakfast';
      case 2:
        return 'lunch';
      case 3:
        return 'dinner';
      default:
        return null;
    }
  }

  getMealTypeId(mealType: 'breakfast' | 'lunch' | 'dinner'): number {
    // IDs según tu BD: 1=Desayuno, 2=Comida, 3=Cena
    switch (mealType) {
      case 'breakfast':
        return 1;
      case 'lunch':
        return 2;
      case 'dinner':
        return 3;
    }
  }

  isCurrentWeek(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diff);
    currentMonday.setHours(0, 0, 0, 0);

    return this.currentWeekStart.getTime() === currentMonday.getTime();
  }

  getWeekRange(): string {
    const endDate = new Date(this.currentWeekStart);
    endDate.setDate(this.currentWeekStart.getDate() + 6);

    const startMonth = this.currentWeekStart.toLocaleDateString('es-ES', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('es-ES', { month: 'long' });

    if (startMonth === endMonth) {
      return `${this.currentWeekStart.getDate()} - ${endDate.getDate()} de ${startMonth}`;
    } else {
      return `${this.currentWeekStart.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth}`;
    }
  }

  generateWeekPlan(): void {
    this.weekPlan = [];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      date.setHours(12, 0, 0, 0); // Establecer hora del medio día para evitar problemas de zona horaria

      this.weekPlan.push({
        date: date,
        dayName: dayNames[i],
        dailyTotals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      });
    }
  }

  loadUserPreferences(): void {
    if (!this.currentUser) return;

    this.userService.getUserPreferences(this.currentUser.id).subscribe({
      next: (preferences) => {
        this.userPreferences = preferences;
      },
      error: () => {
        this.userPreferences = null;
      },
    });
  }

  loadRecipes(): void {
    if (!this.currentUser) return;

    this.recipeService.getRecipesByAuthor(this.currentUser.id).subscribe({
      next: (recipes) => {
        this.myRecipes = recipes;
        this.loadRecipesNutrition(recipes);
      },
      error: (error) => console.error('Error cargando mis recetas:', error),
    });

    this.favoriteService.getAllFavorites().subscribe({
      next: (favorites) => {
        const recipeIds = favorites.map((f) => f.recipeId);
        if (recipeIds.length > 0) {
          this.recipeService.getAllRecipes().subscribe({
            next: (allRecipes) => {
              this.savedRecipes = allRecipes.filter((r) => recipeIds.includes(r.id));
              this.loadRecipesNutrition(this.savedRecipes);
            },
            error: (error) => console.error('Error cargando recetas guardadas:', error),
          });
        }
      },
      error: (error) => console.error('Error cargando favoritos:', error),
    });
  }

  loadRecipesNutrition(recipes: Recipe[]): void {
    recipes.forEach((recipe) => {
      this.recipeService.getNutritionInfo(recipe.id).subscribe({
        next: (nutrition) => {
          this.recipesNutrition.set(recipe.id, nutrition);
        },
        error: () => {},
      });
    });
  }

  getRecipeNutrition(recipeId: number): NutritionInfo | undefined {
    return this.recipesNutrition.get(recipeId);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  formatDateISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openRecipeSelector(date: Date, mealType: 'breakfast' | 'lunch' | 'dinner'): void {
    this.selectedDate = date;
    this.selectedMealType = mealType;
    this.showRecipeSelector = true;
  }

  closeRecipeSelector(): void {
    this.showRecipeSelector = false;
    this.selectedDate = null;
    this.selectedMealType = null;
  }

  getFilteredRecipes(): Recipe[] {
    return this.recipesFilter === 'my' ? this.myRecipes : this.savedRecipes;
  }

  selectRecipe(recipe: Recipe): void {
    if (!this.selectedDate || !this.selectedMealType || !this.currentMealPlan) return;

    this.isSaving = true;

    const itemCreate: MealPlanItemCreateDTO = {
      mealPlanId: this.currentMealPlan.id,
      recipeId: recipe.id,
      mealTypeId: this.getMealTypeId(this.selectedMealType),
      date: this.formatDateISO(this.selectedDate),
    };

    console.log('Creating meal plan item:', itemCreate);

    this.plannerService.addMealPlanItem(itemCreate).subscribe({
      next: (savedItem) => {
        const day = this.weekPlan.find(
          (d) => d.date.toDateString() === this.selectedDate!.toDateString()
        );

        if (day) {
          const nutritionInfo = this.getRecipeNutrition(recipe.id);
          const plannedMeal: PlannedMeal = {
            recipe,
            nutritionInfo,
            itemId: savedItem.id,
          };

          switch (this.selectedMealType) {
            case 'breakfast':
              day.breakfast = plannedMeal;
              break;
            case 'lunch':
              day.lunch = plannedMeal;
              break;
            case 'dinner':
              day.dinner = plannedMeal;
              break;
          }

          this.calculateDayTotals(day);
          this.calculateWeeklyTotals();
        }

        this.isSaving = false;
        this.closeRecipeSelector();
      },
      error: (error) => {
        console.error('Error guardando receta:', error);
        alert('Error al guardar la receta. Por favor, inténtalo de nuevo.');
        this.isSaving = false;
      },
    });
  }

  removeMeal(date: Date, mealType: 'breakfast' | 'lunch' | 'dinner'): void {
    if (!this.currentMealPlan) return;

    const day = this.weekPlan.find((d) => d.date.toDateString() === date.toDateString());

    if (!day) return;

    this.isSaving = true;

    const mealTypeId = this.getMealTypeId(mealType);
    const dateISO = this.formatDateISO(date);

    console.log('Eliminando meal plan item:', {
      mealPlanId: this.currentMealPlan.id,
      date: dateISO,
      mealTypeId: mealTypeId,
      mealType: mealType,
    });

    this.plannerService
      .deleteMealPlanItemByDetails(this.currentMealPlan.id, dateISO, mealTypeId)
      .subscribe({
        next: () => {
          console.log('Meal plan item eliminado exitosamente');
          switch (mealType) {
            case 'breakfast':
              day.breakfast = undefined;
              break;
            case 'lunch':
              day.lunch = undefined;
              break;
            case 'dinner':
              day.dinner = undefined;
              break;
          }

          this.calculateDayTotals(day);
          this.calculateWeeklyTotals();
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error eliminando receta:', error);
          console.error('Detalles de la eliminación:', {
            mealPlanId: this.currentMealPlan!.id,
            date: dateISO,
            mealTypeId: mealTypeId,
          });
          alert('Error al eliminar la receta. Por favor, inténtalo de nuevo.');
          this.isSaving = false;
        },
      });
  }

  calculateDayTotals(day: DayPlan): void {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    const meals = [day.breakfast, day.lunch, day.dinner];
    meals.forEach((meal) => {
      if (meal?.nutritionInfo) {
        calories += Number(meal.nutritionInfo.calories) || 0;
        protein += Number(meal.nutritionInfo.protein) || 0;
        carbs += Number(meal.nutritionInfo.carbs) || 0;
        fat += Number(meal.nutritionInfo.fat) || 0;
      }
    });

    day.dailyTotals = { calories, protein, carbs, fat };
  }

  calculateWeeklyTotals(): void {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    this.weekPlan.forEach((day) => {
      calories += day.dailyTotals.calories;
      protein += day.dailyTotals.protein;
      carbs += day.dailyTotals.carbs;
      fat += day.dailyTotals.fat;
    });

    this.weeklyTotals = { calories, protein, carbs, fat };
  }

  getDayProgress(day: DayPlan): number {
    if (!this.userPreferences) return 0;
    const target = this.getTargetCalories();
    if (target === 0) return 0;
    return (day.dailyTotals.calories / target) * 100;
  }

  getTargetCalories(): number {
    if (!this.userPreferences) return 0;

    if (
      this.userPreferences.useAutomaticCalculation &&
      this.userPreferences.gender &&
      this.userPreferences.age &&
      this.userPreferences.weight &&
      this.userPreferences.height
    ) {
      const macros = this.calculateAutomaticMacros(
        this.userPreferences.gender,
        this.userPreferences.age,
        this.userPreferences.weight,
        this.userPreferences.height,
        this.userPreferences.activityLevel || 'moderate',
        this.userPreferences.goal || 'maintenance'
      );
      return macros.calories;
    }

    return this.userPreferences.dailyCaloriesGoal || 0;
  }

  getTargetProtein(): number {
    if (!this.userPreferences) return 0;

    if (
      this.userPreferences.useAutomaticCalculation &&
      this.userPreferences.gender &&
      this.userPreferences.age &&
      this.userPreferences.weight &&
      this.userPreferences.height
    ) {
      const macros = this.calculateAutomaticMacros(
        this.userPreferences.gender,
        this.userPreferences.age,
        this.userPreferences.weight,
        this.userPreferences.height,
        this.userPreferences.activityLevel || 'moderate',
        this.userPreferences.goal || 'maintenance'
      );
      return macros.protein;
    }

    return Number(this.userPreferences.dailyProteinGoal) || 0;
  }

  getTargetCarbs(): number {
    if (!this.userPreferences) return 0;

    if (
      this.userPreferences.useAutomaticCalculation &&
      this.userPreferences.gender &&
      this.userPreferences.age &&
      this.userPreferences.weight &&
      this.userPreferences.height
    ) {
      const macros = this.calculateAutomaticMacros(
        this.userPreferences.gender,
        this.userPreferences.age,
        this.userPreferences.weight,
        this.userPreferences.height,
        this.userPreferences.activityLevel || 'moderate',
        this.userPreferences.goal || 'maintenance'
      );
      return macros.carbs;
    }

    return Number(this.userPreferences.dailyCarbsGoal) || 0;
  }

  getTargetFat(): number {
    if (!this.userPreferences) return 0;

    if (
      this.userPreferences.useAutomaticCalculation &&
      this.userPreferences.gender &&
      this.userPreferences.age &&
      this.userPreferences.weight &&
      this.userPreferences.height
    ) {
      const macros = this.calculateAutomaticMacros(
        this.userPreferences.gender,
        this.userPreferences.age,
        this.userPreferences.weight,
        this.userPreferences.height,
        this.userPreferences.activityLevel || 'moderate',
        this.userPreferences.goal || 'maintenance'
      );
      return macros.fat;
    }

    return Number(this.userPreferences.dailyFatGoal) || 0;
  }

  calculateAutomaticMacros(
    gender: string,
    age: number,
    weight: number,
    height: number,
    activityLevel: string,
    goal: string
  ): { calories: number; protein: number; carbs: number; fat: number } {
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const activityFactor = activityFactors[activityLevel] || 1.55;
    let tdee = bmr * activityFactor;

    if (goal === 'deficit') {
      tdee *= 0.85;
    } else if (goal === 'surplus') {
      tdee *= 1.1;
    }

    const protein = weight * 2;
    const fat = (tdee * 0.25) / 9;
    const remainingCalories = tdee - protein * 4 - fat * 9;
    const carbs = remainingCalories / 4;

    return {
      calories: Math.round(tdee),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  }

  hasAnyMeals(): boolean {
    return this.weekPlan.some((day) => day.breakfast || day.lunch || day.dinner);
  }

  // En planner.component.ts - mejora la función generateShoppingList
  generateShoppingList(): void {
    if (!this.currentUser || !this.currentMealPlan) return;

    this.isGeneratingShoppingList = true;

    // Recopilar todas las recetas de la semana
    const allRecipes: { recipe: Recipe; count: number }[] = [];
    const recipeCount = new Map<number, number>();

    this.weekPlan.forEach((day) => {
      const meals = [day.breakfast, day.lunch, day.dinner];
      meals.forEach((meal) => {
        if (meal) {
          const count = recipeCount.get(meal.recipe.id) || 0;
          recipeCount.set(meal.recipe.id, count + 1);

          // Solo añadir una vez al array
          if (count === 0) {
            allRecipes.push({ recipe: meal.recipe, count: 1 });
          } else {
            const existing = allRecipes.find((r) => r.recipe.id === meal.recipe.id);
            if (existing) {
              existing.count = count + 1;
            }
          }
        }
      });
    });

    if (allRecipes.length === 0) {
      alert('No hay recetas planificadas para esta semana');
      this.isGeneratingShoppingList = false;
      return;
    }

    // Consolidar ingredientes - MEJORADO
    const ingredientsMap = new Map<
      string,
      { quantity: number; unit: string; recipeCount: number }
    >();

    allRecipes.forEach(({ recipe, count }) => {
      if (recipe.ingredients) {
        try {
          const ingredients =
            typeof recipe.ingredients === 'string'
              ? JSON.parse(recipe.ingredients)
              : recipe.ingredients;

          ingredients.forEach((ing: any) => {
            const key = ing.name.toLowerCase().trim();
            const quantity = (ing.quantity || 0) * count;

            if (ingredientsMap.has(key)) {
              const existing = ingredientsMap.get(key)!;
              // Sumar cantidades si las unidades son compatibles
              if (existing.unit === ing.unit) {
                existing.quantity += quantity;
                existing.recipeCount += count;
              } else {
                // Si las unidades son diferentes, crear una nueva entrada
                const newKey = `${key}_${ing.unit}`;
                ingredientsMap.set(newKey, {
                  quantity: quantity,
                  unit: ing.unit || '',
                  recipeCount: count,
                });
              }
            } else {
              ingredientsMap.set(key, {
                quantity: quantity,
                unit: ing.unit || '',
                recipeCount: count,
              });
            }
          });
        } catch (e) {
          console.warn('Error parsing ingredients for recipe:', recipe.title, e);
        }
      }
    });

    // Crear array de ShoppingItems
    const items: ShoppingItem[] = [];
    ingredientsMap.forEach((value, key) => {
      // Remover sufijo de unidad si existe
      const name = key.split('_')[0];
      items.push({
        name: this.capitalizeFirstLetter(name),
        quantity: Math.round(value.quantity * 100) / 100, // Redondear a 2 decimales
        unit: value.unit,
        checked: false,
      });
    });

    // Ordenar alfabéticamente
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Crear shopping list
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(this.currentWeekStart.getDate() + 6);

    const shoppingListCreate: ShoppingListCreateDTO = {
      userId: this.currentUser.id,
      mealPlanId: this.currentMealPlan.id,
      weekStartDate: this.formatDateISO(this.currentWeekStart),
      weekEndDate: this.formatDateISO(weekEnd),
      title: `Lista Semana ${this.getWeekNumber(this.currentWeekStart)}`,
      items: items,
    };

    this.shoppingListService.createShoppingList(shoppingListCreate).subscribe({
      next: (shoppingList) => {
        this.isGeneratingShoppingList = false;
        this.router.navigate(['/shopping-list']);
      },
      error: (error) => {
        console.error('Error generando lista de compra:', error);
        alert('Error al generar la lista de compra');
        this.isGeneratingShoppingList = false;
      },
    });
  }
  
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}