import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

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
        <!-- Ejemplo de grupo -->
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

        <!-- Crear nuevo grupo -->
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
