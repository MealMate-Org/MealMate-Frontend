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
  ArrowLeft,
  Calculator,
  Info
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-12">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Botón Volver MODIFICADO -->
        <div class="mb-6">
          <button 
            (click)="goBackToProfile()"
            class="inline-flex items-center gap-2 text-cambridge-blue hover:text-blue-700 transition-colors cursor-pointer"
          >
            <lucide-icon [img]="ArrowLeftIcon" class="w-5 h-5"></lucide-icon>
            <span class="font-semibold">Volver al perfil</span>
          </button>
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

            <form [formGroup]="preferencesForm" (ngSubmit)="savePreferences()" class="space-y-6">
              <!-- Selector de modo: Manual vs Automático -->
              <div class="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <div class="flex items-start gap-3 mb-4">
                  <lucide-icon [img]="CalculatorIcon" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"></lucide-icon>
                  <div class="flex-1">
                    <h4 class="font-bold text-dark-purple mb-2">Modo de Cálculo</h4>
                    <div class="space-y-3">
                      <label class="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          [value]="false"
                          formControlName="useAutomaticCalculation"
                          class="mt-1"
                        >
                        <div>
                          <span class="font-medium text-dark-purple">Manual</span>
                          <p class="text-sm text-slate-gray">Introduce tus objetivos manualmente</p>
                        </div>
                      </label>
                      
                      <label class="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          [value]="true"
                          formControlName="useAutomaticCalculation"
                          class="mt-1"
                        >
                        <div>
                          <span class="font-medium text-dark-purple">Automático</span>
                          <p class="text-sm text-slate-gray">Calcula automáticamente basado en tus datos</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Campos para cálculo automático -->
              @if (preferencesForm.get('useAutomaticCalculation')?.value) {
                <div class="bg-gradient-to-br from-celadon to-cambridge-blue bg-opacity-10 border-2 border-cambridge-blue rounded-2xl p-6 space-y-4">
                  <h4 class="font-bold text-dark-purple mb-4">Datos para Cálculo Automático</h4>
                  
                  <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <div class="flex gap-2">
                      <lucide-icon [img]="InfoIcon" class="w-5 h-5 text-yellow-600 flex-shrink-0"></lucide-icon>
                      <p class="text-sm text-yellow-800">
                        <strong>Nota importante:</strong> Los valores calculados son orientativos y se basan en fórmulas estándar. 
                        Esta información no sustituye el consejo de un nutricionista profesional.
                      </p>
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold mb-2">Género *</label>
                      <select formControlName="gender" class="input w-full">
                        <option value="">Seleccionar...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold mb-2">Edad *</label>
                      <input 
                        type="number" 
                        formControlName="age"
                        class="input w-full" 
                        placeholder="25"
                        min="15"
                        max="100"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-semibold mb-2">Peso (kg) *</label>
                      <input 
                        type="number" 
                        formControlName="weight"
                        class="input w-full" 
                        placeholder="70"
                        min="30"
                        max="300"
                        step="0.1"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-semibold mb-2">Altura (cm) *</label>
                      <input 
                        type="number" 
                        formControlName="height"
                        class="input w-full" 
                        placeholder="170"
                        min="100"
                        max="250"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-semibold mb-2">Nivel de Actividad *</label>
                      <select formControlName="activityLevel" class="input w-full">
                        <option value="">Seleccionar...</option>
                        <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                        <option value="light">Ligero (1-3 días/semana)</option>
                        <option value="moderate">Moderado (3-5 días/semana)</option>
                        <option value="active">Activo (6-7 días/semana)</option>
                        <option value="very_active">Muy activo (ejercicio intenso diario)</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold mb-2">Objetivo *</label>
                      <select formControlName="goal" class="input w-full">
                        <option value="">Seleccionar...</option>
                        <option value="deficit">Déficit (perder peso)</option>
                        <option value="maintenance">Mantenimiento</option>
                        <option value="surplus">Superávit (ganar peso)</option>
                      </select>
                    </div>
                  </div>

                  @if (showAutomaticPreview) {
                    <div class="mt-6 p-4 bg-white rounded-xl border-2 border-success">
                      <h5 class="font-bold text-dark-purple mb-3">Vista Previa del Cálculo:</h5>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div class="text-center">
                          <div class="text-2xl font-bold text-cambridge-blue">{{ calculatedMacros.calories }}</div>
                          <div class="text-xs text-slate-gray">kcal/día</div>
                        </div>
                        <div class="text-center">
                          <div class="text-2xl font-bold text-success">{{ calculatedMacros.protein }}g</div>
                          <div class="text-xs text-slate-gray">Proteína</div>
                        </div>
                        <div class="text-center">
                          <div class="text-2xl font-bold text-yellow-500">{{ calculatedMacros.carbs }}g</div>
                          <div class="text-xs text-slate-gray">Carbohidratos</div>
                        </div>
                        <div class="text-center">
                          <div class="text-2xl font-bold text-purple-500">{{ calculatedMacros.fat }}g</div>
                          <div class="text-xs text-slate-gray">Grasas</div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Campos manuales -->
              @if (!preferencesForm.get('useAutomaticCalculation')?.value) {
                <div class="space-y-4">

                  <div class="bg-blue-50 border-l-4 border-cambridge-blue p-4 mb-4">
                    <p class="text-sm text-blue-800">
                      <strong>Límites máximos:</strong> Calorías: 999,999 kcal | Macros: 9,999.99 g
                    </p>
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
                    </div>
                  </div>
                </div>
              }

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
                  [disabled]="isSavingAllergens || !hasAllergensChanged()"
                  [class]="isSavingAllergens || !hasAllergensChanged() ? 'btn-disabled' : 'btn-primary'"
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
  originalUserAllergenIds: number[] = []; // Para trackear cambios
  
  isSavingUser = false;
  isSavingPreferences = false;
  isSavingAllergens = false;
  isLoadingAllergens = false;
  
  successMessage = '';
  errorMessage = '';
  
  showAutomaticPreview = false;
  calculatedMacros = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };

  // Iconos
  readonly UploadIcon = Upload;
  readonly SaveIcon = Save;
  readonly AlertIcon = AlertTriangle;
  readonly TargetIcon = Target;
  readonly AppleIcon = Apple;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly CalculatorIcon = Calculator;
  readonly InfoIcon = Info;

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
      useAutomaticCalculation: [false],
      // Campos automáticos
      gender: [''],
      age: [null, [Validators.min(15), Validators.max(100)]],
      weight: [null, [Validators.min(30), Validators.max(300)]],
      height: [null, [Validators.min(100), Validators.max(250)]],
      activityLevel: [''],
      goal: [''],
      // Campos manuales
      dailyCaloriesGoal: [null, [Validators.min(0), Validators.max(999999)]],
      dailyCarbsGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
      dailyProteinGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
      dailyFatGoal: [null, [Validators.min(0), Validators.max(9999.99)]],
      dietId: [null]
    });

    // Suscribirse a cambios en el formulario de preferencias para vista previa
    this.preferencesForm.valueChanges.subscribe(() => {
      if (this.preferencesForm.get('useAutomaticCalculation')?.value) {
        this.updateAutomaticPreview();
      }
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
        this.originalUserAllergenIds = [...this.userAllergenIds]; // Guardar copia original
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
          useAutomaticCalculation: preferences.useAutomaticCalculation || false,
          gender: preferences.gender || '',
          age: preferences.age || null,
          weight: preferences.weight || null,
          height: preferences.height || null,
          activityLevel: preferences.activityLevel || '',
          goal: preferences.goal || '',
          dailyCaloriesGoal: preferences.dailyCaloriesGoal,
          dailyCarbsGoal: preferences.dailyCarbsGoal,
          dailyProteinGoal: preferences.dailyProteinGoal,
          dailyFatGoal: preferences.dailyFatGoal,
          dietId: preferences.dietId
        });

        if (preferences.useAutomaticCalculation) {
          this.updateAutomaticPreview();
        }
      },
      error: () => {
        // No hay preferencias guardadas
      }
    });
  }

  updateAutomaticPreview(): void {
    const form = this.preferencesForm.value;
    
    if (!form.gender || !form.age || !form.weight || !form.height || !form.activityLevel || !form.goal) {
      this.showAutomaticPreview = false;
      return;
    }

    const macros = this.calculateAutomaticMacros(
      form.gender,
      form.age,
      form.weight,
      form.height,
      form.activityLevel,
      form.goal
    );

    this.calculatedMacros = macros;
    this.showAutomaticPreview = true;
  }

  calculateAutomaticMacros(
    gender: string,
    age: number,
    weight: number,
    height: number,
    activityLevel: string,
    goal: string
  ): { calories: number; protein: number; carbs: number; fat: number } {
    // Fórmula Harris-Benedict revisada
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Factor de actividad
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const activityFactor = activityFactors[activityLevel] || 1.55;
    let tdee = bmr * activityFactor;

    // Ajustar según objetivo
    if (goal === 'deficit') {
      tdee *= 0.85; // -15%
    } else if (goal === 'surplus') {
      tdee *= 1.10; // +10%
    }

    // Calcular macros
    const protein = weight * 2; // 2g por kg
    const fat = (tdee * 0.25) / 9; // 25% de calorías
    const remainingCalories = tdee - (protein * 4) - (fat * 9);
    const carbs = remainingCalories / 4;

    return {
      calories: Math.round(tdee),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10
    };
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
        
        // ✅ REFRESCAR LA PÁGINA Y VOLVER AL TOP
        window.scrollTo(0, 0);
        window.location.reload();
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
      this.errorMessage = 'Por favor completa todos los campos requeridos correctamente';
      return;
    }

    this.isSavingPreferences = true;
    this.errorMessage = '';
    this.successMessage = '';

    const form = this.preferencesForm.value;
    const useAuto = form.useAutomaticCalculation;

    // Validar campos según el modo
    if (useAuto) {
      if (!form.gender || !form.age || !form.weight || !form.height || !form.activityLevel || !form.goal) {
        this.errorMessage = 'Por favor completa todos los campos requeridos para el cálculo automático';
        this.isSavingPreferences = false;
        return;
      }
    }

    const preferences: UserPreference = {
      userId: this.currentUser.id,
      useAutomaticCalculation: useAuto,
      gender: useAuto ? form.gender : undefined,
      age: useAuto ? form.age : undefined,
      weight: useAuto ? form.weight : undefined,
      height: useAuto ? form.height : undefined,
      activityLevel: useAuto ? form.activityLevel : undefined,
      goal: useAuto ? form.goal : undefined,
      dailyCaloriesGoal: !useAuto ? form.dailyCaloriesGoal : undefined,
      dailyCarbsGoal: !useAuto ? form.dailyCarbsGoal : undefined,
      dailyProteinGoal: !useAuto ? form.dailyProteinGoal : undefined,
      dailyFatGoal: !useAuto ? form.dailyFatGoal : undefined,
      dietId: !useAuto ? form.dietId : undefined
    };

    this.userService.saveUserPreferences(preferences).subscribe({
      next: () => {
        this.successMessage = 'Preferencias nutricionales actualizadas correctamente';
        this.isSavingPreferences = false;
        
        // ✅ REFRESCAR LA PÁGINA Y VOLVER AL TOP
        window.scrollTo(0, 0);
        window.location.reload();
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

  hasAllergensChanged(): boolean {
    if (this.userAllergenIds.length !== this.originalUserAllergenIds.length) {
      return true;
    }
    
    // Verificar si los arrays tienen los mismos elementos (sin importar el orden)
    const sortedCurrent = [...this.userAllergenIds].sort();
    const sortedOriginal = [...this.originalUserAllergenIds].sort();
    
    return !sortedCurrent.every((value, index) => value === sortedOriginal[index]);
  }

  saveAllergens(): void {
    if (!this.currentUser) return;

    // Si no hay cambios, no hacer nada
    if (!this.hasAllergensChanged()) {
      this.successMessage = 'No hay cambios en las alergias para guardar';
      setTimeout(() => this.successMessage = '', 3000);
      return;
    }

    this.isSavingAllergens = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Usar replaceUserAllergens en lugar de saveUserAllergens para evitar duplicados
    this.userService.replaceUserAllergens(this.currentUser.id, this.userAllergenIds).subscribe({
      next: () => {
        this.successMessage = 'Alergias actualizadas correctamente';
        this.isSavingAllergens = false;
        this.originalUserAllergenIds = [...this.userAllergenIds]; // Actualizar original
        
        // ✅ REFRESCAR LA PÁGINA Y VOLVER AL TOP
        window.scrollTo(0, 0);
        window.location.reload();
      },
      error: (error) => {
        this.errorMessage = this.extractErrorMessage(error);
        console.error('Error:', error);
        this.isSavingAllergens = false;
        
        // Si falla, revertir a los originales
        this.userAllergenIds = [...this.originalUserAllergenIds];
      }
    });
  }

  goBackToProfile(): void {
    if (this.currentUser) {
      // Navegar al perfil del usuario: /user/{username}
      this.router.navigate(['/user', this.currentUser.username]);
    } else {
      // Si no hay usuario, ir hacia atrás en el historial
      window.history.back();
    }
  }

  private extractErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (typeof error.error === 'string') {
      if (error.error.includes('no pueden exceder')) {
        return error.error;
      }
      if (error.error.includes('numeric field overflow')) {
        return 'Uno o más valores exceden el máximo permitido. Calorías máx: 999,999 | Macros máx: 9,999.99 g';
      }
      if (error.error.includes('duplicate key value')) {
        return 'Error: Alergia duplicada. Por favor, recarga la página e intenta nuevamente.';
      }
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
  }
}