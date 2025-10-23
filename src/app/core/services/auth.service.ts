import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '../../models/social.model';
import { User, UserCreateDTO } from '../../models/user.model';

/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN
 * ============================================
 * 
 * ¿Qué es un servicio?
 * - Es una clase que contiene lógica reutilizable
 * - Se puede inyectar en cualquier componente
 * - @Injectable() permite que Angular lo gestione
 * 
 * ¿Qué hace este servicio?
 * - Maneja login/logout
 * - Guarda el token JWT en localStorage
 * - Mantiene el estado del usuario actual
 */

@Injectable({
  providedIn: 'root' // Significa que es un singleton (una sola instancia en toda la app)
})
export class AuthService {
  // URL base de tu backend
  private apiUrl = 'http://localhost:8080/api/v1';
  
  // BehaviorSubject es como una variable que notifica a todos cuando cambia
  // Empieza con null (no hay usuario logueado)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Observable que los componentes pueden "suscribirse" para recibir actualizaciones
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,  // Para hacer peticiones HTTP
    private router: Router     // Para navegar entre páginas
  ) {
    // Al iniciar, verificar si hay un usuario guardado
    this.loadUserFromStorage();
  }

  /**
   * Cargar usuario desde localStorage al iniciar la app
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * LOGIN - Iniciar sesión
   * @param credentials - email y password
   * @returns Observable con la respuesta del servidor
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // tap() ejecuta código sin modificar la respuesta
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Actualizar el estado del usuario actual
          this.currentUserSubject.next(response.user);
        })
      );
  }

  /**
   * REGISTER - Registrar nuevo usuario
   */
  register(userData: UserCreateDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  /**
   * LOGOUT - Cerrar sesión
   */
  logout(): void {
    // Limpiar todo
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
