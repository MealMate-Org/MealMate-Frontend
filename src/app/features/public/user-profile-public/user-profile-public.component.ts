import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
