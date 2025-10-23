import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1>Lista de Compra</h1>
        <div class="space-x-2">
          <button class="btn-secondary">Exportar PDF</button>
          <button class="btn-primary">Compartir</button>
        </div>
      </div>

      <div class="card">
        <h3 class="mb-4">Ingredientes necesarios</h3>
        
        <!-- Ejemplo de items -->
        <div class="space-y-3">
          @for (item of sampleItems; track item.name) {
            <div class="flex items-center gap-3 p-3 bg-celadon rounded-card">
              <input type="checkbox" class="w-5 h-5">
              <div class="flex-1">
                <span class="font-medium">{{ item.name }}</span>
                <span class="text-slate-gray ml-2">{{ item.quantity }} {{ item.unit }}</span>
              </div>
              <button class="text-error hover:text-red-700">🗑️</button>
            </div>
          }
        </div>

        <!-- Agregar item manual -->
        <div class="mt-4 pt-4 border-t border-slate-gray">
          <button class="btn-secondary w-full">+ Añadir Item Manual</button>
        </div>
      </div>
    </div>
  `
})
export class ShoppingListComponent {
  sampleItems = [
    { name: 'Pollo', quantity: 500, unit: 'g' },
    { name: 'Arroz', quantity: 300, unit: 'g' },
    { name: 'Tomates', quantity: 4, unit: 'unidades' },
    { name: 'Lechuga', quantity: 1, unit: 'unidades' }
  ];
}
