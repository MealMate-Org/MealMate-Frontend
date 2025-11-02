import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'; // ← AÑADE ESTA IMPORTACIÓN
import { Rating, Favorite } from '../../models/social.model';
import { ShoppingList, ShoppingListCreateDTO } from '../../models/planner.model';

/**
 * ============================================
 * SERVICIO DE FAVORITOS
 * ============================================
 */

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8080/api/v1/favorites';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los favoritos del usuario
   */
  getAllFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  /**
   * Obtener favorito específico (verificar si existe)
   */
  getFavoriteById(userId: number, recipeId: number): Observable<Favorite | null> {
    return this.http.get<Favorite>(`${this.apiUrl}/${userId}/${recipeId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null); // Devuelve null en lugar de error
        }
        throw error; // Relanza otros errores
      })
    );
  }

  /**
   * Añadir receta a favoritos
   */
  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }

  /**
   * Quitar de favoritos
   */
  removeFavorite(userId: number, recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${recipeId}`);
  }
}

/**
 * ============================================
 * SERVICIO DE RATINGS (Valoraciones)
 * ============================================
 */

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/v1/ratings';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las valoraciones
   */
  getAllRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.apiUrl);
  }

  /**
   * Crear o actualizar valoración
   */
  rateRecipe(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating);
  }

  /**
   * Obtener valoración específica
   */
  getRating(recipeId: number, userId: number): Observable<Rating | null> {
    return this.http.get<Rating>(`${this.apiUrl}/${recipeId}/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null); // Devuelve null en lugar de error
        }
        throw error;
      })
    );
  }

  /**
   * Eliminar valoración
   */
  deleteRating(recipeId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/${userId}`);
  }
}

/**
 * ============================================
 * SERVICIO DE LISTA DE COMPRA
 * ============================================
 */

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private apiUrl = 'http://localhost:8080/api/v1/shopping-lists';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las listas de compra
   */
  getAllShoppingLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.apiUrl);
  }

  /**
   * Obtener lista específica
   */
  getShoppingListById(id: number): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva lista de compra
   */
  createShoppingList(list: ShoppingListCreateDTO): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.apiUrl, list);
  }

  /**
   * Actualizar lista (marcar items comprados, etc.)
   */
  updateShoppingList(id: number, list: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.apiUrl}/${id}`, list);
  }

  /**
   * Eliminar lista
   */
  deleteShoppingList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}