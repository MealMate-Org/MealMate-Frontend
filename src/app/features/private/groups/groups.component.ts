import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { 
  LucideAngularModule,
  Users,
  Calendar,
  Clock,
  Rocket
} from 'lucide-angular';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="flex justify-center mb-4">
            <div class="w-20 h-20 bg-gradient-to-r from-cambridge-blue to-zomp rounded-2xl flex items-center justify-center">
              <lucide-icon [img]="UsersIcon" class="w-10 h-10 text-white"></lucide-icon>
            </div>
          </div>
          <h1 class="text-4xl font-bold text-dark-purple mb-4">Grupos de Planificación</h1>
          <p class="text-xl text-slate-gray max-w-2xl mx-auto">
            Colabora con familiares y amigos para planificar comidas juntos
          </p>
        </div>

        <!-- Placeholder Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div class="max-w-md mx-auto">
            <!-- Icono animado -->
            <div class="w-24 h-24 bg-gradient-to-br from-celadon to-cambridge-blue rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <lucide-icon [img]="RocketIcon" class="w-12 h-12 text-white"></lucide-icon>
            </div>
            
            <!-- Mensaje principal -->
            <h2 class="text-3xl font-bold text-dark-purple mb-4">
              ¡Próximamente!
            </h2>
            
            <p class="text-lg text-slate-gray mb-6 leading-relaxed">
              Estamos trabajando duro para traerte la funcionalidad de grupos. Podrás crear grupos familiares, 
              planificar comidas en equipo y compartir listas de compra con tus seres queridos.
            </p>

            <!-- Características futuras -->
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-celadon rounded-lg flex items-center justify-center mx-auto mb-3">
                  <lucide-icon [img]="UsersIcon" class="w-6 h-6 text-cambridge-blue"></lucide-icon>
                </div>
                <h3 class="font-semibold text-dark-purple mb-2">Grupos Familiares</h3>
                <p class="text-sm text-slate-gray">Crea grupos para tu familia o compañeros de piso</p>
              </div>
              
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-celadon rounded-lg flex items-center justify-center mx-auto mb-3">
                  <lucide-icon [img]="CalendarIcon" class="w-6 h-6 text-cambridge-blue"></lucide-icon>
                </div>
                <h3 class="font-semibold text-dark-purple mb-2">Planificación Conjunta</h3>
                <p class="text-sm text-slate-gray">Coordina menús semanales entre todos los miembros</p>
              </div>
              
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-celadon rounded-lg flex items-center justify-center mx-auto mb-3">
                  <lucide-icon [img]="ClockIcon" class="w-6 h-6 text-cambridge-blue"></lucide-icon>
                </div>
                <h3 class="font-semibold text-dark-purple mb-2">Listas Compartidas</h3>
                <p class="text-sm text-slate-gray">Genera listas de compra colaborativas</p>
              </div>
            </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GroupsComponent {
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly RocketIcon = Rocket;
}