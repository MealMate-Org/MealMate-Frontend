import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserPreference, Diet } from '../../models/user.model';
import { Allergen } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // ⚠️ CAMBIAR ESTA URL SI TU BACKEND ESTÁ EN OTRO PUERTO/DOMINIO
  private readonly BASE_URL = 'http://localhost:8080/api/v1';
  
  private apiUrl = `${this.BASE_URL}/users`;
  private preferencesUrl = `${this.BASE_URL}/user-preferences`;
  private dietsUrl = `${this.BASE_URL}/diets`;
  private userAllergensUrl = `${this.BASE_URL}/user-allergens`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Preferencias
  getUserPreferences(userId: number): Observable<UserPreference> {
    return this.http.get<UserPreference>(`${this.preferencesUrl}/${userId}`);
  }

  saveUserPreferences(preferences: UserPreference): Observable<UserPreference> {
    return this.http.post<UserPreference>(this.preferencesUrl, preferences);
  }

  deleteUserPreferences(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.preferencesUrl}/${userId}`);
  }

  // Dietas
  getAllDiets(): Observable<Diet[]> {
    return this.http.get<Diet[]>(this.dietsUrl);
  }

  // Alérgenos de usuario
  getUserAllergens(userId: number): Observable<Allergen[]> {
    return this.http.get<Allergen[]>(`${this.userAllergensUrl}/${userId}`);
  }

  saveUserAllergens(userId: number, allergenIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.userAllergensUrl}/${userId}`, allergenIds);
  }

  deleteUserAllergens(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.userAllergensUrl}/${userId}`);
  }
}