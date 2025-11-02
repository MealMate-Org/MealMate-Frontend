import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
 * SERVICIO DE PLANIFICADOR CON PERSISTENCIA
 * ============================================
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

  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/meal-plans`);
  }

  getMealPlansByUserId(userId: number): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/meal-plans/user/${userId}`);
  }

  getMealPlanById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/meal-plans/${id}`);
  }

  /**
   * Obtener o crear plan para una semana específica
   */
  getOrCreateMealPlanForWeek(
    userId: number, 
    weekStart: string, 
    weekEnd: string
  ): Observable<MealPlan> {
    const params = new HttpParams()
      .set('weekStart', weekStart)
      .set('weekEnd', weekEnd);
    
    return this.http.get<MealPlan>(
      `${this.apiUrl}/meal-plans/user/${userId}/week`,
      { params }
    );
  }

  /**
   * Obtener plan activo para una fecha
   */
  getActiveMealPlanForDate(userId: number, date: string): Observable<MealPlan> {
    const params = new HttpParams().set('date', date);
    return this.http.get<MealPlan>(
      `${this.apiUrl}/meal-plans/user/${userId}/active`,
      { params }
    );
  }

  createMealPlan(plan: MealPlanCreateDTO): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/meal-plans`, plan);
  }

  updateMealPlan(id: number, plan: Partial<MealPlan>): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.apiUrl}/meal-plans/${id}`, plan);
  }

  deleteMealPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meal-plans/${id}`);
  }

  // ============================================
  // MEAL PLAN ITEMS (Recetas asignadas)
  // ============================================

  getAllMealPlanItems(): Observable<MealPlanItem[]> {
    return this.http.get<MealPlanItem[]>(`${this.apiUrl}/meal-plan-items`);
  }

  getItemsByMealPlanId(mealPlanId: number): Observable<MealPlanItem[]> {
    return this.http.get<MealPlanItem[]>(
      `${this.apiUrl}/meal-plan-items/meal-plan/${mealPlanId}`
    );
  }

  /**
   * Obtener items de un plan en un rango de fechas
   */
  getItemsByMealPlanAndDateRange(
    mealPlanId: number,
    startDate: string,
    endDate: string
  ): Observable<MealPlanItem[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<MealPlanItem[]>(
      `${this.apiUrl}/meal-plan-items/meal-plan/${mealPlanId}/date-range`,
      { params }
    );
  }

  /**
   * Obtener items de un usuario en un rango de fechas
   */
  getItemsByUserAndDateRange(
    userId: number,
    startDate: string,
    endDate: string
  ): Observable<MealPlanItem[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<MealPlanItem[]>(
      `${this.apiUrl}/meal-plan-items/user/${userId}/date-range`,
      { params }
    );
  }

  /**
   * Añadir receta al plan
   */
  addMealPlanItem(item: MealPlanItemCreateDTO): Observable<MealPlanItem> {
    return this.http.post<MealPlanItem>(`${this.apiUrl}/meal-plan-items`, item);
  }

  /**
   * Añadir múltiples items (batch)
   */
  addMealPlanItemsBatch(items: MealPlanItemCreateDTO[]): Observable<MealPlanItem[]> {
    return this.http.post<MealPlanItem[]>(`${this.apiUrl}/meal-plan-items/batch`, items);
  }

  updateMealPlanItem(id: number, item: Partial<MealPlanItem>): Observable<MealPlanItem> {
    return this.http.put<MealPlanItem>(`${this.apiUrl}/meal-plan-items/${id}`, item);
  }

  deleteMealPlanItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/meal-plan-items/${id}`);
  }

  /**
   * Eliminar item por detalles específicos
   */
  deleteMealPlanItemByDetails(
    mealPlanId: number,
    date: string,
    mealTypeId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/meal-plan-items/meal-plan/${mealPlanId}/date/${date}/meal-type/${mealTypeId}`
    );
  }

  // ============================================
  // MEAL TYPES (Desayuno, Comida, Cena, etc.)
  // ============================================

  getAllMealTypes(): Observable<MealType[]> {
    return this.http.get<MealType[]>(`${this.apiUrl}/meal-types`);
  }
}
