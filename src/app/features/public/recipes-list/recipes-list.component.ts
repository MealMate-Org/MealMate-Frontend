import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../models/recipe.model';
import { 
  LucideAngularModule, 
  Search, 
  Star, 
  ChefHat,
  AlertTriangle
} from 'lucide-angular';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="mb-12 text-center">
          <h1 class="mb-4 text-5xl">Explora Recetas</h1>
          <p class="text-slate-gray text-xl">Descubre deliciosas recetas compartidas por la comunidad</p>
        </div>

        <!-- Búsqueda y filtros -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <!-- Barra de búsqueda -->
          <div class="flex gap-4 mb-6">
            <div class="flex-1 relative">
              <lucide-icon [img]="SearchIcon" class="w-6 h-6 text-slate-gray absolute left-4 top-1/2 transform -translate-y-1/2"></lucide-icon>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
                placeholder="Buscar recetas por nombre o ingredientes..."
                class="input w-full pl-14 pr-6 py-4 text-lg"
              >
            </div>
            <button 
              (click)="onSearch()" 
              class="btn-primary px-8 text-lg"
            >
              Buscar
            </button>
          </div>

          <!-- Filtros -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-dark-purple">Filtrar por tipo de comida</h3>
            <div class="flex gap-3 flex-wrap">
              <button 
                (click)="toggleFilter(null)"
                [class]="selectedMealType === null ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Todas
              </button>
              <button 
                (click)="toggleFilter(1)"
                [class]="selectedMealType === 1 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Desayuno
              </button>
              <button 
                (click)="toggleFilter(2)"
                [class]="selectedMealType === 2 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Comida
              </button>
              <button 
                (click)="toggleFilter(3)"
                [class]="selectedMealType === 3 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Cena
              </button>
              <button 
                (click)="toggleFilter(4)"
                [class]="selectedMealType === 4 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Aperitivo
              </button>
              <button 
                (click)="toggleFilter(5)"
                [class]="selectedMealType === 5 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-6 py-3 rounded-xl font-medium transition-all text-base"
              >
                Merienda
              </button>
            </div>
          </div>
        </div>

        <!-- Resultados -->
        @if (isLoading) {
          <div class="text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-cambridge-blue mb-4"></div>
            <p class="text-slate-gray text-lg">Cargando recetas...</p>
          </div>
        }

        @if (!isLoading && filteredRecipes.length > 0) {
          <div class="mb-6 text-slate-gray text-lg">
            Mostrando {{ filteredRecipes.length }} recetas
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            @for (recipe of filteredRecipes; track recipe.id) {
              <a 
                [routerLink]="['/recipes', recipe.id]" 
                class="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-gray-100"
              >
                <!-- Imagen -->
                @if (recipe.imagePath) {
                  <div class="relative overflow-hidden h-56">
                    <img 
                      [src]="recipe.imagePath" 
                      [alt]="recipe.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                } @else {
                  <div class="relative overflow-hidden h-56 bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
                    <lucide-icon [img]="ChefHatIcon" class="w-24 h-24 text-white opacity-50"></lucide-icon>
                  </div>
                }

                <div class="p-6">
                  <h3 class="mb-3 text-xl group-hover:text-cambridge-blue transition-colors">{{ recipe.title }}</h3>
                  <p class="text-slate-gray mb-4 line-clamp-2 text-base">
                    {{ recipe.description || 'Sin descripción disponible' }}
                  </p>

                  <div class="flex justify-between items-center mb-4">
                    <span class="text-slate-gray text-sm">
                      Por Usuario {{ recipe.authorId }}
                    </span>
                    <div class="flex items-center gap-2">
                      <lucide-icon [img]="StarIcon" class="w-5 h-5 text-yellow-500"></lucide-icon>
                      <span class="font-semibold text-lg">{{ recipe.avgRating.toFixed(1) }}</span>
                      <span class="text-slate-gray text-sm">({{ recipe.ratingCount }})</span>
                    </div>
                  </div>

                  @if (recipe.allergens && recipe.allergens.length > 0) {
                    <div class="flex gap-2 flex-wrap pt-4 border-t border-gray-100">
                      @for (allergen of recipe.allergens.slice(0, 3); track allergen.id) {
                        <span class="inline-flex items-center gap-1 bg-red-50 text-error px-3 py-1 rounded-full text-xs font-medium">
                          <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                          {{ allergen.name }}
                        </span>
                      }
                      @if (recipe.allergens.length > 3) {
                        <span class="text-slate-gray text-xs px-3 py-1">
                          +{{ recipe.allergens.length - 3 }} más
                        </span>
                      }
                    </div>
                  }
                </div>
              </a>
            }
          </div>
        }

        @if (!isLoading && filteredRecipes.length === 0) {
          <div class="text-center py-20 bg-white rounded-3xl shadow-xl">
            <lucide-icon [img]="SearchIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
            <h3 class="text-2xl font-bold mb-3">No se encontraron recetas</h3>
            <p class="text-slate-gray text-lg mb-8">Intenta con otros términos de búsqueda o filtros</p>
            <button 
              (click)="clearFilters()" 
              class="btn-primary"
            >
              Limpiar Filtros
            </button>
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
        this.recipes = recipes.filter(recipe => recipe.isPublic);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
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
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.description?.toLowerCase().includes(term) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(term))
      );
    }

    // Filtro de tipo de comida
    if (this.selectedMealType !== null) {
      filtered = filtered.filter(recipe => recipe.mealTypeId === this.selectedMealType);
    }

    this.filteredRecipes = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMealType = null;
    this.filteredRecipes = [...this.recipes];
  }
}