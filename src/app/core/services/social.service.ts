import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupCreateDTO, GroupMember, Follow } from '../../models/social.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:8080/api/v1/groups';

  constructor(private http: HttpClient) {}

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  createGroup(group: GroupCreateDTO): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  updateGroup(id: number, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllGroupMembers(): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.apiUrl}/members`);
  }

  addGroupMember(member: GroupMember): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.apiUrl}/members`, member);
  }

  updateGroupMember(groupId: number, userId: number, member: Partial<GroupMember>): Observable<GroupMember> {
    return this.http.put<GroupMember>(`${this.apiUrl}/members/${groupId}/${userId}`, member);
  }

  removeGroupMember(groupId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/members/${groupId}/${userId}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = 'http://localhost:8080/api/v1/follows';

  constructor(private http: HttpClient) {}

  getAllFollows(): Observable<Follow[]> {
    return this.http.get<Follow[]>(this.apiUrl);
  }

  followUser(follow: Follow): Observable<Follow> {
    return this.http.post<Follow>(this.apiUrl, follow);
  }

  unfollowUser(followerId: number, followingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${followerId}/${followingId}`);
  }

  checkIfFollowing(followerId: number, followingId: number): Observable<Follow> {
    return this.http.get<Follow>(`${this.apiUrl}/${followerId}/${followingId}`);
  }
}
