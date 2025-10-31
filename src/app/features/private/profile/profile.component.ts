import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  Apple,
  ArrowLeft
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Botón Volver -->
        <div class="mb-6">
          <a routerLink="/home" class="inline-flex items-center gap-2 text-cambridge-blue hover:text-blue-700 transition-colors">
            <lucide-icon [img]="ArrowLeftIcon" class="w-5 h-5"></lucide-icon>
            <span class="font-semibold">Volver al inicio</span>
          </a>
        </div>

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
                  [src]="currentUser?.avatar || '/defaultProfilePicture.png'" 
                  alt="Avatar"
                  class="w-24 h-24 rounded-full object-cover border-4 border-cambridge-blue shadow-lg"
                  (error)="handleImageError($event)"
                >
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-2">Foto de Perfil</label>
                  <div class="mb-3">
                    <input 
                      type="text" 
                      formControlName="avatar"
                      class="input w-full" 
                      placeholder="URL de la imagen (https://...)"
                    >
                  </div>
                  <p class="text-sm text-slate-gray">
                    💡 Introduce una URL de imagen pública. <br>
                    Ejemplo: <code class="text-xs bg-gray-100 px-2 py-1 rounded">https://i.pravatar.cc/300</code>
                  </p>
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
                  maxlength="500"
                ></textarea>
                <p class="text-sm text-slate-gray mt-1">
                  {{ userForm.get('bio')?.value?.length || 0 }}/500 caracteres
                </p>
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

            <!-- Información de límites -->
            <div class="bg-blue-50 border-l-4 border-cambridge-blue p-4 mb-6">
              <p class="text-sm text-blue-800">
                <strong>Límites máximos:</strong> Calorías: 999,999 kcal | Macros: 9,999.99 g
              </p>
            </div>

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
                    min="0"
                    max="999999"
                  >
                  @if (preferencesForm.get('dailyCaloriesGoal')?.hasError('max')) {
                    <p class="text-error text-sm mt-2">Máximo 999,999 kcal</p>
                  }
                  @if (preferencesForm.get('dailyCaloriesGoal')?.hasError('min')) {
                    <p class="text-error text-sm mt-2">No puede ser negativo</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Proteína diaria (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyProteinGoal"
                    class="input w-full" 
                    placeholder="150"
                    min="0"
                    max="9999.99"
                    step="0.1"
                  >
                  @if (preferencesForm.get('dailyProteinGoal')?.hasError('max')) {
                    <p class="text-error text-sm mt-2">Máximo 9,999.99 g</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Carbohidratos diarios (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyCarbsGoal"
                    class="input w-full" 
                    placeholder="250"
                    min="0"
                    max="9999.99"
                    step="0.1"
                  >
                  @if (preferencesForm.get('dailyCarbsGoal')?.hasError('max')) {
                    <p class="text-error text-sm mt-2">Máximo 9,999.99 g</p>
                  }
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-2">Grasas diarias (g)</label>
                  <input 
                    type="number" 
                    formControlName="dailyFatGoal"
                    class="input w-full" 
                    placeholder="70"
                    min="0"
                    max="9999.99"
                    step="0.1"
                  >
                  @if (preferencesForm.get('dailyFatGoal')?.hasError('max')) {
                    <p class="text-error text-sm mt-2">Máximo 9,999.99 g</p>
                  }
                </div>
              </div>

              <div class="flex justify-end">
                <button 
                  type="submit" 
                  [disabled]="preferencesForm.invalid || isSavingPreferences"
                  [class]="preferencesForm.invalid || isSavingPreferences ? 'btn-disabled' : 'btn-primary'"
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
              <div class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue"></div>
                <p class="text-slate-gray mt-4">Cargando alérgenos...</p>
              </div>
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
  readonly ArrowLeftIcon = ArrowLeft;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', Validators.maxLength(500)],
      avatar: ['']
    });

    this.preferencesForm = this.fb.group({
      dailyCaloriesGoal: [null, [Validators.min(0), Validators.max(999999)]],
      dailyCarbsGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
      dailyProteinGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
      dailyFatGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
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
      this.loadUserAllergens();
    }
  }

  loadUserData(): void {
    if (!this.currentUser) return;

    this.userForm.patchValue({
      username: this.currentUser.username,
      email: this.currentUser.email,
      bio: this.currentUser.bio,
      avatar: this.currentUser.avatar
    });
  }

  handleImageError(event: any): void {
    event.target.src = '/defaultProfilePicture.png';
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

  loadUserAllergens(): void {
    if (!this.currentUser) return;

    this.userService.getUserAllergens(this.currentUser.id).subscribe({
      next: (allergens) => {
        this.userAllergenIds = allergens.map(a => a.id);
      },
      error: (error) => {
        console.error('Error cargando alérgenos del usuario:', error);
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

    const avatarUrl = this.userForm.value.avatar || this.currentUser.avatar || '/defaultProfilePicture.png';

    const userData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      avatar: avatarUrl,
      bio: this.userForm.value.bio,
      roleId: this.currentUser.roleId
    };

    this.userService.updateUser(this.currentUser.id, userData).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Información personal actualizada correctamente';
        this.isSavingUser = false;
        
        // Actualizar usuario en localStorage
        const user = { ...this.currentUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
        
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = this.extractErrorMessage(error);
        console.error('Error:', error);
        this.isSavingUser = false;
      }
    });
  }

  savePreferences(): void {
    if (this.preferencesForm.invalid || !this.currentUser) {
      this.errorMessage = 'Por favor verifica que todos los valores estén dentro de los límites permitidos';
      return;
    }

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
        this.successMessage = 'Preferencias nutricionales actualizadas correctamente';
        this.isSavingPreferences = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = this.extractErrorMessage(error);
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
    if (!this.currentUser) return;

    this.isSavingAllergens = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.saveUserAllergens(this.currentUser.id, this.userAllergenIds).subscribe({
      next: () => {
        this.successMessage = 'Alergias actualizadas correctamente';
        this.isSavingAllergens = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = this.extractErrorMessage(error);
        console.error('Error:', error);
        this.isSavingAllergens = false;
      }
    });
  }

  // ✅ MÉTODO PARA EXTRAER MENSAJES DE ERROR CLAROS
  private extractErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (typeof error.error === 'string') {
      // Buscar mensajes de validación del backend
      if (error.error.includes('no pueden exceder')) {
        return error.error;
      }
      if (error.error.includes('numeric field overflow')) {
        return 'Uno o más valores exceden el máximo permitido. Calorías máx: 999,999 | Macros máx: 9,999.99 g';
      }
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
  }
}