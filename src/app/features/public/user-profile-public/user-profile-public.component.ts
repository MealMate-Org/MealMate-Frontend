import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { RecipeCardComponent } from '../../../shared/components/recipe-card/recipe-card.component';
import { UserService } from '../../../core/services/user.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { Recipe } from '../../../models/recipe.model';
import { LucideAngularModule, ChefHat, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-user-profile-public',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FooterComponent,
    NavbarComponent,
    RecipeCardComponent,
    LucideAngularModule
  ],
  templateUrl: './user-profile-public.component.html'
})
export class UserProfilePublicComponent implements OnInit {
  user: User | null = null;
  userRecipes: Recipe[] = [];
  isLoading = true;
  isOwnProfile = false;
  totalRatings = 0;
  avgRating = 0;
  username: string = '';

  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile(): void {
    this.isLoading = true;
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.username.toLowerCase() === this.username.toLowerCase()) || null;
        
        if (this.user) {
          const currentUser = this.authService.getCurrentUser();
          // Determinar si es el perfil propio solo si hay usuario logueado
          this.isOwnProfile = currentUser ? currentUser.id === this.user.id : false;
          
          this.loadUserRecipes(this.user.id);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error cargando usuario:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserRecipes(userId: number): void {
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.userRecipes = recipes.filter(r => {
          if (this.isOwnProfile) {
            return r.authorId === userId;
          } else {
            return r.authorId === userId && r.isPublic;
          }
        });

        this.calculateStatistics();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalRatings = this.userRecipes.reduce((sum, r) => sum + r.ratingCount, 0);
    
    if (this.userRecipes.length > 0) {
      const totalRating = this.userRecipes.reduce((sum, r) => sum + (r.avgRating * r.ratingCount), 0);
      this.avgRating = this.totalRatings > 0 ? totalRating / this.totalRatings : 0;
    }
  }
}
