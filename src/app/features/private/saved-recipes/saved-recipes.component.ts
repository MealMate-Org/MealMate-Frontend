import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
