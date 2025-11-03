import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-dark-purple text-white py-8">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center">
          <div class="flex justify-center items-center space-x-2 mb-3">
            <img 
              src="/MMLogo.png" 
              alt="MealMate Logo" 
              class="h-8 w-auto"
              onerror="this.style.display='none'"
            >
            <span class="text-xl font-bold">MealMate</span>
          </div>
          <p class="text-slate-gray mb-3 text-sm">
            La forma más inteligente de planificar tus comidas
          </p>
          <div class="flex justify-center space-x-4 text-xs">
            <a href="#" class="hover:text-cambridge-blue transition">Términos</a>
            <a href="#" class="hover:text-cambridge-blue transition">Privacidad</a>
            <a href="#" class="hover:text-cambridge-blue transition">Contacto</a>
          </div>
          <p class="text-slate-gray text-xs mt-4">
            © 2025 MealMate. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}