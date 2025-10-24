import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
