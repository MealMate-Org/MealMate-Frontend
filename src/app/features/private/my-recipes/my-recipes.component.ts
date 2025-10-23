import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-my-recipes',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1>Mis Recetas</h1>
        <a routerLink="/recipes/new" class="btn-primary">+ Nueva Receta</a>
      </div>
      <div class="card">
        <p>Aquí aparecerán todas tus recetas creadas</p>
      </div>
    </div>
  `
})
export class MyRecipesComponent {}
