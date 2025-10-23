import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
