import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
      
      <!-- Calendario semanal -->
      <div class="card">
        <div class="grid grid-cols-7 gap-4">
          @for (day of weekDays; track day) {
            <div class="border border-celadon rounded-card p-3">
              <h4 class="text-center mb-3">{{ day }}</h4>
              <!-- Desayuno -->
              <div class="mb-3">
                <p class="text-xs text-slate-gray mb-1">Desayuno</p>
                <div class="h-20 bg-celadon rounded border-2 border-dashed border-cambridge-blue flex items-center justify-center text-xs text-slate-gray">
                  Arrastra receta aquí
                </div>
              </div>
              <!-- Comida -->
              <div class="mb-3">
                <p class="text-xs text-slate-gray mb-1">Comida</p>
                <div class="h-20 bg-celadon rounded border-2 border-dashed border-cambridge-blue flex items-center justify-center text-xs text-slate-gray">
                  Arrastra receta aquí
                </div>
              </div>
              <!-- Cena -->
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

      <!-- Resumen nutricional -->
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
