import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1>Planificador Semanal</h1>
        <button class="btn-primary">Generar Lista de Compra</button>
      </div>
      
      <div class="card">
        <div class="grid grid-cols-7 gap-4">
          @for (day of weekDays; track day) {
            <div class="border border-celadon rounded-card p-3">
              <h4 class="text-center mb-3">{{ day }}</h4>
              <div class="mb-3">
                <p class="text-xs text-slate-gray mb-1">Desayuno</p>
                <div class="h-20 bg-celadon rounded border-2 border-dashed border-cambridge-blue flex items-center justify-center text-xs text-slate-gray">
                  Arrastra receta aquí
                </div>
              </div>
              <div class="mb-3">
                <p class="text-xs text-slate-gray mb-1">Comida</p>
                <div class="h-20 bg-celadon rounded border-2 border-dashed border-cambridge-blue flex items-center justify-center text-xs text-slate-gray">
                  Arrastra receta aquí
                </div>
              </div>
              <div>
                <p class="text-xs text-slate-gray mb-1">Cena</p>
                <div class="h-20 bg-celadon rounded border-2 border-dashed border-cambridge-blue flex items-center justify-center text-xs text-slate-gray">
                  Arrastra receta aquí
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="card mt-6">
        <h3 class="mb-4">Resumen Nutricional de la Semana</h3>
        <div class="grid md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-dark-purple">12,950</div>
            <div class="text-sm text-slate-gray">Calorías totales</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-dark-purple">840g</div>
            <div class="text-sm text-slate-gray">Proteína total</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-dark-purple">1,260g</div>
            <div class="text-sm text-slate-gray">Carbohidratos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-dark-purple">455g</div>
            <div class="text-sm text-slate-gray">Grasas</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlannerComponent {
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
}
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
@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1>Mis Grupos</h1>
        <button class="btn-primary">+ Crear Grupo</button>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="card">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="mb-1">🏠 Casa</h3>
              <p class="text-sm text-slate-gray">5 miembros</p>
            </div>
            <span class="badge">Admin</span>
          </div>
          <p class="text-sm text-slate-gray mb-4">
            Grupo familiar para organizar las comidas de la semana
          </p>
          <div class="flex gap-2">
            <button class="btn-secondary flex-1">Ver Planner</button>
            <button class="btn-accent">⚙️</button>
          </div>
        </div>

        <div class="card border-2 border-dashed border-cambridge-blue flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:bg-celadon transition">
          <div class="text-4xl mb-3">➕</div>
          <h4 class="mb-2">Crear Nuevo Grupo</h4>
          <p class="text-sm text-slate-gray">Invita a familia o amigos a planificar juntos</p>
        </div>
      </div>
    </div>
  `
})
export class GroupsComponent {}

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="mb-6">Nueva Receta</h1>

      <form class="space-y-6">
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

        <div class="card">
          <h3 class="mb-4">Ingredientes</h3>
          <button type="button" class="btn-secondary w-full">+ Añadir Ingrediente</button>
        </div>

        <div class="card">
          <h3 class="mb-4">Instrucciones</h3>
          <textarea class="input w-full" rows="6" placeholder="Paso a paso..."></textarea>
        </div>

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

        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar Receta</button>
        </div>
      </form>
    </div>
  `
})
export class RecipeFormComponent {}
