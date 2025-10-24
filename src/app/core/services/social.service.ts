import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupCreateDTO, GroupMember, Follow } from '../../models/social.model';

/**
 * ============================================
 * SERVICIO DE GRUPOS
 * ============================================
 * 
 * Maneja grupos colaborativos (hogares, familias, etc.)
 */

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8080/api/v1/groups';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los grupos
   */
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  /**
   * Obtener grupo por ID
   */
  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo grupo
   */
  createGroup(group: GroupCreateDTO): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  /**
   * Actualizar grupo
   */
  updateGroup(id: number, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, group);
  }

  /**
   * Eliminar grupo
   */
  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // MIEMBROS DEL GRUPO
  // ============================================

  /**
   * Obtener todos los miembros
   */
  getAllGroupMembers(): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.apiUrl}/members`);
  }

  /**
   * Añadir miembro al grupo
   */
  addGroupMember(member: GroupMember): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.apiUrl}/members`, member);
  }

  /**
   * Actualizar rol de miembro
   */
  updateGroupMember(groupId: number, userId: number, member: Partial<GroupMember>): Observable<GroupMember> {
    return this.http.put<GroupMember>(`${this.apiUrl}/members/${groupId}/${userId}`, member);
  }

  /**
   * Eliminar miembro del grupo
   */
  removeGroupMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/members/${groupId}/${userId}`);
  }
}

/**
 * ============================================
 * SERVICIO DE FOLLOWS (Seguir usuarios)
 * ============================================
 */

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'http://localhost:8080/api/v1/follows';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los follows
   */
  getAllFollows(): Observable<Follow[]> {
    return this.http.get<Follow[]>(this.apiUrl);
  }

  /**
   * Seguir a un usuario
   */
  followUser(follow: Follow): Observable<Follow> {
    return this.http.post<Follow>(this.apiUrl, follow);
  }

  /**
   * Dejar de seguir
   */
  unfollowUser(followerId: number, followingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${followerId}/${followingId}`);
  }

  /**
   * Verificar si sigue a un usuario
   */
  checkIfFollowing(followerId: number, followingId: number): Observable<Follow> {
    return this.http.get<Follow>(`${this.apiUrl}/${followerId}/${followingId}`);
  }
}
