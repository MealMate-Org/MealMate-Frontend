import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserPreference, Diet } from '../../../models/user.model';
import { Allergen } from '../../../models/recipe.model';
import { RecipeService } from '../../../core/services/recipe.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="mb-6">Mi Perfil</h1>

      @if (successMessage) {
        <div class="badge-success mb-4 p-3 w-full">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div class="badge-error mb-4 p-3 w-full">
          {{ errorMessage }}
        </div>
      }

      <div class="space-y-6">
        <!-- Información Personal -->
        <div class="card">
          <h3 class="mb-4">Información Personal</h3>
          
          <form [formGroup]="userForm" (ngSubmit)="saveUserInfo()" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Nombre de usuario *</label>
                <input 
                  type="text" 
                  formControlName="username"
                  class="input w-full" 
                  placeholder="tu_usuario"
                >
                @if (userForm.get('username')?.invalid && userForm.get('username')?.touched) {
                  <p class="text-error text-sm mt-1">El nombre de usuario es obligatorio</p>
                }
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Email *</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="input w-full" 
                  placeholder="tu@email.com"
                >
                @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
                  <p class="text-error text-sm mt-1">Email inválido</p>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">URL del Avatar</label>
              <input 
                type="text" 
                formControlName="avatar"
                class="input w-full" 
                placeholder="https://ejemplo.com/avatar.jpg"
              >
              @if (userForm.value.avatar) {
                <div class="mt-2">
                  <img 
                    [src]="userForm.value.avatar" 
                    alt="Preview"
                    class="w-20 h-20 rounded-full object-cover border-2 border-cambridge-blue"
                    (error)="onImageError($event)"
                  >
                </div>
              }
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Bio</label>
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
              >
                {{ isSavingUser ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Preferencias Nutricionales -->
        <div class="card">
          <h3 class="mb-4">Preferencias Nutricionales</h3>
          <p class="text-sm text-slate-gray mb-4">
            Configura tus objetivos diarios para seguimiento nutricional
          </p>

          <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Dieta</label>
              <select formControlName="dietId" class="input w-full">
                <option [value]="null">Seleccionar...</option>
                @for (diet of diets; track diet.id) {
                  <option [value]="diet.id">{{ diet.name }}</option>
                }
              </select>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Calorías diarias (kcal)</label>
                <input 
                  type="number" 
                  formControlName="dailyCaloriesGoal"
                  class="input w-full" 
                  placeholder="2000"
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Proteína diaria (g)</label>
                <input 
                  type="number" 
                  formControlName="dailyProteinGoal"
                  class="input w-full" 
                  placeholder="150"
                  step="0.1"
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Carbohidratos diarios (g)</label>
                <input 
                  type="number" 
                  formControlName="dailyCarbsGoal"
                  class="input w-full" 
                  placeholder="250"
                  step="0.1"
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">Grasas diarias (g)</label>
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
              >
                {{ isSavingPreferences ? 'Guardando...' : 'Guardar Preferencias' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Alergias e Intolerancias -->
        <div class="card">
          <h3 class="mb-4">Alergias e Intolerancias</h3>
          <p class="text-sm text-slate-gray mb-4">
            Marca tus alergias para recibir alertas en recetas incompatibles
          </p>

          @if (isLoadingAllergens) {
            <p class="text-slate-gray">Cargando alérgenos...</p>
          } @else {
            <div class="grid md:grid-cols-3 gap-3 mb-4">
              @for (allergen of allergens; track allergen.id) {
                <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-celadon rounded transition">
                  <input 
                    type="checkbox"
                    [value]="allergen.id"
                    (change)="onAllergenChange($event, allergen.id)"
                    [checked]="userAllergenIds.includes(allergen.id)"
                    class="w-4 h-4"
                  >
                  <span>{{ allergen.name }}</span>
                </label>
              }
            </div>

            <div class="flex justify-end">
              <button 
                (click)="saveAllergens()"
                [disabled]="isSavingAllergens"
                [class]="isSavingAllergens ? 'btn-disabled' : 'btn-primary'"
              >
                {{ isSavingAllergens ? 'Guardando...' : 'Guardar Alergias' }}
              </button>
            </div>
          }
        </div>

        <!-- Zona de peligro -->
        <div class="card border-2 border-error">
          <h3 class="mb-3 text-error">Zona de Peligro</h3>
          <p class="text-sm text-slate-gray mb-4">
            Estas acciones son permanentes y no se pueden deshacer
          </p>
          <div class="space-y-2">
            <button 
              (click)="showChangePassword = !showChangePassword"
              class="btn-secondary w-full md:w-auto"
            >
              🔒 Cambiar Contraseña
            </button>
            
            @if (showChangePassword) {
              <div class="mt-4 p-4 bg-celadon rounded">
                <p class="text-sm mb-3">Función de cambio de contraseña en desarrollo</p>
                <button 
                  (click)="showChangePassword = false"
                  class="btn-secondary text-sm"
                >
                  Cerrar
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
  showChangePassword = false;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: [''],
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
      avatar: this.currentUser.avatar,
      bio: this.currentUser.bio
    });
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

    const userData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      avatar: this.userForm.value.avatar,
      bio: this.userForm.value.bio,
      roleId: this.currentUser.roleId
    };

    this.userService.updateUser(this.currentUser.id, userData).subscribe({
      next: () => {
        this.successMessage = '¡Información personal actualizada!';
        this.isSavingUser = false;
        
        // Actualizar usuario en localStorage
        const updatedUser = { ...this.currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
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
        this.successMessage = '¡Preferencias nutricionales actualizadas!';
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
    this.successMessage = '¡Alergias actualizadas!';
    this.isSavingAllergens = false;
    setTimeout(() => this.successMessage = '', 3000);
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/80?text=Avatar';
  }
}
