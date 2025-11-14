import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Allergen } from '../../../models/recipe.model';
import { 
  LucideAngularModule,
  Search,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-angular';

export interface RecipeFilters {
  searchTerm: string;
  visibilityFilter?: 'all' | 'public' | 'private';
  mealTypeFilter: number | null;
  sortBy: string;
  excludedAllergenIds: number[];
}

@Component({
  selector: 'app-recipe-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <!-- Barra de búsqueda -->
      <div class="mb-5">
        <div class="relative">
          <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-gray absolute left-3 top-1/2 transform -translate-y-1/2"></lucide-icon>
          <input
            type="text"
            [(ngModel)]="currentFilters.searchTerm"
            (input)="emitFiltersChange()"
            class="input w-full pl-10 text-sm"
            [placeholder]="searchPlaceholder"
          />
        </div>
      </div>

      <div class="space-y-4">
        <!-- Fila superior: Visibilidad (opcional) y/o Tipo de comida y Ordenación -->
        <div [class]="showVisibilityFilter ? 'grid md:grid-cols-3 gap-4' : 'grid md:grid-cols-2 gap-4'">
          
          <!-- Visibilidad (solo si se solicita) -->
          @if (showVisibilityFilter) {
            <div>
              <h3 class="text-sm font-semibold mb-2 text-dark-purple">Visibilidad</h3>
              <div class="flex gap-2">
                <button
                  (click)="currentFilters.visibilityFilter = 'all'; emitFiltersChange()"
                  [class]="currentFilters.visibilityFilter === 'all' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                  class="px-3 py-2 rounded-lg font-medium transition-all text-sm flex-1"
                >
                  Todas
                </button>
                <button
                  (click)="currentFilters.visibilityFilter = 'public'; emitFiltersChange()"
                  [class]="currentFilters.visibilityFilter === 'public' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                  class="px-3 py-2 rounded-lg font-medium transition-all text-sm flex-1"
                >
                  Públicas
                </button>
                <button
                  (click)="currentFilters.visibilityFilter = 'private'; emitFiltersChange()"
                  [class]="currentFilters.visibilityFilter === 'private' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                  class="px-3 py-2 rounded-lg font-medium transition-all text-sm flex-1"
                >
                  Privadas
                </button>
              </div>
            </div>
          }

          <!-- Tipo de comida -->
          <div [class]="!showVisibilityFilter ? 'md:col-span-1' : ''">
            <h3 class="text-sm font-semibold mb-2 text-dark-purple flex items-center gap-2">
              <lucide-icon [img]="FiltersIcon" class="w-4 h-4"></lucide-icon>
              Tipo de comida
            </h3>
            <div class="flex gap-2 flex-wrap">
              <button
                (click)="currentFilters.mealTypeFilter = null; emitFiltersChange()"
                [class]="currentFilters.mealTypeFilter === null ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                {{ showVisibilityFilter ? 'Todos' : 'Todas' }}
              </button>
              <button
                (click)="currentFilters.mealTypeFilter = 1; emitFiltersChange()"
                [class]="currentFilters.mealTypeFilter === 1 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Desayuno
              </button>
              <button
                (click)="currentFilters.mealTypeFilter = 2; emitFiltersChange()"
                [class]="currentFilters.mealTypeFilter === 2 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Comida
              </button>
              <button
                (click)="currentFilters.mealTypeFilter = 3; emitFiltersChange()"
                [class]="currentFilters.mealTypeFilter === 3 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Cena
              </button>
              <button
                (click)="currentFilters.mealTypeFilter = 4; emitFiltersChange()"
                [class]="currentFilters.mealTypeFilter === 4 ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray hover:bg-gray-200'"
                class="px-3 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Aperitivo
              </button>
            </div>
          </div>

          <!-- Ordenar -->
          <div>
            <h3 class="text-sm font-semibold mb-2 text-dark-purple">Ordenar por</h3>
            <select [(ngModel)]="currentFilters.sortBy" (change)="emitFiltersChange()" class="input text-sm w-full">
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
                    (change)="toggleAllergen(allergen.id)"
                    [checked]="currentFilters.excludedAllergenIds.includes(allergen.id)"
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
            <button (click)="clearAllFilters()" class="btn-secondary text-sm w-full">
              Limpiar todos los filtros
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class RecipeFiltersComponent {
  @Input({ required: true }) allergens: Allergen[] = [];
  @Input() showVisibilityFilter = false;
  @Input() searchPlaceholder = 'Buscar recetas...';
  @Input() initialFilters: RecipeFilters = {
    searchTerm: '',
    visibilityFilter: 'all',
    mealTypeFilter: null,
    sortBy: 'newest',
    excludedAllergenIds: []
  };

  @Output() filtersChange = new EventEmitter<RecipeFilters>();

  currentFilters: RecipeFilters = { ...this.initialFilters };

  readonly SearchIcon = Search;
  readonly AlertIcon = AlertTriangle;
  readonly FiltersIcon = SlidersHorizontal;

  ngOnInit(): void {
    this.currentFilters = { ...this.initialFilters };
  }

  toggleAllergen(allergenId: number): void {
    const index = this.currentFilters.excludedAllergenIds.indexOf(allergenId);
    if (index > -1) {
      this.currentFilters.excludedAllergenIds.splice(index, 1);
    } else {
      this.currentFilters.excludedAllergenIds.push(allergenId);
    }
    this.emitFiltersChange();
  }

  emitFiltersChange(): void {
    this.filtersChange.emit({ ...this.currentFilters });
  }

  hasActiveFilters(): boolean {
    return this.currentFilters.searchTerm.trim() !== '' || 
           (this.showVisibilityFilter && this.currentFilters.visibilityFilter !== 'all') ||
           this.currentFilters.mealTypeFilter !== null ||
           this.currentFilters.excludedAllergenIds.length > 0 ||
           this.currentFilters.sortBy !== 'newest';
  }

  clearAllFilters(): void {
    this.currentFilters = {
      searchTerm: '',
      visibilityFilter: 'all',
      mealTypeFilter: null,
      sortBy: 'newest',
      excludedAllergenIds: []
    };
    this.emitFiltersChange();
  }
}
