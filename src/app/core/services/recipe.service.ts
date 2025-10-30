import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipeCreateDTO, NutritionInfo, Allergen } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
  }

  // ✅ NUEVO MÉTODO
  getRecipesByAuthor(authorId: number): Observable<Recipe[]> {
    const params = new HttpParams().set('authorId', authorId.toString());
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`, { params });
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/recipes/${id}`);
  }

  createRecipe(recipe: RecipeCreateDTO): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/recipes`, recipe);
  }

  updateRecipe(id: number, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/recipes/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipes/${id}`);
  }

  searchRecipes(searchTerm: string, filters?: any): Observable<Recipe[]> {
    let params = new HttpParams().set('search', searchTerm);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`, { params });
  }

  getNutritionInfo(recipeId: number): Observable<NutritionInfo> {
    return this.http.get<NutritionInfo>(`${this.apiUrl}/nutrition-info/${recipeId}`);
  }

  saveNutritionInfo(nutritionInfo: NutritionInfo): Observable<NutritionInfo> {
    return this.http.post<NutritionInfo>(`${this.apiUrl}/nutrition-info`, nutritionInfo);
  }

  getAllAllergens(): Observable<Allergen[]> {
    return this.http.get<Allergen[]>(`${this.apiUrl}/allergens`);
  }
}