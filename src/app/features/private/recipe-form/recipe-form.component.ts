import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Allergen } from '../../../models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1>{{ isEditMode ? 'Editar Receta' : 'Nueva Receta' }}</h1>
        <p class="text-slate-gray">Completa los campos para {{ isEditMode ? 'actualizar' : 'crear' }} tu receta</p>
      </div>

      @if (errorMessage) {
        <div class="badge-error mb-4 p-3 w-full">
          {{ errorMessage }}
        </div>
      }

      <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Información básica -->
        <div class="card">
          <h3 class="mb-4">Información Básica</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Título *</label>
              <input 
                type="text" 
                formControlName="title"
                class="input w-full" 
                placeholder="Ej: Pasta Carbonara"
              >
              @if (recipeForm.get('title')?.invalid && recipeForm.get('title')?.touched) {
                <p class="text-error text-sm mt-1">El título es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Descripción</label>
              <textarea 
                formControlName="description"
                class="input w-full" 
                rows="3" 
                placeholder="Breve descripción de tu receta..."
              ></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Tipo de comida</label>
                <select formControlName="mealTypeId" class="input w-full">
                  <option [value]="null">Seleccionar...</option>
                  <option [value]="1">Desayuno</option>
                  <option [value]="2">Comida</option>
                  <option [value]="3">Cena</option>
                  <option [value]="4">Aperitivo</option>
                  <option [value]="5">Merienda</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Visibilidad *</label>
                <select formControlName="isPublic" class="input w-full">
                  <option [value]="true">Pública (todos pueden verla)</option>
                  <option [value]="false">Privada (solo yo)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Imagen URL (opcional)</label>
              <input 
                type="text" 
                formControlName="imagePath"
                class="input w-full" 
                placeholder="https://ejemplo.com/imagen.jpg"
              >
              <p class="text-sm text-slate-gray mt-1">URL de la imagen de tu receta</p>
            </div>
          </div>
        </div>

        <!-- Ingredientes -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3>Ingredientes *</h3>
            <button 
              type="button" 
              (click)="addIngredient()"
              class="btn-secondary text-sm"
            >
              + Añadir Ingrediente
            </button>
          </div>

          <div formArrayName="ingredients" class="space-y-3">
            @for (ingredient of ingredients.controls; track $index) {
              <div [formGroupName]="$index" class="flex gap-2 items-start">
                <div class="flex-1">
                  <input 
                    type="text" 
                    formControlName="name"
                    class="input w-full" 
                    placeholder="Ej: Tomate"
                  >
                </div>
                <div class="w-24">
                  <input 
                    type="number" 
                    formControlName="quantity"
                    class="input w-full" 
                    placeholder="200"
                    step="0.01"
                  >
                </div>
                <div class="w-24">
                  <select formControlName="unit" class="input w-full">
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="unidades">unidades</option>
                    <option value="cucharadas">cucharadas</option>
                    <option value="tazas">tazas</option>
                  </select>
                </div>
                <button 
                  type="button"
                  (click)="removeIngredient($index)"
                  class="btn-secondary text-sm px-3"
                >
                  🗑️
                </button>
              </div>
            }
          </div>

          @if (ingredients.length === 0) {
            <p class="text-slate-gray text-sm text-center py-4">
              No hay ingredientes. Haz clic en "Añadir Ingrediente" para comenzar.
            </p>
          }
        </div>

        <!-- Instrucciones -->
        <div class="card">
          <h3 class="mb-4">Instrucciones *</h3>
          <textarea 
            formControlName="instructions"
            class="input w-full" 
            rows="8" 
            placeholder="Paso 1: ...&#10;Paso 2: ...&#10;Paso 3: ..."
          ></textarea>
          @if (recipeForm.get('instructions')?.invalid && recipeForm.get('instructions')?.touched) {
            <p class="text-error text-sm mt-1">Las instrucciones son obligatorias</p>
          }
        </div>

        <!-- Alérgenos -->
        <div class="card">
          <h3 class="mb-4">Alérgenos</h3>
          <p class="text-sm text-slate-gray mb-3">
            Marca los alérgenos presentes en esta receta
          </p>
          
          @if (isLoadingAllergens) {
            <p class="text-slate-gray">Cargando alérgenos...</p>
          } @else {
            <div class="grid md:grid-cols-3 gap-3">
              @for (allergen of allergens; track allergen.id) {
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    [value]="allergen.id"
                    (change)="onAllergenChange($event, allergen.id)"
                    [checked]="selectedAllergenIds.includes(allergen.id)"
                    class="w-4 h-4"
                  >
                  <span>{{ allergen.name }}</span>
                </label>
              }
            </div>
          }
        </div>

        <!-- Información nutricional -->
        <div class="card">
          <h3 class="mb-4">Información Nutricional (Opcional)</h3>
          <p class="text-sm text-slate-gray mb-4">
            Valores por porción
          </p>
          
          <div class="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium mb-2">Calorías</label>
              <input 
                type="number" 
                formControlName="calories"
                class="input w-full" 
                placeholder="0"
                step="0.01"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Proteína (g)</label>
              <input 
                type="number" 
                formControlName="protein"
                class="input w-full" 
                placeholder="0"
                step="0.01"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Carbohidratos (g)</label>
              <input 
                type="number" 
                formControlName="carbs"
                class="input w-full" 
                placeholder="0"
                step="0.01"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Grasas (g)</label>
              <input 
                type="number" 
                formControlName="fat"
                class="input w-full" 
                placeholder="0"
                step="0.01"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Tamaño porción (g)</label>
              <input 
                type="number" 
                formControlName="portionSize"
                class="input w-full" 
                placeholder="0"
                step="0.01"
              >
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3">
          <a routerLink="/recipes/my" class="btn-secondary">Cancelar</a>
          <button 
            type="submit" 
            [disabled]="recipeForm.invalid || isLoading"
            [class]="recipeForm.invalid || isLoading ? 'btn-disabled' : 'btn-primary'"
          >
            @if (isLoading) {
              <span>Guardando...</span>
            } @else {
              <span>{{ isEditMode ? 'Actualizar' : 'Guardar' }} Receta</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditMode = false;
  recipeId: number | null = null;
  isLoading = false;
  isLoadingAllergens = false;
  errorMessage = '';
  allergens: Allergen[] = [];
  selectedAllergenIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      instructions: ['', Validators.required],
      imagePath: [''],
      isPublic: [true, Validators.required],
      mealTypeId: [null],
      ingredients: this.fb.array([]),
      calories: [null],
      protein: [null],
      carbs: [null],
      fat: [null],
      portionSize: [null]
    });
  }

  ngOnInit(): void {
    this.loadAllergens();
    
    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.loadRecipe(this.recipeId);
      } else {
        // Añadir un ingrediente vacío por defecto
        this.addIngredient();
      }
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      unit: ['g', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  loadAllergens(): void {
    this.isLoadingAllergens = true;
    this.recipeService.getAllAllergens().subscribe({
      next: (allergens) => {
        this.allergens = allergens;
        this.isLoadingAllergens = false;
      },
      error: (error) => {
        console.error('Error cargando alérgenos:', error);
        this.isLoadingAllergens = false;
      }
    });
  }

  onAllergenChange(event: any, allergenId: number): void {
    if (event.target.checked) {
      if (!this.selectedAllergenIds.includes(allergenId)) {
        this.selectedAllergenIds.push(allergenId);
      }
    } else {
      const index = this.selectedAllergenIds.indexOf(allergenId);
      if (index > -1) {
        this.selectedAllergenIds.splice(index, 1);
      }
    }
  }

  loadRecipe(id: number): void {
    this.isLoading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          imagePath: recipe.imagePath,
          isPublic: recipe.isPublic,
          mealTypeId: recipe.mealTypeId
        });

        // Cargar ingredientes
        this.ingredients.clear();
        recipe.ingredients.forEach(ing => {
          const ingredientGroup = this.fb.group({
            name: [ing.name, Validators.required],
            quantity: [ing.quantity, [Validators.required, Validators.min(0)]],
            unit: [ing.unit, Validators.required]
          });
          this.ingredients.push(ingredientGroup);
        });

        // Cargar alérgenos seleccionados
        this.selectedAllergenIds = recipe.allergens.map(a => a.id);

        // Cargar info nutricional si existe
        if (recipe.id) {
          this.recipeService.getNutritionInfo(recipe.id).subscribe({
            next: (nutrition) => {
              this.recipeForm.patchValue({
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat,
                portionSize: nutrition.portionSize
              });
            },
            error: () => {
              // No hay info nutricional, no pasa nada
            }
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la receta';
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.recipeForm.invalid || this.ingredients.length === 0) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios y añade al menos un ingrediente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Debes iniciar sesión';
      this.isLoading = false;
      return;
    }

    const recipeData = {
      title: this.recipeForm.value.title,
      description: this.recipeForm.value.description,
      instructions: this.recipeForm.value.instructions,
      imagePath: this.recipeForm.value.imagePath,
      authorId: currentUser.id,
      isPublic: this.recipeForm.value.isPublic,
      mealTypeId: this.recipeForm.value.mealTypeId,
      ingredients: this.ingredients.value,
      allergenIds: this.selectedAllergenIds
    };

    const request = this.isEditMode && this.recipeId
      ? this.recipeService.updateRecipe(this.recipeId, recipeData)
      : this.recipeService.createRecipe(recipeData);

    request.subscribe({
      next: (recipe) => {
        // Guardar info nutricional si se proporcionó
        const hasNutrition = this.recipeForm.value.calories || 
                            this.recipeForm.value.protein || 
                            this.recipeForm.value.carbs || 
                            this.recipeForm.value.fat;

        if (hasNutrition && recipe.id) {
          const nutritionData = {
            recipeId: recipe.id,
            calories: this.recipeForm.value.calories || 0,
            protein: this.recipeForm.value.protein || 0,
            carbs: this.recipeForm.value.carbs || 0,
            fat: this.recipeForm.value.fat || 0,
            portionSize: this.recipeForm.value.portionSize || 0
          };

          this.recipeService.saveNutritionInfo(nutritionData).subscribe({
            next: () => {
              this.router.navigate(['/recipes/my']);
            },
            error: (error) => {
              console.error('Error guardando info nutricional:', error);
              // Aún así redirigir, la receta se guardó
              this.router.navigate(['/recipes/my']);
            }
          });
        } else {
          this.router.navigate(['/recipes/my']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al guardar la receta. Inténtalo de nuevo.';
        console.error('Error:', error);
      }
    });
  }
}
