import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserPreference, Diet } from '../../../models/user.model';
import { Allergen } from '../../../models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';
import { 
  LucideAngularModule,
  Upload,
  Save,
  AlertTriangle,
  Target,
  Apple
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="mb-8 text-5xl">Mi Perfil</h1>

        @if (successMessage) {
          <div class="bg-green-50 border-2 border-success rounded-3xl p-4 mb-6">
            <p class="text-success font-semibold text-center">{{ successMessage }}</p>
          </div>
        }

        @if (errorMessage) {
          <div class="bg-red-50 border-2 border-error rounded-3xl p-4 mb-6">
            <p class="text-error font-semibold text-center">{{ errorMessage }}</p>
          </div>
        }

        <div class="space-y-8">
          <!-- Información Personal -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <h3 class="mb-6 text-2xl">Información Personal</h3>
            
            <form [formGroup]="userForm" (ngSubmit)="saveUserInfo()" class="space-y-6">
              <!-- Avatar -->
              <div class="flex items-center gap-6 mb-6 p-6 bg-celadon rounded-2xl">
                <img 
                  [src]="previewAvatar || currentUser?.avatar || '/defaultProfilePicture.png'" 
                  alt="Avatar"
                  class="w-24 h-24 rounded-full object-cover border-4 border-cambridge-blue shadow-lg"
                >
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-2">Foto de Perfil</label>
                  <div class="flex items-center gap-3">
                    <label class="btn-secondary cursor-pointer inline-flex items-center gap-2">
                      <lucide-icon [img]="UploadIcon" class="w-5 h-5"></lucide-icon>
                      Seleccionar Imagen
                      <input 
                        type="file" 
                        accept="image/*"
                        (change)="onFileSelected($event)"
                        class="hidden"
                      >
                    </label>
                    @if (selectedFile) {
                      <span class="text-sm text-slate-gray">{{ selectedFile.name }}</span>
                    }
                  </div>
                  <p class="text-sm text-slate-gray mt-2">JPG, PNG o GIF. Máximo 5MB.</p>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-2">Nombre de usuario *</label>
                  <input 
                    type="text" 
                    formControlName="username"
                    class="input w-full" 
                    placeholder="tu_usuario"
                  >
                  @if (userForm.get('username')?.invalid && userForm.get('username')?.touched) {
                    <p class="text-error text-sm mt-2">El nombre de usuario es obligatorio</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Email *</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    class="input w-full" 
                    placeholder="tu@email.com"
                  >
                  @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
                    <p class="text-error text-sm mt-2">Email inválido</p>
                  }
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold mb-2">Biografía</label>
                <textarea 
                  formControlName="bio"
                  class="input w-full" 
                  rows="3"
                  placeholder="Cuéntanos sobre ti..."
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button 
                  type="submit" 
                  [disabled]="userForm.invalid || isSavingUser"
                  [class]="userForm.invalid || isSavingUser ? 'btn-disabled' : 'btn-primary'"
                  class="inline-flex items-center gap-2"
                >
                  <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon>
                  {{ isSavingUser ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Preferencias Nutricionales -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <lucide-icon [img]="AppleIcon" class="w-8 h-8 text-success"></lucide-icon>
              <h3 class="text-2xl">Preferencias Nutricionales</h3>
            </div>
            <p class="text-slate-gray mb-6 text-lg">
              Configura tus objetivos diarios para seguimiento nutricional
            </p>

            <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold mb-2">Dieta</label>
                <select formControlName="dietId" class="input w-full">
                  <option [value]="null">Seleccionar...</option>
                  @for (diet of diets; track diet.id) {
                    <option [value]="diet.id">{{ diet.name }}</option>
                  }
                </select>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-2">Calorías diarias (kcal)</label>
                  <input 
                    type="number" 
                    formControlName="dailyCaloriesGoal"
                    class="input w-full" 
                    placeholder="2000"
                  >
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Proteína diaria (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyProteinGoal"
                    class="input w-full" 
                    placeholder="150"
                    step="0.1"
                  >
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Carbohidratos diarios (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyCarbsGoal"
                    class="input w-full" 
                    placeholder="250"
                    step="0.1"
                  >
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Grasas diarias (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyFatGoal"
                    class="input w-full" 
                    placeholder="70"
                    step="0.1"
                  >
                </div>
              </div>

              <div class="flex justify-end">
                <button 
                  type="submit" 
                  [disabled]="isSavingPreferences"
                  [class]="isSavingPreferences ? 'btn-disabled' : 'btn-primary'"
                  class="inline-flex items-center gap-2"
                >
                  <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon>
                  {{ isSavingPreferences ? 'Guardando...' : 'Guardar Preferencias' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Alergias e Intolerancias -->
          <div class="bg-white rounded-3xl shadow-xl p-8">
            <div class="flex items-center gap-3 mb-6">
              <lucide-icon [img]="AlertIcon" class="w-8 h-8 text-error"></lucide-icon>
              <h3 class="text-2xl">Alergias e Intolerancias</h3>
            </div>
            <p class="text-slate-gray mb-6 text-lg">
              Marca tus alergias para recibir alertas en recetas incompatibles
            </p>

            @if (isLoadingAllergens) {
              <p class="text-slate-gray">Cargando alérgenos...</p>
            } @else {
              <div class="grid md:grid-cols-3 gap-4 mb-6">
                @for (allergen of allergens; track allergen.id) {
                  <label class="flex items-center gap-3 cursor-pointer p-4 hover:bg-celadon rounded-xl transition border border-gray-100">
                    <input 
                      type="checkbox"
                      [value]="allergen.id"
                      (change)="onAllergenChange($event, allergen.id)"
                      [checked]="userAllergenIds.includes(allergen.id)"
                      class="w-5 h-5"
                    >
                    <span class="font-medium">{{ allergen.name }}</span>
                  </label>
                }
              </div>

              <div class="flex justify-end">
                <button 
                  (click)="saveAllergens()"
                  [disabled]="isSavingAllergens"
                  [class]="isSavingAllergens ? 'btn-disabled' : 'btn-primary'"
                  class="inline-flex items-center gap-2"
                >
                  <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon>
                  {{ isSavingAllergens ? 'Guardando...' : 'Guardar Alergias' }}
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  preferencesForm: FormGroup;
  currentUser: User | null = null;
  diets: Diet[] = [];
  allergens: Allergen[] = [];
  userAllergenIds: number[] = [];
  
  selectedFile: File | null = null;
  previewAvatar: string | null = null;
  
  isSavingUser = false;
  isSavingPreferences = false;
  isSavingAllergens = false;
  isLoadingAllergens = false;
  
  successMessage = '';
  errorMessage = '';

  // Iconos
  readonly UploadIcon = Upload;
  readonly SaveIcon = Save;
  readonly AlertIcon = AlertTriangle;
  readonly TargetIcon = Target;
  readonly AppleIcon = Apple;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['']
    });

    this.preferencesForm = this.fb.group({
      dailyCaloriesGoal: [null],
      dailyCarbsGoal: [null],
      dailyProteinGoal: [null],
      dailyFatGoal: [null],
      dietId: [null]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadUserData();
      this.loadDiets();
      this.loadAllergens();
      this.loadPreferences();
    }
  }

  loadUserData(): void {
    if (!this.currentUser) return;

    this.userForm.patchValue({
      username: this.currentUser.username,
      email: this.currentUser.email,
      bio: this.currentUser.bio
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewAvatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadDiets(): void {
    this.userService.getAllDiets().subscribe({
      next: (diets) => {
        this.diets = diets;
      },
      error: (error) => {
        console.error('Error cargando dietas:', error);
      }
    });
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

  loadPreferences(): void {
    if (!this.currentUser) return;

    this.userService.getUserPreferences(this.currentUser.id).subscribe({
      next: (preferences) => {
        this.preferencesForm.patchValue({
          dailyCaloriesGoal: preferences.dailyCaloriesGoal,
          dailyCarbsGoal: preferences.dailyCarbsGoal,
          dailyProteinGoal: preferences.dailyProteinGoal,
          dailyFatGoal: preferences.dailyFatGoal,
          dietId: preferences.dietId
        });
      },
      error: () => {
        // No hay preferencias guardadas
      }
    });
  }

  saveUserInfo(): void {
    if (this.userForm.invalid || !this.currentUser) return;

    this.isSavingUser = true;
    this.errorMessage = '';
    this.successMessage = '';

    // En producción, aquí subirías la imagen a un servidor
    // Por ahora, usamos la URL de preview o la imagen actual
    const avatarUrl = this.previewAvatar || this.currentUser.avatar || '/defaultProfilePicture.png';

    const userData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      avatar: avatarUrl,
      bio: this.userForm.value.bio,
      roleId: this.currentUser.roleId
    };

    this.userService.updateUser(this.currentUser.id, userData).subscribe({
      next: () => {
        this.successMessage = 'Información personal actualizada';
        this.isSavingUser = false;
        
        // Actualizar usuario en localStorage
        const updatedUser = { ...this.currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar información personal';
        console.error('Error:', error);
        this.isSavingUser = false;
      }
    });
  }

  savePreferences(): void {
    if (!this.currentUser) return;

    this.isSavingPreferences = true;
    this.errorMessage = '';
    this.successMessage = '';

    const preferences: UserPreference = {
      userId: this.currentUser.id,
      dailyCaloriesGoal: this.preferencesForm.value.dailyCaloriesGoal,
      dailyCarbsGoal: this.preferencesForm.value.dailyCarbsGoal,
      dailyProteinGoal: this.preferencesForm.value.dailyProteinGoal,
      dailyFatGoal: this.preferencesForm.value.dailyFatGoal,
      dietId: this.preferencesForm.value.dietId
    };

    this.userService.saveUserPreferences(preferences).subscribe({
      next: () => {
        this.successMessage = 'Preferencias nutricionales actualizadas';
        this.isSavingPreferences = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar preferencias';
        console.error('Error:', error);
        this.isSavingPreferences = false;
      }
    });
  }

  onAllergenChange(event: any, allergenId: number): void {
    if (event.target.checked) {
      if (!this.userAllergenIds.includes(allergenId)) {
        this.userAllergenIds.push(allergenId);
      }
    } else {
      const index = this.userAllergenIds.indexOf(allergenId);
      if (index > -1) {
        this.userAllergenIds.splice(index, 1);
      }
    }
  }

  saveAllergens(): void {
    // TODO: Implementar guardado de alérgenos del usuario
    this.isSavingAllergens = true;
    this.successMessage = 'Alergias actualizadas';
    this.isSavingAllergens = false;
    setTimeout(() => this.successMessage = '', 3000);
  }
}