import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserPreference, Diet } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  getUserPreferences(userId: number): Observable<UserPreference> {
    return this.http.get<UserPreference>(`${this.apiUrl}/user-preferences/${userId}`);
  }

  saveUserPreferences(preferences: UserPreference): Observable<UserPreference> {
    return this.http.post<UserPreference>(`${this.apiUrl}/user-preferences`, preferences);
  }

  deleteUserPreferences(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user-preferences/${userId}`);
  }

  getAllDiets(): Observable<Diet[]> {
    return this.http.get<Diet[]>(`${this.apiUrl}/diets`);
  }
}
