import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../models/recipe.model';
import { 
  LucideAngularModule,
  Star,
  Edit,
  Trash2,
  Globe,
  Lock,
  ChefHat,
  AlertTriangle,
  Heart
} from 'lucide-angular';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100 relative">
      
      <!-- Enlace que cubre toda la card -->
      <a
        [routerLink]="['/recipes', recipe.id]"
        class="absolute inset-0 z-10"
      ></a>
      
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
        
        <!-- Badge de visibilidad (solo si se solicita) -->
        @if (showVisibilityBadge) {
          <div class="absolute top-3 left-3 z-20">
            <span 
              [class]="recipe.isPublic ? 'bg-cambridge-blue text-white' : 'bg-slate-gray text-white'"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            >
              <lucide-icon [img]="recipe.isPublic ? GlobeIcon : LockIcon" class="w-3 h-3"></lucide-icon>
              {{ recipe.isPublic ? 'Pública' : 'Privada' }}
            </span>
          </div>
        }

        <!-- Botones de acción (editar/eliminar o favorito) -->
        @if (showActionButtons && (showEditDelete || showFavorite)) {
          <div class="absolute top-3 right-3 z-20 flex gap-2" 
               [class.opacity-0]="showEditDelete" 
               [class.group-hover:opacity-100]="showEditDelete"
               [class.transition-opacity]="showEditDelete"
               [class.duration-300]="showEditDelete">
            @if (showEditDelete) {
              <button
                (click)="onEdit.emit(recipe.id); $event.stopPropagation()"
                class="bg-white/90 hover:bg-white text-dark-purple p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                title="Editar receta"
              >
                <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
              </button>
              <button
                (click)="onDelete.emit(recipe); $event.stopPropagation()"
                class="bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                title="Eliminar receta"
              >
                <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
              </button>
            }
            @if (showFavorite) {
              <button 
                (click)="onRemoveFavorite.emit(recipe); $event.preventDefault(); $event.stopPropagation()"
                class="bg-white/90 hover:bg-white text-error p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                title="Quitar de favoritos"
              >
                <lucide-icon [img]="HeartIcon" class="w-4 h-4 fill-current"></lucide-icon>
              </button>
            }
          </div>
        }
      </div>

      <div class="p-5 relative z-0">
        <!-- Título y rating -->
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg group-hover:text-cambridge-blue transition-colors flex-1">
            {{ recipe.title }}
          </h3>
          <div class="flex items-center gap-1">
            <lucide-icon [img]="StarIcon" class="w-4 h-4 text-yellow-500 fill-current"></lucide-icon>
            <span class="font-semibold text-base">{{ recipe.avgRating.toFixed(1) }}</span>
            <span class="text-slate-gray text-xs">({{ recipe.ratingCount }})</span>
          </div>
        </div>

        <p class="text-slate-gray mb-3 line-clamp-2 text-sm">
          {{ recipe.description || 'Sin descripción disponible' }}
        </p>

        <!-- Autor (si se solicita) -->
        @if (showAuthor && authorName) {
          <div class="mb-3">
            <span class="text-slate-gray text-xs">
              Por {{ authorName }}
            </span>
          </div>
        }

        <!-- Tipo de comida -->
        @if (recipe.mealTypeId) {
          <div class="mb-3">
            <span class="bg-cambridge-blue text-white px-2 py-1 rounded-full text-xs font-medium">
              {{ getMealTypeName(recipe.mealTypeId) }}
            </span>
          </div>
        }

        <!-- Alérgenos -->
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
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Input() showVisibilityBadge = false;
  @Input() showActionButtons = false;
  @Input() showEditDelete = false;
  @Input() showFavorite = false;
  @Input() showAuthor = false;
  @Input() authorName = '';
  
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<Recipe>();
  @Output() onRemoveFavorite = new EventEmitter<Recipe>();

  readonly StarIcon = Star;
  readonly EditIcon = Edit;
  readonly TrashIcon = Trash2;
  readonly GlobeIcon = Globe;
  readonly LockIcon = Lock;
  readonly ChefHatIcon = ChefHat;
  readonly AlertIcon = AlertTriangle;
  readonly HeartIcon = Heart;

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
