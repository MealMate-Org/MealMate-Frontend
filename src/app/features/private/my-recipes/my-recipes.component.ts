import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe } from '../../../models/recipe.model';
import { 
  LucideAngularModule,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  Globe,
  Lock,
  ChefHat,
  AlertTriangle
} from 'lucide-angular';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="mb-2 text-4xl">Mis Recetas</h1>
            <p class="text-slate-gray text-lg">Gestiona todas tus recetas creadas</p>
          </div>
          <a routerLink="/recipes/new" class="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
            <lucide-icon [img]="PlusIcon" class="w-5 h-5"></lucide-icon>
            Nueva Receta
          </a>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="grid md:grid-cols-3 gap-4">
            <div class="relative">
              <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-gray absolute left-3 top-1/2 transform -translate-y-1/2"></lucide-icon>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterRecipes()"
                class="input w-full pl-10 text-sm"
                placeholder="Buscar en mis recetas..."
              />
            </div>
            <select [(ngModel)]="visibilityFilter" (change)="filterRecipes()" class="input text-sm">
              <option value="all">Todas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
            <select [(ngModel)]="mealTypeFilter" (change)="filterRecipes()" class="input text-sm">
              <option [value]="null">Todos los tipos</option>
              <option [value]="1">Desayuno</option>
              <option [value]="2">Comida</option>
              <option [value]="3">Cena</option>
              <option [value]="4">Aperitivo</option>
              <option [value]="5">Merienda</option>
            </select>
          </div>
        </div>

        @if (isLoading) {
        <div class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"></div>
          <p class="text-slate-gray text-base">Cargando tus recetas...</p>
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length > 0) {
        <div class="mb-5 text-slate-gray text-base">
          Mostrando {{ filteredRecipes.length }} de {{ myRecipes.length }} recetas
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
          @for (recipe of filteredRecipes; track recipe.id) {
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            @if (recipe.imagePath) {
            <div class="relative h-48 overflow-hidden">
              <img
                [src]="recipe.imagePath"
                [alt]="recipe.title"
                class="w-full h-full object-cover"
              />
            </div>
            } @else {
            <div class="relative h-48 bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
              <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-white opacity-50"></lucide-icon>
            </div>
            }

            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <h3 class="flex-1 text-lg">{{ recipe.title }}</h3>
                <div class="flex items-center gap-1 text-xs">
                  <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500 fill-current"></lucide-icon>
                  <span class="font-semibold">{{ recipe.avgRating.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
                {{ recipe.description || 'Sin descripción' }}
              </p>

              <div class="flex justify-between items-center mb-3">
                <span [class]="recipe.isPublic ? 'inline-flex items-center gap-1 bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium' : 'inline-flex items-center gap-1 bg-slate-gray text-white px-2 py-1 rounded-full text-xs font-medium'">
                  <lucide-icon [img]="recipe.isPublic ? GlobeIcon : LockIcon" class="w-3 h-3"></lucide-icon>
                  {{ recipe.isPublic ? 'Pública' : 'Privada' }}
                </span>
                @if (recipe.mealTypeId) {
                <span class="text-slate-gray text-xs">
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
                <span class="text-xs text-slate-gray">+{{ recipe.allergens.length - 2 }}</span>
                }
              </div>
              }

              <!-- Botones actualizados -->
              <div class="flex gap-2 pt-3 border-t border-gray-100">
                <a
                  [routerLink]="['/recipes', recipe.id]"
                  class="flex-1 bg-cambridge-blue text-white text-center py-2 px-3 rounded-lg hover:bg-zomp transition-colors text-xs font-medium inline-flex items-center justify-center gap-1"
                >
                  <lucide-icon [img]="EyeIcon" class="w-3 h-3"></lucide-icon>
                  Ver
                </a>
                <a
                  [routerLink]="['/recipes/edit', recipe.id]"
                  class="flex-1 bg-celadon text-dark-purple border border-dark-purple text-center py-2 px-3 rounded-lg hover:bg-cambridge-blue hover:bg-opacity-50 transition-colors text-xs font-medium inline-flex items-center justify-center gap-1"
                >
                  <lucide-icon [img]="EditIcon" class="w-3 h-3"></lucide-icon>
                  Editar
                </a>
                <button 
                  (click)="deleteRecipe(recipe)" 
                  class="bg-white text-error border border-error hover:bg-error hover:text-white transition-colors py-2 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1"
                >
                  <lucide-icon [img]="TrashIcon" class="w-3 h-3"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
          }
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length === 0) {
        <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
          <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
          <h3 class="mb-3 text-xl">Aún no tienes recetas</h3>
          <p class="text-slate-gray mb-6 text-base">Empieza a crear tus propias recetas y guárdalas aquí</p>
          <a routerLink="/recipes/new" class="btn-primary inline-flex items-center gap-2 text-sm">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
            Crear Mi Primera Receta
          </a>
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length > 0) {
        <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
          <lucide-icon [img]="SearchIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
          <h3 class="mb-3 text-xl">No se encontraron recetas</h3>
          <p class="text-slate-gray mb-6 text-base">Intenta con otros filtros o términos de búsqueda</p>
          <button (click)="clearFilters()" class="btn-secondary text-sm">Limpiar Filtros</button>
        </div>
        }
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    @if (recipeToDelete) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 class="mb-3 text-xl">¿Eliminar receta?</h3>
        <p class="text-slate-gray mb-6 text-base">
          ¿Estás seguro de que quieres eliminar "<strong>{{ recipeToDelete.title }}</strong>"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button (click)="recipeToDelete = null" class="flex-1 btn-secondary text-sm">Cancelar</button>
          <button (click)="confirmDelete()" class="flex-1 bg-error hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm">
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

  // Iconos
  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly EyeIcon = Eye;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash2;
  readonly StarIcon = Star;
  readonly GlobeIcon = Globe;
  readonly LockIcon = Lock;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;

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

    this.recipeService.getRecipesByAuthor(currentUser.id).subscribe({
      next: (recipes) => {
        this.myRecipes = recipes;
        this.filteredRecipes = [...this.myRecipes];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }

  filterRecipes(): void {
    let filtered = [...this.myRecipes];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term)
      );
    }

    if (this.visibilityFilter !== 'all') {
      const isPublic = this.visibilityFilter === 'public';
      filtered = filtered.filter((recipe) => recipe.isPublic === isPublic);
    }

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