import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ShoppingListService } from '../../../core/services/user-actions.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShoppingList, ShoppingItem } from '../../../models/planner.model';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar />
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1>Lista de Compra</h1>
          <p class="text-slate-gray">Organiza tus ingredientes para la semana</p>
        </div>
        <div class="space-x-2">
          <button 
            (click)="exportToPDF()"
            class="btn-secondary"
          >
            📄 Exportar PDF
          </button>
          <button 
            (click)="shareList()"
            class="btn-primary"
          >
            📤 Compartir
          </button>
        </div>
      </div>

      @if (isLoading) {
        <div class="text-center py-12">
          <p class="text-slate-gray">Cargando lista de compra...</p>
        </div>
      }

      @if (!isLoading && shoppingList) {
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3>Ingredientes necesarios</h3>
            <div class="text-sm text-slate-gray">
              {{ getCheckedCount() }} / {{ shoppingList.items.length }} completados
            </div>
          </div>

          <!-- Barra de progreso -->
          <div class="w-full bg-celadon rounded-full h-2 mb-6">
            <div 
              class="bg-cambridge-blue h-2 rounded-full transition-all"
              [style.width.%]="getProgressPercentage()"
            ></div>
          </div>
          
          <!-- Lista de items -->
          <div class="space-y-2">
            @for (item of shoppingList.items; track $index) {
              <div 
                class="flex items-center gap-3 p-3 rounded-card transition"
                [class.bg-celadon]="item.checked"
                [class.opacity-60]="item.checked"
              >
                <input 
                  type="checkbox"
                  [(ngModel)]="item.checked"
                  (change)="onItemCheck()"
                  class="w-5 h-5 cursor-pointer"
                >
                <div class="flex-1">
                  <span 
                    class="font-medium"
                    [class.line-through]="item.checked"
                  >
                    {{ item.name }}
                  </span>
                  <span class="text-slate-gray ml-2">
                    {{ item.quantity }} {{ item.unit }}
                  </span>
                </div>
                <button 
                  (click)="removeItem($index)"
                  class="text-error hover:text-red-700 transition"
                >
                  🗑️
                </button>
              </div>
            }
          </div>

          @if (shoppingList.items.length === 0) {
            <div class="text-center py-8 text-slate-gray">
              <p class="mb-2">📝</p>
              <p>No hay items en tu lista</p>
            </div>
          }

          <!-- Agregar item manual -->
          <div class="mt-6 pt-6 border-t border-slate-gray">
            <h4 class="mb-3">Añadir Item Manual</h4>
            <div class="flex gap-2">
              <input 
                type="text"
                [(ngModel)]="newItemName"
                placeholder="Nombre del item"
                class="input flex-1"
                (keyup.enter)="addManualItem()"
              >
              <input 
                type="number"
                [(ngModel)]="newItemQuantity"
                placeholder="Cantidad"
                class="input w-24"
                (keyup.enter)="addManualItem()"
              >
              <select 
                [(ngModel)]="newItemUnit"
                class="input w-24"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="unidades">unidades</option>
              </select>
              <button 
                (click)="addManualItem()"
                class="btn-primary"
              >
                ➕
              </button>
            </div>
          </div>

          <!-- Acciones -->
          <div class="mt-6 pt-6 border-t border-slate-gray flex gap-2">
            <button 
              (click)="clearChecked()"
              class="btn-secondary flex-1"
            >
              ✓ Limpiar Marcados
            </button>
            <button 
              (click)="clearAll()"
              class="btn-secondary flex-1"
            >
              🗑️ Limpiar Todo
            </button>
            <button 
              (click)="saveList()"
              class="btn-primary flex-1"
              [disabled]="isSaving"
            >
              {{ isSaving ? 'Guardando...' : '💾 Guardar' }}
            </button>
          </div>
        </div>

        <!-- Sugerencias -->
        <div class="card mt-6 bg-celadon">
          <h4 class="mb-2">💡 Consejo</h4>
          <p class="text-sm text-slate-gray">
            Puedes generar tu lista de compra automáticamente desde tu planificador semanal.
          </p>
        </div>
      }

      @if (!isLoading && !shoppingList) {
        <div class="card text-center py-12">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="mb-3">No tienes lista de compra</h3>
          <p class="text-slate-gray mb-6">
            Crea tu primera lista de compra o genera una desde tu planificador
          </p>
          <button 
            (click)="createNewList()"
            class="btn-primary"
          >
            Crear Lista de Compra
          </button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ShoppingListComponent implements OnInit {
  shoppingList: ShoppingList | null = null;
  isLoading = true;
  isSaving = false;
  
  newItemName = '';
  newItemQuantity: number | null = null;
  newItemUnit = 'g';

  constructor(
    private shoppingListService: ShoppingListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    this.shoppingListService.getAllShoppingLists().subscribe({
      next: (lists) => {
        // Obtener la lista más reciente del usuario
        const userLists = lists.filter(l => l.userId === currentUser.id);
        if (userLists.length > 0) {
          this.shoppingList = userLists[userLists.length - 1];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando lista:', error);
        this.isLoading = false;
      }
    });
  }

  createNewList(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const newList = {
      userId: currentUser.id,
      items: []
    };

    this.shoppingListService.createShoppingList(newList).subscribe({
      next: (list) => {
        this.shoppingList = list;
      },
      error: (error) => {
        console.error('Error creando lista:', error);
        alert('Error al crear lista de compra');
      }
    });
  }

  addManualItem(): void {
    if (!this.shoppingList || !this.newItemName.trim() || !this.newItemQuantity) {
      return;
    }

    const newItem: ShoppingItem = {
      name: this.newItemName.trim(),
      quantity: this.newItemQuantity,
      unit: this.newItemUnit,
      checked: false
    };

    this.shoppingList.items.push(newItem);
    
    // Limpiar campos
    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemUnit = 'g';

    // Auto-guardar
    this.saveList();
  }

  removeItem(index: number): void {
    if (!this.shoppingList) return;

    const confirmed = confirm('¿Quitar este item de la lista?');
    if (confirmed) {
      this.shoppingList.items.splice(index, 1);
      this.saveList();
    }
  }

  onItemCheck(): void {
    // Auto-guardar cuando se marca/desmarca un item
    this.saveList();
  }

  clearChecked(): void {
    if (!this.shoppingList) return;

    const confirmed = confirm('¿Eliminar todos los items marcados?');
    if (confirmed) {
      this.shoppingList.items = this.shoppingList.items.filter(item => !item.checked);
      this.saveList();
    }
  }

  clearAll(): void {
    if (!this.shoppingList) return;

    const confirmed = confirm('¿Estás seguro de que quieres limpiar toda la lista?');
    if (confirmed) {
      this.shoppingList.items = [];
      this.saveList();
    }
  }

  saveList(): void {
    if (!this.shoppingList || this.isSaving) return;

    this.isSaving = true;

    this.shoppingListService.updateShoppingList(this.shoppingList.id, this.shoppingList).subscribe({
      next: (updatedList) => {
        this.shoppingList = updatedList;
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error guardando lista:', error);
        this.isSaving = false;
        alert('Error al guardar la lista');
      }
    });
  }

  getCheckedCount(): number {
    return this.shoppingList?.items.filter(item => item.checked).length || 0;
  }

  getProgressPercentage(): number {
    if (!this.shoppingList || this.shoppingList.items.length === 0) {
      return 0;
    }
    return (this.getCheckedCount() / this.shoppingList.items.length) * 100;
  }

  exportToPDF(): void {
    // TODO: Implementar exportación a PDF
    alert('Función de exportación a PDF en desarrollo');
  }

  shareList(): void {
    if (!this.shoppingList) return;

    const listText = this.shoppingList.items
      .map(item => `${item.checked ? '✓' : '☐'} ${item.name} - ${item.quantity} ${item.unit}`)
      .join('\n');

    navigator.clipboard.writeText(listText).then(() => {
      alert('¡Lista copiada al portapapeles!');
    });
  }
}
