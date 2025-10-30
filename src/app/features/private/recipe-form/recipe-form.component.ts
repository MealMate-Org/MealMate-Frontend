import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { AuthService } from '../../../core/services/auth.service';
import { Allergen } from '../../../models/recipe.model';
import { 
  LucideAngularModule,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  AlertTriangle,
  ChefHat
} from 'lucide-angular';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="mb-8">
          <h1 class="mb-3 text-5xl">{{ isEditMode ? 'Editar Receta' : 'Nueva Receta' }}</h1>
          <p class="text-slate-gray text-xl">Completa los campos para {{ isEditMode ? 'actualizar' : 'crear' }} tu receta</p>
        </div>

        @if (errorMessage) {
          <div class="bg-red-50 border-2 border-error rounded-3xl p-6 mb-8">
            <div class="flex items-center gap-3">
              <lucide-icon [img]="AlertIcon" class="w-6 h-6 text-error"></lucide-icon>
              <p class="text-error font-semibold">{{ errorMessage }}</p>
            </div>
          </div>
        }

        <form [formGroup]="recipeForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <!-- Información básica -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <h3 class="mb-6 text-2xl">Información Básica</h3>
            
            <!-- Imagen -->
            <div class="mb-8">
              <label class="block text-sm font-semibold mb-4">Imagen de la Receta</label>
              
              <!-- Preview -->
              <div class="flex items-start gap-6">
                @if (previewImage || recipeForm.value.imagePath) {
                  <div class="relative">
                    <img 
                      [src]="previewImage || recipeForm.value.imagePath" 
                      alt="Preview"
                      class="w-48 h-48 rounded-2xl object-cover border-2 border-cambridge-blue shadow-lg"
                    >
                    <button 
                      type="button"
                      (click)="removeImage()"
                      class="absolute -top-2 -right-2 bg-error text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg"
                    >
                      <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                } @else {
                  <div class="w-48 h-48 rounded-2xl bg-gradient-to-br from-celadon to-cambridge-blue flex items-center justify-center border-2 border-dashed border-cambridge-blue">
                    <lucide-icon [img]="ChefHatIcon" class="w-16 h-16 text-white opacity-50"></lucide-icon>
                  </div>
                }
                
                <div class="flex-1">
                  <label class="btn-secondary cursor-pointer inline-flex items-center gap-2">
                    <lucide-icon [img]="UploadIcon" class="w-5 h-5"></lucide-icon>
                    Seleccionar Imagen
                    <input 
                      type="file" 
                      accept="image/*"
                      (change)="onImageSelected($event)"
                      class="hidden"
                    >
                  </label>
                  @if (selectedImageFile) {
                    <p class="text-sm text-slate-gray mt-2">{{ selectedImageFile.name }}</p>
                  }
                  <p class="text-sm text-slate-gray mt-4">
                    JPG, PNG o GIF. Máximo 5MB. Si no seleccionas una imagen, se usará una imagen predeterminada.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Título *</label>
                <input 
                  type="text" 
                  formControlName="title"
                  class="input w-full" 
                  placeholder="Ej: Pasta Carbonara"
                >
                @if (recipeForm.get('title')?.invalid && recipeForm.get('title')?.touched) {
                  <p class="text-error text-sm mt-2">El título es obligatorio</p>
                }
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Descripción</label>
                <textarea 
                  formControlName="description"
                  class="input w-full" 
                  rows="3" 
                  placeholder="Breve descripción de tu receta..."
                ></textarea>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-2">Tipo de comida</label>
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
                  <label class="block text-sm font-semibold mb-2">Visibilidad *</label>
                  <select formControlName="isPublic" class="input w-full">
                    <option [value]="true">Pública (todos pueden verla)</option>
                    <option [value]="false">Privada (solo yo)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Ingredientes -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl">Ingredientes *</h3>
              <button 
                type="button" 
                (click)="addIngredient()"
                class="btn-primary inline-flex items-center gap-2"
              >
                <lucide-icon [img]="PlusIcon" class="w-5 h-5"></lucide-icon>
                Añadir Ingrediente
              </button>
            </div>

            <div formArrayName="ingredients" class="space-y-4">
              @for (ingredient of ingredients.controls; track $index) {
                <div [formGroupName]="$index" class="flex gap-3 items-start p-4 bg-celadon rounded-2xl">
                  <div class="flex-1">
                    <input 
                      type="text" 
                      formControlName="name"
                      class="input w-full" 
                      placeholder="Ej: Tomate"
                    >
                  </div>
                  <div class="w-28">
                    <input 
                      type="number" 
                      formControlName="quantity"
                      class="input w-full" 
                      placeholder="200"
                      step="0.01"
                    >
                  </div>
                  <div class="w-32">
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
                    class="btn-secondary px-4 inline-flex items-center"
                  >
                    <lucide-icon [img]="TrashIcon" class="w-5 h-5 text-error"></lucide-icon>
                  </button>
                </div>
              }
            </div>

            @if (ingredients.length === 0) {
              <div class="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                <lucide-icon [img]="PlusIcon" class="w-12 h-12 text-slate-gray mx-auto mb-3 opacity-30"></lucide-icon>
                <p class="text-slate-gray">No hay ingredientes. Haz clic en "Añadir Ingrediente" para comenzar.</p>
              </div>
            }
          </div>

          <!-- Instrucciones -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <h3 class="mb-6 text-2xl">Instrucciones *</h3>
            <textarea 
              formControlName="instructions"
              class="input w-full" 
              rows="10" 
              placeholder="Paso 1: Lavar y cortar los ingredientes...&#10;Paso 2: Calentar el aceite en una sartén...&#10;Paso 3: Añadir los ingredientes y cocinar..."
            ></textarea>
            @if (recipeForm.get('instructions')?.invalid && recipeForm.get('instructions')?.touched) {
              <p class="text-error text-sm mt-2">Las instrucciones son obligatorias</p>
            }
          </div>

          <!-- Alérgenos -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-error"></lucide-icon>
              <h3 class="text-2xl">Alérgenos</h3>
            </div>
            <p class="text-slate-gray mb-6 text-lg">
              Marca los alérgenos presentes en esta receta
            </p>
            
            @if (isLoadingAllergens) {
              <div class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue"></div>
                <p class="text-slate-gray mt-4">Cargando alérgenos...</p>
              </div>
            } @else {
              <div class="grid md:grid-cols-3 gap-4">
                @for (allergen of allergens; track allergen.id) {
                  <label class="flex items-center gap-3 cursor-pointer p-4 hover:bg-celadon rounded-xl transition border border-gray-100">
                    <input 
                      type="checkbox"
                      [value]="allergen.id"
                      (change)="onAllergenChange($event, allergen.id)"
                      [checked]="selectedAllergenIds.includes(allergen.id)"
                      class="w-5 h-5"
                    >
                    <span class="font-medium">{{ allergen.name }}</span>
                  </label>
                }
              </div>
            }
          </div>

          <!-- Información nutricional -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <h3 class="mb-4 text-2xl">Información Nutricional</h3>
            <p class="text-slate-gray mb-6 text-lg">
              Valores por porción (opcional)
            </p>
            
            <div class="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Calorías</label>
                <input 
                  type="number" 
                  formControlName="calories"
                  class="input w-full" 
                  placeholder="0"
                  step="0.01"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Proteína (g)</label>
                <input 
                  type="number" 
                  formControlName="protein"
                  class="input w-full" 
                  placeholder="0"
                  step="0.01"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Carbohidratos (g)</label>
                <input 
                  type="number" 
                  formControlName="carbs"
                  class="input w-full" 
                  placeholder="0"
                  step="0.01"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Grasas (g)</label>
                <input 
                  type="number" 
                  formControlName="fat"
                  class="input w-full" 
                  placeholder="0"
                  step="0.01"
                >
              </div>
              <div>
                <label class="block text-sm font-semibold mb-2">Tamaño porción (g)</label>
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
          <div class="flex justify-end gap-4">
            <a routerLink="/recipes/my" class="btn-secondary inline-flex items-center gap-2 px-8">
              <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
              Cancelar
            </a>
            <button 
              type="submit" 
              [disabled]="recipeForm.invalid || isLoading"
              [class]="recipeForm.invalid || isLoading ? 'btn-disabled' : 'btn-primary'"
              class="inline-flex items-center gap-2 px-8"
            >
              @if (isLoading) {
                <span>Guardando...</span>
              } @else {
                <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon>
                <span>{{ isEditMode ? 'Actualizar' : 'Guardar' }} Receta</span>
              }
            </button>
          </div>
        </form>
      </div>
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
  
  selectedImageFile: File | null = null;
  previewImage: string | null = null;

  // Iconos
  readonly SaveIcon = Save;
  readonly XIcon = X;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly UploadIcon = Upload;
  readonly AlertIcon = AlertTriangle;
  readonly ChefHatIcon = ChefHat;

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
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.loadRecipe(this.recipeId);
      } else {
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

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImageFile = null;
    this.previewImage = null;
    this.recipeForm.patchValue({ imagePath: '' });
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

        this.ingredients.clear();
        recipe.ingredients.forEach(ing => {
          const ingredientGroup = this.fb.group({
            name: [ing.name, Validators.required],
            quantity: [ing.quantity, [Validators.required, Validators.min(0)]],
            unit: [ing.unit, Validators.required]
          });
          this.ingredients.push(ingredientGroup);
        });

        this.selectedAllergenIds = recipe.allergens.map(a => a.id);

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
              // No hay info nutricional
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

    // En producción, aquí subirías la imagen a un servidor
    // Por ahora, usamos la URL de preview o la imagen predeterminada
    let imageUrl = this.recipeForm.value.imagePath;
    if (this.previewImage) {
      imageUrl = this.previewImage;
    } else if (!imageUrl) {
      imageUrl = '/defaultRecipeImage.png'; // ✅ Imagen predeterminada
    }

    const recipeData = {
      title: this.recipeForm.value.title,
      description: this.recipeForm.value.description,
      instructions: this.recipeForm.value.instructions,
      imagePath: imageUrl,
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