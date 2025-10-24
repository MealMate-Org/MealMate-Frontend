import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="mb-6">Nueva Receta</h1>

      <form class="space-y-6">
        <!-- Información básica -->
        <div class="card">
          <h3 class="mb-4">Información Básica</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Título</label>
              <input type="text" class="input w-full" placeholder="Nombre de la receta">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Descripción</label>
              <textarea class="input w-full" rows="3" placeholder="Breve descripción..."></textarea>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Tipo de comida</label>
                <select class="input w-full">
                  <option>Desayuno</option>
                  <option>Comida</option>
                  <option>Cena</option>
                  <option>Merienda</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Visibilidad</label>
                <select class="input w-full">
                  <option>Pública</option>
                  <option>Privada</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Ingredientes -->
        <div class="card">
          <h3 class="mb-4">Ingredientes</h3>
          <button type="button" class="btn-secondary w-full">+ Añadir Ingrediente</button>
        </div>

        <!-- Instrucciones -->
        <div class="card">
          <h3 class="mb-4">Instrucciones</h3>
          <textarea class="input w-full" rows="6" placeholder="Paso a paso..."></textarea>
        </div>

        <!-- Información nutricional -->
        <div class="card">
          <h3 class="mb-4">Información Nutricional (Opcional)</h3>
          <div class="grid md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Calorías</label>
              <input type="number" class="input w-full" placeholder="0">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Proteína (g)</label>
              <input type="number" class="input w-full" placeholder="0">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Carbohidratos (g)</label>
              <input type="number" class="input w-full" placeholder="0">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Grasas (g)</label>
              <input type="number" class="input w-full" placeholder="0">
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Receta</button>
        </div>
      </form>
    </div>
  `
})
export class RecipeFormComponent {}
