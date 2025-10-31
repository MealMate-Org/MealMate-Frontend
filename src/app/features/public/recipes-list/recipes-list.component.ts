import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { Recipe, Allergen } from '../../../models/recipe.model';
import { User } from '../../../models/user.model';
import { LucideAngularModule, Search, Star, ChefHat, AlertTriangle, SlidersHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />

    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-4xl">Explora Recetas</h1>
          <p class="text-slate-gray text-lg">
            Descubre deliciosas recetas compartidas por la comunidad
          </p>
        </div>

        <!-- Búsqueda y filtros -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <!-- Barra de búsqueda -->
          <div class="mb-5">
            <div class="relative">
              <lucide-icon
                [img]="SearchIcon"
                class="w-4 h-4 text-slate-gray absolute left-3 top-1/2 transform -translate-y-1/2"
              ></lucide-icon>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="applyFilters()"
                placeholder="Buscar recetas por nombre o ingredientes..."
                class="input w-full pl-10 text-sm"
              />
            </div>
          </div>

          <div class="space-y-4">
            <!-- Tipo de comida y ordenación -->
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-semibold mb-2 text-dark-purple flex items-center gap-2">
                  <lucide-icon [img]="FiltersIcon" class="w-4 h-4"></lucide-icon>
                  Tipo de comida
                </h3>
                <div class="flex gap-2 flex-wrap">
                  <button
                    (click)="mealTypeFilter = null; applyFilters()"
                    [class]="mealTypeFilter === null ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                    class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Todas
                  </button>
                  <button
                    (click)="mealTypeFilter = 1; applyFilters()"
                    [class]="mealTypeFilter === 1 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                    class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Desayuno
                  </button>
                  <button
                    (click)="mealTypeFilter = 2; applyFilters()"
                    [class]="mealTypeFilter === 2 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                    class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Comida
                  </button>
                  <button
                    (click)="mealTypeFilter = 3; applyFilters()"
                    [class]="mealTypeFilter === 3 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                    class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Cena
                  </button>
                  <button
                    (click)="mealTypeFilter = 4; applyFilters()"
                    [class]="mealTypeFilter === 4 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                    class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    Aperitivo
                  </button>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold mb-2 text-dark-purple">Ordenar por</h3>
                <select [(ngModel)]="sortBy" (change)="applyFilters()" class="input text-sm w-full">
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguas</option>
                  <option value="popularity">Más populares</option>
                  <option value="rating">Mejor valoradas</option>
                </select>
              </div>
            </div>

            <!-- Excluir alérgenos -->
            @if (allergens.length > 0) {
              <div>
                <h3 class="text-sm font-semibold mb-2 text-dark-purple flex items-center gap-2">
                  <lucide-icon [img]="AlertIcon" class="w-4 h-4 text-error"></lucide-icon>
                  Excluir alérgenos
                </h3>
                <div class="grid md:grid-cols-4 gap-2">
                  @for (allergen of allergens; track allergen.id) {
                    <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-celadon rounded-lg transition text-sm">
                      <input 
                        type="checkbox"
                        [value]="allergen.id"
                        (change)="toggleAllergenFilter(allergen.id)"
                        [checked]="excludedAllergenIds.includes(allergen.id)"
                        class="w-4 h-4"
                      >
                      <span>{{ allergen.name }}</span>
                    </label>
                  }
                </div>
              </div>
            }

            @if (hasActiveFilters()) {
              <div class="pt-3 border-t">
                <button (click)="clearFilters()" class="btn-secondary text-sm w-full">
                  Limpiar todos los filtros
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Resultados -->
        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"></div>
            <p class="text-slate-gray text-base">Cargando recetas...</p>
          </div>
        }

        @if (!isLoading && filteredRecipes.length > 0) {
          <div class="mb-5 text-slate-gray text-base">
            Mostrando {{ filteredRecipes.length }} de {{ recipes.length }} recetas
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            @for (recipe of filteredRecipes; track recipe.id) {
              <a
                [routerLink]="['/recipes', recipe.id]"
                class="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100"
              >
                <!-- Imagen -->
                <div class="relative overflow-hidden h-48">
                  @if (recipe.imagePath) {
                    <img
                      [src]="recipe.imagePath"
                      [alt]="recipe.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  } @else {
                    <div class="w-full h-full bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
                      <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-white opacity-50"></lucide-icon>
                    </div>
                  }
                  <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                <div class="p-5">
                  <h3 class="mb-2 text-lg group-hover:text-cambridge-blue transition-colors">
                    {{ recipe.title }}
                  </h3>
                  <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
                    {{ recipe.description || 'Sin descripción disponible' }}
                  </p>

                  <div class="flex justify-between items-center mb-3">
                    <span class="text-slate-gray text-xs">
                      Por {{ getAuthorName(recipe.authorId) }}
                    </span>
                    <div class="flex items-center gap-1">
                      <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500 fill-current"></lucide-icon>
                      <span class="font-semibold text-base">{{ recipe.avgRating.toFixed(1) }}</span>
                      <span class="text-slate-gray text-xs">({{ recipe.ratingCount }})</span>
                    </div>
                  </div>

                  @if (recipe.mealTypeId) {
                    <div class="mb-3">
                      <span class="bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium">
                        {{ getMealTypeName(recipe.mealTypeId) }}
                      </span>
                    </div>
                  }

                  @if (recipe.allergens && recipe.allergens.length > 0) {
                    <div class="flex gap-1 flex-wrap pt-3 border-t border-gray-100">
                      @for (allergen of recipe.allergens.slice(0, 3); track allergen.id) {
                        <span class="inline-flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-full text-xs font-medium">
                          <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                          {{ allergen.name }}
                        </span>
                      }
                      @if (recipe.allergens.length > 3) {
                        <span class="text-slate-gray text-xs px-2 py-1">
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

        @if (!isLoading && filteredRecipes.length === 0 && recipes.length === 0) {
          <div class="text-center py-16 bg-white rounded-2xl shadow-lg">
            <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
            <h3 class="text-xl font-bold mb-2">No hay recetas disponibles</h3>
            <p class="text-slate-gray text-base mb-6">
              Aún no hay recetas públicas compartidas por la comunidad
            </p>
          </div>
        }

        @if (!isLoading && filteredRecipes.length === 0 && recipes.length > 0) {
          <div class="text-center py-16 bg-white rounded-2xl shadow-lg">
            <lucide-icon [img]="SearchIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
            <h3 class="text-xl font-bold mb-2">No se encontraron recetas</h3>
            <p class="text-slate-gray text-base mb-6">
              Intenta con otros términos de búsqueda o filtros
            </p>
            <button (click)="clearFilters()" class="btn-primary text-base">Limpiar Filtros</button>
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
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  allergens: Allergen[] = [];
  users: User[] = [];
  
  searchTerm: string = '';
  mealTypeFilter: number | null = null;
  sortBy = 'newest';
  excludedAllergenIds: number[] = [];
  isLoading = false;

  // Iconos
  readonly SearchIcon = Search;
  readonly StarIcon = Star;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;
  readonly FiltersIcon = SlidersHorizontal;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadAllergens();
    this.loadUsers();
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

  loadAllergens(): void {
    this.recipeService.getAllAllergens().subscribe({
      next: (allergens) => {
        this.allergens = allergens;
      },
      error: (error) => console.error('Error cargando alérgenos:', error)
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  getAuthorName(authorId: number): string {
    const user = this.users.find(u => u.id === authorId);
    return user ? user.username : `Usuario ${authorId}`;
  }

  toggleAllergenFilter(allergenId: number): void {
    const index = this.excludedAllergenIds.indexOf(allergenId);
    if (index > -1) {
      this.excludedAllergenIds.splice(index, 1);
    } else {
      this.excludedAllergenIds.push(allergenId);
    }
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
    if (this.mealTypeFilter !== null) {
      filtered = filtered.filter((recipe) => recipe.mealTypeId === this.mealTypeFilter);
    }

    // Alérgenos excluidos
    if (this.excludedAllergenIds.length > 0) {
      filtered = filtered.filter((recipe) => {
        const recipeAllergenIds = recipe.allergens.map(a => a.id);
        return !this.excludedAllergenIds.some(id => recipeAllergenIds.includes(id));
      });
    }

    // Ordenación
    filtered = this.sortRecipes(filtered);

    this.filteredRecipes = filtered;
  }

  sortRecipes(recipes: Recipe[]): Recipe[] {
    switch (this.sortBy) {
      case 'newest':
        return recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return recipes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popularity':
        return recipes.sort((a, b) => b.ratingCount - a.ratingCount);
      case 'rating':
        return recipes.sort((a, b) => b.avgRating - a.avgRating);
      default:
        return recipes;
    }
  }

  hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' || 
           this.mealTypeFilter !== null ||
           this.excludedAllergenIds.length > 0 ||
           this.sortBy !== 'newest';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.mealTypeFilter = null;
    this.sortBy = 'newest';
    this.excludedAllergenIds = [];
    this.applyFilters();
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