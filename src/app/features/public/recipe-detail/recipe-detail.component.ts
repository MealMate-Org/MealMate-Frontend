import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/user-actions.service';
import { RatingService } from '../../../core/services/user-actions.service';
import { Recipe, NutritionInfo } from '../../../models/recipe.model';
import { User } from '../../../models/user.model';
import { 
  LucideAngularModule,
  Heart,
  Star,
  Clock,
  Users,
  ChefHat,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-angular';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    LucideAngularModule
  ],
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  author: User | null = null;
  nutritionInfo: NutritionInfo | null = null;
  currentUser: User | null = null;
  
  isLoading = true;
  isOwner = false;
  isFavorite = false;
  userRating: number | null = null;
  showDeleteModal = false;

  readonly HeartIcon = Heart;
  readonly StarIcon = Star;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;
  readonly CalendarIcon = Calendar;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash2;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private recipeService: RecipeService,
    private userService: UserService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadRecipe(id);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadRecipe(id: number): void {
    this.isLoading = true;

    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.isOwner = this.currentUser?.id === recipe.authorId;
        
        // Cargar autor siempre, no solo si hay usuario logueado
        this.loadAuthor(recipe.authorId);
        
        this.loadNutritionInfo(id);
        
        // Solo cargar favoritos y ratings si hay usuario logueado
        if (this.currentUser) {
          this.checkIfFavorite(id);
          this.loadUserRating(id);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando receta:', error);
        this.isLoading = false;
      }
    });
  }

  loadAuthor(authorId: number): void {
    this.userService.getUserById(authorId).subscribe({
      next: (user) => {
        this.author = user;
      },
      error: (error) => console.error('Error cargando autor:', error)
    });
  }

  loadNutritionInfo(recipeId: number): void {
    this.recipeService.getNutritionInfo(recipeId).subscribe({
      next: (info) => {
        this.nutritionInfo = info;
      },
      error: () => {
        // Nutrición opcional, no mostrar error
      }
    });
  }

  checkIfFavorite(recipeId: number): void {
    if (!this.currentUser) return;

    this.favoriteService.getFavoriteById(this.currentUser.id, recipeId).subscribe({
      next: (favorite) => {
        this.isFavorite = favorite !== null;
      },
      error: (error) => {
        console.error('Error verificando favorito:', error);
        this.isFavorite = false;
      }
    });
  }

  loadUserRating(recipeId: number): void {
    if (!this.currentUser) return;

    this.ratingService.getRating(recipeId, this.currentUser.id).subscribe({
      next: (rating) => {
        this.userRating = rating ? rating.score : null;
      },
      error: (error) => {
        console.error('Error cargando valoración:', error);
        this.userRating = null;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.currentUser || !this.recipe) return;

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.currentUser.id, this.recipe.id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
        error: (error) => console.error('Error quitando favorito:', error)
      });
    } else {
      const favorite = {
        userId: this.currentUser.id,
        recipeId: this.recipe.id,
        createdAt: new Date()
      };

      this.favoriteService.addFavorite(favorite).subscribe({
        next: () => {
          this.isFavorite = true;
        },
        error: (error) => console.error('Error añadiendo favorito:', error)
      });
    }
  }

  rateRecipe(score: number): void {
    if (!this.currentUser || !this.recipe) return;

    const rating = {
      recipeId: this.recipe.id,
      userId: this.currentUser.id,
      score: score
    };

    this.ratingService.rateRecipe(rating).subscribe({
      next: () => {
        this.userRating = score;
        // Recargar receta para actualizar el promedio
        this.loadRecipe(this.recipe!.id);
      },
      error: (error) => console.error('Error valorando receta:', error)
    });
  }

  deleteRecipe(): void {
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.recipe) return;

    this.recipeService.deleteRecipe(this.recipe.id).subscribe({
      next: () => {
        // Usar goBack() en lugar de redirección fija
        this.goBack();
      },
      error: (error) => {
        console.error('Error eliminando receta:', error);
        alert('Error al eliminar la receta');
      }
    });
  }

  getMealTypeName(id: number): string {
    const types: { [key: number]: string } = {
      1: 'Desayuno',
      2: 'Comida',
      3: 'Cena',
      4: 'Aperitivo'
    };
    return types[id] || 'Otro';
  }
}
