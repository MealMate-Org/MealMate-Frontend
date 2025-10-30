import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../models/recipe.model';
import { LucideAngularModule, Search, Star, ChefHat, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />

    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <!-- Cambiado max-w-7xl a max-w-6xl y aumentado padding lateral -->
        <!-- Header -->
        <div class="mb-10 text-center">
          <!-- Reducido mb-12 a mb-10 -->
          <h1 class="mb-3 text-4xl">Explora Recetas</h1>
          <!-- Reducido text-5xl a text-4xl y mb-4 a mb-3 -->
          <p class="text-slate-gray text-lg">
            Descubre deliciosas recetas compartidas por la comunidad
          </p>
          <!-- Reducido text-xl a text-lg -->
        </div>

        <!-- Búsqueda y filtros -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <!-- Reducido rounded-3xl a rounded-2xl, p-8 a p-6, shadow-xl a shadow-lg, mb-12 a mb-10 -->
          <!-- Barra de búsqueda -->
          <div class="flex gap-3 mb-5">
            <!-- Reducido gap-4 a gap-3 y mb-6 a mb-5 -->
            <div class="flex-1 relative">
              <lucide-icon
                [img]="SearchIcon"
                class="w-5 h-5 text-slate-gray absolute left-3 top-1/2 transform -translate-y-1/2"
              ></lucide-icon>
              <!-- Reducido tamaño del icono -->
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
                placeholder="Buscar recetas por nombre o ingredientes..."
                class="input w-full pl-12 pr-4 py-3 text-base"
              />
            </div>
            <button (click)="onSearch()" class="btn-primary px-6 text-base">Buscar</button>
          </div>

          <!-- Filtros -->
          <div>
            <h3 class="text-base font-semibold mb-3 text-dark-purple">
              Filtrar por tipo de comida
            </h3>
            <!-- Reducido text-lg a text-base y mb-4 a mb-3 -->
            <div class="flex gap-2 flex-wrap">
              <!-- Reducido gap-3 a gap-2 -->
              <button
                (click)="toggleFilter(null)"
                [class]="
                  selectedMealType === null
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Todas
              </button>
              <button
                (click)="toggleFilter(1)"
                [class]="
                  selectedMealType === 1
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Desayuno
              </button>
              <button
                (click)="toggleFilter(2)"
                [class]="
                  selectedMealType === 2
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Comida
              </button>
              <button
                (click)="toggleFilter(3)"
                [class]="
                  selectedMealType === 3
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Cena
              </button>
              <button
                (click)="toggleFilter(4)"
                [class]="
                  selectedMealType === 4
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Aperitivo
              </button>
              <button
                (click)="toggleFilter(5)"
                [class]="
                  selectedMealType === 5
                    ? 'bg-cambridge-blue text-white'
                    : 'bg-gray-100 text-slate-gray hover:bg-gray-200'
                "
                class="px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Merienda
              </button>
            </div>
          </div>
        </div>

        <!-- Resultados -->
        @if (isLoading) {
        <div class="text-center py-16">
          <!-- Reducido py-20 a py-16 -->
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"
          ></div>
          <!-- Reducido tamaño del spinner -->
          <p class="text-slate-gray text-base">Cargando recetas...</p>
          <!-- Reducido text-lg a text-base -->
        </div>
        } @if (!isLoading && filteredRecipes.length > 0) {
        <div class="mb-5 text-slate-gray text-base">
          <!-- Reducido mb-6 a mb-5 y text-lg a text-base -->
          Mostrando {{ filteredRecipes.length }} recetas
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Reducido gap-8 a gap-6 -->
          @for (recipe of filteredRecipes; track recipe.id) {
          <a
            [routerLink]="['/recipes', recipe.id]"
            class="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100"
          >
            <!-- Imagen -->
            @if (recipe.imagePath) {
            <div class="relative overflow-hidden h-48">
              <!-- Reducido h-56 a h-48 -->
              <img
                [src]="recipe.imagePath"
                [alt]="recipe.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            } @else {
            <div
              class="relative overflow-hidden h-48 bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center"
            >
              <!-- Reducido h-56 a h-48 -->
              <lucide-icon
                [img]="ChefHatIcon"
                class="w-20 h-20 text-white opacity-50"
              ></lucide-icon>
              <!-- Reducido tamaño del icono -->
            </div>
            }

            <div class="p-5">
              <!-- Reducido p-6 a p-5 -->
              <h3 class="mb-2 text-lg group-hover:text-cambridge-blue transition-colors">
                {{ recipe.title }}
              </h3>
              <!-- Reducido text-xl a text-lg y mb-3 a mb-2 -->
              <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
                <!-- Reducido mb-4 a mb-3 y text-base a text-sm -->
                {{ recipe.description || 'Sin descripción disponible' }}
              </p>

              <div class="flex justify-between items-center mb-3">
                <!-- Reducido mb-4 a mb-3 -->
                <span class="text-slate-gray text-xs">
                  <!-- Reducido text-sm a text-xs -->
                  Por Usuario {{ recipe.authorId }}
                </span>
                <div class="flex items-center gap-1">
                  <!-- Reducido gap-2 a gap-1 -->
                  <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500"></lucide-icon>
                  <!-- Reducido tamaño del icono -->
                  <span class="font-semibold text-base">{{ recipe.avgRating.toFixed(1) }}</span>
                  <!-- Reducido text-lg a text-base -->
                  <span class="text-slate-gray text-xs">({{ recipe.ratingCount }})</span>
                  <!-- Reducido text-sm a text-xs -->
                </div>
              </div>

              @if (recipe.allergens && recipe.allergens.length > 0) {
              <div class="flex gap-1 flex-wrap pt-3 border-t border-gray-100">
                <!-- Reducido gap-2 a gap-1 y pt-4 a pt-3 -->
                @for (allergen of recipe.allergens.slice(0, 3); track allergen.id) {
                <span
                  class="inline-flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-full text-xs font-medium"
                >
                  <!-- Reducido padding -->
                  <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                  {{ allergen.name }}
                </span>
                } @if (recipe.allergens.length > 3) {
                <span class="text-slate-gray text-xs px-2 py-1">
                  <!-- Reducido padding -->
                  +{{ recipe.allergens.length - 3 }} más
                </span>
                }
              </div>
              }
            </div>
          </a>
          }
        </div>
        } @if (!isLoading && filteredRecipes.length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl shadow-lg">
          <!-- Reducido py-20 a py-16, rounded-3xl a rounded-2xl, shadow-xl a shadow-lg -->
          <lucide-icon
            [img]="SearchIcon"
            class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"
          ></lucide-icon>
          <!-- Reducido tamaño del icono -->
          <h3 class="text-xl font-bold mb-2">No se encontraron recetas</h3>
          <!-- Reducido text-2xl a text-xl y mb-3 a mb-2 -->
          <p class="text-slate-gray text-base mb-6">
            Intenta con otros términos de búsqueda o filtros
          </p>
          <!-- Reducido text-lg a text-base y mb-8 a mb-6 -->
          <button (click)="clearFilters()" class="btn-primary text-base">> Limpiar Filtros</button>
        </div>
        }
      </div>
    </div>
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
export class RecipesListComponent implements OnInit {
  // El resto del código del componente permanece igual...
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  selectedMealType: number | null = null;
  isLoading = false;

  // Iconos
  readonly SearchIcon = Search;
  readonly StarIcon = Star;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes.filter((recipe) => recipe.isPublic);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilter(mealTypeId: number | null): void {
    this.selectedMealType = mealTypeId;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.recipes];

    // Filtro de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(term))
      );
    }

    // Filtro de tipo de comida
    if (this.selectedMealType !== null) {
      filtered = filtered.filter((recipe) => recipe.mealTypeId === this.selectedMealType);
    }

    this.filteredRecipes = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMealType = null;
    this.filteredRecipes = [...this.recipes];
  }
}
