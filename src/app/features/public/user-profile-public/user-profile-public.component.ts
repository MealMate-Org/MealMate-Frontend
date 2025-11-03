import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { UserService } from '../../../core/services/user.service';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { Recipe } from '../../../models/recipe.model';
import { LucideAngularModule, Star, ChefHat, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-user-profile-public',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-8">
        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-3"></div>
            <p class="text-slate-gray text-base">Cargando perfil...</p>
          </div>
        }

        @if (!isLoading && user) {
          <!-- Header del perfil -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <img 
                  [src]="user.avatar || '' + user.username[0].toUpperCase()" 
                  [alt]="user.username"
                  class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-cambridge-blue"
                >
              </div>
              
              <!-- Información del usuario -->
              <div class="flex-1 w-full text-center sm:text-left">
                <div class="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 mb-4">
                  <div class="flex-1">
                    <h1 class="mb-2 text-3xl">{{ user.username }}</h1>
                    <p class="text-slate-gray text-lg">{{ user.email }}</p>
                  </div>
                  
                  @if (isOwnProfile) {
                    <a routerLink="/profile" class="btn-primary px-6 py-3 whitespace-nowrap">
                      Editar Perfil
                    </a>
                  }
                </div>
                
                <!-- Bio -->
                @if (user.bio) {
                  <p class="text-body mt-4 text-base">{{ user.bio }}</p>
                }
                
                <!-- Estadísticas -->
                <div class="flex flex-wrap justify-center sm:justify-start gap-6 mt-4 text-sm">
                  <div class="text-center sm:text-left">
                    <span class="font-bold text-dark-purple block text-lg">{{ userRecipes.length }}</span>
                    <span class="text-slate-gray">recetas</span>
                  </div>
                  <div class="text-center sm:text-left">
                    <span class="font-bold text-dark-purple block text-lg">{{ totalRatings }}</span>
                    <span class="text-slate-gray">valoraciones</span>
                  </div>
                  <div class="text-center sm:text-left">
                    <span class="font-bold text-dark-purple block text-lg">{{ avgRating.toFixed(1) }}</span>
                    <span class="text-slate-gray">⭐ promedio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recetas del usuario -->
          <div class="mb-6">
            <h2 class="mb-4 text-2xl">Recetas de {{ user.username }}</h2>
            
            @if (userRecipes.length > 0) {
              <div class="grid md:grid-cols-3 gap-6">
                @for (recipe of userRecipes; track recipe.id) {
                  <a
                    [routerLink]="['/recipes', recipe.id]"
                    class="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100"
                  >
                    <!-- Imagen -->
                    <div class="relative overflow-hidden h-48">
                      @if (recipe.imagePath) {
                        <img
                          [src]="recipe.imagePath"
                          [alt]="recipe.title"
                          class="w-full h-full object-cover"
                        />
                      } @else {
                        <div class="w-full h-full bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center">
                          <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-white opacity-50"></lucide-icon>
                        </div>
                      }
                      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                      
                      <!-- Badge de visibilidad -->
                      <div class="absolute top-3 left-3">
                        <span 
                          [class]="recipe.isPublic ? 'bg-cambridge-blue text-white' : 'bg-slate-gray text-white'"
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {{ recipe.isPublic ? 'Pública' : 'Privada' }}
                        </span>
                      </div>
                    </div>

                    <div class="p-5">
                      <h3 class="mb-2 text-lg group-hover:text-cambridge-blue transition-colors">
                        {{ recipe.title }}
                      </h3>
                      <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
                        {{ recipe.description || 'Sin descripción disponible' }}
                      </p>

                      <div class="flex justify-between items-center mb-3">
                        <span class="text-slate-gray text-xs">
                          {{ formatDate(recipe.createdAt) }}
                        </span>
                        <div class="flex items-center gap-1">
                          <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500 fill-current"></lucide-icon>
                          <span class="font-semibold text-base">{{ recipe.avgRating.toFixed(1) }}</span>
                          <span class="text-slate-gray text-xs">({{ recipe.ratingCount }})</span>
                        </div>
                      </div>

                      @if (recipe.mealTypeId) {
                        <div class="mb-3">
                          <span class="bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium">
                            {{ getMealTypeName(recipe.mealTypeId) }}
                          </span>
                        </div>
                      }

                      @if (recipe.allergens && recipe.allergens.length > 0) {
                        <div class="flex gap-1 flex-wrap pt-3 border-t border-gray-100">
                          @for (allergen of recipe.allergens.slice(0, 3); track allergen.id) {
                            <span class="inline-flex items-center gap-1 bg-red-50 text-error px-2 py-1 rounded-full text-xs font-medium">
                              <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon>
                              {{ allergen.name }}
                            </span>
                          }
                          @if (recipe.allergens.length > 3) {
                            <span class="text-slate-gray text-xs px-2 py-1">
                              +{{ recipe.allergens.length - 3 }} más
                            </span>
                          }
                        </div>
                      }
                    </div>
                  </a>
                }
              </div>
            } @else {
              <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
                <lucide-icon [img]="ChefHatIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
                <h3 class="mb-3 text-xl">
                  {{ isOwnProfile ? 'Aún no has creado recetas' : user.username + ' no ha publicado recetas' }}
                </h3>
                <p class="text-slate-gray mb-6 text-base">
                  {{ isOwnProfile ? 'Comienza compartiendo tus creaciones culinarias con la comunidad' : 'Este usuario aún no ha compartido recetas' }}
                </p>
                @if (isOwnProfile) {
                  <a routerLink="/recipes/new" class="btn-primary inline-flex items-center gap-2 text-sm">
                    Crear Mi Primera Receta
                  </a>
                }
              </div>
            }
          </div>
        }

        @if (!isLoading && !user) {
          <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
            <lucide-icon [img]="AlertIcon" class="w-20 h-20 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
            <h2 class="mb-3 text-xl">Usuario no encontrado</h2>
            <p class="text-slate-gray mb-6 text-base">
              No pudimos encontrar este usuario.
            </p>
            <a routerLink="/" class="btn-primary text-base">
              Volver al inicio
            </a>
          </div>
        }
      </div>
    </div>
    <app-footer />
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

  readonly StarIcon = Star;
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
          this.isOwnProfile = currentUser?.id === this.user.id;
          
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

  getMealTypeName(id: number): string {
    const types: {[key: number]: string} = {
      1: 'Desayuno',
      2: 'Comida',
      3: 'Cena',
      4: 'Aperitivo'
    };
    return types[id] || 'Otro';
  }

  formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}