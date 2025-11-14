import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card.component';
import { RecipeFiltersComponent, RecipeFilters } from '../../../shared/components/recipe-filters/recipe-filters.component';
import { FavoriteService } from '../../../core/services/user-actions.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, Allergen } from '../../../models/recipe.model';
import { Favorite } from '../../../models/social.model';
import { User } from '../../../models/user.model';
import { LucideAngularModule, Heart, Search, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-saved-recipes',
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
  templateUrl: './saved-recipes.component.html'
})
export class SavedRecipesComponent implements OnInit {
  savedRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  favorites: Favorite[] = [];
  allergens: Allergen[] = [];
  users: User[] = [];
  
  isLoading = true;
  errorMessage = '';
  recipeToRemove: Recipe | null = null;

  readonly HeartIcon = Heart;
  readonly SearchIcon = Search;
  readonly AlertIcon = AlertTriangle;

  constructor(
    private favoriteService: FavoriteService,
    private recipeService: RecipeService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadSavedRecipes();
    this.loadAllergens();
    this.loadUsers();
  }

  loadSavedRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'Debes iniciar sesión para ver tus recetas guardadas';
      this.isLoading = false;
      return;
    }

    this.favoriteService.getAllFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        
        if (this.favorites.length === 0) {
          this.isLoading = false;
          return;
        }

        const recipeIds = this.favorites.map(f => f.recipeId);
        
        this.recipeService.getAllRecipes().subscribe({
          next: (recipes) => {
            this.savedRecipes = recipes.filter(r => recipeIds.includes(r.id));
            this.filteredRecipes = this.savedRecipes;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error cargando recetas:', error);
            this.errorMessage = 'Error al cargar las recetas. Por favor, inténtalo de nuevo.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.errorMessage = 'Error al cargar favoritos. Por favor, inténtalo de nuevo.';
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

  onFiltersChange(filters: RecipeFilters): void {
    let filtered = [...this.savedRecipes];

    // Filtro por búsqueda
    if (filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description?.toLowerCase().includes(term)
      );
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

  getAuthorName(authorId: number): string {
    const user = this.users.find(u => u.id === authorId);
    return user ? user.username : `Usuario ${authorId}`;
  }

  removeFromFavorites(recipe: Recipe): void {
    this.recipeToRemove = recipe;
  }

  confirmRemove(): void {
    if (!this.recipeToRemove) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.favoriteService.removeFavorite(currentUser.id, this.recipeToRemove.id).subscribe({
      next: () => {
        this.savedRecipes = this.savedRecipes.filter(r => r.id !== this.recipeToRemove?.id);
        this.filteredRecipes = this.filteredRecipes.filter(r => r.id !== this.recipeToRemove?.id);
        this.favorites = this.favorites.filter(f => f.recipeId !== this.recipeToRemove?.id);
        this.recipeToRemove = null;
      },
      error: (error) => {
        console.error('Error quitando favorito:', error);
        this.errorMessage = 'Error al quitar de favoritos. Inténtalo de nuevo.';
        this.recipeToRemove = null;
      }
    });
  }
}
