import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card.component';
import { RecipeFiltersComponent, RecipeFilters } from '../../../shared/components/recipe-filters/recipe-filters.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { Recipe, Allergen } from '../../../models/recipe.model';
import { User } from '../../../models/user.model';
import { LucideAngularModule, Search, ChefHat } from 'lucide-angular';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    RecipeCardComponent,
    RecipeFiltersComponent,
    LucideAngularModule
  ],
  templateUrl: './recipes-list.component.html'
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  allergens: Allergen[] = [];
  users: User[] = [];
  isLoading = false;

  readonly SearchIcon = Search;
  readonly ChefHatIcon = ChefHat;

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
        this.filteredRecipes = this.recipes;
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

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error cargando usuarios:', error)
    });
  }

  getAuthorName(authorId: number): string {
    const user = this.users.find((u) => u.id === authorId);
    return user ? user.username : `Usuario ${authorId}`;
  }

  onFiltersChange(filters: RecipeFilters): void {
    let filtered = [...this.recipes];

    // Filtro por búsqueda
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(term))
      );
    }

    // Filtro por tipo de comida
    if (filters.mealTypeFilter !== null) {
      filtered = filtered.filter((recipe) => recipe.mealTypeId === filters.mealTypeFilter);
    }

    // Filtro por alérgenos excluidos
    if (filters.excludedAllergenIds.length > 0) {
      filtered = filtered.filter((recipe) => {
        const recipeAllergenIds = recipe.allergens.map((a) => a.id);
        return !filters.excludedAllergenIds.some((id) => recipeAllergenIds.includes(id));
      });
    }

    // Ordenar
    filtered = this.sortRecipes(filtered, filters.sortBy);

    this.filteredRecipes = filtered;
  }

  sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
    switch (sortBy) {
      case 'newest':
        return recipes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return recipes.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'popularity':
        return recipes.sort((a, b) => b.ratingCount - a.ratingCount);
      case 'rating':
        return recipes.sort((a, b) => b.avgRating - a.avgRating);
      default:
        return recipes;
    }
  }
}
