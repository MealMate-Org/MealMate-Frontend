import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Rating, Favorite } from '../../models/social.model';
import { ShoppingList, ShoppingListCreateDTO } from '../../models/planner.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8080/api/v1/favorites';

  constructor(private http: HttpClient) {}

  getAllFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl);
  }

  getFavoriteById(userId: number, recipeId: number): Observable<Favorite | null> {
    return this.http.get<Favorite>(`${this.apiUrl}/${userId}/${recipeId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      })
    );
  }

  addFavorite(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>(this.apiUrl, favorite);
  }

  removeFavorite(userId: number, recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${recipeId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/v1/ratings';

  constructor(private http: HttpClient) {}

  getAllRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.apiUrl);
  }

  rateRecipe(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating);
  }

  getRating(recipeId: number, userId: number): Observable<Rating | null> {
    return this.http.get<Rating>(`${this.apiUrl}/${recipeId}/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      })
    );
  }

  deleteRating(recipeId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/${userId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private apiUrl = 'http://localhost:8080/api/v1/shopping-lists';

  constructor(private http: HttpClient) {}

  getAllShoppingLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.apiUrl);
  }

  getShoppingListsByUser(userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(`${this.apiUrl}/user/${userId}`);
  }

  getShoppingListById(id: number): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.apiUrl}/${id}`);
  }

  createShoppingList(list: ShoppingListCreateDTO): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.apiUrl, list);
  }

  updateShoppingList(id: number, list: ShoppingList): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.apiUrl}/${id}`, list);
  }

  deleteShoppingList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}