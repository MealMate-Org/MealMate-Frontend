#!/bin/bash

# REGISTER COMPONENT
cat > src/app/features/auth/register/register.component.ts << 'REGEOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div class="max-w-md w-full">
        <div class="card">
          <h2 class="text-center mb-6">Crear Cuenta</h2>
          
          @if (errorMessage) {
            <div class="badge-error mb-4 p-3 text-center w-full">
              {{ errorMessage }}
            </div>
          }
          
          @if (successMessage) {
            <div class="badge-success mb-4 p-3 text-center w-full">
              {{ successMessage }}
            </div>
          }
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-dark-purple mb-2">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="input w-full"
                placeholder="tu_usuario"
              >
              @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                <p class="text-error text-sm mt-1">
                  El nombre de usuario es obligatorio
                </p>
              }
            </div>

            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-dark-purple mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input w-full"
                placeholder="tu@email.com"
              >
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="text-error text-sm mt-1">
                  @if (registerForm.get('email')?.errors?.['required']) {
                    El email es obligatorio
                  }
                  @if (registerForm.get('email')?.errors?.['email']) {
                    Email inválido
                  }
                </p>
              }
            </div>

            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-dark-purple mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input w-full"
                placeholder="••••••••"
              >
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="text-error text-sm mt-1">
                  @if (registerForm.get('password')?.errors?.['required']) {
                    La contraseña es obligatoria
                  }
                  @if (registerForm.get('password')?.errors?.['minlength']) {
                    Mínimo 6 caracteres
                  }
                </p>
              }
            </div>

            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-dark-purple mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="input w-full"
                placeholder="••••••••"
              >
              @if (registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched) {
                <p class="text-error text-sm mt-1">
                  Las contraseñas no coinciden
                </p>
              }
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              [class]="registerForm.invalid || isLoading ? 'btn-disabled w-full' : 'btn-primary w-full'"
            >
              @if (isLoading) {
                <span>Creando cuenta...</span>
              } @else {
                <span>Registrarse</span>
              }
            </button>
          </form>

          <p class="text-center mt-6 text-slate-gray">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-cambridge-blue hover:text-zomp font-medium">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roleId: 2
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.successMessage = '¡Cuenta creada! Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al crear la cuenta. El email o username ya existe.';
        console.error('Error en registro:', error);
      }
    });
  }
}
REGEOF

echo "✅ Register component created"

