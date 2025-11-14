import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card.component';
import { RecipeFiltersComponent, RecipeFilters } from '../../../shared/components/recipe-filters/recipe-filters.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, Allergen } from '../../../models/recipe.model';
import { LucideAngularModule, Plus, Search, ChefHat } from 'lucide-angular';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    RecipeCardComponent,
    RecipeFiltersComponent,
    LucideAngularModule
  ],
  templateUrl: './my-recipes.component.html'
})
export class MyRecipesComponent implements OnInit {
  myRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  allergens: Allergen[] = [];
  isLoading = true;
  recipeToDelete: Recipe | null = null;

  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly ChefHatIcon = ChefHat;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyRecipes();
    this.loadAllergens();
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
        this.filteredRecipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
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

  onFiltersChange(filters: RecipeFilters): void {
    let filtered = [...this.myRecipes];

    // Filtro por búsqueda
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term)
      );
    }

    // Filtro por visibilidad
    if (filters.visibilityFilter && filters.visibilityFilter !== 'all') {
      const isPublic = filters.visibilityFilter === 'public';
      filtered = filtered.filter((recipe) => recipe.isPublic === isPublic);
    }

    // Filtro por tipo de comida
    if (filters.mealTypeFilter !== null) {
      filtered = filtered.filter((recipe) => recipe.mealTypeId === filters.mealTypeFilter);
    }

    // Filtro por alérgenos excluidos
    if (filters.excludedAllergenIds.length > 0) {
      filtered = filtered.filter((recipe) => {
        const recipeAllergenIds = recipe.allergens.map(a => a.id);
        return !filters.excludedAllergenIds.some(id => recipeAllergenIds.includes(id));
      });
    }

    // Ordenar
    filtered = this.sortRecipes(filtered, filters.sortBy);

    this.filteredRecipes = filtered;
  }

  sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
    switch (sortBy) {
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

  editRecipe(recipeId: number): void {
    this.router.navigate(['/recipes/edit', recipeId]);
  }

  deleteRecipe(recipe: Recipe): void {
    this.recipeToDelete = recipe;
  }

  confirmDelete(): void {
    if (!this.recipeToDelete) return;

    this.recipeService.deleteRecipe(this.recipeToDelete.id).subscribe({
      next: () => {
        this.myRecipes = this.myRecipes.filter((r) => r.id !== this.recipeToDelete?.id);
        this.filteredRecipes = this.filteredRecipes.filter((r) => r.id !== this.recipeToDelete?.id);
        this.recipeToDelete = null;
      },
      error: (error) => {
        console.error('Error eliminando receta:', error);
        alert('Error al eliminar la receta. Inténtalo de nuevo.');
        this.recipeToDelete = null;
      }
    });
  }
}
