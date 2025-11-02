// shopping-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ShoppingListService } from '../../../core/services/user-actions.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShoppingList, ShoppingItem, ShoppingListCreateDTO } from '../../../models/planner.model';
import { 
  LucideAngularModule,
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  ShoppingCart,
  Lightbulb,
  Download,
  Calendar,
  Package,
  X
} from 'lucide-angular';

// Agrega esta interfaz para el PDF
interface PDFOptions {
  orientation: 'p' | 'l';
  unit: 'mm';
  format: 'a4';
}

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, LucideAngularModule],
  template: `
    <app-navbar />
    <div class="min-h-screen bg-gradient-to-b from-background to-celadon py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 class="text-4xl font-bold text-dark-purple mb-2">Mis Listas de Compra</h1>
            <p class="text-slate-gray text-lg">Organiza tus ingredientes por semanas</p>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="createNewList()"
              class="btn-primary inline-flex items-center gap-2 px-4 py-3"
            >
              <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
              Nueva Lista
            </button>
          </div>
        </div>

        @if (isLoading) {
          <div class="text-center py-16">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-cambridge-blue mb-4"></div>
            <p class="text-slate-gray text-lg">Cargando listas de compra...</p>
          </div>
        }

        @if (!isLoading) {
          <!-- Vista de múltiples listas -->
          @if (allShoppingLists.length > 0) {
            <!-- Tabs para filtrar -->
            <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div class="flex gap-2 overflow-x-auto">
                <button 
                  (click)="filterView = 'all'"
                  [class]="filterView === 'all' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray'"
                  class="px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
                >
                  Todas ({{ allShoppingLists.length }})
                </button>
                <button 
                  (click)="filterView = 'weekly'"
                  [class]="filterView === 'weekly' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray'"
                  class="px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
                >
                  Por Semanas ({{ getWeeklyLists().length }})
                </button>
                <button 
                  (click)="filterView = 'manual'"
                  [class]="filterView === 'manual' ? 'bg-cambridge-blue text-white' : 'bg-gray-100 text-slate-gray'"
                  class="px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap"
                >
                  Manuales ({{ getManualLists().length }})
                </button>
              </div>
            </div>

            <!-- Grid de listas -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              @for (list of getFilteredLists(); track list.id) {
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-cambridge-blue transition-all">
                  <!-- Header de la lista -->
                  <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-celadon to-cambridge-blue bg-opacity-10">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <lucide-icon [img]="list.weekStartDate ? CalendarIcon : PackageIcon" 
                                       class="w-5 h-5 text-cambridge-blue">
                          </lucide-icon>
                          <h3 class="text-xl font-bold text-dark-purple">
                            {{ getListTitle(list) }}
                          </h3>
                        </div>
                        @if (list.weekStartDate && list.weekEndDate) {
                          <p class="text-sm text-slate-gray">
                            {{ formatWeekRange(list.weekStartDate, list.weekEndDate) }}
                          </p>
                        }
                        <p class="text-xs text-slate-gray mt-1">
                          Creada: {{ formatDate(list.createdAt!) }}
                        </p>
                      </div>
                      <button 
                        (click)="deleteList(list.id)"
                        class="text-error hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Eliminar lista"
                      >
                        <lucide-icon [img]="TrashIcon" class="w-5 h-5"></lucide-icon>
                      </button>
                    </div>

                    <!-- Progreso -->
                    <div class="flex items-center gap-3">
                      <div class="flex-1">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-cambridge-blue h-2 rounded-full transition-all"
                            [style.width.%]="getListProgress(list)"
                          ></div>
                        </div>
                      </div>
                      <span class="text-sm font-medium text-dark-purple">
                        {{ getCheckedCount(list) }}/{{ list.items.length }}
                      </span>
                    </div>
                  </div>

                  <!-- Items (preview) -->
                  <div class="p-4">
                    @if (list.items.length > 0) {
                      <div class="space-y-2 mb-4">
                        @for (item of list.items.slice(0, 3); track $index) {
                          <div class="flex items-center gap-2 text-sm">
                            <input 
                              type="checkbox"
                              [checked]="item.checked"
                              (change)="toggleItem(list, item)"
                              class="w-4 h-4 text-cambridge-blue rounded"
                            >
                            <span 
                              [class.line-through]="item.checked"
                              [class.text-slate-gray]="item.checked"
                              [class.text-dark-purple]="!item.checked"
                            >
                              {{ item.name }} - {{ item.quantity }} {{ item.unit }}
                            </span>
                          </div>
                        }
                        @if (list.items.length > 3) {
                          <p class="text-xs text-slate-gray text-center">
                            +{{ list.items.length - 3 }} más...
                          </p>
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-slate-gray text-center py-4">
                        Lista vacía
                      </p>
                    }

                    <!-- Acciones -->
                    <div class="flex gap-2">
                      <button 
                        (click)="viewList(list)"
                        class="flex-1 btn-primary py-2 text-sm"
                      >
                        Ver Completa
                      </button>
                      <button 
                        (click)="exportListAsText(list)"
                        class="btn-secondary p-2"
                        title="Exportar texto"
                      >
                        <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button 
                        (click)="exportListAsPDF(list)"
                        class="btn-secondary p-2"
                        title="Exportar PDF"
                      >
                        <lucide-icon [img]="FileTextIcon" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (getFilteredLists().length === 0) {
              <div class="bg-white rounded-2xl shadow-lg text-center py-12 px-6">
                <lucide-icon [img]="ShoppingCartIcon" class="w-16 h-16 text-slate-gray mx-auto mb-4 opacity-30"></lucide-icon>
                <p class="text-slate-gray text-lg">No hay listas en esta categoría</p>
              </div>
            }
          } @else {
            <!-- Estado vacío -->
            <div class="bg-white rounded-2xl shadow-lg text-center py-16 px-6">
              <lucide-icon [img]="ShoppingCartIcon" class="w-24 h-24 text-slate-gray mx-auto mb-6 opacity-30"></lucide-icon>
              <h3 class="text-2xl font-bold text-dark-purple mb-4">No tienes listas de compra</h3>
              <p class="text-slate-gray text-lg mb-8 max-w-md mx-auto">
                Crea tu primera lista manualmente o genera una automáticamente desde tu planificador semanal
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  (click)="createNewList()"
                  class="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                >
                  <lucide-icon [img]="PlusIcon" class="w-6 h-6"></lucide-icon>
                  Crear Lista Manual
                </button>
                <a 
                  routerLink="/planner"
                  class="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-lg"
                >
                  <lucide-icon [img]="CalendarIcon" class="w-6 h-6"></lucide-icon>
                  Ir al Planificador
                </a>
              </div>
            </div>
          }

          <!-- Sugerencias -->
          <div class="bg-gradient-to-r from-celadon to-cambridge-blue rounded-2xl p-6 text-dark-purple">
            <div class="flex items-start gap-4">
              <lucide-icon [img]="LightbulbIcon" class="w-8 h-8 text-zomp flex-shrink-0 mt-1"></lucide-icon>
              <div>
                <h4 class="text-xl font-bold mb-2">💡 Consejos</h4>
                <ul class="text-base space-y-1 list-disc list-inside">
                  <li>Genera listas automáticamente desde tu planificador semanal</li>
                  <li>Las listas por semanas agrupan todos los ingredientes necesarios</li>
                  <li>Puedes exportar y compartir tus listas fácilmente</li>
                  <li>Marca los items mientras compras para llevar control</li>
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Modal de vista detallada -->
    @if (selectedList) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-dark-purple">
                {{ getListTitle(selectedList) }}
              </h3>
              <button 
                (click)="closeDetailView()"
                class="text-slate-gray hover:text-error transition-colors"
              >
                <lucide-icon [img]="XIcon" class="w-6 h-6"></lucide-icon>
              </button>
            </div>
            
            @if (selectedList.weekStartDate && selectedList.weekEndDate) {
              <p class="text-slate-gray mb-2">
                📅 {{ formatWeekRange(selectedList.weekStartDate, selectedList.weekEndDate) }}
              </p>
            }
            
            <!-- Barra de progreso -->
            <div class="flex items-center gap-3">
              <div class="flex-1">
                <div class="w-full bg-celadon rounded-full h-3">
                  <div 
                    class="bg-cambridge-blue h-3 rounded-full transition-all duration-500"
                    [style.width.%]="getListProgress(selectedList)"
                  ></div>
                </div>
              </div>
              <span class="text-base font-medium text-dark-purple">
                {{ getCheckedCount(selectedList) }}/{{ selectedList.items.length }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <!-- Lista de items -->
            <div class="space-y-3 mb-8">
              @for (item of selectedList.items; track $index) {
                <div 
                  class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 transition-all duration-300"
                  [class.bg-celadon]="item.checked"
                  [class.border-cambridge-blue]="item.checked"
                  [class.opacity-70]="item.checked"
                >
                  <input 
                    type="checkbox"
                    [checked]="item.checked"
                    (change)="toggleItem(selectedList, item)"
                    class="w-5 h-5 text-cambridge-blue bg-white border-slate-gray rounded focus:ring-cambridge-blue focus:ring-2 cursor-pointer"
                  >
                  <div class="flex-1">
                    <span 
                      class="font-medium text-dark-purple text-base"
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
                    (click)="removeItemFromList(selectedList, $index)"
                    class="text-error hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                  >
                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              }
            </div>

            @if (selectedList.items.length === 0) {
              <div class="text-center py-12 text-slate-gray border-2 border-dashed border-slate-gray rounded-2xl">
                <lucide-icon [img]="ShoppingCartIcon" class="w-16 h-16 mx-auto mb-4 opacity-40"></lucide-icon>
                <p class="text-lg font-medium mb-2">No hay items en esta lista</p>
                <p class="text-base">Agrega algunos ingredientes para empezar</p>
              </div>
            }

            <!-- Agregar item manual -->
            <div class="pt-8 border-t border-gray-200">
              <h4 class="text-xl font-bold text-dark-purple mb-4">Añadir Item Manual</h4>
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
            <div class="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button 
                (click)="clearCheckedItems(selectedList)"
                class="btn-secondary inline-flex items-center justify-center gap-2 py-3 text-base"
                [disabled]="getCheckedCount(selectedList) === 0"
              >
                <lucide-icon [img]="CheckCircleIcon" class="w-5 h-5"></lucide-icon>
                Limpiar Marcados
              </button>
              <button 
                (click)="exportListAsText(selectedList)"
                class="btn-secondary inline-flex items-center justify-center gap-2 py-3 text-base"
              >
                <lucide-icon [img]="DownloadIcon" class="w-5 h-5"></lucide-icon>
                Exportar Texto
              </button>
              <button 
                (click)="exportListAsPDF(selectedList)"
                class="btn-secondary inline-flex items-center justify-center gap-2 py-3 text-base"
              >
                <lucide-icon [img]="FileTextIcon" class="w-5 h-5"></lucide-icon>
                Exportar PDF
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
        </div>
      </div>
    }
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ShoppingListComponent implements OnInit {
  allShoppingLists: ShoppingList[] = [];
  selectedList: ShoppingList | null = null;
  filterView: 'all' | 'weekly' | 'manual' = 'all';
  
  isLoading = true;
  isSaving = false;
  
  newItemName = '';
  newItemQuantity: number | null = null;
  newItemUnit = 'g';

  // Iconos
  readonly ShareIcon = Share2;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly SaveIcon = Save;
  readonly CheckCircleIcon = CheckCircle;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly LightbulbIcon = Lightbulb;
  readonly DownloadIcon = Download;
  readonly CalendarIcon = Calendar;
  readonly PackageIcon = Package;
  readonly XIcon = X;
  readonly FileTextIcon = Save; // Puedes cambiar este icono por uno de PDF

  constructor(
    private shoppingListService: ShoppingListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllShoppingLists();
  }

  loadAllShoppingLists(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.isLoading = false;
      return;
    }

    this.shoppingListService.getShoppingListsByUser(currentUser.id).subscribe({
      next: (lists) => {
        this.allShoppingLists = lists
          .sort((a, b) => {
            return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
          });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando listas:', error);
        this.isLoading = false;
      }
    });
  }

  getFilteredLists(): ShoppingList[] {
    switch (this.filterView) {
      case 'weekly':
        return this.getWeeklyLists();
      case 'manual':
        return this.getManualLists();
      default:
        return this.allShoppingLists;
    }
  }

  getWeeklyLists(): ShoppingList[] {
    return this.allShoppingLists.filter(list => 
      list.weekStartDate && list.weekEndDate
    );
  }

  getManualLists(): ShoppingList[] {
    return this.allShoppingLists.filter(list => 
      !list.weekStartDate && !list.weekEndDate
    );
  }

  getListTitle(list: ShoppingList): string {
    if (list.title) {
      return list.title;
    }
    if (list.weekStartDate && list.weekEndDate) {
      return `Semana ${this.getWeekNumber(list.weekStartDate)}`;
    }
    return `Lista #${list.id}`;
  }

  getWeekNumber(dateString: string): number {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  formatWeekRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startMonth = startDate.toLocaleDateString('es-ES', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('es-ES', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startDate.getDate()} - ${endDate.getDate()} ${startMonth}`;
    } else {
      return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth}`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }

  getListProgress(list: ShoppingList): number {
    if (list.items.length === 0) return 0;
    return (this.getCheckedCount(list) / list.items.length) * 100;
  }

  getCheckedCount(list: ShoppingList): number {
    return list.items.filter(item => item.checked).length;
  }

  toggleItem(list: ShoppingList, item: ShoppingItem): void {
    item.checked = !item.checked;
    this.autoSaveList(list);
  }

  autoSaveList(list: ShoppingList): void {
    this.shoppingListService.updateShoppingList(list.id, list).subscribe({
      next: (updatedList) => {
        // Actualizar en el array
        const index = this.allShoppingLists.findIndex(l => l.id === list.id);
        if (index !== -1) {
          this.allShoppingLists[index] = updatedList;
        }
        if (this.selectedList?.id === list.id) {
          this.selectedList = updatedList;
        }
      },
      error: (error) => {
        console.error('Error guardando lista:', error);
      }
    });
  }

  viewList(list: ShoppingList): void {
    this.selectedList = { ...list };
  }

  closeDetailView(): void {
    this.selectedList = null;
    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemUnit = 'g';
  }

  createNewList(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const newList: ShoppingListCreateDTO = {
      userId: currentUser.id,
      title: `Lista ${new Date().toLocaleDateString()}`,
      items: []
    };

    this.shoppingListService.createShoppingList(newList).subscribe({
      next: (list) => {
        this.allShoppingLists.unshift(list);
        this.viewList(list);
      },
      error: (error) => {
        console.error('Error creando lista:', error);
        alert('Error al crear lista de compra');
      }
    });
  }

  addManualItem(): void {
    if (!this.selectedList || !this.newItemName.trim() || !this.newItemQuantity) {
      return;
    }

    const newItem: ShoppingItem = {
      name: this.newItemName.trim(),
      quantity: this.newItemQuantity,
      unit: this.newItemUnit,
      checked: false
    };

    this.selectedList.items.push(newItem);
    
    // Limpiar campos
    this.newItemName = '';
    this.newItemQuantity = null;
    this.newItemUnit = 'g';

    // Auto-guardar
    this.saveList();
  }

  removeItemFromList(list: ShoppingList, index: number): void {
    const confirmed = confirm('¿Quitar este item de la lista?');
    if (confirmed) {
      list.items.splice(index, 1);
      this.saveList();
    }
  }

  clearCheckedItems(list: ShoppingList): void {
    const confirmed = confirm('¿Eliminar todos los items marcados?');
    if (confirmed) {
      list.items = list.items.filter(item => !item.checked);
      this.saveList();
    }
  }

  saveList(): void {
    if (!this.selectedList || this.isSaving) return;

    this.isSaving = true;

    this.shoppingListService.updateShoppingList(this.selectedList.id, this.selectedList).subscribe({
      next: (updatedList) => {
        // Actualizar en el array
        const index = this.allShoppingLists.findIndex(l => l.id === this.selectedList!.id);
        if (index !== -1) {
          this.allShoppingLists[index] = updatedList;
        }
        this.selectedList = updatedList;
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error guardando lista:', error);
        this.isSaving = false;
        alert('Error al guardar la lista');
      }
    });
  }

  deleteList(id: number): void {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar esta lista?');
    if (!confirmed) return;

    this.shoppingListService.deleteShoppingList(id).subscribe({
      next: () => {
        this.allShoppingLists = this.allShoppingLists.filter(l => l.id !== id);
        if (this.selectedList?.id === id) {
          this.closeDetailView();
        }
      },
      error: (error) => {
        console.error('Error eliminando lista:', error);
        alert('Error al eliminar la lista');
      }
    });
  }

  exportListAsText(list: ShoppingList): void {
    const listText = `📋 ${this.getListTitle(list)} - MealMate\n\n` +
      (list.weekStartDate && list.weekEndDate 
        ? `📅 Semana: ${this.formatWeekRange(list.weekStartDate, list.weekEndDate)}\n\n`
        : '') +
      list.items
        .map(item => `${item.checked ? '✅' : '☐'} ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n');

    // Crear blob y descargar
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compra-${list.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportListAsPDF(list: ShoppingList): void {
    // Implementación básica de PDF - puedes usar una librería como jspdf
    this.generatePDF(list);
  }

  private generatePDF(list: ShoppingList): void {
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.getListTitle(list)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .item { margin: 5px 0; }
          .checked { text-decoration: line-through; color: #888; }
          .section { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${this.getListTitle(list)}</h1>
          ${list.weekStartDate && list.weekEndDate ? 
            `<p>Semana: ${this.formatWeekRange(list.weekStartDate, list.weekEndDate)}</p>` : ''}
          <p>Generado: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
          <h2>Ingredientes (${list.items.length})</h2>
          ${list.items.map(item => `
            <div class="item ${item.checked ? 'checked' : ''}">
              ${item.checked ? '✅' : '☐'} ${item.name} - ${item.quantity} ${item.unit}
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <p><strong>Progreso:</strong> ${this.getCheckedCount(list)}/${list.items.length} items</p>
        </div>
      </body>
      </html>
    `;

    // Abrir ventana para imprimir/guardar como PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  shareList(list: ShoppingList): void {
    const listText = `📋 ${this.getListTitle(list)} - MealMate\n\n` +
      (list.weekStartDate && list.weekEndDate 
        ? `📅 ${this.formatWeekRange(list.weekStartDate, list.weekEndDate)}\n\n`
        : '') +
      list.items
        .map(item => `${item.checked ? '✅' : '☐'} ${item.name} - ${item.quantity} ${item.unit}`)
        .join('\n');

    navigator.clipboard.writeText(listText).then(() => {
      alert('¡Lista copiada al portapapeles!');
    });
  }
}