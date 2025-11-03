import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-celadon py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-3xl shadow-2xl p-8">
          <h2 class="text-center mb-8 text-4xl">Iniciar Sesión</h2>
          
          @if (errorMessage) {
            <div class="bg-red-50 border-2 border-error rounded-2xl p-4 mb-6 text-center">
              <p class="text-error font-medium">{{ errorMessage }}</p>
            </div>
          }
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label for="email" class="block text-sm font-semibold text-dark-purple mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input w-full"
                placeholder="tu@email.com"
              >
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="text-error text-sm mt-2">
                  @if (loginForm.get('email')?.errors?.['required']) {
                    El email es obligatorio
                  }
                  @if (loginForm.get('email')?.errors?.['email']) {
                    Email inválido
                  }
                </p>
              }
            </div>

            <div class="mb-8">
              <label for="password" class="block text-sm font-semibold text-dark-purple mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input w-full"
                placeholder="••••••••"
              >
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-error text-sm mt-2">
                  @if (loginForm.get('password')?.errors?.['required']) {
                    La contraseña es obligatoria
                  }
                  @if (loginForm.get('password')?.errors?.['minlength']) {
                    Mínimo 6 caracteres
                  }
                </p>
              }
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              [class]="loginForm.invalid || isLoading ? 'btn-disabled w-full' : 'btn-primary w-full'"
            >
              @if (isLoading) {
                <span>Iniciando sesión...</span>
              } @else {
                <span>Iniciar Sesión</span>
              }
            </button>
          </form>

          <p class="text-center mt-8 text-slate-gray">
            ¿No tienes cuenta?
            <a routerLink="/register" class="text-cambridge-blue hover:text-zomp font-semibold transition">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Email o contraseña incorrectos';
        console.error('Error en login:', error);
      }
    });
  }
}