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
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="mb-2 text-5xl">Mis Recetas</h1>
            <p class="text-slate-gray text-xl">Gestiona todas tus recetas creadas</p>
          </div>
          <a routerLink="/recipes/new" class="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
            <lucide-icon [img]="PlusIcon" class="w-6 h-6"></lucide-icon>
            Nueva Receta
          </a>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="relative">
              <lucide-icon [img]="SearchIcon" class="w-5 h-5 text-slate-gray absolute left-4 top-1/2 transform -translate-y-1/2"></lucide-icon>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterRecipes()"
                class="input w-full pl-12"
                placeholder="Buscar en mis recetas..."
              />
            </div>
            <select [(ngModel)]="visibilityFilter" (change)="filterRecipes()" class="input">
              <option value="all">Todas</option>
              <option value="public">Públicas</option>
              <option value="private">Privadas</option>
            </select>
            <select [(ngModel)]="mealTypeFilter" (change)="filterRecipes()" class="input">
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
        <div class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-cambridge-blue mb-4"></div>
          <p class="text-slate-gray text-lg">Cargando tus recetas...</p>
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length > 0) {
        <div class="mb-6 text-slate-gray text-lg">
          Mostrando {{ filteredRecipes.length }} de {{ myRecipes.length }} recetas
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          @for (recipe of filteredRecipes; track recipe.id) {
          <div class="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            @if (recipe.imagePath) {
            <div class="relative h-56 overflow-hidden">
              <img
                [src]="recipe.imagePath"
                [alt]="recipe.title"
                class="w-full h-full object-cover"
              />
            </div>
            } @else {
            <div class="relative h-56 bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
              <lucide-icon [img]="ChefHatIcon" class="w-24 h-24 text-white opacity-50"></lucide-icon>
            </div>
            }

            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <h3 class="flex-1 text-xl">{{ recipe.title }}</h3>
                <div class="flex items-center gap-1 text-sm">
                  <lucide-icon [img]="StarIcon" class="w-5 h-5 text-yellow-500 fill-current"></lucide-icon>
                  <span class="font-semibold">{{ recipe.avgRating.toFixed(1) }}</span>
                </div>
              </div>

              <p class="text-slate-gray mb-4 line-clamp-2 text-base">
                {{ recipe.description || 'Sin descripción' }}
              </p>

              <div class="flex justify-between items-center mb-4">
                <span [class]="recipe.isPublic ? 'inline-flex items-center gap-2 bg-cambridge-blue text-white px-3 py-1 rounded-full text-sm font-medium' : 'inline-flex items-center gap-2 bg-slate-gray text-white px-3 py-1 rounded-full text-sm font-medium'">
                  <lucide-icon [img]="recipe.isPublic ? GlobeIcon : LockIcon" class="w-3 h-3"></lucide-icon>
                  {{ recipe.isPublic ? 'Pública' : 'Privada' }}
                </span>
                @if (recipe.mealTypeId) {
                <span class="text-slate-gray text-sm">
                  {{ getMealTypeName(recipe.mealTypeId) }}
                </span>
                }
              </div>

              @if (recipe.allergens && recipe.allergens.length > 0) {
              <div class="mb-4 flex gap-2 flex-wrap">
                @for (allergen of recipe.allergens.slice(0, 2); track allergen.id) {
                <span class="inline-flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-lg text-xs font-medium">
                  <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                  {{ allergen.name }}
                </span>
                }
                @if (recipe.allergens.length > 2) {
                <span class="text-xs text-slate-gray">+{{ recipe.allergens.length - 2 }}</span>
                }
              </div>
              }

              <div class="flex gap-2 pt-4 border-t border-gray-100">
                <a
                  [routerLink]="['/recipes', recipe.id]"
                  class="flex-1 btn-secondary text-center text-sm inline-flex items-center justify-center gap-2"
                >
                  <lucide-icon [img]="EyeIcon" class="w-4 h-4"></lucide-icon>
                  Ver
                </a>
                <a
                  [routerLink]="['/recipes/edit', recipe.id]"
                  class="flex-1 btn-secondary text-center text-sm inline-flex items-center justify-center gap-2"
                >
                  <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                  Editar
                </a>
                <button 
                  (click)="deleteRecipe(recipe)" 
                  class="btn-secondary text-sm px-4 inline-flex items-center gap-1"
                >
                  <lucide-icon [img]="TrashIcon" class="w-4 h-4 text-error"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
          }
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length === 0) {
        <div class="bg-white rounded-3xl shadow-xl text-center py-20 px-8">
          <lucide-icon [img]="ChefHatIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
          <h3 class="mb-4 text-2xl">Aún no tienes recetas</h3>
          <p class="text-slate-gray mb-8 text-lg">Empieza a crear tus propias recetas y guárdalas aquí</p>
          <a routerLink="/recipes/new" class="btn-primary inline-flex items-center gap-2">
            <lucide-icon [img]="PlusIcon" class="w-5 h-5"></lucide-icon>
            Crear Mi Primera Receta
          </a>
        </div>
        } 
        
        @if (!isLoading && filteredRecipes.length === 0 && myRecipes.length > 0) {
        <div class="bg-white rounded-3xl shadow-xl text-center py-20 px-8">
          <lucide-icon [img]="SearchIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
          <h3 class="mb-4 text-2xl">No se encontraron recetas</h3>
          <p class="text-slate-gray mb-8 text-lg">Intenta con otros filtros o términos de búsqueda</p>
          <button (click)="clearFilters()" class="btn-secondary">Limpiar Filtros</button>
        </div>
        }
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    @if (recipeToDelete) {
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h3 class="mb-4 text-2xl">¿Eliminar receta?</h3>
        <p class="text-slate-gray mb-8 text-lg">
          ¿Estás seguro de que quieres eliminar "<strong>{{ recipeToDelete.title }}</strong>"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-4">
          <button (click)="recipeToDelete = null" class="flex-1 btn-secondary">Cancelar</button>
          <button (click)="confirmDelete()" class="flex-1 bg-error hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
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