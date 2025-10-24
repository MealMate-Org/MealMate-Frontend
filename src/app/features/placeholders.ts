import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

/**
 * ============================================
 * COMPONENTES PLACEHOLDER
 * ============================================
 * 
 * Estos son componentes básicos que puedes expandir después.
 * Por ahora solo muestran la estructura básica.
 */

// ============================================
// DETALLE DE RECETA
// ============================================
@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1>Detalle de Receta</h1>
      <p class="text-slate-gray">ID de la receta en la URL</p>
      <div class="card mt-6">
        <p>Aquí irá toda la información de la receta: ingredientes, pasos, macros, etc.</p>
      </div>
    </div>
  `
})
export class RecipeDetailComponent {}

// ============================================
// PERFIL PÚBLICO DE USUARIO
// ============================================
@Component({
  selector: 'app-user-profile-public',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1>Perfil de Usuario</h1>
      <div class="card mt-6">
        <p>Información pública del usuario y sus recetas</p>
      </div>
    </div>
  `
})
export class UserProfilePublicComponent {}

// ============================================
// MIS RECETAS
// ============================================
@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1>Mis Recetas</h1>
        <a href="/recipes/new" class="btn-primary">+ Nueva Receta</a>
      </div>
      <div class="card">
        <p>Aquí aparecerán todas tus recetas creadas</p>
      </div>
    </div>
  `
})
export class MyRecipesComponent {}

// ============================================
// RECETAS GUARDADAS
// ============================================
@Component({
  selector: 'app-saved-recipes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="mb-6">Recetas Guardadas</h1>
      <div class="card">
        <p>Recetas que has marcado como favoritas</p>
      </div>
    </div>
  `
})
export class SavedRecipesComponent {}

// ============================================
// RECETAS DE AMIGOS
// ============================================
@Component({
  selector: 'app-friends-recipes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="mb-6">Recetas de Amigos</h1>
      <div class="card">
        <p>Recetas compartidas por usuarios que sigues</p>
      </div>
    </div>
  `
})
export class FriendsRecipesComponent {}

// ============================================
// PERFIL PERSONAL
// ============================================
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="mb-6">Mi Perfil</h1>
      <div class="space-y-6">
        <div class="card">
          <h3 class="mb-4">Información Personal</h3>
          <p>Nombre, email, avatar, bio, etc.</p>
        </div>
        <div class="card">
          <h3 class="mb-4">Preferencias Nutricionales</h3>
          <p>Objetivos de calorías, macros, dieta, etc.</p>
        </div>
        <div class="card">
          <h3 class="mb-4">Alergias e Intolerancias</h3>
          <p>Configurar alérgenos para recibir alertas</p>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {}
