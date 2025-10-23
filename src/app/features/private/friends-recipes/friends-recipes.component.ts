import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
