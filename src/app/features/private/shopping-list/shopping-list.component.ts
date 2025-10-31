import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ShoppingListService } from '../../../core/services/user-actions.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShoppingList, ShoppingItem } from '../../../models/planner.model';
import { 
  LucideAngularModule,
  FileText,
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  ShoppingCart,
  Lightbulb,
  Download,
  ClipboardCopy
} from 'lucide-angular';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 class="text-4xl font-marcellus font-bold text-dark-purple mb-2">Lista de Compra</h1>
            <p class="text-slate-gray text-lg">Organiza tus ingredientes para la semana</p>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="exportToPDF()"
              class="btn-secondary inline-flex items-center gap-2 px-4 py-3"
            >
              <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar PDF
            </button>
            <button 
              (click)="shareList()"
              class="btn-primary inline-flex items-center gap-2 px-4 py-3"
            >
              <lucide-icon [img]="ShareIcon" class="w-4 h-4"></lucide-icon>
              Compartir
            </button>
          </div>
        </div>

        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-4"></div>
            <p class="text-slate-gray text-lg">Cargando lista de compra...</p>
          </div>
        }

        @if (!isLoading && shoppingList) {
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <!-- Header de la lista -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 class="text-2xl font-marcellus font-bold text-dark-purple">Ingredientes necesarios</h3>
              <div class="text-base text-slate-gray font-medium">
                {{ getCheckedCount() }} / {{ shoppingList.items.length }} completados
              </div>
            </div>

            <!-- Barra de progreso -->
            <div class="w-full bg-celadon rounded-full h-3 mb-8">
              <div 
                class="bg-cambridge-blue h-3 rounded-full transition-all duration-500"
                [style.width.%]="getProgressPercentage()"
              ></div>
            </div>
            
            <!-- Lista de items -->
            <div class="space-y-3 mb-8">
              @for (item of shoppingList.items; track $index) {
                <div 
                  class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 transition-all duration-300"
                  [class.bg-celadon]="item.checked"
                  [class.border-cambridge-blue]="item.checked"
                  [class.opacity-70]="item.checked"
                >
                  <input 
                    type="checkbox"
                    [(ngModel)]="item.checked"
                    (change)="onItemCheck()"
                    class="w-5 h-5 text-cambridge-blue bg-white border-slate-gray rounded focus:ring-cambridge-blue focus:ring-2 cursor-pointer"
                  >
                  <div class="flex-1">
                    <span 
                      class="font-karla font-medium text-dark-purple text-base"
                      [class.line-through]="item.checked"
                      [class.text-slate-gray]="item.checked"
                    >
                      {{ item.name }}
                    </span>
                    <span class="text-slate-gray ml-3 text-sm">
                      {{ item.quantity }} {{ item.unit }}
                    </span>
                  </div>
                  <button 
                    (click)="removeItem($index)"
                    class="text-error hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                  >
                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              }
            </div>

            @if (shoppingList.items.length === 0) {
              <div class="text-center py-12 text-slate-gray border-2 border-dashed border-slate-gray rounded-2xl">
                <lucide-icon [img]="ShoppingCartIcon" class="w-16 h-16 mx-auto mb-4 opacity-40"></lucide-icon>
                <p class="text-lg font-medium mb-2">No hay items en tu lista</p>
                <p class="text-base">Agrega algunos ingredientes para empezar</p>
              </div>
            }

            <!-- Agregar item manual -->
            <div class="pt-8 border-t border-gray-200">
              <h4 class="text-xl font-marcellus font-bold text-dark-purple mb-4">Añadir Item Manual</h4>
              <div class="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  [(ngModel)]="newItemName"
                  placeholder="Nombre del item"
                  class="input flex-1 text-base"
                  (keyup.enter)="addManualItem()"
                >
                <input 
                  type="number"
                  [(ngModel)]="newItemQuantity"
                  placeholder="Cantidad"
                  class="input w-24 text-base"
                  (keyup.enter)="addManualItem()"
                  min="0"
                  step="0.1"
                >
                <select 
                  [(ngModel)]="newItemUnit"
                  class="input w-32 text-base"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="unidades">unidades</option>
                  <option value="cucharadas">cucharadas</option>
                  <option value="tazas">tazas</option>
                </select>
                <button 
                  (click)="addManualItem()"
                  class="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
                  [disabled]="!newItemName.trim() || !newItemQuantity"
                >
                  <lucide-icon [img]="PlusIcon" class="w-5 h-5"></lucide-icon>
                  Añadir
                </button>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                (click)="clearChecked()"
                class="btn-secondary inline-flex items-center justify-center gap-2 py-3 text-base"
                [disabled]="getCheckedCount() === 0"
              >
                <lucide-icon [img]="CheckCircleIcon" class="w-5 h-5"></lucide-icon>
                Limpiar Marcados
              </button>
              <button 
                (click)="clearAll()"
                class="btn-secondary inline-flex items-center justify-center gap-2 py-3 text-base"
                [disabled]="shoppingList.items.length === 0"
              >
                <lucide-icon [img]="TrashIcon" class="w-5 h-5"></lucide-icon>
                Limpiar Todo
              </button>
              <button 
                (click)="saveList()"
                class="btn-primary inline-flex items-center justify-center gap-2 py-3 text-base"
                [disabled]="isSaving"
              >
                <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon>
                {{ isSaving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>

          <!-- Sugerencias -->
          <div class="bg-gradient-to-r from-celadon to-cambridge-blue rounded-2xl p-6 text-dark-purple">
            <div class="flex items-start gap-4">
              <lucide-icon [img]="LightbulbIcon" class="w-8 h-8 text-zomp flex-shrink-0 mt-1"></lucide-icon>
              <div>
                <h4 class="text-xl font-marcellus font-bold mb-2">💡 Consejo</h4>
                <p class="text-base font-karla">
                  Puedes generar tu lista de compra automáticamente desde tu planificador semanal.
                  Organiza tus ingredientes por categorías para hacer la compra más eficiente.
                </p>
              </div>
            </div>
          </div>
        }

        @if (!isLoading && !shoppingList) {
          <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
            <lucide-icon [img]="ShoppingCartIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
            <h3 class="text-2xl font-marcellus font-bold text-dark-purple mb-4">No tienes lista de compra</h3>
            <p class="text-slate-gray text-lg mb-8 max-w-md mx-auto">
              Crea tu primera lista de compra o genera una automáticamente desde tu planificador semanal
            </p>
            <button 
              (click)="createNewList()"
              class="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <lucide-icon [img]="PlusIcon" class="w-6 h-6"></lucide-icon>
              Crear Lista de Compra
            </button>
          </div>
        }
      </div>
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

  // Iconos Lucide
  readonly DownloadIcon = Download;
  readonly ShareIcon = Share2;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly SaveIcon = Save;
  readonly CheckCircleIcon = CheckCircle;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly LightbulbIcon = Lightbulb;
  readonly ClipboardIcon = ClipboardCopy;

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

    const listText = `📋 Mi Lista de Compra - MealMate\n\n` +
      this.shoppingList.items
        .map(item => `${item.checked ? '✅' : '☐'} ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n');

    navigator.clipboard.writeText(listText).then(() => {
      alert('¡Lista copiada al portapapeles!');
    });
  }
}