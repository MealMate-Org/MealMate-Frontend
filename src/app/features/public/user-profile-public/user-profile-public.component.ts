import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { UserService } from '../../../core/services/user.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-user-profile-public',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-background py-8">
      <div class="max-w-6xl mx-auto px-4">
        @if (isLoading) {
          <div class="text-center py-12">
            <p class="text-slate-gray">Cargando perfil...</p>
          </div>
        }

        @if (!isLoading && user) {
          <!-- Header del perfil -->
          <div class="card mb-8">
            <div class="flex items-start gap-6">
              <img 
                [src]="user.avatar || 'https://via.placeholder.com/150?text=' + user.username[0].toUpperCase()" 
                [alt]="user.username"
                class="w-32 h-32 rounded-full object-cover border-4 border-cambridge-blue"
              >
              
              <div class="flex-1">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h1 class="mb-1">{{ user.username }}</h1>
                    <p class="text-slate-gray">{{ user.email }}</p>
                  </div>
                  
                  @if (isOwnProfile) {
                    <a routerLink="/profile" class="btn-primary">
                      ✏️ Editar Perfil
                    </a>
                  }
                </div>
                
                @if (user.bio) {
                  <p class="text-body mt-4">{{ user.bio }}</p>
                }
                
                <div class="flex gap-6 mt-4 text-sm">
                  <div>
                    <span class="font-bold text-dark-purple">{{ userRecipes.length }}</span>
                    <span class="text-slate-gray"> recetas</span>
                  </div>
                  <div>
                    <span class="font-bold text-dark-purple">{{ totalRatings }}</span>
                    <span class="text-slate-gray"> valoraciones</span>
                  </div>
                  <div>
                    <span class="font-bold text-dark-purple">{{ avgRating.toFixed(1) }}</span>
                    <span class="text-slate-gray"> ⭐ promedio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recetas del usuario -->
          <div class="mb-6">
            <h2 class="mb-4">Recetas de {{ user.username }}</h2>
            
            @if (userRecipes.length > 0) {
              <div class="grid md:grid-cols-3 gap-6">
                @for (recipe of userRecipes; track recipe.id) {
                  <a [routerLink]="['/recipes', recipe.id]" class="card hover:shadow-lg transition cursor-pointer">
                    @if (recipe.imagePath) {
                      <img 
                        [src]="recipe.imagePath" 
                        [alt]="recipe.title"
                        class="w-full h-48 object-cover rounded-t-card -mt-4 -mx-4 mb-4"
                      >
                    } @else {
                      <div class="w-full h-48 bg-celadon rounded-t-card -mt-4 -mx-4 mb-4 flex items-center justify-center">
                        <span class="text-6xl">🍽️</span>
                      </div>
                    }

                    <h3 class="mb-2">{{ recipe.title }}</h3>
                    <p class="text-slate-gray text-sm mb-3 line-clamp-2">
                      {{ recipe.description || 'Sin descripción' }}
                    </p>

                    <div class="flex justify-between items-center text-sm">
                      <div class="flex items-center gap-1">
                        <span class="text-yellow-500">⭐</span>
                        <span class="font-medium">{{ recipe.avgRating.toFixed(1) }}</span>
                        <span class="text-slate-gray">({{ recipe.ratingCount }})</span>
                      </div>
                      @if (recipe.isPublic) {
                        <span class="badge">🌍 Pública</span>
                      }
                    </div>
                  </a>
                }
              </div>
            } @else {
              <div class="card text-center py-12">
                <div class="text-6xl mb-4">📝</div>
                <p class="text-slate-gray">
                  {{ isOwnProfile ? 'Aún no has creado ninguna receta' : user.username + ' no ha publicado recetas todavía' }}
                </p>
              </div>
            }
          </div>
        }

        @if (!isLoading && !user) {
          <div class="card text-center py-12">
            <div class="text-6xl mb-4">❌</div>
            <h2 class="mb-4">Usuario no encontrado</h2>
            <p class="text-slate-gray mb-6">
              No pudimos encontrar este usuario.
            </p>
            <a routerLink="/" class="btn-primary">
              Volver al inicio
            </a>
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
export class UserProfilePublicComponent implements OnInit {
  user: User | null = null;
  userRecipes: Recipe[] = [];
  isLoading = true;
  isOwnProfile = false;
  totalRatings = 0;
  avgRating = 0;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // Obtener username de la URL (sin el @)
      this.username = params['username'];
      if (this.username) {
        this.loadUserProfile();
      }
    });
  }

  loadUserProfile(): void {
    this.isLoading = true;
    
    // Cargar todos los usuarios y buscar por username
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.user = users.find(u => u.username.toLowerCase() === this.username.toLowerCase()) || null;
        
        if (this.user) {
          // Verificar si es el perfil del usuario actual
          const currentUser = this.authService.getCurrentUser();
          this.isOwnProfile = currentUser?.id === this.user.id;
          
          // Cargar recetas del usuario
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
        // Filtrar recetas del usuario (solo públicas si no es el propio perfil)
        this.userRecipes = recipes.filter(r => {
          if (this.isOwnProfile) {
            return r.authorId === userId;
          } else {
            return r.authorId === userId && r.isPublic;
          }
        });

        // Calcular estadísticas
        this.totalRatings = this.userRecipes.reduce((sum, r) => sum + r.ratingCount, 0);
        if (this.userRecipes.length > 0) {
          const totalRating = this.userRecipes.reduce((sum, r) => sum + (r.avgRating * r.ratingCount), 0);
          this.avgRating = this.totalRatings > 0 ? totalRating / this.totalRatings : 0;
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando recetas:', error);
        this.isLoading = false;
      }
    });
  }
}