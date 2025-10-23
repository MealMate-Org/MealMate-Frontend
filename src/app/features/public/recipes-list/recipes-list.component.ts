import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <h1 class="mb-4">Recetas Públicas</h1>
          
          <div class="flex gap-4 mb-4">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()"
              placeholder="Buscar recetas..."
              class="input flex-1"
            >
            <button class="btn-primary" (click)="onSearch()">
              🔍 Buscar
            </button>
          </div>

          <div class="flex gap-2 flex-wrap">
            <button 
              (click)="toggleFilter('vegetarian')"
              [class]="activeFilters.includes('vegetarian') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🥬 Vegetariano
            </button>
            <button 
              (click)="toggleFilter('vegan')"
              [class]="activeFilters.includes('vegan') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🌱 Vegano
            </button>
            <button 
              (click)="toggleFilter('glutenFree')"
              [class]="activeFilters.includes('glutenFree') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              🌾 Sin Gluten
            </button>
            <button 
              (click)="toggleFilter('popular')"
              [class]="activeFilters.includes('popular') ? 'badge bg-cambridge-blue' : 'badge'"
              class="cursor-pointer">
              ⭐ Popular
            </button>
          </div>
        </div>

        @if (isLoading) {
          <div class="text-center py-12">
            <p class="text-slate-gray">Cargando recetas...</p>
          </div>
        }

        @if (!isLoading && recipes.length > 0) {
          <div class="grid md:grid-cols-3 gap-6">
            @for (recipe of recipes; track recipe.id) {
              <a [routerLink]="['/recipes', recipe.id]" class="card hover:shadow-lg transition cursor-pointer">
                @if (recipe.imagePath) {
                  <img 
                    [src]="recipe.imagePath" 
                    [alt]="recipe.title"
                    class="w-full h-48 object-cover rounded-t-card mb-4"
                  >
                } @else {
                  <div class="w-full h-48 bg-celadon rounded-t-card mb-4 flex items-center justify-center">
                    <span class="text-6xl">🍽️</span>
                  </div>
                }

                <div class="p-4">
                  <h3 class="mb-2">{{ recipe.title }}</h3>
                  <p class="text-slate-gray text-sm mb-3 line-clamp-2">
                    {{ recipe.description || 'Sin descripción' }}
                  </p>

                  <div class="flex justify-between items-center text-sm">
                    <span class="text-slate-gray">
                      Por {{ recipe.authorId }}
                    </span>
                    <div class="flex items-center gap-1">
                      <span class="text-yellow-500">⭐</span>
                      <span class="font-medium">{{ recipe.avgRating.toFixed(1) }}</span>
                      <span class="text-slate-gray">({{ recipe.ratingCount }})</span>
                    </div>
                  </div>

                  @if (recipe.allergens && recipe.allergens.length > 0) {
                    <div class="mt-3 flex gap-1 flex-wrap">
                      @for (allergen of recipe.allergens; track allergen.id) {
                        <span class="badge-error text-xs">
                          ⚠️ {{ allergen.name }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </a>
            }
          </div>
        }

        @if (!isLoading && recipes.length === 0) {
          <div class="text-center py-12 card">
            <p class="text-2xl mb-2">🔍</p>
            <p class="text-slate-gray">No se encontraron recetas</p>
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
  searchTerm: string = '';
  activeFilters: string[] = [];
  isLoading = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.recipeService.searchRecipes(this.searchTerm).subscribe({
        next: (recipes) => {
          this.recipes = recipes;
        },
        error: (error) => {
          console.error('Error buscando:', error);
        }
      });
    } else {
      this.loadRecipes();
    }
  }

  toggleFilter(filter: string): void {
    const index = this.activeFilters.indexOf(filter);
    if (index > -1) {
      this.activeFilters.splice(index, 1);
    } else {
      this.activeFilters.push(filter);
    }
  }
}
