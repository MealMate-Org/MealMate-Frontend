import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  roleId: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  roleId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Cargar usuario del localStorage si existe
    const token = this.getToken();
    if (token) {
      const user = this.getUserFromStorage();
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  /**
   * Login - devuelve token y usuario
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Login exitoso:', response);
        this.setSession(response);
      })
    );
  }

  /**
   * Register - ahora usa /api/v1/auth/register y devuelve token
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Asegurar que roleId esté presente (por defecto 2 = USER)
    const registerData = {
      ...userData,
      roleId: userData.roleId || 2
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData).pipe(
      tap(response => {
        console.log('✅ Registro exitoso:', response);
        this.setSession(response);
      })
    );
  }

  /**
   * Guardar sesión (token y usuario)
   */
  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtener usuario del storage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}