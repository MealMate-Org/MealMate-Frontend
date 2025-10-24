import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  MealPlan, 
  MealPlanCreateDTO, 
  MealPlanItem, 
  MealPlanItemCreateDTO,
  MealType 
} from '../../models/planner.model';

/**
 * ============================================
 * SERVICIO DE PLANIFICADOR
 * ============================================
 * 
 * Maneja la planificación semanal de comidas:
 * - Crear y gestionar planes semanales
 * - Añadir/quitar recetas del plan
 * - Obtener tipos de comida (desayuno, comida, cena)
 */

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  // ============================================
  // MEAL PLANS (Planes semanales)
  // ============================================

  /**
   * Obtener todos los planes del usuario
   */
  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/meal-plans`);
  }

  /**
   * Obtener un plan específico
   */
  getMealPlanById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/meal-plans/${id}`);
  }

  /**
   * Crear nuevo plan semanal
   */
  createMealPlan(plan: MealPlanCreateDTO): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/meal-plans`, plan);
  }

  /**
   * Actualizar plan
   */
  updateMealPlan(id: number, plan: Partial<MealPlan>): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.apiUrl}/meal-plans/${id}`, plan);
  }

  /**
   * Eliminar plan
   */
  deleteMealPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meal-plans/${id}`);
  }

  // ============================================
  // MEAL PLAN ITEMS (Recetas asignadas a días/comidas)
  // ============================================

  /**
   * Obtener todos los items del plan
   */
  getAllMealPlanItems(): Observable<MealPlanItem[]> {
    return this.http.get<MealPlanItem[]>(`${this.apiUrl}/meal-plan-items`);
  }

  /**
   * Añadir receta al plan
   */
  addMealPlanItem(item: MealPlanItemCreateDTO): Observable<MealPlanItem> {
    return this.http.post<MealPlanItem>(`${this.apiUrl}/meal-plan-items`, item);
  }

  /**
   * Actualizar item del plan (cambiar día/hora)
   */
  updateMealPlanItem(id: number, item: Partial<MealPlanItem>): Observable<MealPlanItem> {
    return this.http.put<MealPlanItem>(`${this.apiUrl}/meal-plan-items/${id}`, item);
  }

  /**
   * Eliminar item del plan
   */
  deleteMealPlanItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meal-plan-items/${id}`);
  }

  // ============================================
  // MEAL TYPES (Desayuno, Comida, Cena, etc.)
  // ============================================

  /**
   * Obtener todos los tipos de comida
   */
  getAllMealTypes(): Observable<MealType[]> {
    return this.http.get<MealType[]>(`${this.apiUrl}/meal-types`);
  }
}
